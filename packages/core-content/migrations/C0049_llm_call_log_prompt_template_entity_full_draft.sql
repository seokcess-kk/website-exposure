-- @glitzy/core-content — C0049 llm_call_log.prompt_template CHECK 확장 (CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 § 3)
-- CAID-DEFER-02 본 구현 — treatment_page · medical_condition_page · faq 본문 AI Draft 생성 신규 prompt_template 3종 추가.
-- C0047/C0048 의 llm_call_log_template_enum CHECK constraint DROP + ADD (manifest 외 patch).

ALTER TABLE llm_call_log
  DROP CONSTRAINT IF EXISTS llm_call_log_template_enum;

ALTER TABLE llm_call_log
  ADD CONSTRAINT llm_call_log_template_enum CHECK (prompt_template IN (
    'seo-meta-suggest',
    'keyword-match-suggest',
    'review-comment-suggest',
    'article-full-draft',
    'article-brief-draft',
    'treatment-page-full-draft',
    'medical-condition-page-full-draft',
    'faq-full-draft'
  ));
