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
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";
import { resolveAdminImageInput } from "@/lib/admin/upload-image";
import {
  cleanupLinksForEntityDelete,
  EvidenceLinkValidationError,
  processEvidenceLinks,
} from "@/lib/admin/content-entity-link";
import { computeReadinessForEntity } from "@/lib/seo-readiness";
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
    .refine((v) => v === null || v === undefined || (/^(https?:\/\/|\/uploads\/)/.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https 또는 첨부 이미지 경로 · 2048자",
    }),
  // Phase 3 C 하이브리드: pillar_slug 컬럼 + metadata.principles JSON override
  pillarSlug: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^[a-z0-9][a-z0-9-]{2,63}$/.test(v), {
      message: "Pillar slug 는 3~64자 (소문자/숫자/하이픈)",
    }),
  principlesJson: z
    .string()
    .transform((v) => v.trim())
    .optional()
    .default(""),
});

/** principles JSON 파싱 — 형식 위반 시 null 반환 + 별도 fieldError */
function parsePrinciplesJson(raw: string): { ok: true; value: unknown[] | null } | { ok: false; message: string } {
  if (raw === "") return { ok: true, value: null };
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return { ok: false, message: "JSON 형식 오류" }; }
  if (!Array.isArray(parsed)) return { ok: false, message: "principles 는 배열이어야 합니다." };
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) return { ok: false, message: "각 항목은 객체 {n,icon,title,desc}" };
    const o = item as Record<string, unknown>;
    if (typeof o.n !== "string" || typeof o.icon !== "string" || typeof o.title !== "string" || typeof o.desc !== "string") {
      return { ok: false, message: "각 항목에 n/icon/title/desc 문자열 필드 필요" };
    }
  }
  return { ok: true, value: parsed };
}

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveTreatmentPage(
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
    uploadKind: "treatment",
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

  // principles JSON 별도 파싱 (zod 안 raw string 만 검증)
  const principlesParsed = parsePrinciplesJson(parsed.data.principlesJson ?? "");
  if (principlesParsed.ok === false) {
    return { ok: false, fieldErrors: { principlesJson: [principlesParsed.message] } };
  }
  const principlesValue = principlesParsed.value;
  const pillarSlugValue = parsed.data.pillarSlug ?? null;

  try {
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
            const sentinelId = await ensureSentinelComplianceRecord(tx, {
              instanceId: ctx.instanceId,
              contentType: "TreatmentPage",
              contentRef: slugAttempt,
              userId: ctx.userId,
            });
            const insertedRows = await tx<{ id: string }[]>`
              INSERT INTO treatment_page (
                instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url,
                pillar_slug, metadata, compliance_record_id, published_at
              ) VALUES (
                ${ctx.instanceId}::uuid,
                ${slugAttempt},
                ${parsed.data.title},
                ${parsed.data.summary},
                ${parsed.data.bodyMarkdown},
                'published'::content_publication_status,
                'Low'::risk_level,
                ${parsed.data.heroImageUrl ?? null},
                ${pillarSlugValue},
                ${principlesValue === null ? '{}' : JSON.stringify({ principles: principlesValue })}::jsonb,
                ${sentinelId}::uuid,
                NOW()
              )
              RETURNING id
            `;
            const treatmentId = insertedRows[0]!.id;
            // EVIDENCE_LINKING_PLAN Phase A
            await processEvidenceLinks(tx, {
              instanceId: ctx.instanceId,
              sourceType: "TreatmentPage",
              sourceId: treatmentId,
              formData,
            });
            await computeReadinessForEntity(tx, ctx.instanceId, "TreatmentPage", treatmentId);
            return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const, currentStatus: "published" };
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
          // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published.
          const sentinelId = await ensureSentinelComplianceRecord(tx, {
            instanceId: ctx.instanceId,
            contentType: "TreatmentPage",
            contentRef: parsed.data.slug,
            userId: ctx.userId,
          });
          await tx`
            UPDATE treatment_page
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   summary = ${parsed.data.summary},
                   body_markdown = ${parsed.data.bodyMarkdown},
                   status = 'published'::content_publication_status,
                   published_at = COALESCE(published_at, NOW()),
                   risk_level = 'Low'::risk_level,
                   hero_image_url = ${parsed.data.heroImageUrl ?? null},
                   pillar_slug = ${pillarSlugValue},
                   metadata = CASE
                     WHEN ${principlesValue === null}::boolean THEN metadata - 'principles'
                     ELSE jsonb_set(COALESCE(metadata, '{}'::jsonb), '{principles}', ${JSON.stringify(principlesValue ?? [])}::jsonb)
                   END,
                   compliance_record_id = ${sentinelId}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          // EVIDENCE_LINKING_PLAN Phase A
          const treatmentId = beforeRows[0]!.id;
          await processEvidenceLinks(tx, {
            instanceId: ctx.instanceId,
            sourceType: "TreatmentPage",
            sourceId: treatmentId,
            formData,
          });
          await computeReadinessForEntity(tx, ctx.instanceId, "TreatmentPage", treatmentId);
          void beforeStatus;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: "published" };
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
      // EVIDENCE_LINKING_PLAN Phase A — orphan cleanup
      const targetRows = await tx<{ id: string }[]>`
        SELECT id FROM treatment_page
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         LIMIT 1
      `;
      if (targetRows.length === 0) return { deleted: 0 };
      const treatmentId = targetRows[0]!.id;
      const { affectedSources } = await cleanupLinksForEntityDelete(tx, ctx.instanceId, "TreatmentPage", treatmentId);

      const deleted = await tx<{ id: string }[]>`
        DELETE FROM treatment_page
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${treatmentId}::uuid
         RETURNING id
      `;
      await tx`
        DELETE FROM seo_readiness_snapshot
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND entity_type = 'TreatmentPage'
           AND entity_id = ${treatmentId}::uuid
      `;
      for (const src of affectedSources) {
        if (src.sourceId === treatmentId) continue;
        await computeReadinessForEntity(tx, ctx.instanceId, src.sourceType, src.sourceId);
      }
      return { deleted: deleted.length };
    });

    if (result.deleted === 0) {
      return { ok: false, formError: "해당 시술/진료 페이지가 이미 삭제되었습니다." };
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
