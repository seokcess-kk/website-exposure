// @glitzy/web/lib/json-ld/entities — entity builder helpers
// SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책
// v0.4 EAT_CONTENT v1.0 cascade: ScholarlyArticle · VideoObject · FAQPage · Question/Answer

import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ArticleProjection,
  PublicationProjection,
  MediaAppearanceProjection,
  FaqProjection,
  PrimaryCta,
} from "@/lib/db-projection";
import { formatAddress } from "@/lib/db-projection";
import { renderMarkdownToPlainText } from "@/lib/markdown";
import type { JsonLdEntity, GraphBuilderContext } from "./types";

const NAVER_RESERVATION_CHANNELS = new Set(["phone", "email", "kakao-talk", "naver-reservation", "naver-talk", "form"]);

export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  const id = `${ctx.siteBaseUrl}/#organization`;
  const contactPoints = clinic.primaryCtas
    .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
    .map((c) => contactPointEntity(ctx, c));
  return {
    "@type": "Organization",
    "@id": id,
    name: clinic.name,
    ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
    description: clinic.description,
    ...(clinic.slogan ? { slogan: clinic.slogan } : {}),
    url: ctx.siteBaseUrl,
    logo: clinic.logoUrl,
    ...(clinic.founder ? { founder: { "@type": "Person", name: clinic.founder } } : {}),
    ...(clinic.foundingDate ? { foundingDate: clinic.foundingDate } : {}),
    ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  };
}

// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
function contactPointEntity(ctx: GraphBuilderContext, cta: PrimaryCta): JsonLdEntity {
  const contactType = cta.type === "phone" ? "reservations" : cta.label;
  return {
    "@type": "ContactPoint",
    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
    contactType,
    ...(cta.type === "phone" && cta.targetUrl.startsWith("tel:") ? { telephone: cta.targetUrl.slice(4) } : { url: cta.targetUrl }),
  } as JsonLdEntity;
}

export function medicalClinicEntity(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
): JsonLdEntity {
  return {
    "@type": "MedicalClinic",
    "@id": `${ctx.siteBaseUrl}/#clinic`,
    name: clinic.name,
    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.addressLocality,
      addressRegion: location.addressRegion,
      postalCode: location.postalCode,
      addressCountry: location.addressCountry,
    },
    ...(location.telephone ? { telephone: location.telephone } : {}),
    ...(location.email ? { email: location.email } : {}),
    ...(location.latitude !== null && location.longitude !== null ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.latitude,
        longitude: location.longitude,
      },
    } : {}),
    ...(location.businessHours.openingHours.length > 0 ? {
      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: oh.dayOfWeek.map((d) => `https://schema.org/${d}`),
        opens: oh.opens,
        closes: oh.closes,
      })),
    } : {}),
  };
}

export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
}

export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
}

export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  return {
    "@type": "Physician",
    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
    name: doctor.name,
    ...(doctor.title ? { jobTitle: doctor.title } : {}),
    ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
    ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
    medicalSpecialty: "MedicalSpecialty",
  };
}

export function medicalProcedureEntity(ctx: GraphBuilderContext, treatment: TreatmentProjection): JsonLdEntity {
  return {
    "@type": "MedicalProcedure",
    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
    name: treatment.name,
    description: treatment.summary,
    ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
  };
}

export function articleEntity(
  ctx: GraphBuilderContext,
  article: ArticleProjection,
  author: DoctorProjection | null,
): JsonLdEntity {
  // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
  const authorBlock = author ? {
    author: {
      "@type": "Physician",
      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
      name: author.name,
      ...(author.title ? { jobTitle: author.title } : {}),
      ...(author.photoUrl ? { image: author.photoUrl } : {}),
    },
  } : {};
  return {
    "@type": "Article",
    // v0.4 EC-RENDER-04 (PSR-DEFER-15 해소): article.categorySlug 직접 사용 — 호출자 별 category 인자 제거.
    "@id": `${ctx.siteBaseUrl}/insights/${article.categorySlug}/${article.slug}#article`,
    headline: article.headline,
    description: article.summary,
    inLanguage: "ko-KR",
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
    ...authorBlock,
  };
}

// PSRC-17 patch: SCHEMA_MAPPING § 2.5 정합 — `about` 옵션 제거 (참조만 페이지에서 dangling ref 회피).
//   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
export function webPageEntity(ctx: GraphBuilderContext, title: string, description: string): JsonLdEntity {
  return {
    "@type": "WebPage",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
    name: title,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
  };
}

