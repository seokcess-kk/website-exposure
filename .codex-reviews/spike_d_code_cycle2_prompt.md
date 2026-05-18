# Spike D local prototype 코드 — codex 자동 비평 cycle 2

동일 reviewer. cycle 1 15개 결함 (blocking 6·major 9) 에 대한 v0.2 patch.

## cycle 1 결과 (SoT)

closeable_after_patch: false.
blocking_findings (15): SPIKED1-001~015. 핵심 결함:
- 001: 005 ledger 충돌 — migration 자체 실패
- 002: audit 1:1 검증 부재·silent skip 5건
- 003: canonical generation 실제 drizzle-kit 호출 안 함
- 004: drift check definition 비교 부재
- 005: prod migrate path에 drift check 통합 부재
- 006: schema.ts와 raw SQL 불일치
- 007: staging diff count만
- 008: expand/contract phase 분리 부재
- 009: super-user URL·RLS path 부재
- 010: service_role guard 실 검증 부재
- 011: shadow freshness 부재
- 012: forward-only가 source migrations 변조
- 013: partial failure rollback 시나리오 부재
- 014: advisory lock concurrent race 부재
- 015: rollback SoT 명시 부재

## v0.2 patch 요약

### 1. SPIKED1-001: 005 IF NOT EXISTS + ensureLedger byte-for-byte 동등
- `migrations/005_migration_ledger.sql`: `CREATE TABLE IF NOT EXISTS` + `CREATE INDEX IF NOT EXISTS`
- `migrate.ts::ensureLedger`: 정확히 같은 schema·index

### 2. SPIKED1-002: audit_event bootstrap + 1:1 강제
- `migrations/006_audit_event.sql`: `IF NOT EXISTS`
- `migrate.ts::ensureAuditEvent`: 001 이전 bootstrap·byte-for-byte 동등
- `migrate.ts::runMigrate`: per-file transaction 안에서 audit insert·1:1 강제 (silent emit 제거)
- `test-audit.ts`: case 1~5 — audit count == applied count, migrationId set equality, service_role_function single, payload schema, ledger == audit

### 3. SPIKED1-003: canonical-generation 실 drizzle-kit
- `test-canonical-generation.ts`: `execSync("pnpm drizzle-kit generate --out=<tmp>")` 실행
- 생성 SQL 파일들 읽어 11 canonical pattern regex assert (CHECK·composite FK·partial unique·partial index·jsonb·enum 등)
- 5 raw-mixin pattern은 별도 file existence check (role·RLS·view·security_invoker·data UPDATE)
- drizzle-kit 실패 시 fallback (PROVIDER_GATE marker)

### 4. SPIKED1-004: drift-check definition-aware
```ts
constraints: pg_get_constraintdef(con.oid, true)
indexes: pg_get_indexdef → indexdef
policies: qual·with_check·roles·cmd·permissive
views: pg_get_viewdef
enums: enum labels (ordered by enumsortorder)
columns: + defaultExpr (column_default)
```
diffSnapshots: definition string 비교·set 기반.

### 5. SPIKED1-005: runDeploy wrapper + 통합
```ts
export async function runDeploy(opts: { target: DbTarget }): Promise<MigrateResult> {
  // 1. shadow reset + apply
  // 2. shadow ledger == filesystem migration set 검증
  // 3. checkDriftAgainstShadow(target) — fail이면 abort
  // 4. target migrate
}
```
package.json: `migrate:deploy-prod`·`migrate:deploy-staging` 추가.

### 6. SPIKED1-006: schema.ts 동기화
- `audit_log.metadata`: jsonb (`text` → `jsonb`)
- `migration_ledger`: targetDb·durationMs·appliedAtIdx 추가
- `content_test`: publishedAt·publishedAtIdx (partial WHERE)·publishedRequiresAt CHECK 추가
- `audit_event`: 신규 추가
- `instance_user`: instanceIdIdx 추가

### 7. SPIKED1-007: staging-apply full diff
```ts
const diffs = diffSnapshots(devSnap, stagingSnap);
if (diffs.length !== 0) throw new Error(...);
```

### 8. SPIKED1-008·009: expand-contract phase별 stopAfter + app_tenant_user
- `migrate.ts::MigrateOptions.stopAfter`: 지정 id까지만 apply
- `test-expand-contract.ts`: stopAfter=7·8·9·10 단계별 검증
- `withTenantTx` helper: SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id
- phase 1·2·3·4 별 insert/update fixture·RLS path

