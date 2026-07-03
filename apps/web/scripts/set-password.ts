// @glitzy/web/scripts/set-password — 어드민 계정 비밀번호 설정/재설정 CLI (부트스트랩)
//
// 매직링크 제거 후 최초 super-admin 로그인 부트스트랩용. 기존 admin_user 의 password_hash 를 설정한다.
// 비밀번호는 argv 가 아니라 env NEW_ADMIN_PASSWORD 로 받는다 (shell 히스토리·프로세스 목록 유출 방지).
//
// 사용:
//   NEW_ADMIN_PASSWORD='...' pnpm --filter @glitzy/web set-password --email=<email>
//
// 부트스트랩 순서:
//   1) pnpm --filter @glitzy/web seed --email=... --display-name=... --instance-slug=... --instance-name=...
//   2) (super-admin 필요 시) run-sql 로 UPDATE admin_user SET is_super_admin=true WHERE email=...
//   3) NEW_ADMIN_PASSWORD='...' pnpm --filter @glitzy/web set-password --email=...
//   4) /sign-in 에서 email+password 로 로그인 → 이후 슈퍼관리자 UI 에서 나머지 계정 비번 관리

import postgres from "postgres";
import { normalizeIdentifier, hashPassword, validatePasswordStrength, emitAuditEvent } from "@glitzy/auth";

const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";

function parseEmail(argv: ReadonlyArray<string>): string {
  for (const a of argv) {
    const m = a.match(/^--email=(.*)$/);
    if (m && m[1]) return m[1];
  }
  console.error("usage: NEW_ADMIN_PASSWORD='...' pnpm --filter @glitzy/web set-password --email=<email>");
  process.exit(1);
}

async function main(): Promise<void> {
  const email = parseEmail(process.argv.slice(2));
  const url = process.env.SEED_DATABASE_URL ?? process.env.WEB_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 또는 WEB_DATABASE_URL 환경 변수 필요");
    process.exit(1);
  }
  const password = process.env.NEW_ADMIN_PASSWORD;
  if (!password) {
    console.error("NEW_ADMIN_PASSWORD 환경 변수 필요 (argv 대신 env — shell 히스토리 유출 방지)");
    process.exit(1);
  }
  const strength = validatePasswordStrength(password);
  if (!strength.ok) {
    console.error(`[set-password] 비밀번호 정책 위반: ${strength.reason}`);
    process.exit(1);
  }

  const normalizedEmail = normalizeIdentifier(email);
  const passwordHash = await hashPassword(password);
  const sql = postgres(url, { max: 1, onnotice: () => {} });

  try {
    const rows = await sql<{ id: string; is_super_admin: boolean }[]>`
      UPDATE admin_user
         SET password_hash = ${passwordHash},
             password_updated_at = now(),
             failed_login_count = 0,
             locked_until = NULL,
             updated_at = now()
       WHERE email = ${normalizedEmail}
      RETURNING id, is_super_admin
    `;
    if (rows.length === 0) {
      console.error(`[set-password] 계정 없음: ${normalizedEmail} — 먼저 seed 로 계정을 생성하세요.`);
      process.exit(1);
    }
    const row = rows[0]!;
    await emitAuditEvent(sql, {
      eventType: "admin-user.password-set-cli",
      actorUserId: SYSTEM_ACTOR_ID,
      targetUserId: row.id,
      payload: { email: normalizedEmail },
    });
    console.log(
      JSON.stringify(
        {
          ok: true,
          email: normalizedEmail,
          userId: row.id,
          isSuperAdmin: row.is_super_admin,
          next: "/sign-in 에서 이 email + password 로 로그인",
        },
        null,
        2,
      ),
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[set-password] failed", err);
  process.exit(1);
});
