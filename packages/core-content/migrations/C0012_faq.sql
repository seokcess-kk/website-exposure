-- @glitzy/core-content — C0012 FAQ (DATA_MODEL C-12·EAT_CONTENT_PLAN v1.0 § 2.5)
-- EC-SCHEMA-13·14·15: 풀명세 합류. v0.1 단계 status='draft' + published_at IS NULL CHECK 강제.
-- compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05·12) 까지 published 자체 차단.
-- LegalDocument LL-SCHEMA-03·04 패턴 정합.
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 treatment_page · C0009 article_category · C0004 content_publication_status · C0005 risk_level

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  related_treatment_id UUID,                    -- C-12 SoT · v0.1 nullable (EC-DEFER-09)
  related_condition_id UUID,                     -- v0.1 nullable (medical_condition_page FK 는 C-11 합류 후)
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
  -- EC-SCHEMA-14 · cycle 1 ECP-10·11: v0.1 published 차단 (LegalDocument 패턴)
  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),
  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),
  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
    REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외)
);

CREATE INDEX faq_instance_idx ON faq (instance_id);
CREATE INDEX faq_status_idx ON faq (instance_id, status);
CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  WHERE category_id IS NOT NULL;
CREATE INDEX faq_order_idx ON faq (instance_id, display_order, id);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON faq
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
