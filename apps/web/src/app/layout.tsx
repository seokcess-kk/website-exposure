// @glitzy/web — root layout (Supanova premium aesthetic 적용)
import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  title: "관리자",
  description: "사이트 관리자 콘솔",
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