export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
  return {
    "@type": "WebSite",
    "@id": `${ctx.siteBaseUrl}/#website`,
    name,
    url: ctx.siteBaseUrl,
    inLanguage: "ko-KR",
    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
  };
}

export function breadcrumbListEntity(
  ctx: GraphBuilderContext,
  items: Array<{ name: string; path: string | null }>,
): JsonLdEntity {
  return {
    "@type": "BreadcrumbList",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
    })),
  };
}

// PSRC-19 patch: item 을 inline self-contained 로 — schema.org `@type` 명시 (Physician/MedicalProcedure 등).
//   `@type` 있는 객체는 rule checker 에서 inline 으로 인정 (PSRC-18 정합).
export function itemListEntity(
  ctx: GraphBuilderContext,
  items: Array<{ name: string; itemId: string; itemType: "Physician" | "MedicalProcedure" }>,
  listId: string,
): JsonLdEntity {
  return {
    "@type": "ItemList",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": it.itemType, "@id": it.itemId, name: it.name },
    })),
  };
}

function stripMarkdown(md: string): string {
  return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
}

// === EAT_CONTENT v1.0 — ScholarlyArticle (C-24 Publication) ===
//   SCHEMA_MAPPING § 6.1. fragment-scoped @id (Doctor/About page 안 inline).
//   pageBaseUrl 은 Publication 이 출력되는 page URL (예: `${siteBaseUrl}/doctors/${doctor.slug}` 또는 `${siteBaseUrl}/about`).
export function scholarlyArticleEntity(
  ctx: GraphBuilderContext,
  pub: PublicationProjection,
  pageBaseUrl: string,
): JsonLdEntity {
  // PropertyValue 는 inline value object (`@id` 없음 — JSON-LD 사양상 허용).
  //   JsonLdEntity 의 `@id` 는 graph top-level entity 에만 요구되므로 inline 은 unknown 으로 expose.
  const identifiers: Array<{ "@type": "PropertyValue"; propertyID: string; value: string }> = [];
  if (pub.doi) {
    identifiers.push({ "@type": "PropertyValue", propertyID: "DOI", value: pub.doi });
  }
  if (pub.pubmedId) {
    identifiers.push({ "@type": "PropertyValue", propertyID: "PubMedID", value: pub.pubmedId });
  }
  return {
    "@type": "ScholarlyArticle",
    "@id": `${pageBaseUrl}#publication-${pub.slug}`,
    headline: pub.title,
    author: pub.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: pub.publishedDate,
    ...(pub.journal ? { isPartOf: { "@type": "Periodical", name: pub.journal } } : {}),
    ...(identifiers.length > 0 ? { identifier: identifiers } : {}),
    url: pub.url,
    description: pub.summary,
    ...(pub.thumbnailUrl ? { image: pub.thumbnailUrl } : {}),
    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
  };
}

// === EAT_CONTENT v1.0 — VideoObject (C-25 MediaAppearance) ===
//   SCHEMA_MAPPING § 6.2. v0.1 단계 모든 channel_type → VideoObject 단일화 (EC-DEFER-11 까지).
export function videoObjectEntity(
  media: MediaAppearanceProjection,
  pageBaseUrl: string,
): JsonLdEntity {
  return {
    "@type": "VideoObject",
    "@id": `${pageBaseUrl}#video-${media.slug}`,
    name: media.title,
    description: media.summary,
    uploadDate: media.publishedDate,
    ...(media.durationSeconds !== null ? { duration: `PT${media.durationSeconds}S` } : {}),
    ...(media.thumbnailUrl ? { thumbnailUrl: media.thumbnailUrl } : {}),
    contentUrl: media.url,
    publisher: { "@type": "Organization", name: media.channelName },
  };
}

// === EAT_CONTENT v1.0 — FAQPage / Question / Answer (C-12 FAQ) ===
//   SCHEMA_MAPPING § 6.3. P-011 `/<slug>/faq` page.
export function faqPageEntity(
  ctx: GraphBuilderContext,
  faqs: ReadonlyArray<FaqProjection>,
): JsonLdEntity {
  const mainEntity = faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: renderMarkdownToPlainText(f.answer),
    },
  }));
  return {
    "@type": "FAQPage",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#faqpage`,
    inLanguage: "ko-KR",
    mainEntity,
  };
}
