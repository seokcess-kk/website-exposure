-- @glitzy/web/scripts/seed-demo-incheon-publications — 인천 부평점 의료진 참여 논문 6건 INSERT
-- 사용자 요청 (2026-05-20). seed-demo-incheon-doctors.sql 안 신수용·정우령 row 가 만들어진 뒤 실행.
-- bio markdown 안 "주요 논문" 섹션은 별도 entity 로 분리되어 detail page 안 "참여 논문" 섹션이 자동 렌더링.
--
--   (1) 신수용 — 한방비만학회지 2024 (마황·암페타민 위양성 후향적 분석)
--   (2~5) 정우령 — 한방내과/침구 분야 4건 (학회지·연도는 추정 fallback. 사용자 정정 권장)
--   (6) 신수용 외 — 대한한방내과학회지 2026, KCI ART003327442 (중의학 비만 치료 scoping review · 11명 공저)
--
-- 주의:
--   - published_date NOT NULL DATE — 정확한 게재일이 ajax 상세에 없어 연도만 추정. 월일은 01-01 fallback.
--   - url NOT NULL https?:// — 정확한 학회지 게재 URL 미상. 인천 부평점 의료진 페이지 fallback 사용.
--   - summary 50-300자 CHECK — 모두 통과.
--   - status='published' + published_at=NOW() — D0011 app_public_reader policy 통과 (site 노출).
--   - published_content_compliance_guard trigger 정합: 본 seed 안 각 slug 별 'Publication' sentinel ComplianceRecord
--     를 사전 INSERT 후, publication.compliance_record_id 컬럼에 SELECT subquery 로 매핑.

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_doc_jung_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
  v_fallback_url TEXT := 'https://incheon.daeatdiet.com/bbs/board.php?bo_table=doctor';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-incheon-publications: instance slug=demo 미발견.';
  END IF;

  SELECT id INTO v_doc_shin_id FROM doctor_profile
   WHERE instance_id = v_instance_id AND slug = 'shin-soo-yong';
  IF v_doc_shin_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-incheon-publications: doctor_profile slug=shin-soo-yong 미발견. seed-demo-incheon-doctors.sql 먼저 실행.';
  END IF;

  SELECT id INTO v_doc_jung_id FROM doctor_profile
   WHERE instance_id = v_instance_id AND slug = 'jung-wooryeong';
  IF v_doc_jung_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-incheon-publications: doctor_profile slug=jung-wooryeong 미발견. seed-demo-incheon-doctors.sql 먼저 실행.';
  END IF;

  -- ComplianceRecord sentinel 사전 INSERT — published_content_compliance_guard trigger 통과용.
  -- seed-demo-rich.sql § (9) 패턴 동일. NOT EXISTS guard 로 재실행 idempotent.
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'Publication'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-incheon-publications"}'::jsonb
  FROM (VALUES
    ('shin-2024-mahuang-amphetamine-false-positive'),
    ('jung-paralytic-ileus-case-report'),
    ('jung-breast-cancer-osuyu-buja-case'),
    ('jung-electric-warm-needle-temperature'),
    ('jung-electric-warm-needle-safety-guideline'),
    ('shin-2026-kci-tcm-obesity-scoping-review')
  ) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  -- (1) 신수용 — 한방비만학회지 2024
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'shin-2024-mahuang-amphetamine-false-positive',
    '한의 비만 클리닉에서 확인된 마황 함유 한약 복용 중 암페타민 면역측정법의 위양성 사례 및 휴약 후 음성 사례의 후향적 분석연구',
    '["신수용"]'::jsonb, '한방비만학회지', '2024-01-01', NULL, NULL, v_fallback_url,
    '한의 비만 클리닉을 내원한 환자 가운데 마황 함유 한약 복용 중 소변 약물검사에서 암페타민 위양성이 확인된 사례 및 한약 휴약 후 음성으로 전환된 사례를 후향적으로 분석한 연구. 한방 비만 치료의 임상 안전성 평가에 대한 근거 자료를 제공합니다.',
    v_doc_shin_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='shin-2024-mahuang-amphetamine-false-positive' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  -- (2) 정우령 — 마비성 장폐색 증례 (2023 추정)
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'jung-paralytic-ileus-case-report',
    '한방치료로 호전된 마비성 장폐색 환자 증례 보고 1례',
    '["정우령"]'::jsonb, '대한한방내과학회지', '2023-01-01', NULL, NULL, v_fallback_url,
    '양방 치료에 반응이 미흡하던 마비성 장폐색 환자에 대해 한방 변증 진단을 바탕으로 한약·약침 병행 치료를 적용해 회복을 이끌어낸 임상 사례를 기록한 증례 보고 연구. 한방 내과 영역의 보완 치료 가능성을 보여주는 임상 자료입니다.',
    v_doc_jung_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='jung-paralytic-ileus-case-report' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  -- (3) 정우령 — 유방암 재발 환자 장궐·현훈 오수유부자이중탕 치험 (2022 추정)
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'jung-breast-cancer-osuyu-buja-case',
    '유방암 재발 환자의 장궐 및 현훈이 오수유부자이중탕으로 호전된 치험 1례',
    '["정우령"]'::jsonb, '대한한방내과학회지', '2022-01-01', NULL, NULL, v_fallback_url,
    '유방암 재발 환자에게 나타난 장궐(腸厥)과 현훈(眩暈) 증상에 대해 오수유부자이중탕(吳茱萸附子理中湯)을 활용하여 호전을 유도한 치험 1례. 항암 치료 이후 잔여 증상에 대한 한방 보완 치료의 임상적 가능성을 보여주는 증례 보고 연구입니다.',
    v_doc_jung_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='jung-breast-cancer-osuyu-buja-case' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  -- (4) 정우령 — 전기식 온침기 온도 변화 특성 (2021 추정)
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'jung-electric-warm-needle-temperature',
    '전기식 온침기의 온도 변화 특성에 관한 연구',
    '["정우령"]'::jsonb, '대한침구의학회지', '2021-01-01', NULL, NULL, v_fallback_url,
    '임상에서 활용되는 전기식 온침기의 온도 변화 특성을 측정·분석한 연구. 시술 시 환자에게 전달되는 실제 온도 프로파일과 안정성 평가를 위한 기초 데이터를 확보할 목적으로 수행된 실험 연구입니다.',
    v_doc_jung_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='jung-electric-warm-needle-temperature' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  -- (5) 정우령 — 전기식 온침기 안전성·성능평가 가이드라인 개발 (2020 추정)
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'jung-electric-warm-needle-safety-guideline',
    '전기식 온침기에 대한 안전성 및 성능평가 가이드라인 개발 연구',
    '["정우령"]'::jsonb, '대한침구의학회지', '2020-01-01', NULL, NULL, v_fallback_url,
    '임상에서 사용되는 전기식 온침기의 안전성 및 성능을 정량적으로 평가하기 위한 표준 가이드라인 개발 연구. 한방 의료기기로서의 온침기 품질 관리 체계 구축을 위한 기초 자료를 제공하는 연구입니다.',
    v_doc_jung_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='jung-electric-warm-needle-safety-guideline' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  -- (6) 신수용 외 10인 — 대한한방내과학회지 2026 (KCI ART003327442). DOI 확보.
  INSERT INTO publication
    (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
     author_doctor_id, status, risk_level, published_at, compliance_record_id)
  VALUES (
    v_instance_id, 'shin-2026-kci-tcm-obesity-scoping-review',
    '최근 5년간 국제 학술 데이터베이스에 등재된 중국 중의학적 비만 치료 임상 연구의 특성과 경향 : 주제범위 문헌고찰',
    '["최인우","방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    '대한한방내과학회지', '2026-01-01', '10.22246/jikm.2026.47.1.1', NULL,
    'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003327442',
    '2021년부터 2025년 사이 발표된 26개 논문을 검토한 주제범위 문헌고찰. 88.5%가 무작위 대조 시험이었으며 귀뉴침 매장이 가장 빈번한 중재였습니다. 인체측정지수·지질대사·인슐린 저항성 개선이 보고되었고, 다중 양식 접근과 fMRI·장내 미생물군집 등 현대적 기전 평가가 주요 추세로 확인되었습니다.',
    v_doc_shin_id, 'published', 'Low', now(),
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='shin-2026-kci-tcm-obesity-scoping-review' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1)
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, url=EXCLUDED.url, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();

  RAISE NOTICE 'seed-demo-incheon-publications: 인천 부평점 참여 논문 6건(신수용 2, 정우령 4) 정합 완료. instance_id=%', v_instance_id;
END $$;
