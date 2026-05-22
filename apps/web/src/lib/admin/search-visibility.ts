// @glitzy/web/lib/admin/search-visibility — /visibility-metrics 페이지 데이터 helper
// SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 6.1·7 — weighted aggregate + 페이지/키워드별 + 시계열.
// NAVER_SEARCH_INGEST_PLAN v0.2 task #6 — loadVisibilitySummary 시그니처 확장
//   (propertyId 단일 → { propertyId?, source?, days?, topLimit? } filters) · 합산 path 지원.
// NAVER_SEARCH_INGEST_PLAN v0.4 task #6 patch (cycle 3 (b)) — metadata.positionUnavailable=true row
//   의 avg_position 합산 skip (NSA sentinel 오염 차단).

import type postgres from "postgres";
import type { SearchSource } from "@glitzy/core-content";

// === Types ===

export type SearchPropertyRow = {
  id: string;
  source: string;
  propertyUrl: string;
  verificationStatus: string;
  addedAt: string;
  verifiedAt: string | null;
  metadata: Record<string, unknown>;
};

export type SearchSyncStateRow = {
  propertyId: string;
  lastSyncAt: string | null;
  lastSyncedDate: string | null;
  lastStatus: string;
  lastError: string | null;
  syncStartedAt: string | null;
  metadata: Record<string, unknown>;
};

export type VisibilityAggregate = {
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
};

export type VisibilityRow = VisibilityAggregate & {
  key: string;  // page_url 또는 query
};

export type SparklinePoint = { date: string; impressions: number; clicks: number };

export type VisibilitySnapshotSummary = {
  range: { startDate: string; endDate: string };
  total: VisibilityAggregate;
  topPages: VisibilityRow[];
  topQueries: VisibilityRow[];
  daily: SparklinePoint[];
};

// === 정책: weighted aggregate (cycle 1 #5) ===

/**
 * impression-weighted average position.
 * rows 가 비어있으면 모두 0. impressions 합이 0이면 avgPosition 도 0.
 */
export function aggregateWeighted(rows: Array<{
  impressions: number;
  clicks: number;
  avgPosition: number;
}>): VisibilityAggregate {
  let impressions = 0;
  let clicks = 0;
  let weightedPositionSum = 0;
  for (const r of rows) {
    impressions += r.impressions;
    clicks += r.clicks;
    weightedPositionSum += r.avgPosition * r.impressions;
  }
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = impressions > 0 ? weightedPositionSum / impressions : 0;
  return { impressions, clicks, ctr, avgPosition };
}

/**
 * NAVER_SEARCH_INGEST_PLAN v0.4 cycle 3 (b) — positionUnavailable=true row 의 avg_position 합산 제외.
 * impressions/clicks/ctr 은 합산 (NSA 의 click·impression 통계는 의미 있음) ·
 * avg_position 만 별도 weighted denominator 사용.
 *
 * 모든 row 가 positionUnavailable=true 면 avgPosition = 0 (UI 안 "순위 데이터 없음" 표시).
 */
export function aggregateWeightedFiltered(rows: Array<{
  impressions: number;
  clicks: number;
  avgPosition: number;
  positionUnavailable: boolean;
}>): VisibilityAggregate {
  let impressions = 0;
  let clicks = 0;
  let weightedPositionSum = 0;
  let positionDenominator = 0;
  for (const r of rows) {
    impressions += r.impressions;
    clicks += r.clicks;
    if (!r.positionUnavailable) {
      weightedPositionSum += r.avgPosition * r.impressions;
      positionDenominator += r.impressions;
    }
  }
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = positionDenominator > 0 ? weightedPositionSum / positionDenominator : 0;
  return { impressions, clicks, ctr, avgPosition };
}

// === DB load ===

export async function loadSearchProperties(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<SearchPropertyRow[]> {
  const rows = await tx<Array<{
    id: string;
    source: string;
    property_url: string;
    verification_status: string;
    added_at: Date;
    verified_at: Date | null;
    metadata: Record<string, unknown> | null;
  }>>`
    SELECT id, source, property_url, verification_status, added_at, verified_at, metadata
    FROM search_property
    WHERE instance_id = ${instanceId}::uuid
    ORDER BY added_at DESC
  `;
  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    propertyUrl: r.property_url,
    verificationStatus: r.verification_status,
    addedAt: r.added_at.toISOString(),
    verifiedAt: r.verified_at?.toISOString() ?? null,
    metadata: r.metadata ?? {},
  }));
}

