# @glitzy/web — admin UI walking skeleton

> **상태**: **v1.2** — M0 3 entity forms 추가 (2026-05-16).
> - skeleton 1차 (v1.0): codex 비평 6 cycle 68 findings 전건 수용 (18→18→15→12→5→0)
> - Onboarding URL scrape 2차 (v1.1): codex 비평 4 cycle 22 findings 전건 수용 (12→7→3→0). SSRF 방어 + tenant resolve 재검증 + sanitizeUrlForAudit.
> - 3 entity forms 3차 (v1.2): codex 비평 6 cycle 53 findings 전건 수용 (16→15→13→3→6→0). DoctorProfile · TreatmentPage · Article 목록/신규/편집 + 대시보드 count card. requirePageContext 공통 helper · isNextControlFlowError rethrow · DeleteForm form-action · 모든 page-level eligibility 강제 · Doctor 삭제 FK 사전 확인 · Article author server-side 검증 (locked row 기준) · ClinicProfile UPSERT mode 판별 정확화 (xmax = 0).
> - **누계: 16 cycle · 143 findings 전건 수용**

Plan v1.0 (`docs/decisions/ADMIN_UI_SKELETON_PLAN.md`) 구현체.

## 범위 (M0 walking skeleton)

- `/sign-in` → magic-link 발급 (allowlist 만)
- `/sign-in/consume?identifier=&token=` → admin_user lookup → first active operator membership 검증 → 세션 발급
- `/sign-out`
- `/[instanceSlug]` 대시보드 (세션 컨텍스트 · ClinicProfile 존재 표시)
- `/[instanceSlug]/clinic-profile` 폼 (upsert · withSkeletonTx 2단계 · RLS · audit)
- `/api/health` DB ping + systemActorPresent

## 의존성

- `@glitzy/auth` · `@glitzy/db` · `@glitzy/core-content` · `@glitzy/shared-types` · `@glitzy/shared-errors`
- Next.js 14 App Router + RSC + Server Actions
- Tailwind v3.4 (Plan v1.0 Tailwind v4 → cycle12 cascade marker)

## 환경 변수

`.env.example` 참조. 핵심 (Plan § 7):

- `WEB_DATABASE_URL` — 웹 런타임 (BYPASSRLS/owner 금지 · `GRANT app_tenant_user TO <web_role>` NOINHERIT)
- `SEED_DATABASE_URL` — seed CLI/migration (superuser)
- `AUTH_SECRET` (32+ chars)
- `RESEND_MODE=mock` (skeleton)
- `DEV_MOCK_MAILBOX_VIEW=true` (개발용)

## Migration precondition (Plan § 7.1)

skeleton 코드는 다음 migration 모두 적용된 DB 가정:

- `packages/db/migrations/D0010_instance.sql`
- `packages/core-content/migrations/C0001~C0005.sql`
- `apps/spike-e/migrations/001~004.sql` (admin_user · session · "verificationToken" · audit_event)
- `apps/spike-a/migrations/003_audit_log.sql` (audit_log)

## 부팅 순서

> **cycle5-code WEB-68**: `@glitzy/*` packages 는 `dist/*.js` 를 가리키므로 **반드시 `pnpm pkg:build` 선행** — 안 하면 stale dist / missing dist 로 web dev/seed 가 실패한다.

```bash
# 1. 패키지 빌드 (필수 precondition · stale dist 회피)
pnpm pkg:build

# 2. DB 마이그레이션 적용 (spike-a/e 의 docker postgres 또는 별도)
# 3. seed
pnpm web:seed --email=op@example.com --display-name="운영자" --instance-slug=demo --instance-name="Demo 의원"

# 4. dev 서버 기동
pnpm web:dev

# 5. brower http://localhost:3000/sign-in 접속
#    이메일 입력 → mock mailbox UI 의 consume URL 클릭 → /demo redirect
```

**packages 코드 수정 시**: `pnpm pkg:build` 재실행 후 web dev/seed 재기동. CI 에서는 `pnpm build:all` 단일 명령으로 처리.

## Plan 의 핵심 결정 (구현 정합)

| 영역 | 결정 |
|---|---|
| 인증 | packages/auth 자체 magic-link + HMAC session (next-auth 미사용) |
| Tenant resolve | withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) — `lib/tenant.ts` |
| 슬러그 lookup | `lib/slug-resolver.ts` — sqlBase 직접 SELECT + audit_event emit (withServiceRole 미사용) |
| Self-provision 차단 | `/sign-in` allowlist 체크 · `/sign-in/consume` lookup-only |
| Session 발급 순서 | admin_user check → first active membership 검증 → createSession + cookie set (ADMIN-UI-76) |
| Cookie refresh | Asymmetric — cookie fixed window + DB session sliding |
| Audit | `audit_event` (control-plane) · `audit_log` (M0 v1.0 service-role) 분리 |
| RLS | `lib/tenant.ts` 안에서만 SET LOCAL ROLE app_tenant_user · base connection 은 control-plane SELECT 만 |
| `content-saved` audit | tx commit 후 base-role · try/catch best-effort (M0 v1.0 transactional outbox cascade) |

## Cascade marker (M0 v1.0 또는 별도 cycle)

- packages/auth v0.3: audit emit 자동 · sessionRefreshed 반환 · inactive membership 분기
- packages/core-content v0.3: logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique
- packages/shared-types v0.3: instance-scoped service-role function enum
- Tailwind v4 migration (Plan v1.0 명시 → v3.4 implementation drift)
- admin/ARCHITECTURE.md v0.8 (§ 10 A-01·A-02·A-03 close)
- PACKAGES_STRUCTURE.md v0.2 (@glitzy/auth placeholder 제거)
- INFRA_DECISIONS_DRAFT.md / PHASE0_WEEK1_SPIKES_DRAFT.md — Auth.js → packages/auth 자체 핸들러 reversal

## § 8.1 RLS 검증 시나리오 (13개)

본 코드를 띄운 후 README LOCAL_PASS 체크리스트로 검증할 시나리오. M0 v1.0 본 구현 단계에서 자동화 검증 추가.
