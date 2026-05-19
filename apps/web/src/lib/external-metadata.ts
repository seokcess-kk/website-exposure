// @glitzy/web/lib/external-metadata — ADMIN_UX_REDESIGN v1.0 § 12
// CrossRef · PubMed · YouTube 자동 메타 fetch helper.
//
// SSRF guard: hardcoded well-known endpoint 만 사용 — site-meta-fetch 안 DNS 우회 없이 안전.
// timeout 5초 · 응답 size 256KB cap · best-effort 실패 시 throw.

const TIMEOUT_MS = 5000;
const MAX_BYTES = 256 * 1024;

const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
const YOUTUBE_URL_REGEX = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

export type ExternalMetadataResult = {
  provider: "crossref" | "pubmed" | "youtube";
  title: string | null;
  authors: string[];
  journal: string | null;
  publishedDate: string | null;
  doi: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  channelName: string | null;
  summary: string | null;
};

export class ExternalMetadataError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "ExternalMetadataError";
  }
}

async function fetchWithTimeoutAndCap(url: string, init?: RequestInit): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) throw new ExternalMetadataError(`HTTP ${res.status}`, "http-error");
    const reader = res.body?.getReader();
    if (!reader) {
      const text = await res.text();
      if (text.length > MAX_BYTES) throw new ExternalMetadataError("응답이 너무 큽니다.", "response-too-large");
      return text;
    }
    let total = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel();
        throw new ExternalMetadataError("응답이 너무 큽니다.", "response-too-large");
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
  } finally {
    clearTimeout(timer);
  }
}

// === CrossRef (DOI → metadata) ===

export async function fetchCrossRefByDoi(doi: string): Promise<ExternalMetadataResult> {
  if (!DOI_REGEX.test(doi)) throw new ExternalMetadataError("DOI 형식 오류", "invalid-doi");
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const raw = await fetchWithTimeoutAndCap(url, {
    headers: { "User-Agent": "Glitzy-Website-Exposure/1.0 (mailto:contact@glitzy.kr)" },
  });
  const json = JSON.parse(raw) as { message?: {
    title?: string[];
    author?: Array<{ given?: string; family?: string }>;
    "container-title"?: string[];
    issued?: { "date-parts"?: number[][] };
    abstract?: string;
    URL?: string;
  } };
  const msg = json.message;
  if (!msg) throw new ExternalMetadataError("CrossRef 응답 구조 오류", "invalid-response");

  const authors = (msg.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(" ").trim()).filter((s) => s.length > 0);
  const dateParts = msg.issued?.["date-parts"]?.[0];
  const publishedDate = dateParts && dateParts.length >= 1
    ? `${String(dateParts[0]).padStart(4, "0")}-${String(dateParts[1] ?? 1).padStart(2, "0")}-${String(dateParts[2] ?? 1).padStart(2, "0")}`
    : null;

  return {
    provider: "crossref",
    title: msg.title?.[0] ?? null,
    authors,
    journal: msg["container-title"]?.[0] ?? null,
    publishedDate,
    doi,
    url: msg.URL ?? null,
    thumbnailUrl: null,
    durationSeconds: null,
    channelName: null,
    summary: msg.abstract ? stripHtml(msg.abstract).slice(0, 500) : null,
  };
}

// === PubMed (PMID → metadata) ===

export async function fetchPubMedById(pmid: string): Promise<ExternalMetadataResult> {
  if (!PUBMED_ID_REGEX.test(pmid)) throw new ExternalMetadataError("PMID 형식 오류 (1~9자리)", "invalid-pmid");
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
  const raw = await fetchWithTimeoutAndCap(url, {
    headers: { "User-Agent": "Glitzy-Website-Exposure/1.0 (mailto:contact@glitzy.kr)" },
  });
  const json = JSON.parse(raw) as { result?: Record<string, unknown> };
  const result = json.result;
  if (!result) throw new ExternalMetadataError("PubMed 응답 구조 오류", "invalid-response");
  const entry = result[pmid] as
    | undefined
    | {
        title?: string;
        authors?: Array<{ name?: string }>;
        fulljournalname?: string;
        pubdate?: string;
        elocationid?: string;
      };
  if (!entry) throw new ExternalMetadataError("PMID 안 결과 없음", "not-found");

  const authors = (entry.authors ?? []).map((a) => (a.name ?? "").trim()).filter((s) => s.length > 0);
  const publishedDate = parsePubMedDate(entry.pubdate);

  return {
    provider: "pubmed",
    title: entry.title ?? null,
    authors,
    journal: entry.fulljournalname ?? null,
    publishedDate,
    doi: extractDoiFromElocation(entry.elocationid ?? ""),
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    thumbnailUrl: null,
    durationSeconds: null,
    channelName: null,
    summary: null,
  };
}

// === YouTube (URL → oEmbed) ===

export async function fetchYouTubeMeta(youtubeUrl: string): Promise<ExternalMetadataResult> {
  if (!YOUTUBE_URL_REGEX.test(youtubeUrl)) throw new ExternalMetadataError("YouTube URL 형식 오류", "invalid-url");
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
  const raw = await fetchWithTimeoutAndCap(url);
  const json = JSON.parse(raw) as {
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
    provider_name?: string;
  };

  return {
    provider: "youtube",
    title: json.title ?? null,
    authors: [],
    journal: null,
    publishedDate: null,
    doi: null,
    url: youtubeUrl,
    thumbnailUrl: json.thumbnail_url ?? null,
    durationSeconds: null,  // oEmbed 안 duration 제공 안 함
    channelName: json.author_name ?? null,
    summary: null,
  };
}

// === helper ===

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parsePubMedDate(pubdate: string | undefined): string | null {
  if (!pubdate) return null;
  // pubdate 형식: "2024 Jan 15" / "2024" / "2024 Jan" 등 다양
  const m = pubdate.match(/^(\d{4})(?:\s+(\w+))?(?:\s+(\d{1,2}))?/);
  if (!m) return null;
  const year = m[1]!;
  const monthName = m[2] ?? "Jan";
  const day = m[3] ?? "1";
  const MONTHS: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const mm = MONTHS[monthName.slice(0, 3)] ?? "01";
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function extractDoiFromElocation(elocation: string): string | null {
  const m = elocation.match(/10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+/);
  return m ? m[0] : null;
}
