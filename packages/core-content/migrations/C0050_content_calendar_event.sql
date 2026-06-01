-- @glitzy/core-content C0050 — content_calendar_event (CONTENT_CALENDAR_PLAN v1.1 · CCAL-DEFER-02)
-- 운영자 추가 "계획 일정" entity — 발행 전 콘텐츠 기획을 캘린더에 표시. read-only v1 (published 역사) 의 forward 기획 보강.
-- v1 범위: title · planned_date · entity_type(nullable · 아이콘/필터) · note(nullable) · done(boolean) · created_by.
-- manifest 외 patch (C0049 답습). RLS tenant_isolation (keyword_target C0031 패턴).

CREATE TABLE content_calendar_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  planned_date DATE NOT NULL,
  entity_type TEXT,
  note TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_calendar_event_title_length CHECK (length(title) BETWEEN 1 AND 200),
  CONSTRAINT content_calendar_event_entity_type_check CHECK (
    entity_type IS NULL OR entity_type IN (
      'Article', 'TreatmentPage', 'MedicalConditionPage', 'FAQ',
      'Publication', 'MediaAppearance', 'LegalDocument'
    )
  ),
  CONSTRAINT content_calendar_event_note_length CHECK (note IS NULL OR length(note) <= 500)
);

CREATE INDEX content_calendar_event_instance_date_idx ON content_calendar_event (instance_id, planned_date);
CREATE INDEX content_calendar_event_instance_open_idx ON content_calendar_event (instance_id, done) WHERE done = false;

ALTER TABLE content_calendar_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar_event FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON content_calendar_event
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON content_calendar_event TO app_tenant_user;
