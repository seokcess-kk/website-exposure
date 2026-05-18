# packages 실 코드 추출 v0.4 — codex 자동 비평 cycle 3

동일 reviewer. cycle 2 결과 (closed: 5·remaining: 2 blocking·신규 major: 1·minor: 1) 에 대한 v0.4 patch.

## cycle 2 결과

closed (5): M1·M2·M3·m1·m2.
remaining (2 blocking): B1·B2.
new major (1): session-expired vs session-not-found distinction lost.
new minor (1): markExhausted index.ts export 누락.

## v0.4 patch

### B1 cycle3: notifications-outbox Spike B 실 schema 정합
- columns: `last_error`·`last_error_class` ('transient'|'permanent'·CHECK 정합)·`completed_at`·`exhausted_at`
- `permanent_failure_reason` 제거
- claim 시 `attempts = attempts + 1` (Spike B 패턴)·markRetry는 증가 안 함
- markRetry: status CASE WHEN attempts >= max_attempts THEN 'exhausted' ELSE 'pending' END·exhausted_at도 CASE WHEN·`last_error_class='transient'`
- markFailedPermanent: `last_error_class='permanent'`
- markCompleted: `completed_at = now()` 추가
- markExhausted 제거 (markRetry가 exhausted 자동 전이)
- claim RETURNING: `last_error`·`last_error_class` 추가
- reclaimStale: `${`${staleAfterMs} milliseconds`}::interval` 정합

### B2 cycle3: session API internal/public 분리
- 신규 `packages/auth/src/internal/session-internal.ts`: refreshSessionByDbToken·revokeSessionByDbToken·switchSuperAdminInstanceByDbToken
- `packages/auth/src/session.ts`: PUBLIC만 (signed token receive)
- `package.json` exports: `./session` (PUBLIC만)·`./internal/*` 미노출
- `resolve-tenant-context.ts`: refreshSessionByDbToken을 internal에서 import

### Major cycle3: session-expired vs session-not-found 보존
```ts
try {
  session = await getActiveSession(sql, cfg, signedToken);
} catch (err) {
  const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  // audit emit with specific reason
  if (err instanceof AuthDeniedError) {
    throw new TenantResolveError(err.reason, err.message);  // 동일 reason 유지
  }
  throw new TenantResolveError("session-not-found", "session invalid");
}
```

### Minor cycle3: OutboxStatus·LastErrorClass index.ts export 추가
markExhausted 자체는 제거 (markRetry가 자동 처리)·type exports 추가.

## v0.4 build + typecheck

`pnpm pkg:typecheck` 7 packages 모두 PASS.

## cycle 3 검토 관점

1. **outbox Spike B 정합**: 모든 column·status enum·CHECK constraint·attempts timing·claim의 attempts++가 apps/spike-b/src/outbox.ts와 정확 일치
2. **session API boundary**: ./session sub-path는 PUBLIC만·./internal/session-internal은 export map에 미노출·외부 consumer는 import 불가
3. **session-expired 보존**: resolveTenantContext가 expired·not-found·signature-invalid 각각의 reason 유지

cycle 1·2 누적 9개 결함 모두 close?

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
