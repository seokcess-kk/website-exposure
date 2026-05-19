-- EAT_CONTENT v1.0 fixture — Publication / MediaAppearance / FAQ 샘플 (test only)
-- v0.1 FAQ status='draft' 강제 (DB CHECK). Publication/Media 는 published.

INSERT INTO publication (
  instance_id, slug, title, authors, journal, published_date,
  doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
  status, risk_level, published_at
) VALUES (
  '10248233-9f05-449b-a0cc-9c51b81e8bdb', 'shin-2024-acupuncture-obesity',
  '한방 침구 치료가 비만 체질에 미치는 임상 효과 분석',
  '["신수용", "김임상"]'::jsonb,
  '대한한방학회지', '2024-06-15',
  '10.1234/journal.2024.06.015', '12345678',
  'https://example.com/pub/shin2024',
  'https://placeholder.example.com/pub-thumb.png',
  '본 연구는 12주 한방 침구 치료가 비만 체질 환자 군에 미치는 영향을 분석한 임상 결과를 정리합니다. 신수용 원장 책임 연구.',
  (SELECT id FROM doctor_profile WHERE instance_id = '10248233-9f05-449b-a0cc-9c51b81e8bdb' AND slug = 'shin-suyong'),
  'published', 'Low', NOW()
) ON CONFLICT (instance_id, slug) DO NOTHING;

INSERT INTO media_appearance (
  instance_id, slug, title, channel_name, channel_type, published_date,
  duration_seconds, url, thumbnail_url, summary, author_doctor_id,
  status, risk_level, published_at
) VALUES (
  '10248233-9f05-449b-a0cc-9c51b81e8bdb', 'kbs-saengnobyeong-2024',
  'KBS 생로병사의 비밀 — 한방 다이어트 임상 사례',
  'KBS', 'broadcast', '2024-03-10',
  3720, 'https://example.com/media/kbs2024',
  'https://placeholder.example.com/media-thumb.png',
  'KBS 생로병사의 비밀 프로그램 출연 영상. 한방 다이어트 임상 사례와 체질 진단 기반 처방 흐름 소개.',
  (SELECT id FROM doctor_profile WHERE instance_id = '10248233-9f05-449b-a0cc-9c51b81e8bdb' AND slug = 'shin-suyong'),
  'published', 'Low', NOW()
) ON CONFLICT (instance_id, slug) DO NOTHING;

INSERT INTO faq (
  instance_id, slug, question, answer, display_order, status, risk_level
) VALUES (
  '10248233-9f05-449b-a0cc-9c51b81e8bdb', 'diet-duration',
  '한방 다이어트 효과는 얼마나 걸리나요?',
  '**개인차가 있으나** 일반적으로 4~12주 정도의 프로그램을 권장합니다. 자세한 상담은 내원 후 결정합니다. 본 답변은 50자 이상 정합 충족.',
  0, 'draft', 'Low'
) ON CONFLICT (instance_id, slug) DO NOTHING;
