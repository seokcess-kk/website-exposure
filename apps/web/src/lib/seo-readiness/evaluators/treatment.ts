// @glitzy/web/lib/seo-readiness/evaluators/treatment — TreatmentPage entity readiness check

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

export type TreatmentEvaluatorInput = {
  row: {
    title: string | null;
    summary: string | null;
    bodyMarkdown: string | null;
    // TreatmentPage 에는 author_doctor_id 가 없음 — content_entity_link 또는 metadata 로 검증해야 함.
    // v1 은 author 확보 시그널을 metadata.authorDoctorSlug 또는 별도 link 로 대체.
    // 단순화: TreatmentPage 의 has-author-doctor 는 metadata.author_doctor_slug 가 있으면 pass.
    authorDoctorPresent: boolean;
    updatedAt: Date | null;
  };
  primaryKeywordLabels: string[];
  evidence: LinkCount;
  relatedFaq: LinkCount;
  instanceSlug: string;
};

export function evaluateTreatment(input: TreatmentEvaluatorInput): ReadinessCheck[] {
  const catalog = Object.fromEntries(getApplicableChecks("TreatmentPage").map((c) => [c.key, c]));
  const w = (key: string) => catalog[key]!.weight.TreatmentPage ?? 0;
  return [
    checkTitleHasKeyword(catalog["title-has-target-keyword"]!, w("title-has-target-keyword"),
      input.row.title, input.primaryKeywordLabels),
    checkSummaryLength(catalog["summary-length-ok"]!, w("summary-length-ok"), input.row.summary),
    checkHasAuthorDoctor(catalog["has-author-doctor"]!, w("has-author-doctor"),
      input.row.authorDoctorPresent ? "present" : null),
    checkHasEvidenceLink(catalog["has-evidence-link"]!, w("has-evidence-link"), input.evidence),
    checkHasRelatedFaq(catalog["has-related-faq"]!, w("has-related-faq"), input.relatedFaq),
    checkInternalLinks(catalog["internal-links-min"]!, w("internal-links-min"), input.row.bodyMarkdown, input.instanceSlug),
    checkFreshness(catalog["freshness-ok"]!, w("freshness-ok"), input.row.updatedAt),
  ];
}
