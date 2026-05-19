-- @glitzy/core-content — C0009 ArticleCategory (DATA_MODEL C-22·EAT_CONTENT_PLAN v1.0 § 2.1)
-- EC-SCHEMA-01·02·04·17: C-22 풀명세 컬럼 전체 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출.
-- parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
-- Precondition: D0010 instance

CREATE TABLE article_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
  cover_image_url TEXT,                          -- v0.1 nullable
  seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
  display_order INTEGER NOT NULL DEFAULT 0,
  article_type_default TEXT,                     -- v0.1 nullable
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),
  CONSTRAINT article_category_description_length CHECK (
    description IS NULL OR length(description) BETWEEN 80 AND 200
  ),
  CONSTRAINT article_category_cover_image_url_format CHECK (
    cover_image_url IS NULL OR cover_image_url ~ '^https?://'
  ),
  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX article_category_instance_idx ON article_category (instance_id);
CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
  WHERE parent_category_id IS NOT NULL;

ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_category FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON article_category
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
