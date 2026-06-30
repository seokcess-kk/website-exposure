-- @glitzy/web/scripts/seed-demo-cluster-pillar-map.sql
-- INTERNAL_LINK_AUTOMATION v1 — cluster ↔ Pillar 매핑(article_category.pillar) 채우기.
--
-- 목적: 렌더타임 자동 교차링크의 1차 신호(article_category.pillar == treatment_page.pillar_slug)를
--   데모에서 활성화. KEYWORD_URL_MAPPING § 2.3 의 "cluster ↔ Pillar/Treatment" 매핑을 기존 컬럼에 인코딩.
--
-- 중요(안전): article 을 다른 카테고리로 옮기지 않는다 → 공개 URL `/insights/{category}/{slug}` 불변.
--   카테고리의 pillar 메타만 설정하므로, 해당 카테고리의 모든 아티클이 자동으로 같은 Pillar 의 시술과
--   양방향 교차링크된다. 순수 additive 이며 가역(되돌리기: SET pillar = NULL).
--
-- 'general' → 'diet-treatment': general 은 catch-all 이라, 운영자가 7 cluster 로 재분류(+리다이렉트)하기
--   전까지의 실용적 기본값. 다이어트 한의원 특성상 모든 정보 글이 핵심 진료(diet-treatment)로 funnel 되는 것이
--   SEO 상 타당. 재분류 후에는 이 줄을 제거하거나 NULL 로 되돌리면 된다.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-cluster-pillar-map.sql
--   (SEED_DATABASE_URL = Supabase Session pooler 5432)
--
-- 참고: 자동 교차링크가 실제로 노출되려면 해당 Pillar slug 의 treatment_page(Spoke) 가 1건 이상 published 여야 한다.
--   데모 기준 treatment 가 있는 Pillar = diet-treatment(굿바이/디톡스) · personalized-diet(산후). body-shaping·herbal-medicine
--   은 현재 시술 row 가 없어 매칭 0(graceful) — 해당 Pillar 시술 추가 시 자동 노출.

DO $$
DECLARE
  v_instance_id UUID;
  v_seed RECORD;
  v_count INT := 0;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-cluster-pillar-map: instance slug=demo 미발견.';
  END IF;
  -- RLS tenant_isolation 통과 (다른 seed 동일 패턴) — UPDATE 가 0 row 가 되지 않도록.
  PERFORM set_config('app.current_instance_id', v_instance_id::text, true);

  FOR v_seed IN
    SELECT * FROM (VALUES
      -- 7 cluster (EXPOSURE_READINESS Phase C) → Pillar
      ('weight-loss-science', 'diet-treatment'),    -- 체중감량 원리 → 다이어트 치료(전체 wrapper)
      ('lifecycle-diet',      'personalized-diet'),  -- 생애주기 다이어트 → 개인맞춤
      ('herbal-prescription', 'herbal-medicine'),    -- 한약·처방 → 다이트 한약
      ('yoyo-maintenance',    'diet-treatment'),     -- 요요·유지관리 → 다이어트 치료
      ('body-shape',          'body-shaping'),       -- 체형·부분비만 → 체형관리
      ('lifestyle-diet',      'personalized-diet'),  -- 생활습관·식단 → 개인맞춤
      -- 기존 3 catch-all 카테고리 → Pillar (재분류 전 실용 기본값 · 데모 아티클 대부분이 여기 소속)
      ('general',             'diet-treatment'),     -- 일반 → 다이어트 치료
      ('diet',                'diet-treatment'),     -- 다이어트 → 다이어트 치료
      ('health',              'personalized-diet')   -- 건강 → 개인맞춤
    ) AS s(category_slug, pillar_slug)
  LOOP
    UPDATE article_category
       SET pillar = v_seed.pillar_slug, updated_at = NOW()
     WHERE instance_id = v_instance_id
       AND slug = v_seed.category_slug
       AND (pillar IS DISTINCT FROM v_seed.pillar_slug);
    IF FOUND THEN
      v_count := v_count + 1;
      RAISE NOTICE 'cluster->pillar: % -> %', v_seed.category_slug, v_seed.pillar_slug;
    END IF;
  END LOOP;

  RAISE NOTICE 'seed-demo-cluster-pillar-map: % cluster pillar 매핑 적용(idempotent · article URL 불변)', v_count;
END $$;
