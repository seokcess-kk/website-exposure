// @glitzy/web/lib/ai/apply-keyword-match — CONTENT_AI_ASSIST_PLAN v1.0 + v1.1 (CAI-DEFER-13)
// AI 추천 accept 시 keyword_content_link 안 primary 1 + secondaries 0..N INSERT (UPSERT) + readiness 재계산.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { computeReadinessForEntity } from "@/lib/seo-readiness";

import type { SeoKeywordEntityType } from "@glitzy/core-content";

type KeywordEntityType = "Article" | "TreatmentPage" | "FAQ";

export type ApplyKeywordMatchEntry = {
  entityType: KeywordEntityType;
  entityId: string;
};

export type ApplyKeywordMatchInput = {
  keywordId: string;
  /** AI 추천 중 운영자가 primary 로 선택한 1개. */
  primary: ApplyKeywordMatchEntry;
  /** AI 추천 중 secondary 로 선택한 0~N개. primary 와 중복 시 server 안 dedup. */
  secondaries?: ReadonlyArray<ApplyKeywordMatchEntry>;
};

export type ApplyKeywordMatchResult =
  | { ok: true; primaryLinked: number; secondaryLinked: number }
  | { ok: false; message: string };

function dedup(
  primary: ApplyKeywordMatchEntry,
  secondaries: ReadonlyArray<ApplyKeywordMatchEntry>,
): ApplyKeywordMatchEntry[] {
  const out: ApplyKeywordMatchEntry[] = [];
  const seen = new Set<string>([`${primary.entityType}:${primary.entityId}`]);
  for (const s of secondaries) {
    const key = `${s.entityType}:${s.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

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
  const cleanSecondaries = dedup(input.primary, input.secondaries ?? []);
  try {
    await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        const primaryType: SeoKeywordEntityType = input.primary.entityType;
        await tx`
          INSERT INTO keyword_content_link (
            instance_id, keyword_id, entity_type, entity_id, is_primary, relevance_score
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${input.keywordId}::uuid,
            ${primaryType},
            ${input.primary.entityId}::uuid,
            true,
            70
          )
          ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET
            is_primary = true,
            updated_at = NOW()
        `;

        for (const s of cleanSecondaries) {
          const sType: SeoKeywordEntityType = s.entityType;
          await tx`
            INSERT INTO keyword_content_link (
              instance_id, keyword_id, entity_type, entity_id, is_primary, relevance_score
            ) VALUES (
              ${ctx.instanceId}::uuid,
              ${input.keywordId}::uuid,
              ${sType},
              ${s.entityId}::uuid,
              false,
              50
            )
            ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET
              -- primary 이미 있으면 그대로 유지 (secondary 추천이 primary 를 덮어쓰지 않도록)
              is_primary = keyword_content_link.is_primary,
              updated_at = NOW()
          `;
        }

        await computeReadinessForEntity(tx, ctx.instanceId, primaryType, input.primary.entityId);
        for (const s of cleanSecondaries) {
          await computeReadinessForEntity(tx, ctx.instanceId, s.entityType, s.entityId);
        }
      },
    );
    revalidatePath(`/admin/${instanceSlug}/keywords`);
    revalidatePath(`/admin/${instanceSlug}/keywords/${input.keywordId}`);
    revalidatePath(`/admin/${instanceSlug}`);
    return { ok: true, primaryLinked: 1, secondaryLinked: cleanSecondaries.length };
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
