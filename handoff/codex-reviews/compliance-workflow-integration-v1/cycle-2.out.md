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
session id: 019e3abb-2bd3-7551-91b8-daff3048a63f
--------
user
Review 4 entity workflow 통합 — **cycle 2**. cycle 1 2 finding patch 검증 + 새 finding 확인. 짧게.

## Cycle 1 patches

| # | severity | patch |
|---|---|---|
| CWI-01 | blocking | 5 form (Article/TreatmentPage/FAQ/Publication/MediaAppearance) status input `name="status"` 제거 → FormData 안 status 미포함. zod schema 안 status field 제거 (Article actions PUBLICATION_STATUSES · TreatmentPage 동일 · FAQ/Publication/MediaAppearance EatStatusSchema). EatStatusSchema 는 deprecated 표기만 유지. |
| CWI-02 | minor | LegalDocument 별 cycle marker `LL-WORKFLOW-INTEGRATION` 명시 — plan § 8 작업 #11 정정 (4 entity + LegalDocument 분리 별 cycle) |

## Output (한국어 · 간결)

```
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=2 → cycle2=N

## cycle 1 patch 검증
- CWI-01: PASS/FAIL + 한 줄
- CWI-02: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
```

cycle 1 2건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
리뷰 모드로 확인하겠습니다. 먼저 관련 변경 범위와 워크플로 통합 흔적을 빠르게 읽고, cycle 1 패치 검증 뒤 새 회귀만 선별하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"name=\\\"status\\\"|status'|status\\)|EatStatusSchema|PUBLICATION_STATUSES|LL-WORKFLOW-INTEGRATION|COMPLIANCE_WORKFLOW_INTEGRATION\" -S ." in C:\Users\assag\solution\website-exposure
2026-05-18T10:56:54.040317Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:name=\)
    ^
error: unclosed group

 exited 1 in 616ms:
rg: regex parse error:
    (?:name=\)
    ^
error: unclosed group

 succeeded in 625ms:
