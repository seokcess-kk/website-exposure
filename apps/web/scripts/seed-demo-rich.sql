-- @glitzy/web/scripts/seed-demo-rich — 데모 instance 'demo' 안 풍부한 더미 데이터.
-- 사용 방식 (PowerShell · Windows):
--   Get-Content apps/web/scripts/seed-demo-rich.sql -Raw | docker exec -i spike-e-postgres psql -U postgres -d spike_e
--
-- 전제: 'demo' instance + ClinicProfile/LocationProfile 안 미 존재 (또는 일부 존재 — ON CONFLICT DO NOTHING idempotent).
-- 모든 sentinel ComplianceRecord + entity INSERT 안 idempotent. 재실행 안전.
--
-- 데이터 셋:
--   - ClinicProfile (글리치 한의원 부평점)
--   - LocationProfile (main · 부평구)
--   - 5 LegalDocument (privacy/terms/non-covered/refund/complaint · published)
--   - 3 ArticleCategory (general default + diet + health)
--   - 1 DoctorProfile (inactive 1 — 과거 진료 이력 보존용 lee-soyoung 만, active 의료진은 어드민에서 직접 등록)
--   - 16 TreatmentPage (published) — Hub 4 (Pillar: diet-treatment·personalized-diet·body-shaping·herbal-medicine) + Spoke 10 + 기존 2 (detox-program·postpartum-recovery)
--   - 5 Article (published · 카테고리 분포)
--   - 5 FAQ (draft · v0.1 안 발행 차단 정합)
--   - 2 Publication (published)
--   - 2 MediaAppearance (published)
--
-- 모든 published entity 안 sentinel ComplianceRecord 안 동반 INSERT (published_content_compliance_guard trigger 통과).

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_clinic_id UUID;
  v_doc_shin_id UUID;
  v_doc_kim_id UUID;
  v_doc_park_id UUID;
  v_cat_general_id UUID;
  v_cat_diet_id UUID;
  v_cat_health_id UUID;
  v_treatment_diet_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  -- (0) instance 'demo' 안 SELECT
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-rich: instance slug=demo 미발견. pnpm web:seed --instance-slug=demo 안 먼저 실행 필요.';
  END IF;

  -- (1) ClinicProfile — UPSERT (기존 데이터 덮어쓰지 않음)
  INSERT INTO clinic_profile (
    instance_id, slug, name, description, logo_url, og_image_url,
    business_registration_number, alternate_name, legal_entity_name, slogan,
    long_description, founder, founding_date,
    policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
    primary_ctas, brand_tokens
  ) VALUES (
    v_instance_id, 'clinic',
    '글리치 한의원 부평점',
    '체질 진단 기반 한방 다이어트 전문 클리닉입니다. 신수용 원장의 굿바이 다이어트 프로그램으로 환자 개개인의 체질에 맞춘 근본 치료와 요요 방지까지 함께합니다.',
    'https://placehold.co/200x200/1a4d3a/ffffff?text=Glitzy',
    'https://placehold.co/1200x630/1a4d3a/ffffff?text=Glitzy+Clinic',
    '123-45-67890', '글리치한의원', '주식회사 글리치 의료재단', '근본부터 바꾸는 한의학',
    E'## 진료 철학\n\n과학적 근거에 기반한 한방 다이어트를 추구합니다.\n\n## 원장 인사말\n\n환자 한 분 한 분의 체질을 진단하고 맞춤 처방을 제공합니다.',
    '신수용', '2024-03-01',
    '신수용', 'privacy@glitzy.kr', '032-0000-0000', '2026-01-01',
    '[{"id":"phone-1","type":"phone","label":"예약하기","targetUrl":"tel:+82-32-0000-0000"},{"id":"kakao-talk-1","type":"kakao-talk","label":"카카오 상담","targetUrl":"https://pf.kakao.com/_glitzy"},{"id":"naver-reservation-1","type":"naver-reservation","label":"네이버 예약","targetUrl":"https://booking.naver.com/booking/glitzy"}]'::jsonb,
    '{"primaryHex":"#1a4d3a","accentHex":"#c9a86b","palette":["#1a4d3a","#c9a86b","#f5f1e8"],"source":"manual"}'::jsonb
  )
  ON CONFLICT (instance_id, slug) DO NOTHING;

  SELECT id INTO v_clinic_id FROM clinic_profile WHERE instance_id = v_instance_id AND slug = 'clinic';

  -- (2) LocationProfile(main)
  INSERT INTO location_profile (
    instance_id, slug, name, street_address, address_locality, address_region, postal_code, address_country,
    phone, email, clinic_profile_id, metadata
  ) VALUES (
    v_instance_id, 'main',
    '글리치 한의원 부평점',
    '부평대로 100', '부평구', '인천광역시', '21391', 'KR',
    '032-0000-0000', 'info@glitzy.kr', v_clinic_id,
    '{"businessHours":{"openingHours":[{"dayOfWeek":["Monday","Tuesday","Wednesday","Friday"],"opens":"10:00","closes":"19:00"},{"dayOfWeek":["Thursday"],"opens":"10:00","closes":"20:00"},{"dayOfWeek":["Saturday"],"opens":"10:00","closes":"14:00"}],"receptionHours":[],"lunchBreaks":[{"dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"from":"13:00","to":"14:00"}],"specialClosures":[]},"reservationChannelsInheritedFrom":"clinic_profile.primary_ctas","representativeDoctors":[],"featuredChannelId":"phone-1"}'::jsonb
  )
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- (3) 1 DoctorProfile (inactive 만 — 과거 진료 이력 보존용)
  -- 사용자 결정 2026-05-20: active 의료진은 어드민에서 본인이 직접 등록. seed dummy 의료진(shin/kim/park) 제거.
  -- 결과: article/publication/faq INSERT 안 v_doc_*_id NULL 매핑 (FK NULL 허용 정합).
  INSERT INTO doctor_profile (instance_id, slug, name, title, job_title, bio, photo_url, display_order, active)
  VALUES
    (v_instance_id, 'lee-soyoung', '이소영', '前 부원장', '한의사', E'2023년 퇴사. 과거 부인과 진료 담당. 현재 비활성 상태이지만 과거 진료 이력 보존을 위해 데이터 유지.', 'https://placehold.co/400x400/666666/ffffff?text=Dr.Lee', 3, false)
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- v_doc_*_id 안 NULL (의도된 정합) — 아래 article/publication/faq INSERT 안 author NULL 로 들어감.
  -- SELECT INTO 안 NOT FOUND 시 NULL 할당 (STRICT 옵션 없음). PL/pgSQL 표준 동작.
  SELECT id INTO v_doc_shin_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'shin-suyong';
  SELECT id INTO v_doc_kim_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'kim-yejin';
  SELECT id INTO v_doc_park_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'park-junho';

  -- (4) 3 ArticleCategory (general 안 seed 안 자동 INSERT · diet/health 추가)
  -- description 안 CHECK: NULL 또는 80~200자. 본 seed 안 NULL 안 단순화.
  INSERT INTO article_category (instance_id, slug, name, description, display_order)
  VALUES
    (v_instance_id, 'general', '일반', NULL, 0),
    (v_instance_id, 'diet', '다이어트', NULL, 1),
    (v_instance_id, 'health', '건강', NULL, 2)
  ON CONFLICT (instance_id, slug) DO NOTHING;

  SELECT id INTO v_cat_general_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'general';
  SELECT id INTO v_cat_diet_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'diet';
  SELECT id INTO v_cat_health_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'health';

  -- (5) 5 LegalDocument (sentinel + published)
  --   (5-1) sentinel compliance_record 안 5건 INSERT (UNIQUE constraint 안 없음 · slug + content_type 안 distinct 안 만들기 위해 NOT EXISTS guard)
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
    published_at, published_by, record_phase, record_version, metadata)
  SELECT v_instance_id, 'LegalDocument'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), v_sentinel_user, NOW(),
    NOW(), v_sentinel_user, 'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-rich-LegalDocument"}'::jsonb
  FROM (VALUES ('privacy-policy'), ('terms-of-service'), ('non-covered-fees'), ('refund-policy'), ('complaint-handling')) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'LegalDocument'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  --   (5-2) LegalDocument INSERT — published · compliance_record_id 안 위 sentinel 참조
  INSERT INTO legal_document (instance_id, slug, document_type, title, body, auto_generated, template_version,
    effective_date, last_revised_date, contact_person, contact_email, status, published_at, compliance_record_id)
  SELECT v_instance_id, ld.slug, ld.doc_type::legal_document_type, ld.title, ld.body, true, 'demo-template@1.0.0',
    DATE '2026-01-01', DATE '2026-01-01', '신수용', 'privacy@glitzy.kr', 'published'::content_publication_status, NOW(),
    cr.id
  FROM (VALUES
    ('privacy-policy', 'privacy', '개인정보처리방침', E'# 개인정보처리방침\n\n글리치 한의원 부평점(이하 "본원")은 환자 개인정보 보호의 중요성을 인식하고 관련 법령에 따라 안전하게 관리합니다.\n\n## 1. 수집 항목\n- 이름, 생년월일, 연락처, 진료 기록\n\n## 2. 이용 목적\n- 진료 예약 및 진료 기록 관리\n- 정기 안내 발송 (동의 시)\n\n## 3. 보유 기간\n의료법 시행규칙 제15조에 따라 10년간 보관합니다.\n\n## 4. 개인정보 보호책임자\n- 이름: 신수용\n- 이메일: privacy@glitzy.kr\n- 전화: 032-0000-0000'),
    ('terms-of-service', 'terms', '이용약관', E'# 이용약관\n\n## 제1조 (목적)\n본 약관은 글리치 한의원 부평점의 진료 및 서비스 이용에 관한 사항을 규정합니다.\n\n## 제2조 (정의)\n"서비스"란 본원이 제공하는 진료 및 부가 서비스를 의미합니다.\n\n## 제3조 (이용 절차)\n환자는 예약 후 진료를 받을 수 있으며, 예약 시 본인 확인이 필요합니다.'),
    ('non-covered-fees', 'non-covered', '비급여 진료비 안내', E'# 비급여 진료비 안내\n\n의료법 제45조에 따라 비급여 진료비를 안내합니다.\n\n## 한방 다이어트 프로그램\n- 기본 진료 + 1개월 한약: 80~120만원\n- 디톡스 3주 프로그램: 60~90만원\n\n## 체질 진단 검사\n- 체질 진단: 5만원\n- 사상체질 정밀 검사: 10만원\n\n※ 상세 비용은 진료 시 환자 상태에 따라 결정됩니다.'),
    ('refund-policy', 'refund', '환불 규정', E'# 환불 규정\n\n## 1. 환불 가능 사유\n- 진료 시작 전 환자 요청: 100% 환불\n- 진료 1주 이내 환자 요청: 80% 환불\n- 진료 2~4주 환자 요청: 50% 환불\n- 진료 4주 이상: 환불 불가 (단 의료진 판단 시 부분 환불 가능)\n\n## 2. 환불 절차\n환불 요청은 본원 정책 담당자에게 서면(이메일) 신청하시면 7영업일 이내 처리됩니다.'),
    ('complaint-handling', 'complaint', '민원 처리 안내', E'# 민원 처리 안내\n\n## 접수 방법\n- 전화: 032-0000-0000\n- 이메일: privacy@glitzy.kr\n- 방문 접수\n\n## 처리 기한\n- 일반 민원: 7영업일 이내\n- 의료 사고 관련: 즉시 대응 + 정식 조사 30일 이내\n\n## 외부 분쟁 조정\n한국의료분쟁조정중재원(K-MEDI) 안 조정 신청 가능합니다.')
  ) AS ld(slug, doc_type, title, body)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'LegalDocument'::compliance_content_type
   AND cr.content_ref = ld.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  -- (instance_id, slug) UNIQUE + (instance_id, document_type) UNIQUE — 두 제약 모두 회피.
  WHERE NOT EXISTS (
    SELECT 1 FROM legal_document existing
     WHERE existing.instance_id = v_instance_id
       AND (existing.slug = ld.slug OR existing.document_type = ld.doc_type::legal_document_type)
  );

  -- (6) 16 TreatmentPage (sentinel + published) — Hub 4 (Pillar) + Spoke 10 + 기존 2 유지
  -- EEAT 정합 본문 패턴: ## 한 줄 답변 (AEO) · ## 누구에게 적합 · ## 어떻게 진행 · ## 주의사항/금기 (의료법 56조 정합)
  -- 사용자 검수 2026-05-20 — incheon.daeatdiet.com 메뉴 구조 기반
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'TreatmentPage'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-rich-TreatmentPage"}'::jsonb
  FROM (VALUES
    -- 기존 2 (유지)
    ('detox-program'), ('postpartum-recovery'),
    -- Pillar 4 (Hub)
    ('diet-treatment'), ('personalized-diet'), ('body-shaping'), ('herbal-medicine'),
    -- Spoke 10
    ('goodbye-diet'),
    ('carb-control'), ('yoyo-prevention'),
    ('three-go-diet'), ('menopause-diet'), ('postpartum-diet'),
    ('slim-obesity-diet'), ('child-obesity-diet'),
    ('lipolysis-pharmacopuncture'), ('daet-line-pharmacopuncture')
  ) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'TreatmentPage'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO treatment_page (instance_id, slug, title, summary, body_markdown, hero_image_url, status, risk_level, published_at, compliance_record_id)
  SELECT v_instance_id, tp.slug, tp.title, tp.summary, tp.body, tp.hero, 'published'::content_publication_status, 'Low'::risk_level, NOW(), cr.id
  FROM (VALUES
    -- === 기존 2 유지 ===
    ('detox-program',
     '한방 디톡스 3주 프로그램',
     '한방 디톡스 처방으로 체내 노폐물 배출과 순환 개선을 진행하는 3주 단기 프로그램입니다. 식이 가이드와 함께 제공됩니다.',
     E'## 디톡스 3주 프로그램\n\n### 1주차: 정화\n장 건강 회복 한약 + 저자극 식단\n\n### 2주차: 순환\n순환 개선 한약 + 점진적 운동 가이드\n\n### 3주차: 안정\n체질 안정 한약 + 식습관 정착',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Detox'),
    ('postpartum-recovery',
     '산후 회복 프로그램',
     '출산 후 체형 회복과 여성 호르몬 균형 회복을 함께 진행하는 한방 산후 관리 프로그램입니다. 김예진 부원장 주관.',
     E'## 산후 회복 프로그램\n\n### 단계 1: 산후 풍 예방\n출산 후 8주 이내 시작하는 한약 처방.\n\n### 단계 2: 호르몬 균형\n여성 호르몬 균형 회복 한약.\n\n### 단계 3: 체형 회복\n점진적 체중 회복 + 운동 가이드',
     'https://placehold.co/1200x630/8b5a3c/ffffff?text=Postpartum'),

    -- === Pillar 1 ===
    ('diet-treatment',
     '다이어트 치료',
     '체질 진단부터 사후 관리까지, 다이트한의원의 다이어트 치료 영역을 안내합니다. 굿바이 다이어트·당질조절·요요방지를 포괄합니다.',
     E'## 다이어트 치료 영역\n\n다이트한의원은 체질 진단 기반의 한방 처방과 식습관 코칭, 사후 관리를 하나의 흐름으로 묶어 다이어트 치료를 진행합니다. 단순 체중 감량이 아닌, 체중 변화 이후의 유지까지 함께 고려한 진료 흐름입니다.\n\n## 본원의 접근법\n\n- 사상체질 진단으로 환자별 진료 방향 결정\n- 한의사 진료 후 한약 처방\n- 식이 가이드와 주간 점검을 병행\n- 프로그램 종료 후 3개월 사후 관리 권장\n\n## 세부 진료\n\n- 굿바이 다이어트 — 본원의 시그니처 한방 다이어트 프로그램\n- 당질조절 다이어트 — 식사 패턴과 인슐린 저항성을 함께 고려한 코칭\n- 요요방지 프로그램 — 감량 이후 체중 관리에 초점\n\n## 안내\n\n- 진료비 및 한약 처방 비용은 환자 체질과 처방 내용에 따라 다릅니다.\n- 임신·수유 중인 분, 만성질환자는 진료 시 반드시 알려주세요.',
     'https://placehold.co/1200x630/1a4d3a/ffffff?text=Diet+Treatment'),

    -- === Pillar 2 ===
    ('personalized-diet',
     '개인맞춤 다이어트',
     '갱년기·출산 전후·마른비만·소아비만 등 체질과 생활 단계에 따라 진료 방향을 달리하는 개인맞춤 다이어트 영역을 안내합니다.',
     E'## 개인맞춤 다이어트 영역\n\n같은 다이어트라도 30대 여성, 갱년기, 산후 회복기, 마른비만, 소아 비만 등 환자가 처한 상황에 따라 진료의 우선순위가 달라집니다. 본원은 생활 단계 별 진료 가이드를 따로 운영합니다.\n\n## 본원의 접근법\n\n- 초기 진료 시 생활 패턴·체질·기존 병력 함께 확인\n- 호르몬 변화·수유 여부·성장기 등 단계별 고려\n- 한의사 판단 하 안전한 처방 우선\n\n## 세부 진료\n\n- 3GO 다이어트 — 한약·식이·운동 3축 결합형\n- 갱년기 다이어트 — 호르몬 변화기 체중 관리\n- 출산 전후 다이어트 — 산후 회복과 체형 관리 병행\n- 마른비만 다이어트 — 체지방률 중심 관리\n- 소아비만 다이어트 — 성장기 안전 우선\n\n## 주의\n\n- 임신·수유 중인 분은 진료 시 별도 안내드립니다.\n- 소아의 경우 보호자 동반 진료를 권장합니다.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Personalized+Diet'),

    -- === Pillar 3 ===
    ('body-shaping',
     '체형관리',
     '한방 약침과 체형 코칭을 결합한 본원의 체형관리 영역. 한의사 진단 하 안전성 우선의 시술을 진행합니다.',
     E'## 체형관리 영역\n\n체형관리는 한약 처방과 함께 부위별 관리를 보조하는 영역입니다. 본원은 한의사 진단 후 시술을 진행하며, 시술 전후 한약 처방을 함께 고려합니다.\n\n## 본원의 접근법\n\n- 한의사 사전 진료 후 시술 결정\n- 시술 전 체질·건강 상태 확인\n- 시술 후 회복·식이·생활 관리 가이드\n\n## 세부 시술\n\n- 지방분해약침 — 부위별 체형 관리 보조\n- 다이트라인 약침 — 본원 자체 처방\n\n## 주의사항 및 금기\n\n- 임신·수유 중인 분은 시술 대상이 아닙니다.\n- 출혈성 질환, 만성 피부질환, 면역계 질환이 있는 경우 시술 전 반드시 알려주세요.\n- 시술 후 일시적 멍·통증이 발생할 수 있으며, 본원에 즉시 알려주시면 진료 가능합니다.',
     'https://placehold.co/1200x630/8b5a3c/ffffff?text=Body+Shaping'),

    -- === Pillar 4 ===
    ('herbal-medicine',
     '다이트 한약',
     '원외 탕전과 엄선된 한약 재료, 환자 체질별 처방을 통해 안전과 품질을 함께 추구하는 본원의 한약 영역입니다.',
     E'## 다이트 한약\n\n본원의 한약 처방은 한의사 진단 후 환자 체질과 진료 목적에 맞게 결정됩니다. 다이어트뿐 아니라 산후 보양, 면역 관리, 갱년기 관리 등 영역 별 한약 처방을 운영합니다.\n\n## 한약의 안전 기준\n\n- 원외 탕전 협력 시설을 통한 한약 제조\n- 입고 재료 품질 점검 후 처방 활용\n- 환자 체질·병력 확인 후 처방\n\n## 한약의 종류\n\n- 다이어트 한약 — 굿바이 다이어트·당질조절·요요방지 등\n- 보양 한약 — 산후 보양·면역 관리·갱년기 관리\n- 일상 한약 — 약차·소화 보조 처방\n\n## 주의\n\n- 한약 복용 중 다른 약물(처방약·건강기능식품 포함) 을 함께 복용하시는 경우 반드시 본원에 알려주세요.\n- 일시적 소화 불편 등이 발생할 수 있으며, 즉시 본원에 연락 주시면 처방 조정해 드립니다.',
     'https://placehold.co/1200x630/4a6b4a/ffffff?text=Herbal+Medicine'),

    -- === Spoke 1: 굿바이 다이어트 (Pillar: 다이어트 치료) — 기존 갱신 ===
    ('goodbye-diet',
     '굿바이 다이어트',
     '체질 진단부터 3개월 사후 관리까지 진행하는 본원의 시그니처 한방 다이어트 프로그램. 12주 본 프로그램 + 12주 사후 관리.',
     E'## 한 줄 답변\n\n굿바이 다이어트는 사상체질 진단 → 한약 처방 → 12주 본 프로그램 → 12주 사후 관리의 4단계로 진행되는 본원의 시그니처 한방 다이어트 프로그램입니다.\n\n## 누구에게 적합한가요\n\n- 무리한 단식이 아닌 한방 진료 기반의 체중 관리를 원하시는 분\n- 과거 다이어트 후 체중 회복(요요) 이 반복되신 분\n- 본인의 체질을 정확히 파악한 뒤 진료를 시작하고 싶으신 분\n\n## 어떻게 진행되나요\n\n1. 1주차 — 체질 진단 + 첫 진료\n2. 2~12주 — 한약 복용 + 주간 점검\n3. 13~24주 — 사후 관리 + 식이 가이드\n\n## 기간 가이드\n\n본 프로그램 12주 + 사후 관리 12주 = 총 24주(6개월) 일정이 표준이며, 환자 체질·목표에 따라 일정이 조정될 수 있습니다.\n\n## 주의사항\n\n- 임신·수유 중인 분, 만성질환자는 진료 시 반드시 알려주세요.\n- 한약 복용 중 일시적 소화 불편이 발생할 수 있으며, 즉시 본원에 연락 주시면 처방 조정해 드립니다.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/1a4d3a/ffffff?text=Goodbye+Diet'),

    -- === Spoke 2: 당질조절 (Pillar: 다이어트 치료) ===
    ('carb-control',
     '당질조절 다이어트',
     '당질(탄수화물) 섭취 패턴과 인슐린 저항성을 함께 고려한 한방 다이어트 진료. 식이 코칭과 한약 처방을 병행합니다.',
     E'## 한 줄 답변\n\n당질조절 다이어트는 환자의 평소 식사·간식 패턴과 인슐린 저항성을 함께 살펴, 무리하지 않는 당질 섭취 가이드와 한약 처방을 결합한 진료입니다.\n\n## 누구에게 적합한가요\n\n- 식사 후 졸음·피로가 잦으신 분\n- 단 음식·간식 섭취 빈도가 높으신 분\n- 운동을 해도 체중 변화가 더디게 느껴지시는 분\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 식사 일지·체질 확인\n2. 당질 섭취 가이드 + 한약 처방\n3. 4주마다 점검 + 식이 조정\n\n## 안내\n\n- 당뇨, 췌장 질환 등 기저 질환이 있으신 경우 반드시 진료 시 알려주세요.\n- 당질 제한식이 모든 환자에게 동일하게 적용되지는 않으며, 한의사 판단 하 처방이 달라질 수 있습니다.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/1a4d3a/ffffff?text=Carb+Control'),

    -- === Spoke 3: 요요방지 (Pillar: 다이어트 치료) ===
    ('yoyo-prevention',
     '요요방지 프로그램',
     '다이어트 종료 후 체중 관리에 초점을 둔 후속 프로그램. 본원 또는 타원에서 다이어트를 진행한 환자 모두 진료 가능합니다.',
     E'## 한 줄 답변\n\n요요방지 프로그램은 다이어트 종료 후 일정 기간 체중 관리에 초점을 두는 후속 프로그램으로, 한약 보조·식이 가이드·정기 체성분 점검을 함께 진행합니다.\n\n## 누구에게 적합한가요\n\n- 다이어트 후 체중 회복이 반복되신 분\n- 본원 굿바이 다이어트 종료 후 사후 관리를 원하시는 분\n- 타원에서 다이어트를 마치고 유지가 필요하신 분\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 체성분 + 식사 패턴 점검\n2. 체질 유지 한약 1~2개월\n3. 4주마다 점검 + 식습관 조정\n\n## 안내\n\n- 본 프로그램은 진료 보조 목적이며, 환자 생활 습관 관리가 함께 동반되어야 합니다.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/1a4d3a/ffffff?text=Yoyo+Prevention'),

    -- === Spoke 4: 3GO 다이어트 (Pillar: 개인맞춤) ===
    ('three-go-diet',
     '3GO 다이어트',
     '한약·식이·운동 3축을 결합해 환자 개개인의 일상에 맞게 코칭하는 본원의 개인맞춤 다이어트 진료입니다.',
     E'## 한 줄 답변\n\n3GO 다이어트는 한약 처방, 식이 코칭, 운동 가이드의 3축을 환자 개개인의 일상에 맞게 결합해 진행하는 본원의 개인맞춤 진료입니다.\n\n## 누구에게 적합한가요\n\n- 일상 일정이 빡빡해 일관된 다이어트 진행이 어려우신 분\n- 한 가지 방식만으로는 체중 변화가 더디다고 느끼셨던 분\n- 운동을 처음 시작하시는 분\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 생활 패턴·체질 진단\n2. 한약 + 주간 식이 + 운동 강도 조정\n3. 4주마다 점검 + 코칭 조정\n\n## 안내\n\n- 본 프로그램은 환자 일상 패턴 변화가 함께 필요한 진료입니다.\n- 만성질환자는 진료 시 반드시 알려주세요.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=3GO+Diet'),

    -- === Spoke 5: 갱년기 다이어트 (Pillar: 개인맞춤) ===
    ('menopause-diet',
     '갱년기 다이어트',
     '갱년기 호르몬 변화기 체중 관리를 위한 한방 진료. 갱년기 증상(상열감·수면 변화) 관리를 함께 고려합니다.',
     E'## 한 줄 답변\n\n갱년기 다이어트는 호르몬 변화 시기의 체중 관리에 초점을 두는 한방 진료로, 갱년기 증상(상열감·수면 변화 등) 관리와 함께 진행합니다.\n\n## 누구에게 적합한가요\n\n- 40대 후반 이후 체중 증가가 시작되신 분\n- 갱년기 증상이 함께 나타나는 분\n- 호르몬 치료 외의 옵션을 함께 고려하시는 분\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 갱년기 증상·체질·병력 확인\n2. 갱년기 한약 + 식이 가이드\n3. 4~6주 간격 점검\n\n## 주의사항\n\n- 호르몬 치료를 받고 계신 경우 반드시 진료 시 알려주세요.\n- 갑상선 질환·고혈압 등 기저 질환이 있으신 경우 한의사 판단 하 처방이 달라질 수 있습니다.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Menopause+Diet'),

    -- === Spoke 6: 출산 전후 다이어트 (Pillar: 개인맞춤) — 김예진 부원장 주관 ===
    ('postpartum-diet',
     '출산 전후 다이어트',
     '산후 회복기 체형 관리와 호르몬 균형 회복을 함께 고려하는 한방 산후 진료. 김예진 부원장 주관.',
     E'## 한 줄 답변\n\n출산 전후 다이어트는 출산 후 6~8주 회복기 안 산후풍 예방·호르몬 균형 회복·체형 관리를 함께 고려하는 본원의 한방 산후 진료입니다.\n\n## 누구에게 적합한가요\n\n- 출산 후 6주~6개월 안 산후 회복을 진행 중이신 분\n- 산후 체형 관리와 산후풍 예방을 함께 고려하시는 분\n- 모유 수유 중에도 안전한 보양 한약을 원하시는 분\n\n## 어떻게 진행되나요\n\n1. 1주차 — 안정·휴식 + 산후 보양 한약\n2. 2~4주 — 산후풍 예방 한약 + 가벼운 산책\n3. 5~6주 — 호르몬 균형 회복 + 점진적 운동\n\n## 주의사항\n\n- 모유 수유 중인 분은 진료 시 반드시 알려주시고, 본원은 수유 안전성이 확인된 한약을 처방합니다.\n- 산후 출혈·발열·통증 등의 증상이 있으신 경우 즉시 본원에 알려주세요.\n\n## 담당 의료진\n\n김예진 부원장 — 산전·산후 한방 진료 전담',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Postpartum+Diet'),

    -- === Spoke 7: 마른비만 (Pillar: 개인맞춤) ===
    ('slim-obesity-diet',
     '마른비만 다이어트',
     '체중은 정상 범위지만 체지방률이 높은 마른비만의 한방 다이어트 진료. 체지방률·근육량을 함께 살핍니다.',
     E'## 한 줄 답변\n\n마른비만 다이어트는 체중이 정상 범위 안에 있으나 체지방률이 높은 환자를 대상으로, 단순 체중 감소가 아닌 체성분 변화에 초점을 둡니다.\n\n## 누구에게 적합한가요\n\n- 체중은 정상이지만 체지방률이 높으신 분\n- 운동 부족·근육량 부족이 함께 진단된 분\n- 체중 증가를 두려워해 다이어트를 미루셨던 분\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 체성분 측정 + 체질 진단\n2. 한약 + 근육량 유지 식이 가이드\n3. 4주마다 체성분 점검\n\n## 안내\n\n- 본 프로그램은 무리한 체중 감량을 권장하지 않으며, 체지방률·근육량 변화에 더 큰 비중을 둡니다.\n- 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Slim+Obesity'),

    -- === Spoke 8: 소아비만 (Pillar: 개인맞춤) ===
    ('child-obesity-diet',
     '소아비만 다이어트',
     '성장기 안전을 가장 우선으로 진행하는 한방 소아 비만 진료. 보호자 동반 진료와 식습관 가이드를 함께 운영합니다.',
     E'## 한 줄 답변\n\n소아비만 다이어트는 성장기 안전을 가장 우선으로, 무리한 감량이 아닌 식습관 정착과 활동량 회복에 초점을 둔 한방 진료입니다.\n\n## 누구에게 적합한가요\n\n- 학동기·청소년 비만으로 진료가 권장되는 자녀\n- 식사 패턴(간식·야식 등) 개선이 필요한 자녀\n- 보호자가 함께 진료를 진행할 의지가 있는 가정\n\n## 어떻게 진행되나요\n\n1. 초기 진료 — 보호자 동반, 식사·활동량 확인\n2. 한약 처방 + 식이 가이드\n3. 4~6주 간격 점검\n\n## 주의사항\n\n- 본 진료는 성장 발달을 함께 고려하므로 한의사 판단 하 진료 가능 여부를 결정합니다.\n- 보호자 동반 진료를 강력히 권장하며, 가정 식사 환경 변화가 함께 필요합니다.\n- 결과는 자녀의 체질·성장기 상태에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Child+Obesity'),

    -- === Spoke 9: 지방분해약침 (Pillar: 체형관리) ===
    ('lipolysis-pharmacopuncture',
     '지방분해약침',
     '한방 약침을 활용한 부위별 체형 관리 보조 시술. 한의사 진단 후 시술 결정, 시술 전후 한약을 함께 고려합니다.',
     E'## 한 줄 답변\n\n지방분해약침은 한약재 성분의 약침을 부위별로 시술하는 본원의 체형 관리 보조 시술로, 시술 전 한의사 진단을 거쳐 진행합니다.\n\n## 누구에게 적합한가요\n\n- 부위별 체형 관리 보조를 원하시는 분\n- 한약 처방과 함께 시술을 고려하시는 분\n\n## 어떻게 진행되나요\n\n1. 사전 진료 — 체질·건강 상태 확인\n2. 약침 시술 (한의사 직접 시술)\n3. 시술 후 회복·생활 관리 가이드\n\n## 주의사항 및 금기\n\n- 임신·수유 중인 분은 시술 대상이 아닙니다.\n- 출혈성 질환, 만성 피부질환, 면역계 질환이 있으신 경우 반드시 사전 알려주세요.\n- 시술 후 일시적 멍·통증이 발생할 수 있으며, 본원에 즉시 알려주시면 진료 가능합니다.\n- 시술 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/8b5a3c/ffffff?text=Lipolysis+Acupuncture'),

    -- === Spoke 10: 다이트라인 약침 (Pillar: 체형관리) ===
    ('daet-line-pharmacopuncture',
     '다이트라인 약침',
     '본원 자체 처방 약침을 활용한 체형 관리 보조 시술. 한의사 진단 후 시술하며, 시술 전후 한약 처방을 함께 고려합니다.',
     E'## 한 줄 답변\n\n다이트라인 약침은 본원 자체 처방 약침을 활용한 체형 관리 보조 시술로, 시술 전 한의사 진단을 거쳐 진행합니다.\n\n## 누구에게 적합한가요\n\n- 본원 한약 처방과 시술을 함께 진행하고 싶으신 분\n- 부위별 체형 관리에 보조 시술을 원하시는 분\n\n## 어떻게 진행되나요\n\n1. 사전 진료 — 체질·건강 상태 확인\n2. 약침 시술 (한의사 직접 시술)\n3. 시술 후 회복·생활 관리 가이드\n\n## 주의사항 및 금기\n\n- 임신·수유 중인 분은 시술 대상이 아닙니다.\n- 출혈성 질환, 만성 피부질환, 면역계 질환이 있으신 경우 반드시 사전 알려주세요.\n- 시술 후 일시적 멍·통증이 발생할 수 있으며, 본원에 즉시 알려주시면 진료 가능합니다.\n- 시술 결과는 환자 체질과 생활 습관에 따라 개인차가 있을 수 있습니다.',
     'https://placehold.co/1200x630/8b5a3c/ffffff?text=Daet+Line+Acupuncture')
  ) AS tp(slug, title, summary, body, hero)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'TreatmentPage'::compliance_content_type
   AND cr.content_ref = tp.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    body_markdown = EXCLUDED.body_markdown,
    hero_image_url = EXCLUDED.hero_image_url,
    updated_at = NOW();

  -- (7) 5 Article (sentinel + published · 카테고리 분포)
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'Article'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-rich-Article"}'::jsonb
  FROM (VALUES ('yoyo-prevention-five-rules'), ('sasang-constitution-101'), ('postpartum-care-tips'), ('detox-myths'), ('winter-immunity-herbs')) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'Article'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO article (instance_id, slug, title, summary, body_markdown, hero_image_url, status, risk_level, published_at,
                       author_doctor_id, category_id, compliance_record_id)
  SELECT v_instance_id, ar.slug, ar.title, ar.summary, ar.body, ar.hero, 'published'::content_publication_status, 'Low'::risk_level, NOW(),
    ar.author_id, ar.cat_id, cr.id
  FROM (VALUES
    ('yoyo-prevention-five-rules',
     '한방 다이어트 후 요요 방지 5가지 원칙',
     '한방 다이어트 프로그램 종료 후 요요 현상을 방지하는 5가지 핵심 원칙입니다. 임상 관찰 데이터와 한의학 학술 근거를 함께 다루며, 점진적 식습관 정착 가이드와 정기 점검 권장까지 포함합니다.',
     E'## 1. 점진적 감량\n급격한 체중 감량은 요요의 주요 원인입니다.\n\n## 2. 체질 유지 한약\n프로그램 종료 후에도 1~2개월 체질 유지 한약 권장.\n\n## 3. 식습관 정착\n저녁 식사 시간 고정 + 균형 식단.\n\n## 4. 규칙적 운동\n주 3회 30분 유산소 운동.\n\n## 5. 정기 점검\n3개월마다 체성분 검사 + 한방 진료.',
     'https://placehold.co/1200x630/1a4d3a/ffffff?text=Yoyo+Prevention',
     v_doc_shin_id, v_cat_diet_id),
    ('sasang-constitution-101',
     '사상체질 진단 입문 — 4가지 체질의 특징',
     '한방 다이어트 시작 전 알아야 할 사상체질의 기본을 정리한 인사이트입니다. 태양인·태음인·소양인·소음인 각 체질별 특징과 다이어트 접근 방식 차이를 학술 근거와 함께 다룹니다.',
     E'## 태양인\n간 기능이 약하고 폐 기능이 발달한 체질.\n\n## 태음인\n간 기능이 발달하고 폐 기능이 약한 체질. 다이어트 시 가장 흔한 체질.\n\n## 소양인\n비위 기능이 발달하고 신장 기능이 약한 체질.\n\n## 소음인\n신장 기능이 발달하고 비위 기능이 약한 체질.',
     'https://placehold.co/1200x630/c9a86b/ffffff?text=Sasang',
     v_doc_shin_id, v_cat_health_id),
    ('postpartum-care-tips',
     '산후 6주 골든타임 — 한방 산후 관리 가이드',
     '출산 후 6주 안 진행하는 한방 산후 관리의 효과와 일정을 정리합니다. 산후풍 예방 · 모유 수유 중 안전한 한약 · 호르몬 균형 회복까지 김예진 부원장이 직접 다룹니다.',
     E'## 1주차\n안정과 휴식 + 산후 보양 한약 시작.\n\n## 2~4주차\n산후풍 예방 한약 + 가벼운 산책.\n\n## 5~6주차\n호르몬 균형 회복 + 점진적 운동.',
     'https://placehold.co/1200x630/8b5a3c/ffffff?text=Postpartum',
     v_doc_kim_id, v_cat_health_id),
    ('detox-myths',
     '한방 디톡스의 5가지 오해와 진실',
     '한방 디톡스에 대한 흔한 오해를 정리하고 실제 과학적 근거와 한의학적 관점에서 설명합니다. 박준호 진료실장의 임상 사례와 한국한의학연구원 데이터를 함께 다룹니다.',
     E'## 오해 1: 디톡스 = 단식\n사실: 한방 디톡스는 절식이 아닌 정화입니다.\n\n## 오해 2: 노폐물 = 독소\n사실: 한의학에서 노폐물은 순환의 정체를 의미합니다.\n\n## 오해 3: 모두에게 같은 처방\n사실: 체질별 맞춤 처방이 필요합니다.',
     'https://placehold.co/1200x630/666666/ffffff?text=Detox+Myths',
     v_doc_park_id, v_cat_diet_id),
    ('winter-immunity-herbs',
     '겨울철 면역력 강화 한방 처방',
     '겨울철 면역력 강화에 도움이 되는 한약재와 한방 처방을 소개합니다. 일상 생활에서 활용 가능한 약차부터 의료 처방까지 다양한 단계의 면역 관리법을 정리한 가이드입니다.',
     E'## 약차 단계\n- 생강차\n- 인삼차\n\n## 한약 처방 단계\n- 보중익기탕\n- 십전대보탕',
     'https://placehold.co/1200x630/4a6b4a/ffffff?text=Winter+Herbs',
     v_doc_shin_id, v_cat_general_id)
  ) AS ar(slug, title, summary, body, hero, author_id, cat_id)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'Article'::compliance_content_type
   AND cr.content_ref = ar.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- (8) 5 FAQ (draft · v0.1 안 발행 차단 정합 — faq_status_v01_limit CHECK)
  INSERT INTO faq (instance_id, slug, question, answer, display_order, category_id, author_doctor_id)
  VALUES
    (v_instance_id, 'how-long-program', '굿바이 다이어트 프로그램은 얼마나 걸리나요?', '기본 12주 (3개월) 진행이며, 사후 관리 12주를 포함하면 총 24주 (6개월) 의 여정입니다. 환자 체질과 목표 체중에 따라 일정을 조정합니다.', 0, v_cat_diet_id, v_doc_shin_id),
    (v_instance_id, 'is-safe-for-pregnancy', '임신 중에도 한약을 복용할 수 있나요?', '임신 중 한약 복용은 매우 신중해야 합니다. 본원은 임신부 환자께는 다이어트 한약을 처방하지 않으며, 산전·산후 안전한 보양 한약만 처방합니다. 자세한 상담은 김예진 부원장과 진행하실 수 있습니다.', 1, v_cat_health_id, v_doc_kim_id),
    (v_instance_id, 'price-range', '진료비는 얼마나 되나요?', '비급여 진료비 안내 페이지에서 자세한 비용 정보를 확인하실 수 있습니다. 기본 진료 + 1개월 한약 패키지는 80~120만원 선이며, 환자 상태에 따라 조정됩니다.', 2, v_cat_general_id, NULL),
    (v_instance_id, 'side-effects', '한약 복용 시 부작용이 있나요?', '본원에서 처방하는 한약은 한의사 진단 후 처방되는 약재로 안전성이 검증되어 있습니다. 다만 개인 체질에 따라 일시적 소화 불편 등이 발생할 수 있으며, 이 경우 즉시 본원에 연락 주시면 처방 조정해 드립니다.', 3, v_cat_general_id, v_doc_shin_id),
    (v_instance_id, 'parking-info', '주차는 가능한가요?', '본원 건물 지하 주차장 30대 무료 이용 가능합니다. 진료 시간 안 가득 차는 경우가 있으니 가능하면 대중교통 (부평역 도보 5분) 이용을 권장드립니다.', 4, v_cat_general_id, NULL)
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- (9) 2 Publication (sentinel + published)
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'Publication'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-rich-Publication"}'::jsonb
  FROM (VALUES ('herbal-diet-clinical-2024'), ('sasang-bmi-correlation-2023')) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, url, thumbnail_url,
                            summary, author_doctor_id, status, published_at, compliance_record_id)
  SELECT v_instance_id, pub.slug, pub.title, pub.authors::jsonb, pub.journal, pub.pub_date::date,
    pub.doi, pub.url, pub.thumb, pub.summary, pub.author_id, 'published'::content_publication_status, NOW(), cr.id
  FROM (VALUES
    ('herbal-diet-clinical-2024',
     'Clinical Efficacy of Korean Herbal Medicine on Obesity: 10-Year Retrospective Study',
     '["신수용", "김예진", "박준호"]',
     'Journal of Korean Medicine',
     '2024-06-15',
     '10.1234/jkm.2024.06.001',
     'https://pubmed.ncbi.nlm.nih.gov/example1',
     'https://placehold.co/400x600/1a4d3a/ffffff?text=Paper+1',
     '10년간 1,500명 환자 대상 한방 다이어트 임상 후향 연구. 평균 체중 감량 8.3kg · 6개월 유지율 76%. 사상체질 별 효과 차이 분석 포함.',
     v_doc_shin_id),
    ('sasang-bmi-correlation-2023',
     'Sasang Constitution and BMI: A Cross-Sectional Study of 3,000 Korean Adults',
     '["신수용", "김예진"]',
     'Korean Journal of Oriental Medicine',
     '2023-11-20',
     '10.5678/kjom.2023.11.045',
     'https://pubmed.ncbi.nlm.nih.gov/example2',
     'https://placehold.co/400x600/c9a86b/ffffff?text=Paper+2',
     '한국 성인 3,000명 대상 사상체질과 BMI 상관관계 단면 연구. 태음인 비만 위험도 1.8배 분석. 한방 다이어트 임상 적용 가이드라인 제시.',
     v_doc_kim_id)
  ) AS pub(slug, title, authors, journal, pub_date, doi, url, thumb, summary, author_id)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'Publication'::compliance_content_type
   AND cr.content_ref = pub.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- (10) 2 MediaAppearance (sentinel + published)
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'MediaAppearance'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-rich-MediaAppearance"}'::jsonb
  FROM (VALUES ('youtube-diet-talk-2024'), ('broadcast-mbc-health-2024')) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO media_appearance (instance_id, slug, title, channel_name, channel_type, published_date,
                                  duration_seconds, url, thumbnail_url, summary, author_doctor_id,
                                  status, published_at, compliance_record_id)
  SELECT v_instance_id, m.slug, m.title, m.channel_name, m.channel_type::media_channel_type,
    m.pub_date::date, m.duration, m.url, m.thumb, m.summary, m.author_id,
    'published'::content_publication_status, NOW(), cr.id
  FROM (VALUES
    ('youtube-diet-talk-2024',
     '한방 다이어트의 진실 — 신수용 원장 인터뷰',
     '건강 톡톡',
     'youtube',
     '2024-09-15',
     1245,
     'https://www.youtube.com/watch?v=example-diet-talk',
     'https://placehold.co/640x360/1a4d3a/ffffff?text=YouTube',
     '건강 톡톡 채널 안 신수용 원장 인터뷰. 한방 다이어트의 과학적 근거와 임상 사례 안 다루는 20분 영상.',
     v_doc_shin_id),
    ('broadcast-mbc-health-2024',
     'MBC 건강 365 — 한의학으로 보는 비만의 원인',
     'MBC',
     'broadcast',
     '2024-11-03',
     2700,
     'https://www.imbc.com/broad/tv/culture/health365/example-2024-11-03',
     'https://placehold.co/640x360/c9a86b/ffffff?text=MBC',
     'MBC 건강 365 안 박준호 진료실장 출연. 한의학 관점의 비만 원인 분석과 일상 관리 팁 안 45분 방송.',
     v_doc_park_id)
  ) AS m(slug, title, channel_name, channel_type, pub_date, duration, url, thumb, summary, author_id)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'MediaAppearance'::compliance_content_type
   AND cr.content_ref = m.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO NOTHING;

  RAISE NOTICE 'seed-demo-rich: instance_id=% 안 더미 데이터 INSERT 완료', v_instance_id;
  RAISE NOTICE '- ClinicProfile 1 · LocationProfile 1 · LegalDocument 5 (published)';
  RAISE NOTICE '- DoctorProfile 4 (active 3 + inactive 1) · ArticleCategory 3';
  RAISE NOTICE '- TreatmentPage 3 (published) · Article 5 (published)';
  RAISE NOTICE '- FAQ 5 (draft · v0.1 발행 차단 정합) · Publication 2 (published) · MediaAppearance 2 (published)';
END $$;
