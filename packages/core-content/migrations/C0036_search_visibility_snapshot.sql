-- @glitzy/core-content C0036 — search_visibility_snapshot (SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 2.2)
-- GSC searchanalytics.query 결과 시계열 — dimension [date, page, query].
-- 보존 정책: 기본 90일 sync · backfill 180일 한도 · 자동 cleanup 은 v1.1 (SVI-DEFER-11).
-- ctr NUMERIC(6,5): 1.00000 저장 OK (총 6자리 · 소수 5자리).
-- avg_position 상한 1000: 운영 데이터 품질 방어 (cycle 2 #7).

CREATE TABLE search_visibility_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  source TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  page_url TEXT NOT NULL,
  query TEXT NOT NULL,
  impressions INTEGER NOT NULL,
  clicks INTEGER NOT NULL,
  ctr NUMERIC(6, 5) NOT NULL,
  avg_position NUMERIC(6, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT svs_impressions_nonneg CHECK (impressions >= 0),
  CONSTRAINT svs_clicks_nonneg CHECK (clicks >= 0),
  CONSTRAINT svs_clicks_le_impressions CHECK (clicks <= impressions),
  CONSTRAINT svs_ctr_range CHECK (ctr >= 0 AND ctr <= 1),
  CONSTRAINT svs_position_range CHECK (avg_position > 0 AND avg_position <= 1000),
  CONSTRAINT svs_unique_dimensions UNIQUE (instance_id, property_id, snapshot_date, page_url, query)
);

-- composite same-tenant FK
ALTER TABLE search_visibility_snapshot
  ADD CONSTRAINT svs_property_fk
  FOREIGN KEY (instance_id, property_id)
  REFERENCES search_property (instance_id, id)
  ON DELETE CASCADE;

CREATE INDEX svs_instance_date_idx ON search_visibility_snapshot (instance_id, snapshot_date DESC);
CREATE INDEX svs_page_idx ON search_visibility_snapshot (instance_id, page_url, snapshot_date DESC);
CREATE INDEX svs_query_idx ON search_visibility_snapshot (instance_id, query, snapshot_date DESC);

ALTER TABLE search_visibility_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_visibility_snapshot FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON search_visibility_snapshot
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON search_visibility_snapshot TO app_tenant_user;
