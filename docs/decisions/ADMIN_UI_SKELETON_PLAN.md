# apps/web admin UI skeleton plan (v1.0·acceptance·2026-05-15)

> **상태**: **v1.0** — codex 자동 비평 11 cycle 후 `ready_for_acceptance=true` 확정. cycle11 finding 0건. blocking 0·major 0·minor 0·nit 0. **107 findings 전건 처리 완료**. scope_narrow_acceptable=true.

본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.

> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).

> **package 버전 vs plan 버전 표기 (ADMIN-UI-44)**: 본 plan의 "v0.x" 는 plan 문서의 cycle 번호다. 의존 packages 의 실제 npm version 은 모두 `0.1.0`.

> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.

> **A-03 결정의 scope (ADMIN-UI-67)**: A-03 close (= packages/auth 자체 핸들러) 는 **skeleton-local 결정**. 상위 SoT (`INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 · `PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E) 가 여전히 next-auth/Auth.js 를 권위 있는 전제로 둔다. 두 문서의 reversal cascade 는 본 plan acceptance 후 별도 사이클로 진행 (acceptance precondition 아닌 follow-up cascade).

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
- `docs/ARCHITECTURE.md` § 10 (전체 위상 reference)
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 (9 states · 14 actions · multi-role AND gate)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1 (6 core tables · cycle2 schema)
- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Single DB + RLS · Provider · Storage = R2)
- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v1.0 (Spike A/B/C/D/E LOCAL_PASS 패턴)
- 기존 packages 실 시그니처 (cycle2 직접 확인):
  - `packages/auth/src/errors.ts` `AuthDenyReason` 17 reasons (§ 5.4 SoT)
  - `packages/auth/src/magic-link.ts` `consumeMagicLink(sql, identifier, tokenPlain) → identifier` (userId 아님)
  - `packages/auth/src/session.ts` `createSession(sql, cfg, userId)`
  - `packages/auth/src/resolve-tenant-context.ts` `TenantContext.instanceId: string` (plain)
  - `packages/db/src/service-role.ts` `withServiceRole(sql, ctx, allowedFunctions, fn) — ServiceRoleContext { function, actorUserId: AdminUserId (필수), instanceId?, reason }` + audit_log 자동 pending/outcome
  - `packages/db/src/tenant.ts` `withTenantTransaction(sql, { instanceId: InstanceId }, fn)` + `SET LOCAL ROLE app_tenant_user`
  - `packages/shared-types/src/index.ts` `ServiceRoleFunction` enum (slugResolver 없음 — cascade marker)
  - `apps/spike-e/migrations/004_audit_event.sql` audit_event 컬럼 = `occurred_at` (created_at 아님) · GRANT INSERT TO app_tenant_user 없음
  - `packages/core-content/migrations/C0001_clinic_profile.sql` `GRANT SELECT,INSERT,UPDATE,DELETE ON clinic_profile TO app_tenant_user` + `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` (cycle8 정정 ADMIN-UI-102 — NULLIF 패턴은 unset context 의 silent deny 를 보장하며 § 8.1 시나리오의 fail-closed 전제)

## 1. 목적과 walking skeleton 정의

### 1.1 목적

- Vertical Slice (M0 v1.0) 본 구현 진입 전에 **전구간 wiring을 한 번에 검증**한다.
- 검증할 전구간: Next.js App Router → packages/auth magic-link · resolveTenantContext → packages/db withTenantTransaction · RLS → packages/core-content 6 tables · Drizzle → Server Action 결과 → 다시 렌더링.

### 1.2 walking skeleton 범위 (포함)

| 화면/엔드포인트 | 책임 | 출력 |
|---|---|---|
| `/sign-in` | 이메일 입력 → magic-link 발급 (mock mailbox 적재). 토큰 URL 클릭 → 세션 발급 · 쿠키 set | session cookie |
| `/sign-in/consume?identifier=<email>&token=…` | magic-link 소비 (identifier + token 둘 다 필요) + **admin_user lookup/active check** (allowlist 만 — 자동 INSERT 없음 · ADMIN-UI-75) + first active operator membership 검증 + createSession + cookie set | redirect to `/[instanceSlug]` |
| `/sign-out` | revokeSession + cookie clear | redirect to `/sign-in` |
| `/[instanceSlug]` 대시보드 | slug resolve · tenant resolve · ClinicProfile 존재 여부 | 단순 표시 |
| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |

### 1.3 walking skeleton 비범위 (deferred)

> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.

| 항목 | Defer to |
|---|---|
| DoctorProfile · TreatmentPage · Article 폼 (3 화면) | M0 v1.0 Phase 0 Week 4 본 구현 |
| 미리보기 · 발행 화면 + Git commit/push/CI | M0 v1.0 + apps/worker |
| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
| ComplianceRecord 폼 · 위험도 분류 | M0 v0.2 (schema) + M0 v1.0 (UI) |
| Markdown 에디터 (A-06·A-08) | M0 v1.0 Article 화면 |
| Super-admin instance switch route + UI | M0 v1.0 또는 M2 |
| ClinicProfile editable slug + instance 당 1개 보장 unique index | M0 v1.0 + core-content schema v0.3 |
| Optimistic concurrency · 버전 컬럼 | M0 v1.0 또는 M2 |
| RBAC 외부 사용자 초대 · 멀티 인스턴스 대시보드 | M2 Phase Beta |
| Tiptap / Lexical 에디터 | M2 Phase Beta |
| DESIGN_TOKENS v1.0 integration | M1+ |

## 2. 기술 스택 결정 (admin/ARCHITECTURE § 10 미결정 항목 close)

| ID | 항목 | 결정 |
|---|---|---|
| **A-01** | 어드민 기술 스택 | Next.js 14 App Router + React Server Components + Server Actions |
| **A-02** | 어드민 DB | PostgreSQL (Single DB + RLS · INFRA v1.0 § 4.1 정합) |
| **A-03** | 인증 시스템 | packages/auth 자체 magic-link + HMAC signed session cookie (next-auth 도입 X) |
| **A-06** · **A-08** | 에디터 | walking skeleton 범위 외 — M0 v1.0 Article 화면에서 결정 |

