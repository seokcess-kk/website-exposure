// @glitzy/web/lib/json-ld/entities — entity builder helpers
// SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책
// v0.4 EAT_CONTENT v1.0 cascade: ScholarlyArticle · VideoObject · FAQPage · Question/Answer

import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ConditionProjection,
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

/**
 * NAVER_PLACE_PLAN v1.0 § 5.2 — clinic 안 외부 entity sameAs URL 합산.
 * v1 = naverPlace.placeUrl 만. 추가 social URL 합류는 v2+.
 */
function buildClinicSameAs(clinic: ClinicProjection): string[] {
  const list: string[] = [];
  if (clinic.metadata.naverPlace?.placeUrl) {
    list.push(clinic.metadata.naverPlace.placeUrl);
  }
  return list;
}

export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  const id = `${ctx.siteBaseUrl}/#organization`;
  const contactPoints = clinic.primaryCtas
    .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
    .map((c) => contactPointEntity(ctx, c));
  // EXPOSURE_READINESS Phase D — 로컬 SEO 축: clinic.metadata.localKeywords[] → schema.org keywords (콤마 결합).
  const localKw = clinic.metadata.localKeywords;
  const sameAs = buildClinicSameAs(clinic);
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
    ...(localKw.length > 0 ? { keywords: localKw.join(", ") } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
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
    ...(buildClinicSameAs(clinic).length > 0 ? { sameAs: buildClinicSameAs(clinic) } : {}),
  };
}

export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
}

export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
}

// schema.org credentialCategory 매핑 — 자유 입력 string 도 허용되지만 표준값 우선.
const CREDENTIAL_CATEGORY_MAP: Record<"license" | "board" | "certification" | "membership" | "education", string> = {
  license: "license",
  board: "specialty",
  certification: "certification",
  membership: "membership",
  education: "degree",
};

export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  const credentials = doctor.metadata.credentials.map((c) => {
    const cred: Record<string, unknown> = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: CREDENTIAL_CATEGORY_MAP[c.type],
      name: c.name,
    };
    if (c.issuer) cred.recognizedBy = { "@type": "Organization", name: c.issuer };
    if (c.issuedAt) cred.dateCreated = c.issuedAt;
    if (c.identifier) cred.identifier = c.identifier;
    if (c.url) cred.url = c.url;
    return cred as JsonLdEntity;
  });
  const specialties = doctor.metadata.medicalSpecialties;
  return {
    "@type": "Physician",
    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
    name: doctor.name,
    ...(doctor.title ? { jobTitle: doctor.title } : {}),
    ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
    ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
    ...(specialties.length > 0
      ? { medicalSpecialty: specialties.length === 1 ? specialties[0]! : (specialties as unknown as JsonLdEntity[]) }
      : {}),
    ...(credentials.length > 0 ? { hasCredential: credentials } : {}),
  };
}

export function medicalProcedureEntity(
  ctx: GraphBuilderContext,
  treatment: TreatmentProjection,
  evidenceCitations?: ReadonlyArray<JsonLdEntity>,
): JsonLdEntity {
  return {
    "@type": "MedicalProcedure",
    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
    name: treatment.name,
    description: treatment.summary,
    ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
    // EVIDENCE_LINKING_PLAN Phase B § 10 — clinical evidence (derived-from 우선 + cites)
    ...(evidenceCitations && evidenceCitations.length > 0 ? { citation: evidenceCitations as JsonLdEntity[] } : {}),
  };
}

// === EXPOSURE_READINESS Phase B — MedicalCondition (P-007/P-008) ===
//   SCHEMA_MAPPING § 3 정합 — 증상/상황 단위. 단정 표현 금지 (의료광고법) — name/description 만 출력.
//   possibleTreatment 는 같은 페이지 graph 안 MedicalProcedure 또는 cross-page ref.
export function medicalConditionEntity(
  ctx: GraphBuilderContext,
  condition: ConditionProjection,
  possibleTreatmentRef?: { slug: string },
  evidenceCitations?: ReadonlyArray<JsonLdEntity>,
): JsonLdEntity {
  return {
    "@type": "MedicalCondition",
    "@id": `${ctx.siteBaseUrl}/conditions/${condition.slug}#condition`,
    name: condition.name,
    description: condition.summary,
    ...(condition.heroImageUrl ? { image: condition.heroImageUrl } : {}),
    ...(possibleTreatmentRef ? {
      possibleTreatment: { "@id": `${ctx.siteBaseUrl}/treatments/${possibleTreatmentRef.slug}#procedure` },
    } : {}),
    ...(evidenceCitations && evidenceCitations.length > 0 ? { citation: evidenceCitations as JsonLdEntity[] } : {}),
  };
}

