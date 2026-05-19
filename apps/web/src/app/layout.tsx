// @glitzy/web — root layout (Supanova premium aesthetic 적용)
import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Glitzy 어드민",
  description: "M0 walking skeleton",
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
        {children}
      </body>
    </html>
  );
}
