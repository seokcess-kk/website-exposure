// @glitzy/core-content — Drizzle schema (v0.7·COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0)
// M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
// v0.6: reviewQueueTypeEnum 안 'content-gate' ADD VALUE (Phase Alpha CAP-10) + review_queue_entry openUnique 4-tuple (queue_type 포함)
// v0.7: review_queue_entry openUnique 5-tuple - compliance_record_id 포함 (Phase Alpha code cycle 3 CAP-CODE3-02 - record_version 별 unique scope 분리)

import { sql } from "drizzle-orm";
import {
  pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
  pgEnum, index, foreignKey, check, unique, uniqueIndex,
} from "drizzle-orm/pg-core";

// === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===

export const instance = pgTable(
  "instance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
    activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
    slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
  }),
);

// === Shared enums (C-03·C-04) ===
export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
]);

export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);

// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
  "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
]);

// v0.5 COMPLIANCE_ASSISTANT_M0_PLAN — ComplianceRecord (C-10) + ReviewQueueEntry (REVIEW_WORKFLOW § 3)
export const complianceRecordPhaseEnum = pgEnum("compliance_record_phase", ["pre-publish", "published"]);
export const complianceContentTypeEnum = pgEnum("compliance_content_type", [
  "ClinicProfile", "DoctorProfile", "TreatmentPage", "MedicalConditionPage",
  "Article", "FAQ", "ReviewPolicy", "PricingPage", "FacilitiesPage", "NewsItem",
  "ReservationPage", "LocationProfile", "ArticleCategory", "LegalDocument",
  "Feature", "Publication", "MediaAppearance",
]);
// v0.6 - COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.3 - 'content-gate' ADD VALUE (CAP-10)
export const reviewQueueTypeEnum = pgEnum("review_queue_type", ["manual-review", "content-gate"]);
export const reviewQueueStatusEnum = pgEnum("review_queue_status", ["open", "in-progress", "resolved"]);
export const reviewQueuePriorityEnum = pgEnum("review_queue_priority", ["P0", "P1", "P2"]);
export const approverRoleEnum = pgEnum("approver_role", ["operator", "medical", "legal", "client"]);

// === ClinicProfile (C-01) ===

export const clinicProfile = pgTable(
  "clinic_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().default("clinic"),
    name: text("name").notNull(),
    alternateName: text("alternate_name"),
    legalEntityName: text("legal_entity_name"),
    slogan: text("slogan"),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    foundingDate: date("founding_date"),
    founder: text("founder"),
    logoUrl: text("logo_url").notNull(),
    ogImageUrl: text("og_image_url").notNull(),
    businessRegistrationNumber: text("business_registration_number"),
    // C0051 — 네이버 서치어드바이저 소유확인 토큰 (사이트 <head> meta 출력). 콘텐츠 metadata 와 분리.
    naverSiteVerification: text("naver_site_verification"),
    // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
    policyContactPerson: text("policy_contact_person"),
    policyContactEmail: text("policy_contact_email"),
    policyContactPhone: text("policy_contact_phone"),
    policyEffectiveDate: date("policy_effective_date"),
    // ADMIN_BUSINESS_ENTITIES v1 § 3 (C0045): 운영용 primary contact (operator ↔ client 일상 — 외부 비공개)
    primaryContactName: text("primary_contact_name").notNull().default(""),
    primaryContactPhone: text("primary_contact_phone").notNull().default(""),
    primaryContactEmail: text("primary_contact_email").notNull().default(""),
    primaryContactRole: text("primary_contact_role").notNull().default(""),
    // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
    primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
    slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
    // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
    policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
    // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
    instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  }),
);

// === LocationProfile (C-21·M0-18 country regex) ===

export const locationProfile = pgTable(
  "location_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    streetAddress: text("street_address").notNull(),
    addressLocality: text("address_locality").notNull(),
    addressRegion: text("address_region").notNull(),
    postalCode: text("postal_code").notNull(),
    addressCountry: text("address_country").notNull().default("KR"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    phone: text("phone"),
    email: text("email"),
    // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
    clinicProfileId: uuid("clinic_profile_id").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
    latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
    lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
    emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
    phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
    // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
    clinicFk: foreignKey({
      columns: [t.instanceId, t.clinicProfileId],
      foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
      name: "location_profile_clinic_fk",
    }).onDelete("cascade"),
    instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
    clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  }),
);

// === DoctorProfile (C-02) ===

export const doctorProfile = pgTable(
  "doctor_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    title: text("title"),
    jobTitle: text("job_title"),
    honorific: text("honorific"),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    cvPhotoUrl: text("cv_photo_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
    activeOrderIdx: index("doctor_profile_active_order_idx")
      .on(t.instanceId, t.active, t.displayOrder)
      .where(sql`${t.active} = true`),
  }),
);

// === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===

