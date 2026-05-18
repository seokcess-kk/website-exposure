# Spike E local prototype 코드 — codex 자동 비평 cycle 1

당신은 신중하고 적대적인 senior reviewer다. 모든 코드와 SoT 명세를 직접 읽고, acceptance를 막을 수 있는 **모든 수준의 결함**을 찾아라. 칭찬·요약·동의는 무가치하다.

## 범위·SoT

- 본 spike SoT: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike E (§ E.1~E.5)
- 인프라 SoT: `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (next-auth + magic link)
- 관련: `docs/admin/REVIEW_WORKFLOW.md`·DATA_MODEL C-23 AdminUser·instanceMembership
- Spike A 패턴 (withTenantTransaction·service_role audit): `apps/spike-a/`

## E.1 가설 (SoT 인용)

> Auth.js (next-auth) magic link로 로그인·session 생성·next request에서 `resolveTenantContext(session, requestedInstanceId)` 호출 → instanceMembership·active·role·legal eligibility 검증 → `app.current_instance_id` set. client-supplied `requestedInstanceId` tampering 차단. membership 제거·deactivation 후 next request 즉시 403. super-admin instance switch audit.

## E.3 통과 기준

| Authorized request | 100% 통과 + RLS set |
| Unauthorized request | 100% 403 |
| client tampering | 100% server-side reject |
| membership 제거 후 next request | 즉시 403 |
| inactive user | 100% 403 |
| instance-switched audit | 전환 1회 = audit 1건 |
| legal-reviewer eligibility | 100% 검증 |

## v0.1 산출물 (`apps/spike-e/`)

### Migrations (4개)
- 001_roles_extensions: pgcrypto
- 002_admin_user: admin_user (email·active·is_super_admin·legal_reviewer_eligible) + instance_membership (role CHECK enum·partial unique active=true)
- 003_auth_session: auth_session (session_token UNIQUE·user FK CASCADE·expires_at·last_refreshed_at·super_admin_selected_instance_id) + auth_verification_token (composite PK identifier+token·expires·consumed_at)
- 004_audit_event: event_type·actor_user_id·target_user_id·from/to_instance_id·reason·payload·DESC index

### Source

- **magic-link.ts**: `issueMagicLink` (32B random base64url·SHA-256 hash 저장)·`consumeMagicLink` (CAS one-time consume·`UPDATE WHERE consumed_at IS NULL RETURNING 1`)·mockMailbox in-memory·TTL bound·`identifier` lowercase 정규화
- **session.ts**: `createSession` (opaque random·HMAC signed token·DB는 SHA-256 hashed opaque만)·`getActiveSession` (signature verify·timingSafeEqual·DB lookup·expiry)·`refreshSession` (last_refreshed_at + expires_at extend)·`revokeSession`·`setSuperAdminSelectedInstance`
- **resolve-tenant-context.ts**: 핵심 함수
  1. signed token verify + active session lookup
  2. admin_user.active 확인
  3. super-admin: session.super_admin_selected_instance_id 강제·null이면 `super-admin-required`·requested!=selected이면 `instance-mismatch`
  4. 일반 user: instance_membership(user, requested, active=true) 강제·없으면 `membership-not-found`
  5. legal_reviewer role 시 admin_user.legal_reviewer_eligible 확인·없으면 `legal-reviewer-ineligible`
  6. refresh interval 도래 시 refreshSession 호출
  7. audit emit (tenant-resolved or tenant-resolve-denied)
- **audit.ts**: `emitAuditEvent` (event_type·actor·target·from/to instance·reason·payload)
- **fixtures.ts**: 5 users (Alice·Bob·Carol super-admin·Dave eligible legal·Eve ineligible legal)
- **migrate.ts**: advisory lock + checksum
- **seed.ts**: 5 users·4 memberships (Alice instance-A operator·Bob instance-B admin·Dave instance-A legal·Eve instance-A legal·Carol super-admin·membership 없음)

### Scenarios (10개)

1. **test-magic-link-login** (6 cases): issue+consume·replay reject·invalid token·expired·session create+lookup·signature tamper
2. **test-tenant-resolve-own**: Alice→A success·audit tenant-resolved emit
3. **test-tenant-resolve-cross**: Alice→B reject membership-not-found·audit denied·self-A succeed
4. **test-client-tampering** (7 cases): signature swap·opaque swap·drop signature·empty·random·fake user crafted·revoked session
5. **test-membership-removal**: active=true OK·active=false reject·restore OK
6. **test-inactive-user**: active=false reject·audit inactive-user-rejected·restore
7. **test-super-admin-switch** (5 cases): not-switched reject·switch A→ctx·A→B switch·requested!=selected reject·instance-switched audit count
8. **test-legal-reviewer-eligibility**: Dave OK·Eve reject·Eve promoted OK·audit
9. **test-session-refresh** (3 cases): immediate no-refresh·stale → refresh·5x consistency
10. **test-invariant**: 5 users·4 instances·5 self resolves each + 100 cross attempts·all cross-instance reject·audit invariant (tenant-resolved count == self·denied count == cross)

## 검토 관점

### 1. SoT 정합성
- E.2 10 시나리오 모두 검증되는가?
- E.3 7항 통과 기준이 자동 boolean assert로 보장되는가?
- E.4 fallback (Lucia·session cache·scoped index)을 어떤 시점에 평가하는가?
- E.2-provider Day 10 (Vercel preview)는 명시 PROVIDER_GATE marker?

### 2. magic link security
- 32B random base64url·SHA-256 hash 저장은 충분한가? bcrypt·argon2 필요?
- `identifier.toLowerCase()` — 사용자 입력 normalize는 충분? trim·unicode 정규화?
- mockMailbox는 process-scoped — concurrent scenario 실행 시 race? clearMockMailbox는 명시 호출 필요
- expired token consume 시 row select 후 update 사이 race·CAS로 안전?
- email enumeration 공격: `issueMagicLink`가 unknown email에도 row 추가·email 존재 정보 leak — 본 spike OK·production은?

### 3. session security
- HMAC-SHA256 signature·timingSafeEqual — 충분?
- SESSION_TOKEN_SEPARATOR = "." — opaque에 "."가 포함되면 split 잘못? base64url은 `.` 안 포함이므로 OK
- AUTH_SECRET 32+ chars 검증 — production은 더 강한 entropy
- session_token DB column UNIQUE — collision 확률 (32B random) negligible
- session DB row delete = revoke — RLS 무관·plain delete
- super_admin_selected_instance_id를 session row에 저장 — session id 노출 시 instance switch tampering 가능? signature 검증으로 차단

### 4. resolveTenantContext robustness
- super-admin path는 instance_membership 검사 안 함 — production은 super-admin도 membership 강제? legal_reviewer eligibility는 super-admin에도 적용?
- requestedInstanceId가 invalid UUID·empty·null이면? SQL injection·validation 부재?
- session refresh in concurrent resolve — race? 같은 session 5개 동시 resolve 시 last_refreshed_at 정확?
- audit emit 실패 시 (DB connection drop) resolve 전체 fail? best-effort? — 현재 await emitAuditEvent로 throw 가능
- legal_reviewer eligibility를 cron으로 박탈 시 다음 resolve 즉시 reject — 검증 부재? membership-removal scenario와 유사 검증 필요

### 5. client tampering 완전성
- HTTP layer 부재 — 본 spike는 server-side function only·HTTP request·cookie·CSRF·CORS는 PROVIDER_GATE marker? 명시
- session token revocation list·blacklist 필요? 본 spike 부재
- cross-user session token replay — 다른 user의 token으로 정확히 reject

### 6. RLS context set 부재
- E.3 "Authorized request: 100% 통과 + **RLS set**" — resolveTenantContext가 SET LOCAL app.current_instance_id 호출 안 함! return된 ctx를 caller가 withTenantTransaction에 넘긴다는 가정·명시 marker?
- LOCAL_FULL 검증 부재 — withTenantTransaction integration

### 7. invariant·audit count 정확성
- `audit count == self resolve count` 검증 — but resolve 중 retry·실패도 audit 누적·count 정합 정확?
- N=5·M=4·X=100 충분? 더 큰 invariant?

### 8. 코드 품질
- TypeScript strict + `noUncheckedIndexedAccess` — 모든 array access `!` 사용
- import 순환 없음 검증
- `tsx --env-file=.env` PowerShell 호환
- pnpm-lock.yaml 동결·spike-e importer 추가

### 9. 누락된 시나리오·차원
- magic link rate limit·brute force protection
- session concurrent (같은 user·다른 device·여러 active session)
- super-admin demote (is_super_admin=true→false) 후 next request — admin role membership 없으면 reject?
- legal_reviewer_eligible 박탈 시 즉시 effect (membership-removal과 유사)
- instance-switched 시 from instance가 정확히 audit에 기록되는지
- session expiry imminent (last_refreshed_at vs now() > SESSION_TTL이면 force refresh)

### 10. 보안 결함
- AUTH_SECRET이 env에 평문 — production은 secret store
- magic link URL에 token embed·URL log·browser history leak — 본 spike OK·production은 안내
- email enumeration via response timing
- super-admin selected_instance가 session-bound — session 탈취 시 instance switch도 hijack 가능

## 평가 형식

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {"id": "SPIKEE1-001", "severity": "blocking|major|minor", "category": "...", "file": "...", "line_range": "...", "issue": "...", "evidence": "...", "suggested_patch": "..."}
  ],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```
