-- @glitzy/web/scripts/init-prod-auth — production DB 안 auth + audit 테이블 prerequisite
--
-- spike-e migrations (002_admin_user · 003_auth_session · 004_audit_event) 의 schema 를
-- production 안 적용. dev 환경 안 docker init script 가 이미 처리. production 추가.
--
-- 사용:
--   pnpm --filter @glitzy/web run-sql scripts/init-prod-auth.sql
--
-- idempotent — CREATE * IF NOT EXISTS 패턴. 재실행 안전.

\set ON_ERROR_STOP on

-- ===========================================================================
-- (1) admin_user — 관리자 계정 (super admin · 검수자 eligibility)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS admin_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  legal_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
  physician_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
  client_approver_eligible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_user_email_idx ON admin_user (email);
CREATE INDEX IF NOT EXISTS admin_user_active_super_idx ON admin_user (active, is_super_admin);

-- ===========================================================================
-- (2) instance_membership — admin_user × instance × role
-- ===========================================================================
CREATE TABLE IF NOT EXISTS instance_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL,
  role TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  deactivated_at TIMESTAMPTZ,
  deactivated_by_user_id UUID REFERENCES admin_user(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT instance_membership_role_check CHECK (role IN ('operator', 'physician-reviewer', 'legal-reviewer', 'client-approver')),
  CONSTRAINT instance_membership_deactivated_consistency CHECK (
    (active = true AND deactivated_at IS NULL AND deactivated_by_user_id IS NULL)
    OR (active = false AND deactivated_at IS NOT NULL AND deactivated_by_user_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS instance_membership_active_unique
  ON instance_membership (user_id, instance_id)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS instance_membership_user_active_idx ON instance_membership (user_id, active);
CREATE INDEX IF NOT EXISTS instance_membership_instance_active_idx ON instance_membership (instance_id, active);

-- ===========================================================================
-- (3) session — Auth.js Drizzle adapter v5 정합 (camelCase quoted)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS "session" (
  "sessionToken" TEXT PRIMARY KEY,
  "userId" UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  "expires" TIMESTAMPTZ NOT NULL,
  "lastRefreshedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "superAdminSelectedInstanceId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS session_user_idx ON "session" ("userId");
CREATE INDEX IF NOT EXISTS session_expires_idx ON "session" ("expires");

-- ===========================================================================
-- (4) verificationToken — magic link 안 issued token (consumed 후 보존)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS "verificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "consumedAt" TIMESTAMPTZ,
  PRIMARY KEY ("identifier", "token")
);

CREATE INDEX IF NOT EXISTS "verificationToken_expires_idx" ON "verificationToken" ("expires");

-- ===========================================================================
-- (5) audit_event — auth/tenant 이벤트 영구 보존 (instance-switched·magic-link 등)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS audit_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_user_id UUID,
  target_user_id UUID,
  from_instance_id UUID,
  to_instance_id UUID,
  reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_event_actor_time_idx ON audit_event (actor_user_id, occurred_at DESC);
