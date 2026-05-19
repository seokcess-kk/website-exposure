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
session id: 019e3a5f-c003-7d21-aad7-f681dc9c7913
--------
user
Review **code implementation** of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 1**. plan acceptance (5 cycle 36 findings) 직후 첫 코드 비평.

## SoT to read

1. `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — plan SoT
2. `docs/features/compliance-assistant.md` v1.0
3. `docs/admin/REVIEW_WORKFLOW.md`
4. `docs/core/CONTENT_STANDARDS.md` § 7
5. `docs/core/DATA_MODEL.md` C-10

## Code under review

### DB migrations (3)
- `packages/core-content/migrations/C0014_compliance_record.sql` — C-10 skeleton + 4 CHECK · 17 enum
- `packages/core-content/migrations/C0015_review_queue_entry.sql` — manual-review queue · approver_role[] · partial UNIQUE
- `packages/core-content/migrations/C0016_status_unlock.sql` — 6 entity status unlock · sentinel backfill · NOT VALID + VALIDATE · published_content_compliance_guard trigger

### Drizzle schema v0.5
- `packages/core-content/src/schema.ts` — + complianceRecord · reviewQueueEntry · 6 entity compliance_record_id · skeleton-limit CHECK 해제 (legal_document · faq)
- `packages/core-content/src/index.ts` — export 추가
- `packages/migrations-runner/src/manifest.ts` — 19단계

### compliance lib (apps/web/src/lib/compliance/)
- `types.ts` — ComplianceCheckResult 7 필드 SoT · ComplianceCheckEnvelope · ApproverRole · errors
- `risk.ts` — maxRisk MAX 결합
- `final-roles.ts` — calculateFinalRoles (unknown throw) · isRoleSatisfied
- `publishable-check.ts` — evaluatePublishable (REVIEW_WORKFLOW § 7.1 6조건)
- `check.ts` — check() stub · buildLegalDocumentExemptEnvelope
- `transitions.ts` — assertTransitionAllowed (status 전이 table)
- `eligibility.ts` — assertReviewerEligibility (admin_user flag)
- `server-actions.ts` — submitForReview · approveContent · rejectContent · publishContent helpers
- `entity-actions.ts` — submitForReviewAction · publishContentAction (entity edit page wrapper)

### 어드민 UI
- `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/page.tsx` (list)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts` (approveEntryAction · rejectEntryAction)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx` (detail)
- `apps/web/src/components/forms/ReviewEntryActionForm.tsx` (approve/reject form)
- `apps/web/src/components/forms/WorkflowActionButtons.tsx` (검수 요청 / 발행 버튼)

### Article entity 통합
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx` — WorkflowActionButtons 추가
- `apps/web/src/components/forms/ArticleForm.tsx` — status read-only display
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` — saveArticle 안 status field 무시 · 신규 article 항상 draft
- `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` — 9 card (review-queue 추가)

### vitest
- `apps/web/src/lib/compliance/__tests__/compliance.test.ts` — 25 tests (final-roles · maxRisk · check stub · transitions · evaluatePublishable · isRoleSatisfied)

## What to check (cycle 1)

### Plan SoT 합치
- CA-SCHEMA-01·02·03 ComplianceRecord 컬럼 · CHECK 4건 정합 · 17종 enum
- CA-SCHEMA-04~06 ReviewQueueEntry · partial UNIQUE · approver_role[] · NOT NULL compliance_record_id
- CA-SCHEMA-07~10 6 entity unlock · NOT VALID 패턴 · sentinel backfill · published_content_compliance_guard trigger 정합
- CA-GATE-01·02·03 finalRoles · maxRisk · evaluatePublishable 6조건
- CA-CHECK-01·02·03 ComplianceCheckEnvelope · result 7 필드 SoT · check() 안 LegalDocument throw · buildLegalDocumentExemptEnvelope
- CA-ACTION-01~07 server actions · advisory lock (hashtextextended) · assertReviewerEligibility · transition table
- CA-UI-01·02·03 /review-queue list/detail · status read-only · workflow action 버튼
- CA-CASCADE-05 manifest 19단계
- CA-CASCADE-06 audit emit 4종 (content-submitted-for-review · content-approved · content-rejected · content-published)

### 정합성 / 보안 / 원자성
- C0016 sentinel backfill — 6 entity 모두 idempotent (재실행 안전 — NOT EXISTS guard)
- C0016 published_content_compliance_guard trigger — content_type/content_ref/instance_id 매칭
- approveContent — advisory lock + FOR UPDATE + AND 게이트 atomic 전이
- publishContent — record_phase 전환 + entity status 변경 + compliance_record_id 채움
- 6 entity allowlist (ALLOWED_SUBMIT_TYPES) — submit 차단
- LegalDocument check() throw — 호출자 누락 검출
- saveArticle status field 무시 — workflow action 만 status 전이

### TypeScript / 코드 품질
- types.ts ComplianceCheckResult SoT 7 필드만 정합
- final-roles unknown role throw + canonical sort
- evaluatePublishable PublishableResult union type
- check() M0 stub envelope 분리 (result SoT vs meta)
- server-actions tx.unsafe vs tx tagged template — SQL injection 위험성 (slug.replace escape)
- entity-actions FOR UPDATE 락 사용 (publish 측은 OK, submit 측은 None)

### a11y / SEO
- review-queue list — table header · SLA 표시
- review-queue detail — approve/reject form a11y
- WorkflowActionButtons — disabled state · pending

### 시나리오
- vitest 25 tests + scenario 1~16 매핑
- M0 e2e — Docker postgres + 19 마이그레이션 + submit/approve/publish 흐름

### docs cascade 미실행
- CA-CASCADE-01·02·03·04·05·06 docs patch 는 plan acceptance commit 안 별도 — 본 cycle 코드만 검증

## Output format

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAMC-01**: <짧은 제목>
  - 위치: <file>:<line>
  - 근거(plan SoT): CA-... §...
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition 점검
- 6 entity sentinel backfill idempotency: <PASS|FAIL>
- check() stub LegalDocument throw: <PASS|FAIL>
- evaluatePublishable 6조건: <PASS|FAIL>
- advisory lock hashtextextended: <PASS|FAIL>
- vitest 25 tests PASS: <PASS|FAIL>
```

가능한 한 광범위하게 보고, 파일을 line 단위로 인용. 한국어로 응답.

codex
리뷰 모드로 진행하겠습니다. 먼저 SoT 문서와 변경 파일을 빠르게 펼쳐서 계획 요구사항과 실제 구현의 차이를 라인 단위로 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/CONTENT_STANDARDS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/features/compliance-assistant.md' in C:\Users\assag\solution\website-exposure
 succeeded in 884ms:
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

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity 모두 (CAM2-03 정정).
--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).

-- (4-a) Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (4-b) TreatmentPage — risk_level 컬럼 존재
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  COALESCE(t.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
-- (4-d) FAQ — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op).
-- (4-e) Publication — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

-- (4-f) MediaAppearance — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE — 6 entity 모두.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;

-- (Step 7) published_content_compliance_guard trigger — CAM-08 정정.
--   BEFORE INSERT/UPDATE ON each entity. status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 일치 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  IF TG_TABLE_NAME = 'article' AND record_row.content_type <> 'Article' THEN
    RAISE EXCEPTION 'content_type mismatch: % vs %', TG_TABLE_NAME, record_row.content_type;
  END IF;
  -- treatment_page · legal_document · faq · publication · media_appearance 동일 매핑 (반복 생략)
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'content_ref mismatch: % vs %', record_row.content_ref, NEW.slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
-- treatment_page · legal_document · faq · publication · media_appearance 동일 trigger (반복 생략)
```

**결정 (CA-SCHEMA-07~10)**:
- (CAM-07) NOT VALID + sentinel backfill + VALIDATE 단계 분리 — 기존 published row 우회 안전. 운영 시 sentinel ComplianceRecord 식별자 `metadata @> '{"sentinel":true}'` 로 추후 republish 흐름 가이드 marker.
- (CAM-08) `published_content_compliance_guard` BEFORE trigger — DB level 발행 게이트 검증. CHECK constraint 로는 cross-table reference 검증 불가하므로 trigger 사용 명시.
- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.

## 3. AND 게이트 평가 결정 — CAM-04·05·06·16 정정

### 3.1 finalRoles 계산 (CA-GATE-01) — CAM2-04 정정

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

const KNOWN_ROLES = new Set<string>(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력. unknown role 감지 시
 *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
 *   error 변환 → 운영자가 룰 카탈로그 정정. M0 v0.1 stub 은 빈 array 보장이므로 effective no-op.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
    if (r === "client") {
      // M0 v0.1: client 역할 미합류 (CA-DEFER-10). 룰이 client 를 요구하면 fail closed.
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);  // 위 검증으로 narrow safe
  }
  return Array.from(roles).sort();  // canonical sort
}
```

### 3.2 maxRisk MAX 결합 (CA-GATE-02) — CAM-04 정정

```typescript
// apps/web/src/lib/compliance/risk.ts
const ORDER: Record<RiskLevel, number> = { "Low": 0, "Medium": 1, "High": 2 };
export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) if (ORDER[l] > ORDER[max]) max = l;
  return max;
}
```

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정, CAM2-04 추가 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(
      contentType, record.page_risk_level, record.prior_review_required,
      autoCheck.requiredApproverRoles ?? [],
    );
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }
  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck.automatedDecision === "block") reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
  // (6) warning 강제 처리 정책 — M0 stub: warningAck 미구현 (CA-DEFER-05 · 항상 충족 가정)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
```

**결정**:
- (CAM-06) publishable evaluator 가 REVIEW_WORKFLOW § 7.1 6조건 모두 evaluate. M0 stub 미구현 영역 (priorReview·staleFlags·warningAck) 은 안전 방향 fail closed — priorReviewRequired=true 면 publish 금지. M0 v0.1 priorReviewRequired=false fixed 라 effective no-op.
- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.

## 4. check() stub 결정 — CAM-03·04·05·09 정정, CAM2-01·02 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정

CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// ComplianceCheckResult 는 CONTENT_STANDARDS § 7.2 SoT 그대로 import — 7 필드만.
//   summary · catalogVersion · catalogHash · exemptReason 은 result 안 들어가지 않음.

export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
  };
};

// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
//   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel: input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low",
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
      manualReview: false,
      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
    },
  };
}
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04·05) — CAM2-02 정정

**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.

```typescript
// apps/web/src/lib/compliance/check.ts
import type { Finding } from "@glitzy/core-content";

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
      "Use buildLegalDocumentExemptEnvelope() instead."
    );
  }

  // MAX 결합 (격하 금지 — CAM-04)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // High 입력 시 가상 finding (CAM-05). Finding shape 는 CONTENT_STANDARDS § 7.2 Finding SoT.
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      category: "risk-level-virtual",
      pattern: "",
      severity: "content-gate",
      location: { start: 0, end: 0 },
      requiredApproverRoles: ["medical"],
      triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  // ComplianceCheckResult SoT — 7 필드만. summary/catalogVersion/catalogHash 등 추가 필드 없음.
  return {
    result: {
      automatedDecision,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      findingsBySeverity: {
        fail: 0,
        "content-gate": gateRequired ? 1 : 0,
        warning: 0,
        info: 0,
      },
      requiredApproverRoles: gateRequired ? ["medical"] : [],
      findings,
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-06)

```typescript
// submitForReview 안 호출 흐름:
const envelope = contentType === "LegalDocument"
  ? buildLegalDocumentExemptEnvelope(input)
  : await check(input);

// compliance_record INSERT
INSERT INTO compliance_record (..., page_risk_level, auto_check_result, metadata, ...)
VALUES (..., envelope.meta.pageRiskLevel, envelope.result, jsonb_build_object(
  'manualReview', envelope.meta.manualReview,
  'catalogVersion', envelope.meta.catalogVersion,
  'catalogHash', envelope.meta.catalogHash,
  ...(envelope.meta.exemptReason ? { 'exemptReason': envelope.meta.exemptReason } : {})
), ...)
```

- `compliance_record.auto_check_result` = `envelope.result` (CONTENT_STANDARDS § 7.2 SoT 그대로)
- `compliance_record.metadata` = envelope.meta 의 추가 영역 (pageRiskLevel 은 별도 컬럼 + metadata 양쪽 기록 권장)
- M0 stub 의 High 가상 finding 시 gateRequired=true — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.

## 5. 어드민 UI 결정 — CAM-18 정정

### 5.1 /admin/{slug}/review-queue 화면 (CA-UI-01)

list page:
- queue_type='manual-review' + status IN ('open', 'in-progress') row
- columns: 콘텐츠 유형 · 콘텐츠 ref · pageRiskLevel · finalRoles · status · priority · SLA 마감 · assigned

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
|---|---|---|
| 1 | C0014 compliance_record migration | packages/core-content/migrations/C0014_compliance_record.sql |
| 2 | C0015 review_queue_entry migration | C0015_review_queue_entry.sql |
| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
| 5 | Compliance types + check() stub + envelope wrapper | apps/web/src/lib/compliance/types.ts + check.ts |
| 6 | maxRisk + final-roles + publishable-check + transitions helper | apps/web/src/lib/compliance/{risk, final-roles, publishable-check, transitions}.ts |
| 7 | assertReviewerEligibility helper | apps/web/src/lib/compliance/eligibility.ts |
| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
| 9 | /admin/{slug}/review-queue/page.tsx (list) | (admin) route |
| 10 | /admin/{slug}/review-queue/[entryId]/page.tsx (detail) + actions.ts | (admin) route + ReviewEntryApprovalForm component |
| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
| 12 | 6 entity edit page 안 "검수 요청" / "발행" 액션 버튼 + 기존 save action 안 status field 무시 | edit pages |
| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
| 14 | audit emit 4종 (REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade) | (각 server action 안 emitAuditEvent + CA-CASCADE-06 doc patch) |
| 15 | vitest scenarios 1~16 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 Phase Alpha 합류
- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
- `CA-DEFER-02`: RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX) — M0 stub 은 입력 MAX 만
- `CA-DEFER-04`: 캐시 2종 + cacheKey
- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
- `CA-DEFER-07`: request-changes / delegate 액션
- `CA-DEFER-11`: autoCheckResult.findings 풀명세
- `CA-DEFER-15` (CAM-02 신설): content-gate 자동 큐 진입 (ruleCatalog 합류 시)
- `CA-DEFER-16` (CAM-11 신설): Feature contentType + featureContentType

### 9.2 M1 Phase Beta 합류
- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
- `CA-DEFER-10`: client 검수자
- `CA-DEFER-12`: attachments[] 법무 의견서
- `CA-DEFER-14` (CAM-21 신설): NotificationEvent envelope (notifications Feature 합류)

### 9.3 M2+ 합류
- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
- `CA-DEFER-09`: MediaThresholdAssessment + mediaThresholdOperationalInput · analytics-reporting 통합
- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning · llmAssist · priorReviewSubmissionId · featureContentType · client 슬롯) — 각 CA-DEFER phase 매핑

## 10. Cascade markers (다른 SoT 문서로 전파)

- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker — subset 명시 + CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns 분리)
- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반)
- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
- `CA-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 9.1.1 + `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` audit matrix cascade — eventType 4종 · payload shape · emit 시점 (tx commit 후 base role) · 실패 정책

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |
| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 finding 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 28 → 5 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 5 cycle 36 findings 전건 수용. acceptance commit 7 cascade docs 동시 포함 marker (CA-CASCADE-01~06 + plan 본문). 실 SQL 코드 cascade 는 별 cycle (compliance-assistant M0 code v1.0). |
| 2026-05-18 | v0.5 | **Codex 자동 비평 cycle 4 1 finding (CAM4-01 = CAM3-02 잔재 정정) 전건 수용 patch**: § 1.1 LegalDocument 면제 항목 안 `auto_check_result 슬롯에 envelope 저장` 표현 정정 → result 슬롯은 SoT 7 필드만 · exemptReason 은 `compliance_record.metadata` 슬롯. 누계 cycle 1~4 = 36 findings 전건 수용. |
| 2026-05-18 | v0.4 | **Codex 자동 비평 cycle 3 2 finding (blocking 0·major 2·minor 0) 전건 수용 patch**: (CAM3-01) § 1.2 check() stub 요약 안 "summary 등 모두 포함" 잔재 → result 7 필드만 명시 + envelope.meta 안 추가 메타 분리. (CAM3-02) § 7 시나리오 #3 + #13 정정 — `auto_check_result.exemptReason` 잔재 → `compliance_record.metadata` 슬롯 + check() throw 검증. 누계 cycle 1+2+3 = 35 findings 전건 수용. |
| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 895ms:
# Feature — compliance-assistant

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `docs/admin/REVIEW_WORKFLOW.md`
> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. LLM API 키·민감 콘텐츠 처리 주의.
> **연관 문서**:
> - 입력·출력 인터페이스 SoT → `core/CONTENT_STANDARDS.md` § 7
> - 운영·룰 카탈로그·자동 추론 → `compliance/RISK_LEVELS.md`
> - 의료법 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 어드민 워크플로 통합 → `docs/admin/REVIEW_WORKFLOW.md`
> - 데이터 계약 ComplianceRecord → `core/DATA_MODEL.md` C-10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `compliance-assistant` (DATA_MODEL C-08 InstanceManifest.features[] 등록 — `name: "compliance-assistant"`)
- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
- **2 모드 운영**: (a) **빌드 모드** — CI 빌드 시점에 빠른 정적 룰 검사 (LLM 미사용). 결과를 ComplianceRecord에 기록, (b) **어드민 모드** — 어드민에서 콘텐츠 저장 시점에 LLM 보조 분석 추가 가능 (인간 검수 보조)
- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | CONTENT_STANDARDS § 7 cascade 동반 |
| RiskInference 알고리즘 변경 (강화) | **MAJOR** | RISK_LEVELS § 2 cascade |
| 정적 룰 checker 정정 (false-positive 감소) | PATCH | |
| LLM 보조 활성화 정책 변경 | MINOR | |
| LLM 프롬프트 템플릿 변경 | MINOR | (운영 정책 — 결과 결정성 영향 시 MAJOR) |
| 캐시 키 산정 로직 변경 | **MAJOR** | 기존 cache 무효화 |
| 운영 지표 항목 추가 | PATCH | |

### 1.2 SoT 원칙

- 입출력 인터페이스 SoT는 `CONTENT_STANDARDS.md` § 7 (본 문서는 구현)
- RiskRule 데이터·자동 추론 알고리즘 SoT는 `RISK_LEVELS.md` (본 문서는 적용)
- 의료법 카탈로그 SoT는 `MEDICAL_AD_COMPLIANCE_COMMON.md` (본 문서는 룰 로드만)
- 본 문서 = **구현·운영 SoT** (모드·캐시·LLM 보조·지표)

### 1.3 본 문서가 다루지 않는 영역

- 룰 데이터 자체 — `data/compliance-rules/` (RISK_LEVELS § 3 SoT)
- 검수자 화면·승인 흐름 — `admin/REVIEW_WORKFLOW.md`
- LLM 모델 선택·계약 — 운영 결정 (CA-01)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "compliance-assistant"      # DATA_MODEL C-08 features[].name과 동일
specVersion: "0.1"                # 본 문서 명세 버전 (안정판 도달 시 1.0)
coreRequiresMin: "1.0.0"          # Core 최소 버전
implementationKind: "node-module" # CI 빌드 + 어드민 통합 가능
activation:
  scope: "instance"               # 인스턴스별 활성화
  default: true                   # 기본 활성 — 의료기관 콘텐츠에 권장
  llmAssist:                      # LLM 보조 별도 활성화
    default: false
    requires: ["llm-api-key"]     # 구체 provider는 § 2.3 config.llmProvider로 명시
```

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `CONTENT_STANDARDS.md` § 7 | ComplianceCheckInput·Result 인터페이스 |
| `RISK_LEVELS.md` § 2 | RiskInference 알고리즘 |
| `RISK_LEVELS.md` § 3 | RiskRule 카탈로그 로드 |
| `RISK_LEVELS.md` § 5 | inlineRiskFlags 추출 |
| `DATA_MODEL.md` C-10 | ComplianceRecord 결과 기록 |
| `MEDICAL_AD_COMPLIANCE_COMMON.md` § 8 | 인용 가능 도메인 화이트리스트 |

### 2.3 InstanceManifest 통합

DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"           # 권장 default. 다른 provider 사용 시 명시 (CA-01)
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"  # 비밀 보관소 키 참조
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false
```

---

## 3. 입력·출력

### 3.1 입력 — ComplianceCheckInput (CONTENT_STANDARDS § 7.1)

```ts
type ComplianceCheckInput = {
  contentType: ContentType;
  featureContentType?: FeatureContentTypeId;
  contentRef: string;
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;
    articleType?: ArticleType;
    pageMeta?: PageMeta;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;   // CONTENT_STANDARDS § 7.1 정식 입력 슬롯 — 호출자(어드민·빌드 파이프라인)가 RiskInference 결과를 채워서 전달. 본 Feature가 단일 엔트리포인트 `check()` 호출 전 외부에서 RiskInference 실행한 경우 사용. 미지정 시 본 Feature 내부에서 자동 추론 (§ 3.3 흐름)
  };
  riskRules: RiskRule[];
};
```

### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)

```ts
type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};
```

### 3.3 단일 엔트리포인트 — `check()`

본 Feature는 **단일 엔트리포인트** `check(input)`를 노출. 호출자(어드민·빌드 파이프라인)는 RiskInference·inlineRiskFlags 추출 등을 별도 호출하지 않음.

```ts
async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
```

**입력 보강 계약**:
- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
- `metadata.articleType` 미지정 시 — `contentType="Article"`이면 fail. 그 외 콘텐츠는 articleType N/A로 처리
- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)

**내부 동작 순서** (§ 4.1 실행 순서와 동일):
1. 룰 카탈로그 로드 (캐시)
2. RiskRule 매칭 (각 finding 산출)
3. inlineRiskFlags 추출 — flag별 산출 방식 분리 (§ 4.1 5단계 / RISK_LEVELS § 5.1): `includes-effect-claim`만 매칭 category 집합 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력
4. RiskInference 실행 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 → `RiskInferenceResult` (RISK_LEVELS § 2.3.1)
5. High 가상 finding 주입·결과 집계·LLM 보조(어드민 모드)

**`metadata.inferredRiskLevel` 입력 처리** (CONTENT_STANDARDS § 7.1 SoT 정합):
- 외부에서 채워 전달된 경우 — 신뢰 입력으로 사용 (호출자 책임으로 일관성 보장). 본 Feature는 내부 재계산 생략 가능 (성능)
- 외부 미지정 시 — 본 Feature 내부에서 자동 추론 (§ 4.1 5~6단계)
- 호출자가 룰 카탈로그·slot 변경 후 stale 위험을 회피하려면 — `inferredRiskLevel` 미전달하여 내부 재계산 강제 또는 cacheKey 변경으로 자연 재계산

### 3.4 RiskInference 입력·출력 (RISK_LEVELS § 2)

본 Feature 내부에서 사용. § 3.3 `check()`가 자동 호출:

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;
  articleType?: ArticleType;
  inlineRiskFlags: InlineRiskFlag[];
  slotMatches: SlotMatch[];
  explicitRiskLevel?: RiskLevel;
};

type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;        // MAX 결합 결과
  steps: Array<{ source: string; level: RiskLevel }>;  // 산정 과정 추적
};
```

---

## 4. 빌드 파이프라인 (정적 룰 checker)

### 4.1 실행 순서

```
1. 룰 카탈로그 로드 — **meta.yaml 우선 로드** (`data/compliance-rules/meta.yaml`):
   - meta.yaml의 `loadOrder.rules[]` → rules 파일들 순차 로드·머지 (rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml)
   - meta.yaml의 `loadOrder.contextExceptions[]` → ContextException 파일 로드 (별도 컬렉션)
   - meta.yaml의 `loadOrder.tracking[]` → medical-law-tracking.yaml 등 추적 데이터 로드
   (RISK_LEVELS § 3.4 머지 알고리즘 정합. meta.yaml이 로드 계획의 기준)
2. JSON Schema 검증 — 룰 데이터 정합성 확인 (실패 시 fail)
3. ContextException[] 컬렉션 분리
4. RiskRule 매칭 실행:
   a. scope 일치 (pageType/articleType/block/field/feature/global)
   b. patternType별 매칭 (regex/keyword/phrase/composite — § 4.3·§ 4.4)
   c. contextExceptions 적용 (§ 4.4) — 예외 일치 finding 제거
   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
5. inlineRiskFlags 추출 (RISK_LEVELS § 5.1) — **flag별 산출 방식 분리**:
   - `includes-effect-claim`: § 4 RiskRule 매칭 결과의 `category` 집합 기반 (RiskRule 매칭 후 실행 — 순서 중요)
   - `includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`: 본문 정규식·어휘 매칭 + 부가 입력 평가 (`ReviewPolicy.beforeAfterPhotoAllowed`·후기 미디어 첨부 등 — RISK_LEVELS § 5.1 표)
   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
6. RiskInference 실행 (RISK_LEVELS § 2.3) — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합. § 5.1.2 컨텍스트별 false-positive 완화 적용
7. High 가상 finding 자동 주입 — 최종 `inferredRiskLevel === "High"` 시. Finding 채움 (CONTENT_STANDARDS § 7.1.2 / RISK_LEVELS § 6.1·§ 6.2 동기화):
   - `ruleId: "risk-level-high-gate"`
   - `category: "위험도 강제 검수"`
   - `pattern: "(RiskLevel=High)"`
   - `severity: "content-gate"`
   - `location: { start: 0, end: 0 }` (메타 — 콘텐츠 전체 의미)
   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
8. severity 집계 → ComplianceCheckResult 산출:
   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
   - `buildBlocked` = findings 중 fail 1+ 존재
   - `gateRequired` = findings 중 content-gate 1+ 존재
   - `hasWarnings` = findings 중 warning 1+ 존재
   - `automatedDecision` = block(fail) > gate(content-gate) > warn(warning) > pass (우선순위 흡수는 집계 수준에서만)
9. 결과를 어드민 또는 빌드 파이프라인에 반환 + ComplianceRecord(pre-publish)에 기록
```

### 4.6 Finding 메타 확장 (CONTENT_STANDARDS § 7.2 cascade)

CONTENT_STANDARDS § 7.2의 Finding 타입에 본 Feature 운영을 위한 메타 필드 cascade 추가:

```ts
type Finding = {
  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";  // 출처 추적
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // LLM 출처 시
};
```

> CONTENT_STANDARDS § 7.2의 Finding 타입에 `triggeredBy`·`llmAssistMeta` 필드 신설 cascade.

### 4.2 빌드 모드 vs 어드민 모드

| 영역 | 빌드 모드 (CI) | 어드민 모드 |
|---|---|---|
| 트리거 | CI 빌드 시 변경된 콘텐츠 + 전체 (옵션) | 어드민 콘텐츠 저장 시 |
| LLM 보조 | 미사용 (속도·결정성) | 옵션 활성화 시 사용 |
| 캐시 | 사용 (동일 hash + 룰 version → cache hit) | 사용 |
| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
| SLO | 콘텐츠 1개당 50ms (정적 룰만) | 콘텐츠 1개당 5초 (LLM 포함 시) |

### 4.3 composite 룰 평가 알고리즘

CompositeRiskRule (CONTENT_STANDARDS § 7.4):

```
1. operands[] 각각의 매칭 위치 (start, end) 산출 — character offset 기준 (UTF-16 code unit)
2. logic별 평가:
   - AND_IN_SENTENCE: 문장 분리(KSS v3+) 결과 안에 모든 operand 매칭
   - AND_IN_PARAGRAPH: 빈 줄(`\n\n`+) 분리 단락 안에 모든 operand 매칭
   - AND_NEAR: 매칭 위치 간 거리 ≤ window (character offset 기준)
3. 만족 시 composite finding 생성 — location은 첫 매칭 start ~ 마지막 매칭 end
4. severity·requiredApproverRoles·suggestion은 CompositeRiskRule 정의 따름
```

**문장 분리기 고정** (CA-03 해소):
- 한국어 문장 분리 — **KSS (Korean Sentence Splitter) v3+** 채택. Python 또는 동등 포팅
- KSS 설치 실패·미지원 환경 fallback — 정규식 `[.!?][\s]+` (조잡한 fallback, warning 로깅)
- offset 기준 — 원본 본문의 UTF-16 code unit position

### 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 정합)

```
각 finding에 대해:
1. ContextException[]을 다음 조건으로 필터:
   a. appliesTo.categories[]에 finding.category 포함 OR
   b. appliesTo.ruleIds[]에 finding.ruleId 포함
2. 위 1에서 빈 결과면 본 finding은 예외 미적용 (그대로 유지)
3. 1에서 통과한 예외 각각에 대해:
   a. appliesTo.scopes[]가 명시되어 있으면, 본 finding의 scope와 매칭 검증 (미명시 시 전체 scope 적용)
   b. ContextException.pattern을 patternType(regex/keyword/phrase)별 평가
   c. 평가 대상 텍스트 — finding.location의 매칭 텍스트 + **주변 문맥 (같은 문장)**
   d. 매칭 성공 시 본 finding은 결과에서 제거 (로그·audit에는 보존)
4. 1개라도 ContextException이 매칭하면 finding 제거 (OR 결합)
```

> "같은 위치" 조건은 **같은 문장 내**(KSS 분리 기준)에서 ContextException.pattern이 매칭하면 적용 — finding.location 정확히 일치할 필요 없음 (안전 권유 표현이 같은 문장에 있으면 룰 매칭 무력화).

---

## 5. LLM 보조 인터페이스

### 5.1 활성화 조건

- `features[name="compliance-assistant"].config.llmAssist === true` (DATA_MODEL C-08)
- 어드민 모드에서만 사용 (빌드 모드는 결정성 우선)
- API 키는 인스턴스별 비밀 보관소에 저장 (운영 정책)

### 5.2 LLM 호출 시점

다음 시점에서 LLM 보조 분석 호출:
- 정적 룰 매칭 결과 + 자동 추론 결과가 어드민 검수 큐 진입 트리거 (`gateRequired=true`)
- 어드민 검수자가 "LLM 분석 요청" 액션 명시
- 정적 룰의 false-negative 의심 — 운영자 수동 요청

### 5.3 프롬프트 구조

```
[시스템]
당신은 의료기관 콘텐츠의 의료광고법 준수를 검토하는 보조 분석기입니다.
의료법 제56조·제57조 + 시행령 제23조·제24조 + MEDICAL_AD_COMPLIANCE_COMMON.md § 3 카탈로그 기반.

[입력]
- 콘텐츠 본문 (Markdown)
- 페이지 타입·ArticleType·페이지 위험도
- 정적 룰 검수 결과 (findings[])

[요청]
1. 정적 룰이 놓친 표현 위험 항목 식별
2. 각 항목에 의료법 조문 매핑
3. severity 제안 (info | warning | fail | content-gate)
4. 대체 표현 제안

[출력 형식]
JSON — § 5.4
```

### 5.4 LLM 출력 형식

```ts
type LlmAssistResult = {
  additionalFindings: Finding[];        // 정적 룰이 놓친 finding (제안). § 5.4.1 규약 적용
  reanalyzedFindings: Array<{          // 정적 룰 finding의 재평가
    ruleId: string;
    suggestedSeverity?: Severity;
    reasoning: string;
  }>;
  overallAssessment: string;            // 자연어 종합 분석
  confidence: number;                   // 0~1, LLM의 분석 신뢰도
  modelId: string;                      // 호출 모델 ID
  promptVersion: string;
  invocationCost?: { inputTokens: number; outputTokens: number };
};
```

#### 5.4.1 LLM additionalFindings의 Finding 채움 규약

- **ruleId**: 정적 룰 카탈로그 미등록 항목 — **결정적 synthetic ID** 사용. `llm-suggestion-<hash>-<seq>` 형식.
  - hash = SHA-256(category + span.start + span.end + 매칭 텍스트) 8문자 prefix
  - seq = **canonical sort 후 동일 hash 내 순번** (0부터 시작). canonical sort 키 = (category 알파벳 순 → reasoning 텍스트 SHA-256 hash 사전순). LLM 출력 순서 변경에 영향받지 않음. offset 산정 실패(`location={0,0}`·`pattern=""`) 케이스에서도 안정 참조 보장
  - 동일 본문·동일 위치·동일 카테고리·동일 순번은 항상 같은 ID 생성 (LLM 비결정성 영향 없음). audit·warning acknowledgement·검수자 수락 등의 finding 참조 안정성 보장
- **category**: LLM이 분류한 의미적 카테고리 — 기존 카탈로그 카테고리와 일치하면 그대로, 새로운 카테고리는 자유 문자열 허용
- **pattern**: 매칭 텍스트 그대로 (offset 산정 가능 시) 또는 빈 문자열 (불가 시)
- **location**: 본문 내 정확한 offset 산정 가능 시 채움. 산정 실패 시 `{ start: 0, end: 0 }` (메타·콘텐츠 전체 의미)
- **triggeredBy**: `"llm-assist"` 명시 (CONTENT_STANDARDS § 7.2 Finding 메타)
- **llmAssistMeta**: 모델·프롬프트 버전·신뢰도 기록

### 5.5 LLM 결과 처리 — human-in-loop·저장 슬롯

- LLM 출력의 `additionalFindings`는 **자동 적용하지 않음** — 검수자에게 제안으로 노출
- 신뢰도(confidence) 0.7 미만은 검수자 화면에서 별도 강조 표시
- LLM 출력 자체는 audit log에 기록 (prompt·response·model·timestamp)

**저장 슬롯**:
- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)

---

## 6. RiskInference 통합

### 6.1 자동 추론 산출

RISK_LEVELS § 2.3 알고리즘 그대로 적용. 본 Feature가 구현 책임.

### 6.2 inlineRiskFlags 추출 (RISK_LEVELS § 5.1)

**inlineRiskFlag enum 5종** (RISK_LEVELS § 5.1):
- `includes-effect-claim`
- `includes-pricing`
- `includes-event`
- `includes-before-after`
- `includes-testimonial`

**추출 알고리즘** — `includes-effect-claim`은 § 4 RiskRule 매칭 결과의 `category` 집합(7개 카테고리: 효과 단정·전문성 단정 단독·전문성 단정 결합·보장·수치/기간 단정·수치/기간 보장·체질 맞춤) 중 1개 이상 매칭 시 활성. 나머지 4개 flag는 RISK_LEVELS § 5.1 표의 정규식·어휘 매칭. § 4.1 실행 순서 5단계.

### 6.3 컨텍스트별 false-positive 완화 (RISK_LEVELS § 5.1.2)

- LegalDocument.documentType별 제외
- LocationProfile 안내 필드 제외
- Article articleType=notice 제외
- 본 완화는 RiskLevel 격상 단계만 — `inlineRiskFlags[]` 출력에는 포함 (감사 정보)

---

## 7. 룰 카탈로그 로드

### 7.1 로드 순서 (RISK_LEVELS § 3.4)

```
0. **meta.yaml 우선 로드** — loadOrder 인덱스 읽음 (§ 4.1 단계 1과 동일)
1. meta.yaml.loadOrder.rules[] 순서로:
   rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml
2. meta.yaml.loadOrder.contextExceptions[] — context-exceptions.yaml (별도 컬렉션)
3. meta.yaml.loadOrder.tracking[] — medical-law-tracking.yaml (개정 추적)
```

### 7.2 머지·overrides

- RISK_LEVELS § 3.4.1·§ 3.4.2 머지 알고리즘 그대로 적용
- 동일 `id` 중복 fail
- `overrides[]`는 최대 1개 (중복 fail)

### 7.3 로드 캐시

- 룰 카탈로그는 빌드 1회당 1회 로드. 메모리 캐시
- 카탈로그 변경 시 (meta.yaml `catalogVersion` 갱신) 캐시 무효화
- 어드민 핫리로드 — 어드민 콘솔에서 카탈로그 다시 로드 액션

---

## 8. 캐시·idempotency·재실행

### 8.1 캐시 키 산정

```
cacheKey = hash(
  contentBody,                          // 본문 정규화(공백/줄바꿈 표준화) 후 hash (SHA-256)
  contentType,                          // CONTENT_STANDARDS § 7.1
  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
  contentRef,                           // 대상 콘텐츠 @id
  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
  reviewPolicyHash,                     // ReviewPolicy(C-13) 직렬화 hash — `beforeAfterPhotoAllowed` 등 inlineRiskFlags 산정 입력
  mediaAttachmentsHash,                 // 콘텐츠에 첨부된 미디어 파일 목록 hash — 후기·전후사진 미디어 변경 추적
  ruleCatalogVersion,                   // meta.yaml catalogVersion (6파일 통합)
  ruleFileHashes,                       // 각 룰 파일의 개별 hash (cascade 추적용)
  llmAssistEnabled,                     // true/false
  llmProvider,                          // anthropic·openai 등
  llmModel,                             // "claude-sonnet-4-6" 등
  promptVersion,                        // LLM 활성화 시
  strictMode                            // true 시 warning도 빌드 차단 — automatedDecision 산출에 영향
)
```

### 8.2 캐시 계층 — 2종 분리

본 Feature의 캐시는 2종으로 분리:

| 캐시 종류 | 목적 | TTL |
|---|---|---|
| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
| **운영 TTL 캐시** (operational TTL cache) | 동일 콘텐츠에 짧은 시간 내 반복 호출 시 LLM 비용 절약 | instance 설정 (기본 86400초) |

- **hit/miss 흐름**: 운영 TTL 캐시 hit → 결과 반환. miss → 영속 결과 캐시 조회. 영속 hit → 결과 반환 + TTL 캐시 채움. miss → 전체 실행 + 영속·TTL 모두 저장
- **TTL 만료**: 운영 TTL 캐시만 만료. 영속 결과 캐시는 cacheKey 입력 중 하나가 변경되어야 무효화 (예: 룰 카탈로그 갱신)

### 8.3 idempotency 보장

- 동일 cacheKey → 영속 결과 캐시로 항상 동일 결과
- LLM 결과의 비결정성도 영속 캐시로 안정화 (한 번 산출된 결과 보존)
- 동일 콘텐츠에 동시 호출 시 — 중복 LLM 호출 회피 (request deduplication — § 8.5 또는 CA-06)

### 8.4 강제 재실행 — 룰 카탈로그 변경 처리

본 Feature는 룰 카탈로그 변경 시 콘텐츠를 **즉시 일괄 재호출하지 않음** — 비용·워크플로 정합성 이유. 다음 분리된 흐름으로 처리:

**(a) 영향 published ComplianceRecord에 stale 표시 (RISK_LEVELS § 7.1.3)**:
본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
- `kind="all"` — 전체 published record `staleFlags.legal=true`
- `kind="rule-matched"` — `affectedRuleIds[]`에 매칭된 finding을 보유한 record만 (finding ruleId 역색인 사용)
- `kind="content-type"` — `staleScope.contentTypes[]` 매칭 record만

