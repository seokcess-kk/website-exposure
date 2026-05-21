// @glitzy/web/lib/seo-readiness/persist — seo_readiness_snapshot UPSERT
// SEO_VISIBILITY_OPS_PLAN v0.2 § 3 / 최신 1건만 보존 (UNIQUE)

import type postgres from "postgres";

import { CHECK_CATALOG } from "./catalog";
import { computeScore, gradeFromScore } from "./score";
import type { ReadinessCheck, ReadinessIssue, ReadinessRecommendation, ReadinessResult } from "./types";
import type { SeoReadinessEntityType } from "@glitzy/core-content";

export function buildResult(
  entityType: SeoReadinessEntityType,
  entityId: string,
  checks: ReadinessCheck[],
): ReadinessResult {
  const score = computeScore(checks);
  const grade = gradeFromScore(score);
  const recommendations: ReadinessRecommendation[] = checks
    .filter((c) => c.status !== "pass")
    .map((c) => {
      const cat = CHECK_CATALOG.find((x) => x.key === c.key);
      return { key: c.key, label: c.label, ...(cat?.recommendationHint ? { actionHint: cat.recommendationHint } : {}) };
    });
  // v1: blocking_issues 는 빈 배열 (JSON-LD validator 등 high-severity check 합류 시 채움)
  const blockingIssues: ReadinessIssue[] = [];
  return { entityType, entityId, score, grade, checks, blockingIssues, recommendations };
}

export async function persistReadiness(
  tx: postgres.TransactionSql,
  instanceId: string,
  result: ReadinessResult,
): Promise<void> {
  await tx`
    INSERT INTO seo_readiness_snapshot (
      instance_id, entity_type, entity_id, score, grade,
      checks, blocking_issues, recommendations, computed_at
    ) VALUES (
      ${instanceId}::uuid,
      ${result.entityType},
      ${result.entityId}::uuid,
      ${result.score},
      ${result.grade},
      ${tx.json(result.checks as any)},
      ${tx.json(result.blockingIssues as any)},
      ${tx.json(result.recommendations as any)},
      NOW()
    )
    ON CONFLICT (instance_id, entity_type, entity_id) DO UPDATE SET
      score = EXCLUDED.score,
      grade = EXCLUDED.grade,
      checks = EXCLUDED.checks,
      blocking_issues = EXCLUDED.blocking_issues,
      recommendations = EXCLUDED.recommendations,
      computed_at = NOW()
  `;
}
