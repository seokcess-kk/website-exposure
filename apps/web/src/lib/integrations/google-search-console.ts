// @glitzy/web/lib/integrations/google-search-console — Google Search Console API client.
// SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 3 — Service Account JWT + searchanalytics.query + pagination + 429 retry.
//
// SECURITY (cycle 1 #1 · § 5.3):
//   - Service Account private_key 는 모든 로그·diff·UI 에서 절대 노출 금지
//   - 에러 메시지에 token/key 포함 시 redact
//   - module-scope JWT cache 는 process 내부만 — 다른 instance 운영자가 공유 access token 사용
//     (Google 측 access token 은 SA 단위 — instance 별 격리 불필요)

import crypto from "node:crypto";
import { z } from "zod";

const GSC_BASE = "https://www.googleapis.com/webmasters/v3";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const FETCH_TIMEOUT_MS = 30_000;
const ROW_LIMIT = 25_000;
const MAX_RETRIES_429 = 3;
const RETRY_BACKOFF_MS = [1000, 2000, 4000];

// === JWT + access token cache ===

type TokenCache = { saEmail: string; accessToken: string; expiresAt: number };
let cachedToken: TokenCache | null = null;

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildSignedJwt(saEmail: string, privateKey: string): string {
  const header = base64UrlEncode(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(Buffer.from(JSON.stringify({
    iss: saEmail,
    scope: GSC_SCOPE,
    aud: OAUTH_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })));
  const data = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(data);
  signer.end();
  const signature = base64UrlEncode(signer.sign(privateKey));
  return `${data}.${signature}`;
}

async function exchangeJwtForAccessToken(jwt: string): Promise<{ accessToken: string; expiresIn: number }> {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(OAUTH_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: ctrl.signal,
    });
    if (!res.ok) {
      // SECURITY: response body 안 token 노출 위험 없음 (실패면 error description 만)
      const txt = await res.text();
      throw new GscApiError("auth-failed", `OAuth token exchange failed (${res.status}): ${txt.slice(0, 200)}`);
    }
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token || typeof json.expires_in !== "number") {
      throw new GscApiError("auth-failed", "OAuth response missing access_token / expires_in");
    }
    return { accessToken: json.access_token, expiresIn: json.expires_in };
  } finally {
    clearTimeout(timeout);
  }
}

async function getAccessToken(saEmail: string, privateKey: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.saEmail === saEmail && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.accessToken;
  }
  const jwt = buildSignedJwt(saEmail, privateKey);
  const { accessToken, expiresIn } = await exchangeJwtForAccessToken(jwt);
  cachedToken = { saEmail, accessToken, expiresAt: now + expiresIn * 1000 };
  return accessToken;
}

// === Errors ===

export type GscErrorCode =
  | "auth-failed"
  | "permission-denied"
  | "not-found"
  | "rate-limited"
  | "transient"
  | "invalid-response"
  | "timeout";

export class GscApiError extends Error {
  constructor(public readonly code: GscErrorCode, message: string, public readonly httpStatus?: number) {
    super(message);
    this.name = "GscApiError";
  }
}

// === searchanalytics.query ===

const gscRowSchema = z.object({
  keys: z.tuple([z.string(), z.string(), z.string()]),
  clicks: z.number().nonnegative(),
  impressions: z.number().nonnegative(),
  ctr: z.number().min(0).max(1),
  position: z.number().positive(),
});
const gscResponseSchema = z.object({
  rows: z.array(gscRowSchema).optional(),
});

export type GscRow = z.infer<typeof gscRowSchema>;

export type QueryAnalyticsParams = {
  saEmail: string;
  privateKey: string;
  siteUrl: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  startRow?: number;
};

