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

export function checkHasEvidenceLink(
  catalog: CheckCatalogEntry,
  weight: number,
  evidenceCount: number,
): ReadinessCheck {
  return evidenceCount > 0
    ? entry(catalog, weight, "pass", `${evidenceCount}개 근거 연결`)
    : entry(catalog, weight, "fail", "논문/미디어 근거 미연결");
}

export function checkHasRelatedFaq(
  catalog: CheckCatalogEntry,
  weight: number,
  relatedFaqCount: number,
): ReadinessCheck {
  return relatedFaqCount > 0
    ? entry(catalog, weight, "pass", `${relatedFaqCount}개 FAQ 연결`)
    : entry(catalog, weight, "fail", "관련 FAQ 미연결");
}
