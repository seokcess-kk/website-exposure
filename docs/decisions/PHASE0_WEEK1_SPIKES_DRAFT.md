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

> R2 (S3 호환) object key prefix isolation·server-only signed URL issuer·IAM PolicyDocument로 instance 격리. method confusion·ListBucket·content-type/length 우회 차단. TTL·refresh 정상 동작. **signed URL은 TTL-bound bearer semantics** — pre-expiry replay 허용 (provider 표준)·만료 후 거부·revocation 불가 (one-time token이 필요하면 별도 worker proxy 설계 — Phase 1+).

### C.2-local: minio signing logic 검증 (Day 5)

```
apps/spike-c-local/
├── docker-compose.yml              # minio
└── src/sign-url.ts·test-isolation.ts·test-replay.ts·test-method-confusion.ts
```

시나리오:
1. 2 instance × 5 object upload
2. **prefix isolation·malformed·path traversal·non-canonical UUID**: instance-a로 instance-b prefix sign 시도·`instances/A/../B/...`·hyphen 36자 string 등 → tenant-check fail
3. **TTL-bound bearer semantics 실측**: TTL 만료 전 replay 100회 → 모두 success (bearer semantics)·TTL 만료 후 → 401/403·refresh helper로 새 URL 발급
4. **method confusion**: GET signed URL로 PUT/DELETE 시도 → 401/403 (XML body code assert)·PUT URL로 GET 시도 → 401/403. **HEAD↔GET 처리는 empirical-provider-behavior에 의존**: AWS SigV4 canonical request에는 HTTPMethod가 포함되어 엄밀히 method-bound이지만, 실 provider (S3·minio) 일부는 HEAD를 GET signed URL에 대해 허용하기도 함. [Cloudflare R2 presigned URL docs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)는 GET/PUT/HEAD/DELETE를 별도 operation으로 명시 (각 operation을 명시 발급해야 함). [AWS SigV4 canonical request spec](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html)은 HTTPMethod를 canonical에 포함. 본 spike는 case-5를 informational only로 두고, **실 정책은 C-provider gate에서 R2 동작 실측 후 결정**·provider 결과에 따라 application-layer에서 HEAD를 별도 발급하는지 또는 GET URL과 공유 허용할지 SoT cascade.
5. **content-type/length 불일치**: PUT presign 시 content-type/length signed header 포함 — 불일치 PUT 시도 → 400/403 (XML body code assert). **LOCAL 한계 marker** — minio·R2 동작 차이 존재 시 C-provider 가중치
6. **ListBucket — LOCAL_SMOKE + PROVIDER_GATE**: minio root credential은 ListBucket 전체 가능 → application-layer prefix filter helper로 own/cross 검증 + minio per-instance user policy (StringLike s3:prefix Condition)로 credential-level smoke (own 200·cross/empty/root/partial 403 — 5 case). **R2 IAM Condition 동등성·STS·credential rotation은 C-provider gate 필수**
7. **range request**: 허용 여부 결정 (decision: 허용 — large object streaming)·out-of-range 응답 명시 assert (minio: 416)
8. **URL log scrubbing**: audit log에 signed URL signature·credential·encoded credential 저장 금지. 모든 string field·1~2회 URL decode·다양한 credential pattern (`signature=·credential=·access_token·bearer·cookie·cf-`) scan

### C.3-local 통과 기준

| 검증 | 기준 (correctness) | local 검증 |
|---|---|---|
| prefix isolation (application layer) | cross-instance 100% block — TenantPrefixMismatchError만 인정·다른 에러 PASS 카운트 제외. segment parser: control char·encoded slash/null·query/fragment/backslash·`.`·`..`·empty/double/leading/trailing slash·non-canonical UUID 모두 거부 (negative table 22 case) | LOCAL_FULL |
| method confusion (GET·PUT·DELETE 직교) | GET URL로 PUT/DELETE → 401/403 (awsCode assert)·PUT URL로 GET → 401/403. **HEAD↔GET interop은 empirical-provider-behavior — informational only·실 정책은 PROVIDER_GATE에서 R2 동작 실측 후 SoT cascade** | LOCAL_FULL (HEAD informational) |
| content-type 불일치 (presign vs request) | provider awsCode in {SignatureDoesNotMatch·InvalidRequest·BadRequest 등}·status 400/403. **minio 실측만 — R2 동등성 PROVIDER_GATE에서 검증** | LOCAL_SMOKE + PROVIDER_GATE |
| content-length 불일치 | node fetch가 자동 재계산하므로 정확한 mismatch 주입 제한적 → LOCAL_CLIENT_BLOCKED marker·**raw HTTP는 PROVIDER_GATE에서 검증** | LOCAL_CLIENT_BLOCKED |
| ListBucket credential-level | minio per-instance user policy (StringLike s3:prefix Condition) — own prefix 200·cross prefix 403·empty/root/partial prefix 403 (5 case). **R2 IAM Condition 동등성 PROVIDER_GATE에서 검증** | LOCAL_SMOKE + PROVIDER_GATE |
| range out-of-range | 416 명시 assert·overlap-end는 206 partial | LOCAL_FULL |
| URL audit log | 모든 string field (9개)·1~2 URL decode·14 forbidden pattern (AWS Sig·credential·cookie·CF token). positive issuance 5 + negative leak 11 case | LOCAL_FULL |
| TTL·refresh policy | default TTL 600s·refresh 60s before·max TTL 86400 (SoT INFRA v1.0 § Storage). RefreshPolicy: graceMs·requireRefreshAtReached. 만료 후 refresh reject (`expired`)·premature refresh reject (`premature`) | LOCAL_FULL |
| invariant runner | self-success === audit.success·cross TenantPrefixMismatchError만 deny 카운트·unexpectedError 즉시 fail·prefix start matches·leak scan 0 | LOCAL_FULL |

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

