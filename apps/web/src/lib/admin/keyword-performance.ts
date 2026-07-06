// @glitzy/web/lib/admin/keyword-performance — 타깃 키워드 × 실제 검색 성과 조인 (NAVER_EXPOSURE Tier 2)
//
// keyword_target.label ↔ search_visibility_snapshot.query 를 normalizeQueryKey 로 정규화해
// 애플리케이션-레벨 LEFT JOIN 한다. 윈도우(endDate=MAX(snapshot_date))·NSA 누적 grain 이중계상 차단·
// positionUnavailable 규약은 loadVisibilitySummary(search-visibility.ts)를 그대로 답습.
//
// 한계(의도적): 정규화(NFC+공백제거+lowercase) 후 '정확 일치'만 매칭한다. label 은 마케팅 라벨이고
// query 는 유저가 실제 입력한 문자열이라, 문자열이 같아야만 붙어 다수 키워드가 '데이터 없음'일 수 있다
// (부분포함·다중어 매칭은 후속 과제).

import type postgres from "postgres";
import type { SearchSource } from "@glitzy/core-content";
import { aggregateWeightedFiltered } from "./search-visibility";
import { normalizeQueryKey } from "./search-visibility-gap";

export type KeywordPerformance = {
  impressions: number;
  clicks: number;
  ctr: number;
  /** impression-weighted 평균 순위. 0 = 순위 데이터 없음(positionUnavailable 전량 등). */
  avgPosition: number;
  hasData: boolean;
};

export type KeywordPerformanceResult = {
  range: { startDate: string; endDate: string };
  /** normalizeQueryKey(query) → 집계. keyword.label 을 같은 정규화 함수로 조회한다. */
  byQueryKey: Map<string, KeywordPerformance>;
};

/**
 * 최근 N일(default 28) 검색어별 성과 집계. source 미지정 시 GSC+네이버 합산.
 * snapshot 이 전혀 없으면 null.
 */
export async function loadKeywordPerformance(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { days?: number; source?: SearchSource | "all" } = {},
): Promise<KeywordPerformanceResult | null> {
  const { days = 28, source } = options;
  const sourceParam = source && source !== "all" ? source : null;

  const [latestRow] = await tx<Array<{ max_date: Date | null }>>`
    SELECT MAX(snapshot_date) AS max_date
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND (${sourceParam}::text IS NULL OR source = ${sourceParam}::text)
  `;
  if (!latestRow?.max_date) return null;

  const endDate = latestRow.max_date.toISOString().slice(0, 10);
  const startDateObj = new Date(latestRow.max_date);
  startDateObj.setUTCDate(startDateObj.getUTCDate() - (days - 1));
  const startDate = startDateObj.toISOString().slice(0, 10);

  // query 별 raw rows (positionUnavailable 보존). query='' (NSA site-only sentinel) 제외.
  // NSA 누적 grain: property 별 윈도우 최신 snapshot_date 1개만 (search-visibility.ts 와 동일 AND 블록 인라인 —
  //  mock tx 가 tx`` 호출마다 응답 슬롯을 소비하므로 공통 fragment 로 추출하지 않는다).
  const rows = await tx<Array<{
    query: string;
    impressions: number;
    clicks: number;
    avg_position: string;
    position_unavailable: boolean;
  }>>`
    SELECT query, impressions, clicks, avg_position,
           COALESCE((metadata->>'positionUnavailable')::boolean, false) AS position_unavailable
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND (${sourceParam}::text IS NULL OR source = ${sourceParam}::text)
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
      AND query <> ''
      AND (
        source <> 'naver-searchadvisor'
        OR snapshot_date = (
          SELECT MAX(s2.snapshot_date)
          FROM search_visibility_snapshot s2
          WHERE s2.instance_id = search_visibility_snapshot.instance_id
            AND s2.property_id = search_visibility_snapshot.property_id
            AND s2.source = 'naver-searchadvisor'
            AND s2.snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
        )
      )
  `;

  // normalizeQueryKey 로 그룹핑 → aggregateWeightedFiltered (positionUnavailable 제외 가중평균).
  type Cell = { impressions: number; clicks: number; avgPosition: number; positionUnavailable: boolean };
  const acc = new Map<string, Cell[]>();
  for (const r of rows) {
    const key = normalizeQueryKey(r.query);
    const list = acc.get(key) ?? [];
    list.push({
      impressions: r.impressions,
      clicks: r.clicks,
      avgPosition: Number(r.avg_position),
      positionUnavailable: r.position_unavailable,
    });
    acc.set(key, list);
  }

  const byQueryKey = new Map<string, KeywordPerformance>();
  for (const [key, cells] of acc) {
    const agg = aggregateWeightedFiltered(cells);
    byQueryKey.set(key, {
      impressions: agg.impressions,
      clicks: agg.clicks,
      ctr: agg.ctr,
      avgPosition: agg.avgPosition,
      hasData: agg.impressions > 0,
    });
  }

  return { range: { startDate, endDate }, byQueryKey };
}
