Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e29eb-f988-7640-a59b-785a9ffe4aa6
--------
user
# 자동 비평 의뢰 — `apps/spike-b/` v0.1 (1차)

## 컨텍스트

Phase 0 Spike B prototype 코드 1차 작성 완료. Spike A는 v1.0 LOCAL_PASS acceptance. Spike B는 Spike 계획 v1.0 § B 따라 구현:

핵심 가설:
- worker가 control-plane connection으로 outbox SKIP LOCKED claim → instance_id 추출 → withTenantTransaction tenant-plane 처리
- **idempotent at-least-once with exactly-once observable effects**:
  - outbox: 동일 (instance_id, source_event_id) active state 중복 enqueue 차단 (partial unique)
  - inbox: UNIQUE(instance_id, source_event_id) — 재처리 시 ON CONFLICT DO NOTHING
  - external_call_log: UNIQUE(instance_id, source_event_id) WHERE outcome='success' — 중복 success 차단
- stale lock reclaim·retry backoff·exhausted·failed-permanent 전이
- failure injection 9 point (8 originally + after-claim 분리)

통과 기준 (Spike B § B.3):
- 100 outbox·5 worker → completed=100·inbox=100·foreign=0·duplicate=0
- idempotency 시나리오
- failure injection 9 point — 각 point crash 후 reclaim/recovery로 최종 invariant 정합
- stale reclaim·retry·permanent
- no-cross-tenant
- 1000 jobs × 10 workers × 5 runs invariant runner

## 의뢰

prototype 코드를 Spike A 비평과 동일한 강도로 비평하라. 특히:

1. **SQL migration 정확성**:
   - 001_roles.sql: app_tenant_user NOBYPASSRLS·pgcrypto·GRANT 부재가 spec 정합?
   - 002_outbox.sql: status enum CHECK·partial unique active idempotency·claim/stale partial index·timing
   - 003_inbox.sql: RLS WITH CHECK·UNIQUE idempotency·outbox_id FK 미적용 (schema-per-tenant 시 깨질 수 있어 생략)
   - 004_external_call_log.sql: UNIQUE success partial·outcome CHECK
   - 005_invariant_log.sql: 측정 metadata table

2. **TS 코어**:
   - `outbox.ts` claim SQL: stale reclaim + SKIP LOCKED + attempts++가 한 transaction (sqlSuper.begin) 안에서 안전?
   - `outbox.ts` markTransientFail의 CASE expression — attempts vs max_attempts 비교 후 exhausted 전이 정확?
   - `worker.ts` processOneJob의 control vs tenant transaction 분리 — tenant transaction commit 후 markCompleted 사이 crash 시 idempotent recovery 보장?
   - `fake-provider.ts` 동일 source_event_id 동시 호출 race — SELECT idempotency check + INSERT 사이 race·unique violation 처리 정확?
   - `worker.ts` `runConcurrentWorkers` Promise.all 동시성·emptyConsecutiveStop 정책
   - `failure-injection.ts` 9 point 분류 정확? after-claim·before-permanent-alert·after-permanent-alert 의미

3. **시나리오 측정**:
   - test-basic-100: 100 outbox·5 worker — Promise.all로 진짜 동시? inbox foreign check 정확?
   - test-idempotency: completed 후 same sourceEventId enqueue 허용 — 의도? 운영 위험?
   - test-failure-injection: 각 point에서 expectedOutbox·expectedExt·expectedInbox 분류 정확? after-tenant-commit-before-mark-completed에서 inbox는 commit됐지만 outbox는 processing — 후속 worker가 stale reclaim 후 다시 처리 → inbox UNIQUE로 idempotent → outbox completed·inbox 1·external success 1 정합?
   - test-stale-reclaim: claim 후 즉시 10분 threshold no-job vs 0ms reclaim 검증
   - test-retry-permanent: maxAttempts=3·999 fail → exhausted 정확? maxAttempts 도달 시점이 attempts++ 후 vs before?
   - test-no-cross-tenant: RLS WITH CHECK가 worker code의 instance_id 매칭과 정합?
   - test-invariant-runner: 5 runs × 1000 jobs × 10 workers — 누적 invariant·시간 측정

4. **누락 시나리오**:
   - outbox idempotency 충돌 시점의 동시 enqueue race (2 worker가 동시에 동일 sourceEventId enqueue)
   - external_call_log success UNIQUE race (2 worker가 동시에 success 시도)
   - tenant transaction abort (RLS violation) 후 outbox state — markTransientFail 호출되는가?
   - tenant transaction 진행 중 connection drop·DB shutdown
   - 외부 call 시간 초과 (TransientProviderError 외 다른 timeout)

5. **production gap**:
   - 실제 외부 provider는 HTTP API — fake-provider DB call vs 실제 HTTP의 차이
   - idempotency-Key HTTP 헤더와 본 prototype DB UNIQUE 차이
   - pgbouncer transaction pooling (Spike A)와 본 Spike의 direct connection 차이
   - worker pool size·rate limit·backpressure

6. **코드 품질**:
   - TypeScript strict 호환성
   - 모든 catch에서 errorMessage helper 사용
   - resource cleanup·closeAll
   - logging 일관성
   - empty consecutive stop 정책 — race로 후속 작업이 들어와도 종료될 수 있음?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEB1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-b\` (대상 prototype)
- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (Spike A 패턴 참조)
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (Spike 계획 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`·`crm-sync.md`·`content-migration.md` (outbox SoT 패턴)
codex
요청하신 대로 코드 리뷰 관점으로 보겠습니다. 먼저 Spike B 구현과 SoT 문서를 병렬로 읽어 실제 코드와 계획의 차이를 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\notifications.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/spike-b' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\decisions\\PHASE0_WEEK1_SPIKES_DRAFT.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/spike-a' in C:\Users\assag\solution\website-exposure
 succeeded in 817ms:
apps/spike-a\tsconfig.json
apps/spike-a\package.json
apps/spike-a\docker-compose.yml
apps/spike-a\README.md
apps/spike-a\src\tenant.ts
apps/spike-a\src\service-role.ts
apps/spike-a\src\seed.ts
apps/spike-a\src\schema.ts
apps/spike-a\src\errors.ts
apps/spike-a\src\db.ts
apps/spike-a\src\fixtures.ts
apps/spike-a\src\migrate.ts
apps/spike-a\scripts\wait-db.js
apps/spike-a\migrations\002_content_test.sql
apps/spike-a\migrations\001_roles.sql
apps/spike-a\migrations\003_audit_log.sql
apps/spike-a\migrations\004_invariant_log.sql
apps/spike-a\pgbouncer\pgbouncer.ini
apps/spike-a\pgbouncer\userlist.txt
apps/spike-a\src\scenarios\test-write.ts
apps/spike-a\src\scenarios\test-rollback.ts
apps/spike-a\src\scenarios\test-read.ts
apps/spike-a\src\scenarios\test-pgbouncer-auth.ts
apps/spike-a\src\scenarios\test-perf.ts
apps/spike-a\src\scenarios\test-nested-tx.ts
apps/spike-a\src\scenarios\test-negative.ts
apps/spike-a\src\scenarios\test-invariant-runner.ts
apps/spike-a\src\scenarios\test-audit.ts

 succeeded in 842ms:
apps/spike-b\tsconfig.json
apps/spike-b\src\worker.ts
apps/spike-b\src\tenant.ts
apps/spike-b\src\seed.ts
apps/spike-b\src\errors.ts
apps/spike-b\src\db.ts
apps/spike-b\README.md
apps/spike-b\src\fixtures.ts
apps/spike-b\src\fake-provider.ts
apps/spike-b\src\migrate.ts
apps/spike-b\src\outbox.ts
apps/spike-b\package.json
apps/spike-b\docker-compose.yml
apps/spike-b\src\failure-injection.ts
apps/spike-b\src\scenarios\test-stale-reclaim.ts
apps/spike-b\src\scenarios\test-retry-permanent.ts
apps/spike-b\src\scenarios\test-no-cross-tenant.ts
apps/spike-b\src\scenarios\test-invariant-runner.ts
apps/spike-b\src\scenarios\test-idempotency.ts
apps/spike-b\src\scenarios\test-failure-injection.ts
apps/spike-b\src\scenarios\test-basic-100.ts
apps/spike-b\migrations\005_invariant_log.sql
apps/spike-b\migrations\004_external_call_log.sql
apps/spike-b\migrations\003_inbox.sql
apps/spike-b\migrations\002_outbox.sql
apps/spike-b\migrations\001_roles.sql

 succeeded in 887ms:
# Phase 0 Week 1~2 Spike 계획 — 5개 가설 검증 **(v1.0 acceptance)**

> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 1·minor 1 (SPIKE3-01 정정 완료. INFRA cleanup minor는 후속)

> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 결정**: 8 Feature spec v1.0·인프라 결정 v1.0
> **목적**: Phase 0 Week 1~2 안에 가장 위험한 기술 가정 5개 (A·B·C·D·E) 검증. provider smoke gate 포함. 통과 시 본 구현 진입·실패 시 Phase 0 scope 재조정
> **핵심 변경 (v0.2)**: 5 Spike 확장 (D·E 추가)·provider smoke gate·exactly-once → idempotent at-least-once with exactly-once observable effects·dependency graph·invariant 반복 검증·signed-url-issued AuditAction cascade

---

## Spike 공통 규약

### 0.1 prototype 범위·일정 (SPIKE1-16 — 10일로 확장)

| 일자 | Spike | 비고 |
|---|---|---|
| Day 1 (Mon) | A — DB·RLS 검증 | C-local 병행 가능 |
| Day 2 (Tue) | A — 쓰기 path·rollback·audit | |
| Day 3 (Wed) | B — outbox·worker control plane | A pass 후 진행 |
| Day 4 (Thu) | B — failure injection·idempotent at-least-once | |
| Day 5 (Fri) | C-local — minio·signing logic·prefix isolation | |
| Day 6 (Sat) | D — Drizzle Kit migration·deploy·shadow DB | |
| Day 7 (Sun) | E — Auth.js·resolveTenantContext·membership | |
| Day 8 (Mon Week 2) | C-provider — R2 staging IAM·credential·real presigned URL | provider smoke gate |
| Day 9 (Tue Week 2) | A-provider — Supabase Pooler transaction mode + RLS smoke | provider smoke gate |
| Day 10 (Wed Week 2) | **E-provider** — Vercel preview·Auth.js magic link callback·session persistence·tampering·403 matrix (SPIKE2-02) + 종합 보고서·v1.0 결정 갱신·Week 3~6 계획 분기 | provider smoke gate + dependency graph |

Buffer: Week 2 Day 11~14는 본 작업 (Phase 0 § 4.2 v0.3 일정).

### 0.2 통과·실패·invariant 측정 (SPIKE1-05 정정)

각 Spike는 다음 명시:
- **가설 (hypothesis)**·**실험 (experiment)**·**pass criteria**·**negative invariant 측정 방법**·**provider smoke 분리**·**실패 시 fallback + reversal blast radius**·**downstream unblock**

negative invariant 측정 표준 (SPIKE1-05):
- 1000 iterations × 20 concurrent requests (또는 동등 부하)
- 각 query에서 `pg_backend_pid`·`current_user`·`current_setting('app.current_instance_id')`·`result instance_id set` 기록
- invariant SQL: `SELECT COUNT(*) FROM result_log WHERE foreign_instance > 0` → 0건 (binary 검증)
- 성능은 별도 측정 (correctness pass와 분리 — SPIKE1-17)

### 0.3 provider smoke gate (SPIKE1-01·04 — 핵심 정정)

각 Spike는 **local + provider 2단계**:
- **local PASS**: docker-compose 환경에서 통과 (Day 1~7)
- **provider PASS**: 실제 provider (Supabase dev·R2 staging·Vercel preview·Auth.js production-like)에서 smoke 통과 (Day 8~9)

provider smoke 통과 전에는 **PASS with unresolved provider risk** 까지만 인정. v1.0 acceptance는 provider smoke 후.

### 0.4 신규 AuditAction cascade (SPIKE1-13·SPIKE2-04)

REVIEW_WORKFLOW § 10.2.1 cascade 완료:
- `signed-url-issued` — R2 signed URL 발급 추적
- `signed-url-revocation-requested` (SPIKE2-04 정정 — rename from `signed-url-revoked`) — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer URL). 운영자 revoke 요청 → 후속 credential rotation 또는 object key rotation으로 처리

### 0.5 DATA_MODEL C-23 cascade (SPIKE2-03)

`AdminUser.instanceMemberships`에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가 (v0.24). resolveTenantContext가 매 요청 검증.

---

## Spike A: Drizzle + RLS + tenant scoping (DB-only, Auth.js는 Spike E)

### A.1 가설 (SPIKE1-18 scope 정리)

> `withTenantTransaction(instanceId, fn)` 안에서 SET LOCAL이 RLS context를 전달하고, Drizzle ORM이 transaction 안에서 SELECT/INSERT/UPDATE/DELETE 모두 tenant 격리. rollback 후 context 누설 없음. service_role break-glass 사용은 `service-role-invoked` audit. audit_log는 read-RLS·append-only.

(Auth.js·resolveTenantContext는 Spike E로 분리 — SPIKE1-03·18)

### A.2 실험 시나리오 (SPIKE1-06·07 — 쓰기·audit 추가)

```
apps/spike-a/
├── docker-compose.yml
├── migrations/
│   ├── 001_roles.sql
│   ├── 002_content_test.sql        # RLS + WITH CHECK
│   ├── 003_audit_log.sql            # append-only · read RLS
│   ├── 004_test_invariant.sql       # invariant 검증용 view
├── src/
│   ├── db.ts
│   ├── tenant.ts                    # withTenantTransaction
│   ├── service-role.ts              # assertBreakGlassAllowed + audit
│   ├── test-read.ts                 # SELECT 격리
│   ├── test-write.ts                # INSERT/UPDATE/DELETE WITH CHECK
│   ├── test-rollback.ts             # rollback 후 context 검증
│   ├── test-nested-tx.ts            # nested tx·savepoint
│   ├── test-audit.ts                # service_role + audit read RLS
│   └── test-invariant-runner.ts     # 1000 iterations × 20 concurrent
```

시나리오:
1. 2 instance seed (각 5건)·SELECT 격리 검증
2. **INSERT WITH CHECK**: instance-a tx에서 `instance_id='instance-b'` insert → reject (1000회 반복)
3. **UPDATE WITH CHECK**: instance-a tx에서 instance-b row update 시도 → 0 rows affected (1000회 반복)
4. **DELETE WITH CHECK**: instance-a tx에서 instance-b row delete 시도 → 0 rows affected
5. **malformed UUID** for `app.current_instance_id` → query fail (예외 처리 검증)
6. **rollback 후 context 누설**: tx rollback 후 SET LOCAL 자동 해제 검증 → 새 tx 진입 전 direct query 0건
7. **nested transaction·savepoint**: savepoint 안에서 context 유지·rollback to savepoint 후 context 유지
8. **scopedDb runtime guard**: tx 밖 scopedDb 사용 시 throw (runtime guard)
9. **audit_log RLS**: instance-a tx에서 audit_log 조회 → 자신의 instance 행만·다른 instance metadata 미노출
10. **append-only**: audit_log UPDATE/DELETE 시도 → fail (CHECK 또는 RLS WITH CHECK)
11. **service_role break-glass**: 모든 row 보임 + `service-role-invoked` audit insert 1건
12. **invariant runner**: 1000 iterations × 20 concurrent — `SELECT COUNT(*) FROM result_log WHERE foreign_instance > 0` = 0건

### A.3 통과 기준 (SPIKE1-05·17 — invariant + 성능 분리)

| 검증 | 기준 (correctness) |
|---|---|
| SELECT 격리 | 1000 iter × 20 concurrent — foreign_instance row 0건 |
| INSERT/UPDATE/DELETE WITH CHECK | 1000 iter — cross-instance write 0건 성공 |
| rollback 후 context 누설 | 0건 |
| nested tx·savepoint | context 유지 |
| audit_log read 격리 | foreign instance metadata 미노출 0건 |
| audit_log append-only | UPDATE/DELETE 모두 fail |
| service_role audit | 사용 횟수 = audit insert 횟수 (1:1) |

| 성능 (분리·SPIKE1-17) | baseline |
|---|---|
| withTenantTransaction overhead | p50·p95 측정. baseline query 대비 overhead % 기록 |

### A.4 실패 시 대안 + reversal blast radius (SPIKE1-14)

| 실패 항목 | fallback | affected SoT docs | affected packages | data migration impact | schedule delta | owner |
|---|---|---|---|---|---|---|
| pgBouncer SET LOCAL leak | Supabase Pooler 사용·direct connection·connection-scoped role | INFRA v1.0 §1.1 RLS 실행 모델 | `packages/db` connection layer | 없음 | +3~5일 | solo |
| Drizzle SET LOCAL 비호환 | Kysely 또는 raw SQL adapter | INFRA v1.0 §2 stack | `packages/db` 전체 | schema dialect 검토 | +1주 | solo |
| RLS overhead p95 > 50ms | application-level scoping 주력·RLS 보조만 | INFRA v1.0 §1 전체 reversal·INFRA2-01 1차 결정으로 | `packages/db`·`scopedDb` lint·all feature repository | RLS migration 제거 | +2주 (Phase 0 재산정) | solo |
| service_role 격리 안 됨 | env 분리·connection string 분리 | INFRA v1.0 §1.2 service_role 정책 | runtime guard | 없음 | +2일 | solo |

### A.5 downstream unblock (SPIKE1-15)

- A PASS → `packages/db/scopedDb`·`withTenantTransaction`·Drizzle convention·lint rule·composite FK 적용
- A FAIL → Phase 0 scope 재산정 gate (Week 2 Day 10에 의사결정)

---

## Spike B: Worker control-plane + tenant-plane (SPIKE1-08·09·10)

### B.1 가설 (SPIKE1-08 정정)

> worker가 control-plane connection으로 outbox SKIP LOCKED claim 후 instance_id 추출 → tenant transaction으로 처리. **idempotent at-least-once with exactly-once observable effects** — DB row insert 외부 side effect(이메일·API·webhook)도 `UNIQUE(instanceId, sourceEventId)` idempotency key로 중복 차단. crash 시 reconcile로 결과 일관성 유지.

(exactly-once 가설 폐기 — SPIKE1-08)

### B.2 실험 시나리오 (SPIKE1-09·10 — failure injection·외부 call)

```
apps/spike-b/
├── migrations/
│   ├── 005_outbox.sql               # RLS 미적용 control-plane
│   ├── 006_inbox.sql                # RLS 적용 tenant-plane
│   ├── 007_external_call_log.sql    # fake provider call count
├── src/
│   ├── fake-provider.ts             # idempotency key 별 call count 기록
│   ├── claim.ts·process.ts·worker.ts
│   ├── failure-injection.ts         # 8 failure point
│   └── test-invariants.ts           # 1000 jobs × 10 workers × 20 runs
```

시나리오:
1. 100 outbox seed (50 instance-a·50 instance-b)
2. 5 worker 동시 처리·foreign instance write 0건
3. **idempotency**: 동일 sourceEventId 2회 enqueue → external call 1회·inbox row 1개
4. **failure injection 8 point**: claim 전/후·tenant insert 전/후·tenant commit 후 completed mark 전·retry schedule 전/후·permanent fail alert 전/후 — 각 지점 SIGKILL 시뮬레이션
5. 각 failure point의 expected state·reconcile invariant 측정
6. **외부 call count invariant**: fake-provider.callCount(sourceEventId) = 1 (1000 jobs × 10 workers × 20 runs)
7. retry backoff·exhausted·permanent 전이
8. stale lock reclaim (locked_at > 5분 → 다른 worker claim)
9. tenant transaction commit 후 control completed mark 전 crash → 재처리가 idempotent (inbox UNIQUE로 차단)

### B.3 통과 기준

| 검증 | 기준 |
|---|---|
| 100건 처리 (대량 100건) | duplicate inbox 0건·외부 call duplicate 0건·foreign instance 0건 |
| 1000 jobs × 10 workers × 20 runs invariant | foreign_instance=0·duplicate=0·missing=0 |
| failure injection 8 point | 모든 지점에서 reconcile invariant 통과 |
| 외부 call count | 각 sourceEventId에 대해 callCount = 1 (재처리 시도 발생해도 idempotency key로 차단) |
| stale lock reclaim | 5초 (테스트 단축) 후 재claim |
| permanent 전이 | maxAttempts 도달 시 정확히 1회 sink alert |

### B.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| SKIP LOCKED race | advisory lock per instance | worker SoT SQL 일부 재작성 |
| 2 transaction crash | reconcile worker (spec에 이미 명시) | feature spec 검증 |
| idempotency key 충돌 | sourceEventId 산정 규칙 재정의 | hash 패턴 cascade |
| 외부 call duplicate | provider별 idempotency-key header 강제 | 8 feature 외부 호출 패턴 재검토 |

### B.5 downstream unblock

- B PASS → outbox/retry base tables·worker service skeleton·notifications dispatch base·idempotency convention
- B FAIL → worker 패턴 재설계·notifications P0 subset 재정의

---

## Spike C: Cloudflare R2 — local + provider 분리 (SPIKE1-04·11·12)

### C.1 가설

> R2 (S3 호환) object key prefix isolation·server-only signed URL issuer·IAM PolicyDocument로 instance 격리. signed URL replay·method confusion·ListBucket·range request 우회 차단. TTL·refresh 정상 동작.

### C.2-local: minio signing logic 검증 (Day 5)

```
apps/spike-c-local/
├── docker-compose.yml              # minio
└── src/sign-url.ts·test-isolation.ts·test-replay.ts·test-method-confusion.ts
```

시나리오:
1. 2 instance × 5 object upload
2. instance-a로 instance-b prefix sign 시도 → tenant-check fail
3. **signature replay**: 동일 signed URL 1000회 재사용 — provider semantics 기록 (R2에서 별도 검증)
4. **method confusion**: GET signed URL로 PUT/DELETE 시도 → fail
5. **content-type/length 불일치**: PUT presign 시 content-type 강제 — 불일치 PUT 시도 → fail
6. **ListBucket prefix 차단**: instance-a credential로 instance-b prefix list → fail
7. **range request**: 허용 여부 결정 (decision: 허용 — large object streaming)
8. **URL log scrubbing**: audit log에 signed URL signature 저장 금지·prefix·objectKey만 저장

### C.3-local 통과 기준

| 검증 | 기준 (correctness) |
|---|---|
| prefix isolation | cross-instance 접근 시도 100% block |
| method confusion | 100% block |
| content-type 불일치 | 100% block |
| ListBucket | 100% block |
| URL audit log | signature 미저장 — log scrubber 검증 |

### C.4-provider: R2 staging IAM·real presigned (Day 8 — provider smoke gate)

| 검증 | 기준 |
|---|---|
| R2 IAM Condition | instance-a credential로 instance-b GetObject/ListBucket/PutObject/CopyObject 100% fail |
| 만료 status code | provider 실제 응답 code 기록 (401/403 — SPIKE1-11 정정) |
| auto refresh | 만료 60초 전 fresh URL 발급 동작 |
| cross-instance copy (import) | service_role만 가능 + `signed-url-issued` audit |

### C.5 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| R2 signed URL 동작 안 함 | Cloudflare Workers + R2 binding | INFRA3-03 Storage ADR 변경·일부 reversal |
| R2 IAM 미흡 | Supabase Storage로 reversal | INFRA3-03 reversal·3 feature blob storage 계약 재작성 |
| minio와 R2 동작 차이 큼 | C-provider만 권위·minio는 logic만 | C-local PASS 가치 약화·provider smoke 통과 필수 |

### C.6 downstream unblock

- C-local PASS → signing logic·tenant-check
- C-provider PASS → `packages/storage`·blobRef schema·upload/read API·asset-ingestion·search-visibility·content-migration storage 적용
- C FAIL → Storage ADR 재작성·Phase 1+ 영향

---

## Spike D: Drizzle Kit migration deploy (SPIKE1-02 신규 — P0)

### D.1 가설

> Drizzle Kit으로 RLS policy·custom role·partial unique index·CHECK constraint·composite FK·custom SQL migration 모두 생성·deploy 가능. dev→staging apply·rollback·shadow DB drift check·service_role migration runner audit 작동.

### D.2 실험 시나리오

```
apps/spike-d/
├── drizzle.config.ts
├── migrations/
│   ├── (Spike A에서 생성된 RLS·CHECK·partial unique 포함 — Drizzle Kit으로 재생성)
│   ├── 008_partial_unique.sql       # WHERE active=true unique
│   ├── 009_composite_fk.sql         # (instance_id, parent_id) FK
│   ├── 010_check_constraint.sql     # CHECK regex·enum
│   ├── 011_custom_sql_view.sql      # tenant-scoped view (audit_log read RLS)
├── src/
│   ├── migrate.ts                   # service_role + audit + advisory lock
│   ├── drift-check.ts               # shadow DB 비교
│   └── rollback.ts                  # forward-only hotfix 시나리오
```

시나리오:
1. Drizzle Kit으로 모든 spec table 패턴 (RLS·composite FK·partial unique·CHECK) migration 생성
2. dev DB apply → 성공
3. staging DB apply → 성공
4. **drift check**: production schema와 다르면 deploy fail (shadow DB 비교)
5. **advisory lock**: 동시 migration 시도 시 1개만 진행
6. **forward-only hotfix**: rollback 불가 migration (column drop) 발생 시 별도 ADR + super-admin 명시 승인
7. **migration audit**: `service-role-invoked` event with `serviceRoleFunction='migrationRunner'`
8. **expand/contract pattern**: column 추가 nullable → backfill → NOT NULL/drop old 3단계 시나리오

### D.2-artifact (SPIKE2-07)

Day 6 종료 시 반드시 남길 산출물:
- 생성된 SQL migration 파일들 (`migrations/008-011_*.sql`)
- dev·staging apply 성공 log
- drift failure sample (의도적 schema drift 후 detect 검증)
- expand/contract 3단계 예시 migration

### D.3 통과 기준

| 검증 | 기준 |
|---|---|
| RLS·CHECK·partial unique·composite FK migration 생성 | Drizzle Kit canonical 또는 raw SQL escape hatch 사용 |
| dev/staging apply | 100% 성공 |
| drift check | production과 다른 schema 100% detect |
| advisory lock | 동시 migration 시 1개만 진행 |
| migration audit | 모든 migration `service-role-invoked` insert 1건 |
| expand/contract 3단계 | 운영 무중단 (web/worker 다른 deploy timing) |

### D.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| Drizzle Kit RLS policy 생성 불가 | raw SQL migration mixin | migration tooling 약간 복잡·관리 비용 |
| advisory lock 미동작 | external lock (Redis SETNX) | migration runner 재설계 |
| shadow DB 비용 큼 | linting-based drift check만 | drift detection 약화 |

### D.5 downstream unblock

- D PASS → Week 3~4 M0 vertical slice schema migration 진행
- D FAIL → migration tooling 재선택 (Atlas·db-mate·dbmate 등)·Phase 0 scope 재정의

---

## Spike E: Auth.js + resolveTenantContext + membership (SPIKE1-03 신규 — P0)

### E.1 가설

> Auth.js (next-auth) magic link로 로그인·session 생성·next request에서 `resolveTenantContext(session, requestedInstanceId)` 호출 → instanceMembership·active·role·legal eligibility 검증 → `app.current_instance_id` set. client-supplied `requestedInstanceId` tampering 차단. membership 제거·deactivation 후 next request 즉시 403. super-admin instance switch audit.

### E.2 실험 시나리오

```
apps/spike-e/
├── (Auth.js + Drizzle adapter + magic link via Resend mock)
├── migrations/
│   ├── 012_admin_user.sql           # AdminUser + instanceMemberships
├── src/
│   ├── tenant-context.ts            # resolveTenantContext
│   ├── auth-middleware.ts           # next.js middleware
│   └── test-scenarios.ts
```

시나리오:
1. 사용자 A 로그인 (magic link)·session 생성
2. instanceMembership: A는 instance-a operator
3. `requestedInstanceId='instance-a'` 요청 → 통과·withTenantTransaction 진입
4. `requestedInstanceId='instance-b'` 요청 (A는 instance-b 미멤버) → 403
5. **client tampering**: 요청 헤더·쿠키 조작으로 instance-b 시도 → server-side resolveTenantContext가 membership 검증·차단
6. **membership 제거 후 next request**: A의 instance-a membership active=false → 다음 요청 403 (session expiry 안 기다림)
7. **inactive user**: A.active=false → 모든 요청 403
8. **super-admin instance switch**: super-admin이 instance-a → instance-b 전환 → `instance-switched` audit insert
9. **legal-reviewer eligibility**: legal-reviewer 후보가 자격 미충족 → 차단
10. **session refresh**: 매 요청 server-side 검증 (session expiry 안 기다림)

### E.2-provider: Vercel preview + Auth.js production-like (Day 10 — SPIKE2-02 신규)

| 검증 | 기준 |
|---|---|
| Vercel preview 환경 magic link callback | 1회 round-trip 성공 |
| Auth.js secure cookie + SameSite | production-like 환경에서 정상 설정 |
| Drizzle adapter session persistence | Supabase dev DB에 session row 저장·새 request에서 복원 |
| requestedInstanceId tampering | server-side 100% block |
| membership active=false 후 next request | 즉시 403 (session expiry 안 기다림) |
| Day artifact (SPIKE2-07) | preview smoke report + 403 matrix + session DB row 증거 (스크린샷 또는 SQL dump) |

### E.3 통과 기준

| 검증 | 기준 |
|---|---|
| Authorized request | 100% 통과 + RLS set |
| Unauthorized request (non-member) | 100% 403 |
| client tampering | 100% server-side reject |
| membership 제거 후 next request | 즉시 403 (session refresh 없이) |
| inactive user | 100% 403 |
| instance-switched audit | super-admin 전환 1회 = audit insert 1건 |
| legal-reviewer eligibility | 100% 검증 |

### E.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| Auth.js Drizzle adapter 호환 안 됨 | Lucia·Better-Auth로 전환 | INFRA 결정 v1.0 §2 stack reversal |
| session refresh latency 큼 | session cache + invalidation token | Auth.js 추가 정책 |
| instanceMembership 검증 query 비용 큼 | scoped index·또는 short-cache | acceptable trade-off |

### E.5 downstream unblock

- E PASS → `packages/auth`·`resolveTenantContext`·admin UI middleware·session 패턴
- E FAIL → Auth provider 변경·Phase 0 Week 2~3 일정 영향

---

## Spike F (P1·Week 2~3 후속): Secrets/env propagation

지연 가능 — 본 spike 통과 못 해도 Phase 0 진행 가능. 단 Phase 1 시작 전 완료.

목표: Doppler → Vercel·Railway·Supabase·R2·Sentry·Resend·Upstash env 전파·환경 분리·secret rotation.

## Spike G (P1·Phase 1 ADR): Customer domain·Cloudflare for SaaS

Phase 1 시작 전 ADR 별도. v1.0 Spike 단계에서는 미진행.

---

## 종합 dependency graph + partial state matrix (SPIKE1-15·SPIKE2-05)

### Spike 상태 분류

| 상태 | 의미 |
|---|---|
| `LOCAL_PASS` | 로컬 docker-compose 환경에서 통과 |
| `PROVIDER_PASS` | 실제 provider 환경 (Supabase dev·R2 staging·Vercel preview)에서 통과 |
| `PROVIDER_FAIL` | local은 통과했으나 provider에서 실패 |
| `INCONCLUSIVE` | local·provider 모두 미통과 또는 검증 부족 |

### Week 3~6 작업 unlock/hold 규칙

| Spike 상태 | Week 3-6 unlock | Week 3-6 hold |
|---|---|---|
| A `PROVIDER_PASS` | Week 3-4 schema·scopedDb·composite FK·M0 schema migration·lint rule | — |
| A `LOCAL_PASS·PROVIDER pending` | Week 3 schema migration (local·staging) | Week 4 production-readiness·prod deploy hold |
| A `PROVIDER_FAIL` | — | 전체 Phase 0 scope 재산정 gate |
| B `LOCAL_PASS` | Week 4-5 outbox base·worker skeleton·notifications dispatch base | — |
| B `INCONCLUSIVE` | — | worker 패턴 재설계 — notifications P0 subset 재정의 |
| C `PROVIDER_PASS` | Week 5+ packages/storage·blobRef·feature blob 적용·asset-ingestion·search-visibility·content-migration storage |
| C `LOCAL_PASS·PROVIDER FAIL` | local prototype은 진행 | Storage ADR 재작성·Supabase Storage reversal 검토 hold·R2 production 미적용 |
| D `LOCAL_PASS` | Week 4 M0 vertical slice migration 진행 |
| D `INCONCLUSIVE` | — | migration tooling 재선택 (Atlas·db-mate)·Phase 0 scope 재정의 |
| E `PROVIDER_PASS` | Week 6 admin UI middleware·login flow·session 관리 |
| E `LOCAL_PASS·PROVIDER pending` | UI 컴포넌트·DESIGN_TOKENS는 진행 가능 | **admin UI middleware·login flow hold** until E provider gate |
| E `PROVIDER_FAIL` | — | Auth provider 변경 (Clerk·Lucia·Better-Auth)·INFRA §2 stack reversal |

### 의사결정 매트릭스 (Day 10 종합 보고서)

| 상태 조합 | Week 3 즉시 진행 가능 | Hold 필요 | 결정 doc 갱신 |
|---|---|---|---|
| A PROVIDER_PASS + D LOCAL_PASS + B LOCAL_PASS + C/E provider pending 또는 LOCAL_PASS (SPIKE3-01 정정) | Week 3 schema/migration·worker skeleton·UI 컴포넌트 | Week 4 production-readiness·Storage 적용·admin login flow until provider gate | minor |
| 모두 PROVIDER_PASS | Week 3~6 전부 | — | minor |
| A 또는 D FAIL | — | 전체 Phase 0 재산정 | major (INFRA v1.0 reversal) |

---

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성·3 Spike (A/B/C) |
| 2026-05-15 | v0.2 | codex 1차 비평 18 지적 전건 수용 |
| 2026-05-15 | v0.3 | codex 2차 비평 7 지적 전건 수용 |
| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정**. SPIKE3-01 Day 10 의사결정 매트릭스 D LOCAL_PASS 정정 (D는 local-only gate). SPIKE3-02 INFRA 요약부 cleanup은 후속 (minor). **3 cycle 누계 27 지적 전건 수용** (SPIKE1: 18 + SPIKE2: 7 + SPIKE3: 2). SoT cascade 완료: INFRA §4.1·4.2·REVIEW_WORKFLOW AuditAction 4종·DATA_MODEL C-23 v0.24 |
| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
| 2026-05-15 | (v0.2 이전 비고) | codex 1차 비평 18 지적 전건 수용: (1) **provider smoke gate** — local + provider 2단계 분리 (SPIKE1-01·04), (2) **Spike D 신설** — Drizzle Kit migration deploy (SPIKE1-02), (3) **Spike E 신설** — Auth.js + resolveTenantContext + membership invalidation (SPIKE1-03), (4) **invariant 측정 표준화** — 1000 iterations × 20 concurrent + invariant SQL binary 검증 (SPIKE1-05), (5) **A 쓰기 path·rollback·nested tx·audit_log RLS 시나리오 추가** (SPIKE1-06·07), (6) **B 가설 정정** — idempotent at-least-once with exactly-once observable effects (SPIKE1-08), (7) **B failure injection 8 point + 외부 call count invariant** (SPIKE1-09·10), (8) **C TTL 상태 코드 정정** — 401 → 403 (provider semantics·SPIKE1-11), (9) **C security 시나리오 확장** — replay·method confusion·ListBucket·content-type·URL scrubbing (SPIKE1-12), (10) **REVIEW_WORKFLOW cascade** — `signed-url-issued`·`signed-url-revoked` AuditAction 2종 추가 (SPIKE1-13), (11) **fallback에 reversal blast radius 명시** (SPIKE1-14), (12) **Week 3~6 dependency graph** (SPIKE1-15), (13) **일정 7일 → 10일** (Week 1 + Week 2 Day 8~10·SPIKE1-16), (14) **성능 기준 correctness와 분리** (SPIKE1-17), (15) **A/B scope 명확화** — A는 transaction/RLS·B는 queue/crash (SPIKE1-18), (16) Spike F·G P1·후속 명시 |

 succeeded in 918ms:
# Feature — notifications

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 7개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 11 / `docs/admin/REVIEW_WORKFLOW.md` § 9
> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
> **외부 공유 시 주의**: 상위 문서와 동일. 수신자 식별 정보·이메일 주소·Slack webhook URL 노출 주의.
> **연관 문서**:
> - 이벤트 enum·페이로드·이벤트별 정책 매트릭스(fallback 채널 포함) SoT → `admin/REVIEW_WORKFLOW.md` § 9
> - audit log enum(`notification-dispatched`·`notification-resend-attempted`·`notification-read`) → `admin/REVIEW_WORKFLOW.md` § 10
> - 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT → `core/DATA_MODEL.md` C-08
> - AdminUser·자격·알림 선호·suppression(autoReleaseAt) SoT → `core/DATA_MODEL.md` C-23
> - 운영시간 SoT → `core/DATA_MODEL.md` C-21 LocationProfile + CT-02 BusinessHours

---

## 0. 한 페이지 요약

