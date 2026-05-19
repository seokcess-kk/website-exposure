// @glitzy/compliance-rules — exceptions
// SoT: docs/features/compliance-assistant.md § 4.4 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 5
// CAP-17 정정 - finding span overlap + fail composite 예외 미적용
// CAP-CODE-05·06 정정 - exception span overlap 정확 검사 + appliesTo.scopes 검증

import type { ContentScope, ContextException, Finding, RiskRule, SuppressedFinding } from "./types.js";
import { matchSimple } from "./matcher-simple.js";
import { splitWithOffsets } from "./composite.js";

const SPAN_NEAR_THRESHOLD = 30; // CAP-17 - 같은 문장 + finding span 인접 30 chars

// CAP-CODE-06 정정 - finding scope 가 exception scope 와 일치하는지 검증
function exceptionScopeMatches(exScopes: ContentScope[] | undefined, finding: Finding, ruleScopes: ContentScope[]): boolean {
  if (!exScopes || exScopes.length === 0) return true;   // 미명시 시 전체 적용
  return exScopes.some((exScope) => {
    if (exScope.type === "global") return true;
    return ruleScopes.some((ruleScope) => {
      if (ruleScope.type !== exScope.type) return false;
      if (exScope.type === "pageType" && ruleScope.type === "pageType") return ruleScope.pageTypeId === exScope.pageTypeId;
      if (exScope.type === "articleType" && ruleScope.type === "articleType") return ruleScope.articleType === exScope.articleType;
      return ruleScope.type === exScope.type;   // global · block · field · feature 단순 type 일치
    });
  });
}

export function applyContextExceptions(
  body: string,
  findings: Finding[],
  exceptions: ContextException[],
  kssAvailable: boolean,
  rules: RiskRule[],
): { kept: Finding[]; suppressed: SuppressedFinding[] } {
  const sentences = splitWithOffsets(body, kssAvailable);
  const ruleMap = new Map(rules.map((r) => [r.id, r]));

  const kept: Finding[] = [];
  const suppressed: SuppressedFinding[] = [];

  for (const finding of findings) {
    // CAP-17 - fail composite 룰은 예외 미적용 (안전 보장)
    const rule = ruleMap.get(finding.ruleId);
    if (rule && rule.patternType === "composite" && finding.severity === "fail") {
      kept.push(finding);
      continue;
    }

    // 1. ContextException[] 필터 - category OR ruleId 매칭
    const applicableExceptions = exceptions.filter((ex) => {
      const categoryHit = ex.appliesTo.categories?.includes(finding.category) ?? false;
      const ruleIdHit = ex.appliesTo.ruleIds?.includes(finding.ruleId) ?? false;
      return categoryHit || ruleIdHit;
    });

    if (applicableExceptions.length === 0) {
      kept.push(finding);
      continue;
    }

    // 2. finding 안 포함된 문장 찾기
    const containingSentence = sentences.find(
      (s) => finding.location.start >= s.start && finding.location.end <= s.end,
    );

    let suppressedBy: { ex: ContextException } | null = null;
    for (const ex of applicableExceptions) {
      // CAP-CODE-06 - exception scope 검증
      if (!exceptionScopeMatches(ex.appliesTo.scopes, finding, rule?.scope ?? [])) continue;

      // CAP-CODE-05 정정 - exception span 을 본문 offset 으로 복원 → finding span overlap 또는 인접 threshold 검사
      const searchRange = containingSentence
        ? { offset: containingSentence.start, text: body.slice(containingSentence.start, containingSentence.end) }
        : {
            offset: Math.max(0, finding.location.start - SPAN_NEAR_THRESHOLD),
            text: body.slice(
              Math.max(0, finding.location.start - SPAN_NEAR_THRESHOLD),
              Math.min(body.length, finding.location.end + SPAN_NEAR_THRESHOLD),
            ),
          };
      const matches = matchSimple(searchRange.text, {
        pattern: ex.pattern,
        patternType: ex.patternType,
      });
      // 각 exception match span → 원본 body offset 복원 → finding span overlap/인접 검사
      const matchedSuppressing = matches.some((m) => {
        const exStart = searchRange.offset + m.start;
        const exEnd = searchRange.offset + m.end;
        // overlap - 두 영역이 겹치는 경우
        const overlap = exStart < finding.location.end && exEnd > finding.location.start;
        // 인접 - threshold 안
        const distance = Math.min(
          Math.abs(exStart - finding.location.end),
          Math.abs(exEnd - finding.location.start),
        );
        return overlap || distance <= SPAN_NEAR_THRESHOLD;
      });
      if (matchedSuppressing) {
        suppressedBy = { ex };
        break;
      }
    }

    if (suppressedBy) {
      suppressed.push({
        finding,
        suppressedBy: suppressedBy.ex.id,
        reason: suppressedBy.ex.kind,
      });
    } else {
      kept.push(finding);
    }
  }

  return { kept, suppressed };
}
