-- @glitzy/core-content C0035 — search_property (SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 2.1)
-- Search Console / 향후 Naver/Bing property — instance ↔ external source verification.

CREATE TABLE search_property (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  property_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT search_property_source_check
    CHECK (source IN ('google-search-console', 'naver-searchadvisor', 'bing-webmaster')),
  CONSTRAINT search_property_verification_check
    CHECK (verification_status IN ('pending', 'verified', 'failed')),
  CONSTRAINT search_property_url_format
    CHECK (property_url ~ '^(https?://|sc-domain:)'),
  CONSTRAINT search_property_instance_source_url_unique UNIQUE (instance_id, source, property_url),
  CONSTRAINT search_property_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX search_property_instance_idx ON search_property (instance_id);

ALTER TABLE search_property ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_property FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON search_property
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON search_property TO app_tenant_user;
