Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e298e-f56b-7661-b5af-7f9a5f0a83aa
--------
user
# 자동 비평 의뢰 — `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` (1차)

## 컨텍스트

8 Feature spec v1.0 + 인프라 결정 v1.0 완료 후 Phase 0 Week 1 진입. 3개 Spike로 가장 위험한 기술 가정 검증.

- **Spike A**: Drizzle + RLS + Auth.js + Supabase tenant scoping (`withTenantTransaction`·SET LOCAL·pgBouncer transaction pooling)
- **Spike B**: worker control-plane queue + tenant-plane processing (SKIP LOCKED claim·2 transaction 분리·stale lock reclaim)
- **Spike C**: Cloudflare R2 signed URL + instance prefix + IAM isolation (object key prefix·tenant-check·TTL·refresh)

각 Spike는 가설·실험 시나리오·통과 기준·실패 시 대안 정의. 7일 (Day 1~7) 일정·실패 시 Week 2 buffer.

## 의뢰

이전 spec/인프라 비평과 동일한 강도로 본 Spike 계획을 비평하라. 본 문서 끝의 "codex 비평 의뢰 사항" 8항목을 참고.

특히:

1. **가설 우선순위**: 본 Spike 3개가 인프라 결정 v1.0의 가장 위험한 가정 — 다른 미검증 critical 가정이 더 위험하지 않은가? (Drizzle Kit migration·Auth.js session·Cloudflare for SaaS·Doppler·환경 분리)
2. **통과 기준 측정 가능성**: binary pass/fail 평가 가능? negative invariant 검증 방법
3. **실험 누락**: 각 Spike의 critical scenario 빠뜨린 것
4. **prototype vs production 차이**: Spike 통과해도 prod에서 실패할 수 있는 부분
5. **솔로 일정 현실성**: 1~3일/Spike 적정한가
6. **실패 시 reversal 비용**: A 실패 → 인프라 결정 v1.0 INFRA2-01 전체 reversal 부담
7. **후속 작업 의존성**: Phase 0 Week 2~6 작업이 Spike 결과에 어떻게 의존
8. **누락 Spike**: 다른 critical 가설

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKE1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
- `C:\Users\assag\solution\website-exposure\docs\features\*.md` (8 Feature v1.0)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
codex
`seo-geo` 스킬은 이번 요청의 성격과 맞지 않아 사용하지 않습니다. 먼저 대상 Spike 문서와 의존 SoT를 읽어서, 문서 내부 기준과 인프라 결정의 실제 리스크가 어긋나는 지점을 중심으로 비평하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/INFRA_DECISIONS_DRAFT.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files docs/features' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 769ms:
# 인프라 결정 — 4영역 **(v1.0 acceptance 완료)**

> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 2·minor 2 (정정 완료)

> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 결정**: 8 Feature spec v1.0 완료·솔로 1명 + AI 보조·9~12개월·Phase 0~4 단계·Vercel+Supabase+Railway 스택·next-auth
> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리

---

## 영역 1: Multi-tenant 모델 (INFRA2-01·02·04·05·06·08 정정)

### 1.1 DB role·RLS 실행 모델 (INFRA2-01 강화)

#### `withTenantTransaction` 헬퍼 — 강제 패턴

```ts
// packages/db/tenant.ts
async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: ScopedDb) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.current_instance_id = ${instanceId}`);
    await tx.execute(sql`SET LOCAL ROLE app_tenant`);
    return fn(scopedDbFromTx(tx));
  });
}
```

규칙:
- **모든 tenant table 접근은 `withTenantTransaction` 안에서만 허용** (lint 강제)
- transaction 밖 tenant table 접근 → lint fail + runtime guard throw
- `SET LOCAL` 사용 → transaction commit/rollback 시 자동 해제
- `SET LOCAL ROLE app_tenant` → service_role connection 사용 시에도 RLS 적용
- pgBouncer/connection pooling: **transaction pooling mode 강제** (session pooling 금지 — SET LOCAL이 session-wide면 다른 transaction에 leak)

#### worker control-plane queue + tenant-plane processing 분리

worker가 claim job 시 instance context 모름 → 2단계 분리:

```ts
// 1. control-plane: instance-agnostic
const job = await withServiceRoleTransaction(async (tx) => {
  return tx.execute(sql`
    UPDATE outbox SET status='processing', locked_at=now()
    WHERE id = (SELECT id FROM outbox WHERE status='pending'
                ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
    RETURNING *
  `);
});

// 2. tenant-plane: instanceId 알게 된 후
await withTenantTransaction(job.instanceId, async (tx) => {
  // 실제 dispatch·CAS·CrmRecord 갱신 등
});
```

control-plane queue table들 (outbox base·retry queue base)에는 RLS 미적용 — claim 시 instance context 미상 처리 위해.

**audit_log는 별도 처리 (INFRA3-02 정정)**:
- **write path**: control-plane helper 허용 (worker가 instance switch 시 audit insert 가능)
- **read path**: tenant-scoped view 또는 RLS policy 적용 — `CREATE POLICY audit_log_read ON audit_log FOR SELECT USING (instance_id = current_setting('app.current_instance_id')::uuid)`
- audit metadata에 tenant-sensitive 정보(법무 검토·사전심의·권한 변경) 포함됨 → cross-tenant 노출 위험 차단

#### lint·runtime guard

- `@no-direct-db-access`: `db.select/insert/update/delete` 직접 호출 금지 (eslint-plugin-custom)
- `@require-tenant-transaction`: tenant table import 시 `withTenantTransaction` 안 사용 강제
- runtime guard: production에서 `current_setting('app.current_instance_id')` 누락 시 RLS가 모든 row 숨김 → query fail (안전)

### 1.2 service_role break-glass + audit cascade (INFRA2-02 반영)

REVIEW_WORKFLOW § 10.2.1에 `service-role-invoked` AuditAction cascade 완료 (별도 cascade 완료).

```ts
// service_role 사용 함수 표준 패턴
async function serviceRoleExample(input: ServiceRoleInput): Promise<...> {
  await assertBreakGlassAllowed(input.requestingActor);  // env·route·role 검증
  const auditLogId = await appendAuditLog({
    action: 'service-role-invoked',
    actorId: input.requestingActor.id,
    actorRole: input.requestingActor.role,
    metadata: {
      serviceRoleFunction: 'serviceRoleExample',
      reasonCode: input.reasonCode,
      ticketRef: input.ticketRef,
      affectedInstanceIds: input.affectedInstanceIds,
      readWriteClass: 'write',
      dryRun: input.dryRun ?? false,
      approvedBy: input.approvedBy,
      requestFingerprint: hash(...),
      correlationId: ctx.correlationId,
    }
  });
  // 실제 작업
}
```

allowlist 경로:
- `serviceRoleMigrationRunner` — DDL deploy
- `serviceRoleExportInstance` — backup export
- `serviceRoleImportInstance` — restore
- `serviceRoleAdminBreakGlass` — incident 대응 (super-admin + ticket 필수)

### 1.3 next-auth + `resolveTenantContext` (INFRA2-08 신규)

```ts
// apps/web/lib/tenant-context.ts
async function resolveTenantContext(
  session: NextAuthSession,
  requestedInstanceId: string
): Promise<TenantContext> {
  // 1. instanceMemberships에 requestedInstanceId 포함 여부 검증
  const membership = await db.serviceRole.adminUser
    .findInstanceMembership(session.userId, requestedInstanceId);
  if (!membership) throw new HttpError(403, 'not-member');

  // 2. active 검증
  if (!membership.active) throw new HttpError(403, 'inactive-member');

  // 3. legal eligibility (legal-reviewer는 추가 검증)
  if (membership.role === 'legal-reviewer') {
    await assertLegalEligibility(session.userId);
  }

  // 4. super-admin cross-instance 시 audit
  if (session.previousInstanceId && session.previousInstanceId !== requestedInstanceId) {
    await appendAuditLog({
      action: 'instance-switched',
      actorId: session.userId,
      metadata: { from: session.previousInstanceId, to: requestedInstanceId }
    });
  }

  return { instanceId: requestedInstanceId, role: membership.role, ... };
}
```

규칙:
- **모든 web request에서 server-side `resolveTenantContext` 호출 필수**
- client가 보낸 `requestedInstanceId`를 검증 없이 신뢰 금지
- RLS `app.current_instance_id`는 `resolveTenantContext` 결과만 사용
- role 변경·deactivation은 session expiry까지 기다리지 않고 매 요청 검증

REVIEW_WORKFLOW § 10.2.1에 `instance-switched` AuditAction cascade 완료.

### 1.4 composite FK 3등급 분류 (INFRA2-04 정정)

blanket rule 폐기. 다음 3등급으로 분류:

| 등급 | 적용 대상 | FK 패턴 |
|---|---|---|
| **A. tenant-plane hard FK** | parent가 tenant table이고 `(instance_id, id)` unique 가능한 경우 | `FOREIGN KEY (instance_id, parent_id) REFERENCES parent(instance_id, id)` |
| **B. control-plane FK** | parent가 control-plane (AdminUser 등) | `FOREIGN KEY (parent_id) REFERENCES parent(id)` + runtime membership 검증 |
| **C. polymorphic / contentRef** | spec의 `contentRef: "page:12345"`·`"compliance-record:..."` 등 polymorphic ref | FK 없음 + **typed ref registry** + build/runtime validator + audit invariant |

C 등급 처리:
- `packages/core-data-model/ref-registry.ts`에 모든 contentType prefix 등록
- build-time validator: 모든 contentRef는 registry 등록 prefix만 허용
- runtime validator: ref resolve 시 row 존재 + tenant scope 검증

### 1.5 tenant export/import manifest — dependency class (INFRA2-05 강화)

```ts
type ExportManifest = {
  instanceId: string;
  exportVersion: string;
  exportedAt: Date;
  dependencies: ExportDependency[];
};

type ExportDependency = {
  table: string;
  rowCount: number;
  dependencyClass: DependencyClass;
  remapHint?: string;  // import 시 처리 방법
};

type DependencyClass =
  | "portable"                    // 그대로 copy 가능
  | "rebind-required"             // secretRef·providerId·externalId 등 재바인딩 필요
  | "rotate-required"             // credential·webhook secret 회전 필수
  | "legal-reapproval-required"   // DPA·legalApproved 재승인 필요
  | "external-provider-owned"     // CRM record·webhook nonce 등 외부 소유 — 재수입 금지
  | "blob-copy-required"          // storage object copy·rekey 필요
  | "audit-chain-preserved";      // append-only audit log — 원본 instance 표기 유지
```

import 정책:
- **default**: 신규 instance는 `disabled` 상태로 생성. operator 검수 후 enable
- secretRef 모두 `secretRef://PENDING_*`로 마스킹 → 운영자가 새 instance용으로 재발급
- credential rotation 필수 (CRM·webhook 등)
- DPA·legalApproved 재승인 필수 → legal-reviewer 검수 흐름 진입
- blob (Storage object)는 별도 copy job → object key prefix `{instanceId}/...` 재구성
- audit log는 `originInstanceId` 메타로 원본 표기 유지

### 1.6 noisy neighbor 정책 (INFRA2-06 rate limit taxonomy)

| 항목 | 정책 | 저장소 |
|---|---|---|
| **hard quota / billing / provider quota** | Postgres row lock + atomic UPDATE | CrmRateLimitState·analyticsRateLimit·동등 spec table |
| **soft smoothing / UI throttle / dedupe** | Upstash Redis (SET NX EX·INCR TTL·EVAL Lua) | — |
| `statement_timeout` per query class | interactive 5초·worker 30초·heavy step config (max 1h) | Postgres role-level GUC |
| DB connection pool 분리 | web pool (interactive priority)·worker pool (heavy) | Supabase Pooler config |
| worker pool 분리 | interactive worker (dispatch·outbox·short retry) / heavy worker (content-migration·analytics·crawler·CRM full sync) | Railway service 분리 |
| instance별 concurrency | config (per feature·per instance) | feature spec |
| heavy job time window | 운영시간 외 권장 (config로 강제 가능) | feature config |
| fail-open vs fail-closed | 의료 도메인은 **fail-closed** (외부 API rate limit 실패 시 호출 차단) | — |

### 1.7 schema-per-tenant ADR — 별도 (INFRA1-03 유지)

Phase 0~1에 control-plane vs tenant-plane 분류 ADR 별도 작성. 본 문서는 분류 진입점만 명시.

---

## 영역 2: Email·Monitoring·Redis provider 세부

### 2.1 Email Provider — Resend (DATA_MODEL C-08 cascade 완료)

DATA_MODEL C-08 v0.23 cascade로 `transport: "smtp" | "api"`·`provider: "resend" | "postmark" | "ses" | "sendgrid" | "mailgun"` 분리. Resend는 `transport="api"·provider="resend"`.

| 항목 | 정책 |
|---|---|
| MVP provider | Resend (transport=api·provider=resend) |
| PHI/환자정보 금지 | email body·subject에 식별 정보·진료 내용 금지. contentRef는 admin link만 |
| content title 민감도 | NotificationEvent.contentTitle은 비식별 일반화만 |
| DPA·계약 | Resend Workplace plan부터 DPA. Phase 1 베타 전 체결 |
| provider log retention | Resend dashboard 30일 + 내부 NotificationLog (DB) 365일 |
| fallback provider | Postmark (transport=api·provider=postmark). 전환 조건: quota 초과·실패율 > 1%·DPA 변경 |
| provider adapter interface | `EmailProvider` (§ 2.4) — raw response는 NotificationLog.providerResponse JSON |

### 2.2 Monitoring (INFRA2-07 유지)

v0.2 § 2.2 동일. Sentry error 한정 + DB audit + feature tables + platform log + PII scrubber + correlationId.

### 2.3 Redis — rate limit taxonomy (§ 1.6 통합·INFRA2-06)

- Upstash: dedupe (SET NX EX)·suppression count (INCR TTL)·UI throttle (소프트 smoothing)
- Postgres: hard quota·CRM provider quota·billing·금융 정확도 요구
- token bucket이 Upstash에 필요 시 EVAL Lua 사용 (atomic 보장)

### 2.4 Provider adapter interface (INFRA2-15 cascade 완료)

```ts
interface EmailProvider {
  send(input: SendEmailInput): Promise<SendEmailResult>;
  webhook(rawBody: Buffer, headers: Headers): WebhookEvent;
  providerCode: "resend" | "postmark" | "ses" | "sendgrid" | "mailgun";
}
// MonitoringSink·RedisAdapter 동일 패턴
```

DATA_MODEL C-08 `provider` enum과 adapter `providerCode`가 1:1 매핑. raw response는 `providerResponse` JSON 컬럼에만 저장.

---

## 영역 3: Storage — **Cloudflare R2 채택** (INFRA2-07·INFRA3-03 확정)

### 3.1 옵션 비교

| 항목 | A. Supabase Storage 유지 | B. Cloudflare R2로 전환 (권장) |
|---|---|---|
| spec 정합성 | search-visibility/asset-ingestion 등이 S3 IAM·object key prefix 패턴 가정 → **mismatch** | spec 그대로 적용 가능 |
| next-auth 매핑 | Supabase Auth `auth.uid()` 미사용 → **RLS 매핑 불가**·server-only signed URL issuer 필요 | 영향 없음 — server-only signed URL로 통일 |
| egress 비용 | 0.09$/GB (이미지 트래픽 누적) | **0$ (R2 핵심 장점)** |
| dashboard 운영 | 통합 UI | 별도 R2 dashboard |
| object isolation | RLS bypass + application-level | **object key prefix `{instanceId}/...` + IAM condition** (spec 그대로) |
| import 후 blob 복구 | Supabase API 호출·copy | S3 copy API 표준 |

### 3.2 권장: **B. Cloudflare R2로 전환**

근거:
1. **spec 정합성**: 8 Feature spec 중 search-visibility·asset-ingestion·content-migration이 S3 IAM·object key prefix·signed URL refresh 패턴 가정 — R2는 S3 API 호환이라 그대로 적용
2. **next-auth 매핑 단순화**: Supabase Storage RLS는 `auth.uid()` 필요 → next-auth 환경에서 매핑하려면 custom JWT 발급 등 복잡. R2는 server-only signed URL issuer로 통일 (이미 spec 명시)
3. **비용**: egress 0$ — 의료기관 사이트 이미지 트래픽 누적 시 결정적
4. **storage isolation**: object key prefix `{instanceId}/{type}/...` + IAM PolicyDocument의 `Condition.StringLike` (spec search-visibility § 13.10 예시)

### 3.3 Storage import/export 결정 (B 옵션 기준)

| 항목 | 정책 |
|---|---|
| export | per-instance object key prefix scan → R2 manifest 생성 → signed URL list 출력 |
| import | 신규 instance prefix로 object copy (R2 → R2)·signed URL 재발급·`Storage Migration audit` 기록 |
| RLS 대체 | server-only signed URL issuer (`packages/storage/issue-url.ts`) — issuance 시 instance scope + audit 검증 |
| signed URL 정책 | TTL 600초 (spec search-visibility)·만료 60초 전 자동 refresh |
| object key format | `{feature}/{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (spec 명시) |

**이전 결정(Supabase Storage)을 reversal해야 하는 결정.** 사용자 확인 필요 (§ 영역 4 끝에 사용자 결정 요청 명시).

---

## 영역 4: Phase 0 작업 + 베타·법무 일정

### 4.1 Phase 0 Spike Gate (INFRA2-09 신규)

Week 1에 다음 3개 spike를 별도 gate로 진행:

| Spike | 목표 | 통과 기준 | 실패 시 |
|---|---|---|---|
| **Spike A: Drizzle + RLS + Auth.js + Supabase** | tenant scoping 실행 모델 검증 | (1) withTenantTransaction 안에서 RLS 적용 (2) 다른 instance row 안 보임 (3) pgBouncer transaction pooling 작동 (4) lint·runtime guard 동작 | Phase 0 scope를 UI보다 infra closure로 재조정·migration 패턴 재설계 |
| **Spike B: worker control-plane queue + tenant processing** | SKIP LOCKED claim·instance switch 검증 | (1) control-plane DB role로 claim·(2) tenant-plane으로 처리·(3) worker가 instance context를 RLS에 set·(4) 두 transaction 분리 | worker 패턴 재설계 |
| **Spike C: Storage signed URL isolation** | (B Storage 채택 시) R2 signed URL + instance prefix·IAM condition·next-auth 매핑 검증 | (1) cross-instance access 차단·(2) signed URL refresh 동작·(3) IAM PolicyDocument 작동 | Storage ADR 재검토 |

Spike 통과 후 Week 2~6 본 작업 진행. 실패 시 Phase 0 일정 4주 buffer.

### 4.2 Phase 0 작업 (v0.2 § 3 + spike 추가)

| Week | 작업 | gate |
|---|---|---|
| **Week 1 (Spike)** | Spike A·B·C 진행 + repo skeleton + tsconfig + Biome + CI 기본 | Spike 통과 |
| Week 2 | Supabase dev/staging·Drizzle migration·next-auth·Sentry·Resend dev·Upstash | dev/staging vertical green |
| Week 3 | Railway worker·webhook-receiver·Cloudflare DNS·local docker-compose·INV fixture conventions | worker 동작 |
| Week 4 | M0 vertical slice schema (~15 tables — Page·Content·ComplianceRecord·AuditLog·NotificationEvent·NotificationLog 등) | schema migration green |
| Week 4 | P0 critical 공통 패턴 (§ 4.4 재정의) | P0 smoke |
| Week 5 | DESIGN_TOKENS Style Dictionary build·UI 컴포넌트 10개·REVIEW_WORKFLOW state machine P0 | UI 기반 |
| Week 6 | 운영자 UI 골격·M0 e2e 1개 (login → 콘텐츠 작성 → audit log row 확인) | Phase 0 sign-off |

### 4.3 Phase 0 outbox 분류 — **옵션 A 선택** (INFRA2-03)

P0에 **notifications 최소 subset 포함** — Receipt·Log·PayloadRecord·DeliveryAttempt까지. Digest·QuietHours·BusinessHours·DLQ는 P1.

```
P0 schema (M0 vertical slice — ~15 tables):
- Core: Page·Content·ComplianceRecord·AuditLog (audit append-only)
- Notifications (P0 subset 4 tables): NotificationEventReceipt·NotificationLog·NotificationPayloadRecord·NotificationDeliveryAttempt
  (Note: NotificationEvent는 notify() 입력 타입이며 DB table 아님 — INFRA3-01)
