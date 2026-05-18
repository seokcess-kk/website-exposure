# Spike A — Drizzle + RLS + tenant scoping

> **상태**: prototype **v0.3 LOCAL_PASS candidate** (codex 1·2차 비평 26 지적 반영)
> **상위 결정**: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike A
> **LOCAL ONLY**: 본 prototype의 password·secret은 로컬 docker-compose 전용. production은 secret manager (Doppler) 사용

## 가설 + 통과 기준

상위 결정 문서 § A.1·A.3 참조.

## 디렉토리 빠른 진입

```bash
cd apps/spike-a
pnpm install
cp .env.example .env
```

## 실행

`.env` loading 방식 (PowerShell 또는 dotenv-cli):

### Option 1: dotenv-cli (권장)

```bash
# docker-compose 기동
pnpm up
pnpm dotenv -e .env -- pnpm wait-db

# migration·seed
pnpm dotenv -e .env -- pnpm migrate
pnpm dotenv -e .env -- pnpm seed

# 시나리오 9개
pnpm dotenv -e .env -- pnpm scenario:pgbouncer-auth
pnpm dotenv -e .env -- pnpm scenario:read
pnpm dotenv -e .env -- pnpm scenario:write
pnpm dotenv -e .env -- pnpm scenario:rollback
pnpm dotenv -e .env -- pnpm scenario:nested
pnpm dotenv -e .env -- pnpm scenario:audit
pnpm dotenv -e .env -- pnpm scenario:negative
pnpm dotenv -e .env -- pnpm scenario:invariant
pnpm dotenv -e .env -- pnpm scenario:perf

# 정리
pnpm down
```

### Option 2: PowerShell native (Windows)

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') { [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2]) }
}
pnpm up
pnpm wait-db
pnpm migrate
pnpm seed
pnpm scenario:all
pnpm down
```

## 시나리오 9개

> `scenario:all`은 각 시나리오 사이에 `seed` 재실행으로 상태 격리 (SPIKEA3-001 정정)

| Scenario | 목적 |
|---|---|
| test-pgbouncer-auth | (pre-flight) app_tenant_user가 pgbouncer 6433 경로로 로그인 가능 검증 |
| test-read | SELECT 격리 — instance-a·b·service-role |
| test-write | INSERT/UPDATE/DELETE WITH CHECK·instance_id 변경 시도 reject |
| test-rollback | rollback 후 context 누설 0 |
| test-nested-tx | savepoint 안에서 context 유지 |
| test-audit | service-role pending audit + outcome update + append-only **layer 1** (GRANT denied) |
| test-negative | malformed UUID·SQL injection·assertScopedDb·break-glass guard |
| test-invariant | 1000 iter × 20 concurrent — foreign_instance·errors·bad_result_count 0 |
| test-perf | 3 baseline (direct-bypass·tenant-no-context·tenant-with-context) p50·p95 — 참고용 |

## v0.3 한계 (provider gate Day 9 전)

| 항목 | 한계 | 후속 |
|---|---|---|
| append-only layer 2 | RLS no-policy 검증은 별도 role 필요 — 본 prototype은 layer 1 (GRANT denied)만 강제 (SPIKEA2-006) | 본 구현 단계 별도 role 시 검증 |
| multi-instance audit | 1 invocation = 1 audit row (representative instance). multi-instance B tenant는 자신에게 영향 준 break-glass 이벤트 읽기 불가 — control-plane audit table 분리 예정 (SPIKEA2-003) | 본 구현 단계 별도 spec |
| Supabase Pooler 검증 | 본 prototype은 **LOCAL_PASS 후보**만. PROVIDER_PASS는 Day 9 Supabase dev profile 실행 후 (SPIKEA2-007) | Day 9 `apps/spike-a-provider` 또는 .env.staging |

## 환경 변수 (`.env.example`)

```
DATABASE_URL_SUPER=postgres://postgres:postgres@localhost:5433/spike_a
DATABASE_URL_TENANT=postgres://app_tenant_user:app_tenant_pw@localhost:6433/spike_a
DATABASE_URL_SERVICE_ROLE=postgres://postgres:postgres@localhost:5433/spike_a
INVARIANT_ITER=1000
INVARIANT_CONCURRENCY=20
PERF_N=500
SPIKE_DB_DEBUG=0
```

> **LOCAL ONLY**: `app_tenant_pw`·`postgres` password는 docker-compose 전용. production은 Doppler·Supabase 자동 발급.

## 디렉토리

```
apps/spike-a/
├── docker-compose.yml
├── migrations/
│   ├── 001_roles.sql           # app_tenant_user·pgcrypto·broad grant 폐기
│   ├── 002_content_test.sql    # RLS + WITH CHECK + 명시 GRANT
│   ├── 003_audit_log.sql       # append-only 두 층 (GRANT + RLS)
│   └── 004_invariant_log.sql   # REVOKE ALL FROM app_tenant_user
├── src/
│   ├── db.ts                   # 3 connection + idle/connect timeout + debug
│   ├── fixtures.ts             # INSTANCE_A·B 상수 (side effect 없음)
│   ├── errors.ts               # errorMessage(unknown) helper
│   ├── tenant.ts               # withTenantTransaction + ScopedDb brand + assertScopedDb
│   ├── service-role.ts         # withServiceRole + assertBreakGlassAllowed + 1:1 audit
│   ├── schema.ts·migrate.ts·seed.ts
│   └── scenarios/
│       ├── test-read.ts·test-write.ts·test-rollback.ts·test-nested-tx.ts
│       ├── test-audit.ts·test-negative.ts·test-invariant-runner.ts·test-perf.ts
└── scripts/wait-db.js
```

## 다음 단계

1. Day 1~2 local PASS 결과 보고 → Day 9 Supabase Pooler provider smoke
2. provider profile 추가 (`apps/spike-a-provider/` 또는 .env.staging) — Day 9
3. PASS 시: prototype 코드는 archive → 본 구현은 `packages/db`·`packages/core-data-model`로 격상
