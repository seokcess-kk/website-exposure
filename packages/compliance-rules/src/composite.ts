// @glitzy/compliance-rules — composite
// SoT: docs/features/compliance-assistant.md § 4.3 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 6

import type { CompositeRiskRule, MatchSpan, SimpleOperand } from "./types.js";
import { matchSimple } from "./matcher-simple.js";
import { splitSentences } from "./kss.js";

export function evaluateComposite(
  body: string,
  rule: CompositeRiskRule,
  kssAvailable: boolean,
): MatchSpan[] {
  const operandSpans = rule.operands.map((op) => matchSimple(body, op));
  if (rule.logic === "AND_IN_SENTENCE") return matchInSentence(body, operandSpans, kssAvailable);
  if (rule.logic === "AND_IN_PARAGRAPH") return matchInParagraph(body, operandSpans);
  if (rule.logic === "AND_NEAR") return matchNear(operandSpans, rule.window ?? 50);
  throw new Error(`unknown composite logic: ${(rule as { logic: string }).logic}`);
}

function matchInSentence(
  body: string,
  operandSpans: MatchSpan[][],
  kssAvailable: boolean,
): MatchSpan[] {
  // body 안 마침표 기반 분리 (offset 유지)
  const sentences = splitWithOffsets(body, kssAvailable);
  const result: MatchSpan[] = [];
  for (const sent of sentences) {
    // 각 operand 가 본 문장 안 1번 이상 매칭하는지
    const allOperandsInSentence = operandSpans.every((spans) =>
      spans.some((sp) => sp.start >= sent.start && sp.end <= sent.end),
    );
    if (allOperandsInSentence) {
      // 가장 이른 operand start ~ 가장 늦은 operand end (sentence 안)
      const inSentenceSpans = operandSpans.flatMap((spans) =>
        spans.filter((sp) => sp.start >= sent.start && sp.end <= sent.end),
      );
      const start = Math.min(...inSentenceSpans.map((s) => s.start));
      const end = Math.max(...inSentenceSpans.map((s) => s.end));
      result.push({ start, end });
    }
  }
  return result;
}

function matchInParagraph(body: string, operandSpans: MatchSpan[][]): MatchSpan[] {
  // 빈 줄 분리 (\n\n+)
  const paragraphs: Array<{ start: number; end: number }> = [];
  let cursor = 0;
  const sep = /\n{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = sep.exec(body)) !== null) {
    paragraphs.push({ start: cursor, end: m.index });
    cursor = m.index + m[0].length;
  }
  paragraphs.push({ start: cursor, end: body.length });

  const result: MatchSpan[] = [];
  for (const para of paragraphs) {
    const allOperandsInPara = operandSpans.every((spans) =>
      spans.some((sp) => sp.start >= para.start && sp.end <= para.end),
    );
    if (allOperandsInPara) {
      const inParaSpans = operandSpans.flatMap((spans) =>
        spans.filter((sp) => sp.start >= para.start && sp.end <= para.end),
      );
      const start = Math.min(...inParaSpans.map((s) => s.start));
      const end = Math.max(...inParaSpans.map((s) => s.end));
      result.push({ start, end });
    }
  }
  return result;
}

function matchNear(operandSpans: MatchSpan[][], window: number): MatchSpan[] {
  if (operandSpans.length < 2) return [];
  // 모든 operand pair 안 가장 가까운 거리 ≤ window
  const result: MatchSpan[] = [];
  // 각 operand 의 한 매칭을 골라 모두 window 안에 들어오는 조합 찾기
  // 단순 구현: 가장 빠른 operand[0] start 기준으로 인접 검사
  for (const firstSpan of operandSpans[0]!) {
    const matchedOthers: MatchSpan[] = [];
    for (let i = 1; i < operandSpans.length; i++) {
      const closest = operandSpans[i]!.find(
        (sp) =>
          Math.abs(sp.start - firstSpan.end) <= window ||
          Math.abs(firstSpan.start - sp.end) <= window,
      );
      if (!closest) break;
      matchedOthers.push(closest);
    }
    if (matchedOthers.length === operandSpans.length - 1) {
      const all = [firstSpan, ...matchedOthers];
      const start = Math.min(...all.map((s) => s.start));
      const end = Math.max(...all.map((s) => s.end));
      result.push({ start, end });
    }
  }
  return result;
}

function splitWithOffsets(
  text: string,
  _kssAvailable: boolean,
): Array<{ sentence: string; start: number; end: number }> {
  // v0.1 fallback - [.!?](\s+|$) 분리하면서 offset 보존
  const result: Array<{ sentence: string; start: number; end: number }> = [];
  let lastEnd = 0;
  const sep = /[.!?](?:\s+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = sep.exec(text)) !== null) {
    const endOffset = m.index + m[0].length;
    const sentence = text.slice(lastEnd, endOffset).trim();
    if (sentence.length > 0) {
      result.push({ sentence, start: lastEnd, end: endOffset });
    }
    lastEnd = endOffset;
  }
  if (lastEnd < text.length) {
    const sentence = text.slice(lastEnd).trim();
    if (sentence.length > 0) {
      result.push({ sentence, start: lastEnd, end: text.length });
    }
  }
  return result;
}

export { splitWithOffsets };
