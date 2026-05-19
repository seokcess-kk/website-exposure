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
session id: 019e3a3d-a4db-7162-8ff7-db9de613eaea
--------
user
Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.2 — **cycle 2**. cycle 1 28 finding patch 적용 검증 + 새 blocking/major/minor 확인.

## Cycle 1 patch (28 findings, blocking 9 · major 12 · minor 7)

| # | severity | title | patch |
|---|---|---|---|
| CAM-01 | blocking | EC-DEFER-05 해소 주장 정정 | "EC-DEFER-07/12 부분 해소, EC-DEFER-05 미해소" 명시 |
| CAM-02 | blocking | content-gate → manual-review queue | review_queue_type='manual-review' 1종 + content-gate 는 CA-DEFER-15 |
| CAM-03 | blocking | ComplianceCheckResult SoT 정합 | ComplianceCheckEnvelope wrapper · CONTENT_STANDARDS § 7.2 그대로 |
| CAM-04 | blocking | maxRisk MAX 결합 | helper 추가 — 격하 금지 |
| CAM-05 | blocking | High 입력 가상 finding | `m0-stub-risk-level-high-gate` 주입 + gateRequired=true |
| CAM-06 | blocking | publishable 6조건 | evaluatePublishable 전체 평가 + fail closed |
| CAM-07 | blocking | C0016 NOT VALID + backfill | sentinel ComplianceRecord 사전 INSERT + VALIDATE 단계 분리 |
| CAM-08 | blocking | published guard trigger | published_content_compliance_guard BEFORE trigger 신설 |
| CAM-09 | blocking | LegalDocument check() 면제 | check() 우회 + exemptReason envelope |
| CAM-10 | major | enum 풀 17종 + M0 allowlist | DB enum 17종 + app layer ALLOWED_SUBMIT_TYPES |
| CAM-11 | major | featureContentType CA-DEFER | CA-DEFER-16 신설 |
| CAM-12 | major | mediaThresholdOperationalInput CA-DEFER | CA-DEFER-13 에 추가 |
| CAM-13 | major | cancelled 제거 | open/in-progress/resolved 3종 |
| CAM-14 | major | compliance_record_id NOT NULL | manual-review 큐 — 고아 차단 |
| CAM-15 | major | required_roles enum array | approver_role[] enum array |
| CAM-16 | major | requiredApproverRoles 통합 | evaluatePublishable parsing + unknown fail closed |
| CAM-17 | major | approveContent atomic 전이 | open→in-progress + review-queued→in-review 첫 호출 atomic |
| CAM-18 | major | form status select read-only | workflow actions only |
| CAM-19 | major | Publication/Media unlock 표현 | form/zod unlock + compliance_record_id ADD COLUMN |
| CAM-20 | major | audit matrix cascade | REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade |
| CAM-21 | major | NotificationEvent CA-DEFER | CA-DEFER-14 신설 |
| CAM-22 | minor | "역할 3종" 정정 | client 제외 3종 |
| CAM-23 | minor | manifest 19단계 | 16 + C0014/C0015/C0016 = 19 |
| CAM-24 | minor | "6 entity" 정정 | 4 → 6 |
| CAM-25 | minor | C-08 → C-10 | DATA_MODEL § 4 SoT |
| CAM-26 | minor | 표기 규칙 | snake_case vs camelCase |
| CAM-27 | minor | hashtextextended | 64-bit lock key |
| CAM-28 | minor | 시나리오 13 scope | FAQ JSON-LD 별 회귀 테스트 |

## SoT to read (cycle 1 동일)

1. `docs/features/compliance-assistant.md` v1.0
2. `docs/admin/REVIEW_WORKFLOW.md`
3. `docs/core/DATA_MODEL.md` C-10
4. `docs/compliance/RISK_LEVELS.md`
5. `docs/core/CONTENT_STANDARDS.md` § 7
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1
8. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
9. `packages/core-content/src/schema.ts` v0.4

## Verification

cycle 1 의 28 patch 각각 PASS 검증 + 새 blocking/major/minor 확인. 짧게.

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=N

## cycle 1 patch 검증
- CAM-01: PASS/FAIL + 한 줄
... (CAM-01 ~ CAM-28)

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 1 의 28건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
seo-geo 스킬은 이번 요청 범위와 맞지 않아 사용하지 않습니다. 문서 리뷰라서 먼저 대상 plan과 SoT를 병렬로 읽고, cycle 1 패치 항목별로 증거를 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/compliance/RISK_LEVELS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/features/compliance-assistant.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 716ms:
# compliance-assistant M0 vertical slice plan (v0.2·draft·2026-05-18)

> **상태**: **v0.2 (draft)** — Codex 자동 비평 cycle 1 **28 finding** (blocking 9·major 12·minor 7) 전건 수용 patch. compliance-assistant Feature spec v1.0 (612 line · 5 cycle 47 finding · M1 acceptance) 의 M0 vertical slice scope.

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (content-gate 큐 1종·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.

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
- **LegalDocument 자동 검수 면제 (CAM-09 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. auto_check_result 슬롯에 명시적 면제 envelope `{automatedDecision:"pass", exemptReason:"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}` 저장.

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
| check() stub (CAM-03·04·05·09 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로** (buildBlocked · findingsBySeverity · summary 등 모두 포함). pageRiskLevel 등은 wrapper `ComplianceCheckEnvelope` 안 분리. **pageRiskLevel = maxRisk(input.metadata.explicitRiskLevel ?? "Low", input.metadata.inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 check() 호출 우회 — auto_check_result 슬롯에 면제 envelope 직접 저장** |
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

-- (Step 4) Sentinel ComplianceRecord backfill — 기존 published row 가 있는 entity 만.
--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low'.
INSERT INTO compliance_record (
  instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at,
  published_at, published_by, record_phase, record_version, metadata
)
SELECT DISTINCT
  a.instance_id, 'Article'::compliance_content_type, a.slug, COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","exemptReason":"sentinel-pre-existing-published","manualReview":true}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid,
  a.published_at,
  a.published_at,
  '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase,
  1,
  '{"sentinel":true}'::jsonb
FROM article a
WHERE a.status = 'published' AND a.compliance_record_id IS NULL;

UPDATE article a
SET compliance_record_id = cr.id
FROM compliance_record cr
WHERE a.instance_id = cr.instance_id
  AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
    FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  -- treatment_page · legal_document · faq · publication · media_appearance 도 동일 검증 (반복 생략 — migration 실 코드 안 6 entity 모두)
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE.
--   기존 published row 가 모두 sentinel 로 채워졌으므로 VALIDATE 안전.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
-- treatment_page · legal_document · faq · publication · media_appearance 동일 (반복 생략)

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

### 3.1 finalRoles 계산 (CA-GATE-01)

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: ApproverRole[] = [],   // CAM-16 정정 — auto_check_result.requiredApproverRoles 전달
): ApproverRole[] {
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    // CAM-16 정정 — unknown role fail closed
    if (r !== "operator" && r !== "medical" && r !== "legal") {
      throw new ComplianceConfigError(`Unknown ApproverRole: ${r}`);
    }
    roles.add(r);
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

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  const requiredApproverRoles = (autoCheck.requiredApproverRoles ?? []).filter(
    (r): r is ApproverRole => r === "operator" || r === "medical" || r === "legal"
  );
  const finalRoles = calculateFinalRoles(
    contentType, record.page_risk_level, record.prior_review_required, requiredApproverRoles,
  );
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

## 4. check() stub 결정 — CAM-03·04·05·09 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01)

CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로 반환 + M0 stub metadata 는 wrapper 안 분리:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 그대로
// 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview) 는 envelope 안.
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만)
  };
};
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04)

```typescript
// apps/web/src/lib/compliance/check.ts
export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // CAM-09 정정 — LegalDocument 면제 (CONTENT_STANDARDS § 7.1.1.1)
  if (input.contentType === "LegalDocument") {
    return {
      result: {
        findings: [],
        buildBlocked: false,
        gateRequired: false,
        hasWarnings: false,
        automatedDecision: "pass",
        findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0 },
        summary: { ruleMatchedCount: 0, llmAssistInvoked: false },
        requiredApproverRoles: [],  // legal 은 finalRoles 안 contentType='LegalDocument' 분기로 추가됨
        catalogVersion: "m0-stub-v0.1",
        catalogHash: "stub",
        exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
      },
      meta: { pageRiskLevel: "Low", catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: false },
    };
  }

  // CAM-04 정정 — MAX 결합 (격하 금지)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // CAM-05 정정 — High 입력 시 가상 finding `risk-level-high-gate` + gateRequired=true
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      severity: "content-gate",
      reason: "High risk level requires content-gate review (M0 stub virtual finding)",
      // ... CONTENT_STANDARDS Finding shape
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  return {
    result: {
      findings,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      automatedDecision,
      findingsBySeverity: { fail: 0, "content-gate": gateRequired ? 1 : 0, warning: 0 },
      summary: { ruleMatchedCount: 0, llmAssistInvoked: false },
      requiredApproverRoles: [],
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-05)

- `submitForReview` server action 안 check() 호출 → `compliance_record.auto_check_result` = `envelope.result` 저장 + `compliance_record.page_risk_level` = `envelope.meta.pageRiskLevel`.
- LegalDocument 는 check() 호출하지만 면제 envelope 반환 — auto_check_result 에 exemptReason 명시.
- M0 stub 의 High 가상 finding 시 gateRequired=true · automatedDecision='gate' — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.

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
| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · auto_check_result.exemptReason='LegalDocument-...' | LegalDocument check() 우회 + 면제 envelope | vitest |
| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
| 12 | check() stub High 입력 (explicit or inferred) → 가상 finding `m0-stub-risk-level-high-gate` 주입 · gateRequired=true · automatedDecision='gate' | M0 High 가상 finding | vitest |
| 13 | check() stub LegalDocument 입력 → 면제 envelope · exemptReason='LegalDocument-...' · manualReview=false | LegalDocument 면제 (CAM-09) | vitest |
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
| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |


 succeeded in 724ms:
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


 succeeded in 766ms:
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


 succeeded in 771ms:
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


 succeeded in 775ms:
# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준

> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 RiskInferenceResult.steps 표준화)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 콘텐츠 표현 룰 SoT → `core/CONTENT_STANDARDS.md` (§ 4·§ 7)
> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
> - 페이지 타입별 위험도 기본값 → `core/PAGE_TYPES.md` (§ 3)
> - ArticleType별 위험도 기본값 → `core/CONTENT_STANDARDS.md` (§ 6)
> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
- **RiskRule 데이터 파일**: `data/compliance-rules/` 디렉토리, YAML 포맷, JSON Schema 검증, 의료법 개정 시 MAJOR 버전
- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| RiskLevel enum 변경 | **MAJOR** | DATA_MODEL C-05 cascade 필수 |
| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마이그레이션 가이드 필수 |
| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
| RiskRule 추가 (warning/content-gate) | MINOR | |
| RiskRule 추가 (fail) | **MAJOR** | 빌드 차단 가능 |
| RiskRule 패턴 정정 (false-positive 감소) | PATCH | |
| 의료법 개정 대응 룰 갱신 | **MAJOR** | 본 문서 § 7.1 의료법 개정 추적 표 동시 갱신 |
| ApproverRole 통과 기준 변경 | **MAJOR** | 운영 정책 영향 |

### 1.2 SoT 원칙

- 본 문서는 **운영·구현 SoT** — `compliance-assistant` Feature Module과 어드민 검수 워크플로가 본 문서를 입력으로 받음
- 의료광고 **표현 룰의 카탈로그 SoT**는 `core/CONTENT_STANDARDS.md` § 4 — 본 문서는 카탈로그를 RiskRule 데이터 파일로 변환·운영하는 책임만
- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속

---

## 2. RiskLevel — 정의·자동 추론

### 2.1 RiskLevel enum

`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:

```ts
const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
// max(level1, level2) — 등급 결합 시 더 높은 등급 채택
```

### 2.2 자동 추론 입력

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급
  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
};

type SlotMatch = {
  pageTypeId: PageTypeId;
  slotId: string;                     // PAGE_TYPES § 3 슬롯 ID (예: "P-006-content-results")
  triggeredLevel: RiskLevel;
};
```

### 2.3 자동 추론 알고리즘

```
1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
2. if articleType: base = max(base, CONTENT_STANDARDS § 6 articleType 기본 등급)
3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
4. for each slotMatch: base = max(base, slotMatch.triggeredLevel)
5. if explicitRiskLevel: final = max(base, explicitRiskLevel)
6. else: final = base
7. return final
```

`explicitRiskLevel`은 격하 불가 — 항상 MAX 결합. ComplianceRecord 운영자가 명시 격상만 가능.

#### 2.3.1 RiskInferenceResult — steps[] 추적

```ts
type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;     // MAX 결합 결과 (단계 7 final)
  steps: Array<{                     // 등급 산정 출처 추적 (audit·triggeredBy 판정용)
    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
    sourceValue: string;             // 예: "P-006", "review-case", "includes-pricing", "P-006-content-results"
    level: RiskLevel;                // 본 source가 기여한 등급
  }>;
};
```

- 각 단계 1~5에서 base가 갱신될 때마다 steps[]에 항목 추가
- triggeredBy 판정에 사용 (admin/REVIEW_WORKFLOW·features/compliance-assistant § 4.1 7단계)

### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)

| InlineRiskFlag | 격상 등급 | 의미 |
|---|---|---|
| `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
| `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
| `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
| `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |

> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).

### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)

| 페이지 | 기본 등급 |
|---|---|
| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-test | Medium |
| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |

> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.

---

## 3. RiskRule 데이터 파일

### 3.1 위치·디렉토리 구조

```
data/compliance-rules/
├── rules.core.yaml             # § 4.1 CONTENT_STANDARDS 표 → 데이터 변환 (Core 룰)
├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
├── rules.preset-<presetSlug>.yaml     # preset별 특유 표현. <presetSlug>은 `presets/<presetSlug>/` 디렉토리명과 동일 (kebab-case, 예: `hanui-clinic`)
├── context-exceptions.yaml     # CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그 (§ 3.4.3 스키마)
├── medical-law-tracking.yaml   # 의료법 개정 추적 (§ 7.1.2)
└── meta.yaml                   # 룰 카탈로그 메타데이터·버전 인덱스 (§ 3.4.1)
```

- 파일 단위 분리 — 변경 추적·diff 친화
- `meta.yaml`은 전체 카탈로그 버전·로드 순서·의존성을 인덱스

### 3.2 파일 포맷 — YAML + JSON Schema

YAML로 작성 (사람 가독·다중 라인 정규식 친화), 빌드 시 JSON Schema로 검증.

**예시 — `rules.core.yaml`**:

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.1"
sourceDocVersion: "1.0"

rules:
  - id: "supremacy-001"
    category: "최상급"
    pattern: '(최고의|최저가|최대|최강|1위|국내 유일|세계 최초|세계 최고)'
    patternType: "regex"
    severity: "fail"
    scope:
      - { type: "global" }
    rationale: "의료법 제56조 — 최상급 표현 금지"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"

  - id: "guarantee-composite-001"
    category: "보장 결합 강조"
    patternType: "composite"
    operands:
      - { pattern: '(100%|반드시|절대|확실히)', patternType: "regex" }
      - { pattern: '(효과|결과|호전|개선|치유|보장)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope:
      - { type: "global" }
    contextExceptions:
      - kind: "safety"
        pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    rationale: "의료법 제56조 + § 4.1 전문성 단정 + 보장 결합"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`

빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 RiskRule(SimpleRiskRule + CompositeRiskRule) 전체 스키마를 검증할 수 있어야 한다.

**기본 식별·메타**
| 검증 항목 | 룰 레벨 |
|---|---|
| `id` 중복 (전체 파일 합집합) | **fail** |
| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `category` 비어 있음 | **fail** |
| `version` SemVer 형식 위반 | **fail** |
| `createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `sourceDoc` URL/경로 형식 위반 | warning |
| `sourceDocVersion` SemVer 형식 위반 | warning |

**Simple/Composite 구분**
| 검증 항목 | 룰 레벨 |
|---|---|
| `patternType` enum 외 값 (`regex`·`keyword`·`phrase`·`composite`) | **fail** |
| Simple — `pattern` 누락 | **fail** |
| Simple — `pattern` regex 컴파일 실패 (`patternType="regex"` 시) | **fail** |
| Composite — `operands[]` 길이 < 2 | **fail** |
| Composite — `logic` enum 외 값 (`AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR`) | **fail** |
| Composite — `logic="AND_NEAR"` + `window` 누락 또는 ≤ 0 | **fail** |
| Composite — 각 `operands[].pattern` regex 컴파일 실패 | **fail** |

**severity·scope·roles**
| 검증 항목 | 룰 레벨 |
|---|---|
| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
| `scope[]` 빈 배열 | **fail** |
| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
| `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
| `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
| `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
| `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |
| `suggestion` 1,000자 초과 | warning |
| `exceptions[]` 항목 빈 문자열 | **fail** |
| `exceptions[]` 항목 regex 패턴인 경우 컴파일 실패 | **fail** |
| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
| `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |

**context-exceptions.yaml** (§ 3.4.3 스키마)
| 검증 항목 | 룰 레벨 |
|---|---|
| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
| `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `exceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `exceptions[].pattern` 누락 또는 빈 문자열 | **fail** |
| `exceptions[].pattern` regex 컴파일 실패 | **fail** |
| `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
| `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **fail** |
| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
| `exceptions[].version` SemVer 형식 위반 | **fail** |
| `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `exceptions[].rationale` 누락 또는 빈 문자열 | warning (감사·추적 약화) |

**overrides·meta·medical-law-tracking**
| 검증 항목 | 룰 레벨 |
|---|---|
| `overrides[].targetRuleId` 미존재 (다른 파일에 정의된 ID 참조) | **fail** |
| `overrides[].patch` 객체에 enum/타입 위반 (deep merge 결과 기준) | **fail** |
| 동일 `targetRuleId`에 대한 override 카탈로그 전체에서 2개 이상 | **fail** |
| `meta.yaml` 구조 위반 (§ 3.4.1 참조) | **fail** |
| `meta.yaml`의 `medicalLawRevisionRef`가 `medical-law-tracking.yaml`의 `revisions[].revisionId` 미존재 | **fail** |
| `medical-law-tracking.yaml` 파일 부재 | **fail** |
| `medical-law-tracking.yaml.revisions[]` 필수 필드 누락 (`revisionId`·`lawSource`·`revisionEffectiveDate`·`sourceUrl`·`checkedAt`·`checkedBy`·`affectedRuleIds`·`staleScope`) | **fail** |
| `medical-law-tracking.yaml.revisions[].affectedRuleIds`의 룰 ID가 카탈로그에 미존재 | **fail** |
| `medical-law-tracking.yaml.revisions[].revisionType` enum 외 값 (`amendment`·`reaffirmation`·`new`) | **fail** |
| `medical-law-tracking.yaml.revisions[].staleScope.kind` enum 외 값 (`all`·`rule-matched`·`content-type`) | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 빈 배열 또는 누락 | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 항목이 C-10 contentType enum 미존재 | **fail** |
| `staleScope.kind="rule-matched"` + `affectedRuleIds[]` 빈 배열 | **fail** |
| `medical-law-tracking.yaml.revisions[].sourceUrl` URL 형식 위반 | **fail** |

#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책

| severity | requiredApproverRoles 처리 |
|---|---|
| `fail` | 무시 (빌드 차단이므로 검수자 불필요). 명시 시 schema warning |
| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |
| `content-gate` | **필수 명시** (§ 4.5 multi-role AND 조건) |
| `info` | 무시. 명시 시 schema warning |

### 3.4 로드 순서·머지 규칙

```
1. rules.core.yaml         (Core 룰 — 기본 카탈로그)
2. rules.medical-ad.yaml   (의료법 기반 룰)
3. rules.preset-<presetSlug>.yaml  (인스턴스의 preset)
4. context-exceptions.yaml (별도 ContextException[] 컬렉션)
```

- 동일 `id` 중복 시 빌드 fail
- preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 가능
- 로드 결과는 단일 `RiskRule[]` 컬렉션 + `ContextException[]` 컬렉션

#### 3.4.1 `meta.yaml` 구조

```yaml
catalogVersion: "1.0.0"                          # 카탈로그 전체 SemVer
medicalLawRevisionRef: "2026-Q1"                 # 의료법 개정 추적 (§ 7.1)
loadOrder:                                       # 파일 로드 순서 명시 — 모든 카탈로그 파일 포함
  rules:                                          # rules 파일 (순차 머지)
    - rules.core.yaml
    - rules.medical-ad.yaml
    - rules.preset-hanui-clinic.yaml
  contextExceptions:                              # ContextException 파일 (별도 컬렉션)
    - context-exceptions.yaml
  tracking:                                       # 추적 데이터 파일
    - medical-law-tracking.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "의료법 제56조·제57조 룰"
  rules.preset-hanui-clinic.yaml:
    version: "1.0.0"
    description: "한의 특유 표현·체질 회색지대"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — § 7.1.2"
```

#### 3.4.2 `overrides[]` 스키마·머지 규칙

```yaml
# preset 파일 내 예시
overrides:
  - targetRuleId: "supremacy-001"        # rules.core.yaml의 룰 ID
    patch:                                # 부분 갱신 — 명시된 필드만 교체 (deep merge)
      severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
      contextExceptions:                  # 배열은 union 아니라 교체 — 기존 항목 유지하려면 모두 재기술
        - { kind: "safety", pattern: "기존 패턴" }
        - { kind: "safety", pattern: "추가 패턴" }
    rationale: "preset-hanui-clinic — 한의 진료 안내 문맥에서 안전 권유 다용"
    appliedAt: "2026-05-14T00:00:00Z"
```

**머지 알고리즘**:
1. `targetRuleId`의 원본 룰을 base로 복사
2. `patch` 객체를 base에 적용:
   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
   - 객체 필드(`metadata`) — deep merge (재귀적 key별 교체)
   - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`requiredApproverRoles[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)
3. `patch`에 명시되지 않은 필드는 원본 값 유지
4. 결과는 새 RiskRule으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉션에 존재

**제약**:
- override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본 비활성화 (별도 deprecation)
- 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견 시 빌드 **fail** (last-wins 정책 없음)

#### 3.4.3 `context-exceptions.yaml` 스키마

CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그의 데이터 표현. 빌드 로드 시 별도 `ContextException[]` 컬렉션으로 분리되고, 각 항목은 명시한 룰·카테고리·scope에 대해 매칭 검사 시 제외 단언(negative assertion)으로 작용.

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
sourceDocVersion: "1.0"

exceptions:
  - id: "safety-medical-consult-001"
    kind: "safety"                         # safety | warning-message | administrative
    pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    patternType: "regex"
    appliesTo:                              # 본 예외가 적용되는 대상
      categories: ["전문성 단정 (단독 어휘)"]   # RiskRule.category 매칭 (1개 이상)
      ruleIds: []                            # 또는 특정 RiskRule.id 명시 (1개 이상). 둘 중 1개 이상 필수
      scopes:                                # 본 예외가 적용될 scope (선택 — 미지정 시 전체)
        - { type: "global" }
    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

- `appliesTo.categories`와 `appliesTo.ruleIds` 중 1개 이상 비어 있지 않아야 함 (빌드 fail)
- 매칭 시 — 본 예외의 `pattern`이 텍스트 매칭하면, 같은 위치의 해당 룰 finding을 결과에서 제거

### 3.5 버전 관리

- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
- 파일 헤더의 `version` — 파일 단위 SemVer. 룰 추가/삭제 시 MINOR, 의료법 개정 시 MAJOR
- 의료법 개정 시 § 7.1 추적 표 동시 갱신 + `meta.yaml`에 `medicalLawRevisionRef` 기록

---

## 4. ApproverRole 통과 기준 — content-gate 발행 조건 (CS-02 해소)

`CONTENT_STANDARDS § 7.1.3`의 4역할 통과 기준 SoT.

### 4.1 medical (의료진 검수)

**검수 자격**:
- DoctorProfile(C-02) 등록 + `credentials[]`로 의료진 자격(면허·전문의 등) 검증 (DATA_MODEL 정합)
- 콘텐츠 도메인(전문 분야) 일치 권장 — 한의 콘텐츠는 한의사, 양방 콘텐츠는 의사

**통과 조건**:
- 콘텐츠 전체 사실 검증 — 효과·기간·부작용·금기 표현
- 의학 정보의 일반론 적합성 (특정 진단·치료 단정 금지)
- ComplianceRecord(C-10) `physicianApprover` + `physicianApprovedAt` 기록

**만료** — `staleFlags.medical=true`로 표기. 다음 이벤트에서 자동 설정:
- 콘텐츠 본문이 RiskRule 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경
- TreatmentPage의 `treatmentComponents[]`·`visitFlow[]`·`evidenceNotes[]` 변경 (의학 정보 영역)
- 의료진 자격·인증 변경 (DoctorProfile 검수자 자격 변동)
- 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)

### 4.2 legal (법무 자문·승인)

**검수 자격**:
- 사내 법무 또는 외부 법무법인 (변호사 자격)
- 의료광고법 자문 경력 권장

**통과 조건**:
- 의료법 제56조 광고 금지 항목 위반 부재
- 의료법 제57조 사전심의 대상 여부 판정 — ComplianceRecord(C-10) `priorReviewRequired: boolean` 기록 필수
- 사전심의 대상 판정 시 — `priorReviewSubmissionId` 기록 + 심의 통과 후 `priorReviewPassed: true` 기록
- 환자 유인 표현·치료경험담·전후사진 등 특별 항목 별도 판정
- ComplianceRecord(C-10) `legalCounsel` + `legalCounselAt` 기록
- `attachments[]` — 법무 의견서·검토 보고서 첨부 권장

**발행 차단 조건** (어드민 워크플로):
- `priorReviewRequired=true` + (`priorReviewPassed≠true` 또는 `priorReviewSubmissionId` 누락) → 발행 차단

**만료** — `staleFlags.legal=true`로 표기. 다음 이벤트에서 자동 설정:
- 의료법 개정 시 전체 재검수 (§ 7.1 의료법 개정 추적 표 갱신 시 영향받은 룰의 ComplianceRecord 일괄 stale)
- 콘텐츠 본문에서 § 4.1 카테고리 추가 매칭 발생
- 가격 정보 변경 (price·pricing field 갱신)
- ReviewPolicy(C-13) 정책 변경
- 전후사진 미디어 첨부·교체
- 법무 의견서 첨부 만료 (의견서 작성일 기준 12개월 초과 — **RL-07 해소 후 자동 판정 활성화**. v1.0에서는 어드민 워크플로에 수동 갱신 큐 기능으로 대체)

### 4.3 operator (운영자·동료 검수)

**검수 자격**:
- 어드민 계정 + Glitzy 운영팀 또는 클라이언트 측 콘텐츠 담당자

**통과 조건**:
- 톤·문체 일관성 (CONTENT_STANDARDS § 1.1)
- 페이지 타입별 슬롯 충족 (PAGE_TYPES § 2)
- warning 항목 일괄 인정 또는 정정
- ComplianceRecord(C-10) `peerReviewer` + `peerReviewedAt` 기록

**만료**: 별도 만료 없음. 운영자 검수는 본문 변경 시 자동 재진입.

### 4.4 client (클라이언트 측 승인)

**검수 자격**:
- 클라이언트 의료기관의 대표 또는 위임된 의사 결정자

**통과 조건**:
- 기관 정체성 표현·로고·의료진 노출·가격 정책의 최종 확인
- 운영 정책상 요구되는 경우만 사용 — 모든 콘텐츠에 의무 아님
- ComplianceRecord(C-10) `clientApprover` + `clientApprovedAt` 기록

**사용 시점**:
- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
- P-101 Reviews 신규 게재
- TrustMetric·Award 등 검증 가능 사실의 최초 등록

### 4.5 multi-role 조합 규칙

**전 콘텐츠 공통 필수**:
- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구

**content-gate 추가 요구**:
- `requiredApproverRoles[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "legal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용
- 모든 충족은 AND 조건 — 1개라도 누락 시 발행 차단

| ContentScope | 기본 requiredApproverRoles |
|---|---|
| `review-case` ArticleType | `["medical", "legal"]` |
| `event-price` ArticleType | `["legal"]` |
| `effect-result-related` ArticleType | `["medical"]` |
| 전후사진 노출 콘텐츠 | `["medical", "legal"]` |
| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
| 기타 High 등급 (자동 추론) | `["medical"]` |

---

## 5. inlineRiskFlags 자동 추출 — DM-05 영역

콘텐츠 본문에서 자동 추출하는 본문 위험 신호.

**저장 위치**:
- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
- compliance-assistant 빌드 시 양쪽 모두 갱신 — Article은 두 위치, 비 Article은 ComplianceRecord만

### 5.1 추출 알고리즘 (RiskRule category 기반)

각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.

| Flag | 추출 룰 |
|---|---|
| `includes-effect-claim` | RiskRule 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |
| `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
| `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
| `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠에 미디어 첨부 |
| `includes-testimonial` | RiskRule composite 매칭 — (1인칭/인용 패턴: `저는`·`환자분이`·`내원자 후기`·`치료받은`·`받은 후`·`상담받은`·`체험기`) + AND_IN_PARAGRAPH (효과 어휘: `효과`·`결과`·`변화`·`호전`·`개선`) |

### 5.1.1 카테고리 SoT

위 표의 모든 `category` 값은 `core/CONTENT_STANDARDS.md` § 4.1 표의 카테고리 칸과 일치해야 한다. 신규 카테고리 추가 시 본 § 5.1 매트릭스 동시 cascade.

### 5.1.2 컨텍스트별 false-positive 완화 정책

단어 매칭만으로 inlineRiskFlag 격상이 false-positive를 만들 수 있다. **콘텐츠 타입·필드 단위**의 정밀한 제외 규칙:

| 컨텍스트 (콘텐츠 타입·필드) | 제외 Flag | 사유 |
|---|---|---|
| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |

> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
| `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |

- 위 외 컨텍스트에서는 단일 발생만으로 격상. evidence는 항상 기록 (검수자 판단용)
- 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화

### 5.2 출력

```ts
type InlineRiskExtractionResult = {
  inlineRiskFlags: InlineRiskFlag[];
  evidence: {
    [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
  };
};
```

- 어드민 검수 UI는 `evidence`를 사용해 본문 위치를 하이라이트

### 5.3 책임

- 본 알고리즘 구현은 `compliance-assistant` Feature Module
- 본 문서는 추출 규칙의 SoT — 구현 일치 의무

---

## 6. 위험도 자동 동작 매트릭스

`RiskInferenceInput` 결과에 따라 자동 트리거되는 동작.

| 최종 등급 | 자동 동작 |
|---|---|
| Low | (특별 동작 없음) |
| Medium | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록. fail/content-gate 매칭은 룰 단위로 독립 처리 |
| High | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 진입 |

- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
- High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)

### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)

**트리거 범위** (본 문서가 운영 SoT — CONTENT_STANDARDS § 7.1.2보다 넓음):

본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
- `pageTypeId` 기본 등급 (P-101·P-102·P-104 event 등)
- `articleType` 기본 등급 (effect-result-related·review-case·event-price)
- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
- `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)
- `explicitRiskLevel` override (어드민 명시 입력)

**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).

자동 주입 finding:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },              // 콘텐츠 전체 — 메타 의미
  requiredApproverRoles: ["medical"]            // 기본값. ArticleType별 override (§ 6.2)
}
```

### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override

본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우(High 등급)**의 `requiredApproverRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 않음.

| ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
|---|---|---|
| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중복은 합집합으로 제거) |
| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |
| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
| 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |

> Medium 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 요구는 자동 적용

- 본 표는 `CONTENT_STANDARDS § 7.1.2`와 동일 SoT — 둘 중 하나 변경 시 다른 하나도 cascade. 본 문서가 운영 SoT.
- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크플로는 합집합의 모든 역할에 대해 ComplianceRecord 슬롯 기록 완료 시에만 발행 허용
- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)

---

## 7. 운영 거버넌스

### 7.1 의료법 개정 대응

#### 7.1.1 추적 대상

| 추적 항목 | 출처 | 갱신 주기 |
|---|---|---|
| 의료법 제56조 (의료광고 금지) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 제57조 (사전심의) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 시행령 제23조 등 광고 관련 조항 | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료광고 심의 운영규정 | 의료광고심의위원회 | 분기 1회 |

#### 7.1.2 추적 데이터 모델

```yaml
# data/compliance-rules/medical-law-tracking.yaml
revisions:
  - revisionId: "2026-Q1"                          # 분기 또는 개정 일자 기반 식별자
    lawSource: "의료법"                              # 의료법·시행령·심의 운영규정
    affectedArticles: ["제56조 제1항 제5호"]        # 개정 조문
    revisionEffectiveDate: "2026-03-01"             # 시행일
    revisionType: "amendment"                       # amendment | reaffirmation | new
    sourceUrl: "https://www.law.go.kr/..."           # 국가법령정보센터 URL
    checkedAt: "2026-05-14T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds:                                # 본 개정으로 영향받은 RiskRule ID
      - "supremacy-001"
      - "guarantee-composite-001"
    staleScope:                                     # stale 처리 범위
      kind: "all"                                   # all | rule-matched | content-type
      contentTypes: []                              # kind="content-type"일 때만
    summary: "의료광고 사전심의 매체 범위 확대 — 자사 웹사이트 미디어 포함"
```

#### 7.1.3 개정 시 절차

1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
2. `rules.medical-ad.yaml` 룰 추가·갱신 (`version` MAJOR)
3. `meta.yaml`의 `medicalLawRevisionRef` 갱신
4. `medical-law-tracking.yaml`에 revision 항목 추가
5. `staleScope.kind`별 영향 콘텐츠 결정:
   - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
   - `kind="rule-matched"` — `affectedRuleIds[]`에 해당하는 룰을 매칭한 콘텐츠의 ComplianceRecord만 stale
   - `kind="content-type"` — `staleScope.contentTypes[]`에 속하는 contentType의 ComplianceRecord 일괄 stale
   - 모든 경우 `triggeredBy="medical-law-revision-<revisionId>"` 설정
6. 어드민 워크플로가 재검수 큐를 처리 — 통과 시 stale 해제

### 7.2 룰 충돌·중복 발견 시

- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
- 운영 누적으로 false-positive 발견 시 `contextExceptions[]` 또는 `exceptions[]` 추가 — PATCH 버전
- false-negative 발견 시 룰 추가 — MAJOR(fail 룰) 또는 MINOR(warning/content-gate)

### 7.3 RiskRule 변경 워크플로

```
1. 변경 제안 (PR) — 변경 사유·근거 의료법 조문·테스트 케이스 첨부
2. 자체 룰 checker 회귀 테스트 — 기존 콘텐츠 위반 가능 케이스 검출
3. 의료법 자문 — fail 룰 추가·강화 시 필수
4. 머지 + 인스턴스 재빌드 — 위반 콘텐츠 검출 시 ComplianceRecord 재진입
```

---

## 8. 빌드 검증 — 룰 레벨 정합 (CONTENT_STANDARDS § 8 동일 패턴)

| 레벨 | 본 문서 영역 적용 |
|---|---|
| **fail** | RiskRule 파일 JSON Schema 검증 실패, RiskLevel enum 위반, ApproverRole 매핑 누락 |
| **warning** | `sourceDoc` 경로 위반, RiskRule 만료 임박 (의료법 개정 6개월 이상 미반영 등) |
| **content-gate** | (본 문서는 메타 정의 영역이라 content-gate 직접 적용 없음. 실제 본문 검수 룰은 RiskRule이 발산) |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| RL-03 | medical 검수자 도메인 자격 매칭 자동 검증 (한의 콘텐츠 → 한의사) | 어드민 워크플로 명세 시 |
| RL-04 | legal 검수의 외부 법무법인 vs 사내 법무 구분 데이터 모델 | DATA_MODEL 후속 사이클 |
| RL-05 | `clientApprover` 위임 권한 데이터 모델 (대표 vs 위임자) | 운영 정책 결정 |
| RL-06 | inlineRiskFlag 추출 알고리즘의 정확도 운영 지표 (precision/recall) 측정·운영 | M2+ 운영 누적 후 |
| RL-07 | `attachments[].metadata.expiresAt` 데이터 모델 — DATA_MODEL Attachment 확장 | DATA_MODEL 후속 사이클 |

