// @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
// SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
// v0.4 EAT_CONTENT v1.0: Doctor/About graph self-contained 확장 (ScholarlyArticle/VideoObject 풀 entity)
//   + faqPageGraph 신규.

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
} from "@/lib/db-projection";
import type { JsonLdGraph, GraphBuilderContext, JsonLdEntity } from "./types";
import * as E from "./entities";

const CONTEXT = "https://schema.org" as const;

function graph(entities: ReturnType<typeof E.organizationEntity>[]): JsonLdGraph {
  return { "@context": CONTEXT, "@graph": entities };
}

// === P-001 Home ===
export function homeGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
): JsonLdGraph {
  const entities = [
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.webSiteEntity(ctx, clinic.name),
    E.webPageEntity(ctx, clinic.name, clinic.description),
  ];
  return graph(entities);
}

// === P-002 About ===
//   v0.4 EC-RENDER-03: MedicalClinic.subjectOf 단일 결정 (Organization 미사용).
//   Publication/Media 풀 entity 출력 — fragment-scoped @id (`/about#publication-{slug}` · `/about#video-{slug}`).
export function aboutGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
  title: string,
  description: string,
  publications: ReadonlyArray<PublicationProjection> = [],
  media: ReadonlyArray<MediaAppearanceProjection> = [],
): JsonLdGraph {
  const aboutBaseUrl = `${ctx.siteBaseUrl}/about`;
  const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, aboutBaseUrl));
  const mediaEntities = media.map((m) => E.videoObjectEntity(m, aboutBaseUrl));

  // MedicalClinic.subjectOf array (fragment ref) — graph 안 entity 모두 self-contained 이므로 ref 만.
  const subjectOfRefs: Array<{ "@id": string }> = [];
  for (const p of publications) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#publication-${p.slug}` });
  for (const m of media) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#video-${m.slug}` });

  let clinicEntity = location ? E.medicalClinicEntity(ctx, clinic, location) : null;
  if (clinicEntity !== null && subjectOfRefs.length > 0) {
    clinicEntity = { ...clinicEntity, subjectOf: subjectOfRefs };
  }

  return graph([
    E.organizationEntity(ctx, clinic),
    ...(clinicEntity ? [clinicEntity] : []),
    E.webPageEntity(ctx, title, description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
    ...publicationEntities,
    ...mediaEntities,
  ]);
}

// === P-003 Doctors List ===
// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
//   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
//   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
export function doctorsListGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  doctors: DoctorProjection[],
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "의료진", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
    E.itemListEntity(
      ctx,
      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
      "doctors",
    ),
  ]);
}

// === P-004 Doctor Profile ===
//   v0.4 EC-RENDER-02: graph self-contained — Publication/Media 풀 entity 출력.
//   fragment-scoped @id (`/doctors/{slug}#publication-{...}` · `#video-{...}`).
//   Physician.subjectOf array (fragment ref) — graph 안 cross-ref.
export function doctorProfileGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  doctor: DoctorProjection,
  description: string,
  publications: ReadonlyArray<PublicationProjection> = [],
  media: ReadonlyArray<MediaAppearanceProjection> = [],
): JsonLdGraph {
  const doctorBaseUrl = `${ctx.siteBaseUrl}/doctors/${doctor.slug}`;
  const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, doctorBaseUrl));
  const mediaEntities = media.map((m) => E.videoObjectEntity(m, doctorBaseUrl));

  const subjectOfRefs: Array<{ "@id": string }> = [];
  for (const p of publications) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#publication-${p.slug}` });
  for (const m of media) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#video-${m.slug}` });

  let physicianEntity = E.physicianEntity(ctx, doctor);
  if (subjectOfRefs.length > 0) {
    physicianEntity = { ...physicianEntity, subjectOf: subjectOfRefs };
  }

  return graph([
    E.organizationEntity(ctx, clinic),
    physicianEntity,
    E.webPageEntity(ctx, doctor.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "의료진", path: "/doctors" },
      { name: doctor.name, path: null },
    ]),
    ...publicationEntities,
    ...mediaEntities,
  ]);
}

