# Spike D local prototype 코드 — codex 자동 비평 cycle 4

동일 reviewer. cycle 3 결과 (closed: 7·remaining: 3·신규 blocking: 1·major: 2·minor: 1) 에 대한 v0.4 patch.

## cycle 3 결과 (SoT)

closed (7): SPIKED1-006·SPIKED2-002~007.
remaining (3): SPIKED1-005 partial (empty target)·SPIKED1-010 (dedicated user)·SPIKED2-001 partial.
new blocking (1): SPIKED3-001 (empty target deploy 실패).
new major (2): SPIKED3-002 (canonical-generation 실제 diff)·SPIKED3-003 (shadow reset hardcoded list).
new minor (1): SPIKED3-004 (reloptions test 부재).

## cycle 4 v0.4 patch

### 1. SPIKED3-001 + SPIKED2-001 + SPIKED1-005: empty target deploy

```ts
if (targetCurrent === 0) {
  // target empty 검증: public schema에 table 없음
  const tables = await sql`SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`;
  if (tables[0]!.count !== 0) throw new Error("target has no migration_ledger but public tables exist");
  // skip pre-drift
} else {
  // pending deploy: shadow stage at target current
  await runMigrate({ target: "shadow", stopAfter: targetCurrent });
  // pre-drift check
  await checkDriftAgainstShadow(opts.target);
}
// shadow full apply → target migrate → post-drift (모든 경로 공통)
```

empty target도 정상 deploy.

### 2. SPIKED3-003: shadow reset schema-wide

```ts
async function resetShadow() {
  await sql`DROP SCHEMA IF EXISTS public CASCADE`;
  await sql`CREATE SCHEMA public`;
  await sql`GRANT ALL ON SCHEMA public TO postgres`;
  await sql`GRANT USAGE, CREATE ON SCHEMA public TO PUBLIC`;
}
```

object 목록 hardcoded 제거·새 migration이 어떤 object를 만들어도 clean slate.

### 3. SPIKED3-004: reloptions deploy-gate case

`test-deploy-gate.ts` case 5: tenant_audit_log_view를 security_invoker option 없이 재생성 → SchemaDriftError + diff에 reloptions 포함.

### 4. SPIKED3-002: canonical-generation real diff → PROVIDER_GATE marker (SoT cascade)

D.3 표에 명시:
> canonical drift 0 (drizzle-kit generate ↔ raw SQL snapshot diff 0)는 PROVIDER_GATE — Day 8 staging에서 검증. LOCAL은 regex pattern + raw file existence + schema.ts byte-equal raw SQL.

이유: drizzle-kit canonical은 RLS·view·custom role 등을 생성 안 함·full diff 0 검증은 raw mixin과의 차이 때문에 본질적으로 불가능. 비교 가능한 부분 (table·column·CHECK·composite FK·partial unique·enum)만 regex pattern으로 검증·실 production은 staging에서 manual 검증.

### 5. SPIKED1-010 dedicated migration user → PROVIDER_GATE (SoT cascade)

D.3 표 추가 row:
> dedicated migration runner role: PROVIDER_GATE — Day 8 staging. LOCAL은 application-layer service_role guard·production은 별도 PG role + SET ROLE migration_runner·current_user audit.

## SoT cascade (D.3 표)

| 검증 | 기준 |
|---|---|
| canonical migration 생성 | regex pattern + raw file existence (LOCAL)·**canonical drift 0은 PROVIDER_GATE** |
| dev/staging apply | 100% 성공·dev↔staging full snapshot diff 0 |
| drift check (definition-aware) | column·constraint def·index def·policy qual/with_check/roles·view def + reloptions·enum labels |
| advisory lock | 동시 migration 1개·concurrent race 검증 |
| deploy coordinator lock | 별도 namespace·shadow scope |
| empty target deploy | pre-drift skip·full apply·post-drift |
| pending migration deploy | shadow stage at target current·drift 0·apply·post-drift |
| migration audit | 1:1 per-file tx atomic |
| expand/contract | phase별 stopAfter·app_tenant_user RLS path |
| forward-only hotfix | super-admin token + ADR·source migrations 불변 |
| partial failure rollback | tx rollback·재시도 성공 |
| shadow reset | DROP SCHEMA + CREATE SCHEMA |
| **dedicated migration runner role** | **PROVIDER_GATE** |

## cycle 4 검토 관점

1. **empty target deploy 정확성**: targetCurrent=0인 경우 public schema 검증·target 실제 empty 보장
2. **schema-wide reset robustness**: extension·role은 schema 외 잔존·CREATE EXTENSION pgcrypto는 IF NOT EXISTS·재apply OK?
3. **deploy-gate case-5 reloptions detect**: DROP VIEW + CREATE VIEW (without WITH options) → diff에 reloptions 변화 명시 detect
4. **SoT cascade 완전성**: D.3 표가 v0.4 코드 상태와 정합
5. **canonical generation PROVIDER_GATE marker**: regex 11 patterns + 5 raw mixin이 모두 명시·full diff 0은 명시 명시 제외
6. **dedicated migration user**: LOCAL acceptance OK·production은 별도 task

## 평가 형식

```json
{
  "cycle": 4,
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

cycle 1·2·3 누적 remaining 6개 모두 close 가능. 신규 결함 0이면 closeable_after_patch true.
