-- Spike D — migration 003: instance_user with partial unique
-- SPIKED1-pending: partial unique (WHERE active=true) Drizzle Kit canonical 가능

CREATE TABLE instance_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partial unique: 동일 (instance_id, user_id) 조합은 active=true 상태로 1건만
-- inactive 상태 record는 여러 개 가능 (history)
CREATE UNIQUE INDEX instance_user_active_unique
  ON instance_user (instance_id, user_id)
  WHERE active = true;

CREATE INDEX instance_user_instance_id_idx ON instance_user (instance_id);
