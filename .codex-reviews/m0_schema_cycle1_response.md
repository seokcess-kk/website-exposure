{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {
      "id": "M0-01",
      "finding": "M0 plan이 최신 INFRA v1.0과 충돌한다. INFRA §4.3은 NotificationEvent가 DB table이 아니라 notify() 입력 envelope이며 P0 DB subset은 Receipt/Log/PayloadRecord/DeliveryAttempt라고 정정했는데, M0_SCHEMA_PLAN은 NotificationEvent를 P0 table 및 v0.3 migration 대상으로 다시 명시한다.",
      "evidence": "docs/decisions/M0_SCHEMA_PLAN.md:30,49,66,111",
      "impact": "SoT cascade 실패. notifications-outbox schema 방향이 잘못 고정될 수 있다."
    },
    {
      "id": "M0-02",
      "finding": "content_publication_status enum이 REVIEW_WORKFLOW state machine과 정합하지 않다. SQL/Drizzle은 draft/in-review/approved/published/archived 5종만 두지만 SoT는 draft, review-queued, in-review, approved, publishable, published, blocked, rejected, stale 9종이다.",
      "evidence": "packages/core-content/migrations/C0004_treatment_page.sql:3-4, packages/core-content/src/schema.ts:31-33",
      "impact": "검수 큐, blocked/rejected/stale, approved와 publishable 분리 게이트를 DB 상태로 표현할 수 없다."
    },
    {
      "id": "M0-03",
      "finding": "RiskLevel enum이 SoT와 불일치한다. RISK_LEVELS/DATA_MODEL은 Low/Medium/High 3종인데 treatment_page/article은 low/medium/high/critical 소문자 4종을 허용한다.",
      "evidence": "packages/core-content/migrations/C0004_treatment_page.sql:15,25; packages/core-content/migrations/C0005_article.sql:21; packages/core-content/src/schema.ts:158,194",
      "impact": "compliance-assistant, ComplianceRecord.pageRiskLevel, RiskInference MAX 결합 결과와 저장값이 어긋난다."
    },
    {
      "id": "M0-04",
      "finding": "DATA_MODEL C-01의 locations[] 필수 1개 이상 관계가 구현되지 않았다. clinic_profile에는 location_profile과의 FK/join table이 없고, location_profile도 parentClinic/clinic_profile FK가 없다.",
      "evidence": "docs/decisions/M0_SCHEMA_PLAN.md:52-68; packages/core-content/migrations/C0001_clinic_profile.sql; packages/core-content/migrations/C0002_location_profile.sql",
      "impact": "단지점 main 1개 필수, 다지점 N개 cardinality를 DB가 전혀 보장하지 못한다."
    },
    {
      "id": "M0-05",
      "finding": "Article composite FK의 ON DELETE SET NULL이 잘못 설계됐다. FOREIGN KEY(instance_id, author_doctor_id) ON DELETE SET NULL은 기본적으로 두 referencing column 모두 NULL 대상이므로, instance_id NOT NULL과 충돌한다. Drizzle도 동일하게 .onDelete('set null')만 표현한다.",
      "evidence": "packages/core-content/migrations/C0005_article.sql:26-27; packages/core-content/src/schema.ts:207-211",
      "impact": "doctor_profile 삭제 시 FK action이 실패하거나 의도와 다르게 동작한다. author_doctor_id만 NULL 처리하도록 별도 column-list action 또는 delete 정책 변경이 필요하다."
    },
    {
      "id": "M0-06",
      "finding": "Drizzle schema와 raw SQL이 byte-equal 불가능하다. D0010의 instance_slug_active_idx가 Drizzle에 없고, C0005의 DEFERRABLE INITIALLY DEFERRED가 Drizzle FK에 없다.",
      "evidence": "packages/db/migrations/D0010_instance.sql:15-16; packages/core-content/src/schema.ts:22-26; packages/core-content/migrations/C0005_article.sql:27; packages/core-content/src/schema.ts:207-211",
      "impact": "M0 acceptance gate의 drizzle-kit generate 비교 조건을 만족할 수 없다."
    },
    {
      "id": "M0-07",
      "finding": "migration apply 순서와 cross-package dependency가 구현되어 있지 않다. core-content migrations는 instance table과 app_tenant_user role 존재를 전제하지만 migrations-runner는 placeholder export만 있고 package 간 depends_on manifest가 없다.",
      "evidence": "packages/migrations-runner/src/index.ts; packages/core-content/migrations/C0001_clinic_profile.sql:6,36,40",
      "impact": "빈 DB 또는 통합 runner에서 C0001~이 D0010/role 생성보다 먼저 실행되면 apply 실패한다."
    }
  ],
  "new_major_findings": [
    {
      "id": "M0-08",
      "finding": "M0 plan은 P0 ~15 tables라고 하면서 v0.1 실제 scope를 6 tables로 축소하고, MedicalSpecialty/ArticleCategory/ComplianceRecord/NotificationEvent를 defer한다. INFRA v1.0 §4.3·4.4의 Week 4 P0 critical subset과 수량/내용이 맞지 않는다.",
      "evidence": "docs/decisions/M0_SCHEMA_PLAN.md:12-33,52-67,108-113",
      "impact": "vertical slice가 'schema migration green' 목적의 P0 review/publish/notify flow를 닫지 못한다."
    },
    {
      "id": "M0-09",
      "finding": "TreatmentPage C-03의 required semantic fields(name/overview/mechanism/targetAudience/process/precautions/pageRiskLevel) 대부분이 title/body_markdown/metadata로 뭉개졌다. Article C-04도 author/reviewedBy/category/articleType/inlineRiskFlags 계열이 구조화되지 않았다.",
      "evidence": "packages/core-content/migrations/C0004_treatment_page.sql:9-20; packages/core-content/migrations/C0005_article.sql:6-16",
      "impact": "M0 minimal이라고 해도 RiskInference, schema output, review workflow가 기대하는 typed field path 검증이 어렵다."
    },
    {
      "id": "M0-10",
      "finding": "DoctorProfile은 jobTitle, briefBio, credentials, medicalSpecialty 최소 요구를 보장하지 않는다. job_title/bio가 nullable이고 credentials/specialty는 metadata 또는 deferred로만 처리된다.",
      "evidence": "packages/core-content/migrations/C0003_doctor_profile.sql:8-18",
      "impact": "medical reviewer eligibility와 E-E-A-T/의료진 자격 검증의 최소 DB 기반이 없다."
    },
    {
      "id": "M0-11",
      "finding": "clinic_profile은 C-01 v0.4의 위치·전화·시간 제거는 지켰지만, medicalSpecialty(required), locations(required), logoUrl/ogImageUrl URL validation, description/title 길이 외 주요 필수 관계를 보장하지 않는다.",
      "evidence": "packages/core-content/migrations/C0001_clinic_profile.sql:6-24",
      "impact": "C-01 SoT를 'minimal projection'으로 축소한 경계가 문서화·검증되지 않아 build contract와 DB contract가 갈라진다."
    },
    {
      "id": "M0-12",
      "finding": "location_profile의 phone은 optional이며 phone format CHECK도 없다. C-21은 위치·전화·시간·예약 채널의 master인데 businessHours/reservationChannels는 metadata로만 미뤄져 있다.",
      "evidence": "packages/core-content/migrations/C0002_location_profile.sql:14-22",
      "impact": "P-012/P-014 contact/location page의 핵심 master data를 DB가 보장하지 못한다."
    },
    {
      "id": "M0-13",
      "finding": "instance table이 C-08 InstanceManifest의 minimal projection이라고 하지만 C-08에서 cascade된 adminBaseUrl, timezone, notificationChannels, feature policyVersion/config, search/analytics/storage 관련 필드가 전혀 없고, 별도 InstanceManifest와 Instance의 경계도 명확하지 않다.",
      "evidence": "packages/db/migrations/D0010_instance.sql:4-12",
      "impact": "C-08 전체를 구현하지 않는 것은 가능하지만, 현재 이름과 SoT 주석은 InstanceManifest 대체처럼 읽혀 후속 cascade 충돌 위험이 크다."
    },
    {
      "id": "M0-14",
      "finding": "audit_log M0 extension이 plan에만 있고 실제 산출물이 없다. INFRA v1.0은 audit_log read path tenant-scoped RLS와 content_ref/action cascade를 명시했는데 D0010/core-content migrations에는 audit 연동이 없다.",
      "evidence": "docs/decisions/M0_SCHEMA_PLAN.md:35-38",
      "impact": "review workflow의 상태 전이/승인/발행 추적 요구를 v0.1 schema로 검증할 수 없다."
    },
    {
      "id": "M0-15",
      "finding": "instance table 자체에는 RLS/GRANT 정책이 없다. super-admin control-plane table로 둘 것인지 tenant-visible lookup으로 둘 것인지 결정이 문서화되어 있지 않다.",
      "evidence": "packages/db/migrations/D0010_instance.sql:4-16",
      "impact": "tenant resolution/read path에서 instance 목록 노출 정책이 불명확하다."
    }
  ],
  "new_minor_findings": [
    {
      "id": "M0-16",
      "finding": "slug regex가 DATA_MODEL 공통 @id 규약 3~64자와 불일치한다. instance는 2~63자, content tables는 1~100자를 허용한다.",
      "evidence": "packages/db/migrations/D0010_instance.sql:11; packages/core-content/migrations/C0001_clinic_profile.sql:23"
    },
    {
      "id": "M0-17",
      "finding": "TreatmentPage summary 주석은 80~200자 권장이라고 되어 있으나 DATA_MODEL C-03은 50~160자다. CHECK도 없다.",
      "evidence": "packages/core-content/migrations/C0004_treatment_page.sql:11"
    },
    {
      "id": "M0-18",
      "finding": "location_profile address_country는 length=2만 체크하고 대문자 ISO alpha-2 패턴을 강제하지 않는다.",
      "evidence": "packages/core-content/migrations/C0002_location_profile.sql:24"
    },
    {
      "id": "M0-19",
      "finding": "updated_at은 DEFAULT now()만 있고 update trigger가 없다. plan의 'updated_at 또는 trigger' 기준은 만족한다고 볼 수 있지만 실제 변경 시각 자동 갱신은 보장하지 않는다.",
      "evidence": "docs/decisions/M0_SCHEMA_PLAN.md:85"
    },
    {
      "id": "M0-20",
      "finding": "build/typecheck는 PASS다. `pnpm --filter @glitzy/core-content typecheck`와 `pnpm pkg:typecheck` 모두 성공했다. 단 이는 SQL apply, RLS behavior, Drizzle diff 검증을 대체하지 않는다."
    }
  ],
  "convergence_signal": "v0.1은 package 생성과 기본 tenant RLS 패턴 일부는 잡았지만, 최신 SoT cascade와 acceptance gate 기준에서는 아직 수렴 전이다. 특히 REVIEW_WORKFLOW 9-state, RiskLevel 3종, NotificationEvent 비-table 정정, Drizzle/raw SQL 동치성, C-01 locations 관계가 먼저 고쳐져야 다음 cycle에서 결함 수가 의미 있게 줄어든다.",
  "next_cycle_focus": "1) M0_SCHEMA_PLAN을 INFRA v1.0 §4.3/4.4에 맞게 재정렬(NotificationEvent table 제거, P0 notification subset 명확화). 2) status/risk enum을 SoT에 맞춰 수정. 3) clinic-location 필수 관계와 article author FK delete semantics 수정. 4) Drizzle와 raw SQL diff를 0으로 만들기. 5) 통합 migration manifest/depends_on과 SQL apply 검증 추가."
}