export const treatmentPage = pgTable(
  "treatment_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
    publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
    statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("treatment_page_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  }),
);

// === Article (C-04·M0-05 ON DELETE NO ACTION) ===

export const article = pgTable(
  "article",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    authorDoctorId: uuid("author_doctor_id"),
    // v0.4 (EC-SCHEMA-05 · cycle 1 ECP-03): C-04 Article.category required — staged C0013 migration 으로 SET NOT NULL.
    //   Drizzle schema 안 .notNull() 는 SoT 표현. C0013 (1)~(4) 단계 통과 후 도달.
    categoryId: uuid("category_id").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
    publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_instance_idx").on(t.instanceId),
    statusIdx: index("article_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("article_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("article_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
    // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
    authorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "article_author_fk",
    }),
    // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
    //   forward-reference 회피를 위해 Drizzle schema 안 미표현 (drizzle-kit 미사용 · raw SQL SoT).
  }),
);

// === MedicalConditionPage (C-05·EXPOSURE_READINESS Phase B — C0040 migration) ===
//   P-007/P-008 Conditions 격상 — 의료 검색 유입 페이지 (전환 페이지 Treatment 와 분리).

export const medicalConditionPage = pgTable(
  "medical_condition_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    primaryTreatmentId: uuid("primary_treatment_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("medical_condition_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("medical_condition_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("medical_condition_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
    publishedRequiresAt: check("medical_condition_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("medical_condition_page_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("medical_condition_page_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("medical_condition_page_instance_idx").on(t.instanceId),
    statusIdx: index("medical_condition_page_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("medical_condition_page_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    treatmentIdx: index("medical_condition_page_treatment_idx")
      .on(t.instanceId, t.primaryTreatmentId)
      .where(sql`${t.primaryTreatmentId} IS NOT NULL`),
    primaryTreatmentFk: foreignKey({
      columns: [t.instanceId, t.primaryTreatmentId],
      foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
      name: "medical_condition_page_primary_treatment_fk",
    }).onDelete("set null"),
  }),
);

// === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===

export const legalDocument = pgTable(
  "legal_document",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    documentType: legalDocumentTypeEnum("document_type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    autoGenerated: boolean("auto_generated").notNull().default(true),
    templateVersion: text("template_version"),
    // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
    effectiveDate: date("effective_date").notNull(),
    lastRevisedDate: date("last_revised_date"),
    contactPerson: text("contact_person"),
    contactEmail: text("contact_email"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
    complianceRecordId: uuid("compliance_record_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
    emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LL-SCHEMA-05 + cycle1 LL-22
    templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
    autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
    // v0.5 (COMPLIANCE_ASSISTANT_M0): skeleton-limit CHECK 3건 제거 — C0016 안 DROP CONSTRAINT.
    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
    instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
    // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
    type5Unique: uniqueIndex("legal_document_instance_5type_unique")
      .on(t.instanceId, t.documentType)
      .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
    instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
  }),
);

// === EAT_CONTENT v1.0 v0.4 cascade — 4 신규 entity ===

// EC-SCHEMA-12 (C-25 SoT) — media_channel_type enum 4종.
//   JSON-LD `@type` 매핑은 v0.1 단계 모두 VideoObject 단일화. EC-DEFER-11 (M1) BroadcastEvent/NewsArticle 분기.
export const mediaChannelTypeEnum = pgEnum("media_channel_type", [
  "broadcast", "youtube", "podcast", "press",
]);

// === ArticleCategory (C-22·EC-SCHEMA-01) ===
//   v0.1 풀명세 컬럼 모두 추가 — 어드민 UI minimal (slug·name·displayOrder 만 노출).
//   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
export const articleCategory = pgTable(
  "article_category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    pillar: text("pillar"),
    parentCategoryId: uuid("parent_category_id"),
    coverImageUrl: text("cover_image_url"),
    seoMeta: jsonb("seo_meta"),
    displayOrder: integer("display_order").notNull().default(0),
    articleTypeDefault: text("article_type_default"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
    descLen: check("article_category_description_length",
      sql`${t.description} IS NULL OR length(${t.description}) BETWEEN 80 AND 200`),
    coverImageUrlFormat: check("article_category_cover_image_url_format",
      sql`${t.coverImageUrl} IS NULL OR ${t.coverImageUrl} ~ '^https?://'`),
    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
    parentIdx: index("article_category_parent_idx")
      .on(t.instanceId, t.parentCategoryId)
      .where(sql`${t.parentCategoryId} IS NOT NULL`),
    // self-referencing composite FK (same-tenant) — DB ADD CONSTRAINT C0009 raw SQL SoT.
    //   parent_category_id 가 nullable 이므로 Drizzle 도 표현 가능.
    parentFk: foreignKey({
      columns: [t.instanceId, t.parentCategoryId],
      foreignColumns: [t.instanceId, t.id],
      name: "article_category_parent_fk",
    }),
  }),
);

// === Publication (C-24·EC-SCHEMA-08) ===
//   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
//   DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
export const publication = pgTable(
  "publication",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    authors: jsonb("authors").notNull(),
    journal: text("journal"),
    publishedDate: date("published_date").notNull(),
    doi: text("doi"),
    pubmedId: text("pubmed_id"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    // EXPOSURE_READINESS Phase D (C0041) — 외부 권위 citation 모델.
    publicationType: text("publication_type").notNull().default("internal-research")
      .$type<"internal-research" | "external-authority" | "government" | "academic-society" | "statistics">(),
    publisherName: text("publisher_name"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
    complianceRecordId: uuid("compliance_record_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("publication_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    doiFormat: check("publication_doi_format",
      sql`${t.doi} IS NULL OR ${t.doi} ~ '^10\\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'`),
    pubmedIdFormat: check("publication_pubmed_id_format",
      sql`${t.pubmedId} IS NULL OR ${t.pubmedId} ~ '^[0-9]{1,9}$'`),
    authorsArray: check("publication_authors_array",
      sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("publication_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("publication_instance_idx").on(t.instanceId),
    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("publication_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("publication_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "publication_author_doctor_fk",
    }),
  }),
);

// === MediaAppearance (C-25·EC-SCHEMA-11) ===
//   미디어 출연. v0.1 단계 JSON-LD `@type` = VideoObject 단일화 (모든 channel_type).
export const mediaAppearance = pgTable(
  "media_appearance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    channelName: text("channel_name").notNull(),
    channelType: mediaChannelTypeEnum("channel_type").notNull(),
    publishedDate: date("published_date").notNull(),
    durationSeconds: integer("duration_seconds"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
    complianceRecordId: uuid("compliance_record_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
    urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    durationPositive: check("media_appearance_duration_positive",
      sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`),
    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("media_appearance_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
    statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("media_appearance_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("media_appearance_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "media_appearance_author_doctor_fk",
    }),
  }),
);

// === FAQ (C-12·EC-SCHEMA-13) ===
//   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
//   LegalDocument LL-SCHEMA-03·04 패턴 정합.
export const faq = pgTable(
  "faq",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    categoryId: uuid("category_id"),
    relatedTreatmentId: uuid("related_treatment_id"),
    relatedConditionId: uuid("related_condition_id"),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    complianceRecordId: uuid("compliance_record_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
    // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("faq_instance_idx").on(t.instanceId),
    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("faq_published_idx")
      .on(t.instanceId, t.publishedAt, t.displayOrder)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    categoryIdx: index("faq_category_idx")
      .on(t.instanceId, t.categoryId)
      .where(sql`${t.categoryId} IS NOT NULL`),
    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
    categoryFk: foreignKey({
      columns: [t.instanceId, t.categoryId],
      foreignColumns: [articleCategory.instanceId, articleCategory.id],
      name: "faq_category_fk",
    }),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "faq_author_doctor_fk",
    }),
    relatedTreatmentFk: foreignKey({
      columns: [t.instanceId, t.relatedTreatmentId],
      foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
      name: "faq_related_treatment_fk",
    }),
    // related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외).
  }),
);

// === v0.5 COMPLIANCE_ASSISTANT_M0 — ComplianceRecord (C-10 skeleton) + ReviewQueueEntry (REVIEW_WORKFLOW § 3) ===

export const complianceRecord = pgTable(
  "compliance_record",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    contentType: complianceContentTypeEnum("content_type").notNull(),
    contentRef: text("content_ref").notNull(),
    pageRiskLevel: riskLevelEnum("page_risk_level").notNull(),
    articleType: text("article_type"),
    inlineRiskFlags: jsonb("inline_risk_flags").notNull().default(sql`'[]'::jsonb`),
    autoCheckResult: jsonb("auto_check_result").notNull(),
    peerReviewer: uuid("peer_reviewer"),
    peerReviewedAt: timestamp("peer_reviewed_at", { withTimezone: true }),
    physicianApprover: uuid("physician_approver"),
    physicianApprovedAt: timestamp("physician_approved_at", { withTimezone: true }),
    legalCounsel: uuid("legal_counsel"),
    legalCounselAt: timestamp("legal_counsel_at", { withTimezone: true }),
    clientApprover: uuid("client_approver"),
    clientApprovedAt: timestamp("client_approved_at", { withTimezone: true }),
    priorReviewRequired: boolean("prior_review_required").notNull().default(false),
    priorReviewSubmissionId: text("prior_review_submission_id"),
    priorReviewPassed: boolean("prior_review_passed"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    publishedBy: uuid("published_by"),
    recordPhase: complianceRecordPhaseEnum("record_phase").notNull().default("pre-publish"),
    recordVersion: integer("record_version").notNull().default(1),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    versionPositive: check("compliance_record_version_positive", sql`${t.recordVersion} >= 1`),
    publishedRequiresAt: check("compliance_record_published_requires_at",
      sql`${t.recordPhase} <> 'published' OR (${t.publishedAt} IS NOT NULL AND ${t.publishedBy} IS NOT NULL)`),
    legalDocRequiresLegal: check("compliance_record_legal_doc_requires_legal",
      sql`${t.recordPhase} <> 'published' OR ${t.contentType} <> 'LegalDocument' OR (${t.legalCounsel} IS NOT NULL AND ${t.legalCounselAt} IS NOT NULL)`),
    medHighRequiresPhysician: check("compliance_record_med_high_requires_physician",
      sql`${t.recordPhase} <> 'published' OR ${t.pageRiskLevel} = 'Low' OR (${t.physicianApprover} IS NOT NULL AND ${t.physicianApprovedAt} IS NOT NULL)`),
    publishedRequiresPeer: check("compliance_record_published_requires_peer",
      sql`${t.recordPhase} <> 'published' OR (${t.peerReviewer} IS NOT NULL AND ${t.peerReviewedAt} IS NOT NULL)`),
    uniqueVersion: unique("compliance_record_unique_version").on(t.instanceId, t.contentType, t.contentRef, t.recordVersion),
    instanceIdUnique: unique("compliance_record_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("compliance_record_instance_idx").on(t.instanceId),
    contentRefIdx: index("compliance_record_content_ref_idx").on(t.instanceId, t.contentType, t.contentRef),
    phaseIdx: index("compliance_record_phase_idx").on(t.instanceId, t.recordPhase),
  }),
);

export const reviewQueueEntry = pgTable(
  "review_queue_entry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    queueType: reviewQueueTypeEnum("queue_type").notNull(),
    contentType: complianceContentTypeEnum("content_type").notNull(),
    contentRef: text("content_ref").notNull(),
    complianceRecordId: uuid("compliance_record_id").notNull(),
    status: reviewQueueStatusEnum("status").notNull().default("open"),
    priority: reviewQueuePriorityEnum("priority").notNull().default("P0"),
    // approver_role[] — drizzle 의 array helper 없으므로 raw text 로 표현. raw SQL C0015 에서 enum array 정의.
    //   Drizzle 으로는 jsonb 대용 표현 — drizzle-orm 안 .array() 미지원 시 raw "approver_role[]" 으로 별도 helper.
    requiredRoles: text("required_roles").array().notNull(),
    assignedTo: uuid("assigned_to"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    slaDueAt: timestamp("sla_due_at", { withTimezone: true }).notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: uuid("resolved_by"),
    resolutionType: text("resolution_type"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
    resolvedRequiresAt: check("review_queue_entry_resolved_requires_at",
      sql`${t.status} <> 'resolved' OR ${t.resolvedAt} IS NOT NULL`),
    resolvedRequiresType: check("review_queue_entry_resolved_requires_type",
      sql`${t.status} <> 'resolved' OR ${t.resolutionType} IS NOT NULL`),
    complianceFk: foreignKey({
      columns: [t.instanceId, t.complianceRecordId],
      foreignColumns: [complianceRecord.instanceId, complianceRecord.id],
      name: "review_queue_entry_compliance_fk",
    }),
    instanceIdUnique: unique("review_queue_entry_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("review_queue_entry_instance_idx").on(t.instanceId),
    statusIdx: index("review_queue_entry_status_idx").on(t.instanceId, t.status),
    openPriorityIdx: index("review_queue_entry_open_priority_idx")
      .on(t.instanceId, t.priority, t.slaDueAt)
      .where(sql`${t.status} IN ('open', 'in-progress')`),
    contentIdx: index("review_queue_entry_content_idx").on(t.instanceId, t.contentType, t.contentRef),
    // v0.7 - CAP-CODE3-02 정정 - compliance_record_id 포함 5-tuple (record_version 별 unique scope 분리)
    openUnique: uniqueIndex("review_queue_entry_open_unique")
      .on(t.instanceId, t.contentType, t.contentRef, t.queueType, t.complianceRecordId)
      .where(sql`${t.status} IN ('open', 'in-progress')`),
  }),
);

// === SEO_VISIBILITY_OPS_PLAN v0.2 — 4 entity 추가 (C0031~C0034) ===
//   keyword_target · keyword_content_link · content_entity_link · seo_readiness_snapshot
//   모두 폴리모픽 패턴 (compliance_record 답습) + tenant_isolation RLS + TEXT + CHECK whitelist (enum 미사용 — ADD VALUE 부담 회피)

export type KeywordType = "primary" | "secondary";
export type KeywordIntent = "informational" | "comparison" | "pre-booking" | "local";
export type KeywordPriority = "P0" | "P1" | "P2";
export type KeywordStatus = "active" | "paused" | "won" | "dropped";
// EXPOSURE_READINESS Phase B — MedicalConditionPage 합류 (C0040 migration 안 CHECK 확장).
export type SeoLinkSourceType = "Article" | "TreatmentPage" | "FAQ" | "MedicalConditionPage";
export type SeoLinkTargetType = "Publication" | "MediaAppearance" | "FAQ" | "TreatmentPage" | "Article" | "MedicalConditionPage";
export type SeoLinkRelationType = "cites" | "related-to" | "derived-from";
export type SeoKeywordEntityType = "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ" | "Publication" | "MediaAppearance";
export type SeoReadinessEntityType =
  | "Article" | "TreatmentPage" | "FAQ" | "Publication" | "MediaAppearance" | "DoctorProfile" | "ClinicProfile";
export type SeoReadinessGrade = "A" | "B" | "C" | "D" | "F";

// === KeywordTarget (C0031) ===

export const keywordTarget = pgTable(
  "keyword_target",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    keywordType: text("keyword_type").notNull().$type<KeywordType>(),
    parentId: uuid("parent_id"),
    intent: text("intent").notNull().$type<KeywordIntent>(),
    priority: text("priority").notNull().default("P1").$type<KeywordPriority>(),
    difficulty: integer("difficulty"),
    regionScope: text("region_scope"),
    status: text("status").notNull().default("active").$type<KeywordStatus>(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    // 한글 허용 (SVO-CRITIQUE-01) — instance.slug 와 의도적 분리
    slugRegex: check("keyword_target_slug_regex", sql`${t.slug} ~ '^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$'`),
    labelLen: check("keyword_target_label_length", sql`length(${t.label}) BETWEEN 1 AND 100`),
    keywordTypeCheck: check("keyword_target_keyword_type_check", sql`${t.keywordType} IN ('primary', 'secondary')`),
    intentCheck: check("keyword_target_intent_check", sql`${t.intent} IN ('informational', 'comparison', 'pre-booking', 'local')`),
    priorityCheck: check("keyword_target_priority_check", sql`${t.priority} IN ('P0', 'P1', 'P2')`),
    statusCheck: check("keyword_target_status_check", sql`${t.status} IN ('active', 'paused', 'won', 'dropped')`),
    difficultyRange: check("keyword_target_difficulty_range",
      sql`${t.difficulty} IS NULL OR ${t.difficulty} BETWEEN 0 AND 100`),
    instanceSlugUnique: unique("keyword_target_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("keyword_target_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("keyword_target_instance_idx").on(t.instanceId),
    statusIdx: index("keyword_target_status_idx").on(t.instanceId, t.status, t.priority),
    parentIdx: index("keyword_target_parent_idx")
      .on(t.instanceId, t.parentId)
      .where(sql`${t.parentId} IS NOT NULL`),
    // self-referencing composite FK — same-tenant 강제
    parentFk: foreignKey({
      columns: [t.instanceId, t.parentId],
      foreignColumns: [t.instanceId, t.id],
      name: "keyword_target_parent_fk",
    }).onDelete("set null"),
  }),
);

// === ContentCalendarEvent (C0050) — 운영자 추가 "계획 일정" (CONTENT_CALENDAR_PLAN v1.1 · CCAL-DEFER-02) ===

export type ContentCalendarEntityType =
  | "Article"
  | "TreatmentPage"
  | "MedicalConditionPage"
  | "FAQ"
  | "Publication"
  | "MediaAppearance"
  | "LegalDocument";

export const contentCalendarEvent = pgTable(
  "content_calendar_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    plannedDate: date("planned_date").notNull(),
    entityType: text("entity_type").$type<ContentCalendarEntityType>(),
    note: text("note"),
    done: boolean("done").notNull().default(false),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    titleLen: check("content_calendar_event_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    entityTypeCheck: check(
      "content_calendar_event_entity_type_check",
      sql`${t.entityType} IS NULL OR ${t.entityType} IN ('Article', 'TreatmentPage', 'MedicalConditionPage', 'FAQ', 'Publication', 'MediaAppearance', 'LegalDocument')`,
    ),
    noteLen: check("content_calendar_event_note_length", sql`${t.note} IS NULL OR length(${t.note}) <= 500`),
    instanceDateIdx: index("content_calendar_event_instance_date_idx").on(t.instanceId, t.plannedDate),
    instanceOpenIdx: index("content_calendar_event_instance_open_idx")
      .on(t.instanceId, t.done)
      .where(sql`${t.done} = false`),
  }),
);

// === KeywordContentLink (C0032) — keyword ↔ 콘텐츠 다대다 폴리모픽 ===

export const keywordContentLink = pgTable(
  "keyword_content_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    keywordId: uuid("keyword_id").notNull(),
    entityType: text("entity_type").notNull().$type<SeoKeywordEntityType>(),
    entityId: uuid("entity_id").notNull(),
    relevanceScore: integer("relevance_score").notNull().default(50),
    isPrimary: boolean("is_primary").notNull().default(false),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityTypeCheck: check("keyword_content_link_entity_type_check",
      sql`${t.entityType} IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance')`),
    relevanceRange: check("keyword_content_link_relevance_range",
      sql`${t.relevanceScore} BETWEEN 1 AND 100`),
    linkUnique: unique("keyword_content_link_unique")
      .on(t.instanceId, t.keywordId, t.entityType, t.entityId),
    instanceIdx: index("keyword_content_link_instance_idx").on(t.instanceId),
    keywordIdx: index("keyword_content_link_keyword_idx").on(t.instanceId, t.keywordId),
    entityIdx: index("keyword_content_link_entity_idx").on(t.instanceId, t.entityType, t.entityId),
    primaryIdx: index("keyword_content_link_primary_idx")
      .on(t.instanceId, t.keywordId)
      .where(sql`${t.isPrimary} = true`),
    keywordFk: foreignKey({
      columns: [t.instanceId, t.keywordId],
      foreignColumns: [keywordTarget.instanceId, keywordTarget.id],
      name: "keyword_content_link_keyword_fk",
    }).onDelete("cascade"),
  }),
);

// === ContentEntityLink (C0033) — 콘텐츠 ↔ 콘텐츠/엔티티 근거 link (최우선 entity) ===
//   v1 vocabulary 3종: cites · related-to · derived-from. authored-by 는 author_doctor_id FK SoT (SVO-CASCADE-05).

export const contentEntityLink = pgTable(
  "content_entity_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    sourceType: text("source_type").notNull().$type<SeoLinkSourceType>(),
    sourceId: uuid("source_id").notNull(),
    targetType: text("target_type").notNull().$type<SeoLinkTargetType>(),
    targetId: uuid("target_id").notNull(),
    relationType: text("relation_type").notNull().$type<SeoLinkRelationType>(),
    displayOrder: integer("display_order").notNull().default(0),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sourceTypeCheck: check("content_entity_link_source_type_check",
      sql`${t.sourceType} IN ('Article', 'TreatmentPage', 'FAQ')`),
    targetTypeCheck: check("content_entity_link_target_type_check",
      sql`${t.targetType} IN ('Publication', 'MediaAppearance', 'FAQ', 'TreatmentPage', 'Article')`),
    relationTypeCheck: check("content_entity_link_relation_type_check",
      sql`${t.relationType} IN ('cites', 'related-to', 'derived-from')`),
    linkUnique: unique("content_entity_link_unique")
      .on(t.instanceId, t.sourceType, t.sourceId, t.targetType, t.targetId, t.relationType),
    notSelf: check("content_entity_link_not_self",
      sql`NOT (${t.sourceType} = ${t.targetType} AND ${t.sourceId} = ${t.targetId})`),
    instanceIdx: index("content_entity_link_instance_idx").on(t.instanceId),
    sourceIdx: index("content_entity_link_source_idx")
      .on(t.instanceId, t.sourceType, t.sourceId, t.relationType),
    targetIdx: index("content_entity_link_target_idx")
      .on(t.instanceId, t.targetType, t.targetId, t.relationType),
  }),
);

// === SeoReadinessSnapshot (C0034) — entity 별 readiness 캐시 (최신 1건) ===

// === SEARCH_VISIBILITY_INGEST_PLAN v0.3 — 3 entity 추가 (C0035~C0037) ===
//   search_property · search_visibility_snapshot · search_sync_state.
//   외부 search source (Google Search Console / 향후 Naver/Bing) ingestion + 시계열 보존 + sync lock.

export type SearchSource = "google-search-console" | "naver-searchadvisor" | "bing-webmaster";
export type SearchVerificationStatus = "pending" | "verified" | "failed";
export type SearchSyncStatus = "never-synced" | "running" | "success" | "partial" | "failed";

// NAVER_SEARCH_INGEST_PLAN v0.2 § 2.2 — GSC ↔ NSA 검증 방식 분기 (C0038)
export type SearchPropertyVerificationMethod =
  | "gsc-service-account"
  | "naver-meta-tag"
  | "naver-html-file"
  | "naver-dns-record";

// === SearchProperty (C0035 + C0038 verification_method) ===

export const searchProperty = pgTable(
  "search_property",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    source: text("source").notNull().$type<SearchSource>(),
    propertyUrl: text("property_url").notNull(),
    verificationStatus: text("verification_status").notNull().default("pending").$type<SearchVerificationStatus>(),
    verificationMethod: text("verification_method").notNull().$type<SearchPropertyVerificationMethod>(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  },
  (t) => ({
    sourceCheck: check("search_property_source_check",
      sql`${t.source} IN ('google-search-console', 'naver-searchadvisor', 'bing-webmaster')`),
    verificationCheck: check("search_property_verification_check",
      sql`${t.verificationStatus} IN ('pending', 'verified', 'failed')`),
    verificationMethodCheck: check("search_property_verification_method_check",
      sql`${t.verificationMethod} IN ('gsc-service-account', 'naver-meta-tag', 'naver-html-file', 'naver-dns-record')`),
    urlFormat: check("search_property_url_format",
      sql`${t.propertyUrl} ~ '^(https?://|sc-domain:)'`),
    instanceSourceUrlUnique: unique("search_property_instance_source_url_unique")
      .on(t.instanceId, t.source, t.propertyUrl),
    instanceIdUnique: unique("search_property_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("search_property_instance_idx").on(t.instanceId),
  }),
);

// === SearchVisibilitySnapshot (C0036) ===

export const searchVisibilitySnapshot = pgTable(
  "search_visibility_snapshot",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id").notNull(),
    source: text("source").notNull().$type<SearchSource>(),
    snapshotDate: date("snapshot_date").notNull(),
    pageUrl: text("page_url").notNull(),
    query: text("query").notNull(),
    impressions: integer("impressions").notNull(),
    clicks: integer("clicks").notNull(),
    ctr: numeric("ctr", { precision: 6, scale: 5 }).notNull(),
    avgPosition: numeric("avg_position", { precision: 6, scale: 2 }).notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    impressionsNonneg: check("svs_impressions_nonneg", sql`${t.impressions} >= 0`),
    clicksNonneg: check("svs_clicks_nonneg", sql`${t.clicks} >= 0`),
    clicksLeImpressions: check("svs_clicks_le_impressions", sql`${t.clicks} <= ${t.impressions}`),
    ctrRange: check("svs_ctr_range", sql`${t.ctr} >= 0 AND ${t.ctr} <= 1`),
    positionRange: check("svs_position_range", sql`${t.avgPosition} > 0 AND ${t.avgPosition} <= 1000`),
    dimensionsUnique: unique("svs_unique_dimensions")
      .on(t.instanceId, t.propertyId, t.snapshotDate, t.pageUrl, t.query),
    propertyFk: foreignKey({
      columns: [t.instanceId, t.propertyId],
      foreignColumns: [searchProperty.instanceId, searchProperty.id],
      name: "svs_property_fk",
    }).onDelete("cascade"),
    instanceDateIdx: index("svs_instance_date_idx").on(t.instanceId, t.snapshotDate),
    pageIdx: index("svs_page_idx").on(t.instanceId, t.pageUrl, t.snapshotDate),
    queryIdx: index("svs_query_idx").on(t.instanceId, t.query, t.snapshotDate),
  }),
);

// === SearchSyncState (C0037) — 동시 실행 락 + partial metadata ===

export const searchSyncState = pgTable(
  "search_sync_state",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id").notNull(),
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
    lastSyncedDate: date("last_synced_date"),
    lastStatus: text("last_status").notNull().default("never-synced").$type<SearchSyncStatus>(),
    lastError: text("last_error"),
    syncStartedAt: timestamp("sync_started_at", { withTimezone: true }),
    lockToken: text("lock_token"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusCheck: check("sss_status_check",
      sql`${t.lastStatus} IN ('never-synced', 'running', 'success', 'partial', 'failed')`),
    runningRequiresLock: check("sss_running_requires_lock",
      sql`${t.lastStatus} <> 'running' OR (${t.syncStartedAt} IS NOT NULL AND ${t.lockToken} IS NOT NULL)`),
    propertyUnique: unique("sss_property_unique").on(t.instanceId, t.propertyId),
    propertyFk: foreignKey({
      columns: [t.instanceId, t.propertyId],
      foreignColumns: [searchProperty.instanceId, searchProperty.id],
      name: "sss_property_fk",
    }).onDelete("cascade"),
    instanceIdx: index("search_sync_state_instance_idx").on(t.instanceId),
  }),
);

export const seoReadinessSnapshot = pgTable(
  "seo_readiness_snapshot",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull().$type<SeoReadinessEntityType>(),
    entityId: uuid("entity_id").notNull(),
    score: integer("score").notNull(),
    grade: text("grade").notNull().$type<SeoReadinessGrade>(),
    checks: jsonb("checks").notNull().default(sql`'[]'::jsonb`),
    blockingIssues: jsonb("blocking_issues").notNull().default(sql`'[]'::jsonb`),
    recommendations: jsonb("recommendations").notNull().default(sql`'[]'::jsonb`),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityTypeCheck: check("seo_readiness_snapshot_entity_type_check",
      sql`${t.entityType} IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance', 'DoctorProfile', 'ClinicProfile')`),
    scoreRange: check("seo_readiness_snapshot_score_range", sql`${t.score} BETWEEN 0 AND 100`),
    gradeCheck: check("seo_readiness_snapshot_grade_check", sql`${t.grade} IN ('A', 'B', 'C', 'D', 'F')`),
    checksArray: check("seo_readiness_snapshot_checks_array", sql`jsonb_typeof(${t.checks}) = 'array'`),
    blockingArray: check("seo_readiness_snapshot_blocking_array", sql`jsonb_typeof(${t.blockingIssues}) = 'array'`),
    recommendationsArray: check("seo_readiness_snapshot_recommendations_array",
      sql`jsonb_typeof(${t.recommendations}) = 'array'`),
    entityUnique: unique("seo_readiness_snapshot_unique").on(t.instanceId, t.entityType, t.entityId),
    instanceIdx: index("seo_readiness_snapshot_instance_idx").on(t.instanceId),
    gradeIdx: index("seo_readiness_snapshot_grade_idx").on(t.instanceId, t.grade),
    scoreIdx: index("seo_readiness_snapshot_score_idx").on(t.instanceId, t.score),
    staleIdx: index("seo_readiness_snapshot_stale_idx").on(t.instanceId, t.computedAt),
  }),
);