**(b) 재검수 사이클 진입 (REVIEW_WORKFLOW § 6.2)**:
- staleFlags 갱신 → 콘텐츠 상태 `published → stale → review-queued` 자동 전이
- 어드민 재검수 큐가 새 pre-publish ComplianceRecord(recordVersion 증가) 생성하면서 본 Feature를 호출
- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출

**(c) 어드민 "재검수" 액션 — 캐시 무시·강제 실행**: 운영자가 명시 트리거 시 즉시 본 Feature 재호출 (큐 우회).

**(d) 의료법 개정 트리거**: medical-law-tracking.yaml revision 추가 → (a) staleFlags 갱신만 자동 수행. 이후 (b) 어드민 재검수 큐 처리.

---

## 9. 운영 지표 (SLO·관측성)

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| **빌드 모드 처리 시간** (per content) | 정적 룰 checker만 | < 50ms (p95) |
| **어드민 모드 처리 시간** (per content, LLM 포함) | LLM 호출 포함 | < 5초 (p95) |
| **운영 TTL cache hit ratio** | TTL hit / (hit + miss) | > 70% (어드민 모드 운영 누적 후) |
| **영속 결과 cache hit ratio** | 영속 hit / (영속 hit + miss) | > 50% (운영 누적 후) |
| **LLM 호출 실패율** | LLM API 오류·타임아웃 | < 1% |
| **operator-acknowledged ratio** | warning 중 operator가 "acknowledged"(인정)로 종결한 비율. **false-positive 추정 보조 지표만** (acknowledged ≠ false-positive 직접) | < 30% (M2+ 운영 누적, 운영 감 추적용) |
| **operator-resolved ratio** | warning 중 operator가 "resolved"(본문 정정)로 종결한 비율 | M2+ 누적 후 baseline 산정 |
| **LLM-accepted finding ratio** | LLM 제안 중 검수자가 수락한 비율. **false-negative 추정 보조 지표만** (수락된 LLM finding이 정적 룰 false-negative 직접 지칭하지 않음) | < 10% (M2+, baseline 후 hard target) |

> ⚠️ **precision/recall 정확한 산정**: 본 Feature의 false-positive·false-negative 정확 산정은 **외부 정답지(ground truth)** 가 필요. v1.0에서는 operator/검수자 액션 기반 보조 지표만 제공. 정답지 운영은 M3+ 누적 후 결정 (CA-09).

### 9.2 측정·로깅

- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
- LLM 호출 — 모델·토큰·비용·결과 audit log
- false-positive/negative — 검수자 acknowledged 로그 기반 자동 집계 (M2+)

### 9.3 알림

- LLM API 실패율 1% 초과 — 운영팀 알림
- 처리 시간 SLO 미달 (p95 기준) — 일일 요약

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. 룰 카탈로그 파일 작성 (data/compliance-rules/)
# 3. LLM 키 설정 (옵션 — .env 또는 비밀 보관소)
# 4. 빌드 시 자동 실행
```

### 10.2 InstanceManifest 설정 예시

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false              # true 시 warning도 빌드 차단 (운영 정책)
```

### 10.3 비활성화 — 예외 승인 인스턴스 한정

본 Feature는 **의료기관 인스턴스에서 강제 활성이 기본**. 비활성은 다음 흐름으로만 허용:

1. **표준 정책**: 의료기관 인스턴스는 `features[name="compliance-assistant"].enabled=true` 의무. InstanceManifest 검증 시 비활성 인스턴스는 빌드 fail
2. **예외 승인 트랙**: 클라이언트가 비활성 요청 시 — Glitzy 슈퍼 어드민 승인 + 책임 면제 합의서 첨부 후 인스턴스에 `complianceAssistantExemptApproval` 객체 설정 (DATA_MODEL C-08 v0.12 cascade 완료). 본 객체가 있을 때만 비활성 허용. 필드: `approvedBy`·`approvedAt`·`exemptionAgreementUrl`·`reason`
3. **비활성 인스턴스의 REVIEW_WORKFLOW 영향**:
   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
   - **finalRoles 산정** — 비활성 모드에서는 룰 매칭이 없으므로 `requiredApproverRoles[]`는 비어 있음. 다음 기본 게이트는 룰 매칭 없이도 자동 보존 (REVIEW_WORKFLOW § 4.1):
     - `operator` (peerReviewer) — 전 콘텐츠 공통 필수
     - `medical` — riskLevel ∈ {Medium, High} 시 (Medium/High 판정은 어드민 수동)
     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
     - `legal` — `priorReviewRequired === true` 시 자동 (legal 검수자의 매체 판정 단계)
   - **ArticleType 기반 추가 역할** — 어드민이 수동 명시:
     - `review-case`·전후사진 노출 콘텐츠 → `["medical", "legal"]` (수동)
     - `event-price` → `["legal"]` (수동)
   - 비활성 모드 finalRoles는 운영자/검수자가 수동 결정·기록 (audit log)
   - 어드민 발행 화면에 영구 경고 배너 표시 (비활성 사유·예외 승인 ID·일자)
4. **책임 한계**: 비활성 인스턴스의 의료광고법 위반 리스크는 운영자/클라이언트 자체 책임 (예외 승인 합의서에 명시)

---

## 11. 빌드 검증 — 룰 레벨

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | 룰 카탈로그 JSON Schema 검증 실패, **본 Feature `enabled=true` + 룰 카탈로그 부재**(`data/compliance-rules/` 미생성·meta.yaml 없음), LLM 활성화 + API 키 부재 (어드민 모드), composite 룰 평가 오류, RiskInference 입력 누락 |
| **warning** | LLM 호출 타임아웃·재시도 후 실패 (어드민 모드만), KSS 미설치로 fallback 사용 시 |
| **content-gate** | (본 Feature는 결과만 산출 — content-gate 직접 적용 없음. 출력 결과로 어드민 워크플로가 큐 진입 결정) |

> § 9.1 운영 지표(cache hit ratio·처리 시간 SLO 등)는 빌드 검증 룰이 아닌 **운영 관측·알림 영역** — § 9.3 알림 처리.

> **룰 카탈로그 부재 fail 분기**: 본 Feature `enabled=false` (예외 승인 인스턴스, § 10.3) 시 룰 카탈로그 부재는 fail 아님. M0/M1 초기 구현 단계에서는 본 Feature 활성화 + 룰 카탈로그 작성 동시 진행이 표준. MEDICAL_AD_COMPLIANCE_COMMON § 0 "checker 활성화 이후 fail" 조건과 정합.

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| CA-01 | LLM 모델 선택·계약 — Anthropic Claude vs OpenAI GPT vs 자체 모델 | 운영 결정 |
| CA-04 | LLM 프롬프트 버전 관리·운영 — 본 문서 vs 별도 파일 | M2+ 운영 |
| CA-05 | LLM 비용 budget·인스턴스별 한도 | 운영 정책 |
| CA-06 | request deduplication 구현 — Redis vs 메모리 lock | 인프라 결정 |
| CA-07 | strictMode 정책 — 인스턴스별 vs Glitzy 표준 | 운영 정책 |
| CA-09 | precision/recall 정답지(ground truth) 운영 | M3+ 누적 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~CA-02~~ | DATA_MODEL C-08 features[] config cascade | v0.2 — DATA_MODEL C-08 v0.10 cascade로 `features[].config` 필드 추가 |
| ~~CA-03~~ | 한국어 문장 분리 라이브러리 | v0.2 — KSS v3+ 채택. fallback은 정규식 |
| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
| ~~CA-10~~ | complianceAssistantExemptApproval 플래그 | v0.4 — DATA_MODEL C-08 v0.12 cascade로 `complianceAssistantExemptApproval` 필드 신설 (approvedBy·approvedAt·exemptionAgreementUrl·reason) |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |

 succeeded in 914ms:
# Core — 콘텐츠 작성 표준 (AEO·AI 스니펫·의료광고 표현)

> **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: Core가 생성·관리하는 콘텐츠의 작성 표준. AEO·AI 스니펫 친화 구조, 콘텐츠 블록 표준, 의료광고법 표현 가이드(금지·대체), 페이지 타입·ArticleType별 룰, compliance-assistant 인터페이스, 빌드 검증을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 표현 리스크 어휘 회피.
> **연관 문서**:
> - 페이지 타입 정의 → `core/PAGE_TYPES.md`
> - 데이터 계약 → `core/DATA_MODEL.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
> - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
> - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **콘텐츠 작성 표준 = 5개 영역**: 일반 규약(톤·문체) / AEO·AI 스니펫 친화 구조 / 콘텐츠 블록 표준 / 의료광고 표현 / 페이지·ArticleType별 룰.
- **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
- **빌드 검증**: 자체 룰 checker가 본 문서의 fail/warning/content-gate 룰을 적용. 외부 LLM 검수(compliance-assistant)는 별도.
- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
- 페이지 타입별 콘텐츠 슬롯·필수 블록은 `PAGE_TYPES.md`가 정의, 본 문서는 **각 슬롯에 들어가는 콘텐츠의 표현·구조 표준**을 다룬다.

---

## 1. 일반 규약

### 1.1 톤·문체

| 항목 | 표준 |
|---|---|
| 어조 | 정중·전문적·차분. 마케팅 과장형 X |
| 인칭 | 의료기관 = "저희"/"본원" / 환자 = "환자분"·"내원자" (3인칭은 신중) |
| 종결 | 평어체 금지. "-습니다·-입니다" 일관 |
| 감정 어휘 | 자제 ("기적·놀라운·혁신적" 등 X) |
| 의문문 | H2 헤딩으로만 사용 (AEO 친화), 본문에 빈번한 의문문 자제 |
| 영문 | 의료 전문 용어 영문 병기는 첫 등장 시 1회 (예: "비만(obesity)") |

### 1.2 언어

- 기본 `ko-KR` (SEARCH_STANDARDIZATION § 2.1 정합)
- 영문·중문 등 다국어는 `InternationalSupport.internationalLanguagePages[]` 활성화 시. 본 표준은 한국어 기준

### 1.3 콘텐츠 길이

| 페이지·블록 | 권장 길이 |
|---|---|
| PageMeta.description | 80~160자 (SEARCH_STANDARDIZATION § 2.1 정합) |
| PageMeta.title | 10~70자 |
| Article.headline | 1~120자 |
| Article.summary | 80~200자 |
| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
| TreatmentPage.summary | 50~160자 |
| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |

### 1.4 변경 정책

- 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
- 표현 룰 강화 (기존 콘텐츠 위반 가능): **MAJOR** (마이그레이션 가이드 필수)
- 페이지 타입별 룰 신설: MINOR
- 새 ArticleType 추가: MINOR

---

## 2. AEO·AI 스니펫 친화 구조

네이버 AI 사이트 브리핑·AI 스니펫·통합 랭킹 모델 시대의 핵심 — **답변 우선 배치 + 구조화 블록**.

### 2.1 답변 우선 배치 (Answer-First)

| 룰 | 레벨 | 적용 |
|---|---|---|
| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
| 페이지의 본질 질문 1개를 H1 또는 H2가 명시적으로 답변 | warning | P-006·P-008·P-010 |
| H2를 질문형으로 작성 (AEO 친화) | 권장 (silent) | P-010 Article, P-006/P-008 일부 섹션 |

**예시 (P-006 Treatment Detail 본문 시작)**:

```
[좋음]
한방 다이어트는 한약·약침·식이 상담을 결합한 4~12주의 비만 관리 프로그램입니다.
체질에 맞춘 한약 처방, 지방대사 약침, 1:1 식이 상담으로 구성되며, 평균 4주 단위로 진행 결과를 점검합니다.

[나쁨 — answer-first 위반]
다이어트는 누구에게나 어려운 과제입니다. 매년 새해마다 결심하지만 실패하는 경우가 많습니다. 그래서 본원은…
(답변이 한참 뒤로 밀림)
```

#### 2.1.1 answer-first 검사 대상 (Markdown AST)

빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:

1. Frontmatter 영역 제외 (YAML/TOML 헤더)
2. 페이지의 `<main>` 또는 첫 H1 노드 이후 영역만 대상
3. 다음 노드 종류는 **스킵** (메타·구조 노드):
   - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph

> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).

### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)

- **H1 페이지당 1개**. 페이지 주제 명시
- H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
- H3은 H2 하위 세부 단위
- H4 이하 자제 (AI 스니펫 추출 난이도 ↑)

| 룰 | 레벨 |
|---|---|
| H1 누락 또는 2개 이상 | fail |
| H2 위계 건너뜀 (H1 → H3) | warning |
| H4 이하 5회 초과 사용 | warning |

### 2.3 구조화 블록 의도적 혼합

본문에 다음을 의도적으로 섞어 배치하면 AI 스니펫 채택률 ↑:

| 블록 종류 | 형식 | AI 스니펫 추출 친화 |
|---|---|---|
| 문단형 답변 (1~2문장) | 일반 텍스트, H2 직후 | 문장형 스니펫 |
| 불릿 리스트 | `<ul><li>` 3~10개 | 리스트형 스니펫 |
| 번호 리스트 (단계·순서) | `<ol><li>` 3~10개 | 단계형 스니펫 |
| 표 (비교·항목) | `<table>` 2~5컬럼 | 표형 스니펫 |
| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
| 인용·근거 | `<blockquote>` + 출처 | 신뢰도 신호 |

| 룰 | 레벨 |
|---|---|
| P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
| 리스트 항목이 2개 이하인 `<ul>`/`<ol>` | warning (리스트 효과 약함) |
| 표가 1행만 있는 경우 | warning |

---

## 3. 콘텐츠 블록 표준

### 3.1 Q&A 블록

**구조**:
```markdown
**질문(Q)**: 한방 다이어트는 며칠 만에 효과가 나타나나요?

답변: 한방 다이어트의 효과 인지 시점은 개인의 체질·생활 습관·복약 순응도에 따라 다르며, 일반적으로 4주 단위로 변화를 점검합니다.
세부적으로는 한약 복용 1~2주차에 식욕 변화·소화 패턴 변화를, 4주차부터 체성분 변화 추세를 관찰합니다.
```

**책임 분리**:
- 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립

| 룰 | 레벨 |
|---|---|
| Q&A 블록의 질문이 의문문 아닌 경우 | warning |
| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |

### 3.2 리스트 (불릿·번호)

**용도별 선택**:
- 순서·인과 관계가 있으면 번호 리스트 (`<ol>`)
- 동등 항목 나열이면 불릿 리스트 (`<ul>`)

**룰**:
- 항목 길이 일관 (한 항목이 5줄 넘으면 별도 단락으로 분리 검토)
- 항목 시작 어휘 일관 (모두 명사형 또는 모두 동사형)

### 3.3 표 (Table)

**구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.

**용도**:
- 비교 (시술별·프로그램별 차이)
- 수치·범위 (소요 시간·횟수)
- 시간표 (진료시간·휴진 안내)

**위험도 주의**:
- 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
- 가격 비교표는 **High 위험** (§ 4 + P-102 정책)

### 3.4 콜아웃 (Callout / Note)

**종류**:
- `info` — 일반 안내 (Low 위험)
- `warning` — 주의사항 (Medium 권장)
- `disclaimer` — 의료 면책 (의료 정보 페이지에 권장)

**예시**:
```
⚠️ 본 페이지의 의료 정보는 일반적인 안내이며, 개별 환자의 진료를 대체하지 않습니다. 정확한 진단·치료는 의료진과 상담하세요.
```

### 3.5 인용·근거 (Citation)

논문·학회·공식 자료 인용 시:
- 인용 출처 명시 (학회지·발행연도·저자)
- 외부 URL은 가능한 경우 첨부
- `Article.embeddedMedia[type: citation]` 또는 본문 `<blockquote>` + 출처

**룰**:
- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
  - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
  - `<blockquote>` + 출처 텍스트 (학회·정부·논문명 패턴)
  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
  - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
- 위 판정 텍스트 + 인용 부재 → content-gate
- 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화

### 3.6 임베디드 미디어 (VideoObject 등)

- YouTube·Vimeo·외부 동영상 임베드
- `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)

---

## 4. 의료광고 표현 — 단일 SoT

본 문서의 **진실의 원본**. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.

### 4.1 금지 표현 (fail / content-gate)

| 카테고리 | 금지 표현 (예시) | 레벨 |
|---|---|---|
| **최상급** | "최고의·최저가·최대·최강·1위·국내 유일·세계 최초·세계 최고" | **fail** (콘텐츠 발행 차단) |
| **효과 단정** | "완치·100% 효과·반드시 효과·안전합니다·부작용 없음" | **fail** |
| **수치·기간 단정 (보장어 없음)** | "○○일 만에·○○주 만에·체중 ○○kg 감량 (수치·기간 단정, '보장'·'약속'·'반드시' 어휘 미포함)" | **content-gate** (의료진·법무 검수 필요) |
| **수치·기간 보장** | "○○kg 보장·○○일 안에 보장·○○주 약속" — 수치/기간 + 보장어 결합 | **fail** (보장 표현 통합 룰) |
| **비교 표현** | "타 병원보다·다른 의원보다·기존 ○○보다 우수" | **fail** |
| **유인성 표현** | "지금만·특가·한정·기간 한정·선착순·오늘까지" (시간·수량 압박형 환자 유인) | **fail** |
| **할인·이벤트 사실 안내** | "20% 할인 진행·○월 이벤트" (시간·수량 압박어 미포함, 사실 진술) | **content-gate** (의료광고법 환자 유인 해당 여부 법무 판정 필요. P-104·P-102에서만 허용) |
| **진단 단정** | "당신은 ○○병입니다·○○질환 확정" (자가 진단 유도 포함) | **fail** |
| **명의·권위 단정** | "최고의 명의·국내 1인자·전국 최다" | **fail** |
| **전문성 단정 (단독 어휘)** | "절대·반드시·확실히·100%" (효과·결과·보장 등 결과어와 결합되지 않은 단독 사용) | **content-gate** |
| **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
| **유명인 동원** | (의료법상 환자 유인) "○○○ 연예인이 받은" | **fail** |
| **보장 표현** | "효과 보장·결과 보장·만족 보장·재시술 무료" | **fail** |
| **체질·맞춤 과대 표현** | "당신만의 1:1 맞춤·당신의 체질에 완벽" | **content-gate** (한의 특유 표현 회색지대) |

> 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.

### 4.2 대체 표현

| 금지 표현 | 대체 표현 |
|---|---|
| "최고의 다이어트 한약" | "체질 기반 다이어트 한약 처방" |
| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
| "4주 만에 -10kg 보장" | "4주 단위로 진행 결과를 점검합니다. 변화 정도는 개인에 따라 다릅니다" |
| "타 병원보다 효과적" | (비교 자체 미사용) "본원의 진료 방식은 ○○입니다" |
| "지금 신청하시면 50% 할인" | (할인 미명시) "예약 안내는 ○○로 연락 바랍니다" |
| "유명인 ○○도 받은 시술" | (유명인 미언급) "본원 시술 사례는 ○○ 페이지에서 확인 가능합니다" — 단 후기·전후사진은 별도 ReviewPolicy 적용 |
| "효과 보장" | "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" |

### 4.3 후기·전후사진·가격 노출 — 별도 정책

| 요소 | 출처 | 표현 정책 |
|---|---|---|
| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
| 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
| 의료진 자격·논문 | DoctorProfile (C-02) | 검증 가능 사실만. "최고의 명의" 등 단정 금지 |
| 누적 통계 (TrustMetric) | ClinicProfile.trustMetrics | 기준 기간·범위·증빙 동반 (DATA_MODEL CT-01). "국내 1위·최대" 등 단정 금지 |

### 4.4 문맥 예외 카탈로그 (false-positive 방지)

다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.

| 문맥 종류 | 인식 패턴 (예시) | 예외 대상 룰 | 의미 |
|---|---|---|---|
| **safety** (의료 안전 권유) | "(반드시\|꼭) (의료진과 )?(상담\|확인)하세요", "복용 전 (반드시 )?확인" | "전문성 단정 (단독 어휘)" | 안전 권유 표현은 의료광고 위반 아님 |
| **warning-message** (주의·금기 안내) | "(절대 )?금기", "(주의\|경고)\\s*[:：]", "복용 금지", "사용 금지" | "전문성 단정 (단독 어휘)" | 안전 정보 안내 |
| **administrative** (행정·약관) | "100%\\s*(환불 불가\|환불 보증\|예약 변경 불가)" 등 법적·약관 표현 | "전문성 단정 (단독 어휘)", "보장 표현" (행정 한정) | 약관·환불·결제 안내 |

> **운영 정책**: 본 표는 v0.4 최초 — 운영 누적으로 사례 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 풍부화.

---

## 5. 페이지 타입별 콘텐츠 룰

### 5.1 P-002 About — 정체성·신뢰도

- 의료기관 정식 명칭·설립일·연혁·인증 사실 기반
- "최고의·1위" 등 단정 금지
- 인증·수상은 검증 가능 출처 첨부 (Award.verificationUrl)
- 사회공헌·후원은 사실 안내

### 5.2 P-004 Doctor Profile

- 자격·학회·논문은 검증 가능 사실
- "명의·1인자" 등 단정 금지
- 개인 스토리 (`personalStory`)에 효과 단정 금지 (의료진 본인 스토리도 후기 위험도와 유사)

### 5.3 P-006 Treatment Detail — 가장 위험도 높음

- 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
- 효과·기간·수치 단정 금지
- 후기·전후사진 포함 시 페이지 자동 High (`ReviewPolicy` 적용)
- 가격·이벤트 포함 시 자동 High
- 의료진 검토 필수

### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)

### 5.5 P-011 FAQ — 답변 단위 위험도

- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
- 효과·결과 관련 답변 → High → content-gate

### 5.6 P-101 Reviews — High-risk commercial

- 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
- 전후사진은 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed=true` + 법무 승인 기록 시에만 예외 발행

### 5.7 P-102 Pricing — High-risk commercial

- § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
- "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
- 비급여 명시 필수
- 가격 변경 시 즉시 갱신

### 5.8 P-104 News/Event — 이벤트 카테고리만 High

- 일반 소식(휴진·이전·인사) Low
- 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수

---

## 6. ArticleType별 콘텐츠 룰 (P-010)

`Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:

RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).

| ArticleType | 기본 위험도 | 콘텐츠 룰 |
|---|:---:|---|
| `notice` | Low | 휴진·이전·인사 — 사실 안내 |
| `general-medical-info` | Medium | 일반 의학 정보 — 진단·치료 단정 금지. 일반론 한정. **medical disclaimer 권장** |
| `treatment-explainer` | Medium | 특정 시술 설명 — 효과 단정 금지. 절차·원리·대상·주의사항 위주 |
| `condition-explainer` | Medium | 특정 질환 설명 — 진단 단정·자가 진단 유도 금지 |
| `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
| `review-case` | **High** | 환자 치료경험담 — 의료법 제56조 광고 금지 적용. 매체·방식별 법무 판정 필요 (§ 4.3·§ 5.6 정합). ReviewPolicy(C-13) 적용 |
| `event-price` | **High** | 이벤트·할인·가격 안내 — 의료광고법 환자 유인 금지 적용. § 5.7·§ 5.8 정합 |

### 6.1 ArticleType 자동 분류·검수

- 어드민에서 운영자가 직접 분류 (M0)
- compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)

---

## 7. compliance-assistant Feature Module 인터페이스

본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.

### 7.1 입력

```ts
type ComplianceCheckInput = {
  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
  contentRef: string;                 // 대상 콘텐츠 @id
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
    articleType?: ArticleType;        // DATA_MODEL C-04
    pageMeta?: PageMeta;              // DATA_MODEL C-06
    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
  };
  riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
};

// 둘 중 정확히 하나만 사용:
// - Core 콘텐츠: contentType 사용, featureContentType 미지정
// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
|---|---|---|
| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
| RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |

**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.

**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.

#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)

EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },   // 콘텐츠 전체 — 의미상 메타
  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
}
```

**트리거 조건**: `metadata.inferredRiskLevel === "High"` 또는 `metadata.explicitRiskLevel === "High"` (둘 중 하나라도 High이면 주입). 트리거 출처는 finding 메타에 기록(예: `triggeredBy: "inferred" | "explicit"`)하여 감사 추적성 유지.

- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
  - `effect-result-related` → `["medical"]`
  - `review-case` → `["medical", "legal"]` (의료진 + 법무 동시 필요)
  - `event-price` → `["legal"]`
  - 기타 High explicitRiskLevel/inferredRiskLevel → `["medical"]`
- Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리

#### 7.1.3 ApproverRole → ComplianceRecord 필드 매핑

```ts
type ApproverRole = "medical" | "legal" | "operator" | "client";
```

ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:

| ApproverRole | 매핑 ComplianceRecord 필드 | 의미 |
|---|---|---|
| `medical` | `physicianApprover` + `physicianApprovedAt` | 의료진 콘텐츠 승인 |
| `legal` | `legalCounsel` + `legalCounselAt` | 법무 자문·승인 |
| `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
| `client` | `clientApprover` + `clientApprovedAt` | 클라이언트 측 승인 (운영 정책 시) |

- compliance-assistant는 ApproverRole 배열만 출력 — 실제 ComplianceRecord 기록 생성·갱신은 어드민 발행 워크플로
- 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)

### 7.2 출력

```ts
type ComplianceCheckResult = {
  // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
  automatedDecision: "block" | "gate" | "warn" | "pass";
  // 세부 플래그 (편의)
  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
  // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
  requiredApproverRoles?: ApproverRole[];
  // 상세 findings
  findings: Finding[];
};

// automatedDecision 결정 규칙
// - findings에 severity="fail" 1개 이상 → "block"
// - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
// - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
// - 아니면 "pass"
//
// 최종 발행 가능 여부 (publishable)은 본 인터페이스에 포함되지 않음 — 어드민 발행 워크플로가 다음을 종합 판정:
//   1) automatedDecision !== "block"
//   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
//   3) hasWarnings=true 시 운영 정책에 따라 검토 완료 또는 일괄 인정

// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)

type Finding = {
  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
  category: string;           // § 7.4 RiskRule.category (예: "최상급")
  pattern: string;             // 매칭된 패턴 텍스트 (예: "최고의"). LLM 제안에서 정규 패턴 산출 불가 시 빈 문자열 허용
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
  suggestion?: string;        // 대체 표현 (§ 4.2 참조)
  requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
  // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
};
```

### 7.3 빌드 검증 vs 어드민 검수

| 단계 | 도구 | 처리 |
|---|---|---|
| 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
| 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |

### 7.4 RiskRule 데이터 스키마

§ 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.

```ts
// 단일 패턴 룰
type SimpleRiskRule = {
  id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
  category: string;            // § 4.1 카테고리
  pattern: string;             // 매칭 패턴 — patternType에 따라 의미 해석
  patternType: "regex" | "keyword" | "phrase";
  severity: "info" | "warning" | "fail" | "content-gate";
  scope: ContentScope[];       // 적용 범위 — § 7.4.1
  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
  exceptions?: string[];       // 예외 어구 (false-positive 방지)
  contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
  version: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

// 복합 룰 — § 7.4.3 문맥 결합 (composite)
type CompositeRiskRule = {
  id: string;
  category: string;
  patternType: "composite";
  operands: SimpleOperand[];   // 결합 대상 단일 패턴 (2개 이상)
  logic: "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
  // - AND_IN_SENTENCE: 같은 문장 내 모두 등장
  // - AND_IN_PARAGRAPH: 같은 단락(빈 줄 분리 기준) 내 모두 등장
  // - AND_NEAR: window 거리 이내 모두 등장
  window?: number;             // logic="AND_NEAR" 시 char 거리. 기본 50. 다른 logic에서는 무시
  severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];       // 법령 조문 인용 식별자 — SimpleRiskRule과 동일
  contextExceptions?: ContextException[];
  version: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

type SimpleOperand = {
  pattern: string;
  patternType: "regex" | "keyword" | "phrase";
};

type RiskRule = SimpleRiskRule | CompositeRiskRule;

// 적용 범위 — ID 타입 명시 (자유 문자열 금지)
type ContentScope =
  | { type: "pageType"; pageTypeId: PageTypeId }        // PAGE_TYPES (P-001~P-014, P-101~P-106)
  | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
  | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
  | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
  | { type: "global" };

// 문맥 예외 — § 4.4 안전·주의·행정 문맥
type ContextException = {
  kind: "safety" | "warning-message" | "administrative";  // 의료진 상담 권유·안전 주의·환불 약관 등
  pattern: string;             // 예외 인식 정규식 (예: "(상담하세요|금기|환불 불가)")
};
```

#### 7.4.1 스코프 일치 규칙

- `global` 룰은 모든 콘텐츠에 적용
- 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
- pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선

#### 7.4.2 severity 우선순위

같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):

```
fail > content-gate > warning > info
```

- 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수

#### 7.4.3 문맥 결합 룰 (composite rules)

- 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
- 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
- composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시

#### 7.4.4 운영·관리

- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
- 룰 데이터의 빌드용 표현은 별도 데이터 파일 (`compliance/rules.yaml` 또는 동등 포맷) — `compliance/RISK_LEVELS.md` 후속에서 파일 위치·포맷 확정
- 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR

---

## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)

| 레벨 | 정의 | 조치 |
|---|---|---|
| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| CS-03 | 사례·임상 데이터 인용 시 외부 검증 가능성 자동 판정 | 운영 누적 후 |
| CS-04 | 한의 특유 표현(체질·1:1 맞춤)의 회색지대 정밀 분류 | `presets/hanui-clinic/` 후속 |
| CS-05 | medical disclaimer 자동 삽입 정책 — 페이지 타입별 자동 출력 vs 운영자 명시 | UX 결정 |
| CS-06 | 다국어 콘텐츠에서 표현 룰 적용 — 영문·중문·일문 별도 사전 | M3 다국어 시 |
| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
| CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |

### 9.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
| ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
| 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 912ms:
# Admin — 검수 워크플로

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 / `docs/admin/ARCHITECTURE.md` (v0.7)
> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 사용자별 권한·승인자 식별 정보 노출 주의.
> **연관 문서**:
> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
> - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
> - 어드민 화면 구성 → `docs/admin/ARCHITECTURE.md`

---

## 0. 한 페이지 요약

- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 상태 머신 enum 변경 | **MAJOR** | 진행 중 콘텐츠 영향 |
| 큐 진입 트리거 변경 | **MAJOR** | 미검수 콘텐츠 발생 가능 |
| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
| 화면·UX 변경 | MINOR | |
| 알림 채널 추가 | MINOR | |
| 감사 로그 필드 추가 | PATCH (append-only) | |

### 1.2 SoT 원칙

- 본 문서 = **검수 워크플로 운영 SoT** — 상태 머신·큐·승인 흐름·권한
- ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)

### 1.3 본 문서가 다루지 않는 영역

- 데이터 계약 자체 — `DATA_MODEL.md`
- 룰 카탈로그·자동 추론 알고리즘 — `RISK_LEVELS.md`
- UI 시각 디자인 — `DESIGN_TOKENS.md`·`admin/ARCHITECTURE.md`

---

## 2. 워크플로 상태 머신

### 2.1 상태 enum

```ts
type ContentWorkflowState =
  | "draft"           // 작성 중 — 자동 검수 미실행
  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
  | "approved"        // 필요한 모든 역할의 승인 완료
  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
  | "published"       // 발행됨 (Git 사본 생성)
  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
  | "rejected"        // 검수자가 명시적 거부
  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
```

### 2.2 전이 다이어그램

```
                            ┌──────────────────────┐
                            │       draft          │
                            └──────────┬───────────┘
                                       │ submit-for-review (작성자) 또는 자동 트리거 (§ 3.2)
                                       ▼
                            ┌──────────────────────┐
              ┌────────────►│   review-queued      │
              │             └──────────┬───────────┘
              │                        │ assign (검수자 픽업)
              │                        ▼
              │             ┌──────────────────────┐
              │             │     in-review        │
              │             └──┬──────┬────────────┘
              │                │      │
              │     reject     │      │ approve (해당 역할)
              │   (검수자)     │      ▼
              │                │   ┌─────────────────────────────┐
              │                │   │ AND 게이트 평가 (§ 4.5)     │
              │                │   │  모든 ApproverRole 충족?    │
              │                │   └────┬──────────┬──────────────┘
              │                │       Y           N (다음 역할 검수)
              │                │       ▼           │
              │                │  ┌──────────┐     │
              │                │  │ approved │     ┘
              │                │  └────┬─────┘
              │                │       │ automatedDecision != block 재확인
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │ publishable  │
              │                │  └────┬─────────┘
              │                │       │ publish (운영자 발행 액션)
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │  published   │
              │                │  └────┬─────────┘
              │                │       │ staleFlags 발생 (§ 6)
              │                │       ▼
              │                │  ┌──────────┐
              │                │  │  stale   │
              │                │  └────┬─────┘
              │                │       │ 재검수 큐 진입
              │                └────►──┘
              │                ▼
              │       ┌──────────────┐
              │       │   rejected   │
              │       └──────┬───────┘
              │              │ 작성자가 본문 정정 후 재제출
              └──────────────┘

draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
```

### 2.3 전이 트리거

| 전이 | 트리거 | 권한 |
|---|---|---|
| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |

---

## 3. 검수 큐 (Review Queues)

### 3.1 큐 종류 3종

| 큐 | 진입 조건 | 우선순위 | 처리자 |
|---|---|---|---|
| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |

#### 3.1.1 warning 큐 이탈 조건·기록

- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)

#### 3.1.2 content-gate와 warning 동시 발생 처리

ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)

### 3.2 자동 큐 진입 트리거

다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:

- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
- 자동 위험도 추론 결과 — High 등급
- StaleFlags 발생:
  - 의료법 개정 (`medical-law-revision-<id>`)
  - 콘텐츠 본문 RiskRule 매칭 텍스트 변경
  - 가격·ReviewPolicy·전후사진 미디어 변경
  - 의료진 자격·인증 변경
  - 인용 외부 링크 만료
- LegalDocument 발행 의무(C-10 LegalDocument required)
- 운영자 수동 트리거

### 3.3 우선순위·SLA

| 처리 영역 | SLA 목표 | 알림 정책 SoT |
|---|---|---|
| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |

SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).

> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.

---

## 4. multi-role AND 게이트

### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)

콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:

```
riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
            = ComplianceRecord.pageRiskLevel 출력 결과

finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
           ∪ (riskLevel ∈ {Medium, High} ? medical : ∅)               // 등급 기본 요구
           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
```

**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):

`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.

> **개념 정리**:
> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.

### 4.2 검수자별 검수 화면

| 역할 | 검수 화면 책임 |
|---|---|
| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
| **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |

### 4.3 승인 액션

각 검수자는 자신의 역할에 한해 다음 액션 수행:

| 액션 | 결과 |
|---|---|
| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |

### 4.4 자동 차단

- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)

---

## 5. ComplianceRecord 슬롯 채움 흐름

### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)

approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:

| ApproverRole | 갱신 필드 |
|---|---|
| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |

### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)

DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.

**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
- 어드민 내부 저장소에만 존재. Git 사본·정적 빌드에 영향 없음

**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
- Git 사본·정적 빌드에 반영

### 5.3 갱신 시점

| 시점 | 동작 | 대상 |
|---|---|---|
| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |

### 5.4 ComplianceRecord 불변성·버전 모델

- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
- staleFlags 외 필드 수정 시도 — 빌드/API fail

---

## 6. StaleFlags 처리

### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)

| 트리거 이벤트 | 설정되는 flag |
|---|---|
| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
| 콘텐츠 본문 RiskRule 매칭 텍스트 영역 변경 | `medical=true` |
| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
| 의료진 자격·인증 변경 (DoctorProfile) | `medical=true` |
| 인용 외부 링크 만료 (404·5xx) | `medical=true` |
| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
| ReviewPolicy 변경 | `legal=true` |
| 전후사진 미디어 첨부·교체 | `legal=true` |
| 본문 일반 변경 | `operator=true` |
| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |

각 이벤트는 `triggeredBy`·`triggeredAt` 동시 기록.

### 6.2 stale 큐 진입·처리

- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)

### 6.3 staleFlags 우선순위

여러 flag가 동시 발생 시 우선순위:

```
legal > medical > client > operator
```

- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
- 또는 병렬 처리 허용 (기본값)

---

## 7. 발행 결정

### 7.1 publishable 산정 알고리즘

콘텐츠가 `publishable` 상태가 되기 위한 조건:

```
publishable = (1) automatedDecision !== "block"
           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
           ∧ (4) staleFlags 모두 false 또는 미설정
           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
```

위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)

### 7.2 publish 액션

- 권한: `super-admin`·`operator` (역할별 운영 정책)
- 입력: 콘텐츠 @id
- 검증: § 7.1 재실행 (auth time-of-use)
- 결과:
  - `published` 상태 전이
  - ComplianceRecord `publishedAt`·`publishedBy` 기록
  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
  - 빌드 트리거 (정적 사이트 재빌드)

### 7.3 unpublish 액션

- 권한: `super-admin`만
- 결과:
  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
  - Git 사본 제거
  - 재발행 시 워크플로 재실행

---

## 8. 사전심의 (priorReview) 흐름

### 8.1 priorReviewRequired 판정

**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:

1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)

**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
- 매체 분류 (시행령 제24조제1항·제2항)
- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
- 의료광고 정의(제56조제1항) 결합 판정

판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
- `ComplianceRecord.priorReviewRequired=true|false`
- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
- `mediaThresholdOperationalInput` 슬롯 (rolling operational 입력 자료 — 감사 보존)

#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거

`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).

```ts
async function enqueueMediaThresholdReassessment(input: {
  instanceId: Slug;
  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
  newState: "threshold-reached" | "threshold-released";
  assessmentBasisDate: ISODateString;
  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
}): Promise<{ enqueuedCount: number; reassessmentBatchId: string }>
```

**동작**:
1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
8. `analytics-reporting`이 자동 발송하는 `media-threshold-*` 이벤트는 운영 alert 성격 — 법적 판정 자체는 본 워크플로 책임

**priorReviewRequired 산정 기준 분리** (AR2-08):
- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록

### 8.2 사전심의 대상인 경우

```
1. legal 검수자 priorReviewRequired=true 기록
2. 운영자가 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출
3. 제출 ID 기록 — priorReviewSubmissionId
4. 심의 결과 도착 (외부)
5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
7. publishable 조건 § 7.1 (3) 충족
```

### 8.3 priorReview 상태 추적 화면

어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

### 9.2 알림 페이로드

본 절은 두 단계 타입을 정의:
- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
- **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)

