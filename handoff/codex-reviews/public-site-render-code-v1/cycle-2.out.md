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
session id: 019e396f-dd7c-78a0-8dc3-6205ed9a7a2a
--------
user
You are reviewing **cycle 2** of the PUBLIC_SITE_RENDER code v1.0. Cycle 1 had **15 findings** (blocking=3, major=9, minor=3). All 15 were patched. `pnpm --filter @glitzy/web typecheck` now PASS.

## Cycle 1 patch summary

| # | severity | title | patch |
|---|---|---|---|
| PSRC-01 | blocking | ClinicProfileForm.tsx stale import | `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions` |
| PSRC-02 | blocking | sanitize-html lockfile + transformTags 타입 | pnpm-lock.yaml 갱신 + `transformTags.a` 콜백 파라미터 타입 명시 |
| PSRC-03 | blocking | withPublicTenantTransaction 타입 | `TransactionSql` callback param + `sql.begin<T \| null>` |
| PSRC-04 | major | D0011 password 하드코딩 | `CREATE ROLE app_public_reader LOGIN` 만, password 는 환경별 provision |
| PSRC-05 | major | JSON-LD MedicalClinic ref 미참조 + Article author inline 누락 | `webPageEntity` 안 `aboutClinic` 옵션 + `articleEntity` author inline `name/jobTitle/image`. P-003·P-004·P-005·P-006·P-010 graph 안 MedicalClinic 풀 entity 추가 (location 있을 때) |
| PSRC-06 | major | rule checker cross-reference 약함 | `validateJsonLdGraph(graph, { siteBaseUrl })` — same-origin URL 은 graph entity 필수, 외부 origin 만 dereferenceable 예외 |
| PSRC-07 | major | sitemap minimal 페이지 빈 상태 미포함 + lastmod | P-003/P-005 항상 포함 · `MAX(updated_at)` aggregate |
| PSRC-08 | major | canonical URL request-aware absolute | `siteBaseUrl()` 호출 + `siteMetadata.ts` 안 absolute URL 생성 |
| PSRC-09 | major | Host header spoof | env `PUBLIC_SITE_ORIGIN` 우선, 미지정 시 request host fallback |
| PSRC-10 | major | layout-level loader 반복 호출 | `cache(loadSiteInitial)` — render pass 안 한 번 SELECT |
| PSRC-11 | major | businessHours narrowing 약함 | opens/closes/from/to TIME_REGEX + ISO date regex strict |
| PSRC-12 | major | Markdown 외부 링크 rel 누락 (protocol-relative) | `//evil.example` 도 외부 분류 |
| PSRC-13 | minor | Home article teaser + location summary 누락 | Home 에 Articles + Contact 섹션 추가 |
| PSRC-14 | minor | ContactPoint @id 상대 fragment | `${siteBaseUrl}/#contact-${id}` absolute |
| PSRC-15 | minor | Legal route hostOrigin 하드코딩 | `siteBaseUrl(params.instanceSlug)` |

추가 의존성: `sanitize-html@2.13` + `@types/sanitize-html@2.13` (pnpm-lock.yaml 갱신 완료).
환경 변수 추가: `WEB_PUBLIC_DATABASE_URL`, `PUBLIC_SITE_ORIGIN`(optional).

## Re-review scope (cycle 2)

