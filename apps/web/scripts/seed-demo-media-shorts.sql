-- @glitzy/web/scripts/seed-demo-media-shorts — 다이트 YouTube 숏폼 6건 추가 (마퀴 시각 효과)
\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo';
  SELECT id INTO v_doc_shin_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'shin-suyong';

  -- (1) sentinel ComplianceRecord 6건
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'MediaAppearance'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-media-shorts"}'::jsonb
  FROM (VALUES
    ('youtube-plateau-2024'),
    ('youtube-age-diet-2024'),
    ('youtube-eat-to-lose-2024'),
    ('youtube-sasang-101-2024'),
    ('youtube-postpartum-care-2024'),
    ('youtube-detox-myth-2024')
  ) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  -- (2) MediaAppearance INSERT (모두 YouTube · vertical thumbnail 9:16)
  INSERT INTO media_appearance (instance_id, slug, title, channel_name, channel_type, published_date,
                                  duration_seconds, url, thumbnail_url, summary, author_doctor_id,
                                  status, published_at, compliance_record_id)
  SELECT v_instance_id, m.slug, m.title, '다이트한의원 공식 채널', 'youtube'::media_channel_type,
    m.pub_date::date, m.duration, m.url, m.thumb, m.summary, v_doc_shin_id,
    'published'::content_publication_status, NOW(), cr.id
  FROM (VALUES
    ('youtube-plateau-2024',
     '정체기는 자연스러운 현상',
     '2024-10-12', 58,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/501A84/FDE1B8?text=%EC%A0%95%EC%B2%B4%EA%B8%B0',
     '다이어트 중 정체기에 마주칠 때 우리 몸이 보내는 신호와 한방 처방 안 대처법 안 다이트한의원 신수용 대표원장이 직접 설명하는 영상입니다.'),
    ('youtube-age-diet-2024',
     '나이 들면 살 빼기 더 어렵다?',
     '2024-09-28', 75,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/8D60CE/33005E?text=%EB%82%98%EC%9D%B4',
     '나이가 들면서 변하는 신진대사와 호르몬 변화에 맞춘 맞춤 다이어트 접근 방식을 한의학 관점에서 정리한 다이트한의원 공식 인사이트.'),
    ('youtube-eat-to-lose-2024',
     '먹어야 살 빠집니다',
     '2024-09-05', 62,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/33005E/FDE1B8?text=%EB%A8%B9%EC%9E%90',
     '굶지 않는 다이어트의 한의학적 원리와 실제 식단 가이드를 다이트한의원 신수용 대표원장이 임상 사례와 함께 정리한 영상입니다.'),
    ('youtube-sasang-101-2024',
     '사상체질 다이어트 — 4가지 체질의 차이',
     '2024-08-20', 92,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/501A84/FDE1B8?text=%EC%82%AC%EC%83%81',
     '태양인·태음인·소양인·소음인 사상체질별 다이어트 접근 방식의 차이와 한약 처방의 핵심을 다이트한의원 임상 데이터로 설명합니다.'),
    ('youtube-postpartum-care-2024',
     '산후 6주 골든타임',
     '2024-07-15', 68,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/8D60CE/FDE1B8?text=%EC%82%B0%ED%9B%84',
     '출산 후 6주 안 진행하는 산후 회복 한방 케어와 다이트 프로그램의 단계별 접근을 다이트한의원 전문 의료진이 정리한 가이드.'),
    ('youtube-detox-myth-2024',
     '한방 디톡스의 5가지 오해',
     '2024-06-30', 70,
     'https://www.youtube.com/@daeatdiet',
     'https://placehold.co/540x960/33005E/8D60CE?text=%EB%94%94%ED%86%A1%EC%8A%A4',
     '한방 디톡스에 대한 흔한 오해와 한의학 관점에서의 진실을 박준호 진료실장이 임상 사례와 함께 설명하는 다이트한의원 영상.')
  ) AS m(slug, title, pub_date, duration, url, thumb, summary)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'MediaAppearance'::compliance_content_type
   AND cr.content_ref = m.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO NOTHING;

  RAISE NOTICE 'seed-demo-media-shorts: % 미디어 출연 INSERT 완료',
    (SELECT count(*) FROM media_appearance WHERE instance_id = v_instance_id);
END $$;