UI 토대: Tailwind CSS v4 + shadcn/ui (6 컴포넌트) + zod + postgres.

> **Implementation drift marker (코드 cycle1 WEB-17·18)**: walking skeleton 구현 단계에서 (a) Tailwind v3.4 로 임시 사용 (v4 PostCSS 통합 안정화 후 migration cascade marker) · (b) shadcn/ui 6 컴포넌트 도입 대신 native input + Tailwind inline alert 로 단순화 (Toast 도입은 M0 v1.0 본 구현 또는 M1 합류). 두 drift 는 Plan 본 결정 변경 아닌 구현 단계 잠정 결정 — 후속 cascade.

> **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.

> **Image upload cascade marker** (사용자 피드백): ClinicProfile logo / og:image 직접 파일 업로드는 별도 cascade — packages/storage R2 통합 (INFRA v1.0 결정 · Spike C LOCAL_PASS 패턴 차용) + multipart Server Action + signed URL 발급 + EXIF/PII scrub. M0 v1.0 본 구현 또는 별도 onboarding-assistant Feature spec.

> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.

**제거**: `next-auth`, `@auth/drizzle-adapter`.

## 3. 디렉토리 구조 (apps/web)

```
apps/web/
├── package.json
├── tsconfig.json
├── next.config.mjs                   — serverActions.bodySizeLimit 명시 (§ 9 ADMIN-UI-39)
├── postcss.config.mjs
├── tailwind.config.ts
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  — / → /sign-in 또는 firstActiveMembership.instanceSlug redirect
│   │   ├── sign-in/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts            — issueMagicLink server action + skeleton-layer audit_event emit
│   │   │   └── consume/
│   │   │       └── route.ts          — GET /sign-in/consume?identifier=&token= · § 3.2 flow
│   │   ├── sign-out/
│   │   │   └── route.ts              — POST · revokeSession + cookie clear + audit_event emit
│   │   ├── (admin)/
│   │   │   ├── layout.tsx            — auth guard (cookie read · 미존재 시 redirect)
│   │   │   └── [instanceSlug]/
│   │   │       ├── page.tsx          — 대시보드 (slug resolve · tenant resolve · ClinicProfile 존재 표시)
│   │   │       └── clinic-profile/
│   │   │           ├── page.tsx      — server component (현재 값 SELECT)
│   │   │           └── actions.ts    — saveClinicProfile (bound action — § 6.2 ADMIN-UI-31)
│   │   └── api/
│   │       └── health/route.ts       — DB ping
│   ├── lib/
│   │   ├── env.ts                    — zod 검증 · AuthConfig 생성
│   │   ├── db.ts                     — postgres.Sql singleton (base role · audit emission에 사용)
│   │   ├── session-cookie.ts         — read/set/clear (§ 5.1)
│   │   ├── tenant.ts                 — getRequestTenantContext + withSkeletonTx 2단계 패턴 + asUuidV4 변환 (§ 5.3)
│   │   ├── slug-resolver.ts          — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 5.2)
│   │   ├── post-login-redirect.ts    — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 3.2)
│   │   ├── deny-reason-map.ts        — AuthDenyReason 17 reasons exhaustive UI mapping (§ 5.4)
│   │   └── errors.ts                 — DB CHECK / unique violation → fieldErrors
│   ├── components/
│   │   ├── ui/                       — shadcn/ui (Button · Input · Textarea · Label · Form · Toast)
│   │   ├── dev/
│   │   │   └── MockMailbox.tsx       — server-side 3중 가드
│   │   └── forms/
│   │       └── ClinicProfileForm.tsx — client component · form state · bound action
│   └── styles/
│       └── globals.css
├── src/seed.ts                       — bootstrap + system actor (§ 7.1 ADMIN-UI-29)
└── README.md
```

### 3.1 라우트 흐름

```
/                                                — cookie 없으면 /sign-in · 있으면 firstActiveMembershipSlug
/sign-in                                         — 이메일 입력 form (Server Action)
/sign-in/consume?identifier=&token               — GET Route Handler · § 3.2
/sign-out                                        — POST Route Handler
/[instanceSlug]                                  — 대시보드
/[instanceSlug]/clinic-profile                   — 폼
/api/health                                      — DB ping
```

### 3.2 인증 흐름 시퀀스 (cycle2 정정 ADMIN-UI-32·33)

