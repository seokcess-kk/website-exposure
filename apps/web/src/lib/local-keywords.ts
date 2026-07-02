// @glitzy/web/lib/local-keywords — 지역 modifier 추출 단일 SoT
// site-metadata(applyLocalPrefix)·Hero(h1 지역 토큰) 가 같은 규칙을 공유한다.
// 의존성 0 — client component(Hero) 에서도 import 가능해야 함 (next/headers 금지).

/** "부평" "인천" "강남구" 등 짧은 지역명만 — 그 이상은 modifier 로 부적합. */
export const LOCAL_MODIFIER_MAX = 8;

/**
 * localKeywords[0] 의 첫 단어(공백·중점·쉼표 전)를 지역 modifier 로 추출.
 * 예: "부평 다이어트 한의원" → "부평". 없거나 너무 길면 null.
 */
export function extractLocalModifier(localKeywords: ReadonlyArray<string>): string | null {
  if (localKeywords.length === 0) return null;
  const modifier = (localKeywords[0] ?? "").trim().split(/[\s·,]/)[0] ?? "";
  if (modifier.length === 0 || modifier.length > LOCAL_MODIFIER_MAX) return null;
  return modifier;
}
