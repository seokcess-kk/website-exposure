-- @glitzy/core-content C0051 — clinic_profile.naver_site_verification (네이버 서치어드바이저 소유확인)
-- 네이버 서치어드바이저 "HTML 태그" 소유확인 토큰. 사이트 <head> 에 <meta name="naver-site-verification">
-- 로 출력되어 색인 등록의 전제(소유확인)를 통과. 콘텐츠 metadata 와 분리(전용 컬럼)해 의원정보 저장
-- 시 wipe 위험 없음. nullable — 미설정 시 meta 미출력(silent). manifest 외 patch (C0050 답습).

ALTER TABLE clinic_profile
  ADD COLUMN IF NOT EXISTS naver_site_verification TEXT;

-- 토큰 형식 가드 — 영문/숫자만, 8~200자 (네이버 발급 토큰 · Postgres regex bound 최대 255 이내). NULL 허용.
-- idempotent: 재적용 안전 + 초기 버그판({8,256}) 교체. ADD CONSTRAINT 는 IF NOT EXISTS 미지원 → DROP 선행.
ALTER TABLE clinic_profile
  DROP CONSTRAINT IF EXISTS clinic_profile_naver_site_verification_format;
ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_naver_site_verification_format
  CHECK (naver_site_verification IS NULL OR naver_site_verification ~ '^[A-Za-z0-9]{8,200}$');
