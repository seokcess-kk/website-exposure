# CLAUDE.md

<!--
이 파일은 점진적으로 개선됩니다.
Claude Code 가 실수하거나 의도와 다른 결과를 낼 때마다, 해당 케이스를 방지하는 규칙을
"변경 이력" 섹션에 한 줄씩 추가하세요. 처음부터 모든 규칙을 채우지 않습니다.
-->

## 프로젝트 개요

Glitzy 의료기관 웹사이트 노출 솔루션 — 네이버 검색 신뢰도 (2025-2026 AI 브리핑·통합 랭킹) 정합. 첫 클라이언트: 다이트한의원 인천 부평점.

**핵심 가정**: 코드가 클라이언트 수에 선형 증가하지 않도록 **3-layer (Core / Preset / Instance) + multi-tenant 단일 DB + RLS** 로 설계. 어드민이 Control Plane(상태·승인), 정적 사이트가 Data Plane(렌더링) — Admin-first.

**스택**: Next.js 14 (App Router) · TypeScript · pnpm workspace · Supabase Postgres · postgres.js · drizzle · Tailwind · Vercel

**현재 milestone (2026-05-22)**: 사용자 7항목 진단 中 5항목 v1.0 acceptance — Phase 0+1 (대시보드) · Phase 2 (키워드) · Phase 3 (근거 연결) · Phase 4 (개선 큐) · Phase 5 (GSC ingestion). **Phase 5.1 NSA paste ingestion v1.0 acceptance (2026-05-22)** — NAVER_SEARCH_INGEST_PLAN (clipboard paste · 스냅샷 모드 · 2-layer sentinel · 3 tx atomicity · vitest 14/14). 잔여 = Phase 6 (캘린더) + Phase 5.x (source filter tab · OpenAPI · gap 분석) + 사용자 (b)(c) plan (네이버 플레이스 · AI 보조). 후속 cycle 후보는 `@memory/next_work_candidates.md` 참조.

## 빌드 & 실행

| 작업 | 명령 |
|---|---|
| 웹 dev 서버 | `pnpm web:dev` |
| 웹 빌드 (packages → next) | `pnpm web:build` |
| 전체 typecheck | `pnpm typecheck:all` |
| 단위 테스트 (vitest 전체) | `pnpm --filter @glitzy/web test:scenarios` |
| 단위 테스트 한 파일/패턴 | `pnpm --filter @glitzy/web exec vitest run <path-or-pattern>` (예: `... vitest run src/lib/markdown.test.ts` · `... vitest run -t "근거 link"`) |
| Production migration | `pnpm --filter @glitzy/web migrate-prod` (manifest) + `migrate-late` (manifest 외) |
| Seed (operator+instance bootstrap) | `pnpm web:seed --email=... --display-name=... --instance-slug=demo --instance-name=...` |
| SQL 실행 (Windows · psql 없이) | `pnpm --filter @glitzy/web run-sql apps/web/scripts/<file>.sql` |
| Dev → Prod 콘텐츠 sync | `pnpm --filter @glitzy/web sync-prod-from-dev` |

## 검증 규칙 (Self-Verification)

코드 변경 후 **반드시** 아래 순서로 자체 검증:

1. **typecheck**: `cd apps/web && pnpm exec tsc --noEmit`. exit 0 이 production code 정상. `__tests__/` · `*.test.ts` 의 ClinicProjection metadata 누락 에러는 pre-existing 이라 production 빌드 영향 없음 — 무시 가능.
2. **빌드**: 실 SSR 흐름 변경 시 `pnpm web:build`. Vercel 환경 정합 위해 `pnpm --filter='@glitzy/web^...' run build` 가 packages dist 사전 생성.
3. **시각 검수**: UI 변경 시 dev 서버 실행 후 직접 확인. `/demo` 메인·`/demo/treatments`·`/demo/insights`·`/admin/demo` 4개 핵심 경로 reload.
4. **에러 자체 해결**: 에러 발생 시 사용자에게 보고 전 stack trace + 원인 직접 분석 후 fix 시도. 사용자에게 보고할 때는 원인 + 옵션 + 권장을 함께 제시.

## 디렉터리 구조

```
apps/web/                          ← @glitzy/web · Next.js 14 (App Router) · 어드민 + 공개 site
  src/app/(admin)/admin/[instanceSlug]/   어드민 (operator/legal-reviewer 권한별)
  src/app/(site)/[instanceSlug]/          공개 site (SSR + ISR revalidate=60 + JSON-LD)
  scripts/                                init-prod-roles · migrate-prod · migrate-late · sync-prod-from-dev · seed-demo-rich.sql
apps/spike-{a..e}/                 검증된 prototype (본 구현은 packages/ 로 승격)
packages/
  db/                              withTenantTransaction + RLS scopedDb
  auth/                            magic link · HMAC session · resolveTenantContext · 14-action eligibility
  core-content/                    DATA_MODEL C-01~C-25 drizzle + migrations C0001~C0029
  compliance-rules/                의료광고법 RiskRule + 9-step check()
  migrations-runner/               manifest spec (실 runner 는 LL-DEFER-20)
  storage · notifications-outbox · shared-types · shared-errors
docs/ARCHITECTURE.md · docs/core/ · docs/admin/ · docs/decisions/<PLAN>.md
```

