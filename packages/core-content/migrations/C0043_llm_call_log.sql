-- @glitzy/core-content — C0043 llm_call_log (CONTENT_AI_ASSIST_PLAN v1.0 § 3.1)
-- 사용자 (c) AI 보조 plan — Anthropic Claude API call 의 token usage · cost · accepted 추적.
-- C0026 (consultation_request) 답습 — FORCE RLS + NULLIF safe-fetch + 2 index.

CREATE TABLE IF NOT EXISTS llm_call_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id         UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  prompt_template     TEXT NOT NULL,
  model               TEXT NOT NULL,
  entity_type         TEXT,
  entity_id           UUID,
  input_tokens        INTEGER NOT NULL,
  output_tokens       INTEGER NOT NULL,
  cache_read_tokens   INTEGER NOT NULL DEFAULT 0,
  cache_write_tokens  INTEGER NOT NULL DEFAULT 0,
  latency_ms          INTEGER NOT NULL,
  cost_usd            NUMERIC(10,6) NOT NULL,
  status              TEXT NOT NULL,
  error_message       TEXT,
  accepted            BOOLEAN,
  triggered_by        UUID NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT llm_call_log_template_enum CHECK (prompt_template IN (
    'seo-meta-suggest','keyword-match-suggest','review-comment-suggest'
  )),
  CONSTRAINT llm_call_log_status_enum CHECK (status IN (
    'success','error','rate-limited','cap-exceeded'
  )),
  CONSTRAINT llm_call_log_tokens_nonneg CHECK (
    input_tokens >= 0 AND output_tokens >= 0
    AND cache_read_tokens >= 0 AND cache_write_tokens >= 0
  ),
  CONSTRAINT llm_call_log_latency_nonneg CHECK (latency_ms >= 0),
  CONSTRAINT llm_call_log_cost_nonneg CHECK (cost_usd >= 0)
);

CREATE INDEX IF NOT EXISTS llm_call_log_instance_template_ts_idx
  ON llm_call_log (instance_id, prompt_template, created_at DESC);
CREATE INDEX IF NOT EXISTS llm_call_log_instance_status_ts_idx
  ON llm_call_log (instance_id, status, created_at DESC);

ALTER TABLE llm_call_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_call_log FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS llm_call_log_tenant_policy ON llm_call_log;
CREATE POLICY llm_call_log_tenant_policy ON llm_call_log
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- accept/reject 응답 시 UPDATE 필요 (accepted field) — INSERT 도 동일 role.
GRANT SELECT, INSERT, UPDATE ON llm_call_log TO app_tenant_user;
