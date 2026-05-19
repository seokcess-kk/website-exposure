// @glitzy/web — root layout (Plan v1.0 § 3)
// 2026-05-19 L0a: Pretendard 한글 폰트 — globals.css 안 CDN @import (단순화)
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Glitzy 어드민",
  description: "M0 walking skeleton",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // PSR-COMP-01·02 (cycle2 PSR-28 patch): root layout 이 <html>/<body> SoT.
  // semantic 22 토큰 — `bg-canvas` (color.surface.background) · `text-fg-default` (color.text.primary).
  return (
    <html lang="ko-KR" data-theme="light">
      <body className="min-h-screen bg-canvas text-fg-default antialiased">{children}</body>
    </html>
  );
}
