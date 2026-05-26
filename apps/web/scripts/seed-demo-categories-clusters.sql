-- @glitzy/web/scripts/seed-demo-categories-clusters.sql
-- EXPOSURE_READINESS Phase C — 7 신규 cluster 카테고리 추가 (기존 3 유지).
-- 외부 비평 제안 그대로 채택 — topical authority 강화 + 운영자 재분류 가능.
--
-- 클러스터 정의:
--   1. weight-loss-science  체중감량 원리       (다이어트 과학·메커니즘·근거 기반)
--   2. lifecycle-diet       생애주기 다이어트   (산후·갱년기·사춘기·노년 등 단계별)
--   3. herbal-prescription  한약·처방           (한약 종류·약침·처방 가이드)
--   4. yoyo-maintenance     요요·유지관리       (감량 후 평생 유지·요요 차단)
--   5. body-shape           체형·부분비만       (복부·하체·상체 부분 관리)
--   6. lifestyle-diet       생활습관·식단       (식단·운동·수면·스트레스 코칭)
--   7. precautions          부작용·주의사항     (안전성·금기·부작용 안내)

DO $$
DECLARE
  v_instance_id UUID;
  v_seed RECORD;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-categories-clusters: instance slug=demo 미발견.';
  END IF;

  FOR v_seed IN
    SELECT * FROM (VALUES
      ('weight-loss-science',  '체중감량 원리',     '다이어트의 과학적 메커니즘과 근거 기반 정보를 다룹니다. 어떻게 살이 빠지고 유지되는지의 원리, 호르몬·대사·식욕 조절의 작동 방식을 임상 관점에서 설명합니다.',  10),
      ('lifecycle-diet',       '생애주기 다이어트', '산후·갱년기·사춘기·노년 등 인생 단계별 체중 관리 전략. 단계별 호르몬·신체 변화에 따른 맞춤 한방 접근법과 주의사항을 의료진이 직접 정리한 가이드입니다.',  20),
      ('herbal-prescription',  '한약·처방',         '다이어트 한약·약침·처방 가이드. 다이트한의원의 처방 철학, 한약재 구성 원리, 임상 사례 정리. 한약을 처음 접하는 분도 안전하게 이해할 수 있도록 풀어 설명합니다.',  30),
      ('yoyo-maintenance',     '요요·유지관리',     '감량 후 평생 유지 노하우 — 요요 발생 메커니즘, 사후 관리 프로토콜, 기초대사량 회복 전략. 다이어트의 본질은 감량이 아니라 유지라는 관점에서 풀어 정리합니다.',  40),
      ('body-shape',           '체형·부분비만',     '복부·하체·상체·얼굴 등 부분 비만 관리. 체형별 맞춤 접근법과 한방 약침·식이·운동 조합. 체질 진단을 통한 개인별 우선 부위 평가 사례를 포함합니다.',  50),
      ('lifestyle-diet',       '생활습관·식단',     '식단·운동·수면·스트레스 통합 코칭. 일상 안에서 실천 가능한 한방 다이어트 가이드 — 단순 칼로리 제한이 아닌, 평생 유지 가능한 라이프스타일 정착을 다룹니다.',  60),
      ('precautions',          '부작용·주의사항',   '한방 다이어트의 안전성·금기·부작용 안내. 진료 전 반드시 알아야 할 내용, 임신·수유·만성질환 환자의 주의점, 약물 상호작용 등 의료광고법 정합 안내 모음.',  70)
    ) AS s(slug, name, description, display_order)
  LOOP
    INSERT INTO article_category (
      instance_id, slug, name, description, display_order
    ) VALUES (
      v_instance_id, v_seed.slug, v_seed.name, v_seed.description, v_seed.display_order
    )
    ON CONFLICT (instance_id, slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      display_order = EXCLUDED.display_order,
      updated_at = NOW();
    RAISE NOTICE 'category cluster: slug=% name=% order=%', v_seed.slug, v_seed.name, v_seed.display_order;
  END LOOP;

  -- 기존 3 카테고리 (general · diet · health) 도 유지 — display_order 만 뒤로 밀어 7 신규 cluster 가 우선 노출.
  --   운영자가 어드민에서 articles 재분류 후 기존 3 카테고리 삭제 가능.
  UPDATE article_category SET display_order = 100, updated_at = NOW()
   WHERE instance_id = v_instance_id AND slug = 'general';
  UPDATE article_category SET display_order = 101, updated_at = NOW()
   WHERE instance_id = v_instance_id AND slug = 'diet';
  UPDATE article_category SET display_order = 102, updated_at = NOW()
   WHERE instance_id = v_instance_id AND slug = 'health';

  RAISE NOTICE 'seed-demo-categories-clusters: 7 신규 cluster + 기존 3 유지 (display_order 뒤로 밀림)';
END $$;
