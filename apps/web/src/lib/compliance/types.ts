// @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 (cycle 1~7 acceptance)
// SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result + § 14 envelope.extensions (CAP-18·19)

export type RiskLevel = "Low" | "Medium" | "High";

export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
export const ALLOWED_SUBMIT_TYPES = [
  "Article", "TreatmentPage", "LegalDocument",
  "FAQ", "Publication", "MediaAppearance",
] as const;
export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];

export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

// CONTENT_STANDARDS § 7.1 ComplianceCheckInput - Phase Alpha 안 metadata 신규 7 필드 (CAP-CASCADE-06)
export type ComplianceCheckInput = {
  contentType: ContentType;
  contentRef: string;
  body: string;  // Markdown
  metadata: {
    pageTypeId?: string;
    articleType?: string;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;
    // Phase Alpha 신규 - CAP-CASCADE-06
    reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
    mediaAttachments?: Array<{ kind: "image" | "video"; ref: string }>;
    legalDocumentType?: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
    locationProfileField?: "branchDescription" | "transportInfo" | "parkingInfo";
    priorReviewRequired?: boolean;
    priorReviewPassed?: boolean;
    qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
    entityFields?: Record<string, unknown>;
  };
  riskRules?: unknown[];  // 미사용 (loader 안 catalog 로드)
};

// CONTENT_STANDARDS § 7.2 Finding shape
export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  legalBasis?: string[];
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만
export type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    fail: number;
    "content-gate": number;
    warning: number;
    info: number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};

// Phase Alpha 안 envelope.extensions 신규 영역 (CAP-19 - SoT 7 필드 침해 없음)
export type SuppressedFinding = {
  finding: Finding;
  suppressedBy: string;
  reason: "safety" | "warning-message" | "administrative";
};

export type InferenceStep = {
  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
  sourceValue: string;
  level: RiskLevel;
};

export type InlineRiskFlag =
  | "includes-effect-claim"
  | "includes-pricing"
  | "includes-event"
  | "includes-before-after"
  | "includes-testimonial";

export type ExtensionsRecord = {
  suppressedByContextExceptions: SuppressedFinding[];
  inlineRiskFlagsEvidence: Partial<Record<InlineRiskFlag, Array<{ location: { start: number; end: number }; matchedText: string }>>>;
  // CAP-CODE-08 정정 - SoT (RISK_LEVELS § 2.3.1) 필드명 정합 - evaluatedSteps · contributingSteps
  evaluatedSteps: InferenceStep[];
  contributingSteps: InferenceStep[];
  ruleMatchStats: { categoryCounts: Record<string, number>; elapsedMs: number };
  inferredRiskLevelMismatch?: { external: RiskLevel; internal: RiskLevel; final: RiskLevel };
  clientRolePresent: boolean;
  suppressedLevelUpFlags: InlineRiskFlag[];   // CAP-CODE-07 - false-positive 완화 시 flag 보존 + RiskInference 격상 제외 영역
  engineMetadata: {
    catalogVersion: string;
    catalogHash: string;
    schemaHash: string;
    engineVersion: string;
    kssAvailable: boolean;
  };
};

// M0 wrapper - Phase Alpha 안 extensions 추가 (CAP-19)
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;
    catalogHash: string;
    manualReview: boolean;
    exemptReason?: string;
  };
  extensions?: ExtensionsRecord;   // CAP-19 - Phase Alpha 안 신규 영역 (Legal exempt 시 undefined 가능)
};

// 에러 type — fail closed
export class ComplianceConfigError extends Error {
  override readonly name = "ComplianceConfigError";
}
export class ComplianceTransitionError extends Error {
  override readonly name = "ComplianceTransitionError";
}
export class ReviewerEligibilityError extends Error {
  override readonly name = "ReviewerEligibilityError";
}
