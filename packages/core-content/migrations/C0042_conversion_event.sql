-- @glitzy/core-content — C0042 conversion_event (MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 3.1)
-- Phase 6.5 v1 — 자체 beacon /api/track 기반 5 event 트래킹 + PIPA anonymized session_token.
-- C0026 (consultation_request) 답습 — FORCE RLS + NULLIF safe-fetch + 2 policy + 3 index.
-- app_public_reader 안 INSERT 만 부여 (SELECT 미부여 — 사이트 안 SELECT 의도 X).
-- app_tenant_user 안 SELECT 만 부여 (immutable — UPDATE/DELETE 미부여).

CREATE TABLE IF NOT EXISTS conversion_event (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id     UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  event_name      TEXT NOT NULL,
  page_path       TEXT NOT NULL,
  session_token   TEXT NOT NULL,
  utm             JSONB NOT NULL DEFAULT '{}'::jsonb,
  referrer_host   TEXT,
  ua_family       TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversion_event_event_name_enum CHECK (event_name IN (
    'phone_click','kakao_click','booking_click',
    'consult_form_start','consult_form_complete'
  )),
  CONSTRAINT conversion_event_page_path_length CHECK (char_length(page_path) BETWEEN 2 AND 512),
  CONSTRAINT conversion_event_session_token_length CHECK (char_length(session_token) = 64),
  CONSTRAINT conversion_event_referrer_host_length CHECK (referrer_host IS NULL OR char_length(referrer_host) <= 255),
  CONSTRAINT conversion_event_ua_family_length CHECK (ua_family IS NULL OR char_length(ua_family) <= 64)
);

CREATE INDEX IF NOT EXISTS conversion_event_instance_event_ts_idx
  ON conversion_event (instance_id, event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_event_instance_path_ts_idx
  ON conversion_event (instance_id, page_path, created_at DESC);
-- session journey 회수 — 운영자 의도 정합 (PIPA 가명정보)
CREATE INDEX IF NOT EXISTS conversion_event_session_ts_idx
  ON conversion_event (instance_id, session_token, created_at DESC);

ALTER TABLE conversion_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_event FORCE ROW LEVEL SECURITY;

-- (a) admin tenant policy — C0026 답습 명명 + NULLIF safe-fetch
DROP POLICY IF EXISTS conversion_event_tenant_policy ON conversion_event;
CREATE POLICY conversion_event_tenant_policy ON conversion_event
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- (b) public INSERT policy — 사이트 안 /api/track 발사 정합
DROP POLICY IF EXISTS conversion_event_public_insert_policy ON conversion_event;
CREATE POLICY conversion_event_public_insert_policy ON conversion_event
  FOR INSERT TO app_public_reader
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- immutable — admin 안 SELECT 만. UPDATE/DELETE 미부여 (180일 raw NULL update 은 v2+ service-role bypass).
GRANT SELECT ON conversion_event TO app_tenant_user;
GRANT INSERT ON conversion_event TO app_public_reader;
