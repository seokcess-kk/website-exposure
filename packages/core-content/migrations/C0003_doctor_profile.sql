-- @glitzy/core-content — C0003 DoctorProfile (DATA_MODEL C-02·minimal v0.1)

CREATE TABLE doctor_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,  -- doctor-kim-test
  name TEXT NOT NULL,
  title TEXT,  -- 원장·과장·전문의 등
  job_title TEXT,
  honorific TEXT,  -- 의학박사·교수 등
  bio TEXT,
  photo_url TEXT,
  -- Education / Experience / Specialty는 v0.2+ 별도 table (DoctorEducation·DoctorExperience)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT doctor_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT doctor_profile_name_length CHECK (length(name) BETWEEN 1 AND 100),
  CONSTRAINT doctor_profile_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT doctor_profile_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX doctor_profile_instance_idx ON doctor_profile (instance_id);
CREATE INDEX doctor_profile_active_order_idx ON doctor_profile (instance_id, active, display_order) WHERE active = true;

ALTER TABLE doctor_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profile FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON doctor_profile
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON doctor_profile TO app_tenant_user;
