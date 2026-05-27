// @glitzy/web/lib/admin/conversion-improvements — MTL-DEFER-04 (improvement-queue conversion 카테고리)
//
// search_visibility_snapshot + conversion_event 데이터 합쳐 3 신규 개선 카테고리.
//   - low-conversion-traffic: 검색 click 많은데 conversion 0
//   - low-ctr: 네이버 top 10 안 노출인데 click 0
//   - naver-only-weak: 네이버 만 노출 + 노출량 낮음 (noise 수준)
//
// page_url 단위 분석 — readiness 기반 ImprovementQueue 와 별 데이터 source.
// threshold 는 env 안 override 가능 (default 운영 시작 시점 보수적 값).

import type postgres from "postgres";

export type ConversionImprovementCategory =
  | "low-conversion-traffic"
  | "low-ctr"
  | "naver-only-weak";

export type ConversionImprovementItem = {
  pageUrl: string;
  /** page_url 안 첫 segment slug — UI 안 link 표시용 (entity edit 진입은 별 cycle). */
  slugHint: string | null;
  googleImpressions: number;
  googleClicks: number;
  naverImpressions: number;
  naverClicks: number;
  conversions: number;
  /** UI 안 정렬 기준 — 카테고리 별 의미가 다름 (low-conversion = clicks · low-ctr = impressions · naver-only-weak = impressions). */
  sortKey: number;
};

export type ConversionImprovementsOverview = {
  range: { startDate: string; endDate: string };
  lowConversionTraffic: ConversionImprovementItem[];
  lowCtr: ConversionImprovementItem[];
  naverOnlyWeak: ConversionImprovementItem[];
  totalItems: number;
  /** 분석 가능한 page_url 수 (svs 안 page_url <> '') */
  analyzedPageCount: number;
};

const DEFAULT_LOW_CONVERSION_CLICK_THRESHOLD = 10;
const DEFAULT_LOW_CTR_POSITION_TOP = 10;
const DEFAULT_LOW_CTR_MIN_IMPRESSIONS = 5;
const DEFAULT_NAVER_ONLY_WEAK_MAX_IMPRESSIONS = 20;
const DEFAULT_TOP_LIMIT = 30;

function envInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const EMPTY_OVERVIEW: ConversionImprovementsOverview = {
  range: { startDate: "", endDate: "" },
  lowConversionTraffic: [],
  lowCtr: [],
  naverOnlyWeak: [],
  totalItems: 0,
  analyzedPageCount: 0,
};

function extractSlugHint(pageUrl: string): string | null {
  if (!pageUrl) return null;
  // /[instanceSlug]/<entity-prefix>/<slug> 형태 기대. 마지막 segment.
  const trimmed = pageUrl.replace(/^https?:\/\/[^/]+/, "").replace(/^\/+|\/+$/g, "");
  if (!trimmed) return null;
  const segments = trimmed.split("/");
  return segments[segments.length - 1] ?? null;
}

