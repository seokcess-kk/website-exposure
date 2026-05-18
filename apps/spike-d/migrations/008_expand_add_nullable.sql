-- Spike D — migration 008: expand/contract phase 1
-- D.2-8: column 추가 nullable·web/worker 양쪽 deploy 가능 상태
--   - 기존 reader/writer는 published_at 무시 가능
--   - 신규 writer는 published_at 작성 시작·기존 reader는 NULL 허용

ALTER TABLE content_test
  ADD COLUMN published_at TIMESTAMPTZ;

CREATE INDEX content_test_published_at_idx ON content_test (published_at)
  WHERE published_at IS NOT NULL;
