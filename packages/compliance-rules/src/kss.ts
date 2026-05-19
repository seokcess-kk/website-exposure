// @glitzy/compliance-rules — kss
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 6.5 (CAP-01 - v0.1 fallback 정규식 · CA-DEFER-22 Phase Beta KSS v3+ 합류)

type KssModule = { split: (text: string) => string[] };

let kssModule: KssModule | null = null;
let kssLoadAttempted = false;

/**
 * KSS v3+ 합류 시점에 본 loader 구현 (CA-DEFER-22).
 * v0.1 안 항상 null 반환 → fallback 정규식 사용.
 */
export function loadKss(): KssModule | null {
  if (kssLoadAttempted) return kssModule;
  kssLoadAttempted = true;
  // v0.1 fallback only - CA-DEFER-22 Phase Beta 안 실 import 시도
  kssModule = null;
  return kssModule;
}

export function isKssAvailable(): boolean {
  return loadKss() !== null;
}

/**
 * 한국어 문장 분리.
 *   KSS 가용 시 - kss.split() 사용
 *   fallback - [.!?](\s+|$) 정규식 분리 (한국어 종결 어미 마침표 부재 케이스 부정확 - CA-DEFER-22 Phase Beta 강화)
 */
export function splitSentences(text: string, kssAvailable: boolean): string[] {
  if (kssAvailable) {
    const kss = loadKss();
    if (kss) return kss.split(text);
  }
  // fallback - 정규식 분리
  return text
    .split(/[.!?](?:\s+|$)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * 같은 문장 추출 - finding.location.start 가 포함된 문장 인덱스 반환.
 *   text 안 sentence offset 매핑.
 */
export function findContainingSentence(
  text: string,
  offset: number,
  kssAvailable: boolean,
): { sentence: string; start: number; end: number } | null {
  // text 안 마침표 기준 분리하면서 offset 추적
  let cursor = 0;
  const matches = text.matchAll(/[.!?](?:\s+|$)/g);
  let lastEnd = 0;
  for (const m of matches) {
    const endOffset = (m.index ?? 0) + m[0].length;
    if (offset >= lastEnd && offset < endOffset) {
      return {
        sentence: text.slice(lastEnd, endOffset).trim(),
        start: lastEnd,
        end: endOffset,
      };
    }
    lastEnd = endOffset;
    cursor = endOffset;
  }
  // 마지막 문장 (마침표 없는 케이스)
  if (offset >= lastEnd && offset <= text.length) {
    return {
      sentence: text.slice(lastEnd).trim(),
      start: lastEnd,
      end: text.length,
    };
  }
  return null;
}
