// @glitzy/web/(admin)/[instanceSlug]/publications/actions — EAT_CONTENT_PLAN v1.0

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
import { PublicationInputSchema } from "@/lib/eat-content-schema";
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function savePublication(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = PublicationInputSchema.safeParse(Object.fromEntries(formData));
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
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry. UPDATE 안 충돌은 운영자 명시 변경이므로 retry 안 함.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx(
            { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
            async (tx, ctx) => {
              assertActionEligibility(ctx, "operator-edit-content");
              // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
              const sentinelId = await ensureSentinelComplianceRecord(tx, {
                instanceId: ctx.instanceId,
                contentType: "Publication",
                contentRef: slugAttempt,
                userId: ctx.userId,
              });
              await tx`
                INSERT INTO publication (
                  instance_id, slug, title, authors, journal, published_date,
                  doi, pubmed_id, url, thumbnail_url, summary,
                  author_doctor_id, status, risk_level, compliance_record_id, published_at
                ) VALUES (
                  ${ctx.instanceId}::uuid,
                  ${slugAttempt},
                  ${parsed.data.title},
                  ${tx.json(parsed.data.authors as unknown as never)},
                  ${parsed.data.journal ?? null},
                  ${parsed.data.publishedDate}::date,
                  ${parsed.data.doi ?? null},
                  ${parsed.data.pubmedId ?? null},
                  ${parsed.data.url},
                  ${parsed.data.thumbnailUrl ?? null},
                  ${parsed.data.summary},
                  ${parsed.data.authorDoctorId ?? null}::uuid,
                  'published'::content_publication_status,
                  'Low'::risk_level,
                  ${sentinelId}::uuid,
                  NOW()
                )
              `;
              return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "published" };
            },
          ),
        )
      : await withSkeletonTx(
          { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
          async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            const beforeRows = await tx<{ id: string; status: string }[]>`
              SELECT id, status::text AS status FROM publication
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
               FOR UPDATE
            `;
            if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
            const beforeStatus = beforeRows[0]!.status;

            // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
            const sentinelId = await ensureSentinelComplianceRecord(tx, {
              instanceId: ctx.instanceId,
              contentType: "Publication",
              contentRef: parsed.data.slug,
              userId: ctx.userId,
            });
            await tx`
              UPDATE publication
                 SET slug = ${parsed.data.slug},
                     title = ${parsed.data.title},
                     authors = ${tx.json(parsed.data.authors as unknown as never)},
                     journal = ${parsed.data.journal ?? null},
                     published_date = ${parsed.data.publishedDate}::date,
                     doi = ${parsed.data.doi ?? null},
                     pubmed_id = ${parsed.data.pubmedId ?? null},
                     url = ${parsed.data.url},
                     thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
                     summary = ${parsed.data.summary},
                     author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                     status = 'published'::content_publication_status,
                     published_at = COALESCE(published_at, NOW()),
                     risk_level = 'Low'::risk_level,
                     compliance_record_id = ${sentinelId}::uuid,
                     updated_at = now()
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
            `;
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
          payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[savePublication] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/publications`);
      revalidatePath(`/admin/${instanceSlug}/publications/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/publications/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/publications/${txResult.slug}`);
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
    console.error("[savePublication] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deletePublication(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM publication
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 publication 이 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "Publication", slug },
      });
    } catch (err) {
      console.error("[deletePublication] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/publications`);
    revalidatePath(`/admin/${instanceSlug}/publications/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/publications`);
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
    console.error("[deletePublication] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
