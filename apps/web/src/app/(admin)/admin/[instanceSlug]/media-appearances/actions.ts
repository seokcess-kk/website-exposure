// @glitzy/web/(admin)/[instanceSlug]/media-appearances/actions — EAT_CONTENT_PLAN v1.0

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
import { MediaAppearanceInputSchema } from "@/lib/eat-content-schema";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveMediaAppearance(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = MediaAppearanceInputSchema.safeParse(Object.fromEntries(formData));
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
  const durationSeconds = parsed.data.durationSeconds ? Number(parsed.data.durationSeconds) : null;

  try {
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx(
            { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
            async (tx, ctx) => {
              assertActionEligibility(ctx, "operator-edit-content");
              await tx`
                INSERT INTO media_appearance (
                  instance_id, slug, title, channel_name, channel_type, published_date,
                  duration_seconds, url, thumbnail_url, summary,
                  author_doctor_id, status
                ) VALUES (
                  ${ctx.instanceId}::uuid,
                  ${slugAttempt},
                  ${parsed.data.title},
                  ${parsed.data.channelName},
                  ${parsed.data.channelType}::media_channel_type,
                  ${parsed.data.publishedDate}::date,
                  ${durationSeconds},
                  ${parsed.data.url},
                  ${parsed.data.thumbnailUrl ?? null},
                  ${parsed.data.summary},
                  ${parsed.data.authorDoctorId ?? null}::uuid,
                  'draft'::content_publication_status
                )
              `;
              return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "draft" };
            },
          ),
        )
      : await withSkeletonTx(
          { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
          async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            const beforeRows = await tx<{ id: string; status: string }[]>`
              SELECT id, status::text AS status FROM media_appearance
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
               FOR UPDATE
            `;
            if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
            const beforeStatus = beforeRows[0]!.status;

            // CAM-18 정정: status workflow action 통해서만 전이.
            await tx`
              UPDATE media_appearance
                 SET slug = ${parsed.data.slug},
                     title = ${parsed.data.title},
                     channel_name = ${parsed.data.channelName},
                     channel_type = ${parsed.data.channelType}::media_channel_type,
                     published_date = ${parsed.data.publishedDate}::date,
                     duration_seconds = ${durationSeconds},
                     url = ${parsed.data.url},
                     thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
                     summary = ${parsed.data.summary},
                     author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                     updated_at = now()
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
            `;
            return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
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
          payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveMediaAppearance] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/media-appearances`);
      revalidatePath(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/media-appearances/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
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
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveMediaAppearance] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteMediaAppearance(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM media_appearance
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 media appearance 가 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "MediaAppearance", slug },
      });
    } catch (err) {
      console.error("[deleteMediaAppearance] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/media-appearances`);
    revalidatePath(`/admin/${instanceSlug}/media-appearances/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/media-appearances`);
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
    console.error("[deleteMediaAppearance] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
