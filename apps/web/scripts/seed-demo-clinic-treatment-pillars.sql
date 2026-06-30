-- @glitzy/web/scripts/seed-demo-clinic-treatment-pillars.sql
-- INTERNAL_LINK_AUTOMATION v1 — clinic.metadata.treatmentPillars 채우기 (Pillar 라벨/그룹핑 활성화).
--
-- 배경: prod 데모 clinic.metadata 에 treatmentPillars 가 없어(naverPlace 만 존재) 홈은 page.tsx fallback 으로
--   4 카드를 그렸지만, fallback 이 없는 (1) 시술 상세 breadcrumb 의 Pillar 라벨, (2) /treatments 클러스터
--   그룹핑은 비활성이었다. 이 seed 가 metadata 에 treatmentPillars 4건을 병합해 둘을 활성화한다.
--   값은 page.tsx TREATMENT_PILLARS_FALLBACK 와 동일 → 홈 표시는 불변.
--
-- 안전: jsonb `||` 병합 — 기존 키(naverPlace 등) 보존. treatmentPillars 가 이미 있으면 skip(운영자 커스텀 미클로버).
--   가역(metadata = metadata - 'treatmentPillars'). idempotent.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-clinic-treatment-pillars.sql

DO $$
DECLARE
  v_instance UUID;
BEGIN
  SELECT id INTO v_instance FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance IS NULL THEN
    RAISE EXCEPTION 'seed-demo-clinic-treatment-pillars: instance slug=demo 미발견.';
  END IF;
  PERFORM set_config('app.current_instance_id', v_instance::text, true);

  UPDATE clinic_profile
     SET metadata = metadata || $j$
       {
         "treatmentPillars": [
           {"slug":"diet-treatment","icon":"mdi:scale-bathroom","title":"다이어트 치료","subtitle":"굿바이 다이어트 · 당질조절 · 요요방지"},
           {"slug":"personalized-diet","icon":"mdi:account-heart-outline","title":"개인맞춤 다이어트","subtitle":"3GO · 갱년기 · 산후 · 마른비만 · 소아비만"},
           {"slug":"body-shaping","icon":"mdi:human-male-height","title":"체형관리","subtitle":"지방분해약침 · 다이트라인 · 밀착 코칭"},
           {"slug":"herbal-medicine","icon":"mdi:leaf","title":"다이트 한약","subtitle":"원외탕전 · 엄선된 한약 재료"}
         ]
       }
     $j$::jsonb,
         updated_at = NOW()
   WHERE instance_id = v_instance
     AND slug = 'clinic'
     AND NOT (metadata ? 'treatmentPillars');

  IF FOUND THEN
    RAISE NOTICE 'seed-demo-clinic-treatment-pillars: treatmentPillars 4건 병합(naverPlace 등 기존 키 보존).';
  ELSE
    RAISE NOTICE 'seed-demo-clinic-treatment-pillars: 이미 treatmentPillars 존재 — skip(idempotent).';
  END IF;
END $$;
