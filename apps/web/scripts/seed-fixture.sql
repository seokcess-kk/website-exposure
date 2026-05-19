-- ClinicProfile fixture (test only)
INSERT INTO clinic_profile (
  instance_id, slug, name, description, logo_url, og_image_url,
  business_registration_number, alternate_name, legal_entity_name, slogan,
  long_description, founder, founding_date,
  policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
  primary_ctas
) VALUES (
  '10248233-9f05-449b-a0cc-9c51b81e8bdb', 'clinic',
  '글리치 한의원 부평점',
  '체질 진단 기반 한방 다이어트 전문 클리닉으로, 신수용 원장의 학술 근거 기반 굿바이 다이어트 프로그램을 통해 환자 한 명 한 명의 체질에 맞춰 근본적인 체중 변화를 시작하고 요요를 방지합니다.',
  'https://placeholder.example.com/logo.png',
  'https://placeholder.example.com/og.png',
  '123-45-67890', '글리치한의원', '주식회사 글리치 의료재단', '근본부터 바꾸는 한의학',
  E'## 진료 철학\n\n과학적 근거에 기반한 한방 다이어트를 추구합니다.\n\n## 원장 인사말\n\n환자 한 분 한 분의 체질을 진단하고 맞춤 처방을 제공합니다.',
  '신수용', '2024-03-01',
  '신수용', 'privacy@glitzy.kr', '032-0000-0000', '2026-01-01',
  '[{"id":"phone-1","type":"phone","label":"전화 예약","targetUrl":"tel:+82-32-0000-0000"},{"id":"kakao-talk-1","type":"kakao-talk","label":"카카오 상담","targetUrl":"https://pf.kakao.com/_glitzy"},{"id":"naver-reservation-1","type":"naver-reservation","label":"네이버 예약","targetUrl":"https://booking.naver.com/booking/glitzy"}]'::jsonb
);

INSERT INTO location_profile (
  instance_id, slug, name, street_address, address_locality, address_region, postal_code, address_country,
  phone, email, clinic_profile_id, metadata
) VALUES (
  '10248233-9f05-449b-a0cc-9c51b81e8bdb', 'main',
  '글리치 한의원 부평점',
  '부평대로 100', '부평구', '인천광역시', '21391', 'KR',
  '032-0000-0000', 'info@glitzy.kr',
  (SELECT id FROM clinic_profile WHERE instance_id = '10248233-9f05-449b-a0cc-9c51b81e8bdb' AND slug = 'clinic'),
  '{"businessHours":{"openingHours":[{"dayOfWeek":["Monday","Tuesday","Wednesday","Friday"],"opens":"10:00","closes":"19:00"},{"dayOfWeek":["Thursday"],"opens":"10:00","closes":"20:00"},{"dayOfWeek":["Saturday"],"opens":"10:00","closes":"14:00"}],"receptionHours":[],"lunchBreaks":[{"dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"from":"13:00","to":"14:00"}],"specialClosures":[]},"reservationChannelsInheritedFrom":"clinic_profile.primary_ctas","representativeDoctors":[],"featuredChannelId":"phone-1"}'::jsonb
);

INSERT INTO doctor_profile (instance_id, slug, name, title, bio, photo_url, display_order, active)
VALUES
  ('10248233-9f05-449b-a0cc-9c51b81e8bdb', 'shin-suyong', '신수용', '대표원장', '한의학 박사 과정. 굿바이 다이어트 임상 10년.', 'https://placeholder.example.com/doctor-shin.png', 0, true),
  ('10248233-9f05-449b-a0cc-9c51b81e8bdb', 'kim-test', '김테스트', '부원장', '체질 진단 전문.', 'https://placeholder.example.com/doctor-kim.png', 1, true);

INSERT INTO treatment_page (instance_id, slug, title, summary, body_markdown, hero_image_url, status, risk_level, published_at)
VALUES
  ('10248233-9f05-449b-a0cc-9c51b81e8bdb', 'goodbye-diet',
   '굿바이 다이어트',
   '체질 진단 기반 한방 다이어트 프로그램으로 3원칙(체질진단·맞춤처방·사후관리)을 통해 근본적인 체중 변화를 시작합니다. 임상 10년 경험.',
   E'## 굿바이 다이어트 3원칙\n\n### 1. 체질 진단\n\n## 2. 맞춤 처방\n\n## 3. 사후 관리',
   'https://placeholder.example.com/treatment-diet.png',
   'published', 'Low', NOW()),
  ('10248233-9f05-449b-a0cc-9c51b81e8bdb', 'detox-program',
   '디톡스 프로그램',
   '한방 디톡스 처방으로 체내 노폐물 배출과 순환을 개선하는 3주 단기 프로그램입니다. 식이 가이드와 함께 진행합니다.',
   E'## 디톡스 3주 프로그램\n\n주1 한약 처방 + 식이 가이드.',
   'https://placeholder.example.com/treatment-detox.png',
   'published', 'Low', NOW());

INSERT INTO article (instance_id, slug, title, summary, body_markdown, hero_image_url, status, risk_level, published_at,
                     author_doctor_id)
VALUES
  ('10248233-9f05-449b-a0cc-9c51b81e8bdb', 'yoyo-prevention',
   '요요 방지 5가지 원칙',
   '한방 다이어트 프로그램 종료 후 요요 현상을 방지하는 5가지 핵심 원칙을 정리한 인사이트 글입니다. 임상 관찰 데이터와 한의학 학술 근거를 함께 다루며, 운영 가이드와 정기 점검 권장까지 포함합니다.',
   E'## 요요 방지\n\n1. 점진적 감량\n2. 체질 유지 한약\n3. 식습관\n4. 운동\n5. 정기 점검',
   'https://placeholder.example.com/article-yoyo.png',
   'published', 'Low', NOW(),
   (SELECT id FROM doctor_profile WHERE instance_id = '10248233-9f05-449b-a0cc-9c51b81e8bdb' AND slug = 'shin-suyong'));
