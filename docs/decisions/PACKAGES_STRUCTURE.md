# Glitzy monorepo packages structure (v0.1·2026-05-15)

본 문서는 Phase 0 Week 2~6 본 구현을 위한 monorepo packages 구조다. **Spike A·B·C·D·E의 LOCAL_PASS 코드를 production-ready package로 승격**하여 `apps/web`·`apps/worker`·`apps/spike-*` 모두에서 재사용 가능하게 한다.

## SoT

- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 § 4.3 (Week 2 dev/staging vertical green)
- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § A.5·B.5·C.6·D.5·E.5 downstream unblock
- 각 Spike의 LOCAL_PASS 코드: `apps/spike-{a,b,c-local,d,e}/src/` — production package에 복사 source
- 외부 reference (workspace 외·claude memory store): `memory/milestone_spike_{a,b,c,d,e}_local_pass.md` — codex CLI에서는 직접 접근 불가·본 monorepo 내에서는 SoT cascade 명시 목적
- DATA_MODEL v0.24·REVIEW_WORKFLOW·CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON·SCHEMA_MAPPING·SEARCH_STANDARDIZATION·DESIGN_TOKENS — `docs/core/`·`docs/admin/`·`docs/compliance/`

## 디렉토리 구조

```
website-exposure/
├── apps/
│   ├── spike-a/  spike-b/  spike-c-local/  spike-d/  spike-e/  (LOCAL_PASS·기존 prototype)
│   ├── web/      (Phase 0 Week 5~6 — Next.js admin UI)
│   └── worker/   (Phase 0 Week 3 — Railway worker·webhook receiver)
├── packages/
│   ├── db/                  (Spike A core·foundation)
│   ├── auth/                (Spike E)
│   ├── storage/             (Spike C)
│   ├── notifications-outbox/(Spike B)
│   ├── migrations-runner/   (Spike D)
│   ├── shared-types/        (cross-package types — Instance·AdminUser·ContentRef 등)
│   └── shared-errors/       (common AppError·HttpStatus·error classes)
├── docs/  …
├── memory/  …
├── pnpm-workspace.yaml
└── package.json (root)
```

## 의존성 방향

```
shared-types ← shared-errors ← db ← {auth, storage, notifications-outbox, migrations-runner}
                                  ↑
                            apps/web, apps/worker
```

- `shared-types`·`shared-errors`: 가장 base·외부 dependency 없음 (postgres·drizzle 등 미사용)
- `db`: `shared-types`·`shared-errors` + postgres/drizzle 의존·withTenantTransaction·withServiceRole core
- `auth`·`storage`·`notifications-outbox`·`migrations-runner`: `db` + 자체 외부 dep (R2 SDK·Resend·etc)
- `apps/web`·`apps/worker`: 모든 package import

## Spike → Package 매핑

| Spike | Package | 추출 대상 |
|---|---|---|
| A | `db` | env·errors·service-role·tenant·schema·migrate·migrations(roles·content_test·audit_log·invariant_log) |
| B | `notifications-outbox` | outbox·fake-provider→provider-adapter interface·failure-injection·worker·permanent_alert·provider_attempt_log |
| C | `storage` | env·errors·tenant-context·audit-log·storage-client·sign-url·fixtures pattern |
| D | `migrations-runner` | migrate.ts (advisory lock + deploy coordinator + drift check + forward-only + schema-wide reset + 11-class guard) |
| E | `auth` | env·errors·fixtures·audit·magic-link·session·resolve-tenant-context·withResolvedTenantTransaction·assertActionEligibility |

## 각 package 표준 구조

### v0.1 minimum (현재 cycle — Week 2 시작 시점)

```
packages/<name>/
├── package.json (@glitzy/<name>·private·type=module·exports map: "." 만)
├── tsconfig.json (extends root tsconfig.base.json·composite: true)
├── src/
│   ├── index.ts (named exports — tree-shake 친화)
│   └── ... (Spike에서 추출한 모듈·또는 placeholder)
└── dist/ (build output·gitignored)
```

### post-hardening (Week 3+ 또는 packages 안정화 후)

```
packages/<name>/
├── package.json (exports map: "." + sub-path·실 dist 파일 존재 시에만)
├── tsconfig.json + tsconfig.build.json (test·dev exclude)
├── src/
├── tests/ (vitest unit test)
├── README.md
└── dist/
```

**중요**: sub-path exports는 실 dist 파일이 emit되는 module만 추가. placeholder 단계에서는 사용 금지 (consumer가 import 시 missing module).

### Package-level 분류 (cycle3 cascade·PKG2-001)