- **Feature 식별자**: `notifications`
- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
- **dedupe Redis SET NX EX**: 채널별 dedupe는 `SET key value NX EX <ttl>` 원자 연산. 선기록 성공 worker만 provider 호출. 실패 worker는 `deduped` (§ 4.3)
- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
- **Slack broadcast**: AdminUser.slackUserId 미보유 시 — broadcast 1건 (envelope 단위)·dedupeKey sentinel `"broadcast"`. per-recipient placeholder는 `skipped-broadcast-only` (집계 대상 아님)
- **인벤토리**: DB **11 tables** (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt) + Redis 1 keyspace (DedupeCache)

---

## 1. 일반 규약

### 1.1 변경 정책

**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
| `DeliveryStatus` enum 변경 | **MAJOR** | 별개 | |
| **§ 9.1.1 매트릭스 의미 변경** (수신자·채널·criticality 등) | MINOR (append-only 시) / MAJOR (기존 version 의미 변경) | **policyVersion 신규 부여** | 패키지는 신규 + 기존 version 병렬 보관 (§ 4.2). 인스턴스 manifest opt-in |
| § 14 데이터 구조 변경 | MINOR (append-only) / MAJOR (semantic) | 별개 | DB 마이그레이션 동반 |
| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
| dedupe key 알고리즘 변경 | **MAJOR** | 별개 | |
| 재시도 분류표(§ 7.1) 변경 | MINOR | 별개 | |
| 운영 지표 항목 추가 | PATCH | 별개 | |

**매트릭스 정합 운영(병렬 보관 SoT)**: § 9.1.1 매트릭스가 변경되면 본 Feature 패키지에 **새 policyVersion을 추가하고 이전 버전도 병렬 보관**. 인스턴스는 InstanceManifest.config.`notificationPolicyVersion`이 명시한 버전을 사용. 롤백은 manifest의 version만 이전 값으로 변경 (§ 4.2). 운영 배포 순서: 매트릭스 SoT 갱신 → 패키지에 새 version 추가 + 이전 보관 → 인스턴스 manifest 갱신 (opt-in).

### 1.2 SoT 원칙

- 이벤트 enum·페이로드 타입·이벤트별 정책 매트릭스(fallback·criticality·quietHoursPolicy·optOutPolicy) SoT는 `admin/REVIEW_WORKFLOW.md` § 9
- 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT는 `core/DATA_MODEL.md` C-08
- AdminUser·자격·알림 선호·suppression SoT는 `core/DATA_MODEL.md` C-23
- audit log enum SoT는 `admin/REVIEW_WORKFLOW.md` § 10.2.1
- 운영시간 SoT는 `core/DATA_MODEL.md` C-21·CT-02
- 본 문서 = **발송 구현·운영 SoT** + **본 Feature 내부 데이터 구조 SoT** (§ 14)

### 1.3 본 문서가 다루지 않는 영역

- 알림을 발생시키는 워크플로 트리거 — `admin/REVIEW_WORKFLOW.md` § 2·§ 6
- 이벤트 enum·페이로드 필드·정책 매트릭스 — `admin/REVIEW_WORKFLOW.md` § 9
- 사용자 자격 인증 — `admin/REVIEW_WORKFLOW.md` § 11.2 + DATA_MODEL C-23 `eligibilityEvidence`
- 이메일 템플릿 시각 디자인 — `core/DESIGN_TOKENS.md` (NT-05)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "notifications"
specVersion: "1.0"               # 본 문서 명세 버전 (안정판)
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: true
```

> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
| `admin/REVIEW_WORKFLOW.md` § 11 | AdminUserRole·ApproverRole·자격 검증 |
| `core/DATA_MODEL.md` C-08 | `notificationChannels`·`adminBaseUrl`·`timezone`·`holidayCalendar`·features[] |
| `core/DATA_MODEL.md` C-23 | AdminUser·NotificationPreferences·suppression(autoReleaseAt) |
| `core/DATA_MODEL.md` C-21·CT-02 | LocationProfile(`@id="main"` 관례) + BusinessHours·SpecialClosure·LunchBreak |

### 2.3 InstanceManifest 통합

```yaml
adminBaseUrl: "https://admin.client-01.glitzy.kr"
timezone: "Asia/Seoul"

holidayCalendar:                                       # § 8.4 — clientApproverBusinessHoursAware=true 시 required
  region: "KR"
  source: "package-embedded"

notificationChannels:
  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
  inApp: { enabled: true }

features:
  - name: "notifications"
    version: "0.4.0"
    enabled: true
    config:
      notificationPolicyVersion: "9.1.1-2026-05-14"  # § 4.2 병렬 보관 SoT
      digestSchedule: { daily: "09:00", weekly: "MON 09:00" }
      dedupeWindowSeconds: 60
      retryMaxAttempts: 3
      retryBackoffSeconds: [30, 300, 1800]
      ctaRouteTemplates:
        Article: "/admin/content/article/{contentRef}"
        TreatmentPage: "/admin/content/treatment/{contentRef}"
        LegalDocument: "/admin/legal/{contentRef}"
        default: "/admin/content/{contentType}/{contentRef}"
      clientApproverBusinessHoursAware: true
      businessHoursReference: "openingHours"
      logRetentionDaysAfterDlqExpiry: 90
      receiptRetentionDays: 365                        # § 4.3 — sourceEventId 재사용 차단 기간 (dedupeWindow ≪ receipt retention)
      suppression:
        softSuppressionThreshold: 3
        softSuppressionAutoReleaseDays: 14            # C-23 autoReleaseAt 계산 (§ 7.4 worker)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 입력 — NotificationEvent

REVIEW_WORKFLOW § 9.2 SoT. 핵심:

- `sourceEventId` — idempotency key (필수)
- `recipients[]` — 비어 있으면 fail
- `criticality` 미지정 시 본 Feature가 § 9.1.1에서 자동 산정
- `metadata.locationRef` — multi-location 인스턴스 권장 (§ 8.4)
- recipient의 AdminUser `instanceMemberships[]`에 본 인스턴스 미포함 시 → `skipped-missing-user` (§ 4.1 4.a — instance membership 검증)

### 3.2 출력 — DeliveryResult·DeliveryStatus

```ts
type DeliveryResult = {
  eventId: string;
  sourceEventId: string;
  eventType: NotificationEventType;
  contentRef: string;
  receiptState: ReceiptState;
  acceptedAt: ISODateString;
  perRecipient: Array<{
    recipientId: string;
    deliveries: Array<{
      payloadId: string;
      channel: "email" | "slack" | "inApp";
      deliveryMode: "perRecipient" | "broadcast-placeholder";
      broadcastAttemptId?: string;     // broadcast-placeholder인 경우 실제 broadcast attempt id 참조
      status: DeliveryStatus;
      attempts: number;
      lastAttemptAt: ISODateString;
      provider?: string;
      providerResponseCode?: string;
      error?: string;
    }>;
  }>;
  broadcastDeliveries?: Array<{
    broadcastAttemptId: string;        // envelope+channel 단위 1건
    channel: "slack";
    status: DeliveryStatus;
    attempts: number;
    lastAttemptAt: ISODateString;
    provider?: string;
    providerResponseCode?: string;
    error?: string;
  }>;
};

type ReceiptState = "accepted" | "processing" | "completed" | "failed";

type DeliveryStatus =
  | "delivered"
  | "deferred-digest"
  | "deferred-quiet-hours"
  | "deferred-business-hours"
  | "deferred-rate-limit"
  | "failed-permanent"
  | "failed-retrying"
  | "deduped"
  | "skipped-missing-user"           // AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함
  | "skipped-disabled-channel"
  | "skipped-opt-out"
  | "skipped-suppressed"
  | "skipped-missing-location"       // metadata.locationRef가 InstanceManifest에 없는 ID — § 8.4 invalid locationRef
  | "skipped-broadcast-only";        // per-recipient placeholder — 집계 대상 아님

// 내부 attempt-level 상태 — DeliveryAttempt.status에만 사용 (외부 DeliveryStatus와 분리, N5-03)
type DeliveryAttemptStatus =
  | "processing"                      // attemptNumber 선점 후 provider 호출 전 (§ 4.4)
  | DeliveryStatus;
```

**DeliveryResult 소비 규칙** (REVIEW_WORKFLOW·운영 UI 정합):
- 성공/실패 집계는 `broadcastDeliveries[]`(broadcast 모드) + `perRecipient[].deliveries[]`(`skipped-broadcast-only` 제외)를 합산
- `skipped-broadcast-only`는 per-recipient 추적 placeholder만 — `broadcastAttemptId`로 실제 broadcast 결과 참조 가능
- `deferred-rate-limit`·`deferred-*`·`skipped-*`·`deduped`는 발송 성공율 분모 제외 (§ 9.1)

### 3.3 단일 엔트리포인트 — `notify()`

```ts
async function notify(event: NotificationEvent): Promise<DeliveryResult>
```

**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
- 1단계 단일 DB 트랜잭션 (immediate FK — Receipt.notificationLogId는 같은 트랜잭션에서 먼저 insert된 Log를 참조하므로 deferred FK 불필요):
  1. NotificationLog insert (UUID 생성)
  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
  3. Receipt insert 성공 시 트랜잭션 commit → receiptState="accepted"
- **abort 원인 분기** (N4-01):
  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
- **duplicate caller 결과 계약** (N4-02): 기존 receipt의 receiptState별 응답:
  - `receiptState="completed"` → 완성 DeliveryResult 반환
  - `receiptState="accepted"` 또는 `"processing"` → 짧은 poll(최대 500ms, 100ms 간격) 후 completed면 완성 결과, 미완성이면 `receiptState="processing"`로 부분 DeliveryResult 반환 (호출자가 후속 query 가능)
  - `receiptState="failed"` → 마지막 실패 결과 반환
- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제

**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)

**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)

---

## 4. 발송 파이프라인

### 4.1 실행 순서 (critical-aware filter ordering)

```
1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
   - NotificationLog insert (UUID 생성)
   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
   - **abort 원인 분기** (N5-02·§ 3.3 정합):
     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음

2. fan-out + NotificationPayloadRecord 영속:
   - recipients[] 각각 payloadId(UUID) 부여
   - ctaUrl 자동 합성
   - criticality 미지정 시 § 9.1.1 매트릭스 산정
   - NotificationPayloadRecord 저장 (payloadId·eventId·recipientId·contentRef·ctaUrl·metadata·criticality — channel별 추적은 DeliveryAttempt가 담당, PayloadRecord는 recipient-envelope unit)
   - receiptState="processing"

3. 즉시 채널 라우팅 — § 9.1.1 매트릭스:
   - immediateChannels(매트릭스) ∩ InstanceManifest.notificationChannels.<channel>.enabled=true
   - digest 채널은 § 6 별도 경로

4. critical-aware 필터 (순서 중요):
   a. **항상 적용** (critical 우회 불가):
      - AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`
      - 인스턴스 채널 비활성 → `skipped-disabled-channel`
      - dedupe 매칭 (§ 4.3 Redis SET NX EX) → `deduped`
   b. **사용자 opt-out 필터** (mandatory 우회):
      - matrix.optOutPolicy="mandatory" → opt-out 무시 + 사용자 채널 off 무시 (단 인스턴스 채널 활성 channel만)
      - 그 외 + AdminUser.notificationPreferences.channels.<channel>=false → `skipped-opt-out`
      - digest 채널 + AdminUser.digestOptOut=true (digestOptOut-allowed 정책) → `skipped-opt-out`
   c. **suppression 필터**:
      - C-23 suppression.<channel>.state ∈ {soft-suppressed, hard-suppressed} → 원 채널에 `skipped-suppressed` DeliveryAttempt 기록
      - 단 hard-suppressed인 채널 + 매트릭스 `fallback 채널` 컬럼이 정의되어 있으면 → **fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 함**(N4-07) 검증 후 라우팅 시도
      - **fallback 채널도 hard-suppressed인 경우** (N4-08): fallback 채널에도 별도 `skipped-suppressed` DeliveryAttempt 기록 + DeliveryAttempt.metadata에 `fallbackExhausted=true` 마킹 + 외부 monitoring sink alert. 호출자/운영 UI는 두 attempt를 보고 "원 채널·fallback 모두 막힘"을 추적 가능
   d. **criticality=critical은 e~f만 우회**:
      - **(e) quietHours** → `deferred-quiet-hours` (critical 우회 → 즉시 발송)
      - **(f) businessHours 평가** (§ 8.4 client-approver):
        - **(f-pre) invalid locationRef** (N5-04): `metadata.locationRef`가 InstanceManifest LocationProfile에 없는 ID → `skipped-missing-location` + 외부 monitoring sink alert. main fallback으로 보정하지 않음. critical 이벤트도 본 분기는 우회하지 않음 (runtime 입력 오류 감지)
        - (f-main) businessHours 외 → `deferred-business-hours` (critical 우회)
   e. high/normal은 e·f 모두 적용

5. 채널 어댑터 호출 (§ 5):
   - rate limit 평가 → 초과 시 `deferred-rate-limit`
   - 정상 → provider 호출
   - DeliveryAttempt 생성·갱신 (§ 14.4 — 동시성 안전 § 4.4)

6. 결과별 처리:
   - delivered → NotificationLog summary 갱신
   - failed-retrying → 재시도 큐
   - failed-permanent → DLQ 저장 (§ 7.2) + suppression 갱신(§ 7.1) + 외부 sink alert
   - deferred-digest → NotificationDigestBucket (§ 14.6·14.7)
   - deferred-quiet-hours → NotificationQuietHoursQueue (§ 14.8)
   - deferred-business-hours → NotificationBusinessHoursQueue (§ 14.9)
   - deferred-rate-limit → 채널별 rate limit 큐

7. receiptState="completed" + audit log `notification-dispatched` (envelope 1건)
```

### 4.2 매트릭스 병렬 보관 — notificationPolicyVersion

- 본 Feature 패키지는 매트릭스(§ 9.1.1)를 **policyVersion별 병렬 보관**
- 패키지 빌드 시 매트릭스 SoT의 hash + version 메타 포함
- 인스턴스 manifest의 `notificationPolicyVersion`이 명시한 버전을 런타임에 라우팅
- 빌드 검증(§ 11): manifest version이 본 Feature 패키지에 등록된 version 중 하나여야 함 (불일치 fail)
- 매트릭스 변경 운영:
  - REVIEW_WORKFLOW § 9.1.1 갱신 → 본 Feature 패키지에 새 policyVersion 추가 (이전 버전도 보관) → 인스턴스 manifest의 `notificationPolicyVersion` 갱신 (opt-in)
  - 롤백: manifest version을 이전 값으로 변경 (패키지 변경 없음)
- **보관 정책** (N4-10):
  - **최소 지원 기간**: 1 policyVersion당 12개월 (사용 인스턴스 0건 이후에도)
  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여

### 4.3 dedupe 알고리즘 (Redis SET NX EX 원자)

```
dedupeKey:
  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
  broadcast 모드: recipientId 위치에 sentinel "broadcast" 사용
    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}

저장소: Redis (§ 14.10)

원자 연산: SET key value NX EX <ttl>
  - 성공(키 생성) → worker가 provider 호출 진행
  - 실패(키 존재) → DeliveryAttempt status=deduped 기록, provider 호출 생략

값 구조: { state, payloadId, attemptedAt }
state 머신:
  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
  - delivered → SET XX EX "delivered" (dedupeWindowSeconds)
  - failed-permanent → SET XX EX "failed-permanent" (dedupeWindowSeconds) — 재시도 자동 차단

수동 resendDeadLetter:
  - dedupe key 검사 우회 + dedupe key 갱신하지 않음
  - 별도 attempt(dedupeMode="resend") 생성. 기존 dedupe TTL 자연 만료

sourceEventId 재사용:
  - dedupeWindowSeconds(기본 60초) << receiptRetentionDays(기본 365일)
  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
  - receipt 보존 기간 만료 후 재사용은 새 이벤트로 처리됨 — 운영 정책상 sourceEventId 재사용 금지 권장
```

### 4.4 rate limiting·DeliveryAttempt 동시성

**rate limiting**:
- 채널별 시간당 한도: C-08 `rateLimitPerHour`
- 초과 → `deferred-rate-limit` + 채널별 rate limit 큐. 다음 윈도우 재시도
- 메트릭 제외: § 9.1 성공율·실패율 계산 분모에서 제외

**DeliveryAttempt attemptNumber 동시성** (multi-worker race 방지 — N4-04·05·06):
- attemptNumber는 `(payloadId, channel)` 범위 sequence (PayloadRecord에 channel 필드 없음 — lock 대상은 PayloadRecord row 자체이고 channel은 query 조건)
- **운영 SoT lock 메커니즘**: PostgreSQL advisory lock `pg_advisory_xact_lock(hash(payloadId, channel))` (다른 DBMS는 동등한 named lock — 운영 결정 NT-17)
- **provider 호출은 lock·DB transaction 밖에서 진행** — lock 시간 최소화·deadlock·connection pool 고갈 방지:
  ```
  1. 짧은 transaction 시작
  2. advisory lock acquire (hash(payloadId, channel))
  3. SELECT MAX(attemptNumber)+1 FROM NotificationDeliveryAttempt WHERE payloadId=? AND channel=?
  4. INSERT NotificationDeliveryAttempt (status="processing", attemptNumber=max+1, ...)
  5. transaction commit (lock 자동 해제)
  6. 별도 비-트랜잭션 영역에서 provider 호출
  7. 별도 transaction에서 attempt UPDATE (status=delivered/failed-*, providerResponseCode, ...)
  ```
- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
- **resendDeadLetter도 동일 메커니즘** — attemptNumber sequence 통합 관리

---

## 5. 채널 어댑터

### 5.1 email

- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
- 템플릿: Markdown → HTML, BrandTokens(C-07) (NT-05 운영)
- 본문 필수: 이벤트 제목·콘텐츠 제목·CTA 버튼·발신자/Reply-To
- 실패 분류: § 7.1 표 → suppression 갱신 자동

### 5.2 Slack (per-recipient vs broadcast 모드)

- C-08 webhookUrlSecretRef
- 포맷: Slack Block Kit

**per-recipient 모드** (slackUserId 보유):
- mention(`<@U12345>`) 포함
- DeliveryAttempt: `deliveryMode="perRecipient"` + `recipientId`
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
- 일반 필터(dedupe·opt-out·quietHours·suppression) 정상 적용

**broadcast 모드** (slackUserId 미보유, recipients 중 1명 이상):
- 매트릭스 immediateChannels에 slack 포함 + `criticality=critical` 이벤트만 허용. 그 외는 broadcast 미발송
- **broadcast 데이터 모델** (N4-14·N4-15·N4-16):
  - **NotificationPayloadRecord 1건 생성** — envelope+channel 단위 (recipientId=NULL). § 14.3 broadcast 모드에서 PayloadRecord 1건만, 추가 broadcast-only recipient에 대한 PayloadRecord는 생성하지 않음
  - **NotificationDeliveryAttempt 1건 생성** — envelope+channel 단위 (deliveryMode="broadcast", recipientId=NULL, payloadId=위 broadcast PayloadRecord)
  - `broadcastAttemptId` = **broadcast DeliveryAttempt.id 그대로 참조** (별도 group id 아님 — 자기 참조 의미 제거)
  - `perRecipient[].deliveries[]`의 broadcast-only placeholder는 **DB row 없는 합성 값** — DeliveryResult 합성 시점에 만들어지고 `broadcastAttemptId`로 broadcastDeliveries 매핑. DB에 placeholder DeliveryAttempt를 만들지 않음 → § 14.4 deliveryMode enum에서 `broadcast-placeholder` 제거
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
- broadcast 결과는 `DeliveryResult.broadcastDeliveries[]`에 기록 (broadcastAttemptId = broadcast DeliveryAttempt.id)
- 실패/성공 집계는 `broadcastDeliveries[]`가 SoT, `perRecipient[].deliveries[].status="skipped-broadcast-only"`는 placeholder (집계 제외)

**suppression fallback** (§ 9.1.1 매트릭스):
- slack hard-suppressed (workspace 4xx 등) → fallback 채널(매트릭스 컬럼)로 라우팅. fallback도 막히면 외부 sink alert
- broadcast 모드는 workspace 단위 suppression 대상이 아님 (per-user suppression 없음)

### 5.3 in-app

- 저장소: NotificationInbox (§ 14.5)
- 표시: 어드민 종 아이콘 미확인 카운트
- **발송 원자성** (N4-24): inApp은 **단일 DB transaction에서 NotificationInbox insert + NotificationDeliveryAttempt(status=delivered) insert를 원자 처리**. `UNIQUE(payloadId)` 충돌 시 (race) — 이미 존재하는 Inbox·Attempt 조회하여 `status=deduped` 결과 반환
- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
- **inactive 사용자의 historical inbox**: `active=false` 사용자 inbox는 어드민 UI에서 기본 숨김. 단 DB row는 보존 (감사). 사용자 reactive 시 자동 재노출. 본 정책은 v0.5 기본 운영 결정 — NT-16 해소

---

## 6. digest 모드 (DigestPolicy AST)

### 6.1 정책 AST 구조 (자연어 매트릭스 → 구조화)

REVIEW_WORKFLOW § 9.1.1의 `digest 주기` 컬럼은 본 Feature 패키지 빌드 시 다음 AST로 코드 생성:

```ts
type DigestPolicy = {
  channel: "email";                                  // 현재 email만
  cadence: "daily" | "weekly";
  when?: DigestCondition;                             // 미지정 시 default
  optOutPolicy: "mandatory" | "digestOptOut-allowed";
  policyKey: string;                                  // 매트릭스 빌드 시 결정적 부여
};

type DigestCondition = {
  field: DigestConditionField;                        // 허용 enum
  op: "equals" | "notEquals" | "startsWith" | "endsWith" | "contains" | "exists" | "notExists";
  value?: string | number | boolean;                  // op="exists"·"notExists"는 미지정
};

type DigestConditionField =
  | "metadata.staleTriggeredBy"
  | "metadata.rejectReason"
  | "metadata.priorReviewSubmissionId"
  | "metadata.locationRef"
  | "criticality"
  | "eventType";
```

**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.

**exists/notExists deep path 평가 규칙** (N4-12):
- `missing parent` (예: `metadata.priorReviewSubmissionId` 평가 시 `metadata` 객체에 본 키 자체 부재) → `exists=false`
- `null` 값 → `exists=false`
- `undefined` 값 → `exists=false`
- `""` (빈 문자열) → `exists=true`
- `0`·`false` → `exists=true`

**default policy 유일성 검증** (N4-13): 본 Feature 패키지 빌드 시 — 각 `(eventType, channel)`별 매트릭스 셀이 digest 정책을 가지면 (a) `when: undefined` default 정책 정확히 1개, (b) 조건부 정책 0개 이상. default 부재·중복은 build fail.

**예시 (stale-queued 셀 "email — 의료법 개정은 일일, 기타는 주간" 분해)**:

```ts
[
  {
    channel: "email",
    cadence: "daily",
    when: {
      field: "metadata.staleTriggeredBy",
      op: "startsWith",
      value: "medical-law-revision-"
    },
    optOutPolicy: "mandatory",
    policyKey: "stale-queued.email.daily.medical-law-revision"
  },
  {
    channel: "email",
    cadence: "weekly",
    when: undefined,                                  // default — 위 when 미충족 시
    optOutPolicy: "digestOptOut-allowed",
    policyKey: "stale-queued.email.weekly.default"
  }
]
```

**매칭 우선순위**: 배열 순서대로 평가, 첫 매칭 정책 사용. when 미지정(default)은 항상 마지막. 평가 안전:
- 허용 field/op 외 사용 금지 (빌드 시 fail)
- 값 타입 검증: `equals`/`notEquals`는 일치 타입, `startsWith` 등은 string 한정
- 런타임 eval·임의 식 평가 금지

### 6.2 발송 트리거

- 일일: InstanceManifest.timezone 기준 `digestSchedule.daily`
- 주간: `digestSchedule.weekly`
- 스케줄러: 외부 cron 또는 내부 (NT-08)
- missed run: ±10분 → 다음 cycle carry-over
- DST: IANA 기준 자동 (fall-back 중복 시 첫 발생, spring-forward 누락 시 다음 정상 시각)

### 6.3 그룹화·발송

- DigestBucket key: `(recipientId + policyKey + cadenceWindow)` — § 14.6·14.7 join table
- **cadenceWindow 표기 (§ 14.6 정합)**:
  - daily: `YYYY-MM-DD` (인스턴스 timezone 기준 일자)
  - weekly: `YYYY-Wnn` (ISO week)
- 발송 시점에 join table 조인 → NotificationPayloadRecord[] 묶음 처리
- 발송 완료 → bucket `digestSentAt` 기록 (중복 발송 방지)
- opt-out 평가:
  - policy.optOutPolicy="mandatory" → AdminUser.digestOptOut 무시
  - "digestOptOut-allowed" → digestOptOut=true 시 `skipped-opt-out` (bucket 누적 안 함)

### 6.4 큐 분리·중복 발송 방지 정확화

- DigestBucket·QuietHoursQueue·BusinessHoursQueue 별도 테이블 (§ 14)
- 동일 payloadId가 여러 큐에 동시 누적 가능. **큐 worker 중복 발송 방지 SoT 쿼리** (N4-23):
  ```
  1. advisory lock acquire (hash(payloadId, channel)) — § 4.4와 동일 메커니즘
  2. SELECT 1 FROM NotificationDeliveryAttempt
     WHERE payloadId=? AND channel=? AND status IN ('processing', 'delivered', 'deferred-digest', 'deferred-quiet-hours', 'deferred-business-hours')
     LIMIT 1
  3. row 존재 시 → 본 worker는 발송 생략 (다른 worker가 이미 처리 중·완료)
  4. row 미존재 시 → § 4.4 attemptNumber lock·INSERT processing → commit → provider 호출
  5. advisory lock 해제
  ```
- **인덱스**: `NotificationDeliveryAttempt(payloadId, channel, status)` partial index (status IN above 집합) — 위 쿼리 최적화 (§ 14.4 추가 인덱스)

---

## 7. 재시도·실패·suppression

### 7.1 채널별 실패 분류표

| 채널 | 분류 | 트리거 | 처리 | suppression 갱신 |
|---|---|---|---|---|
| email | `transient` | SMTP 4xx, network timeout, provider 5xx | 재시도 3회 | **atomic increment** `observedCount`. **compare-and-set**으로 threshold 도달 시 1회만 state=`soft-suppressed` + `autoReleaseAt = lastObservedAt + softSuppressionAutoReleaseDays` 설정 |
| email | `permanent` (hard bounce) | 5xx 영구·invalid recipient | DLQ + sink alert | 즉시 `hard-suppressed` (자동 해제 없음) |
| email | `permanent` (config) | provider auth 401/403 | DLQ + sink alert (긴급) | 갱신 없음 |
| email | `permanent` (spam) | spam complaint | DLQ + sink alert | 즉시 `hard-suppressed` |
| email | `rate-limited` | 429 | `deferred-rate-limit` | 갱신 없음 |
| slack | `transient` | webhook 5xx, timeout | 재시도 | (per-recipient 모드에서만) atomic increment |
| slack | `permanent` | 4xx (404·403) | DLQ + sink alert | webhook 자체 문제 — webhookUrlSecretRef 점검 alert |
| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
| inApp | `transient` | DB 일시 | 1회 재시도, 실패 시 DLQ | 갱신 없음 |
| inApp | `permanent` | DB 스키마·constraint | DLQ + sink alert (긴급) | 갱신 없음 |

**suppression atomic 갱신 규칙** (N3-16 해소):
- `observedCount` 증가는 DB atomic increment (`UPDATE ... SET observedCount = observedCount + 1`)
- threshold 도달 판정: `UPDATE ... SET state='soft-suppressed', autoReleaseAt=... WHERE state='active' AND observedCount >= threshold` — 영향 row 1건일 때만 자동 sink alert 발생 (중복 alert 방지)

**soft → hard 전이** (N4-22):
- soft-suppressed 상태에서 hard bounce·spam complaint 발생 시 → **hard가 soft를 무조건 override**: `UPDATE ... SET state='hard-suppressed', autoReleaseAt=NULL, observedCount=observedCount(보존)` — autoReleaseAt 제거 + observedCount는 운영 추적용 보존
- worker(§ 7.4)는 자동 해제 조건에 `state='soft-suppressed'` 명시적으로 추가하여 hard 상태 불변성 보장

### 7.2 DLQ + resendDeadLetter

- 저장소: NotificationDeadLetter (§ 14.10) + join table NotificationDeadLetterAttempt (§ 14.11 — N3-19 정정)
- `failedAttemptIds`는 join table FK 참조 — RDBMS 무결성 보장

**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
- 새 resendAttemptId(UUID) 생성
- 새 NotificationDeliveryAttempt(attemptNumber = § 4.4 lock 메커니즘 사용, dedupeMode="resend") 생성. dedupe 우회
- 발송 성공 → DeadLetter.resolvedAt 마킹 + NotificationLog summary 재계산
- 발송 실패 → join table에 새 attempt 추가, DeadLetter unresolved 유지
- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)

**보존 기간·순서** (N3-21 해소):
- DLQ `expiresAt`: 기본 30일 (NT-12)
- NotificationLog·PayloadRecord·DeliveryAttempt: DLQ `expiresAt` + `logRetentionDaysAfterDlqExpiry`(기본 90일) 이상 보존
- ON DELETE RESTRICT FK로 보존 순서 강제

### 7.3 self-notification 차단 — 외부 sink

| sink | 트리거 | 대상 |
|---|---|---|
| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
| `auditLog` | envelope 종결·재발송·읽음 | 어드민 콘솔 |
| `NotificationLog` | per-payload·per-attempt | 운영 메트릭 SoT |

### 7.4 suppression auto-release worker + 운영자 수동 해제 (N3-15·N4-20·N4-21 해소)

**자동 해제 worker** (soft-suppressed 한정):
- 주기 worker: 1시간 간격
- 조건: `state='soft-suppressed' AND autoReleaseAt <= now()` (hard-suppressed 자동 해제 금지)
- 액션: `state='active', observedCount=0, autoReleaseAt=NULL, firstObservedAt=NULL, lastObservedAt=NULL`
- 동시성 안전: 위 WHERE 조건부 update (DB atomic)

**운영자 수동 해제** (hard-suppressed·soft-suppressed 공통):
- **권한**: `super-admin`·`operator` (REVIEW_WORKFLOW § 11.1)
- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
- **갱신**: `state='active', observedCount=0, firstObservedAt=NULL, lastObservedAt=NULL, autoReleaseAt=NULL, unsuppressedBy=actor.id, unsuppressedAt=now()`
- **observedCount reset 정책**: 수동 해제 시 0 리셋 — 다음 transient 발생부터 새 epoch으로 카운트. threshold 재도달 시 정상 alert 발생 (즉시 재-alert 방지하면서 재발 추적 보장)
- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`

---

## 8. 사용자 설정·옵트아웃·운영시간

### 8.1 timezone 우선순위

- **quietHours**: `AdminUser.notificationPreferences.quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`
- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)

### 8.2 quietHours

- 즉시 채널(email·slack-perRecipient) 보류 → `deferred-quiet-hours` → NotificationQuietHoursQueue (§ 14.8)
- inApp은 quietHours 무시
- critical은 quietHours 우회

### 8.3 글로벌 opt-out

- 모든 채널 off + digestOptOut=true:
  - mandatory 이벤트 → opt-out 우회 + 사용자 채널 off 무시 (단 인스턴스 채널 비활성은 우회 안 함). 인스턴스 inApp 활성 시 강제 inApp
  - 그 외 → `skipped-opt-out`
- 강제 inApp 발송 사전 고지 — 어드민 알림 설정 화면

### 8.4 인스턴스 운영시간 — client-approver

- 적용 조건: `clientApproverBusinessHoursAware=true` + recipient.recipientRole="client"
- **locationRef 산정**:
  1. NotificationEvent.metadata.locationRef
  2. fallback — **LocationProfile `@id="main"`** (C-21 SoT 관례, N3-14 정정)
  3. main 부재 → § 11 빌드 검증 fail (multi-location + main 부재는 fail로 격상 — N4-29)
- **invalid locationRef 처리** (N4-19): metadata.locationRef가 InstanceManifest에 없는 ID이면 → 본 recipient는 `status="skipped-missing-location"` (DeliveryStatus enum 신규 — § 3.2) + 외부 monitoring sink alert. main fallback으로 조용히 보정하지 않음 (runtime 입력 오류 감지)
- 기준 필드: `businessHoursReference` (`openingHours` | `receptionHours` — 기본 openingHours)
- 휴진·공휴일·점심:
  - `openingHours`/`receptionHours`의 `dayOfWeek` 시간 범위
  - `lunchBreaks` 제외 (점심 종료 후 발송)
  - `specialClosures[]` (특정 일자)
  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
- `holidayPolicy` Markdown 필드는 표시용. 계산에 사용 안 함
- 종료 시각 산정 (N4-18): "다음 운영 가능 시각" 탐색 — **최대 90일 탐색 한계**. 90일 내 운영 시각 미발견 시 → `status="failed-permanent"` + 외부 sink alert. 연속 휴일·잘못된 businessHours 설정 등 입력 오류 감지
- **package-embedded holidayCalendar 갱신 정책** (N4-17):
  - 본 Feature 패키지 buld에 한국 공휴일 데이터 embed (해당 연도 + 다음 연도 + 1)
  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
  - **긴급 패치**: 임시공휴일·대체공휴일 지정 시 본 Feature 패키지 patch release (1-2주 내). 운영팀이 모든 인스턴스에 패치 알림
  - `holidayCalendar.source="external-api"` override 우선 — 패키지 데이터보다 외부 API가 최신이면 외부 우선 (NT-18 인프라 결정)
- 큐: NotificationBusinessHoursQueue (§ 14.9)
- critical은 businessHours 우회
- operator·physician·legal·super-admin: 본 정책 미적용

---

## 9. 운영 지표

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| 발송 지연 (즉시) | event 수신 → delivered/deferred-* 종결 | < 30초 (p95) |
| 발송 성공율 | delivered / (delivered + failed-permanent) — `deferred-*`·`skipped-*`·`deduped`는 분모 제외 | > 99% (email·slack), > 99.9% (inApp) |
| transient 재시도율 | failed-retrying / 전체 | < 5% |
| rate-limit 발생율 | deferred-rate-limit / 전체 | < 10% |
| DLQ 신규 발생 | failed-permanent / 일 | < 10 |
| dedupe 적중률 | deduped / 전체 | baseline |
| digest 적시성 | 예정 시각 ± 5분 | > 95% |
| broadcast 비율 (Slack) | broadcastDeliveries / 전체 slack | baseline |
| suppression 누적 | hard-suppressed AdminUser 수 | M2+ baseline |

### 9.2 측정·로깅

- NotificationLog·DeliveryAttempt·PayloadRecord가 SoT
- audit log는 envelope 요약·재발송·읽음만

### 9.3 자체 alert (외부 sink)

