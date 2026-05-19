Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3927-dc58-7710-b03b-62effad8b38e
--------
user
You are reviewing the **plan** `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model decisions, routing, RLS/permission, JSON-LD, SEO/AEO/GEO standards, design tokens, scenarios.

## SoT to read

1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 — the plan under review.
2. `docs/core/PAGE_TYPES.md` — 14 mandatory page types · M0 게이트 #1.
3. `docs/core/SCHEMA_MAPPING.md` — JSON-LD graph 구성 SoT (§ 1·§ 2·§ 3).
4. `docs/core/SEARCH_STANDARDIZATION.md` — robots.txt · sitemap.xml · AI 크롤러 4계열 (§ 5).
5. `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
6. `docs/core/DATA_MODEL.md` v0.9 — C-01~C-26.
7. `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier · semantic 22 · light/dark.
8. `docs/admin/ARCHITECTURE.md` v0.7 — § 3 Vertical Slice · § 3.11 게이트 #1.
9. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument · CT-02 businessHours · primaryCtas.
10. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 — LL-CASCADE-04 placeholder.
11. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit · § 8.1 시나리오 · 어드민 URL 패턴.
12. `packages/core-content/src/schema.ts` v0.3 — Drizzle SoT.
13. `packages/db/migrations/D0010_instance.sql` · `packages/auth/...` (resolveTenantContext).
14. `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04 target).
15. `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 URL 패턴 · PSR-CASCADE-01 의 출발점).
16. `apps/web/src/lib/{db,tenant,page-context,env}.ts` (어드민 컨텍스트 패턴).

## What to check (cycle 1)

### Plan SoT 합치
- 모든 PSR-* 결정 (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) 이 reference SoT 와 일관
- PAGE_TYPES 의 P-001~P-014 10개 minimal 선택 정합
- SCHEMA_MAPPING § 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 정합 (특히 풀 entity vs 참조)
- DESIGN_TOKENS v1.0 의 light/dark · semantic 22 · primitive 카탈로그 통합 정합
- CONTENT_STANDARDS § 7.1.1.1 LegalDocument 면제 정합 (LegalRenderer 경로)
- DATA_MODEL C-01~C-21 의 필드 매핑 (Hero/About/Doctor/Treatment/Article/Location/Legal)
- ADMIN_UI_SKELETON v1.0 acceptance commit 후 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 영향

### 데이터 접근 / 권한
- 신규 PostgreSQL role `app_public_reader` 의 권한 설계 (RLS USING `instance_id` · GRANT SELECT only)
- `withPublicTenantTransaction` helper 가 `withSkeletonTx` 와 어떻게 분리되는지 (audit emit 권한 없음 · session 없음)
- `WEB_PUBLIC_DATABASE_URL` 분리 + pgbouncer userlist cascade
- status filter (`status='published' AND published_at <= now()`) 정확성 — 미래 publishedAt 제외
- LegalDocument 의 status='draft' 노출 정당화 (v0.1 한정 · LL-DEFER-01 합류 시점까지)
- 페이지 부재 시 `notFound()` (404) — Next 14 server component 한계 (HTTP 404 status 보장 OK)

### 라우팅
- `/<instanceSlug>/...` path-based 와 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 — 기존 sign-in/sign-out/cleanup/api route 영향
- (site) route group 의 layout 격리 (html/body 중복 회피 — Next.js root layout 정책)
- 도메인 매핑 cascade marker (PSR-DEFER-02)

### JSON-LD / SEO
- SCHEMA_MAPPING § 1.2 `@id` 패턴 (`https://{domain}/#organization`) 의 v0.1 path-based 변형 정합
- `@graph` 통합 방식 (페이지당 단일 `<script>`)
- BreadcrumbList Home 제외 모든 페이지 출력 정합
- `inLanguage` CreativeWork only 정합
- canonical · OpenGraph · Twitter · robots metadata API 표현
- sitemap.xml route handler 의 lastmod · changefreq · priority 결정
- robots.txt 의 AI 크롤러 4계열 (SEARCH_STANDARDIZATION § 5 — GPTBot/ClaudeBot/PerplexityBot/Naverbot) 정합

### 디자인 토큰
- Tailwind v3.4 안 DESIGN_TOKENS v1.0 semantic 22 통합 방식 (`colors.canvas`·`colors.fg.default`·...)
- light/dark 분기 (`darkMode: ['class', '[data-theme="dark"]']`)
- CSS custom property 와 Tailwind class 의 매핑 정합

### XSS / 보안
- Markdown 렌더 라이브러리 선택 + DOMPurify 또는 sanitize-html 적용
- 외부 링크 `rel="nofollow noopener"` 자동 처리
- `app_public_reader` SQL injection 방어 (parameterized query)
- audit emit 권한 없음 — 공개 페이지 access log 분리

### 시나리오
- 1~20 가 minimal 검증 충분한가
- v0.1 단계에서 검증 어려운 시나리오 (16 dark mode · 18 JSON-LD validator) marker 명시

### Cascade markers (acceptance precondition)
- PSR-CASCADE-01: 어드민 URL `/admin` prefix — apps/web 디렉토리 구조 변경 + ADMIN_UI_SKELETON code v1.0 patch
- PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 v0.1 marker
- PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2 patch
- PSR-CASCADE-04: migrations-runner manifest 10단계
- PSR-CASCADE-05: pgbouncer userlist

## Output format (markdown)

```
# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **PSR-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(SoT): <인용>
  - 문제: ...
  - 권장 patch: ...

## major
- **PSR-NN**: ...

## minor
- **PSR-NN**: ...

## cascade marker / acceptance precondition 점검
- PSR-CASCADE-01~05: <PASS|FAIL|TBD>
```

가능한 한 광범위하게 보고, 추측이 아니라 실제 SoT 파일을 읽고 line 단위로 인용하라. 한국어로 응답.

codex
`seo-geo` 스킬이 이 검토 범위(SEO/AEO/GEO, JSON-LD, 검색 표준)에 걸려 있어 해당 지침을 함께 확인하겠습니다. 먼저 지정된 SoT 파일과 관련 코드의 실제 라인을 수집해 근거 기반으로 리뷰하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path C:\\Users\\assag\\solution\\website-exposure\\.agents\\skills\\seo-geo\\SKILL.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files' in C:\Users\assag\solution\website-exposure
 succeeded in 920ms:
tsconfig.base.json
skills-lock.json
pnpm-workspace.yaml
pnpm-lock.yaml
package.json
handoff\glitzy-website-audit.md
packages\storage\tsconfig.json
docs\research\REFERENCE_DEEP_DIVE_2026-05.md
docs\research\REFERENCE_ANALYSIS_2026-05.md
apps\web\tsconfig.json
apps\web\tailwind.config.ts
packages\storage\src\tenant-context.ts
packages\storage\src\storage-client.ts
packages\storage\src\sign-url.ts
packages\storage\src\index.ts
packages\storage\src\errors.ts
packages\storage\src\config.ts
packages\storage\src\audit-log.ts
packages\storage\package.json
packages\migrations-runner\tsconfig.json
packages\core-content\tsconfig.json
apps\spike-c-local\tsconfig.scenarios.json
apps\spike-c-local\tsconfig.json
docs\features\search-visibility.md
docs\features\notifications.md
docs\features\keyword-monitoring.md
docs\features\crm-sync.md
docs\features\content-migration.md
docs\features\compliance-assistant.md
docs\features\asset-ingestion.md
docs\features\analytics-reporting.md
packages\db\tsconfig.json
packages\shared-errors\tsconfig.json
apps\spike-a\tsconfig.json
apps\spike-b\tsconfig.json
apps\spike-d\tsconfig.scenarios.json
apps\spike-d\tsconfig.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md
packages\shared-types\tsconfig.json
packages\shared-errors\src\index.ts
packages\shared-errors\package.json
packages\migrations-runner\src\manifest.ts
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\shared-types\package.json
docs\ARCHITECTURE.md
apps\spike-c-local\src\tenant-context.ts
apps\spike-c-local\src\storage-client.ts
apps\spike-c-local\src\sign-url.ts
apps\spike-c-local\src\seed.ts
packages\db\src\tenant.ts
packages\db\src\service-role.ts
packages\db\src\index.ts
packages\db\src\errors.ts
packages\db\src\advisory-lock.ts
packages\db\package.json
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
docs\decisions\PROVIDER_PASS_PLAN.md
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md
docs\decisions\PACKAGES_STRUCTURE.md
docs\decisions\M0_SCHEMA_PLAN.md
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\INFRA_DECISIONS_DRAFT.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
apps\spike-a\src\tenant.ts
apps\spike-a\src\service-role.ts
apps\spike-a\src\seed.ts
apps\spike-a\src\schema.ts
apps\spike-b\src\worker.ts
apps\spike-b\src\tenant.ts
apps\spike-b\src\seed.ts
apps\web\src\types\react-dom-stable.d.ts
apps\spike-d\src\service-role.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md
apps\spike-a\README.md
apps\spike-a\PROVIDER_RUNBOOK.md
packages\shared-types\src\index.ts
packages\notifications-outbox\tsconfig.json
packages\core-content\src\templates\__tests__.ts
packages\core-content\src\templates\render.ts
packages\core-content\src\templates\index.ts
packages\core-content\src\templates\bodies.ts
packages\core-content\src\schema.ts
docs\admin\REVIEW_WORKFLOW.md
docs\admin\ARCHITECTURE.md
packages\core-content\src\index.ts
packages\notifications-outbox\package.json
packages\core-content\package.json
apps\spike-b\src\db.ts
apps\spike-b\README.md
apps\spike-b\PROVIDER_RUNBOOK.md
apps\spike-b\package.json
apps\spike-c-local\src\scenarios\test-replay.ts
apps\spike-c-local\src\scenarios\test-range-request.ts
apps\spike-c-local\src\scenarios\test-method-confusion.ts
apps\spike-c-local\src\scenarios\test-list-bucket.ts
apps\spike-c-local\src\scenarios\test-isolation.ts
apps\spike-c-local\src\scenarios\test-content-type.ts
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
apps\spike-c-local\src\scenarios\provider-smoke.ts
apps\spike-c-local\src\scenarios\invariant-runner.ts
apps\spike-c-local\src\fixtures.ts
apps\spike-c-local\src\errors.ts
apps\spike-c-local\src\env.ts
apps\spike-c-local\src\audit-log.ts
apps\spike-c-local\PROVIDER_RUNBOOK.md
apps\spike-c-local\package.json
apps\spike-c-local\docker-compose.yml
apps\web\README.md
apps\web\postcss.config.mjs
apps\web\package.json
apps\web\next.config.mjs
packages\db\migrations\D0010_instance.sql
apps\spike-b\docker-compose.yml
docs\core\DESIGN_TOKENS.md
docs\core\DATA_MODEL.md
docs\core\CONTENT_STANDARDS.md
docs\core\SCHEMA_MAPPING.md
docs\core\PAGE_TYPES.md
docs\core\SEARCH_STANDARDIZATION.md
apps\spike-b\src\fake-provider.ts
apps\spike-b\src\failure-injection.ts
apps\spike-b\src\errors.ts
apps\spike-b\src\migrate.ts
apps\spike-b\src\fixtures.ts
apps\spike-b\src\outbox.ts
apps\spike-b\src\scenarios\provider-smoke.ts
apps\spike-b\src\scenarios\test-failure-injection.ts
apps\spike-b\src\scenarios\test-basic-100.ts
apps\spike-b\src\scenarios\test-idempotency.ts
apps\spike-a\package.json
apps\spike-b\src\scenarios\test-invariant-runner.ts
apps\spike-a\src\scenarios\test-invariant-runner.ts
apps\spike-a\src\scenarios\test-audit.ts
apps\spike-a\src\scenarios\provider-smoke.ts
apps\spike-a\src\migrate.ts
apps\spike-a\src\fixtures.ts
apps\spike-a\src\errors.ts
apps\spike-a\src\db.ts
apps\web\src\styles\globals.css
apps\web\src\seed.ts
apps\spike-a\src\scenarios\test-write.ts
apps\spike-a\src\scenarios\test-rollback.ts
apps\spike-a\src\scenarios\test-read.ts
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
apps\spike-a\src\scenarios\test-perf.ts
apps\spike-a\src\scenarios\test-nested-tx.ts
apps\spike-a\src\scenarios\test-negative.ts
apps\spike-d\src\migrate.ts
apps\spike-d\src\errors.ts
apps\spike-d\src\env.ts
apps\spike-d\src\drift-check.ts
apps\spike-b\src\scenarios\test-stale-reclaim.ts
apps\spike-b\src\scenarios\test-rls-mismatch.ts
apps\spike-b\src\scenarios\test-retry-permanent.ts
apps\spike-b\src\scenarios\test-no-cross-tenant.ts
apps\spike-d\drizzle.config.ts
apps\spike-d\docker-compose.yml
apps\spike-d\src\scenarios\test-staging-apply.ts
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts
apps\spike-d\src\scenarios\test-failure-rollback.ts
apps\spike-d\src\scenarios\test-expand-contract.ts
apps\spike-d\src\scenarios\test-drift-check.ts
apps\spike-d\src\scenarios\test-dev-apply.ts
apps\spike-d\src\scenarios\test-deploy-gate.ts
apps\spike-d\src\scenarios\test-canonical-generation.ts
apps\spike-d\src\scenarios\test-audit.ts
apps\spike-d\src\scenarios\test-advisory-lock.ts
apps\spike-a\pgbouncer\userlist.txt
apps\spike-a\pgbouncer\pgbouncer.ini
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
apps\spike-d\package.json
packages\notifications-outbox\src\provider-adapter.ts
packages\notifications-outbox\src\outbox.ts
packages\notifications-outbox\src\index.ts
packages\notifications-outbox\src\errors.ts
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql
apps\spike-b\migrations\007_provider_attempt_log.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
apps\spike-b\migrations\006_permanent_alert.sql
apps\spike-b\migrations\005_invariant_log.sql
apps\spike-b\migrations\004_external_call_log.sql
apps\spike-b\migrations\003_inbox.sql
apps\spike-b\migrations\002_outbox.sql
apps\spike-b\migrations\001_roles.sql
apps\spike-e\package.json
apps\spike-a\migrations\004_invariant_log.sql
apps\spike-a\migrations\003_audit_log.sql
apps\spike-a\migrations\002_content_test.sql
apps\spike-a\migrations\001_roles.sql
apps\spike-a\docker-compose.yml
apps\spike-e\tsconfig.scenarios.json
apps\spike-e\tsconfig.json
apps\spike-a\scripts\wait-db.js
apps\spike-e\PROVIDER_RUNBOOK.md
apps\spike-e\docker-compose.yml
apps\spike-d\docker\init-multi-db.sh
apps\spike-d\src\db\client.ts
apps\spike-d\src\db\schema.ts
apps\web\src\app\layout.tsx
apps\web\src\lib\tenant.ts
apps\web\src\lib\slug-resolver.ts
apps\web\src\lib\site-meta-fetch.ts
apps\web\src\lib\session-cookie.ts
apps\web\src\lib\save-result.ts
apps\web\src\lib\post-login-redirect.ts
apps\web\src\lib\page-context.ts
apps\web\src\lib\errors.ts
apps\web\src\lib\env.ts
apps\web\src\lib\deny-reason-map.ts
apps\web\src\lib\db.ts
apps\web\src\lib\clinic-profile-schema.ts
apps\web\src\lib\action-context.ts
apps\web\src\app\page.tsx
apps\spike-d\migrations\010_contract_check_constraint.sql
apps\spike-d\migrations\009_backfill_published_at.sql
apps\spike-d\migrations\008_expand_add_nullable.sql
apps\spike-d\migrations\007_tenant_audit_log_view.sql
apps\spike-d\migrations\006_audit_event.sql
apps\spike-d\migrations\005_migration_ledger.sql
apps\spike-d\migrations\004_audit_log.sql
apps\spike-d\migrations\003_instance_user_partial_unique.sql
apps\spike-d\migrations\002_content_test.sql
apps\spike-d\migrations\001_roles_and_extensions.sql
apps\web\scripts\local-pass.ts
packages\auth\tsconfig.json
apps\spike-e\src\magic-link.ts
apps\spike-e\src\fixtures.ts
apps\spike-e\src\errors.ts
apps\spike-e\src\env.ts
apps\spike-e\migrations\003_auth_session.sql
apps\spike-e\migrations\002_admin_user.sql
apps\spike-e\migrations\001_roles_extensions.sql
apps\spike-e\migrations\004_audit_event.sql
apps\spike-e\migrations\005_rls_test_table.sql
apps\spike-e\src\session.ts
apps\spike-e\src\audit.ts
apps\spike-e\src\seed.ts
apps\spike-e\src\migrate.ts
apps\spike-e\src\resolve-tenant-context.ts
packages\auth\package.json
apps\web\src\app\sign-out\route.ts
apps\web\src\app\(admin)\layout.tsx
apps\web\src\app\sign-in\page.tsx
apps\web\src\app\sign-in\actions.ts
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\components\forms\Field.tsx
apps\web\src\components\forms\DoctorProfileForm.tsx
apps\web\src\components\forms\DeleteForm.tsx
apps\web\src\components\forms\ClinicProfileForm.tsx
apps\web\src\components\forms\ArticleForm.tsx
apps\web\src\components\dev\MockMailbox.tsx
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
apps\spike-e\src\scenarios\test-invariant.ts
apps\spike-e\src\scenarios\test-invalid-instance-id.ts
apps\spike-e\src\scenarios\test-inactive-user.ts
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
apps\spike-e\src\scenarios\test-client-tampering.ts
apps\spike-e\src\scenarios\test-action-eligibility.ts
apps\spike-e\src\scenarios\provider-smoke.ts
apps\spike-e\src\scenarios\test-session-refresh.ts
apps\spike-e\src\scenarios\test-rls-integration.ts
apps\spike-e\src\scenarios\test-membership-removal.ts
apps\spike-e\src\scenarios\test-magic-link-login.ts
apps\spike-e\src\scenarios\test-super-admin-switch.ts
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
packages\auth\src\index.ts
packages\auth\src\errors.ts
packages\auth\src\config.ts
packages\auth\src\audit.ts
packages\auth\src\magic-link.ts
apps\spike-e\src\db\client.ts
packages\auth\src\resolve-tenant-context.ts
packages\auth\src\session.ts
apps\web\src\app\api\health\route.ts
apps\web\src\app\api\site-meta-fetch\route.ts
apps\web\src\app\sign-in\consume\route.ts
apps\web\src\app\(admin)\[instanceSlug]\page.tsx
apps\web\src\app\sign-in\cleanup\route.ts
packages\auth\src\internal\session-internal.ts
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\new\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\doctors\new\page.tsx

 succeeded in 965ms:
---
name: seo-geo
description: SEO & GEO (Generative Engine Optimization) for websites. Analyze keywords, generate schema markup, optimize for AI search engines (ChatGPT, Perplexity, Gemini, Copilot, Claude) and traditional search (Google, Bing). Use when user wants to improve search visibility, search optimization, search ranking, AI visibility, ChatGPT ranking, Google AI Overview, indexing, JSON-LD, meta tags, or keyword research.
---

# SEO/GEO Optimization Skill

Comprehensive SEO and GEO (Generative Engine Optimization) for websites. Optimize for both traditional search engines (Google, Bing) and AI search engines (ChatGPT, Perplexity, Gemini, Copilot, Claude).

## Quick Reference

**GEO = Generative Engine Optimization** - Optimizing content to be cited by AI search engines.

**Key Insight:** AI search engines don't rank pages - they **cite sources**. Being cited is the new "ranking #1".

## Workflow

### Step 1: Website Audit

Get the target URL and analyze current SEO/GEO status.

**Basic SEO Audit (Free):**
```bash
python3 scripts/seo_audit.py "https://example.com"
```
**Use this for**: Quick technical SEO check (title, meta, H1, robots, sitemap, load time). No API needed.

---

**Check Meta Tags:**
```bash
curl -sL "https://example.com" | grep -E "<title>|<meta name=\"description\"|<meta property=\"og:|application/ld\+json" | head -20
```

**Use this for**: Quick check of essential meta tags and schema markup on any webpage.

---

**Check robots.txt:**
```bash
curl -s "https://example.com/robots.txt"
```

**Use this for**: Verify which bots are allowed/blocked. Critical for ensuring AI search engines can crawl your site.

---

**Check sitemap:**
```bash
curl -s "https://example.com/sitemap.xml" | head -50
```

**Use this for**: Verify sitemap structure and ensure all important pages are included for search engine discovery.

**Verify AI Bot Access:**
```
# These bots should be allowed in robots.txt:
- Googlebot (Google)
- Bingbot (Bing/Copilot)
- PerplexityBot (Perplexity)
- ChatGPT-User (ChatGPT with browsing)
- ClaudeBot / anthropic-ai (Claude)
- GPTBot (OpenAI)
```

### Step 2: Keyword Research

Use **WebSearch** to research target keywords:

```
WebSearch: "{keyword} keyword difficulty site:ahrefs.com OR site:semrush.com"
WebSearch: "{keyword} search volume 2026"
WebSearch: "site:{competitor.com} {keyword}"
```

**Analyze:**
- Search volume and difficulty
- Competitor keyword strategies
- Long-tail keyword opportunities
- International keyword conflicts (e.g., "OPC" = industrial automation in English markets)

### Step 3: GEO Optimization (AI Search Engines)

Apply the **9 Princeton GEO Methods** (see [references/geo-research.md](./references/geo-research.md)):

| Method | Visibility Boost | How to Apply |
|--------|-----------------|--------------|
| **Cite Sources** | +40% | Add authoritative citations and references |
| **Statistics Addition** | +37% | Include specific numbers and data points |
| **Quotation Addition** | +30% | Add expert quotes with attribution |
| **Authoritative Tone** | +25% | Use confident, expert language |
| **Easy-to-understand** | +20% | Simplify complex concepts |
| **Technical Terms** | +18% | Include domain-specific terminology |
| **Unique Words** | +15% | Increase vocabulary diversity |
| **Fluency Optimization** | +15-30% | Improve readability and flow |
| ~~Keyword Stuffing~~ | **-10%** | **AVOID - hurts visibility** |

**Best Combination:** Fluency + Statistics = Maximum boost

**Generate FAQPage Schema** (+40% AI visibility):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is [topic]?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "According to [source], [answer with statistics]."
    }
  }]
}
```

**Optimize Content Structure:**
- Use "answer-first" format (direct answer at top)
- Clear H1 > H2 > H3 hierarchy
- Bullet points and numbered lists
- Tables for comparison data
- Short paragraphs (2-3 sentences max)

### Step 4: Traditional SEO Optimization

**Meta Tags Template:**
```html
<title>{Primary Keyword} - {Brand} | {Secondary Keyword}</title>
<meta name="description" content="{Compelling description with keyword, 150-160 chars}">
<meta name="keywords" content="{keyword1}, {keyword2}, {keyword3}">

<!-- Open Graph -->
<meta property="og:title" content="{Title}">
<meta property="og:description" content="{Description}">
<meta property="og:image" content="{Image URL 1200x630}">
<meta property="og:url" content="{Canonical URL}">
<meta property="og:type" content="website">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{Title}">
<meta name="twitter:description" content="{Description}">
<meta name="twitter:image" content="{Image URL}">
```

**JSON-LD Schema** (see [references/schema-templates.md](./references/schema-templates.md)):
- WebPage / Article for content pages
- FAQPage for FAQ sections
- Product for product pages
- Organization for about pages
- SoftwareApplication for tools/apps

**Check Content:**
- [ ] H1 contains primary keyword
- [ ] Images have descriptive alt text
- [ ] Internal links to related content
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Content is mobile-friendly
- [ ] Page loads in < 3 seconds

### Step 5: Validate & Monitor

**Schema Validation:**
```bash
# Open Google Rich Results Test
open "https://search.google.com/test/rich-results?url={encoded_url}"

# Open Schema.org Validator
open "https://validator.schema.org/?url={encoded_url}"
```

**Check Indexing Status:**
```bash
# Google (use Search Console API or manual check)
open "https://www.google.com/search?q=site:{domain}"

# Bing
open "https://www.bing.com/search?q=site:{domain}"
```

**Generate Report:**
```markdown
## SEO/GEO Optimization Report

### Current Status
- Meta Tags: ✅/❌
- Schema Markup: ✅/❌
- AI Bot Access: ✅/❌
- Mobile Friendly: ✅/❌
- Page Speed: X seconds

### Recommendations
1. [Priority 1 action]
2. [Priority 2 action]
3. [Priority 3 action]

### GEO Optimizations Applied
- [ ] FAQPage schema added
- [ ] Statistics included
- [ ] Citations added
- [ ] Answer-first structure
```

## Platform-Specific Optimization

See [references/platform-algorithms.md](./references/platform-algorithms.md) for detailed ranking factors.

### ChatGPT
- Focus on **branded domain authority** (cited 11% more than third-party)
- Update content within **30 days** (3.2x more citations)
- Build **backlinks** (>350K referring domains = 8.4 avg citations)
- Match content style to ChatGPT's response format

### Perplexity
- Allow **PerplexityBot** in robots.txt
- Use **FAQ Schema** (higher citation rate)
- Host **PDF documents** (prioritized for citation)
- Focus on **semantic relevance** over keywords

### Google AI Overview (SGE)
- Optimize for **E-E-A-T** (Experience, Expertise, Authority, Trust)
- Use **structured data** (Schema markup)
- Build **topical authority** (content clusters + internal linking)
- Include **authoritative citations** (+132% visibility)

### Microsoft Copilot / Bing
- Ensure **Bing indexing** (required for citation)
- Optimize for **Microsoft ecosystem** (LinkedIn, GitHub mentions help)
- Page speed **< 2 seconds**
- Clear **entity definitions**

### Claude AI
- Ensure **Brave Search indexing** (Claude uses Brave, not Google)
- High **factual density** (data-rich content preferred)
- Clear **structural clarity** (easy to extract)

## Skill Dependencies

This skill works best with:
- **twitter skill** - Search SEO experts for latest tips
- **reddit skill** - Search r/SEO, r/bigseo for discussions
- **WebSearch** - Keyword research and competitor analysis

## References

- [references/platform-algorithms.md](./references/platform-algorithms.md) - Detailed ranking factors for each platform
- [references/geo-research.md](./references/geo-research.md) - Princeton GEO research (9 methods)
- [references/schema-templates.md](./references/schema-templates.md) - JSON-LD templates
- [references/seo-checklist.md](./references/seo-checklist.md) - Complete SEO audit checklist
- [references/tools-and-apis.md](./references/tools-and-apis.md) - Tools and API reference
- [examples/opc-skills-case-study.md](./examples/opc-skills-case-study.md) - Real-world optimization example

 succeeded in 982ms:
?? apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/lib/errors.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/migrations-runner/src/

codex
파일 목록을 확인했고, 검토 대상 문서들이 워크트리에 존재합니다. 이제 계획 문서와 핵심 SoT의 결론/규범 문장을 line 번호와 함께 뽑아 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/SCHEMA_MAPPING.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/SEARCH_STANDARDIZATION.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 963ms:
   1: # 공개 사이트 렌더 minimal plan (v0.1·draft·2026-05-18)
   2: 
   3: > **상태**: **v0.1 (draft)** — Codex 자동 비평 진입 전 base. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 **운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링** 하는 minimal 흐름을 정의한다. M0 v1.0 본 구현(static export to Git · CDN 배포)은 LL-DEFER-20 + 본 plan 의 PSR-DEFER cascade 로 미룬다.
   4: 
   5: 본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설해 같은 Next.js 앱이 어드민 + 공개 사이트 두 영역을 동시 서비스하게 한다. 어드민(`(admin)`)에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD 와 함께 렌더한다.
   6: 
   7: > **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 등은 M0 v1.0 본 구현 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
   8: 
   9: ## SoT
  10: 
  11: - `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014). v0.1 은 M0 게이트 #1 의 10페이지만 (P-001·P-002·P-003·P-004·P-005·P-006·P-009·P-010·P-012·P-013).
  12: - `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
  13: - `docs/core/SEARCH_STANDARDIZATION.md` — robots.txt · sitemap.xml · canonical · AI 크롤러 4계열 정책.
  14: - `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · ContentType 예외 (LegalDocument 면제 LL-CASCADE-03).
  15: - `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile.
  16: - `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · light/dark 분기 · ColorTokens 22 · semantic typography.
  17: - `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지) — 정적 빌드 가능".
  18: - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 화면 3계약 + LegalDocument 5종 + primaryCtas + businessHours.
  19: - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder — M0 v1.0 static export to Git cascade target.
  20: - 기존 packages 실 시그니처:
  21:   - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 route group 패턴)
  22:   - `apps/web/src/lib/{db, env, page-context, tenant}.ts` (어드민 컨텍스트 패턴)
  23:   - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
  24:   - `packages/auth/src/...` (resolveTenantContext + audit)
  25: 
  26: ## 1. 목적과 범위
  27: 
  28: ### 1.1 목적
  29: 
  30: - 운영자가 어드민에서 저장한 6 entity 콘텐츠를 **실제 클라이언트 사이트** 처럼 렌더 — 운영자가 입력 결과를 즉시 검증 가능.
  31: - M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰(JSON-LD·SEO meta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.
  32: - 노출 의도 일직선: schema.org JSON-LD · Next.js metadata · canonical · sitemap.xml · robots.txt · OpenGraph 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
  33: 
  34: ### 1.2 범위 (포함)
  35: 
  36: | 항목 | 비고 |
  37: |---|---|
  38: | `apps/web/src/app/(site)/[instanceSlug]/...` route group 신설 | 어드민 `(admin)` 과 분리. 같은 Next.js 앱 안 |
  39: | 10페이지 minimal 라우트 | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-009 `/insights` · P-010 `/insights/[slug]` · P-012 `/contact` · P-013 `/legal/[type]` (5종) |
  40: | 공개 SELECT 권한 분리 | 신규 PostgreSQL role `app_public_reader` (SELECT only · publishable/published 콘텐츠 + ClinicProfile/Doctor/Location/LegalDocument). v0.1 단계는 row-level filter `status='published'` (LegalDocument 는 draft 도 본 plan 단계 한정 노출 — published 게이트 LL-DEFER-01 합류 시점까지) |
  41: | SSR + Next ISR | `export const revalidate = 60` minimal. dynamic content (`generateStaticParams`) 미사용 v0.1 |
  42: | 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleList · ContactSection · LegalRenderer · Footer · Header · BreadcrumbList |
  43: | JSON-LD 통합 graph 출력 | SCHEMA_MAPPING § 2.5 + § 3 P-001~P-014 정합. 페이지당 단일 `<script type="application/ld+json">` block. 통합 graph (`@graph`) |
  44: | Next metadata API | title · description · canonical · OpenGraph · Twitter · robots (per-page) |
  45: | sitemap.xml · robots.txt | per-instance — `/<instanceSlug>/sitemap.xml` · `/<instanceSlug>/robots.txt`. AI 크롤러 4계열 (SEARCH_STANDARDIZATION § 5 — GPTBot/ClaudeBot/PerplexityBot/Naverbot 등) 정책 적용 |
  46: | 디자인 토큰 통합 | Tailwind v3.4 config 에 DESIGN_TOKENS v1.0 semantic tokens 추가 (light/dark · `bg-canvas` · `fg-default` · `border-strong` 등). primitive 색상은 ClinicProfile.metadata.brandTokens override 가능 (M1 cascade) |
  47: | status filter | published 만 노출 — TreatmentPage · Article. LegalDocument 는 draft 도 노출 (v0.1 한정) |
  48: | not-found · 404 | 페이지 부재 시 Next `notFound()` |
  49: | RLS 정합 | `app_public_reader` role 에는 RLS USING `instance_id = ...` policy 적용. `app.current_instance_id` setting 으로 tenant scope |
  50: 
  51: ### 1.3 비범위 (defer)
  52: 
  53: | 항목 | Defer to | marker |
  54: |---|---|---|
  55: | static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
  56: | 도메인 매핑 (subdomain `clinic-a.glitzy.co` 또는 custom domain `clinic-a.com`) | M0 v1.0 본 구현 — Vercel/Cloud Run + CNAME + middleware rewrite | PSR-DEFER-02 |
  57: | OG 이미지 동적 생성 (`@vercel/og` 등) | M1 Phase Alpha | PSR-DEFER-03 |
  58: | AMP / Reader mode | 미지원 — schema.org JSON-LD + clean HTML 만 | (closed) |
  59: | CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
  60: | 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
  61: | 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
  62: | 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (B 트랙 — Inquiry · Review) | PSR-DEFER-07 |
  63: | draft preview token (어드민 외 미공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
  64: | 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
  65: | AI 크롤러 인증 (Cloudflare AI Audit · access log) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
  66: | Conditions (P-007/P-008) · FAQ (P-011) · Location detail (P-014) 페이지 | EAT_CONTENT plan v0.1 합류 (FAQ) + 별 plan (Conditions · Location 다지점) | PSR-DEFER-11 |
  67: | 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
  68: | Open Graph protocol 외 메타 (Apple/Microsoft 앱 통합 등) | M1 Phase Alpha | PSR-DEFER-13 |
  69: | Service Worker · PWA | 미지원 v0.1 — 정적 콘텐츠 사이트 | (closed) |
  70: | LegalDocument body 광고법 · 표현 검수 면제 (CONTENT_STANDARDS § 7.1.1.1 정합) | 본 plan 의 LegalRenderer 가 Markdown → HTML 변환만, 추가 검수 룰 미적용 (LL-CASCADE-03 정합) | (정합 marker) |
  71: 
  72: ## 2. 라우팅 결정
  73: 
  74: ### 2.1 route group 구조 (PSR-ROUTE-01)
  75: 
  76: ```
  77: apps/web/src/app/
  78: ├─ (admin)/                              -- 어드민 (기존 · 변경 없음)
  79: │  └─ [instanceSlug]/...
  80: ├─ (site)/                               -- 공개 사이트 (신규 v0.1)
  81: │  └─ [instanceSlug]/
  82: │     ├─ layout.tsx                      -- 공개 layout (Header · Footer)
  83: │     ├─ page.tsx                        -- P-001 Home
  84: │     ├─ about/page.tsx                  -- P-002 About
  85: │     ├─ doctors/
  86: │     │  ├─ page.tsx                     -- P-003 Doctors List
  87: │     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
  88: │     ├─ treatments/
  89: │     │  ├─ page.tsx                     -- P-005 Treatments List
  90: │     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
  91: │     ├─ insights/
  92: │     │  ├─ page.tsx                     -- P-009 Articles List
  93: │     │  └─ [slug]/page.tsx              -- P-010 Article Detail
  94: │     ├─ contact/page.tsx                -- P-012 Contact
  95: │     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5종 closed type)
  96: │     ├─ sitemap.xml/route.ts            -- per-instance sitemap
  97: │     ├─ robots.txt/route.ts             -- per-instance robots
  98: │     └─ not-found.tsx                   -- per-instance 404
  99: └─ ...
 100: ```
 101: 
 102: ### 2.2 path-based routing 결정 (PSR-ROUTE-02)
 103: 
 104: - v0.1 단계: `/<instanceSlug>/<page>` path-based. 예: `/glitzy-clinic` (Home), `/glitzy-clinic/about`, `/glitzy-clinic/doctors/hong`.
 105: - 어드민과 충돌 회피: 어드민은 `(admin)` route group + 미들웨어로 `/admin/<instanceSlug>/...` 또는 `app.glitzy.co` 도메인 분리 (PSR-DEFER-02 합류).
 106: - 현재 어드민 URL = `/<instanceSlug>/clinic-profile` 형태이므로 **충돌**. v0.1 patch: 어드민을 `/admin/<instanceSlug>/...` 로 prefix 추가. ADMIN_UI cascade marker (PSR-CASCADE-01).
 107: 
 108: ### 2.3 도메인 매핑 marker (PSR-ROUTE-03)
 109: 
 110: - M0 v1.0 합류 시점 (PSR-DEFER-02): subdomain (default `<instanceSlug>.glitzy.co`) + custom domain (per-instance metadata `customDomain`). Vercel/Cloud Run middleware 가 host header → instanceSlug rewrite.
 111: - v0.1 단계에서는 instance 별 별도 도메인 없음. path-based.
 112: 
 113: ## 3. 데이터 접근 결정
 114: 
 115: ### 3.1 신규 PostgreSQL role `app_public_reader` (PSR-DATA-01)
 116: 
 117: ```sql
 118: -- packages/db/migrations/D0011_public_reader.sql (신규)
 119: 
 120: CREATE ROLE app_public_reader;
 121: GRANT USAGE ON SCHEMA public TO app_public_reader;
 122: GRANT SELECT ON instance, clinic_profile, location_profile,
 123:                 doctor_profile, treatment_page, article, legal_document
 124:   TO app_public_reader;
 125: -- 향후 entity 추가 시 명시적 GRANT (EAT_CONTENT plan · M0 v1.0).
 126: ```
 127: 
 128: **결정**:
 129: - (PSR-DATA-02) `app_public_reader` 는 SELECT only. RLS 는 instance 단위 USING `instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid` 적용.
 130: - (PSR-DATA-03) 모든 공개 page handler 가 `withPublicTenantTransaction({ instanceSlug })` 헬퍼 사용 — instance 조회 → `app.current_instance_id` set → SELECT → return. 기존 `withSkeletonTx` 와 분리된 helper.
 131: - (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지는 access log 가 별도 (CDN · Vercel analytics · PSR-DEFER-10 cascade).
 132: - (PSR-DATA-05) connection pool 분리: `WEB_PUBLIC_DATABASE_URL` (신규 env) — pgbouncer userlist 에 `app_public_reader` 별도 등록 (Spike A pgbouncer 정합).
 133: 
 134: ### 3.2 status filter (PSR-DATA-06)
 135: 
 136: - v0.1 page handler 의 row-level filter:
 137: 
 138: | Entity | Filter | 비고 |
 139: |---|---|---|
 140: | `clinic_profile` | (no status filter) | ClinicProfile 는 single row · status 없음 |
 141: | `location_profile` | (no status filter) | LocationProfile 는 status 없음 |
 142: | `doctor_profile` | `active = true` | C-02 active flag |
 143: | `treatment_page` | `status = 'published' AND published_at IS NOT NULL AND published_at <= now()` | C-03 publishable 게이트 |
 144: | `article` | 동일 | C-04 |
 145: | `legal_document` | `status IN ('draft', 'publishable', 'published')` — v0.1 한정. published 게이트 LL-DEFER-01 합류 시점까지 draft 도 노출 | LegalDocument 의 published 게이트 자체가 별도 plan (compliance-assistant + ComplianceRecord UI cascade). v0.1 우선 노출 |
 146: 
 147: ### 3.3 not-found · 빈 페이지 (PSR-DATA-07)
 148: 
 149: - `instance` 미존재 또는 `active = false` → Next `notFound()` → P-404
 150: - `doctor_profile[slug]` 매칭 0행 → `notFound()`
 151: - `treatment_page[slug]` 매칭 0행 → `notFound()` (또는 status != published)
 152: - `article[slug]` 매칭 0행 → `notFound()`
 153: - `legal_document[type]` 매칭 0행 → `notFound()`
 154: 
 155: ## 4. 페이지 컴포넌트 결정
 156: 
 157: ### 4.1 layout.tsx (PSR-COMP-01)
 158: 
 159: ```tsx
 160: // apps/web/src/app/(site)/[instanceSlug]/layout.tsx
 161: export default async function SiteLayout({
 162:   params, children,
 163: }: { params: { instanceSlug: string }; children: React.ReactNode }) {
 164:   const initial = await loadSiteInitial(params.instanceSlug);
 165:   // initial = { instance, clinicProfile, locationMain, locales, brandTokens }
 166:   return (
 167:     <html lang="ko-KR">
 168:       <body className="bg-canvas text-fg-default">
 169:         <SiteHeader initial={initial} />
 170:         <main>{children}</main>
 171:         <SiteFooter initial={initial} />
 172:       </body>
 173:     </html>
 174:   );
 175: }
 176: ```
 177: 
 178: **결정**:
 179: - (PSR-COMP-02) layout 안 `<html lang="ko-KR">` 강제 — SCHEMA_MAPPING § 1.5 정합 (`inLanguage="ko-KR"` schema 안 명시).
 180: - (PSR-COMP-03) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Insights · Contact · CTA primaryCtas[0]). Footer: 주소·전화·진료시간·법적 페이지 링크 (LegalDocument 5종).
 181: - (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
 182: 
 183: ### 4.2 페이지별 컴포넌트 (PSR-COMP-05)
 184: 
 185: | 페이지 | 컴포넌트 | 데이터 |
 186: |---|---|---|
 187: | P-001 Home | `<Hero>` (clinic.slogan/description) · `<DoctorsTeaser>` (3명) · `<TreatmentsTeaser>` (3건) · `<ArticlesTeaser>` (3건) · `<ContactCard>` | ClinicProfile + LocationMain + DoctorProfile (active, displayOrder ASC LIMIT 3) + TreatmentPage (published LIMIT 3 ORDER BY publishedAt DESC) + Article (published LIMIT 3) |
 188: | P-002 About | `<ArticleBody markdown={clinic.longDescription}>` · `<FoundingInfo>` · `<MedicalSpecialty>` (보조) | ClinicProfile |
 189: | P-003 Doctors List | `<DoctorCard>` (이름·직급·photoUrl) grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC — stable order) |
 190: | P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
 191: | P-005 Treatments List | `<TreatmentCard>` (title·summary·heroImage) grid | TreatmentPage (published ORDER BY publishedAt DESC) |
 192: | P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.bodyMarkdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
 193: | P-009 Articles List | `<ArticleCard>` (title·summary·heroImage·publishedAt) grid · 페이지네이션 (v0.1 페이지네이션 미지원 — LIMIT 20) | Article (published ORDER BY publishedAt DESC LIMIT 20) |
 194: | P-010 Article Detail | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.bodyMarkdown}>` · `<RelatedArticles>` | Article + author Doctor (optional ref) |
 195: | P-012 Contact | `<ContactHero>` · `<LocationMap>` (latitude/longitude · M1 cascade · v0.1 정적 좌표 표시) · `<BusinessHoursTable>` (CT-02) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primaryCtas |
 196: | P-013 Legal/Policy `/legal/[type]` | `<LegalRenderer markdown={legal.body}>` · `<LegalMetadata>` (effective_date · template_version) | LegalDocument (`type` ∈ {privacy, terms, non-covered, refund, complaint}) |
 197: 
 198: ### 4.3 ArticleBody (Markdown → HTML) (PSR-COMP-06)
 199: 
 200: - `@glitzy/core-content` 또는 `apps/web/src/lib/markdown.ts` 신규: minimal Markdown 렌더 (h1~h3, p, ul, ol, table, blockquote, code, link). XSS escape 강제 (DOMPurify 또는 sanitize-html).
 201: - LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
 202: - 외부 링크는 `rel="nofollow noopener"` · 내부 링크는 그대로.
 203: 
 204: ### 4.4 디자인 토큰 통합 (PSR-COMP-07)
 205: 
 206: - `apps/web/tailwind.config.ts` v0.2 patch: DESIGN_TOKENS v1.0 semantic tokens 추가:
 207:   - `colors.canvas` · `colors.fg.default` · `colors.fg.muted` · `colors.border.strong` · `colors.brand.primary` 등 (DESIGN_TOKENS § 3.2 semantic 22)
 208:   - light/dark 분기: Tailwind v3.4 의 `darkMode: ['class', '[data-theme="dark"]']`. v0.1 단계 light only — dark 미지원 (M1 cascade).
 209:   - primitive hex (DT-02 카탈로그) → semantic 매핑.
 210:   - `apps/web/src/styles/globals.css` 안 CSS custom properties (`--canvas`, `--fg-default` 등) 정의.
 211: - ClinicProfile.metadata.brandTokens 가 향후 추가되면 instance 별 override 가능 (M1 cascade · PSR-DEFER-03). v0.1 은 글로벌 토큰만.
 212: 
 213: ## 5. SEO/AEO/GEO 결정
 214: 
 215: ### 5.1 Next metadata API (PSR-SEO-01)
 216: 
 217: 각 페이지 안 `export async function generateMetadata({ params })` 정의. 출력:
 218: 
 219: ```ts
 220: {
 221:   title: "<clinic.name> | <page-specific>",  // P-001 = clinic.slogan or description
 222:   description: "<page-specific 50~160자>",
 223:   alternates: { canonical: "https://{domain}/{instanceSlug}{path}" },
 224:   openGraph: { title, description, type: "website" | "article", url, images: [ogImageUrl], locale: "ko_KR", siteName: clinic.name },
 225:   twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
 226:   robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
 227: }
 228: ```
 229: 
 230: **결정**:
 231: - (PSR-SEO-02) canonical: v0.1 path-based (`/<instanceSlug>/...`). M0 v1.0 합류 시 도메인 매핑 후 정정.
 232: - (PSR-SEO-03) title 패턴: 페이지별 다름 (P-001 = clinic.slogan, P-006 = treatment.title + " | " + clinic.name 등).
 233: - (PSR-SEO-04) description: 페이지 entity 의 description/summary 우선. 부재 시 clinic.description fallback.
 234: - (PSR-SEO-05) robots: v0.1 단계 `index: true` 전역. preview/staging 환경은 `noindex` 자동 (env `WEB_NOINDEX=true` 시).
 235: 
 236: ### 5.2 sitemap.xml (PSR-SEO-06)
 237: 
 238: - `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
 239: - 응답: XML sitemap (per-instance) — 위 10 페이지 + 동적 페이지 (doctor·treatment·article slug) URL list.
 240: - `lastmod` = entity `updatedAt` (treatment/article 은 `publishedAt`).
 241: - `changefreq` = daily (홈/리스트) · weekly (디테일) · monthly (정책).
 242: - `priority` = 1.0 (홈) · 0.8 (리스트·디테일) · 0.5 (정책).
 243: - M0 v1.0 합류 시 static sitemap.xml 도 export.
 244: 
 245: ### 5.3 robots.txt (PSR-SEO-07)
 246: 
 247: - `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
 248: - v0.1 응답:
 249:   ```
 250:   User-agent: *
 251:   Allow: /
 252: 
 253:   User-agent: GPTBot
 254:   Allow: /
 255: 
 256:   User-agent: ClaudeBot
 257:   Allow: /
 258: 
 259:   User-agent: PerplexityBot
 260:   Allow: /
 261: 
 262:   User-agent: Naverbot
 263:   Allow: /
 264: 
 265:   Sitemap: https://{domain}/<instanceSlug>/sitemap.xml
 266:   ```
 267: - SEARCH_STANDARDIZATION § 5 AI 크롤러 4계열 정책 정합. 옵트인이 default — 어드민 측 ClinicProfile.metadata.aiCrawlerPolicy override 미구현 v0.1 (M1 cascade · PSR-DEFER-10).
 268: 
 269: ### 5.4 JSON-LD 통합 graph (PSR-SEO-08)
 270: 
 271: - 모든 페이지 `<head>` 안 단일 `<script type="application/ld+json">` block 출력.
 272: - 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
 273: - 페이지별 graph 구성: SCHEMA_MAPPING § 3 P-001~P-014 정합. minimal v0.1 출력:
 274: 
 275: | 페이지 | graph entities |
 276: |---|---|
 277: | P-001 Home | Organization · MedicalClinic · WebSite · WebPage |
 278: | P-002 About | Organization · MedicalClinic · WebPage · BreadcrumbList |
 279: | P-003 Doctors List | Organization · MedicalClinic(ref) · WebPage · BreadcrumbList · ItemList(Physician refs) |
 280: | P-004 Doctor Profile | Organization · MedicalClinic(ref) · Physician · WebPage · BreadcrumbList |
 281: | P-005 Treatments List | Organization · MedicalClinic(ref) · WebPage · BreadcrumbList · ItemList(MedicalProcedure refs) |
 282: | P-006 Treatment Detail | Organization · MedicalClinic · MedicalProcedure · WebPage · BreadcrumbList |
 283: | P-009 Articles List | Organization · MedicalClinic(ref) · Blog · WebPage · BreadcrumbList |
 284: | P-010 Article Detail | Organization · MedicalClinic(ref) · Article · WebPage · BreadcrumbList |
 285: | P-012 Contact | Organization · MedicalClinic · ContactPage · WebPage · BreadcrumbList |
 286: | P-013 Legal/Policy | Organization · MedicalClinic(ref) · WebPage · BreadcrumbList |
 287: 
 288: - (PSR-SEO-09) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
 289: - (PSR-SEO-10) `@id` 패턴: SCHEMA_MAPPING § 1.2 정합. v0.1 path-based domain (`https://<host>/<instanceSlug>/#organization` 등) — M0 v1.0 도메인 매핑 합류 시 (`https://<customDomain>/#organization`) 으로 변경 가능. cascade marker (PSR-CASCADE-02).
 290: 
 291: ### 5.5 OpenGraph / Twitter (PSR-SEO-11)
 292: 
 293: - 페이지 entity 의 `heroImageUrl` 또는 `ogImageUrl` 사용. 부재 시 clinic.ogImageUrl fallback.
 294: - v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
 295: - `og:type`: `website` (default) · `article` (P-010) · `profile` (P-004 — `og:type=profile`).
 296: 
 297: ## 6. 환경·precondition
 298: 
 299: - `WEB_PUBLIC_DATABASE_URL` 신규 env — `app_public_reader` role connection string. `apps/web/.env.example` patch.
 300: - D0011 migration — `app_public_reader` role 생성. packages/migrations-runner manifest 9단계 → 10단계 (D0011 추가 — PSR-CASCADE-04).
 301: - pgbouncer userlist 에 `app_public_reader` 추가 (Spike A v0.x cascade — PSR-CASCADE-05).
 302: - Tailwind config v0.2 — DESIGN_TOKENS v1.0 semantic 통합.
 303: - Markdown 렌더 패키지 — `marked` (또는 `markdown-it` + `dompurify`) 추가. 의존성 작음.
 304: 
 305: ## 7. § 8.1 시나리오 (LOCAL_PASS 검증)
 306: 
 307: | # | 시나리오 | 통과 기준 |
 308: |---|---|---|
 309: | 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 보임 |
 310: | 2 | DoctorProfile 3건 등록 후 `/<instanceSlug>/doctors` 페이지에 3 card 표시 | active=true 만 보임 · displayOrder ASC 정렬 |
 311: | 3 | DoctorProfile.active=false 한 row → `/<instanceSlug>/doctors` 리스트에서 사라짐 | row count 2 |
 312: | 4 | TreatmentPage status='draft' → `/<instanceSlug>/treatments` 리스트에 미노출 | 0건 |
 313: | 5 | TreatmentPage status='published' + publishedAt now() → 노출 | 1건 |
 314: | 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 bodyMarkdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
 315: | 7 | Article published 5건 + draft 3건 → `/<instanceSlug>/insights` 5건만 노출 | draft 미노출 |
 316: | 8 | LegalDocument 5종 draft 가 `/<instanceSlug>/legal/<type>` 에서 노출 (v0.1 한정) | 각 type 별 본문 표시 |
 317: | 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
 318: | 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-013 별 entity 풀/참조 정합 (SCHEMA_MAPPING § 2.5) |
 319: | 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (10페이지 + 동적 slug) + lastmod |
 320: | 12 | `/<instanceSlug>/robots.txt` 응답 | AI 크롤러 4계열 명시 + sitemap reference |
 321: | 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X |
 322: | 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `notFound()` |
 323: | 15 | 어드민 측 도메인 (`/admin/...`) 와 공개 도메인 (`/...`) 충돌 없음 | 어드민 prefix `/admin` 으로 분리 — PSR-CASCADE-01 |
 324: | 16 | dark mode CSS var 적용 가능 검증 (Tailwind class) | `data-theme="dark"` 시 `--canvas` · `--fg-default` 토큰 변경 (light only v0.1 — dark 검증은 marker 만) |
 325: | 17 | sitemap.xml 의 lastmod 가 entity updatedAt 과 정확히 일치 | ISO 8601 형식 |
 326: | 18 | JSON-LD validator (Google Rich Results Test 또는 schema.org validator) 통과 | P-001·P-006·P-010 minimal 3페이지 PASS |
 327: | 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` 에 7요일 표 + 점심 시간 + 특수 휴진 표시 | LL-SCHEMA-16 정합 |
 328: | 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener"` 자동 추가 | 내부 링크는 그대로 |
 329: 
 330: ## 8. 작업 단위
 331: 
 332: | # | 작업 | 산출물 |
 333: |---|---|---|
 334: | 1 | D0011 migration — `app_public_reader` role + GRANT | packages/db/migrations/D0011_public_reader.sql |
 335: | 2 | `WEB_PUBLIC_DATABASE_URL` env + lib (`apps/web/src/lib/public-db.ts` 신설) | env + helper |
 336: | 3 | `withPublicTenantTransaction` helper | apps/web/src/lib/public-tenant.ts |
 337: | 4 | `loadSiteInitial` (layout 안 ClinicProfile + LocationMain + brandTokens 1회 SELECT) | apps/web/src/lib/site-initial.ts |
 338: | 5 | (site) route group + 10 페이지 layout/page | apps/web/src/app/(site)/[instanceSlug]/* |
 339: | 6 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard 등) | apps/web/src/components/site/* |
 340: | 7 | Markdown 렌더 라이브러리 + XSS escape | apps/web/src/lib/markdown.ts |
 341: | 8 | JSON-LD 생성기 (페이지 타입 별 graph builder) | apps/web/src/lib/json-ld/ |
 342: | 9 | Next metadata API (페이지별 generateMetadata) | 각 page.tsx 안 |
 343: | 10 | sitemap.xml + robots.txt route handler | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
 344: | 11 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 통합 | apps/web/tailwind.config.ts + globals.css |
 345: | 12 | 어드민 경로 `/admin` prefix 추가 (PSR-CASCADE-01) | apps/web/src/app/(admin) 의 path 분리 (예: `(admin)/admin/[instanceSlug]/`) |
 346: | 13 | 시나리오 1~20 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
 347: | 14 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 의 build/export 시점에 본 plan 의 SSR 컴포넌트 재사용 marker | PSR-CASCADE-03 |
 348: | 15 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` route group + `/admin` prefix 분리 정합 | PSR-CASCADE-01 |
 349: | 16 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` pattern marker (도메인 매핑 합류 시 변경) | PSR-CASCADE-02 |
 350: | 17 | packages/migrations-runner manifest 10단계 (D0011 추가) | PSR-CASCADE-04 |
 351: | 18 | Spike A pgbouncer userlist 에 `app_public_reader` 추가 marker | PSR-CASCADE-05 |
 352: 
 353: ## 9. M0 v1.0 cascade markers (defer 정리)
 354: 
 355: ### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
 356: 
 357: - `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`. M0_BUILD_EXPORT_PLAN 본 구현 합류.
 358: - `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
 359: - `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
 360: - `PSR-DEFER-10`: AI 크롤러 인증 — Cloudflare AI Audit · access log per-crawler.
 361: 
 362: ### 9.2 M1 Phase Alpha 합류
 363: 
 364: - `PSR-DEFER-03`: instance 별 brandTokens override — DESIGN_TOKENS v1.0 의 BrandTokens 양층.
 365: - `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
 366: - `PSR-DEFER-08`: draft preview token (어드민 외).
 367: - `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
 368: - `PSR-DEFER-13`: Open Graph 외 메타 (Apple/Microsoft 앱 통합).
 369: - dark mode 활성화.
 370: 
 371: ### 9.3 EAT_CONTENT plan v0.1 합류
 372: 
 373: - `PSR-DEFER-11(부분)`: FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD.
 374: 
 375: ### 9.4 M3 다국어 합류
 376: 
 377: - `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
 378: 
 379: ## 10. Cascade markers (다른 SoT 문서로 전파)
 380: 
 381: > **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용 (plan acceptance commit 안 포함). plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
 382: 
 383: - `PSR-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3 — `(site)` route group 신설 + 어드민 `/admin` prefix 분리 마커 추가. ADMIN_UI_SKELETON code v1.0 의 어드민 URL 도 `/admin/<instanceSlug>/...` 로 정정 (코드 cascade — apps/web/src/app/(admin) 디렉토리 구조 변경).
 384: - `PSR-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` § 1.2 — v0.1 path-based `@id` pattern marker (`https://<host>/<instanceSlug>/#organization` 등). M0 v1.0 도메인 매핑 합류 시 (`https://<customDomain>/#organization`) 로 변경.
 385: - `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 재사용 marker.
 386: - `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 추가 (9 → 10 entry).
 387: - `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
 388: 
 389: ## 변경 이력
 390: 
 391: | 일자 | 버전 | 변경 |
 392: |---|---|---|
 393: | 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |

 succeeded in 950ms:
   1: # Core — 검색 표준화 (메타·robots·sitemap·canonical·성능)
   2: 
   3: > **상태**: **v1.1** (DESIGN_TOKENS v1.0 cascade)
   4: > **작성일**: 2026-05-14 (v0.10 → v1.0 — 미세 보강·안정판 격상)
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 4 (검색 표준화 영역)
   7: > **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
   8: > **외부 공유 시 주의**: 상위 문서와 동일.
   9: > **연관 문서**:
  10: > - 페이지 타입 정의 → `core/PAGE_TYPES.md`
  11: > - 데이터 계약 (`PageMeta` C-06, `BrandTokens`, `InstanceManifest` 등) → `core/DATA_MODEL.md`
  12: > - JSON-LD Schema → `core/SCHEMA_MAPPING.md`
  13: > - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`
  14: 
  15: ---
  16: 
  17: ## 0. 한 페이지 요약
  18: 
  19: - Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
  20: - **resolved canonical URL** — `PageMeta.canonical` → `SchemaInput.canonicalUrl` → 도메인/라우트 자동 생성 순서. **3단계 모두 resolve 불가 시 빌드 실패** (SCHEMA_MAPPING § 7.1 정합).
  21: - robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
  22: - sitemap.xml은 **InstanceManifest·콘텐츠 파일 트리**로부터 자동 생성. 모든 발행 페이지 포함, 미발행 드래프트 제외.
  23: - 성능은 **빌드 게이트(lab metric: Lighthouse budget)** + **운영 모니터링(field metric: CrUX·RUM)** 분리.
  24: - 외부 분석 도구(네이버 서치어드바이저·Google Search Console·GA4) 실제 연동은 **`analytics-reporting` Feature Module**. 본 Core는 측정 이벤트·리포트 인터페이스만.
  25: 
  26: ---
  27: 
  28: ## 1. 일반 규약
  29: 
  30: ### 1.1 Core 책임 범위 vs Add-on
  31: 
  32: | 항목 | Core 책임 | Add-on (Feature Module) |
  33: |---|---|---|
  34: | 메타 태그 자동 생성 | ✅ | |
  35: | robots.txt 자동 생성 | ✅ | |
  36: | sitemap.xml 자동 생성 | ✅ | |
  37: | canonical URL 처리 | ✅ | |
  38: | 성능 budget 검증 (빌드 lab) | ✅ | |
  39: | 운영 field metric 모니터링 | 측정 이벤트 표준만 | ✅ `analytics-reporting` 모듈 |
  40: | 외부 도구 연동 (서치어드바이저·GSC·GA4) | 인터페이스만 | ✅ `analytics-reporting` 모듈 |
  41: | 키워드 모니터링 | | ✅ `keyword-monitoring` 모듈 |
  42: | 사이트 가시성 추적 | | ✅ `search-visibility` 모듈 |
  43: 
  44: ### 1.2 출력 형식 안정성
  45: 
  46: - **head 메타 태그**: HTML 표준 `<meta>`·`<link>` — 페이지 타입·PageMeta 기반 자동 생성
  47: - **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
  48: - **sitemap.xml**: 표준 sitemap XML 0.9 — 사이트 루트 (`/sitemap.xml`)
  49: - **canonical URL**: 절대 URL, `https://{domain}{path}`
  50: 
  51: ### 1.3 변경 정책
  52: 
  53: 본 표준은 빌드 생성기의 인터페이스. 변경 시 영향:
  54: 
  55: | 변경 종류 | 분류 |
  56: |---|---|
  57: | 새 메타 태그 필드 추가 | MINOR |
  58: | 메타 태그 필수 → 선택 | PATCH |
  59: | 메타 태그 선택 → 필수 | MAJOR |
  60: | robots 룰 변경 | MINOR (정책 변경은 운영 결정) |
  61: | 성능 budget 임계값 강화 | MAJOR (기존 인스턴스 빌드 실패 가능성) |
  62: | 성능 budget 완화 | PATCH |
  63: 
  64: ---
  65: 
  66: ## 2. 메타 태그 표준
  67: 
  68: ### 2.1 페이지별 출력 메타 (단일 SoT)
  69: 
  70: > 페이지별 head 메타 태그 출력의 단일 진실 원본. 페이지 타입(PAGE_TYPES § 1.1)별 + PageMeta(DATA_MODEL C-06) 입력 기반.
  71: 
  72: **Allowed (항상 출력) / Conditional (조건부) / Blocked (출력 안 함)** 분류:
  73: 
  74: | 메타 태그 | 출력 결정 | 출처 |
  75: |---|---|---|
  76: | `<title>` | **Allowed** (모든 페이지 필수) | `PageMeta.title` (10~70자) |
  77: | `<meta name="description">` | **Allowed** (모든 페이지 필수) | `PageMeta.description` (80~160자) |
  78: | `<link rel="canonical">` | **Allowed** (모든 페이지 필수) | `PageMeta.canonical` 또는 빌드 시 자동 resolve (§ 5) |
  79: | `<meta name="robots">` | **Allowed** (모든 페이지) | `PageMeta.robots` (기본 `"index, follow, max-snippet:-1, max-image-preview:large"`) |
  80: | `<meta name="viewport">` | **Allowed** | 고정 `"width=device-width, initial-scale=1"` |
  81: | `<meta charset>` | **Allowed** | 고정 `"utf-8"` |
  82: | `<html lang>` | **Allowed** | **저장값 `ko-KR`을 그대로 `<html lang>`에 출력** (BCP 47 유효, 지역 정보 보존 — hreflang·og:locale·SchemaInput과 단일 일관). og:locale은 `ko_KR` (underscore) 형식으로만 변환 |
  83: | `<meta property="og:type">` | **Allowed** | 페이지 타입에 따라 자동 — `P-004`는 `profile`, `P-006/P-008/P-010`은 `article`, 나머지는 `website` (§ 2.2 매핑 참조) |
  84: | `<meta property="og:title">` | **Allowed** | `PageMeta.ogTitle` 또는 `title` |
  85: | `<meta property="og:description">` | **Allowed** | `PageMeta.ogDescription` 또는 `description` |
  86: | `<meta property="og:url">` | **Allowed** | resolved canonical URL |
  87: | `<meta property="og:site_name">` | **Allowed** | `ClinicProfile.name` |
  88: | `<meta property="og:image">` | **Allowed** | `PageMeta.ogImageUrl` 또는 `ClinicProfile.ogImageUrl` |
  89: | `<meta property="og:locale">` | **Allowed** | `inLanguage` (`ko-KR`)에서 OG locale 형식으로 변환: `ko_KR` (underscore) |
  90: | `<meta name="twitter:card">` | **Allowed** | `PageMeta.twitterCard` (기본 `summary_large_image`) |
  91: | `<meta name="twitter:title">` | Conditional (twitterCard 존재 시) | `ogTitle` 재사용 |
  92: | `<meta name="twitter:description">` | Conditional | `ogDescription` 재사용 |
  93: | `<meta name="twitter:image">` | Conditional | `ogImageUrl` 재사용 |
  94: | `<meta property="article:published_time">` | **Conditional — P-010 전용** | `Article.datePublished`. P-006/P-008은 `@createdAt`을 공개 발행일로 보기 어려우므로 **미출력** (공개 발행 개념이 의료 정보 페이지에 직접 매핑되지 않음) |
  95: | `<meta property="article:modified_time">` | Conditional (P-006·P-008·P-010) | P-010: `Article.dateModified` (누락 fail) / **P-006·P-008: § 2.3 fallback** — 명시 `dateModified` 부재 시 공통 `@updatedAt` (fallback 사용은 정상 silent) |
  96: | `<meta property="article:author">` | Conditional | **P-010: `Article.author.name`** (fail) / P-006·P-008: `reviewedBy.name` (있을 때만, optional) |
  97: | `<meta property="article:section">` | **Conditional — P-010 전용** | `ArticleCategory.name`. P-006/P-008은 ArticleCategory 개념 없으므로 미출력 |
  98: | `<link rel="alternate" hreflang>` | Conditional | `InternationalSupport.internationalLanguagePages[]` 활성화 시 |
  99: | `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
 100: | `<meta name="referrer">` | **Blocked** (Core 기본 미설정) — 필요 시 인스턴스 결정 | |
 101: | `<meta name="format-detection">` | Conditional (모바일 전화번호 표시 정책) | 기본 `telephone=no` 또는 인스턴스 결정 |
 102: 
 103: ### 2.2 페이지 타입별 og:type 매핑
 104: 
 105: | 페이지 타입 | og:type |
 106: |---|---|
 107: | P-001 Home | `website` |
 108: | P-002 About | `website` |
 109: | P-003 Doctors List | `website` |
 110: | P-004 Doctor Profile | `profile` |
 111: | P-005 Treatments List | `website` |
 112: | P-006 Treatment Detail | `article` (의료 정보 콘텐츠) |
 113: | P-007 Conditions List | `website` |
 114: | P-008 Condition Detail | `article` |
 115: | P-009 Articles List | `website` |
 116: | P-010 Article Detail | `article` |
 117: | P-011 FAQ | `website` |
 118: | P-012 Contact | `website` |
 119: | P-013 Legal | `website` |
 120: | P-014 Location Detail | `website` |
 121: | P-101 ~ P-106 | `website` |
 122: 
 123: > **의도적 예외**: P-006·P-008은 `og:type=article`이지만 `article:*` 부가 메타는 **제한 출력** — `article:modified_time`·`article:author`만 (P-010은 모든 부가 메타 출력). P-006/P-008은 `article:published_time`·`article:section` 미출력 (의료 정보 페이지에 공개 발행일·ArticleCategory 매핑 부자연스러움). § 2.1 표 참조.
 124: 
 125: ### 2.3 메타 태그 빌드 검증 (룰 checker)
 126: 
 127: **`PageMeta.robots` vs `PageMeta.noIndex` 우선순위 룰**:
 128: - `noIndex: true`가 **항상 우선**. `robots` 필드의 `index`/`noindex` 지시어는 noIndex에 의해 자동 override됨
 129: - 충돌 입력 (`noIndex: true` + `robots: "index, follow"`) 감지 시 **warning** + 빌드 시 noIndex 우선 적용
 130: - `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)
 131: 
 132: | 룰 | 레벨 | 조건 |
 133: |---|---|---|
 134: | `title` 누락 | fail | 모든 페이지 |
 135: | `description` 누락 | fail | 모든 페이지 |
 136: | `canonical` resolve 실패 (PageMeta·SchemaInput·도메인+라우트 3단계 모두 부재) | fail | 모든 페이지 |
 137: | `title` 길이 < 10 또는 > 70자 | warning | |
 138: | `description` 길이 < 80 또는 > 160자 | warning | |
 139: | `ogImageUrl` 누락 (페이지·ClinicProfile 둘 다 부재) | warning | |
 140: | `inLanguage` 누락 | fail | 빌드 시 `"ko-KR"` 자동 적용 후 경고 |
 141: | **P-010 Article**: `<meta property="article:published_time">`·`article:modified_time`·`article:author` 누락 | **fail** | head meta 표준 책임. 출처: `Article.datePublished`·`Article.dateModified`·`Article.author.name`. 단 **`publisher`는 JSON-LD `Article.publisher`로 강제** (SCHEMA_MAPPING § 3 P-010 책임 — head meta에는 `article:publisher` 없음) |
 142: | **P-006 Treatment Detail / P-008 Condition Detail**: `article:modified_time` 출처 결정 | **정상 동작** (warning 아님) | og:type=article이지만 entity 자체는 MedicalProcedure/MedicalCondition. **출처 우선순위**: ① 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용 (현재 C-03·C-11 미정의) → ② 공통 `@updatedAt` (DATA_MODEL § 2.2 — 모든 계약 필수)로 fallback. **fallback 사용 자체는 정상 경로 (silent)** |
 143: | P-006/P-008: 페이지 계약에 명시적 `dateModified` 필드가 추가됐는데 값이 없는 경우 | **warning** | C-03·C-11 풀명세 후 명시 필드 도입 시 적용 |
 144: | P-006/P-008: `@updatedAt` resolve 실패 | **fail** | 공통 메타필드 필수 — resolve 실패는 빌드 차단 |
 145: | `<meta property="article:author">` 출처 — P-006/P-008에서 `reviewedBy` 부재 | (선택) optional 미출력 | warning 아님. `reviewedBy` 있을 때만 출력 |
 146: | **P-010 Article**: `Article.category` / `ArticleCategory.name` resolve 실패 (= `article:section` 누락) | **warning** | `Article.category`는 DATA_MODEL에서 required이므로 누락 가능 케이스는 ArticleCategory 참조 resolve 실패. 콘텐츠 분류 신호 약화 (콘텐츠 자체는 출력) |
 147: | `noIndex: true` 페이지에서 `<meta name="robots" content="noindex, follow">` 누락 | fail | sitemap 제외와 함께 robots 메타도 출력 필수 |
 148: 
 149: ---
 150: 
 151: ## 3. robots.txt 표준
 152: 
 153: ### 3.1 AI 크롤러 분류 — 4계열
 154: 
 155: user-agent의 목적별 분리 (공식 출처는 각 행 참조; 외부 자료 변경 가능성 — 분기 1회 재검증 권장):
 156: 
 157: | 계열 | user-agent | 목적 | 출처 |
 158: |---|---|---|---|
 159: | **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
 160: | **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
 161: | **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
 162: | **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
 163: 
 164: > **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
 165: > 참고 URL:
 166: > - OpenAI publisher FAQ — https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
 167: > - OpenAI ChatGPT search product discovery — https://openai.com/chatgpt/search-product-discovery/
 168: > - Perplexity crawlers — https://docs.perplexity.ai/docs/resources/perplexity-crawlers
 169: > - Anthropic crawler help — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-the-web-and-how-can-site-owners-block-the-crawler
 170: > - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
 171: > - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
 172: > - Google robots-meta (meta tag — noindex 등) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
 173: 
 174: ### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**
 175: 
 176: `InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.
 177: 
 178: | 정책 | A. 일반 검색 | B. AI 검색 인덱싱 | C. User-triggered fetch (best-effort) | D. AI 학습 | 법무 승인 |
 179: |---|:---:|:---:|:---:|:---:|---|
 180: | `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
 181: | `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
 182: | `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
 183: | `custom` | 인스턴스 정의 (§ 3.4 merge/replace) | | | | 운영자 검토 |
 184: 
 185: > **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
 186: > **starter template**은 `disallowTraining` 제안 — 의료기관 사이트의 환자 후기·전후사진·브랜드 콘텐츠 학습 위험 회피 + 검색·답변 노출 유지.
 187: 
 188: ### 3.3 정책별 출력 예시
 189: 
 190: #### `aiCrawlerPolicy: disallowTraining` (권장 기본)
 191: 
 192: ```
 193: # robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
 194: 
 195: # 일반 룰
 196: User-agent: *
 197: Disallow: /admin/
 198: Disallow: /auth/
 199: Disallow: /api/
 200: Allow: /
 201: 
 202: # A. 일반 검색 색인 — Allow
 203: User-agent: Googlebot
 204: Allow: /
 205: 
 206: User-agent: Yeti
 207: Allow: /
 208: 
 209: User-agent: Bingbot
 210: Allow: /
 211: 
 212: # B. AI 검색 인덱싱·답변용 — Allow
 213: User-agent: OAI-SearchBot
 214: Allow: /
 215: 
 216: User-agent: PerplexityBot
 217: Allow: /
 218: 
 219: User-agent: Claude-SearchBot
 220: Allow: /
 221: 
 222: # C. User-triggered fetch — Allow
 223: User-agent: ChatGPT-User
 224: Allow: /
 225: 
 226: User-agent: Perplexity-User
 227: Allow: /
 228: 
 229: User-agent: Claude-User
 230: Allow: /
 231: 
 232: # D. AI 학습·모델 개선용 — Disallow
 233: User-agent: GPTBot
 234: Disallow: /
 235: 
 236: User-agent: ClaudeBot
 237: Disallow: /
 238: 
 239: User-agent: Google-Extended
 240: Disallow: /
 241: 
 242: User-agent: CCBot
 243: Disallow: /
 244: 
 245: User-agent: anthropic-ai
 246: Disallow: /
 247: 
 248: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
 249: 
 250: Sitemap: https://{domain}/sitemap.xml
 251: ```
 252: 
 253: > `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
 254: 
 255: #### `aiCrawlerPolicy: allow` (학습 포함 전체 허용 — 법무 승인 필수)
 256: 
 257: 위 예시에서 D 계열 모두 `Allow: /`로 변경.
 258: 
 259: #### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
 260: 
 261: B·C·D 계열 모두 `Disallow: /`. A 계열만 Allow. (**C 계열은 차단 보장 수단으로 보지 않음** — § 3.1·§ 3.2 주의)
 262: 
 263: ### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
 264: 
 265: | 룰 | 결정 | 비고 |
 266: |---|---|---|
 267: | AI 크롤러 허용/차단 | **`aiCrawlerPolicy` 정책에 따라 § 3.2 매트릭스 적용** | required, 미설정 fail |
 268: | `/admin/`·`/auth/`·`/api/` 차단 | **Allowed** (Core 기본 — 모든 정책에 공통) | |
 269: | 검색 결과 페이지(`/search`) 차단 | Conditional (검색 라우트 활성화 시) | 검색 결과 페이지가 색인되면 중복 콘텐츠 위험 |
 270: | 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
 271: | **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
 272: | `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |
 273: 
 274: ### 3.4 인스턴스별 robots 오버라이드 — user-agent별 merge/replace
 275: 
 276: **Append 방식 금지** (같은 user-agent에 Allow/Disallow 중복 시 크롤러별 해석 차이·longest-match 문제 발생). 대신 user-agent 단위 merge·replace:
 277: 
 278: | 오버라이드 결정 | 룰 |
 279: |---|---|
 280: | 새 user-agent 추가 | 인스턴스 룰을 그대로 append (해당 user-agent의 새 블록) |
 281: | 기존 user-agent 룰 **변경** | 인스턴스 룰이 Core 기본 룰을 **replace** (해당 user-agent 블록 전체 교체) |
 282: | 기존 user-agent 룰 **부분 추가** | 인스턴스가 명시한 Allow/Disallow 라인을 해당 user-agent 블록에 merge — 단 같은 path에 Allow와 Disallow가 동시에 나오면 빌드 실패 (충돌) |
 283: 
 284: **예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
 285: 
 286: ```
 287: # Core 기본 (allow 정책, PerplexityBot 블록)
 288: User-agent: PerplexityBot
 289: Allow: /
 290: 
 291: # 인스턴스 오버라이드 (merge, /reviews·/pricing 경로 차단)
 292: robotsOverrides:
 293:   - userAgent: PerplexityBot
 294:     action: merge
 295:     disallow: ["/reviews", "/pricing"]
 296:     note: "후기·가격 페이지는 AI 검색 인덱싱 제외"
 297: 
 298: # 최종 출력
 299: User-agent: PerplexityBot
 300: Disallow: /reviews
 301: Disallow: /pricing
 302: Allow: /
 303: ```
 304: 
 305: > `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.
 306: 
 307: ---
 308: 
 309: ## 4. sitemap.xml 표준
 310: 
 311: ### 4.1 자동 생성 룰
 312: 
 313: 빌드 시 다음 페이지를 sitemap에 포함:
 314: 
 315: | 페이지 | 포함 결정 |
 316: |---|---|
 317: | 필수 페이지 타입 (P-001 ~ P-014) | **Allowed** — 인스턴스에서 활성화된 페이지 |
 318: | 선택 페이지 타입 (P-101 ~ P-106) | Conditional — `FeatureModuleConfig`/`InstanceManifest`/라우트 설정에서 활성화 시 |
 319: | 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
 320: | 미발행 드래프트 | **Blocked** |
 321: | `noIndex: true` 페이지 | **Blocked** |
 322: | 외부 리다이렉트 | **Blocked** |
 323: 
 324: ### 4.2 sitemap.xml 형식
 325: 
 326: ```xml
 327: <?xml version="1.0" encoding="UTF-8"?>
 328: <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 329:   <url>
 330:     <loc>https://{domain}/</loc>
 331:     <lastmod>2026-05-14</lastmod>
 332:     <changefreq>weekly</changefreq>
 333:     <priority>1.0</priority>
 334:   </url>
 335:   <url>
 336:     <loc>https://{domain}/about</loc>
 337:     <lastmod>2026-05-13</lastmod>
 338:     <changefreq>monthly</changefreq>
 339:     <priority>0.8</priority>
 340:   </url>
 341:   <!-- ... -->
 342: </urlset>
 343: ```
 344: 
 345: ### 4.3 페이지별 changefreq·priority 기본값
 346: 
 347: | 페이지 타입 | changefreq | priority |
 348: |---|---|---|
 349: | P-001 Home | weekly | 1.0 |
 350: | P-002 About | monthly | 0.8 |
 351: | P-003 Doctors List | monthly | 0.7 |
 352: | P-004 Doctor Profile | monthly | 0.7 |
 353: | P-005 Treatments List | monthly | 0.8 |
 354: | P-006 Treatment Detail | monthly | 0.8 |
 355: | P-007 Conditions List | monthly | 0.6 |
 356: | P-008 Condition Detail | monthly | 0.6 |
 357: | P-009 Articles List | weekly | 0.6 |
 358: | P-010 Article Detail | monthly | 0.5 |
 359: | P-011 FAQ | monthly | 0.5 |
 360: | P-012 Contact | yearly | 0.6 |
 361: | P-013 Legal | yearly | 0.3 |
 362: | P-014 Location Detail | monthly | 0.7 |
 363: | P-101 ~ P-106 | yearly | 0.4 |
 364: 
 365: ### 4.4 lastmod 출력
 366: 
 367: - `ContentEntity.@updatedAt` (DATA_MODEL § 2.2) 기반 ISO 8601 날짜
 368: - ClinicProfile·LocationProfile 등 정적 페이지는 `@updatedAt`
 369: - **Article**(P-010)은 `Article.dateModified` 우선
 370: - **Treatment**(P-006)·**Condition**(P-008)은 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용, 없으면 공통 `@updatedAt`으로 fallback (§ 2.3 정합 — 현재 C-03·C-11에 명시 필드 미정의)
 371: 
 372: ### 4.5 sitemap 인덱스 (대규모 시)
 373: 
 374: - 단일 sitemap.xml의 URL 50,000개 또는 50MB 초과 시 sitemap index 형식 자동 분할
 375: - M0 단일 클라이언트 인스턴스는 일반적으로 단일 sitemap.xml로 충분
 376: 
 377: ---
 378: 
 379: ## 5. canonical URL 처리 (resolve)
 380: 
 381: ### 5.1 resolve 우선순위
 382: 
 383: ```
 384: 1. PageMeta.canonical (운영자 명시 입력)
 385:    ↓ 없으면
 386: 2. SchemaInput.canonicalUrl (어드민 발행 시 자동 계산)
 387:    ↓ 없으면
 388: 3. 페이지 라우트 + 도메인으로 자동 생성
 389:    예: ClinicProfile.domain + path = "https://example.com/about"
 390: ```
 391: 
 392: ### 5.2 resolve 룰 (룰 checker)
 393: 
 394: | 룰 | 레벨 |
 395: |---|---|
 396: | 위 3단계 모두 부재 — resolve 실패 | **fail** (빌드 차단) |
 397: | canonical과 페이지 실제 URL 불일치 | warning |
 398: | 외부 도메인 canonical | warning + 운영자 확인 |
 399: | Query string 포함 canonical | warning (정규화 권장) |
 400: | Fragment 포함 canonical | fail (canonical은 fragment 없는 절대 URL) |
 401: 
 402: ### 5.3 hreflang (다국어 시)
 403: 
 404: - `ClinicProfile.internationalSupport.internationalLanguagePages[]` 존재 시 자동 출력
 405: - 각 언어 페이지의 canonical과 hreflang 쌍방향 매핑
 406: - M0는 단일 언어, M3 GA에서 본격 도입
 407: 
 408: ---
 409: 
 410: ## 6. 성능 기준 — 빌드 lab vs 운영 field
 411: 
 412: ### 6.1 빌드 게이트 (Lab metric) — 샘플링 측정
 413: 
 414: **전체 페이지 Lighthouse 측정은 비현실적** (CI 환경 변동성·페이지 수 비례 비용). 다음 샘플링 정책 적용:
 415: 
 416: | 샘플 대상 | 측정 | 비고 |
 417: |---|---|---|
 418: | 페이지 타입별 대표 URL 1개 (P-001·P-002·P-003·P-004·P-005·P-006·P-007·P-008·P-009·P-010·P-011·P-012·P-013·P-014) | 매 빌드 | 14개 — Core 페이지 타입 카탈로그 |
 419: | Critical URL (운영자 지정 — Home·핵심 시술 페이지 등) | 매 빌드 | `InstanceManifest.performanceBudget.criticalUrls` |
 420: | 변경된 페이지 샘플 | 매 빌드 | 변경 셋 N개 중 무작위 샘플 (기본 max 5개) |
 421: | 전체 페이지 측정 | 주간/월간 별도 Job | CI 게이트 아님 — 모니터링 리포트 |
 422: 
 423: **측정 환경**:
 424: - CPU throttling: 4x
 425: - Network: Slow 4G (Lighthouse 기본 프로파일)
 426: - Cold run (캐시 없음) 1회 + Warm run (캐시 있음) 1회 — 두 결과 모두 budget 충족
 427: - 실패 시 자동 재시도 1회 (재시도도 실패 시 빌드 실패)
 428: - Form factor: mobile 우선, desktop 보조
 429: 
 430: 빌드 시 Lighthouse(또는 동등 도구)로 측정. **빌드 게이트로 작동**.
 431: 
 432: | 메트릭 | 측정 단위 | 기본 budget | 룰 레벨 |
 433: |---|---|---|---|
 434: | LCP (Largest Contentful Paint) | ms | < 2,500 | fail (> 4,000), warning (2,500~4,000) |
 435: | CLS (Cumulative Layout Shift) | score | < 0.1 | fail (> 0.25), warning (0.1~0.25) |
 436: | TBT (Total Blocking Time) | ms | < 200 | warning (200~600), fail (> 600) |
 437: | Bundle Size (per page JS) | KB | < 200 | warning (200~500), fail (> 500) |
 438: | Image weight per page | KB | < 1,500 | warning (1,500~3,000), fail (> 3,000) |
 439: | Lighthouse Performance Score | 0~100 | > 80 | warning (60~80), fail (< 60) |
 440: | Lighthouse SEO Score | 0~100 | > 90 | warning (80~90), fail (< 80) |
 441: | Lighthouse Accessibility Score | 0~100 | > 90 | warning (80~90), fail (< 80) |
 442: 
 443: > 임계값은 기본값. 인스턴스가 `InstanceManifest.performanceBudget`에서 override 가능 (강화만 허용, 완화는 솔루션 정책상 제한).
 444: >
 445: > **강화 판정 방향**:
 446: > - **max 계열 (작을수록 강화)**: `lcpMsOverride`·`clsOverride`·`tbtMsOverride`·`bundleSizeKbOverride`·`imageWeightKbOverride` — Core 기본값보다 **작아야** 강화로 허용
 447: > - **min score 계열 (클수록 강화)**: `lighthousePerformanceMinOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` — Core 기본값보다 **커야** 강화로 허용
 448: > - 반대 방향(완화) 입력 시 빌드 실패.
 449: 
 450: ### 6.2 운영 모니터링 (Field metric)
 451: 
 452: **Real User Monitoring(RUM)** 또는 Chrome User Experience Report(CrUX) 데이터. **빌드 게이트 아님 — 운영 추세 관찰용**.
 453: 
 454: | 메트릭 | 권장 임계 (모바일 75 percentile) | 알림 조건 |
 455: |---|---|---|
 456: | LCP (field) | < 2,500 ms | 임계 미달 7일 지속 시 알림 |
 457: | INP (Interaction to Next Paint) | < 200 ms | INP는 lab 측정 부정확 — field 전용 |
 458: | CLS (field) | < 0.1 | |
 459: | FCP (First Contentful Paint) | < 1,800 ms | |
 460: | TTFB (Time to First Byte) | < 800 ms | 호스팅·CDN 점검 신호 |
 461: 
 462: ### 6.3 측정 이벤트 표준 (Core 인터페이스)
 463: 
 464: Core는 측정 이벤트의 표준 인터페이스만 제공. 실제 수집·전송은 `analytics-reporting` Feature Module.
 465: 
 466: ```ts
 467: type PerformanceEvent = {
 468:   metric: "LCP" | "INP" | "CLS" | "FCP" | "TTFB" | "Custom";
 469:   value: number;
 470:   unit: "ms" | "score" | "byte";
 471:   page: string;        // URL 또는 페이지 타입 ID
 472:   timestamp: Date;
 473:   device?: "mobile" | "tablet" | "desktop";
 474:   connection?: string; // navigator.connection.effectiveType 등
 475: };
 476: 
 477: // v0.7 cascade — `features/analytics-reporting.md` 1차 사이클 (F-1)
 478: type PageViewEvent = {
 479:   page: string;                       // URL path
 480:   pageTypeId?: string;                // PAGE_TYPES P-001 등
 481:   timestamp: Date;
 482:   device?: "mobile" | "tablet" | "desktop";
 483:   country?: string;                    // ISO3166 alpha-2
 484:   referrer?: string;                   // origin만 (full URL·querystring 금지 — § 6.3.1 PII 처리)
 485:   utmSource?: string;
 486:   utmMedium?: string;
 487:   utmCampaign?: string;
 488: };
 489: 
 490: type ConversionEvent = {
 491:   eventName: string;                  // "form-submit"·"call-click"·"reservation" 등
 492:   page: string;
 493:   timestamp: Date;
 494:   value?: number;                      // 환산 가치 (선택)
 495:   metadata?: Record<string, string>;   // 비식별 데이터만 — PII 금지
 496: };
 497: ```
 498: 
 499: #### 6.3.1 측정 이벤트 PII 처리 규약 (모든 이벤트 공통)
 500: 
 501: - `page` 필드는 URL path만 (querystring 제거, fragment 제거)
 502: - `referrer`는 origin만 (full URL·querystring 저장 금지)
 503: - IP·user-id·client-id·email·phone 직접 저장 금지
 504: - user-agent는 device family·browser family로 정규화 후 저장 (raw UA 폐기)
 505: - IP 주소 — 수집 시 IPv4는 마지막 octet 마스킹(`/24`), IPv6는 마지막 80비트 마스킹(`/48`)
 506: 
 507: Feature Module이 이 이벤트를 구독해 CrUX·GA4·자체 RUM 백엔드 등으로 전송.
 508: 
 509: ---
 510: 
 511: ## 7. 외부 도구 연동 인터페이스 (Core)
 512: 
 513: ### 7.1 네이버 서치어드바이저·Google Search Console 메타 verification
 514: 
 515: - `<meta name="google-site-verification">`·`<meta name="naver-site-verification">` 출력 — `InstanceManifest.searchConsoleVerification` 기반
 516: - Core는 메타 출력만, 실제 콘솔 등록·데이터 수집은 운영자·`analytics-reporting` 모듈
 517: 
 518: ### 7.2 Sitemap 제출
 519: 
 520: - robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
 521: - 수동 제출(서치어드바이저·GSC)은 운영자 책임
 522: 
 523: ### 7.3 측정 이벤트·리포트 인터페이스
 524: 
 525: - § 6.3 표준 이벤트 3종: `PerformanceEvent` · `PageViewEvent`(v0.7 +) · `ConversionEvent`(v0.7 +)
 526: - PII 처리 규약은 § 6.3.1 SoT (v0.7 +)
 527: - 상세 수집·정규화·캐시·리포트 생성·발송은 `docs/features/analytics-reporting.md` (Feature Module 명세)
 528: 
 529: ---
 530: 
 531: ## 8. 빌드 검증 — 룰 레벨 정합 (SCHEMA_MAPPING § 7.3과 동일 패턴)
 532: 
 533: ### 8.1 룰 레벨
 534: 
 535: | 레벨 | 정의 | 조치 |
 536: |---|---|---|
 537: | **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
 538: | **warning** | 경고 + 어드민 검토 큐 | title/description 길이 미달, ogImageUrl 누락, LCP 2.5~4.0s, Bundle Size 200~500KB 등 |
 539: | **content-gate** | 본문 표현 검수 | (본 문서는 메타·robots·sitemap 중심이라 content-gate 항목 적음. `CONTENT_STANDARDS.md`에서 다룸) |
 540: 
 541: ### 8.2 빌드 게이트 vs 운영 모니터링 분리
 542: 
 543: | 단계 | 도구 | 실패 시 |
 544: |---|---|---|
 545: | 빌드 게이트 (CI) | 자체 룰 checker + Lighthouse CLI | 빌드 실패 |
 546: | 운영 모니터링 | RUM·CrUX·서치어드바이저·GSC·`analytics-reporting` 모듈 | 경고·이슈 트래커 |
 547: 
 548: ---
 549: 
 550: ## 9. 미결정 사항
 551: 
 552: | ID | 항목 | 비고 |
 553: |---|---|---|
 554: | SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
 555: | SS-02 | hreflang 출력 자동화 깊이 — 단순 lang vs lang+region (예: `ko`·`ko-KR`) | M3 다국어 도입 시 확정 |
 556: | SS-03 | sitemap.xml 분할 임계 — 50,000 URL이 표준이나 운영 효율은 더 작게? | 인스턴스 규모 누적 후 결정 |
 557: | SS-06 | `referrer` 메타 정책 — Core 기본은 미설정, 인스턴스별 결정 | 운영 시 검토 |
 558: | SS-07 | `format-detection: telephone=no` vs 기본 활성화 | 모바일 UX 결정 |
 559: | SS-08 | 외부 도메인 canonical 허용 정책 — warning vs fail | 운영 시 결정 |
 560: 
 561: ### 9.1 해소된 미결정 (변경 이력 참조)
 562: 
 563: | ID | 항목 | 해소 |
 564: |---|---|---|
 565: | SS-04 | `InstanceManifest.performanceBudget` 강화 override 범위 | v0.6 — DATA_MODEL C-08 `PerformanceBudget` 7개 필드 / v0.7 — § 6.1 강화 판정 방향 |
 566: | ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |
 567: 
 568: ---
 569: 
 570: ## 10. 변경 이력
 571: 
 572: | 일자 | 버전 | 변경 |
 573: |---|---|---|
 574: | 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
 575: | 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
 576: | 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
 577: | 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
 578: | 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
 579: | 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
 580: | 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
 581: | 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
 582: | 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |
 583: | 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
 584: | 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
 585: | 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 P-006/P-008 OG `article:*` 제한 출력 주석 추가** — 표 오해 방지, (2) **§ 3.2 매트릭스 C 계열 컬럼명에 `(best-effort)` 명시** — 정책의 한계를 표 자체에 드러냄, (3) **§ 9 SS-01 구체화** — 분기 1회 재검증 주기는 결정. 재검증 책임자·업데이트 PR 흐름이 미정으로 명확화, (4) v0.10 → **v1.0 격상** — 사용자 피드백 "구현 가능한 명세 수준 도달·기능 구현을 막는 수준의 결함 없음" 채택. 다음 단계는 SchemaGenerator 일부 + rule checker + robots/sitemap generator 실제 구현 + 그 발견을 문서에 되먹이기 |

 succeeded in 966ms:
   1: # Core — 페이지 타입 표준
   2: 
   3: > **상태**: Draft v0.8
   4: > **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 7
   7: > **목적**: 솔루션이 표준화하는 의료기관 웹사이트 페이지 타입을 단독 구현 가능한 수준으로 정의한다.
   8: > **외부 공유 시 주의**: 표현 리스크 어휘 회피.
   9: > **연관 문서**:
  10: > - 데이터 계약·공통 타입 → `core/DATA_MODEL.md`
  11: > - JSON-LD Schema graph → `core/SCHEMA_MAPPING.md`
  12: > - 메타 태그 → `core/SEARCH_STANDARDIZATION.md`
  13: > - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`
  14: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
  15: > - 위험도 등급 → `compliance/RISK_LEVELS.md`
  16: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
  17: 
  18: ---
  19: 
  20: ## 0. 한 페이지 요약
  21: 
  22: - 필수 14종 + 선택 7종 = **21종 페이지 타입**.
  23: - M0 Slice: **9종 + Article 1샘플 = 10개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플).
  24: - **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
  25: - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
  26: - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
  27: 
  28: ---
  29: 
  30: ## 1. 페이지 타입 분류
  31: 
  32: ### 1.1 필수 타입 (Core 표준 14종)
  33: 
  34: | ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
  35: |---|---|---|---|:---:|
  36: | P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
  37: | P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
  38: | P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
  39: | P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
  40: | P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
  41: | P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
  42: | P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
  43: | P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
  44: | P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
  45: | P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
  46: | P-011 | FAQ | `/faq` | `FAQ[]` | |
  47: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
  48: | P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
  49: | P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
  50: 
  51: ### 1.2 선택 타입 (7종)
  52: 
  53: | ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
  54: |---|---|---|---|---|
  55: | P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
  56: | P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
  57: | P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
  58: | P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
  59: | P-105 | Reservation | `/reservation` | Instance 결정 (Contact 통합 가능) | 전환 추적 단위 |
  60: | P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
  61: | P-107 | (예약됨) | | | 미래 확장용 |
  62: 
  63: ---
  64: 
  65: ## 2. 공통 룰 (모든 페이지 타입 적용)
  66: 
  67: ### 2.1 헤딩 위계
  68: - H1은 페이지당 1개. 페이지의 주제·정체성.
  69: - H2는 페이지 내 주요 섹션. 명사형 또는 질문형.
  70: - H3은 H2 하위 세부 단위.
  71: - H4 이하 자제 (AI 스니펫 추출 난이도 ↑).
  72: 
  73: ### 2.2 시맨틱 마크업
  74: - `<header>` / `<main>` / `<article>` / `<section>` / `<nav>` / `<footer>` 의미적 사용.
  75: - 콘텐츠 본문은 `<article>`. 보조 섹션은 `<aside>` 또는 `<section>`.
  76: - BreadcrumbList는 `<nav aria-label="breadcrumb">`.
  77: 
  78: ### 2.3 메타 태그·robots·sitemap·canonical
  79: - 모든 페이지에 title·description·canonical·og:*·twitter:* 필요.
  80: - 상세는 `core/SEARCH_STANDARDIZATION.md`.
  81: 
  82: ### 2.4 BreadcrumbList
  83: - Home 제외 모든 페이지에 JSON-LD BreadcrumbList 포함.
  84: 
  85: ### 2.5 내부 링크 원칙
  86: - 의미 있는 anchor text. 콘텐츠 클러스터.
  87: 
  88: ### 2.6 AEO·AI 스니펫 친화
  89: - 핵심 답변 문단 시작 1~2문장.
  90: - Q&A 블록·리스트·표 의도적 혼합.
  91: - H2 질문형 권장.
  92: 
  93: ---
  94: 
  95: ## 3. 필수 페이지 타입 상세
  96: 
  97: ### P-001. Home
  98: 
  99: **목적**: 의료기관 정체성·전문 영역·핵심 가치 제안을 첫 시각에 전달.
 100: **URL**: `/`
 101: **주 데이터 계약**: `ClinicProfile` (요약 필드)
 102: **Schema 요약**: `Organization` + `MedicalClinic` + `WebSite` (SearchAction). BreadcrumbList 미적용.
 103: 
 104: **정보 슬롯**:
 105: 1. 히어로 — 기관명·전문 분야·핵심 가치
 106: 2. 주요 시술·진료 영역 요약
 107: 3. 의료진 요약
 108: 4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
 109: 5. 위치·진료시간·연락처 요약 (`LocationProfile` main 참조)
 110: 6. (선택) 인증·수상·미디어 노출
 111: 
 112: **헤딩 위계**: H1 핵심 메시지 / H2 "진료 영역", "의료진 소개", "최근 인사이트", "방문 안내"
 113: **필수 블록**: 히어로 / 시술 요약 / 의료진 요약 / 연락 요약
 114: **선택 블록**: 최신 글 / 인증·미디어 / 후기 요약 (위험도 High)
 115: **레이아웃 변형**: 히어로(풀블리드/분할/미니멀), 시술 요약(카드 그리드/가로 스크롤/리스트)
 116: **위험도 기본값**: Low
 117: **컴플라이언스 주의**: 후기 요약 노출 시 `ReviewPolicy` 준수.
 118: **내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)
 119: 
 120: ### P-002. About (병원 소개)
 121: 
 122: **목적**: 의료기관 정체성·연혁·철학·시설·인증·연구·미디어를 상세히 노출. AI 사이트 브리핑의 핵심 원천.
 123: **URL**: `/about`
 124: **주 데이터 계약**: `ClinicProfile` (전체)
 125: **Schema 요약**: `Organization` + `MedicalClinic` (with founder, foundingDate, award, member) + BreadcrumbList.
 126: 
 127: **정보 슬롯**:
 128: 1. 정식 명칭·영문명·법인명
 129: 2. 슬로건·핵심 가치
 130: 3. 설립일·연혁 타임라인
 131: 4. 진료 철학·차별점
 132: 5. 대표/원장 인사말·스토리 (`founderStory`)
 133: 6. 위치 — `LocationProfile` main 참조 (지도)
 134: 7. 사업자등록번호·통신판매업 신고번호
 135: 8. 인증·수상 (Award 단위 풍부)
 136: 9. 소속 학회·연구 협력
 137: 10. 연구·논문·특허 (`TrustMetric[]` 노출)
 138: 11. 미디어 노출·언론보도
 139: 12. 팀 요약 (Doctors List 진입)
 140: 13. (선택) 사회공헌·후원
 141: 
 142: **헤딩 위계**: H1 "{ClinicName} 소개" / H2 "연혁", "진료 철학", "대표 인사말", "인증·수상", "소속·연구", "미디어", "사회공헌"
 143: **필수 블록**: 연혁 / 진료 철학 / 위치 / 인증·소속
 144: **선택 블록**: 인사말 / 미디어 / 연구·논문 / 사회공헌 / 시설 사진
 145: **레이아웃 변형**: 연혁(타임라인/리스트/텍스트), 인증(배지 그리드/카드/리스트)
 146: **위험도 기본값**: Low
 147: **컴플라이언스 주의**: 최상급·효과 단정 금지. 인증·수상·연구는 사실·증빙 가능한 것만. `TrustMetric`은 사실 안내형 표현.
 148: **내부 링크 권장**: → Doctors List / Treatments List / Contact / Articles
 149: 
 150: ### P-003. Doctors List
 151: 
 152: **목적**: 의료진 전체 목록 + 프로필 상세 진입.
 153: **URL**: `/doctors`
 154: **주 데이터 계약**: `DoctorProfile[]`
 155: **Schema 요약**: BreadcrumbList + ItemList.
 156: 
 157: **정보 슬롯**: 의료진 카드(이름·진료분야·간략 약력·사진) / 진료분야 필터·그룹(선택)
 158: **헤딩 위계**: H1 "의료진 소개" / H2 진료분야 그룹명(있을 시)
 159: **필수 블록**: 의료진 카드 그리드
 160: **선택 블록**: 분야 필터 / 대표 의료진 인사말
 161: **레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 인터랙티브
 162: **위험도 기본값**: Low
 163: **컴플라이언스 주의**: 자격·학회·논문은 검증 가능한 범위.
 164: **내부 링크 권장**: → 각 Doctor Profile / Treatments List
 165: 
 166: ### P-004. Doctor Profile
 167: 
 168: **목적**: 개별 의료진 권위·전문성·E-E-A-T 노출. 저자 프로필.
 169: **URL**: `/doctors/{slug}`
 170: **주 데이터 계약**: `DoctorProfile`
 171: **Schema 요약**: `Physician` (with medicalSpecialty, affiliation, alumniOf) + BreadcrumbList.
 172: 
 173: **정보 슬롯**:
 174: 1. 이름·직책·진료 분야·사진
 175: 2. 자격·면허
 176: 3. 학력·전공
 177: 4. 소속·경력
 178: 5. 학회·연구
 179: 6. 개인 스토리 (`personalStory`)
 180: 7. 논문·기고
 181: 8. 미디어 노출
 182: 9. 진료 철학·인사말
 183: 10. 작성한 인사이트 (Articles 백링크)
 184: 11. 예약·문의 CTA (해당 시)
 185: 
 186: **헤딩 위계**: H1 "{Doctor Name} {직책}" / H2 "자격", "경력", "스토리", "학회·연구", "논문", "미디어", "인사이트"
 187: **필수 블록**: 자격 / 경력 / 진료 분야
 188: **선택 블록**: 개인 스토리 / 논문 / 미디어 / 작성한 글 / 인사말
 189: **레이아웃 변형**: 좌사진·우본문 / 풀폭 헤더+본문 / 매거진형
 190: **위험도 기본값**: Low
 191: **컴플라이언스 주의**: 검증 가능한 자격·논문. 최상급 표현 금지. 개인 스토리에 효과 단정 금지.
 192: **내부 링크 권장**: → Doctors List / Treatments (분야 일치) / 작성한 Articles
 193: 
 194: ### P-005. Treatments List
 195: 
 196: **목적**: 시술·진료 영역 전체 노출.
 197: **URL**: `/treatments`
 198: **주 데이터 계약**: `TreatmentPage[]`
 199: **Schema 요약**: BreadcrumbList + ItemList.
 200: 
 201: **정보 슬롯**: 시술 카드(이름·간략 설명·대상) / 진료 분야 그룹(선택)
 202: **헤딩 위계**: H1 "진료 안내" / H2 분야 그룹명
 203: **필수 블록**: 시술 카드 그리드
 204: **선택 블록**: 분야 필터
 205: **레이아웃 변형**: 카드 / 탭 / 아코디언 / 풀스크린 스크롤
 206: **위험도 기본값**: Low
 207: **컴플라이언스 주의**: 시술명·간략 설명에 효과 단정·최상급 금지.
 208: **내부 링크 권장**: → 각 Treatment Detail / Conditions
 209: 
 210: ### P-006. Treatment Detail
 211: 
 212: **목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
 213: **URL**: `/treatments/{slug}`
 214: **주 데이터 계약**: `TreatmentPage`
 215: **Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
 216: 
 217: **정보 슬롯**:
 218: 1. 시술명·요약 (1~2문장 핵심 답변)
 219: 2. 개요 (정의·목적)
 220: 3. 원리 (어떻게 작동)
 221: 4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
 222: 5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
 223: 6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
 224: 7. 과정 (단계별)
 225: 8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
 226: 9. 소요 시간·횟수
 227: 10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
 228: 11. 주의사항·금기증
 229: 12. 시술 후 관리
 230: 13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
 231: 14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
 232: 15. 자주 묻는 질문
 233: 16. 담당 의료진 (백링크)
 234: 17. 관련 질환 (백링크)
 235: 18. 예약·문의 CTA
 236: 
 237: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
 238: 
 239: **헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
 240: **필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항
 241: **선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
 242: 
 243: **레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)
 244: 
 245: **위험도 기본값**: **Medium**
 246: 
 247: **슬롯별 위험도 격상 조건**:
 248: 
 249: | 슬롯 | 기본 | 격상 조건 |
 250: |---|---|---|
 251: | 개요·원리·과정·주의사항 | Medium | — |
 252: | 대상 (`recommendedFor`) | Medium | "이런 분은 꼭 필요" 권유형 → High |
 253: | 구성 (`treatmentComponents`) | Medium | 구성별 효과 단정 → High |
 254: | 방문 흐름 (`visitFlow`) | Medium | — |
 255: | 프로그램 변형 (`programVariants`) | Medium | 가격·기간·횟수 약속 결합 → High |
 256: | 소요·횟수 | Medium | 감량 수치·기간 약속 → High |
 257: | 유지 계획 (`maintenancePlan`) | Medium | "100% 요요 방지" 등 → High |
 258: | 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
 259: | FAQ | 답변별 가변 | 효과·결과 답변 → High |
 260: | 후기·전후사진 (포함 시) | — | **자동 High** |
 261: | 가격·이벤트 (포함 시) | — | **자동 High** |
 262: | CTA | Low~Medium | 할인·이벤트 결합 → High |
 263: 
 264: **컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.
 265: 
 266: **내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
 267: 
 268: ### P-007. Conditions List
 269: 
 270: **목적**: 질환·증상 정보 페이지 진입로. 다이어트 한의원은 증상 기반 쿼리 비중 큼 (Phase Alpha 우선 합류 권장).
 271: **URL**: `/conditions`
 272: **주 데이터 계약**: `MedicalConditionPage[]`
 273: **Schema 요약**: BreadcrumbList + ItemList.
 274: 
 275: **정보 슬롯**: 질환·증상 카드 / 분류 그룹(선택)
 276: **헤딩 위계**: H1 "질환·증상 정보" / H2 분류 그룹명
 277: **필수 블록**: 카드 그리드
 278: **선택 블록**: 분류 필터
 279: **레이아웃 변형**: P-005 동일
 280: **위험도 기본값**: Low
 281: **컴플라이언스 주의**: 질환명·간략 설명에 진단 단정·효과 표현 금지.
 282: **내부 링크 권장**: → 각 Condition Detail / 관련 Treatments
 283: 
 284: ### P-008. Condition Detail
 285: 
 286: **목적**: 특정 질환·증상 정보 콘텐츠. 검색 의도 "OO증상이 뭐예요" 충족.
 287: **URL**: `/conditions/{slug}`
 288: **주 데이터 계약**: `MedicalConditionPage`
 289: **Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
 290: 
 291: **정보 슬롯**:
 292: 1. 정의·핵심 답변 (1~2문장)
 293: 2. 주요 증상
 294: 3. 원인·위험 요인
 295: 4. 진단 방법 (일반론)
 296: 5. 치료 옵션 개요 (Treatment Detail로 링크)
 297: 6. 예방·관리
 298: 7. 자주 묻는 질문
 299: 8. 관련 시술 (백링크)
 300: 9. 관련 의료진
 301: 
 302: **헤딩 위계**: H1 질환명 / H2 "주요 증상", "원인", "진단", "치료", "예방·관리", "자주 묻는 질문"
 303: **필수 블록**: 정의 / 주요 증상 / 원인 / 치료 옵션 / 예방
 304: **선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
 305: **레이아웃 변형**: P-006 동일
 306: **위험도 기본값**: Medium
 307: **컴플라이언스 주의**: 진단·치료 단정 금지. 자가 진단 유도 금지. 일반 의학 정보로 한정.
 308: **내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
 309: 
 310: ### P-009. Articles List
 311: 
 312: **목적**: 인사이트·정보 콘텐츠 목록.
 313: **URL**: `/insights` 또는 `/blog`
 314: **주 데이터 계약**: `Article[]`
 315: **Schema 요약**: BreadcrumbList + ItemList 또는 Blog.
 316: 
 317: **정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
 318: **헤딩 위계**: H1 "인사이트" / H2 Pillar 그룹
 319: **필수 블록**: Article 카드 목록
 320: **선택 블록**: 카테고리 필터 / 검색 / RSS / 콘텐츠 형식 필터
 321: **레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 잡지형
 322: **위험도 기본값**: Low
 323: **컴플라이언스 주의**: 발췌 요약에 의학적 단정 금지.
 324: **내부 링크 권장**: → 각 Article Detail / 카테고리 페이지
 325: 
 326: > v0.5 비고: Article에 `contentFormat`(article·video·column) 필드. P-009는 분할하지 않고 형식 배지·필터로 분류.
 327: 
 328: ### P-010. Article Detail
 329: 
 330: **목적**: 단일 인사이트·정보 콘텐츠. AI 스니펫 인용 핵심 단위.
 331: **URL**: `/insights/{category}/{slug}` 또는 `/blog/{slug}`
 332: **주 데이터 계약**: `Article`
 333: **Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
 334: 
 335: **정보 슬롯**:
 336: 1. 제목 + 핵심 요약 (1~2문장)
 337: 2. 메타 (저자·발행일·수정일·읽기 시간·카테고리·콘텐츠 형식 배지)
 338: 3. 본문 (의도적 구조 — 헤딩·리스트·표·Q&A)
 339: 4. 임베디드 미디어 (`embeddedMedia[]`) — YouTube·외부 인용
 340: 5. **검수 정보** (`reviewedBy`) ⭐ — 의료진 검수자
 341: 6. **출처·재게재** (`contentSource`·`externalUrl`) ⭐ — 자체 작성 / 외부 인용 / 재게재 명시
 342: 7. 저자 프로필 카드 (DoctorProfile 백링크)
 343: 8. 관련 글 (같은 Pillar 3개)
 344: 9. 관련 시술·질환
 345: 10. CTA
 346: 
 347: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 Article 신규 필드)
 348: 
 349: **헤딩 위계**: H1 글 제목 / H2 본문 섹션 (질문형 권장)
 350: **필수 블록**: 제목 / 메타 / 본문 / 저자 카드
 351: **선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
 352: 
 353: **ArticleType별 위험도 분류**:
 354: 
 355: | ArticleType | 기본 위험도 |
 356: |---|:---:|
 357: | `notice` | Low |
 358: | `general-medical-info` | Medium |
 359: | `treatment-explainer` | Medium |
 360: | `condition-explainer` | Medium |
 361: | `effect-result-related` | **High** |
 362: | `review-case` | **High** |
 363: | `event-price` | **High** |
 364: 
 365: **레이아웃 변형**: 좌본문·우사이드바 / 풀폭 본문 / 매거진형
 366: 
 367: **컴플라이언스 주의**: 수정 시 `dateModified` 갱신. 의료진 검토 필수 (Medium/High). Embedded video도 ArticleType·RiskLevel 적용. `contentSource: republished` 시 원본 권한·출처 표시 의무. `reviewedBy`는 의료진(DoctorProfile) 참조.
 368: 
 369: **내부 링크 권장**: → 저자 프로필 / 관련 Articles / 관련 Treatments / 관련 Conditions
 370: 
 371: ### P-011. FAQ
 372: 
 373: **목적**: 자주 묻는 질문. AI 스니펫·사이트 브리핑 직접 인용 후보.
 374: **URL**: `/faq`
 375: **주 데이터 계약**: `FAQ[]`
 376: **Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
 377: 
 378: **정보 슬롯**: 카테고리 그룹별 Q&A 쌍
 379: **헤딩 위계**: H1 "자주 묻는 질문" / H2 카테고리명 / H3 각 질문(또는 아코디언)
 380: **필수 블록**: Q&A 쌍 모음
 381: **선택 블록**: 카테고리 필터 / 검색
 382: **레이아웃 변형**: 아코디언 / 평면 리스트 / 카드 / 탭
 383: 
 384: **위험도 — 답변 단위 분류**:
 385: 
 386: | 답변 주제 | 등급 |
 387: |---|---|
 388: | 진료·예약·위치·시간 | Low |
 389: | 시술·치료 일반론 | Medium |
 390: | 치료 효과·결과·후기 | High |
 391: | 가격·이벤트 | High |
 392: 
 393: **컴플라이언스 주의**: 효과 단정·"100% 안전" 금지.
 394: **내부 링크 권장**: → 관련 Treatment / Article / Condition
 395: 
 396: ### P-012. Contact / Visit — Conversion Hub
 397: 
 398: **목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
 399: **URL**: `/contact` 또는 `/visit`
 400: **주 데이터 계약**: `ClinicProfile` (요약) + `LocationProfile[]` (1개 이상) + `CTAConfig[]`
 401: **Schema 요약**: 단지점은 `MedicalClinic`/`LocalBusiness`. 다지점은 본원 + 각 지점 별도 LocalBusiness. BreadcrumbList.
 402: 
 403: **정보 슬롯**:
 404: 1. **예약·상담 채널 집결** — 전화·네이버예약·네이버톡톡·카카오톡·온라인폼·비대면진료·외부 예약 (모두 `CTAConfig[]`)
 405: 2. 주소·지도 (단지점 main 또는 다지점 목록)
 406: 3. 진료시간·접수시간·점심·휴진 (`BusinessHours`)
 407: 4. 대중교통·주차 안내
 408: 5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
 409: 6. 응급·긴급 대응 (해당 시)
 410: 7. 진료 전 준비 사항 (해당 시)
 411: 
 412: **헤딩 위계**: H1 "방문 안내" 또는 "예약·상담" / H2 "예약 채널", "위치", "진료시간", "오시는 길", "다른 지점"
 413: **필수 블록**: 예약·상담 채널(다중) / 주소 / 진료시간 / 연락처
 414: **선택 블록**: 지도 / 대중교통 / 주차 / 다지점 목록 / 응급 안내
 415: **레이아웃 변형**: 분할 / 풀폭 지도+CTA 카드 / 채널 카드 그리드 + 위치 분리
 416: **위험도 기본값**: Low
 417: **컴플라이언스 주의**: 표시 정보(주소·전화·시간) 정확성 유지. 변경 시 즉시 갱신. 이벤트·할인과 결합 시 High 격상.
 418: **내부 링크 권장**: → Home / About / Doctors List / Reservation(있을 시) / 각 Location Detail(다지점)
 419: 
 420: ### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
 421: 
 422: **목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
 423: **URL**: `/privacy`, `/terms`, `/non-covered` 등
 424: **주 데이터 계약**: `LegalDocument`
 425: **Schema 요약**: 일반적으로 `WebPage`. 검색 노출 우선순위 낮음.
 426: 
 427: **M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
 428: - Core가 **표준 템플릿** 보유: 개인정보처리방침·이용약관·비급여 진료 안내·환불·민원 처리 등 1차 템플릿.
 429: - 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
 430: - **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
 431: - 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
 432: 
 433: **정보 슬롯**:
 434: 1. 정책 종류·제목
 435: 2. 시행일·최종 개정일
 436: 3. 본문 (조항·항목 위계)
 437: 4. 개정 이력 (필요 시)
 438: 5. 문의처 (개인정보 보호 책임자 등)
 439: 
 440: **헤딩 위계**: H1 정책 제목 / H2 조항·항목명
 441: **필수 블록**: 시행일 / 본문 / 문의처
 442: **선택 블록**: 개정 이력
 443: **레이아웃 변형**: 평면 본문 / TOC 사이드바
 444: **위험도 기본값**: Low (사실 안내. 법적 정확성 확인 필수)
 445: **컴플라이언스 주의**:
 446: - 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
 447: - 의료법·개인정보보호법·정통망법·표시광고법 준수.
 448: - 표준 템플릿 그대로 사용 시에도 클라이언트 사업자번호·연락처·시행일·법인명 등 변수 정확성 확인.
 449: 
 450: **내부 링크 권장**: 푸터 전체 접근. 본문 내부 링크는 일반적으로 없음.
 451: 
 452: ### P-014. Location / Branch Detail
 453: 
 454: **목적**: 단지점·다지점 의료기관의 개별 지점 상세. 단일 지점도 main location으로 모델링.
 455: **URL**: `/locations/{slug}` (단일이면 `main`)
 456: **주 데이터 계약**: `LocationProfile`
 457: **Schema 요약**: `MedicalClinic`/`LocalBusiness` (지점 단위 별도 entity) + BreadcrumbList. 본원·지점 각자.
 458: 
 459: **정보 슬롯**:
 460: 1. 지점명·간략 소개
 461: 2. 주소·지도 임베드 (지점 좌표)
 462: 3. 진료시간·접수시간·점심·휴진 (`BusinessHours`) — 지점별
 463: 4. 예약·상담 채널 (`CTAConfig[]`) — 지점 직통
 464: 5. 대중교통·주차 안내 (지점 특화)
 465: 6. 지점 의료진
 466: 7. 지점 시술 (전체 또는 지점 특화)
 467: 8. 지점 사진·시설
 468: 9. 다른 지점 안내 (Locations List 또는 형제 지점)
 469: 
 470: **헤딩 위계**: H1 "{ClinicName} {지점명}점" / H2 "위치", "진료시간", "예약·상담", "의료진", "오시는 길"
 471: **필수 블록**: 주소 / 진료시간 / 연락처·예약 채널 / 지점 의료진
 472: **선택 블록**: 지도 / 대중교통 / 주차 / 시설 사진 / 다른 지점
 473: **레이아웃 변형**: 분할 / 풀폭 / 매거진형
 474: **위험도 기본값**: Low
 475: **격상 조건**: 지점별 이벤트·할인·후기·전후사진 → High
 476: **컴플라이언스 주의**: 지점 정보 정확성·즉시 갱신. 비교·최상급 금지.
 477: **내부 링크 권장**: → Home / Contact / 다른 Location Detail / 해당 지점 Doctors
 478: 
 479: **🔧 단지점 인스턴스의 자동 생성 규칙 (v0.6 정합)**:
 480: 
 481: > 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.
 482: 
 483: - 운영자가 어드민의 **ClinicProfile 화면 두 섹션**(기관 정체성 + 본원 위치·연락·시간)을 입력하면, 어드민이 두 파일을 동시 출력:
 484:   - **`ClinicProfile`** — 기관 정체성 섹션 입력값
 485:   - **`LocationProfile`**(slug=`main`) — 본원 위치·연락·시간 섹션 입력값 (LocationProfile이 위치·시간·연락 SoT)
 486: - LocationProfile main 자동 매핑 핵심:
 487:   - `name` = ClinicProfile의 `name` (또는 "본원")
 488:   - `parentClinic` = ClinicProfile의 `@id`
 489:   - `address`·`telephone`·`email`·`businessHours` = 본원 위치·연락·시간 섹션 입력값
 490:   - `representativeDoctors`·`doctorsAtLocation`·`availableTreatments` = 기본 전체 (운영자가 별도 지정 가능)
 491:   - **`reservationChannels`** = ClinicProfile의 `primaryCtas[]` 상속 (지점 직통 채널 별도 지정 가능)
 492:   - **`featuredChannelId`** (선택) — 강조할 채널이 있을 때만 `reservationChannels[]`의 `@id` 명시
 493: - **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
 494: - 다지점 확장 시 별도 LocationProfile 추가 화면 도입 (Phase Beta+).
 495: 
 496: **다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
 497: 
 498: ---
 499: 
 500: ## 4. 선택 페이지 타입 상세
 501: 
 502: ### P-101. Reviews — High-risk commercial
 503: 
 504: **목적**: 환자 후기 노출. 솔루션의 가장 위험한 영역.
 505: **URL**: `/reviews`
 506: **주 데이터 계약**: `ReviewPolicy` (필수) + 후기 콘텐츠
 507: **Schema 요약**: `Review` 사용 신중. BreadcrumbList만 권장.
 508: **활성화**: Add-on + 법무·외부 자문 + compliance-assistant 자동 검수
 509: **정보 슬롯**: ReviewPolicy에 따라 결정 — 일반적으로 후기 카드 / 정책 안내 / (등록 안내)
 510: **헤딩 위계**: H1 "환자 후기" / H2 분류·정렬
 511: **필수 블록**: 정책 안내 / 후기 카드
 512: **레이아웃 변형**: 카드 그리드 / 리스트 / 슬라이더(주의)
 513: **위험도 기본값**: **High**
 514: **컴플라이언스 주의**: 의료법 제56조·제57조 위반 소지. 효과 단정 후기 금지. 전후사진은 의료광고심의 대상. "환자 주관적 경험" 명시 + 의학적 효과 분리. 법무 자문 권장.
 515: 
 516: ### P-102. Pricing — High-risk commercial
 517: 
 518: **목적**: 진료·시술 비용 정보.
 519: **URL**: `/pricing`
 520: **주 데이터 계약**: `PricingPage`
 521: **Schema 요약**: 신중. `Offer` 부적합. `WebPage`만 권장.
 522: **활성화**: Add-on + compliance-assistant
 523: **정보 슬롯**: 진료 항목·간략 설명 / 가격(범위) / 비급여 명시 / 적용 조건 / 결제·환불 정책 / 문의
 524: **헤딩 위계**: H1 "가격 안내" / H2 진료 카테고리
 525: **필수 블록**: 진료 항목 / 가격 / 적용 조건
 526: **레이아웃 변형**: 표 / 카드 / 리스트
 527: **위험도 기본값**: **High**
 528: **컴플라이언스 주의**: 가격 광고 제한. "최저가·할인·특가" 금지. 비급여 명시. 이벤트·할인 결합 신중.
 529: 
 530: ### P-103. Facilities / Equipment
 531: 
 532: **목적**: 시설·장비 소개.
 533: **URL**: `/facilities`
 534: **주 데이터 계약**: `FacilitiesPage`
 535: **Schema 요약**: 일반적으로 `WebPage`.
 536: **활성화**: Instance 결정
 537: **정보 슬롯**: 진료 환경 개요 / 시설 카테고리 / 각 시설 사진·설명 / (해당 시) 장비 도입 사실·기본 사양 / 위생·관리 안내
 538: **헤딩 위계**: H1 "시설 안내" / H2 시설 카테고리
 539: **필수 블록**: 시설 개요 / 시설 사진·설명
 540: **레이아웃 변형**: 갤러리 / 카드 / 타임라인
 541: **위험도 기본값**: Medium
 542: **컴플라이언스 주의**: 시설·장비 효과·우월성 단정 금지. "국내 유일·최첨단·최고급" 등 금지.
 543: 
 544: ### P-104. News / Event (소식·이벤트)
 545: 
 546: **목적**: 의료기관 소식·이벤트 안내.
 547: **URL**: `/news`
 548: **주 데이터 계약**: `NewsItem[]` (또는 `Article[]` ArticleType 활용)
 549: **Schema 요약**: 일반 소식은 `Article` 또는 `NewsArticle`. 이벤트 콘텐츠는 schema 신중.
 550: **활성화**: 일반 소식 Instance 결정 / 이벤트 카테고리는 Add-on
 551: **정보 슬롯**: 소식 목록 카드(제목·날짜·요약) / 카테고리(일반·이벤트·휴진)
 552: **헤딩 위계**: H1 "소식" / H2 카테고리
 553: **필수 블록**: 소식 카드 목록
 554: **레이아웃 변형**: 카드 / 타임라인 / 잡지형
 555: **위험도 기본값 — 카테고리별 가변**:
 556: 
 557: | 카테고리 | 등급 |
 558: |---|---|
 559: | 일반 소식·휴진·이전 | Low |
 560: | 이벤트·할인 | **High** (commercial) |
 561: 
 562: **컴플라이언스 주의**: 이벤트·할인은 의료광고법 가장 엄격. 사전심의 필요성 신중. 환자 유인 표현 금지. 노출 자동 만료 권장.
 563: 
 564: ### P-105. Reservation
 565: 
 566: **목적**: 예약 안내·전환. 외부 예약 시스템 통합. 전환 추적 단위.
 567: **URL**: `/reservation`
 568: **주 데이터 계약**: `ReservationPage` (ClinicProfile 필드 참조)
 569: **Schema 요약**: `MedicalClinic`/`LocalBusiness`의 `potentialAction` ReserveAction. BreadcrumbList.
 570: **활성화**: Instance 결정 (Contact 통합 가능)
 571: **정보 슬롯**: 예약 채널 안내 / 예약 가능 시간 / 진료 전 준비 / 변경·취소 / 응급 진료
 572: **헤딩 위계**: H1 "예약 안내" / H2 채널·절차·주의사항
 573: **필수 블록**: 예약 채널 / 가능 시간 / 변경·취소
 574: **레이아웃 변형**: 채널 카드 / 단계형 가이드 / 분할
 575: **위험도 기본값**: Low
 576: **컴플라이언스 주의**: 사실 안내. 이벤트·할인 결합 시 High 격상.
 577: 
 578: ### P-106. Self-test / Quiz — Feature-backed optional page
 579: 
 580: **목적**: 사용자 셀프 진단·자가 테스트. 리드 생성·콘텐츠 차별화. 자생한방병원 사례 참조.
 581: **URL**: `/self-test/{slug}`
 582: **주 데이터 계약**: `SelfTest` (DM-06 후속 풀명세 예정)
 583: **Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
 584: **활성화**: **Feature Module이 콘텐츠·로직 제공** — Self-test가 단순 정적 페이지가 아니라 동적 입력·결과 해석을 포함하므로 별도 Feature Module이 자연스러움. 후보 모듈명: `self-test-module` 또는 `compliance-assistant` 확장. (PT-12 해소 — Feature-backed 결정)
 585: 
 586: **정보 슬롯**: 테스트 제목·목적 / 설계자 의료진 / 고지문 / 문항 / 결과 안내 / 결과 → 상담 CTA / 관련 콘텐츠
 587: **헤딩 위계**: H1 테스트명 / H2 "테스트 안내", "결과 해석", "전문 상담 안내"
 588: **필수 블록**: 고지문 / 문항 / 결과 안내 / 상담 CTA
 589: **선택 블록**: 설계자 의료진 / 점수 산정 / 관련 콘텐츠
 590: **레이아웃 변형**: 단계형 / 일괄형 / 카드형
 591: **위험도 기본값**: Medium
 592: **격상 조건**: 결과에서 진단·치료 단정 → High. 특정 시술 권유 결합 → High.
 593: **컴플라이언스 주의**: 진단 단정 금지. 결과는 "참고용·의료진 상담 권장". 설계자 의료진 검토 필수.
 594: **내부 링크 권장**: → 관련 Treatment / Condition / Article / Reservation
 595: 
 596: > **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
 597: 
 598: ---
 599: 
 600: ## 5. 페이지 타입 매트릭스 (전체 한눈에)
 601: 
 602: | ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
 603: |---|---|---|---|---|:---:|:---:|:---:|
 604: | P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
 605: | P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
 606: | P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
 607: | P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
 608: | P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
 609: | P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
 610: | P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
 611: | P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | MedicalCondition | Medium | | |
 612: | P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
 613: | P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
 614: | P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
 615: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
 616: | P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
 617: | P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
 618: | P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
 619: | P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
 620: | P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
 621: | P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
 622: | P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
 623: | P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |
 624: 
 625: ---
 626: 
 627: ## 6. Vertical Slice (M0) 페이지 타입 — 10개 페이지
 628: 
 629: | 순서 | 페이지 타입 | 비고 |
 630: |---|---|---|
 631: | 1 | P-001 Home | 메인 |
 632: | 2 | P-002 About | ClinicProfile 노출 |
 633: | 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
 634: | 4 | P-004 Doctor Profile | 1개 이상 |
 635: | 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
 636: | 6 | P-006 Treatment Detail | 1개 이상 |
 637: | 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
 638: | 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
 639: | **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
 640: | (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
 641: 
 642: **M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
 643: 
 644: **M0 미합류 합류 우선순위**:
 645: 1. P-009 Articles List
 646: 2. P-011 FAQ
 647: 3. P-007/P-008 Conditions (다이어트 한의원 증상 기반 쿼리)
 648: 
 649: ---
 650: 
 651: ## 7. 페이지 타입 추가·변경 정책
 652: 
 653: - 새 페이지 타입 추가 = Core MAJOR 변경. 데이터 계약·Schema·디자인 영향. `release/VERSIONING_POLICY.md` 적용.
 654: - 선택 페이지 타입 채택 = Preset/Instance 결정.
 655: - 업종 특화 페이지 = Preset 추가 정의 (예: 한의원의 "체질 분석").
 656: 
 657: ---
 658: 
 659: ## 8. 미결정 사항
 660: 
 661: | ID | 항목 | 비고 |
 662: |---|---|---|
 663: | PT-01 | Articles vs Blog 명명 | Preset/Instance |
 664: | PT-02 | Category 페이지 별도 타입 | 콘텐츠 누적 후 |
 665: | PT-03 | Search 페이지 별도 타입 | Phase Beta+ |
 666: | PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
 667: | PT-05 | 한의원 특화 페이지 (체질 분석) | Preset 신설 시 |
 668: | PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
 669: | PT-07 | P-105 Reservation vs Contact 통합 | Instance 결정 |
 670: | PT-08 | ArticleType 7종 충분성 | RISK_LEVELS.md |
 671: | PT-09 | FAQ 답변 단위 위험도 UI | admin |
 672: | PT-10 | ~~Self-test 도입~~ | 해소 — P-106 |
 673: | PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
 674: | PT-12 | ~~P-106 Feature Module vs Core 페이지~~ | **v0.5 해소 — Feature-backed optional page로 결정** |
 675: | PT-13 | High-risk commercial pages Add-on 정책 구체화 | compliance/admin |
 676: | PT-14 | LocationProfile main 자동 생성 규칙의 어드민 구현 세부 | admin/ARCHITECTURE.md |
 677: 
 678: ---
 679: 
 680: ## 9. 변경 이력
 681: 
 682: | 일자 | 버전 | 변경 |
 683: |---|---|---|
 684: | 2026-05-13 | v0.1 | 최초 — 필수 12 + 선택 4 |
 685: | 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
 686: | 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
 687: | 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
 688: | 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
 689: | 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
 690: | 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
 691: | 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 1019ms:
   1: # Core — Schema 매핑 표준
   2: 
   3: > **상태**: **v1.0** (구현 명세 안정판)
   4: > **작성일**: 2026-05-14 (v0.10 → v1.0 — § 2.2 룰 레벨 열 추가·안정판 격상)
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 7
   7: > **목적**: 솔루션이 사이트 빌드 시 출력하는 JSON-LD 구조화 데이터의 표준을 정의한다. 각 페이지 타입별 schema 그래프, 데이터 계약 ↔ schema 필드 매핑, 공통 룰, 금지·주의 schema, 빌드 검증을 단독 구현 가능한 수준으로 명시한다.
   8: > **외부 공유 시 주의**: 상위 문서와 동일. 의료 분야 표현 리스크 어휘 회피.
   9: > **연관 문서**:
  10: > - 페이지 타입 정의 → `core/PAGE_TYPES.md`
  11: > - 데이터 계약 → `core/DATA_MODEL.md`
  12: > - 메타 태그·robots·sitemap → `core/SEARCH_STANDARDIZATION.md`
  13: > - 위험도 등급·표현 가이드 → `compliance/RISK_LEVELS.md`
  14: 
  15: ---
  16: 
  17: ## 0. 한 페이지 요약
  18: 
  19: - 모든 페이지는 **하나의 JSON-LD 그래프**(@graph 형태)로 통합 출력. 페이지 타입별 graph 구성 표준화.
  20: - 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
  21: - 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
  22: - **금지 schema** — `Review`·`AggregateRating`·`Offer`·`HealthAndBeautyBusiness`·`MedicalIndication` 단정형·`MedicalRiskFactor` 등은 **빌드 실패 (fail)** — § 8 참조.
  23: - `C-15 SchemaInput` 인터페이스를 본 문서 § 6에서 정식 정의 (DATA_MODEL.md placeholder 해소).
  24: - **공통 entity별 페이지 출력 정책은 § 2.5가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)이 본 표를 따른다.
  25: - **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
  26: 
  27: ---
  28: 
  29: ## 1. 일반 규약
  30: 
  31: ### 1.1 JSON-LD 컨텍스트·통합 그래프
  32: 
  33: **Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)
  34: 
  35: ```html
  36: <script type="application/ld+json">
  37: {
  38:   "@context": "https://schema.org",
  39:   "@graph": [
  40:     { "@type": "Organization", "@id": "...", ... },
  41:     { "@type": "MedicalClinic", "@id": "...", ... },
  42:     { "@type": "BreadcrumbList", "itemListElement": [...] },
  43:     { "@type": "Article", "@id": "...", ... }
  44:   ]
  45: }
  46: </script>
  47: ```
  48: 
  49: - 페이지 타입별 graph 구성 표준은 § 3·§ 4.
  50: - 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.
  51: 
  52: ### 1.2 `@id` 네이밍 규약
  53: 
  54: | Entity | `@id` 패턴 | 예시 |
  55: |---|---|---|
  56: | `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
  57: | `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
  58: | `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
  59: | `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
  60: | `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
  61: | `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#condition` | |
  62: | `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
  63: | `WebSite` | `https://{domain}/#website` | |
  64: | `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
  65: 
  66: > `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
  67: 
  68: ### 1.3 entity Cross-reference
  69: 
  70: 다른 entity 참조는 `@id`만 사용:
  71: 
  72: ```json
  73: {
  74:   "@type": "Article",
  75:   "@id": "https://example.com/insights/diet/yoyo#article",
  76:   "author": { "@id": "https://example.com/doctors/hong#physician" },
  77:   "publisher": { "@id": "https://example.com/#organization" }
  78: }
  79: ```
  80: 
  81: 전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.
  82: 
  83: ### 1.4 단지점 vs 다지점 (SM-05 해소)
  84: 
  85: 본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias 사용 안 함** (entity identity 명확성).
  86: 
  87: | 인스턴스 형태 | Organization | MedicalClinic |
  88: |---|---|---|
  89: | **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
  90: | **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
  91: 
  92: > P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.
  93: 
  94: **`Organization` vs `MedicalClinic`의 책임 분리**:
  95: - `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
  96: - `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
  97: 
  98: ### 1.5 `inLanguage`
  99: 
 100: **CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMeta.inLanguage를 따른다.
 101: 
 102: | 명시 | 명시 안 함 |
 103: |---|---|
 104: | `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
 105: 
 106: > Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
 107: 
 108: ---
 109: 
 110: ## 2. Schema 모듈 카탈로그
 111: 
 112: 본 솔루션이 사용하는 Schema.org 타입과 사용 책임.
 113: 
 114: ### 2.1 표준 Schema 모듈
 115: 
 116: | Schema 타입 | 사용처 | 매핑 데이터 계약 |
 117: |---|---|---|
 118: | `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
 119: | `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
 120: | `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
 121: | `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
 122: | `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
 123: | `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
 124: | `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
 125: | `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
 126: | `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |
 127: | `Article` | P-010 Article Detail | Article (C-04) |
 128: | `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
 129: | `FAQPage` | P-011 FAQ, FAQ 블록 포함 페이지 | FAQ[] (C-12) |
 130: | `Question` / `Answer` | FAQPage.mainEntity | FAQ |
 131: | `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
 132: | `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
 133: | `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
 134: | `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
 135: | `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
 136: | `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
 137: | `PostalAddress` | Address 하위 | Address |
 138: | `GeoCoordinates` | GeoCoordinates 하위 | GeoCoordinates |
 139: | `OpeningHoursSpecification` | BusinessHours 하위 | OpeningHoursSpec |
 140: | `ContactPoint` | 전화·이메일·CTA | (생성기 자동) |
 141: | `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
 142: | `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
 143: 
 144: ### 2.2 금지·주의 Schema — 요약 (상세는 § 8)
 145: 
 146: | Schema | 룰 레벨 | 이유 |
 147: |---|---|---|
 148: | `Review` (개별 후기) | **fail** | 의료광고법 — 후기·전후사진은 사전심의 대상. P-101 활성화 시에도 schema 미출력 + 법무 자문 |
 149: | `AggregateRating` | **fail** | 의료기관 평점 표시 위반 소지 |
 150: | `Offer`·`DrugCost`·`MedicalCost` | **fail** | 의료 가격 광고 제한 |
 151: | `MedicalRiskFactor`·`MedicalRiskEstimator` | **fail** | 진단 단정형. 본문 표현은 content-gate |
 152: | `MedicalIndication` (단정형 schema) | **fail** | 효능 단정. 본문 효능 표현은 content-gate |
 153: | `MedicalGuideline` (자체 작성) | **fail** | 검증되지 않은 의료 권고 |
 154: | `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
 155: | `MedicalDiagnosis`·`Quiz` | **fail** | 진단 단정 |
 156: | `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
 157: | `SpecialAnnouncement` | content-gate | 평상 휴진 미출력. 중대 공지만 별도 정책 |
 158: 
 159: > 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).
 160: 
 161: ### 2.3 Schema 분류 — Rich Results 실효성 vs Entity 의미 전달
 162: 
 163: Schema는 두 가지 가치를 갖는다. 솔루션은 양쪽을 의식적으로 분리해 적용한다.
 164: 
 165: **A. Rich Results 직접 효과 (검색 결과 시각적 노출)**:
 166: - `FAQPage` (Question/Answer) — FAQ 리치 결과
 167: - `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
 168: - `BreadcrumbList` — 빵부스러기 노출
 169: - `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
 170: - `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
 171: - `Person` / `Physician` — 의료진 카드 (제한적)
 172: 
 173: > `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
 174: 
 175: **B. Entity 의미 전달 (검색 엔진의 entity 그래프 구성)**:
 176: - `Organization` — 법인 identity
 177: - `MedicalClinic` 본원·지점 — 의료기관 entity
 178: - `Physician` — 의료진 entity (Rich Results는 제한적)
 179: - `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
 180: - `WebPage` — 페이지 entity
 181: - `WebSite` — 사이트 entity + SearchAction (Home에서만 풀)
 182: 
 183: > **운영 함의**: A 카테고리는 빌드 검증·콘텐츠 패턴 최적화 우선. B 카테고리는 검색 엔진 신뢰도·entity 그래프에 의미 전달. 의료 schema는 유효해도 Google Rich Results 혜택이 제한적이므로 **A 카테고리를 위주로 효율 추구, B 카테고리는 신뢰도 신호로 두는 전략**.
 184: 
 185: ### 2.4 Schema 출력 결정 — Allowed / Conditional / Blocked
 186: 
 187: 각 schema 타입에 대해 빌드 생성기가 결정 가능한 3단계 룰을 명시한다. 구현자가 "주의·신중·해당 시" 같은 모호한 표현으로 흔들리지 않도록.
 188: 
 189: | 결정 | 의미 |
 190: |---|---|
 191: | **Allowed** | 항상 출력 (해당 페이지 타입·계약 데이터 존재 시) |
 192: | **Conditional** | 조건 충족 시 출력 — 조건은 schema별 명시 |
 193: | **Blocked** | 출력 금지 — 빌드 시 검출하면 fail (§ 8) |
 194: 
 195: **Schema별 결정 (요약)**:
 196: 
 197: | Schema | 결정 | 조건/이유 |
 198: |---|---|---|
 199: | `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
 200: | `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
 201: | `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
 202: | `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
 203: | `MedicalCondition` 풀 엔티티 | Conditional | P-008 상세 페이지에서만 풀 |
 204: | `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
 205: | `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
 206: | `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
 207: | `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
 208: | `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
 209: | `Review` | **Blocked** | 의료광고법 (§ 8) |
 210: | `AggregateRating` | **Blocked** | 의료광고법 (§ 8) |
 211: | `Offer`·`DrugCost`·`MedicalCost` | **Blocked** | 의료 가격 광고 제한 |
 212: | `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |
 213: | `MedicalIndication` (단정형 schema) | **Blocked (fail)** | 효능 단정 위험. Schema 출력 금지. 본문 효능 표현은 별도 content-gate (compliance-assistant) |
 214: | `MedicalGuideline` | **Blocked** | 자체 작성 의료 권고 위반 소지 |
 215: | `HealthInsurancePlan` | **Blocked** | 보험 광고 제한 |
 216: | `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
 217: | `SpecialAnnouncement` | Conditional → 사실상 미출력 | 평상 휴진은 본문/메타. 중대 공지(예: 보건 위기 대응)만 별도 정책 |
 218: | `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
 219: | `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
 220: | `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
 221: 
 222: ### 2.5 공통 entity별 페이지 출력 정책 (단일 SoT)
 223: 
 224: > 페이지별 graph 구성(§ 3·§ 4)의 단일 진실 원본. 같은 정책이 다른 섹션에서 다르게 표현되면 본 표가 우선.
 225: 
 226: **용어 정의**:
 227: - **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
 228: - **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
 229: 
 230: | Entity | 정책 | 페이지 |
 231: |---|---|---|
 232: | `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
 233: | `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
 234: | `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
 235: | `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
 236: | `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
 237: | `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
 238: | `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
 239: | `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
 240: | `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
 241: 
 242: > § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.
 243: 
 244: ---
 245: 
 246: ## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)
 247: 
 248: 각 페이지 타입의 graph 구성 + 핵심 필드 + 매핑 출처.
 249: 
 250: ### P-001. Home
 251: 
 252: **Graph 구성**:
 253: 1. `Organization` (ClinicProfile)
 254: 2. `MedicalClinic` (LocationProfile main) — 본원
 255: 3. `WebSite` (SearchAction 포함)
 256: 4. `WebPage` (Home의 본문 entity)
 257: 
 258: **Organization 필드 매핑**:
 259: 
 260: | Schema 필드 | 출처 (ClinicProfile) |
 261: |---|---|
 262: | `@type` | `"Organization"` |
 263: | `@id` | `https://{domain}/#organization` |
 264: | `name` | `name` |
 265: | `alternateName` | `alternateName` |
 266: | `legalName` | `legalEntityName` |
 267: | `description` | `description` |
 268: | `slogan` | `slogan` |
 269: | `url` | `https://{domain}` |
 270: | `logo` | `logoUrl` → `ImageObject` |
 271: | `founder` | `founder` → `Person` |
 272: | `foundingDate` | `foundingDate` |
 273: | `award` | `awards[].name` |
 274: | `memberOf` | `memberOf[]` → `Organization`(학회) |
 275: | `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
 276: | `sameAs` | `socialMedia.*` 배열로 변환 |
 277: | `knowsAbout` | `medicalSpecialty[]` (보조) |
 278: | `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |
 279: 
 280: **MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
 281: 
 282: | Schema 필드 | 출처 (LocationProfile main) |
 283: |---|---|
 284: | `@type` | `"MedicalClinic"` |
 285: | `@id` | `https://{domain}/#clinic` |
 286: | `name` | `name` |
 287: | `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
 288: | `address` | `address` → `PostalAddress` |
 289: | `telephone` | `telephone` |
 290: | `email` | `email` |
 291: | `openingHoursSpecification` | `businessHours.openingHours[]` → `OpeningHoursSpecification[]` |
 292: | `geo` | `geo` → `GeoCoordinates` |
 293: | `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
 294: | `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
 295: 
 296: **WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
 297: 
 298: ```json
 299: {
 300:   "@type": "WebSite",
 301:   "@id": "https://{domain}/#website",
 302:   "url": "https://{domain}",
 303:   "name": "{ClinicProfile.name}",
 304:   "publisher": { "@id": "https://{domain}/#organization" },
 305:   "inLanguage": "ko-KR"
 306: }
 307: ```
 308: 
 309: **`potentialAction.SearchAction` 추가 조건 (Conditional)** — 사이트 내 검색 기능이 실제 구현되고 `/search` 라우트가 존재할 때만:
 310: 
 311: ```json
 312: "potentialAction": {
 313:   "@type": "SearchAction",
 314:   "target": "https://{domain}/search?q={search_term_string}",
 315:   "query-input": "required name=search_term_string"
 316: }
 317: ```
 318: 
 319: > PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchAction 미출력. 검색 기능 활성화 시 빌드 트리거.
 320: 
 321: **다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
 322: 
 323: **WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
 324: 
 325: **BreadcrumbList**: Home에는 미적용.
 326: 
 327: ---
 328: 
 329: ### P-002. About
 330: 
 331: **Graph 구성**:
 332: 1. `Organization` (법인 identity 풀필드)
 333: 2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
 334: 3. `BreadcrumbList`
 335: 4. `WebPage` (about page)
 336: 
 337: **Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
 338: 
 339: **mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
 340: - 외부 미디어 링크 (인터뷰·기고 URL)는 `sameAs` 배열 끝에 보조 추가 또는
 341: - 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
 342: - 단순 본문 콘텐츠 표시가 가장 안전
 343: 
 344: **BreadcrumbList**:
 345: ```json
 346: {
 347:   "@type": "BreadcrumbList",
 348:   "itemListElement": [
 349:     { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://{domain}/" },
 350:     { "@type": "ListItem", "position": 2, "name": "About", "item": "https://{domain}/about" }
 351:   ]
 352: }
 353: ```
 354: 
 355: ---
 356: 
 357: ### P-003. Doctors List
 358: 
 359: **Graph 구성**:
 360: 1. `Organization` — **[풀]**
 361: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 362: 3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
 363: 4. `BreadcrumbList` — **[풀]**
 364: 5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
 365: 
 366: ```json
 367: {
 368:   "@type": "ItemList",
 369:   "@id": "https://{domain}/doctors#itemlist",
 370:   "itemListElement": [
 371:     {
 372:       "@type": "ListItem",
 373:       "position": 1,
 374:       "item": {
 375:         "@type": "Physician",
 376:         "@id": "https://{domain}/doctors/hong#physician",
 377:         "name": "{DoctorProfile.name}",
 378:         "url": "https://{domain}/doctors/hong",
 379:         "image": "{DoctorProfile.photoUrl}",
 380:         "jobTitle": "{DoctorProfile.jobTitle}"
 381:       }
 382:     }
 383:   ]
 384: }
 385: ```
 386: 
 387: > 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
 388: 
 389: ---
 390: 
 391: ### P-004. Doctor Profile
 392: 
 393: **Graph 구성**:
 394: 1. `Organization` — **[풀]**
 395: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 396: 3. `Physician` (DoctorProfile 풀필드) — **[풀]**
 397: 4. `BreadcrumbList` — **[풀]**
 398: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 399: 
 400: **Physician 필드 매핑**:
 401: 
 402: | Schema 필드 | 출처 (DoctorProfile) |
 403: |---|---|
 404: | `@type` | `"Physician"` |
 405: | `@id` | `https://{domain}/doctors/{slug}#physician` |
 406: | `name` | `name` |
 407: | `alternateName` | `alternateName` |
 408: | `jobTitle` | `jobTitle` |
 409: | `description` | `briefBio` |
 410: | `image` | `photoUrl` → `ImageObject` |
 411: | `medicalSpecialty` | `medicalSpecialty[]` |
 412: | `hasCredential` | `credentials[]` → `EducationalOccupationalCredential` |
 413: | `alumniOf` | `education[]` → `EducationalOrganization` |
 414: | `worksFor` | `{"@id": "https://{domain}/#organization"}` |
 415: | `affiliation` | `affiliations[]` → `Organization` |
 416: | `memberOf` | `affiliations[]` (보조) |
 417: | `email` | `email` |
 418: | `sameAs` | `socialMedia.*` 배열 |
 419: 
 420: **Note**: `personalStory`·`philosophy`는 본문에 표시되지만 schema에는 비매핑 (의료 schema에 적절한 표현 없음 — `description`에 일부 흡수 가능).
 421: 
 422: ---
 423: 
 424: ### P-005. Treatments List
 425: 
 426: **Graph 구성**:
 427: 1. `Organization` — **[풀]**
 428: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
 429: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 430: 4. `BreadcrumbList` — **[풀]**
 431: 5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
 432: 
 433: ```json
 434: {
 435:   "@type": "ItemList",
 436:   "itemListElement": [
 437:     {
 438:       "@type": "ListItem",
 439:       "position": 1,
 440:       "item": {
 441:         "@type": "MedicalProcedure",
 442:         "@id": "https://{domain}/treatments/{slug}#procedure",
 443:         "name": "{TreatmentPage.name}",
 444:         "url": "https://{domain}/treatments/{slug}",
 445:         "description": "{TreatmentPage.summary}"
 446:       }
 447:     }
 448:   ]
 449: }
 450: ```
 451: 
 452: ---
 453: 
 454: ### P-006. Treatment Detail
 455: 
 456: **Graph 구성**:
 457: 1. `Organization` — **[풀]**
 458: 2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
 459: 3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**
 460: 4. `BreadcrumbList` — **[풀]**
 461: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 462: 6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
 463: 
 464: **MedicalProcedure 필드 매핑**:
 465: 
 466: | Schema 필드 | 출처 (TreatmentPage) |
 467: |---|---|
 468: | `@type` | `"MedicalProcedure"` |
 469: | `@id` | `https://{domain}/treatments/{slug}#procedure` |
 470: | `name` | `name` |
 471: | `alternateName` | `alternateName` |
 472: | `description` | `summary` (또는 `overview` 단축) |
 473: | `procedureType` | `category` (해당 시) |
 474: | `howPerformed` | `mechanism` (Markdown → 평문) |
 475: | `preparation` | `process[]` 중 사전 준비 단계 + 본 시술 전 단계 |
 476: | `followup` | `aftercare` + `maintenancePlan` (요약) |
 477: | `bodyLocation` | (해당 시 — 다이어트 한의원은 일반적으로 없음) |
 478: | `medicalSpecialty` | `medicalSpecialty` |
 479: | `citation` | `evidenceNotes[]` → `CreativeWork[]` 또는 단순 URL 배열 (`MedicalStudy`는 EvidenceNote 필드로 구성 부족하므로 사용 안 함) |
 480: 
 481: **주의**:
 482: - `targetAudience`·`recommendedFor` 필드는 schema.org에 직접 매핑 없음 → `description` 보조 또는 `audience` (broad)
 483: - `programVariants`는 schema 미매핑 — 본문 콘텐츠로만
 484: - 위험도 격상 조건이 적용된 슬롯은 schema 출력 자체에서 단정형 표현 회피
 485: 
 486: **FAQPage** (해당 시):
 487: 
 488: ```json
 489: {
 490:   "@type": "FAQPage",
 491:   "mainEntity": [
 492:     {
 493:       "@type": "Question",
 494:       "name": "{faq.question}",
 495:       "acceptedAnswer": {
 496:         "@type": "Answer",
 497:         "text": "{faq.answer (Markdown → 평문)}"
 498:       }
 499:     }
 500:   ]
 501: }
 502: ```
 503: 
 504: ---
 505: 
 506: ### P-007. Conditions List
 507: 
 508: **Graph 구성**:
 509: 1. `Organization` — **[풀]**
 510: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 511: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 512: 4. `BreadcrumbList` — **[풀]**
 513: 5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
 514: 
 515: ### P-008. Condition Detail
 516: 
 517: **Graph 구성**:
 518: 1. `Organization` — **[풀]**
 519: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 520: 3. `MedicalCondition` (풀필드) — **[풀]**
 521: 4. `BreadcrumbList` — **[풀]**
 522: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 523: 6. (FAQ) `FAQPage` — **[풀]** (Conditional)
 524: 
 525: **MedicalCondition 필드**:
 526: 
 527: | Schema 필드 | 출처 (MedicalConditionPage) |
 528: |---|---|
 529: | `@type` | `"MedicalCondition"` |
 530: | `@id` | `https://{domain}/conditions/{slug}#condition` |
 531: | `name` | `name` |
 532: | `description` | `definition` (+ `causes[]` 일부 일반론을 description 보조 텍스트로 흡수 가능) |
 533: | `signOrSymptom` | `symptoms[]` → `MedicalSignOrSymptom` |
 534: | `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |
 535: 
 536: > `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.
 537: 
 538: ### P-009. Articles List
 539: 
 540: **Graph 구성**:
 541: 1. `Organization` — **[풀]**
 542: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 543: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 544: 4. `BreadcrumbList` — **[풀]**
 545: 5. `ItemList` 또는 `Blog` — **[풀]**
 546: 
 547: `ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
 548: ```json
 549: {
 550:   "@type": "ItemList",
 551:   "itemListElement": [
 552:     {
 553:       "@type": "ListItem",
 554:       "position": 1,
 555:       "item": {
 556:         "@type": "Article",
 557:         "@id": "https://{domain}/insights/{cat}/{slug}#article",
 558:         "headline": "{Article.headline}",
 559:         "url": "https://{domain}/insights/{cat}/{slug}",
 560:         "image": "{Article.coverImageUrl}",
 561:         "datePublished": "{Article.datePublished}",
 562:         "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
 563:       }
 564:     }
 565:   ]
 566: }
 567: ```
 568: 
 569: `Blog` 사용 시 (콘텐츠 운영 명확 표시):
 570: ```json
 571: {
 572:   "@type": "Blog",
 573:   "@id": "https://{domain}/insights#blog",
 574:   "name": "{Articles List title}",
 575:   "publisher": { "@id": "https://{domain}/#organization" },
 576:   "blogPost": [
 577:     { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
 578:   ],
 579:   "inLanguage": "ko-KR"
 580: }
 581: ```
 582: 
 583: ### P-010. Article Detail
 584: 
 585: **Graph 구성** (entity별 [풀]/[참조+inline 최소]/[참조만] 표기):
 586: 1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
 587: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 588: 3. `Article` — **[풀]**
 589: 4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
 590: 5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
 591: 6. `BreadcrumbList` — **[풀]**
 592: 7. `WebPage` — **[풀]**, `isPartOf: #website`
 593: 8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
 594: 9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
 595: 
 596: **Article 필드 매핑**:
 597: 
 598: | Schema 필드 | 출처 (Article) |
 599: |---|---|
 600: | `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
 601: | `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
 602: | `headline` | `headline` |
 603: | `description` | `summary` |
 604: | `articleBody` | `body` (Markdown → 평문 권장, schema validator 호환) |
 605: | `articleSection` | ArticleCategory.name |
 606: | `datePublished` | `datePublished` |
 607: | `dateModified` | `dateModified` |
 608: | `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
 609: | `editor` | `reviewedBy` (해당 시) → Physician @id |
 610: | `publisher` | `{"@id": "https://{domain}/#organization"}` |
 611: | `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
 612: | `image` | `coverImageUrl`·`ogImageUrl` → `ImageObject` |
 613: | `wordCount` | `wordCount` |
 614: | `keywords` | `tags[]` (해당 시) |
 615: | `isAccessibleForFree` | `true` |
 616: | `inLanguage` | `"ko-KR"` |
 617: | `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
 618: | `citation` | `embeddedMedia[].url` 중 `type=citation`·`external-video` 항목 |
 619: 
 620: **VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
 621: 
 622: ```json
 623: {
 624:   "@type": "VideoObject",
 625:   "name": "{EmbeddedMedia.title 또는 Article.headline}",
 626:   "description": "{EmbeddedMedia.caption 또는 Article.summary}",
 627:   "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
 628:   "uploadDate": "{Article.datePublished}",
 629:   "contentUrl": "{EmbeddedMedia.url}",
 630:   "embedUrl": "{EmbeddedMedia.url}",
 631:   "duration": "PT{durationSeconds}S",
 632:   "transcript": "{EmbeddedMedia.transcriptUrl}",
 633:   "inLanguage": "ko-KR"
 634: }
 635: ```
 636: 
 637: **필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
 638: - `name`, `description`, `thumbnailUrl`, `uploadDate` (4개 모두 필수)
 639: - 그리고 `contentUrl` 또는 `embedUrl` **중 최소 1개**
 640: 
 641: **Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.
 642: 
 643: ### P-011. FAQ
 644: 
 645: **Graph 구성**:
 646: 1. `Organization` — **[풀]**
 647: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 648: 3. `FAQPage` (Question/Answer) — **[풀]**
 649: 4. `BreadcrumbList` — **[풀]**
 650: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 651: 
 652: **FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
 653: 
 654: ### P-012. Contact / Visit (Conversion Hub)
 655: 
 656: **Graph 구성**:
 657: 1. `Organization` — **[풀]**
 658: 2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
 659: 3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
 660: 4. `BreadcrumbList` — **[풀]**
 661: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 662: 6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
 663: 
 664: **다지점 처리**:
 665: 
 666: ```json
 667: {
 668:   "@graph": [
 669:     { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
 670:     { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
 671:     { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
 672:     { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
 673:     { "@type": "ItemList", "itemListElement": [...] }
 674:   ]
 675: }
 676: ```
 677: 
 678: **예약·상담 채널 표현** (`reservationChannels: CTAConfig[]`):
 679: 
 680: 각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
 681: 
 682: ```json
 683: "potentialAction": [
 684:   {
 685:     "@type": "ReserveAction",
 686:     "target": "https://booking.naver.com/...",
 687:     "name": "네이버 예약"
 688:   }
 689: ],
 690: "contactPoint": [
 691:   {
 692:     "@type": "ContactPoint",
 693:     "telephone": "+82-2-1234-5678",
 694:     "contactType": "reservation"
 695:   }
 696: ]
 697: ```
 698: 
 699: ### P-013. Legal / Policy
 700: 
 701: **Graph 구성**:
 702: 1. `Organization` — **[풀]**
 703: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 704: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 705: 4. `BreadcrumbList` — **[풀]**
 706: 
 707: **Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
 708: 
 709: ### P-014. Location / Branch Detail
 710: 
 711: **Graph 구성**:
 712: 1. `Organization` — **[풀]**
 713: 2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
 714:    - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
 715:    - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
 716: 3. `BreadcrumbList` — **[풀]**
 717: 4. `WebPage` — **[풀]**, `isPartOf: #website`
 718: 
 719: **MedicalClinic 필드 매핑 (지점 LocationProfile)**:
 720: 
 721: P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
 722: 
 723: | Schema 필드 | 출처 |
 724: |---|---|
 725: | `branchOf` | `{"@id": "https://{domain}/#organization"}` |
 726: | `parentOrganization` | 동일 |
 727: | `image` | `images[]` → `ImageObject[]` |
 728: 
 729: > 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
 730: 
 731: ---
 732: 
 733: ## 4. 페이지 타입별 Schema 매핑 (선택 7종 — 간략)
 734: 
 735: ### P-101. Reviews
 736: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
 737: **주의**: `Review`/`AggregateRating` 사용 **금지** (의료광고법 — § 8 참조). 후기 페이지는 schema 빈약하더라도 의도된 선택.
 738: 
 739: ### P-102. Pricing
 740: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
 741: **주의**: `Offer` schema **사용 안 함** (의료 가격 광고 제한). 본문 정보만 표시.
 742: 
 743: ### P-103. Facilities / Equipment
 744: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
 745: 
 746: ### P-104. News / Event
 747: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
 748: **주의**: 이벤트 카테고리는 `Offer`·할인 schema 안 함.
 749: 
 750: ### P-105. Reservation
 751: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
 752: `MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
 753: 
 754: ### P-106. Self-test / Quiz
 755: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
 756: 
 757: ---
 758: 
 759: ## 5. 데이터 계약 ↔ Schema 필드 매핑 (참조 인덱스)
 760: 
 761: | 데이터 계약 | 매핑 Schema | 비고 |
 762: |---|---|---|
 763: | C-01 `ClinicProfile` | `Organization` | 브랜드·법인 identity. 위치·시간·연락은 LocationProfile로 위임 |
 764: | C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
 765: | C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
 766: | C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
 767: | C-05 `RiskLevel` | (비매핑) | 운영 메타. 빌드 참조용. schema 출력 시 표현 신중성에만 영향 |
 768: | C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
 769: | C-07 `BrandTokens` | (비매핑) | UI 렌더링 |
 770: | C-08 `InstanceManifest` | (비매핑) | 빌드 메타 |
 771: | C-09 `FeatureModuleConfig` | (비매핑) | |
 772: | C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
 773: | C-11 `MedicalConditionPage` | `MedicalCondition` | |
 774: | C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
 775: | C-13 `ReviewPolicy` | (비매핑) | P-101 활성화 시 schema 정책 결정 |
 776: | C-14 `MedicalSpecialty` | enum 문자열로 매핑 (Schema.org `MedicalSpecialty` enum 값) | |
 777: | C-15 `SchemaInput` | **(인터페이스 — § 6에서 정식 정의)** | |
 778: | C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
 779: | C-17 `PricingPage` | (Schema 비사용) | `Offer` 부적합 |
 780: | C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
 781: | C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
 782: | C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
 783: | C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
 784: | C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
 785: 
 786: | 공통 타입 (CT) | 매핑 Schema |
 787: |---|---|
 788: | CT-01 `TrustMetric` | (비매핑) — 본문 콘텐츠로만. schema는 사실 안내형 description 보조 |
 789: | CT-02 `BusinessHours` | `OpeningHoursSpecification[]` (receptionHours·lunchBreaks·specialClosures는 별도 매핑 룰 — 아래) |
 790: | CT-03 `CTAConfig` | `ContactPoint` / `potentialAction` (ReserveAction·CommunicateAction) |
 791: 
 792: ### 5.1 BusinessHours 매핑 상세
 793: 
 794: | BusinessHours 필드 | Schema 출력 | 결정 |
 795: |---|---|---|
 796: | `openingHours[]` | `OpeningHoursSpecification[]` (dayOfWeek·opens·closes) | Allowed |
 797: | `receptionHours[]` | `OpeningHoursSpecification[]` (별도 항목, `description: "접수 시간"` 보조) — Schema.org 직접 매핑 부재 | Conditional (출력 시 description 명시) |
 798: | `lunchBreaks[]` | 본문·메타 표시 우선. schema는 `description` 보조만 | Conditional → 사실상 미출력 |
 799: | `specialClosures[]` | **schema 기본 미출력**. 중대 공지(보건 위기 등)만 `SpecialAnnouncement` 별도 정책. 평상 휴진은 본문/메타/Google Business Profile 활용 | Blocked (default) → 별도 정책 시만 Conditional |
 800: | `holidayPolicy` | `description` 보조 | Conditional |
 801: 
 802: #### dayOfWeek enum 변환표 (내부 ↔ Schema.org)
 803: 
 804: | 내부 (BusinessHours) | Schema.org `DayOfWeek` 표준 값 |
 805: |---|---|
 806: | `Mon` | `https://schema.org/Monday` 또는 `Monday` |
 807: | `Tue` | `https://schema.org/Tuesday` |
 808: | `Wed` | `https://schema.org/Wednesday` |
 809: | `Thu` | `https://schema.org/Thursday` |
 810: | `Fri` | `https://schema.org/Friday` |
 811: | `Sat` | `https://schema.org/Saturday` |
 812: | `Sun` | `https://schema.org/Sunday` |
 813: | `PublicHoliday` | `https://schema.org/PublicHolidays` |
 814: 
 815: > 빌드 생성기는 OpeningHoursSpecification 출력 시 내부 enum을 Schema.org 표준 값으로 자동 변환.
 816: 
 817: ### 5.2 CTAConfig 매핑 상세
 818: 
 819: | CTAConfig.type | Schema 표현 |
 820: |---|---|
 821: | `phone` | `ContactPoint{contactType: "reservation"·"customer service", telephone}` |
 822: | `naver-reservation` | `ReserveAction{target: targetUrl, name: "네이버 예약"}` |
 823: | `naver-talk`·`kakao-talk`·`kakao-channel` | `ContactPoint{contactType: "customer service", url}` 또는 `CommunicateAction` |
 824: | `form` | (schema 미적용 — 본문 폼) |
 825: | `map` | `MedicalClinic.hasMap`: targetUrl |
 826: | `external` | `potentialAction` 일반 또는 schema 미적용 |
 827: | `sms`·`email` | `ContactPoint` |
 828: | `video-consultation` | `ReserveAction` 또는 `CommunicateAction` |
 829: 
 830: ---
 831: 
 832: ## 6. SchemaInput 인터페이스 (C-15 정식 정의)
 833: 
 834: `SchemaInput`은 페이지 빌드 시 schema 생성기에 입력되는 정규화된 데이터 묶음. 페이지 타입별로 다른 형태이지만 공통 부분 존재.
 835: 
 836: ### 6.1 공통 SchemaInput
 837: 
 838: ```ts
 839: type SchemaInput = {
 840:   pageType: PageType;         // P-001 ~ P-014, P-101 ~ P-106
 841:   pageMeta: PageMeta;          // C-06
 842:   canonicalUrl: URL;
 843:   inLanguage: string;          // 기본 "ko-KR"
 844:   clinic: ClinicProfile;       // C-01 — 전 페이지 공통
 845:   mainLocation: LocationProfile;  // C-21 main — 전 페이지 공통 (Organization 외 본원 entity)
 846:   allLocations: LocationProfile[]; // 다지점 시. P-012·P-014 등에서 사용
 847:   breadcrumbItems: BreadcrumbItem[]; // (Home 제외) BreadcrumbList 생성용
 848: };
 849: 
 850: type BreadcrumbItem = {
 851:   position: number;
 852:   name: string;
 853:   url: URL;
 854: };
 855: ```
 856: 
 857: ### 6.2 페이지 타입별 추가 입력
 858: 
 859: | 페이지 타입 | 추가 입력 필드 |
 860: |---|---|
 861: | P-004 Doctor Profile | `doctor: DoctorProfile` |
 862: | P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
 863: | P-008 Condition Detail | `condition: MedicalConditionPage`, `relatedTreatments: TreatmentPage[]`, `faqs: FAQ[]` |
 864: | P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
 865: | P-011 FAQ | `faqs: FAQ[]` |
 866: | P-014 Location Detail | `location: LocationProfile`, `doctorsAtLocation: DoctorProfile[]`, `treatmentsAvailable: TreatmentPage[]` |
 867: | List 페이지 (P-003·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |
 868: 
 869: ### 6.3 Schema 생성기 출력
 870: 
 871: `SchemaGenerator.generate(input: SchemaInput): JsonLdGraph`
 872: 
 873: ```ts
 874: type JsonLdGraph = {
 875:   "@context": "https://schema.org";
 876:   "@graph": SchemaEntity[];
 877: };
 878: ```
 879: 
 880: 생성기는 페이지 타입별 § 3·§ 4의 graph 구성 표준에 따라 entity 배열을 출력.
 881: 
 882: ---
 883: 
 884: ## 7. 빌드 시 검증
 885: 
 886: ### 7.1 필수 필드 검증
 887: 
 888: | 페이지 타입 | 필수 entity / 필드 |
 889: |---|---|
 890: | **공통 일반 룰 (§ 2.5 정합)** | **§ 2.5에서 "풀"로 지정된 entity는 해당 페이지 graph에 풀필드 출력 필수**. 누락 시 빌드 실패. **선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증** (`FeatureModuleConfig`·`InstanceManifest`·라우트 설정 기준 — P-103·P-104·P-105는 Instance 결정, P-106은 Feature Module 기반 등 활성화 경로가 페이지별로 다를 수 있음) |
 891: | 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **resolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |
 892: | Home 제외 | `BreadcrumbList` |
 893: | P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
 894: | P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
 895: | P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
 896: | P-008 | `MedicalCondition` + `name`·`description` |
 897: | P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
 898: | P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
 899: 
 900: 누락 시 **빌드 실패**.
 901: 
 902: ### 7.2 빌드 게이트 vs 운영 모니터링 분리
 903: 
 904: | 검증 단계 | 도구 | 실패 시 |
 905: |---|---|---|
 906: | **빌드 게이트 (CI)** | 자체 JSON schema validator + 본 문서 룰 checker (필수 필드·금지 schema·Conditional 조건) | **빌드 실패** |
 907: | **빌드 게이트 (Sanity)** | JSON-LD 파싱 가능 여부·@id uniqueness·@context 유효성 | 빌드 실패 |
 908: | **운영 모니터링 (수동·정기)** | schema.org official validator, Google Rich Results Test, 자체 대시보드 | 경고·이슈 트래커 |
 909: 
 910: > 공식 validator는 안정적 CLI가 없어 CI 빌드 게이트로 부적합. 빌드 게이트는 자체 룰 checker로 결정 가능한 항목만, 외부 validator는 모니터링·수동 QA 단계로 분리.
 911: 
 912: ### 7.3 룰 레벨 분류 (§ 8 금지·주의 schema 처리)
 913: 
 914: | 레벨 | 정의 | 조치 |
 915: |---|---|---|
 916: | **fail** | 출력 시 빌드 실패 | Review·AggregateRating·Offer·**MedicalRiskFactor**·MedicalGuideline·HealthInsurancePlan·MedicalDiagnosis 등 — § 8 표 참조 |
 917: | **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
 918: | **content-gate** | schema는 통과되지만 본문 표현 위험. compliance-assistant·운영자 검수가 결정 | 본문 내 효과 단정·위험요인 설명·TreatmentPage.evidenceNotes 본문 인용·MedicalRiskFactor 본문 언급 등 |
 919: 
 920: ---
 921: 
 922: ## 8. 금지·주의 Schema (룰 레벨 명시)
 923: 
 924: | Schema | 룰 레벨 | 이유 |
 925: |---|---|---|
 926: | `Review` (의료 후기) | **fail** | 의료광고법 제56조·제57조 위반 소지. P-101 활성화 시에도 schema는 미출력 |
 927: | `AggregateRating` (의료기관 평점) | **fail** | 동일 |
 928: | `Offer` (의료 시술·진료 가격) | **fail** | 가격 광고 제한 |
 929: | `DrugCost`·`MedicalCost` | **fail** | 동일 |
 930: | `MedicalGuideline` (자체 작성) | **fail** | 검증되지 않은 의료 권고는 위반 소지 |
 931: | `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
 932: | `MedicalDiagnosis` | **fail** | 진단 단정 |
 933: | `MedicalRiskFactor`·`MedicalRiskEstimator` (schema) | **fail** | Schema 출력은 금지. 본문에서 원인·위험요인 표현은 별도 content-gate (compliance-assistant 검수) — schema 룰과 본문 룰 분리 |
 934: | `MedicalIndication` (단정형 schema) | **fail** | Schema 출력 금지. 본문 효능 표현은 별도 content-gate |
 935: | `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
 936: | `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
 937: | `SpecialAnnouncement` | **content-gate** | 평상 휴진 미출력. 중대 공지만 별도 정책 |
 938: 
 939: > 컴플라이언스 정책의 세부 조건과 표현 가이드는 `compliance/RISK_LEVELS.md` 후속 문서에서 확장. 본 문서는 schema 출력 결정의 룰 레벨만 명시.
 940: 
 941: ---
 942: 
 943: ## 9. 미결정 사항
 944: 
 945: | ID | 항목 | 비고 |
 946: |---|---|---|
 947: | SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
 948: | SM-02 | `MedicalSpecialty` enum 매핑 — Schema.org 표준값과 한국 한의·진료과 명칭 매핑 표 | C-14 풀명세 시 |
 949: | SM-03 | `BusinessHours.receptionHours`·`lunchBreaks`·`specialClosures` schema 출력 포맷 세부 확정 — § 5.1 정책은 정의됨(receptionHours 보조 OpeningHoursSpecification, lunchBreaks 미출력, specialClosures 기본 미출력). 남은 결정은 receptionHours의 `description` 텍스트 형식·자동 변환 룰 | 빌드 구현 단계에서 확정 |
 950: | SM-04 | `TrustMetric` schema 매핑 — `Statistic`·`QuantitativeValue` 적용 가능성 | 후속 검토 |
 951: | SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
 952: | SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
 953: | SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
 954: | SM-08 | Article의 `contentSource: republished` 시 `isBasedOn` vs `citation` 사용 정책 | 후속 결정 |
 955: 
 956: ---
 957: 
 958: ## 10. 변경 이력
 959: 
 960: | 일자 | 버전 | 변경 |
 961: |---|---|---|
 962: | 2026-05-14 | v0.1 | 최초 작성 — 통합 graph 표준, M0 필수 14종 풀 graph 매핑, 선택 7종 간략 매핑, 데이터 계약↔schema 필드 매핑 인덱스, SchemaInput 정식 정의 (C-15), 빌드 검증, 금지·주의 schema 8종 |
 963: | 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
 964: | 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
 965: | 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
 966: | 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
 967: | 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
 968: | 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
 969: | 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
 970: | 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
 971: | 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
 972: | 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 표에 룰 레벨 열 추가** — § 8 상세표와 일치하는 요약. § 8 이동 없이 한눈에 파악 가능, (2) **v0.10 → v1.0 격상** — 사용자 메타-피드백 "다음 안정판을 v1.0으로" 채택. 핵심 정책·표 정합·룰 일관성 완성. 다음 단계는 SchemaGenerator/rule checker 실제 구현 + 그 과정의 발견 사항을 문서에 되먹이기 |

codex
초기 대조에서 이미 PAGE_TYPES와 계획의 M0 페이지 선택, robots 정책 쪽에 큰 충돌 후보가 보입니다. 나머지 데이터 모델/토큰/어드민 URL/마이그레이션 실체를 확인해 blocking 여부를 확정하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/CONTENT_STANDARDS.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DESIGN_TOKENS.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/admin/ARCHITECTURE.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 1109ms:
   1: # Core — 콘텐츠 작성 표준 (AEO·AI 스니펫·의료광고 표현)
   2: 
   3: > **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
   4: > **작성일**: 2026-05-14
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
   7: > **목적**: Core가 생성·관리하는 콘텐츠의 작성 표준. AEO·AI 스니펫 친화 구조, 콘텐츠 블록 표준, 의료광고법 표현 가이드(금지·대체), 페이지 타입·ArticleType별 룰, compliance-assistant 인터페이스, 빌드 검증을 단독 구현 가능한 명세로 정의.
   8: > **외부 공유 시 주의**: 상위 문서와 동일. 표현 리스크 어휘 회피.
   9: > **연관 문서**:
  10: > - 페이지 타입 정의 → `core/PAGE_TYPES.md`
  11: > - 데이터 계약 → `core/DATA_MODEL.md`
  12: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
  13: > - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
  14: > - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
  15: > - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
  16: 
  17: ---
  18: 
  19: ## 0. 한 페이지 요약
  20: 
  21: - **콘텐츠 작성 표준 = 5개 영역**: 일반 규약(톤·문체) / AEO·AI 스니펫 친화 구조 / 콘텐츠 블록 표준 / 의료광고 표현 / 페이지·ArticleType별 룰.
  22: - **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
  23: - **빌드 검증**: 자체 룰 checker가 본 문서의 fail/warning/content-gate 룰을 적용. 외부 LLM 검수(compliance-assistant)는 별도.
  24: - **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
  25: - 페이지 타입별 콘텐츠 슬롯·필수 블록은 `PAGE_TYPES.md`가 정의, 본 문서는 **각 슬롯에 들어가는 콘텐츠의 표현·구조 표준**을 다룬다.
  26: 
  27: ---
  28: 
  29: ## 1. 일반 규약
  30: 
  31: ### 1.1 톤·문체
  32: 
  33: | 항목 | 표준 |
  34: |---|---|
  35: | 어조 | 정중·전문적·차분. 마케팅 과장형 X |
  36: | 인칭 | 의료기관 = "저희"/"본원" / 환자 = "환자분"·"내원자" (3인칭은 신중) |
  37: | 종결 | 평어체 금지. "-습니다·-입니다" 일관 |
  38: | 감정 어휘 | 자제 ("기적·놀라운·혁신적" 등 X) |
  39: | 의문문 | H2 헤딩으로만 사용 (AEO 친화), 본문에 빈번한 의문문 자제 |
  40: | 영문 | 의료 전문 용어 영문 병기는 첫 등장 시 1회 (예: "비만(obesity)") |
  41: 
  42: ### 1.2 언어
  43: 
  44: - 기본 `ko-KR` (SEARCH_STANDARDIZATION § 2.1 정합)
  45: - 영문·중문 등 다국어는 `InternationalSupport.internationalLanguagePages[]` 활성화 시. 본 표준은 한국어 기준
  46: 
  47: ### 1.3 콘텐츠 길이
  48: 
  49: | 페이지·블록 | 권장 길이 |
  50: |---|---|
  51: | PageMeta.description | 80~160자 (SEARCH_STANDARDIZATION § 2.1 정합) |
  52: | PageMeta.title | 10~70자 |
  53: | Article.headline | 1~120자 |
  54: | Article.summary | 80~200자 |
  55: | Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
  56: | TreatmentPage.summary | 50~160자 |
  57: | FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
  58: 
  59: ### 1.4 변경 정책
  60: 
  61: - 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
  62: - 표현 룰 강화 (기존 콘텐츠 위반 가능): **MAJOR** (마이그레이션 가이드 필수)
  63: - 페이지 타입별 룰 신설: MINOR
  64: - 새 ArticleType 추가: MINOR
  65: 
  66: ---
  67: 
  68: ## 2. AEO·AI 스니펫 친화 구조
  69: 
  70: 네이버 AI 사이트 브리핑·AI 스니펫·통합 랭킹 모델 시대의 핵심 — **답변 우선 배치 + 구조화 블록**.
  71: 
  72: ### 2.1 답변 우선 배치 (Answer-First)
  73: 
  74: | 룰 | 레벨 | 적용 |
  75: |---|---|---|
  76: | 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
  77: | 페이지의 본질 질문 1개를 H1 또는 H2가 명시적으로 답변 | warning | P-006·P-008·P-010 |
  78: | H2를 질문형으로 작성 (AEO 친화) | 권장 (silent) | P-010 Article, P-006/P-008 일부 섹션 |
  79: 
  80: **예시 (P-006 Treatment Detail 본문 시작)**:
  81: 
  82: ```
  83: [좋음]
  84: 한방 다이어트는 한약·약침·식이 상담을 결합한 4~12주의 비만 관리 프로그램입니다.
  85: 체질에 맞춘 한약 처방, 지방대사 약침, 1:1 식이 상담으로 구성되며, 평균 4주 단위로 진행 결과를 점검합니다.
  86: 
  87: [나쁨 — answer-first 위반]
  88: 다이어트는 누구에게나 어려운 과제입니다. 매년 새해마다 결심하지만 실패하는 경우가 많습니다. 그래서 본원은…
  89: (답변이 한참 뒤로 밀림)
  90: ```
  91: 
  92: #### 2.1.1 answer-first 검사 대상 (Markdown AST)
  93: 
  94: 빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:
  95: 
  96: 1. Frontmatter 영역 제외 (YAML/TOML 헤더)
  97: 2. 페이지의 `<main>` 또는 첫 H1 노드 이후 영역만 대상
  98: 3. 다음 노드 종류는 **스킵** (메타·구조 노드):
  99:    - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
 100: 4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
 101: 5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
 102: 6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
 103: 
 104: > Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).
 105: 
 106: ### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)
 107: 
 108: - **H1 페이지당 1개**. 페이지 주제 명시
 109: - H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
 110: - H3은 H2 하위 세부 단위
 111: - H4 이하 자제 (AI 스니펫 추출 난이도 ↑)
 112: 
 113: | 룰 | 레벨 |
 114: |---|---|
 115: | H1 누락 또는 2개 이상 | fail |
 116: | H2 위계 건너뜀 (H1 → H3) | warning |
 117: | H4 이하 5회 초과 사용 | warning |
 118: 
 119: ### 2.3 구조화 블록 의도적 혼합
 120: 
 121: 본문에 다음을 의도적으로 섞어 배치하면 AI 스니펫 채택률 ↑:
 122: 
 123: | 블록 종류 | 형식 | AI 스니펫 추출 친화 |
 124: |---|---|---|
 125: | 문단형 답변 (1~2문장) | 일반 텍스트, H2 직후 | 문장형 스니펫 |
 126: | 불릿 리스트 | `<ul><li>` 3~10개 | 리스트형 스니펫 |
 127: | 번호 리스트 (단계·순서) | `<ol><li>` 3~10개 | 단계형 스니펫 |
 128: | 표 (비교·항목) | `<table>` 2~5컬럼 | 표형 스니펫 |
 129: | Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
 130: | 인용·근거 | `<blockquote>` + 출처 | 신뢰도 신호 |
 131: 
 132: | 룰 | 레벨 |
 133: |---|---|
 134: | P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
 135: | 리스트 항목이 2개 이하인 `<ul>`/`<ol>` | warning (리스트 효과 약함) |
 136: | 표가 1행만 있는 경우 | warning |
 137: 
 138: ---
 139: 
 140: ## 3. 콘텐츠 블록 표준
 141: 
 142: ### 3.1 Q&A 블록
 143: 
 144: **구조**:
 145: ```markdown
 146: **질문(Q)**: 한방 다이어트는 며칠 만에 효과가 나타나나요?
 147: 
 148: 답변: 한방 다이어트의 효과 인지 시점은 개인의 체질·생활 습관·복약 순응도에 따라 다르며, 일반적으로 4주 단위로 변화를 점검합니다.
 149: 세부적으로는 한약 복용 1~2주차에 식욕 변화·소화 패턴 변화를, 4주차부터 체성분 변화 추세를 관찰합니다.
 150: ```
 151: 
 152: **책임 분리**:
 153: - 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
 154: - JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
 155: 
 156: | 룰 | 레벨 |
 157: |---|---|
 158: | Q&A 블록의 질문이 의문문 아닌 경우 | warning |
 159: | 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
 160: | 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
 161: | 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |
 162: 
 163: ### 3.2 리스트 (불릿·번호)
 164: 
 165: **용도별 선택**:
 166: - 순서·인과 관계가 있으면 번호 리스트 (`<ol>`)
 167: - 동등 항목 나열이면 불릿 리스트 (`<ul>`)
 168: 
 169: **룰**:
 170: - 항목 길이 일관 (한 항목이 5줄 넘으면 별도 단락으로 분리 검토)
 171: - 항목 시작 어휘 일관 (모두 명사형 또는 모두 동사형)
 172: 
 173: ### 3.3 표 (Table)
 174: 
 175: **구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.
 176: 
 177: **용도**:
 178: - 비교 (시술별·프로그램별 차이)
 179: - 수치·범위 (소요 시간·횟수)
 180: - 시간표 (진료시간·휴진 안내)
 181: 
 182: **위험도 주의**:
 183: - 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
 184: - 가격 비교표는 **High 위험** (§ 4 + P-102 정책)
 185: 
 186: ### 3.4 콜아웃 (Callout / Note)
 187: 
 188: **종류**:
 189: - `info` — 일반 안내 (Low 위험)
 190: - `warning` — 주의사항 (Medium 권장)
 191: - `disclaimer` — 의료 면책 (의료 정보 페이지에 권장)
 192: 
 193: **예시**:
 194: ```
 195: ⚠️ 본 페이지의 의료 정보는 일반적인 안내이며, 개별 환자의 진료를 대체하지 않습니다. 정확한 진단·치료는 의료진과 상담하세요.
 196: ```
 197: 
 198: ### 3.5 인용·근거 (Citation)
 199: 
 200: 논문·학회·공식 자료 인용 시:
 201: - 인용 출처 명시 (학회지·발행연도·저자)
 202: - 외부 URL은 가능한 경우 첨부
 203: - `Article.embeddedMedia[type: citation]` 또는 본문 `<blockquote>` + 출처
 204: 
 205: **룰**:
 206: - "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
 207: - 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
 208:   - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
 209:   - `<blockquote>` + 출처 텍스트 (학회·정부·논문명 패턴)
 210:   - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
 211:   - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
 212: - 위 판정 텍스트 + 인용 부재 → content-gate
 213: - 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화
 214: 
 215: ### 3.6 임베디드 미디어 (VideoObject 등)
 216: 
 217: - YouTube·Vimeo·외부 동영상 임베드
 218: - `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
 219: - VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
 220: 
 221: ---
 222: 
 223: ## 4. 의료광고 표현 — 단일 SoT
 224: 
 225: 본 문서의 **진실의 원본**. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
 226: 
 227: ### 4.1 금지 표현 (fail / content-gate)
 228: 
 229: | 카테고리 | 금지 표현 (예시) | 레벨 |
 230: |---|---|---|
 231: | **최상급** | "최고의·최저가·최대·최강·1위·국내 유일·세계 최초·세계 최고" | **fail** (콘텐츠 발행 차단) |
 232: | **효과 단정** | "완치·100% 효과·반드시 효과·안전합니다·부작용 없음" | **fail** |
 233: | **수치·기간 단정 (보장어 없음)** | "○○일 만에·○○주 만에·체중 ○○kg 감량 (수치·기간 단정, '보장'·'약속'·'반드시' 어휘 미포함)" | **content-gate** (의료진·법무 검수 필요) |
 234: | **수치·기간 보장** | "○○kg 보장·○○일 안에 보장·○○주 약속" — 수치/기간 + 보장어 결합 | **fail** (보장 표현 통합 룰) |
 235: | **비교 표현** | "타 병원보다·다른 의원보다·기존 ○○보다 우수" | **fail** |
 236: | **유인성 표현** | "지금만·특가·한정·기간 한정·선착순·오늘까지" (시간·수량 압박형 환자 유인) | **fail** |
 237: | **할인·이벤트 사실 안내** | "20% 할인 진행·○월 이벤트" (시간·수량 압박어 미포함, 사실 진술) | **content-gate** (의료광고법 환자 유인 해당 여부 법무 판정 필요. P-104·P-102에서만 허용) |
 238: | **진단 단정** | "당신은 ○○병입니다·○○질환 확정" (자가 진단 유도 포함) | **fail** |
 239: | **명의·권위 단정** | "최고의 명의·국내 1인자·전국 최다" | **fail** |
 240: | **전문성 단정 (단독 어휘)** | "절대·반드시·확실히·100%" (효과·결과·보장 등 결과어와 결합되지 않은 단독 사용) | **content-gate** |
 241: | **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
 242: | **유명인 동원** | (의료법상 환자 유인) "○○○ 연예인이 받은" | **fail** |
 243: | **보장 표현** | "효과 보장·결과 보장·만족 보장·재시술 무료" | **fail** |
 244: | **체질·맞춤 과대 표현** | "당신만의 1:1 맞춤·당신의 체질에 완벽" | **content-gate** (한의 특유 표현 회색지대) |
 245: 
 246: > 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.
 247: 
 248: ### 4.2 대체 표현
 249: 
 250: | 금지 표현 | 대체 표현 |
 251: |---|---|
 252: | "최고의 다이어트 한약" | "체질 기반 다이어트 한약 처방" |
 253: | "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
 254: | "4주 만에 -10kg 보장" | "4주 단위로 진행 결과를 점검합니다. 변화 정도는 개인에 따라 다릅니다" |
 255: | "타 병원보다 효과적" | (비교 자체 미사용) "본원의 진료 방식은 ○○입니다" |
 256: | "지금 신청하시면 50% 할인" | (할인 미명시) "예약 안내는 ○○로 연락 바랍니다" |
 257: | "유명인 ○○도 받은 시술" | (유명인 미언급) "본원 시술 사례는 ○○ 페이지에서 확인 가능합니다" — 단 후기·전후사진은 별도 ReviewPolicy 적용 |
 258: | "효과 보장" | "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" |
 259: 
 260: ### 4.3 후기·전후사진·가격 노출 — 별도 정책
 261: 
 262: | 요소 | 출처 | 표현 정책 |
 263: |---|---|---|
 264: | 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
 265: | 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
 266: | 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
 267: | 의료진 자격·논문 | DoctorProfile (C-02) | 검증 가능 사실만. "최고의 명의" 등 단정 금지 |
 268: | 누적 통계 (TrustMetric) | ClinicProfile.trustMetrics | 기준 기간·범위·증빙 동반 (DATA_MODEL CT-01). "국내 1위·최대" 등 단정 금지 |
 269: 
 270: ### 4.4 문맥 예외 카탈로그 (false-positive 방지)
 271: 
 272: 다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.
 273: 
 274: | 문맥 종류 | 인식 패턴 (예시) | 예외 대상 룰 | 의미 |
 275: |---|---|---|---|
 276: | **safety** (의료 안전 권유) | "(반드시\|꼭) (의료진과 )?(상담\|확인)하세요", "복용 전 (반드시 )?확인" | "전문성 단정 (단독 어휘)" | 안전 권유 표현은 의료광고 위반 아님 |
 277: | **warning-message** (주의·금기 안내) | "(절대 )?금기", "(주의\|경고)\\s*[:：]", "복용 금지", "사용 금지" | "전문성 단정 (단독 어휘)" | 안전 정보 안내 |
 278: | **administrative** (행정·약관) | "100%\\s*(환불 불가\|환불 보증\|예약 변경 불가)" 등 법적·약관 표현 | "전문성 단정 (단독 어휘)", "보장 표현" (행정 한정) | 약관·환불·결제 안내 |
 279: 
 280: > **운영 정책**: 본 표는 v0.4 최초 — 운영 누적으로 사례 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 풍부화.
 281: 
 282: ---
 283: 
 284: ## 5. 페이지 타입별 콘텐츠 룰
 285: 
 286: ### 5.1 P-002 About — 정체성·신뢰도
 287: 
 288: - 의료기관 정식 명칭·설립일·연혁·인증 사실 기반
 289: - "최고의·1위" 등 단정 금지
 290: - 인증·수상은 검증 가능 출처 첨부 (Award.verificationUrl)
 291: - 사회공헌·후원은 사실 안내
 292: 
 293: ### 5.2 P-004 Doctor Profile
 294: 
 295: - 자격·학회·논문은 검증 가능 사실
 296: - "명의·1인자" 등 단정 금지
 297: - 개인 스토리 (`personalStory`)에 효과 단정 금지 (의료진 본인 스토리도 후기 위험도와 유사)
 298: 
 299: ### 5.3 P-006 Treatment Detail — 가장 위험도 높음
 300: 
 301: - 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
 302: - 효과·기간·수치 단정 금지
 303: - 후기·전후사진 포함 시 페이지 자동 High (`ReviewPolicy` 적용)
 304: - 가격·이벤트 포함 시 자동 High
 305: - 의료진 검토 필수
 306: 
 307: ### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)
 308: 
 309: ### 5.5 P-011 FAQ — 답변 단위 위험도
 310: 
 311: - 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
 312: - 효과·결과 관련 답변 → High → content-gate
 313: 
 314: ### 5.6 P-101 Reviews — High-risk commercial
 315: 
 316: - 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
 317: - 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
 318: - 전후사진은 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed=true` + 법무 승인 기록 시에만 예외 발행
 319: 
 320: ### 5.7 P-102 Pricing — High-risk commercial
 321: 
 322: - § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
 323: - "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
 324: - 비급여 명시 필수
 325: - 가격 변경 시 즉시 갱신
 326: 
 327: ### 5.8 P-104 News/Event — 이벤트 카테고리만 High
 328: 
 329: - 일반 소식(휴진·이전·인사) Low
 330: - 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수
 331: 
 332: ---
 333: 
 334: ## 6. ArticleType별 콘텐츠 룰 (P-010)
 335: 
 336: `Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:
 337: 
 338: RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
 339: 
 340: | ArticleType | 기본 위험도 | 콘텐츠 룰 |
 341: |---|:---:|---|
 342: | `notice` | Low | 휴진·이전·인사 — 사실 안내 |
 343: | `general-medical-info` | Medium | 일반 의학 정보 — 진단·치료 단정 금지. 일반론 한정. **medical disclaimer 권장** |
 344: | `treatment-explainer` | Medium | 특정 시술 설명 — 효과 단정 금지. 절차·원리·대상·주의사항 위주 |
 345: | `condition-explainer` | Medium | 특정 질환 설명 — 진단 단정·자가 진단 유도 금지 |
 346: | `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
 347: | `review-case` | **High** | 환자 치료경험담 — 의료법 제56조 광고 금지 적용. 매체·방식별 법무 판정 필요 (§ 4.3·§ 5.6 정합). ReviewPolicy(C-13) 적용 |
 348: | `event-price` | **High** | 이벤트·할인·가격 안내 — 의료광고법 환자 유인 금지 적용. § 5.7·§ 5.8 정합 |
 349: 
 350: ### 6.1 ArticleType 자동 분류·검수
 351: 
 352: - 어드민에서 운영자가 직접 분류 (M0)
 353: - compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
 354: - `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)
 355: 
 356: ---
 357: 
 358: ## 7. compliance-assistant Feature Module 인터페이스
 359: 
 360: 본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.
 361: 
 362: ### 7.1 입력
 363: 
 364: ```ts
 365: type ComplianceCheckInput = {
 366:   contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
 367:   featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
 368:   contentRef: string;                 // 대상 콘텐츠 @id
 369:   body: Markdown;
 370:   metadata: {
 371:     pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
 372:     articleType?: ArticleType;        // DATA_MODEL C-04
 373:     pageMeta?: PageMeta;              // DATA_MODEL C-06
 374:     explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
 375:     inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
 376:   };
 377:   riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
 378: };
 379: 
 380: // 둘 중 정확히 하나만 사용:
 381: // - Core 콘텐츠: contentType 사용, featureContentType 미지정
 382: // - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
 383: ```
 384: 
 385: #### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
 386: 
 387: DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
 388: 
 389: ```ts
 390: type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
 391: type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
 392: ```
 393: 
 394: | 영역 | contentType 값 | featureContentType 값 | 예시 |
 395: |---|---|---|---|
 396: | Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
 397: | Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
 398: 
 399: > P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.
 400: 
 401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
 402: 
 403: LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
 404: 
 405: | 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
 406: |---|---|---|
 407: | answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
 408: | 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
 409: | RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
 410: | RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |
 411: 
 412: **변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
 413: 
 414: **ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
 415: 
 416: #### 7.1.2 High → gateRequired 변환 규칙
 417: 
 418: `metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:
 419: 
 420: ```ts
 421: {
 422:   ruleId: "risk-level-high-gate",
 423:   category: "위험도 강제 검수",
 424:   pattern: "(RiskLevel=High)",
 425:   severity: "content-gate",
 426:   location: { start: 0, end: 0 },   // 콘텐츠 전체 — 의미상 메타
 427:   requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
 428: }
 429: ```
 430: 
 431: **트리거 조건**: `metadata.inferredRiskLevel === "High"` 또는 `metadata.explicitRiskLevel === "High"` (둘 중 하나라도 High이면 주입). 트리거 출처는 finding 메타에 기록(예: `triggeredBy: "inferred" | "explicit"`)하여 감사 추적성 유지.
 432: 
 433: - 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
 434: - ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
 435:   - `effect-result-related` → `["medical"]`
 436:   - `review-case` → `["medical", "legal"]` (의료진 + 법무 동시 필요)
 437:   - `event-price` → `["legal"]`
 438:   - 기타 High explicitRiskLevel/inferredRiskLevel → `["medical"]`
 439: - Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리
 440: 
 441: #### 7.1.3 ApproverRole → ComplianceRecord 필드 매핑
 442: 
 443: ```ts
 444: type ApproverRole = "medical" | "legal" | "operator" | "client";
 445: ```
 446: 
 447: ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
 448: 
 449: | ApproverRole | 매핑 ComplianceRecord 필드 | 의미 |
 450: |---|---|---|
 451: | `medical` | `physicianApprover` + `physicianApprovedAt` | 의료진 콘텐츠 승인 |
 452: | `legal` | `legalCounsel` + `legalCounselAt` | 법무 자문·승인 |
 453: | `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
 454: | `client` | `clientApprover` + `clientApprovedAt` | 클라이언트 측 승인 (운영 정책 시) |
 455: 
 456: - compliance-assistant는 ApproverRole 배열만 출력 — 실제 ComplianceRecord 기록 생성·갱신은 어드민 발행 워크플로
 457: - 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)
 458: 
 459: ### 7.2 출력
 460: 
 461: ```ts
 462: type ComplianceCheckResult = {
 463:   // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
 464:   automatedDecision: "block" | "gate" | "warn" | "pass";
 465:   // 세부 플래그 (편의)
 466:   buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
 467:   gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
 468:   hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
 469:   // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
 470:   findingsBySeverity: {
 471:     "fail": number;
 472:     "content-gate": number;
 473:     "warning": number;
 474:     "info": number;
 475:   };
 476:   // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
 477:   requiredApproverRoles?: ApproverRole[];
 478:   // 상세 findings
 479:   findings: Finding[];
 480: };
 481: 
 482: // automatedDecision 결정 규칙
 483: // - findings에 severity="fail" 1개 이상 → "block"
 484: // - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
 485: // - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
 486: // - 아니면 "pass"
 487: //
 488: // 최종 발행 가능 여부 (publishable)은 본 인터페이스에 포함되지 않음 — 어드민 발행 워크플로가 다음을 종합 판정:
 489: //   1) automatedDecision !== "block"
 490: //   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
 491: //   3) hasWarnings=true 시 운영 정책에 따라 검토 완료 또는 일괄 인정
 492: 
 493: // ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
 494: 
 495: type Finding = {
 496:   ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
 497:   category: string;           // § 7.4 RiskRule.category (예: "최상급")
 498:   pattern: string;             // 매칭된 패턴 텍스트 (예: "최고의"). LLM 제안에서 정규 패턴 산출 불가 시 빈 문자열 허용
 499:   severity: "info" | "warning" | "fail" | "content-gate";
 500:   location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
 501:   suggestion?: string;        // 대체 표현 (§ 4.2 참조)
 502:   requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
 503:   // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
 504:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
 505:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
 506: };
 507: ```
 508: 
 509: ### 7.3 빌드 검증 vs 어드민 검수
 510: 
 511: | 단계 | 도구 | 처리 |
 512: |---|---|---|
 513: | 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
 514: | 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |
 515: 
 516: ### 7.4 RiskRule 데이터 스키마
 517: 
 518: § 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.
 519: 
 520: ```ts
 521: // 단일 패턴 룰
 522: type SimpleRiskRule = {
 523:   id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
 524:   category: string;            // § 4.1 카테고리
 525:   pattern: string;             // 매칭 패턴 — patternType에 따라 의미 해석
 526:   patternType: "regex" | "keyword" | "phrase";
 527:   severity: "info" | "warning" | "fail" | "content-gate";
 528:   scope: ContentScope[];       // 적용 범위 — § 7.4.1
 529:   requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
 530:   suggestion?: string;
 531:   rationale?: string;
 532:   legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
 533:   exceptions?: string[];       // 예외 어구 (false-positive 방지)
 534:   contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
 535:   version: string;
 536:   createdAt: ISODateString;
 537:   updatedAt: ISODateString;
 538: };
 539: 
 540: // 복합 룰 — § 7.4.3 문맥 결합 (composite)
 541: type CompositeRiskRule = {
 542:   id: string;
 543:   category: string;
 544:   patternType: "composite";
 545:   operands: SimpleOperand[];   // 결합 대상 단일 패턴 (2개 이상)
 546:   logic: "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
 547:   // - AND_IN_SENTENCE: 같은 문장 내 모두 등장
 548:   // - AND_IN_PARAGRAPH: 같은 단락(빈 줄 분리 기준) 내 모두 등장
 549:   // - AND_NEAR: window 거리 이내 모두 등장
 550:   window?: number;             // logic="AND_NEAR" 시 char 거리. 기본 50. 다른 logic에서는 무시
 551:   severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
 552:   scope: ContentScope[];
 553:   requiredApproverRoles?: ApproverRole[];
 554:   suggestion?: string;
 555:   rationale?: string;
 556:   legalBasis?: string[];       // 법령 조문 인용 식별자 — SimpleRiskRule과 동일
 557:   contextExceptions?: ContextException[];
 558:   version: string;
 559:   createdAt: ISODateString;
 560:   updatedAt: ISODateString;
 561: };
 562: 
 563: type SimpleOperand = {
 564:   pattern: string;
 565:   patternType: "regex" | "keyword" | "phrase";
 566: };
 567: 
 568: type RiskRule = SimpleRiskRule | CompositeRiskRule;
 569: 
 570: // 적용 범위 — ID 타입 명시 (자유 문자열 금지)
 571: type ContentScope =
 572:   | { type: "pageType"; pageTypeId: PageTypeId }        // PAGE_TYPES (P-001~P-014, P-101~P-106)
 573:   | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
 574:   | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
 575:   | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
 576:   | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
 577:   | { type: "global" };
 578: 
 579: // 문맥 예외 — § 4.4 안전·주의·행정 문맥
 580: type ContextException = {
 581:   kind: "safety" | "warning-message" | "administrative";  // 의료진 상담 권유·안전 주의·환불 약관 등
 582:   pattern: string;             // 예외 인식 정규식 (예: "(상담하세요|금기|환불 불가)")
 583: };
 584: ```
 585: 
 586: #### 7.4.1 스코프 일치 규칙
 587: 
 588: - `global` 룰은 모든 콘텐츠에 적용
 589: - 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
 590: - pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선
 591: 
 592: #### 7.4.2 severity 우선순위
 593: 
 594: 같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):
 595: 
 596: ```
 597: fail > content-gate > warning > info
 598: ```
 599: 
 600: - 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
 601: - Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
 602: 
 603: #### 7.4.3 문맥 결합 룰 (composite rules)
 604: 
 605: - 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
 606: - 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
 607: - CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
 608: - composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시
 609: 
 610: #### 7.4.4 운영·관리
 611: 
 612: - 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
 613: - 룰 데이터의 빌드용 표현은 별도 데이터 파일 (`compliance/rules.yaml` 또는 동등 포맷) — `compliance/RISK_LEVELS.md` 후속에서 파일 위치·포맷 확정
 614: - 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR
 615: 
 616: ---
 617: 
 618: ## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)
 619: 
 620: | 레벨 | 정의 | 조치 |
 621: |---|---|---|
 622: | **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
 623: | **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
 624: | **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
 625: 
 626: ---
 627: 
 628: ## 9. 미결정 사항
 629: 
 630: | ID | 항목 | 비고 |
 631: |---|---|---|
 632: | CS-03 | 사례·임상 데이터 인용 시 외부 검증 가능성 자동 판정 | 운영 누적 후 |
 633: | CS-04 | 한의 특유 표현(체질·1:1 맞춤)의 회색지대 정밀 분류 | `presets/hanui-clinic/` 후속 |
 634: | CS-05 | medical disclaimer 자동 삽입 정책 — 페이지 타입별 자동 출력 vs 운영자 명시 | UX 결정 |
 635: | CS-06 | 다국어 콘텐츠에서 표현 룰 적용 — 영문·중문·일문 별도 사전 | M3 다국어 시 |
 636: | CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
 637: | CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |
 638: 
 639: ### 9.1 해소된 미결정
 640: 
 641: | ID | 항목 | 해소 |
 642: |---|---|---|
 643: | ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
 644: | ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
 645: | ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
 646: | ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
 647: 
 648: ---
 649: 
 650: ## 10. 변경 이력
 651: 
 652: | 일자 | 버전 | 변경 |
 653: |---|---|---|
 654: | 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
 655: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
 656: | 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
 657: | 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
 658: | 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
 659: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
 660: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
 661: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
 662: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 1073ms:
   1: # Glitzy 어드민 (Control Plane) — 아키텍처
   2: 
   3: > **상태**: Draft v0.7
   4: > **작성일**: 2026-05-14 (v0.6 → v0.7 — 피드백 정정: § 3.2 사이트 기본 정보 화면 입력/출력 SoT 정합)
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 10
   7: > **목적**: 솔루션 운영 Control Plane(어드민)의 위상·원칙·Vertical Slice 명세·Phase 로드맵·기능 영역·데이터 모델·통합 흐름을 정의한다.
   8: > **외부 공유 시 주의**: 상위 문서와 동일.
   9: 
  10: ---
  11: 
  12: ## 0. 한 페이지 요약
  13: 
  14: - 어드민은 **솔루션의 운영 Control Plane**이다. 무엇이·어떤 상태로·누가 승인해서 발행되는지 결정하는 운영 중심축이다.
  15: - 사이트는 어드민이 관리한 Instance 데이터와 `FeatureModuleConfig`를 기반으로 생성된다. 단 최종 렌더링·배포는 Data Plane(Git + 빌드 파이프라인 + 정적 호스팅)이 담당한다.
  16: - **사이트 빌드 입력은 파일**(Git)로, **운영 상태·권한·감사·승인·알림 이력은 어드민 DB**가 원본이다.
  17: - 어드민이 일시 중단되어도 이미 빌드된 사이트는 작동한다 (Plane 격리).
  18: - 개발 접근법은 **Admin-first** — UI를 처음부터 워크벤치로 잡고, 데이터 구조와 운영 흐름을 먼저 고정한다.
  19: - 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.
  20: 
  21: ---
  22: 
  23: ## 1. 위치 — 전체 흐름
  24: 
  25: ```
  26: ┌──────────────────────────────────────────────────────────────────────┐
  27: │                  Control Plane — Glitzy 어드민                         │
  28: │                                                                        │
  29: │  운영자 입력 · 검수 · 승인 · 발행 결정                                   │
  30: │                                                                        │
  31: │  ┌────────────────────────────────────────────────────────────────┐  │
  32: │  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
  33: │  │ ① 클라이언트 인스턴스 대시보드                                     │  │
  34: │  │ ② 사이트 기본 정보 (ClinicProfile)                                │  │
  35: │  │ ③ 의료진 관리 (DoctorProfile)                                     │  │
  36: │  │ ④ 시술/진료 페이지 (TreatmentPage)                                │  │
  37: │  │ ⑤ 콘텐츠 작성/검수 (Article — Markdown 에디터)                    │  │
  38: │  │ ⑥ 미리보기/발행 (Preview + 발행 + 발행 이력)                     │  │
  39: │  └────────────────────────────────────────────────────────────────┘  │
  40: │                                                                        │
  41: │  어드민 DB 원본: 권한·승인 로그·감사·알림 이력·드래프트·운영 메타        │
  42: └──────────────────────────────────────────────────────────────────────┘
  43:                             │
  44:                             │ 발행 트리거 → 파일 산출 (Markdown/JSON) + Git 커밋·push
  45:                             ▼
  46: ┌──────────────────────────────────────────────────────────────────────┐
  47: │                  Data Plane                                            │
  48: │                                                                        │
  49: │   Git 저장소 (콘텐츠·메타·매니페스트 원본)                              │
  50: │      │                                                                 │
  51: │      │ push → CI/CD                                                    │
  52: │      ▼                                                                 │
  53: │   빌드 파이프라인 (Core · Preset · Instance · Feature Modules)         │
  54: │      │                                                                 │
  55: │      │ 정적 사이트 산출                                                 │
  56: │      ▼                                                                 │
  57: │   클라이언트 도메인 (정적 호스팅 — Vercel / Cloudflare 등)             │
  58: └──────────────────────────────────────────────────────────────────────┘
  59:                             │
  60:                             │ 운영 단계 field metric·모니터링 데이터
  61:                             ▼
  62:                   Control Plane 대시보드로 회수
  63:                   (analytics-reporting · keyword-monitoring ·
  64:                    search-visibility · notifications)
  65: ```
  66: 
  67: ---
  68: 
  69: ## 2. 핵심 원칙
  70: 
  71: | # | 원칙 | 설명 |
  72: |---|---|---|
  73: | 1 | **Control Plane** | 어드민은 운영 중심축. 무엇이·어떻게·누가 승인해서 발행되는지 결정. 단순 입력 도구 이상 |
  74: | 2 | **Data Plane 분리** | 최종 사이트 렌더링·배포는 Data Plane(Git + 빌드 + 호스팅)이 담당. 어드민이 빌드 파이프라인을 대체하지 않는다 |
  75: | 3 | **빌드 입력은 파일** | 사이트 빌드 입력은 모두 버전 관리 가능한 파일(Markdown/JSON 등)로 Git에 남긴다. DB에 가두지 않는다 |
  76: | 4 | **운영 메타는 DB 원본** | 운영 상태·권한·승인·감사·알림 이력은 어드민 DB가 진실의 원본 |
  77: | 5 | **Plane 격리** | Control Plane(어드민)이 일시 중단되어도 Data Plane(이미 빌드된 사이트)은 작동 |
  78: | 6 | **컴플라이언스 강제** | 상위 § 9 게이트를 UI 레벨에서 우회 불가하게 강제 |
  79: | 7 | **Git 친화** | 발행은 Git 커밋·PR로 이어진다. 수정 이력·롤백은 Git이 자동 제공. 운영자가 직접 파일 수정도 가능 (양방향 친화) |
  80: | 8 | **Admin-first 개발** | UI를 처음부터 워크벤치로 잡되, 모든 기능을 한 번에 만들지 않는다. 핵심 워크플로우를 처음부터 끝까지 관통시킨다 |
  81: | 9 | **데이터·흐름 우선, 자동화 후순위** | 어떤 데이터·상태·승인자·산출물·Preview를 먼저 못 박는다. 자동화·LLM 보조·대시보드 풍부화는 그 후 |
  82: | 10 | **Feature Modules 통합** | 모듈을 직접 구현하지 않고 표준 인터페이스를 통해 통합 (대시보드·설정·UI) |
  83: 
  84: ---
  85: 
  86: ## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
  87: 
  88: > 본 절은 솔루션의 **첫 동작 가능 범위**를 정의한다. 이 한 줄이 처음부터 끝까지 동작하면 1호 클라이언트(다이어트 한의원) 출시 가능. 이후 기능은 모두 이 흐름에 붙는다.
  89: 
  90: ### 3.1 Slice 흐름
  91: 
  92: ```
  93: [Admin UI 진입]
  94:    ↓
  95: [클라이언트 인스턴스 생성/선택]
  96:    ↓
  97: [사이트 기본 정보 입력] → ClinicProfile 폼
  98:    ↓
  99: [의료진 정보 입력] → DoctorProfile 폼 (1명 이상)
 100:    ↓
 101: [시술/진료 페이지 작성] → TreatmentPage 폼 (1개 이상)
 102:    ↓
 103: [콘텐츠 작성] → Article 작성 (Markdown 에디터, 1개 이상)
 104:    ↓
 105: [위험도 분류 + 자동 검수] → Low/Medium/High 수동 분류, 룰 기반 표현 검수
 106:    ↓
 107: [발행 트리거]
 108:    ↓
 109: [파일 산출: Markdown/JSON] → Git 커밋·push (자동)
 110:    ↓
 111: [CI/CD 빌드] → 정적 사이트 산출
 112:    ↓
 113: [Preview URL 확인] → 호스팅 자동 Preview deployment
 114:    ↓
 115: [정식 배포] → 클라이언트 도메인에 게시
 116:    ↓
 117: [ComplianceRecord 보관] → 어드민 DB (감사 증빙)
 118: ```
 119: 
 120: ### 3.2 Slice 포함 범위 — 6개 핵심 화면
 121: 
 122: | # | 화면 | 책임 | 입력 데이터 | 출력 |
 123: |---|---|---|---|---|
 124: | ① | 클라이언트 인스턴스 대시보드 | 단일 인스턴스 표시·전환 | (Slice는 단일 인스턴스) | 인스턴스 상태·배포 상태·컴플라이언스 상태 |
 125: | ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
 126: | ③ | 의료진 관리 | 의료진 권위 정보 입력 | `DoctorProfile` (N명) | Physician schema + 저자 프로필 |
 127: | ④ | 시술/진료 페이지 | 시술 구조화 콘텐츠 | `TreatmentPage` (N개) | MedicalProcedure schema |
 128: | ⑤ | 콘텐츠 작성/검수 | Article 작성 + 표현 검수 | `Article` + `RiskLevel` | Article schema + 컴플라이언스 통과 |
 129: | ⑥ | 미리보기/발행 | 발행 트리거·Preview URL·발행 이력 | (앞 화면의 변경사항) | Git 커밋·CI 빌드 트리거 |
 130: 
 131: ### 3.3 Slice 포함 데이터 계약 (최소 필드)
 132: 
 133: > § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
 134: 
 135: | 계약 | 필수 필드 (Slice 최소) | 자동 생성 | 어드민 폼 위치 |
 136: |---|---|:---:|---|
 137: | `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
 138: | `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
 139: | `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
 140: | `DoctorProfile` (C-02) | 이름·자격·전문분야·약력. (사진 선택) | | DoctorProfile 화면 |
 141: | `TreatmentPage` (C-03) | 제목·개요·원리·대상·과정·주의사항 (M0 추가 필드 — `recommendedFor`·`treatmentComponents`·`visitFlow` 등은 선택) | | TreatmentPage 화면 |
 142: | `Article` (C-04) | 제목·요약·본문·저자·발행일·카테고리·`articleType` | | Article 작성 화면 |
 143: | `RiskLevel` (C-05 enum) | Low / Medium / High 수동 분류 | | (모든 폼 안에서 부여) |
 144: | `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
 145: 
 146: ### 3.4 Slice 컴플라이언스 게이트 깊이
 147: 
 148: - 룰 기반 자동 검수 (금지 표현 패턴 1차 5~10종 시작)
 149: - Low/Medium/High 수동 분류 (자동 분류·LLM 보조는 Slice 외 — Beta)
 150: - 발행 시 `ComplianceRecord` 자동 생성 (필수 필드)
 151: - 등급별 승인 흐름 단순화: Low는 자동 통과, Medium/High는 발행 시 의료진/클라이언트 승인 확인 체크박스 + 승인자 신원·일자 기록
 152: 
 153: ### 3.5 Slice Git 통합 깊이
 154: 
 155: - 발행 시 Markdown/JSON 파일 자동 출력
 156: - 자동 git commit & push (Direct push, PR 워크플로우는 Beta)
 157: - 빌드 트리거는 push 시 CI/CD 자동
 158: - 롤백은 Git revert 또는 이전 커밋 체크아웃 (UI는 단순)
 159: 
 160: ### 3.6 Slice Preview·배포
 161: 
 162: - Preview URL은 호스팅 자체 Preview deployment 활용 (Vercel / Cloudflare 자동 생성 URL)
 163: - 별도 Preview 서버 미구축
 164: - 정식 배포는 메인 브랜치 push 시 자동
 165: 
 166: ### 3.7 Slice 인증·권한
 167: 
 168: - 단일 Glitzy 운영자 계정 (단순 인증)
 169: - 외부 사용자 초대·RBAC는 Beta
 170: 
 171: ### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 9종 + Article 1샘플 = 10개 페이지
 172: 
 173: > 상세는 `core/PAGE_TYPES.md` § 6 (단일 진실 원본).
 174: 
 175: | 순서 | 페이지 타입 | 비고 |
 176: |---|---|---|
 177: | 1 | P-001 Home | 메인. Articles List 미합류 상태에서 Article 샘플로 **직접 링크**해 고립 회피 |
 178: | 2 | P-002 About | ClinicProfile 노출 |
 179: | 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
 180: | 4 | P-004 Doctor Profile | 1개 이상 |
 181: | 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
 182: | 6 | P-006 Treatment Detail | 1개 이상 |
 183: | 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
 184: | 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
 185: | **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
 186: | (샘플) | P-010 Article Detail | 1개 샘플. Home에서 직접 링크 |
 187: 
 188: → Slice **어드민 화면 수는 6개 그대로** 유지. P-012·P-014·P-013은 ClinicProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
 189: 
 190: ### 3.8.1 LocationProfile(main) 자동 생성 규칙
 191: 
 192: > **계약 필드 vs 어드민 폼 입력 필드의 구분**:
 193: > - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
 194: > - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
 195: 
 196: 운영자가 어드민에서 ClinicProfile 화면을 입력하면, 어드민은 두 섹션의 입력값을 분리해 다음을 생성한다:
 197: 
 198: **(1) `ClinicProfile` 파일** — DATA_MODEL.md C-01 필드만 (브랜드·메타·통계).
 199: 
 200: **(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
 201: 
 202: | LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
 203: |---|---|
 204: | `@id` | `"main"` |
 205: | `name` | ClinicProfile의 `name` (또는 "본원") |
 206: | `parentClinic` | ClinicProfile의 `@id` |
 207: | `address` | 폼의 "본원 주소" 입력값 |
 208: | `telephone` / `email` | 폼의 "본원 전화 / 이메일" 입력값 |
 209: | `businessHours` | 폼의 "본원 진료시간·접수시간·점심·휴진" 입력값 |
 210: | `representativeDoctors` | ClinicProfile에 등록된 대표 의료진 |
 211: | `doctorsAtLocation` | 전체 의료진 (운영자가 추후 지정 가능) |
 212: | `availableTreatments` | 전체 시술 (운영자가 추후 지정 가능) |
 213: | `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
 214: 
 215: **다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
 216: 
 217: **구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
 218: 
 219: ### 3.8.2 LegalDocument 자동 생성 규칙
 220: 
 221: P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.
 222: 
 223: | LegalDocument 필드 | 자동 생성 값 |
 224: |---|---|
 225: | `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
 226: | `documentType` | enum 매칭 |
 227: | `title` | 표준 (예: "개인정보처리방침") |
 228: | `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) + **Policy 변수** (`{{policy.contactPerson}}`·`{{policy.contactEmail}}`·`{{policy.contactPhone}}`·`{{policy.effectiveDate}}`) — 출처 SoT 준수 |
 229: | `effectiveDate` | 클라이언트 첫 발행 시 명시 입력 또는 발행 일자 |
 230: | `contactPerson` | 개인정보 보호 책임자 등 — 어드민에서 ClinicProfile 폼의 "정책 변수" 보조 섹션에 입력 |
 231: 
 232: **Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
 233: 
 234: | 영역 | 변수 키 | 출처 |
 235: |---|---|---|
 236: | clinic | `{{clinic.name}}` | ClinicProfile.name |
 237: | clinic | `{{clinic.legalEntityName}}` | ClinicProfile.legalEntityName |
 238: | clinic | `{{clinic.businessRegistrationNumber}}` | ClinicProfile.businessRegistrationNumber |
 239: | clinic | `{{clinic.founder}}` | ClinicProfile.founder |
 240: | location | `{{location.main.address}}` | LocationProfile(main).streetAddress 등 결합 |
 241: | location | `{{location.main.telephone}}` | LocationProfile(main).phone |
 242: | location | `{{location.main.email}}` | LocationProfile(main).email |
 243: | policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
 244: | policy | `{{policy.contactEmail}}` | ClinicProfile.policyContactEmail |
 245: | policy | `{{policy.contactPhone}}` | ClinicProfile.policyContactPhone |
 246: | policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |
 247: 
 248: **어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
 249: 
 250: **법무 검토 (위험도 Low 예외 룰)**:
 251: - LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
 252: - 발행 시 ComplianceRecord에 다음을 **모두 기록 필수** (어드민 발행 게이트가 강제):
 253:   - `contentType` = `LegalDocument`
 254:   - `legalCounsel` = 법무 자문자 신원 (필수)
 255:   - `legalCounselAt` = 자문 일자 (필수)
 256: - `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)
 257: 
 258: ### 3.9 Slice JSON-LD Schema (Core 자동 생성)
 259: 
 260: - Organization, MedicalClinic, Physician, MedicalProcedure, Article
 261: - BreadcrumbList, FAQPage (필요 시)
 262: 
 263: ### 3.10 Slice Feature Modules 깊이
 264: 
 265: - Slice 단계에서는 **모듈 활성화 UI는 외**
 266: - compliance-assistant의 **룰 기반 부분만 Slice에 포함** (자동 검수)
 267: - 다른 모듈(notifications·analytics-reporting·search-visibility 등)은 Phase Alpha+/Beta로 합류
 268: 
 269: ### 3.11 Slice 완료 게이트 (6항목)
 270: 
 271: | # | 게이트 항목 | 통과 기준 |
 272: |---|---|---|
 273: | 1 | 사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
 274: | 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
 275: | 3 | 컴플라이언스 자동 검수 | 룰 기반 금지 표현 검수 동작 + Low/Medium/High 수동 분류 동작 |
 276: | 4 | Git 기반 발행·롤백 | 발행 시 커밋 자동 생성, Git revert로 롤백 가능 |
 277: | 5 | Preview URL 제공 | 발행 전 별도 URL로 미리보기 가능 |
 278: | 6 | `ComplianceRecord` 어드민 DB 보관 | 발행 콘텐츠당 위험도·검수자·일자 기록 |
 279: 
 280: ---
 281: 
 282: ## 4. Phase 로드맵 — M0 → M1 → M2 → M3
 283: 
 284: ### 4.1 M0 — Vertical Slice (§ 3 참조)
 285: 
 286: 위 § 3 명세. 1호 클라이언트 출시 가능 시점.
 287: 
 288: ### 4.2 M1 — Phase Alpha (Slice 직후 합류 기능)
 289: 
 290: Slice를 끝낸 후 1호 운영 안정화를 위해 합류시킬 기능들:
 291: 
 292: | 기능 | 비고 |
 293: |---|---|
 294: | Feature Modules 설정 UI (7번째 화면) | 어떤 모듈 활성화·설정 |
 295: | notifications 모듈 통합 | 발행·검수 알림 |
 296: | 발행 이력 풍부화 | 시각화 + 필터 |
 297: | 빌드 상태 표시 | CI 상태 연동 |
 298: | ComplianceRecord 풀필드 | 첨부·심의 증빙 보관 강화 |
 299: | 단일 인스턴스 멀티 사용자 (운영자·검수자 2개 역할) | 단순 RBAC |
 300: 
 301: ### 4.3 M2 — Phase Beta (2~5호 클라이언트 동시 운영)
 302: 
 303: | 기능 | 비고 |
 304: |---|---|
 305: | 멀티 클라이언트 대시보드 | 인스턴스 목록·상태 |
 306: | 풀 RBAC | 운영자·검수자·클라이언트 승인자·외부 자문 |
 307: | 컴플라이언스 게이트 전체 (상위 § 9 5단계) | UI 강제 |
 308: | 의료진/클라이언트 외부 검토 채널 | 초대·검토·승인 |
 309: | 발행 예약 | 시간 지정 |
 310: | 수정 이력 UI | Git history 시각화 |
 311: | compliance-assistant LLM 보조 | 자동 위험도 분류·LLM 검수 |
 312: | analytics-reporting 통합 | 외부 분석 도구 연동 + 자동 리포트 |
 313: | keyword-monitoring · search-visibility 통합 | 모니터링 대시보드 |
 314: | PR 워크플로우 | Direct push 외 PR 기반 옵션 |
 315: 
 316: ### 4.4 M3 — Phase GA (제품화 완성)
 317: 
 318: | 기능 | 비고 |
 319: |---|---|
 320: | 비주얼 디자인 토큰 에디터 | 시각적 |
 321: | 콘텐츠 캘린더 | 발행 일정 |
 322: | 성과 인사이트 | 콘텐츠별 노출·전환 분석 |
 323: | asset-ingestion · content-migration 통합 | 신규 클라이언트 온보딩 자동화 |
 324: | crm-sync 통합 | CRM 양방향 |
 325: | Audit log 풀필드 | 모든 운영 행위 감사 |
 326: | 외부 자문 협업 UI | 법무·심의 자문 채널 |
 327: | 다국어 지원 (선택) | 영문 페이지 등 |
 328: 
 329: ---
 330: 
 331: ## 5. 기능 영역 상세
 332: 
 333: ### 5.1 콘텐츠 작성 영역
 334: - Markdown 에디터 + Frontmatter 폼 (페이지 타입별 동적 폼)
 335: - 실시간 미리보기
 336: - 구조 블록 삽입 (Q&A·리스트·표 — 상위 § 4.1)
 337: - 자동 표현 검수 하이라이트 (compliance-assistant)
 338: - 저장·발행 시 위험도 분류 강제
 339: 
 340: ### 5.2 데이터 입력 영역
 341: 
 342: > **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
 343: 
 344: **M0 어드민 화면별 입력·출력 매핑**:
 345: 
 346: | 어드민 화면 | 폼 섹션 | 출력 계약 파일 |
 347: |---|---|---|
 348: | ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
 349: | DoctorProfile 화면 | 의료진 1인 입력 | `DoctorProfile`(N개) |
 350: | TreatmentPage 화면 | 시술 1건 입력 | `TreatmentPage`(N개) |
 351: | Article 화면 | Article 작성 (Markdown 에디터) | `Article`(N개) |
 352: | 대시보드 화면 | 인스턴스 상태·전환 | (출력 없음) |
 353: | 미리보기·발행 화면 | 발행 트리거 | Git 커밋·CI 빌드 |
 354: 
 355: **M0 이후 추가 계약**:
 356: - `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
 357: - `BrandTokens` 입력 (M0 form, M3 비주얼 에디터)
 358: - `ReviewPolicy` 설정 (P-101 활성화 시) — 업종 기본값 → 인스턴스별 조정
 359: 
 360: ### 5.3 컴플라이언스 게이트 영역
 361: - 위험도 분류 (M0 수동, M2 자동 보조)
 362: - 자동 표현 검수 결과 표시
 363: - 동료·의료진·클라이언트 승인 요청·기록
 364: - 사전심의 필요성 판단·기록
 365: - `ComplianceRecord` 자동 생성·보관
 366: 
 367: ### 5.4 멀티 클라이언트 관리 (M2+)
 368: - 인스턴스 목록·상태·전환
 369: - 인스턴스별 Feature Module 활성화·설정
 370: - 권한·접근 제어
 371: - 인스턴스 manifest 버전 표시
 372: 
 373: ### 5.5 모니터링 대시보드 (M2+)
 374: - analytics-reporting 데이터 표시
 375: - keyword-monitoring · search-visibility 결과
 376: - 성능 field metric 추세 (상위 § 4.3)
 377: - 컴플라이언스 통계
 378: - 발행 캘린더
 379: 
 380: ### 5.6 발행·롤백 영역
 381: - 발행 트리거 (Git 커밋·push 자동)
 382: - Preview URL 자동 생성
 383: - 발행 이력 (Git history 연동)
 384: - 롤백 (Git revert / 이전 커밋 체크아웃)
 385: - 빌드 상태 표시
 386: 
 387: ---
 388: 
 389: ## 6. 데이터 모델
 390: 
 391: > 상세 필드는 `docs/admin/DATA_MODEL.md`.
 392: 
 393: ### 6.1 어드민 DB가 원본인 데이터
 394: 
 395: | 데이터 | 비고 |
 396: |---|---|
 397: | 운영자·승인자 계정·권한 | RBAC |
 398: | 클라이언트 인스턴스 메타 (이름·도메인·상태·활성 모듈) | |
 399: | 콘텐츠 임시 드래프트 | 발행 시 파일로 출력·Git 커밋 |
 400: | `ComplianceRecord` 풀필드 | 감사·증빙 |
 401: | Audit log | 모든 운영 행위 |
 402: | 알림 발송 이력 | notifications 모듈 |
 403: | 외부 분석 통합 캐시 | analytics-reporting 모듈 |
 404: | 사전심의 제출·증빙 첨부 파일 | |
 405: | 외부 자문 회신·기록 | |
 406: 
 407: ### 6.2 Git이 원본인 데이터 (빌드 입력)
 408: 
 409: | 데이터 | 형식 |
 410: |---|---|
 411: | 콘텐츠 본문 (Article·페이지) | Markdown |
 412: | 콘텐츠 Frontmatter (메타) | YAML |
 413: | 페이지 데이터 (`ClinicProfile`·`DoctorProfile`·`TreatmentPage` 등) | JSON 또는 YAML |
 414: | `InstanceManifest` | YAML 또는 JSON |
 415: | `BrandTokens` | JSON 또는 YAML |
 416: | `FeatureModuleConfig` | JSON 또는 YAML |
 417: | `ComplianceRecord` 빌드 참조 메타 (위험도·심의 통과·발행일) — DB 사본 | JSON |
 418: | 미디어 자산 (이미지·동영상) | 바이너리 (LFS 검토) |
 419: 
 420: ### 6.3 두 영역 교차 데이터
 421: 
 422: `ComplianceRecord`는 상위 § 9.4 정책을 따른다 — 감사·법무 증빙 풀데이터는 DB가 원본, 사이트 빌드 참조용 가벼운 메타는 Git에 사본.
 423: 
 424: ---
 425: 
 426: ## 7. 인증·권한 모델
 427: 
 428: ### 7.1 단계별 도입
 429: 
 430: | 단계 | 인증·권한 |
 431: |---|---|
 432: | M0 (Slice) | 단일 운영자 계정. 단순 인증 |
 433: | M1 | 운영자 + 검수자 2개 역할. 단순 RBAC |
 434: | M2 | 풀 RBAC. 외부 사용자(의료진·클라이언트 승인자·외부 자문) 초대 |
 435: | M3 | SSO 검토. 외부 자문 협업 채널 |
 436: 
 437: ### 7.2 역할 (M2+)
 438: 
 439: | 역할 | 권한 |
 440: |---|---|
 441: | **Glitzy Admin** | 모든 인스턴스·Module·설정 |
 442: | **Glitzy Editor** | 콘텐츠 작성·발행. 시스템 설정 제외 |
 443: | **Glitzy Reviewer** | 동료 검수 |
 444: | **Client Physician** | 의학적 정확성 검토·승인 (Medium/High) |
 445: | **Client Approver** | 클라이언트 최종 발행 동의 |
 446: | **External Counsel** | High 자문 (법무·심의) |
 447: | **Read-only Auditor** | 감사 읽기 |
 448: 
 449: ---
 450: 
 451: ## 8. 외부 시스템 연동
 452: 
 453: | 시스템 | 통합 방식 | 단계 |
 454: |---|---|---|
 455: | Git 호스팅 (GitHub/GitLab) | 빌드 트리거·커밋·PR API | M0 |
 456: | CI/CD | 웹훅·상태 표시 | M0 |
 457: | 정적 호스팅 (Vercel·Cloudflare) | Preview URL·배포 상태 | M0 |
 458: | 네이버 서치어드바이저 | analytics-reporting | M2 |
 459: | Google Search Console | analytics-reporting | M2 |
 460: | GA4 | analytics-reporting | M2 |
 461: | 이메일·슬랙·SMS | notifications | M1/M2 |
 462: | 클라이언트 CRM | crm-sync | M2+ |
 463: | LLM (Claude/GPT) | compliance-assistant | M2 |
 464: | 외부 자문 협업 도구 | 검토 채널 | M3 |
 465: 
 466: ---
 467: 
 468: ## 9. Feature Modules 통합
 469: 
 470: 어드민은 Feature Module을 **직접 구현하지 않는다**. 모듈의 표준 인터페이스를 통해:
 471: 
 472: 1. 모듈 활성화·비활성화 UI (`FeatureModuleConfig` 편집)
 473: 2. 모듈별 설정 UI (모듈 명세의 설정 스키마 기반 동적 폼)
 474: 3. 모듈 출력 표시 (알림·리포트·키워드 모니터링·search-visibility 결과)
 475: 4. 모듈 이벤트 구독·표시
 476: 
 477: 각 모듈은 어드민이 통합 가능한 표준 인터페이스(설정 스키마, 이벤트, 대시보드 위젯)를 제공해야 한다.
 478: 
 479: ---
 480: 
 481: ## 10. 미결정 사항 (어드민 한정)
 482: 
 483: | ID | 항목 | 상태 |
 484: |---|---|---|
 485: | A-01 | 어드민 기술 스택 | 미결정 |
 486: | A-02 | 어드민 DB (PostgreSQL / SQLite / 기타) | 미결정 |
 487: | A-03 | 인증 시스템 (자체 / Auth0 / Clerk / 기타) | 미결정 |
 488: | A-04 | Preview URL 발급 방식 | 호스팅 의존 추정 |
 489: | A-05 | Git 워크플로우 | M0 Direct push, M2+ PR 옵션 |
 490: | A-06 | 에디터 구현 (Tiptap / Lexical / CodeMirror / native MD) | 미결정 |
 491: | A-07 | 다국어 지원 필요 시점 | M3 검토 |
 492: | A-08 | Slice 화면 ⑤(Article 작성) 에디터 우선 기능 (블록 vs Markdown native) | 미결정 |
 493: 
 494: ---
 495: 
 496: ## 11. 변경 이력
 497: 
 498: | 일자 | 버전 | 변경 | 작성자 |
 499: |---|---|---|---|
 500: | 2026-05-13 | v0.1 | 최초 작성 (ARCHITECTURE.md v0.3에서 분리) | Glitzy (Claude 페어링) |
 501: | 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
 502: | 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
 503: | 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
 504: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
 505: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
 506: | 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

 succeeded in 1149ms:
   1: # Core — 디자인 토큰
   2: 
   3: > **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
   4: > **작성일**: 2026-05-14
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
   7: > **목적**: Core가 정의하는 디자인 토큰 표준 — 토큰 분류(primitive·semantic·component), 색상·타이포·간격·라운드·그림자·모션·컴포넌트 토큰 카탈로그, 출력 형식(CSS·JSON), Preset/Instance override 인터페이스, 접근성 기준, 빌드 검증을 단독 구현 가능한 명세로 정의.
   8: > **외부 공유 시 주의**: 상위 문서와 동일.
   9: > **연관 문서**:
  10: > - 페이지 타입·헤딩 위계 → `core/PAGE_TYPES.md` § 2.1
  11: > - 콘텐츠 블록 표준(콜아웃·인용·표) → `core/CONTENT_STANDARDS.md` § 3
  12: > - 메타·sitemap → `core/SEARCH_STANDARDIZATION.md`
  13: > - 어드민 화면 토큰 흐름 → `docs/admin/ARCHITECTURE.md` (후속)
  14: 
  15: ---
  16: 
  17: ## 0. 한 페이지 요약
  18: 
  19: - **3-tier 토큰 구조**: primitive(원시값) → semantic(의미) → component(컴포넌트 매핑). **색상·shadow component**는 semantic 참조 의무(primitive 직접 참조 fail). typography·spacing·radius·motion은 primitive 직접 참조 허용 (§ 2.4 참조 규칙 표)
  20: - **3-레이어 override**: Core(기본 카탈로그) → Preset(업종 카테고리 — 한의·치과·종합병원 등) → Instance(개별 클라이언트)
  21: - **출력 형식 2종**: (a) CSS Custom Properties (`:root`·`[data-theme="dark"]`), (b) `tokens.json` (Style Dictionary 호환 — 빌드 도구 변환 가능)
  22: - **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
  23: - **접근성**: WCAG 2.1 AA 명도 대비(텍스트 4.5:1·UI 3:1) + 포커스 표시 의무
  24: - **빌드 검증**: 토큰 미정의(체인 단절)·순환 참조·접근성 위반·**색상/shadow component에서 primitive 직접 참조** 시 fail (typography·spacing·radius·motion의 primitive 직접 참조는 § 2.4 허용)
  25: 
  26: ---
  27: 
  28: ## 1. 일반 규약
  29: 
  30: ### 1.1 변경 정책
  31: 
  32: | 변경 유형 | 버전 영향 | 비고 |
  33: |---|---|---|
  34: | primitive 값 변경 (색상·크기) | **MAJOR** | semantic·component 전반 영향 — 마이그레이션 가이드 필수 |
  35: | primitive 추가 | MINOR | |
  36: | semantic 토큰 추가 | MINOR | |
  37: | semantic 토큰 값 변경 (primitive 참조 교체) | **MAJOR** | UI 시각 변경 가능 |
  38: | component 토큰 추가·변경 | MINOR | |
  39: | 컴포넌트 → semantic 매핑 변경 | MINOR | |
  40: | 출력 형식·파일 위치 변경 | **MAJOR** | 빌드 도구 정합성 |
  41: 
  42: ### 1.2 SoT 원칙
  43: 
  44: - 본 문서 = **토큰 카탈로그·매핑 SoT** (사람 가독)
  45: - **기계 처리 SoT — 4파일 구조** (`data/design-tokens/`):
  46:   - `primitive.tokens.json` (테마 무관 원시값)
  47:   - `semantic.light.tokens.json` (semantic — light 테마)
  48:   - `semantic.dark.tokens.json` (semantic — dark 테마)
  49:   - `component.tokens.json` (테마 무관, semantic 참조)
  50: - Preset·Instance override 토큰 파일은 동일 4파일 구조를 따른다 (`presets/<presetSlug>/design-tokens/*.json`·`instances/<instanceId>/design-tokens/*.json`)
  51: - 빌드 결과 — `dist/tokens/<theme>.css` + `dist/tokens/<theme>.json`
  52: 
  53: ### 1.3 본 문서가 다루지 않는 영역
  54: 
  55: - 컴포넌트 시각 디자인 사양 (Figma 등 외부) — 본 문서는 토큰 인터페이스만
  56: - 페이지별 레이아웃 — `core/PAGE_TYPES.md` § 2
  57: - 의료광고법 표현 룰 — `core/CONTENT_STANDARDS.md` § 4
  58: 
  59: ---
  60: 
  61: ## 2. 토큰 분류 (3-tier)
  62: 
  63: ### 2.1 primitive (원시값)
  64: 
  65: 브랜드·시각 의미 없이 색상·크기·간격의 **원시값**만 보관. 다크모드·테마와 무관.
  66: 
  67: ```
  68: color.white·color.black                           (절대값)
  69: color.gray.50    ~ color.gray.900                  (10단계)
  70: color.blue.50    ~ color.blue.900                  (10단계)
  71: color.green.50   ~ color.green.900                 (10단계)
  72: color.amber.50   ~ color.amber.900                 (10단계)
  73: color.red.50     ~ color.red.900                   (10단계)
  74: font.size.12·14·16·18·20·24·30·36·48·60·72         (11단계 — § 4.2 표 SoT)
  75: font.weight.regular·medium·semibold·bold
  76: line.height.tight·normal·loose
  77: letter.spacing.tight·normal·wide
  78: spacing.0·1·2·3·4·6·8·12·16·24·32·48·64           (13단계 — § 5.1 표 SoT)
  79: breakpoint.sm·md·lg·xl·2xl                         (§ 5.2)
  80: radius.0·sm·md·lg·xl·full                          (§ 6.1)
  81: border.width.thin·medium·thick                     (§ 6.3)
  82: duration.fast·normal·slow                          (§ 7.1)
  83: easing.linear·in·out·in-out                        (§ 7.2)
  84: ```
  85: 
  86: > `shadow.*`는 **semantic 단계**에서 정의 (§ 6.2 theme-aware). primitive에 두지 않음.
  87: > `container.*`는 semantic 단계 (§ 5.3) — primitive `breakpoint.*` + `spacing.*` 참조.
  88: 
  89: ### 2.2 semantic (의미)
  90: 
  91: primitive를 참조하여 **사용 맥락**을 의미화. 다크모드 분기 지점.
  92: 
  93: ```
  94: color.surface.background  → light: color.gray.50,  dark: color.gray.900
  95: color.text.primary        → light: color.gray.900, dark: color.gray.50
  96: color.text.secondary      → light: color.gray.600, dark: color.gray.300
  97: color.brand.primary       → color.blue.600 (Preset/Instance override)
  98: color.status.success      → color.green.600
  99: color.status.warning      → color.amber.500
 100: color.status.error        → color.red.600
 101: color.status.info         → color.blue.500
 102: ...
 103: ```
 104: 
 105: ### 2.3 component (컴포넌트 매핑)
 106: 
 107: semantic을 참조하여 **컴포넌트 단위 토큰** 정의. 컴포넌트 구현은 본 토큰만 참조.
 108: 
 109: ```
 110: button.primary.background       → color.brand.primary
 111: button.primary.text             → color.text.inverse
 112: button.primary.hover.background → color.brand.primary.hover
 113: ...
 114: card.background                  → color.surface.elevated
 115: card.border                      → color.border.subtle
 116: ...
 117: callout.info.background          → color.status.info.subtle
 118: callout.warning.background       → color.status.warning.subtle
 119: callout.disclaimer.background    → color.surface.subtle
 120: ```
 121: 
 122: ### 2.4 참조 규칙
 123: 
 124: 토큰 영역별로 의무 강도가 다르다:
 125: 
 126: | 영역 | component 층 참조 규칙 |
 127: |---|---|
 128: | **색상** (`color.*`) | semantic 의무. primitive 직접 참조 시 빌드 fail (다크모드·테마 분기 보장) |
 129: | **타이포** (`font.*`, `line.height.*`, `letter.spacing.*`) | semantic(예: `typography.body.default`) 또는 primitive 모두 허용 |
 130: | **간격** (`spacing.*`) | primitive 직접 참조 허용 (semantic 간격 토큰 없음) |
 131: | **라운드·테두리** (`radius.*`, `border.width.*`) | primitive 직접 참조 허용 |
 132: | **그림자** (`shadow.*`) | semantic 의무. 다크모드 분기 보장 (§ 6.2 정합) |
 133: | **모션** (`duration.*`, `easing.*`) | primitive 직접 참조 허용 |
 134: 
 135: - semantic → primitive 또는 다른 semantic 참조
 136: - 순환 참조 fail (DAG 강제)
 137: - component → component 참조 금지 (수평 참조 불가)
 138: 
 139: ---
 140: 
 141: ## 3. 색상 토큰
 142: 
 143: ### 3.1 primitive 색상 팔레트
 144: 
 145: 각 hue는 50·100·200·300·400·500·600·700·800·900 (10단계) + 절대값 2종(`color.white`, `color.black`).
 146: 
 147: | 토큰 | 용도 |
 148: |---|---|
 149: | `color.white` | 절대값 `#ffffff` — surface.elevated(light) 등에서 사용 |
 150: | `color.black` | 절대값 `#000000` — opacity 베이스 |
 151: | `color.gray.*` (50~900) | neutral 배경·텍스트·경계 |
 152: | `color.blue.*` | 기본 brand 후보 + info |
 153: | `color.green.*` | success |
 154: | `color.amber.*` | warning |
 155: | `color.red.*` | error |
 156: | `color.teal·indigo·pink·*` (확장) | preset/instance 확장 시 |
 157: 
 158: primitive 색상의 정확한 hex 값은 § 3.4 표 (본 문서가 SoT).
 159: 
 160: ### 3.4 primitive hex 카탈로그 (DT-02 해소)
 161: 
 162: Tailwind v3 슬레이트·블루·그린·앰버·레드 톤을 base로 채택. 동일 hue 10단계 — 50(가장 밝음) ~ 900(가장 어두움).
 163: 
 164: | hue / step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
 165: |---|---|---|---|---|---|---|---|---|---|---|
 166: | `gray` | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` |
 167: | `blue` | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` |
 168: | `green` | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` |
 169: | `amber` | `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` |
 170: | `red` | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` |
 171: 
 172: 확장 hue(`teal`·`indigo`·`pink` 등)는 preset/instance 시점 도입. 본 v1.0은 위 5개 hue + white·black 카탈로그를 안정 표준으로 둔다.
 173: 
 174: ### 3.2 semantic 색상 (light/dark 분기)
 175: 
 176: | 토큰 | light | dark |
 177: |---|---|---|
 178: | `color.surface.background` | gray.50 | gray.900 |
 179: | `color.surface.elevated` | color.white | gray.800 |
 180: | `color.surface.subtle` | gray.100 | gray.800 |
 181: | `color.text.primary` | gray.900 | gray.50 |
 182: | `color.text.secondary` | gray.600 | gray.300 |
 183: | `color.text.disabled` | gray.400 | gray.500 |
 184: | `color.text.inverse` | color.white | gray.900 |
 185: | `color.border.default` | gray.200 | gray.700 |
 186: | `color.border.subtle` | gray.100 | gray.800 |
 187: | `color.brand.primary` | blue.600 | blue.400 |
 188: | `color.brand.primary.hover` | blue.700 | blue.300 |
 189: | `color.brand.secondary` | gray.700 | gray.300 |
 190: | `color.status.success` | green.600 | green.400 |
 191: | `color.status.success.subtle` | green.50 | green.900 |
 192: | `color.status.warning` | amber.500 | amber.400 |
 193: | `color.status.warning.subtle` | amber.50 | amber.900 |
 194: | `color.status.error` | red.600 | red.400 |
 195: | `color.status.error.subtle` | red.50 | red.900 |
 196: | `color.status.info` | blue.500 | blue.300 |
 197: | `color.status.info.subtle` | blue.50 | blue.900 |
 198: | `color.focus.ring` | blue.500 | blue.300 |
 199: | `color.overlay.modal` | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) |
 200: | `color.overlay.scrim` | rgba(0,0,0,0.3) | rgba(0,0,0,0.5) |
 201: 
 202: > **overlay 예외 규칙**: overlay 그룹의 semantic 토큰은 raw `rgba()` 값을 직접 가질 수 있다 — alpha 채널 표현을 위한 명시 예외. primitive `color.black` + opacity 별도 토큰으로 분리하면 alpha 변형마다 토큰이 늘어 운영 부담 큼. raw rgba는 overlay 그룹(`color.overlay.*`)에서만 허용 (다른 semantic 색상은 primitive alias 의무).
 203: 
 204: ### 3.3 다크모드 활성화
 205: 
 206: - HTML 속성 `data-theme="light" | "dark"`로 분기
 207: - `prefers-color-scheme` 자동 감지 + 사용자 명시 override (localStorage)
 208: - 기본값 — `light`
 209: 
 210: ---
 211: 
 212: ## 4. 타이포그래피
 213: 
 214: ### 4.1 폰트 패밀리 (primitive)
 215: 
 216: 한국어 본문 가독성 우선 — Pretendard를 fallback 체인 앞에 배치.
 217: 
 218: | 토큰 | 값 |
 219: |---|---|
 220: | `font.family.sans` | "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Noto Sans KR", sans-serif |
 221: | `font.family.serif` | "Noto Serif KR", Georgia, serif |
 222: | `font.family.mono` | "JetBrains Mono", "D2Coding", Menlo, Consolas, monospace |
 223: 
 224: ### 4.1.1 웹폰트 로딩 정책
 225: 
 226: - `Pretendard Variable` — `@font-face` 정의 시 `font-display: swap` 의무 (FOIT 회피)
 227: - 한국어 글리프 subset 사용 권장 (전체 가중치 단일 파일 vs 가중치별 분할 — 빌드 도구가 결정. DT-06)
 228: - preload 권장 — `<link rel="preload" as="font" type="font/woff2" crossorigin>`
 229: - 라이선스: Pretendard OFL — 검토 완료. 상용 사용 가능. Noto Sans KR SIL OFL — 검토 완료. 클라이언트 별도 폰트(상용 폰트) 사용 시 Instance override 시점 라이선스 확인 의무
 230: 
 231: ### 4.1.2 letter-spacing 적용 범위
 232: 
 233: - `letter.spacing.tight` (-0.02em) — **영문 헤딩에만 권장** (한국어 본문 적용 시 가독성 저하)
 234: - 한국어 본문은 기본 `letter.spacing.normal` (0) 사용
 235: - 헤딩에 tight 적용 시 사용자 환경에서 한글 자음 충돌 가능 — Preset/Instance 검토
 236: 
 237: ### 4.2 크기 스케일 (primitive)
 238: 
 239: `font.size.12` ~ `font.size.72` (11단계, rem 단위, 1rem = 16px):
 240: 
 241: | 토큰 | rem | px |
 242: |---|---|---|
 243: | `font.size.12` | 0.75 | 12 |
 244: | `font.size.14` | 0.875 | 14 |
 245: | `font.size.16` (base) | 1.0 | 16 |
 246: | `font.size.18` | 1.125 | 18 |
 247: | `font.size.20` | 1.25 | 20 |
 248: | `font.size.24` | 1.5 | 24 |
 249: | `font.size.30` | 1.875 | 30 |
 250: | `font.size.36` | 2.25 | 36 |
 251: | `font.size.48` | 3.0 | 48 |
 252: | `font.size.60` | 3.75 | 60 |
 253: | `font.size.72` | 4.5 | 72 |
 254: 
 255: ### 4.3 가중치·줄간격·자간
 256: 
 257: | 토큰 | 값 |
 258: |---|---|
 259: | `font.weight.regular` | 400 |
 260: | `font.weight.medium` | 500 |
 261: | `font.weight.semibold` | 600 |
 262: | `font.weight.bold` | 700 |
 263: | `line.height.tight` | 1.25 |
 264: | `line.height.normal` | 1.5 |
 265: | `line.height.loose` | 1.75 |
 266: | `letter.spacing.tight` | -0.02em |
 267: | `letter.spacing.normal` | 0 |
 268: | `letter.spacing.wide` | 0.02em |
 269: 
 270: ### 4.4 semantic 타이포 (heading scale)
 271: 
 272: | 토큰 | 용도 | 크기 | 가중치 | 줄간격 |
 273: |---|---|---|---|---|
 274: | `typography.heading.h1` | 페이지 제목 | font.size.36 | semibold | tight |
 275: | `typography.heading.h2` | 섹션 | font.size.30 | semibold | tight |
 276: | `typography.heading.h3` | 서브섹션 | font.size.24 | semibold | normal |
 277: | `typography.heading.h4` | 항목 | font.size.20 | semibold | normal |
 278: | `typography.body.large` | 강조 본문 | font.size.18 | regular | normal |
 279: | `typography.body.default` | 일반 본문 | font.size.16 | regular | normal |
 280: | `typography.body.small` | 보조 텍스트 | font.size.14 | regular | normal |
 281: | `typography.caption` | 캡션·메타 | font.size.12 | regular | normal |
 282: | `typography.code` | 코드 | font.size.14 | regular | normal + font.family.mono |
 283: 
 284: ---
 285: 
 286: ## 5. 간격·레이아웃
 287: 
 288: ### 5.1 spacing scale (primitive)
 289: 
 290: 4px 기반 — `spacing.0` ~ `spacing.64` (13단계):
 291: 
 292: | 토큰 | rem | px |
 293: |---|---|---|
 294: | `spacing.0` | 0 | 0 |
 295: | `spacing.1` | 0.25 | 4 |
 296: | `spacing.2` | 0.5 | 8 |
 297: | `spacing.3` | 0.75 | 12 |
 298: | `spacing.4` | 1.0 | 16 |
 299: | `spacing.6` | 1.5 | 24 |
 300: | `spacing.8` | 2.0 | 32 |
 301: | `spacing.12` | 3.0 | 48 |
 302: | `spacing.16` | 4.0 | 64 |
 303: | `spacing.24` | 6.0 | 96 |
 304: | `spacing.32` | 8.0 | 128 |
 305: | `spacing.48` | 12.0 | 192 |
 306: | `spacing.64` | 16.0 | 256 |
 307: 
 308: ### 5.2 breakpoints (primitive)
 309: 
 310: | 토큰 | 값 | 의미 |
 311: |---|---|---|
 312: | `breakpoint.sm` | 640px | 모바일 large |
 313: | `breakpoint.md` | 768px | 태블릿 |
 314: | `breakpoint.lg` | 1024px | 데스크탑 |
 315: | `breakpoint.xl` | 1280px | 데스크탑 large |
 316: | `breakpoint.2xl` | 1536px | 와이드 |
 317: 
 318: ### 5.3 컨테이너·그리드 (semantic)
 319: 
 320: | 토큰 | 값 |
 321: |---|---|
 322: | `container.max-width` | breakpoint.xl (`1280px`) |
 323: | `container.padding.mobile` | spacing.4 |
 324: | `container.padding.desktop` | spacing.8 |
 325: | `grid.columns` | 12 (raw integer — 비-색상 semantic) |
 326: | `grid.gap.mobile` | spacing.4 |
 327: | `grid.gap.desktop` | spacing.6 |
 328: 
 329: ---
 330: 
 331: ## 6. 라운드·그림자·테두리
 332: 
 333: ### 6.1 radius (primitive)
 334: 
 335: | 토큰 | 값 |
 336: |---|---|
 337: | `radius.0` | 0 |
 338: | `radius.sm` | 4px |
 339: | `radius.md` | 8px |
 340: | `radius.lg` | 12px |
 341: | `radius.xl` | 16px |
 342: | `radius.full` | 9999px |
 343: 
 344: ### 6.2 shadow (semantic — theme-aware)
 345: 
 346: primitive가 아닌 **semantic 단계**에서 정의 (theme 분기) — primitive theme 무관 원칙 보호.
 347: 
 348: | 토큰 | light | dark (opacity 상향 — DT-04 해소) |
 349: |---|---|---|
 350: | `shadow.sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.30)` |
 351: | `shadow.md` | `0 4px 8px rgba(0,0,0,0.08)` | `0 4px 8px rgba(0,0,0,0.35)` |
 352: | `shadow.lg` | `0 8px 16px rgba(0,0,0,0.12)` | `0 8px 16px rgba(0,0,0,0.40)` |
 353: | `shadow.xl` | `0 16px 32px rgba(0,0,0,0.16)` | `0 16px 32px rgba(0,0,0,0.45)` |
 354: 
 355: #### 6.2.1 DTCG structured 형식 (Style Dictionary 입력)
 356: 
 357: tokens.json에서는 DTCG shadow 객체 모델로 저장 — 빌드 시 CSS box-shadow 문자열로 변환.
 358: 
 359: ```json
 360: {
 361:   "shadow": {
 362:     "sm": {
 363:       "value": {
 364:         "offsetX": "0",
 365:         "offsetY": "1px",
 366:         "blur": "2px",
 367:         "spread": "0",
 368:         "color": "rgba(0, 0, 0, 0.05)"
 369:       },
 370:       "type": "shadow"
 371:     }
 372:   }
 373: }
 374: ```
 375: 
 376: - 복합 그림자(2개 이상 layer)는 `value`를 배열로 허용
 377: - Style Dictionary transformer가 객체 → CSS 문자열로 변환 (`shadow/css` transform 사용)
 378: - 본 문서의 § 6.2 표는 변환 후 CSS 문자열 형태로 표기 — tokens.json 원본은 객체
 379: 
 380: ### 6.3 border-width (primitive)
 381: 
 382: | 토큰 | 값 |
 383: |---|---|
 384: | `border.width.thin` | 1px |
 385: | `border.width.medium` | 2px |
 386: | `border.width.thick` | 4px |
 387: 
 388: ---
 389: 
 390: ## 7. 모션
 391: 
 392: ### 7.1 duration (primitive)
 393: 
 394: | 토큰 | 값 |
 395: |---|---|
 396: | `duration.fast` | 150ms |
 397: | `duration.normal` | 250ms |
 398: | `duration.slow` | 400ms |
 399: 
 400: ### 7.2 easing (primitive)
 401: 
 402: | 토큰 | 값 |
 403: |---|---|
 404: | `easing.linear` | linear |
 405: | `easing.in` | cubic-bezier(0.4, 0, 1, 1) |
 406: | `easing.out` | cubic-bezier(0, 0, 0.2, 1) |
 407: | `easing.in-out` | cubic-bezier(0.4, 0, 0.2, 1) |
 408: 
 409: ### 7.3 reduced-motion
 410: 
 411: `@media (prefers-reduced-motion: reduce)` 적용 시:
 412: - 모든 transition duration → 0ms
 413: - animation 일괄 비활성화 (또는 fade-in만 유지)
 414: 
 415: ---
 416: 
 417: ## 8. 컴포넌트 토큰
 418: 
 419: ### 8.1 button
 420: 
 421: | 토큰 | 값 (semantic) |
 422: |---|---|
 423: | `button.primary.background` | color.brand.primary |
 424: | `button.primary.text` | color.text.inverse |
 425: | `button.primary.hover.background` | color.brand.primary.hover |
 426: | `button.secondary.background` | color.surface.subtle |
 427: | `button.secondary.text` | color.text.primary |
 428: | `button.padding.sm` | spacing.2 spacing.3 |
 429: | `button.padding.md` | spacing.3 spacing.4 |
 430: | `button.padding.lg` | spacing.4 spacing.6 |
 431: | `button.radius` | radius.md |
 432: | `button.font.size` | font.size.14 |
 433: | `button.font.weight` | font.weight.medium |
 434: 
 435: ### 8.2 card
 436: 
 437: | 토큰 | 값 |
 438: |---|---|
 439: | `card.background` | color.surface.elevated |
 440: | `card.border` | color.border.subtle |
 441: | `card.radius` | radius.lg |
 442: | `card.padding` | spacing.6 |
 443: | `card.shadow` | shadow.md |
 444: 
 445: ### 8.3 input
 446: 
 447: | 토큰 | 값 |
 448: |---|---|
 449: | `input.background` | color.surface.elevated |
 450: | `input.border` | color.border.default |
 451: | `input.border.focus` | color.focus.ring |
 452: | `input.text` | color.text.primary |
 453: | `input.placeholder` | color.text.secondary |
 454: | `input.radius` | radius.md |
 455: | `input.padding` | spacing.3 spacing.4 |
 456: | `input.font.size` | font.size.16 |
 457: 
 458: ### 8.4 callout (CONTENT_STANDARDS § 3.4 정합)
 459: 
 460: | 토큰 | 용도 |
 461: |---|---|
 462: | `callout.info.background` | color.status.info.subtle |
 463: | `callout.info.border` | color.status.info |
 464: | `callout.info.icon.color` | color.status.info |
 465: | `callout.warning.background` | color.status.warning.subtle |
 466: | `callout.warning.border` | color.status.warning |
 467: | `callout.warning.icon.color` | color.status.warning |
 468: | `callout.disclaimer.background` | color.surface.subtle |
 469: | `callout.disclaimer.border` | color.border.default |
 470: | `callout.disclaimer.text` | color.text.secondary |
 471: | `callout.radius` | radius.md |
 472: | `callout.padding` | spacing.4 |
 473: 
 474: ### 8.5 badge·tag
 475: 
 476: | 토큰 | 값 |
 477: |---|---|
 478: | `badge.background` | color.surface.subtle |
 479: | `badge.text` | color.text.primary |
 480: | `badge.font.size` | font.size.12 |
 481: | `badge.padding` | spacing.1 spacing.2 |
 482: | `badge.radius` | radius.sm |
 483: 
 484: ### 8.6 link
 485: 
 486: | 토큰 | 값 |
 487: |---|---|
 488: | `link.text` | color.brand.primary |
 489: | `link.text.hover` | color.brand.primary.hover |
 490: | `link.underline.offset` | 0.2em |
 491: 
 492: ### 8.7 table (P-102 가격표·진료시간 표 등)
 493: 
 494: | 토큰 | 값 |
 495: |---|---|
 496: | `table.background` | color.surface.elevated |
 497: | `table.header.background` | color.surface.subtle |
 498: | `table.header.text` | color.text.primary |
 499: | `table.row.background.alt` | color.surface.subtle |
 500: | `table.border` | color.border.default |
 501: | `table.cell.padding` | spacing.3 spacing.4 |
 502: | `table.font.size` | font.size.14 |
 503: 
 504: ### 8.8 accordion·FAQ (P-011·Q&A 블록)
 505: 
 506: | 토큰 | 값 |
 507: |---|---|
 508: | `accordion.item.background` | color.surface.elevated |
 509: | `accordion.item.border` | color.border.default |
 510: | `accordion.trigger.padding` | spacing.4 |
 511: | `accordion.trigger.font.weight` | font.weight.semibold |
 512: | `accordion.content.padding` | spacing.4 |
 513: | `accordion.icon.color` | color.text.secondary |
 514: 
 515: ### 8.9 tabs·filter
 516: 
 517: | 토큰 | 값 |
 518: |---|---|
 519: | `tabs.background` | color.surface.background |
 520: | `tabs.trigger.text` | color.text.secondary |
 521: | `tabs.trigger.text.active` | color.text.primary |
 522: | `tabs.trigger.border.active` | color.brand.primary |
 523: | `tabs.trigger.padding` | spacing.2 spacing.4 |
 524: 
 525: ### 8.10 nav·header·footer
 526: 
 527: | 토큰 | 값 |
 528: |---|---|
 529: | `nav.background` | color.surface.background |
 530: | `nav.border.bottom` | color.border.subtle |
 531: | `nav.link.text` | color.text.primary |
 532: | `nav.link.text.hover` | color.brand.primary |
 533: | `nav.height` | spacing.16 (64px) |
 534: | `footer.background` | color.surface.subtle |
 535: | `footer.text` | color.text.secondary |
 536: | `footer.padding` | spacing.12 spacing.6 |
 537: 
 538: ### 8.11 modal·toast
 539: 
 540: | 토큰 | 값 |
 541: |---|---|
 542: | `modal.background` | color.surface.elevated |
 543: | `modal.overlay` | color.overlay.modal |
 544: | `modal.radius` | radius.lg |
 545: | `modal.padding` | spacing.6 |
 546: | `modal.shadow` | shadow.xl |
 547: | `toast.background.info` | color.status.info.subtle |
 548: | `toast.background.success` | color.status.success.subtle |
 549: | `toast.background.warning` | color.status.warning.subtle |
 550: | `toast.background.error` | color.status.error.subtle |
 551: | `toast.radius` | radius.md |
 552: | `toast.padding` | spacing.3 spacing.4 |
 553: | `toast.shadow` | shadow.lg |
 554: 
 555: ### 8.12 avatar·breadcrumb
 556: 
 557: | 토큰 | 값 |
 558: |---|---|
 559: | `avatar.background` | color.surface.subtle |
 560: | `avatar.text` | color.text.secondary |
 561: | `avatar.size.sm` | spacing.8 (32px) |
 562: | `avatar.size.md` | spacing.12 (48px) |
 563: | `avatar.size.lg` | spacing.16 (64px) |
 564: | `avatar.radius` | radius.full |
 565: | `breadcrumb.text` | color.text.secondary |
 566: | `breadcrumb.text.current` | color.text.primary |
 567: | `breadcrumb.separator.color` | color.text.disabled |
 568: | `breadcrumb.font.size` | font.size.14 |
 569: 
 570: ### 8.13 CTA cluster (P-001 Home·P-006 Treatment Detail 등)
 571: 
 572: 여러 CTA 채널(`CTAConfig`)을 묶어 노출하는 영역.
 573: 
 574: | 토큰 | 값 |
 575: |---|---|
 576: | `cta-cluster.background` | color.brand.primary |
 577: | `cta-cluster.text` | color.text.inverse |
 578: | `cta-cluster.radius` | radius.lg |
 579: | `cta-cluster.padding` | spacing.6 spacing.8 |
 580: | `cta-cluster.gap` | spacing.4 |
 581: 
 582: ### 8.14 timeline·map·embed
 583: 
 584: | 토큰 | 값 |
 585: |---|---|
 586: | `timeline.line.color` | color.border.default |
 587: | `timeline.node.color` | color.brand.primary |
 588: | `timeline.node.size` | spacing.3 (12px) |
 589: | `timeline.item.padding` | spacing.4 0 |
 590: | `map.background` | color.surface.subtle |
 591: | `map.border` | color.border.default |
 592: | `map.radius` | radius.md |
 593: | `embed.background` | color.surface.subtle |
 594: | `embed.aspect.video` | 16/9 |
 595: | `embed.aspect.square` | 1/1 |
 596: 
 597: ---
 598: 
 599: ## 9. 출력 형식
 600: 
 601: ### 9.1 CSS Custom Properties
 602: 
 603: ```css
 604: :root {
 605:   /* primitive */
 606:   --color-gray-50: #f9fafb;
 607:   --color-blue-600: #2563eb;
 608:   --spacing-4: 1rem;
 609:   /* semantic */
 610:   --color-surface-background: var(--color-gray-50);
 611:   --color-text-primary: var(--color-gray-900);
 612:   --color-brand-primary: var(--color-blue-600);
 613:   /* component */
 614:   --button-primary-background: var(--color-brand-primary);
 615: }
 616: 
 617: [data-theme="dark"] {
 618:   --color-surface-background: var(--color-gray-900);
 619:   --color-text-primary: var(--color-gray-50);
 620: }
 621: ```
 622: 
 623: 명명 규칙: 토큰 ID의 `.`을 `-`로 치환, kebab-case + `--` prefix.
 624: 
 625: ### 9.2 tokens.json (Style Dictionary 표준 포맷)
 626: 
 627: **파일 구조** — Style Dictionary v3+ token set 방식:
 628: 
 629: ```
 630: data/design-tokens/
 631: ├── primitive.tokens.json       # primitive (테마 무관)
 632: ├── semantic.light.tokens.json  # semantic — light 테마
 633: ├── semantic.dark.tokens.json   # semantic — dark 테마
 634: └── component.tokens.json       # component (테마 무관, semantic 참조)
 635: ```
 636: 
 637: **primitive.tokens.json 예시**:
 638: 
 639: ```json
 640: {
 641:   "color": {
 642:     "white": { "value": "#ffffff", "type": "color" },
 643:     "gray": {
 644:       "50": { "value": "#f9fafb", "type": "color" },
 645:       "900": { "value": "#111827", "type": "color" }
 646:     },
 647:     "blue": {
 648:       "600": { "value": "#2563eb", "type": "color" }
 649:     }
 650:   },
 651:   "spacing": {
 652:     "4": { "value": "1rem", "type": "dimension" }
 653:   }
 654: }
 655: ```
 656: 
 657: **semantic.light.tokens.json 예시**:
 658: 
 659: ```json
 660: {
 661:   "color": {
 662:     "surface": {
 663:       "background": { "value": "{color.gray.50}", "type": "color" },
 664:       "elevated":   { "value": "{color.white}", "type": "color" }
 665:     },
 666:     "brand": {
 667:       "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
 668:     }
 669:   }
 670: }
 671: ```
 672: 
 673: **component.tokens.json 예시**:
 674: 
 675: ```json
 676: {
 677:   "button": {
 678:     "primary": {
 679:       "background": { "value": "{color.brand.primary}", "type": "color" },
 680:       "text":       { "value": "{color.text.inverse}", "type": "color" },
 681:       "radius":     { "value": "{radius.md}", "type": "dimension" },
 682:       "padding":    { "value": "{spacing.3} {spacing.4}", "type": "dimension" }
 683:     }
 684:   }
 685: }
 686: ```
 687: 
 688: **Style Dictionary 변환 규칙**:
 689: - 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
 690: - alias — `{ ... }` 구문, 빌드 시 resolve
 691: - `type` 필드 — Style Dictionary v3+ 표준 (`value`·`type` 표기, **DTCG draft의 `$value`·`$type`는 미채택**). 타입 값은 DTCG 카테고리 호환 (color·dimension·fontFamily·fontWeight·duration·cubicBezier·shadow 등)
 692: - theme 분기 — light/dark용 semantic 파일 별도. 빌드 시 token set으로 결합 (`StyleDictionary.config({ source: [primitive, semantic.light, component] })`)
 693: 
 694: ### 9.3 빌드 결과
 695: 
 696: | 파일 | 내용 |
 697: |---|---|
 698: | `dist/tokens/light.css` | light 테마 CSS Custom Properties (:root) |
 699: | `dist/tokens/dark.css` | dark 테마 ([data-theme="dark"]) |
 700: | `dist/tokens/all.css` | 두 테마 통합 |
 701: | `dist/tokens/light.json` | light 테마 평면화 JSON |
 702: | `dist/tokens/dark.json` | dark 테마 평면화 JSON |
 703: 
 704: ---
 705: 
 706: ## 9.4 DATA_MODEL C-07 BrandTokens 매핑
 707: 
 708: DATA_MODEL의 C-07 `BrandTokens`는 어드민·인스턴스 단위 브랜드 최종값. 본 문서의 토큰 카탈로그와 다음과 같이 매핑:
 709: 
 710: | `BrandTokens` 필드 | 본 문서 토큰 매핑 |
 711: |---|---|
 712: | `personaMode` | preset selector — DATA_MODEL C-07 enum (`Premium`·`Wellness`·`Professional`·`Friendly`)을 kebab-case로 변환한 디렉터리 명. `Premium` → `presets/premium/`, `Wellness` → `presets/wellness/` 등. 정규화 규칙: PascalCase → 첫 글자만 소문자(현 enum 값은 1단어이므로 단순 lowercase로 충분) |
 713: | `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
 714: | `typography` | § 4.4 semantic 타이포 (typography.heading.h1 등) |
 715: | `spacing` (`tight \| standard \| spacious`) | preset 단위 **primitive `spacing.*` scale 배수 override** — `tight` 0.85·`standard` 1.0(기본)·`spacious` 1.25. 모든 primitive spacing 값에 일괄 적용되므로 **MAJOR 변경**(§ 1.1·§ 10.2 정합)으로 취급. 개별 컴포넌트 padding만 바꾸는 것이 아니라 spacing scale 전체 |
 716: | `radius` | § 6.1 primitive radius scale |
 717: | `shadow` | § 6.2 shadow semantic (theme별 분기) |
 718: | `layoutVariants` | preset/instance가 페이지 타입별 layout 변형 선택 (별도 문서) |
 719: | `componentVariants` | preset/instance가 § 8 컴포넌트 토큰 set 선택 |
 720: 
 721: ### 9.4.0 BrandTokens 세부 타입 정의
 722: 
 723: DATA_MODEL C-07이 위임한 세부 타입은 본 문서가 SoT — 평면화 키 집합 + 필수/선택:
 724: 
 725: ```ts
 726: // 단일 테마 색상 평면화 — § 3.2 semantic 색상 전체 round-trip
 727: type ColorTokens = {
 728:   // brand
 729:   primary: string;
 730:   primary_hover: string;
 731:   secondary: string;
 732:   // surface
 733:   surface_background: string;
 734:   surface_elevated: string;
 735:   surface_subtle: string;
 736:   // text
 737:   text_primary: string;
 738:   text_secondary: string;
 739:   text_disabled: string;
 740:   text_inverse: string;
 741:   // border
 742:   border_default: string;
 743:   border_subtle: string;
 744:   // focus
 745:   focus_ring: string;
 746:   // status
 747:   status_success: string;
 748:   status_success_subtle: string;
 749:   status_warning: string;
 750:   status_warning_subtle: string;
 751:   status_error: string;
 752:   status_error_subtle: string;
 753:   status_info: string;
 754:   status_info_subtle: string;
 755:   // overlay (raw rgba — § 3.2 overlay 예외)
 756:   overlay_modal: string;
 757:   overlay_scrim: string;
 758: };
 759: 
 760: // BrandTokens.colors는 light·dark 두 ColorTokens 분리 구조
 761: type BrandTokensColors = {
 762:   light: ColorTokens;
 763:   dark: ColorTokens;
 764: };
 765: 
 766: // 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
 767: 
 768: type TypographyTokens = {
 769:   font_family_sans: string;   // CSS font-family 문자열 전체 (required)
 770:   font_family_serif?: string;
 771:   font_family_mono?: string;
 772:   // 각 heading·body 스타일은 평면화 키로 — 예: heading_h1_size·heading_h1_weight·heading_h1_line_height
 773:   // 모든 § 4.4 semantic typography 토큰 평면화 (required)
 774: };
 775: 
 776: type RadiusScale = {
 777:   none: string;  // "0" 또는 "0px" — § 6.1 `radius.0` round-trip
 778:   sm: string;    // § 6.1 primitive 값
 779:   md: string;
 780:   lg: string;
 781:   xl: string;
 782:   full: string;
 783: };
 784: 
 785: // DTCG shadow 객체 — § 6.2.1 structured 모델
 786: type ShadowValue = {
 787:   offsetX: string;
 788:   offsetY: string;
 789:   blur: string;
 790:   spread: string;
 791:   color: string;
 792: };
 793: 
 794: type ShadowTokens = {
 795:   sm: ShadowValue;
 796:   md: ShadowValue;
 797:   lg: ShadowValue;
 798:   xl: ShadowValue;
 799: };
 800: 
 801: // BrandTokens.shadow도 light·dark 양층 구조 (colors와 동일 패턴)
 802: type ShadowScale = {
 803:   light: ShadowTokens;
 804:   dark: ShadowTokens;
 805: };
 806: ```
 807: 
 808: - **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
 809: - **required vs optional**: 위 표의 required는 모든 인스턴스가 제공해야 함. optional은 미제공 시 Core 기본값 사용
 810: 
 811: ### 9.4.1 theme-color 메타 (SEARCH_STANDARDIZATION 정합)
 812: 
 813: 빌드 시 light·dark 두 meta 모두 출력:
 814: 
 815: - **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
 816: - **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
 817: 
 818: 미디어 쿼리 미지정 meta가 light 기본값을 의미. 양 theme 모두 출력 의무 — **한쪽만 출력 시 fail** (`SEARCH_STANDARDIZATION.md` § 2.1 Allowed 의무와 정합).
 819: 
 820: ## 10. Preset·Instance Override
 821: 
 822: ### 10.1 Override 흐름
 823: 
 824: ```
 825: Core (data/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
 826:    ↓ merge (deep, 4-file 각각 별도)
 827: Preset (presets/<presetSlug>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
 828:    ↓ merge (deep)
 829: Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
 830:    ↓ build (Style Dictionary)
 831: dist/tokens/<theme>.css·json
 832: ```
 833: 
 834: - Preset·Instance는 4파일 모두 제공할 필요 없음 — override할 파일만 작성 (없는 파일은 머지 단계에서 무시)
 835: - 머지는 파일 단위가 아니라 토큰 ID 단위 (§ 10.3 알고리즘)
 836: 
 837: ### 10.2 Override 규칙
 838: 
 839: - Preset·Instance는 **semantic 또는 component 토큰**만 override 권장
 840: - primitive 직접 override는 가능하나 **MAJOR 변경**으로 취급
 841: - **신규 토큰 추가 정책**:
 842:   - Core에 없는 component 토큰을 Preset/Instance가 신설 → warning (Core 컴포넌트 계약 안정성 보호 — 일반 컴포넌트 토큰은 Core 신설 권장)
 843:   - Core에 없는 semantic 토큰을 Preset/Instance가 신설 → warning
 844:   - 단, **preset/instance 전용 토큰**은 합법 — **`private.*` 네임스페이스** 사용. semantic·component 양쪽 layer 모두 허용 (예: `private.hanui-card.background` 컴포넌트, `private.color.brand.tertiary` semantic). 표기 변환: tokens.json은 dot 객체 hierarchy, CSS 변수명은 dot을 `-`로 치환 + `--` prefix (예: `private.hanui-card.background` → `--private-hanui-card-background`). warning 면제
 845: - 토큰 삭제 불가 (Core 토큰의 값만 override)
 846: 
 847: ### 10.3 머지 알고리즘
 848: 
 849: 1. **순서**: Core → Preset → Instance (3-step)
 850: 2. **타입별 머지**:
 851:    - 스칼라 (color hex·spacing rem·radius px) — 후순위 값으로 교체
 852:    - 객체 (`color.surface.*` 그룹) — deep merge (key 별 재귀)
 853:    - 배열 (`font.family.sans` fallback 체인) — 전체 교체 (union 아님)
 854: 3. **theme별 머지**: light·dark token set은 각각 독립 머지. 한쪽만 override 시 다른 쪽 영향 없음
 855: 4. **alias 재해석 순서**: 머지 완료 후 alias resolve (한 번에). 중간 단계의 alias resolve 금지
 856: 5. **unknown key 처리**:
 857:    - Core에 존재하지 않는 토큰 path 발견 시 — § 10.2 신규 추가 정책 적용
 858:    - `private.*` 네임스페이스 외의 신규 component/semantic 토큰 → warning
 859:    - `private.*` 네임스페이스 시 warning 면제
 860: 6. **접근성 재검증**: 머지·alias resolve 완료 후 § 11 접근성 검증 자동 재실행. Preset/Instance가 brand 색상 변경 후 본문 텍스트 대비가 WCAG AA 미충족 시 fail
 861: 7. **순환 참조 검출**: alias resolve 시 DAG 위반 발견 시 fail
 862: 
 863: ---
 864: 
 865: ## 11. 접근성 (WCAG 2.1 AA)
 866: 
 867: ### 11.1 명도 대비 기준
 868: 
 869: | 항목 | 기준 |
 870: |---|---|
 871: | 본문 텍스트 | 4.5:1 |
 872: | 대형 텍스트 (18px+ 또는 14px+ bold) | 3:1 |
 873: | UI 구성 요소 (버튼·테두리·포커스 링) | 3:1 |
 874: | 비활성 텍스트 | 권장 (기준 없음) |
 875: 
 876: ### 11.2 자동 검증 색상 쌍 카탈로그
 877: 
 878: 빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
 879: 
 880: | 쌍 | 전경 / 배경 | 기준 |
 881: |---|---|---|
 882: | 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
 883: | 본문 텍스트 — elevated | `color.text.primary` / `color.surface.elevated` | 4.5:1 |
 884: | 본문 텍스트 — subtle | `color.text.primary` / `color.surface.subtle` | 4.5:1 |
 885: | 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
 886: | 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
 887: | 버튼 primary 텍스트 | `button.primary.text` / `button.primary.background` | 4.5:1 |
 888: | 버튼 secondary 텍스트 | `button.secondary.text` / `button.secondary.background` | 4.5:1 |
 889: | 링크 | `link.text` / `color.surface.background` | 4.5:1 |
 890: | 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
 891: | 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
 892: | 콜아웃 info 텍스트 | `color.text.primary` / `callout.info.background` | 4.5:1 |
 893: | 콜아웃 warning 텍스트 | `color.text.primary` / `callout.warning.background` | 4.5:1 |
 894: | 콜아웃 disclaimer 텍스트 | `color.text.secondary` / `callout.disclaimer.background` | 4.5:1 |
 895: | 입력 placeholder | `input.placeholder` / `input.background` | 3:1 (UI 구성 요소 기준) |
 896: | 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |
 897: 
 898: 위 15개 쌍 × 2테마 = **30개 검증** 각 빌드 자동. 1개라도 미충족 시 fail.
 899: 
 900: > ⚠️ `color.border.default`처럼 시각 분리 목적의 일반 border는 WCAG 2.1 의 1.4.11(Non-text Contrast) 비대상 — 검증 카탈로그에서 제외. focus ring·input.border.focus 등 의미 boundary만 검증.
 901: 
 902: ### 11.3 포커스 표시
 903: 
 904: - 모든 인터랙티브 요소는 `:focus-visible` 시 `color.focus.ring` 표시
 905: - outline 또는 box-shadow 사용 (outline-offset 권장)
 906: - 포커스 표시 제거 금지 (`outline: none` 단독 사용 금지)
 907: 
 908: ### 11.4 reduced-motion
 909: 
 910: § 7.3 적용 — 사용자 prefers-reduced-motion 존중
 911: 
 912: ---
 913: 
 914: ## 12. 빌드 검증 — 룰 레벨
 915: 
 916: | 레벨 | 본 문서 영역 |
 917: |---|---|
 918: | **fail** | 토큰 미정의(체인 단절), 순환 참조, **색상·shadow component에서 primitive 직접 참조** (§ 2.4 — typography·spacing·radius·motion은 허용), **`color.overlay.*` 외 semantic 색상이 raw hex·rgb·hsl 값을 보유** (semantic 색상은 primitive alias 의무, overlay 그룹만 예외 — § 3.2), 접근성 명도 대비 위반(본문 4.5:1·UI 3:1), 출력 파일 생성 실패 |
 919: | **warning** | semantic 미사용(고아 토큰), Preset/Instance override가 Core에 없는 토큰 신설(MAJOR 의도일 수 있음 — 경고만), reduced-motion 미구현 |
 920: | **content-gate** | (본 문서 영역 직접 적용 없음 — 시각 검수는 별도 디자인 리뷰) |
 921: 
 922: ---
 923: 
 924: ## 13. 미결정 사항
 925: 
 926: | ID | 항목 | 비고 |
 927: |---|---|---|
 928: | DT-01 | Style Dictionary vs 자체 빌드 도구 선택 | UI 구현 진입 시 — § 9.2 표준 포맷 Style Dictionary v3+ 채택 권장 |
 929: | DT-03 | 컴포넌트별 size 변형(sm/md/lg) 토큰 — button 외 input·card 등에도 일관 적용 | input·card는 § 8에 단일 size만 정의. M2+ 다중 size 도입 시 |
 930: | DT-05 | preset/instance tokens.json의 schema 검증 — JSON Schema 정의 | 자체 빌드 도구 구현 시 |
 931: | DT-06 | Pretendard 한국어 글리프 subset 전략 — 전체 가중치 단일 파일 vs 분할 | 폰트 빌드 도구 결정 |
 932: 
 933: ### 13.1 해소된 미결정
 934: 
 935: | ID | 항목 | 해소 |
 936: |---|---|---|
 937: | ~~DT-02~~ | primitive 색상 hex 값 카탈로그 | v0.2 — § 3.4 표 (gray·blue·green·amber·red 5 hue × 10 단계 + white·black 절대값) |
 938: | ~~DT-04~~ | 다크모드 그림자 opacity 값 | v0.2 — § 6.2 shadow를 semantic theme-aware로 이동, light·dark 두 값 명시 |
 939: | ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |
 940: 
 941: ---
 942: 
 943: ## 14. 변경 이력
 944: 
 945: | 일자 | 버전 | 변경 |
 946: |---|---|---|
 947: | 2026-05-14 | v0.1 | 최초 작성 — 3-tier 토큰 구조(primitive·semantic·component), 3-레이어 override(Core·Preset·Instance), 색상 팔레트 + 다크모드 분기, 타이포(Pretendard 기반)·간격·라운드·그림자·모션, 컴포넌트 토큰 6종(button·card·input·callout·badge·link), 출력 형식 2종(CSS·JSON), 접근성 WCAG AA, 빌드 검증 룰 |
 948: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
 949: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
 950: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
 951: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
 952: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |

 succeeded in 1189ms:
   1: # Core — 데이터 계약 명세
   2: 
   3: > **상태**: Draft v0.24
   4: > **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
   5: > **소유자**: Glitzy
   6: > **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
   7: > **연관 문서**:
   8: > - 페이지 타입 → `core/PAGE_TYPES.md`
   9: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
  10: > - 위험도 → `compliance/RISK_LEVELS.md`
  11: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
  12: > - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
  13: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
  14: 
  15: ---
  16: 
  17: ## 0. 한 페이지 요약
  18: 
  19: - **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
  20: - v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
  21: - 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
  22: - 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
  23: - **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
  24: - **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
  25: - v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).
  26: 
  27: ---
  28: 
  29: ## 1. 계약 인벤토리
  30: 
  31: ### 1.1 데이터 계약 (23개)
  32: 
  33: | ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
  34: |---|---|---|:---:|:---:|:---:|---|
  35: | C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
  36: | C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
  37: | C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
  38: | C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
  39: | C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
  40: | C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
  41: | C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
  42: | C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
  43: | C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
  44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
  45: | C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
  46: | C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
  47: | C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
  48: | C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
  49: | C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
  50: | C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
  51: | C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
  52: | C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
  53: | C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
  54: | C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
  55: | C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
  56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
  57: | C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
  58: 
  59: ### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
  60: 
  61: | ID | 공통 타입 | 책임 | 소속 | 사용처 |
  62: |---|---|---|:---:|---|
  63: | CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
  64: | CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
  65: | CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
  66: 
  67: ---
  68: 
  69: ## 2. 공통 룰
  70: 
  71: ### 2.1 타입 표기법
  72: 
  73: | 표기 | 의미 |
  74: |---|---|
  75: | `string`/`number`/`boolean` | 기본 |
  76: | `Date` | ISO 8601 |
  77: | `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
  78: | `Markdown` | Markdown 본문 |
  79: | `T[]` | 배열 |
  80: | `T \| U` | 합 타입 |
  81: | `enum {A, B, C}` | 열거형 |
  82: | `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
  83: | `?` (필드 뒤) | optional |
  84: 
  85: ### 2.2 공통 메타 필드 (모든 계약)
  86: 
  87: | 필드 | 타입 | required | 설명 |
  88: |---|---|:---:|---|
  89: | `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
  90: | `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
  91: | `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
  92: | `@version` | `number` | optional | 계약 스키마 버전 |
  93: | `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |
  94: 
  95: ### 2.3 식별자(`@id`) 규약
  96: - 인스턴스 내 유일, slug 형식, 3~64자.
  97: - 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).
  98: 
  99: ### 2.4 다국어
 100: - M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.
 101: 
 102: ### 2.5 SoT 원칙 (v0.4 명시)
 103: - **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
 104: - **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
 105: - ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
 106: 
 107: ### 2.6 변경 정책
 108: 
 109: | 변경 종류 | 분류 |
 110: |---|---|
 111: | optional 필드 추가 | MINOR |
 112: | required 필드 추가 | **MAJOR** |
 113: | 필드 타입 변경 (호환) | MINOR |
 114: | 필드 타입 변경 (비호환) | **MAJOR** |
 115: | 필드 제거 | **MAJOR** |
 116: | validation 강화 | 케이스별 |
 117: | validation 완화 | PATCH |
 118: | enum 값 추가 | MINOR |
 119: | enum 값 제거 | **MAJOR** |
 120: | 기본값 변경 | 케이스별 |
 121: 
 122: > 상위 `release/VERSIONING_POLICY.md` 참조.
 123: 
 124: ---
 125: 
 126: ## 3. 공통 타입 풀명세
 127: 
 128: ### CT-01. `TrustMetric` — 신뢰도·통계 지표
 129: 
 130: **목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.
 131: 
 132: | 필드 | 타입 | required | 설명 |
 133: |---|---|:---:|---|
 134: | `@id` | `Slug` | ✅ | 지표 식별자 |
 135: | `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
 136: | `value` | `number \| string` | ✅ | 값 |
 137: | `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
 138: | `measuredFrom` | `Date` | optional | 측정 시작일 |
 139: | `measuredTo` | `Date` | optional | 측정 종료일 |
 140: | `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
 141: | `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
 142: | `evidenceNote` | `string` | optional | 증빙 설명 |
 143: | `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
 144: | `displayFormat` | `string` | optional | 노출 형식 템플릿 |
 145: 
 146: **컴플라이언스 룰**:
 147: - `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
 148: - 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
 149: - 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").
 150: 
 151: ### CT-02. `BusinessHours` — 진료시간·접수시간·휴진
 152: 
 153: **목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.
 154: 
 155: | 필드 | 타입 | required | 설명 |
 156: |---|---|:---:|---|
 157: | `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
 158: | `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
 159: | `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
 160: | `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
 161: | `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
 162: | `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |
 163: 
 164: **하위 타입**:
 165: 
 166: #### `OpeningHoursSpec`
 167: | 필드 | 타입 | required | 설명 |
 168: |---|---|:---:|---|
 169: | `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
 170: | `opens` | `string` | ✅ | `"HH:mm"` |
 171: | `closes` | `string` | ✅ | `"HH:mm"` |
 172: | `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
 173: | `note` | `string` | optional | |
 174: 
 175: #### `LunchBreak`
 176: | 필드 | 타입 | required | 설명 |
 177: |---|---|:---:|---|
 178: | `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
 179: | `from` | `string` | ✅ | |
 180: | `to` | `string` | ✅ | |
 181: 
 182: #### `SpecialClosure`
 183: | 필드 | 타입 | required | 설명 |
 184: |---|---|:---:|---|
 185: | `date` | `Date` | ✅ | |
 186: | `reason` | `string` | optional | |
 187: | `note` | `string` | optional | |
 188: 
 189: ### CT-03. `CTAConfig` — 전환 채널 설정
 190: 
 191: **목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.
 192: 
 193: | 필드 | 타입 | required | 설명 |
 194: |---|---|:---:|---|
 195: | `@id` | `Slug` | ✅ | 채널 식별자 |
 196: | `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
 197: | `label` | `string` | ✅ | 버튼·링크 텍스트 |
 198: | `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
 199: | `iconKey` | `string` | optional | 아이콘 식별자 |
 200: | `style` | `enum {primary, secondary, minimal}` | optional | |
 201: | `displayOrder` | `number` | optional | 정렬 |
 202: | `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
 203: | `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
 204: | `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
 205: | `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |
 206: 
 207: > v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
 208: 
 209: ---
 210: 
 211: ## 4. 데이터 계약 풀명세 (M0 핵심)
 212: 
 213: ### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)
 214: 
 215: **v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
 216: 
 217: | 필드 | 타입 | required | 설명 |
 218: |---|---|:---:|---|
 219: | `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
 220: | `name` | `string` | ✅ | 정식 명칭 (1~100자) |
 221: | `alternateName` | `string` | optional | 영문명 |
 222: | `legalEntityName` | `string` | optional | 법인 정식 명칭 |
 223: | `slogan` | `string` | optional | 한 줄 가치 |
 224: | `description` | `string` | ✅ | 80~300자 |
 225: | `longDescription` | `Markdown` | optional | About 본문 |
 226: | `foundingDate` | `Date` | optional | 설립일 |
 227: | `founder` | `string` | optional | 대표자명 |
 228: | `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
 229: | `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
 230: | `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
 231: | `awards` | `Award[]` | optional | 인증·수상 |
 232: | `memberOf` | `Affiliation[]` | optional | 학회·협회 |
 233: | `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
 234: | `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
 235: | `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
 236: | `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
 237: | `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
 238: | `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
 239: | `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
 240: | `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
 241: | `logoUrl` | `URL` | ✅ | 로고 |
 242: | `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |
 243: 
 244: **하위 타입**:
 245: 
 246: #### `Address`
 247: | 필드 | 타입 | required | 설명 |
 248: |---|---|:---:|---|
 249: | `streetAddress` | `string` | ✅ | 도로명 상세 |
 250: | `addressLocality` | `string` | ✅ | 시·군 |
 251: | `addressRegion` | `string` | ✅ | 도·광역시 |
 252: | `postalCode` | `string` | ✅ | 우편번호 |
 253: | `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |
 254: 
 255: #### `GeoCoordinates`
 256: | 필드 | 타입 | required | 설명 |
 257: |---|---|:---:|---|
 258: | `latitude` | `number` | ✅ | |
 259: | `longitude` | `number` | ✅ | |
 260: 
 261: #### `Award`
 262: | 필드 | 타입 | required | 설명 |
 263: |---|---|:---:|---|
 264: | `name` | `string` | ✅ | 인증·수상명 |
 265: | `awardedBy` | `string` | optional | 수여 기관 |
 266: | `awardedDate` | `Date` | optional | |
 267: | `verificationUrl` | `URL` | optional | 검증 가능 링크 |
 268: 
 269: #### `Affiliation`
 270: | 필드 | 타입 | required | 설명 |
 271: |---|---|:---:|---|
 272: | `name` | `string` | ✅ | 학회·협회명 |
 273: | `role` | `string` | optional | |
 274: | `url` | `URL` | optional | |
 275: | `verified` | `boolean` | optional | |
 276: 
 277: #### `ResearchInstitute`
 278: | 필드 | 타입 | required | 설명 |
 279: |---|---|:---:|---|
 280: | `name` | `string` | ✅ | 연구 기관명 |
 281: | `description` | `string` | optional | |
 282: | `url` | `URL` | optional | |
 283: | `relationship` | `enum {affiliate, partner, owned}` | optional | |
 284: 
 285: #### `SocialMediaLinks`
 286: | 필드 | 타입 | required | 설명 |
 287: |---|---|:---:|---|
 288: | `naverBlog` | `URL` | optional | |
 289: | `instagram` | `URL` | optional | |
 290: | `youtube` | `URL` | optional | |
 291: | `kakao` | `URL` | optional | |
 292: | `facebook` | `URL` | optional | |
 293: | `linkedin` | `URL` | optional | |
 294: | `others` | `{label: string, url: URL}[]` | optional | |
 295: 
 296: #### `MediaItem`
 297: | 필드 | 타입 | required | 설명 |
 298: |---|---|:---:|---|
 299: | `outlet` | `string` | ✅ | 매체명 |
 300: | `title` | `string` | ✅ | |
 301: | `date` | `Date` | optional | |
 302: | `url` | `URL` | optional | |
 303: 
 304: #### `InternationalSupport`
 305: | 필드 | 타입 | required | 설명 |
 306: |---|---|:---:|---|
 307: | `languages` | `string[]` | ✅ | ISO 639-1 |
 308: | `interpreterAvailable` | `boolean` | optional | |
 309: | `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
 310: | `targetCountries` | `string[]` | optional | |
 311: 
 312: ### C-02. `DoctorProfile` — 의료진 권위·전문성
 313: 
 314: | 필드 | 타입 | required | 설명 |
 315: |---|---|:---:|---|
 316: | `@id` | `Slug` | ✅ | |
 317: | `name` | `string` | ✅ | 1~50자 |
 318: | `alternateName` | `string` | optional | 영문명 |
 319: | `jobTitle` | `string` | ✅ | 직책 |
 320: | `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
 321: | `briefBio` | `string` | ✅ | 50~200자 |
 322: | `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
 323: | `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
 324: | `photoUrl` | `URL` | optional | |
 325: | `credentials` | `Credential[]` | ✅ | 최소 1개 |
 326: | `education` | `Education[]` | optional | |
 327: | `career` | `CareerItem[]` | optional | |
 328: | `affiliations` | `Affiliation[]` | optional | |
 329: | `publications` | `Publication[]` | optional | |
 330: | `media` | `MediaItem[]` | optional | |
 331: | `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
 332: | `email` | `Email` | optional | |
 333: | `socialMedia` | `SocialMediaLinks` | optional | |
 334: | `consultationAvailable` | `boolean` | optional | 기본 `true` |
 335: | `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
 336: | `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
 337: 
 338: **하위 타입**:
 339: 
 340: #### `Credential`
 341: | 필드 | 타입 | required | 설명 |
 342: |---|---|:---:|---|
 343: | `type` | `enum {license, certification, board}` | ✅ | |
 344: | `name` | `string` | ✅ | |
 345: | `issuedBy` | `string` | optional | |
 346: | `issuedDate` | `Date` | optional | |
 347: | `expiryDate` | `Date` | optional | |
 348: 
 349: #### `Education`
 350: | 필드 | 타입 | required | 설명 |
 351: |---|---|:---:|---|
 352: | `institution` | `string` | ✅ | |
 353: | `degree` | `string` | ✅ | |
 354: | `period` | `string` | optional | 예: `"2010-2016"` |
 355: 
 356: #### `CareerItem`
 357: | 필드 | 타입 | required | 설명 |
 358: |---|---|:---:|---|
 359: | `organization` | `string` | ✅ | |
 360: | `role` | `string` | ✅ | |
 361: | `period` | `string` | optional | |
 362: 
 363: #### `Publication`
 364: | 필드 | 타입 | required | 설명 |
 365: |---|---|:---:|---|
 366: | `title` | `string` | ✅ | |
 367: | `venue` | `string` | optional | 학회지·매체 |
 368: | `year` | `number` | optional | |
 369: | `url` | `URL` | optional | |
 370: 
 371: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
 372: 
 373: | 필드 | 타입 | required | 설명 |
 374: |---|---|:---:|---|
 375: | `@id` | `Slug` | ✅ | |
 376: | `name` | `string` | ✅ | 1~80자 |
 377: | `alternateName` | `string` | optional | |
 378: | `summary` | `string` | ✅ | 50~160자 핵심 답변 |
 379: | `category` | `string` | optional | 시술 카테고리 |
 380: | `medicalSpecialty` | `Ref<C-14>` | optional | |
 381: | `overview` | `Markdown` | ✅ | 개요 |
 382: | `mechanism` | `Markdown` | ✅ | 원리 |
 383: | `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
 384: | `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
 385: | `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
 386: | `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
 387: | `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
 388: | `duration` | `string` | optional | 소요 시간 |
 389: | `sessionCount` | `string` | optional | 권장 횟수 |
 390: | `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
 391: | `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
 392: | `aftercare` | `Markdown` | optional | 시술 후 관리 |
 393: | `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
 394: | `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
 395: | `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
 396: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
 397: | `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
 398: | `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
 399: | `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
 400: | `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
 401: | `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
 402: | `heroImageUrl` | `URL` | optional | |
 403: | `ogImageUrl` | `URL` | optional | |
 404: | `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
 405: 
 406: **하위 타입**:
 407: 
 408: #### `ProcessStep`
 409: | 필드 | 타입 | required | 설명 |
 410: |---|---|:---:|---|
 411: | `order` | `number` | ✅ | 단계 번호 |
 412: | `name` | `string` | ✅ | 단계명 |
 413: | `description` | `Markdown` | ✅ | |
 414: | `durationMinutes` | `number` | optional | |
 415: 
 416: #### `TreatmentComponent` (v0.4 신규)
 417: | 필드 | 타입 | required | 설명 |
 418: |---|---|:---:|---|
 419: | `@id` | `Slug` | ✅ | |
 420: | `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
 421: | `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
 422: | `description` | `Markdown` | optional | |
 423: | `included` | `boolean` | optional | 패키지 포함 여부 (default true) |
 424: 
 425: #### `VisitFlowStep` (v0.4 신규)
 426: | 필드 | 타입 | required | 설명 |
 427: |---|---|:---:|---|
 428: | `order` | `number` | ✅ | |
 429: | `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
 430: | `description` | `Markdown` | optional | |
 431: | `durationMinutes` | `number` | optional | |
 432: | `location` | `enum {clinic, remote, both}` | optional | |
 433: 
 434: #### `ProgramVariant`
 435: | 필드 | 타입 | required | 설명 |
 436: |---|---|:---:|---|
 437: | `@id` | `Slug` | ✅ | |
 438: | `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
 439: | `duration` | `string` | ✅ | 기간 |
 440: | `sessionCount` | `string` | optional | 세션 수 |
 441: | `targetSegment` | `string` | optional | 대상 분류 |
 442: | `briefDescription` | `Markdown` | ✅ | |
 443: | `includes` | `string[]` | optional | 포함 항목 |
 444: | `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
 445: | `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
 446: 
 447: #### `EvidenceNote` (v0.4 신규)
 448: | 필드 | 타입 | required | 설명 |
 449: |---|---|:---:|---|
 450: | `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
 451: | `summary` | `string` | optional | 간략 요약 |
 452: | `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
 453: | `publishedYear` | `number` | optional | |
 454: | `verifiedBy` | `string` | optional | 검증자·기관 |
 455: 
 456: #### `SlotRiskOverride`
 457: | 필드 | 타입 | required | 설명 |
 458: |---|---|:---:|---|
 459: | `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
 460: | `level` | `RiskLevel` | ✅ | 격상 등급 |
 461: | `reason` | `string` | ✅ | 감사 추적용 |
 462: 
 463: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
 464: 
 465: | 필드 | 타입 | required | 설명 |
 466: |---|---|:---:|---|
 467: | `@id` | `Slug` | ✅ | |
 468: | `headline` | `string` | ✅ | 1~120자 |
 469: | `summary` | `string` | ✅ | 80~200자 |
 470: | `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
 471: | `author` | `Ref<C-02>` | ✅ | 저자 |
 472: | `coAuthors` | `Ref<C-02>[]` | optional | |
 473: | `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
 474: | `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
 475: | `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
 476: | `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
 477: | `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
 478: | `datePublished` | `Date` | ✅ | 최초 발행일 |
 479: | `dateModified` | `Date` | ✅ | 최종 수정일 |
 480: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
 481: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
 482: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
 483: | `tags` | `string[]` | optional | |
 484: | `readingTimeMinutes` | `number` | optional | 자동 계산 |
 485: | `wordCount` | `number` | optional | 자동 계산 |
 486: | `coverImageUrl` | `URL` | optional | |
 487: | `ogImageUrl` | `URL` | optional | |
 488: | `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
 489: | `relatedArticles` | `Ref<C-04>[]` | optional | |
 490: | `relatedTreatments` | `Ref<C-03>[]` | optional | |
 491: | `relatedConditions` | `Ref<C-11>[]` | optional | |
 492: | `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
 493: | `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
 494: 
 495: **ArticleType ↔ 자동 추론 위험도**:
 496: 
 497: | ArticleType | 자동 위험도 | 운영자 오버라이드 |
 498: |---|:---:|:---:|
 499: | `notice` | Low | ✅ |
 500: | `general-medical-info` | Medium | ✅ |
 501: | `treatment-explainer` | Medium | ✅ |
 502: | `condition-explainer` | Medium | ✅ |
 503: | `effect-result-related` | High | ✅ (낮출 수 없음) |
 504: | `review-case` | High | ✅ (낮출 수 없음) |
 505: | `event-price` | High | ✅ (낮출 수 없음) |
 506: 
 507: **하위 타입**:
 508: 
 509: #### `EmbeddedMedia`
 510: | 필드 | 타입 | required | 설명 |
 511: |---|---|:---:|---|
 512: | `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
 513: | `url` | `URL` | ✅ | |
 514: | `title` | `string` | optional | |
 515: | `caption` | `string` | optional | |
 516: | `durationSeconds` | `number` | optional | |
 517: | `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |
 518: 
 519: **컴플라이언스 주의**:
 520: - `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
 521: - `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
 522: - `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).
 523: 
 524: ### C-05. `RiskLevel` (enum) — 위험도 등급
 525: 
 526: ```ts
 527: type RiskLevel = "Low" | "Medium" | "High";
 528: ```
 529: 
 530: **v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).
 531: 
 532: > 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.
 533: 
 534: ### C-06. `PageMeta` — 페이지별 메타 데이터
 535: 
 536: | 필드 | 타입 | required | 설명 |
 537: |---|---|:---:|---|
 538: | `title` | `string` | ✅ | 10~70자, `<title>` |
 539: | `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
 540: | `canonical` | `URL` | optional | 미지정 시 자동 생성 |
 541: | `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
 542: | `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
 543: | `ogTitle` | `string` | optional | 미지정 시 `title` |
 544: | `ogDescription` | `string` | optional | 미지정 시 `description` |
 545: | `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
 546: | `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
 547: | `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
 548: | `noIndex` | `boolean` | optional | 기본 `false` |
 549: 
 550: > 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.
 551: 
 552: ### C-07. `BrandTokens` — 디자인 토큰 최종값
 553: 
 554: | 필드 | 타입 | required | 설명 |
 555: |---|---|:---:|---|
 556: | `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
 557: | `colors` | `ColorTokens` | ✅ | 색 토큰 |
 558: | `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
 559: | `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
 560: | `radius` | `RadiusScale` | ✅ | |
 561: | `shadow` | `ShadowScale` | ✅ | |
 562: | `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
 563: | `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |
 564: 
 565: > 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.
 566: 
 567: ### C-08. `InstanceManifest` — 버전 고정 명세
 568: 
 569: | 필드 | 타입 | required | 설명 |
 570: |---|---|:---:|---|
 571: | `instanceId` | `Slug` | ✅ | |
 572: | `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
 573: | `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
 574: | `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
 575: | `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
 576: | `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
 577: | `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
 578: | `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
 579: | `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
 580: | `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
 581: | `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
 582: | `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
 583: | `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
 584: | `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
 585: | `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
 586: | `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
 587: | `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
 588: | `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
 589: | `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
 590: | `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
 591: | `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
 592: | `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
 593: | `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
 594: | `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
 595: | `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
 596: | `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
 597: | `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
 598: | `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
 599: | `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
 600: | `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
 601: | `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
 602: | `lastReleaseApprovedAt` | `Date` | optional | |
 603: 
 604: #### `RobotsOverride` (v0.11 신규)
 605: | 필드 | 타입 | required | 설명 |
 606: |---|---|:---:|---|
 607: | `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
 608: | `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
 609: | `allow` | `string[]` | optional | Allow 경로 목록 |
 610: | `disallow` | `string[]` | optional | Disallow 경로 목록 |
 611: | `note` | `string` | optional | 운영자 메모 |
 612: 
 613: #### `PerformanceBudget` (v0.11 신규, v0.12 확장)
 614: | 필드 | 타입 | required | 설명 |
 615: |---|---|:---:|---|
 616: | `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
 617: | `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
 618: | `clsOverride` | `number` | optional | CLS budget 강화 override |
 619: | `tbtMsOverride` | `number` | optional | |
 620: | `bundleSizeKbOverride` | `number` | optional | |
 621: | `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
 622: | `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
 623: | `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
 624: | `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |
 625: 
 626: #### `NotificationChannelsConfig` (v0.13 확장)
 627: 
 628: | 필드 | 타입 | required | 설명 |
 629: |---|---|:---:|---|
 630: | `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
 631: | `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
 632: | `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |
 633: 
 634: > 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
 635: 
 636: #### `VersionSpec`
 637: SemVer 형식 (`"1.4.2"`).
 638: 
 639: #### `IANATimezone` (v0.13 신규)
 640: 
 641: IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.
 642: 
 643: #### `AnalyticsConfig` (v0.14 신규)
 644: 
 645: | 필드 | 타입 | required | 설명 |
 646: |---|---|:---:|---|
 647: | `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
 648: | `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
 649: | `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
 650: | `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |
 651: 
 652: > 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
 653: 
 654: #### `SearchVisibilityConfig` (v0.16 신규)
 655: 
 656: | 필드 | 타입 | required | 설명 |
 657: |---|---|:---:|---|
 658: | `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
 659: | `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |
 660: 
 661: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.
 662: 
 663: #### `KeywordMonitoringConfig` (v0.17 신규)
 664: 
 665: | 필드 | 타입 | required | 설명 |
 666: |---|---|:---:|---|
 667: | `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
 668: 
 669: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).
 670: 
 671: #### `AssetIngestionConfig` (v0.18 신규)
 672: 
 673: | 필드 | 타입 | required | 설명 |
 674: |---|---|:---:|---|
 675: | `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
 676: | `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
 677: | `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
 678: | `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |
 679: 
 680: #### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)
 681: 
 682: SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:
 683: 
 684: | 필드 | 타입 | required | 설명 |
 685: |---|---|:---:|---|
 686: | `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
 687: | `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
 688: | `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
 689: | `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
 690: | `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
 691: | `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
 692: | `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |
 693: 
 694: > 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).
 695: 
 696: #### `CrmSyncConfig` (v0.19 신규)
 697: 
 698: | 필드 | 타입 | required | 설명 |
 699: |---|---|:---:|---|
 700: | `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
 701: 
 702: #### `CrmIntegrationEntry` (v0.19 신규)
 703: 
 704: | 필드 | 타입 | required | 설명 |
 705: |---|---|:---:|---|
 706: | `id` | string | ✅ | integration 식별자 (instance scope unique) |
 707: | `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
 708: | `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
 709: | `apiUrl` | URL | ✅ | provider endpoint |
 710: | `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
 711: | `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
 712: | `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
 713: | `legalApprovedBy` | string | ✅ | |
 714: | `legalApprovedAt` | Date | ✅ | |
 715: | `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
 716: | `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
 717: 
 718: > 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
 719: 
 720: #### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
 721: 
 722: 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
 723: 
 724: | 필드 | 타입 | required | 설명 |
 725: |---|---|:---:|---|
 726: | `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
 727: | `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
 728: | `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
 729: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
 730: | `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
 731: | `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
 732: | `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
 733: 
 734: > ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
 735: 
 736: #### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
 737: 
 738: 법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
 739: 
 740: | 필드 | 타입 | required | 설명 |
 741: |---|---|:---:|---|
 742: | `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
 743: | `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
 744: | `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
 745: | `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
 746: | `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
 747: | `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
 748: | `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
 749: | `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |
 750: 
 751: ### C-09. `FeatureModuleConfig` — Feature Module 설정
 752: 
 753: | 필드 | 타입 | required | 설명 |
 754: |---|---|:---:|---|
 755: | `moduleName` | `string` | ✅ | 모듈 식별자 |
 756: | `enabled` | `boolean` | ✅ | |
 757: | `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |
 758: 
 759: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
 760: 
 761: **마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
 762: 
 763: #### 어드민 DB 원본 (풀데이터)
 764: 
 765: | 필드 | 타입 | required | 설명 |
 766: |---|---|:---:|---|
 767: | `@id` | `Slug` | ✅ | |
 768: | `instanceId` | `Slug` | ✅ | |
 769: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
 770: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
 771: | `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
 772: | `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
 773: | `articleType` | `string` | optional | (Article인 경우) |
 774: | `inlineRiskFlags` | `string[]` | optional | |
 775: | `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
 776: | `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
 777: | `peerReviewedAt` | `Date` | ✅ | |
 778: | `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
 779: | `physicianApprovedAt` | `Date` | optional | |
 780: | `clientApprover` | `string` | optional | |
 781: | `clientApprovedAt` | `Date` | optional | |
 782: | `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
 783: | `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
 784: | `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
 785: | `priorReviewSubmissionId` | `string` | optional | |
 786: | `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
 787: | `attachments` | `Attachment[]` | optional | 증빙 파일 |
 788: | `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
 789: | `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
 790: | `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
 791: | `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
 792: | `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
 793: | `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
 794: | `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
 795: | `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
 796: 
 797: #### `MediaThresholdAssessment` (v0.14 +)
 798: 
 799: | 필드 | 타입 | required | 설명 |
 800: |---|---|:---:|---|
 801: | `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
 802: | `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
 803: | `windowEnd` | `Date` | ✅ | |
 804: | `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
 805: | `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
 806: | `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
 807: | `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
 808: | `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
 809: | `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
 810: | `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
 811: | `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
 812: 
 813: > `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
 814: 
 815: #### `WarningAcknowledgement` (v0.8 +)
 816: | 필드 | 타입 | required | 설명 |
 817: |---|---|:---:|---|
 818: | `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
 819: | `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
 820: | `operatorId` | `string` | ✅ | operator 사용자 ID |
 821: | `timestamp` | `Date` | ✅ | |
 822: | `note` | `string` | optional | 메모 |
 823: 
 824: #### `StaleFlags`
 825: | 필드 | 타입 | required | 설명 |
 826: |---|---|:---:|---|
 827: | `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
 828: | `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
 829: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
 830: | `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
 831: | `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
 832: | `triggeredAt` | `Date` | optional | |
 833: 
 834: #### Git 사본 (경량 빌드 참조)
 835: 
 836: | 필드 | 타입 | required | 설명 |
 837: |---|---|:---:|---|
 838: | `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
 839: | `articleType` | `string` | optional | |
 840: | `priorReviewPassed` | `boolean` | optional | |
 841: | `publishedAt` | `Date` | ✅ | schema datePublished |
 842: | `lastModifiedAt` | `Date` | ✅ | schema dateModified |
 843: 
 844: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
 845: 
 846: **목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
 847: 
 848: **참조 페이지 타입**: P-013
 849: **참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)
 850: 
 851: | 필드 | 타입 | required | 설명 |
 852: |---|---|:---:|---|
 853: | `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
 854: | `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
 855: | `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
 856: | `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
 857: | `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
 858: | `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
 859: | `effectiveDate` | `Date` | ✅ | 시행일 |
 860: | `lastRevisedDate` | `Date` | optional | 최종 개정일 |
 861: | `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
 862: | `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
 863: | `contactEmail` | `Email` | optional | 정책 문의 채널 |
 864: 
 865: **하위 타입**:
 866: 
 867: #### `LegalDocumentRevision`
 868: | 필드 | 타입 | required | 설명 |
 869: |---|---|:---:|---|
 870: | `date` | `Date` | ✅ | 개정일 |
 871: | `summary` | `string` | ✅ | 개정 내용 요약 |
 872: | `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |
 873: 
 874: **컴플라이언스 룰**:
 875: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
 876: - 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.
 877: 
 878: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
 879: 
 880: **SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.
 881: 
 882: | 필드 | 타입 | required | 설명 |
 883: |---|---|:---:|---|
 884: | `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
 885: | `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
 886: | `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
 887: | `branchDescription` | `string` | optional | 50~200자 |
 888: | `address` | `Address` | ✅ | 지점 주소 |
 889: | `geo` | `GeoCoordinates` | optional | |
 890: | `telephone` | `Phone` | ✅ | 지점 직통 |
 891: | `fax` | `Phone` | optional | |
 892: | `email` | `Email` | optional | 지점 이메일 |
 893: | `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
 894: | `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
 895: | `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
 896: | `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
 897: | `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
 898: | `images` | `URL[]` | optional | |
 899: | `transportInfo` | `Markdown` | optional | |
 900: | `parkingInfo` | `Markdown` | optional | |
 901: | `openingDate` | `Date` | optional | 지점 개원일 |
 902: | `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
 903: | `branchCode` | `string` | optional | |
 904: | `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
 905: 
 906: > v0.4 → v0.6 강조 채널 표기 변천:
 907: > - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
 908: > - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
 909: > - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
 910: 
 911: > **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
 912: 
 913: ### C-22. `ArticleCategory` — Article Pillar 분류
 914: 
 915: | 필드 | 타입 | required | 설명 |
 916: |---|---|:---:|---|
 917: | `@id` | `Slug` | ✅ | |
 918: | `name` | `string` | ✅ | 1~50자 |
 919: | `description` | `string` | optional | 80~200자 |
 920: | `pillar` | `string` | optional | 상위 Pillar |
 921: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
 922: | `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
 923: | `coverImageUrl` | `URL` | optional | |
 924: | `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
 925: | `displayOrder` | `number` | optional | |
 926: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |
 927: 
 928: ---
 929: 
 930: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
 931: 
 932: ### C-11. `MedicalConditionPage`
 933: 필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.
 934: 
 935: ### C-12. `FAQ`
 936: 필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.
 937: 
 938: ### C-13. `ReviewPolicy`
 939: 필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**
 940: 
 941: ### C-14. `MedicalSpecialty`
 942: 필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
 943: 
 944: ### C-15. `SchemaInput`
 945: JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.
 946: 
 947: ### C-17. `PricingPage`
 948: 필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**
 949: 
 950: ### C-18. `FacilitiesPage`
 951: 필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.
 952: 
 953: ### C-19. `NewsItem`
 954: 필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
 955: 
 956: ### C-20. `ReservationPage`
 957: 필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
 958: 
 959: ### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
 960: 
 961: **마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.
 962: 
 963: | 필드 | 타입 | required | 설명 |
 964: |---|---|:---:|---|
 965: | `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
 966: | `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
 967: | `displayName` | `string` | ✅ | 어드민 UI 표시명 |
 968: | `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
 969: | `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
 970: | `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
 971: | `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
 972: | `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
 973: | `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
 974: | `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
 975: | `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
 976: | `lastLoginAt` | `Date` | optional | |
 977: | `createdAt` | `Date` | ✅ | |
 978: 
 979: #### `NotificationPreferences` (C-23 하위 타입)
 980: 
 981: | 필드 | 타입 | required | 설명 |
 982: |---|---|:---:|---|
 983: | `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
 984: | `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
 985: | `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
 986: | `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
 987: 
 988: #### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)
 989: 
 990: | 필드 | 타입 | required | 설명 |
 991: |---|---|:---:|---|
 992: | `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
 993: | `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
 994: | `firstObservedAt` | `Date` | ✅ | |
 995: | `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
 996: | `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
 997: | `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
 998: | `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
 999: | `unsuppressedAt` | `Date` | optional | |
1000: 
1001: ---
1002: 
1003: ## 6. 관계 다이어그램
1004: 
1005: ```
1006: ClinicProfile (C-01)
1007:    ├─ trustMetrics → TrustMetric[] (CT-01)
1008:    ├─ primaryCtas → CTAConfig[] (CT-03)
1009:    ├─ medicalSpecialty → MedicalSpecialty (C-14)
1010:    ├─ affiliatedInstitutes → ResearchInstitute
1011:    └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
1012: 
1013: LocationProfile (C-21) — 위치·시간·연락 SoT
1014:    ├─ businessHours → BusinessHours (CT-02)
1015:    ├─ reservationChannels → CTAConfig[] (CT-03)
1016:    ├─ parentClinic → ClinicProfile (C-01)
1017:    ├─ representativeDoctors → DoctorProfile[]
1018:    ├─ doctorsAtLocation → DoctorProfile[]
1019:    └─ availableTreatments → TreatmentPage[]
1020: 
1021: DoctorProfile (C-02)
1022:    ├─ primaryLocation → LocationProfile (C-21)
1023:    ├─ additionalLocations → LocationProfile[]
1024:    └─ trustMetrics → TrustMetric[] (CT-01)
1025: 
1026: TreatmentPage (C-03)
1027:    ├─ cta → CTAConfig (CT-03)
1028:    ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
1029:    ├─ relatedDoctors → DoctorProfile[]
1030:    ├─ relatedConditions → MedicalConditionPage[]
1031:    └─ pageRiskLevel → RiskLevel (직접 enum)
1032: 
1033: Article (C-04)
1034:    ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
1035:    ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
1036:    ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
1037:    ├─ category → ArticleCategory (C-22)
1038:    ├─ contentSource / externalUrl (v0.4)
1039:    ├─ embeddedMedia → EmbeddedMedia[]
1040:    └─ pageRiskLevel → RiskLevel
1041: 
1042: ComplianceRecord (C-10)
1043:    ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
1044:    └─ pageRiskLevel → RiskLevel
1045: ```
1046: 
1047: ---
1048: 
1049: ## 7. 변경 정책
1050: 
1051: (§ 2.6 표 참조 — MAJOR/MINOR/PATCH)
1052: 
1053: ---
1054: 
1055: ## 8. 미결정 사항
1056: 
1057: | ID | 항목 | 비고 |
1058: |---|---|---|
1059: | DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
1060: | DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
1061: | DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
1062: | DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
1063: | DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
1064: | DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
1065: | DM-07 | cross-reference 빌드 검증 | |
1066: | DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
1067: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1068: | DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
1069: | DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
1070: | DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
1071: | DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
1072: | DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
1073: | DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
1074: | DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
1075: | DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
1076: | DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
1077: | DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |
1078: 
1079: ---
1080: 
1081: ## 9. 변경 이력
1082: 
1083: | 일자 | 버전 | 변경 |
1084: |---|---|---|
1085: | 2026-05-13 | v0.1 | 최초 — 20개 계약 |
1086: | 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1087: | 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
1088: | 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
1089: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1090: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1091: | 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1092: | 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1093: | 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
1094: | 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
1095: | 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
1096: | 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
1097: | 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
1098: | 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
1099: | 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
1100: | 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
1101: | 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
1102: | 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
1103: | 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
1104: | 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
1105: | 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
1106: | 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
1107: | 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
1108: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "### C-0[3-6]|### C-10|### C-16|### C-21|published|status|publishedAt|bodyMarkdown|slug|LocationProfile|LegalDocument|PageMeta|InstanceManifest|aiCrawlerPolicy" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/LOCATION_LEGAL_PLAN.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/M0_BUILD_EXPORT_PLAN.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/ADMIN_UI_SKELETON_PLAN.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 977ms:
23:- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
40:| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
42:| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
63:| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
96:- 인스턴스 내 유일, slug 형식, 3~64자.
104:- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
371:### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
453:| `publishedYear` | `number` | optional | |
463:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
476:| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
520:- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
524:### C-05. `RiskLevel` (enum) — 위험도 등급
534:### C-06. `PageMeta` — 페이지별 메타 데이터
567:### C-08. `InstanceManifest` — 버전 고정 명세
576:| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
577:| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
578:| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
579:| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
759:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
770:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
782:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
783:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
788:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
790:| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
791:| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
792:| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
795:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
841:| `publishedAt` | `Date` | ✅ | schema datePublished |
844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
853:| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
861:| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
867:#### `LegalDocumentRevision`
875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
880:**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.
909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
922:| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
924:| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
954:필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
972:| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
985:| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
1013:LocationProfile (C-21) — 위치·시간·연락 SoT
1022:   ├─ primaryLocation → LocationProfile (C-21)
1023:   ├─ additionalLocations → LocationProfile[]
1070:| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
1075:| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1094:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
1095:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
1096:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
1106:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |

 succeeded in 1011ms:
   1: # M0 build/export plan (v0.1·placeholder·2026-05-16)
   2: 
   3: > **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
   4: 
   5: 본 문서는 어드민 DB → Git output 변환의 build/export 책임 plan 의 placeholder 다. M0 v1.0 본 구현 시점에 풀명세 합류. 본 v0.1 은 다른 plan/cascade marker 의 reference target 역할.
   6: 
   7: ## SoT
   8: 
   9: - `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
  10: - `docs/core/DATA_MODEL.md` v0.9 — Git 출력 계약 (C-01·C-02·C-03·C-04·C-16·C-21)
  11: - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
  12: - `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit matrix · § 6 actions
  13: 
  14: ## 1. 책임 영역
  15: 
  16: ### 1.1 본 plan 의 범위
  17: 
  18: - 어드민 DB (`clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` · `legal_document` · 등) → Git output (Markdown frontmatter + YAML/JSON content file) 변환.
  19: - 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
  20: - `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
  21: 
  22: ### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
  23: 
  24: | 변환 | DB source | Git output |
  25: |---|---|---|
  26: | ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
  27: | ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
  28: | LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
  29: | LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
  30: | LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
  31: | LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
  32: | primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
  33: | LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
  34: | LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
  35: 
  36: ### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
  37: 
  38: - DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
  39: - ComplianceRecord (audit DB · ARCH § 6.3 cross-data) → Git output 사본.
  40: - InstanceManifest · BrandTokens · FeatureModuleConfig.
  41: - 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.
  42: 
  43: ## 2. 작업 단위 (M0 v1.0 합류 시)
  44: 
  45: - apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
  46: - Git client (isomorphic-git 또는 simple-git) 통합.
  47: - DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
  48: - CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
  49: - 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
  50: 
  51: ## 3. 비범위 (M0 v1.0 외)
  52: 
  53: - PR 워크플로우 (Direct push 외) — M2 Phase Beta.
  54: - Git history 시각화 UI — M2 Phase Beta.
  55: - 다국어 출력 — M3.
  56: 
  57: ## 변경 이력
  58: 
  59: | 일자 | 버전 | 변경 |
  60: |---|---|---|
  61: | 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |

 succeeded in 1115ms:
   1: # LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
   2: 
   3: > **상태**: **v1.0 (acceptance)** — codex 자동 비평 **6 cycle 후 `closeableAfterPatch=true` 확정**. cycle6 finding 1 minor (LL-59) 잔재 정정 후 종료. blocking 0 · major 0 · minor 0 잔존. **59 findings 전건 처리 완료**. 수렴 추세 25→12→10→8→3→1.
   4: 
   5: > **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
   6: 
   7: 본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
   8: 
   9: > **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.
  10: 
  11: > **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
  12: 
  13: ## SoT
  14: 
  15: - `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
  16: - `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
  17: - `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
  18: - `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
  19: - `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
  20: - `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
  21: - `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
  22: - 기존 packages 실 시그니처 (cycle1 직접 확인):
  23:   - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
  24:   - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
  25:   - `apps/web/src/components/forms/ClinicProfileForm.tsx`
  26:   - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
  27:   - `packages/db/src/{tenant,service-role}.ts`
  28:   - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`
  29: 
  30: ## 1. 목적과 범위
  31: 
  32: ### 1.1 목적
  33: 
  34: - ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
  35: - 운영자 UX: 화면 추가 없이 한 폼에서 본원 위치·연락·시간 + 정책 변수 (담당자·시행일) 까지 입력. 출력은 자동 분리.
  36: - M0 vertical slice 의 게이트 #1 (사이트 측 페이지 타입 9종 + Article 1샘플) 중 P-012 Contact · P-013 Legal/Policy · P-014 Location Detail 의 데이터 원천 확보.
  37: 
  38: ### 1.2 범위 (포함)
  39: 
  40: | 항목 | 비고 |
  41: |---|---|
  42: | ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
  43: | `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
  44: | `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
  45: | `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
  46: | `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
  47: | Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
  48: | 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
  49: | businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
  50: | 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
  51: | audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |
  52: 
  53: ### 1.3 비범위 (defer)
  54: 
  55: | 항목 | Defer to | marker |
  56: |---|---|---|
  57: | LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
  58: | LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
  59: | ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
  60: | 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
  61: | 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
  62: | LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
  63: | reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
  64: | `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
  65: | LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
  66: | `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
  67: | ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
  68: | `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
  69: | 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
  70: | LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
  71: | `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
  72: | custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
  73: 
  74: ## 2. 데이터 모델 결정
  75: 
  76: ### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
  77: 
  78: ```sql
  79: -- packages/core-content/migrations/C0006_legal_document.sql
  80: 
  81: CREATE TYPE legal_document_type AS ENUM (
  82:   'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
  83: );
  84: 
  85: CREATE TABLE legal_document (
  86:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  87:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  88:   slug TEXT NOT NULL,
  89:   document_type legal_document_type NOT NULL,
  90:   title TEXT NOT NULL,
  91:   body TEXT NOT NULL,                 -- Markdown
  92:   auto_generated BOOLEAN NOT NULL DEFAULT true,
  93:   template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
  94:   effective_date DATE NOT NULL,
  95:   last_revised_date DATE,
  96:   contact_person TEXT,
  97:   contact_email TEXT,
  98:   status content_publication_status NOT NULL DEFAULT 'draft',
  99:   risk_level risk_level NOT NULL DEFAULT 'Low',
 100:   published_at TIMESTAMPTZ,
 101:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 102:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 103:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 104:   CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
 105:   CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
 106:   CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
 107:   CONSTRAINT legal_document_email_regex CHECK (
 108:     contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
 109:   ),
 110:   -- cycle1 LL-22 patch: autoGenerated=true 면 templateVersion 필수 (LL-SCHEMA-05). custom (autoGenerated=false) 은 null OK
 111:   CONSTRAINT legal_document_template_version_format CHECK (
 112:     template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
 113:   ),
 114:   CONSTRAINT legal_document_auto_generated_template_ver CHECK (
 115:     (auto_generated = false) OR (template_version IS NOT NULL)
 116:   ),
 117:   -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
 118:   CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
 119:   CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
 120:   -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
 121:   CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
 122:   CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
 123:   -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
 124:   CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
 125: );
 126: 
 127: CREATE UNIQUE INDEX legal_document_instance_5type_unique
 128:   ON legal_document (instance_id, document_type)
 129:   WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
 130: 
 131: CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
 132: 
 133: ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
 134: ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
 135: 
 136: CREATE POLICY tenant_isolation ON legal_document
 137:   FOR ALL TO app_tenant_user
 138:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
 139:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
 140: 
 141: GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
 142: ```
 143: 
 144: **결정 사항**:
 145: - (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
 146: - (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
 147: - (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
 148: - (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
 149: - (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
 150: - (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
 151: 
 152: ### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)
 153: 
 154: ```sql
 155: -- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
 156: 
 157: ALTER TABLE clinic_profile
 158:   ADD COLUMN policy_contact_person TEXT,
 159:   ADD COLUMN policy_contact_email TEXT,
 160:   ADD COLUMN policy_contact_phone TEXT,
 161:   ADD COLUMN policy_effective_date DATE,
 162:   -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
 163:   ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
 164: 
 165: ALTER TABLE clinic_profile
 166:   ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
 167:     policy_contact_email IS NULL
 168:     OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
 169:   ),
 170:   -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
 171:   ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
 172:     policy_contact_phone IS NULL
 173:     OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
 174:   ),
 175:   ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
 176:     jsonb_typeof(primary_ctas) = 'array'
 177:   );
 178: 
 179: -- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
 180: -- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
 181: -- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
 182: -- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
 183: CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
 184: RETURNS TRIGGER AS $$
 185: DECLARE
 186:   elem JSONB;
 187:   valid_types CONSTANT TEXT[] := ARRAY[
 188:     -- DATA_MODEL CT-03 SoT 11종 (DB trigger 전체 허용)
 189:     'phone', 'email', 'sms',
 190:     'kakao-talk', 'kakao-channel',
 191:     'naver-reservation', 'naver-talk',
 192:     'form', 'map', 'external', 'video-consultation'
 193:     -- 해외 채널 (line, whatsapp 등) 은 M3 다국어 cascade (DATA_MODEL DM-14)
 194:   ];
 195: BEGIN
 196:   IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
 197:     RAISE EXCEPTION 'primary_ctas must be a JSON array'
 198:       USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
 199:   END IF;
 200:   FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
 201:     -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
 202:     IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
 203:       RAISE EXCEPTION 'primary_ctas element missing id'
 204:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
 205:     END IF;
 206:     IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
 207:       RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
 208:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
 209:     END IF;
 210:     IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
 211:       RAISE EXCEPTION 'primary_ctas element missing label'
 212:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
 213:     END IF;
 214:     IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
 215:       RAISE EXCEPTION 'primary_ctas element missing targetUrl'
 216:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
 217:     END IF;
 218:   END LOOP;
 219:   RETURN NEW;
 220: END;
 221: $$ LANGUAGE plpgsql;
 222: -- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.
 223: 
 224: CREATE TRIGGER clinic_profile_primary_ctas_trigger
 225:   BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
 226:   FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
 227: ```
 228: 
 229: **결정**:
 230: - (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
 231: - (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
 232: - (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
 233: - (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
 234:   - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
 235:   - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
 236:   - UI subset 외 type (sms/form/map/external 등) 은 M1 Phase Alpha cascade (LL-DEFER-19 · cycle5 LL-57 + cycle6 LL-59 단일화).
 237:   - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
 238: 
 239: ### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
 240: 
 241: ```sql
 242: -- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
 243: 
 244: -- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
 245: -- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
 246: ALTER TABLE location_profile
 247:   ADD COLUMN clinic_profile_id UUID,
 248:   ADD CONSTRAINT location_profile_clinic_fk
 249:     FOREIGN KEY (instance_id, clinic_profile_id)
 250:     REFERENCES clinic_profile (instance_id, id)
 251:     ON DELETE CASCADE
 252:     DEFERRABLE INITIALLY DEFERRED;
 253: 
 254: -- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
 255: -- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
 256: ALTER TABLE location_profile
 257:   ALTER COLUMN clinic_profile_id SET NOT NULL;
 258: 
 259: CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);
 260: 
 261: -- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
 262: -- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
 263: -- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
 264: -- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
 265: ```
 266: 
 267: **결정**:
 268: - (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
 269: - (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
 270: - (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
 271: 
 272: ```jsonc
 273: // location_profile.metadata
 274: {
 275:   "businessHours": {
 276:     "openingHours": [
 277:       // schema.org OpeningHoursSpecification 호환
 278:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:30" },
 279:       { "dayOfWeek": ["Thursday"], "opens": "09:30", "closes": "20:30" },
 280:       { "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "14:00" }
 281:     ],
 282:     "receptionHours": [
 283:       // 접수 마감이 진료 마감과 다를 때
 284:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:00" }
 285:     ],
 286:     "lunchBreaks": [
 287:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "from": "13:00", "to": "14:00" }
 288:     ],
 289:     "specialClosures": []
 290:     // v0.2 미입력 — M1 cascade
 291:   },
 292:   // cycle1 LL-02 patch: ClinicProfile.primaryCtas 자동 상속 결과
 293:   "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
 294:   // v0.2 미입력 — LL-DEFER-05
 295:   "representativeDoctors": [],
 296:   "featuredChannelId": null
 297: }
 298: ```
 299: 
 300: **결정**:
 301: - (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
 302: - (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
 303: - (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
 304: - (LL-SCHEMA-20) 본원 주소: 기존 column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).
 305: 
 306: ## 3. Form UI 재구성
 307: 
 308: ### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
 309: 
 310: | 섹션 | 입력 필드 | 출력 계약 |
 311: |---|---|---|
 312: | **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
 313: | **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
 314: | **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
 315: | **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
 316: 
 317: **결정**:
 318: - (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
 319: - (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
 320: - (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
 321: - (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
 322: - (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
 323: - (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
 324: - (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
 325: 
 326: ### 3.2 검증
 327: 
 328: - (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
 329: - (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
 330: - (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
 331: - (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
 332: - (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
 333:   - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
 334:   - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
 335:   - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
 336:   - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
 337:   - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
 338: 
 339: ## 4. Server Action 결정
 340: 
 341: ### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)
 342: 
 343: ```typescript
 344: // apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts
 345: 
 346: await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
 347:   assertActionEligibility(ctx, "operator-edit-content");
 348:   // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
 349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
 350: 
 351:   // cycle1 LL-07 patch: 잠금 순서 결정적 — instance 안 모든 entity 동일 순서
 352:   // (1) clinic_profile (FOR UPDATE) — UPSERT 한 번에 처리하므로 별도 SELECT 안 함
 353:   // (2) location_profile main (FOR UPDATE) — UPSERT
 354:   // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
 355:   //     (cycle1 LL-07 patch — closed 5종 사전 알파벳 순)
 356: });
 357: ```
 358: 
 359: **결정**:
 360: - (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
 361: - (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
 362: - (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
 363: - (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
 364: - (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
 365: - (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
 366: - (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
 367: - (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
 368: - (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
 369: 
 370: ### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
 371: 
 372: ```typescript
 373: // packages/core-content/src/templates/render.ts
 374: 
 375: type RenderContext = {
 376:   clinic: {
 377:     name: string;
 378:     legalEntityName: string | null;
 379:     businessRegistrationNumber: string | null;
 380:     founder: string | null;
 381:   };
 382:   location: {
 383:     main: {
 384:       address: string;       // street + locality + region + postal 한 줄
 385:       telephone: string;
 386:       email: string | null;
 387:     };
 388:   };
 389:   policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
 390:     contactPerson: string;
 391:     contactEmail: string;
 392:     contactPhone: string;
 393:     effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
 394:   };
 395: };
 396: 
 397: export function renderTemplate(template: string, ctx: RenderContext): string;
 398: ```
 399: 
 400: **결정**:
 401: - (LL-ACTION-11) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
 402: - (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
 403: - (LL-ACTION-13) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
 404: - (LL-ACTION-14) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
 405: - (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
 406: - (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
 407: 
 408: ### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)
 409: 
 410: 7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:
 411: 
 412: ```jsonc
 413: // row 1
 414: { "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
 415: // row 2
 416: { "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
 417: // row 3~7 (5종 LegalDocument)
 418: { "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
 419:                                               "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
 420: // ... terms, non-covered, refund, complaint
 421: ```
 422: 
 423: **결정**:
 424: - (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
 425:   - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
 426:   - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
 427:   - 모든 7 row 실패 시 `content-saved-failed` audit row 1건 — 같은 payload shape (`outcome: "failed"`).
 428:   - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
 429:     - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
 430:     - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
 431:     - **notifications Feature 합류 후** (별도 cascade): 운영 팀 slack 알림 채널 추가 marker.
 432:   - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
 433:   - M0 v1.0 transactional outbox cascade 시점에 envelope + at-least-once exactly-once observable 로 전환 (cycle 1 LL-17 marker 갱신).
 434: - (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
 435: 
 436: ### 4.4 control-flow / 에러 (LL-ACTION-20)
 437: 
 438: - ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
 439: - 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 + cycle4 LL-48 patch — 후속 책임/액션/시점 명시):
 440:   - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
 441:   - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
 442:   - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
 443:   - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
 444:   - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
 445:   - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
 446:   - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
 447:   - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
 448:   - businessHours 는 application-level 검증 (DB CHECK 없음)
 449: 
 450: ## 5. Core 표준 템플릿 5종
 451: 
 452: ### 5.1 위치 (LL-TEMPLATE-01)
 453: 
 454: `packages/core-content/src/templates/` 에 각 documentType 별 `.md` 파일 + index.ts 로 export.
 455: 
 456: ```
 457: packages/core-content/src/templates/
 458: ├─ index.ts              -- TEMPLATES: Record<DocumentType, Template>
 459: ├─ render.ts             -- renderTemplate(template, ctx)
 460: ├─ privacy.md            -- 개인정보처리방침 (PIPA 표준)
 461: ├─ terms.md              -- 이용약관
 462: ├─ non-covered.md        -- 비급여 진료 안내
 463: ├─ refund.md             -- 환불 규정
 464: └─ complaint.md          -- 민원 처리
 465: ```
 466: 
 467: ```typescript
 468: // packages/core-content/src/templates/index.ts
 469: export type LegalDocumentType =
 470:   | "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
 471: 
 472: export type Template = {
 473:   documentType: LegalDocumentType;
 474:   slug: string;
 475:   title: string;
 476:   version: string;        // "privacy@1.0.0"
 477:   body: string;           // raw Markdown with {{...}} placeholders
 478: };
 479: 
 480: export const TEMPLATES: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", Template>;
 481: ```
 482: 
 483: **결정**:
 484: - (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
 485: - (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
 486: - (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
 487: - (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
 488:   - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
 489:   - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
 490:   - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
 491: - (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
 492: - (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
 493: 
 494: ## 6. 환경·precondition
 495: 
 496: - `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음.
 497: - **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
 498:   1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
 499:   2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
 500:   3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
 501:   4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
 502:   5. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
 503:   6. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
 504:   7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
 505:   8. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
 506:   9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
 507: - 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
 508: - packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
 509: - seed (`pnpm web:seed`) 변경 없음 — instance + admin_user 만 생성.
 510: 
 511: ## 7. § 8.1 RLS 시나리오 cascade
 512: 
 513: ADMIN_UI_SKELETON_PLAN § 8.1 의 13 시나리오에 다음 추가:
 514: 
 515: | # | 시나리오 | 통과 기준 |
 516: |---|---|---|
 517: | 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
 518: | 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
 519: | 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
 520: | 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
 521: | 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
 522: | 19 | 변수 화이트리스트 외 키 (`{{evil.x}}`) 가 포함된 템플릿 build-time test | packages/core-content test 실패 (LL-ACTION-12) |
 523: | 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
 524: | 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
 525: | 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |
 526: 
 527: ## 8. 작업 단위
 528: 
 529: | # | 작업 | 산출물 |
 530: |---|---|---|
 531: | 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
 532: | 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
 533: | 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
 534: | 4 | Core 표준 템플릿 5종 + render 엔진 + build-time unknown key test | packages/core-content/src/templates/* + tests |
 535: | 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
 536: | 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
 537: | 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
 538: | 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
 539: | 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
 540: | 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
 541: | 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
 542: | 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |
 543: 
 544: ## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)
 545: 
 546: ### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
 547: 
 548: - `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
 549: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
 550: - `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
 551: - `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
 552: - `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
 553: - `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
 554: - `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
 555: 
 556: ### 9.2 M1 Phase Alpha 합류
 557: 
 558: - `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
 559: - `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
 560: - `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
 561: - `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
 562: - `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
 563: - `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
 564: - `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
 565: - `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
 566: - `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
 567: 
 568: ### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
 569: 
 570: > **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
 571: 
 572: - `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
 573: - `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
 574: 
 575: ### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)
 576: 
 577: - (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)
 578: 
 579: ### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)
 580: 
 581: - `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
 582: - `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
 583: 
 584: ### 9.5 Closed (이전 cycle 에서 합류 완료)
 585: 
 586: - ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
 587: 
 588: ## 10. Cascade marker (다른 SoT 문서로 전파)
 589: 
 590: > **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
 591: 
 592: - `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
 593: - `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
 594: - `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
 595: - `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
 596: - `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
 597: 
 598: ## 변경 이력
 599: 
 600: | 일자 | 버전 | 변경 |
 601: |---|---|---|
 602: | 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
 603: | 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
 604: | 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
 605: | 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
 606: | 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
 607: | 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
 608: | 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
 609: | 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

 succeeded in 1093ms:
   1: # apps/web admin UI skeleton plan (v1.0·acceptance·2026-05-15)
   2: 
   3: > **상태**: **v1.0** — codex 자동 비평 11 cycle 후 `ready_for_acceptance=true` 확정. cycle11 finding 0건. blocking 0·major 0·minor 0·nit 0. **107 findings 전건 처리 완료**. scope_narrow_acceptable=true.
   4: 
   5: 본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.
   6: 
   7: > **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
   8: 
   9: > **package 버전 vs plan 버전 표기 (ADMIN-UI-44)**: 본 plan의 "v0.x" 는 plan 문서의 cycle 번호다. 의존 packages 의 실제 npm version 은 모두 `0.1.0`.
  10: 
  11: > **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
  12: 
  13: > **A-03 결정의 scope (ADMIN-UI-67)**: A-03 close (= packages/auth 자체 핸들러) 는 **skeleton-local 결정**. 상위 SoT (`INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 · `PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E) 가 여전히 next-auth/Auth.js 를 권위 있는 전제로 둔다. 두 문서의 reversal cascade 는 본 plan acceptance 후 별도 사이클로 진행 (acceptance precondition 아닌 follow-up cascade).
  14: 
  15: ## SoT
  16: 
  17: - `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
  18: - `docs/ARCHITECTURE.md` § 10 (전체 위상 reference)
  19: - `docs/admin/REVIEW_WORKFLOW.md` v1.0 (9 states · 14 actions · multi-role AND gate)
  20: - `docs/decisions/M0_SCHEMA_PLAN.md` v0.1 (6 core tables · cycle2 schema)
  21: - `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Single DB + RLS · Provider · Storage = R2)
  22: - `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v1.0 (Spike A/B/C/D/E LOCAL_PASS 패턴)
  23: - 기존 packages 실 시그니처 (cycle2 직접 확인):
  24:   - `packages/auth/src/errors.ts` `AuthDenyReason` 17 reasons (§ 5.4 SoT)
  25:   - `packages/auth/src/magic-link.ts` `consumeMagicLink(sql, identifier, tokenPlain) → identifier` (userId 아님)
  26:   - `packages/auth/src/session.ts` `createSession(sql, cfg, userId)`
  27:   - `packages/auth/src/resolve-tenant-context.ts` `TenantContext.instanceId: string` (plain)
  28:   - `packages/db/src/service-role.ts` `withServiceRole(sql, ctx, allowedFunctions, fn) — ServiceRoleContext { function, actorUserId: AdminUserId (필수), instanceId?, reason }` + audit_log 자동 pending/outcome
  29:   - `packages/db/src/tenant.ts` `withTenantTransaction(sql, { instanceId: InstanceId }, fn)` + `SET LOCAL ROLE app_tenant_user`
  30:   - `packages/shared-types/src/index.ts` `ServiceRoleFunction` enum (slugResolver 없음 — cascade marker)
  31:   - `apps/spike-e/migrations/004_audit_event.sql` audit_event 컬럼 = `occurred_at` (created_at 아님) · GRANT INSERT TO app_tenant_user 없음
  32:   - `packages/core-content/migrations/C0001_clinic_profile.sql` `GRANT SELECT,INSERT,UPDATE,DELETE ON clinic_profile TO app_tenant_user` + `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` (cycle8 정정 ADMIN-UI-102 — NULLIF 패턴은 unset context 의 silent deny 를 보장하며 § 8.1 시나리오의 fail-closed 전제)
  33: 
  34: ## 1. 목적과 walking skeleton 정의
  35: 
  36: ### 1.1 목적
  37: 
  38: - Vertical Slice (M0 v1.0) 본 구현 진입 전에 **전구간 wiring을 한 번에 검증**한다.
  39: - 검증할 전구간: Next.js App Router → packages/auth magic-link · resolveTenantContext → packages/db withTenantTransaction · RLS → packages/core-content 6 tables · Drizzle → Server Action 결과 → 다시 렌더링.
  40: 
  41: ### 1.2 walking skeleton 범위 (포함)
  42: 
  43: | 화면/엔드포인트 | 책임 | 출력 |
  44: |---|---|---|
  45: | `/sign-in` | 이메일 입력 → magic-link 발급 (mock mailbox 적재). 토큰 URL 클릭 → 세션 발급 · 쿠키 set | session cookie |
  46: | `/sign-in/consume?identifier=<email>&token=…` | magic-link 소비 (identifier + token 둘 다 필요) + **admin_user lookup/active check** (allowlist 만 — 자동 INSERT 없음 · ADMIN-UI-75) + first active operator membership 검증 + createSession + cookie set | redirect to `/[instanceSlug]` |
  47: | `/sign-out` | revokeSession + cookie clear | redirect to `/sign-in` |
  48: | `/[instanceSlug]` 대시보드 | slug resolve · tenant resolve · ClinicProfile 존재 여부 | 단순 표시 |
  49: | `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |
  50: 
  51: ### 1.3 walking skeleton 비범위 (deferred)
  52: 
  53: > **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
  54: 
  55: | 항목 | Defer to |
  56: |---|---|
  57: | DoctorProfile · TreatmentPage · Article 폼 (3 화면) | M0 v1.0 Phase 0 Week 4 본 구현 |
  58: | 미리보기 · 발행 화면 + Git commit/push/CI | M0 v1.0 + apps/worker |
  59: | LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
  60: | LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
  61: | ComplianceRecord 폼 · 위험도 분류 | M0 v0.2 (schema) + M0 v1.0 (UI) |
  62: | Markdown 에디터 (A-06·A-08) | M0 v1.0 Article 화면 |
  63: | Super-admin instance switch route + UI | M0 v1.0 또는 M2 |
  64: | ClinicProfile editable slug + instance 당 1개 보장 unique index | M0 v1.0 + core-content schema v0.3 |
  65: | Optimistic concurrency · 버전 컬럼 | M0 v1.0 또는 M2 |
  66: | RBAC 외부 사용자 초대 · 멀티 인스턴스 대시보드 | M2 Phase Beta |
  67: | Tiptap / Lexical 에디터 | M2 Phase Beta |
  68: | DESIGN_TOKENS v1.0 integration | M1+ |
  69: 
  70: ## 2. 기술 스택 결정 (admin/ARCHITECTURE § 10 미결정 항목 close)
  71: 
  72: | ID | 항목 | 결정 |
  73: |---|---|---|
  74: | **A-01** | 어드민 기술 스택 | Next.js 14 App Router + React Server Components + Server Actions |
  75: | **A-02** | 어드민 DB | PostgreSQL (Single DB + RLS · INFRA v1.0 § 4.1 정합) |
  76: | **A-03** | 인증 시스템 | packages/auth 자체 magic-link + HMAC signed session cookie (next-auth 도입 X) |
  77: | **A-06** · **A-08** | 에디터 | walking skeleton 범위 외 — M0 v1.0 Article 화면에서 결정 |
  78: 
  79: UI 토대: Tailwind CSS v4 + shadcn/ui (6 컴포넌트) + zod + postgres.
  80: 
  81: > **Implementation drift marker (코드 cycle1 WEB-17·18)**: walking skeleton 구현 단계에서 (a) Tailwind v3.4 로 임시 사용 (v4 PostCSS 통합 안정화 후 migration cascade marker) · (b) shadcn/ui 6 컴포넌트 도입 대신 native input + Tailwind inline alert 로 단순화 (Toast 도입은 M0 v1.0 본 구현 또는 M1 합류). 두 drift 는 Plan 본 결정 변경 아닌 구현 단계 잠정 결정 — 후속 cascade.
  82: 
  83: > **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.
  84: 
  85: > **Image upload cascade marker** (사용자 피드백): ClinicProfile logo / og:image 직접 파일 업로드는 별도 cascade — packages/storage R2 통합 (INFRA v1.0 결정 · Spike C LOCAL_PASS 패턴 차용) + multipart Server Action + signed URL 발급 + EXIF/PII scrub. M0 v1.0 본 구현 또는 별도 onboarding-assistant Feature spec.
  86: 
  87: > **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
  88: 
  89: **제거**: `next-auth`, `@auth/drizzle-adapter`.
  90: 
  91: ## 3. 디렉토리 구조 (apps/web)
  92: 
  93: ```
  94: apps/web/
  95: ├── package.json
  96: ├── tsconfig.json
  97: ├── next.config.mjs                   — serverActions.bodySizeLimit 명시 (§ 9 ADMIN-UI-39)
  98: ├── postcss.config.mjs
  99: ├── tailwind.config.ts
 100: ├── .env.example
 101: ├── src/
 102: │   ├── app/
 103: │   │   ├── layout.tsx
 104: │   │   ├── page.tsx                  — / → /sign-in 또는 firstActiveMembership.instanceSlug redirect
 105: │   │   ├── sign-in/
 106: │   │   │   ├── page.tsx
 107: │   │   │   ├── actions.ts            — issueMagicLink server action + skeleton-layer audit_event emit
 108: │   │   │   └── consume/
 109: │   │   │       └── route.ts          — GET /sign-in/consume?identifier=&token= · § 3.2 flow
 110: │   │   ├── sign-out/
 111: │   │   │   └── route.ts              — POST · revokeSession + cookie clear + audit_event emit
 112: │   │   ├── (admin)/
 113: │   │   │   ├── layout.tsx            — auth guard (cookie read · 미존재 시 redirect)
 114: │   │   │   └── [instanceSlug]/
 115: │   │   │       ├── page.tsx          — 대시보드 (slug resolve · tenant resolve · ClinicProfile 존재 표시)
 116: │   │   │       └── clinic-profile/
 117: │   │   │           ├── page.tsx      — server component (현재 값 SELECT)
 118: │   │   │           └── actions.ts    — saveClinicProfile (bound action — § 6.2 ADMIN-UI-31)
 119: │   │   └── api/
 120: │   │       └── health/route.ts       — DB ping
 121: │   ├── lib/
 122: │   │   ├── env.ts                    — zod 검증 · AuthConfig 생성
 123: │   │   ├── db.ts                     — postgres.Sql singleton (base role · audit emission에 사용)
 124: │   │   ├── session-cookie.ts         — read/set/clear (§ 5.1)
 125: │   │   ├── tenant.ts                 — getRequestTenantContext + withSkeletonTx 2단계 패턴 + asUuidV4 변환 (§ 5.3)
 126: │   │   ├── slug-resolver.ts          — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 5.2)
 127: │   │   ├── post-login-redirect.ts    — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 3.2)
 128: │   │   ├── deny-reason-map.ts        — AuthDenyReason 17 reasons exhaustive UI mapping (§ 5.4)
 129: │   │   └── errors.ts                 — DB CHECK / unique violation → fieldErrors
 130: │   ├── components/
 131: │   │   ├── ui/                       — shadcn/ui (Button · Input · Textarea · Label · Form · Toast)
 132: │   │   ├── dev/
 133: │   │   │   └── MockMailbox.tsx       — server-side 3중 가드
 134: │   │   └── forms/
 135: │   │       └── ClinicProfileForm.tsx — client component · form state · bound action
 136: │   └── styles/
 137: │       └── globals.css
 138: ├── src/seed.ts                       — bootstrap + system actor (§ 7.1 ADMIN-UI-29)
 139: └── README.md
 140: ```
 141: 
 142: ### 3.1 라우트 흐름
 143: 
 144: ```
 145: /                                                — cookie 없으면 /sign-in · 있으면 firstActiveMembershipSlug
 146: /sign-in                                         — 이메일 입력 form (Server Action)
 147: /sign-in/consume?identifier=&token               — GET Route Handler · § 3.2
 148: /sign-out                                        — POST Route Handler
 149: /[instanceSlug]                                  — 대시보드
 150: /[instanceSlug]/clinic-profile                   — 폼
 151: /api/health                                      — DB ping
 152: ```
 153: 
 154: ### 3.2 인증 흐름 시퀀스 (cycle2 정정 ADMIN-UI-32·33)
 155: 
 156: ```
 157: 1. user → POST /sign-in (email)
 158:    → server action (action 시그니처 = (prev, formData)):
 159:      • emailNormalized = normalizeIdentifier(formData.get('email'))
 160:      • **allowlist 체크 (cycle5 정정 ADMIN-UI-75 — self-provision 방지)**:
 161:        SELECT 1 FROM admin_user WHERE email = emailNormalized AND active = true LIMIT 1
 162:        → 없으면 emitAuditEvent('magic-link-issue-denied', payload:{ identifier, reason:'not-allowlisted' })
 163:          + UI 응답 generic "확인용 메일을 발송했습니다" (enumeration 방지) — 실제로는 메일 발송 안 함
 164:        → 있으면 진행
 165:      • issueMagicLink(sqlBase, cfg, emailNormalized) → mock mailbox 적재
 166:      • emitAuditEvent(sqlBase, { eventType:'magic-link-issued', payload:{ identifier: emailNormalized }})
 167:        (packages/auth.issueMagicLink 내부에 emit 없음 — packages/auth v0.3 cascade)
 168: 
 169: 2. user → GET /sign-in/consume?identifier=<email>&token=<raw>
 170:    → Route Handler (NextResponse 반환 — cookie set OK):
 171:      • zod 검증: identifier(email) + token(string min 16)
 172:      • try { normalizedIdentifier = await consumeMagicLink(sqlBase, identifier, token) }
 173:        catch (AuthDeniedError e) → emit 'magic-link-rejected' + reason → redirect /sign-in?reason=<r>
 174:      • admin_user lookup (ADMIN-UI-75 — 자동 INSERT 제거 · seed allowlist 만 허용):
 175:        SELECT id, display_name, active FROM admin_user WHERE email = normalizedIdentifier
 176:        • 없음 또는 inactive → emitAuditEvent('user-not-allowlisted-on-consume', payload:{ identifier }) → redirect /sign-in?reason=user-inactive
 177:      • **cycle5 정정 (ADMIN-UI-76·84) — session 발급 전 membership 검증**:
 178:        SELECT i.slug FROM instance_membership m JOIN instance i ON i.id = m.instance_id
 179:         WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
 180:         ORDER BY m.created_at LIMIT 1
 181:        • 없으면 emitAuditEvent(sqlBase, { eventType:'first-active-membership-missing', actorUserId:userId, payload:{ identifier }})
 182:          → redirect /sign-in?reason=no-active-membership (session 미발급 · cookie 미설정)
 183:        • 있으면 firstSlug = row.slug
 184:      • createSession(sqlBase, cfg, userId) → signedToken (membership 검증 통과 후에만)
 185:      • emitAuditEvent(sqlBase, { eventType:'magic-link-consumed', actorUserId:userId, payload:{ identifier }})
 186:      • emitAuditEvent(sqlBase, { eventType:'session-created', actorUserId:userId })
 187:      • emitAuditEvent(sqlBase, { eventType:'first-active-membership-resolved', actorUserId:userId, targetUserId:userId, payload:{ slug: firstSlug }})  // cycle6 ADMIN-UI-89: matrix 와 일치하도록 targetUserId 추가
 188:      • res.cookies.set('glitzy_session', signedToken, { httpOnly, secure, sameSite:'lax', maxAge:sessionTtlSeconds, path:'/' })
 189:      • redirect to /{firstSlug}
 190: 
 191: 3. user → GET /[instanceSlug]/*
 192:    → page server-side (cycle5 정정 ADMIN-UI-77·81 — sqlBase 직접 · withServiceRole 미사용):
 193:      • signedToken = readSessionCookie() · 없으면 /sign-in redirect
 194:      • session = await getActiveSession(sqlBase, cfg, signedToken)  // userId 추출 (slug audit 필요)
 195:      • instanceId = await slugResolver(sqlBase, slug, session.userId as AdminUserId)
 196:        • 없으면 notFound() (audit_event 'slug-lookup-not-found' 자동 emit · § 5.2)
 197:      • ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId)
 198:        — 실패 시 deny-reason-map.ts 으로 분기 (cookie clear · 403 · 안내)
 199: 
 200: 4. saveClinicProfile mutation Server Action (bound):
 201:    → withSkeletonTx({ ctx, fn }) = withTenantTransaction(sqlBase, { instanceId: asUuidV4(ctx.instanceId) as InstanceId })
 202:      • SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id (packages/db)
 203:      • assertActionEligibility(ctx, 'operator-edit-content')
 204:      • UPSERT clinic_profile (instance_id = ctx.instanceId 강제)
 205:    → tx commit 후 (tenant role 밖, sqlBase = base role):
 206:      • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
 207:                                   payload:{ contentType:'ClinicProfile', slug:'clinic', updatedAtBefore, updatedAtAfter }})
 208:      (tx 안에서 audit_event INSERT 가능하게 GRANT 추가하는 안 대신 commit 후 base-role emit — ADMIN-UI-36)
 209: 
 210: 5. user → POST /sign-out (ADMIN-UI-51 — actorUserId 필요로 getActiveSession 먼저)
 211:    → try {
 212:        session = await getActiveSession(sqlBase, cfg, signedToken)     // userId 추출
 213:        await revokeSession(sqlBase, cfg, signedToken)                  // DB row DELETE
 214:        await emitAuditEvent(sqlBase, { eventType:'session-revoked', actorUserId: session.userId })
 215:      } catch (AuthDeniedError e) {
 216:        // tampered / expired cookie sign-out: actorUserId 알 수 없음
 217:        await emitAuditEvent(sqlBase, { eventType:'session-revoked-anonymous', payload:{ reason: e.reason }})
 218:      }
 219:    → cookies.delete('glitzy_session') · redirect /sign-in
 220: ```
 221: 
 222: ## 4. packages 의존성
 223: 
 224: ```jsonc
 225: {
 226:   "name": "@glitzy/web",
 227:   "dependencies": {
 228:     "@glitzy/auth": "workspace:*",
 229:     "@glitzy/core-content": "workspace:*",
 230:     "@glitzy/db": "workspace:*",
 231:     "@glitzy/shared-errors": "workspace:*",
 232:     "@glitzy/shared-types": "workspace:*",
 233:     "drizzle-orm": "^0.36.4",
 234:     "next": "^14.2.0",
 235:     "postgres": "^3.4.5",
 236:     "react": "^18.3.1",
 237:     "react-dom": "^18.3.1",
 238:     "zod": "^3.23.x"
 239:   }
 240: }
 241: ```
 242: 
 243: `@glitzy/*` 모두 package version `0.1.0`. plan에서 "API shape after cycle$N patch" 라고 부르는 부분은 § SoT 의 cascade marker 가 적용된 후의 시그니처.
 244: 
 245: ## 5. 인증 · 세션 · tenant resolve 통합 명세
 246: 
 247: ### 5.1 cookie 명세 (cycle2 정정 ADMIN-UI-37·38)
 248: 
 249: | 항목 | 값 |
 250: |---|---|
 251: | 이름 | `glitzy_session` |
 252: | 값 | HMAC signed token (packages/auth) |
 253: | 속성 | `HttpOnly` · `Secure` (prod) · `SameSite=Lax` · `Path=/` · `Max-Age = sessionTtlSeconds` |
 254: | 발급 | `/sign-in/consume` Route Handler 의 NextResponse |
 255: | 폐기 | `/sign-out` Route Handler |
 256: | **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |
 257: 
 258: `lib/session-cookie.ts` 는 read/set/clear 만 노출 (sync helper 제거).
 259: 
 260: ### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)
 261: 
 262: URL `[instanceSlug]` → `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` (cycle9 정정 ADMIN-UI-105 — actorUserId 필수). **sqlBase 직접 SELECT** (withServiceRole 미사용 — instance scope 없는 control-plane lookup):
 263: 
 264: ```typescript
 265: // lib/slug-resolver.ts
 266: import { asUuidV4, type InstanceId, type AdminUserId } from "@glitzy/shared-types";
 267: import { emitAuditEvent } from "@glitzy/auth";
 268: 
 269: export async function slugResolver(
 270:   sqlBase: postgres.Sql,
 271:   slug: string,
 272:   actorUserId: AdminUserId,
 273: ): Promise<InstanceId | null> {
 274:   // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
 275:   const rows = await sqlBase<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1`;
 276:   if (rows.length === 0) {
 277:     await emitAuditEvent(sqlBase, {
 278:       eventType: "slug-lookup-not-found",
 279:       actorUserId,
 280:       reason: "instance-slug-not-found-or-inactive",
 281:       payload: { slug },
 282:     });
 283:     return null;
 284:   }
 285:   return asUuidV4(rows[0].id) as InstanceId;
 286: }
 287: ```
 288: 
 289: `ServiceRoleFunction` enum 신규 추가 (slugResolver · firstActiveMembershipResolver · adminUserUpsert) **precondition 제거**. M0 v1.0 instance-scoped service-role 작업 (예: contentMigrationApplier) 도입 시점에 enum 추가.
 290: 
 291: **actorUserId 처리**: slug resolve 는 인증된 사용자 요청 안에서 호출. cookie 없는 first hit 은 `/sign-in` redirect 우선.
 292: 
 293: **Super-admin (ADMIN-UI-17)**: skeleton 은 operator membership 만 지원. super-admin 진입 시 `super-admin-required` throw → deny-reason-map 안내 페이지.
 294: 
 295: ### 5.3 tenant context · transaction 2단계 패턴 (cycle2 정정 ADMIN-UI-30)
 296: 
 297: ```typescript
 298: // lib/tenant.ts
 299: import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
 300: import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
 301: import { asUuidV4, type InstanceId } from "@glitzy/shared-types";
 302: 
 303: export async function withSkeletonTx<T>(
 304:   args: { signedToken: string; instanceId: InstanceId },
 305:   fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
 306: ): Promise<T> {
 307:   const sql = getSqlBase();
 308:   const cfg = getAuthCfg();
 309:   // ctx.instanceId 는 plain string — branded InstanceId 로 변환 (ADMIN-UI-30)
 310:   const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
 311:   const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
 312:   return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
 313: }
 314: ```
 315: 
 316: `packages/auth.withResolvedTenantTransaction` 자체에 `SET LOCAL ROLE app_tenant_user` 가 없음 (ADMIN-UI-04) → packages/auth v0.3 cascade marker (resolve + withTenantTransaction 합성 패치). skeleton 은 자체 wrapper 로 우회.
 317: 
 318: ### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)
 319: 
 320: > **두 taxonomy 분리 명시 (ADMIN-UI-45)**:
 321: > - **UI deny reason** = `AuthDenyReason` union 17종 (packages/auth/src/errors.ts L6-L23). UI mapping/HTTP status/사용자 표시는 이 union 에 한정.
 322: > - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
 323: > - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
 324: 
 325: > **sign-in page query reason union 별도 정의 (ADMIN-UI-55)**:
 326: > ```typescript
 327: > type SignInReason =
 328: >   | AuthDenyReason  // 17 reasons
 329: >   | 'no-active-membership'   // postLoginRedirect → membership 없음
 330: >   | 'magic-link-rejected'    // consume 실패 reason 묶음 (magic-link-* 4종 별도 분기 안 할 때)
 331: > ```
 332: > `/sign-in?reason=<r>` 의 `r` 은 `SignInReason` 으로 검증. 미매핑 reason 은 generic 메시지로 fallback.
 333: 
 334: `AuthDenyReason` union 의 **실제 17 reasons** (packages/auth/src/errors.ts L6-L23) 기준 exhaustive 매핑. `assertNever` 로 build-time enforce.
 335: 
 336: | reason | UI 동작 |
 337: |---|---|
 338: | `session-not-found` · `session-expired` · `session-signature-invalid` | cookie clear · `/sign-in?reason=<r>` |
 339: | `user-inactive` | cookie clear · `/sign-in?reason=user-inactive` |
 340: | `invalid-instance-id` | 404 (페이지를 찾을 수 없습니다) |
 341: | `membership-not-found` | 403 (이 인스턴스에 접근 권한 없음) |
 342: | `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
 343: | `instance-mismatch` · `super-admin-required` | 안내 페이지 (skeleton 범위 외) |
 344: | `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
 345: | `operator-role-required` | 403 (운영자 권한 필요) |
 346: | `magic-link-expired` · `magic-link-consumed` · `magic-link-not-found` · `magic-link-invalid` | `/sign-in?reason=<r>` + emitAuditEvent `magic-link-rejected` |
 347: 
 348: `assertNever` exhaustive 체크 → union 확장 시 컴파일 fail (게이트 #9).
 349: 
 350: ### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
 351: 
 352: **audit_event 단일 SoT 포기** (ADMIN-UI-26). 두 테이블 병존:
 353: 
 354: | 테이블 | 컬럼 | 작성 경로 |
 355: |---|---|---|
 356: | `audit_event` | `id, event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload, occurred_at` (ADMIN-UI-25 — `occurred_at` 사용) | packages/auth.emitAuditEvent · base role connection (tx 밖) |
 357: | `audit_log` | `id, instance_id, actor_id, actor_role, action, metadata, ...` | packages/db.withServiceRole 자동 (pending → outcome) |
 358: 
 359: **emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
 360: 
 361: 대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
 362: 
 363: **walking skeleton event 매트릭스**:
 364: 
 365: | eventType | 테이블 | emit 위치 |
 366: |---|---|---|
 367: | `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
 368: | `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
 369: | `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
 370: | `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
 371: | `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
 372: | `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
 373: | `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
 374: | `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
 375: | `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
 376: | `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
 377: | `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |
 378: | `slug-lookup-not-found` | audit_event | `slugResolver` (sqlBase 직접 SELECT 후 null 시 emit · ADMIN-UI-54·63·69) |
 379: | ~~`admin-user-upserted`~~ (cycle5 제거 ADMIN-UI-75) | — | self-provision 방지 — consume route 자동 INSERT 제거 |
 380: | `user-not-allowlisted-on-consume` (cycle5 신규 ADMIN-UI-75) | audit_event | consume route — allowlist 미존재 사용자 시도 |
 381: | `magic-link-issue-denied` (cycle5 신규 ADMIN-UI-75) | audit_event | /sign-in Server Action — allowlist 미존재 사용자 토큰 발급 시도 |
 382: | `first-active-membership-resolved` | audit_event | consume route — instance_membership + instance JOIN SELECT 성공 (targetUserId · payload.slug — cycle5 ADMIN-UI-80 camelCase) |
 383: | `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |
 384: | `seed-completed` | audit_event | seed script — sqlBase 직접 INSERT 후 emit (§ 7.1) |
 385: 
 386: > cycle4 정정 (ADMIN-UI-63·66·67·70·71): walking skeleton 의 control-plane operation 은 모두 sqlBase 직접 호출 + audit_event emit 으로 통일. `withServiceRole` 사용 행 (slugResolver · firstActiveMembershipResolver · adminUserUpsert · seedRunner) 모두 제거.
 387: 
 388: **Gate verification query** (§ 9 #7) — 두 테이블 분리 검증:
 389: 
 390: ```sql
 391: -- audit_event
 392: SELECT event_type, actor_user_id, payload FROM audit_event
 393:  WHERE event_type IN ('tenant-resolved','content-saved','session-created')
 394:    AND occurred_at > $sinceTime
 395:  ORDER BY occurred_at;
 396: 
 397: -- audit_log: skeleton 에서는 비어 있음 (모든 control-plane operation 이 audit_event 사용 · cycle4)
 398: -- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
 399: ```
 400: 
 401: **content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
 402: 1. `saveClinicProfile` 안에서 audit emit 호출을 `try/catch` 로 감싸 **저장은 성공으로 처리** (`return { ok: true }`)
 403: 2. catch 블록에서 `console.error` + Sentry alert (M0 v1.0 Sentry 합류 시)
 404: 3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
 405: 4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.
 406: 
 407: ## 6. ClinicProfile 폼 명세 (skeleton 범위)
 408: 
 409: ### 6.1 입력 필드 (cycle2 정정 ADMIN-UI-42)
 410: 
 411: | 필드 | 입력 | zod 검증 | DB 검증 |
 412: |---|---|---|---|
 413: | `name` | text | min 1, max 100 | CHECK `clinic_profile_name_length` |
 414: | `slug` | hidden fixed `clinic` | — | CHECK regex |
 415: | `description` | textarea (maxLength=300) | min 80, max 300 | CHECK `clinic_profile_description_length` |
 416: | `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
 417: | `ogImageUrl` | text URL | 같음 | 같음 |
 418: | `businessRegistrationNumber` | text | optional · regex `^\d{3}-\d{2}-\d{5}$` | CHECK |
 419: | `alternateName` | text | optional · empty string → null normalize · max 100 | DB CHECK 없음 |
 420: | `legalEntityName` | text | optional · normalize · max 200 | DB CHECK 없음 |
 421: | `slogan` | text | optional · normalize · max 200 | DB CHECK 없음 |
 422: | `longDescription` | textarea | optional · normalize · max 2000 | DB CHECK 없음 |
 423: | `foundingDate` | date (YYYY-MM-DD) | optional · ISO 날짜 · normalize | DB type=date |
 424: | `founder` | text | optional · normalize · max 100 | DB CHECK 없음 |
 425: 
 426: **Empty-string normalize 정책**: optional 필드는 zod transform 에서 빈 문자열 → `null` 로 normalize 후 DB 전달. DB column 은 nullable 이므로 일치.
 427: 
 428: ### 6.2 Server Action `saveClinicProfile` — bound action (cycle2 정정 ADMIN-UI-31)
 429: 
 430: App Router Server Action 은 route params 를 자동 인자로 받지 않으므로 page server component 에서 **bound action** 생성:
 431: 
 432: ```typescript
 433: // /[instanceSlug]/clinic-profile/page.tsx
 434: import { saveClinicProfile as saveAction } from "./actions";
 435: export default async function Page({ params }: { params: { instanceSlug: string }}) {
 436:   const boundSave = saveAction.bind(null, params.instanceSlug);  // 첫 인자에 slug 고정
 437:   // ... <ClinicProfileForm action={boundSave} initialValue={...} />
 438: }
 439: 
 440: // /[instanceSlug]/clinic-profile/actions.ts
 441: "use server";
 442: export async function saveClinicProfile(instanceSlug: string, prev: State, formData: FormData) {
 443:   const parsed = InputSchema.safeParse(Object.fromEntries(formData));
 444:   if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten() };
 445: 
 446:   const signedToken = readSessionCookie();
 447:   // ADMIN-UI-46: peekSessionUserId 미존재 → getActiveSession 사용
 448:   const session = await getActiveSession(sqlBase, getAuthCfg(), signedToken); // throw on invalid
 449:   const instanceId = await slugResolver(sqlBase, instanceSlug, session.userId as AdminUserId);
 450:   if (!instanceId) {
 451:     // ADMIN-UI-56: redirect('/404') → notFound() (next/navigation)
 452:     notFound();
 453:   }
 454: 
 455:   const txResult = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
 456:     assertActionEligibility(ctx, "operator-edit-content");
 457:     const [before] = await tx`SELECT updated_at FROM clinic_profile WHERE instance_id = ${ctx.instanceId} AND slug = 'clinic'`;
 458:     const [after] = await tx`
 459:       INSERT INTO clinic_profile (instance_id, slug, name, description, logo_url, og_image_url, ...)
 460:         VALUES (${ctx.instanceId}, 'clinic', ${parsed.data.name}, ...)
 461:       ON CONFLICT (instance_id, slug) DO UPDATE
 462:         SET name = EXCLUDED.name, ..., updated_at = now()
 463:       RETURNING updated_at
 464:     `;
 465:     return { ctx, before, after };
 466:   });
 467: 
 468:   // tx commit 후 base-role emit (ADMIN-UI-36) + try/catch (ADMIN-UI-57)
 469:   try {
 470:     // ADMIN-UI-80 cycle5: AuditEventInput 필드명 camelCase (TypeScript helper) — DB column 은 snake_case
 471:     await emitAuditEvent(sqlBase, {
 472:       eventType: "content-saved",
 473:       actorUserId: txResult.ctx.userId,
 474:       targetUserId: txResult.ctx.userId,
 475:       toInstanceId: txResult.ctx.instanceId,
 476:       payload: {
 477:         contentType: "ClinicProfile", slug: "clinic",
 478:         updatedAtBefore: txResult.before?.updated_at ?? null,
 479:         updatedAtAfter: txResult.after.updated_at,
 480:       },
 481:     });
 482:   } catch (auditErr) {
 483:     console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
 484:     // M0 v1.0 + transactional outbox 도입 후엔 ok:false 로 전환 — skeleton 은 best-effort
 485:   }
 486: 
 487:   revalidatePath(`/${instanceSlug}/clinic-profile`);
 488:   return { ok: true };
 489: }
 490: ```
 491: 
 492: - **ADMIN-UI-31**: instanceSlug 는 page 의 bound action 첫 인자.
 493: - **ADMIN-UI-11**: instance_id 는 ctx.instanceId 강제.
 494: - **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
 495: - **ADMIN-UI-22**: last-writer-wins · audit payload updatedAtBefore/After.
 496: - **ADMIN-UI-36**: emitAuditEvent 는 tx commit **후** sqlBase 로.
 497: 
 498: ## 7. 환경변수 · config 주입
 499: 
 500: `apps/web/.env.example`:
 501: 
 502: ```
 503: WEB_DATABASE_URL=postgres://...                # **웹 런타임 connection — 최소 권한 (cycle8 정정 ADMIN-UI-97 — BYPASSRLS/owner 금지)**:
 504:                                                 #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
 505:                                                 #         GRANT SELECT ON instance TO <web_role>;
 506:                                                 #         GRANT SELECT ON admin_user TO <web_role>;             -- cycle9 정정 ADMIN-UI-103: consume route 는 lookup-only · 자동 INSERT 없음 — INSERT/UPDATE 는 SEED_DATABASE_URL 전용
 507:                                                 #         GRANT SELECT ON instance_membership TO <web_role>;
 508:                                                 #         GRANT INSERT ON audit_event TO <web_role>;
 509:                                                 #         GRANT SELECT, INSERT, UPDATE, DELETE ON "session" TO <web_role>;  -- cycle10 정정 ADMIN-UI-106: sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 (packages/auth/src/internal/session-internal.ts)
 510:                                                 #         GRANT SELECT, INSERT, UPDATE ON "verificationToken" TO <web_role>;
 511:                                                 #   (b) `SET LOCAL ROLE app_tenant_user` 가능 — `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장 — tenant role 은 명시적 SET 으로만 활성).
 512:                                                 #   (c) **BYPASSRLS·table owner 권한 금지** — RLS fail-closed 전제 (NULLIF unset context silent deny) 보장. tenant table 은 무조건 `SET LOCAL ROLE app_tenant_user` 안에서만 접근.
 513: SEED_DATABASE_URL=postgres://...               # **seed CLI / migration connection — superuser/owner** (cycle7·9 정정 ADMIN-UI-94·104):
 514:                                                 #   (a) 모든 control-plane / tenant table 의 owner 또는 superuser (idempotent INSERT/UPDATE 필요 — admin_user · instance · instance_membership)
 515:                                                 #   (b) `SET ROLE postgres` 가능 (M0 v1.0 service-role 작업 시점에만 필요 · skeleton 단계에서는 (a) 만으로 충분)
 516:                                                 # 실 구성 (개발·프로덕션): WEB_DATABASE_URL ≠ SEED_DATABASE_URL — seed 는 superuser·웹 런타임은 최소 권한 (BYPASSRLS/owner 금지). 둘을 같은 admin role 로 만드는 것은 local-only shortcut 으로만 허용 (production 금지).
 517: AUTH_SECRET=<32+ chars>
 518: MAGIC_LINK_TTL_SECONDS=900
 519: SESSION_TTL_SECONDS=86400
 520: SESSION_REFRESH_INTERVAL_SECONDS=3600           # walking skeleton 은 sliding refresh 미적용 (ADMIN-UI-37·38) — DB 만 갱신
 521: RESEND_MODE=mock                                # 허용값 (skeleton): mock | suppress-mock 만 (ADMIN-UI-73). real delivery (resend / sendgrid 등) 는 packages/auth v0.3 mail adapter 도입 후 (M0 v1.0 또는 M2). skeleton 부팅 시 env validation 에서 `mock | suppress-mock` 외 값이면 즉시 throw.
 522: DEV_MOCK_MAILBOX_VIEW=true                      # server-side only · NEXT_PUBLIC 제거 (ADMIN-UI-19)
 523: NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT=2mb         # next.config.mjs 에서 사용 (ADMIN-UI-39)
 524: NODE_ENV=development
 525: ```
 526: 
 527: `next.config.mjs`:
 528: 
 529: ```javascript
 530: export default {
 531:   experimental: {
 532:     serverActions: { bodySizeLimit: process.env.NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT ?? "2mb" },
 533:   },
 534: };
 535: ```
 536: 
 537: **Mock mailbox 노출 3중 가드** (서버사이드만 평가 · `NEXT_PUBLIC_*` 사용 X).
 538: 
 539: ### 7.1 seed script — system actor 부트스트랩 (cycle3 정정 ADMIN-UI-29·48·58)
 540: 
 541: `ServiceRoleContext.actorUserId: AdminUserId` 가 필수이므로 seed 첫 호출 시점에는 actor 가 없다. 패턴:
 542: 
 543: 1. seed script 는 **withServiceRole 사용하지 않고** 직접 sqlBase (admin role · SET ROLE postgres 가능) 로 INSERT 수행
 544: 2. system actor 행을 가장 먼저 idempotent insert (고정 UUID `00000000-0000-4000-8000-000000000001` · email `system@glitzy.internal` · `active=false`)
 545: 3. 이후 admin_user · instance · instance_membership 행 INSERT (모두 ON CONFLICT idempotent)
 546: 4. seed 자체의 audit 은 **audit_event 에 직접 INSERT** (ADMIN-UI-48 — audit_log 는 `instance_id NOT NULL` 이고 audit_event 는 nullable). emitAuditEvent helper 또는 raw INSERT 사용:
 547: 
 548: ```typescript
 549: // apps/web/src/seed.ts
 550: const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";
 551: 
 552: // 1) system actor (cycle4 정정 ADMIN-UI-64 — display_name NOT NULL)
 553: await sqlBase`
 554:   INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
 555:     VALUES (${SYSTEM_ACTOR_ID}::uuid, 'system@glitzy.internal', 'System', false, false, false, false, false)
 556:   ON CONFLICT (id) DO NOTHING
 557: `;
 558: 
 559: // 2) instance + admin_user(operator) + instance_membership (모두 idempotent ON CONFLICT)
 560: const [instanceRow] = await sqlBase`INSERT INTO instance (slug, display_name, active) VALUES (${slug}, ${name}, true) ON CONFLICT (slug) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id`;
 561: const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
 562: // cycle5 정정 ADMIN-UI-79: partial unique index `instance_membership_active_unique (user_id, instance_id) WHERE active=true` 만 존재.
 563: // ON CONFLICT inference 시 predicate 필요. inactive row 재활성화는 별도 UPDATE.
 564: await sqlBase`
 565:   WITH existing AS (
 566:     SELECT id, active FROM instance_membership
 567:      WHERE user_id = ${userRow.id}::uuid AND instance_id = ${instanceRow.id}::uuid
 568:      LIMIT 1
 569:   ), reactivate AS (
 570:     -- cycle6 정정 ADMIN-UI-87: instance_membership_deactivated_consistency CHECK 정합
 571:     -- active=true 시 deactivated_at IS NULL AND deactivated_by_user_id IS NULL 요구
 572:     UPDATE instance_membership
 573:        SET role = 'operator',
 574:            active = true,
 575:            deactivated_at = NULL,
 576:            deactivated_by_user_id = NULL,
 577:            updated_at = now()
 578:      WHERE id = (SELECT id FROM existing) AND (SELECT active FROM existing) = false
 579:      RETURNING id
 580:   ), insert_new AS (
 581:     INSERT INTO instance_membership (user_id, instance_id, role, active)
 582:     SELECT ${userRow.id}::uuid, ${instanceRow.id}::uuid, 'operator', true
 583:      WHERE NOT EXISTS (SELECT 1 FROM existing)
 584:      RETURNING id
 585:   )
 586:   SELECT id FROM reactivate UNION ALL SELECT id FROM insert_new UNION ALL SELECT id FROM existing WHERE active = true
 587: `;
 588: 
 589: // 3) seed audit — audit_event 사용 (audit_log 는 instance_id NOT NULL — ADMIN-UI-48)
 590: // ADMIN-UI-80 cycle5: column 은 snake_case (DB schema 정합)·AuditEventInput TypeScript helper 는 camelCase (targetUserId 등)
 591: await sqlBase`
 592:   INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
 593:     VALUES ('seed-completed', ${SYSTEM_ACTOR_ID}::uuid, ${instanceRow.id}::uuid, ${sqlBase.json({ slug, email, args })}::jsonb)
 594: `;
 595: ```
 596: 
 597: CLI: `pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>`.
 598: 
 599: **Migration precondition (cycle3 정정 ADMIN-UI-58)**: walking skeleton 코드가 의존하는 모든 table 의 migration 적용 필수. 각 table 의 SoT 위치:
 600: 
 601: | Table | Migration | 비고 |
 602: |---|---|---|
 603: | `instance` | `packages/db/migrations/D0010_instance.sql` | M0_SCHEMA v0.1 |
 604: | `clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` | `packages/core-content/migrations/C0001~C0005.sql` | M0_SCHEMA v0.1 |
 605: | `admin_user` · `instance_membership` · `session` · `"verificationToken"` (Auth.js compatible quoted camelCase — ADMIN-UI-82) | `apps/spike-e/migrations/002_admin_user.sql` · `003_auth_session.sql` | Spike E |
 606: | `audit_event` | `apps/spike-e/migrations/004_audit_event.sql` | Spike E |
 607: | `audit_log` | `apps/spike-a/migrations/003_audit_log.sql` | Spike A · `instance_id NOT NULL` |
 608: | pg extensions (`pgcrypto`) | `apps/spike-e/migrations/001_roles_extensions.sql` (또는 동등) | Spike A·D·E 분산 — 첫 번째 migration 가 보장 |
 609: 
 610: 향후 packages/auth/migrations · packages/db/migrations 분리 cascade 진행 시 위 mapping 갱신.
 611: 
 612: ## 8. RLS 통합 검증 — § 8.1 시나리오 (cycle2 정정 ADMIN-UI-43)
 613: 
 614: 1. own instance 정상 — SELECT 본인 row 가능.
 615: 2. cross-tenant URL 변조 → `membership-not-found` → 403.
 616: 3. slug lookup 실패 → notFound() + audit_event `slug-lookup-not-found` (cycle4 정정 ADMIN-UI-69 — sqlBase 직접 + audit_event emit).
 617: 4. session 만료 (TTL 경과 next request) → `session-expired` → /sign-in redirect.
 618: 5. session race during tx — request 시작 snapshot 정책. tx 안 revoke 되어도 현재 tx commit. next request 차단.
 619: 6. CHECK violation (description 30자) → 폼 inline 에러.
 620: 7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
 621: 8. FormData hidden `instance_id` 변조 → ctx.instanceId override · 변조값 무시.
 622: 9. Forced SQL `INSERT ... VALUES ('<other-uuid>', ...)` → RLS WITH CHECK 위반 · exception.
 623: 10. ON CONFLICT DO UPDATE foreign row → USING/WITH CHECK 모두 차단.
 624: 11. Oversized body (3MB description) → `next.config.mjs` bodySizeLimit=2mb 위반 → 413.
 625: 12. non-operator role 저장 → assertActionEligibility → `operator-role-required` → 403.
 626: 13. **Cookie HMAC tampering (ADMIN-UI-43)** — signed token 마지막 byte 변조 후 request → `session-signature-invalid` → cookie clear · /sign-in redirect · audit_event `tenant-resolve-denied` reason=`session-signature-invalid`.
 627: 
 628: ## 9. skeleton 완료 게이트
 629: 
 630: > **Precondition (cycle6 정정 ADMIN-UI-92)**: 게이트 #1·#2 의 `typecheck:all` / `build:all` script 는 루트 `package.json` 에 현재 미존재. **plan acceptance 가 아닌 구현 진입 precondition** — plan v1.0 acceptance 후 코드 작성 단계의 첫 작업으로 루트 script 추가.
 631: 
 632: | # | 게이트 | 통과 기준 |
 633: |---|---|---|
 634: | 1 | `pnpm typecheck:all` PASS | 루트 신규 script 추가 후 |
 635: | 2 | `pnpm build:all` PASS | 같음 |
 636: | 3 | `pnpm --filter @glitzy/web seed` PASS — **모든 sign-in 시도 전 필수 (ADMIN-UI-71 ordering)** | idempotent · SYSTEM_ACTOR + operator + instance + membership 생성. health check (/api/health) 가 SYSTEM_ACTOR 존재 검증. |
 637: | 4 | magic-link 로그인 | mock mailbox URL 클릭 → /sign-in/consume?identifier=&token= → 세션 cookie |
 638: | 5 | 대시보드 ctx 표시 | email · role · instanceId 출력 |
 639: | 6 | ClinicProfile 폼 저장 + RLS 격리 | § 8.1 시나리오 1~13 PASS |
 640: | 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
 641: | 8 | `pnpm --filter @glitzy/web dev` 동작 | dev 서버 기동 · /api/health 200 · response 에 `systemActorPresent: true` 포함 (preflight · ADMIN-UI-71) |
 642: | 9 | `assertNever` exhaustive 체크 PASS | deny-reason-map 이 모든 17 `AuthDenyReason` mapping (build-time enforce) |
 643: | 10 | next.config.mjs `serverActions.bodySizeLimit` 명시 (ADMIN-UI-39) | 시나리오 11 검증 가능 |
 644: 
 645: ## 10. 미결정 사항 → 최종 결정 (cycle3 정정 ADMIN-UI-59)
 646: 
 647: | ID | 항목 | 최종 결정 (close 일자 cycle) |
 648: |---|---|---|
 649: | W-01 | 저장 후 페이지 동작 — revalidatePath vs redirect | revalidatePath + inline 토스트 · cycle1 close |
 650: | W-02 | next-auth v5 wrapping vs 자체 핸들러 | 자체 핸들러 (packages/auth) · next-auth 제거 · cycle1 close |
 651: | W-03 | middleware vs layout server-side guard | **cycle4 정정 ADMIN-UI-74**: middleware 미사용 결정. `src/middleware.ts` 작성 X · cookie read 와 redirect 도 `(admin)/layout.tsx` server-side 에서 수행. middleware 도입은 M2 (multi-instance dashboard 동시 처리 필요해질 때). |
 652: | W-04 | shadcn/ui 컴포넌트 셋 | Button · Input · Textarea · Label · Form · Toast 6개 · cycle1 close |
 653: | W-05 | dev mode mock mailbox 노출 | server-side 3중 가드 (NODE_ENV · RESEND_MODE · DEV_MOCK_MAILBOX_VIEW) · cycle1 close |
 654: | W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
 655: | W-07 | super-admin instance switch UI | skeleton 범위 외 — operator membership 만 지원 · cycle1 close |
 656: 
 657: ## 11. Deferred
 658: 
 659: § 1.3 표 참조.
 660: 
 661: ## 12. SoT cascade (cycle2 — 코드 작성 진입 전 적용 우선순위)
 662: 
 663: > **선행 patch (acceptance precondition)**: walking skeleton 코드 작성 전 반드시 적용.
 664: 
 665: | 대상 | cascade | 상태 |
 666: |---|---|---|
 667: | ~~`packages/shared-types/src/index.ts` `ServiceRoleFunction` enum~~ | ~~precondition~~ | **cycle4 제거 (ADMIN-UI-68)** — sqlBase 직접 호출로 변경되어 enum 추가 불필요. M0 v1.0 cascade marker (instance-scoped service-role function 추가 시점). |
 668: | 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
 669: | `docs/admin/ARCHITECTURE.md` § 10 미결정 A-01·A-02·A-03 close (cycle8 정정 ADMIN-UI-98) — A-01·A-02·A-03 의 plan 결정 (Next.js 14·PostgreSQL·packages/auth 자체 핸들러) 은 본 plan 안에서만 확정 · admin/ARCHITECTURE v0.8 patch 는 plan acceptance 후 follow-up cascade | v0.8 patch | **follow-up (acceptance non-blocking)** |
 670: | `docs/decisions/PACKAGES_STRUCTURE.md` v0.2 patch (cycle6·8 정정 ADMIN-UI-91·99) — `@glitzy/auth` placeholder 분류 제거 (실제 issueMagicLink·createSession·resolveTenantContext·emitAuditEvent export 중), `@glitzy/core-content` 상태 갱신 (6 tables 추가), apps/web entry 및 dependency arrow 명시 | v0.2 patch | **follow-up (acceptance non-blocking)** |
 671: | `tsconfig.base.json` path alias 정합 검증 | review | **구현 진입 precondition** |
 672: 
 673: > **별도 cycle (M0 v1.0 또는 separate cascade)**: skeleton 우회 가능 — wrapper 또는 분기로 처리.
 674: 
 675: | 대상 | cascade |
 676: |---|---|
 677: | `docs/decisions/INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 Auth.js/next-auth 전제 → packages/auth 자체 handler reversal (ADMIN-UI-67 — follow-up cascade · acceptance 후) |
 678: | `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E Auth.js provider gate → packages/auth 자체 handler 기준 (ADMIN-UI-67 — 같음) |
 679: | `packages/auth` v0.3 — `withResolvedTenantTransaction` 에 `withTenantTransaction` 합성 (ADMIN-UI-04) — skeleton 은 자체 `withSkeletonTx` 로 우회 |
 680: | `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
 681: | `packages/auth` v0.3 — `consumeMagicLink` 가 identifier 반환 유지 + 별도 allowlist lookup helper 검토 (cycle8 정정 ADMIN-UI-101 — cycle7 self-provision 제거 정합 · upsert 표현 제거) — skeleton 은 consume route 에서 admin_user **lookup-only** 수행 (allowlist 미존재 → reject) |
 682: | `packages/auth` v0.3 — `resolveTenantContext` 반환에 `sessionRefreshed` 플래그 (ADMIN-UI-03·38) — skeleton 은 sliding refresh 미적용 |
 683: | `packages/auth` v0.3 — inactive membership 분기 추가 (ADMIN-UI-35) — skeleton mapping 은 unreachable 표시 |
 684: | `packages/auth/migrations` 신규 — auth tables 를 apps/spike-e/migrations 에서 이전 + audit_event RLS/GRANT 추가 (ADMIN-UI-36·13) — skeleton 은 spike-e migrations 직접 적용 |
 685: | (ADMIN-UI-52 — shared-types cascade 중복 제거 · 위 precondition 단일화) |
 686: | `packages/core-content` v0.3 — logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique (ADMIN-UI-09·10) — skeleton 은 zod-only + fixed slug |
 687: | `packages/db` v0.2 — `audit_event` 와 `audit_log` 통합 방향 결정 (ADMIN-UI-06·26) — skeleton 은 두 테이블 분리 검증 |
 688: | Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |
 689: 
 690: ## 13. Codex 비평 cycle 운영 방침
 691: 
 692: closeableAfterPatch 신호 수렴 기준. cycle1=24, cycle2=20, cycle3=18, cycle4=12, cycle5=12, cycle6=6, cycle7=4, cycle8=6, cycle9=3, cycle10=2, **cycle11=0** (11 cycle 누계 107 findings · `ready_for_acceptance=true` 확정).
 693: 
 694: ## 14. 변경 이력 (최신순 · cycle5 ADMIN-UI-86 명시)
 695: 
 696: | 일자 | 버전 | 변경 |
 697: |---|---|---|
 698: | 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
 699: | 2026-05-15 | v0.11 | **cycle10 patch (2 findings · major 1 · minor 1 · nit 0 전건 처리)**: (1) ADMIN-UI-106 WEB_DATABASE_URL `GRANT SELECT, INSERT, DELETE ON session` → `GRANT SELECT, INSERT, UPDATE, DELETE ON "session"` 로 정정 (sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 · packages/auth/src/internal/session-internal.ts 정합), (2) ADMIN-UI-107 두 번째 SEED_DATABASE_URL 중복 블록 실 본문 삭제 (cycle9 변경 이력만 기록·본문 잔존이었음) |
 700: | 2026-05-15 | v0.10 | **cycle9 patch (3 findings · major 1 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-103 WEB_DATABASE_URL `GRANT SELECT, INSERT ON admin_user` → `GRANT SELECT` 로 좁힘 (consume route lookup-only 정합), (2) ADMIN-UI-104 SEED_DATABASE_URL 중복 블록 제거 — WEB ≠ SEED 분리 명시 + local-only shortcut 단서, (3) ADMIN-UI-105 § 5.2 요약 시그니처 `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` 로 정정 |
 701: | 2026-05-15 | v0.9 | **cycle8 patch (6 findings · major 3 · minor 3 · nit 0 전건 처리)**: (1) ADMIN-UI-97 WEB_DATABASE_URL 권한을 BYPASSRLS/owner 금지로 좁힘 — control-plane table별 명시적 GRANT 목록 + `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장) 으로 RLS fail-closed 보장, (2) ADMIN-UI-98 admin/ARCHITECTURE § 10 A-01·A-02·A-03 cascade 를 follow-up (acceptance non-blocking) 으로 낮춤 — plan 본문 결정은 plan 안에서 확정, (3) ADMIN-UI-99 PACKAGES_STRUCTURE v0.2 patch 도 follow-up 으로 낮춤, (4) ADMIN-UI-100 apps/web tree 주석 (slug-resolver · post-login-redirect) 의 service-role 잔재 제거, (5) ADMIN-UI-101 § 12 cascade 의 consumeMagicLink upsert 표현 제거 → `identifier 반환 유지 + 별도 allowlist lookup helper`, (6) ADMIN-UI-102 SoT bullet RLS 인용 byte-level 정합 — `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` |
 702: | 2026-05-15 | v0.8 | **cycle7 patch (4 findings · major 2 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-93 § 1.2 표 `/sign-in/consume` 책임을 `admin_user lookup/active check (allowlist 만 — 자동 INSERT 없음)` 로 정정 + cycle4 핵심 결정 문구의 `admin_user upsert` 가 seed 단계 한정임을 명시 (consume route 는 lookup-only), (2) ADMIN-UI-94 DATABASE_URL 을 WEB_DATABASE_URL (control-plane SELECT/INSERT + app_tenant_user role grant) + SEED_DATABASE_URL (M0 v1.0 service-role 작업 시점에 postgres role 추가) 로 분리 — 웹 런타임 과권한 제거, (3) ADMIN-UI-95·96 cascade — PACKAGES_STRUCTURE.md v0.2 + admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 close 는 plan acceptance 와 분리된 follow-up cascade |
 703: | 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
 704: | 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
 705: | 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
 706: | 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
 707: | 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
 708: | 2026-05-15 | v0.2 | cycle1 patch (24 findings 처리) — A-03 자체 핸들러 close · withSkeletonTx 2단계 · audit_event 단일 SoT · slug service-role · seed precondition · deny mapping · super-admin defer · 시나리오 6개 추가 등 |
 709: | 2026-05-15 | v0.1 | 최초 작성 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/schema.ts | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/db/migrations/D0010_instance.sql | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/auth/src/resolve-tenant-context.ts | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/migrations-runner/src/manifest.ts | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 844ms:
   1: -- @glitzy/db — D0010 Instance (multi-tenant root)
   2: -- M0 vertical slice·DATA_MODEL C-08 InstanceManifest의 minimal projection
   3: 
   4: CREATE TABLE instance (
   5:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   6:   slug TEXT NOT NULL UNIQUE,  -- subdomain·routing key (예: clinic-abc)
   7:   display_name TEXT NOT NULL,
   8:   active BOOLEAN NOT NULL DEFAULT true,
   9:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  10:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  11:   -- M0-16 cycle2: DATA_MODEL @id 3~64자 (`{2,63}` = 첫 1자 + 2~63자 = 3~64자)
  12:   CONSTRAINT instance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  13:   CONSTRAINT instance_display_name_length CHECK (length(display_name) BETWEEN 1 AND 200)
  14: );
  15: 
  16: CREATE INDEX instance_active_idx ON instance (active) WHERE active = true;
  17: CREATE INDEX instance_slug_active_idx ON instance (slug) WHERE active = true;
  18: 
  19: -- M0-15 cycle2: instance는 control-plane table — super-admin·service_role만 접근
  20: -- tenant user는 자기 instance 정보 SELECT만 (lookup·routing 용도)·다른 instance 접근 차단
  21: -- RLS 적용 후 tenant role read는 NULLIF wrapping
  22: ALTER TABLE instance ENABLE ROW LEVEL SECURITY;
  23: ALTER TABLE instance FORCE ROW LEVEL SECURITY;
  24: 
  25: CREATE POLICY instance_tenant_read ON instance
  26:   FOR SELECT TO app_tenant_user
  27:   USING (id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  28: 
  29: -- super_admin·service_role은 explicit role grant·tenant role은 SELECT 만 부여
  30: GRANT SELECT ON instance TO app_tenant_user;

 succeeded in 856ms:
   1: // @glitzy/auth/resolve-tenant-context — server-side 매 요청 재검증
   2: // Spike E LOCAL_PASS 패턴 그대로·env 의존 제거·cfg 주입
   3: 
   4: import type postgres from "postgres";
   5: import { UUID_V4_REGEX, type TenantRole, type EffectiveRole } from "@glitzy/shared-types";
   6: 
   7: import { TenantResolveError, AuthDeniedError } from "./errors.js";
   8: import { getActiveSession, type SessionRow } from "./session.js";
   9: import { refreshSessionByDbToken } from "./internal/session-internal.js";
  10: import { emitAuditEvent } from "./audit.js";
  11: import type { AuthConfig } from "./config.js";
  12: 
  13: export type AdminUserRow = {
  14:   id: string;
  15:   email: string;
  16:   active: boolean;
  17:   is_super_admin: boolean;
  18:   legal_reviewer_eligible: boolean;
  19:   physician_reviewer_eligible: boolean;
  20:   client_approver_eligible: boolean;
  21: };
  22: 
  23: export type TenantContext = {
  24:   readonly userId: string;
  25:   readonly email: string;
  26:   readonly instanceId: string;
  27:   readonly role: EffectiveRole;
  28:   readonly isSuperAdmin: boolean;
  29:   readonly sessionToken: string;
  30:   readonly user: AdminUserRow;
  31: };
  32: 
  33: type MembershipRow = { id: string; instance_id: string; role: TenantRole; active: boolean };
  34: 
  35: function validateInstanceId(value: unknown): string {
  36:   if (typeof value !== "string") throw new TenantResolveError("invalid-instance-id", "requestedInstanceId not string");
  37:   if (value.length !== 36) throw new TenantResolveError("invalid-instance-id", `UUID length must be 36, got ${value.length}`);
  38:   if (!UUID_V4_REGEX.test(value)) throw new TenantResolveError("invalid-instance-id", `malformed UUID`);
  39:   return value.toLowerCase();
  40: }
  41: 
  42: export async function resolveTenantContext(
  43:   sql: postgres.Sql,
  44:   cfg: AuthConfig,
  45:   signedToken: string,
  46:   requestedInstanceId: string,
  47: ): Promise<TenantContext> {
  48:   let normalized: string;
  49:   try {
  50:     normalized = validateInstanceId(requestedInstanceId);
  51:   } catch (err) {
  52:     await emitAuditEvent(sql, {
  53:       eventType: "tenant-resolve-denied",
  54:       reason: "invalid-instance-id",
  55:       payload: { requestedInstanceIdSample: String(requestedInstanceId).slice(0, 100) },
  56:     });
  57:     throw err;
  58:   }
  59: 
  60:   // cycle3 major fix: session-expired·session-not-found·session-signature-invalid 구분 보존
  61:   let session: SessionRow;
  62:   try {
  63:     session = await getActiveSession(sql, cfg, signedToken);
  64:   } catch (err) {
  65:     const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  66:     await emitAuditEvent(sql, {
  67:       eventType: "tenant-resolve-denied",
  68:       reason,
  69:       payload: { requestedInstanceId: normalized },
  70:     });
  71:     if (err instanceof AuthDeniedError) {
  72:       // 동일 reason 유지·TenantResolveError로 변환
  73:       throw new TenantResolveError(err.reason, err.message);
  74:     }
  75:     throw new TenantResolveError("session-not-found", "session invalid");
  76:   }
  77: 
  78:   const userRows = await sql<AdminUserRow[]>`
  79:     SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
  80:     FROM admin_user WHERE id = ${session.userId}
  81:   `;
  82:   if (userRows.length === 0) {
  83:     await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: session.userId, reason: "user-not-found" });
  84:     throw new TenantResolveError("session-not-found", "user not found");
  85:   }
  86:   const user = userRows[0]!;
  87:   if (!user.active) {
  88:     await emitAuditEvent(sql, { eventType: "inactive-user-rejected", actorUserId: user.id, payload: { requestedInstanceId: normalized } });
  89:     throw new TenantResolveError("user-inactive", "user inactive");
  90:   }
  91: 
  92:   let effectiveInstanceId: string;
  93:   let effectiveRole: EffectiveRole;
  94: 
  95:   if (user.is_super_admin) {
  96:     if (session.superAdminSelectedInstanceId === null) {
  97:       await emitAuditEvent(sql, {
  98:         eventType: "tenant-resolve-denied",
  99:         actorUserId: user.id,
 100:         toInstanceId: normalized,
 101:         reason: "super-admin-not-switched",
 102:       });
 103:       throw new TenantResolveError("super-admin-required", "super-admin must switch instance first");
 104:     }
 105:     if (session.superAdminSelectedInstanceId !== normalized) {
 106:       await emitAuditEvent(sql, {
 107:         eventType: "tenant-resolve-denied",
 108:         actorUserId: user.id,
 109:         fromInstanceId: session.superAdminSelectedInstanceId,
 110:         toInstanceId: normalized,
 111:         reason: "super-admin-selected-mismatch",
 112:       });
 113:       throw new TenantResolveError("instance-mismatch", "super-admin selected != requested");
 114:     }
 115:     effectiveInstanceId = session.superAdminSelectedInstanceId;
 116:     effectiveRole = "super-admin";
 117:   } else {
 118:     const memRows = await sql<MembershipRow[]>`
 119:       SELECT id, instance_id, role, active FROM instance_membership
 120:       WHERE user_id = ${user.id} AND instance_id = ${normalized}::uuid AND active = true
 121:     `;
 122:     if (memRows.length === 0) {
 123:       await emitAuditEvent(sql, {
 124:         eventType: "tenant-resolve-denied",
 125:         actorUserId: user.id,
 126:         toInstanceId: normalized,
 127:         reason: "membership-not-found-or-inactive",
 128:       });
 129:       throw new TenantResolveError("membership-not-found", "no active membership");
 130:     }
 131:     const mem = memRows[0]!;
 132:     effectiveRole = mem.role;
 133: 
 134:     if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
 135:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
 136:       throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
 137:     }
 138:     if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
 139:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
 140:       throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
 141:     }
 142:     if (mem.role === "client-approver" && !user.client_approver_eligible) {
 143:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
 144:       throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
 145:     }
 146: 
 147:     effectiveInstanceId = mem.instance_id;
 148:   }
 149: 
 150:   const sinceRefresh = (Date.now() - session.lastRefreshedAt.getTime()) / 1000;
 151:   if (sinceRefresh > cfg.sessionRefreshIntervalSeconds) {
 152:     await refreshSessionByDbToken(sql, cfg, session.sessionToken);
 153:   }
 154: 
 155:   await emitAuditEvent(sql, {
 156:     eventType: "tenant-resolved",
 157:     actorUserId: user.id,
 158:     toInstanceId: effectiveInstanceId,
 159:     payload: { role: effectiveRole, isSuperAdmin: user.is_super_admin },
 160:   });
 161: 
 162:   return {
 163:     userId: user.id,
 164:     email: user.email,
 165:     instanceId: effectiveInstanceId,
 166:     role: effectiveRole,
 167:     isSuperAdmin: user.is_super_admin,
 168:     sessionToken: session.sessionToken,
 169:     user,
 170:   };
 171: }
 172: 
 173: /**
 174:  * withResolvedTenantTransaction — resolveTenantContext + SET LOCAL app.current_instance_id
 175:  */
 176: export async function withResolvedTenantTransaction<T>(
 177:   sql: postgres.Sql,
 178:   cfg: AuthConfig,
 179:   signedToken: string,
 180:   requestedInstanceId: string,
 181:   fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>,
 182: ): Promise<{ ctx: TenantContext; result: T }> {
 183:   const ctx = await resolveTenantContext(sql, cfg, signedToken, requestedInstanceId);
 184:   const result = await sql.begin(async (tx) => {
 185:     await tx`SELECT set_config('app.current_instance_id', ${ctx.instanceId}, true)`;
 186:     return fn(tx, ctx);
 187:   }) as T;
 188:   return { ctx, result };
 189: }
 190: 
 191: /**
 192:  * Action eligibility — REVIEW_WORKFLOW 14 actions exhaustive
 193:  */
 194: export type ActionType =
 195:   | "legal-review-approve" | "legal-review-reject" | "legal-review-request-changes" | "legal-review-delegate"
 196:   | "physician-review-approve" | "physician-review-reject" | "physician-review-request-changes" | "physician-review-delegate"
 197:   | "client-approval-approve" | "client-approval-reject" | "client-approval-request-changes"
 198:   | "operator-publish" | "operator-unpublish" | "operator-edit-content";
 199: 
 200: export function assertActionEligibility(ctx: TenantContext, action: ActionType): void {
 201:   switch (action) {
 202:     case "legal-review-approve":
 203:     case "legal-review-reject":
 204:     case "legal-review-request-changes":
 205:     case "legal-review-delegate":
 206:       if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
 207:       return;
 208:     case "physician-review-approve":
 209:     case "physician-review-reject":
 210:     case "physician-review-request-changes":
 211:     case "physician-review-delegate":
 212:       if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
 213:       return;
 214:     case "client-approval-approve":
 215:     case "client-approval-reject":
 216:     case "client-approval-request-changes":
 217:       if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
 218:       return;
 219:     case "operator-publish":
 220:     case "operator-unpublish":
 221:     case "operator-edit-content":
 222:       if (ctx.role === "operator" || ctx.role === "super-admin") return;
 223:       throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
 224:     default: {
 225:       const _exhaustive: never = action;
 226:       throw new Error(`unknown action: ${String(_exhaustive)}`);
 227:     }
 228:   }
 229: }

 succeeded in 913ms:
   1: // @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
   2: // M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
   3: // v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
   4: 
   5: import { sql } from "drizzle-orm";
   6: import {
   7:   pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
   8:   pgEnum, index, foreignKey, check, unique, uniqueIndex,
   9: } from "drizzle-orm/pg-core";
  10: 
  11: // === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===
  12: 
  13: export const instance = pgTable(
  14:   "instance",
  15:   {
  16:     id: uuid("id").primaryKey().defaultRandom(),
  17:     slug: text("slug").notNull().unique(),
  18:     displayName: text("display_name").notNull(),
  19:     active: boolean("active").notNull().default(true),
  20:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  21:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  22:   },
  23:   (t) => ({
  24:     slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  25:     displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
  26:     activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
  27:     slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
  28:   }),
  29: );
  30: 
  31: // === Shared enums (C-03·C-04) ===
  32: export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
  33:   "draft", "review-queued", "in-review", "approved", "publishable",
  34:   "published", "blocked", "rejected", "stale",
  35: ]);
  36: 
  37: export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
  38: 
  39: // LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
  40: export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
  41:   "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
  42: ]);
  43: 
  44: // === ClinicProfile (C-01) ===
  45: 
  46: export const clinicProfile = pgTable(
  47:   "clinic_profile",
  48:   {
  49:     id: uuid("id").primaryKey().defaultRandom(),
  50:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  51:     slug: text("slug").notNull().default("clinic"),
  52:     name: text("name").notNull(),
  53:     alternateName: text("alternate_name"),
  54:     legalEntityName: text("legal_entity_name"),
  55:     slogan: text("slogan"),
  56:     description: text("description").notNull(),
  57:     longDescription: text("long_description"),
  58:     foundingDate: date("founding_date"),
  59:     founder: text("founder"),
  60:     logoUrl: text("logo_url").notNull(),
  61:     ogImageUrl: text("og_image_url").notNull(),
  62:     businessRegistrationNumber: text("business_registration_number"),
  63:     // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
  64:     policyContactPerson: text("policy_contact_person"),
  65:     policyContactEmail: text("policy_contact_email"),
  66:     policyContactPhone: text("policy_contact_phone"),
  67:     policyEffectiveDate: date("policy_effective_date"),
  68:     // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
  69:     primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
  70:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  71:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  72:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  73:   },
  74:   (t) => ({
  75:     nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
  76:     descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
  77:     slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  78:     brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
  79:     // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
  80:     policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  81:     policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
  82:     primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
  83:     // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
  84:     instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
  85:     instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
  86:     instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  87:   }),
  88: );
  89: 
  90: // === LocationProfile (C-21·M0-18 country regex) ===
  91: 
  92: export const locationProfile = pgTable(
  93:   "location_profile",
  94:   {
  95:     id: uuid("id").primaryKey().defaultRandom(),
  96:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  97:     slug: text("slug").notNull(),
  98:     name: text("name").notNull(),
  99:     streetAddress: text("street_address").notNull(),
 100:     addressLocality: text("address_locality").notNull(),
 101:     addressRegion: text("address_region").notNull(),
 102:     postalCode: text("postal_code").notNull(),
 103:     addressCountry: text("address_country").notNull().default("KR"),
 104:     latitude: numeric("latitude", { precision: 10, scale: 7 }),
 105:     longitude: numeric("longitude", { precision: 10, scale: 7 }),
 106:     phone: text("phone"),
 107:     email: text("email"),
 108:     // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
 109:     clinicProfileId: uuid("clinic_profile_id").notNull(),
 110:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 111:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 112:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 113:   },
 114:   (t) => ({
 115:     slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
 116:     countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
 117:     latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
 118:     lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
 119:     emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
 120:     // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
 121:     phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
 122:     // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
 123:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
 124:     clinicFk: foreignKey({
 125:       columns: [t.instanceId, t.clinicProfileId],
 126:       foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
 127:       name: "location_profile_clinic_fk",
 128:     }).onDelete("cascade"),
 129:     instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
 130:     instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
 131:     instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
 132:     clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
 133:   }),
 134: );
 135: 
 136: // === DoctorProfile (C-02) ===
 137: 
 138: export const doctorProfile = pgTable(
 139:   "doctor_profile",
 140:   {
 141:     id: uuid("id").primaryKey().defaultRandom(),
 142:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 143:     slug: text("slug").notNull(),
 144:     name: text("name").notNull(),
 145:     title: text("title"),
 146:     jobTitle: text("job_title"),
 147:     honorific: text("honorific"),
 148:     bio: text("bio"),
 149:     photoUrl: text("photo_url"),
 150:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 151:     displayOrder: integer("display_order").notNull().default(0),
 152:     active: boolean("active").notNull().default(true),
 153:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 154:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 155:   },
 156:   (t) => ({
 157:     slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
 158:     nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
 159:     instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
 160:     instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
 161:     instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
 162:     activeOrderIdx: index("doctor_profile_active_order_idx")
 163:       .on(t.instanceId, t.active, t.displayOrder)
 164:       .where(sql`${t.active} = true`),
 165:   }),
 166: );
 167: 
 168: // === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===
 169: 
 170: export const treatmentPage = pgTable(
 171:   "treatment_page",
 172:   {
 173:     id: uuid("id").primaryKey().defaultRandom(),
 174:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 175:     slug: text("slug").notNull(),
 176:     title: text("title").notNull(),
 177:     summary: text("summary").notNull(),
 178:     bodyMarkdown: text("body_markdown").notNull(),
 179:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 180:     riskLevel: riskLevelEnum("risk_level"),
 181:     complianceRecordId: uuid("compliance_record_id"),
 182:     heroImageUrl: text("hero_image_url"),
 183:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 184:     publishedAt: timestamp("published_at", { withTimezone: true }),
 185:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 186:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 187:   },
 188:   (t) => ({
 189:     slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
 190:     titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
 191:     summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
 192:     publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
 193:     instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
 194:     instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
 195:     instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
 196:     statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
 197:     publishedIdx: index("treatment_page_published_idx")
 198:       .on(t.instanceId, t.publishedAt)
 199:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
 200:   }),
 201: );
 202: 
 203: // === Article (C-04·M0-05 ON DELETE NO ACTION) ===
 204: 
 205: export const article = pgTable(
 206:   "article",
 207:   {
 208:     id: uuid("id").primaryKey().defaultRandom(),
 209:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 210:     slug: text("slug").notNull(),
 211:     title: text("title").notNull(),
 212:     summary: text("summary").notNull(),
 213:     bodyMarkdown: text("body_markdown").notNull(),
 214:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 215:     riskLevel: riskLevelEnum("risk_level"),
 216:     complianceRecordId: uuid("compliance_record_id"),
 217:     heroImageUrl: text("hero_image_url"),
 218:     authorDoctorId: uuid("author_doctor_id"),
 219:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 220:     publishedAt: timestamp("published_at", { withTimezone: true }),
 221:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 222:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 223:   },
 224:   (t) => ({
 225:     slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
 226:     titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
 227:     summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
 228:     publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
 229:     instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
 230:     instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
 231:     instanceIdx: index("article_instance_idx").on(t.instanceId),
 232:     statusIdx: index("article_status_idx").on(t.instanceId, t.status),
 233:     publishedIdx: index("article_published_idx")
 234:       .on(t.instanceId, t.publishedAt)
 235:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
 236:     authorIdx: index("article_author_idx")
 237:       .on(t.instanceId, t.authorDoctorId)
 238:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
 239:     // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
 240:     authorFk: foreignKey({
 241:       columns: [t.instanceId, t.authorDoctorId],
 242:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
 243:       name: "article_author_fk",
 244:     }),
 245:   }),
 246: );
 247: 
 248: // === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
 249: 
 250: export const legalDocument = pgTable(
 251:   "legal_document",
 252:   {
 253:     id: uuid("id").primaryKey().defaultRandom(),
 254:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 255:     slug: text("slug").notNull(),
 256:     documentType: legalDocumentTypeEnum("document_type").notNull(),
 257:     title: text("title").notNull(),
 258:     body: text("body").notNull(),
 259:     autoGenerated: boolean("auto_generated").notNull().default(true),
 260:     templateVersion: text("template_version"),
 261:     // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
 262:     effectiveDate: date("effective_date").notNull(),
 263:     lastRevisedDate: date("last_revised_date"),
 264:     contactPerson: text("contact_person"),
 265:     contactEmail: text("contact_email"),
 266:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 267:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
 268:     publishedAt: timestamp("published_at", { withTimezone: true }),
 269:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 270:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 271:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 272:   },
 273:   (t) => ({
 274:     slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
 275:     titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
 276:     bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
 277:     emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
 278:     // LL-SCHEMA-05 + cycle1 LL-22
 279:     templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
 280:     autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
 281:     // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
 282:     statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
 283:     publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
 284:     // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
 285:     riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
 286:     instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
 287:     instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
 288:     // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
 289:     type5Unique: uniqueIndex("legal_document_instance_5type_unique")
 290:       .on(t.instanceId, t.documentType)
 291:       .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
 292:     instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
 293:   }),
 294: );

 succeeded in 874ms:
   1: // @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
   2: // SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
   3: //
   4: // 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
   5: // 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
   6: // plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
   7: //
   8: // orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
   9: // 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
  10: 
  11: export type MigrationDescriptor = {
  12:   /** 미가공 절대 경로 (repo root 기준 상대) */
  13:   readonly file: string;
  14:   /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
  15:   readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
  16:   /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
  17:   readonly creates: ReadonlyArray<string>;
  18:   /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
  19:   readonly dependsOn: ReadonlyArray<string>;
  20: };
  21: 
  22: /**
  23:  * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
  24:  * runner 는 이 배열 순서대로 sequential apply (fail-fast).
  25:  */
  26: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
  27:   // (1) instance (multi-tenant root)
  28:   {
  29:     file: "packages/db/migrations/D0010_instance.sql",
  30:     package: "@glitzy/db",
  31:     creates: ["instance"],
  32:     dependsOn: [],
  33:   },
  34:   // (2) clinic_profile
  35:   {
  36:     file: "packages/core-content/migrations/C0001_clinic_profile.sql",
  37:     package: "@glitzy/core-content",
  38:     creates: ["clinic_profile"],
  39:     dependsOn: ["instance"],
  40:   },
  41:   // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
  42:   {
  43:     file: "packages/core-content/migrations/C0002_location_profile.sql",
  44:     package: "@glitzy/core-content",
  45:     creates: ["location_profile"],
  46:     dependsOn: ["instance"],
  47:   },
  48:   // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
  49:   {
  50:     file: "packages/core-content/migrations/C0003_doctor_profile.sql",
  51:     package: "@glitzy/core-content",
  52:     creates: ["doctor_profile"],
  53:     dependsOn: ["instance"],
  54:   },
  55:   // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
  56:   {
  57:     file: "packages/core-content/migrations/C0004_treatment_page.sql",
  58:     package: "@glitzy/core-content",
  59:     creates: ["treatment_page", "content_publication_status"],
  60:     dependsOn: ["instance"],
  61:   },
  62:   // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
  63:   {
  64:     file: "packages/core-content/migrations/C0005_article.sql",
  65:     package: "@glitzy/core-content",
  66:     creates: ["article", "risk_level"],
  67:     dependsOn: ["instance", "doctor_profile", "content_publication_status"],
  68:   },
  69:   // (7) legal_document — content_publication_status + risk_level enum FK
  70:   {
  71:     file: "packages/core-content/migrations/C0006_legal_document.sql",
  72:     package: "@glitzy/core-content",
  73:     creates: ["legal_document", "legal_document_type"],
  74:     dependsOn: ["instance", "content_publication_status", "risk_level"],
  75:   },
  76:   // (8) clinic_profile policy + primary_ctas (ALTER)
  77:   {
  78:     file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
  79:     package: "@glitzy/core-content",
  80:     creates: [
  81:       "clinic_profile.policy_contact_person",
  82:       "clinic_profile.policy_contact_email",
  83:       "clinic_profile.policy_contact_phone",
  84:       "clinic_profile.policy_effective_date",
  85:       "clinic_profile.primary_ctas",
  86:       "clinic_profile_primary_ctas_validate",
  87:       "clinic_profile_primary_ctas_trigger",
  88:     ],
  89:     dependsOn: ["clinic_profile"],
  90:   },
  91:   // (9) location_profile parentClinic composite FK (ALTER)
  92:   {
  93:     file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
  94:     package: "@glitzy/core-content",
  95:     creates: [
  96:       "location_profile.clinic_profile_id",
  97:       "location_profile_clinic_fk",
  98:       "location_profile_clinic_idx",
  99:     ],
 100:     dependsOn: ["clinic_profile", "location_profile"],
 101:   },
 102: ];
 103: 
 104: /**
 105:  * validateManifest — runner 가 sequential apply 직전 호출.
 106:  * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
 107:  * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
 108:  */
 109: export function validateManifest(): ReadonlyArray<string> {
 110:   const errors: string[] = [];
 111:   const seen = new Set<string>();
 112:   for (const [i, m] of orderedMigrations.entries()) {
 113:     for (const dep of m.dependsOn) {
 114:       if (!seen.has(dep)) {
 115:         errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
 116:       }
 117:     }
 118:     for (const c of m.creates) seen.add(c);
 119:   }
 120:   return errors;
 121: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Recurse apps/web/src/app | Select-Object FullName | ForEach-Object { $_.FullName.Replace((Resolve-Path .).Path + '"'\\\\','') }" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/app/layout.tsx | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/app/'"'(admin)'/layout.tsx | ForEach-Object { '{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/tenant.ts | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 700ms:
   1: // @glitzy/web/lib/tenant — withSkeletonTx 2단계 패턴 (Plan v1.0 § 5.3 ADMIN-UI-04·30)
   2: // packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회
   3: 
   4: import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
   5: import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
   6: import { asUuidV4, type InstanceId } from "@glitzy/shared-types";
   7: 
   8: import { getSqlBase } from "./db";
   9: import { getAuthCfg } from "./env";
  10: 
  11: /**
  12:  * Plan § 5.3: 2단계 패턴
  13:  *   1) resolveTenantContext (signature 검증 · TTL · membership · eligibility · audit)
  14:  *   2) withTenantTransaction (SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id)
  15:  */
  16: export async function withSkeletonTx<T>(
  17:   args: { signedToken: string; instanceId: InstanceId },
  18:   fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
  19: ): Promise<T> {
  20:   const sql = getSqlBase();
  21:   const cfg = getAuthCfg();
  22:   const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
  23:   // ctx.instanceId 는 plain string · branded InstanceId 변환 (ADMIN-UI-30)
  24:   const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  25:   return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
  26: }

 succeeded in 718ms:
   1: // @glitzy/web — root layout (Plan v1.0 § 3)
   2: import type { Metadata } from "next";
   3: import "@/styles/globals.css";
   4: 
   5: export const metadata: Metadata = {
   6:   title: "Glitzy 어드민",
   7:   description: "M0 walking skeleton",
   8: };
   9: 
  10: export default function RootLayout({ children }: { children: React.ReactNode }) {
  11:   return (
  12:     <html lang="ko">
  13:       <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
  14:     </html>
  15:   );
  16: }

 succeeded in 731ms:
   1: // @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
   2: // middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
   3: 
   4: import { redirect } from "next/navigation";
   5: import { AuthDeniedError, getActiveSession } from "@glitzy/auth";
   6: 
   7: import { getAuthCfg } from "@/lib/env";
   8: import { getSqlBase } from "@/lib/db";
   9: import { readSessionCookie } from "@/lib/session-cookie";
  10: 
  11: export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  12:   const signedToken = readSessionCookie();
  13:   if (!signedToken) {
  14:     redirect("/sign-in");
  15:   }
  16: 
  17:   // session signature 검증만 — full tenant resolve 는 각 page 가 수행 (§ 3.2 step 3)
  18:   // cycle1-code WEB-06: tampered/expired cookie 시 cleanup route 로 redirect → cookie clear + audit
  19:   try {
  20:     await getActiveSession(getSqlBase(), getAuthCfg(), signedToken);
  21:   } catch (err) {
  22:     const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  23:     redirect(`/sign-in/cleanup?reason=${reason}`);
  24:   }
  25: 
  26:   return (
  27:     <div className="min-h-screen">
  28:       <header className="border-b border-slate-200 bg-white">
  29:         <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
  30:           <span className="text-sm font-semibold">Glitzy 어드민 (M0 walking skeleton)</span>
  31:           <form action="/sign-out" method="post">
  32:             <button
  33:               type="submit"
  34:               className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
  35:             >
  36:               로그아웃
  37:             </button>
  38:           </form>
  39:         </div>
  40:       </header>
  41:       <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
  42:     </div>
  43:   );
  44: }

 succeeded in 841ms:
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)
C:\Users\assag\solution\website-exposure\apps\web\src\app\api
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-out
C:\Users\assag\solution\website-exposure\apps\web\src\app\layout.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\layout.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\clinic-profile
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\new
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\new\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\new
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\new\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\new
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\new\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\api\health
C:\Users\assag\solution\website-exposure\apps\web\src\app\api\site-meta-fetch
C:\Users\assag\solution\website-exposure\apps\web\src\app\api\health\route.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\api\site-meta-fetch\route.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\cleanup
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\consume
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\actions.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\page.tsx
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\cleanup\route.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-in\consume\route.ts
C:\Users\assag\solution\website-exposure\apps\web\src\app\sign-out\route.ts

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/SEARCH_STANDARDIZATION.md; for($i=300;$i -le 390;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/SCHEMA_MAPPING.md; for($i=246;$i -le 430;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/DATA_MODEL.md; for($i=371;$i -le 515;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }; for($i=534;$i -le 590;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }; for($i=844;$i -le 930;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
 succeeded in 678ms:
 300: Disallow: /reviews
 301: Disallow: /pricing
 302: Allow: /
 303: ```
 304: 
 305: > `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.
 306: 
 307: ---
 308: 
 309: ## 4. sitemap.xml 표준
 310: 
 311: ### 4.1 자동 생성 룰
 312: 
 313: 빌드 시 다음 페이지를 sitemap에 포함:
 314: 
 315: | 페이지 | 포함 결정 |
 316: |---|---|
 317: | 필수 페이지 타입 (P-001 ~ P-014) | **Allowed** — 인스턴스에서 활성화된 페이지 |
 318: | 선택 페이지 타입 (P-101 ~ P-106) | Conditional — `FeatureModuleConfig`/`InstanceManifest`/라우트 설정에서 활성화 시 |
 319: | 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
 320: | 미발행 드래프트 | **Blocked** |
 321: | `noIndex: true` 페이지 | **Blocked** |
 322: | 외부 리다이렉트 | **Blocked** |
 323: 
 324: ### 4.2 sitemap.xml 형식
 325: 
 326: ```xml
 327: <?xml version="1.0" encoding="UTF-8"?>
 328: <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 329:   <url>
 330:     <loc>https://{domain}/</loc>
 331:     <lastmod>2026-05-14</lastmod>
 332:     <changefreq>weekly</changefreq>
 333:     <priority>1.0</priority>
 334:   </url>
 335:   <url>
 336:     <loc>https://{domain}/about</loc>
 337:     <lastmod>2026-05-13</lastmod>
 338:     <changefreq>monthly</changefreq>
 339:     <priority>0.8</priority>
 340:   </url>
 341:   <!-- ... -->
 342: </urlset>
 343: ```
 344: 
 345: ### 4.3 페이지별 changefreq·priority 기본값
 346: 
 347: | 페이지 타입 | changefreq | priority |
 348: |---|---|---|
 349: | P-001 Home | weekly | 1.0 |
 350: | P-002 About | monthly | 0.8 |
 351: | P-003 Doctors List | monthly | 0.7 |
 352: | P-004 Doctor Profile | monthly | 0.7 |
 353: | P-005 Treatments List | monthly | 0.8 |
 354: | P-006 Treatment Detail | monthly | 0.8 |
 355: | P-007 Conditions List | monthly | 0.6 |
 356: | P-008 Condition Detail | monthly | 0.6 |
 357: | P-009 Articles List | weekly | 0.6 |
 358: | P-010 Article Detail | monthly | 0.5 |
 359: | P-011 FAQ | monthly | 0.5 |
 360: | P-012 Contact | yearly | 0.6 |
 361: | P-013 Legal | yearly | 0.3 |
 362: | P-014 Location Detail | monthly | 0.7 |
 363: | P-101 ~ P-106 | yearly | 0.4 |
 364: 
 365: ### 4.4 lastmod 출력
 366: 
 367: - `ContentEntity.@updatedAt` (DATA_MODEL § 2.2) 기반 ISO 8601 날짜
 368: - ClinicProfile·LocationProfile 등 정적 페이지는 `@updatedAt`
 369: - **Article**(P-010)은 `Article.dateModified` 우선
 370: - **Treatment**(P-006)·**Condition**(P-008)은 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용, 없으면 공통 `@updatedAt`으로 fallback (§ 2.3 정합 — 현재 C-03·C-11에 명시 필드 미정의)
 371: 
 372: ### 4.5 sitemap 인덱스 (대규모 시)
 373: 
 374: - 단일 sitemap.xml의 URL 50,000개 또는 50MB 초과 시 sitemap index 형식 자동 분할
 375: - M0 단일 클라이언트 인스턴스는 일반적으로 단일 sitemap.xml로 충분
 376: 
 377: ---
 378: 
 379: ## 5. canonical URL 처리 (resolve)
 380: 
 381: ### 5.1 resolve 우선순위
 382: 
 383: ```
 384: 1. PageMeta.canonical (운영자 명시 입력)
 385:    ↓ 없으면
 386: 2. SchemaInput.canonicalUrl (어드민 발행 시 자동 계산)
 387:    ↓ 없으면
 388: 3. 페이지 라우트 + 도메인으로 자동 생성
 389:    예: ClinicProfile.domain + path = "https://example.com/about"
 390: ```

 succeeded in 682ms:
 246: ## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)
 247: 
 248: 각 페이지 타입의 graph 구성 + 핵심 필드 + 매핑 출처.
 249: 
 250: ### P-001. Home
 251: 
 252: **Graph 구성**:
 253: 1. `Organization` (ClinicProfile)
 254: 2. `MedicalClinic` (LocationProfile main) — 본원
 255: 3. `WebSite` (SearchAction 포함)
 256: 4. `WebPage` (Home의 본문 entity)
 257: 
 258: **Organization 필드 매핑**:
 259: 
 260: | Schema 필드 | 출처 (ClinicProfile) |
 261: |---|---|
 262: | `@type` | `"Organization"` |
 263: | `@id` | `https://{domain}/#organization` |
 264: | `name` | `name` |
 265: | `alternateName` | `alternateName` |
 266: | `legalName` | `legalEntityName` |
 267: | `description` | `description` |
 268: | `slogan` | `slogan` |
 269: | `url` | `https://{domain}` |
 270: | `logo` | `logoUrl` → `ImageObject` |
 271: | `founder` | `founder` → `Person` |
 272: | `foundingDate` | `foundingDate` |
 273: | `award` | `awards[].name` |
 274: | `memberOf` | `memberOf[]` → `Organization`(학회) |
 275: | `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
 276: | `sameAs` | `socialMedia.*` 배열로 변환 |
 277: | `knowsAbout` | `medicalSpecialty[]` (보조) |
 278: | `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |
 279: 
 280: **MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
 281: 
 282: | Schema 필드 | 출처 (LocationProfile main) |
 283: |---|---|
 284: | `@type` | `"MedicalClinic"` |
 285: | `@id` | `https://{domain}/#clinic` |
 286: | `name` | `name` |
 287: | `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
 288: | `address` | `address` → `PostalAddress` |
 289: | `telephone` | `telephone` |
 290: | `email` | `email` |
 291: | `openingHoursSpecification` | `businessHours.openingHours[]` → `OpeningHoursSpecification[]` |
 292: | `geo` | `geo` → `GeoCoordinates` |
 293: | `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
 294: | `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
 295: 
 296: **WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
 297: 
 298: ```json
 299: {
 300:   "@type": "WebSite",
 301:   "@id": "https://{domain}/#website",
 302:   "url": "https://{domain}",
 303:   "name": "{ClinicProfile.name}",
 304:   "publisher": { "@id": "https://{domain}/#organization" },
 305:   "inLanguage": "ko-KR"
 306: }
 307: ```
 308: 
 309: **`potentialAction.SearchAction` 추가 조건 (Conditional)** — 사이트 내 검색 기능이 실제 구현되고 `/search` 라우트가 존재할 때만:
 310: 
 311: ```json
 312: "potentialAction": {
 313:   "@type": "SearchAction",
 314:   "target": "https://{domain}/search?q={search_term_string}",
 315:   "query-input": "required name=search_term_string"
 316: }
 317: ```
 318: 
 319: > PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchAction 미출력. 검색 기능 활성화 시 빌드 트리거.
 320: 
 321: **다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
 322: 
 323: **WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
 324: 
 325: **BreadcrumbList**: Home에는 미적용.
 326: 
 327: ---
 328: 
 329: ### P-002. About
 330: 
 331: **Graph 구성**:
 332: 1. `Organization` (법인 identity 풀필드)
 333: 2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
 334: 3. `BreadcrumbList`
 335: 4. `WebPage` (about page)
 336: 
 337: **Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
 338: 
 339: **mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
 340: - 외부 미디어 링크 (인터뷰·기고 URL)는 `sameAs` 배열 끝에 보조 추가 또는
 341: - 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
 342: - 단순 본문 콘텐츠 표시가 가장 안전
 343: 
 344: **BreadcrumbList**:
 345: ```json
 346: {
 347:   "@type": "BreadcrumbList",
 348:   "itemListElement": [
 349:     { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://{domain}/" },
 350:     { "@type": "ListItem", "position": 2, "name": "About", "item": "https://{domain}/about" }
 351:   ]
 352: }
 353: ```
 354: 
 355: ---
 356: 
 357: ### P-003. Doctors List
 358: 
 359: **Graph 구성**:
 360: 1. `Organization` — **[풀]**
 361: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 362: 3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
 363: 4. `BreadcrumbList` — **[풀]**
 364: 5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
 365: 
 366: ```json
 367: {
 368:   "@type": "ItemList",
 369:   "@id": "https://{domain}/doctors#itemlist",
 370:   "itemListElement": [
 371:     {
 372:       "@type": "ListItem",
 373:       "position": 1,
 374:       "item": {
 375:         "@type": "Physician",
 376:         "@id": "https://{domain}/doctors/hong#physician",
 377:         "name": "{DoctorProfile.name}",
 378:         "url": "https://{domain}/doctors/hong",
 379:         "image": "{DoctorProfile.photoUrl}",
 380:         "jobTitle": "{DoctorProfile.jobTitle}"
 381:       }
 382:     }
 383:   ]
 384: }
 385: ```
 386: 
 387: > 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
 388: 
 389: ---
 390: 
 391: ### P-004. Doctor Profile
 392: 
 393: **Graph 구성**:
 394: 1. `Organization` — **[풀]**
 395: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 396: 3. `Physician` (DoctorProfile 풀필드) — **[풀]**
 397: 4. `BreadcrumbList` — **[풀]**
 398: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 399: 
 400: **Physician 필드 매핑**:
 401: 
 402: | Schema 필드 | 출처 (DoctorProfile) |
 403: |---|---|
 404: | `@type` | `"Physician"` |
 405: | `@id` | `https://{domain}/doctors/{slug}#physician` |
 406: | `name` | `name` |
 407: | `alternateName` | `alternateName` |
 408: | `jobTitle` | `jobTitle` |
 409: | `description` | `briefBio` |
 410: | `image` | `photoUrl` → `ImageObject` |
 411: | `medicalSpecialty` | `medicalSpecialty[]` |
 412: | `hasCredential` | `credentials[]` → `EducationalOccupationalCredential` |
 413: | `alumniOf` | `education[]` → `EducationalOrganization` |
 414: | `worksFor` | `{"@id": "https://{domain}/#organization"}` |
 415: | `affiliation` | `affiliations[]` → `Organization` |
 416: | `memberOf` | `affiliations[]` (보조) |
 417: | `email` | `email` |
 418: | `sameAs` | `socialMedia.*` 배열 |
 419: 
 420: **Note**: `personalStory`·`philosophy`는 본문에 표시되지만 schema에는 비매핑 (의료 schema에 적절한 표현 없음 — `description`에 일부 흡수 가능).
 421: 
 422: ---
 423: 
 424: ### P-005. Treatments List
 425: 
 426: **Graph 구성**:
 427: 1. `Organization` — **[풀]**
 428: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
 429: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 430: 4. `BreadcrumbList` — **[풀]**

 succeeded in 693ms:
 371: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
 372: 
 373: | 필드 | 타입 | required | 설명 |
 374: |---|---|:---:|---|
 375: | `@id` | `Slug` | ✅ | |
 376: | `name` | `string` | ✅ | 1~80자 |
 377: | `alternateName` | `string` | optional | |
 378: | `summary` | `string` | ✅ | 50~160자 핵심 답변 |
 379: | `category` | `string` | optional | 시술 카테고리 |
 380: | `medicalSpecialty` | `Ref<C-14>` | optional | |
 381: | `overview` | `Markdown` | ✅ | 개요 |
 382: | `mechanism` | `Markdown` | ✅ | 원리 |
 383: | `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
 384: | `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
 385: | `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
 386: | `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
 387: | `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
 388: | `duration` | `string` | optional | 소요 시간 |
 389: | `sessionCount` | `string` | optional | 권장 횟수 |
 390: | `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
 391: | `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
 392: | `aftercare` | `Markdown` | optional | 시술 후 관리 |
 393: | `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
 394: | `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
 395: | `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
 396: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
 397: | `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
 398: | `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
 399: | `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
 400: | `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
 401: | `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
 402: | `heroImageUrl` | `URL` | optional | |
 403: | `ogImageUrl` | `URL` | optional | |
 404: | `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
 405: 
 406: **하위 타입**:
 407: 
 408: #### `ProcessStep`
 409: | 필드 | 타입 | required | 설명 |
 410: |---|---|:---:|---|
 411: | `order` | `number` | ✅ | 단계 번호 |
 412: | `name` | `string` | ✅ | 단계명 |
 413: | `description` | `Markdown` | ✅ | |
 414: | `durationMinutes` | `number` | optional | |
 415: 
 416: #### `TreatmentComponent` (v0.4 신규)
 417: | 필드 | 타입 | required | 설명 |
 418: |---|---|:---:|---|
 419: | `@id` | `Slug` | ✅ | |
 420: | `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
 421: | `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
 422: | `description` | `Markdown` | optional | |
 423: | `included` | `boolean` | optional | 패키지 포함 여부 (default true) |
 424: 
 425: #### `VisitFlowStep` (v0.4 신규)
 426: | 필드 | 타입 | required | 설명 |
 427: |---|---|:---:|---|
 428: | `order` | `number` | ✅ | |
 429: | `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
 430: | `description` | `Markdown` | optional | |
 431: | `durationMinutes` | `number` | optional | |
 432: | `location` | `enum {clinic, remote, both}` | optional | |
 433: 
 434: #### `ProgramVariant`
 435: | 필드 | 타입 | required | 설명 |
 436: |---|---|:---:|---|
 437: | `@id` | `Slug` | ✅ | |
 438: | `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
 439: | `duration` | `string` | ✅ | 기간 |
 440: | `sessionCount` | `string` | optional | 세션 수 |
 441: | `targetSegment` | `string` | optional | 대상 분류 |
 442: | `briefDescription` | `Markdown` | ✅ | |
 443: | `includes` | `string[]` | optional | 포함 항목 |
 444: | `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
 445: | `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
 446: 
 447: #### `EvidenceNote` (v0.4 신규)
 448: | 필드 | 타입 | required | 설명 |
 449: |---|---|:---:|---|
 450: | `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
 451: | `summary` | `string` | optional | 간략 요약 |
 452: | `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
 453: | `publishedYear` | `number` | optional | |
 454: | `verifiedBy` | `string` | optional | 검증자·기관 |
 455: 
 456: #### `SlotRiskOverride`
 457: | 필드 | 타입 | required | 설명 |
 458: |---|---|:---:|---|
 459: | `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
 460: | `level` | `RiskLevel` | ✅ | 격상 등급 |
 461: | `reason` | `string` | ✅ | 감사 추적용 |
 462: 
 463: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
 464: 
 465: | 필드 | 타입 | required | 설명 |
 466: |---|---|:---:|---|
 467: | `@id` | `Slug` | ✅ | |
 468: | `headline` | `string` | ✅ | 1~120자 |
 469: | `summary` | `string` | ✅ | 80~200자 |
 470: | `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
 471: | `author` | `Ref<C-02>` | ✅ | 저자 |
 472: | `coAuthors` | `Ref<C-02>[]` | optional | |
 473: | `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
 474: | `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
 475: | `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
 476: | `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
 477: | `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
 478: | `datePublished` | `Date` | ✅ | 최초 발행일 |
 479: | `dateModified` | `Date` | ✅ | 최종 수정일 |
 480: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
 481: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
 482: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
 483: | `tags` | `string[]` | optional | |
 484: | `readingTimeMinutes` | `number` | optional | 자동 계산 |
 485: | `wordCount` | `number` | optional | 자동 계산 |
 486: | `coverImageUrl` | `URL` | optional | |
 487: | `ogImageUrl` | `URL` | optional | |
 488: | `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
 489: | `relatedArticles` | `Ref<C-04>[]` | optional | |
 490: | `relatedTreatments` | `Ref<C-03>[]` | optional | |
 491: | `relatedConditions` | `Ref<C-11>[]` | optional | |
 492: | `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
 493: | `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
 494: 
 495: **ArticleType ↔ 자동 추론 위험도**:
 496: 
 497: | ArticleType | 자동 위험도 | 운영자 오버라이드 |
 498: |---|:---:|:---:|
 499: | `notice` | Low | ✅ |
 500: | `general-medical-info` | Medium | ✅ |
 501: | `treatment-explainer` | Medium | ✅ |
 502: | `condition-explainer` | Medium | ✅ |
 503: | `effect-result-related` | High | ✅ (낮출 수 없음) |
 504: | `review-case` | High | ✅ (낮출 수 없음) |
 505: | `event-price` | High | ✅ (낮출 수 없음) |
 506: 
 507: **하위 타입**:
 508: 
 509: #### `EmbeddedMedia`
 510: | 필드 | 타입 | required | 설명 |
 511: |---|---|:---:|---|
 512: | `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
 513: | `url` | `URL` | ✅ | |
 514: | `title` | `string` | optional | |
 515: | `caption` | `string` | optional | |
 534: ### C-06. `PageMeta` — 페이지별 메타 데이터
 535: 
 536: | 필드 | 타입 | required | 설명 |
 537: |---|---|:---:|---|
 538: | `title` | `string` | ✅ | 10~70자, `<title>` |
 539: | `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
 540: | `canonical` | `URL` | optional | 미지정 시 자동 생성 |
 541: | `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
 542: | `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
 543: | `ogTitle` | `string` | optional | 미지정 시 `title` |
 544: | `ogDescription` | `string` | optional | 미지정 시 `description` |
 545: | `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
 546: | `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
 547: | `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
 548: | `noIndex` | `boolean` | optional | 기본 `false` |
 549: 
 550: > 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.
 551: 
 552: ### C-07. `BrandTokens` — 디자인 토큰 최종값
 553: 
 554: | 필드 | 타입 | required | 설명 |
 555: |---|---|:---:|---|
 556: | `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
 557: | `colors` | `ColorTokens` | ✅ | 색 토큰 |
 558: | `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
 559: | `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
 560: | `radius` | `RadiusScale` | ✅ | |
 561: | `shadow` | `ShadowScale` | ✅ | |
 562: | `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
 563: | `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |
 564: 
 565: > 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.
 566: 
 567: ### C-08. `InstanceManifest` — 버전 고정 명세
 568: 
 569: | 필드 | 타입 | required | 설명 |
 570: |---|---|:---:|---|
 571: | `instanceId` | `Slug` | ✅ | |
 572: | `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
 573: | `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
 574: | `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
 575: | `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
 576: | `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
 577: | `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
 578: | `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
 579: | `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
 580: | `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
 581: | `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
 582: | `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
 583: | `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
 584: | `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
 585: | `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
 586: | `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
 587: | `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
 588: | `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
 589: | `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
 590: | `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
 844: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
 845: 
 846: **목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
 847: 
 848: **참조 페이지 타입**: P-013
 849: **참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)
 850: 
 851: | 필드 | 타입 | required | 설명 |
 852: |---|---|:---:|---|
 853: | `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
 854: | `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
 855: | `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
 856: | `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
 857: | `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
 858: | `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
 859: | `effectiveDate` | `Date` | ✅ | 시행일 |
 860: | `lastRevisedDate` | `Date` | optional | 최종 개정일 |
 861: | `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
 862: | `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
 863: | `contactEmail` | `Email` | optional | 정책 문의 채널 |
 864: 
 865: **하위 타입**:
 866: 
 867: #### `LegalDocumentRevision`
 868: | 필드 | 타입 | required | 설명 |
 869: |---|---|:---:|---|
 870: | `date` | `Date` | ✅ | 개정일 |
 871: | `summary` | `string` | ✅ | 개정 내용 요약 |
 872: | `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |
 873: 
 874: **컴플라이언스 룰**:
 875: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
 876: - 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.
 877: 
 878: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
 879: 
 880: **SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.
 881: 
 882: | 필드 | 타입 | required | 설명 |
 883: |---|---|:---:|---|
 884: | `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
 885: | `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
 886: | `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
 887: | `branchDescription` | `string` | optional | 50~200자 |
 888: | `address` | `Address` | ✅ | 지점 주소 |
 889: | `geo` | `GeoCoordinates` | optional | |
 890: | `telephone` | `Phone` | ✅ | 지점 직통 |
 891: | `fax` | `Phone` | optional | |
 892: | `email` | `Email` | optional | 지점 이메일 |
 893: | `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
 894: | `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
 895: | `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
 896: | `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
 897: | `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
 898: | `images` | `URL[]` | optional | |
 899: | `transportInfo` | `Markdown` | optional | |
 900: | `parkingInfo` | `Markdown` | optional | |
 901: | `openingDate` | `Date` | optional | 지점 개원일 |
 902: | `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
 903: | `branchCode` | `string` | optional | |
 904: | `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
 905: 
 906: > v0.4 → v0.6 강조 채널 표기 변천:
 907: > - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
 908: > - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
 909: > - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
 910: 
 911: > **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
 912: 
 913: ### C-22. `ArticleCategory` — Article Pillar 분류
 914: 
 915: | 필드 | 타입 | required | 설명 |
 916: |---|---|:---:|---|
 917: | `@id` | `Slug` | ✅ | |
 918: | `name` | `string` | ✅ | 1~50자 |
 919: | `description` | `string` | optional | 80~200자 |
 920: | `pillar` | `string` | optional | 상위 Pillar |
 921: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
 922: | `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
 923: | `coverImageUrl` | `URL` | optional | |
 924: | `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
 925: | `displayOrder` | `number` | optional | |
 926: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |
 927: 
 928: ---
 929: 
 930: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/SCHEMA_MAPPING.md; for($i=424;$i -le 620;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/SCHEMA_MAPPING.md; for($i=620;$i -le 760;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"7\\.1\\.1|LegalDocument|ContentType|면제|exempt|Exception\" docs/core/CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure
 succeeded in 714ms:
207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
272:다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.
366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
534:  contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
557:  contextExceptions?: ContextException[];
576:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
580:type ContextException = {
645:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
655:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
659:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
660:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|

 succeeded in 736ms:
 620: **VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
 621: 
 622: ```json
 623: {
 624:   "@type": "VideoObject",
 625:   "name": "{EmbeddedMedia.title 또는 Article.headline}",
 626:   "description": "{EmbeddedMedia.caption 또는 Article.summary}",
 627:   "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
 628:   "uploadDate": "{Article.datePublished}",
 629:   "contentUrl": "{EmbeddedMedia.url}",
 630:   "embedUrl": "{EmbeddedMedia.url}",
 631:   "duration": "PT{durationSeconds}S",
 632:   "transcript": "{EmbeddedMedia.transcriptUrl}",
 633:   "inLanguage": "ko-KR"
 634: }
 635: ```
 636: 
 637: **필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
 638: - `name`, `description`, `thumbnailUrl`, `uploadDate` (4개 모두 필수)
 639: - 그리고 `contentUrl` 또는 `embedUrl` **중 최소 1개**
 640: 
 641: **Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.
 642: 
 643: ### P-011. FAQ
 644: 
 645: **Graph 구성**:
 646: 1. `Organization` — **[풀]**
 647: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 648: 3. `FAQPage` (Question/Answer) — **[풀]**
 649: 4. `BreadcrumbList` — **[풀]**
 650: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 651: 
 652: **FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
 653: 
 654: ### P-012. Contact / Visit (Conversion Hub)
 655: 
 656: **Graph 구성**:
 657: 1. `Organization` — **[풀]**
 658: 2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
 659: 3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
 660: 4. `BreadcrumbList` — **[풀]**
 661: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 662: 6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
 663: 
 664: **다지점 처리**:
 665: 
 666: ```json
 667: {
 668:   "@graph": [
 669:     { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
 670:     { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
 671:     { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
 672:     { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
 673:     { "@type": "ItemList", "itemListElement": [...] }
 674:   ]
 675: }
 676: ```
 677: 
 678: **예약·상담 채널 표현** (`reservationChannels: CTAConfig[]`):
 679: 
 680: 각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
 681: 
 682: ```json
 683: "potentialAction": [
 684:   {
 685:     "@type": "ReserveAction",
 686:     "target": "https://booking.naver.com/...",
 687:     "name": "네이버 예약"
 688:   }
 689: ],
 690: "contactPoint": [
 691:   {
 692:     "@type": "ContactPoint",
 693:     "telephone": "+82-2-1234-5678",
 694:     "contactType": "reservation"
 695:   }
 696: ]
 697: ```
 698: 
 699: ### P-013. Legal / Policy
 700: 
 701: **Graph 구성**:
 702: 1. `Organization` — **[풀]**
 703: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 704: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 705: 4. `BreadcrumbList` — **[풀]**
 706: 
 707: **Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
 708: 
 709: ### P-014. Location / Branch Detail
 710: 
 711: **Graph 구성**:
 712: 1. `Organization` — **[풀]**
 713: 2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
 714:    - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
 715:    - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
 716: 3. `BreadcrumbList` — **[풀]**
 717: 4. `WebPage` — **[풀]**, `isPartOf: #website`
 718: 
 719: **MedicalClinic 필드 매핑 (지점 LocationProfile)**:
 720: 
 721: P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
 722: 
 723: | Schema 필드 | 출처 |
 724: |---|---|
 725: | `branchOf` | `{"@id": "https://{domain}/#organization"}` |
 726: | `parentOrganization` | 동일 |
 727: | `image` | `images[]` → `ImageObject[]` |
 728: 
 729: > 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
 730: 
 731: ---
 732: 
 733: ## 4. 페이지 타입별 Schema 매핑 (선택 7종 — 간략)
 734: 
 735: ### P-101. Reviews
 736: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
 737: **주의**: `Review`/`AggregateRating` 사용 **금지** (의료광고법 — § 8 참조). 후기 페이지는 schema 빈약하더라도 의도된 선택.
 738: 
 739: ### P-102. Pricing
 740: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
 741: **주의**: `Offer` schema **사용 안 함** (의료 가격 광고 제한). 본문 정보만 표시.
 742: 
 743: ### P-103. Facilities / Equipment
 744: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
 745: 
 746: ### P-104. News / Event
 747: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
 748: **주의**: 이벤트 카테고리는 `Offer`·할인 schema 안 함.
 749: 
 750: ### P-105. Reservation
 751: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
 752: `MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
 753: 
 754: ### P-106. Self-test / Quiz
 755: **Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
 756: 
 757: ---
 758: 
 759: ## 5. 데이터 계약 ↔ Schema 필드 매핑 (참조 인덱스)
 760: 

 succeeded in 750ms:
 424: ### P-005. Treatments List
 425: 
 426: **Graph 구성**:
 427: 1. `Organization` — **[풀]**
 428: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
 429: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 430: 4. `BreadcrumbList` — **[풀]**
 431: 5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
 432: 
 433: ```json
 434: {
 435:   "@type": "ItemList",
 436:   "itemListElement": [
 437:     {
 438:       "@type": "ListItem",
 439:       "position": 1,
 440:       "item": {
 441:         "@type": "MedicalProcedure",
 442:         "@id": "https://{domain}/treatments/{slug}#procedure",
 443:         "name": "{TreatmentPage.name}",
 444:         "url": "https://{domain}/treatments/{slug}",
 445:         "description": "{TreatmentPage.summary}"
 446:       }
 447:     }
 448:   ]
 449: }
 450: ```
 451: 
 452: ---
 453: 
 454: ### P-006. Treatment Detail
 455: 
 456: **Graph 구성**:
 457: 1. `Organization` — **[풀]**
 458: 2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
 459: 3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**
 460: 4. `BreadcrumbList` — **[풀]**
 461: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 462: 6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
 463: 
 464: **MedicalProcedure 필드 매핑**:
 465: 
 466: | Schema 필드 | 출처 (TreatmentPage) |
 467: |---|---|
 468: | `@type` | `"MedicalProcedure"` |
 469: | `@id` | `https://{domain}/treatments/{slug}#procedure` |
 470: | `name` | `name` |
 471: | `alternateName` | `alternateName` |
 472: | `description` | `summary` (또는 `overview` 단축) |
 473: | `procedureType` | `category` (해당 시) |
 474: | `howPerformed` | `mechanism` (Markdown → 평문) |
 475: | `preparation` | `process[]` 중 사전 준비 단계 + 본 시술 전 단계 |
 476: | `followup` | `aftercare` + `maintenancePlan` (요약) |
 477: | `bodyLocation` | (해당 시 — 다이어트 한의원은 일반적으로 없음) |
 478: | `medicalSpecialty` | `medicalSpecialty` |
 479: | `citation` | `evidenceNotes[]` → `CreativeWork[]` 또는 단순 URL 배열 (`MedicalStudy`는 EvidenceNote 필드로 구성 부족하므로 사용 안 함) |
 480: 
 481: **주의**:
 482: - `targetAudience`·`recommendedFor` 필드는 schema.org에 직접 매핑 없음 → `description` 보조 또는 `audience` (broad)
 483: - `programVariants`는 schema 미매핑 — 본문 콘텐츠로만
 484: - 위험도 격상 조건이 적용된 슬롯은 schema 출력 자체에서 단정형 표현 회피
 485: 
 486: **FAQPage** (해당 시):
 487: 
 488: ```json
 489: {
 490:   "@type": "FAQPage",
 491:   "mainEntity": [
 492:     {
 493:       "@type": "Question",
 494:       "name": "{faq.question}",
 495:       "acceptedAnswer": {
 496:         "@type": "Answer",
 497:         "text": "{faq.answer (Markdown → 평문)}"
 498:       }
 499:     }
 500:   ]
 501: }
 502: ```
 503: 
 504: ---
 505: 
 506: ### P-007. Conditions List
 507: 
 508: **Graph 구성**:
 509: 1. `Organization` — **[풀]**
 510: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 511: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 512: 4. `BreadcrumbList` — **[풀]**
 513: 5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
 514: 
 515: ### P-008. Condition Detail
 516: 
 517: **Graph 구성**:
 518: 1. `Organization` — **[풀]**
 519: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 520: 3. `MedicalCondition` (풀필드) — **[풀]**
 521: 4. `BreadcrumbList` — **[풀]**
 522: 5. `WebPage` — **[풀]**, `isPartOf: #website`
 523: 6. (FAQ) `FAQPage` — **[풀]** (Conditional)
 524: 
 525: **MedicalCondition 필드**:
 526: 
 527: | Schema 필드 | 출처 (MedicalConditionPage) |
 528: |---|---|
 529: | `@type` | `"MedicalCondition"` |
 530: | `@id` | `https://{domain}/conditions/{slug}#condition` |
 531: | `name` | `name` |
 532: | `description` | `definition` (+ `causes[]` 일부 일반론을 description 보조 텍스트로 흡수 가능) |
 533: | `signOrSymptom` | `symptoms[]` → `MedicalSignOrSymptom` |
 534: | `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |
 535: 
 536: > `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.
 537: 
 538: ### P-009. Articles List
 539: 
 540: **Graph 구성**:
 541: 1. `Organization` — **[풀]**
 542: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 543: 3. `WebPage` — **[풀]**, `isPartOf: #website`
 544: 4. `BreadcrumbList` — **[풀]**
 545: 5. `ItemList` 또는 `Blog` — **[풀]**
 546: 
 547: `ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
 548: ```json
 549: {
 550:   "@type": "ItemList",
 551:   "itemListElement": [
 552:     {
 553:       "@type": "ListItem",
 554:       "position": 1,
 555:       "item": {
 556:         "@type": "Article",
 557:         "@id": "https://{domain}/insights/{cat}/{slug}#article",
 558:         "headline": "{Article.headline}",
 559:         "url": "https://{domain}/insights/{cat}/{slug}",
 560:         "image": "{Article.coverImageUrl}",
 561:         "datePublished": "{Article.datePublished}",
 562:         "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
 563:       }
 564:     }
 565:   ]
 566: }
 567: ```
 568: 
 569: `Blog` 사용 시 (콘텐츠 운영 명확 표시):
 570: ```json
 571: {
 572:   "@type": "Blog",
 573:   "@id": "https://{domain}/insights#blog",
 574:   "name": "{Articles List title}",
 575:   "publisher": { "@id": "https://{domain}/#organization" },
 576:   "blogPost": [
 577:     { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
 578:   ],
 579:   "inLanguage": "ko-KR"
 580: }
 581: ```
 582: 
 583: ### P-010. Article Detail
 584: 
 585: **Graph 구성** (entity별 [풀]/[참조+inline 최소]/[참조만] 표기):
 586: 1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
 587: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
 588: 3. `Article` — **[풀]**
 589: 4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
 590: 5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
 591: 6. `BreadcrumbList` — **[풀]**
 592: 7. `WebPage` — **[풀]**, `isPartOf: #website`
 593: 8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
 594: 9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
 595: 
 596: **Article 필드 매핑**:
 597: 
 598: | Schema 필드 | 출처 (Article) |
 599: |---|---|
 600: | `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
 601: | `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
 602: | `headline` | `headline` |
 603: | `description` | `summary` |
 604: | `articleBody` | `body` (Markdown → 평문 권장, schema validator 호환) |
 605: | `articleSection` | ArticleCategory.name |
 606: | `datePublished` | `datePublished` |
 607: | `dateModified` | `dateModified` |
 608: | `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
 609: | `editor` | `reviewedBy` (해당 시) → Physician @id |
 610: | `publisher` | `{"@id": "https://{domain}/#organization"}` |
 611: | `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
 612: | `image` | `coverImageUrl`·`ogImageUrl` → `ImageObject` |
 613: | `wordCount` | `wordCount` |
 614: | `keywords` | `tags[]` (해당 시) |
 615: | `isAccessibleForFree` | `true` |
 616: | `inLanguage` | `"ko-KR"` |
 617: | `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
 618: | `citation` | `embeddedMedia[].url` 중 `type=citation`·`external-video` 항목 |
 619: 
 620: **VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/CONTENT_STANDARDS.md; for($i=350;$i -le 416;$i++){ '"'{0,4}: {1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure
 succeeded in 602ms:
 350: ### 6.1 ArticleType 자동 분류·검수
 351: 
 352: - 어드민에서 운영자가 직접 분류 (M0)
 353: - compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
 354: - `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)
 355: 
 356: ---
 357: 
 358: ## 7. compliance-assistant Feature Module 인터페이스
 359: 
 360: 본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.
 361: 
 362: ### 7.1 입력
 363: 
 364: ```ts
 365: type ComplianceCheckInput = {
 366:   contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
 367:   featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
 368:   contentRef: string;                 // 대상 콘텐츠 @id
 369:   body: Markdown;
 370:   metadata: {
 371:     pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
 372:     articleType?: ArticleType;        // DATA_MODEL C-04
 373:     pageMeta?: PageMeta;              // DATA_MODEL C-06
 374:     explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
 375:     inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
 376:   };
 377:   riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
 378: };
 379: 
 380: // 둘 중 정확히 하나만 사용:
 381: // - Core 콘텐츠: contentType 사용, featureContentType 미지정
 382: // - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
 383: ```
 384: 
 385: #### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
 386: 
 387: DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
 388: 
 389: ```ts
 390: type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
 391: type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
 392: ```
 393: 
 394: | 영역 | contentType 값 | featureContentType 값 | 예시 |
 395: |---|---|---|---|
 396: | Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
 397: | Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
 398: 
 399: > P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.
 400: 
 401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
 402: 
 403: LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
 404: 
 405: | 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
 406: |---|---|---|
 407: | answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
 408: | 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
 409: | RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
 410: | RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |
 411: 
 412: **변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
 413: 
 414: **ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
 415: 
 416: #### 7.1.2 High → gateRequired 변환 규칙

codex
# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=6 major=11 minor=4 (총 21)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **PSR-01**: M0 minimal 10페이지 선택이 PAGE_TYPES/ARCH 게이트와 불일치
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:11`, `:39`, `:66`, `:273-286`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:23` “P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플”, `docs/admin/ARCHITECTURE.md:171-186`, `:273`
  - 문제: plan은 P-009 Articles List를 포함하고 P-014 Location Detail을 defer한다. 또한 P-010은 1샘플이어야 하나 일반 detail 라우트로 다룬다.
  - 권장 patch: v0.1 minimal을 P-001/002/003/004/005/006/012/013/014 + P-010 1샘플로 재정의하고, P-009는 PAGE_TYPES § 6 우선순위처럼 “M0 미합류”로 이동.

- **PSR-02**: public site URL과 기존 admin URL 충돌 해소가 실제 라우팅 cascade 없이 plan acceptance precondition으로 남음
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:102-106`, `:345`, `:383`
  - 근거(SoT/코드): `apps/web/src/app/(admin)/[instanceSlug]/...` 실제 존재, `ADMIN_UI_SKELETON_PLAN.md:144-151` 현재 `/[instanceSlug]`, `/[instanceSlug]/clinic-profile`
  - 문제: `/(site)/[instanceSlug]`를 추가하면 dashboard, clinic-profile, doctors/treatments/articles admin routes와 공개 routes가 같은 path namespace를 공유한다. sign-in consume redirect도 `/ {firstSlug}`로 고정되어 있다.
  - 권장 patch: PSR-CASCADE-01을 acceptance precondition으로 격상해 코드 tree를 `(admin)/admin/[instanceSlug]/...`로 명시하고, redirect/sign-out/cleanup/API/site-meta-fetch 영향 범위와 회귀 시나리오를 포함.

- **PSR-03**: nested `(site)/[instanceSlug]/layout.tsx`가 `<html>/<body>`를 반환하도록 되어 Next root layout 정책 위반
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159-174`
  - 근거(코드): `apps/web/src/app/layout.tsx:10-14`가 이미 root `<html><body>`를 반환
  - 문제: Next App Router에서 route group nested layout은 `<html>/<body>`를 중복 반환하면 안 된다. plan 예시 그대로 구현하면 런타임/빌드 구조가 깨진다.
  - 권장 patch: site layout은 fragment/div만 반환하고, `<html lang="ko-KR">` 및 body class/theme 처리는 root layout 또는 route segment별 wrapper strategy로 재설계.

- **PSR-04**: robots.txt 정책이 SEARCH_STANDARDIZATION v1.1과 정면 충돌
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245-267`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:21` aiCrawlerPolicy required, allow는 legal approval 필수; `:153-162` 4계열 user-agent; `:190-250` disallowTraining 기본 예시; `DATA_MODEL.md:575-581`
  - 문제: plan은 `GPTBot`, `ClaudeBot`까지 기본 Allow하고 `aiCrawlerPolicy`/법무 승인/Google-Extended/CCBot/OAI-SearchBot/Claude-SearchBot/ChatGPT-User 등을 누락한다.
  - 권장 patch: robots 생성은 InstanceManifest.aiCrawlerPolicy 기반으로 바꾸고, v0.1 기본은 `disallowTraining` starter template에 맞춰 D 계열 학습 봇을 Disallow. `allow`는 승인 필드 3종 required.

- **PSR-05**: `app_public_reader`가 instance slug를 RLS 아래에서 resolve할 수 없음
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:115-132`
  - 근거(코드): `D0010_instance.sql:25-30`는 `app_tenant_user`만 `current_setting('app.current_instance_id')` 기준 SELECT 허용
  - 문제: helper 흐름은 “instance 조회 → current_instance_id set”인데, public reader가 처음 slug를 조회할 정책이 없다. 또한 `CREATE ROLE app_public_reader;`는 connection URL용 LOGIN 여부도 불명확하다.
  - 권장 patch: `app_public_reader LOGIN` 여부, `instance`에 active slug lookup 전용 SELECT policy, 이후 content tables의 `instance_id = current_setting(...)` policy를 분리 명시.

- **PSR-06**: LegalDocument draft 공개 노출이 “출시 게이트/법무 검토” SoT와 충돌
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:40`, `:145`, `:196`, `:316`
  - 근거(SoT): `DATA_MODEL.md:846` LegalDocument는 “M0 출시 게이트”와 법무 검토 필수, `:874-875`; `CONTENT_STANDARDS.md:414` ComplianceRecord 발행 게이트 면제 아님; `LOCATION_LEGAL_PLAN.md:11` draft 저장만, 발행 게이트 defer
  - 문제: plan은 draft 법적 문서를 공개 site에서 노출하고 robots도 index한다. v0.1 개발자 접근 단계라 해도 공개 렌더 plan의 기본 노출 정책으로는 법무 게이트를 우회한다.
  - 권장 patch: LegalDocument는 v0.1에서 `noindex` + dev-only 또는 authenticated preview로 제한하거나, 공개 노출은 ComplianceRecord legalCounsel/legalCounselAt 합류 후로 defer.

## major
- **PSR-07**: JSON-LD graph가 SCHEMA_MAPPING § 2.5와 일부 불일치
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:275-286`
  - 근거(SoT): `SCHEMA_MAPPING.md:230-240`, P-012 `:654-662`, P-013 `:699-707`
  - 문제: P-012에 `ContactPage`를 추가하지만 SoT는 WebPage + MedicalClinic 풀이다. P-013은 MedicalClinic ref만 맞지만 P-014 자체가 누락됐다.
  - 권장 patch: § 3 페이지별 graph 표를 SCHEMA_MAPPING 문구 그대로 `[풀]/[참조]`로 재작성하고 P-014를 추가.

- **PSR-08**: `@id` path-based 변형이 cascade marker만 있고 canonical/entity identity 충돌 규칙이 없음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:289`, `:384`
  - 근거(SoT): `SCHEMA_MAPPING.md:52-66`는 `https://{domain}/#organization`, `/#clinic`; `:83-92` main clinic entity 고정
  - 문제: `https://<host>/<instanceSlug>/#clinic` 임시 패턴은 필요하지만, P-014 main의 `/#clinic` identity와 도메인 매핑 후 변경 시 entity continuity가 깨질 수 있다.
  - 권장 patch: PSR-CASCADE-02에 v0.1 임시 canonical base 정의와 M0 도메인 전환 시 migration/redirect/entity-id stability note 추가.

- **PSR-09**: sitemap lastmod/changefreq/priority가 SEARCH_STANDARDIZATION과 다름
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:236-243`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:345-362`, `:365-370`
  - 문제: plan은 리스트 daily/디테일 weekly/정책 0.5라고 하나 SoT는 P-012 yearly 0.6, P-013 yearly 0.3, P-010 monthly 0.5 등이다. Treatment/Article lastmod도 publishedAt가 아니라 updatedAt/dateModified 우선이다.
  - 권장 patch: SEARCH_STANDARDIZATION § 4.3/4.4 표를 그대로 반영.

- **PSR-10**: metadata API 출력에서 theme-color와 P-006 og:type 규칙 누락
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:219-227`, `:291-295`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:83-99`, `:103-123`; `DESIGN_TOKENS.md:811-818`
  - 문제: theme-color light/dark 의무가 빠졌고, P-006 Treatment Detail은 `og:type=article`이어야 한다.
  - 권장 patch: `themeColor` 두 값, P-004 profile/P-006 article/P-010 article 매핑을 명시.

- **PSR-11**: Article URL 패턴이 PAGE_TYPES/SCHEMA_MAPPING과 다름
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:93`, `:104`, `:194`
  - 근거(SoT): `PAGE_TYPES.md:45`, `:331`; `SCHEMA_MAPPING.md:557-559`, `:601`
  - 문제: plan은 `/insights/[slug]`, SoT는 `/insights/{cat}/{slug}` 또는 `/blog/{slug}`다.
  - 권장 patch: v0.1에서 category-less를 택하려면 PAGE_TYPES/SCHEMA_MAPPING cascade가 필요하다. 아니면 `/insights/[category]/[slug]`로 수정.

- **PSR-12**: 데이터 모델 필드명이 DB/Drizzle reality와 C-contract 사이에서 섞임
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:187-196`
  - 근거(SoT/코드): `DATA_MODEL.md:371-405` TreatmentPage는 `name/overview/mechanism/process`; Drizzle은 `treatment_page.title/body_markdown` `schema.ts:175-184`. Article도 `headline/body` vs DB `title/body_markdown` `schema.ts:210-220`.
  - 문제: public renderer가 어떤 SoT를 읽는지 불명확하다. v0.1 SSR이 DB를 읽는다면 Drizzle field mapping table이 필요하다.
  - 권장 patch: “DB projection → core contract normalize” 표를 추가하고 Hero/About/Doctor/Treatment/Article/Location/Legal별 필드 출처를 확정.

- **PSR-13**: Design token naming이 DESIGN_TOKENS semantic 22와 직접 매핑되지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:206-210`
  - 근거(SoT): `DESIGN_TOKENS.md:174-200`, `:727-758`
  - 문제: `colors.canvas`, `fg.default`, `border.strong`은 SoT 토큰명(`color.surface.background`, `color.text.primary`, `color.border.default/subtle`)과 다르다.
  - 권장 patch: Tailwind alias 표를 추가하되 원본 semantic 22 round-trip을 보장: `bg-canvas -> color.surface.background`, `text-fg-default -> color.text.primary` 등.

- **PSR-14**: dark mode “light only”가 DESIGN_TOKENS v1.0과 충돌
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:208`, `:324`
  - 근거(SoT): `DESIGN_TOKENS.md:21-23`, `:204-208`, `:878-898`
  - 문제: plan은 dark 미지원이라고 하면서 `data-theme="dark"` 검증을 시나리오에 둔다. SoT는 light/dark 두 테마와 30개 대비 검증을 요구한다.
  - 권장 patch: v0.1에서도 CSS vars light/dark 값은 출력하고, UI toggle만 defer한다고 분리.

- **PSR-15**: public reader 권한에 schema/table GRANT만 있고 RLS policy 전체 목록이 없음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:120-129`
  - 근거(SoT/코드): core migrations는 `app_tenant_user` 중심 RLS/GRANT, 예: `LOCATION_LEGAL_PLAN.md:136-141`; `schema.ts` tables 전체
  - 문제: `app_public_reader`용 policy를 모든 content table에 추가해야 하는데 migration 작업 단위에는 D0011만 있고 각 table policy 이름/USING 조건/GRANT revoke가 없다.
  - 권장 patch: D0011에 per-table `CREATE POLICY public_reader_select_* FOR SELECT TO app_public_reader`를 명시.

- **PSR-16**: status filter와 LegalDocument DB CHECK가 맞지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:138-145`
  - 근거(코드): `schema.ts:281-285`, `LOCATION_LEGAL_PLAN.md:117-121`
  - 문제: plan은 legal `draft/publishable/published`를 읽겠다고 하나 현재 DB는 draft/published_at null/risk Low만 허용한다.
  - 권장 patch: v0.1은 `status='draft'`만 읽거나, public 노출 defer. publishable/published는 LL-DEFER-01 합류 후로 이동.

- **PSR-17**: JSON-LD validator 시나리오가 SoT의 “운영 모니터링”과 CI 게이트를 혼동
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:326`
  - 근거(SoT): `SCHEMA_MAPPING.md:902-910`
  - 문제: Google Rich Results/schema.org validator 통과를 LOCAL_PASS 필수로 두면 외부 validator 의존 게이트가 된다.
  - 권장 patch: LOCAL_PASS는 자체 rule checker/JSON parse/필수 entity 검증으로 두고 외부 validator는 manual QA marker로 낮춤.

## minor
- **PSR-18**: scenario #1 통과 기준 문구 반대
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:309`
  - 근거: primary CTA 표시가 목적이면 “보임”이어야 함.
  - 권장 patch: “primaryCtas[0].label 가 페이지 안 보임” → “보임”.

- **PSR-19**: Markdown sanitizer 선택이 SSR 환경 차이를 반영하지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:198-202`
  - 문제: DOMPurify는 서버에서 jsdom 등 추가 구성이 필요하다.
  - 권장 patch: SSR 기본은 `sanitize-html` 또는 `rehype-sanitize`로 좁히고 허용 태그/속성 목록을 명시.

- **PSR-20**: 외부 링크 rel에 `noreferrer` 누락 여부 결정 필요
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:202`
  - 근거: SEO/GEO 체크리스트 관행은 `noopener noreferrer`; plan은 `nofollow noopener`.
  - 권장 patch: privacy/analytics 의도에 따라 `nofollow noopener noreferrer` 또는 referrer 유지 정책을 명시.

- **PSR-21**: `WEB_PUBLIC_DATABASE_URL` cascade가 env/example/pgbouncer/app role까지 분해되지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:132`, `:299-301`, `:351`
  - 문제: userlist marker만 있고 `.env.example`, pooling mode, password/user 생성, role membership/NOINHERIT 여부가 없다.
  - 권장 patch: D0011 + env + pgbouncer userlist + deployment secret 작업을 acceptance checklist로 분리.

## cascade marker / acceptance precondition 점검
- PSR-CASCADE-01: FAIL — marker는 있으나 실제 admin URL 코드 tree/redirect/API 영향이 acceptance precondition으로 충분히 구체화되지 않음.
- PSR-CASCADE-02: FAIL — SCHEMA_MAPPING § 1.2 path-based `@id` marker 필요. 현재 SoT는 domain root pattern만 보유.
- PSR-CASCADE-03: TBD — M0_BUILD_EXPORT_PLAN placeholder는 존재하지만 SSR component 재사용 marker는 아직 § 2에 없음.
- PSR-CASCADE-04: FAIL — manifest는 현재 9단계 `orderedMigrations`이고 D0011 public reader 10번째 entry가 없음 (`manifest.ts:26-102`).
- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
tokens used
210,994
# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=6 major=11 minor=4 (총 21)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **PSR-01**: M0 minimal 10페이지 선택이 PAGE_TYPES/ARCH 게이트와 불일치
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:11`, `:39`, `:66`, `:273-286`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:23` “P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플”, `docs/admin/ARCHITECTURE.md:171-186`, `:273`
  - 문제: plan은 P-009 Articles List를 포함하고 P-014 Location Detail을 defer한다. 또한 P-010은 1샘플이어야 하나 일반 detail 라우트로 다룬다.
  - 권장 patch: v0.1 minimal을 P-001/002/003/004/005/006/012/013/014 + P-010 1샘플로 재정의하고, P-009는 PAGE_TYPES § 6 우선순위처럼 “M0 미합류”로 이동.

- **PSR-02**: public site URL과 기존 admin URL 충돌 해소가 실제 라우팅 cascade 없이 plan acceptance precondition으로 남음
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:102-106`, `:345`, `:383`
  - 근거(SoT/코드): `apps/web/src/app/(admin)/[instanceSlug]/...` 실제 존재, `ADMIN_UI_SKELETON_PLAN.md:144-151` 현재 `/[instanceSlug]`, `/[instanceSlug]/clinic-profile`
  - 문제: `/(site)/[instanceSlug]`를 추가하면 dashboard, clinic-profile, doctors/treatments/articles admin routes와 공개 routes가 같은 path namespace를 공유한다. sign-in consume redirect도 `/ {firstSlug}`로 고정되어 있다.
  - 권장 patch: PSR-CASCADE-01을 acceptance precondition으로 격상해 코드 tree를 `(admin)/admin/[instanceSlug]/...`로 명시하고, redirect/sign-out/cleanup/API/site-meta-fetch 영향 범위와 회귀 시나리오를 포함.

- **PSR-03**: nested `(site)/[instanceSlug]/layout.tsx`가 `<html>/<body>`를 반환하도록 되어 Next root layout 정책 위반
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159-174`
  - 근거(코드): `apps/web/src/app/layout.tsx:10-14`가 이미 root `<html><body>`를 반환
  - 문제: Next App Router에서 route group nested layout은 `<html>/<body>`를 중복 반환하면 안 된다. plan 예시 그대로 구현하면 런타임/빌드 구조가 깨진다.
  - 권장 patch: site layout은 fragment/div만 반환하고, `<html lang="ko-KR">` 및 body class/theme 처리는 root layout 또는 route segment별 wrapper strategy로 재설계.

- **PSR-04**: robots.txt 정책이 SEARCH_STANDARDIZATION v1.1과 정면 충돌
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245-267`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:21` aiCrawlerPolicy required, allow는 legal approval 필수; `:153-162` 4계열 user-agent; `:190-250` disallowTraining 기본 예시; `DATA_MODEL.md:575-581`
  - 문제: plan은 `GPTBot`, `ClaudeBot`까지 기본 Allow하고 `aiCrawlerPolicy`/법무 승인/Google-Extended/CCBot/OAI-SearchBot/Claude-SearchBot/ChatGPT-User 등을 누락한다.
  - 권장 patch: robots 생성은 InstanceManifest.aiCrawlerPolicy 기반으로 바꾸고, v0.1 기본은 `disallowTraining` starter template에 맞춰 D 계열 학습 봇을 Disallow. `allow`는 승인 필드 3종 required.

- **PSR-05**: `app_public_reader`가 instance slug를 RLS 아래에서 resolve할 수 없음
  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:115-132`
  - 근거(코드): `D0010_instance.sql:25-30`는 `app_tenant_user`만 `current_setting('app.current_instance_id')` 기준 SELECT 허용
  - 문제: helper 흐름은 “instance 조회 → current_instance_id set”인데, public reader가 처음 slug를 조회할 정책이 없다. 또한 `CREATE ROLE app_public_reader;`는 connection URL용 LOGIN 여부도 불명확하다.
  - 권장 patch: `app_public_reader LOGIN` 여부, `instance`에 active slug lookup 전용 SELECT policy, 이후 content tables의 `instance_id = current_setting(...)` policy를 분리 명시.

- **PSR-06**: LegalDocument draft 공개 노출이 “출시 게이트/법무 검토” SoT와 충돌
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:40`, `:145`, `:196`, `:316`
  - 근거(SoT): `DATA_MODEL.md:846` LegalDocument는 “M0 출시 게이트”와 법무 검토 필수, `:874-875`; `CONTENT_STANDARDS.md:414` ComplianceRecord 발행 게이트 면제 아님; `LOCATION_LEGAL_PLAN.md:11` draft 저장만, 발행 게이트 defer
  - 문제: plan은 draft 법적 문서를 공개 site에서 노출하고 robots도 index한다. v0.1 개발자 접근 단계라 해도 공개 렌더 plan의 기본 노출 정책으로는 법무 게이트를 우회한다.
  - 권장 patch: LegalDocument는 v0.1에서 `noindex` + dev-only 또는 authenticated preview로 제한하거나, 공개 노출은 ComplianceRecord legalCounsel/legalCounselAt 합류 후로 defer.

## major
- **PSR-07**: JSON-LD graph가 SCHEMA_MAPPING § 2.5와 일부 불일치
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:275-286`
  - 근거(SoT): `SCHEMA_MAPPING.md:230-240`, P-012 `:654-662`, P-013 `:699-707`
  - 문제: P-012에 `ContactPage`를 추가하지만 SoT는 WebPage + MedicalClinic 풀이다. P-013은 MedicalClinic ref만 맞지만 P-014 자체가 누락됐다.
  - 권장 patch: § 3 페이지별 graph 표를 SCHEMA_MAPPING 문구 그대로 `[풀]/[참조]`로 재작성하고 P-014를 추가.

- **PSR-08**: `@id` path-based 변형이 cascade marker만 있고 canonical/entity identity 충돌 규칙이 없음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:289`, `:384`
  - 근거(SoT): `SCHEMA_MAPPING.md:52-66`는 `https://{domain}/#organization`, `/#clinic`; `:83-92` main clinic entity 고정
  - 문제: `https://<host>/<instanceSlug>/#clinic` 임시 패턴은 필요하지만, P-014 main의 `/#clinic` identity와 도메인 매핑 후 변경 시 entity continuity가 깨질 수 있다.
  - 권장 patch: PSR-CASCADE-02에 v0.1 임시 canonical base 정의와 M0 도메인 전환 시 migration/redirect/entity-id stability note 추가.

- **PSR-09**: sitemap lastmod/changefreq/priority가 SEARCH_STANDARDIZATION과 다름
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:236-243`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:345-362`, `:365-370`
  - 문제: plan은 리스트 daily/디테일 weekly/정책 0.5라고 하나 SoT는 P-012 yearly 0.6, P-013 yearly 0.3, P-010 monthly 0.5 등이다. Treatment/Article lastmod도 publishedAt가 아니라 updatedAt/dateModified 우선이다.
  - 권장 patch: SEARCH_STANDARDIZATION § 4.3/4.4 표를 그대로 반영.

- **PSR-10**: metadata API 출력에서 theme-color와 P-006 og:type 규칙 누락
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:219-227`, `:291-295`
  - 근거(SoT): `SEARCH_STANDARDIZATION.md:83-99`, `:103-123`; `DESIGN_TOKENS.md:811-818`
  - 문제: theme-color light/dark 의무가 빠졌고, P-006 Treatment Detail은 `og:type=article`이어야 한다.
  - 권장 patch: `themeColor` 두 값, P-004 profile/P-006 article/P-010 article 매핑을 명시.

- **PSR-11**: Article URL 패턴이 PAGE_TYPES/SCHEMA_MAPPING과 다름
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:93`, `:104`, `:194`
  - 근거(SoT): `PAGE_TYPES.md:45`, `:331`; `SCHEMA_MAPPING.md:557-559`, `:601`
  - 문제: plan은 `/insights/[slug]`, SoT는 `/insights/{cat}/{slug}` 또는 `/blog/{slug}`다.
  - 권장 patch: v0.1에서 category-less를 택하려면 PAGE_TYPES/SCHEMA_MAPPING cascade가 필요하다. 아니면 `/insights/[category]/[slug]`로 수정.

- **PSR-12**: 데이터 모델 필드명이 DB/Drizzle reality와 C-contract 사이에서 섞임
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:187-196`
  - 근거(SoT/코드): `DATA_MODEL.md:371-405` TreatmentPage는 `name/overview/mechanism/process`; Drizzle은 `treatment_page.title/body_markdown` `schema.ts:175-184`. Article도 `headline/body` vs DB `title/body_markdown` `schema.ts:210-220`.
  - 문제: public renderer가 어떤 SoT를 읽는지 불명확하다. v0.1 SSR이 DB를 읽는다면 Drizzle field mapping table이 필요하다.
  - 권장 patch: “DB projection → core contract normalize” 표를 추가하고 Hero/About/Doctor/Treatment/Article/Location/Legal별 필드 출처를 확정.

- **PSR-13**: Design token naming이 DESIGN_TOKENS semantic 22와 직접 매핑되지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:206-210`
  - 근거(SoT): `DESIGN_TOKENS.md:174-200`, `:727-758`
  - 문제: `colors.canvas`, `fg.default`, `border.strong`은 SoT 토큰명(`color.surface.background`, `color.text.primary`, `color.border.default/subtle`)과 다르다.
  - 권장 patch: Tailwind alias 표를 추가하되 원본 semantic 22 round-trip을 보장: `bg-canvas -> color.surface.background`, `text-fg-default -> color.text.primary` 등.

- **PSR-14**: dark mode “light only”가 DESIGN_TOKENS v1.0과 충돌
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:208`, `:324`
  - 근거(SoT): `DESIGN_TOKENS.md:21-23`, `:204-208`, `:878-898`
  - 문제: plan은 dark 미지원이라고 하면서 `data-theme="dark"` 검증을 시나리오에 둔다. SoT는 light/dark 두 테마와 30개 대비 검증을 요구한다.
  - 권장 patch: v0.1에서도 CSS vars light/dark 값은 출력하고, UI toggle만 defer한다고 분리.

- **PSR-15**: public reader 권한에 schema/table GRANT만 있고 RLS policy 전체 목록이 없음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:120-129`
  - 근거(SoT/코드): core migrations는 `app_tenant_user` 중심 RLS/GRANT, 예: `LOCATION_LEGAL_PLAN.md:136-141`; `schema.ts` tables 전체
  - 문제: `app_public_reader`용 policy를 모든 content table에 추가해야 하는데 migration 작업 단위에는 D0011만 있고 각 table policy 이름/USING 조건/GRANT revoke가 없다.
  - 권장 patch: D0011에 per-table `CREATE POLICY public_reader_select_* FOR SELECT TO app_public_reader`를 명시.

- **PSR-16**: status filter와 LegalDocument DB CHECK가 맞지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:138-145`
  - 근거(코드): `schema.ts:281-285`, `LOCATION_LEGAL_PLAN.md:117-121`
  - 문제: plan은 legal `draft/publishable/published`를 읽겠다고 하나 현재 DB는 draft/published_at null/risk Low만 허용한다.
  - 권장 patch: v0.1은 `status='draft'`만 읽거나, public 노출 defer. publishable/published는 LL-DEFER-01 합류 후로 이동.

- **PSR-17**: JSON-LD validator 시나리오가 SoT의 “운영 모니터링”과 CI 게이트를 혼동
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:326`
  - 근거(SoT): `SCHEMA_MAPPING.md:902-910`
  - 문제: Google Rich Results/schema.org validator 통과를 LOCAL_PASS 필수로 두면 외부 validator 의존 게이트가 된다.
  - 권장 patch: LOCAL_PASS는 자체 rule checker/JSON parse/필수 entity 검증으로 두고 외부 validator는 manual QA marker로 낮춤.

## minor
- **PSR-18**: scenario #1 통과 기준 문구 반대
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:309`
  - 근거: primary CTA 표시가 목적이면 “보임”이어야 함.
  - 권장 patch: “primaryCtas[0].label 가 페이지 안 보임” → “보임”.

- **PSR-19**: Markdown sanitizer 선택이 SSR 환경 차이를 반영하지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:198-202`
  - 문제: DOMPurify는 서버에서 jsdom 등 추가 구성이 필요하다.
  - 권장 patch: SSR 기본은 `sanitize-html` 또는 `rehype-sanitize`로 좁히고 허용 태그/속성 목록을 명시.

- **PSR-20**: 외부 링크 rel에 `noreferrer` 누락 여부 결정 필요
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:202`
  - 근거: SEO/GEO 체크리스트 관행은 `noopener noreferrer`; plan은 `nofollow noopener`.
  - 권장 patch: privacy/analytics 의도에 따라 `nofollow noopener noreferrer` 또는 referrer 유지 정책을 명시.

- **PSR-21**: `WEB_PUBLIC_DATABASE_URL` cascade가 env/example/pgbouncer/app role까지 분해되지 않음
  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:132`, `:299-301`, `:351`
  - 문제: userlist marker만 있고 `.env.example`, pooling mode, password/user 생성, role membership/NOINHERIT 여부가 없다.
  - 권장 patch: D0011 + env + pgbouncer userlist + deployment secret 작업을 acceptance checklist로 분리.

## cascade marker / acceptance precondition 점검
- PSR-CASCADE-01: FAIL — marker는 있으나 실제 admin URL 코드 tree/redirect/API 영향이 acceptance precondition으로 충분히 구체화되지 않음.
- PSR-CASCADE-02: FAIL — SCHEMA_MAPPING § 1.2 path-based `@id` marker 필요. 현재 SoT는 domain root pattern만 보유.
- PSR-CASCADE-03: TBD — M0_BUILD_EXPORT_PLAN placeholder는 존재하지만 SSR component 재사용 marker는 아직 § 2에 없음.
- PSR-CASCADE-04: FAIL — manifest는 현재 9단계 `orderedMigrations`이고 D0011 public reader 10번째 entry가 없음 (`manifest.ts:26-102`).
- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
