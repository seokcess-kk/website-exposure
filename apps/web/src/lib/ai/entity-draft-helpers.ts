// @glitzy/web/lib/ai/entity-draft-helpers — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 § 3 task 3
// pure helper — server-only 의존성 없이 vitest 안 import 가능.
// page (treatment/condition) · faq full-draft 의 server-side validation (LLM 결과 form CHECK 위반 reject).

import { countH2 } from "./article-full-draft-helpers";
import type { PageFullDraftOutput } from "./prompt-templates";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,99}$/;

export type PageDraftValidationError =
  | "title-too-short"
  | "title-too-long"
  | "summary-out-of-range"
  | "body-out-of-range"
  | "h2-count-out-of-range"
  | "slug-invalid-format";

/** page (treatment/condition) — title 1~200 · summary 50~160 · body 800~2500 · H2 3~6 · slug regex. */
export function validatePageDraftOutput(
  output: PageFullDraftOutput,
): { ok: true } | { ok: false; reason: PageDraftValidationError; detail: string } {
  if (output.title.length < 1) return { ok: false, reason: "title-too-short", detail: "title 1자 이상" };
  if (output.title.length > 200) {
    return { ok: false, reason: "title-too-long", detail: `title ${output.title.length}자 (200 max)` };
  }
  if (output.summary.length < 50 || output.summary.length > 160) {
    return { ok: false, reason: "summary-out-of-range", detail: `summary ${output.summary.length}자 (50~160)` };
  }
  if (output.bodyMarkdown.length < 800 || output.bodyMarkdown.length > 2500) {
    return { ok: false, reason: "body-out-of-range", detail: `bodyMarkdown ${output.bodyMarkdown.length}자 (800~2500)` };
  }
  const h2 = countH2(output.bodyMarkdown);
  if (h2 < 3 || h2 > 6) {
    return { ok: false, reason: "h2-count-out-of-range", detail: `H2 ${h2}개 (3~6)` };
  }
  if (!SLUG_REGEX.test(output.slug)) {
    return {
      ok: false,
      reason: "slug-invalid-format",
      detail: `slug "${output.slug.slice(0, 30)}" regex 위반 (영문 lowercase + 숫자 + hyphen · 3~100자)`,
    };
  }
  return { ok: true };
}
