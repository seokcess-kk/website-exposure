-- @glitzy/core-content — C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.1 (CAP-10 acceptance blocker)
-- Postgres 제약 - ALTER TYPE ADD VALUE 는 single statement · COMMIT 분리 필요
-- 본 migration 은 단독 step. C0018 (UNIQUE 재정의) 는 별 step.

ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