- 성공율 < 95% (10분 이동평균)
- DLQ 신규 > 10/일
- 발송 지연 p95 > 60초
- rate-limit > 30% (1시간)

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. notificationChannels·adminBaseUrl·timezone·holidayCalendar 설정 (C-08 v0.13)
# 3. secretRef 등록 (이메일·Slack·monitoring sink)
# 4. 어드민 DB 마이그레이션 — § 14 인벤토리 (DB 11 tables + Redis 1 keyspace)
# 5. AdminUser(C-23) 등록
# 6. notificationPolicyVersion 확인 — 본 Feature 패키지의 매트릭스 보관 버전 중 하나와 일치
```

### 10.2 설정 예시 — § 2.3 참조

---

## 11. 빌드 검증

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
| **warning** | AdminUser(C-23) 0건, slack 활성 + slackUserId 등록 0건(broadcast 모드만), `clientApproverBusinessHoursAware=true` + LocationProfile.businessHours 미설정 |

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| NT-04 | 이메일 트랜스포트 — SMTP vs SES vs Mailgun | 운영 결정 |
| NT-05 | 이메일 템플릿 — BrandTokens·다국어 | M2+ |
| NT-08 | digest 스케줄러 — 외부 cron vs 내부 | 인프라 결정 |
| NT-11 | SMS 채널 도입 시점 | v1.x |
| NT-12 | DLQ 보존 기간 — 기본 30일 vs 운영 | 운영 정책 |
| NT-17 | DeliveryAttempt advisory lock 메커니즘 — PostgreSQL `pg_advisory_xact_lock` vs 다른 DBMS named lock + stale processing worker 정리 정책 | 인프라 결정 |
| NT-18 | holidayCalendar external-api override 운영 — provider 선택·API 호출 빈도 | 인프라 결정 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
| ~~NT-03~~ | dedupe 저장소 | v0.2 — Redis (v0.4 SET NX EX 원자) |
| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
| ~~NT-07~~ | NotificationInbox 스키마 | v0.2 |
| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
| ~~NT-10~~ | NotificationLog vs audit log | v0.2 |
| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
| ~~NT-16~~ | inactive 사용자 historical inbox | v0.5 — 기본 숨김 운영 결정 (§ 5.3). 인스턴스 옵션 override 없음 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (23 지적) |
| 2026-05-14 | v0.5 | codex 4차 (30 지적 전건 수용) — 트랜잭션 abort 분기·attemptNumber lock SoT·UNIQUE 정정·fallback 두 attempt·두 축 분리·DigestPolicy AST 검증·broadcast 단일 PayloadRecord·holidayCalendar 갱신·businessHours 90일·skipped-missing-location·운영자 수동 unsuppress·soft→hard·큐 worker 중복 방지·inApp 원자성·DeadLetter UNIQUE·MySQL schema·actorRole·AdminUserRole system·main 부재 fail
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |

---

## 14. 본 Feature 내부 데이터 구조 (admin DB 11 tables + Redis 1 keyspace)

### 14.1 공통 원칙

- 모든 테이블 `id` UUID PK, `createdAt` Date
- FK 기본 ON DELETE RESTRICT — 보존 순서 보장 (DigestBucketPayload만 분리, § 14.7)
- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)

### 14.2 `NotificationEventReceipt` (idempotency 선점)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | PK |
| `instanceId` | Slug | ✅ | |
| `sourceEventId` | string | ✅ | idempotency key |
| `notificationLogId` | UUID | ✅ | NotificationLog FK |
| `receiptState` | enum | ✅ | accepted/processing/completed/failed |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |

**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
**보존**: `receiptRetentionDays`(기본 365일) — sourceEventId 재사용 차단.

### 14.3 `NotificationPayloadRecord` (recipient-envelope unit)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | = payloadId |
| `notificationLogId` | UUID | ✅ | FK |
| `eventId` | string | ✅ | |
| `recipientId` | Ref<C-23> | optional | **broadcast 모드: NULL (envelope+channel 단위 1건 — N4-14)**. per-recipient 모드: AdminUser @id |
| `recipientRole` | enum | optional | broadcast 모드 NULL. per-recipient 모드 ✅ |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `metadata` | object | ✅ | |
| `createdAt` | Date | ✅ | |

> 채널별 sentAt 추적은 NotificationDeliveryAttempt.status로만 판단 (per-channel scope). PayloadRecord에는 channel 필드·sentAt 필드 없음 — N3-04 정정.
>
> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).

**Constraints**: `FK notificationLogId ON DELETE RESTRICT`.
**Index**: `(notificationLogId)`, `(recipientId, createdAt)`.

### 14.4 `NotificationDeliveryAttempt`

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `notificationLogId` | UUID | ✅ | FK |
| `payloadId` | UUID | ✅ | PayloadRecord FK |
| `recipientId` | Ref<C-23> | optional | broadcast → null |
| `channel` | enum | ✅ | email·slack·inApp |
| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
| `attemptNumber` | integer (1~) | ✅ | payloadId+channel 범위 sequence (§ 4.4 lock 메커니즘) |
| `dedupeMode` | enum | ✅ | normal·resend |
| `status` | DeliveryStatus | ✅ | processing(선점) → delivered/failed-*/deferred-*/deduped/skipped-* |
| `provider` | string | optional | |
| `providerResponseCode` | string | optional | |
| `providerResponseBody` | string | optional | 민감 마스킹 |
| `error` | string | optional | |
| `latencyMs` | number | optional | |
| `attemptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `failureClassification` | enum {transient, permanent, rate-limited} | optional | § 7.1 |

**Constraints**:
- `FK notificationLogId ON DELETE RESTRICT`, `FK payloadId ON DELETE RESTRICT`
- `UNIQUE(payloadId, channel, attemptNumber)` — N4-05 정정: sequence가 `(payloadId, channel)` 범위이므로 dedupeMode를 unique에서 제외. dedupeMode는 일반 컬럼
**Index**: `(notificationLogId)`, `(payloadId, channel)`, `(status, attemptedAt)`, `(failureClassification, attemptedAt)`, **`(payloadId, channel, status)` partial index where status IN ('processing','delivered','deferred-digest','deferred-quiet-hours','deferred-business-hours')** (§ 6.4 큐 worker 중복 방지 최적화 — N4-23).

> `broadcastAttemptId` 필드는 별도 보관하지 않음 (N4-15). broadcast DeliveryAttempt.id 자체가 식별자. DeliveryResult 합성 시 `broadcastDeliveries[].broadcastAttemptId = broadcast attempt.id`로 매핑.

### 14.5 `NotificationInbox` (in-app)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `recipientId` | Ref<C-23> | ✅ | |
| `payloadId` | UUID | ✅ | FK |
| `notificationLogId` | UUID | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `createdAt` | Date | ✅ | |
| `readAt` | Date | optional | |

**Constraints**: `FK payloadId ON DELETE RESTRICT`. `UNIQUE(payloadId)`.
**Index**: `(recipientId, readAt)`, `(recipientId, createdAt DESC)`.
**inactive UI 정책**: § 5.3 (NT-16 운영).

### 14.6 `NotificationLog` (envelope 단위 메트릭)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `instanceId` | Slug | ✅ | |
| `eventId` | string | ✅ | |
| `sourceEventId` | string | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `criticality` | enum | ✅ | |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `summary` | `{delivered, failed, deferred, deduped, skipped, broadcast: number}` | ✅ | |

**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.

### 14.7 `NotificationDigestBucket` + `NotificationDigestBucketPayload` (join table)

**NotificationDigestBucket**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `digest:{recipientId}:{policyKey}:{cadenceWindow}` |
| `recipientId` | Ref<C-23> | ✅ |
| `policyKey` | string | ✅ |
| `cadenceWindow` | string | ✅ — `YYYY-MM-DD` (daily) 또는 `YYYY-Wnn` (weekly) |
| `scheduledFor` | Date | ✅ |
| `digestSentAt` | Date | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**NotificationDigestBucketPayload** (join):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
| `payloadId` | UUID | ✅ — FK NotificationPayloadRecord ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
**Index**: `(scheduledFor, digestSentAt IS NULL)`, `(recipientId, policyKey)`.

### 14.8 `NotificationQuietHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `quiet:{recipientId}:{quietHoursWindowStart}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `scheduledFor` | Date | ✅ — quietHours 종료 |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.9 `NotificationBusinessHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `locationRef` | string | ✅ |
| `scheduledFor` | Date | ✅ |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.10 `NotificationDedupeCache` (Redis SoT)

```
키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
원자 연산: SET key value NX EX <ttl>
TTL:
  failed-retrying: dedupeWindowSeconds + 300
  delivered·failed-permanent: dedupeWindowSeconds
```

### 14.11 `NotificationDeadLetter` + `NotificationDeadLetterAttempt` (join table)

**NotificationDeadLetter**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `notificationLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `failingChannel` | enum | ✅ |
| `failureClassification` | enum | ✅ — permanent |
| `firstFailedAt` | Date | ✅ |
| `lastResendBy` | string | optional |
| `lastResendAt` | Date | optional |
| `resolvedAt` | Date | optional |
| `expiresAt` | Date | ✅ — 기본 30일 |

**Constraints (PostgreSQL 기준)**:
```sql
CREATE UNIQUE INDEX notification_dead_letter_active_unique
  ON notification_dead_letter (payload_id, failing_channel)
  WHERE resolved_at IS NULL;
```
(다른 DBMS는 generated column `isActive`로 대체 — N3-18 정정)

**Index**: `(expiresAt)`, `(resolvedAt IS NULL, firstFailedAt)`.

**NotificationDeadLetterAttempt** (join — N3-19 신설):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
| `attemptId` | UUID | ✅ — FK NotificationDeliveryAttempt ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(deadLetterId, attemptId)` (deadLetter 내 동일 attempt 중복 방지)
- **`UNIQUE(attemptId)`** — 1개 DeliveryAttempt는 정확히 1개 DLQ에만 속함 (N4-25 정정). 여러 DLQ 연결 의미 모호 회피

> NotificationDeliveryAttempt 보존 ≥ DeadLetter 보존 + `logRetentionDaysAfterDlqExpiry`. join FK가 RESTRICT라 보존 순서 강제.

#### 14.11.1 다른 DBMS (MySQL 등) 대체 schema (N4-26)

PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:

```sql
-- NotificationDeadLetter 추가 컬럼 (MySQL 5.7+/MariaDB 등 generated column 지원):
-- 활성 DLQ는 1 (resolved 안 됨), 종결된 DLQ는 NULL (unique 제약 무시) — N5-05 정정
activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
UNIQUE KEY notification_dead_letter_active_unique (payloadId, failingChannel, activeKey)

-- 결과:
--   - activeKey=1 row가 (payloadId, failingChannel)별 0~1건 (active DLQ unique)
--   - activeKey=NULL row(resolved 이력)는 unique 제약에서 무시 — MySQL NULL은 unique 충돌 발생 안 함, 다수 보존 허용
```

---

 succeeded in 955ms:
# Feature — content-migration

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외 — anchor residue 정정 완료)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (**6종** NotificationEventType + **15종** AuditAction cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 6종 NotificationEventType (CM6-01) |
| REVIEW_WORKFLOW § 10.2.1 | 15종 AuditAction (CM6-01) |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100
        criticalClassFullDiff: true
        digest:
          chunkSize: 10000
          maxRowsBeforeSnapshot: 1000000
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"
        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
        staleFlagsOnlyOverrideConditions:
          maxRiskLevel: "low"
          requiresNoLegalSensitiveEntityChange: true     # CM4-08
          requiresNoLegalEntityIdentityChange: true      # CM4-08
          requiresNoPriorReviewRequiredChange: true
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body)). char(64) |
| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` | step별 read-set field projection canonical JSON → chunked Merkle |
| `sourceSnapshotWatermark` | source table별 MAX(updated_at) + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` | (contentMigrationPolicyVersion + complianceAssistantPolicyVersion + ruleCatalogVersion + ruleFileHashes + REVIEW_WORKFLOW version + piiFieldCatalogRef + entityFieldProjectionCatalogRef) canonical digest |
| `stepRegistryVersion` | step type registry 카탈로그 hash |
| `legalImpactClassificationDigest` | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 (§ 3.4) |
| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |

dry-run/apply preflight 동일 함수. 비용 상한 § 2.3 `digest`.

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)

| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | | 동일 | — | — |
| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |

### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)

**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.

| AuditAction (canonical) | 추가 metadata |
|---|---|
| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |

### 3.2 plan kind 6종 (CM3-16 — 풀 전개)

#### 3.2.1 `application-data-version-upgrade`
DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. column add/rename DDL은 인프라 책임. 본 plan kind는 column 존재·nullable·default를 read-only 검증 후 데이터만 채움.

#### 3.2.2 `feature-activation-backfill`
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).

#### 3.2.3 `instance-to-instance-copy`
분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.

#### 3.2.4 `content-bulk-transform`
design token 변경·brand 변경 시 콘텐츠 일괄 재생성. **asset-ingestion body MV는 변경 금지** (mutableFieldDenylist).

#### 3.2.5 `policy-version-reevaluate`
CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.

#### 3.2.6 `routing-slug-preservation`
asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계. step 필수: `redirect-map-apply`·`slug-preserve`·`compliance-history-link`.

### 3.3 DTO

```ts
type MigrationPlanKind = /* 6종 */;
type RollbackClass = "reversible" | "compensating" | "irreversible";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string; description: string;
  targetSelector: TargetSelector;
  steps: MigrationStep[];
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;
  stepType: string;                                      // step registry 등록
  inputs: Record<string, unknown>;                       // registry inputSchema strict
  rollbackClass: RollbackClass;
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // irreversible 필수
  backupSnapshotRequired?: boolean;                     // irreversible 필수
  retryable: boolean;
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: LegalImpactClass[];
  classifierVersion: string;
  unknownClassesEncountered: boolean;                    // true → fail-closed
};

type LegalImpactClass =
  | "pii" | "legal-document" | "review-policy" | "pricing-page"
  | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy";

// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
type RunApplyInput = {
  planId: string;
  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
  applyPreflightToken: string;                          // server에서 dry-run 후 발급 (§ 3.5)
  forceProceedDespiteWarnings?: boolean;                // legal/critical warning에는 적용 안 됨
  idempotencyKey: string;
};

type RunApplyResult = {
  runId: string;
  status: "running";
  digestBundleVerified: { /* 8필드 + 일치 여부 */ };
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: RunPrimaryStatus;                     // CAS
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM4-05 신규
type MarkStepCompensatedInput = {
  stepResultId: string;
  compensationDescription: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  idempotencyKey: string;
};

// CM4-05 신규
type AbortRunInput = {
  runId: string;
  reason: string;
  approver: string;
  operationalTicketRef: string;
  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
  idempotencyKey: string;
};

// CM3-04 + CM4-08 — legalEntityChanged 분해
type PolicyReevaluateResult = {
  complianceRecordId: string;
  previousRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  newRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  riskDelta: "decreased" | "unchanged" | "increased";
  priorReviewRequiredChanged: boolean;
  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
  forcedReportingMode: "stale-flags-only" | "new-record-version";
  forcedReportingModeReason?: string;
};

// CM3-11 — Run status decomposition
type RunPrimaryStatus =
  | "pending" | "running" | "paused"
  | "completed" | "failed" | "cancelled"
  | "rolling-back" | "rolled-back";

type RunRemediationStatus =
  | "none"
  | "blocked-manual-remediation-required"
  | "cancellation-timeout-manual-review";

type RunRollbackOutcome =
  | "none" | "full" | "partial" | "failed";
```

### 3.4 idempotencyKey + requestFingerprint (CM3-19)

| command | scope | requestFingerprint |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64) opaque
3. client에 (dryRunReportId, applyPreflightToken) 둘 다 반환

runApply(input) — server:
1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
2. token 재계산 비교 — 불일치 시 → 401/CAS fail
3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
4. **digestComputationMode별 invalidation precheck** (CM4-02):
   - mode="full": 8필드 모두 server-side 재계산 → 비교
   - mode="snapshot": targetSetDigest·contentHashDigest는 snapshot 사용 (재계산 skip). policyVersionSnapshot·classifierVersion·catalog refs만 재계산
   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
```

### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
  readSetProjection: FieldProjection[];                 // entityFieldProjectionCatalogRef 통과
  writeSetProjection: FieldProjection[];                // 동일
  rollbackClassDefault: RollbackClass;
  legalClassHints: LegalImpactClass[];
  cancellationSupport: {
    supportsCooperativeCancellation: boolean;
    cancellationCheckInterval: number;
    maxUninterruptibleSeconds: number;
    transactionBoundary: "per-row" | "per-chunk" | "per-step";
  };
  partialWriteDetector: PartialWriteStrategy;           // CM3-10
  dryRunCostEstimateSecondsPerThousandRows: number;
  mutableFieldAllowlist?: string[];
  mutableFieldDenylist?: string[];                      // asset-ingestion body MV 포함
};

// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }
  | { kind: "chunked-returning"; chunkSize: number }
  | { kind: "append-only-watermark";
      watermarkField: string;
      lowerBound: string;                                // CM4-03 — 시작 watermark
      exclusiveUpperBound: string;                       // CM4-03
      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
      expectedInsertedCount: number;                     // CM4-03
      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
    }
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };
```

asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.

### 3.7 writeSetManifest (CM2-06 + CM3-10)

각 step 실행 시 StepResult에 기록:

```ts
type WriteSetManifest = {
  strategy: PartialWriteStrategy["kind"];
  expectedAffectedRows: number;
  actualAffectedRows: number;
  beforeDigest?: string;                                // small-rowid-merkle만 사용
  afterDigest?: string;
  committedRowIds?: string[];                            // small
  chunkIds?: string[];                                   // chunked-returning
  highWatermark?: { before: string; after: string };    // append-only-watermark
  expectedAfterProjectionHash?: string;                  // deterministic-transform
  actualAfterProjectionHash?: string;
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;
  isolationLevel: "read-committed" | "repeatable-read" | "serializable";
};
```

partial write 감지 트리거 (strategy별):
- `small-rowid-merkle`: beforeDigest + expected → afterDigest 불일치
- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
- `append-only-watermark` (CM4-03):
  - watermark 역행
  - actualInsertedCount ≠ expectedInsertedCount
  - `[lowerBound, exclusiveUpperBound)` 범위에 writerId ≠ 본 run row 발견 (phantom row)
  - concurrencyMode=serializable일 때 isolation level 미적용 → step abort
  - concurrencyMode=advisory-lock-range일 때 `pg_advisory_xact_lock(hashtext('cm:append:' + watermarkField + ':' + lowerBound))` 미획득 → step abort
- `deterministic-transform`: actualAfterProjectionHash ≠ expectedAfterProjectionHash

### 3.8 read API privacy class (CM3-20 — StepResult schema)

```ts
type StepResultRow = {
  id: string;
  runId: string;
  stepKey: string;
  status: StepResultStatus;
  inputSummary: ClosedSchemaSummary;                    // PII 미포함 요약 (필드 token + masked value)
  outputSummary: ClosedSchemaSummary;
  diffDisplayHints: ClosedSchemaSummary;                // crm-sync § 3.2.1 패턴
  rawArtifactRef?: string;                              // S3·blob ref (rawArtifactRef 권한 별도)
  rawArtifactRetentionExpiresAt?: Date;
  privacyClass: "non-pii" | "pii" | "legal-sensitive";
  containsPii: boolean;
  exportAllowed: boolean;                               // PII step은 false 강제
  writeSetManifest: WriteSetManifest;
  startedAt: Date; completedAt?: Date;
};
```

| field | operator | super-admin | legal-reviewer | export |
|---|---|---|---|---|
| inputSummary·outputSummary·diffDisplayHints (non-pii) | 허용 | 허용 | 허용 | 허용 |
| inputSummary·outputSummary·diffDisplayHints (pii·legal-sensitive) | masked | masked | full | export 금지 |
| rawArtifactRef (containsPii=true) | 차단 | 허용 (audit 기록) | 허용 (audit 기록) | export 금지 |
| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan: ContentMigrationPlan row insert (status=draft·planFingerprint)
2. validatePlan:
   - step type registry 등록 + inputSchema strict
   - rollbackClass별 reverse/compensating/blastRadius 검증
   - cooperativeCancellation 미지원 + transactionBoundary != per-chunk → **validate fail (CM3-02 승격)**
   - maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes 초과 → validate fail
   - legalImpactClassifier 실행 (§ 4.7)
   - writeSetProjection·mutableFieldAllowlist를 piiFieldCatalogRef·entityFieldProjectionCatalogRef로 catalog-against validation
   - unknownClassesEncountered=true → fail-closed
   - audit plan-validated
3. runDryRun:
   - 8필드 digest 산정 + sampling (deterministic-stratified, legal/PII full diff)
   - DryRunReport insert
   - applyPreflightToken 발급 (§ 3.5)
   - audit dry-run-completed
4. legalGateRequired=true → approvePlanLegalGate:
   - ContentMigrationLegalApproval insert (dryRunReportId·8필드 snapshot·approvedDigestBundleHash — CM3-13)
   - audit plan-legal-approved + 알림 plan-legal-approved
5. runApply(input):
   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
   - DryRunReport expiresAt CAS
   - legalGateRequired=true 시 expectedLegalApprovalId 필요 — DryRunReport 일치 확인
   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
   - ContentMigrationRun insert (primaryStatus=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 — writeSetManifest 기록
   - 알림 run-completed/run-failed
```

### 4.2 rollback

```
rollbackRun:
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. step 역순 처리:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)

#### 4.3.1 명령별 transition

| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point | paused·none·none |
| resumeRun | paused·none·none | 다음 step | running·none·none |
| cancelRun | pending | step 미진행 | cancelled·none·none |
| cancelRun | running·none | cooperative cancellation 요청. 종료 후 partial commit 검사. partial 발견 시 자동 rollback | cancelled·none·none / rolling-back·none·none |
| cancelRun | paused·none·none | 동일 partial commit 검사 | cancelled·none·none / rolling-back·none·none |
| rollbackRun | completed·failed·cancelled·paused (none·none) | reverse 시작 | rolling-back·none·none |
| (rollback 완료) | rolling-back·none | 모든 step reversible → full | rolled-back·none·**full** |
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)

```sql
CHECK (
  (primary_status='pending'      AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='running'      AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome='none') OR
  (primary_status='paused'       AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='completed'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='failed'       AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome IN ('none','failed')) OR
  (primary_status='cancelled'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
  (primary_status='rolled-back'  AND remediation_status='none' AND rollback_outcome IN ('full','partial'))
)
```

**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)

| writeClass | 정의 | 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
| `notification-read-receipt` | inApp 읽음 표시 | 큐잉 |
| `notification-digest-state` | digest 집계 | 큐잉 |
| `audit-append` | append-only audit | 허용 |

`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).

### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE content_migration_notification_outbox
SET status='sent', sent_at=now(), locked_at=null
WHERE id=$id;

-- transient fail (backoff 적용)
UPDATE content_migration_notification_outbox
SET status='pending', locked_at=null, last_error=$err,
    next_attempt_at = now() + (interval '1 second' * (CASE attempts
      WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 WHEN 4 THEN 7200 ELSE 21600 END))
WHERE id=$id;

-- exhausted (attempts >= 5)
UPDATE content_migration_notification_outbox
SET status='permanent', locked_at=null
WHERE id=$id AND attempts >= 5;
-- + sink alert

-- stale reclaim (별도 worker — cadence 1분)
UPDATE content_migration_notification_outbox
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '5 minutes';
```

status enum: `pending`·`processing`·`sent`·`permanent`. (CM3-14 — `failed` 제거)

### 4.7 legalImpactClassifier (CM3-05 — catalog input)

| class | deterministic rule |
|---|---|
| `pii` | step.readSetProjection ∩ piiFieldCatalogRef 또는 writeSetProjection ∩ piiFieldCatalogRef ≠ ∅ |
| `legal-document` | targetEntityTypes에 `LegalDocument` ∈ entityFieldProjectionCatalogRef |
| `review-policy` | targetEntityTypes에 `ReviewPolicy` |
| `pricing-page` | targetEntityTypes에 `PricingPage` 또는 `PricingPolicy` |
| `before-after-media` | readSet/writeSet에 priorReviewRequired trigger catalog의 before/after media field |
| `testimonial-review` | targetEntityTypes에 `Testimonial`·`Review` |
| `prior-review-required` | priorReviewRequired trigger catalog 영향 field |
| `cross-entity-copy` | planKind=instance-to-instance-copy 또는 sourceInstance != targetInstance |

unknown step type 또는 catalog 매칭 실패 → `unknownClassesEncountered=true` → fail-closed.

step의 self-declared `legalClassHints`만 신뢰하지 않음 — `writeSetProjection`·`mutableFieldAllowlist`를 catalog로 cross-validate (CM3-05).

**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.

retroactive audit — false-negative 발견 시 영향 plan 재평가 절차는 CM-09 v1.x (운영 정책).

### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)

```
config.defaultReportingMode="risk-based":
1. 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit:
   - check() 호출 skip
   - cachedResultRef 기록
3. concurrencyLimit·rateLimitPerSecond 적용
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
5. forcedReportingMode 결정 (CM4-08):
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.10)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| ApplyPreflightToken mismatch 차단율 | 100% | |
| legalImpactClassifier unknown fail-closed 비율 | baseline | |
| skip irreversible 발생율 | baseline (운영 review) | |
| partial write → rollback 트리거 비율 | baseline | |
| read-only window 차단 write | baseline | |
| policy-reevaluate risk-based new-record-version 비율 | baseline | |
| dry-run targetSetDigest match | 100% | |
| dry-run changedRowCount delta | < 1% | |
| dry-run fieldDiff delta | < 5% | |
| dry-run blockedDriftCount | baseline | |
| rollback 성공율 | > 99% | |
| outbox 발송 성공율 | > 99% | |

### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)

| Invariant ID | § 9 rule | 영역 |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |

### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)

| INV ID | happy fixture | violation fixture |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 실행 결과로 ComplianceRecord 재생성 시 새 record는 REVIEW_WORKFLOW § 8 lifecycle 진입 (개별 콘텐츠 contentType 유지). `contentType` 예외 cascade 불필요.

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
- `policyVersionReevaluate.staleFlagsOnlyOverrideConditions.maxRiskLevel` ∉ enum
- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry inputSchema.additionalProperties != false
- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)

### 9.2 runtime fail

- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
- policy-reevaluate concurrencyLimit 초과 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
- skipStep 대상 stepResult.rollbackClass ≠ "irreversible" → runtime fail (CM6-03 — `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason)
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
- stale policyVersionSnapshot → CAS fail
- targetSelector row lock 불가 → runtime fail
- orphan Core row → warning
- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
- maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes → validate fail
- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport expiresAt 도래 → purge
- legalHold > unregister > retention purge precedence
- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
- purge worker — 테이블별:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함
- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)

---

## 10. 미결정 사항

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster cross-region copy |
| CM-02 | partial cutover |
| CM-03 | sampling stratified 알고리즘 (v1.0 deterministic-stratified default·v1.x per-cluster) |
| CM-04 | read-only window 우회 권한 |
| CM-05 | rollback 부분 적용 안전성 |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |
| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |

### 10.3 v0.6 잔여 리스크 (CM5-08)

| 영역 | 상태 |
|---|---|
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |
| ~~§ 6.3 fixture violation path~~ | ~~resolved (v0.5 28 INV happy + violation)~~ |
| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.10 별도 table 승격 — 12 tables)~~ |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
| 2026-05-15 | v0.3 | codex 2차 23 지적 |
| 2026-05-15 | v0.4 | codex 3차 21 지적 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
| 2026-05-15 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 86건 (24+23+21+14+8+3+1) 전건 수용. blocking 0·major 0·minor 1 (CM7-01 anchor residue — 정정 완료). SoT cascade 완료: REVIEW_WORKFLOW (6종 NotificationEventType + 15종 AuditAction), DATA_MODEL v0.22 (contentMigrationConfig·piiFieldCatalogRef·entityFieldProjectionCatalogRef). 의료법·개인정보보호법 운영 가능. **8 Feature 마지막 — 전체 spec 완료** |
| 2026-05-15 | v0.7 | **codex 6차 비평 3 지적 정정**: (1) NotificationEventType **4종→6종**·AuditAction **13종→15종** 상단 SoT 카운트 정정 + NotificationOutbox `eventType` enum 6종 정정 (CM6-01), (2) § 12 heading 번호 총괄 인벤토리와 정합 (12.10 PolicyReevaluateRecord·12.11 NotificationOutbox·12.12 ActiveTargetLock) (CM6-02), (3) § 9.2 skipStep fail rule에서 제거된 `rollbackClass` 입력 참조 삭제 — `skipStep 대상 stepResult.rollbackClass ≠ "irreversible"` 으로 정정 (CM6-03) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (12 tables — executable schema)

### 12.1 `ContentMigrationPlan`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ |
| `planKind` | enum (6종) | ✅ |
| `planFingerprint` | char(64) | ✅ |
| `title`·`description` | string | ✅ |
| `targetSelector` | JSON | ✅ |
| `legalImpactClassification` | JSON (closed) | ✅ |
| `classifierVersion` | string | ✅ |
| `status` | enum (draft·validated·dry-run-completed·legal-approved·apply-ready·archived) | ✅ |
| `definedBy`·`definedAt` | string·Date | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.plan |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
**Index**: `(instanceId, status)`, `(expiresAt)`.

### 12.2 `ContentMigrationDryRunReport`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
| `generatedAt` (CM5-05) | Date | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — § 12.12 lock 산정에 재사용 (CM5-04) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `classificationSnapshot` | JSON | ✅ |
| `classificationSnapshotDigest` | char(64) | ✅ |
| `approvedDigestBundleHash` | char(64) | ✅ — 8필드 bundle |
| `policyVersionSnapshot` | string | ✅ |
| `classifierVersion` | string | ✅ |
| `approvedBy`·`approvedAt` | string·Date | ✅ |
| `legalHold` | boolean | ✅ default true |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `UNIQUE(planId, classificationSnapshotDigest)`. `UNIQUE(planId, dryRunReportId)`.
**Index**: `(planId, approvedAt DESC)`.

### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `expectedLegalApprovalId` | UUID | optional (legalGateRequired=true 시 ✅) — FK |
| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
| `solutionVersion` | integer | ✅ — CAS |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `mode` | enum (dry-run·apply) | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(planId, idempotencyKey)`
- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
**Index**: `(primary_status, started_at DESC)`, `(expiresAt)`.

### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `stepKey` | string | ✅ |
| `stepType` | string | ✅ |
| `status` | enum (pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back) | ✅ |
| `inputSummary` | JSON (closed — § 3.8) | ✅ |
| `outputSummary` | JSON (closed) | optional |
| `diffDisplayHints` | JSON (closed) | optional |
| `rawArtifactRef` | string | optional |
| `rawArtifactRetentionExpiresAt` | Date | optional |
| `privacyClass` | enum (non-pii·pii·legal-sensitive) | ✅ |
| `containsPii` | boolean | ✅ |
| `exportAllowed` | boolean | ✅ |
| `writeSetManifest` | JSON (§ 3.7) | optional |
| `rollbackClass` | enum | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints (CM4-10 SQL canonical 정정)**:
- `UNIQUE(runId, stepKey)`
- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
**Index**: `(runId, started_at DESC)`, `(expiresAt)`, `(privacy_class) WHERE privacy_class IN ('pii','legal-sensitive')`.

### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `attempts` | integer | ✅ |
| `maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (transient·permanent) | optional |
| `exhaustedAt` | Date | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
**Index**: `(status, next_attempt_at, locked_at) WHERE status IN ('pending','processing')`.

**worker SoT SQL** (CM3-07 자체 전개):

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_step_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_step_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- transient fail (backoff)
UPDATE content_migration_step_retry_queue
SET status='pending', locked_at=null, last_error=$err, last_error_class='transient',
    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
WHERE id=$id;

-- permanent
UPDATE content_migration_step_retry_queue
SET status='failed-permanent', locked_at=null, last_error_class='permanent'
WHERE id=$id;

-- success
UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;

-- exhausted
UPDATE content_migration_step_retry_queue
SET status='exhausted', exhausted_at=now(), locked_at=null
WHERE id=$id AND attempts >= max_attempts;
-- + sink alert + run.retryExhaustedAction trigger

-- stale reclaim
UPDATE content_migration_step_retry_queue
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';
```

### 12.7 `ContentMigrationRollbackLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `rolledBackStepKey` | string | ✅ |
| `rollbackClass` | enum | ✅ |
| `scope` | enum (full·from-step) | ✅ |
| `skippedIrreversibleSteps` | JSON ({stepKey, remediationTicketRef}[]) | ✅ |
| `result` | enum (success·partial·failed) | ✅ |
| `executedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId, rolledBackStepKey)`.
**Index**: `(runId, executedAt DESC)`.

### 12.8 `ContentMigrationReadOnlyWindow`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `startedAt`·`endedAt` | Date | ✅·optional |
| `blockedWriteAttempts` | integer | ✅ default 0 |
| `queuedDispatchCount` | integer | ✅ default 0 |
| `active` | boolean | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId) WHERE active=true`.
**Index**: `(active, started_at DESC)`.

### 12.9 `ContentMigrationPolicyReevaluateBatch`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planId` | UUID | ✅ — FK |
| `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` | integer | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId)`.

### 12.10 `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)

batch row 1개당 per-ComplianceRecord N row. 별도 물리 table. PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged` | boolean | ✅ |
| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.11 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType **6종** — § 5.1 SoT — CM6-01) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.12 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신
- stale (expiresAt 도래) → cleanup worker가 해제 + sink alert

`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.

---

**총 12개 admin DB 테이블** (CM5-01 정정):

| § | 테이블 |
|---|---|
| 12.1 | `ContentMigrationPlan` |
| 12.2 | `ContentMigrationDryRunReport` |
| 12.3 | `ContentMigrationLegalApproval` |
| 12.4 | `ContentMigrationRun` |
| 12.5 | `ContentMigrationStepResult` |
| 12.6 | `ContentMigrationStepRetryQueue` |
| 12.7 | `ContentMigrationRollbackLog` |
| 12.8 | `ContentMigrationReadOnlyWindow` |
| 12.9 | `ContentMigrationPolicyReevaluateBatch` |
| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
| 12.11 | `ContentMigrationNotificationOutbox` |
| 12.12 | `ContentMigrationActiveTargetLock` |

 succeeded in 989ms:
# Feature — crm-sync

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지**. webhook(실시간) + polling(배치).
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20
> - RRN checksum → `features/asset-ingestion.md` § 9.1
> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
- **vs ReservationPage(C-20)**: C-20은 콘텐츠 페이지. 본 Feature는 ReservationSubmission·Inquiry·ConversionEvent·Contact 운영 이벤트 sync
- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x (CS-13). **`providerVersionToken=null` provider build fail (CS4-04)** — record-level dedupe 보장 불가
- **운영 모드 2종**: `bi-directional`·`outbound-only`
- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `appointment` v1.x (CS-12)
- **PII 정책**: raw PII 저장 금지. operationalHints는 privacy-sensitive metadata로 분류 (CS4-05). liveRead v1.x (CS-14)
- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
- **DB 인벤토리**: **15 tables** (§ 13.1 ~ § 13.15) — 각 절 stand-alone schema

---

## 1. 일반 규약

### 1.1 변경 정책 (CS4-13 보강)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping·canonical schema § 3.2 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |
| displayHints column 추가 | MINOR | 별개 | nullable. read API output 추가 |
| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
| operationalHints column 추가 | MINOR | 별개 | nullable. privacy classification 검토 필수 (CS4-13) |
| operationalHints privacy classification 변경 | **MAJOR** | policyVersion 신규 | retention·masking·role access 재평가 |
| CrmCredentialVersion.state enum 추가 | MINOR | 별개 | invariant 표 갱신 |
| CrmCredentialVersion.state enum 제거·rename | **MAJOR** | policyVersion 신규 | |
| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
| **consent withdrawal scope enum 추가·변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 적용 의미 변경은 record-level erasure 영향 |
| **consent withdrawal matching key 알고리즘·hash 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 tombstone 무효화 위험 |
| **ChangeIdentityLedger key 산정 알고리즘 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 ledger row 무효화 |
| **providerVersionToken requirement 강화** (CS4-13) | **MAJOR** | 별개 | build fail 룰 추가 |

### 1.2 SoT 원칙

- 알림 발송·audit canonical → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion → DATA_MODEL C-08 v0.20
- RRN checksum → `features/asset-ingestion.md` § 9.1
- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| CrmSyncRetryQueue | 5·configurable | [60, 300, 1800, 7200, 21600]s |
| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL 동일 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 → notifications
- 외부 CRM 운영·계약 → 클라이언트·CRM provider
- Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote v1.x (CS-11)
- 의료 진료 기록 보관 → CRM·EMR
- raw PII 실시간 조회 → v1.x (CS-14)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
| DATA_MODEL C-08 v0.20 | `crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter` |
| DATA_MODEL CT-03·C-20 | 참조만 |
| asset-ingestion § 9.1 | RRN checksum |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |

### 2.3 InstanceManifest 통합

v0.4 § 2.3과 동일 구조. 정정 필드는 없으나 stand-alone SoT 강화를 위해 명시:

```yaml
crmSyncConfig:
  integrations:
    - id: "main-crm"
      provider: "salesforce"
      apiKeySecretRef: "secretRef://..."
      apiUrl: "..."
      webhookSecret: "secretRef://..."
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
      dpaEvidenceRef: "secretRef://..."
      genericRestApiAdapter:                            # provider=generic-rest-api 시 ✅. DATA_MODEL C-08 v0.20 동기화 (5필드)
        webhookSignatureHeader: "X-Webhook-Signature"
        webhookTimestampHeader: "X-Webhook-Timestamp"
        webhookEventIdHeader: "X-Webhook-Event-Id"
        canonicalStringFormat: "timestamp.method.path.bodySha256"
        versionTokenJsonPath: "$.metadata.version"     # CS4-04·CS5-01 — providerVersionToken 추출 path 필수
        versionTokenType: "epoch-ms"                    # CS5-01 — enum: epoch-ms·integer·string
crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"
      syncSchedule: { pollIntervalMinutes: 15, timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" } }
      entities:
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint: { path: "/api/crm-sync/webhook/{integrationId}", timestampToleranceSeconds: 300 }
      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
      credentialRotation: { warnDaysBeforeExpiry: 14, autoNotifyEnabled: true, rotationGracePeriodMinutes: 30 }
      rateLimit:
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii: { rawPiiStorageAllowed: false, displayHintsRetentionDays: 30, ssnRrnHandling: "deny", liveReadEnabled: false }
      operationalHintsRetentionDays: 365                # CS4-05 — operationalHints 보존 (privacy-sensitive)
      retentionDays:
        syncLog: 730; sourceAttempt: 730; changeLog: 1095; conflictRecord: 1095
        retryQueueCompleted: 30; notificationOutbox: 30; consentWithdrawalLedger: 1095
      webhookNonceLedgerRetentionMinutes: 360
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:                                       # CS4-01·CS5-02 — canonical hash 알고리즘
        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
        crmExternalIdHashPepperRef: "secretRef://CRM_EXT_ID_HASH_PEPPER"
        changeIdentityKeyPepperRef: "secretRef://CRM_CHANGE_IDENTITY_PEPPER"
        rrnFingerprintPepperRef: "secretRef://CRM_RRN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://..." }
```

#### 2.3.1 hash algorithm SoT (CS4-01)

