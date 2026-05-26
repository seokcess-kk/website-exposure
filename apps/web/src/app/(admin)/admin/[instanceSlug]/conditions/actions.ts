// @glitzy/web/(admin)/[instanceSlug]/conditions/actions
// EXPOSURE_READINESS Phase B — Conditions CRUD (treatments actions 패턴 정합 · 단순 버전).

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSlugRetry } from "@/lib/slug-retry";
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";
import { resolveAdminImageInput } from "@/lib/admin/upload-image";
import {
  cleanupLinksForEntityDelete,
  EvidenceLinkValidationError,
  processEvidenceLinks,
} from "@/lib/admin/content-entity-link";
import { cleanupKeywordLinksForEntityDelete } from "@/lib/admin/keyword-content-link";
import type { SaveResult } from "@/lib/save-result";

const RISK_LEVELS = ["Low", "Medium", "High"] as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), { message: "slug 는 3~100자 (소문자/숫자/하이픈)" }),
  title: z
    .string({ required_error: "증상명은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 200, { message: "증상명은 1~200자" }),
  summary: z
    .string({ required_error: "요약은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 50 && v.length <= 160, { message: "요약은 50~160자" }),
  bodyMarkdown: z
    .string({ required_error: "본문은 필수입니다." })
    .min(1, "본문은 1자 이상")
    .max(50_000, "본문은 50000자 이내"),
  riskLevel: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
      message: "위험도는 Low / Medium / High",
    }),
  heroImageUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^(https?:\/\/|\/uploads\/)/.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https 또는 첨부 경로 · 2048자",
    }),
  primaryTreatmentId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_RE.test(v), { message: "primary_treatment_id 형식 오류" }),
});

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveCondition(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  // hero image upload (treatments 패턴 정합)
  const imgResult = await resolveAdminImageInput({
    instanceSlug,
    uploadKind: "condition-hero",
    urlField: "heroImageUrl",
    fileField: "heroImageFile",
    modeField: "heroImageMode",
    formData,
  });
  if (imgResult.ok === false) return { ok: false, fieldErrors: { heroImageUrl: [imgResult.message] } };
  formData.set("heroImageUrl", imgResult.url ?? "");

  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  try {
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            const sentinelId = await ensureSentinelComplianceRecord(tx, {
              instanceId: ctx.instanceId,
              contentType: "MedicalConditionPage",
              contentRef: slugAttempt,
              userId: ctx.userId,
            });
            const insertedRows = await tx<{ id: string }[]>`
              INSERT INTO medical_condition_page (
                instance_id, slug, title, summary, body_markdown, risk_level,
                compliance_record_id, hero_image_url, primary_treatment_id,
                status, published_at
              ) VALUES (
                ${ctx.instanceId}::uuid, ${slugAttempt}, ${parsed.data.title}, ${parsed.data.summary}, ${parsed.data.bodyMarkdown},
                ${parsed.data.riskLevel ?? null}::risk_level,
                ${sentinelId}::uuid,
                ${parsed.data.heroImageUrl ?? null},
                ${parsed.data.primaryTreatmentId ?? null}::uuid,
                'published'::content_publication_status, NOW()
              )
              RETURNING id
            `;
            const conditionId = insertedRows[0]!.id;
            // EVIDENCE_LINKING_PLAN Phase A — Conditions 합류 (Phase D · 2026-05-26)
            await processEvidenceLinks(tx, {
              instanceId: ctx.instanceId,
              sourceType: "MedicalConditionPage",
              sourceId: conditionId,
              formData,
            });
            return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const };
          }),
        )
      : await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
          assertActionEligibility(ctx, "operator-edit-content");
          const before = await tx<{ id: string }[]>`
            SELECT id FROM medical_condition_page
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (before.length === 0) return { ok: false as const, action: "notfound" as const };
          const sentinelId = await ensureSentinelComplianceRecord(tx, {
            instanceId: ctx.instanceId,
            contentType: "MedicalConditionPage",
            contentRef: parsed.data.slug,
            userId: ctx.userId,
          });
          await tx`
            UPDATE medical_condition_page
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   summary = ${parsed.data.summary},
                   body_markdown = ${parsed.data.bodyMarkdown},
                   risk_level = ${parsed.data.riskLevel ?? null}::risk_level,
                   hero_image_url = ${parsed.data.heroImageUrl ?? null},
                   primary_treatment_id = ${parsed.data.primaryTreatmentId ?? null}::uuid,
                   compliance_record_id = ${sentinelId}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          await processEvidenceLinks(tx, {
            instanceId: ctx.instanceId,
            sourceType: "MedicalConditionPage",
            sourceId: before[0]!.id,
            formData,
          });
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
        });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          payload: { contentType: "MedicalConditionPage", slug: txResult.slug, mode: txResult.mode, status: "published", originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveCondition] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/conditions`);
      revalidatePath(`/admin/${instanceSlug}/conditions/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/conditions/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      revalidatePath(`/${instanceSlug}`);
      revalidatePath(`/${instanceSlug}/conditions`);
      revalidatePath(`/${instanceSlug}/conditions/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/${instanceSlug}/conditions/${originalSlug}`);
      }
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/conditions/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof EvidenceLinkValidationError) {
      return { ok: false, fieldErrors: { evidenceLinks: [err.message] } };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: a.message };
      if (a.kind === "info") return { ok: false, fieldErrors: {}, formError: a.message };
    }
    console.error("[saveCondition] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteCondition(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const r = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const target = await tx<{ id: string }[]>`
        SELECT id FROM medical_condition_page WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug} LIMIT 1
      `;
      if (target.length === 0) return { kind: "notfound" as const };
      const conditionId = target[0]!.id;
      // EVIDENCE_LINKING_PLAN Phase A cleanup — content_entity_link + keyword_content_link orphan 정리.
      await cleanupLinksForEntityDelete(tx, ctx.instanceId, "MedicalConditionPage", conditionId);
      await cleanupKeywordLinksForEntityDelete(tx, ctx.instanceId, "MedicalConditionPage", conditionId);
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM medical_condition_page WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug} RETURNING id
      `;
      return { kind: "deleted" as const, deleted: deleted.length };
    });
    if (r.kind === "notfound" || r.deleted === 0) {
      return { ok: false, formError: "해당 증상 페이지가 이미 삭제되었습니다." };
    }
    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "MedicalConditionPage", slug },
      });
    } catch (auditErr) {
      console.error("[deleteCondition] audit emit failed", auditErr);
    }
    revalidatePath(`/admin/${instanceSlug}/conditions`);
    revalidatePath(`/admin/${instanceSlug}/conditions/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    revalidatePath(`/${instanceSlug}`);
    revalidatePath(`/${instanceSlug}/conditions`);
    revalidatePath(`/${instanceSlug}/conditions/${slug}`);
    redirect(`/admin/${instanceSlug}/conditions`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden") return { ok: false, formError: a.message };
      if (a.kind === "info") return { ok: false, formError: a.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "form") return { ok: false, formError: mapped.message };
      const firstField = Object.keys(mapped.errors)[0];
      const firstMsg = firstField ? mapped.errors[firstField]?.[0] : undefined;
      return { ok: false, formError: firstMsg ?? "참조 무결성 오류로 삭제할 수 없습니다." };
    }
    console.error("[deleteCondition] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
