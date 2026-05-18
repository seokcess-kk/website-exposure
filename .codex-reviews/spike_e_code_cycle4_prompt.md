# Spike E local prototype 코드 — codex 자동 비평 cycle 4

동일 reviewer. cycle 3 (closed mostly·remaining 6 (일부 partial)·신규 blocking 1·major 1·minor 1) 에 대한 v0.4 patch.

## cycle 3 결과 (SoT)

- closed mostly: SPIKEE1-001 (RLS table·POLICY·SET LOCAL ROLE)·010 (SoT cascade)
- partial: 003 (FK exact-column)·005 (CHECK violation test 없음)·007 (nil/v1/v7 negative case 없음)
- not closeable: 006 (typecheck broken — '*-decision' literals)
- new blocking (1): SPIKEE3-001 — test-action-eligibility가 제거된 'legal-review-decision' 등 사용
- new major (1): SPIKEE3-002 — FK column-specific 부재
- new minor (1): SPIKEE3-003 — UUID negative cases 부족

## v0.4 patch (narrow)

### 1. SPIKEE3-001 + SPIKEE1-006: test-action-eligibility 15 action enumeration
- `ALL_ACTIONS: ActionType[]` 15종 (legal-review-{4}·physician-review-{4}·client-approval-{3}·operator-{3})
- Carol no-eligibility: 11 reviewer actions all reject·3 operator actions PASS
- Dave legal-eligible: 4 legal-review-* PASS·다른 11 reject
- Carol fully promoted: all 15 PASS
- TypeScript ActionType strict union·typecheck PASS

### 2. SPIKEE3-002 + SPIKEE1-003: FK column-specific
```sql
SELECT a.attname AS src_col, cl2.relname AS ref_table, a2.attname AS ref_col
FROM pg_constraint con
JOIN pg_class cl ON con.conrelid = cl.oid
JOIN pg_class cl2 ON con.confrelid = cl2.oid
JOIN pg_attribute a ON a.attrelid = cl.oid AND a.attnum = con.conkey[1]
JOIN pg_attribute a2 ON a2.attrelid = cl2.oid AND a2.attnum = con.confkey[1]
WHERE con.contype = 'f' AND cl.relname = 'session'
```
session."userId" → admin_user.id 정확히 검증 (column-level FK match).

### 3. SPIKEE3-003 + SPIKEE1-007: UUID negative cases
test-invalid-instance-id에 4 케이스 추가:
- nil UUID (all-zero)
- v1 UUID (version=1)
- v7 UUID (version=7)
- non-RFC variant (c-nibble at pos 20)
모두 strict v4 regex로 reject 검증.

### 4. SPIKEE1-005: deactivated_by_user_id CHECK violation cases
test-membership-removal 7 cases:
- case 6: UPDATE active=false, deactivated_at=now(), deactivated_by_user_id=NULL → CHECK violation
- case 7: UPDATE active=true, deactivated_at=now() → CHECK violation

## cycle 4 검토 관점

1. **typecheck PASS**: ActionType 15종·test-action-eligibility import compiles·tsc strict
2. **FK column-specific**: src_col, ref_col 정확 검증·wrong FK or extra FK 시 detect
3. **UUID v4 strict**: nil·v1·v7·non-RFC variant 모두 reject
4. **CHECK constraint violation**: deactivated_by_user_id NOT NULL when active=false·active+deactivated_at 동시 NOT NULL 모두 reject
5. **누적 close**: cycle 1·2·3 누적 11개 결함 모두 close 가능?

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
