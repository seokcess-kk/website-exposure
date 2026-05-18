# packages 실 코드 추출 v0.5 — codex 자동 비평 cycle 4 (acceptance scope)

동일 reviewer. cycle 3 결과 (closed: 7·remaining: 1 blocking·new major: 1) 에 대한 v0.5 micro patch.

## cycle 3 결과

closed (7): M1·M2·M3·m1·m2·B2·OutboxStatus minor.
remaining (1 blocking): B1 (claim ORDER BY).
new major (1): session-signature-invalid taxonomy.

## v0.5 patch (micro)

### B1 cycle4: claim ORDER BY next_attempt_at
```sql
WHERE id = (
  SELECT id FROM outbox
  WHERE status = 'pending' AND next_attempt_at <= now()
  ORDER BY next_attempt_at
  FOR UPDATE SKIP LOCKED LIMIT 1
)
```
Spike B 패턴과 정확 일치 — 가장 오래된 due job 우선 처리·deterministic.

### Major cycle4: session-signature-invalid AuthDenyReason 추가
```ts
type AuthDenyReason = ... | "session-not-found" | "session-expired" | "session-signature-invalid" | ...;
```
session.ts의 4 곳 (getActiveSession·refreshSession·revokeSession·switchSuperAdminInstance) signature 검증 실패 시 `session-signature-invalid` reason throw.
resolveTenantContext가 보존 — expired·not-found·signature-invalid 모두 distinct.

## v0.5 build + typecheck PASS

## cycle 4 검토 관점

1. **ORDER BY 정합**: Spike B와 정확 일치·deterministic claim
2. **AuthDenyReason 17종**: expired·not-found·signature-invalid 모두 별도

cycle 1·2·3 누적 11개 결함 모두 close?·신규 0이면 closeable·acceptance.

## 평가 형식

```json
{
  "cycle": 4,
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
