// @glitzy/web/lib/site-meta-fetch — 외부 사이트 URL → meta scrape
// cycle7-8-code (URL scrape patch) v0.3:
//   - undici Agent connect.lookup override 로 매 connection lookup 결과 검증 → DNS rebinding TOCTOU 제거 (WEB-108)
//   - redirect manual + 매 hop normalizeAndValidateUrl + 5회 strict (off-by-one 제거 · WEB-112)
//   - URL userinfo 거부 (WEB-113)
//   - 스크랩된 asset URL 도 validateAssetUrl
//   - text/html only · 5MB body · 10s timeout

import { lookup as dnsLookup } from "node:dns/promises";
import { lookup as dnsLookupCb } from "node:dns";
import { load as loadHtml } from "cheerio";
import ipaddr from "ipaddr.js";
import { Agent } from "undici";

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

// cycle8 WEB-108: undici Agent connect.lookup override — 매 connection lookup 결과 검증 (TOCTOU 제거)
// Node 의 dns.lookup callback 시그니처 가변(2 또는 3 args) 처리를 위해 unsafe cast 사용 — 안전성은 isBlockedIp 로 보장
type LookupCb = (err: NodeJS.ErrnoException | null, address: string, family: number) => void;

function ssrfGuardLookup(hostname: string, _opts: unknown, callback: LookupCb): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dnsLookupCb as any)(hostname, { all: false }, (err: NodeJS.ErrnoException | null, address: string, family: number) => {
    if (err) {
      callback(err, "", 0);
      return;
    }
    if (isBlockedIp(address)) {
      callback(new Error(`blocked-host:${address}`) as NodeJS.ErrnoException, "", 0);
      return;
    }
    callback(null, address, family);
  });
}

const ssrfGuardAgent = new Agent({
  connect: {
    timeout: 5_000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lookup: ssrfGuardLookup as any,
  },
});

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
      res = await fetch(current.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "user-agent": "GlitzyAdmin/0.1 site-meta-fetch",
          accept: "text/html",
        },
        // cycle8 WEB-108: undici Agent — 매 connection lookup 검증 (TOCTOU 제거)
        // @ts-expect-error — Next.js fetch types 에 dispatcher 미정의 (undici 내부 지원)
        dispatcher: ssrfGuardAgent,
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

export async function fetchSiteMeta(input: string): Promise<SiteMeta> {
  const url = normalizeAndValidateUrl(input);
  const { body, finalUrl } = await fetchWithRedirects(url);
  const $ = loadHtml(body);

  const og = (prop: string) => $(`meta[property="og:${prop}"]`).attr("content");
  const tw = (prop: string) => $(`meta[name="twitter:${prop}"]`).attr("content");
  const meta = (name: string) => $(`meta[name="${name}"]`).attr("content");

  const title = pick(og("title"), tw("title"), $("title").first().text(), meta("application-name"));
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

  const [logoUrl, ogImageUrl] = await Promise.all([
    validateAssetUrl(finalUrl, iconCandidate),
    validateAssetUrl(finalUrl, ogImageCandidate),
  ]);

  return {
    name: title,
    description,
    logoUrl,
    ogImageUrl,
    themeColor,
    resolvedUrl: finalUrl.toString(),
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
