# Spike C local prototype 코드 — codex 자동 비평 cycle 3

동일 reviewer. cycle 2에서 신규 발견 blocking 1·major 4·minor 1 + cycle 1 remaining 2 (006·011)에 대한 v0.3 patch를 검토하라.

## cycle 2 결과 (SoT)

closeable_after_patch: false. cycle 1 12개 중 10 close·2 remaining (006·011). 신규 6개:
- **SPIKEC2-001 (blocking)**: `_issueShortTtlForExpiryTest`가 production module 노출 — test-only 격리 부족
- **SPIKEC2-002 (major)**: refreshSignedUrl 만료 후 무기한 refresh — policy 없음
- **SPIKEC2-003 (major)**: HEAD→GET URL 200을 PASS로 처리 — C.3 100% block과 충돌
- **SPIKEC2-004 (major)**: content-length mismatch client-side block을 LOCAL acceptable — provider gate 의미 약화
- **SPIKEC2-005 (major)**: ListBucket credential test가 own/cross prefix만 — empty/root prefix 미검증
- **SPIKEC2-006 (minor)**: SoT C.3 표가 v0.2 코드와 drift

## cycle 3에서 적용한 v0.3 patch 요약

### 1. SPIKEC2-001: `_issueShortTtlForExpiryTest` production module 제거 → scenario inline

`sign-url.ts`에서 helper 완전 제거. `test-replay.ts`에 `_localShortTtlIssue` private 함수로 inline:

```ts
// test-replay.ts 내부 정의 — production code path import 불가
async function _localShortTtlIssue(client, ctx, objectKey, ttlSeconds) {
  assertObjectKeyForInstance(ctx, objectKey);  // tenant guard 강제
  const command = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: objectKey });
  const url = await getSignedUrl(client, command, { expiresIn: ttlSeconds });
  return { url, method: "GET", objectKey, ... };
}
```

### 2. SPIKEC2-002: RefreshPolicy 명문화

`sign-url.ts`:
```ts
export type RefreshPolicy = {
  readonly graceMs: number;
  readonly requireRefreshAtReached: boolean;
};
export const DEFAULT_REFRESH_POLICY = { graceMs: 0, requireRefreshAtReached: false };
export class RefreshRejectedError extends Error {
  override readonly name = "RefreshRejectedError";
  constructor(public readonly code: "expired" | "premature", message) { super(message); }
}

export async function refreshSignedUrl(client, previous, ctx, policy = DEFAULT_REFRESH_POLICY) {
  const now = Date.now();
  if (now > previous.expiresAt + policy.graceMs) {
    throw new RefreshRejectedError("expired", ...);
  }
  if (policy.requireRefreshAtReached && now < previous.refreshAt) {
    throw new RefreshRejectedError("premature", ...);
  }
  return issueSignedUrl(client, { ctx, objectKey: previous.objectKey, ... });
}
```

`test-replay.ts` case 8·9·10 추가:
- case 8: 만료된 URL refresh → `RefreshRejectedError('expired')`
- case 9: requireRefreshAtReached=true·refreshAt 도래 전 → `premature`
- case 10: graceMs=5000으로 만료 후 짧은 시간 허용

### 3. SPIKEC2-003: HEAD↔GET SoT 명시 제외

