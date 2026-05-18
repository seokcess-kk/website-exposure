# Spike D local prototype 코드 — codex 자동 비평 cycle 1

당신은 신중하고 적대적인 senior reviewer다. 본 prompt 안의 모든 코드와 SoT 명세를 직접 읽고, **acceptance를 막을 수 있는 모든 수준의 결함**을 찾아라. 칭찬·요약·동의는 무가치하다. 결함·반례·구체 패치 제안이 유일한 가치다.

## 범위·SoT

- 본 spike SoT: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike D (§ D.1~D.5)
- 인프라 SoT: `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Drizzle ORM + postgres + RLS + service_role + advisory lock 패턴)
- Spike A 패턴: `apps/spike-a/` migrate.ts·service-role·audit_log (재사용 base)
- 관련 Feature: 모든 8 Feature가 DB schema 패턴 의존 — content-migration·notifications·analytics-reporting 등

## Spike D 가설 (SoT 인용)

> Drizzle Kit으로 RLS policy·custom role·partial unique index·CHECK constraint·composite FK·custom SQL migration 모두 생성·deploy 가능. dev→staging apply·rollback·shadow DB drift check·service_role migration runner audit 작동.

## D.3 통과 기준 (SoT 인용)

| 검증 | 기준 |
|---|---|
| RLS·CHECK·partial unique·composite FK migration 생성 | Drizzle Kit canonical 또는 raw SQL escape hatch |
| dev/staging apply | 100% 성공 |
| drift check | production과 다른 schema 100% detect |
| advisory lock | 동시 migration 시 1개만 진행 |
| migration audit | 모든 migration `service-role-invoked` insert 1건 |
| expand/contract 3단계 | 운영 무중단 |

## v0.1 prototype 산출물

```
apps/spike-d/
├── docker-compose.yml + docker/init-multi-db.sh (4 DB: dev·staging·shadow·prod·single postgres instance)
├── .env.example (DATABASE_URL_{DEV,STAGING,SHADOW,PROD} + advisory lock key + super-admin token)
├── package.json (@glitzy/spike-d, drizzle-orm·drizzle-kit·postgres·tsx·typescript)
├── tsconfig.json (exclude src/scenarios) + tsconfig.scenarios.json
├── drizzle.config.ts
├── migrations/
│   ├── 001_roles_and_extensions.sql (pgcrypto + app_tenant_user NOBYPASSRLS + migration_runner)
│   ├── 002_content_test.sql (UUID PK·composite FK·CHECK regex·RLS NULLIF wrapping)
│   ├── 003_instance_user_partial_unique.sql (UNIQUE INDEX WHERE active=true)
│   ├── 004_audit_log.sql (append-only·RLS read/write policies·GRANT 명시)
│   ├── 005_migration_ledger.sql (id·checksum·service_role_function·target_db)
│   ├── 006_audit_event.sql (service-role-invoked event)
│   ├── 007_tenant_audit_log_view.sql (security_invoker=on view)
│   ├── 008_expand_add_nullable.sql (ADD COLUMN published_at)
│   ├── 009_backfill_published_at.sql (UPDATE backfill)
│   └── 010_contract_check_constraint.sql (CHECK published_at NOT NULL for published)
├── src/
│   ├── env.ts (required·DbTarget·getDatabaseUrl)
│   ├── errors.ts (MigrationChecksumMismatch·AdvisoryLockNotAcquired·SchemaDrift·ForwardOnlyHotfixRejected·ServiceRoleGuard·MigrationAudit)
│   ├── service-role.ts (assertServiceRoleAllowed·assertForwardOnlyHotfixApproved·emitServiceRoleAuditEvent)
│   ├── db/schema.ts (Drizzle pgTable·pgEnum·uniqueIndex.where·foreignKey·check)
│   ├── db/client.ts (postgres·drizzle factory)
│   ├── migrate.ts (loadMigrations + tryAcquireAdvisoryLock + ensureLedger + per-file transaction + audit emit + forward-only detect)
│   ├── drift-check.ts (snapshotSchema: information_schema·pg_indexes·pg_policies + diffSnapshots + checkDriftAgainstShadow)
│   └── scenarios/
│       ├── test-canonical-generation.ts (17 패턴 — canonical vs raw-mixin marker)
│       ├── test-dev-apply.ts (apply + idempotent)
│       ├── test-staging-apply.ts (dev/staging snapshot equality count)
│       ├── test-drift-check.ts (5 cases: column·column-revert·index·policy)
│       ├── test-advisory-lock.ts (4 cases: holder reject·release·post-release apply)
│       ├── test-forward-only-hotfix.ts (4 cases: no token·wrong·correct·column-dropped)
│       ├── test-audit.ts (4 cases: count·function·payload·ledger 정합)
│       └── test-expand-contract.ts (6 cases: column exists·partial index·draft insert·published with/without time·archived·update transitions)
```

## 검토 관점 (지적할 차원의 예)

### 1. SoT 정합성·검증 완전성
- D.2 시나리오 8개가 모두 검증되는가? (canonical generation·dev/staging apply·drift check·advisory lock·forward-only·audit·expand/contract — 8 시나리오)
- D.3 통과 기준 6항을 코드가 자동으로 보장하는가?
- Drizzle Kit canonical vs raw SQL mixin 분리 명시되어 있는가? (canonical 미지원 영역: RLS·view·security_invoker·custom role — 명시 marker)

### 2. migrate.ts 정확성·robustness
- `tryAcquireAdvisoryLock`: postgres-js의 connection이 pooled되면 `pg_try_advisory_lock`이 session-scoped이라 동작 보장 안 됨. max=1로 강제했지만 connection reuse·release timing 검증?
- `ensureLedger`: bootstrap 시 005 migration이 적용 전이라도 `CREATE TABLE IF NOT EXISTS migration_ledger`가 schema와 일치하는가? 005가 적용되면 두 번 CREATE 시도되는데 IF NOT EXISTS로 무해하지만 검증 정확?
- `runMigrate`: per-file transaction 내에서 `tx.unsafe(file.content)`로 multi-statement 실행. 그러나 `CREATE TYPE`·`CREATE TABLE`·`ALTER TABLE` 등은 transactional이지만 일부 `CREATE INDEX CONCURRENTLY` 같은 명령은 transaction 안에서 불가. 본 spike는 그런 명령이 있는가? (예: 003 partial unique index는 단순 CREATE — OK)
- `emitServiceRoleAuditEvent`: audit_event 생성 전 migration에서 silent 처리 — 001~005까지 5건 audit 손실. 통과 기준 "모든 migration 1건씩 insert"와 충돌? bootstrap-mode로 audit_event 이후 시점만 OR migration_ledger를 audit 대체로 사용?
- `runMigrate`의 outer try-finally: advisory lock 획득 실패 시 finally의 releaseAdvisoryLock 호출 — 잡지 못한 lock도 해제 시도 (no-op이지만 race condition은?). 또한 sql connection 4번 (4 DB)을 별도로 매번 생성 — `runMigrate`는 단일 DB 대상이라 connection 1개. OK.
- forward-only token: env에 hardcoded·실제 production은 별도 secret store·token 회전 정책 부재. spike OK?
- 시나리오에서 `099_forward_only_drop_legacy_column.sql`를 동적으로 생성·삭제. migrate.ts의 `loadMigrations`는 파일 시스템 readdir — 동시 다른 시나리오 실행 시 race? scenario:all는 sequential이므로 안전.

### 3. drift-check.ts 정확성
- `snapshotSchema`: information_schema·pg_indexes·pg_policies 기반. 그러나 누락 차원: GRANT/REVOKE·ENUM types·FUNCTION/PROCEDURE·VIEW definition·CHECK constraint detail·foreign key target/cascade·SEQUENCE·TRIGGER. 본 spike의 acceptance가 column·constraint name·index·policy만으로 충분한가?
- `diffSnapshots`: set 비교·column type만 비교. CHECK constraint의 `definition` (예: regex)이 같은지 비교 안 함 — `slug ~ '^[a-z0-9]'` vs `slug ~ '^[a-z]'`도 동일 constraint name이면 동일로 판정. 명시 marker 필요?
- `checkDriftAgainstShadow(target)`: shadow를 베이스로 비교 — but shadow가 stale (apply 안 됨)이면 false negative? 시나리오에서 매번 resetAndApply 하지만 prod 환경에서는?
- production schema diff tool과의 일치도: Drizzle Kit `drizzle-kit check`·sqitch·atlas와 비교 — 본 spike는 정량적 detect만·schema migration tool과의 비교 부재
- `Promise.all([snapshotSchema(target), snapshotSchema(shadow)])`: 두 connection 동시 — postgres pool과 충돌 가능 (각 호출이 connection 1개씩). 본 spike OK?
- diffs가 empty면 no drift — 만약 shadow가 진짜 비어있어도 (apply 실패)? shadow에 minimum 1 table 존재 확인 누락

### 4. service-role.ts
- `assertServiceRoleAllowed`: env split 기반·신뢰 가능?
- `assertForwardOnlyHotfixApproved`: timing-safe comparison 부재 (`!==` 사용) — token leak 우려 (spike OK·production은 timing-safe)
- `emitServiceRoleAuditEvent`: `sql.json(payload)` 사용 — postgres-js의 json 시리얼라이저. 큰 payload·circular reference 처리? 본 spike는 작은 payload만.

### 5. 시나리오 robustness
- **test-canonical-generation**: schema.ts 객체 export sanity만·실제 drizzle-kit generate 실행 결과와 비교 안 함. acceptance가 PROVIDER_GATE marker로 약함. 본 spike에서 drizzle-kit CLI 호출이 가능한가? (실 PROVIDER_PASS 단계인가 LOCAL_PASS인가)
- **test-dev-apply**: 초기 reset에서 DROP CASCADE — 모든 dependent objects 안전 제거. 그러나 custom role (app_tenant_user·migration_runner)는 reset 안 함 — 다음 apply에서 IF NOT EXISTS로 OK·but cumulative state
- **test-staging-apply**: snapshot equality는 length 비교만 — column type·constraint name 비교는 안 함. 강화 필요?
- **test-drift-check**: case-1·3 (no drift)에서 시나리오 마다 reset + apply — 다른 시나리오 영향 누적 없음. 그러나 case-3 (revert)에서 ALTER TABLE DROP COLUMN 후 drift 0 가정 — 실제 자체 column drop이 drift로 detected? (shadow에는 column이 없으므로·prod에도 drop 후 없으므로 동일·OK)
- **test-advisory-lock**: holder/runner 양쪽 별도 connection. `pg_try_advisory_lock`은 session-level — holder를 별도 connection으로 유지. holder가 commit/rollback 없이 유지되면? — 본 시나리오는 select 후 그대로 hold·OK·but session-level lock release 명시
- **test-forward-only-hotfix**: 동적 hotfix file 생성·삭제. setupBaseSchema에서 legacy_drop_target column 추가 — but 동일 migration_ledger에 적용된 migration 005 이후 추가 ALTER TABLE이 ledger에 등록 안 됨. drift check 시 issue? (별도 시나리오라 isolation 가능)
- **test-audit**: bootstrap 5건 silent skip을 명시 — `expectedMin = max(0, applied - 5)`. 본 시나리오는 acceptance 의미가 약함 — D.2-7은 "모든 migration 1건씩 insert" 인데 본 시나리오는 audit_event 후 migration만. ledger와의 통합 검증·또는 migration_ledger 자체를 audit으로 인정·SoT 명시 필요
- **test-expand-contract**: super-user (postgres role)로 insert — RLS bypass·앱 사용자가 아닌 administrative 경로. application 경로 (app_tenant_user·SET LOCAL ROLE) 검증 부재. 운영 환경에서의 정확한 검증 부재.

### 6. 코드 품질·코드 신뢰성
- `migrate.ts` main() 마지막의 `process.argv[1] && process.argv[1].endsWith("migrate.ts")` invoke check — tsx 실행 시 정확히 작동? import 시에는 main() 호출 안 됨? 검증
- TypeScript strict + `noUncheckedIndexedAccess`: 모든 array access에 `!` 확인. 빠진 곳?
- error class import path: `service-role.ts`의 dynamic import (`await import("./service-role.js")`)는 circular 회피용 — but migrate.ts와 service-role.ts에 cycle 있는가? assertForwardOnlyHotfixApproved만 service-role.ts에 있고 migrate.ts가 service-role.ts import — cycle 아님. dynamic import 불필요?
- docker-compose의 `init-multi-db.sh`가 Windows에서 권한 부재 가능 (executable bit). 명시 처리 부재
- pnpm workspace: spike-d가 root pnpm-lock.yaml에 등록되어 있어야 함·신규 추가라 lockfile stale 우려

### 7. 보안·운영 결함
- service_role guard가 process.env 기반 — DI 부재·테스트 시 mocking 어려움
- audit_event payload에 filename·checksum 등 sensitive 정보 — 본 spike LOCAL OK
- migration_ledger에 service_role_function·target_db 기록·but actor의 IP·user agent·session id 등 forensic 정보 부재
- DROP COLUMN 후 즉시 commit — production은 lock contention 위험·CONCURRENTLY 모드 부재. expand/contract 3단계에서 lock minimization 부재

### 8. 누락된 시나리오·차원
- multi-statement migration의 partial failure (예: CREATE TABLE 후 CREATE INDEX 실패) — transaction rollback 검증
- `CREATE INDEX CONCURRENTLY` (transaction 외 명령) — 본 spike에서 다루지 않지만 production은?
- `pg_dump` based snapshot 비교 — drift-check.ts는 information_schema만·full schema diff 부재
- 다른 backend (postgres 17·MySQL·SQLite) 호환성 — Drizzle Kit dialect 범위. 본 spike는 PostgreSQL 전용·OK
- migration history 재구성 (`reset` 후 `apply`)와 idempotent 보장
- Drizzle Kit `drizzle-kit drop` (migration revert)·rollback 시나리오 — D.5 fallback에 명시되지만 본 spike에서 미구현
- 매우 큰 migration (수백 statement)·transaction timeout 처리
- failed migration 후 recovery (ledger에 partial record 없음·아직 시도하지 않은 migration 다시 시도)

### 9. PROVIDER_GATE marker 정합성
- canonical generation·drizzle-kit drop·multi-cluster sync 등은 본 spike에서 검증 불가 — PROVIDER_GATE 명시?
- D.4 fallback (Atlas·db-mate·dbmate)·D.5 downstream — 본 spike에서 명시 위치?

## 평가 형식

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {"id": "SPIKED1-001", "severity": "blocking|major|minor", "category": "...", "file": "...", "line_range": "...", "issue": "...", "evidence": "...", "suggested_patch": "..."}
  ],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

본 cycle 1에서 blocking 5+·major 5+ 자연. minor 다수도 OK.
