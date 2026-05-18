# packages 실 코드 추출 v0.2 — codex 자동 비평 cycle 1

## 범위

Spike E·C·B의 LOCAL_PASS 코드 → packages/{auth, storage, notifications-outbox}/src/ 추출.
- env import 제거·config 객체 패턴 (caller injection)
- AppError 상속·shared-errors 통합
- @glitzy/shared-types branded types·UUID v4 regex 통합
- sub-path exports map 추가
- @types/node 의존성 추가

## v0.2 산출물

### packages/auth (Spike E 추출)
- `config.ts`: AuthConfig (authSecret·magicLinkTtlSeconds·sessionTtlSeconds·sessionRefreshIntervalSeconds·resendMode)·validateAuthConfig
- `errors.ts`: AppError 상속·AuthDeniedError·TenantResolveError·AuthDenyReason 12종
- `audit.ts`: emitAuditEvent (sql/tx 양쪽 허용)
- `magic-link.ts`: issueMagicLink (cfg 주입)·consumeMagicLink (atomic CAS·expires>now()·consumedAt IS NULL)·normalizeIdentifier·mockMailbox
- `session.ts`: createSession·getActiveSession·refreshSession·revokeSession·switchSuperAdminInstance (atomic audit invariant)·HMAC signed·timingSafeEqual
- `resolve-tenant-context.ts`: resolveTenantContext·withResolvedTenantTransaction·assertActionEligibility (switch exhaustive·14 actions)·UUID v4 strict (UUID_V4_REGEX from @glitzy/shared-types)
- `index.ts`: 14 named exports + 8 types
- `package.json`: 6 sub-path exports (./magic-link·./session·./resolve-tenant-context·./errors·./config·.)

### packages/storage (Spike C 추출)
- `config.ts`: StorageConfig·S3Credentials·validateStorageConfig
- `errors.ts`: TenantPrefixMismatchError·MalformedObjectKeyError·RefreshRejectedError·UrlLeakError
- `tenant-context.ts`: parseObjectKey·assertObjectKeyForInstance·assertObjectKeyForServiceRole·instancePrefix·canonicalUuid·UUID_REGEX
- `audit-log.ts`: AuditLog class·14 forbidden patterns·9 string fields·1~2 URL decode
- `storage-client.ts`: createS3Client (cfg + creds 주입)
- `sign-url.ts`: issueSignedUrl·refreshSignedUrl·RefreshPolicy·MAX_REFRESH_GRACE_MS·DEFAULT_REFRESH_POLICY·validateRefreshPolicy
- `index.ts`: 18 named exports + 7 types
- `package.json`: 6 sub-path exports

### packages/notifications-outbox (Spike B 추출 — outbox CRUD + provider-adapter interface만)
- `errors.ts`: OutboxAlreadyEnqueuedError·OutboxClaimRaceError·ProviderTransientError·ProviderPermanentError
- `provider-adapter.ts`: ProviderAdapter interface·ProviderAttemptResult union 3종 (accepted-success·accepted-failure·attempted-failure)
- `outbox.ts`: enqueue·claim (SKIP LOCKED)·markCompleted·markRetry·markFailedPermanent·reclaimStale
- `index.ts`: 11 named exports
- `package.json`: 4 sub-path exports

## v0.3 deferred (cycle 2+)
- packages/notifications-outbox: inbox·permanent-alert·provider_attempt_log·worker harness·failure injection 10 point
- packages/auth·storage: regression test (apps/spike-* import 후 동일 PASS)
- migrations 통합 (각 package migrations/·manifest.json)

## build·typecheck 검증
- `pnpm pkg:typecheck` 7 packages 모두 PASS (build + typecheck 각각)

## 검토 관점

### 1. config 객체 패턴 정합
- AuthConfig·StorageConfig: caller가 env 변환 후 주입·packages는 process.env 직접 안 읽음
- validateAuthConfig·validateStorageConfig: 명확한 boundary
- magic-link·session·sign-url 모든 함수가 cfg 받음 — 중복 작성 부담? alternative (instantiated client)?

### 2. Spike → package 의미 보존
- Spike E·C·B의 LOCAL_PASS 시나리오 결과가 동일 path로 재현 가능?
- 추출 시 변형 (env → cfg parameter)이 동작 변경 없는가
- audit·error·flow 모두 동일

### 3. exports map 정합
- non-placeholder 4 packages (db·auth·storage·notifications-outbox) 모두 sub-path exports
- migrations-runner는 여전히 placeholder
- shared-types·shared-errors는 단일 export
- exports map과 실 dist 파일 일치

### 4. apps/spike-* regression
- v0.2는 build/typecheck만 측정·실 spike scenario import 후 PASS는 v0.3+ deferred
- 그러나 spike 코드와 package 코드가 같으므로 동작 동일 예상

### 5. provider-adapter interface
- ProviderAttemptResult 3-state union (accepted-success·accepted-failure·attempted-failure) — Spike B에서 추출한 그 패턴
- idempotencyKey·providerMessageId·transient flag — at-least-once with exactly-once observable 패턴
- 본 v0.2는 interface만·구현 (Resend/SMS/Webhook adapter)은 별도 package

### 6. 누락·결함
- worker harness 부재 — v0.2 scope 명시
- 각 package의 migrations/ 디렉토리 부재 — manifest 통합은 cycle 2+
- README.md 부재 (post-hardening defer)
- tests/ 부재 (post-hardening defer)
- @types/node가 devDep — production runtime은 Node 20+
- audit_event·verificationToken·session·admin_user·instance_membership·outbox·inbox·permanent_alert·provider_attempt_log table schema는 caller (apps) 에 위임 — packages는 SQL만 명시

## 평가 형식

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [...],
  "new_major_findings": [...],
  "new_minor_findings": [...],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```