| hash | 입력 | 알고리즘 | 산식 |
|---|---|---|---|
| `piiHash` | raw PII (이름·전화·이메일·생년월일 정규화 후 concat) | HMAC-SHA256 | `HMAC(piiHashPepperRef, normalize(name) + ":" + normalize(phone) + ":" + normalize(email) + ":" + birthDate_iso)`. 결과 char(64) hex |
| `crmExternalIdHash` | integrationId + crmExternalId | HMAC-SHA256 | `HMAC(crmExternalIdHashPepperRef, integrationId + ":" + crmExternalId)`. char(64) hex |
| `changeIdentityKey` | integrationId + entity + crmExternalId + providerVersionToken | HMAC-SHA256 | `HMAC(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)`. char(64) hex |
| `rrnFingerprint` | RRN normalized | HMAC-SHA256 | `HMAC(rrnFingerprintPepperRef, rrnNormalized)`. char(64) hex. UI에는 prefix 4 hex만 노출 |
| `credentialFingerprint` | integrationId + secretVersionId | HMAC-SHA256 | `HMAC(auditPepperSecretRef, integrationId + ":" + secretVersionId)`. char(64) hex. UI prefix 8 hex |
| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |

normalize 규칙:
- name: 공백 제거 + lowercase + Unicode NFKC
- phone: 숫자만 추출 (국가코드 +82 포함)
- email: lowercase + 도메인 IDNA-encoded
- birthDate: ISO 8601 YYYY-MM-DD

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command + mode matrix

| 종류 | 함수 | 책임 | 권한 | bi-directional | outbound-only |
|---|---|---|---|---|---|
| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
| 실행 | `processInboundWebhook` | webhook 수신 | system | 허용 | endpoint 미등록 (HTTP 404). direct invocation → runtime fail |
| 실행 | `pushOutbound(entity, recordId, operation): PushOutboundResult` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
| 실행 | `resolveConflict(input: ResolveConflictInput): ResolveConflictResult` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
| 실행 | `recoverRrnFalsePositive(input: RecoverRrnInput): RecoverRrnResult` | RRN 복구 | super-admin | 허용 | 허용 |
| 실행 | `applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` | 환자 동의 철회 | super-admin | 허용 | 허용 |
| 실행 | `resetCredentialRotation(input: ResetCredentialRotationInput): ResetCredentialRotationResult` (CS4-07) | reverted → stable 명시적 reset | super-admin | 허용 | 허용 |
| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |
| 운영 | `unregisterIntegration` | § 4.7 정책 | super-admin | 허용 | 허용 |
| 운영 | `rotateCredential` | rotation § 4.5 | super-admin | 허용 | 허용 |

### 3.1.1 audit log contract (7종 AuditAction)

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy·unregisterPolicySnapshot | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprintPrefix·newCredentialFingerprintPrefix·rotationAttemptId·resultState | super-admin |
| `crm-rrn-false-positive-recovered` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason | super-admin |
| `crm-rrn-rejection-finalized` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus="rejected-rrn-final"·actorRole·reason | super-admin |
| `crm-consent-withdrawal-applied` | `"crm-consent:" + withdrawalLedgerId` | scope·keyType·keyPrefix(0..8)·matchedRecordCount·tombstoneChangeLogIds·integrationId·dryRun·reason | super-admin |

### 3.2 v1.0 운영 이벤트 canonical schema

```ts
type ReservationSubmission = {
  submissionId: string;
  reservationPageRef: Ref<C-20>;
  ctaConfigRef?: Ref<CT-03>;
  source?: string; campaign?: string;
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "synced-failed";
  piiHash: string;                                       // § 2.3.1 알고리즘
  displayHints: ContactDisplayHints;
  operationalHints: ReservationOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;                            // crmExternalId 채워지면 동시에 산정
};

type Inquiry = {
  inquiryId: string; source?: string;
  inquiryType: "general" | "appointment-related" | "billing" | "other";
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "responded-on-crm";
  piiHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: InquiryOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;
};

type ConversionEvent = {                                 // outbound-only entity. PII 없음
  conversionEventId: string;
  eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
  occurredAt: Date;
  pageRef?: string;                                      // string ref
  attributionSource?: string;
};

type Contact = {
  contactId: string;
  crmExternalId: string;
  crmExternalIdHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: ContactOperationalHints;
  lastSyncedAt: Date;
  consentWithdrawn: boolean;
};
```

#### 3.2.1 ContactDisplayHints — closed schema 6 column

| 필드 | 타입 | DB CHECK (PostgreSQL) | application validator (canonical) |
|---|---|---|---|
| `nameInitial` | varchar(8) | `length ≤ 8 AND value ~ '^[가-힣A-Za-z]'` | 정규식 `^[\p{L}](O\*?)?$` |
| `phoneLast4` | char(4) | `value ~ '^[0-9]{4}$'` | 동일 |
| `emailDomain` | varchar(64) | `value ~ '^@[a-z0-9.-]+$'` | 동일 |
| `cityName` | varchar(32) | `length ≤ 32 AND value ~ '^[가-힣 ]+$'` | 행정구역 allowlist (CrmAdminRegionAllowlist v1.x — CS-19) |
| `genderHint` | enum(`male`·`female`·`other`·`unknown`) | enum constraint | enum |
| `ageBand` | enum(`teen`·`20s`·`30s`·`40s`·`50s`·`60+`·`unknown`) | enum constraint | enum |

DB CHECK는 PostgreSQL canonical. 타 DB 이식 시 dialect 재정의.

#### 3.2.2 operationalHints — privacy-sensitive metadata (CS4-05)

operationalHints는 raw PII 아니지만 **준식별자 결합 위험** (소규모 의료기관 환경 등):

| 필드 | 분류 | retention | 운영자 화면 접근 | export |
|---|---|---|---|---|
| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
| `inquiryType` | non-sensitive | 동일 | 동일 | 허용 |
| `channelType` | non-sensitive | 동일 | 동일 | 허용 |
| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
| `departmentHint` | **준식별자** (희소 진료과 결합 위험) | operationalHintsRetentionDays | 동일 | masking |
| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
| `relationToInstitution` | **준식별자** | operationalHintsRetentionDays | 동일 | masking |
| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |

**small-cell suppression** (CS4-05·CS5-05):

| 항목 | 정의 |
|---|---|
| threshold | 동일 cell 카운트 < 5 (k-anonymity 보수적 기준 — 개인정보보호법 §28-2 가명정보 처리 가이드라인 참조) |
| cell 정의 | `(locationKey, departmentHint, desiredVisitDate)` 조합 |
| 적용 범위 | (1) queryCrmRecords UI 렌더링, (2) CSV/JSON export, (3) 통계·분석 화면, (4) admin dashboard 집계 |
| 집계 window | 운영 정책: 최근 30일·90일·365일 동시 적용 (가장 작은 cell 기준으로 suppression) |
| drilldown 금지 | suppressed cell의 row-level drilldown 금지. drilldown 시 다른 cell 결합으로 재식별 가능 |
| complementary suppression | suppressed cell 합계가 노출되면 보완 마스킹 필수 — `total - suppressedCount`로 역추론 방지 |
| export 동일 적용 | export도 화면과 동일 룰. raw cell count 절대 export 금지 |
| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |

법무 근거:
- 개인정보보호법 §28-2 (가명정보 처리)
- 통계청 가이드라인: 통계조사 결과 작성 시 단위·세부 집계 cell 5 미만 보호
- 추후 별도 `docs/compliance/PRIVACY_COMMON.md` SoT 신설 시 본 절은 참조로 변경 (CS-23 신규 open)

**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
- displayHintsRetentionDays 만료: displayHints만 nulling
- operationalHintsRetentionDays 만료: 준식별자/민감 operationalHints nulling
- unregisterIntegration: § 4.7 표

**CRM 콘솔 raw 접근 (CS5-04 풀 전개)**:
- **SSO**: 의료기관·Glitzy 계정 분리. solution 운영자가 CRM 직접 접근하려면 별도 CRM SSO 필요. solution super-admin 권한 ≠ CRM admin 권한
- **role mapping**: CRM 측 권한은 의료기관 책임. Glitzy 솔루션은 권한 위임 안 함
- **deep link**: queryCrmRecords 결과의 `crmExternalId`로 CRM 콘솔 deep link 생성 가능. config `crmConsoleBaseUrl` v1.x (CS-20). v1.0은 link 미제공 — 운영자가 CRM 콘솔에서 별도 검색
- **audit 책임**: CRM 콘솔 접근은 CRM provider 측 audit log 책임 (Salesforce Login History·HubSpot Audit Trail 등). solution audit log는 CRM 콘솔 접근 추적 불가 — 본 문서 audit scope 외

### 3.3 Command DTO (CS4-10)

#### 3.3.1 `RunSyncInput`·`RunSyncResult`

```ts
type RunSyncInput = {
  instanceId: string;
  manifestVersion: string;
  direction: "inbound" | "outbound" | "both";  // outbound-only mode는 "outbound" 강제
  mode: "scheduled" | "on-demand";
  idempotencyKey: string;                       // UNIQUE per instance
  windowStart?: Date; windowEnd?: Date;
  forceRefresh?: boolean; refreshIntentId?: string;
};

type RunSyncResult = {
  syncLogId: string;
  envelopeState: "succeeded" | "partial" | "failed" | "retried";
  perEntity: Array<{
    entity: "reservation" | "contact" | "inquiry" | "conversion-event";
    direction: "inbound" | "outbound";
    result: SourceAttemptStatus;
    counts: { recordsInbound: number; recordsOutbound: number; conflictsDetected: number };
  }>;
};
```

#### 3.3.2 `PushOutboundResult`

```ts
type PushOutboundResult = {
  status: "pushed" | "queued-retry" | "blocked-rrn" | "blocked-consent-withdrawn" | "cas-conflict-detected";
  crmExternalId?: string;
  crmExternalIdHash?: string;
  conflictRecordId?: string;
};
```

#### 3.3.3 `ResolveConflictInput`·Result

```ts
type ResolveConflictInput = {
  conflictId: string;
  resolution: "crm-wins" | "solution-wins" | "manual-resolved" | "manual-rejected";
  resolvedBy: string;
  reason?: string;
  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
};

type ResolveConflictResult = {
  resolution: ResolveConflictInput["resolution"];
  appliedFieldVersion: number;
  winningVersion: number;
};
```

#### 3.3.4 `RecoverRrnInput`·Result

```ts
type RecoverRrnInput = {
  ledgerId: string;
  action: "override-and-fetch" | "abandon";
  reason: string;                               // ✅ 운영 감사용
  actorNote?: string;
  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
  dryRun?: boolean;
};

type RecoverRrnResult = {
  finalStatus: "accepted-processed" | "rejected-rrn-final";
  newCrmRecordId?: string;
  rrnFingerprintPrefix: string;                 // 4 hex
};
```

#### 3.3.5 `ApplyConsentWithdrawalInput`·Result (CS4-01·10 — discriminated)

```ts
type ApplyConsentWithdrawalInput =
  | {
      integrationId: string;
      keyType: "piiHash";
      piiHash: string;                          // § 2.3.1 알고리즘으로 산정. canonical 64 hex
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;                   // 중복 적용 방지
      dryRun?: boolean;
    }
  | {
      integrationId: string;
      keyType: "crmExternalId";
      crmExternalId: string;                    // raw — 내부에서 crmExternalIdHash로 변환
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;
      dryRun?: boolean;
    };

type ApplyConsentWithdrawalResult = {
  withdrawalLedgerId: string;
  keyType: "piiHash" | "crmExternalIdHash";     // canonical hash로 변환 후 저장됨
  keyHashPrefix: string;                        // 8 hex
  scope: "all" | "marketing-only";
  matchedRecordCount: number;
  tombstoneChangeLogIds: string[];
  displayHintsNulled: boolean;
  operationalHintsNulled: { /* 필드별 nulling 여부 */ };
  dryRun: boolean;
};
```

**경로별 매칭 키 (CS4-01)**:

| 경로 | 매칭 키 SoT |
|---|---|
| webhook inbound | rawBody에서 piiHash 산정 (provider별 PII field path는 adapter config) → CrmConsentWithdrawalLedger lookup |
| polling inbound | provider list API 응답에서 piiHash 산정. piiHash 산정 불가능한 record는 crmExternalIdHash로 lookup |
| outbound push | solution record의 piiHash와 crmExternalIdHash 둘 다 lookup |
| applyConsentWithdrawal | input.keyType discriminant |

#### 3.3.6 `ResetCredentialRotationInput`·Result (CS4-07)

```ts
type ResetCredentialRotationInput = {
  integrationId: string;
  revertedVersionId: string;                    // CredentialVersion.state="reverted" row
  reason: string;
  actorNote?: string;
  expectedIntegrationState: "reverted";         // CAS
};

type ResetCredentialRotationResult = {
  integrationState: "stable";
  revokedVersionId: string;                     // 이전 reverted row → state="revoked"
  rotationAttemptId: string;
};
```

audit `crm-credential-rotated` metadata `resultState="reset"` 추가.

### 3.4 webhook 처리

```ts
async function processInboundWebhook(
  integrationId: string,
  headers: Record<string,string>,
  rawBody: Buffer,
  fullUrl: string,
  method: string
): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
        | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
        | "rejected-consent-withdrawn" | "queued" | "deduped";
  recordsProcessed: number;
  conflicts: number;
  nonceLedgerStatus?: "new" | "duplicate-eventid" | "duplicate-eventid-bucket" | "duplicate-digest";
  changeIdentityStatus?: "new" | "duplicate";
}>;
```

#### 3.4.1 ProviderWebhookVerifier (CS5-04 풀 전개 + providerVersionToken required — CS4-04)

```ts
interface ProviderWebhookVerifier {
  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
}

type VerifierResult = {
  signatureValid: boolean;
  providerEventId: string | null;
  providerTimestamp: Date | null;
  canonicalDigest: string;
  deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
  retrySemantics: "provider-retries" | "no-retry";
  providerVersionToken: string;                 // CS4-04 — v1.0 required. null이면 build fail
  errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
};
```

#### 3.4.2 provider별 adapter contract

| Provider | payload | signature | timestamp | eventId | canonical | providerVersionToken | v1.0 |
|---|---|---|---|---|---|---|---|
| Salesforce Outbound Messages | XML SOAP | HMAC-SHA256(secret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` | XML `SystemModstamp` ISO8601 | ✅ |
| Salesforce Platform Events | JSON CometD | HMAC-SHA256 (orgId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 | `replayId` integer | ✅ |
| HubSpot | JSON | HMAC-SHA256(secret, `method + url + body + ts`) | `X-HubSpot-Request-Timestamp` | header/body `eventId` | provider 정의 | `propertyChange.versionTimestamp` 또는 `updatedAt` | ✅ |
| generic-rest-api | JSON | HMAC-SHA256(secret, canonicalString) | config | config | config | config `versionTokenJsonPath` (✅ — § 2.3) | ✅ |

#### 3.4.3 InboundProcessingContext — **discriminated union** (CS4-03)

```ts
type InboundProcessingContext = WebhookInboundContext | PollingInboundContext;

type WebhookInboundContext = {
  kind: "webhook";
  integrationId: string;
  verifierResult: VerifierResult;
  rawBody: Buffer;
  parsedPayload: ParsedCrmPayload;
  receivedAt: Date;
  nonceLedgerId: string;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

type PollingInboundContext = {
  kind: "polling";
  integrationId: string;
  pollRunId: string;
  providerCursor: string;                       // 이전 polling 종료점
  parsedPayload: ParsedCrmPayload;
  observedAt: Date;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
type NormalizedInboundChange = {
  entity: "reservation" | "contact" | "inquiry" | "conversion-event";
  crmExternalId: string;
  crmExternalIdHash: string;
  piiHash: string | null;                       // PII 없는 entity는 null
  providerVersionToken: string;
  expectedCrmVersion: number;                   // § 4.3.5 산정 규칙
  proposedDisplayHints: ContactDisplayHints | null;
  proposedOperationalHints: AnyOperationalHints | null;
  changedFieldTokens: string[];
};
```

webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.

### 3.4.4 ChangeIdentityKey (CS4-04 책임 분리)

- **CrmWebhookNonceLedger**: **transport-level dedupe** — webhook delivery 중복(provider retry·재전송). polling 미사용
- **CrmChangeIdentityLedger**: **record-level dedupe** — 같은 CRM 변경이 webhook과 polling 양쪽으로 들어와도 1번만 처리

```
changeIdentityKey = HMAC-SHA256(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)
```

providerVersionToken=null인 provider는 **v1.0 build fail** (CS4-04) — record-level dedupe 보장 불가능하므로 v1.0 운영 불가.

---

## 4. sync 파이프라인

### 4.1 outbound

```
1. pushOutbound(entity, recordId, operation)
2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
4. RRN 검사 — 검출 시 차단
5. **consent withdrawal lookup** — piiHash·crmExternalIdHash 모두 검사 → 매칭 시 PushOutboundResult.status="blocked-consent-withdrawn"
6. credential state 검사 (§ 4.5.3)
7. rate limit token
8. CRM API call (idempotency-key)
9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
   → 0 rows → ConflictRecord
10. CrmRecordChangeLog insert
```

### 4.2 inbound

```
[webhook 경로]
1. mode="outbound-only" → 404
2. ProviderWebhookVerifier.verify → VerifierResult (signatureValid=false → HTTP 401)
3. providerTimestamp 검증 → rejected-stale-timestamp
4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
   - exactly-once: `(integrationId, providerEventId)`
   - at-least-once + eventId: `(integrationId, providerEventId, receivedBucket)`
   - at-least-once no-eventId 또는 best-effort: `(integrationId, canonicalDigest, receivedBucket)`
   - 중복 → "duplicate-eventid" / "duplicate-eventid-bucket" / "duplicate-digest" → HTTP 200 deduped
5. RRN 검사 → rejected-rrn-recoverable / rejected-rrn-final
6. payload parsing → NormalizedInboundChange 생성
7. **consent withdrawal lookup** (piiHash·crmExternalIdHash) → 매칭 시 → status="rejected-consent-withdrawn"
8. closed-schema validator
9. **CrmChangeIdentityLedger insert** — UNIQUE(changeIdentityKey). 중복 → "duplicate" → HTTP 200 deduped (polling이 이미 처리)
10. CAS 갱신
11. NonceLedger status "accepted-processed"

[polling 경로]
1. 다음 page provider list API → parsed payload
2. consent withdrawal lookup
3. closed-schema validator
4. **CrmChangeIdentityLedger insert** — UNIQUE 충돌 시 skip (webhook이 이미 처리)
5. CAS 갱신
```

#### 4.2.1 RRN false positive 복구 (CS5-04 풀 전개)

`recoverRrnFalsePositive(input: RecoverRrnInput)` (§ 3.3.4):

```
1. ledger row 조회 — CrmWebhookNonceLedger.status="rejected-rrn-recoverable"만 허용
   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
   - 다른 status → runtime fail
2. action="override-and-fetch":
   a. CRM live pull — provider별 list API 또는 single-record API
      - lookup key: ledger row의 providerEventId 또는 last-known crmExternalId (있을 시)
   b. CRM에서 raw payload 재취득
   c. asset-ingestion § 9.1 RRN checksum 재실행
      - regex `\b\d{6}-?[1-8]\d{6}\b` 후보 추출
      - 생년월일·성별 코드 유효성 검사
      - checksum: 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + (11-(sum%11))%10 검증
   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
      - ledger status → "accepted-processed"
      - newCrmRecordId 채움
      - audit `crm-rrn-false-positive-recovered` metadata (priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason)
   e. 재검출 (RRN 진짜) → ledger status → "rejected-rrn-final"
      - audit `crm-rrn-rejection-finalized`
3. action="abandon":
   - ledger status → "rejected-rrn-final"
   - audit `crm-rrn-rejection-finalized` metadata (priorStatus·finalStatus·actorRole·reason)
4. input.dryRun=true → 1·2c까지만 수행. ledger·CrmRecord 미변경. RecoverRrnResult.finalStatus는 예상값만 반환
5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
```

### 4.3 field-level 충돌 해결 + CAS

#### 4.3.1 FieldAuthority

```ts
type FieldAuthority =
  | "crm-authoritative"
  | "solution-authoritative"
  | "last-write-wins-timestamp"
  | "last-write-wins-version";
```

#### 4.3.2 CAS SQL

```sql
-- inbound
UPDATE crm_record
SET display_hints_name_initial=$1, /* ... */,
    operational_hints_department_hint=$N, /* ... */,
    crm_version=$newCrmVersion, last_synced_at=$now
WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSolutionVersion;

-- outbound
UPDATE crm_record
SET solution_version=solution_version+1, crm_external_id=$crmId, crm_external_id_hash=$crmIdHash, last_synced_at=$now
WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expectedCrmVersion;
```

0 rows → ConflictRecord 생성.

#### 4.3.3 ConflictRecord (field-level)

| 필드 | 의미 |
|---|---|
| `fieldPath` | "displayHints.phoneLast4" 등 |
| `baseVersion` | 충돌 직전 record-level |
| `winningVersion` | resolve 시 적용 |
| `appliedFieldVersion` | 동일 fieldPath·동일 이하 재충돌 차단 |
| `winningSide` | "crm" \| "solution" \| "manual" |

#### 4.3.4 manual escalate 결정표

| 조건 | escalate? |
|---|---|
| FieldAuthority=last-write-wins-timestamp + timestamp 차이 ≤ 5s + version tie | ✅ |
| FieldAuthority=last-write-wins-version + version tie | ✅ |
| FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
| 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 | ✅ |
| FieldAuthority=crm/solution-authoritative | ❌ |

#### 4.3.5 expectedCrmVersion 산정

| provider | providerVersionToken | expectedCrmVersion |
|---|---|---|
| Salesforce Outbound Messages | `SystemModstamp` ISO | epoch ms |
| Salesforce Platform Events | `replayId` | 직접 사용 |
| HubSpot | `versionTimestamp` 또는 `updatedAt` | epoch ms |
| generic-rest-api | config path 추출 | epoch ms 또는 integer (config type) |
| polling | list API `lastModified` 등 | epoch ms |

### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)

### 4.5 credential rotation (CS4-02·07)

#### 4.5.1 CrmCredentialVersion entity — § 13.11

#### 4.5.2 두 enum invariant 표

**CrmIntegration.credentialState** 5상태. **CrmCredentialVersion.state** 6상태.

| Integration state | CredentialVersion rows | 의미 |
|---|---|---|
| stable | 1 row `state=active` (others `revoked`) | 정상 |
| rotating | 1 `active`(이전) + 1 `rotating-target`(신규) | rotation 진행. outbound new 우선·old fallback. inbound active + rotating-target 병행 |
| committed | 1 `committed`(이전·graceUntil) + 1 `active`(신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil) |
| grace-expired | 1 `active`(신규) (others `revoked`/`grace-expired`) | committed graceUntil 도래. outbound/inbound active만 |
| reverted | 1 `active`(원래) + 1 `reverted`(신규 실패) | rotation 실패 |

#### 4.5.3 outbound/inbound 사용 matrix

| Integration state | outbound 사용 | inbound verifier 허용 |
|---|---|---|
| stable | active | active만 |
| rotating | rotating-target 우선·active fallback | active + rotating-target 병행 |
| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
| grace-expired | active(신규) only | active만 |
| reverted | active(원래) | active만 |

#### 4.5.4 rotateCredential — DB-level concurrency 강제 (CS4-02)

```sql
BEGIN;
-- 1. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integrationId FOR UPDATE;
-- 2. 현재 state 확인 (stable만 허용 — CAS)
-- 3. 새 CredentialVersion insert (state='rotating-target')
INSERT INTO crm_credential_version (id, integration_id, secret_ref, secret_version_id, state, activated_at, ...) VALUES (...);
-- 4. integration state → 'rotating'
UPDATE crm_integration SET credential_state='rotating' WHERE id=$integrationId AND credential_state='stable';
-- 5 rows affected 검증 (CAS)
COMMIT;
```

**DB partial unique 강제** (§ 13.11):
- `UNIQUE(integration_id) WHERE state='active'` — active row 1개만
- `UNIQUE(integration_id) WHERE state='rotating-target'` — rotating-target 1개만
- `UNIQUE(integration_id) WHERE state='committed'` — committed 1개만

→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.

health check 결과 처리:
- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
- 실패 → BEGIN; SELECT FOR UPDATE → 신규 rotating-target → reverted → integration state 'reverted'; COMMIT;

#### 4.5.5 resetCredentialRotation (CS4-07)

§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
- reverted CredentialVersion row → state="revoked"
- integration credentialState → "stable"
- audit `crm-credential-rotated` metadata `resultState="reset"·rotationAttemptId·reason`

#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)

cadence: 10분. 매 cycle:

```sql
-- 1. committed credential version (graceUntil 도래) 조회
SELECT integration_id, id AS committed_version_id, grace_until
FROM crm_credential_version
WHERE state='committed' AND grace_until <= now()
FOR UPDATE SKIP LOCKED
LIMIT $batch;

-- 2. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integration_id FOR UPDATE;

-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
UPDATE crm_credential_version SET state='grace-expired', revoked_at=now()
WHERE id=$committed_version_id;

-- 4. integration credentialState → 'grace-expired' (단일 transaction)
UPDATE crm_integration SET credential_state='grace-expired'
WHERE id=$integration_id AND credential_state='committed';

-- 5. audit CrmCredentialAuditLog event='grace-expired' insert

COMMIT;

-- 후속 (별도 cycle): 운영자 검토 후 또는 일정 지연 후 grace-expired → revoked로 정리
-- v1.0은 grace-expired에서 운영자 개입 없이 정리할지 별도 정책 (CS-22 신규 open)
```

실패 시: sink alert + 다음 cycle 재시도. 3회 실패 → super-admin alert + integration manual review 큐.

**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.

### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개

```sql
-- claim
WITH next AS (
  SELECT id FROM crm_sync_notification_outbox
  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;

-- transient fail
UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;

-- exhausted
UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
```

### 4.7 unregister 정책 표 (CS4-06 precedence 추가)

`unregisterIntegration(integrationId, options)`:

**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.

| 대상 | 즉시 액션 | 보존 | legalHold default | FK ON DELETE |
|---|---|---|---|---|
| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
| CrmRecord.displayHints* | nulling (option `keepDisplayHints=false` 기본) | row 유지 | false | — |
| CrmRecord.operationalHints* | non-sensitive 유지·sensitive nulling (§ 3.2.2) | row 유지 | false | — |
| CrmRecordChangeLog | row 유지 (audit) | retentionDays.changeLog | false (tombstone는 true) | RESTRICT |
| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecord | false | RESTRICT |
| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | false | RESTRICT |
| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notificationOutbox | false | RESTRICT |
| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | false | RESTRICT |
| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog | false | RESTRICT |
| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
| webhook endpoint | 미등록 (HTTP 404) | — | — | — |
| inbound polling | 중단 | — | — | — |

audit `crm-integration-unregistered` metadata `unregisterPolicySnapshot` (options) 포함.

`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).

### 4.8 consent withdrawal (CS4-01 강화)

`applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` (§ 3.3.5):

```
1. input.keyType discriminant 확인. piiHash → § 2.3.1 canonical algorithm. crmExternalId → crmExternalIdHash로 변환
2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
3. `(integrationId, idempotencyKey)` lookup:
   - **존재 + requestFingerprint 일치** → same-request replay → 기존 ledger 결과 반환 (no-op)
   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
   - **미존재** → 다음 단계
4. dryRun=true → matchedRecordCount만 산정·반환. DB 미변경 (ledger 미insert)
5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
6. CrmRecord(s) 매칭 (keyType별):
   - piiHash: WHERE pii_hash = $piiHash
   - crmExternalIdHash: WHERE crm_external_id_hash = $crmExternalIdHash
7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
8. scope="marketing-only": displayHints nulling만
9. 향후 inbound — § 4.2 step 7에서 piiHash·crmExternalIdHash 둘 다 lookup → rejected-consent-withdrawn
10. 향후 outbound — § 4.1 step 5에서 둘 다 lookup → blocked-consent-withdrawn
11. audit `crm-consent-withdrawal-applied`
```

v1.x에서 patientConsentEvidenceRef 도입 시 record-level evidence 연결 (CS-07).

---

## 5. provider 어댑터 (v1.0 — 3종)

§ 3.4.2 contract. korean-emr v1.x (CS-13).

### 5.1 rate limit (CrmRateLimitState — § 13.10)

---

## 6. 알림

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | critical | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox — § 4.6 SQL

### 6.3 매핑

| eventType | sourceKind | sourceId | contentRef |
|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` |
| `crm-sync-credential-expired` | `credential-version` | `integrationId:credentialVersionId` | `"crm-integration:" + integrationId` |
| `crm-sync-credential-expiring-soon` | `credential-version` | 동일 | 동일 |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`.

---

## 7. PII 처리 (CS4-05 강화)

### 7.1 closed schema + privacy-sensitive operational hints

- displayHints: 6 column closed schema (§ 3.2.1)
- operationalHints: entity별 column + privacy classification 표 (§ 3.2.2)
- changedFields/snapshot: allowlisted field token + masked value/enum
- DB CHECK + application validator 양층

### 7.2 RRN deny (CS5-04 풀 전개)

- `pii.ssnRrnHandling="deny"` 강제 — build fail if other value (§ 10.1)
- RRN 검사 알고리즘 (asset-ingestion § 9.1 재사용 — 본 문서 stand-alone 위해 알고리즘 명시):
  1. 후보 추출 정규식: `\b\d{6}-?[1-8]\d{6}\b`
  2. 생년월일·성별 코드 유효성 검사 (6자리 YYMMDD + 7번째 자리 1-8)
  3. checksum: 가중치 `[2,3,4,5,6,7,8,9,2,3,4,5]` × 각 자리 합 → `(11-(sum%11))%10`이 마지막 자리와 일치
- 검출 시 (inbound webhook·polling):
  - payload 폐기. CrmRecord 미생성·미갱신
  - CrmWebhookNonceLedger row 보존 + rrnFingerprint (§ 2.3.1) + status="rejected-rrn-recoverable" 또는 "rejected-rrn-final"
  - 운영자 alert + sink alert
- 검출 시 (outbound push):
  - push 차단. solution record는 그대로 유지
  - 운영자 alert + sink alert
- false positive 복구: § 4.2.1 `recoverRrnFalsePositive`

### 7.3 raw PII 실시간 조회 — v1.x (CS-14)

### 7.4 DPA vs patient consent

- DPA: `dpaEvidenceRef` 필수
- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger
- patientConsentEvidenceRef record-level: v1.x (CS-07)

### 7.5 displayHints expiry + operationalHints expiry (CS4-05)

precedence: legalHold > unregister > expiry > consent withdrawal.

- displayHintsRetentionDays 만료 → displayHints 6 column nulling. ChangeLog tombstone
- operationalHintsRetentionDays 만료 → 준식별자/민감 operationalHints nulling. non-sensitive 유지
- legalHold=true row는 skip

---

## 8. 운영 지표 + acceptance test (CS4-09 — invariant 별 fixture 재편)

### 8.1 핵심 지표 (§ 8.1)

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | > 99% | |
| outbound push 지연 p95 | < 5s | |
| inbound webhook 지연 p95 | < 10s | |
| 충돌 발생율 | < 1% | |
| credential 만료 알림 SLA | 7일 | > 95% |
| RRN deny | baseline | |
| RRN false positive 복구 SLA | 24h | > 90% |
| webhook signature reject율 | < 0.1% | |
| nonce ledger dedupe | baseline | |
| changeIdentity ledger dedupe | baseline | |
| outbox 성공율 | > 99% | |
| CAS lost-update 감지율 | baseline | |
| operationalHints small-cell suppression 적중률 | baseline | |
| consent withdrawal 적용 누계 | baseline | |

### 8.2 acceptance test (CS4-09 — invariant 별 fixture)

invariant 별 fixture 구조 (개수보다 invariant coverage):

#### INV-MANIFEST (build-time)
- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)

#### INV-WEBHOOK-DEDUPE (transport-level)
- provider별 valid/invalid signature·rawBody integrity
- timestamp window
- exactly-once 재전송 → duplicate-eventid
- at-least-once + eventId 재전송 → duplicate-eventid-bucket (same bucket)
- at-least-once + eventId 다른 bucket → 정상 처리
- at-least-once + no-eventId → duplicate-digest
- best-effort → duplicate-digest

#### INV-CHANGE-IDENTITY (record-level)
- webhook + polling 동일 변경 → CrmChangeIdentityLedger UNIQUE → 1번만 처리
- 동시 webhook×2 → CrmWebhookNonceLedger 1차로 차단

#### INV-RRN
- regex + checksum 통과 RRN → 폐기 + ledger recoverable
- recoverRrnFalsePositive(override-and-fetch) → accepted-processed
- recoverRrnFalsePositive(abandon) → rejected-rrn-final
- invalid expectedPriorStatus → runtime fail
- dryRun → DB 미변경

#### INV-OUTBOUND-ONLY
- processInboundWebhook direct → runtime fail
- runSync direction=inbound → runtime fail
- webhook endpoint → 404
- CrmFieldMapping direction=inbound → build fail

#### INV-RETRY
- maxAttempts 도달 → exhausted + sink alert
- permanent error class → failed-permanent 즉시
- stale processing (locked_at > 10분) → pending 복귀

#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
- stable → rotating → committed (성공)
- stable → rotating → reverted (실패)
- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
- committed → grace-expired (worker)
- grace-expired worker 3회 실패 → super-admin alert
- reverted + resetCredentialRotation → stable (CS4-07)
- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
- rotating 중 outbound + inbound 동시 → 모두 성공 (active·rotating-target 병행 verifier)

#### INV-CAS
- 동시 inbound + outbound 같은 record → 1 성공 + 1 ConflictRecord
- field-level manual resolve 후 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 차단
- providerVersionToken=null → build fail (사전 차단)

#### INV-PII (closed schema)
- 자유 JSON insert → DB CHECK reject
- 정규식 위반 insert → validator reject
- ContactDisplayHints 6 column 외 필드 추가 시도 → 거부
- changedFields allowlist 위반 → 거부

#### INV-OPERATIONAL-HINTS (CS4-05)
- desiredVisitDate + locationKey + departmentHint 결합 small-cell (<5) → masking
- export 시 desiredVisitDate·guardianInvolved 제거
- queryCrmRecords 권한 검사 — operator는 sensitive operationalHints 미반환

#### INV-CONSENT-WITHDRAWAL (CS4-01)
- applyConsentWithdrawal(keyType=piiHash) → matched record displayHints nulling
- applyConsentWithdrawal(keyType=crmExternalId) → crmExternalIdHash로 변환 + matching
- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
- scope=marketing-only → displayHints nulling만
- dryRun → matchedRecordCount만 반환
- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
- 향후 inbound webhook 매칭 → rejected-consent-withdrawn
- 향후 polling 매칭 → skip
- 향후 outbound push 매칭 → blocked-consent-withdrawn

#### INV-UNREGISTER (CS4-06 precedence)
- displayHints nulling·queue cancel·ledger 보존
- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
- legalHold > unregister snapshot > retention purge

#### INV-PURGE
- retentionDays.changeLog → delete
- retentionDays.syncLog → delete
- retentionDays.conflictRecord → delete (non-open만)
- retentionDays.notificationOutbox → delete (sent·permanent만)
- webhookNonceLedgerRetentionMinutes → delete
- retentionDays.consentWithdrawalLedger + legalHold=false → delete
- legalHold=true → skip
- displayHintsRetentionDays → nulling
- operationalHintsRetentionDays → 준식별자/민감 nulling
- failure → sink alert + 다음 cycle 재시도

#### INV-MIGRATION (CS4-09)
- v0.4 → v0.5 운영 데이터 부재 전제. existing row 0건 cycle
- 만약 운영 데이터 발생 후 column 추가 — backward-compatible (nullable default)

#### INV-CASCADE
- 7종 AuditAction insert 성공
- 4종 NotificationEventType emit 성공
- DATA_MODEL C-08 v0.20 `genericRestApiAdapter` 5필드 + `versionTokenType` cascade 동기화 build validator
- DATA_MODEL C-08 v0.20 `versionTokenJsonPath` 누락 → build fail (CS5-01)

### 8.3 § 10 rule → § 8.2 fixture traceability 표 (CS5-06)

§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:

| § 10 rule (build/runtime/invariant) | INV fixture group |
|---|---|
| § 10.1 legalApproved=false | INV-MANIFEST |
| § 10.1 korean-emr provider | INV-MANIFEST |
| § 10.1 appointment enabled | INV-MANIFEST |
| § 10.1 rawPiiStorageAllowed=true | INV-MANIFEST |
| § 10.1 ssnRrnHandling≠deny | INV-MANIFEST |
| § 10.1 dpaEvidenceRef 누락 | INV-MANIFEST |
| § 10.1 outbound-only + 부정합 conflictResolution | INV-MANIFEST + INV-OUTBOUND-ONLY |
| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
| § 10.1 providerVersionToken=null provider | INV-MANIFEST + INV-CHANGE-IDENTITY |
| § 10.1 liveReadEnabled=true | INV-MANIFEST |
| § 10.1 fieldMappingPolicyVersion 누락 | INV-MANIFEST |
| § 10.1 hashSecrets.* 5종 누락 | INV-MANIFEST |
| § 10.2 webhook signature 실패 | INV-WEBHOOK-DEDUPE |
| § 10.2 replay window 초과 | INV-WEBHOOK-DEDUPE |
| § 10.2 inbound RRN 검출 | INV-RRN |
| § 10.2 outbound RRN 검출 | INV-RRN |
| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
| § 10.2 outbound-only direct invocation | INV-OUTBOUND-ONLY |
| § 10.2 CAS WHERE 0 rows | INV-CAS |
| § 10.2 displayHints closed schema 위반 | INV-PII |
| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
| § 10.2 rotateCredential row LOCK state≠stable | INV-CREDENTIAL-ROTATION |
| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
| § 10.3 v0.6 migration | INV-MIGRATION |
| § 10.4 RetryQueue stale reclaim | INV-RETRY |
| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
| § 10.4 credential expiry 임박/만료 | INV-CREDENTIAL-ROTATION |
| § 10.4 PII drift 감지 | INV-PII |
| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
| § 10.4 NonceLedger RRN recoverable 24h 무처리 | INV-RRN |
| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |

이 표가 v1.0 안정판의 회귀 방지 traceability matrix.

---

## 9. 설치·설정 — DB 15 tables 마이그레이션 (§ 13)

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig`/`integrations[]` 빈
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- integration `dpaEvidenceRef` 누락
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional + `webhookSecret` 누락
- integration `provider` ∉ {salesforce, hubspot, generic-rest-api}
- `provider="generic-rest-api"` + `genericRestApiAdapter` **5필드** 중 누락 (`webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`) — DATA_MODEL C-08 v0.20 SoT
- `provider="generic-rest-api"` + `versionTokenType` ∉ {`epoch-ms`, `integer`, `string`} (CS5-01)
- `requiresFeature: notifications` 충족 안 됨
- `pii.rawPiiStorageAllowed=true`
- `pii.ssnRrnHandling !== "deny"`
- `pii.liveReadEnabled=true`
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true`
- outbound-only mode + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"`
- outbound-only mode + CrmFieldMapping `direction IN (inbound, both)` 존재
- `fieldMappingPolicyVersion` 누락
- `retentionDays.consentWithdrawalLedger`·`operationalHintsRetentionDays`·`purgeWorker.cadenceMinutes` 누락
- `hashSecrets.*` 4개 중 누락
- **provider VerifierResult `providerVersionToken=null` 정의** (v1.0 build validator가 adapter 등록 시점에 검사 — CS4-04)

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 실패 → HTTP 401
- replay window 초과 → rejected-stale-timestamp
- credential 만료 후 sync 시도 → skipped-credential-expired
- inbound RRN 검출 → 폐기 + sink alert + ledger
- outbound RRN 검출 → 차단 + alert
- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
- outbound-only + processInboundWebhook direct → runtime fail
- outbound-only + runSync inbound/both → runtime fail
- CAS WHERE 0 rows → ConflictRecord + alert
- displayHints closed schema 위반 → DB CHECK reject + validator alert
- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
- `rotateCredential` 시 integration row LOCK 후 state ≠ stable → runtime fail (이미 rotating 중)
- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)

### 10.3 migration-time validation

- v0.5 cascade 신규:
  - CrmRecord에 operationalHints* column 추가 (nullable)
  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
  - CrmChangeIdentityLedger UNIQUE + FK + ON DELETE 정책 (CS4-08)
  - hashSecrets 4종 manifest 누락 시 build fail
- 운영 데이터 부재 전제. 만약 row 존재 시 nullable default로 backward-compatible

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale (locked_at > 10분) → pending 복귀
- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 알림
- credential expiry 임박 → expiring-soon
- credential 만료 → expired + integration 자동 비활성화
- PII drift 감지 → sink alert + 운영자 정리
- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert
- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
- **purge worker (CS4-06 precedence)**:
  - 우선순위: legalHold > unregister snapshot > retention purge
  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)
  - batch: `purgeWorker.batchSize` (기본 500)
  - 테이블별 액션:
    | 테이블 | action | legal hold default |
    |---|---|---|
    | CrmSyncLog | delete | × |
    | CrmSyncSourceAttempt | delete | × |
    | CrmSyncRetryQueue (status=completed) | delete | × |
    | CrmRecordChangeLog | delete (tombstone 예외) | × (tombstone는 true) |
    | CrmConflictRecord (non-open) | delete | × |
    | CrmCredentialAuditLog | 7년 (audit) | true |
    | CrmWebhookNonceLedger | delete | × |
    | CrmChangeIdentityLedger | delete | × |
    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
    | CrmRecord.displayHints* | nulling | × |
    | CrmRecord.operationalHints* (sensitive) | nulling at operationalHintsRetentionDays | × |
    | CrmSyncNotificationOutbox (sent·permanent) | delete | × |
  - failure → sink alert + 다음 cycle 재시도

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60
- conflict open ≥ 5건 누적
- ledger `duplicate-digest` 비율 > 5%
- outbound-only + webhookSecret 설정됨
- operationalHints small-cell suppression 적중률 > 10%

