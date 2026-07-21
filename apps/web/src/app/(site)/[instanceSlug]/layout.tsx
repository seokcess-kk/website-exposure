// @glitzy/web/(site)/[instanceSlug]/layout — 공개 사이트 layout (fragment only)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { loadSiteInitial } from "@/lib/site-initial";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const revalidate = 300;

// C0051 — 네이버 서치어드바이저 소유확인 meta 를 사이트 전 페이지 <head> 에 출력.
// GSC 는 onwell.site 도메인 속성(DNS TXT)으로 소유확인하므로 meta 태그 불필요.
// 페이지별 buildPageMetadata 는 verification 을 설정하지 않으므로 layout 값이 그대로 상속됨.
export async function generateMetadata({
  params,
}: {
  params: { instanceSlug: string };
}): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  const token = initial?.clinic.naverSiteVerification;
  // 인스턴스별 favicon — 정사각형 전용 favicon_url(C0052) 우선. 없으면 clinic 로고로 대체하고,
  // 둘 다 없으면 root `app/icon.svg`(Glitzy 기본) 를 상속한다. 로고는 가로형이라 브라우저 리사이즈
  // 시 왜곡될 수 있어 정사각형 favicon 이 이상적 — 이제 전용 필드가 있으면 그것을 사용한다.
  // shortcut 은 same-origin `/favicon.ico`(인스턴스별 route handler) — 네이버 파비콘 수집기가
  // 전통적으로 rel="shortcut icon" + 자기 도메인 경로를 우선하므로 cross-origin(Supabase) 거부 대비.
  const iconUrl = initial?.clinic.faviconUrl ?? initial?.clinic.logoUrl;
  return {
    ...(iconUrl
      ? { icons: { icon: iconUrl, shortcut: "/favicon.ico", apple: iconUrl } }
      : {}),
    ...(token ? { verification: { other: { "naver-site-verification": token } } } : {}),
  };
}

/**
 * hex (#RRGGBB) → HSL 기반 변형. light=원본 · hover=어둡게 0.1 · subtle=옅게.
 * brand-primary 변형 자동 생성 — 추출된 한 색상으로 hover 자동 산정.
 */
function hexAdjustLightness(hex: string, delta: number): string {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  const r = parseInt(m[1]!, 16) / 255;
  const g = parseInt(m[2]!, 16) / 255;
  const b = parseInt(m[3]!, 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  const newL = Math.max(0, Math.min(1, l + delta));
  // HSL → RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
  const p = 2 * newL - q;
  const nr = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const ng = Math.round(hue2rgb(p, q, h) * 255);
  const nb = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { instanceSlug: string };
  children: React.ReactNode;
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  // L1 brand override — primary/accent 가 있으면 CSS var 안 inline override (한의원 base theme 다른 색상 그대로 유지)
  const bt = initial.clinic.brandTokens;
  const overrideStyle = bt && bt.primaryHex
    ? {
        ["--color-brand-primary"]: bt.primaryHex,
        ["--color-brand-primary-hover"]: hexAdjustLightness(bt.primaryHex, -0.08),
        ...(bt.accentHex ? { ["--color-brand-secondary"]: bt.accentHex } : {}),
      } as React.CSSProperties
    : undefined;

  return (
    <div style={overrideStyle}>
      <SiteHeader initial={initial} />
      <main id="main" className="min-h-screen">{children}</main>
      <SiteFooter initial={initial} />
      <SpeedInsights />
    </div>
  );
}
