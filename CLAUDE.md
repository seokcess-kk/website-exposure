# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Glitzy 의료기관 웹사이트 노출 솔루션. 네이버 검색 신뢰도 강화 흐름(2025~2026 AI 브리핑·신뢰도 통합 랭킹) 에 정렬된 의료기관(첫 클라이언트: 다이트한의원) 웹사이트 솔루션의 **monorepo**.

**핵심 가정**: 코드가 클라이언트 수에 선형 증가하지 않도록 **3-layer (Core / Preset / Instance)** + **multi-tenant 단일 DB + RLS** 로 설계됨. 어드민이 Control Plane(상태·승인), 정적 사이트가 Data Plane(렌더링) — Admin-first.

## 명령어

| 작업 | 명령 |
|---|---|
| 웹 dev 서버 | `pnpm web:dev` (Next.js 14 dev) |
| 웹 빌드 | `pnpm web:build` (packages 먼저 빌드 → next build) |
| 전체 typecheck | `pnpm typecheck:all` (packages → web) |
| packages 빌드 | `pnpm pkg:build` (순서: shared-types → shared-errors → db → auth → storage → notifications-outbox → migrations-runner → core-content) |
| 웹 단위 테스트 | `pnpm --filter @glitzy/web test:scenarios` (vitest) |
| 단일 vitest 실행 | `pnpm --filter @glitzy/web test:scenarios -t "테스트명"` |
| 초기 seed (instance 부트스트랩) | `pnpm web:seed --email=... --display-name=... --instance-slug=demo --instance-name=...` |
| SQL 파일 실행 (psql 없이 Windows) | `pnpm --filter @glitzy/web run-sql apps/web/scripts/<file>.sql` |
| prod migration | `pnpm --filter @glitzy/web migrate-prod` |

## monorepo 구조

```
apps/
  web/          ← @glitzy/web · Next.js 14 (App Router) · 어드민 + 공개 사이트 통합
  spike-{a,b,c-local,d,e}/  ← 검증된 패턴 prototype (참고 — 본 구현은 packages/로 승격됨)
packages/
  db/                  ← @glitzy/db · drizzle + postgres.js · withTenantTransaction + RLS scopedDb
  auth/                ← @glitzy/auth · magic link · HMAC session · resolveTenantContext · 14-action eligibility
  storage/             ← @glitzy/storage · R2/MinIO 정합 · signed URL TTL-bound bearer (Spike C)
  notifications-outbox/ ← @glitzy/notifications-outbox · outbox SKIP LOCKED · idempotent at-least-once (Spike B)
  migrations-runner/   ← @glitzy/migrations-runner · advisory lock + drift definition-aware (Spike D)
  core-content/        ← @glitzy/core-content · DATA_MODEL C-01~C-25 drizzle schema + migrations/C0001~C0029
  compliance-rules/    ← @glitzy/compliance-rules · 의료광고법 RiskRule 카탈로그 · check() 9-step pipeline
  shared-types/        ← 공통 타입 (PrimaryCta · BusinessHours 등)
  shared-errors/       ← TenantResolveError · AuthDeniedError 등 도메인 에러
docs/
  ARCHITECTURE.md      ← 최상위 spec (3-layer · Control/Data Plane · Feature Modules)
  admin/ARCHITECTURE.md, REVIEW_WORKFLOW.md
  core/CONTENT_STANDARDS · DATA_MODEL · DESIGN_TOKENS · PAGE_TYPES · SCHEMA_MAPPING · SEARCH_STANDARDIZATION
  decisions/<PLAN>.md  ← 각 feature 의 acceptance plan (Codex 비평 cycle 결과)
  features/            ← Feature Module 별 spec
```

## 아키텍처 핵심

### Multi-tenant (Single DB + RLS)

- 모든 site URL 은 `/[instanceSlug]/...` path 기반. instance 별 별도 DB 없음.
- 모든 tenant table 에 `instance_id UUID NOT NULL` + `RLS POLICY tenant_isolation` 적용 (`current_setting('app.current_instance_id')` 매칭).
- DB 호출은 **반드시** `withTenantTransaction(scopedDb)` (admin) 또는 `withPublicTenantTransaction` (site) 안에서. raw `getSqlBase()` 는 service-role 한정.
- pgbouncer 사용 시 `userlist.txt` 안 `app_tenant_user` 등록.

### 3-Layer 콘텐츠 표준

- **Core** (`packages/core-content`, `docs/core/`): 전 instance 공통 entity 계약 (DATA_MODEL C-01~C-25) + 의료광고법 표준 + SCHEMA_MAPPING (JSON-LD).
- **Preset** (Feature Modules): notifications · compliance-assistant · asset-ingestion · crm-sync · analytics-reporting · search-visibility · keyword-monitoring · content-migration. Instance 가 선택 장착.
- **Instance** (`clinic_profile.metadata` JSONB 등): instance 별 customize. Phase 4 C 하이브리드로 pillar/principles/stats/strengths/copy 5 키 운영.

### Admin / Site 분리 (App Router)

- `apps/web/src/app/(admin)/` — 어드민 (operator/admin/legal-reviewer 역할별 eligibility 적용)
- `apps/web/src/app/(site)/[instanceSlug]/` — 공개 site (SSR + ISR `revalidate=60` + JSON-LD)
- 두 평면이 같은 DB 공유. site 는 `loadSiteInitial(slug)` 로 clinic + location 동시 로드 + cache.

### Workflow & Compliance

