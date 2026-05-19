// @glitzy/web/lib/admin/quality-score — ADMIN_UX_REDESIGN v1.0 § 11.1
// 품질 점수 4 카테고리 가중치 합산:
//   - 출시 권장 lint (§ 3.2 8 룰): 30%
//   - E-A-T 신호 (Publication + MediaAppearance + 의료진 약력): 30%
//   - SEO 신호 (sitemap entry · article published count): 20%
//   - 컴플라이언스 신호 (finding count): 20%

import { resolveHref, RECOMMENDED_LINTS, type LintRuleId } from "./release-lint-catalog";
import type { InstanceEvalInput } from "./release-evaluator";

export type QualityScoreInput = InstanceEvalInput & {
  /** compliance finding count (entity 별 합산 · severity 무관). 0 ~ N */
  complianceFindings: Array<{ ruleId: string; severity: "fail" | "content-gate" | "warning" | "info" }>;
  /** sitemap.xml 안 entry 수 (instance 별 SELECT count) */
  sitemapEntryCount: number;
  /** warning 큐 진입 entry 수 */
  warningQueueOpenCount: number;
};

export type QualityScore = {
  total: number;
  breakdown: {
    recommended: number;
    eat: number;
    seo: number;
    compliance: number;
  };
  suggestions: Array<{
    id: string;
    label: string;
    pointsGain: number;
    href: string;
  }>;
};

export function computeQualityScore(input: QualityScoreInput): QualityScore {
  // === (1) 출시 권장 (30점 max) ===
  // recommendedItems 통과 비율 * 30
  const recommendedTotalWeight = RECOMMENDED_LINTS.reduce((s, r) => s + r.weight, 0);
  // 통과 = 전체 - failedRecommended
  // failed 가중치 산정 — § release-evaluator computeRecommendedLintItems 안 동일 logic 안 reuse
  const failedRecommendedScore = computeFailedRecommendedWeight(input);
  const recommendedPassRatio = recommendedTotalWeight === 0 ? 1 : Math.max(0, 1 - failedRecommendedScore / recommendedTotalWeight);
  const recommendedScore = Math.round(recommendedPassRatio * 30);

  // === (2) E-A-T 신호 (30점 max) ===
  // Publication 수: 0=0 · 1~2=10 · 3~4=20 · 5+=30 (가중치 만점 시 비례 산정)
  const pubCount = input.publications.filter((p) => p.status === "published").length;
  const mediaCount = input.media.filter((m) => m.status === "published").length;
  const activeDocs = input.doctors.filter((d) => d.active);
  const docsWithFullBio = activeDocs.filter((d) => d.bioLength >= 300);
  const docBioRatio = activeDocs.length === 0 ? 0 : docsWithFullBio.length / activeDocs.length;
  // 각 30점 안 component 안 비례 (10 + 10 + 10):
  //   - Publication: 0 → 0 / 1~2 → 4 / 3~4 → 7 / 5+ → 10
  const pubScore = pubCount >= 5 ? 10 : pubCount >= 3 ? 7 : pubCount >= 1 ? 4 : 0;
  const mediaScore = mediaCount >= 5 ? 10 : mediaCount >= 3 ? 7 : mediaCount >= 1 ? 4 : 0;
  const docBioScore = Math.round(docBioRatio * 10);
  const eatScore = pubScore + mediaScore + docBioScore;

  // === (3) SEO 신호 (20점 max) ===
  // sitemap entry 수: 10+=5 · 20+=10 · 30+=15 · 50+=20
  //   (현재 매트릭스 단순화 — instance 안 sitemap entry 가 published entity 수 ≒)
  let sitemapScore = 0;
  if (input.sitemapEntryCount >= 50) sitemapScore = 20;
  else if (input.sitemapEntryCount >= 30) sitemapScore = 15;
  else if (input.sitemapEntryCount >= 20) sitemapScore = 10;
  else if (input.sitemapEntryCount >= 10) sitemapScore = 5;
  const seoScore = sitemapScore;

  // === (4) 컴플라이언스 신호 (20점 max) ===
  // finding count: 0=20 · 1~5=15 · 6~10=10 · 11+=0
  // warning 큐 open: 0=manfat · 1+=감점 (각 5점 감점)
  let complianceScore = 20;
  const findingCount = input.complianceFindings.filter((f) => f.severity === "fail" || f.severity === "content-gate").length;
  if (findingCount >= 11) complianceScore = 0;
  else if (findingCount >= 6) complianceScore = 10;
  else if (findingCount >= 1) complianceScore = 15;
  complianceScore = Math.max(0, complianceScore - input.warningQueueOpenCount * 5);

  // === (5) suggestions list (정렬: pointsGain DESC) ===
  const suggestions: QualityScore["suggestions"] = [];
  const slug = input.instanceSlug;

  // recommendedItems 안 각 항목 = pointsGain (가중치 그대로)
  for (const rule of RECOMMENDED_LINTS) {
    if (isRecommendedLintFailed(rule.id, input)) {
      suggestions.push({
        id: rule.id,
        label: rule.label,
        pointsGain: Math.round(rule.weight * (30 / recommendedTotalWeight)),
        href: resolveHref(rule, slug),
      });
    }
  }
  // E-A-T 추천
  if (pubCount === 0) {
    suggestions.push({ id: "eat-publication", label: "학술 인용 (Publication) 1+ 추가", pointsGain: 4, href: `/admin/${slug}/publications` });
  }
  if (mediaCount === 0) {
    suggestions.push({ id: "eat-media", label: "MediaAppearance 1+ 추가", pointsGain: 4, href: `/admin/${slug}/media-appearances` });
  }
  // 정렬
  suggestions.sort((a, b) => b.pointsGain - a.pointsGain);

  const total = recommendedScore + eatScore + seoScore + complianceScore;

  return {
    total,
    breakdown: {
      recommended: recommendedScore,
      eat: eatScore,
      seo: seoScore,
      compliance: complianceScore,
    },
    suggestions,
  };
}

// === helper — recommendedLint 안 통과 여부 산정 ===

function computeFailedRecommendedWeight(input: InstanceEvalInput): number {
  let total = 0;
  for (const rule of RECOMMENDED_LINTS) {
    if (isRecommendedLintFailed(rule.id, input)) total += rule.weight;
  }
  return total;
}

function isRecommendedLintFailed(id: LintRuleId, input: InstanceEvalInput): boolean {
  const activeDocs = input.doctors.filter((d) => d.active);
  switch (id) {
    case "doctor-photo":
      return activeDocs.some((d) => !d.photoUrl);
    case "doctor-bio-300chars":
      return activeDocs.some((d) => d.bioLength < 300);
    case "treatment-min-three":
      return input.treatments.filter((t) => t.status === "published").length < 3;
    case "faq-min-five":
      return input.faqs.filter((f) => f.status === "published").length < 5;
    case "article-min-one-per-category": {
      if (input.categories.length === 0) return false;
      const publishedArticles = input.articles.filter((a) => a.status === "published");
      const categoriesWithArticle = new Set(publishedArticles.map((a) => a.categoryId));
      return input.categories.some((c) => !categoriesWithArticle.has(c.id));
    }
    case "publication-min-one":
      return input.publications.filter((p) => p.status === "published").length === 0;
    case "media-appearance-min-one":
      return input.media.filter((m) => m.status === "published").length === 0;
    case "multiple-cta-channels":
      return (input.clinic?.primaryCtasCount ?? 0) < 2;
    default:
      return false;
  }
}
