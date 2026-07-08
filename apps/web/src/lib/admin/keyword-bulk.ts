// @glitzy/web/lib/admin/keyword-bulk — 키워드 대량 등록 텍스트 파서
//
// 한 줄 = 키워드 라벨 하나. slug 는 라벨에서 자동 파생 (keyword_target_slug_regex
// `^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$` — 한글 허용이라 romanization 불필요, lib/slugify 와 의도적 분리).
// DB round-trip 없는 순수 함수 — server action 전 검증 + vitest 대상.

export const KEYWORD_SLUG_REGEX = /^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$/;
export const KEYWORD_BULK_MAX_LINES = 200;

export type KeywordBulkEntry = {
  label: string;
  slug: string;
};

export type KeywordBulkInvalidLine = {
  line: number; // 1-based 원본 줄 번호
  raw: string;
  reason: string;
};

export type KeywordBulkParseResult = {
  entries: KeywordBulkEntry[];
  /** slug 규칙 불충족 (1자 라벨 · 특수문자만 · 100자 초과 등) */
  invalid: KeywordBulkInvalidLine[];
  /** 입력 안 slug 중복 — 첫 등장만 entries 에 유지, 이후 라벨 목록 */
  duplicateInInput: string[];
};

/**
 * 키워드 라벨 → keyword_target.slug 파생.
 * 허용 밖 문자(공백·괄호·쉼표 등)는 하이픈으로 접고, DB check 규칙 미달이면 null.
 */
export function keywordSlugFromLabel(label: string): string | null {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
  return KEYWORD_SLUG_REGEX.test(slug) ? slug : null;
}

export function parseKeywordBulkLines(text: string): KeywordBulkParseResult {
  const entries: KeywordBulkEntry[] = [];
  const invalid: KeywordBulkInvalidLine[] = [];
  const duplicateInInput: string[] = [];
  const seenSlugs = new Set<string>();

  const rawLines = text.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i += 1) {
    const raw = rawLines[i]!;
    const label = raw.trim().replace(/\s+/g, " ");
    if (label.length === 0) continue;

    const lineNo = i + 1;
    if (label.length > 100) {
      invalid.push({ line: lineNo, raw: label, reason: "라벨은 100자 이하" });
      continue;
    }
    const slug = keywordSlugFromLabel(label);
    if (slug === null) {
      invalid.push({
        line: lineNo,
        raw: label,
        reason: "slug 파생 불가 — 한글/영소문자/숫자 2자 이상 필요",
      });
      continue;
    }
    if (seenSlugs.has(slug)) {
      duplicateInInput.push(label);
      continue;
    }
    seenSlugs.add(slug);
    entries.push({ label, slug });
  }

  return { entries, invalid, duplicateInInput };
}
