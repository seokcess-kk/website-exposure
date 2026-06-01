// @glitzy/web/lib/ai/faq-full-draft — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 (CAID-DEFER-02)
// faq 본문 AI Full Draft 생성 — question (10~200) + answer (50~2000) + slug. 1 Q&A 쌍.
//
// page-full-draft.ts 패턴 답습. weight 3 (짧은 output). publication 추천 없음. direct published 절대 X.

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildFaqFullDraftSystemPrompt,
  buildFaqFullDraftUserPrompt,
  faqFullDraftOutputSchema,
  safeParseLlmJson,
  type FaqFullDraftInput,
  type FaqFullDraftOutput,
} from "./prompt-templates";
import { validateFaqDraftOutput, type FaqDraftValidationError } from "./entity-draft-helpers";
import { loadClinicName } from "./page-full-draft";
import type { SuggestionResult } from "./suggestion-result";

const QUOTA_WEIGHT = 3;
const MAX_TOKENS = 1536;
const BRIEF_MIN = 50;
const BRIEF_MAX = 200;
const SECONDARY_MAX = 3;

export type FaqFullDraftActionInput = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
};

export type FaqFullDraftResult = SuggestionResult<FaqFullDraftOutput> & {
  validationError?: FaqDraftValidationError;
};

function validateInput(input: FaqFullDraftActionInput): { ok: true } | { ok: false; message: string } {
  if (!input.primaryKeyword || input.primaryKeyword.trim().length === 0) {
    return { ok: false, message: "primary keyword 필수" };
  }
  if (input.brief.length < BRIEF_MIN || input.brief.length > BRIEF_MAX) {
    return { ok: false, message: `brief ${BRIEF_MIN}~${BRIEF_MAX}자 (${input.brief.length}자 입력)` };
  }
  if (input.secondaryKeywords.length > SECONDARY_MAX) {
    return { ok: false, message: `secondary keywords ${SECONDARY_MAX}개 max` };
  }
  return { ok: true };
}

export async function generateFaqFullDraftAction(
  instanceSlug: string,
  input: FaqFullDraftActionInput,
): Promise<FaqFullDraftResult> {
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
      async (tx, ctx): Promise<FaqFullDraftResult> => {
        const clinicName = await loadClinicName(tx, ctx.instanceId);

        const promptInput: FaqFullDraftInput = {
          clinicName,
          primaryKeyword: input.primaryKeyword,
          secondaryKeywords: input.secondaryKeywords,
          brief: input.brief,
        };
        const systemPrompt = buildFaqFullDraftSystemPrompt();
        const userPrompt = buildFaqFullDraftUserPrompt(promptInput);

        const callResult = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "faq-full-draft",
          systemPrompt,
          userPrompt,
          entityType: "FAQ",
          maxTokens: MAX_TOKENS,
          quotaWeight: QUOTA_WEIGHT,
        });

        if (!callResult.ok) {
          return { ok: false, reason: callResult.reason, message: callResult.message, logId: callResult.logId };
        }

        const parsed = safeParseLlmJson(callResult.text, faqFullDraftOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: callResult.logId };
        }

        const validation = validateFaqDraftOutput(parsed.data);
        if (!validation.ok) {
          return {
            ok: false,
            reason: "parse-error",
            message: `AI 출력 형식 위반 — ${validation.detail}. 다시 시도하거나 직접 작성하세요.`,
            logId: callResult.logId,
            validationError: validation.reason,
          };
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
    console.error("[generateFaqFullDraftAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
