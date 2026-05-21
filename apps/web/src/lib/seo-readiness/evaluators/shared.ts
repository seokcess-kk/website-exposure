// @glitzy/web/lib/seo-readiness/evaluators/shared — entity-agnostic check helpers
// SEO_VISIBILITY_OPS_PLAN v0.2 § 3.1

import type { ReadinessCheck } from "../types";
import type { CheckCatalogEntry } from "../catalog";

const FRESHNESS_DAYS = 30;
const SUMMARY_MIN = 80;
const SUMMARY_MAX = 200;
const INTERNAL_LINKS_MIN = 3;
const MARKDOWN_LINK_REGEX = /\[[^\]]*\]\(([^)]+)\)/g;

function entry(
  catalog: CheckCatalogEntry,
  weight: number,
  status: ReadinessCheck["status"],
  detail?: string,
): ReadinessCheck {
  return { key: catalog.key, label: catalog.label, weight, status, detail };
}

export function checkFreshness(
  catalog: CheckCatalogEntry,
  weight: number,
  updatedAt: Date | null | undefined,
): ReadinessCheck {
  if (!updatedAt) return entry(catalog, weight, "fail", "updated_at 없음");
  const ageDays = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= FRESHNESS_DAYS) return entry(catalog, weight, "pass", `${Math.round(ageDays)}일 전 업데이트`);
  return entry(catalog, weight, "fail", `${Math.round(ageDays)}일 전 업데이트 (30일 초과)`);
}

export function checkSummaryLength(
  catalog: CheckCatalogEntry,
  weight: number,
  summary: string | null | undefined,
): ReadinessCheck {
  if (!summary || summary.trim().length === 0) return entry(catalog, weight, "fail", "요약 없음");
  const len = summary.length;
  if (len < SUMMARY_MIN) return entry(catalog, weight, "warn", `${len}자 (권장 ${SUMMARY_MIN}자 이상)`);
  if (len > SUMMARY_MAX) return entry(catalog, weight, "warn", `${len}자 (권장 ${SUMMARY_MAX}자 이하)`);
  return entry(catalog, weight, "pass", `${len}자`);
}

export function checkHasAuthorDoctor(
  catalog: CheckCatalogEntry,
  weight: number,
  authorDoctorId: string | null | undefined,
): ReadinessCheck {
  return authorDoctorId
    ? entry(catalog, weight, "pass")
    : entry(catalog, weight, "fail", "의료진 미연결");
}

export function checkInternalLinks(
  catalog: CheckCatalogEntry,
  weight: number,
  bodyMarkdown: string | null | undefined,
  instanceSlug: string,
): ReadinessCheck {
  if (!bodyMarkdown) return entry(catalog, weight, "fail", "본문 없음");
  const matches = [...bodyMarkdown.matchAll(MARKDOWN_LINK_REGEX)];
  const internal = matches.filter((m) => {
    const url = m[1] ?? "";
    return url.startsWith(`/${instanceSlug}/`) || url.startsWith(`/${instanceSlug}`);
  });
  if (internal.length >= INTERNAL_LINKS_MIN) return entry(catalog, weight, "pass", `${internal.length}개 내부 링크`);
  return entry(catalog, weight, "fail", `${internal.length}/${INTERNAL_LINKS_MIN}개 내부 링크`);
}

export function checkTitleHasKeyword(
  catalog: CheckCatalogEntry,
  weight: number,
  title: string | null | undefined,
  primaryKeywordLabels: string[],
): ReadinessCheck {
  if (!title) return entry(catalog, weight, "fail", "제목 없음");
  if (primaryKeywordLabels.length === 0) return entry(catalog, weight, "warn", "primary 키워드 미정의");
  const hit = primaryKeywordLabels.find((k) => title.includes(k));
  return hit
    ? entry(catalog, weight, "pass", `'${hit}' 포함`)
    : entry(catalog, weight, "fail", `${primaryKeywordLabels.length}개 primary 키워드 모두 미포함`);
}

export type LinkCount = { publishedCount: number; draftCount: number };

/**
 * 근거 link 검사 — EVIDENCE_LINKING_PLAN v0.2 § 6.1 draft/published 분기 정합.
 *   - published 1건+ → pass
 *   - draft 만 있음 → warn (운영자에게 "target 게시 필요" 신호)
 *   - 둘 다 0 → fail
 */
export function checkHasEvidenceLink(
  catalog: CheckCatalogEntry,
  weight: number,
  count: LinkCount,
): ReadinessCheck {
  if (count.publishedCount > 0) {
    return entry(catalog, weight, "pass", `${count.publishedCount}개 공개 근거 연결`);
  }
  if (count.draftCount > 0) {
    return entry(catalog, weight, "warn", `${count.draftCount}개 근거가 미발행 (공개 페이지엔 표시 안 됨)`);
  }
  return entry(catalog, weight, "fail", "논문/미디어 근거 미연결");
}

export function checkHasRelatedFaq(
  catalog: CheckCatalogEntry,
  weight: number,
  count: LinkCount,
): ReadinessCheck {
  if (count.publishedCount > 0) {
    return entry(catalog, weight, "pass", `${count.publishedCount}개 공개 FAQ 연결`);
  }
  if (count.draftCount > 0) {
    return entry(catalog, weight, "warn", `${count.draftCount}개 FAQ 가 미발행`);
  }
  return entry(catalog, weight, "fail", "관련 FAQ 미연결");
}
