// @glitzy/web/(site)/[instanceSlug]/layout — 공개 사이트 layout (fragment only)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadSiteInitial } from "@/lib/site-initial";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/verification-tokens";

export const revalidate = 300;

// C0051 — 네이버 서치어드바이저 소유확인 meta 를 사이트 전 페이지 <head> 에 출력.
// GSC 소유확인도 함께 — 이 verification 반환이 root layout 값을 통째로 교체하므로
// google 을 여기서 누락하면 커스텀 도메인 페이지에서 GSC meta 가 사라진다.
// 페이지별 buildPageMetadata 는 verification 을 설정하지 않으므로 layout 값이 그대로 상속됨.
export async function generateMetadata({
  params,
}: {
  params: { instanceSlug: string };
}): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  const token = initial?.clinic.naverSiteVerification;
  return {
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
      ...(token ? { other: { "naver-site-verification": token } } : {}),
    },
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
    </div>
  );
}
