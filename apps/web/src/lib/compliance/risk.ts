// @glitzy/web/lib/compliance/risk — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.2 CA-GATE-02 (CAM-04)
// RiskLevel MAX 결합 helper. 격하 금지.

import type { RiskLevel } from "./types";

const ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };

export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) {
    if (ORDER[l] > ORDER[max]) max = l;
  }
  return max;
}
