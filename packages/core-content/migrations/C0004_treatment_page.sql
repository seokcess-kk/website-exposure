-- @glitzy/core-content — C0004 TreatmentPage (DATA_MODEL C-03·v0.2 patch)
-- M0-02 cycle2: status enum 9종 (REVIEW_WORKFLOW SoT)
-- M0-03 cycle2: risk_level enum 3종·대문자 (RISK_LEVELS SoT)
-- M0-17 cycle2: summary 50~160자 (DATA_MODEL C-03)

CREATE TYPE content_publication_status AS ENUM (
  'draft', 'review-queued', 'in-review', 'approved', 'publishable',
  'published', 'blocked', 'rejected', 'stale'
);

CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');

CREATE TABLE treatment_page (
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
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT treatment_page_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT treatment_page_title_length CHECK (length(title) BETWEEN 1 AND 200),
  CONSTRAINT treatment_page_summary_length CHECK (length(summary) BETWEEN 50 AND 160),
  CONSTRAINT treatment_page_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT treatment_page_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT treatment_page_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX treatment_page_instance_idx ON treatment_page (instance_id);
CREATE INDEX treatment_page_status_idx ON treatment_page (instance_id, status);
CREATE INDEX treatment_page_published_idx ON treatment_page (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;

ALTER TABLE treatment_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_page FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON treatment_page
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON treatment_page TO app_tenant_user;