같은 코드/docs 영역 모두 다시 점검:
- 코드: apps/web/src/app/(site)/[instanceSlug]/* · apps/web/src/components/site/* · apps/web/src/lib/(public-db|public-tenant|db-projection|site-initial|site-url|site-metadata|markdown).ts · apps/web/src/lib/json-ld/* · packages/db/migrations/D0011_public_reader.sql · packages/migrations-runner/src/manifest.ts
- 어드민 prefix: `apps/web/src/app/(admin)/admin/[instanceSlug]/*` · `apps/web/src/app/page.tsx` · `apps/web/src/app/sign-in/consume/route.ts`
- docs: 변경 없음 — cycle 1 cascade docs (ARCH § 3.12 · SCHEMA_MAPPING § 1.2 · M0_BUILD_EXPORT § 2.1) 보존 확인

## What to check (cycle 2)

1. cycle 1 patch 가 plan SoT 와 일관 + typecheck PASS 유지
2. 회귀 (regression) — 시그니처 변경 cascade (doctorsListGraph/doctorProfileGraph/treatmentsListGraph/articleDetailGraph 안 location 인자 추가 → caller 모두 갱신했는가)
3. PSR-CASCADE-01b 코드 cascade 완료 검증
4. plan SoT § 7 시나리오 1~23 의 실제 통과 여부 추론
5. 새 finding (PSRC-16+ 부터)

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- PSRC-01 ~ PSRC-15 각각 PASS / FAIL / PARTIAL

## new blocking / major / minor (PSRC-16+)

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
```

가능한 한 광범위하게 보고, 파일을 line 단위로 인용하라. 한국어로 응답.

codex
cycle 2 리뷰로 진행하겠습니다. 먼저 관련 파일과 문서 위치를 빠르게 맵핑한 뒤, 패치 검증과 새 회귀를 분리해서 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
 succeeded in 575ms:
tsconfig.base.json
skills-lock.json
pnpm-workspace.yaml
pnpm-lock.yaml
packages\storage\tsconfig.json
packages\storage\src\tenant-context.ts
packages\storage\src\storage-client.ts
packages\storage\src\sign-url.ts
packages\storage\src\index.ts
packages\storage\src\errors.ts
packages\storage\src\config.ts
packages\storage\src\audit-log.ts
packages\storage\package.json
package.json
packages\auth\tsconfig.json
packages\shared-types\tsconfig.json
packages\migrations-runner\tsconfig.json
packages\db\tsconfig.json
packages\core-content\tsconfig.json
packages\notifications-outbox\tsconfig.json
handoff\PROJECT_OVERVIEW.md
handoff\glitzy-website-audit.md
packages\auth\src\session.ts
packages\auth\src\resolve-tenant-context.ts
packages\auth\src\magic-link.ts
packages\shared-errors\tsconfig.json
packages\migrations-runner\src\manifest.ts
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\shared-types\package.json
packages\shared-types\src\index.ts
packages\db\src\tenant.ts
packages\db\src\service-role.ts
packages\db\src\index.ts
packages\db\src\errors.ts
packages\db\src\advisory-lock.ts
packages\db\package.json
packages\notifications-outbox\package.json
packages\auth\src\config.ts
packages\auth\src\audit.ts
packages\auth\package.json
packages\auth\src\errors.ts
packages\auth\src\index.ts
packages\notifications-outbox\src\provider-adapter.ts
packages\notifications-outbox\src\outbox.ts
packages\notifications-outbox\src\index.ts
packages\notifications-outbox\src\errors.ts
packages\core-content\src\index.ts
packages\core-content\package.json
packages\core-content\src\schema.ts
docs\research\REFERENCE_DEEP_DIVE_2026-05.md
docs\research\REFERENCE_ANALYSIS_2026-05.md
packages\auth\src\internal\session-internal.ts
packages\shared-errors\src\index.ts
packages\shared-errors\package.json
packages\db\migrations\D0011_public_reader.sql
packages\db\migrations\D0010_instance.sql
apps\spike-c-local\tsconfig.scenarios.json
apps\spike-c-local\tsconfig.json
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
docs\ARCHITECTURE.md
apps\web\tsconfig.json
apps\web\tailwind.config.ts
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
packages\core-content\src\templates\bodies.ts
packages\core-content\src\templates\index.ts
apps\spike-c-local\package.json
apps\spike-c-local\docker-compose.yml
apps\spike-c-local\PROVIDER_RUNBOOK.md
apps\spike-d\tsconfig.scenarios.json
apps\spike-d\tsconfig.json
packages\core-content\src\templates\__tests__.ts
packages\core-content\src\templates\render.ts
apps\spike-d\package.json
apps\spike-a\tsconfig.json
docs\features\search-visibility.md
docs\features\notifications.md
docs\features\keyword-monitoring.md
docs\features\crm-sync.md
docs\features\content-migration.md
docs\features\compliance-assistant.md
docs\features\asset-ingestion.md
docs\features\analytics-reporting.md
apps\spike-b\tsconfig.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md
apps\web\package.json
apps\web\next.config.mjs
docs\admin\REVIEW_WORKFLOW.md
docs\admin\ARCHITECTURE.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md
apps\spike-d\docker-compose.yml
apps\spike-d\drizzle.config.ts
apps\spike-b\package.json
apps\spike-c-local\src\tenant-context.ts
apps\spike-c-local\src\storage-client.ts
apps\spike-c-local\src\sign-url.ts
apps\spike-c-local\src\seed.ts
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
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md
apps\spike-b\PROVIDER_RUNBOOK.md
apps\spike-b\README.md
docs\core\SEARCH_STANDARDIZATION.md
docs\core\SCHEMA_MAPPING.md
docs\core\PAGE_TYPES.md
docs\core\DESIGN_TOKENS.md
docs\core\DATA_MODEL.md
docs\core\CONTENT_STANDARDS.md
apps\spike-b\docker-compose.yml
apps\spike-a\README.md
apps\spike-a\PROVIDER_RUNBOOK.md
apps\spike-d\src\service-role.ts
apps\spike-a\src\tenant.ts
apps\spike-a\src\service-role.ts
apps\spike-a\src\seed.ts
apps\spike-a\src\schema.ts
apps\spike-b\src\worker.ts
apps\spike-b\src\tenant.ts
apps\spike-b\src\seed.ts
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
docs\decisions\PROVIDER_PASS_PLAN.md
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md
docs\decisions\PACKAGES_STRUCTURE.md
docs\decisions\M0_SCHEMA_PLAN.md
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\INFRA_DECISIONS_DRAFT.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
apps\spike-a\package.json
apps\spike-b\src\fake-provider.ts
apps\spike-b\src\failure-injection.ts
apps\spike-b\src\errors.ts
apps\spike-b\src\db.ts
apps\spike-b\src\migrate.ts
apps\spike-b\src\fixtures.ts
apps\spike-b\src\outbox.ts
apps\spike-a\src\errors.ts
apps\spike-a\src\db.ts
apps\spike-a\src\fixtures.ts
apps\spike-a\src\migrate.ts
apps\spike-c-local\src\env.ts
apps\spike-c-local\src\audit-log.ts
apps\spike-c-local\src\errors.ts
apps\spike-c-local\src\fixtures.ts
apps\spike-d\src\env.ts
apps\spike-d\src\drift-check.ts
apps\spike-e\tsconfig.scenarios.json
apps\spike-e\tsconfig.json
apps\spike-d\docker\init-multi-db.sh
apps\spike-a\docker-compose.yml
apps\spike-d\src\errors.ts
apps\spike-d\src\migrate.ts
apps\spike-a\pgbouncer\userlist.txt
apps\spike-a\pgbouncer\pgbouncer.ini
apps\spike-a\scripts\wait-db.js
apps\spike-c-local\src\scenarios\test-isolation.ts
apps\spike-c-local\src\scenarios\test-content-type.ts
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
apps\spike-c-local\src\scenarios\provider-smoke.ts
apps\spike-c-local\src\scenarios\invariant-runner.ts
apps\spike-c-local\src\scenarios\test-method-confusion.ts
apps\spike-c-local\src\scenarios\test-list-bucket.ts
apps\spike-c-local\src\scenarios\test-range-request.ts
apps\spike-c-local\src\scenarios\test-replay.ts
apps\spike-e\package.json
apps\spike-e\PROVIDER_RUNBOOK.md
apps\spike-b\migrations\007_provider_attempt_log.sql
apps\spike-b\migrations\006_permanent_alert.sql
apps\spike-b\migrations\005_invariant_log.sql
apps\spike-b\migrations\004_external_call_log.sql
apps\spike-b\migrations\003_inbox.sql
apps\spike-b\migrations\002_outbox.sql
apps\spike-b\migrations\001_roles.sql
apps\web\README.md
apps\web\postcss.config.mjs
apps\spike-a\migrations\004_invariant_log.sql
apps\spike-a\migrations\003_audit_log.sql
apps\spike-a\migrations\002_content_test.sql
apps\spike-a\migrations\001_roles.sql
apps\web\src\types\react-dom-stable.d.ts
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
apps\spike-e\docker-compose.yml
apps\web\src\seed.ts
apps\spike-d\src\db\client.ts
apps\spike-d\src\db\schema.ts
apps\spike-b\src\scenarios\test-invariant-runner.ts
apps\spike-b\src\scenarios\test-idempotency.ts
apps\spike-b\src\scenarios\test-failure-injection.ts
apps\spike-b\src\scenarios\test-basic-100.ts
apps\spike-b\src\scenarios\provider-smoke.ts
apps\spike-b\src\scenarios\test-retry-permanent.ts
apps\spike-b\src\scenarios\test-no-cross-tenant.ts
apps\spike-b\src\scenarios\test-rls-mismatch.ts
apps\spike-b\src\scenarios\test-stale-reclaim.ts
apps\spike-a\src\scenarios\test-nested-tx.ts
apps\spike-a\src\scenarios\test-negative.ts
apps\spike-a\src\scenarios\test-invariant-runner.ts
apps\spike-a\src\scenarios\test-audit.ts
apps\spike-a\src\scenarios\provider-smoke.ts
apps\spike-a\src\scenarios\test-read.ts
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
apps\spike-a\src\scenarios\test-perf.ts
apps\spike-a\src\scenarios\test-rollback.ts
apps\spike-a\src\scenarios\test-write.ts
apps\spike-e\src\session.ts
apps\spike-e\src\seed.ts
apps\spike-e\migrations\005_rls_test_table.sql
apps\spike-e\migrations\004_audit_event.sql
apps\spike-e\migrations\003_auth_session.sql
apps\spike-e\migrations\002_admin_user.sql
apps\spike-e\migrations\001_roles_extensions.sql
apps\web\src\app\layout.tsx
apps\web\src\lib\tenant.ts
apps\web\src\lib\slug-resolver.ts
apps\web\src\lib\site-url.ts
apps\web\src\lib\site-metadata.ts
apps\web\src\lib\site-meta-fetch.ts
apps\web\src\lib\site-initial.ts
apps\web\src\lib\session-cookie.ts
apps\web\src\lib\save-result.ts
apps\web\src\lib\public-tenant.ts
apps\web\src\lib\public-db.ts
apps\web\src\lib\post-login-redirect.ts
apps\web\src\lib\page-context.ts
apps\web\src\lib\markdown.ts
apps\web\src\styles\globals.css
apps\web\scripts\local-pass.ts
apps\web\src\app\page.tsx
apps\spike-e\src\errors.ts
apps\spike-e\src\env.ts
apps\web\src\lib\db.ts
apps\web\src\lib\db-projection.ts
apps\web\src\lib\clinic-profile-schema.ts
apps\web\src\lib\action-context.ts
apps\web\src\lib\env.ts
apps\web\src\lib\deny-reason-map.ts
apps\web\src\lib\errors.ts
apps\spike-e\src\audit.ts
apps\spike-e\src\magic-link.ts
apps\spike-e\src\fixtures.ts
apps\spike-e\src\migrate.ts
apps\spike-e\src\resolve-tenant-context.ts
apps\web\src\app\sign-out\route.ts
apps\web\src\lib\json-ld\entities.ts
apps\web\src\lib\json-ld\builders.ts
apps\web\src\lib\json-ld\JsonLdScript.tsx
apps\web\src\lib\json-ld\types.ts
apps\spike-e\src\scenarios\test-invariant.ts
apps\spike-e\src\scenarios\test-invalid-instance-id.ts
apps\spike-e\src\scenarios\test-inactive-user.ts
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
apps\spike-e\src\scenarios\test-client-tampering.ts
apps\spike-e\src\scenarios\test-action-eligibility.ts
apps\spike-e\src\scenarios\provider-smoke.ts
apps\spike-e\src\scenarios\test-rls-integration.ts
apps\spike-e\src\scenarios\test-membership-removal.ts
apps\spike-e\src\scenarios\test-magic-link-login.ts
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
apps\spike-e\src\scenarios\test-super-admin-switch.ts
apps\spike-e\src\scenarios\test-session-refresh.ts
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
apps\web\src\app\sign-in\page.tsx
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\components\forms\Field.tsx
apps\web\src\components\forms\DoctorProfileForm.tsx
apps\web\src\components\forms\DeleteForm.tsx
apps\web\src\components\forms\ClinicProfileForm.tsx
apps\web\src\components\forms\ArticleForm.tsx
apps\web\src\app\sign-in\actions.ts
apps\web\src\app\(admin)\layout.tsx
apps\spike-e\src\db\client.ts
apps\web\src\components\site\TreatmentCard.tsx
apps\web\src\components\site\SiteHeader.tsx
apps\web\src\components\site\SiteFooter.tsx
apps\web\src\components\site\ReservationChannels.tsx
apps\web\src\components\site\Hero.tsx
apps\web\src\components\site\DoctorCard.tsx
apps\web\src\components\site\BusinessHoursTable.tsx
apps\web\src\components\site\Breadcrumb.tsx
apps\web\src\components\site\ArticleBody.tsx
apps\web\src\components\dev\MockMailbox.tsx
apps\web\src\lib\json-ld\__tests__\validate.ts
apps\web\src\app\api\health\route.ts
apps\web\src\app\api\site-meta-fetch\route.ts
apps\web\src\app\sign-in\consume\route.ts
apps\web\src\app\sign-in\cleanup\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(site)\[instanceSlug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\not-found.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\layout.tsx
apps\web\src\app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps\web\src\app\(site)\[instanceSlug]\about\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(site)\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(site)\[instanceSlug]\robots.txt\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\contact\page.tsx
apps\web\src\app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps\web\src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx

 succeeded in 592ms:
 M apps/spike-a/pgbouncer/userlist.txt
 M apps/web/.env.example
 M apps/web/package.json
 D apps/web/src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M apps/web/src/app/layout.tsx
 M apps/web/src/app/page.tsx
 M apps/web/src/app/sign-in/consume/route.ts
 M apps/web/src/lib/env.ts
 M apps/web/src/styles/globals.css
 M apps/web/tailwind.config.ts
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M pnpm-lock.yaml
?? apps/web/src/app/(admin)/admin/
?? apps/web/src/app/(site)/
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/components/site/
?? apps/web/src/lib/db-projection.ts
?? apps/web/src/lib/errors.ts
?? apps/web/src/lib/json-ld/
?? apps/web/src/lib/markdown.ts
?? apps/web/src/lib/public-db.ts
?? apps/web/src/lib/public-tenant.ts
?? apps/web/src/lib/site-initial.ts
?? apps/web/src/lib/site-metadata.ts
?? apps/web/src/lib/site-url.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/PROJECT_OVERVIEW.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/db/migrations/D0011_public_reader.sql
?? packages/migrations-runner/src/

codex
작업트리가 큰 변경 세트를 포함하고 있습니다. 리뷰 범위가 새 파일 중심이라, 기존 삭제/이동 상태는 되돌리지 않고 현재 상태 기준으로 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"function|export|doctorsListGraph|doctorProfileGraph|treatmentsListGraph|articleDetailGraph|location|validateJsonLdGraph|MedicalClinic|siteBaseUrl|transformTags|sanitizeHtml|cache\\(|withPublicTenantTransaction|businessHours|ContactPoint|PUBLIC_SITE_ORIGIN|WEB_PUBLIC_DATABASE_URL\" apps/web/src/lib apps/web/src/app/\\(site\\) apps/web/src/components/site packages/db/migrations/D0011_public_reader.sql packages/migrations-runner/src/manifest.ts apps/web/src/app/\\(admin\\)/admin apps/web/src/app/page.tsx apps/web/src/app/sign-in/consume/route.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|1\\.2|2\\.1|PSR-CASCADE|Scenario|시나리오|P-003|P-004|P-005|P-006|P-010|7\\.\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
2026-05-18T04:55:13.739455Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … UBLIC_DATABASE_URL" apps/web/src/lib apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 537ms:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … UBLIC_DATABASE_URL" apps/web/src/lib apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 succeeded in 586ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:63:| `@id` entity 패턴 | path-based (SCHEMA_MAPPING § 1.2 v0.1 임시 표) | 도메인 매핑 SoT 표 — entity continuity 전환 룰 (301 redirect + `sameAs` 보조 marker) |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/ARCHITECTURE.md:51:| F-06 | 네이버 공식 블로그: 개편 이후 공공기관 출처 클릭 77.2%, 학술·연구 30.7% 증가 | 네이버 공식 블로그 | 사용자 공유 본문 | 게시: 2025 추정 | 네이버 자체 측정치. 외부 검증 불가 |
docs/ARCHITECTURE.md:77:| 측정된 효과 | 공공기관 +77.2%, 학술·연구 +30.7% | F-06 |
docs/ARCHITECTURE.md:79:### 1.2 솔루션이 표준화해야 할 본질
docs/ARCHITECTURE.md:87:7. 의료광고법·심의 표준 준수
docs/ARCHITECTURE.md:95:### 2.1 두 평면 + 3 레이어 + Feature Modules
docs/ARCHITECTURE.md:161:7. **Plane 분리**: Control Plane(어드민)이 죽어도 Data Plane(이미 빌드된 사이트)은 작동한다. 어드민의 일시 중단이 사이트 서비스 중단을 의미하지 않는다.
docs/ARCHITECTURE.md:350:## 5. 확장 시나리오
docs/ARCHITECTURE.md:401:## 7. 세부 명세 문서 로드맵
docs/ARCHITECTURE.md:533:### 11.2 keyword-monitoring vs search-visibility 책임 경계
docs/ARCHITECTURE.md:601:| 2026-05-13 | v0.4 | **주요 갱신** (피드백 3차): (1) Control Plane / Data Plane 위상 도입 (§ 0, § 2.1, § 10), (2) Admin-first 개발 접근 명시, (3) Vertical Slice (M0) 개념 + 6개 화면 명세 (Article 포함), (4) Git 원본 vs 어드민 DB 원본 데이터 분리 명확화 (§ 2.5), (5) ComplianceRecord 마스터 정리 (§ 9.4), (6) Feature Modules에 **search-visibility** 신규 추가, keyword-monitoring과 책임 경계 명시 (§ 11.2), (7) D-21 추가, D-10 결정 완료 | Glitzy (Claude 페어링) |
docs/core/SCHEMA_MAPPING.md:25:- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
docs/core/SCHEMA_MAPPING.md:52:### 1.2 `@id` 네이밍 규약
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
docs/core/SCHEMA_MAPPING.md:135:### 2.1 표준 Schema 모듈
docs/core/SCHEMA_MAPPING.md:145:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
docs/core/SCHEMA_MAPPING.md:146:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
docs/core/SCHEMA_MAPPING.md:148:| `Article` | P-010 Article Detail | Article (C-04) |
docs/core/SCHEMA_MAPPING.md:152:| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
docs/core/SCHEMA_MAPPING.md:154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
docs/core/SCHEMA_MAPPING.md:180:> 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).
docs/core/SCHEMA_MAPPING.md:194:> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
docs/core/SCHEMA_MAPPING.md:222:| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
docs/core/SCHEMA_MAPPING.md:223:| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:225:| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:226:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
docs/core/SCHEMA_MAPPING.md:227:| `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
docs/core/SCHEMA_MAPPING.md:256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
docs/core/SCHEMA_MAPPING.md:257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
docs/core/SCHEMA_MAPPING.md:263:> § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.
docs/core/SCHEMA_MAPPING.md:315:| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
docs/core/SCHEMA_MAPPING.md:378:### P-003. Doctors List
docs/core/SCHEMA_MAPPING.md:408:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
docs/core/SCHEMA_MAPPING.md:412:### P-004. Doctor Profile
docs/core/SCHEMA_MAPPING.md:445:### P-005. Treatments List
docs/core/SCHEMA_MAPPING.md:452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
docs/core/SCHEMA_MAPPING.md:475:### P-006. Treatment Detail
docs/core/SCHEMA_MAPPING.md:527:### P-007. Conditions List
docs/core/SCHEMA_MAPPING.md:534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
docs/core/SCHEMA_MAPPING.md:604:### P-010. Article Detail
docs/core/SCHEMA_MAPPING.md:613:7. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:673:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
docs/core/SCHEMA_MAPPING.md:882:| P-004 Doctor Profile | `doctor: DoctorProfile` |
docs/core/SCHEMA_MAPPING.md:883:| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
docs/core/SCHEMA_MAPPING.md:885:| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
docs/core/SCHEMA_MAPPING.md:888:| List 페이지 (P-003·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |
docs/core/SCHEMA_MAPPING.md:905:## 7. 빌드 시 검증
docs/core/SCHEMA_MAPPING.md:907:### 7.1 필수 필드 검증
docs/core/SCHEMA_MAPPING.md:914:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
docs/core/SCHEMA_MAPPING.md:915:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
docs/core/SCHEMA_MAPPING.md:916:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
docs/core/SCHEMA_MAPPING.md:918:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
docs/core/SCHEMA_MAPPING.md:923:### 7.2 빌드 게이트 vs 운영 모니터링 분리
docs/core/SCHEMA_MAPPING.md:933:### 7.3 룰 레벨 분류 (§ 8 금지·주의 schema 처리)
docs/core/SCHEMA_MAPPING.md:974:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
docs/core/SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
docs/core/SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
docs/core/SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
docs/core/SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
docs/core/SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
docs/core/SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
docs/core/SCHEMA_MAPPING.md:991:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
docs/core/SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:40:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:52:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:82:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:96:│     │  ├─ page.tsx                     -- P-003 Doctors List
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:97:│     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:99:│     │  ├─ page.tsx                     -- P-005 Treatments List
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:100:│     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:103:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:126:  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:329:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:330:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:331:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:409:    type: <page-specific>,        // P-001/P-002/P-003/P-005/P-012/P-014 = "website" · P-004 = "profile" · P-006 = "article" · P-010 = "article" · P-013 = "website" (v0.1 미노출)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:428:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:429:- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:444:| P-003 Doctors List | monthly | 0.7 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:445:| P-004 Doctor Profile | monthly | 0.7 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:446:| P-005 Treatments List | monthly | 0.8 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:447:| P-006 Treatment Detail | monthly | 0.8 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:448:| P-010 Article Detail | monthly | 0.5 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:454:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:455:  - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:552:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:553:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:554:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:565:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:594:| # | 시나리오 | 통과 기준 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:602:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:617:| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 2110ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
`pnpm --filter @glitzy/web typecheck`는 현재도 PASS입니다. 이제 타입 통과로 가려지지 않는 라우팅/JSON-LD/시나리오 정합성 쪽을 라인 단위로 좁혀보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "doctorsListGraph|doctorProfileGraph|treatmentsListGraph|articleDetailGraph|homeGraph|aboutGraph|contactGraph|locationGraph|legal|MedicalClinic|validateJsonLdGraph|siteBaseUrl|canonical|location" "apps/web/src/lib/json-ld" "apps/web/src/app/(site)"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"withPublicTenantTransaction|TransactionSql|begin|WEB_PUBLIC_DATABASE_URL|PUBLIC_SITE_ORIGIN|cache\\(|MAX\\(|updated_at|lastmod|transformTags|sanitizeHtml|protocol|nofollow|businessHours|TIME_REGEX|ISO|ContactPoint\" \"apps/web/src/lib\" \"apps/web/src/components/site\" \"apps/web/src/app/(site)\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath|redirect\\(|/admin/|admin/|ClinicProfileForm|actions\" \"apps/web/src/app/(admin)/admin/[instanceSlug]\" \"apps/web/src/app/page.tsx\" \"apps/web/src/app/sign-in/consume/route.ts\" \"apps/web/src/components/forms/ClinicProfileForm.tsx\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|PASSWORD|password|CREATE ROLE|D0011|public_reader" "packages/db/migrations/D0011_public_reader.sql" "packages/migrations-runner/src/manifest.ts" "apps/web/.env.example" "apps/web/package.json" "pnpm-lock.yaml"' in C:\Users\assag\solution\website-exposure
 succeeded in 670ms:
apps/web/src/lib/json-ld\__tests__\validate.ts:18://   외부 origin URL 만 dereferenceable 예외. opts.siteBaseUrl 가 주어지면 그 origin 안 URL 은 graph entity 강제.
apps/web/src/lib/json-ld\__tests__\validate.ts:19:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:31:  const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;
apps/web/src/lib/json-ld\types.ts:17:  readonly siteBaseUrl: string;
apps/web/src/lib/json-ld\types.ts:18:  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:11:import { aboutGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:12:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:22:    canonicalPath: "/about",
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:31:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:33:  const graph = aboutGraph(
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:34:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:36:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:56:            {initial.clinic.legalEntityName ? (
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:57:              <div><dt className="text-fg-muted">법인명</dt><dd className="font-medium text-fg-default">{initial.clinic.legalEntityName}</dd></div>
apps/web/src/lib/json-ld\entities.ts:18:  const id = `${ctx.siteBaseUrl}/#organization`;
apps/web/src/lib/json-ld\entities.ts:26:    ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
apps/web/src/lib/json-ld\entities.ts:29:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld\entities.ts:42:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib/json-ld\entities.ts:51:  location: LocationProjection,
apps/web/src/lib/json-ld\entities.ts:54:    "@type": "MedicalClinic",
apps/web/src/lib/json-ld\entities.ts:55:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src/lib/json-ld\entities.ts:57:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:60:      streetAddress: location.streetAddress,
apps/web/src/lib/json-ld\entities.ts:61:      addressLocality: location.addressLocality,
apps/web/src/lib/json-ld\entities.ts:62:      addressRegion: location.addressRegion,
apps/web/src/lib/json-ld\entities.ts:63:      postalCode: location.postalCode,
apps/web/src/lib/json-ld\entities.ts:64:      addressCountry: location.addressCountry,
apps/web/src/lib/json-ld\entities.ts:66:    ...(location.telephone ? { telephone: location.telephone } : {}),
apps/web/src/lib/json-ld\entities.ts:67:    ...(location.email ? { email: location.email } : {}),
apps/web/src/lib/json-ld\entities.ts:68:    ...(location.latitude !== null && location.longitude !== null ? {
apps/web/src/lib/json-ld\entities.ts:71:        latitude: location.latitude,
apps/web/src/lib/json-ld\entities.ts:72:        longitude: location.longitude,
apps/web/src/lib/json-ld\entities.ts:75:    ...(location.businessHours.openingHours.length > 0 ? {
apps/web/src/lib/json-ld\entities.ts:76:      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
apps/web/src/lib/json-ld\entities.ts:87:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src/lib/json-ld\entities.ts:91:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src/lib/json-ld\entities.ts:97:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:102:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:110:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src/lib/json-ld\entities.ts:127:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:135:    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
apps/web/src/lib/json-ld\entities.ts:141:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:146:// PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
apps/web/src/lib/json-ld\entities.ts:155:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib/json-ld\entities.ts:156:    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
apps/web/src/lib/json-ld\entities.ts:160:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib/json-ld\entities.ts:161:    ...(options.aboutClinic ? { about: { "@id": `${ctx.siteBaseUrl}/#clinic` } } : {}),
apps/web/src/lib/json-ld\entities.ts:168:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib/json-ld\entities.ts:170:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:172:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:182:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib/json-ld\entities.ts:187:      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
apps/web/src/lib/json-ld\entities.ts:199:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/app/(site)\[instanceSlug]\page.tsx:25:import { homeGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:26:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:36:    canonicalPath: "/",
apps/web/src/app/(site)\[instanceSlug]\page.tsx:74:  const graph = homeGraph(
apps/web/src/app/(site)\[instanceSlug]\page.tsx:75:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
apps/web/src/app/(site)\[instanceSlug]\page.tsx:77:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\page.tsx:125:      {initial.locationMain ? (
apps/web/src/app/(site)\[instanceSlug]\page.tsx:132:            <p className="text-base text-fg-default">{formatAddress(initial.locationMain)}</p>
apps/web/src/app/(site)\[instanceSlug]\page.tsx:133:            {initial.locationMain.telephone ? (
apps/web/src/app/(site)\[instanceSlug]\page.tsx:134:              <p className="mt-2 text-sm text-fg-muted">대표 전화: <a href={`tel:${initial.locationMain.telephone}`} className="text-brand-primary hover:text-brand-primary-hover">{initial.locationMain.telephone}</a></p>
apps/web/src/lib/json-ld\builders.ts:21:export function homeGraph(
apps/web/src/lib/json-ld\builders.ts:24:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:28:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:36:export function aboutGraph(
apps/web/src/lib/json-ld\builders.ts:39:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:45:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:52:// PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
apps/web/src/lib/json-ld\builders.ts:55:export function doctorsListGraph(
apps/web/src/lib/json-ld\builders.ts:58:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:64:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:65:    E.webPageEntity(ctx, "의료진", description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:69:      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
apps/web/src/lib/json-ld\builders.ts:76:export function doctorProfileGraph(
apps/web/src/lib/json-ld\builders.ts:79:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:85:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:87:    E.webPageEntity(ctx, doctor.name, description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:97:export function treatmentsListGraph(
apps/web/src/lib/json-ld\builders.ts:100:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:106:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:107:    E.webPageEntity(ctx, "진료", description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:111:      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
apps/web/src/lib/json-ld\builders.ts:121:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:127:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:129:    E.webPageEntity(ctx, treatment.name, description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:139:export function articleDetailGraph(
apps/web/src/lib/json-ld\builders.ts:142:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:149:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:151:    E.webPageEntity(ctx, article.headline, article.summary, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:161:export function contactGraph(
apps/web/src/lib/json-ld\builders.ts:164:  location: LocationProjection,
apps/web/src/lib/json-ld\builders.ts:169:    E.medicalClinicEntity(ctx, clinic, location),
apps/web/src/lib/json-ld\builders.ts:176:export function locationDetailGraph(
apps/web/src/lib/json-ld\builders.ts:179:  location: LocationProjection,
apps/web/src/lib/json-ld\builders.ts:184:    E.medicalClinicEntity(ctx, clinic, location),
apps/web/src/lib/json-ld\builders.ts:185:    E.webPageEntity(ctx, location.name, description),
apps/web/src/lib/json-ld\builders.ts:189:      { name: location.name, path: null },
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:12:import { treatmentsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:23:    canonicalPath: "/treatments",
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:40:  const graph = treatmentsListGraph(
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:43:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:32:    canonicalPath: `/treatments/${t.slug}`,
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:58:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:60:    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:62:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:12:import { contactGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:23:    canonicalPath: "/contact",
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:30:  if (!initial.locationMain) {
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:38:  const loc = initial.locationMain;
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:39:  const graph = contactGraph(
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/contact" },
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:25:    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:26:      SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:46:      locationMain: locationRows[0] ?? null,
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:90:  if (data.locationMain) {
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:92:      loc: `${base}/locations/${data.locationMain.slug}`,
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:93:      lastmod: data.locationMain.updated_at.toISOString(),
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:12:import { doctorsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:23:    canonicalPath: "/doctors",
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:40:  const graph = doctorsListGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:43:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:6:// 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:31:  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:36:        FROM legal_document
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:37:       WHERE document_type = ${params.type}::legal_document_type
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:42:  if (!legal) notFound();
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:45:  const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:52:        { label: legal.title, href: null },
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:55:        <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:56:        <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:57:        <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:12:import { locationDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:20:  if (!initial || !initial.locationMain) return {};
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:22:    pageTitle: initial.locationMain.name,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:23:    description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:24:    canonicalPath: `/locations/${params.slug}`,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:36:  if (!initial || !initial.locationMain) notFound();
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:37:  const loc = initial.locationMain;
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:39:  const graph = locationDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:13:import { doctorProfileGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:33:    canonicalPath: `/doctors/${doctor.slug}`,
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:68:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:69:  const graph = doctorProfileGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:70:    { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:72:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:13:import { articleDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:73:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:74:  const graph = articleDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:77:    initial.locationMain,

 succeeded in 643ms:
apps/web/.env.example:13:WEB_DATABASE_URL=postgres://web_role:password@localhost:5432/glitzy_dev
apps/web/.env.example:15:# WEB_PUBLIC_DATABASE_URL: 공개 사이트 SSR 전용 — app_public_reader (read-only · RLS instance_id scope)
apps/web/.env.example:16:#   필수 grant (PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 / D0011_public_reader.sql):
apps/web/.env.example:17:#     CREATE ROLE app_public_reader LOGIN PASSWORD 'app_public_reader_pw';
apps/web/.env.example:18:#     GRANT USAGE ON SCHEMA public TO app_public_reader;
apps/web/.env.example:20:#                     doctor_profile, treatment_page, article, legal_document TO app_public_reader;
apps/web/.env.example:21:#     + per-table CREATE POLICY public_reader_*_select (instance_id USING + status published)
apps/web/.env.example:22:WEB_PUBLIC_DATABASE_URL=postgres://app_public_reader:app_public_reader_pw@localhost:5432/glitzy_dev
apps/web/.env.example:25:SEED_DATABASE_URL=postgres://postgres:password@localhost:5432/glitzy_dev
packages/db/migrations/D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
packages/db/migrations/D0011_public_reader.sql:10:-- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
packages/db/migrations/D0011_public_reader.sql:12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
packages/db/migrations/D0011_public_reader.sql:13:-- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
packages/db/migrations/D0011_public_reader.sql:15:CREATE ROLE app_public_reader LOGIN;
packages/db/migrations/D0011_public_reader.sql:17:GRANT USAGE ON SCHEMA public TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:22:GRANT SELECT ON instance TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:24:CREATE POLICY public_reader_instance_select
packages/db/migrations/D0011_public_reader.sql:27:  TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:36:  TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:38:CREATE POLICY public_reader_clinic_profile_select
packages/db/migrations/D0011_public_reader.sql:39:  ON clinic_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:42:CREATE POLICY public_reader_location_profile_select
packages/db/migrations/D0011_public_reader.sql:43:  ON location_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:46:CREATE POLICY public_reader_doctor_profile_select
packages/db/migrations/D0011_public_reader.sql:47:  ON doctor_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:54:CREATE POLICY public_reader_treatment_page_select
packages/db/migrations/D0011_public_reader.sql:55:  ON treatment_page FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:63:CREATE POLICY public_reader_article_select
packages/db/migrations/D0011_public_reader.sql:64:  ON article FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:74:CREATE POLICY public_reader_legal_document_select
packages/db/migrations/D0011_public_reader.sql:75:  ON legal_document FOR SELECT TO app_public_reader
packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages/migrations-runner/src/manifest.ts:105:    file: "packages/db/migrations/D0011_public_reader.sql",
packages/migrations-runner/src/manifest.ts:108:      "app_public_reader",
packages/migrations-runner/src/manifest.ts:109:      "public_reader_instance_select",
packages/migrations-runner/src/manifest.ts:110:      "public_reader_clinic_profile_select",
packages/migrations-runner/src/manifest.ts:111:      "public_reader_location_profile_select",
packages/migrations-runner/src/manifest.ts:112:      "public_reader_doctor_profile_select",
packages/migrations-runner/src/manifest.ts:113:      "public_reader_treatment_page_select",
packages/migrations-runner/src/manifest.ts:114:      "public_reader_article_select",
packages/migrations-runner/src/manifest.ts:115:      "public_reader_legal_document_select",

 succeeded in 657ms:
apps/web/src/components/site\BusinessHoursTable.tsx:16:export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
apps/web/src/lib\env.ts:10:  WEB_PUBLIC_DATABASE_URL: z.string().min(1, "WEB_PUBLIC_DATABASE_URL required"),
apps/web/src/lib\db-projection.ts:22:  updated_at: Date;
apps/web/src/lib\db-projection.ts:38:  updated_at: Date;
apps/web/src/lib\db-projection.ts:51:  updated_at: Date;
apps/web/src/lib\db-projection.ts:61:  updated_at: Date;
apps/web/src/lib\db-projection.ts:72:  updated_at: Date;
apps/web/src/lib\db-projection.ts:81:  updated_at: Date;
apps/web/src/lib\db-projection.ts:128:  businessHours: {
apps/web/src/lib\db-projection.ts:202:function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
apps/web/src/lib\db-projection.ts:203:  const empty: LocationProjection["businessHours"] = {
apps/web/src/lib\db-projection.ts:211:  const bh = r.businessHours;
apps/web/src/lib\db-projection.ts:224:const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
apps/web/src/lib\db-projection.ts:225:const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
apps/web/src/lib\db-projection.ts:235:    && typeof o.opens === "string" && TIME_REGEX.test(o.opens)
apps/web/src/lib\db-projection.ts:236:    && typeof o.closes === "string" && TIME_REGEX.test(o.closes);
apps/web/src/lib\db-projection.ts:243:    && typeof o.from === "string" && TIME_REGEX.test(o.from)
apps/web/src/lib\db-projection.ts:244:    && typeof o.to === "string" && TIME_REGEX.test(o.to);
apps/web/src/lib\db-projection.ts:250:  if (typeof o.date !== "string" || !ISO_DATE_REGEX.test(o.date)) return false;
apps/web/src/lib\db-projection.ts:268:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:285:    businessHours: parseBusinessHours(row.metadata),
apps/web/src/lib\db-projection.ts:286:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:301:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:313:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:326:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:337:    updatedAt: row.updated_at,
apps/web/src/lib\clinic-profile-schema.ts:7://   - businessHours 7요일 + 점심 (LL-FORM-07/10)
apps/web/src/lib\clinic-profile-schema.ts:34:const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
apps/web/src/lib\clinic-profile-schema.ts:35:const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
apps/web/src/lib\clinic-profile-schema.ts:45:  .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:46:    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:61:  .refine((v) => ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:62:    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:86:    if (!val.open || !TIME_REGEX.test(val.open)) {
apps/web/src/lib\clinic-profile-schema.ts:89:    if (!val.close || !TIME_REGEX.test(val.close)) {
apps/web/src/lib\clinic-profile-schema.ts:92:    if (val.open && val.close && TIME_REGEX.test(val.open) && TIME_REGEX.test(val.close)) {
apps/web/src/lib\clinic-profile-schema.ts:98:      if (!val.lunchFrom || !TIME_REGEX.test(val.lunchFrom)) {
apps/web/src/lib\clinic-profile-schema.ts:101:      if (!val.lunchTo || !TIME_REGEX.test(val.lunchTo)) {
apps/web/src/lib\clinic-profile-schema.ts:106:        TIME_REGEX.test(val.lunchFrom) && TIME_REGEX.test(val.lunchTo)
apps/web/src/lib\clinic-profile-schema.ts:123:export const businessHoursSchema = z
apps/web/src/lib\clinic-profile-schema.ts:147:export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;
apps/web/src/lib\clinic-profile-schema.ts:209:    .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO 3166-1 alpha-2 (대문자 2자) 이어야 합니다." }),
apps/web/src/lib\clinic-profile-schema.ts:226:  businessHours: businessHoursSchema,
apps/web/src/lib\clinic-profile-schema.ts:263:    .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:264:      message: "정책 시행일은 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:318: * FormData key: businessHours_<day>_<field> (예: businessHours_monday_open=09:30)
apps/web/src/lib\clinic-profile-schema.ts:324:      closed: formData.get(`businessHours_${day}_closed`) === "on",
apps/web/src/lib\clinic-profile-schema.ts:325:      open: (formData.get(`businessHours_${day}_open`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:326:      close: (formData.get(`businessHours_${day}_close`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:327:      lunchEnabled: formData.get(`businessHours_${day}_lunchEnabled`) === "on",
apps/web/src/lib\clinic-profile-schema.ts:328:      lunchFrom: (formData.get(`businessHours_${day}_lunchFrom`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:329:      lunchTo: (formData.get(`businessHours_${day}_lunchTo`) as string | null) ?? undefined,
apps/web/src/components/site\SiteFooter.tsx:22:        {loc && loc.businessHours.openingHours.length > 0 ? (
apps/web/src/components/site\SiteFooter.tsx:26:              {loc.businessHours.openingHours.map((oh, i) => (
apps/web/src/components/site\SiteFooter.tsx:31:              {loc.businessHours.lunchBreaks.map((lb, i) => (
apps/web/src/lib\markdown.ts:5:// 외부 링크: rel="nofollow noopener noreferrer" 자동.
apps/web/src/lib\markdown.ts:8:import sanitizeHtml from "sanitize-html";
apps/web/src/lib\markdown.ts:44:  const sanitized = sanitizeHtml(html, {
apps/web/src/lib\markdown.ts:49:    transformTags: {
apps/web/src/lib\markdown.ts:57:            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
apps/web/src/lib\markdown.ts:140:  // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:61:        <BusinessHoursTable hours={loc.businessHours} />
apps/web/src/app/(site)\[instanceSlug]\page.tsx:9:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:45:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\page.tsx:47:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\page.tsx:53:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\page.tsx:60:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/lib\public-tenant.ts:1:// @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
apps/web/src/lib\public-tenant.ts:11:import type { Sql, TransactionSql } from "postgres";
apps/web/src/lib\public-tenant.ts:26:export async function withPublicTenantTransaction<T>(
apps/web/src/lib\public-tenant.ts:28:  fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
apps/web/src/lib\public-tenant.ts:31:  // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
apps/web/src/lib\public-tenant.ts:33:  return sql.begin<T | null>(async (tx: TransactionSql) => {
apps/web/src/lib\public-db.ts:24:  const sql = postgres(env.WEB_PUBLIC_DATABASE_URL, {
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:30:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:32:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/lib\site-meta-fetch.ts:137:  if (url.protocol !== "http:" && url.protocol !== "https:") {
apps/web/src/lib\site-meta-fetch.ts:271:  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
apps/web/src/lib\site-initial.ts:7:// PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
apps/web/src/lib\site-initial.ts:11:import { withPublicTenantTransaction } from "./public-tenant";
apps/web/src/lib\site-initial.ts:28:export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
apps/web/src/lib\site-initial.ts:29:  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
apps/web/src/lib\site-initial.ts:34:             business_registration_number, primary_ctas, updated_at
apps/web/src/lib\site-initial.ts:45:             phone, email, metadata, updated_at
apps/web/src/lib\site-url.ts:5:// PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
apps/web/src/lib\site-url.ts:12: * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
apps/web/src/lib\site-url.ts:18:  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
apps/web/src/lib\site-url.ts:33:  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:10:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:31:  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:35:             updated_at
apps/web/src/app/(site)\[instanceSlug]\robots.txt\route.ts:9:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
apps/web/src/lib\json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib\json-ld\entities.ts:41:    "@type": "ContactPoint",
apps/web/src/lib\json-ld\entities.ts:75:    ...(location.businessHours.openingHours.length > 0 ? {
apps/web/src/lib\json-ld\entities.ts:76:      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
apps/web/src/lib\json-ld\entities.ts:140:    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:2:// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:11:  lastmod: string; // ISO 8601
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:17:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:21:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:22:    const clinicRows = await tx<{ updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:23:      SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:25:    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:26:      SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:28:    const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:29:      SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:31:    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:33:      SELECT MAX(updated_at) AS latest FROM doctor_profile
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:35:    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:36:      SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:39:      SELECT MAX(updated_at) AS latest FROM treatment_page
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:41:    const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:42:      SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:45:      clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:48:      doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:50:      treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:58:  entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:60:  entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:62:  entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:65:    entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:68:  entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:73:      lastmod: (t.published_at ?? t.updated_at).toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:82:      lastmod: (a.published_at ?? a.updated_at).toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:88:  entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:93:      lastmod: data.locationMain.updated_at.toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:110:    <lastmod>${e.lastmod}</lastmod>
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:21:  const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:23:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:46:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:48:      SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:57:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:22:  const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:24:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:49:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:51:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:61:        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:100:            <time dateTime={data.article.publishedAt.toISOString()}>
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:101:              {data.article.publishedAt.toISOString().slice(0, 10)}
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:65:        <BusinessHoursTable hours={loc.businessHours} />
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:30:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:32:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:21:  const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:23:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:46:  const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:48:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at

 succeeded in 659ms:
apps/web/src/app/page.tsx:17:    redirect("/sign-in");
apps/web/src/app/page.tsx:32:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src/app/page.tsx:40:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src/app/page.tsx:48:    redirect("/sign-in/cleanup?reason=user-inactive");
apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src/app/page.tsx:55:    redirect("/sign-in?reason=no-active-membership");
apps/web/src/app/page.tsx:57:  redirect(`/admin/${result.slug}`);
apps/web/src/components/forms/ClinicProfileForm.tsx:1:// @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
apps/web/src/components/forms/ClinicProfileForm.tsx:14:import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
apps/web/src/components/forms/ClinicProfileForm.tsx:133:export function ClinicProfileForm({
apps/web/src/app/sign-in/consume/route.ts:52:    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
apps/web/src/app/sign-in/consume/route.ts:67:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src/app/sign-in/consume/route.ts:82:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src/app/sign-in/consume/route.ts:93:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src/app/sign-in/consume/route.ts:110:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src/app/sign-in/consume/route.ts:125:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src/app/sign-in/consume/route.ts:146:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src/app/sign-in/consume/route.ts:162:    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src/app/sign-in/consume/route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:75:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:85:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:96:            href={`/admin/${params.instanceSlug}/doctors`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:102:            href={`/admin/${params.instanceSlug}/treatments`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:108:            href={`/admin/${params.instanceSlug}/articles`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:120:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/admin/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:177:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:229:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:11:  ClinicProfileForm,
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:14:} from "@/components/forms/ClinicProfileForm";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:21:import { saveClinicProfile } from "./actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:244:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:261:      <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:96:  if (!signedToken) redirect("/sign-in");
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:106:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:113:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:455:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\new\page.tsx:8:import { saveTreatmentPage } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:12:import { deleteTreatmentPage, saveTreatmentPage } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:68:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:59:          href={`/admin/${params.instanceSlug}/doctors/new`}
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/articles/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:259:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:183:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:263:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:48:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:61:        <Link href={`/admin/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:12:import { saveDoctorProfile, deleteDoctorProfile } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:69:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:13:import { saveArticle } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:44:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:12:import { deleteArticle, saveArticle } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:84:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\new\page.tsx:8:import { saveDoctorProfile } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/builders.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/__tests__/validate.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/entities.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 540 -and $i -le 570){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 1919ms:
   1: // @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
   3: //
   4: // 통과 기준:
   5: //   1. JSON parse OK
   6: //   2. @context = "https://schema.org" + @graph 배열
   7: //   3. @id 유일 (graph 안 중복 없음)
   8: //   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
   9: //   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)
  10: 
  11: import type { JsonLdGraph, JsonLdEntity } from "../types";
  12: 
  13: export type ValidationResult =
  14:   | { ok: true }
  15:   | { ok: false; errors: string[] };
  16: 
  17: // PSRC-06 patch: validate(graph, opts) — same-origin @id reference 는 graph entity 필수,
  18: //   외부 origin URL 만 dereferenceable 예외. opts.siteBaseUrl 가 주어지면 그 origin 안 URL 은 graph entity 강제.
  19: export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  20:   const errors: string[] = [];
  21: 
  22:   // (1)(2) shape
  23:   if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  24:   const g = graph as Record<string, unknown>;
  25:   if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  26:   const arr = g["@graph"];
  27:   if (!Array.isArray(arr)) {
  28:     return { ok: false, errors: [...errors, "@graph must be array"] };
  29:   }
  30: 
  31:   const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;
  32: 
  33:   // (3) @id 유일
  34:   const ids = new Set<string>();
  35:   const idMap = new Map<string, JsonLdEntity>();
  36:   for (const ent of arr) {
  37:     if (typeof ent !== "object" || ent === null) {
  38:       errors.push("entity must be object");
  39:       continue;
  40:     }
  41:     const e = ent as Record<string, unknown>;
  42:     if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
  43:     if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
  44:     if (typeof e["@id"] === "string") {
  45:       if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
  46:       ids.add(e["@id"]);
  47:       idMap.set(e["@id"], e as JsonLdEntity);
  48:     }
  49:   }
  50: 
  51:   // (4) cross-reference — graph 안 `{ "@id": "..." }` 참조가 idMap 안 또는 외부 dereferenceable URL
  52:   function checkRefs(value: unknown, path: string): void {
  53:     if (typeof value !== "object" || value === null) return;
  54:     if (Array.isArray(value)) {
  55:       value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
  56:       return;
  57:     }
  58:     const v = value as Record<string, unknown>;
  59:     if (typeof v["@id"] === "string" && Object.keys(v).length === 1) {
  60:       const ref = v["@id"];
  61:       if (!ids.has(ref)) {
  62:         const refOrigin = tryOrigin(ref);
  63:         if (refOrigin && siteOrigin && refOrigin === siteOrigin) {
  64:           // same-origin → graph entity 필수
  65:           errors.push(`unresolved same-origin reference at ${path}: ${ref}`);
  66:         } else if (refOrigin === null) {
  67:           // relative fragment or invalid URL
  68:           errors.push(`unresolved reference at ${path}: ${ref}`);
  69:         }
  70:         // 외부 origin URL → dereferenceable 예외 (통과)
  71:       }
  72:     }
  73:     for (const [k, vv] of Object.entries(v)) {
  74:       if (k === "@type" || k === "@id") continue;
  75:       checkRefs(vv, `${path}.${k}`);
  76:     }
  77:   }
  78:   arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
  79: 
  80:   return errors.length === 0 ? { ok: true } : { ok: false, errors };
  81: }
  82: 
  83: function tryOrigin(url: string): string | null {
  84:   try {
  85:     return new URL(url).origin;
  86:   } catch {
  87:     return null;
  88:   }
  89: }
  90: 
  91: /**
  92:  * 페이지 타입별 expected entity types 검증
  93:  */
  94: export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
  95:   const present = new Set(graph["@graph"].map((e) => e["@type"]));
  96:   const missing = expected.filter((t) => !present.has(t));
  97:   if (missing.length === 0) return { ok: true };
  98:   return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
  99: }

 succeeded in 1925ms:
 540: ### 5.4 JSON-LD 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정
 541: 
 542: - 모든 페이지 `<head>` 안 단일 `<script type="application/ld+json">` block 출력.
 543: - 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
 544: - **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:
 545: 
 546: | 페이지 | graph entities (cycle1 PSR-07 정정) |
 547: |---|---|
 548: | P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
 549: | P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
 550: | P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
 551: | P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 552: | P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
 553: | P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 554: | P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 555: | P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
 556: | P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 557: | P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
 558: 
 559: **결정**:
 560: - (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
 561: - (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
 562: - (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
 563:   - rule checker 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts` 신설
 564:   - 페이지별 expected entities 정의 (위 표 그대로)
 565:   - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
 566: 
 567: ### 5.5 OpenGraph / Twitter (PSR-SEO-15)
 568: 
 569: - 페이지 entity 의 `hero_image_url` 또는 `og_image_url` 사용. 부재 시 clinic.og_image_url fallback.
 570: - v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).

 succeeded in 2033ms:
   1: // @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
   2: // SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10: } from "@/lib/db-projection";
  11: import type { JsonLdGraph, GraphBuilderContext } from "./types";
  12: import * as E from "./entities";
  13: 
  14: const CONTEXT = "https://schema.org" as const;
  15: 
  16: function graph(entities: ReturnType<typeof E.organizationEntity>[]): JsonLdGraph {
  17:   return { "@context": CONTEXT, "@graph": entities };
  18: }
  19: 
  20: // === P-001 Home ===
  21: export function homeGraph(
  22:   ctx: GraphBuilderContext,
  23:   clinic: ClinicProjection,
  24:   location: LocationProjection | null,
  25: ): JsonLdGraph {
  26:   const entities = [
  27:     E.organizationEntity(ctx, clinic),
  28:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  29:     E.webSiteEntity(ctx, clinic.name),
  30:     E.webPageEntity(ctx, clinic.name, clinic.description),
  31:   ];
  32:   return graph(entities);
  33: }
  34: 
  35: // === P-002 About ===
  36: export function aboutGraph(
  37:   ctx: GraphBuilderContext,
  38:   clinic: ClinicProjection,
  39:   location: LocationProjection | null,
  40:   title: string,
  41:   description: string,
  42: ): JsonLdGraph {
  43:   return graph([
  44:     E.organizationEntity(ctx, clinic),
  45:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  46:     E.webPageEntity(ctx, title, description),
  47:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
  48:   ]);
  49: }
  50: 
  51: // === P-003 Doctors List ===
  52: // PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
  53: //   SCHEMA_MAPPING § 2.5 의 "참조만" 해석을 v0.1 단계에서 "graph 안 entity + WebPage.about ref" 로 운영.
  54: //   SCHEMA_MAPPING cascade marker — 본 plan code v1.0 acceptance commit 직후 SCHEMA_MAPPING 별 cycle.
  55: export function doctorsListGraph(
  56:   ctx: GraphBuilderContext,
  57:   clinic: ClinicProjection,
  58:   location: LocationProjection | null,
  59:   doctors: DoctorProjection[],
  60:   description: string,
  61: ): JsonLdGraph {
  62:   return graph([
  63:     E.organizationEntity(ctx, clinic),
  64:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  65:     E.webPageEntity(ctx, "의료진", description, { aboutClinic: location !== null }),
  66:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
  67:     E.itemListEntity(
  68:       ctx,
  69:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
  70:       "doctors",
  71:     ),
  72:   ]);
  73: }
  74: 
  75: // === P-004 Doctor Profile ===
  76: export function doctorProfileGraph(
  77:   ctx: GraphBuilderContext,
  78:   clinic: ClinicProjection,
  79:   location: LocationProjection | null,
  80:   doctor: DoctorProjection,
  81:   description: string,
  82: ): JsonLdGraph {
  83:   return graph([
  84:     E.organizationEntity(ctx, clinic),
  85:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  86:     E.physicianEntity(ctx, doctor),
  87:     E.webPageEntity(ctx, doctor.name, description, { aboutClinic: location !== null }),
  88:     E.breadcrumbListEntity(ctx, [
  89:       { name: "홈", path: "/" },
  90:       { name: "의료진", path: "/doctors" },
  91:       { name: doctor.name, path: null },
  92:     ]),
  93:   ]);
  94: }
  95: 
  96: // === P-005 Treatments List ===
  97: export function treatmentsListGraph(
  98:   ctx: GraphBuilderContext,
  99:   clinic: ClinicProjection,
 100:   location: LocationProjection | null,
 101:   treatments: TreatmentProjection[],
 102:   description: string,
 103: ): JsonLdGraph {
 104:   return graph([
 105:     E.organizationEntity(ctx, clinic),
 106:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 107:     E.webPageEntity(ctx, "진료", description, { aboutClinic: location !== null }),
 108:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
 109:     E.itemListEntity(
 110:       ctx,
 111:       treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
 112:       "treatments",
 113:     ),
 114:   ]);
 115: }
 116: 
 117: // === P-006 Treatment Detail ===
 118: export function treatmentDetailGraph(
 119:   ctx: GraphBuilderContext,
 120:   clinic: ClinicProjection,
 121:   location: LocationProjection | null,
 122:   treatment: TreatmentProjection,
 123:   description: string,
 124: ): JsonLdGraph {
 125:   return graph([
 126:     E.organizationEntity(ctx, clinic),
 127:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 128:     E.medicalProcedureEntity(ctx, treatment),
 129:     E.webPageEntity(ctx, treatment.name, description, { aboutClinic: location !== null }),
 130:     E.breadcrumbListEntity(ctx, [
 131:       { name: "홈", path: "/" },
 132:       { name: "진료", path: "/treatments" },
 133:       { name: treatment.name, path: null },
 134:     ]),
 135:   ]);
 136: }
 137: 
 138: // === P-010 Article Detail ===
 139: export function articleDetailGraph(
 140:   ctx: GraphBuilderContext,
 141:   clinic: ClinicProjection,
 142:   location: LocationProjection | null,
 143:   article: ArticleProjection,
 144:   author: DoctorProjection | null,
 145:   category: string,
 146: ): JsonLdGraph {
 147:   return graph([
 148:     E.organizationEntity(ctx, clinic),
 149:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 150:     E.articleEntity(ctx, article, author, category),
 151:     E.webPageEntity(ctx, article.headline, article.summary, { aboutClinic: location !== null }),
 152:     E.breadcrumbListEntity(ctx, [
 153:       { name: "홈", path: "/" },
 154:       { name: "인사이트", path: null },
 155:       { name: article.headline, path: null },
 156:     ]),
 157:   ]);
 158: }
 159: 
 160: // === P-012 Contact ===
 161: export function contactGraph(
 162:   ctx: GraphBuilderContext,
 163:   clinic: ClinicProjection,
 164:   location: LocationProjection,
 165:   description: string,
 166: ): JsonLdGraph {
 167:   return graph([
 168:     E.organizationEntity(ctx, clinic),
 169:     E.medicalClinicEntity(ctx, clinic, location),
 170:     E.webPageEntity(ctx, "연락처", description),
 171:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
 172:   ]);
 173: }
 174: 
 175: // === P-014 Location Detail ===
 176: export function locationDetailGraph(
 177:   ctx: GraphBuilderContext,
 178:   clinic: ClinicProjection,
 179:   location: LocationProjection,
 180:   description: string,
 181: ): JsonLdGraph {
 182:   return graph([
 183:     E.organizationEntity(ctx, clinic),
 184:     E.medicalClinicEntity(ctx, clinic, location),
 185:     E.webPageEntity(ctx, location.name, description),
 186:     E.breadcrumbListEntity(ctx, [
 187:       { name: "홈", path: "/" },
 188:       { name: "위치", path: null },
 189:       { name: location.name, path: null },
 190:     ]),
 191:   ]);
 192: }

 succeeded in 2132ms:
   1: // @glitzy/web/lib/json-ld/entities — entity builder helpers
   2: // SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10:   PrimaryCta,
  11: } from "@/lib/db-projection";
  12: import { formatAddress } from "@/lib/db-projection";
  13: import type { JsonLdEntity, GraphBuilderContext } from "./types";
  14: 
  15: const NAVER_RESERVATION_CHANNELS = new Set(["phone", "email", "kakao-talk", "naver-reservation", "naver-talk", "form"]);
  16: 
  17: export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  18:   const id = `${ctx.siteBaseUrl}/#organization`;
  19:   const contactPoints = clinic.primaryCtas
  20:     .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
  21:     .map((c) => contactPointEntity(ctx, c));
  22:   return {
  23:     "@type": "Organization",
  24:     "@id": id,
  25:     name: clinic.name,
  26:     ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
  27:     description: clinic.description,
  28:     ...(clinic.slogan ? { slogan: clinic.slogan } : {}),
  29:     url: ctx.siteBaseUrl,
  30:     logo: clinic.logoUrl,
  31:     ...(clinic.founder ? { founder: { "@type": "Person", name: clinic.founder } } : {}),
  32:     ...(clinic.foundingDate ? { foundingDate: clinic.foundingDate } : {}),
  33:     ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  34:   };
  35: }
  36: 
  37: // PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
  38: function contactPointEntity(ctx: GraphBuilderContext, cta: PrimaryCta): JsonLdEntity {
  39:   const contactType = cta.type === "phone" ? "reservations" : cta.label;
  40:   return {
  41:     "@type": "ContactPoint",
  42:     "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
  43:     contactType,
  44:     ...(cta.type === "phone" && cta.targetUrl.startsWith("tel:") ? { telephone: cta.targetUrl.slice(4) } : { url: cta.targetUrl }),
  45:   } as JsonLdEntity;
  46: }
  47: 
  48: export function medicalClinicEntity(
  49:   ctx: GraphBuilderContext,
  50:   clinic: ClinicProjection,
  51:   location: LocationProjection,
  52: ): JsonLdEntity {
  53:   return {
  54:     "@type": "MedicalClinic",
  55:     "@id": `${ctx.siteBaseUrl}/#clinic`,
  56:     name: clinic.name,
  57:     parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
  58:     address: {
  59:       "@type": "PostalAddress",
  60:       streetAddress: location.streetAddress,
  61:       addressLocality: location.addressLocality,
  62:       addressRegion: location.addressRegion,
  63:       postalCode: location.postalCode,
  64:       addressCountry: location.addressCountry,
  65:     },
  66:     ...(location.telephone ? { telephone: location.telephone } : {}),
  67:     ...(location.email ? { email: location.email } : {}),
  68:     ...(location.latitude !== null && location.longitude !== null ? {
  69:       geo: {
  70:         "@type": "GeoCoordinates",
  71:         latitude: location.latitude,
  72:         longitude: location.longitude,
  73:       },
  74:     } : {}),
  75:     ...(location.businessHours.openingHours.length > 0 ? {
  76:       openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
  77:         "@type": "OpeningHoursSpecification",
  78:         dayOfWeek: oh.dayOfWeek.map((d) => `https://schema.org/${d}`),
  79:         opens: oh.opens,
  80:         closes: oh.closes,
  81:       })),
  82:     } : {}),
  83:   };
  84: }
  85: 
  86: export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  87:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
  88: }
  89: 
  90: export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  91:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
  92: }
  93: 
  94: export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  95:   return {
  96:     "@type": "Physician",
  97:     "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
  98:     name: doctor.name,
  99:     ...(doctor.title ? { jobTitle: doctor.title } : {}),
 100:     ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
 101:     ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
 102:     worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
 103:     medicalSpecialty: "MedicalSpecialty",
 104:   };
 105: }
 106: 
 107: export function medicalProcedureEntity(ctx: GraphBuilderContext, treatment: TreatmentProjection): JsonLdEntity {
 108:   return {
 109:     "@type": "MedicalProcedure",
 110:     "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
 111:     name: treatment.name,
 112:     description: treatment.summary,
 113:     ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
 114:   };
 115: }
 116: 
 117: export function articleEntity(
 118:   ctx: GraphBuilderContext,
 119:   article: ArticleProjection,
 120:   author: DoctorProjection | null,
 121:   category: string,
 122: ): JsonLdEntity {
 123:   // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
 124:   const authorBlock = author ? {
 125:     author: {
 126:       "@type": "Physician",
 127:       "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
 128:       name: author.name,
 129:       ...(author.title ? { jobTitle: author.title } : {}),
 130:       ...(author.photoUrl ? { image: author.photoUrl } : {}),
 131:     },
 132:   } : {};
 133:   return {
 134:     "@type": "Article",
 135:     "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
 136:     headline: article.headline,
 137:     description: article.summary,
 138:     inLanguage: "ko-KR",
 139:     ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
 140:     ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
 141:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 142:     ...authorBlock,
 143:   };
 144: }
 145: 
 146: // PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
 147: export function webPageEntity(
 148:   ctx: GraphBuilderContext,
 149:   title: string,
 150:   description: string,
 151:   options: { aboutClinic?: boolean } = {},
 152: ): JsonLdEntity {
 153:   return {
 154:     "@type": "WebPage",
 155:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
 156:     url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
 157:     name: title,
 158:     description,
 159:     inLanguage: "ko-KR",
 160:     isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
 161:     ...(options.aboutClinic ? { about: { "@id": `${ctx.siteBaseUrl}/#clinic` } } : {}),
 162:   };
 163: }
 164: 
 165: export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
 166:   return {
 167:     "@type": "WebSite",
 168:     "@id": `${ctx.siteBaseUrl}/#website`,
 169:     name,
 170:     url: ctx.siteBaseUrl,
 171:     inLanguage: "ko-KR",
 172:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 173:   };
 174: }
 175: 
 176: export function breadcrumbListEntity(
 177:   ctx: GraphBuilderContext,
 178:   items: Array<{ name: string; path: string | null }>,
 179: ): JsonLdEntity {
 180:   return {
 181:     "@type": "BreadcrumbList",
 182:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
 183:     itemListElement: items.map((it, i) => ({
 184:       "@type": "ListItem",
 185:       position: i + 1,
 186:       name: it.name,
 187:       ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
 188:     })),
 189:   };
 190: }
 191: 
 192: export function itemListEntity(
 193:   ctx: GraphBuilderContext,
 194:   items: Array<{ name: string; itemId: string }>,
 195:   listId: string,
 196: ): JsonLdEntity {
 197:   return {
 198:     "@type": "ItemList",
 199:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
 200:     itemListElement: items.map((it, i) => ({
 201:       "@type": "ListItem",
 202:       position: i + 1,
 203:       item: { "@id": it.itemId, name: it.name },
 204:     })),
 205:   };
 206: }
 207: 
 208: function stripMarkdown(md: string): string {
 209:   return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
 210: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-url.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-metadata.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 686ms:
   1: // @glitzy/web/lib/site-url — request-aware site base URL helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
   3: //
   4: // PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
   5: // PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
   6: // 가 설정되어 있으면 우선. 없으면 request host fallback (dev/staging 한정).
   7: 
   8: import { headers } from "next/headers";
   9: 
  10: /**
  11:  * Compute the v0.1 path-based site base URL for the current request.
  12:  * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
  13:  *     `http://localhost:3000/glitzy-clinic` (dev fallback)
  14:  * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
  15:  */
  16: export function siteBaseUrl(instanceSlug: string): string {
  17:   // PSRC-09: production trusted origin 우선 — Host header spoof 회피
  18:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  19:   if (trustedOrigin && trustedOrigin.length > 0) {
  20:     return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  21:   }
  22:   // dev/staging fallback — request host
  23:   const h = headers();
  24:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  25:   const proto = h.get("x-forwarded-proto") ?? "http";
  26:   return `${proto}://${host}/${instanceSlug}`;
  27: }
  28: 
  29: /**
  30:  * Compute origin only (no instanceSlug suffix). For sitemap/robots sitemap URL.
  31:  */
  32: export function siteOrigin(): string {
  33:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  34:   if (trustedOrigin && trustedOrigin.length > 0) {
  35:     return trustedOrigin.replace(/\/$/, "");
  36:   }
  37:   const h = headers();
  38:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  39:   const proto = h.get("x-forwarded-proto") ?? "http";
  40:   return `${proto}://${host}`;
  41: }

 succeeded in 706ms:
   1: // @glitzy/web/lib/site-metadata — Next metadata 공통 헬퍼
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06
   3: 
   4: import type { Metadata, ResolvingMetadata } from "next";
   5: import type { ClinicProjection } from "./db-projection";
   6: import { siteBaseUrl } from "./site-url";
   7: 
   8: export type PageMetaInput = {
   9:   /** Next.js metadata title — page-specific (e.g. "소개", "의료진"). 자동으로 `${title} | ${clinic.name}` 결합 */
  10:   pageTitle: string;
  11:   /** page-specific description (50~160자 권장). 부재 시 clinic.description fallback */
  12:   description?: string;
  13:   /** og:type — P-001/2/3/5/12/13/14 = "website" · P-004 = "profile" · P-006/P-010 = "article" */
  14:   ogType?: "website" | "profile" | "article";
  15:   /** page 의 hero image URL — 부재 시 clinic.ogImageUrl fallback */
  16:   imageUrl?: string;
  17:   /** canonical path (e.g. "/about", "/doctors/hong"). instance prefix 자동 prepend */
  18:   canonicalPath?: string;
  19:   /** robots: index — P-013 Legal v0.1 false */
  20:   noindex?: boolean;
  21: };
  22: 
  23: /**
  24:  * Build Next.js metadata for a site page.
  25:  *
  26:  * @param clinic — site initial 의 clinic projection (Header/Footer 공통)
  27:  * @param instanceSlug — URL prefix
  28:  * @param input — page-specific overrides
  29:  */
  30: export function buildPageMetadata(
  31:   clinic: ClinicProjection,
  32:   instanceSlug: string,
  33:   input: PageMetaInput,
  34: ): Metadata {
  35:   const title = input.pageTitle === clinic.name
  36:     ? clinic.name
  37:     : `${input.pageTitle} | ${clinic.name}`;
  38:   const description = input.description ?? clinic.description;
  39:   const image = input.imageUrl ?? clinic.ogImageUrl;
  40:   const canonicalPath = input.canonicalPath ?? "/";
  41:   // PSRC-08 patch: canonical / OpenGraph URL 은 absolute (request-aware)
  42:   const baseUrl = siteBaseUrl(instanceSlug);
  43:   const canonical = canonicalPath === "/" ? baseUrl : `${baseUrl}${canonicalPath}`;
  44: 
  45:   return {
  46:     title,
  47:     description,
  48:     alternates: { canonical },
  49:     openGraph: {
  50:       title,
  51:       description,
  52:       type: input.ogType ?? "website",
  53:       url: canonical,
  54:       images: image ? [{ url: image }] : undefined,
  55:       locale: "ko_KR",
  56:       siteName: clinic.name,
  57:     },
  58:     twitter: {
  59:       card: "summary_large_image",
  60:       title,
  61:       description,
  62:       images: image ? [image] : undefined,
  63:     },
  64:     robots: {
  65:       index: input.noindex ? false : true,
  66:       follow: true,
  67:     },
  68:     // PSR-SEO-02 (cycle3 PSR-29 정정): themeColor 출처 BrandTokens.colors.light/dark.primary
  69:     // v0.1 default — DESIGN_TOKENS § 3.2 color.brand.primary light=#2563eb · dark=#60a5fa
  70:     themeColor: [
  71:       { media: "(prefers-color-scheme: light)", color: "#2563eb" },
  72:       { media: "(prefers-color-scheme: dark)", color: "#60a5fa" },
  73:     ],
  74:   };
  75: }
  76: 
  77: export type { Metadata, ResolvingMetadata };

2026-05-18T04:56:05.775072Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T04:56:05.777084Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/robots.txt/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 779ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/robots.txt/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 794ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content 'apps/web/package.json'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "<JsonLdScript|validateJsonLdGraph|validateExpectedEntities|JsonLdScript" "apps/web/src/app/(site)" "apps/web/src/lib/json-ld"' in C:\Users\assag\solution\website-exposure
 succeeded in 688ms:
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts"
  },
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
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "sanitize-html": "^2.13.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/sanitize-html": "^2.13.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

 succeeded in 717ms:
apps/web/src/lib/json-ld\JsonLdScript.tsx:1:// @glitzy/web/lib/json-ld/JsonLdScript — 통합 graph 단일 <script> 출력
apps/web/src/lib/json-ld\JsonLdScript.tsx:6:export function JsonLdScript({ graph }: { graph: JsonLdGraph }) {
apps/web/src/lib/json-ld\__tests__\validate.ts:19:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:94:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web/src/app/(site)\[instanceSlug]\page.tsx:24:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:82:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:48:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:10:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:43:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:50:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:79:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:50:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:48:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:85:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:69:      <JsonLdScript graph={graph} />

 succeeded in 729ms:
   1: // @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
   2: // SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { siteOrigin } from "@/lib/site-url";
   8: 
   9: type SitemapEntry = {
  10:   loc: string;
  11:   lastmod: string; // ISO 8601
  12:   changefreq: "weekly" | "monthly" | "yearly";
  13:   priority: string;
  14: };
  15: 
  16: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  17:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  18:   const origin = siteOrigin();
  19:   const base = `${origin}/${params.instanceSlug}`;
  20: 
  21:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const clinicRows = await tx<{ updated_at: Date }[]>`
  23:       SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
  24:     `;
  25:     const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
  26:       SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
  27:     `;
  28:     const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
  29:       SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
  30:     `;
  31:     // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
  32:     const doctorAggRows = await tx<{ latest: Date | null }[]>`
  33:       SELECT MAX(updated_at) AS latest FROM doctor_profile
  34:     `;
  35:     const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  36:       SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
  37:     `;
  38:     const treatmentAggRows = await tx<{ latest: Date | null }[]>`
  39:       SELECT MAX(updated_at) AS latest FROM treatment_page
  40:     `;
  41:     const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  42:       SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
  43:     `;
  44:     return {
  45:       clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  46:       locationMain: locationRows[0] ?? null,
  47:       doctors: doctorRows,
  48:       doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  49:       treatments: treatmentRows,
  50:       treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  51:       articles: articleRows,
  52:     };
  53:   });
  54:   if (!data) return new NextResponse("instance not found", { status: 404 });
  55: 
  56:   const entries: SitemapEntry[] = [];
  57:   // P-001 Home
  58:   entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
  59:   // P-002 About
  60:   entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
  61:   // P-003 Doctors List — PSRC-07: 빈 상태도 항상 포함 (minimal 페이지)
  62:   entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
  63:   // P-004 Doctor Profile (each)
  64:   for (const d of data.doctors) {
  65:     entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
  66:   }
  67:   // P-005 Treatments List — PSRC-07: 빈 상태도 항상 포함
  68:   entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
  69:   // P-006 Treatment Detail (each)
  70:   for (const t of data.treatments) {
  71:     entries.push({
  72:       loc: `${base}/treatments/${t.slug}`,
  73:       lastmod: (t.published_at ?? t.updated_at).toISOString(),
  74:       changefreq: "monthly",
  75:       priority: "0.8",
  76:     });
  77:   }
  78:   // P-010 Article Detail (각 article — v0.1 fallback category `general`)
  79:   for (const a of data.articles) {
  80:     entries.push({
  81:       loc: `${base}/insights/general/${a.slug}`,
  82:       lastmod: (a.published_at ?? a.updated_at).toISOString(),
  83:       changefreq: "monthly",
  84:       priority: "0.5",
  85:     });
  86:   }
  87:   // P-012 Contact
  88:   entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
  89:   // P-014 Location Detail
  90:   if (data.locationMain) {
  91:     entries.push({
  92:       loc: `${base}/locations/${data.locationMain.slug}`,
  93:       lastmod: data.locationMain.updated_at.toISOString(),
  94:       changefreq: "monthly",
  95:       priority: "0.7",
  96:     });
  97:   }
  98:   // P-013 Legal — v0.1 단계 sitemap 제외 (noindex · PSR-SEO-07)
  99: 
 100:   const xml = renderSitemap(entries);
 101:   return new NextResponse(xml, {
 102:     status: 200,
 103:     headers: { "content-type": "application/xml; charset=utf-8" },
 104:   });
 105: }
 106: 
 107: function renderSitemap(entries: SitemapEntry[]): string {
 108:   const urls = entries.map((e) => `  <url>
 109:     <loc>${escapeXml(e.loc)}</loc>
 110:     <lastmod>${e.lastmod}</lastmod>
 111:     <changefreq>${e.changefreq}</changefreq>
 112:     <priority>${e.priority}</priority>
 113:   </url>`).join("\n");
 114:   return `<?xml version="1.0" encoding="UTF-8"?>
 115: <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 116: ${urls}
 117: </urlset>`;
 118: }
 119: 
 120: function escapeXml(s: string): string {
 121:   return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
 122: }

 succeeded in 718ms:
   1: // @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
   2: // SoT: SEARCH_STANDARDIZATION § 3.3 disallowTraining 출력 예시 (line-by-line 정합)
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { siteOrigin } from "@/lib/site-url";
   7: 
   8: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
   9:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  10:   const origin = siteOrigin();
  11:   const sitemapUrl = `${origin}/${params.instanceSlug}/sitemap.xml`;
  12: 
  13:   // SEARCH_STANDARDIZATION § 3.3 `disallowTraining` 출력 예시 그대로 (v0.1 starter)
  14:   // 운영 단계 ClinicProfile.metadata.aiCrawlerPolicy row-driven 합류는 PSR-DEFER-10
  15:   const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
  16: 
  17: # 일반 룰
  18: User-agent: *
  19: Disallow: /admin/
  20: Disallow: /auth/
  21: Disallow: /api/
  22: Allow: /
  23: 
  24: # A. 일반 검색 색인 — Allow
  25: User-agent: Googlebot
  26: Allow: /
  27: 
  28: User-agent: Yeti
  29: Allow: /
  30: 
  31: User-agent: Bingbot
  32: Allow: /
  33: 
  34: # B. AI 검색 인덱싱·답변용 — Allow
  35: User-agent: OAI-SearchBot
  36: Allow: /
  37: 
  38: User-agent: PerplexityBot
  39: Allow: /
  40: 
  41: User-agent: Claude-SearchBot
  42: Allow: /
  43: 
  44: # C. User-triggered fetch — Allow
  45: User-agent: ChatGPT-User
  46: Allow: /
  47: 
  48: User-agent: Perplexity-User
  49: Allow: /
  50: 
  51: User-agent: Claude-User
  52: Allow: /
  53: 
  54: # D. AI 학습·모델 개선용 — Disallow
  55: User-agent: GPTBot
  56: Disallow: /
  57: 
  58: User-agent: ClaudeBot
  59: Disallow: /
  60: 
  61: User-agent: Google-Extended
  62: Disallow: /
  63: 
  64: User-agent: CCBot
  65: Disallow: /
  66: 
  67: User-agent: anthropic-ai
  68: Disallow: /
  69: 
  70: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
  71: 
  72: Sitemap: ${sitemapUrl}
  73: `;
  74: 
  75:   return new NextResponse(body, {
  76:     status: 200,
  77:     headers: { "content-type": "text/plain; charset=utf-8" },
  78:   });
  79: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/public-tenant.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'packages/db/migrations/D0011_public_reader.sql' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/db-projection.ts' | ForEach-Object { if("'$i -ge 190 -and $i -le 260){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/markdown.ts' | ForEach-Object { if("'$i -ge 35 -and $i -le 75 -or $i -ge 130 -and $i -le 155){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 686ms:
   1: -- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
   2: -- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
   3: --
   4: -- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
   5: -- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
   6: --
   7: -- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).
   8: 
   9: -- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
  10: -- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
  11: --
  12: -- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
  13: -- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
  14: -- production secret manager). 본 migration 은 idempotent 한 GRANT/POLICY 만.
  15: CREATE ROLE app_public_reader LOGIN;
  16: 
  17: GRANT USAGE ON SCHEMA public TO app_public_reader;
  18: 
  19: -- ===== instance lookup policy =====
  20: -- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
  21: -- 별도 policy (active=true 만 노출).
  22: GRANT SELECT ON instance TO app_public_reader;
  23: 
  24: CREATE POLICY public_reader_instance_select
  25:   ON instance
  26:   FOR SELECT
  27:   TO app_public_reader
  28:   USING (active = true);
  29: 
  30: -- ===== 6 content table per-table policy =====
  31: -- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
  32: -- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.
  33: 
  34: GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
  35:                 treatment_page, article, legal_document
  36:   TO app_public_reader;
  37: 
  38: CREATE POLICY public_reader_clinic_profile_select
  39:   ON clinic_profile FOR SELECT TO app_public_reader
  40:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  41: 
  42: CREATE POLICY public_reader_location_profile_select
  43:   ON location_profile FOR SELECT TO app_public_reader
  44:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  45: 
  46: CREATE POLICY public_reader_doctor_profile_select
  47:   ON doctor_profile FOR SELECT TO app_public_reader
  48:   USING (
  49:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  50:     AND active = true
  51:   );
  52: 
  53: -- TreatmentPage: published + 미래 발행 제외
  54: CREATE POLICY public_reader_treatment_page_select
  55:   ON treatment_page FOR SELECT TO app_public_reader
  56:   USING (
  57:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  58:     AND status = 'published'
  59:     AND published_at IS NOT NULL
  60:     AND published_at <= now()
  61:   );
  62: 
  63: CREATE POLICY public_reader_article_select
  64:   ON article FOR SELECT TO app_public_reader
  65:   USING (
  66:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  67:     AND status = 'published'
  68:     AND published_at IS NOT NULL
  69:     AND published_at <= now()
  70:   );
  71: 
  72: -- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
  73: --   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
  74: CREATE POLICY public_reader_legal_document_select
  75:   ON legal_document FOR SELECT TO app_public_reader
  76:   USING (
  77:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  78:     AND status = 'published'
  79:   );

 succeeded in 712ms:
   1: // @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
   3: //
   4: // 공개 사이트 SSR 단계의 instance lookup + RLS scope 설정.
   5: // 흐름:
   6: //   1. instance slug 조회 (RLS public_reader_instance_select policy USING active=true)
   7: //   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
   8: //   3. callback 실행 (content table SELECT 가 RLS 자동 적용)
   9: //   4. return result
  10: 
  11: import type { Sql, TransactionSql } from "postgres";
  12: import { getSqlPublic } from "./public-db";
  13: 
  14: export type PublicTenantContext = {
  15:   readonly instanceId: string;
  16:   readonly instanceSlug: string;
  17: };
  18: 
  19: /**
  20:  * 공개 사이트 SSR 단계의 instance lookup + transaction-scoped RLS scope 설정.
  21:  *
  22:  * @param instanceSlug — URL path 안 [instanceSlug] (URL slug 정규식 검증은 callback 진입 전 별도)
  23:  * @param fn — instance scope 안 SELECT 콜백. tx 는 같은 connection 의 transaction sql tag.
  24:  * @returns fn 결과. instance 미존재 / inactive 시 null
  25:  */
  26: export async function withPublicTenantTransaction<T>(
  27:   instanceSlug: string,
  28:   fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
  29: ): Promise<T | null> {
  30:   const sql: Sql = getSqlPublic();
  31:   // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
  32:   // null 도 fn 반환과 함께 union 으로 사용 가능하도록 generic 명시.
  33:   return sql.begin<T | null>(async (tx: TransactionSql) => {
  34:     // 1) instance lookup — RLS public_reader_instance_select policy USING active=true
  35:     const rows = await tx<{ id: string }[]>`
  36:       SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1
  37:     `;
  38:     if (rows.length === 0) return null;
  39:     const instanceId = rows[0]!.id;
  40: 
  41:     // 2) transaction-scoped instance scope
  42:     await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
  43: 
  44:     // 3) callback
  45:     return fn(tx, { instanceId, instanceSlug });
  46:   }) as Promise<T | null>;
  47: }

 succeeded in 687ms:
  35:  *
  36:  * @param input — raw markdown 또는 raw HTML
  37:  * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
  38:  */
  39: export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
  40:   // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  41:   const html = minimalMarkdownToHtml(input);
  42: 
  43:   // 2) sanitize
  44:   const sanitized = sanitizeHtml(html, {
  45:     allowedTags: ALLOWED_TAGS,
  46:     allowedAttributes: ALLOWED_ATTRIBUTES,
  47:     allowedSchemes: ALLOWED_SCHEMES,
  48:     allowedSchemesAppliedToAttributes: ["href"],
  49:     transformTags: {
  50:       a: (tagName: string, attribs: Record<string, string>) => {
  51:         const href = attribs.href ?? "";
  52:         const isExternal = isExternalLink(href, hostOrigin);
  53:         return {
  54:           tagName,
  55:           attribs: {
  56:             ...attribs,
  57:             ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
  58:           },
  59:         };
  60:       },
  61:     },
  62:   });
  63:   return sanitized;
  64: }
  65: 
  66: /**
  67:  * minimal Markdown → HTML (v0.1).
  68:  * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
  69:  * PSR-DEFER-17 합류 시 remark/marked 로 전환.
  70:  */
  71: function minimalMarkdownToHtml(md: string): string {
  72:   // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  73:   const lines = md.split(/\r?\n/);
  74:   const out: string[] = [];
  75:   let inList = false;
 130: }
 131: 
 132: function escapeHtml(text: string): string {
 133:   return text
 134:     .replace(/&/g, "&amp;")
 135:     .replace(/</g, "&lt;")
 136:     .replace(/>/g, "&gt;");
 137: }
 138: 
 139: function isExternalLink(href: string, hostOrigin: string): boolean {
 140:   // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
 141:   if (href.startsWith("//")) return true;
 142:   if (href.startsWith("/") || href.startsWith("#")) return false;
 143:   try {
 144:     const u = new URL(href, hostOrigin);
 145:     const host = new URL(hostOrigin).host;
 146:     return u.host !== host;
 147:   } catch {
 148:     return false;
 149:   }
 150: }

 succeeded in 708ms:
 190:     if (typeof elem !== "object" || elem === null) continue;
 191:     const e = elem as Record<string, unknown>;
 192:     const id = pickString(e.id);
 193:     const type = pickString(e.type);
 194:     const label = pickString(e.label);
 195:     const targetUrl = pickString(e.targetUrl);
 196:     if (!id || !type || !label || !targetUrl) continue;
 197:     out.push({ id, type, label, targetUrl });
 198:   }
 199:   return out;
 200: }
 201: 
 202: function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
 203:   const empty: LocationProjection["businessHours"] = {
 204:     openingHours: [],
 205:     receptionHours: [],
 206:     lunchBreaks: [],
 207:     specialClosures: [],
 208:   };
 209:   if (typeof raw !== "object" || raw === null) return empty;
 210:   const r = raw as Record<string, unknown>;
 211:   const bh = r.businessHours;
 212:   if (typeof bh !== "object" || bh === null) return empty;
 213:   const b = bh as Record<string, unknown>;
 214:   const arr = (k: string): unknown[] => (Array.isArray(b[k]) ? (b[k] as unknown[]) : []);
 215:   return {
 216:     openingHours: arr("openingHours").filter(isOpeningHours),
 217:     receptionHours: arr("receptionHours").filter(isOpeningHours),
 218:     lunchBreaks: arr("lunchBreaks").filter(isLunchBreak),
 219:     specialClosures: arr("specialClosures").filter(isSpecialClosure),
 220:   };
 221: }
 222: 
 223: // PSRC-11 patch: opening/reception 은 `dayOfWeek: string[]` + `opens: HH:mm` + `closes: HH:mm` 강제
 224: const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
 225: const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
 226: 
 227: function isStringArray(v: unknown): v is string[] {
 228:   return Array.isArray(v) && v.every((x) => typeof x === "string");
 229: }
 230: 
 231: function isOpeningHours(x: unknown): x is BusinessHoursDay {
 232:   if (typeof x !== "object" || x === null) return false;
 233:   const o = x as Record<string, unknown>;
 234:   return isStringArray(o.dayOfWeek)
 235:     && typeof o.opens === "string" && TIME_REGEX.test(o.opens)
 236:     && typeof o.closes === "string" && TIME_REGEX.test(o.closes);
 237: }
 238: 
 239: function isLunchBreak(x: unknown): x is BusinessHoursDay {
 240:   if (typeof x !== "object" || x === null) return false;
 241:   const o = x as Record<string, unknown>;
 242:   return isStringArray(o.dayOfWeek)
 243:     && typeof o.from === "string" && TIME_REGEX.test(o.from)
 244:     && typeof o.to === "string" && TIME_REGEX.test(o.to);
 245: }
 246: 
 247: function isSpecialClosure(x: unknown): x is { date: string; reason?: string } {
 248:   if (typeof x !== "object" || x === null) return false;
 249:   const o = x as Record<string, unknown>;
 250:   if (typeof o.date !== "string" || !ISO_DATE_REGEX.test(o.date)) return false;
 251:   if (o.reason !== undefined && typeof o.reason !== "string") return false;
 252:   return true;
 253: }
 254: 
 255: export function normalizeClinic(row: ClinicProfileRow): ClinicProjection {
 256:   return {
 257:     name: row.name,
 258:     description: row.description,
 259:     longDescription: row.long_description,
 260:     slogan: row.slogan,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/markdown.ts' | ForEach-Object { if("'$i -ge 1 -and $i -le 135){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/layout.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-initial.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 664ms:
   1: // @glitzy/web/lib/site-initial — layout-level data loader for public site
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
   3: //
   4: // (site) layout 안 한 번 SELECT — Header/Footer + 모든 페이지가 공유.
   5: // instance 미존재 / inactive → null (page 가 notFound() 처리).
   6: //
   7: // PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
   8: // layout / page / generateMetadata 가 모두 같은 transaction 결과 공유.
   9: 
  10: import { cache } from "react";
  11: import { withPublicTenantTransaction } from "./public-tenant";
  12: import {
  13:   normalizeClinic,
  14:   normalizeLocation,
  15:   type ClinicProjection,
  16:   type ClinicProfileRow,
  17:   type LocationProjection,
  18:   type LocationProfileRow,
  19: } from "./db-projection";
  20: 
  21: export type SiteInitial = {
  22:   readonly instanceSlug: string;
  23:   readonly instanceId: string;
  24:   readonly clinic: ClinicProjection;
  25:   readonly locationMain: LocationProjection | null; // location main 미생성 시 null
  26: };
  27: 
  28: export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
  29:   return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
  30:     const clinicRows = await tx<ClinicProfileRow[]>`
  31:       SELECT name, description, long_description, slogan, logo_url, og_image_url,
  32:              legal_entity_name, founder,
  33:              to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
  34:              business_registration_number, primary_ctas, updated_at
  35:         FROM clinic_profile
  36:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  37:        LIMIT 1
  38:     `;
  39:     if (clinicRows.length === 0) return null;
  40:     const clinic = normalizeClinic(clinicRows[0]!);
  41: 
  42:     const locationRows = await tx<LocationProfileRow[]>`
  43:       SELECT slug, name, street_address, address_locality, address_region, postal_code, address_country,
  44:              latitude::text AS latitude, longitude::text AS longitude,
  45:              phone, email, metadata, updated_at
  46:         FROM location_profile
  47:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  48:        LIMIT 1
  49:     `;
  50:     const locationMain = locationRows.length > 0 ? normalizeLocation(locationRows[0]!) : null;
  51: 
  52:     return {
  53:       instanceSlug: ctx.instanceSlug,
  54:       instanceId: ctx.instanceId,
  55:       clinic,
  56:       locationMain,
  57:     };
  58:   });
  59: });

 succeeded in 679ms:
   1: // @glitzy/web/(site)/[instanceSlug]/layout — 공개 사이트 layout (fragment only)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)
   3: 
   4: import { notFound } from "next/navigation";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { SiteHeader } from "@/components/site/SiteHeader";
   7: import { SiteFooter } from "@/components/site/SiteFooter";
   8: 
   9: export const revalidate = 60;
  10: 
  11: export default async function SiteLayout({
  12:   params,
  13:   children,
  14: }: {
  15:   params: { instanceSlug: string };
  16:   children: React.ReactNode;
  17: }) {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) notFound();
  20:   return (
  21:     <>
  22:       <SiteHeader initial={initial} />
  23:       <main className="min-h-screen">{children}</main>
  24:       <SiteFooter initial={initial} />
  25:     </>
  26:   );
  27: }

 succeeded in 699ms:
   1: // @glitzy/web/lib/markdown — SSR-safe Markdown 렌더
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
   3: //
   4: // 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
   5: // 외부 링크: rel="nofollow noopener noreferrer" 자동.
   6: // LegalDocument body 도 동일 컴포넌트 사용 (CONTENT_STANDARDS § 7.1.1.1 면제는 어드민 저장 단계 결정).
   7: 
   8: import sanitizeHtml from "sanitize-html";
   9: 
  10: const ALLOWED_TAGS = [
  11:   "h1", "h2", "h3", "h4",
  12:   "p",
  13:   "ul", "ol", "li",
  14:   "a",
  15:   "strong", "em", "code", "pre",
  16:   "blockquote",
  17:   "table", "thead", "tbody", "tr", "th", "td",
  18:   "hr", "br",
  19: ];
  20: 
  21: const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  22:   "*": ["class", "id", "lang"],
  23:   a: ["href", "rel", "target"],
  24:   code: ["class"],
  25:   pre: ["class"],
  26: };
  27: 
  28: const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];
  29: 
  30: /**
  31:  * Markdown 또는 raw HTML → sanitized HTML.
  32:  * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
  33:  * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
  34:  * 본 함수는 raw HTML / 단순 Markdown 양쪽 모두 동작.
  35:  *
  36:  * @param input — raw markdown 또는 raw HTML
  37:  * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
  38:  */
  39: export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
  40:   // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  41:   const html = minimalMarkdownToHtml(input);
  42: 
  43:   // 2) sanitize
  44:   const sanitized = sanitizeHtml(html, {
  45:     allowedTags: ALLOWED_TAGS,
  46:     allowedAttributes: ALLOWED_ATTRIBUTES,
  47:     allowedSchemes: ALLOWED_SCHEMES,
  48:     allowedSchemesAppliedToAttributes: ["href"],
  49:     transformTags: {
  50:       a: (tagName: string, attribs: Record<string, string>) => {
  51:         const href = attribs.href ?? "";
  52:         const isExternal = isExternalLink(href, hostOrigin);
  53:         return {
  54:           tagName,
  55:           attribs: {
  56:             ...attribs,
  57:             ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
  58:           },
  59:         };
  60:       },
  61:     },
  62:   });
  63:   return sanitized;
  64: }
  65: 
  66: /**
  67:  * minimal Markdown → HTML (v0.1).
  68:  * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
  69:  * PSR-DEFER-17 합류 시 remark/marked 로 전환.
  70:  */
  71: function minimalMarkdownToHtml(md: string): string {
  72:   // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  73:   const lines = md.split(/\r?\n/);
  74:   const out: string[] = [];
  75:   let inList = false;
  76:   let inPara: string[] = [];
  77:   const flushPara = () => {
  78:     if (inPara.length === 0) return;
  79:     out.push(`<p>${formatInline(inPara.join(" "))}</p>`);
  80:     inPara = [];
  81:   };
  82:   const flushList = () => {
  83:     if (!inList) return;
  84:     out.push("</ul>");
  85:     inList = false;
  86:   };
  87:   for (const raw of lines) {
  88:     const line = raw.trim();
  89:     if (line === "") {
  90:       flushPara();
  91:       flushList();
  92:       continue;
  93:     }
  94:     const h = /^(#{1,4})\s+(.+)$/.exec(line);
  95:     if (h) {
  96:       flushPara();
  97:       flushList();
  98:       const level = h[1]!.length;
  99:       out.push(`<h${level}>${formatInline(h[2]!)}</h${level}>`);
 100:       continue;
 101:     }
 102:     if (line.startsWith("- ") || line.startsWith("* ")) {
 103:       flushPara();
 104:       if (!inList) {
 105:         out.push("<ul>");
 106:         inList = true;
 107:       }
 108:       out.push(`<li>${formatInline(line.slice(2))}</li>`);
 109:       continue;
 110:     }
 111:     flushList();
 112:     inPara.push(line);
 113:   }
 114:   flushPara();
 115:   flushList();
 116:   return out.join("\n");
 117: }
 118: 
 119: function formatInline(text: string): string {
 120:   let out = escapeHtml(text);
 121:   // [link](url)
 122:   out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
 123:   // **bold**
 124:   out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
 125:   // *italic*
 126:   out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
 127:   // `code`
 128:   out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
 129:   return out;
 130: }
 131: 
 132: function escapeHtml(text: string): string {
 133:   return text
 134:     .replace(/&/g, "&amp;")
 135:     .replace(/</g, "&lt;")

 succeeded in 667ms:
   1: // @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
   3: //
   4: // v0.1 단계: DB CHECK 가 status='draft' 만 허용하고 RLS 는 status='published' 만 SELECT.
   5: // → 항상 0 row → notFound().
   6: // 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
   7: 
   8: import type { Metadata } from "next";
   9: import { notFound } from "next/navigation";
  10: import { withPublicTenantTransaction } from "@/lib/public-tenant";
  11: import { normalizeLegal, type LegalDocumentRow } from "@/lib/db-projection";
  12: import { ArticleBody } from "@/components/site/ArticleBody";
  13: import { Breadcrumb } from "@/components/site/Breadcrumb";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: const CLOSED_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
  19: 
  20: export const metadata: Metadata = {
  21:   robots: { index: false, follow: true },
  22: };
  23: 
  24: export default async function LegalPage({
  25:   params,
  26: }: {
  27:   params: { instanceSlug: string; type: string };
  28: }) {
  29:   if (!CLOSED_TYPES.includes(params.type as (typeof CLOSED_TYPES)[number])) notFound();
  30: 
  31:   const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  32:     const rows = await tx<LegalDocumentRow[]>`
  33:       SELECT slug, document_type::text AS document_type, title, body,
  34:              to_char(effective_date, 'YYYY-MM-DD') AS effective_date,
  35:              updated_at
  36:         FROM legal_document
  37:        WHERE document_type = ${params.type}::legal_document_type
  38:        LIMIT 1
  39:     `;
  40:     return rows.length > 0 ? normalizeLegal(rows[0]!) : null;
  41:   });
  42:   if (!legal) notFound();
  43: 
  44:   const base = `/${params.instanceSlug}`;
  45:   const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
  46: 
  47:   return (
  48:     <>
  49:       <Breadcrumb items={[
  50:         { label: "홈", href: base },
  51:         { label: "정책", href: null },
  52:         { label: legal.title, href: null },
  53:       ]} />
  54:       <section className="mx-auto max-w-3xl px-4 py-12">
  55:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
  56:         <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
  57:         <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
  58:       </section>
  59:     </>
  60:   );
  61: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/locations/[slug]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 95){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 685ms:
   1: // @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { formatAddress } from "@/lib/db-projection";
   7: import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
   8: import { ReservationChannels } from "@/components/site/ReservationChannels";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { locationDetailGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  18:   if (params.slug !== "main") return {};
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial || !initial.locationMain) return {};
  21:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  22:     pageTitle: initial.locationMain.name,
  23:     description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
  24:     canonicalPath: `/locations/${params.slug}`,
  25:   });
  26: }
  27: 
  28: export default async function LocationDetailPage({
  29:   params,
  30: }: {
  31:   params: { instanceSlug: string; slug: string };
  32: }) {
  33:   // v0.1 단계 main 만 지원 (PSR-DEFER-11 부분)
  34:   if (params.slug !== "main") notFound();
  35:   const initial = await loadSiteInitial(params.instanceSlug);
  36:   if (!initial || !initial.locationMain) notFound();
  37:   const loc = initial.locationMain;
  38:   const base = `/${params.instanceSlug}`;
  39:   const graph = locationDetailGraph(
  40:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
  41:     initial.clinic,
  42:     loc,
  43:     `${loc.name} · ${formatAddress(loc)}`,
  44:   );
  45: 
  46:   return (
  47:     <>
  48:       <JsonLdScript graph={graph} />
  49:       <Breadcrumb items={[
  50:         { label: "홈", href: base },
  51:         { label: "위치", href: null },
  52:         { label: loc.name, href: null },
  53:       ]} />
  54:       <section className="mx-auto max-w-3xl px-4 py-12">
  55:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{loc.name}</h1>
  56:         <p className="mb-8 text-base text-fg-muted">{formatAddress(loc)}</p>
  57: 
  58:         <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
  59:           <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
  60:           {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
  61:           {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
  62:         </dl>
  63: 
  64:         <h2 className="mb-3 text-xl font-semibold text-fg-default">진료 시간</h2>
  65:         <BusinessHoursTable hours={loc.businessHours} />
  66: 
  67:         {initial.clinic.primaryCtas.length > 0 ? (
  68:           <>
  69:             <h2 className="mb-3 mt-10 text-xl font-semibold text-fg-default">예약 채널</h2>
  70:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  71:           </>
  72:         ) : null}
  73:       </section>
  74:     </>
  75:   );
  76: }

 succeeded in 680ms:
   1: // @glitzy/web/(site)/[instanceSlug]/doctors/[slug] — P-004 Doctor Profile
   2: 
   3: import { notFound } from "next/navigation";
   4: import Link from "next/link";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeDoctor, normalizeArticle, type DoctorProfileRow, type ArticleRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { doctorProfileGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<DoctorProfileRow[]>`
  23:       SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  24:         FROM doctor_profile WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeDoctor(rows[0]!) : null;
  27:   });
  28:   if (!doctor) return {};
  29:   const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: doctor.name,
  32:     description,
  33:     canonicalPath: `/doctors/${doctor.slug}`,
  34:     ogType: "profile",
  35:     imageUrl: doctor.photoUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function DoctorProfilePage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; slug: string };
  43: }) {
  44:   const initial = await loadSiteInitial(params.instanceSlug);
  45:   if (!initial) notFound();
  46:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const doctorRows = await tx<(DoctorProfileRow & { id: string })[]>`
  48:       SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  49:         FROM doctor_profile
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     if (doctorRows.length === 0) return null;
  54:     const doctor = normalizeDoctor(doctorRows[0]!);
  55: 
  56:     const articleRows = await tx<ArticleRow[]>`
  57:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  58:         FROM article
  59:        WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
  60:        ORDER BY published_at DESC NULLS LAST
  61:        LIMIT 5
  62:     `;
  63:     return { doctor, articles: articleRows.map(normalizeArticle) };
  64:   });
  65:   if (!data) notFound();
  66: 
  67:   const base = `/${params.instanceSlug}`;
  68:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  69:   const graph = doctorProfileGraph(
  70:     { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
  71:     initial.clinic,
  72:     initial.locationMain,
  73:     data.doctor,
  74:     data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
  75:   );
  76: 
  77:   return (
  78:     <>
  79:       <JsonLdScript graph={graph} />
  80:       <Breadcrumb items={[
  81:         { label: "홈", href: base },
  82:         { label: "의료진", href: `${base}/doctors` },
  83:         { label: data.doctor.name, href: null },
  84:       ]} />
  85:       <section className="mx-auto max-w-3xl px-4 py-12">
  86:         <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
  87:           {data.doctor.photoUrl ? (
  88:             // eslint-disable-next-line @next/next/no-img-element
  89:             <img src={data.doctor.photoUrl} alt="" className="h-32 w-32 rounded-full object-cover" />
  90:           ) : null}
  91:           <div>
  92:             <h1 className="text-3xl font-bold text-fg-default">{data.doctor.name}</h1>
  93:             {data.doctor.title ? <p className="mt-1 text-base text-fg-muted">{data.doctor.title}</p> : null}
  94:             {data.doctor.jobTitle ? <p className="mt-0.5 text-sm text-fg-muted">{data.doctor.jobTitle}</p> : null}
  95:           </div>

 succeeded in 718ms:
   1: // @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
   3: 
   4: import { notFound } from "next/navigation";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { articleDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
  19:   if (params.category !== "general") return {};
  20:   const initial = await loadSiteInitial(params.instanceSlug);
  21:   if (!initial) return {};
  22:   const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  23:     const rows = await tx<ArticleRow[]>`
  24:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  25:         FROM article WHERE slug = ${params.slug} LIMIT 1
  26:     `;
  27:     return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  28:   });
  29:   if (!a) return {};
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: a.headline,
  32:     description: a.summary,
  33:     canonicalPath: `/insights/${params.category}/${a.slug}`,
  34:     ogType: "article",
  35:     imageUrl: a.heroImageUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function ArticleDetailPage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; category: string; slug: string };
  43: }) {
  44:   // v0.1 단일 fallback category `general` — PSR-DEFER-15
  45:   if (params.category !== "general") notFound();
  46:   const initial = await loadSiteInitial(params.instanceSlug);
  47:   if (!initial) notFound();
  48: 
  49:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  50:     const rows = await tx<ArticleRow[]>`
  51:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  52:         FROM article
  53:        WHERE slug = ${params.slug}
  54:        LIMIT 1
  55:     `;
  56:     if (rows.length === 0) return null;
  57:     const article = normalizeArticle(rows[0]!);
  58:     let author = null;
  59:     if (article.authorDoctorId) {
  60:       const doctorRows = await tx<DoctorProfileRow[]>`
  61:         SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  62:           FROM doctor_profile
  63:          WHERE id = ${article.authorDoctorId}::uuid
  64:          LIMIT 1
  65:       `;
  66:       author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
  67:     }
  68:     return { article, author };
  69:   });
  70:   if (!data) notFound();
  71: 
  72:   const base = `/${params.instanceSlug}`;
  73:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  74:   const graph = articleDetailGraph(
  75:     { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
  76:     initial.clinic,
  77:     initial.locationMain,
  78:     data.article,
  79:     data.author,
  80:     params.category,
  81:   );
  82: 
  83:   return (
  84:     <>
  85:       <JsonLdScript graph={graph} />
  86:       <Breadcrumb items={[
  87:         { label: "홈", href: base },
  88:         { label: "인사이트", href: null },
  89:         { label: data.article.headline, href: null },
  90:       ]} />
  91:       <article className="mx-auto max-w-3xl px-4 py-12">
  92:         {data.article.heroImageUrl ? (
  93:           // eslint-disable-next-line @next/next/no-img-element
  94:           <img src={data.article.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  95:         ) : null}
  96:         <h1 className="text-3xl font-bold text-fg-default">{data.article.headline}</h1>
  97:         <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
  98:         <div className="mt-4 flex flex-wrap gap-3 text-sm text-fg-muted">
  99:           {data.article.publishedAt ? (
 100:             <time dateTime={data.article.publishedAt.toISOString()}>
 101:               {data.article.publishedAt.toISOString().slice(0, 10)}
 102:             </time>
 103:           ) : null}
 104:           {data.author ? <span>저자: {data.author.name}</span> : null}
 105:         </div>
 106:         <div className="mt-8">
 107:           <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
 108:         </div>
 109:       </article>
 110:     </>
 111:   );
 112: }

 succeeded in 741ms:
   1: // @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   6: import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
   7: import { loadSiteInitial } from "@/lib/site-initial";
   8: import { ArticleBody } from "@/components/site/ArticleBody";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { ReservationChannels } from "@/components/site/ReservationChannels";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { treatmentDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<TreatmentPageRow[]>`
  23:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  24:         FROM treatment_page WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  27:   });
  28:   if (!t) return {};
  29:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  30:     pageTitle: t.name,
  31:     description: t.summary,
  32:     canonicalPath: `/treatments/${t.slug}`,
  33:     ogType: "article",
  34:     imageUrl: t.heroImageUrl ?? undefined,
  35:   });
  36: }
  37: 
  38: export default async function TreatmentDetailPage({
  39:   params,
  40: }: {
  41:   params: { instanceSlug: string; slug: string };
  42: }) {
  43:   const initial = await loadSiteInitial(params.instanceSlug);
  44:   if (!initial) notFound();
  45: 
  46:   const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const rows = await tx<TreatmentPageRow[]>`
  48:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  49:         FROM treatment_page
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  54:   });
  55:   if (!treatment) notFound();
  56: 
  57:   const base = `/${params.instanceSlug}`;
  58:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  59:   const graph = treatmentDetailGraph(
  60:     { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
  61:     initial.clinic,
  62:     initial.locationMain,
  63:     treatment,
  64:     treatment.summary,
  65:   );
  66: 
  67:   return (
  68:     <>
  69:       <JsonLdScript graph={graph} />
  70:       <Breadcrumb items={[
  71:         { label: "홈", href: base },
  72:         { label: "진료", href: `${base}/treatments` },
  73:         { label: treatment.name, href: null },
  74:       ]} />
  75:       <section className="mx-auto max-w-3xl px-4 py-12">
  76:         {treatment.heroImageUrl ? (
  77:           // eslint-disable-next-line @next/next/no-img-element
  78:           <img src={treatment.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  79:         ) : null}
  80:         <h1 className="text-3xl font-bold text-fg-default">{treatment.name}</h1>
  81:         <p className="mt-2 text-base text-fg-muted">{treatment.summary}</p>
  82:         <div className="mt-8">
  83:           <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
  84:         </div>
  85:         {initial.clinic.primaryCtas.length > 0 ? (
  86:           <div className="mt-12 rounded-md border border-border bg-subtle p-6">
  87:             <h2 className="mb-3 text-lg font-semibold text-fg-default">예약 / 상담</h2>
  88:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  89:           </div>
  90:         ) : null}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|\\(site\\)|/admin|PUBLIC_SITE_RENDER|PSR-CASCADE\" docs/admin/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"href=\\{"'`/'"\\"'$'"\\{params\\.instanceSlug|href=\\\"/\\"'$'"\\{params|redirect\\("'`/'"\\"'$'"\\{instanceSlug|revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug|/\\"'$'"\\{instanceSlug\\}\" \"apps/web/src/app/(admin)/admin/[instanceSlug]\" \"apps/web/src/app/page.tsx\" \"apps/web/src/app/sign-in/consume/route.ts\" \"apps/web/src/seed.ts\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"from \\\"@/app/\\(admin\\)/\\[instanceSlug\\]|@/app/\\(admin\\)/\\[instanceSlug\\]|/admin/\\"'$'"\\{firstSlug\\}|/\\"'$'"\\{firstSlug\\}\" apps/web/src apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:09.209278Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:

 exited 1 in 522ms:
 succeeded in 635ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:57:| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:59:| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/admin/ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
docs/admin/ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
docs/admin/ARCHITECTURE.md:289:**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
docs/admin/ARCHITECTURE.md:402:> 상세 필드는 `docs/admin/DATA_MODEL.md`.

2026-05-18T04:57:09.317146Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "from \"[36;1m@[0m/app/\(admin\)/\[instanceSlug\]|@/app/\(admin\)/\[inst …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m               ~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mUnrecognized token in source text.[0m

 exited 1 in 540ms:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "from \"[36;1m@[0m/app/\(admin\)/\[instanceSlug\]|@/app/\(admin\)/\[inst …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m               ~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mUnrecognized token in source text.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '@/app/\\(admin\\)/\\[instanceSlug\\]|/\\"'$'"\\{firstSlug\\}|redirect\\("'`/'"\\"'$'"\\{result\\.slug\\}|href=\\{"'`/'"\\"'$'"\\{params\\.instanceSlug|revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug' apps/web/src" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'admin/\\"'$'"\\{firstSlug\\}|/admin/\\"'$'"\\{|/admin/|/\\"'$'"\\{firstSlug\\}' apps/web/src/seed.ts apps/web/src/app/page.tsx apps/web/src/app/sign-in/consume/route.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'from \"@/app/\\(admin\\)|from \"\\.\\./actions\"|from \"\\./actions\"|actions' apps/web/src/components/forms apps/web/src/app/\\(admin\\)/admin" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:16.761785Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
[31;1madmin\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tions' apps/web/src/components/forms apps/web/src/app/\([36;1madmin\[0m)/admin[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 572ms:
[31;1madmin\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tions' apps/web/src/components/forms apps/web/src/app/\([36;1madmin\[0m)/admin[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 succeeded in 645ms:
apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src/app/sign-in/consume/route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src/app/page.tsx:57:  redirect(`/admin/${result.slug}`);

2026-05-18T04:57:16.834852Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 661ms:
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 592 -and $i -le 620){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 579ms:
 592: ## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
 593: 
 594: | # | 시나리오 | 통과 기준 |
 595: |---|---|---|
 596: | 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
 597: | 2 | DoctorProfile 3건 등록 후 `/<instanceSlug>/doctors` 페이지에 3 card 표시 | active=true 만 보임 · displayOrder ASC 정렬 |
 598: | 3 | DoctorProfile.active=false 한 row → `/<instanceSlug>/doctors` 리스트에서 사라짐 | row count 2 |
 599: | 4 | TreatmentPage status='draft' → `/<instanceSlug>/treatments` 리스트에 미노출 (RLS 자동 차단) | 0건 |
 600: | 5 | TreatmentPage status='published' + publishedAt now() → 노출 | 1건 |
 601: | 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
 602: | 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
 603: | 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
 604: | 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
 605: | 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
 606: | 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
 607: | 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
 608: | 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
 609: | 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `notFound()` (instance lookup policy USING `active=true`) |
 610: | 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
 611: | 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
 612: | 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
 613: | 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
 614: | 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 출력 |
 615: | 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
 616: | 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `BrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |
 617: | 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
 618: | 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
 619: 
 620: ## 8. 작업 단위 (cycle1 PSR-21 cascade 분해)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"data-theme=\\\"dark\\\"|--color|bg-canvas|text-fg-default|themeColor|bg-slate-50|text-slate-900\" apps/web/src/styles/globals.css apps/web/src/app/layout.tsx apps/web/tailwind.config.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/components/site/BusinessHoursTable.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/components/site/SiteFooter.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:30.360482Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:data-theme=\)
    ^
error: unclosed group

 exited 1 in 573ms:
rg: regex parse error:
    (?:data-theme=\)
    ^
error: unclosed group

 succeeded in 606ms:
   1: // @glitzy/web/components/site/SiteFooter — 공개 사이트 푸터
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)
   3: 
   4: import type { SiteInitial } from "@/lib/site-initial";
   5: import { formatAddress } from "@/lib/db-projection";
   6: 
   7: export function SiteFooter({ initial }: { initial: SiteInitial }) {
   8:   const loc = initial.locationMain;
   9:   return (
  10:     <footer className="mt-12 border-t border-border bg-subtle">
  11:       <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-fg-muted md:flex-row md:justify-between">
  12:         <div>
  13:           <div className="text-base font-semibold text-fg-default">{initial.clinic.name}</div>
  14:           {loc ? (
  15:             <ul className="mt-2 space-y-1">
  16:               <li>주소: {formatAddress(loc)}</li>
  17:               {loc.telephone ? <li>전화: {loc.telephone}</li> : null}
  18:               {loc.email ? <li>이메일: {loc.email}</li> : null}
  19:             </ul>
  20:           ) : null}
  21:         </div>
  22:         {loc && loc.businessHours.openingHours.length > 0 ? (
  23:           <div>
  24:             <div className="font-medium text-fg-default">진료 시간</div>
  25:             <ul className="mt-2 space-y-1">
  26:               {loc.businessHours.openingHours.map((oh, i) => (
  27:                 <li key={i}>
  28:                   {oh.dayOfWeek.join(", ")}: {oh.opens} – {oh.closes}
  29:                 </li>
  30:               ))}
  31:               {loc.businessHours.lunchBreaks.map((lb, i) => (
  32:                 <li key={`lunch-${i}`}>
  33:                   점심 ({lb.dayOfWeek.join(", ")}): {lb.from} – {lb.to}
  34:                 </li>
  35:               ))}
  36:             </ul>
  37:           </div>
  38:         ) : null}
  39:         <div className="text-xs text-fg-disabled">
  40:           © {new Date().getUTCFullYear()} {initial.clinic.name}
  41:           {initial.clinic.legalEntityName ? ` (${initial.clinic.legalEntityName})` : null}
  42:         </div>
  43:       </div>
  44:       {/* PSR-26: LegalDocument 공개 합류 (PSR-DEFER-13) 시점에 정책 5종 링크 추가 */}
  45:     </footer>
  46:   );
  47: }

 succeeded in 615ms:
   1: // @glitzy/web/components/site/BusinessHoursTable
   2: // SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
   3: 
   4: import type { LocationProjection } from "@/lib/db-projection";
   5: 
   6: const DAY_KO: Record<string, string> = {
   7:   Monday: "월",
   8:   Tuesday: "화",
   9:   Wednesday: "수",
  10:   Thursday: "목",
  11:   Friday: "금",
  12:   Saturday: "토",
  13:   Sunday: "일",
  14: };
  15: 
  16: export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
  17:   if (hours.openingHours.length === 0) {
  18:     return <div className="text-sm text-fg-muted">진료 시간 정보가 등록되지 않았습니다.</div>;
  19:   }
  20:   return (
  21:     <div className="overflow-x-auto">
  22:       <table className="w-full border-collapse border border-border text-sm">
  23:         <thead className="bg-subtle">
  24:           <tr>
  25:             <th scope="col" className="border border-border px-3 py-2 text-left">요일</th>
  26:             <th scope="col" className="border border-border px-3 py-2 text-left">진료 시간</th>
  27:             <th scope="col" className="border border-border px-3 py-2 text-left">점심</th>
  28:           </tr>
  29:         </thead>
  30:         <tbody>
  31:           {hours.openingHours.map((oh, i) => {
  32:             const dayLabel = oh.dayOfWeek.map((d) => DAY_KO[d] ?? d).join(", ");
  33:             const lb = hours.lunchBreaks.find((l) => l.dayOfWeek.some((d) => oh.dayOfWeek.includes(d)));
  34:             return (
  35:               <tr key={i}>
  36:                 <th scope="row" className="border border-border px-3 py-2 text-left font-medium">{dayLabel}</th>
  37:                 <td className="border border-border px-3 py-2">{oh.opens} – {oh.closes}</td>
  38:                 <td className="border border-border px-3 py-2 text-fg-muted">{lb ? `${lb.from} – ${lb.to}` : "—"}</td>
  39:               </tr>
  40:             );
  41:           })}
  42:           {hours.specialClosures.length > 0 ? (
  43:             <tr>
  44:               <th scope="row" className="border border-border px-3 py-2 text-left font-medium">특수 휴진</th>
  45:               <td colSpan={2} className="border border-border px-3 py-2 text-fg-muted">
  46:                 {hours.specialClosures.map((c) => `${c.date}${c.reason ? ` (${c.reason})` : ""}`).join(", ")}
  47:               </td>
  48:             </tr>
  49:           ) : null}
  50:         </tbody>
  51:       </table>
  52:     </div>
  53:   );
  54: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '/admin/|admin/' apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:59.277756Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:

 exited 1 in 566ms:
