// @glitzy/web/lib/slugify — SLUG_AUTOGEN_PLAN v0.3 § 3.1
// 사용자 검수 2026-05-20 — 한글 source 시 의미 없는 romanization 대신 fallback prefix + nanoid.
//   SEO 측면: 영문 source 는 그대로 → 검색 키워드 정합. 한글 source 는 의미 있는 영문 키워드를
//   운영자가 직접 입력하도록 유도 (form 안 helper text 안내).

import { customAlphabet } from "nanoid/non-secure";

// 36자 영소문자/숫자 — 결과가 항상 SLUG_REGEX `^[a-z0-9]` 통과
const slugNanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export type SlugifyOptions = {
  maxLength: 64 | 99;
  fallbackPrefix: string;
};

const HANGUL_REGEX = /[ㄱ-힝]/;

export function slugify(input: string, opts: SlugifyOptions): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) return `${opts.fallbackPrefix}-${slugNanoid()}`;

  // 한글이 포함되어 있으면 romanization 안 의미 없는 결과만 나오므로 바로 fallback.
  // 운영자가 영문 키워드로 직접 입력하도록 유도 (form 안 helper text).
  if (HANGUL_REGEX.test(trimmed)) {
    return `${opts.fallbackPrefix}-${slugNanoid()}`;
  }

  // 영문/숫자 source — 그대로 normalize
  const normalized = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  // suffix 여유 4자 — retry "-5" 2자 + 안전 마진 2자
  const capped = normalized.slice(0, opts.maxLength - 4);

  if (capped.length < 3 || !/^[a-z0-9]/.test(capped)) {
    return `${opts.fallbackPrefix}-${slugNanoid()}`;
  }
  return capped;
}