## 도메인 용어

**혼동 가능한 용어 — 코드 사용 시 반드시 구분.**

- **Instance**: multi-tenant DB row. site URL `/[instanceSlug]/...` 에서 slug 로 식별. instance 별 DB 분리 X.
- **AdminUser**: 어드민 운영자 (operator/legal-reviewer/physician-reviewer/client-approver). `admin_user` table. `system@glitzy.internal` 은 sentinel actor.
- **DoctorProfile**: 의료진 entity (콘텐츠 author). `doctor_profile` table. **AdminUser 와 별도 — 의료진 = entity, 운영자 = 계정**.
- **Pillar** vs **Spoke** (treatment hierarchy): 4 Pillar (다이어트 치료·개인맞춤·체형관리·다이트 한약) + 10 Spoke (굿바이 다이어트·당질조절 등). `treatment_page.pillar_slug` 가 NULL 이면 자체가 Pillar.
- **Session** vs **InstanceMembership**: Session = auth cookie (`glitzy_session`). InstanceMembership = AdminUser ↔ Instance role 매핑. 둘 다 있어야 admin route 접근.
- **app_tenant_user** vs **app_public_reader**: 모두 PostgreSQL role. 전자는 admin RLS context (`SET LOCAL ROLE`), 후자는 site 공개 SELECT.
- **Sentinel ComplianceRecord**: seed 안 `published_content_compliance_guard` trigger 통과 위해 미리 INSERT 하는 compliance_record row. `metadata @> '{"sentinel":true}'` 패턴.
- **Magic link** vs **Demo auto-login**: 정상 인증 vs `DEMO_ADMIN_AUTO_LOGIN_EMAIL` env 기반 우회 (`/[instanceSlug]/demo-admin-enter`).

## 아키텍처 핵심

### Multi-tenant (Single DB + RLS)
- 모든 tenant table 에 `instance_id UUID NOT NULL` + `tenant_isolation` policy (`current_setting('app.current_instance_id')` 매칭).
- DB 호출 **반드시** `withTenantTransaction` (admin) / `withPublicTenantTransaction` (site) 안. raw `getSqlBase()` 는 service-role 한정.

### 3-Layer
- **Core**: `packages/core-content` + `docs/core/` (DATA_MODEL · SCHEMA_MAPPING · CONTENT_STANDARDS).
- **Preset**: Feature Modules (compliance-assistant · notifications · analytics-reporting · search-visibility · keyword-monitoring · asset-ingestion · crm-sync · content-migration).
- **Instance**: `clinic_profile.metadata` JSONB (C 하이브리드 — pillars/principles/stats/strengths/copy 5 키).

### C 하이브리드 metadata 패턴
site page 는 항상 `clinic.metadata.X.length > 0 ? clinic.metadata.X : FALLBACK_HARDCODE`. 어드민에서 비우면 fallback, 채우면 instance custom.

### Workflow & Compliance
- `ContentPublicationStatus` 9 상태 머신. **`WorkflowActionButtons` 만 전이** (form `status` field 미사용).
- 모든 `status='published'` row 는 sentinel ComplianceRecord 매핑 필수.
- 의료법 제56조 / 시행령 제23·24조: 검증 안 된 수치 hardcode 금지 — `clinic.metadata.keyStats` 안 source 명시.

## 코딩 규칙

**금지 패턴**:
- `app/__xxx/` 또는 `app/_xxx/` 경로 — Next.js private folder 라 routing 제외. URL 노출용 route 는 underscore 미사용.
- raw `getSqlBase()` 호출 (service-role 외) — RLS bypass 위험.
- server action 안 직접 status 변경 — WorkflowActionButtons 만.
- DB password env 안 URL-unsafe char (`/`·`+`·`=`) 그대로 — `%2F`·`%2B`·`%3D` 로 encode.

**선호 패턴**:
- Server Component 안 독립 query 는 `Promise.all` 병렬화.
- slug regex `^[a-z0-9][a-z0-9-]{2,63}$` (한글 미지원).
- commit 메시지 한국어 + `feat:`/`fix:`/`chore:`/`perf:` 접두 + 본문 bulleted.
- DATA_MODEL 변경 cascade: migration C{NNNN} + `core-content/src/schema.ts` + db-projection + site SELECT 4곳 동시.

