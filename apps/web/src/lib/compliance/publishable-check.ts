// @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
// REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.

import type { ApproverRole, ContentType } from "./types";
import { ComplianceConfigError } from "./types";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";

export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
  | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
  const required = autoCheck?.requiredApproverRoles ?? [];

  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }

  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck?.automatedDecision === "block") {
    reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  }
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
  // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
