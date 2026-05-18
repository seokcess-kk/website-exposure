-- Spike D — migration 010: expand/contract phase 3 (contract — CHECK 강제)
-- D.2-8: published 상태는 반드시 published_at 채워져야 함
-- 본 phase는 모든 writer가 신규 column 사용 보장 (deploy timing 후) 진행

ALTER TABLE content_test
  ADD CONSTRAINT content_test_published_requires_published_at
  CHECK (status <> 'published' OR published_at IS NOT NULL);
