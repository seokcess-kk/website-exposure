// @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
// 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ContentType,
  SubmitContentType,
} from "./types";
import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
import { check, buildLegalDocumentExemptEnvelope, buildExternalCitationExemptEnvelope } from "./check";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
import { evaluatePublishable } from "./publishable-check";
import { assertReviewerEligibility } from "./eligibility";
import { enqueueContentGateIfNeeded } from "./auto-gate";

const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };

/**
 * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
 *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
 */
async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
}

function isAllowedSubmitType(t: string): t is SubmitContentType {
  return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
}

export type SubmitForReviewArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  // CAP-CODE-02 정정 - entity별 본문 + FAQ Q/A + Article articleType 전달.
  contentRow: {
    status: string;
    risk_level?: string | null;
    body?: string;
    articleType?: string;   // CAP-CODE-03 - Article 만 사용
    qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;   // CAP-CODE-02 - FAQ 만 사용
  };
};

export type SubmitForReviewResult = {
  recordId: string;
  entryId: string;
  finalRoles: ApproverRole[];   // CAMC-07/10
  pageRiskLevel: "Low" | "Medium" | "High";
  contentGateEntryId: string | null;   // CA-DEFER-15 부분 해소 - Phase Alpha auto-gate (CAP-06·07)
};

/**
 * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
 */
export async function submitForReview(
  tx: ScopedTx,
  ctx: TenantContext,
  args: SubmitForReviewArgs,
): Promise<SubmitForReviewResult> {
  if (!isAllowedSubmitType(args.contentType)) {
    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  }
  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");

  const checkInput = {
    contentType: args.contentType,
    contentRef: args.contentRef,
    body: args.contentRow.body ?? "",
    metadata: {
      explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
      // CAP-CODE-03 정정 - Article 안 articleType 전달
      articleType: args.contentRow.articleType,
      // CAP-CODE-02 정정 - FAQ 안 Q/A 결합 + qa block scope
      qaBlocks: args.contentRow.qaBlocks,
    },
  };
  // CAP-CODE-04 정정 - 외부 인용 entity (Publication / MediaAppearance) exempt 처리
  let envelope: ComplianceCheckEnvelope;
  if (args.contentType === "LegalDocument") {
    envelope = buildLegalDocumentExemptEnvelope(checkInput);
  } else if (args.contentType === "Publication" || args.contentType === "MediaAppearance") {
    envelope = buildExternalCitationExemptEnvelope(checkInput);
  } else {
    envelope = await check(checkInput);
  }

  const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);

  // ComplianceRecord INSERT (pre-publish)
  const slaHours = SLA_DUE_HOURS.P0;
  const recordRows = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
      record_phase, record_version, metadata
    ) VALUES (
      ${ctx.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${envelope.meta.pageRiskLevel}::risk_level,
      ${tx.json({ ...envelope.result, extensions: envelope.extensions ?? null } as unknown as never)},
      'pre-publish'::compliance_record_phase,
      1,
      ${tx.json({
        manualReview: envelope.meta.manualReview,
        catalogVersion: envelope.meta.catalogVersion,
        catalogHash: envelope.meta.catalogHash,
        ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
      } as unknown as never)}
    )
    RETURNING id
  `;
  const recordId = recordRows[0]!.id;

  // ReviewQueueEntry INSERT (open)
  const entryRows = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'manual-review'::review_queue_type,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${finalRoles}::approver_role[],
      ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
    )
    RETURNING id
  `;
  const entryId = entryRows[0]!.id;

  // CAP-CODE-09·10·11 정정 - auto-gate helper 단일 경로 통합 (server-actions 중복 SQL 제거 · 영업일 3일 SLA · content-gate-queued audit emit 별도 wrapper)
  const gateResult = await enqueueContentGateIfNeeded(tx, ctx, envelope, recordId, args.contentType, args.contentRef);
  const contentGateEntryId: string | null = gateResult.entryId;

  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel, contentGateEntryId };
}

export type ApproveContentArgs = {
  recordId: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
  // CAP-CODE-13 정정 - 호출자가 선택한 entry 만 잠금 + 처리. manual-review · content-gate 동시 open 가능.
  entryId: string;
};

export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };

/**
 * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 * AND 게이트 충족 시 in-review → approved 자동 전이.
 */
