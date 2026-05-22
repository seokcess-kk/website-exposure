// @glitzy/web/(admin)/[instanceSlug]/visibility-metrics/upload/actions
// NAVER_SEARCH_INGEST_PLAN v0.4 § 4·5 task #4 — uploadNaverPasteAction (3 tx · metadata jsonb).

"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import {
  detectAndParse,
  normalizeRow,
  buildNaverRowMetadata,
} from "@/lib/admin/naver-paste-parser";

export type UploadNaverPasteResult =
  | {
      ok: true;
      message: string;
      rowsIngested: number;
      skippedRows: number;
      errors: Array<{ rowIndex: number; reason: string }>;
      detectedFormat: string;
    }
  | { ok: false; formError: string; rowsIngested?: number; skippedRows?: number; errors?: Array<{ rowIndex: number; reason: string }> };

const UploadInput = z.object({
  propertyId: z.string().uuid(),
  referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "기준 날짜 형식 (YYYY-MM-DD)"),
  pasteText: z.string().min(1, "표 데이터를 붙여넣어주세요.").max(200_000, "paste 가 너무 큽니다 (최대 200KB)."),
});

export async function uploadNaverPasteAction(
  instanceSlug: string,
  _prev: UploadNaverPasteResult | null,
  formData: FormData,
): Promise<UploadNaverPasteResult> {
  const aCtx = await resolveActionContext(instanceSlug);

  const parsed = UploadInput.safeParse({
    propertyId: formData.get("propertyId"),
    referenceDate: formData.get("referenceDate"),
    pasteText: formData.get("pasteText"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      formError: "입력 검증 실패: " + parsed.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
    };
  }

  const sqlBase = getSqlBase();
  const lockToken = crypto.randomUUID();
  const { propertyId, referenceDate, pasteText } = parsed.data;

  // === Step 1 — lock 획득 tx (별 tx) ===
  let acquired:
    | { ok: true; propertyUrl: string; ctxRef: { userId: string; instanceId: string } }
    | { ok: false; formError: string };
  try {
    acquired = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      const propRows = await tx<{ property_url: string; source: string; verification_status: string }[]>`
        SELECT property_url, source, verification_status FROM search_property
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${propertyId}::uuid LIMIT 1
      `;
      if (propRows.length === 0) {
        return { ok: false as const, formError: "Property 를 찾을 수 없습니다." };
      }
      if (propRows[0]!.source !== "naver-searchadvisor") {
        return {
          ok: false as const,
          formError: "클립보드 paste 는 네이버 source property 에만 가능합니다.",
        };
      }
      if (propRows[0]!.verification_status !== "verified") {
        return { ok: false as const, formError: "verified 상태의 property 만 ingestion 가능합니다." };
      }

      const lockRows = await tx<{ lock_token: string }[]>`
        INSERT INTO search_sync_state (instance_id, property_id, last_status, sync_started_at, lock_token, updated_at)
        VALUES (
          ${ctx.instanceId}::uuid,
          ${propertyId}::uuid,
          'running',
          NOW(),
          ${lockToken},
          NOW()
        )
        ON CONFLICT (instance_id, property_id) DO UPDATE
           SET last_status = 'running',
               sync_started_at = NOW(),
               lock_token = ${lockToken},
               updated_at = NOW()
         WHERE search_sync_state.last_status <> 'running'
            OR search_sync_state.sync_started_at < NOW() - INTERVAL '30 minutes'
        RETURNING lock_token
      `;
      if (lockRows.length === 0) {
        return { ok: false as const, formError: "이 property 의 ingestion 이 이미 진행 중입니다 — 잠시 후 다시 시도하세요." };
      }
      return {
        ok: true as const,
        propertyUrl: propRows[0]!.property_url,
        ctxRef: { userId: ctx.userId, instanceId: ctx.instanceId },
      };
    });
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    console.error("[uploadNaverPasteAction] lock acquire failed", err);
    return { ok: false, formError: "lock 획득 실패" };
  }
  if (acquired.ok === false) return acquired;

  // === Step 2 — ingestion tx (별 tx · 실패 시 rollback) ===
  let ingestionResult:
    | {
        ok: true;
        rowsIngested: number;
        skippedRows: number;
        errors: Array<{ rowIndex: number; reason: string }>;
        detectedFormat: string;
      }
    | { ok: false; error: string; skippedRows: number; errors: Array<{ rowIndex: number; reason: string }> };
  try {
    const parsedPaste = detectAndParse(pasteText);
    if (parsedPaste.validRows.length === 0) {
      ingestionResult = {
        ok: false,
        error: parsedPaste.errors.length > 0 ? "NSA_PASTE_INVALID_SCHEMA" : "NSA_PASTE_EMPTY",
        skippedRows: parsedPaste.skippedRows,
        errors: parsedPaste.errors,
      };
    } else {
      const ingested = await withSkeletonTx(
        { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
        async (tx, ctx) => {
          const rowMetadata = buildNaverRowMetadata(referenceDate);
          let rowsIngested = 0;
          for (const row of parsedPaste.validRows) {
            const n = normalizeRow(row);
            await tx`
              INSERT INTO search_visibility_snapshot (
                instance_id, property_id, source, snapshot_date,
                page_url, query, impressions, clicks, ctr, avg_position, metadata
              ) VALUES (
                ${ctx.instanceId}::uuid, ${propertyId}::uuid, 'naver-searchadvisor',
                ${referenceDate}::date,
                ${n.pageUrl},
                ${n.query},
                ${n.impressions}, ${n.clicks}, ${n.ctr},
                ${n.avgPosition},
                ${tx.json(rowMetadata)}::jsonb
              )
              ON CONFLICT (instance_id, property_id, snapshot_date, page_url, query)
              DO UPDATE SET
                impressions = EXCLUDED.impressions,
                clicks = EXCLUDED.clicks,
                ctr = EXCLUDED.ctr,
                metadata = EXCLUDED.metadata
            `;
            rowsIngested += 1;
          }
          return rowsIngested;
        },
      );
      ingestionResult = {
        ok: true,
        rowsIngested: ingested,
        skippedRows: parsedPaste.skippedRows,
        errors: parsedPaste.errors,
        detectedFormat: parsedPaste.detectedFormat,
      };
    }
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    const errorCode = mapped !== null
      ? (mapped.kind === "form" ? mapped.message : "NSA_INGESTION_DB_ERROR")
      : `NSA_INGESTION_UNEXPECTED: ${String(err).slice(0, 200)}`;
    ingestionResult = { ok: false, error: errorCode, skippedRows: 0, errors: [] };
  }

  // === Step 3 — release tx (별 tx · 항상 실행 · sync_state persist) ===
  try {
    await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      if (ingestionResult.ok) {
        await tx`
          UPDATE search_sync_state
             SET last_status = 'success',
                 last_sync_at = NOW(),
                 last_synced_date = ${referenceDate}::date,
                 last_error = NULL,
                 lock_token = NULL,
                 metadata = jsonb_set(
                   jsonb_set(
                     jsonb_set(metadata, '{lastIngestionMethod}', '"naver-paste"'),
                     '{lastRowsIngested}', to_jsonb(${ingestionResult.rowsIngested}::int)
                   ),
                   '{lastSkippedRows}', to_jsonb(${ingestionResult.skippedRows}::int)
                 ),
                 updated_at = NOW()
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND property_id = ${propertyId}::uuid
             AND lock_token = ${lockToken}
        `;
      } else {
        await tx`
          UPDATE search_sync_state
             SET last_status = 'failed',
                 last_error = ${ingestionResult.error},
                 lock_token = NULL,
                 updated_at = NOW()
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND property_id = ${propertyId}::uuid
             AND lock_token = ${lockToken}
        `;
      }
    });
  } catch (err) {
    console.error("[uploadNaverPasteAction] release tx failed", err);
    // 30분 stale 정책으로 자동 복구
  }

  // === audit emit (best-effort) ===
  try {
    await emitAuditEvent(sqlBase, {
      eventType: "content-saved",
      actorUserId: acquired.ctxRef.userId as never,
      targetUserId: acquired.ctxRef.userId as never,
      toInstanceId: acquired.ctxRef.instanceId as never,
      payload: {
        contentType: "SearchVisibilitySnapshot",
        action: "naver-paste-ingest",
        propertyId,
        referenceDate,
        rowsIngested: ingestionResult.ok ? ingestionResult.rowsIngested : 0,
        skippedRows: ingestionResult.ok ? ingestionResult.skippedRows : 0,
        detectedFormat: ingestionResult.ok ? ingestionResult.detectedFormat : null,
        outcome: ingestionResult.ok ? "success" : "failed",
        error: ingestionResult.ok ? null : ingestionResult.error,
      },
    });
  } catch (err) {
    console.error("[uploadNaverPasteAction] audit emit failed", err);
  }

  revalidatePath(`/admin/${instanceSlug}/visibility-metrics`);
  revalidatePath(`/admin/${instanceSlug}/visibility-metrics/upload`);

  if (!ingestionResult.ok) {
    return {
      ok: false,
      formError: `ingestion 실패 (${ingestionResult.error})`,
      skippedRows: ingestionResult.skippedRows,
      errors: ingestionResult.errors,
    };
  }
  return {
    ok: true,
    message: `${ingestionResult.rowsIngested}개 행 ingestion 완료 (skipped ${ingestionResult.skippedRows} · format ${ingestionResult.detectedFormat})`,
    rowsIngested: ingestionResult.rowsIngested,
    skippedRows: ingestionResult.skippedRows,
    errors: ingestionResult.errors,
    detectedFormat: ingestionResult.detectedFormat,
  };
}
