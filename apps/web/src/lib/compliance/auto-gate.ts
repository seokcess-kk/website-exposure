// @glitzy/web/lib/compliance/auto-gate — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 12
// CA-DEFER-15 부분 해소 - submitForReview 트리거 한정 자동 큐 진입
// CAP-06 - block 콘텐츠 큐 진입 안 함
// CAP2-06 - event id 'content-gate-queued' + source: "auto"
// CAP-CODE-09 정정 - server-actions.ts 단일 경로 통합 (TenantContext from @glitzy/auth)

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";
import type { ComplianceCheckEnvelope, ContentType } from "./types";

const SLA_BUSINESS_DAYS = 3; // REVIEW_WORKFLOW § 3.3

function calculateContentGateSla(now: Date = new Date()): Date {
  // 영업일 3일 - 토/일 제외 (간단 구현 · holiday 미고려)
  let added = 0;
  const result = new Date(now);
  while (added < SLA_BUSINESS_DAYS) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

export async function enqueueContentGateIfNeeded(
  tx: ScopedTx,
  ctx: TenantContext,
  envelope: ComplianceCheckEnvelope,
  recordId: string,
  contentType: ContentType,
  contentRef: string,
): Promise<{ entryId: string | null }> {
  // CAP-06 - block 콘텐츠 큐 진입 안 함
  if (!envelope.result.gateRequired || envelope.result.automatedDecision === "block") {
    return { entryId: null };
  }

  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
  // CAP-CODE2-04 정정 - compliance_record_id 도 함께 매칭. 이전 record 안 stale entry 잘못 반환 회피.
  const existing = await tx<{ id: string }[]>`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}::uuid
      AND content_type = ${contentType}::compliance_content_type
      AND content_ref = ${contentRef}
      AND queue_type = 'content-gate'::review_queue_type
      AND compliance_record_id = ${recordId}::uuid
      AND status IN ('open', 'in-progress')
  `;
  if (existing.length > 0) return { entryId: existing[0]!.id };

  const requiredRoles = envelope.result.requiredApproverRoles ?? [];
  const slaDueAt = calculateContentGateSla();

  const inserted = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'content-gate'::review_queue_type,
      ${contentType}::compliance_content_type,
      ${contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${requiredRoles}::approver_role[],
      ${slaDueAt}::timestamptz
    )
    RETURNING id
  `;

  return { entryId: inserted[0]!.id };
}
