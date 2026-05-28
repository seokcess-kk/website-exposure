// @glitzy/web/lib/ai/article-full-draft-helpers — CONTENT_AI_DRAFT_PLAN v1.0 § 7 task 2·6
// pure helper — server-only 의존성 없이 vitest 안 import 가능.

import type { ArticleFullDraftOutput } from "./prompt-templates";

export type ArticleFullDraftServerSideValidationError =
  | "title-too-long"
  | "title-too-short"
  | "summary-out-of-range"
  | "body-out-of-range"
  | "h2-count-out-of-range"
  | "slug-invalid-format";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,99}$/;

/** publicationType E-A-T priority — 낮은 숫자가 우선 (external-authority/government/academic-society > statistics > internal-research). */
export function publicationTypePriority(t: string): number {
  switch (t) {
    case "external-authority":
    case "government":
    case "academic-society":
      return 1;
    case "statistics":
      return 2;
    case "internal-research":
    default:
      return 3;
  }
}

/** bodyMarkdown 안 H2 count (`^## ` line · H3 와 H1 제외). */
export function countH2(markdown: string): number {
  const lines = markdown.split("\n");
  let count = 0;
  for (const line of lines) {
    if (/^##\s+/.test(line) && !/^###/.test(line)) count += 1;
  }
  return count;
}

/** server-side validation — LLM 결과 안 form CHECK 위반 시 reject (운영자 안 retry CTA). */
export function validateLlmOutput(
  output: ArticleFullDraftOutput,
): { ok: true } | { ok: false; reason: ArticleFullDraftServerSideValidationError; detail: string } {
  if (output.title.length < 1) return { ok: false, reason: "title-too-short", detail: "title 1자 이상" };
  if (output.title.length > 200) return { ok: false, reason: "title-too-long", detail: `title ${output.title.length}자 (200 max)` };
  if (output.summary.length < 80 || output.summary.length > 200) {
    return { ok: false, reason: "summary-out-of-range", detail: `summary ${output.summary.length}자 (80~200)` };
  }
  // v1.1 — 1500~3000자 long-form (FAQ block + citation 포함 max).
  if (output.bodyMarkdown.length < 1500 || output.bodyMarkdown.length > 3000) {
    return { ok: false, reason: "body-out-of-range", detail: `bodyMarkdown ${output.bodyMarkdown.length}자 (1500~3000)` };
  }
  const h2 = countH2(output.bodyMarkdown);
  // v1.1 — 정보형 H2 3~4 + FAQ H2 1 = 총 4~5 H2.
  if (h2 < 4 || h2 > 6) {
    return { ok: false, reason: "h2-count-out-of-range", detail: `H2 ${h2}개 (4~6 · 마지막 1개 = FAQ 강제)` };
  }
  // v1.2 — slug regex 검증 (article.slug CHECK 정합).
  if (!SLUG_REGEX.test(output.slug)) {
    return { ok: false, reason: "slug-invalid-format", detail: `slug "${output.slug.slice(0, 30)}" regex 위반 (영문 lowercase + 숫자 + hyphen · 3~100자)` };
  }
  return { ok: true };
}

/** server-side filter — LLM hallucinate publication.id 차단 (instance 안 candidate id whitelist 만 통과). */
export function filterRecommendedIds(
  recommendedIds: string[],
  candidates: Array<{ id: string }>,
): string[] {
  const whitelist = new Set(candidates.map((c) => c.id));
  return recommendedIds.filter((id) => whitelist.has(id));
}