// === llm_call_log (CONTENT_AI_ASSIST_PLAN v1.0 · C0043) ===
// Anthropic Claude API call audit — token usage · cost · accepted flag.
// C0026 답습 (FORCE RLS · NULLIF safe-fetch · 2 index).

export type LlmPromptTemplate =
  | "seo-meta-suggest"
  | "keyword-match-suggest"
  | "review-comment-suggest"
  | "article-full-draft"
  | "article-brief-draft"
  | "treatment-page-full-draft"
  | "medical-condition-page-full-draft"
  | "faq-full-draft";
export type LlmCallStatus = "success" | "error" | "rate-limited" | "cap-exceeded";

export const llmCallLog = pgTable(
  "llm_call_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    promptTemplate: text("prompt_template").notNull().$type<LlmPromptTemplate>(),
    model: text("model").notNull(),
    entityType: text("entity_type"),
    entityId: uuid("entity_id"),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    cacheReadTokens: integer("cache_read_tokens").notNull().default(0),
    cacheWriteTokens: integer("cache_write_tokens").notNull().default(0),
    latencyMs: integer("latency_ms").notNull(),
    costUsd: numeric("cost_usd", { precision: 10, scale: 6 }).notNull(),
    status: text("status").notNull().$type<LlmCallStatus>(),
    errorMessage: text("error_message"),
    accepted: boolean("accepted"),
    triggeredBy: uuid("triggered_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    templateEnum: check("llm_call_log_template_enum",
      sql`${t.promptTemplate} IN ('seo-meta-suggest','keyword-match-suggest','review-comment-suggest','article-full-draft','article-brief-draft')`),
    statusEnum: check("llm_call_log_status_enum",
      sql`${t.status} IN ('success','error','rate-limited','cap-exceeded')`),
    tokensNonneg: check("llm_call_log_tokens_nonneg",
      sql`${t.inputTokens} >= 0 AND ${t.outputTokens} >= 0 AND ${t.cacheReadTokens} >= 0 AND ${t.cacheWriteTokens} >= 0`),
    latencyNonneg: check("llm_call_log_latency_nonneg", sql`${t.latencyMs} >= 0`),
    costNonneg: check("llm_call_log_cost_nonneg", sql`${t.costUsd} >= 0`),
    instanceTemplateTsIdx: index("llm_call_log_instance_template_ts_idx")
      .on(t.instanceId, t.promptTemplate, t.createdAt.desc()),
    instanceStatusTsIdx: index("llm_call_log_instance_status_ts_idx")
      .on(t.instanceId, t.status, t.createdAt.desc()),
  }),
);

