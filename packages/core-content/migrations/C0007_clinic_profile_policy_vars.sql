-- @glitzy/core-content — C0007 ClinicProfile policy vars + primaryCtas (LOCATION_LEGAL_PLAN v1.0)
-- Precondition: C0001 clinic_profile

-- LL-SCHEMA-07~12: 정책 변수 4 column + primary_ctas (CT-03 SoT JSONB array)
ALTER TABLE clinic_profile
  ADD COLUMN policy_contact_person TEXT,
  ADD COLUMN policy_contact_email TEXT,
  ADD COLUMN policy_contact_phone TEXT,
  ADD COLUMN policy_effective_date DATE,
  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
    policy_contact_email IS NULL
    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- LL-SCHEMA-10 + cycle1 LL-20: 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제). 점 구분/extension 거절
  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
    policy_contact_phone IS NULL
    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  ),
  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
    jsonb_typeof(primary_ctas) = 'array'
  );

-- cycle3 LL-38 + cycle4 LL-48·LL-50·LL-54 patch:
--   - PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
--   - trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (IMMUTABLE 마킹 제거).
--   - DB trigger 허용 11종 (CT-03 SoT 전체). UI subset 3종은 form zod 가 분리 검증.
--   - RAISE EXCEPTION USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape' →
--     errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능.
CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
RETURNS TRIGGER AS $$
DECLARE
  elem JSONB;
  valid_types CONSTANT TEXT[] := ARRAY[
    'phone', 'email', 'sms',
    'kakao-talk', 'kakao-channel',
    'naver-reservation', 'naver-talk',
    'form', 'map', 'external', 'video-consultation'
  ];
BEGIN
  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
    RAISE EXCEPTION 'primary_ctas must be a JSON array'
      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  END IF;
  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing id'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing label'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clinic_profile_primary_ctas_trigger
  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
