OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e4d-577a-7ec2-82b3-ad473608b2fa
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.6 — **cycle 6**. cycle 1~5 누계 53 finding 전건 수용. 수렴 추세 36 → 11 → 3 → 2 → 1. cycle 5 안 모든 acceptance precondition PASS · blocking 0 유지 · closeable 100% 유지. **acceptance 도달 cycle 추정**.

## cycle 5 결정·patch 요약

- **CAP5-01**: § 17.b 4 action 책임 분리 정합 — M0_PLAN § 6.1 정합. mapComplianceErrorToResult helper 위치 `apps/web/src/lib/compliance/action-errors.ts` 신규.

## 본 cycle 검증 우선순위

cycle 5 patch 정합성 + 최종 잔존 결함. 0 finding 도달 시 `ready_for_acceptance=true` + `recommendation: "acceptance 권장"` 명시.

### cycle 5 patch 재검증
1. **CAP5-01 cycle 5 정정**: § 17.b 안 4 action 책임 분리 명시 — (a) submitForReviewAction = check + envelope persist + auto-gate · (b) approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · (c) rejectContentAction = transition validation · (d) publishContentAction = evaluatePublishable + publish transition. M0_PLAN § 6.1 책임 정합 검증
2. **mapComplianceErrorToResult helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. helper shape `(e: unknown) => ActionResult | null`. 3 error type (ComplianceConfigError · ComplianceTransitionError · ReviewerEligibilityError) form-level 변환

### Codex 비평 운영 원칙
- 0 finding 도달 시 **`ready_for_acceptance=true` + `recommendation: "acceptance 권장"`** 명시
- 잔존 1+ finding 시 cycle 7 진입 권장
- 새로운 결함 ID prefix = **CAP6** (cycle 6 신규)
- cycle 1~5 잔존 finding 직접 인용

## SoT (cycle 1~5 동일)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1 → cycle 6 = N

## blocking
## major
## minor
## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: <PASS|FAIL>
- 5 inlineRiskFlags 추출 표 정합: <PASS|FAIL>
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: <PASS|FAIL>
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: <PASS|FAIL>
- High 가상 finding triggeredBy 판정 정합: <PASS|FAIL>
- CA-DEFER 5 + 12 신설 phase 분류 정합: <PASS|FAIL>
- CA-CASCADE 9종 정합: <PASS|FAIL>

