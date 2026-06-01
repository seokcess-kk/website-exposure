// @glitzy/web/lib/admin/search-visibility-gap — NSI-DEFER-07 (GSC ↔ NSA gap 분석 view)
//
// search_visibility_snapshot 의 같은 query 에 대해 source 별 노출 차이를 3 분류로 정리.
//   - google-only: Google 안 노출 + 네이버 안 0
//   - naver-only:  네이버 안 노출 + Google 안 0
//   - both:        양쪽 모두 노출
// 운영자가 어느 검색엔진 안 약한지 즉시 식별 — actionable signal (JSON-LD 보강 / 네이버 플레이스 보강 등).
//
// NAVER_SEARCH_INGEST_PLAN v1.x correctness 패치 (3종 거짓 신호 제거):
//   (1) 누적 grain — NSA(naver-searchadvisor)는 'naver-top30-cumulative' 누적 집계라
//       윈도우 안 여러 snapshot_date 를 SUM 하면 이중계상. property 별 최신 snapshot_date 1개만 집계.
//       GSC(일별 grain)는 기존 합산 유지. (cumulativeLatestOnlyFragment)
//   (2) page-level gap 제거 — NSA 는 page_url 항상 sentinel '' (사이트 단위 집계)라
//       page gap 은 모든 페이지를 거짓 'google-only' 로 분류 + 거짓 hint 유발. query-level gap 만 유효.
//       (Google page 데이터는 loadVisibilitySummary.topPages 에 이미 존재 — 정보 손실 없음.)
//   (3) query 정규화 — GSC(구글 검색어) ↔ NSA(네이버 검색어) 가 띄어쓰기/대소문자/NFC 차이로
//       다른 문자열이면 'both' 가 과소계상. normalizeQueryKey 로 그룹핑(표시는 원본 보존).

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

export type GapSummary = {
  range: { startDate: string; endDate: string };
  queryCounts: Record<GapBucket, number>;
  topQueries: QueryGapRow[]; // bucket 무관 노출 큰 순 top N
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

/**
 * cross-source gap join 용 query 정규화 키 (NAVER_SEARCH_INGEST_PLAN §4.9 정합 확장).
 *
 * GSC(구글 검색어) 와 NSA(네이버 검색어) 는 같은 의도라도 표기가 갈린다 —
 * 한글 검색어에선 띄어쓰기가 지배적 차이("다이어트 한의원" vs "다이어트한의원").
 * 따라서 NFC normalize + 모든 공백 제거 + lowercase 로 키를 만든다.
 *
 * 공백 전부 제거는 "흰 머리"/"흰머리" 류 구분을 병합할 수 있으나, 검색 키워드 gap
 * 버킷팅 목적에선 같은 의도로 보는 게 옳다 (네이버·구글 모두 띄어쓰기 변형을 동일 질의로 취급).
 * 표시는 항상 원본 query 를 쓰므로 운영자 가독성은 유지된다.
 */
export function normalizeQueryKey(query: string): string {
  return query.normalize("NFC").replace(/\s+/g, "").toLowerCase();
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
  //
  // 누적 grain 보정 (패치 1): NSA(naver-searchadvisor) row 는 property 별 윈도우 내 최신
  // snapshot_date 1개만 (누적 집계 이중계상 차단). GSC 는 윈도우 전체 합산 유지.
  // (이 AND 블록은 search-visibility.ts 와 동일 — mock tx 가 tx`` 호출마다 응답 슬롯을 소비하므로
  //  공통 fragment 로 추출하지 않고 각 쿼리에 인라인한다.)
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
    GROUP BY query, source
  `;

  // query → bucket. normalizeQueryKey 로 cross-source 병합(패치 3) · 표시는 원본 query 보존.
  const queryAcc = new Map<string, {
    display: string;
    gImp: number;
    gClk: number;
    nImp: number;
    nClk: number;
  }>();
  for (const r of queryRows) {
    const key = normalizeQueryKey(r.query);
    const cur = queryAcc.get(key) ?? { display: r.query, gImp: 0, gClk: 0, nImp: 0, nClk: 0 };
    const imp = Number(r.impressions);
    const clk = Number(r.clicks);
    if (isGoogleSource(r.source)) {
      cur.gImp += imp;
      cur.gClk += clk;
    } else if (isNaverSource(r.source)) {
      cur.nImp += imp;
      cur.nClk += clk;
    }
    queryAcc.set(key, cur);
  }
  const queryGap: QueryGapRow[] = Array.from(queryAcc.values())
    .map((v) => ({
      query: v.display,
      bucket: classify(v.gImp, v.nImp),
      googleImpressions: v.gImp,
      googleClicks: v.gClk,
      naverImpressions: v.nImp,
      naverClicks: v.nClk,
      totalImpressions: v.gImp + v.nImp,
    }))
    // 둘 다 0 인 row 는 제외 (다른 source · 데이터 없음)
    .filter((r) => r.totalImpressions > 0);

  const queryCounts: Record<GapBucket, number> = { ...EMPTY_COUNTS };
  for (const q of queryGap) queryCounts[q.bucket] += 1;

  const topQueries = [...queryGap]
    .sort((a, b) => b.totalImpressions - a.totalImpressions)
    .slice(0, topLimit);

  return {
    range: { startDate, endDate },
    queryCounts,
    topQueries,
  };
}

/** pure helper — gap 분류만 — vitest 단위 검증용 export. */
export function classifyGap(googleImpressions: number, naverImpressions: number): GapBucket {
  return classify(googleImpressions, naverImpressions);
}
