-- @glitzy/web/scripts/seed-demo-consultations — 1:1 비밀 상담소 더미 10건 (다이트 다이어트 한의원 톤)
\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo';

  INSERT INTO consultation_request (
    instance_id, title, display_name, contact_phone, contact_email, message, status, created_at
  ) VALUES
    (v_instance_id,
     '1개월에 5kg 감량 가능한가요? 출장이 잦아요',
     '익명 김** (32세 · 여)',
     NULL, NULL,
     '직장인이라 출장이 자주 있어서 1개월 안에 빠르게 감량이 가능할지 궁금합니다. 평소 식사 시간도 불규칙합니다.',
     'open', NOW() - INTERVAL '2 hours'),
    (v_instance_id,
     '임신 준비 중인데 다이어트 한약 복용 가능한가요?',
     '익명 박** (29세 · 여)',
     NULL, NULL,
     '임신 준비를 시작하면서 체중 관리가 필요한데, 한약 복용이 가능한지 또는 임신 후 어떻게 진행하는 게 좋은지 상담하고 싶습니다.',
     'in-progress', NOW() - INTERVAL '6 hours'),
    (v_instance_id,
     '다이어트 한약 부작용이 걱정됩니다',
     '익명 이** (45세 · 남)',
     NULL, NULL,
     '한약 복용 시 부작용이나 간 손상 등이 걱정됩니다. 안전성에 대해 자세히 알고 싶습니다.',
     'resolved', NOW() - INTERVAL '1 day'),
    (v_instance_id,
     '출산 후 처진 살 빼기, 어디서부터 시작해야 할까요?',
     '익명 정** (34세 · 여)',
     NULL, NULL,
     '출산 후 6개월째인데 처진 뱃살과 옆구리살이 잘 빠지지 않습니다. 산후 다이어트 프로그램 안내 부탁드립니다.',
     'open', NOW() - INTERVAL '1 day 4 hours'),
    (v_instance_id,
     '갱년기 다이어트 가능한가요?',
     '익명 최** (52세 · 여)',
     NULL, NULL,
     '갱년기 들어서면서 갑자기 살이 찌기 시작했습니다. 호르몬 변화에 맞춘 다이어트가 가능한지 궁금합니다.',
     'in-progress', NOW() - INTERVAL '2 days'),
    (v_instance_id,
     '소아비만, 초등학교 5학년 아이 진료 가능?',
     '익명 한** (학부모)',
     NULL, NULL,
     '초등학교 5학년 아이가 비만이어서 걱정됩니다. 소아 진료가 가능한지, 한약 처방이 안전한지 문의드립니다.',
     'open', NOW() - INTERVAL '3 days'),
    (v_instance_id,
     '비용은 얼마나 드나요? 약 가격과 진료비 총합 알려주세요',
     '익명 오** (38세 · 남)',
     NULL, NULL,
     '진료비와 한약 가격 안 총 비용이 어느 정도 드는지 미리 알고 싶습니다. 프로그램별 가격 안내 부탁드립니다.',
     'resolved', NOW() - INTERVAL '4 days'),
    (v_instance_id,
     '디톡스 프로그램이 다이어트와 다른가요?',
     '익명 강** (27세 · 여)',
     NULL, NULL,
     '디톡스 안 다이어트 안 차이를 잘 모르겠습니다. 어느 프로그램이 제게 맞을지 상담하고 싶습니다.',
     'open', NOW() - INTERVAL '5 days'),
    (v_instance_id,
     '약침 시술이 아픈가요? 통증이 어느 정도?',
     '익명 윤** (41세 · 여)',
     NULL, NULL,
     '약침 시술 통증이 걱정됩니다. 처음 받는 사람도 견딜 만한지, 시술 후 일상 생활은 가능한지 궁금합니다.',
     'in-progress', NOW() - INTERVAL '6 days'),
    (v_instance_id,
     '주말 진료 가능한가요? 직장인이라 평일 어려워요',
     '익명 김** (35세 · 남)',
     NULL, NULL,
     '직장인이라 평일 진료가 어렵습니다. 토요일 진료 일정과 첫 진료 안 어떻게 진행되는지 안내 부탁드립니다.',
     'resolved', NOW() - INTERVAL '7 days')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'seed-demo-consultations: % 상담 더미',
    (SELECT count(*) FROM consultation_request WHERE instance_id = v_instance_id);
END $$;