=== CYCLE SIGNAL ===
cycle: 6
total_findings: <NN>
blocking: <N>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: true|false
scope_narrow_acceptable: true|false
recommendation: "acceptance 권장" 또는 "다음 cycle 진입 권장"
```

한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것.

codex
검토 범위를 문서 본문과 cycle 5에서 언급된 helper/책임 분리 지점으로 좁혀 확인하겠습니다. 먼저 관련 파일 위치와 변경 내용을 읽습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files | rg "(COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN|M0_PLAN|action-errors|compliance)"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
 succeeded in 619ms:
docs\features\compliance-assistant.md
packages\core-content\migrations\C0014_compliance_record.sql
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-1.out.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-2.out.md
handoff\codex-reviews\compliance-workflow-integration-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-3.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-3.out.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-2.out.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-1.out.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-6.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-6.out.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-5.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-5.out.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-4.prompt.md
handoff\codex-reviews\compliance-assistant-phase-alpha-v1\cycle-4.out.md
apps\web\src\lib\compliance\check.ts
apps\web\src\lib\compliance\eligibility.ts
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
apps\web\src\lib\compliance\risk.ts
apps\web\src\lib\compliance\publishable-check.ts
apps\web\src\lib\compliance\final-roles.ts
apps\web\src\lib\compliance\entity-actions.ts
apps\web\src\lib\compliance\transitions.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\lib\compliance\types.ts
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.prompt.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md
handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.prompt.md
apps\web\src\lib\compliance\__tests__\compliance.test.ts

 succeeded in 630ms:
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
?? docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md
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
현재 작업트리는 이미 많은 미추적/수정 파일이 있는 상태라 되돌리거나 정리하지 않고 읽기 전용 리뷰로 진행합니다. 핵심은 계획 문서 v0.6의 cycle 5 패치가 M0 계획 및 실제 helper 위치와 충돌하지 않는지입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"17\\.b|submitForReviewAction|approveContentAction|rejectContentAction|publishContentAction|action-errors|mapComplianceErrorToResult|ComplianceConfigError|ComplianceTransitionError|ReviewerEligibilityError|27 SoT|inlineRiskFlags|RiskInference|contextExceptions|CA-DEFER|CA-CASCADE|triggeredBy|canonical\" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"6\\.1|submitForReviewAction|approveContentAction|rejectContentAction|publishContentAction|mapComplianceErrorToResult|action-errors|ComplianceConfigError|ComplianceTransitionError|ReviewerEligibilityError|evaluatePublishable|calculateFinalRoles\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md apps/web/src/lib/compliance -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Path apps/web/src/lib/compliance -Force | Select-Object Name,Length' in C:\Users\assag\solution\website-exposure
 succeeded in 635ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
11:  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
12:  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
13:  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
14:  - § 6 RiskInference 통합
16:- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6 YAML + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
17:- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 + medical-law-tracking SoT revision (CAP-27 정정)
19:- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
22:- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
38:- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
39:- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
41:- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 SoT 예시 ID → canonical 매핑** (CAP-04 정정): § 3.1~3.14 각 호의 SoT 예시 ID 17종 → § 2.3 안 "생성 / canonical 흡수 / 의도적 제외" 표 매핑. 흡수 시 대체 ruleId + legalBasis 명시.
42:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
44:### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
50:| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
51:| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
52:| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
53:| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
54:| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
55:| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
57:| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑. 유도 불가 시 throw `ComplianceConfigError` |
60:| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
68:| **`unreviewed-ad-001` 카탈로그 등록** (CAP-16 정정) | check() 별도 흐름 (M0 plan v0.1 안) 유지하되 **§ 2.3 룰 표 안 명시** — "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" marker. `triggeredBy='static-rule'` 유지 (CONTENT_STANDARDS § 7.2 enum cascade 회피) |
69:| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
70:| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
71:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |
73:### 1.3 비범위 (defer) — CAP-25 정정 + CAP2-05 cycle 3 통일 (CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 명시)
77:| 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
78:| LLM 보조 | Phase Beta | CA-DEFER-03 |
79:| warning 큐 + warningAcknowledgements | Phase Beta | CA-DEFER-05 |
80:| stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 | Phase Beta | CA-DEFER-06 |
81:| request-changes / delegate 액션 | Phase Beta | CA-DEFER-07 |
82:| priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 | M2 | CA-DEFER-08 |
83:| client 검수자 (clientApprover 슬롯) | Phase Beta | CA-DEFER-10 |
84:| MediaThresholdAssessment | analytics-reporting 본 구현 | CA-DEFER-09 |
85:| attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
86:| Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
87:| preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta (preset 부재 시 silent skip 정책 — § 11) | CA-DEFER-17 (신설) |
88:| **P-006 (및 다른 PAGE_TYPES § 3) 슬롯 격상 표** — slot-matches.yaml 실 데이터 | Phase Beta (slot 격상은 `entityFields` + `body-regex` matchCondition 합류 필요 · TreatmentPage 실 schema 안 single body_markdown 필드만 존재이므로 entity-level slot 평가 미지원) | CA-DEFER-18 (신설) |
89:| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 — sourceUrl · checkedBy · 영향 룰 ID · stale 트리거 | 본 cycle 안 **MEDICAL_AD_COMPLIANCE_COMMON § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27 정정). 추가 revision Phase Beta | CA-DEFER-19 (신설) |
90:| **`field` scope (fieldPath 단위 매칭)** — RiskRule.scope `type="field"` 의 fieldPath 단위 매칭 (현재 v0.1 안 body 전체 매칭 안 함 — skip+warning) | Phase Beta | CA-DEFER-20 (신설) |
91:| **`block` scope 5종 (list/table/callout/citation/media)** — `qa` 외 block scope | Phase Beta | CA-DEFER-21 (신설) |
92:| **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도 | Phase Beta (kss-js · @kss/kss-js · 자체 포팅 중 결정. v0.1 안 fallback 정규식 `[.!?](\s+\|$)` 한국어 종결 어미 분리 부정확) | CA-DEFER-22 (신설) |
93:| **`NOT_IN_PARAGRAPH` logic (negative operand)** — `side-effect-missing-001` (§ 3.7) 본 logic 필요 | Phase Beta (CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade — `side-effect-missing-001` 룰 자체도 Phase Beta 합류) | CA-DEFER-30 (CAP-30 정정 · 신설) |
94:| **`citationAbsence` evaluation contract** — `false-statement-001` (§ 3.3) 본 contract 필요 | Phase Beta (v0.1 안 단순 regex 매칭만 — citation block 검사 부재 한계 명시) | CA-DEFER-29 (CAP-29 정정 · 신설) |
95:| **pageMeta composite** — `foreign-patient-recruit-domestic-uncertain-001` (§ 3.12 불명확) 안 inLanguage/국내매체 evidence (v0.1 안 단순 regex) | Phase Beta | CA-DEFER-31 (cycle 2 CAP2-03 신설) |
96:| **numeric predicate** — `short-clinical-experience-001` (§ 3.2 6개월 이하) 안 6 이하 정확 매칭 (v0.1 안 1~99 모두 fail 보수 정책) | Phase Beta | CA-DEFER-32 (cycle 2 CAP2-04 신설) |
97:| **evidence absence** — `non-covered-discount-misleading-001` (§ 3.13) 안 기간/대상 명시 부재 검사 (v0.1 안 모든 % 할인 content-gate 보수 정책) | Phase Beta | CA-DEFER-33 (cycle 2 CAP2-04 신설) |
98:| **RiskRule.scope `excludeScopes[]` 필드** — NOT/except 표현 schema 지원 (v0.1 안 matcher allowlist pre-check · `event-fact-statement-001` 한정) | Phase Beta | CA-DEFER-34 (cycle 2 CAP2-02 신설) |
103:2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
113:### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)
122:├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
145:  contextExceptions:
166:    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
169:> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).
174:- **rules.medical-ad.yaml** = MEDICAL_AD § 3.1~3.14 의료법 인용 overlay. `overrides[]` 사용하여 rules.core.yaml 의 canonical 룰에 `legalBasis[]` 정확 매핑 추가. 일부는 신규 룰 (의료법 특화 — 외국인환자·기사형 광고 등)
175:- 머지 결과 = 단일 RiskRule[] 컬렉션 안 canonical 룰별 `legalBasis[]` 정확 매핑
177:### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 4 카운트 정확화)
182:- **표 row = 28**: 27 SoT 슬롯 + plan 추가 row 1 (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 안 생성 룰 · MEDICAL_AD § 3.8 안 명시 ID 아님 · 비-SoT-count display row)
184:- **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건 · 단독 어휘 룰 포함) + rules.medical-ad.yaml 11 신규 룰
185:- **27 SoT 슬롯 처리 합계**: 생성 15 (직접 매칭 신설 — SoT 슬롯 안 ID 카탈로그 등록) · canonical 흡수 9 (다른 canonical 룰로 대체 — `§ 3.2 treatment-effect-assertion-001` + `§ 3.3 false-credential-001` + `§ 3.6 graphic-procedure-001` + `§ 3.8 exaggeration-001` + `§ 3.8 effect-claim-001` + `§ 3.8 guarantee-001` + `§ 3.9 false-title-001` + `§ 3.14 false-award-001` + `§ 3.14 false-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) · **duplicate display row (비-count) 1** (`§ 3.9 false-credential-001` — 이미 § 3.3 흡수 처리 안 카운트 · 표 안 display 만) = 27 표현 · 26 acceptance count
186:- **acceptance precondition 통일** (CAP-04 cycle 4 정정): "**27 SoT 슬롯 표현 + 26 acceptance count (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 25 활성 canonical 룰 + plan 추가 단독 어휘 1 (비-SoT-count)**" — cycle 3 "생성 16 + 흡수 9 = 25" 산수 오류 정정
188:| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | 대체 canonical ruleId | legalBasis[] |
193:| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
195:| § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
198:| § 3.6 | `graphic-procedure-001` | **canonical 흡수** → `before-after-photo-001` (전후사진 운영 단순화 — 수술 장면도 본 룰 안 포함) | `before-after-photo-001` | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
201:| § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
202:| § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
203:| § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
204:| § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
208:| § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
213:| § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
214:| § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
215:| § 3.14 | `award-endorsement-001` | **생성** (canonical — 인증/보증/추천 단일 룰) | 동일 | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
216:| § 3.14 | `false-award-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
217:| § 3.14 | `false-endorsement-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
219:**SoT 27 슬롯 처리 합계 (cycle 4 정확)**: 생성 15 (직접 매칭 신설 · MEDICAL_AD SoT 안 명시 ID 카탈로그 등록) · canonical 흡수 9 (다른 룰로 대체 · `§ 3.2 treatment-effect-assertion-001` → `guarantee-composite-001` · `§ 3.3 false-credential-001` → `false-credential-001` (§ 3.9 unique 유지) · `§ 3.6 graphic-procedure-001` → `before-after-photo-001` · `§ 3.8 exaggeration-001` · `effect-claim-001` · `guarantee-001` → `guarantee-composite-001` · `§ 3.9 false-title-001` → `false-credential-001` · `§ 3.14 false-award-001` · `false-endorsement-001` → `award-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count. **duplicate display row 1** (`§ 3.9 false-credential-001` — § 3.3 안 흡수 처리 안 카운트 안 1회만 · 표 안 display row 만) = 27 표현 · **plan 추가 row 1** (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 생성 룰 · 비-SoT-count display row) = 28 표 row. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
236:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
246:rules.core.yaml 의 canonical 룰에 `overrides[]` 로 `legalBasis[]` 추가 + 의료법 특화 신규 룰 (외국인환자 · 기사형 광고 · 신의료기술 · 단기 임상경력 · 인증/보증 등).
253:# rules.core.yaml canonical 룰 안 legalBasis[] 추가
272:    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
274:  # ... (각 canonical 룰 안 legalBasis overlay)
307:    # Phase Beta CA-DEFER-32 (numeric predicate) 안 1~6 만 매칭 정확화
313:    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
364:    rationale: "MEDICAL_AD § 3.6 - 수술 장면/환부 노출 흡수 (CAP-04 canonical 흡수)"
399:    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
406:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
427:    # Phase Beta CA-DEFER-33 (evidence absence) 안 기간/대상/대상 명시 부재 검사 강화 - 명시된 정상 케이스 silent pass
434:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
455:> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).
529:> **CAP-17 정정**: contextExceptions 적용 시 — finding 안 카테고리가 `appliesTo.categories[]` 와 일치 + finding span 과 exception pattern span 이 같은 문장 (KSS fallback 시 정규식 한계) 안 overlap 또는 인접해야 함. `fail` composite 룰 (예: `guarantee-composite-001`) 은 안전 보장 위해 예외 미적용.
559:slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
567:> Phase Alpha 안 P-006 slot 격상 미합류 — TreatmentPage 실 schema (C0004) 안 `results` · `pricing` 필드 부재. body_markdown 단일 필드 안에서 키워드 매칭 필요 — `body-regex` matchCondition kind 신설 후 Phase Beta 합류. v0.1 안 RiskInference 안 slotMatches 입력 항상 `[]` (빈 배열).
608:│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
609:│   ├── exceptions.ts      # contextExceptions 적용 (CAP-17)
623:  contextExceptions: ContextException[];
637:- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
638:- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
639:- `feature` scope 룰 → skip + warnings.push (CA-DEFER-16)
641:- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
689:  contextExceptions: ContextException[],
712:  4. ApproverRole · legalBasis · triggeredBy="static-rule" 메타 채움
714:  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
723:- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
724:- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
725:- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
743:Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).
773:  triggeredBy: "static-rule" | "inferred" | "explicit" | "llm-assist";
781:## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01 · CAP-17 정정)
803:- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
840:**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
848:- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
849:- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)
851:**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).
865:  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);
869:  if (!pageTypeId) throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);
873:    throw new ComplianceConfigError(`Article 은 articleType required`);
880:  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
887:  // 6. inlineRiskFlags 추출 (§ 8)
899:  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
903:    inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
951:  // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)
971:      inlineRiskFlagsEvidence: inlineFlagResult.evidence,
1013:- 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)
1018:- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
1019:- ComplianceConfigError throw 시 envelope 생성 불가 → ComplianceRecord INSERT 안 됨 → 운영자 콘솔 안 "compliance config error" 표시 + 룰 카탈로그 또는 finding payload 점검 안내
1039:    triggeredBy: 'static-rule',   // CONTENT_STANDARDS § 7.2 enum cascade 회피 (CAP-16)
1047:## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01 · CAP-05·20·21·22 정정)
1086:> CONTENT_STANDARDS § 7.1 cascade — metadata 안 7 신규 필드 (모두 optional). CA-CASCADE-06.
1101:### 9.2 Phase Beta 합류 시 (CA-DEFER-18)
1109:## 10. RiskInference 자동 추론 (CA-INFER-01 · CAP-12·13 정정)
1114:type RiskInferenceResult = {
1120:export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
1138:  for (const flag of input.inlineRiskFlags) {
1186:function buildHighGateFinding(input: ComplianceCheckInput, inference: RiskInferenceResult): Finding {
1187:  const triggeredBy = determineTriggeredBy(input);   // CAP-13 - input 만 검사
1196:    triggeredBy,
1276:- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker
1325:## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소 · CAP-18·19 정정)
1349:      "triggeredBy": "static-rule",
1358:    "inlineRiskFlagsEvidence": { /* ... */ },
1386:  inlineRiskFlagsEvidence: Record<InlineRiskFlag, Array<{ location, matchedText }>>;
1412:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01
1422:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01 · CAP-10 acceptance blocker
1467:### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)
1476:### 16.4 inlineRiskFlags (5건 · CAP-05 정정)
1480:| 23 | "최고의" 매칭 → category "최상급" → SoT 7 카테고리 안 미포함 → includes-effect-claim 미활성 (CAP-05) | inlineRiskFlags=[] |
1486:### 16.5 RiskInference (7건 · CAP-11·12 정정)
1492:| 30 | P-002 + inlineRiskFlags=[includes-pricing] → High | flag MAX 결합 |
1496:| 34 (CAP-12) | P-010 + articleType=notice + inlineRiskFlags=[includes-event] + explicit=Low → inlineFlag High 격상 + explicit Low 영향 없음 | evaluatedSteps 4건 · contributingSteps 2건 (pageType + inlineRiskFlag) |
1511:| 39 (CAP-35) | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 + includes-effect-claim flag + RiskInference High 가상 finding | findings 안 ruleId 안 'guarantee-composite-001' 포함 · 'risk-level-high-gate' 포함 · automatedDecision='block' · findings.length ≥ 2 (정확 count 안 고정 - "contains ruleIds" 검증) |
1519:| 42 | contentType='LegalDocument' 입력 → check() throw ComplianceConfigError | buildLegalDocumentExemptEnvelope 호출 시 정상 envelope |
1534:| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
1535:| 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
1536:| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
1546:| **17.b** (CAP4-02 신설 · CAP5-01 정정) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). 각 action 안 책임 흐름을 wrap: (a) **`submitForReviewAction`** — `check()` 또는 `buildLegalDocumentExemptEnvelope()` + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`approveContentAction`** — `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 + `evaluatePublishable` 흐름 wrap. (c) **`rejectContentAction`** — `assertTransitionAllowed` + transition validation 흐름 wrap. (d) **`publishContentAction`** — `evaluatePublishable` + publish transition + ComplianceRecord 'pre-publish' → 'published' 전이 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) return { ok: false, formError: e.message }; if (e instanceof ReviewerEligibilityError) return { ok: false, formError: e.message }; throw e; }` — 일반 Error 는 500 boundary 통과 (Next.js error.tsx). **`mapComplianceErrorToResult` helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · `mapComplianceErrorToResult(e: unknown): ActionResult \| null` shape 반환 · 매핑 안 되면 null → 호출자 throw bubble). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합. | server-actions.ts patch + action-errors.ts 신규 (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
1548:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
1552:## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)
1554:- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
1555:- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
1556:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1557:- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
1558:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
1559:- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
1560:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 **27 SoT 슬롯 → canonical 매핑** (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1 + duplicate display 1 = 27 표현 · 26 acceptance count · CAP-04 cycle 4 정정)
1561:- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
1562:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)
1570:| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
1572:| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
1576:| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
1577:| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
1587:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1588:| 2026-05-19 | **v0.6** | **Codex 자동 비평 cycle 5 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. **모든 acceptance precondition PASS** (27 SoT 슬롯 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1. 누계 cycle 1+2+3+4+5 = 53 finding 전건 수용. 주요 patch: **CAP5-01** § 17.b 안 4 action 책임 분리 명시 — M0_PLAN § 6.1 action 책임 정합 (submitForReviewAction = check + persist + auto-gate · approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · rejectContentAction = transition validation · publishContentAction = evaluatePublishable + publish transition). `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. ComplianceConfigError + ComplianceTransitionError + ReviewerEligibilityError 3 error type form-level 변환. |
1589:| 2026-05-19 | v0.5 | **Codex 자동 비평 cycle 4 2 finding (blocking 0·major 2·minor 0·nit 0) 전건 수용**. blocking 0 도달 (acceptance precondition 근접). closeable 100%. 수렴 추세 36 → 11 → 3 → 2. 누계 cycle 1+2+3+4 = 52 finding 전건 수용. 주요 patch: **CAP4-01** § 2.4 산수 정정 — § 3.8 합계 6 → 5 (단독 어휘 별도 row 분리 처리) · 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 미등록 + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count) · plan 추가 단독 어휘 row 1 (비-SoT-count) = 표 28 row. 흡수 9 목록 정확 명시 (§ 3.3 false-credential-001 포함 · § 3.9 duplicate display row 비-count). CA-CASCADE-07 안 "27 SoT 슬롯 매핑" 통일. **CAP4-02** § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (ComplianceConfigError → ActionResult formError 변환 · 일반 Error 는 500 boundary 통과 · mapComplianceErrorToResult helper). |
1590:| 2026-05-19 | v0.4 | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰". |
1591:| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1592:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 646ms:
apps/web/src/lib/compliance\check.ts:10:import { ComplianceConfigError } from "./types";
apps/web/src/lib/compliance\check.ts:61:    throw new ComplianceConfigError(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:421: *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:424:export function calculateFinalRoles(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:432:      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:436:      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:473:export function evaluatePublishable(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:481:    finalRoles = calculateFinalRoles(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:486:    if (err instanceof ComplianceConfigError) {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:580:    throw new ComplianceConfigError(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:685:### 6.1 4 server action 시그니처 (CA-ACTION-01)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:775:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:858:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:859:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
apps/web/src/lib/compliance\eligibility.ts:7:import { ReviewerEligibilityError } from "./types";
apps/web/src/lib/compliance\eligibility.ts:15: * assertActionEligibility 안 TenantResolveError throw → ReviewerEligibilityError 변환.
apps/web/src/lib/compliance\eligibility.ts:28:      throw new ReviewerEligibilityError(`Reviewer eligibility denied: role=${role} reason=${err.reason}`);
apps/web/src/lib/compliance\entity-actions.ts:17:  ComplianceConfigError,
apps/web/src/lib/compliance\entity-actions.ts:18:  ComplianceTransitionError,
apps/web/src/lib/compliance\entity-actions.ts:19:  ReviewerEligibilityError,
apps/web/src/lib/compliance\entity-actions.ts:42:export async function submitForReviewAction(
apps/web/src/lib/compliance\entity-actions.ts:99:        console.error("[submitForReviewAction] audit emit failed", err);
apps/web/src/lib/compliance\entity-actions.ts:113:    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
apps/web/src/lib/compliance\entity-actions.ts:114:    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
apps/web/src/lib/compliance\entity-actions.ts:123:    console.error("[submitForReviewAction] unexpected", err);
apps/web/src/lib/compliance\entity-actions.ts:128:export async function publishContentAction(
apps/web/src/lib/compliance\entity-actions.ts:190:        console.error("[publishContentAction] audit emit failed", err);
apps/web/src/lib/compliance\entity-actions.ts:202:    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
apps/web/src/lib/compliance\entity-actions.ts:203:    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
apps/web/src/lib/compliance\entity-actions.ts:212:    console.error("[publishContentAction] unexpected", err);
apps/web/src/lib/compliance\publishable-check.ts:5:import { ComplianceConfigError } from "./types";
apps/web/src/lib/compliance\publishable-check.ts:6:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
apps/web/src/lib/compliance\publishable-check.ts:13:export function evaluatePublishable(
apps/web/src/lib/compliance\publishable-check.ts:22:    finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\publishable-check.ts:24:    if (err instanceof ComplianceConfigError) {
apps/web/src/lib/compliance\final-roles.ts:5:import { ComplianceConfigError } from "./types";
apps/web/src/lib/compliance\final-roles.ts:14:export function calculateFinalRoles(
apps/web/src/lib/compliance\final-roles.ts:22:      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
apps/web/src/lib/compliance\final-roles.ts:25:      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
apps/web/src/lib/compliance\server-actions.ts:14:import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
apps/web/src/lib/compliance\server-actions.ts:17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
apps/web/src/lib/compliance\server-actions.ts:18:import { evaluatePublishable } from "./publishable-check";
apps/web/src/lib/compliance\server-actions.ts:57:    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
apps/web/src/lib/compliance\server-actions.ts:74:  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
apps/web/src/lib/compliance\server-actions.ts:156:  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
apps/web/src/lib/compliance\server-actions.ts:159:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:171:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:186:  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
apps/web/src/lib/compliance\server-actions.ts:190:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:195:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:243:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:249:    const publishable = evaluatePublishable(record, record.content_type as ContentType);
apps/web/src/lib/compliance\server-actions.ts:275:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:297:    throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
apps/web/src/lib/compliance\server-actions.ts:311:  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
apps/web/src/lib/compliance\server-actions.ts:314:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:325:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:334:  if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
apps/web/src/lib/compliance\server-actions.ts:336:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:394:  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
apps/web/src/lib/compliance\server-actions.ts:396:  if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
apps/web/src/lib/compliance\server-actions.ts:399:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\server-actions.ts:404:  const publishable = evaluatePublishable(record, args.contentType);
apps/web/src/lib/compliance\server-actions.ts:406:    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
apps/web/src/lib/compliance\server-actions.ts:415:  if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
apps/web/src/lib/compliance\server-actions.ts:441:    throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
apps/web/src/lib/compliance\transitions.ts:4:import { ComplianceTransitionError } from "./types";
apps/web/src/lib/compliance\transitions.ts:25:    throw new ComplianceTransitionError(
apps/web/src/lib/compliance\types.ts:73:export class ComplianceConfigError extends Error {
apps/web/src/lib/compliance\types.ts:74:  override readonly name = "ComplianceConfigError";
apps/web/src/lib/compliance\types.ts:76:export class ComplianceTransitionError extends Error {
apps/web/src/lib/compliance\types.ts:77:  override readonly name = "ComplianceTransitionError";
apps/web/src/lib/compliance\types.ts:79:export class ReviewerEligibilityError extends Error {
apps/web/src/lib/compliance\types.ts:80:  override readonly name = "ReviewerEligibilityError";
apps/web/src/lib/compliance\__tests__\compliance.test.ts:4:import { calculateFinalRoles, isRoleSatisfied } from "../final-roles";
apps/web/src/lib/compliance\__tests__\compliance.test.ts:5:import { evaluatePublishable } from "../publishable-check";
apps/web/src/lib/compliance\__tests__\compliance.test.ts:9:import { ComplianceConfigError, ComplianceTransitionError } from "../types";
apps/web/src/lib/compliance\__tests__\compliance.test.ts:11:describe("calculateFinalRoles — 시나리오 1·2·3·12 일부", () => {
apps/web/src/lib/compliance\__tests__\compliance.test.ts:13:    expect(calculateFinalRoles("Article", "Low")).toEqual(["operator"]);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:16:    expect(calculateFinalRoles("Article", "Medium")).toEqual(["medical", "operator"]);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:19:    expect(calculateFinalRoles("LegalDocument", "Low")).toEqual(["legal", "operator"]);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:22:    expect(calculateFinalRoles("Article", "High", true)).toEqual(["legal", "medical", "operator"]);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:25:    expect(() => calculateFinalRoles("Article", "Low", false, ["alien"])).toThrow(ComplianceConfigError);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:28:    expect(() => calculateFinalRoles("Article", "Low", false, ["client"])).toThrow(ComplianceConfigError);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:79:    })).rejects.toThrow(ComplianceConfigError);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:110:    expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
apps/web/src/lib/compliance\__tests__\compliance.test.ts:120:describe("evaluatePublishable — 시나리오 4·5", () => {
apps/web/src/lib/compliance\__tests__\compliance.test.ts:134:    const result = evaluatePublishable(
apps/web/src/lib/compliance\__tests__\compliance.test.ts:141:    const result = evaluatePublishable(
apps/web/src/lib/compliance\__tests__\compliance.test.ts:151:    const result = evaluatePublishable(
apps/web/src/lib/compliance\__tests__\compliance.test.ts:161:    const result = evaluatePublishable(
apps/web/src/lib/compliance\__tests__\compliance.test.ts:168:    const result = evaluatePublishable(

 succeeded in 659ms:

[32;1mName                [0m[32;1m Length[0m
[32;1m----                [0m [32;1m------[0m
__tests__            
check.ts             3735
eligibility.ts       1352
entity-actions.ts    9896
final-roles.ts       2234
publishable-check.ts 2485
risk.ts              444
server-actions.ts    20007
transitions.ts       1266
types.ts             2835


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 680 -First 100' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 1 -First 470' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/entity-actions.ts | Select-Object -Skip 1 -First 230' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/types.ts | Select-Object -Skip 1 -First 100' in C:\Users\assag\solution\website-exposure
 succeeded in 695ms:
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
  recordId: string, reason: string, role: ApproverRole, actorUserId: string,
): Promise<void>;

export async function publishContent(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string, recordId: string, actorUserId: string,
): Promise<void>;
```

### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정

REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade:

| eventType | trigger | payload shape |
|---|---|---|
| `content-submitted-for-review` | submitForReview action 성공 | `{contentType, contentRef, recordId, entryId, finalRoles, pageRiskLevel}` |
| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
| `content-published` | publishContent action 성공 | `{contentType, contentRef, recordId, recordVersion}` |

emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).

### 6.3 advisory lock (CA-ACTION-02) — CAM-27 정정

```typescript
// approveContent 안 race 차단
const key = hashUuidTo64Bit(recordId);  // CAM-27 정정 — hashtextextended(uuid::text) 또는 UUID 의 16바이트를 2개 int8 로 분할
await tx`SELECT pg_advisory_xact_lock(${key})`;
```

CAM-27 정정 — `hashtext()` 32-bit 충돌 가능성 → `hashtextextended()` (64-bit) 또는 UUID 자체를 2개 int 로 분리 사용 (`pg_advisory_xact_lock(int1, int2)`). M0 v0.1 채택 = `hashtextextended('compliance:' || record_id, 0)`.

### 6.4 status 전이 table (CA-ACTION-06)

```typescript
// transitions.ts
const TRANSITIONS: Record<string, string[]> = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};
```

REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.

## 7. § 8.1 시나리오 cascade — CAM-28 정정

| # | 시나리오 | 통과 기준 | 검증 방식 |
|---|---|---|---|
| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
| 12 | check() stub High 입력 (explicit or inferred) → 가상 finding `m0-stub-risk-level-high-gate` 주입 · gateRequired=true · automatedDecision='gate' | M0 High 가상 finding | vitest |
| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
| 14 | published entity가 record_phase='pre-publish' record 참조 시도 → trigger `published_content_compliance_guard` RAISE | DB level 발행 게이트 무결성 | e2e |
| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |

## 8. 작업 단위

| # | 작업 | 산출물 |

 succeeded in 735ms:
// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
// 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ContentType,
  SubmitContentType,
} from "./types";
import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
import { check, buildLegalDocumentExemptEnvelope } from "./check";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
import { evaluatePublishable } from "./publishable-check";
import { assertReviewerEligibility } from "./eligibility";

const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };

/**
 * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
 *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
 */
async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
}

function isAllowedSubmitType(t: string): t is SubmitContentType {
  return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
}

export type SubmitForReviewArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  contentRow: { status: string; risk_level?: string | null; body?: string };
};

export type SubmitForReviewResult = {
  recordId: string;
  entryId: string;
  finalRoles: ApproverRole[];   // CAMC-07/10
  pageRiskLevel: "Low" | "Medium" | "High";
};

/**
 * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
 */
export async function submitForReview(
  tx: ScopedTx,
  ctx: TenantContext,
  args: SubmitForReviewArgs,
): Promise<SubmitForReviewResult> {
  if (!isAllowedSubmitType(args.contentType)) {
    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  }
  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");

  const checkInput = {
    contentType: args.contentType,
    contentRef: args.contentRef,
    body: args.contentRow.body ?? "",
    metadata: {
      explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
    },
  };
  const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
    ? buildLegalDocumentExemptEnvelope(checkInput)
    : await check(checkInput);

  const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);

  // ComplianceRecord INSERT (pre-publish)
  const slaHours = SLA_DUE_HOURS.P0;
  const recordRows = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
      record_phase, record_version, metadata
    ) VALUES (
      ${ctx.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${envelope.meta.pageRiskLevel}::risk_level,
      ${JSON.stringify(envelope.result)}::jsonb,
      'pre-publish'::compliance_record_phase,
      1,
      ${JSON.stringify({
        manualReview: envelope.meta.manualReview,
        catalogVersion: envelope.meta.catalogVersion,
        catalogHash: envelope.meta.catalogHash,
        ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
      })}::jsonb
    )
    RETURNING id
  `;
  const recordId = recordRows[0]!.id;

  // ReviewQueueEntry INSERT (open)
  const entryRows = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'manual-review'::review_queue_type,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${finalRoles}::approver_role[],
      ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
    )
    RETURNING id
  `;
  const entryId = entryRows[0]!.id;

  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
}

export type ApproveContentArgs = {
  recordId: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
};

export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };

/**
 * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 * AND 게이트 충족 시 in-review → approved 자동 전이.
 */
export async function approveContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: ApproveContentArgs,
): Promise<ApproveContentResult> {
  assertReviewerEligibility(ctx, args.role);
  await acquireRecordLock(tx, args.recordId);

  // entry + record FOR UPDATE
  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  const entry = entryRows[0]!;
  if (!entry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
    );
  }
  // CAMC3-01: entry vs args 정합 — drift 차단
  const expectedContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
    );
  }

  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
  if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
    throw new ComplianceTransitionError(
      `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
    );
  }
  if (record.content_type !== expectedContentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${expectedContentType}/${args.contentRef}`,
    );
  }

  // 중복 approve idempotent
  if (isRoleSatisfied(record, args.role)) {
    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
  }

  // 슬롯 채움 + entity 전이
  const now = new Date();
  if (args.role === "operator") {
    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  } else if (args.role === "medical") {
    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.physician_approver = ctx.userId; record.physician_approved_at = now;
  } else if (args.role === "legal") {
    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  }

  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  if (entry.status === "open") {
    await tx`
      UPDATE review_queue_entry
         SET status = 'in-progress'::review_queue_status,
             assigned_to = ${ctx.userId}::uuid,
             assigned_at = ${now.toISOString()}::timestamptz,
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
  }

  // entity status 전이 review-queued → in-review (첫 approve)
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = CASE
         WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
         ELSE status
       END,
       updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);

  // AND 게이트 평가
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));

  let entryStatus: "in-progress" | "resolved" = "in-progress";
  if (allApproved) {
    // entity in-review → approved → publishable (publishable evaluator pass 시)
    const publishable = evaluatePublishable(record, record.content_type as ContentType);
    const targetStatus = publishable.publishable ? "publishable" : "approved";
    await tx.unsafe(`
      UPDATE ${args.contentTable}
         SET status = '${targetStatus}'::content_publication_status,
             updated_at = now()
       WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
    `);
    // entry resolved
    await tx`
      UPDATE review_queue_entry
         SET status = 'resolved'::review_queue_status,
             resolved_at = ${now.toISOString()}::timestamptz,
             resolved_by = ${ctx.userId}::uuid,
             resolution_type = 'approved',
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
    entryStatus = "resolved";
  }

  return { allApproved, entryStatus };
}

function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  return finalRoles.every((r) => isRoleSatisfied(record, r));
}

export type RejectContentArgs = {
  recordId: string;
  reason: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
};

/**
 * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
 */
export async function rejectContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: RejectContentArgs,
): Promise<void> {
  assertReviewerEligibility(ctx, args.role);
  if (args.reason.trim().length < 50) {
    throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
  }
  await acquireRecordLock(tx, args.recordId);

  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
  // CAMC3-01 정정: content_type/content_ref drift 검증.
  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  const rejEntry = entryRows[0]!;
  if (!rejEntry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
    );
  }
  const expectedRejContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
    );
  }
  // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
  const recRejRows = await tx<{ content_type: string; content_ref: string }[]>`
    SELECT content_type::text AS content_type, content_ref FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  `;
  if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  if (recRejRows[0]!.content_type !== expectedRejContentType || recRejRows[0]!.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${recRejRows[0]!.content_type}/${recRejRows[0]!.content_ref}, args=${expectedRejContentType}/${args.contentRef}`,
    );
  }

  const now = new Date();
  await tx`
    UPDATE review_queue_entry
       SET status = 'resolved'::review_queue_status,
           resolved_at = ${now.toISOString()}::timestamptz,
           resolved_by = ${ctx.userId}::uuid,
           resolution_type = 'rejected',
           metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
           updated_at = now()
     WHERE id = ${rejEntry.id}::uuid
  `;
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = 'rejected'::content_publication_status,
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);
}

export type PublishContentArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  recordId: string;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
};

export type PublishContentResult = { recordVersion: number };

/**
 * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
 *   entity.status → published + published_at 채움.
 *   publishable evaluator 통과 검증.
 */
export async function publishContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: PublishContentArgs,
): Promise<PublishContentResult> {
  assertReviewerEligibility(ctx, "operator");
  await acquireRecordLock(tx, args.recordId);

  // record FOR UPDATE
  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           record_phase::text AS record_phase, record_version,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
  // CAMC4-01 정정: record vs args 정합 검증
  if (record.content_type !== args.contentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${args.contentType}/${args.contentRef}`,
    );
  }

  const publishable = evaluatePublishable(record, args.contentType);
  if (!publishable.publishable) {
    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  }

  // CAMC-06 정정: entity 현 status='publishable' assert
  const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
    SELECT status::text AS status FROM ${args.contentTable}
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
     FOR UPDATE
  `);
  if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
  assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");

  const now = new Date();
  // (1) compliance_record record_phase 전환 (record ID 보존)
  await tx`
    UPDATE compliance_record
       SET record_phase = 'published'::compliance_record_phase,
           published_at = ${now.toISOString()}::timestamptz,
           published_by = ${ctx.userId}::uuid,
           updated_at = now()
     WHERE id = ${args.recordId}::uuid
  `;
  // (2) entity status → published + published_at + compliance_record_id 채움.
  //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
  const updated = await tx.unsafe<{ id: string }[]>(`
    UPDATE ${args.contentTable}
       SET status = 'published'::content_publication_status,
           published_at = '${now.toISOString()}'::timestamptz,
           compliance_record_id = '${args.recordId}',
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
       AND status = 'publishable'::content_publication_status
     RETURNING id
  `);
  if (updated.length !== 1) {
    throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
  }
  return { recordVersion: record.record_version };
}

 succeeded in 709ms:
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
// 모든 6 entity edit page 가 사용.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { submitForReview, publishContent } from "./server-actions";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type SubmitContentType,
} from "./types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

const ENTITY_ROUTES: Record<SubmitContentType, string> = {
  Article: "articles",
  TreatmentPage: "treatments",
  LegalDocument: "legal-documents",
  FAQ: "faqs",
  Publication: "publications",
  MediaAppearance: "media-appearances",
};

export async function submitForReviewAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
        const rows = await tx.unsafe<{ status: string; risk_level: string | null }[]>(`
          SELECT status::text AS status,
                 ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
            FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const out = await submitForReview(tx, ctx, {
          contentType,
          contentRef,
          contentRow: { status: rows[0]!.status, risk_level: rows[0]!.risk_level },
        });
        // entity status draft → review-queued
        await tx.unsafe(`
          UPDATE ${table}
             SET status = 'review-queued'::content_publication_status, updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
        `);
        return { ok: true as const, ctx, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-submitted-for-review",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-07/10 정정: finalRoles · pageRiskLevel 포함
          payload: {
            contentType,
            contentRef,
            recordId: result.out.recordId,
            entryId: result.out.entryId,
            finalRoles: result.out.finalRoles,
            pageRiskLevel: result.out.pageRiskLevel,
          },
        });
      } catch (err) {
        console.error("[submitForReviewAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      // LWI-02 정정: LegalDocument 는 clinic-profile 통합 화면 안에 mount 됨 (별 edit route 없음)
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[submitForReviewAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
  }
}

export async function publishContentAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
        //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
        const rows = await tx.unsafe<{ status: string }[]>(`
          SELECT status::text AS status FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const row = rows[0]!;
        if (row.status !== "publishable") {
          return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
        }
        // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
        const recRows = await tx<{ id: string; record_version: number }[]>`
          SELECT id, record_version FROM compliance_record
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND content_type = ${contentType}::compliance_content_type
             AND content_ref = ${contentRef}
             AND record_phase = 'pre-publish'::compliance_record_phase
           ORDER BY record_version DESC
           LIMIT 1
        `;
        if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
        await publishContent(tx, ctx, {
          contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
        });
        return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "no-record") {
      return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
    }
    if (result.ok === false && result.action === "not-publishable") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-published",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-11 정정: recordVersion 포함
          payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
        });
      } catch (err) {
        console.error("[publishContentAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[publishContentAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
  }
}

 succeeded in 710ms:
// SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result

export type RiskLevel = "Low" | "Medium" | "High";

export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
export const ALLOWED_SUBMIT_TYPES = [
  "Article", "TreatmentPage", "LegalDocument",
  "FAQ", "Publication", "MediaAppearance",
] as const;
export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];

export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

// CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
export type ComplianceCheckInput = {
  contentType: ContentType;
  contentRef: string;
  body: string;  // Markdown
  metadata: {
    pageTypeId?: string;
    articleType?: string;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;
  };
  riskRules?: unknown[];  // M0 stub — 미사용
};

// CONTENT_STANDARDS § 7.2 Finding shape
export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
export type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    fail: number;
    "content-gate": number;
    warning: number;
    info: number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};

// M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;
    catalogHash: string;
    manualReview: boolean;
    exemptReason?: string;
  };
};

// 에러 type — fail closed
export class ComplianceConfigError extends Error {
  override readonly name = "ComplianceConfigError";
}
export class ComplianceTransitionError extends Error {
  override readonly name = "ComplianceTransitionError";
}
export class ReviewerEligibilityError extends Error {
  override readonly name = "ReviewerEligibilityError";
}

codex
문서 §17.b 자체는 네 action의 책임 분리를 M0 §6.1 흐름과 같은 방향으로 적고 있습니다. 다만 실제 파일 재검증에서는 `action-errors.ts`가 없고 thin wrapper 쪽도 submit/publish만 노출되어 있어, “신규 helper 위치” 패치 주장과 구현 상태 사이의 불일치를 더 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"approveContentAction|rejectContentAction|mapComplianceErrorToResult|action-errors|from \\\"\\./action-errors\\\"|from \\\"@/lib/compliance/action-errors\\\"\" apps/web/src docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "submitForReviewAction|publishContentAction|approveContentAction|rejectContentAction" apps/web/src -S' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 1538 -First 18' in C:\Users\assag\solution\website-exposure
2026-05-19T03:35:56.354419Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: regex parse error:
    (?:approveContentAction|rejectContentAction|mapComplianceErrorToResult|action-errors|from \)
    ^
error: unclosed group

 exited 1 in 722ms:
rg: regex parse error:
    (?:approveContentAction|rejectContentAction|mapComplianceErrorToResult|action-errors|from \)
    ^
error: unclosed group

 succeeded in 736ms:
apps/web/src\lib\compliance\entity-actions.ts:42:export async function submitForReviewAction(
apps/web/src\lib\compliance\entity-actions.ts:99:        console.error("[submitForReviewAction] audit emit failed", err);
apps/web/src\lib\compliance\entity-actions.ts:123:    console.error("[submitForReviewAction] unexpected", err);
apps/web/src\lib\compliance\entity-actions.ts:128:export async function publishContentAction(
apps/web/src\lib\compliance\entity-actions.ts:190:        console.error("[publishContentAction] audit emit failed", err);
apps/web/src\lib\compliance\entity-actions.ts:212:    console.error("[publishContentAction] unexpected", err);
apps/web/src\components\forms\WorkflowActionButtons.tsx:5:import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
apps/web/src\components\forms\WorkflowActionButtons.tsx:51:  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
apps/web/src\components\forms\WorkflowActionButtons.tsx:71:  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);

 succeeded in 788ms:
| 11 | auto-gate 큐 자동 진입 + block 제외 (CAP-06) + REVIEW_WORKFLOW § 3.3 priority/SLA (CAP-33) | auto-gate.ts + sla.ts |
| 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
| 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
| 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
| 15 | Drizzle schema v0.6 — reviewQueueType enum + unique index | packages/core-content/src/schema.ts |
| 16 | manifest 21단계 (M0 19 + C0017 + C0018) | packages/migrations-runner/src/manifest.ts |
| 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
| **17.b** (CAP4-02 신설 · CAP5-01 정정) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). 각 action 안 책임 흐름을 wrap: (a) **`submitForReviewAction`** — `check()` 또는 `buildLegalDocumentExemptEnvelope()` + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`approveContentAction`** — `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 + `evaluatePublishable` 흐름 wrap. (c) **`rejectContentAction`** — `assertTransitionAllowed` + transition validation 흐름 wrap. (d) **`publishContentAction`** — `evaluatePublishable` + publish transition + ComplianceRecord 'pre-publish' → 'published' 전이 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) return { ok: false, formError: e.message }; if (e instanceof ReviewerEligibilityError) return { ok: false, formError: e.message }; throw e; }` — 일반 Error 는 500 boundary 통과 (Next.js error.tsx). **`mapComplianceErrorToResult` helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · `mapComplianceErrorToResult(e: unknown): ActionResult \| null` shape 반환 · 매핑 안 되면 null → 호출자 throw bubble). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합. | server-actions.ts patch + action-errors.ts 신규 (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
| 18 | vitest 42 scenarios (cycle 1 정정 시나리오 17a/17b · 33 · 34 · 38 · 39 · 41 추가) | __tests__/ |
| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |

---

## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)

- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "type ActionResult|interface ActionResult|ActionResult" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md apps/web/src/lib apps/web/src/app -S' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'mapComplianceErrorToResult|action-errors|approveContentAction|rejectContentAction' apps/web/src docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md -S" in C:\Users\assag\solution\website-exposure
 succeeded in 636ms:
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1018:- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1546:| **17.b** (CAP4-02 신설 · CAP5-01 정정) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). 각 action 안 책임 흐름을 wrap: (a) **`submitForReviewAction`** — `check()` 또는 `buildLegalDocumentExemptEnvelope()` + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`approveContentAction`** — `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 + `evaluatePublishable` 흐름 wrap. (c) **`rejectContentAction`** — `assertTransitionAllowed` + transition validation 흐름 wrap. (d) **`publishContentAction`** — `evaluatePublishable` + publish transition + ComplianceRecord 'pre-publish' → 'published' 전이 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) return { ok: false, formError: e.message }; if (e instanceof ReviewerEligibilityError) return { ok: false, formError: e.message }; throw e; }` — 일반 Error 는 500 boundary 통과 (Next.js error.tsx). **`mapComplianceErrorToResult` helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · `mapComplianceErrorToResult(e: unknown): ActionResult \| null` shape 반환 · 매핑 안 되면 null → 호출자 throw bubble). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합. | server-actions.ts patch + action-errors.ts 신규 (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1589:| 2026-05-19 | v0.5 | **Codex 자동 비평 cycle 4 2 finding (blocking 0·major 2·minor 0·nit 0) 전건 수용**. blocking 0 도달 (acceptance precondition 근접). closeable 100%. 수렴 추세 36 → 11 → 3 → 2. 누계 cycle 1+2+3+4 = 52 finding 전건 수용. 주요 patch: **CAP4-01** § 2.4 산수 정정 — § 3.8 합계 6 → 5 (단독 어휘 별도 row 분리 처리) · 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 미등록 + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count) · plan 추가 단독 어휘 row 1 (비-SoT-count) = 표 28 row. 흡수 9 목록 정확 명시 (§ 3.3 false-credential-001 포함 · § 3.9 duplicate display row 비-count). CA-CASCADE-07 안 "27 SoT 슬롯 매핑" 통일. **CAP4-02** § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (ComplianceConfigError → ActionResult formError 변환 · 일반 Error 는 500 boundary 통과 · mapComplianceErrorToResult helper). |

 succeeded in 637ms:
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1546:| **17.b** (CAP4-02 신설 · CAP5-01 정정) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). 각 action 안 책임 흐름을 wrap: (a) **`submitForReviewAction`** — `check()` 또는 `buildLegalDocumentExemptEnvelope()` + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`approveContentAction`** — `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 + `evaluatePublishable` 흐름 wrap. (c) **`rejectContentAction`** — `assertTransitionAllowed` + transition validation 흐름 wrap. (d) **`publishContentAction`** — `evaluatePublishable` + publish transition + ComplianceRecord 'pre-publish' → 'published' 전이 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) return { ok: false, formError: e.message }; if (e instanceof ReviewerEligibilityError) return { ok: false, formError: e.message }; throw e; }` — 일반 Error 는 500 boundary 통과 (Next.js error.tsx). **`mapComplianceErrorToResult` helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · `mapComplianceErrorToResult(e: unknown): ActionResult \| null` shape 반환 · 매핑 안 되면 null → 호출자 throw bubble). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합. | server-actions.ts patch + action-errors.ts 신규 (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1588:| 2026-05-19 | **v0.6** | **Codex 자동 비평 cycle 5 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. **모든 acceptance precondition PASS** (27 SoT 슬롯 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1. 누계 cycle 1+2+3+4+5 = 53 finding 전건 수용. 주요 patch: **CAP5-01** § 17.b 안 4 action 책임 분리 명시 — M0_PLAN § 6.1 action 책임 정합 (submitForReviewAction = check + persist + auto-gate · approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · rejectContentAction = transition validation · publishContentAction = evaluatePublishable + publish transition). `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. ComplianceConfigError + ComplianceTransitionError + ReviewerEligibilityError 3 error type form-level 변환. |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1589:| 2026-05-19 | v0.5 | **Codex 자동 비평 cycle 4 2 finding (blocking 0·major 2·minor 0·nit 0) 전건 수용**. blocking 0 도달 (acceptance precondition 근접). closeable 100%. 수렴 추세 36 → 11 → 3 → 2. 누계 cycle 1+2+3+4 = 52 finding 전건 수용. 주요 patch: **CAP4-01** § 2.4 산수 정정 — § 3.8 합계 6 → 5 (단독 어휘 별도 row 분리 처리) · 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 미등록 + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count) · plan 추가 단독 어휘 row 1 (비-SoT-count) = 표 28 row. 흡수 9 목록 정확 명시 (§ 3.3 false-credential-001 포함 · § 3.9 duplicate display row 비-count). CA-CASCADE-07 안 "27 SoT 슬롯 매핑" 통일. **CAP4-02** § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (ComplianceConfigError → ActionResult formError 변환 · 일반 Error 는 500 boundary 통과 · mapComplianceErrorToResult helper). |

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1 → cycle 6 = 1
- acceptance 도달 cycle 추정: cycle 7

## blocking
- 없음

## major
- **CAP6-01** — CAP5-01 수용 patch의 산출물 검증이 아직 불완전합니다. cycle 5 잔존 finding 직접 인용: “**CAP5-01** § 17.b 안 4 action 책임 분리 명시 … `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일.” 현재 repo에는 `apps/web/src/lib/compliance/action-errors.ts`가 없고, `mapComplianceErrorToResult` 참조도 없습니다. 또한 `approveContentAction`·`rejectContentAction` thin server action wrapper가 `apps/web/src`에서 검색되지 않아 § 17.b의 “4 action 공통 try/catch boundary” 산출물과 실제 action surface가 불일치합니다. patch: `action-errors.ts` 신규 추가, helper shape를 실제 반환 타입(`SaveResult` 또는 명시적 `ActionResult`)과 정합시키고, 4 action wrapper 전부가 3 error type만 form-level 변환하도록 연결해야 합니다.

## minor
- 없음

## nit
- 없음

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: PASS
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: PASS

=== CYCLE SIGNAL ===
cycle: 6
total_findings: 1
blocking: 0
major: 1
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
55,957
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1 → cycle 6 = 1
- acceptance 도달 cycle 추정: cycle 7

## blocking
- 없음

## major
- **CAP6-01** — CAP5-01 수용 patch의 산출물 검증이 아직 불완전합니다. cycle 5 잔존 finding 직접 인용: “**CAP5-01** § 17.b 안 4 action 책임 분리 명시 … `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일.” 현재 repo에는 `apps/web/src/lib/compliance/action-errors.ts`가 없고, `mapComplianceErrorToResult` 참조도 없습니다. 또한 `approveContentAction`·`rejectContentAction` thin server action wrapper가 `apps/web/src`에서 검색되지 않아 § 17.b의 “4 action 공통 try/catch boundary” 산출물과 실제 action surface가 불일치합니다. patch: `action-errors.ts` 신규 추가, helper shape를 실제 반환 타입(`SaveResult` 또는 명시적 `ActionResult`)과 정합시키고, 4 action wrapper 전부가 3 error type만 form-level 변환하도록 연결해야 합니다.

## minor
- 없음

## nit
- 없음

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: PASS
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: PASS

=== CYCLE SIGNAL ===
cycle: 6
total_findings: 1
blocking: 0
major: 1
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
