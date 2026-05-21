// @glitzy/web/lib/seo-readiness/evaluators/article — Article entity readiness check
// SEO_VISIBILITY_OPS_PLAN v0.2 § 3.1

import { getApplicableChecks } from "../catalog";
import type { ReadinessCheck } from "../types";
import {
  checkFreshness,
  checkHasAuthorDoctor,
  checkHasEvidenceLink,
  checkHasRelatedFaq,
  checkInternalLinks,
  checkSummaryLength,
  checkTitleHasKeyword,
  type LinkCount,
} from "./shared";

export type ArticleEvaluatorInput = {
  row: {
    title: string | null;
    summary: string | null;
    bodyMarkdown: string | null;
    authorDoctorId: string | null;
    updatedAt: Date | null;
  };
  primaryKeywordLabels: string[];
  evidence: LinkCount;
  relatedFaq: LinkCount;
  instanceSlug: string;
};

export function evaluateArticle(input: ArticleEvaluatorInput): ReadinessCheck[] {
  const catalog = Object.fromEntries(getApplicableChecks("Article").map((c) => [c.key, c]));
  const w = (key: string) => catalog[key]!.weight.Article ?? 0;
  return [
    checkTitleHasKeyword(catalog["title-has-target-keyword"]!, w("title-has-target-keyword"),
      input.row.title, input.primaryKeywordLabels),
    checkSummaryLength(catalog["summary-length-ok"]!, w("summary-length-ok"), input.row.summary),
    checkHasAuthorDoctor(catalog["has-author-doctor"]!, w("has-author-doctor"), input.row.authorDoctorId),
    checkHasEvidenceLink(catalog["has-evidence-link"]!, w("has-evidence-link"), input.evidence),
    checkHasRelatedFaq(catalog["has-related-faq"]!, w("has-related-faq"), input.relatedFaq),
    checkInternalLinks(catalog["internal-links-min"]!, w("internal-links-min"), input.row.bodyMarkdown, input.instanceSlug),
    checkFreshness(catalog["freshness-ok"]!, w("freshness-ok"), input.row.updatedAt),
  ];
}
