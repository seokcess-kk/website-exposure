// @glitzy/web/sign-in/cleanup — invalid session cookie cleanup (cycle1-code WEB-06·07·11)
// layout/page 는 Server Component 라 cookies().delete() 가 안전하지 않으므로
// AuthDeniedError(session-*) 발생 시 이 route 로 redirect → cookie clear + audit emit + sign-in redirect

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { emitAuditEvent, type AuthDenyReason } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";

// cycle3-code WEB-47 → cycle2-3entity WEB-21: cleanup 은 session-* 외에도 user-inactive 처리 (cookie clear 필요)
const ReasonSchema = z.enum([
  "session-not-found",
  "session-expired",
  "session-signature-invalid",
  "user-inactive",
]);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const rawReason = url.searchParams.get("reason");
  const parsed = ReasonSchema.safeParse(rawReason);
  const reason: AuthDenyReason = parsed.success ? parsed.data : "session-not-found";

  // cycle5-code WEB-67: cookie 존재 시에만 audit emit — direct GET 만으로 forensic log 오염 방지
  const hasCookie = req.cookies.get("glitzy_session") !== undefined;
  if (hasCookie) {
    try {
      // cycle2-3entity WEB-30: resolveTenantContext 가 이미 tenant-resolve-denied emit 했을 수 있으므로 별도 eventType 으로 분리 (중복 forensic row 방지)
      await emitAuditEvent(getSqlBase(), {
        eventType: "session-cookie-cleared",
        reason,
        payload: { origin: "sign-in/cleanup" },
      });
    } catch (err) {
      console.error("[sign-in/cleanup] audit emit failed", err);
    }
  }

  const res = NextResponse.redirect(new URL(`/sign-in?reason=${reason}`, req.url));
  res.cookies.delete("glitzy_session");
  return res;
}
