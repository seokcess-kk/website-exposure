# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!--
이 파일은 점진적으로 개선됩니다.
규칙·아키텍처 결정의 변경 사유만 "변경 이력" 섹션에 한 줄씩 추가하세요.
session 별 누적 작업 narrative 는 `@memory/MEMORY.md` 와 git log 에 위임합니다.
-->

## 프로젝트 개요

Glitzy 의료기관 웹사이트 노출 솔루션 — 네이버 검색 신뢰도 (2025-2026 AI 브리핑·통합 랭킹) 정합. 첫 클라이언트: 다이트한의원 인천 부평점.

**핵심 가정**: 코드가 클라이언트 수에 선형 증가하지 않도록 **3-layer (Core / Preset / Instance) + multi-tenant 단일 DB + RLS** 로 설계. 어드민이 Control Plane(상태·승인), 정적 사이트가 Data Plane(렌더링) — Admin-first.

**스택**: Next.js 14 (App Router) · TypeScript · pnpm workspace · Supabase Postgres · postgres.js · drizzle · Tailwind · Vercel

**현재 milestone**: 사용자 SoT (a)(b)(c) plan 3종 + ADMIN_PERMISSION_SEPARATION/BUSINESS_ENTITIES v1 acceptance. session 별 누적 진행은 `@memory/MEMORY.md` entry + `git log` 참조. 잔여 = NSA v1.x (OpenAPI · gap 분석) + CAI/CCAL/MTL/NPL-DEFER 다수.

## 빌드 & 실행

| 작업 | 명령 |
|---|---|
| 웹 dev 서버 | `pnpm web:dev` |
| 웹 빌드 (packages → next) | `pnpm web:build` |
| 전체 typecheck | `pnpm typecheck:all` |
| 단위 테스트 (vitest 전체) | `pnpm --filter @glitzy/web test:scenarios` |
| 단위 테스트 한 파일/패턴 | `pnpm --filter @glitzy/web exec vitest run <path-or-pattern>` (예: `... vitest run src/lib/markdown.test.ts` · `... vitest run -t "근거 link"`) |
| Playwright E2E smoke | `pnpm --filter @glitzy/web test:e2e` (UI 안 `test:e2e:ui` · port 3000 default · `E2E_PORT` override) |
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
- **2026-05-21**: 상단에 "현재 milestone" 한 줄 + 빌드 표 안 "단위 테스트 한 파일/패턴" 행 추가 (vitest 단일 실행 명령) — 신규 session 위치 파악·디버깅 효율 보강.
- **2026-05-28**: 변경 이력 안 session milestone 서술 (2026-05-21 이후 13건) 을 `@memory/MEMORY.md` 로 위임. CLAUDE.md 안 변경 이력은 "규칙·아키텍처 결정의 변경 사유" 만 한 줄씩 유지 (init 가이드 정합).
- **2026-05-28**: `docs/decisions/CONTENT_AI_DRAFT_PLAN.md` v1.0 acceptance (5 cycle 39건 self-critique 수렴) + code 본 구현. CAI-DEFER-02 본 구현 — 신규 article `/admin/<slug>/articles/new` form 안 "AI Draft 생성" panel 합류 (scope B Full draft + 기존 publication 추천). 사용자 SoT — 키워드 입력 시 노출 가능한 형태의 칼럼 작성. DB 변경 = C0047 (llm_call_log.prompt_template CHECK 안 'article-full-draft' 추가 · manifest 외). weight 5 quota · llm_call_log 안 input/output prompt 저장 X (PII 안전) · server-side validation (title 1~200 · summary 80~200 · body 800~1500 · H2 3~5) · LLM hallucinate publication.id whitelist filter · publication 매칭 2 단계 (keyword_content_link 우선 + ILIKE fallback) + publicationType E-A-T sort. 53 신규 vitest PASS (prompt-templates 11 신규 + article-full-draft 17 + llm-audit 3 + llm-usage-summary 보정 2 + 기타) 누계 305 PASS · pre-existing slugify SLG-02 1 fail 무관. typecheck PASS · web:build PASS · e2e smoke 18번째 시나리오 추가. CAID-DEFER 16건 (CAID-DEFER-16 v1 합류 = 15건 남음).
- **2026-05-28**: CAID-DEFER-16 v1 합류 — brief 2-stage opt-in mini button. 사용자 cycle 안 즉시 합류 결정. C0048 migration (article-brief-draft CHECK · manifest 외) + lib/ai/article-brief-draft.ts (weight 1) + useArticleBriefDraft hook + ArticleFullDraftPanel 안 textarea 옆 mini button "brief 자동 생성 ✨ (1 quota)" + brief overwrite confirm + error banner. 7 신규 vitest PASS (system prompt 안 의료광고법 + 4 요소 패턴 + 50~200 강제 · output schema boundary). 누계 312 PASS. typecheck PASS · web:build PASS.
- **2026-05-28**: CONTENT_AI_DRAFT v1.1 SEO/GEO 강화 — 사용자 진단 후 상위 3건 즉시 합류. (1) bodyMarkdown 800~1500자 → 1500~2500자 long-form + weight 5→7 + maxTokens 2048→3072 (2) first sentence TL;DR + 정의 패턴 prompt 강제 (LLM 첫 문장 추출 + Google Featured Snippet + 네이버 지식 카드 친화) (3) 마지막 H2 = "## 자주 묻는 질문" FAQ block 강제 (Q&A 3~4쌍 · `### Q. <질문>` 형식 · Google FAQ rich snippet + GEO direct answer). H2 count 3~5 → 4~6. list/table 적극 권장. 키워드 밀도 1~2% 명시. 누계 314 PASS · typecheck PASS · web:build PASS.
- **2026-05-28**: CONTENT_AI_DRAFT v1.2 slug LLM 직접 생성 + ArticleForm SeoMetaSuggestionPanel 제거 — 사용자 진단 (SEO 메타 metaDescription 20~160 vs article.summary 80~200 mismatch). (a) ArticleForm 안 SeoMetaSuggestionPanel mount + import 제거 (FaqForm/TreatmentPageForm 유지). (b) articleFullDraftOutputSchema 안 slug 필드 추가 (regex `^[a-z0-9][a-z0-9-]{2,99}$`) + system prompt 안 slug 규칙 (영문 transliteration 권장) + validateLlmOutput slug-invalid-format 신규 reason + onApply 안 slug setV + markSlugDirty 호출. 8 신규 vitest PASS · 누계 322 PASS · typecheck PASS · web:build PASS.
