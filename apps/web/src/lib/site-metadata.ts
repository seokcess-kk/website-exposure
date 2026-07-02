// @glitzy/web/lib/site-metadata — Next metadata 공통 헬퍼
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06

import type { Metadata, ResolvingMetadata } from "next";
import type { ClinicProjection } from "./db-projection";
import { siteBaseUrl } from "./site-url";
import { extractLocalModifier } from "./local-keywords";

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

/** EXPOSURE_READINESS Phase E — 로컬 SEO #2-a 보강 (외부 비평).
 *  clinic.metadata.localKeywords[0] 안 짧은 지역 modifier (예: "부평", "인천") 자연 prepend.
 *  - localKeywords 가 비어 있거나 첫 항목이 너무 길면 prefix 적용 안 함.
 *  - 이미 title 안 동일 지역 modifier 가 포함되면 중복 회피.
 *  - title 30자 cap 안 fit 되는 경우만 prefix 추가 — fit 안 되면 원본 그대로.
 */
function applyLocalPrefix(title: string, localKeywords: ReadonlyArray<string>): string {
  // 규칙 SoT: lib/local-keywords.ts extractLocalModifier — Hero h1 지역 토큰과 동일 규칙.
  const modifier = extractLocalModifier(localKeywords);
  if (!modifier) return title;
  if (title.includes(modifier)) return title;
  const candidate = `[${modifier}] ${title}`;
  return candidate.length <= TITLE_MAX ? candidate : title;
}

/** 네이버 "사이트 설명"·og:description 권장 — 80자 이내(SERP 미truncate).
 *  긴 소개문은 (1) 첫 완결 문장이 80자 이내면 그대로, (2) 아니면 단어 경계 truncate + 말줄임.
 */
const DESC_MAX = 80;
function clampDescription(desc: string): string {
  const trimmed = desc.trim();
  if (trimmed.length <= DESC_MAX) return trimmed;
  const firstSentence = trimmed.match(/^[\s\S]*?[.?!。](?=\s|$)/)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= DESC_MAX) return firstSentence;
  const slice = trimmed.slice(0, DESC_MAX - 1);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > DESC_MAX * 0.6 ? slice.slice(0, cut) : slice).trimEnd()}…`;
}

export function buildPageMetadata(
  clinic: ClinicProjection,
  instanceSlug: string,
  input: PageMetaInput,
): Metadata {
  const rawTitle = truncateTitle(input.pageTitle, clinic.name);
  const title = applyLocalPrefix(rawTitle, clinic.metadata.localKeywords);
  const description = clampDescription(input.description ?? clinic.description);
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
