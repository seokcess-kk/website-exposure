-- @glitzy/core-content — C0010 Publication (DATA_MODEL C-24·EAT_CONTENT_PLAN v1.0 § 2.3)
-- EC-SCHEMA-08·09·10: 외부 학술 인용 entity · authors[] min 1 NOT NULL (DEFAULT 제거) · risk_level Low fixed CHECK.
-- DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level

CREATE TABLE publication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  authors JSONB NOT NULL,                       -- cycle 1 ECP-18: DEFAULT 제거. authors min 1 CHECK 정합
  journal TEXT,
  published_date DATE NOT NULL,                  -- 학술지 게재일
  doi TEXT,
  pubmed_id TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  summary TEXT NOT NULL,
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT publication_thumbnail_url_format CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ '^https?://'
  ),
  CONSTRAINT publication_doi_format CHECK (
    doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'
  ),
  CONSTRAINT publication_pubmed_id_format CHECK (
    pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'
  ),
  CONSTRAINT publication_authors_array CHECK (
    jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1
  ),
  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT publication_published_requires_at CHECK (
    status <> 'published' OR published_at IS NOT NULL
  ),
  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX publication_instance_idx ON publication (instance_id);
CREATE INDEX publication_status_idx ON publication (instance_id, status);
CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON publication
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
