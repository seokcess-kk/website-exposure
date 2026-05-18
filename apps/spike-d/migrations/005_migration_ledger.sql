-- Spike D — migration 005: migration_ledger (Drizzle Kit __drizzle_migrations 보완)
-- SPIKED1-001 cycle2: IF NOT EXISTS + ensureLedger와 byte-for-byte 동등 schema
-- bootstrap 시 ensureLedger가 동일 schema 선생성 가능·여기서 IF NOT EXISTS로 idempotent

CREATE TABLE IF NOT EXISTS migration_ledger (
  id INTEGER PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  checksum TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_by TEXT NOT NULL,
  service_role_function TEXT NOT NULL,
  target_db TEXT NOT NULL,
  duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS migration_ledger_applied_at_idx ON migration_ledger (applied_at DESC);
