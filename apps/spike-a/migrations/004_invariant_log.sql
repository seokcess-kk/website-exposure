-- Spike A — migration 004: invariant_log (super-user only)
-- SPIKEA1-002: REVOKE ALL을 명시하여 broad default grant 잔재 차단

CREATE TABLE invariant_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  iteration INT NOT NULL,
  worker_idx INT NOT NULL,
  expected_instance_id UUID NOT NULL,
  pg_backend_pid INT NOT NULL,
  current_user_name TEXT NOT NULL,
  current_setting_value TEXT,
  scenario TEXT NOT NULL,
  result_count INT NOT NULL,
  foreign_instance_count INT NOT NULL,
  passed BOOLEAN NOT NULL,
  error_message TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, iteration, worker_idx);
CREATE INDEX invariant_log_failed_idx ON invariant_log (run_id, passed) WHERE passed = false;

-- app_tenant_user 접근 명시 차단 (SPIKEA1-002 — broad default 잔재 방지)
REVOKE ALL ON invariant_log FROM app_tenant_user;
