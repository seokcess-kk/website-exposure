-- Spike A — migration 001: roles + pgcrypto
-- SPIKEA1-002·003 정정:
--  - pgcrypto 확장 최상단 (002에서 gen_random_uuid 사용 전에 활성화)
--  - ALTER DEFAULT PRIVILEGES 제거 (broad grant 폐기·각 table에서 명시 GRANT)
--
-- LOCAL ONLY: 본 password는 prototype 전용. production은 secret manager (SPIKEA1-019)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT;

-- public schema 사용 권한 (CONNECT는 PUBLIC default 사용)
GRANT USAGE ON SCHEMA public TO app_tenant_user;

-- BYPASSRLS=false 명시 — RLS 강제 적용
ALTER ROLE app_tenant_user NOBYPASSRLS;
