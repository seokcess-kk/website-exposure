-- @glitzy/web/scripts/seed-demo-cluster-pillar-map.sql
-- INTERNAL_LINK_AUTOMATION v1 — cluster ↔ Pillar 매핑(article_category.pillar) 채우기.
--
-- 목적: 렌더타임 자동 교차링크의 1차 신호(article_category.pillar == treatment_page.pillar_slug)를
--   데모에서 활성화. KEYWORD_URL_MAPPING § 2.3 의 "cluster ↔ Pillar/Treatment" 매핑을 기존 컬럼에 인코딩.
--
-- 안전: 7 cluster 중 Pillar 매핑이 분명한 항목만 설정(precautions/general/diet/health 는 미설정).
--   idempotent — ON 재실행 안전(UPDATE only). Pillar slug 는 clinic.metadata.treatmentPillars[].slug 와 동일.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-cluster-pillar-map.sql
--
-- 참고: 자동 교차링크가 실제로 노출되려면 (1) 아티클이 아래 cluster 카테고리에 속하고,
--   (2) 해당 Pillar slug 의 treatment_page(Spoke) 가 1건 이상 published 여야 한다(§ 5.4 재분류는 운영자 작업).

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

  FOR v_seed IN
    SELECT * FROM (VALUES
      ('weight-loss-science', 'diet-treatment'),    -- 체중감량 원리 → 다이어트 치료(전체 wrapper)
      ('lifecycle-diet',      'personalized-diet'),  -- 생애주기 다이어트 → 개인맞춤
      ('herbal-prescription', 'herbal-medicine'),    -- 한약·처방 → 다이트 한약
      ('yoyo-maintenance',    'diet-treatment'),     -- 요요·유지관리 → 다이어트 치료
      ('body-shape',          'body-shaping'),       -- 체형·부분비만 → 체형관리
      ('lifestyle-diet',      'personalized-diet')   -- 생활습관·식단 → 개인맞춤
    ) AS s(category_slug, pillar_slug)
  LOOP
    UPDATE article_category
       SET pillar = v_seed.pillar_slug, updated_at = NOW()
     WHERE instance_id = v_instance_id
       AND slug = v_seed.category_slug
       AND (pillar IS DISTINCT FROM v_seed.pillar_slug);
    IF FOUND THEN
      v_count := v_count + 1;
      RAISE NOTICE 'cluster→pillar: % → %', v_seed.category_slug, v_seed.pillar_slug;
    END IF;
  END LOOP;

  RAISE NOTICE 'seed-demo-cluster-pillar-map: % cluster pillar 매핑 적용(idempotent)', v_count;
END $$;
