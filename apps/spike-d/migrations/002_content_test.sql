-- Spike D — migration 002: content_test with composite FK·CHECK·RLS
-- SPIKED1-pending: composite FK Drizzle Kit canonical 가능 (D.2 시나리오 1)
-- SPIKED1-pending: RLS policy는 raw SQL mixin (Drizzle Kit canonical 미지원)

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE content_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  parent_id UUID,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- CHECK constraints
  CONSTRAINT content_test_title_nonempty CHECK (length(title) > 0),
  CONSTRAINT content_test_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  -- composite FK: (instance_id, parent_id) → (instance_id, id) — same-tenant parent
  -- Note: requires (instance_id, id) unique. id가 PK이므로 (instance_id, id) UNIQUE 별도 필요.
  CONSTRAINT content_test_instance_id_id_unique UNIQUE (instance_id, id),
  CONSTRAINT content_test_parent_fk FOREIGN KEY (instance_id, parent_id)
    REFERENCES content_test(instance_id, id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX content_test_instance_id_idx ON content_test (instance_id);

-- RLS (NULLIF wrapping — Spike A SoT cascade)
ALTER TABLE content_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_test FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON content_test
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant_user;
