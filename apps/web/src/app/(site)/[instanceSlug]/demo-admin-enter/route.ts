// @glitzy/web/(site)/[instanceSlug]/demo-admin-enter — demo 사이트 안 admin 자동 진입 route handler
// (path 안 `_` prefix 안 Next.js private folder 라 명시적 underscore 회피)
//
// ⚠️ 보안 약함 — env `DEMO_ADMIN_AUTO_LOGIN_EMAIL` 안 set 된 경우 누구나 URL 만 알면 admin 진입 가능.
// demo / 사용자 테스트 환경 한정 사용. production 안 일반 instance 안 활성화 금지.
//
// 사용자 검수 2026-05-20 — magic link / Resend 설정 없이 demo 안 즉시 admin 진입 위해.
//
// 동작:
//   1. env DEMO_ADMIN_AUTO_LOGIN_EMAIL 체크 (없으면 403)
//   2. admin_user lookup (해당 email · active=true)
//   3. instance_membership 검증 (operator role · active=true · 해당 instance)
//   4. createSession + cookie set
//   5. redirect /admin/{slug}

import { NextResponse, type NextRequest } from "next/server";
import { createSession, emitAuditEvent, normalizeIdentifier, AuthDeniedError } from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";

export async function GET(
  req: NextRequest,
  { params }: { params: { instanceSlug: string } },
): Promise<NextResponse> {
  const demoEmail = process.env.DEMO_ADMIN_AUTO_LOGIN_EMAIL;
  if (!demoEmail) {
    return new NextResponse(
      "Demo admin auto-login is not enabled. Set DEMO_ADMIN_AUTO_LOGIN_EMAIL env to activate.",
      { status: 403 },
    );
  }

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  // 1) email normalize
  let normalizedEmail: string;
  try {
    normalizedEmail = normalizeIdentifier(demoEmail);
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      return new NextResponse(`Invalid DEMO_ADMIN_AUTO_LOGIN_EMAIL: ${err.reason}`, { status: 500 });
    }
    throw err;
  }

  // 2) admin_user lookup
  const userRows = await sqlBase<{ id: string; active: boolean }[]>`
    SELECT id, active FROM admin_user WHERE email = ${normalizedEmail} LIMIT 1
  `;
  if (userRows.length === 0 || userRows[0]!.active === false) {
    return new NextResponse(
      `Admin user not found or inactive: ${normalizedEmail}`,
      { status: 404 },
    );
  }
  let userId: AdminUserId;
  try {
    userId = asUuidV4(userRows[0]!.id) as AdminUserId;
  } catch {
    return new NextResponse("Invalid admin_user id", { status: 500 });
  }

  // 3) instance_membership 검증 (operator · active · 해당 instance)
  const memberRows = await sqlBase<{ id: string }[]>`
    SELECT im.id
      FROM instance_membership im
      JOIN instance i ON im.instance_id = i.id
     WHERE im.user_id = ${userId}::uuid
       AND i.slug = ${params.instanceSlug}
       AND im.active = true
       AND im.role = 'operator'
     LIMIT 1
  `;
  if (memberRows.length === 0) {
    return new NextResponse(
      `No active operator membership for instance '${params.instanceSlug}' on user ${normalizedEmail}`,
      { status: 403 },
    );
  }

  // 4) createSession (모든 검증 통과 후)
  const { signedToken } = await createSession(sqlBase, cfg, userId);

  // best-effort audit
  try {
    await emitAuditEvent(sqlBase, {
      eventType: "session-created",
      actorUserId: userId,
      payload: {
        method: "demo-admin-auto-login",
        instanceSlug: params.instanceSlug,
        warning: "auth bypass — security trade-off accepted for demo",
      },
    });
  } catch (err) {
    console.error("[demo-admin-enter] audit emit failed:", err);
  }

  // 5) cookie set + redirect to admin
  const res = NextResponse.redirect(new URL(`/admin/${params.instanceSlug}`, req.url));
  res.cookies.set("glitzy_session", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cfg.sessionTtlSeconds,
  });
  return res;
}
