-- @glitzy/core-content C0046 — admin_user.last_login_at (ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 4)
-- magic-link consume + session refresh 시점 안 UPDATE. 휴면 클라이언트 식별 신호.
-- NULL = 한 번도 로그인 안 함. NULLS LAST 정렬 권장.

ALTER TABLE admin_user
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS admin_user_last_login_idx
  ON admin_user (last_login_at DESC NULLS LAST);