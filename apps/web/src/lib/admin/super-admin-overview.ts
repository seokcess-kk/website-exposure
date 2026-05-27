// @glitzy/web/lib/admin/super-admin-overview — cross-instance KPI loader (운영자 상위 dashboard)
//
// 모든 instance 의 운영 건강도 KPI 를 한 번에 aggregate.
// admin role 직접 query (WEB_DATABASE_URL 가 admin URL · CLAUDE.md "데모 한정 보안 trade-off") — /admin page 와 동일 패턴.
// super-admin 시 전체 instance · operator 시 본인 멤버 instance 만 (filter 는 caller 의 instance ID list 안 명시).

import type postgres from "postgres";

export type ContractStatus = "trial" | "active" | "suspended" | "terminated";

export type InstanceContractInfo = {
  status: ContractStatus;
  planTier: string;
  endDate: Date | null;
};

export type InstanceOverview = {
  instanceId: string;
  /** GSC/NSA property 등록 수 (0 = 미연결 — super-admin 조치 필요) */
  searchPropertyCount: number;
  /** 정책 문서 5종 (privacy·terms·non-covered·refund·complaint) 안 published count (0~5) */
  legalPublishedCount: number;
  /** seo_readiness_snapshot 안 grade C/D/F count (개선 필요 entity) */
  readinessLowCount: number;
  /** 모든 콘텐츠 (7 entity) max(updated_at) — 30일 + 전이면 휴면 클라이언트 신호 */
  lastUpdatedAt: Date | null;
  /** 7일 search visibility (GSC + NSA aggregate) */
  visibility7days: { clicks: number; impressions: number };
  /** 이번달 LLM cost (status='success' 만 — KST 월 경계) */
  llmCostMonthly: number;
  /** 7일 conversion event count */
  conversion7days: number;
  /** clinic_profile.metadata 안 naverPlace.placeId 존재 여부 */
  naverPlaceSet: boolean;
  /** ADMIN_BUSINESS_ENTITIES v1 § 2 — 계약 정보 (없으면 null) */
  contract: InstanceContractInfo | null;
};

export type SuperAdminTotals = {
  unconnectedPropertyCount: number;
  legalIncompleteCount: number;
  staleCount: number;
  readinessLowSum: number;
  visibility7daysSum: { clicks: number; impressions: number };
  llmCostMonthlySum: number;
  conversion7daysSum: number;
  naverPlaceMissingCount: number;
  /** 계약 종료 30일 안 instance 수 (만료 임박) */
  contractExpiringSoonCount: number;
  /** suspended 또는 terminated status instance 수 */
  contractIssueCount: number;
  /** contract 없는 instance 수 */
  contractMissingCount: number;
};

const CONTRACT_EXPIRING_DAYS = 30;

const STALE_DAYS = 30;

/**
 * cross-instance KPI aggregate.
 * instanceIds 가 빈 배열이면 모든 metric 0 / 빈 Map 반환.
 */
