-- @glitzy/core-content — C0026 consultation_request (1:1 비밀 상담소 · stub 테이블)
-- ADMIN_UX_REDESIGN code v1.0 이후 사용자 요청 (2026-05-20) 안 site IA 안 합류.
-- PII 안 다루는 영역이지만 stub 단계: name · phone · message 만 저장. crm-sync · privacy 안 미연계.
-- 향후 ConsultationRequest entity 안 정식 합류 시 별 cycle 안 PII catalog · DLQ · workflow 안 합류.

CREATE TABLE IF NOT EXISTS consultation_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT consultation_request_display_name_length CHECK (length(display_name) BETWEEN 1 AND 50),
  CONSTRAINT consultation_request_message_length CHECK (length(message) BETWEEN 10 AND 5000),
  CONSTRAINT consultation_request_phone_format CHECK (
    contact_phone IS NULL OR contact_phone ~ '^[0-9+\-\s]{8,30}$'
  ),
  CONSTRAINT consultation_request_email_format CHECK (
    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  CONSTRAINT consultation_request_status_enum CHECK (status IN ('open', 'in-progress', 'resolved', 'archived'))
);

CREATE INDEX IF NOT EXISTS consultation_request_instance_idx ON consultation_request (instance_id, created_at DESC);
CREATE INDEX IF NOT EXISTS consultation_request_status_idx ON consultation_request (instance_id, status);

ALTER TABLE consultation_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_request FORCE ROW LEVEL SECURITY;

-- RLS 정책: app_tenant_user 안 동일 instance 만 SELECT/INSERT/UPDATE
DROP POLICY IF EXISTS consultation_request_tenant_policy ON consultation_request;
CREATE POLICY consultation_request_tenant_policy ON consultation_request
  FOR ALL TO app_tenant_user
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

-- RLS 정책: app_public_reader 안 INSERT 만 허용 (공개 사이트 안 form submit · SELECT 불가 · 사생활 보호)
DROP POLICY IF EXISTS consultation_request_public_insert_policy ON consultation_request;
CREATE POLICY consultation_request_public_insert_policy ON consultation_request
  FOR INSERT TO app_public_reader
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

GRANT SELECT, INSERT, UPDATE ON consultation_request TO app_tenant_user;
GRANT INSERT ON consultation_request TO app_public_reader;
