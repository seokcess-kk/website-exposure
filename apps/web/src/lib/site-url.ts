// @glitzy/web/lib/site-url — canonical site base URL helper
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 + PSR-DEFER-02 (커스텀 도메인 루트 매핑)
//
// PSRC-08: canonical/OpenGraph URL 은 항상 absolute URL.
// PSRC-09: Host/X-Forwarded spoof 회피 — canonical 도메인은 env(CUSTOM_DOMAIN_MAP / PUBLIC_SITE_ORIGIN)에서 계산.
// PERF (2026-07-01): prod 에선 render 중 headers() 를 호출하지 않는다.
//   render 중 headers() 를 부르면 Next 가 해당 라우트를 dynamic 으로 강등 → `revalidate` 무시 → 매 요청 SSR
//   (+ cross-region DB). canonical 도메인은 어차피 build-time 에 알 수 있으므로 env 로 계산하고,
//   env 미설정(dev/staging)일 때만 request host fallback(= 이 경우만 dynamic)로 동작한다.

import { headers } from "next/headers";
import { canonicalHostForSlug, normalizeHost } from "./custom-domains";

/** dev/staging fallback 전용 — request 의 (정규화된) host + proto. render 중 호출 시 dynamic 강등. */
function requestHostProto(): { host: string; proto: string; rawHost: string } {
  const h = headers();
  const rawHost = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return { host: normalizeHost(rawHost), proto, rawHost };
}

/**
 * instanceSlug 의 canonical site base URL.
 * 1. 커스텀 도메인 루트 (env CUSTOM_DOMAIN_MAP 역방향): `https://daeatdiet-incheon.onwell.site`
 * 2. path-based trusted origin (env PUBLIC_SITE_ORIGIN): `https://<origin>/<slug>`
 * 3. dev/staging fallback (request host · headers() → dynamic): `http://<rawHost>/<slug>`
 */
export function siteBaseUrl(instanceSlug: string): string {
  // 1. 커스텀 도메인 canonical — env 기반이라 headers() 불필요 → static/ISR 유지.
  //    어느 host 로 접근했든 canonical 은 항상 루트 도메인으로 통일(중복 URL dedupe).
  const customHost = canonicalHostForSlug(instanceSlug);
  if (customHost) return `https://${customHost}`;
  // 2. PSRC-09: production trusted origin.
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  }
  // 3. dev/staging fallback — request host (이 분기만 dynamic).
  const { proto, rawHost } = requestHostProto();
  return `${proto}://${rawHost}/${instanceSlug}`;
}

/**
 * origin only (no instanceSlug suffix). sitemap/robots fallback 용.
 * 1. PUBLIC_SITE_ORIGIN → 2. request host fallback(headers()).
 */
export function siteOrigin(): string {
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return trustedOrigin.replace(/\/$/, "");
  }
  const { proto, rawHost } = requestHostProto();
  return `${proto}://${rawHost}`;
}
