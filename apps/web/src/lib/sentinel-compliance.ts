// @glitzy/web/lib/sentinel-compliance — 즉시 발행 모드 안 sentinel ComplianceRecord 자동 INSERT
//
// 사용자 검수 2026-05-20 — 검수 큐 비활성화 안 모든 콘텐츠가 published 로 즉시 저장될 때,
// published_content_compliance_guard trigger 정합 위해 sentinel ComplianceRecord 가 미리 있어야 함.
//
// idempotent — 동일 (instance_id, content_type, content_ref, sentinel=true) 안 이미 존재하면 그 id 반환.

import type { ScopedTx } from "@glitzy/db";

const SENTINEL_AUTO_CHECK = JSON.stringify({
  automatedDecision: "pass",
  buildBlocked: false,
  gateRequired: false,
  hasWarnings: false,
  findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
  findings: [],
});

const SENTINEL_METADATA = JSON.stringify({
  sentinel: true,
  manualReview: true,
  catalogVersion: "m0-stub-v0.1",
  exemptReason: "auto-publish-mode (review queue disabled · user 2026-05-20)",
});

export type SentinelContentType =
  | "Article"
  | "TreatmentPage"
  | "Publication"
  | "MediaAppearance"
  | "FAQ"
  | "ClinicProfile"
  | "LocationProfile"
  | "DoctorProfile"
  | "LegalDocument"
  | "ArticleCategory";

/**
 * sentinel ComplianceRecord 보장 — 없으면 INSERT, 있으면 id 반환.
 * 호출자는 article/treatment_page 등의 compliance_record_id 컬럼에 이 id 를 set.
 */
export async function ensureSentinelComplianceRecord(
  tx: ScopedTx,
  args: {
    instanceId: string;
    contentType: SentinelContentType;
    contentRef: string;  // slug
    userId: string;      // admin_user UUID (peer_reviewer + published_by)
  },
): Promise<string> {
  const existing = await tx<{ id: string }[]>`
    SELECT id FROM compliance_record
     WHERE instance_id = ${args.instanceId}::uuid
       AND content_type = ${args.contentType}::compliance_content_type
       AND content_ref = ${args.contentRef}
       AND metadata @> '{"sentinel":true}'::jsonb
     LIMIT 1
  `;
  if (existing.length > 0) return existing[0]!.id;

  const inserted = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level,
      auto_check_result, peer_reviewer, peer_reviewed_at,
      published_at, published_by,
      record_phase, record_version, metadata
    ) VALUES (
      ${args.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      'Low'::risk_level,
      ${SENTINEL_AUTO_CHECK}::jsonb,
      ${args.userId}::uuid, NOW(),
      NOW(), ${args.userId}::uuid,
      'published'::compliance_record_phase, 1,
      ${SENTINEL_METADATA}::jsonb
    )
    RETURNING id
  `;
  return inserted[0]!.id;
}