```ts
type NotificationEvent = {
  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
  eventType: NotificationEventType;                    // § 9.1 enum
  contentRef: string;                                  // 대상 콘텐츠 @id
  contentTitle: string;
  recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
  createdAt: ISODateString;
};

type NotificationRecipient = {
  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
  recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
};

type NotificationPayload = {
  payloadId: string;                                   // UUID — fan-out 단위 ID
  eventId: string;                                     // 상위 NotificationEvent 참조
  eventType: NotificationEventType;
  contentRef: string;
  contentTitle: string;
  recipientId: string;                                 // 단건 수신자
  recipientRole: ApproverRole | "author" | "operations";
  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
  criticality: "critical" | "high" | "normal";
  metadata: object;
  createdAt: ISODateString;
};
```

#### 9.2.1 idempotency 계약

- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)

### 9.3 알림 채널·운영

- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
- Slack은 **2가지 동작 모드 분기**:
  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2

---

## 10. 감사 로그 (Audit Log)

### 10.1 기록 대상

- 모든 워크플로 상태 전이
- 모든 검수자 액션 (approve·reject·request-changes·delegate)
- ComplianceRecord 슬롯 갱신
- staleFlags 발생·해제
- publish·unpublish
- 권한 변경·로그인·로그아웃
- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적

### 10.2 audit log 페이로드

```ts
type AuditLogEntry = {
  id: string;                 // UUID
  timestamp: ISODateString;
  actorId: string;             // 사용자 ID 또는 "system" (자동 트리거)
  actorRole: AdminUserRole;
  action: AuditAction;          // § 10.2.1 enum
  contentRef: string;
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted"           // CM4-05 — abortRun
  // 인프라 결정 cascade (INFRA2-02·08)
  | "service-role-invoked"                    // INFRA2-02 — service_role break-glass 사용 추적
  | "instance-switched"                       // INFRA2-08 — super-admin cross-instance 전환
  // Spike 결정 cascade (SPIKE1-13·SPIKE2-04)
  | "signed-url-issued"                       // R2 signed URL 발급 (signature 미저장·prefix·objectKey만)
  | "signed-url-revocation-requested";        // SPIKE2-04 정정 — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer). 운영자 revoke 요청 → credential rotation 또는 object key rotation으로 후속 처리
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

---

## 11. 권한·역할

### 11.1 AdminUserRole enum

```ts
type AdminUserRole =
  | "super-admin"        // 모든 권한 (Glitzy 운영팀)
  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
  | "physician-reviewer"  // medical 역할 검수만
  | "legal-reviewer"      // legal 역할 검수만
  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
```

### 11.2 권한 매트릭스

| 액션 | super-admin | operator | physician | legal | client |
|---|:---:|:---:|:---:|:---:|:---:|
| 콘텐츠 작성·편집 | ✅ | ✅ | | | |
| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
| operator approve | ✅ | ✅ | | | |
| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
| publish | ✅ | ✅ | | | |
| unpublish | ✅ | | | | |
| 권한 관리 | ✅ | | | | |
| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |

> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
> - medical: DoctorProfile (C-02) 등록 + `credentials[]` 항목으로 의료진 자격 인증 검증
> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
> - client: 클라이언트 측 위임 권한 (RL-05)
>
> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
>
> **자격 검증 알고리즘 구현 영역**: medical 도메인 자격 매칭(한의 콘텐츠 → 한의사 등) 자동 판정은 RISK_LEVELS RL-03 미결정 영역. v1.0에서는 어드민 운영자가 자격 매칭 수동 검증·기록.

### 11.3 역할 위임

- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
- 다른 역할로의 위임 금지 — 검수 자격 분리 원칙

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AW-01 | 검수자 라운드로빈 알고리즘 (assign 자동화) — FIFO vs 워크로드 기반 | M2+ |
| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
| AW-03 | 외부 법무법인 식별자 데이터 모델 (RISK_LEVELS RL-04와 동일) | DATA_MODEL 후속 |
| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |

---

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

 succeeded in 980ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.24
> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
| `from` | `string` | ✅ | |
| `to` | `string` | ✅ | |

#### `SpecialClosure`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | |
| `reason` | `string` | optional | |
| `note` | `string` | optional | |

### CT-03. `CTAConfig` — 전환 채널 설정

**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 채널 식별자 |
| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
| `label` | `string` | ✅ | 버튼·링크 텍스트 |
| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
| `iconKey` | `string` | optional | 아이콘 식별자 |
| `style` | `enum {primary, secondary, minimal}` | optional | |
| `displayOrder` | `number` | optional | 정렬 |
| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |

> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.

---

## 4. 데이터 계약 풀명세 (M0 핵심)

### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)

**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
| `name` | `string` | ✅ | 정식 명칭 (1~100자) |
| `alternateName` | `string` | optional | 영문명 |
| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
| `slogan` | `string` | optional | 한 줄 가치 |
| `description` | `string` | ✅ | 80~300자 |
| `longDescription` | `Markdown` | optional | About 본문 |
| `foundingDate` | `Date` | optional | 설립일 |
| `founder` | `string` | optional | 대표자명 |
| `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
| `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
| `awards` | `Award[]` | optional | 인증·수상 |
| `memberOf` | `Affiliation[]` | optional | 학회·협회 |
| `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
| `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
| `logoUrl` | `URL` | ✅ | 로고 |
| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |

**하위 타입**:

#### `Address`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `streetAddress` | `string` | ✅ | 도로명 상세 |
| `addressLocality` | `string` | ✅ | 시·군 |
| `addressRegion` | `string` | ✅ | 도·광역시 |
| `postalCode` | `string` | ✅ | 우편번호 |
| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |

#### `GeoCoordinates`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `latitude` | `number` | ✅ | |
| `longitude` | `number` | ✅ | |

#### `Award`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 인증·수상명 |
| `awardedBy` | `string` | optional | 수여 기관 |
| `awardedDate` | `Date` | optional | |
| `verificationUrl` | `URL` | optional | 검증 가능 링크 |

#### `Affiliation`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 학회·협회명 |
| `role` | `string` | optional | |
| `url` | `URL` | optional | |
| `verified` | `boolean` | optional | |

#### `ResearchInstitute`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 연구 기관명 |
| `description` | `string` | optional | |
| `url` | `URL` | optional | |
| `relationship` | `enum {affiliate, partner, owned}` | optional | |

#### `SocialMediaLinks`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `naverBlog` | `URL` | optional | |
| `instagram` | `URL` | optional | |
| `youtube` | `URL` | optional | |
| `kakao` | `URL` | optional | |
| `facebook` | `URL` | optional | |
| `linkedin` | `URL` | optional | |
| `others` | `{label: string, url: URL}[]` | optional | |

#### `MediaItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `outlet` | `string` | ✅ | 매체명 |
| `title` | `string` | ✅ | |
| `date` | `Date` | optional | |
| `url` | `URL` | optional | |

#### `InternationalSupport`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `languages` | `string[]` | ✅ | ISO 639-1 |
| `interpreterAvailable` | `boolean` | optional | |
| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
| `targetCountries` | `string[]` | optional | |

### C-02. `DoctorProfile` — 의료진 권위·전문성

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `alternateName` | `string` | optional | 영문명 |
| `jobTitle` | `string` | ✅ | 직책 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
| `briefBio` | `string` | ✅ | 50~200자 |
| `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
| `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
| `photoUrl` | `URL` | optional | |
| `credentials` | `Credential[]` | ✅ | 최소 1개 |
| `education` | `Education[]` | optional | |
| `career` | `CareerItem[]` | optional | |
| `affiliations` | `Affiliation[]` | optional | |
| `publications` | `Publication[]` | optional | |
| `media` | `MediaItem[]` | optional | |
| `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
| `email` | `Email` | optional | |
| `socialMedia` | `SocialMediaLinks` | optional | |
| `consultationAvailable` | `boolean` | optional | 기본 `true` |
| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |

**하위 타입**:

#### `Credential`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {license, certification, board}` | ✅ | |
| `name` | `string` | ✅ | |
| `issuedBy` | `string` | optional | |
| `issuedDate` | `Date` | optional | |
| `expiryDate` | `Date` | optional | |

#### `Education`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `institution` | `string` | ✅ | |
| `degree` | `string` | ✅ | |
| `period` | `string` | optional | 예: `"2010-2016"` |

#### `CareerItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `organization` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `period` | `string` | optional | |

#### `Publication`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | |
| `venue` | `string` | optional | 학회지·매체 |
| `year` | `number` | optional | |
| `url` | `URL` | optional | |

### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~80자 |
| `alternateName` | `string` | optional | |
| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
| `category` | `string` | optional | 시술 카테고리 |
| `medicalSpecialty` | `Ref<C-14>` | optional | |
| `overview` | `Markdown` | ✅ | 개요 |
| `mechanism` | `Markdown` | ✅ | 원리 |
| `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
| `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
| `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
| `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
| `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
| `duration` | `string` | optional | 소요 시간 |
| `sessionCount` | `string` | optional | 권장 횟수 |
| `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
| `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
| `aftercare` | `Markdown` | optional | 시술 후 관리 |
| `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
| `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
| `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
| `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
| `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
| `heroImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |

**하위 타입**:

#### `ProcessStep`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | 단계 번호 |
| `name` | `string` | ✅ | 단계명 |
| `description` | `Markdown` | ✅ | |
| `durationMinutes` | `number` | optional | |

#### `TreatmentComponent` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
| `description` | `Markdown` | optional | |
| `included` | `boolean` | optional | 패키지 포함 여부 (default true) |

#### `VisitFlowStep` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | |
| `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
| `description` | `Markdown` | optional | |
| `durationMinutes` | `number` | optional | |
| `location` | `enum {clinic, remote, both}` | optional | |

#### `ProgramVariant`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
| `duration` | `string` | ✅ | 기간 |
| `sessionCount` | `string` | optional | 세션 수 |
| `targetSegment` | `string` | optional | 대상 분류 |
| `briefDescription` | `Markdown` | ✅ | |
| `includes` | `string[]` | optional | 포함 항목 |
| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |

#### `EvidenceNote` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
| `summary` | `string` | optional | 간략 요약 |
| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
| `publishedYear` | `number` | optional | |
| `verifiedBy` | `string` | optional | 검증자·기관 |

#### `SlotRiskOverride`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
| `level` | `RiskLevel` | ✅ | 격상 등급 |
| `reason` | `string` | ✅ | 감사 추적용 |

### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `headline` | `string` | ✅ | 1~120자 |
| `summary` | `string` | ✅ | 80~200자 |
| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
| `author` | `Ref<C-02>` | ✅ | 저자 |
| `coAuthors` | `Ref<C-02>[]` | optional | |
| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
| `datePublished` | `Date` | ✅ | 최초 발행일 |
| `dateModified` | `Date` | ✅ | 최종 수정일 |
| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
| `tags` | `string[]` | optional | |
| `readingTimeMinutes` | `number` | optional | 자동 계산 |
| `wordCount` | `number` | optional | 자동 계산 |
| `coverImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
| `relatedArticles` | `Ref<C-04>[]` | optional | |
| `relatedTreatments` | `Ref<C-03>[]` | optional | |
| `relatedConditions` | `Ref<C-11>[]` | optional | |
| `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |

**ArticleType ↔ 자동 추론 위험도**:

| ArticleType | 자동 위험도 | 운영자 오버라이드 |
|---|:---:|:---:|
| `notice` | Low | ✅ |
| `general-medical-info` | Medium | ✅ |
| `treatment-explainer` | Medium | ✅ |
| `condition-explainer` | Medium | ✅ |
| `effect-result-related` | High | ✅ (낮출 수 없음) |
| `review-case` | High | ✅ (낮출 수 없음) |
| `event-price` | High | ✅ (낮출 수 없음) |

**하위 타입**:

#### `EmbeddedMedia`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
| `url` | `URL` | ✅ | |
| `title` | `string` | optional | |
| `caption` | `string` | optional | |
| `durationSeconds` | `number` | optional | |
| `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |

**컴플라이언스 주의**:
- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
- `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
- `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).

### C-05. `RiskLevel` (enum) — 위험도 등급

```ts
type RiskLevel = "Low" | "Medium" | "High";
```

**v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).

> 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.

### C-06. `PageMeta` — 페이지별 메타 데이터

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | 10~70자, `<title>` |
| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
| `canonical` | `URL` | optional | 미지정 시 자동 생성 |
| `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
| `ogTitle` | `string` | optional | 미지정 시 `title` |
| `ogDescription` | `string` | optional | 미지정 시 `description` |
| `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
| `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
| `noIndex` | `boolean` | optional | 기본 `false` |

> 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.

### C-07. `BrandTokens` — 디자인 토큰 최종값

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
| `colors` | `ColorTokens` | ✅ | 색 토큰 |
| `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
| `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
| `radius` | `RadiusScale` | ✅ | |
| `shadow` | `ShadowScale` | ✅ | |
| `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
| `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |

> 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.

### C-08. `InstanceManifest` — 버전 고정 명세

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `instanceId` | `Slug` | ✅ | |
| `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
| `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
| `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
| `lastReleaseApprovedAt` | `Date` | optional | |

#### `RobotsOverride` (v0.11 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
| `allow` | `string[]` | optional | Allow 경로 목록 |
| `disallow` | `string[]` | optional | Disallow 경로 목록 |
| `note` | `string` | optional | 운영자 메모 |

#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
| `clsOverride` | `number` | optional | CLS budget 강화 override |
| `tbtMsOverride` | `number` | optional | |
| `bundleSizeKbOverride` | `number` | optional | |
| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |

#### `NotificationChannelsConfig` (v0.13 확장)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |

> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).

#### `VersionSpec`
SemVer 형식 (`"1.4.2"`).

#### `IANATimezone` (v0.13 신규)

IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.

#### `AnalyticsConfig` (v0.14 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
| `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |

> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).

#### `SearchVisibilityConfig` (v0.16 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.

#### `KeywordMonitoringConfig` (v0.17 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).

#### `AssetIngestionConfig` (v0.18 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
| `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
| `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |

#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)

SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
| `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
| `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
| `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
| `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
| `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |

> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).

#### `CrmSyncConfig` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |

#### `CrmIntegrationEntry` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | string | ✅ | integration 식별자 (instance scope unique) |
| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
| `apiUrl` | URL | ✅ | provider endpoint |
| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
| `legalApprovedBy` | string | ✅ | |
| `legalApprovedAt` | Date | ✅ | |
| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)

솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |

> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.

#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)

법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |

### C-09. `FeatureModuleConfig` — Feature Module 설정

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `moduleName` | `string` | ✅ | 모듈 식별자 |
| `enabled` | `boolean` | ✅ | |
| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |

### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록

**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)

#### 어드민 DB 원본 (풀데이터)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `instanceId` | `Slug` | ✅ | |
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
| `articleType` | `string` | optional | (Article인 경우) |
| `inlineRiskFlags` | `string[]` | optional | |
| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
| `peerReviewedAt` | `Date` | ✅ | |
| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
| `physicianApprovedAt` | `Date` | optional | |
| `clientApprover` | `string` | optional | |
| `clientApprovedAt` | `Date` | optional | |
| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
| `priorReviewSubmissionId` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
| `attachments` | `Attachment[]` | optional | 증빙 파일 |
| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |

#### `MediaThresholdAssessment` (v0.14 +)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
| `windowEnd` | `Date` | ✅ | |
| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |

> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.

#### `WarningAcknowledgement` (v0.8 +)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
| `operatorId` | `string` | ✅ | operator 사용자 ID |
| `timestamp` | `Date` | ✅ | |
| `note` | `string` | optional | 메모 |

#### `StaleFlags`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
| `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
| `triggeredAt` | `Date` | optional | |

#### Git 사본 (경량 빌드 참조)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
| `articleType` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | |
| `publishedAt` | `Date` | ✅ | schema datePublished |
| `lastModifiedAt` | `Date` | ✅ | schema dateModified |

### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)

**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).

**참조 페이지 타입**: P-013
**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
| `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
| `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
| `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
| `effectiveDate` | `Date` | ✅ | 시행일 |
| `lastRevisedDate` | `Date` | optional | 최종 개정일 |
| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
| `contactEmail` | `Email` | optional | 정책 문의 채널 |

**하위 타입**:

#### `LegalDocumentRevision`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | 개정일 |
| `summary` | `string` | ✅ | 개정 내용 요약 |
| `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |

**컴플라이언스 룰**:
- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.

### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)

**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
| `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
| `branchDescription` | `string` | optional | 50~200자 |
| `address` | `Address` | ✅ | 지점 주소 |
| `geo` | `GeoCoordinates` | optional | |
| `telephone` | `Phone` | ✅ | 지점 직통 |
| `fax` | `Phone` | optional | |
| `email` | `Email` | optional | 지점 이메일 |
| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
| `images` | `URL[]` | optional | |
| `transportInfo` | `Markdown` | optional | |
| `parkingInfo` | `Markdown` | optional | |
| `openingDate` | `Date` | optional | 지점 개원일 |
| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
| `branchCode` | `string` | optional | |
| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |

> v0.4 → v0.6 강조 채널 표기 변천:
> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조

> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.

### C-22. `ArticleCategory` — Article Pillar 분류

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `description` | `string` | optional | 80~200자 |
| `pillar` | `string` | optional | 상위 Pillar |
| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
| `coverImageUrl` | `URL` | optional | |
| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
| `displayOrder` | `number` | optional | |
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |

> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).

### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)

> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `instanceId` | `Slug` | ✅ | |
| `title` | `string` | ✅ | 학술 논문 제목 (1~300자) |
| `authors` | `string[]` | ✅ | 저자 이름 리스트 (min 1) |
| `journal` | `string` | optional | 학술지명 |
| `publishedDate` | `Date` | ✅ | 학술지 게재일 |
| `doi` | `string` | optional | DOI · regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` |
| `pubmedId` | `string` | optional | PubMed ID · regex `^[0-9]{1,9}$` |
| `url` | `URL` | ✅ | 외부 dereferenceable URL |
| `thumbnailUrl` | `URL` | optional | |
| `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
| `authorDoctorId` | `Ref<C-02>` | optional | 본 clinic doctor 가 저자일 때 (same-tenant composite FK) |
| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
| `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** — 외부 인용 entity |
| `publishedAt` | `Date` | conditional | status='published' 시 required |
| `metadata` | `Record<string, unknown>` | optional | |
| `createdAt` / `updatedAt` | `Date` | ✅ | |

**검수 · 위험도 · Schema**:
- CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
- RISK_LEVELS § 2: Low fixed
- Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)

### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)

> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `instanceId` | `Slug` | ✅ | |
| `title` | `string` | ✅ | 영상/방송 제목 (1~300자) |
| `channelName` | `string` | ✅ | 방송사/유튜브 채널명 |
| `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
| `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
| `durationSeconds` | `number` | optional | JSON-LD `duration: PT<seconds>S` |
| `url` | `URL` | ✅ | 외부 URL |
| `thumbnailUrl` | `URL` | optional | |
| `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
| `authorDoctorId` | `Ref<C-02>` | optional | 출연 doctor (same-tenant composite FK) |
| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
| `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** |
| `publishedAt` | `Date` | conditional | status='published' 시 required |
| `metadata` | `Record<string, unknown>` | optional | |
| `createdAt` / `updatedAt` | `Date` | ✅ | |

**검수 · 위험도 · Schema**:
- CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
- RISK_LEVELS § 2: Low fixed
- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)

EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.

**풀명세 요약** (§ 4 안 풀명세 SoT 참조):
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `question` | `string` | ✅ | 10~200자 |
| `answer` | `string` (Markdown) | ✅ | 50~2000자. public HTML render = `renderMarkdownToHtml` · JSON-LD `Answer.text` = `renderMarkdownToPlainText` |
| `displayOrder` | `number` | ✅ | 어드민 입력 순서 |
| `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
| `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
| `relatedConditionId` | `Ref<C-11>` | optional | C-11 합류 후 |
| `authorDoctorId` | `Ref<C-02>` | optional | 답변 doctor |
| `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
| `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |

**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
**검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).

### C-13. `ReviewPolicy`
필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**

### C-14. `MedicalSpecialty`
필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.

### C-15. `SchemaInput`
JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.

### C-17. `PricingPage`
필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**

### C-18. `FacilitiesPage`
필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.

### C-19. `NewsItem`
필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**

### C-20. `ReservationPage`
필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.

### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)

**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
| `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
| `displayName` | `string` | ✅ | 어드민 UI 표시명 |
| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
| `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
| `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
| `lastLoginAt` | `Date` | optional | |
| `createdAt` | `Date` | ✅ | |

#### `NotificationPreferences` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
| `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |

#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
| `firstObservedAt` | `Date` | ✅ | |
| `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
| `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
| `unsuppressedAt` | `Date` | optional | |

---

## 6. 관계 다이어그램

```
ClinicProfile (C-01)
   ├─ trustMetrics → TrustMetric[] (CT-01)
   ├─ primaryCtas → CTAConfig[] (CT-03)
   ├─ medicalSpecialty → MedicalSpecialty (C-14)
   ├─ affiliatedInstitutes → ResearchInstitute
   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+

LocationProfile (C-21) — 위치·시간·연락 SoT
   ├─ businessHours → BusinessHours (CT-02)
   ├─ reservationChannels → CTAConfig[] (CT-03)
   ├─ parentClinic → ClinicProfile (C-01)
   ├─ representativeDoctors → DoctorProfile[]
   ├─ doctorsAtLocation → DoctorProfile[]
   └─ availableTreatments → TreatmentPage[]

DoctorProfile (C-02)
   ├─ primaryLocation → LocationProfile (C-21)
   ├─ additionalLocations → LocationProfile[]
   └─ trustMetrics → TrustMetric[] (CT-01)

TreatmentPage (C-03)
   ├─ cta → CTAConfig (CT-03)
   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
   ├─ relatedDoctors → DoctorProfile[]
   ├─ relatedConditions → MedicalConditionPage[]
   └─ pageRiskLevel → RiskLevel (직접 enum)

Article (C-04)
   ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
   ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
   ├─ category → ArticleCategory (C-22)
   ├─ contentSource / externalUrl (v0.4)
   ├─ embeddedMedia → EmbeddedMedia[]
   └─ pageRiskLevel → RiskLevel

ComplianceRecord (C-10)
   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
   └─ pageRiskLevel → RiskLevel
```

---

## 7. 변경 정책

(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
| DM-07 | cross-reference 빌드 검증 | |
| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
| DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
| 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
| 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

codex
SoT 핵심은 확인했습니다. 다음으로 실제 구현 파일을 라인 번호 포함해서 읽고, 특히 마이그레이션/서버 액션/게이트 함수처럼 데이터 무결성에 직접 닿는 부분부터 검토하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/core-content/migrations/C0014_compliance_record.sql','packages/core-content/migrations/C0015_review_queue_entry.sql','packages/core-content/migrations/C0016_status_unlock.sql'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/core-content/src/schema.ts','packages/core-content/src/index.ts','packages/migrations-runner/src/manifest.ts'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files apps/web/src/lib/compliance apps/web/src/app/(admin)/admin apps/web/src/components/forms | rg \"(compliance|review-queue|ReviewEntryActionForm|WorkflowActionButtons|ArticleForm|articles/actions|articles/.*/page|admin/\\[instanceSlug\\]/page)\"" in C:\Users\assag\solution\website-exposure
 succeeded in 779ms:
### packages/core-content/migrations/C0014_compliance_record.sql
    1: -- @glitzy/core-content — C0014 ComplianceRecord (DATA_MODEL § 4 C-10·COMPLIANCE_ASSISTANT_M0_PLAN v1.0)
    2: -- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조 (mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns)
    3: -- Precondition: D0010 instance · C0005 risk_level enum
    4: 
    5: -- recordPhase enum — DATA_MODEL C-10 v0.8
    6: CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');
    7: 
    8: -- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit · app layer ALLOWED_SUBMIT_TYPES)
    9: CREATE TYPE compliance_content_type AS ENUM (
   10:   'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
   11:   'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
   12:   'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
   13:   'Feature', 'Publication', 'MediaAppearance'
   14: );
   15: 
   16: CREATE TABLE compliance_record (
   17:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   18:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
   19:   content_type compliance_content_type NOT NULL,
   20:   content_ref TEXT NOT NULL,
   21:   page_risk_level risk_level NOT NULL,
   22:   article_type TEXT,
   23:   inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
   24:   auto_check_result JSONB NOT NULL,
   25:   -- 슬롯 4종 (M0 active 3종 · client CA-DEFER-10)
   26:   peer_reviewer UUID,
   27:   peer_reviewed_at TIMESTAMPTZ,
   28:   physician_approver UUID,
   29:   physician_approved_at TIMESTAMPTZ,
   30:   legal_counsel UUID,
   31:   legal_counsel_at TIMESTAMPTZ,
   32:   client_approver UUID,
   33:   client_approved_at TIMESTAMPTZ,
   34:   prior_review_required BOOLEAN NOT NULL DEFAULT false,
   35:   prior_review_submission_id TEXT,
   36:   prior_review_passed BOOLEAN,
   37:   published_at TIMESTAMPTZ,
   38:   published_by UUID,
   39:   record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
   40:   record_version INTEGER NOT NULL DEFAULT 1,
   41:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
   42:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   43:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   44:   CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
   45:   CONSTRAINT compliance_record_published_requires_at CHECK (
   46:     record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
   47:   ),
   48:   CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
   49:     record_phase <> 'published' OR content_type <> 'LegalDocument'
   50:     OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
   51:   ),
   52:   CONSTRAINT compliance_record_med_high_requires_physician CHECK (
   53:     record_phase <> 'published' OR page_risk_level = 'Low'
   54:     OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
   55:   ),
   56:   CONSTRAINT compliance_record_published_requires_peer CHECK (
   57:     record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
   58:   ),
   59:   CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
   60:   CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
   61: );
   62: 
   63: CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
   64: CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
   65: CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
   66: CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';
   67: 
   68: ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
   69: ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;
   70: 
   71: CREATE POLICY tenant_isolation ON compliance_record
   72:   FOR ALL TO app_tenant_user
   73:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
   74:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
   75: 
   76: GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;
### packages/core-content/migrations/C0015_review_queue_entry.sql
    1: -- @glitzy/core-content — C0015 ReviewQueueEntry (REVIEW_WORKFLOW § 3 · COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.2)
    2: -- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
    3: -- Precondition: D0010 instance · C0014 compliance_record + compliance_content_type enum
    4: 
    5: CREATE TYPE review_queue_type AS ENUM ('manual-review');
    6: CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
    7: CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
    8: CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)
    9: 
   10: CREATE TABLE review_queue_entry (
   11:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   12:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
   13:   queue_type review_queue_type NOT NULL,
   14:   content_type compliance_content_type NOT NULL,
   15:   content_ref TEXT NOT NULL,
   16:   compliance_record_id UUID NOT NULL,
   17:   status review_queue_status NOT NULL DEFAULT 'open',
   18:   priority review_queue_priority NOT NULL DEFAULT 'P0',
   19:   required_roles approver_role[] NOT NULL,
   20:   assigned_to UUID,
   21:   assigned_at TIMESTAMPTZ,
   22:   sla_due_at TIMESTAMPTZ NOT NULL,
   23:   resolved_at TIMESTAMPTZ,
   24:   resolved_by UUID,
   25:   resolution_type TEXT,
   26:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
   27:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   28:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   29:   CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
   30:   CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
   31:     status <> 'resolved' OR resolved_at IS NOT NULL
   32:   ),
   33:   CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
   34:     status <> 'resolved' OR resolution_type IS NOT NULL
   35:   ),
   36:   CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
   37:     REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
   38:   CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
   39: );
   40: 
   41: CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
   42: CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
   43: CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
   44:   WHERE status IN ('open', 'in-progress');
   45: CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
   46: CREATE UNIQUE INDEX review_queue_entry_open_unique
   47:   ON review_queue_entry (instance_id, content_type, content_ref)
   48:   WHERE status IN ('open', 'in-progress');
   49: 
   50: ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
   51: ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
   52: 
   53: CREATE POLICY tenant_isolation ON review_queue_entry
   54:   FOR ALL TO app_tenant_user
   55:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
   56:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
   57: 
   58: GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
### packages/core-content/migrations/C0016_status_unlock.sql
    1: -- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
    2: -- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
    3: -- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
    4: -- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.
    5: 
    6: -- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
    7: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
    8: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
    9: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
   10: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
   11: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;
   12: 
   13: -- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
   14: ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
   15: ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
   16: ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
   17: 
   18: -- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
   19: DO $$ BEGIN
   20:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
   21:     ALTER TABLE article ADD CONSTRAINT article_compliance_fk
   22:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   23:   END IF;
   24:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
   25:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
   26:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   27:   END IF;
   28:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
   29:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
   30:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   31:   END IF;
   32:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
   33:     ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
   34:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   35:   END IF;
   36:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
   37:     ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
   38:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   39:   END IF;
   40:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
   41:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
   42:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
   43:   END IF;
   44: END $$;
   45: 
   46: -- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
   47: --   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
   48: --   기존 published row 사전 마이그레이션 회피용.
   49: 
   50: -- Article
   51: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
   52:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
   53:   record_phase, record_version, metadata)
   54: SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
   55:   COALESCE(a.risk_level, 'Low')::risk_level,
   56:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
   57:   '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
   58:   a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
   59:   'published'::compliance_record_phase, 1,
   60:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
   61: FROM article a
   62: WHERE a.status = 'published' AND a.compliance_record_id IS NULL
   63:   AND NOT EXISTS (
   64:     SELECT 1 FROM compliance_record cr
   65:     WHERE cr.instance_id = a.instance_id
   66:       AND cr.content_type = 'Article'::compliance_content_type
   67:       AND cr.content_ref = a.slug
   68:       AND cr.metadata @> '{"sentinel":true}'::jsonb
   69:   );
   70: 
   71: UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
   72: WHERE a.instance_id = cr.instance_id
   73:   AND cr.content_type = 'Article'::compliance_content_type
   74:   AND cr.content_ref = a.slug
   75:   AND cr.metadata @> '{"sentinel":true}'::jsonb
   76:   AND a.status = 'published' AND a.compliance_record_id IS NULL;
   77: 
   78: -- TreatmentPage
   79: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
   80:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
   81:   record_phase, record_version, metadata)
   82: SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
   83:   COALESCE(t.risk_level, 'Low')::risk_level,
   84:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
   85:   '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
   86:   t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
   87:   'published'::compliance_record_phase, 1,
   88:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
   89: FROM treatment_page t
   90: WHERE t.status = 'published' AND t.compliance_record_id IS NULL
   91:   AND NOT EXISTS (
   92:     SELECT 1 FROM compliance_record cr
   93:     WHERE cr.instance_id = t.instance_id
   94:       AND cr.content_type = 'TreatmentPage'::compliance_content_type
   95:       AND cr.content_ref = t.slug
   96:       AND cr.metadata @> '{"sentinel":true}'::jsonb
   97:   );
   98: 
   99: UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
  100: WHERE t.instance_id = cr.instance_id
  101:   AND cr.content_type = 'TreatmentPage'::compliance_content_type
  102:   AND cr.content_ref = t.slug
  103:   AND cr.metadata @> '{"sentinel":true}'::jsonb
  104:   AND t.status = 'published' AND t.compliance_record_id IS NULL;
  105: 
  106: -- LegalDocument · FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 (no-op)
  107: -- Publication · MediaAppearance — risk_level 'Low' fixed
  108: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  109:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  110:   record_phase, record_version, metadata)
  111: SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  112:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  113:   '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  114:   p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  115:   'published'::compliance_record_phase, 1,
  116:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  117: FROM publication p
  118: WHERE p.status = 'published' AND p.compliance_record_id IS NULL
  119:   AND NOT EXISTS (
  120:     SELECT 1 FROM compliance_record cr
  121:     WHERE cr.instance_id = p.instance_id
  122:       AND cr.content_type = 'Publication'::compliance_content_type
  123:       AND cr.content_ref = p.slug
  124:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  125:   );
  126: 
  127: UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
  128: WHERE p.instance_id = cr.instance_id
  129:   AND cr.content_type = 'Publication'::compliance_content_type
  130:   AND cr.content_ref = p.slug
  131:   AND cr.metadata @> '{"sentinel":true}'::jsonb
  132:   AND p.status = 'published' AND p.compliance_record_id IS NULL;
  133: 
  134: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  135:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  136:   record_phase, record_version, metadata)
  137: SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  138:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  139:   '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  140:   m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  141:   'published'::compliance_record_phase, 1,
  142:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  143: FROM media_appearance m
  144: WHERE m.status = 'published' AND m.compliance_record_id IS NULL
  145:   AND NOT EXISTS (
  146:     SELECT 1 FROM compliance_record cr
  147:     WHERE cr.instance_id = m.instance_id
  148:       AND cr.content_type = 'MediaAppearance'::compliance_content_type
  149:       AND cr.content_ref = m.slug
  150:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  151:   );
  152: 
  153: UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
  154: WHERE m.instance_id = cr.instance_id
  155:   AND cr.content_type = 'MediaAppearance'::compliance_content_type
  156:   AND cr.content_ref = m.slug
  157:   AND cr.metadata @> '{"sentinel":true}'::jsonb
  158:   AND m.status = 'published' AND m.compliance_record_id IS NULL;
  159: 
  160: -- (Step 5) NULL 잔존 검증 — 6 entity
  161: DO $$
  162: DECLARE null_count INTEGER;
  163: BEGIN
  164:   SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  165:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  166:   SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  167:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  168:   SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  169:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  170:   SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  171:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  172:   SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  173:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  174:   SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  175:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
  176: END $$;
  177: 
  178: -- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
  179: DO $$ BEGIN
  180:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
  181:     ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  182:     ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
  183:   END IF;
  184:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
  185:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  186:     ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
  187:   END IF;
  188:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
  189:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  190:     ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
  191:   END IF;
  192:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
  193:     ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  194:     ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
  195:   END IF;
  196:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
  197:     ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  198:     ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
  199:   END IF;
  200:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
  201:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
  202:     ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
  203:   END IF;
  204: END $$;
  205: 
  206: -- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
  207: --   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
  208: CREATE OR REPLACE FUNCTION published_content_compliance_guard()
  209: RETURNS TRIGGER LANGUAGE plpgsql AS $$
  210: DECLARE
  211:   record_row compliance_record%ROWTYPE;
  212:   expected_content_type compliance_content_type;
  213: BEGIN
  214:   IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  215:   IF NEW.compliance_record_id IS NULL THEN
  216:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  217:   END IF;
  218:   SELECT * INTO record_row FROM compliance_record
  219:    WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  220:   IF NOT FOUND THEN
  221:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  222:   END IF;
  223:   IF record_row.record_phase <> 'published' THEN
  224:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  225:   END IF;
  226:   -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  227:   expected_content_type := CASE TG_TABLE_NAME
  228:     WHEN 'article' THEN 'Article'
  229:     WHEN 'treatment_page' THEN 'TreatmentPage'
  230:     WHEN 'legal_document' THEN 'LegalDocument'
  231:     WHEN 'faq' THEN 'FAQ'
  232:     WHEN 'publication' THEN 'Publication'
  233:     WHEN 'media_appearance' THEN 'MediaAppearance'
  234:     ELSE NULL
  235:   END;
  236:   IF expected_content_type IS NULL THEN
  237:     RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
  238:   END IF;
  239:   IF record_row.content_type <> expected_content_type THEN
  240:     RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
  241:   END IF;
  242:   -- content_ref 일치 (slug)
  243:   IF record_row.content_ref <> NEW.slug THEN
  244:     RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
  245:   END IF;
  246:   RETURN NEW;
  247: END;
  248: $$;
  249: 
  250: DROP TRIGGER IF EXISTS article_published_guard ON article;
  251: CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  252:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
  253: DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
  254: CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
  255:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
  256: DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
  257: CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
  258:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
  259: DROP TRIGGER IF EXISTS faq_published_guard ON faq;
  260: CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
  261:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
  262: DROP TRIGGER IF EXISTS publication_published_guard ON publication;
  263: CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
  264:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
  265: DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
  266: CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
  267:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

 succeeded in 786ms:
