-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.2 (CAP-10 acceptance blocker)
-- 기존 C0015 unique: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
-- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능

DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
  WHERE status IN ('open', 'in-progress');
