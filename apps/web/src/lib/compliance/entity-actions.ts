// @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
// 모든 6 entity edit page 가 사용.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { autoLinkOnPublish } from "@/lib/admin/publish-auto-link";
import { computeReadinessForEntity } from "@/lib/seo-readiness";
import { submitForReview, publishContent } from "./server-actions";
import { mapComplianceErrorToResult } from "./action-errors";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type SubmitContentType,
} from "./types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

const ENTITY_ROUTES: Record<SubmitContentType, string> = {
  Article: "articles",
  TreatmentPage: "treatments",
  LegalDocument: "legal-documents",
  FAQ: "faqs",
  Publication: "publications",
  MediaAppearance: "media-appearances",
};

export async function submitForReviewAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
        // CAP-CODE-02·03·04 + CAP-CODE2-01 정정 - 실 schema 안 entity별 body 컬럼 명 정정:
        //   Article = summary + body_markdown (article_type 컬럼 없음 - v0.1 default 'general-medical-info' · CA-DEFER-35 운영자 명시 Phase Beta)
        //   TreatmentPage = body_markdown
        //   FAQ = question + answer
        //   LegalDocument/Publication/MediaAppearance = exempt envelope 분기 - body select 불필요 (NULL)
        const isExempt = contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance";
        const bodySelect = isExempt ? "NULL::text"
          : contentType === "Article" ? "(summary || E'\\n\\n' || body_markdown)::text"
          : contentType === "TreatmentPage" ? "body_markdown::text"
          : contentType === "FAQ" ? "answer::text"
          : "NULL::text";
        const riskLevelSelect = isExempt || contentType === "FAQ" ? "NULL::text" : "risk_level::text";
        const faqQuestionSelect = contentType === "FAQ" ? "question::text" : "NULL::text";
        const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; faq_question: string | null }[]>(`
          SELECT status::text AS status,
                 ${riskLevelSelect} AS risk_level,
                 ${bodySelect} AS body,
                 ${faqQuestionSelect} AS faq_question
            FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        // FAQ 안 Q+A 결합 body + qa block scope 입력
        const row = rows[0]!;
        let body = row.body ?? "";
        let qaBlocks: Array<{ question: string; answer: string; offsetStart: number }> | undefined;
        if (contentType === "FAQ" && row.faq_question) {
          body = `${row.faq_question}\n\n${row.body ?? ""}`;
          qaBlocks = [{ question: row.faq_question, answer: row.body ?? "", offsetStart: 0 }];
        }
        // CAP-CODE2-01 - Article 안 articleType 실 schema 미존재 → v0.1 default
        const articleType = contentType === "Article" ? "general-medical-info" : undefined;
        const out = await submitForReview(tx, ctx, {
          contentType,
          contentRef,
          contentRow: {
            status: row.status,
            risk_level: row.risk_level,
            body,
            articleType,
            qaBlocks,
          },
        });
        // entity status draft → review-queued
        await tx.unsafe(`
          UPDATE ${table}
             SET status = 'review-queued'::content_publication_status, updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
        `);
        return { ok: true as const, ctx, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-submitted-for-review",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-07/10 정정: finalRoles · pageRiskLevel 포함
          payload: {
            contentType,
            contentRef,
            recordId: result.out.recordId,
            entryId: result.out.entryId,
            finalRoles: result.out.finalRoles,
            pageRiskLevel: result.out.pageRiskLevel,
          },
        });
        // CAP-CODE-10 정정 - content-gate 큐 진입 시 별도 audit emit (REVIEW_WORKFLOW § 9.1.1 정합 · source:"auto")
        if (result.out.contentGateEntryId) {
          await emitAuditEvent(sqlBase, {
            eventType: "content-gate-queued",
            actorUserId: result.ctx.userId,
            targetUserId: result.ctx.userId,
            toInstanceId: result.ctx.instanceId,
            payload: {
              contentType,
              contentRef,
              recordId: result.out.recordId,
              entryId: result.out.contentGateEntryId,
              finalRoles: result.out.finalRoles,
              source: "auto",
            },
          });
        }
      } catch (err) {
        console.error("[submitForReviewAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      // LWI-02 정정: LegalDocument 는 clinic-profile 통합 화면 안에 mount 됨 (별 edit route 없음)
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}`);
      // P3 UX 개선: submit 후 검수 큐로 redirect — "검수 진입했음" 명확 + 큐 안 진행 상황 즉시 확인
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[submitForReviewAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
  }
}

export async function publishContentAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
        //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
        const rows = await tx.unsafe<{ status: string }[]>(`
          SELECT status::text AS status FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const row = rows[0]!;
        if (row.status !== "publishable") {
          return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
        }
        // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
        const recRows = await tx<{ id: string; record_version: number }[]>`
          SELECT id, record_version FROM compliance_record
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND content_type = ${contentType}::compliance_content_type
             AND content_ref = ${contentRef}
             AND record_phase = 'pre-publish'::compliance_record_phase
           ORDER BY record_version DESC
           LIMIT 1
        `;
        if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
        await publishContent(tx, ctx, {
          contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
        });
        return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "no-record") {
      return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
    }
    if (result.ok === false && result.action === "not-publishable") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-published",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-11 정정: recordVersion 포함
          payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
        });
      } catch (err) {
        console.error("[publishContentAction] audit emit failed", err);
      }
      // 발행 후 자동 연결 — 키워드 primary(제목 실포함 검증) + FAQ related-to (publish-auto-link 규칙).
      // 발행 tx 와 분리: 자동 연결 실패가 발행을 되돌리면 안 됨 (non-blocking · 로그만).
      // revalidatePublicSite() 전에 실행해 공개 페이지 첫 렌더부터 FAQ 블록이 실리게 한다.
      if (contentType === "Article" || contentType === "TreatmentPage") {
        try {
          await withSkeletonTx(
            { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
            async (tx2, ctx2) => {
              const linked = await autoLinkOnPublish(tx2, ctx2.instanceId, contentType, contentRef);
              if (linked.entityId) {
                await computeReadinessForEntity(tx2, ctx2.instanceId, contentType, linked.entityId);
              }
            },
          );
        } catch (err) {
          console.error("[publishContentAction] auto-link failed (발행은 완료됨)", err);
        }
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      // 발행 콘텐츠는 공개 사이트에 즉시 반영 — full-route ISR 캐시 on-demand 무효화 (revalidate 창 대기 없이).
      revalidatePublicSite();
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[publishContentAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
  }
}