tsconfig.base.json
skills-lock.json
pnpm-workspace.yaml
pnpm-lock.yaml
packages\storage\tsconfig.json
package.json
packages\storage\src\config.ts
packages\storage\src\audit-log.ts
packages\storage\package.json
packages\storage\src\sign-url.ts
packages\storage\src\storage-client.ts
packages\storage\src\index.ts
packages\storage\src\tenant-context.ts
packages\storage\src\errors.ts
packages\core-content\tsconfig.json
packages\notifications-outbox\tsconfig.json
packages\auth\tsconfig.json
handoff\PROJECT_OVERVIEW.md
handoff\glitzy-website-audit.md
packages\shared-types\tsconfig.json
packages\db\tsconfig.json
packages\shared-errors\tsconfig.json
packages\migrations-runner\tsconfig.json
packages\auth\src\session.ts
packages\auth\src\resolve-tenant-context.ts
packages\auth\src\magic-link.ts
packages\shared-types\src\index.ts
packages\shared-types\package.json
docs\research\REFERENCE_DEEP_DIVE_2026-05.md
docs\research\REFERENCE_ANALYSIS_2026-05.md
packages\core-content\src\templates\__tests__.ts
packages\core-content\src\templates\render.ts
packages\core-content\src\templates\index.ts
packages\core-content\src\templates\bodies.ts
packages\core-content\src\schema.ts
packages\core-content\src\index.ts
packages\core-content\package.json
packages\notifications-outbox\src\provider-adapter.ts
packages\notifications-outbox\src\outbox.ts
packages\notifications-outbox\src\index.ts
packages\notifications-outbox\src\errors.ts
packages\notifications-outbox\package.json
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\migrations-runner\src\manifest.ts
packages\auth\src\config.ts
packages\auth\src\audit.ts
packages\auth\package.json
packages\auth\src\errors.ts
packages\auth\src\index.ts
packages\shared-errors\package.json
packages\db\src\errors.ts
packages\db\src\advisory-lock.ts
packages\db\package.json
packages\db\src\tenant.ts
packages\db\src\service-role.ts
packages\db\src\index.ts
docs\admin\ARCHITECTURE.md
docs\admin\REVIEW_WORKFLOW.md
docs\ARCHITECTURE.md
packages\shared-errors\src\index.ts
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\INFRA_DECISIONS_DRAFT.md
docs\decisions\EAT_CONTENT_PLAN.md
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md
docs\decisions\PACKAGES_STRUCTURE.md
docs\decisions\M0_SCHEMA_PLAN.md
docs\decisions\PROVIDER_PASS_PLAN.md
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
apps\web\tailwind.config.ts
apps\web\vitest.config.ts
apps\web\tsconfig.json
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
packages\core-content\migrations\C0016_status_unlock.sql
packages\core-content\migrations\C0015_review_queue_entry.sql
packages\core-content\migrations\C0014_compliance_record.sql
packages\core-content\migrations\C0013_article_category_fk.sql
packages\core-content\migrations\C0012_faq.sql
packages\core-content\migrations\C0011_media_appearance.sql
packages\core-content\migrations\C0010_publication.sql
packages\core-content\migrations\C0009_article_category.sql
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
packages\auth\src\internal\session-internal.ts
apps\web\package.json
apps\web\next.config.mjs
apps\web\postcss.config.mjs
apps\web\README.md
packages\db\migrations\D0014_public_reader_eat.sql
docs\core\SEARCH_STANDARDIZATION.md
docs\core\SCHEMA_MAPPING.md
packages\db\migrations\D0011_public_reader.sql
docs\core\PAGE_TYPES.md
docs\core\DESIGN_TOKENS.md
packages\db\migrations\D0010_instance.sql
docs\core\DATA_MODEL.md
docs\core\CONTENT_STANDARDS.md
apps\web\scripts\site-scenarios.md
apps\web\scripts\seed-fixture.sql
apps\web\scripts\seed-fixture-eat.sql
apps\web\scripts\local-pass.ts
apps\web\scripts\admin-qa-token.ts
docs\features\search-visibility.md
docs\features\notifications.md
docs\features\keyword-monitoring.md
docs\features\crm-sync.md
docs\features\content-migration.md
docs\features\compliance-assistant.md
docs\features\asset-ingestion.md
docs\features\analytics-reporting.md
apps\spike-e\tsconfig.scenarios.json
apps\spike-e\tsconfig.json
handoff\codex-reviews\eat-content-code-v1\cycle-3.prompt.md
handoff\codex-reviews\eat-content-code-v1\cycle-3.out.md
handoff\codex-reviews\eat-content-code-v1\cycle-2.prompt.md
handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md
handoff\codex-reviews\eat-content-code-v1\cycle-1.prompt.md
handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md
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
apps\spike-e\docker-compose.yml
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-5.prompt.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-5.out.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-4.prompt.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-4.out.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-3.prompt.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-3.out.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md
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
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-2.out.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-1.out.md
apps\spike-e\package.json
apps\web\src\lib\tenant.ts
apps\web\src\lib\slug-resolver.ts
apps\web\src\lib\site-url.ts
apps\web\src\lib\site-metadata.ts
apps\web\src\lib\site-metadata.test.ts
apps\web\src\lib\site-meta-fetch.ts
apps\web\src\lib\site-initial.ts
apps\web\src\lib\session-cookie.ts
apps\web\src\lib\save-result.ts
apps\web\src\lib\public-tenant.ts
apps\web\src\lib\public-db.ts
apps\web\src\lib\post-login-redirect.ts
apps\web\src\lib\page-context.ts
apps\web\src\lib\markdown.ts
apps\web\src\lib\markdown.test.ts
apps\web\src\styles\globals.css
apps\web\src\seed.ts
apps\spike-e\PROVIDER_RUNBOOK.md
apps\web\src\lib\db-projection.test.ts
apps\web\src\types\react-dom-stable.d.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-4.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-4.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-5.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-5.prompt.md
apps\spike-b\PROVIDER_RUNBOOK.md
apps\spike-b\package.json
apps\spike-b\tsconfig.json
apps\spike-b\README.md
apps\web\src\lib\deny-reason-map.ts
apps\web\src\lib\db.ts
apps\web\src\lib\db-projection.ts
apps\web\src\lib\env.ts
apps\web\src\lib\eat-content-schema.ts
apps\web\src\lib\errors.ts
apps\spike-a\tsconfig.json
apps\spike-e\src\session.ts
apps\spike-e\src\seed.ts
apps\spike-e\src\errors.ts
apps\spike-e\src\env.ts
handoff\codex-reviews\eat-content-plan-v1\cycle-6.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-6.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-5.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-5.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-4.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-4.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-3b.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-3.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-2.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-2.out.md
handoff\codex-reviews\eat-content-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md
apps\web\src\lib\action-context.ts
apps\web\src\lib\clinic-profile-schema.ts
apps\spike-e\migrations\003_auth_session.sql
apps\spike-e\migrations\002_admin_user.sql
apps\spike-e\migrations\001_roles_extensions.sql
apps\spike-e\migrations\004_audit_event.sql
apps\spike-e\migrations\005_rls_test_table.sql
apps\spike-b\docker-compose.yml
apps\spike-c-local\tsconfig.scenarios.json
apps\spike-c-local\tsconfig.json
apps\spike-d\tsconfig.scenarios.json
apps\spike-d\tsconfig.json
apps\spike-c-local\package.json
apps\spike-c-local\docker-compose.yml
apps\spike-c-local\PROVIDER_RUNBOOK.md
apps\spike-b\migrations\007_provider_attempt_log.sql
apps\spike-b\migrations\006_permanent_alert.sql
apps\spike-b\migrations\005_invariant_log.sql
apps\spike-b\migrations\004_external_call_log.sql
apps\spike-b\migrations\003_inbox.sql
apps\spike-b\migrations\002_outbox.sql
apps\spike-b\migrations\001_roles.sql
apps\spike-b\src\worker.ts
apps\spike-b\src\tenant.ts
apps\spike-b\src\seed.ts
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
apps\spike-d\drizzle.config.ts
apps\spike-d\docker-compose.yml
apps\spike-a\src\tenant.ts
apps\spike-a\src\service-role.ts
apps\spike-a\src\seed.ts
apps\spike-a\src\schema.ts
apps\spike-d\src\service-role.ts
apps\spike-e\src\db\client.ts
apps\spike-e\src\audit.ts
apps\spike-b\src\fake-provider.ts
apps\spike-b\src\failure-injection.ts
apps\spike-b\src\errors.ts
apps\spike-b\src\db.ts
apps\spike-b\src\migrate.ts
apps\spike-b\src\fixtures.ts
apps\spike-b\src\outbox.ts
apps\spike-e\src\scenarios\test-invalid-instance-id.ts
apps\spike-e\src\scenarios\test-inactive-user.ts
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
apps\spike-e\src\scenarios\test-client-tampering.ts
apps\spike-e\src\scenarios\test-action-eligibility.ts
apps\spike-e\src\scenarios\provider-smoke.ts
apps\spike-e\src\resolve-tenant-context.ts
apps\spike-e\src\migrate.ts
apps\spike-e\src\magic-link.ts
apps\spike-e\src\fixtures.ts
apps\spike-e\src\scenarios\test-rls-integration.ts
apps\spike-e\src\scenarios\test-membership-removal.ts
apps\spike-e\src\scenarios\test-magic-link-login.ts
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
apps\spike-e\src\scenarios\test-invariant.ts
apps\spike-e\src\scenarios\test-super-admin-switch.ts
apps\spike-e\src\scenarios\test-session-refresh.ts
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
apps\web\src\lib\json-ld\entities.ts
apps\web\src\lib\json-ld\builders.ts
apps\web\src\lib\json-ld\JsonLdScript.tsx
apps\web\src\lib\json-ld\types.ts
apps\web\src\lib\compliance\publishable-check.ts
apps\web\src\lib\compliance\final-roles.ts
apps\web\src\lib\compliance\entity-actions.ts
apps\web\src\lib\compliance\eligibility.ts
apps\web\src\lib\compliance\check.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\lib\compliance\risk.ts
apps\web\src\lib\compliance\transitions.ts
apps\web\src\lib\compliance\types.ts
apps\spike-d\src\drift-check.ts
apps\spike-d\src\errors.ts
apps\spike-d\src\env.ts
apps\spike-d\src\migrate.ts
apps\spike-c-local\src\tenant-context.ts
apps\spike-c-local\src\storage-client.ts
apps\spike-c-local\src\sign-url.ts
apps\spike-c-local\src\seed.ts
apps\web\src\lib\json-ld\__tests__\validate.ts
apps\web\src\lib\json-ld\__tests__\validate.test.ts
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts
apps\web\src\lib\compliance\__tests__\compliance.test.ts
apps\spike-a\package.json
apps\web\src\app\page.tsx
apps\web\src\app\layout.tsx
apps\spike-a\pgbouncer\userlist.txt
apps\spike-a\pgbouncer\pgbouncer.ini
apps\spike-c-local\src\env.ts
apps\spike-c-local\src\audit-log.ts
apps\spike-c-local\src\errors.ts
apps\spike-c-local\src\fixtures.ts
apps\spike-d\docker\init-multi-db.sh
apps\spike-b\src\scenarios\test-stale-reclaim.ts
apps\spike-b\src\scenarios\test-rls-mismatch.ts
apps\spike-b\src\scenarios\test-retry-permanent.ts
apps\spike-b\src\scenarios\test-no-cross-tenant.ts
apps\spike-b\src\scenarios\test-invariant-runner.ts
apps\spike-b\src\scenarios\test-idempotency.ts
apps\spike-b\src\scenarios\test-failure-injection.ts
apps\spike-b\src\scenarios\test-basic-100.ts
apps\spike-b\src\scenarios\provider-smoke.ts
apps\spike-a\docker-compose.yml
apps\spike-a\src\scenarios\test-write.ts
apps\spike-a\src\scenarios\test-rollback.ts
apps\spike-a\src\scenarios\test-read.ts
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
apps\spike-a\src\scenarios\test-perf.ts
apps\spike-a\src\scenarios\test-nested-tx.ts
apps\spike-a\src\scenarios\test-negative.ts
apps\spike-a\src\scenarios\test-invariant-runner.ts
apps\spike-a\src\scenarios\test-audit.ts
apps\spike-a\src\scenarios\provider-smoke.ts
apps\spike-a\src\migrate.ts
apps\spike-a\src\fixtures.ts
apps\spike-a\src\errors.ts
apps\spike-a\src\db.ts
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
apps\spike-c-local\src\scenarios\test-replay.ts
apps\spike-c-local\src\scenarios\test-range-request.ts
apps\spike-c-local\src\scenarios\test-method-confusion.ts
apps\spike-c-local\src\scenarios\test-list-bucket.ts
apps\spike-c-local\src\scenarios\test-isolation.ts
apps\spike-c-local\src\scenarios\test-content-type.ts
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
apps\spike-c-local\src\scenarios\provider-smoke.ts
apps\spike-c-local\src\scenarios\invariant-runner.ts
apps\spike-a\PROVIDER_RUNBOOK.md
apps\spike-a\README.md
apps\spike-d\src\db\client.ts
apps\spike-d\package.json
apps\spike-d\src\db\schema.ts
apps\spike-a\migrations\002_content_test.sql
apps\spike-a\migrations\001_roles.sql
apps\spike-a\migrations\004_invariant_log.sql
apps\spike-a\migrations\003_audit_log.sql
apps\web\src\app\sign-out\route.ts
apps\web\src\app\sign-in\page.tsx
apps\web\src\components\forms\WorkflowActionButtons.tsx
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\components\forms\ReviewEntryActionForm.tsx
apps\web\src\components\forms\PublicationForm.tsx
apps\web\src\components\forms\MediaAppearanceForm.tsx
apps\web\src\components\forms\Field.tsx
apps\web\src\components\forms\FaqForm.tsx
apps\web\src\components\forms\DoctorProfileForm.tsx
apps\web\src\components\forms\DeleteForm.tsx
apps\web\src\components\forms\ClinicProfileForm.tsx
apps\web\src\components\forms\ArticleForm.tsx
apps\web\src\components\forms\ArticleCategoryForm.tsx
apps\web\src\app\sign-in\actions.ts
apps\web\src\app\(admin)\layout.tsx
apps\web\src\components\site\Hero.tsx
apps\web\src\components\site\DoctorCard.tsx
apps\web\src\components\site\BusinessHoursTable.tsx
apps\web\src\components\site\Breadcrumb.tsx
apps\web\src\components\site\ArticleBody.tsx
apps\web\src\components\site\SiteFooter.tsx
apps\web\src\components\site\ReservationChannels.tsx
apps\web\src\components\site\SiteHeader.tsx
apps\web\src\components\site\TreatmentCard.tsx
apps\spike-a\scripts\wait-db.js
apps\web\src\components\dev\MockMailbox.tsx
apps\web\src\app\api\health\route.ts
apps\web\src\app\api\site-meta-fetch\route.ts
apps\web\src\app\sign-in\consume\route.ts
apps\web\src\app\sign-in\cleanup\route.ts
apps\web\src\app\(site)\[instanceSlug]\layout.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(site)\[instanceSlug]\not-found.tsx
apps\web\src\app\(site)\[instanceSlug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(site)\[instanceSlug]\contact\page.tsx
apps\web\src\app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps\web\src\app\(site)\[instanceSlug]\faq\page.tsx
apps\web\src\app\(site)\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\robots.txt\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(site)\[instanceSlug]\about\page.tsx
apps\web\src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\page.tsx
apps\web\src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps\web\src\app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx

 succeeded in 668ms:
 M .claude/scheduled_tasks.lock
 M apps/spike-a/package.json
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
 M apps/web/src/components/forms/ArticleForm.tsx
 M apps/web/src/components/forms/TreatmentPageForm.tsx
 M apps/web/src/lib/env.ts
 M apps/web/src/seed.ts
 M apps/web/src/styles/globals.css
 M apps/web/tailwind.config.ts
 M docs/core/DATA_MODEL.md
 M docs/core/PAGE_TYPES.md
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M packages/core-content/src/index.ts
 M pnpm-lock.yaml
?? apps/web/scripts/admin-qa-token.ts
?? apps/web/scripts/seed-fixture-eat.sql
?? apps/web/scripts/seed-fixture.sql
?? apps/web/scripts/site-scenarios.md
?? apps/web/src/app/(admin)/admin/
?? apps/web/src/app/(site)/
?? apps/web/src/components/forms/ArticleCategoryForm.tsx
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/components/forms/FaqForm.tsx
?? apps/web/src/components/forms/MediaAppearanceForm.tsx
?? apps/web/src/components/forms/PublicationForm.tsx
?? apps/web/src/components/forms/ReviewEntryActionForm.tsx
?? apps/web/src/components/forms/WorkflowActionButtons.tsx
?? apps/web/src/components/site/
?? apps/web/src/lib/compliance/
?? apps/web/src/lib/db-projection.test.ts
?? apps/web/src/lib/db-projection.ts
?? apps/web/src/lib/eat-content-schema.ts
?? apps/web/src/lib/errors.ts
?? apps/web/src/lib/json-ld/
?? apps/web/src/lib/markdown.test.ts
?? apps/web/src/lib/markdown.ts
?? apps/web/src/lib/public-db.ts
?? apps/web/src/lib/public-tenant.ts
?? apps/web/src/lib/site-initial.ts
?? apps/web/src/lib/site-metadata.test.ts
?? apps/web/src/lib/site-metadata.ts
?? apps/web/src/lib/site-url.ts
?? apps/web/vitest.config.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md
?? docs/decisions/EAT_CONTENT_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/PROJECT_OVERVIEW.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/migrations/C0009_article_category.sql
?? packages/core-content/migrations/C0010_publication.sql
?? packages/core-content/migrations/C0011_media_appearance.sql
?? packages/core-content/migrations/C0012_faq.sql
?? packages/core-content/migrations/C0013_article_category_fk.sql
?? packages/core-content/migrations/C0014_compliance_record.sql
?? packages/core-content/migrations/C0015_review_queue_entry.sql
?? packages/core-content/migrations/C0016_status_unlock.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/db/migrations/D0011_public_reader.sql
?? packages/db/migrations/D0014_public_reader_eat.sql
?? packages/migrations-runner/src/

codex
첫 검색식이 PowerShell/정규식 이스케이프에 걸려 실패했습니다. 파일 목록과 변경 상태는 확보했고, 이제 대상 액션/폼/문서만 좁혀서 다시 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'name=\"status\"|EatStatusSchema|PUBLICATION_STATUSES|status:' apps/web/src/components/forms apps/web/src/app/(admin)/admin apps/web/src/lib docs/decisions docs/admin handoff/codex-reviews/compliance-workflow-integration-v1 -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'handoff/codex-reviews/compliance-workflow-integration-v1/cycle-1.out.md' -TotalCount 220" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' -TotalCount 260" in C:\Users\assag\solution\website-exposure
 succeeded in 594ms:
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
session id: 019e3ab3-73d9-7ff2-923c-d1339ebb9003
--------
user
Review 4 entity workflow 통합 — Article 패턴 동일 복제. **cycle 1**. compliance-assistant M0 code v1.0 (157 cycle 1284) 직후 후속 작업.

## SoT
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 § 5.2 CA-UI-02 / § 6 CA-ACTION
- `apps/web/src/components/forms/ArticleForm.tsx` (status read-only display 기준 패턴)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (saveArticle current-status pattern)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx` (WorkflowActionButtons mount 기준)

## 변경 entity 4종 (Article 외)
- **TreatmentPage**: form/actions/edit page 모두
- **FAQ**: form/actions/edit page 모두
- **Publication**: form/actions/edit page 모두
- **MediaAppearance**: form/actions/edit page 모두

## scope 외 (별 cycle)
- **LegalDocument**: clinic-profile 통합 form 안에 있어 별 cycle (LL-WORKFLOW-INTEGRATION marker)

## 각 entity 별 patch 3종 (동일 패턴)

### Form (status select → read-only display)
- `<SelectField name="status" ... />` → `<label><input name="status" value={v.status} readOnly /></label>` (slate-100 bg · disabled appearance)

### actions.ts (save action)
- update path: `beforeStatus` 추출 (FOR UPDATE) → UPDATE SET 안 status 제거 → return mode/currentStatus
- insert path: status='draft' hard-coded → return mode "insert"/currentStatus: "draft"
- audit emit payload: `status: txResult.currentStatus` (form 변조 방지)

### edit page ([slug]/page.tsx)
- WorkflowActionButtons import 추가
- form 위에 `<WorkflowActionButtons contentType="..." currentStatus={initial.status} contentRef={params.slug} />` 추가

## What to check (cycle 1)

### Plan SoT 합치 (CAM-18 정합)
- 4 entity form 안 status select 제거 → read-only display (uneditable)
- 4 entity save action 안 status field 무시 — current row.status 보존
- 4 entity 신규 row 항상 'draft' (form 변조 시도 차단)
- audit emit payload `status: txResult.currentStatus` (form 변조 방지)
- WorkflowActionButtons 4 entity edit page 안 mount 위치 (form 위 · ArticleForm 정합)

### TS / 보안 / 정합성
- TreatmentPage/Publication/MediaAppearance/FAQ form/actions/edit page 패턴 일관성
- 직접 변조된 form `status='published'` 시 server 측 어떻게 차단되는지 (action 안 status field 무시 → 항상 currentStatus 보존)
- WorkflowActionButtons currentStatus prop type 일관

### scope 외 (LegalDocument)
- LegalDocument 별 cycle marker — clinic-profile 통합 form 안 5 LegalDocument 동시 다룸 → LL-WORKFLOW-INTEGRATION 신설 명시

## Output (한국어 · 간결)

```
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
## major
## minor

## acceptance precondition 점검
- 4 entity form status read-only: <PASS|FAIL>
- 4 entity save action status 무시 + currentStatus 보존: <PASS|FAIL>
- 4 entity edit page WorkflowActionButtons mount: <PASS|FAIL>
- LegalDocument scope 분리 명시: <PASS|FAIL>
```

가능한 한 광범위하게 보고, file:line 인용. 한국어 응답.

codex
요청 범위가 코드 리뷰라서 먼저 SoT 문서와 Article 기준 구현, 그리고 4개 entity의 form/actions/page를 함께 대조하겠습니다. 변경 여부와 라인 인용이 중요하므로 파일 위치를 넓게 확인한 뒤 findings만 압축해서 드리겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"WorkflowActionButtons|name=\\\"status\\\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md apps/web/src/components/forms/ArticleForm.tsx apps/web/src/components/forms/TreatmentPageForm.tsx apps/web/src/components/forms/FAQForm.tsx apps/web/src/components/forms/PublicationForm.tsx apps/web/src/components/forms/MediaAppearanceForm.tsx" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"WorkflowActionButtons|currentStatus|status: txResult|beforeStatus|FOR UPDATE|status =|status\\)|status,\" apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx" in C:\Users\assag\solution\website-exposure
2026-05-18T10:48:40.053512Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:WorkflowActionButtons|name=\)
    ^
error: unclosed group

 exited 1 in 607ms:
rg: regex parse error:
    (?:WorkflowActionButtons|name=\)
    ^
error: unclosed group

2026-05-18T10:48:40.224814Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … FOR UPDATE|status =|status\)|status," apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 774ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … FOR UPDATE|status =|status\)|status," apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
첫 검색은 PowerShell에서 괄호가 있는 경로와 따옴표 이스케이프 때문에 실패했습니다. 같은 대상을 경로 단위로 안전하게 다시 읽겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|name=\"status\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument' 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' 'apps/web/src/components/forms/ArticleForm.tsx' 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|currentStatus|status: txResult|beforeStatus|FOR UPDATE|status =|status\\)|status,' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 571ms:
apps/web/src/components/forms/MediaAppearanceForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/MediaAppearanceForm.tsx:77:      <SelectField name="channelType" label="채널 종류" required value={v.channelType} onChange={(x) => set("channelType", x)} options={CHANNEL_OPTIONS} errors={fieldErrors.channelType} hint="v0.1 단계 모두 schema.org VideoObject 단일화" />
apps/web/src/components/forms/MediaAppearanceForm.tsx:83:      <SelectField
apps/web/src/components/forms/MediaAppearanceForm.tsx:94:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/PublicationForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/PublicationForm.tsx:80:      <SelectField
apps/web/src/components/forms/PublicationForm.tsx:92:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/FAQForm.tsx:7:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/FAQForm.tsx:74:      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
apps/web/src/components/forms/FAQForm.tsx:75:      <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
apps/web/src/components/forms/FAQForm.tsx:76:      <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
apps/web/src/components/forms/FAQForm.tsx:80:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/TreatmentPageForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/TreatmentPageForm.tsx:81:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/TreatmentPageForm.tsx:83:      <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />
apps/web/src/components/forms/ArticleForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/ArticleForm.tsx:89:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/ArticleForm.tsx:91:      <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
apps/web/src/components/forms/ArticleForm.tsx:92:      <SelectField
apps/web/src/components/forms/ArticleForm.tsx:101:      <SelectField
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:13:- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:28:- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:30:- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:33:- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:90:  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:126:    record_phase <> 'published' OR content_type <> 'LegalDocument'
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:155:- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:157:- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:236:-- (Step 1) LegalDocument · FAQ CHECK 해제
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:301:-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:441:  if (contentType === "LegalDocument") roles.add("legal");
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:508:  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:539:    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:540:    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:544:// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:545://   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:562:      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:577:  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:578:  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:579:  if (input.contentType === "LegalDocument") {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:581:      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:582:      "Use buildLegalDocumentExemptEnvelope() instead."
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:636:const envelope = contentType === "LegalDocument"
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:637:  ? buildLegalDocumentExemptEnvelope(input)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:767:| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:838:| 2026-05-18 | v0.5 | **Codex 자동 비평 cycle 4 1 finding (CAM4-01 = CAM3-02 잔재 정정) 전건 수용 patch**: § 1.1 LegalDocument 면제 항목 안 `auto_check_result 슬롯에 envelope 저장` 표현 정정 → result 슬롯은 SoT 7 필드만 · exemptReason 은 `compliance_record.metadata` 슬롯. 누계 cycle 1~4 = 36 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 exited 1 in 570ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:78:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:109:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:113:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:80:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:111:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:115:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:56:               status::text AS status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:85:          status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:122:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:126:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:81:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:114:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:118:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:45:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:50:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:68:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:88:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:101:          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:117:      let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:120:          SELECT id, status::text AS status, author_doctor_id, category_id FROM article
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:122:           FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:127:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:191:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:197:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:204:          'draft'::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:211:      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:237:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },

 succeeded in 636ms:
# compliance-assistant M0 vertical slice plan (v1.0·acceptance·2026-05-18)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **5 cycle 36 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정. 수렴 추세 **28 → 5 → 2 → 1 → 0**. EAT_CONTENT code v1.0 acceptance 직후 진입하는 첫 Feature 본 plan (M0 vertical slice scope).

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
- `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯 · § 7.1 publishable 6조건 · § 9.1.1 알림 정책
- `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — 풀명세 (recordPhase · recordVersion · mediaThresholdAssessment · mediaThresholdOperationalInput · staleFlags · warningAck · llmAssist · attachments · featureContentType · priorReviewSubmissionId)
- `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference (MAX 결합) · § 3 RiskRule · § 4 finalRoles · § 6 High 강제 검수
- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-07/12 부분 해소 대상 (EC-DEFER-05 미해소)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 발행 게이트 부분 해소 대상 (NotificationEvent 분리)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 위치 정책 · base role
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.4 (Drizzle SoT)
  - `apps/web/src/components/forms/{ArticleForm, FaqForm, ...}.tsx` (status select)
  - `apps/web/src/lib/action-context.ts` (assertActionEligibility 패턴)

> **표기 규칙 (cycle 1 CAM-26 정정)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `record_phase` (DB) ↔ `recordPhase` (TS).

## 1. 목적과 범위

### 1.1 목적 — cycle 1 CAM-01·09·21 정정

- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
- **EC-DEFER-12 부분 해소**: 6 entity published 발행 unlock — **수동 검수 게이트 통과 시 만**. EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) 는 **미해소** — CA-DEFER-01/02 동반 합류 시. M0 stub 의 manualReview 기반 발행은 자동 룰 검수 부재 risk 인지.
- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + manual-review queue 활성화 + multi-role AND 게이트 (operator·medical·legal — client 미합류 CA-DEFER-10).
- **자동 검수(룰) 미합류 marker**: check() stub — 항상 manualReview 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass · 단 High 입력 시 가상 finding). 실 ruleCatalog/composite/LLM은 CA-DEFER-01·02·03.
- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).

