-- Spike B — migration 001: roles + pgcrypto
-- app_tenant_user: tenant 작업 (inbox)·RLS 적용
-- postgres super-user: control-plane (outbox·external_call_log·invariant_log)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO app_tenant_user;
