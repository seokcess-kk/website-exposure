# Spike C local prototype 코드 — codex 자동 비평 cycle 5

동일 reviewer. cycle 4 결과 (closed: 3·remaining: 4·신규 major: 5·minor: 2)에 대한 v0.5 patch.

## cycle 4 결과 (SoT)

closeable_after_patch: false.
closed: SPIKEC3-005·006·SPIKEC2-001.
remaining: SPIKEC2-002/3-002·SPIKEC2-003/3-003·SPIKEC2-004/3-004·SPIKEC2-006/1-006/1-011.
new major (5): SPIKEC4-001~005.
new minor (2): SPIKEC4-006·007.
new blocking: 0.

## v0.5 patch 요약

### 1. SPIKEC4-001: typecheck scripts·build wiring

```json
// package.json scripts
"typecheck:prod": "tsc --noEmit -p tsconfig.json",
"typecheck:scenarios": "tsc --noEmit -p tsconfig.scenarios.json",
"typecheck:all": "pnpm typecheck:prod && pnpm typecheck:scenarios",
"build": "tsc -p tsconfig.json",
"scenario:all:strict": "cross-env STRICT_LOCAL_PASS=1 pnpm scenario:all"

// devDependencies
"cross-env": "^7.0.3"
```

production build (`pnpm build`)는 `tsconfig.json`을 사용 (scenarios exclude). scenarios typecheck은 별도 `tsconfig.scenarios.json`.

### 2. SPIKEC4-002 / SPIKEC2-002 / SPIKEC3-002: RefreshPolicy top-level null/non-object

```ts
function validateRefreshPolicy(policy: unknown): asserts policy is RefreshPolicy {
  // null·primitive·Array 차단 — graceMs deref 전
  if (policy === null || typeof policy !== "object") {
    throw new RefreshRejectedError("invalid-policy", `policy must be non-null object, got ${policy === null ? "null" : typeof policy}`);
  }
  if (Array.isArray(policy)) {
    throw new RefreshRejectedError("invalid-policy", `policy must be plain object, got Array`);
  }
  const p = policy as Record<string, unknown>;
  // graceMs/requireRefreshAtReached 기존 검증
  ...
}
```

`test-replay.ts` INVALID_POLICIES에 신규:
- `policy null`
- `policy string primitive`
- `policy number primitive`
- `policy array`

기존 graceMs NaN/Infinity/negative/non-integer/over-MAX·requireRefreshAtReached non-boolean과 합쳐 총 10개 invalid case.

### 3. SPIKEC4-003 / SPIKEC2-003 / SPIKEC3-003: HEAD↔GET 일관 정정

- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md § C.2-4` (이미 cycle 4 patch) — empirical-provider-behavior 표현
- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md § C.3 표` cycle5 추가 patch — `method confusion` row를 `HEAD↔GET interop은 empirical-provider-behavior — informational only·실 정책은 PROVIDER_GATE에서 R2 동작 실측 후 SoT cascade`로 변경
- `test-method-confusion.ts` case 5 주석/출력 cycle5 patch — `canonical signature`·`provider 표준` 표현 제거, `empirical-provider-behavior (informational only)`로 변경, 출력은 `4 enforced PASS + 1 informational recorded`

### 4. SPIKEC4-004 / SPIKEC2-006 / SPIKEC1-006 / SPIKEC1-011: assertProviderDeny clientError throw

```ts
function assertProviderDeny(label, r, expectedStatuses): void {
  if (r.clientError) {
    throw new Error(`client-side rejection ('${r.clientError}') — provider never received request, cannot verify provider deny. PROVIDER_GATE 필수.`);
  }
  // ... 기존 status·awsCode assert
}
```

content-type case 2 (mismatched CT)·3 (missing CT)에서 client-side rejection이 PASS로 간주되지 않음 — provider 미도달 시 throw.

case 4 (content-length)는 별도 INCONCLUSIVE marker 처리 유지 — 본 결함은 minio·R2 차이를 명시한 case이므로.

### 5. SPIKEC4-005 / SPIKEC2-004 / SPIKEC3-004: STRICT_LOCAL_PASS=1 machine-enforced

```ts
const STRICT_LOCAL_PASS = process.env.STRICT_LOCAL_PASS === "1";

// case-4 INCONCLUSIVE 시
if (STRICT_LOCAL_PASS) {
  throw new Error(`STRICT_LOCAL_PASS=1: content-length INCONCLUSIVE — PROVIDER_GATE 미충족, LOCAL_PASS 인정 불가`);
}
```

`pnpm scenario:all:strict` → `cross-env STRICT_LOCAL_PASS=1 pnpm scenario:all` → INCONCLUSIVE 시 exit 1.

### 6. SPIKEC4-006 (minor): method-confusion 출력 정정

`4 enforced + 1 informational PASS` → `4 enforced PASS + 1 informational recorded`

### 7. SPIKEC4-007 (minor): R2 doc URL markdown link

```diff
- R2 공식 문서 (developers.cloudflare.com/r2/api/s3/presigned-urls/)는 GET/PUT/HEAD/DELETE를 별도 operation으로 명시.
+ [Cloudflare R2 presigned URL docs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)는 GET/PUT/HEAD/DELETE를 별도 operation으로 명시 (각 operation을 명시 발급해야 함). [AWS SigV4 canonical request spec](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html)은 HTTPMethod를 canonical에 포함.
```

## 누적 close 누적

| cycle | new | close | cum_close | remaining |
|---|---|---|---|---|
| 1 | 12 | — | — | 12 |
| 2 | 6 | 10 | 10 | 8 |
| 3 | 7 | 1 | 11 | 14 |
| 4 | 7 | 3 | 14 | 18 |
| **5 (예상)** | ? | **all 18 close** | **32 / 32** | **0** |

## cycle 5 검토 관점

cycle 1~4 누적 18 remaining이 v0.5에서 모두 closeable인가? 새 결함 발견?

특별 검토:
1. **typecheck:prod·scenarios 분리 충분성**: production build 시 dist 디렉토리에 `src/scenarios/*` 미포함 — 실 검증 필요 (`pnpm build` 후 dist 트리)
2. **RefreshPolicy 10 invalid case**: undefined를 빼버린 것이 회피인가? — undefined는 default policy로 대체되므로 invalid case가 아님. 명시 가능
3. **HEAD↔GET 일관성**: docs/code 모든 곳에서 empirical-provider-behavior 표현으로 통일되었나
4. **clientError throw**: 기존 case 4 (length mismatch INCONCLUSIVE)와 case 2·3 (CT throw) 일관성 정합
5. **STRICT_LOCAL_PASS=1 정확성**: env 미설정·"0"·"1"·"true"·"false" 처리 정확
6. **cross-env dependency**: pnpm install 시 정상 설치 가능·Windows PowerShell 호환
7. **markdown link**: 클릭 가능·doc reader가 reference로 인식

만약 신규 결함 발견 시:
- blocking: closeable_after_patch=false
- major: 가능한 한 false·근거 명시
- minor: false 또는 true (acceptance에 영향 없음)

신규 결함 0이고 누적 remaining 0이면 closeable_after_patch=true.

## 평가 형식

```json
{
  "cycle": 5,
  "closeable_after_patch": true | false,
  "previous_cycle_closed_findings": [모든 close된 ID 나열],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "converged / not converged + 근거",
  "next_cycle_focus": "추가 cycle 6이 필요한가·acceptance 가능한가"
}
```
