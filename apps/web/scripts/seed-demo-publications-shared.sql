-- @glitzy/web/scripts/seed-demo-publications-shared — 다이트한의원 공저 학술 자산 통합 INSERT
-- 사용자 요청 (2026-05-20). 25개 학술 논문 URL 안 메타데이터 자동 추출(KCI/MDPI/CrossRef/Google Scholar).
-- 다이트한의원 전 지점이 공유하는 의료진 공저 자산이므로, 다른 지점 instance 생성 시 v_instance_slug 변수만
-- 변경 후 재실행하면 그 instance 의 publication 테이블에도 동일하게 적재됩니다.
--
-- 처리 요약 (총 25 URL → INSERT 23건 + SKIP 2건):
--   - 신수용 공저 매핑 (author_doctor_id=shin-soo-yong)        : 19건
--   - author_doctor_id=NULL (신수용·정우령 모두 미포함)            : 4건 (#9, #23, #24, #25)
--   - SKIP                                                         : 2건 (#3 accesson 차단, #18 koreascience 다운)
--
-- published_content_compliance_guard trigger 정합: 본 seed 안 모든 publication slug 별 'Publication'
-- sentinel ComplianceRecord 를 사전 일괄 INSERT 후, publication.compliance_record_id 컬럼에 SELECT subquery 로 매핑.

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_slug TEXT := 'demo';  -- 다른 지점 instance 생성 시 이 값만 변경 후 재실행
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_doc_jung_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
  v_count_shin INT := 0;
  v_count_null INT := 0;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = v_instance_slug;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-publications-shared: instance slug=% 미발견.', v_instance_slug;
  END IF;

  SELECT id INTO v_doc_shin_id FROM doctor_profile
   WHERE instance_id = v_instance_id AND slug = 'shin-soo-yong';
  SELECT id INTO v_doc_jung_id FROM doctor_profile
   WHERE instance_id = v_instance_id AND slug = 'jung-wooryeong';

  -- ComplianceRecord sentinel 사전 일괄 INSERT — 모든 publication slug 에 대해 'Publication' content_type sentinel.
  -- seed-demo-rich.sql § (9) 패턴 동일. NOT EXISTS guard 로 재실행 idempotent.
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'Publication'::compliance_content_type, slug_val, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-publications-shared"}'::jsonb
  FROM (VALUES
    ('kwon-2026-taeeumin-obesity-multicenter'),
    ('bang-2026-herbal-prescription-patterns'),
    ('bang-2026-nursing-home-obesity'),
    ('bang-2025-angina-korean-medicine'),
    ('son-2025-diabetes-tkm-scoping-review'),
    ('bang-2025-3day-detox-diet'),
    ('bang-2025-keat26-coaching'),
    ('kim-2025-surgery-dermatology-cbt'),
    ('choi-2025-noonan-syndrome-herbal'),
    ('yoon-2025-menopausal-obesity-systematic'),
    ('jung-2025-banchong-san-renal'),
    ('bang-2025-shooting-competition-clinic'),
    ('bang-2025-pharmaceuticals-mdpi'),
    ('son-2025-drug-naive-t2dm-herbal'),
    ('kang-2025-obesity-hyperglycemia'),
    ('shin-2024-mahuang-amphetamine-false-positive'),
    ('son-2024-t1dm-obesity-herbal'),
    ('son-2024-ibd-low-carb'),
    ('son-2024-liver-enzyme-obesity'),
    ('baek-2024-liposa-pharmacopuncture'),
    ('bang-2017-bianque-pulse'),
    ('kim-2018-bianque-school-diagnosis'),
    ('bang-2017-herb-composition-efficacy')
  ) AS t(slug_val)
  WHERE NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = v_instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = t.slug_val
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

  --========================================================================
  -- (1) 권미혜·신수용 외 — 사상체질면역의학회지 2026 (KCI ART003317942)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'kwon-2026-taeeumin-obesity-multicenter',
    '과체중 및 비만 환자에 대한 태음인 한약 및 복합 한의치료의 효과 분석: 다기관 후향적 관찰 연구',
    '["권미혜","강민휘","신수용","김정상","이동훈","김준호","김충희","손지영","전성현","방민우","강병수"]'::jsonb,
    '사상체질면역의학회지', '2026-01-01', NULL, NULL,
    'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003317942',
    '저탄수화물 식단을 병행한 사상체질 처방의 임상적 유효성과 안전성을 평가한 다기관 후향적 관찰연구. 590명을 12주 이상 추적한 결과 체중은 7.99±7.15 kg, BMI는 2.46±2.71 kg/㎡ 유의하게 감소하였고, 당화혈색소와 간효소 수치 또한 감소하여 태음인 한약 및 복합 한의치료가 과체중·비만 환자의 체중 조절과 대사 지표 개선에 효과적이고 안전함을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"38","issue":"1","pages":"30-41","issn":"1226-4075","kciId":"ART003317942"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='kwon-2026-taeeumin-obesity-multicenter' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (2) 방민우·신수용 외 — 대한한의학 방제학회지 2026 (KCI ART003315838)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2026-herbal-prescription-patterns',
    '비만 특화 한의원 임상데이터를 이용한 탕약 처방 패턴 및 처방군 전환 양상 분석: 다기관, 후향적, 관찰연구',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    '대한한의학 방제학회지', '2026-01-01', NULL, NULL,
    'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003315838',
    '비만 진료를 다루는 8개 한방의료기관 23,950명 환자의 실제 한약 처방 패턴을 분석한 다기관 후향적 관찰 연구. 가장 빈번한 처방군은 오령산(26.13%), 방기황기탕(16.35%), 소요산(7.47%)이었으며 31.3% 환자에서 처방군 간 전환이 관찰되어 비만 진료의 표준화된 처방 체계 수립 가능성을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"34","issue":"1","pages":"41-51","issn":"1229-1218","kciId":"ART003315838"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2026-herbal-prescription-patterns' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  -- (3) SKIP — accesson.kr/jkom (봇 차단)
  RAISE NOTICE 'seed-demo-publications-shared: SKIP url=https://www.accesson.kr/jkom/v.47/1/87/58602 (accesson 봇 차단으로 메타데이터 추출 실패)';

  --========================================================================
  -- (4) 방민우·신수용 외 — 한방재활의학과학회지 2026 (KCI ART003301741)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2026-nursing-home-obesity',
    '요양시설 거주 고령자의 비만 및 저체중에 대한 한약 치료와 식이 교육 효과: 후향적 관찰 연구',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    '한방재활의학과학회지', '2026-01-01', NULL, NULL,
    'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003301741',
    '90일간 한약 치료와 저탄수화물 식이 교육을 받은 요양시설 거주자(비만군 6명, 저체중군 5명)의 체성분·기능 변화를 후향적으로 조사한 연구. 체지방량과 BMI가 유의하게 감소하였고 악력은 비만군에서 개선되었으며 K-FRAIL 점수도 개선되었다. 경미한 위장관 이상반응 외 중대한 이상반응은 없어 안전성을 확인하였다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"36","issue":"1","pages":"83-95","issn":"1229-1854","kciId":"ART003301741"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2026-nursing-home-obesity' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (5) 방민우·신수용 외 — 대한한방내과학회지 2025-12 (DOI 10.22246/jikm.2025.46.6.1316)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2025-angina-korean-medicine',
    '협심증 환자에서 한의 치료와 저탄수화물 식이가 체중 감량, 혈압, 안전성에 미치는 효과: 다기관 후향적 연구',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    '대한한방내과학회지', '2025-12-01', '10.22246/jikm.2025.46.6.1316', NULL,
    'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003297996',
    '협심증을 동반한 비만 환자에서 마황 함유 한약과 저탄수화물 식이를 병행한 한의 치료의 체중 감량·혈압·안전성을 분석한 다기관 후향적 연구. 평균 7.06±5.69 kg 체중 감량(p<0.001)이 관찰되었고 78.4%가 ≥5% 체중 감량을 달성했다. 수축기 혈압과 심박수도 유의하게 감소하여 협심증 환자에서도 안전한 적용 가능성을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"46","issue":"6","pages":"1316-1328","issn":"1226-9174","kciId":"ART003297996"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2025-angina-korean-medicine' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (6) 손지영·신수용 외 — 대한한방내과학회지 2025-12 (DOI 10.22246/jikm.2025.46.6.1257)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'son-2025-diabetes-tkm-scoping-review',
    '당뇨병에 대한 한의학 연구 동향 고찰: 최근 국내 발표 논문을 중심으로 한 스코핑 리뷰',
    '["손지영","신수용","김정상","강민휘","이동훈","김준호","김충희","강병수","한가진","방민우"]'::jsonb,
    '대한한방내과학회지', '2025-12-01', '10.22246/jikm.2025.46.6.1257', NULL,
    'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003297942',
    '2015년부터 2024년까지 발표된 국내 한의학 기반 당뇨 연구를 검토한 주제범위 문헌고찰. 74건 연구를 분석한 결과 증례 보고와 실험 연구가 주를 이루었고 전향적 임상시험은 제한적이었다. 한의학 기반 당뇨 진료의 높은 수준 임상 근거 확보 필요성을 강조한 연구이다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"46","issue":"6","pages":"1257-1282","issn":"1226-9174","kciId":"ART003297942"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='son-2025-diabetes-tkm-scoping-review' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (7) 방민우·신수용 외 — JKOMOR 2025-12 (DOI 10.15429/jkomor.2025.25.2.69)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2025-3day-detox-diet',
    '체중감량을 위한 3일 한약 해독 다이어트 프로그램의 효과와 안전성: 진료기반 연구',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    'Journal of Korean Medicine for Obesity Research', '2025-12-01', '10.15429/jkomor.2025.25.2.69', NULL,
    'https://www.jkomor.org/journal/view.html?doi=10.15429/jkomor.2025.25.2.69',
    '3일 단기 한약 해독 다이어트 프로그램의 체중 감량 효과와 안전성을 평가한 진료기반 연구. 체중(-2.65±1.22 kg), BMI(-0.97±0.41 kg/m²), 체지방량(-0.64±0.68 kg)이 유의하게 감소하였다. 혈압과 심박수의 유의한 변화는 없었으며 골격근률은 남성에서만 증가가 관찰되었다. 대황 관련 복통 grade 2 1건 외 이상반응은 경미하였다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"25","issue":"2","pages":"69-78","issn":"2671-8081"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2025-3day-detox-diet' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (8) 방민우·신수용 외 — JKOMOR 2025-12 (DOI 10.15429/jkomor.2025.25.2.91)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2025-keat26-coaching',
    '영양사의 저탄수화물 식단 코칭을 병행한 한의치료가 섭식태도에 미치는 효과: KEAT-26 척도를 이용한 후향적 연구',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","강병수"]'::jsonb,
    'Journal of Korean Medicine for Obesity Research', '2025-12-01', '10.15429/jkomor.2025.25.2.91', NULL,
    'https://www.jkomor.org/journal/view.html?uid=374&&vmd=Full',
    '영양사 저탄수화물 식이 코칭을 병행한 한의 비만 치료가 KEAT-26 섭식태도 점수에 미치는 영향을 후향적으로 분석한 연구. 폭식·음식 몰두 요인은 감소했지만 섭식통제 요인이 증가하여 총점은 상승하였다. 저탄수화물 식이 교육이 KEAT-26에서 병리적으로 채점되는 한계와 조정 점수 분석의 위험군 개선을 동시에 확인한 연구이다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"25","issue":"2","pages":"91-99","issn":"2671-8081"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2025-keat26-coaching' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (9) 김지은·이송연 외 — 한방안이비인후피부과학회지 2025-11 (author_doctor_id=NULL)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'kim-2025-surgery-dermatology-cbt',
    '한의 외과피부과학 컴퓨터 기반 시험에 대한 한의과대학 학생들의 인식 및 만족도 조사: 단면 설문조사',
    '["김지은","이송연","이효은","김경준","강병수"]'::jsonb,
    '한방안이비인후피부과학회지', '2025-11-01', '10.6114/jkood.2025.38.4.001', NULL,
    'https://www.jkmood.org/archive/view_article?pid=jkmood-38-4-1',
    '한의과대학 학생 33명을 대상으로 외과학 및 실습2 기말고사 컴퓨터 기반 시험(CBT) 후 인식·만족도를 조사한 단면 연구. 34개 항목 5개 범주 설문에서 전반적 만족도 4.23점, 지속 사용 의향 4.10점으로 높게 평가되었고, 즉시 피드백 제공·장비 반응성·좌석 배치가 개선사항으로 제시되었다.',
    NULL, 'published', 'Low', now(),
    '{"volume":"38","issue":"4","pages":"1-11","issn":"1738-6640"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='kim-2025-surgery-dermatology-cbt' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_null := v_count_null + 1;

  --========================================================================
  -- (10) 최다경·신수용 외 — 대한한방소아과학회지 2025-11
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'choi-2025-noonan-syndrome-herbal',
    '누난증후군 청소년에서 한약 치료 후 체성분과 호르몬 지표 변화: 증례 보고',
    '["최다경","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","방민우","강병수"]'::jsonb,
    '대한한방소아과학회지', '2025-11-01', '10.7778/jpkm.2025.39.4.1', NULL,
    'https://www.akop.or.kr/file/202511/1764548305.pdf',
    '누난증후군을 가진 15세 여아의 체중 증가·희발월경·성장 지연에 대해 한약 치료와 저탄수화물 식이 상담을 9개월간 병행한 증례 보고. 신장과 BMI 변화, 에스트라디올 증가와 4회 연속 월경 회복이 관찰되었고 간·신기능은 정상으로 유지되었다. 누난증후군 청소년의 성장·내분비 지표 개선 가능성을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"39","issue":"4","pages":"1-10","issn":"2287-9463"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='choi-2025-noonan-syndrome-herbal' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (11) 윤효원·신수용 외 — 대한한방부인과학회지 2025 (KCI ART003267092)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'yoon-2025-menopausal-obesity-systematic',
    '폐경기 비만 여성에 대한 한약 치료 무작위 대조군 연구의 체계적 문헌고찰',
    '["윤효원","강병수","방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현"]'::jsonb,
    '대한한방부인과학회지', '2025-01-01', '10.15204/jkobgy.2025.38.4.112', NULL,
    'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003267092',
    '폐경기 비만 여성에 대한 한약 치료의 효과를 평가한 체계적 문헌고찰. 1,117건 문헌 검색 후 4건의 무작위 대조 시험을 최종 선정하여 분석한 결과 한약군은 대조군 대비 총 유효율, BMI, 체중, 허리둘레 비율, 호르몬 수치 개선에서 통계적으로 유의한 효과를 보여, 폐경기 비만 치료에 한약이 유용한 옵션임을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"38","issue":"4","pages":"112-129","issn":"1229-4292","kciId":"ART003267092"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='yoon-2025-menopausal-obesity-systematic' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (12) 정우령·신수용 외 — 대한한방내과학회지 2025-10 (DOI 10.22246/jikm.2025.46.5.1179)
  --      정우령 첫 저자 but 정책상 신수용 매핑
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'jung-2025-banchong-san-renal',
    '반총산과 저탄수화물 식이요법 병행에 따른 신장기능 및 체중 변화: 6례 증례보고',
    '["정우령","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","전성현","방민우","강병수"]'::jsonb,
    '대한한방내과학회지', '2025-10-01', '10.22246/jikm.2025.46.5.1179', NULL,
    'https://jikm.or.kr/journal/view.php?number=5421',
    '전통 한약 반총산과 저탄수화물 식이요법을 병행한 비만 환자 6명의 신장 기능 및 체성분 변화를 후향적으로 관찰한 증례 시리즈. 모든 환자에서 eGFR이 최소 임상적으로 중요한 차이 이상 상승하였으며 5명에서 유의한 체중 감소가 확인되어 반총산과 저탄수화물 식이 병행이 비만 환자의 신장 기능 보호와 체중 감량에 잠재적으로 도움을 줄 수 있음을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"46","issue":"5","pages":"1179-1193","issn":"1226-9174","firstAuthor":"정우령(잠재 매핑)"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='jung-2025-banchong-san-renal' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (13) 방민우·신수용 외 — 한방재활의학과학회지 2025-10 (DOI 10.18325/jkmr.2025.35.4.225)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2025-shooting-competition-clinic',
    '전국사격대회 한의 의무진료소에서 시행된 한의치료의 효과와 만족도에 대한 후향적 설문 및 차트 분석',
    '["방민우","신수용","김정상","강민휘","이동훈","김준호","김충희","손지영","최승연","전성현","김지은","이슬","이대명","강병수"]'::jsonb,
    '한방재활의학과학회지', '2025-10-01', '10.18325/jkmr.2025.35.4.225', NULL,
    'https://www.ormkorea.org/file/202510/1762149696.pdf',
    '2025년 전국사격대회 현장 한의 의무진료소에서 한의 치료를 받은 선수·심판·코치 111명을 대상으로 한 후향적 설문 및 차트 분석 연구. 침(전기침 포함)과 물리치료의 만족도가 가장 높았고 평균 NRS 통증 점수가 치료 후 2.3±1.9점 유의하게 감소하여 최소 임상적으로 중요한 차이 임계값을 초과했다. 사격 종목 현장 한의 진료의 임상적 활용 가능성을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"35","issue":"4","pages":"225-232","issn":"1229-1854"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2025-shooting-competition-clinic' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (14) Bang·Shin 외 — Pharmaceuticals MDPI 2025-09 (DOI 10.3390/ph18091396 · PubMed 41011264)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2025-pharmaceuticals-mdpi',
    'Herbal Medicine and Lifestyle Modifications for People with Obesity: A Single-Center, Retrospective, Observational Study',
    '["Minwoo Bang","Suyong Shin","Jungsang Kim","Minwhee Kang","Donghun Lee","Junho Kim","Chunghee Kim","Jiyoung Son","Seungyeon Choi","Seonghyeon Jeon","Dasol Park","Byungsoo Kang","Jungtae Leem"]'::jsonb,
    'Pharmaceuticals (Basel)', '2025-09-01', '10.3390/ph18091396', '41011264',
    'https://www.mdpi.com/1424-8247/18/9/1396',
    '한약과 생활습관 교정을 병행한 비만 통합 한의 치료 효과를 분석한 단일기관 후향적 관찰 연구. 3,161명 환자에서 약 20주간 평균 8.02 kg 체중 감량을 달성하였고, 최적 효과 24명 하위그룹은 약 7.83개월간 평균 23 kg 감량으로 목표 BMI에 도달하였다. 중대한 이상반응 없이 안전성과 유효성이 확인되어 비만 관리의 안전·유효한 통합 한의 치료 옵션임을 보여준다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"18","issue":"9","articleNumber":"1396","issn":"1424-8247","publisher":"MDPI"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2025-pharmaceuticals-mdpi' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, pubmed_id=EXCLUDED.pubmed_id,
    url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (15) 손지영·신수용 외 — JKOMOR 2025-06 (DOI 10.15429/jkomor.2025.25.1.27)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'son-2025-drug-naive-t2dm-herbal',
    '당뇨약 비복용 초기 제2형 당뇨병 환자에서 한약과 저탄수화물 식단 병행의 체중 감량 및 혈당 개선 효과: 후향적 연구',
    '["손지영","신수용","김정상","강민휘","이동훈","김준호","김충희","최승연","전성현","강병수","방민우"]'::jsonb,
    'Journal of Korean Medicine for Obesity Research', '2025-06-01', '10.15429/jkomor.2025.25.1.27', NULL,
    'https://doi.org/10.15429/jkomor.2025.25.1.27',
    '당뇨약을 복용하지 않는 초기 제2형 당뇨병 환자에서 한약과 저탄수화물 식단을 병행한 한의 치료의 효과를 3개월 이상 후향적으로 분석한 연구. 체중·BMI·HbA1c가 유의하게 감소하였고 간효소 수치와 혈압도 개선되어 비만과 당뇨병 관리에 한약과 저탄수화물 식단 병행 치료가 유익한 역할을 할 수 있음을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"25","issue":"1","pages":"27-38","issn":"2671-8081"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='son-2025-drug-naive-t2dm-herbal' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (16) 강병수·신수용 외 — 대한한방내과학회지 2025-03 (DOI 10.22246/jikm.2025.46.1.1)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'kang-2025-obesity-hyperglycemia',
    '비만과 혈당 상승을 동반한 환자에서 한의 치료와 저탄수화물 식단의 체중 감량 및 HbA1c 개선 효과: 다기관 후향적 연구',
    '["강병수","신수용","김정상","강민휘","이동훈","김준호","김충희","전성현","손지영","방민우"]'::jsonb,
    '대한한방내과학회지', '2025-03-01', '10.22246/jikm.2025.46.1.1', NULL,
    'https://doi.org/10.22246/jikm.2025.46.1.1',
    'HbA1c 5.7% 이상의 비만 환자 39명을 대상으로 한약·약침과 저탄수화물 식단(≤50g/일)을 병행한 다기관 후향적 연구. 전체 HbA1c는 -0.78±1.36% 감소하였고 체중은 -4.61±4.47 kg, BMI는 5.24% 감소하여 비만과 고혈당을 동반한 환자에서의 임상적 유효성을 확인하였다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"46","issue":"1","pages":"1-13","issn":"1226-9174"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='kang-2025-obesity-hyperglycemia' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (17) 강병수·신수용 외 — JKOMOR 2024-06 (DOI 10.15429/jkomor.2024.24.1.94)
  --       seed-demo-incheon-publications.sql 안 'shin-2024-mahuang-amphetamine-false-positive' 와 동일 논문.
  --       기존 slug 유지하여 ON CONFLICT DO UPDATE 로 정확한 메타데이터로 갱신.
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'shin-2024-mahuang-amphetamine-false-positive',
    '한의 비만 클리닉에서 확인된 마황 함유 한약 복용 중 암페타민 면역측정법의 위양성 사례 및 휴약 후 음성 사례의 후향적 분석연구',
    '["강병수","신수용","김정상","강민휘","이동훈","전성현","방민우"]'::jsonb,
    'Journal of Korean Medicine for Obesity Research', '2024-06-01', '10.15429/jkomor.2024.24.1.94', NULL,
    'https://doi.org/10.15429/jkomor.2024.24.1.94',
    '마황 함유 한약이 암페타민 면역측정법에서 위양성을 유발할 수 있음을 분석한 후향적 연구. 위양성 사례 6건과 휴약 후 음성으로 전환된 5건을 분석한 결과 마황-유발 위양성은 휴약 지시로 해결되며, 한의사의 지도 아래 안전하게 처방 가능함을 보여준다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"24","issue":"1","pages":"94-101","issn":"2671-8081","note":"동일 논문 - 정확한 KCI 메타로 갱신"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='shin-2024-mahuang-amphetamine-false-positive' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  -- (18) SKIP — doi 10.6114/jkood.2024.37.4.065 (koreascience 연결 실패)
  RAISE NOTICE 'seed-demo-publications-shared: SKIP url=https://dx.doi.org/10.6114/jkood.2024.37.4.065 (koreascience 연결 실패)';

  --========================================================================
  -- (19) 손지영·신수용 외 — JKOMOR 2024-12 (DOI 10.15429/jkomor.2024.24.2.253)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'son-2024-t1dm-obesity-herbal',
    '한약 치료를 통한 1형 당뇨병 동반 비만 환자의 체중 감량: 증례보고 3례',
    '["손지영","신수용","김정상","강민휘","이동훈","전성현","김준호","김충희","강병수","방민우"]'::jsonb,
    'Journal of Korean Medicine for Obesity Research', '2024-12-01', '10.15429/jkomor.2024.24.2.253', NULL,
    'https://doi.org/10.15429/jkomor.2024.24.2.253',
    '1형 당뇨병을 동반한 비만 환자 3명에게 한약 치료를 시행한 증례 보고. 췌장 세포 파괴로 인한 인슐린 결핍 상태의 인슐린 의존성 환자들에게서 의미 있는 체중 감량을 달성하였으며 2명에서는 HbA1c 개선이 함께 관찰되어 한약 치료가 1형 당뇨병 환자의 비만 관리에 잠재적으로 유효함을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"24","issue":"2","pages":"253-259","issn":"2671-8081"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='son-2024-t1dm-obesity-herbal' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (20) 손지영·신수용 외 — 대한한방내과학회지 2024-12 (DOI 10.22246/jikm.2024.45.6.1136)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'son-2024-ibd-low-carb',
    '염증성 장질환 환자에서 저탄수화물 식이요법을 병행한 한약 치료의 체중 감량 효과 및 안전성 평가: 후향적 다기관 연구',
    '["손지영","신수용","김정상","강민휘","이동훈","전성현","김준호","김충희","강병수","방민우"]'::jsonb,
    '대한한방내과학회지', '2024-12-01', '10.22246/jikm.2024.45.6.1136', NULL,
    'https://dx.doi.org/10.22246/jikm.2024.45.6.1136',
    '염증성 장질환(궤양성 대장염·크론병) 환자 14명에서 저탄수화물 식이요법을 병행한 한약 치료의 체중 감량 효과와 안전성을 후향적으로 평가한 연구. 60일간 고형 제제 한약과 1일 50g 탄수화물 제한 식단을 받은 결과 평균 체중은 73.00 kg → 67.98 kg, BMI는 26.84 → 25.00 으로 통계적으로 유의하게 감소하였고 이상반응은 경미~중등도였다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"45","issue":"6","pages":"1136-1146","issn":"1226-9174"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='son-2024-ibd-low-carb' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (21) 손지영·신수용 외 — 대한한방내과학회지 2024-09 (DOI 10.22246/jikm.2024.45.4.700)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'son-2024-liver-enzyme-obesity',
    '한의 비만 치료 전후의 간효소 변화 비교 분석: 후향적, 다기관, 관찰 연구',
    '["손지영","신수용","김정상","강민휘","이동훈","전성현","김준호","최승연","김충희","강병수","방민우"]'::jsonb,
    '대한한방내과학회지', '2024-09-01', '10.22246/jikm.2024.45.4.700', NULL,
    'https://dx.doi.org/10.22246/jikm.2024.45.4.700',
    '한의 비만 치료를 받은 간효소 수치 상승 환자 84명을 대상으로 90일 이상 간격으로 간기능검사를 후향적으로 비교한 다기관 관찰 연구. AST·ALT·GGT 수치가 모두 통계적으로 유의하게 감소했으며 AST와 ALT는 정상 범위 내로 개선되고 GGT는 정상 범위에 근접하게 개선되었다. 마황을 포함한 한약 치료가 간기능 이상을 동반한 비만 환자에게 안전·유효함을 보여준다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"45","issue":"4","pages":"700-709","issn":"1226-9174"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='son-2024-liver-enzyme-obesity' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (22) 백희경·신수용 외 — 대한융합한의학회지 2024-12 (DOI 10.2305/ackm.2024.6.2.41)
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'baek-2024-liposa-pharmacopuncture',
    '국소지방약침 LIPOSA의 임상적 효과: 후향적 차트리뷰',
    '["백희경","강민지","조성옥","김윤하","김재중","김주찬","유요한","정연민","현민욱","방민우","강병수","손지영","최승연","신수용","김준호","임현정","양웅모"]'::jsonb,
    '대한융합한의학회지', '2024-12-01', '10.2305/ackm.2024.6.2.41', NULL,
    'https://accesson.kr/ackm/assets/pdf/46996/journal-6-2-41.pdf',
    '한방의료기관 비만 치료 환자를 대상으로 국소 지방약침 LIPOSA의 임상적 효능을 분석한 다기관 차트리뷰. 6개 한방의료기관 117명(LIPOSA군 62명, 대조군 55명)을 비교한 결과 LIPOSA군은 대조군 대비 체지방량과 체지방률 감소가 더 컸고 골격근량 보존도 우수하여 한약 단독 대비 국소 비만 치료에 효과적임을 시사한다.',
    v_doc_shin_id, 'published', 'Low', now(),
    '{"volume":"6","issue":"2","pages":"41-46","issn":"2799-2977"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='baek-2024-liposa-pharmacopuncture' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_shin := v_count_shin + 1;

  --========================================================================
  -- (23) Bang·Kim — JKMC 2017 (DOI 10.14369/jkmc.2017.30.3.143) — author_doctor_id=NULL
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2017-bianque-pulse',
    'A Study on Bianque''s Pulse Diagnosis',
    '["Min-Woo Bang","Ki-Wook Kim"]'::jsonb,
    'Journal of Korean Medical Classics', '2017-01-01', '10.14369/jkmc.2017.30.3.143', NULL,
    'https://doi.org/10.14369/jkmc.2017.30.3.143',
    '사기(史記)와 황제내경·맥경 등 고전 의서를 분석하여 편작(扁鵲)의 진맥법의 발전 과정과 후대 한의학에 미친 영향을 탐구한 문헌 연구. 편작 학파의 진단 체계가 한의학사에서 차지하는 위상과 의미를 정리한 한의학 원전 연구이다.',
    NULL, 'published', 'Low', now(),
    '{"volume":"30","issue":"3","pages":"143-","note":"koreascience 연결 불가로 일부 메타 미확보"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2017-bianque-pulse' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_null := v_count_null + 1;

  --========================================================================
  -- (24) 김성호·방민우·이병욱·김기욱 — 대한한의학원전학회지 2018 — author_doctor_id=NULL
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'kim-2018-bianque-school-diagnosis',
    '扁鵲學派의 診斷에 關한 硏究',
    '["김성호","방민우","이병욱","김기욱"]'::jsonb,
    '대한한의학원전학회지', '2018-01-01', '10.14369/jkmc.2018.31.3.033', NULL,
    'https://doi.org/10.14369/jkmc.2018.31.3.033',
    '사기와 황제내경·맥경 등 고전 의서 분석을 통해 편작 학파의 맥진 시스템의 발전 과정과 후대 한의학에 미친 영향을 탐구한 한의학 원전 연구. 편작 학파의 진단 체계가 한의학사에 미친 의미를 정리하였다.',
    NULL, 'published', 'Low', now(),
    '{"volume":"31","issue":"3","pages":"33-","note":"koreascience 연결 불가로 일부 메타 미확보"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='kim-2018-bianque-school-diagnosis' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_null := v_count_null + 1;

  --========================================================================
  -- (25) Bang·Kim·Lee — Herbal Formula Science 2017-02 — author_doctor_id=NULL
  --========================================================================
  INSERT INTO publication (instance_id, slug, title, authors, journal, published_date, doi, pubmed_id, url, summary,
                            author_doctor_id, status, risk_level, published_at, metadata, compliance_record_id)
  VALUES (v_instance_id, 'bang-2017-herb-composition-efficacy',
    'A Study on the Inference and Classification Method of the Effectiveness Using the Herb Composition',
    '["Min-Woo Bang","Ki-Wook Kim","Byung-Wook Lee"]'::jsonb,
    'Herbal Formula Science', '2017-02-01', '10.14374/HFS.2017.25.1.29', NULL,
    'https://doi.org/10.14374/HFS.2017.25.1.29',
    '본초의 조합을 통해 한약 처방의 효능을 추론·분류할 수 있는 방법론을 제안한 연구. 처방 효능 분석의 객관화·체계화를 위한 기초 연구로 한의학 처방 표준화 가능성을 모색하였다.',
    NULL, 'published', 'Low', now(),
    '{"volume":"25","issue":"1","pages":"29-38","issn":"1229-1218"}'::jsonb,
    (SELECT id FROM compliance_record WHERE instance_id=v_instance_id AND content_type='Publication'::compliance_content_type AND content_ref='bang-2017-herb-composition-efficacy' AND metadata @> '{"sentinel":true}'::jsonb LIMIT 1))
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    title=EXCLUDED.title, authors=EXCLUDED.authors, journal=EXCLUDED.journal,
    published_date=EXCLUDED.published_date, doi=EXCLUDED.doi, url=EXCLUDED.url, summary=EXCLUDED.summary,
    author_doctor_id=EXCLUDED.author_doctor_id, status=EXCLUDED.status,
    published_at=COALESCE(publication.published_at, EXCLUDED.published_at),
    metadata=publication.metadata || EXCLUDED.metadata,
    compliance_record_id=COALESCE(publication.compliance_record_id, EXCLUDED.compliance_record_id),
    updated_at=now();
  v_count_null := v_count_null + 1;

  RAISE NOTICE 'seed-demo-publications-shared: instance=% 정합 완료 — 신수용 매핑 %건, NULL 매핑 %건, SKIP 2건 (#3 accesson, #18 koreascience)', v_instance_slug, v_count_shin, v_count_null;
END $$;