```
1. user → POST /sign-in (email)
   → server action (action 시그니처 = (prev, formData)):
     • emailNormalized = normalizeIdentifier(formData.get('email'))
     • **allowlist 체크 (cycle5 정정 ADMIN-UI-75 — self-provision 방지)**:
       SELECT 1 FROM admin_user WHERE email = emailNormalized AND active = true LIMIT 1
       → 없으면 emitAuditEvent('magic-link-issue-denied', payload:{ identifier, reason:'not-allowlisted' })
         + UI 응답 generic "확인용 메일을 발송했습니다" (enumeration 방지) — 실제로는 메일 발송 안 함
       → 있으면 진행
     • issueMagicLink(sqlBase, cfg, emailNormalized) → mock mailbox 적재
     • emitAuditEvent(sqlBase, { eventType:'magic-link-issued', payload:{ identifier: emailNormalized }})
       (packages/auth.issueMagicLink 내부에 emit 없음 — packages/auth v0.3 cascade)

2. user → GET /sign-in/consume?identifier=<email>&token=<raw>
   → Route Handler (NextResponse 반환 — cookie set OK):
     • zod 검증: identifier(email) + token(string min 16)
     • try { normalizedIdentifier = await consumeMagicLink(sqlBase, identifier, token) }
       catch (AuthDeniedError e) → emit 'magic-link-rejected' + reason → redirect /sign-in?reason=<r>
     • admin_user lookup (ADMIN-UI-75 — 자동 INSERT 제거 · seed allowlist 만 허용):
       SELECT id, display_name, active FROM admin_user WHERE email = normalizedIdentifier
       • 없음 또는 inactive → emitAuditEvent('user-not-allowlisted-on-consume', payload:{ identifier }) → redirect /sign-in?reason=user-inactive
     • **cycle5 정정 (ADMIN-UI-76·84) — session 발급 전 membership 검증**:
       SELECT i.slug FROM instance_membership m JOIN instance i ON i.id = m.instance_id
        WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
        ORDER BY m.created_at LIMIT 1
       • 없으면 emitAuditEvent(sqlBase, { eventType:'first-active-membership-missing', actorUserId:userId, payload:{ identifier }})
         → redirect /sign-in?reason=no-active-membership (session 미발급 · cookie 미설정)
       • 있으면 firstSlug = row.slug
     • createSession(sqlBase, cfg, userId) → signedToken (membership 검증 통과 후에만)
     • emitAuditEvent(sqlBase, { eventType:'magic-link-consumed', actorUserId:userId, payload:{ identifier }})
     • emitAuditEvent(sqlBase, { eventType:'session-created', actorUserId:userId })
     • emitAuditEvent(sqlBase, { eventType:'first-active-membership-resolved', actorUserId:userId, targetUserId:userId, payload:{ slug: firstSlug }})  // cycle6 ADMIN-UI-89: matrix 와 일치하도록 targetUserId 추가
     • res.cookies.set('glitzy_session', signedToken, { httpOnly, secure, sameSite:'lax', maxAge:sessionTtlSeconds, path:'/' })
     • redirect to /{firstSlug}

3. user → GET /[instanceSlug]/*
   → page server-side (cycle5 정정 ADMIN-UI-77·81 — sqlBase 직접 · withServiceRole 미사용):
     • signedToken = readSessionCookie() · 없으면 /sign-in redirect
     • session = await getActiveSession(sqlBase, cfg, signedToken)  // userId 추출 (slug audit 필요)
     • instanceId = await slugResolver(sqlBase, slug, session.userId as AdminUserId)
       • 없으면 notFound() (audit_event 'slug-lookup-not-found' 자동 emit · § 5.2)
     • ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId)
       — 실패 시 deny-reason-map.ts 으로 분기 (cookie clear · 403 · 안내)

4. saveClinicProfile mutation Server Action (bound):
   → withSkeletonTx({ ctx, fn }) = withTenantTransaction(sqlBase, { instanceId: asUuidV4(ctx.instanceId) as InstanceId })
     • SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id (packages/db)
     • assertActionEligibility(ctx, 'operator-edit-content')
     • UPSERT clinic_profile (instance_id = ctx.instanceId 강제)
   → tx commit 후 (tenant role 밖, sqlBase = base role):
     • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
                                  payload:{ contentType:'ClinicProfile', slug:'clinic', updatedAtBefore, updatedAtAfter }})
     (tx 안에서 audit_event INSERT 가능하게 GRANT 추가하는 안 대신 commit 후 base-role emit — ADMIN-UI-36)

5. user → POST /sign-out (ADMIN-UI-51 — actorUserId 필요로 getActiveSession 먼저)
   → try {
       session = await getActiveSession(sqlBase, cfg, signedToken)     // userId 추출
       await revokeSession(sqlBase, cfg, signedToken)                  // DB row DELETE
       await emitAuditEvent(sqlBase, { eventType:'session-revoked', actorUserId: session.userId })
     } catch (AuthDeniedError e) {
       // tampered / expired cookie sign-out: actorUserId 알 수 없음
       await emitAuditEvent(sqlBase, { eventType:'session-revoked-anonymous', payload:{ reason: e.reason }})
     }
   → cookies.delete('glitzy_session') · redirect /sign-in
```

## 4. packages 의존성

```jsonc
{
  "name": "@glitzy/web",
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.x"
  }
}
```

`@glitzy/*` 모두 package version `0.1.0`. plan에서 "API shape after cycle$N patch" 라고 부르는 부분은 § SoT 의 cascade marker 가 적용된 후의 시그니처.

## 5. 인증 · 세션 · tenant resolve 통합 명세

### 5.1 cookie 명세 (cycle2 정정 ADMIN-UI-37·38)

| 항목 | 값 |
|---|---|
| 이름 | `glitzy_session` |
| 값 | HMAC signed token (packages/auth) |
| 속성 | `HttpOnly` · `Secure` (prod) · `SameSite=Lax` · `Path=/` · `Max-Age = sessionTtlSeconds` |
| 발급 | `/sign-in/consume` Route Handler 의 NextResponse |
| 폐기 | `/sign-out` Route Handler |
| **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |

`lib/session-cookie.ts` 는 read/set/clear 만 노출 (sync helper 제거).

### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)

URL `[instanceSlug]` → `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` (cycle9 정정 ADMIN-UI-105 — actorUserId 필수). **sqlBase 직접 SELECT** (withServiceRole 미사용 — instance scope 없는 control-plane lookup):

```typescript
// lib/slug-resolver.ts
import { asUuidV4, type InstanceId, type AdminUserId } from "@glitzy/shared-types";
import { emitAuditEvent } from "@glitzy/auth";

export async function slugResolver(
  sqlBase: postgres.Sql,
  slug: string,
  actorUserId: AdminUserId,
): Promise<InstanceId | null> {
  // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
  const rows = await sqlBase<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1`;
  if (rows.length === 0) {
    await emitAuditEvent(sqlBase, {
      eventType: "slug-lookup-not-found",
      actorUserId,
      reason: "instance-slug-not-found-or-inactive",
      payload: { slug },
    });
    return null;
  }
  return asUuidV4(rows[0].id) as InstanceId;
}
```

`ServiceRoleFunction` enum 신규 추가 (slugResolver · firstActiveMembershipResolver · adminUserUpsert) **precondition 제거**. M0 v1.0 instance-scoped service-role 작업 (예: contentMigrationApplier) 도입 시점에 enum 추가.

**actorUserId 처리**: slug resolve 는 인증된 사용자 요청 안에서 호출. cookie 없는 first hit 은 `/sign-in` redirect 우선.

**Super-admin (ADMIN-UI-17)**: skeleton 은 operator membership 만 지원. super-admin 진입 시 `super-admin-required` throw → deny-reason-map 안내 페이지.

### 5.3 tenant context · transaction 2단계 패턴 (cycle2 정정 ADMIN-UI-30)

```typescript
// lib/tenant.ts
import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
import { asUuidV4, type InstanceId } from "@glitzy/shared-types";

