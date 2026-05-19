// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
//
// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
// 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
//
// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).

export type MigrationDescriptor = {
  /** 미가공 절대 경로 (repo root 기준 상대) */
  readonly file: string;
  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
  readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
  /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
  readonly creates: ReadonlyArray<string>;
  /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
  readonly dependsOn: ReadonlyArray<string>;
};

/**
 * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
 * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
 * runner 는 이 배열 순서대로 sequential apply (fail-fast).
 */
export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
  // (1) instance (multi-tenant root)
  {
    file: "packages/db/migrations/D0010_instance.sql",
    package: "@glitzy/db",
    creates: ["instance"],
    dependsOn: [],
  },
  // (2) clinic_profile
  {
    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
    package: "@glitzy/core-content",
    creates: ["clinic_profile"],
    dependsOn: ["instance"],
  },
  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
  {
    file: "packages/core-content/migrations/C0002_location_profile.sql",
    package: "@glitzy/core-content",
    creates: ["location_profile"],
    dependsOn: ["instance"],
  },
  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
  {
    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
    package: "@glitzy/core-content",
    creates: ["doctor_profile"],
    dependsOn: ["instance"],
  },
  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
  {
    file: "packages/core-content/migrations/C0004_treatment_page.sql",
    package: "@glitzy/core-content",
    creates: ["treatment_page", "content_publication_status"],
    dependsOn: ["instance"],
  },
  // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
  {
    file: "packages/core-content/migrations/C0005_article.sql",
    package: "@glitzy/core-content",
    creates: ["article", "risk_level"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
  },
  // (7) legal_document — content_publication_status + risk_level enum FK
  {
    file: "packages/core-content/migrations/C0006_legal_document.sql",
    package: "@glitzy/core-content",
    creates: ["legal_document", "legal_document_type"],
    dependsOn: ["instance", "content_publication_status", "risk_level"],
  },
  // (8) clinic_profile policy + primary_ctas (ALTER)
  {
    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
    package: "@glitzy/core-content",
    creates: [
      "clinic_profile.policy_contact_person",
      "clinic_profile.policy_contact_email",
      "clinic_profile.policy_contact_phone",
      "clinic_profile.policy_effective_date",
      "clinic_profile.primary_ctas",
      "clinic_profile_primary_ctas_validate",
      "clinic_profile_primary_ctas_trigger",
    ],
    dependsOn: ["clinic_profile"],
  },
  // (9) location_profile parentClinic composite FK (ALTER)
  {
    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
    package: "@glitzy/core-content",
    creates: [
      "location_profile.clinic_profile_id",
      "location_profile_clinic_fk",
      "location_profile_clinic_idx",
    ],
    dependsOn: ["clinic_profile", "location_profile"],
  },
  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
  {
    file: "packages/db/migrations/D0011_public_reader.sql",
    package: "@glitzy/db",
    creates: [
      "app_public_reader",
      "public_reader_instance_select",
      "public_reader_clinic_profile_select",
      "public_reader_location_profile_select",
      "public_reader_doctor_profile_select",
      "public_reader_treatment_page_select",
      "public_reader_article_select",
      "public_reader_legal_document_select",
    ],
    dependsOn: [
      "instance",
      "clinic_profile",
      "location_profile",
      "doctor_profile",
      "treatment_page",
      "article",
      "legal_document",
    ],
  },
  // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
  {
    file: "packages/core-content/migrations/C0009_article_category.sql",
    package: "@glitzy/core-content",
    creates: ["article_category"],
    dependsOn: ["instance"],
  },
  // (12) publication
  {
    file: "packages/core-content/migrations/C0010_publication.sql",
    package: "@glitzy/core-content",
    creates: ["publication"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  },
  // (13) media_appearance
  {
    file: "packages/core-content/migrations/C0011_media_appearance.sql",
    package: "@glitzy/core-content",
    creates: ["media_appearance", "media_channel_type"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  },
  // (14) faq
  {
    file: "packages/core-content/migrations/C0012_faq.sql",
    package: "@glitzy/core-content",
    creates: ["faq"],
    dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
  },
  // (15) article_category_fk — staged 4-step: ADD nullable + default `general` seed + backfill + SET NOT NULL + FK
  //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
  {
    file: "packages/core-content/migrations/C0013_article_category_fk.sql",
    package: "@glitzy/core-content",
    creates: [
      "article.category_id",
      "article_category_fk",
      "article_category_idx",
    ],
    dependsOn: ["article", "article_category"],
  },
  // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
  {
    file: "packages/db/migrations/D0014_public_reader_eat.sql",
    package: "@glitzy/db",
    creates: [
      "public_reader_article_category_select",
      "public_reader_publication_select",
      "public_reader_media_appearance_select",
      "public_reader_faq_select",
    ],
    dependsOn: [
      "app_public_reader",
      "article_category",
      "publication",
      "media_appearance",
      "faq",
    ],
  },
  // (17) C0014 compliance_record (COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.1 CA-SCHEMA-01)
  {
    file: "packages/core-content/migrations/C0014_compliance_record.sql",
    package: "@glitzy/core-content",
    creates: ["compliance_record", "compliance_record_phase", "compliance_content_type"],
    dependsOn: ["instance", "risk_level"],
  },
  // (18) C0015 review_queue_entry (CA-SCHEMA-04)
  {
    file: "packages/core-content/migrations/C0015_review_queue_entry.sql",
    package: "@glitzy/core-content",
    creates: [
      "review_queue_entry",
      "review_queue_type",
      "review_queue_status",
      "review_queue_priority",
      "approver_role",
    ],
    dependsOn: ["instance", "compliance_record", "compliance_content_type"],
  },
  // (19) C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger (CA-SCHEMA-07~10)
  {
    file: "packages/core-content/migrations/C0016_status_unlock.sql",
    package: "@glitzy/core-content",
    creates: [
      "article.compliance_record_id",
      "treatment_page.compliance_record_id",
      "legal_document.compliance_record_id",
      "publication.compliance_record_id",
      "media_appearance.compliance_record_id",
      "article_compliance_fk",
      "treatment_page_compliance_fk",
      "legal_document_compliance_fk",
      "faq_compliance_fk",
      "publication_compliance_fk",
      "media_appearance_compliance_fk",
      "article_published_requires_record",
      "treatment_page_published_requires_record",
      "legal_document_published_requires_record",
      "faq_published_requires_record",
      "publication_published_requires_record",
      "media_appearance_published_requires_record",
      "published_content_compliance_guard",
      "article_published_guard",
      "treatment_page_published_guard",
      "legal_document_published_guard",
      "faq_published_guard",
      "publication_published_guard",
      "media_appearance_published_guard",
    ],
    dependsOn: [
      "article",
      "treatment_page",
      "legal_document",
      "faq",
      "publication",
      "media_appearance",
      "compliance_record",
      "compliance_content_type",
    ],
  },
  // (20) C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
  //   COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.1 (CAP-10 acceptance blocker)
  //   Postgres 제약 - ALTER TYPE ADD VALUE single statement · COMMIT 분리 필요
  {
    file: "packages/core-content/migrations/C0017_content_gate_queue_enum.sql",
    package: "@glitzy/core-content",
    creates: ["review_queue_type.content-gate"],
    dependsOn: ["review_queue_type"],
  },
  // (21) C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
  //   COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.2
  //   기존: (instance_id, content_type, content_ref) · 변경: (instance_id, content_type, content_ref, queue_type)
  {
    file: "packages/core-content/migrations/C0018_review_queue_unique_redefine.sql",
    package: "@glitzy/core-content",
    creates: ["review_queue_entry_open_unique"],
    dependsOn: ["review_queue_entry", "review_queue_type.content-gate"],
  },
  // (22) C0019 review_queue_entry partial UNIQUE 안 compliance_record_id 포함 5-tuple
  //   COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 cycle 3 CAP-CODE3-02
  //   record_version 별 unique scope 분리 (이전 record 안 stale entry 가 새 record INSERT 충돌 회피)
  {
    file: "packages/core-content/migrations/C0019_review_queue_unique_record_scoped.sql",
    package: "@glitzy/core-content",
    creates: ["review_queue_entry_open_unique"],   // 같은 index 재정의
    dependsOn: ["review_queue_entry_open_unique"],
  },
];

/**
 * validateManifest — runner 가 sequential apply 직전 호출.
 * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
 * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
 */
export function validateManifest(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, m] of orderedMigrations.entries()) {
    for (const dep of m.dependsOn) {
      if (!seen.has(dep)) {
        errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
      }
    }
    for (const c of m.creates) seen.add(c);
  }
  return errors;
}
