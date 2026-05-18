-- Spike D — migration 006: audit_event (service-role-invoked 기록)
-- SPIKED1-002 cycle2: bootstrap에서도 미리 생성·001~005 backfill 가능
-- 본 file은 idempotent — ensureAuditEvent와 byte-for-byte 동등

CREATE TABLE IF NOT EXISTS audit_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  service_role_function TEXT,
  target_db TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
