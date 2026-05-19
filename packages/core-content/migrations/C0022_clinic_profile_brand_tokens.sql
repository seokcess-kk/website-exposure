-- @glitzy/core-content C0022 — clinic_profile.brand_tokens JSONB (2026-05-19)
-- Layer 1 per-instance brand 자동 추출 결과 저장. DESIGN_TOKENS v1.0 BrandTokens 양층 (preset + instance override) 안 instance 레이어.
-- 본 column 안 site-meta-fetch 안 추출된 primary/accent + 사용자 수정 결과 보존. 사이트 SSR 안 CSS var override 입력.
--
-- shape:
--   {
--     "primaryHex": "#1F4D2E" | null,
--     "accentHex": "#C8A565" | null,
--     "palette": ["#...", "#...", ...] | [],
--     "source": "logo" | "ogImage" | "themeColor" | "manual" | "none"
--   }
-- null 또는 {} default 시 — Layer 0 한의원 base theme 사용 (override 없음).

ALTER TABLE clinic_profile
  ADD COLUMN IF NOT EXISTS brand_tokens JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE clinic_profile
  DROP CONSTRAINT IF EXISTS clinic_profile_brand_tokens_object;
ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_brand_tokens_object CHECK (jsonb_typeof(brand_tokens) = 'object');