export async function withSkeletonTx<T>(
  args: { signedToken: string; instanceId: InstanceId },
  fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
): Promise<T> {
  const sql = getSqlBase();
  const cfg = getAuthCfg();
  // ctx.instanceId 는 plain string — branded InstanceId 로 변환 (ADMIN-UI-30)
  const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
  const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
}
```

`packages/auth.withResolvedTenantTransaction` 자체에 `SET LOCAL ROLE app_tenant_user` 가 없음 (ADMIN-UI-04) → packages/auth v0.3 cascade marker (resolve + withTenantTransaction 합성 패치). skeleton 은 자체 wrapper 로 우회.

### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)

> **두 taxonomy 분리 명시 (ADMIN-UI-45)**:
> - **UI deny reason** = `AuthDenyReason` union 17종 (packages/auth/src/errors.ts L6-L23). UI mapping/HTTP status/사용자 표시는 이 union 에 한정.
> - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).

> **sign-in page query reason union 별도 정의 (ADMIN-UI-55)**:
> ```typescript
> type SignInReason =
>   | AuthDenyReason  // 17 reasons
>   | 'no-active-membership'   // postLoginRedirect → membership 없음
>   | 'magic-link-rejected'    // consume 실패 reason 묶음 (magic-link-* 4종 별도 분기 안 할 때)
> ```
> `/sign-in?reason=<r>` 의 `r` 은 `SignInReason` 으로 검증. 미매핑 reason 은 generic 메시지로 fallback.

`AuthDenyReason` union 의 **실제 17 reasons** (packages/auth/src/errors.ts L6-L23) 기준 exhaustive 매핑. `assertNever` 로 build-time enforce.

| reason | UI 동작 |
|---|---|
| `session-not-found` · `session-expired` · `session-signature-invalid` | cookie clear · `/sign-in?reason=<r>` |
| `user-inactive` | cookie clear · `/sign-in?reason=user-inactive` |
| `invalid-instance-id` | 404 (페이지를 찾을 수 없습니다) |
| `membership-not-found` | 403 (이 인스턴스에 접근 권한 없음) |
| `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
| `instance-mismatch` · `super-admin-required` | 안내 페이지 (skeleton 범위 외) |
| `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
| `operator-role-required` | 403 (운영자 권한 필요) |
| `magic-link-expired` · `magic-link-consumed` · `magic-link-not-found` · `magic-link-invalid` | `/sign-in?reason=<r>` + emitAuditEvent `magic-link-rejected` |

`assertNever` exhaustive 체크 → union 확장 시 컴파일 fail (게이트 #9).

### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)

**audit_event 단일 SoT 포기** (ADMIN-UI-26). 두 테이블 병존:

| 테이블 | 컬럼 | 작성 경로 |
|---|---|---|
| `audit_event` | `id, event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload, occurred_at` (ADMIN-UI-25 — `occurred_at` 사용) | packages/auth.emitAuditEvent · base role connection (tx 밖) |
| `audit_log` | `id, instance_id, actor_id, actor_role, action, metadata, ...` | packages/db.withServiceRole 자동 (pending → outcome) |

**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).

대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).

**walking skeleton event 매트릭스**:

| eventType | 테이블 | emit 위치 |
|---|---|---|
| `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
| `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
| `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
| `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
| `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
| `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
| `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
| `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
| `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
| `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
| `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |
| `slug-lookup-not-found` | audit_event | `slugResolver` (sqlBase 직접 SELECT 후 null 시 emit · ADMIN-UI-54·63·69) |
| ~~`admin-user-upserted`~~ (cycle5 제거 ADMIN-UI-75) | — | self-provision 방지 — consume route 자동 INSERT 제거 |
| `user-not-allowlisted-on-consume` (cycle5 신규 ADMIN-UI-75) | audit_event | consume route — allowlist 미존재 사용자 시도 |
| `magic-link-issue-denied` (cycle5 신규 ADMIN-UI-75) | audit_event | /sign-in Server Action — allowlist 미존재 사용자 토큰 발급 시도 |
| `first-active-membership-resolved` | audit_event | consume route — instance_membership + instance JOIN SELECT 성공 (targetUserId · payload.slug — cycle5 ADMIN-UI-80 camelCase) |
| `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |
| `seed-completed` | audit_event | seed script — sqlBase 직접 INSERT 후 emit (§ 7.1) |

> cycle4 정정 (ADMIN-UI-63·66·67·70·71): walking skeleton 의 control-plane operation 은 모두 sqlBase 직접 호출 + audit_event emit 으로 통일. `withServiceRole` 사용 행 (slugResolver · firstActiveMembershipResolver · adminUserUpsert · seedRunner) 모두 제거.

**Gate verification query** (§ 9 #7) — 두 테이블 분리 검증:

```sql
-- audit_event
SELECT event_type, actor_user_id, payload FROM audit_event
 WHERE event_type IN ('tenant-resolved','content-saved','session-created')
   AND occurred_at > $sinceTime
 ORDER BY occurred_at;

-- audit_log: skeleton 에서는 비어 있음 (모든 control-plane operation 이 audit_event 사용 · cycle4)
-- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
```

**content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
1. `saveClinicProfile` 안에서 audit emit 호출을 `try/catch` 로 감싸 **저장은 성공으로 처리** (`return { ok: true }`)
2. catch 블록에서 `console.error` + Sentry alert (M0 v1.0 Sentry 합류 시)
3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.

## 6. ClinicProfile 폼 명세 (skeleton 범위)

### 6.1 입력 필드 (cycle2 정정 ADMIN-UI-42)

| 필드 | 입력 | zod 검증 | DB 검증 |
|---|---|---|---|
| `name` | text | min 1, max 100 | CHECK `clinic_profile_name_length` |
| `slug` | hidden fixed `clinic` | — | CHECK regex |
| `description` | textarea (maxLength=300) | min 80, max 300 | CHECK `clinic_profile_description_length` |
| `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
| `ogImageUrl` | text URL | 같음 | 같음 |
| `businessRegistrationNumber` | text | optional · regex `^\d{3}-\d{2}-\d{5}$` | CHECK |
| `alternateName` | text | optional · empty string → null normalize · max 100 | DB CHECK 없음 |
| `legalEntityName` | text | optional · normalize · max 200 | DB CHECK 없음 |
| `slogan` | text | optional · normalize · max 200 | DB CHECK 없음 |
| `longDescription` | textarea | optional · normalize · max 2000 | DB CHECK 없음 |
| `foundingDate` | date (YYYY-MM-DD) | optional · ISO 날짜 · normalize | DB type=date |
| `founder` | text | optional · normalize · max 100 | DB CHECK 없음 |

