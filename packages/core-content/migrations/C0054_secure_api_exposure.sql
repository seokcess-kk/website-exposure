-- C0054 — Supabase lint(sensitive_columns_exposed) 해소: auth 테이블 RLS + Data API 권한 회수
--
-- 배경:
--   - Supabase 는 public 스키마를 PostgREST Data API 로 노출하고, project 기본 default privileges 가
--     anon/authenticated 에 모든 테이블 ALL 권한을 부여한다 (테이블 생성 시점 자동).
--   - 본 앱은 PostgREST 를 사용하지 않는다 — postgres.js 직접 연결 (owner postgres ·
--     SET LOCAL ROLE app_tenant_user · app_public_reader) 만 사용.
--   - auth 테이블 5개 (admin_user·instance_membership·session·verificationToken·audit_event) 는
--     RLS 미적용이라 admin_user.password_hash · session."sessionToken" · verificationToken."token" 이
--     anon 키만으로 Data API 를 통해 읽기/쓰기 가능한 상태였다 (Critical lint).
--
-- 조치:
--   (1) auth 테이블 5개 RLS ENABLE — policy 없음 = owner(postgres·BYPASSRLS)/service_role 외 전면 차단.
--       FORCE 미지정: 앱의 auth 테이블 접근은 전부 getSqlBase()(owner postgres) 경유라 무영향.
--   (2) audit_event 만 app_tenant_user INSERT 허용 — release-actions 가 withTenantTransaction
--       (SET LOCAL ROLE app_tenant_user) 안에서 audit INSERT (기존 GRANT 부재 결함도 함께 해소).
--       SELECT/UPDATE/DELETE 미부여 — tenant role 관점 append-only.
--   (3) anon/authenticated 의 public 스키마 권한 전면 회수 + default privileges 회수.
--       role 존재 여부 guard — Supabase 환경 한정 실행 (dev docker 는 anon 미존재 → skip).
--
-- idempotent — 재실행 안전.

-- ===========================================================================
-- (1) auth 테이블 RLS
-- ===========================================================================
ALTER TABLE admin_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_event ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- (2) audit_event — app_tenant_user INSERT 전용
-- ===========================================================================
GRANT INSERT ON audit_event TO app_tenant_user;

DROP POLICY IF EXISTS audit_event_tenant_insert ON audit_event;
CREATE POLICY audit_event_tenant_insert ON audit_event
  FOR INSERT TO app_tenant_user
  WITH CHECK (true);

-- ===========================================================================
-- (3) Data API(PostgREST) role 권한 회수 — anon/authenticated 존재 환경(Supabase) 한정
-- ===========================================================================
DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE USAGE ON SCHEMA public FROM %I', api_role);
      -- 이후 생성 테이블에 자동 부여되는 default privileges 도 회수 (postgres 소유 객체 한정 —
      -- supabase_admin 소유 default ACL 은 postgres 권한으로 변경 불가·내부 객체용이라 무관).
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM %I', api_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', api_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', api_role);
      RAISE NOTICE 'C0054: % 권한 회수 완료', api_role;
    ELSE
      RAISE NOTICE 'C0054: role % 미존재 — skip (비 Supabase 환경)', api_role;
    END IF;
  END LOOP;
END $$;