## Production 배포 (Supabase + Vercel)

**Supabase Pooler**:
- 마이그레이션·seed: **Session pooler (5432)** — `aws-0-<region>.pooler.supabase.com:5432`
- Vercel 런타임: **Transaction pooler (6543)** — 동일 host · 6543
- Direct (`db.<ref>.supabase.co:5432`) 는 IPv6 — Vercel/Windows 에서 ENOTFOUND. 사용 금지.
- Username 형식: 모든 role `<role>.<project-ref>` (예: `postgres.dzyagyqwltvjtlnkctsy`).

**Supabase 제약**:
- Custom role (e.g., `app_public_reader`) 는 Supavisor 안 자동 등록 안 됨 → ENOTFOUND. `WEB_PUBLIC_DATABASE_URL` 도 admin URL 사용 (보안 trade-off · demo 한정).
- DB password 안 URL-unsafe char (`/`·`+`·`=`) 회피 — hex/alphanumeric 권장.

**Migration 순서**:
1. `scripts/init-prod-roles.sql` — pgcrypto + app_tenant_user (NOLOGIN NOBYPASSRLS)
2. `scripts/init-prod-auth.sql` — admin_user · instance_membership · session · verificationToken · audit_event (spike-e migrations 03~04)
3. `pnpm migrate-prod` — manifest 22 entries (C0001~C0019 + D0010/D0011/D0014)
4. `pnpm migrate-late` — manifest 외 18 entries (C0021~C0029, LL-DEFER-20 본 구현 시 통합 예정)
5. `pnpm seed --email --display-name --instance-slug --instance-name`
6. `pnpm run-sql scripts/seed-demo-rich.sql`
7. `pnpm sync-prod-from-dev` (dev → prod 콘텐츠 이전)

**Vercel 빌드**: `apps/web/package.json` 의 build script 가 `pnpm --filter='@glitzy/web^...' run build && next build`. workspace package dist 사전 생성.

## SQL 실행 (Windows · psql 미설치)

- `apps/web/scripts/run-sql.ts` 가 postgres.js 클라이언트. `.env` 의 `SEED_DATABASE_URL` 사용.
- `\set ON_ERROR_STOP` 등 psql 메타 명령은 자동 제거.
- `DO $$ ... $$` 안 `RAISE NOTICE` 는 `[NOTICE] ...` 로 stdout 노출.

## 참조 문서

- `@docs/ARCHITECTURE.md` — 최상위 spec (3-layer · Control/Data Plane · Feature Modules)
- `@docs/decisions/<PLAN>.md` — 각 feature 의 Codex 비평 acceptance plan (변경 전 확인 필수)
- `@memory/MEMORY.md` — sessions 누적 학습 (milestone · feedback · reference)

## 변경 이력

규칙 추가/수정 시 날짜 + 사유를 한 줄로.