### packages/core-content/src/schema.ts
    1: // @glitzy/core-content — Drizzle schema (v0.5·COMPLIANCE_ASSISTANT_M0_PLAN v1.0 patch)
    2: // M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
    3: // v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
    4: // v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
    5: // v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
    6: 
    7: import { sql } from "drizzle-orm";
    8: import {
    9:   pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
   10:   pgEnum, index, foreignKey, check, unique, uniqueIndex,
   11: } from "drizzle-orm/pg-core";
   12: 
   13: // === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===
   14: 
   15: export const instance = pgTable(
   16:   "instance",
   17:   {
   18:     id: uuid("id").primaryKey().defaultRandom(),
   19:     slug: text("slug").notNull().unique(),
   20:     displayName: text("display_name").notNull(),
   21:     active: boolean("active").notNull().default(true),
   22:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
   23:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
   24:   },
   25:   (t) => ({
   26:     slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
   27:     displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
   28:     activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
   29:     slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
   30:   }),
   31: );
   32: 
   33: // === Shared enums (C-03·C-04) ===
   34: export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
   35:   "draft", "review-queued", "in-review", "approved", "publishable",
   36:   "published", "blocked", "rejected", "stale",
   37: ]);
   38: 
   39: export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
   40: 
   41: // LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
   42: export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
   43:   "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
   44: ]);
   45: 
   46: // v0.5 COMPLIANCE_ASSISTANT_M0_PLAN — ComplianceRecord (C-10) + ReviewQueueEntry (REVIEW_WORKFLOW § 3)
   47: export const complianceRecordPhaseEnum = pgEnum("compliance_record_phase", ["pre-publish", "published"]);
   48: export const complianceContentTypeEnum = pgEnum("compliance_content_type", [
   49:   "ClinicProfile", "DoctorProfile", "TreatmentPage", "MedicalConditionPage",
   50:   "Article", "FAQ", "ReviewPolicy", "PricingPage", "FacilitiesPage", "NewsItem",
   51:   "ReservationPage", "LocationProfile", "ArticleCategory", "LegalDocument",
   52:   "Feature", "Publication", "MediaAppearance",
   53: ]);
   54: export const reviewQueueTypeEnum = pgEnum("review_queue_type", ["manual-review"]);
   55: export const reviewQueueStatusEnum = pgEnum("review_queue_status", ["open", "in-progress", "resolved"]);
   56: export const reviewQueuePriorityEnum = pgEnum("review_queue_priority", ["P0", "P1", "P2"]);
   57: export const approverRoleEnum = pgEnum("approver_role", ["operator", "medical", "legal", "client"]);
   58: 
   59: // === ClinicProfile (C-01) ===
   60: 
   61: export const clinicProfile = pgTable(
   62:   "clinic_profile",
   63:   {
   64:     id: uuid("id").primaryKey().defaultRandom(),
   65:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
   66:     slug: text("slug").notNull().default("clinic"),
   67:     name: text("name").notNull(),
   68:     alternateName: text("alternate_name"),
   69:     legalEntityName: text("legal_entity_name"),
   70:     slogan: text("slogan"),
   71:     description: text("description").notNull(),
   72:     longDescription: text("long_description"),
   73:     foundingDate: date("founding_date"),
   74:     founder: text("founder"),
   75:     logoUrl: text("logo_url").notNull(),
   76:     ogImageUrl: text("og_image_url").notNull(),
   77:     businessRegistrationNumber: text("business_registration_number"),
   78:     // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
   79:     policyContactPerson: text("policy_contact_person"),
   80:     policyContactEmail: text("policy_contact_email"),
   81:     policyContactPhone: text("policy_contact_phone"),
   82:     policyEffectiveDate: date("policy_effective_date"),
   83:     // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
   84:     primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
   85:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
   86:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
   87:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
   88:   },
   89:   (t) => ({
   90:     nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
   91:     descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
   92:     slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
   93:     brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
   94:     // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
   95:     policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
   96:     policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
   97:     primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
   98:     // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
   99:     instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
  100:     instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
  101:     instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  102:   }),
  103: );
  104: 
  105: // === LocationProfile (C-21·M0-18 country regex) ===
  106: 
  107: export const locationProfile = pgTable(
  108:   "location_profile",
  109:   {
  110:     id: uuid("id").primaryKey().defaultRandom(),
  111:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  112:     slug: text("slug").notNull(),
  113:     name: text("name").notNull(),
  114:     streetAddress: text("street_address").notNull(),
  115:     addressLocality: text("address_locality").notNull(),
  116:     addressRegion: text("address_region").notNull(),
  117:     postalCode: text("postal_code").notNull(),
  118:     addressCountry: text("address_country").notNull().default("KR"),
  119:     latitude: numeric("latitude", { precision: 10, scale: 7 }),
  120:     longitude: numeric("longitude", { precision: 10, scale: 7 }),
  121:     phone: text("phone"),
  122:     email: text("email"),
  123:     // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
  124:     clinicProfileId: uuid("clinic_profile_id").notNull(),
  125:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  126:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  127:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  128:   },
  129:   (t) => ({
  130:     slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  131:     countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
  132:     latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
  133:     lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
  134:     emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  135:     // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
  136:     phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
  137:     // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
  138:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
  139:     clinicFk: foreignKey({
  140:       columns: [t.instanceId, t.clinicProfileId],
  141:       foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
  142:       name: "location_profile_clinic_fk",
  143:     }).onDelete("cascade"),
  144:     instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
  145:     instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
  146:     instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
  147:     clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  148:   }),
  149: );
  150: 
  151: // === DoctorProfile (C-02) ===
  152: 
  153: export const doctorProfile = pgTable(
  154:   "doctor_profile",
  155:   {
  156:     id: uuid("id").primaryKey().defaultRandom(),
  157:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  158:     slug: text("slug").notNull(),
  159:     name: text("name").notNull(),
  160:     title: text("title"),
  161:     jobTitle: text("job_title"),
  162:     honorific: text("honorific"),
  163:     bio: text("bio"),
  164:     photoUrl: text("photo_url"),
  165:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  166:     displayOrder: integer("display_order").notNull().default(0),
  167:     active: boolean("active").notNull().default(true),
  168:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  169:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  170:   },
  171:   (t) => ({
  172:     slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  173:     nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
  174:     instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
  175:     instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
  176:     instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
  177:     activeOrderIdx: index("doctor_profile_active_order_idx")
  178:       .on(t.instanceId, t.active, t.displayOrder)
  179:       .where(sql`${t.active} = true`),
  180:   }),
  181: );
  182: 
  183: // === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===
  184: 
  185: export const treatmentPage = pgTable(
  186:   "treatment_page",
  187:   {
  188:     id: uuid("id").primaryKey().defaultRandom(),
  189:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  190:     slug: text("slug").notNull(),
  191:     title: text("title").notNull(),
  192:     summary: text("summary").notNull(),
  193:     bodyMarkdown: text("body_markdown").notNull(),
  194:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  195:     riskLevel: riskLevelEnum("risk_level"),
  196:     complianceRecordId: uuid("compliance_record_id"),
  197:     heroImageUrl: text("hero_image_url"),
  198:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  199:     publishedAt: timestamp("published_at", { withTimezone: true }),
  200:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  201:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  202:   },
  203:   (t) => ({
  204:     slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  205:     titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
  206:     summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
  207:     publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  208:     instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
  209:     instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
  210:     instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
  211:     statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
  212:     publishedIdx: index("treatment_page_published_idx")
  213:       .on(t.instanceId, t.publishedAt)
  214:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  215:   }),
  216: );
  217: 
  218: // === Article (C-04·M0-05 ON DELETE NO ACTION) ===
  219: 
  220: export const article = pgTable(
  221:   "article",
  222:   {
  223:     id: uuid("id").primaryKey().defaultRandom(),
  224:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  225:     slug: text("slug").notNull(),
  226:     title: text("title").notNull(),
  227:     summary: text("summary").notNull(),
  228:     bodyMarkdown: text("body_markdown").notNull(),
  229:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  230:     riskLevel: riskLevelEnum("risk_level"),
  231:     complianceRecordId: uuid("compliance_record_id"),
  232:     heroImageUrl: text("hero_image_url"),
  233:     authorDoctorId: uuid("author_doctor_id"),
  234:     // v0.4 (EC-SCHEMA-05 · cycle 1 ECP-03): C-04 Article.category required — staged C0013 migration 으로 SET NOT NULL.
  235:     //   Drizzle schema 안 .notNull() 는 SoT 표현. C0013 (1)~(4) 단계 통과 후 도달.
  236:     categoryId: uuid("category_id").notNull(),
  237:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  238:     publishedAt: timestamp("published_at", { withTimezone: true }),
  239:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  240:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  241:   },
  242:   (t) => ({
  243:     slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  244:     titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
  245:     summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
  246:     publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  247:     instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
  248:     instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
  249:     instanceIdx: index("article_instance_idx").on(t.instanceId),
  250:     statusIdx: index("article_status_idx").on(t.instanceId, t.status),
  251:     publishedIdx: index("article_published_idx")
  252:       .on(t.instanceId, t.publishedAt)
  253:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  254:     authorIdx: index("article_author_idx")
  255:       .on(t.instanceId, t.authorDoctorId)
  256:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  257:     categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
  258:     // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
  259:     authorFk: foreignKey({
  260:       columns: [t.instanceId, t.authorDoctorId],
  261:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  262:       name: "article_author_fk",
  263:     }),
  264:     // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
  265:     //   forward-reference 회피를 위해 Drizzle schema 안 미표현 (drizzle-kit 미사용 · raw SQL SoT).
  266:   }),
  267: );
  268: 
  269: // === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
  270: 
  271: export const legalDocument = pgTable(
  272:   "legal_document",
  273:   {
  274:     id: uuid("id").primaryKey().defaultRandom(),
  275:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  276:     slug: text("slug").notNull(),
  277:     documentType: legalDocumentTypeEnum("document_type").notNull(),
  278:     title: text("title").notNull(),
  279:     body: text("body").notNull(),
  280:     autoGenerated: boolean("auto_generated").notNull().default(true),
  281:     templateVersion: text("template_version"),
  282:     // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
  283:     effectiveDate: date("effective_date").notNull(),
  284:     lastRevisedDate: date("last_revised_date"),
  285:     contactPerson: text("contact_person"),
  286:     contactEmail: text("contact_email"),
  287:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  288:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  289:     publishedAt: timestamp("published_at", { withTimezone: true }),
  290:     // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
  291:     complianceRecordId: uuid("compliance_record_id"),
  292:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  293:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  294:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  295:   },
  296:   (t) => ({
  297:     slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  298:     titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
  299:     bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
  300:     emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  301:     // LL-SCHEMA-05 + cycle1 LL-22
  302:     templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
  303:     autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
  304:     // v0.5 (COMPLIANCE_ASSISTANT_M0): skeleton-limit CHECK 3건 제거 — C0016 안 DROP CONSTRAINT.
  305:     //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
  306:     instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
  307:     instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
  308:     // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
  309:     type5Unique: uniqueIndex("legal_document_instance_5type_unique")
  310:       .on(t.instanceId, t.documentType)
  311:       .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
  312:     instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
  313:   }),
  314: );
  315: 
  316: // === EAT_CONTENT v1.0 v0.4 cascade — 4 신규 entity ===
  317: 
  318: // EC-SCHEMA-12 (C-25 SoT) — media_channel_type enum 4종.
  319: //   JSON-LD `@type` 매핑은 v0.1 단계 모두 VideoObject 단일화. EC-DEFER-11 (M1) BroadcastEvent/NewsArticle 분기.
  320: export const mediaChannelTypeEnum = pgEnum("media_channel_type", [
  321:   "broadcast", "youtube", "podcast", "press",
  322: ]);
  323: 
  324: // === ArticleCategory (C-22·EC-SCHEMA-01) ===
  325: //   v0.1 풀명세 컬럼 모두 추가 — 어드민 UI minimal (slug·name·displayOrder 만 노출).
  326: //   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
  327: export const articleCategory = pgTable(
  328:   "article_category",
  329:   {
  330:     id: uuid("id").primaryKey().defaultRandom(),
  331:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  332:     slug: text("slug").notNull(),
  333:     name: text("name").notNull(),
  334:     description: text("description"),
  335:     pillar: text("pillar"),
  336:     parentCategoryId: uuid("parent_category_id"),
  337:     coverImageUrl: text("cover_image_url"),
  338:     seoMeta: jsonb("seo_meta"),
  339:     displayOrder: integer("display_order").notNull().default(0),
  340:     articleTypeDefault: text("article_type_default"),
  341:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  342:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  343:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  344:   },
  345:   (t) => ({
  346:     slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  347:     nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
  348:     descLen: check("article_category_description_length",
  349:       sql`${t.description} IS NULL OR length(${t.description}) BETWEEN 80 AND 200`),
  350:     coverImageUrlFormat: check("article_category_cover_image_url_format",
  351:       sql`${t.coverImageUrl} IS NULL OR ${t.coverImageUrl} ~ '^https?://'`),
  352:     instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
  353:     instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
  354:     instanceIdx: index("article_category_instance_idx").on(t.instanceId),
  355:     orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
  356:     parentIdx: index("article_category_parent_idx")
  357:       .on(t.instanceId, t.parentCategoryId)
  358:       .where(sql`${t.parentCategoryId} IS NOT NULL`),
  359:     // self-referencing composite FK (same-tenant) — DB ADD CONSTRAINT C0009 raw SQL SoT.
  360:     //   parent_category_id 가 nullable 이므로 Drizzle 도 표현 가능.
  361:     parentFk: foreignKey({
  362:       columns: [t.instanceId, t.parentCategoryId],
  363:       foreignColumns: [t.instanceId, t.id],
  364:       name: "article_category_parent_fk",
  365:     }),
  366:   }),
  367: );
  368: 
  369: // === Publication (C-24·EC-SCHEMA-08) ===
  370: //   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
  371: //   DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
  372: export const publication = pgTable(
  373:   "publication",
  374:   {
  375:     id: uuid("id").primaryKey().defaultRandom(),
  376:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  377:     slug: text("slug").notNull(),
  378:     title: text("title").notNull(),
  379:     authors: jsonb("authors").notNull(),
  380:     journal: text("journal"),
  381:     publishedDate: date("published_date").notNull(),
  382:     doi: text("doi"),
  383:     pubmedId: text("pubmed_id"),
  384:     url: text("url").notNull(),
  385:     thumbnailUrl: text("thumbnail_url"),
  386:     summary: text("summary").notNull(),
  387:     authorDoctorId: uuid("author_doctor_id"),
  388:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  389:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  390:     publishedAt: timestamp("published_at", { withTimezone: true }),
  391:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
  392:     complianceRecordId: uuid("compliance_record_id"),
  393:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  394:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  395:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  396:   },
  397:   (t) => ({
  398:     slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  399:     titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
  400:     summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
  401:     urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
  402:     thumbnailUrlFormat: check("publication_thumbnail_url_format",
  403:       sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
  404:     doiFormat: check("publication_doi_format",
  405:       sql`${t.doi} IS NULL OR ${t.doi} ~ '^10\\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'`),
  406:     pubmedIdFormat: check("publication_pubmed_id_format",
  407:       sql`${t.pubmedId} IS NULL OR ${t.pubmedId} ~ '^[0-9]{1,9}$'`),
  408:     authorsArray: check("publication_authors_array",
  409:       sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
  410:     riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
  411:     publishedRequiresAt: check("publication_published_requires_at",
  412:       sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  413:     instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
  414:     instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
  415:     instanceIdx: index("publication_instance_idx").on(t.instanceId),
  416:     statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
  417:     publishedIdx: index("publication_published_idx")
  418:       .on(t.instanceId, t.publishedAt)
  419:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  420:     authorIdx: index("publication_author_idx")
  421:       .on(t.instanceId, t.authorDoctorId)
  422:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  423:     authorDoctorFk: foreignKey({
  424:       columns: [t.instanceId, t.authorDoctorId],
  425:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  426:       name: "publication_author_doctor_fk",
  427:     }),
  428:   }),
  429: );
  430: 
  431: // === MediaAppearance (C-25·EC-SCHEMA-11) ===
  432: //   미디어 출연. v0.1 단계 JSON-LD `@type` = VideoObject 단일화 (모든 channel_type).
  433: export const mediaAppearance = pgTable(
  434:   "media_appearance",
  435:   {
  436:     id: uuid("id").primaryKey().defaultRandom(),
  437:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  438:     slug: text("slug").notNull(),
  439:     title: text("title").notNull(),
  440:     channelName: text("channel_name").notNull(),
  441:     channelType: mediaChannelTypeEnum("channel_type").notNull(),
  442:     publishedDate: date("published_date").notNull(),
  443:     durationSeconds: integer("duration_seconds"),
  444:     url: text("url").notNull(),
  445:     thumbnailUrl: text("thumbnail_url"),
  446:     summary: text("summary").notNull(),
  447:     authorDoctorId: uuid("author_doctor_id"),
  448:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  449:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  450:     publishedAt: timestamp("published_at", { withTimezone: true }),
  451:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
  452:     complianceRecordId: uuid("compliance_record_id"),
  453:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  454:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  455:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  456:   },
  457:   (t) => ({
  458:     slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  459:     titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
  460:     summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
  461:     channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
  462:     urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
  463:     thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
  464:       sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
  465:     durationPositive: check("media_appearance_duration_positive",
  466:       sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`),
  467:     riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
  468:     publishedRequiresAt: check("media_appearance_published_requires_at",
  469:       sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  470:     instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
  471:     instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
  472:     instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
  473:     statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
  474:     publishedIdx: index("media_appearance_published_idx")
  475:       .on(t.instanceId, t.publishedAt)
  476:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  477:     authorIdx: index("media_appearance_author_idx")
  478:       .on(t.instanceId, t.authorDoctorId)
  479:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  480:     authorDoctorFk: foreignKey({
  481:       columns: [t.instanceId, t.authorDoctorId],
  482:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  483:       name: "media_appearance_author_doctor_fk",
  484:     }),
  485:   }),
  486: );
  487: 
  488: // === FAQ (C-12·EC-SCHEMA-13) ===
  489: //   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
  490: //   LegalDocument LL-SCHEMA-03·04 패턴 정합.
  491: export const faq = pgTable(
  492:   "faq",
  493:   {
  494:     id: uuid("id").primaryKey().defaultRandom(),
  495:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  496:     slug: text("slug").notNull(),
  497:     question: text("question").notNull(),
  498:     answer: text("answer").notNull(),
  499:     displayOrder: integer("display_order").notNull().default(0),
  500:     categoryId: uuid("category_id"),
  501:     relatedTreatmentId: uuid("related_treatment_id"),
  502:     relatedConditionId: uuid("related_condition_id"),
  503:     authorDoctorId: uuid("author_doctor_id"),
  504:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  505:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  506:     complianceRecordId: uuid("compliance_record_id"),
  507:     publishedAt: timestamp("published_at", { withTimezone: true }),
  508:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  509:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  510:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  511:   },
  512:   (t) => ({
  513:     slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  514:     questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
  515:     answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
  516:     // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
  517:     //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
  518:     instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
  519:     instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
  520:     instanceIdx: index("faq_instance_idx").on(t.instanceId),
  521:     statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
  522:     publishedIdx: index("faq_published_idx")
  523:       .on(t.instanceId, t.publishedAt, t.displayOrder)
  524:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  525:     categoryIdx: index("faq_category_idx")
  526:       .on(t.instanceId, t.categoryId)
  527:       .where(sql`${t.categoryId} IS NOT NULL`),
  528:     orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
  529:     categoryFk: foreignKey({
  530:       columns: [t.instanceId, t.categoryId],
  531:       foreignColumns: [articleCategory.instanceId, articleCategory.id],
  532:       name: "faq_category_fk",
  533:     }),
  534:     authorDoctorFk: foreignKey({
  535:       columns: [t.instanceId, t.authorDoctorId],
  536:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  537:       name: "faq_author_doctor_fk",
  538:     }),
  539:     relatedTreatmentFk: foreignKey({
  540:       columns: [t.instanceId, t.relatedTreatmentId],
  541:       foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
  542:       name: "faq_related_treatment_fk",
  543:     }),
  544:     // related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외).
  545:   }),
  546: );
  547: 
  548: // === v0.5 COMPLIANCE_ASSISTANT_M0 — ComplianceRecord (C-10 skeleton) + ReviewQueueEntry (REVIEW_WORKFLOW § 3) ===
  549: 
  550: export const complianceRecord = pgTable(
  551:   "compliance_record",
  552:   {
  553:     id: uuid("id").primaryKey().defaultRandom(),
  554:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  555:     contentType: complianceContentTypeEnum("content_type").notNull(),
  556:     contentRef: text("content_ref").notNull(),
  557:     pageRiskLevel: riskLevelEnum("page_risk_level").notNull(),
  558:     articleType: text("article_type"),
  559:     inlineRiskFlags: jsonb("inline_risk_flags").notNull().default(sql`'[]'::jsonb`),
  560:     autoCheckResult: jsonb("auto_check_result").notNull(),
  561:     peerReviewer: uuid("peer_reviewer"),
  562:     peerReviewedAt: timestamp("peer_reviewed_at", { withTimezone: true }),
  563:     physicianApprover: uuid("physician_approver"),
  564:     physicianApprovedAt: timestamp("physician_approved_at", { withTimezone: true }),
  565:     legalCounsel: uuid("legal_counsel"),
  566:     legalCounselAt: timestamp("legal_counsel_at", { withTimezone: true }),
  567:     clientApprover: uuid("client_approver"),
  568:     clientApprovedAt: timestamp("client_approved_at", { withTimezone: true }),
  569:     priorReviewRequired: boolean("prior_review_required").notNull().default(false),
  570:     priorReviewSubmissionId: text("prior_review_submission_id"),
  571:     priorReviewPassed: boolean("prior_review_passed"),
  572:     publishedAt: timestamp("published_at", { withTimezone: true }),
  573:     publishedBy: uuid("published_by"),
  574:     recordPhase: complianceRecordPhaseEnum("record_phase").notNull().default("pre-publish"),
  575:     recordVersion: integer("record_version").notNull().default(1),
  576:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  577:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  578:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  579:   },
  580:   (t) => ({
  581:     versionPositive: check("compliance_record_version_positive", sql`${t.recordVersion} >= 1`),
  582:     publishedRequiresAt: check("compliance_record_published_requires_at",
  583:       sql`${t.recordPhase} <> 'published' OR (${t.publishedAt} IS NOT NULL AND ${t.publishedBy} IS NOT NULL)`),
  584:     legalDocRequiresLegal: check("compliance_record_legal_doc_requires_legal",
  585:       sql`${t.recordPhase} <> 'published' OR ${t.contentType} <> 'LegalDocument' OR (${t.legalCounsel} IS NOT NULL AND ${t.legalCounselAt} IS NOT NULL)`),
  586:     medHighRequiresPhysician: check("compliance_record_med_high_requires_physician",
  587:       sql`${t.recordPhase} <> 'published' OR ${t.pageRiskLevel} = 'Low' OR (${t.physicianApprover} IS NOT NULL AND ${t.physicianApprovedAt} IS NOT NULL)`),
  588:     publishedRequiresPeer: check("compliance_record_published_requires_peer",
  589:       sql`${t.recordPhase} <> 'published' OR (${t.peerReviewer} IS NOT NULL AND ${t.peerReviewedAt} IS NOT NULL)`),
  590:     uniqueVersion: unique("compliance_record_unique_version").on(t.instanceId, t.contentType, t.contentRef, t.recordVersion),
  591:     instanceIdUnique: unique("compliance_record_instance_id_unique").on(t.instanceId, t.id),
  592:     instanceIdx: index("compliance_record_instance_idx").on(t.instanceId),
  593:     contentRefIdx: index("compliance_record_content_ref_idx").on(t.instanceId, t.contentType, t.contentRef),
  594:     phaseIdx: index("compliance_record_phase_idx").on(t.instanceId, t.recordPhase),
  595:   }),
  596: );
  597: 
  598: export const reviewQueueEntry = pgTable(
  599:   "review_queue_entry",
  600:   {
  601:     id: uuid("id").primaryKey().defaultRandom(),
  602:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  603:     queueType: reviewQueueTypeEnum("queue_type").notNull(),
  604:     contentType: complianceContentTypeEnum("content_type").notNull(),
  605:     contentRef: text("content_ref").notNull(),
  606:     complianceRecordId: uuid("compliance_record_id").notNull(),
  607:     status: reviewQueueStatusEnum("status").notNull().default("open"),
  608:     priority: reviewQueuePriorityEnum("priority").notNull().default("P0"),
  609:     // approver_role[] — drizzle 의 array helper 없으므로 raw text 로 표현. raw SQL C0015 에서 enum array 정의.
  610:     //   Drizzle 으로는 jsonb 대용 표현 — drizzle-orm 안 .array() 미지원 시 raw "approver_role[]" 으로 별도 helper.
  611:     requiredRoles: text("required_roles").array().notNull(),
  612:     assignedTo: uuid("assigned_to"),
  613:     assignedAt: timestamp("assigned_at", { withTimezone: true }),
  614:     slaDueAt: timestamp("sla_due_at", { withTimezone: true }).notNull(),
  615:     resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  616:     resolvedBy: uuid("resolved_by"),
  617:     resolutionType: text("resolution_type"),
  618:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  619:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  620:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  621:   },
  622:   (t) => ({
  623:     requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
  624:     resolvedRequiresAt: check("review_queue_entry_resolved_requires_at",
  625:       sql`${t.status} <> 'resolved' OR ${t.resolvedAt} IS NOT NULL`),
  626:     resolvedRequiresType: check("review_queue_entry_resolved_requires_type",
  627:       sql`${t.status} <> 'resolved' OR ${t.resolutionType} IS NOT NULL`),
  628:     complianceFk: foreignKey({
  629:       columns: [t.instanceId, t.complianceRecordId],
  630:       foreignColumns: [complianceRecord.instanceId, complianceRecord.id],
  631:       name: "review_queue_entry_compliance_fk",
  632:     }),
  633:     instanceIdUnique: unique("review_queue_entry_instance_id_unique").on(t.instanceId, t.id),
  634:     instanceIdx: index("review_queue_entry_instance_idx").on(t.instanceId),
  635:     statusIdx: index("review_queue_entry_status_idx").on(t.instanceId, t.status),
  636:     openPriorityIdx: index("review_queue_entry_open_priority_idx")
  637:       .on(t.instanceId, t.priority, t.slaDueAt)
  638:       .where(sql`${t.status} IN ('open', 'in-progress')`),
  639:     contentIdx: index("review_queue_entry_content_idx").on(t.instanceId, t.contentType, t.contentRef),
  640:     openUnique: uniqueIndex("review_queue_entry_open_unique")
  641:       .on(t.instanceId, t.contentType, t.contentRef)
  642:       .where(sql`${t.status} IN ('open', 'in-progress')`),
  643:   }),
  644: );
### packages/core-content/src/index.ts
    1: // @glitzy/core-content — M0 vertical slice schema + templates (v0.5·COMPLIANCE_ASSISTANT_M0_PLAN v1.0)
    2: 
    3: export {
    4:   instance,
    5:   contentPublicationStatusEnum,
    6:   riskLevelEnum,
    7:   legalDocumentTypeEnum,
    8:   mediaChannelTypeEnum,
    9:   clinicProfile,
   10:   locationProfile,
   11:   doctorProfile,
   12:   treatmentPage,
   13:   article,
   14:   legalDocument,
   15:   articleCategory,
   16:   publication,
   17:   mediaAppearance,
   18:   faq,
   19:   complianceRecord,
   20:   reviewQueueEntry,
   21:   complianceRecordPhaseEnum,
   22:   complianceContentTypeEnum,
   23:   reviewQueueTypeEnum,
   24:   reviewQueueStatusEnum,
   25:   reviewQueuePriorityEnum,
   26:   approverRoleEnum,
   27: } from "./schema.js";
   28: 
   29: export {
   30:   TEMPLATES,
   31:   CLOSED_DOCUMENT_TYPES,
   32:   CLOSED_DOCUMENT_TYPES_ALPHA,
   33:   renderTemplate,
   34:   listTemplateVariables,
   35:   TemplateRenderError,
   36: } from "./templates/index.js";
   37: 
   38: export type {
   39:   ClosedLegalDocumentType,
   40:   LegalDocumentType,
   41:   Template,
   42:   RenderContext,
   43: } from "./templates/index.js";
### packages/migrations-runner/src/manifest.ts
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
   23:  * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
   24:  * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
   25:  * runner 는 이 배열 순서대로 sequential apply (fail-fast).
   26:  */
   27: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
   28:   // (1) instance (multi-tenant root)
   29:   {
   30:     file: "packages/db/migrations/D0010_instance.sql",
   31:     package: "@glitzy/db",
   32:     creates: ["instance"],
   33:     dependsOn: [],
   34:   },
   35:   // (2) clinic_profile
   36:   {
   37:     file: "packages/core-content/migrations/C0001_clinic_profile.sql",
   38:     package: "@glitzy/core-content",
   39:     creates: ["clinic_profile"],
   40:     dependsOn: ["instance"],
   41:   },
   42:   // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
   43:   {
   44:     file: "packages/core-content/migrations/C0002_location_profile.sql",
   45:     package: "@glitzy/core-content",
   46:     creates: ["location_profile"],
   47:     dependsOn: ["instance"],
   48:   },
   49:   // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
   50:   {
   51:     file: "packages/core-content/migrations/C0003_doctor_profile.sql",
   52:     package: "@glitzy/core-content",
   53:     creates: ["doctor_profile"],
   54:     dependsOn: ["instance"],
   55:   },
   56:   // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
   57:   {
   58:     file: "packages/core-content/migrations/C0004_treatment_page.sql",
   59:     package: "@glitzy/core-content",
   60:     creates: ["treatment_page", "content_publication_status"],
   61:     dependsOn: ["instance"],
   62:   },
   63:   // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
   64:   {
   65:     file: "packages/core-content/migrations/C0005_article.sql",
   66:     package: "@glitzy/core-content",
   67:     creates: ["article", "risk_level"],
   68:     dependsOn: ["instance", "doctor_profile", "content_publication_status"],
   69:   },
   70:   // (7) legal_document — content_publication_status + risk_level enum FK
   71:   {
   72:     file: "packages/core-content/migrations/C0006_legal_document.sql",
   73:     package: "@glitzy/core-content",
   74:     creates: ["legal_document", "legal_document_type"],
   75:     dependsOn: ["instance", "content_publication_status", "risk_level"],
   76:   },
   77:   // (8) clinic_profile policy + primary_ctas (ALTER)
   78:   {
   79:     file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
   80:     package: "@glitzy/core-content",
   81:     creates: [
   82:       "clinic_profile.policy_contact_person",
   83:       "clinic_profile.policy_contact_email",
   84:       "clinic_profile.policy_contact_phone",
   85:       "clinic_profile.policy_effective_date",
   86:       "clinic_profile.primary_ctas",
   87:       "clinic_profile_primary_ctas_validate",
   88:       "clinic_profile_primary_ctas_trigger",
   89:     ],
   90:     dependsOn: ["clinic_profile"],
   91:   },
   92:   // (9) location_profile parentClinic composite FK (ALTER)
   93:   {
   94:     file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
   95:     package: "@glitzy/core-content",
   96:     creates: [
   97:       "location_profile.clinic_profile_id",
   98:       "location_profile_clinic_fk",
   99:       "location_profile_clinic_idx",
  100:     ],
  101:     dependsOn: ["clinic_profile", "location_profile"],
  102:   },
  103:   // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
  104:   // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
  105:   {
  106:     file: "packages/db/migrations/D0011_public_reader.sql",
  107:     package: "@glitzy/db",
  108:     creates: [
  109:       "app_public_reader",
  110:       "public_reader_instance_select",
  111:       "public_reader_clinic_profile_select",
  112:       "public_reader_location_profile_select",
  113:       "public_reader_doctor_profile_select",
  114:       "public_reader_treatment_page_select",
  115:       "public_reader_article_select",
  116:       "public_reader_legal_document_select",
  117:     ],
  118:     dependsOn: [
  119:       "instance",
  120:       "clinic_profile",
  121:       "location_profile",
  122:       "doctor_profile",
  123:       "treatment_page",
  124:       "article",
  125:       "legal_document",
  126:     ],
  127:   },
  128:   // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
  129:   {
  130:     file: "packages/core-content/migrations/C0009_article_category.sql",
  131:     package: "@glitzy/core-content",
  132:     creates: ["article_category"],
  133:     dependsOn: ["instance"],
  134:   },
  135:   // (12) publication
  136:   {
  137:     file: "packages/core-content/migrations/C0010_publication.sql",
  138:     package: "@glitzy/core-content",
  139:     creates: ["publication"],
  140:     dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  141:   },
  142:   // (13) media_appearance
  143:   {
  144:     file: "packages/core-content/migrations/C0011_media_appearance.sql",
  145:     package: "@glitzy/core-content",
  146:     creates: ["media_appearance", "media_channel_type"],
  147:     dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  148:   },
  149:   // (14) faq
  150:   {
  151:     file: "packages/core-content/migrations/C0012_faq.sql",
  152:     package: "@glitzy/core-content",
  153:     creates: ["faq"],
  154:     dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
  155:   },
  156:   // (15) article_category_fk — staged 4-step: ADD nullable + default `general` seed + backfill + SET NOT NULL + FK
  157:   //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
  158:   {
  159:     file: "packages/core-content/migrations/C0013_article_category_fk.sql",
  160:     package: "@glitzy/core-content",
  161:     creates: [
  162:       "article.category_id",
  163:       "article_category_fk",
  164:       "article_category_idx",
  165:     ],
  166:     dependsOn: ["article", "article_category"],
  167:   },
  168:   // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
  169:   {
  170:     file: "packages/db/migrations/D0014_public_reader_eat.sql",
  171:     package: "@glitzy/db",
  172:     creates: [
  173:       "public_reader_article_category_select",
  174:       "public_reader_publication_select",
  175:       "public_reader_media_appearance_select",
  176:       "public_reader_faq_select",
  177:     ],
  178:     dependsOn: [
  179:       "app_public_reader",
  180:       "article_category",
  181:       "publication",
  182:       "media_appearance",
  183:       "faq",
  184:     ],
  185:   },
  186:   // (17) C0014 compliance_record (COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.1 CA-SCHEMA-01)
  187:   {
  188:     file: "packages/core-content/migrations/C0014_compliance_record.sql",
  189:     package: "@glitzy/core-content",
  190:     creates: ["compliance_record", "compliance_record_phase", "compliance_content_type"],
  191:     dependsOn: ["instance", "risk_level"],
  192:   },
  193:   // (18) C0015 review_queue_entry (CA-SCHEMA-04)
  194:   {
  195:     file: "packages/core-content/migrations/C0015_review_queue_entry.sql",
  196:     package: "@glitzy/core-content",
  197:     creates: [
  198:       "review_queue_entry",
  199:       "review_queue_type",
  200:       "review_queue_status",
  201:       "review_queue_priority",
  202:       "approver_role",
  203:     ],
  204:     dependsOn: ["instance", "compliance_record", "compliance_content_type"],
  205:   },
  206:   // (19) C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger (CA-SCHEMA-07~10)
  207:   {
  208:     file: "packages/core-content/migrations/C0016_status_unlock.sql",
  209:     package: "@glitzy/core-content",
  210:     creates: [
  211:       "article.compliance_record_id",
  212:       "treatment_page.compliance_record_id",
  213:       "legal_document.compliance_record_id",
  214:       "publication.compliance_record_id",
  215:       "media_appearance.compliance_record_id",
  216:       "article_compliance_fk",
  217:       "treatment_page_compliance_fk",
  218:       "legal_document_compliance_fk",
  219:       "faq_compliance_fk",
  220:       "publication_compliance_fk",
  221:       "media_appearance_compliance_fk",
  222:       "article_published_requires_record",
  223:       "treatment_page_published_requires_record",
  224:       "legal_document_published_requires_record",
  225:       "faq_published_requires_record",
  226:       "publication_published_requires_record",
  227:       "media_appearance_published_requires_record",
  228:       "published_content_compliance_guard",
  229:       "article_published_guard",
  230:       "treatment_page_published_guard",
  231:       "legal_document_published_guard",
  232:       "faq_published_guard",
  233:       "publication_published_guard",
  234:       "media_appearance_published_guard",
  235:     ],
  236:     dependsOn: [
  237:       "article",
  238:       "treatment_page",
  239:       "legal_document",
  240:       "faq",
  241:       "publication",
  242:       "media_appearance",
  243:       "compliance_record",
  244:       "compliance_content_type",
  245:     ],
  246:   },
  247: ];
  248: 
  249: /**
  250:  * validateManifest — runner 가 sequential apply 직전 호출.
  251:  * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
  252:  * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
  253:  */
  254: export function validateManifest(): ReadonlyArray<string> {
  255:   const errors: string[] = [];
  256:   const seen = new Set<string>();
  257:   for (const [i, m] of orderedMigrations.entries()) {
  258:     for (const dep of m.dependsOn) {
  259:       if (!seen.has(dep)) {
  260:         errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
  261:       }
  262:     }
  263:     for (const c of m.creates) seen.add(c);
  264:   }
  265:   return errors;
  266: }

2026-05-18T09:17:17.322733Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … g --files apps/web/src/lib/compliance apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 873ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … g --files apps/web/src/lib/compliance apps/web/src/app/([36;1madmin[0m)/admin  …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=Get-ChildItem -Path '"'apps/web/src/lib/compliance' -Recurse -File | Sort-Object FullName; foreach("'$f in $files){ Write-Output "### $($f.FullName.Substring((Get-Location).Path.Length+1))"; $i=1; Get-Content $f.FullName | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/page.tsx','apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts','apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx','apps/web/src/components/forms/ReviewEntryActionForm.tsx','apps/web/src/components/forms/WorkflowActionButtons.tsx'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content -LiteralPath $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx','apps/web/src/components/forms/ArticleForm.tsx','apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts','apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content -LiteralPath $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 853ms:
### apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/page.tsx
    1: // @glitzy/web/(admin)/[instanceSlug]/review-queue — manual-review 큐 list
    2: // SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01
    3: 
    4: import Link from "next/link";
    5: import { notFound, redirect } from "next/navigation";
    6: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    7: 
    8: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    9: import { requirePageContext } from "@/lib/page-context";
   10: import { withSkeletonTx } from "@/lib/tenant";
   11: 
   12: type Row = {
   13:   id: string;
   14:   queue_type: string;
   15:   content_type: string;
   16:   content_ref: string;
   17:   compliance_record_id: string;
   18:   status: string;
   19:   priority: string;
   20:   required_roles: string[];
   21:   sla_due_at: Date;
   22:   assigned_name: string | null;
   23:   page_risk_level: string;
   24: };
   25: 
   26: export default async function ReviewQueueListPage({ params }: { params: { instanceSlug: string } }) {
   27:   let pageCtx;
   28:   try {
   29:     pageCtx = await requirePageContext(params.instanceSlug);
   30:   } catch (err) {
   31:     if (err instanceof TenantResolveError) {
   32:       const a = mapAuthDenyReasonToUi(err.reason);
   33:       if (a.kind === "forbidden" || a.kind === "info") {
   34:         return <main className="p-6"><p>{a.message}</p></main>;
   35:       }
   36:     }
   37:     throw err;
   38:   }
   39: 
   40:   let rows: Row[];
   41:   try {
   42:     rows = await withSkeletonTx(
   43:       { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
   44:       async (tx, ctx) => {
   45:         assertActionEligibility(ctx, "operator-edit-content");
   46:         return tx<Row[]>`
   47:           SELECT e.id, e.queue_type::text AS queue_type,
   48:                  e.content_type::text AS content_type, e.content_ref,
   49:                  e.compliance_record_id,
   50:                  e.status::text AS status, e.priority::text AS priority,
   51:                  e.required_roles::text[] AS required_roles,
   52:                  e.sla_due_at,
   53:                  cr.page_risk_level::text AS page_risk_level,
   54:                  u.display_name AS assigned_name
   55:             FROM review_queue_entry e
   56:             JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
   57:             LEFT JOIN admin_user u ON u.id = e.assigned_to
   58:            WHERE e.instance_id = ${ctx.instanceId}::uuid
   59:              AND e.status IN ('open', 'in-progress')
   60:            ORDER BY e.priority ASC, e.sla_due_at ASC
   61:         `;
   62:       },
   63:     );
   64:   } catch (err) {
   65:     if (err instanceof TenantResolveError) {
   66:       const a = mapAuthDenyReasonToUi(err.reason);
   67:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
   68:       if (a.kind === "not-found") notFound();
   69:       if (a.kind === "forbidden" || a.kind === "info") {
   70:         return <main className="p-6"><p>{a.message}</p></main>;
   71:       }
   72:     }
   73:     throw err;
   74:   }
   75: 
   76:   return (
   77:     <main className="flex flex-col gap-6">
   78:       <header className="flex items-center justify-between">
   79:         <h1 className="text-2xl font-semibold">검수 큐 (manual-review)</h1>
   80:         <Link href={`/admin/${params.instanceSlug}`} className="text-sm text-slate-600 hover:underline">← 대시보드</Link>
   81:       </header>
   82: 
   83:       <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-900">
   84:         M0 v0.1 — 수동 검수 큐만 활성 (warning · stale 큐 CA-DEFER-05·06). 자동 룰 검수는 CA-DEFER-01·02 합류 시.
   85:       </div>
   86: 
   87:       {rows.length === 0 ? (
   88:         <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
   89:           현재 검수 대기 중인 콘텐츠가 없습니다.
   90:         </div>
   91:       ) : (
   92:         <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
   93:           <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
   94:             <tr>
   95:               <th className="px-3 py-2">우선순위</th>
   96:               <th className="px-3 py-2">콘텐츠 유형</th>
   97:               <th className="px-3 py-2">콘텐츠 ref</th>
   98:               <th className="px-3 py-2">위험도</th>
   99:               <th className="px-3 py-2">필요 역할</th>
  100:               <th className="px-3 py-2">상태</th>
  101:               <th className="px-3 py-2">SLA 마감</th>
  102:               <th className="px-3 py-2">담당</th>
  103:               <th className="px-3 py-2"></th>
  104:             </tr>
  105:           </thead>
  106:           <tbody>
  107:             {rows.map((r) => {
  108:               const isOverdue = r.sla_due_at && new Date(r.sla_due_at) < new Date();
  109:               return (
  110:                 <tr key={r.id} className="border-t border-slate-100">
  111:                   <td className="px-3 py-2 text-xs">
  112:                     <span className={r.priority === "P0" ? "rounded bg-rose-100 px-2 py-0.5 text-rose-700" : "rounded bg-slate-100 px-2 py-0.5"}>{r.priority}</span>
  113:                   </td>
  114:                   <td className="px-3 py-2 text-xs">{r.content_type}</td>
  115:                   <td className="px-3 py-2 font-mono text-xs">{r.content_ref}</td>
  116:                   <td className="px-3 py-2 text-xs">{r.page_risk_level}</td>
  117:                   <td className="px-3 py-2 text-xs">{r.required_roles.join(", ")}</td>
  118:                   <td className="px-3 py-2 text-xs">{r.status}</td>
  119:                   <td className={`px-3 py-2 text-xs ${isOverdue ? "text-rose-700" : "text-slate-500"}`}>
  120:                     {new Date(r.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}
  121:                     {isOverdue ? " ⚠" : ""}
  122:                   </td>
  123:                   <td className="px-3 py-2 text-xs">{r.assigned_name ?? "—"}</td>
  124:                   <td className="px-3 py-2 text-right">
  125:                     <Link href={`/admin/${params.instanceSlug}/review-queue/${r.id}`} className="text-xs text-blue-700 underline">검수</Link>
  126:                   </td>
  127:                 </tr>
  128:               );
  129:             })}
  130:           </tbody>
  131:         </table>
  132:       )}
  133:     </main>
  134:   );
  135: }
### apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts
    1: // @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
    2: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — approveEntry · rejectEntry
    3: 
    4: "use server";
    5: 
    6: import { revalidatePath } from "next/cache";
    7: import { notFound, redirect } from "next/navigation";
    8: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
    9: 
   10: import { getSqlBase } from "@/lib/db";
   11: import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
   12: import { withSkeletonTx } from "@/lib/tenant";
   13: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   14: import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
   15: import {
   16:   ComplianceConfigError,
   17:   ComplianceTransitionError,
   18:   ReviewerEligibilityError,
   19:   type ApproverRole,
   20:   type SubmitContentType,
   21: } from "@/lib/compliance/types";
   22: import type { SaveResult } from "@/lib/save-result";
   23: 
   24: const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
   25:   Article: "article",
   26:   TreatmentPage: "treatment_page",
   27:   LegalDocument: "legal_document",
   28:   FAQ: "faq",
   29:   Publication: "publication",
   30:   MediaAppearance: "media_appearance",
   31: };
   32: 
   33: export async function approveEntryAction(
   34:   instanceSlug: string,
   35:   entryId: string,
   36:   role: ApproverRole,
   37:   _prev: SaveResult | null,
   38:   _formData: FormData,
   39: ): Promise<SaveResult> {
   40:   const aCtx = await resolveActionContext(instanceSlug);
   41:   const sqlBase = getSqlBase();
   42:   try {
   43:     const result = await withSkeletonTx(
   44:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
   45:       async (tx, ctx) => {
   46:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
   47:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
   48:             FROM review_queue_entry
   49:            WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
   50:            LIMIT 1
   51:         `;
   52:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
   53:         const entry = rows[0]!;
   54:         const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
   55:         if (!table) {
   56:           return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
   57:         }
   58:         const out = await approveContent(tx, ctx, {
   59:           recordId: entry.compliance_record_id,
   60:           role,
   61:           contentTable: table,
   62:           contentRef: entry.content_ref,
   63:         });
   64:         return { ok: true as const, ctx, entry, out };
   65:       },
   66:     );
   67: 
   68:     if (result.ok === false && result.action === "notfound") notFound();
   69:     if (result.ok === false && result.action === "unsupported") {
   70:       return { ok: false, fieldErrors: {}, formError: result.message };
   71:     }
   72:     if (result.ok === true) {
   73:       try {
   74:         await emitAuditEvent(sqlBase, {
   75:           eventType: "content-approved",
   76:           actorUserId: result.ctx.userId,
   77:           targetUserId: result.ctx.userId,
   78:           toInstanceId: result.ctx.instanceId,
   79:           payload: {
   80:             contentType: result.entry.content_type,
   81:             contentRef: result.entry.content_ref,
   82:             recordId: result.entry.compliance_record_id,
   83:             role,
   84:             allApproved: result.out.allApproved,
   85:             entryStatus: result.out.entryStatus,
   86:           },
   87:         });
   88:       } catch (err) {
   89:         console.error("[approveEntryAction] audit emit failed", err);
   90:       }
   91:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
   92:       revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
   93:       return { ok: true, slug: entryId };
   94:     }
   95:     return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
   96:   } catch (err) {
   97:     if (isNextControlFlowError(err)) throw err;
   98:     if (err instanceof ReviewerEligibilityError) {
   99:       return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
  100:     }
  101:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  102:       return { ok: false, fieldErrors: {}, formError: err.message };
  103:     }
  104:     if (err instanceof TenantResolveError) {
  105:       const action = mapAuthDenyReasonToUi(err.reason);
  106:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  107:       if (action.kind === "not-found") notFound();
  108:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  109:     }
  110:     console.error("[approveEntryAction] unexpected", err);
  111:     return { ok: false, fieldErrors: {}, formError: "승인 중 오류가 발생했습니다." };
  112:   }
  113: }
  114: 
  115: export async function rejectEntryAction(
  116:   instanceSlug: string,
  117:   entryId: string,
  118:   role: ApproverRole,
  119:   _prev: SaveResult | null,
  120:   formData: FormData,
  121: ): Promise<SaveResult> {
  122:   const reason = String(formData.get("reason") ?? "").trim();
  123:   if (reason.length < 50) {
  124:     return { ok: false, fieldErrors: { reason: ["거부 사유는 50자 이상이어야 합니다."] } };
  125:   }
  126:   const aCtx = await resolveActionContext(instanceSlug);
  127:   const sqlBase = getSqlBase();
  128:   try {
  129:     const result = await withSkeletonTx(
  130:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  131:       async (tx, ctx) => {
  132:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
  133:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
  134:             FROM review_queue_entry
  135:            WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  136:            LIMIT 1
  137:         `;
  138:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  139:         const entry = rows[0]!;
  140:         const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
  141:         if (!table) {
  142:           return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
  143:         }
  144:         await rejectContent(tx, ctx, {
  145:           recordId: entry.compliance_record_id,
  146:           reason,
  147:           role,
  148:           contentTable: table,
  149:           contentRef: entry.content_ref,
  150:         });
  151:         return { ok: true as const, ctx, entry };
  152:       },
  153:     );
  154: 
  155:     if (result.ok === false && result.action === "notfound") notFound();
  156:     if (result.ok === false && result.action === "unsupported") {
  157:       return { ok: false, fieldErrors: {}, formError: result.message };
  158:     }
  159:     if (result.ok === true) {
  160:       try {
  161:         await emitAuditEvent(sqlBase, {
  162:           eventType: "content-rejected",
  163:           actorUserId: result.ctx.userId,
  164:           targetUserId: result.ctx.userId,
  165:           toInstanceId: result.ctx.instanceId,
  166:           payload: {
  167:             contentType: result.entry.content_type,
  168:             contentRef: result.entry.content_ref,
  169:             recordId: result.entry.compliance_record_id,
  170:             role,
  171:             reason,
  172:           },
  173:         });
  174:       } catch (err) {
  175:         console.error("[rejectEntryAction] audit emit failed", err);
  176:       }
  177:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
  178:       revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
  179:       redirect(`/admin/${instanceSlug}/review-queue`);
  180:     }
  181:     return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
  182:   } catch (err) {
  183:     if (isNextControlFlowError(err)) throw err;
  184:     if (err instanceof ReviewerEligibilityError) {
  185:       return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
  186:     }
  187:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  188:       return { ok: false, fieldErrors: {}, formError: err.message };
  189:     }
  190:     if (err instanceof TenantResolveError) {
  191:       const action = mapAuthDenyReasonToUi(err.reason);
  192:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  193:       if (action.kind === "not-found") notFound();
  194:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  195:     }
  196:     console.error("[rejectEntryAction] unexpected", err);
  197:     return { ok: false, fieldErrors: {}, formError: "거부 처리 중 오류가 발생했습니다." };
  198:   }
  199: }
### apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx
    1: // @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
    2: // SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01
    3: 
    4: import Link from "next/link";
    5: import { notFound, redirect } from "next/navigation";
    6: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    7: 
    8: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    9: import { requirePageContext } from "@/lib/page-context";
   10: import { withSkeletonTx } from "@/lib/tenant";
   11: import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
   12: import type { ApproverRole } from "@/lib/compliance/types";
   13: 
   14: type EntryRow = {
   15:   id: string;
   16:   content_type: string;
   17:   content_ref: string;
   18:   compliance_record_id: string;
   19:   status: string;
   20:   priority: string;
   21:   required_roles: string[];
   22:   sla_due_at: Date;
   23:   page_risk_level: string;
   24:   // record slots
   25:   peer_reviewer_name: string | null;
   26:   peer_reviewed_at: Date | null;
   27:   physician_approver_name: string | null;
   28:   physician_approved_at: Date | null;
   29:   legal_counsel_name: string | null;
   30:   legal_counsel_at: Date | null;
   31:   auto_check_result: unknown;
   32: };
   33: 
   34: export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
   35:   let pageCtx;
   36:   try {
   37:     pageCtx = await requirePageContext(params.instanceSlug);
   38:   } catch (err) {
   39:     if (err instanceof TenantResolveError) {
   40:       const a = mapAuthDenyReasonToUi(err.reason);
   41:       if (a.kind === "forbidden" || a.kind === "info") {
   42:         return <main className="p-6"><p>{a.message}</p></main>;
   43:       }
   44:     }
   45:     throw err;
   46:   }
   47: 
   48:   let entry: EntryRow | null;
   49:   let eligibleRoles: ApproverRole[] = [];
   50:   try {
   51:     const result = await withSkeletonTx(
   52:       { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
   53:       async (tx, ctx) => {
   54:         assertActionEligibility(ctx, "operator-edit-content");
   55:         const rows = await tx<EntryRow[]>`
   56:           SELECT e.id,
   57:                  e.content_type::text AS content_type,
   58:                  e.content_ref,
   59:                  e.compliance_record_id,
   60:                  e.status::text AS status,
   61:                  e.priority::text AS priority,
   62:                  e.required_roles::text[] AS required_roles,
   63:                  e.sla_due_at,
   64:                  cr.page_risk_level::text AS page_risk_level,
   65:                  cr.auto_check_result,
   66:                  cr.peer_reviewed_at,
   67:                  cr.physician_approved_at,
   68:                  cr.legal_counsel_at,
   69:                  (SELECT display_name FROM admin_user WHERE id = cr.peer_reviewer) AS peer_reviewer_name,
   70:                  (SELECT display_name FROM admin_user WHERE id = cr.physician_approver) AS physician_approver_name,
   71:                  (SELECT display_name FROM admin_user WHERE id = cr.legal_counsel) AS legal_counsel_name
   72:             FROM review_queue_entry e
   73:             JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
   74:            WHERE e.id = ${params.entryId}::uuid AND e.instance_id = ${ctx.instanceId}::uuid
   75:            LIMIT 1
   76:         `;
   77:         const e = rows[0] ?? null;
   78:         // 본인 가능 role 산정 — instance_membership.role 우선
   79:         const roles: ApproverRole[] = [];
   80:         if (ctx.role === "operator" || ctx.role === "super-admin") roles.push("operator");
   81:         if (ctx.user.physician_reviewer_eligible) roles.push("medical");
   82:         if (ctx.user.legal_reviewer_eligible) roles.push("legal");
   83:         return { entry: e, eligibleRoles: roles };
   84:       },
   85:     );
   86:     entry = result.entry;
   87:     eligibleRoles = result.eligibleRoles;
   88:   } catch (err) {
   89:     if (err instanceof TenantResolveError) {
   90:       const a = mapAuthDenyReasonToUi(err.reason);
   91:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
   92:       if (a.kind === "not-found") notFound();
   93:       if (a.kind === "forbidden" || a.kind === "info") {
   94:         return <main className="p-6"><p>{a.message}</p></main>;
   95:       }
   96:     }
   97:     throw err;
   98:   }
   99:   if (entry === null) notFound();
  100: 
  101:   // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
  102:   const filledRoles = new Set<ApproverRole>();
  103:   if (entry.peer_reviewed_at !== null) filledRoles.add("operator");
  104:   if (entry.physician_approved_at !== null) filledRoles.add("medical");
  105:   if (entry.legal_counsel_at !== null) filledRoles.add("legal");
  106:   const required = new Set(entry.required_roles as ApproverRole[]);
  107:   const actionableRoles = eligibleRoles.filter((r) => required.has(r) && !filledRoles.has(r));
  108: 
  109:   return (
  110:     <main className="flex flex-col gap-6">
  111:       <header className="flex items-center justify-between">
  112:         <h1 className="text-2xl font-semibold">검수 — {entry.content_type} · {entry.content_ref}</h1>
  113:         <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
  114:       </header>
  115: 
  116:       <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
  117:         <h2 className="mb-2 text-base font-medium">콘텐츠 메타</h2>
  118:         <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
  119:           <dt className="text-slate-500">유형</dt><dd>{entry.content_type}</dd>
  120:           <dt className="text-slate-500">slug</dt><dd className="font-mono text-xs">{entry.content_ref}</dd>
  121:           <dt className="text-slate-500">위험도</dt><dd>{entry.page_risk_level}</dd>
  122:           <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
  123:           <dt className="text-slate-500">우선순위</dt><dd>{entry.priority}</dd>
  124:           <dt className="text-slate-500">SLA 마감</dt><dd className="text-xs">{new Date(entry.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}</dd>
  125:           <dt className="text-slate-500">상태</dt><dd>{entry.status}</dd>
  126:         </dl>
  127:       </section>
  128: 
  129:       <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
  130:         <h2 className="mb-2 text-base font-medium">검수 슬롯</h2>
  131:         <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
  132:           <dt className="text-slate-500">operator (peer)</dt>
  133:           <dd>{entry.peer_reviewer_name ? `${entry.peer_reviewer_name} · ${entry.peer_reviewed_at ? new Date(entry.peer_reviewed_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
  134:           <dt className="text-slate-500">medical</dt>
  135:           <dd>{entry.physician_approver_name ? `${entry.physician_approver_name} · ${entry.physician_approved_at ? new Date(entry.physician_approved_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
  136:           <dt className="text-slate-500">legal</dt>
  137:           <dd>{entry.legal_counsel_name ? `${entry.legal_counsel_name} · ${entry.legal_counsel_at ? new Date(entry.legal_counsel_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
  138:         </dl>
  139:       </section>
  140: 
  141:       {actionableRoles.length === 0 ? (
  142:         <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">
  143:           본인이 수행 가능한 검수 역할이 없습니다.
  144:         </div>
  145:       ) : (
  146:         <section className="rounded-md border border-slate-200 bg-white p-4">
  147:           <h2 className="mb-2 text-base font-medium">검수 액션</h2>
  148:           <p className="mb-3 text-xs text-slate-500">본인 가능 역할: {actionableRoles.join(", ")}</p>
  149:           {actionableRoles.map((role) => (
  150:             <ReviewEntryActionForm
  151:               key={role}
  152:               instanceSlug={params.instanceSlug}
  153:               entryId={params.entryId}
  154:               role={role}
  155:             />
  156:           ))}
  157:         </section>
  158:       )}
  159:     </main>
  160:   );
  161: }
### apps/web/src/components/forms/ReviewEntryActionForm.tsx
    1: // @glitzy/web/components/forms/ReviewEntryActionForm — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1
    2: "use client";
    3: 
    4: import { useState } from "react";
    5: import { useFormState, useFormStatus } from "react-dom";
    6: import { approveEntryAction, rejectEntryAction } from "@/app/(admin)/admin/[instanceSlug]/review-queue/actions";
    7: import type { ApproverRole } from "@/lib/compliance/types";
    8: import type { SaveResult } from "@/lib/save-result";
    9: 
   10: const ROLE_LABEL: Record<ApproverRole, string> = {
   11:   operator: "operator (peer)",
   12:   medical: "medical (physicianApprover)",
   13:   legal: "legal (legalCounsel)",
   14: };
   15: 
   16: export function ReviewEntryActionForm({
   17:   instanceSlug,
   18:   entryId,
   19:   role,
   20: }: {
   21:   instanceSlug: string;
   22:   entryId: string;
   23:   role: ApproverRole;
   24: }) {
   25:   const boundApprove = approveEntryAction.bind(null, instanceSlug, entryId, role);
   26:   const boundReject = rejectEntryAction.bind(null, instanceSlug, entryId, role);
   27:   const [approveState, approveAction] = useFormState<SaveResult | null, FormData>(boundApprove, null);
   28:   const [rejectState, rejectAction] = useFormState<SaveResult | null, FormData>(boundReject, null);
   29:   const [reason, setReason] = useState("");
   30:   const approveError = approveState && approveState.ok === false ? approveState.formError : null;
   31:   const rejectError = rejectState && rejectState.ok === false ? rejectState.formError : null;
   32:   const rejectFieldErrors = rejectState && rejectState.ok === false ? rejectState.fieldErrors : {};
   33: 
   34:   return (
   35:     <div className="mt-4 border-t border-slate-100 pt-4">
   36:       <h3 className="mb-2 text-sm font-medium">{ROLE_LABEL[role]}</h3>
   37:       {(approveError || rejectError) && (
   38:         <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
   39:           {approveError ?? rejectError}
   40:         </div>
   41:       )}
   42:       <div className="flex flex-col gap-3">
   43:         <form action={approveAction}>
   44:           <ApproveBtn />
   45:         </form>
   46:         <form action={rejectAction} className="flex flex-col gap-2">
   47:           <label className="flex flex-col gap-1 text-xs">
   48:             <span>거부 사유 (50자 이상)</span>
   49:             <textarea
   50:               name="reason"
   51:               value={reason}
   52:               onChange={(e) => setReason(e.target.value)}
   53:               rows={3}
   54:               minLength={50}
   55:               maxLength={2000}
   56:               className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
   57:             />
   58:             {rejectFieldErrors?.reason && rejectFieldErrors.reason.length > 0 ? (
   59:               <span className="text-xs text-rose-700">{rejectFieldErrors.reason[0]}</span>
   60:             ) : null}
   61:           </label>
   62:           <RejectBtn />
   63:         </form>
   64:       </div>
   65:     </div>
   66:   );
   67: }
   68: 
   69: function ApproveBtn() {
   70:   const { pending } = useFormStatus();
   71:   return (
   72:     <button
   73:       type="submit"
   74:       disabled={pending}
   75:       className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
   76:     >
   77:       {pending ? "승인 중…" : "승인"}
   78:     </button>
   79:   );
   80: }
   81: 
   82: function RejectBtn() {
   83:   const { pending } = useFormStatus();
   84:   return (
   85:     <button
   86:       type="submit"
   87:       disabled={pending}
   88:       className="self-start rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
   89:     >
   90:       {pending ? "거부 중…" : "거부"}
   91:     </button>
   92:   );
   93: }
### apps/web/src/components/forms/WorkflowActionButtons.tsx
    1: // @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
    2: "use client";
    3: 
    4: import { useFormState, useFormStatus } from "react-dom";
    5: import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
    6: import type { SubmitContentType } from "@/lib/compliance/types";
    7: import type { SaveResult } from "@/lib/save-result";
    8: 
    9: export function WorkflowActionButtons({
   10:   instanceSlug,
   11:   contentType,
   12:   contentRef,
   13:   currentStatus,
   14: }: {
   15:   instanceSlug: string;
   16:   contentType: SubmitContentType;
   17:   contentRef: string;
   18:   currentStatus: string;
   19: }) {
   20:   return (
   21:     <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4">
   22:       <div className="flex items-center gap-3 text-sm">
   23:         <span className="text-slate-500">현재 상태:</span>
   24:         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{currentStatus}</span>
   25:       </div>
   26:       {(currentStatus === "draft" || currentStatus === "rejected") && (
   27:         <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
   28:       )}
   29:       {currentStatus === "publishable" && (
   30:         <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
   31:       )}
   32:       {currentStatus === "review-queued" || currentStatus === "in-review" ? (
   33:         <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
   34:       ) : null}
   35:       {currentStatus === "approved" ? (
   36:         <p className="text-xs text-amber-700">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
   37:       ) : null}
   38:     </div>
   39:   );
   40: }
   41: 
   42: function SubmitForReviewForm({
   43:   instanceSlug,
   44:   contentType,
   45:   contentRef,
   46: }: {
   47:   instanceSlug: string;
   48:   contentType: SubmitContentType;
   49:   contentRef: string;
   50: }) {
   51:   const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
   52:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
   53:   const err = state && state.ok === false ? state.formError : null;
   54:   return (
   55:     <form action={formAction} className="flex flex-col gap-2">
   56:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
   57:       <SubmitButton label="검수 요청" pendingLabel="요청 중…" color="bg-blue-700 hover:bg-blue-800" />
   58:     </form>
   59:   );
   60: }
   61: 
   62: function PublishForm({
   63:   instanceSlug,
   64:   contentType,
   65:   contentRef,
   66: }: {
   67:   instanceSlug: string;
   68:   contentType: SubmitContentType;
   69:   contentRef: string;
   70: }) {
   71:   const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
   72:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
   73:   const err = state && state.ok === false ? state.formError : null;
   74:   return (
   75:     <form action={formAction} className="flex flex-col gap-2">
   76:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
   77:       <SubmitButton label="발행" pendingLabel="발행 중…" color="bg-emerald-700 hover:bg-emerald-800" />
   78:     </form>
   79:   );
   80: }
   81: 
   82: function SubmitButton({ label, pendingLabel, color }: { label: string; pendingLabel: string; color: string }) {
   83:   const { pending } = useFormStatus();
   84:   return (
   85:     <button
   86:       type="submit"
   87:       disabled={pending}
   88:       className={`self-start rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${color}`}
   89:     >
   90:       {pending ? pendingLabel : label}
   91:     </button>
   92:   );
   93: }

 succeeded in 865ms:
### apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx
    1: // @glitzy/web/(admin)/[instanceSlug]/articles/[slug] — 편집
    2: // cycle2-3entity WEB-23: requirePageContext 통일
    3: import Link from "next/link";
    4: import { notFound, redirect } from "next/navigation";
    5: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    6: 
    7: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    8: import { requirePageContext } from "@/lib/page-context";
    9: import { withSkeletonTx } from "@/lib/tenant";
   10: import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
   11: import { DeleteForm } from "@/components/forms/DeleteForm";
   12: import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
   13: import { deleteArticle, saveArticle } from "../actions";
   14: 
   15: export default async function ArticleEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
   16:   let pageCtx;
   17:   try {
   18:     pageCtx = await requirePageContext(params.instanceSlug);
   19:   } catch (err) {
   20:     if (err instanceof TenantResolveError) {
   21:       const a = mapAuthDenyReasonToUi(err.reason);
   22:       if (a.kind === "forbidden" || a.kind === "info") {
   23:         return <main className="p-6"><p>{a.message}</p></main>;
   24:       }
   25:     }
   26:     throw err;
   27:   }
   28: 
   29:   // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
   30:   let bundle: {
   31:     initial: ArticleInitial;
   32:     doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   33:     categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   34:   } | null;
   35:   try {
   36:     bundle = await withSkeletonTx(
   37:     { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
   38:     async (tx, ctx): Promise<{
   39:       initial: ArticleInitial;
   40:       doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   41:       categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   42:     } | null> => {
   43:       assertActionEligibility(ctx, "operator-edit-content");
   44:       const articleRows = await tx<{
   45:         slug: string;
   46:         title: string;
   47:         summary: string;
   48:         body_markdown: string;
   49:         status: string;
   50:         risk_level: string | null;
   51:         hero_image_url: string | null;
   52:         author_doctor_id: string | null;
   53:         category_id: string;
   54:       }[]>`
   55:         SELECT slug, title, summary, body_markdown,
   56:                status::text AS status,
   57:                risk_level::text AS risk_level,
   58:                hero_image_url,
   59:                author_doctor_id,
   60:                category_id
   61:           FROM article
   62:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
   63:          LIMIT 1
   64:       `;
   65:       const r = articleRows[0];
   66:       if (!r) return null;
   67:       // cycle1-3entity WEB-09: 현재 author 가 inactive 여도 option 포함
   68:       const doctorRows = await tx<{ id: string; name: string; active: boolean }[]>`
   69:         SELECT id, name, active FROM doctor_profile
   70:          WHERE instance_id = ${ctx.instanceId}::uuid
   71:            AND (active = true OR id = ${r.author_doctor_id ?? null}::uuid)
   72:          ORDER BY active DESC, display_order ASC, name ASC
   73:       `;
   74:       const categoryRows = await tx<{ id: string; name: string }[]>`
   75:         SELECT id, name FROM article_category
   76:          WHERE instance_id = ${ctx.instanceId}::uuid
   77:          ORDER BY display_order ASC, name ASC
   78:       `;
   79:       return {
   80:         initial: {
   81:           slug: r.slug,
   82:           title: r.title,
   83:           summary: r.summary,
   84:           bodyMarkdown: r.body_markdown,
   85:           status: r.status,
   86:           riskLevel: r.risk_level ?? "",
   87:           heroImageUrl: r.hero_image_url ?? "",
   88:           authorDoctorId: r.author_doctor_id ?? "",
   89:           categoryId: r.category_id,
   90:         },
   91:         doctorOptions: doctorRows.map((d) => ({
   92:           value: d.id,
   93:           label: d.active ? d.name : `${d.name} (비활성)`,
   94:         })),
   95:         categoryOptions: categoryRows.map((c) => ({ value: c.id, label: c.name })),
   96:       };
   97:     },
   98:   );
   99:   } catch (err) {
  100:     if (err instanceof TenantResolveError) {
  101:       const a = mapAuthDenyReasonToUi(err.reason);
  102:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
  103:       if (a.kind === "not-found") notFound();
  104:       if (a.kind === "forbidden" || a.kind === "info") {
  105:         return <main className="p-6"><p>{a.message}</p></main>;
  106:       }
  107:     }
  108:     throw err;
  109:   }
  110:   if (bundle === null) notFound();
  111: 
  112:   const boundSave = saveArticle.bind(null, params.instanceSlug, params.slug);
  113:   const boundDelete = deleteArticle.bind(null, params.instanceSlug, params.slug);
  114: 
  115:   return (
  116:     <main className="flex flex-col gap-6">
  117:       <header className="flex items-center justify-between">
  118:         <h1 className="text-2xl font-semibold">아티클 편집 · {bundle.initial.title}</h1>
  119:         <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
  120:       </header>
  121: 
  122:       <WorkflowActionButtons
  123:         instanceSlug={params.instanceSlug}
  124:         contentType="Article"
  125:         contentRef={params.slug}
  126:         currentStatus={bundle.initial.status}
  127:       />
  128: 
  129:       <ArticleForm
  130:         action={boundSave}
  131:         initial={bundle.initial}
  132:         isNew={false}
  133:         doctorOptions={bundle.doctorOptions}
  134:         categoryOptions={bundle.categoryOptions}
  135:       />
  136: 
  137:       <DeleteForm action={boundDelete} confirmMessage="정말 이 아티클을 삭제하시겠습니까?" />
  138:     </main>
  139:   );
  140: }
### apps/web/src/components/forms/ArticleForm.tsx
    1: // @glitzy/web/components/forms/ArticleForm
    2: "use client";
    3: 
    4: import { useState } from "react";
    5: import { useFormState, useFormStatus } from "react-dom";
    6: import { Field, SelectField } from "./Field";
    7: import type { SaveResult } from "@/lib/save-result";
    8: 
    9: export type ArticleInitial = {
   10:   slug: string;
   11:   title: string;
   12:   summary: string;
   13:   bodyMarkdown: string;
   14:   status: string;
   15:   riskLevel: string;
   16:   heroImageUrl: string;
   17:   authorDoctorId: string;
   18:   categoryId: string;
   19: };
   20: 
   21: const empty: ArticleInitial = {
   22:   slug: "",
   23:   title: "",
   24:   summary: "",
   25:   bodyMarkdown: "",
   26:   status: "draft",
   27:   riskLevel: "",
   28:   heroImageUrl: "",
   29:   authorDoctorId: "",
   30:   categoryId: "",
   31: };
   32: 
   33: const STATUS_OPTIONS = [
   34:   { value: "draft", label: "초안" },
   35:   { value: "review-queued", label: "검수 대기" },
   36:   { value: "in-review", label: "검수 중" },
   37:   { value: "approved", label: "승인됨" },
   38:   { value: "publishable", label: "발행 가능" },
   39:   { value: "published", label: "발행됨" },
   40:   { value: "blocked", label: "차단" },
   41:   { value: "rejected", label: "거부" },
   42:   { value: "stale", label: "만료" },
   43: ];
   44: 
   45: const RISK_OPTIONS = [
   46:   { value: "Low", label: "Low" },
   47:   { value: "Medium", label: "Medium" },
   48:   { value: "High", label: "High" },
   49: ];
   50: 
   51: export function ArticleForm({
   52:   action,
   53:   initial,
   54:   isNew,
   55:   doctorOptions,
   56:   categoryOptions,
   57: }: {
   58:   action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
   59:   initial: ArticleInitial | null;
   60:   isNew: boolean;
   61:   doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   62:   categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   63: }) {
   64:   const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
   65:   const [v, setV] = useState<ArticleInitial>(initial ?? empty);
   66:   const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
   67:   const formError = state && state.ok === false ? state.formError ?? null : null;
   68:   const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));
   69: 
   70:   return (
   71:     <form action={formAction} className="flex flex-col gap-5">
   72:       {state?.ok === true && (
   73:         <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
   74:           저장되었습니다.
   75:         </div>
   76:       )}
   77:       {formError && (
   78:         <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
   79:       )}
   80: 
   81:       <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
   82:       <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
   83:       <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
   84:       <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
   85:       <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
   86:       {/* CAM-18 정정: status 직접 선택 차단 — workflow action 버튼 통해서만 전이. read-only display. */}
   87:       <label className="flex flex-col gap-1 text-sm">
   88:         <span>발행 상태 (workflow actions 통해서만 전이)</span>
   89:         <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
   90:       </label>
   91:       <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
   92:       <SelectField
   93:         name="authorDoctorId"
   94:         label="저자 (DoctorProfile)"
   95:         value={v.authorDoctorId}
   96:         onChange={(x) => set("authorDoctorId", x)}
   97:         options={doctorOptions}
   98:         errors={fieldErrors.authorDoctorId}
   99:         hint="선택 시 해당 의료진의 저자 권위 표시"
  100:       />
  101:       <SelectField
  102:         name="categoryId"
  103:         label="카테고리"
  104:         value={v.categoryId}
  105:         onChange={(x) => set("categoryId", x)}
  106:         options={categoryOptions}
  107:         errors={fieldErrors.categoryId}
  108:         hint="비워두면 기본 카테고리(general) 사용"
  109:       />
  110: 
  111:       <SubmitButton isNew={isNew} />
  112:     </form>
  113:   );
  114: }
  115: 
  116: function SubmitButton({ isNew }: { isNew: boolean }) {
  117:   const { pending } = useFormStatus();
  118:   return (
  119:     <button
  120:       type="submit"
  121:       disabled={pending}
  122:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
  123:     >
  124:       {pending ? "저장 중…" : isNew ? "추가" : "저장"}
  125:     </button>
  126:   );
  127: }
### apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts
    1: // @glitzy/web/(admin)/[instanceSlug]/articles/actions
    2: // cycle1-3entity patch: WEB-01·04·06·08·10·15
    3: 
    4: "use server";
    5: 
    6: import { revalidatePath } from "next/cache";
    7: import { notFound, redirect } from "next/navigation";
    8: import { z } from "zod";
    9: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
   10: import { UUID_V4_REGEX } from "@glitzy/shared-types";
   11: 
   12: import { getSqlBase } from "@/lib/db";
   13: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
   14: import { withSkeletonTx } from "@/lib/tenant";
   15: import { mapDbErrorToResult } from "@/lib/errors";
   16: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   17: import type { SaveResult } from "@/lib/save-result";
   18: 
   19: const PUBLICATION_STATUSES = [
   20:   "draft", "review-queued", "in-review", "approved", "publishable",
   21:   "published", "blocked", "rejected", "stale",
   22: ] as const;
   23: const RISK_LEVELS = ["Low", "Medium", "High"] as const;
   24: 
   25: const InputSchema = z.object({
   26:   slug: z
   27:     .string({ required_error: "slug 는 필수입니다." })
   28:     .transform((v) => v.trim())
   29:     .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
   30:       message: "slug 는 3~100자 (소문자/숫자/하이픈)",
   31:     }),
   32:   title: z
   33:     .string({ required_error: "제목은 필수입니다." })
   34:     .transform((v) => v.trim())
   35:     .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
   36:   summary: z
   37:     .string({ required_error: "요약은 필수입니다." })
   38:     .transform((v) => v.trim())
   39:     .refine((v) => v.length >= 80 && v.length <= 200, { message: "요약은 80~200자" }),
   40:   bodyMarkdown: z
   41:     .string({ required_error: "본문은 필수입니다." })
   42:     .min(1, "본문은 1자 이상")
   43:     .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
   44:   // cycle5-3entity WEB-53: enum value mismatch 한국어 메시지
   45:   status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
   46:   riskLevel: z
   47:     .string()
   48:     .transform((v) => v.trim())
   49:     .transform((v) => (v === "" ? null : v))
   50:     .nullable()
   51:     .optional()
   52:     .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
   53:       message: "위험도는 Low / Medium / High",
   54:     }),
   55:   heroImageUrl: z
   56:     .string()
   57:     .transform((v) => v.trim())
   58:     .transform((v) => (v === "" ? null : v))
   59:     .nullable()
   60:     .optional()
   61:     .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
   62:       message: "hero 이미지 URL 은 http/https · 2048자",
   63:     }),
   64:   authorDoctorId: z
   65:     .string()
   66:     .transform((v) => v.trim())
   67:     .transform((v) => (v === "" ? null : v))
   68:     .nullable()
   69:     .optional()
   70:     .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
   71:       message: "저자 UUID 형식 오류",
   72:     }),
   73:   // EAT_CONTENT v1.0 (EC-SCHEMA-05): C-04 Article.category required.
   74:   //   form 은 selected category UUID. action 안 비어 있으면 instance 의 default `general` 으로 fallback.
   75:   categoryId: z
   76:     .string()
   77:     .transform((v) => v.trim())
   78:     .transform((v) => (v === "" ? null : v))
   79:     .nullable()
   80:     .optional()
   81:     .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
   82:       message: "카테고리 UUID 형식 오류",
   83:     }),
   84: });
   85: 
   86: export type DeleteResult =
   87:   | { ok: true }
   88:   | { ok: false; formError: string };
   89: 
   90: export async function saveArticle(
   91:   instanceSlug: string,
   92:   originalSlug: string | null,
   93:   _prev: SaveResult | null,
   94:   formData: FormData,
   95: ): Promise<SaveResult> {
   96:   const parsed = InputSchema.safeParse(Object.fromEntries(formData));
   97:   if (!parsed.success) {
   98:     const fieldErrors: Record<string, string[]> = {};
   99:     for (const issue of parsed.error.issues) {
  100:       const field = issue.path.join(".") || "_";
  101:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  102:     }
  103:     return { ok: false, fieldErrors };
  104:   }
  105: 
  106:   const aCtx = await resolveActionContext(instanceSlug);
  107:   const sqlBase = getSqlBase();
  108: 
  109:   try {
  110:     const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
  111:       assertActionEligibility(ctx, "operator-edit-content");
  112: 
  113:       const isPublished = parsed.data.status === "published";
  114: 
  115:       // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
  116:       let currentAuthorId: string | null = null;
  117:       let currentCategoryId: string | null = null;
  118:       let beforePublishedAt: Date | null = null;
  119:       if (originalSlug !== null) {
  120:         const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null; category_id: string }[]>`
  121:           SELECT id, published_at, author_doctor_id, category_id FROM article
  122:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
  123:            FOR UPDATE
  124:         `;
  125:         if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
  126:         currentAuthorId = beforeRows[0]!.author_doctor_id;
  127:         currentCategoryId = beforeRows[0]!.category_id;
  128:         beforePublishedAt = beforeRows[0]!.published_at;
  129:       }
  130: 
  131:       // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 instance-scoped 사전 검증 (cycle 1 ECC-03 patch).
  132:       //   1) form 값이 있으면 같은 tx 안에서 SELECT 로 존재/tenant 확인 — 없으면 category-not-found.
  133:       //   2) 없으면 current row 의 categoryId 유지.
  134:       //   3) 둘 다 없으면 default `general` SELECT — 없으면 default-category-missing.
  135:       let resolvedCategoryId: string;
  136:       if (parsed.data.categoryId) {
  137:         const categoryRows = await tx<{ id: string }[]>`
  138:           SELECT id FROM article_category
  139:            WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
  140:            LIMIT 1
  141:         `;
  142:         if (categoryRows.length === 0) {
  143:           return { ok: false as const, action: "category-not-found" as const };
  144:         }
  145:         resolvedCategoryId = categoryRows[0]!.id;
  146:       } else if (currentCategoryId !== null) {
  147:         resolvedCategoryId = currentCategoryId;
  148:       } else {
  149:         const defaultCategoryRows = await tx<{ id: string }[]>`
  150:           SELECT id FROM article_category
  151:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
  152:            LIMIT 1
  153:         `;
  154:         if (defaultCategoryRows.length === 0) {
  155:           return { ok: false as const, action: "default-category-missing" as const };
  156:         }
  157:         resolvedCategoryId = defaultCategoryRows[0]!.id;
  158:       }
  159: 
  160:       // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
  161:       if (parsed.data.authorDoctorId) {
  162:         const doctorRows = await tx<{ id: string; active: boolean }[]>`
  163:           SELECT id, active FROM doctor_profile
  164:            WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
  165:            LIMIT 1
  166:         `;
  167:         if (doctorRows.length === 0) {
  168:           return { ok: false as const, action: "author-not-found" as const };
  169:         }
  170:         const d = doctorRows[0]!;
  171:         if (!d.active && d.id !== currentAuthorId) {
  172:           return { ok: false as const, action: "author-inactive" as const };
  173:         }
  174:       }
  175: 
  176:       if (originalSlug !== null) {
  177:         // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
  178:         //   saveArticle 은 본문 / metadata 만 갱신 — 현재 row status 보존.
  179:         await tx`
  180:           UPDATE article
  181:              SET slug = ${parsed.data.slug},
  182:                  title = ${parsed.data.title},
  183:                  summary = ${parsed.data.summary},
  184:                  body_markdown = ${parsed.data.bodyMarkdown},
  185:                  risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
  186:                  hero_image_url = ${parsed.data.heroImageUrl ?? null},
  187:                  author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
  188:                  category_id = ${resolvedCategoryId}::uuid,
  189:                  updated_at = now()
  190:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
  191:         `;
  192:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
  193:       }
  194: 
  195:       // 신규 article 은 항상 'draft' 로 시작 — workflow action 통해서만 전이.
  196:       await tx`
  197:         INSERT INTO article (
  198:           instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
  199:         ) VALUES (
  200:           ${ctx.instanceId}::uuid,
  201:           ${parsed.data.slug},
  202:           ${parsed.data.title},
  203:           ${parsed.data.summary},
  204:           ${parsed.data.bodyMarkdown},
  205:           'draft'::content_publication_status,
  206:           ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
  207:           ${parsed.data.heroImageUrl ?? null},
  208:           ${parsed.data.authorDoctorId ?? null}::uuid,
  209:           ${resolvedCategoryId}::uuid
  210:         )
  211:       `;
  212:       return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
  213:     });
  214: 
  215:     if (txResult.ok === false) {
  216:       if (txResult.action === "notfound") notFound();
  217:       if (txResult.action === "author-not-found") {
  218:         return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
  219:       }
  220:       if (txResult.action === "author-inactive") {
  221:         return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
  222:       }
  223:       if (txResult.action === "default-category-missing") {
  224:         return { ok: false, fieldErrors: {}, formError: "기본 카테고리가 없습니다. 관리자에게 문의하세요 (EC-SCHEMA-03)." };
  225:       }
  226:       if (txResult.action === "category-not-found") {
  227:         return { ok: false, fieldErrors: { categoryId: ["해당 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택하세요."] } };
  228:       }
  229:     }
  230:     if (txResult.ok === true) {
  231:       try {
  232:         await emitAuditEvent(sqlBase, {
  233:           eventType: "content-saved",
  234:           actorUserId: txResult.ctx.userId,
  235:           targetUserId: txResult.ctx.userId,
  236:           toInstanceId: txResult.ctx.instanceId,
  237:           payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
  238:         });
  239:       } catch (auditErr) {
  240:         console.error("[saveArticle] audit emit failed", auditErr);
  241:       }
  242:       revalidatePath(`/admin/${instanceSlug}/articles`);
  243:       revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
  244:       if (originalSlug !== null && originalSlug !== txResult.slug) {
  245:         revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
  246:       }
  247:       revalidatePath(`/admin/${instanceSlug}`);
  248:       if (originalSlug === null || originalSlug !== txResult.slug) {
  249:         redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
  250:       }
  251:       return { ok: true, slug: txResult.slug };
  252:     }
  253:     return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  254:   } catch (err) {
  255:     if (isNextControlFlowError(err)) throw err;
  256:     const mapped = mapDbErrorToResult(err);
  257:     if (mapped !== null) {
  258:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
  259:       return { ok: false, fieldErrors: {}, formError: mapped.message };
  260:     }
  261:     if (err instanceof TenantResolveError) {
  262:       const action = mapAuthDenyReasonToUi(err.reason);
  263:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  264:       if (action.kind === "not-found") notFound();
  265:       if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
  266:       // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
  267:       if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  268:     }
  269:     console.error("[saveArticle] unexpected", err);
  270:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  271:   }
  272: }
  273: 
  274: export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
  275:   const aCtx = await resolveActionContext(instanceSlug);
  276:   const sqlBase = getSqlBase();
  277: 
  278:   try {
  279:     const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
  280:       assertActionEligibility(ctx, "operator-edit-content");
  281:       const deleted = await tx<{ id: string }[]>`
  282:         DELETE FROM article
  283:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
  284:          RETURNING id
  285:       `;
  286:       return { deleted: deleted.length };
  287:     });
  288: 
  289:     if (result.deleted === 0) {
  290:       return { ok: false, formError: "해당 아티클이 이미 삭제되었습니다." };
  291:     }
  292: 
  293:     try {
  294:       await emitAuditEvent(sqlBase, {
  295:         eventType: "content-deleted",
  296:         actorUserId: aCtx.userId,
  297:         targetUserId: aCtx.userId,
  298:         toInstanceId: aCtx.instanceId,
  299:         payload: { contentType: "Article", slug },
  300:       });
  301:     } catch (err) {
  302:       console.error("[deleteArticle] audit emit failed", err);
  303:     }
  304: 
  305:     revalidatePath(`/admin/${instanceSlug}/articles`);
  306:     revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
  307:     revalidatePath(`/admin/${instanceSlug}`);
  308:     redirect(`/admin/${instanceSlug}/articles`);
  309:   } catch (err) {
  310:     if (isNextControlFlowError(err)) throw err;
  311:     if (err instanceof TenantResolveError) {
  312:       const action = mapAuthDenyReasonToUi(err.reason);
  313:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  314:       if (action.kind === "not-found") notFound();
  315:       if (action.kind === "forbidden") return { ok: false, formError: action.message };
  316:       // cycle5-3entity WEB-52: info branch 처리 (delete path)
  317:       if (action.kind === "info") return { ok: false, formError: action.message };
  318:     }
  319:     const mapped = mapDbErrorToResult(err);
  320:     if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
  321:     console.error("[deleteArticle] unexpected", err);
  322:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  323:   }
  324: }
### apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx
    1: // @glitzy/web/(admin)/[instanceSlug] — 대시보드 (Plan v1.0 § 3.2 step 3)
    2: // slug resolve → tenant resolve → ClinicProfile 존재 표시
    3: 
    4: import Link from "next/link";
    5: import { notFound, redirect } from "next/navigation";
    6: import { TenantResolveError } from "@glitzy/auth";
    7: 
    8: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    9: import { requirePageContext } from "@/lib/page-context";
   10: import { withSkeletonTx } from "@/lib/tenant";
   11: 
   12: export default async function DashboardPage({
   13:   params,
   14: }: {
   15:   params: { instanceSlug: string };
   16: }) {
   17:   // cycle3-3entity WEB-35: requirePageContext 통일 + branded UUID narrow + eligibility 통과
   18:   let pageCtx;
   19:   try {
   20:     pageCtx = await requirePageContext(params.instanceSlug);
   21:   } catch (err) {
   22:     if (err instanceof TenantResolveError) {
   23:       const a = mapAuthDenyReasonToUi(err.reason);
   24:       if (a.kind === "forbidden" || a.kind === "info") {
   25:         return <main className="p-6"><p>{a.message}</p></main>;
   26:       }
   27:     }
   28:     throw err;
   29:   }
   30: 
   31:   // tenant resolve + 각 entity 카운트 조회
   32:   try {
   33:     const data = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
   34:       const clinicRows = await tx<{ id: string; name: string; updated_at: Date }[]>`
   35:         SELECT id, name, updated_at FROM clinic_profile
   36:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
   37:          LIMIT 1
   38:       `;
   39:       const counts = await tx<{
   40:         doctors: string;
   41:         treatments: string;
   42:         articles: string;
   43:         categories: string;
   44:         publications: string;
   45:         media: string;
   46:         faqs: string;
   47:         reviewQueueOpen: string;
   48:       }[]>`
   49:         SELECT
   50:           (SELECT count(*) FROM doctor_profile WHERE instance_id = ${ctx.instanceId}::uuid AND active = true) AS doctors,
   51:           (SELECT count(*) FROM treatment_page WHERE instance_id = ${ctx.instanceId}::uuid) AS treatments,
   52:           (SELECT count(*) FROM article WHERE instance_id = ${ctx.instanceId}::uuid) AS articles,
   53:           (SELECT count(*) FROM article_category WHERE instance_id = ${ctx.instanceId}::uuid) AS categories,
   54:           (SELECT count(*) FROM publication WHERE instance_id = ${ctx.instanceId}::uuid) AS publications,
   55:           (SELECT count(*) FROM media_appearance WHERE instance_id = ${ctx.instanceId}::uuid) AS media,
   56:           (SELECT count(*) FROM faq WHERE instance_id = ${ctx.instanceId}::uuid) AS faqs,
   57:           (SELECT count(*) FROM review_queue_entry WHERE instance_id = ${ctx.instanceId}::uuid AND status IN ('open','in-progress')) AS "reviewQueueOpen"
   58:       `;
   59:       return { ctx, clinic: clinicRows[0] ?? null, counts: counts[0]! };
   60:     });
   61: 
   62:     return (
   63:       <main className="flex flex-col gap-6">
   64:         <h1 className="text-2xl font-semibold">대시보드</h1>
   65:         <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
   66:           <h2 className="mb-2 text-base font-medium">세션 컨텍스트</h2>
   67:           <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
   68:             <dt className="text-slate-500">이메일</dt>
   69:             <dd>{data.ctx.email}</dd>
   70:             <dt className="text-slate-500">역할</dt>
   71:             <dd>{data.ctx.role}</dd>
   72:             <dt className="text-slate-500">인스턴스 ID</dt>
   73:             <dd className="break-all font-mono text-xs">{data.ctx.instanceId}</dd>
   74:             <dt className="text-slate-500">슬러그</dt>
   75:             <dd>{params.instanceSlug}</dd>
   76:             <dt className="text-slate-500">super-admin</dt>
   77:             <dd>{data.ctx.isSuperAdmin ? "true" : "false"}</dd>
   78:           </dl>
   79:         </section>
   80: 
   81:         <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
   82:           <h2 className="mb-2 text-base font-medium">ClinicProfile</h2>
   83:           {data.clinic ? (
   84:             <div className="flex items-center justify-between">
   85:               <span>
   86:                 <strong>{data.clinic.name}</strong> · 마지막 수정 {new Date(data.clinic.updated_at).toISOString()}
   87:               </span>
   88:               <Link
   89:                 href={`/admin/${params.instanceSlug}/clinic-profile`}
   90:                 className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
   91:               >
   92:                 편집
   93:               </Link>
   94:             </div>
   95:           ) : (
   96:             <div className="flex items-center justify-between">
   97:               <span className="text-slate-500">아직 작성되지 않음.</span>
   98:               <Link
   99:                 href={`/admin/${params.instanceSlug}/clinic-profile`}
  100:                 className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
  101:               >
  102:                 작성
  103:               </Link>
  104:             </div>
  105:           )}
  106:         </section>
  107: 
  108:         <section className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
  109:           <EntityCard
  110:             href={`/admin/${params.instanceSlug}/doctors`}
  111:             title="의료진"
  112:             count={Number(data.counts.doctors)}
  113:             description="DoctorProfile · 활성"
  114:           />
  115:           <EntityCard
  116:             href={`/admin/${params.instanceSlug}/treatments`}
  117:             title="시술/진료 페이지"
  118:             count={Number(data.counts.treatments)}
  119:             description="TreatmentPage"
  120:           />
  121:           <EntityCard
  122:             href={`/admin/${params.instanceSlug}/articles`}
  123:             title="아티클"
  124:             count={Number(data.counts.articles)}
  125:             description="Article"
  126:           />
  127:           <EntityCard
  128:             href={`/admin/${params.instanceSlug}/categories`}
  129:             title="카테고리"
  130:             count={Number(data.counts.categories)}
  131:             description="ArticleCategory · taxonomy"
  132:           />
  133:           <EntityCard
  134:             href={`/admin/${params.instanceSlug}/publications`}
  135:             title="학술 인용"
  136:             count={Number(data.counts.publications)}
  137:             description="Publication · E-A-T"
  138:           />
  139:           <EntityCard
  140:             href={`/admin/${params.instanceSlug}/media-appearances`}
  141:             title="미디어 출연"
  142:             count={Number(data.counts.media)}
  143:             description="MediaAppearance · 권위 시그널"
  144:           />
  145:           <EntityCard
  146:             href={`/admin/${params.instanceSlug}/faqs`}
  147:             title="자주 묻는 질문"
  148:             count={Number(data.counts.faqs)}
  149:             description="FAQ · 발행 게이트 통과 시"
  150:           />
  151:           <EntityCard
  152:             href={`/admin/${params.instanceSlug}/review-queue`}
  153:             title="검수 큐"
  154:             count={Number(data.counts.reviewQueueOpen)}
  155:             description="manual-review · open/in-progress"
  156:           />
  157:         </section>
  158:       </main>
  159:     );
  160:   } catch (err) {
  161:     if (err instanceof TenantResolveError) {
  162:       const action = mapAuthDenyReasonToUi(err.reason);
  163:       // cycle2-code WEB-27: session 계열 deny 는 cleanup route 경유 (cookie clear + audit)
  164:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  165:       if (action.kind === "not-found") notFound();
  166:       if (action.kind === "forbidden") {
  167:         return <ForbiddenView message={action.message} />;
  168:       }
  169:       if (action.kind === "info") {
  170:         return <InfoView message={action.message} />;
  171:       }
  172:     }
  173:     throw err;
  174:   }
  175: }
  176: 
  177: function EntityCard({ href, title, count, description }: { href: string; title: string; count: number; description: string }) {
  178:   return (
  179:     <Link
  180:       href={href}
  181:       className="flex flex-col gap-1 rounded-md border border-slate-200 bg-white p-4 text-sm transition hover:border-slate-900 hover:shadow-sm"
  182:     >
  183:       <span className="text-base font-medium">{title}</span>
  184:       <span className="text-3xl font-semibold text-slate-900">{count}</span>
  185:       <span className="text-xs text-slate-500">{description}</span>
  186:     </Link>
  187:   );
  188: }
  189: 
  190: function ForbiddenView({ message }: { message: string }) {
  191:   return (
  192:     <main className="flex flex-col gap-4">
  193:       <h1 className="text-2xl font-semibold">접근 거부</h1>
  194:       <p className="text-sm text-slate-700">{message}</p>
  195:     </main>
  196:   );
  197: }
  198: 
  199: function InfoView({ message }: { message: string }) {
  200:   return (
  201:     <main className="flex flex-col gap-4">
  202:       <h1 className="text-2xl font-semibold">안내</h1>
  203:       <p className="text-sm text-slate-700">{message}</p>
  204:     </main>
  205:   );
  206: }

 succeeded in 907ms:
### apps\web\src\lib\compliance\__tests__\compliance.test.ts
    1: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 7 scenarios — vitest scope (자동 검증 가능 부분)
    2: 
    3: import { describe, it, expect } from "vitest";
    4: import { calculateFinalRoles, isRoleSatisfied } from "../final-roles";
    5: import { evaluatePublishable } from "../publishable-check";
    6: import { maxRisk } from "../risk";
    7: import { check, buildLegalDocumentExemptEnvelope } from "../check";
    8: import { assertTransitionAllowed, listAllowedTransitions } from "../transitions";
    9: import { ComplianceConfigError, ComplianceTransitionError } from "../types";
   10: 
   11: describe("calculateFinalRoles — 시나리오 1·2·3·12 일부", () => {
   12:   it("Article Low → {operator}", () => {
   13:     expect(calculateFinalRoles("Article", "Low")).toEqual(["operator"]);
   14:   });
   15:   it("Article Medium → {operator, medical}", () => {
   16:     expect(calculateFinalRoles("Article", "Medium")).toEqual(["medical", "operator"]);
   17:   });
   18:   it("LegalDocument Low → {operator, legal}", () => {
   19:     expect(calculateFinalRoles("LegalDocument", "Low")).toEqual(["legal", "operator"]);
   20:   });
   21:   it("Article High + priorReview → {operator, medical, legal}", () => {
   22:     expect(calculateFinalRoles("Article", "High", true)).toEqual(["legal", "medical", "operator"]);
   23:   });
   24:   it("unknown role throw (CAM2-04 fail closed)", () => {
   25:     expect(() => calculateFinalRoles("Article", "Low", false, ["alien"])).toThrow(ComplianceConfigError);
   26:   });
   27:   it("client role throw (CA-DEFER-10)", () => {
   28:     expect(() => calculateFinalRoles("Article", "Low", false, ["client"])).toThrow(ComplianceConfigError);
   29:   });
   30: });
   31: 
   32: describe("maxRisk — CAM-04 격하 금지", () => {
   33:   it("Low + High → High", () => {
   34:     expect(maxRisk("Low", "High")).toBe("High");
   35:   });
   36:   it("Medium + Low + Low → Medium", () => {
   37:     expect(maxRisk("Medium", "Low", "Low")).toBe("Medium");
   38:   });
   39:   it("Low + Low → Low", () => {
   40:     expect(maxRisk("Low", "Low")).toBe("Low");
   41:   });
   42: });
   43: 
   44: describe("check() M0 stub — 시나리오 11·12·13", () => {
   45:   it("Low 입력 → findings=[]·gateRequired=false·automatedDecision=pass", async () => {
   46:     const env = await check({
   47:       contentType: "Article",
   48:       contentRef: "test",
   49:       body: "",
   50:       metadata: { explicitRiskLevel: "Low" },
   51:     });
   52:     expect(env.result.findings).toEqual([]);
   53:     expect(env.result.gateRequired).toBe(false);
   54:     expect(env.result.automatedDecision).toBe("pass");
   55:     expect(env.meta.manualReview).toBe(true);
   56:     expect(env.meta.pageRiskLevel).toBe("Low");
   57:     expect(env.result.findingsBySeverity.info).toBe(0);
   58:   });
   59:   it("High 입력 → 가상 finding `m0-stub-risk-level-high-gate` + gateRequired=true", async () => {
   60:     const env = await check({
   61:       contentType: "Article",
   62:       contentRef: "test",
   63:       body: "",
   64:       metadata: { explicitRiskLevel: "High" },
   65:     });
   66:     expect(env.result.findings).toHaveLength(1);
   67:     expect(env.result.findings[0]!.ruleId).toBe("m0-stub-risk-level-high-gate");
   68:     expect(env.result.gateRequired).toBe(true);
   69:     expect(env.result.automatedDecision).toBe("gate");
   70:     expect(env.result.findingsBySeverity["content-gate"]).toBe(1);
   71:     expect(env.meta.pageRiskLevel).toBe("High");
   72:   });
   73:   it("LegalDocument 입력 → throw (CAM2-02)", async () => {
   74:     await expect(check({
   75:       contentType: "LegalDocument",
   76:       contentRef: "privacy",
   77:       body: "",
   78:       metadata: {},
   79:     })).rejects.toThrow(ComplianceConfigError);
   80:   });
   81:   it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
   82:     const env = buildLegalDocumentExemptEnvelope({
   83:       contentType: "LegalDocument",
   84:       contentRef: "privacy",
   85:       body: "",
   86:       metadata: {},
   87:     });
   88:     expect(env.meta.exemptReason).toBe("LegalDocument-CONTENT_STANDARDS-7.1.1.1");
   89:     expect(env.meta.manualReview).toBe(false);
   90:     expect(env.result.automatedDecision).toBe("pass");
   91:     expect(env.result.findingsBySeverity.info).toBe(0);
   92:   });
   93:   it("Low explicit + High inferred → High (격하 금지)", async () => {
   94:     const env = await check({
   95:       contentType: "Article",
   96:       contentRef: "test",
   97:       body: "",
   98:       metadata: { explicitRiskLevel: "Low", inferredRiskLevel: "High" },
   99:     });
  100:     expect(env.meta.pageRiskLevel).toBe("High");
  101:     expect(env.result.gateRequired).toBe(true);
  102:   });
  103: });
  104: 
  105: describe("status 전이 table — 시나리오 14 일부", () => {
  106:   it("draft → review-queued 허용", () => {
  107:     expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
  108:   });
  109:   it("draft → published 차단", () => {
  110:     expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
  111:   });
  112:   it("publishable → published 허용", () => {
  113:     expect(() => assertTransitionAllowed("publishable", "published")).not.toThrow();
  114:   });
  115:   it("listAllowedTransitions", () => {
  116:     expect(listAllowedTransitions("review-queued")).toContain("in-review");
  117:   });
  118: });
  119: 
  120: describe("evaluatePublishable — 시나리오 4·5", () => {
  121:   const baseRecord = {
  122:     peer_reviewer: null,
  123:     peer_reviewed_at: null,
  124:     physician_approver: null,
  125:     physician_approved_at: null,
  126:     legal_counsel: null,
  127:     legal_counsel_at: null,
  128:     page_risk_level: "Low" as const,
  129:     prior_review_required: false,
  130:     prior_review_passed: null,
  131:     auto_check_result: { automatedDecision: "pass", requiredApproverRoles: [] },
  132:   };
  133:   it("Low Article + operator 충족 → publishable=true", () => {
  134:     const result = evaluatePublishable(
  135:       { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
  136:       "Article",
  137:     );
  138:     expect(result.publishable).toBe(true);
  139:   });
  140:   it("Medium Article + operator only → missing medical", () => {
  141:     const result = evaluatePublishable(
  142:       { ...baseRecord, page_risk_level: "Medium", peer_reviewer: "u1", peer_reviewed_at: new Date() },
  143:       "Article",
  144:     );
  145:     expect(result.publishable).toBe(false);
  146:     if (result.publishable === false && "missingRoles" in result) {
  147:       expect(result.missingRoles).toContain("medical");
  148:     }
  149:   });
  150:   it("LegalDocument + operator only → missing legal", () => {
  151:     const result = evaluatePublishable(
  152:       { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
  153:       "LegalDocument",
  154:     );
  155:     expect(result.publishable).toBe(false);
  156:     if (result.publishable === false && "missingRoles" in result) {
  157:       expect(result.missingRoles).toContain("legal");
  158:     }
  159:   });
  160:   it("automatedDecision=block → publishable=false (CAM-06)", () => {
  161:     const result = evaluatePublishable(
  162:       { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "block" } },
  163:       "Article",
  164:     );
  165:     expect(result.publishable).toBe(false);
  166:   });
  167:   it("unknown role in requiredApproverRoles → configError (CAM2-04)", () => {
  168:     const result = evaluatePublishable(
  169:       { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "pass", requiredApproverRoles: ["alien"] } },
  170:       "Article",
  171:     );
  172:     expect(result.publishable).toBe(false);
  173:     if (result.publishable === false && "configError" in result && result.configError) {
  174:       expect(result.configError).toContain("Unknown ApproverRole");
  175:     }
  176:   });
  177: });
  178: 
  179: describe("isRoleSatisfied", () => {
  180:   const r = {
  181:     peer_reviewer: "u1", peer_reviewed_at: new Date(),
  182:     physician_approver: null, physician_approved_at: null,
  183:     legal_counsel: null, legal_counsel_at: null,
  184:     page_risk_level: "Low" as const,
  185:     prior_review_required: false,
  186:     prior_review_passed: null,
  187:     auto_check_result: null,
  188:   };
  189:   it("operator 충족", () => expect(isRoleSatisfied(r, "operator")).toBe(true));
  190:   it("medical 미충족", () => expect(isRoleSatisfied(r, "medical")).toBe(false));
  191: });
### apps\web\src\lib\compliance\check.ts
    1: // @glitzy/web/lib/compliance/check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4 (CAM-03·04·05·09 + CAM2-01·02)
    2: // check() M0 stub — manualReview only · ruleCatalog 미합류 (CA-DEFER-01·02·03·04).
    3: 
    4: import type {
    5:   ComplianceCheckInput,
    6:   ComplianceCheckResult,
    7:   ComplianceCheckEnvelope,
    8:   Finding,
    9: } from "./types";
   10: import { ComplianceConfigError } from "./types";
   11: import { maxRisk } from "./risk";
   12: 
   13: const CATALOG_VERSION = "m0-stub-v0.1";
   14: const CATALOG_HASH = "stub";
   15: 
   16: /**
   17:  * LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
   18:  *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
   19:  *   result 는 SoT 7 필드만 (automatedDecision='pass' · 모든 카운터 0).
   20:  *   exemptReason 은 meta 안.
   21:  */
   22: export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
   23:   return {
   24:     result: {
   25:       automatedDecision: "pass",
   26:       buildBlocked: false,
   27:       gateRequired: false,
   28:       hasWarnings: false,
   29:       findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
   30:       requiredApproverRoles: [],
   31:       findings: [],
   32:     },
   33:     meta: {
   34:       pageRiskLevel: input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low",
   35:       catalogVersion: CATALOG_VERSION,
   36:       catalogHash: CATALOG_HASH,
   37:       manualReview: false,
   38:       exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
   39:     },
   40:   };
   41: }
   42: 
   43: /**
   44:  * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
   45:  *
   46:  * **M0 v0.1 동작**:
   47:  * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
   48:  * - pageRiskLevel = maxRisk(explicitRiskLevel ?? Low, inferredRiskLevel ?? Low, Low) — 격하 금지 (CAM-04)
   49:  * - High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true (CAM-05)
   50:  * - 그 외 입력 시 findings=[]·gateRequired=false·automatedDecision='pass'
   51:  * - ruleCatalog 미합류 — CA-DEFER-01·02 marker · LLM CA-DEFER-03 · 캐시 CA-DEFER-04
   52:  */
   53: export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
   54:   if (input.contentType === "LegalDocument") {
   55:     throw new ComplianceConfigError(
   56:       "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
   57:       "Use buildLegalDocumentExemptEnvelope() instead.",
   58:     );
   59:   }
   60: 
   61:   const pageRiskLevel = maxRisk(
   62:     input.metadata.explicitRiskLevel ?? "Low",
   63:     input.metadata.inferredRiskLevel ?? "Low",
   64:     "Low",
   65:   );
   66: 
   67:   const findings: Finding[] = [];
   68:   let gateRequired = false;
   69:   let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
   70: 
   71:   if (pageRiskLevel === "High") {
   72:     findings.push({
   73:       ruleId: "m0-stub-risk-level-high-gate",
   74:       category: "risk-level-virtual",
   75:       pattern: "",
   76:       severity: "content-gate",
   77:       location: { start: 0, end: 0 },
   78:       requiredApproverRoles: ["medical"],
   79:       triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
   80:     });
   81:     gateRequired = true;
   82:     automatedDecision = "gate";
   83:   }
   84: 
   85:   return {
   86:     result: {
   87:       automatedDecision,
   88:       buildBlocked: false,
   89:       gateRequired,
   90:       hasWarnings: false,
   91:       findingsBySeverity: {
   92:         fail: 0,
   93:         "content-gate": gateRequired ? 1 : 0,
   94:         warning: 0,
   95:         info: 0,
   96:       },
   97:       requiredApproverRoles: gateRequired ? ["medical"] : [],
   98:       findings,
   99:     },
  100:     meta: { pageRiskLevel, catalogVersion: CATALOG_VERSION, catalogHash: CATALOG_HASH, manualReview: true },
  101:   };
  102: }
### apps\web\src\lib\compliance\eligibility.ts
    1: // @glitzy/web/lib/compliance/eligibility — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 (CA-ACTION-03)
    2: // admin_user role flag 검증 — assertActionEligibility wrapper.
    3: 
    4: import { assertActionEligibility, TenantResolveError, type TenantContext } from "@glitzy/auth";
    5: 
    6: import type { ApproverRole } from "./types";
    7: import { ReviewerEligibilityError } from "./types";
    8: 
    9: /**
   10:  * ApproverRole 별 admin_user flag 검증 (CAM-17·18 정합):
   11:  *   - operator: operator/super-admin role + operator-edit-content action
   12:  *   - medical: physician_reviewer_eligible flag + physician-review-approve action
   13:  *   - legal: legal_reviewer_eligible flag + legal-review-approve action
   14:  *
   15:  * assertActionEligibility 안 TenantResolveError throw → ReviewerEligibilityError 변환.
   16:  */
   17: export function assertReviewerEligibility(ctx: TenantContext, role: ApproverRole): void {
   18:   try {
   19:     if (role === "operator") {
   20:       assertActionEligibility(ctx, "operator-edit-content");
   21:     } else if (role === "medical") {
   22:       assertActionEligibility(ctx, "physician-review-approve");
   23:     } else if (role === "legal") {
   24:       assertActionEligibility(ctx, "legal-review-approve");
   25:     }
   26:   } catch (err) {
   27:     if (err instanceof TenantResolveError) {
   28:       throw new ReviewerEligibilityError(`Reviewer eligibility denied: role=${role} reason=${err.reason}`);
   29:     }
   30:     throw err;
   31:   }
   32: }
### apps\web\src\lib\compliance\entity-actions.ts
    1: // @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
    2: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
    3: // 모든 6 entity edit page 가 사용.
    4: 
    5: "use server";
    6: 
    7: import { revalidatePath } from "next/cache";
    8: import { notFound, redirect } from "next/navigation";
    9: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
   10: 
   11: import { getSqlBase } from "@/lib/db";
   12: import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
   13: import { withSkeletonTx } from "@/lib/tenant";
   14: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   15: import { submitForReview, publishContent } from "./server-actions";
   16: import {
   17:   ComplianceConfigError,
   18:   ComplianceTransitionError,
   19:   ReviewerEligibilityError,
   20:   type SubmitContentType,
   21: } from "./types";
   22: import type { SaveResult } from "@/lib/save-result";
   23: 
   24: const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
   25:   Article: "article",
   26:   TreatmentPage: "treatment_page",
   27:   LegalDocument: "legal_document",
   28:   FAQ: "faq",
   29:   Publication: "publication",
   30:   MediaAppearance: "media_appearance",
   31: };
   32: 
   33: const ENTITY_ROUTES: Record<SubmitContentType, string> = {
   34:   Article: "articles",
   35:   TreatmentPage: "treatments",
   36:   LegalDocument: "legal-documents",
   37:   FAQ: "faqs",
   38:   Publication: "publications",
   39:   MediaAppearance: "media-appearances",
   40: };
   41: 
   42: export async function submitForReviewAction(
   43:   instanceSlug: string,
   44:   contentType: SubmitContentType,
   45:   contentRef: string,
   46:   _prev: SaveResult | null,
   47:   _formData: FormData,
   48: ): Promise<SaveResult> {
   49:   const aCtx = await resolveActionContext(instanceSlug);
   50:   const sqlBase = getSqlBase();
   51:   try {
   52:     const result = await withSkeletonTx(
   53:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
   54:       async (tx, ctx) => {
   55:         const table = ENTITY_TABLES[contentType];
   56:         // 현재 entity row FOR UPDATE 로 잠금 + status/risk_level 추출
   57:         const rows = await tx.unsafe<{ status: string; risk_level: string | null }[]>(`
   58:           SELECT status::text AS status,
   59:                  ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
   60:             FROM ${table}
   61:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
   62:            LIMIT 1
   63:         `);
   64:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
   65:         const out = await submitForReview(tx, ctx, {
   66:           contentType,
   67:           contentRef,
   68:           contentRow: { status: rows[0]!.status, risk_level: rows[0]!.risk_level },
   69:         });
   70:         // entity status draft → review-queued
   71:         await tx.unsafe(`
   72:           UPDATE ${table}
   73:              SET status = 'review-queued'::content_publication_status, updated_at = now()
   74:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
   75:         `);
   76:         return { ok: true as const, ctx, out };
   77:       },
   78:     );
   79: 
   80:     if (result.ok === false && result.action === "notfound") notFound();
   81:     if (result.ok === true) {
   82:       try {
   83:         await emitAuditEvent(sqlBase, {
   84:           eventType: "content-submitted-for-review",
   85:           actorUserId: result.ctx.userId,
   86:           targetUserId: result.ctx.userId,
   87:           toInstanceId: result.ctx.instanceId,
   88:           payload: { contentType, contentRef, recordId: result.out.recordId, entryId: result.out.entryId },
   89:         });
   90:       } catch (err) {
   91:         console.error("[submitForReviewAction] audit emit failed", err);
   92:       }
   93:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
   94:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
   95:       revalidatePath(`/admin/${instanceSlug}`);
   96:       return { ok: true, slug: contentRef };
   97:     }
   98:     return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
   99:   } catch (err) {
  100:     if (isNextControlFlowError(err)) throw err;
  101:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
  102:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  103:       return { ok: false, fieldErrors: {}, formError: err.message };
  104:     }
  105:     if (err instanceof TenantResolveError) {
  106:       const action = mapAuthDenyReasonToUi(err.reason);
  107:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  108:       if (action.kind === "not-found") notFound();
  109:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  110:     }
  111:     console.error("[submitForReviewAction] unexpected", err);
  112:     return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
  113:   }
  114: }
  115: 
  116: export async function publishContentAction(
  117:   instanceSlug: string,
  118:   contentType: SubmitContentType,
  119:   contentRef: string,
  120:   _prev: SaveResult | null,
  121:   _formData: FormData,
  122: ): Promise<SaveResult> {
  123:   const aCtx = await resolveActionContext(instanceSlug);
  124:   const sqlBase = getSqlBase();
  125:   try {
  126:     const result = await withSkeletonTx(
  127:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  128:       async (tx, ctx) => {
  129:         const table = ENTITY_TABLES[contentType];
  130:         // 현재 entity row FOR UPDATE + compliance_record_id 추출
  131:         const rows = await tx.unsafe<{ compliance_record_id: string | null; status: string }[]>(`
  132:           SELECT compliance_record_id, status::text AS status FROM ${table}
  133:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  134:            FOR UPDATE
  135:         `);
  136:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  137:         const row = rows[0]!;
  138:         if (row.status !== "publishable") {
  139:           return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
  140:         }
  141:         if (!row.compliance_record_id) {
  142:           return { ok: false as const, action: "no-record" as const };
  143:         }
  144:         // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기
  145:         const recRows = await tx<{ id: string }[]>`
  146:           SELECT id FROM compliance_record
  147:            WHERE instance_id = ${ctx.instanceId}::uuid
  148:              AND content_type = ${contentType}::compliance_content_type
  149:              AND content_ref = ${contentRef}
  150:              AND record_phase = 'pre-publish'::compliance_record_phase
  151:            ORDER BY record_version DESC
  152:            LIMIT 1
  153:         `;
  154:         if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
  155:         await publishContent(tx, ctx, {
  156:           contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
  157:         });
  158:         return { ok: true as const, ctx, recordId: recRows[0]!.id };
  159:       },
  160:     );
  161: 
  162:     if (result.ok === false && result.action === "notfound") notFound();
  163:     if (result.ok === false && result.action === "no-record") {
  164:       return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
  165:     }
  166:     if (result.ok === false && result.action === "not-publishable") {
  167:       return { ok: false, fieldErrors: {}, formError: result.message };
  168:     }
  169:     if (result.ok === true) {
  170:       try {
  171:         await emitAuditEvent(sqlBase, {
  172:           eventType: "content-published",
  173:           actorUserId: result.ctx.userId,
  174:           targetUserId: result.ctx.userId,
  175:           toInstanceId: result.ctx.instanceId,
  176:           payload: { contentType, contentRef, recordId: result.recordId },
  177:         });
  178:       } catch (err) {
  179:         console.error("[publishContentAction] audit emit failed", err);
  180:       }
  181:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
  182:       revalidatePath(`/admin/${instanceSlug}`);
  183:       return { ok: true, slug: contentRef };
  184:     }
  185:     return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  186:   } catch (err) {
  187:     if (isNextControlFlowError(err)) throw err;
  188:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
  189:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  190:       return { ok: false, fieldErrors: {}, formError: err.message };
  191:     }
  192:     if (err instanceof TenantResolveError) {
  193:       const action = mapAuthDenyReasonToUi(err.reason);
  194:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  195:       if (action.kind === "not-found") notFound();
  196:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  197:     }
  198:     console.error("[publishContentAction] unexpected", err);
  199:     return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
  200:   }
  201: }
### apps\web\src\lib\compliance\final-roles.ts
    1: // @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
    2: // REVIEW_WORKFLOW § 4.1 SoT.
    3: 
    4: import type { ApproverRole, ContentType, RiskLevel } from "./types";
    5: import { ComplianceConfigError } from "./types";
    6: 
    7: const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);
    8: 
    9: /**
   10:  * unknown role fail closed (CAM-16 + CAM2-04 정정):
   11:  *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
   12:  *   server action 안 try/catch 로 form-level error 변환.
   13:  */
   14: export function calculateFinalRoles(
   15:   contentType: ContentType,
   16:   pageRiskLevel: RiskLevel,
   17:   priorReviewRequired: boolean = false,
   18:   requiredApproverRoles: readonly string[] = [],
   19: ): ApproverRole[] {
   20:   for (const r of requiredApproverRoles) {
   21:     if (r === "client") {
   22:       throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
   23:     }
   24:     if (!KNOWN_ROLES.has(r)) {
   25:       throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
   26:     }
   27:   }
   28:   const roles = new Set<ApproverRole>(["operator"]);
   29:   if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
   30:   if (contentType === "LegalDocument") roles.add("legal");
   31:   if (priorReviewRequired) roles.add("legal");
   32:   for (const r of requiredApproverRoles) {
   33:     roles.add(r as ApproverRole);
   34:   }
   35:   return Array.from(roles).sort();
   36: }
   37: 
   38: export type ComplianceRecordRow = {
   39:   peer_reviewer: string | null;
   40:   peer_reviewed_at: Date | null;
   41:   physician_approver: string | null;
   42:   physician_approved_at: Date | null;
   43:   legal_counsel: string | null;
   44:   legal_counsel_at: Date | null;
   45:   page_risk_level: RiskLevel;
   46:   prior_review_required: boolean;
   47:   prior_review_passed: boolean | null;
   48:   auto_check_result: unknown;
   49: };
   50: 
   51: export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
   52:   if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
   53:   if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
   54:   if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
   55:   return false;
   56: }
