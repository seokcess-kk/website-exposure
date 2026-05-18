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
session id: 019e29a9-5de9-7242-b05b-2b00535c001f
--------
user
# 자동 비평 의뢰 — `apps/spike-a/` prototype 코드 (1차)

## 컨텍스트

Phase 0 Spike A prototype 코드 1차 작성 완료. Spike 계획 v1.0 (`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § A) 따라 구현:
- docker-compose (postgres 16 + pgbouncer transaction pooling mode·port 6433)
- migration 4개 (roles·content_test·audit_log·invariant_log)
- TS 코어 (db.ts·tenant.ts·service-role.ts·schema.ts·migrate.ts·seed.ts)
- 시나리오 6개 (read·write·rollback·nested-tx·audit·invariant-runner)
- README + wait-db 스크립트

핵심 가설 (Spike 계획 § A.1):
- `withTenantTransaction(instanceId, fn)` 안에서 SET LOCAL이 RLS context 전달
- Drizzle ORM이 transaction 안에서 SELECT/INSERT/UPDATE/DELETE 모두 tenant 격리
- rollback 후 context 누설 없음
- pgbouncer transaction pooling에서 SET LOCAL 안전 (session leak 없음)
- service-role break-glass는 audit log 필수
- audit_log는 read-RLS + append-only (GRANT level UPDATE/DELETE 미부여)

통과 기준 (Spike 계획 § A.3):
- 1000 iter × 20 concurrent SELECT — foreign_instance_count 0건
- INSERT/UPDATE/DELETE WITH CHECK — cross-instance write 0건
- rollback 후 transaction 밖 query 0건 (RLS reject)
- nested tx·savepoint — context 유지
- audit_log RLS 읽기 격리 + append-only

## 의뢰

prototype 코드를 이전 spec/결정 비평과 동일한 강도로 비평하라. 특히:

1. **SQL migration 정확성**:
   - 001_roles.sql: app_tenant_user NOBYPASSRLS·GRANT default·LOGIN — 누락된 권한?
   - 002_content_test.sql: RLS + FORCE ROW LEVEL SECURITY·USING + WITH CHECK·current_setting('app.current_instance_id', true)::uuid — null·malformed UUID 처리?
   - 003_audit_log.sql: SELECT policy + INSERT policy·UPDATE/DELETE policy 없음 — RLS는 정책 없으면 deny이므로 GRANT 미부여 + RLS 둘 다 안전망? 한쪽이 빠지면 어떤 위험?
   - 004_invariant_log.sql: super-user 전용 — app_tenant_user GRANT 미부여로 충분?

2. **TS 코어 정확성**:
   - `tenant.ts` withTenantTransaction: SET LOCAL ROLE 없이 connection level role(app_tenant_user)이 충분? dbTenant 가 service_role connection을 재사용한다면? prepare: false 정합성
   - `db.ts` postgres-js + pgbouncer transaction pooling — `prepare: false` 필수. 다른 option (idle_timeout·max·debug) 누락?
   - `service-role.ts` withServiceRole: audit insert가 service-role 사용 *전*에 — 사용 *후* audit이 더 안전한가? loop 안 instance마다 insert는 N+1?
   - migrate.ts: 단순 file sort — version conflict·rollback·transaction wrapping?

3. **시나리오 측정 정확성**:
   - test-write.ts: `RETURNING id` 결과 count로 INSERT 성공 판단 — postgres-js drizzle execute가 array로 반환? 검증 방식 정확?
   - test-rollback.ts: `dbTenant.execute(...)` transaction 밖 → drizzle implicit transaction? prepared statement·pooling 영향
   - test-invariant-runner.ts: 1000 iter × 20 concurrent = 20,000 query. Promise.all로 진짜 동시? pgbouncer pool size 20 — 부족하지 않은가? batch insert N+1
   - test-audit.ts: GRANT denied error message가 'permission denied' 또는 'insufficient privilege' — 둘 다 매칭 정확?

4. **누락된 시나리오**:
   - schema-per-tenant 호환성 (Spike A의 fallback)
   - SQL injection 시도 (raw input)
   - service-role 격리 (env mistake·prod에서 client context 호출)
   - lint·runtime guard 검증 (scopedDb tx 밖 사용)
   - malformed instanceId (UUID 검증)
   - 성능 측정 (withTenantTransaction overhead p50·p95)

5. **production gap (provider smoke gate Day 9 대비)**:
   - Supabase Pooler와 pgbouncer 동작 차이
   - Supabase RLS policy는 동일 방식?
   - Supabase auth.uid()와 본 prototype set_config 차이

6. **코드 품질**:
   - TypeScript strict + exactOptionalPropertyTypes — 호환성
   - error handling — `(e as Error).message` 패턴 안전?
   - resource cleanup — closeAll에서 transaction 미완료 시 hang
   - 모든 async/await catch
   - logging — console.log만으로 충분? structured?

7. **README·실행 가능성**:
   - 실행 순서 정확? pnpm script 빠진 단계
   - .env.example로 충분? secret 안전

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEA1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (대상 prototype 전체)
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (Spike 계획 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (인프라 결정 v1.0)
codex
`seo-geo` skill은 이번 요청이 검색 최적화가 아니라 코드 비평이라 적용하지 않습니다. 먼저 Spike 계획과 prototype 파일 구조를 읽고, 실제 SQL/TS 구현 기준으로 findings를 만들겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Recurse -File apps/spike-a | Select-Object -ExpandProperty FullName' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/INFRA_DECISIONS_DRAFT.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md' in C:\Users\assag\solution\website-exposure
 succeeded in 850ms:
C:\Users\assag\solution\website-exposure\apps\spike-a\.env.example
C:\Users\assag\solution\website-exposure\apps\spike-a\docker-compose.yml
C:\Users\assag\solution\website-exposure\apps\spike-a\package.json
C:\Users\assag\solution\website-exposure\apps\spike-a\README.md
C:\Users\assag\solution\website-exposure\apps\spike-a\tsconfig.json
C:\Users\assag\solution\website-exposure\apps\spike-a\migrations\001_roles.sql
C:\Users\assag\solution\website-exposure\apps\spike-a\migrations\002_content_test.sql
C:\Users\assag\solution\website-exposure\apps\spike-a\migrations\003_audit_log.sql
C:\Users\assag\solution\website-exposure\apps\spike-a\migrations\004_invariant_log.sql
C:\Users\assag\solution\website-exposure\apps\spike-a\scripts\wait-db.js
C:\Users\assag\solution\website-exposure\apps\spike-a\src\db.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\migrate.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\schema.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\seed.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\service-role.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\tenant.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-audit.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-invariant-runner.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-nested-tx.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-read.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-rollback.ts
C:\Users\assag\solution\website-exposure\apps\spike-a\src\scenarios\test-write.ts

 succeeded in 867ms:
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

 succeeded in 890ms:
# Phase 0 Week 1~2 Spike 계획 — 5개 가설 검증 **(v1.0 acceptance)**

> **상태**: **v1.0** — codex 자동 비평 3차 사이클 후 `ready_for_acceptance=true` 확정. blocking 0·major 1·minor 1 (SPIKE3-01 정정 완료. INFRA cleanup minor는 후속)

> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 결정**: 8 Feature spec v1.0·인프라 결정 v1.0
> **목적**: Phase 0 Week 1~2 안에 가장 위험한 기술 가정 5개 (A·B·C·D·E) 검증. provider smoke gate 포함. 통과 시 본 구현 진입·실패 시 Phase 0 scope 재조정
> **핵심 변경 (v0.2)**: 5 Spike 확장 (D·E 추가)·provider smoke gate·exactly-once → idempotent at-least-once with exactly-once observable effects·dependency graph·invariant 반복 검증·signed-url-issued AuditAction cascade

---

## Spike 공통 규약

### 0.1 prototype 범위·일정 (SPIKE1-16 — 10일로 확장)

| 일자 | Spike | 비고 |
|---|---|---|
| Day 1 (Mon) | A — DB·RLS 검증 | C-local 병행 가능 |
| Day 2 (Tue) | A — 쓰기 path·rollback·audit | |
| Day 3 (Wed) | B — outbox·worker control plane | A pass 후 진행 |
| Day 4 (Thu) | B — failure injection·idempotent at-least-once | |
| Day 5 (Fri) | C-local — minio·signing logic·prefix isolation | |
| Day 6 (Sat) | D — Drizzle Kit migration·deploy·shadow DB | |
| Day 7 (Sun) | E — Auth.js·resolveTenantContext·membership | |
| Day 8 (Mon Week 2) | C-provider — R2 staging IAM·credential·real presigned URL | provider smoke gate |
| Day 9 (Tue Week 2) | A-provider — Supabase Pooler transaction mode + RLS smoke | provider smoke gate |
| Day 10 (Wed Week 2) | **E-provider** — Vercel preview·Auth.js magic link callback·session persistence·tampering·403 matrix (SPIKE2-02) + 종합 보고서·v1.0 결정 갱신·Week 3~6 계획 분기 | provider smoke gate + dependency graph |

Buffer: Week 2 Day 11~14는 본 작업 (Phase 0 § 4.2 v0.3 일정).

### 0.2 통과·실패·invariant 측정 (SPIKE1-05 정정)

각 Spike는 다음 명시:
- **가설 (hypothesis)**·**실험 (experiment)**·**pass criteria**·**negative invariant 측정 방법**·**provider smoke 분리**·**실패 시 fallback + reversal blast radius**·**downstream unblock**

negative invariant 측정 표준 (SPIKE1-05):
- 1000 iterations × 20 concurrent requests (또는 동등 부하)
- 각 query에서 `pg_backend_pid`·`current_user`·`current_setting('app.current_instance_id')`·`result instance_id set` 기록
- invariant SQL: `SELECT COUNT(*) FROM result_log WHERE foreign_instance > 0` → 0건 (binary 검증)
- 성능은 별도 측정 (correctness pass와 분리 — SPIKE1-17)

### 0.3 provider smoke gate (SPIKE1-01·04 — 핵심 정정)

각 Spike는 **local + provider 2단계**:
- **local PASS**: docker-compose 환경에서 통과 (Day 1~7)
- **provider PASS**: 실제 provider (Supabase dev·R2 staging·Vercel preview·Auth.js production-like)에서 smoke 통과 (Day 8~9)

provider smoke 통과 전에는 **PASS with unresolved provider risk** 까지만 인정. v1.0 acceptance는 provider smoke 후.

### 0.4 신규 AuditAction cascade (SPIKE1-13·SPIKE2-04)

REVIEW_WORKFLOW § 10.2.1 cascade 완료:
- `signed-url-issued` — R2 signed URL 발급 추적
- `signed-url-revocation-requested` (SPIKE2-04 정정 — rename from `signed-url-revoked`) — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer URL). 운영자 revoke 요청 → 후속 credential rotation 또는 object key rotation으로 처리

### 0.5 DATA_MODEL C-23 cascade (SPIKE2-03)

`AdminUser.instanceMemberships`에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가 (v0.24). resolveTenantContext가 매 요청 검증.

---

## Spike A: Drizzle + RLS + tenant scoping (DB-only, Auth.js는 Spike E)

### A.1 가설 (SPIKE1-18 scope 정리)

> `withTenantTransaction(instanceId, fn)` 안에서 SET LOCAL이 RLS context를 전달하고, Drizzle ORM이 transaction 안에서 SELECT/INSERT/UPDATE/DELETE 모두 tenant 격리. rollback 후 context 누설 없음. service_role break-glass 사용은 `service-role-invoked` audit. audit_log는 read-RLS·append-only.

(Auth.js·resolveTenantContext는 Spike E로 분리 — SPIKE1-03·18)

### A.2 실험 시나리오 (SPIKE1-06·07 — 쓰기·audit 추가)

```
apps/spike-a/
├── docker-compose.yml
├── migrations/
│   ├── 001_roles.sql
│   ├── 002_content_test.sql        # RLS + WITH CHECK
│   ├── 003_audit_log.sql            # append-only · read RLS
│   ├── 004_test_invariant.sql       # invariant 검증용 view
├── src/
│   ├── db.ts
│   ├── tenant.ts                    # withTenantTransaction
│   ├── service-role.ts              # assertBreakGlassAllowed + audit
│   ├── test-read.ts                 # SELECT 격리
│   ├── test-write.ts                # INSERT/UPDATE/DELETE WITH CHECK
│   ├── test-rollback.ts             # rollback 후 context 검증
│   ├── test-nested-tx.ts            # nested tx·savepoint
│   ├── test-audit.ts                # service_role + audit read RLS
│   └── test-invariant-runner.ts     # 1000 iterations × 20 concurrent
```

시나리오:
1. 2 instance seed (각 5건)·SELECT 격리 검증
2. **INSERT WITH CHECK**: instance-a tx에서 `instance_id='instance-b'` insert → reject (1000회 반복)
3. **UPDATE WITH CHECK**: instance-a tx에서 instance-b row update 시도 → 0 rows affected (1000회 반복)
4. **DELETE WITH CHECK**: instance-a tx에서 instance-b row delete 시도 → 0 rows affected
5. **malformed UUID** for `app.current_instance_id` → query fail (예외 처리 검증)
6. **rollback 후 context 누설**: tx rollback 후 SET LOCAL 자동 해제 검증 → 새 tx 진입 전 direct query 0건
7. **nested transaction·savepoint**: savepoint 안에서 context 유지·rollback to savepoint 후 context 유지
8. **scopedDb runtime guard**: tx 밖 scopedDb 사용 시 throw (runtime guard)
9. **audit_log RLS**: instance-a tx에서 audit_log 조회 → 자신의 instance 행만·다른 instance metadata 미노출
10. **append-only**: audit_log UPDATE/DELETE 시도 → fail (CHECK 또는 RLS WITH CHECK)
11. **service_role break-glass**: 모든 row 보임 + `service-role-invoked` audit insert 1건
12. **invariant runner**: 1000 iterations × 20 concurrent — `SELECT COUNT(*) FROM result_log WHERE foreign_instance > 0` = 0건

### A.3 통과 기준 (SPIKE1-05·17 — invariant + 성능 분리)

| 검증 | 기준 (correctness) |
|---|---|
| SELECT 격리 | 1000 iter × 20 concurrent — foreign_instance row 0건 |
| INSERT/UPDATE/DELETE WITH CHECK | 1000 iter — cross-instance write 0건 성공 |
| rollback 후 context 누설 | 0건 |
| nested tx·savepoint | context 유지 |
| audit_log read 격리 | foreign instance metadata 미노출 0건 |
| audit_log append-only | UPDATE/DELETE 모두 fail |
| service_role audit | 사용 횟수 = audit insert 횟수 (1:1) |

| 성능 (분리·SPIKE1-17) | baseline |
|---|---|
| withTenantTransaction overhead | p50·p95 측정. baseline query 대비 overhead % 기록 |

### A.4 실패 시 대안 + reversal blast radius (SPIKE1-14)

| 실패 항목 | fallback | affected SoT docs | affected packages | data migration impact | schedule delta | owner |
|---|---|---|---|---|---|---|
| pgBouncer SET LOCAL leak | Supabase Pooler 사용·direct connection·connection-scoped role | INFRA v1.0 §1.1 RLS 실행 모델 | `packages/db` connection layer | 없음 | +3~5일 | solo |
| Drizzle SET LOCAL 비호환 | Kysely 또는 raw SQL adapter | INFRA v1.0 §2 stack | `packages/db` 전체 | schema dialect 검토 | +1주 | solo |
| RLS overhead p95 > 50ms | application-level scoping 주력·RLS 보조만 | INFRA v1.0 §1 전체 reversal·INFRA2-01 1차 결정으로 | `packages/db`·`scopedDb` lint·all feature repository | RLS migration 제거 | +2주 (Phase 0 재산정) | solo |
| service_role 격리 안 됨 | env 분리·connection string 분리 | INFRA v1.0 §1.2 service_role 정책 | runtime guard | 없음 | +2일 | solo |

### A.5 downstream unblock (SPIKE1-15)

- A PASS → `packages/db/scopedDb`·`withTenantTransaction`·Drizzle convention·lint rule·composite FK 적용
- A FAIL → Phase 0 scope 재산정 gate (Week 2 Day 10에 의사결정)

---

## Spike B: Worker control-plane + tenant-plane (SPIKE1-08·09·10)

### B.1 가설 (SPIKE1-08 정정)

> worker가 control-plane connection으로 outbox SKIP LOCKED claim 후 instance_id 추출 → tenant transaction으로 처리. **idempotent at-least-once with exactly-once observable effects** — DB row insert 외부 side effect(이메일·API·webhook)도 `UNIQUE(instanceId, sourceEventId)` idempotency key로 중복 차단. crash 시 reconcile로 결과 일관성 유지.

(exactly-once 가설 폐기 — SPIKE1-08)

### B.2 실험 시나리오 (SPIKE1-09·10 — failure injection·외부 call)

```
apps/spike-b/
├── migrations/
│   ├── 005_outbox.sql               # RLS 미적용 control-plane
│   ├── 006_inbox.sql                # RLS 적용 tenant-plane
│   ├── 007_external_call_log.sql    # fake provider call count
├── src/
│   ├── fake-provider.ts             # idempotency key 별 call count 기록
│   ├── claim.ts·process.ts·worker.ts
│   ├── failure-injection.ts         # 8 failure point
│   └── test-invariants.ts           # 1000 jobs × 10 workers × 20 runs
```

시나리오:
1. 100 outbox seed (50 instance-a·50 instance-b)
2. 5 worker 동시 처리·foreign instance write 0건
3. **idempotency**: 동일 sourceEventId 2회 enqueue → external call 1회·inbox row 1개
4. **failure injection 8 point**: claim 전/후·tenant insert 전/후·tenant commit 후 completed mark 전·retry schedule 전/후·permanent fail alert 전/후 — 각 지점 SIGKILL 시뮬레이션
5. 각 failure point의 expected state·reconcile invariant 측정
6. **외부 call count invariant**: fake-provider.callCount(sourceEventId) = 1 (1000 jobs × 10 workers × 20 runs)
7. retry backoff·exhausted·permanent 전이
8. stale lock reclaim (locked_at > 5분 → 다른 worker claim)
9. tenant transaction commit 후 control completed mark 전 crash → 재처리가 idempotent (inbox UNIQUE로 차단)

### B.3 통과 기준

| 검증 | 기준 |
|---|---|
| 100건 처리 (대량 100건) | duplicate inbox 0건·외부 call duplicate 0건·foreign instance 0건 |
| 1000 jobs × 10 workers × 20 runs invariant | foreign_instance=0·duplicate=0·missing=0 |
| failure injection 8 point | 모든 지점에서 reconcile invariant 통과 |
| 외부 call count | 각 sourceEventId에 대해 callCount = 1 (재처리 시도 발생해도 idempotency key로 차단) |
| stale lock reclaim | 5초 (테스트 단축) 후 재claim |
| permanent 전이 | maxAttempts 도달 시 정확히 1회 sink alert |

### B.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| SKIP LOCKED race | advisory lock per instance | worker SoT SQL 일부 재작성 |
| 2 transaction crash | reconcile worker (spec에 이미 명시) | feature spec 검증 |
| idempotency key 충돌 | sourceEventId 산정 규칙 재정의 | hash 패턴 cascade |
| 외부 call duplicate | provider별 idempotency-key header 강제 | 8 feature 외부 호출 패턴 재검토 |

### B.5 downstream unblock

- B PASS → outbox/retry base tables·worker service skeleton·notifications dispatch base·idempotency convention
- B FAIL → worker 패턴 재설계·notifications P0 subset 재정의

---

## Spike C: Cloudflare R2 — local + provider 분리 (SPIKE1-04·11·12)

### C.1 가설

> R2 (S3 호환) object key prefix isolation·server-only signed URL issuer·IAM PolicyDocument로 instance 격리. signed URL replay·method confusion·ListBucket·range request 우회 차단. TTL·refresh 정상 동작.

### C.2-local: minio signing logic 검증 (Day 5)

```
apps/spike-c-local/
├── docker-compose.yml              # minio
└── src/sign-url.ts·test-isolation.ts·test-replay.ts·test-method-confusion.ts
```

시나리오:
1. 2 instance × 5 object upload
2. instance-a로 instance-b prefix sign 시도 → tenant-check fail
3. **signature replay**: 동일 signed URL 1000회 재사용 — provider semantics 기록 (R2에서 별도 검증)
4. **method confusion**: GET signed URL로 PUT/DELETE 시도 → fail
5. **content-type/length 불일치**: PUT presign 시 content-type 강제 — 불일치 PUT 시도 → fail
6. **ListBucket prefix 차단**: instance-a credential로 instance-b prefix list → fail
7. **range request**: 허용 여부 결정 (decision: 허용 — large object streaming)
8. **URL log scrubbing**: audit log에 signed URL signature 저장 금지·prefix·objectKey만 저장

### C.3-local 통과 기준

| 검증 | 기준 (correctness) |
|---|---|
| prefix isolation | cross-instance 접근 시도 100% block |
| method confusion | 100% block |
| content-type 불일치 | 100% block |
| ListBucket | 100% block |
| URL audit log | signature 미저장 — log scrubber 검증 |

### C.4-provider: R2 staging IAM·real presigned (Day 8 — provider smoke gate)

| 검증 | 기준 |
|---|---|
| R2 IAM Condition | instance-a credential로 instance-b GetObject/ListBucket/PutObject/CopyObject 100% fail |
| 만료 status code | provider 실제 응답 code 기록 (401/403 — SPIKE1-11 정정) |
| auto refresh | 만료 60초 전 fresh URL 발급 동작 |
| cross-instance copy (import) | service_role만 가능 + `signed-url-issued` audit |

### C.5 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| R2 signed URL 동작 안 함 | Cloudflare Workers + R2 binding | INFRA3-03 Storage ADR 변경·일부 reversal |
| R2 IAM 미흡 | Supabase Storage로 reversal | INFRA3-03 reversal·3 feature blob storage 계약 재작성 |
| minio와 R2 동작 차이 큼 | C-provider만 권위·minio는 logic만 | C-local PASS 가치 약화·provider smoke 통과 필수 |

### C.6 downstream unblock

- C-local PASS → signing logic·tenant-check
- C-provider PASS → `packages/storage`·blobRef schema·upload/read API·asset-ingestion·search-visibility·content-migration storage 적용
- C FAIL → Storage ADR 재작성·Phase 1+ 영향

---

## Spike D: Drizzle Kit migration deploy (SPIKE1-02 신규 — P0)

### D.1 가설

> Drizzle Kit으로 RLS policy·custom role·partial unique index·CHECK constraint·composite FK·custom SQL migration 모두 생성·deploy 가능. dev→staging apply·rollback·shadow DB drift check·service_role migration runner audit 작동.

### D.2 실험 시나리오

```
apps/spike-d/
├── drizzle.config.ts
├── migrations/
│   ├── (Spike A에서 생성된 RLS·CHECK·partial unique 포함 — Drizzle Kit으로 재생성)
│   ├── 008_partial_unique.sql       # WHERE active=true unique
│   ├── 009_composite_fk.sql         # (instance_id, parent_id) FK
│   ├── 010_check_constraint.sql     # CHECK regex·enum
│   ├── 011_custom_sql_view.sql      # tenant-scoped view (audit_log read RLS)
├── src/
│   ├── migrate.ts                   # service_role + audit + advisory lock
│   ├── drift-check.ts               # shadow DB 비교
│   └── rollback.ts                  # forward-only hotfix 시나리오
```

시나리오:
1. Drizzle Kit으로 모든 spec table 패턴 (RLS·composite FK·partial unique·CHECK) migration 생성
2. dev DB apply → 성공
3. staging DB apply → 성공
4. **drift check**: production schema와 다르면 deploy fail (shadow DB 비교)
5. **advisory lock**: 동시 migration 시도 시 1개만 진행
6. **forward-only hotfix**: rollback 불가 migration (column drop) 발생 시 별도 ADR + super-admin 명시 승인
7. **migration audit**: `service-role-invoked` event with `serviceRoleFunction='migrationRunner'`
8. **expand/contract pattern**: column 추가 nullable → backfill → NOT NULL/drop old 3단계 시나리오

### D.2-artifact (SPIKE2-07)

Day 6 종료 시 반드시 남길 산출물:
- 생성된 SQL migration 파일들 (`migrations/008-011_*.sql`)
- dev·staging apply 성공 log
- drift failure sample (의도적 schema drift 후 detect 검증)
- expand/contract 3단계 예시 migration

### D.3 통과 기준

| 검증 | 기준 |
|---|---|
| RLS·CHECK·partial unique·composite FK migration 생성 | Drizzle Kit canonical 또는 raw SQL escape hatch 사용 |
| dev/staging apply | 100% 성공 |
| drift check | production과 다른 schema 100% detect |
| advisory lock | 동시 migration 시 1개만 진행 |
| migration audit | 모든 migration `service-role-invoked` insert 1건 |
| expand/contract 3단계 | 운영 무중단 (web/worker 다른 deploy timing) |

### D.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| Drizzle Kit RLS policy 생성 불가 | raw SQL migration mixin | migration tooling 약간 복잡·관리 비용 |
| advisory lock 미동작 | external lock (Redis SETNX) | migration runner 재설계 |
| shadow DB 비용 큼 | linting-based drift check만 | drift detection 약화 |

### D.5 downstream unblock

- D PASS → Week 3~4 M0 vertical slice schema migration 진행
- D FAIL → migration tooling 재선택 (Atlas·db-mate·dbmate 등)·Phase 0 scope 재정의

---

## Spike E: Auth.js + resolveTenantContext + membership (SPIKE1-03 신규 — P0)

### E.1 가설

> Auth.js (next-auth) magic link로 로그인·session 생성·next request에서 `resolveTenantContext(session, requestedInstanceId)` 호출 → instanceMembership·active·role·legal eligibility 검증 → `app.current_instance_id` set. client-supplied `requestedInstanceId` tampering 차단. membership 제거·deactivation 후 next request 즉시 403. super-admin instance switch audit.

### E.2 실험 시나리오

```
apps/spike-e/
├── (Auth.js + Drizzle adapter + magic link via Resend mock)
├── migrations/
│   ├── 012_admin_user.sql           # AdminUser + instanceMemberships
├── src/
│   ├── tenant-context.ts            # resolveTenantContext
│   ├── auth-middleware.ts           # next.js middleware
│   └── test-scenarios.ts
```

시나리오:
1. 사용자 A 로그인 (magic link)·session 생성
2. instanceMembership: A는 instance-a operator
3. `requestedInstanceId='instance-a'` 요청 → 통과·withTenantTransaction 진입
4. `requestedInstanceId='instance-b'` 요청 (A는 instance-b 미멤버) → 403
5. **client tampering**: 요청 헤더·쿠키 조작으로 instance-b 시도 → server-side resolveTenantContext가 membership 검증·차단
6. **membership 제거 후 next request**: A의 instance-a membership active=false → 다음 요청 403 (session expiry 안 기다림)
7. **inactive user**: A.active=false → 모든 요청 403
8. **super-admin instance switch**: super-admin이 instance-a → instance-b 전환 → `instance-switched` audit insert
9. **legal-reviewer eligibility**: legal-reviewer 후보가 자격 미충족 → 차단
10. **session refresh**: 매 요청 server-side 검증 (session expiry 안 기다림)

### E.2-provider: Vercel preview + Auth.js production-like (Day 10 — SPIKE2-02 신규)

| 검증 | 기준 |
|---|---|
| Vercel preview 환경 magic link callback | 1회 round-trip 성공 |
| Auth.js secure cookie + SameSite | production-like 환경에서 정상 설정 |
| Drizzle adapter session persistence | Supabase dev DB에 session row 저장·새 request에서 복원 |
| requestedInstanceId tampering | server-side 100% block |
| membership active=false 후 next request | 즉시 403 (session expiry 안 기다림) |
| Day artifact (SPIKE2-07) | preview smoke report + 403 matrix + session DB row 증거 (스크린샷 또는 SQL dump) |

### E.3 통과 기준

| 검증 | 기준 |
|---|---|
| Authorized request | 100% 통과 + RLS set |
| Unauthorized request (non-member) | 100% 403 |
| client tampering | 100% server-side reject |
| membership 제거 후 next request | 즉시 403 (session refresh 없이) |
| inactive user | 100% 403 |
| instance-switched audit | super-admin 전환 1회 = audit insert 1건 |
| legal-reviewer eligibility | 100% 검증 |

### E.4 fallback + reversal

| 실패 | fallback | reversal blast radius |
|---|---|---|
| Auth.js Drizzle adapter 호환 안 됨 | Lucia·Better-Auth로 전환 | INFRA 결정 v1.0 §2 stack reversal |
| session refresh latency 큼 | session cache + invalidation token | Auth.js 추가 정책 |
| instanceMembership 검증 query 비용 큼 | scoped index·또는 short-cache | acceptable trade-off |

### E.5 downstream unblock

- E PASS → `packages/auth`·`resolveTenantContext`·admin UI middleware·session 패턴
- E FAIL → Auth provider 변경·Phase 0 Week 2~3 일정 영향

---

## Spike F (P1·Week 2~3 후속): Secrets/env propagation

지연 가능 — 본 spike 통과 못 해도 Phase 0 진행 가능. 단 Phase 1 시작 전 완료.

목표: Doppler → Vercel·Railway·Supabase·R2·Sentry·Resend·Upstash env 전파·환경 분리·secret rotation.

## Spike G (P1·Phase 1 ADR): Customer domain·Cloudflare for SaaS

Phase 1 시작 전 ADR 별도. v1.0 Spike 단계에서는 미진행.

---

## 종합 dependency graph + partial state matrix (SPIKE1-15·SPIKE2-05)

### Spike 상태 분류

| 상태 | 의미 |
|---|---|
| `LOCAL_PASS` | 로컬 docker-compose 환경에서 통과 |
| `PROVIDER_PASS` | 실제 provider 환경 (Supabase dev·R2 staging·Vercel preview)에서 통과 |
| `PROVIDER_FAIL` | local은 통과했으나 provider에서 실패 |
| `INCONCLUSIVE` | local·provider 모두 미통과 또는 검증 부족 |

### Week 3~6 작업 unlock/hold 규칙

| Spike 상태 | Week 3-6 unlock | Week 3-6 hold |
|---|---|---|
| A `PROVIDER_PASS` | Week 3-4 schema·scopedDb·composite FK·M0 schema migration·lint rule | — |
| A `LOCAL_PASS·PROVIDER pending` | Week 3 schema migration (local·staging) | Week 4 production-readiness·prod deploy hold |
| A `PROVIDER_FAIL` | — | 전체 Phase 0 scope 재산정 gate |
| B `LOCAL_PASS` | Week 4-5 outbox base·worker skeleton·notifications dispatch base | — |
| B `INCONCLUSIVE` | — | worker 패턴 재설계 — notifications P0 subset 재정의 |
| C `PROVIDER_PASS` | Week 5+ packages/storage·blobRef·feature blob 적용·asset-ingestion·search-visibility·content-migration storage |
| C `LOCAL_PASS·PROVIDER FAIL` | local prototype은 진행 | Storage ADR 재작성·Supabase Storage reversal 검토 hold·R2 production 미적용 |
| D `LOCAL_PASS` | Week 4 M0 vertical slice migration 진행 |
| D `INCONCLUSIVE` | — | migration tooling 재선택 (Atlas·db-mate)·Phase 0 scope 재정의 |
| E `PROVIDER_PASS` | Week 6 admin UI middleware·login flow·session 관리 |
| E `LOCAL_PASS·PROVIDER pending` | UI 컴포넌트·DESIGN_TOKENS는 진행 가능 | **admin UI middleware·login flow hold** until E provider gate |
| E `PROVIDER_FAIL` | — | Auth provider 변경 (Clerk·Lucia·Better-Auth)·INFRA §2 stack reversal |

### 의사결정 매트릭스 (Day 10 종합 보고서)

| 상태 조합 | Week 3 즉시 진행 가능 | Hold 필요 | 결정 doc 갱신 |
|---|---|---|---|
| A PROVIDER_PASS + D LOCAL_PASS + B LOCAL_PASS + C/E provider pending 또는 LOCAL_PASS (SPIKE3-01 정정) | Week 3 schema/migration·worker skeleton·UI 컴포넌트 | Week 4 production-readiness·Storage 적용·admin login flow until provider gate | minor |
| 모두 PROVIDER_PASS | Week 3~6 전부 | — | minor |
| A 또는 D FAIL | — | 전체 Phase 0 재산정 | major (INFRA v1.0 reversal) |

---

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성·3 Spike (A/B/C) |
| 2026-05-15 | v0.2 | codex 1차 비평 18 지적 전건 수용 |
| 2026-05-15 | v0.3 | codex 2차 비평 7 지적 전건 수용 |
| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정**. SPIKE3-01 Day 10 의사결정 매트릭스 D LOCAL_PASS 정정 (D는 local-only gate). SPIKE3-02 INFRA 요약부 cleanup은 후속 (minor). **3 cycle 누계 27 지적 전건 수용** (SPIKE1: 18 + SPIKE2: 7 + SPIKE3: 2). SoT cascade 완료: INFRA §4.1·4.2·REVIEW_WORKFLOW AuditAction 4종·DATA_MODEL C-23 v0.24 |
| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
| 2026-05-15 | (v0.2 이전 비고) | codex 1차 비평 18 지적 전건 수용: (1) **provider smoke gate** — local + provider 2단계 분리 (SPIKE1-01·04), (2) **Spike D 신설** — Drizzle Kit migration deploy (SPIKE1-02), (3) **Spike E 신설** — Auth.js + resolveTenantContext + membership invalidation (SPIKE1-03), (4) **invariant 측정 표준화** — 1000 iterations × 20 concurrent + invariant SQL binary 검증 (SPIKE1-05), (5) **A 쓰기 path·rollback·nested tx·audit_log RLS 시나리오 추가** (SPIKE1-06·07), (6) **B 가설 정정** — idempotent at-least-once with exactly-once observable effects (SPIKE1-08), (7) **B failure injection 8 point + 외부 call count invariant** (SPIKE1-09·10), (8) **C TTL 상태 코드 정정** — 401 → 403 (provider semantics·SPIKE1-11), (9) **C security 시나리오 확장** — replay·method confusion·ListBucket·content-type·URL scrubbing (SPIKE1-12), (10) **REVIEW_WORKFLOW cascade** — `signed-url-issued`·`signed-url-revoked` AuditAction 2종 추가 (SPIKE1-13), (11) **fallback에 reversal blast radius 명시** (SPIKE1-14), (12) **Week 3~6 dependency graph** (SPIKE1-15), (13) **일정 7일 → 10일** (Week 1 + Week 2 Day 8~10·SPIKE1-16), (14) **성능 기준 correctness와 분리** (SPIKE1-17), (15) **A/B scope 명확화** — A는 transaction/RLS·B는 queue/crash (SPIKE1-18), (16) Spike F·G P1·후속 명시 |

codex
계획 문서 기준으로 보면 A에는 malformed UUID, runtime guard, invariant result logging까지 명시되어 있습니다. 이제 구현 파일을 열어서 “계획 대비 증명력이 있는가”와 실제 버그를 분리해서 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/migrations/001_roles.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/migrations/002_content_test.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/migrations/003_audit_log.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/migrations/004_invariant_log.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/db.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/tenant.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 883ms:
-- Spike A — migration 001: roles
-- app_tenant_user: tenant 작업 전용 user. RLS 적용
-- (postgres는 super-user — RLS bypass·migration 실행·break-glass 용)

CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT;

-- public schema 사용 권한
GRANT USAGE ON SCHEMA public TO app_tenant_user;

-- 향후 생성되는 table에 자동으로 권한 부여
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_tenant_user;

-- ALTER로 BYPASSRLS 명시 — postgres super-user는 BYPASSRLS 기본 true이지만 app_tenant_user는 false
ALTER ROLE app_tenant_user NOBYPASSRLS;

 succeeded in 898ms:
-- Spike A — migration 002: content_test (RLS + WITH CHECK)

CREATE TABLE content_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT content_test_title_nonempty CHECK (length(title) > 0)
);

CREATE INDEX content_test_instance_id_idx ON content_test (instance_id);

-- RLS enable + FORCE (super-user 외 모든 role에 RLS 적용)
ALTER TABLE content_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_test FORCE ROW LEVEL SECURITY;

-- tenant_isolation policy — SELECT/INSERT/UPDATE/DELETE 모두 USING + WITH CHECK
-- current_setting('app.current_instance_id', true)의 두 번째 인자 true는 missing_ok (NULL 반환)
CREATE POLICY tenant_isolation ON content_test
  FOR ALL TO app_tenant_user
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant_user;

-- gen_random_uuid 위한 pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

 succeeded in 893ms:
-- Spike A — migration 003: audit_log (append-only · tenant-scoped read RLS)
-- write path: control-plane helper 허용 (worker가 instance switch 시 insert 가능)
-- read path: tenant-scoped (RLS — instance 격리)

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  content_ref TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_instance_id_idx ON audit_log (instance_id, occurred_at DESC);

-- RLS enable + FORCE
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;

-- read: tenant-scoped (자신의 instance만)
CREATE POLICY audit_log_read ON audit_log
  FOR SELECT TO app_tenant_user
  USING (instance_id = current_setting('app.current_instance_id', true)::uuid);

-- write: app_tenant_user는 자신의 instance에만 insert 가능 (WITH CHECK)
CREATE POLICY audit_log_write ON audit_log
  FOR INSERT TO app_tenant_user
  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);

-- update/delete 차단 — append-only (no policy granted)
-- → app_tenant_user의 UPDATE/DELETE는 RLS에 의해 0 rows affected

-- super-user (postgres)는 RLS bypass — service-role 패턴
GRANT SELECT, INSERT ON audit_log TO app_tenant_user;
-- UPDATE/DELETE 권한 자체를 부여하지 않음 (RLS 외 GRANT level append-only 강화)

 succeeded in 896ms:
// Spike A — withTenantTransaction
// 인프라 결정 v1.0 § 1.1 SoT 패턴
//
// 규칙:
//  - 모든 tenant 작업은 이 헬퍼 안에서만
//  - SET LOCAL은 transaction commit/rollback 시 자동 해제 → pgbouncer transaction pooling 안전
//  - dbTenant는 app_tenant_user — RLS 강제 적용

import { sql } from "drizzle-orm";
import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
import { dbTenant } from "./db.ts";

export type TenantTransaction = PostgresJsTransaction<Record<string, never>, Record<string, never>>;

/**
 * tenant 작업은 반드시 이 헬퍼 안에서만 실행한다.
 * fn 안의 tx는 dbTenant transaction. SET LOCAL로 instance_id 설정 → RLS 적용
 */
export async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  if (!isValidUuid(instanceId)) {
    throw new Error(`withTenantTransaction: invalid instanceId ${instanceId}`);
  }
  return dbTenant.transaction(async (tx) => {
    // app_tenant_user는 이미 connection level — SET LOCAL ROLE 불필요
    // (만약 service_role connection을 재사용한다면 SET LOCAL ROLE app_tenant_user 필요)
    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
    return fn(tx);
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(s: string): boolean {
  return UUID_RE.test(s);
}

 succeeded in 903ms:
-- Spike A — migration 004: invariant_log (1000 iter 측정 결과 적재)
-- super-user만 접근 (postgres) — invariant 측정 자체는 spike 운영 metadata

CREATE TABLE invariant_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,           -- 같은 runner instance를 식별
  iteration INT NOT NULL,
  worker_idx INT NOT NULL,
  expected_instance_id UUID NOT NULL,  -- query 시작 시 set한 instance_id
  pg_backend_pid INT NOT NULL,
  current_user_name TEXT NOT NULL,     -- current_user 결과
  current_setting_value TEXT,          -- current_setting('app.current_instance_id', true)
  scenario TEXT NOT NULL,              -- e.g. 'select-isolation', 'insert-cross-instance'
  result_count INT NOT NULL,           -- query 결과 row count
  foreign_instance_count INT NOT NULL, -- 결과 중 expected_instance_id != row.instance_id 개수
  passed BOOLEAN NOT NULL,
  error_message TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, iteration, worker_idx);
CREATE INDEX invariant_log_failed_idx ON invariant_log (run_id, passed) WHERE passed = false;

-- 측정 metadata는 RLS 적용 안 함 (super-user 전용)
-- app_tenant_user 권한 부여 안 함

 succeeded in 909ms:
// Spike A — DB connection layer
// 3 종류 connection:
//  - dbSuper: 직접 connection (postgres user — migration·service-role·RLS bypass)
//  - dbTenant: pgbouncer transaction pooling (app_tenant_user — RLS 적용)
//  - dbTenantDirect: direct connection (app_tenant_user — pgbouncer 없이. fallback 비교용)

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

// super (5433 — direct)
export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), {
  max: 4,
  prepare: false,
  onnotice: () => {}, // suppress NOTICE
});
export const dbSuper = drizzle(sqlSuper);

// tenant via pgbouncer (6433 — transaction pooling)
// `prepare: false` 강제 — pgbouncer transaction pooling은 prepared statement 비호환
export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), {
  max: 30,
  prepare: false,
  onnotice: () => {},
});
export const dbTenant = drizzle(sqlTenant);

// service-role: postgres direct (break-glass)
export const sqlServiceRole = postgres(requireEnv("DATABASE_URL_SERVICE_ROLE"), {
  max: 4,
  prepare: false,
  onnotice: () => {},
});
export const dbServiceRole = drizzle(sqlServiceRole);

export async function closeAll(): Promise<void> {
  await Promise.all([sqlSuper.end(), sqlTenant.end(), sqlServiceRole.end()]);
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/service-role.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/migrate.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/seed.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/tsconfig.json' in C:\Users\assag\solution\website-exposure
 succeeded in 880ms:
// Spike A — Drizzle schema (typed accessor)

import { pgTable, uuid, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

export const contentTest = pgTable("content_test", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull(),
  actorId: text("actor_id").notNull(),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  contentRef: text("content_ref"),
  metadata: jsonb("metadata").notNull().default({}),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invariantLog = pgTable("invariant_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: uuid("run_id").notNull(),
  iteration: integer("iteration").notNull(),
  workerIdx: integer("worker_idx").notNull(),
  expectedInstanceId: uuid("expected_instance_id").notNull(),
  pgBackendPid: integer("pg_backend_pid").notNull(),
  currentUserName: text("current_user_name").notNull(),
  currentSettingValue: text("current_setting_value"),
  scenario: text("scenario").notNull(),
  resultCount: integer("result_count").notNull(),
  foreignInstanceCount: integer("foreign_instance_count").notNull(),
  passed: boolean("passed").notNull(),
  errorMessage: text("error_message"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});

 succeeded in 918ms:
// Spike A — service_role break-glass + audit
// 인프라 결정 v1.0 § 1.2 SoT
//
// 사용 시 audit log `service-role-invoked` insert 필수.
// audit_log RLS — super-user는 bypass·instance_id 명시.

import { sql } from "drizzle-orm";
import { dbServiceRole } from "./db.ts";

export type ServiceRoleContext = {
  reasonCode: string;
  ticketRef: string;
  actorId: string;
  actorRole: string;
  affectedInstanceIds: string[];
  readWriteClass: "read" | "write" | "both";
  dryRun: boolean;
  correlationId: string;
};

/**
 * service_role 함수의 표준 wrapper.
 * 사용 전 audit log insert (앞면 audit). 함수 실행 후 후처리는 caller 책임.
 */
export async function withServiceRole<T>(
  ctx: ServiceRoleContext,
  serviceRoleFunction: string,
  fn: () => Promise<T>,
): Promise<T> {
  // 각 affected instance에 대해 audit 1건씩
  // (실제 운영은 single audit row with affectedInstanceIds JSON·prototype은 simple)
  for (const instanceId of ctx.affectedInstanceIds) {
    await dbServiceRole.execute(sql`
      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
      VALUES (
        ${instanceId}::uuid,
        ${ctx.actorId},
        ${ctx.actorRole},
        'service-role-invoked',
        ${JSON.stringify({
          serviceRoleFunction,
          reasonCode: ctx.reasonCode,
          ticketRef: ctx.ticketRef,
          readWriteClass: ctx.readWriteClass,
          dryRun: ctx.dryRun,
          correlationId: ctx.correlationId,
        })}::jsonb
      )
    `);
  }

  return fn();
}

 succeeded in 887ms:
// Spike A — seed 2 instance × 5 row + audit
import { sql } from "drizzle-orm";
import { dbSuper, closeAll } from "./db.ts";

export const INSTANCE_A = "11111111-1111-1111-1111-111111111111";
export const INSTANCE_B = "22222222-2222-2222-2222-222222222222";

async function main(): Promise<void> {
  // 기존 데이터 정리
  await dbSuper.execute(sql`TRUNCATE content_test, audit_log, invariant_log RESTART IDENTITY`);

  // instance A 5건
  for (let i = 1; i <= 5; i++) {
    await dbSuper.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_A}::uuid, ${"A-" + i})
    `);
  }
  // instance B 5건
  for (let i = 1; i <= 5; i++) {
    await dbSuper.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_B}::uuid, ${"B-" + i})
    `);
  }

  // audit log seed (각 instance 1건)
  await dbSuper.execute(sql`
    INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
    VALUES
      (${INSTANCE_A}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb),
      (${INSTANCE_B}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb)
  `);

  console.log("seed: done — instance-a 5, instance-b 5");
  await closeAll();
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 868ms:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false
  },
  "include": ["src/**/*.ts", "scripts/**/*.js"]
}

 succeeded in 879ms:
{
  "name": "@glitzy/spike-a",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Spike A — Drizzle + RLS + tenant scoping. withTenantTransaction·SET LOCAL·pgBouncer transaction pooling·1000 iter invariant",
  "scripts": {
    "up": "docker compose up -d",
    "down": "docker compose down -v",
    "wait-db": "node ./scripts/wait-db.js",
    "migrate": "tsx src/migrate.ts",
    "seed": "tsx src/seed.ts",
    "scenario:read": "tsx src/scenarios/test-read.ts",
    "scenario:write": "tsx src/scenarios/test-write.ts",
    "scenario:rollback": "tsx src/scenarios/test-rollback.ts",
    "scenario:nested": "tsx src/scenarios/test-nested-tx.ts",
    "scenario:audit": "tsx src/scenarios/test-audit.ts",
    "scenario:invariant": "tsx src/scenarios/test-invariant-runner.ts",
    "scenario:all": "pnpm scenario:read && pnpm scenario:write && pnpm scenario:rollback && pnpm scenario:nested && pnpm scenario:audit && pnpm scenario:invariant",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.36.4",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "drizzle-kit": "^0.28.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}

 succeeded in 927ms:
// Spike A — migration runner (raw SQL, postgres super-user)
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { dbSuper, closeAll } from "./db.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "migrations");

async function main(): Promise<void> {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  // migrations_applied tracking table 생성
  await dbSuper.execute(sql`
    CREATE TABLE IF NOT EXISTS migrations_applied (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  for (const file of files) {
    const already = await dbSuper.execute(sql`
      SELECT 1 FROM migrations_applied WHERE filename = ${file}
    `);
    if (already.length > 0) {
      console.log(`  skip  ${file}`);
      continue;
    }

    console.log(`apply ${file}`);
    const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
    await dbSuper.execute(sql.raw(content));
    await dbSuper.execute(sql`
      INSERT INTO migrations_applied (filename) VALUES (${file})
    `);
  }

  console.log("migrate: done");
  await closeAll();
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-read.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-write.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-rollback.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-nested-tx.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-audit.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/src/scenarios/test-invariant-runner.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 802ms:
// Spike A — Scenario 1: SELECT 격리
import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbServiceRole } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // A: instance-a context — A row 5건만
  const aRows = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const r = await tx.execute(sql`SELECT instance_id, title FROM content_test ORDER BY title`);
    return r as unknown as Array<{ instance_id: string; title: string }>;
  });
  results.push({
    passed: aRows.length === 5 && aRows.every((r) => r.instance_id === INSTANCE_A),
    detail: `instance-a SELECT: ${aRows.length} rows`,
  });

  // B: instance-b context — B row 5건만
  const bRows = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const r = await tx.execute(sql`SELECT instance_id, title FROM content_test ORDER BY title`);
    return r as unknown as Array<{ instance_id: string; title: string }>;
  });
  results.push({
    passed: bRows.length === 5 && bRows.every((r) => r.instance_id === INSTANCE_B),
    detail: `instance-b SELECT: ${bRows.length} rows`,
  });

  // C: service-role direct (RLS bypass) — 10건 모두
  const allRows = await dbServiceRole.execute(sql`SELECT count(*)::int AS c FROM content_test`);
  const total = (allRows as unknown as Array<{ c: number }>)[0]?.c ?? 0;
  results.push({
    passed: total === 10,
    detail: `service-role total: ${total}`,
  });

  // 결과 출력
  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-read: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 844ms:
// Spike A — Scenario 4: nested transaction (savepoint) context 유지

import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // outer tx (instance-a) + nested savepoint
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    // outer에서 instance-a row 보임
    const outer = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    const outerCount = ((outer as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
    results.push({ passed: outerCount === 5, detail: `outer tx: ${outerCount}` });

    // nested savepoint 안에서도 같은 context 유지
    await tx.transaction(async (innerTx) => {
      const inner = await innerTx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
      const innerCount = ((inner as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
      results.push({ passed: innerCount === 5, detail: `inner savepoint: ${innerCount}` });

      // inner에서 다른 instance read 시도 — RLS reject
      const cross = await innerTx.execute(sql`
        SELECT count(*)::int AS c FROM content_test WHERE instance_id = ${INSTANCE_B}::uuid
      `);
      const crossCount = ((cross as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
      results.push({ passed: crossCount === 0, detail: `inner cross-instance read: ${crossCount}` });
    });

    // outer 다시 — context 여전히 유지
    const after = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    const afterCount = ((after as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
    results.push({ passed: afterCount === 5, detail: `outer after inner: ${afterCount}` });
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-nested-tx: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 873ms:
// Spike A — Scenario 2: INSERT/UPDATE/DELETE WITH CHECK
import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // INSERT 1: instance-a context에서 자기 instance INSERT — 성공
  const r1 = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_A}::uuid, 'A-self-insert')
      RETURNING id
    `);
    return (ret as unknown as Array<{ id: string }>).length;
  });
  results.push({ passed: r1 === 1, detail: `INSERT self-instance: ${r1} row` });

  // INSERT 2: instance-a context에서 instance-b INSERT 시도 — WITH CHECK reject
  let r2Error = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`
        INSERT INTO content_test (instance_id, title)
        VALUES (${INSTANCE_B}::uuid, 'A-cross-insert')
      `);
    });
  } catch (e) {
    r2Error = (e as Error).message;
  }
  results.push({
    passed: r2Error.length > 0 && /row-level security|policy/i.test(r2Error),
    detail: `INSERT cross-instance WITH CHECK reject: ${r2Error.slice(0, 80) || "no error (FAIL)"}`,
  });

  // UPDATE: instance-a context에서 instance-b row update 시도 — 0 rows affected
  // (RLS USING 절이 검사 — instance-b row가 보이지 않으므로 update target 없음)
  const r3 = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`
      UPDATE content_test SET title = 'hijacked'
      WHERE instance_id = ${INSTANCE_B}::uuid
    `);
    // postgres-js returns count for non-returning. drizzle execute may differ.
    return ret as unknown;
  });
  // count 확인 — sql 결과는 array (no returning). 0 rows affected이면 영향 없음.
  // 검증: instance-b에서 'hijacked' row가 없음
  const r3check = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT count(*)::int AS c FROM content_test WHERE title = 'hijacked'
    `);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? 0;
  });
  results.push({
    passed: r3check === 0,
    detail: `UPDATE cross-instance — instance-b 'hijacked' rows: ${r3check} (passed if 0)`,
  });

  // DELETE: 동일 패턴
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    await tx.execute(sql`DELETE FROM content_test WHERE instance_id = ${INSTANCE_B}::uuid`);
  });
  const r4check = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? 0;
  });
  results.push({
    passed: r4check === 5,
    detail: `DELETE cross-instance — instance-b row count: ${r4check} (passed if 5)`,
  });

  // 결과 출력
  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-write: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 866ms:
