-- @glitzy/web/scripts/seed-demo-legals-publish — 기존 draft LegalDocument 안 published 안 UPDATE.
-- seed-demo-rich.sql 안 실행 후 LegalDocument 안 (instance_id, document_type) UNIQUE 안 이미 존재하면
-- 신규 INSERT 안 차단됨. 기존 draft 안 sentinel compliance_record 안 link + status='published' UPDATE.

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
  v_updated INTEGER;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN RAISE EXCEPTION 'instance demo not found'; END IF;

  -- (1) 기존 draft LegalDocument 안 slug 별로 sentinel compliance_record INSERT
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
    published_at, published_by, record_phase, record_version, metadata)
  SELECT v_instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), v_sentinel_user, NOW(),
    NOW(), v_sentinel_user, 'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-legals-publish"}'::jsonb
  FROM legal_document l
  WHERE l.instance_id = v_instance_id
    AND l.status = 'draft'
    AND NOT EXISTS (
      SELECT 1 FROM compliance_record cr
      WHERE cr.instance_id = v_instance_id
        AND cr.content_type = 'LegalDocument'::compliance_content_type
        AND cr.content_ref = l.slug
        AND cr.metadata @> '{"sentinel":true}'::jsonb
    );

  -- (2) draft → published UPDATE (compliance_record_id 안 sentinel 안 함께 SET — trigger 통과)
  UPDATE legal_document l
     SET status = 'published'::content_publication_status,
         published_at = NOW(),
         compliance_record_id = cr.id
    FROM compliance_record cr
   WHERE l.instance_id = v_instance_id
     AND l.status = 'draft'
     AND cr.instance_id = v_instance_id
     AND cr.content_type = 'LegalDocument'::compliance_content_type
     AND cr.content_ref = l.slug
     AND cr.metadata @> '{"sentinel":true}'::jsonb;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RAISE NOTICE 'seed-demo-legals-publish: % LegalDocument 안 published 안 UPDATE 완료', v_updated;
END $$;
