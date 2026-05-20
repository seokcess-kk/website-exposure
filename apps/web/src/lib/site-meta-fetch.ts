// @glitzy/web/lib/site-meta-fetch — 외부 사이트 URL → meta scrape
// cycle7-8-code (URL scrape patch) v0.3:
//   - undici Agent connect.lookup override 로 매 connection lookup 결과 검증 → DNS rebinding TOCTOU 제거 (WEB-108)
//   - redirect manual + 매 hop normalizeAndValidateUrl + 5회 strict (off-by-one 제거 · WEB-112)
//   - URL userinfo 거부 (WEB-113)
//   - 스크랩된 asset URL 도 validateAssetUrl
//   - text/html only · 5MB body · 10s timeout

import { lookup as dnsLookup } from "node:dns/promises";
import { load as loadHtml } from "cheerio";
import ipaddr from "ipaddr.js";
import sharp from "sharp";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 5;

export type SiteMeta = {
  name: string | null;
  description: string | null;
  logoUrl: string | null;
  ogImageUrl: string | null;
  themeColor: string | null;
  resolvedUrl: string;
  // 확장 추출 (2026-05-19)
  /** og:site_name — name 보조 fallback */
  siteName: string | null;
  /** og:phone_number 또는 meta name="contact" — 전화 */
  phone: string | null;
  /** og:email — 이메일 */
  email: string | null;
  /** 한국어 주소 (시·도 + 시·군·구 + 도로명 + 번지) — regex 추출 best-effort */
  addressLine: string | null;
  /** 한국어 주소 안 시·도 (예: "서울특별시" · "인천광역시") */
  addressRegion: string | null;
  /** 한국어 주소 안 시·군·구 (예: "강남구" · "부평구") */
  addressLocality: string | null;
  /** 한국어 주소 안 도로명 + 번지 (예: "주부토로 17") */
  addressStreet: string | null;
  /** Brand 색상 추출 (Layer 1 · 2026-05-19) — logo · og:image · theme-color 안 dominant color */
  brand: {
    /** 가장 dominant 색상 (gray/near-white/near-black 제외 후 빈도 최상) */
    primaryHex: string | null;
    /** 두 번째 색상 (있다면) — accent 후보 */
    accentHex: string | null;
    /** 추출된 palette top 5 — 사용자 선택 후 override 가능 */
    palette: string[];
    /** 추출 source — 디버그용 (logo · ogImage · themeColor) */
    source: "logo" | "ogImage" | "themeColor" | "none";
  };
  /** Google Scholar 안 citation_* meta tag — 학술지·논문 사이트 (2026-05-20) */
  citation: {
    title: string | null;
    authors: string[];
    journal: string | null;
    publicationDate: string | null;  // YYYY-MM-DD (가능한 경우) 또는 원본
    doi: string | null;
    abstract: string | null;
  };
};

export type SiteMetaFetchCode =
  | "invalid-url"
  | "blocked-host"
  | "timeout"
  | "non-html"
  | "too-large"
  | "http-error"
  | "fetch-failed"
  | "too-many-redirects"
  | "dns-failed";

export class SiteMetaFetchError extends Error {
  constructor(public readonly code: SiteMetaFetchCode, message: string) {
    super(message);
    this.name = "SiteMetaFetchError";
  }
}

function isBlockedIp(addr: string): boolean {
  try {
    const ip = ipaddr.parse(addr);
    return ip.range() !== "unicast";
  } catch {
    return true;
  }
}

async function resolveAndAssertPublicHost(hostname: string): Promise<void> {
  if (ipaddr.isValid(hostname)) {
    if (isBlockedIp(hostname)) {
      throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소는 분석할 수 없습니다.");
    }
    return;
  }
  const stripped = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
  if (stripped !== hostname && ipaddr.isValid(stripped)) {
    if (isBlockedIp(stripped)) {
      throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소는 분석할 수 없습니다.");
    }
    return;
  }
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".lan") ||
    lower.endsWith(".localhost")
  ) {
    throw new SiteMetaFetchError("blocked-host", "내부 네트워크 호스트는 분석할 수 없습니다.");
  }
  let records: { address: string; family: number }[];
  try {
    records = await dnsLookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new SiteMetaFetchError("dns-failed", "호스트 이름을 해석할 수 없습니다.");
  }
  if (records.length === 0) {
    throw new SiteMetaFetchError("dns-failed", "호스트 이름을 해석할 수 없습니다.");
  }
  for (const r of records) {
    if (isBlockedIp(r.address)) {
      throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소로 해석되어 차단됩니다.");
    }
  }
}

