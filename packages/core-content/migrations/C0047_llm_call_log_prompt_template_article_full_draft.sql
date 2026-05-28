-- @glitzy/core-content — C0047 llm_call_log.prompt_template CHECK 확장 (CONTENT_AI_DRAFT_PLAN v1.0 § 3)
-- CAID = CAI-DEFER-02 본 구현 — Article 본문 AI Draft 생성 신규 prompt_template 'article-full-draft' 추가.
-- C0043 의 llm_call_log_template_enum CHECK constraint DROP + ADD (manifest 외 patch).

ALTER TABLE llm_call_log
  DROP CONSTRAINT IF EXISTS llm_call_log_template_enum;

ALTER TABLE llm_call_log
  ADD CONSTRAINT llm_call_log_template_enum CHECK (prompt_template IN (
    'seo-meta-suggest',
    'keyword-match-suggest',
    'review-comment-suggest',
    'article-full-draft'
  ));