codex
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=3 (1+2+0)
- 확인 실행: `pnpm --filter @glitzy/web typecheck` PASS

## cycle 1 patch 검증
- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)

## new blocking / major / minor (PSRC-16+)

### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
`webPageEntity`는 모든 페이지에 `isPartOf: { "@id": "${siteBaseUrl}/#website" }`를 넣습니다 (`apps/web/src/lib/json-ld/entities.ts:153-161`). 하지만 `webSiteEntity`는 Home graph에만 포함됩니다 (`apps/web/src/lib/json-ld/builders.ts:21-31`). 반면 checker는 same-origin singleton ref가 graph 안에 없으면 오류 처리합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59-65`).

따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).

권장 패치: non-home graph에도 `WebSite` 풀 entity를 포함하거나, checker에서 `#website` 같은 명시 허용 ref 정책을 SoT와 함께 정의해야 합니다. 현재 구현/검증 규칙은 서로 양립하지 않습니다.

### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
- P-003: `apps/web/src/lib/json-ld/builders.ts:62-65`
- P-004: `apps/web/src/lib/json-ld/builders.ts:83-87`
- P-005: `apps/web/src/lib/json-ld/builders.ts:104-107`
- P-010: `apps/web/src/lib/json-ld/builders.ts:147-151`

이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).

### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
checker는 `Object.keys(v).length === 1`인 `{ "@id": "..." }` 형태만 검사합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59`). 그러나 실제 graph에는 inline minimal 객체에 `@id`가 붙는 참조가 존재합니다. 예: Article author는 같은 origin physician `@id`를 갖지만 `name/jobTitle/image`가 같이 있어 검사 대상에서 빠집니다 (`apps/web/src/lib/json-ld/entities.ts:123-131`). ItemList도 `{ "@id": ..., name: ... }` 형태입니다 (`apps/web/src/lib/json-ld/entities.ts:200-204`).

PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.

## scenario 1~23 통과 여부 추론
- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PASS
- 근거: root redirect `/admin/${result.slug}` (`apps/web/src/app/page.tsx:52-57`), sign-in consume redirect `/admin/${membershipResult.slug}` (`apps/web/src/app/sign-in/consume/route.ts:177-178`), admin actions `revalidatePath('/admin/...')` 반영 (`doctors/actions.ts:158-166`, `treatments/actions.ts:156-164`, `articles/actions.ts:193-200`, `clinic-profile/actions.ts:426-427`), stale admin import도 제거됨.
tokens used
87,550
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=3 (1+2+0)
- 확인 실행: `pnpm --filter @glitzy/web typecheck` PASS

## cycle 1 patch 검증
- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)

## new blocking / major / minor (PSRC-16+)

### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
`webPageEntity`는 모든 페이지에 `isPartOf: { "@id": "${siteBaseUrl}/#website" }`를 넣습니다 (`apps/web/src/lib/json-ld/entities.ts:153-161`). 하지만 `webSiteEntity`는 Home graph에만 포함됩니다 (`apps/web/src/lib/json-ld/builders.ts:21-31`). 반면 checker는 same-origin singleton ref가 graph 안에 없으면 오류 처리합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59-65`).

