# packages 구조 v0.1 — codex 자동 비평 cycle 1

당신은 신중한 senior reviewer. 본 prompt의 코드/문서를 직접 읽고 acceptance 막을 결함을 모두 찾아라.

## 범위·SoT

- `docs/decisions/PACKAGES_STRUCTURE.md` v0.1 (본 cycle 신규)
- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 § 4.3 (Week 2 dev/staging vertical green)
- Spike A·B·C·D·E LOCAL_PASS milestone (`memory/milestone_spike_{a,b,c,d,e}_local_pass.md`)
- 코드: `packages/{shared-types,shared-errors,db,auth,storage,notifications-outbox,migrations-runner}/`

## v0.1 산출물

### Plan 문서
- `docs/decisions/PACKAGES_STRUCTURE.md` — Spike→Package 매핑·의존성 방향·build (tsc only)·exports map·tsconfig project references·acceptance gate

### 7 packages 골격
| Package | 상태 | 의존성 |
|---|---|---|
| shared-types | branded types (UuidV4·InstanceId·AdminUserId·ContentRef)·enums (TenantRole·EffectiveRole·ActionType·ServiceRoleFunction)·UUID v4 strict regex + isUuidV4·asUuidV4 | — |
| shared-errors | AppError base + 4 derived (InvariantViolation·Configuration·ConcurrencyConflict·Validation) | — |
| db | errors (5 domain)·tenant (withTenantTransaction + ScopedTx symbol brand)·service-role (withServiceRole pending audit pattern)·advisory-lock (tryAcquire/release/withAdvisoryLock) | shared-errors·shared-types·drizzle·postgres |
| auth | placeholder index.ts (export {})·향후 Spike E 코드 복사 | db·shared-errors·shared-types·postgres |
| storage | placeholder | db·shared-errors·shared-types·@aws-sdk |
| notifications-outbox | placeholder | db·shared-errors·shared-types·postgres |
| migrations-runner | placeholder | db·shared-errors·shared-types·postgres |

### Build 결과
- `pnpm pkg:build` 7 packages 모두 PASS·dist/ 생성
- tsconfig project references composite 정합

## 검토 관점

### 1. 구조·의존성
- db ← {auth, storage, notifications-outbox, migrations-runner} 의존 방향 정합?
- shared-types·shared-errors가 base·외부 dep 없음 — 정확한가?
- cycle 없음 (madge 등으로 검증 안 했지만 정적 import 기준으로)
- exports map sub-path: `./tenant`·`./service-role` 등 tree-shake 친화·types-only 분리 가능
- `composite: true`로 project references — `tsc -b`로 incremental build·본 spike는 sequential script 사용·문제?

### 2. db package 정확성 (실 코드)
- `withTenantTransaction`: SET LOCAL ROLE + set_config·ScopedTx symbol brand·Object.defineProperty·tx 종료 후 brand 자동 해제 (실제론 tx 객체 재사용 안 됨·OK)
- `withServiceRole`: pending audit insert → fn → outcome update·audit insert 실패 시 AuditMandatoryFailureError·fn() 실패 시 audit row 보존 (forensic)
- `advisory-lock`: tryAcquire/release/withAdvisoryLock·BigInt|string lockKey·toString()로 cast (postgres-js BigInt 인터폴레이션 회피)
- ScopedDbBrandError·AppError extension: `override` modifier 사용·OK (typecheck PASS)

### 3. shared-types
- branded types (`UuidV4 & { __scope: "instance" }`): nominal typing·assertion 함수 (asUuidV4) 명시
- UUID_V4_REGEX: version=4·variant=[89ab]·anchored — Spike E SoT
- isUuidV4 length+regex 검사 (newline anchor bypass 차단)
- enum: TenantRole·EffectiveRole·ActionType·ServiceRoleFunction — REVIEW_WORKFLOW SoT 정합

### 4. shared-errors
- AppError abstract·`code`·`httpStatus`·`name`·`details` — 4 derived
- 향후 module-specific 에러는 각 package에서 AppError extends·code prefix·http status 명시

### 5. plan 문서 v0.1
- Spike→Package 매핑 명확?
- migration 통합: 각 package 자체 migrations·migrations-runner에서 통합 apply — 정확한 ordering·filename·dependency manifest?
- 추가 packages (Week 4~6): content-standards·compliance·schema-mapping·search·design-tokens·review-workflow 명시·delay marker
- acceptance gate v0.1: build PASS·typecheck PASS·exports map·apps/spike-* regression 없음 — 측정 부재 (cycle 2 cascade?)

### 6. 누락·결함
- 각 package에 `tsconfig.build.json` 분리 부재 (test·dev 파일 exclude) — 본 spike OK (test 없음)
- README.md 부재 — placeholder OK
- vitest·unit test 부재 — 본 v0.1 명시 OK
- `tsup`/`rollup`/`esbuild` 미사용·tsc only — 추후 cascade marker
- workspace path mapping (`paths`) 부재 — source-level link 안 함·dist 기반 import·composite build로 충분
- `auth`·`storage`·`notifications-outbox`·`migrations-runner`는 placeholder만 — 실제 Spike 코드 복사는 cycle 2+ 또는 별도 작업
- 각 Spike의 `apps/spike-*`은 그대로 유지·packages는 별도 — 동시 운영 시 schema 충돌 가능 (DATA_MODEL cascade)
- migration runner가 각 package migration을 어떻게 통합? dependency manifest·filename ordering·numbering 정책 부재
- runtime engine (Node version·import.meta.url 등) 명시 부재

### 7. apps integration plan
- apps/web (Phase 0 Week 5~6)·apps/worker (Week 3) 명시·구체 deferred OK
- M0 vertical slice (~15 tables) packages 분산 정책 부재
- 각 spike의 LOCAL_PASS 시나리오가 package import 후 동일 PASS — 검증 부재 (acceptance gate에 명시했지만 실 검증은 cycle 2+)

## 평가 형식

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {"id": "PKG1-001", "severity": "blocking|major|minor", "category": "...", "file": "...", "line_range": "...", "issue": "...", "evidence": "...", "suggested_patch": "..."}
  ],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

v0.1은 plan + 골격 + db 실 코드만·다른 4 package는 placeholder. 본 cycle 1에서 blocking·major 결함 발견·이후 cycle에서 patch + 실 Spike 코드 복사.
