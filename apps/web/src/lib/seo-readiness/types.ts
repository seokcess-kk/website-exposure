// @glitzy/web/lib/seo-readiness/types — SEO_VISIBILITY_OPS_PLAN v0.2 § 3 common types

import type { SeoReadinessEntityType, SeoReadinessGrade } from "@glitzy/core-content";

export type ReadinessCheckStatus = "pass" | "fail" | "warn";

export type ReadinessCheck = {
  key: string;
  label: string;
  weight: number;
  status: ReadinessCheckStatus;
  detail?: string;
};

export type ReadinessIssue = {
  key: string;
  label: string;
  severity: "high" | "medium" | "low";
};

export type ReadinessRecommendation = {
  key: string;
  label: string;
  actionHint?: string;
};

export type ReadinessResult = {
  entityType: SeoReadinessEntityType;
  entityId: string;
  score: number;
  grade: SeoReadinessGrade;
  checks: ReadinessCheck[];
  blockingIssues: ReadinessIssue[];
  recommendations: ReadinessRecommendation[];
};
