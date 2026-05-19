-- @glitzy/core-content C0023a — ClinicProfile release schema split (2026-05-19 · ADMIN_UX_REDESIGN W6)
-- L1 (DB CHECK) 안 무결성 만 · L2 (zod 저장) 와 L3 (zod 출시) 분리.
-- logo_url · og_image_url · description (80자) 안 NOT NULL/length CHECK 제거 — L3 zod 안 require.
-- grandfather backfill: 기존 published row 안 NULL 검출 시 compliance_record.metadata.legacyGrandfathered 마킹.

-- (1) NOT NULL 제거
ALTER TABLE clinic_profile ALTER COLUMN logo_url DROP NOT NULL;
ALTER TABLE clinic_profile ALTER COLUMN og_image_url DROP NOT NULL;
ALTER TABLE clinic_profile ALTER COLUMN description DROP NOT NULL;

-- (2) description 80자 CHECK 제거 — L3 zod 안 require
ALTER TABLE clinic_profile DROP CONSTRAINT IF EXISTS clinic_profile_description_length;

-- (3) policy_contact_* 안 이미 nullable (C0007 안 ADD COLUMN · NOT NULL 없음) — 확인만

-- (4) grandfather backfill — 기존 published row 안 NULL 또는 description 80자 미만 검출 시 sentinel compliance_record 안 legacyGrandfathered=true
-- (ClinicProfile 안 status 컬럼 없음 — 무조건 published 처리 · 별 marker 안 metadata 안 보존)
UPDATE compliance_record cr
   SET metadata = cr.metadata || '{"legacyGrandfathered": true, "grandfatheredAt": "2026-05-19", "reason": "AUX-redesign-v1-backfill-clinic-profile"}'::jsonb
  FROM clinic_profile cp
 WHERE cr.content_type = 'ClinicProfile'::compliance_content_type
   AND cr.content_ref = cp.slug
   AND cr.instance_id = cp.instance_id
   AND cr.record_phase = 'published'
   AND (cp.logo_url IS NULL OR cp.og_image_url IS NULL OR cp.description IS NULL OR length(cp.description) < 80);