**Empty-string normalize 정책**: optional 필드는 zod transform 에서 빈 문자열 → `null` 로 normalize 후 DB 전달. DB column 은 nullable 이므로 일치.

### 6.2 Server Action `saveClinicProfile` — bound action (cycle2 정정 ADMIN-UI-31)

App Router Server Action 은 route params 를 자동 인자로 받지 않으므로 page server component 에서 **bound action** 생성:

```typescript
// /[instanceSlug]/clinic-profile/page.tsx
import { saveClinicProfile as saveAction } from "./actions";
export default async function Page({ params }: { params: { instanceSlug: string }}) {
  const boundSave = saveAction.bind(null, params.instanceSlug);  // 첫 인자에 slug 고정
  // ... <ClinicProfileForm action={boundSave} initialValue={...} />
}

// /[instanceSlug]/clinic-profile/actions.ts
"use server";
export async function saveClinicProfile(instanceSlug: string, prev: State, formData: FormData) {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten() };

  const signedToken = readSessionCookie();
  // ADMIN-UI-46: peekSessionUserId 미존재 → getActiveSession 사용
  const session = await getActiveSession(sqlBase, getAuthCfg(), signedToken); // throw on invalid
  const instanceId = await slugResolver(sqlBase, instanceSlug, session.userId as AdminUserId);
  if (!instanceId) {
    // ADMIN-UI-56: redirect('/404') → notFound() (next/navigation)
    notFound();
  }

  const txResult = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
    assertActionEligibility(ctx, "operator-edit-content");
    const [before] = await tx`SELECT updated_at FROM clinic_profile WHERE instance_id = ${ctx.instanceId} AND slug = 'clinic'`;
    const [after] = await tx`
      INSERT INTO clinic_profile (instance_id, slug, name, description, logo_url, og_image_url, ...)
        VALUES (${ctx.instanceId}, 'clinic', ${parsed.data.name}, ...)
      ON CONFLICT (instance_id, slug) DO UPDATE
        SET name = EXCLUDED.name, ..., updated_at = now()
      RETURNING updated_at
    `;
    return { ctx, before, after };
  });

  // tx commit 후 base-role emit (ADMIN-UI-36) + try/catch (ADMIN-UI-57)
  try {
    // ADMIN-UI-80 cycle5: AuditEventInput 필드명 camelCase (TypeScript helper) — DB column 은 snake_case
    await emitAuditEvent(sqlBase, {
      eventType: "content-saved",
      actorUserId: txResult.ctx.userId,
      targetUserId: txResult.ctx.userId,
      toInstanceId: txResult.ctx.instanceId,
      payload: {
        contentType: "ClinicProfile", slug: "clinic",
        updatedAtBefore: txResult.before?.updated_at ?? null,
        updatedAtAfter: txResult.after.updated_at,
      },
    });
  } catch (auditErr) {
    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
    // M0 v1.0 + transactional outbox 도입 후엔 ok:false 로 전환 — skeleton 은 best-effort
  }

  revalidatePath(`/${instanceSlug}/clinic-profile`);
  return { ok: true };
}
```

- **ADMIN-UI-31**: instanceSlug 는 page 의 bound action 첫 인자.
- **ADMIN-UI-11**: instance_id 는 ctx.instanceId 강제.
- **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
- **ADMIN-UI-22**: last-writer-wins · audit payload updatedAtBefore/After.
- **ADMIN-UI-36**: emitAuditEvent 는 tx commit **후** sqlBase 로.

## 7. 환경변수 · config 주입

`apps/web/.env.example`:

```
WEB_DATABASE_URL=postgres://...                # **웹 런타임 connection — 최소 권한 (cycle8 정정 ADMIN-UI-97 — BYPASSRLS/owner 금지)**:
                                                #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
                                                #         GRANT SELECT ON instance TO <web_role>;
                                                #         GRANT SELECT ON admin_user TO <web_role>;             -- cycle9 정정 ADMIN-UI-103: consume route 는 lookup-only · 자동 INSERT 없음 — INSERT/UPDATE 는 SEED_DATABASE_URL 전용
                                                #         GRANT SELECT ON instance_membership TO <web_role>;
                                                #         GRANT INSERT ON audit_event TO <web_role>;
                                                #         GRANT SELECT, INSERT, UPDATE, DELETE ON "session" TO <web_role>;  -- cycle10 정정 ADMIN-UI-106: sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 (packages/auth/src/internal/session-internal.ts)
                                                #         GRANT SELECT, INSERT, UPDATE ON "verificationToken" TO <web_role>;
                                                #   (b) `SET LOCAL ROLE app_tenant_user` 가능 — `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장 — tenant role 은 명시적 SET 으로만 활성).
                                                #   (c) **BYPASSRLS·table owner 권한 금지** — RLS fail-closed 전제 (NULLIF unset context silent deny) 보장. tenant table 은 무조건 `SET LOCAL ROLE app_tenant_user` 안에서만 접근.
SEED_DATABASE_URL=postgres://...               # **seed CLI / migration connection — superuser/owner** (cycle7·9 정정 ADMIN-UI-94·104):
                                                #   (a) 모든 control-plane / tenant table 의 owner 또는 superuser (idempotent INSERT/UPDATE 필요 — admin_user · instance · instance_membership)
                                                #   (b) `SET ROLE postgres` 가능 (M0 v1.0 service-role 작업 시점에만 필요 · skeleton 단계에서는 (a) 만으로 충분)
                                                # 실 구성 (개발·프로덕션): WEB_DATABASE_URL ≠ SEED_DATABASE_URL — seed 는 superuser·웹 런타임은 최소 권한 (BYPASSRLS/owner 금지). 둘을 같은 admin role 로 만드는 것은 local-only shortcut 으로만 허용 (production 금지).
