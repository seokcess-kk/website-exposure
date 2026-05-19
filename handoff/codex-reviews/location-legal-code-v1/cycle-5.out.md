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
session id: 019e3915-3f80-71f2-8006-4e0f12c8d383
--------
user
You are reviewing **cycle 5** of the LOCATION_LEGAL code review. Cycle 4 raised one minor (LLC-18 grep-clean residual) — 3 잔존이 모두 marker/history 인용이고 실질 회귀 없음. 본 cycle 은 marker/history exemption 의 정당성을 확인하고 acceptance 신호를 판정한다.

## "8단계" 잔존 3건의 성격 분류

| line | 위치 | 성격 | 보존 정당화 |
|---|---|---|---|
| 596 | § 10 LL-CASCADE-05 본문 의 `"8단계" → "9단계"` 인용 | **patch 자체의 인용** — 무엇이 바뀌었는지 명시 | 인용 부호 안 (`"8단계"`) — historical reference 명시 |
| 604 | v0.3 변경 이력 cycle2 LL-37 patch entry | **변경 이력 (history)** — 그 시점에는 8단계가 맞았다 | 변경 이력은 시간 순 보존이 SoT 규약 (각 row 가 그 시점 결정 SoT) |
| 609 | v1.1 변경 이력 LLC-15/LLC-18 entry | **변경 이력 (history)** — LLC-15 의 patch summary 인용 | 동일 — 변경 이력 보존 |

## 본 cycle 의 판정 기준

- LLC-18 의 의도는 **현행 SoT 의 "8단계" 표현 제거** (= 운영 시점 의존성 표 + manifest 주석).
- marker/history 의 인용·기록 보존은 변경 이력 SoT 의 정상 운영 — grep 0 조건이 marker/history 까지 강제하는 것은 cycle 4 prompt 의 형식적 조건이지 실질 회귀 사유가 아님.
- LL-CASCADE-01~05 모두 cycle 3·4 에서 PASS. 실 SoT (§ 6 9단계 + manifest 9 entry + 주석) 정합.
- 누계 수렴: 14 (cycle1) → 3 (cycle2) → 1 (cycle3) → 1 (cycle4: marker/history false-positive) → cycle5 acceptance 판정.

## What to check (cycle 5)

1. **marker/history exemption 정당성**:
   - § 10 LL-CASCADE-05 의 `"8단계"` 인용이 patch 의도를 정확히 전달하는가? (필요하면 backtick 인용 보강 가능)
   - v0.3 (604) · v1.1 (609) 변경 이력의 "8단계" 인용이 그 시점 결정의 historical SoT 인용인가?
   - 변경 이력 wording 자체를 무력화하면 SoT 의 시간순 보존 규약 (memory · cycle 운영 패턴) 과 충돌

2. **잔존 실질 회귀 없음 재확인**:
   - 운영 SoT (§ 6 9단계 표 + manifest.ts orderedMigrations + manifest.ts 주석) 모두 9단계
   - 코드 (actions.ts · schema.ts · errors.ts · ClinicProfileForm.tsx · page.tsx · migrations) 변경 없음 — cycle 1~3 patch 그대로 보존
   - 5 cascade PASS

3. **acceptance 신호**:
   - 본 cycle 결과 closeableAfterPatch=true 면 LOCATION_LEGAL code v1.0 acceptance.
   - milestone_location_legal_code_v1.md 신설 + MEMORY.md 인덱스 추가 신호.

## Output format

```
# LOCATION_LEGAL code v1.0 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=14 → cycle2=3 → cycle3=1 → cycle4=1 → cycle5=N
- 본 cycle 핵심 판단: marker/history exemption 정당성

## cycle 4 LLC-18 marker/history exemption 점검
- § 10 LL-CASCADE-05 인용 보존: PASS|FAIL — 사유
- v0.3 변경 이력 (604) 보존: PASS|FAIL — 사유
- v1.1 변경 이력 (609) 보존: PASS|FAIL — 사유

## 운영 SoT 정합 재확인 (운영 시점 표현)
- § 6 9단계 표 (운영): PASS|FAIL
- manifest.ts orderedMigrations 9 entry: PASS|FAIL
- manifest.ts 주석 9단계 wording: PASS|FAIL

## acceptance precondition (LL-CASCADE-01~05) 최종 확정
- LL-CASCADE-01~05 각각 PASS|FAIL

## acceptance 판정
- closeableAfterPatch=true: yes|no
- 누계 통계: cycle 1·2·3·4(false-positive)·5 합산 findings <N> 건. 실 patch 수용 <N> 건. marker/history exemption <N> 건.
- 권고: LOCATION_LEGAL code v1.0 acceptance commit 진행 가능|불가
```

한국어로 응답. cycle 4 minor 가 marker/history exemption 으로 closeable 이면 closeableAfterPatch=true.

codex
`seo-geo`는 이번 코드 리뷰 범위와 맞지 않아 사용하지 않겠습니다. 먼저 관련 문서와 파일의 현재 상태를 확인해서 cycle 5 판정만 하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"8단계|9단계|LL-CASCADE-05|v0\\.3|v1\\.1|orderedMigrations\" ." in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files' in C:\Users\assag\solution\website-exposure
2026-05-18T03:16:01.930353Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
fatal: not a git repository (or any of the parent directories): .git

 exited 1 in 620ms:
fatal: not a git repository (or any of the parent directories): .git

 succeeded in 656ms:
