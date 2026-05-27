// @glitzy/web/lib/admin/today-actions — Option A (운영자 일상 단순화) v1.0 + MTL-DEFER-04 합류
//
// 대시보드 "오늘 할 일" 카드 데이터.
// 8 source — improvement-queue 5 카테고리 (readiness 기반) + conversion-improvements 3 카테고리
// (검색·전환 데이터 기반). count 큰 순 top 3 + priority 동률 fallback.

import type { ImprovementQueueOverview } from "./improvement-queue";
import type { ConversionImprovementsOverview } from "./conversion-improvements";

export type TodayActionCategory =
  | "low-readiness"
  | "evidence-missing"
  | "seo-improve"
  | "stale"
  | "relations-thin"
  | "low-conversion-traffic"
  | "low-ctr"
  | "naver-only-weak";

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
  "low-conversion-traffic": "검색 click 있는데 전환 0인 페이지",
  "low-ctr": "네이버 top 10 노출인데 click 0인 페이지",
  "naver-only-weak": "네이버 만 노출 + 노출량 낮은 페이지",
};

const CATEGORY_ANCHOR: Record<TodayActionCategory, string> = {
  "low-readiness": "#low-readiness",
  "evidence-missing": "#evidence-missing",
  "seo-improve": "#seo-improve",
  stale: "#stale",
  "relations-thin": "#relations-thin",
  "low-conversion-traffic": "#low-conversion-traffic",
  "low-ctr": "#low-ctr",
  "naver-only-weak": "#naver-only-weak",
};

/**
 * 8 카테고리 안 count 큰 순 top 3 선정.
 *
 * 동률 시 fixed priority (readiness 5 → conversion 3 순). 운영자 행동 우선순위 정합 —
 * readiness 결함 = 검색 노출 자체 가속의 근본 문제 · conversion 시그널 = 노출은 됐지만 유입·전환
 * 최적화 — readiness 먼저 해결 후 conversion 정밀화 권장.
 */
export function selectTodayActions(
  queue: ImprovementQueueOverview,
  conversion: ConversionImprovementsOverview | null,
  instanceSlug: string,
): TodayAction[] {
  const PRIORITY: TodayActionCategory[] = [
    "low-readiness",
    "evidence-missing",
    "seo-improve",
    "stale",
    "relations-thin",
    "low-conversion-traffic",
    "low-ctr",
    "naver-only-weak",
  ];
  const counts: Record<TodayActionCategory, number> = {
    "low-readiness": queue.lowReadiness.length,
    "evidence-missing": queue.evidenceMissing.length,
    "seo-improve": queue.seoImprove.length,
    stale: queue.stale.length,
    "relations-thin": queue.relationsThin.length,
    "low-conversion-traffic": conversion?.lowConversionTraffic.length ?? 0,
    "low-ctr": conversion?.lowCtr.length ?? 0,
    "naver-only-weak": conversion?.naverOnlyWeak.length ?? 0,
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
