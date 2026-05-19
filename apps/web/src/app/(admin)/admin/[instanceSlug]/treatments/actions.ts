// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
// cycle1-3entity patch:
//   - WEB-01·04·06·08·10·15
//   - WEB-12 published_at 정책: unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade (Plan v1.0)

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
import type { SaveResult } from "@/lib/save-result";

const PUBLICATION_STATUSES = [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
] as const;
const RISK_LEVELS = ["Low", "Medium", "High"] as const;

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
      message: "slug 는 3~100자 (소문자/숫자/하이픈) 이어야 합니다.",
    }),
  title: z
    .string({ required_error: "제목은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
  summary: z
    .string({ required_error: "요약은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 50 && v.length <= 160, { message: "요약은 50~160자" }),
  bodyMarkdown: z
    .string({ required_error: "본문은 필수입니다." })
    .min(1, "본문은 1자 이상이어야 합니다.")
    .max(50_000, "본문은 50000자를 넘을 수 없습니다."),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이. form FormData 안 status 미포함.
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
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https · 2048자",
    }),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveTreatmentPage(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
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
          withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            await tx`
              INSERT INTO treatment_page (
                instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url
              ) VALUES (
                ${ctx.instanceId}::uuid,
                ${slugAttempt},
                ${parsed.data.title},
                ${parsed.data.summary},
                ${parsed.data.bodyMarkdown},
                'draft'::content_publication_status,
                ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
                ${parsed.data.heroImageUrl ?? null}
              )
            `;
            return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "draft" };
          }),
        )
      : await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
          assertActionEligibility(ctx, "operator-edit-content");
          const beforeRows = await tx<{ id: string; status: string }[]>`
            SELECT id, status::text AS status FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          const beforeStatus = beforeRows[0]!.status;
          await tx`
            UPDATE treatment_page
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   summary = ${parsed.data.summary},
                   body_markdown = ${parsed.data.bodyMarkdown},
                   risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
                   hero_image_url = ${parsed.data.heroImageUrl ?? null},
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
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
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "TreatmentPage", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveTreatmentPage] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/treatments`);
      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveTreatmentPage] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteTreatmentPage(
  instanceSlug: string,
  slug: string,
): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM treatment_page
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         RETURNING id
      `;
      return { deleted: deleted.length };
    });

    if (result.deleted === 0) {
      return { ok: false, formError: "해당 시술 페이지가 이미 삭제되었습니다." };
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "TreatmentPage", slug },
      });
    } catch (err) {
      console.error("[deleteTreatmentPage] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/treatments`);
    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/treatments`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteTreatmentPage] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
