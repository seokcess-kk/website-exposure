# packages 구조 v0.3 — codex 자동 비평 cycle 3 (acceptance scope)

동일 reviewer. cycle 2 결과 (closed: 6·partial: 1·신규 major: 1·minor: 1) 에 대한 v0.3 micro patch.

## cycle 2 결과 (SoT)

closed (6): PKG1-001·002·003·005·006·007.
partial: PKG1-004 (`Symbol.for` forgeable).
new major (1): PKG2-001 (@glitzy/db sub-path vs v0.1 minimum 불일치).
new minor (1): PKG2-002 (acceptance gate apps/spike-* regression 미측정 명시).

## v0.3 patch (micro)

### PKG1-004: Symbol.for → Symbol() module-local

```diff
- const SCOPED_BRAND = Symbol.for("@glitzy/db/scoped");
+ const SCOPED_BRAND = Symbol("@glitzy/db/scoped");

- const SERVICE_ROLE_BRAND = Symbol.for("@glitzy/db/service-role");
+ const SERVICE_ROLE_BRAND = Symbol("@glitzy/db/service-role");
```

`Symbol.for(key)`는 global registry에 등록·다른 module에서 동일 key로 재발견 가능·forgeable.
`Symbol(description)`은 module scope에서만 존재하는 unique symbol·외부 코드가 동일 symbol 생성 불가·non-forgeable.

### PKG2-001: @glitzy/db sub-path 허용 명시

PACKAGES_STRUCTURE.md cascade — Package-level 분류:
- **non-placeholder**: 실 코드·dist 파일 emit·sub-path exports 허용 (`@glitzy/db`)
- **placeholder**: `"."`만 (auth·storage·notifications-outbox·migrations-runner)

### PKG2-002: acceptance gate 명시 defer

```diff
- apps/spike-* LOCAL_PASS 시나리오에서 package import 후 동일 PASS (regression 없음)
+ apps/spike-* LOCAL_PASS regression test: **cycle 3+ deferred** — 본 v0.1·v0.2는 build/typecheck PASS만 측정
```

## v0.3 build·typecheck

`pnpm pkg:typecheck` 모두 PASS·dist 정합.

## cycle 3 검토 관점 (narrow)

1. **Symbol() non-forgeable**: tenant.ts·service-role.ts 둘 다 module-local·외부 코드 brand 위조 불가
2. **package-level 분류 정합**: @glitzy/db는 non-placeholder·sub-path 허용·다른 4 packages는 placeholder
3. **acceptance gate defer**: cycle 3+ regression 명시·v0.1·v0.2는 build/typecheck only
4. **누계 8개 결함** (cycle 1: 7·cycle 2: 2) — 모두 close 가능?

신규 결함 0이면 closeable_after_patch=true·ready_for_acceptance=true.

## 평가 형식

```json
{
  "cycle": 3,
  "closeable_after_patch": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "ready_for_acceptance": true | false
}
```
