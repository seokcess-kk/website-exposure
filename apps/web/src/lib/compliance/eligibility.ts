// @glitzy/web/lib/compliance/eligibility — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 (CA-ACTION-03)
// admin_user role flag 검증 — assertActionEligibility wrapper.

import { assertActionEligibility, TenantResolveError, type TenantContext } from "@glitzy/auth";

import type { ApproverRole } from "./types";
import { ReviewerEligibilityError } from "./types";

/**
 * ApproverRole 별 admin_user flag 검증 (CAM-17·18 정합):
 *   - operator: operator/super-admin role + operator-edit-content action
 *   - medical: physician_reviewer_eligible flag + physician-review-approve action
 *   - legal: legal_reviewer_eligible flag + legal-review-approve action
 *
 * assertActionEligibility 안 TenantResolveError throw → ReviewerEligibilityError 변환.
 */
export function assertReviewerEligibility(ctx: TenantContext, role: ApproverRole): void {
  try {
    if (role === "operator") {
      assertActionEligibility(ctx, "operator-edit-content");
    } else if (role === "medical") {
      assertActionEligibility(ctx, "physician-review-approve");
    } else if (role === "legal") {
      assertActionEligibility(ctx, "legal-review-approve");
    }
  } catch (err) {
    if (err instanceof TenantResolveError) {
      throw new ReviewerEligibilityError(`Reviewer eligibility denied: role=${role} reason=${err.reason}`);
    }
    throw err;
  }
}