---

## 11. 미결정 사항

### 11.1 open

| ID | 항목 |
|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 |
| CS-03 | 다중 CRM 통합 우선순위 |
| CS-04 | webhook endpoint 보안 (IP allowlist) |
| CS-05 | OAuth refresh token rotation 자동화 |
| CS-06 | provider별 quota 운영 가이드 |
| CS-08 | LLM 기반 field auto-mapping |
| CS-09 | CrmFieldMapping bulk import/export |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 |
| CS-15 | CONTENT_STANDARDS submission/event cascade — v1.0은 § 3.2 canonical |
| CS-18 | `@provenanceCrmRecordId` 공통 메타 |
| CS-19 | CrmAdminRegionAllowlist 행정구역 lookup table |
| CS-20 | `crmConsoleBaseUrl` config + deep link |
| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
| CS-22 | grace-expired → revoked 자동 정리 정책 (CS5-03) — v1.0은 grace-expired row 보존 |
| CS-23 | `docs/compliance/PRIVACY_COMMON.md` SoT 신설 (CS5-05) — 의료광고 외 일반 privacy 가이드 |

### 11.2 deferred-v1.x

| ID | 항목 | v1.0 영향 |
|---|---|---|
| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + ConsentWithdrawalLedger 최소 범위 |
| CS-11 | CRM → Core 자동 promote | 수동 |
| CS-12 | appointment entity | build fail로 차단 |
| CS-13 | korean-emr provider | build fail로 차단 |
| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |

### 11.3 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CS-01~~ | RRN deny — v0.2 + checksum 재사용 |
| ~~CS-14 v1.0 cascade~~ | liveRead v1.x로 내림 |

### 11.4 known limitations (CS4-09)

- providerVersionToken=null provider는 v1.0 build fail (CS4-04) — record-level dedupe 보장 불가능
- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 21 지적 반영 |
| 2026-05-14 | v0.3 | codex 2차 17 지적 반영 |
| 2026-05-14 | v0.4 | codex 3차 17 지적 반영 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-14 | v0.5 | codex 4차 비평 13 지적 전건 수용 + stand-alone SoT 강화 |
| 2026-05-14 | v0.6 | codex 5차 비평 6 지적 전건 수용 |
| 2026-05-14 | v0.7 | codex 6차 비평 1 지적 정정 (CS6-01) |
| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables**)

### 13.1 `CrmIntegration`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationKey` | string | ✅ |
| `provider` | enum (salesforce·hubspot·generic-rest-api) | ✅ |
| `apiKeySecretRef` | secretRef | ✅ |
| `apiUrl` | string | ✅ |
| `webhookSecret` | secretRef | optional |
| `credentialExpiresAt` | Date | optional |
| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
| `dpaEvidenceRef` | secretRef | ✅ |
| `genericRestApiAdapter` | JSON | optional (provider=generic-rest-api 시 ✅) |
| `mode` | enum (bi-directional·outbound-only) | ✅ |
| `active` | boolean | ✅ |
| `createdAt`·`updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.

### 13.2 `CrmSyncLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `manifestVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `envelopeState` | enum (running·succeeded·partial·failed·retried) | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.

### 13.3 `CrmSyncSourceAttempt`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error`·`errorClass` | string·enum | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`.
**Index**: `(expiresAt)`, `(integrationId, status)`.

### 13.4 `CrmSyncRetryQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber`·`maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum | optional |
| `payloadSnapshot` | JSON (closed-schema field tokens만) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
**Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.

#### 13.4.1 worker SoT 풀 SQL (search-visibility § 13.5 패턴 9단계)

```sql
-- 1. claim (FOR UPDATE SKIP LOCKED)
WITH next AS (
  SELECT id FROM crm_sync_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempt_number=attempt_number+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- 2. per-integration advisory lock
SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));

-- 3. SourceAttempt insert (transaction 내)
INSERT INTO crm_sync_source_attempt (sync_log_id, integration_id, entity, direction, attempt_number, status, started_at, expires_at)
VALUES ($sl, $int, $ent, $dir, $att, 'processing', now(), now() + $retention);
-- UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber) — 중복 시 race detected

-- 4. provider call (long-running — transaction 밖)

-- 5. SourceAttempt finalize
UPDATE crm_sync_source_attempt SET status=$status, completed_at=now(), error=$err, error_class=$ec, records_inbound=$ri, records_outbound=$ro, conflicts_detected=$cd
WHERE sync_log_id=$sl AND integration_id=$int AND entity=$ent AND direction=$dir AND attempt_number=$att;

-- 6. envelopeState 재계산
WITH agg AS (
  SELECT bool_and(status='success') AS all_success,
         bool_or(status IN ('failed-permanent','failed-credential','failed-quota')) AS any_failed,
         bool_or(status='in-retry-queue') AS any_retry
  FROM crm_sync_source_attempt WHERE sync_log_id=$sl
)
UPDATE crm_sync_log SET envelope_state=CASE
  WHEN (SELECT all_success FROM agg) THEN 'succeeded'
  WHEN (SELECT any_retry FROM agg) THEN 'retried'
  WHEN (SELECT any_failed FROM agg) THEN 'failed'
  ELSE 'partial' END, completed_at=now()
WHERE id=$sl;

-- 7. queue 완료/재등록
UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;

-- 8. stale reclaim (별도 worker — cadence 1분)
UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';

-- 9. exhausted/permanent
UPDATE crm_sync_retry_queue SET status='exhausted'
WHERE id=$id AND attempt_number >= max_attempts;
UPDATE crm_sync_retry_queue SET status='failed-permanent'
WHERE id=$id AND last_error_class='permanent';
-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
```

advisory lock ordering: integration → record.

### 13.5 `CrmRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `crmExternalId` | string | optional |
| `crmExternalIdHash` | char(64) | optional — § 2.3.1 |
| `solutionRecordRef` | string | optional |
| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
| `lastAppliedConflictVersion` | integer | optional |
| `lastSyncedAt` | Date | ✅ |
| `piiHash` | char(64) | optional |
| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
| `displayHintsCityName` | varchar(32) | optional — CHECK |
| `displayHintsGenderHint` | enum | optional |
| `displayHintsAgeBand` | enum | optional |
| `operationalHintsEntityStatus` | varchar(32) | optional |
| `operationalHintsInquiryType` | varchar(32) | optional |
| `operationalHintsChannelType` | varchar(32) | optional |
| `operationalHintsLocationKey` | varchar(32) | optional |
| `operationalHintsDepartmentHint` | varchar(32) | optional |
| `operationalHintsDesiredVisitDate` | Date | optional |
| `operationalHintsGuardianInvolved` | boolean | optional |
| `operationalHintsRelationToInstitution` | varchar(32) | optional |
| `operationalHintsPreferredChannelType` | varchar(32) | optional |
| `consentWithdrawn` | boolean | ✅ default false |
| `piiRetentionExpiresAt` | Date | optional |
| `operationalHintsRetentionExpiresAt` | Date | optional |

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
**CHECK**: PostgreSQL canonical 정규식 (§ 3.2.1).
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.

### 13.6 `CrmRecordChangeLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `direction` | enum | ✅ |
| `changedFields` | JSON (allowlisted token + masked value) | ✅ |
| `priorSnapshot`·`newSnapshot` | JSON (동일 제약) | optional |
| `tombstone` | boolean | ✅ default false |
| `appliedAt`·`appliedBy` | Date·string | ✅ |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`, `(tombstone) WHERE tombstone=true`.

### 13.7 `CrmFieldMapping`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `entity` | enum | ✅ |
| `solutionFieldPath`·`crmFieldPath` | string | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `authority` | FieldAuthority | ✅ |
| `transformerRef` | string | optional |
| `policyVersion` | string | ✅ |
| `active` | boolean | ✅ |

**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.

build-time: instance mode="outbound-only" + 본 테이블 `direction IN (inbound, both)` 존재 → build fail.

### 13.8 `CrmConflictRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `fieldPath` | string | ✅ |
| `baseVersion` | integer | ✅ |
| `observedCrmVersion`·`observedSolutionVersion` | integer | ✅ |
| `crmProposedValue`·`solutionProposedValue` | masked field token + value | ✅ |
| `resolution` | enum (open·crm-wins·solution-wins·manual-resolved·manual-rejected) | ✅ |
| `winningVersion`·`appliedFieldVersion` | integer | optional |
| `resolvedBy`·`resolvedAt` | string·Date | optional |
| `slaDeadline` | Date | ✅ — open 기준 7일 |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.

### 13.9 `CrmCredentialAuditLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon·reset) | ✅ |
| `rotationAttemptId` | UUID | optional |
| `priorCredentialFingerprintPrefix`·`newCredentialFingerprintPrefix` | char(16) | optional |
| `actor` | string | ✅ |
| `occurredAt` | Date | ✅ |

**Index**: `(integrationId, occurredAt DESC)`.

### 13.10 `CrmRateLimitState`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `secretRef` | secretRef | ✅ |
| `secretVersionId` | string | ✅ |
| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
| `credentialFingerprint` | char(64) | ✅ |
| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
| `activatedAt` | Date | ✅ |
| `graceUntil` | Date | optional |
| `revokedAt` | Date | optional |
| `expiresAt` | Date | optional |
| `rotationAttemptId` | UUID | optional |

**Constraints (CS4-02 강제)**:
- `UNIQUE(integrationId, secretVersionId)`
- `UNIQUE(integrationId) WHERE state='active'` — partial unique
- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
- `UNIQUE(integrationId) WHERE state='committed'` — partial unique

→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.

**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.

### 13.12 `CrmWebhookNonceLedger` — **transport-level dedupe (CS4-04)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `providerEventId` | string | optional |
| `canonicalDigest` | char(64) | ✅ |
| `receivedBucket` | bigint | ✅ |
| `signatureDigest` | char(64) | ✅ |
| `deliveryKind` | enum | ✅ |
| `receivedAt` | Date | ✅ |
| `status` | enum (accepted-pending·accepted-processed·rejected-rrn-recoverable·rejected-rrn-final·rejected-parse-recoverable) | ✅ |
| `rrnFingerprint` | char(64) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliveryKind='exactly-once'`
- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT NULL AND deliveryKind='at-least-once'`
- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL OR deliveryKind='best-effort'`

**Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.

### 13.13 `CrmChangeIdentityLedger` — **record-level dedupe (CS4-04·08)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `entity` | enum | ✅ |
| `crmExternalId` | string | ✅ |
| `providerVersionToken` | string | ✅ — v1.0 required (CS4-04) |
| `changeIdentityKey` | char(64) | ✅ |
| `source` | enum (webhook·polling) | ✅ |
| `receivedAt` | Date | ✅ |
| `processedSyncLogId` | UUID | optional — FK § 13.2 ON DELETE SET NULL (CS4-08) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId ON DELETE RESTRICT`. `FK processedSyncLogId → crm_sync_log.id ON DELETE SET NULL`.
**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.

### 13.14 `CrmConsentWithdrawalLedger` (CS4-01·08)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `keyType` | enum (`piiHash`·`crmExternalIdHash`) | ✅ |
| `piiHash` | char(64) | optional |
| `crmExternalIdHash` | char(64) | optional |
| `scope` | enum (`all`·`marketing-only`) | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
| `appliedBy` | string | ✅ |
| `appliedAt` | Date | ✅ |
| `displayHintsNulled` | boolean | ✅ |
| `operationalHintsNulledMap` | JSON (field별 boolean) | ✅ |
| `tombstoneChangeLogIds` | UUID[] | ✅ |
| `matchedRecordCount` | integer | ✅ |
| `dryRun` | boolean | ✅ |
| `reason` | string | ✅ |
| `legalHold` | boolean | ✅ default true (CS4-06) |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints (CS4-08)**:
- `CHECK ((key_type='piiHash' AND pii_hash IS NOT NULL AND crm_external_id_hash IS NULL) OR (key_type='crmExternalIdHash' AND crm_external_id_hash IS NOT NULL AND pii_hash IS NULL))`
- `UNIQUE(integration_id, pii_hash, scope) WHERE pii_hash IS NOT NULL`
- `UNIQUE(integration_id, crm_external_id_hash, scope) WHERE crm_external_id_hash IS NOT NULL`
- `UNIQUE(integration_id, idempotency_key)`
- `FK integrationId ON DELETE RESTRICT`

**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.

### 13.15 `CrmSyncNotificationOutbox`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (sync-log·conflict·credential-version) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·failed·permanent) | ✅ |
| `attempts` | integer | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt`·`sentAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.

---

**총 15개 admin DB 테이블** — 각 절 stand-alone schema:

| § | 테이블 | 핵심 invariant |
|---|---|---|
| 13.1 | CrmIntegration | partial unique active+integrationKey |
| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
| 13.3 | CrmSyncSourceAttempt | UNIQUE(syncLog, integration, entity, direction, attempt) |
| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
| 13.6 | CrmRecordChangeLog | FK RESTRICT + tombstone flag |
| 13.7 | CrmFieldMapping | mode outbound-only inbound direction build fail |
| 13.8 | CrmConflictRecord | resolution open 7일 SLA |
| 13.9 | CrmCredentialAuditLog | 7년 audit retention |
| 13.10 | CrmRateLimitState | bucketKey UNIQUE |
| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |
| 13.13 | CrmChangeIdentityLedger | UNIQUE changeIdentityKey + processedSyncLogId FK SET NULL |
| 13.14 | CrmConsentWithdrawalLedger | CHECK XOR + 3종 UNIQUE + legalHold default true |
| 13.15 | CrmSyncNotificationOutbox | UNIQUE(sourceKind, sourceId, eventType) |

codex
SoT는 확인했습니다. 이제 Spike B의 migration, core TS, scenario를 파일 단위로 읽고 지적은 `SPIKEB1-`로 묶겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\migrations\\001_roles.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\migrations\\002_outbox.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\migrations\\003_inbox.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\migrations\\004_external_call_log.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\migrations\\005_invariant_log.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\outbox.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 800ms:
-- Spike B — migration 001: roles + pgcrypto
-- app_tenant_user: tenant 작업 (inbox)·RLS 적용
-- postgres super-user: control-plane (outbox·external_call_log·invariant_log)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO app_tenant_user;

 succeeded in 757ms:
-- Spike B — migration 004: external_call_log (fake provider call tracking)
--
-- 외부 side effect 호출 count 추적. idempotent at-least-once with exactly-once observable:
-- 같은 source_event_id에 대해 외부 call이 정확히 1번만 일어나야 함 (재처리해도 중복 호출 차단).
-- super-user 전용 — app_tenant_user GRANT 미부여

CREATE TABLE external_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,           -- idempotency key (외부 provider도 동일 키 사용 가정)
  call_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  worker_id TEXT NOT NULL,                 -- 어느 worker가 호출했는지
  outcome TEXT NOT NULL,                   -- success·transient-fail·permanent-fail
  CHECK (outcome IN ('success', 'transient-fail', 'permanent-fail'))
);

-- 동일 source_event_id에 대한 success 호출은 1번만 (idempotent at-least-once with exactly-once observable)
CREATE UNIQUE INDEX external_call_log_idempotency_success
  ON external_call_log (instance_id, source_event_id)
  WHERE outcome = 'success';

CREATE INDEX external_call_log_event_idx
  ON external_call_log (instance_id, source_event_id, call_timestamp DESC);

 succeeded in 791ms:
-- Spike B — migration 002: outbox (control-plane, RLS 미적용)
--
-- worker가 instance context 모르고 claim → status·tenant 처리·완료 mark
-- super-user 또는 control-plane role 전용 — app_tenant_user GRANT 미부여

CREATE TABLE outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,           -- idempotency key
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending·processing·completed·exhausted·failed-permanent
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  last_error TEXT,
  last_error_class TEXT,                   -- transient·permanent
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  exhausted_at TIMESTAMPTZ,
  CHECK (status IN ('pending', 'processing', 'completed', 'exhausted', 'failed-permanent')),
  CHECK (last_error_class IS NULL OR last_error_class IN ('transient', 'permanent'))
);

-- idempotency: 동일 (instance_id, source_event_id) 중복 enqueue 차단 (active state)
CREATE UNIQUE INDEX outbox_idempotency_active
  ON outbox (instance_id, source_event_id)
  WHERE status IN ('pending', 'processing');

-- claim용 partial index — pending status worker claim 빠르게
CREATE INDEX outbox_claim_idx
  ON outbox (next_attempt_at, locked_at)
  WHERE status = 'pending';

-- stale processing detection
CREATE INDEX outbox_stale_idx
  ON outbox (locked_at)
  WHERE status = 'processing';

-- 모든 status별 조회용
CREATE INDEX outbox_status_idx ON outbox (status, created_at DESC);

-- RLS 미적용 (control-plane)
-- app_tenant_user GRANT 미부여 (요구 시 명시)

 succeeded in 805ms:
-- Spike B — migration 005: invariant_log (측정 결과)

CREATE TABLE invariant_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  scenario TEXT NOT NULL,
  job_count INT NOT NULL,
  worker_count INT NOT NULL,
  processed INT NOT NULL,
  inbox_rows INT NOT NULL,
  external_success_calls INT NOT NULL,
  external_total_calls INT NOT NULL,
  foreign_instance_inbox INT NOT NULL,     -- inbox 중 cross-instance row
  duplicate_inbox INT NOT NULL,
  duplicate_external_success INT NOT NULL,
  pending_outbox INT NOT NULL,
  exhausted_outbox INT NOT NULL,
  permanent_failed_outbox INT NOT NULL,
  passed BOOLEAN NOT NULL,
  elapsed_ms INT NOT NULL,
  notes TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, occurred_at DESC);

 succeeded in 831ms:
-- Spike B — migration 003: inbox (tenant-plane, RLS 적용)
--
-- worker가 outbox claim 후 instance_id 알게 되면 withTenantTransaction으로 처리.
-- inbox는 tenant-scoped — RLS WITH CHECK로 cross-instance 차단.
-- idempotent UNIQUE(instance_id, source_event_id) — 재처리 시 no-op

CREATE TABLE inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  source_event_id TEXT NOT NULL,
  outbox_id UUID NOT NULL,                 -- 추적용 (FK는 schema-per-tenant 시 깨질 수 있어 생략)
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- idempotency: 동일 (instance_id, source_event_id) 두 번 처리해도 1 row
CREATE UNIQUE INDEX inbox_idempotency
  ON inbox (instance_id, source_event_id);

CREATE INDEX inbox_outbox_idx ON inbox (outbox_id);

-- RLS enable + FORCE
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON inbox
  FOR ALL TO app_tenant_user
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON inbox TO app_tenant_user;

 succeeded in 817ms:
// Spike B — outbox enqueue·claim·complete·retry·exhausted·permanent
//
// SoT 패턴 (Spike 계획 § B.2):
// - SKIP LOCKED claim
// - control-plane connection (super-user — RLS 미적용)
// - 동일 (instance_id, source_event_id) 중복 enqueue 차단 (partial unique active)
// - stale lock reclaim (locked_at > timeout)

import { sql } from "drizzle-orm";
import type { Sql } from "postgres";
import { dbSuper, sqlSuper } from "./db.ts";

export type OutboxRow = {
  id: string;
  instance_id: string;
  source_event_id: string;
  payload: Record<string, unknown>;
  status: string;
  attempts: number;
  max_attempts: number;
  next_attempt_at: Date;
  locked_at: Date | null;
  locked_by: string | null;
  last_error: string | null;
  last_error_class: string | null;
};

export type EnqueueResult = {
  enqueued: boolean;        // false면 idempotency 중복 (no-op)
  outboxId: string | null;
};

/**
 * outbox에 enqueue. 동일 (instance_id, source_event_id) active state 중복은 no-op.
 */
export async function enqueueOutbox(input: {
  instanceId: string;
  sourceEventId: string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}): Promise<EnqueueResult> {
  const r = await dbSuper.execute(sql`
    INSERT INTO outbox (instance_id, source_event_id, payload, max_attempts)
    VALUES (
      ${input.instanceId}::uuid,
      ${input.sourceEventId},
      ${JSON.stringify(input.payload)}::jsonb,
      ${input.maxAttempts ?? 5}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `);
  const rows = r as unknown as Array<{ id: string }>;
  if (rows.length === 0) {
    return { enqueued: false, outboxId: null };
  }
  return { enqueued: true, outboxId: rows[0]!.id };
}

/**
 * outbox에서 다음 작업 1건을 SKIP LOCKED claim.
 * claim 성공 시 status=processing, locked_at=now(), attempts++ 후 row 반환.
 * 작업 없으면 null.
 *
 * stale processing reclaim: locked_at > staleAfterMs → 다시 pending 취급.
 */
export async function claimNextOutbox(workerId: string, staleAfterMs: number = 5 * 60 * 1000): Promise<OutboxRow | null> {
  const result = await sqlSuper.begin(async (tx) => {
    // stale processing reclaim
    await tx`
      UPDATE outbox SET status='pending', locked_at=NULL, locked_by=NULL
      WHERE status='processing'
        AND locked_at IS NOT NULL
        AND locked_at < now() - ${`${staleAfterMs} milliseconds`}::interval
    `;

    // SKIP LOCKED claim
    const claimed = await tx<OutboxRow[]>`
      WITH next AS (
        SELECT id FROM outbox
        WHERE status='pending' AND next_attempt_at <= now()
        ORDER BY next_attempt_at
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE outbox o
      SET status='processing',
          locked_at=now(),
          locked_by=${workerId},
          attempts=attempts+1
      FROM next
      WHERE o.id=next.id
      RETURNING o.*
    `;
    return claimed[0] ?? null;
  });

  return result;
}

/**
 * 처리 성공 → status=completed.
 */
export async function markCompleted(outboxId: string): Promise<void> {
  await dbSuper.execute(sql`
    UPDATE outbox SET status='completed', completed_at=now(), locked_at=NULL, locked_by=NULL
    WHERE id=${outboxId}::uuid
  `);
}

/**
 * 처리 실패 (transient) — backoff 후 재시도.
 * attempts >= max_attempts면 exhausted로 전이.
 */
export async function markTransientFail(outboxId: string, error: string, backoffMs: number): Promise<{ exhausted: boolean }> {
  const r = await dbSuper.execute(sql`
    UPDATE outbox
    SET status = CASE WHEN attempts >= max_attempts THEN 'exhausted' ELSE 'pending' END,
        locked_at = NULL,
        locked_by = NULL,
        last_error = ${error},
        last_error_class = 'transient',
        next_attempt_at = now() + (${backoffMs} || ' milliseconds')::interval,
        exhausted_at = CASE WHEN attempts >= max_attempts THEN now() ELSE exhausted_at END
    WHERE id=${outboxId}::uuid
    RETURNING status
  `);
  const status = (r as unknown as Array<{ status: string }>)[0]?.status;
  return { exhausted: status === 'exhausted' };
}

/**
 * 처리 실패 (permanent) — 즉시 failed-permanent 전이.
 */
export async function markFailedPermanent(outboxId: string, error: string): Promise<void> {
  await dbSuper.execute(sql`
    UPDATE outbox
    SET status='failed-permanent',
        locked_at=NULL,
        locked_by=NULL,
        last_error=${error},
        last_error_class='permanent'
    WHERE id=${outboxId}::uuid
  `);
}

/**
 * outbox 통계 — 시나리오 검증용
 */
export type OutboxStats = {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  exhausted: number;
  failedPermanent: number;
};

export async function getOutboxStats(): Promise<OutboxStats> {
  const r = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status='pending')::int AS pending,
      count(*) FILTER (WHERE status='processing')::int AS processing,
      count(*) FILTER (WHERE status='completed')::int AS completed,
      count(*) FILTER (WHERE status='exhausted')::int AS exhausted,
      count(*) FILTER (WHERE status='failed-permanent')::int AS failed_permanent
    FROM outbox
  `);
  const row = (r as unknown as Array<{
    total: number; pending: number; processing: number;
    completed: number; exhausted: number; failed_permanent: number;
  }>)[0];
  return {
    total: row?.total ?? 0,
    pending: row?.pending ?? 0,
    processing: row?.processing ?? 0,
    completed: row?.completed ?? 0,
    exhausted: row?.exhausted ?? 0,
    failedPermanent: row?.failed_permanent ?? 0,
  };
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\worker.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\fake-provider.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\failure-injection.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\tenant.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\db.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\errors.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 768ms:
// Spike B — failure injection (8 point)
//
// Spike 계획 § B.2 시나리오 4·5: claim 전/후·tenant insert 전/후·
//   tenant commit 후 completed mark 전·retry schedule 전/후·permanent fail alert 전/후

export type FailurePoint =
  | "before-claim"
  | "after-claim"
  | "before-tenant-insert"
  | "after-tenant-insert"
  | "after-tenant-commit-before-mark-completed"
  | "before-retry-schedule"
  | "after-retry-schedule"
  | "before-permanent-alert"
  | "after-permanent-alert";

export type InjectionConfig = {
  pointToFailAt: FailurePoint | null;     // 어느 point에서 의도적 crash
  triggerOnAttempt: number | null;        // attempts 값이 N일 때만 (null = 모든 attempt)
};

export const NO_INJECTION: InjectionConfig = { pointToFailAt: null, triggerOnAttempt: null };

export class InjectedFailureError extends Error {
  override readonly name = "InjectedFailureError";
}

/**
 * injection 발동 — pointToFailAt 일치하고 triggerOnAttempt 조건도 맞으면 throw
 */
export function maybeFail(
  config: InjectionConfig,
  currentPoint: FailurePoint,
  currentAttempt: number,
): void {
  if (config.pointToFailAt !== currentPoint) return;
  if (config.triggerOnAttempt !== null && config.triggerOnAttempt !== currentAttempt) return;
  throw new InjectedFailureError(`injected failure at ${currentPoint} (attempt ${currentAttempt})`);
}

 succeeded in 813ms:
// Spike B — worker
//
// loop:
// 1. claim outbox row (SKIP LOCKED) — control-plane
// 2. instance_id 추출 → withTenantTransaction으로 tenant-plane 처리
// 3. tenant inbox row insert (idempotent via UNIQUE)
// 4. external provider call (idempotent via UNIQUE on success)
// 5. tenant commit
// 6. outbox markCompleted (control-plane)
//
// failure injection으로 각 단계 사이 crash 시뮬레이션.
// retry: TransientProviderError → markTransientFail (backoff)
// permanent: PermanentProviderError → markFailedPermanent

import { sql } from "drizzle-orm";
import {
  claimNextOutbox,
  markCompleted,
  markTransientFail,
  markFailedPermanent,
  type OutboxRow,
} from "./outbox.ts";
import { withTenantTransaction } from "./tenant.ts";
import { callFakeProvider, type FakeProviderConfig } from "./fake-provider.ts";
import { errorMessage, PermanentProviderError, TransientProviderError } from "./errors.ts";
import { maybeFail, type InjectionConfig, NO_INJECTION, InjectedFailureError } from "./failure-injection.ts";

export type WorkerConfig = {
  workerId: string;
  staleAfterMs: number;
  backoffMs: number[];                    // attempts별 backoff. 마지막 값을 attempts > length일 때 사용
  providerConfig: FakeProviderConfig;
  injection: InjectionConfig;
};

export type ProcessResult =
  | { outcome: "completed"; outboxId: string }
  | { outcome: "retry-scheduled"; outboxId: string }
  | { outcome: "exhausted"; outboxId: string }
  | { outcome: "failed-permanent"; outboxId: string }
  | { outcome: "injected-crash"; outboxId: string; point: string }
  | { outcome: "no-job" };

function getBackoffMs(attempts: number, backoffMs: number[]): number {
  if (backoffMs.length === 0) return 1000;
  const idx = Math.min(attempts - 1, backoffMs.length - 1);
  return backoffMs[idx]!;
}

/**
 * worker 1회 루프: 1 outbox claim → 처리 → 결과
 */
export async function processOneJob(config: WorkerConfig): Promise<ProcessResult> {
  const inj = config.injection;

  // 1. before-claim injection
  maybeFail(inj, "before-claim", 0);

  // 2. claim
  const row: OutboxRow | null = await claimNextOutbox(config.workerId, config.staleAfterMs);
  if (!row) return { outcome: "no-job" };

  // 3. after-claim injection
  try {
    maybeFail(inj, "after-claim", row.attempts);

    // 4. tenant-plane 처리
    let providerOutcome: "success" | "idempotent-success" | null = null;
    let tenantSucceeded = false;

    await withTenantTransaction(row.instance_id, async (tx) => {
      maybeFail(inj, "before-tenant-insert", row.attempts);

      // inbox insert (idempotent)
      await tx.execute(sql`
        INSERT INTO inbox (instance_id, source_event_id, outbox_id, payload)
        VALUES (
          ${row.instance_id}::uuid,
          ${row.source_event_id},
          ${row.id}::uuid,
          ${JSON.stringify(row.payload)}::jsonb
        )
        ON CONFLICT (instance_id, source_event_id) DO NOTHING
      `);

      maybeFail(inj, "after-tenant-insert", row.attempts);

      // external provider call (tenant transaction 안 — but external_call_log는 super-user에서 별도 update)
      // 실제로는 transaction 밖 호출이 더 안전 (외부 call 후 inbox commit). prototype은 sequential.
      const r = await callFakeProvider({
        instanceId: row.instance_id,
        sourceEventId: row.source_event_id,
        payload: row.payload,
        workerId: config.workerId,
        config: config.providerConfig,
      });
      providerOutcome = r.outcome;

      tenantSucceeded = true;
    });

    // 5. after-tenant-commit-before-mark-completed injection
    maybeFail(inj, "after-tenant-commit-before-mark-completed", row.attempts);

    // 6. mark completed
    await markCompleted(row.id);
    return { outcome: "completed", outboxId: row.id };
  } catch (e) {
    if (e instanceof InjectedFailureError) {
      // injection은 outbox state 유지 (locked_at NULL 안 됨 — stale reclaim 대상)
      // 실제 worker crash 시뮬레이션
      return { outcome: "injected-crash", outboxId: row.id, point: e.message };
    }

    if (e instanceof PermanentProviderError) {
      maybeFail(inj, "before-permanent-alert", row.attempts);
      await markFailedPermanent(row.id, errorMessage(e));
      maybeFail(inj, "after-permanent-alert", row.attempts);
      return { outcome: "failed-permanent", outboxId: row.id };
    }

    if (e instanceof TransientProviderError) {
      maybeFail(inj, "before-retry-schedule", row.attempts);
      const backoff = getBackoffMs(row.attempts, config.backoffMs);
      const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
      maybeFail(inj, "after-retry-schedule", row.attempts);
      return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
    }

    // unknown error → transient
    const backoff = getBackoffMs(row.attempts, config.backoffMs);
    const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
    return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
  }
}

/**
 * 5 worker 동시 처리 — Promise.all로 5개 worker loop. 각자 N번 시도 또는 no-job N번 후 종료.
 */
export async function runConcurrentWorkers(input: {
  workerCount: number;
  maxRoundsPerWorker: number;
  emptyConsecutiveStop: number;   // no-job N회 연속 시 worker 종료
  configFactory: (workerIdx: number) => WorkerConfig;
}): Promise<{ perWorker: Array<{ workerId: string; rounds: number; results: Record<string, number> }> }> {
  const promises: Promise<{ workerId: string; rounds: number; results: Record<string, number> }>[] = [];

  for (let w = 0; w < input.workerCount; w++) {
    const cfg = input.configFactory(w);
    promises.push((async () => {
      const counts: Record<string, number> = {};
      let consecutiveEmpty = 0;
      let rounds = 0;
      for (let i = 0; i < input.maxRoundsPerWorker; i++) {
        rounds++;
        const r = await processOneJob(cfg);
        counts[r.outcome] = (counts[r.outcome] ?? 0) + 1;
        if (r.outcome === "no-job") {
          consecutiveEmpty++;
          if (consecutiveEmpty >= input.emptyConsecutiveStop) break;
        } else {
          consecutiveEmpty = 0;
        }
      }
      return { workerId: cfg.workerId, rounds, results: counts };
    })());
  }

  const perWorker = await Promise.all(promises);
  return { perWorker };
}

 succeeded in 799ms:
// Spike B — fake external provider
//
// idempotent at-least-once with exactly-once observable effects:
// - 같은 source_event_id에 대해 동일 성공 결과 (idempotency)
// - external_call_log UNIQUE(instance_id, source_event_id) WHERE outcome='success' — 중복 success 차단
// - 모든 호출 시도 (transient·permanent 포함) 기록
//
// 설정 가능 동작:
// - failureMode: success·transient·permanent
// - failBeforeSuccessAttempts: N회 fail 후 success
// - permanentSourceEventIds: 해당 source_event_id는 permanent fail

import { sql } from "drizzle-orm";
import { dbSuper } from "./db.ts";
import { PermanentProviderError, TransientProviderError } from "./errors.ts";

export type FakeProviderConfig = {
  failBeforeSuccessAttempts: number;        // 동일 source_event_id에 대해 N회 fail 후 success
  permanentSourceEventIds: Set<string>;     // permanent fail로 전이할 source_event_id
};

const DEFAULT_CONFIG: FakeProviderConfig = {
  failBeforeSuccessAttempts: 0,
  permanentSourceEventIds: new Set(),
};

/**
 * fake provider 호출. 외부 side effect를 simulate.
 * 동일 source_event_id에 대해:
 *  - 이미 success log 있으면 → idempotent success 반환 (외부 call 발생 안 함 — but log)
 *  - permanentSourceEventIds 포함 → PermanentProviderError
 *  - 그 외 attempt < failBeforeSuccessAttempts → TransientProviderError
 *  - 통과하면 success log insert
 */
export async function callFakeProvider(input: {
  instanceId: string;
  sourceEventId: string;
  payload: Record<string, unknown>;
  workerId: string;
  config?: FakeProviderConfig;
}): Promise<{ outcome: "success" | "idempotent-success" }> {
  const cfg = input.config ?? DEFAULT_CONFIG;

  // idempotency 확인: 이미 success 호출 있으면 no-op
  const existing = await dbSuper.execute(sql`
    SELECT 1 FROM external_call_log
    WHERE instance_id=${input.instanceId}::uuid
      AND source_event_id=${input.sourceEventId}
      AND outcome='success'
    LIMIT 1
  `);
  if ((existing as unknown as unknown[]).length > 0) {
    return { outcome: "idempotent-success" };
  }

  // permanent fail
  if (cfg.permanentSourceEventIds.has(input.sourceEventId)) {
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'permanent-fail')
    `);
    throw new PermanentProviderError(`permanent fail for ${input.sourceEventId}`);
  }

  // transient fail count
  const failCountResult = await dbSuper.execute(sql`
    SELECT count(*)::int AS c FROM external_call_log
    WHERE instance_id=${input.instanceId}::uuid
      AND source_event_id=${input.sourceEventId}
      AND outcome='transient-fail'
  `);
  const failCount = (failCountResult as unknown as Array<{ c: number }>)[0]?.c ?? 0;

  if (failCount < cfg.failBeforeSuccessAttempts) {
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'transient-fail')
    `);
    throw new TransientProviderError(`transient fail attempt ${failCount + 1}`);
  }

  // success — UNIQUE constraint로 idempotency 강제
  try {
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'success')
    `);
    return { outcome: "success" };
  } catch (e) {
    // race: 다른 worker가 동시에 success insert → unique violation → idempotent
    if ((e as { code?: string })?.code === "23505") {
      return { outcome: "idempotent-success" };
    }
    throw e;
  }
}

