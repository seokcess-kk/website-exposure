-- Spike A — migration 002: content_test (RLS + WITH CHECK)
-- SPIKEA1-002: 명시 GRANT (default privileges 제거)
-- SPIKEA1-003: pgcrypto는 001에서 활성화

CREATE TABLE content_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT content_test_title_nonempty CHECK (length(title) > 0)
);

CREATE INDEX content_test_instance_id_idx ON content_test (instance_id);

-- RLS enable + FORCE
ALTER TABLE content_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_test FORCE ROW LEVEL SECURITY;

-- tenant_isolation policy
-- NULLIF로 wrapping: unset context는 '' 반환 → NULLIF로 NULL → instance_id = NULL → false (silent deny, cast 에러 없음)
CREATE POLICY tenant_isolation ON content_test
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- 명시 GRANT (SPIKEA1-002)
GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant_user;
