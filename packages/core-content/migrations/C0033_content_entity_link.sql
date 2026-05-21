-- @glitzy/core-content C0033 — content_entity_link (SEO_VISIBILITY_OPS_PLAN v0.2 § 2.3)
-- 콘텐츠 ↔ 콘텐츠/엔티티 폴리모픽 link. 근거 연결의 1급 시민.
-- v1 vocabulary 3종 (cycle 1 cycle 안 5종 → 3종 축소):
--   - cites:        Article cites Publication/MediaAppearance (학술 인용 + 미디어 출연 인용)
--   - related-to:   generic 관련 콘텐츠 (FAQ related-to TreatmentPage 등)
--   - derived-from: TreatmentPage derived-from Publication (clinical evidence)
-- v1 미포함 (SVO-DEFER-03):
--   - authored-by:  기존 entity.author_doctor_id FK SoT (SVO-CASCADE-05) — 이중 SoT 회피
--   - appears-in:   doctor↔media 직접 link · source_type 제한과 충돌
-- same-tenant 정합: app-level 검증 (server action 안 source/target 의 instance_id 매치 체크). DB trigger 강제는 SVO-DEFER-10.

CREATE TABLE content_entity_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  relation_type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_entity_link_source_type_check CHECK (
    source_type IN ('Article', 'TreatmentPage', 'FAQ')
  ),
  CONSTRAINT content_entity_link_target_type_check CHECK (
    target_type IN ('Publication', 'MediaAppearance', 'FAQ', 'TreatmentPage', 'Article')
  ),
  CONSTRAINT content_entity_link_relation_type_check CHECK (
    relation_type IN ('cites', 'related-to', 'derived-from')
  ),
  CONSTRAINT content_entity_link_unique UNIQUE (
    instance_id, source_type, source_id, target_type, target_id, relation_type
  ),
  CONSTRAINT content_entity_link_not_self CHECK (
    NOT (source_type = target_type AND source_id = target_id)
  )
);

CREATE INDEX content_entity_link_instance_idx ON content_entity_link (instance_id);
CREATE INDEX content_entity_link_source_idx ON content_entity_link (instance_id, source_type, source_id, relation_type);
CREATE INDEX content_entity_link_target_idx ON content_entity_link (instance_id, target_type, target_id, relation_type);

ALTER TABLE content_entity_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entity_link FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON content_entity_link
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON content_entity_link TO app_tenant_user;
