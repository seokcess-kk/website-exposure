-- @glitzy/core-content C0052 — clinic_profile.favicon_url (정사각형 전용 파비콘)
-- 브라우저 탭·검색결과 아이콘용 정사각형 이미지 URL. 지금까지 logo_url(가로형) 을 favicon 으로
-- 재사용해 리사이즈 왜곡 소지가 있었음 → 정사각형 전용 컬럼 분리. 미설정(NULL) 시 사이트는
-- 로고 → 기본 아이콘(app/icon.svg) 순으로 대체. logo_url/og_image_url 과 동일한 이미지 URL
-- 필드로 취급(의원정보 번들 저장에 포함 — naver_site_verification 처럼 별도 액션 아님).
-- manifest 외 patch (C0051 답습).
--
-- CHECK: logo_url/og_image_url 에 URL 형식 CHECK 가 없으므로(C0001 이후 C0023a 에서 NOT NULL
-- 까지 제거) favicon_url 도 CHECK 없이 nullable TEXT 만 추가한다. idempotent (ADD COLUMN IF NOT EXISTS).

ALTER TABLE clinic_profile
  ADD COLUMN IF NOT EXISTS favicon_url TEXT;
