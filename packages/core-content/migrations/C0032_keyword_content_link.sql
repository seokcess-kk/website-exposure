-- @glitzy/core-content C0032 — keyword_content_link (SEO_VISIBILITY_OPS_PLAN v0.2 § 2.2)
-- keyword ↔ 콘텐츠 다대다 폴리모픽 link.
-- keyword_id 는 composite FK 로 same-tenant 강제. entity_id 는 폴리모픽이라 app-level 검증.

CREATE TABLE keyword_content_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  keyword_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 50,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT keyword_content_link_entity_type_check CHECK (
    entity_type IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance')
  ),
  CONSTRAINT keyword_content_link_relevance_range CHECK (relevance_score BETWEEN 1 AND 100),
  CONSTRAINT keyword_content_link_unique UNIQUE (instance_id, keyword_id, entity_type, entity_id),
  CONSTRAINT keyword_content_link_keyword_fk FOREIGN KEY (instance_id, keyword_id)
    REFERENCES keyword_target (instance_id, id) ON DELETE CASCADE
);

CREATE INDEX keyword_content_link_instance_idx ON keyword_content_link (instance_id);
CREATE INDEX keyword_content_link_keyword_idx ON keyword_content_link (instance_id, keyword_id);
CREATE INDEX keyword_content_link_entity_idx ON keyword_content_link (instance_id, entity_type, entity_id);
CREATE INDEX keyword_content_link_primary_idx ON keyword_content_link (instance_id, keyword_id)
  WHERE is_primary = true;

ALTER TABLE keyword_content_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_content_link FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON keyword_content_link
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON keyword_content_link TO app_tenant_user;
