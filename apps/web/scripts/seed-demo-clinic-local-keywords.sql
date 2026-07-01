-- @glitzy/web/scripts/seed-demo-clinic-local-keywords.sql
-- SEO_HOME_METADATA — clinic.metadata.localKeywords 채우기 (홈 <title> 지역 키워드 활성화).
--
-- 배경: 홈 generateMetadata 가 pageTitle = clinic.metadata.localKeywords[0] ?? clinic.name 로
--   SEO <title> 를 만든다(feat 806023a). localKeywords 가 비어 있으면 "다이트한의원"(brand only)로
--   fallback 되어 지역 키워드("부평 다이어트 한의원")가 title 에 노출되지 않는다.
--   이 seed 가 metadata.localKeywords 를 병합해 홈 title 을 "부평 다이어트 한의원 | 다이트한의원" 으로 만든다.
--   (첫 항목 = 홈 title 키워드 · 나머지 = 로컬 SEO 지원 · applyLocalPrefix 의 지역 modifier 도 여기서 파생.)
--
-- 안전: jsonb `||` 병합 — 기존 키(naverPlace·treatmentPillars 등) 보존.
--   localKeywords 가 이미 비어있지 않은 배열이면 skip(운영자 커스텀 미클로버). 가역·idempotent.
--   NOTE: seed 는 DB 직접 write 라 ISR 캐시를 무효화하지 않는다 → 공개 사이트 title 은 revalidate 창(≤5분)
--     또는 다음 배포 후 반영. 즉시 반영하려면 어드민 "의원 정보" 저장(revalidatePublicSite) 한 번으로 대체 가능.
--
-- 실행: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-clinic-local-keywords.sql

DO $$
DECLARE
  v_instance UUID;
BEGIN
  SELECT id INTO v_instance FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance IS NULL THEN
    RAISE EXCEPTION 'seed-demo-clinic-local-keywords: instance slug=demo 미발견.';
  END IF;
  PERFORM set_config('app.current_instance_id', v_instance::text, true);

  UPDATE clinic_profile
     SET metadata = metadata || $j$
       {
         "localKeywords": [
           "부평 다이어트 한의원",
           "인천 부평 다이어트 한약",
           "부평역 다이어트 한의원",
           "부평 한방 다이어트"
         ]
       }
     $j$::jsonb,
         updated_at = NOW()
   WHERE instance_id = v_instance
     AND slug = 'clinic'
     AND COALESCE(
           CASE WHEN jsonb_typeof(metadata->'localKeywords') = 'array'
                THEN jsonb_array_length(metadata->'localKeywords')
                ELSE 0 END, 0) = 0;

  IF FOUND THEN
    RAISE NOTICE 'seed-demo-clinic-local-keywords: localKeywords 4건 병합(기존 키 보존). 홈 title → "부평 다이어트 한의원 | <brand>".';
  ELSE
    RAISE NOTICE 'seed-demo-clinic-local-keywords: localKeywords 이미 존재 — skip(idempotent).';
  END IF;
END $$;
