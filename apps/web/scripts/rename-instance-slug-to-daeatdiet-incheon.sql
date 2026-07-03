-- @glitzy/web/scripts/rename-instance-slug-to-daeatdiet-incheon.sql
-- 인스턴스 slug 변경: demo → daeatdiet-incheon (1회성 prod 운영 작업).
--
-- 안전: 데이터는 instance_id(UUID) 기준이라 slug 만 바뀌고 테넌트 데이터·멤버십·세션 전부 보존.
--   instance.slug 는 UNIQUE + regex CHECK('^[a-z0-9][a-z0-9-]{2,63}$'). 'daeatdiet-incheon' 유효(17자).
--   멱등: 이미 daeatdiet-incheon 이면 skip. 가역: 되돌리려면 반대로 UPDATE.
--
-- (실행 완료 · 이력) slug 변경 시 DEMO_DEFAULT_INSTANCE_SLUG = daeatdiet-incheon 도 함께 갱신.
--   2026-07-03: 구 커스텀 도메인 폐기 → daeatdiet-incheon 은 BASE_SITE_DOMAIN(onwell.site) 파생으로
--   자동 canonical(daeatdiet-incheon.onwell.site)이라 명시맵(CUSTOM_DOMAIN_MAP) 불필요. (SUBDOMAIN_SCALE_PLAN v1.3)
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
