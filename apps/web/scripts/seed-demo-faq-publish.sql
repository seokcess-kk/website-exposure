-- @glitzy/web/scripts/seed-demo-faq-publish — demo 안 draft FAQ 5건 안 published UPDATE.
-- C0025 마이그레이션 안 선행 적용 필요.

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_sentinel_user UUID := '00000000-0000-4000-8000-000000000001';
  v_updated INTEGER;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN RAISE EXCEPTION 'instance demo not found'; END IF;

  -- (1) sentinel ComplianceRecord INSERT — draft FAQ slug 별로
  INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
    auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
    record_phase, record_version, metadata)
  SELECT v_instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,
    '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
    v_sentinel_user, NOW(), NOW(), v_sentinel_user,
    'published'::compliance_record_phase, 1,
    '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"seed-demo-faq-publish"}'::jsonb
  FROM faq f
  WHERE f.instance_id = v_instance_id
    AND f.status = 'draft'
    AND NOT EXISTS (
      SELECT 1 FROM compliance_record cr
      WHERE cr.instance_id = v_instance_id
        AND cr.content_type = 'FAQ'::compliance_content_type
        AND cr.content_ref = f.slug
        AND cr.metadata @> '{"sentinel":true}'::jsonb
    );

  -- (2) draft → published UPDATE
  UPDATE faq f
     SET status = 'published'::content_publication_status,
         published_at = NOW(),
         compliance_record_id = cr.id
    FROM compliance_record cr
   WHERE f.instance_id = v_instance_id
     AND f.status = 'draft'
     AND cr.instance_id = v_instance_id
     AND cr.content_type = 'FAQ'::compliance_content_type
     AND cr.content_ref = f.slug
     AND cr.metadata @> '{"sentinel":true}'::jsonb;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RAISE NOTICE 'seed-demo-faq-publish: % FAQ 안 published 안 UPDATE 완료', v_updated;
END $$;
