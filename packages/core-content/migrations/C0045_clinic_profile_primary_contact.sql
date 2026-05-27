-- @glitzy/core-content C0045 — clinic_profile primary_contact 4 컬럼 (ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 3)
-- 운영자 ↔ 클라이언트 일상 contact 정보. policy_contact_* (의료법 공개용) 와 의미 분리.
-- 외부 비공개 — admin context 만. site 안 db-projection 미포함.

ALTER TABLE clinic_profile
  ADD COLUMN IF NOT EXISTS primary_contact_name  TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS primary_contact_email TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS primary_contact_role  TEXT NOT NULL DEFAULT '';

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_primary_contact_name_len  CHECK (char_length(primary_contact_name)  <= 100),
  ADD CONSTRAINT clinic_profile_primary_contact_phone_len CHECK (char_length(primary_contact_phone) <= 40),
  ADD CONSTRAINT clinic_profile_primary_contact_email_len CHECK (char_length(primary_contact_email) <= 200),
  ADD CONSTRAINT clinic_profile_primary_contact_role_len  CHECK (char_length(primary_contact_role)  <= 80);
