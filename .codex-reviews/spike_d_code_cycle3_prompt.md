# Spike D local prototype 코드 — codex 자동 비평 cycle 3

동일 reviewer. cycle 2 결과 (closed: 11·remaining: 3·신규 blocking: 2·major: 4·minor: 1) 에 대한 v0.3 patch.

## cycle 2 결과 (SoT)

closed (11): SPIKED1-001·002·003·004·007·008·009·012·013·014·015.
remaining (3): SPIKED1-005 (runDeploy 순서)·SPIKED1-006 (schema 불일치)·SPIKED1-010 (dedicated migration user).
new blocking (2): SPIKED2-001 (pending deploy abort)·SPIKED2-002 (deploy lock).
new major (4): SPIKED2-003 (schema 추가 불일치)·SPIKED2-004 (view reloptions)·SPIKED2-005 (canonical fallback)·SPIKED2-006 (deploy scripts 부재).
new minor (1): SPIKED2-007 (dead code).

## cycle 3 v0.3 patch

### 1. SPIKED2-001·005: runDeploy 재설계 (pending migration 지원)

```ts
async function runDeploy(opts) {
  // 1. deploy coordinator lock (shadow DB)
  // 2. shadow reset
  // 3. shadow에 target.ledger.max_id 까지만 apply (stage shadow == 현재 target)
  // 4. checkDriftAgainstShadow(target) — pre-migrate drift 0
  // 5. shadow에 나머지 migration apply (filesystem full)
  // 6. target migrate
  // 7. post-migrate drift check
  // 8. release lock
}
```

`getTargetCurrentMaxMigrationId(target)`: information_schema.tables 확인 후 `SELECT MAX(id) FROM migration_ledger` (없으면 0).

### 2. SPIKED2-002: deploy coordinator lock

```ts
const DEPLOY_COORDINATOR_LOCK_KEY = ADVISORY_LOCK_KEY + 1n;

async function tryAcquireDeployLock(sql) { ... }
async function releaseDeployLock(sql) { ... }
```

shadow DB session에서 deploy lock 보유 — shadow reset/apply 도 lock 안에서 실행. namespace 다른 key로 migration lock과 분리.

### 3. SPIKED2-003: schema.ts ↔ SQL byte-equal

- `content_test`: `unique("content_test_instance_id_id_unique").on(instanceId, id)` 추가
- `audit_log.instanceTimeIdx`: `.on(t.instanceId, t.occurredAt.desc())`
- `migration_ledger.appliedAtIdx`: `.on(t.appliedAt.desc())`
- `audit_event.typeTimeIdx`: `.on(t.eventType, t.occurredAt.desc())`
- DEFERRABLE INITIALLY DEFERRED는 Drizzle Kit canonical 미지원·raw SQL mixin로 인정 (PROVIDER_GATE marker)

### 4. SPIKED2-004: view reloptions snapshot

```ts
COALESCE(array_to_string(c.reloptions, ','), '') AS reloptions
```

`SchemaSnapshot.views`에 `reloptions: string` 추가·diffSnapshots에서 reloptions 비교 — security_invoker·security_barrier drift detect.

### 5. SPIKED2-005: canonical-generation hard fail

```ts
const generated = await runDrizzleKitGenerate();
if (generated.length === 0) {
  throw new Error("[canonical-generation] drizzle-kit generate produced no SQL");
}
// fallback marker 제거·11 patterns 모두 PASS 강제
```

### 6. SPIKED2-006: deploy scripts

```json
"migrate:deploy-staging": "tsx --env-file=.env src/migrate.ts deploy-staging",
"migrate:deploy-prod": "tsx --env-file=.env src/migrate.ts deploy-prod",
```

### 7. SPIKED2-007: emitServiceRoleAuditEvent 제거

service-role.ts에서 dead path 함수 삭제. runMigrate가 per-file tx 안에서 직접 insert·재도입 회피.

### 8. test-deploy-gate case 0 추가

prod에 stopAfter=7 (008·009·010 미적용) → runDeploy → 008·009·010 정상 apply 검증.

### 9. SPIKED1-005·006 remaining 처리

- 005: 위 runDeploy 재설계로 close
- 006: schema.ts·SQL 동기화 완료 (SPIKED2-003 합쳐)
- 010: dedicated migration user — cycle 4 또는 SoT 명시 (PROVIDER_GATE)

## cycle 3 검토 관점

1. **runDeploy 순서 정확성**: stage shadow가 target current와 동일한지·target current가 stopAfter=0인 경우 (empty DB) 처리
2. **deploy coordinator lock 정확성**: 두 deploy 동시 시도 시 정확히 1개만·shadow scope에서 lock 보유 안정성
3. **schema.ts byte-equal**: drizzle-kit generate 결과가 raw SQL과 drift 0인가? 실제 generate → diff 0 검증 필요 (canonical-generation 시나리오로 검증)
4. **view reloptions diff**: security_invoker=on·security_barrier=on 모두 detect 되는가
5. **canonical-generation hard fail**: drizzle-kit 자체 실패 시 명시 error message·CI gate 가능
6. **pending deploy idempotent**: runDeploy를 같은 상태에서 두 번 호출 시 두 번째는 0 applied
7. **shadow reset race**: 동시 runDeploy 시 lock acquire 시점·shadow가 partial state로 남지 않는지

## 평가 형식

```json
{
  "cycle": 3,
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

cycle 1·2 누적 22개 remaining 중 가능한 한 close. 신규 결함 0이면 closeable_after_patch true 자연.
