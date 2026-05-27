// @glitzy/web/lib/ai/suggest-keyword-matches — CONTENT_AI_ASSIST_PLAN v1.0 § 4.1·5.2
// #6 키워드 → 콘텐츠 매핑 제안 wrapper.
//
// 입력: keyword_target.id · 출력: 최대 3 후보 (entityType+id+slug+title+confidence+reason).
// candidate set = instance 안 published Article/TreatmentPage/FAQ (limit 30).

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildKeywordMatchSystemPrompt,
  buildKeywordMatchUserPrompt,
  keywordMatchSuggestOutputSchema,
  safeParseLlmJson,
  type KeywordMatchSuggestInput,
  type KeywordMatchSuggestOutput,
} from "./prompt-templates";
import type { SuggestionResult } from "./suggestion-result";

export type KeywordMatchCandidate = KeywordMatchSuggestInput["candidates"][number];

export type KeywordMatchSuggestOutputEnriched = {
  recommendations: Array<{
    entityType: KeywordMatchCandidate["entityType"];
    entityId: string;
    slug: string;
    title: string;
    confidence: "high" | "medium" | "low";
    reason: string;
  }>;
};

async function loadClinicName(tx: import("postgres").TransactionSql, instanceId: string): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

async function loadCandidates(
  tx: import("postgres").TransactionSql,
  instanceId: string,
): Promise<KeywordMatchCandidate[]> {
  const [articles, treatments, faqs] = await Promise.all([
    tx<Array<{ id: string; slug: string; title: string; summary: string | null }>>`
      SELECT id, slug, title, summary
        FROM article
       WHERE instance_id = ${instanceId}::uuid AND status = 'published'
       ORDER BY updated_at DESC
       LIMIT 30
    `,
    tx<Array<{ id: string; slug: string; title: string; summary: string | null }>>`
      SELECT id, slug, title, summary
        FROM treatment_page
       WHERE instance_id = ${instanceId}::uuid AND status = 'published'
       ORDER BY updated_at DESC
       LIMIT 30
    `,
    tx<Array<{ id: string; slug: string; question: string; answer_markdown: string }>>`
      SELECT id, slug, question, answer_markdown
        FROM faq
       WHERE instance_id = ${instanceId}::uuid AND status = 'published'
       ORDER BY updated_at DESC
       LIMIT 30
    `,
  ]);

  return [
    ...articles.map((r) => ({
      entityType: "Article" as const,
      entityId: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary ?? undefined,
    })),
    ...treatments.map((r) => ({
      entityType: "TreatmentPage" as const,
      entityId: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary ?? undefined,
    })),
    ...faqs.map((r) => ({
      entityType: "FAQ" as const,
      entityId: r.id,
      slug: r.slug,
      title: r.question,
      summary: r.answer_markdown.slice(0, 200),
    })),
  ];
}

export async function suggestKeywordMatchesAction(
  instanceSlug: string,
  keywordId: string,
): Promise<SuggestionResult<KeywordMatchSuggestOutputEnriched>> {
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
      async (tx, ctx): Promise<SuggestionResult<KeywordMatchSuggestOutputEnriched>> => {
        const [keywordRow] = await tx<Array<{ label: string }>>`
          SELECT label FROM keyword_target WHERE id = ${keywordId}::uuid AND instance_id = ${ctx.instanceId}::uuid LIMIT 1
        `;
        if (!keywordRow) {
          return { ok: false, reason: "context-error", message: "키워드를 찾을 수 없습니다." };
        }
        const clinicName = await loadClinicName(tx, ctx.instanceId);
        const candidates = await loadCandidates(tx, ctx.instanceId);
        if (candidates.length === 0) {
          return { ok: false, reason: "context-error", message: "발행된 콘텐츠가 없어 추천할 수 없습니다." };
        }

        const systemPrompt = buildKeywordMatchSystemPrompt();
        const userPrompt = buildKeywordMatchUserPrompt({
          clinicName,
          keywordLabel: keywordRow.label,
          candidates,
        });

        const result = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "keyword-match-suggest",
          systemPrompt,
          userPrompt,
          entityType: "Keyword",
          entityId: keywordId,
          maxTokens: 1024,
        });

        if (!result.ok) {
          return { ok: false, reason: result.reason, message: result.message, logId: result.logId };
        }

        const parsed = safeParseLlmJson(result.text, keywordMatchSuggestOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: result.logId };
        }

        const candidateMap = new Map<string, KeywordMatchCandidate>(
          candidates.map((c) => [c.entityId, c] as const),
        );
        const enriched: KeywordMatchSuggestOutputEnriched["recommendations"] = [];
        for (const rec of parsed.data.recommendations) {
          const found = candidateMap.get(rec.entityId);
          if (!found) continue; // LLM 환각 안 candidate 외 entityId — silent drop
          enriched.push({
            entityType: found.entityType,
            entityId: found.entityId,
            slug: found.slug,
            title: found.title,
            confidence: rec.confidence,
            reason: rec.reason,
          });
        }

        if (enriched.length === 0) {
          return { ok: false, reason: "parse-error", message: "AI 추천이 후보 목록과 일치하지 않습니다 — 다시 시도하세요.", logId: result.logId };
        }

        return { ok: true, logId: result.logId, data: { recommendations: enriched } };
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
    console.error("[suggestKeywordMatchesAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
