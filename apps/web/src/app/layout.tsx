// @glitzy/web — root layout (Supanova premium aesthetic 적용)
import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  title: "관리자",
  description: "사이트 관리자 콘솔",
  // 소유확인 meta 없음 — 어드민/랜딩/sign-in 은 robots Disallow 대상(공개 색인 아님).
  // 공개 사이트(onwell.site)의 네이버 소유확인은 (site) layout 이 인스턴스 토큰으로 출력.
  // GSC 는 onwell.site 도메인 속성(DNS TXT)으로 소유확인.
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
