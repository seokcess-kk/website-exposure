-- Spike B — migration 004: external_call_log (fake provider call tracking)
--
-- 외부 side effect 호출 count 추적. idempotent at-least-once with exactly-once observable:
-- 같은 source_event_id에 대해 외부 call이 정확히 1번만 일어나야 함 (재처리해도 중복 호출 차단).
-- super-user 전용 — app_tenant_user GRANT 미부여

CREATE TABLE external_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,           -- idempotency key (외부 provider도 동일 키 사용 가정)
  call_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  worker_id TEXT NOT NULL,                 -- 어느 worker가 호출했는지
  outcome TEXT NOT NULL,                   -- success·transient-fail·permanent-fail
  CHECK (outcome IN ('success', 'transient-fail', 'permanent-fail'))
);

-- 동일 source_event_id에 대한 success 호출은 1번만 (idempotent at-least-once with exactly-once observable)
CREATE UNIQUE INDEX external_call_log_idempotency_success
  ON external_call_log (instance_id, source_event_id)
  WHERE outcome = 'success';

CREATE INDEX external_call_log_event_idx
  ON external_call_log (instance_id, source_event_id, call_timestamp DESC);
