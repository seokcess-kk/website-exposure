# Spike C local prototype 코드 — codex 자동 비평 cycle 4

동일 reviewer. cycle 3 결과 (closed: 1·remaining: 7·신규 major: 5·minor: 2) 에 대한 v0.4 patch.

## cycle 3 결과 (SoT)

closeable_after_patch: false.
closed: SPIKEC2-005 (ListBucket cred-negative).
remaining: SPIKEC2-001·002·003·004·006·SPIKEC1-006·011 (7개).
new major (5): SPIKEC3-001~005.
new minor (2): SPIKEC3-006 (error class location)·SPIKEC3-007 (tsc verification — informational).

## cycle 4 v0.4 patch 요약

### 1. SPIKEC3-001: scenarios production build 제외

```json
// tsconfig.json (production build)
{
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "src/scenarios/**/*.ts"]
}

// tsconfig.scenarios.json (테스트 시 type check 용)
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

production tsc 빌드 시 scenarios 제외 — `_localShortTtlIssue`가 emit되지 않음. 시나리오 type check은 별도 tsconfig.scenarios.json으로.

### 2. SPIKEC3-002: RefreshPolicy hard validation

```ts
export const MAX_REFRESH_GRACE_MS = 60 * 60 * 1000; // 1 hour cap

function validateRefreshPolicy(policy: RefreshPolicy): void {
  if (!Number.isFinite(policy.graceMs) || !Number.isInteger(policy.graceMs)) {
    throw new RefreshRejectedError("invalid-policy", `graceMs must be finite integer`);
  }
  if (policy.graceMs < 0) {
    throw new RefreshRejectedError("invalid-policy", `graceMs must be non-negative`);
  }
  if (policy.graceMs > MAX_REFRESH_GRACE_MS) {
    throw new RefreshRejectedError("invalid-policy", `graceMs exceeds MAX`);
  }
  if (typeof policy.requireRefreshAtReached !== "boolean") {
    throw new RefreshRejectedError("invalid-policy", `requireRefreshAtReached must be boolean`);
  }
}

export async function refreshSignedUrl(client, previous, ctx, policy = DEFAULT_REFRESH_POLICY) {
  validateRefreshPolicy(policy);  // 신규
  // ... 기존 logic
}
```

`RefreshRejectedError` code union 확장: `"expired" | "premature" | "invalid-policy"`.

`test-replay.ts` Case 11.1~11.6: invalid policy 6 case (NaN·Infinity·negative·non-integer·over MAX·non-boolean) → all `invalid-policy` reject.

### 3. SPIKEC3-003: HEAD↔GET SoT empirical-provider-behavior로 표현 변경

`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § C.2-4 수정:

> HEAD↔GET 처리는 empirical-provider-behavior에 의존: AWS SigV4 canonical request에는 HTTPMethod가 포함되어 엄밀히 method-bound이지만, 실 provider (S3·minio) 일부는 HEAD를 GET signed URL에 대해 허용하기도 함. R2 공식 문서는 GET/PUT/HEAD/DELETE를 별도 operation으로 명시. 본 spike는 case-5를 informational only로 두고, 실 정책은 C-provider gate에서 R2 동작 실측 후 결정·provider 결과에 따라 application-layer에서 HEAD를 별도 발급하는지 또는 GET URL과 공유 허용할지 SoT cascade.

이전 잘못된 "canonical-signature equivalence" 주장 제거.

### 4. SPIKEC3-004: content-length INCONCLUSIVE marker

`test-content-type.ts` case-4:
- `case4Status: "PROVIDER_DENIED" | "INCONCLUSIVE" | "FAIL"`
- `clientError` → INCONCLUSIVE (PASS 미선언)·provider 도달 + awsCode 검증 → PROVIDER_DENIED
- INCONCLUSIVE 시 console: `⚠️  3 enforced PASS + 1 INCONCLUSIVE (PROVIDER_GATE 필수)`
- exit code 0 유지 (다른 case 모두 PASS)하지만 출력 명시 — local PASS는 provider gate 만족 아님.

### 5. SPIKEC3-005: C.2 § 6 ListBucket SoT drift 정정

```diff
- 6. **ListBucket — LOCAL_STUB**: minio root credential은 ListBucket 전체 가능 → application-layer prefix filter helper만 local에서 검증. **credential-level deny는 C-provider R2 IAM Condition gate 필수** — local에서는 `PROVIDER_REQUIRED` marker
+ 6. **ListBucket — LOCAL_SMOKE + PROVIDER_GATE**: minio root credential은 ListBucket 전체 가능 → application-layer prefix filter helper로 own/cross 검증 + minio per-instance user policy (StringLike s3:prefix Condition)로 credential-level smoke (own 200·cross/empty/root/partial 403 — 5 case). **R2 IAM Condition 동등성·STS·credential rotation은 C-provider gate 필수**
```

### 6. SPIKEC3-006 (minor): RefreshRejectedError → errors.ts

```ts
// errors.ts
export class RefreshRejectedError extends Error {
  override readonly name = "RefreshRejectedError";
  constructor(public readonly code: "expired" | "premature" | "invalid-policy", message: string) {
    super(message);
  }
}

// sign-url.ts
import { RefreshRejectedError } from "./errors.js";
export { RefreshRejectedError } from "./errors.js";  // backward compat re-export
```

### 7. SPIKEC3-007 (informational): tsc 미설치 — package.json에 typescript dependency 존재. node_modules가 pnpm install 안 된 환경 — runtime 검증은 LOCAL_PASS gate에서.

## v0.4 핵심 변경 파일

- `apps/spike-c-local/tsconfig.json` — scenarios 제외
- `apps/spike-c-local/tsconfig.scenarios.json` — 신규
- `apps/spike-c-local/src/errors.ts` — RefreshRejectedError 추가
- `apps/spike-c-local/src/sign-url.ts` — validateRefreshPolicy + MAX_REFRESH_GRACE_MS + errors re-export
- `apps/spike-c-local/src/scenarios/test-replay.ts` — invalid policy 6 case 추가
- `apps/spike-c-local/src/scenarios/test-content-type.ts` — INCONCLUSIVE marker
- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § C.2-4·§ C.2-6 — SoT cascade

## cycle 4 검토 관점

1. **production build 격리**: tsconfig exclude가 충분한가? package.json scripts·pnpm 빌드 시 dist에 scenarios 미포함 확인
2. **RefreshPolicy validation 완전성**: graceMs Date object·string·null·undefined·Boolean coercion·BigInt 등 추가 회피
3. **SoT HEAD↔GET 표현 정확성**: empirical-provider-behavior 표현이 reviewer를 만족시키는가·인용 부재 또는 추가 필요
4. **INCONCLUSIVE marker의 의미**: exit code 0이지만 출력만 warning — CI/CD에서 grep로 detect 가능한가·테스트 framework 통합 시 명확한 status code 필요
5. **errors.ts split의 부수 효과**: re-export 사용 시 type narrowing 정상 동작·instanceof 작동
6. **C.2 drift 외 다른 곳**: C.4-provider·C.5 fallback·C.6 downstream과 정합성 재확인
7. **시나리오 카운트 정확성**: 시나리오 시작 시 console에 표시되는 case 카운트가 실제 PASS 카운트와 일치

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

cycle 1/2/3에서 누적된 remaining까지 모두 close되어야 closeable_after_patch true. 신규 발견이 0이면 자연 수렴.
