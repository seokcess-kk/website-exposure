// @glitzy/compliance-rules — matcher
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 4

import type {
  CompositeRiskRule,
  ContentScope,
  ContentScopeInput,
  ContextException,
  Finding,
  MatchResult,
  MatchSpan,
  RiskRule,
  SimpleRiskRule,
  SuppressedFinding,
} from "./types.js";
import { matchSimple } from "./matcher-simple.js";
import { evaluateComposite } from "./composite.js";
import { applyContextExceptions } from "./exceptions.js";

/**
 * CAP2-02 정정 - matcher allowlist pre-check (NOT/except 표현 불가 회피).
 * event-fact-statement-001 한정 - CONTENT_STANDARDS § 5.7 정합.
 */
function shouldSkipRule(rule: RiskRule, scope: ContentScopeInput): boolean {
  if (rule.id === "event-fact-statement-001") {
    if (scope.pageTypeId === "P-102" || scope.pageTypeId === "P-104") return true;
    if (scope.articleType === "event-price") return true;
  }
  return false;
}

function scopeMatches(scopes: ContentScope[], input: ContentScopeInput): boolean {
  return scopes.some((s) => {
    if (s.type === "global") return true;
    if (s.type === "pageType") return input.pageTypeId === s.pageTypeId;
    if (s.type === "articleType") return input.articleType === s.articleType;
    // field/block/feature scope 안 loader skip+warning - matcher 진입 안 됨 (CAP-23·24)
    return false;
  });
}

function buildFinding(rule: RiskRule, body: string, span: MatchSpan): Finding {
  const pattern = body.slice(span.start, span.end);
  return {
    ruleId: rule.id,
    category: rule.category,
    pattern,
    severity: rule.severity,
    location: { start: span.start, end: span.end },
    suggestion: rule.suggestion,
    requiredApproverRoles: rule.requiredApproverRoles,
    triggeredBy: "static-rule",
    legalBasis: rule.legalBasis,
  };
}

export function matchRules(
  body: string,
  rules: RiskRule[],
  contextExceptions: ContextException[],
  scope: ContentScopeInput,
  kssAvailable: boolean,
): MatchResult {
  const findings: Finding[] = [];
  for (const rule of rules) {
    if (shouldSkipRule(rule, scope)) continue;
    if (!scopeMatches(rule.scope, scope)) continue;
    let spans: MatchSpan[];
    if (rule.patternType === "composite") {
      spans = evaluateComposite(body, rule as CompositeRiskRule, kssAvailable);
    } else {
      const simple = rule as SimpleRiskRule;
      spans = matchSimple(body, { pattern: simple.pattern, patternType: simple.patternType });
    }
    for (const span of spans) {
      findings.push(buildFinding(rule, body, span));
    }
  }
  const { kept, suppressed } = applyContextExceptions(body, findings, contextExceptions, kssAvailable, rules);
  return { findings: kept, suppressedFindings: suppressed };
}
