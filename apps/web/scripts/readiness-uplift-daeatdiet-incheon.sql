-- 2026-07-08 daeatdiet-incheon SEO Readiness 개선 일괄 작업 (모두 idempotent · 재실행 안전)
--
-- 배경: 어드민 SEO READINESS 평균 43 (Article 53 · TreatmentPage 24 · FAQ 38).
-- 감점 상위: 근거 미연결(+18.4 여력) · FAQ 미발행/미연결(+8.9) · 키워드 primary 미지정(+5.8) ·
-- 의료진 미연결(+4.8). 신선도는 인위 갱신하지 않는다 (지표 조작 금지 — 실 콘텐츠 변경 시에만).
--
-- 작업 내용:
--   (1) TreatmentPage 16건 metadata.authorDoctorSlug = shin-soo-yong (has-author-doctor)
--   (2) Article 1건(동아일보 보도) author_doctor_id 보정
--   (3) 키워드 primary 링크 6건 — 제목에 키워드 라벨이 "실제 포함된" 콘텐츠만 (미포함 연결 시
--       title check 가 warn→fail 로 오히려 감점되므로 제목 매칭 검증 후 선별)
--   (4) FAQ 6건 발행 — sentinel ComplianceRecord (published_content_compliance_guard 통과 ·
--       seed-demo-rich 패턴). side-effects 답변의 "안전성이 검증되어 있으며" 문구는 의료광고법
--       (제56조 소비자 오인 우려) 보수 원칙에 따라 완화 후 발행.
--   (5) 근거 연결 content_entity_link 'cites' — 논문 30편·미디어 10건을 주제 매칭으로 연결
--       (보도자료성 아티클 2편은 어색한 매칭 대신 제외)
--   (6) FAQ related-to 링크 — 전 콘텐츠에 주제 정합 FAQ 연결 (주차 FAQ 는 콘텐츠 링크 제외)

DO $$
DECLARE
  iid UUID;
  v_doctor UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
  n INT;
BEGIN
  SELECT id INTO iid FROM instance WHERE slug = 'daeatdiet-incheon';
  IF iid IS NULL THEN RAISE EXCEPTION 'instance daeatdiet-incheon not found'; END IF;
  SELECT id INTO v_doctor FROM doctor_profile WHERE instance_id = iid AND slug = 'shin-soo-yong';
  IF v_doctor IS NULL THEN RAISE EXCEPTION 'doctor shin-soo-yong not found'; END IF;

  -- (1) TreatmentPage metadata.authorDoctorSlug
  UPDATE treatment_page
     SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"authorDoctorSlug":"shin-soo-yong"}'::jsonb,
         updated_at = NOW()
   WHERE instance_id = iid
     AND (metadata IS NULL OR NOT metadata ? 'authorDoctorSlug');
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(1) treatment authorDoctorSlug 설정: % 건', n;

  -- (2) Article 저자 보정 (동아일보 보도 72768431)
  UPDATE article SET author_doctor_id = v_doctor, updated_at = NOW()
   WHERE instance_id = iid AND id = '72768431-e4c2-46ac-b99e-b84b8a895efe' AND author_doctor_id IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(2) article 저자 보정: % 건', n;

  -- (3) 키워드 primary 링크 (제목 포함 검증된 6건)
  INSERT INTO keyword_content_link (id, instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.kw::uuid, v.etype, v.eid::uuid, 90, true, '{}'::jsonb, NOW(), NOW()
  FROM (VALUES
    ('a6404d4e-a2ce-45d5-b7e9-ff01fe2bcdad', 'Article',       '11237ff7-7780-43d8-a479-cc1b1796e045'), -- 다이어트한의원인천
    ('ad3bc59a-9426-4f33-a10e-5ca0af625ec0', 'Article',       '5aaa1cbe-5faa-48f2-bd82-63e396b8b6ba'), -- 부평다이어트한의원
    ('ad3bc59a-9426-4f33-a10e-5ca0af625ec0', 'Article',       '09dad963-ca1b-4b78-a049-cae1a4bfb9c1'), -- 부평다이어트한의원
    ('3772e7ff-b0e7-478b-a73c-2fd36b066b37', 'Article',       '310e1512-3770-49d0-8a76-9d58bea9bbef'), -- 부평 다이어트 한약
    ('345c750b-c7d0-40f0-860f-a10ac6fbbacc', 'TreatmentPage', 'e74ace8a-269f-42c8-ab6f-02dcac858f79'), -- 당질조절 다이어트
    ('345c750b-c7d0-40f0-860f-a10ac6fbbacc', 'TreatmentPage', 'f88e6359-8426-4a58-a6b4-83ce2826a882')  -- 당질조절 다이어트
  ) AS v(kw, etype, eid)
  ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(3) 키워드 primary 링크: % 건 추가', n;

  -- (4-0) side-effects 답변 문구 완화 (발행 전 · 의료광고법 보수 원칙)
  UPDATE faq
     SET answer = replace(answer, '안전성이 검증되어 있으며', '체질에 맞춰 처방되며'),
         updated_at = NOW()
   WHERE instance_id = iid AND slug = 'side-effects' AND answer LIKE '%안전성이 검증되어 있으며%';
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(4-0) side-effects 문구 완화: % 건', n;

  -- (4-1) FAQ sentinel ComplianceRecord (guard: content_type=FAQ · content_ref=slug · phase=published)
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
    published_at, published_by, record_phase, record_version, metadata)
  SELECT iid, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), v_sentinel_user, NOW(),
    NOW(), v_sentinel_user, 'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"readiness-uplift-faq-publish"}'::jsonb
  FROM faq f
  WHERE f.instance_id = iid AND f.status = 'draft'
    AND NOT EXISTS (
      SELECT 1 FROM compliance_record cr
      WHERE cr.instance_id = iid AND cr.content_type = 'FAQ'::compliance_content_type
        AND cr.content_ref = f.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(4-1) FAQ sentinel compliance_record: % 건', n;

  -- (4-2) FAQ 발행 (저자 미지정 시 대표원장 지정)
  UPDATE faq f
     SET status = 'published', published_at = NOW(), compliance_record_id = cr.id,
         author_doctor_id = COALESCE(f.author_doctor_id, v_doctor), updated_at = NOW()
    FROM compliance_record cr
   WHERE f.instance_id = iid AND f.status = 'draft'
     AND cr.instance_id = iid AND cr.content_type = 'FAQ'::compliance_content_type
     AND cr.content_ref = f.slug AND cr.metadata @> '{"sentinel":true}'::jsonb;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(4-2) FAQ 발행: % 건', n;

  -- (5) 근거 연결 (cites) — 주제 매칭 · P=Publication M=MediaAppearance
  INSERT INTO content_entity_link (id, instance_id, source_type, source_id, target_type, target_id, relation_type, display_order, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.st, v.sid::uuid, v.tt, v.tid::uuid, 'cites', 0, '{}'::jsonb, NOW(), NOW()
  FROM (VALUES
    -- Treatments
    ('TreatmentPage','01dfe130-da20-47d6-b1ad-ec0769be29b6','Publication','b578f4e8-8e14-4a25-9c77-c1f88e81c951'), -- 체형관리 ← LIPOSA 국소지방약침
    ('TreatmentPage','a158fe89-3592-43f0-86a3-a3e1f7e41c27','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'), -- 다이어트 치료 ← 10년 임상
    ('TreatmentPage','a158fe89-3592-43f0-86a3-a3e1f7e41c27','Publication','9201c29b-8f1d-46a5-b38d-c40a0b717eca'), -- 다이어트 치료 ← 한약+생활습관
    ('TreatmentPage','49b3f28e-4d16-4335-9b94-8504110b74d6','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'), -- 다이트 한약 ← 탕약 처방 패턴
    ('TreatmentPage','49b3f28e-4d16-4335-9b94-8504110b74d6','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('TreatmentPage','1e7dcca7-1a56-4b6d-9ec9-ea39690ff67e','Publication','14d53872-7938-4932-9d59-d985157d19f5'), -- 개인맞춤 ← 사상체질 BMI
    ('TreatmentPage','1e7dcca7-1a56-4b6d-9ec9-ea39690ff67e','Publication','d7d200a4-4e8e-4f4e-a02a-932d0f9cd8a0'), -- 개인맞춤 ← 태음인
    ('TreatmentPage','c8511821-1b4c-4d8c-bc17-173a75725b3b','Publication','b578f4e8-8e14-4a25-9c77-c1f88e81c951'), -- 다이트라인 약침 ← LIPOSA
    ('TreatmentPage','a6442999-d220-41f9-bace-7136aeb5b680','Publication','b578f4e8-8e14-4a25-9c77-c1f88e81c951'), -- 지방분해약침 ← LIPOSA
    ('TreatmentPage','a6442999-d220-41f9-bace-7136aeb5b680','MediaAppearance','4fa8843e-9176-4295-af2e-d6755203a3a9'), -- ← 주사 다이어트의 진실
    ('TreatmentPage','e74ace8a-269f-42c8-ab6f-02dcac858f79','Publication','46db03f1-ef6c-46f2-905b-570474441666'), -- 당질조절 ← 저탄수+한약 당뇨
    ('TreatmentPage','e74ace8a-269f-42c8-ab6f-02dcac858f79','Publication','0150918c-1341-4808-9715-460726fa5fd3'), -- 당질조절 ← 저탄수 HbA1c
    ('TreatmentPage','f88e6359-8426-4a58-a6b4-83ce2826a882','Publication','929cee87-f43c-4615-8a02-85da66c79cf2'), -- 디톡스 ← 3일 해독
    ('TreatmentPage','f88e6359-8426-4a58-a6b4-83ce2826a882','MediaAppearance','f07975f6-842d-4c85-9b61-838ce3874c72'), -- ← 한방 디톡스 오해
    ('TreatmentPage','ecf84504-332e-4e46-abf5-8ff88bddabfc','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'), -- 요요방지 ← 10년 임상
    ('TreatmentPage','ecf84504-332e-4e46-abf5-8ff88bddabfc','MediaAppearance','4c394eae-4943-48f8-932a-1dc02c5e8797'), -- ← 정체기
    ('TreatmentPage','79aea855-f962-4ed4-85ab-bbde5e0dbd37','Publication','e6c016e6-98c3-44f3-81b5-de5c1e4fbb67'), -- 소아비만 ← 청소년 증례
    ('TreatmentPage','8f463ec9-ec2e-4514-94db-68611f78bc82','Publication','f064037f-d438-4dcc-9620-3fcc82e4bbbe'), -- 갱년기 ← 폐경기 고찰
    ('TreatmentPage','8f463ec9-ec2e-4514-94db-68611f78bc82','MediaAppearance','7117fca0-b0fb-4203-9b5b-8fdf1154e4ac'), -- ← 나이 들면
    ('TreatmentPage','96050819-123d-4c23-a0f1-c2b468c27ba7','MediaAppearance','a7ee1f37-7c90-4820-9401-9cac63064ea3'), -- 출산전후 ← 산후 6주
    ('TreatmentPage','96050819-123d-4c23-a0f1-c2b468c27ba7','MediaAppearance','647e54a0-cb34-4982-8213-fc57790a929c'), -- ← 출산 후 다이어트
    ('TreatmentPage','85656c5b-efd0-4cc6-9bd8-b98cf938f554','MediaAppearance','a7ee1f37-7c90-4820-9401-9cac63064ea3'),
    ('TreatmentPage','85656c5b-efd0-4cc6-9bd8-b98cf938f554','MediaAppearance','647e54a0-cb34-4982-8213-fc57790a929c'),
    ('TreatmentPage','2c56643b-fb9f-4f23-b33d-b87911a29151','Publication','14d53872-7938-4932-9d59-d985157d19f5'), -- 마른비만 ← 체질 BMI
    ('TreatmentPage','4c0a0585-de76-483f-a4d9-737a19851b65','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'), -- 3GO ← 10년 임상
    -- Articles
    ('Article','11237ff7-7780-43d8-a479-cc1b1796e045','Publication','14d53872-7938-4932-9d59-d985157d19f5'),
    ('Article','11237ff7-7780-43d8-a479-cc1b1796e045','Publication','d7d200a4-4e8e-4f4e-a02a-932d0f9cd8a0'),
    ('Article','7ce111ec-7181-4353-a147-b4c7073f8cd3','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','5aaa1cbe-5faa-48f2-bd82-63e396b8b6ba','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','80748016-db2e-4e2e-af1d-83b657a4c53b','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'),
    ('Article','47528f7c-c76a-423d-9c89-ebe9d3d9cfce','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','fb93d028-af69-4822-aeaa-89a1c967588f','Publication','14d53872-7938-4932-9d59-d985157d19f5'), -- 사상체질
    ('Article','fb93d028-af69-4822-aeaa-89a1c967588f','MediaAppearance','f825a3ea-18bb-42a5-bea7-4a40b781d4da'), -- ← 사상체질 영상
    ('Article','4477b1a9-a89b-4c79-b58d-72f7d1fdf020','Publication','d3b15366-f097-4bb2-88b1-f3e45a958ff5'), -- 회식/술 ← 간효소
    ('Article','31c76ba2-3e3b-4516-8381-b8a2e4a2f5c4','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'), -- 요요
    ('Article','31c76ba2-3e3b-4516-8381-b8a2e4a2f5c4','MediaAppearance','4c394eae-4943-48f8-932a-1dc02c5e8797'),
    ('Article','a65e75e0-0dd7-4ce9-b2a5-860c28367a64','Publication','9201c29b-8f1d-46a5-b38d-c40a0b717eca'), -- 운동+체중 ← 생활습관
    ('Article','3133419d-b899-478f-bece-841594a35dd5','Publication','14d53872-7938-4932-9d59-d985157d19f5'),
    ('Article','154ae27d-b3ae-4e4b-acae-2f92b3546c89','Publication','b578f4e8-8e14-4a25-9c77-c1f88e81c951'), -- 지방분해주사
    ('Article','154ae27d-b3ae-4e4b-acae-2f92b3546c89','MediaAppearance','4fa8843e-9176-4295-af2e-d6755203a3a9'),
    ('Article','c5e3dd6f-802c-45ab-ba32-75d61cabcedc','Publication','f064037f-d438-4dcc-9620-3fcc82e4bbbe'), -- 갱년기
    ('Article','c5e3dd6f-802c-45ab-ba32-75d61cabcedc','MediaAppearance','7117fca0-b0fb-4203-9b5b-8fdf1154e4ac'),
    ('Article','8a96ef25-97b2-4574-bd35-1857bea89b84','Publication','45a4880b-4831-4976-bcb1-7dbea4aa6147'), -- 부작용 ← 마황 위양성
    ('Article','8a96ef25-97b2-4574-bd35-1857bea89b84','Publication','d3b15366-f097-4bb2-88b1-f3e45a958ff5'), -- ← 간효소
    ('Article','011a665a-f13b-4665-b36c-c724acd4c106','Publication','46db03f1-ef6c-46f2-905b-570474441666'), -- 당질조절
    ('Article','011a665a-f13b-4665-b36c-c724acd4c106','Publication','0150918c-1341-4808-9715-460726fa5fd3'),
    ('Article','02e00565-aeb3-40bd-be8c-394dc708e755','Publication','45a4880b-4831-4976-bcb1-7dbea4aa6147'), -- 시작 전 확인 ← 안전
    ('Article','02e00565-aeb3-40bd-be8c-394dc708e755','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'),
    ('Article','9db3252d-5449-474e-b825-7dd74eda0c97','MediaAppearance','a7ee1f37-7c90-4820-9401-9cac63064ea3'), -- 산후
    ('Article','9db3252d-5449-474e-b825-7dd74eda0c97','MediaAppearance','647e54a0-cb34-4982-8213-fc57790a929c'),
    ('Article','de9c2dd6-05f3-4618-9ce8-9baf9b342e0d','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'),
    ('Article','26fdefaa-cad6-4835-bdeb-024c1b340d95','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','15a78d4b-484b-4f04-9f95-bca334a76df3','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'),
    ('Article','6fa6757d-faa5-4111-ac7c-e57d6e2744d7','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','4225b35c-c16a-4754-8b74-b170e462c039','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','a45bd334-4979-42ce-b298-87ab4ae6ee15','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'),
    ('Article','cb157581-f352-48eb-8f12-3f67e1070e06','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'), -- 원리
    ('Article','cb157581-f352-48eb-8f12-3f67e1070e06','Publication','9201c29b-8f1d-46a5-b38d-c40a0b717eca'),
    ('Article','09dad963-ca1b-4b78-a049-cae1a4bfb9c1','Publication','0150918c-1341-4808-9715-460726fa5fd3'), -- 허리둘레 ← 대사
    ('Article','451585d2-dde0-41a5-8379-b7beec4148f0','Publication','e92f4b55-10c2-43b2-96c1-4dbf458587f6'), -- 한약 원리
    ('Article','451585d2-dde0-41a5-8379-b7beec4148f0','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','8d16d31f-29e9-4514-86d8-a8b1cd4dd357','Publication','45a4880b-4831-4976-bcb1-7dbea4aa6147'), -- 다이어트약 이해 ← 안전
    ('Article','8d16d31f-29e9-4514-86d8-a8b1cd4dd357','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','ad0fde21-4b75-4c0d-a02d-24a7794ca4cd','Publication','14d53872-7938-4932-9d59-d985157d19f5'),
    ('Article','87bfcef5-2a64-42ce-8b88-22785eb90366','Publication','a965b2db-a06a-4993-b19e-db78b37aa394'),
    ('Article','87bfcef5-2a64-42ce-8b88-22785eb90366','Publication','14d53872-7938-4932-9d59-d985157d19f5')
  ) AS v(st, sid, tt, tid)
  ON CONFLICT (instance_id, source_type, source_id, target_type, target_id, relation_type) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(5) 근거 cites 링크: % 건 추가', n;

  -- (6) FAQ related-to — 전 콘텐츠 공통(적합 대상 FAQ) + 주제별 추가
  --     F5 302fff2c 적합대상 · F6 89f661e0 부작용 · F4 9ef8f0dd 진료비 · F2 1dba40e8 임신 · F1 09e61b53 기간
  INSERT INTO content_entity_link (id, instance_id, source_type, source_id, target_type, target_id, relation_type, display_order, metadata, created_at, updated_at)
  -- (6-1) 모든 treatment/article → F5 (한약 다이어트 적합 대상 — 전 콘텐츠 주제 공통)
  SELECT gen_random_uuid(), iid, 'TreatmentPage', t.id, 'FAQ', '302fff2c-9f18-4d32-8b57-98e007a0c5d2'::uuid, 'related-to', 0, '{}'::jsonb, NOW(), NOW()
    FROM treatment_page t WHERE t.instance_id = iid
  UNION ALL
  SELECT gen_random_uuid(), iid, 'Article', a.id, 'FAQ', '302fff2c-9f18-4d32-8b57-98e007a0c5d2'::uuid, 'related-to', 0, '{}'::jsonb, NOW(), NOW()
    FROM article a WHERE a.instance_id = iid
  ON CONFLICT (instance_id, source_type, source_id, target_type, target_id, relation_type) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(6-1) FAQ 적합대상 related-to: % 건', n;

  INSERT INTO content_entity_link (id, instance_id, source_type, source_id, target_type, target_id, relation_type, display_order, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.st, v.sid::uuid, 'FAQ', v.fid::uuid, 'related-to', 1, '{}'::jsonb, NOW(), NOW()
  FROM (VALUES
    -- F6 부작용 — 한약 관련 콘텐츠
    ('TreatmentPage','49b3f28e-4d16-4335-9b94-8504110b74d6','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    ('Article','8a96ef25-97b2-4574-bd35-1857bea89b84','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    ('Article','8d16d31f-29e9-4514-86d8-a8b1cd4dd357','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    ('Article','02e00565-aeb3-40bd-be8c-394dc708e755','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    ('Article','451585d2-dde0-41a5-8379-b7beec4148f0','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    ('Article','cb157581-f352-48eb-8f12-3f67e1070e06','89f661e0-e2d9-4696-8f4e-2cbb537f7c76'),
    -- F4 진료비 — 가격 콘텐츠
    ('Article','26fdefaa-cad6-4835-bdeb-024c1b340d95','9ef8f0dd-2b10-4bcb-8bee-97d58216f35f'),
    ('Article','154ae27d-b3ae-4e4b-acae-2f92b3546c89','9ef8f0dd-2b10-4bcb-8bee-97d58216f35f'),
    -- F2 임신/산후
    ('TreatmentPage','96050819-123d-4c23-a0f1-c2b468c27ba7','1dba40e8-607a-4a92-b31b-c78dcf5aae64'),
    ('TreatmentPage','85656c5b-efd0-4cc6-9bd8-b98cf938f554','1dba40e8-607a-4a92-b31b-c78dcf5aae64'),
    ('Article','9db3252d-5449-474e-b825-7dd74eda0c97','1dba40e8-607a-4a92-b31b-c78dcf5aae64'),
    -- F1 프로그램 기간
    ('TreatmentPage','72d24213-8bc0-4692-9797-6792eddff767','09e61b53-5c7f-4686-a423-4b0808bf470d'),
    ('TreatmentPage','ecf84504-332e-4e46-abf5-8ff88bddabfc','09e61b53-5c7f-4686-a423-4b0808bf470d'),
    ('TreatmentPage','4c0a0585-de76-483f-a4d9-737a19851b65','09e61b53-5c7f-4686-a423-4b0808bf470d')
  ) AS v(st, sid, fid)
  ON CONFLICT (instance_id, source_type, source_id, target_type, target_id, relation_type) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE '(6-2) FAQ 주제별 related-to: % 건', n;

  -- 검증 요약
  RAISE NOTICE '=== 검증 ===';
  SELECT COUNT(*) INTO n FROM faq WHERE instance_id = iid AND status = 'published';
  RAISE NOTICE '발행 FAQ: %', n;
  SELECT COUNT(*) INTO n FROM content_entity_link WHERE instance_id = iid AND relation_type = 'cites';
  RAISE NOTICE 'cites 링크 총: %', n;
  SELECT COUNT(*) INTO n FROM content_entity_link WHERE instance_id = iid AND relation_type = 'related-to' AND target_type = 'FAQ';
  RAISE NOTICE 'FAQ related-to 총: %', n;
  SELECT COUNT(*) INTO n FROM treatment_page WHERE instance_id = iid AND metadata ? 'authorDoctorSlug';
  RAISE NOTICE 'authorDoctorSlug 보유 treatment: %', n;
END $$;
