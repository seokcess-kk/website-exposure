// @glitzy/web/(admin)/[instanceSlug]/categories/actions — EAT_CONTENT_PLAN v1.0 § 4.4 EC-FORM-04

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
import { ArticleCategoryInputSchema } from "@/lib/eat-content-schema";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveCategory(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = ArticleCategoryInputSchema.safeParse(Object.fromEntries(formData));
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
              await tx`
                INSERT INTO article_category (instance_id, slug, name, description, display_order)
                VALUES (
                  ${ctx.instanceId}::uuid,
                  ${slugAttempt},
                  ${parsed.data.name},
                  ${parsed.data.description ?? null},
                  ${Number(parsed.data.displayOrder)}
                )
              `;
              return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const };
            },
          ),
        )
      : await withSkeletonTx(
          { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
          async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");

            const beforeRows = await tx<{ id: string }[]>`
              SELECT id FROM article_category
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
               FOR UPDATE
            `;
            if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };

            // cycle 1 ECC-02 patch: `general` 기본 카테고리 보호 — slug 변경 차단.
            if (originalSlug === "general" && parsed.data.slug !== "general") {
              return { ok: false as const, action: "default-rename-forbidden" as const };
            }

            await tx`
              UPDATE article_category
                 SET slug = ${parsed.data.slug},
                     name = ${parsed.data.name},
                     description = ${parsed.data.description ?? null},
                     display_order = ${Number(parsed.data.displayOrder)},
                     updated_at = now()
               WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
            `;
            return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
          },
        );

    if (txResult.ok === false && txResult.action === "notfound") notFound();
    if (txResult.ok === false && txResult.action === "default-rename-forbidden") {
      return { ok: false, fieldErrors: { slug: ["기본 카테고리(general) 는 slug 를 변경할 수 없습니다."] } };
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          payload: { contentType: "ArticleCategory", slug: txResult.slug, mode: txResult.mode, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveCategory] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/categories`);
      revalidatePath(`/admin/${instanceSlug}/categories/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/categories/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/categories/${txResult.slug}`);
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
    console.error("[saveCategory] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteCategory(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        // default `general` 카테고리는 삭제 차단 — Article.category_id NOT NULL FK 무결성.
        // cycle 1 ECC-04 patch: 대상 row 를 FOR UPDATE 로 잠궈 ref-count 검사 ~ DELETE 사이 race 차단.
        //   FK 도 article_category(instance_id, id) lookup 단계에서 share lock 을 잡으므로 INSERT 가 본 row commit 전에는 진입 못 함.
        const targetRows = await tx<{ id: string; slug: string }[]>`
          SELECT id, slug FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           FOR UPDATE
        `;
        if (targetRows.length === 0) return { deleted: 0 };
        if (targetRows[0]!.slug === "general") {
          return { deleted: 0, action: "default-protected" as const };
        }
        const refCount = await tx<{ cnt: number }[]>`
          SELECT COUNT(*)::int AS cnt FROM article
           WHERE instance_id = ${ctx.instanceId}::uuid AND category_id = ${targetRows[0]!.id}::uuid
        `;
        if ((refCount[0]?.cnt ?? 0) > 0) {
          return { deleted: 0, action: "in-use" as const };
        }
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if ("action" in result && result.action === "default-protected") {
      return { ok: false, formError: "기본 카테고리(general)는 삭제할 수 없습니다." };
    }
    if ("action" in result && result.action === "in-use") {
      return { ok: false, formError: "해당 카테고리를 사용 중인 아티클이 있어 삭제할 수 없습니다." };
    }
    if (result.deleted === 0) {
      return { ok: false, formError: "해당 카테고리가 이미 삭제되었습니다." };
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "ArticleCategory", slug },
      });
    } catch (err) {
      console.error("[deleteCategory] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/categories`);
    revalidatePath(`/admin/${instanceSlug}/categories/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/categories`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      // cycle 1 ECC-04 patch: FK violation (article.article_category_fk) 은 race 시 발생.
      //   field mapping("categoryId") 도 form-level "사용 중" UX 로 변환.
      if (mapped.kind === "form") return { ok: false, formError: mapped.message };
      if (mapped.kind === "field" && mapped.errors.categoryId) {
        return { ok: false, formError: "해당 카테고리를 사용 중인 아티클이 있어 삭제할 수 없습니다." };
      }
      // 그 외 field mapping 은 unexpected — fall through 로 generic 처리.
    }
    console.error("[deleteCategory] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
