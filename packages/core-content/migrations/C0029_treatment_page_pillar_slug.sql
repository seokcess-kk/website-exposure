-- @glitzy/core-content — C0029 TreatmentPage.pillar_slug 컬럼 추가
-- 사용자 결정 2026-05-20 (C 하이브리드 alignment Phase 1):
-- 시술별 Pillar 분류를 page.tsx hardcode (PILLAR_OF) 가 아닌 DB 컬럼으로 이관.
-- 효과: (1) Pillar list 페이지 자동 생성 (2) 연관 시술 자동 매칭 (3) breadcrumb pillar label 자동
--
-- 컬럼 의미:
--   - NULL = 분류 미지정 (legacy 또는 신규 시술 입력 직후)
--   - 'diet-treatment'      = 다이어트 치료
--   - 'personalized-diet'   = 개인맞춤 다이어트
--   - 'body-shaping'        = 체형관리
--   - 'herbal-medicine'     = 다이트 한약
--   - (다른 instance 는 자유 slug — clinic_profile.metadata.treatmentPillars 의 slug 와 매칭)
--
-- 향후 별도 pillar 테이블로 ref 가능 (현재 stage 에서는 free-form TEXT 로 가볍게).

\set ON_ERROR_STOP on

ALTER TABLE treatment_page
  ADD COLUMN IF NOT EXISTS pillar_slug TEXT;

-- pillar_slug regex: slug 와 동일 — 영문/숫자/하이픈만
ALTER TABLE treatment_page
  DROP CONSTRAINT IF EXISTS treatment_page_pillar_slug_regex;
ALTER TABLE treatment_page
  ADD CONSTRAINT treatment_page_pillar_slug_regex CHECK (
    pillar_slug IS NULL OR pillar_slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'
  );

CREATE INDEX IF NOT EXISTS treatment_page_pillar_idx ON treatment_page (instance_id, pillar_slug)
  WHERE pillar_slug IS NOT NULL;
