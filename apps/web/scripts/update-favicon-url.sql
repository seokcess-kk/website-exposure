-- 2026-07-08 다이트한의원 정사각형 파비콘 (D 모노그램 480px PNG · Supabase Storage) 반영
-- 네이버/구글 SERP 파비콘 요건: 정사각형 1:1 — 기존 가로형 로고(114x36) 폴백이 원인이라 전용 favicon_url 지정.
-- 대전점도 동일 브랜드(다이트한의원)라 같은 파일 사용.

UPDATE clinic_profile cp
SET favicon_url = 'https://yqippqpkqhdcuugjyoeu.supabase.co/storage/v1/object/public/website-exposure-uploads/admin/daeatdiet-incheon/favicon/1783489718200-favicon.png',
    updated_at = now()
FROM instance i
WHERE cp.instance_id = i.id
  AND i.slug IN ('daeatdiet-incheon', 'daeatdiet-daejeon');

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT i.slug, cp.favicon_url
    FROM clinic_profile cp JOIN instance i ON cp.instance_id = i.id
    WHERE i.slug IN ('daeatdiet-incheon', 'daeatdiet-daejeon')
  LOOP
    RAISE NOTICE '% -> %', r.slug, r.favicon_url;
  END LOOP;
END $$;