export async function approveContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: ApproveContentArgs,
): Promise<ApproveContentResult> {
  assertReviewerEligibility(ctx, args.role);
  await acquireRecordLock(tx, args.recordId);

  // entry + record FOR UPDATE
  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 호출자가 잠금 entry 결정.
  const entryRows = await tx<{ id: string; status: string; queue_type: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, status::text AS status, queue_type::text AS queue_type, assigned_to, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
  const entry = entryRows[0]!;
  if (!entry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
    );
  }
  // CAMC3-01: entry vs args 정합 — drift 차단
  const expectedContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
    );
  }

  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
  if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
    throw new ComplianceTransitionError(
      `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
    );
  }
  if (record.content_type !== expectedContentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${expectedContentType}/${args.contentRef}`,
    );
  }

  // 중복 approve idempotent
  // CAP-CODE2-02 정정 - role slot 이미 채워져 있어도 본 entry 가 open/in-progress 면 resolve 처리.
  //   manual-review + content-gate 동시 open 시 - 두 번째 큐 approve 시 record slot 이미 만족 → entry resolve + AND 게이트 평가.
  // CAP-CODE3-01 정정 - entry.required_roles 안 모든 role 이 record 안 satisfied 충족할 때 만 resolve.
  //   multi-role entry (예: ['operator','medical']) 안 operator approve 후 다시 호출 시 - medical 미충족 → entry 유지.
  if (isRoleSatisfied(record, args.role)) {
    const allRequiredSatisfied = entry.required_roles.every((r) => isRoleSatisfied(record, r as ApproverRole));
    if (allRequiredSatisfied && entry.status !== "resolved") {
      await tx`
        UPDATE review_queue_entry
           SET status = 'resolved'::review_queue_status,
               resolved_at = now(),
               resolved_by = ${ctx.userId}::uuid,
               resolution_type = 'approved',
               updated_at = now()
         WHERE id = ${entry.id}::uuid
      `;
      // CAP-CODE2-02 - AND 게이트 재평가 - 모든 큐 resolved 시 entity 전이
      const openSiblings2 = await tx<{ cnt: string }[]>`
        SELECT count(*)::text AS cnt FROM review_queue_entry
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND compliance_record_id = ${args.recordId}::uuid
           AND status IN ('open', 'in-progress')
      `;
      if (Number(openSiblings2[0]?.cnt ?? "0") === 0) {
        const publishable2 = evaluatePublishable(record, record.content_type as ContentType);
        const targetStatus2 = publishable2.publishable ? "publishable" : "approved";
        await tx.unsafe(`
          UPDATE ${args.contentTable}
             SET status = '${targetStatus2}'::content_publication_status,
                 updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
        `);
      }
      return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: "resolved" };
    }
    // multi-role entry 안 미충족 role 잔존 - in-progress 로 전이 (open 인 경우만 in-progress 로 격상 · assigned 기록)
    // CAP-CODE4-01 정정 - ApproveContentResult.entryStatus 타입 계약 정합 ("in-progress" | "resolved" 만)
    if (entry.status === "open") {
      await tx`
        UPDATE review_queue_entry
           SET status = 'in-progress'::review_queue_status,
               assigned_to = ${ctx.userId}::uuid,
               assigned_at = now(),
               updated_at = now()
         WHERE id = ${entry.id}::uuid
      `;
    }
    return { allApproved: false, entryStatus: "in-progress" };
  }

  // 슬롯 채움 + entity 전이
  const now = new Date();
  if (args.role === "operator") {
    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  } else if (args.role === "medical") {
    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.physician_approver = ctx.userId; record.physician_approved_at = now;
  } else if (args.role === "legal") {
    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  }

  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  if (entry.status === "open") {
    await tx`
      UPDATE review_queue_entry
         SET status = 'in-progress'::review_queue_status,
             assigned_to = ${ctx.userId}::uuid,
             assigned_at = ${now.toISOString()}::timestamptz,
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
  }

  // entity status 전이 review-queued → in-review (첫 approve)
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = CASE
         WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
         ELSE status
       END,
       updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);

  // AND 게이트 평가
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));

  let entryStatus: "in-progress" | "resolved" = "in-progress";
  if (allApproved) {
    // entry resolved
    await tx`
      UPDATE review_queue_entry
         SET status = 'resolved'::review_queue_status,
             resolved_at = ${now.toISOString()}::timestamptz,
             resolved_by = ${ctx.userId}::uuid,
             resolution_type = 'approved',
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
    entryStatus = "resolved";

    // CAP-CODE-14 정정 - AND 게이트 - 동일 record 의 모든 open/in-progress 큐 entry 가 resolved 되어야만 publishable 전이
    //   manual-review + content-gate 동시 open 시 둘 다 resolved 후 publishable.
    const openSiblings = await tx<{ cnt: string }[]>`
      SELECT count(*)::text AS cnt
        FROM review_queue_entry
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND compliance_record_id = ${args.recordId}::uuid
         AND status IN ('open', 'in-progress')
    `;
    const remainingOpen = Number(openSiblings[0]?.cnt ?? "0");
    if (remainingOpen === 0) {
      // 모든 큐 resolved - publishable evaluator pass 시 publishable, 아니면 approved
      const publishable = evaluatePublishable(record, record.content_type as ContentType);
      const targetStatus = publishable.publishable ? "publishable" : "approved";
      await tx.unsafe(`
        UPDATE ${args.contentTable}
           SET status = '${targetStatus}'::content_publication_status,
               updated_at = now()
         WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
      `);
    }
    // remainingOpen > 0 인 경우 - entity status 변경 안 함 (in-review 유지 · 다른 큐 처리 대기)
  }

  return { allApproved, entryStatus };
}

