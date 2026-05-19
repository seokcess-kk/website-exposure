// @glitzy/web/lib/slugify — SLUG_AUTOGEN_PLAN v0.3 § 3.1
// 한글 → 영문(revised romanization) → 정규화 → 길이 cap. 빈 결과 시 {prefix}-{nanoid 8자} fallback.

import { convert } from "hangul-romanization";
import { customAlphabet } from "nanoid/non-secure";

// 36자 영소문자/숫자 — 결과가 항상 SLUG_REGEX `^[a-z0-9]` 통과 (SLG-API-02)
const slugNanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export type SlugifyOptions = {
  maxLength: 64 | 99;
  fallbackPrefix: string;
};

export function slugify(input: string, opts: SlugifyOptions): string {
  const normalized = convert(input.trim())
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
