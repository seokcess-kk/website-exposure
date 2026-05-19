-- @glitzy/web/scripts/seed-demo-articles-news — 다이트 부평점 실 보도 자료 10건 매핑
-- 사용자 요청 (2026-05-20)
\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_cat_diet_id UUID;
  v_cat_health_id UUID;
  v_cat_general_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo';
  SELECT id INTO v_doc_shin_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'shin-suyong';
  SELECT id INTO v_cat_diet_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'diet';
  SELECT id INTO v_cat_health_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'health';
  SELECT id INTO v_cat_general_id FROM article_category WHERE instance_id = v_instance_id AND slug = 'general';

  -- === (1~5) 기존 5건 UPDATE — title/summary/hero/external_url 모두 갱신 ===
  UPDATE article SET
    title = '식사량 줄인 다이어트, 노안·근손실·요요 부른다… 체지방 관리 중요',
    summary = '전문가들은 무작정 식사량을 줄이는 다이어트가 노안 가속·근육 손실·요요현상 등 부작용을 초래할 수 있다고 경고하며, 체질 개선과 대사 균형을 맞추는 맞춤형 접근이 지속 가능한 체중 관리의 핵심이라고 강조합니다.',
    hero_image_url = 'https://cdn.eroun.net/news/photo/202604/79422_133483_1418.jpg',
    external_url = 'https://www.eroun.net/news/articleView.html?idxno=79422',
    category_id = v_cat_diet_id
   WHERE instance_id = v_instance_id AND slug = 'yoyo-prevention-five-rules';

  UPDATE article SET
    title = '봄철 피로가 체중 증가로 이어지는 이유 — 부평 다이어트 한의원의 혈당 관리 해법',
    summary = '봄철 일조량 증가와 환경 변화로 인한 피로가 당분 요구를 증가시키고 혈당 스파이크를 유발해 체중 증가로 이어질 수 있습니다. 전문가들은 단순한 식단 제한보다 혈당 안정과 신진대사 개선이 필요하다고 강조합니다.',
    hero_image_url = 'https://cdn.eroun.net/news/photo/202604/77750_131380_2242.jpg',
    external_url = 'https://www.eroun.net/news/articleView.html?idxno=77750',
    category_id = v_cat_diet_id
   WHERE instance_id = v_instance_id AND slug = 'sasang-constitution-101';

  UPDATE article SET
    title = '명절 후 급증한 체중, 부평 다이어트 한의원이 전하는 관리 해법',
    summary = '설 연휴 후 체중 증가로 고민하는 사람들이 늘고 있습니다. 전문가들은 빠른 감량보다 대사 균형 회복에 초점을 맞춰야 한다고 강조하며, 무리한 단식보다 맞춤형 한약 처방과 식이 관리를 통한 단계적 접근을 권장합니다.',
    hero_image_url = 'https://cdn.eroun.net/news/photo/202602/73743_126693_50.jpg',
    external_url = 'https://www.eroun.net/news/articleView.html?idxno=73743',
    category_id = v_cat_diet_id
   WHERE instance_id = v_instance_id AND slug = 'postpartum-care-tips';

  UPDATE article SET
    title = '다이트한의원 부평점, 동아일보 교육 채널 인터뷰 보도',
    summary = '다이트한의원 부평점 신수용 대표원장의 한방 다이어트 임상 노하우와 환자 맞춤 처방 안내가 동아일보 교육 채널 안 소개되었습니다. 신뢰성 있는 의료 매체 안 보도 자료를 통해 한의학적 다이어트 접근 안 가치 안 알렸습니다.',
    hero_image_url = 'https://placehold.co/1200x630/501A84/FDE1B8?text=Donga+Edu',
    external_url = 'https://edu.donga.com/news/articleView.html?idxno=103274',
    category_id = v_cat_general_id
   WHERE instance_id = v_instance_id AND slug = 'detox-myths';

  UPDATE article SET
    title = '부평다이어트한의원, 2026년 새해 앞두고 체중 관리 전략 공개',
    summary = '연말 모임과 외식으로 체중이 늘어난 환자들을 위해 부평다이어트한의원이 개인 체질에 맞춘 맞춤 다이어트 프로그램을 소개했습니다. 한약·약침·기기관리·식이 상담을 통한 단순 감량을 넘어 체질 개선과 요요 방지를 목표로 합니다.',
    hero_image_url = 'https://cdn.eroun.net/news/photo/202512/69648_121660_3524.jpg',
    external_url = 'https://www.eroun.net/news/articleView.html?idxno=69648',
    category_id = v_cat_diet_id
   WHERE instance_id = v_instance_id AND slug = 'winter-immunity-herbs';

  -- === (6~10) 신규 5건 INSERT (sentinel ComplianceRecord 동반 published) ===
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'Article'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-articles-news"}'::jsonb
  FROM (VALUES
    ('news-eroun-69302'),
    ('news-eroun-68936'),
    ('news-medisobiza-137049'),
    ('news-medisobiza-135143'),
    ('news-donga-99738')
  ) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'Article'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  INSERT INTO article (instance_id, slug, title, summary, body_markdown, hero_image_url, status, risk_level,
                        published_at, author_doctor_id, category_id, compliance_record_id, external_url)
  SELECT v_instance_id, a.slug, a.title, a.summary, a.body, a.hero, 'published'::content_publication_status, 'Low'::risk_level,
    NOW(), v_doc_shin_id, a.cat_id, cr.id, a.ext_url
  FROM (VALUES
    ('news-eroun-69302',
     '체중은 그대로인데 허리둘레만 늘어난다면 — 부평다이어트한의원이 주목한 신호',
     '체중 변화 없이 허리둘레만 증가하는 현상이 늘고 있습니다. 전문가들은 이를 내장지방 축적의 신호로 보며, 불규칙한 식사·스트레스·수면 부족이 지속되면 복부 지방이 먼저 쌓일 수 있다고 설명합니다.',
     E'## 내장지방 축적 신호\n외부 보도 자료 — eroun.net 안 원문 확인.',
     'https://cdn.eroun.net/news/photo/202512/69302_121216_926.jpg',
     v_cat_health_id,
     'https://www.eroun.net/news/articleView.html?idxno=69302'),
    ('news-eroun-68936',
     '연말 회식도 걱정 끝 — 다이트한의원 부평점의 "술 마셔도 살 빠지는 다이어트"',
     '연말 회식 시즌 다이어트 관리법 보도 자료입니다. 다이트한의원 부평점 신수용 원장이 술 선택과 안주 구성, 다음날 회복 루틴의 중요성을 강조하며 당분 없는 증류주와 단백질 기반 안주를 권장합니다.',
     E'## 술 마셔도 살 빠지는 다이어트\n외부 보도 자료 — eroun.net 안 원문 확인.',
     'https://cdn.eroun.net/news/photo/202512/68936_120775_221.jpg',
     v_cat_diet_id,
     'https://www.eroun.net/news/articleView.html?idxno=68936'),
    ('news-medisobiza-137049',
     '인천 다이어트 한의원 — 4월 야외운동 늘었는데 체중 그대로인 이유',
     '봄철 야외운동 증가에도 불구하고 체중 감량이 정체되는 현상이 나타나고 있습니다. 운동 후 증가된 식욕과 보상 심리로 인한 과식이 주요 원인이며, 운동량만 늘리기보다 식욕 조절과 혈당 안정을 함께 관리해야 한다고 조언합니다.',
     E'## 운동량 + 식욕 관리\n외부 보도 자료 — medisobizanews.com 안 원문 확인.',
     'https://cdn.medisobizanews.com/news/photo/202604/137049_129600_2827.jpg',
     v_cat_diet_id,
     'http://www.medisobizanews.com/news/articleView.html?idxno=137049'),
    ('news-medisobiza-135143',
     '얇아진 옷차림 안 체형 관리 — 인천 부평 다이어트 한약 상담 증가',
     '2월 말 봄 시즌 앞두고 체형 관리 수요가 증가하고 있습니다. 특히 30~40대 여성층이 출산 후 체형 변화와 요요 현상으로 고민하며 건강을 고려한 맞춤형 한약 다이어트 상담을 찾는 추세입니다.',
     E'## 30~40대 여성 한약 다이어트\n외부 보도 자료 — medisobizanews.com 안 원문 확인.',
     'https://cdn.medisobizanews.com/news/photo/202602/135143_127511_4915.png',
     v_cat_health_id,
     'http://www.medisobizanews.com/news/articleView.html?idxno=135143'),
    ('news-donga-99738',
     '다이트한의원 부평점, 인천 지역 다이어트 전문 한의원 보도 — 동아일보 교육',
     '다이트한의원 부평점의 진료 안내와 의료진 안내가 동아일보 교육 채널 안 보도되었습니다. 부평 지역 환자들의 한방 다이어트 접근 가이드 안 신뢰성 있는 매체 안 통해 알려진 사례입니다.',
     E'## 동아일보 교육 보도\n외부 보도 자료 — edu.donga.com 안 원문 확인.',
     'https://placehold.co/1200x630/8D60CE/33005E?text=Donga+Edu',
     v_cat_general_id,
     'https://edu.donga.com/news/articleView.html?idxno=99738')
  ) AS a(slug, title, summary, body, hero, cat_id, ext_url)
  JOIN compliance_record cr
    ON cr.instance_id = v_instance_id
   AND cr.content_type = 'Article'::compliance_content_type
   AND cr.content_ref = a.slug
   AND cr.metadata @> '{"sentinel":true}'::jsonb
  ON CONFLICT (instance_id, slug) DO NOTHING;

  RAISE NOTICE 'seed-demo-articles-news: % published article (external_url 있음 %건)',
    (SELECT count(*) FROM article WHERE instance_id = v_instance_id AND status='published'),
    (SELECT count(*) FROM article WHERE instance_id = v_instance_id AND external_url IS NOT NULL);
END $$;