- Compliance-assistant (P0 subset): RuleCatalog·ComplianceCheckResult·CheckCache
- User/Auth (next-auth): user·session·account·verificationToken
- Common: outbox (notification dispatch trigger)
```

P1 schema (Phase 1+):
- DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt·DedupeCache (Redis)

### 4.4 P0 critical 공통 패턴 (재정의 — INFRA2-03 정렬)

1. `withTenantTransaction` 헬퍼 + `scopedDb` API
2. `assertBreakGlassAllowed` + service_role audit
3. `appendAuditLog` (append-only)
4. `idempotencyKey` + `requestFingerprint` helper
5. **`notify()` 최소 구현** — Receipt + Log + PayloadRecord + DeliveryAttempt + outbox dispatch (P0 subset)
6. retry queue base (SKIP LOCKED claim·exhausted 전이)
7. `secretRef` resolver interface (Doppler·env·Supabase Vault)
8. `hmac` utility (planFingerprint·idempotencyPepperRef 등)
9. Result/error taxonomy + correlationId 전파

### 4.5 베타·법무 — INFRA2-10·11·13·14 반영

#### 4.5.1 legal-reviewer — 시간당 contract + fixed-scope package (INFRA2-10)

| 단계 | legal 자문 형태 | 예상 비용 |
|---|---|---|
| Phase 0 (Week 1~6) | **Fixed-scope package** — DPA 템플릿 1회·의료광고 워크플로 2회 워크숍·high-risk sample 20건 검토·사전심의 절차 자문 1회 | 500~1500만원 (1회성) |
| Phase 1 (Week 7~16) | 시간당 contract (월 5~10시간 추정) | 100~250만원/월 |
| Phase 2~3 (베타 운영) | retainer로 전환 (월 300만+) | retainer |
| Phase 4+ (정식 출시) | 의료기관별 자체 법무로 분산 | — |

#### 4.5.2 internal beta fallback — 범위 제한 (INFRA2-11)

| 검증 가능 | 검증 불가 (외부 베타 필요) |
|---|---|
| UI workflow·상태 머신·알림 발송 | 의료기관 책임자 승인·자료 제공 마찰 |
| audit log·검수 큐 상태 전이 | 사전심의 제출·결과 첨부 운영 |
| 기술적 idempotency·CAS·rollback | DPA 협상·실제 광고 문구 리스크 판단 |
| 가상 ComplianceRecord 생성·평가 | 의료기관 조직·법무 협업 |

운영 정책:
- internal beta는 **workflow technical validation** 한정
- **legal-market validation**은 외부 베타 1곳 확보 후 M0 public beta gate
- 외부 베타 미확보 시: 의료광고 전문 자문이 만든 샘플 케이스·익명화된 기존 광고물·mock prior-review packet 사용 + 자문 검토

#### 4.5.3 사전심의 협업 — manual-assisted workflow (INFRA2-13)

v1.0에서 사전심의 API integration 약속 안 함. **manual-assisted** 결정:

| 항목 | 정책 |
|---|---|
| submission packet | admin UI에서 PDF/ZIP export — 의료광고 콘텐츠·근거·체크리스트 포함 |
| attachments storage | R2 prefix `prior-review/{instanceId}/{recordId}/` + retention 7년 |
| `institutionType` enum | 대한의사협회·대한치과의사협회·대한한의사협회·기타 (의료기관 종별 따라) |
| submission portal URL | 기관별 URL은 admin UI에 link·운영자 manual 제출 |
| result attachment | 심의 결과 PDF 운영자가 admin UI에 upload → ComplianceRecord에 첨부 |
| legal reviewer checklist | admin UI 체크리스트 — submission 전 확인 항목 |

v1.x에서 API integration 가능 시 자동화.

#### 4.5.4 PIPA + GDPR jurisdiction checklist (INFRA2-14)

Phase 1 gate에 추가:

| 의료기관 baseline | 추가 검토 trigger | 추가 작업 |
|---|---|---|
| 한국 개인정보보호법 (PIPA) | 기본 모든 의료기관 | 개인정보 처리방침·DPA·DSR workflow |
| GDPR | EU 거주자 대상 마케팅·진료 유치·외국인 환자 CRM | DPO 지정·DPIA·data residency·right to be forgotten 확장 |

Provider DPA subprocessor 목록:
- Resend (email)·Sentry (monitoring)·Supabase (DB·Storage)·Vercel (web)·Railway (worker)·Upstash (Redis)·Cloudflare (R2·DNS)·Doppler (secrets)

Phase 1 gate fail-rule: EU 거주자 대상 의료기관 베타 시 GDPR review 통과 전 deploy 불가.

#### 4.5.5 customer domain ADR (INFRA2-12)

Phase 1 infra ADR 별도 작성. 핵심 결정 항목:

| 항목 | 옵션 |
|---|---|
| 호스팅 | Vercel native domain vs Cloudflare for SaaS |
| subdomain 전략 | wildcard (`*.glitzy.kr` per instance) vs tenant subdomain (`{hospital}.glitzy.kr`) vs 의료기관 apex (`hospital.com`) |
| SSL 자동 갱신 | Vercel 자동·Cloudflare 자동 |
| DNS verification | TXT 또는 CNAME 검증 runbook |
| staging 도메인 | `*.staging.glitzy.kr` |
| `adminBaseUrl` resolution | request hostname → instanceId 매핑 logic |

---

## 종합 결정 요약 (v0.3)

| 영역 | 결정 |
|---|---|
| 1. Multi-tenant | Single DB + `app_tenant` role + RLS ON·`withTenantTransaction` 헬퍼·worker control/tenant plane 분리·composite FK 3등급·tenant export manifest dependency class·resolveTenantContext + instance-switched audit |
| 2-1. Email | Resend (transport=api·provider=resend) + PHI 금지·DPA·Postmark fallback·provider adapter |
| 2-2. Monitoring | Sentry error 한정·DB audit·feature tables·platform log·PII scrubber |
| 2-3. Redis | Upstash (dedupe·suppression·UI throttle)·Postgres (hard quota·billing·provider quota) |
| 3. Storage | **B. Cloudflare R2 권장 (reversal)** — spec 정합·next-auth 매핑 단순·egress 0$ |
| 4-1. Phase 0 | 6~8주·Week 1 Spike A·B·C gate·M0 vertical slice schema·P0 outbox subset (notifications 4 tables 포함) |
| 4-2. 베타·법무 | DPA·legal-reviewer Phase 1 시작 gate (fixed-scope package → 시간당 → retainer)·internal beta는 workflow validation 한정·외부 베타 1곳 M0 public gate·사전심의 manual-assisted·PIPA+GDPR checklist·customer domain ADR 별도 |

---

## Storage 결정 reversal — 확정 (INFRA3-03)

이전 (Supabase Storage) → **Cloudflare R2 채택**. Supabase Storage는 rejected alternative.

변경 근거:
1. spec의 IAM·object key prefix·signed URL refresh 패턴 (search-visibility·asset-ingestion·content-migration) 그대로 적용
2. next-auth 환경에서 Supabase Auth `auth.uid()` RLS 매핑 복잡 → R2 server-only signed URL issuer로 통일
3. egress 0$ (Supabase Storage 0.09$/GB)

사용자 동의는 인프라 결정 v1.0 acceptance 시 반영.

---

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 17 지적 반영 |
| 2026-05-15 | v0.3 | codex 2차 15 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정. 4 지적 정정 완료**: (1) P0 schema 목록 NotificationEvent → NotificationEventReceipt 정정 + NotificationEvent는 입력 타입임을 명시 (INFRA3-01), (2) audit_log read path tenant-scoped RLS 정책 분리 (INFRA3-02), (3) Storage 섹션 Cloudflare R2 채택 확정·Supabase Storage rejected alternative (INFRA3-03), (4) notifications.md 예시 drift는 8 Feature spec cascade 시 정정 (INFRA3-04 — 후속 minor cascade). **3 cycle 누계 36 지적 전건 수용**. SoT cascade 완료: REVIEW_WORKFLOW (NotificationEventType 6종 + AuditAction 17종 — service-role-invoked·instance-switched 추가), DATA_MODEL v0.23 (C-08 email transport/provider 분리) |
| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |


 succeeded in 768ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.23
> **작성일**: 2026-05-15 (v0.23 — 인프라 결정 INFRA2-15 cascade: C-08 NotificationChannelsConfig.email transport·provider 분리. transport enum에 'api', provider enum에 'resend'·'postmark'·'ses'·'sendgrid'·'mailgun' 추가)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (23개)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
| `from` | `string` | ✅ | |
| `to` | `string` | ✅ | |

#### `SpecialClosure`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | |
| `reason` | `string` | optional | |
| `note` | `string` | optional | |

### CT-03. `CTAConfig` — 전환 채널 설정

**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 채널 식별자 |
| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
| `label` | `string` | ✅ | 버튼·링크 텍스트 |
| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
| `iconKey` | `string` | optional | 아이콘 식별자 |
| `style` | `enum {primary, secondary, minimal}` | optional | |
| `displayOrder` | `number` | optional | 정렬 |
| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |

> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.

---

## 4. 데이터 계약 풀명세 (M0 핵심)

### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)

**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
| `name` | `string` | ✅ | 정식 명칭 (1~100자) |
| `alternateName` | `string` | optional | 영문명 |
| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
| `slogan` | `string` | optional | 한 줄 가치 |
| `description` | `string` | ✅ | 80~300자 |
| `longDescription` | `Markdown` | optional | About 본문 |
| `foundingDate` | `Date` | optional | 설립일 |
| `founder` | `string` | optional | 대표자명 |
| `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
| `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
| `awards` | `Award[]` | optional | 인증·수상 |
| `memberOf` | `Affiliation[]` | optional | 학회·협회 |
| `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
| `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
| `logoUrl` | `URL` | ✅ | 로고 |
| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |

**하위 타입**:

#### `Address`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `streetAddress` | `string` | ✅ | 도로명 상세 |
| `addressLocality` | `string` | ✅ | 시·군 |
| `addressRegion` | `string` | ✅ | 도·광역시 |
| `postalCode` | `string` | ✅ | 우편번호 |
| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |

#### `GeoCoordinates`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `latitude` | `number` | ✅ | |
| `longitude` | `number` | ✅ | |

#### `Award`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 인증·수상명 |
| `awardedBy` | `string` | optional | 수여 기관 |
| `awardedDate` | `Date` | optional | |
| `verificationUrl` | `URL` | optional | 검증 가능 링크 |

#### `Affiliation`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 학회·협회명 |
| `role` | `string` | optional | |
| `url` | `URL` | optional | |
| `verified` | `boolean` | optional | |

#### `ResearchInstitute`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 연구 기관명 |
| `description` | `string` | optional | |
| `url` | `URL` | optional | |
| `relationship` | `enum {affiliate, partner, owned}` | optional | |

#### `SocialMediaLinks`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `naverBlog` | `URL` | optional | |
| `instagram` | `URL` | optional | |
| `youtube` | `URL` | optional | |
| `kakao` | `URL` | optional | |
| `facebook` | `URL` | optional | |
| `linkedin` | `URL` | optional | |
| `others` | `{label: string, url: URL}[]` | optional | |

#### `MediaItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `outlet` | `string` | ✅ | 매체명 |
| `title` | `string` | ✅ | |
| `date` | `Date` | optional | |
| `url` | `URL` | optional | |

#### `InternationalSupport`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `languages` | `string[]` | ✅ | ISO 639-1 |
| `interpreterAvailable` | `boolean` | optional | |
| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
| `targetCountries` | `string[]` | optional | |

### C-02. `DoctorProfile` — 의료진 권위·전문성

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `alternateName` | `string` | optional | 영문명 |
| `jobTitle` | `string` | ✅ | 직책 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
| `briefBio` | `string` | ✅ | 50~200자 |
| `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
| `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
| `photoUrl` | `URL` | optional | |
| `credentials` | `Credential[]` | ✅ | 최소 1개 |
| `education` | `Education[]` | optional | |
| `career` | `CareerItem[]` | optional | |
| `affiliations` | `Affiliation[]` | optional | |
| `publications` | `Publication[]` | optional | |
| `media` | `MediaItem[]` | optional | |
| `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
| `email` | `Email` | optional | |
| `socialMedia` | `SocialMediaLinks` | optional | |
| `consultationAvailable` | `boolean` | optional | 기본 `true` |
| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |

**하위 타입**:

#### `Credential`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {license, certification, board}` | ✅ | |
| `name` | `string` | ✅ | |
| `issuedBy` | `string` | optional | |
| `issuedDate` | `Date` | optional | |
| `expiryDate` | `Date` | optional | |

#### `Education`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `institution` | `string` | ✅ | |
| `degree` | `string` | ✅ | |
| `period` | `string` | optional | 예: `"2010-2016"` |

#### `CareerItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `organization` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `period` | `string` | optional | |

#### `Publication`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | |
| `venue` | `string` | optional | 학회지·매체 |
| `year` | `number` | optional | |
| `url` | `URL` | optional | |

### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~80자 |
| `alternateName` | `string` | optional | |
| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
| `category` | `string` | optional | 시술 카테고리 |
| `medicalSpecialty` | `Ref<C-14>` | optional | |
| `overview` | `Markdown` | ✅ | 개요 |
| `mechanism` | `Markdown` | ✅ | 원리 |
| `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
| `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
| `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
| `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
| `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
| `duration` | `string` | optional | 소요 시간 |
| `sessionCount` | `string` | optional | 권장 횟수 |
| `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
| `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
| `aftercare` | `Markdown` | optional | 시술 후 관리 |
| `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
| `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
| `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
| `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
| `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
| `heroImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |

**하위 타입**:

#### `ProcessStep`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | 단계 번호 |
| `name` | `string` | ✅ | 단계명 |
| `description` | `Markdown` | ✅ | |
| `durationMinutes` | `number` | optional | |

#### `TreatmentComponent` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
| `description` | `Markdown` | optional | |
| `included` | `boolean` | optional | 패키지 포함 여부 (default true) |

#### `VisitFlowStep` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | |
| `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
| `description` | `Markdown` | optional | |
| `durationMinutes` | `number` | optional | |
| `location` | `enum {clinic, remote, both}` | optional | |

#### `ProgramVariant`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
| `duration` | `string` | ✅ | 기간 |
| `sessionCount` | `string` | optional | 세션 수 |
| `targetSegment` | `string` | optional | 대상 분류 |
| `briefDescription` | `Markdown` | ✅ | |
| `includes` | `string[]` | optional | 포함 항목 |
| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |

#### `EvidenceNote` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
| `summary` | `string` | optional | 간략 요약 |
| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
| `publishedYear` | `number` | optional | |
| `verifiedBy` | `string` | optional | 검증자·기관 |

#### `SlotRiskOverride`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
| `level` | `RiskLevel` | ✅ | 격상 등급 |
| `reason` | `string` | ✅ | 감사 추적용 |

### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `headline` | `string` | ✅ | 1~120자 |
| `summary` | `string` | ✅ | 80~200자 |
| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
| `author` | `Ref<C-02>` | ✅ | 저자 |
| `coAuthors` | `Ref<C-02>[]` | optional | |
| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
| `datePublished` | `Date` | ✅ | 최초 발행일 |
| `dateModified` | `Date` | ✅ | 최종 수정일 |
| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
| `tags` | `string[]` | optional | |
| `readingTimeMinutes` | `number` | optional | 자동 계산 |
| `wordCount` | `number` | optional | 자동 계산 |
| `coverImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
| `relatedArticles` | `Ref<C-04>[]` | optional | |
| `relatedTreatments` | `Ref<C-03>[]` | optional | |
| `relatedConditions` | `Ref<C-11>[]` | optional | |
| `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |

**ArticleType ↔ 자동 추론 위험도**:

| ArticleType | 자동 위험도 | 운영자 오버라이드 |
|---|:---:|:---:|
| `notice` | Low | ✅ |
| `general-medical-info` | Medium | ✅ |
| `treatment-explainer` | Medium | ✅ |
| `condition-explainer` | Medium | ✅ |
| `effect-result-related` | High | ✅ (낮출 수 없음) |
| `review-case` | High | ✅ (낮출 수 없음) |
| `event-price` | High | ✅ (낮출 수 없음) |

**하위 타입**:

#### `EmbeddedMedia`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
| `url` | `URL` | ✅ | |
| `title` | `string` | optional | |
| `caption` | `string` | optional | |
| `durationSeconds` | `number` | optional | |
| `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |

**컴플라이언스 주의**:
- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
- `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
- `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).

### C-05. `RiskLevel` (enum) — 위험도 등급

```ts
type RiskLevel = "Low" | "Medium" | "High";
```

**v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).

> 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.

### C-06. `PageMeta` — 페이지별 메타 데이터

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | 10~70자, `<title>` |
| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
| `canonical` | `URL` | optional | 미지정 시 자동 생성 |
| `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
| `ogTitle` | `string` | optional | 미지정 시 `title` |
| `ogDescription` | `string` | optional | 미지정 시 `description` |
| `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
| `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
| `noIndex` | `boolean` | optional | 기본 `false` |

> 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.

### C-07. `BrandTokens` — 디자인 토큰 최종값

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
| `colors` | `ColorTokens` | ✅ | 색 토큰 |
| `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
| `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
| `radius` | `RadiusScale` | ✅ | |
| `shadow` | `ShadowScale` | ✅ | |
| `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
| `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |

> 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.

### C-08. `InstanceManifest` — 버전 고정 명세

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `instanceId` | `Slug` | ✅ | |
| `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
| `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
| `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
| `lastReleaseApprovedAt` | `Date` | optional | |

#### `RobotsOverride` (v0.11 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
| `allow` | `string[]` | optional | Allow 경로 목록 |
| `disallow` | `string[]` | optional | Disallow 경로 목록 |
| `note` | `string` | optional | 운영자 메모 |

#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
| `clsOverride` | `number` | optional | CLS budget 강화 override |
| `tbtMsOverride` | `number` | optional | |
| `bundleSizeKbOverride` | `number` | optional | |
| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |

#### `NotificationChannelsConfig` (v0.13 확장)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |

> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).

#### `VersionSpec`
SemVer 형식 (`"1.4.2"`).

#### `IANATimezone` (v0.13 신규)

IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.

#### `AnalyticsConfig` (v0.14 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
| `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |

> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).

#### `SearchVisibilityConfig` (v0.16 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.

#### `KeywordMonitoringConfig` (v0.17 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).

#### `AssetIngestionConfig` (v0.18 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
| `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
| `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |

#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)

SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
| `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
| `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
| `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
| `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
| `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |

> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).

#### `CrmSyncConfig` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |

#### `CrmIntegrationEntry` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | string | ✅ | integration 식별자 (instance scope unique) |
| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
| `apiUrl` | URL | ✅ | provider endpoint |
| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
| `legalApprovedBy` | string | ✅ | |
| `legalApprovedAt` | Date | ✅ | |
| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)

솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |

> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.

#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)

법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |

### C-09. `FeatureModuleConfig` — Feature Module 설정

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `moduleName` | `string` | ✅ | 모듈 식별자 |
| `enabled` | `boolean` | ✅ | |
| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |

### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록

**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)

#### 어드민 DB 원본 (풀데이터)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `instanceId` | `Slug` | ✅ | |
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
| `articleType` | `string` | optional | (Article인 경우) |
| `inlineRiskFlags` | `string[]` | optional | |
| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
| `peerReviewedAt` | `Date` | ✅ | |
| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
| `physicianApprovedAt` | `Date` | optional | |
| `clientApprover` | `string` | optional | |
| `clientApprovedAt` | `Date` | optional | |
| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
| `priorReviewSubmissionId` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
| `attachments` | `Attachment[]` | optional | 증빙 파일 |
| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |

#### `MediaThresholdAssessment` (v0.14 +)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
| `windowEnd` | `Date` | ✅ | |
| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |

> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.

#### `WarningAcknowledgement` (v0.8 +)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
| `operatorId` | `string` | ✅ | operator 사용자 ID |
| `timestamp` | `Date` | ✅ | |
| `note` | `string` | optional | 메모 |

#### `StaleFlags`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
| `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
| `triggeredAt` | `Date` | optional | |

#### Git 사본 (경량 빌드 참조)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
| `articleType` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | |
| `publishedAt` | `Date` | ✅ | schema datePublished |
| `lastModifiedAt` | `Date` | ✅ | schema dateModified |

### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)

**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).

**참조 페이지 타입**: P-013
**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
| `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
| `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
| `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
| `effectiveDate` | `Date` | ✅ | 시행일 |
| `lastRevisedDate` | `Date` | optional | 최종 개정일 |
| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
| `contactEmail` | `Email` | optional | 정책 문의 채널 |

**하위 타입**:

#### `LegalDocumentRevision`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | 개정일 |
| `summary` | `string` | ✅ | 개정 내용 요약 |
| `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |

**컴플라이언스 룰**:
- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.

### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)

**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
| `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
| `branchDescription` | `string` | optional | 50~200자 |
| `address` | `Address` | ✅ | 지점 주소 |
| `geo` | `GeoCoordinates` | optional | |
| `telephone` | `Phone` | ✅ | 지점 직통 |
| `fax` | `Phone` | optional | |
| `email` | `Email` | optional | 지점 이메일 |
| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
| `images` | `URL[]` | optional | |
| `transportInfo` | `Markdown` | optional | |
| `parkingInfo` | `Markdown` | optional | |
| `openingDate` | `Date` | optional | 지점 개원일 |
| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
| `branchCode` | `string` | optional | |
| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |

> v0.4 → v0.6 강조 채널 표기 변천:
> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조

> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.

### C-22. `ArticleCategory` — Article Pillar 분류

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `description` | `string` | optional | 80~200자 |
| `pillar` | `string` | optional | 상위 Pillar |
| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
| `coverImageUrl` | `URL` | optional | |
| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
| `displayOrder` | `number` | optional | |
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ`
필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.

### C-13. `ReviewPolicy`
필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**

### C-14. `MedicalSpecialty`
필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.

### C-15. `SchemaInput`
JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.

### C-17. `PricingPage`
필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**

### C-18. `FacilitiesPage`
필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.

### C-19. `NewsItem`
필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**

### C-20. `ReservationPage`
필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.

### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)

**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
| `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
| `displayName` | `string` | ✅ | 어드민 UI 표시명 |
| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
| `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
| `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
| `lastLoginAt` | `Date` | optional | |
| `createdAt` | `Date` | ✅ | |

#### `NotificationPreferences` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
| `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |

#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
| `firstObservedAt` | `Date` | ✅ | |
| `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
| `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
| `unsuppressedAt` | `Date` | optional | |

---

## 6. 관계 다이어그램

```
ClinicProfile (C-01)
   ├─ trustMetrics → TrustMetric[] (CT-01)
   ├─ primaryCtas → CTAConfig[] (CT-03)
   ├─ medicalSpecialty → MedicalSpecialty (C-14)
   ├─ affiliatedInstitutes → ResearchInstitute
   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+

LocationProfile (C-21) — 위치·시간·연락 SoT
   ├─ businessHours → BusinessHours (CT-02)
   ├─ reservationChannels → CTAConfig[] (CT-03)
   ├─ parentClinic → ClinicProfile (C-01)
   ├─ representativeDoctors → DoctorProfile[]
   ├─ doctorsAtLocation → DoctorProfile[]
   └─ availableTreatments → TreatmentPage[]

DoctorProfile (C-02)
   ├─ primaryLocation → LocationProfile (C-21)
   ├─ additionalLocations → LocationProfile[]
   └─ trustMetrics → TrustMetric[] (CT-01)

TreatmentPage (C-03)
   ├─ cta → CTAConfig (CT-03)
   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
   ├─ relatedDoctors → DoctorProfile[]
   ├─ relatedConditions → MedicalConditionPage[]
   └─ pageRiskLevel → RiskLevel (직접 enum)

Article (C-04)
   ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
   ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
   ├─ category → ArticleCategory (C-22)
   ├─ contentSource / externalUrl (v0.4)
   ├─ embeddedMedia → EmbeddedMedia[]
   └─ pageRiskLevel → RiskLevel

ComplianceRecord (C-10)
   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
   └─ pageRiskLevel → RiskLevel
```

---

## 7. 변경 정책

