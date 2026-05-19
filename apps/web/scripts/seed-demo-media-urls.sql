-- @glitzy/web/scripts/seed-demo-media-urls — 실제 다이트한의원 YouTube Shorts 10개 URL 적용 (사용자 제공)
\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo';
  SELECT id INTO v_doc_shin_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'shin-suyong';

  -- === (1) 기존 8 published 안 url UPDATE + channel_type=youtube 통일 + thumbnail i.ytimg.com ===
  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/1i3Lln0rMCI',
    channel_type = 'youtube'::media_channel_type,
    thumbnail_url = 'https://i.ytimg.com/vi/1i3Lln0rMCI/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'broadcast-mbc-health-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/6KsojLrRfaU',
    thumbnail_url = 'https://i.ytimg.com/vi/6KsojLrRfaU/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-plateau-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/UXH0f8OZNIE',
    thumbnail_url = 'https://i.ytimg.com/vi/UXH0f8OZNIE/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-age-diet-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/hdoLrKfmPL8',
    thumbnail_url = 'https://i.ytimg.com/vi/hdoLrKfmPL8/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-diet-talk-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/PmTdnRK0Tao',
    thumbnail_url = 'https://i.ytimg.com/vi/PmTdnRK0Tao/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-eat-to-lose-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/2QnXM3Fq7us',
    thumbnail_url = 'https://i.ytimg.com/vi/2QnXM3Fq7us/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-sasang-101-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/EjWm-o4HTng',
    thumbnail_url = 'https://i.ytimg.com/vi/EjWm-o4HTng/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-postpartum-care-2024';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/2gpKgYqu_hU',
    thumbnail_url = 'https://i.ytimg.com/vi/2gpKgYqu_hU/hqdefault.jpg'
   WHERE instance_id = v_instance_id AND slug = 'youtube-detox-myth-2024';

  -- === (2) publishable 안 1건 안 기존 record 안 record_phase 안 published 안 UPDATE + URL #9 ===
  UPDATE compliance_record SET
    record_phase = 'published'::compliance_record_phase,
    published_at = COALESCE(published_at, NOW()),
    published_by = COALESCE(published_by, v_sentinel_user),
    metadata = metadata || '{"forcedPublishedAt":"2026-05-20","reason":"seed-demo-media-urls"}'::jsonb
   WHERE instance_id = v_instance_id
     AND content_type = 'MediaAppearance'::compliance_content_type
     AND content_ref = 'jusahyeong-bimanchiryoje-yuhaeng-igeo-gwaenchanheulkkayo'
     AND record_phase <> 'published';

  UPDATE media_appearance SET
    url = 'https://www.youtube.com/shorts/885OAVQ1syg',
    channel_type = 'youtube'::media_channel_type,
    thumbnail_url = 'https://i.ytimg.com/vi/885OAVQ1syg/hqdefault.jpg',
    status = 'published'::content_publication_status,
    published_at = COALESCE(published_at, NOW()),
    compliance_record_id = COALESCE(compliance_record_id, (
      SELECT id FROM compliance_record
       WHERE instance_id = v_instance_id
         AND content_type = 'MediaAppearance'::compliance_content_type
         AND content_ref = 'jusahyeong-bimanchiryoje-yuhaeng-igeo-gwaenchanheulkkayo'
       LIMIT 1
    ))
   WHERE instance_id = v_instance_id AND slug = 'jusahyeong-bimanchiryoje-yuhaeng-igeo-gwaenchanheulkkayo';

  -- === (3) 10번째 신규 INSERT (sentinel + published + URL #10) ===
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'MediaAppearance'::compliance_content_type, 'youtube-shorts-extra-2024', 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-media-urls"}'::jsonb
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = 'youtube-shorts-extra-2024'
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO media_appearance (instance_id, slug, title, channel_name, channel_type, published_date,
                                  duration_seconds, url, thumbnail_url, summary, author_doctor_id,
                                  status, published_at, compliance_record_id)
  SELECT v_instance_id, 'youtube-shorts-extra-2024',
    '다이어트 한약, 정말 효과 있을까?',
    '다이트한의원 공식 채널', 'youtube'::media_channel_type,
    '2024-05-20'::date, 60,
    'https://www.youtube.com/shorts/VyRUl2zOngU',
    'https://i.ytimg.com/vi/VyRUl2zOngU/hqdefault.jpg',
    '다이어트 한약의 임상 효과와 한방 처방의 안전성에 대한 다이트한의원 의료진의 솔직한 설명 안 짧은 영상으로 정리한 컨텐츠.',
    v_doc_shin_id, 'published'::content_publication_status, NOW(),
    cr.id
  FROM compliance_record cr
   WHERE cr.instance_id = v_instance_id
     AND cr.content_type = 'MediaAppearance'::compliance_content_type
     AND cr.content_ref = 'youtube-shorts-extra-2024'
     AND cr.metadata @> '{"sentinel":true}'::jsonb
   LIMIT 1
  ON CONFLICT (instance_id, slug) DO NOTHING;

  -- === (4) 정확한 published_date 일괄 정정 — YouTube 페이지 datePublished 메타 기반 (KST 변환).
  --     출처: 각 영상 URL https://www.youtube.com/shorts/{videoId} 의 itemprop="datePublished" 메타.
  --     예: PT 2026-05-14 19:21 → KST 2026-05-15 (+1일)
  UPDATE media_appearance SET
    published_date = CASE slug
      WHEN 'broadcast-mbc-health-2024'                              THEN '2026-05-15'::date  -- 1i3Lln0rMCI
      WHEN 'youtube-plateau-2024'                                   THEN '2026-05-15'::date  -- 6KsojLrRfaU
      WHEN 'youtube-age-diet-2024'                                  THEN '2026-05-15'::date  -- UXH0f8OZNIE
      WHEN 'youtube-diet-talk-2024'                                 THEN '2026-05-15'::date  -- hdoLrKfmPL8
      WHEN 'youtube-eat-to-lose-2024'                               THEN '2026-05-15'::date  -- PmTdnRK0Tao
      WHEN 'youtube-sasang-101-2024'                                THEN '2026-05-15'::date  -- 2QnXM3Fq7us
      WHEN 'youtube-postpartum-care-2024'                           THEN '2026-05-06'::date  -- EjWm-o4HTng
      WHEN 'youtube-detox-myth-2024'                                THEN '2026-05-06'::date  -- 2gpKgYqu_hU
      WHEN 'jusahyeong-bimanchiryoje-yuhaeng-igeo-gwaenchanheulkkayo' THEN '2026-04-24'::date  -- 885OAVQ1syg
      WHEN 'youtube-shorts-extra-2024'                              THEN '2026-05-06'::date  -- VyRUl2zOngU
      ELSE published_date
    END,
    updated_at = now()
   WHERE instance_id = v_instance_id
     AND slug IN (
       'broadcast-mbc-health-2024','youtube-plateau-2024','youtube-age-diet-2024',
       'youtube-diet-talk-2024','youtube-eat-to-lose-2024','youtube-sasang-101-2024',
       'youtube-postpartum-care-2024','youtube-detox-myth-2024',
       'jusahyeong-bimanchiryoje-yuhaeng-igeo-gwaenchanheulkkayo','youtube-shorts-extra-2024'
     );

  RAISE NOTICE 'seed-demo-media-urls: % published 미디어',
    (SELECT count(*) FROM media_appearance WHERE instance_id = v_instance_id AND status='published');
END $$;
