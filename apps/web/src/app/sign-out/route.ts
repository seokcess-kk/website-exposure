// @glitzy/web/sign-out — POST Route Handler (Plan v1.0 § 3.2 step 5 ADMIN-UI-51)
// getActiveSession → userId 추출 → revokeSession → audit (tampered cookie 분기)
// cycle2-code WEB-24·25: payload.reason shape + revoke 실패와 audit 실패 분리

import { NextResponse, type NextRequest } from "next/server";
import {
  AuthDeniedError,
  emitAuditEvent,
  getActiveSession,
  revokeSession,
} from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // cycle3-3entity WEB-41: Origin 누락도 차단 (mutating POST · CSRF 보수적 처리)
  const origin = req.headers.get("origin");
  if (!origin || origin !== req.nextUrl.origin) {
    return NextResponse.json({ error: "외부 도메인에서의 로그아웃 요청은 차단됩니다." }, { status: 403 });
  }

  const signedToken = req.cookies.get("glitzy_session")?.value ?? null;
  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  if (signedToken) {
    // cycle3-code WEB-37: getActiveSession 과 revokeSession catch 분리 — revoke 실패는 deny 와 구분
    let actorUserId: string | null = null;
    let denyReason: string | null = null;
    try {
      const session = await getActiveSession(sqlBase, cfg, signedToken);
      actorUserId = session.userId;
    } catch (err) {
      denyReason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    }

    if (actorUserId !== null) {
      let revokeFailed = false;
      try {
        await revokeSession(sqlBase, cfg, signedToken);
      } catch (revokeErr) {
        revokeFailed = true;
        console.error("[sign-out] revokeSession failed", revokeErr);
      }
      // cycle5-code WEB-66: session-revoked 단일 event + payload.outcome 으로 Plan matrix 정합 유지
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "session-revoked",
          actorUserId,
          payload: { outcome: revokeFailed ? "failed" : "success" },
        });
      } catch (auditErr) {
        console.error("[sign-out] session-revoked audit emit failed", auditErr);
      }
      // cycle4-code WEB-54: revoke 실패 시 cookie clear 안 함 + 503 — DB session row 가 살아있는데 cookie 만 지우면 탈취 가능
      if (revokeFailed) {
        return NextResponse.json(
          { error: "로그아웃 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
          { status: 503 },
        );
      }
    } else {
      // tampered / expired cookie sign-out — payload.reason shape (WEB-24)
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "session-revoked-anonymous",
          payload: { reason: denyReason ?? "session-not-found" },
        });
      } catch (auditErr) {
        console.error("[sign-out] session-revoked-anonymous audit emit failed", auditErr);
      }
    }
  }

  // cycle5-code WEB-65: POST 후 GET 으로 화면 전환 — 303 See Other (NextResponse.redirect 기본 307 → 405 위험 회피)
  const res = NextResponse.redirect(new URL("/sign-in", req.url), { status: 303 });
  res.cookies.delete("glitzy_session");
  return res;
}
