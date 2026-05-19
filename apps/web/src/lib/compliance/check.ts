// @glitzy/web/lib/compliance/check — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 7 (cycle 1~7 acceptance)
// M0 stub 완전 재작성 - 9단계 풀 흐름 (CA-DEFER-01 부분 해소 + CA-DEFER-02·11·15 해소)

import {
  getCachedCatalog,
  matchRules,
  evaluateInline,
  inferRisk,
  evaluateSlots,
  maxRisk,
} from "@glitzy/compliance-rules";
import type {
  Finding as CrFinding,
  RiskLevel as CrRiskLevel,
  InlineRiskFlag as CrInlineRiskFlag,
} from "@glitzy/compliance-rules";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ComplianceCheckInput,
  ComplianceCheckResult,
  ExtensionsRecord,
  Finding,
  InferenceStep,
  RiskLevel,
} from "./types";
import { ComplianceConfigError } from "./types";
import { calculateFinalRoles } from "./final-roles";

const M0_LEGAL_EXEMPT_REASON = "LegalDocument-CONTENT_STANDARDS-7.1.1.1";
const EXTERNAL_CITATION_EXEMPT_REASON = "ExternalCitation-CONTENT_STANDARDS-7.1.1.2";

/**
 * CAP-CODE-04 정정 - Publication / MediaAppearance 외부 인용 entity 면제 envelope.
 *   CONTENT_STANDARDS § 7.1.1.2 매트릭스 - RiskRule + RiskInference + answer-first + 표현 검사 모두 면제.
 *   submitForReview 안 contentType ∈ {Publication, MediaAppearance} 분기에서 본 helper 호출.
 */
export function buildExternalCitationExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  const pageRiskLevel = maxRiskLevel(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel,
      catalogVersion: "exempt",
      catalogHash: "exempt",
      manualReview: false,
      exemptReason: EXTERNAL_CITATION_EXEMPT_REASON,
    },
  };
}

/**
 * LegalDocument 면제 envelope (M0 유지). check() 호출 자체 우회.
 *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
 *   extensions 영역 부재 (Legal exempt - 룰 매칭 안 함).
 */
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  const pageRiskLevel = maxRiskLevel(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel,
      catalogVersion: "exempt",
      catalogHash: "exempt",
      manualReview: false,
      exemptReason: M0_LEGAL_EXEMPT_REASON,
    },
  };
}

function maxRiskLevel(a: RiskLevel, b: RiskLevel, c: RiskLevel): RiskLevel {
  const ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };
  let max: RiskLevel = a;
  if (ORDER[b] > ORDER[max]) max = b;
  if (ORDER[c] > ORDER[max]) max = c;
  return max;
}

function derivePageTypeId(contentType: ComplianceCheckInput["contentType"]): string | undefined {
  const map: Record<string, string | undefined> = {
    Article: "P-010",
    TreatmentPage: "P-006",
    FAQ: "P-011",
    LegalDocument: "P-013",
    Publication: undefined,
    MediaAppearance: undefined,
    ClinicProfile: "P-002",
    DoctorProfile: "P-004",
    LocationProfile: "P-014",
    MedicalConditionPage: "P-008",
    ReviewPolicy: undefined,
    PricingPage: "P-102",
    FacilitiesPage: "P-103",
    NewsItem: "P-104",
    ReservationPage: "P-105",
    ArticleCategory: undefined,
    Feature: undefined,
  };
  return map[contentType];
}

function buildUnreviewedAdFinding(): Finding {
  return {
    ruleId: "unreviewed-ad-001",
    category: "미심의 광고",
    pattern: "(meta:priorReviewRequired)",
    severity: "warning",
    location: { start: 0, end: 0 },
    requiredApproverRoles: ["legal"],
    triggeredBy: "static-rule",
    legalBasis: ["medical-law-art56-para2-no11"],
  };
}

