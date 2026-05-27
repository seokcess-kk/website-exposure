// @glitzy/web/lib/ai/respond-to-suggestion — CONTENT_AI_ASSIST_PLAN v1.0 § 4·6.2
// AI 제안 modal 안 accept/reject 클릭 시 llm_call_log.accepted UPDATE + audit_event emit.

"use server";

import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { updateLlmCallAccepted } from "./llm-audit";

export type RespondResult = { ok: true } | { ok: false; message: string };

export async function respondToSuggestionAction(
  instanceSlug: string,
  logId: string,
  accepted: boolean,
): Promise<RespondResult> {
  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, message: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }
  const sqlBase = getSqlBase();
  try {
    await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx) => {
        await updateLlmCallAccepted(tx, logId, accepted);
      },
    );
    try {
      await emitAuditEvent(sqlBase, {
        eventType: accepted ? "llm-suggestion-accepted" : "llm-suggestion-rejected",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { logId },
      });
    } catch (err) {
      console.error("[respondToSuggestionAction] audit emit failed", err);
    }
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      return { ok: false, message: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패" };
    }
    console.error("[respondToSuggestionAction] unexpected", err);
    return { ok: false, message: "응답 저장 중 오류가 발생했습니다." };
  }
}
