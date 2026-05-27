// @glitzy/web/lib/ai/apply-keyword-match — CONTENT_AI_ASSIST_PLAN v1.0 § 5.2
// AI 추천 accept 시 keyword_content_link 안 primary link INSERT (UPSERT) + readiness 재계산.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { computeReadinessForEntity } from "@/lib/seo-readiness";

import type { SeoKeywordEntityType } from "@glitzy/core-content";

export type ApplyKeywordMatchInput = {
  keywordId: string;
  entityType: "Article" | "TreatmentPage" | "FAQ";
  entityId: string;
};

export type ApplyKeywordMatchResult =
  | { ok: true }
  | { ok: false; message: string };

export async function applyKeywordMatchAction(
  instanceSlug: string,
  input: ApplyKeywordMatchInput,
): Promise<ApplyKeywordMatchResult> {
  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, message: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }
  try {
    await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const entityType: SeoKeywordEntityType = input.entityType;
        await tx`
          INSERT INTO keyword_content_link (
            instance_id, keyword_id, entity_type, entity_id, is_primary, relevance_score
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${input.keywordId}::uuid,
            ${entityType},
            ${input.entityId}::uuid,
            true,
            70
          )
          ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET
            is_primary = true,
            updated_at = NOW()
        `;
        await computeReadinessForEntity(tx, ctx.instanceId, entityType, input.entityId);
      },
    );
    revalidatePath(`/admin/${instanceSlug}/keywords`);
    revalidatePath(`/admin/${instanceSlug}/keywords/${input.keywordId}`);
    revalidatePath(`/admin/${instanceSlug}`);
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      return { ok: false, message: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패" };
    }
    console.error("[applyKeywordMatchAction] unexpected", err);
    return { ok: false, message: "키워드 연결 중 오류가 발생했습니다." };
  }
}
