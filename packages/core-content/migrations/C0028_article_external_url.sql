-- @glitzy/core-content — C0028 article.external_url column ADD
-- 사용자 요청 (2026-05-20): 기사 안 외부 link 안 표시 (다이트한의원 보도 자료 등 외부 매체 안 기사)
ALTER TABLE article ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE article DROP CONSTRAINT IF EXISTS article_external_url_format;
ALTER TABLE article ADD CONSTRAINT article_external_url_format
  CHECK (external_url IS NULL OR (external_url ~ '^https?://' AND length(external_url) <= 2048));