// === conversion_event (MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 · C0042) ===
// Phase 6.5 v1 — 자체 beacon /api/track 기반 5 event 트래킹 + PIPA anonymized session_token.
// C0026 (consultation_request) 답습 — FORCE RLS + NULLIF safe-fetch + 2 policy + 3 index.

export type ConversionEventName =
  | "phone_click"
  | "kakao_click"
  | "booking_click"
  | "consult_form_start"
  | "consult_form_complete";

export const conversionEvent = pgTable(
  "conversion_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    eventName: text("event_name").notNull().$type<ConversionEventName>(),
    pagePath: text("page_path").notNull(),
    sessionToken: text("session_token").notNull(),
    utm: jsonb("utm").notNull().default(sql`'{}'::jsonb`),
    referrerHost: text("referrer_host"),
    uaFamily: text("ua_family"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    eventNameEnum: check("conversion_event_event_name_enum",
      sql`${t.eventName} IN ('phone_click','kakao_click','booking_click','consult_form_start','consult_form_complete')`),
    pagePathLength: check("conversion_event_page_path_length",
      sql`char_length(${t.pagePath}) BETWEEN 2 AND 512`),
    sessionTokenLength: check("conversion_event_session_token_length",
      sql`char_length(${t.sessionToken}) = 64`),
    referrerHostLength: check("conversion_event_referrer_host_length",
      sql`${t.referrerHost} IS NULL OR char_length(${t.referrerHost}) <= 255`),
    uaFamilyLength: check("conversion_event_ua_family_length",
      sql`${t.uaFamily} IS NULL OR char_length(${t.uaFamily}) <= 64`),
    instanceEventTsIdx: index("conversion_event_instance_event_ts_idx")
      .on(t.instanceId, t.eventName, t.createdAt.desc()),
    instancePathTsIdx: index("conversion_event_instance_path_ts_idx")
      .on(t.instanceId, t.pagePath, t.createdAt.desc()),
    sessionTsIdx: index("conversion_event_session_ts_idx")
      .on(t.instanceId, t.sessionToken, t.createdAt.desc()),
  }),
);

