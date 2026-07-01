-- @glitzy/web/scripts/rename-instance-slug-to-daeatdiet-incheon.sql
-- 인스턴스 slug 변경: demo → daeatdiet-incheon (1회성 prod 운영 작업).
--
-- 안전: 데이터는 instance_id(UUID) 기준이라 slug 만 바뀌고 테넌트 데이터·멤버십·세션 전부 보존.
--   instance.slug 는 UNIQUE + regex CHECK('^[a-z0-9][a-z0-9-]{2,63}$'). 'daeatdiet-incheon' 유효(17자).
--   멱등: 이미 daeatdiet-incheon 이면 skip. 가역: 되돌리려면 반대로 UPDATE.
--
-- ⚠️ 반드시 함께: Vercel env
--     CUSTOM_DOMAIN_MAP     = {"bupyeong.key-mom.kr":"daeatdiet-incheon"}
--     DEMO_DEFAULT_INSTANCE_SLUG = daeatdiet-incheon   (데모 자동로그인 사용 시)
--   DB slug 와 CUSTOM_DOMAIN_MAP 이 어긋나면 공개 사이트가 404. env 변경 후 redeploy 필요.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/rename-instance-slug-to-daeatdiet-incheon.sql

DO $$
DECLARE
  v_id UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM instance WHERE slug = 'daeatdiet-incheon') THEN
    RAISE NOTICE 'rename-instance-slug: 이미 daeatdiet-incheon 존재 — skip(idempotent).';
    RETURN;
  END IF;

  SELECT id INTO v_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'rename-instance-slug: slug=demo instance 미발견 (이미 변경됐거나 slug 상이).';
  END IF;

  UPDATE instance SET slug = 'daeatdiet-incheon' WHERE id = v_id;
  RAISE NOTICE 'rename-instance-slug: instance % slug demo → daeatdiet-incheon 완료. (Vercel env·redeploy 잊지 말 것)', v_id;
END $$;
