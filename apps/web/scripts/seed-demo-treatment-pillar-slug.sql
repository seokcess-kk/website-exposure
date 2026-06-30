-- @glitzy/web/scripts/seed-demo-treatment-pillar-slug.sql
-- INTERNAL_LINK_AUTOMATION v1 — treatment_page.pillar_slug 채우기 (Pillar/Spoke 구조 활성화).
--
-- 배경: prod 데모의 16개 시술이 모두 pillar_slug=NULL 이라 Pillar/Spoke 계층이 휴면 상태였다.
--   이 시드가 Spoke → 자기 Pillar 를 배정해: (1) 시술 상세 "세부 진료/같은 영역의 다른 진료",
--   (2) breadcrumb Pillar 링크, (3) /treatments 클러스터 그룹핑·홈 Pillar 카드 앵커,
--   (4) 아티클↔시술 자동 교차링크(article_category.pillar 매칭)를 모두 활성화한다.
--
-- 매핑 근거: 홈 page.tsx TREATMENT_PILLARS_FALLBACK 의 canonical subtitle 택소노미.
--   diet-treatment  = 굿바이 다이어트 · 당질조절 · 요요방지 (+ 디톡스)
--   personalized-diet = 3GO · 갱년기 · 산후 · 마른비만 · 소아비만
--   body-shaping    = 지방분해약침 · 다이트라인
--   herbal-medicine = 원외탕전(현재 별도 Spoke 시술 없음)
--
-- 안전: pillar_slug 메타만 설정 (additive). 공개 URL /treatments/{slug} 불변. 가역(SET pillar_slug=NULL).
--   4 Pillar 페이지(diet-treatment·personalized-diet·body-shaping·herbal-medicine)는 pillar_slug=NULL 유지
--   (= 자체가 Pillar). 운영자 검토 후 조정 가능.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-treatment-pillar-slug.sql

DO $$
DECLARE
  v_instance_id UUID;
  v_seed RECORD;
  v_count INT := 0;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-treatment-pillar-slug: instance slug=demo 미발견.';
  END IF;
  PERFORM set_config('app.current_instance_id', v_instance_id::text, true);

  FOR v_seed IN
    SELECT * FROM (VALUES
      -- diet-treatment Pillar 의 Spoke
      ('goodbye-diet',                'diet-treatment'),
      ('detox-program',              'diet-treatment'),
      ('carb-control',               'diet-treatment'),
      ('yoyo-prevention',            'diet-treatment'),
      -- personalized-diet Pillar 의 Spoke
      ('three-go-diet',              'personalized-diet'),
      ('menopause-diet',            'personalized-diet'),
      ('postpartum-diet',           'personalized-diet'),
      ('postpartum-recovery',       'personalized-diet'),
      ('slim-obesity-diet',         'personalized-diet'),
      ('child-obesity-diet',        'personalized-diet'),
      -- body-shaping Pillar 의 Spoke
      ('lipolysis-pharmacopuncture', 'body-shaping'),
      ('daet-line-pharmacopuncture', 'body-shaping')
    ) AS s(slug, pillar_slug)
  LOOP
    UPDATE treatment_page
       SET pillar_slug = v_seed.pillar_slug, updated_at = NOW()
     WHERE instance_id = v_instance_id
       AND slug = v_seed.slug
       AND (pillar_slug IS DISTINCT FROM v_seed.pillar_slug);
    IF FOUND THEN
      v_count := v_count + 1;
      RAISE NOTICE 'spoke->pillar: % -> %', v_seed.slug, v_seed.pillar_slug;
    END IF;
  END LOOP;

  RAISE NOTICE 'seed-demo-treatment-pillar-slug: % Spoke pillar_slug 적용(idempotent · 4 Pillar 페이지는 NULL 유지)', v_count;
END $$;