### 1.2 범위 (포함) — cycle 1 CAM-02·10·14·15·17·18·19 정정

| 항목 | 비고 |
|---|---|
| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
| `assertReviewerEligibility` helper | role 별 admin_user flag 검증 |
| `published_content_compliance_guard` 트리거 (CAM-08 정정) | BEFORE INSERT/UPDATE ON each entity (article·treatment_page·legal_document·faq·publication·media_appearance) — `NEW.status='published'` 시 referenced compliance_record.record_phase='published' + content_type 일치 + content_ref 매칭 (slug) + instance_id 일치 검증. 위반 시 RAISE EXCEPTION |
| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
| vitest scenarios 16건 (CAM-28 정합) | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (4 case) · status 전이 안전성 (3 case) · transition table 무결성 (1 case) |

### 1.3 비범위 (defer) — CAM-11·12·21 정정

| 항목 | Defer to | marker |
|---|---|---|
| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
| RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX 결합) — M0 stub은 입력 결합 MAX만 처리 | CA-DEFER-01 동반 | CA-DEFER-02 |
| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
| MediaThresholdAssessment · mediaThresholdOperationalInput · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
| ComplianceRecord 풀 컬럼 (mediaThresholdAssessment · mediaThresholdOperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · **featureContentType** · client 슬롯) — 각 CA-DEFER phase 매핑 | 각 CA-DEFER phase | CA-DEFER-13 |
| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
| content-gate 자동 큐 진입 (ComplianceCheckResult.gateRequired=true 시) — M0 manual-review 큐 vs content-gate 큐 분리 운영 | CA-DEFER-01 동반 (룰 합류 시 content-gate 큐 활성화) | CA-DEFER-15 |
| Feature contentType (DATA_MODEL C-10 v0.5 `Feature` 토큰 + featureContentType) | CA-DEFER-01 + Feature 합류 시 | CA-DEFER-16 |

