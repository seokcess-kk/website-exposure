-- @glitzy/web/scripts/seed-daejeon-keywords — 대전점(daeatdiet-daejeon) 노출 희망 키워드 P0 primary 등록
-- 2026-07-16 사용자 요청. AI Draft 프리필(방식 A)의 source — 등록 후 아티클/시술 작성 시 자동 프리필.
-- keyword_target 제약: slug regex ^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$ (공백 불가·한글 허용) ·
--   intent ∈ (informational|comparison|pre-booking|local) · priority ∈ (P0|P1|P2).
-- 6건 모두 지역 검색어 → intent='local' · priority='P0' · region_scope='대전 서구'.
-- ON CONFLICT idempotent (재실행 무해).

DO $$
DECLARE
  v_instance_id UUID;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'daeatdiet-daejeon' LIMIT 1;
  IF v_instance_id IS NULL THEN RAISE EXCEPTION 'instance daeatdiet-daejeon not found'; END IF;

  -- RLS(app.current_instance_id) 정합 — BYPASSRLS role 이면 무시, 아니면 policy 통과.
  PERFORM set_config('app.current_instance_id', v_instance_id::text, true);

  INSERT INTO keyword_target (instance_id, slug, label, keyword_type, intent, priority, region_scope, status)
  VALUES
    (v_instance_id, '대전다이어트한의원', '대전다이어트한의원', 'primary', 'local', 'P0', '대전 서구', 'active'),
    (v_instance_id, '대전다이어트병원',   '대전다이어트병원',   'primary', 'local', 'P0', '대전 서구', 'active'),
    (v_instance_id, '둔산동다이어트',     '둔산동다이어트',     'primary', 'local', 'P0', '대전 서구', 'active'),
    (v_instance_id, '대전한약다이어트',   '대전한약다이어트',   'primary', 'local', 'P0', '대전 서구', 'active'),
    (v_instance_id, '대전식욕억제제',     '대전식욕억제제',     'primary', 'local', 'P0', '대전 서구', 'active'),
    (v_instance_id, '대전서구한방병원',   '대전서구한방병원',   'primary', 'local', 'P0', '대전 서구', 'active')
  ON CONFLICT (instance_id, slug) DO UPDATE
    SET label        = EXCLUDED.label,
        keyword_type = EXCLUDED.keyword_type,
        intent       = EXCLUDED.intent,
        priority     = EXCLUDED.priority,
        region_scope = EXCLUDED.region_scope,
        status       = EXCLUDED.status,
        updated_at   = now();

  RAISE NOTICE '대전 키워드 6건 등록/갱신 완료 (instance_id=%)', v_instance_id;
END $$;

-- 확인 출력
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT kt.label, kt.priority, kt.keyword_type, kt.status
    FROM keyword_target kt JOIN instance i ON kt.instance_id = i.id
    WHERE i.slug = 'daeatdiet-daejeon' AND kt.priority = 'P0'
    ORDER BY kt.updated_at DESC
  LOOP
    RAISE NOTICE '  % · % · % · %', r.label, r.priority, r.keyword_type, r.status;
  END LOOP;
END $$;