export async function loadSuperAdminOverview(
  sql: postgres.Sql,
  instanceIds: ReadonlyArray<string>,
): Promise<{ perInstance: Map<string, InstanceOverview>; totals: SuperAdminTotals }> {
  if (instanceIds.length === 0) {
    return {
      perInstance: new Map(),
      totals: {
        unconnectedPropertyCount: 0,
        legalIncompleteCount: 0,
        staleCount: 0,
        readinessLowSum: 0,
        visibility7daysSum: { clicks: 0, impressions: 0 },
        llmCostMonthlySum: 0,
        conversion7daysSum: 0,
        naverPlaceMissingCount: 0,
        contractExpiringSoonCount: 0,
        contractIssueCount: 0,
        contractMissingCount: 0,
      },
    };
  }

  // KST 월 경계 — Asia/Seoul (UTC+9) — date_trunc 안 timezone aware
  const ids = instanceIds.map((id) => id);

  // 9 query 병렬 — 각 instance 별 aggregate row
  const [
    propertyRows,
    legalRows,
    readinessRows,
    activityRows,
    visibilityRows,
    llmRows,
    conversionRows,
    clinicRows,
    contractRows,
  ] = await Promise.all([
    sql<{ instance_id: string; cnt: string }[]>`
      SELECT instance_id, count(*)::text AS cnt
        FROM search_property
       WHERE instance_id = ANY(${ids}::uuid[])
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; cnt: string }[]>`
      SELECT instance_id, count(*)::text AS cnt
        FROM legal_document
       WHERE instance_id = ANY(${ids}::uuid[])
         AND status = 'published'
         AND document_type IN ('privacy','terms','non-covered','refund','complaint')
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; cnt: string }[]>`
      SELECT instance_id, count(*)::text AS cnt
        FROM seo_readiness_snapshot
       WHERE instance_id = ANY(${ids}::uuid[])
         AND grade IN ('C','D','F')
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; last_at: Date | null }[]>`
      SELECT instance_id, MAX(updated_at) AS last_at
        FROM (
          SELECT instance_id, updated_at FROM article          WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM treatment_page   WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM faq              WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM publication      WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM media_appearance WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM doctor_profile   WHERE instance_id = ANY(${ids}::uuid[])
          UNION ALL
          SELECT instance_id, updated_at FROM clinic_profile   WHERE instance_id = ANY(${ids}::uuid[])
        ) u
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; clicks: string; impressions: string }[]>`
      SELECT instance_id,
             COALESCE(SUM(clicks),0)::text AS clicks,
             COALESCE(SUM(impressions),0)::text AS impressions
        FROM search_visibility_snapshot
       WHERE instance_id = ANY(${ids}::uuid[])
         AND snapshot_date >= (CURRENT_DATE - INTERVAL '7 days')
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; cost_sum: string }[]>`
      SELECT instance_id, COALESCE(SUM(cost_usd),0)::text AS cost_sum
        FROM llm_call_log
       WHERE instance_id = ANY(${ids}::uuid[])
         AND status = 'success'
         AND created_at >= date_trunc('month', (now() AT TIME ZONE 'Asia/Seoul')) AT TIME ZONE 'Asia/Seoul'
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; cnt: string }[]>`
      SELECT instance_id, count(*)::text AS cnt
        FROM conversion_event
       WHERE instance_id = ANY(${ids}::uuid[])
         AND created_at >= (now() - INTERVAL '7 days')
       GROUP BY instance_id
    `,
    sql<{ instance_id: string; has_place: boolean }[]>`
      SELECT instance_id,
             (metadata #>> '{naverPlace,placeId}') IS NOT NULL AS has_place
        FROM clinic_profile
       WHERE instance_id = ANY(${ids}::uuid[]) AND slug = 'clinic'
    `,
    // ADMIN_BUSINESS_ENTITIES v1 § 2 — contract row (없으면 row 없음). table 미존재 시 silent 무시.
    sql<{ instance_id: string; status: string; plan_tier: string; end_date: Date | null }[]>`
      SELECT instance_id, status, plan_tier, end_date
        FROM instance_contract
       WHERE instance_id = ANY(${ids}::uuid[])
    `.catch(() => [] as { instance_id: string; status: string; plan_tier: string; end_date: Date | null }[]),
  ]);

  const propertyMap = new Map(propertyRows.map((r) => [r.instance_id, Number(r.cnt)]));
  const legalMap = new Map(legalRows.map((r) => [r.instance_id, Number(r.cnt)]));
  const readinessMap = new Map(readinessRows.map((r) => [r.instance_id, Number(r.cnt)]));
  const activityMap = new Map(activityRows.map((r) => [r.instance_id, r.last_at]));
  const visibilityMap = new Map(visibilityRows.map((r) => [r.instance_id, { clicks: Number(r.clicks), impressions: Number(r.impressions) }]));
  const llmMap = new Map(llmRows.map((r) => [r.instance_id, Number(r.cost_sum)]));
  const conversionMap = new Map(conversionRows.map((r) => [r.instance_id, Number(r.cnt)]));
  const placeMap = new Map(clinicRows.map((r) => [r.instance_id, r.has_place]));
  const contractMap = new Map<string, InstanceContractInfo>(
    contractRows.map((r) => [
      r.instance_id,
      {
        status: r.status as ContractStatus,
        planTier: r.plan_tier,
        endDate: r.end_date,
      },
    ]),
  );

  const perInstance = new Map<string, InstanceOverview>();
  const now = Date.now();
  const staleThresholdMs = STALE_DAYS * 24 * 60 * 60 * 1000;

  for (const id of ids) {
    perInstance.set(id, {
      instanceId: id,
      searchPropertyCount: propertyMap.get(id) ?? 0,
      legalPublishedCount: legalMap.get(id) ?? 0,
      readinessLowCount: readinessMap.get(id) ?? 0,
      lastUpdatedAt: activityMap.get(id) ?? null,
      visibility7days: visibilityMap.get(id) ?? { clicks: 0, impressions: 0 },
      llmCostMonthly: llmMap.get(id) ?? 0,
      conversion7days: conversionMap.get(id) ?? 0,
      naverPlaceSet: placeMap.get(id) ?? false,
      contract: contractMap.get(id) ?? null,
    });
  }

  // cross-instance totals
  const expiringThreshold = now + CONTRACT_EXPIRING_DAYS * 24 * 60 * 60 * 1000;
  const totals: SuperAdminTotals = {
    unconnectedPropertyCount: 0,
    legalIncompleteCount: 0,
    staleCount: 0,
    readinessLowSum: 0,
    visibility7daysSum: { clicks: 0, impressions: 0 },
    llmCostMonthlySum: 0,
    conversion7daysSum: 0,
    naverPlaceMissingCount: 0,
    contractExpiringSoonCount: 0,
    contractIssueCount: 0,
    contractMissingCount: 0,
  };
  for (const ov of perInstance.values()) {
    if (ov.searchPropertyCount === 0) totals.unconnectedPropertyCount++;
    if (ov.legalPublishedCount < 5) totals.legalIncompleteCount++;
    if (
      ov.lastUpdatedAt === null ||
      now - ov.lastUpdatedAt.getTime() > staleThresholdMs
    )
      totals.staleCount++;
    totals.readinessLowSum += ov.readinessLowCount;
    totals.visibility7daysSum.clicks += ov.visibility7days.clicks;
    totals.visibility7daysSum.impressions += ov.visibility7days.impressions;
    totals.llmCostMonthlySum += ov.llmCostMonthly;
    totals.conversion7daysSum += ov.conversion7days;
    if (!ov.naverPlaceSet) totals.naverPlaceMissingCount++;

    // 계약 합산
    if (ov.contract === null) {
      totals.contractMissingCount++;
    } else {
      if (ov.contract.status === "suspended" || ov.contract.status === "terminated") {
        totals.contractIssueCount++;
      }
      if (
        ov.contract.endDate !== null &&
        ov.contract.endDate.getTime() <= expiringThreshold &&
        ov.contract.endDate.getTime() >= now
      ) {
        totals.contractExpiringSoonCount++;
      }
    }
  }

  return { perInstance, totals };
}

/**
 * 계약 status 라벨 (한글) + tier 색.
 */
export function contractStatusLabel(status: ContractStatus): string {
  switch (status) {
    case "trial":
      return "체험";
    case "active":
      return "정상";
    case "suspended":
      return "일시 정지";
    case "terminated":
      return "종료";
  }
}

/**
 * stale 여부 판정 — per-instance.
 * lastUpdatedAt 가 null 이거나 30일 + 이면 true.
 */
export function isStale(lastUpdatedAt: Date | null): boolean {
  if (lastUpdatedAt === null) return true;
  return Date.now() - lastUpdatedAt.getTime() > STALE_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * 1만 USD 미만 일 경우 USD 표시 — "$0.0123" or "$1.23"
 */
export function formatLlmCost(usd: number): string {
  if (usd === 0) return "$0";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}