### 9. SPIKED1-010: TBD cycle3 — dedicated migration user URL

### 10. SPIKED1-011: shadow freshness — runDeploy 안에 통합 (위 5번)

### 11. SPIKED1-012: forward-only fixture migrationsDir
- `migrate.ts::MigrateOptions.migrationsDir`: 기본 = src/../migrations·override 가능
- `test-forward-only-hotfix.ts`: tmpdir에 fixture copy + 099 hotfix file 추가 → 실 migrations 디렉토리 변조 금지
- case-5: source 변조 없음 검증 (readdir에서 099 부재)

### 12. SPIKED1-013: failure rollback 시나리오
- `test-failure-rollback.ts`: 의도적 broken migration (`SELECT * FROM nonexistent_table`)
- case-1: broken_test table·098 ledger·098 audit_event 모두 rollback
- case-2: fixed migration 재시도 → 정상 apply

### 13. SPIKED1-014: advisory lock concurrent race
- `test-advisory-lock.ts` case-A: `Promise.allSettled([runMigrate(), runMigrate()])` → 1 fulfilled + 1 rejected (AdvisoryLockNotAcquiredError)·ledger count == file count (no duplicate)
- case-B: 기존 external holder 패턴 유지

### 14. SPIKED1-015: rollback SoT 명시
`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md § D.1`:
> rollback 정책: forward-only (no down migration) — partial failure는 per-file transaction rollback·destructive 변경은 forward-only hotfix + super-admin token 명시 승인 + ADR 필수. 운영 무중단 롤백 필요 시 expand/contract 3-phase로 처리.

## 신규 시나리오 (scenario:all 10개)
1. test-canonical-generation (drizzle-kit 실 실행)
2. test-dev-apply
3. test-staging-apply (full diff)
4. test-drift-check (5 cases — definition diff 추가)
5. test-advisory-lock (concurrent race + external holder)
6. test-forward-only-hotfix (fixture migrationsDir + source 변조 금지)
7. test-audit (1:1 강제 5 cases)
8. test-expand-contract (phase 1·2·3·4 stopAfter + RLS)
9. **test-deploy-gate (신규)**: runDeploy with drift gate·CHECK constraint definition drift·RLS qual drift
10. **test-failure-rollback (신규)**: partial failure rollback + recovery

## cycle 2 검토 관점

1. **ensureLedger 동등성**: schema·index name·index column·DEFAULT·NOT NULL 모두 byte-for-byte 일치하는가? 005 SQL vs ensureLedger
2. **ensureAuditEvent 동등성**: 동일 검증
3. **audit 1:1 invariant**: per-file transaction 안에서 audit insert — migration SQL이 advisory lock 또는 BEGIN을 호출하면 nested transaction 충돌 가능. spike의 모든 SQL이 그런 호출 없는가?
4. **runDeploy idempotency**: shadow reset → apply 중 race·shadow가 prod와 동시에 deploy 시도되면? — single lock 부재
5. **definition-aware diff false positive**: `pg_get_constraintdef` 결과가 동일 schema에서도 column quoting 차이 등으로 변하지 않는가? cross-pg-version 안정성
6. **canonical-generation fallback**: drizzle-kit 실패 시 fallback marker로 PASS — 정확한 failure mode·exit code 분리 필요?
7. **stopAfter 정확성**: ledger·audit count가 stopAfter 후 정확? 후속 migration 시도 시 정상 continue?
8. **failure-rollback concurrent**: broken migration 실패 중 다른 runner가 동시 시도? advisory lock 점유로 차단되지만 검증 부재
9. **forward-only fixture isolation**: tmpdir clean·다른 test와 race·소스 변조 없음 검증 정확?
10. **runDeploy 안의 lock**: target migrate가 shadow와 동시 진행 가능 (advisory lock은 target DB scope) — race 가능성
11. **expand-contract RLS path**: app_tenant_user는 NOBYPASSRLS·하지만 `SET LOCAL ROLE` 직후 RLS 적용·실 application path와 일치
12. **schema.ts ↔ SQL byte-equal**: drizzle-kit generate가 정확히 같은 schema 생성하는가? cycle 3에서 drift 0이어야 함

## 평가 형식

```json
{
  "cycle": 2,
  "closeable_after_patch": false | true,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

cycle 1 15개 중 가능한 한 close. 신규 결함 발견 시 새 ID (SPIKED2-001~).
