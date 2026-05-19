// @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
// REVIEW_WORKFLOW § 4.1 SoT.

import type { ApproverRole, ContentType, RiskLevel } from "./types";
import { ComplianceConfigError } from "./types";

const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
 *   server action 안 try/catch 로 form-level error 변환.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (r === "client") {
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);
  }
  return Array.from(roles).sort();
}

export type ComplianceRecordRow = {
  peer_reviewer: string | null;
  peer_reviewed_at: Date | null;
  physician_approver: string | null;
  physician_approved_at: Date | null;
  legal_counsel: string | null;
  legal_counsel_at: Date | null;
  page_risk_level: RiskLevel;
  prior_review_required: boolean;
  prior_review_passed: boolean | null;
  auto_check_result: unknown;
};

export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
  if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
  if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
  if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
  return false;
}