// Spike A — Scenario 3: rollback 후 context 누설 검증
//
// SET LOCAL은 transaction commit/rollback 시 자동 해제.
// rollback 후 새 transaction에서 context 누설되지 않아야 함.

import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbTenant } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // 의도적 rollback (transaction 안에서 throw)
  let rollbackThrown = false;
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`SELECT * FROM content_test`);
      throw new Error("intentional rollback");
    });
  } catch (e) {
    rollbackThrown = (e as Error).message === "intentional rollback";
  }
  results.push({ passed: rollbackThrown, detail: `intentional rollback caught` });

  // rollback 후 transaction 밖에서 dbTenant 직접 query — RLS USING 절은 current_instance_id NULL → 0 rows
  const directResult = await dbTenant.execute(sql`SELECT count(*)::int AS c FROM content_test`);
  const directCount = ((directResult as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  results.push({
    passed: directCount === 0,
    detail: `direct query (no tenant context): ${directCount} rows (passed if 0 — RLS reject)`,
  });

  // 새 transaction (instance-b) — 정상 동작 (이전 instance-a context 누설 없음)
  const newTxRows = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({
    passed: newTxRows === 5,
    detail: `new tx instance-b after rollback: ${newTxRows} rows (passed if 5)`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-rollback: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 856ms:
// Spike A — Scenario 5: service-role + audit_log RLS·append-only

import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { withServiceRole } from "../service-role.ts";
import { closeAll, dbServiceRole } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
import { randomUUID } from "node:crypto";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // 1. service-role 사용 — audit log insert 1건
  const correlationId = randomUUID();
  await withServiceRole(
    {
      actorId: "test-admin",
      actorRole: "super-admin",
      reasonCode: "spike-a-test",
      ticketRef: "SPIKE-A-001",
      affectedInstanceIds: [INSTANCE_A],
      readWriteClass: "read",
      dryRun: false,
      correlationId,
    },
    "testServiceRoleScenario",
    async () => {
      // 실제로는 super-user query — RLS bypass
      await dbServiceRole.execute(sql`SELECT count(*) FROM content_test`);
    },
  );

  // audit_log instance-a context에서 본인 instance row만 보여야 함
  const auditA = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
    `);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({ passed: auditA === 1, detail: `instance-a audit service-role-invoked: ${auditA}` });

  // instance-b context에서 같은 action 검색 — 0건 (자기 instance 미해당)
  const auditB = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
    `);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({ passed: auditB === 0, detail: `instance-b audit cross-isolation: ${auditB}` });

  // append-only: app_tenant_user는 audit_log UPDATE/DELETE 권한 없음 — GRANT 미부여
  let updateError = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`UPDATE audit_log SET action = 'tampered' WHERE instance_id = ${INSTANCE_A}::uuid`);
    });
  } catch (e) {
    updateError = (e as Error).message;
  }
  results.push({
    passed: /permission denied|insufficient privilege/i.test(updateError),
    detail: `audit_log UPDATE blocked: ${updateError.slice(0, 80) || "no error (FAIL)"}`,
  });

  let deleteError = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`DELETE FROM audit_log WHERE instance_id = ${INSTANCE_A}::uuid`);
    });
  } catch (e) {
    deleteError = (e as Error).message;
  }
  results.push({
    passed: /permission denied|insufficient privilege/i.test(deleteError),
    detail: `audit_log DELETE blocked: ${deleteError.slice(0, 80) || "no error (FAIL)"}`,
  });

  // cross-instance metadata 미노출: instance-a context에서 audit 조회 시 instance-b row 안 보임
  const allA = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`SELECT instance_id FROM audit_log`);
    return ret as unknown as Array<{ instance_id: string }>;
  });
  const foreignFromA = allA.filter((r) => r.instance_id !== INSTANCE_A).length;
  results.push({
    passed: foreignFromA === 0,
    detail: `instance-a audit foreign row count: ${foreignFromA} (passed if 0)`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-audit: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

 succeeded in 844ms:
// Spike A — Scenario 6: invariant runner — 1000 iter × 20 concurrent
//
// SoT 측정:
//  - 각 iteration·worker마다 expected_instance_id 설정
//  - SELECT 결과의 모든 row.instance_id가 expected와 일치하는지 검증
//  - foreign_instance_count > 0 한 건이라도 발견되면 FAIL
//  - pg_backend_pid·current_user·current_setting 기록 — pgbouncer leak 검증

import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
import { randomUUID } from "node:crypto";

const ITER = Number(process.env.INVARIANT_ITER ?? "1000");
const CONCURRENCY = Number(process.env.INVARIANT_CONCURRENCY ?? "20");

type LogRow = {
  runId: string;
  iteration: number;
  workerIdx: number;
  expectedInstanceId: string;
  pgBackendPid: number;
  currentUserName: string;
  currentSettingValue: string | null;
  scenario: string;
  resultCount: number;
  foreignInstanceCount: number;
  passed: boolean;
  errorMessage: string | null;
};

async function runOneIteration(
  runId: string,
  iteration: number,
  workerIdx: number,
  expectedInstanceId: string,
): Promise<LogRow> {
  try {
    const r = await withTenantTransaction(expectedInstanceId, async (tx) => {
      // metadata 수집
      const meta = await tx.execute(sql`
        SELECT
          pg_backend_pid() AS pid,
          current_user AS user_name,
          current_setting('app.current_instance_id', true) AS setting_value
      `);
      const m = (meta as unknown as Array<{
        pid: number;
        user_name: string;
        setting_value: string | null;
      }>)[0];

      // 결과 query
      const rows = await tx.execute(sql`
        SELECT instance_id FROM content_test
      `);
      const result = rows as unknown as Array<{ instance_id: string }>;
      const foreignCount = result.filter((r) => r.instance_id !== expectedInstanceId).length;

      return {
        pid: m?.pid ?? -1,
        userName: m?.user_name ?? "",
        settingValue: m?.setting_value ?? null,
        resultCount: result.length,
        foreignCount,
      };
    });

    return {
      runId,
      iteration,
      workerIdx,
      expectedInstanceId,
      pgBackendPid: r.pid,
      currentUserName: r.userName,
      currentSettingValue: r.settingValue,
      scenario: "select-isolation",
      resultCount: r.resultCount,
      foreignInstanceCount: r.foreignCount,
      passed: r.foreignCount === 0 && r.resultCount === 5,
      errorMessage: null,
    };
  } catch (e) {
    return {
      runId,
      iteration,
      workerIdx,
      expectedInstanceId,
      pgBackendPid: -1,
      currentUserName: "",
      currentSettingValue: null,
      scenario: "select-isolation",
      resultCount: 0,
      foreignInstanceCount: 0,
      passed: false,
      errorMessage: (e as Error).message,
    };
  }
}

async function persistBatch(rows: LogRow[]): Promise<void> {
  if (rows.length === 0) return;
  // batch insert를 위해 dynamic SQL 빌드 (postgres-js sql.unsafe 대신 쪼개기)
  for (const r of rows) {
    await dbSuper.execute(sql`
      INSERT INTO invariant_log (
        run_id, iteration, worker_idx, expected_instance_id,
        pg_backend_pid, current_user_name, current_setting_value,
        scenario, result_count, foreign_instance_count, passed, error_message
      ) VALUES (
        ${r.runId}::uuid, ${r.iteration}, ${r.workerIdx}, ${r.expectedInstanceId}::uuid,
        ${r.pgBackendPid}, ${r.currentUserName}, ${r.currentSettingValue},
        ${r.scenario}, ${r.resultCount}, ${r.foreignInstanceCount}, ${r.passed}, ${r.errorMessage}
      )
    `);
  }
}

async function main(): Promise<void> {
  const runId = randomUUID();
  console.log(`invariant-runner: runId=${runId} iter=${ITER} concurrency=${CONCURRENCY}`);
  const start = Date.now();

  let processed = 0;
  let failures = 0;
  const buffer: LogRow[] = [];

  for (let iter = 1; iter <= ITER; iter++) {
    // CONCURRENCY 개 동시 실행 (각자 random instance 할당)
    const promises: Promise<LogRow>[] = [];
    for (let w = 0; w < CONCURRENCY; w++) {
      const expected = w % 2 === 0 ? INSTANCE_A : INSTANCE_B;
      promises.push(runOneIteration(runId, iter, w, expected));
    }
    const results = await Promise.all(promises);
    for (const r of results) {
      if (!r.passed) failures++;
      buffer.push(r);
    }
    processed += CONCURRENCY;

    // 100건마다 flush
    if (buffer.length >= 100) {
      await persistBatch(buffer);
      buffer.length = 0;
    }

    if (iter % 100 === 0) {
      console.log(`  iter ${iter}/${ITER} (processed=${processed} failures=${failures})`);
    }
  }
  await persistBatch(buffer);

  const elapsed = Date.now() - start;

  // 최종 invariant SQL
  const failedRows = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total_failures,
      count(*) FILTER (WHERE foreign_instance_count > 0)::int AS foreign_violations,
      count(*) FILTER (WHERE error_message IS NOT NULL)::int AS errors
    FROM invariant_log
    WHERE run_id = ${runId}::uuid AND passed = false
  `);
  const summary = (failedRows as unknown as Array<{
    total_failures: number;
    foreign_violations: number;
    errors: number;
  }>)[0];

  console.log("\n=== invariant-runner result ===");
  console.log(`  total processed: ${processed}`);
  console.log(`  failures: ${summary?.total_failures ?? 0}`);
  console.log(`  foreign instance violations: ${summary?.foreign_violations ?? 0}`);
  console.log(`  errors: ${summary?.errors ?? 0}`);
  console.log(`  elapsed: ${(elapsed / 1000).toFixed(1)}s`);

  const passed =
    (summary?.foreign_violations ?? 0) === 0 &&
    (summary?.errors ?? 0) === 0;
  console.log(`invariant-runner: ${passed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!passed) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await closeAll();
  process.exit(1);
});

codex
구현은 기본 경로는 갖췄지만, 몇몇 시나리오는 계획의 acceptance를 실제로 증명하지 못합니다. 특히 `seed.ts` import side effect, migration 원자성, service-role 감사 의미론, missing GUC 처리 쪽을 더 확인하고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/docker-compose.yml' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/.env.example' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/README.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/scripts/wait-db.js' in C:\Users\assag\solution\website-exposure
 succeeded in 667ms:
services:
  postgres:
    image: postgres:16-alpine
    container_name: spike-a-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: spike_a
    ports:
      - "5433:5432"   # 호스트 5433 → 컨테이너 5432 (다른 spike와 충돌 회피)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d spike_a"]
      interval: 1s
      timeout: 3s
      retries: 30
    command:
      - "postgres"
      - "-c"
      - "log_statement=none"
      - "-c"
      - "max_connections=200"

  pgbouncer:
    image: edoburu/pgbouncer:1.23.1
    container_name: spike-a-pgbouncer
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/spike_a
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 200
      DEFAULT_POOL_SIZE: 20
      AUTH_TYPE: scram-sha-256
      ADMIN_USERS: postgres
    ports:
      - "6433:5432"   # 호스트 6433 → pgbouncer (transaction pooling)

 succeeded in 643ms:
# Spike A 환경 변수 예시 (실제 .env로 복사 후 사용)

# Direct connection (postgres user — RLS bypass용·migration 실행)
DATABASE_URL_SUPER=postgres://postgres:postgres@localhost:5433/spike_a

# Tenant connection via pgbouncer (transaction pooling) — RLS 적용
DATABASE_URL_TENANT=postgres://app_tenant_user:app_tenant_pw@localhost:6433/spike_a

# Service role connection (postgres user — break-glass)
DATABASE_URL_SERVICE_ROLE=postgres://postgres:postgres@localhost:5433/spike_a

# Invariant runner config
INVARIANT_ITER=1000
INVARIANT_CONCURRENCY=20

 succeeded in 647ms:
# Spike A — Drizzle + RLS + tenant scoping

> **상태**: prototype v0.1
> **상위 결정**: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § Spike A

## 가설

`withTenantTransaction(instanceId, fn)` 안에서 `SET LOCAL app.current_instance_id`로 RLS context가 전달되고, Drizzle ORM이 transaction 안에서 SELECT/INSERT/UPDATE/DELETE 모두 tenant 격리. rollback 후 context 누설 없음. service_role break-glass는 `service-role-invoked` audit. audit_log는 read-RLS·append-only (GRANT level).

## 통과 기준

| 검증 | 기준 |
|---|---|
| SELECT 격리 | 1000 iter × 20 concurrent — foreign_instance_count 0건 |
| INSERT/UPDATE/DELETE WITH CHECK | cross-instance write 0건 |
| rollback 후 context 누설 | 0건 |
| nested tx·savepoint | context 유지 |
| audit_log RLS 읽기 격리 | foreign metadata 0건 |
| audit_log append-only | UPDATE/DELETE 모두 fail (GRANT 미부여) |
| service_role audit | 사용 횟수 = audit insert 1:1 |

## 실행

```bash
# 1. docker-compose 기동
pnpm up
pnpm wait-db

# 2. migration·seed
pnpm migrate
pnpm seed

# 3. 시나리오 6개 순차 실행
pnpm scenario:read
pnpm scenario:write
pnpm scenario:rollback
pnpm scenario:nested
pnpm scenario:audit
pnpm scenario:invariant
# 또는: pnpm scenario:all

# 4. 정리
pnpm down
```

## 환경 변수 (`.env`)

`.env.example` 복사:
```
DATABASE_URL_SUPER=postgres://postgres:postgres@localhost:5433/spike_a
DATABASE_URL_TENANT=postgres://app_tenant_user:app_tenant_pw@localhost:6433/spike_a
DATABASE_URL_SERVICE_ROLE=postgres://postgres:postgres@localhost:5433/spike_a
INVARIANT_ITER=1000
INVARIANT_CONCURRENCY=20
```

## 디렉토리

```
apps/spike-a/
├── docker-compose.yml           # postgres 16 + pgbouncer (transaction pooling)
├── migrations/
│   ├── 001_roles.sql            # app_tenant_user role (NOBYPASSRLS)
│   ├── 002_content_test.sql     # RLS + WITH CHECK + FORCE ROW LEVEL SECURITY
│   ├── 003_audit_log.sql        # read-RLS + append-only (GRANT level)
│   └── 004_invariant_log.sql    # 측정 결과 적재 (super-user only)
├── src/
│   ├── db.ts                    # 3 connection (super/tenant/service-role)
│   ├── tenant.ts                # withTenantTransaction
│   ├── service-role.ts          # withServiceRole + audit
│   ├── schema.ts                # Drizzle schema
│   ├── migrate.ts·seed.ts
│   └── scenarios/
│       ├── test-read.ts
│       ├── test-write.ts
│       ├── test-rollback.ts
│       ├── test-nested-tx.ts
│       ├── test-audit.ts
│       └── test-invariant-runner.ts
└── scripts/wait-db.js
```

## 종료 후

- prototype 코드는 archive·본 구현은 `packages/db`·`packages/core-data-model`로 격상
- 결과 보고서: `docs/spike-results/spike-a-result.md` (별도)

 succeeded in 653ms:
// docker-compose up 후 postgres + pgbouncer가 ready될 때까지 대기
import postgres from "postgres";

const TIMEOUT_MS = 60_000;
const POLL_MS = 1000;

async function ping(url) {
  const sql = postgres(url, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    await sql`SELECT 1`;
    await sql.end({ timeout: 1 });
    return true;
  } catch {
    try { await sql.end({ timeout: 1 }); } catch {}
    return false;
  }
}

async function waitFor(name, url) {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    if (await ping(url)) {
      console.log(`  ${name} ready`);
      return;
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`${name} not ready after ${TIMEOUT_MS}ms`);
}

const superUrl = process.env.DATABASE_URL_SUPER;
const tenantUrl = process.env.DATABASE_URL_TENANT;
if (!superUrl) { console.error("DATABASE_URL_SUPER missing"); process.exit(1); }

await waitFor("postgres", superUrl);
// tenant role은 migration 후에야 사용 가능 — wait-db는 super만 검증
console.log("wait-db: done");

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --dir apps/spike-a typecheck' in C:\Users\assag\solution\website-exposure
2026-05-15T03:24:29.918856Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
fatal: not a git repository (or any of the parent directories): .git

 exited 1 in 566ms:
fatal: not a git repository (or any of the parent directories): .git

2026-05-15T03:24:30.433755Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1 seconds
Output:

> @glitzy/spike-a@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\spike-a
> tsc --noEmit

 ELIFECYCLE  Command failed with exit code 1.
'tsc' is not recognized as an internal or external command,
operable program or batch file.

 exited 1 in 1033ms:

> @glitzy/spike-a@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\spike-a
> tsc --noEmit

 ELIFECYCLE  Command failed with exit code 1.
'tsc' is not recognized as an internal or external command,
operable program or batch file.

codex
`pnpm --dir apps/spike-a typecheck`도 확인했지만 로컬에 `typescript/tsc`가 설치되어 있지 않아 실행 자체가 실패했습니다. 따라서 타입 호환성은 정적 읽기 기준으로 판단하고, 실행 검증은 “미실행/검증 불가”로 남깁니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Name' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Name apps/spike-a' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "tsx|typescript|packageManager|workspaces|pnpm" package.json pnpm-workspace.yaml apps/spike-a/package.json' in C:\Users\assag\solution\website-exposure
 succeeded in 637ms:
migrations
scripts
src
.env.example
docker-compose.yml
package.json
README.md
tsconfig.json

 succeeded in 663ms:
.agents
.claude
.codex-reviews
apps
docs
handoff
skills-lock.json

 exited 1 in 646ms:
apps/spike-a/package.json:11:    "migrate": "tsx src/migrate.ts",
apps/spike-a/package.json:12:    "seed": "tsx src/seed.ts",
apps/spike-a/package.json:13:    "scenario:read": "tsx src/scenarios/test-read.ts",
apps/spike-a/package.json:14:    "scenario:write": "tsx src/scenarios/test-write.ts",
apps/spike-a/package.json:15:    "scenario:rollback": "tsx src/scenarios/test-rollback.ts",
apps/spike-a/package.json:16:    "scenario:nested": "tsx src/scenarios/test-nested-tx.ts",
apps/spike-a/package.json:17:    "scenario:audit": "tsx src/scenarios/test-audit.ts",
apps/spike-a/package.json:18:    "scenario:invariant": "tsx src/scenarios/test-invariant-runner.ts",
apps/spike-a/package.json:19:    "scenario:all": "pnpm scenario:read && pnpm scenario:write && pnpm scenario:rollback && pnpm scenario:nested && pnpm scenario:audit && pnpm scenario:invariant",
apps/spike-a/package.json:29:    "tsx": "^4.19.2",
apps/spike-a/package.json:30:    "typescript": "^5.7.2"
rg: package.json: 지정된 파일을 찾을 수 없습니다. (os error 2)
rg: pnpm-workspace.yaml: 지정된 파일을 찾을 수 없습니다. (os error 2)

2026-05-15T03:24:37.000337Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
apps/spike-a/package.json:11:    "migrate": "tsx src/migrate.ts",
apps/spike-a/package.json:12:    "seed": "tsx src/seed.ts",
apps/spike-a/package.json:13:    "scenario:read": "tsx src/scenarios/test-read.ts",
apps/spike-a/package.json:14:    "scenario:write": "tsx src/scenarios/test-write.ts",
apps/spike-a/package.json:15:    "scenario:rollback": "tsx src/scenarios/test-rollback.ts",
apps/spike-a/package.json:16:    "scenario:nested": "tsx src/scenarios/test-nested-tx.ts",
apps/spike-a/package.json:17:    "scenario:audit": "tsx src/scenarios/test-audit.ts",
apps/spike-a/package.json:18:    "scenario:invariant": "tsx src/scenarios/test-invariant-runner.ts",
apps/spike-a/package.json:19:    "scenario:all": "pnpm scenario:read && pnpm scenario:write && pnpm scenario:rollback && pnpm scenario:nested && pnpm scenario:audit && pnpm scenario:invariant",
apps/spike-a/package.json:29:    "tsx": "^4.19.2",
apps/spike-a/package.json:30:    "typescript": "^5.7.2"
rg: package.json: 지정된 파일을 찾을 수 없습니다. (os error 2)
rg: pnpm-workspace.yaml: 지정된 파일을 찾을 수 없습니다. (os error 2)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE EXTENSION|current_setting|CREATE POLICY|GRANT|ALTER DEFAULT|CREATE ROLE|FORCE|UPDATE/DELETE" apps/spike-a/migrations/*.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "withTenantTransaction|set_config|dbTenant|SET LOCAL ROLE|isValidUuid" apps/spike-a/src/tenant.ts apps/spike-a/src/db.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "withServiceRole|INSERT INTO audit_log|return fn|affectedInstanceIds|assert" apps/spike-a/src/service-role.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "readFile|sort|transaction|migrations_applied|sql.raw|INSERT INTO migrations_applied" apps/spike-a/src/migrate.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"INSTANCE_A|main\\(\\)|catch|TRUNCATE\" apps/spike-a/src/seed.ts apps/spike-a/src/scenarios/*.ts" in C:\Users\assag\solution\website-exposure
2026-05-15T03:24:46.759513Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: apps/spike-a/migrations/*.sql: IO error for operation on apps/spike-a/migrations/*.sql: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

 exited 1 in 683ms:
rg: apps/spike-a/migrations/*.sql: IO error for operation on apps/spike-a/migrations/*.sql: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

 succeeded in 679ms:
15:  affectedInstanceIds: string[];
25:export async function withServiceRole<T>(
31:  // (실제 운영은 single audit row with affectedInstanceIds JSON·prototype은 simple)
32:  for (const instanceId of ctx.affectedInstanceIds) {
34:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
52:  return fn();

 succeeded in 723ms:
apps/spike-a/src/tenant.ts:1:// Spike A — withTenantTransaction
apps/spike-a/src/tenant.ts:7://  - dbTenant는 app_tenant_user — RLS 강제 적용
apps/spike-a/src/tenant.ts:11:import { dbTenant } from "./db.ts";
apps/spike-a/src/tenant.ts:17: * fn 안의 tx는 dbTenant transaction. SET LOCAL로 instance_id 설정 → RLS 적용
apps/spike-a/src/tenant.ts:19:export async function withTenantTransaction<T>(
apps/spike-a/src/tenant.ts:23:  if (!isValidUuid(instanceId)) {
apps/spike-a/src/tenant.ts:24:    throw new Error(`withTenantTransaction: invalid instanceId ${instanceId}`);
apps/spike-a/src/tenant.ts:26:  return dbTenant.transaction(async (tx) => {
apps/spike-a/src/tenant.ts:27:    // app_tenant_user는 이미 connection level — SET LOCAL ROLE 불필요
apps/spike-a/src/tenant.ts:28:    // (만약 service_role connection을 재사용한다면 SET LOCAL ROLE app_tenant_user 필요)
apps/spike-a/src/tenant.ts:29:    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
apps/spike-a/src/tenant.ts:35:export function isValidUuid(s: string): boolean {
apps/spike-a/src/db.ts:4://  - dbTenant: pgbouncer transaction pooling (app_tenant_user — RLS 적용)
apps/spike-a/src/db.ts:5://  - dbTenantDirect: direct connection (app_tenant_user — pgbouncer 없이. fallback 비교용)
apps/spike-a/src/db.ts:31:export const dbTenant = drizzle(sqlTenant);

 succeeded in 707ms:
2:import { readFile, readdir } from "node:fs/promises";
14:    .sort();
16:  // migrations_applied tracking table 생성
18:    CREATE TABLE IF NOT EXISTS migrations_applied (
26:      SELECT 1 FROM migrations_applied WHERE filename = ${file}
34:    const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
35:    await dbSuper.execute(sql.raw(content));
37:      INSERT INTO migrations_applied (filename) VALUES (${file})

 exited 1 in 697ms:
apps/spike-a/src/seed.ts:5:export const INSTANCE_A = "11111111-1111-1111-1111-111111111111";
apps/spike-a/src/seed.ts:8:async function main(): Promise<void> {
apps/spike-a/src/seed.ts:10:  await dbSuper.execute(sql`TRUNCATE content_test, audit_log, invariant_log RESTART IDENTITY`);
apps/spike-a/src/seed.ts:16:      VALUES (${INSTANCE_A}::uuid, ${"A-" + i})
apps/spike-a/src/seed.ts:31:      (${INSTANCE_A}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb),
apps/spike-a/src/seed.ts:39:main().catch(async (e) => {
rg: apps/spike-a/src/scenarios/*.ts: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

2026-05-15T03:24:46.838133Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
apps/spike-a/src/seed.ts:5:export const INSTANCE_A = "11111111-1111-1111-1111-111111111111";
apps/spike-a/src/seed.ts:8:async function main(): Promise<void> {
apps/spike-a/src/seed.ts:10:  await dbSuper.execute(sql`TRUNCATE content_test, audit_log, invariant_log RESTART IDENTITY`);
apps/spike-a/src/seed.ts:16:      VALUES (${INSTANCE_A}::uuid, ${"A-" + i})
apps/spike-a/src/seed.ts:31:      (${INSTANCE_A}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb),
apps/spike-a/src/seed.ts:39:main().catch(async (e) => {
rg: apps/spike-a/src/scenarios/*.ts: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE EXTENSION|current_setting|CREATE POLICY|GRANT|ALTER DEFAULT|CREATE ROLE|FORCE|UPDATE/DELETE|app_tenant_user" apps/spike-a/migrations' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "direct query|dbTenant.execute|rollback|current_setting|implicit" apps/spike-a/src/scenarios/test-rollback.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"Promise.all|persistBatch|for \\(const r|ITER|CONCURRENCY|passed|foreign_violations|resultCount\" apps/spike-a/src/scenarios/test-invariant-runner.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "RETURNING|ret as unknown|r3|r4check|DELETE|UPDATE|1000" apps/spike-a/src/scenarios/test-write.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "permission denied|insufficient privilege|append-only|auditA|withServiceRole|affectedInstanceIds|correlationId" apps/spike-a/src/scenarios/test-audit.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scripts|wait-db|pnpm install|\\.env|pnpm scenario|pnpm up\" apps/spike-a/README.md apps/spike-a/package.json apps/spike-a/.env.example apps/spike-a/docker-compose.yml" in C:\Users\assag\solution\website-exposure
 succeeded in 790ms:
apps/spike-a/migrations\004_invariant_log.sql:12:  current_setting_value TEXT,          -- current_setting('app.current_instance_id', true)
apps/spike-a/migrations\004_invariant_log.sql:25:-- app_tenant_user 권한 부여 안 함
apps/spike-a/migrations\003_audit_log.sql:18:-- RLS enable + FORCE
apps/spike-a/migrations\003_audit_log.sql:20:ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;
apps/spike-a/migrations\003_audit_log.sql:23:CREATE POLICY audit_log_read ON audit_log
apps/spike-a/migrations\003_audit_log.sql:24:  FOR SELECT TO app_tenant_user
apps/spike-a/migrations\003_audit_log.sql:25:  USING (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/migrations\003_audit_log.sql:27:-- write: app_tenant_user는 자신의 instance에만 insert 가능 (WITH CHECK)
apps/spike-a/migrations\003_audit_log.sql:28:CREATE POLICY audit_log_write ON audit_log
apps/spike-a/migrations\003_audit_log.sql:29:  FOR INSERT TO app_tenant_user
apps/spike-a/migrations\003_audit_log.sql:30:  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/migrations\003_audit_log.sql:33:-- → app_tenant_user의 UPDATE/DELETE는 RLS에 의해 0 rows affected
apps/spike-a/migrations\003_audit_log.sql:36:GRANT SELECT, INSERT ON audit_log TO app_tenant_user;
apps/spike-a/migrations\003_audit_log.sql:37:-- UPDATE/DELETE 권한 자체를 부여하지 않음 (RLS 외 GRANT level append-only 강화)
apps/spike-a/migrations\001_roles.sql:2:-- app_tenant_user: tenant 작업 전용 user. RLS 적용
apps/spike-a/migrations\001_roles.sql:5:CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT;
apps/spike-a/migrations\001_roles.sql:8:GRANT USAGE ON SCHEMA public TO app_tenant_user;
apps/spike-a/migrations\001_roles.sql:11:ALTER DEFAULT PRIVILEGES IN SCHEMA public
apps/spike-a/migrations\001_roles.sql:12:  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_tenant_user;
apps/spike-a/migrations\001_roles.sql:14:-- ALTER로 BYPASSRLS 명시 — postgres super-user는 BYPASSRLS 기본 true이지만 app_tenant_user는 false
apps/spike-a/migrations\001_roles.sql:15:ALTER ROLE app_tenant_user NOBYPASSRLS;
apps/spike-a/migrations\002_content_test.sql:13:-- RLS enable + FORCE (super-user 외 모든 role에 RLS 적용)
apps/spike-a/migrations\002_content_test.sql:15:ALTER TABLE content_test FORCE ROW LEVEL SECURITY;
apps/spike-a/migrations\002_content_test.sql:17:-- tenant_isolation policy — SELECT/INSERT/UPDATE/DELETE 모두 USING + WITH CHECK
apps/spike-a/migrations\002_content_test.sql:18:-- current_setting('app.current_instance_id', true)의 두 번째 인자 true는 missing_ok (NULL 반환)
apps/spike-a/migrations\002_content_test.sql:19:CREATE POLICY tenant_isolation ON content_test
apps/spike-a/migrations\002_content_test.sql:20:  FOR ALL TO app_tenant_user
apps/spike-a/migrations\002_content_test.sql:21:  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
apps/spike-a/migrations\002_content_test.sql:22:  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/migrations\002_content_test.sql:24:GRANT SELECT, INSERT, UPDATE, DELETE ON content_test TO app_tenant_user;
apps/spike-a/migrations\002_content_test.sql:27:CREATE EXTENSION IF NOT EXISTS pgcrypto;

 succeeded in 761ms:
15:const ITER = Number(process.env.INVARIANT_ITER ?? "1000");
16:const CONCURRENCY = Number(process.env.INVARIANT_CONCURRENCY ?? "20");
27:  resultCount: number;
29:  passed: boolean;
65:        resultCount: result.length,
79:      resultCount: r.resultCount,
81:      passed: r.foreignCount === 0 && r.resultCount === 5,
94:      resultCount: 0,
96:      passed: false,
102:async function persistBatch(rows: LogRow[]): Promise<void> {
105:  for (const r of rows) {
110:        scenario, result_count, foreign_instance_count, passed, error_message
114:        ${r.scenario}, ${r.resultCount}, ${r.foreignInstanceCount}, ${r.passed}, ${r.errorMessage}
122:  console.log(`invariant-runner: runId=${runId} iter=${ITER} concurrency=${CONCURRENCY}`);
129:  for (let iter = 1; iter <= ITER; iter++) {
130:    // CONCURRENCY 개 동시 실행 (각자 random instance 할당)
132:    for (let w = 0; w < CONCURRENCY; w++) {
136:    const results = await Promise.all(promises);
137:    for (const r of results) {
138:      if (!r.passed) failures++;
141:    processed += CONCURRENCY;
145:      await persistBatch(buffer);
150:      console.log(`  iter ${iter}/${ITER} (processed=${processed} failures=${failures})`);
153:  await persistBatch(buffer);
161:      count(*) FILTER (WHERE foreign_instance_count > 0)::int AS foreign_violations,
164:    WHERE run_id = ${runId}::uuid AND passed = false
168:    foreign_violations: number;
175:  console.log(`  foreign instance violations: ${summary?.foreign_violations ?? 0}`);
179:  const passed =
180:    (summary?.foreign_violations ?? 0) === 0 &&
182:  console.log(`invariant-runner: ${passed ? "PASS" : "FAIL"}`);
184:  if (!passed) process.exit(1);

 succeeded in 755ms:
1:// Spike A — Scenario 5: service-role + audit_log RLS·append-only
5:import { withServiceRole } from "../service-role.ts";
16:  const correlationId = randomUUID();
17:  await withServiceRole(
23:      affectedInstanceIds: [INSTANCE_A],
26:      correlationId,
36:  const auditA = await withTenantTransaction(INSTANCE_A, async (tx) => {
42:  results.push({ passed: auditA === 1, detail: `instance-a audit service-role-invoked: ${auditA}` });
53:  // append-only: app_tenant_user는 audit_log UPDATE/DELETE 권한 없음 — GRANT 미부여
63:    passed: /permission denied|insufficient privilege/i.test(updateError),
76:    passed: /permission denied|insufficient privilege/i.test(deleteError),

 succeeded in 779ms:
1:// Spike A — Scenario 2: INSERT/UPDATE/DELETE WITH CHECK
17:      RETURNING id
19:    return (ret as unknown as Array<{ id: string }>).length;
40:  // UPDATE: instance-a context에서 instance-b row update 시도 — 0 rows affected
42:  const r3 = await withTenantTransaction(INSTANCE_A, async (tx) => {
44:      UPDATE content_test SET title = 'hijacked'
48:    return ret as unknown;
52:  const r3check = await withTenantTransaction(INSTANCE_B, async (tx) => {
56:    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? 0;
59:    passed: r3check === 0,
60:    detail: `UPDATE cross-instance — instance-b 'hijacked' rows: ${r3check} (passed if 0)`,
63:  // DELETE: 동일 패턴
65:    await tx.execute(sql`DELETE FROM content_test WHERE instance_id = ${INSTANCE_B}::uuid`);
67:  const r4check = await withTenantTransaction(INSTANCE_B, async (tx) => {
69:    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? 0;
72:    passed: r4check === 5,
73:    detail: `DELETE cross-instance — instance-b row count: ${r4check} (passed if 5)`,

 succeeded in 821ms:
1:// Spike A — Scenario 3: rollback 후 context 누설 검증
3:// SET LOCAL은 transaction commit/rollback 시 자동 해제.
4:// rollback 후 새 transaction에서 context 누설되지 않아야 함.
16:  // 의도적 rollback (transaction 안에서 throw)
17:  let rollbackThrown = false;
21:      throw new Error("intentional rollback");
24:    rollbackThrown = (e as Error).message === "intentional rollback";
26:  results.push({ passed: rollbackThrown, detail: `intentional rollback caught` });
28:  // rollback 후 transaction 밖에서 dbTenant 직접 query — RLS USING 절은 current_instance_id NULL → 0 rows
29:  const directResult = await dbTenant.execute(sql`SELECT count(*)::int AS c FROM content_test`);
33:    detail: `direct query (no tenant context): ${directCount} rows (passed if 0 — RLS reject)`,
43:    detail: `new tx instance-b after rollback: ${newTxRows} rows (passed if 5)`,
50:  console.log(`test-rollback: ${allPassed ? "PASS" : "FAIL"}`);

 succeeded in 764ms:
apps/spike-a/.env.example:1:# Spike A 환경 변수 예시 (실제 .env로 복사 후 사용)
apps/spike-a/package.json:7:  "scripts": {
apps/spike-a/package.json:10:    "wait-db": "node ./scripts/wait-db.js",
apps/spike-a/package.json:19:    "scenario:all": "pnpm scenario:read && pnpm scenario:write && pnpm scenario:rollback && pnpm scenario:nested && pnpm scenario:audit && pnpm scenario:invariant",
apps/spike-a/README.md:26:pnpm up
apps/spike-a/README.md:27:pnpm wait-db
apps/spike-a/README.md:34:pnpm scenario:read
apps/spike-a/README.md:35:pnpm scenario:write
apps/spike-a/README.md:36:pnpm scenario:rollback
apps/spike-a/README.md:37:pnpm scenario:nested
apps/spike-a/README.md:38:pnpm scenario:audit
apps/spike-a/README.md:39:pnpm scenario:invariant
apps/spike-a/README.md:40:# 또는: pnpm scenario:all
apps/spike-a/README.md:46:## 환경 변수 (`.env`)
apps/spike-a/README.md:48:`.env.example` 복사:
apps/spike-a/README.md:80:└── scripts/wait-db.js

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"from \\\"../seed.ts\\\"|from './seed.ts'|INSTANCE_A\" apps/spike-a/src/scenarios apps/spike-a/src/seed.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE EXTENSION|gen_random_uuid|CREATE TABLE content_test|DEFAULT gen_random_uuid" apps/spike-a/migrations/002_content_test.sql apps/spike-a/migrations/003_audit_log.sql apps/spike-a/migrations/004_invariant_log.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE ROLE|CREATE DATABASE|app_tenant_pw|AUTH_TYPE|DATABASE_URL|pgbouncer|SCRAM|scram" apps/spike-a/docker-compose.yml apps/spike-a/migrations/001_roles.sql apps/spike-a/.env.example' in C:\Users\assag\solution\website-exposure
2026-05-15T03:25:05.923078Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:from \)
    ^
error: unclosed group

 exited 1 in 612ms:
rg: regex parse error:
    (?:from \)
    ^
error: unclosed group

 succeeded in 606ms:
apps/spike-a/migrations/004_invariant_log.sql:5:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
apps/spike-a/migrations/003_audit_log.sql:6:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
apps/spike-a/migrations/002_content_test.sql:3:CREATE TABLE content_test (
apps/spike-a/migrations/002_content_test.sql:4:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
apps/spike-a/migrations/002_content_test.sql:26:-- gen_random_uuid 위한 pgcrypto
apps/spike-a/migrations/002_content_test.sql:27:CREATE EXTENSION IF NOT EXISTS pgcrypto;

 succeeded in 626ms:
apps/spike-a/.env.example:4:DATABASE_URL_SUPER=postgres://postgres:postgres@localhost:5433/spike_a
apps/spike-a/.env.example:6:# Tenant connection via pgbouncer (transaction pooling) — RLS 적용
apps/spike-a/.env.example:7:DATABASE_URL_TENANT=postgres://app_tenant_user:app_tenant_pw@localhost:6433/spike_a
apps/spike-a/.env.example:10:DATABASE_URL_SERVICE_ROLE=postgres://postgres:postgres@localhost:5433/spike_a
apps/spike-a/migrations/001_roles.sql:5:CREATE ROLE app_tenant_user LOGIN PASSWORD 'app_tenant_pw' NOINHERIT;
apps/spike-a/docker-compose.yml:23:  pgbouncer:
apps/spike-a/docker-compose.yml:24:    image: edoburu/pgbouncer:1.23.1
apps/spike-a/docker-compose.yml:25:    container_name: spike-a-pgbouncer
apps/spike-a/docker-compose.yml:30:      DATABASE_URL: postgres://postgres:postgres@postgres:5432/spike_a
apps/spike-a/docker-compose.yml:34:      AUTH_TYPE: scram-sha-256
apps/spike-a/docker-compose.yml:37:      - "6433:5432"   # 호스트 6433 → pgbouncer (transaction pooling)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'from \"../seed\\.ts\"|INSTANCE_A|main\\(\\)\\.catch' apps/spike-a/src/scenarios apps/spike-a/src/seed.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"current_setting\\('app.current_instance_id', true\\)::uuid|invalid instanceId|malformed|isValidUuid|set_config\" apps/spike-a/src apps/spike-a/migrations" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "schema-per-tenant|SQL injection|injection|runtime guard|scopedDb|malformed|performance|p50|p95|Supabase|Pooler|auth.uid|SET LOCAL ROLE" apps/spike-a/src apps/spike-a/README.md apps/spike-a/migrations' in C:\Users\assag\solution\website-exposure
 succeeded in 624ms:
apps/spike-a/src/seed.ts:5:export const INSTANCE_A = "11111111-1111-1111-1111-111111111111";
apps/spike-a/src/seed.ts:16:      VALUES (${INSTANCE_A}::uuid, ${"A-" + i})
apps/spike-a/src/seed.ts:31:      (${INSTANCE_A}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb),
apps/spike-a/src/seed.ts:39:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-write.ts:5:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-write.ts:13:  const r1 = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-write.ts:16:      VALUES (${INSTANCE_A}::uuid, 'A-self-insert')
apps/spike-a/src/scenarios\test-write.ts:26:    await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-write.ts:42:  const r3 = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-write.ts:64:  await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-write.ts:86:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-rollback.ts:9:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-rollback.ts:19:    await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-rollback.ts:55:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-read.ts:5:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-read.ts:13:  const aRows = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-read.ts:18:    passed: aRows.length === 5 && aRows.every((r) => r.instance_id === INSTANCE_A),
apps/spike-a/src/scenarios\test-read.ts:50:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-nested-tx.ts:6:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-nested-tx.ts:14:  await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-nested-tx.ts:49:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-invariant-runner.ts:12:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-invariant-runner.ts:133:      const expected = w % 2 === 0 ? INSTANCE_A : INSTANCE_B;
apps/spike-a/src/scenarios\test-invariant-runner.ts:187:main().catch(async (e) => {
apps/spike-a/src/scenarios\test-audit.ts:7:import { INSTANCE_A, INSTANCE_B } from "../seed.ts";
apps/spike-a/src/scenarios\test-audit.ts:23:      affectedInstanceIds: [INSTANCE_A],
apps/spike-a/src/scenarios\test-audit.ts:36:  const auditA = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-audit.ts:56:    await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-audit.ts:57:      await tx.execute(sql`UPDATE audit_log SET action = 'tampered' WHERE instance_id = ${INSTANCE_A}::uuid`);
apps/spike-a/src/scenarios\test-audit.ts:69:    await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-audit.ts:70:      await tx.execute(sql`DELETE FROM audit_log WHERE instance_id = ${INSTANCE_A}::uuid`);
apps/spike-a/src/scenarios\test-audit.ts:81:  const allA = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps/spike-a/src/scenarios\test-audit.ts:85:  const foreignFromA = allA.filter((r) => r.instance_id !== INSTANCE_A).length;
apps/spike-a/src/scenarios\test-audit.ts:100:main().catch(async (e) => {

 succeeded in 611ms:
apps/spike-a/migrations\003_audit_log.sql:25:  USING (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/migrations\003_audit_log.sql:30:  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/migrations\002_content_test.sql:21:  USING (instance_id = current_setting('app.current_instance_id', true)::uuid)
apps/spike-a/migrations\002_content_test.sql:22:  WITH CHECK (instance_id = current_setting('app.current_instance_id', true)::uuid);
apps/spike-a/src\tenant.ts:23:  if (!isValidUuid(instanceId)) {
apps/spike-a/src\tenant.ts:24:    throw new Error(`withTenantTransaction: invalid instanceId ${instanceId}`);
apps/spike-a/src\tenant.ts:29:    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
apps/spike-a/src\tenant.ts:35:export function isValidUuid(s: string): boolean {

 succeeded in 605ms:
apps/spike-a/src\tenant.ts:27:    // app_tenant_user는 이미 connection level — SET LOCAL ROLE 불필요
apps/spike-a/src\tenant.ts:28:    // (만약 service_role connection을 재사용한다면 SET LOCAL ROLE app_tenant_user 필요)

codex
{
  "review_id": "spike-a-prototype-review-1",
  "target": "apps/spike-a",
  "verdict": "INCONCLUSIVE",
  "ready_for_acceptance": false,
  "summary": {
    "blocking": 4,
    "major": 10,
    "minor": 5,
    "notes": [
      "코드 구조는 Spike A의 주요 축을 대체로 담고 있지만, 현재 상태로는 acceptance를 증명하지 못한다.",
      "특히 migration 권한 모델, seed import side effect, invariant runner 판정식이 실제 실행/판정 신뢰도를 깨뜨린다.",
      "typecheck는 실행 시도했으나 로컬 의존성이 없어 실패했다: `tsc is not recognized`."
    ]
  },
  "findings": [
    {
      "id": "SPIKEA1-001",
      "severity": "blocking",
      "category": "execution-correctness",
      "title": "시나리오들이 `seed.ts`를 import하는 순간 seed main이 실행된다",
      "evidence": [
        "apps/spike-a/src/seed.ts:39",
        "apps/spike-a/src/scenarios/test-read.ts:5",
        "apps/spike-a/src/scenarios/test-write.ts:5",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:12"
      ],
      "problem": "`INSTANCE_A/B` 상수를 가져오기 위해 `seed.ts`를 import하지만, `seed.ts` 하단의 `main().catch(...)`가 import 시점에 실행된다. 각 scenario 실행 중 `TRUNCATE content_test, audit_log, invariant_log`와 `closeAll()`이 백그라운드로 돌 수 있다.",
      "impact": "테스트 데이터가 시나리오 중간에 초기화되거나 DB pool이 닫혀 false pass/false fail이 발생한다. 현재 scenario 결과는 신뢰할 수 없다.",
      "recommendation": "fixture 상수는 별도 `fixtures.ts`로 분리하고, `seed.ts`는 `if (import.meta.url === pathToFileURL(process.argv[1]).href)` 형태로 CLI 실행 시에만 `main()`을 호출하라."
    },
    {
      "id": "SPIKEA1-002",
      "severity": "blocking",
      "category": "sql-migration",
      "title": "`ALTER DEFAULT PRIVILEGES`가 audit_log append-only와 invariant_log super-user-only를 깨뜨린다",
      "evidence": [
        "apps/spike-a/migrations/001_roles.sql:11",
        "apps/spike-a/migrations/001_roles.sql:12",
        "apps/spike-a/migrations/003_audit_log.sql:36",
        "apps/spike-a/migrations/004_invariant_log.sql:25"
      ],
      "problem": "001에서 future tables 전체에 `SELECT, INSERT, UPDATE, DELETE`를 app_tenant_user에게 부여한다. 이후 생성되는 `audit_log`와 `invariant_log`에도 UPDATE/DELETE 및 접근 권한이 자동 부여될 수 있다. 003의 'UPDATE/DELETE 권한 자체를 부여하지 않음', 004의 'app_tenant_user 권한 부여 안 함' 주석은 실제 권한 모델과 충돌한다.",
      "impact": "audit append-only 검증은 GRANT 레벨 안전망이 아니라 RLS no-policy에만 의존하게 된다. invariant_log도 tenant user가 접근 가능한 테이블이 될 수 있어 측정 metadata 격리 가정이 깨진다.",
      "recommendation": "전역 default grant를 제거하거나 최소화하라. 각 tenant table에 명시 GRANT를 부여하고, `audit_log`는 `REVOKE UPDATE, DELETE`, `invariant_log`는 `REVOKE ALL FROM app_tenant_user`를 migration에서 명시 검증하라."
    },
    {
      "id": "SPIKEA1-003",
      "severity": "blocking",
      "category": "sql-migration",
      "title": "`gen_random_uuid()` 확장이 테이블 생성 뒤에 생성된다",
      "evidence": [
        "apps/spike-a/migrations/002_content_test.sql:4",
        "apps/spike-a/migrations/002_content_test.sql:27",
        "apps/spike-a/migrations/003_audit_log.sql:6",
        "apps/spike-a/migrations/004_invariant_log.sql:5"
      ],
      "problem": "`content_test.id DEFAULT gen_random_uuid()`가 먼저 선언되고 `CREATE EXTENSION IF NOT EXISTS pgcrypto`는 파일 끝에 있다.",
      "impact": "깨끗한 Postgres에서 `pgcrypto`가 사전 설치되어 있지 않으면 002 migration이 실패할 수 있다. 그러면 나머지 migration과 시나리오 전체가 실행 불가다.",
      "recommendation": "001 또는 002 최상단에서 `CREATE EXTENSION IF NOT EXISTS pgcrypto;`를 먼저 실행하라."
    },
    {
      "id": "SPIKEA1-004",
      "severity": "blocking",
      "category": "scenario-measurement",
      "title": "invariant runner 최종 PASS 조건이 `total_failures`를 무시한다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:79",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:81",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:161",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:179"
      ],
      "problem": "각 row는 `foreignCount === 0 && resultCount === 5`일 때만 passed인데, 최종 판정은 `foreign_violations === 0 && errors === 0`만 본다. `resultCount !== 5`로 failed 처리된 행은 `total_failures`에 잡히지만 최종 PASS를 막지 못한다.",
      "impact": "모든 query가 0 rows를 반환해도 foreign violation/error가 없으면 PASS가 될 수 있다. SELECT 격리 acceptance를 증명하지 못한다.",
      "recommendation": "최종 조건에 `total_failures === 0`과 `processed === ITER * CONCURRENCY`를 포함하라."
    },
    {
      "id": "SPIKEA1-005",
      "severity": "major",
      "category": "tenant-core",
      "title": "`withTenantTransaction`이 `SET LOCAL ROLE`을 하지 않아 service-role DSN 오배선에 취약하다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:26",
        "apps/spike-a/src/tenant.ts:27",
        "apps/spike-a/src/tenant.ts:29",
        "docs/decisions/INFRA_DECISIONS_DRAFT.md §1.1"
      ],
      "problem": "SoT는 service_role connection 사용 시에도 RLS를 강제하기 위해 `SET LOCAL ROLE app_tenant` 패턴을 명시한다. 현재 prototype은 `DATABASE_URL_TENANT`가 app_tenant_user라는 환경 가정에만 의존한다.",
      "impact": "env 실수로 tenant DSN이 postgres/service-role을 바라보면 RLS bypass가 발생하고, prototype은 이를 잡지 못한다.",
      "recommendation": "role 이름을 `SELECT current_user`로 assert하거나, SoT와 맞게 transaction 안에서 `SET LOCAL ROLE app_tenant_user`를 적용하는 별도 검증 시나리오를 추가하라."
    },
    {
      "id": "SPIKEA1-006",
      "severity": "major",
      "category": "sql-rls",
      "title": "missing tenant context가 throw가 아니라 silent 0 rows로 처리된다",
      "evidence": [
        "apps/spike-a/migrations/002_content_test.sql:21",
        "apps/spike-a/migrations/003_audit_log.sql:25",
        "apps/spike-a/src/scenarios/test-rollback.ts:28",
        "apps/spike-a/src/scenarios/test-rollback.ts:32"
      ],
      "problem": "`current_setting('app.current_instance_id', true)::uuid`는 설정이 없을 때 NULL 비교가 되어 SELECT는 0 rows를 반환한다. Spike 계획에는 runtime guard와 malformed UUID fail 검증이 포함되어 있는데, 현재는 missing context를 실패가 아닌 정상 0 rows로 수용한다.",
      "impact": "tx 밖 scoped DB 사용이 조용히 빈 결과로 숨겨져 운영 버그를 늦게 발견할 수 있다.",
      "recommendation": "운영용 helper에는 runtime guard를 두고, 테스트는 `current_setting` missing, empty string, malformed UUID를 각각 검증하라. RLS policy 자체는 deny-by-null로 두더라도 application guard는 throw해야 한다."
    },
    {
      "id": "SPIKEA1-007",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "write 시나리오가 acceptance의 1000회 반복과 UPDATE WITH CHECK 변형을 검증하지 않는다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-write.ts:13",
        "apps/spike-a/src/scenarios/test-write.ts:26",
        "apps/spike-a/src/scenarios/test-write.ts:42",
        "apps/spike-a/src/scenarios/test-write.ts:64"
      ],
      "problem": "INSERT/UPDATE/DELETE cross-instance 시도는 각각 1회만 수행된다. UPDATE는 foreign row target 0 rows만 확인하고, 자기 row의 `instance_id`를 다른 tenant로 바꾸는 `WITH CHECK` reject를 검증하지 않는다.",
      "impact": "A.3의 `1000 iter` 쓰기 격리와 `WITH CHECK` 의미를 충분히 증명하지 못한다.",
      "recommendation": "write invariant runner를 별도로 두고, `UPDATE content_test SET instance_id = INSTANCE_B WHERE instance_id = INSTANCE_A RETURNING id`가 reject되는지 반복 검증하라."
    },
    {
      "id": "SPIKEA1-008",
      "severity": "major",
      "category": "service-role",
      "title": "`withServiceRole`에 break-glass authorization guard가 없다",
      "evidence": [
        "apps/spike-a/src/service-role.ts:25",
        "apps/spike-a/src/service-role.ts:32",
        "apps/spike-a/src/service-role.ts:52"
      ],
      "problem": "SoT의 `assertBreakGlassAllowed`에 해당하는 env/route/role/ticket 검증이 없다. 감사 insert만 하고 곧바로 `fn()`을 실행한다.",
      "impact": "prototype이 service-role 사용 감사는 일부 검증하지만, service-role 격리와 오용 차단 가설은 검증하지 못한다.",
      "recommendation": "최소 prototype guard라도 `actorRole`, `ticketRef`, `reasonCode`, allowlisted function name, non-prod/prod env policy를 assert하고 negative test를 추가하라."
    },
    {
      "id": "SPIKEA1-009",
      "severity": "major",
      "category": "service-role",
      "title": "service-role audit가 사용 결과와 1:1 의미를 보장하지 않는다",
      "evidence": [
        "apps/spike-a/src/service-role.ts:31",
        "apps/spike-a/src/service-role.ts:32",
        "apps/spike-a/src/service-role.ts:52",
        "apps/spike-a/src/scenarios/test-audit.ts:17"
      ],
      "problem": "audit는 service-role 실행 전에 affected instance별 N건으로 insert된다. `fn()`이 실패해도 outcome이 기록되지 않고, affectedInstanceIds가 여러 개면 '한 번의 service-role 사용 = audit 1건' 기준과 어긋난다.",
      "impact": "A.3의 `service_role audit 사용 횟수 = audit insert 횟수 (1:1)`을 명확히 증명하지 못한다.",
      "recommendation": "단일 invocation audit row에 `affectedInstanceIds`, `status`, `errorClass`, `startedAt/finishedAt`을 넣거나, per-instance 감사라면 acceptance 기준도 per-instance로 바꿔라."
    },
    {
      "id": "SPIKEA1-010",
      "severity": "major",
      "category": "migration-runner",
      "title": "migration runner가 migration 단위 원자성·checksum·concurrency를 보장하지 않는다",
      "evidence": [
        "apps/spike-a/src/migrate.ts:14",
        "apps/spike-a/src/migrate.ts:18",
        "apps/spike-a/src/migrate.ts:35",
        "apps/spike-a/src/migrate.ts:37"
      ],
      "problem": "파일명 sort + `migrations_applied(filename)`만 사용한다. migration SQL과 applied row insert가 한 transaction으로 묶이지 않고, checksum/version conflict/advisory lock이 없다.",
      "impact": "중간 실패 시 partial schema가 남고 재실행이 충돌할 수 있다. 동시 migration도 중복 적용 위험이 있다.",
      "recommendation": "각 파일을 transaction으로 감싸고, advisory lock, checksum, dirty state 기록을 추가하라. rollback은 forward-only 정책이라도 실패 복구 runbook이 필요하다."
    },
    {
      "id": "SPIKEA1-011",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "malformed UUID 시나리오가 없다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:23",
        "apps/spike-a/src/tenant.ts:35",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.2 scenario 5"
      ],
      "problem": "helper의 regex validation은 있지만, malformed UUID 입력에 대한 scenario가 없다. SQL-level `current_setting(...)::uuid`가 malformed setting에서 실패하는지도 검증하지 않는다.",
      "impact": "A.2의 명시 시나리오가 미충족이다.",
      "recommendation": "`withTenantTransaction('not-a-uuid')` negative test와 raw `set_config('app.current_instance_id','bad',true)` 후 tenant table query fail test를 분리하라."
    },
    {
      "id": "SPIKEA1-012",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "runtime guard/scopedDb tx 밖 사용 검증이 없다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:19",
        "apps/spike-a/src/scenarios/test-rollback.ts:29",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.2 scenario 8"
      ],
      "problem": "prototype은 `ScopedDb` wrapper가 없고 tx 밖 사용 시 throw하는 runtime guard도 없다. rollback test는 오히려 `dbTenant.execute` direct query가 0 rows면 PASS로 본다.",
      "impact": "본 구현에서 가장 중요한 사용 규약인 'tenant table 접근은 helper 안에서만'을 검증하지 못한다.",
      "recommendation": "prototype에도 최소 `scopedDbFromTx` token/brand wrapper를 만들고, direct tenant table access negative test를 추가하라."
    },
    {
      "id": "SPIKEA1-013",
      "severity": "major",
      "category": "provider-gap",
      "title": "Supabase Pooler smoke gate와 prototype pgbouncer 차이가 정리되지 않았다",
      "evidence": [
        "apps/spike-a/docker-compose.yml:23",
        "apps/spike-a/docker-compose.yml:31",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §0.3",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A"
      ],
      "problem": "local pgbouncer transaction pooling은 구성되어 있지만 Supabase Pooler의 transaction mode, role switching, prepared statement behavior, GUC reset semantics에 대한 provider smoke script/report가 없다.",
      "impact": "local PASS가 provider PASS로 승격될 수 없다. Day 9 gate 대비 산출물이 부족하다.",
      "recommendation": "Supabase dev DB 대상으로 같은 `SET LOCAL`, rollback, direct query, invariant runner를 실행하는 provider profile을 분리하라."
    },
    {
      "id": "SPIKEA1-014",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "schema-per-tenant fallback, SQL injection, service-role env mistake, perf p50/p95 시나리오가 누락됐다",
      "evidence": [
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.3",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.4",
        "apps/spike-a/src/scenarios"
      ],
      "problem": "요청 항목의 fallback 호환성, raw input injection 시도, service-role DSN/client context 오배선, withTenantTransaction overhead p50/p95 측정이 구현되어 있지 않다.",
      "impact": "correctness 핵심 일부는 검증하지만 production decision에 필요한 reversal/fallback 판단 자료가 부족하다.",
      "recommendation": "coverage gap을 Spike A result에 명시하고, 최소 perf baseline과 env mistake negative test는 A-provider 전까지 추가하라."
    },
    {
      "id": "SPIKEA1-015",
      "severity": "minor",
      "category": "sql-rls",
      "title": "audit_log append-only 주석이 실제 RLS 동작을 부정확하게 설명한다",
      "evidence": [
        "apps/spike-a/migrations/003_audit_log.sql:33",
        "apps/spike-a/src/scenarios/test-audit.ts:63",
        "apps/spike-a/src/scenarios/test-audit.ts:76"
      ],
      "problem": "정책이 없으면 RLS는 UPDATE/DELETE를 에러가 아니라 0 rows affected로 만들 수 있다. 반면 test는 permission denied/insufficient privilege 에러를 기대한다.",
      "impact": "GRANT 상태에 따라 테스트 기대값이 흔들린다.",
      "recommendation": "append-only acceptance를 두 층으로 나눠라: 권한 없음이면 permission error, 권한이 있어도 no policy면 0 rows affected. 둘 중 어느 안전망을 의도하는지 SQL로 고정하라."
    },
    {
      "id": "SPIKEA1-016",
      "severity": "minor",
      "category": "db-options",
      "title": "postgres-js pool option은 prototype에는 충분하지만 운영 판단 자료가 부족하다",
      "evidence": [
        "apps/spike-a/src/db.ts:15",
        "apps/spike-a/src/db.ts:25",
        "apps/spike-a/src/db.ts:35"
      ],
      "problem": "`prepare:false`는 맞다. 다만 `idle_timeout`, `connect_timeout`, query timeout/debug/correlation logging이 없어 hang/latency 분석이 어렵다.",
      "impact": "correctness 자체의 blocker는 아니지만, pgbouncer/Supabase 비교 때 문제 원인 식별이 어렵다.",
      "recommendation": "prototype에는 `idle_timeout`/`connect_timeout`과 선택적 debug logger를 추가하고, 운영 SoT에는 `statement_timeout`과 역할별 pool size를 별도 명시하라."
    },
    {
      "id": "SPIKEA1-017",
      "severity": "minor",
      "category": "type-safety",
      "title": "`(e as Error).message` 패턴이 unknown catch에 안전하지 않다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-write.ts:32",
        "apps/spike-a/src/scenarios/test-rollback.ts:24",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:97"
      ],
      "problem": "`useUnknownInCatchVariables`를 켰지만 대부분 catch에서 강제 cast한다. thrown value가 Error가 아니면 message가 undefined가 된다.",
      "impact": "테스트 실패 메시지 판정이 false negative/false positive가 될 수 있다.",
      "recommendation": "`errorMessage(e: unknown): string` helper로 `e instanceof Error ? e.message : String(e)`를 통일하라."
    },
    {
      "id": "SPIKEA1-018",
      "severity": "minor",
      "category": "readme-runnability",
      "title": "README 실행 순서에 dependency install/env loading 전제가 빠져 있다",
      "evidence": [
        "apps/spike-a/README.md:26",
        "apps/spike-a/README.md:48",
        "apps/spike-a/package.json:29",
        "apps/spike-a/package.json:30"
      ],
      "problem": "현재 workspace에는 root `package.json`/`pnpm-workspace.yaml`이 없고, `pnpm --dir apps/spike-a typecheck`는 `tsc` 미설치로 실패했다. README는 `pnpm install` 위치와 `.env` 로딩 방식이 명확하지 않다.",
      "impact": "새 환경에서 README 그대로 실행하면 실패할 가능성이 높다.",
      "recommendation": "`cd apps/spike-a && pnpm install` 및 PowerShell `.env` 로딩 방법 또는 `dotenv-cli` 사용을 README에 추가하라."
    },
    {
      "id": "SPIKEA1-019",
      "severity": "minor",
      "category": "security-hygiene",
      "title": "prototype secret은 허용 가능하지만 production 오용 방지 문구가 부족하다",
      "evidence": [
        "apps/spike-a/migrations/001_roles.sql:5",
        "apps/spike-a/.env.example:7"
      ],
      "problem": "`app_tenant_pw`가 migration과 env example에 고정되어 있다. local spike로는 괜찮지만 README에 local-only secret임을 강하게 표시하지 않는다.",
      "impact": "prototype 코드가 본 구현으로 승격될 때 credential handling이 그대로 복사될 위험이 있다.",
      "recommendation": "README와 migration 주석에 local-only를 명시하고, 본 구현에서는 provider secret manager/generated password를 사용한다고 적어라."
    }
  ],
  "answers_to_requested_checks": {
    "sql_migration": {
      "001_roles": "NOBYPASSRLS와 LOGIN은 맞지만, broad default privileges가 가장 위험하다. audit_log/invariant_log 의도와 충돌한다. GRANT CONNECT는 기본 PUBLIC이 살아 있으면 보통 문제 없지만, hardened DB에서는 명시 필요할 수 있다.",
      "002_content_test": "RLS/FORCE/USING/WITH CHECK 방향은 맞다. 다만 `CREATE EXTENSION pgcrypto` 순서가 잘못됐고, missing GUC는 silent deny, malformed GUC는 cast error로 동작이 다르다. 두 경우를 별도 테스트해야 한다.",
      "003_audit_log": "SELECT/INSERT policy는 맞다. UPDATE/DELETE policy 없음은 RLS 안전망이지만, GRANT 안전망은 001 default privileges 때문에 깨질 수 있다. GRANT가 빠지면 permission error, RLS가 빠지면 권한 보유 시 tamper 가능하다.",
      "004_invariant_log": "app_tenant_user GRANT 미부여 의도는 맞지만 001 default privileges 때문에 충분하지 않다. 명시 `REVOKE ALL`이 필요하다."
    },
    "ts_core": {
      "tenant": "`prepare:false`와 transaction-local `set_config(..., true)`는 방향이 맞다. 그러나 `SET LOCAL ROLE`/current_user assert가 없어 DSN 오배선 방어가 없다.",
      "db": "pgbouncer transaction pooling에서 `prepare:false`는 필수이고 적용되어 있다. timeout/debug/structured logging은 production smoke 분석용으로 부족하다.",
      "service_role": "감사 insert before-use는 시도 자체 감사에는 유리하지만 outcome이 빠진다. affected instance별 insert는 prototype 단순화로 가능하나 1:1 기준을 흐린다.",
      "migrate": "파일 sort만으로는 version conflict, checksum, advisory lock, partial failure를 다루지 못한다."
    },
    "scenario_measurement": {
      "test_write": "`RETURNING id` length 판단은 대체로 가능하지만, 현재 seed import bug 때문에 신뢰할 수 없다. 1000회 반복과 UPDATE WITH CHECK 변형이 없다.",
      "test_rollback": "direct query는 autocommit transaction으로 실행될 가능성이 크며 rollback leak smoke로는 의미가 있다. 다만 runtime guard 검증은 아니다.",
      "test_invariant_runner": "20 concurrent는 `Promise.all`로 실제 20개 동시 요청을 만든다. pool size와 맞지만 최종 PASS 조건이 틀렸고 batch insert가 N+1이다.",
      "test_audit": "에러 메시지 regex 자체는 현실적인 편이나, 실제 권한 상태가 default privileges 때문에 의도와 다를 수 있다."
    },
    "production_gap": {
      "supabase_pooler": "아직 provider smoke가 없다. local pgbouncer와 Supabase Pooler 차이를 별도 gate에서 검증해야 한다.",
      "supabase_rls_policy": "Postgres RLS 문법 자체는 동일하지만 role/auth integration과 pooler behavior가 다르다.",
      "auth_uid_vs_set_config": "prototype은 Supabase Auth `auth.uid()`를 쓰지 않고 custom GUC를 쓴다. next-auth 기반 SoT와는 맞지만 Supabase 기본 auth RLS 예제와는 다른 모델임을 provider report에 명시해야 한다."
    },
    "verification_attempted": {
      "typecheck": "failed_to_run",
      "reason": "`pnpm --dir apps/spike-a typecheck` failed because `tsc` is not installed/available in this workspace."
    }
  }
}
tokens used
96,371
{
  "review_id": "spike-a-prototype-review-1",
  "target": "apps/spike-a",
  "verdict": "INCONCLUSIVE",
  "ready_for_acceptance": false,
  "summary": {
    "blocking": 4,
    "major": 10,
    "minor": 5,
    "notes": [
      "코드 구조는 Spike A의 주요 축을 대체로 담고 있지만, 현재 상태로는 acceptance를 증명하지 못한다.",
      "특히 migration 권한 모델, seed import side effect, invariant runner 판정식이 실제 실행/판정 신뢰도를 깨뜨린다.",
      "typecheck는 실행 시도했으나 로컬 의존성이 없어 실패했다: `tsc is not recognized`."
    ]
  },
  "findings": [
    {
      "id": "SPIKEA1-001",
      "severity": "blocking",
      "category": "execution-correctness",
      "title": "시나리오들이 `seed.ts`를 import하는 순간 seed main이 실행된다",
      "evidence": [
        "apps/spike-a/src/seed.ts:39",
        "apps/spike-a/src/scenarios/test-read.ts:5",
        "apps/spike-a/src/scenarios/test-write.ts:5",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:12"
      ],
      "problem": "`INSTANCE_A/B` 상수를 가져오기 위해 `seed.ts`를 import하지만, `seed.ts` 하단의 `main().catch(...)`가 import 시점에 실행된다. 각 scenario 실행 중 `TRUNCATE content_test, audit_log, invariant_log`와 `closeAll()`이 백그라운드로 돌 수 있다.",
      "impact": "테스트 데이터가 시나리오 중간에 초기화되거나 DB pool이 닫혀 false pass/false fail이 발생한다. 현재 scenario 결과는 신뢰할 수 없다.",
      "recommendation": "fixture 상수는 별도 `fixtures.ts`로 분리하고, `seed.ts`는 `if (import.meta.url === pathToFileURL(process.argv[1]).href)` 형태로 CLI 실행 시에만 `main()`을 호출하라."
    },
    {
      "id": "SPIKEA1-002",
      "severity": "blocking",
      "category": "sql-migration",
      "title": "`ALTER DEFAULT PRIVILEGES`가 audit_log append-only와 invariant_log super-user-only를 깨뜨린다",
      "evidence": [
        "apps/spike-a/migrations/001_roles.sql:11",
        "apps/spike-a/migrations/001_roles.sql:12",
        "apps/spike-a/migrations/003_audit_log.sql:36",
        "apps/spike-a/migrations/004_invariant_log.sql:25"
      ],
      "problem": "001에서 future tables 전체에 `SELECT, INSERT, UPDATE, DELETE`를 app_tenant_user에게 부여한다. 이후 생성되는 `audit_log`와 `invariant_log`에도 UPDATE/DELETE 및 접근 권한이 자동 부여될 수 있다. 003의 'UPDATE/DELETE 권한 자체를 부여하지 않음', 004의 'app_tenant_user 권한 부여 안 함' 주석은 실제 권한 모델과 충돌한다.",
      "impact": "audit append-only 검증은 GRANT 레벨 안전망이 아니라 RLS no-policy에만 의존하게 된다. invariant_log도 tenant user가 접근 가능한 테이블이 될 수 있어 측정 metadata 격리 가정이 깨진다.",
      "recommendation": "전역 default grant를 제거하거나 최소화하라. 각 tenant table에 명시 GRANT를 부여하고, `audit_log`는 `REVOKE UPDATE, DELETE`, `invariant_log`는 `REVOKE ALL FROM app_tenant_user`를 migration에서 명시 검증하라."
    },
    {
      "id": "SPIKEA1-003",
      "severity": "blocking",
      "category": "sql-migration",
      "title": "`gen_random_uuid()` 확장이 테이블 생성 뒤에 생성된다",
      "evidence": [
        "apps/spike-a/migrations/002_content_test.sql:4",
        "apps/spike-a/migrations/002_content_test.sql:27",
        "apps/spike-a/migrations/003_audit_log.sql:6",
        "apps/spike-a/migrations/004_invariant_log.sql:5"
      ],
      "problem": "`content_test.id DEFAULT gen_random_uuid()`가 먼저 선언되고 `CREATE EXTENSION IF NOT EXISTS pgcrypto`는 파일 끝에 있다.",
      "impact": "깨끗한 Postgres에서 `pgcrypto`가 사전 설치되어 있지 않으면 002 migration이 실패할 수 있다. 그러면 나머지 migration과 시나리오 전체가 실행 불가다.",
      "recommendation": "001 또는 002 최상단에서 `CREATE EXTENSION IF NOT EXISTS pgcrypto;`를 먼저 실행하라."
    },
    {
      "id": "SPIKEA1-004",
      "severity": "blocking",
      "category": "scenario-measurement",
      "title": "invariant runner 최종 PASS 조건이 `total_failures`를 무시한다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:79",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:81",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:161",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:179"
      ],
      "problem": "각 row는 `foreignCount === 0 && resultCount === 5`일 때만 passed인데, 최종 판정은 `foreign_violations === 0 && errors === 0`만 본다. `resultCount !== 5`로 failed 처리된 행은 `total_failures`에 잡히지만 최종 PASS를 막지 못한다.",
      "impact": "모든 query가 0 rows를 반환해도 foreign violation/error가 없으면 PASS가 될 수 있다. SELECT 격리 acceptance를 증명하지 못한다.",
      "recommendation": "최종 조건에 `total_failures === 0`과 `processed === ITER * CONCURRENCY`를 포함하라."
    },
    {
      "id": "SPIKEA1-005",
      "severity": "major",
      "category": "tenant-core",
      "title": "`withTenantTransaction`이 `SET LOCAL ROLE`을 하지 않아 service-role DSN 오배선에 취약하다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:26",
        "apps/spike-a/src/tenant.ts:27",
        "apps/spike-a/src/tenant.ts:29",
        "docs/decisions/INFRA_DECISIONS_DRAFT.md §1.1"
      ],
      "problem": "SoT는 service_role connection 사용 시에도 RLS를 강제하기 위해 `SET LOCAL ROLE app_tenant` 패턴을 명시한다. 현재 prototype은 `DATABASE_URL_TENANT`가 app_tenant_user라는 환경 가정에만 의존한다.",
      "impact": "env 실수로 tenant DSN이 postgres/service-role을 바라보면 RLS bypass가 발생하고, prototype은 이를 잡지 못한다.",
      "recommendation": "role 이름을 `SELECT current_user`로 assert하거나, SoT와 맞게 transaction 안에서 `SET LOCAL ROLE app_tenant_user`를 적용하는 별도 검증 시나리오를 추가하라."
    },
    {
      "id": "SPIKEA1-006",
      "severity": "major",
      "category": "sql-rls",
      "title": "missing tenant context가 throw가 아니라 silent 0 rows로 처리된다",
      "evidence": [
        "apps/spike-a/migrations/002_content_test.sql:21",
        "apps/spike-a/migrations/003_audit_log.sql:25",
        "apps/spike-a/src/scenarios/test-rollback.ts:28",
        "apps/spike-a/src/scenarios/test-rollback.ts:32"
      ],
      "problem": "`current_setting('app.current_instance_id', true)::uuid`는 설정이 없을 때 NULL 비교가 되어 SELECT는 0 rows를 반환한다. Spike 계획에는 runtime guard와 malformed UUID fail 검증이 포함되어 있는데, 현재는 missing context를 실패가 아닌 정상 0 rows로 수용한다.",
      "impact": "tx 밖 scoped DB 사용이 조용히 빈 결과로 숨겨져 운영 버그를 늦게 발견할 수 있다.",
      "recommendation": "운영용 helper에는 runtime guard를 두고, 테스트는 `current_setting` missing, empty string, malformed UUID를 각각 검증하라. RLS policy 자체는 deny-by-null로 두더라도 application guard는 throw해야 한다."
    },
    {
      "id": "SPIKEA1-007",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "write 시나리오가 acceptance의 1000회 반복과 UPDATE WITH CHECK 변형을 검증하지 않는다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-write.ts:13",
        "apps/spike-a/src/scenarios/test-write.ts:26",
        "apps/spike-a/src/scenarios/test-write.ts:42",
        "apps/spike-a/src/scenarios/test-write.ts:64"
      ],
      "problem": "INSERT/UPDATE/DELETE cross-instance 시도는 각각 1회만 수행된다. UPDATE는 foreign row target 0 rows만 확인하고, 자기 row의 `instance_id`를 다른 tenant로 바꾸는 `WITH CHECK` reject를 검증하지 않는다.",
      "impact": "A.3의 `1000 iter` 쓰기 격리와 `WITH CHECK` 의미를 충분히 증명하지 못한다.",
      "recommendation": "write invariant runner를 별도로 두고, `UPDATE content_test SET instance_id = INSTANCE_B WHERE instance_id = INSTANCE_A RETURNING id`가 reject되는지 반복 검증하라."
    },
    {
      "id": "SPIKEA1-008",
      "severity": "major",
      "category": "service-role",
      "title": "`withServiceRole`에 break-glass authorization guard가 없다",
      "evidence": [
        "apps/spike-a/src/service-role.ts:25",
        "apps/spike-a/src/service-role.ts:32",
        "apps/spike-a/src/service-role.ts:52"
      ],
      "problem": "SoT의 `assertBreakGlassAllowed`에 해당하는 env/route/role/ticket 검증이 없다. 감사 insert만 하고 곧바로 `fn()`을 실행한다.",
      "impact": "prototype이 service-role 사용 감사는 일부 검증하지만, service-role 격리와 오용 차단 가설은 검증하지 못한다.",
      "recommendation": "최소 prototype guard라도 `actorRole`, `ticketRef`, `reasonCode`, allowlisted function name, non-prod/prod env policy를 assert하고 negative test를 추가하라."
    },
    {
      "id": "SPIKEA1-009",
      "severity": "major",
      "category": "service-role",
      "title": "service-role audit가 사용 결과와 1:1 의미를 보장하지 않는다",
      "evidence": [
        "apps/spike-a/src/service-role.ts:31",
        "apps/spike-a/src/service-role.ts:32",
        "apps/spike-a/src/service-role.ts:52",
        "apps/spike-a/src/scenarios/test-audit.ts:17"
      ],
      "problem": "audit는 service-role 실행 전에 affected instance별 N건으로 insert된다. `fn()`이 실패해도 outcome이 기록되지 않고, affectedInstanceIds가 여러 개면 '한 번의 service-role 사용 = audit 1건' 기준과 어긋난다.",
      "impact": "A.3의 `service_role audit 사용 횟수 = audit insert 횟수 (1:1)`을 명확히 증명하지 못한다.",
      "recommendation": "단일 invocation audit row에 `affectedInstanceIds`, `status`, `errorClass`, `startedAt/finishedAt`을 넣거나, per-instance 감사라면 acceptance 기준도 per-instance로 바꿔라."
    },
    {
      "id": "SPIKEA1-010",
      "severity": "major",
      "category": "migration-runner",
      "title": "migration runner가 migration 단위 원자성·checksum·concurrency를 보장하지 않는다",
      "evidence": [
        "apps/spike-a/src/migrate.ts:14",
        "apps/spike-a/src/migrate.ts:18",
        "apps/spike-a/src/migrate.ts:35",
        "apps/spike-a/src/migrate.ts:37"
      ],
      "problem": "파일명 sort + `migrations_applied(filename)`만 사용한다. migration SQL과 applied row insert가 한 transaction으로 묶이지 않고, checksum/version conflict/advisory lock이 없다.",
      "impact": "중간 실패 시 partial schema가 남고 재실행이 충돌할 수 있다. 동시 migration도 중복 적용 위험이 있다.",
      "recommendation": "각 파일을 transaction으로 감싸고, advisory lock, checksum, dirty state 기록을 추가하라. rollback은 forward-only 정책이라도 실패 복구 runbook이 필요하다."
    },
    {
      "id": "SPIKEA1-011",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "malformed UUID 시나리오가 없다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:23",
        "apps/spike-a/src/tenant.ts:35",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.2 scenario 5"
      ],
      "problem": "helper의 regex validation은 있지만, malformed UUID 입력에 대한 scenario가 없다. SQL-level `current_setting(...)::uuid`가 malformed setting에서 실패하는지도 검증하지 않는다.",
      "impact": "A.2의 명시 시나리오가 미충족이다.",
      "recommendation": "`withTenantTransaction('not-a-uuid')` negative test와 raw `set_config('app.current_instance_id','bad',true)` 후 tenant table query fail test를 분리하라."
    },
    {
      "id": "SPIKEA1-012",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "runtime guard/scopedDb tx 밖 사용 검증이 없다",
      "evidence": [
        "apps/spike-a/src/tenant.ts:19",
        "apps/spike-a/src/scenarios/test-rollback.ts:29",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.2 scenario 8"
      ],
      "problem": "prototype은 `ScopedDb` wrapper가 없고 tx 밖 사용 시 throw하는 runtime guard도 없다. rollback test는 오히려 `dbTenant.execute` direct query가 0 rows면 PASS로 본다.",
      "impact": "본 구현에서 가장 중요한 사용 규약인 'tenant table 접근은 helper 안에서만'을 검증하지 못한다.",
      "recommendation": "prototype에도 최소 `scopedDbFromTx` token/brand wrapper를 만들고, direct tenant table access negative test를 추가하라."
    },
    {
      "id": "SPIKEA1-013",
      "severity": "major",
      "category": "provider-gap",
      "title": "Supabase Pooler smoke gate와 prototype pgbouncer 차이가 정리되지 않았다",
      "evidence": [
        "apps/spike-a/docker-compose.yml:23",
        "apps/spike-a/docker-compose.yml:31",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §0.3",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A"
      ],
      "problem": "local pgbouncer transaction pooling은 구성되어 있지만 Supabase Pooler의 transaction mode, role switching, prepared statement behavior, GUC reset semantics에 대한 provider smoke script/report가 없다.",
      "impact": "local PASS가 provider PASS로 승격될 수 없다. Day 9 gate 대비 산출물이 부족하다.",
      "recommendation": "Supabase dev DB 대상으로 같은 `SET LOCAL`, rollback, direct query, invariant runner를 실행하는 provider profile을 분리하라."
    },
    {
      "id": "SPIKEA1-014",
      "severity": "major",
      "category": "scenario-coverage",
      "title": "schema-per-tenant fallback, SQL injection, service-role env mistake, perf p50/p95 시나리오가 누락됐다",
      "evidence": [
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.3",
        "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md §A.4",
        "apps/spike-a/src/scenarios"
      ],
      "problem": "요청 항목의 fallback 호환성, raw input injection 시도, service-role DSN/client context 오배선, withTenantTransaction overhead p50/p95 측정이 구현되어 있지 않다.",
      "impact": "correctness 핵심 일부는 검증하지만 production decision에 필요한 reversal/fallback 판단 자료가 부족하다.",
      "recommendation": "coverage gap을 Spike A result에 명시하고, 최소 perf baseline과 env mistake negative test는 A-provider 전까지 추가하라."
    },
    {
      "id": "SPIKEA1-015",
      "severity": "minor",
      "category": "sql-rls",
      "title": "audit_log append-only 주석이 실제 RLS 동작을 부정확하게 설명한다",
      "evidence": [
        "apps/spike-a/migrations/003_audit_log.sql:33",
        "apps/spike-a/src/scenarios/test-audit.ts:63",
        "apps/spike-a/src/scenarios/test-audit.ts:76"
      ],
      "problem": "정책이 없으면 RLS는 UPDATE/DELETE를 에러가 아니라 0 rows affected로 만들 수 있다. 반면 test는 permission denied/insufficient privilege 에러를 기대한다.",
      "impact": "GRANT 상태에 따라 테스트 기대값이 흔들린다.",
      "recommendation": "append-only acceptance를 두 층으로 나눠라: 권한 없음이면 permission error, 권한이 있어도 no policy면 0 rows affected. 둘 중 어느 안전망을 의도하는지 SQL로 고정하라."
    },
    {
      "id": "SPIKEA1-016",
      "severity": "minor",
      "category": "db-options",
      "title": "postgres-js pool option은 prototype에는 충분하지만 운영 판단 자료가 부족하다",
      "evidence": [
        "apps/spike-a/src/db.ts:15",
        "apps/spike-a/src/db.ts:25",
        "apps/spike-a/src/db.ts:35"
      ],
      "problem": "`prepare:false`는 맞다. 다만 `idle_timeout`, `connect_timeout`, query timeout/debug/correlation logging이 없어 hang/latency 분석이 어렵다.",
      "impact": "correctness 자체의 blocker는 아니지만, pgbouncer/Supabase 비교 때 문제 원인 식별이 어렵다.",
      "recommendation": "prototype에는 `idle_timeout`/`connect_timeout`과 선택적 debug logger를 추가하고, 운영 SoT에는 `statement_timeout`과 역할별 pool size를 별도 명시하라."
    },
    {
      "id": "SPIKEA1-017",
      "severity": "minor",
      "category": "type-safety",
      "title": "`(e as Error).message` 패턴이 unknown catch에 안전하지 않다",
      "evidence": [
        "apps/spike-a/src/scenarios/test-write.ts:32",
        "apps/spike-a/src/scenarios/test-rollback.ts:24",
        "apps/spike-a/src/scenarios/test-invariant-runner.ts:97"
      ],
      "problem": "`useUnknownInCatchVariables`를 켰지만 대부분 catch에서 강제 cast한다. thrown value가 Error가 아니면 message가 undefined가 된다.",
      "impact": "테스트 실패 메시지 판정이 false negative/false positive가 될 수 있다.",
      "recommendation": "`errorMessage(e: unknown): string` helper로 `e instanceof Error ? e.message : String(e)`를 통일하라."
    },
    {
      "id": "SPIKEA1-018",
      "severity": "minor",
      "category": "readme-runnability",
      "title": "README 실행 순서에 dependency install/env loading 전제가 빠져 있다",
      "evidence": [
        "apps/spike-a/README.md:26",
        "apps/spike-a/README.md:48",
        "apps/spike-a/package.json:29",
        "apps/spike-a/package.json:30"
      ],
      "problem": "현재 workspace에는 root `package.json`/`pnpm-workspace.yaml`이 없고, `pnpm --dir apps/spike-a typecheck`는 `tsc` 미설치로 실패했다. README는 `pnpm install` 위치와 `.env` 로딩 방식이 명확하지 않다.",
      "impact": "새 환경에서 README 그대로 실행하면 실패할 가능성이 높다.",
      "recommendation": "`cd apps/spike-a && pnpm install` 및 PowerShell `.env` 로딩 방법 또는 `dotenv-cli` 사용을 README에 추가하라."
    },
    {
      "id": "SPIKEA1-019",
      "severity": "minor",
      "category": "security-hygiene",
      "title": "prototype secret은 허용 가능하지만 production 오용 방지 문구가 부족하다",
      "evidence": [
        "apps/spike-a/migrations/001_roles.sql:5",
        "apps/spike-a/.env.example:7"
      ],
      "problem": "`app_tenant_pw`가 migration과 env example에 고정되어 있다. local spike로는 괜찮지만 README에 local-only secret임을 강하게 표시하지 않는다.",
      "impact": "prototype 코드가 본 구현으로 승격될 때 credential handling이 그대로 복사될 위험이 있다.",
      "recommendation": "README와 migration 주석에 local-only를 명시하고, 본 구현에서는 provider secret manager/generated password를 사용한다고 적어라."
    }
  ],
  "answers_to_requested_checks": {
    "sql_migration": {
      "001_roles": "NOBYPASSRLS와 LOGIN은 맞지만, broad default privileges가 가장 위험하다. audit_log/invariant_log 의도와 충돌한다. GRANT CONNECT는 기본 PUBLIC이 살아 있으면 보통 문제 없지만, hardened DB에서는 명시 필요할 수 있다.",
      "002_content_test": "RLS/FORCE/USING/WITH CHECK 방향은 맞다. 다만 `CREATE EXTENSION pgcrypto` 순서가 잘못됐고, missing GUC는 silent deny, malformed GUC는 cast error로 동작이 다르다. 두 경우를 별도 테스트해야 한다.",
      "003_audit_log": "SELECT/INSERT policy는 맞다. UPDATE/DELETE policy 없음은 RLS 안전망이지만, GRANT 안전망은 001 default privileges 때문에 깨질 수 있다. GRANT가 빠지면 permission error, RLS가 빠지면 권한 보유 시 tamper 가능하다.",
      "004_invariant_log": "app_tenant_user GRANT 미부여 의도는 맞지만 001 default privileges 때문에 충분하지 않다. 명시 `REVOKE ALL`이 필요하다."
    },
    "ts_core": {
      "tenant": "`prepare:false`와 transaction-local `set_config(..., true)`는 방향이 맞다. 그러나 `SET LOCAL ROLE`/current_user assert가 없어 DSN 오배선 방어가 없다.",
      "db": "pgbouncer transaction pooling에서 `prepare:false`는 필수이고 적용되어 있다. timeout/debug/structured logging은 production smoke 분석용으로 부족하다.",
      "service_role": "감사 insert before-use는 시도 자체 감사에는 유리하지만 outcome이 빠진다. affected instance별 insert는 prototype 단순화로 가능하나 1:1 기준을 흐린다.",
      "migrate": "파일 sort만으로는 version conflict, checksum, advisory lock, partial failure를 다루지 못한다."
    },
    "scenario_measurement": {
      "test_write": "`RETURNING id` length 판단은 대체로 가능하지만, 현재 seed import bug 때문에 신뢰할 수 없다. 1000회 반복과 UPDATE WITH CHECK 변형이 없다.",
      "test_rollback": "direct query는 autocommit transaction으로 실행될 가능성이 크며 rollback leak smoke로는 의미가 있다. 다만 runtime guard 검증은 아니다.",
      "test_invariant_runner": "20 concurrent는 `Promise.all`로 실제 20개 동시 요청을 만든다. pool size와 맞지만 최종 PASS 조건이 틀렸고 batch insert가 N+1이다.",
      "test_audit": "에러 메시지 regex 자체는 현실적인 편이나, 실제 권한 상태가 default privileges 때문에 의도와 다를 수 있다."
    },
    "production_gap": {
      "supabase_pooler": "아직 provider smoke가 없다. local pgbouncer와 Supabase Pooler 차이를 별도 gate에서 검증해야 한다.",
      "supabase_rls_policy": "Postgres RLS 문법 자체는 동일하지만 role/auth integration과 pooler behavior가 다르다.",
      "auth_uid_vs_set_config": "prototype은 Supabase Auth `auth.uid()`를 쓰지 않고 custom GUC를 쓴다. next-auth 기반 SoT와는 맞지만 Supabase 기본 auth RLS 예제와는 다른 모델임을 provider report에 명시해야 한다."
    },
    "verification_attempted": {
      "typecheck": "failed_to_run",
      "reason": "`pnpm --dir apps/spike-a typecheck` failed because `tsc` is not installed/available in this workspace."
    }
  }
}
