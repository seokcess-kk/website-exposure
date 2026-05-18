-- @glitzy/core-content — C0001 ClinicProfile (DATA_MODEL C-01·minimal v0.1)
-- 핵심 column만·RLS·composite FK target·이후 cycle에서 detail 추가

CREATE TABLE clinic_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL DEFAULT 'clinic',  -- 보통 'clinic' 단일·DATA_MODEL C-01 @id
  name TEXT NOT NULL,
  alternate_name TEXT,
  legal_entity_name TEXT,
  slogan TEXT,
  description TEXT NOT NULL,  -- 80~300자
  long_description TEXT,
  founding_date DATE,
  founder TEXT,
  logo_url TEXT NOT NULL,
  og_image_url TEXT NOT NULL,
  business_registration_number TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- v0.2+ 확장 (awards·memberOf·socialMedia 등)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT clinic_profile_name_length CHECK (length(name) BETWEEN 1 AND 100),
  CONSTRAINT clinic_profile_description_length CHECK (length(description) BETWEEN 80 AND 300),
  CONSTRAINT clinic_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT clinic_profile_brn_regex CHECK (business_registration_number IS NULL OR business_registration_number ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'),
  CONSTRAINT clinic_profile_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT clinic_profile_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX clinic_profile_instance_idx ON clinic_profile (instance_id);

ALTER TABLE clinic_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_profile FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON clinic_profile
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON clinic_profile TO app_tenant_user;
