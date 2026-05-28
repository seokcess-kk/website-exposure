-- @glitzy/core-content — C0048 llm_call_log.prompt_template CHECK 확장 (CONTENT_AI_DRAFT_PLAN v1.0 CAID-DEFER-16 v1 합류)
-- brief 2-stage flow opt-in — 'article-brief-draft' (weight 1) 안 추가.
-- C0047 답습 — llm_call_log_template_enum DROP + ADD CHECK (manifest 외 patch).

ALTER TABLE llm_call_log
  DROP CONSTRAINT IF EXISTS llm_call_log_template_enum;

ALTER TABLE llm_call_log
  ADD CONSTRAINT llm_call_log_template_enum CHECK (prompt_template IN (
    'seo-meta-suggest',
    'keyword-match-suggest',
    'review-comment-suggest',
    'article-full-draft',
    'article-brief-draft'
  ));
