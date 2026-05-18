# Spike B — Worker control-plane queue + tenant-plane processing

> **상태**: prototype **v0.2 LOCAL_PASS candidate** (codex 1차 비평 13 지적 반영)
> **상위 결정**: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike B
> **LOCAL ONLY**: 본 prototype의 secret은 docker-compose 전용

## v0.2 핵심 변경 (SPIKEB1 정정)

- outbox UNIQUE 전체 (completed 포함·replay 차단) — SPIKEB1-003
- permanent_alert table + UNIQUE(outbox_id, alert_type) — SPIKEB1-004
- provider_attempt_log table — attempted vs accepted 분리 (실제 HTTP idempotency-key 모델) — SPIKEB1-006
- worker: provider call을 tenant commit 후 별도 step — SPIKEB1-002
- failure injection 10 point (after-provider-success-before-mark-completed 신규)
- failure injection harness — outer try-catch로 모든 point 흡수 (SPIKEB1-001)
- 동시 enqueue race test (Promise.all 20개·SPIKEB1-007)
- 신규 test-rls-mismatch (RLS WITH CHECK 음성·SPIKEB1-005)
- 미사용 변수 제거 (SPIKEB1-012)

## 가설

worker가 control-plane connection으로 outbox SKIP LOCKED claim 후 instance_id 추출 → tenant transaction으로 처리. **idempotent at-least-once with exactly-once observable effects** — DB row insert + 외부 side effect 모두 `UNIQUE(instance_id, source_event_id)` idempotency key로 중복 차단. crash 시 reconcile로 결과 일관성 유지.

## 통과 기준

| 검증 | 기준 |
|---|---|
| 100 outbox·5 worker | completed=100·inbox=100·foreign=0·duplicate=0 |
| idempotency | 동일 sourceEventId 2회 enqueue → inbox 1·external success 1·duplicate 0 |
| failure injection 10 point | crash 후 stale reclaim 또는 recovery worker로 최종 invariant 정합 |
| permanent alert | exhausted·permanent 각각 alert 1건 (UNIQUE outbox_id+alert_type) |
| provider attempted vs accepted | attempted-success는 다수 가능·accepted-success는 source_event_id당 1번 |
| rls-mismatch | instance A context에서 instance B insert/update → WITH CHECK reject |
| stale reclaim | 10분 threshold 전 no-job·0ms threshold reclaim 정상 |
| retry·exhausted·permanent | transient eventual success / exhausted / permanent 각각 정확한 상태 전이 |
| no-cross-tenant | 100 outbox·5 worker·foreign instance write 0 |
| invariant runner | 1000 jobs × 10 workers × 5 runs — 모든 run에서 invariant PASS |

## 디렉토리

```
apps/spike-b/
├── docker-compose.yml          # postgres 16 (5434 — Spike A 5433과 충돌 회피)
├── migrations/
│   ├── 001_roles.sql           # app_tenant_user·pgcrypto
│   ├── 002_outbox.sql          # control-plane·SKIP LOCKED·full UNIQUE (completed 포함·replay 차단)
│   ├── 003_inbox.sql           # tenant-plane·RLS WITH CHECK·UNIQUE(instanceId, sourceEventId)
│   ├── 004_external_call_log.sql  # 통계용 사후 dedupe
│   ├── 005_invariant_log.sql
│   ├── 006_permanent_alert.sql # UNIQUE(outbox_id, alert_type) — SPIKEB2-004
│   └── 007_provider_attempt_log.sql  # attempted vs accepted 분리 — SPIKEB1-006
├── src/
│   ├── db.ts·tenant.ts·errors.ts·fixtures.ts
│   ├── outbox.ts                # enqueue·claimNextOutbox·markCompleted·markTransientFail·markFailedPermanent
│   ├── fake-provider.ts         # callFakeProvider + getProviderAttemptStats
│   ├── failure-injection.ts     # 10 point + InjectedFailureError
│   ├── worker.ts                # processOneJob + runConcurrentWorkers + recordPermanentAlert
│   ├── migrate.ts·seed.ts
│   └── scenarios/
│       ├── test-basic-100.ts·test-idempotency.ts·test-failure-injection.ts
│       ├── test-stale-reclaim.ts·test-retry-permanent.ts·test-no-cross-tenant.ts
│       ├── test-rls-mismatch.ts (SPIKEB1-005 신규)
│       └── test-invariant-runner.ts
└── README.md
```

## 실행

```bash
cd apps/spike-b
pnpm install
cp .env.example .env

pnpm up
pnpm migrate
pnpm scenario:all
# 또는 개별: pnpm scenario:basic 등

pnpm down
```

또는 root에서:
```bash
pnpm spike-b:up
pnpm spike-b:migrate
pnpm spike-b:all
pnpm spike-b:down
```

## 환경 변수

```
DATABASE_URL_SUPER=postgres://postgres:postgres@localhost:5434/spike_b
DATABASE_URL_TENANT=postgres://app_tenant_user:app_tenant_pw@localhost:5434/spike_b
INVARIANT_JOBS=1000
INVARIANT_WORKERS=10
INVARIANT_RUNS=5
BASIC_JOBS=100
BASIC_WORKERS=5
```

## 한계 (LOCAL_PASS only)

| 항목 | 한계 | 후속 |
|---|---|---|
| Spike A pgbouncer pooling | 본 Spike는 direct postgres connection만 사용 — pgbouncer transaction pooling 차이는 Spike A에서 검증 | Spike A·Day 9 |
| 외부 provider 실제 webhook | fake-provider는 in-process DB call. 실제 HTTP webhook·idempotency-Key 헤더 검증은 별도 | crm-sync 본 구현 |
| failure injection은 in-process throw | 실제 SIGKILL·OOM·network partition은 in-process 시뮬레이션의 한계 | 본 구현 chaos test |
