-- @glitzy/core-content — C0019 review_queue_entry partial UNIQUE 안 compliance_record_id 포함 5-tuple
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 cycle 3 CAP-CODE3-02 정정
-- 기존 C0018 unique: (instance_id, content_type, content_ref, queue_type) partial WHERE status open/in-progress
-- 변경: (instance_id, content_type, content_ref, queue_type, compliance_record_id) 5-tuple
-- 이유: rejected → review-queued 재제출 시 이전 record 안 stale open entry 가 새 record INSERT 와 충돌.
--   record_version 별 unique scope 분리 (record_id 포함).
-- 운영 가설: stale entry 는 rejectContent sibling resolve (CAP-CODE2-03) 안 정리되나, 일관성 보강.

DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref, queue_type, compliance_record_id)
  WHERE status IN ('open', 'in-progress');
