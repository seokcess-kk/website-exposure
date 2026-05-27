// @glitzy/web/lib/admin/search-visibility-gap — NSI-DEFER-07 (GSC ↔ NSA gap 분석 view)
//
// search_visibility_snapshot 의 같은 query 에 대해 source 별 노출 차이를 3 분류로 정리.
//   - google-only: Google 안 노출 + 네이버 안 0
//   - naver-only:  네이버 안 노출 + Google 안 0
//   - both:        양쪽 모두 노출
//
// page_url 안 별로 같은 분석 가능 (page-level gap). 운영자가 어느 검색엔진 안 약한지
// 즉시 식별 — actionable signal (JSON-LD 보강 / 네이버 플레이스 보강 등).

import type postgres from "postgres";

export type SearchEngineGroup = "google" | "naver";
export type GapBucket = "google-only" | "naver-only" | "both";

export type QueryGapRow = {
  query: string;
  bucket: GapBucket;
  googleImpressions: number;
  googleClicks: number;
  naverImpressions: number;
  naverClicks: number;
  /** 운영자 정렬 기준 — 양쪽 합산 impressions. */
  totalImpressions: number;
};

export type PageGapRow = {
  pageUrl: string;
  bucket: GapBucket;
  googleImpressions: number;
  googleClicks: number;
  naverImpressions: number;
  naverClicks: number;
  totalImpressions: number;
};

export type GapSummary = {
  range: { startDate: string; endDate: string };
  queryCounts: Record<GapBucket, number>;
  pageCounts: Record<GapBucket, number>;
  topQueries: QueryGapRow[];   // bucket 무관 노출 큰 순 top N
  topPages: PageGapRow[];
};

const EMPTY_COUNTS: Record<GapBucket, number> = { "google-only": 0, "naver-only": 0, both: 0 };

function classify(googleImp: number, naverImp: number): GapBucket {
  if (googleImp > 0 && naverImp > 0) return "both";
  if (googleImp > 0) return "google-only";
  return "naver-only";
}

/**
 * source = 'google-search-console' → google · 그 외 (naver-searchadvisor · bing-webmaster) → naver/other.
 * v1.0 안 gap = google vs naver 만 분석 (bing 은 노출량 미미 · v2+ 합류).
 */
function isGoogleSource(source: string): boolean {
  return source === "google-search-console";
}
function isNaverSource(source: string): boolean {
  return source === "naver-searchadvisor";
}

export async function loadVisibilityGap(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { days?: number; topLimit?: number } = {},
): Promise<GapSummary | null> {
  const { days = 7, topLimit = 30 } = options;

  // endDate = MAX(snapshot_date)
  const [latestRow] = await tx<Array<{ max_date: Date | null }>>`
    SELECT MAX(snapshot_date) AS max_date
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
  `;
  if (!latestRow?.max_date) return null;

  const endDate = latestRow.max_date.toISOString().slice(0, 10);
  const startDateObj = new Date(latestRow.max_date);
  startDateObj.setUTCDate(startDateObj.getUTCDate() - (days - 1));
  const startDate = startDateObj.toISOString().slice(0, 10);

  // query 별 + source 별 합계. query 가 빈 문자열 (NSA paste 의 page-level only sentinel) 은 제외.
  const queryRows = await tx<Array<{
    query: string;
    source: string;
    impressions: string;
    clicks: string;
  }>>`
    SELECT query, source,
           SUM(impressions)::bigint AS impressions,
           SUM(clicks)::bigint AS clicks
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
      AND query <> ''
    GROUP BY query, source
  `;

  // page_url 별 + source 별 합계. page_url 빈 문자열 (NSA query-level only sentinel) 은 제외.
  const pageRows = await tx<Array<{
    page_url: string;
    source: string;
    impressions: string;
    clicks: string;
  }>>`
    SELECT page_url, source,
           SUM(impressions)::bigint AS impressions,
           SUM(clicks)::bigint AS clicks
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
      AND page_url <> ''
    GROUP BY page_url, source
  `;

  // query → bucket
  const queryAcc = new Map<string, { gImp: number; gClk: number; nImp: number; nClk: number }>();
  for (const r of queryRows) {
    const cur = queryAcc.get(r.query) ?? { gImp: 0, gClk: 0, nImp: 0, nClk: 0 };
    const imp = Number(r.impressions);
    const clk = Number(r.clicks);
    if (isGoogleSource(r.source)) {
      cur.gImp += imp;
      cur.gClk += clk;
    } else if (isNaverSource(r.source)) {
      cur.nImp += imp;
      cur.nClk += clk;
    }
    queryAcc.set(r.query, cur);
  }
  const queryGap: QueryGapRow[] = Array.from(queryAcc.entries())
    .map(([query, v]) => ({
      query,
      bucket: classify(v.gImp, v.nImp),
      googleImpressions: v.gImp,
      googleClicks: v.gClk,
      naverImpressions: v.nImp,
      naverClicks: v.nClk,
      totalImpressions: v.gImp + v.nImp,
    }))
    // 둘 다 0 인 row 는 제외 (다른 source · 데이터 없음)
    .filter((r) => r.totalImpressions > 0);

  // page → bucket
  const pageAcc = new Map<string, { gImp: number; gClk: number; nImp: number; nClk: number }>();
  for (const r of pageRows) {
    const cur = pageAcc.get(r.page_url) ?? { gImp: 0, gClk: 0, nImp: 0, nClk: 0 };
    const imp = Number(r.impressions);
    const clk = Number(r.clicks);
    if (isGoogleSource(r.source)) {
      cur.gImp += imp;
      cur.gClk += clk;
    } else if (isNaverSource(r.source)) {
      cur.nImp += imp;
      cur.nClk += clk;
    }
    pageAcc.set(r.page_url, cur);
  }
  const pageGap: PageGapRow[] = Array.from(pageAcc.entries())
    .map(([pageUrl, v]) => ({
      pageUrl,
      bucket: classify(v.gImp, v.nImp),
      googleImpressions: v.gImp,
      googleClicks: v.gClk,
      naverImpressions: v.nImp,
      naverClicks: v.nClk,
      totalImpressions: v.gImp + v.nImp,
    }))
    .filter((r) => r.totalImpressions > 0);

  const queryCounts: Record<GapBucket, number> = { ...EMPTY_COUNTS };
  for (const q of queryGap) queryCounts[q.bucket] += 1;
  const pageCounts: Record<GapBucket, number> = { ...EMPTY_COUNTS };
  for (const p of pageGap) pageCounts[p.bucket] += 1;

  const topQueries = [...queryGap]
    .sort((a, b) => b.totalImpressions - a.totalImpressions)
    .slice(0, topLimit);
  const topPages = [...pageGap]
    .sort((a, b) => b.totalImpressions - a.totalImpressions)
    .slice(0, topLimit);

  return {
    range: { startDate, endDate },
    queryCounts,
    pageCounts,
    topQueries,
    topPages,
  };
}

/** pure helper — gap 분류만 — vitest 단위 검증용 export. */
export function classifyGap(googleImpressions: number, naverImpressions: number): GapBucket {
  return classify(googleImpressions, naverImpressions);
}