### apps\web\src\lib\compliance\publishable-check.ts
    1: // @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
    2: // REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.
    3: 
    4: import type { ApproverRole, ContentType } from "./types";
    5: import { ComplianceConfigError } from "./types";
    6: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
    7: 
    8: export type PublishableResult =
    9:   | { publishable: true; finalRoles: ApproverRole[] }
   10:   | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
   11:   | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };
   12: 
   13: export function evaluatePublishable(
   14:   record: ComplianceRecordRow,
   15:   contentType: ContentType,
   16: ): PublishableResult {
   17:   const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
   18:   const required = autoCheck?.requiredApproverRoles ?? [];
   19: 
   20:   let finalRoles: ApproverRole[];
   21:   try {
   22:     finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
   23:   } catch (err) {
   24:     if (err instanceof ComplianceConfigError) {
   25:       return { publishable: false, reasons: [err.message], configError: err.message };
   26:     }
   27:     throw err;
   28:   }
   29: 
   30:   const reasons: string[] = [];
   31:   const missingRoles: ApproverRole[] = [];
   32: 
   33:   // (1) automatedDecision !== "block"
   34:   if (autoCheck?.automatedDecision === "block") {
   35:     reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
   36:   }
   37:   // (2) finalRoles 슬롯 모두 기록
   38:   for (const role of finalRoles) {
   39:     if (!isRoleSatisfied(record, role)) {
   40:       missingRoles.push(role);
   41:       reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
   42:     }
   43:   }
   44:   // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
   45:   if (record.prior_review_required && record.prior_review_passed !== true) {
   46:     reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
   47:   }
   48:   // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
   49:   // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
   50:   // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)
   51: 
   52:   if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
   53:   return { publishable: true, finalRoles };
   54: }
### apps\web\src\lib\compliance\risk.ts
    1: // @glitzy/web/lib/compliance/risk — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.2 CA-GATE-02 (CAM-04)
    2: // RiskLevel MAX 결합 helper. 격하 금지.
    3: 
    4: import type { RiskLevel } from "./types";
    5: 
    6: const ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };
    7: 
    8: export function maxRisk(...levels: RiskLevel[]): RiskLevel {
    9:   let max: RiskLevel = "Low";
   10:   for (const l of levels) {
   11:     if (ORDER[l] > ORDER[max]) max = l;
   12:   }
   13:   return max;
   14: }
