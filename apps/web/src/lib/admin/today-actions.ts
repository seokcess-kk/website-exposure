// @glitzy/web/lib/admin/today-actions — Option A (운영자 일상 단순화) v1.0
//
// 대시보드 안 "오늘 할 일" 카드 데이터.
// improvement-queue 5 카테고리 reuse — count 큰 순 top 3.
// pure function (selectTodayActions) + 본 모듈 안 tx 의존 없음 — vitest 안 단순 검증.

import type { ImprovementQueueOverview } from "./improvement-queue";

export type TodayActionCategory =
  | "low-readiness"
  | "evidence-missing"
  | "seo-improve"
  | "stale"
  | "relations-thin";

export type TodayAction = {
  category: TodayActionCategory;
  count: number;
  /** 운영자에게 표시되는 한국어 행동 안내. */
  title: string;
  /** improvement-queue 안 deep link (anchor 포함). */
  href: string;
};

const CATEGORY_TITLE: Record<TodayActionCategory, string> = {
  "low-readiness": "발행 중 품질 개선 대상",
  "evidence-missing": "근거 미연결 콘텐츠",
  "seo-improve": "SEO 보강 필요 (제목·요약·키워드)",
  stale: "30일+ 미업데이트 발행 콘텐츠",
  "relations-thin": "관련 콘텐츠 연결 부족",
};

const CATEGORY_ANCHOR: Record<TodayActionCategory, string> = {
  "low-readiness": "#low-readiness",
  "evidence-missing": "#evidence-missing",
  "seo-improve": "#seo-improve",
  stale: "#stale",
  "relations-thin": "#relations-thin",
};

/**
 * improvement-queue 5 카테고리 안 count 큰 순 top 3 선정.
 * 동률 시 fixed priority (low-readiness > evidence-missing > seo-improve > stale > relations-thin) 안 사용자 행동 우선순위 정합.
 */
export function selectTodayActions(
  queue: ImprovementQueueOverview,
  instanceSlug: string,
): TodayAction[] {
  const PRIORITY: TodayActionCategory[] = [
    "low-readiness",
    "evidence-missing",
    "seo-improve",
    "stale",
    "relations-thin",
  ];
  const counts: Record<TodayActionCategory, number> = {
    "low-readiness": queue.lowReadiness.length,
    "evidence-missing": queue.evidenceMissing.length,
    "seo-improve": queue.seoImprove.length,
    stale: queue.stale.length,
    "relations-thin": queue.relationsThin.length,
  };

  const all: TodayAction[] = PRIORITY.filter((c) => counts[c] > 0).map((c) => ({
    category: c,
    count: counts[c],
    title: `${CATEGORY_TITLE[c]} ${counts[c]}건`,
    href: `/admin/${instanceSlug}/improvement-queue${CATEGORY_ANCHOR[c]}`,
  }));

  // count 큰 순 정렬 (동률 시 priority 유지 — stable sort 안 PRIORITY 순서 보존)
  return [...all].sort((a, b) => b.count - a.count).slice(0, 3);
}
