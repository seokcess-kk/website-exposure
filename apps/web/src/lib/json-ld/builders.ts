// @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
// SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
// v0.4 EAT_CONTENT v1.0: Doctor/About graph self-contained 확장 (ScholarlyArticle/VideoObject 풀 entity)
//   + faqPageGraph 신규.

import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ArticleProjection,
  PublicationProjection,
  MediaAppearanceProjection,
  FaqProjection,
} from "@/lib/db-projection";
import type { JsonLdGraph, GraphBuilderContext } from "./types";
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
export function treatmentDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
  treatment: TreatmentProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.medicalProcedureEntity(ctx, treatment),
    E.webPageEntity(ctx, treatment.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "진료", path: "/treatments" },
      { name: treatment.name, path: null },
    ]),
  ]);
}

// === P-010 Article Detail ===
// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
// v0.4 EC-RENDER-04: article.categorySlug 직접 사용 — category 인자 제거.
export function articleDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  article: ArticleProjection,
  author: DoctorProjection | null,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.articleEntity(ctx, article, author),
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
