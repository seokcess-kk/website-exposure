// @glitzy/web/lib/ai/article-full-draft — CONTENT_AI_DRAFT_PLAN v1.0 § 1·2·3
// CAI-DEFER-02 본 구현 — 신규 article 안 AI Full Draft 생성 (title · summary · bodyMarkdown +
// 추천 publication 0~5).
//
// scope B (Full draft) — 운영자 brief + primary keyword 입력 → AI 1회 generation.
// direct published 절대 X · 운영자 form 검수 후 status='draft' INSERT (Step 5 = form 안 별 action).
//
// 권한: operator + super-admin 만. (CAI v1 답습 — eligibility check 는 entity 변경 시점.)
// weight: quota 5 (CAI v1 default 1 대비 5x · cost 정합 추정).

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { linkifyFirstMentions, loadInternalLinkTerms } from "@/lib/internal-linkify";

import { callClaude } from "./anthropic-client";
import {
  buildArticleFullDraftSystemPrompt,
  buildArticleFullDraftUserPrompt,
  articleFullDraftOutputSchema,
  safeParseLlmJson,
  type ArticleFullDraftInput,
  type ArticleFullDraftOutput,
} from "./prompt-templates";
import {
  publicationTypePriority,
  validateLlmOutput,
  filterRecommendedIds,
  type ArticleFullDraftServerSideValidationError,
} from "./article-full-draft-helpers";
import { loadClinicLocalKeywords } from "./page-full-draft";
import type { SuggestionResult } from "./suggestion-result";

// v1.1 — long-form (1500~2500자 + FAQ) 정합. weight 5 → 7 (output ~2500t · cost ~1.5x).
const QUOTA_WEIGHT = 7;
const MAX_TOKENS = 3072;
const PUBLICATION_TOP_N = 5;
const BRIEF_MIN = 50;
const BRIEF_MAX = 200;
const SECONDARY_MAX = 3;

export type ArticleFullDraftActionInput = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
  categoryName?: string;
};

export type ArticleFullDraftResultRow = ArticleFullDraftOutput & {
  /** server-side filter 통과한 publication.id 만 (LLM hallucinate 차단). */
  filteredRecommendedPublicationIds: string[];
  /** 추천 publication detail (title · publicationType) — UI 안 카드 렌더 위해. */
  recommendedPublications: Array<{
    id: string;
    title: string;
    summary: string;
    publicationType: string;
  }>;
};

export type ArticleFullDraftResult = SuggestionResult<ArticleFullDraftResultRow> & {
  validationError?: ArticleFullDraftServerSideValidationError;
};

type PublicationCandidate = {
  id: string;
  title: string;
  summary: string;
  publicationType: string;
};