따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).

권장 패치: non-home graph에도 `WebSite` 풀 entity를 포함하거나, checker에서 `#website` 같은 명시 허용 ref 정책을 SoT와 함께 정의해야 합니다. 현재 구현/검증 규칙은 서로 양립하지 않습니다.

### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
- P-003: `apps/web/src/lib/json-ld/builders.ts:62-65`
- P-004: `apps/web/src/lib/json-ld/builders.ts:83-87`
- P-005: `apps/web/src/lib/json-ld/builders.ts:104-107`
- P-010: `apps/web/src/lib/json-ld/builders.ts:147-151`

이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).

### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
checker는 `Object.keys(v).length === 1`인 `{ "@id": "..." }` 형태만 검사합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59`). 그러나 실제 graph에는 inline minimal 객체에 `@id`가 붙는 참조가 존재합니다. 예: Article author는 같은 origin physician `@id`를 갖지만 `name/jobTitle/image`가 같이 있어 검사 대상에서 빠집니다 (`apps/web/src/lib/json-ld/entities.ts:123-131`). ItemList도 `{ "@id": ..., name: ... }` 형태입니다 (`apps/web/src/lib/json-ld/entities.ts:200-204`).

PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.

## scenario 1~23 통과 여부 추론
- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PASS
- 근거: root redirect `/admin/${result.slug}` (`apps/web/src/app/page.tsx:52-57`), sign-in consume redirect `/admin/${membershipResult.slug}` (`apps/web/src/app/sign-in/consume/route.ts:177-178`), admin actions `revalidatePath('/admin/...')` 반영 (`doctors/actions.ts:158-166`, `treatments/actions.ts:156-164`, `articles/actions.ts:193-200`, `clinic-profile/actions.ts:426-427`), stale admin import도 제거됨.
