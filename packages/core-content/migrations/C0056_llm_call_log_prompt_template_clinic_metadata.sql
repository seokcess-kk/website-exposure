-- @glitzy/core-content — C0056 llm_call_log.prompt_template CHECK 확장 (의원정보 고급 문안 AI 자동 채움)
-- clinic_profile.metadata (C 하이브리드 5키 + localKeywords) AI Draft 신규 prompt_template 1종 추가.
-- C0049 패턴 답습 — CHECK DROP + ADD (manifest 외 patch · run-sql 개별 적용).

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
    'faq-full-draft',
    'clinic-metadata-draft'
  ));