async function loadClinicName(
  tx: import("postgres").TransactionSql,
  instanceId: string,
): Promise<string> {
  const rows = await tx<Array<{ display_name: string }>>`
    SELECT display_name FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  return rows[0]?.display_name ?? "의료기관";
}

/**
 * publication candidate 매칭 — 2 단계 + publicationType E-A-T sort.
 *
 * (a) 우선 = keyword_content_link 안 primary keyword 와 link 된 publication (relevance desc · top 3).
 * (b) fallback = publication.title/summary ILIKE %primary% (top 5 fill).
 * dedup 후 publicationType priority sort + publishedDate desc.
 * 최종 top 5 안 trim.
 */
export async function loadPublicationCandidates(
  tx: import("postgres").TransactionSql,
  instanceId: string,
  primaryKeyword: string,
): Promise<PublicationCandidate[]> {
  // (a) keyword_content_link 우선 — entity_type='Publication' + relevance_score desc
  const linked = await tx<Array<PublicationCandidate>>`
    SELECT p.id, p.title, p.summary, p.publication_type AS "publicationType"
      FROM publication p
      JOIN keyword_content_link kcl ON kcl.entity_id = p.id
                                    AND kcl.entity_type = 'Publication'
                                    AND kcl.instance_id = ${instanceId}::uuid
      JOIN keyword_target kt ON kt.id = kcl.keyword_id
                            AND kt.instance_id = ${instanceId}::uuid
     WHERE p.instance_id = ${instanceId}::uuid
       AND p.status = 'published'
       AND lower(kt.label) = lower(${primaryKeyword})
     ORDER BY kcl.relevance_score DESC NULLS LAST, p.published_date DESC
     LIMIT 3
  `;

  // (b) ILIKE fallback — 위 (a) 안 id 제외
  const linkedIds = linked.map((p) => p.id);
  const likePattern = `%${primaryKeyword}%`;
  const fallback = linkedIds.length > 0
    ? await tx<Array<PublicationCandidate>>`
        SELECT id, title, summary, publication_type AS "publicationType"
          FROM publication
         WHERE instance_id = ${instanceId}::uuid
           AND status = 'published'
           AND id <> ALL(${linkedIds}::uuid[])
           AND (title ILIKE ${likePattern} OR summary ILIKE ${likePattern})
         ORDER BY published_date DESC
         LIMIT ${PUBLICATION_TOP_N}
      `
    : await tx<Array<PublicationCandidate>>`
        SELECT id, title, summary, publication_type AS "publicationType"
          FROM publication
         WHERE instance_id = ${instanceId}::uuid
           AND status = 'published'
           AND (title ILIKE ${likePattern} OR summary ILIKE ${likePattern})
         ORDER BY published_date DESC
         LIMIT ${PUBLICATION_TOP_N}
      `;

  // 합치 + dedup (linked 우선)
  const seen = new Set<string>();
  const combined: PublicationCandidate[] = [];
  for (const p of [...linked, ...fallback]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    combined.push(p);
  }

  // publicationType priority sort + 최대 top N
  combined.sort((a, b) => publicationTypePriority(a.publicationType) - publicationTypePriority(b.publicationType));
  return combined.slice(0, PUBLICATION_TOP_N);
}

/** brief client + server 2 layer validation — server 안 강제. */
function validateInput(
  input: ArticleFullDraftActionInput,
): { ok: true } | { ok: false; message: string } {
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

export async function generateArticleFullDraftAction(
  instanceSlug: string,
  input: ArticleFullDraftActionInput,
): Promise<ArticleFullDraftResult> {
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
      async (tx, ctx): Promise<ArticleFullDraftResult> => {
        const clinicName = await loadClinicName(tx, ctx.instanceId);
        const localKeywords = await loadClinicLocalKeywords(tx, ctx.instanceId);
        const candidates = await loadPublicationCandidates(tx, ctx.instanceId, input.primaryKeyword);

        const promptInput: ArticleFullDraftInput = {
          clinicName,
          categoryName: input.categoryName,
          primaryKeyword: input.primaryKeyword,
          secondaryKeywords: input.secondaryKeywords,
          brief: input.brief,
          localKeywords,
          candidatePublications: candidates.map((c) => ({
            id: c.id,
            title: c.title,
            publicationType: c.publicationType,
          })),
        };
        const systemPrompt = buildArticleFullDraftSystemPrompt();
        const userPrompt = buildArticleFullDraftUserPrompt(promptInput);

        const callResult = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "article-full-draft",
          systemPrompt,
          userPrompt,
          entityType: "Article",
          maxTokens: MAX_TOKENS,
          quotaWeight: QUOTA_WEIGHT,
        });

        if (!callResult.ok) {
          return { ok: false, reason: callResult.reason, message: callResult.message, logId: callResult.logId };
        }

        const parsed = safeParseLlmJson(callResult.text, articleFullDraftOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: callResult.logId };
        }

        // server-side validation — form CHECK 위반 시 reject (quota 차감 유지).
        const validation = validateLlmOutput(parsed.data);
        if (!validation.ok) {
          return {
            ok: false,
            reason: "parse-error",
            message: `AI 출력 형식 위반 — ${validation.detail}. 다시 시도하거나 직접 작성하세요.`,
            logId: callResult.logId,
            validationError: validation.reason,
          };
        }

        // server-side filter — LLM hallucinate publication.id 차단.
        const filteredIds = filterRecommendedIds(parsed.data.recommendedPublicationIds, candidates);

        // 본문 내부링크 자동 삽입 — 발행 시술명/브랜드 첫 언급 링크화 (internal-linkify).
        // LLM 출력 검증(길이·H2) 후에 적용 — 링크 마크업으로 본문이 소폭 길어져도 검증엔 영향 없고,
        // 운영자는 폼에서 링크가 반영된 초안을 그대로 확인·수정한다.
        const linkTerms = await loadInternalLinkTerms(tx, ctx.instanceId, instanceSlug);
        const linkified = linkifyFirstMentions(parsed.data.bodyMarkdown, linkTerms);

        return {
          ok: true,
          logId: callResult.logId,
          data: {
            ...parsed.data,
            bodyMarkdown: linkified.body,
            filteredRecommendedPublicationIds: filteredIds,
            recommendedPublications: candidates,
          },
        };
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
    console.error("[generateArticleFullDraftAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
