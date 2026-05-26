// @glitzy/web/lib/site-tracking/beacon — MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 6
// 사이트 안 client-side beacon. sendBeacon 우선 + fetch keepalive fallback. utm 첫 방문 cookie 보존.

"use client";

export type TrackableEvent =
  | "phone_click"
  | "kakao_click"
  | "booking_click"
  | "consult_form_start"
  | "consult_form_complete";

export type TrackableCtaId =
  | "hero-call"
  | "hero-booking"
  | "footer-call"
  | "treatment-detail-call"
  | "consult-form-default";

export type TrackMetadata = {
  cta_id?: TrackableCtaId;
  form_step?: string;
};

const UTM_COOKIE = "glitzy_utm";
const UTM_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;  // 30d
const UTM_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "fbclid",
] as const;

type UtmPayload = Partial<Record<typeof UTM_KEYS[number], string>>;

function readUtmCookie(): UtmPayload | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((p) => p.startsWith(`${UTM_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(UTM_COOKIE.length + 1)));
  } catch {
    return null;
  }
}

function writeUtmCookie(utm: UtmPayload): void {
  if (typeof document === "undefined") return;
  if (Object.keys(utm).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(utm));
  document.cookie =
    `${UTM_COOKIE}=${value}; Max-Age=${UTM_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

function readUtmFromUrl(): UtmPayload {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: UtmPayload = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

/** url query 안 utm 이 있으면 우선, 없으면 cookie 회수. 첫 발견 시 cookie 저장 (landing 보존). */
function resolveUtm(): UtmPayload {
  const fromUrl = readUtmFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    writeUtmCookie(fromUrl);
    return fromUrl;
  }
  return readUtmCookie() ?? {};
}

/** 사이트 안 CTA 발사. server 안 zod 검증 + RLS INSERT. 실패는 silent (사용자 경험 영향 X). */
export function trackEvent(name: TrackableEvent, metadata: TrackMetadata = {}): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    event_name: name,
    page_path: window.location.pathname,
    utm: resolveUtm(),
    referrer: document.referrer || undefined,
    metadata,
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain" });
      navigator.sendBeacon("/api/track", blob);
      return;
    }
  } catch {
    // sendBeacon 실패 → fetch fallback
  }
  try {
    void fetch("/api/track", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  } catch {
    // silent
  }
}
