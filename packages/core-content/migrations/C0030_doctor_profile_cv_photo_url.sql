-- C0030 — doctor_profile.cv_photo_url 추가
-- 사용자 검수 2026-05-20 — 약력 섹션 전용 사진을 Hero carousel photo_url 과 분리.
-- 약력 톤 (formal portrait) vs Hero 톤 (활기/매거진) 다르게 운영.

ALTER TABLE doctor_profile
  ADD COLUMN IF NOT EXISTS cv_photo_url TEXT;

COMMENT ON COLUMN doctor_profile.cv_photo_url IS
  '약력 섹션 전용 사진 URL — Hero carousel 의 photo_url 과 별도. 권장 4:5 인물 portrait.';
