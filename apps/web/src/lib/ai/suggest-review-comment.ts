// @glitzy/web/lib/ai/suggest-review-comment — CONTENT_AI_ASSIST_PLAN v1.0 § 4.1·5.3
// #8 검수자 코멘트 보조 wrapper.
//
// review_queue_entry detail 안 reject 사유 작성 보조 — entity body + RiskRule fail + short note 종합.

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildReviewCommentSystemPrompt,
  buildReviewCommentUserPrompt,
  reviewCommentSuggestOutputSchema,
  safeParseLlmJson,
  type ReviewCommentSuggestOutput,
} from "./prompt-templates";
import type { SuggestionResult } from "./suggestion-result";

export type SuggestReviewCommentActionInput = {
  entryId: string;
  /** 운영자 short note (5단어 이내 권장) */
  reviewerShortNote?: string;
};

async function loadClinicName(tx: import("postgres").TransactionSql, instanceId: string): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

type EntityContent = {
  entityType: string;
  title: string;
  content: string;
};

async function loadEntityContent(
  tx: import("postgres").TransactionSql,
  instanceId: string,
  contentType: string,
  contentRef: string,
): Promise<EntityContent | null> {
  switch (contentType) {
    case "Article": {
      const rows = await tx<Array<{ title: string; body_markdown: string; summary: string | null }>>`
        SELECT title, body_markdown, summary
          FROM article WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "Article", title: r.title, content: r.body_markdown };
    }
    case "TreatmentPage": {
      const rows = await tx<Array<{ title: string; body_markdown: string }>>`
        SELECT title, body_markdown
          FROM treatment_page WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "TreatmentPage", title: r.title, content: r.body_markdown };
    }
    case "FAQ": {
      const rows = await tx<Array<{ question: string; answer_markdown: string }>>`
        SELECT question, answer_markdown
          FROM faq WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "FAQ", title: r.question, content: r.answer_markdown };
    }
    case "Publication": {
      const rows = await tx<Array<{ title: string; abstract_markdown: string | null }>>`
        SELECT title, abstract_markdown
          FROM publication WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "Publication", title: r.title, content: r.abstract_markdown ?? "" };
    }
    case "MediaAppearance": {
      const rows = await tx<Array<{ title: string; summary: string | null }>>`
        SELECT title, summary
          FROM media_appearance WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "MediaAppearance", title: r.title, content: r.summary ?? "" };
    }
    case "LegalDocument": {
      const rows = await tx<Array<{ title: string; body_markdown: string }>>`
        SELECT title, body_markdown
          FROM legal_document WHERE id = ${contentRef}::uuid AND instance_id = ${instanceId}::uuid LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      return { entityType: "LegalDocument", title: r.title, content: r.body_markdown };
    }
    default:
      return null;
  }
}

export async function suggestReviewCommentAction(
  instanceSlug: string,
  input: SuggestReviewCommentActionInput,
): Promise<SuggestionResult<ReviewCommentSuggestOutput>> {
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
      async (tx, ctx): Promise<SuggestionResult<ReviewCommentSuggestOutput>> => {
        const [entry] = await tx<Array<{ content_type: string; content_ref: string; compliance_record_id: string }>>`
          SELECT content_type::text AS content_type, content_ref, compliance_record_id
            FROM review_queue_entry
           WHERE id = ${input.entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (!entry) {
          return { ok: false, reason: "context-error", message: "검수 항목을 찾을 수 없습니다." };
        }
        const entity = await loadEntityContent(tx, ctx.instanceId, entry.content_type, entry.content_ref);
        if (!entity) {
          return { ok: false, reason: "context-error", message: "검수 대상 콘텐츠를 찾을 수 없습니다." };
        }

        // RiskRule fail list — compliance_record.metadata.violations 안 라벨 추출 (있을 때만)
        const [crRow] = await tx<Array<{ metadata: { violations?: Array<{ label?: string; message?: string }> } | null }>>`
          SELECT metadata FROM compliance_record WHERE id = ${entry.compliance_record_id}::uuid AND instance_id = ${ctx.instanceId}::uuid LIMIT 1
        `;
        const riskRuleFails: string[] = [];
        const violations = crRow?.metadata?.violations;
        if (Array.isArray(violations)) {
          for (const v of violations) {
            const label = typeof v?.label === "string" ? v.label : null;
            const message = typeof v?.message === "string" ? v.message : null;
            if (label && message) riskRuleFails.push(`${label}: ${message}`);
            else if (label) riskRuleFails.push(label);
            else if (message) riskRuleFails.push(message);
          }
        }

        const clinicName = await loadClinicName(tx, ctx.instanceId);
        const systemPrompt = buildReviewCommentSystemPrompt();
        const userPrompt = buildReviewCommentUserPrompt({
          clinicName,
          entityType: entity.entityType,
          entityTitle: entity.title,
          entityContent: entity.content,
          riskRuleFails,
          reviewerShortNote: input.reviewerShortNote,
        });

        const result = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "review-comment-suggest",
          systemPrompt,
          userPrompt,
          entityType: "ReviewQueueEntry",
          entityId: input.entryId,
          maxTokens: 1024,
        });

        if (!result.ok) {
          return { ok: false, reason: result.reason, message: result.message, logId: result.logId };
        }

        const parsed = safeParseLlmJson(result.text, reviewCommentSuggestOutputSchema);
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
    console.error("[suggestReviewCommentAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
