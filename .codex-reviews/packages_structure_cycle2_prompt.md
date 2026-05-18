# packages 구조 v0.2 — codex 자동 비평 cycle 2

동일 reviewer. cycle 1 결과 (blocking 2·major 4·minor 1) 에 대한 v0.2 patch.

## cycle 1 결과 (SoT)

closeable: false.
blocking: PKG1-001 (broken exports)·PKG1-002 (SoT path).
major: PKG1-003 (migration ordering)·PKG1-004 (service-role contract)·PKG1-005 (audit error handling)·PKG1-006 (pkg:typecheck alias).
minor: PKG1-007 (standard structure documentation).

## v0.2 patch

### 1. PKG1-001: broken sub-path exports 제거
- `packages/auth/package.json`·`packages/storage/package.json`·`packages/notifications-outbox/package.json`의 exports map sub-path 모두 제거. `"."`만 유지.
- post-hardening 단계 (실 코드 복사 후) 에 재추가 — PACKAGES_STRUCTURE.md에 명시.

### 2. PKG1-002: SoT reference 정정
- `memory/milestone_*` reference에 "workspace 외부·claude memory store" 명시
- 본 monorepo 내 source: `apps/spike-*/src/` (실 SoT)
- 외부 reference는 SoT cascade marker로만

### 3. PKG1-003: migration ordering 명시
PACKAGES_STRUCTURE.md cascade:
- 4-digit numbering + package prefix (`D0001`, `A0001`, `S0001`, `N0001`)
- 각 package `migrations/manifest.json`: `depends_on` (package level) + `depends_on_files` (migration level)
- `migrations-runner`가 manifest 통합·topological sort·migration_ledger에 `package`·`file`·sequence 기록

### 4. PKG1-004: withServiceRole branded ServiceRoleTx
```ts
const SERVICE_ROLE_BRAND = Symbol.for("@glitzy/db/service-role");
export type ServiceRoleTx = postgres.TransactionSql & { [SERVICE_ROLE_BRAND]: true };
export function assertServiceRoleTx(tx: unknown): asserts tx is ServiceRoleTx { ... }

export async function withServiceRole<T>(
  sql, ctx, allowedFunctions,
  fn: (tx: ServiceRoleTx) => Promise<T>,  // tx-receiving·zero-arg 제거
): Promise<T> {
  ...
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE postgres`;
    Object.defineProperty(tx, SERVICE_ROLE_BRAND, { value: true, configurable: false });
    return fn(tx as ServiceRoleTx);
  });
}
```

### 5. PKG1-005: audit outcome update error handling
- fn error 발생 시: outcome update 시도·실패면 fn error에 `auditUpdateError` 첨부·원본 error 우선 throw
- success인데 outcome update 실패: AuditMandatoryFailureError throw·`auditId`·`function`·`phase=outcome-update` details
- pre-insert audit 실패: AuditMandatoryFailureError throw·fn 호출 안 함

### 6. PKG1-006: pkg:typecheck 실 실행
```json
"pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && ... (7 packages)"
```
build 후 각 package typecheck (tsc --noEmit) 호출.

### 7. PKG1-007: standard structure v0.1 vs post-hardening 분리
PACKAGES_STRUCTURE.md cascade:
- "v0.1 minimum": package.json·tsconfig.json·src/·dist/만
- "post-hardening": tsconfig.build.json·tests/·README.md 추가
- sub-path exports는 dist 파일 존재 시에만

## v0.2 build·typecheck 검증
- `pnpm pkg:typecheck` 모두 PASS (build + typecheck 각 7 packages)

## cycle 2 검토 관점

1. **exports map clean**: 모든 placeholder package는 `"."`만 노출·sub-path 추가 시점은 코드 복사 후
2. **withServiceRole branded tx**: fn(tx) receive 강제·외부 connection 사용 차단·assertServiceRoleTx로 nested call 보호
3. **audit error handling**: 원본 error preserve·update error 첨부·forensic 모호 명시
4. **pkg:typecheck**: build + 7 package typecheck PASS·실 measurement 가능
5. **migration ordering**: 4-digit + prefix + manifest — implementation은 cycle 3+
6. **standard structure 표현**: v0.1 minimum 명시·post-hardening cascade marker

cycle 1 7개 결함 모두 close 가능? 신규 결함 발견 시 PKG2-*.

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
