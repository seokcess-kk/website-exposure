-- Spike D — migration 007: tenant_audit_log_view (custom view·raw SQL mixin)
-- SPIKED1-pending: custom view·security_invoker는 Drizzle Kit canonical 미지원·raw SQL 필수

-- security_invoker=on: caller의 RLS·permission 적용 (postgres 15+)
CREATE OR REPLACE VIEW tenant_audit_log_view
WITH (security_invoker = on, security_barrier = on) AS
SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at
FROM audit_log
WHERE instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid;

GRANT SELECT ON tenant_audit_log_view TO app_tenant_user;
