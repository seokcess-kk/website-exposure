// @glitzy/web/(admin)/[instanceSlug]/visibility-metrics/sync-actions
// SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 4 — addSearchProperty · verifySearchProperty · deleteSearchProperty · syncSearchVisibility.

"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
import type { InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { isSearchConsoleConfigured, getSearchConsoleCredentials } from "@/lib/env";
import {
  GscApiError,
  extractPropertyHost,
  normalizeSearchPropertyUrl,
  queryAnalytics,
  verifySiteAccess,
  type GscRow,
} from "@/lib/integrations/google-search-console";

const ROW_LIMIT = 25_000;

export type SyncActionResult =
  | { ok: true; message?: string }
  | { ok: false; formError: string };

// === 공통 ===

function todayUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDateString(base: string, daysDelta: number): string {
  const d = new Date(`${base}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + daysDelta);
  return d.toISOString().slice(0, 10);
}

/** § 3.3 단계 2 — instance domain 매칭. PUBLIC_SITE_ORIGIN 미설정 시 dev 모드로 host 매칭 skip. */
function matchesInstanceDomain(propertyUrl: string, instanceSlug: string): { matched: boolean; reason?: string } {
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (!trustedOrigin) {
    // dev: host 매칭 검증 skip (운영자 책임)
    return { matched: true };
  }
  let trustedHost: string;
  try {
    trustedHost = new URL(trustedOrigin).hostname.toLowerCase();
  } catch {
    return { matched: false, reason: "PUBLIC_SITE_ORIGIN env 가 유효한 URL 이 아닙니다." };
  }
  const propertyHost = extractPropertyHost(propertyUrl);
  if (!propertyHost) return { matched: false, reason: "Property URL 의 host 를 추출할 수 없습니다." };
  // www 제거 후 비교
  const stripWww = (h: string) => h.replace(/^www\./, "");
  if (stripWww(trustedHost) !== stripWww(propertyHost)) {
    return {
      matched: false,
      reason: `이 instance 의 host (${trustedHost}) 와 property host (${propertyHost}) 가 일치하지 않습니다.`,
    };
  }
  // URL-prefix property → instanceSlug path 확인 (sc-domain 은 path 검증 skip)
  if (propertyUrl.startsWith("http")) {
    try {
      const u = new URL(propertyUrl);
      const path = u.pathname.replace(/^\/+|\/+$/g, "");
      if (path && path !== instanceSlug) {
        return {
          matched: false,
          reason: `URL-prefix property 의 path (${path}) 가 instance slug (${instanceSlug}) 와 일치하지 않습니다.`,
        };
      }
    } catch {
      // already checked
    }
  }
  return { matched: true };
}

// === addSearchProperty (super-admin) — NSA 합류 (NAVER_SEARCH_INGEST_PLAN v0.2 § 2.2·task #5) ===

const AddPropertyInput = z.object({
  source: z.enum(["google-search-console", "naver-searchadvisor"]),
  propertyUrl: z.string().min(1).max(500),
  verificationMethod: z.enum([
    "gsc-service-account",
    "naver-meta-tag",
    "naver-html-file",
    "naver-dns-record",
  ]),
}).refine(
  (data) => {
    if (data.source === "google-search-console") return data.verificationMethod === "gsc-service-account";
    if (data.source === "naver-searchadvisor") return data.verificationMethod.startsWith("naver-");
    return false;
  },
  { message: "verificationMethod 가 source 와 일치하지 않습니다.", path: ["verificationMethod"] },
);

export async function addSearchProperty(
  instanceSlug: string,
  _prev: SyncActionResult | null,
  formData: FormData,
): Promise<SyncActionResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  const raw = {
    source: formData.get("source"),
    propertyUrl: formData.get("propertyUrl"),
    verificationMethod: formData.get("verificationMethod"),
  };
  const parsed = AddPropertyInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, formError: "입력 검증 실패: " + parsed.error.issues.map((i) => i.message).join(", ") };
  }

  let normalized: string;
  try {
    normalized = normalizeSearchPropertyUrl(parsed.data.propertyUrl);
  } catch (err) {
    return { ok: false, formError: (err as Error).message };
  }

  const domainCheck = matchesInstanceDomain(normalized, instanceSlug);
  if (!domainCheck.matched) {
    return { ok: false, formError: domainCheck.reason ?? "instance domain 매칭 실패" };
  }

  // NSA 는 외부 콘솔에서 운영자가 소유 확인 완료 후 등록 — 어드민은 verify 호출 안 함 (§ 2.2)
  const isNaver = parsed.data.source === "naver-searchadvisor";
  const initialStatus = isNaver ? "verified" : "pending";
  const initialVerifiedAt: Date | null = isNaver ? new Date() : null;

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      if (!ctx.isSuperAdmin) {
        return { ok: false as const, formError: "Property 등록은 super-admin 만 가능합니다." };
      }
      assertActionEligibility(ctx, "operator-edit-content");
      const rows = await tx<{ id: string }[]>`
        INSERT INTO search_property (
          instance_id, source, property_url, verification_status,
          verification_method, verified_at
        )
        VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.source},
          ${normalized},
          ${initialStatus},
          ${parsed.data.verificationMethod},
          ${initialVerifiedAt}
        )
        RETURNING id
      `;
      return { ok: true as const, ctx, propertyId: rows[0]!.id };
    });

    if (result.ok === false) return { ok: false, formError: result.formError };
    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-saved",
        actorUserId: result.ctx.userId,
        targetUserId: result.ctx.userId,
        toInstanceId: result.ctx.instanceId,
        payload: {
          contentType: "SearchProperty",
          propertyId: result.propertyId,
          action: "add",
          source: parsed.data.source,
          verificationMethod: parsed.data.verificationMethod,
        },
      });
    } catch (err) {
      console.error("[addSearchProperty] audit failed", err);
    }
    revalidatePath(`/admin/${instanceSlug}/visibility-metrics`);
    const successMessage = isNaver
      ? "등록 완료 — 네이버 데이터는 CSV 업로드로 ingestion 합니다 (별 cycle 합류 시 UI 제공)."
      : "등록 완료 — verify 버튼 으로 GSC 접근 확인하세요.";
    return { ok: true, message: successMessage };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      return { ok: false, formError: mapped.kind === "form" ? mapped.message : "Property 등록 실패" };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    console.error("[addSearchProperty] unexpected", err);
    return { ok: false, formError: "Property 등록 중 알 수 없는 오류가 발생했습니다." };
  }
}

// === verifySearchProperty (super-admin) ===

export async function verifySearchProperty(instanceSlug: string, propertyId: string): Promise<SyncActionResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const propRow = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      if (!ctx.isSuperAdmin) return { ok: false as const, formError: "verify 는 super-admin 만 가능합니다." };
      const rows = await tx<{ property_url: string; source: string }[]>`
        SELECT property_url, source FROM search_property
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${propertyId}::uuid LIMIT 1
      `;
      if (rows.length === 0) return { ok: false as const, formError: "Property 를 찾을 수 없습니다." };
      return { ok: true as const, ctx, propertyUrl: rows[0]!.property_url, source: rows[0]!.source };
    });

    if (propRow.ok === false) return { ok: false, formError: propRow.formError };

    // NSA 는 외부 콘솔 verification 만 — 어드민에서 재검증 불가 (§ 2.2)
    if (propRow.source === "naver-searchadvisor") {
      return {
        ok: false,
        formError: "네이버 property 는 외부 콘솔(searchadvisor.naver.com)에서 소유 확인 합니다.",
      };
    }

    if (!isSearchConsoleConfigured()) {
      return { ok: false, formError: "GSC 환경 변수가 설정되어 있지 않습니다 (runbook 참고)." };
    }

    const domainCheck = matchesInstanceDomain(propRow.propertyUrl, instanceSlug);
    if (!domainCheck.matched) {
      await markVerified(aCtx, propertyId, "failed", domainCheck.reason ?? "domain mismatch");
      return { ok: false, formError: domainCheck.reason ?? "instance domain 매칭 실패" };
    }

    const creds = getSearchConsoleCredentials()!;
    try {
      await verifySiteAccess({ saEmail: creds.saEmail, privateKey: creds.privateKey, siteUrl: propRow.propertyUrl });
    } catch (err) {
      const reason = err instanceof GscApiError ? `GSC ${err.code}: ${err.message}` : `GSC 호출 실패: ${String(err).slice(0, 200)}`;
      await markVerified(aCtx, propertyId, "failed", reason);
      return { ok: false, formError: reason };
    }

    await markVerified(aCtx, propertyId, "verified", null);
    revalidatePath(`/admin/${instanceSlug}/visibility-metrics`);
    return { ok: true, message: "검증 완료" };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    console.error("[verifySearchProperty] unexpected", err);
    return { ok: false, formError: "Verify 중 오류가 발생했습니다." };
  }
}

async function markVerified(
  aCtx: { signedToken: string; instanceId: InstanceId },
  propertyId: string,
  status: "verified" | "failed",
  errorMsg: string | null,
): Promise<void> {
  await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
    await tx`
      UPDATE search_property
         SET verification_status = ${status},
             verified_at = ${status === "verified" ? new Date() : null},
             metadata = ${tx.json((errorMsg ? { lastVerifyError: errorMsg } : {}) as any)}::jsonb
       WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${propertyId}::uuid
    `;
  });
}

// === deleteSearchProperty (super-admin) ===

export async function deleteSearchProperty(instanceSlug: string, propertyId: string): Promise<SyncActionResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      if (!ctx.isSuperAdmin) return { ok: false as const, formError: "삭제는 super-admin 만 가능합니다." };
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM search_property
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${propertyId}::uuid
         RETURNING id
      `;
      if (deleted.length === 0) return { ok: false as const, formError: "이미 삭제되었습니다." };
      return { ok: true as const, ctx };
    });
    if (result.ok === false) return { ok: false, formError: result.formError };
    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-saved",
        actorUserId: result.ctx.userId,
        targetUserId: result.ctx.userId,
        toInstanceId: result.ctx.instanceId,
        payload: { contentType: "SearchProperty", propertyId, action: "delete" },
      });
    } catch (err) {
      console.error("[deleteSearchProperty] audit failed", err);
    }
    revalidatePath(`/admin/${instanceSlug}/visibility-metrics`);
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    console.error("[deleteSearchProperty] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}

// === syncSearchVisibility (operator) — § 4.4 ===

export type SyncMode = "initial" | "recent" | "custom";

const SyncInput = z.object({
  propertyId: z.string().min(1),
  mode: z.enum(["initial", "recent", "custom"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function syncSearchVisibility(
  instanceSlug: string,
  _prev: SyncActionResult | null,
  formData: FormData,
): Promise<SyncActionResult> {
  const aCtx = await resolveActionContext(instanceSlug);

  const parsed = SyncInput.safeParse({
    propertyId: formData.get("propertyId"),
    mode: formData.get("mode") ?? "recent",
    startDate: formData.get("startDate") ?? undefined,
    endDate: formData.get("endDate") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, formError: "입력 검증 실패: " + parsed.error.issues.map((i) => i.message).join(", ") };
  }

  // NSA source 분기 (NAVER_SEARCH_INGEST_PLAN v0.2 § 5) — CSV upload path 안내
  const sourceCheck = await getSqlBase()<{ source: string }[]>`
    SELECT sp.source
      FROM search_property sp
      JOIN instance i ON i.id = sp.instance_id
     WHERE i.slug = ${instanceSlug}
       AND sp.id = ${parsed.data.propertyId}::uuid
     LIMIT 1
  `;
  if (sourceCheck.length === 0) {
    return { ok: false, formError: "Property 를 찾을 수 없습니다." };
  }
  if (sourceCheck[0]!.source === "naver-searchadvisor") {
    return {
      ok: false,
      formError: "네이버 property 는 CSV 업로드로 ingestion 합니다 — /visibility-metrics/upload (별 cycle 합류 시 활성).",
    };
  }

  if (!isSearchConsoleConfigured()) {
    return { ok: false, formError: "GSC 환경 변수가 설정되어 있지 않습니다 (runbook 참고)." };
  }

  // date range 결정 (§ 4.4 cycle 2 #8) — GSC 데이터는 보통 2일 지연
  const today = todayUtcDateString();
  const dataEnd = shiftDateString(today, -2);
  let startDate: string;
  let endDate: string;
  if (parsed.data.mode === "initial") {
    endDate = dataEnd;
    startDate = shiftDateString(endDate, -89);
  } else if (parsed.data.mode === "recent") {
    endDate = dataEnd;
    startDate = shiftDateString(endDate, -6);
  } else {
    if (!parsed.data.startDate || !parsed.data.endDate) {
      return { ok: false, formError: "custom 모드는 startDate · endDate 둘 다 필요합니다." };
    }
    startDate = parsed.data.startDate;
    endDate = parsed.data.endDate;
    const diffDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    if (diffDays < 0) return { ok: false, formError: "endDate 가 startDate 이전입니다." };
    if (diffDays > 180) return { ok: false, formError: "최대 180일 범위까지 지원합니다." };
  }

  const sqlBase = getSqlBase();
  const lockToken = crypto.randomUUID();

  // step 1: property 정보 조회 + lock 획득 (UPSERT · § 4.4)
  let propertyUrl: string;
  let ctxRef: { userId: string; instanceId: string };
  try {
    const acquired = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      const propRows = await tx<{ property_url: string; verification_status: string }[]>`
        SELECT property_url, verification_status FROM search_property
         WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.propertyId}::uuid LIMIT 1
      `;
      if (propRows.length === 0) return { ok: false as const, formError: "Property 를 찾을 수 없습니다." };
      if (propRows[0]!.verification_status !== "verified") {
        return { ok: false as const, formError: "verified 상태의 property 만 sync 가능합니다." };
      }

      const lockRows = await tx<{ lock_token: string }[]>`
        INSERT INTO search_sync_state (instance_id, property_id, last_status, sync_started_at, lock_token, updated_at)
        VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.propertyId}::uuid,
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
        return { ok: false as const, formError: "이 property 의 sync 가 이미 진행 중입니다 — 잠시 후 다시 시도하세요." };
      }
      return {
        ok: true as const,
        propertyUrl: propRows[0]!.property_url,
        ctxRef: { userId: ctx.userId, instanceId: ctx.instanceId },
      };
    });

    if (acquired.ok === false) return { ok: false, formError: acquired.formError };
    propertyUrl = acquired.propertyUrl;
    ctxRef = acquired.ctxRef;
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    console.error("[syncSearchVisibility] lock acquire failed", err);
    return { ok: false, formError: "sync 시작 실패" };
  }

  // step 2: GSC fetch + insert (try/catch/finally — § 4.4)
  const startedAt = Date.now();
  let rowsIngested = 0;
  let paginationCalls = 0;
  let skippedRows = 0;
  try {
    const creds = getSearchConsoleCredentials()!;
    const allRows: GscRow[] = [];
    let startRow = 0;
    // pagination loop (§ 3.5)
    while (true) {
      paginationCalls += 1;
      const page = await queryAnalytics({
        saEmail: creds.saEmail,
        privateKey: creds.privateKey,
        siteUrl: propertyUrl,
        startDate,
        endDate,
        startRow,
      });
      allRows.push(...page.rows);
      if (!page.hasMore) break;
      startRow += ROW_LIMIT;
      if (startRow >= 250_000) break; // sanity stop (10 페이지)
    }

    // step 3: snapshot UPSERT — same tx 안에 batch (per-row · cycle 2 #6 안 individual row skip)
    await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      for (const row of allRows) {
        const [snapshotDate, pageUrl, query] = row.keys;
        try {
          await tx`
            INSERT INTO search_visibility_snapshot (
              instance_id, property_id, source, snapshot_date, page_url, query,
              impressions, clicks, ctr, avg_position
            ) VALUES (
              ${ctx.instanceId}::uuid,
              ${parsed.data.propertyId}::uuid,
              'google-search-console',
              ${snapshotDate}::date,
              ${pageUrl},
              ${query},
              ${Math.round(row.impressions)},
              ${Math.round(row.clicks)},
              ${Number(row.ctr.toFixed(5))},
              ${Number(row.position.toFixed(2))}
            )
            ON CONFLICT (instance_id, property_id, snapshot_date, page_url, query) DO UPDATE
               SET impressions = EXCLUDED.impressions,
                   clicks = EXCLUDED.clicks,
                   ctr = EXCLUDED.ctr,
                   avg_position = EXCLUDED.avg_position
          `;
          rowsIngested += 1;
        } catch (rowErr) {
          // 개별 row CHECK 위반 → skip + count (cycle 2 #6)
          skippedRows += 1;
        }
      }
    });

    // step 4: unlock with success
    const finalStatus = skippedRows > 0 ? "partial" : "success";
    await releaseLock(aCtx, parsed.data.propertyId, lockToken, {
      status: finalStatus,
      lastSyncedDate: endDate,
      metadata: { syncedRange: { startDate, endDate }, rowsIngested, paginationCalls, skippedRows, durationMs: Date.now() - startedAt },
    });
    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-saved",
        actorUserId: ctxRef.userId,
        targetUserId: ctxRef.userId,
        toInstanceId: ctxRef.instanceId,
        payload: {
          contentType: "SearchVisibilitySync",
          propertyId: parsed.data.propertyId,
          mode: parsed.data.mode,
          status: finalStatus,
          rowsIngested,
          skippedRows,
        },
      });
    } catch (err) {
      console.error("[syncSearchVisibility] audit failed", err);
    }
    revalidatePath(`/admin/${instanceSlug}/visibility-metrics`);
    return {
      ok: true,
      message: `Sync 완료 — ${rowsIngested}건 적재 · ${skippedRows}건 skip (${paginationCalls}회 페이지)`,
    };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const errMsg = err instanceof GscApiError ? `${err.code}: ${err.message}` : String(err).slice(0, 500);
    await releaseLock(aCtx, parsed.data.propertyId, lockToken, {
      status: "failed",
      errorMessage: errMsg,
      metadata: { syncedRange: { startDate, endDate }, rowsIngested, paginationCalls, skippedRows },
    });
    console.error("[syncSearchVisibility] failed", err);
    return { ok: false, formError: `Sync 실패: ${errMsg}` };
  }
}

async function releaseLock(
  aCtx: { signedToken: string; instanceId: InstanceId },
  propertyId: string,
  lockToken: string,
  payload: {
    status: "success" | "partial" | "failed";
    lastSyncedDate?: string;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
    await tx`
      UPDATE search_sync_state
         SET last_status = ${payload.status},
             last_sync_at = NOW(),
             last_synced_date = ${payload.lastSyncedDate ?? null}::date,
             sync_started_at = NULL,
             lock_token = NULL,
             last_error = ${payload.errorMessage ?? null},
             metadata = ${tx.json((payload.metadata ?? {}) as any)}::jsonb,
             updated_at = NOW()
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND property_id = ${propertyId}::uuid
         AND lock_token = ${lockToken}
    `;
  });
}
