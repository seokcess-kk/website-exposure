-- @glitzy/core-content C0023d — TreatmentPage release schema split + body_slots column (cycle1 AUX-07)
-- summary/body_markdown 안 NOT NULL → nullable (L3 zod 안 require).
-- body_slots JSONB DEFAULT '{}' 신설 — 슬롯형 에디터 SoT (overview · target · process · precautions · faq[]).

ALTER TABLE treatment_page ALTER COLUMN summary DROP NOT NULL;
ALTER TABLE treatment_page ALTER COLUMN body_markdown DROP NOT NULL;

ALTER TABLE treatment_page ADD COLUMN IF NOT EXISTS body_slots JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE treatment_page DROP CONSTRAINT IF EXISTS treatment_page_body_slots_object;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_body_slots_object CHECK (jsonb_typeof(body_slots) = 'object');

-- grandfather backfill (treatment_page 안 status='published' + summary/body NULL 검출 시 marker)
UPDATE compliance_record cr
   SET metadata = cr.metadata || '{"legacyGrandfathered": true, "grandfatheredAt": "2026-05-19", "reason": "AUX-redesign-v1-backfill-treatment"}'::jsonb
  FROM treatment_page tp
 WHERE cr.content_type = 'TreatmentPage'::compliance_content_type
   AND cr.content_ref = tp.slug
   AND cr.instance_id = tp.instance_id
   AND cr.record_phase = 'published'
   AND tp.status = 'published'
   AND (tp.summary IS NULL OR tp.body_markdown IS NULL);
