-- C0053 — admin_user 비밀번호 로그인 컬럼 (매직링크 → 계정+비밀번호 전환)
--
--   password_hash        scrypt$N$r$p$saltB64$hashB64 (packages/auth/src/password.ts).
--                        NULL = 로그인 불가 (부트스트랩 계정 — set-password CLI/슈퍼관리자 UI 로 설정).
--   password_updated_at  마지막 비번 설정/변경 시각.
--   failed_login_count   연속 로그인 실패 횟수 (best-effort 잠금용).
--   locked_until         이 시각 전까지 로그인 차단.
--
-- idempotent (ADD COLUMN IF NOT EXISTS) — 재실행 안전.
-- 적용: pnpm --filter @glitzy/web run-sql packages/core-content/migrations/C0053_admin_user_password.sql

ALTER TABLE admin_user ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE admin_user ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ;
ALTER TABLE admin_user ADD COLUMN IF NOT EXISTS failed_login_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admin_user ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
