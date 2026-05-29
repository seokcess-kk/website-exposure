// @glitzy/web/lib/admin/super-admin-context — instanceSlug 없는 super-admin 라우트 공통 인증 resolve
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.1 — /admin/super/* layout · page · server action 공통.
//
// /admin root page (admin/page.tsx:48-77) 의 세션 → admin_user.is_super_admin 패턴을 헬퍼로 추출.
// redirect 정책은 호출부(layout)가, 구조적 거부 응답은 server action 이 결정하도록 discriminated union 반환.

import { AuthDeniedError, getActiveSession } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { readSessionCookie } from "@/lib/session-cookie";

export type AdminUserResolution =
  | { kind: "ok"; userId: string; isSuperAdmin: boolean; displayName: string }
  /** 세션 쿠키 부재 — layout 은 auto-login/sign-in, action 은 거부 */
  | { kind: "no-cookie" }
  /** 세션 검증 거부 (만료·위조 등) — layout 은 /sign-in/cleanup */
  | { kind: "denied"; reason: string }
  /** 세션은 유효하나 admin_user row 부재 */
  | { kind: "no-user" };

/**
 * 쿠키 → 세션 → admin_user(is_super_admin) resolve.
 * super-admin 여부 판정은 호출부에서 (`kind === "ok" && isSuperAdmin`).
 * redirect 하지 않음 — 호출부(server component vs server action)가 분기 결정.
 */
export async function loadAdminUser(): Promise<AdminUserResolution> {
  const signedToken = readSessionCookie();
  if (!signedToken) return { kind: "no-cookie" };

  const sql = getSqlBase();
  const cfg = getAuthCfg();

  let userId: string;
  try {
    const session = await getActiveSession(sql, cfg, signedToken);
    userId = session.userId;
  } catch (err) {
    if (err instanceof AuthDeniedError) return { kind: "denied", reason: err.reason };
    throw err;
  }

  const rows = await sql<{ is_super_admin: boolean; display_name: string }[]>`
    SELECT is_super_admin, display_name FROM admin_user WHERE id = ${userId}::uuid LIMIT 1
  `;
  if (rows.length === 0) return { kind: "no-user" };

  return {
    kind: "ok",
    userId,
    isSuperAdmin: rows[0]!.is_super_admin,
    displayName: rows[0]!.display_name,
  };
}
