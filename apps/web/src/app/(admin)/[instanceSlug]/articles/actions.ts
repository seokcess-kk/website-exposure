// @glitzy/web/(admin)/[instanceSlug]/articles/actions
// cycle1-3entity patch: WEB-01·04·06·08·10·15

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
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
      message: "slug 는 3~100자 (소문자/숫자/하이픈)",
    }),
  title: z
    .string({ required_error: "제목은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
  summary: z
    .string({ required_error: "요약은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 80 && v.length <= 200, { message: "요약은 80~200자" }),
  bodyMarkdown: z
    .string({ required_error: "본문은 필수입니다." })
    .min(1, "본문은 1자 이상")
    .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
  // cycle5-3entity WEB-53: enum value mismatch 한국어 메시지
  status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
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
  authorDoctorId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: "저자 UUID 형식 오류",
    }),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveArticle(
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
    const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      const isPublished = parsed.data.status === "published";

      // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
      let currentAuthorId: string | null = null;
      let beforePublishedAt: Date | null = null;
      if (originalSlug !== null) {
        const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null }[]>`
          SELECT id, published_at, author_doctor_id FROM article
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
           FOR UPDATE
        `;
        if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
        currentAuthorId = beforeRows[0]!.author_doctor_id;
        beforePublishedAt = beforeRows[0]!.published_at;
      }

      // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
      if (parsed.data.authorDoctorId) {
        const doctorRows = await tx<{ id: string; active: boolean }[]>`
          SELECT id, active FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
           LIMIT 1
        `;
        if (doctorRows.length === 0) {
          return { ok: false as const, action: "author-not-found" as const };
        }
        const d = doctorRows[0]!;
        if (!d.active && d.id !== currentAuthorId) {
          return { ok: false as const, action: "author-inactive" as const };
        }
      }

      if (originalSlug !== null) {
        const newPublishedAt = isPublished ? (beforePublishedAt ?? new Date()) : null;
        await tx`
          UPDATE article
             SET slug = ${parsed.data.slug},
                 title = ${parsed.data.title},
                 summary = ${parsed.data.summary},
                 body_markdown = ${parsed.data.bodyMarkdown},
                 status = ${parsed.data.status}::content_publication_status,
                 risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
                 hero_image_url = ${parsed.data.heroImageUrl ?? null},
                 author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                 published_at = ${newPublishedAt},
                 updated_at = now()
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
      }

      await tx`
        INSERT INTO article (
          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, published_at
        ) VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.slug},
          ${parsed.data.title},
          ${parsed.data.summary},
          ${parsed.data.bodyMarkdown},
          ${parsed.data.status}::content_publication_status,
          ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
          ${parsed.data.heroImageUrl ?? null},
          ${parsed.data.authorDoctorId ?? null}::uuid,
          ${isPublished ? new Date() : null}
        )
      `;
      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
    });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
      if (txResult.action === "author-not-found") {
        return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
      }
      if (txResult.action === "author-inactive") {
        return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
      }
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveArticle] audit emit failed", auditErr);
      }
      revalidatePath(`/${instanceSlug}/articles`);
      revalidatePath(`/${instanceSlug}/articles/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/${instanceSlug}/articles/${originalSlug}`);
      }
      revalidatePath(`/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/${instanceSlug}/articles/${txResult.slug}`);
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
      // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveArticle] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM article
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         RETURNING id
      `;
      return { deleted: deleted.length };
    });

    if (result.deleted === 0) {
      return { ok: false, formError: "해당 아티클이 이미 삭제되었습니다." };
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "Article", slug },
      });
    } catch (err) {
      console.error("[deleteArticle] audit emit failed", err);
    }

    revalidatePath(`/${instanceSlug}/articles`);
    revalidatePath(`/${instanceSlug}/articles/${slug}`);
    revalidatePath(`/${instanceSlug}`);
    redirect(`/${instanceSlug}/articles`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      // cycle5-3entity WEB-52: info branch 처리 (delete path)
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteArticle] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
