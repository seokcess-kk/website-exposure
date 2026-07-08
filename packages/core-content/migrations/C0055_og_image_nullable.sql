-- @glitzy/core-content C0055 — clinic_profile.og_image_url NOT NULL 해제
--
-- 의원정보 간소화 (2026-07-08): OG 이미지를 선택 입력으로 완화 — 비우면 렌더타임에 로고로
-- 폴백한다 (site-metadata buildPageMetadata · favicon_url C0052 와 동일한 nullable+폴백 패턴).
-- 릴리즈 게이트도 "og 또는 logo 중 하나" 로 완화 (release-evaluator).
--
-- manifest 외 개별 적용 (C0031+ 관행): pnpm --filter @glitzy/web run-sql packages/core-content/migrations/C0055_og_image_nullable.sql
-- idempotent — 이미 nullable 이면 no-op.

ALTER TABLE clinic_profile ALTER COLUMN og_image_url DROP NOT NULL;