// cycle8 WEB-108 (HOTFIX 2026-05-19): undici Agent connect.lookup override 제거.
// Node v22+ net 모듈 안 emitLookup 가 lookup callback signature 호환 안 됨 (ERR_INVALID_IP_ADDRESS: undefined).
// 사전 DNS guard (resolveAndAssertPublicHost) 만 적용 — DNS rebinding TOCTOU race window 잔존 risk marker
// (WEB-DEFER-XX 운영 정합 cascade · undici 안 SSRF guard 패턴 재설계 필요).

function normalizeAndValidateUrl(input: string): URL {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) {
    throw new SiteMetaFetchError("invalid-url", "URL 길이가 올바르지 않습니다.");
  }
  let withScheme = trimmed;
  if (!/^https?:\/\//i.test(withScheme)) {
    withScheme = `https://${withScheme}`;
  }
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new SiteMetaFetchError("invalid-url", "URL 형식이 올바르지 않습니다.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SiteMetaFetchError("invalid-url", "http/https URL 만 허용됩니다.");
  }
  // cycle8 WEB-113: URL userinfo 거부 (credentials leak 방지)
  if (url.username !== "" || url.password !== "") {
    throw new SiteMetaFetchError("invalid-url", "URL에 인증 정보를 포함할 수 없습니다.");
  }
  return url;
}

async function safeCancel(body: ReadableStream<Uint8Array> | null | undefined): Promise<void> {
  if (!body) return;
  try { await body.cancel(); } catch { /* noop */ }
}

async function fetchWithRedirects(initialUrl: URL): Promise<{ body: string; finalUrl: URL }> {
  let current = initialUrl;
  let redirectsFollowed = 0;
  while (true) {
    await resolveAndAssertPublicHost(current.hostname);
    // cycle9 WEB-116: timeout 을 header + body read 통합 deadline 으로 적용
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      // cycle8 WEB-108 (HOTFIX 2026-05-19): dispatcher 제거 — 사전 resolveAndAssertPublicHost 안 SSRF 1차 차단.
      // DNS rebinding TOCTOU risk 잔존 marker — WEB-DEFER-XX.
      res = await fetch(current.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "user-agent": "GlitzyAdmin/0.1 site-meta-fetch",
          accept: "text/html",
        },
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new SiteMetaFetchError("timeout", "응답 시간이 초과되었습니다.");
      }
      if (err instanceof Error && /blocked-host:/.test(err.message)) {
        throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소로 해석되어 차단됩니다.");
      }
      throw new SiteMetaFetchError("fetch-failed", "사이트 접근에 실패했습니다.");
    }

    try {
      if (res.status >= 300 && res.status < 400) {
        // cycle8 WEB-112: MAX_REDIRECTS strict — 5회 초과 시 즉시 차단
        if (redirectsFollowed >= MAX_REDIRECTS) {
          await safeCancel(res.body);
          throw new SiteMetaFetchError("too-many-redirects", "redirect 횟수가 한도를 초과했습니다.");
        }
        redirectsFollowed += 1;
        const location = res.headers.get("location");
        if (!location) {
          await safeCancel(res.body);
          throw new SiteMetaFetchError("http-error", "redirect Location 헤더가 없습니다.");
        }
        let next: URL;
        try {
          next = normalizeAndValidateUrl(new URL(location, current).toString());
        } catch (err) {
          await safeCancel(res.body);
          if (err instanceof SiteMetaFetchError) throw err;
          throw new SiteMetaFetchError("invalid-url", "redirect 대상 URL 형식 오류");
        }
        current = next;
        await safeCancel(res.body);
        clearTimeout(timeoutId);
        continue;
      }

      // cycle9 WEB-117: 실패 분기에도 body cancel cleanup
      if (!res.ok) {
        await safeCancel(res.body);
        throw new SiteMetaFetchError("http-error", "사이트가 비정상 응답을 반환했습니다.");
      }
      const ct = (res.headers.get("content-type") ?? "").toLowerCase();
      if (!ct.includes("text/html")) {
        await safeCancel(res.body);
        throw new SiteMetaFetchError("non-html", "HTML 응답이 아닙니다.");
      }
      const reader = res.body?.getReader();
      if (!reader) {
        throw new SiteMetaFetchError("fetch-failed", "응답 본문을 읽을 수 없습니다.");
      }
      const chunks: Uint8Array[] = [];
      let total = 0;
      // cycle9 WEB-116: body read 도 같은 controller deadline 안에서 실행
      //   AbortController 가 abort 되면 reader.read() 가 reject 되어 try-catch 가 잡음
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > MAX_BODY_BYTES) {
            await reader.cancel();
            throw new SiteMetaFetchError("too-large", "응답 본문이 5MB를 초과합니다.");
          }
          chunks.push(value);
        }
      } catch (readErr) {
        if (readErr instanceof SiteMetaFetchError) throw readErr;
        if (readErr instanceof Error && readErr.name === "AbortError") {
          await reader.cancel().catch(() => undefined);
          throw new SiteMetaFetchError("timeout", "응답 시간이 초과되었습니다.");
        }
        throw new SiteMetaFetchError("fetch-failed", "응답 본문 읽기에 실패했습니다.");
      }
      const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
      return { body: buf.toString("utf-8"), finalUrl: current };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function pick(...vals: Array<string | undefined | null>): string | null {
  for (const v of vals) {
    if (v && v.trim() !== "") return v.trim();
  }
  return null;
}

