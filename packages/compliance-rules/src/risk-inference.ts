// @glitzy/compliance-rules — risk-inference
// SoT: docs/compliance/RISK_LEVELS.md § 2 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 10
// CAP-12 - evaluatedSteps + contributingSteps 분리

import type {
  InferenceStep,
  InlineRiskFlag,
  RiskInferenceInput,
  RiskInferenceResult,
  RiskLevel,
} from "./types.js";

const RISK_ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };

export function riskHigher(a: RiskLevel, b: RiskLevel): boolean {
  return RISK_ORDER[a] > RISK_ORDER[b];
}

export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) {
    if (riskHigher(l, max)) max = l;
  }
  return max;
}

// PAGE_TYPES § 3 cascade 캐시
const PAGE_TYPE_BASE: Record<string, RiskLevel> = {
  "P-001": "Low",
  "P-002": "Low",
  "P-003": "Low",
  "P-004": "Low",
  "P-005": "Low",
  "P-006": "Medium",
  "P-007": "Low",
  "P-008": "Medium",
  "P-009": "Low",
  "P-010": "Low",
  "P-011": "Low",
  "P-012": "Low",
  "P-013": "Low",
  "P-014": "Low",
  "P-101": "High",
  "P-102": "High",
  "P-103": "Medium",
  "P-104": "Low",
  "P-105": "Low",
  "P-106": "Medium",
};

// CONTENT_STANDARDS § 6 cascade
const ARTICLE_TYPE_BASE: Record<string, RiskLevel> = {
  notice: "Low",
  "general-medical-info": "Medium",
  "treatment-explainer": "Medium",
  "condition-explainer": "Medium",
  "effect-result-related": "High",
  "review-case": "High",
  "event-price": "High",
};

// RISK_LEVELS § 2.4 - 5종 모두 High
function inlineFlagLevel(_flag: InlineRiskFlag): RiskLevel {
  return "High";
}

function pageTypeBaseLevel(pageTypeId: string): RiskLevel {
  return PAGE_TYPE_BASE[pageTypeId] ?? "Low";
}

function articleTypeBaseLevel(articleType: string): RiskLevel {
  return ARTICLE_TYPE_BASE[articleType] ?? "Low";
}

export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
  const evaluatedSteps: InferenceStep[] = [];
  const contributingSteps: InferenceStep[] = [];

  // 단계 1 - pageType base
  let base: RiskLevel = pageTypeBaseLevel(input.pageTypeId);
  const pageStep: InferenceStep = { source: "pageType", sourceValue: input.pageTypeId, level: base };
  evaluatedSteps.push(pageStep);
  contributingSteps.push(pageStep);

  // 단계 2 - articleType
  if (input.articleType) {
    const articleLevel = articleTypeBaseLevel(input.articleType);
    const step: InferenceStep = { source: "articleType", sourceValue: input.articleType, level: articleLevel };
    evaluatedSteps.push(step);
    if (riskHigher(articleLevel, base)) {
      base = articleLevel;
      contributingSteps.push(step);
    }
  }

  // 단계 3 - inlineRiskFlags
  for (const flag of input.inlineRiskFlags) {
    const flagLevel = inlineFlagLevel(flag);
    const step: InferenceStep = { source: "inlineRiskFlag", sourceValue: flag, level: flagLevel };
    evaluatedSteps.push(step);
    if (riskHigher(flagLevel, base)) {
      base = flagLevel;
      contributingSteps.push(step);
    }
  }

  // 단계 4 - slotMatches
  for (const slot of input.slotMatches) {
    const step: InferenceStep = { source: "slotMatch", sourceValue: slot.slotId, level: slot.triggeredLevel };
    evaluatedSteps.push(step);
    if (riskHigher(slot.triggeredLevel, base)) {
      base = slot.triggeredLevel;
      contributingSteps.push(step);
    }
  }

  // 단계 5 - explicitRiskLevel
  let final: RiskLevel = base;
  if (input.explicitRiskLevel) {
    const step: InferenceStep = {
      source: "explicitRiskLevel",
      sourceValue: input.explicitRiskLevel,
      level: input.explicitRiskLevel,
    };
    evaluatedSteps.push(step);
    if (riskHigher(input.explicitRiskLevel, final)) {
      final = input.explicitRiskLevel;
      contributingSteps.push(step);
    }
  }

  return {
    inferredRiskLevel: final,
    evaluatedSteps,
    contributingSteps,
  };
}