// === P-005 Treatments List ===
export function treatmentsListGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  treatments: TreatmentProjection[],
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "진료", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
    E.itemListEntity(
      ctx,
      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure`, itemType: "MedicalProcedure" as const })),
      "treatments",
    ),
  ]);
}

// === P-006 Treatment Detail ===
// SCHEMA_MAPPING § 2.5 — P-006 은 MedicalClinic 풀 entity 출력 (예약 CTA · 본원 정보 의미).
// EVIDENCE_LINKING_PLAN Phase B § 10 — evidence: derived-from Publication 우선 + cites Publication/MediaAppearance.
//   inline 출력 (fragment-scoped @id 는 현재 page baseUrl) — cross-page reference 회피.
export function treatmentDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
  treatment: TreatmentProjection,
  description: string,
  evidence?: {
    publications?: ReadonlyArray<{ publication: PublicationProjection; relationType: "cites" | "derived-from" }>;
    media?: ReadonlyArray<{ media: MediaAppearanceProjection; relationType: "cites" }>;
  },
): JsonLdGraph {
  const treatmentPageBaseUrl = `${ctx.siteBaseUrl}${ctx.pagePath}`;
  // 우선순위: derived-from publication 먼저, 그 다음 cites publication, 그 다음 cites media
  const sortedPubs = (evidence?.publications ?? []).slice().sort((a, b) => {
    if (a.relationType === b.relationType) return 0;
    return a.relationType === "derived-from" ? -1 : 1;
  });
  const evidenceCitations: JsonLdEntity[] = [];
  for (const { publication } of sortedPubs) {
    evidenceCitations.push(E.scholarlyArticleEntity(ctx, publication, treatmentPageBaseUrl));
  }
  for (const { media } of evidence?.media ?? []) {
    evidenceCitations.push(E.videoObjectEntity(media, treatmentPageBaseUrl));
  }

  return graph([
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.medicalProcedureEntity(ctx, treatment, evidenceCitations.length > 0 ? evidenceCitations : undefined),
    E.webPageEntity(ctx, treatment.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "진료", path: "/treatments" },
      { name: treatment.name, path: null },
    ]),
  ]);
}

// === P-007 Conditions List ===
//   EXPOSURE_READINESS Phase B — 의료 검색 유입 페이지 list.
export function conditionsListGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  conditions: ConditionProjection[],
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "증상 안내", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "증상", path: null }]),
    // ItemList — 각 MedicalCondition 의 @id 참조.
    {
      "@type": "ItemList",
      "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#conditions`,
      itemListElement: conditions.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "MedicalCondition", "@id": `${ctx.siteBaseUrl}/conditions/${c.slug}#condition`, name: c.name },
      })),
    },
  ]);
}

// === P-008 Condition Detail ===
//   EXPOSURE_READINESS Phase B — primary_treatment 가 같은 instance 안 published treatment 면 possibleTreatment ref.
export function conditionDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  condition: ConditionProjection,
  description: string,
  primaryTreatmentSlug: string | null,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.medicalConditionEntity(
      ctx,
      condition,
      primaryTreatmentSlug ? { slug: primaryTreatmentSlug } : undefined,
    ),
    E.webPageEntity(ctx, condition.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "증상", path: "/conditions" },
      { name: condition.name, path: null },
    ]),
  ]);
}

// === P-010 Article Detail ===
// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
// v0.4 EC-RENDER-04: article.categorySlug 직접 사용 — category 인자 제거.
// EVIDENCE_LINKING_PLAN Phase B § 9 — citation (cites Publication/MediaAppearance) + mentions (related-to).
export function articleDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  article: ArticleProjection,
  author: DoctorProjection | null,
  evidence?: {
    publications?: ReadonlyArray<{ publication: PublicationProjection; relationType: "cites" | "derived-from" }>;
    media?: ReadonlyArray<{ media: MediaAppearanceProjection; relationType: "cites" }>;
    mentions?: ReadonlyArray<{ name: string; url: string }>;
  },
): JsonLdGraph {
  const articlePageBaseUrl = `${ctx.siteBaseUrl}${ctx.pagePath}`;
  const evidenceCitations: JsonLdEntity[] = [];
  for (const { publication } of evidence?.publications ?? []) {
    evidenceCitations.push(E.scholarlyArticleEntity(ctx, publication, articlePageBaseUrl));
  }
  for (const { media } of evidence?.media ?? []) {
    evidenceCitations.push(E.videoObjectEntity(media, articlePageBaseUrl));
  }

  return graph([
    E.organizationEntity(ctx, clinic),
    E.articleEntity(ctx, article, author, {
      ...(evidenceCitations.length > 0 ? { citations: evidenceCitations } : {}),
      ...(evidence?.mentions && evidence.mentions.length > 0 ? { mentions: evidence.mentions } : {}),
    }),
    E.webPageEntity(ctx, article.headline, article.summary),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "인사이트", path: null },
      { name: article.headline, path: null },
    ]),
  ]);
}

// === P-012 Contact ===
export function contactGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.medicalClinicEntity(ctx, clinic, location),
    E.webPageEntity(ctx, "연락처", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
  ]);
}

// === P-011 FAQ (EAT_CONTENT v1.0) ===
//   SCHEMA_MAPPING § 6.3. FAQPage + Question[] mainEntity inline.
//   v0.1 단계 published 차단 (DB CHECK status='draft' 만) → faqs 0 row 가능, 빈 mainEntity [].
export function faqPageGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  faqs: ReadonlyArray<FaqProjection>,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "자주 묻는 질문", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "자주 묻는 질문", path: null }]),
    E.faqPageEntity(ctx, faqs),
  ]);
}

// === P-014 Location Detail ===
export function locationDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.medicalClinicEntity(ctx, clinic, location),
    E.webPageEntity(ctx, location.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "위치", path: null },
      { name: location.name, path: null },
    ]),
  ]);
}