- **2026-05-20**: 본 CLAUDE.md 재구성 (자체 검증 / 도메인 용어 / production 배포 / 점진 개선 안내 추가)
- **2026-05-20**: production 첫 deploy (Supabase Seoul + Vercel iad1). Pooler 분리·password URL-safe·custom role 제약 등 incident 교훈을 "Production 배포" 섹션에 정리
- **2026-05-20**: Next.js `_` prefix folder = private (routing 제외) 규칙 추가 — `__demo-admin-enter` 404 incident 후
- **2026-05-20**: manifest 외 마이그레이션 (C0021~C0029) 사실 추가 — migrations-runner 본 구현 (LL-DEFER-20) 시 통합 예정
- **2026-05-20**: admin 페이지 query Promise.all 병렬화 — clinic-profile 4 RTT → 1 RTT 등
- **2026-05-21**: `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` v1.0 acceptance — Phase 4 본 구현 (SVO-DEFER-04). compliance 검수 큐와 분리된 readiness 기반 운영자 view (`/admin/<slug>/improvement-queue`). 5 카테고리 (low-readiness · evidence-missing · seo-improve · stale · relations-thin) + healthy 요약. `seo_readiness_snapshot` 의 단일 SQL polymorphic JOIN + TS 분류 + zod 방어. DB 변경 없음. 대시보드 3 카드 (UnlinkedEvidence·Stale·LowReadinessPublished) 에 deep-link 도입.
- **2026-05-21**: `docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md` v1.0 acceptance — Phase 2 본 구현 (SVO-DEFER-01). 키워드 CRUD + 콘텐츠 매핑 UI (★ primary toggle) + parent primary 검증 + primary 삭제 차단 + 5 entity delete 안 keyword link orphan cleanup + KeywordCoverageCard denominator 정정 (active 만 분모 · won 별도 footer). `/admin/<slug>/keywords` 가 진짜 운영 도구로 활성화 — readiness `title-has-target-keyword` check 가 실 데이터로 동작 시작.
- **2026-05-21**: `docs/decisions/EVIDENCE_LINKING_PLAN.md` v1.0 acceptance — Phase 3 본 구현 (SVO-DEFER-03). content_entity_link 의 실제 selector UI (EvidenceLinkPanel · MultiSelectField v1) + 5 save/delete action 안 link diff + orphan cleanup + readiness on-change + site SSR inverse 섹션 + JSON-LD `articleEntity.citation/mentions` + `medicalProcedureEntity.citation` enrichment. polymorphic link 패턴이 실제 동작하기 시작 — readiness `has-evidence-link` check 가 운영자가 link 추가 시 즉시 pass 로 전환.
- **2026-05-21**: `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 acceptance — 어드민 패러다임을 "CMS" → "SEO/GEO 운영 콘솔" 로 전환 첫 cycle. Phase 0 (C0031~C0034 — keyword_target · keyword_content_link · content_entity_link · seo_readiness_snapshot 4 entity, manifest 외) + Phase 1 (readiness lib v1 + `/admin/<slug>` 안 6 카드 노출 운영 현황 + 콘텐츠 재고 축소 유지 + keywords placeholder). 후속 phase 권장 순서: 3 (근거 연결 UI) → 2 (키워드 전략) → 4 (검수 큐 재활성화) → 5 (Search Console 연동) → 6 (콘텐츠 캘린더). polymorphic link 패턴 (`source_type` + `target_type` + `relation_type`) 은 `compliance_record` 답습 — TEXT + CHECK whitelist (enum 미사용).
- **2026-05-21**: 상단에 "현재 milestone" 한 줄 + 빌드 표 안 "단위 테스트 한 파일/패턴" 행 추가 (vitest 단일 실행 명령) — 신규 session 위치 파악·디버깅 효율 보강.
- **2026-05-21**: `docs/decisions/SEARCH_VISIBILITY_INGEST_PLAN.md` v1.0 acceptance — Phase 5 본 구현 (SVO-DEFER-05). 외부 검색 노출 데이터 ingestion 도입 — C0035~C0037 (search_property · search_visibility_snapshot · search_sync_state · sync lock 컬럼 포함 · manifest 외) + GSC client (자체 JWT + queryAnalytics + 429/500 retry + zod) + sync server actions (UPSERT lock + try/finally unlock + per-row CHECK skip → partial 상태 + 30분 stale lock 자동 해제) + `/visibility-metrics` 페이지 (property CRUD = super-admin · sync = operator · 7일 weighted aggregate · inline svg sparkline) + runbook (`docs/runbooks/SEARCH_CONSOLE_SETUP.md`) + demo-admin-enter route 안 super-admin 지원 추가 (is_super_admin=true 안 membership 검증 skip + session.superAdminSelectedInstanceId 자동 set). v1.1·v1.2 후속 cycle — 대시보드 카드 / keyword·entity edit mini card / vitest fixture.
- **2026-05-22**: `docs/decisions/NAVER_SEARCH_INGEST_PLAN.md` v1.0 acceptance — Phase 5.1 본 구현. NSA (네이버 서치어드바이저) 의 CSV/엑셀 export 미제공 + 시계열 데이터 부재 환경 정합 — clipboard paste main path + 스냅샷 모드 (운영자 기준 날짜 입력) + 2-layer sentinel (page_url=`''` · avg_position=`1000` + metadata.positionUnavailable=true) + HTML/TSV/multi-space/CSV robust parser (cheerio 재사용 · 공백 query 정합) + 3 tx atomicity (lock·ingestion·release 분리). C0038 (verification_method NOT NULL + 4 method CHECK) + C0039 (svs.metadata jsonb) prod 적용. AddPropertyForm dual source (GSC + NSA) + verification_method dropdown. aggregateWeightedFiltered 안 positionUnavailable row skip. 외부 Codex 비평 3 cycle 22건 흡수 + vitest 14/14 PASS. NSI-CASCADE 6건. v1.x — source filter tab · NSA OpenAPI · gap 분석 별 cycle.
- **2026-05-22**: Admin demo auto-login NODE_ENV 조건 제거 — DEMO_ADMIN_AUTO_LOGIN_EMAIL env set 만으로 production 포함 자동 진입. `(admin)/layout.tsx` + `(admin)/admin/[instanceSlug]/layout.tsx` (신규) + `(admin)/admin/page.tsx` + `sign-in/page.tsx` 4곳 분기. 첫 클라이언트 production 화 시 반드시 복구 필요 — `memory/milestone_admin_auto_login_dev_v1.md` 참조. NSA verification 정합 위해 root URL (`/`) 응답을 307 redirect → 200 landing 으로 변경 (root layout 안 naver-site-verification meta tag).
