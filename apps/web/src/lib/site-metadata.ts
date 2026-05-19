// @glitzy/web/lib/site-metadata — Next metadata 공통 헬퍼
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06

import type { Metadata, ResolvingMetadata } from "next";
import type { ClinicProjection } from "./db-projection";
import { siteBaseUrl } from "./site-url";

export type PageMetaInput = {
  /** Next.js metadata title — page-specific (e.g. "소개", "의료진"). 자동으로 `${title} | ${clinic.name}` 결합 */
  pageTitle: string;
  /** page-specific description (50~160자 권장). 부재 시 clinic.description fallback */
  description?: string;
  /** og:type — P-001/2/3/5/12/13/14 = "website" · P-004 = "profile" · P-006/P-010 = "article" */
  ogType?: "website" | "profile" | "article";
  /** page 의 hero image URL — 부재 시 clinic.ogImageUrl fallback */
  imageUrl?: string;
  /** canonical path (e.g. "/about", "/doctors/hong"). instance prefix 자동 prepend */
  canonicalPath?: string;
  /** robots: index — P-013 Legal v0.1 false */
  noindex?: boolean;
};

/**
 * Build Next.js metadata for a site page.
 *
 * @param clinic — site initial 의 clinic projection (Header/Footer 공통)
 * @param instanceSlug — URL prefix
 * @param input — page-specific overrides
 */
/** 네이버 SEO 권장 — 한국어 title 30자 이내 enforce.
 *  1) "{pageTitle} | {clinicName}" 합쳐 30자 fit → 사용
 *  2) 합쳐서 초과 + pageTitle 단독 30자 fit → pageTitle 만 사용 (brand 생략)
 *  3) pageTitle 자체가 30자 초과 → 29자 + … 로 truncate (말 줄임표는 1자 차지)
 */
const TITLE_MAX = 30;
function truncateTitle(pageTitle: string, clinicName: string): string {
  if (pageTitle === clinicName) {
    return pageTitle.length <= TITLE_MAX ? pageTitle : `${pageTitle.slice(0, TITLE_MAX - 1)}…`;
  }
  const combined = `${pageTitle} | ${clinicName}`;
  if (combined.length <= TITLE_MAX) return combined;
  if (pageTitle.length <= TITLE_MAX) return pageTitle;
  return `${pageTitle.slice(0, TITLE_MAX - 1)}…`;
}

export function buildPageMetadata(
  clinic: ClinicProjection,
  instanceSlug: string,
  input: PageMetaInput,
): Metadata {
  const title = truncateTitle(input.pageTitle, clinic.name);
  const description = input.description ?? clinic.description;
  const image = input.imageUrl ?? clinic.ogImageUrl;
  const canonicalPath = input.canonicalPath ?? "/";
  // PSRC-08 patch: canonical / OpenGraph URL 은 absolute (request-aware)
  const baseUrl = siteBaseUrl(instanceSlug);
  const canonical = canonicalPath === "/" ? baseUrl : `${baseUrl}${canonicalPath}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: input.ogType ?? "website",
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      locale: "ko_KR",
      siteName: clinic.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: input.noindex ? false : true,
      follow: true,
    },
    // PSR-SEO-02 (cycle3 PSR-29 정정): themeColor 출처 BrandTokens.colors.light/dark.primary
    // v0.1 default — DESIGN_TOKENS § 3.2 color.brand.primary light=#2563eb · dark=#60a5fa
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#2563eb" },
      { media: "(prefers-color-scheme: dark)", color: "#60a5fa" },
    ],
  };
}

export type { Metadata, ResolvingMetadata };