export async function loadConversionImprovements(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { days?: number; topLimit?: number } = {},
): Promise<ConversionImprovementsOverview> {
  const days = options.days ?? 7;
  const topLimit = options.topLimit ?? DEFAULT_TOP_LIMIT;
  const lowConversionClickThreshold = envInt(
    "MTL_LOW_CONVERSION_CLICK_THRESHOLD",
    DEFAULT_LOW_CONVERSION_CLICK_THRESHOLD,
  );
  const lowCtrPositionTop = envInt("MTL_LOW_CTR_POSITION_TOP", DEFAULT_LOW_CTR_POSITION_TOP);
  const lowCtrMinImpressions = envInt("MTL_LOW_CTR_MIN_IMPRESSIONS", DEFAULT_LOW_CTR_MIN_IMPRESSIONS);
  const naverOnlyWeakMaxImpressions = envInt(
    "MTL_NAVER_ONLY_WEAK_MAX_IMPRESSIONS",
    DEFAULT_NAVER_ONLY_WEAK_MAX_IMPRESSIONS,
  );

  const [latestRow] = await tx<Array<{ max_date: Date | null }>>`
    SELECT MAX(snapshot_date) AS max_date
      FROM search_visibility_snapshot
     WHERE instance_id = ${instanceId}::uuid
  `;
  if (!latestRow?.max_date) return EMPTY_OVERVIEW;

  const endDate = latestRow.max_date.toISOString().slice(0, 10);
  const startDateObj = new Date(latestRow.max_date);
  startDateObj.setUTCDate(startDateObj.getUTCDate() - (days - 1));
  const startDate = startDateObj.toISOString().slice(0, 10);

  // page_url 별 source 별 합계 (gap 분석 query 답습 · positionUnavailable=true 안 avg_position 제외).
  const pageRows = await tx<Array<{
    page_url: string;
    source: string;
    impressions: string;
    clicks: string;
    weighted_position: string;
    position_denom: string;
  }>>`
    SELECT
      page_url, source,
      SUM(impressions)::bigint AS impressions,
      SUM(clicks)::bigint AS clicks,
      SUM(CASE
        WHEN COALESCE((metadata->>'positionUnavailable')::boolean, false) THEN 0
        ELSE avg_position * impressions
      END)::numeric AS weighted_position,
      SUM(CASE
        WHEN COALESCE((metadata->>'positionUnavailable')::boolean, false) THEN 0
        ELSE impressions
      END)::bigint AS position_denom
    FROM search_visibility_snapshot
    WHERE instance_id = ${instanceId}::uuid
      AND snapshot_date BETWEEN ${startDate}::date AND ${endDate}::date
      AND page_url <> ''
    GROUP BY page_url, source
  `;

  // conversion_event 합계 (page_path 별)
  const conversionRows = await tx<Array<{ page_path: string; cnt: string }>>`
    SELECT page_path, COUNT(*)::bigint AS cnt
      FROM conversion_event
     WHERE instance_id = ${instanceId}::uuid
       AND created_at >= ${startDate}::date AT TIME ZONE 'Asia/Seoul'
       AND created_at <  (${endDate}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Seoul'
     GROUP BY page_path
  `;

  type PageAgg = {
    gImp: number;
    gClk: number;
    nImp: number;
    nClk: number;
    naverWeightedPosSum: number;
    naverPosDenom: number;
  };
  const pageAcc = new Map<string, PageAgg>();
  for (const r of pageRows) {
    const cur = pageAcc.get(r.page_url) ?? {
      gImp: 0,
      gClk: 0,
      nImp: 0,
      nClk: 0,
      naverWeightedPosSum: 0,
      naverPosDenom: 0,
    };
    const imp = Number(r.impressions);
    const clk = Number(r.clicks);
    if (r.source === "google-search-console") {
      cur.gImp += imp;
      cur.gClk += clk;
    } else if (r.source === "naver-searchadvisor") {
      cur.nImp += imp;
      cur.nClk += clk;
      cur.naverWeightedPosSum += Number(r.weighted_position);
      cur.naverPosDenom += Number(r.position_denom);
    }
    pageAcc.set(r.page_url, cur);
  }

  /**
   * pageUrl 의 path 부분 만 추출 — conversion_event.page_path 가 path 형식 (/[instanceSlug]/...) 라
   * svs.page_url 의 https:// host 부분 제거 후 매칭.
   */
  const conversionByPath = new Map<string, number>();
  for (const c of conversionRows) {
    conversionByPath.set(c.page_path, Number(c.cnt));
  }
  function lookupConversions(pageUrl: string): number {
    const path = pageUrl.replace(/^https?:\/\/[^/]+/, "") || pageUrl;
    return conversionByPath.get(path) ?? 0;
  }

  const lowConversionItems: ConversionImprovementItem[] = [];
  const lowCtrItems: ConversionImprovementItem[] = [];
  const naverOnlyWeakItems: ConversionImprovementItem[] = [];

  for (const [pageUrl, v] of pageAcc.entries()) {
    const totalClicks = v.gClk + v.nClk;
    const totalImpressions = v.gImp + v.nImp;
    const conversions = lookupConversions(pageUrl);
    const naverAvgPosition = v.naverPosDenom > 0 ? v.naverWeightedPosSum / v.naverPosDenom : 0;
    const base: Omit<ConversionImprovementItem, "sortKey"> = {
      pageUrl,
      slugHint: extractSlugHint(pageUrl),
      googleImpressions: v.gImp,
      googleClicks: v.gClk,
      naverImpressions: v.nImp,
      naverClicks: v.nClk,
      conversions,
    };

    // low-conversion-traffic — clicks ≥ threshold + conversion = 0
    if (totalClicks >= lowConversionClickThreshold && conversions === 0) {
      lowConversionItems.push({ ...base, sortKey: totalClicks });
    }

    // low-ctr — naver position ≤ top + naver impressions ≥ min + naver clicks = 0
    if (
      naverAvgPosition > 0 &&
      naverAvgPosition <= lowCtrPositionTop &&
      v.nImp >= lowCtrMinImpressions &&
      v.nClk === 0
    ) {
      lowCtrItems.push({ ...base, sortKey: v.nImp });
    }

    // naver-only-weak — Google 0 + naver imp > 0 + naver imp < threshold
    if (v.gImp === 0 && v.nImp > 0 && v.nImp < naverOnlyWeakMaxImpressions) {
      naverOnlyWeakItems.push({ ...base, sortKey: v.nImp });
    }
  }

  const sortDesc = (a: ConversionImprovementItem, b: ConversionImprovementItem) => b.sortKey - a.sortKey;
  const lowConversionTraffic = [...lowConversionItems].sort(sortDesc).slice(0, topLimit);
  const lowCtr = [...lowCtrItems].sort(sortDesc).slice(0, topLimit);
  const naverOnlyWeak = [...naverOnlyWeakItems].sort(sortDesc).slice(0, topLimit);

  const totalItems = lowConversionTraffic.length + lowCtr.length + naverOnlyWeak.length;

  return {
    range: { startDate, endDate },
    lowConversionTraffic,
    lowCtr,
    naverOnlyWeak,
    totalItems,
    analyzedPageCount: pageAcc.size,
  };
}
