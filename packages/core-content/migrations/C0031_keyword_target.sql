-- @glitzy/core-content C0031 — keyword_target (SEO_VISIBILITY_OPS_PLAN v0.2 § 2.1)
-- 타깃 키워드 entity — 대표/보조 계층 · intent · priority · difficulty · status.
-- slug regex 안 한글 허용 (한국어 키워드 자연스러움) — instance.slug (영문만) 와 의도적 분리.

CREATE TABLE keyword_target (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  keyword_type TEXT NOT NULL,
  parent_id UUID,
  intent TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'P1',
  difficulty INTEGER,
  region_scope TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT keyword_target_slug_regex CHECK (slug ~ '^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$'),
  CONSTRAINT keyword_target_label_length CHECK (length(label) BETWEEN 1 AND 100),
  CONSTRAINT keyword_target_keyword_type_check CHECK (keyword_type IN ('primary', 'secondary')),
  CONSTRAINT keyword_target_intent_check CHECK (intent IN ('informational', 'comparison', 'pre-booking', 'local')),
  CONSTRAINT keyword_target_priority_check CHECK (priority IN ('P0', 'P1', 'P2')),
  CONSTRAINT keyword_target_status_check CHECK (status IN ('active', 'paused', 'won', 'dropped')),
  CONSTRAINT keyword_target_difficulty_range CHECK (difficulty IS NULL OR difficulty BETWEEN 0 AND 100),
  CONSTRAINT keyword_target_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT keyword_target_instance_id_unique UNIQUE (instance_id, id)
);

-- self-referencing composite FK (same-tenant) — parent 가 같은 instance 안 keyword 여야 함
ALTER TABLE keyword_target
  ADD CONSTRAINT keyword_target_parent_fk
  FOREIGN KEY (instance_id, parent_id)
  REFERENCES keyword_target (instance_id, id)
  ON DELETE SET NULL;

CREATE INDEX keyword_target_instance_idx ON keyword_target (instance_id);
CREATE INDEX keyword_target_status_idx ON keyword_target (instance_id, status, priority);
CREATE INDEX keyword_target_parent_idx ON keyword_target (instance_id, parent_id) WHERE parent_id IS NOT NULL;

ALTER TABLE keyword_target ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_target FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON keyword_target
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON keyword_target TO app_tenant_user;
