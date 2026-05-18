-- Spike D — migration 001: roles + extensions (raw SQL — Drizzle Kit canonical 미지원)
-- SPIKED1-pending: custom role·extension은 Drizzle Kit canonical 외 raw SQL mixin

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Custom roles (Spike A 패턴 재사용)
-- app_tenant_user: NOBYPASSRLS (RLS 강제)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_tenant_user') THEN
    CREATE ROLE app_tenant_user NOLOGIN NOBYPASSRLS;
  END IF;
END
$$;

-- migration_audit role (audit_log 전용 insert 권한)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migration_runner') THEN
    CREATE ROLE migration_runner NOLOGIN;
  END IF;
END
$$;