## 2. 데이터 모델 결정

### 2.1 C0014 `compliance_record` 신규 table (CA-SCHEMA-01) — CAM-10·11·12·25 정정

```sql
-- packages/core-content/migrations/C0014_compliance_record.sql
-- SoT: DATA_MODEL § 4 C-10 ComplianceRecord (v0.6+ 17종 contentType enum)
-- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조

CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');

-- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit 가능, 나머지는 allowlist app layer 검증).
CREATE TYPE compliance_content_type AS ENUM (
  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
  'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
  'Feature', 'Publication', 'MediaAppearance'
);

CREATE TABLE compliance_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  page_risk_level risk_level NOT NULL,
  article_type TEXT,
  inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_check_result JSONB NOT NULL,
  peer_reviewer UUID,                          -- admin_user.id (operator)
  peer_reviewed_at TIMESTAMPTZ,
  physician_approver UUID,                      -- admin_user.id (medical)
  physician_approved_at TIMESTAMPTZ,
  legal_counsel UUID,                           -- admin_user.id (legal)
  legal_counsel_at TIMESTAMPTZ,
  client_approver UUID,                         -- M0 미사용 (CA-DEFER-10)
  client_approved_at TIMESTAMPTZ,
  prior_review_required BOOLEAN NOT NULL DEFAULT false,  -- M0 false fixed
  prior_review_submission_id TEXT,              -- CA-DEFER-08
  prior_review_passed BOOLEAN,                  -- CA-DEFER-08
  published_at TIMESTAMPTZ,
  published_by UUID,                            -- admin_user.id
  record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  record_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  CONSTRAINT compliance_record_published_requires_at CHECK (
    record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  ),
  CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
    record_phase <> 'published' OR content_type <> 'LegalDocument'
    OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_med_high_requires_physician CHECK (
    record_phase <> 'published' OR page_risk_level = 'Low'
    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_published_requires_peer CHECK (
    record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';

ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON compliance_record FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;
```

**결정 (CA-SCHEMA-01·02·03)**:
- (CAM-25 정정) C0014 = C-**10** ComplianceRecord (DATA_MODEL § 4 SoT). 잘못 표기된 C-08 → C-10 정정.
- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
- (CAM-13 정정) ReviewQueueEntry status `cancelled` 제거 — open/in-progress/resolved 3종 만.
- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.

### 2.2 C0015 `review_queue_entry` 신규 table (CA-SCHEMA-04) — CAM-02·13·14·15 정정

```sql
-- packages/core-content/migrations/C0015_review_queue_entry.sql
-- SoT: REVIEW_WORKFLOW § 3 큐 3종. M0 v0.1 manual-review 1종 활성

-- CAM-02 정정: manual-review queue type 신설 (수동 검수 큐). content-gate (ruleCatalog gateRequired) · warning · stale 은 ADD VALUE cascade.
CREATE TYPE review_queue_type AS ENUM ('manual-review');
-- CAM-13 정정: cancelled 제거. open/in-progress/resolved 3종 만.
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
-- CAM-15 정정: required_roles enum array 운영
CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  -- CAM-14 정정: M0 manual-review 는 ComplianceRecord pre-publish 참조 필수. NOT NULL.
  compliance_record_id UUID NOT NULL,
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
  -- CAM-15 정정: text[]도 enum 검증이 어려워 approver_role[] array 운영
  required_roles approver_role[] NOT NULL,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
    status <> 'resolved' OR resolved_at IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
    status <> 'resolved' OR resolution_type IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
    REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
  WHERE status IN ('open', 'in-progress');
CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref)
  WHERE status IN ('open', 'in-progress');

ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON review_queue_entry FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
```

**결정 (CA-SCHEMA-04~06)**:
- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
- (CAM-13) `cancelled` 제거 — open/in-progress/resolved 3종.

### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정