async function validateAssetUrl(base: URL, candidate: string | null): Promise<string | null> {
  if (!candidate) return null;
  let resolved: URL;
  try {
    resolved = new URL(candidate, base);
  } catch {
    return null;
  }
  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
  if (resolved.username !== "" || resolved.password !== "") return null;
  const final = resolved.toString();
  if (final.length > 2048) return null;
  try {
    await resolveAndAssertPublicHost(resolved.hostname);
  } catch {
    return null;
  }
  return final;
}

/**
 * 한국어 주소 regex parser — 시·도 + 시·군·구 + 도로명 + 번지 (best-effort).
 * 1단계: 광역시도 + 시군구 + 나머지 패턴.
 *   - 광역시도: "서울특별시"·"인천광역시"·"세종특별자치시"·"경기도"·"강원특별자치도"·"제주특별자치도" 등
 *   - 시군구: "강남구"·"부평구"·"수원시"·"성남시 분당구" (두 단어 가능)
 *   - 나머지: 도로명 + 번지
 *   - 본 함수는 HTML body 안 textContent 에서 첫 매칭만 반환 (footer 안 첫 주소).
 */
function extractKoreanAddress(text: string): { full: string; region: string; locality: string; street: string } | null {
  const REGION_PATTERNS = [
    "서울특별시", "서울시", "서울",
    "부산광역시", "부산시", "부산",
    "대구광역시", "대구시", "대구",
    "인천광역시", "인천시", "인천",
    "광주광역시", "광주시", "광주",
    "대전광역시", "대전시", "대전",
    "울산광역시", "울산시", "울산",
    "세종특별자치시", "세종시", "세종",
    "경기도", "경기",
    "강원특별자치도", "강원도", "강원",
    "충청북도", "충북",
    "충청남도", "충남",
    "전북특별자치도", "전라북도", "전북",
    "전라남도", "전남",
    "경상북도", "경북",
    "경상남도", "경남",
    "제주특별자치도", "제주도", "제주",
  ].sort((a, b) => b.length - a.length);  // 긴 패턴 우선 (서울특별시 > 서울시 > 서울)
  // 광역시도 다음 1~2 단어 시·군·구 (예: "부평구" 또는 "성남시 분당구")
  // 그 다음 도로명 (예: "주부토로", "테헤란로", "테스트길") 안 끝에 "로|길|대로" + 번지
  const regionAlt = REGION_PATTERNS.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  // 매칭 패턴: 광역시도 + space + 시·군·구 (1~2 단어, 끝에 시/군/구) + space + street (한글/숫자, 끝에 로/길/대로) + space + 번지(숫자[-숫자])
  const re = new RegExp(
    `(${regionAlt})\\s+([가-힣]{1,10}(?:시|군|구)(?:\\s+[가-힣]{1,10}(?:시|군|구))?)\\s+([가-힣A-Za-z0-9]{1,20}(?:로|길|대로))\\s+([0-9]{1,5}(?:-[0-9]{1,5})?)`,
    "u",
  );
  const m = text.match(re);
  if (!m) return null;
  const [full, region, locality, road, bunji] = m;
  return {
    full: full!.trim(),
    region: region!.trim(),
    locality: locality!.trim(),
    street: `${road} ${bunji}`,
  };
}