// === instance_contract (ADMIN_BUSINESS_ENTITIES_PLAN v1.0 · C0044) ===
// super-admin 의 비즈니스 계약/구독 status. instance 1:1 매핑 (이력 X · ABE-DEFER-01).
// RLS 미적용 — super-admin only · /admin context · admin role 직접 query.

export const instanceContract = pgTable(
  "instance_contract",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    planTier: text("plan_tier").notNull(),
    billingCycle: text("billing_cycle").notNull(),
    amountKrw: integer("amount_krw").notNull().default(0),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    contractHolderName: text("contract_holder_name").notNull().default(""),
    contractHolderEmail: text("contract_holder_email").notNull().default(""),
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusEnum: check("instance_contract_status_enum",
      sql`${t.status} IN ('trial','active','suspended','terminated')`),
    planTierEnum: check("instance_contract_plan_tier_enum",
      sql`${t.planTier} IN ('starter','standard','pro','custom')`),
    billingCycleEnum: check("instance_contract_billing_cycle_enum",
      sql`${t.billingCycle} IN ('monthly','yearly','custom')`),
    amountNonneg: check("instance_contract_amount_nonneg", sql`${t.amountKrw} >= 0`),
    datesOrder: check("instance_contract_dates_order",
      sql`${t.endDate} IS NULL OR ${t.endDate} >= ${t.startDate}`),
    holderNameLen: check("instance_contract_holder_name_len",
      sql`char_length(${t.contractHolderName}) <= 100`),
    holderEmailLen: check("instance_contract_holder_email_len",
      sql`char_length(${t.contractHolderEmail}) <= 200`),
    notesLen: check("instance_contract_notes_len",
      sql`char_length(${t.notes}) <= 2000`),
    instanceUnique: unique("instance_contract_unique").on(t.instanceId),
    statusIdx: index("instance_contract_status_idx").on(t.status),
    endDateIdx: index("instance_contract_end_date_idx").on(t.endDate),
  }),
);
