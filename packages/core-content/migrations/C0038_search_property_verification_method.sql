-- @glitzy/core-content C0038 — search_property.verification_method (NAVER_SEARCH_INGEST_PLAN v0.2 § 2.2)
-- GSC ↔ NSA 검증 방식 분기. 기존 GSC row 는 'gsc-service-account' 로 backfill.

ALTER TABLE search_property
  ADD COLUMN IF NOT EXISTS verification_method TEXT;

-- 기존 row backfill (Phase 5 v1.0 acceptance 시점 모두 GSC SA 사용)
UPDATE search_property
   SET verification_method = 'gsc-service-account'
 WHERE source = 'google-search-console'
   AND verification_method IS NULL;

ALTER TABLE search_property
  ALTER COLUMN verification_method SET NOT NULL;

ALTER TABLE search_property
  ADD CONSTRAINT search_property_verification_method_check
  CHECK (verification_method IN (
    'gsc-service-account',     -- Google
    'naver-meta-tag',          -- NSA HTML meta tag
    'naver-html-file',         -- NSA root HTML file
    'naver-dns-record'         -- NSA DNS TXT record
  ));
