# Spike A PROVIDER_PASS Runbook — Supabase Pooler (Day 9)

## 사전 조건

- Supabase 계정·프로젝트 생성 권한
- LOCAL_PASS 완료 (`pnpm spike-a:all` PASS — apps/spike-a)
- node 20+·pnpm 10+·`psql` CLI (Supabase migration용)

## Step 1: Supabase 프로젝트 생성

```
Dashboard → New project
Name: glitzy-spike-a-staging (또는 통합 프로젝트)
Region: AP Northeast (Seoul) ap-northeast-2
Plan: Free tier (Phase 0 검증·이후 Pro로 전환)
```

생성 후 wait ~2분.

## Step 2: 연결 URL 확보

```
Dashboard → Project Settings → Database
- Connection pooling → Transaction mode (port 6543) → `Connection string` 복사 → DATABASE_URL_TENANT
- Connection pooling → Session mode (port 5432) → `Connection string` 복사 → DATABASE_URL_SUPER
- DB password → 안전한 secret store 저장
```

## Step 3: app_tenant_user role 생성

Supabase의 default user는 `postgres` (super-user). 별도 `app_tenant_user` (NOBYPASSRLS) 생성 필요.

`psql DATABASE_URL_SUPER`로 접속 후:

```sql
-- 본 코드는 apps/spike-a/migrations/001_roles.sql와 동등
CREATE ROLE app_tenant_user NOLOGIN NOBYPASSRLS;
-- Pooler에서 login하려면 별도 user (postgres login user의 prefix) 사용
-- Supabase Pooler 형식: <pg_user>.<project-ref>:<password>@...
-- app_tenant_user를 직접 login user로 쓰려면 별도 절차 필요·또는 SET LOCAL ROLE만 사용
```

**중요**: Supabase Pooler는 `<pg_user>.<project_ref>` 형식만 인식. `app_tenant_user`를 login user로 쓰려면 Supabase에서 별도 발급 절차가 필요. 본 spike PROVIDER에서는:
- 옵션 A (권장): `DATABASE_URL_TENANT`도 `postgres` user 사용·application에서 매 tx마다 `SET LOCAL ROLE app_tenant_user` 호출 — LOCAL과 동일 패턴·Pooler transaction mode에서 SET LOCAL 정상 동작
- 옵션 B: Supabase support·또는 별도 self-hosted pgbouncer

본 PROVIDER_PASS는 옵션 A로 진행.

## Step 4: migration apply

```bash
cp .env.provider.example .env.provider
# DATABASE_URL_SUPER·DATABASE_URL_TENANT 채워서

pnpm migrate    # 또는 docker compose down·새 DB clean 후 migrate
```

migration 후 검증:
```bash
psql $DATABASE_URL_SUPER -c "\dt"     # tables list
psql $DATABASE_URL_SUPER -c "\dp content_test"   # GRANT 확인
psql $DATABASE_URL_SUPER -c "SELECT pg_get_userbyid(c.relowner) AS owner, c.relrowsecurity FROM pg_class c WHERE c.relname = 'content_test'"
```

## Step 5: PROVIDER smoke 실행

```bash
pnpm provider:smoke
```

본 smoke는 LOCAL_PASS 9 시나리오 중 핵심을 압축:
1. withTenantTransaction self-prefix (200 OK)
2. cross-instance reject (RLS)
3. SET LOCAL ROLE in transaction mode (postgres-js prepare:false)
4. service_role audit (pending insert pattern)
5. advisory lock migration (re-entrant)
6. invariant 100×10 concurrent (LOCAL 1000×20의 1/10 — 비용 절감)

## acceptance checklist

| 검증 | 기준 | LOCAL 비교 |
|---|---|---|
| withTenantTransaction in Pooler transaction mode | SET LOCAL ROLE + set_config 모두 정상·각 tx scope | 동등 |
| postgres-js `prepare: false` | Pooler transaction mode에서 prepared statement 회피 | LOCAL은 미강제·PROVIDER 필수 |
| RLS USING/WITH CHECK | cross-instance SELECT·INSERT 모두 reject | 동등 |
| service_role audit pending pattern | audit_log row 항상 생성·outcome update | 동등 |
| advisory lock concurrent migrate | 2 runner 동시 → 1만 진행 | 동등 |
| Pooler max connection (5) | postgres-js max=5에서 안정·timeout 없음 | LOCAL은 더 큰 pool |
| latency p50/p95 | LOCAL과 비교 — 네트워크 latency 추가 분 | 측정 결과 기록 |

## PROVIDER 특이 사항

### prepare:false 강제 이유
Supabase Pooler transaction mode (port 6543)는 pgBouncer transaction pool — 같은 connection이 여러 client에 share. prepared statement는 connection-scoped라 충돌 발생. postgres-js의 `prepare: false`로 statement caching 비활성화 필수.

### SET LOCAL 동작
pgBouncer transaction mode에서 SET LOCAL은 tx scope·session 외 leak 없음. LOCAL docker postgres에서도 동등 동작.

### Connection limit
Free tier: pooler max 60 connections·application max 5~10 권장. 본 smoke는 max=5로 안전.

## 비용 estimate

- Free tier: 500 MB DB·2 GB egress
- 본 PROVIDER smoke: <10 MB·<100 MB egress
- 검증 후 project 삭제 또는 paused

## acceptance 후 cleanup

```
Dashboard → Project Settings → General → Pause project
또는 Delete project (검증 후 즉시 삭제 권장)
```
