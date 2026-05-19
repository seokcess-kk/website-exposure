// @glitzy/compliance-rules — matcher-simple
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 4.5

import type { MatchSpan, PatternType, SimpleOperand } from "./types.js";

export function matchSimple(body: string, operand: SimpleOperand): MatchSpan[] {
  if (operand.patternType === "regex") return matchRegex(body, operand.pattern);
  if (operand.patternType === "keyword") return matchKeyword(body, operand.pattern);
  if (operand.patternType === "phrase") return matchPhrase(body, operand.pattern);
  throw new Error(`unknown patternType: ${(operand as { patternType: PatternType }).patternType}`);
}

export function matchRegex(body: string, pattern: string): MatchSpan[] {
  const result: MatchSpan[] = [];
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, "gu");
  } catch {
    return [];
  }
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    if (m.index === undefined) break;
    result.push({ start: m.index, end: m.index + m[0].length });
    if (m[0].length === 0) regex.lastIndex++;
  }
  return result;
}

export function matchKeyword(body: string, pattern: string): MatchSpan[] {
  const result: MatchSpan[] = [];
  const needle = pattern.toLowerCase();
  const haystack = body.toLowerCase();
  let idx = 0;
  while (true) {
    const found = haystack.indexOf(needle, idx);
    if (found === -1) break;
    result.push({ start: found, end: found + needle.length });
    idx = found + Math.max(1, needle.length);
  }
  return result;
}

export function matchPhrase(body: string, pattern: string): MatchSpan[] {
  // 한국어 영향 미미 - keyword 와 동일 처리 (word boundary 는 한글 영향 없음)
  return matchKeyword(body, pattern);
}
