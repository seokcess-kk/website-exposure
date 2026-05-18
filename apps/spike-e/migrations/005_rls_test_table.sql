-- Spike E — 005: RLS-protected test table (SPIKEE1-001 cycle3)
-- 실제 SET LOCAL app.current_instance_id가 RLS policy를 통해 작동하는지 검증
-- Spike A 패턴 reuse: NULLIF wrapping·FORCE ROW LEVEL SECURITY·app_tenant_user role

CREATE ROLE app_tenant_user NOLOGIN NOBYPASSRLS;

CREATE TABLE tenant_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX tenant_data_instance_idx ON tenant_data (instance_id);

ALTER TABLE tenant_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_data FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenant_data
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_data TO app_tenant_user;