tsconfig.base.json
skills-lock.json
pnpm-workspace.yaml
pnpm-lock.yaml
package.json
handoff\glitzy-website-audit.md
packages\storage\tsconfig.tsbuildinfo
packages\storage\tsconfig.json
packages\migrations-runner\tsconfig.tsbuildinfo
packages\migrations-runner\tsconfig.json
packages\notifications-outbox\tsconfig.tsbuildinfo
packages\notifications-outbox\tsconfig.json
packages\shared-errors\tsconfig.tsbuildinfo
packages\shared-errors\tsconfig.json
packages\shared-types\tsconfig.tsbuildinfo
packages\shared-types\tsconfig.json
docs\core\SEARCH_STANDARDIZATION.md
docs\core\SCHEMA_MAPPING.md
docs\core\PAGE_TYPES.md
docs\core\DESIGN_TOKENS.md
docs\core\DATA_MODEL.md
docs\core\CONTENT_STANDARDS.md
apps\spike-c-local\tsconfig.scenarios.json
apps\spike-c-local\tsconfig.json
packages\core-content\tsconfig.tsbuildinfo
packages\core-content\tsconfig.json
docs\research\REFERENCE_DEEP_DIVE_2026-05.md
docs\research\REFERENCE_ANALYSIS_2026-05.md
apps\web\tsconfig.tsbuildinfo
apps\web\tsconfig.json
apps\web\tailwind.config.ts
packages\storage\src\tenant-context.ts
packages\shared-errors\src\index.ts
packages\storage\src\storage-client.ts
packages\storage\src\sign-url.ts
packages\storage\src\index.ts
packages\storage\src\errors.ts
packages\storage\src\config.ts
packages\storage\src\audit-log.ts
packages\shared-errors\package.json
packages\storage\package.json
packages\migrations-runner\src\manifest.ts
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\notifications-outbox\src\provider-adapter.ts
packages\notifications-outbox\src\outbox.ts
packages\notifications-outbox\src\index.ts
packages\notifications-outbox\src\errors.ts
packages\notifications-outbox\package.json
packages\shared-types\src\index.ts
packages\shared-types\package.json
apps\spike-c-local\src\tenant-context.ts
apps\spike-c-local\src\storage-client.ts
apps\spike-c-local\src\sign-url.ts
apps\spike-c-local\src\seed.ts
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
docs\features\search-visibility.md
docs\features\notifications.md
docs\features\keyword-monitoring.md
docs\features\crm-sync.md
docs\features\content-migration.md
docs\features\compliance-assistant.md
docs\features\asset-ingestion.md
docs\features\analytics-reporting.md
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
docs\ARCHITECTURE.md
packages\db\tsconfig.tsbuildinfo
packages\db\tsconfig.json
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
packages\migrations-runner\dist\index.js.map
packages\migrations-runner\dist\index.js
packages\migrations-runner\dist\index.d.ts.map
packages\migrations-runner\dist\index.d.ts
docs\decisions\PROVIDER_PASS_PLAN.md
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md
docs\decisions\PACKAGES_STRUCTURE.md
docs\decisions\M0_SCHEMA_PLAN.md
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\INFRA_DECISIONS_DRAFT.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
packages\core-content\src\index.ts
packages\core-content\package.json
docs\admin\REVIEW_WORKFLOW.md
docs\admin\ARCHITECTURE.md
packages\core-content\src\templates\__tests__.ts
packages\core-content\src\templates\render.ts
packages\core-content\src\templates\index.ts
packages\core-content\src\templates\bodies.ts
packages\core-content\src\schema.ts
apps\web\src\types\react-dom-stable.d.ts
packages\db\src\tenant.ts
packages\db\src\service-role.ts
packages\db\src\index.ts
packages\db\src\errors.ts
packages\db\src\advisory-lock.ts
packages\db\package.json
packages\shared-errors\dist\index.js.map
packages\shared-errors\dist\index.js
packages\shared-errors\dist\index.d.ts.map
packages\shared-errors\dist\index.d.ts
packages\shared-types\dist\index.js.map
packages\shared-types\dist\index.js
packages\shared-types\dist\index.d.ts.map
packages\shared-types\dist\index.d.ts
apps\spike-c-local\docker-compose.yml
packages\db\migrations\D0010_instance.sql
apps\web\src\styles\globals.css
apps\web\src\seed.ts
apps\spike-c-local\dist\tenant-context.js
apps\spike-c-local\dist\storage-client.js
apps\spike-c-local\dist\sign-url.js
apps\spike-c-local\dist\seed.js
apps\spike-c-local\dist\fixtures.js
apps\spike-c-local\dist\errors.js
apps\spike-c-local\dist\env.js
apps\spike-c-local\dist\audit-log.js
packages\core-content\dist\templates\__tests__.js.map
packages\core-content\dist\templates\__tests__.js
packages\core-content\dist\templates\__tests__.d.ts.map
packages\core-content\dist\templates\__tests__.d.ts
packages\core-content\dist\templates\render.js.map
packages\core-content\dist\templates\render.js
packages\core-content\dist\templates\render.d.ts.map
packages\core-content\dist\templates\render.d.ts
packages\core-content\dist\templates\index.js.map
packages\core-content\dist\templates\index.js
packages\core-content\dist\templates\index.d.ts.map
packages\core-content\dist\templates\index.d.ts
packages\core-content\dist\templates\bodies.js.map
packages\core-content\dist\templates\bodies.js
packages\core-content\dist\templates\bodies.d.ts.map
packages\core-content\dist\templates\bodies.d.ts
packages\core-content\dist\schema.js.map
packages\core-content\dist\schema.js
packages\core-content\dist\schema.d.ts.map
packages\core-content\dist\schema.d.ts
packages\core-content\dist\index.js.map
packages\core-content\dist\index.js
packages\core-content\dist\index.d.ts.map
packages\core-content\dist\index.d.ts
packages\db\dist\tenant.js.map
packages\db\dist\tenant.js
packages\db\dist\tenant.d.ts.map
packages\db\dist\tenant.d.ts
packages\db\dist\service-role.js.map
packages\db\dist\service-role.js
packages\db\dist\service-role.d.ts.map
packages\db\dist\service-role.d.ts
packages\db\dist\index.js.map
packages\db\dist\index.js
packages\db\dist\index.d.ts.map
packages\db\dist\index.d.ts
packages\db\dist\errors.js.map
packages\db\dist\errors.js
packages\db\dist\errors.d.ts.map
packages\db\dist\errors.d.ts
packages\db\dist\advisory-lock.js.map
packages\db\dist\advisory-lock.js
packages\db\dist\advisory-lock.d.ts.map
packages\db\dist\advisory-lock.d.ts
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
apps\spike-a\tsconfig.json
packages\notifications-outbox\dist\provider-adapter.js.map
packages\notifications-outbox\dist\provider-adapter.js
packages\notifications-outbox\dist\provider-adapter.d.ts.map
packages\notifications-outbox\dist\provider-adapter.d.ts
packages\notifications-outbox\dist\outbox.js.map
packages\notifications-outbox\dist\outbox.js
packages\notifications-outbox\dist\outbox.d.ts.map
packages\notifications-outbox\dist\outbox.d.ts
packages\notifications-outbox\dist\index.js.map
packages\notifications-outbox\dist\index.js
packages\notifications-outbox\dist\index.d.ts.map
packages\notifications-outbox\dist\index.d.ts
packages\notifications-outbox\dist\errors.js.map
packages\notifications-outbox\dist\errors.js
packages\notifications-outbox\dist\errors.d.ts.map
packages\notifications-outbox\dist\errors.d.ts
apps\spike-b\package.json
apps\spike-b\tsconfig.json
packages\storage\dist\tenant-context.js.map
packages\storage\dist\tenant-context.js
packages\storage\dist\tenant-context.d.ts.map
packages\storage\dist\tenant-context.d.ts
packages\storage\dist\storage-client.js.map
packages\storage\dist\storage-client.js
packages\storage\dist\storage-client.d.ts.map
packages\storage\dist\storage-client.d.ts
packages\storage\dist\sign-url.js.map
packages\storage\dist\sign-url.js
packages\storage\dist\sign-url.d.ts.map
packages\storage\dist\sign-url.d.ts
packages\storage\dist\index.js.map
packages\storage\dist\index.js
packages\storage\dist\index.d.ts.map
packages\storage\dist\index.d.ts
packages\storage\dist\errors.js.map
packages\storage\dist\errors.js
packages\storage\dist\errors.d.ts.map
packages\storage\dist\errors.d.ts
packages\storage\dist\config.js.map
packages\storage\dist\config.js
packages\storage\dist\config.d.ts.map
packages\storage\dist\config.d.ts
packages\storage\dist\audit-log.js.map
packages\storage\dist\audit-log.js
packages\storage\dist\audit-log.d.ts.map
packages\storage\dist\audit-log.d.ts
apps\spike-b\docker-compose.yml
packages\auth\tsconfig.tsbuildinfo
packages\auth\tsconfig.json
apps\spike-b\PROVIDER_RUNBOOK.md
apps\spike-b\README.md
apps\spike-a\src\db.ts
apps\spike-a\src\tenant.ts
apps\spike-a\src\service-role.ts
apps\spike-a\src\seed.ts
apps\spike-a\src\schema.ts
apps\spike-e\tsconfig.scenarios.json
apps\spike-e\tsconfig.json
apps\spike-b\src\worker.ts
apps\spike-b\src\tenant.ts
apps\spike-b\src\seed.ts
apps\spike-d\tsconfig.scenarios.json
apps\spike-d\tsconfig.json
packages\auth\src\session.ts
packages\auth\src\resolve-tenant-context.ts
packages\auth\src\magic-link.ts
apps\spike-b\migrations\007_provider_attempt_log.sql
apps\spike-b\migrations\006_permanent_alert.sql
apps\spike-b\migrations\005_invariant_log.sql
apps\spike-b\migrations\004_external_call_log.sql
apps\spike-b\migrations\003_inbox.sql
apps\spike-b\migrations\002_outbox.sql
apps\spike-b\migrations\001_roles.sql
apps\spike-a\package.json
apps\spike-a\scripts\wait-db.js
apps\spike-a\README.md
apps\spike-a\PROVIDER_RUNBOOK.md
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
apps\web\next.config.mjs
apps\web\next-env.d.ts
apps\spike-e\src\session.ts
apps\spike-e\src\seed.ts
apps\spike-b\src\scenarios\test-stale-reclaim.ts
apps\spike-b\src\scenarios\test-rls-mismatch.ts
apps\spike-b\src\scenarios\test-retry-permanent.ts
apps\spike-b\src\scenarios\test-no-cross-tenant.ts
apps\spike-b\src\scenarios\test-invariant-runner.ts
apps\spike-b\src\scenarios\test-idempotency.ts
apps\spike-b\src\scenarios\test-failure-injection.ts
apps\spike-b\src\scenarios\test-basic-100.ts
apps\spike-b\src\scenarios\provider-smoke.ts
apps\spike-b\src\outbox.ts
apps\spike-b\src\migrate.ts
apps\spike-b\src\fixtures.ts
apps\spike-b\src\fake-provider.ts
apps\spike-b\src\failure-injection.ts
apps\spike-b\src\errors.ts
apps\spike-b\src\db.ts
apps\spike-d\src\service-role.ts
apps\web\README.md
apps\web\postcss.config.mjs
apps\web\package.json
packages\auth\src\internal\session-internal.ts
packages\auth\src\index.ts
packages\auth\src\errors.ts
packages\auth\src\config.ts
packages\auth\src\audit.ts
packages\auth\package.json
apps\spike-a\pgbouncer\userlist.txt
apps\spike-a\pgbouncer\pgbouncer.ini
apps\spike-d\drizzle.config.ts
apps\spike-d\docker-compose.yml
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\components\forms\Field.tsx
apps\web\src\components\forms\DoctorProfileForm.tsx
apps\web\src\components\forms\DeleteForm.tsx
apps\web\src\components\forms\ClinicProfileForm.tsx
apps\web\src\components\forms\ArticleForm.tsx
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
apps\spike-e\src\scenarios\test-super-admin-switch.ts
apps\spike-e\src\scenarios\test-session-refresh.ts
apps\spike-e\src\scenarios\test-rls-integration.ts
apps\spike-e\src\scenarios\test-membership-removal.ts
apps\spike-e\src\scenarios\test-magic-link-login.ts
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
apps\spike-e\src\scenarios\test-invariant.ts
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
apps\spike-e\src\errors.ts
apps\spike-e\src\env.ts
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
apps\spike-d\src\migrate.ts
apps\spike-d\src\errors.ts
apps\spike-d\src\env.ts
apps\spike-d\src\drift-check.ts
apps\spike-d\src\db\schema.ts
apps\spike-d\src\db\client.ts
apps\spike-d\package.json
apps\spike-e\docker-compose.yml
apps\spike-e\PROVIDER_RUNBOOK.md
apps\spike-e\package.json
apps\spike-d\docker\init-multi-db.sh
apps\spike-e\src\audit.ts
apps\web\src\app\page.tsx
apps\web\src\app\layout.tsx
apps\web\src\components\dev\MockMailbox.tsx
apps\spike-e\src\db\client.ts
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
apps\web\src\app\sign-out\route.ts
apps\spike-a\docker-compose.yml
apps\spike-e\migrations\005_rls_test_table.sql
apps\spike-e\migrations\004_audit_event.sql
apps\spike-e\migrations\003_auth_session.sql
apps\spike-e\migrations\002_admin_user.sql
apps\spike-e\migrations\001_roles_extensions.sql
apps\web\src\app\sign-in\page.tsx
packages\auth\dist\index.js
packages\auth\dist\index.d.ts.map
packages\auth\dist\index.d.ts
packages\auth\dist\errors.js.map
packages\auth\dist\errors.js
packages\auth\dist\errors.d.ts.map
packages\auth\dist\errors.d.ts
packages\auth\dist\config.js.map
packages\auth\dist\config.js
packages\auth\dist\config.d.ts.map
packages\auth\dist\config.d.ts
packages\auth\dist\audit.js.map
packages\auth\dist\audit.js
packages\auth\dist\audit.d.ts.map
packages\auth\dist\audit.d.ts
packages\auth\dist\resolve-tenant-context.d.ts
packages\auth\dist\magic-link.js.map
packages\auth\dist\magic-link.js
packages\auth\dist\magic-link.d.ts.map
packages\auth\dist\magic-link.d.ts
packages\auth\dist\session.js.map
packages\auth\dist\session.js
packages\auth\dist\session.d.ts.map
packages\auth\dist\session.d.ts
packages\auth\dist\resolve-tenant-context.js.map
packages\auth\dist\resolve-tenant-context.js
packages\auth\dist\resolve-tenant-context.d.ts.map
apps\web\src\app\sign-in\actions.ts
packages\auth\dist\index.js.map
apps\spike-a\migrations\004_invariant_log.sql
apps\spike-a\migrations\003_audit_log.sql
apps\spike-a\migrations\002_content_test.sql
apps\spike-a\migrations\001_roles.sql
apps\web\src\app\(admin)\layout.tsx
apps\web\scripts\local-pass.ts
apps\web\src\app\api\site-meta-fetch\route.ts
apps\web\src\app\sign-in\consume\route.ts
apps\web\src\app\sign-in\cleanup\route.ts
packages\auth\dist\internal\session-internal.d.ts.map
packages\auth\dist\internal\session-internal.d.ts
packages\auth\dist\internal\session-internal.js
packages\auth\dist\internal\session-internal.js.map
apps\web\src\app\api\health\route.ts
apps\web\src\app\(admin)\[instanceSlug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\[instanceSlug]\articles\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\doctors\new\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\[instanceSlug]\articles\new\page.tsx

 succeeded in 680ms:
.\docs\research\REFERENCE_ANALYSIS_2026-05.md:261:### 5.2 PAGE_TYPES.md v0.3 (별도 갱신)
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:3:## "8단계" 잔존 3건의 성격 분류
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:7:| 596 | § 10 LL-CASCADE-05 본문 의 `"8단계" → "9단계"` 인용 | **patch 자체의 인용** — 무엇이 바뀌었는지 명시 | 인용 부호 안 (`"8단계"`) — historical reference 명시 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:8:| 604 | v0.3 변경 이력 cycle2 LL-37 patch entry | **변경 이력 (history)** — 그 시점에는 8단계가 맞았다 | 변경 이력은 시간 순 보존이 SoT 규약 (각 row 가 그 시점 결정 SoT) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:9:| 609 | v1.1 변경 이력 LLC-15/LLC-18 entry | **변경 이력 (history)** — LLC-15 의 patch summary 인용 | 동일 — 변경 이력 보존 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:13:- LLC-18 의 의도는 **현행 SoT 의 "8단계" 표현 제거** (= 운영 시점 의존성 표 + manifest 주석).
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:15:- LL-CASCADE-01~05 모두 cycle 3·4 에서 PASS. 실 SoT (§ 6 9단계 + manifest 9 entry + 주석) 정합.
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:21:   - § 10 LL-CASCADE-05 의 `"8단계"` 인용이 patch 의도를 정확히 전달하는가? (필요하면 backtick 인용 보강 가능)
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:22:   - v0.3 (604) · v1.1 (609) 변경 이력의 "8단계" 인용이 그 시점 결정의 historical SoT 인용인가?
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:26:   - 운영 SoT (§ 6 9단계 표 + manifest.ts orderedMigrations + manifest.ts 주석) 모두 9단계
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:46:- § 10 LL-CASCADE-05 인용 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:47:- v0.3 변경 이력 (604) 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:48:- v1.1 변경 이력 (609) 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:51:- § 6 9단계 표 (운영): PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:52:- manifest.ts orderedMigrations 9 entry: PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md:53:- manifest.ts 주석 9단계 wording: PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:16:## "8단계" 잔존 3건의 성격 분류
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:20:| 596 | § 10 LL-CASCADE-05 본문 의 `"8단계" → "9단계"` 인용 | **patch 자체의 인용** — 무엇이 바뀌었는지 명시 | 인용 부호 안 (`"8단계"`) — historical reference 명시 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:21:| 604 | v0.3 변경 이력 cycle2 LL-37 patch entry | **변경 이력 (history)** — 그 시점에는 8단계가 맞았다 | 변경 이력은 시간 순 보존이 SoT 규약 (각 row 가 그 시점 결정 SoT) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:22:| 609 | v1.1 변경 이력 LLC-15/LLC-18 entry | **변경 이력 (history)** — LLC-15 의 patch summary 인용 | 동일 — 변경 이력 보존 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:26:- LLC-18 의 의도는 **현행 SoT 의 "8단계" 표현 제거** (= 운영 시점 의존성 표 + manifest 주석).
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:28:- LL-CASCADE-01~05 모두 cycle 3·4 에서 PASS. 실 SoT (§ 6 9단계 + manifest 9 entry + 주석) 정합.
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:34:   - § 10 LL-CASCADE-05 의 `"8단계"` 인용이 patch 의도를 정확히 전달하는가? (필요하면 backtick 인용 보강 가능)
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:35:   - v0.3 (604) · v1.1 (609) 변경 이력의 "8단계" 인용이 그 시점 결정의 historical SoT 인용인가?
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:39:   - 운영 SoT (§ 6 9단계 표 + manifest.ts orderedMigrations + manifest.ts 주석) 모두 9단계
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:59:- § 10 LL-CASCADE-05 인용 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:60:- v0.3 변경 이력 (604) 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:61:- v1.1 변경 이력 (609) 보존: PASS|FAIL — 사유
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:64:- § 6 9단계 표 (운영): PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:65:- manifest.ts orderedMigrations 9 entry: PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:66:- manifest.ts 주석 9단계 wording: PASS|FAIL
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:82:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"8단계|9단계|LL-CASCADE-05|v0\\.3|v1\\.1|orderedMigrations\" ." in C:\Users\assag\solution\website-exposure
.\docs\features\search-visibility.md:561:| SV-06b | artifact blob storage IAM policy 예시·운영 role 구체화 (provider=s3는 v0.3 결정) | 인프라 결정 (SV3-10 분리) |
.\docs\features\search-visibility.md:573:| ~~SV-10~~ | backlink provider 변경 baseline reset | v0.3 — `providerSeriesSeparated=true` 기본 + `baselineWarmupPolls=2` 정책. v1.0 마감 시 closure (SV3-10) |
.\docs\features\search-visibility.md:584:| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:1:You are reviewing **cycle 4** of the LOCATION_LEGAL code review. Cycle 3 had 1 minor finding (LLC-18) — "8단계" stale wording in plan § 10 LL-CASCADE-05 and manifest comment. Both were patched.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:5:- `docs/decisions/LOCATION_LEGAL_PLAN.md` § 10 LL-CASCADE-05: "8단계" → "9단계" stale wording 정정 + v1.1 LLC-18 marker
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:6:- `packages/migrations-runner/src/manifest.ts` 주석: "8단계 + C0003 doctor_profile" → "9단계 (C0003 doctor_profile 포함)"
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:7:- plan 변경 이력 v1.1 entry 갱신: cycle 3 LLC-18 추가 (누계 14→3→1)
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:12:1. `docs/decisions/LOCATION_LEGAL_PLAN.md:596` 인근 — § 10 LL-CASCADE-05 본문
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:13:2. `packages/migrations-runner/src/manifest.ts:23` 인근 — orderedMigrations 위 주석
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:15:추가로 plan 전체 검색에서 "8단계" 잔존이 없는지 확인 (단순 grep `8단계` 결과).
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:20:   - plan § 10 LL-CASCADE-05: "8단계" → "9단계" 정정 완료?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:21:   - manifest.ts 주석: "8단계" → "9단계" 정정 완료?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:22:   - plan 전체에서 "8단계" 잔존 grep 결과 0?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md:42:## "8단계" 잔존 grep
.\docs\features\notifications.md:713:| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
.\docs\features\notifications.md:715:| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
.\docs\features\notifications.md:717:| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
.\docs\features\notifications.md:718:| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
.\docs\features\notifications.md:730:| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:14:You are reviewing **cycle 4** of the LOCATION_LEGAL code review. Cycle 3 had 1 minor finding (LLC-18) — "8단계" stale wording in plan § 10 LL-CASCADE-05 and manifest comment. Both were patched.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:18:- `docs/decisions/LOCATION_LEGAL_PLAN.md` § 10 LL-CASCADE-05: "8단계" → "9단계" stale wording 정정 + v1.1 LLC-18 marker
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:19:- `packages/migrations-runner/src/manifest.ts` 주석: "8단계 + C0003 doctor_profile" → "9단계 (C0003 doctor_profile 포함)"
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:20:- plan 변경 이력 v1.1 entry 갱신: cycle 3 LLC-18 추가 (누계 14→3→1)
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:25:1. `docs/decisions/LOCATION_LEGAL_PLAN.md:596` 인근 — § 10 LL-CASCADE-05 본문
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:26:2. `packages/migrations-runner/src/manifest.ts:23` 인근 — orderedMigrations 위 주석
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:28:추가로 plan 전체 검색에서 "8단계" 잔존이 없는지 확인 (단순 grep `8단계` 결과).
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:33:   - plan § 10 LL-CASCADE-05: "8단계" → "9단계" 정정 완료?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:34:   - manifest.ts 주석: "8단계" → "9단계" 정정 완료?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:35:   - plan 전체에서 "8단계" 잔존 grep 결과 0?
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:55:## "8단계" 잔존 grep
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:69:요청 범위가 명확하니 해당 두 위치와 `8단계` 잔존만 확인하겠습니다. 먼저 파일 주변부와 grep 결과를 병렬로 읽어 검증하겠습니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:71:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "8단계" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:77:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:78:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:79:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:92:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:100:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:101:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:102:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:105:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:115: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:118:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:139:  - `LOCATION_LEGAL_PLAN.md:596` LL-CASCADE-05 본문은 `9단계 의존성 표`로 정정됨.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:140:  - `manifest.ts` orderedMigrations 주석도 `의존성 9단계 (C0003 doctor_profile 포함)`으로 정정됨.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:141:  - 다만 요청된 단순 grep 기준에서 plan 내 `"8단계"` 잔존이 3건 있어 “grep 결과 0” 조건은 미충족.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:143:## "8단계" 잔존 grep
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:145:  - `LOCATION_LEGAL_PLAN.md:596` — LLC-18 marker 설명 내 `"8단계" → "9단계"`
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:146:  - `LOCATION_LEGAL_PLAN.md:604` — v0.3 변경 이력의 과거 기록
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:147:  - `LOCATION_LEGAL_PLAN.md:609` — v1.1 변경 이력의 LLC-15/LLC-18 설명
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:154:- LL-CASCADE-05: PASS — 운영 본문과 manifest 주석은 9단계로 정합
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:158:- 사유: 새 실질 설계 불일치는 없지만, cycle 4 명시 조건인 plan 전체 `"8단계"` grep 결과 0을 만족하지 못함.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:159:- 권고: 과거 변경 이력/marker의 `"8단계"` 표현까지 grep-clean 하게 재문구화한 뒤 acceptance commit 진행.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:171:  - `LOCATION_LEGAL_PLAN.md:596` LL-CASCADE-05 본문은 `9단계 의존성 표`로 정정됨.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:172:  - `manifest.ts` orderedMigrations 주석도 `의존성 9단계 (C0003 doctor_profile 포함)`으로 정정됨.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:173:  - 다만 요청된 단순 grep 기준에서 plan 내 `"8단계"` 잔존이 3건 있어 “grep 결과 0” 조건은 미충족.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:175:## "8단계" 잔존 grep
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:177:  - `LOCATION_LEGAL_PLAN.md:596` — LLC-18 marker 설명 내 `"8단계" → "9단계"`
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:178:  - `LOCATION_LEGAL_PLAN.md:604` — v0.3 변경 이력의 과거 기록
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:179:  - `LOCATION_LEGAL_PLAN.md:609` — v1.1 변경 이력의 LLC-15/LLC-18 설명
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:186:- LL-CASCADE-05: PASS — 운영 본문과 manifest 주석은 9단계로 정합
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:190:- 사유: 새 실질 설계 불일치는 없지만, cycle 4 명시 조건인 plan 전체 `"8단계"` grep 결과 0을 만족하지 못함.
.\handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md:191:- 권고: 과거 변경 이력/marker의 `"8단계"` 표현까지 grep-clean 하게 재문구화한 뒤 acceptance commit 진행.
.\docs\features\keyword-monitoring.md:493:본 Feature는 v0.1 초안과 v0.2/v0.3 정규화 사이 데이터 모델 변경이 있음 — v1.0 이전 운영 데이터가 있는 인스턴스는 다음 migration 적용:
.\docs\features\keyword-monitoring.md:509:       toVersion: "v0.3",
.\docs\features\keyword-monitoring.md:529:신규 인스턴스(v0.3 이후 만들어진 인스턴스)는 본 migration 불필요.
.\docs\features\keyword-monitoring.md:711:| 2026-05-14 | v0.3 | codex 2차 (9 지적 전건 수용)
.\docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:1:You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md`. This is **cycle 3** — cycle 2 had 3 findings (blocking=0, major=2, minor=1). All 3 were patched by updating the plan to **v1.1** (the patch direction was plan SoT correction, not code change).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:7:| LLC-15 | major | plan § 6 8단계 vs manifest 9단계 불일치 | plan § 6 migration 의존성 표를 9단계로 갱신 (C0003 doctor_profile 추가 + 명시적 사유) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:9:| LLC-17 | minor | § 4.4 LL-ACTION-18 fallback payload `failedDetails[]` 미반영 | § 4.4 LL-ACTION-18 의 fallback payload 설명에 `failedDetails: [{target, code, name, message}]` 추가 + v1.1 patch marker |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:11:또한 plan 변경 이력에 **v1.1 entry** 추가 (2026-05-18).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:16:- `docs/decisions/LOCATION_LEGAL_PLAN.md` — v1.1 entry, § 4.4 LL-ACTION-18, § 6 9단계, § 7 시나리오 15, § 9.1 LL-DEFER-21
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:37:   - LLC-15: plan § 6 의 9단계와 manifest 9단계가 entry-by-entry 일치
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md:42:   - 새 patch 가 plan 내 다른 § 와 충돌? (예: LL-CASCADE-05 본문이 "8단계" 라고 못박는 곳이 또 있는지 — § 10)
.\docs\features\crm-sync.md:712:### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)
.\docs\features\crm-sync.md:1287:| 2026-05-14 | v0.3 | codex 2차 17 지적 반영 |
.\docs\features\crm-sync.md:1380:#### 13.4.1 worker SoT 풀 SQL (search-visibility § 13.5 패턴 9단계)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:14:You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md`. This is **cycle 3** — cycle 2 had 3 findings (blocking=0, major=2, minor=1). All 3 were patched by updating the plan to **v1.1** (the patch direction was plan SoT correction, not code change).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:20:| LLC-15 | major | plan § 6 8단계 vs manifest 9단계 불일치 | plan § 6 migration 의존성 표를 9단계로 갱신 (C0003 doctor_profile 추가 + 명시적 사유) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:22:| LLC-17 | minor | § 4.4 LL-ACTION-18 fallback payload `failedDetails[]` 미반영 | § 4.4 LL-ACTION-18 의 fallback payload 설명에 `failedDetails: [{target, code, name, message}]` 추가 + v1.1 patch marker |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:24:또한 plan 변경 이력에 **v1.1 entry** 추가 (2026-05-18).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:29:- `docs/decisions/LOCATION_LEGAL_PLAN.md` — v1.1 entry, § 4.4 LL-ACTION-18, § 6 9단계, § 7 시나리오 15, § 9.1 LL-DEFER-21
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:50:   - LLC-15: plan § 6 의 9단계와 manifest 9단계가 entry-by-entry 일치
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:55:   - 새 patch 가 plan 내 다른 § 와 충돌? (예: LL-CASCADE-05 본문이 "8단계" 라고 못박는 곳이 또 있는지 — § 10)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:90:검토 범위가 문서와 구현 정합성 중심이라 먼저 plan의 v1.1 변경 지점과 관련 코드/문서의 실제 라인을 함께 뽑아 대조하겠습니다. 그 다음 남아 있는 “8단계” 같은 회귀성 문구를 전체 검색으로 확인하겠습니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:92:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C000[0-9]|LL-DEFER-21|tenant-resolve-denied|ForbiddenAccessPage|failedDetails|LL-ACTION-18|LL-CASCADE-0[1-5]|Next 15|8단계|9단계" packages apps docs/admin/ARCHITECTURE.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/core/CONTENT_STANDARDS.md docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:94:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v1\\.1|LL-ACTION-18|LL-DEFER-21|8단계|9단계|C0003|tenant-resolve-denied|ForbiddenAccessPage|failedDetails|LL-CASCADE-0[1-5]|LLC-12|Next 15|scenario|시나리오 15\" docs/decisions/LOCATION_LEGAL_PLAN.md" in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:96:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:97:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:99:321:- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:102:424:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:103:426:  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:107:497:- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:108:501:  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:109:518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:115:554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:121:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:123:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:124:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:125:606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:128:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~2) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 3건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. LL-CASCADE-05 manifest 9단계 정합. 코드 누계 cycle 2 회 (14→3) · 누계 17 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2 code review 14 + cycle 2 plan-cascade 3). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:155:packages\core-content\src\schema.ts:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:157:packages\core-content\src\schema.ts:123:    // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:195:packages\core-content\dist\schema.js:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:208:packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:209:packages\migrations-runner\src\index.ts:2:// SoT: memory/milestone_spike_d_local_pass.md · LOCATION_LEGAL_PLAN v1.0 § 6 · § 10 LL-CASCADE-05
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:210:packages\migrations-runner\src\manifest.ts:2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:211:packages\migrations-runner\src\manifest.ts:6:// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:213:packages\migrations-runner\src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.0 § 6 의존성 8단계 + C0003 doctor_profile.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:238:초기 검색상 v1.1 표식과 코드 주석은 대부분 원하는 지점에 들어가 있습니다. 다만 `LL-CASCADE-05` 본문에 “8단계 의존성 표”라는 오래된 문구가 남아 보여서, 실제 의미 충돌인지 단순 stale wording인지 주변 라인과 manifest를 대조하겠습니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:255:497:- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:259:501:  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:270:554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:279:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:349:2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:353:6:// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:355:8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:370:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.0 § 6 의존성 8단계 + C0003 doctor_profile.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:373:26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:457:125: *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:515:518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:517:424:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:519:426:  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:565:세부 대조 중 두 가지가 보입니다. 실제 manifest 배열은 9개 entry로 plan §6과 맞지만, 주석/§10에 “8단계” 표현이 남아 있습니다. 또한 시나리오 15의 audit emit은 `resolveTenantContext` 쪽 자동 emit과 page 주석의 “본 컴포넌트에서는 미수행”을 구분해서 판단해야 해서 관련 helper 라인을 확인합니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:986:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "8단계|의존성 8|의존성 순서|orderedMigrations|9단계|C0003 doctor_profile" docs packages/migrations-runner/src apps packages/core-content/src packages/core-content/migrations' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1048:66:      // future-proof — packages/auth v0.3 cascade 시 분기 추가
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1069:packages/migrations-runner/src\index.ts:15:export { orderedMigrations, validateManifest, type MigrationDescriptor } from "./manifest.js";
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1070:packages/migrations-runner/src\manifest.ts:8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1071:packages/migrations-runner/src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.0 § 6 의존성 8단계 + C0003 doctor_profile.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1072:packages/migrations-runner/src\manifest.ts:26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1073:packages/migrations-runner/src\manifest.ts:112:  for (const [i, m] of orderedMigrations.entries()) {
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1074:docs\features\crm-sync.md:712:### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1075:docs\features\crm-sync.md:1380:#### 13.4.1 worker SoT 풀 SQL (search-visibility § 13.5 패턴 9단계)
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1076:docs\features\compliance-assistant.md:607:| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1077:docs\decisions\LOCATION_LEGAL_PLAN.md:497:- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1078:docs\decisions\LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1079:docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1080:docs\decisions\LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~2) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 3건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. LL-CASCADE-05 manifest 9단계 정합. 코드 누계 cycle 2 회 (14→3) · 누계 17 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2 code review 14 + cycle 2 plan-cascade 3). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1204:- LLC-15: PASS — plan §6은 9단계로 갱신되어 `D0010 → C0001 → C0002 → C0003 → C0004 → C0005 → C0006 → C0007 → C0008` 순서가 명시됨: `LOCATION_LEGAL_PLAN.md:497-506`; manifest 실제 배열도 같은 9 entry 순서: `manifest.ts:26-101`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1210:### LLC-18 — minor — LL-CASCADE-05 및 manifest 주석에 “8단계” stale wording 잔존
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1211:- plan §6 SoT는 9단계로 갱신됨: `LOCATION_LEGAL_PLAN.md:497-506`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1212:- 하지만 §10 `LL-CASCADE-05` 본문은 아직 “본 plan 의 8단계 의존성 표 cascade”라고 고정 표현을 남김: `LOCATION_LEGAL_PLAN.md:596`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1213:- manifest 실제 배열은 9개 entry라 동작/entry 정합은 맞지만, 주석은 “§ 6 의존성 8단계 + C0003 doctor_profile”로 남아 있음: `packages/migrations-runner/src/manifest.ts:23`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1215:권장 patch: 두 문구를 모두 “9단계 의존성 표”로 정정. 코드 동작 이슈는 아니고 SoT 문구 회귀다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1222:- LL-CASCADE-05: PARTIAL — manifest spec 실체와 9개 entry는 존재하지만, plan §10 및 manifest 주석에 “8단계” stale wording 잔존.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1226:- closeableAfterPatch=false: 본 cycle minor 1건(LLC-18)만 남음. 다음 cycle은 “8단계” stale wording 정정 확인만 짧게 보면 된다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1237:- LLC-15: PASS — plan §6은 9단계로 갱신되어 `D0010 → C0001 → C0002 → C0003 → C0004 → C0005 → C0006 → C0007 → C0008` 순서가 명시됨: `LOCATION_LEGAL_PLAN.md:497-506`; manifest 실제 배열도 같은 9 entry 순서: `manifest.ts:26-101`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1243:### LLC-18 — minor — LL-CASCADE-05 및 manifest 주석에 “8단계” stale wording 잔존
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1244:- plan §6 SoT는 9단계로 갱신됨: `LOCATION_LEGAL_PLAN.md:497-506`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1245:- 하지만 §10 `LL-CASCADE-05` 본문은 아직 “본 plan 의 8단계 의존성 표 cascade”라고 고정 표현을 남김: `LOCATION_LEGAL_PLAN.md:596`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1246:- manifest 실제 배열은 9개 entry라 동작/entry 정합은 맞지만, 주석은 “§ 6 의존성 8단계 + C0003 doctor_profile”로 남아 있음: `packages/migrations-runner/src/manifest.ts:23`.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1248:권장 patch: 두 문구를 모두 “9단계 의존성 표”로 정정. 코드 동작 이슈는 아니고 SoT 문구 회귀다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1255:- LL-CASCADE-05: PARTIAL — manifest spec 실체와 9개 entry는 존재하지만, plan §10 및 manifest 주석에 “8단계” stale wording 잔존.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1259:- closeableAfterPatch=false: 본 cycle minor 1건(LLC-18)만 남음. 다음 cycle은 “8단계” stale wording 정정 확인만 짧게 보면 된다.
.\docs\features\content-migration.md:1003:| 2026-05-15 | v0.3 | codex 2차 23 지적 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md:57:   - LLC-04 manifest: `validateManifest` 가 dependsOn 검증 sound 한지, C0003 추가가 plan § 6 (8단계) 와 어긋나는 의도가 있는지
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md:72:   - LL-CASCADE-05: packages/migrations-runner — manifest 작성 완료. validateManifest call site 가 있는가? 없으면 spec 만으로 acceptance 충분한가 (LL-DEFER-20 cascade)?
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md:95:- LL-CASCADE-05: <PASS|FAIL>
.\docs\features\compliance-assistant.md:598:| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
.\docs\features\compliance-assistant.md:607:| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
.\docs\features\compliance-assistant.md:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
.\docs\features\asset-ingestion.md:529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
.\docs\features\asset-ingestion.md:533:**v0.2 → v0.3 blob key format migration**:
.\docs\features\asset-ingestion.md:535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
.\docs\features\asset-ingestion.md:537:  - **lazy rewrite** (기본): 신규 asset만 v0.3 format 사용. 기존 v0.2 blob은 그대로 두고 `IngestedAsset.blobKeyVersion` 필드(`"v0.2" | "v0.3"`)로 분기 — signed URL 발급 시 version별 path 사용
.\docs\features\asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
.\docs\features\asset-ingestion.md:595:| 2026-05-14 | v0.3 | codex 2차 (14 지적 전건 수용)
.\docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\docs\features\asset-ingestion.md:617:| `blobKeyVersion` | enum (`v0.2`·`v0.3`) | ✅ | (AI4-08) 신규 row default `v0.3`. v0.2 row는 lazy rewrite (§ 13.3). signed URL 발급 worker가 version별 path 분기 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:70:   - LLC-04 manifest: `validateManifest` 가 dependsOn 검증 sound 한지, C0003 추가가 plan § 6 (8단계) 와 어긋나는 의도가 있는지
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:85:   - LL-CASCADE-05: packages/migrations-runner — manifest 작성 완료. validateManifest call site 가 있는가? 없으면 spec 만으로 acceptance 충분한가 (LL-DEFER-20 cascade)?
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:108:- LL-CASCADE-05: <PASS|FAIL>
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:169:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'docs/admin/ARCHITECTURE.md','docs/decisions/ADMIN_UI_SKELETON_PLAN.md','docs/core/CONTENT_STANDARDS.md','docs/decisions/M0_BUILD_EXPORT_PLAN.md','docs/decisions/LOCATION_LEGAL_PLAN.md'); foreach("'$f in $files){ if(Test-Path $f){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { if($_ -match '"'3\\.8\\.2|LL-CASCADE|LL-DEFER|LocationProfile|LegalDocument|content-saved-partial|content-saved-failed|7\\.1\\.1\\.1|effectiveDate|effective_date|C0003|C0008|migrations-runner|manifest|8-step|8단계|9-step|9단계|D0010|C0001|C0002|C0004|C0005|C0006|C0007'){ '{0,5}: {1}' -f "'$i, $_ }; $i++ } } else { Write-Output "### MISSING $f" } }' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:204:  505: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:219:  706: | 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:243:    5: > **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:249:   19: - `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:293:  301: - (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:295:  303: - (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:381:  594: - `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:383:  602: | 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:384:  603: | 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:385:  604: | 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:544:    1: // @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:546:    3: // v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:666:  123:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1508:    1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1509:    2: // SoT: memory/milestone_spike_d_local_pass.md · LOCATION_LEGAL_PLAN v1.0 § 6 · § 10 LL-CASCADE-05
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1522:   15: export { orderedMigrations, validateManifest, type MigrationDescriptor } from "./manifest.js";
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1525:    2: // SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1529:    6: // plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1531:    8: // orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1546:   23:  * orderedMigrations — LOCATION_LEGAL_PLAN v1.0 § 6 의존성 8단계 + C0003 doctor_profile.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1549:   26: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1635:  112:   for (const [i, m] of orderedMigrations.entries()) {
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:2028:  381:  * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:2206:    4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:2875:  125:  *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:3854:  125:  *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:3999:    4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:4732:  123:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5014:  594: - `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5207:    1: // @glitzy/core-content — M0 vertical slice schema + templates (v0.3·LOCATION_LEGAL_PLAN v1.0)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5276:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5385:- LLC-04: PASS with caveat — `manifest.ts`는 생성됐고 `validateManifest()`는 이전 `creates` 기준 dependsOn 검증을 수행함: [packages/migrations-runner/src/manifest.ts:26](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:26)-[121]. 다만 plan §6 8단계와 manifest 9단계 불일치는 새 finding LLC-15.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5398:### LLC-15 — major — plan §6 8단계와 manifest 9단계가 SoT 불일치
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5401:하지만 plan §6은 여전히 8단계로 C0003을 생략합니다: [docs/decisions/LOCATION_LEGAL_PLAN.md:497](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:497)-[505]. 또한 LL-CASCADE-05도 “본 plan 의 8단계 의존성 표 cascade”라고 못박고 있습니다: [LOCATION_LEGAL_PLAN.md:594](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:594). plan SoT를 9단계로 갱신하거나, C0003 보강이 manifest-only 의도임을 plan에 명시해야 합니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5418:- LL-CASCADE-05: PARTIAL — manifest spec은 있음. 다만 plan 8단계 vs manifest 9단계 불일치 때문에 LLC-15 패치 전 close 불가.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5437:- LLC-04: PASS with caveat — `manifest.ts`는 생성됐고 `validateManifest()`는 이전 `creates` 기준 dependsOn 검증을 수행함: [packages/migrations-runner/src/manifest.ts:26](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:26)-[121]. 다만 plan §6 8단계와 manifest 9단계 불일치는 새 finding LLC-15.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5450:### LLC-15 — major — plan §6 8단계와 manifest 9단계가 SoT 불일치
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5453:하지만 plan §6은 여전히 8단계로 C0003을 생략합니다: [docs/decisions/LOCATION_LEGAL_PLAN.md:497](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:497)-[505]. 또한 LL-CASCADE-05도 “본 plan 의 8단계 의존성 표 cascade”라고 못박고 있습니다: [LOCATION_LEGAL_PLAN.md:594](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:594). plan SoT를 9단계로 갱신하거나, C0003 보강이 manifest-only 의도임을 plan에 명시해야 합니다.
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5470:- LL-CASCADE-05: PARTIAL — manifest spec은 있음. 다만 plan 8단계 vs manifest 9단계 불일치 때문에 LLC-15 패치 전 close 불가.
.\docs\features\analytics-reporting.md:952:| 2026-05-14 | v0.3 | codex 2차 (24 지적 전건 수용)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md:22:| 8 | `packages/core-content/src/schema.ts` | drizzle schema v0.3 (LegalDocument + ClinicProfile + LocationProfile + content_publication_status enum) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md:34:- LL-CASCADE-01 (ARCH § 3.8.2 변수 화이트리스트 reference), LL-CASCADE-02 (ADMIN_UI_SKELETON § 5.5 audit matrix), LL-CASCADE-03 (CONTENT_STANDARDS § 7 LegalDocument 면제), LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN placeholder), LL-CASCADE-05 (migrations-runner manifest) 각각 실제 docs/패키지에 반영됐는가 — **반영 안 됐으면 blocking**
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md:119:- LL-CASCADE-05 (migrations-runner): <검증 결과>
.\packages\core-content\src\schema.ts:1:// @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
.\packages\core-content\src\schema.ts:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\packages\core-content\src\schema.ts:123:    // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:35:| 8 | `packages/core-content/src/schema.ts` | drizzle schema v0.3 (LegalDocument + ClinicProfile + LocationProfile + content_publication_status enum) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:47:- LL-CASCADE-01 (ARCH § 3.8.2 변수 화이트리스트 reference), LL-CASCADE-02 (ADMIN_UI_SKELETON § 5.5 audit matrix), LL-CASCADE-03 (CONTENT_STANDARDS § 7 LegalDocument 면제), LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN placeholder), LL-CASCADE-05 (migrations-runner manifest) 각각 실제 docs/패키지에 반영됐는가 — **반영 안 됐으면 blocking**
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:132:- LL-CASCADE-05 (migrations-runner): <검증 결과>
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:163:packages\core-content\src\schema.ts:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:195:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:226:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:237:docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:243:docs\decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:313:docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:315:docs\decisions\LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:316:docs\decisions\LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:317:docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:334:docs\decisions\ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:404:docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:411:docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:427:docs\admin\ARCHITECTURE.md:489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:453:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:467:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:1379: 381:  * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:2166:   4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3094:   1: // @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3096:   3: // v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3390:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-CASCADE-01|LL-CASCADE-02|LL-CASCADE-03|LL-CASCADE-04|LL-CASCADE-05|migrations-runner manifest|manifest" docs packages -g "*.md" -g "*.ts" -g "*.json"' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3450:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3456:docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3473:docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3475:docs\decisions\LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3476:docs\decisions\LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3477:docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3482:docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3526:   2: // cycle7-8-code (URL scrape patch) v0.3:
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3768:   2: // cycle7-8-code (URL scrape patch) v0.3:
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3976: 256: | **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4084:docs/decisions/ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4107: 323: > - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4126: 342: | `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4145: 361: 대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4203: 413: | `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4255: 367: - (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4422: 301: - (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4424: 303: - (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4442: 321: - (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4856:- **LLC-04**: LL-CASCADE-05 migrations-runner manifest spec 파일 없음
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4858:  - 근거(plan SoT): `LL-CASCADE-05`, plan § 10
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4860:  - 권장 patch: migration dependency 8단계(D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008)를 담은 manifest spec 파일을 추가.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4928:- `LL-CASCADE-05`: 누락. migrations-runner manifest spec 파일 없음.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4936:- LL-CASCADE-05 (migrations-runner): 실패 — manifest spec 파일 없음.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4965:- **LLC-04**: LL-CASCADE-05 migrations-runner manifest spec 파일 없음
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4967:  - 근거(plan SoT): `LL-CASCADE-05`, plan § 10
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4969:  - 권장 patch: migration dependency 8단계(D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008)를 담은 manifest spec 파일을 추가.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:5037:- `LL-CASCADE-05`: 누락. migrations-runner manifest spec 파일 없음.
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:5045:- LL-CASCADE-05 (migrations-runner): 실패 — manifest spec 파일 없음.
.\packages\core-content\src\index.ts:1:// @glitzy/core-content — M0 vertical slice schema + templates (v0.3·LOCATION_LEGAL_PLAN v1.0)
.\docs\ARCHITECTURE.md:600:| 2026-05-13 | v0.3 | 용어 정리·Phase 통일·Feature Modules 신설·위험도 등급·어드민 분리 | Glitzy (Claude 페어링) |
.\docs\admin\REVIEW_WORKFLOW.md:675:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
.\docs\admin\REVIEW_WORKFLOW.md:799:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
.\docs\admin\REVIEW_WORKFLOW.md:800:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
.\docs\admin\REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
.\docs\admin\ARCHITECTURE.md:500:| 2026-05-13 | v0.1 | 최초 작성 (ARCHITECTURE.md v0.3에서 분리) | Glitzy (Claude 페어링) |
.\docs\admin\ARCHITECTURE.md:502:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
.\docs\admin\ARCHITECTURE.md:505:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
.\docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
.\docs\decisions\LOCATION_LEGAL_PLAN.md:264:-- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
.\docs\decisions\LOCATION_LEGAL_PLAN.md:301:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:303:- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:321:- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
.\docs\decisions\LOCATION_LEGAL_PLAN.md:367:- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:424:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
.\docs\decisions\LOCATION_LEGAL_PLAN.md:426:  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:497:- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
.\docs\decisions\LOCATION_LEGAL_PLAN.md:501:  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
.\docs\decisions\LOCATION_LEGAL_PLAN.md:518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
.\docs\decisions\LOCATION_LEGAL_PLAN.md:554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
.\docs\decisions\LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
.\docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
.\docs\decisions\LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
.\docs\decisions\LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
.\docs\decisions\LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:436:## 종합 결정 요약 (v0.3)
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:469:| 2026-05-15 | v0.3 | codex 2차 15 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade |
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:30:Buffer: Week 2 Day 11~14는 본 작업 (Phase 0 § 4.2 v0.3 일정).
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:467:| 2026-05-15 | v0.3 | codex 2차 비평 7 지적 전건 수용 |
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:469:| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:64:| ClinicProfile editable slug + instance 당 1개 보장 unique index | M0 v1.0 + core-content schema v0.3 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:167:       (packages/auth.issueMagicLink 내부에 emit 없음 — packages/auth v0.3 cascade)
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:256:| **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:316:`packages/auth.withResolvedTenantTransaction` 자체에 `SET LOCAL ROLE app_tenant_user` 가 없음 (ADMIN-UI-04) → packages/auth v0.3 cascade marker (resolve + withTenantTransaction 합성 패치). skeleton 은 자체 wrapper 로 우회.
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:323:> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:342:| `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:361:대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:416:| `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:521:RESEND_MODE=mock                                # 허용값 (skeleton): mock | suppress-mock 만 (ADMIN-UI-73). real delivery (resend / sendgrid 등) 는 packages/auth v0.3 mail adapter 도입 후 (M0 v1.0 또는 M2). skeleton 부팅 시 env validation 에서 `mock | suppress-mock` 외 값이면 즉시 throw.
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:679:| `packages/auth` v0.3 — `withResolvedTenantTransaction` 에 `withTenantTransaction` 합성 (ADMIN-UI-04) — skeleton 은 자체 `withSkeletonTx` 로 우회 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:680:| `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:681:| `packages/auth` v0.3 — `consumeMagicLink` 가 identifier 반환 유지 + 별도 allowlist lookup helper 검토 (cycle8 정정 ADMIN-UI-101 — cycle7 self-provision 제거 정합 · upsert 표현 제거) — skeleton 은 consume route 에서 admin_user **lookup-only** 수행 (allowlist 미존재 → reject) |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:682:| `packages/auth` v0.3 — `resolveTenantContext` 반환에 `sessionRefreshed` 플래그 (ADMIN-UI-03·38) — skeleton 은 sliding refresh 미적용 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:683:| `packages/auth` v0.3 — inactive membership 분기 추가 (ADMIN-UI-35) — skeleton mapping 은 unreachable 표시 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:686:| `packages/core-content` v0.3 — logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique (ADMIN-UI-09·10) — skeleton 은 zod-only + fixed slug |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:706:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:707:| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
.\docs\decisions\M0_SCHEMA_PLAN.md:30:| 15 | — | **Notification P0 subset** (INFRA v1.0 정정): Receipt·Log·PayloadRecord·DeliveryAttempt tables. **NotificationEvent는 DB table 아님 — notify() input envelope** | notifications-outbox v0.3+ | P0 (확장·v0.2~) |
.\docs\decisions\M0_SCHEMA_PLAN.md:111:- v0.3: Notification P0 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) + REVIEW_WORKFLOW state machine integration
.\docs\decisions\M0_SCHEMA_PLAN.md:117:codex 비평 cycle 1·2에서 deferred·M0 v0.3 acceptance scope 외 항목·각 항 별도 cycle 또는 milestone에서 close:
.\docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
.\apps\spike-a\README.md:3:> **상태**: prototype **v0.3 LOCAL_PASS candidate** (codex 1·2차 비평 26 지적 반영)
.\apps\spike-a\README.md:79:## v0.3 한계 (provider gate Day 9 전)
.\docs\core\SEARCH_STANDARDIZATION.md:3:> **상태**: **v1.1** (DESIGN_TOKENS v1.0 cascade)
.\docs\core\SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
.\docs\core\SEARCH_STANDARDIZATION.md:584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
.\docs\core\SCHEMA_MAPPING.md:951:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
.\docs\core\SCHEMA_MAPPING.md:953:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
.\docs\core\SCHEMA_MAPPING.md:964:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
.\docs\core\PAGE_TYPES.md:686:| 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
.\apps\web\src\lib\site-meta-fetch.ts:2:// cycle7-8-code (URL scrape patch) v0.3:
.\docs\core\DESIGN_TOKENS.md:939:| ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |
.\docs\core\DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
.\apps\web\src\lib\session-cookie.ts:3:// sliding cookie refresh 는 packages/auth v0.3 sessionRefreshed 반환 후 cascade
.\docs\core\DATA_MODEL.md:1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
.\docs\core\CONTENT_STANDARDS.md:644:| ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
.\docs\core\CONTENT_STANDARDS.md:658:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
.\docs\core\CONTENT_STANDARDS.md:662:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
.\apps\web\src\lib\deny-reason-map.ts:66:      // future-proof — packages/auth v0.3 cascade 시 분기 추가
.\apps\web\src\lib\clinic-profile-schema.ts:381: * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
.\docs\compliance\RISK_LEVELS.md:714:| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
.\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
.\packages\core-content\dist\index.js:1:// @glitzy/core-content — M0 vertical slice schema + templates (v0.3·LOCATION_LEGAL_PLAN v1.0)
.\apps\web\README.md:5:> - Onboarding URL scrape 2차 (v1.1): codex 비평 4 cycle 22 findings 전건 수용 (12→7→3→0). SSRF 방어 + tenant resolve 재검증 + sanitizeUrlForAudit.
.\apps\web\README.md:82:- packages/auth v0.3: audit emit 자동 · sessionRefreshed 반환 · inactive membership 분기
.\apps\web\README.md:83:- packages/core-content v0.3: logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique
.\apps\web\README.md:84:- packages/shared-types v0.3: instance-scoped service-role function enum
.\apps\web\src\components\forms\ClinicProfileForm.tsx:4:// (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
.\packages\core-content\dist\schema.js:1:// @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
.\packages\core-content\dist\schema.js:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
.\packages\auth\src\config.ts:12:  /** Mailbox mode — mock (in-memory)·suppress-mock (token만 발급·delivery 미수행). 실 delivery는 별도 mail adapter (v0.3+ — package에서 미구현) */
.\packages\auth\dist\config.d.ts:10:    /** Mailbox mode — mock (in-memory)·suppress-mock (token만 발급·delivery 미수행). 실 delivery는 별도 mail adapter (v0.3+ — package에서 미구현) */
.\packages\notifications-outbox\src\index.ts:8:// v0.3 scope (다음 cycle·worker harness):
.\packages\migrations-runner\src\manifest.ts:2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
.\packages\migrations-runner\src\manifest.ts:6:// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
.\packages\migrations-runner\src\manifest.ts:8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
.\packages\migrations-runner\src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
.\packages\migrations-runner\src\manifest.ts:26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
.\packages\migrations-runner\src\manifest.ts:112:  for (const [i, m] of orderedMigrations.entries()) {
.\packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
.\packages\migrations-runner\src\index.ts:2:// SoT: memory/milestone_spike_d_local_pass.md · LOCATION_LEGAL_PLAN v1.0 § 6 · § 10 LL-CASCADE-05
.\packages\migrations-runner\src\index.ts:15:export { orderedMigrations, validateManifest, type MigrationDescriptor } from "./manifest.js";
.\apps\web\src\app\api\site-meta-fetch\route.ts:2:// cycle7-8-code (URL scrape patch) v0.3:
.\packages\notifications-outbox\dist\index.js:8:// v0.3 scope (다음 cycle·worker harness):
.\apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:125: *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).

