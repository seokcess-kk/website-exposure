// @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — approveEntry · rejectEntry

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
import { mapComplianceErrorToResult } from "@/lib/compliance/action-errors";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type ApproverRole,
  type SubmitContentType,
} from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

export async function approveEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        const out = await approveContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
        });
        return { ok: true as const, ctx, entry, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-approved",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            allApproved: result.out.allApproved,
            entryStatus: result.out.entryStatus,
          },
        });
      } catch (err) {
        console.error("[approveEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      // LWI-02 정정: LegalDocument 의 경우 clinic-profile 화면도 revalidate (별 edit route 없음)
      if (result.entry.content_type === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      // P3 UX 개선: approve 후 큐 list 로 redirect — 다음 entry 처리 즉시 가능
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[approveEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "승인 중 오류가 발생했습니다." };
  }
}

export async function rejectEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 50) {
    return { ok: false, fieldErrors: { reason: ["거부 사유는 50자 이상이어야 합니다."] } };
  }
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        await rejectContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          reason,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
        });
        return { ok: true as const, ctx, entry };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-rejected",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            reason,
          },
        });
      } catch (err) {
        console.error("[rejectEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      // LWI-02 정정: LegalDocument 는 clinic-profile 화면도 revalidate
      if (result.entry.content_type === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[rejectEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "거부 처리 중 오류가 발생했습니다." };
  }
}
