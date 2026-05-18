// @glitzy/web/sign-in/actions — Server Action (Plan v1.0 § 3.2 step 1)
// cycle5 ADMIN-UI-75: allowlist 체크 (self-provision 방지) + magic-link 발급
// cycle2-code WEB-36: redirect-only action — useFormState 미사용 (clinic-profile 의 result-return action 과 패턴 분리).
//                     Plan 본문 `(prev, formData)` 표기는 result-return 케이스 SoT 이며, 본 action 은 redirect throw 로 흐름 차단

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthDeniedError, emitAuditEvent, issueMagicLink, normalizeIdentifier } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";

const EmailSchema = z.object({
  email: z.string().min(1).max(254),
});

export async function issueMagicLinkAction(formData: FormData): Promise<void> {
  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    redirect("/sign-in?reason=magic-link-invalid");
  }

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let normalized: string;
  try {
    normalized = normalizeIdentifier(parsed.data.email);
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      redirect(`/sign-in?reason=${err.reason}`);
    }
    throw err;
  }

  // Plan § 3.2 step 1 ADMIN-UI-75: allowlist 체크 (자동 INSERT 없음)
  const rows = await sqlBase<{ id: string; active: boolean }[]>`
    SELECT id, active FROM admin_user WHERE email = ${normalized} LIMIT 1
  `;
  const allowlisted = rows.length > 0 && rows[0]!.active === true;

  if (!allowlisted) {
    // enumeration 방지 — UI 응답은 generic, audit 만 명시 기록 (cycle3-code WEB-46: best-effort)
    try {
      await emitAuditEvent(sqlBase, {
        eventType: "magic-link-issue-denied",
        payload: { identifier: normalized, reason: "not-allowlisted" },
      });
    } catch (err) {
      console.error("[sign-in] magic-link-issue-denied audit emit failed", err);
    }
    redirect("/sign-in?sent=1");
  }

  await issueMagicLink(sqlBase, cfg, normalized);
  try {
    await emitAuditEvent(sqlBase, {
      eventType: "magic-link-issued",
      payload: { identifier: normalized },
    });
  } catch (err) {
    console.error("[sign-in] magic-link-issued audit emit failed", err);
  }

  redirect("/sign-in?sent=1");
}
