-- @glitzy/core-content — C0027 consultation_request 안 title column ADD + 공개 게시판 SELECT 권한
-- 사용자 요청 (2026-05-20): 비밀 상담소 안 게시판 형태 (제목 list 노출 · 본문/PII 비공개)

-- (1) title column ADD (length 1~100자 · 기존 row 안 message 첫 30자 안 backfill)
ALTER TABLE consultation_request ADD COLUMN IF NOT EXISTS title TEXT;
UPDATE consultation_request SET title = substr(message, 1, 30) WHERE title IS NULL;
ALTER TABLE consultation_request ALTER COLUMN title SET NOT NULL;
ALTER TABLE consultation_request DROP CONSTRAINT IF EXISTS consultation_request_title_length;
ALTER TABLE consultation_request ADD CONSTRAINT consultation_request_title_length CHECK (length(title) BETWEEN 1 AND 100);

-- (2) is_locked column ADD (기본 true — 본문 비공개 · 작성자/의료진만 unlock 가능 · 향후 cycle 합류)
ALTER TABLE consultation_request ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT true;

-- (3) PUBLIC SELECT 권한 — column-level GRANT (제목 list 만 노출 · phone/email/message 제외)
REVOKE SELECT ON consultation_request FROM app_public_reader;
GRANT SELECT (id, instance_id, title, display_name, is_locked, status, created_at)
  ON consultation_request TO app_public_reader;

-- (4) public reader RLS SELECT policy (instance scope 안 published-equivalent)
DROP POLICY IF EXISTS consultation_request_public_select_policy ON consultation_request;
CREATE POLICY consultation_request_public_select_policy ON consultation_request
  FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE INDEX IF NOT EXISTS consultation_request_public_idx ON consultation_request (instance_id, created_at DESC);
