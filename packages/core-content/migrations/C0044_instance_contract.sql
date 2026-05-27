-- @glitzy/core-content C0044 — instance_contract (ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 2)
-- super-admin 의 cross-instance 비즈니스 계약/구독 status. instance 1:1 매핑 (이력은 ABE-DEFER-01).
-- RLS 미적용 — super-admin only · /admin context · admin role 직접 query (CLAUDE.md raw sql 패턴 답습).

CREATE TABLE IF NOT EXISTS instance_contract (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id     UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  status          TEXT NOT NULL,
  plan_tier       TEXT NOT NULL,
  billing_cycle   TEXT NOT NULL,
  amount_krw      INTEGER NOT NULL DEFAULT 0,
  start_date      DATE NOT NULL,
  end_date        DATE,
  contract_holder_name   TEXT NOT NULL DEFAULT '',
  contract_holder_email  TEXT NOT NULL DEFAULT '',
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT instance_contract_status_enum CHECK (status IN ('trial','active','suspended','terminated')),
  CONSTRAINT instance_contract_plan_tier_enum CHECK (plan_tier IN ('starter','standard','pro','custom')),
  CONSTRAINT instance_contract_billing_cycle_enum CHECK (billing_cycle IN ('monthly','yearly','custom')),
  CONSTRAINT instance_contract_amount_nonneg CHECK (amount_krw >= 0),
  CONSTRAINT instance_contract_dates_order CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT instance_contract_holder_name_len  CHECK (char_length(contract_holder_name)  <= 100),
  CONSTRAINT instance_contract_holder_email_len CHECK (char_length(contract_holder_email) <= 200),
  CONSTRAINT instance_contract_notes_len        CHECK (char_length(notes) <= 2000),
  CONSTRAINT instance_contract_unique UNIQUE (instance_id)
);

CREATE INDEX IF NOT EXISTS instance_contract_status_idx ON instance_contract (status);
CREATE INDEX IF NOT EXISTS instance_contract_end_date_idx ON instance_contract (end_date) WHERE end_date IS NOT NULL;
