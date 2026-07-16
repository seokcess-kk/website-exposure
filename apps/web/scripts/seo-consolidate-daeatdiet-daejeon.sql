-- daeatdiet-daejeon SEO consolidation (idempotent) — 인천(4f286d1) 방식 정합.
-- One instance, one home-page head term, intent별 canonical 1개.
--
-- 인천과의 차이: 대전 published 7편은 각기 다른 intent(식욕억제제·체질맞춤·보조제비교·서구한방병원·
--   한약상담·둔산동·체중정체)라 near-duplicate 가 없음 → article stale/301 통합은 대전엔 적용하지 않음
--   (노출 중 페이지 손실 방지). 이 스크립트는 keyword_target doorway 해소 + localKeywords SoT 만 재편한다.
--
-- 대체 대상: seed-daejeon-keywords.sql(6 P0 primary, targetPath 부재) — 본 스크립트가 상위 재편.

DO $$
DECLARE
  iid UUID;
BEGIN
  SELECT id INTO iid FROM instance WHERE slug = 'daeatdiet-daejeon';
  IF iid IS NULL THEN RAISE EXCEPTION 'instance daeatdiet-daejeon not found'; END IF;

  -- Homepage SoT: localKeywords[0] 이 홈 exact title 을 구동(현재 노출 중인 "대전다이어트한의원" 유지).
  --   이후 항목은 지역 문맥(서구·둔산·한약·한방) — 별도 인스턴스/도어웨이 없이 자연 지역 시그널.
  UPDATE clinic_profile
     SET metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{localKeywords}',
           '["대전다이어트한의원","다이어트한의원대전","대전서구다이어트한의원","둔산동다이어트","대전 다이어트 한약","대전 한방 다이어트"]'::jsonb,
           true
         ),
         updated_at = NOW()
   WHERE instance_id = iid AND slug = 'clinic';

  -- keyword_target 재편: head term 1개만 primary(P0, 홈) + 나머지는 intent별 secondary + 실재 canonical targetPath.
  --   기존 6 P0 primary 를 ON CONFLICT 로 강등/targetPath 부여 (doorway 해소).
  INSERT INTO keyword_target
    (id, instance_id, slug, label, keyword_type, intent, priority, status, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.slug, v.label, v.kind, v.intent, v.priority, 'active',
         jsonb_build_object('targetPath', v.path), NOW(), NOW()
    FROM (VALUES
      ('대전다이어트한의원','대전다이어트한의원','primary',  'local',        'P0','/'),
      ('대전다이어트병원',  '대전다이어트병원',  'secondary','local',        'P0','/'),
      ('대전서구한방병원',  '대전서구한방병원',  'secondary','local',        'P1','/insights/diet/daejeon-korean-medicine-hospital-diet'),
      ('둔산동다이어트',    '둔산동다이어트',    'secondary','local',        'P1','/insights/diet/doonsan-dong-diet-guide'),
      ('대전식욕억제제',    '대전식욕억제제',    'secondary','informational','P1','/insights/diet/appetite-suppressant-guide'),
      ('대전한약다이어트',  '대전한약다이어트',  'secondary','informational','P1','/insights/diet/daejeon-korean-medicine-hospital-diet-guide')
    ) AS v(slug,label,kind,intent,priority,path)
  ON CONFLICT (instance_id, slug) DO UPDATE
    SET label        = EXCLUDED.label,
        keyword_type = EXCLUDED.keyword_type,
        intent       = EXCLUDED.intent,
        priority     = EXCLUDED.priority,
        status       = 'active',
        metadata     = keyword_target.metadata || EXCLUDED.metadata,
        updated_at   = NOW();

  RAISE NOTICE '대전 keyword_target 재편 + localKeywords SoT 확장 완료 (instance_id=%)', iid;
END $$;

-- 확인 출력
DO $$
DECLARE r RECORD; v_id UUID;
BEGIN
  SELECT id INTO v_id FROM instance WHERE slug='daeatdiet-daejeon';
  RAISE NOTICE '--- keyword_target (priority | type | label | target) ---';
  FOR r IN
    SELECT label, keyword_type, priority, metadata->>'targetPath' tp
    FROM keyword_target WHERE instance_id=v_id ORDER BY keyword_type DESC, priority, label
  LOOP RAISE NOTICE '  % | % | % | %', r.priority, r.keyword_type, r.label, COALESCE(r.tp,'-'); END LOOP;
END $$;
