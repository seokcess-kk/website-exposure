// @glitzy/web/lib/ai/page-full-draft — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 (CAID-DEFER-02)
// treatment_page (시술/진료) · medical_condition_page (증상/질환) 본문 AI Full Draft 생성.
//
// article-full-draft.ts 패턴 답습 — 단 publication 추천 제거 (두 entity 에 publication FK 없음) +
// summary 50~160 + body 800~2500 + entityKind 분기. 시술 페이지는 의료광고법 강화 (prompt).
//
// 권한: operator + super-admin (CAI v1 답습). weight 7 quota. direct published 절대 X (form 검수 후 draft).

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildPageFullDraftSystemPrompt,
  buildPageFullDraftUserPrompt,
  pageFullDraftOutputSchema,
  safeParseLlmJson,
  type PageEntityKind,
  type PageFullDraftInput,
  type PageFullDraftOutput,
} from "./prompt-templates";
import { validatePageDraftOutput, type PageDraftValidationError } from "./entity-draft-helpers";
import type { SuggestionResult } from "./suggestion-result";

const QUOTA_WEIGHT = 7;
const MAX_TOKENS = 3072;
const BRIEF_MIN = 50;
const BRIEF_MAX = 200;
const SECONDARY_MAX = 3;

export type PageFullDraftActionInput = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
};

export type PageFullDraftResult = SuggestionResult<PageFullDraftOutput> & {
  validationError?: PageDraftValidationError;
};

const PROMPT_TEMPLATE: Record<PageEntityKind, "treatment-page-full-draft" | "medical-condition-page-full-draft"> = {
  TreatmentPage: "treatment-page-full-draft",
  MedicalConditionPage: "medical-condition-page-full-draft",
};

export async function loadClinicName(
  tx: import("postgres").TransactionSql,
  instanceId: string,
): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

/**
 * clinic_profile.metadata.localKeywords — AI draft 지역 문맥 주입용 (미설정/형식 오류 시 []).
 * 운영자가 키워드에 지역명을 안 넣어도 초안에 지역 시그널(부평·인천 등)이 실리게 한다.
 */
export async function loadClinicLocalKeywords(
  tx: import("postgres").TransactionSql,
  instanceId: string,
): Promise<string[]> {
  const rows = await tx<Array<{ metadata: unknown }>>`
    SELECT metadata FROM clinic_profile
     WHERE instance_id = ${instanceId}::uuid AND slug = 'clinic' LIMIT 1
  `;
  const meta = rows[0]?.metadata;
  if (typeof meta !== "object" || meta === null) return [];
  const lk = (meta as { localKeywords?: unknown }).localKeywords;
  if (!Array.isArray(lk)) return [];
  return lk.filter((v): v is string => typeof v === "string" && v.trim().length > 0).slice(0, 8);
}

function validateInput(input: PageFullDraftActionInput): { ok: true } | { ok: false; message: string } {
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

export async function generatePageFullDraftAction(
  instanceSlug: string,
  entityKind: PageEntityKind,
  input: PageFullDraftActionInput,
): Promise<PageFullDraftResult> {
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
      async (tx, ctx): Promise<PageFullDraftResult> => {
        const clinicName = await loadClinicName(tx, ctx.instanceId);

        const promptInput: PageFullDraftInput = {
          clinicName,
          entityKind,
          primaryKeyword: input.primaryKeyword,
          secondaryKeywords: input.secondaryKeywords,
          brief: input.brief,
        };
        const systemPrompt = buildPageFullDraftSystemPrompt(entityKind);
        const userPrompt = buildPageFullDraftUserPrompt(promptInput);

        const callResult = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: PROMPT_TEMPLATE[entityKind],
          systemPrompt,
          userPrompt,
          entityType: entityKind,
          maxTokens: MAX_TOKENS,
          quotaWeight: QUOTA_WEIGHT,
        });

        if (!callResult.ok) {
          return { ok: false, reason: callResult.reason, message: callResult.message, logId: callResult.logId };
        }

        const parsed = safeParseLlmJson(callResult.text, pageFullDraftOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: callResult.logId };
        }

        const validation = validatePageDraftOutput(parsed.data);
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
    console.error("[generatePageFullDraftAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