/**
 * extractBrandColorsFromImage — Layer 1 (2026-05-19).
 * image URL fetch → sharp 안 raw RGBA → 80x80 resize → gray/near-white/near-black filter → 32-step
 * quantization → top 5 색상 빈도 정렬 → primary/accent 결정.
 *
 * 색상 필터 정책:
 *   - alpha < 200 (반투명) 제외
 *   - saturation < 0.12 (회색) 제외
 *   - lightness < 0.15 또는 > 0.92 (near-black · near-white) 제외
 *
 * 안전: image 자체는 이미 validateAssetUrl 통과한 URL (HTTPS · 내부망 차단). 5MB 이하.
 */
async function extractBrandColorsFromImage(imageUrl: string): Promise<{ primaryHex: string; accentHex: string | null; palette: string[] } | null> {
  let buf: Buffer;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch(imageUrl, { signal: ctrl.signal, redirect: "follow" });
    clearTimeout(tid);
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    if (!ct.startsWith("image/")) return null;
    const ab = await res.arrayBuffer();
    if (ab.byteLength > 5 * 1024 * 1024) return null;
    buf = Buffer.from(ab);
  } catch {
    return null;
  }

  let raw: { data: Buffer; info: sharp.OutputInfo };
  try {
    raw = await sharp(buf)
      .resize(80, 80, { fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
  } catch {
    return null;
  }

  const { data } = raw;
  const buckets = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const a = data[i + 3]!;
    if (a < 200) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (sat < 0.12) continue;
    const lightness = (max + min) / 2 / 255;
    if (lightness < 0.15 || lightness > 0.92) continue;
    // 32-step quantization (각 채널 4-bit precision)
    const qr = (r >> 4) << 4;
    const qg = (g >> 4) << 4;
    const qb = (b >> 4) << 4;
    const hex = `#${qr.toString(16).padStart(2, "0")}${qg.toString(16).padStart(2, "0")}${qb.toString(16).padStart(2, "0")}`;
    buckets.set(hex, (buckets.get(hex) ?? 0) + 1);
  }
  if (buckets.size === 0) return null;

  const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const palette = sorted.map(([hex]) => hex);
  const primaryHex = palette[0]!;

  // accent — palette 안 hue 차이 > 30° 첫 색상 (대조 강한 것 선호). 없으면 palette[1].
  const primaryHue = rgbToHue(primaryHex);
  let accentHex: string | null = null;
  for (const hex of palette.slice(1)) {
    const hue = rgbToHue(hex);
    if (primaryHue !== null && hue !== null && Math.abs(hue - primaryHue) > 30) {
      accentHex = hex;
      break;
    }
  }
  accentHex = accentHex ?? palette[1] ?? null;
  return { primaryHex, accentHex, palette };
}

