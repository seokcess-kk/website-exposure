// @glitzy/web/lib/ai/suggest-seo-meta — CONTENT_AI_ASSIST_PLAN v1.0 § 4.1·5.1
// #1 SEO 메타 자동 제안 wrapper (Article · TreatmentPage · FAQ).
//
// LLM 호출만 — eligibility check X (모든 admin role 가능 · cycle 2 #15).
// accept 시 entity 변경은 form action 안 별도 eligibility check.

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildSeoMetaSystemPrompt,
  buildSeoMetaUserPrompt,
  safeParseLlmJson,
  seoMetaSuggestOutputSchema,
  type SeoMetaSuggestInput,
  type SeoMetaSuggestOutput,
} from "./prompt-templates";
import type { SuggestionResult } from "./suggestion-result";

export type SuggestSeoMetaActionInput = {
  entityType: "Article" | "TreatmentPage" | "FAQ";
  currentTitle?: string;
  currentDescription?: string;
  category?: string;
  targetKeyword?: string;
  entityId?: string;
};

async function loadClinicName(tx: import("postgres").TransactionSql, instanceId: string): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

export async function suggestSeoMetaAction(
  instanceSlug: string,
  input: SuggestSeoMetaActionInput,
): Promise<SuggestionResult<SeoMetaSuggestOutput>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "config-missing", message: "AI 서비스 미설정 — 관리자에게 문의하세요." };
  }
  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, reason: "context-error", message: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }

  try {
    return await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SuggestionResult<SeoMetaSuggestOutput>> => {
        const clinicName = await loadClinicName(tx, ctx.instanceId);
        const promptInput: SeoMetaSuggestInput = {
          clinicName,
          entityType: input.entityType,
          currentTitle: input.currentTitle,
          currentDescription: input.currentDescription,
          category: input.category,
          targetKeyword: input.targetKeyword,
        };
        const systemPrompt = buildSeoMetaSystemPrompt();
        const userPrompt = buildSeoMetaUserPrompt(promptInput);

        const result = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "seo-meta-suggest",
          systemPrompt,
          userPrompt,
          entityType: input.entityType,
          entityId: input.entityId,
          maxTokens: 512,
        });

        if (!result.ok) {
          return { ok: false, reason: result.reason, message: result.message, logId: result.logId };
        }

        const parsed = safeParseLlmJson(result.text, seoMetaSuggestOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: result.logId };
        }
        return { ok: true, logId: result.logId, data: parsed.data };
      },
    );
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      return { ok: false, reason: "context-error", message: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패" };
    }
    console.error("[suggestSeoMetaAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
