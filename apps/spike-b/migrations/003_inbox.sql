-- Spike B — migration 003: inbox (tenant-plane, RLS 적용)
--
-- worker가 outbox claim 후 instance_id 알게 되면 withTenantTransaction으로 처리.
-- inbox는 tenant-scoped — RLS WITH CHECK로 cross-instance 차단.
-- idempotent UNIQUE(instance_id, source_event_id) — 재처리 시 no-op

CREATE TABLE inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,
  outbox_id UUID NOT NULL,                 -- 추적용 (FK는 schema-per-tenant 시 깨질 수 있어 생략)
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- idempotency: 동일 (instance_id, source_event_id) 두 번 처리해도 1 row
CREATE UNIQUE INDEX inbox_idempotency
  ON inbox (instance_id, source_event_id);

CREATE INDEX inbox_outbox_idx ON inbox (outbox_id);

-- RLS enable + FORCE
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON inbox
  FOR ALL TO app_tenant_user
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON inbox TO app_tenant_user;