function buildHighGateFinding(input: ComplianceCheckInput): Finding {
  const triggeredBy: "explicit" | "inferred" =
    input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred";
  const articleType = input.metadata.articleType;
  let requiredApproverRoles: ApproverRole[] = ["medical"];
  if (articleType === "review-case") requiredApproverRoles = ["medical", "legal"];
  else if (articleType === "event-price") requiredApproverRoles = ["legal"];
  return {
    ruleId: "risk-level-high-gate",
    category: "위험도 강제 검수",
    pattern: "(RiskLevel=High)",
    severity: "content-gate",
    location: { start: 0, end: 0 },
    requiredApproverRoles,
    triggeredBy,
    legalBasis: [],
  };
}

function extractFindingRoles(findings: Finding[]): string[] {
  const all: string[] = [];
  for (const f of findings) {
    const roles = f.requiredApproverRoles;
    if (!Array.isArray(roles)) continue;
    for (const r of roles) {
      if (typeof r === "string" && r.length > 0) all.push(r);
    }
  }
  return Array.from(new Set(all));
}

function aggregate(findings: Finding[]): {
  automatedDecision: ComplianceCheckResult["automatedDecision"];
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  bySeverity: ComplianceCheckResult["findingsBySeverity"];
} {
  const counts = { fail: 0, "content-gate": 0, warning: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;
  const buildBlocked = counts.fail > 0;
  const gateRequired = counts["content-gate"] > 0;
  const hasWarnings = counts.warning > 0;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (buildBlocked) automatedDecision = "block";
  else if (gateRequired) automatedDecision = "gate";
  else if (hasWarnings) automatedDecision = "warn";
  return { automatedDecision, buildBlocked, gateRequired, hasWarnings, bySeverity: counts };
}

function adaptCrFinding(f: CrFinding): Finding {
  return {
    ruleId: f.ruleId,
    category: f.category,
    pattern: f.pattern,
    severity: f.severity,
    location: f.location,
    suggestion: f.suggestion,
    requiredApproverRoles: f.requiredApproverRoles?.filter(
      (r): r is ApproverRole => r === "operator" || r === "medical" || r === "legal",
    ),
    triggeredBy: f.triggeredBy,
    legalBasis: f.legalBasis,
    llmAssistMeta: f.llmAssistMeta,
  };
}

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  const startMs = Date.now();

  // 1. LegalDocument 진입 차단 (M0 유지)
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
        "Use buildLegalDocumentExemptEnvelope() instead.",
    );
  }

  // 2. pageTypeId 유도
  const pageTypeId = input.metadata.pageTypeId ?? derivePageTypeId(input.contentType);
  if (!pageTypeId) {
    throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);
  }

  // 3. articleType 검증
  if (input.contentType === "Article" && !input.metadata.articleType) {
    throw new ComplianceConfigError("Article 은 articleType required");
  }

  // 4. 카탈로그 로드 (메모리 캐시 · fail closed)
  const catalog = await getCachedCatalog();

  // 5. RiskRule 매칭
  const matchResult = matchRules(
    input.body,
    catalog.rules,
    catalog.contextExceptions,
    {
      contentType: input.contentType,
      pageTypeId,
      articleType: input.metadata.articleType,
      qaBlocks: input.metadata.qaBlocks,
    },
    catalog.kssAvailable,
  );
  const crFindings = matchResult.findings.map(adaptCrFinding);

  // 6. inlineRiskFlags 추출
  const inlineFlagResult = evaluateInline(input.body, matchResult.findings, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    legalDocumentType: input.metadata.legalDocumentType,
    locationProfileField: input.metadata.locationProfileField,
    reviewPolicy: input.metadata.reviewPolicy,
    mediaAttachments: input.metadata.mediaAttachments,
  });

  // 7. slotMatches 계산 (v0.1 항상 빈 배열)
  const slotMatches = evaluateSlots(
    { pageTypeId, body: input.body, entityFields: input.metadata.entityFields },
    catalog.slotMatches,
  );

  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
  // CAP-CODE-07 정정 - suppressedLevelUp flag 는 RiskInference 입력 안 제외 (격상만 회피 · evidence 안 보존)
  const inferenceFlags = inlineFlagResult.inlineRiskFlags.filter(
    (f) => !inlineFlagResult.suppressedLevelUp.includes(f),
  ) as CrInlineRiskFlag[];
  const inference = inferRisk({
    pageTypeId,
    articleType: input.metadata.articleType,
    inlineRiskFlags: inferenceFlags,
    slotMatches,
    explicitRiskLevel: input.metadata.explicitRiskLevel as CrRiskLevel | undefined,
  });

  // 9. 외부 inferredRiskLevel 입력 MAX 결합 (CAP-11)
  let finalRiskLevel: RiskLevel = inference.inferredRiskLevel;
  let inferredRiskLevelMismatch: ExtensionsRecord["inferredRiskLevelMismatch"] | undefined;
  if (input.metadata.inferredRiskLevel) {
    finalRiskLevel = maxRisk(inference.inferredRiskLevel, input.metadata.inferredRiskLevel);
    if (input.metadata.inferredRiskLevel !== inference.inferredRiskLevel) {
      inferredRiskLevelMismatch = {
        external: input.metadata.inferredRiskLevel,
        internal: inference.inferredRiskLevel,
        final: finalRiskLevel,
      };
    }
  }

  // 10. High 가상 finding 주입
  const allFindings: Finding[] = [...crFindings];
  if (finalRiskLevel === "High") {
    allFindings.push(buildHighGateFinding(input));
  }

  // 11. priorReviewRequired 메타 검사 (§ 7.3)
  if (input.metadata.priorReviewRequired === true && input.metadata.priorReviewPassed !== true) {
    allFindings.push(buildUnreviewedAdFinding());
  }

  // 12. severity 집계
  const aggregated = aggregate(allFindings);

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 positional)
  const findingRoles = extractFindingRoles(allFindings);
  const clientRolePresent = findingRoles.includes("client");
  const findingRolesWithoutClient = findingRoles.filter((r) => r !== "client");
  // calculateFinalRoles throw 시 - check() bubble · 호출자 try/catch boundary (CAP3-01 · § 7.1.2)
  const runtimeRoles = calculateFinalRoles(
    input.contentType,
    finalRiskLevel,
    input.metadata.priorReviewRequired ?? false,
    findingRolesWithoutClient,
  );

  const elapsedMs = Date.now() - startMs;
  const categoryCounts: Record<string, number> = {};
  for (const f of crFindings) {
    categoryCounts[f.category] = (categoryCounts[f.category] ?? 0) + 1;
  }

  return {
    result: {
      automatedDecision: aggregated.automatedDecision,
      buildBlocked: aggregated.buildBlocked,
      gateRequired: aggregated.gateRequired,
      hasWarnings: aggregated.hasWarnings,
      findingsBySeverity: aggregated.bySeverity,
      requiredApproverRoles: runtimeRoles,
      findings: allFindings,
    },
    meta: {
      pageRiskLevel: finalRiskLevel,
      catalogVersion: catalog.catalogVersion,
      catalogHash: catalog.catalogHash,
      manualReview: false,
    },
    extensions: {
      suppressedByContextExceptions: matchResult.suppressedFindings.map((sf) => ({
        finding: adaptCrFinding(sf.finding),
        suppressedBy: sf.suppressedBy,
        reason: sf.reason,
      })),
      inlineRiskFlagsEvidence: inlineFlagResult.evidence as ExtensionsRecord["inlineRiskFlagsEvidence"],
      // CAP-CODE-08 정정 - SoT 필드명
      evaluatedSteps: inference.evaluatedSteps as InferenceStep[],
      contributingSteps: inference.contributingSteps as InferenceStep[],
      ruleMatchStats: { categoryCounts, elapsedMs },
      inferredRiskLevelMismatch,
      clientRolePresent,
      // CAP-CODE-07 - false-positive 완화 flag 보존 영역
      suppressedLevelUpFlags: inlineFlagResult.suppressedLevelUp as ExtensionsRecord["suppressedLevelUpFlags"],
      engineMetadata: {
        catalogVersion: catalog.catalogVersion,
        catalogHash: catalog.catalogHash,
        schemaHash: catalog.schemaHash,
        engineVersion: catalog.engineVersion,
        kssAvailable: catalog.kssAvailable,
      },
    },
  };
}
