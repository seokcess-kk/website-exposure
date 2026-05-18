-- Spike B — migration 002: outbox (control-plane, RLS 미적용)
--
-- SPIKEB1-003 정정: full UNIQUE(instance_id, source_event_id) — replay 차단.
-- prototype은 sourceEventId 재사용 운영 모순을 회피. production은 receipt ledger 별도 (SoT).

CREATE TABLE outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  last_error TEXT,
  last_error_class TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  exhausted_at TIMESTAMPTZ,
  CHECK (status IN ('pending', 'processing', 'completed', 'exhausted', 'failed-permanent')),
  CHECK (last_error_class IS NULL OR last_error_class IN ('transient', 'permanent'))
);

-- SPIKEB1-003: full UNIQUE — replay 자체 차단 (completed 포함)
CREATE UNIQUE INDEX outbox_idempotency
  ON outbox (instance_id, source_event_id);

CREATE INDEX outbox_claim_idx
  ON outbox (next_attempt_at, locked_at)
  WHERE status = 'pending';

CREATE INDEX outbox_stale_idx
  ON outbox (locked_at)
  WHERE status = 'processing';

CREATE INDEX outbox_status_idx ON outbox (status, created_at DESC);