(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
| DM-07 | cross-reference 빌드 검증 | |
| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
| DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
| 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 785ms:
docs/features\content-migration.md
docs/features\compliance-assistant.md
docs/features\crm-sync.md
docs/features\notifications.md
docs/features\search-visibility.md
docs/features\keyword-monitoring.md
docs/features\asset-ingestion.md
docs/features\analytics-reporting.md

 succeeded in 794ms:
# Phase 0 Week 1 Spike 계획 — 3개 가설 검증 (v0.1 draft)

> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 결정**: 8 Feature spec v1.0·인프라 결정 v1.0 (`docs/decisions/INFRA_DECISIONS_DRAFT.md`)·솔로 + AI 보조·Phase 0 6~8주
> **목적**: Phase 0 Week 1 안에 가장 위험한 기술 가정 3개를 검증·통과 시 본 구현 진입·실패 시 Phase 0 scope 재조정

---

## Spike 공통 규약

### 0.1 prototype 범위 원칙 (솔로 + AI 보조)

- **목적**: production 코드 아님. **가설 검증**·**통과 기준 만족**만이 목표
- **수명**: Spike 종료 후 prototype 코드는 `apps/spike-*` 디렉토리로 archive. 본 구현은 별도 작성
- **재사용**: prototype에서 검증된 패턴은 본 구현 시 `packages/db`·`packages/core-data-model`·`packages/storage`로 격상
- **AI 보조**: Claude Code에 prototype 코드 작성 위임 가능. 단 통과 기준 검증은 직접 확인
- **기간**: 각 Spike 1~3일 (총 Week 1 안에 완료). 통과 안 되면 buffer Week 2까지

### 0.2 환경

- 로컬 docker-compose (postgres 16·redis·minio) — Supabase·Upstash·R2 외부 호출 없이 가설 검증
- 외부 provider 검증은 Spike 외 별도 smoke test (Week 2~3 본 작업)
- 의존성: Node 20 LTS·pnpm·Drizzle·Auth.js·Hono·@aws-sdk/client-s3 (R2 호환)

### 0.3 통과·실패 기준

각 Spike는 다음을 명시:
- **가설 (hypothesis)**: 검증하고자 하는 핵심 가정
- **실험 (experiment)**: 가설을 검증하는 실제 코드·쿼리·테스트
- **통과 기준 (pass criteria)**: 가설이 참임을 입증하는 측정 가능한 조건
- **실패 시 대안 (fallback)**: 통과 못 했을 때 Phase 0 scope·인프라 결정 어떻게 재조정

---

## Spike A: Drizzle + RLS + Auth.js + Supabase tenant scoping

### A.1 가설

> `withTenantTransaction(instanceId, fn)` 헬퍼 안에서 `SET LOCAL app.current_instance_id`·`SET LOCAL ROLE app_tenant`로 RLS가 적용되고, Drizzle ORM이 이 transaction 안에서 query를 실행하면 다른 instance의 row가 보이지 않는다. pgBouncer transaction pooling 환경에서도 SET LOCAL이 안전하다.

### A.2 실험 — 코드 prototype

```
apps/spike-a/
├── docker-compose.yml          # postgres 16 + pgbouncer (transaction pooling mode)
├── migrations/
│   ├── 001_create_roles.sql    # app_tenant role 생성
│   ├── 002_test_table.sql      # content_test (instance_id·title) + RLS policy
├── src/
│   ├── db.ts                   # Drizzle setup with pgbouncer
│   ├── tenant.ts               # withTenantTransaction 헬퍼
│   ├── test-rls.ts             # 실험 코드
│   └── test-bypass-attempt.ts  # 우회 시도 (lint·runtime guard 검증)
```

실험 시나리오:
1. 2개 instance 데이터 seed (`instance-a` 5건·`instance-b` 5건)
2. `withTenantTransaction('instance-a', ...)`에서 `SELECT * FROM content_test` → 5건만 보여야 함
3. `withTenantTransaction('instance-b', ...)`에서 동일 query → 다른 5건
4. transaction 밖에서 Drizzle `db.select().from(contentTest)` 직접 호출 → RLS가 모든 row 숨김 (app_tenant role + current_instance_id 미설정 → 0건)
5. pgBouncer transaction pooling 모드에서 동시 connection 10개로 시나리오 1~3 반복 → 결과 일관성
6. 의도적 SQL injection 시도 (raw input → instance_id 우회) → RLS가 차단
7. service_role connection으로 동일 query → 모든 10건 보임 (break-glass 동작 확인)
8. worker 패턴: control-plane DB connection으로 claim → instanceId 추출 → tenant DB connection으로 처리 → 2 transaction 분리 검증

### A.3 통과 기준 (pass criteria)

| 검증 항목 | 기준 |
|---|---|
| `withTenantTransaction` 안 query는 본인 instance row만 | 100% match (각 instance별 5건씩 정확히) |
| transaction 밖 direct query는 RLS로 0건 (app_tenant role 시) | 100% |
| pgBouncer transaction pooling 동시 10 connection | SET LOCAL leak 없음·각 connection 자신의 instance row만 |
| SQL injection 시도 차단 | 우회 불가 (RLS가 column 검증 무관하게 차단) |
| service_role break-glass | 모든 row 보임 + audit log entry 1건 |
| worker control/tenant plane 분리 | 2 transaction 분리·각자 RLS 적용 |
| 측정 latency | withTenantTransaction overhead < 5ms (SET LOCAL 2회 cost) |

### A.4 실패 시 대안 (fallback)

| 실패 항목 | 대안 |
|---|---|
| pgBouncer transaction pooling SET LOCAL leak | Supabase Pooler 사용·또는 pgbouncer 미사용 (direct connection) — 비용·확장성 trade-off |
| Drizzle이 SET LOCAL 호환 안 됨 | Kysely 또는 raw SQL adapter 전환 검토 |
| RLS overhead 큼 (latency > 50ms) | RLS 보조만 사용·application-level scoping 주력 (INFRA1-01 1차 결정으로 reversal) |
| service_role 격리 안 됨 | 별도 DB connection string·env 분리 강제 |

### A.5 prototype 코드 prototype (skeleton만 — 실제 작성은 본 단계 후)

```sql
-- 002_test_table.sql
CREATE ROLE app_tenant NOINHERIT;
GRANT USAGE ON SCHEMA public TO app_tenant;

CREATE TABLE content_test (
  id UUID PRIMARY KEY,
  instance_id UUID NOT NULL,
  title TEXT NOT NULL,
  CHECK (instance_id IS NOT NULL)
);

ALTER TABLE content_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_test FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON content_test
  FOR ALL TO app_tenant
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant;
```

```ts
// src/tenant.ts
export async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: PgTransaction) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL ROLE app_tenant`);
    await tx.execute(sql`SET LOCAL app.current_instance_id = ${instanceId}`);
    return fn(tx);
  });
}
```

---

## Spike B: Worker control-plane queue + tenant-plane processing

### B.1 가설

> worker가 control-plane DB connection (service_role 또는 control-plane role)으로 outbox/retry queue에서 SKIP LOCKED claim 후, instance_id를 추출해 `withTenantTransaction`으로 tenant-plane 처리한다. 2개 transaction 분리해도 idempotency·exactly-once 처리·실패 시 reclaim이 정확히 동작한다.

### B.2 실험

```
apps/spike-b/
├── migrations/
│   ├── 003_outbox.sql          # outbox table + RLS 미적용 (control-plane)
│   ├── 004_inbox.sql           # 처리 결과 저장 (tenant-plane·RLS 적용)
├── src/
│   ├── claim.ts                # SKIP LOCKED claim 패턴
│   ├── process.ts              # tenant 처리 + 결과 insert
│   ├── worker.ts               # 5개 동시 worker 시뮬레이션
│   └── test-concurrency.ts     # 100건 outbox seed → 5 worker 동시 처리
```

실험 시나리오:
1. outbox에 100건 seed (50건 `instance-a`·50건 `instance-b`)
2. 5개 worker 동시 실행 (각자 claim → process → mark completed)
3. 모든 outbox row가 정확히 1번 처리됨 (duplicate 없음·누락 없음)
4. tenant-plane inbox row는 각 instance별 50건만 (cross-instance 누설 없음)
5. worker 중 1개가 강제 종료 시뮬레이션 (claim 후 process 전 SIGKILL) → stale lock reclaim 후 다른 worker가 재처리 (총 처리 100건 유지)
6. process 실패 시 retry 등록 → backoff 후 재시도 → 성공 시 outbox completed
7. control-plane connection은 RLS 미적용 (모든 instance outbox 볼 수 있어야 claim 가능)
8. tenant-plane connection은 RLS 적용 (해당 instance만)

### B.3 통과 기준

| 검증 항목 | 기준 |
|---|---|
| 100건 정확히 1번 처리 | duplicate 0건·누락 0건 |
| 5 worker 동시 처리 시 race condition 없음 | SKIP LOCKED 효과 검증 |
| tenant inbox row instance 격리 | cross-instance 누설 0건 |
| stale lock reclaim | 5분 (테스트는 5초로 단축) 후 다른 worker가 재처리 |
| 2 transaction 분리 | control transaction commit 후 tenant transaction 진행 |
| retry backoff | 1초·5초·30초 (테스트 단축값) 정확히 동작 |
| failed-permanent 전이 | maxAttempts 도달 시 정확히 1번 sink alert |
| 처리량 | 5 worker × 100 outbox 처리 시간 < 30초 (로컬) |

### B.4 실패 시 대안

| 실패 항목 | 대안 |
|---|---|
| SKIP LOCKED race | advisory lock per instance·또는 outbox partition |
| 2 transaction 사이 worker crash | outbound state machine + reconcile worker (모든 spec feature가 이 패턴 있음) |
| tenant transaction 진입 후 RLS 적용 안 됨 | role 전환 시점 재검증 |
| stale lock reclaim 동작 안 함 | lock TTL을 DB row column으로 명시·worker 외부 cron이 reclaim |

---

## Spike C: Cloudflare R2 signed URL + instance prefix + IAM isolation

### C.1 가설

> Cloudflare R2 (S3 호환 API) object key prefix `{feature}/{instanceId}/{date}/{artifactId}`로 의료기관별 데이터 격리. server-only signed URL issuer가 instanceMembership 검증 후 presigned URL 발급. IAM PolicyDocument로 worker가 다른 instance prefix에 접근 불가. signed URL TTL 600초·만료 60초 전 자동 refresh.

### C.2 실험

```
apps/spike-c/
├── docker-compose.yml          # minio (S3 호환·로컬 R2 대용)
├── src/
│   ├── r2-client.ts            # @aws-sdk/client-s3 + R2 endpoint
│   ├── sign-url.ts             # presigned URL issuer
│   ├── tenant-check.ts         # instanceMembership 검증 (mock)
│   ├── test-isolation.ts       # cross-instance 접근 시도
│   └── test-refresh.ts         # TTL·refresh 시나리오
```

실험 시나리오:
1. minio bucket `spike-c-storage` 생성
2. 2개 instance object 5개씩 upload (총 10개):
   - `asset-ingestion/instance-a/2026-05-15/uuid-1.html`
   - `asset-ingestion/instance-b/2026-05-15/uuid-6.html` 등
3. instance-a 운영자로 sign URL 발급 → instance-a object 접근 가능
4. instance-a 운영자로 instance-b object sign URL 시도 → 거부 (tenant-check fail)
5. instance-a 운영자가 instance-b URL 직접 호출 시도 (URL 추측) → presigned URL이 없으므로 403
6. signed URL TTL 600초 검증 (TTL 만료 후 401)
7. 자동 refresh: 만료 60초 전 client가 새 URL 요청 → 새 presigned URL 발급
8. IAM PolicyDocument 적용 시뮬레이션 (minio는 IAM 약함 — R2 production에서 실제 검증 필요)
9. cross-instance object copy (import 시나리오) — service_role이 source object 읽기·target prefix로 copy
10. signed URL 발급 audit log 기록 (`storage-url-issued` AuditAction·향후 cascade 검토)

### C.3 통과 기준

| 검증 항목 | 기준 |
|---|---|
| instance prefix isolation | instance-a operator가 instance-b object 접근 불가 (sign URL 미발급) |
| URL 추측 공격 | 6 random + 4 timestamp + 16 artifactId → 추측 어려움·presigned URL signature 없으면 403 |
| TTL 만료 | 600초 후 정확히 401 |
| auto refresh | 만료 60초 전 client가 새 URL 발급 받음 |
| cross-instance copy (import) | service_role만 가능·audit log 기록 |
| upload size limit | spec 명시 size 검증 (asset-ingestion·content-migration rawArtifactRef) |
| MIME type 검증 | upload 시 allowlist 외 거부 |

### C.4 실패 시 대안

| 실패 항목 | 대안 |
|---|---|
| R2 signed URL 동작 안 함 | Cloudflare Workers + R2 binding으로 server-side proxy |
| minio와 R2 동작 차이 큼 | spike 일부는 R2 staging에서 실제 검증 (Week 2~3) |
| IAM PolicyDocument minio 미지원 | production R2에서만 검증·minio는 prefix isolation만 |
| upload size·MIME 검증 | 별도 validator layer + Cloudflare Worker 검사 |
| Supabase Storage로 reversal | INFRA3-03 결정 번복 — 추가 ADR 필요 |

---

## 종합 일정

| 일자 | Spike | 작업 |
|---|---|---|
| Day 1 (Mon) | A | postgres·pgbouncer setup·migration·withTenantTransaction·실험 시나리오 1~5 |
| Day 2 (Tue) | A | 시나리오 6~8·통과 기준 검증·결과 정리 |
| Day 3 (Wed) | B | outbox·claim·process·worker 5개·시나리오 1~5 |
| Day 4 (Thu) | B | 시나리오 6~8·통과 기준 검증·결과 정리 |
| Day 5 (Fri) | C | minio setup·r2-client·sign-url·시나리오 1~6 |
| Day 6 (Sat) | C | 시나리오 7~10·통과 기준 검증·결과 정리 |
| Day 7 (Sun) | 종합 | 3 Spike 결과 보고서·v1.0 결정 갱신·Phase 0 Week 2 작업 결정 |

Buffer: 통과 못 한 Spike는 Week 2 Day 8~10에 추가 진행. Week 2 Day 11~14는 본 작업 (repo·dev/staging skeleton).

---

## Spike 종료 후 의사결정

각 Spike는 다음 중 하나로 종료:

1. **PASS** — 통과 기준 모두 만족. 본 구현 진입.
2. **PASS with caveats** — 일부 기준 미달이지만 alternative로 우회 가능. 결정 doc에 caveat 명시 + Phase 0 진행.
3. **FAIL** — 핵심 가설 실패. 인프라 결정 v1.0 일부 reversal·Phase 0 scope 재조정.

---

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성·3 Spike 가설·실험·통과 기준·실패 대안 정의 |

---

## codex 비평 의뢰 사항

다음 영역을 엄정하게 비평하라:

1. **각 Spike의 가설이 인프라 결정 v1.0의 가장 위험한 가정을 정확히 짚는가**: 다른 미검증 가정 (예: Drizzle Kit migration·next-auth 매직 링크·Resend DKIM·Doppler env propagation·Sentry sampling 등)이 더 위험하지 않은가?
2. **통과 기준 측정 가능성**: 각 기준이 binary pass/fail로 평가 가능한가? "race condition 없음" 같은 negative invariant 검증 방법?
3. **실험 시나리오 누락**: 각 Spike에서 빠뜨린 critical scenario? (예: A에서 schema-per-tenant 호환성·B에서 transaction rollback·C에서 signature replay)
4. **prototype 범위 vs production 차이**: Spike 통과해도 production에서 실패할 수 있는 부분 (예: Supabase prod tier·R2 IAM의 minio 차이·Vercel serverless cold start·실제 pgBouncer config)
5. **솔로 + AI 보조 일정 현실성**: 1~3일/Spike·총 6 working days가 도전적인가?
6. **실패 시 대안의 reversal 비용**: A 실패 시 RLS 폐기는 인프라 결정 v1.0 InTV2-01 전체 reversal — 그 비용·SoT cascade 영향 평가됐는가?
7. **Spike 통과 후 후속 작업**: Phase 0 Week 2~6 작업이 Spike 결과에 어떻게 의존하는가? 단계별 의존성 그래프?
8. **누락된 Spike**: 다른 critical 가설 (예: Drizzle schema migration deploy·Auth.js session refresh·Cloudflare for SaaS·환경별 secret propagation·local docker-compose 의존성 호환)?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKE1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (인프라 결정 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\features\*.md` (8 Feature v1.0)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`


 succeeded in 792ms:
# Admin — 검수 워크플로

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 / `docs/admin/ARCHITECTURE.md` (v0.7)
> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 사용자별 권한·승인자 식별 정보 노출 주의.
> **연관 문서**:
> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
> - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
> - 어드민 화면 구성 → `docs/admin/ARCHITECTURE.md`

---

## 0. 한 페이지 요약

- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 상태 머신 enum 변경 | **MAJOR** | 진행 중 콘텐츠 영향 |
| 큐 진입 트리거 변경 | **MAJOR** | 미검수 콘텐츠 발생 가능 |
| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
| 화면·UX 변경 | MINOR | |
| 알림 채널 추가 | MINOR | |
| 감사 로그 필드 추가 | PATCH (append-only) | |

### 1.2 SoT 원칙

- 본 문서 = **검수 워크플로 운영 SoT** — 상태 머신·큐·승인 흐름·권한
- ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)

### 1.3 본 문서가 다루지 않는 영역

- 데이터 계약 자체 — `DATA_MODEL.md`
- 룰 카탈로그·자동 추론 알고리즘 — `RISK_LEVELS.md`
- UI 시각 디자인 — `DESIGN_TOKENS.md`·`admin/ARCHITECTURE.md`

---

## 2. 워크플로 상태 머신

### 2.1 상태 enum

```ts
type ContentWorkflowState =
  | "draft"           // 작성 중 — 자동 검수 미실행
  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
  | "approved"        // 필요한 모든 역할의 승인 완료
  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
  | "published"       // 발행됨 (Git 사본 생성)
  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
  | "rejected"        // 검수자가 명시적 거부
  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
```

### 2.2 전이 다이어그램

```
                            ┌──────────────────────┐
                            │       draft          │
                            └──────────┬───────────┘
                                       │ submit-for-review (작성자) 또는 자동 트리거 (§ 3.2)
                                       ▼
                            ┌──────────────────────┐
              ┌────────────►│   review-queued      │
              │             └──────────┬───────────┘
              │                        │ assign (검수자 픽업)
              │                        ▼
              │             ┌──────────────────────┐
              │             │     in-review        │
              │             └──┬──────┬────────────┘
              │                │      │
              │     reject     │      │ approve (해당 역할)
              │   (검수자)     │      ▼
              │                │   ┌─────────────────────────────┐
              │                │   │ AND 게이트 평가 (§ 4.5)     │
              │                │   │  모든 ApproverRole 충족?    │
              │                │   └────┬──────────┬──────────────┘
              │                │       Y           N (다음 역할 검수)
              │                │       ▼           │
              │                │  ┌──────────┐     │
              │                │  │ approved │     ┘
              │                │  └────┬─────┘
              │                │       │ automatedDecision != block 재확인
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │ publishable  │
              │                │  └────┬─────────┘
              │                │       │ publish (운영자 발행 액션)
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │  published   │
              │                │  └────┬─────────┘
              │                │       │ staleFlags 발생 (§ 6)
              │                │       ▼
              │                │  ┌──────────┐
              │                │  │  stale   │
              │                │  └────┬─────┘
              │                │       │ 재검수 큐 진입
              │                └────►──┘
              │                ▼
              │       ┌──────────────┐
              │       │   rejected   │
              │       └──────┬───────┘
              │              │ 작성자가 본문 정정 후 재제출
              └──────────────┘

draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
```

### 2.3 전이 트리거

| 전이 | 트리거 | 권한 |
|---|---|---|
| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |

---

## 3. 검수 큐 (Review Queues)

### 3.1 큐 종류 3종

| 큐 | 진입 조건 | 우선순위 | 처리자 |
|---|---|---|---|
| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |

#### 3.1.1 warning 큐 이탈 조건·기록

- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)

#### 3.1.2 content-gate와 warning 동시 발생 처리

ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)

### 3.2 자동 큐 진입 트리거

다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:

- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
- 자동 위험도 추론 결과 — High 등급
- StaleFlags 발생:
  - 의료법 개정 (`medical-law-revision-<id>`)
  - 콘텐츠 본문 RiskRule 매칭 텍스트 변경
  - 가격·ReviewPolicy·전후사진 미디어 변경
  - 의료진 자격·인증 변경
  - 인용 외부 링크 만료
- LegalDocument 발행 의무(C-10 LegalDocument required)
- 운영자 수동 트리거

### 3.3 우선순위·SLA

| 처리 영역 | SLA 목표 | 알림 정책 SoT |
|---|---|---|
| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |

SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).

> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.

---

## 4. multi-role AND 게이트

### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)

콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:

```
riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
            = ComplianceRecord.pageRiskLevel 출력 결과

finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
           ∪ (riskLevel ∈ {Medium, High} ? medical : ∅)               // 등급 기본 요구
           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
```

**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):

`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.

> **개념 정리**:
> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.

### 4.2 검수자별 검수 화면

| 역할 | 검수 화면 책임 |
|---|---|
| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
| **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |

### 4.3 승인 액션

각 검수자는 자신의 역할에 한해 다음 액션 수행:

| 액션 | 결과 |
|---|---|
| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |

### 4.4 자동 차단

- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)

---

## 5. ComplianceRecord 슬롯 채움 흐름

### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)

approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:

| ApproverRole | 갱신 필드 |
|---|---|
| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |

### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)

DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.

**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
- 어드민 내부 저장소에만 존재. Git 사본·정적 빌드에 영향 없음

**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
- Git 사본·정적 빌드에 반영

### 5.3 갱신 시점

| 시점 | 동작 | 대상 |
|---|---|---|
| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |

### 5.4 ComplianceRecord 불변성·버전 모델

- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
- staleFlags 외 필드 수정 시도 — 빌드/API fail

---

## 6. StaleFlags 처리

### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)

| 트리거 이벤트 | 설정되는 flag |
|---|---|
| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
| 콘텐츠 본문 RiskRule 매칭 텍스트 영역 변경 | `medical=true` |
| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
| 의료진 자격·인증 변경 (DoctorProfile) | `medical=true` |
| 인용 외부 링크 만료 (404·5xx) | `medical=true` |
| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
| ReviewPolicy 변경 | `legal=true` |
| 전후사진 미디어 첨부·교체 | `legal=true` |
| 본문 일반 변경 | `operator=true` |
| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |

각 이벤트는 `triggeredBy`·`triggeredAt` 동시 기록.

### 6.2 stale 큐 진입·처리

- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)

### 6.3 staleFlags 우선순위

여러 flag가 동시 발생 시 우선순위:

```
legal > medical > client > operator
```

- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
- 또는 병렬 처리 허용 (기본값)

---

## 7. 발행 결정

### 7.1 publishable 산정 알고리즘

콘텐츠가 `publishable` 상태가 되기 위한 조건:

```
publishable = (1) automatedDecision !== "block"
           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
           ∧ (4) staleFlags 모두 false 또는 미설정
           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
```

위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)

### 7.2 publish 액션

- 권한: `super-admin`·`operator` (역할별 운영 정책)
- 입력: 콘텐츠 @id
- 검증: § 7.1 재실행 (auth time-of-use)
- 결과:
  - `published` 상태 전이
  - ComplianceRecord `publishedAt`·`publishedBy` 기록
  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
  - 빌드 트리거 (정적 사이트 재빌드)

### 7.3 unpublish 액션

- 권한: `super-admin`만
- 결과:
  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
  - Git 사본 제거
  - 재발행 시 워크플로 재실행

---

## 8. 사전심의 (priorReview) 흐름

### 8.1 priorReviewRequired 판정

**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:

1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)

**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
- 매체 분류 (시행령 제24조제1항·제2항)
- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
- 의료광고 정의(제56조제1항) 결합 판정

판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
- `ComplianceRecord.priorReviewRequired=true|false`
- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
- `mediaThresholdOperationalInput` 슬롯 (rolling operational 입력 자료 — 감사 보존)

#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거

`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).

```ts
async function enqueueMediaThresholdReassessment(input: {
  instanceId: Slug;
  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
  newState: "threshold-reached" | "threshold-released";
  assessmentBasisDate: ISODateString;
  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
}): Promise<{ enqueuedCount: number; reassessmentBatchId: string }>
```

**동작**:
1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
8. `analytics-reporting`이 자동 발송하는 `media-threshold-*` 이벤트는 운영 alert 성격 — 법적 판정 자체는 본 워크플로 책임

**priorReviewRequired 산정 기준 분리** (AR2-08):
- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록

### 8.2 사전심의 대상인 경우

```
1. legal 검수자 priorReviewRequired=true 기록
2. 운영자가 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출
3. 제출 ID 기록 — priorReviewSubmissionId
4. 심의 결과 도착 (외부)
5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
7. publishable 조건 § 7.1 (3) 충족
```

### 8.3 priorReview 상태 추적 화면

어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

### 9.2 알림 페이로드

본 절은 두 단계 타입을 정의:
- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
- **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)

```ts
type NotificationEvent = {
  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
  eventType: NotificationEventType;                    // § 9.1 enum
  contentRef: string;                                  // 대상 콘텐츠 @id
  contentTitle: string;
  recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
  createdAt: ISODateString;
};

type NotificationRecipient = {
  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
  recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
};

