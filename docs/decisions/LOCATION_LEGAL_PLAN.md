# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)

> **상태**: **v1.0 (acceptance)** — codex 자동 비평 **6 cycle 후 `closeableAfterPatch=true` 확정**. cycle6 finding 1 minor (LL-59) 잔재 정정 후 종료. blocking 0 · major 0 · minor 0 잔존. **59 findings 전건 처리 완료**. 수렴 추세 25→12→10→8→3→1.

> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).

본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.

> **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.

> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
- 기존 packages 실 시그니처 (cycle1 직접 확인):
  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
  - `apps/web/src/components/forms/ClinicProfileForm.tsx`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`

## 1. 목적과 범위

### 1.1 목적

- ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
- 운영자 UX: 화면 추가 없이 한 폼에서 본원 위치·연락·시간 + 정책 변수 (담당자·시행일) 까지 입력. 출력은 자동 분리.
- M0 vertical slice 의 게이트 #1 (사이트 측 페이지 타입 9종 + Article 1샘플) 중 P-012 Contact · P-013 Legal/Policy · P-014 Location Detail 의 데이터 원천 확보.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| ~~LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent~~ **admin scope 완전 해소** (compliance-assistant M0 + notifications M0 · 2026-05-18/19) | NF-CASCADE-02 (NOTIFICATIONS_M0_PLAN v1.0) | ~~LL-INTRO-01 / LL-DEFER-01~~ |
| LegalDocument `status=published` 발행 (사이트 빌드 export scope · admin DB 안 status 전이는 위 admin scope 완전 해소 포함) | apps/worker + Git commit cascade (M0_BUILD_EXPORT plan) | LL-DEFER-01 잔존 (build/export only) |
| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |

## 2. 데이터 모델 결정

### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)

```sql
-- packages/core-content/migrations/C0006_legal_document.sql

CREATE TYPE legal_document_type AS ENUM (
  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
);

CREATE TABLE legal_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  document_type legal_document_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,                 -- Markdown
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
  effective_date DATE NOT NULL,
  last_revised_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  CONSTRAINT legal_document_email_regex CHECK (
    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-22 patch: autoGenerated=true 면 templateVersion 필수 (LL-SCHEMA-05). custom (autoGenerated=false) 은 null OK
  CONSTRAINT legal_document_template_version_format CHECK (
    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  ),
  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
    (auto_generated = false) OR (template_version IS NOT NULL)
  ),
  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
);

CREATE UNIQUE INDEX legal_document_instance_5type_unique
  ON legal_document (instance_id, document_type)
  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');

CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);

ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON legal_document
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
```

**결정 사항**:
- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
- (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.

### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)

```sql
-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql

ALTER TABLE clinic_profile
  ADD COLUMN policy_contact_person TEXT,
  ADD COLUMN policy_contact_email TEXT,
  ADD COLUMN policy_contact_phone TEXT,
  ADD COLUMN policy_effective_date DATE,
  -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
    policy_contact_email IS NULL
    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
    policy_contact_phone IS NULL
    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  ),
  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
    jsonb_typeof(primary_ctas) = 'array'
  );

-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
-- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
-- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
-- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
RETURNS TRIGGER AS $$
DECLARE
  elem JSONB;
  valid_types CONSTANT TEXT[] := ARRAY[
    -- DATA_MODEL CT-03 SoT 11종 (DB trigger 전체 허용)
    'phone', 'email', 'sms',
    'kakao-talk', 'kakao-channel',
    'naver-reservation', 'naver-talk',
    'form', 'map', 'external', 'video-consultation'
    -- 해외 채널 (line, whatsapp 등) 은 M3 다국어 cascade (DATA_MODEL DM-14)
  ];
BEGIN
  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
    RAISE EXCEPTION 'primary_ctas must be a JSON array'
      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  END IF;
  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing id'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing label'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.

CREATE TRIGGER clinic_profile_primary_ctas_trigger
  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
```

**결정**:
- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
  - UI subset 외 type (sms/form/map/external 등) 은 M1 Phase Alpha cascade (LL-DEFER-19 · cycle5 LL-57 + cycle6 LL-59 단일화).
  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).

### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)

```sql
-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql

-- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
-- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
ALTER TABLE location_profile
  ADD COLUMN clinic_profile_id UUID,
  ADD CONSTRAINT location_profile_clinic_fk
    FOREIGN KEY (instance_id, clinic_profile_id)
    REFERENCES clinic_profile (instance_id, id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
ALTER TABLE location_profile
  ALTER COLUMN clinic_profile_id SET NOT NULL;

CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);

-- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
-- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
-- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
```

**결정**:
- (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:

```jsonc
// location_profile.metadata
{
  "businessHours": {
    "openingHours": [
      // schema.org OpeningHoursSpecification 호환
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:30" },
      { "dayOfWeek": ["Thursday"], "opens": "09:30", "closes": "20:30" },
      { "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "14:00" }
    ],
    "receptionHours": [
      // 접수 마감이 진료 마감과 다를 때
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:00" }
    ],
    "lunchBreaks": [
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "from": "13:00", "to": "14:00" }
    ],
    "specialClosures": []
    // v0.2 미입력 — M1 cascade
  },
  // cycle1 LL-02 patch: ClinicProfile.primaryCtas 자동 상속 결과
  "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
  // v0.2 미입력 — LL-DEFER-05
  "representativeDoctors": [],
  "featuredChannelId": null
}
```

**결정**:
- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
- (LL-SCHEMA-20) 본원 주소: 기존 column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).

## 3. Form UI 재구성

### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)

| 섹션 | 입력 필드 | 출력 계약 |
|---|---|---|
| **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |

**결정**:
- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
- (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).

### 3.2 검증

- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
- (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
  - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
  - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.

## 4. Server Action 결정

### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)

```typescript
// apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts

await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
  assertActionEligibility(ctx, "operator-edit-content");
  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).

  // cycle1 LL-07 patch: 잠금 순서 결정적 — instance 안 모든 entity 동일 순서
  // (1) clinic_profile (FOR UPDATE) — UPSERT 한 번에 처리하므로 별도 SELECT 안 함
  // (2) location_profile main (FOR UPDATE) — UPSERT
  // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
  //     (cycle1 LL-07 patch — closed 5종 사전 알파벳 순)
});
```

**결정**:
- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.

### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)

```typescript
// packages/core-content/src/templates/render.ts

type RenderContext = {
  clinic: {
    name: string;
    legalEntityName: string | null;
    businessRegistrationNumber: string | null;
    founder: string | null;
  };
  location: {
    main: {
      address: string;       // street + locality + region + postal 한 줄
      telephone: string;
      email: string | null;
    };
  };
  policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
  };
};

export function renderTemplate(template: string, ctx: RenderContext): string;
```

**결정**:
- (LL-ACTION-11) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
- (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
- (LL-ACTION-13) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
- (LL-ACTION-14) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
- (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.

### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)

7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:

```jsonc
// row 1
{ "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
// row 2
{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
// row 3~7 (5종 LegalDocument)
{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
                                              "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
// ... terms, non-covered, refund, complaint
```

**결정**:
- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건 — 같은 payload shape (`outcome: "failed"`).
  - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
    - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
    - **notifications Feature 합류 후** (별도 cascade): 운영 팀 slack 알림 채널 추가 marker.
  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
  - M0 v1.0 transactional outbox cascade 시점에 envelope + at-least-once exactly-once observable 로 전환 (cycle 1 LL-17 marker 갱신).
- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.

### 4.4 control-flow / 에러 (LL-ACTION-20)

- ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
- 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 + cycle4 LL-48 patch — 후속 책임/액션/시점 명시):
  - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
  - businessHours 는 application-level 검증 (DB CHECK 없음)

## 5. Core 표준 템플릿 5종

### 5.1 위치 (LL-TEMPLATE-01)

`packages/core-content/src/templates/` 에 각 documentType 별 `.md` 파일 + index.ts 로 export.

```
packages/core-content/src/templates/
├─ index.ts              -- TEMPLATES: Record<DocumentType, Template>
├─ render.ts             -- renderTemplate(template, ctx)
├─ privacy.md            -- 개인정보처리방침 (PIPA 표준)
├─ terms.md              -- 이용약관
├─ non-covered.md        -- 비급여 진료 안내
├─ refund.md             -- 환불 규정
└─ complaint.md          -- 민원 처리
```

```typescript
// packages/core-content/src/templates/index.ts
export type LegalDocumentType =
  | "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";

export type Template = {
  documentType: LegalDocumentType;
  slug: string;
  title: string;
  version: string;        // "privacy@1.0.0"
  body: string;           // raw Markdown with {{...}} placeholders
};

export const TEMPLATES: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", Template>;
```

**결정**:
- (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
  - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
  - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).

## 6. 환경·precondition

- `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음.
- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
  1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
  2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
  3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
  5. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
  6. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
  8. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
  9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
- 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
- packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
- seed (`pnpm web:seed`) 변경 없음 — instance + admin_user 만 생성.

## 7. § 8.1 RLS 시나리오 cascade

ADMIN_UI_SKELETON_PLAN § 8.1 의 13 시나리오에 다음 추가:

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
| 19 | 변수 화이트리스트 외 키 (`{{evil.x}}`) 가 포함된 템플릿 build-time test | packages/core-content test 실패 (LL-ACTION-12) |
| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
| 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
| 4 | Core 표준 템플릿 5종 + render 엔진 + build-time unknown key test | packages/core-content/src/templates/* + tests |
| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
| 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
| 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
| 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |

## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)

### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)

- ~~`LL-DEFER-01`~~ **(admin scope 완전 해소 · 2026-05-19 · `NOTIFICATIONS_M0_PLAN` v1.0 NF-CASCADE-02)**: LegalDocument 발행 게이트 admin DB level 4단계 모두 완료 — `legalCounsel`/`legalCounselAt` 강제 (compliance-assistant M0 DB CHECK · 2026-05-18) · `review-queued` 전이 (compliance-assistant M0 server action · 2026-05-18) · ComplianceRecord pre-publish (compliance-assistant M0 · 2026-05-18) · **NotificationEvent envelope (notifications M0 v1.0 · 2026-05-19)** · `status=published` admin DB 상태 전이 (compliance-assistant M0 publishContent · 2026-05-18). **사이트 빌드 export scope** (apps/worker + Git commit cascade — LegalDocument body 변경분 정적 사이트 반영) 은 M0_BUILD_EXPORT plan 안 별 marker · LL-DEFER-01 scope 외.
- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.

### 9.2 M1 Phase Alpha 합류

- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.

### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)

> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.

- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).

### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)

- (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)

### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)

- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.

### 9.5 Closed (이전 cycle 에서 합류 완료)

- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).

## 10. Cascade marker (다른 SoT 문서로 전파)

> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.

- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