### 9.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~RL-01~~ | `rules.preset-<presetSlug>.yaml`의 preset slug 카탈로그 결정 | v1.0 — preset 파일명 규약 `rules.preset-<presetSlug>.yaml` 고정. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case (예: `hanui-clinic`). 실제 preset 카탈로그는 `presets/` 추가 시 자연 확장 |
| ~~RL-02~~ | `overrides[]` 섹션의 정확한 머지 알고리즘 | v0.2 — § 3.4.2 명세. 스칼라/객체/배열별 머지 규칙 + 동일 targetRuleId 카탈로그 1개 제약 명시 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 RiskInferenceResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |
| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |


codex
초기 대조에서 plan 본문은 cycle 1 패치 대부분을 명시적으로 반영했습니다. 지금은 출력 타입·LegalDocument 면제·C0016/trigger 같은 세부 모순 가능성이 있는 지점만 추가로 좁혀서 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/core/CONTENT_STANDARDS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/ADMIN_UI_SKELETON_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 731ms:
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


 succeeded in 767ms:
# E-A-T Content 확장 plan (v1.0·acceptance·2026-05-18)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **6 cycle 36 findings 전건 수용** · cycle 6 closeableAfterPatch=true 확정. 수렴 추세 **22 → 8 → 3 → 2 → 1 → 0**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.

> **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.

본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:

| Entity | 신규 vs 합류 | DATA_MODEL ID |
|---|---|---|
| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |

모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.

> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).

## SoT

- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
- `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
- `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
  - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
  - `apps/web/src/lib/json-ld/{entities, builders}.ts` (JSON-LD generator)
  - `apps/web/src/lib/json-ld/__tests__/validate.ts` (cross-page allowlist + tenant base path)
  - `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` (현재 fallback `general` 만 — 본 plan 합류 후 DB join)

## 1. 목적과 범위

### 1.1 목적

- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
- **운영자 입력 UX 표준화** — M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용.
- **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.

### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정

| 항목 | 비고 |
|---|---|
| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
| C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
| 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
| Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
| PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
| DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
| authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |

## 2. 데이터 모델 결정

### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정

DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):

```sql
-- packages/core-content/migrations/C0009_article_category.sql

CREATE TABLE article_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
  cover_image_url TEXT,                          -- v0.1 nullable
  seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
  display_order INTEGER NOT NULL DEFAULT 0,
  article_type_default TEXT,                     -- v0.1 nullable
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
  CONSTRAINT article_category_description_length CHECK (description IS NULL OR length(description) BETWEEN 80 AND 200),
  CONSTRAINT article_category_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~ '^https?://'),
  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX article_category_instance_idx ON article_category (instance_id);
CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
  WHERE parent_category_id IS NOT NULL;

ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON article_category FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
- (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).

### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정

```sql
-- packages/core-content/migrations/C0013_article_category_fk.sql

-- (1) ADD COLUMN nullable
ALTER TABLE article ADD COLUMN category_id UUID;

-- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
INSERT INTO article_category (instance_id, slug, name, display_order)
SELECT i.id, 'general', '일반', 0
FROM instance i
WHERE NOT EXISTS (
  SELECT 1 FROM article_category ac
  WHERE ac.instance_id = i.id AND ac.slug = 'general'
);

-- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
UPDATE article a
SET category_id = ac.id
FROM article_category ac
WHERE a.instance_id = ac.instance_id
  AND ac.slug = 'general'
  AND a.category_id IS NULL;

-- (4) SET NOT NULL
ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;

-- (5) composite FK (same-tenant)
ALTER TABLE article ADD CONSTRAINT article_category_fk
  FOREIGN KEY (instance_id, category_id)
  REFERENCES article_category (instance_id, id)
  ON DELETE NO ACTION;

CREATE INDEX article_category_idx ON article (instance_id, category_id);
```

**결정**:
- (EC-SCHEMA-06) staged migration 안 4 단계 모두 단일 migration 으로 처리. acceptance commit 안 backfill 완성.
- (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.

### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)

```sql
-- packages/core-content/migrations/C0010_publication.sql

CREATE TABLE publication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
  journal TEXT,
  published_date DATE NOT NULL,                  -- 학술지 게재일
  doi TEXT,
  pubmed_id TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  summary TEXT NOT NULL,
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT publication_doi_format CHECK (doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'),
  CONSTRAINT publication_pubmed_id_format CHECK (pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'),
  CONSTRAINT publication_authors_array CHECK (jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1),
  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX publication_instance_idx ON publication (instance_id);
CREATE INDEX publication_status_idx ON publication (instance_id, status);
CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON publication FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.

### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합

```sql
-- packages/core-content/migrations/C0011_media_appearance.sql

CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');

CREATE TABLE media_appearance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_type media_channel_type NOT NULL,
  published_date DATE NOT NULL,
  duration_seconds INTEGER,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  summary TEXT NOT NULL,
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT media_appearance_duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON media_appearance FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).

### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)

```sql
-- packages/core-content/migrations/C0012_faq.sql

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
  related_condition_id UUID,                     -- v0.1 nullable
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
    REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
);

CREATE INDEX faq_instance_idx ON faq (instance_id);
CREATE INDEX faq_status_idx ON faq (instance_id, status);
CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  WHERE category_id IS NOT NULL;

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).

### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정

```sql
-- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)

-- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
--   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
--   D0011 의 published-only 패턴과 다른 의도 — 본 plan 의 명시적 결정.
GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;

CREATE POLICY public_reader_article_category_select
  ON article_category FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_publication_select
  ON publication FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY public_reader_media_appearance_select
  ON media_appearance FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
--   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
CREATE POLICY public_reader_faq_select
  ON faq FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );
```

**결정**:
- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.

## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정

DATA_MODEL § 4 C-10 `contentType` enum 확장:

| 현 v0.5 (15종) | v0.6 신규 (+2종 = 17종) |
|---|---|
| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |

**결정**:
- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.

## 4. 어드민 폼 결정

### 4.1 4 entity CRUD 구조 (EC-FORM-01)

| Entity | route prefix |
|---|---|
| ArticleCategory | `/admin/<slug>/categories` |
| Publication | `/admin/<slug>/publications` |
| MediaAppearance | `/admin/<slug>/media-appearances` |
| Faq | `/admin/<slug>/faqs` |

### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)

v0.1 단계 4 entity 어드민 폼 schema 에 명시:
```typescript
const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
```
- form select 드롭다운 미노출 (단일 상태). server action 에서도 `status: 'draft'` 강제.
- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.

### 4.3 zod schema 통합 SoT (EC-FORM-03)

`apps/web/src/lib/eat-content-schema.ts` 신설:
- **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
- **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
- **Faq**: question (10~200) · answer (50~2000) · displayOrder int · categoryId UUID? · authorDoctorId? · relatedTreatmentId? · status `z.enum(['draft'])`
- **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.

### 4.4 server action 패턴 (EC-FORM-04)

각 entity 별 `actions.ts`:
- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
- `deleteX(instanceSlug, slug)` — `content-deleted`.
- isNextControlFlowError rethrow · mapDbErrorToResult · revalidatePath 패턴.

### 4.5 dashboard cascade (EC-FORM-05)

`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.

## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정

### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소

`apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
- 표시: Q&A 카드 list. ORDER BY display_order ASC, id ASC. `<details>` collapsible.
- **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
- Breadcrumb 추가.
- Next metadata title: "자주 묻는 질문 | <clinic.name>".

### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정

Doctor Profile 페이지 안 inline section:
- **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
- **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.

**JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
- **fragment-scoped `@id`**:
  - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
  - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
- Physician.subjectOf 에 fragment ref array 출력 (graph 안 entity 들과 cross-ref).
- cross-page allowlist 미사용 — 모든 ref 가 graph 안 entity 또는 외부 dereferenceable URL (publication.url / media.url).

### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정

About 페이지 안 inline section:
- **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
- **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.

**JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
- About 페이지 graph 안에 풀 entity 출력 — `MedicalClinic.subjectOf` array (publication·media). Organization.subjectOf 미사용 (단일 결정).
- fragment-scoped `@id`:
  - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
  - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`

### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정

`apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` patch:
- 현재 SQL: `SELECT ... FROM article WHERE slug = ${params.slug}` + `params.category !== "general"` 시 notFound
- patch 후 SQL: 
  ```sql
  SELECT a.*, ac.slug AS category_slug
    FROM article a
    JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
   WHERE a.slug = ${params.slug}
     AND ac.slug = ${params.category}
   LIMIT 1
  ```
- 매칭 0 행 → notFound. params.category 가 article 의 실 category 와 일치해야 200.
- sitemap.xml 안 article URL 생성 시 article + article_category join → `/insights/${category.slug}/${article.slug}` 출력 (현 `general` 하드코딩 → 실 category slug).

### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정

`apps/web/src/lib/markdown.ts` 확장:
- `renderMarkdownToHtml(markdown, hostOrigin)` — 기존 (sanitize-html · PSR-COMP-09 정합).
- **신규 `renderMarkdownToPlainText(markdown)`** — Markdown → plain text strip (heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal). JSON-LD `Answer.text` 용.
- FAQ rendering 분기:
  - public page (HTML): `renderMarkdownToHtml(answer, hostOrigin)`
  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`

### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정

- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
- lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
- Article URL: 실 category slug 사용 (EC-RENDER-04 정합).

### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정

Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).

## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)

### 6.1 ScholarlyArticle entity (Publication)

```json
{
  "@type": "ScholarlyArticle",
  "@id": "{pageBaseUrl}#publication-{slug}",      // fragment-scoped (Doctor/About page 안)
  "headline": "<title>",
  "author": [{ "@type": "Person", "name": "<author>" }, ...],
  "datePublished": "<publishedDate>",
  "isPartOf": { "@type": "Periodical", "name": "<journal>" },
  "identifier": [
    { "@type": "PropertyValue", "propertyID": "DOI", "value": "<doi>" },
    { "@type": "PropertyValue", "propertyID": "PubMedID", "value": "<pubmedId>" }
  ],
  "url": "<url>",                                 // 외부 URL (dereferenceable)
  "description": "<summary>",
  "image": "<thumbnailUrl>",
  "publisher": { "@id": "{siteBaseUrl}/#organization" }
}
```

### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)

```json
{
  "@type": "VideoObject",
  "@id": "{pageBaseUrl}#video-{slug}",            // fragment-scoped · 모든 channel_type 동일
  "name": "<title>",
  "description": "<summary>",
  "uploadDate": "<publishedDate>",
  "duration": "PT<durationSeconds>S",
  "thumbnailUrl": "<thumbnailUrl>",
  "contentUrl": "<url>",
  "publisher": { "@type": "Organization", "name": "<channelName>" }
}
```

**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).

### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합

```json
{
  "@type": "FAQPage",
  "@id": "{siteBaseUrl}/faq#faqpage",
  "inLanguage": "ko-KR",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<faq.question>",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<renderMarkdownToPlainText(faq.answer)>"
      }
    },
    ...
  ]
}
```

### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)

| 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
|---|---|
| P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
| P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |

**결정**:
- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
- (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
- (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.

## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)

`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
|---|---|---|---|---|
| `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |

**결정**:
- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
- (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.

## 8. 환경·precondition

- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
- `packages/core-content/migrations/C0009_article_category.sql` (신규)
- `packages/core-content/migrations/C0010_publication.sql` (신규)
- `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
- `packages/core-content/migrations/C0012_faq.sql` (신규)
- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
- `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
- `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
  - 10 (현재): D0010 instance · C0001~C0008 (article 등 8) · D0011 public_reader
  - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
  - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).

## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
| 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
| 29 | article.category_id 다른 카테고리 row · URL `/insights/wrong-category/<slug>` → 404 | category.slug 매칭 검증 |
| 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
| 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
| 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
| 33 | Article 의 SQL JOIN article_category — category 미존재 (instance 안 row 없음) → 404 | category lookup 0 row → notFound |
| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
| 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
| 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |

## 10. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
| 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
| 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
| 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
| 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
| 7 | Drizzle schema 확장 — packages/core-content/src/schema.ts v0.4 | 4 신규 table + article.category_id |
| 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
| 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
| 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
| 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
| 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
| 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
| 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
| 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
| 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
| 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
| 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
| 25 | vitest scenario 24~36 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts + markdown.test.ts |
| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |

## 11. M0 v1.0 cascade markers (defer 정리)

### 11.1 별 cycle 합류
- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.

### 11.2 M1 Phase Alpha 합류
- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
- `EC-DEFER-06`: FAQ 다국어.
- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).

### 11.3 compliance-assistant Feature 합류
- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.

## 12. Cascade markers (다른 SoT 문서로 전파)

- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
  - § 4 C-24 Publication 풀명세 신규.
  - § 4 C-25 MediaAppearance 풀명세 신규.
  - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-18 | **v1.0** | **Codex 비평 cycle 6 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 22 → 8 → 3 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 6 cycle 36 findings 전건 수용. acceptance commit 9 cascade docs 동시 포함 (EC-CASCADE-01·02·03·04·06·07·08·09 + plan 본문). EC-CASCADE-05 (D0014 마이그레이션 실 SQL) 는 EAT_CONTENT code v1.0 cycle 분리. |
| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |


 succeeded in 779ms:
# apps/web admin UI skeleton plan (v1.0·acceptance·2026-05-15)

> **상태**: **v1.0** — codex 자동 비평 11 cycle 후 `ready_for_acceptance=true` 확정. cycle11 finding 0건. blocking 0·major 0·minor 0·nit 0. **107 findings 전건 처리 완료**. scope_narrow_acceptable=true.

본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.

> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).

> **package 버전 vs plan 버전 표기 (ADMIN-UI-44)**: 본 plan의 "v0.x" 는 plan 문서의 cycle 번호다. 의존 packages 의 실제 npm version 은 모두 `0.1.0`.

> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.

> **A-03 결정의 scope (ADMIN-UI-67)**: A-03 close (= packages/auth 자체 핸들러) 는 **skeleton-local 결정**. 상위 SoT (`INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 · `PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E) 가 여전히 next-auth/Auth.js 를 권위 있는 전제로 둔다. 두 문서의 reversal cascade 는 본 plan acceptance 후 별도 사이클로 진행 (acceptance precondition 아닌 follow-up cascade).

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
- `docs/ARCHITECTURE.md` § 10 (전체 위상 reference)
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 (9 states · 14 actions · multi-role AND gate)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1 (6 core tables · cycle2 schema)
- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Single DB + RLS · Provider · Storage = R2)
- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v1.0 (Spike A/B/C/D/E LOCAL_PASS 패턴)
- 기존 packages 실 시그니처 (cycle2 직접 확인):
  - `packages/auth/src/errors.ts` `AuthDenyReason` 17 reasons (§ 5.4 SoT)
  - `packages/auth/src/magic-link.ts` `consumeMagicLink(sql, identifier, tokenPlain) → identifier` (userId 아님)
  - `packages/auth/src/session.ts` `createSession(sql, cfg, userId)`
  - `packages/auth/src/resolve-tenant-context.ts` `TenantContext.instanceId: string` (plain)
  - `packages/db/src/service-role.ts` `withServiceRole(sql, ctx, allowedFunctions, fn) — ServiceRoleContext { function, actorUserId: AdminUserId (필수), instanceId?, reason }` + audit_log 자동 pending/outcome
  - `packages/db/src/tenant.ts` `withTenantTransaction(sql, { instanceId: InstanceId }, fn)` + `SET LOCAL ROLE app_tenant_user`
  - `packages/shared-types/src/index.ts` `ServiceRoleFunction` enum (slugResolver 없음 — cascade marker)
  - `apps/spike-e/migrations/004_audit_event.sql` audit_event 컬럼 = `occurred_at` (created_at 아님) · GRANT INSERT TO app_tenant_user 없음
  - `packages/core-content/migrations/C0001_clinic_profile.sql` `GRANT SELECT,INSERT,UPDATE,DELETE ON clinic_profile TO app_tenant_user` + `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` (cycle8 정정 ADMIN-UI-102 — NULLIF 패턴은 unset context 의 silent deny 를 보장하며 § 8.1 시나리오의 fail-closed 전제)

## 1. 목적과 walking skeleton 정의

### 1.1 목적

- Vertical Slice (M0 v1.0) 본 구현 진입 전에 **전구간 wiring을 한 번에 검증**한다.
- 검증할 전구간: Next.js App Router → packages/auth magic-link · resolveTenantContext → packages/db withTenantTransaction · RLS → packages/core-content 6 tables · Drizzle → Server Action 결과 → 다시 렌더링.

### 1.2 walking skeleton 범위 (포함)

| 화면/엔드포인트 | 책임 | 출력 |
|---|---|---|
| `/sign-in` | 이메일 입력 → magic-link 발급 (mock mailbox 적재). 토큰 URL 클릭 → 세션 발급 · 쿠키 set | session cookie |
| `/sign-in/consume?identifier=<email>&token=…` | magic-link 소비 (identifier + token 둘 다 필요) + **admin_user lookup/active check** (allowlist 만 — 자동 INSERT 없음 · ADMIN-UI-75) + first active operator membership 검증 + createSession + cookie set | redirect to `/[instanceSlug]` |
| `/sign-out` | revokeSession + cookie clear | redirect to `/sign-in` |
| `/[instanceSlug]` 대시보드 | slug resolve · tenant resolve · ClinicProfile 존재 여부 | 단순 표시 |
| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |

### 1.3 walking skeleton 비범위 (deferred)

> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.

| 항목 | Defer to |
|---|---|
| DoctorProfile · TreatmentPage · Article 폼 (3 화면) | M0 v1.0 Phase 0 Week 4 본 구현 |
| 미리보기 · 발행 화면 + Git commit/push/CI | M0 v1.0 + apps/worker |
| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
| ComplianceRecord 폼 · 위험도 분류 | M0 v0.2 (schema) + M0 v1.0 (UI) |
| Markdown 에디터 (A-06·A-08) | M0 v1.0 Article 화면 |
| Super-admin instance switch route + UI | M0 v1.0 또는 M2 |
| ClinicProfile editable slug + instance 당 1개 보장 unique index | M0 v1.0 + core-content schema v0.3 |
| Optimistic concurrency · 버전 컬럼 | M0 v1.0 또는 M2 |
| RBAC 외부 사용자 초대 · 멀티 인스턴스 대시보드 | M2 Phase Beta |
| Tiptap / Lexical 에디터 | M2 Phase Beta |
| DESIGN_TOKENS v1.0 integration | M1+ |

## 2. 기술 스택 결정 (admin/ARCHITECTURE § 10 미결정 항목 close)

| ID | 항목 | 결정 |
|---|---|---|
| **A-01** | 어드민 기술 스택 | Next.js 14 App Router + React Server Components + Server Actions |
| **A-02** | 어드민 DB | PostgreSQL (Single DB + RLS · INFRA v1.0 § 4.1 정합) |
| **A-03** | 인증 시스템 | packages/auth 자체 magic-link + HMAC signed session cookie (next-auth 도입 X) |
| **A-06** · **A-08** | 에디터 | walking skeleton 범위 외 — M0 v1.0 Article 화면에서 결정 |

UI 토대: Tailwind CSS v4 + shadcn/ui (6 컴포넌트) + zod + postgres.

> **Implementation drift marker (코드 cycle1 WEB-17·18)**: walking skeleton 구현 단계에서 (a) Tailwind v3.4 로 임시 사용 (v4 PostCSS 통합 안정화 후 migration cascade marker) · (b) shadcn/ui 6 컴포넌트 도입 대신 native input + Tailwind inline alert 로 단순화 (Toast 도입은 M0 v1.0 본 구현 또는 M1 합류). 두 drift 는 Plan 본 결정 변경 아닌 구현 단계 잠정 결정 — 후속 cascade.

> **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.

> **Image upload cascade marker** (사용자 피드백): ClinicProfile logo / og:image 직접 파일 업로드는 별도 cascade — packages/storage R2 통합 (INFRA v1.0 결정 · Spike C LOCAL_PASS 패턴 차용) + multipart Server Action + signed URL 발급 + EXIF/PII scrub. M0 v1.0 본 구현 또는 별도 onboarding-assistant Feature spec.

> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.

**제거**: `next-auth`, `@auth/drizzle-adapter`.

## 3. 디렉토리 구조 (apps/web)

```
apps/web/
├── package.json
├── tsconfig.json
├── next.config.mjs                   — serverActions.bodySizeLimit 명시 (§ 9 ADMIN-UI-39)
├── postcss.config.mjs
├── tailwind.config.ts
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  — / → /sign-in 또는 firstActiveMembership.instanceSlug redirect
│   │   ├── sign-in/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts            — issueMagicLink server action + skeleton-layer audit_event emit
│   │   │   └── consume/
│   │   │       └── route.ts          — GET /sign-in/consume?identifier=&token= · § 3.2 flow
│   │   ├── sign-out/
│   │   │   └── route.ts              — POST · revokeSession + cookie clear + audit_event emit
│   │   ├── (admin)/
│   │   │   ├── layout.tsx            — auth guard (cookie read · 미존재 시 redirect)
│   │   │   └── [instanceSlug]/
│   │   │       ├── page.tsx          — 대시보드 (slug resolve · tenant resolve · ClinicProfile 존재 표시)
│   │   │       └── clinic-profile/
│   │   │           ├── page.tsx      — server component (현재 값 SELECT)
│   │   │           └── actions.ts    — saveClinicProfile (bound action — § 6.2 ADMIN-UI-31)
│   │   └── api/
│   │       └── health/route.ts       — DB ping
│   ├── lib/
│   │   ├── env.ts                    — zod 검증 · AuthConfig 생성
│   │   ├── db.ts                     — postgres.Sql singleton (base role · audit emission에 사용)
│   │   ├── session-cookie.ts         — read/set/clear (§ 5.1)
│   │   ├── tenant.ts                 — getRequestTenantContext + withSkeletonTx 2단계 패턴 + asUuidV4 변환 (§ 5.3)
│   │   ├── slug-resolver.ts          — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 5.2)
│   │   ├── post-login-redirect.ts    — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 3.2)
│   │   ├── deny-reason-map.ts        — AuthDenyReason 17 reasons exhaustive UI mapping (§ 5.4)
│   │   └── errors.ts                 — DB CHECK / unique violation → fieldErrors
│   ├── components/
│   │   ├── ui/                       — shadcn/ui (Button · Input · Textarea · Label · Form · Toast)
│   │   ├── dev/
│   │   │   └── MockMailbox.tsx       — server-side 3중 가드
│   │   └── forms/
│   │       └── ClinicProfileForm.tsx — client component · form state · bound action
│   └── styles/
│       └── globals.css
├── src/seed.ts                       — bootstrap + system actor (§ 7.1 ADMIN-UI-29)
└── README.md
```

### 3.1 라우트 흐름

```
/                                                — cookie 없으면 /sign-in · 있으면 firstActiveMembershipSlug
/sign-in                                         — 이메일 입력 form (Server Action)
/sign-in/consume?identifier=&token               — GET Route Handler · § 3.2
/sign-out                                        — POST Route Handler
/[instanceSlug]                                  — 대시보드
/[instanceSlug]/clinic-profile                   — 폼
/api/health                                      — DB ping
```

### 3.2 인증 흐름 시퀀스 (cycle2 정정 ADMIN-UI-32·33)

```
1. user → POST /sign-in (email)
   → server action (action 시그니처 = (prev, formData)):
     • emailNormalized = normalizeIdentifier(formData.get('email'))
     • **allowlist 체크 (cycle5 정정 ADMIN-UI-75 — self-provision 방지)**:
       SELECT 1 FROM admin_user WHERE email = emailNormalized AND active = true LIMIT 1
       → 없으면 emitAuditEvent('magic-link-issue-denied', payload:{ identifier, reason:'not-allowlisted' })
         + UI 응답 generic "확인용 메일을 발송했습니다" (enumeration 방지) — 실제로는 메일 발송 안 함
       → 있으면 진행
     • issueMagicLink(sqlBase, cfg, emailNormalized) → mock mailbox 적재
     • emitAuditEvent(sqlBase, { eventType:'magic-link-issued', payload:{ identifier: emailNormalized }})
       (packages/auth.issueMagicLink 내부에 emit 없음 — packages/auth v0.3 cascade)

2. user → GET /sign-in/consume?identifier=<email>&token=<raw>
   → Route Handler (NextResponse 반환 — cookie set OK):
     • zod 검증: identifier(email) + token(string min 16)
     • try { normalizedIdentifier = await consumeMagicLink(sqlBase, identifier, token) }
       catch (AuthDeniedError e) → emit 'magic-link-rejected' + reason → redirect /sign-in?reason=<r>
     • admin_user lookup (ADMIN-UI-75 — 자동 INSERT 제거 · seed allowlist 만 허용):
       SELECT id, display_name, active FROM admin_user WHERE email = normalizedIdentifier
       • 없음 또는 inactive → emitAuditEvent('user-not-allowlisted-on-consume', payload:{ identifier }) → redirect /sign-in?reason=user-inactive
     • **cycle5 정정 (ADMIN-UI-76·84) — session 발급 전 membership 검증**:
       SELECT i.slug FROM instance_membership m JOIN instance i ON i.id = m.instance_id
        WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
        ORDER BY m.created_at LIMIT 1
       • 없으면 emitAuditEvent(sqlBase, { eventType:'first-active-membership-missing', actorUserId:userId, payload:{ identifier }})
         → redirect /sign-in?reason=no-active-membership (session 미발급 · cookie 미설정)
       • 있으면 firstSlug = row.slug
     • createSession(sqlBase, cfg, userId) → signedToken (membership 검증 통과 후에만)
     • emitAuditEvent(sqlBase, { eventType:'magic-link-consumed', actorUserId:userId, payload:{ identifier }})
     • emitAuditEvent(sqlBase, { eventType:'session-created', actorUserId:userId })
     • emitAuditEvent(sqlBase, { eventType:'first-active-membership-resolved', actorUserId:userId, targetUserId:userId, payload:{ slug: firstSlug }})  // cycle6 ADMIN-UI-89: matrix 와 일치하도록 targetUserId 추가
     • res.cookies.set('glitzy_session', signedToken, { httpOnly, secure, sameSite:'lax', maxAge:sessionTtlSeconds, path:'/' })
     • redirect to /{firstSlug}

3. user → GET /[instanceSlug]/*
   → page server-side (cycle5 정정 ADMIN-UI-77·81 — sqlBase 직접 · withServiceRole 미사용):
     • signedToken = readSessionCookie() · 없으면 /sign-in redirect
     • session = await getActiveSession(sqlBase, cfg, signedToken)  // userId 추출 (slug audit 필요)
     • instanceId = await slugResolver(sqlBase, slug, session.userId as AdminUserId)
       • 없으면 notFound() (audit_event 'slug-lookup-not-found' 자동 emit · § 5.2)
     • ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId)
       — 실패 시 deny-reason-map.ts 으로 분기 (cookie clear · 403 · 안내)

4. saveClinicProfile mutation Server Action (bound):
   → withSkeletonTx({ ctx, fn }) = withTenantTransaction(sqlBase, { instanceId: asUuidV4(ctx.instanceId) as InstanceId })
     • SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id (packages/db)
     • assertActionEligibility(ctx, 'operator-edit-content')
     • UPSERT clinic_profile (instance_id = ctx.instanceId 강제)
   → tx commit 후 (tenant role 밖, sqlBase = base role):
     • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
                                  payload:{ contentType:'ClinicProfile', slug:'clinic', updatedAtBefore, updatedAtAfter }})
     (tx 안에서 audit_event INSERT 가능하게 GRANT 추가하는 안 대신 commit 후 base-role emit — ADMIN-UI-36)

5. user → POST /sign-out (ADMIN-UI-51 — actorUserId 필요로 getActiveSession 먼저)
   → try {
       session = await getActiveSession(sqlBase, cfg, signedToken)     // userId 추출
       await revokeSession(sqlBase, cfg, signedToken)                  // DB row DELETE
       await emitAuditEvent(sqlBase, { eventType:'session-revoked', actorUserId: session.userId })
     } catch (AuthDeniedError e) {
       // tampered / expired cookie sign-out: actorUserId 알 수 없음
       await emitAuditEvent(sqlBase, { eventType:'session-revoked-anonymous', payload:{ reason: e.reason }})
     }
   → cookies.delete('glitzy_session') · redirect /sign-in
```

## 4. packages 의존성

```jsonc
{
  "name": "@glitzy/web",
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
    "zod": "^3.23.x"
  }
}
```

`@glitzy/*` 모두 package version `0.1.0`. plan에서 "API shape after cycle$N patch" 라고 부르는 부분은 § SoT 의 cascade marker 가 적용된 후의 시그니처.

## 5. 인증 · 세션 · tenant resolve 통합 명세

### 5.1 cookie 명세 (cycle2 정정 ADMIN-UI-37·38)

| 항목 | 값 |
|---|---|
| 이름 | `glitzy_session` |
| 값 | HMAC signed token (packages/auth) |
| 속성 | `HttpOnly` · `Secure` (prod) · `SameSite=Lax` · `Path=/` · `Max-Age = sessionTtlSeconds` |
| 발급 | `/sign-in/consume` Route Handler 의 NextResponse |
| 폐기 | `/sign-out` Route Handler |
| **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |

`lib/session-cookie.ts` 는 read/set/clear 만 노출 (sync helper 제거).

### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)

URL `[instanceSlug]` → `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` (cycle9 정정 ADMIN-UI-105 — actorUserId 필수). **sqlBase 직접 SELECT** (withServiceRole 미사용 — instance scope 없는 control-plane lookup):

```typescript
// lib/slug-resolver.ts
import { asUuidV4, type InstanceId, type AdminUserId } from "@glitzy/shared-types";
import { emitAuditEvent } from "@glitzy/auth";

export async function slugResolver(
  sqlBase: postgres.Sql,
  slug: string,
  actorUserId: AdminUserId,
): Promise<InstanceId | null> {
  // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
  const rows = await sqlBase<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1`;
  if (rows.length === 0) {
    await emitAuditEvent(sqlBase, {
      eventType: "slug-lookup-not-found",
      actorUserId,
      reason: "instance-slug-not-found-or-inactive",
      payload: { slug },
    });
    return null;
  }
  return asUuidV4(rows[0].id) as InstanceId;
}
```

`ServiceRoleFunction` enum 신규 추가 (slugResolver · firstActiveMembershipResolver · adminUserUpsert) **precondition 제거**. M0 v1.0 instance-scoped service-role 작업 (예: contentMigrationApplier) 도입 시점에 enum 추가.

**actorUserId 처리**: slug resolve 는 인증된 사용자 요청 안에서 호출. cookie 없는 first hit 은 `/sign-in` redirect 우선.

**Super-admin (ADMIN-UI-17)**: skeleton 은 operator membership 만 지원. super-admin 진입 시 `super-admin-required` throw → deny-reason-map 안내 페이지.

### 5.3 tenant context · transaction 2단계 패턴 (cycle2 정정 ADMIN-UI-30)

```typescript
// lib/tenant.ts
import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
import { asUuidV4, type InstanceId } from "@glitzy/shared-types";

export async function withSkeletonTx<T>(
  args: { signedToken: string; instanceId: InstanceId },
  fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
): Promise<T> {
  const sql = getSqlBase();
  const cfg = getAuthCfg();
  // ctx.instanceId 는 plain string — branded InstanceId 로 변환 (ADMIN-UI-30)
  const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
  const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
}
```

`packages/auth.withResolvedTenantTransaction` 자체에 `SET LOCAL ROLE app_tenant_user` 가 없음 (ADMIN-UI-04) → packages/auth v0.3 cascade marker (resolve + withTenantTransaction 합성 패치). skeleton 은 자체 wrapper 로 우회.

### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)

> **두 taxonomy 분리 명시 (ADMIN-UI-45)**:
> - **UI deny reason** = `AuthDenyReason` union 17종 (packages/auth/src/errors.ts L6-L23). UI mapping/HTTP status/사용자 표시는 이 union 에 한정.
> - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).

> **sign-in page query reason union 별도 정의 (ADMIN-UI-55)**:
> ```typescript
> type SignInReason =
>   | AuthDenyReason  // 17 reasons
>   | 'no-active-membership'   // postLoginRedirect → membership 없음
>   | 'magic-link-rejected'    // consume 실패 reason 묶음 (magic-link-* 4종 별도 분기 안 할 때)
> ```
> `/sign-in?reason=<r>` 의 `r` 은 `SignInReason` 으로 검증. 미매핑 reason 은 generic 메시지로 fallback.

`AuthDenyReason` union 의 **실제 17 reasons** (packages/auth/src/errors.ts L6-L23) 기준 exhaustive 매핑. `assertNever` 로 build-time enforce.

| reason | UI 동작 |
|---|---|
| `session-not-found` · `session-expired` · `session-signature-invalid` | cookie clear · `/sign-in?reason=<r>` |
| `user-inactive` | cookie clear · `/sign-in?reason=user-inactive` |
| `invalid-instance-id` | 404 (페이지를 찾을 수 없습니다) |
| `membership-not-found` | 403 (이 인스턴스에 접근 권한 없음) |
| `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
| `instance-mismatch` · `super-admin-required` | 안내 페이지 (skeleton 범위 외) |
| `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
| `operator-role-required` | 403 (운영자 권한 필요) |
| `magic-link-expired` · `magic-link-consumed` · `magic-link-not-found` · `magic-link-invalid` | `/sign-in?reason=<r>` + emitAuditEvent `magic-link-rejected` |

`assertNever` exhaustive 체크 → union 확장 시 컴파일 fail (게이트 #9).

### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)

**audit_event 단일 SoT 포기** (ADMIN-UI-26). 두 테이블 병존:

| 테이블 | 컬럼 | 작성 경로 |
|---|---|---|
| `audit_event` | `id, event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload, occurred_at` (ADMIN-UI-25 — `occurred_at` 사용) | packages/auth.emitAuditEvent · base role connection (tx 밖) |
| `audit_log` | `id, instance_id, actor_id, actor_role, action, metadata, ...` | packages/db.withServiceRole 자동 (pending → outcome) |

**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).

대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).

**walking skeleton event 매트릭스**:

| eventType | 테이블 | emit 위치 |
|---|---|---|
| `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
| `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
| `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
| `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
| `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
| `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
| `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
| `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
| `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
| `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
| `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |
| `slug-lookup-not-found` | audit_event | `slugResolver` (sqlBase 직접 SELECT 후 null 시 emit · ADMIN-UI-54·63·69) |
| ~~`admin-user-upserted`~~ (cycle5 제거 ADMIN-UI-75) | — | self-provision 방지 — consume route 자동 INSERT 제거 |
| `user-not-allowlisted-on-consume` (cycle5 신규 ADMIN-UI-75) | audit_event | consume route — allowlist 미존재 사용자 시도 |
| `magic-link-issue-denied` (cycle5 신규 ADMIN-UI-75) | audit_event | /sign-in Server Action — allowlist 미존재 사용자 토큰 발급 시도 |
| `first-active-membership-resolved` | audit_event | consume route — instance_membership + instance JOIN SELECT 성공 (targetUserId · payload.slug — cycle5 ADMIN-UI-80 camelCase) |
| `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |
| `seed-completed` | audit_event | seed script — sqlBase 직접 INSERT 후 emit (§ 7.1) |

> cycle4 정정 (ADMIN-UI-63·66·67·70·71): walking skeleton 의 control-plane operation 은 모두 sqlBase 직접 호출 + audit_event emit 으로 통일. `withServiceRole` 사용 행 (slugResolver · firstActiveMembershipResolver · adminUserUpsert · seedRunner) 모두 제거.

**Gate verification query** (§ 9 #7) — 두 테이블 분리 검증:

```sql
-- audit_event
SELECT event_type, actor_user_id, payload FROM audit_event
 WHERE event_type IN ('tenant-resolved','content-saved','session-created')
   AND occurred_at > $sinceTime
 ORDER BY occurred_at;

-- audit_log: skeleton 에서는 비어 있음 (모든 control-plane operation 이 audit_event 사용 · cycle4)
-- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
```

**content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
1. `saveClinicProfile` 안에서 audit emit 호출을 `try/catch` 로 감싸 **저장은 성공으로 처리** (`return { ok: true }`)
2. catch 블록에서 `console.error` + Sentry alert (M0 v1.0 Sentry 합류 시)
3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.

## 6. ClinicProfile 폼 명세 (skeleton 범위)

### 6.1 입력 필드 (cycle2 정정 ADMIN-UI-42)

| 필드 | 입력 | zod 검증 | DB 검증 |
|---|---|---|---|
| `name` | text | min 1, max 100 | CHECK `clinic_profile_name_length` |
| `slug` | hidden fixed `clinic` | — | CHECK regex |
| `description` | textarea (maxLength=300) | min 80, max 300 | CHECK `clinic_profile_description_length` |
| `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
| `ogImageUrl` | text URL | 같음 | 같음 |
| `businessRegistrationNumber` | text | optional · regex `^\d{3}-\d{2}-\d{5}$` | CHECK |
| `alternateName` | text | optional · empty string → null normalize · max 100 | DB CHECK 없음 |
| `legalEntityName` | text | optional · normalize · max 200 | DB CHECK 없음 |
| `slogan` | text | optional · normalize · max 200 | DB CHECK 없음 |
| `longDescription` | textarea | optional · normalize · max 2000 | DB CHECK 없음 |
| `foundingDate` | date (YYYY-MM-DD) | optional · ISO 날짜 · normalize | DB type=date |
| `founder` | text | optional · normalize · max 100 | DB CHECK 없음 |

**Empty-string normalize 정책**: optional 필드는 zod transform 에서 빈 문자열 → `null` 로 normalize 후 DB 전달. DB column 은 nullable 이므로 일치.

### 6.2 Server Action `saveClinicProfile` — bound action (cycle2 정정 ADMIN-UI-31)

App Router Server Action 은 route params 를 자동 인자로 받지 않으므로 page server component 에서 **bound action** 생성:

```typescript
// /[instanceSlug]/clinic-profile/page.tsx
import { saveClinicProfile as saveAction } from "./actions";
export default async function Page({ params }: { params: { instanceSlug: string }}) {
  const boundSave = saveAction.bind(null, params.instanceSlug);  // 첫 인자에 slug 고정
  // ... <ClinicProfileForm action={boundSave} initialValue={...} />
}

// /[instanceSlug]/clinic-profile/actions.ts
"use server";
export async function saveClinicProfile(instanceSlug: string, prev: State, formData: FormData) {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten() };

  const signedToken = readSessionCookie();
  // ADMIN-UI-46: peekSessionUserId 미존재 → getActiveSession 사용
  const session = await getActiveSession(sqlBase, getAuthCfg(), signedToken); // throw on invalid
  const instanceId = await slugResolver(sqlBase, instanceSlug, session.userId as AdminUserId);
  if (!instanceId) {
    // ADMIN-UI-56: redirect('/404') → notFound() (next/navigation)
    notFound();
  }

  const txResult = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
    assertActionEligibility(ctx, "operator-edit-content");
    const [before] = await tx`SELECT updated_at FROM clinic_profile WHERE instance_id = ${ctx.instanceId} AND slug = 'clinic'`;
    const [after] = await tx`
      INSERT INTO clinic_profile (instance_id, slug, name, description, logo_url, og_image_url, ...)
        VALUES (${ctx.instanceId}, 'clinic', ${parsed.data.name}, ...)
      ON CONFLICT (instance_id, slug) DO UPDATE
        SET name = EXCLUDED.name, ..., updated_at = now()
      RETURNING updated_at
    `;
    return { ctx, before, after };
  });

  // tx commit 후 base-role emit (ADMIN-UI-36) + try/catch (ADMIN-UI-57)
  try {
    // ADMIN-UI-80 cycle5: AuditEventInput 필드명 camelCase (TypeScript helper) — DB column 은 snake_case
    await emitAuditEvent(sqlBase, {
      eventType: "content-saved",
      actorUserId: txResult.ctx.userId,
      targetUserId: txResult.ctx.userId,
      toInstanceId: txResult.ctx.instanceId,
      payload: {
        contentType: "ClinicProfile", slug: "clinic",
        updatedAtBefore: txResult.before?.updated_at ?? null,
        updatedAtAfter: txResult.after.updated_at,
      },
    });
  } catch (auditErr) {
    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
    // M0 v1.0 + transactional outbox 도입 후엔 ok:false 로 전환 — skeleton 은 best-effort
  }

  revalidatePath(`/${instanceSlug}/clinic-profile`);
  return { ok: true };
}
```

- **ADMIN-UI-31**: instanceSlug 는 page 의 bound action 첫 인자.
- **ADMIN-UI-11**: instance_id 는 ctx.instanceId 강제.
- **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
- **ADMIN-UI-22**: last-writer-wins · audit payload updatedAtBefore/After.
- **ADMIN-UI-36**: emitAuditEvent 는 tx commit **후** sqlBase 로.

## 7. 환경변수 · config 주입

`apps/web/.env.example`:

```
WEB_DATABASE_URL=postgres://...                # **웹 런타임 connection — 최소 권한 (cycle8 정정 ADMIN-UI-97 — BYPASSRLS/owner 금지)**:
                                                #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
                                                #         GRANT SELECT ON instance TO <web_role>;
                                                #         GRANT SELECT ON admin_user TO <web_role>;             -- cycle9 정정 ADMIN-UI-103: consume route 는 lookup-only · 자동 INSERT 없음 — INSERT/UPDATE 는 SEED_DATABASE_URL 전용
                                                #         GRANT SELECT ON instance_membership TO <web_role>;
                                                #         GRANT INSERT ON audit_event TO <web_role>;
                                                #         GRANT SELECT, INSERT, UPDATE, DELETE ON "session" TO <web_role>;  -- cycle10 정정 ADMIN-UI-106: sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 (packages/auth/src/internal/session-internal.ts)
                                                #         GRANT SELECT, INSERT, UPDATE ON "verificationToken" TO <web_role>;
                                                #   (b) `SET LOCAL ROLE app_tenant_user` 가능 — `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장 — tenant role 은 명시적 SET 으로만 활성).
                                                #   (c) **BYPASSRLS·table owner 권한 금지** — RLS fail-closed 전제 (NULLIF unset context silent deny) 보장. tenant table 은 무조건 `SET LOCAL ROLE app_tenant_user` 안에서만 접근.
SEED_DATABASE_URL=postgres://...               # **seed CLI / migration connection — superuser/owner** (cycle7·9 정정 ADMIN-UI-94·104):
                                                #   (a) 모든 control-plane / tenant table 의 owner 또는 superuser (idempotent INSERT/UPDATE 필요 — admin_user · instance · instance_membership)
                                                #   (b) `SET ROLE postgres` 가능 (M0 v1.0 service-role 작업 시점에만 필요 · skeleton 단계에서는 (a) 만으로 충분)
                                                # 실 구성 (개발·프로덕션): WEB_DATABASE_URL ≠ SEED_DATABASE_URL — seed 는 superuser·웹 런타임은 최소 권한 (BYPASSRLS/owner 금지). 둘을 같은 admin role 로 만드는 것은 local-only shortcut 으로만 허용 (production 금지).
AUTH_SECRET=<32+ chars>
MAGIC_LINK_TTL_SECONDS=900
SESSION_TTL_SECONDS=86400
SESSION_REFRESH_INTERVAL_SECONDS=3600           # walking skeleton 은 sliding refresh 미적용 (ADMIN-UI-37·38) — DB 만 갱신
RESEND_MODE=mock                                # 허용값 (skeleton): mock | suppress-mock 만 (ADMIN-UI-73). real delivery (resend / sendgrid 등) 는 packages/auth v0.3 mail adapter 도입 후 (M0 v1.0 또는 M2). skeleton 부팅 시 env validation 에서 `mock | suppress-mock` 외 값이면 즉시 throw.
DEV_MOCK_MAILBOX_VIEW=true                      # server-side only · NEXT_PUBLIC 제거 (ADMIN-UI-19)
NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT=2mb         # next.config.mjs 에서 사용 (ADMIN-UI-39)
NODE_ENV=development
```

`next.config.mjs`:

```javascript
export default {
  experimental: {
    serverActions: { bodySizeLimit: process.env.NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT ?? "2mb" },
  },
};
```

**Mock mailbox 노출 3중 가드** (서버사이드만 평가 · `NEXT_PUBLIC_*` 사용 X).

### 7.1 seed script — system actor 부트스트랩 (cycle3 정정 ADMIN-UI-29·48·58)

`ServiceRoleContext.actorUserId: AdminUserId` 가 필수이므로 seed 첫 호출 시점에는 actor 가 없다. 패턴:

1. seed script 는 **withServiceRole 사용하지 않고** 직접 sqlBase (admin role · SET ROLE postgres 가능) 로 INSERT 수행
2. system actor 행을 가장 먼저 idempotent insert (고정 UUID `00000000-0000-4000-8000-000000000001` · email `system@glitzy.internal` · `active=false`)
3. 이후 admin_user · instance · instance_membership 행 INSERT (모두 ON CONFLICT idempotent)
4. seed 자체의 audit 은 **audit_event 에 직접 INSERT** (ADMIN-UI-48 — audit_log 는 `instance_id NOT NULL` 이고 audit_event 는 nullable). emitAuditEvent helper 또는 raw INSERT 사용:

```typescript
// apps/web/src/seed.ts
const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";

// 1) system actor (cycle4 정정 ADMIN-UI-64 — display_name NOT NULL)
await sqlBase`
  INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
    VALUES (${SYSTEM_ACTOR_ID}::uuid, 'system@glitzy.internal', 'System', false, false, false, false, false)
  ON CONFLICT (id) DO NOTHING
`;

// 2) instance + admin_user(operator) + instance_membership (모두 idempotent ON CONFLICT)
const [instanceRow] = await sqlBase`INSERT INTO instance (slug, display_name, active) VALUES (${slug}, ${name}, true) ON CONFLICT (slug) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id`;
const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
// cycle5 정정 ADMIN-UI-79: partial unique index `instance_membership_active_unique (user_id, instance_id) WHERE active=true` 만 존재.
// ON CONFLICT inference 시 predicate 필요. inactive row 재활성화는 별도 UPDATE.
await sqlBase`
  WITH existing AS (
    SELECT id, active FROM instance_membership
     WHERE user_id = ${userRow.id}::uuid AND instance_id = ${instanceRow.id}::uuid
     LIMIT 1
  ), reactivate AS (
    -- cycle6 정정 ADMIN-UI-87: instance_membership_deactivated_consistency CHECK 정합
    -- active=true 시 deactivated_at IS NULL AND deactivated_by_user_id IS NULL 요구
    UPDATE instance_membership
       SET role = 'operator',
           active = true,
           deactivated_at = NULL,
           deactivated_by_user_id = NULL,
           updated_at = now()
     WHERE id = (SELECT id FROM existing) AND (SELECT active FROM existing) = false
     RETURNING id
  ), insert_new AS (
    INSERT INTO instance_membership (user_id, instance_id, role, active)
    SELECT ${userRow.id}::uuid, ${instanceRow.id}::uuid, 'operator', true
     WHERE NOT EXISTS (SELECT 1 FROM existing)
     RETURNING id
  )
  SELECT id FROM reactivate UNION ALL SELECT id FROM insert_new UNION ALL SELECT id FROM existing WHERE active = true
`;

// 3) seed audit — audit_event 사용 (audit_log 는 instance_id NOT NULL — ADMIN-UI-48)
// ADMIN-UI-80 cycle5: column 은 snake_case (DB schema 정합)·AuditEventInput TypeScript helper 는 camelCase (targetUserId 등)
await sqlBase`
  INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
    VALUES ('seed-completed', ${SYSTEM_ACTOR_ID}::uuid, ${instanceRow.id}::uuid, ${sqlBase.json({ slug, email, args })}::jsonb)
`;
```

CLI: `pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>`.

**Migration precondition (cycle3 정정 ADMIN-UI-58)**: walking skeleton 코드가 의존하는 모든 table 의 migration 적용 필수. 각 table 의 SoT 위치:

| Table | Migration | 비고 |
|---|---|---|
| `instance` | `packages/db/migrations/D0010_instance.sql` | M0_SCHEMA v0.1 |
| `clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` | `packages/core-content/migrations/C0001~C0005.sql` | M0_SCHEMA v0.1 |
| `admin_user` · `instance_membership` · `session` · `"verificationToken"` (Auth.js compatible quoted camelCase — ADMIN-UI-82) | `apps/spike-e/migrations/002_admin_user.sql` · `003_auth_session.sql` | Spike E |
| `audit_event` | `apps/spike-e/migrations/004_audit_event.sql` | Spike E |
| `audit_log` | `apps/spike-a/migrations/003_audit_log.sql` | Spike A · `instance_id NOT NULL` |
| pg extensions (`pgcrypto`) | `apps/spike-e/migrations/001_roles_extensions.sql` (또는 동등) | Spike A·D·E 분산 — 첫 번째 migration 가 보장 |

향후 packages/auth/migrations · packages/db/migrations 분리 cascade 진행 시 위 mapping 갱신.

## 8. RLS 통합 검증 — § 8.1 시나리오 (cycle2 정정 ADMIN-UI-43)

1. own instance 정상 — SELECT 본인 row 가능.
2. cross-tenant URL 변조 → `membership-not-found` → 403.
3. slug lookup 실패 → notFound() + audit_event `slug-lookup-not-found` (cycle4 정정 ADMIN-UI-69 — sqlBase 직접 + audit_event emit).
4. session 만료 (TTL 경과 next request) → `session-expired` → /sign-in redirect.
5. session race during tx — request 시작 snapshot 정책. tx 안 revoke 되어도 현재 tx commit. next request 차단.
6. CHECK violation (description 30자) → 폼 inline 에러.
7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
8. FormData hidden `instance_id` 변조 → ctx.instanceId override · 변조값 무시.
9. Forced SQL `INSERT ... VALUES ('<other-uuid>', ...)` → RLS WITH CHECK 위반 · exception.
10. ON CONFLICT DO UPDATE foreign row → USING/WITH CHECK 모두 차단.
11. Oversized body (3MB description) → `next.config.mjs` bodySizeLimit=2mb 위반 → 413.
12. non-operator role 저장 → assertActionEligibility → `operator-role-required` → 403.
13. **Cookie HMAC tampering (ADMIN-UI-43)** — signed token 마지막 byte 변조 후 request → `session-signature-invalid` → cookie clear · /sign-in redirect · audit_event `tenant-resolve-denied` reason=`session-signature-invalid`.

## 9. skeleton 완료 게이트

> **Precondition (cycle6 정정 ADMIN-UI-92)**: 게이트 #1·#2 의 `typecheck:all` / `build:all` script 는 루트 `package.json` 에 현재 미존재. **plan acceptance 가 아닌 구현 진입 precondition** — plan v1.0 acceptance 후 코드 작성 단계의 첫 작업으로 루트 script 추가.

| # | 게이트 | 통과 기준 |
|---|---|---|
| 1 | `pnpm typecheck:all` PASS | 루트 신규 script 추가 후 |
| 2 | `pnpm build:all` PASS | 같음 |
| 3 | `pnpm --filter @glitzy/web seed` PASS — **모든 sign-in 시도 전 필수 (ADMIN-UI-71 ordering)** | idempotent · SYSTEM_ACTOR + operator + instance + membership 생성. health check (/api/health) 가 SYSTEM_ACTOR 존재 검증. |
| 4 | magic-link 로그인 | mock mailbox URL 클릭 → /sign-in/consume?identifier=&token= → 세션 cookie |
| 5 | 대시보드 ctx 표시 | email · role · instanceId 출력 |
| 6 | ClinicProfile 폼 저장 + RLS 격리 | § 8.1 시나리오 1~13 PASS |
| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
| 8 | `pnpm --filter @glitzy/web dev` 동작 | dev 서버 기동 · /api/health 200 · response 에 `systemActorPresent: true` 포함 (preflight · ADMIN-UI-71) |
| 9 | `assertNever` exhaustive 체크 PASS | deny-reason-map 이 모든 17 `AuthDenyReason` mapping (build-time enforce) |
| 10 | next.config.mjs `serverActions.bodySizeLimit` 명시 (ADMIN-UI-39) | 시나리오 11 검증 가능 |

## 10. 미결정 사항 → 최종 결정 (cycle3 정정 ADMIN-UI-59)

| ID | 항목 | 최종 결정 (close 일자 cycle) |
|---|---|---|
| W-01 | 저장 후 페이지 동작 — revalidatePath vs redirect | revalidatePath + inline 토스트 · cycle1 close |
| W-02 | next-auth v5 wrapping vs 자체 핸들러 | 자체 핸들러 (packages/auth) · next-auth 제거 · cycle1 close |
| W-03 | middleware vs layout server-side guard | **cycle4 정정 ADMIN-UI-74**: middleware 미사용 결정. `src/middleware.ts` 작성 X · cookie read 와 redirect 도 `(admin)/layout.tsx` server-side 에서 수행. middleware 도입은 M2 (multi-instance dashboard 동시 처리 필요해질 때). |
| W-04 | shadcn/ui 컴포넌트 셋 | Button · Input · Textarea · Label · Form · Toast 6개 · cycle1 close |
| W-05 | dev mode mock mailbox 노출 | server-side 3중 가드 (NODE_ENV · RESEND_MODE · DEV_MOCK_MAILBOX_VIEW) · cycle1 close |
| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
| W-07 | super-admin instance switch UI | skeleton 범위 외 — operator membership 만 지원 · cycle1 close |

## 11. Deferred

§ 1.3 표 참조.

## 12. SoT cascade (cycle2 — 코드 작성 진입 전 적용 우선순위)

> **선행 patch (acceptance precondition)**: walking skeleton 코드 작성 전 반드시 적용.

| 대상 | cascade | 상태 |
|---|---|---|
| ~~`packages/shared-types/src/index.ts` `ServiceRoleFunction` enum~~ | ~~precondition~~ | **cycle4 제거 (ADMIN-UI-68)** — sqlBase 직접 호출로 변경되어 enum 추가 불필요. M0 v1.0 cascade marker (instance-scoped service-role function 추가 시점). |
| 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
| `docs/admin/ARCHITECTURE.md` § 10 미결정 A-01·A-02·A-03 close (cycle8 정정 ADMIN-UI-98) — A-01·A-02·A-03 의 plan 결정 (Next.js 14·PostgreSQL·packages/auth 자체 핸들러) 은 본 plan 안에서만 확정 · admin/ARCHITECTURE v0.8 patch 는 plan acceptance 후 follow-up cascade | v0.8 patch | **follow-up (acceptance non-blocking)** |
| `docs/decisions/PACKAGES_STRUCTURE.md` v0.2 patch (cycle6·8 정정 ADMIN-UI-91·99) — `@glitzy/auth` placeholder 분류 제거 (실제 issueMagicLink·createSession·resolveTenantContext·emitAuditEvent export 중), `@glitzy/core-content` 상태 갱신 (6 tables 추가), apps/web entry 및 dependency arrow 명시 | v0.2 patch | **follow-up (acceptance non-blocking)** |
| `tsconfig.base.json` path alias 정합 검증 | review | **구현 진입 precondition** |

> **별도 cycle (M0 v1.0 또는 separate cascade)**: skeleton 우회 가능 — wrapper 또는 분기로 처리.

| 대상 | cascade |
|---|---|
| `docs/decisions/INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 Auth.js/next-auth 전제 → packages/auth 자체 handler reversal (ADMIN-UI-67 — follow-up cascade · acceptance 후) |
| `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E Auth.js provider gate → packages/auth 자체 handler 기준 (ADMIN-UI-67 — 같음) |
| `packages/auth` v0.3 — `withResolvedTenantTransaction` 에 `withTenantTransaction` 합성 (ADMIN-UI-04) — skeleton 은 자체 `withSkeletonTx` 로 우회 |
| `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
| `packages/auth` v0.3 — `consumeMagicLink` 가 identifier 반환 유지 + 별도 allowlist lookup helper 검토 (cycle8 정정 ADMIN-UI-101 — cycle7 self-provision 제거 정합 · upsert 표현 제거) — skeleton 은 consume route 에서 admin_user **lookup-only** 수행 (allowlist 미존재 → reject) |
| `packages/auth` v0.3 — `resolveTenantContext` 반환에 `sessionRefreshed` 플래그 (ADMIN-UI-03·38) — skeleton 은 sliding refresh 미적용 |
| `packages/auth` v0.3 — inactive membership 분기 추가 (ADMIN-UI-35) — skeleton mapping 은 unreachable 표시 |
| `packages/auth/migrations` 신규 — auth tables 를 apps/spike-e/migrations 에서 이전 + audit_event RLS/GRANT 추가 (ADMIN-UI-36·13) — skeleton 은 spike-e migrations 직접 적용 |
| (ADMIN-UI-52 — shared-types cascade 중복 제거 · 위 precondition 단일화) |
| `packages/core-content` v0.3 — logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique (ADMIN-UI-09·10) — skeleton 은 zod-only + fixed slug |
| `packages/db` v0.2 — `audit_event` 와 `audit_log` 통합 방향 결정 (ADMIN-UI-06·26) — skeleton 은 두 테이블 분리 검증 |
| Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |

## 13. Codex 비평 cycle 운영 방침

closeableAfterPatch 신호 수렴 기준. cycle1=24, cycle2=20, cycle3=18, cycle4=12, cycle5=12, cycle6=6, cycle7=4, cycle8=6, cycle9=3, cycle10=2, **cycle11=0** (11 cycle 누계 107 findings · `ready_for_acceptance=true` 확정).

## 14. 변경 이력 (최신순 · cycle5 ADMIN-UI-86 명시)

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
| 2026-05-15 | v0.11 | **cycle10 patch (2 findings · major 1 · minor 1 · nit 0 전건 처리)**: (1) ADMIN-UI-106 WEB_DATABASE_URL `GRANT SELECT, INSERT, DELETE ON session` → `GRANT SELECT, INSERT, UPDATE, DELETE ON "session"` 로 정정 (sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 · packages/auth/src/internal/session-internal.ts 정합), (2) ADMIN-UI-107 두 번째 SEED_DATABASE_URL 중복 블록 실 본문 삭제 (cycle9 변경 이력만 기록·본문 잔존이었음) |
| 2026-05-15 | v0.10 | **cycle9 patch (3 findings · major 1 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-103 WEB_DATABASE_URL `GRANT SELECT, INSERT ON admin_user` → `GRANT SELECT` 로 좁힘 (consume route lookup-only 정합), (2) ADMIN-UI-104 SEED_DATABASE_URL 중복 블록 제거 — WEB ≠ SEED 분리 명시 + local-only shortcut 단서, (3) ADMIN-UI-105 § 5.2 요약 시그니처 `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` 로 정정 |
| 2026-05-15 | v0.9 | **cycle8 patch (6 findings · major 3 · minor 3 · nit 0 전건 처리)**: (1) ADMIN-UI-97 WEB_DATABASE_URL 권한을 BYPASSRLS/owner 금지로 좁힘 — control-plane table별 명시적 GRANT 목록 + `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장) 으로 RLS fail-closed 보장, (2) ADMIN-UI-98 admin/ARCHITECTURE § 10 A-01·A-02·A-03 cascade 를 follow-up (acceptance non-blocking) 으로 낮춤 — plan 본문 결정은 plan 안에서 확정, (3) ADMIN-UI-99 PACKAGES_STRUCTURE v0.2 patch 도 follow-up 으로 낮춤, (4) ADMIN-UI-100 apps/web tree 주석 (slug-resolver · post-login-redirect) 의 service-role 잔재 제거, (5) ADMIN-UI-101 § 12 cascade 의 consumeMagicLink upsert 표현 제거 → `identifier 반환 유지 + 별도 allowlist lookup helper`, (6) ADMIN-UI-102 SoT bullet RLS 인용 byte-level 정합 — `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` |
| 2026-05-15 | v0.8 | **cycle7 patch (4 findings · major 2 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-93 § 1.2 표 `/sign-in/consume` 책임을 `admin_user lookup/active check (allowlist 만 — 자동 INSERT 없음)` 로 정정 + cycle4 핵심 결정 문구의 `admin_user upsert` 가 seed 단계 한정임을 명시 (consume route 는 lookup-only), (2) ADMIN-UI-94 DATABASE_URL 을 WEB_DATABASE_URL (control-plane SELECT/INSERT + app_tenant_user role grant) + SEED_DATABASE_URL (M0 v1.0 service-role 작업 시점에 postgres role 추가) 로 분리 — 웹 런타임 과권한 제거, (3) ADMIN-UI-95·96 cascade — PACKAGES_STRUCTURE.md v0.2 + admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 close 는 plan acceptance 와 분리된 follow-up cascade |
| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
| 2026-05-15 | v0.2 | cycle1 patch (24 findings 처리) — A-03 자체 핸들러 close · withSkeletonTx 2단계 · audit_event 단일 SoT · slug service-role · seed precondition · deny mapping · super-admin defer · 시나리오 6개 추가 등 |
| 2026-05-15 | v0.1 | 최초 작성 |


 succeeded in 790ms:
# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)

> **상태**: **v1.0 (acceptance)** — codex 자동 비평 **6 cycle 후 `closeableAfterPatch=true` 확정**. cycle6 finding 1 minor (LL-59) 잔재 정정 후 종료. blocking 0 · major 0 · minor 0 잔존. **59 findings 전건 처리 완료**. 수렴 추세 25→12→10→8→3→1.

> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).

본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.

> **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.

> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
- 기존 packages 실 시그니처 (cycle1 직접 확인):
  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
  - `apps/web/src/components/forms/ClinicProfileForm.tsx`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`

## 1. 목적과 범위

### 1.1 목적

- ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
- 운영자 UX: 화면 추가 없이 한 폼에서 본원 위치·연락·시간 + 정책 변수 (담당자·시행일) 까지 입력. 출력은 자동 분리.
- M0 vertical slice 의 게이트 #1 (사이트 측 페이지 타입 9종 + Article 1샘플) 중 P-012 Contact · P-013 Legal/Policy · P-014 Location Detail 의 데이터 원천 확보.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |

## 2. 데이터 모델 결정

### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)

```sql
-- packages/core-content/migrations/C0006_legal_document.sql

CREATE TYPE legal_document_type AS ENUM (
  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
);

CREATE TABLE legal_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  document_type legal_document_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,                 -- Markdown
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
  effective_date DATE NOT NULL,
  last_revised_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  CONSTRAINT legal_document_email_regex CHECK (
    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-22 patch: autoGenerated=true 면 templateVersion 필수 (LL-SCHEMA-05). custom (autoGenerated=false) 은 null OK
  CONSTRAINT legal_document_template_version_format CHECK (
    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  ),
  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
    (auto_generated = false) OR (template_version IS NOT NULL)
  ),
  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
);

CREATE UNIQUE INDEX legal_document_instance_5type_unique
  ON legal_document (instance_id, document_type)
  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');

CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);

ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON legal_document
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
```

**결정 사항**:
- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
- (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.

### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)

```sql
-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql

ALTER TABLE clinic_profile
  ADD COLUMN policy_contact_person TEXT,
  ADD COLUMN policy_contact_email TEXT,
  ADD COLUMN policy_contact_phone TEXT,
  ADD COLUMN policy_effective_date DATE,
  -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
    policy_contact_email IS NULL
    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
    policy_contact_phone IS NULL
    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  ),
  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
    jsonb_typeof(primary_ctas) = 'array'
  );

-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
-- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
-- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
-- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
RETURNS TRIGGER AS $$
DECLARE
  elem JSONB;
  valid_types CONSTANT TEXT[] := ARRAY[
    -- DATA_MODEL CT-03 SoT 11종 (DB trigger 전체 허용)
    'phone', 'email', 'sms',
    'kakao-talk', 'kakao-channel',
    'naver-reservation', 'naver-talk',
    'form', 'map', 'external', 'video-consultation'
    -- 해외 채널 (line, whatsapp 등) 은 M3 다국어 cascade (DATA_MODEL DM-14)
  ];
BEGIN
  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
    RAISE EXCEPTION 'primary_ctas must be a JSON array'
      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  END IF;
  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing id'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing label'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.

CREATE TRIGGER clinic_profile_primary_ctas_trigger
  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
```

**결정**:
- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
  - UI subset 외 type (sms/form/map/external 등) 은 M1 Phase Alpha cascade (LL-DEFER-19 · cycle5 LL-57 + cycle6 LL-59 단일화).
  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).

### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)

```sql
-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql

-- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
-- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
ALTER TABLE location_profile
  ADD COLUMN clinic_profile_id UUID,
  ADD CONSTRAINT location_profile_clinic_fk
    FOREIGN KEY (instance_id, clinic_profile_id)
    REFERENCES clinic_profile (instance_id, id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
ALTER TABLE location_profile
  ALTER COLUMN clinic_profile_id SET NOT NULL;

CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);

-- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
-- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
-- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
```

**결정**:
- (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:

```jsonc
// location_profile.metadata
{
  "businessHours": {
    "openingHours": [
      // schema.org OpeningHoursSpecification 호환
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:30" },
      { "dayOfWeek": ["Thursday"], "opens": "09:30", "closes": "20:30" },
      { "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "14:00" }
    ],
    "receptionHours": [
      // 접수 마감이 진료 마감과 다를 때
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:00" }
    ],
    "lunchBreaks": [
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "from": "13:00", "to": "14:00" }
    ],
    "specialClosures": []
    // v0.2 미입력 — M1 cascade
  },
  // cycle1 LL-02 patch: ClinicProfile.primaryCtas 자동 상속 결과
  "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
  // v0.2 미입력 — LL-DEFER-05
  "representativeDoctors": [],
  "featuredChannelId": null
}
```

**결정**:
- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
- (LL-SCHEMA-20) 본원 주소: 기존 column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).

## 3. Form UI 재구성

### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)

| 섹션 | 입력 필드 | 출력 계약 |
|---|---|---|
| **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |

**결정**:
- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
- (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).

### 3.2 검증

- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
- (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
  - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
  - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.

## 4. Server Action 결정

### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)

```typescript
// apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts

await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
  assertActionEligibility(ctx, "operator-edit-content");
  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).

  // cycle1 LL-07 patch: 잠금 순서 결정적 — instance 안 모든 entity 동일 순서
  // (1) clinic_profile (FOR UPDATE) — UPSERT 한 번에 처리하므로 별도 SELECT 안 함
  // (2) location_profile main (FOR UPDATE) — UPSERT
  // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
  //     (cycle1 LL-07 patch — closed 5종 사전 알파벳 순)
});
```

**결정**:
- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.

### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)

```typescript
// packages/core-content/src/templates/render.ts

type RenderContext = {
  clinic: {
    name: string;
    legalEntityName: string | null;
    businessRegistrationNumber: string | null;
    founder: string | null;
  };
  location: {
    main: {
      address: string;       // street + locality + region + postal 한 줄
      telephone: string;
      email: string | null;
    };
  };
  policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
  };
};

export function renderTemplate(template: string, ctx: RenderContext): string;
```

**결정**:
- (LL-ACTION-11) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
- (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
- (LL-ACTION-13) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
- (LL-ACTION-14) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
- (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.

### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)

7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:

```jsonc
// row 1
{ "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
// row 2
{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
// row 3~7 (5종 LegalDocument)
{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
                                              "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
// ... terms, non-covered, refund, complaint
```

**결정**:
- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건 — 같은 payload shape (`outcome: "failed"`).
  - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
    - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
    - **notifications Feature 합류 후** (별도 cascade): 운영 팀 slack 알림 채널 추가 marker.
  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
  - M0 v1.0 transactional outbox cascade 시점에 envelope + at-least-once exactly-once observable 로 전환 (cycle 1 LL-17 marker 갱신).
- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.

### 4.4 control-flow / 에러 (LL-ACTION-20)

- ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
- 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 + cycle4 LL-48 patch — 후속 책임/액션/시점 명시):
  - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
  - businessHours 는 application-level 검증 (DB CHECK 없음)

## 5. Core 표준 템플릿 5종

### 5.1 위치 (LL-TEMPLATE-01)

`packages/core-content/src/templates/` 에 각 documentType 별 `.md` 파일 + index.ts 로 export.

```
packages/core-content/src/templates/
├─ index.ts              -- TEMPLATES: Record<DocumentType, Template>
├─ render.ts             -- renderTemplate(template, ctx)
├─ privacy.md            -- 개인정보처리방침 (PIPA 표준)
├─ terms.md              -- 이용약관
├─ non-covered.md        -- 비급여 진료 안내
├─ refund.md             -- 환불 규정
└─ complaint.md          -- 민원 처리
```

```typescript
// packages/core-content/src/templates/index.ts
export type LegalDocumentType =
  | "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";

export type Template = {
  documentType: LegalDocumentType;
  slug: string;
  title: string;
  version: string;        // "privacy@1.0.0"
  body: string;           // raw Markdown with {{...}} placeholders
};

export const TEMPLATES: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", Template>;
```

**결정**:
- (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
  - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
  - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).

## 6. 환경·precondition

- `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음.
- **Migration 의존성 순서 (cycle2 LL-37 patch + v1.1 LLC-15 patch — 9단계로 갱신, C0003 추가)**:
  1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
  2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
  3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
  4. `packages/core-content/migrations/C0003_doctor_profile.sql` (doctor_profile) — **C0005 의 article.author_doctor_id FK precondition · v1.1 LLC-15 추가**
  5. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
  6. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
  8. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
  9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
- 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
- packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
- seed (`pnpm web:seed`) 변경 없음 — instance + admin_user 만 생성.

## 7. § 8.1 RLS 시나리오 cascade

ADMIN_UI_SKELETON_PLAN § 8.1 의 13 시나리오에 다음 추가:

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
| 19 | 변수 화이트리스트 외 키 (`{{evil.x}}`) 가 포함된 템플릿 build-time test | packages/core-content test 실패 (LL-ACTION-12) |
| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
| 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
| 4 | Core 표준 템플릿 5종 + render 엔진 + build-time unknown key test | packages/core-content/src/templates/* + tests |
| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
| 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
| 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
| 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |

## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)

### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)

- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.

### 9.2 M1 Phase Alpha 합류

- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.

### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)

> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.

- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).

### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)

- (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)

### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)

- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.

### 9.5 Closed (이전 cycle 에서 합류 완료)

- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).

## 10. Cascade marker (다른 SoT 문서로 전파)

> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.

- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |


 succeeded in 793ms:
// @glitzy/core-content — Drizzle schema (v0.4·EAT_CONTENT_PLAN v1.0 patch)
// M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)

import { sql } from "drizzle-orm";
import {
  pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
  pgEnum, index, foreignKey, check, unique, uniqueIndex,
} from "drizzle-orm/pg-core";

// === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===

export const instance = pgTable(
  "instance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
    activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
    slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
  }),
);

// === Shared enums (C-03·C-04) ===
export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
]);

export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);

// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
  "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
]);

// === ClinicProfile (C-01) ===

export const clinicProfile = pgTable(
  "clinic_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().default("clinic"),
    name: text("name").notNull(),
    alternateName: text("alternate_name"),
    legalEntityName: text("legal_entity_name"),
    slogan: text("slogan"),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    foundingDate: date("founding_date"),
    founder: text("founder"),
    logoUrl: text("logo_url").notNull(),
    ogImageUrl: text("og_image_url").notNull(),
    businessRegistrationNumber: text("business_registration_number"),
    // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
    policyContactPerson: text("policy_contact_person"),
    policyContactEmail: text("policy_contact_email"),
    policyContactPhone: text("policy_contact_phone"),
    policyEffectiveDate: date("policy_effective_date"),
    // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
    primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
    slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
    // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
    policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
    // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
    instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  }),
);

// === LocationProfile (C-21·M0-18 country regex) ===

export const locationProfile = pgTable(
  "location_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    streetAddress: text("street_address").notNull(),
    addressLocality: text("address_locality").notNull(),
    addressRegion: text("address_region").notNull(),
    postalCode: text("postal_code").notNull(),
    addressCountry: text("address_country").notNull().default("KR"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    phone: text("phone"),
    email: text("email"),
    // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
    clinicProfileId: uuid("clinic_profile_id").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
    latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
    lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
    emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
    phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
    // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
    clinicFk: foreignKey({
      columns: [t.instanceId, t.clinicProfileId],
      foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
      name: "location_profile_clinic_fk",
    }).onDelete("cascade"),
    instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
    clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  }),
);

// === DoctorProfile (C-02) ===

export const doctorProfile = pgTable(
  "doctor_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    title: text("title"),
    jobTitle: text("job_title"),
    honorific: text("honorific"),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
    activeOrderIdx: index("doctor_profile_active_order_idx")
      .on(t.instanceId, t.active, t.displayOrder)
      .where(sql`${t.active} = true`),
  }),
);

// === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===

export const treatmentPage = pgTable(
  "treatment_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
    publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
    statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("treatment_page_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  }),
);

// === Article (C-04·M0-05 ON DELETE NO ACTION) ===

export const article = pgTable(
  "article",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    authorDoctorId: uuid("author_doctor_id"),
    // v0.4 (EC-SCHEMA-05 · cycle 1 ECP-03): C-04 Article.category required — staged C0013 migration 으로 SET NOT NULL.
    //   Drizzle schema 안 .notNull() 는 SoT 표현. C0013 (1)~(4) 단계 통과 후 도달.
    categoryId: uuid("category_id").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
    publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_instance_idx").on(t.instanceId),
    statusIdx: index("article_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("article_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("article_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
    // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
    authorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "article_author_fk",
    }),
    // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
    //   forward-reference 회피를 위해 Drizzle schema 안 미표현 (drizzle-kit 미사용 · raw SQL SoT).
  }),
);

// === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===

export const legalDocument = pgTable(
  "legal_document",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    documentType: legalDocumentTypeEnum("document_type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    autoGenerated: boolean("auto_generated").notNull().default(true),
    templateVersion: text("template_version"),
    // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
    effectiveDate: date("effective_date").notNull(),
    lastRevisedDate: date("last_revised_date"),
    contactPerson: text("contact_person"),
    contactEmail: text("contact_email"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
    emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LL-SCHEMA-05 + cycle1 LL-22
    templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
    autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
    // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
    statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
    publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
    // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
    riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
    instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
    // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
    type5Unique: uniqueIndex("legal_document_instance_5type_unique")
      .on(t.instanceId, t.documentType)
      .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
    instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
  }),
);

// === EAT_CONTENT v1.0 v0.4 cascade — 4 신규 entity ===

// EC-SCHEMA-12 (C-25 SoT) — media_channel_type enum 4종.
//   JSON-LD `@type` 매핑은 v0.1 단계 모두 VideoObject 단일화. EC-DEFER-11 (M1) BroadcastEvent/NewsArticle 분기.
export const mediaChannelTypeEnum = pgEnum("media_channel_type", [
  "broadcast", "youtube", "podcast", "press",
]);

// === ArticleCategory (C-22·EC-SCHEMA-01) ===
//   v0.1 풀명세 컬럼 모두 추가 — 어드민 UI minimal (slug·name·displayOrder 만 노출).
//   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
export const articleCategory = pgTable(
  "article_category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    pillar: text("pillar"),
    parentCategoryId: uuid("parent_category_id"),
    coverImageUrl: text("cover_image_url"),
    seoMeta: jsonb("seo_meta"),
    displayOrder: integer("display_order").notNull().default(0),
    articleTypeDefault: text("article_type_default"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
    descLen: check("article_category_description_length",
      sql`${t.description} IS NULL OR length(${t.description}) BETWEEN 80 AND 200`),
    coverImageUrlFormat: check("article_category_cover_image_url_format",
      sql`${t.coverImageUrl} IS NULL OR ${t.coverImageUrl} ~ '^https?://'`),
    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
    parentIdx: index("article_category_parent_idx")
      .on(t.instanceId, t.parentCategoryId)
      .where(sql`${t.parentCategoryId} IS NOT NULL`),
    // self-referencing composite FK (same-tenant) — DB ADD CONSTRAINT C0009 raw SQL SoT.
    //   parent_category_id 가 nullable 이므로 Drizzle 도 표현 가능.
    parentFk: foreignKey({
      columns: [t.instanceId, t.parentCategoryId],
      foreignColumns: [t.instanceId, t.id],
      name: "article_category_parent_fk",
    }),
  }),
);

// === Publication (C-24·EC-SCHEMA-08) ===
//   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
//   DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
export const publication = pgTable(
  "publication",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    authors: jsonb("authors").notNull(),
    journal: text("journal"),
    publishedDate: date("published_date").notNull(),
    doi: text("doi"),
    pubmedId: text("pubmed_id"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("publication_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    doiFormat: check("publication_doi_format",
      sql`${t.doi} IS NULL OR ${t.doi} ~ '^10\\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'`),
    pubmedIdFormat: check("publication_pubmed_id_format",
      sql`${t.pubmedId} IS NULL OR ${t.pubmedId} ~ '^[0-9]{1,9}$'`),
    authorsArray: check("publication_authors_array",
      sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("publication_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("publication_instance_idx").on(t.instanceId),
    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("publication_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("publication_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "publication_author_doctor_fk",
    }),
  }),
);

// === MediaAppearance (C-25·EC-SCHEMA-11) ===
//   미디어 출연. v0.1 단계 JSON-LD `@type` = VideoObject 단일화 (모든 channel_type).
export const mediaAppearance = pgTable(
  "media_appearance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    channelName: text("channel_name").notNull(),
    channelType: mediaChannelTypeEnum("channel_type").notNull(),
    publishedDate: date("published_date").notNull(),
    durationSeconds: integer("duration_seconds"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
    urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    durationPositive: check("media_appearance_duration_positive",
      sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`),
    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("media_appearance_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
    statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("media_appearance_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("media_appearance_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "media_appearance_author_doctor_fk",
    }),
  }),
);

// === FAQ (C-12·EC-SCHEMA-13) ===
//   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
//   LegalDocument LL-SCHEMA-03·04 패턴 정합.
export const faq = pgTable(
  "faq",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    categoryId: uuid("category_id"),
    relatedTreatmentId: uuid("related_treatment_id"),
    relatedConditionId: uuid("related_condition_id"),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    complianceRecordId: uuid("compliance_record_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
    // EC-SCHEMA-14 cycle 1 ECP-10·11: v0.1 published 차단
    statusV01Limit: check("faq_status_v01_limit", sql`${t.status} = 'draft'`),
    publishedAtNullV01: check("faq_published_at_null_v01", sql`${t.publishedAt} IS NULL`),
    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("faq_instance_idx").on(t.instanceId),
    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("faq_published_idx")
      .on(t.instanceId, t.publishedAt, t.displayOrder)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    categoryIdx: index("faq_category_idx")
      .on(t.instanceId, t.categoryId)
      .where(sql`${t.categoryId} IS NOT NULL`),
    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
    categoryFk: foreignKey({
      columns: [t.instanceId, t.categoryId],
      foreignColumns: [articleCategory.instanceId, articleCategory.id],
      name: "faq_category_fk",
    }),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "faq_author_doctor_fk",
    }),
    relatedTreatmentFk: foreignKey({
      columns: [t.instanceId, t.relatedTreatmentId],
      foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
      name: "faq_related_treatment_fk",
    }),
    // related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외).
  }),
);


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LegalDocument|check\\(\\)|exempt|manualReview|auto_check_result|risk-level-high|m0-stub|maxRisk|requiredApproverRoles|evaluatePublishable|published_content_compliance_guard|C0016|sentinel|NOT VALID|ALLOWED_SUBMIT_TYPES|review_queue_type|content-gate|manual-review|cancelled|required_roles|compliance_record_id|Publication|MediaAppearance|NotificationEvent|CA-DEFER|manifest|hashtext|hashtextextended|scenario|시나리오\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ComplianceCheckInput|ComplianceCheckResult|LegalDocument|7\\.1\\.1|7\\.2|risk-level-high|findingsBySeverity|summary|catalogVersion|exemptReason\" docs/core/CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C-10|ComplianceRecord|contentType|featureContentType|mediaThreshold|warningAck|llmAssist|priorReviewSubmissionId|Publication|MediaAppearance|Feature|FAQ|ArticleCategory" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"§ 7\\.1|publishable|automatedDecision|finalRoles|requiredApproverRoles|warning|stale|priorReview|NotificationEvent|content-gate|manual-review|audit matrix|9\\.1\\.1\" docs/admin/REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
 succeeded in 674ms:
54:| Article.summary | 80~200자 |
56:| TreatmentPage.summary | 50~160자 |
99:   - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
365:type ComplianceCheckInput = {
367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
416:#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
436:  ruleId: "risk-level-high-gate",
447:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
461:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
473:### 7.2 출력
476:type ComplianceCheckResult = {
484:  findingsBySeverity: {
510:  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
589:  | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
615:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
659:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
670:| 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
672:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 687ms:
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (content-gate 큐 1종·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
9:- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
13:- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
15:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 발행 게이트 부분 해소 대상 (NotificationEvent 분리)
28:- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
29:- **EC-DEFER-12 부분 해소**: 6 entity published 발행 unlock — **수동 검수 게이트 통과 시 만**. EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) 는 **미해소** — CA-DEFER-01/02 동반 합류 시. M0 stub 의 manualReview 기반 발행은 자동 룰 검수 부재 risk 인지.
30:- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
31:- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + manual-review queue 활성화 + multi-role AND 게이트 (operator·medical·legal — client 미합류 CA-DEFER-10).
32:- **자동 검수(룰) 미합류 marker**: check() stub — 항상 manualReview 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass · 단 High 입력 시 가상 finding). 실 ruleCatalog/composite/LLM은 CA-DEFER-01·02·03.
33:- **LegalDocument 자동 검수 면제 (CAM-09 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. auto_check_result 슬롯에 명시적 면제 envelope `{automatedDecision:"pass", exemptReason:"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}` 저장.
39:| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
43:| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
46:| check() stub (CAM-03·04·05·09 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로** (buildBlocked · findingsBySeverity · summary 등 모두 포함). pageRiskLevel 등은 wrapper `ComplianceCheckEnvelope` 안 분리. **pageRiskLevel = maxRisk(input.metadata.explicitRiskLevel ?? "Low", input.metadata.inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 check() 호출 우회 — auto_check_result 슬롯에 면제 envelope 직접 저장** |
50:| `published_content_compliance_guard` 트리거 (CAM-08 정정) | BEFORE INSERT/UPDATE ON each entity (article·treatment_page·legal_document·faq·publication·media_appearance) — `NEW.status='published'` 시 referenced compliance_record.record_phase='published' + content_type 일치 + content_ref 매칭 (slug) + instance_id 일치 검증. 위반 시 RAISE EXCEPTION |
52:| vitest scenarios 16건 (CAM-28 정합) | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (4 case) · status 전이 안전성 (3 case) · transition table 무결성 (1 case) |
58:| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
59:| RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX 결합) — M0 stub은 입력 결합 MAX만 처리 | CA-DEFER-01 동반 | CA-DEFER-02 |
60:| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
61:| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
62:| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
63:| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
64:| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
65:| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
66:| MediaThresholdAssessment · mediaThresholdOperationalInput · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
67:| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
68:| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
69:| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
70:| ComplianceRecord 풀 컬럼 (mediaThresholdAssessment · mediaThresholdOperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · **featureContentType** · client 슬롯) — 각 CA-DEFER phase 매핑 | 각 CA-DEFER phase | CA-DEFER-13 |
71:| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
72:| content-gate 자동 큐 진입 (ComplianceCheckResult.gateRequired=true 시) — M0 manual-review 큐 vs content-gate 큐 분리 운영 | CA-DEFER-01 동반 (룰 합류 시 content-gate 큐 활성화) | CA-DEFER-15 |
73:| Feature contentType (DATA_MODEL C-10 v0.5 `Feature` 토큰 + featureContentType) | CA-DEFER-01 + Feature 합류 시 | CA-DEFER-16 |
82:-- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조
90:  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
91:  'Feature', 'Publication', 'MediaAppearance'
102:  auto_check_result JSONB NOT NULL,
109:  client_approver UUID,                         -- M0 미사용 (CA-DEFER-10)
112:  prior_review_submission_id TEXT,              -- CA-DEFER-08
113:  prior_review_passed BOOLEAN,                  -- CA-DEFER-08
126:    record_phase <> 'published' OR content_type <> 'LegalDocument'
155:- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
156:- (CAM-13 정정) ReviewQueueEntry status `cancelled` 제거 — open/in-progress/resolved 3종 만.
157:- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
163:-- SoT: REVIEW_WORKFLOW § 3 큐 3종. M0 v0.1 manual-review 1종 활성
165:-- CAM-02 정정: manual-review queue type 신설 (수동 검수 큐). content-gate (ruleCatalog gateRequired) · warning · stale 은 ADD VALUE cascade.
166:CREATE TYPE review_queue_type AS ENUM ('manual-review');
167:-- CAM-13 정정: cancelled 제거. open/in-progress/resolved 3종 만.
170:-- CAM-15 정정: required_roles enum array 운영
171:CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)
176:  queue_type review_queue_type NOT NULL,
179:  -- CAM-14 정정: M0 manual-review 는 ComplianceRecord pre-publish 참조 필수. NOT NULL.
180:  compliance_record_id UUID NOT NULL,
184:  required_roles approver_role[] NOT NULL,
194:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
224:- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
225:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
226:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
227:- (CAM-13) `cancelled` 제거 — open/in-progress/resolved 3종.
229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
232:-- packages/core-content/migrations/C0016_status_unlock.sql
233:-- CAM-07 정정: NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리.
234:-- CAM-08 정정: published_content_compliance_guard trigger 추가 — entity.status='published' 시 record_phase 매칭 검증.
236:-- (Step 1) LegalDocument · FAQ CHECK 해제
243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
244:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
245:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
246:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
250:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
252:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
254:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
256:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
258:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
260:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
263:--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
264:--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
268:  auto_check_result, peer_reviewer, peer_reviewed_at,
273:  '{"automatedDecision":"pass","exemptReason":"sentinel-pre-existing-published","manualReview":true}'::jsonb,
280:  '{"sentinel":true}'::jsonb
282:WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
285:SET compliance_record_id = cr.id
290:  AND cr.metadata @> '{"sentinel":true}'::jsonb
291:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
293:-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
298:    FROM article WHERE status='published' AND compliance_record_id IS NULL;
299:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
303:-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE.
304:--   기존 published row 가 모두 sentinel 로 채워졌으므로 VALIDATE 안전.
306:  status <> 'published' OR compliance_record_id IS NOT NULL
307:) NOT VALID;
311:-- (Step 7) published_content_compliance_guard trigger — CAM-08 정정.
313:CREATE OR REPLACE FUNCTION published_content_compliance_guard()
319:  IF NEW.compliance_record_id IS NULL THEN
320:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
322:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
324:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
327:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
343:  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
348:- (CAM-07) NOT VALID + sentinel backfill + VALIDATE 단계 분리 — 기존 published row 우회 안전. 운영 시 sentinel ComplianceRecord 식별자 `metadata @> '{"sentinel":true}'` 로 추후 republish 흐름 가이드 marker.
349:- (CAM-08) `published_content_compliance_guard` BEFORE trigger — DB level 발행 게이트 검증. CHECK constraint 로는 cross-table reference 검증 불가하므로 trigger 사용 명시.
350:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
358:export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
364:  requiredApproverRoles: ApproverRole[] = [],   // CAM-16 정정 — auto_check_result.requiredApproverRoles 전달
368:  if (contentType === "LegalDocument") roles.add("legal");
370:  for (const r of requiredApproverRoles) {
381:### 3.2 maxRisk MAX 결합 (CA-GATE-02) — CAM-04 정정
386:export function maxRisk(...levels: RiskLevel[]): RiskLevel {
403:export function evaluatePublishable(
407:  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
408:  const requiredApproverRoles = (autoCheck.requiredApproverRoles ?? []).filter(
412:    contentType, record.page_risk_level, record.prior_review_required, requiredApproverRoles,
426:  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
430:  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
431:  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
432:  // (6) warning 강제 처리 정책 — M0 stub: warningAck 미구현 (CA-DEFER-05 · 항상 충족 가정)
441:- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.
443:## 4. check() stub 결정 — CAM-03·04·05·09 정정
454:// 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview) 는 envelope 안.
459:    catalogVersion: string;   // "m0-stub-v0.1"
461:    manualReview: boolean;    // M0 stub = true (operator 수동 검수만)
466:### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04)
471:  // CAM-09 정정 — LegalDocument 면제 (CONTENT_STANDARDS § 7.1.1.1)
472:  if (input.contentType === "LegalDocument") {
480:        findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0 },
482:        requiredApproverRoles: [],  // legal 은 finalRoles 안 contentType='LegalDocument' 분기로 추가됨
483:        catalogVersion: "m0-stub-v0.1",
485:        exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
487:      meta: { pageRiskLevel: "Low", catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: false },
492:  const pageRiskLevel = maxRisk(
498:  // CAM-05 정정 — High 입력 시 가상 finding `risk-level-high-gate` + gateRequired=true
504:      ruleId: "m0-stub-risk-level-high-gate",
505:      severity: "content-gate",
506:      reason: "High risk level requires content-gate review (M0 stub virtual finding)",
520:      findingsBySeverity: { fail: 0, "content-gate": gateRequired ? 1 : 0, warning: 0 },
522:      requiredApproverRoles: [],
523:      catalogVersion: "m0-stub-v0.1",
526:    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
533:- `submitForReview` server action 안 check() 호출 → `compliance_record.auto_check_result` = `envelope.result` 저장 + `compliance_record.page_risk_level` = `envelope.meta.pageRiskLevel`.
534:- LegalDocument 는 check() 호출하지만 면제 envelope 반환 — auto_check_result 에 exemptReason 명시.
535:- M0 stub 의 High 가상 finding 시 gateRequired=true · automatedDecision='gate' — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.
542:- queue_type='manual-review' + status IN ('open', 'in-progress') row
615:const key = hashUuidTo64Bit(recordId);  // CAM-27 정정 — hashtextextended(uuid::text) 또는 UUID 의 16바이트를 2개 int8 로 분할
619:CAM-27 정정 — `hashtext()` 32-bit 충돌 가능성 → `hashtextextended()` (64-bit) 또는 UUID 자체를 2개 int 로 분리 사용 (`pg_advisory_xact_lock(int1, int2)`). M0 v0.1 채택 = `hashtextextended('compliance:' || record_id, 0)`.
640:## 7. § 8.1 시나리오 cascade — CAM-28 정정
642:| # | 시나리오 | 통과 기준 | 검증 방식 |
644:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
645:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
646:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · auto_check_result.exemptReason='LegalDocument-...' | LegalDocument check() 우회 + 면제 envelope | vitest |
650:| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
652:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
654:| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
655:| 12 | check() stub High 입력 (explicit or inferred) → 가상 finding `m0-stub-risk-level-high-gate` 주입 · gateRequired=true · automatedDecision='gate' | M0 High 가상 finding | vitest |
656:| 13 | check() stub LegalDocument 입력 → 면제 envelope · exemptReason='LegalDocument-...' · manualReview=false | LegalDocument 면제 (CAM-09) | vitest |
657:| 14 | published entity가 record_phase='pre-publish' record 참조 시도 → trigger `published_content_compliance_guard` RAISE | DB level 발행 게이트 무결성 | e2e |
659:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
667:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
668:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
669:| 5 | Compliance types + check() stub + envelope wrapper | apps/web/src/lib/compliance/types.ts + check.ts |
670:| 6 | maxRisk + final-roles + publishable-check + transitions helper | apps/web/src/lib/compliance/{risk, final-roles, publishable-check, transitions}.ts |
675:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
677:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
679:| 15 | vitest scenarios 1~16 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
685:- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
686:- `CA-DEFER-02`: RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX) — M0 stub 은 입력 MAX 만
687:- `CA-DEFER-04`: 캐시 2종 + cacheKey
688:- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
689:- `CA-DEFER-07`: request-changes / delegate 액션
690:- `CA-DEFER-11`: autoCheckResult.findings 풀명세
691:- `CA-DEFER-15` (CAM-02 신설): content-gate 자동 큐 진입 (ruleCatalog 합류 시)
692:- `CA-DEFER-16` (CAM-11 신설): Feature contentType + featureContentType
695:- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
696:- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
697:- `CA-DEFER-10`: client 검수자
698:- `CA-DEFER-12`: attachments[] 법무 의견서
699:- `CA-DEFER-14` (CAM-21 신설): NotificationEvent envelope (notifications Feature 합류)
702:- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
703:- `CA-DEFER-09`: MediaThresholdAssessment + mediaThresholdOperationalInput · analytics-reporting 통합
704:- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning · llmAssist · priorReviewSubmissionId · featureContentType · client 슬롯) — 각 CA-DEFER phase 매핑
708:- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker — subset 명시 + CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns 분리)
709:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
710:- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반)
711:- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
712:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
719:| 2026-05-18 | v0.1 | 초안 작성. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |
720:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 644ms:
20:- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
21:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
22:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
24:- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
68:  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
70:  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
72:  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
103:              │                │       │ automatedDecision != block 재확인
106:              │                │  │ publishable  │
113:              │                │       │ staleFlags 발생 (§ 6)
116:              │                │  │  stale   │
127:draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
139:| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
140:| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
143:| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
144:| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
148:| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |
158:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
159:| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
160:| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |
162:#### 3.1.1 warning 큐 이탈 조건·기록
164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
165:- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
166:- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
168:#### 3.1.2 content-gate와 warning 동시 발생 처리
170:ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
171:- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
172:- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
173:- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)
194:| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
195:| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
196:| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
197:| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |
199:SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).
201:> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.
215:finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
217:           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
218:           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
224:`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.
227:> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
228:> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
229:> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.
235:| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
255:- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)
278:- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
283:- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
292:| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
294:| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
299:- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
300:- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
303:- staleFlags 외 필드 수정 시도 — 빌드/API fail
326:### 6.2 stale 큐 진입·처리
328:- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
329:- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
330:- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
331:- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
332:- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
337:### 6.3 staleFlags 우선순위
352:### 7.1 publishable 산정 알고리즘
354:콘텐츠가 `publishable` 상태가 되기 위한 조건:
357:publishable = (1) automatedDecision !== "block"
358:           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
361:           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
362:           ∧ (4) staleFlags 모두 false 또는 미설정
364:           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
367:위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)
373:- 검증: § 7.1 재실행 (auth time-of-use)
377:  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
390:## 8. 사전심의 (priorReview) 흐름
392:### 8.1 priorReviewRequired 판정
394:**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:
396:1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
397:2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
398:3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
399:4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)
407:- `ComplianceRecord.priorReviewRequired=true|false`
428:2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
429:3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
430:4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
434:6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
438:**priorReviewRequired 산정 기준 분리** (AR2-08):
439:- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
440:- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록
445:1. legal 검수자 priorReviewRequired=true 기록
447:3. 제출 ID 기록 — priorReviewSubmissionId
449:5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
450:6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
451:7. publishable 조건 § 7.1 (3) 충족
454:### 8.3 priorReview 상태 추적 화면
456:어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.
464:### 9.1 NotificationEventType enum (canonical SoT)
467:type NotificationEventType =
468:  | "content-gate-queued"           // content-gate 큐 진입
469:  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
470:  | "stale-queued"                  // stale 큐 진입
471:  | "warning-queued"                // warning 큐 진입
484:  | "search-visibility-anomaly-warning"      // warning severity anomaly
517:### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)
523:| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
525:| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
526:| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
537:| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
575:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
579:type NotificationEvent = {
582:  eventType: NotificationEventType;                    // § 9.1 enum
586:  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
587:  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
598:  eventId: string;                                     // 상위 NotificationEvent 참조
599:  eventType: NotificationEventType;
620:- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
635:- staleFlags 발생·해제
662:  | "stale-triggered" | "stale-resolved"
774:| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
775:| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
776:| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |
788:| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
791:| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |
800:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

 succeeded in 652ms:
19:- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
43:| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
59:| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
209:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
331:| `publications` | `Publication[]` | optional | |
365:#### `Publication`
398:| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
484:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
576:| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
589:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
597:| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
599:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
601:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
602:| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
654:> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
728:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
753:### C-09. `FeatureModuleConfig` — Feature Module 설정
761:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
772:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
777:| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
787:| `priorReviewSubmissionId` | `string` | optional | |
791:| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
796:| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
797:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
808:| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
815:> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
848:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
910:> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
915:### C-22. `ArticleCategory` — Article Pillar 분류
932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
961:### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
996:### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
1007:| `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
1014:**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
1116:   ├─ category → ArticleCategory (C-22)
1121:ComplianceRecord (C-10)
1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
1141:| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
1146:| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1171:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1172:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
1176:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
1178:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
1182:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
1183:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
1185:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
1186:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |

codex
두 가지 실제 잔존 모순이 보입니다. 특히 `ComplianceCheckResult`를 “SoT 그대로”라고 하면서 stub 예시가 SoT 밖 필드를 result에 넣고 있고, LegalDocument가 “check() 우회”와 “check() 내부 분기”로 동시에 설명됩니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 390 -First 150' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 228 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/CONTENT_STANDARDS.md | Select-Object -Skip 356 -First 170' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 350 -First 95' in C:\Users\assag\solution\website-exposure
 succeeded in 792ms:
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

-- (Step 4) Sentinel ComplianceRecord backfill — 기존 published row 가 있는 entity 만.
--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low'.
INSERT INTO compliance_record (
  instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at,
  published_at, published_by, record_phase, record_version, metadata
)
SELECT DISTINCT
  a.instance_id, 'Article'::compliance_content_type, a.slug, COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","exemptReason":"sentinel-pre-existing-published","manualReview":true}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid,
  a.published_at,
  a.published_at,
  '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase,
  1,
  '{"sentinel":true}'::jsonb
FROM article a
WHERE a.status = 'published' AND a.compliance_record_id IS NULL;

UPDATE article a
SET compliance_record_id = cr.id
FROM compliance_record cr
WHERE a.instance_id = cr.instance_id
  AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
    FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  -- treatment_page · legal_document · faq · publication · media_appearance 도 동일 검증 (반복 생략 — migration 실 코드 안 6 entity 모두)
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE.
--   기존 published row 가 모두 sentinel 로 채워졌으므로 VALIDATE 안전.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
-- treatment_page · legal_document · faq · publication · media_appearance 동일 (반복 생략)

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

 succeeded in 803ms:
```

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  const requiredApproverRoles = (autoCheck.requiredApproverRoles ?? []).filter(
    (r): r is ApproverRole => r === "operator" || r === "medical" || r === "legal"
  );
  const finalRoles = calculateFinalRoles(
    contentType, record.page_risk_level, record.prior_review_required, requiredApproverRoles,
  );
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

## 4. check() stub 결정 — CAM-03·04·05·09 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01)

CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로 반환 + M0 stub metadata 는 wrapper 안 분리:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 그대로
// 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview) 는 envelope 안.
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만)
  };
};
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04)

```typescript
// apps/web/src/lib/compliance/check.ts
export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // CAM-09 정정 — LegalDocument 면제 (CONTENT_STANDARDS § 7.1.1.1)
  if (input.contentType === "LegalDocument") {
    return {
      result: {
        findings: [],
        buildBlocked: false,
        gateRequired: false,
        hasWarnings: false,
        automatedDecision: "pass",
        findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0 },
        summary: { ruleMatchedCount: 0, llmAssistInvoked: false },
        requiredApproverRoles: [],  // legal 은 finalRoles 안 contentType='LegalDocument' 분기로 추가됨
        catalogVersion: "m0-stub-v0.1",
        catalogHash: "stub",
        exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
      },
      meta: { pageRiskLevel: "Low", catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: false },
    };
  }

  // CAM-04 정정 — MAX 결합 (격하 금지)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // CAM-05 정정 — High 입력 시 가상 finding `risk-level-high-gate` + gateRequired=true
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      severity: "content-gate",
      reason: "High risk level requires content-gate review (M0 stub virtual finding)",
      // ... CONTENT_STANDARDS Finding shape
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  return {
    result: {
      findings,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      automatedDecision,
      findingsBySeverity: { fail: 0, "content-gate": gateRequired ? 1 : 0, warning: 0 },
      summary: { ruleMatchedCount: 0, llmAssistInvoked: false },
      requiredApproverRoles: [],
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-05)

- `submitForReview` server action 안 check() 호출 → `compliance_record.auto_check_result` = `envelope.result` 저장 + `compliance_record.page_risk_level` = `envelope.meta.pageRiskLevel`.
- LegalDocument 는 check() 호출하지만 면제 envelope 반환 — auto_check_result 에 exemptReason 명시.
- M0 stub 의 High 가상 finding 시 gateRequired=true · automatedDecision='gate' — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.

## 5. 어드민 UI 결정 — CAM-18 정정

### 5.1 /admin/{slug}/review-queue 화면 (CA-UI-01)


 succeeded in 805ms:

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

 succeeded in 819ms:

## 3. AND 게이트 평가 결정 — CAM-04·05·06·16 정정

### 3.1 finalRoles 계산 (CA-GATE-01)

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: ApproverRole[] = [],   // CAM-16 정정 — auto_check_result.requiredApproverRoles 전달
): ApproverRole[] {
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    // CAM-16 정정 — unknown role fail closed
    if (r !== "operator" && r !== "medical" && r !== "legal") {
      throw new ComplianceConfigError(`Unknown ApproverRole: ${r}`);
    }
    roles.add(r);
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

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  const requiredApproverRoles = (autoCheck.requiredApproverRoles ?? []).filter(
    (r): r is ApproverRole => r === "operator" || r === "medical" || r === "legal"
  );
  const finalRoles = calculateFinalRoles(
    contentType, record.page_risk_level, record.prior_review_required, requiredApproverRoles,
  );
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

## 4. check() stub 결정 — CAM-03·04·05·09 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01)

codex
# COMPLIANCE_ASSISTANT_M0_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=3 major=1 minor=1 (총 5)
- closeableAfterPatch: false
- 수렴 추세: cycle1=28 → cycle2=5

## cycle 1 patch 검증
- CAM-01: PASS — EC-DEFER-07/12 부분 해소, EC-DEFER-05 미해소로 정정됨.
- CAM-02: PASS — 본문은 `manual-review` 1종으로 정정됨. 단 상단 marker 잔재는 minor.
- CAM-03: FAIL — `ComplianceCheckResult` result 안에 SoT 밖 `summary/catalogVersion/catalogHash/exemptReason`가 남음.
- CAM-04: PASS — `maxRisk()` MAX 결합 명시.
- CAM-05: PASS — `m0-stub-risk-level-high-gate` + `gateRequired=true` 명시.
- CAM-06: PASS — publishable 6조건 구조는 반영됨.
- CAM-07: FAIL — C0016 sentinel backfill이 실제 예시는 Article만 처리, 6 entity VALIDATE와 불일치.
- CAM-08: PASS — `published_content_compliance_guard` BEFORE trigger 명시.
- CAM-09: FAIL — “check() 우회”와 “check() 내부 LegalDocument 분기/호출”이 동시에 남음.
- CAM-10: PASS — enum 17종 + `ALLOWED_SUBMIT_TYPES` 분리.
- CAM-11: PASS — CA-DEFER-16 신설.
- CAM-12: PASS — CA-DEFER-13에 `mediaThresholdOperationalInput` 포함.
- CAM-13: PASS — `cancelled` 제거, 3종 상태.
- CAM-14: PASS — `compliance_record_id NOT NULL`.
- CAM-15: PASS — `approver_role[]` enum array.
- CAM-16: FAIL — unknown role을 filter로 제거해 fail closed가 아님.
- CAM-17: PASS — 첫 approve atomic 전이 명시.
- CAM-18: PASS — status field read-only + workflow action 전이.
- CAM-19: PASS — Publication/MediaAppearance는 ADD COLUMN + form/zod unlock만.
- CAM-20: PASS — audit event 4종 matrix cascade 명시.
- CAM-21: PASS — CA-DEFER-14 신설.
- CAM-22: PASS — client 제외 3종 역할 정정.
- CAM-23: PASS — manifest 19단계.
- CAM-24: PASS — 6 entity로 정정.
- CAM-25: PASS — C-10 정정.
- CAM-26: PASS — snake_case/camelCase 규칙 명시.
- CAM-27: PASS — `hashtextextended` 64-bit lock key.
- CAM-28: PASS — 시나리오 scope 16건으로 재정리.

## new findings
- CAM2-01 blocking — `ComplianceCheckResult` SoT 위반: result 객체가 CONTENT_STANDARDS §7.2에 없는 필드를 포함하고 `findingsBySeverity.info`도 누락됨.
- CAM2-02 blocking — LegalDocument 면제 흐름 모순: CONTENT_STANDARDS는 check() 진입 차단인데 plan §4.2/§4.3은 check() 호출/내부 분기.
- CAM2-03 blocking — C0016 backfill 범위 불완전: all 6 entity constraint/trigger를 추가하면서 sentinel backfill은 Article만 구체화.
- CAM2-04 major — `requiredApproverRoles` unknown role fail closed 미작동: filter 후 계산하므로 unknown이 조용히 삭제됨.
- CAM2-05 minor — 상단 acceptance marker가 아직 “content-gate 큐 1종”이라고 표기됨. 본문은 `manual-review`.

## acceptance 판정
- closeableAfterPatch=false — plan v1.0 acceptance commit 비권고.
- 누계 시작점 147 + cycle1 28 + cycle2 5 → 180.
tokens used
151,128
# COMPLIANCE_ASSISTANT_M0_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=3 major=1 minor=1 (총 5)
- closeableAfterPatch: false
- 수렴 추세: cycle1=28 → cycle2=5

## cycle 1 patch 검증
- CAM-01: PASS — EC-DEFER-07/12 부분 해소, EC-DEFER-05 미해소로 정정됨.
- CAM-02: PASS — 본문은 `manual-review` 1종으로 정정됨. 단 상단 marker 잔재는 minor.
- CAM-03: FAIL — `ComplianceCheckResult` result 안에 SoT 밖 `summary/catalogVersion/catalogHash/exemptReason`가 남음.
- CAM-04: PASS — `maxRisk()` MAX 결합 명시.
- CAM-05: PASS — `m0-stub-risk-level-high-gate` + `gateRequired=true` 명시.
- CAM-06: PASS — publishable 6조건 구조는 반영됨.
- CAM-07: FAIL — C0016 sentinel backfill이 실제 예시는 Article만 처리, 6 entity VALIDATE와 불일치.
- CAM-08: PASS — `published_content_compliance_guard` BEFORE trigger 명시.
- CAM-09: FAIL — “check() 우회”와 “check() 내부 LegalDocument 분기/호출”이 동시에 남음.
- CAM-10: PASS — enum 17종 + `ALLOWED_SUBMIT_TYPES` 분리.
- CAM-11: PASS — CA-DEFER-16 신설.
- CAM-12: PASS — CA-DEFER-13에 `mediaThresholdOperationalInput` 포함.
- CAM-13: PASS — `cancelled` 제거, 3종 상태.
- CAM-14: PASS — `compliance_record_id NOT NULL`.
- CAM-15: PASS — `approver_role[]` enum array.
- CAM-16: FAIL — unknown role을 filter로 제거해 fail closed가 아님.
- CAM-17: PASS — 첫 approve atomic 전이 명시.
- CAM-18: PASS — status field read-only + workflow action 전이.
- CAM-19: PASS — Publication/MediaAppearance는 ADD COLUMN + form/zod unlock만.
- CAM-20: PASS — audit event 4종 matrix cascade 명시.
- CAM-21: PASS — CA-DEFER-14 신설.
- CAM-22: PASS — client 제외 3종 역할 정정.
- CAM-23: PASS — manifest 19단계.
- CAM-24: PASS — 6 entity로 정정.
- CAM-25: PASS — C-10 정정.
- CAM-26: PASS — snake_case/camelCase 규칙 명시.
- CAM-27: PASS — `hashtextextended` 64-bit lock key.
- CAM-28: PASS — 시나리오 scope 16건으로 재정리.

## new findings
- CAM2-01 blocking — `ComplianceCheckResult` SoT 위반: result 객체가 CONTENT_STANDARDS §7.2에 없는 필드를 포함하고 `findingsBySeverity.info`도 누락됨.
- CAM2-02 blocking — LegalDocument 면제 흐름 모순: CONTENT_STANDARDS는 check() 진입 차단인데 plan §4.2/§4.3은 check() 호출/내부 분기.
- CAM2-03 blocking — C0016 backfill 범위 불완전: all 6 entity constraint/trigger를 추가하면서 sentinel backfill은 Article만 구체화.
- CAM2-04 major — `requiredApproverRoles` unknown role fail closed 미작동: filter 후 계산하므로 unknown이 조용히 삭제됨.
- CAM2-05 minor — 상단 acceptance marker가 아직 “content-gate 큐 1종”이라고 표기됨. 본문은 `manual-review`.

## acceptance 판정
- closeableAfterPatch=false — plan v1.0 acceptance commit 비권고.
- 누계 시작점 147 + cycle1 28 + cycle2 5 → 180.
