-- Spike D — migration 009: expand/contract phase 2 (backfill)
-- D.2-8: 모든 status='published' record에 published_at 채움
-- 운영 시 dual-write (web/worker 양쪽 deploy)·long-running migration 분할 권장
-- 본 spike는 작은 dataset이므로 single statement

UPDATE content_test
SET published_at = COALESCE(published_at, created_at)
WHERE status = 'published' AND published_at IS NULL;
