-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
-- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
-- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
-- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.

-- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
END $$;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   기존 published row 사전 마이그레이션 회피용.

-- Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a
WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = a.instance_id
      AND cr.content_type = 'Article'::compliance_content_type
      AND cr.content_ref = a.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id
  AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- TreatmentPage
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t
WHERE t.status = 'published' AND t.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = t.instance_id
      AND cr.content_type = 'TreatmentPage'::compliance_content_type
      AND cr.content_ref = t.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id
  AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
  published_at, published_by, record_phase, record_version, metadata)
SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
FROM legal_document l
WHERE l.status = 'published' AND l.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = l.instance_id
      AND cr.content_type = 'LegalDocument'::compliance_content_type
      AND cr.content_ref = l.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
WHERE l.instance_id = cr.instance_id
  AND cr.content_type = 'LegalDocument'::compliance_content_type
  AND cr.content_ref = l.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND l.status = 'published' AND l.compliance_record_id IS NULL;

-- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
  f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM faq f
WHERE f.status = 'published' AND f.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = f.instance_id
      AND cr.content_type = 'FAQ'::compliance_content_type
      AND cr.content_ref = f.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
WHERE f.instance_id = cr.instance_id
  AND cr.content_type = 'FAQ'::compliance_content_type
  AND cr.content_ref = f.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND f.status = 'published' AND f.compliance_record_id IS NULL;

-- Publication · MediaAppearance — risk_level 'Low' fixed
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p
WHERE p.status = 'published' AND p.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = p.instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = p.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id
  AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m
WHERE m.status = 'published' AND m.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = m.instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = m.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id
  AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
  END IF;
END $$;

-- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
--   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
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
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  expected_content_type := CASE TG_TABLE_NAME
    WHEN 'article' THEN 'Article'
    WHEN 'treatment_page' THEN 'TreatmentPage'
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
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS article_published_guard ON article;
CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS faq_published_guard ON faq;
CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS publication_published_guard ON publication;
CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
