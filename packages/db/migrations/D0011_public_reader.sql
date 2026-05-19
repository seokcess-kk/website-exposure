-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
-- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
--
-- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
-- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
--
-- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).

-- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
-- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
--
-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
-- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
-- production secret manager). 본 migration 은 idempotent 한 GRANT/POLICY 만.
CREATE ROLE app_public_reader LOGIN;

GRANT USAGE ON SCHEMA public TO app_public_reader;

-- ===== instance lookup policy =====
-- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
-- 별도 policy (active=true 만 노출).
GRANT SELECT ON instance TO app_public_reader;

CREATE POLICY public_reader_instance_select
  ON instance
  FOR SELECT
  TO app_public_reader
  USING (active = true);

-- ===== 6 content table per-table policy =====
-- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
-- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.

GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
                treatment_page, article, legal_document
  TO app_public_reader;

CREATE POLICY public_reader_clinic_profile_select
  ON clinic_profile FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_location_profile_select
  ON location_profile FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_doctor_profile_select
  ON doctor_profile FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND active = true
  );

-- TreatmentPage: published + 미래 발행 제외
CREATE POLICY public_reader_treatment_page_select
  ON treatment_page FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY public_reader_article_select
  ON article FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
--   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
CREATE POLICY public_reader_legal_document_select
  ON legal_document FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );
