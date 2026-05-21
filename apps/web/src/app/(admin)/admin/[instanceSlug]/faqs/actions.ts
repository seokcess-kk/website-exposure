// @glitzy/web/(admin)/[instanceSlug]/faqs/actions — EAT_CONTENT_PLAN v1.0
//   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSlugRetry } from "@/lib/slug-retry";
import { FaqInputSchema } from "@/lib/eat-content-schema";
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";
import {
  cleanupLinksForEntityDelete,
  EvidenceLinkValidationError,
  processEvidenceLinks,
} from "@/lib/admin/content-entity-link";
import { computeReadinessForEntity } from "@/lib/seo-readiness";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveFaq(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = FaqInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx(
            { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
            async (tx, ctx) => {
              assertActionEligibility(ctx, "operator-edit-content");
              // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
              const sentinelId = await ensureSentinelComplianceRecord(tx, {
                instanceId: ctx.instanceId,
                contentType: "FAQ",
                contentRef: slugAttempt,
                userId: ctx.userId,
              });
              const insertedRows = await tx<{ id: string }[]>`
                INSERT INTO faq (
                  instance_id, slug, question, answer, display_order,
                  category_id, author_doctor_id, related_treatment_id, status,
                  risk_level, compliance_record_id, published_at
                ) VALUES (
                  ${ctx.instanceId}::uuid,
                  ${slugAttempt},
                  ${parsed.data.question},
                  ${parsed.data.answer},
                  ${Number(parsed.data.displayOrder)},
                  ${parsed.data.categoryId ?? null}::uuid,
                  ${parsed.data.authorDoctorId ?? null}::uuid,
                  ${parsed.data.relatedTreatmentId ?? null}::uuid,
                  'published'::content_publication_status,
                  'Low'::risk_level,
                  ${sentinelId}::uuid,
                  NOW()
                )
                RETURNING id
              `;
              const faqId = insertedRows[0]!.id;
              // EVIDENCE_LINKING_PLAN Phase A
              await processEvidenceLinks(tx, {
                instanceId: ctx.instanceId,
                sourceType: "FAQ",
                sourceId: faqId,
                formData,
              });
              await computeReadinessForEntity(tx, ctx.instanceId, "FAQ", faqId);
              return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "published" };
            },
          ),
        )
      : await withSkeletonTx(
          { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
          async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            const beforeRows = await tx<{ id: string; status: string }[]>`
              SELECT id, status::text AS status FROM faq
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
               FOR UPDATE
            `;
            if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
            const beforeStatus = beforeRows[0]!.status;

            // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
            const sentinelId = await ensureSentinelComplianceRecord(tx, {
              instanceId: ctx.instanceId,
              contentType: "FAQ",
              contentRef: parsed.data.slug,
              userId: ctx.userId,
            });
            await tx`
              UPDATE faq
                 SET slug = ${parsed.data.slug},
                     question = ${parsed.data.question},
                     answer = ${parsed.data.answer},
                     display_order = ${Number(parsed.data.displayOrder)},
                     category_id = ${parsed.data.categoryId ?? null}::uuid,
                     author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                     related_treatment_id = ${parsed.data.relatedTreatmentId ?? null}::uuid,
                     status = 'published'::content_publication_status,
                     published_at = COALESCE(published_at, NOW()),
                     risk_level = 'Low'::risk_level,
                     compliance_record_id = ${sentinelId}::uuid,
                     updated_at = now()
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
            `;
            // EVIDENCE_LINKING_PLAN Phase A
            const faqId = beforeRows[0]!.id;
            await processEvidenceLinks(tx, {
              instanceId: ctx.instanceId,
              sourceType: "FAQ",
              sourceId: faqId,
              formData,
            });
            await computeReadinessForEntity(tx, ctx.instanceId, "FAQ", faqId);
            void beforeStatus;
            return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: "published" };
          },
        );

    if (txResult.ok === false && txResult.action === "notfound") notFound();
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveFaq] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/faqs`);
      revalidatePath(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/faqs/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof EvidenceLinkValidationError) {
      return { ok: false, fieldErrors: {}, formError: `근거 연결 오류: ${err.message}` };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveFaq] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteFaq(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        // EVIDENCE_LINKING_PLAN Phase A — orphan cleanup
        const targetRows = await tx<{ id: string }[]>`
          SELECT id FROM faq
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           LIMIT 1
        `;
        if (targetRows.length === 0) return { deleted: 0 };
        const faqId = targetRows[0]!.id;
        const { affectedSources } = await cleanupLinksForEntityDelete(tx, ctx.instanceId, "FAQ", faqId);

        const deleted = await tx<{ id: string }[]>`
          DELETE FROM faq
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${faqId}::uuid
           RETURNING id
        `;
        await tx`
          DELETE FROM seo_readiness_snapshot
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND entity_type = 'FAQ'
             AND entity_id = ${faqId}::uuid
        `;
        for (const src of affectedSources) {
          if (src.sourceId === faqId) continue;
          await computeReadinessForEntity(tx, ctx.instanceId, src.sourceType, src.sourceId);
        }
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 FAQ 가 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "FAQ", slug },
      });
    } catch (err) {
      console.error("[deleteFaq] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/faqs`);
    revalidatePath(`/admin/${instanceSlug}/faqs/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/faqs`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteFaq] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