- **non-placeholder package** (실 코드·dist 파일 emit): sub-path exports 허용
  - `@glitzy/db` (cycle 1부터 실 코드·`./tenant`·`./service-role`·`./advisory-lock`·`./errors` exports 모두 실 파일 존재)
  - `@glitzy/shared-types`·`@glitzy/shared-errors`: 단일 `"."` export만 (sub-path 불필요)
- **placeholder package** (`src/index.ts: export {}` 만): `"."`만 노출
  - `@glitzy/auth`·`@glitzy/storage`·`@glitzy/notifications-outbox`·`@glitzy/migrations-runner`
  - Spike 코드 복사 cycle (cycle 3+) 후 sub-path exports 추가

### exports map (package.json)

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./schema": { "types": "./dist/schema.d.ts", "import": "./dist/schema.js" }
  }
}
```

복수 sub-path export로 tree-shake·types-only entry 분리.

## build 도구

**tsc only** (v0.1):
- 단순·외부 의존성 적음
- declaration·sourceMap 자동
- watch 모드 지원
- 향후 tsup·rollup·esbuild 도입 시 점진 migration 가능

## tsconfig project references

`tsconfig.base.json` (root):
```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "strict": true, "noUncheckedIndexedAccess": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "declaration": true, "declarationMap": true
  }
}
```

각 package `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src", "composite": true },
  "include": ["src/**/*.ts"],
  "references": [{ "path": "../shared-types" }, { "path": "../shared-errors" }, ...]
}
```

root build:
```bash
pnpm -r --filter "@glitzy/*" build
```

## migration 통합 (cycle2 명시·SPIKEC PKG1-003 cascade)

각 package는 자체 `migrations/` 디렉토리·**4-digit numbering으로 cross-package ordering** + **package-level dependency manifest** 병행:

```
packages/<pkg>/migrations/
  ├── <PKG-PREFIX><4-digit-seq>_<description>.sql
  └── manifest.json (depends_on: ["<pkg-a>", "<pkg-b>"]·order: 1-N)
```

### Numbering & prefix

- `packages/db/migrations/D0001_roles_extensions.sql·D0002_audit_log.sql·...`
- `packages/auth/migrations/A0001_admin_user.sql·A0002_session.sql·...`
- `packages/storage/migrations/S0001_blob_metadata.sql·...`
- `packages/notifications-outbox/migrations/N0001_outbox.sql·N0002_inbox.sql·...`

### Cross-package dependency manifest

각 package `migrations/manifest.json`:
```json
{
  "package": "@glitzy/auth",
  "depends_on": ["@glitzy/db"],
  "migrations": [
    { "file": "A0001_admin_user.sql", "depends_on_files": ["@glitzy/db/D0001_roles_extensions.sql"] },
    { "file": "A0002_session.sql", "depends_on_files": ["A0001_admin_user.sql"] }
  ]
}
```

### migrations-runner integration

`@glitzy/migrations-runner`가 모든 package manifest를 topological sort·dependency 순서 보장·`migration_ledger`에 통합 기록:
- `package` column (예: `@glitzy/db`)
- `file` column (예: `D0001_roles_extensions.sql`)
- 통합 sequence number (cross-package monotonic)

apps/web·apps/worker는 단일 `pnpm migrate:apply` 명령으로 모든 package migration 통합 apply. cycle 2+에서 migrations-runner 실 구현.

## SoT cascade

- DATA_MODEL v0.24 → packages/db schema·packages/auth schema·packages/notifications-outbox schema 분산
- REVIEW_WORKFLOW state machine → packages/auth 또는 별도 packages/review-workflow (Phase 0 Week 5)
- CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON·SCHEMA_MAPPING·SEARCH_STANDARDIZATION → packages/content-standards·packages/compliance·packages/schema-mapping·packages/search (Phase 0 Week 4)
- DESIGN_TOKENS → packages/design-tokens (Style Dictionary build·Week 5)

본 문서는 **Phase 0 Week 2 시작 시점의 5 core package** (db·auth·storage·notifications-outbox·migrations-runner) + 2 supporting (shared-types·shared-errors) 만 다룬다. Week 4~6에 추가 packages 분리.

## acceptance gate (v0.1)

- 모든 package `pnpm build` PASS (tsc declaration emit)
- 모든 package `pnpm typecheck` PASS (strict·noUncheckedIndexedAccess)
- 의존성 cycle 없음 (madge·또는 manual)
- exports map 명시·tree-shake 가능
- apps/spike-* LOCAL_PASS regression test (package import 후 동일 PASS): **cycle 3+ deferred** — 본 v0.1·v0.2는 build/typecheck PASS만 측정·실 코드 복사 cycle에서 regression 검증
