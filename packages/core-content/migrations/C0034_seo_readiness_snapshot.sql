-- @glitzy/core-content C0034 — seo_readiness_snapshot (SEO_VISIBILITY_OPS_PLAN v0.2 § 2.4)
-- entity 별 SEO/GEO readiness 캐시. 최신 1건만 보존 (UNIQUE — UPSERT 패턴).
-- 시계열 보존은 SVO-DEFER-07 (Phase 5 외부 API 합류 시).

CREATE TABLE seo_readiness_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocking_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT seo_readiness_snapshot_entity_type_check CHECK (
    entity_type IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance', 'DoctorProfile', 'ClinicProfile')
  ),
  CONSTRAINT seo_readiness_snapshot_score_range CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT seo_readiness_snapshot_grade_check CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
  CONSTRAINT seo_readiness_snapshot_checks_array CHECK (jsonb_typeof(checks) = 'array'),
  CONSTRAINT seo_readiness_snapshot_blocking_array CHECK (jsonb_typeof(blocking_issues) = 'array'),
  CONSTRAINT seo_readiness_snapshot_recommendations_array CHECK (jsonb_typeof(recommendations) = 'array'),
  CONSTRAINT seo_readiness_snapshot_unique UNIQUE (instance_id, entity_type, entity_id)
);

CREATE INDEX seo_readiness_snapshot_instance_idx ON seo_readiness_snapshot (instance_id);
CREATE INDEX seo_readiness_snapshot_grade_idx ON seo_readiness_snapshot (instance_id, grade);
CREATE INDEX seo_readiness_snapshot_score_idx ON seo_readiness_snapshot (instance_id, score);
CREATE INDEX seo_readiness_snapshot_stale_idx ON seo_readiness_snapshot (instance_id, computed_at);

ALTER TABLE seo_readiness_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_readiness_snapshot FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON seo_readiness_snapshot
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON seo_readiness_snapshot TO app_tenant_user;
