-- Spike E — 003: next-auth Drizzle adapter compatible tables
-- cycle2 patch (SPIKEE1-003): next-auth/Auth.js Drizzle adapter v5 표준 정합
--   - session·verificationToken — Auth.js v5 표준 column names (camelCase·quoted)
--   - user table은 admin_user로 대체 (Spike E 확장 필드 — is_super_admin·eligibility)
--   - account table은 OAuth provider용·magic link only spike에서 미사용

CREATE TABLE "session" (
  "sessionToken" TEXT PRIMARY KEY,
  "userId" UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  "expires" TIMESTAMPTZ NOT NULL,
  "lastRefreshedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "superAdminSelectedInstanceId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX session_user_idx ON "session" ("userId");
CREATE INDEX session_expires_idx ON "session" ("expires");

CREATE TABLE "verificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "consumedAt" TIMESTAMPTZ,
  PRIMARY KEY ("identifier", "token")
);

CREATE INDEX "verificationToken_expires_idx" ON "verificationToken" ("expires");
