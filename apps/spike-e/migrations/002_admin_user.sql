-- Spike E — 002: admin_user + instance_membership
-- cycle2 patch:
--   - SPIKEE1-004: role enum SoT (REVIEW_WORKFLOW) 정합 — operator·physician-reviewer·legal-reviewer·client-approver
--   - SPIKEE1-005: deactivated_at·deactivated_by_user_id 추가 (DATA_MODEL C-23 cascade)
-- super-admin은 admin_user.is_super_admin flag로 별도 표현·membership row 부재

CREATE TABLE admin_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  legal_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
  physician_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
  client_approver_eligible BOOLEAN NOT NULL DEFAULT false,
  -- C0053 비밀번호 로그인 (dev fresh schema 미러)
  password_hash TEXT,
  password_updated_at TIMESTAMPTZ,
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX admin_user_email_idx ON admin_user (email);
CREATE INDEX admin_user_active_super_idx ON admin_user (active, is_super_admin);

CREATE TABLE instance_membership (
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

CREATE UNIQUE INDEX instance_membership_active_unique
  ON instance_membership (user_id, instance_id)
  WHERE active = true;

CREATE INDEX instance_membership_user_active_idx ON instance_membership (user_id, active);
CREATE INDEX instance_membership_instance_active_idx ON instance_membership (instance_id, active);
