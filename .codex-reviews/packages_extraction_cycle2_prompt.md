# packages 실 코드 추출 v0.3 — codex 자동 비평 cycle 2

동일 reviewer. cycle 1 (blocking 2·major 3·minor 2) 에 대한 v0.3 patch.

## cycle 1 결과

closeable: false.
blocking: B1 (notifications-outbox Spike B schema 불일치)·B2 (session token boundary).
major: M1 (storage UUID v4 strict)·M2 (deny reason taxonomy)·M3 (state transition guard).
minor: m1 (resendMode marker)·m2 (refreshSignedUrl TTL preserve).

## v0.3 patch

### B1: notifications-outbox Spike B schema 정합
- status: `'pending' | 'processing' | 'completed' | 'exhausted' | 'failed-permanent'`
- columns: `attempts`·`max_attempts`·`next_attempt_at`·`locked_at`·`locked_by`·`permanent_failure_reason`
- claim·markCompleted·markRetry·markFailedPermanent·markExhausted·reclaimStale 모두 Spike B SQL과 정합

### B2: session API hardening
- `refreshSession(sql, cfg, signedToken)` — PUBLIC·signature verify + hash → DB mutation
- `refreshSessionByDbToken(sql, cfg, dbSessionToken)` — INTERNAL (package only·resolveTenantContext에서 ctx.sessionToken 직접 전달)
- `revokeSession`·`switchSuperAdminInstance` 동일 패턴 (PUBLIC + ByDbToken)
- caller가 signed token 전달 시 정확히 동작·dbSessionToken 직접 전달은 internal API에서만

### M1: storage UUID v4 strict
```ts
import { UUID_V4_REGEX } from "@glitzy/shared-types";
const UUID_REGEX = UUID_V4_REGEX;
```
auth와 동일 regex 사용.

### M2: AuthDenyReason 확장
```ts
type AuthDenyReason = ... | "physician-reviewer-ineligible" | "client-approver-ineligible" | "operator-role-required" | "invalid-instance-id" | ...;
```
- physician·client·operator·instance-id 모두 specific reason
- resolve-tenant-context의 throw·assertActionEligibility throw 모두 specific reason 사용

### M3: outbox state transition guard
```ts
markCompleted(sql, outboxId, workerId): RETURNING id 비어있으면 OutboxClaimRaceError
markRetry / markFailedPermanent / markExhausted: status='processing' AND locked_by=workerId guard
reclaimStale: locked_by 검사 안 함 (stale 복구는 worker-agnostic)
```

### m1: resendMode 명시
`"mock" | "suppress-mock"` — 실 Resend API delivery는 별도 mail adapter (v0.3+)

### m2: refreshSignedUrl TTL preserve
- `SignedUrlResult`에 `ttlSeconds: number` 추가
- `refreshSignedUrl`이 `previous.ttlSeconds` 그대로 전달

## v0.3 build + typecheck PASS

`pnpm pkg:typecheck` 7 packages 모두 PASS.

## cycle 2 검토 관점

1. **Spike B schema 정합**: outbox.ts의 status enum·column names가 apps/spike-b/migrations와 정확히 일치
2. **session API boundary**: PUBLIC (signed) vs INTERNAL (dbToken) 명확 분리·caller misuse 차단
3. **UUID consistency**: storage·auth 양쪽 UUID_V4_REGEX 사용
4. **deny reason precision**: 각 reject 시 정확한 reason·downstream 처리 가능
5. **outbox claim race guard**: stale worker가 reclaim된 row update 불가
6. **resendMode 명시**: "mock" vs "suppress-mock"·delivery는 별도 adapter
7. **refreshSignedUrl TTL**: 동일 TTL 유지

cycle 1 7개 결함 모두 close?

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
