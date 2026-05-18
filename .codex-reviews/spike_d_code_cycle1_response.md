{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {
      "id": "SPIKED1-001",
      "severity": "blocking",
      "category": "migration-runner/bootstrap",
      "file": "apps/spike-d/src/migrate.ts, apps/spike-d/migrations/005_migration_ledger.sql",
      "line_range": "migrate.ts:65-78,154-163; 005_migration_ledger.sql:4-15",
      "issue": "현재 runner는 005에서 반드시 실패한다. runMigrate가 migration 실행 전에 migration_ledger를 CREATE TABLE IF NOT EXISTS로 선생성한 뒤, 005_migration_ledger.sql이 같은 테이블을 CREATE TABLE로 다시 생성한다.",
      "evidence": "ensureLedger()가 001 실행 전 ledger를 만들고, 각 migration 후 ledger insert를 수행한다. 005 파일은 IF NOT EXISTS 없이 CREATE TABLE migration_ledger를 실행하므로 relation already exists가 발생한다.",
      "suggested_patch": "005를 CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS로 바꾸고, ensureLedger와 005의 schema를 byte-for-byte 동등하게 맞춰라. 또는 bootstrap ledger를 별도 schema로 두고 005를 적용 완료로 seed하는 명시 로직을 추가하라."
    },
    {
      "id": "SPIKED1-002",
      "severity": "blocking",
      "category": "SoT/audit",
      "file": "apps/spike-d/src/service-role.ts, apps/spike-d/src/scenarios/test-audit.ts",
      "line_range": "service-role.ts:29-47; test-audit.ts:23-39",
      "issue": "D.3의 '모든 migration service-role-invoked insert 1건' 기준을 정면으로 위반한다. 001~005는 audit_event가 없다는 이유로 silent skip되며, 테스트도 이를 정상으로 허용한다.",
      "evidence": "emitServiceRoleAuditEvent는 relation does not exist를 swallow한다. test-audit는 expectedMin = applied - 5로 audit 손실을 통과 처리한다.",
      "suggested_patch": "audit_event를 001 이전 bootstrap object로 만들거나, audit_event 생성 직후 001~005의 deferred audit row를 backfill하라. 테스트는 audit_event count == applied count 및 migrationId set == ledger id set을 강제해야 한다."
    },
    {
      "id": "SPIKED1-003",
      "severity": "blocking",
      "category": "SoT/canonical-generation",
      "file": "apps/spike-d/src/scenarios/test-canonical-generation.ts",
      "line_range": "1-7,46-53",
      "issue": "Drizzle Kit migration 생성 가능성을 검증하지 않는다. schema export sanity와 수동 PATTERNS 배열 출력만으로 D.2-1/D.3의 canonical generation 기준을 통과시키고 있다.",
      "evidence": "파일 주석이 drizzle-kit generate 실행 결과는 별도 산출물/PROVIDER_GATE라고 명시한다. 실제 시나리오는 drizzle-kit CLI를 호출하지 않고 schema 객체 존재만 확인한다.",
      "suggested_patch": "시나리오에서 임시 out dir로 drizzle-kit generate를 실제 실행하고 생성 SQL을 파싱해 CHECK, composite FK, partial unique index가 존재하는지 검증하라. RLS/view/custom role은 raw-mixin marker와 수동 migration 존재를 별도 검증하라."
    },
    {
      "id": "SPIKED1-004",
      "severity": "blocking",
      "category": "SoT/drift-check",
      "file": "apps/spike-d/src/drift-check.ts",
      "line_range": "12-18,47-92",
      "issue": "drift check가 'production과 다른 schema 100% detect'를 보장하지 못한다. constraint/index/policy를 이름 수준으로만 비교하고 definition을 비교하지 않는다.",
      "evidence": "constraints는 table/name/type만, indexes는 table/name만, policies는 table/name/cmd만 snapshot한다. CHECK regex 변경, FK target/cascade 변경, partial index predicate 변경, policy USING/WITH CHECK 변경은 동일 이름이면 통과한다.",
      "suggested_patch": "pg_get_constraintdef(), pg_get_indexdef(), pg_policies.qual/with_check/roles/permissive, pg_get_viewdef(), reloptions, grants, enum labels, function definitions까지 snapshot에 포함하라. 최소한 spike에서 쓰는 CHECK/FK/partial index/RLS/view/security_invoker 정의 drift는 반드시 fixture로 검출해야 한다."
    },
    {
      "id": "SPIKED1-005",
      "severity": "blocking",
      "category": "deploy-gate",
      "file": "apps/spike-d/src/migrate.ts, apps/spike-d/package.json",
      "line_range": "migrate.ts:110-184; package.json:15-18",
      "issue": "prod migration path가 drift check를 호출하지 않는다. SoT의 'production schema와 다르면 deploy fail'은 별도 scenario에서만 수동 검증되고 실제 migrate:prod에는 통합되지 않았다.",
      "evidence": "runMigrate는 checkDriftAgainstShadow를 import/call하지 않는다. package script migrate:prod는 단순히 tsx src/migrate.ts prod를 실행한다.",
      "suggested_patch": "prod/staging deploy command를 별도 runDeploy로 만들고, shadow reset/apply, ledger checksum 검증, checkDriftAgainstShadow(target), advisory lock 획득 후 migrate 순서로 강제하라."
    },
    {
      "id": "SPIKED1-006",
      "severity": "blocking",
      "category": "schema/Drizzle-SoT mismatch",
      "file": "apps/spike-d/src/db/schema.ts, apps/spike-d/migrations/*.sql",
      "line_range": "schema.ts:69-94; 004_audit_log.sql:3-11; 005_migration_ledger.sql:4-13; 008_expand_add_nullable.sql:6-10",
      "issue": "Drizzle schema와 실제 migration schema가 다르다. 이 상태에서 drizzle-kit generate 검증을 추가하면 drift가 발생한다.",
      "evidence": "schema.ts auditLog.metadata는 text지만 SQL은 JSONB다. schema.ts migrationLedger에는 target_db/duration_ms가 없다. schema.ts contentTest에는 008~010의 published_at 및 constraint/index가 없다.",
      "suggested_patch": "schema.ts를 최종 schema와 동기화하라. expand/contract 중간 상태를 검증하려면 final schema 외에 phase별 generated SQL fixture를 분리하고, canonical-vs-raw matrix를 실제 SQL diff로 검증하라."
    },
    {
      "id": "SPIKED1-007",
      "severity": "major",
      "category": "scenario/staging-apply",
      "file": "apps/spike-d/src/scenarios/test-staging-apply.ts",
      "line_range": "27-37",
      "issue": "dev/staging apply 동등성 검증이 table count와 policy count만 비교한다. column, type, constraint, index, policy definition drift가 있어도 통과한다.",
      "evidence": "snapshotForDebug 결과 중 tables.length와 policies.length만 assert한다. indexes/constraints는 로그에만 출력된다.",
      "suggested_patch": "diffSnapshots를 export해 dev/staging snapshot 전체를 비교하라. definition-aware snapshot으로 강화한 뒤 diff length == 0을 강제해야 한다."
    },
    {
      "id": "SPIKED1-008",
      "severity": "major",
      "category": "scenario/expand-contract",
      "file": "apps/spike-d/src/scenarios/test-expand-contract.ts",
      "line_range": "25-34,56-58",
      "issue": "expand/contract 3단계의 운영 무중단성을 검증하지 않는다. 모든 migration을 한 번에 010까지 적용한 뒤 최종 CHECK만 검사한다.",
      "evidence": "주석 자체가 '010이 이미 apply되어서 CHECK 강제됨'이라고 말한다. phase 1 상태의 old writer, phase 2 backfill 후 dual writer, phase 3 전환 타이밍을 분리하지 않는다.",
      "suggested_patch": "runner에 stopAfter/targetMigration 옵션을 넣어 008, 009, 010 단계별로 중단 검증하라. old writer/new writer/reader fixture를 각 phase에서 실행하고, app_tenant_user 역할과 SET LOCAL context로 RLS 경로까지 검증하라."
    },
    {
      "id": "SPIKED1-009",
      "severity": "major",
      "category": "security/RLS-test-validity",
      "file": "apps/spike-d/src/scenarios/test-expand-contract.ts, apps/spike-d/.env.example",
      "line_range": "test-expand-contract.ts:56-58; .env.example:3-6",
      "issue": "핵심 데이터 검증이 postgres superuser URL로 실행되어 RLS를 우회한다. INFRA v1.0의 app_tenant_user + SET LOCAL 실행 모델을 acceptance에서 확인하지 않는다.",
      "evidence": "test-expand-contract는 super-user로 insert한다고 주석으로 인정한다. .env.example의 모든 DATABASE_URL은 postgres superuser다.",
      "suggested_patch": "scenario helper withTenantTransaction을 추가해 SET LOCAL ROLE app_tenant_user, SET LOCAL app.current_instance_id를 사용하라. superuser path와 tenant path를 분리하고 tenant path를 acceptance 기준으로 삼아라."
    },
    {
      "id": "SPIKED1-010",
      "severity": "major",
      "category": "service-role/authenticity",
      "file": "apps/spike-d/src/service-role.ts, apps/spike-d/src/migrate.ts",
      "line_range": "service-role.ts:14-18; migrate.ts:121-123",
      "issue": "service_role guard가 실제 DB role이나 credential을 검증하지 않고 process env allow-list만 확인한다. migration은 postgres superuser로 실행되며 migration_runner role을 사용하지 않는다.",
      "evidence": "assertServiceRoleAllowed는 ctx.function 문자열 포함 여부만 본다. 001에서 migration_runner role을 만들지만 runMigrate는 SET ROLE migration_runner도 current_user 검증도 하지 않는다.",
      "suggested_patch": "전용 migration DB user 또는 SET ROLE migration_runner를 사용하고, current_user/session_user를 audit payload에 기록하라. production target에서는 postgres superuser URL을 거부하는 guard를 추가하라."
    },
    {
      "id": "SPIKED1-011",
      "severity": "major",
      "category": "drift-check/shadow-freshness",
      "file": "apps/spike-d/src/drift-check.ts, apps/spike-d/src/scenarios/test-drift-check.ts",
      "line_range": "drift-check.ts:101-114; test-drift-check.ts:11-21",
      "issue": "checkDriftAgainstShadow는 shadow가 clean migration 결과라는 전제를 검증하지 않는다. shadow reset/apply는 scenario helper에만 있고 production deploy path에는 없다.",
      "evidence": "checkDriftAgainstShadow는 target/shadow snapshot만 비교한다. shadow ledger checksum, latest migration id, clean rebuild 여부를 확인하지 않는다.",
      "suggested_patch": "checkDriftAgainstShadow 내부 또는 deploy wrapper에서 shadow DB를 reset 후 현재 migration set으로 apply하고, shadow ledger id/checksum == filesystem migration set을 검증한 다음 target과 비교하라."
    },
    {
      "id": "SPIKED1-012",
      "severity": "major",
      "category": "scenario/forward-only",
      "file": "apps/spike-d/src/scenarios/test-forward-only-hotfix.ts",
      "line_range": "4-20,46-95",
      "issue": "테스트가 실제 migrations 디렉터리에 임시 파일을 생성/삭제한다. 병렬 실행, 실패 중단, watch/generate 실행과 충돌할 수 있고 migration source of truth를 테스트가 변조한다.",
      "evidence": "writeFile(hotfixPath, HOTFIX_CONTENT)로 apps/spike-d/migrations/099_forward_only_drop_legacy_column.sql을 생성하고 finally에서 unlink한다.",
      "suggested_patch": "runMigrate에 migrationsDir 옵션을 주고 temp directory copy에서 hotfix를 추가하라. 또는 fixture migrations directory를 별도로 두고 source migrations를 절대 수정하지 마라."
    },
    {
      "id": "SPIKED1-013",
      "severity": "major",
      "category": "migration-robustness",
      "file": "apps/spike-d/src/migrate.ts, apps/spike-d/src/scenarios",
      "line_range": "migrate.ts:154-163",
      "issue": "multi-statement migration의 partial failure rollback과 recovery가 검증되지 않는다. per-file transaction을 쓴다고 주장하지만 실패 후 object rollback, ledger 미기록, 재시도 성공을 확인하는 scenario가 없다.",
      "evidence": "tx.unsafe(file.content) 뒤 ledger insert를 같은 transaction에 넣지만, failure fixture가 없다.",
      "suggested_patch": "임시 migrationsDir에 'CREATE TABLE ...; SELECT fail;' migration을 넣어 실패 후 table/ledger가 남지 않는지 확인하고, 수정된 migration 재시도 시 정상 적용되는지 검증하라."
    },
    {
      "id": "SPIKED1-014",
      "severity": "major",
      "category": "advisory-lock",
      "file": "apps/spike-d/src/migrate.ts, apps/spike-d/src/scenarios/test-advisory-lock.ts",
      "line_range": "migrate.ts:52-62,130-169; test-advisory-lock.ts:23-57",
      "issue": "동시 migration 시 '1개만 진행'을 실제 두 runner 경쟁으로 검증하지 않는다. 별도 holder가 lock을 잡은 상태의 reject만 확인한다.",
      "evidence": "test-advisory-lock는 pg_try_advisory_lock holder를 수동으로 만든 뒤 runMigrate 1회를 실패시키고, release 후 1회를 성공시킨다. 두 runMigrate Promise를 동시에 실행해 ledger 중복/경합을 검증하지 않는다.",
      "suggested_patch": "빈 DB에서 Promise.allSettled([runMigrate(dev), runMigrate(dev)])를 실행해 정확히 하나만 applied, 하나는 AdvisoryLockNotAcquiredError, ledger row 수는 migration file 수와 동일함을 검증하라. releaseAdvisoryLock 결과도 true인지 assert하라."
    },
    {
      "id": "SPIKED1-015",
      "severity": "major",
      "category": "SoT/rollback",
      "file": "apps/spike-d",
      "line_range": "missing",
      "issue": "D.1 가설의 rollback 검증이 없다. forward-only hotfix reject는 rollback 검증을 대체하지 못한다.",
      "evidence": "package scripts와 scenarios에 rollback/drop/down 검증이 없다. D.2/D.3의 deploy safety 맥락상 staging apply 실패 시 rollback 또는 forward-only policy가 acceptance 경계인데 구현 산출물이 없다.",
      "suggested_patch": "rollback을 지원하지 않는 결정을 SoT에 명시하고 forward-only-only로 범위를 줄이거나, drizzle-kit drop/수동 down migration fixture를 추가해 staging apply 후 rollback 검증을 자동화하라."
    }
  ],
  "convergence_signal": "cycle 1 기준 acceptance 불가. 특히 005 ledger bootstrap 충돌은 실제 migrate 성공 자체를 막고, audit/canonical/drift/deploy gate는 SoT의 핵심 통과 기준을 테스트가 약화하거나 우회한다.",
  "next_cycle_focus": "먼저 runner가 001~010을 clean DB에 실제로 끝까지 적용하게 만든 뒤, audit 1:1, 실제 drizzle-kit generate diff, definition-aware drift, prod deploy drift gate, phase별 expand/contract 테스트를 순서대로 닫아라."
}