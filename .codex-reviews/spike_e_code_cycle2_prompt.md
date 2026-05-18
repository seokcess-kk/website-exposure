# Spike E local prototype 코드 — codex 자동 비평 cycle 2

동일 reviewer. cycle 1 10 결함 (blocking 3·major 6·minor 1)에 대한 v0.2 patch.

## cycle 1 결과 (SoT)

closeable_after_patch: false.
blocking (3): SPIKEE1-001·002·003.
major (6): SPIKEE1-004·005·006·007·008·010.
minor (1): SPIKEE1-009.

## v0.2 patch 요약

### 1. SPIKEE1-001: RLS integration
- `withResolvedTenantTransaction` 추가 — `resolveTenantContext` 후 `SELECT set_config('app.current_instance_id', ctx.instanceId, true)` 안 tx에서 실행
- 신규 시나리오 `test-rls-integration`: SELECT current_setting == ctx.instanceId·outside tx empty·multi-user 다른 instance

### 2. SPIKEE1-002: instance-switched audit invariant
- `switchSuperAdminInstance(sql, sessionToken, actorUserId, toInstanceId)` API 추가 — single transaction에서 (a) session UPDATE (b) audit emit
- 기존 `setSuperAdminSelectedInstance` + manual `emitAuditEvent` 패턴 제거
- `test-super-admin-switch` 변경: switch API만 사용·count 정확히 +1·total switches == 2 강제

### 3. SPIKEE1-003: next-auth schema 정합
- table names: `"session"` (`sessionToken·userId·expires·lastRefreshedAt·superAdminSelectedInstanceId·createdAt`)·`"verificationToken"` (`identifier·token·expires·createdAt·consumedAt`·composite PK)
- camelCase + quoted (Auth.js v5 Drizzle adapter 표준)
- `auth_session`·`auth_verification_token` 이름 제거·모든 시나리오/session.ts/magic-link.ts column 이름 update

### 4. SPIKEE1-004: role enum SoT 정합
- migration 002: `CHECK role IN ('operator', 'physician-reviewer', 'legal-reviewer', 'client-approver')`
- seed: Alice operator·Bob operator·Dave/Eve legal-reviewer
- TypeScript: `TenantRole = "operator" | "physician-reviewer" | "legal-reviewer" | "client-approver"`·`EffectiveRole = TenantRole | "super-admin"`

### 5. SPIKEE1-005: deactivated_at·deactivated_by_user_id
- migration 002: 두 column 추가·CHECK consistency (active=true AND deactivated_at NULL OR active=false AND deactivated_at NOT NULL)
- `test-membership-removal` 강화: Carol super-admin이 박탈·metadata persist 검증

### 6. SPIKEE1-006: super-admin·action eligibility 분리
- super-admin은 tenant access만·role='super-admin' (자동 'admin' 부여 안 함)
- `assertActionEligibility(ctx, action)` 추가 — action에 따라 legal_reviewer_eligible·physician_reviewer_eligible·client_approver_eligible 별도 확인
- 신규 시나리오 `test-action-eligibility`: Carol super-admin이 legal-review-decision 시도 → reject·Carol promoted → OK·Dave physician/client → reject

### 7. SPIKEE1-007: requestedInstanceId UUID validation
- `validateInstanceId` (UUID_REGEX + trim + lowercase)·malformed 시 `invalid-instance-id` audit + TenantResolveError
- 신규 시나리오 `test-invalid-instance-id`: empty·whitespace·non-UUID·short·extra·G hex·newline·SQL injection 모두 reject

### 8. SPIKEE1-008: magic link atomic CAS with expires
- `UPDATE WHERE consumedAt IS NULL AND expires > now() RETURNING identifier` — single atomic
- 실패 시 사후 SELECT으로 reason 식별 (consumed vs expired vs not-found)

### 9. SPIKEE1-009: normalizeIdentifier
- trim + NFC normalize + lowercase + EMAIL_REGEX
- 모든 issue/consume path에 적용

### 10. SPIKEE1-010: PROVIDER_GATE marker — cycle3 SoT cascade 예정

## 신규 시나리오 (13개로 확장)

1~10. 기존 magic-link-login·tenant-resolve-own·cross·client-tampering·membership-removal·inactive-user·super-admin-switch·legal-eligibility·session-refresh·invariant
11. **test-rls-integration** (3 cases): SET LOCAL current_setting 검증
12. **test-action-eligibility** (5 cases): action별 eligibility 분리·super-admin 자동 부여 없음
13. **test-invalid-instance-id** (8 cases): malformed UUID·SQL injection·newline 등

## cycle 2 검토 관점

1. **next-auth schema 호환성**: `"session"`·`"verificationToken"` table names·column names가 Auth.js Drizzle adapter v5 표준과 정확히 일치?
2. **switchSuperAdminInstance API atomicity**: tx 안에서 UPDATE + audit insert — 한쪽 실패 시 양쪽 rollback?
3. **role enum SoT 정합**: 'operator·physician-reviewer·legal-reviewer·client-approver' — REVIEW_WORKFLOW와 정확히 일치
4. **deactivated_* CHECK constraint**: active=true 시 deactivated_at·deactivated_by_user_id 모두 NULL 강제·active=false 시 deactivated_at NOT NULL
5. **super-admin·action eligibility 분리**: `effectiveRole === 'super-admin'`·assertActionEligibility로 action 게이트·all 4 action types covered
6. **UUID validation**: regex만으로 충분? canonical UUID v4·case·hyphen position·extension byte 등?
7. **magic link CAS**: `expires > now()` AND `consumedAt IS NULL` AND identifier·token match → atomic. race-free 보장
8. **normalizeIdentifier**: trim·NFC·lowercase·regex·input length 254자 한계
9. **RLS integration**: SET LOCAL은 tx scope·outside tx 검증 — postgres-js connection pool semantics·max=4 pool 시 동작?
10. **시나리오 추가 충분성**: 13 시나리오로 E.2 10항 + acceptance 추가 영역 모두 cover?

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
