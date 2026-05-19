// @glitzy/web/lib/compliance/transitions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 (CA-ACTION-06)
// REVIEW_WORKFLOW § 2.3 status 전이 table SoT.

import { ComplianceTransitionError } from "./types";

export type ContentWorkflowState =
  | "draft" | "review-queued" | "in-review" | "approved" | "publishable"
  | "published" | "blocked" | "rejected" | "stale";

const TRANSITIONS: Record<ContentWorkflowState, ContentWorkflowState[]> = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],  // 후자는 다음 검수자
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};

export function assertTransitionAllowed(from: ContentWorkflowState, to: ContentWorkflowState): void {
  const allowed = TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new ComplianceTransitionError(
      `Invalid status transition: ${from} → ${to}. Allowed: ${allowed.join(", ") || "(none)"}`,
    );
  }
}

export function listAllowedTransitions(from: ContentWorkflowState): ContentWorkflowState[] {
  return [...(TRANSITIONS[from] ?? [])];
}
