-- @glitzy/core-content C0024 — instance.release_state JSONB column (2026-05-19 · ADMIN_UX_REDESIGN W6)
-- 사용자 진단 + UX-LIFECYCLE-03 hybrid 결정:
--   - draft (default · derived 안 evaluator 통과 시 'ready' 표시)
--   - release-pending (운영자 "출시 검수 요청" 명시 액션 후)
--   - published (검수 통과 + 운영자 "출시" 명시 액션 후)
-- audit_event 'instance-lifecycle-transitioned' emit 동반 (별 cycle 안 server action 안 명시).

ALTER TABLE instance
  ADD COLUMN IF NOT EXISTS release_state JSONB NOT NULL DEFAULT '{"state":"draft","lastTransitionAt":null,"transitionBy":null,"releasedAt":null}'::jsonb;

ALTER TABLE instance
  DROP CONSTRAINT IF EXISTS instance_release_state_shape;
ALTER TABLE instance
  ADD CONSTRAINT instance_release_state_shape CHECK (
    jsonb_typeof(release_state) = 'object'
    AND release_state ? 'state'
    AND release_state ->> 'state' IN ('draft', 'release-pending', 'published')
  );

-- 기존 instance row 안 모두 default 적용 (NOT NULL DEFAULT 안 자동)
-- 단 향후 lifecycle 전이 시 (server action 안) updated.
