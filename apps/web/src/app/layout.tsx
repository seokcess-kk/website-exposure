// @glitzy/web — root layout (Supanova premium aesthetic 적용)
import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { ProgressBar } from "@/components/ProgressBar";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/verification-tokens";

export const metadata: Metadata = {
  title: "관리자",
  description: "사이트 관리자 콘솔",
  // NAVER_SEARCH_INGEST_PLAN v0.2 G1 — NSA 사이트 소유 확인 meta tag.
  // https://website-exposure.vercel.app/ URL prefix 등록 정합. token rotation 없음.
  // GSC — (site) layout 이 verification 을 교체 출력하므로 그쪽에도 동일 토큰 포함 (lib/verification-tokens.ts).
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": "8b42808f16eb687b202e907595444f7a8b04d3a1",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="light">
      <body className="min-h-screen bg-canvas text-fg-default antialiased">
        {/* Supanova: Iconify web component (lazy) — <iconify-icon icon="solar:document-text-bold" /> */}
        <Script
          src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"
          strategy="lazyOnload"
        />
        {/* Navigation progress bar — 모든 페이지 이동 시 상단에 표시 (사용자 검수 2026-05-20) */}
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}
