-- @glitzy/core-content — C0025 FAQ v0.1 발행 차단 해제
-- EC-DEFER-12 marker 유지 (compliance-assistant 본 구현 합류 시 정합 재검토).
-- 사용자 결정 (2026-05-20): 데모 안 FAQ 실 노출 위해 published 허용.
-- 단 published_content_compliance_guard trigger (C0016) 안 그대로 유지 — sentinel ComplianceRecord 필수.

ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;

-- published 시 published_at NOT NULL 안 정합 강화 (Article 안 동일 패턴)
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_requires_at;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_at
  CHECK (status <> 'published' OR published_at IS NOT NULL);
