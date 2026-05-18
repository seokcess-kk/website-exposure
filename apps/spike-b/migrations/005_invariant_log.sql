-- Spike B — migration 005: invariant_log (측정 결과)

CREATE TABLE invariant_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  scenario TEXT NOT NULL,
  job_count INT NOT NULL,
  worker_count INT NOT NULL,
  processed INT NOT NULL,
  inbox_rows INT NOT NULL,
  external_success_calls INT NOT NULL,
  external_total_calls INT NOT NULL,
  foreign_instance_inbox INT NOT NULL,     -- inbox 중 cross-instance row
  duplicate_inbox INT NOT NULL,
  duplicate_external_success INT NOT NULL,
  pending_outbox INT NOT NULL,
  exhausted_outbox INT NOT NULL,
  permanent_failed_outbox INT NOT NULL,
  passed BOOLEAN NOT NULL,
  elapsed_ms INT NOT NULL,
  notes TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, occurred_at DESC);