- ContentPublicationStatus 9 상태 머신 + `WorkflowActionButtons` 로만 전이 (form `status` field 미사용).
- `published_content_compliance_guard` trigger → 모든 `status='published'` row 는 sentinel `ComplianceRecord` 매핑 필수. seed 안 사전 INSERT 필요 (`seed-demo-rich.sql` § (9) 패턴).
- 의료법 제56조 / 시행령 제23·24조 표현 risk: 검증 안 된 수치 (예: "10년+ 임상", "1만 케이스") 는 page hardcode 금지. `clinic.metadata.keyStats` 안 source 명시.

### SEO / JSON-LD (`apps/web/src/lib/json-ld/`)

- `MedicalClinic` · `Organization` · `Physician` · `Article` · `ScholarlyArticle` · `FAQPage` · `BreadcrumbList` · `WebSite` graph 자동 생성.
- 모든 site page 는 `buildPageMetadata(clinic, instanceSlug, {...})` 사용 — title 30자 truncate · canonical absolute URL · OG/Twitter card 통합.

## C 하이브리드 metadata 패턴 (Phase 1~4 완료)

페이지 컨텐츠를 hardcode 가 아닌 DB 에서 관리:

| 데이터 | 저장 위치 | 어드민 입력 | 부재 시 |
|---|---|---|---|
| 4 진료 영역 카드 | `clinic_profile.metadata.treatmentPillars` | ClinicProfile 폼 → `ClinicMetadataEditor` row 편집 | `TREATMENT_PILLARS_FALLBACK` hardcode |
| 3원칙 | `clinic_profile.metadata.standardPrinciples` | 동일 | `STANDARD_PRINCIPLES_FALLBACK` |
| 임상 통계 | `clinic_profile.metadata.keyStats` (sentinel `__publications_count__` 자동 치환) | 동일 | hardcode |
| 시스템 강점 | `clinic_profile.metadata.systemStrengths` | 동일 | `SYSTEM_STRENGTHS_FALLBACK` |
| 섹션 카피 | `clinic_profile.metadata.sectionCopy` | 동일 | page hardcode |
| 시술 → pillar | `treatment_page.pillar_slug` 컬럼 | TreatmentPage 폼 → pillar select | 미분류 |
| 시술별 3원칙 override | `treatment_page.metadata.principles` | TreatmentPage 폼 → `TreatmentPrinciplesEditor` | clinic.standardPrinciples |

site 페이지 (`page.tsx`) 는 항상 `clinic.metadata.X.length > 0 ? clinic.metadata.X : FALLBACK_HARDCODE` 패턴.

## SQL 실행 워크플로우 (Windows + psql 미설치 환경)

- `apps/web/scripts/run-sql.ts` 가 PostgreSQL 클라이언트. `tsx --env-file=.env` 로 실행되어 `.env` 의 `SEED_DATABASE_URL` 사용.
- `\set ON_ERROR_STOP` 등 psql 메타 명령은 자동 제거.
- `DO $$ ... $$` 안 `RAISE NOTICE` 출력은 `[NOTICE] ...` 형식으로 stdout 노출.
- root 또는 `apps/web` 어느 디렉터리에서도 실행 가능 (cwd + monorepo root 두 base 자동 시도).

## 검증된 Spike 패턴 (참고)

`apps/spike-{a..e}` 는 prototype 으로 검증 완료 → `packages/` 로 승격됨. 새 기능 도입 시 spike 패턴 참고:

- **A**: tenant RLS · withTenantTransaction · advisory lock migrate · pgbouncer userlist
- **B**: outbox SKIP LOCKED · idempotent at-least-once with exactly-once observable · failure injection 10 point
- **C**: signed URL TTL-bound bearer · RefreshPolicy · URL audit scrubber 14 pattern
- **D**: Drizzle Kit + raw SQL mixin · drift definition-aware · forward-only hotfix · expand/contract phase별 stopAfter
- **E**: magic link (CAS one-time) · HMAC signed session · resolveTenantContext · 14-action eligibility

## docs/decisions/ — 의사결정 누적

각 feature/plan 은 Codex CLI 자동 비평 5+ 사이클을 거쳐 수렴된 acceptance plan. 변경 전 관련 PLAN.md 확인 필요. 핵심:

- `ADMIN_UX_REDESIGN_PLAN.md` — 5단계 wizard · entity-CRUD → 출시 워크스페이스
- `LOCATION_LEGAL_PLAN.md` — ClinicProfile + LocationProfile + LegalDocument 5종 통합
- `EAT_CONTENT_PLAN.md` — Publication · MediaAppearance · FAQ · ArticleCategory v0.1
- `INFRA_DECISIONS_DRAFT.md` — Supabase + Vercel · Cloudflare R2 · Resend · Sentry · Upstash
- `PUBLIC_SITE_RENDER_PLAN.md` — site 페이지 + JSON-LD graph + sitemap/robots

## 컨벤션 / 주의

- **commit 메시지 한국어**. 첫 줄 `feat:`/`fix:`/`docs:` 접두 + 한 줄 요약. 본문 bulleted.
- 시술/의료진 slug regex: `^[a-z0-9][a-z0-9-]{2,63}$` (영문/숫자/하이픈만 — **한글 미지원**)
- ContentStatus 전이는 `WorkflowActionButtons` 만. server action 안 직접 status 변경 금지.
- 모든 SELECT 는 RLS 통과. `app.current_instance_id` 미설정 시 0 row.
- DATA_MODEL 변경 시 cascade: migrations C{NNNN} + `packages/core-content/src/schema.ts` + db-projection + site SELECT 4곳 동시 갱신.
