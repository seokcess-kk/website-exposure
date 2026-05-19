// @glitzy/compliance-rules — types
// SoT: docs/core/CONTENT_STANDARDS.md § 7.4 + docs/compliance/RISK_LEVELS.md § 2.3.1·§ 3
// COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 (cycle 1~7 acceptance)

export type RiskLevel = "Low" | "Medium" | "High";
export type Severity = "info" | "warning" | "fail" | "content-gate";
export type PatternType = "regex" | "keyword" | "phrase";
export type CompositePatternType = PatternType | "composite";
export type CompositeLogic = "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
export type ApproverRole = "medical" | "legal" | "operator" | "client";
export type ContextExceptionKind = "safety" | "warning-message" | "administrative";

export type ContentScope =
  | { type: "global" }
  | { type: "pageType"; pageTypeId: string }
  | { type: "articleType"; articleType: string }
  | { type: "block"; blockType: "qa" | "list" | "table" | "callout" | "citation" | "media" }
  | { type: "field"; contractId: string; fieldPath: string }
  | { type: "feature"; featureContentType: string };

export type SimpleOperand = {
  pattern: string;
  patternType: PatternType;
};

export type SimpleRiskRule = {
  id: string;
  category: string;
  pattern: string;
  patternType: PatternType;
  severity: Severity;
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];
  exceptions?: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type CompositeRiskRule = {
  id: string;
  category: string;
  patternType: "composite";
  operands: SimpleOperand[];
  logic: CompositeLogic;
  window?: number;
  severity: Severity;
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type RiskRule = SimpleRiskRule | CompositeRiskRule;

export type ContextException = {
  id: string;
  kind: ContextExceptionKind;
  pattern: string;
  patternType: PatternType;
  appliesTo: {
    categories?: string[];
    ruleIds?: string[];
    scopes?: ContentScope[];
  };
  rationale?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotMatchDefinition = {
  slotId: string;
  pageTypeId: string;
  triggeredLevel: RiskLevel;
  matchCondition:
    | { kind: "field-non-empty"; fieldPath: string }
    | { kind: "field-regex"; fieldPath: string; pattern: string }
    | { kind: "body-regex"; pattern: string };
  rationale?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotMatch = {
  pageTypeId: string;
  slotId: string;
  triggeredLevel: RiskLevel;
};

export type MedicalLawRevision = {
  revisionId: string;
  lawSource: string;
  affectedArticles?: string[];
  revisionEffectiveDate: string;
  revisionType: "amendment" | "reaffirmation" | "new";
  sourceUrl: string;
  checkedAt: string;
  checkedBy: string;
  affectedRuleIds: string[];
  staleScope: {
    kind: "all" | "rule-matched" | "content-type";
    contentTypes?: string[];
  };
  summary?: string;
};

export type RiskRuleOverride = {
  targetRuleId: string;
  patch: Partial<RiskRule>;
  rationale?: string;
  appliedAt: string;
};

export type InlineRiskFlag =
  | "includes-effect-claim"
  | "includes-pricing"
  | "includes-event"
  | "includes-before-after"
  | "includes-testimonial";

export type FindingSource = "static-rule" | "inferred" | "explicit" | "llm-assist";

export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: Severity;
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy: FindingSource;
  legalBasis?: string[];
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

export type SuppressedFinding = {
  finding: Finding;
  suppressedBy: string;
  reason: ContextExceptionKind;
};

export type InferenceStep = {
  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
  sourceValue: string;
  level: RiskLevel;
};

export type RiskInferenceInput = {
  pageTypeId: string;
  articleType?: string;
  inlineRiskFlags: InlineRiskFlag[];
  slotMatches: SlotMatch[];
  explicitRiskLevel?: RiskLevel;
};

export type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;
  evaluatedSteps: InferenceStep[];
  contributingSteps: InferenceStep[];
};

export type LoadedCatalog = {
  rules: RiskRule[];
  contextExceptions: ContextException[];
  slotMatches: SlotMatchDefinition[];
  medicalLawTracking: MedicalLawRevision[];
  catalogVersion: string;
  catalogHash: string;
  schemaHash: string;
  engineVersion: string;
  kssAvailable: boolean;
  warnings: string[];
};

export type ContentScopeInput = {
  contentType: string;
  pageTypeId: string;
  articleType?: string;
  contractId?: string;
  featureContentType?: string;
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
};

export type MatchResult = {
  findings: Finding[];
  suppressedFindings: SuppressedFinding[];
};

export type MatchSpan = { start: number; end: number };

export type InlineRiskFlagEvidence = {
  [flag in InlineRiskFlag]?: Array<{ location: MatchSpan; matchedText: string }>;
};

export type InlineRiskExtractionInput = {
  contentType: string;
  pageTypeId: string;
  articleType?: string;
  legalDocumentType?: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
  locationProfileField?: "branchDescription" | "transportInfo" | "parkingInfo";
  reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
  mediaAttachments?: Array<{ kind: "image" | "video"; ref: string }>;
};

export type InlineRiskExtractionResult = {
  inlineRiskFlags: InlineRiskFlag[];
  evidence: InlineRiskFlagEvidence;
  suppressedLevelUp: InlineRiskFlag[];   // CAP-CODE-07 - false-positive 완화 시 flag 보존 + RiskInference 격상만 제외
};
