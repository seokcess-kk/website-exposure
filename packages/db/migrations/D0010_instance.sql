-- @glitzy/db — D0010 Instance (multi-tenant root)
-- M0 vertical slice·DATA_MODEL C-08 InstanceManifest의 minimal projection

CREATE TABLE instance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,  -- subdomain·routing key (예: clinic-abc)
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- M0-16 cycle2: DATA_MODEL @id 3~64자 (`{2,63}` = 첫 1자 + 2~63자 = 3~64자)
  CONSTRAINT instance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT instance_display_name_length CHECK (length(display_name) BETWEEN 1 AND 200)
);

CREATE INDEX instance_active_idx ON instance (active) WHERE active = true;
CREATE INDEX instance_slug_active_idx ON instance (slug) WHERE active = true;

-- M0-15 cycle2: instance는 control-plane table — super-admin·service_role만 접근
-- tenant user는 자기 instance 정보 SELECT만 (lookup·routing 용도)·다른 instance 접근 차단
-- RLS 적용 후 tenant role read는 NULLIF wrapping
ALTER TABLE instance ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance FORCE ROW LEVEL SECURITY;

CREATE POLICY instance_tenant_read ON instance
  FOR SELECT TO app_tenant_user
  USING (id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- super_admin·service_role은 explicit role grant·tenant role은 SELECT 만 부여
GRANT SELECT ON instance TO app_tenant_user;
