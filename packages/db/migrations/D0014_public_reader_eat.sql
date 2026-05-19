-- @glitzy/db — D0014 app_public_reader EAT 4 table GRANT + per-table SELECT policy
-- SoT: EAT_CONTENT_PLAN v1.0 § 2.6 EC-SCHEMA-16·17 · EC-CASCADE-05
--
-- D0011 패턴 정합. publication / media_appearance 는 published only (D0011 article 패턴).
-- faq 는 published only — v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row.
-- article_category 는 taxonomy public 의도 — instance_id only (status 없음, EC-SCHEMA-17 결정).
--
-- Precondition: D0011 (app_public_reader) · C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq

GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;

-- ===== article_category: taxonomy public — instance_id only =====
-- 분류 자체는 instance scope 안 모든 row public. status 없음 (분류 메타).
-- 본 결정은 D0011 published-only 패턴과 다른 의도 — EC-SCHEMA-17.
CREATE POLICY public_reader_article_category_select
  ON article_category FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- ===== publication: published + 미래 발행 제외 (D0011 article 패턴 정합) =====
CREATE POLICY public_reader_publication_select
  ON publication FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- ===== media_appearance: published + 미래 발행 제외 =====
CREATE POLICY public_reader_media_appearance_select
  ON media_appearance FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- ===== faq: published only =====
-- v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row → /faq 페이지 빈 페이지 200.
-- LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
CREATE POLICY public_reader_faq_select
  ON faq FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );
