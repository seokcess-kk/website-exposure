-- Spike A — migration 003: audit_log (append-only, two-layer)
-- SPIKEA1-002: 명시 GRANT (UPDATE/DELETE 미부여 — GRANT 레벨 안전망)
-- SPIKEA1-015: 두 층 안전망
--   layer 1 (GRANT): app_tenant_user에 UPDATE/DELETE 미부여 → permission denied error
--   layer 2 (RLS): UPDATE/DELETE policy 없음 → 권한 있어도 0 rows affected

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  content_ref TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_instance_id_idx ON audit_log (instance_id, occurred_at DESC);

-- RLS enable (FORCE 미적용 — super-user는 RLS bypass로 service-role outcome update 가능)
-- SPIKEA2-002: service-role outcome update를 위해 audit_log는 FORCE 미적용
--             app_tenant_user는 NOBYPASSRLS → policy 적용·super-user는 bypass
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- read: tenant-scoped (자신의 instance만)
-- NULLIF로 wrapping: unset context 시 silent deny (cast 에러 없음)
CREATE POLICY audit_log_read ON audit_log
  FOR SELECT TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- write: app_tenant_user는 자신의 instance에만 insert 가능
CREATE POLICY audit_log_write ON audit_log
  FOR INSERT TO app_tenant_user
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- update/delete policy 없음 → RLS layer 차단

-- GRANT layer: SELECT·INSERT만 부여 (SPIKEA1-002)
GRANT SELECT, INSERT ON audit_log TO app_tenant_user;
-- UPDATE/DELETE 권한 부재 → permission denied (layer 1)
