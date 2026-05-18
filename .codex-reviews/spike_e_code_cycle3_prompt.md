# Spike E local prototype 코드 — codex 자동 비평 cycle 3

동일 reviewer. cycle 2 결과 (closed: 4·remaining: 6·신규 major: 1·minor: 1) 에 대한 v0.3 patch.

## cycle 2 결과 (SoT)

closed (4): SPIKEE1-002·004·008·009.
remaining (6): SPIKEE1-001 (blocking·RLS)·003·005·006·007·010.
new major (1): SPIKEE2-001 — DrizzleAdapter smoke.
new minor (1): SPIKEE2-002 — typecheck sandbox.

## v0.3 patch

### 1. SPIKEE1-001 cycle3: 실 RLS-protected table
- 신규 migration `005_rls_test_table.sql`:
  - `CREATE ROLE app_tenant_user NOLOGIN NOBYPASSRLS`
  - `tenant_data` table + `ENABLE/FORCE ROW LEVEL SECURITY`
  - `CREATE POLICY tenant_isolation` (USING + WITH CHECK + NULLIF wrapping)
- `test-rls-integration` 강화: `SET LOCAL ROLE app_tenant_user` 안에서 SELECT/INSERT — cross-tenant INSERT WITH CHECK reject (4 cases)

### 2. SPIKEE1-003 cycle3 + SPIKEE2-001: Auth.js DrizzleAdapter schema shape 검증
- 신규 시나리오 `test-drizzle-adapter-smoke` (5 cases):
  - session.{sessionToken, userId, expires} 필수 컬럼 존재
  - verificationToken composite PK (identifier, token)
  - session.userId FK → admin_user.id
  - Spike E extension columns (lastRefreshedAt, superAdminSelectedInstanceId, consumedAt)
- 실제 next-auth import·createSession 호출은 PROVIDER_GATE marker (Day 10 Vercel preview·SoT cascade)

### 3. SPIKEE1-005 cycle3: deactivated_by_user_id CHECK 강화
```diff
- (active = false AND deactivated_at IS NOT NULL)
+ (active = false AND deactivated_at IS NOT NULL AND deactivated_by_user_id IS NOT NULL)
```

### 4. SPIKEE1-006 cycle3: ActionType exhaustive
- 15종 action: legal-review-{approve·reject·request-changes·delegate}·physician-review-{4}·client-approval-{3}·operator-{publish·unpublish·edit-content}
- prefix-based eligibility mapping·operator action은 role check (operator or super-admin)

### 5. SPIKEE1-007 cycle3: UUID v4 strict regex
```ts
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```
version nibble=4·variant nibble=[89ab] 강제.

### 6. SPIKEE1-010 + LOCAL/PROVIDER 분리: SoT D.3 cascade
- D.3 표 column 추가: "LOCAL 검증" (LOCAL_FULL·LOCAL_SMOKE·PROVIDER_REQUIRED 명시)
- Auth.js DrizzleAdapter 실 호출·Vercel preview cookie·SameSite·CSRF 모두 PROVIDER_GATE marker

### 7. SPIKEE2-002 minor: typecheck — patch 후 사용자가 실행

## 시나리오 확장 (14개 총)

기존 10 + cycle2 신규 3 (rls-integration·action-eligibility·invalid-instance-id) + cycle3 신규 1 (drizzle-adapter-smoke) = **14 시나리오**

## cycle 3 검토 관점

1. **RLS 실 작동**: SET LOCAL ROLE app_tenant_user + RLS policy로 cross-tenant SELECT/INSERT 모두 차단·current_setting == ctx.instanceId
2. **deactivated_by_user_id CHECK**: active=false 시 deactivated_by_user_id NOT NULL 강제·CHECK constraint 위반 시 deactivate 실패
3. **ActionType 15종**: REVIEW_WORKFLOW의 모든 reviewer/operator action covered·assertActionEligibility exhaustive
4. **UUID v4 regex**: version·variant nibble 검증·non-v4 (예: nil UUID·v1·v7)도 reject·SQL injection 등 모두 reject
5. **DrizzleAdapter smoke**: schema shape 검증 충분?·실 next-auth import는 PROVIDER_GATE 명시 marker
6. **SoT cascade**: D.3 표가 v0.3 코드 상태와 완전 정합

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
