// @glitzy/web/lib/site-url — request-aware site base URL helper
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 + PSR-DEFER-02 (커스텀 도메인 루트 매핑)
//
// PSRC-08: canonical/OpenGraph URL 은 항상 absolute URL.
// PSRC-09: Host/X-Forwarded spoof 회피 — env `PUBLIC_SITE_ORIGIN` 우선, 없으면 request host fallback.
// PSR-DEFER-02: request host 가 등록된 커스텀 도메인(CUSTOM_DOMAIN_MAP)이면 그 host 를 origin 으로
//   신뢰(env·allowlist 검증된 host 라 spoof 안전)하고 `/<slug>` 를 제거해 루트 기준 URL 생성.
//   → middleware rewrite 와 한 쌍으로 canonical·og·JSON-LD @id·sitemap·robots 가 모두 루트로 일치.

import { headers } from "next/headers";
import { isCustomDomainHost, normalizeHost, slugForHost } from "./custom-domains";

/** request 의 (정규화된) host + proto. */
function requestHostProto(): { host: string; proto: string; rawHost: string } {
  const h = headers();
  const rawHost = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return { host: normalizeHost(rawHost), proto, rawHost };
}

/**
 * Compute the path-based site base URL for the current request.
 * - 커스텀 도메인 루트 매핑: `https://bupyeong.key-mom.kr` (slug 없음)
 * - path-based (env 또는 request host): `https://<origin>/<slug>`
 */
export function siteBaseUrl(instanceSlug: string): string {
  const { host, proto, rawHost } = requestHostProto();
  // PSR-DEFER-02 — 이 host 가 instanceSlug 로 매핑된 커스텀 도메인이면 루트(slug 제거 · 정규화 host)
  if (isCustomDomainHost(rawHost) && slugForHost(rawHost) === instanceSlug) {
    return `${proto}://${host}`;
  }
  // PSRC-09: production trusted origin 우선 — Host spoof 회피
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  }
  // dev/staging fallback — raw request host (포트 유지)
  return `${proto}://${rawHost}/${instanceSlug}`;
}

/**
 * Compute origin only (no instanceSlug suffix). For sitemap/robots fallback.
 * 커스텀 도메인이면 그 host origin (slug 제거는 호출부가 siteBaseUrl 로 처리).
 */
export function siteOrigin(): string {
  const { host, proto, rawHost } = requestHostProto();
  if (isCustomDomainHost(rawHost)) {
    return `${proto}://${host}`;
  }
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return trustedOrigin.replace(/\/$/, "");
  }
  return `${proto}://${rawHost}`;
}
