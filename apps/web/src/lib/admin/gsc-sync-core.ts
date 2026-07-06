// @glitzy/web/lib/admin/gsc-sync-core — GSC sync 시스템 코어 (cron 자동 sync 용 · 세션 비의존)
// NAVER_EXPOSURE Tier 3 — /api/cron/sync-visibility 가 세션 없이 GSC 지표를 자동 수집.
//
// 쓰기는 항상 RLS-scoped tx(withTenantTransaction, app_tenant_user 역할 + 명시 instance_id) 안에서 수행한다.
// cross-tenant 프로퍼티 조회는 cron route 가 raw getSqlBase()(service-role)로 — syncSearchVisibility(어드민
// 수동 sync) 액션의 line 381 패턴과 동일.
//
// NOTE: 어드민 수동 sync 액션(sync-actions.ts)의 fetch/UPSERT/lock 과 로직이 겹치나, 프로덕션에서 검증된
//   그 액션을 건드리지 않기 위해 의도적으로 별도 구현한다(코드베이스가 이미 SQL 중복을 실용적으로 허용 —
//   search-visibility.ts 의 NSA 누적 grain 블록도 두 파일에 인라인됨). 로직 변경 시 양쪽 동기화 필요.

import crypto from "node:crypto";
import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
import { asUuidV4, type InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { queryAnalytics, type GscRow } from "@/lib/integrations/google-search-console";

const ROW_LIMIT = 25_000;

/** GSC searchAnalytics pagination loop → 전체 row 회수. */
export async function fetchGscRowsPaginated(
  creds: { saEmail: string; privateKey: string },
  params: { siteUrl: string; startDate: string; endDate: string },
): Promise<{ rows: GscRow[]; paginationCalls: number }> {
  const rows: GscRow[] = [];
  let startRow = 0;
  let paginationCalls = 0;
  while (true) {
    paginationCalls += 1;
    const page = await queryAnalytics({
      saEmail: creds.saEmail,
      privateKey: creds.privateKey,
      siteUrl: params.siteUrl,
      startDate: params.startDate,
      endDate: params.endDate,
      startRow,
    });
    rows.push(...page.rows);
    if (!page.hasMore) break;
    startRow += ROW_LIMIT;
    if (startRow >= 250_000) break; // sanity stop (10 페이지)
  }
  return { rows, paginationCalls };
}

/** snapshot UPSERT (per-row · CHECK 위반 row 는 skip + count). tx 는 RLS-scoped. */
export async function upsertSnapshotRows(
  tx: ScopedTx,
  args: { instanceId: string; propertyId: string },
  rows: ReadonlyArray<GscRow>,
): Promise<{ rowsIngested: number; skippedRows: number }> {
  let rowsIngested = 0;
  let skippedRows = 0;
  for (const row of rows) {
    const [snapshotDate, pageUrl, query] = row.keys;
    try {
      await tx`
        INSERT INTO search_visibility_snapshot (
          instance_id, property_id, source, snapshot_date, page_url, query,
          impressions, clicks, ctr, avg_position
        ) VALUES (
          ${args.instanceId}::uuid, ${args.propertyId}::uuid, 'google-search-console',
          ${snapshotDate}::date, ${pageUrl}, ${query},
          ${Math.round(row.impressions)}, ${Math.round(row.clicks)},
          ${Number(row.ctr.toFixed(5))}, ${Number(row.position.toFixed(2))}
        )
        ON CONFLICT (instance_id, property_id, snapshot_date, page_url, query) DO UPDATE
           SET impressions = EXCLUDED.impressions, clicks = EXCLUDED.clicks,
               ctr = EXCLUDED.ctr, avg_position = EXCLUDED.avg_position
      `;
      rowsIngested += 1;
    } catch {
      skippedRows += 1;
    }
  }
  return { rowsIngested, skippedRows };
}

/** sync lock 획득 (INSERT ... ON CONFLICT · running 이거나 30분 미경과면 skip). 획득 시 true. */
export async function acquireGscSyncLock(
  tx: ScopedTx,
  args: { instanceId: string; propertyId: string; lockToken: string },
): Promise<boolean> {
  const lockRows = await tx<{ lock_token: string }[]>`
    INSERT INTO search_sync_state (instance_id, property_id, last_status, sync_started_at, lock_token, updated_at)
    VALUES (${args.instanceId}::uuid, ${args.propertyId}::uuid, 'running', NOW(), ${args.lockToken}, NOW())
    ON CONFLICT (instance_id, property_id) DO UPDATE
       SET last_status = 'running', sync_started_at = NOW(), lock_token = ${args.lockToken}, updated_at = NOW()
     WHERE search_sync_state.last_status <> 'running'
        OR search_sync_state.sync_started_at < NOW() - INTERVAL '30 minutes'
    RETURNING lock_token
  `;
  return lockRows.length > 0;
}

/** sync lock 해제 + 결과 기록 (lock_token 일치 시에만). */
export async function releaseGscSyncLock(
  tx: ScopedTx,
  args: {
    instanceId: string;
    propertyId: string;
    lockToken: string;
    status: "success" | "partial" | "failed";
    lastSyncedDate?: string;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await tx`
    UPDATE search_sync_state
       SET last_status = ${args.status}, last_sync_at = NOW(),
           last_synced_date = ${args.lastSyncedDate ?? null}::date,
           sync_started_at = NULL, lock_token = NULL,
           last_error = ${args.errorMessage ?? null},
           metadata = ${tx.json((args.metadata ?? {}) as never)}::jsonb,
           updated_at = NOW()
     WHERE instance_id = ${args.instanceId}::uuid
       AND property_id = ${args.propertyId}::uuid
       AND lock_token = ${args.lockToken}
  `;
}

export type GscSyncOutcome = {
  status: "success" | "partial" | "failed" | "locked";
  rowsIngested: number;
  skippedRows: number;
  paginationCalls?: number;
  error?: string;
};

/**
 * 시스템(cron) GSC sync — 세션 없이 withTenantTransaction 으로 RLS-scoped 쓰기.
 * lock 획득 → GSC fetch(tx 밖) → snapshot UPSERT → lock 해제. lock 실패 시 status='locked'.
 */
export async function runGscSyncForProperty(args: {
  instanceId: string;
  propertyId: string;
  propertyUrl: string;
  startDate: string;
  endDate: string;
  creds: { saEmail: string; privateKey: string };
}): Promise<GscSyncOutcome> {
  const sql = getSqlBase();
  const brandedId = asUuidV4(args.instanceId) as InstanceId;
  const lockToken = crypto.randomUUID();

  const acquired = await withTenantTransaction(sql, { instanceId: brandedId }, (tx) =>
    acquireGscSyncLock(tx, { instanceId: args.instanceId, propertyId: args.propertyId, lockToken }),
  );
  if (!acquired) return { status: "locked", rowsIngested: 0, skippedRows: 0 };

  try {
    const { rows, paginationCalls } = await fetchGscRowsPaginated(args.creds, {
      siteUrl: args.propertyUrl,
      startDate: args.startDate,
      endDate: args.endDate,
    });
    const { rowsIngested, skippedRows } = await withTenantTransaction(sql, { instanceId: brandedId }, (tx) =>
      upsertSnapshotRows(tx, { instanceId: args.instanceId, propertyId: args.propertyId }, rows),
    );
    const status = skippedRows > 0 ? "partial" : "success";
    await withTenantTransaction(sql, { instanceId: brandedId }, (tx) =>
      releaseGscSyncLock(tx, {
        instanceId: args.instanceId,
        propertyId: args.propertyId,
        lockToken,
        status,
        lastSyncedDate: args.endDate,
        metadata: { via: "cron", syncedRange: { startDate: args.startDate, endDate: args.endDate }, rowsIngested, skippedRows, paginationCalls },
      }),
    );
    return { status, rowsIngested, skippedRows, paginationCalls };
  } catch (err) {
    const error = String(err).slice(0, 500);
    // 실패해도 lock 은 반드시 해제 시도 (실패 시 30분 stale 자동복구가 커버).
    try {
      await withTenantTransaction(sql, { instanceId: brandedId }, (tx) =>
        releaseGscSyncLock(tx, {
          instanceId: args.instanceId,
          propertyId: args.propertyId,
          lockToken,
          status: "failed",
          errorMessage: error,
          metadata: { via: "cron" },
        }),
      );
    } catch {
      /* lock 해제 실패 — 30분 stale 자동복구가 커버 */
    }
    return { status: "failed", rowsIngested: 0, skippedRows: 0, error };
  }
}
