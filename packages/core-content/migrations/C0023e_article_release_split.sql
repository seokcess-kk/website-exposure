-- @glitzy/core-content C0023e — Article release schema split
-- summary · hero_image_url NOT NULL → nullable (L3 zod 안 require).

ALTER TABLE article ALTER COLUMN summary DROP NOT NULL;
-- hero_image_url 안 이미 nullable (확인 후 skip 가능 — DROP NOT NULL 안전 idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'article' AND column_name = 'hero_image_url' AND is_nullable = 'NO') THEN
    EXECUTE 'ALTER TABLE article ALTER COLUMN hero_image_url DROP NOT NULL';
  END IF;
END $$;

-- grandfather backfill
UPDATE compliance_record cr
   SET metadata = cr.metadata || '{"legacyGrandfathered": true, "grandfatheredAt": "2026-05-19", "reason": "AUX-redesign-v1-backfill-article"}'::jsonb
  FROM article a
 WHERE cr.content_type = 'Article'::compliance_content_type
   AND cr.content_ref = a.slug
   AND cr.instance_id = a.instance_id
   AND cr.record_phase = 'published'
   AND a.status = 'published'
   AND (a.summary IS NULL OR a.summary = '' OR length(a.summary) < 80);
