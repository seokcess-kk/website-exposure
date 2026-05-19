// @glitzy/web/lib/site-url — request-aware site base URL helper
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
//
// PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
// PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
// 가 설정되어 있으면 우선. 없으면 request host fallback (dev/staging 한정).

import { headers } from "next/headers";

/**
 * Compute the v0.1 path-based site base URL for the current request.
 * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
 *     `http://localhost:3000/glitzy-clinic` (dev fallback)
 * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
 */
export function siteBaseUrl(instanceSlug: string): string {
  // PSRC-09: production trusted origin 우선 — Host header spoof 회피
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  }
  // dev/staging fallback — request host
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/${instanceSlug}`;
}

/**
 * Compute origin only (no instanceSlug suffix). For sitemap/robots sitemap URL.
 */
export function siteOrigin(): string {
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return trustedOrigin.replace(/\/$/, "");
  }
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