```sql
-- packages/core-content/migrations/C0016_status_unlock.sql
-- CAM-07 정정: NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리.
-- CAM-08 정정: published_content_compliance_guard trigger 추가 — entity.status='published' 시 record_phase 매칭 검증.

-- (Step 1) LegalDocument · FAQ CHECK 해제
ALTER TABLE legal_document DROP CONSTRAINT legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint
ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;

2026-05-18T10:57:02.183189Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tatus:' apps/web/src/components/forms apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 744ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tatus:' apps/web/src/components/forms apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
cycle 1 결과와 SoT 라인은 확인했습니다. 지금은 실제 patch가 CWI-01을 충분히 닫았는지 보려고 5개 폼과 5개 action schema를 직접 읽는 중입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/components/forms/ArticleForm.tsx' -TotalCount 180" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/components/forms/TreatmentPageForm.tsx' -TotalCount 180" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/components/forms/FaqForm.tsx' -TotalCount 160" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/components/forms/PublicationForm.tsx' -TotalCount 160" in C:\Users\assag\solution\website-exposure
 succeeded in 635ms:
// @glitzy/web/components/forms/ArticleForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type ArticleInitial = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  status: string;
  riskLevel: string;
  heroImageUrl: string;
  authorDoctorId: string;
  categoryId: string;
};

const empty: ArticleInitial = {
  slug: "",
  title: "",
  summary: "",
  bodyMarkdown: "",
  status: "draft",
  riskLevel: "",
  heroImageUrl: "",
  authorDoctorId: "",
  categoryId: "",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "초안" },
  { value: "review-queued", label: "검수 대기" },
  { value: "in-review", label: "검수 중" },
  { value: "approved", label: "승인됨" },
  { value: "publishable", label: "발행 가능" },
  { value: "published", label: "발행됨" },
  { value: "blocked", label: "차단" },
  { value: "rejected", label: "거부" },
  { value: "stale", label: "만료" },
];

const RISK_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export function ArticleForm({
  action,
  initial,
  isNew,
  doctorOptions,
  categoryOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: ArticleInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<ArticleInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
      {/* CAM-18 정정: status 직접 선택 차단 — workflow action 버튼 통해서만 전이. read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>
      <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
      <SelectField
        name="authorDoctorId"
        label="저자 (DoctorProfile)"
        value={v.authorDoctorId}
        onChange={(x) => set("authorDoctorId", x)}
        options={doctorOptions}
        errors={fieldErrors.authorDoctorId}
        hint="선택 시 해당 의료진의 저자 권위 표시"
      />
      <SelectField
        name="categoryId"
        label="카테고리"
        value={v.categoryId}
        onChange={(x) => set("categoryId", x)}
        options={categoryOptions}
        errors={fieldErrors.categoryId}
        hint="비워두면 기본 카테고리(general) 사용"
      />

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

 succeeded in 632ms:
// @glitzy/web/components/forms/FaqForm — EAT_CONTENT_PLAN v1.0 § 4.1
//   v0.1 단계 status='draft' DB CHECK 강제. 발행 자체 차단 (EC-DEFER-12).
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type FaqInitial = {
  slug: string;
  question: string;
  answer: string;
  displayOrder: string;
  categoryId: string;
  authorDoctorId: string;
  relatedTreatmentId: string;
  status: string;
};

const empty: FaqInitial = {
  slug: "",
  question: "",
  answer: "",
  displayOrder: "0",
  categoryId: "",
  authorDoctorId: "",
  relatedTreatmentId: "",
  status: "draft",
};

const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function FaqForm({
  action,
  initial,
  isNew,
  categoryOptions,
  doctorOptions,
  treatmentOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: FaqInitial | null;
  isNew: boolean;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  treatmentOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<FaqInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof FaqInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        FAQ 발행은 compliance-assistant Feature + 위험도 자동 추론 합류 후 활성화됩니다 (EC-DEFER-05·12). 현재 단계에서는 draft 저장만 가능합니다.
      </div>

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
      <Field name="question" label="질문" required value={v.question} onChange={(x) => set("question", x)} errors={fieldErrors.question} minLength={10} maxLength={200} hint="10~200자" />
      <Field name="answer" label="답변 (Markdown)" required textarea rows={10} value={v.answer} onChange={(x) => set("answer", x)} errors={fieldErrors.answer} minLength={50} maxLength={2000} hint="50~2000자" />
      <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} />
      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
      <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
      <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

 succeeded in 638ms:
// @glitzy/web/components/forms/TreatmentPageForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type TreatmentPageInitial = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  status: string;
  riskLevel: string;
  heroImageUrl: string;
};

const empty: TreatmentPageInitial = {
  slug: "",
  title: "",
  summary: "",
  bodyMarkdown: "",
  status: "draft",
  riskLevel: "",
  heroImageUrl: "",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "초안" },
  { value: "review-queued", label: "검수 대기" },
  { value: "in-review", label: "검수 중" },
  { value: "approved", label: "승인됨" },
  { value: "publishable", label: "발행 가능" },
  { value: "published", label: "발행됨" },
  { value: "blocked", label: "차단" },
  { value: "rejected", label: "거부" },
  { value: "stale", label: "만료" },
];

const RISK_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export function TreatmentPageForm({
  action,
  initial,
  isNew,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: TreatmentPageInitial | null;
  isNew: boolean;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<TreatmentPageInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof TreatmentPageInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} hint="3~100자" />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={160} hint="50~160자 (검색 결과 노출용)" />
      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={14} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={50000} hint="Markdown 형식" />
      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 → schema/server 양쪽 안전 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>
      <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

 succeeded in 673ms:
// @glitzy/web/components/forms/PublicationForm — EAT_CONTENT_PLAN v1.0 § 4.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type PublicationInitial = {
  slug: string;
  title: string;
  authors: string;
  journal: string;
  publishedDate: string;
  doi: string;
  pubmedId: string;
  url: string;
  thumbnailUrl: string;
  summary: string;
  authorDoctorId: string;
  status: string;
};

const empty: PublicationInitial = {
  slug: "",
  title: "",
  authors: "",
  journal: "",
  publishedDate: "",
  doi: "",
  pubmedId: "",
  url: "",
  thumbnailUrl: "",
  summary: "",
  authorDoctorId: "",
  status: "draft",
};

// EC-FORM-02 — v0.1 단계 status='draft' 만
const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function PublicationForm({
  action,
  initial,
  isNew,
  doctorOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: PublicationInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<PublicationInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof PublicationInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} hint="3~100자 · 소문자/숫자/하이픈" />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={300} />
      <Field name="authors" label="저자 (콤마 또는 줄바꿈 구분)" required textarea rows={2} value={v.authors} onChange={(x) => set("authors", x)} errors={fieldErrors.authors} hint="1명 이상 필수 · 각 100자 이내" />
      <Field name="journal" label="학술지" value={v.journal} onChange={(x) => set("journal", x)} errors={fieldErrors.journal} maxLength={200} />
      <Field name="publishedDate" label="게재일" type="date" required value={v.publishedDate} onChange={(x) => set("publishedDate", x)} errors={fieldErrors.publishedDate} />
      <Field name="doi" label="DOI" value={v.doi} onChange={(x) => set("doi", x)} errors={fieldErrors.doi} hint="예: 10.1000/xyz123" />
      <Field name="pubmedId" label="PubMed ID" value={v.pubmedId} onChange={(x) => set("pubmedId", x)} errors={fieldErrors.pubmedId} maxLength={9} hint="1~9자리 숫자" />
      <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
      <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
      <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
      <SelectField
        name="authorDoctorId"
        label="대표 의료진 (선택)"
        value={v.authorDoctorId}
        onChange={(x) => set("authorDoctorId", x)}
        options={doctorOptions}
        errors={fieldErrors.authorDoctorId}
        hint="저자 의료진을 선택하면 해당 Doctor Profile 페이지의 학술 권위 시그널로 출력됩니다."
      />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/components/forms/MediaAppearanceForm.tsx' -TotalCount 170" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' -TotalCount 280" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' -TotalCount 150" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' -TotalCount 240" in C:\Users\assag\solution\website-exposure
 succeeded in 676ms:
// @glitzy/web/components/forms/MediaAppearanceForm — EAT_CONTENT_PLAN v1.0 § 4.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type MediaAppearanceInitial = {
  slug: string;
  title: string;
  channelName: string;
  channelType: string;
  publishedDate: string;
  durationSeconds: string;
  url: string;
  thumbnailUrl: string;
  summary: string;
  authorDoctorId: string;
  status: string;
};

const empty: MediaAppearanceInitial = {
  slug: "",
  title: "",
  channelName: "",
  channelType: "youtube",
  publishedDate: "",
  durationSeconds: "",
  url: "",
  thumbnailUrl: "",
  summary: "",
  authorDoctorId: "",
  status: "draft",
};

const CHANNEL_OPTIONS = [
  { value: "broadcast", label: "방송 (BroadcastEvent EC-DEFER-11)" },
  { value: "youtube", label: "유튜브" },
  { value: "podcast", label: "팟캐스트" },
  { value: "press", label: "기사 (NewsArticle EC-DEFER-11)" },
];

const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function MediaAppearanceForm({
  action,
  initial,
  isNew,
  doctorOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: MediaAppearanceInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<MediaAppearanceInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof MediaAppearanceInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={300} />
      <Field name="channelName" label="채널명" required value={v.channelName} onChange={(x) => set("channelName", x)} errors={fieldErrors.channelName} maxLength={100} />
      <SelectField name="channelType" label="채널 종류" required value={v.channelType} onChange={(x) => set("channelType", x)} options={CHANNEL_OPTIONS} errors={fieldErrors.channelType} hint="v0.1 단계 모두 schema.org VideoObject 단일화" />
      <Field name="publishedDate" label="게재일" type="date" required value={v.publishedDate} onChange={(x) => set("publishedDate", x)} errors={fieldErrors.publishedDate} />
      <Field name="durationSeconds" label="길이 (초)" value={v.durationSeconds} onChange={(x) => set("durationSeconds", x)} errors={fieldErrors.durationSeconds} hint="양의 정수 · 선택" />
      <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
      <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
      <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
      <SelectField
        name="authorDoctorId"
        label="출연 의료진 (선택)"
        value={v.authorDoctorId}
        onChange={(x) => set("authorDoctorId", x)}
        options={doctorOptions}
        errors={fieldErrors.authorDoctorId}
      />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

2026-05-18T10:57:16.836063Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/arti[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 752ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/arti[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 758ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/trea[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T10:57:16.847993Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/trea[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T10:57:16.878049Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 804ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

codex
PowerShell의 `[]`가 glob 패턴으로 해석되어 action 파일 읽기가 빗나갔습니다. `-LiteralPath`로 전환해서 동일 파일들을 다시 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' -TotalCount 280" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' -TotalCount 260" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' -TotalCount 170" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' -TotalCount 190" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' -TotalCount 200" in C:\Users\assag\solution\website-exposure
 succeeded in 647ms:
// @glitzy/web/(admin)/[instanceSlug]/faqs/actions — EAT_CONTENT_PLAN v1.0
//   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { FaqInputSchema } from "@/lib/eat-content-schema";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveFaq(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = FaqInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const txResult = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        let beforeStatus: string = "draft";
        if (originalSlug !== null) {
          const beforeRows = await tx<{ id: string; status: string }[]>`
            SELECT id, status::text AS status FROM faq
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          beforeStatus = beforeRows[0]!.status;

          // CAM-18 정정: status workflow action 통해서만 전이. saveFaq 는 본문 / metadata 만.
          await tx`
            UPDATE faq
               SET slug = ${parsed.data.slug},
                   question = ${parsed.data.question},
                   answer = ${parsed.data.answer},
                   display_order = ${Number(parsed.data.displayOrder)},
                   category_id = ${parsed.data.categoryId ?? null}::uuid,
                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                   related_treatment_id = ${parsed.data.relatedTreatmentId ?? null}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
        }

        // 신규 row 항상 'draft' — workflow action 통해서만 전이.
        await tx`
          INSERT INTO faq (
            instance_id, slug, question, answer, display_order,
            category_id, author_doctor_id, related_treatment_id, status
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${parsed.data.slug},
            ${parsed.data.question},
            ${parsed.data.answer},
            ${Number(parsed.data.displayOrder)},
            ${parsed.data.categoryId ?? null}::uuid,
            ${parsed.data.authorDoctorId ?? null}::uuid,
            ${parsed.data.relatedTreatmentId ?? null}::uuid,
            'draft'::content_publication_status
          )
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
      },
    );

    if (txResult.ok === false && txResult.action === "notfound") notFound();
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveFaq] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/faqs`);
      revalidatePath(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/faqs/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveFaq] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteFaq(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM faq
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 FAQ 가 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "FAQ", slug },
      });
    } catch (err) {
      console.error("[deleteFaq] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/faqs`);
    revalidatePath(`/admin/${instanceSlug}/faqs/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);

 succeeded in 672ms:
// @glitzy/web/(admin)/[instanceSlug]/articles/actions
// cycle1-3entity patch: WEB-01·04·06·08·10·15

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import type { SaveResult } from "@/lib/save-result";

const PUBLICATION_STATUSES = [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
] as const;
const RISK_LEVELS = ["Low", "Medium", "High"] as const;

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
      message: "slug 는 3~100자 (소문자/숫자/하이픈)",
    }),
  title: z
    .string({ required_error: "제목은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
  summary: z
    .string({ required_error: "요약은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 80 && v.length <= 200, { message: "요약은 80~200자" }),
  bodyMarkdown: z
    .string({ required_error: "본문은 필수입니다." })
    .min(1, "본문은 1자 이상")
    .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이. form FormData 안 status 미포함.
  riskLevel: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
      message: "위험도는 Low / Medium / High",
    }),
  heroImageUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https · 2048자",
    }),
  authorDoctorId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: "저자 UUID 형식 오류",
    }),
  // EAT_CONTENT v1.0 (EC-SCHEMA-05): C-04 Article.category required.
  //   form 은 selected category UUID. action 안 비어 있으면 instance 의 default `general` 으로 fallback.
  categoryId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: "카테고리 UUID 형식 오류",
    }),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveArticle(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      // CAMC-12 정정: locked row 의 current status 보관 (audit payload 용).
      //   parsed.data.status 는 form readonly · 변조 가능 — DB 진실 보존.
      let currentAuthorId: string | null = null;
      let currentCategoryId: string | null = null;
      let beforeStatus: string = "draft";
      if (originalSlug !== null) {
        const beforeRows = await tx<{ id: string; status: string; author_doctor_id: string | null; category_id: string }[]>`
          SELECT id, status::text AS status, author_doctor_id, category_id FROM article
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
           FOR UPDATE
        `;
        if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
        currentAuthorId = beforeRows[0]!.author_doctor_id;
        currentCategoryId = beforeRows[0]!.category_id;
        beforeStatus = beforeRows[0]!.status;
      }

      // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 instance-scoped 사전 검증 (cycle 1 ECC-03 patch).
      //   1) form 값이 있으면 같은 tx 안에서 SELECT 로 존재/tenant 확인 — 없으면 category-not-found.
      //   2) 없으면 current row 의 categoryId 유지.
      //   3) 둘 다 없으면 default `general` SELECT — 없으면 default-category-missing.
      let resolvedCategoryId: string;
      if (parsed.data.categoryId) {
        const categoryRows = await tx<{ id: string }[]>`
          SELECT id FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
           LIMIT 1
        `;
        if (categoryRows.length === 0) {
          return { ok: false as const, action: "category-not-found" as const };
        }
        resolvedCategoryId = categoryRows[0]!.id;
      } else if (currentCategoryId !== null) {
        resolvedCategoryId = currentCategoryId;
      } else {
        const defaultCategoryRows = await tx<{ id: string }[]>`
          SELECT id FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
           LIMIT 1
        `;
        if (defaultCategoryRows.length === 0) {
          return { ok: false as const, action: "default-category-missing" as const };
        }
        resolvedCategoryId = defaultCategoryRows[0]!.id;
      }

      // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
      if (parsed.data.authorDoctorId) {
        const doctorRows = await tx<{ id: string; active: boolean }[]>`
          SELECT id, active FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
           LIMIT 1
        `;
        if (doctorRows.length === 0) {
          return { ok: false as const, action: "author-not-found" as const };
        }
        const d = doctorRows[0]!;
        if (!d.active && d.id !== currentAuthorId) {
          return { ok: false as const, action: "author-inactive" as const };
        }
      }

      if (originalSlug !== null) {
        // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
        //   saveArticle 은 본문 / metadata 만 갱신 — 현재 row status 보존.
        await tx`
          UPDATE article
             SET slug = ${parsed.data.slug},
                 title = ${parsed.data.title},
                 summary = ${parsed.data.summary},
                 body_markdown = ${parsed.data.bodyMarkdown},
                 risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
                 hero_image_url = ${parsed.data.heroImageUrl ?? null},
                 author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                 category_id = ${resolvedCategoryId}::uuid,
                 updated_at = now()
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
      }

      // 신규 article 은 항상 'draft' 로 시작 — workflow action 통해서만 전이.
      await tx`
        INSERT INTO article (
          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
        ) VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.slug},
          ${parsed.data.title},
          ${parsed.data.summary},
          ${parsed.data.bodyMarkdown},
          'draft'::content_publication_status,
          ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
          ${parsed.data.heroImageUrl ?? null},
          ${parsed.data.authorDoctorId ?? null}::uuid,
          ${resolvedCategoryId}::uuid
        )
      `;
      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
    });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
      if (txResult.action === "author-not-found") {
        return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
      }
      if (txResult.action === "author-inactive") {
        return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
      }
      if (txResult.action === "default-category-missing") {
        return { ok: false, fieldErrors: {}, formError: "기본 카테고리가 없습니다. 관리자에게 문의하세요 (EC-SCHEMA-03)." };
      }
      if (txResult.action === "category-not-found") {
        return { ok: false, fieldErrors: { categoryId: ["해당 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택하세요."] } };
      }
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveArticle] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/articles`);
      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveArticle] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const deleted = await tx<{ id: string }[]>`

 succeeded in 661ms:
// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
// cycle1-3entity patch:
//   - WEB-01·04·06·08·10·15
//   - WEB-12 published_at 정책: unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade (Plan v1.0)

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import type { SaveResult } from "@/lib/save-result";

const PUBLICATION_STATUSES = [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
] as const;
const RISK_LEVELS = ["Low", "Medium", "High"] as const;

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
      message: "slug 는 3~100자 (소문자/숫자/하이픈) 이어야 합니다.",
    }),
  title: z
    .string({ required_error: "제목은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
  summary: z
    .string({ required_error: "요약은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 50 && v.length <= 160, { message: "요약은 50~160자" }),
  bodyMarkdown: z
    .string({ required_error: "본문은 필수입니다." })
    .min(1, "본문은 1자 이상이어야 합니다.")
    .max(50_000, "본문은 50000자를 넘을 수 없습니다."),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이. form FormData 안 status 미포함.
  riskLevel: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
      message: "위험도는 Low / Medium / High",
    }),
  heroImageUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "hero 이미지 URL 은 http/https · 2048자",
    }),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveTreatmentPage(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
      //   saveTreatmentPage 은 본문 / metadata 만 갱신 — 현재 row status 보존.
      let beforeStatus: string = "draft";
      if (originalSlug !== null) {
        const beforeRows = await tx<{ id: string; status: string }[]>`
          SELECT id, status::text AS status FROM treatment_page
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
           FOR UPDATE
        `;
        if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
        beforeStatus = beforeRows[0]!.status;
        await tx`
          UPDATE treatment_page
             SET slug = ${parsed.data.slug},
                 title = ${parsed.data.title},
                 summary = ${parsed.data.summary},
                 body_markdown = ${parsed.data.bodyMarkdown},
                 risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
                 hero_image_url = ${parsed.data.heroImageUrl ?? null},
                 updated_at = now()
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
      }

      // 신규 row 는 항상 'draft' 로 시작 — workflow action 통해서만 전이.
      await tx`
        INSERT INTO treatment_page (
          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url
        ) VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.slug},
          ${parsed.data.title},
          ${parsed.data.summary},
          ${parsed.data.bodyMarkdown},
          'draft'::content_publication_status,
          ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
          ${parsed.data.heroImageUrl ?? null}
        )
      `;
      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
    });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "TreatmentPage", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveTreatmentPage] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/treatments`);
      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveTreatmentPage] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteTreatmentPage(
  instanceSlug: string,
  slug: string,
): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM treatment_page
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         RETURNING id
      `;
      return { deleted: deleted.length };
    });

    if (result.deleted === 0) {
      return { ok: false, formError: "해당 시술 페이지가 이미 삭제되었습니다." };
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "TreatmentPage", slug },
      });
    } catch (err) {
      console.error("[deleteTreatmentPage] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/treatments`);
    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/treatments`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteTreatmentPage] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}

 succeeded in 672ms:
// @glitzy/web/(admin)/[instanceSlug]/publications/actions — EAT_CONTENT_PLAN v1.0

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { PublicationInputSchema } from "@/lib/eat-content-schema";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function savePublication(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = PublicationInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const txResult = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        let beforeStatus: string = "draft";
        if (originalSlug !== null) {
          const beforeRows = await tx<{ id: string; status: string }[]>`
            SELECT id, status::text AS status FROM publication
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          beforeStatus = beforeRows[0]!.status;

          // CAM-18 정정: status workflow action 통해서만 전이.
          await tx`
            UPDATE publication
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   authors = ${JSON.stringify(parsed.data.authors)}::jsonb,
                   journal = ${parsed.data.journal ?? null},
                   published_date = ${parsed.data.publishedDate}::date,
                   doi = ${parsed.data.doi ?? null},
                   pubmed_id = ${parsed.data.pubmedId ?? null},
                   url = ${parsed.data.url},
                   thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
                   summary = ${parsed.data.summary},
                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
        }

        // 신규 row 항상 'draft' — workflow action 통해서만 전이.
        await tx`
          INSERT INTO publication (
            instance_id, slug, title, authors, journal, published_date,
            doi, pubmed_id, url, thumbnail_url, summary,
            author_doctor_id, status
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${parsed.data.slug},
            ${parsed.data.title},
            ${JSON.stringify(parsed.data.authors)}::jsonb,
            ${parsed.data.journal ?? null},
            ${parsed.data.publishedDate}::date,
            ${parsed.data.doi ?? null},
            ${parsed.data.pubmedId ?? null},
            ${parsed.data.url},
            ${parsed.data.thumbnailUrl ?? null},
            ${parsed.data.summary},
            ${parsed.data.authorDoctorId ?? null}::uuid,
            'draft'::content_publication_status
          )
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
      },
    );

    if (txResult.ok === false && txResult.action === "notfound") notFound();
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[savePublication] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/publications`);
      revalidatePath(`/admin/${instanceSlug}/publications/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/publications/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/publications/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[savePublication] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deletePublication(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM publication
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 publication 이 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "Publication", slug },
      });
    } catch (err) {
      console.error("[deletePublication] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/publications`);
    revalidatePath(`/admin/${instanceSlug}/publications/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/publications`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deletePublication] unexpected", err);

 succeeded in 695ms:
// @glitzy/web/(admin)/[instanceSlug]/media-appearances/actions — EAT_CONTENT_PLAN v1.0

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { MediaAppearanceInputSchema } from "@/lib/eat-content-schema";
import type { SaveResult } from "@/lib/save-result";

export type DeleteResult = { ok: true } | { ok: false; formError: string };

export async function saveMediaAppearance(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = MediaAppearanceInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  const durationSeconds = parsed.data.durationSeconds ? Number(parsed.data.durationSeconds) : null;

  try {
    const txResult = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        let beforeStatus: string = "draft";
        if (originalSlug !== null) {
          const beforeRows = await tx<{ id: string; status: string }[]>`
            SELECT id, status::text AS status FROM media_appearance
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          beforeStatus = beforeRows[0]!.status;

          // CAM-18 정정: status workflow action 통해서만 전이.
          await tx`
            UPDATE media_appearance
               SET slug = ${parsed.data.slug},
                   title = ${parsed.data.title},
                   channel_name = ${parsed.data.channelName},
                   channel_type = ${parsed.data.channelType}::media_channel_type,
                   published_date = ${parsed.data.publishedDate}::date,
                   duration_seconds = ${durationSeconds},
                   url = ${parsed.data.url},
                   thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
                   summary = ${parsed.data.summary},
                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
        }

        // 신규 row 항상 'draft' — workflow action 통해서만 전이.
        await tx`
          INSERT INTO media_appearance (
            instance_id, slug, title, channel_name, channel_type, published_date,
            duration_seconds, url, thumbnail_url, summary,
            author_doctor_id, status
          ) VALUES (
            ${ctx.instanceId}::uuid,
            ${parsed.data.slug},
            ${parsed.data.title},
            ${parsed.data.channelName},
            ${parsed.data.channelType}::media_channel_type,
            ${parsed.data.publishedDate}::date,
            ${durationSeconds},
            ${parsed.data.url},
            ${parsed.data.thumbnailUrl ?? null},
            ${parsed.data.summary},
            ${parsed.data.authorDoctorId ?? null}::uuid,
            'draft'::content_publication_status
          )
        `;
        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
      },
    );

    if (txResult.ok === false && txResult.action === "notfound") notFound();
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
          payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveMediaAppearance] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/media-appearances`);
      revalidatePath(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/media-appearances/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveMediaAppearance] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteMediaAppearance(instanceSlug: string, slug: string): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const deleted = await tx<{ id: string }[]>`
          DELETE FROM media_appearance
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
           RETURNING id
        `;
        return { deleted: deleted.length };
      },
    );

    if (result.deleted === 0) return { ok: false, formError: "해당 media appearance 가 이미 삭제되었습니다." };

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "MediaAppearance", slug },
      });
    } catch (err) {
      console.error("[deleteMediaAppearance] audit emit failed", err);
    }

    revalidatePath(`/admin/${instanceSlug}/media-appearances`);
    revalidatePath(`/admin/${instanceSlug}/media-appearances/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    redirect(`/admin/${instanceSlug}/media-appearances`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
    console.error("[deleteMediaAppearance] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'EatStatusSchema|status:|status\\b|PUBLICATION_STATUSES|deprecated|@deprecated' 'apps/web/src/lib/eat-content-schema.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'LL-WORKFLOW-INTEGRATION|LegalDocumentForm|6 entity form status|4 form status|작업 #11|\\| 11 \\|' 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' 'docs/decisions/LOCATION_LEGAL_PLAN.md' 'handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md' -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/lib/eat-content-schema.ts' -TotalCount 260" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/tsconfig.json' -TotalCount 120" in C:\Users\assag\solution\website-exposure
 succeeded in 635ms:
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:21:| CWI-02 | minor | LegalDocument 별 cycle marker `LL-WORKFLOW-INTEGRATION` 명시 — plan § 8 작업 #11 정정 (4 entity + LegalDocument 분리 별 cycle) |
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:51:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"name=\\\"status\\\"|status'|status\\)|EatStatusSchema|PUBLICATION_STATUSES|LL-WORKFLOW-INTEGRATION|COMPLIANCE_WORKFLOW_INTEGRATION\" -S ." in C:\Users\assag\solution\website-exposure
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:664:- **LegalDocument**: clinic-profile 통합 form 안에 있어 별 cycle (LL-WORKFLOW-INTEGRATION marker)
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:695:- LegalDocument 별 cycle marker — clinic-profile 통합 form 안 5 LegalDocument 동시 다룸 → LL-WORKFLOW-INTEGRATION 신설 명시
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:723:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"WorkflowActionButtons|name=\\\"status\\\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md apps/web/src/components/forms/ArticleForm.tsx apps/web/src/components/forms/TreatmentPageForm.tsx apps/web/src/components/forms/FAQForm.tsx apps/web/src/components/forms/PublicationForm.tsx apps/web/src/components/forms/MediaAppearanceForm.tsx" in C:\Users\assag\solution\website-exposure
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:761:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|name=\"status\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument' 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' 'apps/web/src/components/forms/ArticleForm.tsx' 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx'" in C:\Users\assag\solution\website-exposure
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:818:docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:904:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md:2861:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'LL-WORKFLOW-INTEGRATION|LegalDocumentForm|6 entity form status|4 form status|작업 #11|\\| 11 \\|' 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' 'docs/decisions/LOCATION_LEGAL_PLAN.md' 'handoff/codex-reviews/compliance-workflow-integration-v1/cycle-2.out.md' -S" in C:\Users\assag\solution\website-exposure
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:668:### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:771:| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | **4 entity** form status read-only display + zod schema 정정 (CWI-01 정정 — status field 제거) | ArticleForm · FaqForm · TreatmentPageForm · PublicationForm · MediaAppearanceForm + eat-content-schema. **LegalDocument 는 별 cycle (LL-WORKFLOW-INTEGRATION marker)** — clinic-profile 통합 form 안 5 LegalDocument 동시 다룸 |
docs/decisions/LOCATION_LEGAL_PLAN.md:541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |

 succeeded in 650ms:
// @glitzy/web/lib/eat-content-schema — EAT_CONTENT_PLAN v1.0 § 4.3 EC-FORM-03
//
// Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
//
// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.

import { z } from "zod";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

// === 공통 helper ===

const requiredTrimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const optionalTrimmed = (max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, {
      message: `최대 ${max}자입니다.`,
    });

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isoDateRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => ISO_DATE_REGEX.test(v), { message: `${label}은(는) ISO 형식 (YYYY-MM-DD)` })
    .refine(
      (v) => {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m === null) return false;
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        const dt = new Date(Date.UTC(y, mo - 1, d));
        return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
      },
      { message: `${label}은(는) 실제 존재하는 날짜여야 합니다.` },
    );

const httpUrlRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^https?:\/\//.test(v), { message: `${label}은(는) http:// 또는 https:// 로 시작해야 합니다.` })
    .refine((v) => v.length <= 2048, { message: `${label}은(는) 2048자를 넘을 수 없습니다.` });

const httpUrlOptional = () =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "URL 은 http/https · 2048자",
    });