AUTH_SECRET=<32+ chars>
MAGIC_LINK_TTL_SECONDS=900
SESSION_TTL_SECONDS=86400
SESSION_REFRESH_INTERVAL_SECONDS=3600           # walking skeleton 은 sliding refresh 미적용 (ADMIN-UI-37·38) — DB 만 갱신
RESEND_MODE=mock                                # 허용값 (skeleton): mock | suppress-mock 만 (ADMIN-UI-73). real delivery (resend / sendgrid 등) 는 packages/auth v0.3 mail adapter 도입 후 (M0 v1.0 또는 M2). skeleton 부팅 시 env validation 에서 `mock | suppress-mock` 외 값이면 즉시 throw.
DEV_MOCK_MAILBOX_VIEW=true                      # server-side only · NEXT_PUBLIC 제거 (ADMIN-UI-19)
NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT=2mb         # next.config.mjs 에서 사용 (ADMIN-UI-39)
NODE_ENV=development
```

`next.config.mjs`:

```javascript
export default {
  experimental: {
    serverActions: { bodySizeLimit: process.env.NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT ?? "2mb" },
  },
};
```

**Mock mailbox 노출 3중 가드** (서버사이드만 평가 · `NEXT_PUBLIC_*` 사용 X).

### 7.1 seed script — system actor 부트스트랩 (cycle3 정정 ADMIN-UI-29·48·58)

`ServiceRoleContext.actorUserId: AdminUserId` 가 필수이므로 seed 첫 호출 시점에는 actor 가 없다. 패턴:

1. seed script 는 **withServiceRole 사용하지 않고** 직접 sqlBase (admin role · SET ROLE postgres 가능) 로 INSERT 수행
2. system actor 행을 가장 먼저 idempotent insert (고정 UUID `00000000-0000-4000-8000-000000000001` · email `system@glitzy.internal` · `active=false`)
3. 이후 admin_user · instance · instance_membership 행 INSERT (모두 ON CONFLICT idempotent)
4. seed 자체의 audit 은 **audit_event 에 직접 INSERT** (ADMIN-UI-48 — audit_log 는 `instance_id NOT NULL` 이고 audit_event 는 nullable). emitAuditEvent helper 또는 raw INSERT 사용:

```typescript
// apps/web/src/seed.ts
const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";

// 1) system actor (cycle4 정정 ADMIN-UI-64 — display_name NOT NULL)
await sqlBase`
  INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
    VALUES (${SYSTEM_ACTOR_ID}::uuid, 'system@glitzy.internal', 'System', false, false, false, false, false)
  ON CONFLICT (id) DO NOTHING
`;

// 2) instance + admin_user(operator) + instance_membership (모두 idempotent ON CONFLICT)
const [instanceRow] = await sqlBase`INSERT INTO instance (slug, display_name, active) VALUES (${slug}, ${name}, true) ON CONFLICT (slug) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id`;
const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
// cycle5 정정 ADMIN-UI-79: partial unique index `instance_membership_active_unique (user_id, instance_id) WHERE active=true` 만 존재.
// ON CONFLICT inference 시 predicate 필요. inactive row 재활성화는 별도 UPDATE.
await sqlBase`
  WITH existing AS (
    SELECT id, active FROM instance_membership
     WHERE user_id = ${userRow.id}::uuid AND instance_id = ${instanceRow.id}::uuid
     LIMIT 1
  ), reactivate AS (
    -- cycle6 정정 ADMIN-UI-87: instance_membership_deactivated_consistency CHECK 정합
    -- active=true 시 deactivated_at IS NULL AND deactivated_by_user_id IS NULL 요구
    UPDATE instance_membership
       SET role = 'operator',
           active = true,
           deactivated_at = NULL,
           deactivated_by_user_id = NULL,
           updated_at = now()
     WHERE id = (SELECT id FROM existing) AND (SELECT active FROM existing) = false
     RETURNING id
  ), insert_new AS (
    INSERT INTO instance_membership (user_id, instance_id, role, active)
    SELECT ${userRow.id}::uuid, ${instanceRow.id}::uuid, 'operator', true
     WHERE NOT EXISTS (SELECT 1 FROM existing)
     RETURNING id
  )
  SELECT id FROM reactivate UNION ALL SELECT id FROM insert_new UNION ALL SELECT id FROM existing WHERE active = true
`;

