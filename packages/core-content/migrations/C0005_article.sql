-- @glitzy/core-content — C0005 Article (DATA_MODEL C-04·v0.2 patch)
-- M0-05 cycle2: composite FK ON DELETE NO ACTION — author 삭제는 application layer 처리
-- M0-02·03 cycle2: enum 통합 (C0004에서 정의)

CREATE TABLE article (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level,
  compliance_record_id UUID,
  hero_image_url TEXT,
  author_doctor_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT article_title_length CHECK (length(title) BETWEEN 1 AND 200),
    -- M0-21 cycle3: DATA_MODEL C-04 정합 80~200
  CONSTRAINT article_summary_length CHECK (length(summary) BETWEEN 80 AND 200),
  CONSTRAINT article_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT article_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT article_instance_id_unique UNIQUE (instance_id, id),
  -- M0-05 cycle2: ON DELETE NO ACTION — instance_id NOT NULL과 충돌 회피
  CONSTRAINT article_author_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile(instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX article_instance_idx ON article (instance_id);
CREATE INDEX article_status_idx ON article (instance_id, status);
CREATE INDEX article_published_idx ON article (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX article_author_idx ON article (instance_id, author_doctor_id) WHERE author_doctor_id IS NOT NULL;

ALTER TABLE article ENABLE ROW LEVEL SECURITY;
ALTER TABLE article FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON article
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON article TO app_tenant_user;