codex
검색 결과상 잔존 `8단계`는 요청에 적힌 세 위치와 리뷰 산출물/프롬프트 인용에 집중되어 있습니다. 이제 실제 SoT 문서와 `manifest.ts` 주변부를 좁혀서 PASS/FAIL 근거를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content -LiteralPath $p; for($i=560;$i -le 615;$i++){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'packages/migrations-runner/src/manifest.ts'; "'$lines=Get-Content -LiteralPath $p; for($i=1;$i -le 90;$i++){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "8단계" docs/decisions/LOCATION_LEGAL_PLAN.md packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-CASCADE-0[1-5]|§ 6|C0003|9단계|D0010|C0008" docs/decisions/LOCATION_LEGAL_PLAN.md packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 851ms:
560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
561:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
562:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
563:- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
564:- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
565:- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
566:- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
567:
568:### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
569:
570:> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
571:
572:- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
573:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
574:
575:### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)
576:
577:- (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)
578:
579:### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)
580:
581:- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
582:- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
583:
584:### 9.5 Closed (이전 cycle 에서 합류 완료)
585:
586:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
587:
588:## 10. Cascade marker (다른 SoT 문서로 전파)
589:
590:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
591:
592:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
595:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
597:
598:## 변경 이력
599:
600:| 일자 | 버전 | 변경 |
601:|---|---|---|
602:| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
607:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
608:| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

 succeeded in 793ms:
docs/decisions/LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
docs/decisions/LOCATION_LEGAL_PLAN.md:20:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
docs/decisions/LOCATION_LEGAL_PLAN.md:201:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
docs/decisions/LOCATION_LEGAL_PLAN.md:242:-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docs/decisions/LOCATION_LEGAL_PLAN.md:366:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs/decisions/LOCATION_LEGAL_PLAN.md:406:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
docs/decisions/LOCATION_LEGAL_PLAN.md:434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs/decisions/LOCATION_LEGAL_PLAN.md:487:- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
docs/decisions/LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
docs/decisions/LOCATION_LEGAL_PLAN.md:497:- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
docs/decisions/LOCATION_LEGAL_PLAN.md:498:  1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
docs/decisions/LOCATION_LEGAL_PLAN.md:501:  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
docs/decisions/LOCATION_LEGAL_PLAN.md:506:  9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:533:| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md:540:| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
docs/decisions/LOCATION_LEGAL_PLAN.md:550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
docs/decisions/LOCATION_LEGAL_PLAN.md:590:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:595:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:607:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:608:| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
packages/migrations-runner/src/manifest.ts:2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
packages/migrations-runner/src/manifest.ts:6:// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
packages/migrations-runner/src/manifest.ts:9:// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
packages/migrations-runner/src/manifest.ts:29:    file: "packages/db/migrations/D0010_instance.sql",
packages/migrations-runner/src/manifest.ts:41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
packages/migrations-runner/src/manifest.ts:48:  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
packages/migrations-runner/src/manifest.ts:50:    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
packages/migrations-runner/src/manifest.ts:93:    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",

 succeeded in 798ms:
docs/decisions/LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

 succeeded in 878ms:
1:// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
3://
4:// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
5:// 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
6:// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
7://
8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
9:// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
10:
11:export type MigrationDescriptor = {
12:  /** 미가공 절대 경로 (repo root 기준 상대) */
13:  readonly file: string;
14:  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
15:  readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
16:  /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
17:  readonly creates: ReadonlyArray<string>;
18:  /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
19:  readonly dependsOn: ReadonlyArray<string>;
20:};
21:
22:/**
23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
24: * runner 는 이 배열 순서대로 sequential apply (fail-fast).
25: */
26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
27:  // (1) instance (multi-tenant root)
28:  {
29:    file: "packages/db/migrations/D0010_instance.sql",
30:    package: "@glitzy/db",
31:    creates: ["instance"],
32:    dependsOn: [],
33:  },
34:  // (2) clinic_profile
35:  {
36:    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
37:    package: "@glitzy/core-content",
38:    creates: ["clinic_profile"],
39:    dependsOn: ["instance"],
40:  },
41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
42:  {
43:    file: "packages/core-content/migrations/C0002_location_profile.sql",
44:    package: "@glitzy/core-content",
45:    creates: ["location_profile"],
46:    dependsOn: ["instance"],
47:  },
48:  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
49:  {
50:    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
51:    package: "@glitzy/core-content",
52:    creates: ["doctor_profile"],
53:    dependsOn: ["instance"],
54:  },
55:  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
56:  {
57:    file: "packages/core-content/migrations/C0004_treatment_page.sql",
58:    package: "@glitzy/core-content",
59:    creates: ["treatment_page", "content_publication_status"],
60:    dependsOn: ["instance"],
61:  },
62:  // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
63:  {
64:    file: "packages/core-content/migrations/C0005_article.sql",
65:    package: "@glitzy/core-content",
66:    creates: ["article", "risk_level"],
67:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
68:  },
69:  // (7) legal_document — content_publication_status + risk_level enum FK
70:  {
71:    file: "packages/core-content/migrations/C0006_legal_document.sql",
72:    package: "@glitzy/core-content",
73:    creates: ["legal_document", "legal_document_type"],
74:    dependsOn: ["instance", "content_publication_status", "risk_level"],
75:  },
76:  // (8) clinic_profile policy + primary_ctas (ALTER)
77:  {
78:    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
79:    package: "@glitzy/core-content",
80:    creates: [
81:      "clinic_profile.policy_contact_person",
82:      "clinic_profile.policy_contact_email",
83:      "clinic_profile.policy_contact_phone",
84:      "clinic_profile.policy_effective_date",
85:      "clinic_profile.primary_ctas",
86:      "clinic_profile_primary_ctas_validate",
87:      "clinic_profile_primary_ctas_trigger",
88:    ],
89:    dependsOn: ["clinic_profile"],
90:  },

codex
운영 SoT는 `LOCATION_LEGAL_PLAN.md` §6과 `manifest.ts` 모두 9단계로 정렬되어 있고, `8단계`는 본문 patch marker 1건과 변경 이력 2건뿐입니다. 마지막으로 cascade 대상 파일들이 존재/반영되었는지만 빠르게 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'packages/migrations-runner/src/manifest.ts'; "'$lines=Get-Content -LiteralPath $p; for($i=90;$i -le 130;$i++){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"policy\\.|LegalDocument|content-saved-partial|content-saved-failed|LL-CASCADE-0[1-4]|LocationProfile\\.reservationChannels|M0_BUILD_EXPORT_PLAN\" docs/admin/ARCHITECTURE.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/core/CONTENT_STANDARDS.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "8단계" docs/decisions/LOCATION_LEGAL_PLAN.md packages/migrations-runner/src/manifest.ts packages/migrations-runner/dist/manifest* packages/migrations-runner/dist/index*' in C:\Users\assag\solution\website-exposure
 succeeded in 661ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:3:> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
docs/decisions/M0_BUILD_EXPORT_PLAN.md:11:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:34:| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:36:### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
docs/core/CONTENT_STANDARDS.md:401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
docs/core/CONTENT_STANDARDS.md:403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
docs/core/CONTENT_STANDARDS.md:405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
docs/core/CONTENT_STANDARDS.md:412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
docs/core/CONTENT_STANDARDS.md:414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373:| `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:374:| `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:375:| `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:706:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
docs/admin/ARCHITECTURE.md:219:### 3.8.2 LegalDocument 자동 생성 규칙
docs/admin/ARCHITECTURE.md:223:| LegalDocument 필드 | 자동 생성 값 |
docs/admin/ARCHITECTURE.md:228:| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) + **Policy 변수** (`{{policy.contactPerson}}`·`{{policy.contactEmail}}`·`{{policy.contactPhone}}`·`{{policy.effectiveDate}}`) — 출처 SoT 준수 |
docs/admin/ARCHITECTURE.md:232:**Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
docs/admin/ARCHITECTURE.md:243:| policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
docs/admin/ARCHITECTURE.md:244:| policy | `{{policy.contactEmail}}` | ClinicProfile.policyContactEmail |
docs/admin/ARCHITECTURE.md:245:| policy | `{{policy.contactPhone}}` | ClinicProfile.policyContactPhone |
docs/admin/ARCHITECTURE.md:246:| policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |
docs/admin/ARCHITECTURE.md:251:- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
docs/admin/ARCHITECTURE.md:253:  - `contentType` = `LegalDocument`
docs/admin/ARCHITECTURE.md:348:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
docs/admin/ARCHITECTURE.md:504:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:505:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:506:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

 succeeded in 679ms:
90:  },
91:  // (9) location_profile parentClinic composite FK (ALTER)
92:  {
93:    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
94:    package: "@glitzy/core-content",
95:    creates: [
96:      "location_profile.clinic_profile_id",
97:      "location_profile_clinic_fk",
98:      "location_profile_clinic_idx",
99:    ],
100:    dependsOn: ["clinic_profile", "location_profile"],
101:  },
102:];
103:
104:/**
105: * validateManifest — runner 가 sequential apply 직전 호출.
106: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
107: * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
108: */
109:export function validateManifest(): ReadonlyArray<string> {
110:  const errors: string[] = [];
111:  const seen = new Set<string>();
112:  for (const [i, m] of orderedMigrations.entries()) {
113:    for (const dep of m.dependsOn) {
114:      if (!seen.has(dep)) {
115:        errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
116:      }
117:    }
118:    for (const c of m.creates) seen.add(c);
119:  }
120:  return errors;
121:}

2026-05-18T03:16:22.628473Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
docs/decisions/LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
rg: packages/migrations-runner/dist/manifest*: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)
rg: packages/migrations-runner/dist/index*: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

 exited 1 in 642ms:
docs/decisions/LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
rg: packages/migrations-runner/dist/manifest*: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)
rg: packages/migrations-runner/dist/index*: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

codex
# LOCATION_LEGAL code v1.0 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=14 → cycle2=3 → cycle3=1 → cycle4=1 → cycle5=0
- 본 cycle 핵심 판단: marker/history exemption 정당성 확인. 실질 회귀 없음.

## cycle 4 LLC-18 marker/history exemption 점검
- § 10 LL-CASCADE-05 인용 보존: PASS — `"8단계" → "9단계"`는 stale wording 정정 patch 자체를 설명하는 인용이며, 같은 문장 안에서 현재 운영 SoT가 **9단계 의존성 표**임을 명시한다.
- v0.3 변경 이력 (604) 보존: PASS — cycle2 LL-37 당시 결정은 실제로 8단계였으므로 historical SoT 기록이다. 변경 이력의 시간순 보존 규약과 정합.
- v1.1 변경 이력 (609) 보존: PASS — LLC-15/LLC-18 patch summary로서 “8단계 → 9단계” 변경 사실을 기록한다. 운영 표현이 아니라 변경 내역 인용이다.

## 운영 SoT 정합 재확인 (운영 시점 표현)
- § 6 9단계 표 (운영): PASS
- manifest.ts orderedMigrations 9 entry: PASS
- manifest.ts 주석 9단계 wording: PASS

## acceptance precondition (LL-CASCADE-01~05) 최종 확정
- LL-CASCADE-01: PASS
- LL-CASCADE-02: PASS
- LL-CASCADE-03: PASS
- LL-CASCADE-04: PASS
- LL-CASCADE-05: PASS

## acceptance 판정
- closeableAfterPatch=true: yes
- 누계 통계: cycle 1·2·3·4(false-positive)·5 합산 findings 19건. 실 patch 수용 18건. marker/history exemption 1건(잔존 occurrence 3건).
- 권고: LOCATION_LEGAL code v1.0 acceptance commit 진행 가능.
tokens used
46,110
# LOCATION_LEGAL code v1.0 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=14 → cycle2=3 → cycle3=1 → cycle4=1 → cycle5=0
- 본 cycle 핵심 판단: marker/history exemption 정당성 확인. 실질 회귀 없음.

## cycle 4 LLC-18 marker/history exemption 점검
- § 10 LL-CASCADE-05 인용 보존: PASS — `"8단계" → "9단계"`는 stale wording 정정 patch 자체를 설명하는 인용이며, 같은 문장 안에서 현재 운영 SoT가 **9단계 의존성 표**임을 명시한다.
- v0.3 변경 이력 (604) 보존: PASS — cycle2 LL-37 당시 결정은 실제로 8단계였으므로 historical SoT 기록이다. 변경 이력의 시간순 보존 규약과 정합.
- v1.1 변경 이력 (609) 보존: PASS — LLC-15/LLC-18 patch summary로서 “8단계 → 9단계” 변경 사실을 기록한다. 운영 표현이 아니라 변경 내역 인용이다.

## 운영 SoT 정합 재확인 (운영 시점 표현)
- § 6 9단계 표 (운영): PASS
- manifest.ts orderedMigrations 9 entry: PASS
- manifest.ts 주석 9단계 wording: PASS

## acceptance precondition (LL-CASCADE-01~05) 최종 확정
- LL-CASCADE-01: PASS
- LL-CASCADE-02: PASS
- LL-CASCADE-03: PASS
- LL-CASCADE-04: PASS
- LL-CASCADE-05: PASS

## acceptance 판정
- closeableAfterPatch=true: yes
- 누계 통계: cycle 1·2·3·4(false-positive)·5 합산 findings 19건. 실 patch 수용 18건. marker/history exemption 1건(잔존 occurrence 3건).
- 권고: LOCATION_LEGAL code v1.0 acceptance commit 진행 가능.
