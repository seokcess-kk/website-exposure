// @glitzy/web/lib/site-tracking/server — MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 4·5
// /api/track 의 server-side helper. PIPA anonymized session_token + Origin allowlist + UA mini parser.

import crypto from "node:crypto";

import { slugForHost } from "../custom-domains";

// === session_token (§ 5.1) ===

/** Asia/Seoul TZ 기준 YYYY-MM-DD (en-CA locale 안정). */
export function formatKstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** PIPA 가명정보 정합 — sha256(instanceId | visitorSeed | dailySalt). dailySalt 는 KST 일자 derive. */
export function deriveSessionToken(input: {
  instanceId: string;
  visitorSeed: string;
  date: Date;
}): string {
  const secret = process.env.SESSION_SALT_SECRET;
  if (!secret) {
    throw new Error("SESSION_SALT_SECRET env required");
  }
  const kstYmd = formatKstDate(input.date);
  const dailySalt = crypto
    .createHash("sha256")
    .update(`${secret}|${kstYmd}`)
    .digest("hex");
  return crypto
    .createHash("sha256")
    .update(`${input.instanceId}|${input.visitorSeed}|${dailySalt}`)
    .digest("hex");
}

/** 첫 발사 시 server 안 즉시 발급 — 16 bytes hex (32자). */
export function generateVisitorSeed(): string {
  return crypto.randomBytes(16).toString("hex");
}

// === User-Agent · Referer 처리 (§ 4.2 · § 6.4) ===

/** Chrome/120 형식 family/major 만 추출. fingerprinting risk 회피. */
export function parseUserAgentFamily(ua: string | null | undefined): string | null {
  if (!ua) return null;
  const m = ua.match(/(Mobile Safari|Chrome|Edg|Firefox|Safari)\/(\d+)/);
  return m ? `${m[1]}/${m[2]}` : null;
}

/** Referer 의 host 만 추출. 자체사이트 (== requestHost) 또는 invalid → null. */
export function parseReferrerHost(referrer: string | null | undefined, requestHost: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (requestHost && url.host === requestHost) return null;
    return url.host;
  } catch {
    return null;
  }
}

/** utm_source normalize — lowercase + trim + [_\s]+ → "-". */
export function normalizeUtmSource(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed.toLowerCase().replace(/[_\s]+/g, "-");
}

// === Origin allowlist (§ 4.2.0) ===

export type OriginAllowlist = { hosts: string[]; wildcards: string[] };

export function parseOriginAllowlist(): OriginAllowlist {
  const raw = process.env.PUBLIC_SITE_ORIGIN || "";
  const extra = process.env.TRACK_ORIGIN_ALLOWLIST || "";
  const all = [raw, ...extra.split(",")].map((s) => s.trim()).filter(Boolean);
  const hosts: string[] = [];
  const wildcards: string[] = [];
  for (const entry of all) {
    let host: string;
    try {
      host = entry.startsWith("http") ? new URL(entry).host : entry;
    } catch {
      continue;
    }
    if (host.startsWith("*.")) wildcards.push(host.slice(2));
    else hosts.push(host);
  }
  // dev fallback — NODE_ENV='development' 안 PUBLIC_SITE_ORIGIN 미설정 시 localhost auto-allow
  if (hosts.length === 0 && wildcards.length === 0 && process.env.NODE_ENV === "development") {
    return { hosts: ["localhost:3000", "127.0.0.1:3000"], wildcards: [] };
  }
  return { hosts, wildcards };
}

export function isOriginAllowed(originHost: string, allowlist: OriginAllowlist): boolean {
  if (allowlist.hosts.includes(originHost)) return true;
  return allowlist.wildcards.some((suffix) => originHost === suffix || originHost.endsWith(`.${suffix}`));
}

// === rate limit (§ 4.4) ===
// in-memory Map — Vercel serverless cold start 시 reset. v1 안 동일 process 안 단기 spike 방지만.
// 분산 rate limit (Upstash) 합류는 MTL-DEFER-13.

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(instanceId: string, sessionToken: string, now = Date.now()): boolean {
  const key = `${instanceId}|${sessionToken}`;
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const arr = rateLimitMap.get(key) || [];
  const recent = arr.filter((t) => t > cutoff);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(key, recent);
    return false;
  }
  recent.push(now);
  rateLimitMap.set(key, recent);
  return true;
}

// === instance.slug 해석 (§ 4.2 step 2 + SUBDOMAIN_SCALE_PLAN SDS-00) ===

const SLUG_REGEX = /^\/([a-z0-9][a-z0-9-]{2,63})(\/|$)/;

export function extractSlugFromPagePath(pagePath: string): string | null {
  const m = pagePath.match(SLUG_REGEX);
  return m ? m[1] ?? null : null;
}

/**
 * SDS-00: instance slug 해석 — 커스텀/파생 서브도메인 host 우선, page_path 첫 segment fallback.
 * 커스텀 도메인은 루트 기준으로 서빙되어 page_path 에 slug prefix 가 없다 — 첫 segment 파싱만으로는
 * "treatments" 등을 slug 로 오인해 이벤트가 silent drop 된다 (bupyeong 라이브 유실 실사고).
 * host 는 middleware 와 동일하게 x-forwarded-host ?? host 를 넘길 것.
 */
export function resolveTrackInstanceSlug(
  rawHost: string | null | undefined,
  pagePath: string,
): string | null {
  const fromHost = slugForHost(rawHost);
  if (fromHost) return fromHost;
  return extractSlugFromPagePath(pagePath);
}