// 3) seed audit — audit_event 사용 (audit_log 는 instance_id NOT NULL — ADMIN-UI-48)
// ADMIN-UI-80 cycle5: column 은 snake_case (DB schema 정합)·AuditEventInput TypeScript helper 는 camelCase (targetUserId 등)
await sqlBase`
  INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
    VALUES ('seed-completed', ${SYSTEM_ACTOR_ID}::uuid, ${instanceRow.id}::uuid, ${sqlBase.json({ slug, email, args })}::jsonb)
`;
```

CLI: `pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>`.

**Migration precondition (cycle3 정정 ADMIN-UI-58)**: walking skeleton 코드가 의존하는 모든 table 의 migration 적용 필수. 각 table 의 SoT 위치:

| Table | Migration | 비고 |
|---|---|---|
| `instance` | `packages/db/migrations/D0010_instance.sql` | M0_SCHEMA v0.1 |
| `clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` | `packages/core-content/migrations/C0001~C0005.sql` | M0_SCHEMA v0.1 |
| `admin_user` · `instance_membership` · `session` · `"verificationToken"` (Auth.js compatible quoted camelCase — ADMIN-UI-82) | `apps/spike-e/migrations/002_admin_user.sql` · `003_auth_session.sql` | Spike E |
| `audit_event` | `apps/spike-e/migrations/004_audit_event.sql` | Spike E |
| `audit_log` | `apps/spike-a/migrations/003_audit_log.sql` | Spike A · `instance_id NOT NULL` |
| pg extensions (`pgcrypto`) | `apps/spike-e/migrations/001_roles_extensions.sql` (또는 동등) | Spike A·D·E 분산 — 첫 번째 migration 가 보장 |

향후 packages/auth/migrations · packages/db/migrations 분리 cascade 진행 시 위 mapping 갱신.

## 8. RLS 통합 검증 — § 8.1 시나리오 (cycle2 정정 ADMIN-UI-43)

1. own instance 정상 — SELECT 본인 row 가능.
2. cross-tenant URL 변조 → `membership-not-found` → 403.
3. slug lookup 실패 → notFound() + audit_event `slug-lookup-not-found` (cycle4 정정 ADMIN-UI-69 — sqlBase 직접 + audit_event emit).
4. session 만료 (TTL 경과 next request) → `session-expired` → /sign-in redirect.
5. session race during tx — request 시작 snapshot 정책. tx 안 revoke 되어도 현재 tx commit. next request 차단.
6. CHECK violation (description 30자) → 폼 inline 에러.
7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
8. FormData hidden `instance_id` 변조 → ctx.instanceId override · 변조값 무시.
9. Forced SQL `INSERT ... VALUES ('<other-uuid>', ...)` → RLS WITH CHECK 위반 · exception.
10. ON CONFLICT DO UPDATE foreign row → USING/WITH CHECK 모두 차단.
11. Oversized body (3MB description) → `next.config.mjs` bodySizeLimit=2mb 위반 → 413.
12. non-operator role 저장 → assertActionEligibility → `operator-role-required` → 403.
13. **Cookie HMAC tampering (ADMIN-UI-43)** — signed token 마지막 byte 변조 후 request → `session-signature-invalid` → cookie clear · /sign-in redirect · audit_event `tenant-resolve-denied` reason=`session-signature-invalid`.

## 9. skeleton 완료 게이트

> **Precondition (cycle6 정정 ADMIN-UI-92)**: 게이트 #1·#2 의 `typecheck:all` / `build:all` script 는 루트 `package.json` 에 현재 미존재. **plan acceptance 가 아닌 구현 진입 precondition** — plan v1.0 acceptance 후 코드 작성 단계의 첫 작업으로 루트 script 추가.

| # | 게이트 | 통과 기준 |
|---|---|---|
| 1 | `pnpm typecheck:all` PASS | 루트 신규 script 추가 후 |
| 2 | `pnpm build:all` PASS | 같음 |
| 3 | `pnpm --filter @glitzy/web seed` PASS — **모든 sign-in 시도 전 필수 (ADMIN-UI-71 ordering)** | idempotent · SYSTEM_ACTOR + operator + instance + membership 생성. health check (/api/health) 가 SYSTEM_ACTOR 존재 검증. |
| 4 | magic-link 로그인 | mock mailbox URL 클릭 → /sign-in/consume?identifier=&token= → 세션 cookie |
| 5 | 대시보드 ctx 표시 | email · role · instanceId 출력 |
| 6 | ClinicProfile 폼 저장 + RLS 격리 | § 8.1 시나리오 1~13 PASS |
| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
| 8 | `pnpm --filter @glitzy/web dev` 동작 | dev 서버 기동 · /api/health 200 · response 에 `systemActorPresent: true` 포함 (preflight · ADMIN-UI-71) |
| 9 | `assertNever` exhaustive 체크 PASS | deny-reason-map 이 모든 17 `AuthDenyReason` mapping (build-time enforce) |
| 10 | next.config.mjs `serverActions.bodySizeLimit` 명시 (ADMIN-UI-39) | 시나리오 11 검증 가능 |

## 10. 미결정 사항 → 최종 결정 (cycle3 정정 ADMIN-UI-59)

| ID | 항목 | 최종 결정 (close 일자 cycle) |
|---|---|---|
| W-01 | 저장 후 페이지 동작 — revalidatePath vs redirect | revalidatePath + inline 토스트 · cycle1 close |
| W-02 | next-auth v5 wrapping vs 자체 핸들러 | 자체 핸들러 (packages/auth) · next-auth 제거 · cycle1 close |
| W-03 | middleware vs layout server-side guard | **cycle4 정정 ADMIN-UI-74**: middleware 미사용 결정. `src/middleware.ts` 작성 X · cookie read 와 redirect 도 `(admin)/layout.tsx` server-side 에서 수행. middleware 도입은 M2 (multi-instance dashboard 동시 처리 필요해질 때). |
| W-04 | shadcn/ui 컴포넌트 셋 | Button · Input · Textarea · Label · Form · Toast 6개 · cycle1 close |
| W-05 | dev mode mock mailbox 노출 | server-side 3중 가드 (NODE_ENV · RESEND_MODE · DEV_MOCK_MAILBOX_VIEW) · cycle1 close |
| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
| W-07 | super-admin instance switch UI | skeleton 범위 외 — operator membership 만 지원 · cycle1 close |

## 11. Deferred

§ 1.3 표 참조.

## 12. SoT cascade (cycle2 — 코드 작성 진입 전 적용 우선순위)

> **선행 patch (acceptance precondition)**: walking skeleton 코드 작성 전 반드시 적용.

| 대상 | cascade | 상태 |
|---|---|---|
| ~~`packages/shared-types/src/index.ts` `ServiceRoleFunction` enum~~ | ~~precondition~~ | **cycle4 제거 (ADMIN-UI-68)** — sqlBase 직접 호출로 변경되어 enum 추가 불필요. M0 v1.0 cascade marker (instance-scoped service-role function 추가 시점). |
| 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
| `docs/admin/ARCHITECTURE.md` § 10 미결정 A-01·A-02·A-03 close (cycle8 정정 ADMIN-UI-98) — A-01·A-02·A-03 의 plan 결정 (Next.js 14·PostgreSQL·packages/auth 자체 핸들러) 은 본 plan 안에서만 확정 · admin/ARCHITECTURE v0.8 patch 는 plan acceptance 후 follow-up cascade | v0.8 patch | **follow-up (acceptance non-blocking)** |
| `docs/decisions/PACKAGES_STRUCTURE.md` v0.2 patch (cycle6·8 정정 ADMIN-UI-91·99) — `@glitzy/auth` placeholder 분류 제거 (실제 issueMagicLink·createSession·resolveTenantContext·emitAuditEvent export 중), `@glitzy/core-content` 상태 갱신 (6 tables 추가), apps/web entry 및 dependency arrow 명시 | v0.2 patch | **follow-up (acceptance non-blocking)** |
| `tsconfig.base.json` path alias 정합 검증 | review | **구현 진입 precondition** |

> **별도 cycle (M0 v1.0 또는 separate cascade)**: skeleton 우회 가능 — wrapper 또는 분기로 처리.

| 대상 | cascade |
|---|---|
| `docs/decisions/INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 Auth.js/next-auth 전제 → packages/auth 자체 handler reversal (ADMIN-UI-67 — follow-up cascade · acceptance 후) |
| `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E Auth.js provider gate → packages/auth 자체 handler 기준 (ADMIN-UI-67 — 같음) |
| `packages/auth` v0.3 — `withResolvedTenantTransaction` 에 `withTenantTransaction` 합성 (ADMIN-UI-04) — skeleton 은 자체 `withSkeletonTx` 로 우회 |
| `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
| `packages/auth` v0.3 — `consumeMagicLink` 가 identifier 반환 유지 + 별도 allowlist lookup helper 검토 (cycle8 정정 ADMIN-UI-101 — cycle7 self-provision 제거 정합 · upsert 표현 제거) — skeleton 은 consume route 에서 admin_user **lookup-only** 수행 (allowlist 미존재 → reject) |
| `packages/auth` v0.3 — `resolveTenantContext` 반환에 `sessionRefreshed` 플래그 (ADMIN-UI-03·38) — skeleton 은 sliding refresh 미적용 |
| `packages/auth` v0.3 — inactive membership 분기 추가 (ADMIN-UI-35) — skeleton mapping 은 unreachable 표시 |
| `packages/auth/migrations` 신규 — auth tables 를 apps/spike-e/migrations 에서 이전 + audit_event RLS/GRANT 추가 (ADMIN-UI-36·13) — skeleton 은 spike-e migrations 직접 적용 |
| (ADMIN-UI-52 — shared-types cascade 중복 제거 · 위 precondition 단일화) |
| `packages/core-content` v0.3 — logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique (ADMIN-UI-09·10) — skeleton 은 zod-only + fixed slug |
| `packages/db` v0.2 — `audit_event` 와 `audit_log` 통합 방향 결정 (ADMIN-UI-06·26) — skeleton 은 두 테이블 분리 검증 |
| Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |

## 13. Codex 비평 cycle 운영 방침

closeableAfterPatch 신호 수렴 기준. cycle1=24, cycle2=20, cycle3=18, cycle4=12, cycle5=12, cycle6=6, cycle7=4, cycle8=6, cycle9=3, cycle10=2, **cycle11=0** (11 cycle 누계 107 findings · `ready_for_acceptance=true` 확정).

## 14. 변경 이력 (최신순 · cycle5 ADMIN-UI-86 명시)

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
| 2026-05-15 | v0.11 | **cycle10 patch (2 findings · major 1 · minor 1 · nit 0 전건 처리)**: (1) ADMIN-UI-106 WEB_DATABASE_URL `GRANT SELECT, INSERT, DELETE ON session` → `GRANT SELECT, INSERT, UPDATE, DELETE ON "session"` 로 정정 (sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 · packages/auth/src/internal/session-internal.ts 정합), (2) ADMIN-UI-107 두 번째 SEED_DATABASE_URL 중복 블록 실 본문 삭제 (cycle9 변경 이력만 기록·본문 잔존이었음) |
| 2026-05-15 | v0.10 | **cycle9 patch (3 findings · major 1 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-103 WEB_DATABASE_URL `GRANT SELECT, INSERT ON admin_user` → `GRANT SELECT` 로 좁힘 (consume route lookup-only 정합), (2) ADMIN-UI-104 SEED_DATABASE_URL 중복 블록 제거 — WEB ≠ SEED 분리 명시 + local-only shortcut 단서, (3) ADMIN-UI-105 § 5.2 요약 시그니처 `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` 로 정정 |
| 2026-05-15 | v0.9 | **cycle8 patch (6 findings · major 3 · minor 3 · nit 0 전건 처리)**: (1) ADMIN-UI-97 WEB_DATABASE_URL 권한을 BYPASSRLS/owner 금지로 좁힘 — control-plane table별 명시적 GRANT 목록 + `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장) 으로 RLS fail-closed 보장, (2) ADMIN-UI-98 admin/ARCHITECTURE § 10 A-01·A-02·A-03 cascade 를 follow-up (acceptance non-blocking) 으로 낮춤 — plan 본문 결정은 plan 안에서 확정, (3) ADMIN-UI-99 PACKAGES_STRUCTURE v0.2 patch 도 follow-up 으로 낮춤, (4) ADMIN-UI-100 apps/web tree 주석 (slug-resolver · post-login-redirect) 의 service-role 잔재 제거, (5) ADMIN-UI-101 § 12 cascade 의 consumeMagicLink upsert 표현 제거 → `identifier 반환 유지 + 별도 allowlist lookup helper`, (6) ADMIN-UI-102 SoT bullet RLS 인용 byte-level 정합 — `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` |
| 2026-05-15 | v0.8 | **cycle7 patch (4 findings · major 2 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-93 § 1.2 표 `/sign-in/consume` 책임을 `admin_user lookup/active check (allowlist 만 — 자동 INSERT 없음)` 로 정정 + cycle4 핵심 결정 문구의 `admin_user upsert` 가 seed 단계 한정임을 명시 (consume route 는 lookup-only), (2) ADMIN-UI-94 DATABASE_URL 을 WEB_DATABASE_URL (control-plane SELECT/INSERT + app_tenant_user role grant) + SEED_DATABASE_URL (M0 v1.0 service-role 작업 시점에 postgres role 추가) 로 분리 — 웹 런타임 과권한 제거, (3) ADMIN-UI-95·96 cascade — PACKAGES_STRUCTURE.md v0.2 + admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 close 는 plan acceptance 와 분리된 follow-up cascade |
| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
| 2026-05-15 | v0.2 | cycle1 patch (24 findings 처리) — A-03 자체 핸들러 close · withSkeletonTx 2단계 · audit_event 단일 SoT · slug service-role · seed precondition · deny mapping · super-admin defer · 시나리오 6개 추가 등 |
| 2026-05-15 | v0.1 | 최초 작성 |