export function articleEntity(
  ctx: GraphBuilderContext,
  article: ArticleProjection,
  author: DoctorProjection | null,
  options?: {
    citations?: ReadonlyArray<JsonLdEntity>;
    mentions?: ReadonlyArray<{ name: string; url: string }>;
  },
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
  // EVIDENCE_LINKING_PLAN Phase B § 9 — citation (cites Publication/MediaAppearance) + mentions (related-to)
  const evidenceBlock: Partial<JsonLdEntity> = {};
  if (options?.citations && options.citations.length > 0) {
    evidenceBlock.citation = options.citations as JsonLdEntity[];
  }
  if (options?.mentions && options.mentions.length > 0) {
    evidenceBlock.mentions = options.mentions.map((m) => ({
      "@type": "WebPage",
      name: m.name,
      url: m.url,
    }));
  }
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
    ...evidenceBlock,
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
// EXPOSURE_READINESS Phase D — publication_type 별 publisher 차별화.
//   internal-research: 자체 organization (`@id` cross-reference 유지).
//   government: GovernmentOrganization + publisher_name (예: "질병관리청").
//   academic-society: MedicalOrganization + publisher_name (예: "대한비만학회").
//   statistics: Organization + publisher_name (예: "통계청").
//   external-authority: Organization + publisher_name (운영자 입력).
//   publisher_name 미입력 시 fallback: 자체 organization.
// JSON-LD publisher 는 (a) cross-reference (`{ "@id": ... }`) 또는 (b) inline `{ "@type", name }`.
//   두 형태 모두 schema.org 안 허용. unknown 으로 expose — strict JsonLdEntity 형식 미일치 의도.
function buildPublisher(
  ctx: GraphBuilderContext,
  pub: PublicationProjection,
): unknown {
  if (pub.publicationType === "internal-research" || !pub.publisherName) {
    return { "@id": `${ctx.siteBaseUrl}/#organization` };
  }
  const publisherType =
    pub.publicationType === "government" ? "GovernmentOrganization"
    : pub.publicationType === "academic-society" ? "MedicalOrganization"
    : "Organization";
  return { "@type": publisherType, name: pub.publisherName };
}

// EXPOSURE_READINESS Phase E — publication_type 별 schema.org `@type` 분기.
//   internal-research · external-authority · academic-society → ScholarlyArticle (학술 자료)
//   government → Report (정부 발간물/보고서)
//   statistics → Dataset (공공 통계 데이터셋)
//   외부 비평 #4 보강 — "정부 자료가 ScholarlyArticle 로 자연스럽지 않다" 흡수.
function resolvePublicationSchemaType(publicationType: PublicationProjection["publicationType"]): string {
  switch (publicationType) {
    case "government": return "Report";
    case "statistics": return "Dataset";
    case "internal-research":
    case "external-authority":
    case "academic-society":
    default: return "ScholarlyArticle";
  }
}

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
  const schemaType = resolvePublicationSchemaType(pub.publicationType);
  // Dataset 은 schema.org 안 `headline` 대신 `name` 권장. Report 는 둘 다 허용 — headline 유지.
  const titleField = schemaType === "Dataset" ? { name: pub.title } : { headline: pub.title };
  return {
    "@type": schemaType,
    "@id": `${pageBaseUrl}#publication-${pub.slug}`,
    ...titleField,
    author: pub.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: pub.publishedDate,
    ...(pub.journal ? { isPartOf: { "@type": "Periodical", name: pub.journal } } : {}),
    ...(identifiers.length > 0 ? { identifier: identifiers } : {}),
    url: pub.url,
    description: pub.summary,
    ...(pub.thumbnailUrl ? { image: pub.thumbnailUrl } : {}),
    publisher: buildPublisher(ctx, pub),
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
  // question/answer 만 사용 — DB FaqProjection 외에 아티클 markdown FAQ block 파싱 결과도 수용
  faqs: ReadonlyArray<Pick<FaqProjection, "question" | "answer">>,
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