/**
 * external_call_log 통계
 */
export async function getExternalCallStats(): Promise<{
  total: number;
  successUnique: number;       // distinct source_event_id with success
  successTotal: number;
  transientFail: number;
  permanentFail: number;
  duplicateSuccess: number;    // 동일 source_event_id에 대해 success가 2번 이상 (idempotency 위반 — 0이어야 함)
}> {
  const r = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE outcome='success')::int AS success_total,
      count(DISTINCT (instance_id, source_event_id)) FILTER (WHERE outcome='success')::int AS success_unique,
      count(*) FILTER (WHERE outcome='transient-fail')::int AS transient_fail,
      count(*) FILTER (WHERE outcome='permanent-fail')::int AS permanent_fail
    FROM external_call_log
  `);
  const row = (r as unknown as Array<{
    total: number; success_total: number; success_unique: number;
    transient_fail: number; permanent_fail: number;
  }>)[0];

  return {
    total: row?.total ?? 0,
    successUnique: row?.success_unique ?? 0,
    successTotal: row?.success_total ?? 0,
    transientFail: row?.transient_fail ?? 0,
    permanentFail: row?.permanent_fail ?? 0,
    duplicateSuccess: (row?.success_total ?? 0) - (row?.success_unique ?? 0),
  };
}

 succeeded in 769ms:
// Spike B — withTenantTransaction (Spike A 패턴 동일·ScopedDb brand)

import { sql } from "drizzle-orm";
import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
import { dbTenant } from "./db.ts";
import { TenantContextError } from "./errors.ts";

const SCOPED_BRAND: unique symbol = Symbol("scopedDb");
export type ScopedDb = PostgresJsTransaction<Record<string, never>, Record<string, never>> & {
  readonly [SCOPED_BRAND]: true;
};

function asScopedDb(tx: PostgresJsTransaction<Record<string, never>, Record<string, never>>): ScopedDb {
  Object.defineProperty(tx, SCOPED_BRAND, { value: true, enumerable: false, configurable: false });
  return tx as ScopedDb;
}

export async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: ScopedDb) => Promise<T>,
): Promise<T> {
  if (!isValidUuid(instanceId)) {
    throw new TenantContextError(`invalid instanceId: ${instanceId}`);
  }
  return dbTenant.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
    return fn(asScopedDb(tx));
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(s: string): boolean {
  return UUID_RE.test(s);
}

 succeeded in 778ms:
// Spike B — DB connection (Spike A 패턴 동일)

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

const DEBUG = process.env.SPIKE_DB_DEBUG === "1";
const commonOptions = {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {},
  ...(DEBUG ? { debug: (_c: number, q: string) => console.log("[DB]", q.slice(0, 200)) } : {}),
} as const;

// super-user (control-plane access·migration·outbox claim)
export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 8, ...commonOptions });
export const dbSuper = drizzle(sqlSuper);

// tenant (inbox·RLS 적용)
export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
export const dbTenant = drizzle(sqlTenant);

export async function closeAll(): Promise<void> {
  await Promise.allSettled([sqlSuper.end(), sqlTenant.end()]);
}

 succeeded in 771ms:
// Spike B — error helpers (Spike A 동일)

export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export class TenantContextError extends Error {
  override readonly name = "TenantContextError";
}

export class PermanentProviderError extends Error {
  override readonly name = "PermanentProviderError";
}

export class TransientProviderError extends Error {
  override readonly name = "TransientProviderError";
}

codex
코어에서 몇 가지 위험 신호가 보입니다. 특히 fake provider가 tenant transaction 안에서 별도 super connection을 쓰는 구조와 failure injection의 retry/permanent 지점 처리가 실제 crash 의미와 어긋날 수 있어, 시나리오가 이걸 잡는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-basic-100.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-idempotency.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-failure-injection.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-stale-reclaim.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-no-cross-tenant.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-retry-permanent.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 839ms:
// Spike B — Scenario 1: 100 outbox·5 worker 정상 처리
// 통과: 100 outbox completed·100 inbox row·100 success external call·foreign instance 0·duplicate 0

import { fileURLToPath, pathToFileURL } from "node:url";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";
import { sql } from "drizzle-orm";

const JOBS = Number(process.env.BASIC_JOBS ?? "100");
const WORKERS = Number(process.env.BASIC_WORKERS ?? "5");

async function main(): Promise<void> {
  console.log(`basic-100: JOBS=${JOBS} WORKERS=${WORKERS}`);

  // outbox seed (절반 instance-a, 절반 instance-b)
  for (let i = 0; i < JOBS; i++) {
    const instanceId = i % 2 === 0 ? INSTANCE_A : INSTANCE_B;
    await enqueueOutbox({
      instanceId,
      sourceEventId: `evt-${i}`,
      payload: { i, label: `job-${i}` },
    });
  }

  const start = Date.now();
  const { perWorker } = await runConcurrentWorkers({
    workerCount: WORKERS,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10, 50, 100, 500, 1000],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });
  const elapsed = Date.now() - start;

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();

  // inbox 통계
  const inboxR = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];

  console.log("\n=== basic-100 result ===");
  console.log(`  per-worker:`);
  for (const w of perWorker) {
    console.log(`    ${w.workerId}: rounds=${w.rounds} results=${JSON.stringify(w.results)}`);
  }
  console.log(`  outbox: total=${stats.total} completed=${stats.completed} pending=${stats.pending}`);
  console.log(`  inbox: total=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count}`);
  console.log(`  external: total=${ext.total} successUnique=${ext.successUnique} duplicateSuccess=${ext.duplicateSuccess}`);
  console.log(`  elapsed: ${elapsed}ms`);

  const passed =
    stats.completed === JOBS &&
    stats.pending === 0 &&
    inb?.total === JOBS &&
    inb?.unique_count === JOBS &&
    (inb?.foreign_count ?? -1) === 0 &&
    ext.successUnique === JOBS &&
    ext.duplicateSuccess === 0;

  console.log(`basic-100: ${passed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!passed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 834ms:
// Spike B — Scenario 2: idempotency
// 동일 sourceEventId 2회 enqueue·worker 처리 후 external call 1회·inbox row 1개

import { fileURLToPath, pathToFileURL } from "node:url";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";
import { sql } from "drizzle-orm";

async function main(): Promise<void> {
  console.log(`idempotency test`);

  // 첫 번째 enqueue
  const e1 = await enqueueOutbox({
    instanceId: INSTANCE_A,
    sourceEventId: "dup-evt-1",
    payload: { i: 1 },
  });
  // 동일 sourceEventId 두 번째 enqueue → no-op
  const e2 = await enqueueOutbox({
    instanceId: INSTANCE_A,
    sourceEventId: "dup-evt-1",
    payload: { i: 2 },
  });

  const t1Passed = e1.enqueued === true && e2.enqueued === false;
  console.log(`  ${t1Passed ? "PASS" : "FAIL"}  active idempotency — first=${e1.enqueued} second=${e2.enqueued}`);

  // worker 처리
  await runConcurrentWorkers({
    workerCount: 2,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 2,
    configFactory: (idx) => ({
      workerId: `worker-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const inboxCount = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM inbox WHERE source_event_id='dup-evt-1'`);
  const inboxN = ((inboxCount as unknown as Array<{ c: number }>)[0]?.c) ?? -1;

  const t2Passed = stats.completed === 1 && inboxN === 1 && ext.successUnique === 1 && ext.duplicateSuccess === 0;
  console.log(`  ${t2Passed ? "PASS" : "FAIL"}  완료 — outbox=${stats.completed} inbox=${inboxN} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess}`);

  // completed 후 동일 sourceEventId enqueue → completed는 active state 아님 → enqueue 허용
  // (실제 운영은 completed 후 retention 지나면 재enqueue 가능)
  const e3 = await enqueueOutbox({
    instanceId: INSTANCE_A,
    sourceEventId: "dup-evt-1",
    payload: { i: 3 },
  });
  const t3Passed = e3.enqueued === true;
  console.log(`  ${t3Passed ? "PASS" : "FAIL"}  completed 후 same sourceEventId enqueue — enqueued=${e3.enqueued}`);

  // 두 번째 worker round
  await runConcurrentWorkers({
    workerCount: 2,
    maxRoundsPerWorker: 5,
    emptyConsecutiveStop: 2,
    configFactory: (idx) => ({
      workerId: `worker-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  // external_call_log success row는 같은 sourceEventId에 대해 UNIQUE — 2번째 worker는 idempotent-success 반환
  const ext2 = await getExternalCallStats();
  const t4Passed = ext2.successUnique === 1 && ext2.duplicateSuccess === 0;
  console.log(`  ${t4Passed ? "PASS" : "FAIL"}  external call no duplicate — successUnique=${ext2.successUnique} dup=${ext2.duplicateSuccess}`);

  const passed = t1Passed && t2Passed && t3Passed && t4Passed;
  console.log(`idempotency: ${passed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!passed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 829ms:
// Spike B — Scenario 3: failure injection 8 point
// 각 point에서 crash → 후속 worker가 stale reclaim + 정상 처리 → 최종 inbox·external 정합

import { fileURLToPath, pathToFileURL } from "node:url";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { processOneJob } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { type FailurePoint, NO_INJECTION } from "../failure-injection.ts";
import { sql } from "drizzle-orm";

const POINTS: FailurePoint[] = [
  "before-claim",
  "after-claim",
  "before-tenant-insert",
  "after-tenant-insert",
  "after-tenant-commit-before-mark-completed",
  "before-retry-schedule",
  "after-retry-schedule",
  "before-permanent-alert",
  "after-permanent-alert",
];

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`failure-injection 8 point`);
  const results: Result[] = [];

  for (const point of POINTS) {
    // 매 point마다 clean state
    await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
    const sourceEventId = `inject-${point}`;
    await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId, payload: { point } });

    // 1차: injection 발동 — crash 시뮬레이션
    const r1 = await processOneJob({
      workerId: "worker-inj",
      staleAfterMs: 0, // stale reclaim 즉시 가능
      backoffMs: [10],
      providerConfig:
        point.startsWith("before-permanent") || point.startsWith("after-permanent")
          ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set([sourceEventId]) }
          : { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: { pointToFailAt: point, triggerOnAttempt: null },
    });

    // 2차·3차: 후속 worker (injection 없음) — stale reclaim 후 정상 처리
    let postOutcome = "";
    for (let i = 0; i < 3; i++) {
      const r2 = await processOneJob({
        workerId: `worker-recovery-${i}`,
        staleAfterMs: 0,
        backoffMs: [10],
        providerConfig:
          point.startsWith("before-permanent") || point.startsWith("after-permanent")
            ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set([sourceEventId]) }
            : { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
        injection: NO_INJECTION,
      });
      postOutcome = r2.outcome;
      if (r2.outcome === "completed" || r2.outcome === "failed-permanent" || r2.outcome === "no-job") break;
    }

    // 최종 invariant
    const stats = await getOutboxStats();
    const ext = await getExternalCallStats();
    const inboxR = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM inbox`);
    const inboxN = ((inboxR as unknown as Array<{ c: number }>)[0]?.c) ?? -1;

    const isPermanent = point.startsWith("before-permanent") || point.startsWith("after-permanent");

    // permanent point: outbox=failed-permanent or processing(injection 후 unlock)
    // non-permanent: outbox=completed
    let expectedOutbox: "completed" | "failed-permanent";
    let expectedExt: number;
    let expectedInbox: number;

    if (isPermanent) {
      expectedOutbox = "failed-permanent";
      expectedExt = 0;     // permanent fail은 success 없음
      expectedInbox = 0;   // permanent 시 inbox insert 전 fail
    } else {
      expectedOutbox = "completed";
      expectedExt = 1;
      expectedInbox = 1;
    }

    const outboxMatch =
      expectedOutbox === "completed" ? stats.completed === 1 : stats.failedPermanent === 1;
    const extMatch = ext.successUnique === expectedExt;
    const inboxMatch = inboxN === expectedInbox;
    const noDuplicate = ext.duplicateSuccess === 0;

    const passed = outboxMatch && extMatch && inboxMatch && noDuplicate;
    results.push({
      passed,
      detail: `${point}: r1=${r1.outcome} → recovery=${postOutcome} → outbox.${expectedOutbox}=${outboxMatch} inbox=${inboxN}/${expectedInbox} ext=${ext.successUnique}/${expectedExt} dup=${ext.duplicateSuccess}`,
    });
  }

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`failure-injection: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 840ms:
// Spike B — Scenario 4: stale lock reclaim
// claim 후 worker가 죽었다 가정 → 다른 worker가 stale 후 reclaim → 처리

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats, claimNextOutbox } from "../outbox.ts";
import { processOneJob } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`stale-reclaim test`);
  const results: Result[] = [];

  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "stale-evt-1", payload: {} });

  // 1. worker-A가 claim 후 crash 시뮬레이션 (markCompleted 안 함)
  const claimed = await claimNextOutbox("worker-stale-A", 10 * 60 * 1000); // stale threshold 10분
  results.push({
    passed: claimed !== null && claimed.status === "processing",
    detail: `worker-A claim: ${claimed ? `id=${claimed.id.slice(0, 8)} attempts=${claimed.attempts}` : "null"}`,
  });

  // 2. 즉시 다른 worker가 claim 시도 — 아직 stale threshold 미달 → no-job
  const r2 = await processOneJob({
    workerId: "worker-stale-B-too-early",
    staleAfterMs: 10 * 60 * 1000,
    backoffMs: [10],
    providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
    injection: NO_INJECTION,
  });
  results.push({
    passed: r2.outcome === "no-job",
    detail: `worker-B too early (10min threshold): ${r2.outcome}`,
  });

  // 3. stale threshold 0ms로 → 다른 worker reclaim 가능
  const r3 = await processOneJob({
    workerId: "worker-stale-C-reclaim",
    staleAfterMs: 0,
    backoffMs: [10],
    providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
    injection: NO_INJECTION,
  });
  results.push({
    passed: r3.outcome === "completed",
    detail: `worker-C reclaim (0ms threshold): ${r3.outcome}`,
  });

  // 4. 최종 invariant
  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const finalPassed = stats.completed === 1 && ext.successUnique === 1 && ext.duplicateSuccess === 0;
  results.push({
    passed: finalPassed,
    detail: `final: outbox.completed=${stats.completed} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`stale-reclaim: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 773ms:
// Spike B — Scenario 6: foreign instance write 0건
// 100 outbox (50 A·50 B)·5 worker 동시 처리·inbox는 RLS WITH CHECK로 cross-instance write 차단

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

async function main(): Promise<void> {
  console.log(`no-cross-tenant test`);
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);

  const JOBS = 100;
  for (let i = 0; i < JOBS; i++) {
    await enqueueOutbox({
      instanceId: i % 2 === 0 ? INSTANCE_A : INSTANCE_B,
      sourceEventId: `cross-evt-${i}`,
      payload: { i },
    });
  }

  await runConcurrentWorkers({
    workerCount: 5,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-cross-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const r = await dbSuper.execute(sql`
    SELECT
      count(*) FILTER (WHERE instance_id = ${INSTANCE_A}::uuid)::int AS a_count,
      count(*) FILTER (WHERE instance_id = ${INSTANCE_B}::uuid)::int AS b_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const row = (r as unknown as Array<{ a_count: number; b_count: number; foreign_count: number }>)[0];

  console.log(`  inbox A: ${row?.a_count} (expected 50)`);
  console.log(`  inbox B: ${row?.b_count} (expected 50)`);
  console.log(`  inbox foreign: ${row?.foreign_count} (expected 0)`);

  const stats = await getOutboxStats();
  console.log(`  outbox completed: ${stats.completed}`);

  const passed =
    row?.a_count === 50 &&
    row?.b_count === 50 &&
    row?.foreign_count === 0 &&
    stats.completed === JOBS;

  console.log(`no-cross-tenant: ${passed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!passed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 810ms:
// Spike B — Scenario 5: retry backoff·exhausted·permanent

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`retry-permanent test`);
  const results: Result[] = [];

  // 1. transient → eventual success (3 fail 후 success, maxAttempts=5)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "retry-evt-1", payload: { case: "eventual-success" } });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 3,
    configFactory: () => ({
      workerId: "worker-retry-1",
      staleAfterMs: 0,
      backoffMs: [1, 1, 1, 1, 1], // 1ms backoff for test speed
      providerConfig: { failBeforeSuccessAttempts: 3, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const s1 = await getOutboxStats();
  const e1 = await getExternalCallStats();
  results.push({
    passed: s1.completed === 1 && e1.transientFail === 3 && e1.successUnique === 1,
    detail: `eventual-success: completed=${s1.completed} transient=${e1.transientFail} success=${e1.successUnique}`,
  });

  // 2. exhausted (maxAttempts 모두 transient fail)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  await enqueueOutbox({
    instanceId: INSTANCE_A,
    sourceEventId: "retry-evt-2",
    payload: { case: "exhausted" },
    maxAttempts: 3,
  });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 3,
    configFactory: () => ({
      workerId: "worker-retry-2",
      staleAfterMs: 0,
      backoffMs: [1],
      providerConfig: { failBeforeSuccessAttempts: 999, permanentSourceEventIds: new Set() }, // 절대 success 안 함
      injection: NO_INJECTION,
    }),
  });

  const s2 = await getOutboxStats();
  const e2 = await getExternalCallStats();
  results.push({
    passed: s2.exhausted === 1 && s2.completed === 0 && e2.successUnique === 0 && e2.transientFail === 3,
    detail: `exhausted: outbox.exhausted=${s2.exhausted} transient=${e2.transientFail} success=${e2.successUnique}`,
  });

  // 3. permanent fail (즉시 failed-permanent)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "retry-evt-3", payload: { case: "permanent" } });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 5,
    emptyConsecutiveStop: 2,
    configFactory: () => ({
      workerId: "worker-retry-3",
      staleAfterMs: 0,
      backoffMs: [1],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set(["retry-evt-3"]) },
      injection: NO_INJECTION,
    }),
  });

  const s3 = await getOutboxStats();
  const e3 = await getExternalCallStats();
  results.push({
    passed: s3.failedPermanent === 1 && s3.completed === 0 && e3.permanentFail === 1 && e3.successUnique === 0,
    detail: `permanent: outbox.failed-permanent=${s3.failedPermanent} permFail=${e3.permanentFail} success=${e3.successUnique}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`retry-permanent: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\scenarios\\test-invariant-runner.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\seed.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\fixtures.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\src\\migrate.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\package.json" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path apps\\spike-b\\tsconfig.json" in C:\Users\assag\solution\website-exposure
 succeeded in 785ms:
// Spike B — Scenario 7: invariant runner
// 1000 jobs × 10 workers × 5 runs — 누적 invariant 검증

import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

const JOBS = Number(process.env.INVARIANT_JOBS ?? "1000");
const WORKERS = Number(process.env.INVARIANT_WORKERS ?? "10");
const RUNS = Number(process.env.INVARIANT_RUNS ?? "5");

async function singleRun(runIdx: number, runId: string): Promise<{ passed: boolean; detail: string }> {
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);

  for (let i = 0; i < JOBS; i++) {
    await enqueueOutbox({
      instanceId: i % 2 === 0 ? INSTANCE_A : INSTANCE_B,
      sourceEventId: `inv-${runIdx}-${i}`,
      payload: { runIdx, i },
    });
  }

  const start = Date.now();
  await runConcurrentWorkers({
    workerCount: WORKERS,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-${runIdx}-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });
  const elapsed = Date.now() - start;

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const inboxR = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];

  const passed =
    stats.completed === JOBS &&
    stats.pending === 0 &&
    inb?.total === JOBS &&
    inb?.unique_count === JOBS &&
    (inb?.foreign_count ?? -1) === 0 &&
    ext.successUnique === JOBS &&
    ext.duplicateSuccess === 0;

  await dbSuper.execute(sql`
    INSERT INTO invariant_log (
      run_id, scenario, job_count, worker_count, processed,
      inbox_rows, external_success_calls, external_total_calls,
      foreign_instance_inbox, duplicate_inbox, duplicate_external_success,
      pending_outbox, exhausted_outbox, permanent_failed_outbox,
      passed, elapsed_ms
    ) VALUES (
      ${runId}::uuid, ${"invariant-run"}, ${JOBS}, ${WORKERS}, ${stats.completed},
      ${inb?.total ?? 0}, ${ext.successUnique}, ${ext.total},
      ${inb?.foreign_count ?? 0}, ${(inb?.total ?? 0) - (inb?.unique_count ?? 0)}, ${ext.duplicateSuccess},
      ${stats.pending}, ${stats.exhausted}, ${stats.failedPermanent},
      ${passed}, ${elapsed}
    )
  `);

  return {
    passed,
    detail: `run ${runIdx}: completed=${stats.completed}/${JOBS} inbox=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess} elapsed=${elapsed}ms`,
  };
}

async function main(): Promise<void> {
  console.log(`invariant-runner: JOBS=${JOBS} WORKERS=${WORKERS} RUNS=${RUNS}`);
  const runId = randomUUID();

  const results: Array<{ passed: boolean; detail: string }> = [];
  for (let runIdx = 1; runIdx <= RUNS; runIdx++) {
    const r = await singleRun(runIdx, runId);
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
    results.push(r);
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`invariant-runner: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 752ms:
// Spike B — fixtures (side effect 없음)

export const INSTANCE_A = "11111111-1111-1111-1111-111111111111";
export const INSTANCE_B = "22222222-2222-2222-2222-222222222222";

 succeeded in 776ms:
// Spike B — seed (truncate all tables)
// 각 시나리오는 자체 enqueue로 outbox seed를 만들도록 — seed는 단순 truncate만

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dbSuper, closeAll } from "./db.ts";
import { errorMessage } from "./errors.ts";

async function main(): Promise<void> {
  await dbSuper.execute(sql`
    TRUNCATE outbox, inbox, external_call_log, invariant_log RESTART IDENTITY
  `);
  console.log("seed: tables truncated");
  await closeAll();
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 782ms:
// Spike B — migration runner (Spike A 패턴 동일)

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { sqlSuper, closeAll } from "./db.ts";
import { errorMessage } from "./errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "migrations");

const ADVISORY_LOCK_KEY = 4837273452848n;  // Spike A와 다른 key

async function main(): Promise<void> {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  await sqlSuper.unsafe(`
    CREATE TABLE IF NOT EXISTS migrations_applied (
      filename TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  console.log("acquiring migration advisory lock");
  await sqlSuper.unsafe(`SELECT pg_advisory_lock(${ADVISORY_LOCK_KEY})`);

  try {
    for (const file of files) {
      const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      const checksum = createHash("sha256").update(content).digest("hex");

      const existing = await sqlSuper.unsafe(
        `SELECT checksum FROM migrations_applied WHERE filename = $1`,
        [file],
      );
      if (existing.length > 0) {
        const existingChecksum = (existing[0] as { checksum: string }).checksum;
        if (existingChecksum !== checksum) {
          throw new Error(`migration ${file} checksum mismatch — applied=${existingChecksum.slice(0, 8)} current=${checksum.slice(0, 8)}`);
        }
        console.log(`  skip  ${file} (checksum match)`);
        continue;
      }

      console.log(`apply ${file}`);
      await sqlSuper.begin(async (tx) => {
        await tx.unsafe(content);
        await tx`INSERT INTO migrations_applied (filename, checksum) VALUES (${file}, ${checksum})`;
      });
    }
    console.log("migrate: done");
  } finally {
    await sqlSuper.unsafe(`SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY})`);
  }

  await closeAll();
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}

 succeeded in 802ms:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.ts"]
}

 succeeded in 811ms:
{
  "name": "@glitzy/spike-b",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Spike B — worker control-plane queue + tenant-plane processing. idempotent at-least-once with exactly-once observable effects.",
  "scripts": {
    "up": "docker compose up -d",
    "down": "docker compose down -v",
    "migrate": "tsx src/migrate.ts",
    "seed": "tsx src/seed.ts",
    "scenario:basic": "tsx src/scenarios/test-basic-100.ts",
    "scenario:idempotency": "tsx src/scenarios/test-idempotency.ts",
    "scenario:failure": "tsx src/scenarios/test-failure-injection.ts",
    "scenario:stale": "tsx src/scenarios/test-stale-reclaim.ts",
    "scenario:retry": "tsx src/scenarios/test-retry-permanent.ts",
    "scenario:no-cross": "tsx src/scenarios/test-no-cross-tenant.ts",
    "scenario:invariant": "tsx src/scenarios/test-invariant-runner.ts",
    "scenario:all": "pnpm seed && pnpm scenario:basic && pnpm seed && pnpm scenario:idempotency && pnpm seed && pnpm scenario:failure && pnpm seed && pnpm scenario:stale && pnpm seed && pnpm scenario:retry && pnpm seed && pnpm scenario:no-cross && pnpm seed && pnpm scenario:invariant",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.36.4",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "dotenv-cli": "^7.4.4",
    "drizzle-kit": "^0.28.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

codex
시나리오까지 읽었습니다. 이제 지적을 파일/라인 근거로 고정하기 위해 관련 구간의 번호를 뽑고, 가능하면 typecheck도 실행해 strict 호환성을 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\worker.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\fake-provider.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\outbox.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\scenarios\\test-failure-injection.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\scenarios\\test-idempotency.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --dir apps/spike-b typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 775ms:
   1: // Spike B — Scenario 2: idempotency
   2: // 동일 sourceEventId 2회 enqueue·worker 처리 후 external call 1회·inbox row 1개
   3: 
   4: import { fileURLToPath, pathToFileURL } from "node:url";
   5: import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
   6: import { runConcurrentWorkers } from "../worker.ts";
   7: import { getExternalCallStats } from "../fake-provider.ts";
   8: import { closeAll, dbSuper } from "../db.ts";
   9: import { INSTANCE_A } from "../fixtures.ts";
  10: import { errorMessage } from "../errors.ts";
  11: import { NO_INJECTION } from "../failure-injection.ts";
  12: import { sql } from "drizzle-orm";
  13: 
  14: async function main(): Promise<void> {
  15:   console.log(`idempotency test`);
  16: 
  17:   // 첫 번째 enqueue
  18:   const e1 = await enqueueOutbox({
  19:     instanceId: INSTANCE_A,
  20:     sourceEventId: "dup-evt-1",
  21:     payload: { i: 1 },
  22:   });
  23:   // 동일 sourceEventId 두 번째 enqueue → no-op
  24:   const e2 = await enqueueOutbox({
  25:     instanceId: INSTANCE_A,
  26:     sourceEventId: "dup-evt-1",
  27:     payload: { i: 2 },
  28:   });
  29: 
  30:   const t1Passed = e1.enqueued === true && e2.enqueued === false;
  31:   console.log(`  ${t1Passed ? "PASS" : "FAIL"}  active idempotency — first=${e1.enqueued} second=${e2.enqueued}`);
  32: 
  33:   // worker 처리
  34:   await runConcurrentWorkers({
  35:     workerCount: 2,
  36:     maxRoundsPerWorker: 10,
  37:     emptyConsecutiveStop: 2,
  38:     configFactory: (idx) => ({
  39:       workerId: `worker-${idx}`,
  40:       staleAfterMs: 5 * 60 * 1000,
  41:       backoffMs: [10],
  42:       providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  43:       injection: NO_INJECTION,
  44:     }),
  45:   });
  46: 
  47:   const stats = await getOutboxStats();
  48:   const ext = await getExternalCallStats();
  49:   const inboxCount = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM inbox WHERE source_event_id='dup-evt-1'`);
  50:   const inboxN = ((inboxCount as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  51: 
  52:   const t2Passed = stats.completed === 1 && inboxN === 1 && ext.successUnique === 1 && ext.duplicateSuccess === 0;
  53:   console.log(`  ${t2Passed ? "PASS" : "FAIL"}  완료 — outbox=${stats.completed} inbox=${inboxN} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess}`);
  54: 
  55:   // completed 후 동일 sourceEventId enqueue → completed는 active state 아님 → enqueue 허용
  56:   // (실제 운영은 completed 후 retention 지나면 재enqueue 가능)
  57:   const e3 = await enqueueOutbox({
  58:     instanceId: INSTANCE_A,
  59:     sourceEventId: "dup-evt-1",
  60:     payload: { i: 3 },
  61:   });
  62:   const t3Passed = e3.enqueued === true;
  63:   console.log(`  ${t3Passed ? "PASS" : "FAIL"}  completed 후 same sourceEventId enqueue — enqueued=${e3.enqueued}`);
  64: 
  65:   // 두 번째 worker round
  66:   await runConcurrentWorkers({
  67:     workerCount: 2,
  68:     maxRoundsPerWorker: 5,
  69:     emptyConsecutiveStop: 2,
  70:     configFactory: (idx) => ({
  71:       workerId: `worker-${idx}`,
  72:       staleAfterMs: 5 * 60 * 1000,
  73:       backoffMs: [10],
  74:       providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  75:       injection: NO_INJECTION,
  76:     }),
  77:   });
  78: 
  79:   // external_call_log success row는 같은 sourceEventId에 대해 UNIQUE — 2번째 worker는 idempotent-success 반환
  80:   const ext2 = await getExternalCallStats();
  81:   const t4Passed = ext2.successUnique === 1 && ext2.duplicateSuccess === 0;
  82:   console.log(`  ${t4Passed ? "PASS" : "FAIL"}  external call no duplicate — successUnique=${ext2.successUnique} dup=${ext2.duplicateSuccess}`);
  83: 
  84:   const passed = t1Passed && t2Passed && t3Passed && t4Passed;
  85:   console.log(`idempotency: ${passed ? "PASS" : "FAIL"}`);
  86:   await closeAll();
  87:   if (!passed) process.exit(1);
  88: }
  89: 
  90: const __filename = fileURLToPath(import.meta.url);
  91: const argv1 = process.argv[1];
  92: if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  93:   main().catch(async (e) => {
  94:     console.error(errorMessage(e));
  95:     await closeAll();
  96:     process.exit(1);
  97:   });
  98: }

 succeeded in 807ms:
   1: // Spike B — outbox enqueue·claim·complete·retry·exhausted·permanent
   2: //
   3: // SoT 패턴 (Spike 계획 § B.2):
   4: // - SKIP LOCKED claim
   5: // - control-plane connection (super-user — RLS 미적용)
   6: // - 동일 (instance_id, source_event_id) 중복 enqueue 차단 (partial unique active)
   7: // - stale lock reclaim (locked_at > timeout)
   8: 
   9: import { sql } from "drizzle-orm";
  10: import type { Sql } from "postgres";
  11: import { dbSuper, sqlSuper } from "./db.ts";
  12: 
  13: export type OutboxRow = {
  14:   id: string;
  15:   instance_id: string;
  16:   source_event_id: string;
  17:   payload: Record<string, unknown>;
  18:   status: string;
  19:   attempts: number;
  20:   max_attempts: number;
  21:   next_attempt_at: Date;
  22:   locked_at: Date | null;
  23:   locked_by: string | null;
  24:   last_error: string | null;
  25:   last_error_class: string | null;
  26: };
  27: 
  28: export type EnqueueResult = {
  29:   enqueued: boolean;        // false면 idempotency 중복 (no-op)
  30:   outboxId: string | null;
  31: };
  32: 
  33: /**
  34:  * outbox에 enqueue. 동일 (instance_id, source_event_id) active state 중복은 no-op.
  35:  */
  36: export async function enqueueOutbox(input: {
  37:   instanceId: string;
  38:   sourceEventId: string;
  39:   payload: Record<string, unknown>;
  40:   maxAttempts?: number;
  41: }): Promise<EnqueueResult> {
  42:   const r = await dbSuper.execute(sql`
  43:     INSERT INTO outbox (instance_id, source_event_id, payload, max_attempts)
  44:     VALUES (
  45:       ${input.instanceId}::uuid,
  46:       ${input.sourceEventId},
  47:       ${JSON.stringify(input.payload)}::jsonb,
  48:       ${input.maxAttempts ?? 5}
  49:     )
  50:     ON CONFLICT DO NOTHING
  51:     RETURNING id
  52:   `);
  53:   const rows = r as unknown as Array<{ id: string }>;
  54:   if (rows.length === 0) {
  55:     return { enqueued: false, outboxId: null };
  56:   }
  57:   return { enqueued: true, outboxId: rows[0]!.id };
  58: }
  59: 
  60: /**
  61:  * outbox에서 다음 작업 1건을 SKIP LOCKED claim.
  62:  * claim 성공 시 status=processing, locked_at=now(), attempts++ 후 row 반환.
  63:  * 작업 없으면 null.
  64:  *
  65:  * stale processing reclaim: locked_at > staleAfterMs → 다시 pending 취급.
  66:  */
  67: export async function claimNextOutbox(workerId: string, staleAfterMs: number = 5 * 60 * 1000): Promise<OutboxRow | null> {
  68:   const result = await sqlSuper.begin(async (tx) => {
  69:     // stale processing reclaim
  70:     await tx`
  71:       UPDATE outbox SET status='pending', locked_at=NULL, locked_by=NULL
  72:       WHERE status='processing'
  73:         AND locked_at IS NOT NULL
  74:         AND locked_at < now() - ${`${staleAfterMs} milliseconds`}::interval
  75:     `;
  76: 
  77:     // SKIP LOCKED claim
  78:     const claimed = await tx<OutboxRow[]>`
  79:       WITH next AS (
  80:         SELECT id FROM outbox
  81:         WHERE status='pending' AND next_attempt_at <= now()
  82:         ORDER BY next_attempt_at
  83:         FOR UPDATE SKIP LOCKED
  84:         LIMIT 1
  85:       )
  86:       UPDATE outbox o
  87:       SET status='processing',
  88:           locked_at=now(),
  89:           locked_by=${workerId},
  90:           attempts=attempts+1
  91:       FROM next
  92:       WHERE o.id=next.id
  93:       RETURNING o.*
  94:     `;
  95:     return claimed[0] ?? null;
  96:   });
  97: 
  98:   return result;
  99: }
 100: 
 101: /**
 102:  * 처리 성공 → status=completed.
 103:  */
 104: export async function markCompleted(outboxId: string): Promise<void> {
 105:   await dbSuper.execute(sql`
 106:     UPDATE outbox SET status='completed', completed_at=now(), locked_at=NULL, locked_by=NULL
 107:     WHERE id=${outboxId}::uuid
 108:   `);
 109: }
 110: 
 111: /**
 112:  * 처리 실패 (transient) — backoff 후 재시도.
 113:  * attempts >= max_attempts면 exhausted로 전이.
 114:  */
 115: export async function markTransientFail(outboxId: string, error: string, backoffMs: number): Promise<{ exhausted: boolean }> {
 116:   const r = await dbSuper.execute(sql`
 117:     UPDATE outbox
 118:     SET status = CASE WHEN attempts >= max_attempts THEN 'exhausted' ELSE 'pending' END,
 119:         locked_at = NULL,
 120:         locked_by = NULL,
 121:         last_error = ${error},
 122:         last_error_class = 'transient',
 123:         next_attempt_at = now() + (${backoffMs} || ' milliseconds')::interval,
 124:         exhausted_at = CASE WHEN attempts >= max_attempts THEN now() ELSE exhausted_at END
 125:     WHERE id=${outboxId}::uuid
 126:     RETURNING status
 127:   `);
 128:   const status = (r as unknown as Array<{ status: string }>)[0]?.status;
 129:   return { exhausted: status === 'exhausted' };
 130: }
 131: 
 132: /**
 133:  * 처리 실패 (permanent) — 즉시 failed-permanent 전이.
 134:  */
 135: export async function markFailedPermanent(outboxId: string, error: string): Promise<void> {
 136:   await dbSuper.execute(sql`
 137:     UPDATE outbox
 138:     SET status='failed-permanent',
 139:         locked_at=NULL,
 140:         locked_by=NULL,
 141:         last_error=${error},
 142:         last_error_class='permanent'
 143:     WHERE id=${outboxId}::uuid
 144:   `);
 145: }
 146: 
 147: /**
 148:  * outbox 통계 — 시나리오 검증용
 149:  */
 150: export type OutboxStats = {
 151:   total: number;
 152:   pending: number;
 153:   processing: number;
 154:   completed: number;
 155:   exhausted: number;
 156:   failedPermanent: number;
 157: };
 158: 
 159: export async function getOutboxStats(): Promise<OutboxStats> {
 160:   const r = await dbSuper.execute(sql`
 161:     SELECT
 162:       count(*)::int AS total,
 163:       count(*) FILTER (WHERE status='pending')::int AS pending,
 164:       count(*) FILTER (WHERE status='processing')::int AS processing,
 165:       count(*) FILTER (WHERE status='completed')::int AS completed,
 166:       count(*) FILTER (WHERE status='exhausted')::int AS exhausted,
 167:       count(*) FILTER (WHERE status='failed-permanent')::int AS failed_permanent
 168:     FROM outbox
 169:   `);
 170:   const row = (r as unknown as Array<{
 171:     total: number; pending: number; processing: number;
 172:     completed: number; exhausted: number; failed_permanent: number;
 173:   }>)[0];
 174:   return {
 175:     total: row?.total ?? 0,
 176:     pending: row?.pending ?? 0,
 177:     processing: row?.processing ?? 0,
 178:     completed: row?.completed ?? 0,
 179:     exhausted: row?.exhausted ?? 0,
 180:     failedPermanent: row?.failed_permanent ?? 0,
 181:   };
 182: }

 succeeded in 820ms:
   1: // Spike B — fake external provider
   2: //
   3: // idempotent at-least-once with exactly-once observable effects:
   4: // - 같은 source_event_id에 대해 동일 성공 결과 (idempotency)
   5: // - external_call_log UNIQUE(instance_id, source_event_id) WHERE outcome='success' — 중복 success 차단
   6: // - 모든 호출 시도 (transient·permanent 포함) 기록
   7: //
   8: // 설정 가능 동작:
   9: // - failureMode: success·transient·permanent
  10: // - failBeforeSuccessAttempts: N회 fail 후 success
  11: // - permanentSourceEventIds: 해당 source_event_id는 permanent fail
  12: 
  13: import { sql } from "drizzle-orm";
  14: import { dbSuper } from "./db.ts";
  15: import { PermanentProviderError, TransientProviderError } from "./errors.ts";
  16: 
  17: export type FakeProviderConfig = {
  18:   failBeforeSuccessAttempts: number;        // 동일 source_event_id에 대해 N회 fail 후 success
  19:   permanentSourceEventIds: Set<string>;     // permanent fail로 전이할 source_event_id
  20: };
  21: 
  22: const DEFAULT_CONFIG: FakeProviderConfig = {
  23:   failBeforeSuccessAttempts: 0,
  24:   permanentSourceEventIds: new Set(),
  25: };
  26: 
  27: /**
  28:  * fake provider 호출. 외부 side effect를 simulate.
  29:  * 동일 source_event_id에 대해:
  30:  *  - 이미 success log 있으면 → idempotent success 반환 (외부 call 발생 안 함 — but log)
  31:  *  - permanentSourceEventIds 포함 → PermanentProviderError
  32:  *  - 그 외 attempt < failBeforeSuccessAttempts → TransientProviderError
  33:  *  - 통과하면 success log insert
  34:  */
  35: export async function callFakeProvider(input: {
  36:   instanceId: string;
  37:   sourceEventId: string;
  38:   payload: Record<string, unknown>;
  39:   workerId: string;
  40:   config?: FakeProviderConfig;
  41: }): Promise<{ outcome: "success" | "idempotent-success" }> {
  42:   const cfg = input.config ?? DEFAULT_CONFIG;
  43: 
  44:   // idempotency 확인: 이미 success 호출 있으면 no-op
  45:   const existing = await dbSuper.execute(sql`
  46:     SELECT 1 FROM external_call_log
  47:     WHERE instance_id=${input.instanceId}::uuid
  48:       AND source_event_id=${input.sourceEventId}
  49:       AND outcome='success'
  50:     LIMIT 1
  51:   `);
  52:   if ((existing as unknown as unknown[]).length > 0) {
  53:     return { outcome: "idempotent-success" };
  54:   }
  55: 
  56:   // permanent fail
  57:   if (cfg.permanentSourceEventIds.has(input.sourceEventId)) {
  58:     await dbSuper.execute(sql`
  59:       INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
  60:       VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'permanent-fail')
  61:     `);
  62:     throw new PermanentProviderError(`permanent fail for ${input.sourceEventId}`);
  63:   }
  64: 
  65:   // transient fail count
  66:   const failCountResult = await dbSuper.execute(sql`
  67:     SELECT count(*)::int AS c FROM external_call_log
  68:     WHERE instance_id=${input.instanceId}::uuid
  69:       AND source_event_id=${input.sourceEventId}
  70:       AND outcome='transient-fail'
  71:   `);
  72:   const failCount = (failCountResult as unknown as Array<{ c: number }>)[0]?.c ?? 0;
  73: 
  74:   if (failCount < cfg.failBeforeSuccessAttempts) {
  75:     await dbSuper.execute(sql`
  76:       INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
  77:       VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'transient-fail')
  78:     `);
  79:     throw new TransientProviderError(`transient fail attempt ${failCount + 1}`);
  80:   }
  81: 
  82:   // success — UNIQUE constraint로 idempotency 강제
  83:   try {
  84:     await dbSuper.execute(sql`
  85:       INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
  86:       VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'success')
  87:     `);
  88:     return { outcome: "success" };
  89:   } catch (e) {
  90:     // race: 다른 worker가 동시에 success insert → unique violation → idempotent
  91:     if ((e as { code?: string })?.code === "23505") {
  92:       return { outcome: "idempotent-success" };
  93:     }
  94:     throw e;
  95:   }
  96: }
  97: 
  98: /**
  99:  * external_call_log 통계
 100:  */
 101: export async function getExternalCallStats(): Promise<{
 102:   total: number;
 103:   successUnique: number;       // distinct source_event_id with success
 104:   successTotal: number;
 105:   transientFail: number;
 106:   permanentFail: number;
 107:   duplicateSuccess: number;    // 동일 source_event_id에 대해 success가 2번 이상 (idempotency 위반 — 0이어야 함)
 108: }> {
 109:   const r = await dbSuper.execute(sql`
 110:     SELECT
 111:       count(*)::int AS total,
 112:       count(*) FILTER (WHERE outcome='success')::int AS success_total,
 113:       count(DISTINCT (instance_id, source_event_id)) FILTER (WHERE outcome='success')::int AS success_unique,
 114:       count(*) FILTER (WHERE outcome='transient-fail')::int AS transient_fail,
 115:       count(*) FILTER (WHERE outcome='permanent-fail')::int AS permanent_fail
 116:     FROM external_call_log
 117:   `);
 118:   const row = (r as unknown as Array<{
 119:     total: number; success_total: number; success_unique: number;
 120:     transient_fail: number; permanent_fail: number;
 121:   }>)[0];
 122: 
 123:   return {
 124:     total: row?.total ?? 0,
 125:     successUnique: row?.success_unique ?? 0,
 126:     successTotal: row?.success_total ?? 0,
 127:     transientFail: row?.transient_fail ?? 0,
 128:     permanentFail: row?.permanent_fail ?? 0,
 129:     duplicateSuccess: (row?.success_total ?? 0) - (row?.success_unique ?? 0),
 130:   };
 131: }

 succeeded in 812ms:
   1: // Spike B — Scenario 3: failure injection 8 point
   2: // 각 point에서 crash → 후속 worker가 stale reclaim + 정상 처리 → 최종 inbox·external 정합
   3: 
   4: import { fileURLToPath, pathToFileURL } from "node:url";
   5: import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
   6: import { processOneJob } from "../worker.ts";
   7: import { getExternalCallStats } from "../fake-provider.ts";
   8: import { closeAll, dbSuper } from "../db.ts";
   9: import { INSTANCE_A } from "../fixtures.ts";
  10: import { errorMessage } from "../errors.ts";
  11: import { type FailurePoint, NO_INJECTION } from "../failure-injection.ts";
  12: import { sql } from "drizzle-orm";
  13: 
  14: const POINTS: FailurePoint[] = [
  15:   "before-claim",
  16:   "after-claim",
  17:   "before-tenant-insert",
  18:   "after-tenant-insert",
  19:   "after-tenant-commit-before-mark-completed",
  20:   "before-retry-schedule",
  21:   "after-retry-schedule",
  22:   "before-permanent-alert",
  23:   "after-permanent-alert",
  24: ];
  25: 
  26: type Result = { passed: boolean; detail: string };
  27: 
  28: async function main(): Promise<void> {
  29:   console.log(`failure-injection 8 point`);
  30:   const results: Result[] = [];
  31: 
  32:   for (const point of POINTS) {
  33:     // 매 point마다 clean state
  34:     await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  35:     const sourceEventId = `inject-${point}`;
  36:     await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId, payload: { point } });
  37: 
  38:     // 1차: injection 발동 — crash 시뮬레이션
  39:     const r1 = await processOneJob({
  40:       workerId: "worker-inj",
  41:       staleAfterMs: 0, // stale reclaim 즉시 가능
  42:       backoffMs: [10],
  43:       providerConfig:
  44:         point.startsWith("before-permanent") || point.startsWith("after-permanent")
  45:           ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set([sourceEventId]) }
  46:           : { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  47:       injection: { pointToFailAt: point, triggerOnAttempt: null },
  48:     });
  49: 
  50:     // 2차·3차: 후속 worker (injection 없음) — stale reclaim 후 정상 처리
  51:     let postOutcome = "";
  52:     for (let i = 0; i < 3; i++) {
  53:       const r2 = await processOneJob({
  54:         workerId: `worker-recovery-${i}`,
  55:         staleAfterMs: 0,
  56:         backoffMs: [10],
  57:         providerConfig:
  58:           point.startsWith("before-permanent") || point.startsWith("after-permanent")
  59:             ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set([sourceEventId]) }
  60:             : { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  61:         injection: NO_INJECTION,
  62:       });
  63:       postOutcome = r2.outcome;
  64:       if (r2.outcome === "completed" || r2.outcome === "failed-permanent" || r2.outcome === "no-job") break;
  65:     }
  66: 
  67:     // 최종 invariant
  68:     const stats = await getOutboxStats();
  69:     const ext = await getExternalCallStats();
  70:     const inboxR = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM inbox`);
  71:     const inboxN = ((inboxR as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  72: 
  73:     const isPermanent = point.startsWith("before-permanent") || point.startsWith("after-permanent");
  74: 
  75:     // permanent point: outbox=failed-permanent or processing(injection 후 unlock)
  76:     // non-permanent: outbox=completed
  77:     let expectedOutbox: "completed" | "failed-permanent";
  78:     let expectedExt: number;
  79:     let expectedInbox: number;
  80: 
  81:     if (isPermanent) {
  82:       expectedOutbox = "failed-permanent";
  83:       expectedExt = 0;     // permanent fail은 success 없음
  84:       expectedInbox = 0;   // permanent 시 inbox insert 전 fail
  85:     } else {
  86:       expectedOutbox = "completed";
  87:       expectedExt = 1;
  88:       expectedInbox = 1;
  89:     }
  90: 
  91:     const outboxMatch =
  92:       expectedOutbox === "completed" ? stats.completed === 1 : stats.failedPermanent === 1;
  93:     const extMatch = ext.successUnique === expectedExt;
  94:     const inboxMatch = inboxN === expectedInbox;
  95:     const noDuplicate = ext.duplicateSuccess === 0;
  96: 
  97:     const passed = outboxMatch && extMatch && inboxMatch && noDuplicate;
  98:     results.push({
  99:       passed,
 100:       detail: `${point}: r1=${r1.outcome} → recovery=${postOutcome} → outbox.${expectedOutbox}=${outboxMatch} inbox=${inboxN}/${expectedInbox} ext=${ext.successUnique}/${expectedExt} dup=${ext.duplicateSuccess}`,
 101:     });
 102:   }
 103: 
 104:   for (const r of results) {
 105:     console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
 106:   }
 107:   const allPassed = results.every((r) => r.passed);
 108:   console.log(`failure-injection: ${allPassed ? "PASS" : "FAIL"}`);
 109:   await closeAll();
 110:   if (!allPassed) process.exit(1);
 111: }
 112: 
 113: const __filename = fileURLToPath(import.meta.url);
 114: const argv1 = process.argv[1];
 115: if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
 116:   main().catch(async (e) => {
 117:     console.error(errorMessage(e));
 118:     await closeAll();
 119:     process.exit(1);
 120:   });
 121: }

 succeeded in 845ms:
   1: // Spike B — worker
   2: //
   3: // loop:
   4: // 1. claim outbox row (SKIP LOCKED) — control-plane
   5: // 2. instance_id 추출 → withTenantTransaction으로 tenant-plane 처리
   6: // 3. tenant inbox row insert (idempotent via UNIQUE)
   7: // 4. external provider call (idempotent via UNIQUE on success)
   8: // 5. tenant commit
   9: // 6. outbox markCompleted (control-plane)
  10: //
  11: // failure injection으로 각 단계 사이 crash 시뮬레이션.
  12: // retry: TransientProviderError → markTransientFail (backoff)
  13: // permanent: PermanentProviderError → markFailedPermanent
  14: 
  15: import { sql } from "drizzle-orm";
  16: import {
  17:   claimNextOutbox,
  18:   markCompleted,
  19:   markTransientFail,
  20:   markFailedPermanent,
  21:   type OutboxRow,
  22: } from "./outbox.ts";
  23: import { withTenantTransaction } from "./tenant.ts";
  24: import { callFakeProvider, type FakeProviderConfig } from "./fake-provider.ts";
  25: import { errorMessage, PermanentProviderError, TransientProviderError } from "./errors.ts";
  26: import { maybeFail, type InjectionConfig, NO_INJECTION, InjectedFailureError } from "./failure-injection.ts";
  27: 
  28: export type WorkerConfig = {
  29:   workerId: string;
  30:   staleAfterMs: number;
  31:   backoffMs: number[];                    // attempts별 backoff. 마지막 값을 attempts > length일 때 사용
  32:   providerConfig: FakeProviderConfig;
  33:   injection: InjectionConfig;
  34: };
  35: 
  36: export type ProcessResult =
  37:   | { outcome: "completed"; outboxId: string }
  38:   | { outcome: "retry-scheduled"; outboxId: string }
  39:   | { outcome: "exhausted"; outboxId: string }
  40:   | { outcome: "failed-permanent"; outboxId: string }
  41:   | { outcome: "injected-crash"; outboxId: string; point: string }
  42:   | { outcome: "no-job" };
  43: 
  44: function getBackoffMs(attempts: number, backoffMs: number[]): number {
  45:   if (backoffMs.length === 0) return 1000;
  46:   const idx = Math.min(attempts - 1, backoffMs.length - 1);
  47:   return backoffMs[idx]!;
  48: }
  49: 
  50: /**
  51:  * worker 1회 루프: 1 outbox claim → 처리 → 결과
  52:  */
  53: export async function processOneJob(config: WorkerConfig): Promise<ProcessResult> {
  54:   const inj = config.injection;
  55: 
  56:   // 1. before-claim injection
  57:   maybeFail(inj, "before-claim", 0);
  58: 
  59:   // 2. claim
  60:   const row: OutboxRow | null = await claimNextOutbox(config.workerId, config.staleAfterMs);
  61:   if (!row) return { outcome: "no-job" };
  62: 
  63:   // 3. after-claim injection
  64:   try {
  65:     maybeFail(inj, "after-claim", row.attempts);
  66: 
  67:     // 4. tenant-plane 처리
  68:     let providerOutcome: "success" | "idempotent-success" | null = null;
  69:     let tenantSucceeded = false;
  70: 
  71:     await withTenantTransaction(row.instance_id, async (tx) => {
  72:       maybeFail(inj, "before-tenant-insert", row.attempts);
  73: 
  74:       // inbox insert (idempotent)
  75:       await tx.execute(sql`
  76:         INSERT INTO inbox (instance_id, source_event_id, outbox_id, payload)
  77:         VALUES (
  78:           ${row.instance_id}::uuid,
  79:           ${row.source_event_id},
  80:           ${row.id}::uuid,
  81:           ${JSON.stringify(row.payload)}::jsonb
  82:         )
  83:         ON CONFLICT (instance_id, source_event_id) DO NOTHING
  84:       `);
  85: 
  86:       maybeFail(inj, "after-tenant-insert", row.attempts);
  87: 
  88:       // external provider call (tenant transaction 안 — but external_call_log는 super-user에서 별도 update)
  89:       // 실제로는 transaction 밖 호출이 더 안전 (외부 call 후 inbox commit). prototype은 sequential.
  90:       const r = await callFakeProvider({
  91:         instanceId: row.instance_id,
  92:         sourceEventId: row.source_event_id,
  93:         payload: row.payload,
  94:         workerId: config.workerId,
  95:         config: config.providerConfig,
  96:       });
  97:       providerOutcome = r.outcome;
  98: 
  99:       tenantSucceeded = true;
 100:     });
 101: 
 102:     // 5. after-tenant-commit-before-mark-completed injection
 103:     maybeFail(inj, "after-tenant-commit-before-mark-completed", row.attempts);
 104: 
 105:     // 6. mark completed
 106:     await markCompleted(row.id);
 107:     return { outcome: "completed", outboxId: row.id };
 108:   } catch (e) {
 109:     if (e instanceof InjectedFailureError) {
 110:       // injection은 outbox state 유지 (locked_at NULL 안 됨 — stale reclaim 대상)
 111:       // 실제 worker crash 시뮬레이션
 112:       return { outcome: "injected-crash", outboxId: row.id, point: e.message };
 113:     }
 114: 
 115:     if (e instanceof PermanentProviderError) {
 116:       maybeFail(inj, "before-permanent-alert", row.attempts);
 117:       await markFailedPermanent(row.id, errorMessage(e));
 118:       maybeFail(inj, "after-permanent-alert", row.attempts);
 119:       return { outcome: "failed-permanent", outboxId: row.id };
 120:     }
 121: 
 122:     if (e instanceof TransientProviderError) {
 123:       maybeFail(inj, "before-retry-schedule", row.attempts);
 124:       const backoff = getBackoffMs(row.attempts, config.backoffMs);
 125:       const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
 126:       maybeFail(inj, "after-retry-schedule", row.attempts);
 127:       return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
 128:     }
 129: 
 130:     // unknown error → transient
 131:     const backoff = getBackoffMs(row.attempts, config.backoffMs);
 132:     const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
 133:     return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
 134:   }
 135: }
 136: 
 137: /**
 138:  * 5 worker 동시 처리 — Promise.all로 5개 worker loop. 각자 N번 시도 또는 no-job N번 후 종료.
 139:  */
 140: export async function runConcurrentWorkers(input: {
 141:   workerCount: number;
 142:   maxRoundsPerWorker: number;
 143:   emptyConsecutiveStop: number;   // no-job N회 연속 시 worker 종료
 144:   configFactory: (workerIdx: number) => WorkerConfig;
 145: }): Promise<{ perWorker: Array<{ workerId: string; rounds: number; results: Record<string, number> }> }> {
 146:   const promises: Promise<{ workerId: string; rounds: number; results: Record<string, number> }>[] = [];
 147: 
 148:   for (let w = 0; w < input.workerCount; w++) {
 149:     const cfg = input.configFactory(w);
 150:     promises.push((async () => {
 151:       const counts: Record<string, number> = {};
 152:       let consecutiveEmpty = 0;
 153:       let rounds = 0;
 154:       for (let i = 0; i < input.maxRoundsPerWorker; i++) {
 155:         rounds++;
 156:         const r = await processOneJob(cfg);
 157:         counts[r.outcome] = (counts[r.outcome] ?? 0) + 1;
 158:         if (r.outcome === "no-job") {
 159:           consecutiveEmpty++;
 160:           if (consecutiveEmpty >= input.emptyConsecutiveStop) break;
 161:         } else {
 162:           consecutiveEmpty = 0;
 163:         }
 164:       }
 165:       return { workerId: cfg.workerId, rounds, results: counts };
 166:     })());
 167:   }
 168: 
 169:   const perWorker = await Promise.all(promises);
 170:   return { perWorker };
 171: }

2026-05-15T04:37:31.495818Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.2 seconds
Output:

> @glitzy/spike-b@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\spike-b
> tsc --noEmit

 ELIFECYCLE  Command failed with exit code 1.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
'tsc' is not recognized as an internal or external command,
operable program or batch file.

 exited 1 in 1171ms:

> @glitzy/spike-b@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\spike-b
> tsc --noEmit

 ELIFECYCLE  Command failed with exit code 1.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
'tsc' is not recognized as an internal or external command,
operable program or batch file.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\migrations\\002_outbox.sql | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\migrations\\003_inbox.sql | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\migrations\\004_external_call_log.sql | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\migrations\\001_roles.sql | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\scenarios\\test-invariant-runner.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\scenarios\\test-basic-100.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 771ms:
   1: -- Spike B — migration 002: outbox (control-plane, RLS 미적용)
   2: --
   3: -- worker가 instance context 모르고 claim → status·tenant 처리·완료 mark
   4: -- super-user 또는 control-plane role 전용 — app_tenant_user GRANT 미부여
   5: 
   6: CREATE TABLE outbox (
   7:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   8:   instance_id UUID NOT NULL,
   9:   source_event_id TEXT NOT NULL,           -- idempotency key
  10:   payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  11:   status TEXT NOT NULL DEFAULT 'pending',  -- pending·processing·completed·exhausted·failed-permanent
  12:   attempts INT NOT NULL DEFAULT 0,
  13:   max_attempts INT NOT NULL DEFAULT 5,
  14:   next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  15:   locked_at TIMESTAMPTZ,
  16:   locked_by TEXT,
  17:   last_error TEXT,
  18:   last_error_class TEXT,                   -- transient·permanent
  19:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  20:   completed_at TIMESTAMPTZ,
  21:   exhausted_at TIMESTAMPTZ,
  22:   CHECK (status IN ('pending', 'processing', 'completed', 'exhausted', 'failed-permanent')),
  23:   CHECK (last_error_class IS NULL OR last_error_class IN ('transient', 'permanent'))
  24: );
  25: 
  26: -- idempotency: 동일 (instance_id, source_event_id) 중복 enqueue 차단 (active state)
  27: CREATE UNIQUE INDEX outbox_idempotency_active
  28:   ON outbox (instance_id, source_event_id)
  29:   WHERE status IN ('pending', 'processing');
  30: 
  31: -- claim용 partial index — pending status worker claim 빠르게
  32: CREATE INDEX outbox_claim_idx
  33:   ON outbox (next_attempt_at, locked_at)
  34:   WHERE status = 'pending';
  35: 
  36: -- stale processing detection
  37: CREATE INDEX outbox_stale_idx
  38:   ON outbox (locked_at)
  39:   WHERE status = 'processing';
  40: 
  41: -- 모든 status별 조회용
  42: CREATE INDEX outbox_status_idx ON outbox (status, created_at DESC);
  43: 
  44: -- RLS 미적용 (control-plane)
  45: -- app_tenant_user GRANT 미부여 (요구 시 명시)

 succeeded in 782ms:
   1: -- Spike B — migration 003: inbox (tenant-plane, RLS 적용)
   2: --
   3: -- worker가 outbox claim 후 instance_id 알게 되면 withTenantTransaction으로 처리.
   4: -- inbox는 tenant-scoped — RLS WITH CHECK로 cross-instance 차단.
   5: -- idempotent UNIQUE(instance_id, source_event_id) — 재처리 시 no-op
   6: 
   7: CREATE TABLE inbox (
   8:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   9:   instance_id UUID NOT NULL,
  10:   source_event_id TEXT NOT NULL,
  11:   outbox_id UUID NOT NULL,                 -- 추적용 (FK는 schema-per-tenant 시 깨질 수 있어 생략)
  12:   payload JSONB NOT NULL,
  13:   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  14: );
  15: 
  16: -- idempotency: 동일 (instance_id, source_event_id) 두 번 처리해도 1 row
  17: CREATE UNIQUE INDEX inbox_idempotency
  18:   ON inbox (instance_id, source_event_id);
  19: 
  20: CREATE INDEX inbox_outbox_idx ON inbox (outbox_id);
  21: 
  22: -- RLS enable + FORCE
  23: ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
  24: ALTER TABLE inbox FORCE ROW LEVEL SECURITY;
  25: 
  26: CREATE POLICY tenant_isolation ON inbox
  27:   FOR ALL TO app_tenant_user
  28:   USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  29:   WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
  30: 
  31: GRANT SELECT, INSERT, UPDATE, DELETE ON inbox TO app_tenant_user;

 succeeded in 764ms:
   1: -- Spike B — migration 001: roles + pgcrypto
   2: -- app_tenant_user: tenant 작업 (inbox)·RLS 적용
   3: -- postgres super-user: control-plane (outbox·external_call_log·invariant_log)
   4: 
   5: CREATE EXTENSION IF NOT EXISTS pgcrypto;
   6: 
   7: CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT NOBYPASSRLS;
   8: 
   9: GRANT USAGE ON SCHEMA public TO app_tenant_user;

 succeeded in 792ms:
   1: -- Spike B — migration 004: external_call_log (fake provider call tracking)
   2: --
   3: -- 외부 side effect 호출 count 추적. idempotent at-least-once with exactly-once observable:
   4: -- 같은 source_event_id에 대해 외부 call이 정확히 1번만 일어나야 함 (재처리해도 중복 호출 차단).
   5: -- super-user 전용 — app_tenant_user GRANT 미부여
   6: 
   7: CREATE TABLE external_call_log (
   8:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   9:   instance_id UUID NOT NULL,
  10:   source_event_id TEXT NOT NULL,           -- idempotency key (외부 provider도 동일 키 사용 가정)
  11:   call_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  12:   worker_id TEXT NOT NULL,                 -- 어느 worker가 호출했는지
  13:   outcome TEXT NOT NULL,                   -- success·transient-fail·permanent-fail
  14:   CHECK (outcome IN ('success', 'transient-fail', 'permanent-fail'))
  15: );
  16: 
  17: -- 동일 source_event_id에 대한 success 호출은 1번만 (idempotent at-least-once with exactly-once observable)
  18: CREATE UNIQUE INDEX external_call_log_idempotency_success
  19:   ON external_call_log (instance_id, source_event_id)
  20:   WHERE outcome = 'success';
  21: 
  22: CREATE INDEX external_call_log_event_idx
  23:   ON external_call_log (instance_id, source_event_id, call_timestamp DESC);

 succeeded in 800ms:
   1: // Spike B — Scenario 7: invariant runner
   2: // 1000 jobs × 10 workers × 5 runs — 누적 invariant 검증
   3: 
   4: import { fileURLToPath, pathToFileURL } from "node:url";
   5: import { randomUUID } from "node:crypto";
   6: import { sql } from "drizzle-orm";
   7: import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
   8: import { runConcurrentWorkers } from "../worker.ts";
   9: import { getExternalCallStats } from "../fake-provider.ts";
  10: import { closeAll, dbSuper } from "../db.ts";
  11: import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
  12: import { errorMessage } from "../errors.ts";
  13: import { NO_INJECTION } from "../failure-injection.ts";
  14: 
  15: const JOBS = Number(process.env.INVARIANT_JOBS ?? "1000");
  16: const WORKERS = Number(process.env.INVARIANT_WORKERS ?? "10");
  17: const RUNS = Number(process.env.INVARIANT_RUNS ?? "5");
  18: 
  19: async function singleRun(runIdx: number, runId: string): Promise<{ passed: boolean; detail: string }> {
  20:   await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log`);
  21: 
  22:   for (let i = 0; i < JOBS; i++) {
  23:     await enqueueOutbox({
  24:       instanceId: i % 2 === 0 ? INSTANCE_A : INSTANCE_B,
  25:       sourceEventId: `inv-${runIdx}-${i}`,
  26:       payload: { runIdx, i },
  27:     });
  28:   }
  29: 
  30:   const start = Date.now();
  31:   await runConcurrentWorkers({
  32:     workerCount: WORKERS,
  33:     maxRoundsPerWorker: JOBS * 2,
  34:     emptyConsecutiveStop: 3,
  35:     configFactory: (idx) => ({
  36:       workerId: `worker-${runIdx}-${idx}`,
  37:       staleAfterMs: 5 * 60 * 1000,
  38:       backoffMs: [10],
  39:       providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  40:       injection: NO_INJECTION,
  41:     }),
  42:   });
  43:   const elapsed = Date.now() - start;
  44: 
  45:   const stats = await getOutboxStats();
  46:   const ext = await getExternalCallStats();
  47:   const inboxR = await dbSuper.execute(sql`
  48:     SELECT
  49:       count(*)::int AS total,
  50:       count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
  51:       count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
  52:     FROM inbox
  53:   `);
  54:   const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];
  55: 
  56:   const passed =
  57:     stats.completed === JOBS &&
  58:     stats.pending === 0 &&
  59:     inb?.total === JOBS &&
  60:     inb?.unique_count === JOBS &&
  61:     (inb?.foreign_count ?? -1) === 0 &&
  62:     ext.successUnique === JOBS &&
  63:     ext.duplicateSuccess === 0;
  64: 
  65:   await dbSuper.execute(sql`
  66:     INSERT INTO invariant_log (
  67:       run_id, scenario, job_count, worker_count, processed,
  68:       inbox_rows, external_success_calls, external_total_calls,
  69:       foreign_instance_inbox, duplicate_inbox, duplicate_external_success,
  70:       pending_outbox, exhausted_outbox, permanent_failed_outbox,
  71:       passed, elapsed_ms
  72:     ) VALUES (
  73:       ${runId}::uuid, ${"invariant-run"}, ${JOBS}, ${WORKERS}, ${stats.completed},
  74:       ${inb?.total ?? 0}, ${ext.successUnique}, ${ext.total},
  75:       ${inb?.foreign_count ?? 0}, ${(inb?.total ?? 0) - (inb?.unique_count ?? 0)}, ${ext.duplicateSuccess},
  76:       ${stats.pending}, ${stats.exhausted}, ${stats.failedPermanent},
  77:       ${passed}, ${elapsed}
  78:     )
  79:   `);
  80: 
  81:   return {
  82:     passed,
  83:     detail: `run ${runIdx}: completed=${stats.completed}/${JOBS} inbox=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess} elapsed=${elapsed}ms`,
  84:   };
  85: }
  86: 
  87: async function main(): Promise<void> {
  88:   console.log(`invariant-runner: JOBS=${JOBS} WORKERS=${WORKERS} RUNS=${RUNS}`);
  89:   const runId = randomUUID();
  90: 
  91:   const results: Array<{ passed: boolean; detail: string }> = [];
  92:   for (let runIdx = 1; runIdx <= RUNS; runIdx++) {
  93:     const r = await singleRun(runIdx, runId);
  94:     console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  95:     results.push(r);
  96:   }
  97: 
  98:   const allPassed = results.every((r) => r.passed);
  99:   console.log(`invariant-runner: ${allPassed ? "PASS" : "FAIL"}`);
 100:   await closeAll();
 101:   if (!allPassed) process.exit(1);
 102: }
 103: 
 104: const __filename = fileURLToPath(import.meta.url);
 105: const argv1 = process.argv[1];
 106: if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
 107:   main().catch(async (e) => {
 108:     console.error(errorMessage(e));
 109:     await closeAll();
 110:     process.exit(1);
 111:   });
 112: }

 succeeded in 802ms:
   1: // Spike B — Scenario 1: 100 outbox·5 worker 정상 처리
   2: // 통과: 100 outbox completed·100 inbox row·100 success external call·foreign instance 0·duplicate 0
   3: 
   4: import { fileURLToPath, pathToFileURL } from "node:url";
   5: import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
   6: import { runConcurrentWorkers } from "../worker.ts";
   7: import { getExternalCallStats } from "../fake-provider.ts";
   8: import { closeAll, dbSuper } from "../db.ts";
   9: import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
  10: import { errorMessage } from "../errors.ts";
  11: import { NO_INJECTION } from "../failure-injection.ts";
  12: import { sql } from "drizzle-orm";
  13: 
  14: const JOBS = Number(process.env.BASIC_JOBS ?? "100");
  15: const WORKERS = Number(process.env.BASIC_WORKERS ?? "5");
  16: 
  17: async function main(): Promise<void> {
  18:   console.log(`basic-100: JOBS=${JOBS} WORKERS=${WORKERS}`);
  19: 
  20:   // outbox seed (절반 instance-a, 절반 instance-b)
  21:   for (let i = 0; i < JOBS; i++) {
  22:     const instanceId = i % 2 === 0 ? INSTANCE_A : INSTANCE_B;
  23:     await enqueueOutbox({
  24:       instanceId,
  25:       sourceEventId: `evt-${i}`,
  26:       payload: { i, label: `job-${i}` },
  27:     });
  28:   }
  29: 
  30:   const start = Date.now();
  31:   const { perWorker } = await runConcurrentWorkers({
  32:     workerCount: WORKERS,
  33:     maxRoundsPerWorker: JOBS * 2,
  34:     emptyConsecutiveStop: 3,
  35:     configFactory: (idx) => ({
  36:       workerId: `worker-${idx}`,
  37:       staleAfterMs: 5 * 60 * 1000,
  38:       backoffMs: [10, 50, 100, 500, 1000],
  39:       providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
  40:       injection: NO_INJECTION,
  41:     }),
  42:   });
  43:   const elapsed = Date.now() - start;
  44: 
  45:   const stats = await getOutboxStats();
  46:   const ext = await getExternalCallStats();
  47: 
  48:   // inbox 통계
  49:   const inboxR = await dbSuper.execute(sql`
  50:     SELECT
  51:       count(*)::int AS total,
  52:       count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
  53:       count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
  54:     FROM inbox
  55:   `);
  56:   const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];
  57: 
  58:   console.log("\n=== basic-100 result ===");
  59:   console.log(`  per-worker:`);
  60:   for (const w of perWorker) {
  61:     console.log(`    ${w.workerId}: rounds=${w.rounds} results=${JSON.stringify(w.results)}`);
  62:   }
  63:   console.log(`  outbox: total=${stats.total} completed=${stats.completed} pending=${stats.pending}`);
  64:   console.log(`  inbox: total=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count}`);
  65:   console.log(`  external: total=${ext.total} successUnique=${ext.successUnique} duplicateSuccess=${ext.duplicateSuccess}`);
  66:   console.log(`  elapsed: ${elapsed}ms`);
  67: 
  68:   const passed =
  69:     stats.completed === JOBS &&
  70:     stats.pending === 0 &&
  71:     inb?.total === JOBS &&
  72:     inb?.unique_count === JOBS &&
  73:     (inb?.foreign_count ?? -1) === 0 &&
  74:     ext.successUnique === JOBS &&
  75:     ext.duplicateSuccess === 0;
  76: 
  77:   console.log(`basic-100: ${passed ? "PASS" : "FAIL"}`);
  78:   await closeAll();
  79:   if (!passed) process.exit(1);
  80: }
  81: 
  82: const __filename = fileURLToPath(import.meta.url);
  83: const argv1 = process.argv[1];
  84: if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  85:   main().catch(async (e) => {
  86:     console.error(errorMessage(e));
  87:     await closeAll();
  88:     process.exit(1);
  89:   });
  90: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "SPIKE[0-9]-|ready_for_acceptance|findings" docs apps -g "*.md" -g "*.json"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\tenant.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps'"\\spike-b\\src\\db.ts | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 613ms:
docs\admin\REVIEW_WORKFLOW.md:710:  // Spike 결정 cascade (SPIKE1-13·SPIKE2-04)
docs\admin\REVIEW_WORKFLOW.md:712:  | "signed-url-revocation-requested";        // SPIKE2-04 정정 — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer). 운영자 revoke 요청 → credential rotation 또는 object key rotation으로 후속 처리
docs\core\CONTENT_STANDARDS.md:418:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
docs\core\CONTENT_STANDARDS.md:432:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
docs\core\CONTENT_STANDARDS.md:451:  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
docs\core\CONTENT_STANDARDS.md:452:  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
docs\core\CONTENT_STANDARDS.md:453:  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
docs\core\CONTENT_STANDARDS.md:455:  findingsBySeverity: {
docs\core\CONTENT_STANDARDS.md:463:  // 상세 findings
docs\core\CONTENT_STANDARDS.md:464:  findings: Finding[];
docs\core\CONTENT_STANDARDS.md:468:// - findings에 severity="fail" 1개 이상 → "block"
docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs\core\CONTENT_STANDARDS.md:647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:3:> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 1·minor 1 (SPIKE3-01 정정 완료. INFRA cleanup minor는 후속)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:15:### 0.1 prototype 범위·일정 (SPIKE1-16 — 10일로 확장)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:28:| Day 10 (Wed Week 2) | **E-provider** — Vercel preview·Auth.js magic link callback·session persistence·tampering·403 matrix (SPIKE2-02) + 종합 보고서·v1.0 결정 갱신·Week 3~6 계획 분기 | provider smoke gate + dependency graph |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:32:### 0.2 통과·실패·invariant 측정 (SPIKE1-05 정정)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:37:negative invariant 측정 표준 (SPIKE1-05):
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:41:- 성능은 별도 측정 (correctness pass와 분리 — SPIKE1-17)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:43:### 0.3 provider smoke gate (SPIKE1-01·04 — 핵심 정정)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:51:### 0.4 신규 AuditAction cascade (SPIKE1-13·SPIKE2-04)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:55:- `signed-url-revocation-requested` (SPIKE2-04 정정 — rename from `signed-url-revoked`) — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer URL). 운영자 revoke 요청 → 후속 credential rotation 또는 object key rotation으로 처리
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:57:### 0.5 DATA_MODEL C-23 cascade (SPIKE2-03)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:65:### A.1 가설 (SPIKE1-18 scope 정리)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:69:(Auth.js·resolveTenantContext는 Spike E로 분리 — SPIKE1-03·18)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:71:### A.2 실험 시나리오 (SPIKE1-06·07 — 쓰기·audit 추가)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:107:### A.3 통과 기준 (SPIKE1-05·17 — invariant + 성능 분리)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:119:| 성능 (분리·SPIKE1-17) | baseline |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:123:### A.4 실패 시 대안 + reversal blast radius (SPIKE1-14)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:132:### A.5 downstream unblock (SPIKE1-15)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:139:## Spike B: Worker control-plane + tenant-plane (SPIKE1-08·09·10)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:141:### B.1 가설 (SPIKE1-08 정정)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:145:(exactly-once 가설 폐기 — SPIKE1-08)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:147:### B.2 실험 시나리오 (SPIKE1-09·10 — failure injection·외부 call)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:200:## Spike C: Cloudflare R2 — local + provider 분리 (SPIKE1-04·11·12)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:239:| 만료 status code | provider 실제 응답 code 기록 (401/403 — SPIKE1-11 정정) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:259:## Spike D: Drizzle Kit migration deploy (SPIKE1-02 신규 — P0)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:292:### D.2-artifact (SPIKE2-07)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:326:## Spike E: Auth.js + resolveTenantContext + membership (SPIKE1-03 신규 — P0)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:357:### E.2-provider: Vercel preview + Auth.js production-like (Day 10 — SPIKE2-02 신규)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:366:| Day artifact (SPIKE2-07) | preview smoke report + 403 matrix + session DB row 증거 (스크린샷 또는 SQL dump) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:407:## 종합 dependency graph + partial state matrix (SPIKE1-15·SPIKE2-05)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:439:| A PROVIDER_PASS + D LOCAL_PASS + B LOCAL_PASS + C/E provider pending 또는 LOCAL_PASS (SPIKE3-01 정정) | Week 3 schema/migration·worker skeleton·UI 컴포넌트 | Week 4 production-readiness·Storage 적용·admin login flow until provider gate | minor |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:452:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정**. SPIKE3-01 Day 10 의사결정 매트릭스 D LOCAL_PASS 정정 (D는 local-only gate). SPIKE3-02 INFRA 요약부 cleanup은 후속 (minor). **3 cycle 누계 27 지적 전건 수용** (SPIKE1: 18 + SPIKE2: 7 + SPIKE3: 2). SoT cascade 완료: INFRA §4.1·4.2·REVIEW_WORKFLOW AuditAction 4종·DATA_MODEL C-23 v0.24 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:453:| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:454:| 2026-05-15 | (v0.2 이전 비고) | codex 1차 비평 18 지적 전건 수용: (1) **provider smoke gate** — local + provider 2단계 분리 (SPIKE1-01·04), (2) **Spike D 신설** — Drizzle Kit migration deploy (SPIKE1-02), (3) **Spike E 신설** — Auth.js + resolveTenantContext + membership invalidation (SPIKE1-03), (4) **invariant 측정 표준화** — 1000 iterations × 20 concurrent + invariant SQL binary 검증 (SPIKE1-05), (5) **A 쓰기 path·rollback·nested tx·audit_log RLS 시나리오 추가** (SPIKE1-06·07), (6) **B 가설 정정** — idempotent at-least-once with exactly-once observable effects (SPIKE1-08), (7) **B failure injection 8 point + 외부 call count invariant** (SPIKE1-09·10), (8) **C TTL 상태 코드 정정** — 401 → 403 (provider semantics·SPIKE1-11), (9) **C security 시나리오 확장** — replay·method confusion·ListBucket·content-type·URL scrubbing (SPIKE1-12), (10) **REVIEW_WORKFLOW cascade** — `signed-url-issued`·`signed-url-revoked` AuditAction 2종 추가 (SPIKE1-13), (11) **fallback에 reversal blast radius 명시** (SPIKE1-14), (12) **Week 3~6 dependency graph** (SPIKE1-15), (13) **일정 7일 → 10일** (Week 1 + Week 2 Day 8~10·SPIKE1-16), (14) **성능 기준 correctness와 분리** (SPIKE1-17), (15) **A/B scope 명확화** — A는 transaction/RLS·B는 queue/crash (SPIKE1-18), (16) Spike F·G P1·후속 명시 |
docs\core\DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
docs\core\DATA_MODEL.md:818:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
docs\core\DATA_MODEL.md:974:| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
docs\core\DATA_MODEL.md:1102:| 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:3:> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 2·minor 2 (정정 완료)
docs\decisions\INFRA_DECISIONS_DRAFT.md:296:### 4.1 Phase 0 Spike Gate (INFRA2-09 → SPIKE2-01 cascade — 5 Spike/10일로 확장)
docs\decisions\INFRA_DECISIONS_DRAFT.md:306:| **E. Auth.js + resolveTenantContext + membership** | magic link·session·instanceMembership 검증·tampering 차단·active=false 즉시 403 | Day 7 local·Day 10 provider (Vercel preview·SPIKE2-02) | local + provider |
docs\decisions\INFRA_DECISIONS_DRAFT.md:310:### 4.2 Spike 결과별 Week 3~6 dependency (SPIKE2-05 partial state matrix)
docs\decisions\INFRA_DECISIONS_DRAFT.md:470:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정. 4 지적 정정 완료**: (1) P0 schema 목록 NotificationEvent → NotificationEventReceipt 정정 + NotificationEvent는 입력 타입임을 명시 (INFRA3-01), (2) audit_log read path tenant-scoped RLS 정책 분리 (INFRA3-02), (3) Storage 섹션 Cloudflare R2 채택 확정·Supabase Storage rejected alternative (INFRA3-03), (4) notifications.md 예시 drift는 8 Feature spec cascade 시 정정 (INFRA3-04 — 후속 minor cascade). **3 cycle 누계 36 지적 전건 수용**. SoT cascade 완료: REVIEW_WORKFLOW (NotificationEventType 6종 + AuditAction 17종 — service-role-invoked·instance-switched 추가), DATA_MODEL v0.23 (C-08 email transport/provider 분리) |
docs\features\asset-ingestion.md:184:// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
docs\features\asset-ingestion.md:194:- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
docs\features\asset-ingestion.md:195:- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
docs\features\asset-ingestion.md:196:- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장
docs\features\compliance-assistant.md:135:  findingsBySeverity: {
docs\features\compliance-assistant.md:142:  findings: Finding[];
docs\features\compliance-assistant.md:223:   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
docs\features\compliance-assistant.md:224:   - `buildBlocked` = findings 중 fail 1+ 존재
docs\features\compliance-assistant.md:225:   - `gateRequired` = findings 중 content-gate 1+ 존재
docs\features\compliance-assistant.md:226:   - `hasWarnings` = findings 중 warning 1+ 존재
docs\features\compliance-assistant.md:319:- 정적 룰 검수 결과 (findings[])
docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |

 succeeded in 614ms:
   1: // Spike B — withTenantTransaction (Spike A 패턴 동일·ScopedDb brand)
   2: 
   3: import { sql } from "drizzle-orm";
   4: import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
   5: import { dbTenant } from "./db.ts";
   6: import { TenantContextError } from "./errors.ts";
   7: 
   8: const SCOPED_BRAND: unique symbol = Symbol("scopedDb");
   9: export type ScopedDb = PostgresJsTransaction<Record<string, never>, Record<string, never>> & {
  10:   readonly [SCOPED_BRAND]: true;
  11: };
  12: 
  13: function asScopedDb(tx: PostgresJsTransaction<Record<string, never>, Record<string, never>>): ScopedDb {
  14:   Object.defineProperty(tx, SCOPED_BRAND, { value: true, enumerable: false, configurable: false });
  15:   return tx as ScopedDb;
  16: }
  17: 
  18: export async function withTenantTransaction<T>(
  19:   instanceId: string,
  20:   fn: (tx: ScopedDb) => Promise<T>,
  21: ): Promise<T> {
  22:   if (!isValidUuid(instanceId)) {
  23:     throw new TenantContextError(`invalid instanceId: ${instanceId}`);
  24:   }
  25:   return dbTenant.transaction(async (tx) => {
  26:     await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
  27:     await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
  28:     return fn(asScopedDb(tx));
  29:   });
  30: }
  31: 
  32: const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  33: export function isValidUuid(s: string): boolean {
  34:   return UUID_RE.test(s);
  35: }

 succeeded in 623ms:
   1: // Spike B — DB connection (Spike A 패턴 동일)
   2: 
   3: import postgres from "postgres";
   4: import { drizzle } from "drizzle-orm/postgres-js";
   5: 
   6: function requireEnv(key: string): string {
   7:   const v = process.env[key];
   8:   if (!v) throw new Error(`Missing env: ${key}`);
   9:   return v;
  10: }
  11: 
  12: const DEBUG = process.env.SPIKE_DB_DEBUG === "1";
  13: const commonOptions = {
  14:   prepare: false,
  15:   idle_timeout: 20,
  16:   connect_timeout: 10,
  17:   onnotice: () => {},
  18:   ...(DEBUG ? { debug: (_c: number, q: string) => console.log("[DB]", q.slice(0, 200)) } : {}),
  19: } as const;
  20: 
  21: // super-user (control-plane access·migration·outbox claim)
  22: export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 8, ...commonOptions });
  23: export const dbSuper = drizzle(sqlSuper);
  24: 
  25: // tenant (inbox·RLS 적용)
  26: export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
  27: export const dbTenant = drizzle(sqlTenant);
  28: 
  29: export async function closeAll(): Promise<void> {
  30:   await Promise.allSettled([sqlSuper.end(), sqlTenant.end()]);
  31: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content apps\\spike-b\\docker-compose.yml; Get-Content apps\\spike-b\\README.md" in C:\Users\assag\solution\website-exposure
 succeeded in 561ms:
services:
  postgres:
    image: postgres:16-alpine
    container_name: spike-b-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: spike_b
    ports:
      - "5434:5432"   # Spike A(5433)와 충돌 회피
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d spike_b"]
      interval: 1s
      timeout: 3s
      retries: 30
    command:
      - "postgres"
      - "-c"
      - "log_statement=none"
      - "-c"
      - "max_connections=200"
# Spike B — Worker control-plane queue + tenant-plane processing

> **상태**: prototype v0.1
> **상위 결정**: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike B
> **LOCAL ONLY**: 본 prototype의 secret은 docker-compose 전용

## 가설

worker가 control-plane connection으로 outbox SKIP LOCKED claim 후 instance_id 추출 → tenant transaction으로 처리. **idempotent at-least-once with exactly-once observable effects** — DB row insert + 외부 side effect 모두 `UNIQUE(instance_id, source_event_id)` idempotency key로 중복 차단. crash 시 reconcile로 결과 일관성 유지.

## 통과 기준

| 검증 | 기준 |
|---|---|
| 100 outbox·5 worker | completed=100·inbox=100·foreign=0·duplicate=0 |
| idempotency | 동일 sourceEventId 2회 enqueue → inbox 1·external success 1·duplicate 0 |
| failure injection 9 point | crash 후 stale reclaim 또는 recovery worker로 최종 invariant 정합 |
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
│   ├── 002_outbox.sql          # control-plane·SKIP LOCKED·partial unique active idempotency
│   ├── 003_inbox.sql           # tenant-plane·RLS WITH CHECK·UNIQUE(instanceId, sourceEventId)
│   ├── 004_external_call_log.sql  # fake provider call·UNIQUE success
│   └── 005_invariant_log.sql
├── src/
│   ├── db.ts·tenant.ts·errors.ts·fixtures.ts·schema 없음(raw SQL)
│   ├── outbox.ts                # enqueue·claimNextOutbox·markCompleted·markTransientFail·markFailedPermanent
│   ├── fake-provider.ts         # callFakeProvider (idempotent at-least-once)
│   ├── failure-injection.ts     # 9 point + InjectedFailureError
│   ├── worker.ts                # processOneJob + runConcurrentWorkers
│   ├── migrate.ts·seed.ts
│   └── scenarios/
│       ├── test-basic-100.ts·test-idempotency.ts·test-failure-injection.ts
│       ├── test-stale-reclaim.ts·test-retry-permanent.ts·test-no-cross-tenant.ts
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

codex
{
  "ready_for_acceptance": false,
  "status": "INCONCLUSIVE",
  "severity_counts": {
    "blocking": 3,
    "major": 7,
    "minor": 3
  },
  "findings": [
    {
      "id": "SPIKEB1-001",
      "severity": "blocking",
      "category": "failure-injection",
      "location": "apps/spike-b/src/scenarios/test-failure-injection.ts:14",
      "summary": "failure injection 9 point 검증이 실제로 9개 crash recovery를 검증하지 못한다.",
      "evidence": "before-claim은 worker.ts:57에서 try 밖에서 throw되어 scenario가 per-point recovery로 흡수하지 못한다. before-retry-schedule/after-retry-schedule은 providerConfig가 success라 TransientProviderError 경로에 진입하지 않아 injection이 발동하지 않는다. before-permanent-alert는 worker.ts:116에서 catch 내부 throw가 다시 밖으로 escape한다.",
      "impact": "Spike B § B.3의 핵심 acceptance인 failure injection recovery가 false positive 또는 즉시 abort로 왜곡된다.",
      "recommendation": "point별 expected precondition을 분리하라. retry point는 transient provider로, permanent point는 permanent provider로 강제하고, injected crash는 processOneJob 밖 harness에서 catch 후 stale recovery를 실행하게 하라."
    },
    {
      "id": "SPIKEB1-002",
      "severity": "blocking",
      "category": "exactly-once-observable-effects",
      "location": "apps/spike-b/src/worker.ts:71",
      "summary": "fake provider 호출이 tenant transaction 내부 코드 흐름에 있지만 별도 super connection으로 즉시 commit되어 실제 외부 side effect 모델과 어긋난다.",
      "evidence": "worker.ts:71-100의 tenant transaction 안에서 callFakeProvider를 호출하고, fake-provider.ts:44-95는 dbSuper로 external_call_log를 별도 transaction에 기록한다.",
      "impact": "tenant transaction abort, connection drop, DB shutdown 중 외부 HTTP 호출 성공/실패와 tenant commit의 조합을 제대로 검증하지 못한다. 특히 '외부 호출 성공 후 tenant commit 전 crash' 지점이 없다.",
      "recommendation": "provider call boundary를 tenant commit 전/후 중 하나로 명확히 모델링하고, `after-provider-success-before-tenant-commit` failure point를 추가하라. 실제 HTTP idempotency-key 계약은 DB UNIQUE와 별도 acceptance로 분리해야 한다."
    },
    {
      "id": "SPIKEB1-003",
      "severity": "blocking",
      "category": "idempotency",
      "location": "apps/spike-b/migrations/002_outbox.sql:27",
      "summary": "outbox idempotency가 active state에만 걸려 completed 후 동일 sourceEventId 재enqueue를 즉시 허용한다.",
      "evidence": "partial unique가 status IN ('pending','processing')만 포함한다. test-idempotency.ts:55-63은 completed 후 same sourceEventId enqueue 성공을 PASS로 본다.",
      "impact": "두 번째 outbox는 completed될 수 있지만 inbox/external success는 UNIQUE로 no-op이 되어 '새 작업 처리 완료'처럼 보이는 운영상 모순이 생긴다. notifications SoT의 receiptRetentionDays 기반 sourceEventId 재사용 차단과도 불일치한다.",
      "recommendation": "prototype 목적이 replay 허용인지 retention 기간 중 재사용 금지인지 결정하라. production 패턴은 `(instance_id, source_event_id)` receipt/ledger UNIQUE를 completed 포함 장기 보존으로 두는 쪽이 안전하다."
    },
    {
      "id": "SPIKEB1-004",
      "severity": "major",
      "category": "permanent-failure",
      "location": "apps/spike-b/src/worker.ts:115",
      "summary": "before/after permanent alert failure point가 실제 alert side effect를 모델링하지 않는다.",
      "evidence": "worker.ts:116-118은 markFailedPermanent 전후에 maybeFail만 있고 별도 alert sink/outbox row가 없다.",
      "impact": "Spike B 기준의 'permanent 전이 시 정확히 1회 sink alert'를 검증할 수 없다. after-permanent-alert crash가 DB state와 alert delivery 중 어느 쪽을 의미하는지도 불명확하다.",
      "recommendation": "permanent alert log/sink table을 추가하고 UNIQUE(outbox_id 또는 instance_id, source_event_id, alert_type)로 idempotency를 검증하라."
    },
    {
      "id": "SPIKEB1-005",
      "severity": "major",
      "category": "rls",
      "location": "apps/spike-b/src/scenarios/test-no-cross-tenant.ts:21",
      "summary": "no-cross-tenant 시나리오가 RLS WITH CHECK의 음성 경로를 직접 검증하지 않는다.",
      "evidence": "worker는 항상 row.instance_id로 withTenantTransaction을 열고 같은 instance_id를 inbox에 insert한다. mismatch insert 시도나 wrong tenant context 시도는 없다.",
      "impact": "RLS 정책이 깨져도 happy path foreign_count=0은 통과할 수 있다.",
      "recommendation": "instance A context에서 instance B inbox insert가 reject되는 테스트와, worker bug를 가정한 mismatched instance insert 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-006",
      "severity": "major",
      "category": "race-condition",
      "location": "apps/spike-b/src/fake-provider.ts:44",
      "summary": "external_call_log success race는 unique violation으로 처리하지만 실제 HTTP 중복 호출 race는 검증하지 못한다.",
      "evidence": "fake-provider는 SELECT existing 후 INSERT success를 한다. UNIQUE 충돌은 DB insert 시점에만 잡힌다.",
      "impact": "실제 provider에서는 두 worker가 동시에 HTTP 요청을 보낸 뒤 둘 다 provider side effect를 만들 수 있다. DB UNIQUE는 사후 기록 중복만 막는다.",
      "recommendation": "실제 모델은 provider idempotency-key 헤더가 권위여야 한다. fake provider도 'HTTP request attempted'와 'provider accepted side effect'를 분리해 동시 호출에서 accepted가 1건인지 검증하라."
    },
    {
      "id": "SPIKEB1-007",
      "severity": "major",
      "category": "scenario-coverage",
      "location": "apps/spike-b/src/scenarios/test-idempotency.ts:17",
      "summary": "동시 enqueue idempotency race 테스트가 없다.",
      "evidence": "test-idempotency는 e1, e2를 순차 await한다.",
      "impact": "partial unique index와 `ON CONFLICT DO NOTHING`의 동시성 경로가 acceptance에서 빠진다.",
      "recommendation": "동일 `(instanceId, sourceEventId)`를 Promise.all로 20~100개 동시 enqueue하고 enqueued=1, active outbox=1을 검증하라."
    },
    {
      "id": "SPIKEB1-008",
      "severity": "major",
      "category": "worker-lifecycle",
      "location": "apps/spike-b/src/worker.ts:158",
      "summary": "emptyConsecutiveStop 정책은 finite seed 테스트에는 충분하지만 동적 producer 환경에서는 새 작업 유입 전에 worker pool이 종료될 수 있다.",
      "evidence": "no-job이 N회 연속이면 worker loop가 break한다.",
      "impact": "prototype runner가 daemon worker/backpressure 모델을 검증하지 않는다.",
      "recommendation": "acceptance runner와 daemon worker를 분리하라. production worker는 poll interval, shutdown signal, rate limit, backpressure를 명시해야 한다."
    },
    {
      "id": "SPIKEB1-009",
      "severity": "major",
      "category": "failure-coverage",
      "location": "apps/spike-b/src/worker.ts:130",
      "summary": "tenant transaction abort와 connection drop/DB shutdown 시나리오가 없다.",
      "evidence": "unknown error는 markTransientFail로 처리되지만 이를 유발하는 scenario가 없다.",
      "impact": "RLS violation, tenant connection loss, DB restart 중 outbox가 pending/exhausted로 정상 전이되는지 acceptance에서 보장되지 않는다.",
      "recommendation": "RLS violation을 의도적으로 발생시키는 worker variant, tenant tx 중 connection terminate, provider timeout Error를 각각 transient로 재시도하는 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-010",
      "severity": "major",
      "category": "invariant-runner",
      "location": "apps/spike-b/src/scenarios/test-invariant-runner.ts:20",
      "summary": "invariant runner는 run마다 outbox/inbox/external_call_log를 truncate해서 누적 idempotency/retention invariant를 보지 못한다.",
      "evidence": "singleRun 시작 시 TRUNCATE outbox, inbox, external_call_log를 실행한다.",
      "impact": "5 runs는 부하 반복일 뿐 장기 ledger 누적, sourceEventId 재사용, retention 정책 영향을 검증하지 않는다.",
      "recommendation": "run isolation 목적이면 OK로 명시하되, 별도 누적 runner에서 invariant_log와 idempotency ledger를 유지한 채 중복 sourceEventId를 섞어 검증하라."
    },
    {
      "id": "SPIKEB1-011",
      "severity": "minor",
      "category": "migration",
      "location": "apps/spike-b/migrations/003_inbox.sql:26",
      "summary": "RLS policy는 대체로 적절하지만 current_setting cast 실패/미설정 경로에 대한 음성 테스트가 없다.",
      "evidence": "policy가 current_setting('app.current_instance_id', true)::uuid에 의존한다.",
      "impact": "malformed app.current_instance_id가 query fail인지 deny인지 acceptance에서 확인되지 않는다.",
      "recommendation": "Spike A처럼 malformed UUID 및 context 미설정 직접 query 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-012",
      "severity": "minor",
      "category": "code-quality",
      "location": "apps/spike-b/src/worker.ts:68",
      "summary": "providerOutcome, tenantSucceeded 변수가 쓰이지 않는다.",
      "evidence": "worker.ts:68-69에서 선언/할당되지만 이후 판단에 사용되지 않는다.",
      "impact": "strict 설정 자체는 noUnusedLocals를 켜지 않아 통과할 수 있지만, crash state 판단을 넣으려다 남은 흔적으로 읽힌다.",
      "recommendation": "불필요하면 제거하고, 필요하면 recovery invariant 판단에 실제로 사용하라."
    },
    {
      "id": "SPIKEB1-013",
      "severity": "minor",
      "category": "documentation",
      "location": "apps/spike-b/src/failure-injection.ts:1",
      "summary": "failure-injection 주석은 8 point라고 쓰지만 타입은 9 point다.",
      "evidence": "FailurePoint union에는 after-claim이 포함되어 총 9개다.",
      "impact": "Spike 계획 v1.0과 README의 9 point 기준과 혼동된다.",
      "recommendation": "주석과 scenario log를 9 point로 정정하라."
    }
  ],
  "positive_observations": [
    "001_roles.sql의 pgcrypto, NOBYPASSRLS, schema USAGE는 local prototype 목적에는 정합하다.",
    "claimNextOutbox의 stale reclaim과 SKIP LOCKED claim은 한 sqlSuper.begin transaction 안에서 실행되어 claim 자체의 원자성은 적절하다.",
    "markTransientFail은 attempts++가 claim 시점에 선반영된다는 전제에서는 maxAttempts=3의 세 번째 실패를 exhausted로 전이한다.",
    "inbox UNIQUE와 external_call_log success partial UNIQUE는 DB observable duplicate 방지 장치로는 유효하다."
  ],
  "verification": {
    "typecheck": {
      "command": "pnpm --dir apps/spike-b typecheck",
      "result": "not_run_successfully",
      "reason": "node_modules missing; tsc not found"
    },
    "tests_run": [],
    "notes": "리뷰는 정적 분석 기준이다. 시나리오 실행은 의존성 미설치로 수행하지 못했다."
  },
  "production_gaps": [
    "fake-provider DB UNIQUE는 실제 HTTP provider idempotency-key 헤더의 대체물이 아니다.",
    "pgbouncer transaction pooling 환경은 본 Spike B direct postgres connection으로 검증되지 않는다.",
    "worker pool size, provider rate limit, timeout, backpressure, graceful shutdown 정책이 prototype acceptance 밖에 있다.",
    "permanent alert sink와 retry/exhausted 운영 알림의 exactly-once observable effect가 아직 물리 schema로 검증되지 않는다."
  ]
}
tokens used
102,266
{
  "ready_for_acceptance": false,
  "status": "INCONCLUSIVE",
  "severity_counts": {
    "blocking": 3,
    "major": 7,
    "minor": 3
  },
  "findings": [
    {
      "id": "SPIKEB1-001",
      "severity": "blocking",
      "category": "failure-injection",
      "location": "apps/spike-b/src/scenarios/test-failure-injection.ts:14",
      "summary": "failure injection 9 point 검증이 실제로 9개 crash recovery를 검증하지 못한다.",
      "evidence": "before-claim은 worker.ts:57에서 try 밖에서 throw되어 scenario가 per-point recovery로 흡수하지 못한다. before-retry-schedule/after-retry-schedule은 providerConfig가 success라 TransientProviderError 경로에 진입하지 않아 injection이 발동하지 않는다. before-permanent-alert는 worker.ts:116에서 catch 내부 throw가 다시 밖으로 escape한다.",
      "impact": "Spike B § B.3의 핵심 acceptance인 failure injection recovery가 false positive 또는 즉시 abort로 왜곡된다.",
      "recommendation": "point별 expected precondition을 분리하라. retry point는 transient provider로, permanent point는 permanent provider로 강제하고, injected crash는 processOneJob 밖 harness에서 catch 후 stale recovery를 실행하게 하라."
    },
    {
      "id": "SPIKEB1-002",
      "severity": "blocking",
      "category": "exactly-once-observable-effects",
      "location": "apps/spike-b/src/worker.ts:71",
      "summary": "fake provider 호출이 tenant transaction 내부 코드 흐름에 있지만 별도 super connection으로 즉시 commit되어 실제 외부 side effect 모델과 어긋난다.",
      "evidence": "worker.ts:71-100의 tenant transaction 안에서 callFakeProvider를 호출하고, fake-provider.ts:44-95는 dbSuper로 external_call_log를 별도 transaction에 기록한다.",
      "impact": "tenant transaction abort, connection drop, DB shutdown 중 외부 HTTP 호출 성공/실패와 tenant commit의 조합을 제대로 검증하지 못한다. 특히 '외부 호출 성공 후 tenant commit 전 crash' 지점이 없다.",
      "recommendation": "provider call boundary를 tenant commit 전/후 중 하나로 명확히 모델링하고, `after-provider-success-before-tenant-commit` failure point를 추가하라. 실제 HTTP idempotency-key 계약은 DB UNIQUE와 별도 acceptance로 분리해야 한다."
    },
    {
      "id": "SPIKEB1-003",
      "severity": "blocking",
      "category": "idempotency",
      "location": "apps/spike-b/migrations/002_outbox.sql:27",
      "summary": "outbox idempotency가 active state에만 걸려 completed 후 동일 sourceEventId 재enqueue를 즉시 허용한다.",
      "evidence": "partial unique가 status IN ('pending','processing')만 포함한다. test-idempotency.ts:55-63은 completed 후 same sourceEventId enqueue 성공을 PASS로 본다.",
      "impact": "두 번째 outbox는 completed될 수 있지만 inbox/external success는 UNIQUE로 no-op이 되어 '새 작업 처리 완료'처럼 보이는 운영상 모순이 생긴다. notifications SoT의 receiptRetentionDays 기반 sourceEventId 재사용 차단과도 불일치한다.",
      "recommendation": "prototype 목적이 replay 허용인지 retention 기간 중 재사용 금지인지 결정하라. production 패턴은 `(instance_id, source_event_id)` receipt/ledger UNIQUE를 completed 포함 장기 보존으로 두는 쪽이 안전하다."
    },
    {
      "id": "SPIKEB1-004",
      "severity": "major",
      "category": "permanent-failure",
      "location": "apps/spike-b/src/worker.ts:115",
      "summary": "before/after permanent alert failure point가 실제 alert side effect를 모델링하지 않는다.",
      "evidence": "worker.ts:116-118은 markFailedPermanent 전후에 maybeFail만 있고 별도 alert sink/outbox row가 없다.",
      "impact": "Spike B 기준의 'permanent 전이 시 정확히 1회 sink alert'를 검증할 수 없다. after-permanent-alert crash가 DB state와 alert delivery 중 어느 쪽을 의미하는지도 불명확하다.",
      "recommendation": "permanent alert log/sink table을 추가하고 UNIQUE(outbox_id 또는 instance_id, source_event_id, alert_type)로 idempotency를 검증하라."
    },
    {
      "id": "SPIKEB1-005",
      "severity": "major",
      "category": "rls",
      "location": "apps/spike-b/src/scenarios/test-no-cross-tenant.ts:21",
      "summary": "no-cross-tenant 시나리오가 RLS WITH CHECK의 음성 경로를 직접 검증하지 않는다.",
      "evidence": "worker는 항상 row.instance_id로 withTenantTransaction을 열고 같은 instance_id를 inbox에 insert한다. mismatch insert 시도나 wrong tenant context 시도는 없다.",
      "impact": "RLS 정책이 깨져도 happy path foreign_count=0은 통과할 수 있다.",
      "recommendation": "instance A context에서 instance B inbox insert가 reject되는 테스트와, worker bug를 가정한 mismatched instance insert 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-006",
      "severity": "major",
      "category": "race-condition",
      "location": "apps/spike-b/src/fake-provider.ts:44",
      "summary": "external_call_log success race는 unique violation으로 처리하지만 실제 HTTP 중복 호출 race는 검증하지 못한다.",
      "evidence": "fake-provider는 SELECT existing 후 INSERT success를 한다. UNIQUE 충돌은 DB insert 시점에만 잡힌다.",
      "impact": "실제 provider에서는 두 worker가 동시에 HTTP 요청을 보낸 뒤 둘 다 provider side effect를 만들 수 있다. DB UNIQUE는 사후 기록 중복만 막는다.",
      "recommendation": "실제 모델은 provider idempotency-key 헤더가 권위여야 한다. fake provider도 'HTTP request attempted'와 'provider accepted side effect'를 분리해 동시 호출에서 accepted가 1건인지 검증하라."
    },
    {
      "id": "SPIKEB1-007",
      "severity": "major",
      "category": "scenario-coverage",
      "location": "apps/spike-b/src/scenarios/test-idempotency.ts:17",
      "summary": "동시 enqueue idempotency race 테스트가 없다.",
      "evidence": "test-idempotency는 e1, e2를 순차 await한다.",
      "impact": "partial unique index와 `ON CONFLICT DO NOTHING`의 동시성 경로가 acceptance에서 빠진다.",
      "recommendation": "동일 `(instanceId, sourceEventId)`를 Promise.all로 20~100개 동시 enqueue하고 enqueued=1, active outbox=1을 검증하라."
    },
    {
      "id": "SPIKEB1-008",
      "severity": "major",
      "category": "worker-lifecycle",
      "location": "apps/spike-b/src/worker.ts:158",
      "summary": "emptyConsecutiveStop 정책은 finite seed 테스트에는 충분하지만 동적 producer 환경에서는 새 작업 유입 전에 worker pool이 종료될 수 있다.",
      "evidence": "no-job이 N회 연속이면 worker loop가 break한다.",
      "impact": "prototype runner가 daemon worker/backpressure 모델을 검증하지 않는다.",
      "recommendation": "acceptance runner와 daemon worker를 분리하라. production worker는 poll interval, shutdown signal, rate limit, backpressure를 명시해야 한다."
    },
    {
      "id": "SPIKEB1-009",
      "severity": "major",
      "category": "failure-coverage",
      "location": "apps/spike-b/src/worker.ts:130",
      "summary": "tenant transaction abort와 connection drop/DB shutdown 시나리오가 없다.",
      "evidence": "unknown error는 markTransientFail로 처리되지만 이를 유발하는 scenario가 없다.",
      "impact": "RLS violation, tenant connection loss, DB restart 중 outbox가 pending/exhausted로 정상 전이되는지 acceptance에서 보장되지 않는다.",
      "recommendation": "RLS violation을 의도적으로 발생시키는 worker variant, tenant tx 중 connection terminate, provider timeout Error를 각각 transient로 재시도하는 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-010",
      "severity": "major",
      "category": "invariant-runner",
      "location": "apps/spike-b/src/scenarios/test-invariant-runner.ts:20",
      "summary": "invariant runner는 run마다 outbox/inbox/external_call_log를 truncate해서 누적 idempotency/retention invariant를 보지 못한다.",
      "evidence": "singleRun 시작 시 TRUNCATE outbox, inbox, external_call_log를 실행한다.",
      "impact": "5 runs는 부하 반복일 뿐 장기 ledger 누적, sourceEventId 재사용, retention 정책 영향을 검증하지 않는다.",
      "recommendation": "run isolation 목적이면 OK로 명시하되, 별도 누적 runner에서 invariant_log와 idempotency ledger를 유지한 채 중복 sourceEventId를 섞어 검증하라."
    },
    {
      "id": "SPIKEB1-011",
      "severity": "minor",
      "category": "migration",
      "location": "apps/spike-b/migrations/003_inbox.sql:26",
      "summary": "RLS policy는 대체로 적절하지만 current_setting cast 실패/미설정 경로에 대한 음성 테스트가 없다.",
      "evidence": "policy가 current_setting('app.current_instance_id', true)::uuid에 의존한다.",
      "impact": "malformed app.current_instance_id가 query fail인지 deny인지 acceptance에서 확인되지 않는다.",
      "recommendation": "Spike A처럼 malformed UUID 및 context 미설정 직접 query 테스트를 추가하라."
    },
    {
      "id": "SPIKEB1-012",
      "severity": "minor",
      "category": "code-quality",
      "location": "apps/spike-b/src/worker.ts:68",
      "summary": "providerOutcome, tenantSucceeded 변수가 쓰이지 않는다.",
      "evidence": "worker.ts:68-69에서 선언/할당되지만 이후 판단에 사용되지 않는다.",
      "impact": "strict 설정 자체는 noUnusedLocals를 켜지 않아 통과할 수 있지만, crash state 판단을 넣으려다 남은 흔적으로 읽힌다.",
      "recommendation": "불필요하면 제거하고, 필요하면 recovery invariant 판단에 실제로 사용하라."
    },
    {
      "id": "SPIKEB1-013",
      "severity": "minor",
      "category": "documentation",
      "location": "apps/spike-b/src/failure-injection.ts:1",
      "summary": "failure-injection 주석은 8 point라고 쓰지만 타입은 9 point다.",
      "evidence": "FailurePoint union에는 after-claim이 포함되어 총 9개다.",
      "impact": "Spike 계획 v1.0과 README의 9 point 기준과 혼동된다.",
      "recommendation": "주석과 scenario log를 9 point로 정정하라."
    }
  ],
  "positive_observations": [
    "001_roles.sql의 pgcrypto, NOBYPASSRLS, schema USAGE는 local prototype 목적에는 정합하다.",
    "claimNextOutbox의 stale reclaim과 SKIP LOCKED claim은 한 sqlSuper.begin transaction 안에서 실행되어 claim 자체의 원자성은 적절하다.",
    "markTransientFail은 attempts++가 claim 시점에 선반영된다는 전제에서는 maxAttempts=3의 세 번째 실패를 exhausted로 전이한다.",
    "inbox UNIQUE와 external_call_log success partial UNIQUE는 DB observable duplicate 방지 장치로는 유효하다."
  ],
  "verification": {
    "typecheck": {
      "command": "pnpm --dir apps/spike-b typecheck",
      "result": "not_run_successfully",
      "reason": "node_modules missing; tsc not found"
    },
    "tests_run": [],
    "notes": "리뷰는 정적 분석 기준이다. 시나리오 실행은 의존성 미설치로 수행하지 못했다."
  },
  "production_gaps": [
    "fake-provider DB UNIQUE는 실제 HTTP provider idempotency-key 헤더의 대체물이 아니다.",
    "pgbouncer transaction pooling 환경은 본 Spike B direct postgres connection으로 검증되지 않는다.",
    "worker pool size, provider rate limit, timeout, backpressure, graceful shutdown 정책이 prototype acceptance 밖에 있다.",
    "permanent alert sink와 retry/exhausted 운영 알림의 exactly-once observable effect가 아직 물리 schema로 검증되지 않는다."
  ]
}
