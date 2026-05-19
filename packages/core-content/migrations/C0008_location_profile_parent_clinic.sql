-- @glitzy/core-content — C0008 LocationProfile parentClinic (LOCATION_LEGAL_PLAN v1.0)
-- Precondition: C0001 clinic_profile + clinic_profile_instance_id_unique · C0002 location_profile

-- LL-SCHEMA-13~15 + cycle1 LL-01 + cycle2 LL-28 patch:
--   parentClinic (C-21 required) 관계 모델. same-tenant composite FK 보장.
--   모든 row clinic_profile_id NOT NULL (skeleton 가정: row 없음. backfill 부담은 LL-DEFER-14).

-- LLC-13 patch (cycle 1 code review): preflight 정책 명시.
--   본 migration 은 nullable column 추가 후 즉시 SET NOT NULL 을 수행한다.
--   skeleton 단계에는 location_profile row 가 없으므로 안전. row 가 이미 존재하는 환경에서는
--   다음 backfill 을 본 migration 전에 수행해야 한다 (LL-DEFER-14 cascade — M0 v1.0 본 구현):
--     UPDATE location_profile l SET clinic_profile_id = c.id
--       FROM clinic_profile c
--      WHERE l.clinic_profile_id IS NULL
--        AND c.instance_id = l.instance_id
--        AND c.slug = 'clinic';
--   row 가 남아있는데 backfill 매핑이 없는 경우 SET NOT NULL 단계에서 23502(not_null_violation)
--   가 발생하며 의도된 fail-fast 다.
ALTER TABLE location_profile
  ADD COLUMN clinic_profile_id UUID,
  ADD CONSTRAINT location_profile_clinic_fk
    FOREIGN KEY (instance_id, clinic_profile_id)
    REFERENCES clinic_profile (instance_id, id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

-- LL-SCHEMA-14: 전 row NOT NULL (C-21 parentClinic SoT 정합)
ALTER TABLE location_profile
  ALTER COLUMN clinic_profile_id SET NOT NULL;

CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);

-- cycle2 LL-29 + cycle3 LL-44: main slug 1 row 강제는 server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15.
-- 본 migration 은 composite FK 만 추가. DB trigger 합류는 M0 v1.0 본 구현 cascade.
