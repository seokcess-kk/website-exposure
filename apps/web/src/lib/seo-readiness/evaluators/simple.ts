// @glitzy/web/lib/seo-readiness/evaluators/simple — 단순 entity readiness (FAQ · Publication · MediaAppearance · Doctor · Clinic)
// SEO_VISIBILITY_OPS_PLAN v0.2 § 3.1
//
// 위 entity 들은 v1 안 summary-length + freshness 만으로 평가 (catalog 정합).
// 더 정교한 check (Publication 의 DOI 유효성 · Doctor 의 credential 등) 는 후속 cycle.

import type { SeoReadinessEntityType } from "@glitzy/core-content";

import { getApplicableChecks } from "../catalog";
import type { ReadinessCheck } from "../types";
import { checkFreshness, checkSummaryLength } from "./shared";

export type SimpleEvaluatorInput = {
  entityType: Exclude<SeoReadinessEntityType, "Article" | "TreatmentPage">;
  row: {
    summary?: string | null;
    answer?: string | null;       // FAQ 안 answer 가 summary 역할
    description?: string | null;  // ClinicProfile · DoctorProfile (bio) 안 description 역할
    updatedAt: Date | null;
  };
};

export function evaluateSimple(input: SimpleEvaluatorInput): ReadinessCheck[] {
  const catalog = Object.fromEntries(getApplicableChecks(input.entityType).map((c) => [c.key, c]));
  const w = (key: string) => catalog[key]?.weight[input.entityType] ?? 0;
  const summarySource = input.row.summary ?? input.row.answer ?? input.row.description ?? null;
  const checks: ReadinessCheck[] = [];
  if (catalog["summary-length-ok"]) {
    checks.push(checkSummaryLength(catalog["summary-length-ok"], w("summary-length-ok"), summarySource));
  }
  if (catalog["freshness-ok"]) {
    checks.push(checkFreshness(catalog["freshness-ok"], w("freshness-ok"), input.row.updatedAt));
  }
  return checks;
}