/** hex (#RRGGBB) → HSL hue (0~360) · gray 시 null */
function rgbToHue(hex: string): number | null {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  const r = parseInt(m[1]!, 16) / 255;
  const g = parseInt(m[2]!, 16) / 255;
  const b = parseInt(m[3]!, 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return null;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  return h < 0 ? h + 360 : h;
}

export async function fetchSiteMeta(input: string): Promise<SiteMeta> {
  const url = normalizeAndValidateUrl(input);
  const { body, finalUrl } = await fetchWithRedirects(url);
  const $ = loadHtml(body);

  const og = (prop: string) => $(`meta[property="og:${prop}"]`).attr("content");
  const tw = (prop: string) => $(`meta[name="twitter:${prop}"]`).attr("content");
  const meta = (name: string) => $(`meta[name="${name}"]`).attr("content");

  // name 후보 chain — og:title 우선 → og:site_name → twitter:title → <title> → application-name
  const title = pick(og("title"), og("site_name"), tw("title"), $("title").first().text(), meta("application-name"));
  const siteName = pick(og("site_name"), meta("application-name"));
  const description = pick(og("description"), tw("description"), meta("description"));
  const ogImageCandidate = pick(og("image:secure_url"), og("image"), tw("image"));
  const iconCandidate = pick(
    $('link[rel="apple-touch-icon"]').attr("href"),
    $('link[rel="icon"][sizes]').first().attr("href"),
    $('link[rel="shortcut icon"]').attr("href"),
    $('link[rel="icon"]').first().attr("href"),
    $('link[rel="mask-icon"]').attr("href"),
  );
  const themeColor = pick(meta("theme-color"));
  // OpenGraph 확장 + meta tag fallback
  const phone = pick(og("phone_number"), meta("phone"), meta("contact"));
  const email = pick(og("email"), meta("email"));

  // === Google Scholar citation_* meta tag (학술지·논문 사이트) ===
  // 사용자 검수 2026-05-20 — Crossref/PubMed 미등록 학술지 (한국 학술지 등) 안 fallback
  const citationAuthors: string[] = [];
  $('meta[name="citation_author"], meta[name="citation_authors"]').each((_, el) => {
    const v = $(el).attr("content");
    if (typeof v === "string" && v.trim()) {
      // citation_authors 안 단일 meta tag 안 "Author1; Author2" 형식 가능
      for (const a of v.split(/[;,]/).map((x) => x.trim()).filter(Boolean)) {
        if (!citationAuthors.includes(a)) citationAuthors.push(a);
      }
    }
  });
  const citationPublicationDate = pick(
    meta("citation_publication_date"),
    meta("citation_date"),
    meta("citation_online_date"),
  );
  // citation_publication_date 안 보통 "YYYY/MM/DD" 또는 "YYYY" 형식 → YYYY-MM-DD 변환 best-effort
  let normalizedCitationDate: string | null = null;
  if (citationPublicationDate) {
    const m = citationPublicationDate.match(/^(\d{4})(?:[\/.-](\d{1,2})(?:[\/.-](\d{1,2}))?)?/);
    if (m) {
      const [, y, mo, d] = m;
      normalizedCitationDate = `${y}-${(mo ?? "01").padStart(2, "0")}-${(d ?? "01").padStart(2, "0")}`;
    } else {
      normalizedCitationDate = citationPublicationDate;
    }
  }
  const citation: SiteMeta["citation"] = {
    title: pick(meta("citation_title")),
    authors: citationAuthors,
    journal: pick(meta("citation_journal_title"), meta("citation_journal_abbrev")),
    publicationDate: normalizedCitationDate,
    doi: pick(meta("citation_doi")),
    abstract: pick(meta("citation_abstract"), meta("DC.Description"), meta("dc.description")),
  };

  // 한국어 주소 regex 추출 — body text 안에서 first match
  // cheerio 안 script/style 제외 textContent
  $("script, style, noscript").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ");
  const addrParts = extractKoreanAddress(bodyText);

  const [logoUrl, ogImageUrl] = await Promise.all([
    validateAssetUrl(finalUrl, iconCandidate),
    validateAssetUrl(finalUrl, ogImageCandidate),
  ]);

  // Brand 색상 추출 (Layer 1) — logo > ogImage > themeColor 우선순위. 첫 추출 success 시 종료.
  let brand: SiteMeta["brand"] = { primaryHex: null, accentHex: null, palette: [], source: "none" };
  for (const [src, url] of [["logo", logoUrl], ["ogImage", ogImageUrl]] as const) {
    if (!url) continue;
    const colors = await extractBrandColorsFromImage(url);
    if (colors && colors.palette.length > 0) {
      brand = { primaryHex: colors.primaryHex, accentHex: colors.accentHex, palette: colors.palette, source: src };
      break;
    }
  }
  // theme-color fallback (logo·ogImage 추출 실패 시 만)
  if (brand.source === "none" && themeColor && /^#[0-9a-f]{6}$/i.test(themeColor)) {
    brand = { primaryHex: themeColor.toLowerCase(), accentHex: null, palette: [themeColor.toLowerCase()], source: "themeColor" };
  }

  return {
    name: title,
    description,
    logoUrl,
    ogImageUrl,
    themeColor,
    resolvedUrl: finalUrl.toString(),
    siteName,
    phone,
    email,
    addressLine: addrParts?.full ?? null,
    addressRegion: addrParts?.region ?? null,
    addressLocality: addrParts?.locality ?? null,
    addressStreet: addrParts?.street ?? null,
    brand,
    citation,
  };
}

/** audit payload sanitize — userinfo/query/fragment 제거 (WEB-113·115)
 *  cycle9 WEB-115: scheme 없는 입력도 best-effort normalize + parse 실패 fallback 도 credentials/query 제거
 */
export function sanitizeUrlForAudit(input: string): string {
  const trimmed = input.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    u.username = "";
    u.password = "";
    u.search = "";
    u.hash = "";
    return u.toString().slice(0, 256);
  } catch {
    // fallback: '@' 앞 userinfo · '?' / '#' 뒤 query/fragment 제거
    const noUserInfo = trimmed.replace(/^[^/]*@/, "");
    const noQuery = noUserInfo.split("?")[0]!.split("#")[0]!;
    return noQuery.slice(0, 100);
  }
}
