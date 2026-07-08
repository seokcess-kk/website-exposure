// @glitzy/web/(admin)/[instanceSlug]/keywords/actions — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 5
//
// saveKeywordTarget · deleteKeywordTarget — INSERT/UPDATE RETURNING id + link diff + parent 검증
// + delete 안 children 차단 + affected entity 선조회 + readiness 재계산.
// bulkCreateKeywordTargets — 줄 단위 라벨 붙여넣기 대량 등록 (slug 자동 파생 · 기존 slug 는 skip).

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
import type {
  KeywordIntent,
  KeywordPriority,
  KeywordStatus,
  KeywordType,
  SeoKeywordEntityType,
} from "@glitzy/core-content";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import {
  KeywordLinkValidationError,
  processKeywordLinks,
} from "@/lib/admin/keyword-content-link";
import {
  KEYWORD_BULK_MAX_LINES,
  parseKeywordBulkLines,
  type KeywordBulkInvalidLine,
} from "@/lib/admin/keyword-bulk";
import { computeReadinessForEntity } from "@/lib/seo-readiness";
import type { SaveResult } from "@/lib/save-result";

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$/.test(v), {
      message: "slug 는 3~64자 (한글/소문자/숫자/하이픈)",
    }),
  label: z
    .string({ required_error: "라벨은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 100, { message: "라벨은 1~100자" }),
  keywordType: z.enum(["primary", "secondary"]),
  parentId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  intent: z.enum(["informational", "comparison", "pre-booking", "local"]),
  priority: z.enum(["P0", "P1", "P2"]),
  difficulty: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^\d{1,3}$/.test(v), {
      message: "난이도는 0~100 정수",
    }),
  regionScope: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  status: z.enum(["active", "paused", "won", "dropped"]),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveKeywordTarget(
  instanceSlug: string,
  originalId: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (_tx, ctx) => {
    assertActionEligibility(ctx, "operator-edit-content");
  });
  const raw = Object.fromEntries(formData);
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  // primary 일 때 parentId 강제 NULL · secondary 일 때 parentId 필수
  const isSecondary = parsed.data.keywordType === "secondary";
  const parentId = isSecondary ? (parsed.data.parentId ?? null) : null;
  if (isSecondary && !parentId) {
    return {
      ok: false,
      fieldErrors: { parentId: ["보조 키워드는 대표 (primary) 키워드 를 부모로 지정해야 합니다."] },
    };
  }
  if (originalId && parentId === originalId) {
    return {
      ok: false,
      fieldErrors: { parentId: ["자기 자신을 부모로 지정할 수 없습니다."] },
    };
  }

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      // parent primary 검증 (cycle 1 #1)
      if (isSecondary && parentId) {
        const parentRows = await tx<{ keyword_type: string }[]>`
          SELECT keyword_type FROM keyword_target
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parentId}::uuid
           LIMIT 1
        `;
        if (parentRows.length === 0) {
          return { ok: false as const, action: "parent-not-found" as const };
        }
        if (parentRows[0]!.keyword_type !== "primary") {
          return { ok: false as const, action: "parent-not-primary" as const };
        }
      }

      // INSERT or UPDATE — RETURNING id
      let keywordId: string;
      if (originalId === null) {
        const rows = await tx<{ id: string }[]>`
          INSERT INTO keyword_target (
            instance_id, slug, label, keyword_type, parent_id,
            intent, priority, difficulty, region_scope, status
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${parsed.data.slug},
            ${parsed.data.label},
            ${parsed.data.keywordType}::text,
            ${parentId}::uuid,
            ${parsed.data.intent}::text,
            ${parsed.data.priority}::text,
            ${parsed.data.difficulty ? Number(parsed.data.difficulty) : null},
            ${parsed.data.regionScope ?? null},
            ${parsed.data.status}::text
          )
          RETURNING id
        `;
        keywordId = rows[0]!.id;
      } else {
        const rows = await tx<{ id: string }[]>`
          UPDATE keyword_target
             SET slug = ${parsed.data.slug},
                 label = ${parsed.data.label},
                 keyword_type = ${parsed.data.keywordType}::text,
                 parent_id = ${parentId}::uuid,
                 intent = ${parsed.data.intent}::text,
                 priority = ${parsed.data.priority}::text,
                 difficulty = ${parsed.data.difficulty ? Number(parsed.data.difficulty) : null},
                 region_scope = ${parsed.data.regionScope ?? null},
                 status = ${parsed.data.status}::text,
                 updated_at = NOW()
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${originalId}::uuid
           RETURNING id
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        keywordId = rows[0]!.id;
      }

      // link diff + same-tenant 검증 + apply
      const { affectedEntities } = await processKeywordLinks(tx, {
        instanceId: ctx.instanceId,
        keywordId,
        formData,
      });

      // 영향 받은 entity 의 readiness 재계산
      for (const e of affectedEntities) {
        await computeReadinessForEntity(tx, ctx.instanceId, e.entityType, e.entityId);
      }

      return { ok: true as const, ctx, keywordId };
    });

    if (result.ok === false) {
      if (result.action === "notfound") notFound();
      if (result.action === "parent-not-found") {
        return { ok: false, fieldErrors: { parentId: ["대표 키워드를 찾을 수 없습니다."] } };
      }
      if (result.action === "parent-not-primary") {
        return {
          ok: false,
          fieldErrors: {
            parentId: ["대표 (primary) 키워드만 부모로 지정 가능합니다. 보조 키워드 끼리의 계층은 v1 안 미지원."],
          },
        };
      }
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: { contentType: "KeywordTarget", keywordId: result.keywordId, mode: originalId === null ? "insert" : "update" },
        });
      } catch (err) {
        console.error("[saveKeywordTarget] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/keywords`);
      revalidatePath(`/admin/${instanceSlug}/keywords/${result.keywordId}`);
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalId === null) {
        redirect(`/admin/${instanceSlug}/keywords/${result.keywordId}`);
      }
      return { ok: true, slug: parsed.data.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof KeywordLinkValidationError) {
      return { ok: false, fieldErrors: {}, formError: `콘텐츠 매핑 오류: ${err.message}` };
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
    console.error("[saveKeywordTarget] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

const BulkInputSchema = z.object({
  lines: z.string({ required_error: "키워드 목록은 필수입니다." }),
  keywordType: z.enum(["primary", "secondary"]),
  parentId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  intent: z.enum(["informational", "comparison", "pre-booking", "local"]),
  priority: z.enum(["P0", "P1", "P2"]),
  status: z.enum(["active", "paused", "won", "dropped"]),
});

export type BulkKeywordResult =
  | {
      ok: true;
      inserted: number;
      /** 같은 slug 가 이미 DB 에 있어 건너뛴 라벨 */
      skippedExisting: string[];
      /** 입력 안 slug 중복으로 건너뛴 라벨 */
      duplicateInInput: string[];
      /** slug 파생 불가 등 형식 오류 줄 */
      invalid: KeywordBulkInvalidLine[];
    }
  | { ok: false; fieldErrors: Record<string, string[]>; formError?: string };

export async function bulkCreateKeywordTargets(
  instanceSlug: string,
  _prev: BulkKeywordResult | null,
  formData: FormData,
): Promise<BulkKeywordResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (_tx, ctx) => {
    assertActionEligibility(ctx, "operator-edit-content");
  });

  const parsed = BulkInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const isSecondary = parsed.data.keywordType === "secondary";
  const parentId = isSecondary ? (parsed.data.parentId ?? null) : null;
  if (isSecondary && !parentId) {
    return {
      ok: false,
      fieldErrors: { parentId: ["보조 키워드는 대표 (primary) 키워드 를 부모로 지정해야 합니다."] },
    };
  }

  const { entries, invalid, duplicateInInput } = parseKeywordBulkLines(parsed.data.lines);
  if (entries.length === 0) {
    return {
      ok: false,
      fieldErrors: {
        lines: [
          invalid.length > 0
            ? "등록 가능한 줄이 없습니다. 각 줄이 한글/영소문자/숫자 2자 이상인지 확인하세요."
            : "한 줄에 하나씩 키워드를 입력하세요.",
        ],
      },
    };
  }
  if (entries.length > KEYWORD_BULK_MAX_LINES) {
    return {
      ok: false,
      fieldErrors: { lines: [`한 번에 최대 ${KEYWORD_BULK_MAX_LINES}개까지 등록 가능합니다. (현재 ${entries.length}개)`] },
    };
  }

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      if (isSecondary && parentId) {
        const parentRows = await tx<{ keyword_type: string }[]>`
          SELECT keyword_type FROM keyword_target
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parentId}::uuid
           LIMIT 1
        `;
        if (parentRows.length === 0) {
          return { ok: false as const, action: "parent-not-found" as const };
        }
        if (parentRows[0]!.keyword_type !== "primary") {
          return { ok: false as const, action: "parent-not-primary" as const };
        }
      }

      // 기존 slug 는 skip — ON CONFLICT DO NOTHING + RETURNING 유무로 판별
      const insertedIds: string[] = [];
      const skippedExisting: string[] = [];
      for (const e of entries) {
        const rows = await tx<{ id: string }[]>`
          INSERT INTO keyword_target (
            instance_id, slug, label, keyword_type, parent_id,
            intent, priority, difficulty, region_scope, status
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${e.slug},
            ${e.label},
            ${parsed.data.keywordType}::text,
            ${parentId}::uuid,
            ${parsed.data.intent}::text,
            ${parsed.data.priority}::text,
            ${null},
            ${null},
            ${parsed.data.status}::text
          )
          ON CONFLICT (instance_id, slug) DO NOTHING
          RETURNING id
        `;
        if (rows.length > 0) insertedIds.push(rows[0]!.id);
        else skippedExisting.push(e.label);
      }

      return { ok: true as const, ctx, insertedIds, skippedExisting };
    });

    if (result.ok === false) {
      if (result.action === "parent-not-found") {
        return { ok: false, fieldErrors: { parentId: ["대표 키워드를 찾을 수 없습니다."] } };
      }
      return {
        ok: false,
        fieldErrors: {
          parentId: ["대표 (primary) 키워드만 부모로 지정 가능합니다."],
        },
      };
    }

    if (result.insertedIds.length > 0) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: "KeywordTarget",
            mode: "bulk-insert",
            insertedCount: result.insertedIds.length,
            skippedExistingCount: result.skippedExisting.length,
          },
        });
      } catch (err) {
        console.error("[bulkCreateKeywordTargets] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/keywords`);
      revalidatePath(`/admin/${instanceSlug}`);
    }

    return {
      ok: true,
      inserted: result.insertedIds.length,
      skippedExisting: result.skippedExisting,
      duplicateInInput,
      invalid,
    };
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
      if (action.kind === "forbidden" || action.kind === "info") {
        return { ok: false, fieldErrors: {}, formError: action.message };
      }
    }
    console.error("[bulkCreateKeywordTargets] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "대량 등록 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteKeywordTarget(instanceSlug: string, kid: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      // (1) children 차단 검사 (cycle 1 #2)
      const childRows = await tx<{ n: string }[]>`
        SELECT count(*)::text AS n FROM keyword_target
         WHERE instance_id = ${ctx.instanceId}::uuid AND parent_id = ${kid}::uuid
      `;
      const childCount = childRows[0] ? Number(childRows[0].n) : 0;
      if (childCount > 0) {
        return {
          ok: false as const,
          action: "children-block" as const,
          childCount,
        };
      }

      // (2) affected entities 선조회 (cycle 1 #4) — CASCADE 전 SELECT
      const linkRows: Array<{ entity_type: SeoKeywordEntityType; entity_id: string }> = await tx`
        SELECT entity_type, entity_id FROM keyword_content_link
         WHERE instance_id = ${ctx.instanceId}::uuid AND keyword_id = ${kid}::uuid
      `;

      // (3) keyword_target DELETE — keyword_content_link CASCADE 자동 정리
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM keyword_target
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${kid}::uuid
         RETURNING id
      `;
      if (deleted.length === 0) {
        return { ok: false as const, action: "notfound" as const };
      }

      // (4) 영향 받은 entity readiness 재계산
      for (const r of linkRows) {
        await computeReadinessForEntity(tx, ctx.instanceId, r.entity_type, r.entity_id);
      }

      return { ok: true as const, deletedCount: deleted.length };
    });

    if (result.ok === false) {
      if (result.action === "notfound") {
        return { ok: false, formError: "해당 키워드가 이미 삭제되었습니다." };
      }
      if (result.action === "children-block") {
        return {
          ok: false,
          formError: `이 대표 키워드 아래 보조 키워드가 ${result.childCount}개 있습니다. 먼저 보조 키워드의 부모를 변경하거나 보조 키워드를 삭제하세요.`,
        };
      }
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "KeywordTarget", keywordId: kid },
      });
    } catch (err) {
      console.error("[deleteKeywordTarget] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/keywords`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/keywords`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") {
        return { ok: false, formError: action.message };
      }
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteKeywordTarget] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
