-- Spike E — 004: audit_event (instance-switched·tenant-resolved·magic-link 등 모든 auth event)

CREATE TABLE audit_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  -- event types: 'magic-link-issued', 'magic-link-consumed', 'magic-link-rejected',
  --              'session-created', 'session-revoked',
  --              'tenant-resolved', 'tenant-resolve-denied',
  --              'instance-switched', 'membership-changed', 'inactive-user-rejected'
  actor_user_id UUID,
  target_user_id UUID,
  from_instance_id UUID,
  to_instance_id UUID,
  reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
CREATE INDEX audit_event_actor_time_idx ON audit_event (actor_user_id, occurred_at DESC);
