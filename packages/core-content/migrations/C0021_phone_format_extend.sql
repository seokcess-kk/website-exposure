-- @glitzy/core-content C0021 — 전화번호 CHECK 확장 (2026-05-19)
-- 한국 대표번호 (15XX/16XX/18XX/19XX 4자리 + 4자리) 분기 추가.
-- 기존: 일반 02-1234-5678 · 모바일 010-1234-5678 · 국제 +82-2-1234-5678
-- 신규: 대표번호 1533-8191 형태 (앞 [5-9][0-9]{2} + 4자리)
-- 영향: location_profile.phone · clinic_profile.policy_contact_phone 2 table
-- form regex (apps/web/src/lib/clinic-profile-schema.ts PHONE_REGEX) 와 정합 유지

ALTER TABLE location_profile DROP CONSTRAINT IF EXISTS location_profile_phone_format;
ALTER TABLE location_profile ADD CONSTRAINT location_profile_phone_format CHECK (
  phone IS NULL
  OR phone ~ '^((\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}|1[5-9][0-9]{2}[- ]?[0-9]{4})$'
);

ALTER TABLE clinic_profile DROP CONSTRAINT IF EXISTS clinic_profile_policy_phone_format;
ALTER TABLE clinic_profile ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
  policy_contact_phone IS NULL
  OR policy_contact_phone ~ '^((\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}|1[5-9][0-9]{2}[- ]?[0-9]{4})$'
);
