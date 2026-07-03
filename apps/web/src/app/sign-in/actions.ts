// @glitzy/web/sign-in/actions — Server Action: 계정 + 비밀번호 로그인
//
// 매직링크 대체. 구 consume 라우트의 post-auth(membership 확인·createSession·race recheck·
// mandatory session-created audit·cookie set)를 흡수한다. Server Action 에서 setSessionCookie 로
// 쿠키를 심고 redirect 하면 Next 가 redirect 응답에 Set-Cookie 를 flush 한다.
//
// 실패는 전부 단일 generic invalid-credentials (사용자 열거 방지 — 없는 이메일·틀린 비번·
// 비활성·잠금·비번 미설정을 구분하지 않음). verifyPasswordOrDummy 로 상수시간 유지.

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  AuthDeniedError,
  createSession,
  emitAuditEvent,
  normalizeIdentifier,
  revokeSession,
  verifyPasswordOrDummy,
  type AuditEventInput,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { setSessionCookie } from "@/lib/session-cookie";
import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";

const CredentialsSchema = z.object({
  email: z.string().min(1).max(254),
  password: z.string().min(1).max(200),
});

const LOCKOUT_THRESHOLD = 10;
const LOCKOUT_MINUTES = 15;

async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: AuditEventInput): Promise<void> {
  try {
    await emitAuditEvent(sqlBase, input);
  } catch (err) {
    console.error(`[sign-in] audit emit failed: ${input.eventType}`, err);
  }
}

export async function signInWithPasswordAction(formData: FormData): Promise<void> {
  const parsed = CredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect("/sign-in?reason=invalid-credentials");
  }

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  // 이메일 정규화 실패도 generic (열거 방지)
  let normalized: string;
  try {
    normalized = normalizeIdentifier(parsed.data.email);
  } catch (err) {
    if (err instanceof AuthDeniedError) redirect("/sign-in?reason=invalid-credentials");
    throw err;
  }

  const rows = await sqlBase<
    {
      id: string;
      active: boolean;
      is_super_admin: boolean;
      password_hash: string | null;
      locked_until: Date | null;
    }[]
  >`
    SELECT id, active, is_super_admin, password_hash, locked_until
      FROM admin_user WHERE email = ${normalized} LIMIT 1
  `;
  const row = rows[0];
  const locked = !!row && row.locked_until !== null && row.locked_until.getTime() > Date.now();

  // 상수 경로 — row 없거나 inactive/locked 여도 동일 scrypt 작업량 수행 (타이밍 방어)
  const passwordOk = await verifyPasswordOrDummy(parsed.data.password, row?.password_hash ?? null);

  if (!row || row.active === false || locked || !passwordOk) {
    await emitBestEffort(sqlBase, { eventType: "sign-in-denied", payload: { identifier: normalized } });
    // best-effort 실패 카운트 증가 (컬럼 부재/롤아웃 대비 try/catch — 로그인 흐름 비파괴)
    if (row && !locked) {
      try {
        await sqlBase`
          UPDATE admin_user
             SET failed_login_count = failed_login_count + 1,
                 locked_until = CASE WHEN failed_login_count + 1 >= ${LOCKOUT_THRESHOLD}
                                     THEN now() + make_interval(mins => ${LOCKOUT_MINUTES})
                                     ELSE locked_until END
           WHERE id = ${row.id}::uuid
        `;
      } catch (err) {
        console.error("[sign-in] failed_login_count update failed", err);
      }
    }
    redirect("/sign-in?reason=invalid-credentials");
  }

  // 인증 성공 — DB id UUID v4 검증 후 branded narrow
  let userId: AdminUserId;
  try {
    userId = asUuidV4(row.id) as AdminUserId;
  } catch {
    redirect("/sign-in?reason=invalid-credentials");
  }

  // 성공 — 실패 카운트/잠금 리셋 (best-effort)
  try {
    await sqlBase`UPDATE admin_user SET failed_login_count = 0, locked_until = NULL WHERE id = ${row.id}::uuid`;
  } catch (err) {
    console.error("[sign-in] failed_login_count reset failed", err);
  }

  // super-admin — membership 없이 /admin 허브로 (consume 경로는 super-admin 미지원이었음)
  if (row.is_super_admin) {
    const { signedToken } = await createSession(sqlBase, cfg, userId);
    try {
      await emitAuditEvent(sqlBase, { eventType: "session-created", actorUserId: userId });
    } catch (auditErr) {
      console.error("[sign-in] session-created audit emit failed — compensating revoke", auditErr);
      try {
        await revokeSession(sqlBase, cfg, signedToken);
      } catch (revokeErr) {
        console.error("[sign-in] compensating revoke failed", revokeErr);
      }
      redirect("/sign-in?reason=session-not-found");
    }
    setSessionCookie(signedToken);
    redirect("/admin");
  }

  // operator — 활성 operator membership 필요 (session 발급 전 확인)
  const membership = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  if (membership.kind === "missing") {
    await emitBestEffort(sqlBase, {
      eventType: "first-active-membership-missing",
      actorUserId: userId,
      targetUserId: userId,
      payload: { identifier: normalized, reason: "no-active-operator-membership" },
    });
    redirect("/sign-in?reason=no-active-membership");
  }

  const { signedToken } = await createSession(sqlBase, cfg, userId);

  // race recheck — createSession 후 membership 변동 대비 (consume 라우트 로직 그대로)
  const recheck = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  if (recheck.kind === "missing" || recheck.slug !== membership.slug) {
    try {
      await revokeSession(sqlBase, cfg, signedToken);
    } catch (revokeErr) {
      console.error("[sign-in] race compensation revoke failed", revokeErr);
    }
    await emitBestEffort(sqlBase, {
      eventType: "first-active-membership-missing",
      actorUserId: userId,
      targetUserId: userId,
      payload: { identifier: normalized, reason: "race-after-createSession" },
    });
    redirect("/sign-in?reason=no-active-membership");
  }

  // mandatory session-created audit — 실패 시 세션 revoke + generic error (audit stream 정합)
  try {
    await emitAuditEvent(sqlBase, { eventType: "session-created", actorUserId: userId });
  } catch (auditErr) {
    console.error("[sign-in] session-created audit emit failed — compensating revoke", auditErr);
    try {
      await revokeSession(sqlBase, cfg, signedToken);
    } catch (revokeErr) {
      console.error("[sign-in] compensating revoke failed", revokeErr);
    }
    redirect("/sign-in?reason=session-not-found");
  }

  await emitBestEffort(sqlBase, {
    eventType: "first-active-membership-resolved",
    actorUserId: userId,
    targetUserId: userId,
    payload: { slug: membership.slug },
  });

  setSessionCookie(signedToken);
  redirect(`/admin/${membership.slug}`);
}
