// @glitzy/web/lib/ai/article-brief-draft — CONTENT_AI_DRAFT_PLAN v1.0 CAID-DEFER-16 v1 합류
// 2-stage flow 1단계 — 운영자가 keyword 만 입력 → AI 가 brief 1차 생성 (50~200자).
//
// weight 1 quota (CAI v1 default 정합 · 짧은 output ~200t).
// 운영자가 textarea 안 검수/수정 후 본문 LLM 2차 (article-full-draft) 진행.

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildArticleBriefDraftSystemPrompt,
  buildArticleBriefDraftUserPrompt,
  articleBriefDraftOutputSchema,
  safeParseLlmJson,
  type ArticleBriefDraftInput,
  type ArticleBriefDraftOutput,
} from "./prompt-templates";
import type { SuggestionResult } from "./suggestion-result";

const QUOTA_WEIGHT = 1;
const MAX_TOKENS = 512;
const SECONDARY_MAX = 3;

export type ArticleBriefDraftActionInput = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  categoryName?: string;
};

export type ArticleBriefDraftResult = SuggestionResult<ArticleBriefDraftOutput>;

async function loadClinicName(
  tx: import("postgres").TransactionSql,
  instanceId: string,
): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

function validateInput(
  input: ArticleBriefDraftActionInput,
): { ok: true } | { ok: false; message: string } {
  if (!input.primaryKeyword || input.primaryKeyword.trim().length === 0) {
    return { ok: false, message: "primary keyword 필수" };
  }
  if (input.secondaryKeywords.length > SECONDARY_MAX) {
    return { ok: false, message: `secondary keywords ${SECONDARY_MAX}개 max` };
  }
  return { ok: true };
}

export async function generateArticleBriefDraftAction(
  instanceSlug: string,
  input: ArticleBriefDraftActionInput,
): Promise<ArticleBriefDraftResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "config-missing", message: "AI 서비스 미설정 — 관리자에게 문의하세요." };
  }
  const inputValidation = validateInput(input);
  if (!inputValidation.ok) {
    return { ok: false, reason: "context-error", message: inputValidation.message };
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
      async (tx, ctx): Promise<ArticleBriefDraftResult> => {
        const clinicName = await loadClinicName(tx, ctx.instanceId);
        const promptInput: ArticleBriefDraftInput = {
          clinicName,
          categoryName: input.categoryName,
          primaryKeyword: input.primaryKeyword,
          secondaryKeywords: input.secondaryKeywords,
        };
        const systemPrompt = buildArticleBriefDraftSystemPrompt();
        const userPrompt = buildArticleBriefDraftUserPrompt(promptInput);

        const callResult = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "article-brief-draft",
          systemPrompt,
          userPrompt,
          entityType: "Article",
          maxTokens: MAX_TOKENS,
          quotaWeight: QUOTA_WEIGHT,
        });

        if (!callResult.ok) {
          return { ok: false, reason: callResult.reason, message: callResult.message, logId: callResult.logId };
        }

        const parsed = safeParseLlmJson(callResult.text, articleBriefDraftOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: callResult.logId };
        }
        return { ok: true, logId: callResult.logId, data: parsed.data };
      },
    );
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      return {
        ok: false,
        reason: "context-error",
        message: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패",
      };
    }
    console.error("[generateArticleBriefDraftAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