function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  return finalRoles.every((r) => isRoleSatisfied(record, r));
}

export type RejectContentArgs = {
  recordId: string;
  reason: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
  entryId: string;   // CAP-CODE-13 정정
};

/**
 * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
 */
export async function rejectContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: RejectContentArgs,
): Promise<void> {
  assertReviewerEligibility(ctx, args.role);
  if (args.reason.trim().length < 50) {
    throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
  }
  await acquireRecordLock(tx, args.recordId);

  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
  // CAMC3-01 정정: content_type/content_ref drift 검증.
  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 엉뚱한 큐 처리 회피.
  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
  const rejEntry = entryRows[0]!;
  if (!rejEntry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
    );
  }
  const expectedRejContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
    );
  }
  // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
  const recRejRows = await tx<{ content_type: string; content_ref: string }[]>`
    SELECT content_type::text AS content_type, content_ref FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  `;
  if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  if (recRejRows[0]!.content_type !== expectedRejContentType || recRejRows[0]!.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${recRejRows[0]!.content_type}/${recRejRows[0]!.content_ref}, args=${expectedRejContentType}/${args.contentRef}`,
    );
  }

  const now = new Date();
  // CAP-CODE2-03 정정 - 선택된 entry resolve + 동일 record 의 sibling open/in-progress 큐 모두 동반 resolve.
  //   reject 시 manual-review · content-gate 양 큐 정리 (stale entry 회피).
  await tx`
    UPDATE review_queue_entry
       SET status = 'resolved'::review_queue_status,
           resolved_at = ${now.toISOString()}::timestamptz,
           resolved_by = ${ctx.userId}::uuid,
           resolution_type = 'rejected',
           metadata = metadata || ${tx.json({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role } as unknown as never)},
           updated_at = now()
     WHERE instance_id = ${ctx.instanceId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
  `;
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = 'rejected'::content_publication_status,
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);
}

export type PublishContentArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  recordId: string;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
};

export type PublishContentResult = { recordVersion: number };

/**
 * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
 *   entity.status → published + published_at 채움.
 *   publishable evaluator 통과 검증.
 */
export async function publishContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: PublishContentArgs,
): Promise<PublishContentResult> {
  assertReviewerEligibility(ctx, "operator");
  await acquireRecordLock(tx, args.recordId);

  // record FOR UPDATE
  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           record_phase::text AS record_phase, record_version,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
  // CAMC4-01 정정: record vs args 정합 검증
  if (record.content_type !== args.contentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${args.contentType}/${args.contentRef}`,
    );
  }

  const publishable = evaluatePublishable(record, args.contentType);
  if (!publishable.publishable) {
    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  }

  // CAP-CODE-15 정정 - 발행 전 동일 record 의 open/in-progress 큐 entry 부재 검증.
  //   manual-review · content-gate 큐 중 1+ 가 open 이면 publish 차단.
  const openEntries = await tx<{ cnt: string }[]>`
    SELECT count(*)::text AS cnt
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
  `;
  const remainingOpen = Number(openEntries[0]?.cnt ?? "0");
  if (remainingOpen > 0) {
    throw new ComplianceTransitionError(`Cannot publish - ${remainingOpen} open queue entry remaining (AND gate)`);
  }

  // CAMC-06 정정: entity 현 status='publishable' assert
  const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
    SELECT status::text AS status FROM ${args.contentTable}
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
     FOR UPDATE
  `);
  if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
  assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");

  const now = new Date();
  // (1) compliance_record record_phase 전환 (record ID 보존)
  await tx`
    UPDATE compliance_record
       SET record_phase = 'published'::compliance_record_phase,
           published_at = ${now.toISOString()}::timestamptz,
           published_by = ${ctx.userId}::uuid,
           updated_at = now()
     WHERE id = ${args.recordId}::uuid
  `;
  // (2) entity status → published + published_at + compliance_record_id 채움.
  //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
  const updated = await tx.unsafe<{ id: string }[]>(`
    UPDATE ${args.contentTable}
       SET status = 'published'::content_publication_status,
           published_at = '${now.toISOString()}'::timestamptz,
           compliance_record_id = '${args.recordId}',
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
       AND status = 'publishable'::content_publication_status
     RETURNING id
  `);
  if (updated.length !== 1) {
    throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
  }
  return { recordVersion: record.record_version };
}
