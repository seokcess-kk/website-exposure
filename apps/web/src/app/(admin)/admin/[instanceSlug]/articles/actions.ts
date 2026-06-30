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
import { withSlugRetry } from "@/lib/slug-retry";
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";
import { resolveAdminImageInput } from "@/lib/admin/upload-image";
import {
  cleanupLinksForEntityDelete,
  EvidenceLinkValidationError,
  processEvidenceLinks,
} from "@/lib/admin/content-entity-link";
import { cleanupKeywordLinksForEntityDelete } from "@/lib/admin/keyword-content-link";
import { computeReadinessForEntity } from "@/lib/seo-readiness";
import type { SaveResult } from "@/lib/save-result";

const PUBLICATION_STATUSES = [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
] as const;
const RISK_LEVELS = ["Low", "Medium", "High"] as const;

const InputSchema = z.object({
  contentSource: z.enum(["internal", "external"]).default("internal"),
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
    .string()
    .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
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
    .refine((v) => v === null || v === undefined || (/^(https?:\/\/|\/uploads\/)/.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https 또는 첨부 이미지 경로 · 2048자",
    }),
  externalUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "외부 기사 URL 은 http/https · 2048자",
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
  // EAT_CONTENT v1.0 (EC-SCHEMA-05): C-04 Article.category required.
  //   form 은 selected category UUID. action 안 비어 있으면 instance 의 default `general` 으로 fallback.
  categoryId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: "카테고리 UUID 형식 오류",
    }),
}).superRefine((v, ctx) => {
  if (v.contentSource === "internal" && v.bodyMarkdown.trim().length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bodyMarkdown"], message: "직접 작성은 본문이 필요합니다." });
  }
  if (v.contentSource === "external" && !v.externalUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["externalUrl"], message: "외부 기사 URL을 입력해주세요." });
  }
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
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (_tx, ctx) => {
    assertActionEligibility(ctx, "operator-edit-content");
  });
  const image = await resolveAdminImageInput({
    formData,
    instanceSlug,
    modeField: "heroImageMode",
    urlField: "heroImageUrl",
    fileField: "heroImageFile",
    uploadKind: "article",
  });
  if (!image.ok) return { ok: false, fieldErrors: { [image.field]: [image.message] } };
  const raw = Object.fromEntries(formData);
  raw.heroImageUrl = image.url ?? "";
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  try {
    const bodyMarkdownForSave = parsed.data.contentSource === "external" && parsed.data.bodyMarkdown.trim() === ""
      ? parsed.data.summary
      : parsed.data.bodyMarkdown;
    const externalUrlForSave: string | null = parsed.data.contentSource === "external" ? parsed.data.externalUrl ?? null : null;
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");

            // category resolve (INSERT 안 — currentCategoryId 없음)
            let resolvedCategoryId: string;
            if (parsed.data.categoryId) {
              const categoryRows = await tx<{ id: string }[]>`
                SELECT id FROM article_category
                 WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
                 LIMIT 1
              `;
              if (categoryRows.length === 0) return { ok: false as const, action: "category-not-found" as const };
              resolvedCategoryId = categoryRows[0]!.id;
            } else {
              const defaultCategoryRows = await tx<{ id: string }[]>`
                SELECT id FROM article_category
                 WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
                 LIMIT 1
              `;
              if (defaultCategoryRows.length === 0) return { ok: false as const, action: "default-category-missing" as const };
              resolvedCategoryId = defaultCategoryRows[0]!.id;
            }

            // INSERT 안 author = 신규 저자 — active 체크
            if (parsed.data.authorDoctorId) {
              const doctorRows = await tx<{ id: string; active: boolean }[]>`
                SELECT id, active FROM doctor_profile
                 WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
                 LIMIT 1
              `;
              if (doctorRows.length === 0) return { ok: false as const, action: "author-not-found" as const };
              if (!doctorRows[0]!.active) return { ok: false as const, action: "author-inactive" as const };
            }

            // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel ComplianceRecord 보장 후 published 로 INSERT.
            const sentinelId = await ensureSentinelComplianceRecord(tx, {
              instanceId: ctx.instanceId,
              contentType: "Article",
              contentRef: slugAttempt,
              userId: ctx.userId,
            });
            const insertedRows = await tx<{ id: string }[]>`
              INSERT INTO article (
                instance_id, slug, title, summary, body_markdown, status, risk_level,
                hero_image_url, author_doctor_id, category_id,
                compliance_record_id, published_at, external_url
              ) VALUES (
                ${ctx.instanceId}::uuid,
                ${slugAttempt},
                ${parsed.data.title},
                ${parsed.data.summary},
                ${bodyMarkdownForSave},
                'published'::content_publication_status,
                'Low'::risk_level,
                ${parsed.data.heroImageUrl ?? null},
                ${parsed.data.authorDoctorId ?? null}::uuid,
                ${resolvedCategoryId}::uuid,
                ${sentinelId}::uuid,
                NOW(),
                ${externalUrlForSave}
              )
              RETURNING id
            `;
            const articleId = insertedRows[0]!.id;
            // EVIDENCE_LINKING_PLAN Phase A — link diff + same-tenant 검증 + readiness 재계산
            await processEvidenceLinks(tx, {
              instanceId: ctx.instanceId,
              sourceType: "Article",
              sourceId: articleId,
              formData,
            });
            await computeReadinessForEntity(tx, ctx.instanceId, "Article", articleId);
            return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "published" };
          }),
        )
      : await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
          assertActionEligibility(ctx, "operator-edit-content");

          const beforeRows = await tx<{ id: string; status: string; author_doctor_id: string | null; category_id: string }[]>`
            SELECT id, status::text AS status, author_doctor_id, category_id FROM article
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          const currentAuthorId = beforeRows[0]!.author_doctor_id;
          const currentCategoryId = beforeRows[0]!.category_id;
          const beforeStatus = beforeRows[0]!.status;

          // category resolve — form 우선 → current → default
          let resolvedCategoryId: string;
          if (parsed.data.categoryId) {
            const categoryRows = await tx<{ id: string }[]>`
              SELECT id FROM article_category
               WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
               LIMIT 1
            `;
            if (categoryRows.length === 0) return { ok: false as const, action: "category-not-found" as const };
            resolvedCategoryId = categoryRows[0]!.id;
          } else {
            resolvedCategoryId = currentCategoryId;
          }

          // author 검증 (UPDATE 안 currentAuthorId 와 동일하면 active 무관)
          if (parsed.data.authorDoctorId) {
            const doctorRows = await tx<{ id: string; active: boolean }[]>`
              SELECT id, active FROM doctor_profile
               WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
               LIMIT 1
            `;
            if (doctorRows.length === 0) return { ok: false as const, action: "author-not-found" as const };
            const d = doctorRows[0]!;
            if (!d.active && d.id !== currentAuthorId) return { ok: false as const, action: "author-inactive" as const };
          }

          // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel ComplianceRecord 보장 후 published 로 UPDATE.
          const sentinelId = await ensureSentinelComplianceRecord(tx, {
            instanceId: ctx.instanceId,
            contentType: "Article",
            contentRef: parsed.data.slug,
            userId: ctx.userId,
          });
          await tx`
            UPDATE article
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   summary = ${parsed.data.summary},
                   body_markdown = ${bodyMarkdownForSave},
                   status = 'published'::content_publication_status,
                   published_at = COALESCE(published_at, NOW()),
                   risk_level = 'Low'::risk_level,
                   hero_image_url = ${parsed.data.heroImageUrl ?? null},
                   external_url = ${externalUrlForSave},
                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                   category_id = ${resolvedCategoryId}::uuid,
                   compliance_record_id = ${sentinelId}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          // EVIDENCE_LINKING_PLAN Phase A — link diff + same-tenant 검증 + readiness 재계산
          const articleId = beforeRows[0]!.id;
          await processEvidenceLinks(tx, {
            instanceId: ctx.instanceId,
            sourceType: "Article",
            sourceId: articleId,
            formData,
          });
          await computeReadinessForEntity(tx, ctx.instanceId, "Article", articleId);
          // unused-vars: beforeStatus 는 audit 용 — currentStatus 안 새 값 ('published') 반환
          void beforeStatus;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: "published" };
        });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
      if (txResult.action === "author-not-found") {
        return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
      }
      if (txResult.action === "author-inactive") {
        return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
      }
      if (txResult.action === "default-category-missing") {
        return { ok: false, fieldErrors: {}, formError: "기본 카테고리가 없습니다. 관리자에게 문의하세요 (EC-SCHEMA-03)." };
      }
      if (txResult.action === "category-not-found") {
        return { ok: false, fieldErrors: { categoryId: ["해당 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택하세요."] } };
      }
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveArticle] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/articles`);
      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
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
      // EVIDENCE_LINKING_PLAN Phase A — 삭제 전 entity_id 회수 (orphan cleanup 용)
      const targetRows = await tx<{ id: string }[]>`
        SELECT id FROM article
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         LIMIT 1
      `;
      if (targetRows.length === 0) return { deleted: 0 };
      const articleId = targetRows[0]!.id;

      // (1) link orphan cleanup (source + target 양방향, affected source 회수)
      const { affectedSources } = await cleanupLinksForEntityDelete(tx, ctx.instanceId, "Article", articleId);
      // (1.5) SEO_KEYWORD_STRATEGY_PLAN Phase 2 — keyword_content_link orphan cleanup
      await cleanupKeywordLinksForEntityDelete(tx, ctx.instanceId, "Article", articleId);

      // (2) article row + readiness snapshot 본체 삭제
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM article
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${articleId}::uuid
         RETURNING id
      `;
      await tx`
        DELETE FROM seo_readiness_snapshot
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND entity_type = 'Article'
           AND entity_id = ${articleId}::uuid
      `;

      // (3) 영향 받은 source readiness 재계산 (자신 외 다른 source 만 — 자신은 이미 삭제됨)
      for (const src of affectedSources) {
        if (src.sourceId === articleId) continue;
        await computeReadinessForEntity(tx, ctx.instanceId, src.sourceType, src.sourceId);
      }
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

    revalidatePath(`/admin/${instanceSlug}/articles`);
    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/articles`);
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

// === CONTENT_BULK — 다발 발행 엔진 (어드민 bulk) ===
// saveBulkDraftArticle: AI Full Draft 결과를 status='draft' 로 저장 (sentinel 불필요 — published 아님).
// publishDraftArticleAction: draft → published 1클릭 발행 (sentinel + published_at + readiness).

const BULK_KW_SLUG_RE = /^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$/;

function toKeywordSlug(label: string): string | null {
  const s = label.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9가-힣-]/g, "").slice(0, 64);
  return BULK_KW_SLUG_RE.test(s) ? s : null;
}

export type BulkDraftInput = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  keywordLabel?: string | null;
  regionScope?: string | null;
  intent?: string | null;
};

export type BulkDraftResult = { ok: true; slug: string } | { ok: false; error: string };

/** AI Full Draft 결과를 draft 아티클로 저장 (어드민 bulk 생성용). */
export async function saveBulkDraftArticle(
  instanceSlug: string,
  draft: BulkDraftInput,
): Promise<BulkDraftResult> {
  if (!/^[a-z0-9][a-z0-9-]{2,99}$/.test(draft.slug)) return { ok: false, error: "slug 형식 오류" };
  if (draft.title.trim().length < 1 || draft.title.trim().length > 200) return { ok: false, error: "제목 길이 오류" };
  if (draft.summary.length < 80 || draft.summary.length > 200) return { ok: false, error: `요약 ${draft.summary.length}자 (80~200)` };
  if (draft.bodyMarkdown.trim().length === 0) return { ok: false, error: "본문 비어있음" };

  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, error: "권한 확인 실패" };
  }

  try {
    const finalSlug = await withSlugRetry(draft.slug, (slugAttempt) =>
      withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        const catRows = await tx<{ id: string }[]>`
          SELECT id FROM article_category WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general' LIMIT 1
        `;
        if (catRows.length === 0) throw new Error("default-category-missing");

        // status='draft' INSERT — published 아니므로 sentinel/compliance 불필요.
        const insRows = await tx<{ id: string }[]>`
          INSERT INTO article (
            instance_id, slug, title, summary, body_markdown, status, risk_level, category_id
          ) VALUES (
            ${ctx.instanceId}::uuid, ${slugAttempt}, ${draft.title.trim()}, ${draft.summary}, ${draft.bodyMarkdown},
            'draft'::content_publication_status, 'Low'::risk_level, ${catRows[0]!.id}::uuid
          )
          RETURNING id
        `;
        const articleId = insRows[0]!.id;

        // 키워드 등록 + primary 매핑 (선택)
        const kwLabel = (draft.keywordLabel ?? "").trim();
        const kwSlug = kwLabel ? toKeywordSlug(kwLabel) : null;
        if (kwLabel && kwSlug && kwLabel.length <= 100) {
          const intent = ["informational", "comparison", "pre-booking", "local"].includes(draft.intent ?? "")
            ? (draft.intent as string)
            : "informational";
          const kwRows = await tx<{ id: string }[]>`
            INSERT INTO keyword_target (instance_id, slug, label, keyword_type, intent, priority, region_scope, status)
            VALUES (${ctx.instanceId}::uuid, ${kwSlug}, ${kwLabel}, 'primary', ${intent}, 'P1', ${draft.regionScope ?? null}, 'active')
            ON CONFLICT (instance_id, slug) DO UPDATE SET label = EXCLUDED.label, intent = EXCLUDED.intent, region_scope = EXCLUDED.region_scope, status = 'active', updated_at = now()
            RETURNING id
          `;
          await tx`
            INSERT INTO keyword_content_link (instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary)
            VALUES (${ctx.instanceId}::uuid, ${kwRows[0]!.id}::uuid, 'Article', ${articleId}::uuid, 80, true)
            ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET is_primary = true, relevance_score = 80, updated_at = now()
          `;
        }
        return slugAttempt;
      }),
    );
    revalidatePath(`/admin/${instanceSlug}/articles`);
    return { ok: true, slug: finalSlug };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof Error && err.message === "default-category-missing") return { ok: false, error: "general 카테고리 없음" };
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, error: mapped.message };
    console.error("[saveBulkDraftArticle] unexpected", err);
    return { ok: false, error: "저장 중 오류" };
  }
}

/** draft 아티클을 1클릭 발행 (어드민 목록의 "발행" 버튼). */
export async function publishDraftArticleAction(
  instanceSlug: string,
  slug: string,
): Promise<void> {
  const aCtx = await resolveActionContext(instanceSlug);
  try {
    await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const rows = await tx<{ id: string }[]>`
        SELECT id FROM article
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug} AND status = 'draft'
         LIMIT 1
      `;
      if (rows.length === 0) return; // 이미 발행됐거나 없음 — no-op
      const articleId = rows[0]!.id;
      const sentinelId = await ensureSentinelComplianceRecord(tx, {
        instanceId: ctx.instanceId, contentType: "Article", contentRef: slug, userId: ctx.userId,
      });
      await tx`
        UPDATE article
           SET status = 'published'::content_publication_status,
               published_at = COALESCE(published_at, NOW()),
               compliance_record_id = ${sentinelId}::uuid,
               updated_at = now()
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${articleId}::uuid
      `;
      await computeReadinessForEntity(tx, ctx.instanceId, "Article", articleId);
    });
    revalidatePath(`/admin/${instanceSlug}/articles`);
    revalidatePath(`/admin/${instanceSlug}`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    console.error("[publishDraftArticleAction] unexpected", err);
    throw err;
  }
}