const uuidOptional = (label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: `${label}은(는) UUID 형식이어야 합니다.`,
    });

const intOptional = (min: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^[0-9]+$/.test(v), {
      message: `${label}은(는) 양의 정수`,
    })
    .refine((v) => v === null || v === undefined || Number(v) >= min, {
      message: `${label}은(는) ${min} 이상`,
    });

const intRequired = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^[0-9]+$/.test(v), { message: `${label}은(는) 양의 정수` })
    .refine((v) => {
      const n = Number(v);
      return n >= min && n <= max;
    }, { message: `${label}은(는) ${min}~${max}` });

// EC-FORM-02 + CWI-01 정정: status field 자체 form schema 에서 제거.
//   status 전이는 workflow action (submitForReview · publishContent) 만 변경.
//   save action 안 form 의 status 값 무시 + DB 안 current status 보존.
//   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
export const EatStatusSchema = z.enum(["draft"], {
  errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (deprecated · CWI-01 정정)" }),
});

// EC-FORM-03 (DOI anchored — DB CHECK 와 동일)
export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
export const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
export const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
export const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;

// === ArticleCategory ===

export const ArticleCategoryInputSchema = z.object({
  slug: requiredTrimmed(3, 64, "slug").refine((v) => SLUG_REGEX_SHORT.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~64자)",
  }),
  name: requiredTrimmed(1, 50, "이름"),
  description: optionalTrimmed(200).refine(
    (v) => v === null || v === undefined || v.length >= 80,
    { message: "설명은 입력 시 80~200자" },
  ),
  displayOrder: intRequired(0, 9999, "표시 순서"),
});

export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;

// === Publication ===