### apps\web\src\lib\compliance\server-actions.ts
    1: // @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
    2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
    3: // 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.
    4: 
    5: import type { ScopedTx } from "@glitzy/db";
    6: import type { TenantContext } from "@glitzy/auth";
    7: 
    8: import type {
    9:   ApproverRole,
   10:   ComplianceCheckEnvelope,
   11:   ContentType,
   12:   SubmitContentType,
   13: } from "./types";
   14: import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
   15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
   16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
   17: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
   18: import { evaluatePublishable } from "./publishable-check";
   19: import { assertReviewerEligibility } from "./eligibility";
   20: 
   21: const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };
   22: 
   23: /**
   24:  * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
   25:  *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
   26:  */
   27: async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
   28:   await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
   29: }
   30: 
   31: function isAllowedSubmitType(t: string): t is SubmitContentType {
   32:   return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
   33: }
   34: 
   35: export type SubmitForReviewArgs = {
   36:   contentType: SubmitContentType;
   37:   contentRef: string;
   38:   contentRow: { status: string; risk_level?: string | null; body?: string };
   39: };
   40: 
   41: export type SubmitForReviewResult = { recordId: string; entryId: string };
   42: 
   43: /**
   44:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
   45:  */
   46: export async function submitForReview(
   47:   tx: ScopedTx,
   48:   ctx: TenantContext,
   49:   args: SubmitForReviewArgs,
   50: ): Promise<SubmitForReviewResult> {
   51:   if (!isAllowedSubmitType(args.contentType)) {
   52:     throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
   53:   }
   54:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
   55: 
   56:   const checkInput = {
   57:     contentType: args.contentType,
   58:     contentRef: args.contentRef,
   59:     body: args.contentRow.body ?? "",
   60:     metadata: {
   61:       explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
   62:     },
   63:   };
   64:   const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
   65:     ? buildLegalDocumentExemptEnvelope(checkInput)
   66:     : await check(checkInput);
   67: 
   68:   const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
   69:   const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
   70: 
   71:   // ComplianceRecord INSERT (pre-publish)
   72:   const slaHours = SLA_DUE_HOURS.P0;
   73:   const recordRows = await tx<{ id: string }[]>`
   74:     INSERT INTO compliance_record (
   75:       instance_id, content_type, content_ref, page_risk_level, auto_check_result,
   76:       record_phase, record_version, metadata
   77:     ) VALUES (
   78:       ${ctx.instanceId}::uuid,
   79:       ${args.contentType}::compliance_content_type,
   80:       ${args.contentRef},
   81:       ${envelope.meta.pageRiskLevel}::risk_level,
   82:       ${JSON.stringify(envelope.result)}::jsonb,
   83:       'pre-publish'::compliance_record_phase,
   84:       1,
   85:       ${JSON.stringify({
   86:         manualReview: envelope.meta.manualReview,
   87:         catalogVersion: envelope.meta.catalogVersion,
   88:         catalogHash: envelope.meta.catalogHash,
   89:         ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
   90:       })}::jsonb
   91:     )
   92:     RETURNING id
   93:   `;
   94:   const recordId = recordRows[0]!.id;
   95: 
   96:   // ReviewQueueEntry INSERT (open)
   97:   const entryRows = await tx<{ id: string }[]>`
   98:     INSERT INTO review_queue_entry (
   99:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
  100:       status, priority, required_roles, sla_due_at
  101:     ) VALUES (
  102:       ${ctx.instanceId}::uuid,
  103:       'manual-review'::review_queue_type,
  104:       ${args.contentType}::compliance_content_type,
  105:       ${args.contentRef},
  106:       ${recordId}::uuid,
  107:       'open'::review_queue_status,
  108:       'P0'::review_queue_priority,
  109:       ${finalRoles}::approver_role[],
  110:       ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
  111:     )
  112:     RETURNING id
  113:   `;
  114:   const entryId = entryRows[0]!.id;
  115: 
  116:   return { recordId, entryId };
  117: }
  118: 
  119: export type ApproveContentArgs = {
  120:   recordId: string;
  121:   role: ApproverRole;
  122:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  123:   contentRef: string;
  124: };
  125: 
  126: export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
  127: 
  128: /**
  129:  * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
  130:  * AND 게이트 충족 시 in-review → approved 자동 전이.
  131:  */
  132: export async function approveContent(
  133:   tx: ScopedTx,
  134:   ctx: TenantContext,
  135:   args: ApproveContentArgs,
  136: ): Promise<ApproveContentResult> {
  137:   assertReviewerEligibility(ctx, args.role);
  138:   await acquireRecordLock(tx, args.recordId);
  139: 
  140:   // entry + record FOR UPDATE
  141:   const entryRows = await tx<{ id: string; status: string; assigned_to: string | null }[]>`
  142:     SELECT id, status::text AS status, assigned_to
  143:       FROM review_queue_entry
  144:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
  145:        AND status IN ('open', 'in-progress')
  146:      FOR UPDATE
  147:   `;
  148:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  149:   const entry = entryRows[0]!;
  150: 
  151:   const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
  152:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
  153:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
  154:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
  155:            auto_check_result
  156:       FROM compliance_record
  157:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  158:      FOR UPDATE
  159:   `;
  160:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  161:   const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };
  162: 
  163:   // 중복 approve idempotent
  164:   if (isRoleSatisfied(record, args.role)) {
  165:     return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
  166:   }
  167: 
  168:   // 슬롯 채움 + entity 전이
  169:   const now = new Date();
  170:   if (args.role === "operator") {
  171:     await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  172:     record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  173:   } else if (args.role === "medical") {
  174:     await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  175:     record.physician_approver = ctx.userId; record.physician_approved_at = now;
  176:   } else if (args.role === "legal") {
  177:     await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  178:     record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  179:   }
  180: 
  181:   // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  182:   if (entry.status === "open") {
  183:     await tx`
  184:       UPDATE review_queue_entry
  185:          SET status = 'in-progress'::review_queue_status,
  186:              assigned_to = ${ctx.userId}::uuid,
  187:              assigned_at = ${now.toISOString()}::timestamptz,
  188:              updated_at = now()
  189:        WHERE id = ${entry.id}::uuid
  190:     `;
  191:   }
  192: 
  193:   // entity status 전이 review-queued → in-review (첫 approve)
  194:   await tx.unsafe(`
  195:     UPDATE ${args.contentTable}
  196:        SET status = CASE
  197:          WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
  198:          ELSE status
  199:        END,
  200:        updated_at = now()
  201:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  202:   `);
  203: 
  204:   // AND 게이트 평가
  205:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  206:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  207:   const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
  208: 
  209:   let entryStatus: "in-progress" | "resolved" = "in-progress";
  210:   if (allApproved) {
  211:     // entity in-review → approved → publishable (publishable evaluator pass 시)
  212:     const publishable = evaluatePublishable(record, record.content_type as ContentType);
  213:     const targetStatus = publishable.publishable ? "publishable" : "approved";
  214:     await tx.unsafe(`
  215:       UPDATE ${args.contentTable}
  216:          SET status = '${targetStatus}'::content_publication_status,
  217:              updated_at = now()
  218:        WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  219:     `);
  220:     // entry resolved
  221:     await tx`
  222:       UPDATE review_queue_entry
  223:          SET status = 'resolved'::review_queue_status,
  224:              resolved_at = ${now.toISOString()}::timestamptz,
  225:              resolved_by = ${ctx.userId}::uuid,
  226:              resolution_type = 'approved',
  227:              updated_at = now()
  228:        WHERE id = ${entry.id}::uuid
  229:     `;
  230:     entryStatus = "resolved";
  231:   }
  232: 
  233:   return { allApproved, entryStatus };
  234: }
  235: 
  236: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
  237:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  238:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  239:   return finalRoles.every((r) => isRoleSatisfied(record, r));
  240: }
  241: 
  242: export type RejectContentArgs = {
  243:   recordId: string;
  244:   reason: string;
  245:   role: ApproverRole;
  246:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  247:   contentRef: string;
  248: };
  249: 
  250: /**
  251:  * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
  252:  */
  253: export async function rejectContent(
  254:   tx: ScopedTx,
  255:   ctx: TenantContext,
  256:   args: RejectContentArgs,
  257: ): Promise<void> {
  258:   assertReviewerEligibility(ctx, args.role);
  259:   if (args.reason.trim().length < 50) {
  260:     throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
  261:   }
  262:   await acquireRecordLock(tx, args.recordId);
  263: 
  264:   const entryRows = await tx<{ id: string }[]>`
  265:     SELECT id FROM review_queue_entry
  266:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
  267:        AND status IN ('open', 'in-progress')
  268:      FOR UPDATE
  269:   `;
  270:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  271: 
  272:   const now = new Date();
  273:   await tx`
  274:     UPDATE review_queue_entry
  275:        SET status = 'resolved'::review_queue_status,
  276:            resolved_at = ${now.toISOString()}::timestamptz,
  277:            resolved_by = ${ctx.userId}::uuid,
  278:            resolution_type = 'rejected',
  279:            metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
  280:            updated_at = now()
  281:      WHERE id = ${entryRows[0]!.id}::uuid
  282:   `;
  283:   await tx.unsafe(`
  284:     UPDATE ${args.contentTable}
  285:        SET status = 'rejected'::content_publication_status,
  286:            updated_at = now()
  287:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  288:   `);
  289: }
  290: 
  291: export type PublishContentArgs = {
  292:   contentType: SubmitContentType;
  293:   contentRef: string;
  294:   recordId: string;
  295:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  296: };
  297: 
  298: /**
  299:  * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
  300:  *   entity.status → published + published_at 채움.
  301:  *   publishable evaluator 통과 검증.
  302:  */
  303: export async function publishContent(
  304:   tx: ScopedTx,
  305:   ctx: TenantContext,
  306:   args: PublishContentArgs,
  307: ): Promise<void> {
  308:   assertReviewerEligibility(ctx, "operator");
  309:   await acquireRecordLock(tx, args.recordId);
  310: 
  311:   // record FOR UPDATE
  312:   const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string; record_phase: string }[]>`
  313:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
  314:            record_phase::text AS record_phase,
  315:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
  316:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
  317:            auto_check_result
  318:       FROM compliance_record
  319:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  320:      FOR UPDATE
  321:   `;
  322:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  323:   const record = recordRows[0]! as ComplianceRecordRow & { id: string; record_phase: string; content_type: string };
  324:   if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
  325: 
  326:   const publishable = evaluatePublishable(record, args.contentType);
  327:   if (!publishable.publishable) {
  328:     throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  329:   }
  330: 
  331:   const now = new Date();
  332:   // (1) compliance_record record_phase 전환 (record ID 보존)
  333:   await tx`
  334:     UPDATE compliance_record
  335:        SET record_phase = 'published'::compliance_record_phase,
  336:            published_at = ${now.toISOString()}::timestamptz,
  337:            published_by = ${ctx.userId}::uuid,
  338:            updated_at = now()
  339:      WHERE id = ${args.recordId}::uuid
  340:   `;
  341:   // (2) entity status → published + published_at + compliance_record_id 채움
  342:   await tx.unsafe(`
  343:     UPDATE ${args.contentTable}
  344:        SET status = 'published'::content_publication_status,
  345:            published_at = '${now.toISOString()}'::timestamptz,
  346:            compliance_record_id = '${args.recordId}',
  347:            updated_at = now()
  348:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  349:   `);
  350: }
### apps\web\src\lib\compliance\transitions.ts
    1: // @glitzy/web/lib/compliance/transitions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 (CA-ACTION-06)
    2: // REVIEW_WORKFLOW § 2.3 status 전이 table SoT.
    3: 
    4: import { ComplianceTransitionError } from "./types";
    5: 
    6: export type ContentWorkflowState =
    7:   | "draft" | "review-queued" | "in-review" | "approved" | "publishable"
    8:   | "published" | "blocked" | "rejected" | "stale";
    9: 
   10: const TRANSITIONS: Record<ContentWorkflowState, ContentWorkflowState[]> = {
   11:   "draft": ["review-queued"],
   12:   "review-queued": ["in-review", "draft"],
   13:   "in-review": ["approved", "rejected", "in-review"],  // 후자는 다음 검수자
   14:   "approved": ["publishable"],
   15:   "publishable": ["published"],
   16:   "rejected": ["draft", "review-queued"],
   17:   "blocked": ["draft"],
   18:   "published": ["stale", "blocked"],
   19:   "stale": ["review-queued"],
   20: };
   21: 
   22: export function assertTransitionAllowed(from: ContentWorkflowState, to: ContentWorkflowState): void {
   23:   const allowed = TRANSITIONS[from] ?? [];
   24:   if (!allowed.includes(to)) {
   25:     throw new ComplianceTransitionError(
   26:       `Invalid status transition: ${from} → ${to}. Allowed: ${allowed.join(", ") || "(none)"}`,
   27:     );
   28:   }
   29: }
   30: 
   31: export function listAllowedTransitions(from: ContentWorkflowState): ContentWorkflowState[] {
   32:   return [...(TRANSITIONS[from] ?? [])];
   33: }
### apps\web\src\lib\compliance\types.ts
    1: // @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
    2: // SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result
    3: 
    4: export type RiskLevel = "Low" | "Medium" | "High";
    5: 
    6: export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
    7: 
    8: // 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
    9: export const ALLOWED_SUBMIT_TYPES = [
   10:   "Article", "TreatmentPage", "LegalDocument",
   11:   "FAQ", "Publication", "MediaAppearance",
   12: ] as const;
   13: export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];
   14: 
   15: export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";
   16: 
   17: // CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
   18: export type ComplianceCheckInput = {
   19:   contentType: ContentType;
   20:   contentRef: string;
   21:   body: string;  // Markdown
   22:   metadata: {
   23:     pageTypeId?: string;
   24:     articleType?: string;
   25:     explicitRiskLevel?: RiskLevel;
   26:     inferredRiskLevel?: RiskLevel;
   27:   };
   28:   riskRules?: unknown[];  // M0 stub — 미사용
   29: };
   30: 
   31: // CONTENT_STANDARDS § 7.2 Finding shape
   32: export type Finding = {
   33:   ruleId: string;
   34:   category: string;
   35:   pattern: string;
   36:   severity: "info" | "warning" | "fail" | "content-gate";
   37:   location: { start: number; end: number };
   38:   suggestion?: string;
   39:   requiredApproverRoles?: ApproverRole[];
   40:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
   41:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
   42: };
   43: 
   44: // CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
   45: export type ComplianceCheckResult = {
   46:   automatedDecision: "block" | "gate" | "warn" | "pass";
   47:   buildBlocked: boolean;
   48:   gateRequired: boolean;
   49:   hasWarnings: boolean;
   50:   findingsBySeverity: {
   51:     fail: number;
   52:     "content-gate": number;
   53:     warning: number;
   54:     info: number;
   55:   };
   56:   requiredApproverRoles?: ApproverRole[];
   57:   findings: Finding[];
   58: };
   59: 
   60: // M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
   61: export type ComplianceCheckEnvelope = {
   62:   result: ComplianceCheckResult;
   63:   meta: {
   64:     pageRiskLevel: RiskLevel;
   65:     catalogVersion: string;
   66:     catalogHash: string;
   67:     manualReview: boolean;
   68:     exemptReason?: string;
   69:   };
   70: };
   71: 
   72: // 에러 type — fail closed
   73: export class ComplianceConfigError extends Error {
   74:   override readonly name = "ComplianceConfigError";
   75: }
   76: export class ComplianceTransitionError extends Error {
   77:   override readonly name = "ComplianceTransitionError";
   78: }
   79: export class ReviewerEligibilityError extends Error {
   80:   override readonly name = "ReviewerEligibilityError";
   81: }

codex
서버 액션 출력이 중간에서 잘려 핵심 일부를 다시 좁혀서 보겠습니다. 현재까지 보이는 위험 신호는 C0016의 일부 엔티티 컬럼 추가 누락 가능성, `unsafe` SQL 조립, 승인/발행 전이의 상태 검증 약화입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/lib/compliance/server-actions.ts'; "'$i=1; Get-Content $f | ForEach-Object { if($i -le 380){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'apps/web/src/lib/compliance/final-roles.ts','apps/web/src/lib/compliance/publishable-check.ts','apps/web/src/lib/compliance/risk.ts'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compliance_record_id|faq = pgTable|publication = pgTable|mediaAppearance|article = pgTable|treatmentPage = pgTable" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE (article|treatment_page|faq|publication|media_appearance)|compliance_record_id|status .*published|risk_level|published_at" packages/core-content/migrations/C0004_treatment_page.sql packages/core-content/migrations/C0005_article.sql packages/core-content/migrations/C0010_publication.sql packages/core-content/migrations/C0011_media_appearance.sql packages/core-content/migrations/C0012_faq.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 728ms:
5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
185:export const treatmentPage = pgTable(
196:    complianceRecordId: uuid("compliance_record_id"),
220:export const article = pgTable(
231:    complianceRecordId: uuid("compliance_record_id"),
290:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
291:    complianceRecordId: uuid("compliance_record_id"),
305:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
372:export const publication = pgTable(
391:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
392:    complianceRecordId: uuid("compliance_record_id"),
433:export const mediaAppearance = pgTable(
451:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
452:    complianceRecordId: uuid("compliance_record_id"),
491:export const faq = pgTable(
506:    complianceRecordId: uuid("compliance_record_id"),
517:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
606:    complianceRecordId: uuid("compliance_record_id").notNull(),

 succeeded in 728ms:
packages/core-content/migrations/C0012_faq.sql:2:-- EC-SCHEMA-13·14·15: 풀명세 합류. v0.1 단계 status='draft' + published_at IS NULL CHECK 강제.
packages/core-content/migrations/C0012_faq.sql:3:-- compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05·12) 까지 published 자체 차단.
packages/core-content/migrations/C0012_faq.sql:5:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 treatment_page · C0009 article_category · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0012_faq.sql:7:CREATE TABLE faq (
packages/core-content/migrations/C0012_faq.sql:19:  risk_level risk_level NOT NULL DEFAULT 'Low',
packages/core-content/migrations/C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
packages/core-content/migrations/C0012_faq.sql:21:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0012_faq.sql:30:  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),
packages/core-content/migrations/C0012_faq.sql:44:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
packages/core-content/migrations/C0012_faq.sql:45:  WHERE status = 'published' AND published_at IS NOT NULL;
packages/core-content/migrations/C0010_publication.sql:2:-- EC-SCHEMA-08·09·10: 외부 학술 인용 entity · authors[] min 1 NOT NULL (DEFAULT 제거) · risk_level Low fixed CHECK.
packages/core-content/migrations/C0010_publication.sql:4:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0010_publication.sql:6:CREATE TABLE publication (
packages/core-content/migrations/C0010_publication.sql:21:  risk_level risk_level NOT NULL DEFAULT 'Low',
packages/core-content/migrations/C0010_publication.sql:22:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0010_publication.sql:42:  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0010_publication.sql:44:    status <> 'published' OR published_at IS NOT NULL
packages/core-content/migrations/C0010_publication.sql:54:CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
packages/core-content/migrations/C0010_publication.sql:55:  WHERE status = 'published' AND published_at IS NOT NULL;
packages/core-content/migrations/C0011_media_appearance.sql:4:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0011_media_appearance.sql:8:CREATE TABLE media_appearance (
packages/core-content/migrations/C0011_media_appearance.sql:22:  risk_level risk_level NOT NULL DEFAULT 'Low',
packages/core-content/migrations/C0011_media_appearance.sql:23:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0011_media_appearance.sql:38:  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0011_media_appearance.sql:40:    status <> 'published' OR published_at IS NOT NULL
packages/core-content/migrations/C0011_media_appearance.sql:50:CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
packages/core-content/migrations/C0011_media_appearance.sql:51:  WHERE status = 'published' AND published_at IS NOT NULL;
packages/core-content/migrations/C0005_article.sql:5:CREATE TABLE article (
packages/core-content/migrations/C0005_article.sql:13:  risk_level risk_level,
packages/core-content/migrations/C0005_article.sql:14:  compliance_record_id UUID,
packages/core-content/migrations/C0005_article.sql:18:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0005_article.sql:25:  CONSTRAINT article_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
packages/core-content/migrations/C0005_article.sql:35:CREATE INDEX article_published_idx ON article (instance_id, published_at)
packages/core-content/migrations/C0005_article.sql:36:  WHERE status = 'published' AND published_at IS NOT NULL;
packages/core-content/migrations/C0004_treatment_page.sql:3:-- M0-03 cycle2: risk_level enum 3종·대문자 (RISK_LEVELS SoT)
packages/core-content/migrations/C0004_treatment_page.sql:11:CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');
packages/core-content/migrations/C0004_treatment_page.sql:13:CREATE TABLE treatment_page (
packages/core-content/migrations/C0004_treatment_page.sql:21:  risk_level risk_level,
packages/core-content/migrations/C0004_treatment_page.sql:22:  compliance_record_id UUID,
packages/core-content/migrations/C0004_treatment_page.sql:25:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0004_treatment_page.sql:31:  CONSTRAINT treatment_page_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
packages/core-content/migrations/C0004_treatment_page.sql:38:CREATE INDEX treatment_page_published_idx ON treatment_page (instance_id, published_at)
packages/core-content/migrations/C0004_treatment_page.sql:39:  WHERE status = 'published' AND published_at IS NOT NULL;

 succeeded in 780ms:
### apps/web/src/lib/compliance/final-roles.ts
    1: // @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
    2: // REVIEW_WORKFLOW § 4.1 SoT.
    3: 
    4: import type { ApproverRole, ContentType, RiskLevel } from "./types";
    5: import { ComplianceConfigError } from "./types";
    6: 
    7: const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);
    8: 
    9: /**
   10:  * unknown role fail closed (CAM-16 + CAM2-04 정정):
   11:  *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
   12:  *   server action 안 try/catch 로 form-level error 변환.
   13:  */
   14: export function calculateFinalRoles(
   15:   contentType: ContentType,
   16:   pageRiskLevel: RiskLevel,
   17:   priorReviewRequired: boolean = false,
   18:   requiredApproverRoles: readonly string[] = [],
   19: ): ApproverRole[] {
   20:   for (const r of requiredApproverRoles) {
   21:     if (r === "client") {
   22:       throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
   23:     }
   24:     if (!KNOWN_ROLES.has(r)) {
   25:       throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
   26:     }
   27:   }
   28:   const roles = new Set<ApproverRole>(["operator"]);
   29:   if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
   30:   if (contentType === "LegalDocument") roles.add("legal");
   31:   if (priorReviewRequired) roles.add("legal");
   32:   for (const r of requiredApproverRoles) {
   33:     roles.add(r as ApproverRole);
   34:   }
   35:   return Array.from(roles).sort();
   36: }
   37: 
   38: export type ComplianceRecordRow = {
   39:   peer_reviewer: string | null;
   40:   peer_reviewed_at: Date | null;
   41:   physician_approver: string | null;
   42:   physician_approved_at: Date | null;
   43:   legal_counsel: string | null;
   44:   legal_counsel_at: Date | null;
   45:   page_risk_level: RiskLevel;
   46:   prior_review_required: boolean;
   47:   prior_review_passed: boolean | null;
   48:   auto_check_result: unknown;
   49: };
   50: 
   51: export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
   52:   if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
   53:   if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
   54:   if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
   55:   return false;
   56: }
### apps/web/src/lib/compliance/publishable-check.ts
    1: // @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
    2: // REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.
    3: 
    4: import type { ApproverRole, ContentType } from "./types";
    5: import { ComplianceConfigError } from "./types";
    6: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
    7: 
    8: export type PublishableResult =
    9:   | { publishable: true; finalRoles: ApproverRole[] }
   10:   | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
   11:   | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };
   12: 
   13: export function evaluatePublishable(
   14:   record: ComplianceRecordRow,
   15:   contentType: ContentType,
   16: ): PublishableResult {
   17:   const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
   18:   const required = autoCheck?.requiredApproverRoles ?? [];
   19: 
   20:   let finalRoles: ApproverRole[];
   21:   try {
   22:     finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
   23:   } catch (err) {
   24:     if (err instanceof ComplianceConfigError) {
   25:       return { publishable: false, reasons: [err.message], configError: err.message };
   26:     }
   27:     throw err;
   28:   }
   29: 
   30:   const reasons: string[] = [];
   31:   const missingRoles: ApproverRole[] = [];
   32: 
   33:   // (1) automatedDecision !== "block"
   34:   if (autoCheck?.automatedDecision === "block") {
   35:     reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
   36:   }
   37:   // (2) finalRoles 슬롯 모두 기록
   38:   for (const role of finalRoles) {
   39:     if (!isRoleSatisfied(record, role)) {
   40:       missingRoles.push(role);
   41:       reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
   42:     }
   43:   }
   44:   // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
   45:   if (record.prior_review_required && record.prior_review_passed !== true) {
   46:     reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
   47:   }
   48:   // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
   49:   // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
   50:   // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)
   51: 
   52:   if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
   53:   return { publishable: true, finalRoles };
   54: }
### apps/web/src/lib/compliance/risk.ts
    1: // @glitzy/web/lib/compliance/risk — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.2 CA-GATE-02 (CAM-04)
    2: // RiskLevel MAX 결합 helper. 격하 금지.
    3: 
    4: import type { RiskLevel } from "./types";
    5: 
    6: const ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };
    7: 
    8: export function maxRisk(...levels: RiskLevel[]): RiskLevel {
    9:   let max: RiskLevel = "Low";
   10:   for (const l of levels) {
   11:     if (ORDER[l] > ORDER[max]) max = l;
   12:   }
   13:   return max;
   14: }

 succeeded in 784ms:
    1: // @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
    2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
    3: // 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.
    4: 
    5: import type { ScopedTx } from "@glitzy/db";
    6: import type { TenantContext } from "@glitzy/auth";
    7: 
    8: import type {
    9:   ApproverRole,
   10:   ComplianceCheckEnvelope,
   11:   ContentType,
   12:   SubmitContentType,
   13: } from "./types";
   14: import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
   15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
   16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
   17: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
   18: import { evaluatePublishable } from "./publishable-check";
   19: import { assertReviewerEligibility } from "./eligibility";
   20: 
   21: const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };
   22: 
   23: /**
   24:  * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
   25:  *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
   26:  */
   27: async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
   28:   await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
   29: }
   30: 
   31: function isAllowedSubmitType(t: string): t is SubmitContentType {
   32:   return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
   33: }
   34: 
   35: export type SubmitForReviewArgs = {
   36:   contentType: SubmitContentType;
   37:   contentRef: string;
   38:   contentRow: { status: string; risk_level?: string | null; body?: string };
   39: };
   40: 
   41: export type SubmitForReviewResult = { recordId: string; entryId: string };
   42: 
   43: /**
   44:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
   45:  */
   46: export async function submitForReview(
   47:   tx: ScopedTx,
   48:   ctx: TenantContext,
   49:   args: SubmitForReviewArgs,
   50: ): Promise<SubmitForReviewResult> {
   51:   if (!isAllowedSubmitType(args.contentType)) {
   52:     throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
   53:   }
   54:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
   55: 
   56:   const checkInput = {
   57:     contentType: args.contentType,
   58:     contentRef: args.contentRef,
   59:     body: args.contentRow.body ?? "",
   60:     metadata: {
   61:       explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
   62:     },
   63:   };
   64:   const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
   65:     ? buildLegalDocumentExemptEnvelope(checkInput)
   66:     : await check(checkInput);
   67: 
   68:   const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
   69:   const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
   70: 
   71:   // ComplianceRecord INSERT (pre-publish)
   72:   const slaHours = SLA_DUE_HOURS.P0;
   73:   const recordRows = await tx<{ id: string }[]>`
   74:     INSERT INTO compliance_record (
   75:       instance_id, content_type, content_ref, page_risk_level, auto_check_result,
   76:       record_phase, record_version, metadata
   77:     ) VALUES (
   78:       ${ctx.instanceId}::uuid,
   79:       ${args.contentType}::compliance_content_type,
   80:       ${args.contentRef},
   81:       ${envelope.meta.pageRiskLevel}::risk_level,
   82:       ${JSON.stringify(envelope.result)}::jsonb,
   83:       'pre-publish'::compliance_record_phase,
   84:       1,
   85:       ${JSON.stringify({
   86:         manualReview: envelope.meta.manualReview,
   87:         catalogVersion: envelope.meta.catalogVersion,
   88:         catalogHash: envelope.meta.catalogHash,
   89:         ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
   90:       })}::jsonb
   91:     )
   92:     RETURNING id
   93:   `;
   94:   const recordId = recordRows[0]!.id;
   95: 
   96:   // ReviewQueueEntry INSERT (open)
   97:   const entryRows = await tx<{ id: string }[]>`
   98:     INSERT INTO review_queue_entry (
   99:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
  100:       status, priority, required_roles, sla_due_at
  101:     ) VALUES (
  102:       ${ctx.instanceId}::uuid,
  103:       'manual-review'::review_queue_type,
  104:       ${args.contentType}::compliance_content_type,
  105:       ${args.contentRef},
  106:       ${recordId}::uuid,
  107:       'open'::review_queue_status,
  108:       'P0'::review_queue_priority,
  109:       ${finalRoles}::approver_role[],
  110:       ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
  111:     )
  112:     RETURNING id
  113:   `;
  114:   const entryId = entryRows[0]!.id;
  115: 
  116:   return { recordId, entryId };
  117: }
  118: 
  119: export type ApproveContentArgs = {
  120:   recordId: string;
  121:   role: ApproverRole;
  122:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  123:   contentRef: string;
  124: };
  125: 
  126: export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
  127: 
  128: /**
  129:  * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
  130:  * AND 게이트 충족 시 in-review → approved 자동 전이.
  131:  */
  132: export async function approveContent(
  133:   tx: ScopedTx,
  134:   ctx: TenantContext,
  135:   args: ApproveContentArgs,
  136: ): Promise<ApproveContentResult> {
  137:   assertReviewerEligibility(ctx, args.role);
  138:   await acquireRecordLock(tx, args.recordId);
  139: 
  140:   // entry + record FOR UPDATE
  141:   const entryRows = await tx<{ id: string; status: string; assigned_to: string | null }[]>`
  142:     SELECT id, status::text AS status, assigned_to
  143:       FROM review_queue_entry
  144:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
  145:        AND status IN ('open', 'in-progress')
  146:      FOR UPDATE
  147:   `;
  148:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  149:   const entry = entryRows[0]!;
  150: 
  151:   const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
  152:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
  153:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
  154:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
  155:            auto_check_result
  156:       FROM compliance_record
  157:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  158:      FOR UPDATE
  159:   `;
  160:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  161:   const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };
  162: 
  163:   // 중복 approve idempotent
  164:   if (isRoleSatisfied(record, args.role)) {
  165:     return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
  166:   }
  167: 
  168:   // 슬롯 채움 + entity 전이
  169:   const now = new Date();
  170:   if (args.role === "operator") {
  171:     await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  172:     record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  173:   } else if (args.role === "medical") {
  174:     await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  175:     record.physician_approver = ctx.userId; record.physician_approved_at = now;
  176:   } else if (args.role === "legal") {
  177:     await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
  178:     record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  179:   }
  180: 
  181:   // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  182:   if (entry.status === "open") {
  183:     await tx`
  184:       UPDATE review_queue_entry
  185:          SET status = 'in-progress'::review_queue_status,
  186:              assigned_to = ${ctx.userId}::uuid,
  187:              assigned_at = ${now.toISOString()}::timestamptz,
  188:              updated_at = now()
  189:        WHERE id = ${entry.id}::uuid
  190:     `;
  191:   }
  192: 
  193:   // entity status 전이 review-queued → in-review (첫 approve)
  194:   await tx.unsafe(`
  195:     UPDATE ${args.contentTable}
  196:        SET status = CASE
  197:          WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
  198:          ELSE status
  199:        END,
  200:        updated_at = now()
  201:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  202:   `);
  203: 
  204:   // AND 게이트 평가
  205:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  206:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  207:   const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
  208: 
  209:   let entryStatus: "in-progress" | "resolved" = "in-progress";
  210:   if (allApproved) {
  211:     // entity in-review → approved → publishable (publishable evaluator pass 시)
  212:     const publishable = evaluatePublishable(record, record.content_type as ContentType);
  213:     const targetStatus = publishable.publishable ? "publishable" : "approved";
  214:     await tx.unsafe(`
  215:       UPDATE ${args.contentTable}
  216:          SET status = '${targetStatus}'::content_publication_status,
  217:              updated_at = now()
  218:        WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  219:     `);
  220:     // entry resolved
  221:     await tx`
  222:       UPDATE review_queue_entry
  223:          SET status = 'resolved'::review_queue_status,
  224:              resolved_at = ${now.toISOString()}::timestamptz,
  225:              resolved_by = ${ctx.userId}::uuid,
  226:              resolution_type = 'approved',
  227:              updated_at = now()
  228:        WHERE id = ${entry.id}::uuid
  229:     `;
  230:     entryStatus = "resolved";
  231:   }
  232: 
  233:   return { allApproved, entryStatus };
  234: }
  235: 
  236: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
  237:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  238:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  239:   return finalRoles.every((r) => isRoleSatisfied(record, r));
  240: }
  241: 
  242: export type RejectContentArgs = {
  243:   recordId: string;
  244:   reason: string;
  245:   role: ApproverRole;
  246:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  247:   contentRef: string;
  248: };
  249: 
  250: /**
  251:  * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
  252:  */
  253: export async function rejectContent(
  254:   tx: ScopedTx,
  255:   ctx: TenantContext,
  256:   args: RejectContentArgs,
  257: ): Promise<void> {
  258:   assertReviewerEligibility(ctx, args.role);
  259:   if (args.reason.trim().length < 50) {
  260:     throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
  261:   }
  262:   await acquireRecordLock(tx, args.recordId);
  263: 
  264:   const entryRows = await tx<{ id: string }[]>`
  265:     SELECT id FROM review_queue_entry
  266:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
  267:        AND status IN ('open', 'in-progress')
  268:      FOR UPDATE
  269:   `;
  270:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  271: 
  272:   const now = new Date();
  273:   await tx`
  274:     UPDATE review_queue_entry
  275:        SET status = 'resolved'::review_queue_status,
  276:            resolved_at = ${now.toISOString()}::timestamptz,
  277:            resolved_by = ${ctx.userId}::uuid,
  278:            resolution_type = 'rejected',
  279:            metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
  280:            updated_at = now()
  281:      WHERE id = ${entryRows[0]!.id}::uuid
  282:   `;
  283:   await tx.unsafe(`
  284:     UPDATE ${args.contentTable}
  285:        SET status = 'rejected'::content_publication_status,
  286:            updated_at = now()
  287:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  288:   `);
  289: }
  290: 
  291: export type PublishContentArgs = {
  292:   contentType: SubmitContentType;
  293:   contentRef: string;
  294:   recordId: string;
  295:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  296: };
  297: 
  298: /**
  299:  * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
  300:  *   entity.status → published + published_at 채움.
  301:  *   publishable evaluator 통과 검증.
  302:  */
  303: export async function publishContent(
  304:   tx: ScopedTx,
  305:   ctx: TenantContext,
  306:   args: PublishContentArgs,
  307: ): Promise<void> {
  308:   assertReviewerEligibility(ctx, "operator");
  309:   await acquireRecordLock(tx, args.recordId);
  310: 
  311:   // record FOR UPDATE
  312:   const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string; record_phase: string }[]>`
  313:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
  314:            record_phase::text AS record_phase,
  315:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
  316:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
  317:            auto_check_result
  318:       FROM compliance_record
  319:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  320:      FOR UPDATE
  321:   `;
  322:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  323:   const record = recordRows[0]! as ComplianceRecordRow & { id: string; record_phase: string; content_type: string };
  324:   if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
  325: 
  326:   const publishable = evaluatePublishable(record, args.contentType);
  327:   if (!publishable.publishable) {
  328:     throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  329:   }
  330: 
  331:   const now = new Date();
  332:   // (1) compliance_record record_phase 전환 (record ID 보존)
  333:   await tx`
  334:     UPDATE compliance_record
  335:        SET record_phase = 'published'::compliance_record_phase,
  336:            published_at = ${now.toISOString()}::timestamptz,
  337:            published_by = ${ctx.userId}::uuid,
  338:            updated_at = now()
  339:      WHERE id = ${args.recordId}::uuid
  340:   `;
  341:   // (2) entity status → published + published_at + compliance_record_id 채움
  342:   await tx.unsafe(`
  343:     UPDATE ${args.contentTable}
  344:        SET status = 'published'::content_publication_status,
  345:            published_at = '${now.toISOString()}'::timestamptz,
  346:            compliance_record_id = '${args.recordId}',
  347:            updated_at = now()
  348:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  349:   `);
  350: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/lib/compliance/entity-actions.ts'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 80 -and $i -le 240){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'packages/core-content/src/schema.ts'; "'$i=1; Get-Content $f | ForEach-Object { if(($i -ge 360 -and $i -le 525) -or ($i -ge 540 -and $i -le 620)){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"eventType: \\\"content-(submitted-for-review|approved|rejected|published)\\\"|payload:\" apps/web/src/lib/compliance apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 776ms:
   80:     if (result.ok === false && result.action === "notfound") notFound();
   81:     if (result.ok === true) {
   82:       try {
   83:         await emitAuditEvent(sqlBase, {
   84:           eventType: "content-submitted-for-review",
   85:           actorUserId: result.ctx.userId,
   86:           targetUserId: result.ctx.userId,
   87:           toInstanceId: result.ctx.instanceId,
   88:           payload: { contentType, contentRef, recordId: result.out.recordId, entryId: result.out.entryId },
   89:         });
   90:       } catch (err) {
   91:         console.error("[submitForReviewAction] audit emit failed", err);
   92:       }
   93:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
   94:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
   95:       revalidatePath(`/admin/${instanceSlug}`);
   96:       return { ok: true, slug: contentRef };
   97:     }
   98:     return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
   99:   } catch (err) {
  100:     if (isNextControlFlowError(err)) throw err;
  101:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
  102:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  103:       return { ok: false, fieldErrors: {}, formError: err.message };
  104:     }
  105:     if (err instanceof TenantResolveError) {
  106:       const action = mapAuthDenyReasonToUi(err.reason);
  107:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  108:       if (action.kind === "not-found") notFound();
  109:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  110:     }
  111:     console.error("[submitForReviewAction] unexpected", err);
  112:     return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
  113:   }
  114: }
  115: 
  116: export async function publishContentAction(
  117:   instanceSlug: string,
  118:   contentType: SubmitContentType,
  119:   contentRef: string,
  120:   _prev: SaveResult | null,
  121:   _formData: FormData,
  122: ): Promise<SaveResult> {
  123:   const aCtx = await resolveActionContext(instanceSlug);
  124:   const sqlBase = getSqlBase();
  125:   try {
  126:     const result = await withSkeletonTx(
  127:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  128:       async (tx, ctx) => {
  129:         const table = ENTITY_TABLES[contentType];
  130:         // 현재 entity row FOR UPDATE + compliance_record_id 추출
  131:         const rows = await tx.unsafe<{ compliance_record_id: string | null; status: string }[]>(`
  132:           SELECT compliance_record_id, status::text AS status FROM ${table}
  133:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  134:            FOR UPDATE
  135:         `);
  136:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  137:         const row = rows[0]!;
  138:         if (row.status !== "publishable") {
  139:           return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
  140:         }
  141:         if (!row.compliance_record_id) {
  142:           return { ok: false as const, action: "no-record" as const };
  143:         }
  144:         // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기
  145:         const recRows = await tx<{ id: string }[]>`
  146:           SELECT id FROM compliance_record
  147:            WHERE instance_id = ${ctx.instanceId}::uuid
  148:              AND content_type = ${contentType}::compliance_content_type
  149:              AND content_ref = ${contentRef}
  150:              AND record_phase = 'pre-publish'::compliance_record_phase
  151:            ORDER BY record_version DESC
  152:            LIMIT 1
  153:         `;
  154:         if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
  155:         await publishContent(tx, ctx, {
  156:           contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
  157:         });
  158:         return { ok: true as const, ctx, recordId: recRows[0]!.id };
  159:       },
  160:     );
  161: 
  162:     if (result.ok === false && result.action === "notfound") notFound();
  163:     if (result.ok === false && result.action === "no-record") {
  164:       return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
  165:     }
  166:     if (result.ok === false && result.action === "not-publishable") {
  167:       return { ok: false, fieldErrors: {}, formError: result.message };
  168:     }
  169:     if (result.ok === true) {
  170:       try {
  171:         await emitAuditEvent(sqlBase, {
  172:           eventType: "content-published",
  173:           actorUserId: result.ctx.userId,
  174:           targetUserId: result.ctx.userId,
  175:           toInstanceId: result.ctx.instanceId,
  176:           payload: { contentType, contentRef, recordId: result.recordId },
  177:         });
  178:       } catch (err) {
  179:         console.error("[publishContentAction] audit emit failed", err);
  180:       }
  181:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
  182:       revalidatePath(`/admin/${instanceSlug}`);
  183:       return { ok: true, slug: contentRef };
  184:     }
  185:     return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  186:   } catch (err) {
  187:     if (isNextControlFlowError(err)) throw err;
  188:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
  189:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
  190:       return { ok: false, fieldErrors: {}, formError: err.message };
  191:     }
  192:     if (err instanceof TenantResolveError) {
  193:       const action = mapAuthDenyReasonToUi(err.reason);
  194:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  195:       if (action.kind === "not-found") notFound();
  196:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  197:     }
  198:     console.error("[publishContentAction] unexpected", err);
  199:     return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
  200:   }
  201: }

 succeeded in 775ms:
  360:     //   parent_category_id 가 nullable 이므로 Drizzle 도 표현 가능.
  361:     parentFk: foreignKey({
  362:       columns: [t.instanceId, t.parentCategoryId],
  363:       foreignColumns: [t.instanceId, t.id],
  364:       name: "article_category_parent_fk",
  365:     }),
  366:   }),
  367: );
  368: 
  369: // === Publication (C-24·EC-SCHEMA-08) ===
  370: //   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
  371: //   DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
  372: export const publication = pgTable(
  373:   "publication",
  374:   {
  375:     id: uuid("id").primaryKey().defaultRandom(),
  376:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  377:     slug: text("slug").notNull(),
  378:     title: text("title").notNull(),
  379:     authors: jsonb("authors").notNull(),
  380:     journal: text("journal"),
  381:     publishedDate: date("published_date").notNull(),
  382:     doi: text("doi"),
  383:     pubmedId: text("pubmed_id"),
  384:     url: text("url").notNull(),
  385:     thumbnailUrl: text("thumbnail_url"),
  386:     summary: text("summary").notNull(),
  387:     authorDoctorId: uuid("author_doctor_id"),
  388:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  389:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  390:     publishedAt: timestamp("published_at", { withTimezone: true }),
  391:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
  392:     complianceRecordId: uuid("compliance_record_id"),
  393:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  394:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  395:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  396:   },
  397:   (t) => ({
  398:     slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  399:     titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
  400:     summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
  401:     urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
  402:     thumbnailUrlFormat: check("publication_thumbnail_url_format",
  403:       sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
  404:     doiFormat: check("publication_doi_format",
  405:       sql`${t.doi} IS NULL OR ${t.doi} ~ '^10\\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'`),
  406:     pubmedIdFormat: check("publication_pubmed_id_format",
  407:       sql`${t.pubmedId} IS NULL OR ${t.pubmedId} ~ '^[0-9]{1,9}$'`),
  408:     authorsArray: check("publication_authors_array",
  409:       sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
  410:     riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
  411:     publishedRequiresAt: check("publication_published_requires_at",
  412:       sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  413:     instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
  414:     instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
  415:     instanceIdx: index("publication_instance_idx").on(t.instanceId),
  416:     statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
  417:     publishedIdx: index("publication_published_idx")
  418:       .on(t.instanceId, t.publishedAt)
  419:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  420:     authorIdx: index("publication_author_idx")
  421:       .on(t.instanceId, t.authorDoctorId)
  422:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  423:     authorDoctorFk: foreignKey({
  424:       columns: [t.instanceId, t.authorDoctorId],
  425:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  426:       name: "publication_author_doctor_fk",
  427:     }),
  428:   }),
  429: );
  430: 
  431: // === MediaAppearance (C-25·EC-SCHEMA-11) ===
  432: //   미디어 출연. v0.1 단계 JSON-LD `@type` = VideoObject 단일화 (모든 channel_type).
  433: export const mediaAppearance = pgTable(
  434:   "media_appearance",
  435:   {
  436:     id: uuid("id").primaryKey().defaultRandom(),
  437:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  438:     slug: text("slug").notNull(),
  439:     title: text("title").notNull(),
  440:     channelName: text("channel_name").notNull(),
  441:     channelType: mediaChannelTypeEnum("channel_type").notNull(),
  442:     publishedDate: date("published_date").notNull(),
  443:     durationSeconds: integer("duration_seconds"),
  444:     url: text("url").notNull(),
  445:     thumbnailUrl: text("thumbnail_url"),
  446:     summary: text("summary").notNull(),
  447:     authorDoctorId: uuid("author_doctor_id"),
  448:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  449:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  450:     publishedAt: timestamp("published_at", { withTimezone: true }),
  451:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
  452:     complianceRecordId: uuid("compliance_record_id"),
  453:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  454:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  455:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  456:   },
  457:   (t) => ({
  458:     slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  459:     titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
  460:     summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
  461:     channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
  462:     urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
  463:     thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
  464:       sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
  465:     durationPositive: check("media_appearance_duration_positive",
  466:       sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`),
  467:     riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
  468:     publishedRequiresAt: check("media_appearance_published_requires_at",
  469:       sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  470:     instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
  471:     instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
  472:     instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
  473:     statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
  474:     publishedIdx: index("media_appearance_published_idx")
  475:       .on(t.instanceId, t.publishedAt)
  476:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  477:     authorIdx: index("media_appearance_author_idx")
  478:       .on(t.instanceId, t.authorDoctorId)
  479:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  480:     authorDoctorFk: foreignKey({
  481:       columns: [t.instanceId, t.authorDoctorId],
  482:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  483:       name: "media_appearance_author_doctor_fk",
  484:     }),
  485:   }),
  486: );
  487: 
  488: // === FAQ (C-12·EC-SCHEMA-13) ===
  489: //   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
  490: //   LegalDocument LL-SCHEMA-03·04 패턴 정합.
  491: export const faq = pgTable(
  492:   "faq",
  493:   {
  494:     id: uuid("id").primaryKey().defaultRandom(),
  495:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  496:     slug: text("slug").notNull(),
  497:     question: text("question").notNull(),
  498:     answer: text("answer").notNull(),
  499:     displayOrder: integer("display_order").notNull().default(0),
  500:     categoryId: uuid("category_id"),
  501:     relatedTreatmentId: uuid("related_treatment_id"),
  502:     relatedConditionId: uuid("related_condition_id"),
  503:     authorDoctorId: uuid("author_doctor_id"),
  504:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  505:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  506:     complianceRecordId: uuid("compliance_record_id"),
  507:     publishedAt: timestamp("published_at", { withTimezone: true }),
  508:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  509:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  510:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  511:   },
  512:   (t) => ({
  513:     slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  514:     questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
  515:     answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
  516:     // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
  517:     //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
  518:     instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
  519:     instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
  520:     instanceIdx: index("faq_instance_idx").on(t.instanceId),
  521:     statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
  522:     publishedIdx: index("faq_published_idx")
  523:       .on(t.instanceId, t.publishedAt, t.displayOrder)
  524:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  525:     categoryIdx: index("faq_category_idx")
  540:       columns: [t.instanceId, t.relatedTreatmentId],
  541:       foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
  542:       name: "faq_related_treatment_fk",
  543:     }),
  544:     // related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외).
  545:   }),
  546: );
  547: 
  548: // === v0.5 COMPLIANCE_ASSISTANT_M0 — ComplianceRecord (C-10 skeleton) + ReviewQueueEntry (REVIEW_WORKFLOW § 3) ===
  549: 
  550: export const complianceRecord = pgTable(
  551:   "compliance_record",
  552:   {
  553:     id: uuid("id").primaryKey().defaultRandom(),
  554:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  555:     contentType: complianceContentTypeEnum("content_type").notNull(),
  556:     contentRef: text("content_ref").notNull(),
  557:     pageRiskLevel: riskLevelEnum("page_risk_level").notNull(),
  558:     articleType: text("article_type"),
  559:     inlineRiskFlags: jsonb("inline_risk_flags").notNull().default(sql`'[]'::jsonb`),
  560:     autoCheckResult: jsonb("auto_check_result").notNull(),
  561:     peerReviewer: uuid("peer_reviewer"),
  562:     peerReviewedAt: timestamp("peer_reviewed_at", { withTimezone: true }),
  563:     physicianApprover: uuid("physician_approver"),
  564:     physicianApprovedAt: timestamp("physician_approved_at", { withTimezone: true }),
  565:     legalCounsel: uuid("legal_counsel"),
  566:     legalCounselAt: timestamp("legal_counsel_at", { withTimezone: true }),
  567:     clientApprover: uuid("client_approver"),
  568:     clientApprovedAt: timestamp("client_approved_at", { withTimezone: true }),
  569:     priorReviewRequired: boolean("prior_review_required").notNull().default(false),
  570:     priorReviewSubmissionId: text("prior_review_submission_id"),
  571:     priorReviewPassed: boolean("prior_review_passed"),
  572:     publishedAt: timestamp("published_at", { withTimezone: true }),
  573:     publishedBy: uuid("published_by"),
  574:     recordPhase: complianceRecordPhaseEnum("record_phase").notNull().default("pre-publish"),
  575:     recordVersion: integer("record_version").notNull().default(1),
  576:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  577:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  578:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  579:   },
  580:   (t) => ({
  581:     versionPositive: check("compliance_record_version_positive", sql`${t.recordVersion} >= 1`),
  582:     publishedRequiresAt: check("compliance_record_published_requires_at",
  583:       sql`${t.recordPhase} <> 'published' OR (${t.publishedAt} IS NOT NULL AND ${t.publishedBy} IS NOT NULL)`),
  584:     legalDocRequiresLegal: check("compliance_record_legal_doc_requires_legal",
  585:       sql`${t.recordPhase} <> 'published' OR ${t.contentType} <> 'LegalDocument' OR (${t.legalCounsel} IS NOT NULL AND ${t.legalCounselAt} IS NOT NULL)`),
  586:     medHighRequiresPhysician: check("compliance_record_med_high_requires_physician",
  587:       sql`${t.recordPhase} <> 'published' OR ${t.pageRiskLevel} = 'Low' OR (${t.physicianApprover} IS NOT NULL AND ${t.physicianApprovedAt} IS NOT NULL)`),
  588:     publishedRequiresPeer: check("compliance_record_published_requires_peer",
  589:       sql`${t.recordPhase} <> 'published' OR (${t.peerReviewer} IS NOT NULL AND ${t.peerReviewedAt} IS NOT NULL)`),
  590:     uniqueVersion: unique("compliance_record_unique_version").on(t.instanceId, t.contentType, t.contentRef, t.recordVersion),
  591:     instanceIdUnique: unique("compliance_record_instance_id_unique").on(t.instanceId, t.id),
  592:     instanceIdx: index("compliance_record_instance_idx").on(t.instanceId),
  593:     contentRefIdx: index("compliance_record_content_ref_idx").on(t.instanceId, t.contentType, t.contentRef),
  594:     phaseIdx: index("compliance_record_phase_idx").on(t.instanceId, t.recordPhase),
  595:   }),
  596: );
  597: 
  598: export const reviewQueueEntry = pgTable(
  599:   "review_queue_entry",
  600:   {
  601:     id: uuid("id").primaryKey().defaultRandom(),
  602:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  603:     queueType: reviewQueueTypeEnum("queue_type").notNull(),
  604:     contentType: complianceContentTypeEnum("content_type").notNull(),
  605:     contentRef: text("content_ref").notNull(),
  606:     complianceRecordId: uuid("compliance_record_id").notNull(),
  607:     status: reviewQueueStatusEnum("status").notNull().default("open"),
  608:     priority: reviewQueuePriorityEnum("priority").notNull().default("P0"),
  609:     // approver_role[] — drizzle 의 array helper 없으므로 raw text 로 표현. raw SQL C0015 에서 enum array 정의.
  610:     //   Drizzle 으로는 jsonb 대용 표현 — drizzle-orm 안 .array() 미지원 시 raw "approver_role[]" 으로 별도 helper.
  611:     requiredRoles: text("required_roles").array().notNull(),
  612:     assignedTo: uuid("assigned_to"),
  613:     assignedAt: timestamp("assigned_at", { withTimezone: true }),
  614:     slaDueAt: timestamp("sla_due_at", { withTimezone: true }).notNull(),
  615:     resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  616:     resolvedBy: uuid("resolved_by"),
  617:     resolutionType: text("resolution_type"),
  618:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  619:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  620:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

2026-05-18T09:18:01.139478Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1msubmitted-for-review: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "eventType: \"content-([36;1msubmitted-for-review[0m|approved|rejected|p …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                              ~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'submitted-for-review' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 811ms:
[31;1msubmitted-for-review: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "eventType: \"content-([36;1msubmitted-for-review[0m|approved|rejected|p …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                              ~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'submitted-for-review' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'eventType: \"content-(submitted-for-review|approved|rejected|published)\"|payload:' 'apps/web/src/lib/compliance' 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Force | Select-Object Name,Mode; if (Test-Path package.json) { Get-Content package.json }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "vitest|test" package.json apps/web/package.json pnpm-workspace.yaml turbo.json' in C:\Users\assag\solution\website-exposure
2026-05-18T09:18:09.673261Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
apps/web/package.json:12:    "test:scenarios": "vitest run"
apps/web/package.json:37:    "vitest": "^2.1.8",
rg: turbo.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 693ms:
apps/web/package.json:12:    "test:scenarios": "vitest run"
apps/web/package.json:37:    "vitest": "^2.1.8",
rg: turbo.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 729ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:75:          eventType: "content-approved",
apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:79:          payload: {
apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:162:          eventType: "content-rejected",
apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:166:          payload: {
apps/web/src/lib/compliance\entity-actions.ts:84:          eventType: "content-submitted-for-review",
apps/web/src/lib/compliance\entity-actions.ts:88:          payload: { contentType, contentRef, recordId: result.out.recordId, entryId: result.out.entryId },
apps/web/src/lib/compliance\entity-actions.ts:172:          eventType: "content-published",
apps/web/src/lib/compliance\entity-actions.ts:176:          payload: { contentType, contentRef, recordId: result.recordId },

 succeeded in 753ms:

[32;1mName                        [0m[32;1m Mode[0m
[32;1m----                        [0m [32;1m----[0m
.agents                      d----
.claude                      d----
.codex-reviews               d----
.git                         d--h-
.pnpm-store                  d----
apps                         d----
docs                         d----
handoff                      d----
node_modules                 d----
packages                     d----
.codex-critic-prompt-code.md -a---
.codex-critic-prompt.md      -a---
.gitignore                   -a---
.npmrc                       -a---
package.json                 -a---
pnpm-lock.yaml               -a---
pnpm-workspace.yaml          -a---
skills-lock.json             -a---
tsconfig.base.json           -a---
{
  "name": "website-exposure",
  "version": "0.1.0",
  "private": true,
  "description": "Glitzy 의료기관 웹사이트 노출 솔루션 — monorepo root",
  "engines": {
    "node": ">=20.10.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
    "web:dev": "pnpm --filter @glitzy/web dev",
    "web:build": "pnpm --filter @glitzy/web build",
    "web:seed": "pnpm --filter @glitzy/web seed",
    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
    "build:all": "pnpm pkg:build && pnpm --filter @glitzy/web build",
    "spike-a": "pnpm --filter @glitzy/spike-a",
    "spike-a:up": "pnpm --filter @glitzy/spike-a up",
    "spike-a:down": "pnpm --filter @glitzy/spike-a down",
    "spike-a:migrate": "pnpm --filter @glitzy/spike-a migrate",
    "spike-a:seed": "pnpm --filter @glitzy/spike-a seed",
    "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
    "spike-b": "pnpm --filter @glitzy/spike-b",
    "spike-b:up": "pnpm --filter @glitzy/spike-b up",
    "spike-b:down": "pnpm --filter @glitzy/spike-b down",
    "spike-b:migrate": "pnpm --filter @glitzy/spike-b migrate",
    "spike-b:seed": "pnpm --filter @glitzy/spike-b seed",
    "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
    "spike-c": "pnpm --filter @glitzy/spike-c-local",
    "spike-c:up": "pnpm --filter @glitzy/spike-c-local up",
    "spike-c:down": "pnpm --filter @glitzy/spike-c-local down",
    "spike-c:seed": "pnpm --filter @glitzy/spike-c-local seed",
    "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
    "spike-d": "pnpm --filter @glitzy/spike-d",
    "spike-d:up": "pnpm --filter @glitzy/spike-d up",
    "spike-d:down": "pnpm --filter @glitzy/spike-d down",
    "spike-d:migrate": "pnpm --filter @glitzy/spike-d migrate:dev",
    "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
    "spike-e": "pnpm --filter @glitzy/spike-e",
    "spike-e:up": "pnpm --filter @glitzy/spike-e up",
    "spike-e:down": "pnpm --filter @glitzy/spike-e down",
    "spike-e:migrate": "pnpm --filter @glitzy/spike-e migrate",
    "spike-e:seed": "pnpm --filter @glitzy/spike-e seed",
    "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
  },
  "packageManager": "pnpm@10.28.2"
}


codex
구현 흐름은 충분히 잡혔습니다. 마지막으로 vitest와 타입 표면을 확인해, 리뷰 결과의 PASS/FAIL 항목을 실제 명령 결과로 고정하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web test:scenarios -- apps/web/src/lib/compliance/__tests__/compliance.test.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
2026-05-18T09:18:20.442736Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.4 seconds
Output:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run "apps/web/src/lib/compliance/__tests__/compliance.test.ts"

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run "apps/web/src/lib/compliance/__tests__/compliance.test.ts"`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




 exited 1 in 1439ms:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run "apps/web/src/lib/compliance/__tests__/compliance.test.ts"

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run "apps/web/src/lib/compliance/__tests__/compliance.test.ts"`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




 succeeded in 2549ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=3 major=6 minor=4 (총 13)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **CAMC-01**: publish 흐름이 항상 `no-record`로 막힘
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:130-156, `apps/web/src/lib/compliance/server-actions.ts`:341-349
  - 근거(plan SoT): CA-ACTION-01·07, 시나리오 #9
  - 문제: `submitForReviewAction`은 entity에 `compliance_record_id`를 채우지 않고 status만 `review-queued`로 바꿉니다. 그런데 `publishContentAction`은 발행 전 `row.compliance_record_id`가 없으면 즉시 실패합니다. 실제 `compliance_record_id`는 `publishContent()` 내부에서 발행 시 채우도록 되어 있어, submit→approve→publish 정상 경로가 `publishable`까지 가도 발행 불가입니다.
  - 권장 patch: `publishContentAction`의 `row.compliance_record_id` 선행 요구를 제거하고, 이미 조회한 latest pre-publish record를 사용하거나, submit 시 entity에 pre-publish `compliance_record_id`를 채우는 정책으로 통일하세요. Plan 문구상 M0는 publish 시 채움이므로 전자가 더 작습니다.

- **CAMC-02**: C0016 sentinel backfill이 6 entity가 아님
  - 위치: `packages/core-content/migrations/C0016_status_unlock.sql`:50-158, 160-175
  - 근거(plan SoT): CA-SCHEMA-07~10, CAM2-03, 시나리오 #14
  - 문제: Article/TreatmentPage/Publication/MediaAppearance만 sentinel INSERT/UPDATE가 있고 LegalDocument/FAQ는 “published row 0건” 주석으로 생략되어 있습니다. 하지만 바로 뒤 NULL 잔존 검증은 6 entity 모두 수행하므로, 기존 데이터에 published LegalDocument/FAQ가 하나라도 있으면 migration이 실패합니다. plan은 “6 entity 모두 sentinel backfill + NOT EXISTS guard”를 acceptance precondition으로 둡니다.
  - 권장 patch: LegalDocument와 FAQ도 동일 패턴의 `INSERT ... WHERE status='published' AND compliance_record_id IS NULL AND NOT EXISTS` 및 UPDATE backfill을 추가하세요.

- **CAMC-03**: `approveContent`가 required role 외 역할 승인도 서버에서 허용
  - 위치: `apps/web/src/lib/compliance/server-actions.ts`:137-179, 204-207
  - 근거(plan SoT): CA-ACTION-03, REVIEW_WORKFLOW § 4.3·§ 11.2
  - 문제: UI는 `required_roles`로 필터하지만 서버 액션은 전달받은 `role`이 해당 queue의 `required_roles`에 포함되는지 검증하지 않습니다. 예를 들어 Low Article의 operator-only 큐에 medical 사용자가 직접 action 호출하면 physician slot이 채워집니다.
  - 권장 patch: `approveContent`/`rejectContent`에서 locked `review_queue_entry.required_roles`를 함께 조회하고, `args.role` 미포함이면 403성 `ReviewerEligibilityError` 또는 transition error로 차단하세요.

## major
- **CAMC-04**: submit wrapper가 주석과 달리 entity row를 잠그지 않음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:56-63
  - 근거(plan SoT): CA-ACTION-01~02, “entity-actions FOR UPDATE 락”
  - 문제: 주석은 FOR UPDATE라고 되어 있지만 실제 SELECT에는 `FOR UPDATE`가 없습니다. 동시 submit 시 같은 draft row를 동시에 읽고, 한쪽은 partial unique 위반/rollback에 의존합니다.
  - 권장 patch: SELECT에 `FOR UPDATE`를 추가하고, status update도 `WHERE status IN ('draft','rejected')` + row count 검증으로 묶으세요.

- **CAMC-05**: dynamic `tx.unsafe` SQL 조립이 과도하고 상태 전이 row count를 검증하지 않음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:57-63, 71-75, 131-135; `apps/web/src/lib/compliance/server-actions.ts`:194-202, 214-219, 283-288, 342-349
  - 근거(plan SoT): CA-ACTION-01~07, TypeScript/보안 점검 항목
  - 문제: table allowlist는 있으나 `contentRef.replace` 수동 escape와 문자열 보간이 반복됩니다. 더 큰 문제는 UPDATE 결과 row count를 보지 않아 slug mismatch/status drift가 조용히 성공처럼 진행될 수 있습니다.
  - 권장 patch: table명만 allowlist로 유지하고 값은 tagged template 파라미터로 바꾸세요. UPDATE는 `WHERE ... AND status = expected`로 제한하고 affected rows 1건을 검증하세요.

- **CAMC-06**: server actions가 `assertTransitionAllowed`를 일관 적용하지 않음
  - 위치: `apps/web/src/lib/compliance/server-actions.ts`:193-219, 283-288, 326-349
  - 근거(plan SoT): CA-ACTION-06 “모든 server action 첫 줄”
  - 문제: `submitForReview`만 transition table을 사용합니다. approve/reject/publish는 현재 entity 상태를 읽어 전이 검증하지 않고 직접 UPDATE합니다.
  - 권장 patch: approve는 `review-queued→in-review`, `in-review→approved`, `approved→publishable`; reject는 `in-review→rejected`; publish는 `publishable→published`를 실제 row status 기준으로 검증하세요.

- **CAMC-07**: audit payload가 CA-CASCADE-06 shape와 불일치
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:83-89, 170-177
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: submit audit에 `finalRoles`, `pageRiskLevel`이 없고 publish audit에 `recordVersion`이 없습니다.
  - 권장 patch: helper return에 `finalRoles/pageRiskLevel/recordVersion`을 포함하거나 action에서 재조회해 payload shape를 맞추세요.

- **CAMC-08**: LegalDocument exempt envelope가 risk MAX 결합을 안 함
  - 위치: `apps/web/src/lib/compliance/check.ts`:33-35
  - 근거(plan SoT): CA-CHECK-03, CAM-04
  - 문제: `explicitRiskLevel ?? inferredRiskLevel ?? "Low"`라서 explicit=Low, inferred=High 입력 시 Low로 격하됩니다. `check()` 본체는 `maxRisk()`를 사용합니다.
  - 권장 patch: `buildLegalDocumentExemptEnvelope`도 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`를 사용하세요.

- **CAMC-09**: review detail에 콘텐츠 본문 preview가 없음
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx`:55-76, 116-139
  - 근거(plan SoT): CA-UI-01 detail page
  - 문제: detail page는 메타와 ComplianceRecord 슬롯만 보여주고, “콘텐츠 본문 미리보기(read-only)”가 없습니다. 검수자가 실제 콘텐츠를 확인하지 않고 approve/reject하게 됩니다.
  - 권장 patch: content_type별 allowlist query로 title/body/summary를 read-only 영역에 표시하세요.

## minor
- **CAMC-10**: `content-submitted-for-review` audit은 action 성공 후 payload가 불충분
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:88
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: CAMC-07과 별개로 submit helper 결과 타입 자체가 `recordId/entryId`만 반환해 audit shape를 만들기 어렵습니다.
  - 권장 patch: `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.

- **CAMC-11**: `content-published` audit에 `recordVersion` 재조회 경로 없음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:176
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: publish payload shape 요구사항을 만족할 수 없는 반환 타입입니다.
  - 권장 patch: `publishContent`가 `recordVersion`을 반환하게 하세요.

- **CAMC-12**: saveArticle audit가 무시한 form status를 기록함
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts`:176-190, 231-238
  - 근거(plan SoT): CA-UI-02, saveArticle status field 무시
  - 문제: DB status는 보존하지만 audit payload에는 `parsed.data.status`를 넣어 tampered form 값이 기록될 수 있습니다.
  - 권장 patch: locked row의 current status를 별도 보관해 audit에 기록하세요.

- **CAMC-13**: vitest 25개는 존재하지만 현재 환경에서 PASS 확인 불가
  - 위치: `apps/web/src/lib/compliance/__tests__/compliance.test.ts`:11-191
  - 근거(plan SoT): vitest scenarios 1~16
  - 문제: 테스트 파일상 25개 케이스는 있으나 실행은 `vitest.config.ts` 로드 중 `Error: spawn EPERM`으로 실패했습니다.
  - 권장 patch: CI/로컬에서 esbuild spawn 가능 환경을 보장하거나, 본 리뷰 환경용 fallback 설정을 확인하세요.

## acceptance precondition 점검
- 6 entity sentinel backfill idempotency: FAIL
- check() stub LegalDocument throw: PASS
- evaluatePublishable 6조건: PASS (M0 stub 범위 기준)
- advisory lock hashtextextended: PASS
- vitest 25 tests PASS: FAIL (`spawn EPERM`으로 실행 실패)
tokens used
148,315
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=3 major=6 minor=4 (총 13)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **CAMC-01**: publish 흐름이 항상 `no-record`로 막힘
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:130-156, `apps/web/src/lib/compliance/server-actions.ts`:341-349
  - 근거(plan SoT): CA-ACTION-01·07, 시나리오 #9
  - 문제: `submitForReviewAction`은 entity에 `compliance_record_id`를 채우지 않고 status만 `review-queued`로 바꿉니다. 그런데 `publishContentAction`은 발행 전 `row.compliance_record_id`가 없으면 즉시 실패합니다. 실제 `compliance_record_id`는 `publishContent()` 내부에서 발행 시 채우도록 되어 있어, submit→approve→publish 정상 경로가 `publishable`까지 가도 발행 불가입니다.
  - 권장 patch: `publishContentAction`의 `row.compliance_record_id` 선행 요구를 제거하고, 이미 조회한 latest pre-publish record를 사용하거나, submit 시 entity에 pre-publish `compliance_record_id`를 채우는 정책으로 통일하세요. Plan 문구상 M0는 publish 시 채움이므로 전자가 더 작습니다.

- **CAMC-02**: C0016 sentinel backfill이 6 entity가 아님
  - 위치: `packages/core-content/migrations/C0016_status_unlock.sql`:50-158, 160-175
  - 근거(plan SoT): CA-SCHEMA-07~10, CAM2-03, 시나리오 #14
  - 문제: Article/TreatmentPage/Publication/MediaAppearance만 sentinel INSERT/UPDATE가 있고 LegalDocument/FAQ는 “published row 0건” 주석으로 생략되어 있습니다. 하지만 바로 뒤 NULL 잔존 검증은 6 entity 모두 수행하므로, 기존 데이터에 published LegalDocument/FAQ가 하나라도 있으면 migration이 실패합니다. plan은 “6 entity 모두 sentinel backfill + NOT EXISTS guard”를 acceptance precondition으로 둡니다.
  - 권장 patch: LegalDocument와 FAQ도 동일 패턴의 `INSERT ... WHERE status='published' AND compliance_record_id IS NULL AND NOT EXISTS` 및 UPDATE backfill을 추가하세요.

- **CAMC-03**: `approveContent`가 required role 외 역할 승인도 서버에서 허용
  - 위치: `apps/web/src/lib/compliance/server-actions.ts`:137-179, 204-207
  - 근거(plan SoT): CA-ACTION-03, REVIEW_WORKFLOW § 4.3·§ 11.2
  - 문제: UI는 `required_roles`로 필터하지만 서버 액션은 전달받은 `role`이 해당 queue의 `required_roles`에 포함되는지 검증하지 않습니다. 예를 들어 Low Article의 operator-only 큐에 medical 사용자가 직접 action 호출하면 physician slot이 채워집니다.
  - 권장 patch: `approveContent`/`rejectContent`에서 locked `review_queue_entry.required_roles`를 함께 조회하고, `args.role` 미포함이면 403성 `ReviewerEligibilityError` 또는 transition error로 차단하세요.

## major
- **CAMC-04**: submit wrapper가 주석과 달리 entity row를 잠그지 않음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:56-63
  - 근거(plan SoT): CA-ACTION-01~02, “entity-actions FOR UPDATE 락”
  - 문제: 주석은 FOR UPDATE라고 되어 있지만 실제 SELECT에는 `FOR UPDATE`가 없습니다. 동시 submit 시 같은 draft row를 동시에 읽고, 한쪽은 partial unique 위반/rollback에 의존합니다.
  - 권장 patch: SELECT에 `FOR UPDATE`를 추가하고, status update도 `WHERE status IN ('draft','rejected')` + row count 검증으로 묶으세요.

- **CAMC-05**: dynamic `tx.unsafe` SQL 조립이 과도하고 상태 전이 row count를 검증하지 않음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:57-63, 71-75, 131-135; `apps/web/src/lib/compliance/server-actions.ts`:194-202, 214-219, 283-288, 342-349
  - 근거(plan SoT): CA-ACTION-01~07, TypeScript/보안 점검 항목
  - 문제: table allowlist는 있으나 `contentRef.replace` 수동 escape와 문자열 보간이 반복됩니다. 더 큰 문제는 UPDATE 결과 row count를 보지 않아 slug mismatch/status drift가 조용히 성공처럼 진행될 수 있습니다.
  - 권장 patch: table명만 allowlist로 유지하고 값은 tagged template 파라미터로 바꾸세요. UPDATE는 `WHERE ... AND status = expected`로 제한하고 affected rows 1건을 검증하세요.

- **CAMC-06**: server actions가 `assertTransitionAllowed`를 일관 적용하지 않음
  - 위치: `apps/web/src/lib/compliance/server-actions.ts`:193-219, 283-288, 326-349
  - 근거(plan SoT): CA-ACTION-06 “모든 server action 첫 줄”
  - 문제: `submitForReview`만 transition table을 사용합니다. approve/reject/publish는 현재 entity 상태를 읽어 전이 검증하지 않고 직접 UPDATE합니다.
  - 권장 patch: approve는 `review-queued→in-review`, `in-review→approved`, `approved→publishable`; reject는 `in-review→rejected`; publish는 `publishable→published`를 실제 row status 기준으로 검증하세요.

- **CAMC-07**: audit payload가 CA-CASCADE-06 shape와 불일치
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:83-89, 170-177
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: submit audit에 `finalRoles`, `pageRiskLevel`이 없고 publish audit에 `recordVersion`이 없습니다.
  - 권장 patch: helper return에 `finalRoles/pageRiskLevel/recordVersion`을 포함하거나 action에서 재조회해 payload shape를 맞추세요.

- **CAMC-08**: LegalDocument exempt envelope가 risk MAX 결합을 안 함
  - 위치: `apps/web/src/lib/compliance/check.ts`:33-35
  - 근거(plan SoT): CA-CHECK-03, CAM-04
  - 문제: `explicitRiskLevel ?? inferredRiskLevel ?? "Low"`라서 explicit=Low, inferred=High 입력 시 Low로 격하됩니다. `check()` 본체는 `maxRisk()`를 사용합니다.
  - 권장 patch: `buildLegalDocumentExemptEnvelope`도 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`를 사용하세요.

- **CAMC-09**: review detail에 콘텐츠 본문 preview가 없음
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx`:55-76, 116-139
  - 근거(plan SoT): CA-UI-01 detail page
  - 문제: detail page는 메타와 ComplianceRecord 슬롯만 보여주고, “콘텐츠 본문 미리보기(read-only)”가 없습니다. 검수자가 실제 콘텐츠를 확인하지 않고 approve/reject하게 됩니다.
  - 권장 patch: content_type별 allowlist query로 title/body/summary를 read-only 영역에 표시하세요.

## minor
- **CAMC-10**: `content-submitted-for-review` audit은 action 성공 후 payload가 불충분
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:88
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: CAMC-07과 별개로 submit helper 결과 타입 자체가 `recordId/entryId`만 반환해 audit shape를 만들기 어렵습니다.
  - 권장 patch: `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.

- **CAMC-11**: `content-published` audit에 `recordVersion` 재조회 경로 없음
  - 위치: `apps/web/src/lib/compliance/entity-actions.ts`:176
  - 근거(plan SoT): CA-CASCADE-06
  - 문제: publish payload shape 요구사항을 만족할 수 없는 반환 타입입니다.
  - 권장 patch: `publishContent`가 `recordVersion`을 반환하게 하세요.

- **CAMC-12**: saveArticle audit가 무시한 form status를 기록함
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts`:176-190, 231-238
  - 근거(plan SoT): CA-UI-02, saveArticle status field 무시
  - 문제: DB status는 보존하지만 audit payload에는 `parsed.data.status`를 넣어 tampered form 값이 기록될 수 있습니다.
  - 권장 patch: locked row의 current status를 별도 보관해 audit에 기록하세요.

- **CAMC-13**: vitest 25개는 존재하지만 현재 환경에서 PASS 확인 불가
  - 위치: `apps/web/src/lib/compliance/__tests__/compliance.test.ts`:11-191
  - 근거(plan SoT): vitest scenarios 1~16
  - 문제: 테스트 파일상 25개 케이스는 있으나 실행은 `vitest.config.ts` 로드 중 `Error: spawn EPERM`으로 실패했습니다.
  - 권장 patch: CI/로컬에서 esbuild spawn 가능 환경을 보장하거나, 본 리뷰 환경용 fallback 설정을 확인하세요.

## acceptance precondition 점검
- 6 entity sentinel backfill idempotency: FAIL
- check() stub LegalDocument throw: PASS
- evaluatePublishable 6조건: PASS (M0 stub 범위 기준)
- advisory lock hashtextextended: PASS
- vitest 25 tests PASS: FAIL (`spawn EPERM`으로 실행 실패)
