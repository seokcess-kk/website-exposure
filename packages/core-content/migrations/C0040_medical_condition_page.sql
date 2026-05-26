-- @glitzy/core-content — C0040 MedicalConditionPage (DATA_MODEL C-05)
-- EXPOSURE_READINESS Phase B (2026-05-26) — P-007/P-008 Conditions 격상.
-- 의료 검색의 "증상/상황/고민" 유입 경로 (전환 페이지 Treatment 와 분리).
--
-- TreatmentPage (C0004) 패턴 정합:
--   - 9-state content_publication_status
--   - risk_level enum (Low/Medium/High)
--   - compliance_record_id + published guard trigger 합류
--   - hero_image_url · metadata JSONB · published_at
--   - RLS tenant_isolation + public_reader policy

CREATE TABLE medical_condition_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  -- 증상명 (예: "산후 비만", "갱년기 체중 증가", "복부비만")
  title TEXT NOT NULL,
  -- summary 50~160 — search snippet 정합 (TreatmentPage 와 동일)
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level,
  compliance_record_id UUID,
  hero_image_url TEXT,
  -- 관련 진료(Treatment) 1차 매칭 — 운영자가 직접 입력 (FK).
  --   "이 증상 → 어떤 시술" 자연 navigation. NULL 가능 (시술 미지정 증상).
  primary_treatment_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT medical_condition_page_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT medical_condition_page_title_length CHECK (length(title) BETWEEN 1 AND 200),
  CONSTRAINT medical_condition_page_summary_length CHECK (length(summary) BETWEEN 50 AND 160),
  CONSTRAINT medical_condition_page_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT medical_condition_page_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT medical_condition_page_instance_id_unique UNIQUE (instance_id, id)
);

-- same-tenant composite FK to treatment_page (M0-05 패턴)
ALTER TABLE medical_condition_page
  ADD CONSTRAINT medical_condition_page_primary_treatment_fk
  FOREIGN KEY (instance_id, primary_treatment_id)
  REFERENCES treatment_page (instance_id, id)
  ON DELETE SET NULL;

CREATE INDEX medical_condition_page_instance_idx ON medical_condition_page (instance_id);
CREATE INDEX medical_condition_page_status_idx ON medical_condition_page (instance_id, status);
CREATE INDEX medical_condition_page_published_idx ON medical_condition_page (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX medical_condition_page_treatment_idx ON medical_condition_page (instance_id, primary_treatment_id)
  WHERE primary_treatment_id IS NOT NULL;

-- RLS
ALTER TABLE medical_condition_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_condition_page FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON medical_condition_page
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON medical_condition_page TO app_tenant_user;

-- public_reader policy (D0011 패턴 정합 — published + 미래 발행 제외)
GRANT SELECT ON medical_condition_page TO app_public_reader;

CREATE POLICY public_reader_medical_condition_page_select
  ON medical_condition_page FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- published_content_compliance_guard trigger 합류 (C0016 패턴)
--   기존 함수 CASE WHEN 안 'medical_condition_page' → 'MedicalConditionPage' 매핑 추가 필요.
--   CREATE OR REPLACE FUNCTION 으로 갱신.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
  expected_content_type compliance_content_type;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record
   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  expected_content_type := CASE TG_TABLE_NAME
    WHEN 'article' THEN 'Article'
    WHEN 'treatment_page' THEN 'TreatmentPage'
    WHEN 'medical_condition_page' THEN 'MedicalConditionPage'
    WHEN 'legal_document' THEN 'LegalDocument'
    WHEN 'faq' THEN 'FAQ'
    WHEN 'publication' THEN 'Publication'
    WHEN 'media_appearance' THEN 'MediaAppearance'
    ELSE NULL
  END;
  IF expected_content_type IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
  END IF;
  IF record_row.content_type <> expected_content_type THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
  END IF;
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS medical_condition_page_published_guard ON medical_condition_page;
CREATE TRIGGER medical_condition_page_published_guard
  BEFORE INSERT OR UPDATE ON medical_condition_page
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

-- content_entity_link CHECK 확장 — Conditions 가 source/target 모두 합류.
--   source: Article·TreatmentPage·FAQ·MedicalConditionPage
--   target: Publication·MediaAppearance·FAQ·TreatmentPage·Article·MedicalConditionPage
ALTER TABLE content_entity_link DROP CONSTRAINT IF EXISTS content_entity_link_source_type_check;
ALTER TABLE content_entity_link ADD CONSTRAINT content_entity_link_source_type_check
  CHECK (source_type IN ('Article', 'TreatmentPage', 'FAQ', 'MedicalConditionPage'));

ALTER TABLE content_entity_link DROP CONSTRAINT IF EXISTS content_entity_link_target_type_check;
ALTER TABLE content_entity_link ADD CONSTRAINT content_entity_link_target_type_check
  CHECK (target_type IN ('Publication', 'MediaAppearance', 'FAQ', 'TreatmentPage', 'Article', 'MedicalConditionPage'));

-- EXPOSURE_READINESS Phase C — keyword_content_link.entity_type 도 MedicalConditionPage 합류.
--   keyword → MedicalConditionPage 매핑 가능 (의료 증상 키워드 = "산후 다이어트" 등 의 1차 매칭 페이지가 Conditions 인 경우).
ALTER TABLE keyword_content_link DROP CONSTRAINT IF EXISTS keyword_content_link_entity_type_check;
ALTER TABLE keyword_content_link ADD CONSTRAINT keyword_content_link_entity_type_check
  CHECK (entity_type IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance', 'MedicalConditionPage'));
