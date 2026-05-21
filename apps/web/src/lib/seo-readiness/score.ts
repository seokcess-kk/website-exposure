// @glitzy/web/lib/seo-readiness/score — SEO_VISIBILITY_OPS_PLAN v0.2 § 3.2
// score = 100 * Σ(weight × pass) / Σ(weight). warn 는 0.5 partial.

import type { SeoReadinessGrade } from "@glitzy/core-content";

import type { ReadinessCheck } from "./types";

export function computeScore(checks: ReadinessCheck[]): number {
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;
  const earned = checks.reduce((sum, c) => {
    if (c.status === "pass") return sum + c.weight;
    if (c.status === "warn") return sum + c.weight * 0.5;
    return sum;
  }, 0);
  return Math.round((earned / totalWeight) * 100);
}

export function gradeFromScore(score: number): SeoReadinessGrade {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}
