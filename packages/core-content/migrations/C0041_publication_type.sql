-- @glitzy/core-content — C0041 Publication.publication_type
-- EXPOSURE_READINESS Phase D (2026-05-26) — 외부 비평 #4 외부 권위 citation 모델 흡수.
--
-- publication entity 확장 — 5종 type (사용자 결정 2026-05-26):
--   - internal-research   의료진 자체 논문 (현 기본값 · 호환 유지)
--   - external-authority  외부 권위 자료 (학회·기관 가이드라인 일반)
--   - government          정부·공공기관 (질병관리청·복지부·식약처)
--   - academic-society    학회 (대한비만학회·한방비만학회 등)
--   - statistics          공공 통계 (국가통계·OECD 등)
--
-- JSON-LD 차별화: ScholarlyArticle.publisher 가 type 별 다른 의미 — government 안 GovernmentOrganization,
-- academic-society 안 MedicalOrganization (학회) · statistics 안 출처 명시.

CREATE TYPE publication_type AS ENUM (
  'internal-research',
  'external-authority',
  'government',
  'academic-society',
  'statistics'
);

ALTER TABLE publication
  ADD COLUMN publication_type publication_type NOT NULL DEFAULT 'internal-research';

-- 운영자가 publisher_name 도 자유 입력 가능 (외부 자료 안 발행 기관 표시).
--   internal-research 의 경우 NULL — clinic.legalName 자동 사용.
ALTER TABLE publication
  ADD COLUMN publisher_name TEXT;

CREATE INDEX publication_type_idx ON publication (instance_id, publication_type)
  WHERE status = 'published';
