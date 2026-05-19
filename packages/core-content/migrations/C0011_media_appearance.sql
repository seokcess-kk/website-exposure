-- @glitzy/core-content — C0011 MediaAppearance (DATA_MODEL C-25·EAT_CONTENT_PLAN v1.0 § 2.4)
-- EC-SCHEMA-11·12: media_channel_type enum 4종. v0.1 단계 JSON-LD `@type` = VideoObject 단일화.
-- BroadcastEvent/NewsArticle 분기 EC-DEFER-11 (M1 cascade).
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level

CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');

CREATE TABLE media_appearance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_type media_channel_type NOT NULL,
  published_date DATE NOT NULL,
  duration_seconds INTEGER,
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
  CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT media_appearance_channel_name_length CHECK (length(channel_name) BETWEEN 1 AND 100),
  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT media_appearance_thumbnail_url_format CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ '^https?://'
  ),
  CONSTRAINT media_appearance_duration_positive CHECK (
    duration_seconds IS NULL OR duration_seconds > 0
  ),
  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT media_appearance_published_requires_at CHECK (
    status <> 'published' OR published_at IS NOT NULL
  ),
  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON media_appearance
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
