-- @glitzy/core-content C0039 — search_visibility_snapshot.metadata jsonb (NAVER_SEARCH_INGEST_PLAN v0.4 § 2.3)
-- row 별 dataGrain · collectionDate · sourceWindowLabel · positionUnavailable marker 저장.
-- GSC row 도 향후 dataGrain='gsc-daily' marker 적용 가능 (v1.x cycle).

ALTER TABLE search_visibility_snapshot
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Postgres 11+ 에서 NOT NULL DEFAULT 추가는 instant (no rewrite).
-- 기존 GSC row 는 default '{}' 로 채워짐 — application-level 에서 dataGrain absent 시 'gsc-daily' 가정.