> Drizzle Kit으로 RLS policy·custom role·partial unique index·CHECK constraint·composite FK·custom SQL migration 모두 생성·deploy 가능. dev→staging apply·shadow DB drift check·service_role migration runner audit 작동. **rollback 정책**: forward-only (no down migration) — partial failure는 per-file transaction rollback·destructive 변경은 forward-only hotfix + super-admin token 명시 승인 + ADR 필수. 운영 무중단 롤백 필요 시 expand/contract 3-phase로 처리·즉시 rollback이 필요하면 emergency forward-only hotfix.

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
| RLS·CHECK·partial unique·composite FK migration 생성 | Drizzle Kit canonical 또는 raw SQL escape hatch 사용. **canonical drift 0 (drizzle-kit generate 결과 ↔ raw SQL snapshot diff 0)는 PROVIDER_GATE — Day 8 staging에서 검증**. LOCAL은 (a) drizzle-kit generate 결과의 11 canonical regex pattern·(b) 5 raw mixin file existence·(c) schema.ts table/column 명시 일치만 검증 (full byte-equal은 PROVIDER_GATE) |
| dev/staging apply | 100% 성공·dev↔staging full snapshot diff 0 |
| drift check (definition-aware) | column·constraint def·index def·policy qual/with_check/roles·view def + reloptions·enum labels 모두 비교·production과 다른 schema 100% detect |
| advisory lock | 동시 migration 시 1개만 진행 (concurrent race 검증) |
| deploy coordinator lock | 동시 deploy 1개만 진행 (별도 lock key namespace·shadow scope 보유) |
| empty target deploy | targetCurrent=0인 경우 pre-drift skip·full apply + post-drift. **leftover guard scope** (11-class user-visible public objects): table·view·foreign_table·sequence·enum_or_composite_type·domain·range_type·function·policy·trigger·collation. **drift snapshot scope**: 현재 definition-aware schema feature scope (table·constraint·index·policy·view+reloptions·enum)에 한정 — empty guard와 drift snapshot은 의도적으로 다른 scope (empty guard는 partial poison 회피 위해 더 광범위, drift snapshot은 feature spec과 직접 연관된 schema 객체만). **본 spike scope 외** (PROVIDER_GATE — Day 8 staging에서 추가 검증·실 production schema에서 사용 시 별도 추가 검사): pg_operator·pg_opclass·pg_opfamily·pg_conversion·text search objects (pg_ts_config·pg_ts_dict·pg_ts_parser·pg_ts_template). |
| pending migration deploy (N-1 → N) | shadow를 target current까지 stage → drift 0 → 나머지 apply → target migrate → post-drift |
| migration audit | 모든 migration `service-role-invoked` insert 1건·per-file transaction atomic |
| expand/contract 3단계 | 운영 무중단 (web/worker 다른 deploy timing)·phase별 stopAfter + app_tenant_user RLS path 검증 |
| forward-only hotfix | super-admin token + ADR + isForwardOnly marker·source migrations 불변 |
| dedicated migration runner role | **PROVIDER_GATE — Day 8 staging**. LOCAL은 application-layer service_role guard·production은 별도 PG role + SET ROLE migration_runner·current_user audit |
| partial failure rollback | broken migration → table·ledger·audit 모두 rollback·fix 후 재시도 성공 |
| shadow reset | schema-wide DROP SCHEMA + CREATE SCHEMA (object 목록 hardcoded 금지) |

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

| 검증 | 기준 | LOCAL 검증 |
|---|---|---|
| Authorized request | 100% 통과 + RLS set·current_setting('app.current_instance_id')==ctx.instanceId·tenant_data row 정확히 boundary | LOCAL_FULL |
| Unauthorized request (non-member) | 100% 403·membership-not-found audit | LOCAL_FULL |
| client tampering (signature/opaque/empty/random/revoked) | 100% server-side reject | LOCAL_FULL |
| membership 제거 후 next request | 즉시 403·deactivated_at·deactivated_by_user_id 강제 (CHECK constraint) | LOCAL_FULL |
| inactive user | 100% 403·inactive-user-rejected audit | LOCAL_FULL |
| instance-switched audit | switchSuperAdminInstance API atomic·전환 1회 = audit +1 invariant | LOCAL_FULL |
| legal/physician/client reviewer eligibility | 4-role + 4-eligibility flag·action enum 15종 exhaustive | LOCAL_FULL |
| UUID validation | strict v4 + RFC variant·malformed/SQL injection 시 audit-then-reject | LOCAL_FULL |
| magic-link CAS | atomic UPDATE expires>now() AND consumedAt IS NULL | LOCAL_FULL |
| Auth.js DrizzleAdapter schema | "session"·"verificationToken" 표준 column shape·composite PK·FK | LOCAL_SMOKE |
| Auth.js DrizzleAdapter 실 호출 (createSession·createVerificationToken·useVerificationToken·getSessionAndUser) | **PROVIDER_GATE** (Day 10 Vercel preview·next-auth + @auth/drizzle-adapter 실 import + magic link callback round-trip) | PROVIDER_REQUIRED |
| Vercel preview secure cookie · SameSite · CSRF | **PROVIDER_GATE** | PROVIDER_REQUIRED |

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
