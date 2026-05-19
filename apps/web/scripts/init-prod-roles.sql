-- @glitzy/web/scripts/init-prod-roles — production DB (Supabase) 마이그레이션 prerequisite
--
-- dev 환경 (spike-e Docker) 안 docker init script 가 만들어준 role/extension 을
-- production 안 사전 생성. migrate-prod 직전에 한 번 실행.
--
-- 사용:
--   pnpm --filter @glitzy/web run-sql scripts/init-prod-roles.sql
--
-- idempotent — 재실행 안전.

\set ON_ERROR_STOP on

-- (1) pgcrypto — gen_random_uuid() 사용 위해 (Supabase 안 default 활성화이지만 명시 idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- (2) app_tenant_user — multi-tenant RLS 안 SET LOCAL ROLE 대상
--     NOLOGIN: production 안 직접 connect 안 함 (postgres 안 SET ROLE 으로 switch)
--     NOBYPASSRLS: RLS 강제 적용
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_tenant_user') THEN
    CREATE ROLE app_tenant_user NOLOGIN NOBYPASSRLS;
    RAISE NOTICE 'app_tenant_user role 생성됨';
  ELSE
    RAISE NOTICE 'app_tenant_user role 이미 존재';
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_tenant_user;

-- (3) Supabase postgres (superuser) → app_tenant_user 로 SET ROLE 가능하게
--     (superuser 라 자동이지만 명시적 grant — pgbouncer pooler 환경 호환)
GRANT app_tenant_user TO postgres;
