// @glitzy/web/lib/compliance/action-errors — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 17.b
// CAP3-01 boundary 정책 + CAP5-01 action 책임 분리 + CAP6-01 SaveResult 정합

import type { SaveResult } from "@/lib/save-result";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
} from "./types";

/**
 * 4 action wrapper 공통 boundary - mapComplianceErrorToResult.
 *   3 error type form-level 변환. 매핑 안 되면 null → 호출자 throw bubble (Next.js 500).
 */
export function mapComplianceErrorToResult(e: unknown): SaveResult | null {
  if (e instanceof ComplianceConfigError) {
    return { ok: false, fieldErrors: {}, formError: `compliance config error: ${e.message}` };
  }
  if (e instanceof ComplianceTransitionError) {
    return { ok: false, fieldErrors: {}, formError: `compliance transition error: ${e.message}` };
  }
  if (e instanceof ReviewerEligibilityError) {
    return { ok: false, fieldErrors: {}, formError: `reviewer eligibility error: ${e.message}` };
  }
  return null;
}
