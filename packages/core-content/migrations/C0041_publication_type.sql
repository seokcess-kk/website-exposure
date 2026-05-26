-- @glitzy/core-content — C0041 Publication.publication_type
-- EXPOSURE_READINESS Phase D (2026-05-26) — 외부 비평 #4 외부 권위 citation 모델 흡수.
--
-- idempotent — 재실행 안 fail 없음 (CREATE TYPE 안 DO 블록 안 check · ADD COLUMN IF NOT EXISTS
-- · CREATE INDEX IF NOT EXISTS).
--
-- publication entity 확장 — 5종 type:
--   - internal-research   의료진 자체 논문 (현 기본값 · 호환 유지)
--   - external-authority  외부 권위 자료 (학회·기관 가이드라인 일반)
--   - government          정부·공공기관 (질병관리청·복지부·식약처)
--   - academic-society    학회 (대한비만학회·한방비만학회 등)
--   - statistics          공공 통계 (국가통계·OECD 등)
--
-- JSON-LD 차별화: ScholarlyArticle.publisher 가 type 별 다른 의미.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_type') THEN
    CREATE TYPE publication_type AS ENUM (
      'internal-research',
      'external-authority',
      'government',
      'academic-society',
      'statistics'
    );
  END IF;
END $$;

ALTER TABLE publication
  ADD COLUMN IF NOT EXISTS publication_type publication_type NOT NULL DEFAULT 'internal-research';

ALTER TABLE publication
  ADD COLUMN IF NOT EXISTS publisher_name TEXT;

CREATE INDEX IF NOT EXISTS publication_type_idx ON publication (instance_id, publication_type)
  WHERE status = 'published';