export async function loadSyncStates(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<SearchSyncStateRow[]> {
  const rows = await tx<Array<{
    property_id: string;
    last_sync_at: Date | null;
    last_synced_date: Date | null;
    last_status: string;
    last_error: string | null;
    sync_started_at: Date | null;
    metadata: Record<string, unknown> | null;
  }>>`
    SELECT property_id, last_sync_at, last_synced_date, last_status, last_error, sync_started_at, metadata
    FROM search_sync_state
    WHERE instance_id = ${instanceId}::uuid
  `;
  return rows.map((r) => ({
    propertyId: r.property_id,
    lastSyncAt: r.last_sync_at?.toISOString() ?? null,
    lastSyncedDate: r.last_synced_date ? r.last_synced_date.toISOString().slice(0, 10) : null,
    lastStatus: r.last_status,
    lastError: r.last_error,
    syncStartedAt: r.sync_started_at?.toISOString() ?? null,
    metadata: r.metadata ?? {},
  }));
}

export type VisibilityFilters = {
  /** propertyId 가 있으면 그 property 만 · 없으면 instance 의 모든 verified property 합산 */
  propertyId?: string;
  /** 'all' 또는 undefined = 모든 source 합산 · 특정 source 지정 시 그 source row 만 */
  source?: SearchSource | "all";
  /** endDate 가 max(snapshot_date) · startDate = endDate - (days-1). default 7 */
  days?: number;
  /** topPages / topQueries 최대 개수. default 50 */
  topLimit?: number;
};

/**
 * 최근 N일 snapshot 요약. filters 조합으로 property 단일 / 전체 합산 / source 별 표시.
 *
 * range 가 비어 있으면 total = 0/0/0/0. sync 한 적 없으면 null 반환.
 *
 * NAVER_SEARCH_INGEST_PLAN v0.2 task #6 — propertyId 단일 시그니처에서 filters object 로 확장.
 */
export async function loadVisibilitySummary(
  tx: postgres.TransactionSql,
  instanceId: string,
  filters: VisibilityFilters = {},
): Promise<VisibilitySnapshotSummary | null> {
  const { propertyId, source, days = 7, topLimit = 50 } = filters;
  const sourceParam = source && source !== "all" ? source : null;
  const propertyIdParam = propertyId ?? null;

  // endDate = max(snapshot_date) — 실제 데이터가 있는 가장 최근 날짜
  const [latestRow] = await tx<Array<{ max_date: Date | null }>>`
    SELECT MAX(snapshot_date) AS max_date
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND (${propertyIdParam}::uuid IS NULL OR property_id = ${propertyIdParam}::uuid)
      AND (${sourceParam}::text IS NULL OR source = ${sourceParam}::text)
  `;
  if (!latestRow?.max_date) return null;

  const endDate = latestRow.max_date.toISOString().slice(0, 10);
  const startDateObj = new Date(latestRow.max_date);
  startDateObj.setUTCDate(startDateObj.getUTCDate() - (days - 1));
  const startDate = startDateObj.toISOString().slice(0, 10);

  // 일별 합계 (sparkline) — already weighted via SUM (avg_position 은 weighted)
  const dailyRows = await tx<Array<{
    snapshot_date: Date;
    impressions: string;
    clicks: string;
  }>>`
    SELECT snapshot_date,
           SUM(impressions)::bigint AS impressions,
           SUM(clicks)::bigint AS clicks
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND (${propertyIdParam}::uuid IS NULL OR property_id = ${propertyIdParam}::uuid)
      AND (${sourceParam}::text IS NULL OR source = ${sourceParam}::text)
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
    GROUP BY snapshot_date
    ORDER BY snapshot_date ASC
  `;

  // 전체 raw rows (weighted aggregate 계산용)
  // cycle 3 (b): metadata.positionUnavailable=true row 의 avg_position 은 weighted 계산에서 제외
  const allRows = await tx<Array<{
    page_url: string;
    query: string;
    impressions: number;
    clicks: number;
    avg_position: string;
    position_unavailable: boolean;
  }>>`
    SELECT
      page_url, query, impressions, clicks, avg_position,
      COALESCE((metadata->>'positionUnavailable')::boolean, false) AS position_unavailable
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND (${propertyIdParam}::uuid IS NULL OR property_id = ${propertyIdParam}::uuid)
      AND (${sourceParam}::text IS NULL OR source = ${sourceParam}::text)
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
  `;

  const normalized = allRows.map((r) => ({
    pageUrl: r.page_url,
    query: r.query,
    impressions: r.impressions,
    clicks: r.clicks,
    avgPosition: Number(r.avg_position),
    positionUnavailable: r.position_unavailable,
  }));

  // cycle 3 (b): aggregate 시 positionUnavailable row 는 avg_position 합산 제외
  // (impressions/clicks 는 합산 — clicks·ctr 통계는 NSA 도 의미 있음)
  const total = aggregateWeightedFiltered(normalized);

  // group by page_url / query (positionUnavailable flag 보존)
  type GroupRow = { impressions: number; clicks: number; avgPosition: number; positionUnavailable: boolean };
  const byPage = new Map<string, GroupRow[]>();
  const byQuery = new Map<string, GroupRow[]>();
  for (const r of normalized) {
    const cell: GroupRow = {
      impressions: r.impressions,
      clicks: r.clicks,
      avgPosition: r.avgPosition,
      positionUnavailable: r.positionUnavailable,
    };
    const p = byPage.get(r.pageUrl) ?? [];
    p.push(cell);
    byPage.set(r.pageUrl, p);
    const q = byQuery.get(r.query) ?? [];
    q.push(cell);
    byQuery.set(r.query, q);
  }

  const topPages: VisibilityRow[] = Array.from(byPage.entries())
    .map(([key, rows]) => ({ key, ...aggregateWeightedFiltered(rows) }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, topLimit);

  const topQueries: VisibilityRow[] = Array.from(byQuery.entries())
    .map(([key, rows]) => ({ key, ...aggregateWeightedFiltered(rows) }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, topLimit);

  const daily: SparklinePoint[] = dailyRows.map((r) => ({
    date: r.snapshot_date.toISOString().slice(0, 10),
    impressions: Number(r.impressions),
    clicks: Number(r.clicks),
  }));

  return {
    range: { startDate, endDate },
    total,
    topPages,
    topQueries,
    daily,
  };
}
