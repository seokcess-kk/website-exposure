# Spike E local prototype 코드 — codex 자동 비평 cycle 5

동일 reviewer. cycle 4 결과 (closed: 3·remaining: 3 blocking 2·major 1) 에 대한 v0.5 patch (narrow).

## cycle 4 결과

closed (3): SPIKEE3-001·SPIKEE1-005·SPIKEE3-003.
remaining (3):
- SPIKEE1-006 blocking: ActionType startsWith() exhaustive 실패·strict tsc fail
- SPIKEE1-007 blocking: validateInstanceId trim 후 regex·newline 등 통과
- SPIKEE3-002 major: FK length check 부재

## v0.5 patch (narrow)

### 1. SPIKEE1-006: switch/case exhaustive
```ts
switch (action) {
  case "legal-review-approve":
  case "legal-review-reject":
  ... (4 legal)
    if (!ctx.user.legal_reviewer_eligible) throw ...
    return;
  case "physician-review-approve": ... (4 physician)
  case "client-approval-approve": ... (3 client)
  case "operator-publish": ... (3 operator)
  default: const _exhaustive: never = action; throw ...
}
```
TypeScript는 switch exhaustive narrowing 완전 지원·`_exhaustive: never` 정상 작동.

### 2. SPIKEE1-007: trim 제거
```ts
function validateInstanceId(value: unknown): string {
  if (typeof value !== "string") throw ...;
  if (!UUID_REGEX.test(value)) throw ...;  // 원문 strict·trim 안 함
  return value.toLowerCase();
}
```
newline·whitespace embed 모두 regex로 reject (UUID_REGEX는 anchored ^$).

### 3. SPIKEE3-002: FK length === 1 강제
```ts
if (fkSpec.length !== 1) throw new Error("session must have exactly 1 FK");
const fkOnly = fkSpec[0]!;
if (fkOnly.src_col !== "userId" || fkOnly.ref_table !== "admin_user" || fkOnly.ref_col !== "id") throw ...;
```
extra FK 시 detect.

## cycle 5 검토 관점

1. **switch exhaustive**: 모든 15 ActionType 명시·strict tsc `never` 좁히기 정상
2. **trim 제거**: newline·whitespace embed UUID 모두 reject·시나리오 case 검증
3. **FK length**: session 테이블 추가 FK가 들어가면 detect (변경된 migration 시뮬레이션)

cycle 1·2·3·4 누적 결함 모두 close 가능?

## 평가 형식

```json
{
  "cycle": 5,
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
