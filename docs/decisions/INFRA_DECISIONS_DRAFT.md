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

### 4.1 Phase 0 Spike Gate (INFRA2-09 → SPIKE2-01 cascade — 5 Spike/10일로 확장)

Week 1~2 Day 1~10에 5개 Spike (A·B·C·D·E)를 별도 gate로 진행. 상세 계획·시나리오·invariant 측정은 **`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md`** SoT.

| Spike | 목표 | 일정 | gate type |
|---|---|---|---|
| **A. Drizzle + RLS + tenant scoping** (DB only — auth는 E) | withTenantTransaction·SET LOCAL·pgBouncer transaction pooling·invariant 1000 iter | Day 1-2 local·Day 9 provider | local + provider |
| **B. worker control + tenant plane** | SKIP LOCKED·idempotent at-least-once with exactly-once observable·failure injection 8 point | Day 3-4 local | local only (외부 provider 의존 없음) |
| **C. R2 Storage signed URL + IAM isolation** | prefix·signing·replay/method confusion/ListBucket·TTL·refresh | Day 5 local (minio)·Day 8 provider (R2 staging) | local + provider |
| **D. Drizzle Kit migration deploy** | RLS·composite FK·partial unique·CHECK migration 생성·dev/staging apply·shadow drift check·expand/contract | Day 6 local | local only |
| **E. Auth.js + resolveTenantContext + membership** | magic link·session·instanceMembership 검증·tampering 차단·active=false 즉시 403 | Day 7 local·Day 10 provider (Vercel preview·SPIKE2-02) | local + provider |

Spike 통과 후 Week 3~6 본 작업 진행. Day 10 종합 보고서·v1.0 갱신·Week 3~6 분기.

### 4.2 Spike 결과별 Week 3~6 dependency (SPIKE2-05 partial state matrix)

각 Spike 상태 분류: `LOCAL_PASS`·`PROVIDER_PASS`·`PROVIDER_FAIL`·`INCONCLUSIVE`.

핵심 의존성:
- A `PROVIDER_PASS` → Week 3-4 schema migration·scopedDb·composite FK 적용 가능
- A `LOCAL_PASS but PROVIDER_PASS pending` → Week 3 schema는 진행 가능·Week 4 production-like 검증 대기
- B `LOCAL_PASS` → Week 4-5 outbox base·worker skeleton·notifications dispatch 진행
- C `PROVIDER_PASS` → Week 5+ packages/storage·blobRef·feature blob 적용
- C `PROVIDER_FAIL` → Storage ADR 재작성 (Supabase Storage reversal 검토)·Phase 1+ 영향
- D `LOCAL_PASS` → Week 4 M0 vertical slice migration 진행
- E `PROVIDER_PASS` → Week 6 admin UI middleware·login flow 착수
- E `LOCAL_PASS but PROVIDER_PASS pending` → admin UI middleware **hold** until provider gate

상세 partial state matrix는 SPIKES_DRAFT § dependency graph.

### 4.2 Phase 0 작업 (v0.2 § 3 + spike 추가)

| Week | 작업 | gate |
|---|---|---|
| **Week 1 (Spike)** | Spike A·B·C 진행 + repo skeleton + tsconfig + Biome + CI 기본 | Spike 통과 |
| Week 2 | Supabase dev/staging·Drizzle migration·next-auth·Sentry·Resend dev·Upstash | dev/staging vertical green |
| Week 3 | Railway worker·webhook-receiver·Cloudflare DNS·local docker-compose·INV fixture conventions | worker 동작 |
| Week 4 | M0 vertical slice schema (~15 tables — Page·Content·ComplianceRecord·AuditLog·**NotificationEventReceipt**·NotificationLog 등 — NotificationEvent는 notify() 입력 envelope·DB table 아님·§ 4.4 참조) | schema migration green |
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
