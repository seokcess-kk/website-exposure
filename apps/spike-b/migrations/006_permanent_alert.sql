-- Spike B — migration 006: permanent_alert (SPIKEB1-004 신규)
--
-- permanent 전이 시 정확히 1회 sink alert을 검증.
-- UNIQUE(outbox_id) — 동일 outbox에 대해 alert 1건만.

CREATE TABLE permanent_alert (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outbox_id UUID NOT NULL,
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'permanent-fail',
  worker_id TEXT NOT NULL,
  raised_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (alert_type IN ('permanent-fail', 'exhausted'))
);

CREATE UNIQUE INDEX permanent_alert_idempotency
  ON permanent_alert (outbox_id, alert_type);

CREATE INDEX permanent_alert_instance_idx ON permanent_alert (instance_id, raised_at DESC);
