// @glitzy/web/lib/admin/__tests__/today-actions — Option A v1.0 + MTL-DEFER-04 합류
// selectTodayActions — readiness 5 + conversion 3 카테고리 top 3 + priority.

import { describe, it, expect } from "vitest";
import { selectTodayActions } from "../today-actions";
import type { ImprovementQueueOverview, ImprovementQueueItem } from "../improvement-queue";
import type { ConversionImprovementsOverview, ConversionImprovementItem } from "../conversion-improvements";

function makeReadinessItem(slug: string): ImprovementQueueItem {
  return {
    entityType: "Article",
    entityId: `${slug}-id`,
    slug,
    title: `Title ${slug}`,
    status: "published",
    score: 60,
    grade: "C",
    failedChecks: [],
  };
}

function makeConversionItem(pageUrl: string): ConversionImprovementItem {
  return {
    pageUrl,
    slugHint: pageUrl.split("/").pop() ?? null,
    googleImpressions: 0,
    googleClicks: 0,
    naverImpressions: 0,
    naverClicks: 0,
    conversions: 0,
    sortKey: 0,
  };
}

function makeQueue(
  counts: Partial<Record<keyof Omit<ImprovementQueueOverview, "totalImprovementItems" | "affectedEntityCount" | "healthyCount">, number>>,
): ImprovementQueueOverview {
  const items = (n: number) => Array.from({ length: n }, (_, i) => makeReadinessItem(`a-${i}`));
  return {
    lowReadiness: items(counts.lowReadiness ?? 0),
    evidenceMissing: items(counts.evidenceMissing ?? 0),
    seoImprove: items(counts.seoImprove ?? 0),
    stale: items(counts.stale ?? 0),
    relationsThin: items(counts.relationsThin ?? 0),
    totalImprovementItems: 0,
    affectedEntityCount: 0,
    healthyCount: 0,
  };
}

function makeConversion(
  counts: Partial<Pick<ConversionImprovementsOverview, "lowConversionTraffic" | "lowCtr" | "naverOnlyWeak">> | { lowConversionTraffic?: number; lowCtr?: number; naverOnlyWeak?: number },
): ConversionImprovementsOverview {
  const c = counts as { lowConversionTraffic?: number; lowCtr?: number; naverOnlyWeak?: number };
  const items = (n: number) => Array.from({ length: n }, (_, i) => makeConversionItem(`/p-${i}`));
  return {
    range: { startDate: "2026-05-20", endDate: "2026-05-27" },
    lowConversionTraffic: items(c.lowConversionTraffic ?? 0),
    lowCtr: items(c.lowCtr ?? 0),
    naverOnlyWeak: items(c.naverOnlyWeak ?? 0),
    totalItems: 0,
    analyzedPageCount: 0,
  };
}

const SLUG = "demo";

describe("selectTodayActions", () => {
  it("0 카테고리 모두 비어있으면 빈 배열", () => {
    expect(selectTodayActions(makeQueue({}), null, SLUG)).toEqual([]);
  });

  it("conversion = null + readiness 0 → 빈 배열", () => {
    expect(selectTodayActions(makeQueue({}), null, SLUG)).toEqual([]);
  });

  it("1 readiness 카테고리만 — 1 action 반환", () => {
    const actions = selectTodayActions(makeQueue({ stale: 5 }), null, SLUG);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({ category: "stale", count: 5 });
    expect(actions[0]?.href).toBe(`/admin/${SLUG}/improvement-queue#stale`);
  });

  it("1 conversion 카테고리만 — 1 action 반환 + #anchor 매핑", () => {
    const actions = selectTodayActions(
      makeQueue({}),
      makeConversion({ lowConversionTraffic: 4 }),
      SLUG,
    );
    expect(actions).toHaveLength(1);
    expect(actions[0]?.category).toBe("low-conversion-traffic");
    expect(actions[0]?.href).toBe(`/admin/${SLUG}/improvement-queue#low-conversion-traffic`);
  });

  it("readiness + conversion mix — count 큰 순 top 3", () => {
    const queue = makeQueue({
      lowReadiness: 2,
      evidenceMissing: 7,
      stale: 10,
    });
    const conv = makeConversion({
      lowConversionTraffic: 15,
      naverOnlyWeak: 1,
    });
    const actions = selectTodayActions(queue, conv, SLUG);
    expect(actions).toHaveLength(3);
    expect(actions[0]?.category).toBe("low-conversion-traffic"); // 15
    expect(actions[1]?.category).toBe("stale"); // 10
    expect(actions[2]?.category).toBe("evidence-missing"); // 7
  });

  it("readiness priority — 동률 시 readiness 가 conversion 우선", () => {
    const queue = makeQueue({ stale: 5 });
    const conv = makeConversion({ lowConversionTraffic: 5 });
    const actions = selectTodayActions(queue, conv, SLUG);
    expect(actions).toHaveLength(2);
    // stale (readiness · 4번째 priority) vs low-conversion-traffic (conversion · 6번째 priority)
    // 동률 시 stable sort 안 PRIORITY 순서 — stale 먼저
    expect(actions[0]?.category).toBe("stale");
    expect(actions[1]?.category).toBe("low-conversion-traffic");
  });

  it("8 카테고리 모두 있을 때 — top 3 만", () => {
    const queue = makeQueue({
      lowReadiness: 1,
      evidenceMissing: 2,
      seoImprove: 3,
      stale: 4,
      relationsThin: 5,
    });
    const conv = makeConversion({
      lowConversionTraffic: 6,
      lowCtr: 7,
      naverOnlyWeak: 8,
    });
    const actions = selectTodayActions(queue, conv, SLUG);
    expect(actions).toHaveLength(3);
    expect(actions[0]?.category).toBe("naver-only-weak"); // 8
    expect(actions[1]?.category).toBe("low-ctr"); // 7
    expect(actions[2]?.category).toBe("low-conversion-traffic"); // 6
  });

  it("instanceSlug interpolation", () => {
    const queue = makeQueue({ stale: 1 });
    const actions = selectTodayActions(queue, null, "my-clinic");
    expect(actions[0]?.href).toBe("/admin/my-clinic/improvement-queue#stale");
  });

  it("conversion anchor 매핑 — 3 카테고리 모두 정합", () => {
    const conv = makeConversion({
      lowConversionTraffic: 1,
      lowCtr: 1,
      naverOnlyWeak: 1,
    });
    const actions = selectTodayActions(makeQueue({}), conv, SLUG);
    expect(actions).toHaveLength(3);
    for (const a of actions) {
      expect(a.href).toBe(`/admin/${SLUG}/improvement-queue#${a.category}`);
    }
  });
});