export type QueryAnalyticsResult = {
  rows: GscRow[];
  hasMore: boolean;  // length >= ROW_LIMIT → 다음 페이지 가능
};

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= MAX_RETRIES_429; attempt += 1) {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      if (res.status === 429 || res.status === 503) {
        if (attempt === MAX_RETRIES_429) {
          throw new GscApiError("rate-limited", `Rate limited after ${MAX_RETRIES_429} retries`, res.status);
        }
        const wait = RETRY_BACKOFF_MS[attempt] ?? 4000;
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      return res;
    } catch (err) {
      if (err instanceof GscApiError) throw err;
      // AbortError (timeout) or network
      lastErr = err;
      if (attempt === MAX_RETRIES_429) {
        if ((err as { name?: string })?.name === "AbortError") {
          throw new GscApiError("timeout", `GSC request timed out after ${FETCH_TIMEOUT_MS}ms`);
        }
        throw new GscApiError("transient", `GSC fetch failed: ${String(err).slice(0, 200)}`);
      }
      const wait = RETRY_BACKOFF_MS[attempt] ?? 4000;
      await new Promise((r) => setTimeout(r, wait));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new GscApiError("transient", `Unexpected: ${String(lastErr).slice(0, 200)}`);
}

export async function queryAnalytics(params: QueryAnalyticsParams): Promise<QueryAnalyticsResult> {
  const accessToken = await getAccessToken(params.saEmail, params.privateKey);
  const url = `${GSC_BASE}/sites/${encodeURIComponent(params.siteUrl)}/searchAnalytics/query`;
  const body = JSON.stringify({
    startDate: params.startDate,
    endDate: params.endDate,
    dimensions: ["date", "page", "query"],
    rowLimit: ROW_LIMIT,
    startRow: params.startRow ?? 0,
  });
  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    const errMsg = `GSC ${res.status}: ${txt.slice(0, 200)}`;
    if (res.status === 401) {
      // access token 만료 → cache invalidate · 한 번만 자동 재시도
      cachedToken = null;
      throw new GscApiError("auth-failed", errMsg, res.status);
    }
    if (res.status === 403) throw new GscApiError("permission-denied", errMsg, res.status);
    if (res.status === 404) throw new GscApiError("not-found", errMsg, res.status);
    throw new GscApiError("transient", errMsg, res.status);
  }

  const rawJson = await res.json();
  const parsed = gscResponseSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new GscApiError("invalid-response", `GSC response invalid: ${parsed.error.message.slice(0, 200)}`);
  }
  const rows = parsed.data.rows ?? [];
  return { rows, hasMore: rows.length >= ROW_LIMIT };
}

// === property verify — sites.get (단계 1) ===

export type SitesGetResult = { permissionLevel: string | null; siteUrl: string };

export async function verifySiteAccess(params: {
  saEmail: string;
  privateKey: string;
  siteUrl: string;
}): Promise<SitesGetResult> {
  const accessToken = await getAccessToken(params.saEmail, params.privateKey);
  const url = `${GSC_BASE}/sites/${encodeURIComponent(params.siteUrl)}`;
  const res = await fetchWithRetry(url, {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    const errMsg = `sites.get ${res.status}: ${txt.slice(0, 200)}`;
    if (res.status === 401) {
      cachedToken = null;
      throw new GscApiError("auth-failed", errMsg, res.status);
    }
    if (res.status === 403) throw new GscApiError("permission-denied", errMsg, res.status);
    if (res.status === 404) throw new GscApiError("not-found", errMsg, res.status);
    throw new GscApiError("transient", errMsg, res.status);
  }
  const json = (await res.json()) as { permissionLevel?: string; siteUrl?: string };
  return { permissionLevel: json.permissionLevel ?? null, siteUrl: json.siteUrl ?? params.siteUrl };
}

// === property URL normalization (cycle 1 #6 · § 2.1.1) ===

/**
 * Search property URL 정규화 — DB unique key 안 일관성 확보.
 *
 * 규칙:
 *   - URL prefix property: `https://example.com/` (lowercase host · path trailing `/` 유지)
 *   - Domain property: `sc-domain:example.com` (lowercase · prefix 보존)
 *   - 빈 입력은 그대로 반환 (CHECK 가 잡음)
 *
 * @throws GscApiError("invalid-response") — 형식 자체가 잘못된 경우 (caller 가 잡아 friendly 메시지)
 */
export function normalizeSearchPropertyUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("sc-domain:")) {
    const host = trimmed.slice("sc-domain:".length).toLowerCase();
    return `sc-domain:${host}`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    let u: URL;
    try {
      u = new URL(trimmed);
    } catch {
      throw new GscApiError("invalid-response", `Invalid URL: ${trimmed.slice(0, 100)}`);
    }
    // GSC URL prefix property 는 always trailing slash · path 만 보존
    const path = u.pathname === "" ? "/" : u.pathname;
    return `${u.protocol}//${u.hostname.toLowerCase()}${u.port ? ":" + u.port : ""}${path}`;
  }
  throw new GscApiError("invalid-response", `Property URL must start with https:// or sc-domain: (got: ${trimmed.slice(0, 60)})`);
}

/** § 3.3 단계 2 — property_url 의 host 추출 (instance domain 매칭용). */
export function extractPropertyHost(propertyUrl: string): string {
  if (propertyUrl.startsWith("sc-domain:")) return propertyUrl.slice("sc-domain:".length).toLowerCase();
  try {
    return new URL(propertyUrl).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** 테스트용 — module-scope token cache reset */
export function __resetTokenCacheForTest(): void {
  cachedToken = null;
}
