// @glitzy/web/lib/admin/__tests__/today-actions — Option A v1.0
// selectTodayActions — count 큰 순 top 3 + 0 정렬 + priority 동률.

import { describe, it, expect } from "vitest";
import { selectTodayActions } from "../today-actions";
import type { ImprovementQueueOverview, ImprovementQueueItem } from "../improvement-queue";

function makeItem(slug: string): ImprovementQueueItem {
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

function makeQueue(counts: Partial<Record<keyof Omit<ImprovementQueueOverview, "totalImprovementItems" | "affectedEntityCount" | "healthyCount">, number>>): ImprovementQueueOverview {
  const items = (n: number) => Array.from({ length: n }, (_, i) => makeItem(`a-${i}`));
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

const SLUG = "demo";

describe("selectTodayActions", () => {
  it("0 카테고리 모두 비어있으면 빈 배열", () => {
    expect(selectTodayActions(makeQueue({}), SLUG)).toEqual([]);
  });

  it("1 카테고리만 — 1 action 반환", () => {
    const actions = selectTodayActions(makeQueue({ stale: 5 }), SLUG);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({ category: "stale", count: 5 });
    expect(actions[0]?.href).toBe(`/admin/${SLUG}/improvement-queue#stale`);
    expect(actions[0]?.title).toMatch(/30일\+/);
  });

  it("5 카테고리 안 count 큰 순 top 3 — 정렬 정합", () => {
    const queue = makeQueue({
      lowReadiness: 2,
      evidenceMissing: 7,
      seoImprove: 3,
      stale: 10,
      relationsThin: 1,
    });
    const actions = selectTodayActions(queue, SLUG);
    expect(actions).toHaveLength(3);
    expect(actions[0]?.category).toBe("stale"); // 10
    expect(actions[1]?.category).toBe("evidence-missing"); // 7
    expect(actions[2]?.category).toBe("seo-improve"); // 3
  });

  it("동률 시 priority (low-readiness > evidence-missing > seo-improve > stale > relations-thin)", () => {
    const queue = makeQueue({
      lowReadiness: 5,
      evidenceMissing: 5,
      stale: 5,
    });
    const actions = selectTodayActions(queue, SLUG);
    expect(actions).toHaveLength(3);
    // 동률 시 priority 순 — Array.sort 안정성 + PRIORITY 순서로 입력했으므로 정렬 후 같음
    expect(actions.map((a) => a.category)).toEqual([
      "low-readiness",
      "evidence-missing",
      "stale",
    ]);
  });

  it("href anchor 매핑 — 모든 5 카테고리", () => {
    const queue = makeQueue({
      lowReadiness: 1,
      evidenceMissing: 1,
      seoImprove: 1,
      stale: 1,
      relationsThin: 1,
    });
    const actions = selectTodayActions(queue, SLUG);
    expect(actions).toHaveLength(3); // top 3 만
    for (const a of actions) {
      expect(a.href).toBe(`/admin/${SLUG}/improvement-queue#${a.category}`);
    }
  });

  it("title 안 count 안 포함", () => {
    const queue = makeQueue({ lowReadiness: 7 });
    const actions = selectTodayActions(queue, SLUG);
    expect(actions[0]?.title).toContain("7");
    expect(actions[0]?.title).toContain("건");
  });

  it("instanceSlug interpolation", () => {
    const queue = makeQueue({ stale: 1 });
    const actions = selectTodayActions(queue, "my-clinic");
    expect(actions[0]?.href).toBe("/admin/my-clinic/improvement-queue#stale");
  });
});
