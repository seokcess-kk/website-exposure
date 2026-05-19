// @glitzy/web/sign-in/consume — GET Route Handler (Plan v1.0 § 3.2 step 2)
// magic-link 소비 + admin_user lookup (자동 INSERT 없음 · ADMIN-UI-75)
// + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
// + createSession + cookie set + redirect

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  AuthDeniedError,
  consumeMagicLink,
  createSession,
  emitAuditEvent,
  normalizeIdentifier,
  revokeSession,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";

const QuerySchema = z.object({
  identifier: z.string().min(1).max(254),
  token: z.string().min(16).max(512),
});

/** cycle2-code WEB-26: audit emit best-effort — session row 와 cookie 일관성 유지 */
async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  try {
    await emitAuditEvent(sqlBase, input);
  } catch (err) {
    console.error(`[sign-in/consume] audit emit failed: ${input.eventType}`, err);
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    identifier: url.searchParams.get("identifier"),
    token: url.searchParams.get("token"),
  });
  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  if (!parsed.success) {
    // cycle4-code WEB-57: malformed query 도 best-effort audit (token 원문 미저장)
    await emitBestEffort(sqlBase, {
      eventType: "magic-link-rejected",
      reason: "magic-link-invalid",
      payload: { origin: "consume-query-malformed" },
    });
    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
  }

  // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
  //   — 발급 후 비활성화된 사용자가 token 만 소진하는 시나리오 차단
  let normalizedIdentifier: string;
  try {
    normalizedIdentifier = normalizeIdentifier(parsed.data.identifier);
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      await emitBestEffort(sqlBase, {
        eventType: "magic-link-rejected",
        reason: err.reason,
        payload: { identifierSample: parsed.data.identifier.slice(0, 100) },
      });
      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
    }
    throw err;
  }

  // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
  const userRows = await sqlBase<{ id: string; active: boolean }[]>`
    SELECT id, active FROM admin_user WHERE email = ${normalizedIdentifier} LIMIT 1
  `;
  if (userRows.length === 0 || userRows[0]!.active === false) {
    // token CAS 건드리지 않음 — generic redirect + audit
    await emitBestEffort(sqlBase, {
      eventType: "user-not-allowlisted-on-consume",
      payload: { identifier: normalizedIdentifier },
    });
    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
  }
  // cycle2-3entity WEB-27: DB row id 도 UUID v4 검증 후 branded narrow
  let userId: AdminUserId;
  try {
    userId = asUuidV4(userRows[0]!.id) as AdminUserId;
  } catch {
    await emitBestEffort(sqlBase, {
      eventType: "user-not-allowlisted-on-consume",
      payload: { identifier: normalizedIdentifier, reason: "invalid-user-id" },
    });
    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
  }

  // 2) consume magic-link (allowlist 통과 후에만 CAS 소비)
  try {
    const consumed = await consumeMagicLink(sqlBase, parsed.data.identifier, parsed.data.token);
    if (consumed !== normalizedIdentifier) {
      // packages/auth.consumeMagicLink 내부 normalizer 결과 — 동일해야 정상
      console.error("[sign-in/consume] normalizer mismatch", { consumed, normalizedIdentifier });
    }
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      await emitBestEffort(sqlBase, {
        eventType: "magic-link-rejected",
        reason: err.reason,
        payload: { identifierSample: parsed.data.identifier.slice(0, 100) },
      });
      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
    }
    throw err;
  }

  // 3) cycle2-code WEB-22·23: pure membership lookup (audit emit 없이) · createSession 후에 audit
  const membershipResult = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  if (membershipResult.kind === "missing") {
    // membership 없음 audit — identifier 포함 (WEB-22)
    await emitBestEffort(sqlBase, {
      eventType: "first-active-membership-missing",
      actorUserId: userId,
      targetUserId: userId,
      payload: { identifier: normalizedIdentifier, reason: "no-active-operator-membership" },
    });
    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
  }

  // 4) createSession (모든 검증 통과 후에만)
  const { signedToken } = await createSession(sqlBase, cfg, userId);

  // 5) cycle4-3entity WEB-46: race recheck 를 session-created emit 전으로 이동
  //   recheck 실패 시 revoke + audit (session-created 미emit · audit stream 정합)
  const recheck = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  if (recheck.kind === "missing" || recheck.slug !== membershipResult.slug) {
    try {
      await revokeSession(sqlBase, cfg, signedToken);
    } catch (revokeErr) {
      console.error("[sign-in/consume] race compensation revoke failed", revokeErr);
    }
    await emitBestEffort(sqlBase, {
      eventType: "first-active-membership-missing",
      actorUserId: userId,
      targetUserId: userId,
      payload: { identifier: normalizedIdentifier, reason: "race-after-createSession" },
    });
    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
  }

  // cycle2-3entity WEB-20: session-created audit 는 mandatory — 실패 시 session revoke + sign-in error
  try {
    await emitAuditEvent(sqlBase, {
      eventType: "session-created",
      actorUserId: userId,
    });
  } catch (auditErr) {
    console.error("[sign-in/consume] session-created audit emit failed — compensating revoke", auditErr);
    try {
      await revokeSession(sqlBase, cfg, signedToken);
    } catch (revokeErr) {
      console.error("[sign-in/consume] compensating revoke failed", revokeErr);
    }
    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
  }

  await emitBestEffort(sqlBase, {
    eventType: "magic-link-consumed",
    actorUserId: userId,
    payload: { identifier: normalizedIdentifier },
  });
  await emitBestEffort(sqlBase, {
    eventType: "first-active-membership-resolved",
    actorUserId: userId,
    targetUserId: userId,
    payload: { slug: membershipResult.slug },
  });

  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
  res.cookies.set("glitzy_session", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cfg.sessionTtlSeconds,
  });
  return res;
}