SoT cascade (`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § C.2-4):
> HEAD↔GET signature interop: AWS S3·minio·R2 모두 HEAD/GET이 동일 canonical signature — 동일 URL 양방향 허용은 provider 표준 동작이므로 method confusion 범위에서 명시 제외 (별도 HEAD signed URL은 발급하지 않고 GET URL로 HEAD 요청만 검증)

`test-method-confusion.ts` case-5: informational only·assert 안 함.

```
✅ test-method-confusion: 4 enforced + 1 informational PASS
```

### 4. SPIKEC2-004: content-length LOCAL_CLIENT_BLOCKED marker

`test-content-type.ts` case-4:
- node fetch 자동 재계산으로 정확한 mismatch 주입 제한적
- client-side rejection: `LOCAL_CLIENT_BLOCKED` marker — PROVIDER_GATE에서 raw HTTP 재검증 필수
- provider 도달 경우만 awsCode assert (정확한 PROVIDER_DENIED)

```
✅ test-content-type: 3 enforced + 1 LOCAL_CLIENT_BLOCKED/PROVIDER_GATE PASS
```

### 5. SPIKEC2-005: ListBucket credential empty/root/partial deny

`test-list-bucket.ts` 신규 cred-neg cases 5개:
```ts
CRED_NEGATIVE_CASES: ReadonlyArray<{label, prefix}> = [
  { label: "prefix empty ''", prefix: "" },
  { label: "prefix root 'instances/'", prefix: "instances/" },
  { label: "prefix partial 'instances/aaa...'", prefix: "instances/aaaaaaaa" },
  { label: "prefix other namespace 'other/'", prefix: "other/" },
  { label: "prefix B without trailing slash", prefix: `instances/${INSTANCE_B_ID}` },
];

// 각 case: clientA로 listWithClient(prefix) → httpStatus === 403 && keys.length === 0
```

```
✅ test-list-bucket: app-layer 3 + cred-layer 3 + cred-neg 5 = 11 cases PASS
```

### 6. SPIKEC2-006: SoT C.3 표 갱신 (drift 수정)

C.3 표를 v0.3 코드 상태와 정합:

| 검증 | 기준 | local 검증 |
|---|---|---|
| prefix isolation | cross-instance 100% block·22 negative table | LOCAL_FULL |
| method confusion | GET URL PUT/DELETE·PUT URL GET 401/403·**HEAD↔GET interop SoT 제외** | LOCAL_FULL |
| content-type 불일치 | minio 실측·**R2 동등성 PROVIDER_GATE** | LOCAL_SMOKE + PROVIDER_GATE |
| content-length 불일치 | node fetch 한계·**raw HTTP는 PROVIDER_GATE** | LOCAL_CLIENT_BLOCKED |
| ListBucket credential | per-instance policy (own 200·cross 403·empty/root/partial 403 — 5 case)·**R2 IAM PROVIDER_GATE** | LOCAL_SMOKE + PROVIDER_GATE |
| range out-of-range | 416 명시 assert·overlap-end 206 | LOCAL_FULL |
| URL audit log | 9 string field·1~2 URL decode·14 pattern·positive 5 + negative 11 | LOCAL_FULL |
| TTL·refresh policy | default 600/60·max 86400·RefreshPolicy(graceMs·requireRefreshAtReached) | LOCAL_FULL |
| invariant runner | TenantPrefixMismatchError만 deny·unexpectedError 즉시 fail | LOCAL_FULL |

### 7. cycle 1 remaining (006·011)

이미 v0.2에서 awsCode assert 추가됨. v0.3에서 LOCAL_CLIENT_BLOCKED marker 명시화·PROVIDER_GATE marker 강화 완료.

## 본 cycle 3 검토 관점

cycle 2의 6개 결함이 v0.3에서 모두 closeable 상태로 patch 되었는지·새 결함 발견.

특별히 주의:
1. **test-replay의 inline helper 위치**: scenario 안 정의로 production import 불가 — but scenario 자체가 dist에 빌드되면? .gitignore·tsconfig include 확인
2. **RefreshPolicy 완성도**: graceMs 음수·매우 큰 값·NaN·membership 변경 후 refresh 검증 누락
3. **HEAD↔GET SoT 결정의 타당성**: provider 표준 동작 주장이 맞는지·R2/minio/S3 모두 동일한지 (인용 부재)
4. **content-length PROVIDER_GATE marker의 acceptance 영향**: LOCAL_CLIENT_BLOCKED는 PASS인가? 의미상 약함
5. **ListBucket cred-negative 5 case 충분성**: Prefix 빈 string null·매우 긴·special char·case·UTF-8 변형 등 추가 회피 path
6. **SoT C.3 표 갱신 후 다른 곳 drift**: C.4-provider·C.6 downstream과 정합성
7. **error class import**: `RefreshRejectedError`가 errors.ts에 없음 — sign-url.ts에 정의됨. errors.ts로 옮기는 것이 맞는가? (cohesion)
8. **invariant runner crypto.randomUUID()**: node 19+ 필요·node 20 LTS OK

## 평가 형식

```json
{
  "cycle": 3,
  "closeable_after_patch": false | true,
  "previous_cycle_closed_findings": ["SPIKEC2-001", ...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [...],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

수렴 추세 self-report 필수. closeable_after_patch true 시 명확한 근거.
