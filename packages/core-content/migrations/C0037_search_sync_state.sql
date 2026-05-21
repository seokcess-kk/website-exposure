-- @glitzy/core-content C0037 — search_sync_state (SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 2.3)
-- 동시 실행 락 (cycle 1 #8 · cycle 2 #1·2): running 상태 + lock_token + sync_started_at + 30분 stale 자동 해제.
-- partial 정의 (cycle 1 #9): metadata 안 syncedDates · failedDates · skippedRows · rowsIngested 저장.

CREATE TABLE search_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  last_sync_at TIMESTAMPTZ,
  last_synced_date DATE,
  last_status TEXT NOT NULL DEFAULT 'never-synced',
  last_error TEXT,
  sync_started_at TIMESTAMPTZ,
  lock_token TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sss_status_check
    CHECK (last_status IN ('never-synced', 'running', 'success', 'partial', 'failed')),
  CONSTRAINT sss_running_requires_lock CHECK (
    last_status <> 'running'
    OR (sync_started_at IS NOT NULL AND lock_token IS NOT NULL)
  ),
  CONSTRAINT sss_property_unique UNIQUE (instance_id, property_id)
);

ALTER TABLE search_sync_state
  ADD CONSTRAINT sss_property_fk
  FOREIGN KEY (instance_id, property_id)
  REFERENCES search_property (instance_id, id)
  ON DELETE CASCADE;

CREATE INDEX search_sync_state_instance_idx ON search_sync_state (instance_id);

ALTER TABLE search_sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_sync_state FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON search_sync_state
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON search_sync_state TO app_tenant_user;
