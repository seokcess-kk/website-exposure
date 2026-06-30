-- @glitzy/web/scripts/seed-demo-bupyeong-article — 데모: "부평다이어트한의원" 타깃 아티클 1건
-- 목적: 네이버 검색 "부평다이어트한의원" 시 우리 사이트 아티클이 잡히는 구조 시연.
-- 패턴: 즉시 발행 모드(saveArticle 동일) — sentinel compliance_record + status='published' + published_at.
-- 본문: 의료광고법 정합(효과 단정·완치·가격·유인 표현 없음) · TL;DR 정의 첫 문장 + H2 + FAQ block.
-- idempotent: 모든 INSERT ON CONFLICT DO UPDATE — 재실행 안전.

DO $$
DECLARE
  v_instance uuid;
  v_category uuid;
  v_author uuid;
  v_user uuid;
  v_sentinel uuid;
  v_article uuid;
  v_keyword uuid;
  v_slug text := 'bupyeong-diet-clinic-guide';
  v_title text := '부평다이어트한의원 선택 전 꼭 확인할 5가지';
  v_summary text := '부평다이어트한의원을 고를 때 확인할 진료 방식·상담 절차·한약 구성·생활관리·내원 동선 5가지를 정리했습니다. 본 글은 일반 정보 제공 목적이며 진단·치료를 대체하지 않습니다.';
  v_body text;
BEGIN
  SELECT id INTO v_instance FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance IS NULL THEN RAISE EXCEPTION 'demo instance 없음'; END IF;
  PERFORM set_config('app.current_instance_id', v_instance::text, true);

  SELECT id INTO v_category FROM article_category WHERE instance_id = v_instance AND slug = 'general' LIMIT 1;
  IF v_category IS NULL THEN RAISE EXCEPTION 'general 카테고리 없음 (seed 부트스트랩 필요)'; END IF;

  SELECT id INTO v_author FROM doctor_profile
    WHERE instance_id = v_instance AND active = true
    ORDER BY display_order ASC, id ASC LIMIT 1; -- 없으면 null (저자 미연결)

  SELECT user_id INTO v_user FROM instance_membership
    WHERE instance_id = v_instance AND active = true LIMIT 1;
  IF v_user IS NULL THEN SELECT id INTO v_user FROM admin_user ORDER BY created_at ASC LIMIT 1; END IF;
  IF v_user IS NULL THEN RAISE EXCEPTION 'admin_user 없음'; END IF;

  v_body :=
'부평다이어트한의원은 인천 부평 지역에서 한의학적 진찰을 바탕으로 체중 관리를 돕는 한의원을 말한다. 처음 내원하기 전, 아래 5가지를 확인하면 본인에게 맞는 곳을 고르는 데 도움이 된다.

## 1. 진료 방식과 상담 절차
첫 상담에서 생활 습관·식이·수면·기존 병력을 충분히 문진하는지 확인한다. 표준화된 상담 절차와 기록이 있는 곳일수록 경과를 일관되게 살펴볼 수 있다. 부평다이어트한의원을 비교할 때 상담 깊이는 중요한 기준이 된다.

## 2. 한약·치료 구성의 설명
처방의 구성과 복용 방법, 주의사항을 사전에 설명하는지 살펴본다. 개인의 체질과 건강 상태에 따라 구성이 달라질 수 있으므로, 일률적인 약속보다 개인별 설명을 제공하는지가 중요하다.

## 3. 부작용·주의사항 안내
복용 중 나타날 수 있는 반응과 중단·재상담 기준을 미리 안내받는지 확인한다. 안전 정보를 투명하게 제공하는 것은 신뢰의 기본이다.

## 4. 생활관리 동행 여부
한의원 관리는 식이·활동 등 일상 습관과 함께 진행될 때 도움이 된다. 내원과 내원 사이의 생활관리를 함께 안내하는지 확인한다.

## 5. 위치와 내원 동선
부평역 인근 접근성과 진료 시간, 예약 방법을 미리 확인하면 꾸준한 내원 계획을 세우는 데 도움이 된다.

## 자주 묻는 질문
### Q. 부평다이어트한의원은 어떻게 고르면 좋을까요?
상담 절차, 처방 설명, 부작용 안내, 생활관리 동행, 접근성을 함께 확인하시기를 권장합니다.

### Q. 한약 복용 중 주의할 점이 있나요?
복용 방법과 주의사항은 개인 상태에 따라 다르므로 진료 시 안내에 따르시고, 이상 반응이 있으면 상담을 권장합니다.

### Q. 결과는 보장되나요?
체중 관리 결과에는 개인차가 있으며, 본 글은 일반 정보 제공을 목적으로 하며 특정한 결과를 보장하지 않습니다.';

  -- (1) sentinel compliance_record (saveArticle 의 ensureSentinelComplianceRecord 동일 패턴)
  INSERT INTO compliance_record (
    instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at,
    published_at, published_by, record_phase, record_version, metadata
  ) VALUES (
    v_instance, 'Article', v_slug, 'Low',
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_user, NOW(), NOW(), v_user, 'published', 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"demo-seed bupyeong article"}'::jsonb
  )
  ON CONFLICT (instance_id, content_type, content_ref, record_version)
  DO UPDATE SET updated_at = NOW()
  RETURNING id INTO v_sentinel;

  -- (2) article (status='published' + published_at)
  INSERT INTO article (
    instance_id, slug, title, summary, body_markdown, status, risk_level,
    author_doctor_id, category_id, compliance_record_id, published_at
  ) VALUES (
    v_instance, v_slug, v_title, v_summary, v_body, 'published', 'Low',
    v_author, v_category, v_sentinel, NOW()
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    body_markdown = EXCLUDED.body_markdown,
    status = 'published',
    risk_level = 'Low',
    author_doctor_id = EXCLUDED.author_doctor_id,
    category_id = EXCLUDED.category_id,
    compliance_record_id = EXCLUDED.compliance_record_id,
    published_at = COALESCE(article.published_at, NOW()),
    updated_at = NOW()
  RETURNING id INTO v_article;

  -- (3) keyword_target "부평다이어트한의원" (local · P0 · active)
  INSERT INTO keyword_target (
    instance_id, slug, label, keyword_type, intent, priority, region_scope, status
  ) VALUES (
    v_instance, 'bupyeong-diet-clinic', '부평다이어트한의원', 'primary', 'local', 'P0', '인천 부평구', 'active'
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    label = EXCLUDED.label, intent = EXCLUDED.intent, priority = EXCLUDED.priority,
    region_scope = EXCLUDED.region_scope, status = 'active', updated_at = NOW()
  RETURNING id INTO v_keyword;

  -- (4) keyword ↔ article primary 매핑 (is_primary)
  INSERT INTO keyword_content_link (
    instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary
  ) VALUES (
    v_instance, v_keyword, 'Article', v_article, 80, true
  )
  ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET
    is_primary = true, relevance_score = 80, updated_at = NOW();

  RAISE NOTICE '부평다이어트한의원 아티클 seed 완료 — article=% · keyword=% · /demo/insights/general/%', v_article, v_keyword, v_slug;
END $$;