type NotificationPayload = {
  payloadId: string;                                   // UUID — fan-out 단위 ID
  eventId: string;                                     // 상위 NotificationEvent 참조
  eventType: NotificationEventType;
  contentRef: string;
  contentTitle: string;
  recipientId: string;                                 // 단건 수신자
  recipientRole: ApproverRole | "author" | "operations";
  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
  criticality: "critical" | "high" | "normal";
  metadata: object;
  createdAt: ISODateString;
};
```

#### 9.2.1 idempotency 계약

- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)

### 9.3 알림 채널·운영

- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
- Slack은 **2가지 동작 모드 분기**:
  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2

---

## 10. 감사 로그 (Audit Log)

### 10.1 기록 대상

- 모든 워크플로 상태 전이
- 모든 검수자 액션 (approve·reject·request-changes·delegate)
- ComplianceRecord 슬롯 갱신
- staleFlags 발생·해제
- publish·unpublish
- 권한 변경·로그인·로그아웃
- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적

### 10.2 audit log 페이로드

```ts
type AuditLogEntry = {
  id: string;                 // UUID
  timestamp: ISODateString;
  actorId: string;             // 사용자 ID 또는 "system" (자동 트리거)
  actorRole: AdminUserRole;
  action: AuditAction;          // § 10.2.1 enum
  contentRef: string;
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted"           // CM4-05 — abortRun
  // 인프라 결정 cascade (INFRA2-02·08)
  | "service-role-invoked"                    // INFRA2-02 — service_role break-glass 사용 추적
  | "instance-switched";                      // INFRA2-08 — super-admin cross-instance 전환
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

---

## 11. 권한·역할

### 11.1 AdminUserRole enum

```ts
type AdminUserRole =
  | "super-admin"        // 모든 권한 (Glitzy 운영팀)
  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
  | "physician-reviewer"  // medical 역할 검수만
  | "legal-reviewer"      // legal 역할 검수만
  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
```

### 11.2 권한 매트릭스

| 액션 | super-admin | operator | physician | legal | client |
|---|:---:|:---:|:---:|:---:|:---:|
| 콘텐츠 작성·편집 | ✅ | ✅ | | | |
| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
| operator approve | ✅ | ✅ | | | |
| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
| publish | ✅ | ✅ | | | |
| unpublish | ✅ | | | | |
| 권한 관리 | ✅ | | | | |
| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |

> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
> - medical: DoctorProfile (C-02) 등록 + `credentials[]` 항목으로 의료진 자격 인증 검증
> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
> - client: 클라이언트 측 위임 권한 (RL-05)
>
> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
>
> **자격 검증 알고리즘 구현 영역**: medical 도메인 자격 매칭(한의 콘텐츠 → 한의사 등) 자동 판정은 RISK_LEVELS RL-03 미결정 영역. v1.0에서는 어드민 운영자가 자격 매칭 수동 검증·기록.

### 11.3 역할 위임

- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
- 다른 역할로의 위임 금지 — 검수 자격 분리 원칙

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AW-01 | 검수자 라운드로빈 알고리즘 (assign 자동화) — FIFO vs 워크로드 기반 | M2+ |
| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
| AW-03 | 외부 법무법인 식별자 데이터 모델 (RISK_LEVELS RL-04와 동일) | DATA_MODEL 후속 |
| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |

---

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |


codex
대상 문서는 세 Spike를 인프라 결정의 gate로 잘 끌고 왔지만, 로컬 대역(minio/docker)과 실제 provider/Supabase/Vercel 환경 사이의 차이가 꽤 큽니다. 이제 feature 문서에서 storage, worker, auth/session, migration 의존 신호를 빠르게 훑고 지적을 구조화하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "R2|signed URL|object key|SKIP LOCKED|outbox|retry|idempot|Auth|next-auth|Drizzle|migration|Doppler|Cloudflare for SaaS|secretRef|pgBouncer|Supabase|tenant|instance" docs/features docs/decisions docs/core docs/admin' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ready_for_acceptance|findings|blocking|major|minor|recommendations|issues" docs -g "*.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Recurse -File docs | Where-Object { $_.Name -match '"'REVIEW|CRITIQUE|DRAFT|DECISION' } | Select-Object -ExpandProperty FullName" in C:\Users\assag\solution\website-exposure
 succeeded in 694ms:
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:22:- 로컬 docker-compose (postgres 16·redis·minio) — Supabase·Upstash·R2 외부 호출 없이 가설 검증
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:24:- 의존성: Node 20 LTS·pnpm·Drizzle·Auth.js·Hono·@aws-sdk/client-s3 (R2 호환)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:36:## Spike A: Drizzle + RLS + Auth.js + Supabase tenant scoping
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:40:> `withTenantTransaction(instanceId, fn)` 헬퍼 안에서 `SET LOCAL app.current_instance_id`·`SET LOCAL ROLE app_tenant`로 RLS가 적용되고, Drizzle ORM이 이 transaction 안에서 query를 실행하면 다른 instance의 row가 보이지 않는다. pgBouncer transaction pooling 환경에서도 SET LOCAL이 안전하다.
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:47:├── migrations/
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:48:│   ├── 001_create_roles.sql    # app_tenant role 생성
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:49:│   ├── 002_test_table.sql      # content_test (instance_id·title) + RLS policy
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:51:│   ├── db.ts                   # Drizzle setup with pgbouncer
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:52:│   ├── tenant.ts               # withTenantTransaction 헬퍼
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:58:1. 2개 instance 데이터 seed (`instance-a` 5건·`instance-b` 5건)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:59:2. `withTenantTransaction('instance-a', ...)`에서 `SELECT * FROM content_test` → 5건만 보여야 함
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:60:3. `withTenantTransaction('instance-b', ...)`에서 동일 query → 다른 5건
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:61:4. transaction 밖에서 Drizzle `db.select().from(contentTest)` 직접 호출 → RLS가 모든 row 숨김 (app_tenant role + current_instance_id 미설정 → 0건)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:62:5. pgBouncer transaction pooling 모드에서 동시 connection 10개로 시나리오 1~3 반복 → 결과 일관성
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:63:6. 의도적 SQL injection 시도 (raw input → instance_id 우회) → RLS가 차단
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:65:8. worker 패턴: control-plane DB connection으로 claim → instanceId 추출 → tenant DB connection으로 처리 → 2 transaction 분리 검증
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:71:| `withTenantTransaction` 안 query는 본인 instance row만 | 100% match (각 instance별 5건씩 정확히) |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:72:| transaction 밖 direct query는 RLS로 0건 (app_tenant role 시) | 100% |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:73:| pgBouncer transaction pooling 동시 10 connection | SET LOCAL leak 없음·각 connection 자신의 instance row만 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:76:| worker control/tenant plane 분리 | 2 transaction 분리·각자 RLS 적용 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:83:| pgBouncer transaction pooling SET LOCAL leak | Supabase Pooler 사용·또는 pgbouncer 미사용 (direct connection) — 비용·확장성 trade-off |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:84:| Drizzle이 SET LOCAL 호환 안 됨 | Kysely 또는 raw SQL adapter 전환 검토 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:92:CREATE ROLE app_tenant NOINHERIT;
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:93:GRANT USAGE ON SCHEMA public TO app_tenant;
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:97:  instance_id UUID NOT NULL,
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:99:  CHECK (instance_id IS NOT NULL)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:105:CREATE POLICY tenant_isolation ON content_test
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:106:  FOR ALL TO app_tenant
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:107:  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:108:  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:110:GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant;
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:114:// src/tenant.ts
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:116:  instanceId: string,
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:120:    await tx.execute(sql`SET LOCAL ROLE app_tenant`);
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:121:    await tx.execute(sql`SET LOCAL app.current_instance_id = ${instanceId}`);
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:129:## Spike B: Worker control-plane queue + tenant-plane processing
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:133:> worker가 control-plane DB connection (service_role 또는 control-plane role)으로 outbox/retry queue에서 SKIP LOCKED claim 후, instance_id를 추출해 `withTenantTransaction`으로 tenant-plane 처리한다. 2개 transaction 분리해도 idempotency·exactly-once 처리·실패 시 reclaim이 정확히 동작한다.
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:139:├── migrations/
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:140:│   ├── 003_outbox.sql          # outbox table + RLS 미적용 (control-plane)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:141:│   ├── 004_inbox.sql           # 처리 결과 저장 (tenant-plane·RLS 적용)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:143:│   ├── claim.ts                # SKIP LOCKED claim 패턴
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:144:│   ├── process.ts              # tenant 처리 + 결과 insert
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:146:│   └── test-concurrency.ts     # 100건 outbox seed → 5 worker 동시 처리
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:150:1. outbox에 100건 seed (50건 `instance-a`·50건 `instance-b`)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:152:3. 모든 outbox row가 정확히 1번 처리됨 (duplicate 없음·누락 없음)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:153:4. tenant-plane inbox row는 각 instance별 50건만 (cross-instance 누설 없음)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:155:6. process 실패 시 retry 등록 → backoff 후 재시도 → 성공 시 outbox completed
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:156:7. control-plane connection은 RLS 미적용 (모든 instance outbox 볼 수 있어야 claim 가능)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:157:8. tenant-plane connection은 RLS 적용 (해당 instance만)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:164:| 5 worker 동시 처리 시 race condition 없음 | SKIP LOCKED 효과 검증 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:165:| tenant inbox row instance 격리 | cross-instance 누설 0건 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:167:| 2 transaction 분리 | control transaction commit 후 tenant transaction 진행 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:168:| retry backoff | 1초·5초·30초 (테스트 단축값) 정확히 동작 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:170:| 처리량 | 5 worker × 100 outbox 처리 시간 < 30초 (로컬) |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:176:| SKIP LOCKED race | advisory lock per instance·또는 outbox partition |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:178:| tenant transaction 진입 후 RLS 적용 안 됨 | role 전환 시점 재검증 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:183:## Spike C: Cloudflare R2 signed URL + instance prefix + IAM isolation
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:187:> Cloudflare R2 (S3 호환 API) object key prefix `{feature}/{instanceId}/{date}/{artifactId}`로 의료기관별 데이터 격리. server-only signed URL issuer가 instanceMembership 검증 후 presigned URL 발급. IAM PolicyDocument로 worker가 다른 instance prefix에 접근 불가. signed URL TTL 600초·만료 60초 전 자동 refresh.
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:193:├── docker-compose.yml          # minio (S3 호환·로컬 R2 대용)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:195:│   ├── r2-client.ts            # @aws-sdk/client-s3 + R2 endpoint
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:196:│   ├── sign-url.ts             # presigned URL issuer
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:197:│   ├── tenant-check.ts         # instanceMembership 검증 (mock)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:198:│   ├── test-isolation.ts       # cross-instance 접근 시도
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:204:2. 2개 instance object 5개씩 upload (총 10개):
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:205:   - `asset-ingestion/instance-a/2026-05-15/uuid-1.html`
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:206:   - `asset-ingestion/instance-b/2026-05-15/uuid-6.html` 등
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:207:3. instance-a 운영자로 sign URL 발급 → instance-a object 접근 가능
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:208:4. instance-a 운영자로 instance-b object sign URL 시도 → 거부 (tenant-check fail)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:209:5. instance-a 운영자가 instance-b URL 직접 호출 시도 (URL 추측) → presigned URL이 없으므로 403
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:210:6. signed URL TTL 600초 검증 (TTL 만료 후 401)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:211:7. 자동 refresh: 만료 60초 전 client가 새 URL 요청 → 새 presigned URL 발급
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:212:8. IAM PolicyDocument 적용 시뮬레이션 (minio는 IAM 약함 — R2 production에서 실제 검증 필요)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:213:9. cross-instance object copy (import 시나리오) — service_role이 source object 읽기·target prefix로 copy
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:214:10. signed URL 발급 audit log 기록 (`storage-url-issued` AuditAction·향후 cascade 검토)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:220:| instance prefix isolation | instance-a operator가 instance-b object 접근 불가 (sign URL 미발급) |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:221:| URL 추측 공격 | 6 random + 4 timestamp + 16 artifactId → 추측 어려움·presigned URL signature 없으면 403 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:224:| cross-instance copy (import) | service_role만 가능·audit log 기록 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:225:| upload size limit | spec 명시 size 검증 (asset-ingestion·content-migration rawArtifactRef) |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:232:| R2 signed URL 동작 안 함 | Cloudflare Workers + R2 binding으로 server-side proxy |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:233:| minio와 R2 동작 차이 큼 | spike 일부는 R2 staging에서 실제 검증 (Week 2~3) |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:234:| IAM PolicyDocument minio 미지원 | production R2에서만 검증·minio는 prefix isolation만 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:236:| Supabase Storage로 reversal | INFRA3-03 결정 번복 — 추가 ADR 필요 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:244:| Day 1 (Mon) | A | postgres·pgbouncer setup·migration·withTenantTransaction·실험 시나리오 1~5 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:246:| Day 3 (Wed) | B | outbox·claim·process·worker 5개·시나리오 1~5 |
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:278:1. **각 Spike의 가설이 인프라 결정 v1.0의 가장 위험한 가정을 정확히 짚는가**: 다른 미검증 가정 (예: Drizzle Kit migration·next-auth 매직 링크·Resend DKIM·Doppler env propagation·Sentry sampling 등)이 더 위험하지 않은가?
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:280:3. **실험 시나리오 누락**: 각 Spike에서 빠뜨린 critical scenario? (예: A에서 schema-per-tenant 호환성·B에서 transaction rollback·C에서 signature replay)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:281:4. **prototype 범위 vs production 차이**: Spike 통과해도 production에서 실패할 수 있는 부분 (예: Supabase prod tier·R2 IAM의 minio 차이·Vercel serverless cold start·실제 pgBouncer config)
docs/decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:285:8. **누락된 Spike**: 다른 critical 가설 (예: Drizzle schema migration deploy·Auth.js session refresh·Cloudflare for SaaS·환경별 secret propagation·local docker-compose 의존성 호환)?
docs/core\DATA_MODEL.md:472:| `coAuthors` | `Ref<C-02>[]` | optional | |
docs/core\DATA_MODEL.md:571:| `instanceId` | `Slug` | ✅ | |
docs/core\DATA_MODEL.md:584:| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
docs/core\DATA_MODEL.md:598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
docs/core\DATA_MODEL.md:599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
docs/core\DATA_MODEL.md:630:| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
docs/core\DATA_MODEL.md:631:| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
docs/core\DATA_MODEL.md:634:> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
docs/core\DATA_MODEL.md:706:| `id` | string | ✅ | integration 식별자 (instance scope unique) |
docs/core\DATA_MODEL.md:708:| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
docs/core\DATA_MODEL.md:711:| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
docs/core\DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs/core\DATA_MODEL.md:718:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs/core\DATA_MODEL.md:722:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
docs/core\DATA_MODEL.md:726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
docs/core\DATA_MODEL.md:734:> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
docs/core\DATA_MODEL.md:768:| `instanceId` | `Slug` | ✅ | |
docs/core\DATA_MODEL.md:968:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core\DATA_MODEL.md:974:| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
docs/core\DATA_MODEL.md:1035:   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
docs/core\DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core\DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs/core\DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/core\DATA_MODEL.md:1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
docs/core\DATA_MODEL.md:1107:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
docs/admin\ARCHITECTURE.md:307:| asset-ingestion · content-migration 통합 | 신규 클라이언트 온보딩 자동화 |
docs/admin\ARCHITECTURE.md:471:| A-03 | 인증 시스템 (자체 / Auth0 / Clerk / 기타) | 미결정 |
docs/admin\REVIEW_WORKFLOW.md:166:- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
docs/admin\REVIEW_WORKFLOW.md:254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
docs/admin\REVIEW_WORKFLOW.md:345:- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
docs/admin\REVIEW_WORKFLOW.md:364:           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
docs/admin\REVIEW_WORKFLOW.md:414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
docs/admin\REVIEW_WORKFLOW.md:418:  instanceId: Slug;
docs/admin\REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin\REVIEW_WORKFLOW.md:438:**priorReviewRequired 산정 기준 분리** (AR2-08):
docs/admin\REVIEW_WORKFLOW.md:508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
docs/admin\REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs/admin\REVIEW_WORKFLOW.md:510:  | "content-migration-run-completed"
docs/admin\REVIEW_WORKFLOW.md:511:  | "content-migration-run-failed"
docs/admin\REVIEW_WORKFLOW.md:512:  | "content-migration-rollback-triggered"
docs/admin\REVIEW_WORKFLOW.md:513:  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
docs/admin\REVIEW_WORKFLOW.md:514:  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
docs/admin\REVIEW_WORKFLOW.md:558:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin\REVIEW_WORKFLOW.md:559:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin\REVIEW_WORKFLOW.md:560:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin\REVIEW_WORKFLOW.md:561:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin\REVIEW_WORKFLOW.md:562:| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin\REVIEW_WORKFLOW.md:563:| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |
docs/admin\REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin\REVIEW_WORKFLOW.md:581:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin\REVIEW_WORKFLOW.md:611:#### 9.2.1 idempotency 계약
docs/admin\REVIEW_WORKFLOW.md:669:  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
docs/admin\REVIEW_WORKFLOW.md:674:  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
docs/admin\REVIEW_WORKFLOW.md:675:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
docs/admin\REVIEW_WORKFLOW.md:691:  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
docs/admin\REVIEW_WORKFLOW.md:692:  | "content-migration-plan-defined"          // plan 정의
docs/admin\REVIEW_WORKFLOW.md:693:  | "content-migration-plan-validated"        // plan 검증
docs/admin\REVIEW_WORKFLOW.md:694:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs/admin\REVIEW_WORKFLOW.md:695:  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
docs/admin\REVIEW_WORKFLOW.md:696:  | "content-migration-run-started"           // apply 실행 시작
docs/admin\REVIEW_WORKFLOW.md:697:  | "content-migration-run-paused"            // CM3-01
docs/admin\REVIEW_WORKFLOW.md:698:  | "content-migration-run-resumed"           // CM3-01
docs/admin\REVIEW_WORKFLOW.md:699:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
docs/admin\REVIEW_WORKFLOW.md:700:  | "content-migration-run-completed"
docs/admin\REVIEW_WORKFLOW.md:701:  | "content-migration-run-failed"
docs/admin\REVIEW_WORKFLOW.md:702:  | "content-migration-run-cancelled"
docs/admin\REVIEW_WORKFLOW.md:703:  | "content-migration-rollback-applied"
docs/admin\REVIEW_WORKFLOW.md:704:  | "content-migration-step-skipped"          // irreversible step skip
docs/admin\REVIEW_WORKFLOW.md:705:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin\REVIEW_WORKFLOW.md:706:  | "content-migration-run-aborted"           // CM4-05 — abortRun
docs/admin\REVIEW_WORKFLOW.md:709:  | "instance-switched";                      // INFRA2-08 — super-admin cross-instance 전환
docs/admin\REVIEW_WORKFLOW.md:788:| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |
docs/core\DESIGN_TOKENS.md:50:- Preset·Instance override 토큰 파일은 동일 4파일 구조를 따른다 (`presets/<presetSlug>/design-tokens/*.json`·`instances/<instanceId>/design-tokens/*.json`)
docs/core\DESIGN_TOKENS.md:156:| `color.teal·indigo·pink·*` (확장) | preset/instance 확장 시 |
docs/core\DESIGN_TOKENS.md:172:확장 hue(`teal`·`indigo`·`pink` 등)는 preset/instance 시점 도입. 본 v1.0은 위 5개 hue + white·black 카탈로그를 안정 표준으로 둔다.
docs/core\DESIGN_TOKENS.md:718:| `layoutVariants` | preset/instance가 페이지 타입별 layout 변형 선택 (별도 문서) |
docs/core\DESIGN_TOKENS.md:719:| `componentVariants` | preset/instance가 § 8 컴포넌트 토큰 set 선택 |
docs/core\DESIGN_TOKENS.md:829:Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core\DESIGN_TOKENS.md:844:  - 단, **preset/instance 전용 토큰**은 합법 — **`private.*` 네임스페이스** 사용. semantic·component 양쪽 layer 모두 허용 (예: `private.hanui-card.background` 컴포넌트, `private.color.brand.tertiary` semantic). 표기 변환: tokens.json은 dot 객체 hierarchy, CSS 변수명은 dot을 `-`로 치환 + `--` prefix (예: `private.hanui-card.background` → `--private-hanui-card-background`). warning 면제
docs/core\DESIGN_TOKENS.md:930:| DT-05 | preset/instance tokens.json의 schema 검증 — JSON Schema 정의 | 자체 빌드 도구 구현 시 |
docs/features\compliance-assistant.md:24:- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출
docs/features\compliance-assistant.md:67:  scope: "instance"               # 인스턴스별 활성화
docs/features\compliance-assistant.md:425:## 8. 캐시·idempotency·재실행
docs/features\compliance-assistant.md:454:| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
docs/features\compliance-assistant.md:455:| **운영 TTL 캐시** (operational TTL cache) | 동일 콘텐츠에 짧은 시간 내 반복 호출 시 LLM 비용 절약 | instance 설정 (기본 86400초) |
docs/features\compliance-assistant.md:460:### 8.3 idempotency 보장
docs/features\compliance-assistant.md:607:| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:7:> **상위 결정**: 8 Feature spec v1.0 완료·솔로 1명 + AI 보조·9~12개월·Phase 0~4 단계·Vercel+Supabase+Railway 스택·next-auth
docs/decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
docs/decisions\INFRA_DECISIONS_DRAFT.md:12:## 영역 1: Multi-tenant 모델 (INFRA2-01·02·04·05·06·08 정정)
docs/decisions\INFRA_DECISIONS_DRAFT.md:19:// packages/db/tenant.ts
docs/decisions\INFRA_DECISIONS_DRAFT.md:21:  instanceId: string,
docs/decisions\INFRA_DECISIONS_DRAFT.md:25:    await tx.execute(sql`SET LOCAL app.current_instance_id = ${instanceId}`);
docs/decisions\INFRA_DECISIONS_DRAFT.md:26:    await tx.execute(sql`SET LOCAL ROLE app_tenant`);
docs/decisions\INFRA_DECISIONS_DRAFT.md:33:- **모든 tenant table 접근은 `withTenantTransaction` 안에서만 허용** (lint 강제)
docs/decisions\INFRA_DECISIONS_DRAFT.md:34:- transaction 밖 tenant table 접근 → lint fail + runtime guard throw
docs/decisions\INFRA_DECISIONS_DRAFT.md:36:- `SET LOCAL ROLE app_tenant` → service_role connection 사용 시에도 RLS 적용
docs/decisions\INFRA_DECISIONS_DRAFT.md:37:- pgBouncer/connection pooling: **transaction pooling mode 강제** (session pooling 금지 — SET LOCAL이 session-wide면 다른 transaction에 leak)
docs/decisions\INFRA_DECISIONS_DRAFT.md:39:#### worker control-plane queue + tenant-plane processing 분리
docs/decisions\INFRA_DECISIONS_DRAFT.md:41:worker가 claim job 시 instance context 모름 → 2단계 분리:
docs/decisions\INFRA_DECISIONS_DRAFT.md:44:// 1. control-plane: instance-agnostic
docs/decisions\INFRA_DECISIONS_DRAFT.md:47:    UPDATE outbox SET status='processing', locked_at=now()
docs/decisions\INFRA_DECISIONS_DRAFT.md:48:    WHERE id = (SELECT id FROM outbox WHERE status='pending'
docs/decisions\INFRA_DECISIONS_DRAFT.md:49:                ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
docs/decisions\INFRA_DECISIONS_DRAFT.md:54:// 2. tenant-plane: instanceId 알게 된 후
docs/decisions\INFRA_DECISIONS_DRAFT.md:55:await withTenantTransaction(job.instanceId, async (tx) => {
docs/decisions\INFRA_DECISIONS_DRAFT.md:60:control-plane queue table들 (outbox base·retry queue base)에는 RLS 미적용 — claim 시 instance context 미상 처리 위해.
docs/decisions\INFRA_DECISIONS_DRAFT.md:63:- **write path**: control-plane helper 허용 (worker가 instance switch 시 audit insert 가능)
docs/decisions\INFRA_DECISIONS_DRAFT.md:64:- **read path**: tenant-scoped view 또는 RLS policy 적용 — `CREATE POLICY audit_log_read ON audit_log FOR SELECT USING (instance_id = current_setting('app.current_instance_id')::uuid)`
docs/decisions\INFRA_DECISIONS_DRAFT.md:65:- audit metadata에 tenant-sensitive 정보(법무 검토·사전심의·권한 변경) 포함됨 → cross-tenant 노출 위험 차단
docs/decisions\INFRA_DECISIONS_DRAFT.md:70:- `@require-tenant-transaction`: tenant table import 시 `withTenantTransaction` 안 사용 강제
docs/decisions\INFRA_DECISIONS_DRAFT.md:71:- runtime guard: production에서 `current_setting('app.current_instance_id')` 누락 시 RLS가 모든 row 숨김 → query fail (안전)
docs/decisions\INFRA_DECISIONS_DRAFT.md:107:### 1.3 next-auth + `resolveTenantContext` (INFRA2-08 신규)
docs/decisions\INFRA_DECISIONS_DRAFT.md:110:// apps/web/lib/tenant-context.ts
docs/decisions\INFRA_DECISIONS_DRAFT.md:112:  session: NextAuthSession,
docs/decisions\INFRA_DECISIONS_DRAFT.md:115:  // 1. instanceMemberships에 requestedInstanceId 포함 여부 검증
docs/decisions\INFRA_DECISIONS_DRAFT.md:128:  // 4. super-admin cross-instance 시 audit
docs/decisions\INFRA_DECISIONS_DRAFT.md:131:      action: 'instance-switched',
docs/decisions\INFRA_DECISIONS_DRAFT.md:137:  return { instanceId: requestedInstanceId, role: membership.role, ... };
docs/decisions\INFRA_DECISIONS_DRAFT.md:144:- RLS `app.current_instance_id`는 `resolveTenantContext` 결과만 사용
docs/decisions\INFRA_DECISIONS_DRAFT.md:147:REVIEW_WORKFLOW § 10.2.1에 `instance-switched` AuditAction cascade 완료.
docs/decisions\INFRA_DECISIONS_DRAFT.md:155:| **A. tenant-plane hard FK** | parent가 tenant table이고 `(instance_id, id)` unique 가능한 경우 | `FOREIGN KEY (instance_id, parent_id) REFERENCES parent(instance_id, id)` |
docs/decisions\INFRA_DECISIONS_DRAFT.md:162:- runtime validator: ref resolve 시 row 존재 + tenant scope 검증
docs/decisions\INFRA_DECISIONS_DRAFT.md:164:### 1.5 tenant export/import manifest — dependency class (INFRA2-05 강화)
docs/decisions\INFRA_DECISIONS_DRAFT.md:168:  instanceId: string;
docs/decisions\INFRA_DECISIONS_DRAFT.md:183:  | "rebind-required"             // secretRef·providerId·externalId 등 재바인딩 필요
docs/decisions\INFRA_DECISIONS_DRAFT.md:188:  | "audit-chain-preserved";      // append-only audit log — 원본 instance 표기 유지
docs/decisions\INFRA_DECISIONS_DRAFT.md:192:- **default**: 신규 instance는 `disabled` 상태로 생성. operator 검수 후 enable
docs/decisions\INFRA_DECISIONS_DRAFT.md:193:- secretRef 모두 `secretRef://PENDING_*`로 마스킹 → 운영자가 새 instance용으로 재발급
docs/decisions\INFRA_DECISIONS_DRAFT.md:196:- blob (Storage object)는 별도 copy job → object key prefix `{instanceId}/...` 재구성
docs/decisions\INFRA_DECISIONS_DRAFT.md:206:| DB connection pool 분리 | web pool (interactive priority)·worker pool (heavy) | Supabase Pooler config |
docs/decisions\INFRA_DECISIONS_DRAFT.md:207:| worker pool 분리 | interactive worker (dispatch·outbox·short retry) / heavy worker (content-migration·analytics·crawler·CRM full sync) | Railway service 분리 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:208:| instance별 concurrency | config (per feature·per instance) | feature spec |
docs/decisions\INFRA_DECISIONS_DRAFT.md:212:### 1.7 schema-per-tenant ADR — 별도 (INFRA1-03 유지)
docs/decisions\INFRA_DECISIONS_DRAFT.md:214:Phase 0~1에 control-plane vs tenant-plane 분류 ADR 별도 작성. 본 문서는 분류 진입점만 명시.
docs/decisions\INFRA_DECISIONS_DRAFT.md:259:## 영역 3: Storage — **Cloudflare R2 채택** (INFRA2-07·INFRA3-03 확정)
docs/decisions\INFRA_DECISIONS_DRAFT.md:263:| 항목 | A. Supabase Storage 유지 | B. Cloudflare R2로 전환 (권장) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:265:| spec 정합성 | search-visibility/asset-ingestion 등이 S3 IAM·object key prefix 패턴 가정 → **mismatch** | spec 그대로 적용 가능 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:266:| next-auth 매핑 | Supabase Auth `auth.uid()` 미사용 → **RLS 매핑 불가**·server-only signed URL issuer 필요 | 영향 없음 — server-only signed URL로 통일 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:267:| egress 비용 | 0.09$/GB (이미지 트래픽 누적) | **0$ (R2 핵심 장점)** |
docs/decisions\INFRA_DECISIONS_DRAFT.md:268:| dashboard 운영 | 통합 UI | 별도 R2 dashboard |
docs/decisions\INFRA_DECISIONS_DRAFT.md:269:| object isolation | RLS bypass + application-level | **object key prefix `{instanceId}/...` + IAM condition** (spec 그대로) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:270:| import 후 blob 복구 | Supabase API 호출·copy | S3 copy API 표준 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:272:### 3.2 권장: **B. Cloudflare R2로 전환**
docs/decisions\INFRA_DECISIONS_DRAFT.md:275:1. **spec 정합성**: 8 Feature spec 중 search-visibility·asset-ingestion·content-migration이 S3 IAM·object key prefix·signed URL refresh 패턴 가정 — R2는 S3 API 호환이라 그대로 적용
docs/decisions\INFRA_DECISIONS_DRAFT.md:276:2. **next-auth 매핑 단순화**: Supabase Storage RLS는 `auth.uid()` 필요 → next-auth 환경에서 매핑하려면 custom JWT 발급 등 복잡. R2는 server-only signed URL issuer로 통일 (이미 spec 명시)
docs/decisions\INFRA_DECISIONS_DRAFT.md:278:4. **storage isolation**: object key prefix `{instanceId}/{type}/...` + IAM PolicyDocument의 `Condition.StringLike` (spec search-visibility § 13.10 예시)
docs/decisions\INFRA_DECISIONS_DRAFT.md:284:| export | per-instance object key prefix scan → R2 manifest 생성 → signed URL list 출력 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:285:| import | 신규 instance prefix로 object copy (R2 → R2)·signed URL 재발급·`Storage Migration audit` 기록 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:286:| RLS 대체 | server-only signed URL issuer (`packages/storage/issue-url.ts`) — issuance 시 instance scope + audit 검증 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:287:| signed URL 정책 | TTL 600초 (spec search-visibility)·만료 60초 전 자동 refresh |
docs/decisions\INFRA_DECISIONS_DRAFT.md:288:| object key format | `{feature}/{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (spec 명시) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:290:**이전 결정(Supabase Storage)을 reversal해야 하는 결정.** 사용자 확인 필요 (§ 영역 4 끝에 사용자 결정 요청 명시).
docs/decisions\INFRA_DECISIONS_DRAFT.md:302:| **Spike A: Drizzle + RLS + Auth.js + Supabase** | tenant scoping 실행 모델 검증 | (1) withTenantTransaction 안에서 RLS 적용 (2) 다른 instance row 안 보임 (3) pgBouncer transaction pooling 작동 (4) lint·runtime guard 동작 | Phase 0 scope를 UI보다 infra closure로 재조정·migration 패턴 재설계 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:303:| **Spike B: worker control-plane queue + tenant processing** | SKIP LOCKED claim·instance switch 검증 | (1) control-plane DB role로 claim·(2) tenant-plane으로 처리·(3) worker가 instance context를 RLS에 set·(4) 두 transaction 분리 | worker 패턴 재설계 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:304:| **Spike C: Storage signed URL isolation** | (B Storage 채택 시) R2 signed URL + instance prefix·IAM condition·next-auth 매핑 검증 | (1) cross-instance access 차단·(2) signed URL refresh 동작·(3) IAM PolicyDocument 작동 | Storage ADR 재검토 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:313:| Week 2 | Supabase dev/staging·Drizzle migration·next-auth·Sentry·Resend dev·Upstash | dev/staging vertical green |
docs/decisions\INFRA_DECISIONS_DRAFT.md:315:| Week 4 | M0 vertical slice schema (~15 tables — Page·Content·ComplianceRecord·AuditLog·NotificationEvent·NotificationLog 등) | schema migration green |
docs/decisions\INFRA_DECISIONS_DRAFT.md:320:### 4.3 Phase 0 outbox 분류 — **옵션 A 선택** (INFRA2-03)
docs/decisions\INFRA_DECISIONS_DRAFT.md:330:- User/Auth (next-auth): user·session·account·verificationToken
docs/decisions\INFRA_DECISIONS_DRAFT.md:331:- Common: outbox (notification dispatch trigger)
docs/decisions\INFRA_DECISIONS_DRAFT.md:342:4. `idempotencyKey` + `requestFingerprint` helper
docs/decisions\INFRA_DECISIONS_DRAFT.md:343:5. **`notify()` 최소 구현** — Receipt + Log + PayloadRecord + DeliveryAttempt + outbox dispatch (P0 subset)
docs/decisions\INFRA_DECISIONS_DRAFT.md:344:6. retry queue base (SKIP LOCKED claim·exhausted 전이)
docs/decisions\INFRA_DECISIONS_DRAFT.md:345:7. `secretRef` resolver interface (Doppler·env·Supabase Vault)
docs/decisions\INFRA_DECISIONS_DRAFT.md:346:8. `hmac` utility (planFingerprint·idempotencyPepperRef 등)
docs/decisions\INFRA_DECISIONS_DRAFT.md:366:| 기술적 idempotency·CAS·rollback | DPA 협상·실제 광고 문구 리스크 판단 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:381:| attachments storage | R2 prefix `prior-review/{instanceId}/{recordId}/` + retention 7년 |
docs/decisions\INFRA_DECISIONS_DRAFT.md:399:- Resend (email)·Sentry (monitoring)·Supabase (DB·Storage)·Vercel (web)·Railway (worker)·Upstash (Redis)·Cloudflare (R2·DNS)·Doppler (secrets)
docs/decisions\INFRA_DECISIONS_DRAFT.md:409:| 호스팅 | Vercel native domain vs Cloudflare for SaaS |
docs/decisions\INFRA_DECISIONS_DRAFT.md:410:| subdomain 전략 | wildcard (`*.glitzy.kr` per instance) vs tenant subdomain (`{hospital}.glitzy.kr`) vs 의료기관 apex (`hospital.com`) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:414:| `adminBaseUrl` resolution | request hostname → instanceId 매핑 logic |
docs/decisions\INFRA_DECISIONS_DRAFT.md:422:| 1. Multi-tenant | Single DB + `app_tenant` role + RLS ON·`withTenantTransaction` 헬퍼·worker control/tenant plane 분리·composite FK 3등급·tenant export manifest dependency class·resolveTenantContext + instance-switched audit |
docs/decisions\INFRA_DECISIONS_DRAFT.md:426:| 3. Storage | **B. Cloudflare R2 권장 (reversal)** — spec 정합·next-auth 매핑 단순·egress 0$ |
docs/decisions\INFRA_DECISIONS_DRAFT.md:427:| 4-1. Phase 0 | 6~8주·Week 1 Spike A·B·C gate·M0 vertical slice schema·P0 outbox subset (notifications 4 tables 포함) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:434:이전 (Supabase Storage) → **Cloudflare R2 채택**. Supabase Storage는 rejected alternative.
docs/decisions\INFRA_DECISIONS_DRAFT.md:437:1. spec의 IAM·object key prefix·signed URL refresh 패턴 (search-visibility·asset-ingestion·content-migration) 그대로 적용
docs/decisions\INFRA_DECISIONS_DRAFT.md:438:2. next-auth 환경에서 Supabase Auth `auth.uid()` RLS 매핑 복잡 → R2 server-only signed URL issuer로 통일
docs/decisions\INFRA_DECISIONS_DRAFT.md:439:3. egress 0$ (Supabase Storage 0.09$/GB)
docs/decisions\INFRA_DECISIONS_DRAFT.md:452:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정. 4 지적 정정 완료**: (1) P0 schema 목록 NotificationEvent → NotificationEventReceipt 정정 + NotificationEvent는 입력 타입임을 명시 (INFRA3-01), (2) audit_log read path tenant-scoped RLS 정책 분리 (INFRA3-02), (3) Storage 섹션 Cloudflare R2 채택 확정·Supabase Storage rejected alternative (INFRA3-03), (4) notifications.md 예시 drift는 8 Feature spec cascade 시 정정 (INFRA3-04 — 후속 minor cascade). **3 cycle 누계 36 지적 전건 수용**. SoT cascade 완료: REVIEW_WORKFLOW (NotificationEventType 6종 + AuditAction 17종 — service-role-invoked·instance-switched 추가), DATA_MODEL v0.23 (C-08 email transport/provider 분리) |
docs/decisions\INFRA_DECISIONS_DRAFT.md:453:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
docs/features\asset-ingestion.md:16:- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
docs/features\asset-ingestion.md:33:| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
docs/features\asset-ingestion.md:36:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs/features\asset-ingestion.md:50:### 1.2.1 공통 retry taxonomy (search-visibility § 1.2.1 동일)
docs/features\asset-ingestion.md:61:- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)
docs/features\asset-ingestion.md:74:activation: { scope: "instance", default: false }
docs/features\asset-ingestion.md:134:- `UNIQUE(instanceId, normalizedTextHash)` — duplicate 차단 기본
docs/features\asset-ingestion.md:135:- `(instanceId, sourceId, sourceCanonicalKey)` index — provenance 조회
docs/features\asset-ingestion.md:139:### 4.3 retry queue worker — search-visibility § 13.5 패턴 동일
docs/features\asset-ingestion.md:182:  riskRules: instanceRules                              // 인스턴스 로드된 RiskRule[]
docs/features\asset-ingestion.md:264:  coAuthors?: Ref<C-02>[];
docs/features\asset-ingestion.md:336:### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)
docs/features\asset-ingestion.md:359:3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
docs/features\asset-ingestion.md:360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
docs/features\asset-ingestion.md:372:   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
docs/features\asset-ingestion.md:425:## 10. 알림 (outbox 패턴)
docs/features\asset-ingestion.md:437:### 10.2 outbox 패턴
docs/features\asset-ingestion.md:439:search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).
docs/features\asset-ingestion.md:443:| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
docs/features\asset-ingestion.md:453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
docs/features\asset-ingestion.md:472:| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
docs/features\asset-ingestion.md:494:## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)
docs/features\asset-ingestion.md:524:### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)
docs/features\asset-ingestion.md:527:- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
docs/features\asset-ingestion.md:528:  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
docs/features\asset-ingestion.md:529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
docs/features\asset-ingestion.md:530:  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)
docs/features\asset-ingestion.md:533:**v0.2 → v0.3 blob key format migration**:
docs/features\asset-ingestion.md:534:- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
docs/features\asset-ingestion.md:535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
docs/features\asset-ingestion.md:537:  - **lazy rewrite** (기본): 신규 asset만 v0.3 format 사용. 기존 v0.2 blob은 그대로 두고 `IngestedAsset.blobKeyVersion` 필드(`"v0.2" | "v0.3"`)로 분기 — signed URL 발급 시 version별 path 사용
docs/features\asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
docs/features\asset-ingestion.md:539:  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제
docs/features\asset-ingestion.md:556:- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
docs/features\asset-ingestion.md:581:| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
docs/features\asset-ingestion.md:583:| AI-16 | signed URL refresh client SDK·blob signed URL renewal strategy | 인프라 결정 (search-visibility SV-14 동등) |
docs/features\asset-ingestion.md:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
docs/features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs/features\asset-ingestion.md:617:| `blobKeyVersion` | enum (`v0.2`·`v0.3`) | ✅ | (AI4-08) 신규 row default `v0.3`. v0.2 row는 lazy rewrite (§ 13.3). signed URL 발급 worker가 version별 path 분기 |
docs/features\asset-ingestion.md:619:**Constraints**: `UNIQUE(instanceId, normalizedTextHash)` (duplicate 차단).
docs/features\asset-ingestion.md:620:**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.
docs/features\asset-ingestion.md:630:  - worker는 sourceVersion 입력으로 idempotent 처리. 동일 sourceVersion 중복 enqueue는 1회만 처리. 결과는 body·bodyVersion(+1)·piiDetected·piiRedacted를 단일 transaction에서 원자 갱신
docs/features\asset-ingestion.md:741:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
docs/features\asset-ingestion.md:753:object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.
docs/features\asset-ingestion.md:757:- signed URL 발급 API는 호출자 AdminUser.instanceMemberships 검증
docs/features\asset-ingestion.md:758:- S3 IAM PrincipalTag condition으로 cross-instance access 차단
docs/features\asset-ingestion.md:761:- signed URL TTL 600초 + dashboard refresh client SDK (AI-16 신규 — 인프라 결정)
docs/core\SCHEMA_MAPPING.md:135:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
docs/features\analytics-reporting.md:20:- **핵심 책임**: 외부 source 수집(idempotent + force refresh)·정규화·캐시·queryNormalizedMetrics read API·리포트 생성·발송(notify)·임계 측정(hysteresis 상태 저장)·workflow 명시 API 호출 + ComplianceRecord snapshot provider
docs/features\analytics-reporting.md:22:- **idempotency**:
docs/features\analytics-reporting.md:23:  - sources 입력 canonicalization — undefined는 manifest 활성 source sorted 전체 (AR2-01)
docs/features\analytics-reporting.md:24:  - `forceRefresh` + `refreshIntentId` 입력으로 명시 재수집 분기 (AR2-02)
docs/features\analytics-reporting.md:25:  - CollectionLog는 envelope 1건, 상태는 `CollectionSourceAttempt` per-source 분리 (AR2-03)
docs/features\analytics-reporting.md:26:- **임계 측정**: `MediaThresholdState` 별도 테이블에 현재 상태·streak·last transition event 보존 (AR2-06)
docs/features\analytics-reporting.md:27:- **법정/운영 분리**: rolling-90 = 운영 조기경보(이벤트 발송 + workflow API 호출), previous-3-months-calendar = 법정 산정(legal 검수자 ComplianceRecord 확정 기록). **priorReviewRequired 산정에는 calendar만 사용** (AR2-08)
docs/features\analytics-reporting.md:28:- **ComplianceRecord 갱신 주체** (AR2-09): 본 Feature는 **snapshot provider만**. 직접 record 수정 금지. REVIEW_WORKFLOW `enqueueMediaThresholdReassessment()` API에 snapshot 전달, 워크플로가 pre-publish record 생성
docs/features\analytics-reporting.md:29:- **workflow 명시 API** (AR2-10): 임계 전이 시 `enqueueMediaThresholdReassessment()` 호출 → notify는 결과 알림만
docs/features\analytics-reporting.md:63:### 1.2.1 공통 retry taxonomy (AR4-07)
docs/features\analytics-reporting.md:65:본 Feature는 3종 retry 구조를 가진다 — CollectionRetryQueue·ReportInstance outbox·MediaThresholdReassessmentDispatchOutbox. 공통 의미 통일:
docs/features\analytics-reporting.md:72:| `*-retryable` | 자동 재시도 큐 대상 (attempts < maxAttempts) |
docs/features\analytics-reporting.md:83:| ReportInstance outbox | **상수 5** (configurable 아님 — 운영 단순성) |
docs/features\analytics-reporting.md:86:두 outbox의 maxAttempts는 상수 고정 (config 슬롯 없음). build validation은 maxAttempts 설정 누락이 아닌 `claim` enum 값·`attempts` 컬럼 존재만 검사.
docs/features\analytics-reporting.md:107:  scope: "instance"
docs/features\analytics-reporting.md:129:    gsc: { enabled: true, serviceAccountSecretRef: "secretRef://...", propertyUrl: "sc-domain:..." }
docs/features\analytics-reporting.md:130:    naverSearchAdvisor: { enabled: true, apiKeySecretRef: "secretRef://...", siteUrl: "..." }
docs/features\analytics-reporting.md:131:    ga4: { enabled: true, propertyId: "G-...", serviceAccountSecretRef: "secretRef://..." }
docs/features\analytics-reporting.md:145:        timezonePolicy:                                # AR2-22
docs/features\analytics-reporting.md:158:      rawPayloadStorage:                               # AR2-13 — allowlist는 항상 required, storage 자체는 별도 토글
docs/features\analytics-reporting.md:164:          schedule:                                    # AR2-23 grammar
docs/features\analytics-reporting.md:188:        measurementAlgorithmVersion: "v1"              # AR2-07 audit 추적
docs/features\analytics-reporting.md:193:        #   instance-isolated: `ar:quota:{provider}:{instanceId}`
docs/features\analytics-reporting.md:194:        # credentialHash = SHA-256(secretRef 참조값) 8자 prefix. secretRef rotation 시 새 hash → 새 bucket
docs/features\analytics-reporting.md:196:          gsc: "credential-global"                     # GSC service account 단위 글로벌 (multi-instance 공유 service account quota 보호)
docs/features\analytics-reporting.md:198:          naverSearchAdvisor: "instance-isolated"
docs/features\analytics-reporting.md:199:          rum: "instance-isolated"
docs/features\analytics-reporting.md:203:        retryAfterRespected: true                      # 429 Retry-After ≥ backoff 시 Retry-After 우선
docs/features\analytics-reporting.md:209:        ga4CustomFieldAllowlist:                       # AR2-11 — eventParameters·customDimension·customMetric 명시 등록 필요
docs/features\analytics-reporting.md:216:          subjectMatchingPolicy: "not-applicable"      # AR2-12 — aggregated 데이터 매칭 불가. raw incident 대응만 별도
docs/features\analytics-reporting.md:231:### 3.2 CollectionInput·Result + idempotency·force refresh
docs/features\analytics-reporting.md:235:  instanceId: Slug;
docs/features\analytics-reporting.md:236:  sources?: AnalyticsSource[];          // undefined → 활성 source 전체 정렬 사용 (AR2-01 canonicalization)
docs/features\analytics-reporting.md:240:  forceRefresh?: boolean;                // AR2-02 — 같은 window 강제 재수집
docs/features\analytics-reporting.md:242:  idempotencyKey?: string;
docs/features\analytics-reporting.md:245:// idempotencyKey 산정:
docs/features\analytics-reporting.md:251://     - sourceConfigSnapshot (자격증명 secretRef 포함 — secret 자체는 아님)
docs/features\analytics-reporting.md:252://     - sourceConfigSnapshotHash = SHA-256(sourceConfigSnapshot canonical JSON) — AR5-02 idempotency 입력
docs/features\analytics-reporting.md:254://       → source 설정(secretRef·propertyId·siteUrl·bucket strategy 등) 변경 시 새 lineage 보장 (AR5-02 정정)
docs/features\analytics-reporting.md:255://   호출 시 idempotencyKey에 manifestSnapshotVersion 포함:
docs/features\analytics-reporting.md:257://   retry: CollectionLog.manifestVersion을 끝까지 따름 — 현재 manifest 변경 무시
docs/features\analytics-reporting.md:258://   → manifest 변경(ga4 비활성화·secretRef rotation 등) 시 새 scheduled job부터 새 lineage. 기존 in-flight job은 freeze 값 유지
docs/features\analytics-reporting.md:266://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion + "force:" + refreshIntentId)
docs/features\analytics-reporting.md:268://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion)
docs/features\analytics-reporting.md:275:  idempotencyKey: string;
docs/features\analytics-reporting.md:276:  canonicalSources: AnalyticsSource[];   // AR2-01 — 실제 사용된 source 배열 노출
docs/features\analytics-reporting.md:278:  envelopeState: "accepted" | "processing" | "completed" | "partial-failed" | "failed";  // AR2-03 envelope 상태
docs/features\analytics-reporting.md:279:  instanceId: Slug;
docs/features\analytics-reporting.md:307:  | "failed-transient"      // 재시도 가능 (retry queue로 이동)
docs/features\analytics-reporting.md:311:  | "in-retry-queue";       // CollectionRetryQueue에 enqueue됨
docs/features\analytics-reporting.md:318:  instanceId: Slug;
docs/features\analytics-reporting.md:326:  idempotencyKey?: string;
docs/features\analytics-reporting.md:329:// 기본 idempotencyKey: hash(instanceId + reportTemplateId + windowStart + windowEnd + mode [+ "force:" + refreshIntentId])
docs/features\analytics-reporting.md:333:  idempotencyKey: string;
docs/features\analytics-reporting.md:340:  dataCompletenessBreakdown: Array<{    // AR2-19
docs/features\analytics-reporting.md:346:  notificationEventId?: string;          // 영구 저장 — § 7.2 재발송 차단 (AR2-05)
docs/features\analytics-reporting.md:358:  instanceId: Slug;
docs/features\analytics-reporting.md:359:  dimensions: QueryDimension[];          // [] → window 전체 single aggregate row (AR2-17)
docs/features\analytics-reporting.md:361:  filters?: QueryFilter[];               // 명시 AST (AR2-16)
docs/features\analytics-reporting.md:386:  | "source"                              // AR2-20 — NormalizedMetricRow.source와 동일 명칭 (analyticsSource alias 제거)
docs/features\analytics-reporting.md:422:#### 3.4.1 metric별 compatible source·default source (AR2-18)
docs/features\analytics-reporting.md:452:1. canonicalSources 산정 (AR2-01) + idempotencyKey 산정 (AR2-02 force refresh 분기)
docs/features\analytics-reporting.md:453:2. idempotency:
docs/features\analytics-reporting.md:454:   - CollectionLog UNIQUE(instanceId, idempotencyKey) insert 시도
docs/features\analytics-reporting.md:468:      - 429 → max(Retry-After, backoffSeconds[attemptNumber-1]) → retry queue
docs/features\analytics-reporting.md:469:      - 5xx·timeout → failed-transient → retry queue
docs/features\analytics-reporting.md:474:   | 1+ attempt가 in-retry-queue 또는 processing | **processing** (우선) |
docs/features\analytics-reporting.md:478:5. retry 성공 후 envelope 재계산 (AR3-03):
docs/features\analytics-reporting.md:492:- catch-up idempotencyKey = `hash(instanceId + canonicalSources + scheduledForDate + manifestVersion)` — date별 멱등
docs/features\analytics-reporting.md:498:### 4.3 retry queue worker (AR2-15)
docs/features\analytics-reporting.md:504:UPDATE collection_retry_queue
docs/features\analytics-reporting.md:507:  SELECT id FROM collection_retry_queue
docs/features\analytics-reporting.md:511:  FOR UPDATE SKIP LOCKED
docs/features\analytics-reporting.md:522:- worker 처리 후 status="completed" 또는 retry 반복
docs/features\analytics-reporting.md:527:### 4.4 reportTemplates schedule grammar (AR2-23)
docs/features\analytics-reporting.md:546:- availabilityLagDays: 1, bucket scope: **instance-isolated**
docs/features\analytics-reporting.md:552:- **custom field 정책** (AR2-11): `pii.ga4CustomFieldAllowlist`에 명시 등록된 key만 저장. 미등록 customDimensions·customMetrics·eventParameters는 redaction worker가 drop
docs/features\analytics-reporting.md:558:- availabilityLagDays: 0, bucket scope: instance-isolated
docs/features\analytics-reporting.md:560:### 5.5 raw payload allowlist (재참조 정정: § 4.1 6단계가 본 절을 참조 — AR2-24)
docs/features\analytics-reporting.md:589:  - reconcile worker (stale processing >10분 감지): attempt status="failed-transient"로 마킹 후 retry queue enqueue
docs/features\analytics-reporting.md:600:§ 3.4 QueryDimension·QueryMetric과 1:1 매핑 (`source` 명칭 통일 — AR2-20):
docs/features\analytics-reporting.md:604:  instanceId: Slug;
docs/features\analytics-reporting.md:607:  dimensionKey: string;                  // NOT NULL, composite UNIQUE의 일부 (AR2-21 정정)
docs/features\analytics-reporting.md:617:**dimensionKey** = SHA-256(sorted JSON of `{page, query, country, device, trafficSource, medium, eventName}` with NULL → `"__none"` sentinel). DB column NOT NULL + composite UNIQUE의 일부 (AR2-21).
docs/features\analytics-reporting.md:642:4. ReportInstance insert (UNIQUE(instanceId, idempotencyKey)):
docs/features\analytics-reporting.md:644:     - **forceRefresh=true + refreshIntentId** (AR3-07): idempotencyKey가 force lineage로 산정됨 → 새 record. 기존과 별개 row 생성. UNIQUE 충돌 방지
docs/features\analytics-reporting.md:647:       - `claimed-pending`·`dispatch-failed` → outbox 재발송 worker가 처리 (resultOrigin="reconstructed-from-existing")
docs/features\analytics-reporting.md:649:5. delivery.enabled=true 시 **outbox 패턴** (AR3-08):
docs/features\analytics-reporting.md:652:        sourceEventId = hash(instanceId + reportInstanceId)
docs/features\analytics-reporting.md:656:   d. notify() 실패 또는 c 단계 commit 실패 → notificationDispatchClaim="dispatch-failed-retryable" + attempts++ + 외부 sink alert
docs/features\analytics-reporting.md:657:   e. **outbox reconcile worker** (1분 주기 — AR4-04·06 SoT 쿼리):
docs/features\analytics-reporting.md:659:      UPDATE report_instance
docs/features\analytics-reporting.md:662:        SELECT id FROM report_instance
docs/features\analytics-reporting.md:667:            OR notification_dispatch_claim = 'dispatch-failed-retryable'
docs/features\analytics-reporting.md:670:        FOR UPDATE SKIP LOCKED
docs/features\analytics-reporting.md:674:      UPDATE report_instance
docs/features\analytics-reporting.md:680:   f. 재시도 후 성공 → "dispatched", 5회 초과 실패 → "dispatch-failed-permanent" + 운영자 수동 개입 alert (AR4-04 retryable vs permanent 분리)
docs/features\analytics-reporting.md:684:### 7.3 임계 측정 — hysteresis + workflow 명시 API (AR2-06·10)
docs/features\analytics-reporting.md:690:1. DailyUserMeasurement insert (UNIQUE(instanceId, date, basisKey))
docs/features\analytics-reporting.md:693:3. MediaThresholdState 갱신 — UPDATE ... WHERE instanceId=? RETURNING *
docs/features\analytics-reporting.md:711:      transitionEventId = hash("media-threshold:" + instanceId + newState + assessmentBasisDate + basisKey + thresholdDailyUsers)
docs/features\analytics-reporting.md:713:   c. **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment()** 호출 — outbox 패턴 (§ 7.3.2 재시도 정책)
docs/features\analytics-reporting.md:742:#### 7.3.2 enqueueMediaThresholdReassessment 재시도 정책 (AR3-12 — outbox)
docs/features\analytics-reporting.md:747:- worker가 1분 주기로 outbox 처리 (AR4-05·06 SoT 쿼리):
docs/features\analytics-reporting.md:750:UPDATE media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:753:  SELECT id FROM media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:757:      OR claim IN ('not-claimed', 'dispatch-failed-retryable')
docs/features\analytics-reporting.md:760:  FOR UPDATE SKIP LOCKED
docs/features\analytics-reporting.md:764:UPDATE media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:775:  4. 실패 → claim="dispatch-failed-retryable" + 외부 sink alert
docs/features\analytics-reporting.md:776:- 동일 transitionEventId 재시도는 workflow API의 `transitionEventId UNIQUE`로 idempotent
docs/features\analytics-reporting.md:779:**operational vs 법정 분리** (AR2-08):
docs/features\analytics-reporting.md:815:  instanceId: Slug;
docs/features\analytics-reporting.md:834:### 8.3 ComplianceRecord 갱신 주체 (AR2-09)
docs/features\analytics-reporting.md:857:| retry queue 처리율 | exhausted / total | < 5% |
docs/features\analytics-reporting.md:868:- retry queue stale processing > 10분
docs/features\analytics-reporting.md:880:# 3. secretRef 등록
docs/features\analytics-reporting.md:898:- 활성 source의 secretRef 누락
docs/features\analytics-reporting.md:905:- outbox 테이블 schema에 `claim` enum·`attempts`·`claimedAt` 컬럼 누락 (maxAttempts는 상수 5 — § 1.2.1)
docs/features\analytics-reporting.md:955:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |
docs/features\analytics-reporting.md:966:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:979:§ 6.1 NormalizedMetricRow 스키마 + `UNIQUE(instanceId, date, source, dimensionKey)`.
docs/features\analytics-reporting.md:980:**Index**: `(instanceId, date)`, `(instanceId, page, date)`, `(instanceId, query, date)`, `(instanceId, source, date)`.
docs/features\analytics-reporting.md:987:| `idempotencyKey` | string | ✅ |
docs/features\analytics-reporting.md:988:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:999:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\analytics-reporting.md:1001:### 14.4 `CollectionSourceAttempt` (per-source 상태 SoT — AR2-03)
docs/features\analytics-reporting.md:1025:| `idempotencyKey` | string | ✅ |
docs/features\analytics-reporting.md:1026:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1032:| `notificationDispatchClaim` | enum | ✅ — not-claimed/claimed-pending/dispatched/dispatch-failed-retryable/dispatch-failed-permanent (AR4-04 retryable vs permanent 분리) |
docs/features\analytics-reporting.md:1034:| `notificationDispatchAttempts` | integer | ✅ — outbox reconcile worker 재시도 누적 |
docs/features\analytics-reporting.md:1038:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\analytics-reporting.md:1039:**Index**: `(notificationDispatchClaim, notificationDispatchClaimedAt)` — outbox worker query.
docs/features\analytics-reporting.md:1041:### 14.6 `DailyUserMeasurement` (AR2-07 basisKey)
docs/features\analytics-reporting.md:1046:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1059:**Constraints**: `UNIQUE(instanceId, date, basisKey)`. **partial unique index**: `UNIQUE(instanceId, date) WHERE isActiveMeasurement=true` (active 1건/일).
docs/features\analytics-reporting.md:1061:### 14.7 `MediaThresholdState` (AR2-06 — hysteresis 상태 SoT)
docs/features\analytics-reporting.md:1065:| `instanceId` | Slug | ✅ — PK |
docs/features\analytics-reporting.md:1075:### 14.8 `CollectionRetryQueue` (AR2-15 worker schema)
docs/features\analytics-reporting.md:1098:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1114:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1119:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent (AR4-05) |
docs/features\analytics-reporting.md:1128:**Index**: `(claim, claimedAt)` — outbox worker query.
docs/features\analytics-reporting.md:1135:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1146:**Index**: `(instanceId, processedAt DESC)`, `(expiresAt)`.
docs/core\SEARCH_STANDARDIZATION.md:272:| `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |
docs/core\SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs/features\content-migration.md:1:# Feature — content-migration
docs/features\content-migration.md:7:> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
docs/features\content-migration.md:14:> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개
docs/features\content-migration.md:20:- **Feature 식별자**: `content-migration`
docs/features\content-migration.md:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
docs/features\content-migration.md:22:- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
docs/features\content-migration.md:24:- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
docs/features\content-migration.md:37:| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
docs/features\content-migration.md:38:| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
docs/features\content-migration.md:39:| migration plan kind 제거 | **MAJOR** | 별개 | |
docs/features\content-migration.md:60:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs/features\content-migration.md:72:### 1.2.1 retry taxonomy
docs/features\content-migration.md:84:| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
docs/features\content-migration.md:98:name: "content-migration"
docs/features\content-migration.md:102:activation: { scope: "instance", default: false }
docs/features\content-migration.md:127:    instanceToInstanceCopy: [super-admin, legal-reviewer]
docs/features\content-migration.md:138:  - name: "content-migration"
docs/features\content-migration.md:148:          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
docs/features\content-migration.md:152:            - "content-migration-run-failed"
docs/features\content-migration.md:153:            - "content-migration-rollback-triggered"
docs/features\content-migration.md:154:            - "content-migration-plan-legal-approved"
docs/features\content-migration.md:157:      retry:
docs/features\content-migration.md:163:        retryExhaustedAction: "pause"
docs/features\content-migration.md:190:        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
docs/features\content-migration.md:191:        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
docs/features\content-migration.md:192:        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
docs/features\content-migration.md:193:        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
docs/features\content-migration.md:194:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
docs/features\content-migration.md:202:| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
docs/features\content-migration.md:221:| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
docs/features\content-migration.md:222:| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
docs/features\content-migration.md:223:| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
docs/features\content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
docs/features\content-migration.md:225:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
docs/features\content-migration.md:226:| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
docs/features\content-migration.md:227:| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
docs/features\content-migration.md:228:| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
docs/features\content-migration.md:229:| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
docs/features\content-migration.md:230:| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
docs/features\content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
docs/features\content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
docs/features\content-migration.md:233:| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
docs/features\content-migration.md:240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
docs/features\content-migration.md:244:| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
docs/features\content-migration.md:245:| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
docs/features\content-migration.md:246:| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
docs/features\content-migration.md:247:| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
docs/features\content-migration.md:248:| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
docs/features\content-migration.md:249:| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
docs/features\content-migration.md:250:| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
docs/features\content-migration.md:251:| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
docs/features\content-migration.md:252:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
docs/features\content-migration.md:253:| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
docs/features\content-migration.md:254:| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
docs/features\content-migration.md:255:| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
docs/features\content-migration.md:256:| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |
docs/features\content-migration.md:266:#### 3.2.3 `instance-to-instance-copy`
docs/features\content-migration.md:291:  idempotencyKey: string;
docs/features\content-migration.md:303:  retryable: boolean;
docs/features\content-migration.md:323:  idempotencyKey: string;
docs/features\content-migration.md:338:  idempotencyKey: string;
docs/features\content-migration.md:348:  idempotencyKey: string;
docs/features\content-migration.md:358:  idempotencyKey: string;
docs/features\content-migration.md:368:  idempotencyKey: string;
docs/features\content-migration.md:400:### 3.4 idempotencyKey + requestFingerprint (CM3-19)
docs/features\content-migration.md:404:| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
docs/features\content-migration.md:405:| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
docs/features\content-migration.md:406:| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
docs/features\content-migration.md:407:| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
docs/features\content-migration.md:408:| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
docs/features\content-migration.md:409:| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
docs/features\content-migration.md:410:| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |
docs/features\content-migration.md:466:      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
docs/features\content-migration.md:624:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)
docs/features\content-migration.md:628:| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
docs/features\content-migration.md:629:| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
docs/features\content-migration.md:630:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
docs/features\content-migration.md:631:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
docs/features\content-migration.md:632:| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |
docs/features\content-migration.md:641:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
docs/features\content-migration.md:647:`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).
docs/features\content-migration.md:649:### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)
docs/features\content-migration.md:654:  SELECT id FROM content_migration_notification_outbox
docs/features\content-migration.md:657:  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
docs/features\content-migration.md:659:UPDATE content_migration_notification_outbox o
docs/features\content-migration.md:664:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:669:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:676:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:682:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:700:| `cross-entity-copy` | planKind=instance-to-instance-copy 또는 sourceInstance != targetInstance |
docs/features\content-migration.md:734:9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
docs/features\content-migration.md:745:| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
docs/features\content-migration.md:746:| `content-migration-run-completed` | normal | inApp | super-admin |
docs/features\content-migration.md:747:| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
docs/features\content-migration.md:748:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
docs/features\content-migration.md:749:| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
docs/features\content-migration.md:750:| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |
docs/features\content-migration.md:752:### 5.2 outbox — § 4.6 SQL
docs/features\content-migration.md:758:| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
docs/features\content-migration.md:759:| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
docs/features\content-migration.md:760:| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
docs/features\content-migration.md:761:| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
docs/features\content-migration.md:762:| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
docs/features\content-migration.md:763:| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |
docs/features\content-migration.md:785:| outbox 발송 성공율 | > 99% | |
docs/features\content-migration.md:801:| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
docs/features\content-migration.md:802:| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
docs/features\content-migration.md:803:| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
docs/features\content-migration.md:804:| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
docs/features\content-migration.md:838:| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
docs/features\content-migration.md:869:## 9. 빌드·런타임·migration·invariant 검증
docs/features\content-migration.md:894:- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
docs/features\content-migration.md:912:- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
docs/features\content-migration.md:915:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
docs/features\content-migration.md:917:### 9.3 migration-time validation
docs/features\content-migration.md:938:- step retry exhausted → § 4.4
docs/features\content-migration.md:942:- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
docs/features\content-migration.md:982:| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
docs/features\content-migration.md:1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs/features\content-migration.md:1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
docs/features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features\content-migration.md:1020:| `instanceId` | Slug | ✅ |
docs/features\content-migration.md:1021:| `idempotencyKey` | string | ✅ |
docs/features\content-migration.md:1033:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
docs/features\content-migration.md:1034:**Index**: `(instanceId, status)`, `(expiresAt)`.
docs/features\content-migration.md:1083:| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
docs/features\content-migration.md:1095:- `UNIQUE(planId, idempotencyKey)`
docs/features\content-migration.md:1150:  SELECT id FROM content_migration_step_retry_queue
docs/features\content-migration.md:1153:  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
docs/features\content-migration.md:1155:UPDATE content_migration_step_retry_queue q
docs/features\content-migration.md:1160:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1166:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1171:UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;
docs/features\content-migration.md:1174:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1177:-- + sink alert + run.retryExhaustedAction trigger
docs/features\content-migration.md:1180:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1278:dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.
docs/features\content-migration.md:1283:| `instanceId` | Slug | ✅ |
docs/features\content-migration.md:1293:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
docs/features\content-migration.md:1297:**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.
docs/features\crm-sync.md:12:> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features\crm-sync.md:19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
docs/features\crm-sync.md:45:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs/features\crm-sync.md:50:| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
docs/features\crm-sync.md:55:| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
docs/features\crm-sync.md:56:| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
docs/features\crm-sync.md:67:- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features\crm-sync.md:70:### 1.2.1 retry taxonomy
docs/features\crm-sync.md:96:activation: { scope: "instance", default: false }
docs/features\crm-sync.md:109:| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |
docs/features\crm-sync.md:120:      apiKeySecretRef: "secretRef://..."
docs/features\crm-sync.md:122:      webhookSecret: "secretRef://..."
docs/features\crm-sync.md:125:      dpaEvidenceRef: "secretRef://..."
docs/features\crm-sync.md:150:      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
docs/features\crm-sync.md:157:        retryAfterRespected: true
docs/features\crm-sync.md:162:        retryQueueCompleted: 30; notificationOutbox: 30; consentWithdrawalLedger: 1095
docs/features\crm-sync.md:166:        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
docs/features\crm-sync.md:167:        crmExternalIdHashPepperRef: "secretRef://CRM_EXT_ID_HASH_PEPPER"
docs/features\crm-sync.md:168:        changeIdentityKeyPepperRef: "secretRef://CRM_CHANGE_IDENTITY_PEPPER"
docs/features\crm-sync.md:169:        rrnFingerprintPepperRef: "secretRef://CRM_RRN_FINGERPRINT_PEPPER"
docs/features\crm-sync.md:170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
docs/features\crm-sync.md:171:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://..." }
docs/features\crm-sync.md:183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
docs/features\crm-sync.md:338:  instanceId: string;
docs/features\crm-sync.md:342:  idempotencyKey: string;                       // UNIQUE per instance
docs/features\crm-sync.md:363:  status: "pushed" | "queued-retry" | "blocked-rrn" | "blocked-consent-withdrawn" | "cas-conflict-detected";
docs/features\crm-sync.md:417:      idempotencyKey: string;                   // 중복 적용 방지
docs/features\crm-sync.md:426:      idempotencyKey: string;
docs/features\crm-sync.md:505:  retrySemantics: "provider-retries" | "no-retry";
docs/features\crm-sync.md:566:- **CrmWebhookNonceLedger**: **transport-level dedupe** — webhook delivery 중복(provider retry·재전송). polling 미사용
docs/features\crm-sync.md:589:8. CRM API call (idempotency-key)
docs/features\crm-sync.md:654:#### 4.3.1 FieldAuthority
docs/features\crm-sync.md:657:type FieldAuthority =
docs/features\crm-sync.md:696:| FieldAuthority=last-write-wins-timestamp + timestamp 차이 ≤ 5s + version tie | ✅ |
docs/features\crm-sync.md:697:| FieldAuthority=last-write-wins-version + version tie | ✅ |
docs/features\crm-sync.md:698:| FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
docs/features\crm-sync.md:700:| FieldAuthority=crm/solution-authoritative | ❌ |
docs/features\crm-sync.md:712:### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)
docs/features\crm-sync.md:782:FOR UPDATE SKIP LOCKED
docs/features\crm-sync.md:809:### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개
docs/features\crm-sync.md:814:  SELECT id FROM crm_sync_notification_outbox
docs/features\crm-sync.md:816:  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
docs/features\crm-sync.md:818:UPDATE crm_sync_notification_outbox o
docs/features\crm-sync.md:823:UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;
docs/features\crm-sync.md:826:UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;
docs/features\crm-sync.md:829:UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
docs/features\crm-sync.md:846:| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | false | RESTRICT |
docs/features\crm-sync.md:864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
docs/features\crm-sync.md:865:3. `(integrationId, idempotencyKey)` lookup:
docs/features\crm-sync.md:867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
docs/features\crm-sync.md:870:5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
docs/features\crm-sync.md:904:### 6.2 outbox — § 4.6 SQL
docs/features\crm-sync.md:978:| outbox 성공율 | > 99% | |
docs/features\crm-sync.md:1053:- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
docs/features\crm-sync.md:1087:§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:
docs/features\crm-sync.md:1118:| § 10.3 v0.6 migration | INV-MIGRATION |
docs/features\crm-sync.md:1137:## 10. 빌드·런타임·migration·invariant 검증
docs/features\crm-sync.md:1177:- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
docs/features\crm-sync.md:1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
docs/features\crm-sync.md:1183:### 10.3 migration-time validation
docs/features\crm-sync.md:1244:| CS-05 | OAuth refresh token rotation 자동화 |
docs/features\crm-sync.md:1303:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1306:| `apiKeySecretRef` | secretRef | ✅ |
docs/features\crm-sync.md:1308:| `webhookSecret` | secretRef | optional |
docs/features\crm-sync.md:1313:| `dpaEvidenceRef` | secretRef | ✅ |
docs/features\crm-sync.md:1319:**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
docs/features\crm-sync.md:1320:**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.
docs/features\crm-sync.md:1327:| `idempotencyKey` | string | ✅ |
docs/features\crm-sync.md:1328:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1339:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\crm-sync.md:1340:**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.
docs/features\crm-sync.md:1352:| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
docs/features\crm-sync.md:1366:| `idempotencyKey` | string | ✅ |
docs/features\crm-sync.md:1377:**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
docs/features\crm-sync.md:1383:-- 1. claim (FOR UPDATE SKIP LOCKED)
docs/features\crm-sync.md:1385:  SELECT id FROM crm_sync_retry_queue
docs/features\crm-sync.md:1388:  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
docs/features\crm-sync.md:1390:UPDATE crm_sync_retry_queue q
docs/features\crm-sync.md:1412:         bool_or(status='in-retry-queue') AS any_retry
docs/features\crm-sync.md:1417:  WHEN (SELECT any_retry FROM agg) THEN 'retried'
docs/features\crm-sync.md:1423:UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;
docs/features\crm-sync.md:1426:UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
docs/features\crm-sync.md:1430:UPDATE crm_sync_retry_queue SET status='exhausted'
docs/features\crm-sync.md:1432:UPDATE crm_sync_retry_queue SET status='failed-permanent'
docs/features\crm-sync.md:1434:-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
docs/features\crm-sync.md:1444:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1473:**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
docs/features\crm-sync.md:1475:**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.
docs/features\crm-sync.md:1497:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1501:| `authority` | FieldAuthority | ✅ |
docs/features\crm-sync.md:1506:**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
docs/features\crm-sync.md:1508:build-time: instance mode="outbound-only" + 본 테이블 `direction IN (inbound, both)` 존재 → build fail.
docs/features\crm-sync.md:1561:| `secretRef` | secretRef | ✅ |
docs/features\crm-sync.md:1563:| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
docs/features\crm-sync.md:1633:| `idempotencyKey` | string | ✅ |
docs/features\crm-sync.md:1650:- `UNIQUE(integration_id, idempotency_key)`
docs/features\crm-sync.md:1682:| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
docs/features\crm-sync.md:1684:| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
docs/features\keyword-monitoring.md:7:> **목적**: 사용자 지정 N개 키워드의 검색 순위·노출·CTR·rank bucket transition 모니터링. analytics-reporting의 queryNormalizedMetrics 데이터 기반. 이상 변동 시 outbox 알림.
docs/features\keyword-monitoring.md:37:  - **매칭 키**: (instanceId, query 또는 page, date, severity 기준) — search-visibility AnomalyRecord 검색
docs/features\keyword-monitoring.md:59:| **migration-time validation 룰 추가·강화** | **MAJOR** | 별개 | KMF4-06 — § 11.3 신설 영역. 운영 데이터 무결성 영향 |
docs/features\keyword-monitoring.md:73:### 1.2.1 공통 retry taxonomy
docs/features\keyword-monitoring.md:75:search-visibility § 1.2.1 동일 — 2종 retry 구조:
docs/features\keyword-monitoring.md:101:  scope: "instance"
docs/features\keyword-monitoring.md:184:        dsnSecretRef: "secretRef://MONITORING_DSN"
docs/features\keyword-monitoring.md:196:| 실행 command | `detectAnomalies(input)` | 이상 변동 감지 + outbox enqueue |
docs/features\keyword-monitoring.md:209:| `keyword-monitoring-retroactive-enqueue-requested` | `"instance:" + instanceId` (synthetic — search-visibility § 7.5 패턴 동일) | windowStart·windowEnd·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId·actorRole="super-admin" |
docs/features\keyword-monitoring.md:210:| `keyword-tracking-target-migrated-v02-v03` | `"instance:" + instanceId` | § 10.3 migration audit contract metadata 참조 (decompositions[]·conflictResolutions[]·actorRole="super-admin") |
docs/features\keyword-monitoring.md:217:  instanceId: Slug;
docs/features\keyword-monitoring.md:268:    notify: boolean;                                   // KMF3-04 — outbox enqueue 대상 여부
docs/features\keyword-monitoring.md:279:- `notify=false`: ctr-up direction (anomalyRecord 저장만, outbox 미enqueue) → `notificationSuppressionReason="not-enqueue-eligible"`
docs/features\keyword-monitoring.md:280:- `notify=false`: mode="monitor-only" (모든 anomaly outbox 미enqueue) → `notificationSuppressionReason="monitor-only-mode"`
docs/features\keyword-monitoring.md:282:- `notify=true`: outbox enqueue 대상. 발송 완료 시 `notificationEventId` 채움
docs/features\keyword-monitoring.md:329:  instanceId,
docs/features\keyword-monitoring.md:373:## 6. 알림 (outbox 패턴)
docs/features\keyword-monitoring.md:377:| eventType | anomalySeverity | notificationCriticality (REVIEW_WORKFLOW § 9.1.1) | outbox enqueue |
docs/features\keyword-monitoring.md:388:| `keyword-monitoring-monitoring-failed` | (anomaly 아님 — operational) | high | ✅ (별도 outbox sourceKind="monitoring-log") |
docs/features\keyword-monitoring.md:395:- **outbox sourceKind/sourceId 일반화** (F-6 + KM2-03 정정):
docs/features\keyword-monitoring.md:398:  - sourceKind="rank-bucket-transition" + sourceId=**transitionEventId** (KM2-03 — 각 transition별 고유 ID. KeywordRankBucketState.lastTransitionEventId와 동일 식별자. AnomalyRecord 생성과 별개로 outbox row 생성 가능)
docs/features\keyword-monitoring.md:399:- UNIQUE constraint: `UNIQUE(sourceKind, sourceId, eventType)` (단일 source·eventType별 1 outbox 1건. rank-bucket-transition은 transition별 별도 sourceId라 동일 target의 후속 transition도 정상 enqueue)
docs/features\keyword-monitoring.md:404:- 동일 transition 재호출 시 동일 ID — idempotent
docs/features\keyword-monitoring.md:406:**원자성** (KMF3-02 — state + outbox 단일 transaction):
docs/features\keyword-monitoring.md:409:   - acquire 실패 시 → **idempotent no-op + early exit** (다른 worker가 이미 처리 중). retryable error 아님 (KMF4-04)
docs/features\keyword-monitoring.md:415:      (값이 이미 새 transitionEventId면 다른 worker가 처리 — abort, idempotent no-op)
docs/features\keyword-monitoring.md:417:      UNIQUE(sourceKind, sourceId, eventType) 위반 시 → 다른 worker 처리 → abort, idempotent no-op
docs/features\keyword-monitoring.md:431:| `keyword-monitoring-monitoring-failed` | `"instance:" + instanceId` (synthetic) | `"키워드 모니터링 cycle 실패 (${date})"` | monitoringLogId·failedSources[]·detectedAt |
docs/features\keyword-monitoring.md:451:| keywordRank | **anomaly suppression ledger** | key=hash(instanceId+signal+keywordTargetId+severity+keywordMonitoringPolicyVersion) |
docs/features\keyword-monitoring.md:475:- outbox dispatch-failed-permanent 발생
docs/features\keyword-monitoring.md:491:## 10.3 migration·backfill 정책 (KM2-04)
docs/features\keyword-monitoring.md:493:본 Feature는 v0.1 초안과 v0.2/v0.3 정규화 사이 데이터 모델 변경이 있음 — v1.0 이전 운영 데이터가 있는 인스턴스는 다음 migration 적용:
docs/features\keyword-monitoring.md:502:  - 나머지 신규 row는 본 migration 시점 이후 snapshot만 누적
docs/features\keyword-monitoring.md:503:- **migration 운영**:
docs/features\keyword-monitoring.md:504:  - 운영자 명시 액션 `migrateKeywordTrackingTargetsV02toV03(instanceId, dryRun)` (super-admin 전용)
docs/features\keyword-monitoring.md:507:  - audit contract: contentRef=`"instance:" + instanceId`, metadata={
docs/features\keyword-monitoring.md:517:           activeAfter: boolean                          // migration 후 active 상태
docs/features\keyword-monitoring.md:529:신규 인스턴스(v0.3 이후 만들어진 인스턴스)는 본 migration 불필요.
docs/features\keyword-monitoring.md:533:## 11. 빌드·런타임·migration 검증 (KMF3-07 — 3분리)
docs/features\keyword-monitoring.md:561:### 11.3 migration-time validation (KMF3-07)
docs/features\keyword-monitoring.md:566:- migration 후 active KeywordTrackingTarget 수가 maxKeywordsPerInstance 초과 — **migration-time fail** (preflight dryRun에서 감지. 운영자 명시 정리 후 dryRun=false 재실행 필요)
docs/features\keyword-monitoring.md:572:- **rank-bucket transition 원자성 invariant**: KeywordRankBucketState.lastTransitionEventId 갱신과 KeywordAnomalyNotificationOutbox(sourceKind="rank-bucket-transition") insert가 단일 transaction 외부에서 발생한 sequence 감지 (예: state만 갱신·outbox row 부재 또는 그 반대) → reconcile job 트리거
docs/features\keyword-monitoring.md:573:- **outbox dispatch-failed-permanent 누적** > 임계 → 운영팀 알림
docs/features\keyword-monitoring.md:576:  - `KeywordAnomalyNotificationOutbox.claimedAt > 5분` (§ 6.2 outbox SQL 정합) → 재claim
docs/features\keyword-monitoring.md:620:- **partial unique index** — `UNIQUE(instanceId, keyword, country, device, searchEngine) WHERE active=true` (PostgreSQL 기준)
docs/features\keyword-monitoring.md:622:- 다른 DBMS는 generated column `activeKey = CASE WHEN active=true THEN 1 ELSE NULL END` + `UNIQUE(instanceId, keyword, country, device, searchEngine, activeKey)` (notifications DLQ partial unique 패턴 동일)
docs/features\keyword-monitoring.md:627:1. advisory lock acquire (hash(instanceId, keyword, country, device, searchEngine))
docs/features\keyword-monitoring.md:628:2. 동일 (instanceId, keyword, country, device, searchEngine, active=true) 검사:
docs/features\keyword-monitoring.md:641:**Index**: `(instanceId, active)`, `(instanceId, category)`.
docs/features\keyword-monitoring.md:648:| `instanceId` | Slug | ✅ |
docs/features\keyword-monitoring.md:662:**Index**: `(instanceId, signal, date)`, `(keywordTargetId, signal, date)`, `(expiresAt)`.
docs/features\keyword-monitoring.md:674:worker SoT 쿼리·SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant — search-visibility § 13.5 SQL 동일.
docs/features\keyword-monitoring.md:693:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
docs/features\keyword-monitoring.md:700:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)` (F-6 — sourceKind·sourceId·eventType별 1 outbox row).
docs/features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs/features\notifications.md:7:> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
docs/features\notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
docs/features\notifications.md:24:- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
docs/features\notifications.md:78:  scope: "instance"
docs/features\notifications.md:106:  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
docs/features\notifications.md:107:  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
docs/features\notifications.md:118:      retryMaxAttempts: 3
docs/features\notifications.md:119:      retryBackoffSeconds: [30, 300, 1800]
docs/features\notifications.md:132:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
docs/features\notifications.md:143:- `sourceEventId` — idempotency key (필수)
docs/features\notifications.md:147:- recipient의 AdminUser `instanceMemberships[]`에 본 인스턴스 미포함 시 → `skipped-missing-user` (§ 4.1 4.a — instance membership 검증)
docs/features\notifications.md:195:  | "failed-retrying"
docs/features\notifications.md:197:  | "skipped-missing-user"           // AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함
docs/features\notifications.md:221:**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
docs/features\notifications.md:224:  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
docs/features\notifications.md:227:  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
docs/features\notifications.md:228:  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
docs/features\notifications.md:246:1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
docs/features\notifications.md:248:   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
docs/features\notifications.md:250:     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
docs/features\notifications.md:251:     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음
docs/features\notifications.md:266:      - AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`
docs/features\notifications.md:291:   - failed-retrying → 재시도 큐
docs/features\notifications.md:312:  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
docs/features\notifications.md:313:  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
docs/features\notifications.md:320:  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
docs/features\notifications.md:322:    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}
docs/features\notifications.md:332:  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
docs/features\notifications.md:342:  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
docs/features\notifications.md:366:- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
docs/features\notifications.md:375:- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
docs/features\notifications.md:388:- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
docs/features\notifications.md:398:- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
docs/features\notifications.md:411:- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
docs/features\notifications.md:537:| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
docs/features\notifications.md:646:| transient 재시도율 | failed-retrying / 전체 | < 5% |
docs/features\notifications.md:675:# 3. secretRef 등록 (이메일·Slack·monitoring sink)
docs/features\notifications.md:689:| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
docs/features\notifications.md:710:| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
docs/features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs/features\notifications.md:743:- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)
docs/features\notifications.md:745:### 14.2 `NotificationEventReceipt` (idempotency 선점)
docs/features\notifications.md:750:| `instanceId` | Slug | ✅ | |
docs/features\notifications.md:751:| `sourceEventId` | string | ✅ | idempotency key |
docs/features\notifications.md:757:**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
docs/features\notifications.md:758:**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
docs/features\notifications.md:839:| `instanceId` | Slug | ✅ | |
docs/features\notifications.md:849:**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
docs/features\notifications.md:850:**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.
docs/features\notifications.md:899:| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
docs/features\notifications.md:913:키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
docs/features\notifications.md:914:값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
docs/features\notifications.md:917:  failed-retrying: dedupeWindowSeconds + 300
docs/features\search-visibility.md:7:> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
docs/features\search-visibility.md:15:- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
docs/features\search-visibility.md:48:- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)
docs/features\search-visibility.md:50:### 1.2.1 공통 retry taxonomy (SV2-15 신설)
docs/features\search-visibility.md:52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:
docs/features\search-visibility.md:59:| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
docs/features\search-visibility.md:97:  scope: "instance"
docs/features\search-visibility.md:137:    apiKeySecretRef: "secretRef://AHREFS_API_KEY"
docs/features\search-visibility.md:214:        dsnSecretRef: "secretRef://MONITORING_DSN"
docs/features\search-visibility.md:226:| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
docs/features\search-visibility.md:235:- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`
docs/features\search-visibility.md:270:  instanceId,
docs/features\search-visibility.md:302:  - **site-overall target**: `SUM(impressions) WHERE instanceId=this AND date=t` (전체 합산)
docs/features\search-visibility.md:338:- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
docs/features\search-visibility.md:345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
docs/features\search-visibility.md:384:- `normalizedAuthorityScore` **optional** (SV2-19 — v1.0 변환 함수 미확정, SV-09 후속)
docs/features\search-visibility.md:409:- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
docs/features\search-visibility.md:426:## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)
docs/features\search-visibility.md:432:### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)
docs/features\search-visibility.md:444:### 7.3 발송 흐름 — outbox SQL
docs/features\search-visibility.md:446:v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).
docs/features\search-visibility.md:453:| `search-visibility-monitoring-failed` | `"instance:" + instanceId` (synthetic — envelope 단위) | `"Search visibility monitoring failed (${date})"` | monitoringLogId·failedSources[]·detectedAt |
docs/features\search-visibility.md:458:- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
docs/features\search-visibility.md:461:- `createdAt`: detectedAt 또는 outbox enqueue 시각
docs/features\search-visibility.md:463:DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.
docs/features\search-visibility.md:465:### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)
docs/features\search-visibility.md:467:- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
docs/features\search-visibility.md:474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
docs/features\search-visibility.md:478:  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유지 (notifications idempotent receipt가 중복 발송 차단)
docs/features\search-visibility.md:479:  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
docs/features\search-visibility.md:481:  - `contentRef = "instance:" + instanceId` (synthetic — batch 단위 액션이라 단일 콘텐츠 ref 없음)
docs/features\search-visibility.md:484:- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)
docs/features\search-visibility.md:564:| SV-09 | normalizedAuthorityScore 변환 함수 | v1.x patch (optional 필드) |
docs/features\search-visibility.md:567:| SV-14 | signed URL refresh client SDK | 인프라 결정 (SV3-09) |
docs/features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
docs/features\search-visibility.md:602:| `idempotencyKey` | string | ✅ |
docs/features\search-visibility.md:603:| `instanceId` | Slug | ✅ |
docs/features\search-visibility.md:618:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\search-visibility.md:630:UPDATE search_visibility_collection_retry_queue
docs/features\search-visibility.md:633:  SELECT id FROM search_visibility_collection_retry_queue
docs/features\search-visibility.md:637:  FOR UPDATE SKIP LOCKED
docs/features\search-visibility.md:681:| `instanceId` | Slug | ✅ |
docs/features\search-visibility.md:692:**Constraints**: `UNIQUE(instanceId, signal, targetKind, targetId)`.
docs/features\search-visibility.md:699:  - **canonical object key format**: `{blobStorage.keyPrefix}{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (예: `search-visibility/client-01/2026-05-14/abc123.html`)
docs/features\search-visibility.md:700:  - signed URL 발급 API는 호출자 AdminUser.instanceMemberships에 본 instanceId 포함 여부 검증 (미포함 시 403)
docs/features\search-visibility.md:706:      "Resource": "arn:aws:s3:::glitzy-sv-artifacts/search-visibility/${aws:PrincipalTag/instanceId}/*",
docs/features\search-visibility.md:707:      "Condition": { "StringEquals": { "aws:PrincipalTag/instanceId": "${...}" } }
docs/features\search-visibility.md:710:  - **signed URL refresh**: TTL 600초. 대시보드 client는 만료 60초 전 read API 재호출로 fresh URL 발급. 대시보드 장기 열람 중 자동 refresh (요청 응답 client SDK 제공 — 인프라 결정 SV-14 신설)
docs/features\search-visibility.md:711:  - cross-instance access 자동 차단 (IAM PrincipalTag + signed URL 발급 권한 검증 양층)
docs/features\search-visibility.md:714:### 13.9 `BacklinkSnapshot` (SV2-19 — normalizedAuthorityScore optional)
docs/features\search-visibility.md:716:v0.2 § 13.7 유지 + `normalizedAuthorityScore`를 **optional**로 정정 (variant 함수 SV-09 미확정 시 detector는 providerMetricValue로 작동).
docs/features\search-visibility.md:723:- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

 succeeded in 705ms:
docs\decisions\INFRA_DECISIONS_DRAFT.md:3:> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 2·minor 2 (정정 완료)
docs\decisions\INFRA_DECISIONS_DRAFT.md:452:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정. 4 지적 정정 완료**: (1) P0 schema 목록 NotificationEvent → NotificationEventReceipt 정정 + NotificationEvent는 입력 타입임을 명시 (INFRA3-01), (2) audit_log read path tenant-scoped RLS 정책 분리 (INFRA3-02), (3) Storage 섹션 Cloudflare R2 채택 확정·Supabase Storage rejected alternative (INFRA3-03), (4) notifications.md 예시 drift는 8 Feature spec cascade 시 정정 (INFRA3-04 — 후속 minor cascade). **3 cycle 누계 36 지적 전건 수용**. SoT cascade 완료: REVIEW_WORKFLOW (NotificationEventType 6종 + AuditAction 17종 — service-role-invoked·instance-switched 추가), DATA_MODEL v0.23 (C-08 email transport/provider 분리) |
docs\core\CONTENT_STANDARDS.md:418:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
docs\core\CONTENT_STANDARDS.md:432:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
docs\core\CONTENT_STANDARDS.md:451:  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
docs\core\CONTENT_STANDARDS.md:452:  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
docs\core\CONTENT_STANDARDS.md:453:  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
docs\core\CONTENT_STANDARDS.md:455:  findingsBySeverity: {
docs\core\CONTENT_STANDARDS.md:463:  // 상세 findings
docs\core\CONTENT_STANDARDS.md:464:  findings: Finding[];
docs\core\CONTENT_STANDARDS.md:468:// - findings에 severity="fail" 1개 이상 → "block"
docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs\core\CONTENT_STANDARDS.md:647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs\features\asset-ingestion.md:184:// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
docs\features\asset-ingestion.md:194:- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
docs\features\asset-ingestion.md:195:- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
docs\features\asset-ingestion.md:196:- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\core\DATA_MODEL.md:818:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
docs\features\compliance-assistant.md:135:  findingsBySeverity: {
docs\features\compliance-assistant.md:142:  findings: Finding[];
docs\features\compliance-assistant.md:223:   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
docs\features\compliance-assistant.md:224:   - `buildBlocked` = findings 중 fail 1+ 존재
docs\features\compliance-assistant.md:225:   - `gateRequired` = findings 중 content-gate 1+ 존재
docs\features\compliance-assistant.md:226:   - `hasWarnings` = findings 중 warning 1+ 존재
docs\features\compliance-assistant.md:319:- 정적 룰 검수 결과 (findings[])
docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs\features\content-migration.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외 — anchor residue 정정 완료)
docs\features\content-migration.md:1007:| 2026-05-15 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 86건 (24+23+21+14+8+3+1) 전건 수용. blocking 0·major 0·minor 1 (CM7-01 anchor residue — 정정 완료). SoT cascade 완료: REVIEW_WORKFLOW (6종 NotificationEventType + 15종 AuditAction), DATA_MODEL v0.22 (contentMigrationConfig·piiFieldCatalogRef·entityFieldProjectionCatalogRef). 의료법·개인정보보호법 운영 가능. **8 Feature 마지막 — 전체 spec 완료** |
docs\features\crm-sync.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
docs\features\keyword-monitoring.md:408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs\features\notifications.md:629:  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |

 succeeded in 736ms:
C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md
C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md
C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md

codex
{
  "schema_version": "review.v1",
  "review_target": "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md",
  "review_round": 1,
  "id_prefix": "SPIKE1-",
  "ready_for_acceptance": false,
  "summary": {
    "verdict": "현재 Spike A/B/C는 인프라 결정 v1.0의 핵심 리스크를 대체로 겨냥하지만, 실제 provider/Supabase/Vercel/Auth.js/Drizzle Kit 배포면을 Week 1 gate에서 제외해 false PASS 위험이 큽니다.",
    "blocking": 4,
    "major": 9,
    "minor": 5
  },
  "findings": [
    {
      "id": "SPIKE1-01",
      "severity": "blocking",
      "category": "hypothesis-priority",
      "location": "§0.2, §A, §C",
      "issue": "Week 1 gate가 로컬 docker-compose만으로 구성되어 Supabase Pooler, R2 IAM, Vercel serverless, Auth.js 실제 세션/쿠키 동작을 검증하지 않습니다.",
      "impact": "Spike PASS가 production viability를 보장하지 못합니다. 특히 A의 pgBouncer와 Supabase Pooler, C의 minio와 R2 IAM 차이는 핵심 가설 자체입니다.",
      "recommendation": "Week 1 또는 Week 2 초입 gate에 'provider smoke required before PASS'를 추가하세요. 최소 Supabase dev project + Pooler transaction mode, R2 staging bucket IAM/presigned URL, Vercel preview/Auth.js callback 1회는 실제 provider로 검증해야 합니다."
    },
    {
      "id": "SPIKE1-02",
      "severity": "blocking",
      "category": "missing-spike",
      "location": "§0.2, 종합 일정",
      "issue": "Drizzle Kit migration/deploy 가정이 Spike에서 빠져 있습니다.",
      "impact": "Phase 0 Week 4의 M0 vertical slice schema와 RLS policy/role/FK/index/partial index 배포가 막히면 A/B/C가 통과해도 본 구현 진입이 실패할 수 있습니다.",
      "recommendation": "Spike D를 추가하거나 A에 포함하세요: Drizzle Kit로 roles/RLS/policies/partial indexes/custom SQL migration 생성, dev→staging apply, rollback/forward-only hotfix, shadow DB 또는 drift check, service_role migration runner audit를 검증해야 합니다."
    },
    {
      "id": "SPIKE1-03",
      "severity": "blocking",
      "category": "auth-gap",
      "location": "Spike A title, §A.1~A.3",
      "issue": "Spike A 제목은 Auth.js tenant scoping을 포함하지만 실험은 Auth.js session, magic link, callback, session refresh, user deactivation, instanceMembership 변경 즉시 반영을 검증하지 않습니다.",
      "impact": "INFRA2-08의 resolveTenantContext가 실제 요청 경로에서 강제되는지 검증되지 않습니다. RLS가 안전해도 잘못된 requestedInstanceId가 RLS context로 들어가면 권한 모델이 무너집니다.",
      "recommendation": "A에 Auth.js request-level scenario를 추가하세요: 로그인→session 생성→requestedInstanceId 검증→withTenantTransaction 진입, membership 제거 후 다음 request 403, inactive user 차단, super-admin instance switch audit, client-supplied instanceId tampering 차단."
    },
    {
      "id": "SPIKE1-04",
      "severity": "blocking",
      "category": "storage-validation",
      "location": "§C.2 scenario 8, §C.4",
      "issue": "R2 IAM isolation을 핵심 가설로 두면서 minio 시뮬레이션만 수행하고 production R2 검증을 Week 2~3로 미룹니다.",
      "impact": "Spike C의 가장 위험한 부분은 S3 SDK 호환이 아니라 Cloudflare R2의 credential/IAM/policy semantics입니다. minio PASS는 IAM isolation PASS가 아닙니다.",
      "recommendation": "C의 PASS 조건을 둘로 나누세요: C-local은 prefix/signing logic, C-provider는 R2 staging IAM policy로 instance-a credential이 instance-b prefix GetObject/ListBucket/PutObject/CopyObject에 실패하는지 실제 검증. provider 검증 전에는 PASS가 아니라 PASS with unresolved provider risk로만 종료해야 합니다."
    },
    {
      "id": "SPIKE1-05",
      "severity": "major",
      "category": "pass-criteria",
      "location": "§A.3, §B.3",
      "issue": "'race condition 없음', 'SET LOCAL leak 없음', '정확히 1번 처리'가 binary처럼 쓰였지만 검증 방법과 반복 횟수, 관측 invariant가 없습니다.",
      "impact": "10 connections/100 jobs 1회 성공은 negative invariant 증명이 아닙니다. 낮은 확률의 pool leak, duplicate, lost update가 통과될 수 있습니다.",
      "recommendation": "반복 실행 기준을 명시하세요. 예: A는 1000 iterations × 20 concurrent requests, 매 query에서 pg_backend_pid/current_user/current_setting/result instance set 기록 후 cross-tenant row 0건. B는 1000 jobs × 10 workers × 20 runs, UNIQUE(sourceEventId), processed ledger, invariant query duplicate=0/missing=0/foreign_instance=0."
    },
    {
      "id": "SPIKE1-06",
      "severity": "major",
      "category": "spike-a-scenario-gap",
      "location": "§A.2",
      "issue": "A가 SELECT 중심입니다. INSERT/UPDATE/DELETE의 WITH CHECK, invalid instanceId, nested transaction/savepoint, rollback 후 SET LOCAL 해제, transaction 재사용 실패 케이스가 없습니다.",
      "impact": "읽기 격리는 통과해도 쓰기 경로에서 cross-tenant insert/update가 가능하거나 rollback 후 context가 새 transaction에 남는 결함을 놓칠 수 있습니다.",
      "recommendation": "A에 negative writes를 추가하세요: instance-a tx에서 instance-b row insert/update/delete 시도 실패, malformed UUID 실패 방식 확인, rollback 후 direct query 0건, nested tx/savepoint에서 setting 유지, tx 밖 scopedDb 사용 runtime guard throw."
    },
    {
      "id": "SPIKE1-07",
      "severity": "major",
      "category": "spike-a-production-gap",
      "location": "§A.2 scenario 7, §A.3",
      "issue": "service_role break-glass audit를 pass criteria에 넣었지만 prototype skeleton에는 audit_log table/RLS/read policy/append-only 검증이 없습니다.",
      "impact": "INFRA2-02와 INFRA3-02의 핵심인 service_role 사용 추적과 audit read isolation이 검증되지 않습니다.",
      "recommendation": "A에 audit_log 최소 schema를 포함하고 service-role-invoked insert 1건, tenant read view에서 자기 instance만 조회, 다른 instance audit metadata 미노출, append-only update/delete 실패를 검증하세요."
    },
    {
      "id": "SPIKE1-08",
      "severity": "major",
      "category": "spike-b-correctness",
      "location": "§B.1~B.3",
      "issue": "B가 'exactly-once 처리'를 가설로 둡니다. 2 transaction 분리 구조에서는 crash 위치에 따라 exactly-once는 일반적으로 보장 불가이며 idempotent at-least-once + reconcile가 현실적인 목표입니다.",
      "impact": "잘못된 성공 기준이 설계를 왜곡합니다. 특히 tenant transaction commit 후 outbox completed mark 전에 worker가 죽으면 결과는 이미 반영됐지만 outbox는 재처리됩니다.",
      "recommendation": "가설을 'idempotent at-least-once with exactly-once observable effects'로 바꾸고, tenant 결과 table에 deterministic idempotency key UNIQUE(instanceId, sourceEventId)를 두세요. crash-after-tenant-commit-before-control-complete 시 재처리가 no-op인지 검증해야 합니다."
    },
    {
      "id": "SPIKE1-09",
      "severity": "major",
      "category": "spike-b-scenario-gap",
      "location": "§B.2",
      "issue": "worker crash 시나리오가 claim 후 process 전 SIGKILL 하나뿐입니다.",
      "impact": "실제 위험 위치인 process 중간, tenant commit 직후, retry row insert 후, permanent fail alert 전/후, control transaction rollback 후를 놓칩니다.",
      "recommendation": "failure injection points를 명시하세요: claim 전/후, tenant insert 전/후, tenant commit 후 completed mark 전, retry schedule 전/후, maxAttempts sink alert 전/후. 각 지점별 expected state와 reconcile invariant를 표로 추가하세요."
    },
    {
      "id": "SPIKE1-10",
      "severity": "major",
      "category": "spike-b-production-gap",
      "location": "§B.3",
      "issue": "provider 호출 같은 외부 side effect가 실험에 없습니다.",
      "impact": "notifications, search visibility, CRM sync 등은 DB row insert만이 아니라 email/API/webhook 호출을 포함합니다. DB idempotency만으로 외부 중복 발송을 막는지 검증되지 않습니다.",
      "recommendation": "B에 fake provider를 추가해 idempotency key별 external call count를 기록하세요. worker crash/retry 후 동일 sourceEventId의 external call이 1회인지, retryable 5xx와 permanent 4xx 전이가 분리되는지 검증해야 합니다."
    },
    {
      "id": "SPIKE1-11",
      "severity": "major",
      "category": "spike-c-pass-criteria",
      "location": "§C.2 scenario 6, §C.3",
      "issue": "TTL 만료 후 '401'을 기대합니다. S3/R2 presigned URL 만료/서명 실패는 보통 403 계열일 수 있어 pass criteria가 provider semantics와 맞지 않을 가능성이 큽니다.",
      "impact": "정상 provider 동작을 실패로 판정하거나, minio 동작에 맞춘 잘못된 클라이언트 에러 처리를 구현할 수 있습니다.",
      "recommendation": "상태코드 기준을 provider별 실제 응답으로 정정하세요. 핵심 invariant는 '만료 후 object body 미반환 + fresh URL 재발급 전 접근 불가'입니다. R2 staging에서 만료 응답 code/body를 기록해 client handling contract로 고정하세요."
    },
    {
      "id": "SPIKE1-12",
      "severity": "major",
      "category": "spike-c-security-gap",
      "location": "§C.2~C.3",
      "issue": "signature replay, method confusion, content-type/size enforcement 위치, ListBucket 차단, range request, URL 로그 노출/Referer 유출 시나리오가 없습니다.",
      "impact": "signed URL이 발급 경로에서는 안전해도 재사용, 잘못된 HTTP method, metadata 조작, bucket listing을 통해 tenant boundary가 약해질 수 있습니다.",
      "recommendation": "C에 다음 negative tests를 추가하세요: GET URL로 PUT/DELETE 실패, PUT presign의 content-type/content-length 조건 불일치 실패, ListBucket prefix 외 접근 실패, expired URL replay 실패, range request 허용 여부 결정, issued URL audit에는 full query signature 저장 금지."
    },
    {
      "id": "SPIKE1-13",
      "severity": "major",
      "category": "sot-drift",
      "location": "§C.2 scenario 10",
      "issue": "`storage-url-issued` AuditAction을 사용하지만 REVIEW_WORKFLOW의 AuditAction enum에는 해당 값이 없습니다.",
      "impact": "Spike가 새 audit action을 암묵적으로 도입해 SoT cascade 없이 구현 drift가 발생합니다.",
      "recommendation": "Spike 계획에서 먼저 audit action cascade를 요구하세요. 또는 기존 `service-role-invoked`/feature-specific audit action으로 매핑할지 결정해야 합니다."
    },
    {
      "id": "SPIKE1-14",
      "severity": "major",
      "category": "reversal-cost",
      "location": "§A.4, §C.4",
      "issue": "실패 시 대안이 기술 후보만 나열하고 SoT cascade/reversal 비용을 평가하지 않습니다.",
      "impact": "A 실패는 INFRA2-01, DATA_MODEL의 instanceMembership access path, 모든 feature table RLS/FK 설계, worker 패턴, lint/runtime guard를 재작성하는 결정입니다. C 실패도 3개 feature blob storage 계약과 import/export manifest에 영향을 줍니다.",
      "recommendation": "각 fallback에 reversal blast radius를 추가하세요: affected docs, affected packages, schedule delta, data migration impact, feature specs to amend, decision owner. A 실패는 최소 Phase 0 scope 재산정 gate로 격상해야 합니다."
    },
    {
      "id": "SPIKE1-15",
      "severity": "major",
      "category": "dependency-planning",
      "location": "Spike 종료 후 의사결정, 종합 일정",
      "issue": "Week 2~6 작업이 Spike 결과에 어떻게 의존하는지 dependency graph가 없습니다.",
      "impact": "A가 지연되면 Week 4 schema와 Week 6 e2e가 막히고, B가 지연되면 notifications/search/worker skeleton이 막히며, C가 지연되면 asset-ingestion/content-migration/search artifact 설계가 흔들립니다.",
      "recommendation": "A/B/C별 downstream unblock list를 추가하세요. 예: A PASS → packages/db/scopedDb, Drizzle schema convention, lint rule; B PASS → outbox base tables, worker service skeleton; C PASS → packages/storage, blobRef schema, upload/read APIs. FAIL/PASS-with-caveats별 Week 2 plan도 분기해야 합니다."
    },
    {
      "id": "SPIKE1-16",
      "severity": "minor",
      "category": "schedule-realism",
      "location": "종합 일정",
      "issue": "솔로 기준 6일 안에 pgbouncer+RLS+Drizzle, worker crash harness, minio/R2 signing, 결과 보고서까지 완료하는 계획은 과밀합니다.",
      "impact": "검증 코드보다 happy-path prototype 작성에 시간이 소모되어 negative invariant가 부실해질 가능성이 큽니다.",
      "recommendation": "Week 1 목표를 A와 B의 DB/control-plane closure에 우선 배정하고 C-provider smoke를 Week 2 Day 8 gate로 명시하세요. 또는 Spike D를 추가한다면 7일 계획을 10일 계획으로 조정하는 편이 현실적입니다."
    },
    {
      "id": "SPIKE1-17",
      "severity": "minor",
      "category": "metric-threshold",
      "location": "§A.3, §B.3",
      "issue": "latency/throughput 기준이 로컬 환경에 고정되어 있고 측정 방법이 없습니다.",
      "impact": "로컬 <5ms, <30초 기준은 CI/개발 장비/DB pool 설정에 따라 흔들리며 production capacity 판단 근거로 쓰기 어렵습니다.",
      "recommendation": "성능 기준은 blocking pass criteria에서 분리하고 p50/p95, run count, hardware/CI profile, baseline query 대비 overhead로 기록하세요. A의 핵심은 5ms가 아니라 isolation correctness입니다."
    },
    {
      "id": "SPIKE1-18",
      "severity": "minor",
      "category": "scope-clarity",
      "location": "§A.2 scenario 8",
      "issue": "A가 worker control/tenant plane 분리를 포함하고 B도 동일 주제를 다룹니다.",
      "impact": "A/B 경계가 흐려져 중복 구현하거나 어느 Spike에서 실패를 판정할지 불명확합니다.",
      "recommendation": "A는 scoped transaction/RLS/auth request boundary에 집중하고, B는 queue state machine/crash/idempotency에 집중하도록 scenario를 재배치하세요. A에는 B를 위한 최소 smoke만 남기면 됩니다."
    }
  ],
  "recommended_missing_spikes": [
    {
      "id": "SPIKE1-D",
      "title": "Drizzle Kit migration + Supabase dev/staging deploy",
      "priority": "P0",
      "why": "RLS/role/policy/custom SQL migration이 Phase 0 Week 4 schema의 선행조건입니다."
    },
    {
      "id": "SPIKE1-E",
      "title": "Auth.js session + resolveTenantContext + membership invalidation",
      "priority": "P0",
      "why": "tenant context의 입력 신뢰 경계가 RLS보다 앞단에 있습니다."
    },
    {
      "id": "SPIKE1-F",
      "title": "Secrets/env propagation smoke: Doppler or chosen secret manager → Vercel/Railway/Supabase/R2",
      "priority": "P1",
      "why": "secretRef, provider credentials, environment separation이 8 feature 공통 운영 리스크입니다."
    },
    {
      "id": "SPIKE1-G",
      "title": "Customer domain/Cloudflare for SaaS ADR smoke",
      "priority": "P1",
      "why": "Phase 1 ADR로 미룰 수는 있지만 adminBaseUrl, callback URL, tenant hostname resolution과 Auth.js redirect 정책에 영향을 줍니다."
    }
  ],
  "acceptance_conditions": [
    "A/B/C 각각에 provider-local 구분과 실제 provider smoke gate를 명시한다.",
    "Auth.js/resolveTenantContext와 Drizzle Kit migration 검증을 Week 1~2 gate로 추가한다.",
    "B의 exactly-once 표현을 idempotent at-least-once with exactly-once observable effects로 정정한다.",
    "negative invariant 검증을 반복 횟수, failure injection point, invariant SQL로 binary화한다.",
    "fallback마다 SoT cascade와 reversal blast radius를 기록한다.",
    "Spike 결과별 Week 2~6 dependency graph를 추가한다."
  ]
}
tokens used
76,764
{
  "schema_version": "review.v1",
  "review_target": "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md",
  "review_round": 1,
  "id_prefix": "SPIKE1-",
  "ready_for_acceptance": false,
  "summary": {
    "verdict": "현재 Spike A/B/C는 인프라 결정 v1.0의 핵심 리스크를 대체로 겨냥하지만, 실제 provider/Supabase/Vercel/Auth.js/Drizzle Kit 배포면을 Week 1 gate에서 제외해 false PASS 위험이 큽니다.",
    "blocking": 4,
    "major": 9,
    "minor": 5
  },
  "findings": [
    {
      "id": "SPIKE1-01",
      "severity": "blocking",
      "category": "hypothesis-priority",
      "location": "§0.2, §A, §C",
      "issue": "Week 1 gate가 로컬 docker-compose만으로 구성되어 Supabase Pooler, R2 IAM, Vercel serverless, Auth.js 실제 세션/쿠키 동작을 검증하지 않습니다.",
      "impact": "Spike PASS가 production viability를 보장하지 못합니다. 특히 A의 pgBouncer와 Supabase Pooler, C의 minio와 R2 IAM 차이는 핵심 가설 자체입니다.",
      "recommendation": "Week 1 또는 Week 2 초입 gate에 'provider smoke required before PASS'를 추가하세요. 최소 Supabase dev project + Pooler transaction mode, R2 staging bucket IAM/presigned URL, Vercel preview/Auth.js callback 1회는 실제 provider로 검증해야 합니다."
    },
    {
      "id": "SPIKE1-02",
      "severity": "blocking",
      "category": "missing-spike",
      "location": "§0.2, 종합 일정",
      "issue": "Drizzle Kit migration/deploy 가정이 Spike에서 빠져 있습니다.",
      "impact": "Phase 0 Week 4의 M0 vertical slice schema와 RLS policy/role/FK/index/partial index 배포가 막히면 A/B/C가 통과해도 본 구현 진입이 실패할 수 있습니다.",
      "recommendation": "Spike D를 추가하거나 A에 포함하세요: Drizzle Kit로 roles/RLS/policies/partial indexes/custom SQL migration 생성, dev→staging apply, rollback/forward-only hotfix, shadow DB 또는 drift check, service_role migration runner audit를 검증해야 합니다."
    },
    {
      "id": "SPIKE1-03",
      "severity": "blocking",
      "category": "auth-gap",
      "location": "Spike A title, §A.1~A.3",
      "issue": "Spike A 제목은 Auth.js tenant scoping을 포함하지만 실험은 Auth.js session, magic link, callback, session refresh, user deactivation, instanceMembership 변경 즉시 반영을 검증하지 않습니다.",
      "impact": "INFRA2-08의 resolveTenantContext가 실제 요청 경로에서 강제되는지 검증되지 않습니다. RLS가 안전해도 잘못된 requestedInstanceId가 RLS context로 들어가면 권한 모델이 무너집니다.",
      "recommendation": "A에 Auth.js request-level scenario를 추가하세요: 로그인→session 생성→requestedInstanceId 검증→withTenantTransaction 진입, membership 제거 후 다음 request 403, inactive user 차단, super-admin instance switch audit, client-supplied instanceId tampering 차단."
    },
    {
      "id": "SPIKE1-04",
      "severity": "blocking",
      "category": "storage-validation",
      "location": "§C.2 scenario 8, §C.4",
      "issue": "R2 IAM isolation을 핵심 가설로 두면서 minio 시뮬레이션만 수행하고 production R2 검증을 Week 2~3로 미룹니다.",
      "impact": "Spike C의 가장 위험한 부분은 S3 SDK 호환이 아니라 Cloudflare R2의 credential/IAM/policy semantics입니다. minio PASS는 IAM isolation PASS가 아닙니다.",
      "recommendation": "C의 PASS 조건을 둘로 나누세요: C-local은 prefix/signing logic, C-provider는 R2 staging IAM policy로 instance-a credential이 instance-b prefix GetObject/ListBucket/PutObject/CopyObject에 실패하는지 실제 검증. provider 검증 전에는 PASS가 아니라 PASS with unresolved provider risk로만 종료해야 합니다."
    },
    {
      "id": "SPIKE1-05",
      "severity": "major",
      "category": "pass-criteria",
      "location": "§A.3, §B.3",
      "issue": "'race condition 없음', 'SET LOCAL leak 없음', '정확히 1번 처리'가 binary처럼 쓰였지만 검증 방법과 반복 횟수, 관측 invariant가 없습니다.",
      "impact": "10 connections/100 jobs 1회 성공은 negative invariant 증명이 아닙니다. 낮은 확률의 pool leak, duplicate, lost update가 통과될 수 있습니다.",
      "recommendation": "반복 실행 기준을 명시하세요. 예: A는 1000 iterations × 20 concurrent requests, 매 query에서 pg_backend_pid/current_user/current_setting/result instance set 기록 후 cross-tenant row 0건. B는 1000 jobs × 10 workers × 20 runs, UNIQUE(sourceEventId), processed ledger, invariant query duplicate=0/missing=0/foreign_instance=0."
    },
    {
      "id": "SPIKE1-06",
      "severity": "major",
      "category": "spike-a-scenario-gap",
      "location": "§A.2",
      "issue": "A가 SELECT 중심입니다. INSERT/UPDATE/DELETE의 WITH CHECK, invalid instanceId, nested transaction/savepoint, rollback 후 SET LOCAL 해제, transaction 재사용 실패 케이스가 없습니다.",
      "impact": "읽기 격리는 통과해도 쓰기 경로에서 cross-tenant insert/update가 가능하거나 rollback 후 context가 새 transaction에 남는 결함을 놓칠 수 있습니다.",
      "recommendation": "A에 negative writes를 추가하세요: instance-a tx에서 instance-b row insert/update/delete 시도 실패, malformed UUID 실패 방식 확인, rollback 후 direct query 0건, nested tx/savepoint에서 setting 유지, tx 밖 scopedDb 사용 runtime guard throw."
    },
    {
      "id": "SPIKE1-07",
      "severity": "major",
      "category": "spike-a-production-gap",
      "location": "§A.2 scenario 7, §A.3",
      "issue": "service_role break-glass audit를 pass criteria에 넣었지만 prototype skeleton에는 audit_log table/RLS/read policy/append-only 검증이 없습니다.",
      "impact": "INFRA2-02와 INFRA3-02의 핵심인 service_role 사용 추적과 audit read isolation이 검증되지 않습니다.",
      "recommendation": "A에 audit_log 최소 schema를 포함하고 service-role-invoked insert 1건, tenant read view에서 자기 instance만 조회, 다른 instance audit metadata 미노출, append-only update/delete 실패를 검증하세요."
    },
    {
      "id": "SPIKE1-08",
      "severity": "major",
      "category": "spike-b-correctness",
      "location": "§B.1~B.3",
      "issue": "B가 'exactly-once 처리'를 가설로 둡니다. 2 transaction 분리 구조에서는 crash 위치에 따라 exactly-once는 일반적으로 보장 불가이며 idempotent at-least-once + reconcile가 현실적인 목표입니다.",
      "impact": "잘못된 성공 기준이 설계를 왜곡합니다. 특히 tenant transaction commit 후 outbox completed mark 전에 worker가 죽으면 결과는 이미 반영됐지만 outbox는 재처리됩니다.",
      "recommendation": "가설을 'idempotent at-least-once with exactly-once observable effects'로 바꾸고, tenant 결과 table에 deterministic idempotency key UNIQUE(instanceId, sourceEventId)를 두세요. crash-after-tenant-commit-before-control-complete 시 재처리가 no-op인지 검증해야 합니다."
    },
    {
      "id": "SPIKE1-09",
      "severity": "major",
      "category": "spike-b-scenario-gap",
      "location": "§B.2",
      "issue": "worker crash 시나리오가 claim 후 process 전 SIGKILL 하나뿐입니다.",
      "impact": "실제 위험 위치인 process 중간, tenant commit 직후, retry row insert 후, permanent fail alert 전/후, control transaction rollback 후를 놓칩니다.",
      "recommendation": "failure injection points를 명시하세요: claim 전/후, tenant insert 전/후, tenant commit 후 completed mark 전, retry schedule 전/후, maxAttempts sink alert 전/후. 각 지점별 expected state와 reconcile invariant를 표로 추가하세요."
    },
    {
      "id": "SPIKE1-10",
      "severity": "major",
      "category": "spike-b-production-gap",
      "location": "§B.3",
      "issue": "provider 호출 같은 외부 side effect가 실험에 없습니다.",
      "impact": "notifications, search visibility, CRM sync 등은 DB row insert만이 아니라 email/API/webhook 호출을 포함합니다. DB idempotency만으로 외부 중복 발송을 막는지 검증되지 않습니다.",
      "recommendation": "B에 fake provider를 추가해 idempotency key별 external call count를 기록하세요. worker crash/retry 후 동일 sourceEventId의 external call이 1회인지, retryable 5xx와 permanent 4xx 전이가 분리되는지 검증해야 합니다."
    },
    {
      "id": "SPIKE1-11",
      "severity": "major",
      "category": "spike-c-pass-criteria",
      "location": "§C.2 scenario 6, §C.3",
      "issue": "TTL 만료 후 '401'을 기대합니다. S3/R2 presigned URL 만료/서명 실패는 보통 403 계열일 수 있어 pass criteria가 provider semantics와 맞지 않을 가능성이 큽니다.",
      "impact": "정상 provider 동작을 실패로 판정하거나, minio 동작에 맞춘 잘못된 클라이언트 에러 처리를 구현할 수 있습니다.",
      "recommendation": "상태코드 기준을 provider별 실제 응답으로 정정하세요. 핵심 invariant는 '만료 후 object body 미반환 + fresh URL 재발급 전 접근 불가'입니다. R2 staging에서 만료 응답 code/body를 기록해 client handling contract로 고정하세요."
    },
    {
      "id": "SPIKE1-12",
      "severity": "major",
      "category": "spike-c-security-gap",
      "location": "§C.2~C.3",
      "issue": "signature replay, method confusion, content-type/size enforcement 위치, ListBucket 차단, range request, URL 로그 노출/Referer 유출 시나리오가 없습니다.",
      "impact": "signed URL이 발급 경로에서는 안전해도 재사용, 잘못된 HTTP method, metadata 조작, bucket listing을 통해 tenant boundary가 약해질 수 있습니다.",
      "recommendation": "C에 다음 negative tests를 추가하세요: GET URL로 PUT/DELETE 실패, PUT presign의 content-type/content-length 조건 불일치 실패, ListBucket prefix 외 접근 실패, expired URL replay 실패, range request 허용 여부 결정, issued URL audit에는 full query signature 저장 금지."
    },
    {
      "id": "SPIKE1-13",
      "severity": "major",
      "category": "sot-drift",
      "location": "§C.2 scenario 10",
      "issue": "`storage-url-issued` AuditAction을 사용하지만 REVIEW_WORKFLOW의 AuditAction enum에는 해당 값이 없습니다.",
      "impact": "Spike가 새 audit action을 암묵적으로 도입해 SoT cascade 없이 구현 drift가 발생합니다.",
      "recommendation": "Spike 계획에서 먼저 audit action cascade를 요구하세요. 또는 기존 `service-role-invoked`/feature-specific audit action으로 매핑할지 결정해야 합니다."
    },
    {
      "id": "SPIKE1-14",
      "severity": "major",
      "category": "reversal-cost",
      "location": "§A.4, §C.4",
      "issue": "실패 시 대안이 기술 후보만 나열하고 SoT cascade/reversal 비용을 평가하지 않습니다.",
      "impact": "A 실패는 INFRA2-01, DATA_MODEL의 instanceMembership access path, 모든 feature table RLS/FK 설계, worker 패턴, lint/runtime guard를 재작성하는 결정입니다. C 실패도 3개 feature blob storage 계약과 import/export manifest에 영향을 줍니다.",
      "recommendation": "각 fallback에 reversal blast radius를 추가하세요: affected docs, affected packages, schedule delta, data migration impact, feature specs to amend, decision owner. A 실패는 최소 Phase 0 scope 재산정 gate로 격상해야 합니다."
    },
    {
      "id": "SPIKE1-15",
      "severity": "major",
      "category": "dependency-planning",
      "location": "Spike 종료 후 의사결정, 종합 일정",
      "issue": "Week 2~6 작업이 Spike 결과에 어떻게 의존하는지 dependency graph가 없습니다.",
      "impact": "A가 지연되면 Week 4 schema와 Week 6 e2e가 막히고, B가 지연되면 notifications/search/worker skeleton이 막히며, C가 지연되면 asset-ingestion/content-migration/search artifact 설계가 흔들립니다.",
      "recommendation": "A/B/C별 downstream unblock list를 추가하세요. 예: A PASS → packages/db/scopedDb, Drizzle schema convention, lint rule; B PASS → outbox base tables, worker service skeleton; C PASS → packages/storage, blobRef schema, upload/read APIs. FAIL/PASS-with-caveats별 Week 2 plan도 분기해야 합니다."
    },
    {
      "id": "SPIKE1-16",
      "severity": "minor",
      "category": "schedule-realism",
      "location": "종합 일정",
      "issue": "솔로 기준 6일 안에 pgbouncer+RLS+Drizzle, worker crash harness, minio/R2 signing, 결과 보고서까지 완료하는 계획은 과밀합니다.",
      "impact": "검증 코드보다 happy-path prototype 작성에 시간이 소모되어 negative invariant가 부실해질 가능성이 큽니다.",
      "recommendation": "Week 1 목표를 A와 B의 DB/control-plane closure에 우선 배정하고 C-provider smoke를 Week 2 Day 8 gate로 명시하세요. 또는 Spike D를 추가한다면 7일 계획을 10일 계획으로 조정하는 편이 현실적입니다."
    },
    {
      "id": "SPIKE1-17",
      "severity": "minor",
      "category": "metric-threshold",
      "location": "§A.3, §B.3",
      "issue": "latency/throughput 기준이 로컬 환경에 고정되어 있고 측정 방법이 없습니다.",
      "impact": "로컬 <5ms, <30초 기준은 CI/개발 장비/DB pool 설정에 따라 흔들리며 production capacity 판단 근거로 쓰기 어렵습니다.",
      "recommendation": "성능 기준은 blocking pass criteria에서 분리하고 p50/p95, run count, hardware/CI profile, baseline query 대비 overhead로 기록하세요. A의 핵심은 5ms가 아니라 isolation correctness입니다."
    },
    {
      "id": "SPIKE1-18",
      "severity": "minor",
      "category": "scope-clarity",
      "location": "§A.2 scenario 8",
      "issue": "A가 worker control/tenant plane 분리를 포함하고 B도 동일 주제를 다룹니다.",
      "impact": "A/B 경계가 흐려져 중복 구현하거나 어느 Spike에서 실패를 판정할지 불명확합니다.",
      "recommendation": "A는 scoped transaction/RLS/auth request boundary에 집중하고, B는 queue state machine/crash/idempotency에 집중하도록 scenario를 재배치하세요. A에는 B를 위한 최소 smoke만 남기면 됩니다."
    }
  ],
  "recommended_missing_spikes": [
    {
      "id": "SPIKE1-D",
      "title": "Drizzle Kit migration + Supabase dev/staging deploy",
      "priority": "P0",
      "why": "RLS/role/policy/custom SQL migration이 Phase 0 Week 4 schema의 선행조건입니다."
    },
    {
      "id": "SPIKE1-E",
      "title": "Auth.js session + resolveTenantContext + membership invalidation",
      "priority": "P0",
      "why": "tenant context의 입력 신뢰 경계가 RLS보다 앞단에 있습니다."
    },
    {
      "id": "SPIKE1-F",
      "title": "Secrets/env propagation smoke: Doppler or chosen secret manager → Vercel/Railway/Supabase/R2",
      "priority": "P1",
      "why": "secretRef, provider credentials, environment separation이 8 feature 공통 운영 리스크입니다."
    },
    {
      "id": "SPIKE1-G",
      "title": "Customer domain/Cloudflare for SaaS ADR smoke",
      "priority": "P1",
      "why": "Phase 1 ADR로 미룰 수는 있지만 adminBaseUrl, callback URL, tenant hostname resolution과 Auth.js redirect 정책에 영향을 줍니다."
    }
  ],
  "acceptance_conditions": [
    "A/B/C 각각에 provider-local 구분과 실제 provider smoke gate를 명시한다.",
    "Auth.js/resolveTenantContext와 Drizzle Kit migration 검증을 Week 1~2 gate로 추가한다.",
    "B의 exactly-once 표현을 idempotent at-least-once with exactly-once observable effects로 정정한다.",
    "negative invariant 검증을 반복 횟수, failure injection point, invariant SQL로 binary화한다.",
    "fallback마다 SoT cascade와 reversal blast radius를 기록한다.",
    "Spike 결과별 Week 2~6 dependency graph를 추가한다."
  ]
}
