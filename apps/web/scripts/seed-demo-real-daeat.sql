-- @glitzy/web/scripts/seed-demo-real-daeat — 실 다이트한의원 인천 부평점 안 컨텐츠 UPDATE
-- 사용자 요청 (2026-05-20) — incheon.daeatdiet.com 실 정보 안 demo instance 안 반영.
-- ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · MediaAppearance · FAQ UPDATE.

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_clinic_id UUID;
  v_doc_shin_id UUID;
  v_doc_bang_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN RAISE EXCEPTION 'instance demo not found'; END IF;

  -- (1) ClinicProfile UPDATE — 실 다이트한의원 인천 부평점 정보
  UPDATE clinic_profile SET
    name = '다이트한의원 인천 부평점',
    description = E'다이트한의원은 단순한 체중 감량이 아닌 건강한 몸의 회복을 목표로 합니다.\n환자 한 분 한 분의 체질을 진단하고,\n그에 맞춘 한약 처방·약침·코칭을 통해 무리 없는 다이어트와 평생 유지되는 결과를 약속합니다.',
    slogan = E'Hello, new me\n새로운 나를 만나다',
    logo_url = 'https://incheon.daeatdiet.com/theme/daeat/common/images/logo_new.png',
    og_image_url = 'https://incheon.daeatdiet.com/images/share/bupyeong.jpg',
    long_description = NULL,
    legal_entity_name = '의료법인 다이트',
    founder = '신수용',
    primary_ctas = '[
      {"id":"phone-1","type":"phone","label":"전화 예약","targetUrl":"tel:1533-8191"},
      {"id":"kakao-talk-1","type":"kakao-talk","label":"카카오 상담","targetUrl":"https://pf.kakao.com/_EqUxaxj/chat"},
      {"id":"naver-reservation-1","type":"naver-reservation","label":"네이버 예약","targetUrl":"https://naver.me/xsYuWmvD"}
    ]'::jsonb,
    -- C 하이브리드 alignment Phase 1 (사용자 결정 2026-05-20):
    -- 메인/about/treatments 페이지의 hardcode 데이터를 metadata JSONB 로 이관.
    -- site 측은 clinic.metadata.{key} 를 읽어 렌더링 (fallback hardcode 유지).
    metadata = '{
      "treatmentPillars": [
        {"slug":"diet-treatment","icon":"mdi:scale-bathroom","title":"다이어트 치료","subtitle":"굿바이 다이어트 · 당질조절 · 요요방지"},
        {"slug":"personalized-diet","icon":"mdi:account-heart-outline","title":"개인맞춤 다이어트","subtitle":"3GO · 갱년기 · 산후 · 마른비만 · 소아비만"},
        {"slug":"body-shaping","icon":"mdi:human-male-height","title":"체형관리","subtitle":"지방분해약침 · 다이트라인 · 밀착 코칭"},
        {"slug":"herbal-medicine","icon":"mdi:leaf","title":"다이트 한약","subtitle":"원외탕전 · 엄선된 한약 재료"}
      ],
      "standardPrinciples": [
        {"n":"01","icon":"mdi:account-search","title":"체질 진단","desc":"사상체질 진단 · 신진대사 평가로 환자 개개인 분석"},
        {"n":"02","icon":"mdi:medical-bag","title":"맞춤 처방","desc":"체질에 맞춘 한약 · 약침 · 식이 코칭 종합 처방"},
        {"n":"03","icon":"mdi:calendar-check","title":"사후 관리","desc":"3개월 사후 관리 + 다이트앱 데일리 코칭으로 요요 방지"}
      ],
      "keyStats": [
        {"value":"9","suffix":"개","label":"전국 직영 지점","source":"incheon.daeatdiet.com 메인 페이지 지점 목록"},
        {"value":"31","suffix":"명","label":"전국 다이트 의료진","source":"incheon.daeatdiet.com/bbs/board.php?bo_table=doctor"},
        {"value":"__publications_count__","suffix":"편","label":"발표 학술 논문","source":"DB publication 자동 카운트"}
      ],
      "systemStrengths": [
        {"icon":"mdi:test-tube","title":"의학적 다이어트 시스템","description":"학술 근거에 기반한 진료 프로토콜로 한약·약침·식이 코칭을 결합한 표준화된 시스템을 운영합니다."},
        {"icon":"mdi:account-search","title":"체질 진단 맞춤 처방","description":"사상체질 진단과 신진대사 평가를 통해 환자 개개인의 체질에 맞춘 한약을 처방합니다."},
        {"icon":"mdi:calendar-check","title":"사후 관리 시스템","description":"다이트앱과 데일리 코칭으로 본 치료 종료 후에도 평생 유지되는 결과를 약속합니다."},
        {"icon":"mdi:flask","title":"원외탕전 한약","description":"GMP 기준 원외탕전실에서 엄선된 한약재로 안전성과 품질을 보증합니다."}
      ],
      "sectionCopy": {
        "communityTitle": "1:1 비밀 상담소",
        "communityDescription": "민감한 증상이나 진료 가능 여부, 비용 문의를 의료진에게 비공개로 전달합니다.\n본문 내용은 작성자와 의료진만 확인할 수 있습니다.",
        "reservationHeadline": "진료 상담 예약",
        "reservationDescription": "다이트한의원의 의학적 다이어트 시스템에 대한 자세한 안내와 본인의 체질·목표에 맞춘 맞춤 상담을 진행합니다."
      }
    }'::jsonb
   WHERE instance_id = v_instance_id AND slug = 'clinic';

  SELECT id INTO v_clinic_id FROM clinic_profile WHERE instance_id = v_instance_id AND slug = 'clinic';

  -- (2) LocationProfile UPDATE — 실 부평점 주소 + 진료시간
  UPDATE location_profile SET
    name = '다이트한의원 인천 부평점',
    street_address = '주부토로 17, 지하1층 · 7~10층',
    address_locality = '부평구',
    address_region = '인천광역시',
    postal_code = '21390',
    phone = '1533-8191',
    metadata = '{
      "businessHours":{
        "openingHours":[
          {"dayOfWeek":["Monday","Wednesday","Friday"],"opens":"10:00","closes":"20:00"},
          {"dayOfWeek":["Tuesday","Thursday"],"opens":"10:00","closes":"21:00"},
          {"dayOfWeek":["Saturday"],"opens":"10:00","closes":"18:00"}
        ],
        "receptionHours":[],
        "lunchBreaks":[
          {"dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"from":"13:00","to":"14:00"}
        ],
        "specialClosures":[]
      },
      "reservationChannelsInheritedFrom":"clinic_profile.primary_ctas",
      "representativeDoctors":[],
      "featuredChannelId":"phone-1"
    }'::jsonb
   WHERE instance_id = v_instance_id AND slug = 'main';

  -- (3) DoctorProfile UPDATE/INSERT — 신수용 (대표) · 방민우 (대표 · 인천부평 분원장)
  UPDATE doctor_profile SET
    name = '신수용',
    title = '대표원장',
    job_title = '한의학 박사',
    bio = E'다이트한의원 대표원장. 의학적 다이어트 시스템 정립자로, 환자 맞춤 진단과 한약 처방의 임상 경험을 바탕으로 굿바이 다이어트 프로그램을 운영합니다. "새로운 나를 만나다"라는 슬로건 아래, 환자가 건강한 몸의 회복을 경험할 수 있도록 진료에 임하고 있습니다.',
    photo_url = 'https://placehold.co/400x400/2D5240/ffffff?text=Dr.Shin',
    display_order = 0,
    active = true
   WHERE instance_id = v_instance_id AND slug = 'shin-suyong';

  UPDATE doctor_profile SET
    name = '방민우',
    title = '인천부평점 분원장',
    job_title = '한의학 박사 · 유네스코(ICHEI) 자문위원',
    bio = E'다이트한의원 인천 부평점 분원장. 유네스코 국제고등교육혁신센터(ICHEI) 자문위원에 공식 임명되었으며, 보건복지부 상장 및 국회 표창장을 수상한 대한민국 보건·건강 증진 기여 인물입니다. 출산 후 다이어트·갱년기 다이어트·소아비만 등 개인 맞춤 영역의 전문성을 갖추고 있습니다.',
    photo_url = 'https://placehold.co/400x400/B68B47/ffffff?text=Dr.Bang',
    display_order = 1,
    active = true
   WHERE instance_id = v_instance_id AND slug = 'kim-yejin';

  SELECT id INTO v_doc_shin_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'shin-suyong';
  SELECT id INTO v_doc_bang_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'kim-yejin';

  -- 비활성 의료진 + 박준호 안 그대로 유지

  -- (4) TreatmentPage UPDATE — 굿바이 다이어트 · 디톡스 → 다이트 프로그램 4종
  -- pillar_slug + metadata 일괄 UPDATE (C 하이브리드 alignment Phase 1)
  UPDATE treatment_page SET pillar_slug = CASE slug
      WHEN 'goodbye-diet'        THEN 'diet-treatment'
      WHEN 'detox-program'       THEN 'diet-treatment'
      WHEN 'postpartum-recovery' THEN 'personalized-diet'
      ELSE pillar_slug
    END
   WHERE instance_id = v_instance_id
     AND slug IN ('goodbye-diet','detox-program','postpartum-recovery');

  UPDATE treatment_page SET
    title = '굿바이 다이어트',
    summary = E'체질 진단부터 3개월 사후 관리까지 진행하는 본원의 시그니처 한방 다이어트 프로그램\n12주 본 프로그램 + 12주 사후 관리',
    body_markdown = E'## 굿바이 다이어트 3원칙\n\n### 1. 체질 진단\n환자 개개인의 사상체질과 신진대사 상태를 정확히 파악합니다.\n\n### 2. 맞춤 처방\n체질에 맞춘 한약(원외탕전) · 약침 · 식이 코칭을 결합한 종합 처방.\n\n### 3. 사후 관리\n3개월 사후 관리 + 다이트앱을 통한 데일리 케어로 요요 현상을 방지합니다.\n\n## 진행 일정\n- **상담 + 진단** (1주차): 사상체질 진단 · 신체 측정 · 한약 처방\n- **본 치료** (2~12주): 한약 복용 · 주간 점검 · 약침 시술\n- **사후 관리** (13~24주): 데일리 코칭 · 식이 가이드 · 월간 진료'
   WHERE instance_id = v_instance_id AND slug = 'goodbye-diet';

  UPDATE treatment_page SET
    title = '당질조절 다이어트',
    summary = '탄수화물 중독·식이 패턴 개선이 필요한 환자를 위한 당질 조절 한방 다이어트 프로그램. 한약과 식이 코칭으로 무리 없는 체중 변화를 시작합니다.',
    body_markdown = E'## 당질조절 다이어트\n\n탄수화물 의존도가 높은 식습관을 한방 처방으로 점진적으로 변화시킵니다.\n\n## 핵심 처방\n- **당질 흡수 조절 한약**: 인슐린 민감도 개선\n- **혈당 안정 식이 가이드**: 1:1 영양 코칭\n- **약침 시술**: 복부 지방 분해 + 순환 개선'
   WHERE instance_id = v_instance_id AND slug = 'detox-program';

  UPDATE treatment_page SET
    title = '출산 전후 다이어트',
    summary = '임신 전 · 임신 중 · 산후 회복 단계의 여성을 위한 맞춤 다이어트 프로그램. 호르몬 균형 회복과 안전한 체형 회복을 함께 진행합니다.',
    body_markdown = E'## 출산 전후 다이어트\n\n임신과 출산 안 거치며 변화하는 몸을 단계별로 케어합니다.\n\n## 단계별 케어\n- **임신 준비**: 호르몬 안정 한약 + 체형 진단\n- **산후 6주**: 산후풍 예방 + 보양 한약\n- **본격 회복**: 점진적 체중 회복 + 호르몬 균형'
   WHERE instance_id = v_instance_id AND slug = 'postpartum-recovery';

  -- (5) Article UPDATE — 다이트한의원 인사이트 톤 정합
  UPDATE article SET
    title = '요요 없는 한방 다이어트, 무엇이 다른가',
    summary = '한방 다이어트가 요요 현상을 방지할 수 있는 의학적 근거와 다이트한의원의 임상 사례를 정리한 가이드입니다. 체질 진단 + 맞춤 처방 + 사후 관리 3단계 안의 핵심 원리.',
    body_markdown = E'## 요요의 진짜 원인\n\n급격한 체중 감량 후 몸이 위기 신호로 받아들이는 호르몬 변화가 요요의 핵심 원인입니다.\n\n## 한방 처방의 차별점\n\n1. **체질 진단 기반 한약**: 체질에 맞지 않는 약은 부작용을 유발합니다.\n2. **점진적 감량**: 무리 없는 4~12주 감량 + 사후 12주 유지.\n3. **호르몬 안정**: 한약이 갑상선·인슐린·코르티솔 균형을 동시에 케어.'
   WHERE instance_id = v_instance_id AND slug = 'yoyo-prevention-five-rules';

  UPDATE article SET
    title = '사상체질 다이어트 — 4가지 체질의 다이어트 전략',
    summary = '태양인·태음인·소양인·소음인 각 체질별 다이어트 접근 방식의 차이를 학술 근거와 임상 사례로 정리합니다. 잘못된 체질 처방이 부작용을 유발하는 이유까지.',
    body_markdown = E'## 사상체질 다이어트\n\n사상체질은 한국 한의학의 핵심 분류 체계로, 다이어트 처방의 출발점입니다.\n\n### 태양인\n간 기능이 약함 → 간 보호 우선 + 가벼운 운동.\n\n### 태음인\n비만 위험 가장 높음 → 폐 기능 강화 + 적극적 운동.\n\n### 소양인\n비위 발달 · 신장 약함 → 신장 보양 + 식이 조절.\n\n### 소음인\n신장 발달 · 비위 약함 → 비위 보양 + 점진적 감량.'
   WHERE instance_id = v_instance_id AND slug = 'sasang-constitution-101';

  -- (6) MediaAppearance UPDATE — 실 다이트한의원 YouTube 컨텐츠 정합
  UPDATE media_appearance SET
    title = '출산 후 다이어트는 다릅니다',
    channel_name = '다이트한의원 공식 채널',
    channel_type = 'youtube',
    url = 'https://www.youtube.com/@daeatdiet',
    thumbnail_url = 'https://placehold.co/640x360/2D5240/ffffff?text=Postpartum+Diet',
    summary = '출산 후 다이어트가 일반 다이어트와 어떻게 다른지, 호르몬·골반·체력 회복 안 다이트한의원이 어떻게 접근하는지 설명합니다.'
   WHERE instance_id = v_instance_id AND slug = 'youtube-diet-talk-2024';

  UPDATE media_appearance SET
    title = '주사 다이어트의 진실 — 한의사가 말합니다',
    channel_name = '다이트한의원 공식 채널',
    channel_type = 'youtube',
    url = 'https://www.youtube.com/@daeatdiet',
    thumbnail_url = 'https://placehold.co/640x360/B68B47/ffffff?text=Injection+Truth',
    summary = '최근 유행하는 비만 주사(GLP-1) 의 효과와 한계, 한의학 관점에서의 보완 방향을 정리한 다이트한의원 공식 컨텐츠입니다.'
   WHERE instance_id = v_instance_id AND slug = 'broadcast-mbc-health-2024';

  -- (7) FAQ UPDATE — 다이트한의원 톤 정합
  UPDATE faq SET
    question = '굿바이 다이어트 프로그램은 얼마나 걸리나요?',
    answer = '본 치료 12주 (3개월) + 사후 관리 12주 (3개월), 총 24주 (6개월) 의 여정입니다. 환자의 체질과 목표에 따라 일정은 조정될 수 있으며, 첫 진료 시 정확한 진단 후 안내드립니다.'
   WHERE instance_id = v_instance_id AND slug = 'how-long-program';

  UPDATE faq SET
    question = '임신 중에도 한약을 복용할 수 있나요?',
    answer = '임신 중 한약 복용은 매우 신중해야 합니다. 다이트한의원은 임신 중 환자께 다이어트 한약은 처방하지 않으며, 산전·산후 안전한 보양 한약만 처방합니다. 자세한 상담은 출산 전후 다이어트 프로그램을 참고해 주세요.'
   WHERE instance_id = v_instance_id AND slug = 'is-safe-for-pregnancy';

  UPDATE faq SET
    question = '진료비는 얼마나 되나요?',
    answer = '비급여 진료비 안내 페이지에서 자세한 비용 정보를 확인하실 수 있습니다. 환자 체질과 목표 체중에 따라 처방이 달라지므로, 첫 진료 시 정확한 비용을 안내드립니다. 카카오톡 상담을 통해서도 사전 문의가 가능합니다.'
   WHERE instance_id = v_instance_id AND slug = 'price-range';

  UPDATE faq SET
    question = '한약 복용 시 부작용이 있나요?',
    answer = '다이트한의원의 한약은 원외탕전 + 엄선된 한약 재료로 제조됩니다. 한의사 진단 후 처방되는 약재로 안전성이 검증되어 있으며, 개인 체질에 따라 일시적 소화 불편이 발생하는 경우 즉시 본원에 연락 주시면 처방을 조정해 드립니다.'
   WHERE instance_id = v_instance_id AND slug = 'side-effects';

  UPDATE faq SET
    question = '주차 / 대중교통 안내가 궁금합니다.',
    answer = '주소: 인천광역시 부평구 주부토로 17, 지하1층·7~10층. 부평역 도보 5분 거리이며 건물 자체 주차장 이용이 가능합니다. 진료 시간에 가득 차는 경우가 있으니 가급적 대중교통 이용을 권장드립니다.'
   WHERE instance_id = v_instance_id AND slug = 'parking-info';

  RAISE NOTICE 'seed-demo-real-daeat: instance_id=% 실 다이트한의원 컨텐츠 UPDATE 완료', v_instance_id;
END $$;
