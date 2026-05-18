-- Spike B — migration 007: provider_attempt_log (SPIKEB1-006 정정)
--
-- 실제 HTTP provider 모델:
--  - provider_attempted: HTTP 요청을 보낸 모든 시도 (중복 가능)
--  - provider_accepted: provider가 idempotency-key를 기준으로 side effect를 수용한 결과 (1 source_event_id에 대해 1번)
--
-- external_call_log(004)는 DB UNIQUE 기반 사후 dedupe.
-- provider_attempt_log(007)는 attempted vs accepted 분리 — 실제 HTTP 모델에 더 가깝다.

CREATE TABLE provider_attempt_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,
  worker_id TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- 'attempted'는 항상 row insert. 'accepted'는 동일 (instance_id, source_event_id)에 대해 1번
  -- provider side effect는 accepted만 발생 (실제 HTTP에서는 idempotency-key 헤더)
  outcome TEXT NOT NULL,
  CHECK (outcome IN ('attempted-success', 'attempted-failure', 'accepted-success', 'accepted-failure', 'accepted-permanent'))
);

-- accepted-success는 source_event_id별로 1번만 (실제 provider가 idempotency-key로 차단)
CREATE UNIQUE INDEX provider_attempt_log_accepted_success
  ON provider_attempt_log (instance_id, source_event_id)
  WHERE outcome = 'accepted-success';

CREATE INDEX provider_attempt_log_event_idx
  ON provider_attempt_log (instance_id, source_event_id, attempted_at DESC);
