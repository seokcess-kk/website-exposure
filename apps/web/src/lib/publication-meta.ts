// @glitzy/web/lib/publication-meta — DOI/URL → Publication 메타 자동 추출
//
// 소스 우선순위:
//   1. DOI (직접 입력 또는 url 안 검출) → Crossref API (no key, free)
//   2. URL 안 PubMed ID 검출 → NCBI E-utilities esummary
//   3. Fallback → 일반 og:* meta scrape (cheerio)

import { fetchSiteMeta } from "./site-meta-fetch";

export type PublicationMeta = {
  title: string | null;
  authors: string[];  // ["Author A", "Author B"]
  journal: string | null;
  publishedDate: string | null;  // YYYY-MM-DD
  doi: string | null;
  pubmedId: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  summary: string | null;  // abstract first 300 chars
  source: "crossref" | "pubmed" | "og-scrape" | "none";
};

const FETCH_TIMEOUT_MS = 10_000;

// DOI regex — 표준: 10.<registrant>/<suffix> 형태
const DOI_REGEX = /\b(10\.\d{4,9}\/[^\s"'<>?#]+)/i;
const PUBMED_URL_REGEX = /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i;

function extractDoi(input: string): string | null {
  const m = input.match(DOI_REGEX);
  return m ? m[1]!.replace(/[.,;]+$/, "") : null;
}

function extractPubmedId(input: string): string | null {
  const m = input.match(PUBMED_URL_REGEX);
  return m ? m[1]! : null;
}

// === Crossref ===
async function fetchCrossref(doi: string): Promise<PublicationMeta | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { "User-Agent": "GlitzyWeb/0.1 (mailto:noreply@glitzy.kr)" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { message?: Record<string, unknown> };
    const m = json.message;
    if (!m) return null;

    const titleArr = m["title"];
    const title = Array.isArray(titleArr) && typeof titleArr[0] === "string" ? titleArr[0] : null;

    const authors: string[] = [];
    const authorArr = m["author"];
    if (Array.isArray(authorArr)) {
      for (const a of authorArr) {
        if (typeof a !== "object" || a === null) continue;
        const o = a as { given?: unknown; family?: unknown };
        const name = [o.given, o.family].filter((x): x is string => typeof x === "string").join(" ").trim();
        if (name) authors.push(name);
      }
    }

    const containerArr = m["container-title"];
    const journal = Array.isArray(containerArr) && typeof containerArr[0] === "string" ? containerArr[0] : null;

    // published-print | published-online | published 의 date-parts: [[YYYY, MM, DD]]
    let publishedDate: string | null = null;
    for (const k of ["published-print", "published-online", "published", "issued"]) {
      const p = m[k] as { "date-parts"?: unknown } | undefined;
      const dp = p?.["date-parts"];
      if (Array.isArray(dp) && Array.isArray(dp[0])) {
        const [y, mo, d] = dp[0] as [unknown, unknown, unknown];
        if (typeof y === "number") {
          publishedDate = `${y}-${String(typeof mo === "number" ? mo : 1).padStart(2, "0")}-${String(typeof d === "number" ? d : 1).padStart(2, "0")}`;
          break;
        }
      }
    }

    const abstract = typeof m["abstract"] === "string"
      ? (m["abstract"] as string).replace(/<[^>]+>/g, "").trim().slice(0, 300)
      : null;

    return {
      title,
      authors,
      journal,
      publishedDate,
      doi,
      pubmedId: null,
      url: `https://doi.org/${doi}`,
      thumbnailUrl: null,
      summary: abstract,
      source: "crossref",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// === PubMed ===
async function fetchPubmed(pmid: string): Promise<PublicationMeta | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`,
      { signal: controller.signal },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Record<string, unknown> };
    const r = json.result?.[pmid];
    if (!r || typeof r !== "object") return null;
    const o = r as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title : null;
    const authors: string[] = [];
    if (Array.isArray(o.authors)) {
      for (const a of o.authors) {
        if (typeof a === "object" && a !== null && typeof (a as { name?: unknown }).name === "string") {
          authors.push((a as { name: string }).name);
        }
      }
    }
    const journal = typeof o.source === "string" ? o.source : (typeof o.fulljournalname === "string" ? o.fulljournalname : null);
    const pubdate = typeof o.pubdate === "string" ? o.pubdate : null;
    // pubdate: "2024 Jun 15" 또는 "2024" → YYYY-MM-DD best-effort
    let publishedDate: string | null = null;
    if (pubdate) {
      const ymd = pubdate.match(/^(\d{4})(?:\s+(\w{3})(?:\s+(\d{1,2}))?)?/);
      if (ymd) {
        const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
        const mo = ymd[2] ? months[ymd[2]] ?? "01" : "01";
        const d = ymd[3] ?? "01";
        publishedDate = `${ymd[1]}-${mo}-${d.padStart(2, "0")}`;
      }
    }
    return {
      title,
      authors,
      journal,
      publishedDate,
      doi: null,
      pubmedId: pmid,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}`,
      thumbnailUrl: null,
      summary: null,
      source: "pubmed",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Public API — URL 또는 DOI/PMID 형태로 입력. 우선순위 매핑.
 */
export async function fetchPublicationMeta(input: string): Promise<PublicationMeta> {
  const trimmed = input.trim();
  if (!trimmed) return emptyMeta();

  // (1) DOI 직접 또는 URL 내 검출
  const doi = extractDoi(trimmed);
  if (doi) {
    const meta = await fetchCrossref(doi);
    if (meta) return meta;
  }

  // (2) PubMed URL
  const pmid = extractPubmedId(trimmed);
  if (pmid) {
    const meta = await fetchPubmed(pmid);
    if (meta) return meta;
  }

  // (3) Fallback — 일반 og:* + Google Scholar citation_* meta scrape (URL 만)
  //     citation_* 가 있는 학술지 사이트는 Crossref/PubMed 미등록 (한국 학술지 등) 도 cover.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const site = await fetchSiteMeta(trimmed);
      const c = site.citation;
      // citation meta 가 하나라도 있으면 citation-scrape 우선
      const hasCitation = c.title || c.authors.length > 0 || c.journal || c.doi;

      // citation 결과 + og:* fallback 결합
      const title = c.title ?? site.name;
      const authors = c.authors;
      const journal = c.journal ?? site.siteName;
      const publishedDate = c.publicationDate;
      const doi = c.doi;
      const summary = c.abstract
        ? c.abstract.slice(0, 300)
        : site.description
          ? site.description.slice(0, 300)
          : null;

      // citation 안 DOI 가 있고 Crossref 재시도 시 추가 정보 확보 가능
      if (doi && !title) {
        const meta = await fetchCrossref(doi);
        if (meta) return meta;
      }

      return {
        title,
        authors,
        journal,
        publishedDate,
        doi,
        pubmedId: null,
        url: site.resolvedUrl,
        thumbnailUrl: site.ogImageUrl,
        summary,
        source: hasCitation ? "og-scrape" : "og-scrape",
      };
    } catch {
      return emptyMeta();
    }
  }

  return emptyMeta();
}

function emptyMeta(): PublicationMeta {
  return {
    title: null, authors: [], journal: null, publishedDate: null,
    doi: null, pubmedId: null, url: null, thumbnailUrl: null,
    summary: null, source: "none",
  };
}