const authorsSchema = z
  .string({ required_error: "저자는 필수입니다." })
  .transform((v) => v.trim())
  .transform((v) =>
    v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  .refine((arr) => arr.length >= 1, { message: "저자는 1명 이상" })
  .refine((arr) => arr.every((s) => s.length <= 100), { message: "저자명은 100자 이내" });

export const PublicationInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  authors: authorsSchema,
  journal: optionalTrimmed(200),
  publishedDate: isoDateRequired("게재일"),
  doi: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || DOI_REGEX.test(v), {
      message: "DOI 형식 오류 (예: 10.1000/xyz123)",
    }),
  pubmedId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), {
      message: "PubMed ID 는 1~9 자리 숫자",
    }),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("저자(의료진)"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type PublicationInput = z.infer<typeof PublicationInputSchema>;

// === MediaAppearance ===

export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;

export const MediaAppearanceInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  channelName: requiredTrimmed(1, 100, "채널명"),
  channelType: z.enum(MEDIA_CHANNEL_TYPES, {
    errorMap: () => ({ message: "채널 종류는 broadcast/youtube/podcast/press 중 하나" }),
  }),
  publishedDate: isoDateRequired("게재일"),
  durationSeconds: intOptional(1, "길이(초)"),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("출연 의료진"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;

// === FAQ ===

export const FaqInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  question: requiredTrimmed(10, 200, "질문"),
  answer: requiredTrimmed(50, 2000, "답변"),
  displayOrder: intRequired(0, 9999, "표시 순서"),
  categoryId: uuidOptional("카테고리"),
  authorDoctorId: uuidOptional("작성자(의료진)"),
  relatedTreatmentId: uuidOptional("관련 진료 페이지"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type FaqInput = z.infer<typeof FaqInputSchema>;

 succeeded in 656ms:
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "allowJs": false,
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next"]
}

 succeeded in 674ms:
apps/web/src/lib/eat-content-schema.ts:4:// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
apps/web/src/lib/eat-content-schema.ts:6:// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.
apps/web/src/lib/eat-content-schema.ts:104:// EC-FORM-02 + CWI-01 정정: status field 자체 form schema 에서 제거.
apps/web/src/lib/eat-content-schema.ts:105://   status 전이는 workflow action (submitForReview · publishContent) 만 변경.
apps/web/src/lib/eat-content-schema.ts:106://   save action 안 form 의 status 값 무시 + DB 안 current status 보존.
apps/web/src/lib/eat-content-schema.ts:107://   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
apps/web/src/lib/eat-content-schema.ts:108:export const EatStatusSchema = z.enum(["draft"], {
apps/web/src/lib/eat-content-schema.ts:109:  errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (deprecated · CWI-01 정정)" }),
apps/web/src/lib/eat-content-schema.ts:178:  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
apps/web/src/lib/eat-content-schema.ts:202:  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
apps/web/src/lib/eat-content-schema.ts:219:  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:20:const PUBLICATION_STATUSES = [
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:45:  // CWI-01 정정: status field 제거 — workflow action 만 status 전이. form FormData 안 status 미포함.
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:93:      // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:94:      //   saveTreatmentPage 은 본문 / metadata 만 갱신 — 현재 row status 보존.
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:97:        const beforeRows = await tx<{ id: string; status: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:98:          SELECT id, status::text AS status FROM treatment_page
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:103:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:121:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:128:          'draft'::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:146:          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:147:          payload: { contentType: "TreatmentPage", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:19:const PUBLICATION_STATUSES = [
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:44:  // CWI-01 정정: status field 제거 — workflow action 만 status 전이. form FormData 안 status 미포함.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:112:      // CAMC-12 정정: locked row 의 current status 보관 (audit payload 용).
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:113:      //   parsed.data.status 는 form readonly · 변조 가능 — DB 진실 보존.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:118:        const beforeRows = await tx<{ id: string; status: string; author_doctor_id: string | null; category_id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:119:          SELECT id, status::text AS status, author_doctor_id, category_id FROM article
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:126:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:175:        // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:176:        //   saveArticle 은 본문 / metadata 만 갱신 — 현재 row status 보존.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:196:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:203:          'draft'::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:235:          // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:236:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'tsconfig.base.json' -TotalCount 160" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|contentType=|currentStatus=|<.*Form|return \\(' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx' -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'name=\"status\"' apps/web/src/components/forms -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'status:\\s*EatStatusSchema|EatStatusSchema' apps/web/src -S" in C:\Users\assag\solution\website-exposure
 succeeded in 636ms:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}

 succeeded in 648ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:103:  return (
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:109:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:111:        contentType="MediaAppearance"
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:113:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:115:      <MediaAppearanceForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:116:      <DeleteForm action={boundDelete} confirmMessage="정말 이 미디어 출연을 삭제하시겠습니까?" />
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:105:  return (
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:111:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:113:        contentType="Publication"
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:115:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:117:      <PublicationForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:118:      <DeleteForm action={boundDelete} confirmMessage="정말 이 학술 인용을 삭제하시겠습니까?" />
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:108:  return (
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:114:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:116:        contentType="FAQ"
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:118:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:120:      <FaqForm
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:128:      <DeleteForm action={boundDelete} confirmMessage="정말 이 FAQ 를 삭제하시겠습니까?" />
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:82:  return (
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:89:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:91:        contentType="TreatmentPage"
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:93:        currentStatus={initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:96:      <TreatmentPageForm action={boundSave} initial={initial} isNew={false} />
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:98:      <DeleteForm action={boundDelete} confirmMessage="정말 이 시술 페이지를 삭제하시겠습니까?" />
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:115:  return (
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:122:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:124:        contentType="Article"
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:126:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:129:      <ArticleForm
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:137:      <DeleteForm action={boundDelete} confirmMessage="정말 이 아티클을 삭제하시겠습니까?" />

 succeeded in 678ms:
apps/web/src\lib\eat-content-schema.ts:107://   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
apps/web/src\lib\eat-content-schema.ts:108:export const EatStatusSchema = z.enum(["draft"], {
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:130:  //   여기서는 zod schema EatStatusSchema 가 draft 만 허용함을 검증.
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:133:    const r1 = mod.EatStatusSchema.safeParse("draft");
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:134:    const r2 = mod.EatStatusSchema.safeParse("published");

2026-05-18T10:57:46.546338Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 684ms:
codex
CWI-01의 핵심 경로는 닫힌 것으로 보입니다: status input `name` 제거, schema status 제거, update status 보존, insert draft, audit currentStatus 사용이 맞습니다. 마지막으로 타입/테스트 수준에서 이 변경 때문에 즉시 드러나는 회귀가 있는지 가볍게 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/package.json' -TotalCount 180" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'PUBLICATION_STATUSES|STATUS_OPTIONS' apps/web/src/components/forms apps/web/src/app/(admin)/admin -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'status\\s*=' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' -S" in C:\Users\assag\solution\website-exposure
 succeeded in 594ms:
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
    "seed": "tsx --env-file=.env src/seed.ts",
    "test:scenarios": "vitest run"
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
    "vitest": "^2.1.8",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

 succeeded in 567ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:52:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:126:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:103:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:2://   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:53:          beforeStatus = beforeRows[0]!.status;

2026-05-18T10:57:57.278350Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … PTIONS' apps/web/src/components/forms apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 739ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … PTIONS' apps/web/src/components/forms apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 2344ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' | Select-Object -Skip 660 -First 45" in C:\Users\assag\solution\website-exposure
 succeeded in 572ms:

detail page:
- 콘텐츠 본문 미리보기 (read-only)
- ComplianceRecord 슬롯 표시 (operator·medical·legal — 각 슬롯의 reviewer 이름 + timestamp)
- 본인 역할에 한해 approve/reject 폼 노출 (assertReviewerEligibility flag 확인)
- 거부 사유 textarea (50자 이상 required)

### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정

form 안 `status` field 는:
- 현재 row 의 status 표시 만 (read-only badge — `<span>` 또는 disabled `<select>`)
- 사용자 직접 status 변경 불가 — 모든 status 전이는 workflow action 버튼 통해서만
- 기존 save action (`saveArticle` 등) 안 status field 무시 — 서버 측에서 current row.status 보존 (form FormData 안 status 값 무시)
- assertTransitionAllowed 검증은 workflow action 안 수행

### 5.3 entity edit page 안 액션 버튼 (CA-UI-03)

각 edit page 안 추가 버튼:
- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
- "검수 큐 진입" 후에는 form 자체 read-only — 검수자 액션은 /review-queue/{entryId} 에서

## 6. server action 결정 — CAM-17·20 정정

### 6.1 4 server action 시그니처 (CA-ACTION-01)

`apps/web/src/lib/compliance/transitions.ts` (helper) + entity별 actions.ts 안 thin wrapper.

```typescript
// transitions.ts
export async function submitForReview(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string,
  contentRow: { id: string; status: string; risk_level?: string | null },
): Promise<{ recordId: string; entryId: string }>;

// CAM-17 정정 — approve 첫 호출이 atomic open→in-progress + status review-queued→in-review 동시 전이.
//   재approve 시 status=in-review 유지.
export async function approveContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, role: ApproverRole, actorUserId: string,
): Promise<{ allApproved: boolean; entryStatus: "in-progress" | "resolved" }>;

export async function rejectContent(
  tx: TransactionSql, ctx: TenantContext,

codex
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=2 → cycle2=0

## cycle 1 patch 검증
- CWI-01: PASS — 5 form 모두 status input `name` 제거, action/zod schema status 제거, save는 currentStatus 보존 + 신규 draft 강제 확인.
- CWI-02: PASS — plan §8 작업 #11이 4 entity + LegalDocument 별 cycle `LL-WORKFLOW-INTEGRATION` marker로 정정됨.

## new findings (있을 경우)
없음.

## acceptance 판정
ACCEPT. 새 blocking/major 없음. `pnpm --filter @glitzy/web typecheck` 통과.
tokens used
105,377
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=2 → cycle2=0

## cycle 1 patch 검증
- CWI-01: PASS — 5 form 모두 status input `name` 제거, action/zod schema status 제거, save는 currentStatus 보존 + 신규 draft 강제 확인.
- CWI-02: PASS — plan §8 작업 #11이 4 entity + LegalDocument 별 cycle `LL-WORKFLOW-INTEGRATION` marker로 정정됨.

## new findings (있을 경우)
없음.

## acceptance 판정
ACCEPT. 새 blocking/major 없음. `pnpm --filter @glitzy/web typecheck` 통과.
