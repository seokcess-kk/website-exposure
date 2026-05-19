-- @glitzy/core-content — C0002 LocationProfile (DATA_MODEL C-21·minimal v0.1)

CREATE TABLE location_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,  -- 단지점은 'main'·다지점은 'gangnam' 등
  name TEXT NOT NULL,
  -- Address
  street_address TEXT NOT NULL,
  address_locality TEXT NOT NULL,  -- 시·군
  address_region TEXT NOT NULL,     -- 도·광역시
  postal_code TEXT NOT NULL,
  address_country TEXT NOT NULL DEFAULT 'KR',  -- ISO 3166-1 alpha-2
  -- GeoCoordinates (optional)
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  -- Contact
  phone TEXT,
  email TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- v0.2+ hours·directions·parking 등
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT location_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  -- M0-18 cycle2: ISO 3166-1 alpha-2 대문자 강제
  CONSTRAINT location_profile_country_iso CHECK (address_country ~ '^[A-Z]{2}$'),
  CONSTRAINT location_profile_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
  CONSTRAINT location_profile_lng_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
  CONSTRAINT location_profile_email_regex CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
  -- LLC-10 patch (cycle 1 code review): 본원 전화 형식 정합 (한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678) — form regex 와 DB CHECK 일치
  CONSTRAINT location_profile_phone_format CHECK (
    phone IS NULL
    OR phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  ),
  CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX location_profile_instance_idx ON location_profile (instance_id);

ALTER TABLE location_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_profile FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON location_profile
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON location_profile TO app_tenant_user;
