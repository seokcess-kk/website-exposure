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
  | "MedicalConditionPage"
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

  // sentinel SELECT 매칭 안 됐어도 동일 (content_type, content_ref, record_version=1) row 가 이미 있을 수 있음
  // (구 시드 데이터의 sentinel metadata marker 부재 등). ON CONFLICT DO UPDATE 로 fallback 회수.
  // legal_counsel 도 함께 채움 (2026-07-08 fix): LegalDocument sentinel 은
  // compliance_record_legal_doc_requires_legal CHECK (published + LegalDocument →
  // legal_counsel NOT NULL) 에 걸린다 — seed 는 채웠지만 이 헬퍼가 누락해, 법률문서 sentinel 이
  // 사전 시드되지 않은 인스턴스(대전점 등)의 의원정보 저장이 통째로 실패했다 (실사고).
  // sentinel 은 수동검수 마커라 전 content_type 에 채워도 무해.
  const inserted = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level,
      auto_check_result, peer_reviewer, peer_reviewed_at,
      legal_counsel, legal_counsel_at,
      published_at, published_by,
      record_phase, record_version, metadata
    ) VALUES (
      ${args.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      'Low'::risk_level,
      ${SENTINEL_AUTO_CHECK}::jsonb,
      ${args.userId}::uuid, NOW(),
      ${args.userId}::uuid, NOW(),
      NOW(), ${args.userId}::uuid,
      'published'::compliance_record_phase, 1,
      ${SENTINEL_METADATA}::jsonb
    )
    ON CONFLICT (instance_id, content_type, content_ref, record_version)
    DO UPDATE SET updated_at = NOW()
    RETURNING id
  `;
  return inserted[0]!.id;
}
