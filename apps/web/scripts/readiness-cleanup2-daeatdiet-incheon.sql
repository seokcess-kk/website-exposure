-- 2026-07-08 daeatdiet-incheon 잔여 정리 (readiness-uplift 후속 · idempotent)
--
-- (1) 중복 시술 페이지 2건 stale 처리 — detox-program(본문·요약이 carb-control 과 동일 주제 "당질
--     조절")·postpartum-recovery(postpartum-diet 와 동일 주제). 구형 포맷 legacy 페이지로, 진료
--     목록에 같은 제목이 2번 노출되고 검색 키워드 잠식을 유발 → 공개 목록/사이트맵에서 제외.
-- (2) 키워드 P2 신설 19건 + primary 링크 22건 — 제목에 이미 포함된 라벨만 (시술 프로그램명 13 +
--     브랜드/지역 변형 4 + 정보형 2). 기존 P0/P1 추적 키워드와 구분되게 전부 P2.
-- (3) 시술 요약 14건 보강 (80자 미만 → 80~200자) — 절차 서술만 추가, 효능 단정 표현 없음.

DO $$
DECLARE
  iid UUID;
  n INT;
BEGIN
  SELECT id INTO iid FROM instance WHERE slug = 'daeatdiet-incheon';
  IF iid IS NULL THEN RAISE EXCEPTION 'instance not found'; END IF;

  -- (1) legacy 중복 시술 stale 처리
  UPDATE treatment_page SET status = 'stale', updated_at = NOW()
   WHERE instance_id = iid AND slug IN ('detox-program', 'postpartum-recovery') AND status = 'published';
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(1) legacy 시술 stale: % 건', n;

  -- (2-1) 키워드 P2 신설 (label = 제목 포함 검증된 표기)
  INSERT INTO keyword_target (id, instance_id, slug, label, keyword_type, intent, priority, status, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.slug, v.label, 'secondary', v.intent, 'P2', 'active', '{}'::jsonb, NOW(), NOW()
  FROM (VALUES
    ('다이트한의원',        '다이트한의원',        'local'),
    ('다이어트한의원',       '다이어트한의원',       'local'),
    ('부평-다이어트-한의원', '부평 다이어트 한의원', 'local'),
    ('인천-다이어트-한의원', '인천 다이어트 한의원', 'local'),
    ('사상체질-다이어트',    '사상체질 다이어트',    'informational'),
    ('한방-다이어트',        '한방 다이어트',        'informational'),
    ('굿바이-다이어트',      '굿바이 다이어트',      'pre-booking'),
    ('다이트-한약',          '다이트 한약',          'pre-booking'),
    ('다이어트-치료',        '다이어트 치료',        'informational'),
    ('개인맞춤-다이어트',    '개인맞춤 다이어트',    'pre-booking'),
    ('3go-다이어트',         '3GO 다이어트',         'pre-booking'),
    ('갱년기-다이어트',      '갱년기 다이어트',      'informational'),
    ('다이트라인-약침',      '다이트라인 약침',      'pre-booking'),
    ('마른비만-다이어트',    '마른비만 다이어트',    'informational'),
    ('소아비만-다이어트',    '소아비만 다이어트',    'informational'),
    ('요요방지-프로그램',    '요요방지 프로그램',    'pre-booking'),
    ('지방분해약침',         '지방분해약침',         'pre-booking'),
    ('체형관리',             '체형관리',             'informational'),
    ('출산-전후-다이어트',   '출산 전후 다이어트',   'informational')
  ) AS v(slug, label, intent)
  ON CONFLICT (instance_id, slug) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(2-1) 키워드 P2 신설: % 건', n;

  -- (2-2) primary 콘텐츠 링크 (제목에 라벨 실포함 검증)
  INSERT INTO keyword_content_link (id, instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, kt.id, v.etype, v.eid::uuid, 85, true, '{}'::jsonb, NOW(), NOW()
  FROM (VALUES
    -- 브랜드/지역/정보형 → 아티클
    ('다이트한의원',        'Article', 'ef42b518-a221-404c-bed4-73ef3fe3d174'),
    ('다이트한의원',        'Article', '72768431-e4c2-46ac-b99e-b84b8a895efe'),
    ('다이트한의원',        'Article', '4477b1a9-a89b-4c79-b58d-72f7d1fdf020'),
    ('다이어트한의원',       'Article', 'a45bd334-4979-42ce-b298-87ab4ae6ee15'),
    ('다이어트한의원',       'Article', '4225b35c-c16a-4754-8b74-b170e462c039'),
    ('부평 다이어트 한의원', 'Article', '7ce111ec-7181-4353-a147-b4c7073f8cd3'),
    ('인천 다이어트 한의원', 'Article', 'a65e75e0-0dd7-4ce9-b2a5-860c28367a64'),
    ('사상체질 다이어트',    'Article', 'fb93d028-af69-4822-aeaa-89a1c967588f'),
    ('한방 다이어트',        'Article', '31c76ba2-3e3b-4516-8381-b8a2e4a2f5c4'),
    -- 프로그램명 → 시술 (stale 2건 제외)
    ('굿바이 다이어트',      'TreatmentPage', '72d24213-8bc0-4692-9797-6792eddff767'),
    ('다이트 한약',          'TreatmentPage', '49b3f28e-4d16-4335-9b94-8504110b74d6'),
    ('다이어트 치료',        'TreatmentPage', 'a158fe89-3592-43f0-86a3-a3e1f7e41c27'),
    ('개인맞춤 다이어트',    'TreatmentPage', '1e7dcca7-1a56-4b6d-9ec9-ea39690ff67e'),
    ('3GO 다이어트',         'TreatmentPage', '4c0a0585-de76-483f-a4d9-737a19851b65'),
    ('갱년기 다이어트',      'TreatmentPage', '8f463ec9-ec2e-4514-94db-68611f78bc82'),
    ('다이트라인 약침',      'TreatmentPage', 'c8511821-1b4c-4d8c-bc17-173a75725b3b'),
    ('마른비만 다이어트',    'TreatmentPage', '2c56643b-fb9f-4f23-b33d-b87911a29151'),
    ('소아비만 다이어트',    'TreatmentPage', '79aea855-f962-4ed4-85ab-bbde5e0dbd37'),
    ('요요방지 프로그램',    'TreatmentPage', 'ecf84504-332e-4e46-abf5-8ff88bddabfc'),
    ('지방분해약침',         'TreatmentPage', 'a6442999-d220-41f9-bace-7136aeb5b680'),
    ('체형관리',             'TreatmentPage', '01dfe130-da20-47d6-b1ad-ec0769be29b6'),
    ('출산 전후 다이어트',   'TreatmentPage', '96050819-123d-4c23-a0f1-c2b468c27ba7')
  ) AS v(label, etype, eid)
  JOIN keyword_target kt ON kt.instance_id = iid AND kt.label = v.label
  ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(2-2) primary 링크: % 건', n;

  -- (3) 시술 요약 보강 (80~200자 · 절차 서술만)
  UPDATE treatment_page t SET summary = v.s, updated_at = NOW()
  FROM (VALUES
    ('three-go-diet', '한약·식이·운동 3축을 결합해 환자 개개인의 일상에 맞게 코칭하는 본원의 개인맞춤 다이어트 진료입니다. 체질 진단 결과에 따라 세 축의 비중을 조정하며, 생활 패턴을 무너뜨리지 않는 지속 가능한 감량 계획을 함께 설계합니다.'),
    ('personalized-diet', '갱년기·출산 전후·마른비만·소아비만 등 체질과 생활 단계에 따라 진료 방향을 달리하는 개인맞춤 다이어트 영역을 안내합니다. 첫 진료에서 체질과 생활 단계를 확인한 뒤 알맞은 프로그램을 제안합니다.'),
    ('menopause-diet', '갱년기 호르몬 변화기 체중 관리를 위한 한방 진료. 갱년기 증상(상열감·수면 변화) 관리를 함께 고려합니다. 호르몬 변화로 달라진 대사 상태를 진단하고, 무리한 감량보다 지속 가능한 관리 계획을 세웁니다.'),
    ('goodbye-diet', '체질 진단부터 3개월 사후 관리까지 진행하는 본원의 시그니처 한방 다이어트 프로그램. 본 치료 12주와 사후 관리 12주, 총 24주 여정으로 감량 이후의 요요 관리까지 함께 설계합니다.'),
    ('diet-treatment', '체질 진단부터 사후 관리까지, 다이트한의원의 다이어트 치료 영역을 안내합니다. 굿바이 다이어트·당질조절·요요방지를 포괄합니다. 첫 진료에서 체질을 확인한 뒤 알맞은 프로그램을 제안합니다.'),
    ('herbal-medicine', '원외 탕전과 엄선된 한약 재료, 환자 체질별 처방을 통해 안전과 품질을 함께 추구하는 본원의 한약 영역입니다. 한의사 진단 후 체질에 맞춰 처방하며, 복용 중 반응에 따라 처방을 조정합니다.'),
    ('daet-line-pharmacopuncture', '본원 자체 처방 약침을 활용한 체형 관리 보조 시술. 한의사 진단 후 시술하며, 시술 전후 한약 처방을 함께 고려합니다. 부위별 상태를 확인한 뒤 시술 범위와 횟수를 안내합니다.'),
    ('carb-control', '당질(탄수화물) 섭취 패턴과 인슐린 저항성을 함께 고려한 한방 다이어트 진료. 식이 코칭과 한약 처방을 병행합니다. 첫 진료에서 당질 섭취 습관을 확인해 개인별 조절 목표를 설정합니다.'),
    ('slim-obesity-diet', '체중은 정상 범위지만 체지방률이 높은 마른비만의 한방 다이어트 진료. 체지방률·근육량을 함께 살핍니다. 겉보기 체중이 아닌 체성분 변화를 목표로 식이와 한약 계획을 설계합니다.'),
    ('child-obesity-diet', '성장기 안전을 가장 우선으로 진행하는 한방 소아 비만 진료. 보호자 동반 진료와 식습관 가이드를 함께 운영합니다. 성장에 필요한 영양은 유지하면서 식습관 교정을 진행합니다.'),
    ('yoyo-prevention', '다이어트 종료 후 체중 관리에 초점을 둔 후속 프로그램. 본원 또는 타원에서 다이어트를 진행한 환자 모두 진료 가능합니다. 감량 이후의 대사 상태와 생활 습관을 점검해 유지 계획을 함께 세웁니다.'),
    ('lipolysis-pharmacopuncture', '한방 약침을 활용한 부위별 체형 관리 보조 시술. 한의사 진단 후 시술 결정, 시술 전후 한약을 함께 고려합니다. 부위별 상태를 확인한 뒤 시술 여부와 횟수를 함께 정합니다.'),
    ('body-shaping', '한방 약침과 체형 코칭을 결합한 본원의 체형관리 영역. 한의사 진단 하 안전성 우선의 시술을 진행합니다. 지방분해약침·다이트라인 약침 등 부위별 관리 옵션을 진단 결과에 따라 안내합니다.'),
    ('postpartum-diet', '산후 회복기 체형 관리와 호르몬 균형 회복을 함께 고려하는 한방 산후 진료. 김예진 부원장 주관. 수유 여부와 회복 상태를 우선 확인해 안전한 시작 시점을 함께 정합니다.')
  ) AS v(slug, s)
  WHERE t.instance_id = iid AND t.slug = v.slug AND t.summary IS DISTINCT FROM v.s;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(3) 요약 보강: % 건', n;

  -- 검증
  RAISE NOTICE '=== 검증 ===';
  SELECT COUNT(*) INTO n FROM treatment_page WHERE instance_id = iid AND status = 'published';
  RAISE NOTICE '발행 시술: % (기대 14)', n;
  SELECT COUNT(*) INTO n FROM keyword_target WHERE instance_id = iid;
  RAISE NOTICE '키워드 총: % (기대 37)', n;
  SELECT COUNT(*) INTO n FROM treatment_page WHERE instance_id = iid AND status='published' AND length(summary) < 80;
  RAISE NOTICE '요약 80자 미만 발행 시술: % (기대 0)', n;
END $$;
