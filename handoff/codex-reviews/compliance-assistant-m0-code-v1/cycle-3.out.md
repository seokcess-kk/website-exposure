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
session id: 019e3a6b-5291-7673-9ee8-b290ddeb639e
--------
user
Review code of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 3**. cycle 2 2 finding patch 검증 + 새 finding 확인. 짧게.

## Cycle 2 patches

| # | severity | patch |
|---|---|---|
| CAMC2-01 | blocking | C0016 4 entity sentinel page_risk_level='Low' fixed (Medium/High Article published row 의 physician_approver CHECK 위반 회피) |
| CAMC2-02 | major | rejectContent 안 required_roles 검증 + FOR UPDATE 추가 — role mismatch fail closed |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=N

## cycle 2 patch 검증
- CAMC2-01: PASS/FAIL + 한 줄
- CAMC2-02: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 code v1.0 acceptance 진행 권고
```

cycle 2 2건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
`seo-geo`와는 무관한 코드/문서 리뷰라 일반 리뷰 방식으로 진행하겠습니다. 먼저 해당 결정 문서와 주변 diff를 확인해서 cycle 2 패치가 실제로 반영됐는지 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C0016|rejectContent|required_roles|page_risk_level|physician_approver|FOR UPDATE|CAMC2" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
 succeeded in 618ms:
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
99:  page_risk_level risk_level NOT NULL,
105:  physician_approver UUID,                      -- admin_user.id (medical)
130:    record_phase <> 'published' OR page_risk_level = 'Low'
131:    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
170:-- CAM-15 정정: required_roles enum array 운영
184:  required_roles approver_role[] NOT NULL,
194:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
226:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
232:-- packages/core-content/migrations/C0016_status_unlock.sql
265:--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).
268:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
285:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
304:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
320:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
482:      contentType, record.page_risk_level, record.prior_review_required,
641:INSERT INTO compliance_record (..., page_risk_level, auto_check_result, metadata, ...)
704:export async function rejectContent(
723:| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
766:| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
768:| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
789:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
794:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
829:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 635ms:
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

 succeeded in 685ms:
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

codex
문서 자체는 관련 패치 설명을 포함하고 있습니다. 이제 실제 산출물인 `C0016_status_unlock.sql`과 compliance server action 구현을 열어, 문서가 아니라 코드 기준으로 PASS/FAIL을 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0016_status_unlock.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "rejectContent|FOR UPDATE|required_roles|page_risk_level|physician_approver|sentinel|compliance_record" apps/web/src/lib/compliance packages/core-content/migrations/C0016_status_unlock.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 675ms:
-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
-- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
-- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
-- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.

-- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
END $$;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   기존 published row 사전 마이그레이션 회피용.

-- Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a
WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = a.instance_id
      AND cr.content_type = 'Article'::compliance_content_type
      AND cr.content_ref = a.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id
  AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- TreatmentPage
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t
WHERE t.status = 'published' AND t.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = t.instance_id
      AND cr.content_type = 'TreatmentPage'::compliance_content_type
      AND cr.content_ref = t.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id
  AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
  published_at, published_by, record_phase, record_version, metadata)
SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
FROM legal_document l
WHERE l.status = 'published' AND l.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = l.instance_id
      AND cr.content_type = 'LegalDocument'::compliance_content_type
      AND cr.content_ref = l.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
WHERE l.instance_id = cr.instance_id
  AND cr.content_type = 'LegalDocument'::compliance_content_type
  AND cr.content_ref = l.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND l.status = 'published' AND l.compliance_record_id IS NULL;

-- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
  f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM faq f
WHERE f.status = 'published' AND f.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = f.instance_id
      AND cr.content_type = 'FAQ'::compliance_content_type
      AND cr.content_ref = f.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
WHERE f.instance_id = cr.instance_id
  AND cr.content_type = 'FAQ'::compliance_content_type
  AND cr.content_ref = f.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND f.status = 'published' AND f.compliance_record_id IS NULL;

-- Publication · MediaAppearance — risk_level 'Low' fixed
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p
WHERE p.status = 'published' AND p.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = p.instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = p.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id
  AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m
WHERE m.status = 'published' AND m.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = m.instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = m.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id
  AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity
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

-- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
  END IF;
END $$;

-- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
--   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
  expected_content_type compliance_content_type;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record
   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  expected_content_type := CASE TG_TABLE_NAME
    WHEN 'article' THEN 'Article'
    WHEN 'treatment_page' THEN 'TreatmentPage'
    WHEN 'legal_document' THEN 'LegalDocument'
    WHEN 'faq' THEN 'FAQ'
    WHEN 'publication' THEN 'Publication'
    WHEN 'media_appearance' THEN 'MediaAppearance'
    ELSE NULL
  END;
  IF expected_content_type IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
  END IF;
  IF record_row.content_type <> expected_content_type THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
  END IF;
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS article_published_guard ON article;
CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS faq_published_guard ON faq;
CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS publication_published_guard ON publication;
CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

 succeeded in 679ms:
packages/core-content/migrations/C0016_status_unlock.sql:1:-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
packages/core-content/migrations/C0016_status_unlock.sql:3:-- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
packages/core-content/migrations/C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
packages/core-content/migrations/C0016_status_unlock.sql:14:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations/C0016_status_unlock.sql:15:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations/C0016_status_unlock.sql:16:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations/C0016_status_unlock.sql:22:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:26:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:30:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:34:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:38:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:42:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations/C0016_status_unlock.sql:47:--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
packages/core-content/migrations/C0016_status_unlock.sql:51:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:55:  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
packages/core-content/migrations/C0016_status_unlock.sql:59:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:60:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
packages/core-content/migrations/C0016_status_unlock.sql:64:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:68:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:71:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:75:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:76:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:79:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:83:  'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
packages/core-content/migrations/C0016_status_unlock.sql:87:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:88:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:90:WHERE t.status = 'published' AND t.compliance_record_id IS NULL
packages/core-content/migrations/C0016_status_unlock.sql:92:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:96:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:99:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:103:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:104:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:107:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:115:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:116:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:118:WHERE l.status = 'published' AND l.compliance_record_id IS NULL
packages/core-content/migrations/C0016_status_unlock.sql:120:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:124:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:127:UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:131:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:132:  AND l.status = 'published' AND l.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:135:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:138:SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
packages/core-content/migrations/C0016_status_unlock.sql:142:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:143:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:145:WHERE f.status = 'published' AND f.compliance_record_id IS NULL
packages/core-content/migrations/C0016_status_unlock.sql:147:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:151:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:154:UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:158:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:159:  AND f.status = 'published' AND f.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:162:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:169:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:170:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:172:WHERE p.status = 'published' AND p.compliance_record_id IS NULL
packages/core-content/migrations/C0016_status_unlock.sql:174:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:178:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:181:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:185:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:186:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:188:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:195:  'published'::compliance_record_phase, 1,
packages/core-content/migrations/C0016_status_unlock.sql:196:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:198:WHERE m.status = 'published' AND m.compliance_record_id IS NULL
packages/core-content/migrations/C0016_status_unlock.sql:200:    SELECT 1 FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:204:      AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:207:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations/C0016_status_unlock.sql:211:  AND cr.metadata @> '{"sentinel":true}'::jsonb
packages/core-content/migrations/C0016_status_unlock.sql:212:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:218:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:219:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:220:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:221:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:222:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:223:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:224:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:225:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:226:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:227:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:228:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations/C0016_status_unlock.sql:229:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations/C0016_status_unlock.sql:235:    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:239:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:243:    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:247:    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:251:    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:255:    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations/C0016_status_unlock.sql:261:--   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
packages/core-content/migrations/C0016_status_unlock.sql:265:  record_row compliance_record%ROWTYPE;
packages/core-content/migrations/C0016_status_unlock.sql:269:  IF NEW.compliance_record_id IS NULL THEN
packages/core-content/migrations/C0016_status_unlock.sql:270:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
packages/core-content/migrations/C0016_status_unlock.sql:272:  SELECT * INTO record_row FROM compliance_record
packages/core-content/migrations/C0016_status_unlock.sql:273:   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
packages/core-content/migrations/C0016_status_unlock.sql:275:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
packages/core-content/migrations/C0016_status_unlock.sql:278:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
apps/web/src/lib/compliance\final-roles.ts:41:  physician_approver: string | null;
apps/web/src/lib/compliance\final-roles.ts:45:  page_risk_level: RiskLevel;
apps/web/src/lib/compliance\final-roles.ts:53:  if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
apps/web/src/lib/compliance\entity-actions.ts:56:        // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
apps/web/src/lib/compliance\entity-actions.ts:62:           FOR UPDATE
apps/web/src/lib/compliance\entity-actions.ts:138:        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
apps/web/src/lib/compliance\entity-actions.ts:139:        //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
apps/web/src/lib/compliance\entity-actions.ts:143:           FOR UPDATE
apps/web/src/lib/compliance\entity-actions.ts:152:          SELECT id, record_version FROM compliance_record
apps/web/src/lib/compliance\entity-actions.ts:156:             AND record_phase = 'pre-publish'::compliance_record_phase
apps/web/src/lib/compliance\publishable-check.ts:22:    finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\types.ts:60:// M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
apps/web/src/lib/compliance\server-actions.ts:2:// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
apps/web/src/lib/compliance\server-actions.ts:79:    INSERT INTO compliance_record (
apps/web/src/lib/compliance\server-actions.ts:80:      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
apps/web/src/lib/compliance\server-actions.ts:88:      'pre-publish'::compliance_record_phase,
apps/web/src/lib/compliance\server-actions.ts:104:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps/web/src/lib/compliance\server-actions.ts:105:      status, priority, required_roles, sla_due_at
apps/web/src/lib/compliance\server-actions.ts:145:  // entry + record FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:146:  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
apps/web/src/lib/compliance\server-actions.ts:147:  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[] }[]>`
apps/web/src/lib/compliance\server-actions.ts:148:    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles
apps/web/src/lib/compliance\server-actions.ts:150:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
apps/web/src/lib/compliance\server-actions.ts:152:     FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:156:  if (!entry.required_roles.includes(args.role)) {
apps/web/src/lib/compliance\server-actions.ts:158:      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
apps/web/src/lib/compliance\server-actions.ts:163:    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
apps/web/src/lib/compliance\server-actions.ts:164:           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
apps/web/src/lib/compliance\server-actions.ts:167:      FROM compliance_record
apps/web/src/lib/compliance\server-actions.ts:169:     FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:182:    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:185:    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:186:    record.physician_approver = ctx.userId; record.physician_approved_at = now;
apps/web/src/lib/compliance\server-actions.ts:188:    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:217:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:249:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:264:export async function rejectContent(
apps/web/src/lib/compliance\server-actions.ts:275:  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
apps/web/src/lib/compliance\server-actions.ts:276:  const entryRows = await tx<{ id: string; required_roles: string[] }[]>`
apps/web/src/lib/compliance\server-actions.ts:277:    SELECT id, required_roles::text[] AS required_roles FROM review_queue_entry
apps/web/src/lib/compliance\server-actions.ts:278:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
apps/web/src/lib/compliance\server-actions.ts:280:     FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:283:  if (!entryRows[0]!.required_roles.includes(args.role)) {
apps/web/src/lib/compliance\server-actions.ts:285:      `Role "${args.role}" is not required for this entry (required: ${entryRows[0]!.required_roles.join(", ")})`,
apps/web/src/lib/compliance\server-actions.ts:330:  // record FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:332:    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
apps/web/src/lib/compliance\server-actions.ts:334:           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
apps/web/src/lib/compliance\server-actions.ts:337:      FROM compliance_record
apps/web/src/lib/compliance\server-actions.ts:339:     FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:354:     FOR UPDATE
apps/web/src/lib/compliance\server-actions.ts:360:  // (1) compliance_record record_phase 전환 (record ID 보존)
apps/web/src/lib/compliance\server-actions.ts:362:    UPDATE compliance_record
apps/web/src/lib/compliance\server-actions.ts:363:       SET record_phase = 'published'::compliance_record_phase,
apps/web/src/lib/compliance\server-actions.ts:369:  // (2) entity status → published + published_at + compliance_record_id 채움.
apps/web/src/lib/compliance\server-actions.ts:375:           compliance_record_id = '${args.recordId}',
apps/web/src/lib/compliance\__tests__\compliance.test.ts:124:    physician_approver: null,
apps/web/src/lib/compliance\__tests__\compliance.test.ts:128:    page_risk_level: "Low" as const,
apps/web/src/lib/compliance\__tests__\compliance.test.ts:142:      { ...baseRecord, page_risk_level: "Medium", peer_reviewer: "u1", peer_reviewed_at: new Date() },
apps/web/src/lib/compliance\__tests__\compliance.test.ts:182:    physician_approver: null, physician_approved_at: null,
apps/web/src/lib/compliance\__tests__\compliance.test.ts:184:    page_risk_level: "Low" as const,

 succeeded in 709ms:
// @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
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
  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[] }[]>`
    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles
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

  const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };

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
  const entryRows = await tx<{ id: string; required_roles: string[] }[]>`
    SELECT id, required_roles::text[] AS required_roles FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  if (!entryRows[0]!.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${entryRows[0]!.required_roles.join(", ")})`,
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
     WHERE id = ${entryRows[0]!.id}::uuid
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
  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; record_phase: string; record_version: number })[]>`
    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
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

codex
cycle 2 두 패치의 핵심 조건은 코드에서 보입니다. 새 finding 여부를 보려면 같은 경로의 인접 구현, 특히 entity wrapper와 migration 선행 컬럼 정의가 서로 맞는지 한 번 더 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/entity-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compliance_record_id|CREATE TABLE article|CREATE TABLE treatment_page|CREATE TABLE faq|ALTER TABLE article|ALTER TABLE treatment_page|ALTER TABLE faq" packages/core-content/migrations packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/final-roles.ts; Get-Content -Path apps/web/src/lib/compliance/publishable-check.ts; Get-Content -Path apps/web/src/lib/compliance/types.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 673ms:
packages/core-content/src/schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
packages/core-content/src/schema.ts:196:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:231:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:290:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:291:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:305:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages/core-content/src/schema.ts:391:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:392:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:451:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:452:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:506:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:517:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages/core-content/src/schema.ts:606:    complianceRecordId: uuid("compliance_record_id").notNull(),
packages/core-content/migrations\C0005_article.sql:5:CREATE TABLE article (
packages/core-content/migrations\C0005_article.sql:14:  compliance_record_id UUID,
packages/core-content/migrations\C0005_article.sql:39:ALTER TABLE article ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0005_article.sql:40:ALTER TABLE article FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0004_treatment_page.sql:13:CREATE TABLE treatment_page (
packages/core-content/migrations\C0004_treatment_page.sql:22:  compliance_record_id UUID,
packages/core-content/migrations\C0004_treatment_page.sql:41:ALTER TABLE treatment_page ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0004_treatment_page.sql:42:ALTER TABLE treatment_page FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0009_article_category.sql:6:CREATE TABLE article_category (
packages/core-content/migrations\C0009_article_category.sql:40:ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0009_article_category.sql:41:ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0012_faq.sql:7:CREATE TABLE faq (
packages/core-content/migrations\C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
packages/core-content/migrations\C0012_faq.sql:50:ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0012_faq.sql:51:ALTER TABLE faq FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0013_article_category_fk.sql:11:ALTER TABLE article ADD COLUMN IF NOT EXISTS category_id UUID;
packages/core-content/migrations\C0013_article_category_fk.sql:40:ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;
packages/core-content/migrations\C0013_article_category_fk.sql:51:    ALTER TABLE article ADD CONSTRAINT article_category_fk
packages/core-content/migrations\C0016_status_unlock.sql:1:-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
packages/core-content/migrations\C0016_status_unlock.sql:10:ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
packages/core-content/migrations\C0016_status_unlock.sql:11:ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;
packages/core-content/migrations\C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
packages/core-content/migrations\C0016_status_unlock.sql:14:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:15:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:16:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:21:    ALTER TABLE article ADD CONSTRAINT article_compliance_fk
packages/core-content/migrations\C0016_status_unlock.sql:22:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:25:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
packages/core-content/migrations\C0016_status_unlock.sql:26:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:30:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:33:    ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
packages/core-content/migrations\C0016_status_unlock.sql:34:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:38:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:42:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
packages/core-content/migrations\C0016_status_unlock.sql:71:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:76:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:90:WHERE t.status = 'published' AND t.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:99:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:104:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:118:WHERE l.status = 'published' AND l.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:127:UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:132:  AND l.status = 'published' AND l.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:145:WHERE f.status = 'published' AND f.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:154:UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:159:  AND f.status = 'published' AND f.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:172:WHERE p.status = 'published' AND p.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:181:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:186:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:198:WHERE m.status = 'published' AND m.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:207:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:212:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:218:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:219:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:220:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:221:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:222:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:223:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:224:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:225:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:226:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:227:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:228:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:229:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:235:    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:236:    ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
packages/core-content/migrations\C0016_status_unlock.sql:239:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:240:    ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
packages/core-content/migrations\C0016_status_unlock.sql:243:    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:247:    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:248:    ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
packages/core-content/migrations\C0016_status_unlock.sql:251:    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:255:    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:269:  IF NEW.compliance_record_id IS NULL THEN
packages/core-content/migrations\C0016_status_unlock.sql:270:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
packages/core-content/migrations\C0016_status_unlock.sql:273:   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
packages/core-content/migrations\C0016_status_unlock.sql:275:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
packages/core-content/migrations\C0015_review_queue_entry.sql:16:  compliance_record_id UUID NOT NULL,
packages/core-content/migrations\C0015_review_queue_entry.sql:36:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)

 succeeded in 697ms:
// @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
// REVIEW_WORKFLOW § 4.1 SoT.

import type { ApproverRole, ContentType, RiskLevel } from "./types";
import { ComplianceConfigError } from "./types";

const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
 *   server action 안 try/catch 로 form-level error 변환.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (r === "client") {
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);
  }
  return Array.from(roles).sort();
}

export type ComplianceRecordRow = {
  peer_reviewer: string | null;
  peer_reviewed_at: Date | null;
  physician_approver: string | null;
  physician_approved_at: Date | null;
  legal_counsel: string | null;
  legal_counsel_at: Date | null;
  page_risk_level: RiskLevel;
  prior_review_required: boolean;
  prior_review_passed: boolean | null;
  auto_check_result: unknown;
};

export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
  if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
  if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
  if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
  return false;
}
// @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
// REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.

import type { ApproverRole, ContentType } from "./types";
import { ComplianceConfigError } from "./types";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";

export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
  | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
  const required = autoCheck?.requiredApproverRoles ?? [];

  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }

  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck?.automatedDecision === "block") {
    reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  }
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
  // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
  // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
// @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
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

 succeeded in 708ms:
// @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"rejectContent\\(|approveContent\\(|ReviewEntry|review-queue|contentTable|contentRef\" apps/web/src/app apps/web/src/components apps/web/src/lib/compliance -g \"*.ts\" -g \"*.tsx\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/components/forms/ReviewEntryActionForm.tsx' in C:\Users\assag\solution\website-exposure
 succeeded in 580ms:
// @glitzy/web/components/forms/ReviewEntryActionForm — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { approveEntryAction, rejectEntryAction } from "@/app/(admin)/admin/[instanceSlug]/review-queue/actions";
import type { ApproverRole } from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

const ROLE_LABEL: Record<ApproverRole, string> = {
  operator: "operator (peer)",
  medical: "medical (physicianApprover)",
  legal: "legal (legalCounsel)",
};

export function ReviewEntryActionForm({
  instanceSlug,
  entryId,
  role,
}: {
  instanceSlug: string;
  entryId: string;
  role: ApproverRole;
}) {
  const boundApprove = approveEntryAction.bind(null, instanceSlug, entryId, role);
  const boundReject = rejectEntryAction.bind(null, instanceSlug, entryId, role);
  const [approveState, approveAction] = useFormState<SaveResult | null, FormData>(boundApprove, null);
  const [rejectState, rejectAction] = useFormState<SaveResult | null, FormData>(boundReject, null);
  const [reason, setReason] = useState("");
  const approveError = approveState && approveState.ok === false ? approveState.formError : null;
  const rejectError = rejectState && rejectState.ok === false ? rejectState.formError : null;
  const rejectFieldErrors = rejectState && rejectState.ok === false ? rejectState.fieldErrors : {};

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <h3 className="mb-2 text-sm font-medium">{ROLE_LABEL[role]}</h3>
      {(approveError || rejectError) && (
        <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          {approveError ?? rejectError}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <form action={approveAction}>
          <ApproveBtn />
        </form>
        <form action={rejectAction} className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-xs">
            <span>거부 사유 (50자 이상)</span>
            <textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              minLength={50}
              maxLength={2000}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
            {rejectFieldErrors?.reason && rejectFieldErrors.reason.length > 0 ? (
              <span className="text-xs text-rose-700">{rejectFieldErrors.reason[0]}</span>
            ) : null}
          </label>
          <RejectBtn />
        </form>
      </div>
    </div>
  );
}

function ApproveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? "승인 중…" : "승인"}
    </button>
  );
}

function RejectBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
    >
      {pending ? "거부 중…" : "거부"}
    </button>
  );
}

 succeeded in 584ms:
apps/web/src/lib/compliance\entity-actions.ts:45:  contentRef: string,
apps/web/src/lib/compliance\entity-actions.ts:61:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:67:          contentRef,
apps/web/src/lib/compliance\entity-actions.ts:70:        // entity status draft → review-queued
apps/web/src/lib/compliance\entity-actions.ts:73:             SET status = 'review-queued'::content_publication_status, updated_at = now()
apps/web/src/lib/compliance\entity-actions.ts:74:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:91:            contentRef,
apps/web/src/lib/compliance\entity-actions.ts:101:      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
apps/web/src/lib/compliance\entity-actions.ts:102:      revalidatePath(`/admin/${instanceSlug}/review-queue`);
apps/web/src/lib/compliance\entity-actions.ts:104:      return { ok: true, slug: contentRef };
apps/web/src/lib/compliance\entity-actions.ts:127:  contentRef: string,
apps/web/src/lib/compliance\entity-actions.ts:142:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:150:        // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
apps/web/src/lib/compliance\entity-actions.ts:155:             AND content_ref = ${contentRef}
apps/web/src/lib/compliance\entity-actions.ts:162:          contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
apps/web/src/lib/compliance\entity-actions.ts:183:          payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
apps/web/src/lib/compliance\entity-actions.ts:188:      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
apps/web/src/lib/compliance\entity-actions.ts:190:      return { ok: true, slug: contentRef };
apps/web/src/components\forms\ArticleForm.tsx:35:  { value: "review-queued", label: "검수 대기" },
apps/web/src/lib/compliance\transitions.ts:7:  | "draft" | "review-queued" | "in-review" | "approved" | "publishable"
apps/web/src/lib/compliance\transitions.ts:11:  "draft": ["review-queued"],
apps/web/src/lib/compliance\transitions.ts:12:  "review-queued": ["in-review", "draft"],
apps/web/src/lib/compliance\transitions.ts:16:  "rejected": ["draft", "review-queued"],
apps/web/src/lib/compliance\transitions.ts:19:  "stale": ["review-queued"],
apps/web/src/lib/compliance\server-actions.ts:37:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:49: * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
apps/web/src/lib/compliance\server-actions.ts:59:  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
apps/web/src/lib/compliance\server-actions.ts:63:    contentRef: args.contentRef,
apps/web/src/lib/compliance\server-actions.ts:85:      ${args.contentRef},
apps/web/src/lib/compliance\server-actions.ts:110:      ${args.contentRef},
apps/web/src/lib/compliance\server-actions.ts:127:  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
apps/web/src/lib/compliance\server-actions.ts:128:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:134: * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
apps/web/src/lib/compliance\server-actions.ts:137:export async function approveContent(
apps/web/src/lib/compliance\server-actions.ts:204:  // entity status 전이 review-queued → in-review (첫 approve)
apps/web/src/lib/compliance\server-actions.ts:206:    UPDATE ${args.contentTable}
apps/web/src/lib/compliance\server-actions.ts:208:         WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
apps/web/src/lib/compliance\server-actions.ts:212:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:226:      UPDATE ${args.contentTable}
apps/web/src/lib/compliance\server-actions.ts:229:       WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:257:  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
apps/web/src/lib/compliance\server-actions.ts:258:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:264:export async function rejectContent(
apps/web/src/lib/compliance\server-actions.ts:301:    UPDATE ${args.contentTable}
apps/web/src/lib/compliance\server-actions.ts:304:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:310:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:312:  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
apps/web/src/lib/compliance\server-actions.ts:352:    SELECT status::text AS status FROM ${args.contentTable}
apps/web/src/lib/compliance\server-actions.ts:353:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:372:    UPDATE ${args.contentTable}
apps/web/src/lib/compliance\server-actions.ts:377:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\types.ts:20:  contentRef: string;
apps/web/src/lib/compliance\__tests__\compliance.test.ts:48:      contentRef: "test",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:62:      contentRef: "test",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:76:      contentRef: "privacy",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:84:      contentRef: "privacy",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:96:      contentRef: "test",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:106:  it("draft → review-queued 허용", () => {
apps/web/src/lib/compliance\__tests__\compliance.test.ts:107:    expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
apps/web/src/lib/compliance\__tests__\compliance.test.ts:116:    expect(listAllowedTransitions("review-queued")).toContain("in-review");
apps/web/src/components\forms\ReviewEntryActionForm.tsx:1:// @glitzy/web/components/forms/ReviewEntryActionForm — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1
apps/web/src/components\forms\ReviewEntryActionForm.tsx:6:import { approveEntryAction, rejectEntryAction } from "@/app/(admin)/admin/[instanceSlug]/review-queue/actions";
apps/web/src/components\forms\ReviewEntryActionForm.tsx:16:export function ReviewEntryActionForm({
apps/web/src/components\forms\WorkflowActionButtons.tsx:12:  contentRef,
apps/web/src/components\forms\WorkflowActionButtons.tsx:17:  contentRef: string;
apps/web/src/components\forms\WorkflowActionButtons.tsx:27:        <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
apps/web/src/components\forms\WorkflowActionButtons.tsx:30:        <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
apps/web/src/components\forms\WorkflowActionButtons.tsx:32:      {currentStatus === "review-queued" || currentStatus === "in-review" ? (
apps/web/src/components\forms\WorkflowActionButtons.tsx:33:        <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
apps/web/src/components\forms\WorkflowActionButtons.tsx:45:  contentRef,
apps/web/src/components\forms\WorkflowActionButtons.tsx:49:  contentRef: string;
apps/web/src/components\forms\WorkflowActionButtons.tsx:51:  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
apps/web/src/components\forms\WorkflowActionButtons.tsx:65:  contentRef,
apps/web/src/components\forms\WorkflowActionButtons.tsx:69:  contentRef: string;
apps/web/src/components\forms\WorkflowActionButtons.tsx:71:  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
apps/web/src/components\forms\TreatmentPageForm.tsx:31:  { value: "review-queued", label: "검수 대기" },
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:125:        contentRef={params.slug}
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:20:  "draft", "review-queued", "in-review", "approved", "publishable",
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:21:  "draft", "review-queued", "in-review", "approved", "publishable",
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:152:            href={`/admin/${params.instanceSlug}/review-queue`}
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:58:        const out = await approveContent(tx, ctx, {
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:61:          contentTable: table,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:62:          contentRef: entry.content_ref,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:81:            contentRef: result.entry.content_ref,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:91:      revalidatePath(`/admin/${instanceSlug}/review-queue`);
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:92:      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:144:        await rejectContent(tx, ctx, {
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:148:          contentTable: table,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:149:          contentRef: entry.content_ref,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:168:            contentRef: result.entry.content_ref,
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:177:      revalidatePath(`/admin/${instanceSlug}/review-queue`);
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:178:      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:179:      redirect(`/admin/${instanceSlug}/review-queue`);
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/review-queue — manual-review 큐 list
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:125:                    <Link href={`/admin/${params.instanceSlug}/review-queue/${r.id}`} className="text-xs text-blue-700 underline">검수</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:11:import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:46:export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:146:        <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:198:            <ReviewEntryActionForm

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 570ms:
// @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
// SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
import type { ApproverRole } from "@/lib/compliance/types";

type EntryRow = {
  id: string;
  content_type: string;
  content_ref: string;
  compliance_record_id: string;
  status: string;
  priority: string;
  required_roles: string[];
  sla_due_at: Date;
  page_risk_level: string;
  // record slots
  peer_reviewer_name: string | null;
  peer_reviewed_at: Date | null;
  physician_approver_name: string | null;
  physician_approved_at: Date | null;
  legal_counsel_name: string | null;
  legal_counsel_at: Date | null;
  auto_check_result: unknown;
};

type ContentPreview = { title: string | null; summary: string | null; body: string | null };

// CAMC-09 정정: content_type 별 read-only preview (table/column allowlist)
const PREVIEW_QUERIES: Record<string, { table: string; titleCol?: string; summaryCol?: string; bodyCol?: string }> = {
  Article: { table: "article", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  TreatmentPage: { table: "treatment_page", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  LegalDocument: { table: "legal_document", titleCol: "title", bodyCol: "body" },
  FAQ: { table: "faq", titleCol: "question", bodyCol: "answer" },
  Publication: { table: "publication", titleCol: "title", summaryCol: "summary" },
  MediaAppearance: { table: "media_appearance", titleCol: "title", summaryCol: "summary" },
};

export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  let entry: EntryRow | null;
  let eligibleRoles: ApproverRole[] = [];
  let preview: ContentPreview | null = null;
  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<EntryRow[]>`
          SELECT e.id,
                 e.content_type::text AS content_type,
                 e.content_ref,
                 e.compliance_record_id,
                 e.status::text AS status,
                 e.priority::text AS priority,
                 e.required_roles::text[] AS required_roles,
                 e.sla_due_at,
                 cr.page_risk_level::text AS page_risk_level,
                 cr.auto_check_result,
                 cr.peer_reviewed_at,
                 cr.physician_approved_at,
                 cr.legal_counsel_at,
                 (SELECT display_name FROM admin_user WHERE id = cr.peer_reviewer) AS peer_reviewer_name,
                 (SELECT display_name FROM admin_user WHERE id = cr.physician_approver) AS physician_approver_name,
                 (SELECT display_name FROM admin_user WHERE id = cr.legal_counsel) AS legal_counsel_name
            FROM review_queue_entry e
            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
           WHERE e.id = ${params.entryId}::uuid AND e.instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        const e = rows[0] ?? null;
        // 본인 가능 role 산정 — instance_membership.role 우선
        const roles: ApproverRole[] = [];
        if (ctx.role === "operator" || ctx.role === "super-admin") roles.push("operator");
        if (ctx.user.physician_reviewer_eligible) roles.push("medical");
        if (ctx.user.legal_reviewer_eligible) roles.push("legal");

        // CAMC-09 정정: content_type 별 preview 조회 (allowlist)
        let preview: ContentPreview | null = null;
        if (e) {
          const q = PREVIEW_QUERIES[e.content_type];
          if (q) {
            const titleSel = q.titleCol ?? "NULL";
            const summarySel = q.summaryCol ?? "NULL";
            const bodySel = q.bodyCol ?? "NULL";
            const previewRows = await tx.unsafe<{ title: string | null; summary: string | null; body: string | null }[]>(`
              SELECT ${titleSel} AS title, ${summarySel} AS summary, ${bodySel} AS body
                FROM ${q.table}
               WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${e.content_ref.replace(/'/g, "''")}'
               LIMIT 1
            `);
            preview = previewRows[0] ?? null;
          }
        }

        return { entry: e, eligibleRoles: roles, preview };
      },
    );
    entry = result.entry;
    eligibleRoles = result.eligibleRoles;
    preview = result.preview;
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }
  if (entry === null) notFound();

  // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
  const filledRoles = new Set<ApproverRole>();
  if (entry.peer_reviewed_at !== null) filledRoles.add("operator");
  if (entry.physician_approved_at !== null) filledRoles.add("medical");
  if (entry.legal_counsel_at !== null) filledRoles.add("legal");
  const required = new Set(entry.required_roles as ApproverRole[]);
  const actionableRoles = eligibleRoles.filter((r) => required.has(r) && !filledRoles.has(r));

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">검수 — {entry.content_type} · {entry.content_ref}</h1>
        <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
      </header>

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">콘텐츠 메타</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">유형</dt><dd>{entry.content_type}</dd>
          <dt className="text-slate-500">slug</dt><dd className="font-mono text-xs">{entry.content_ref}</dd>
          <dt className="text-slate-500">위험도</dt><dd>{entry.page_risk_level}</dd>
          <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
          <dt className="text-slate-500">우선순위</dt><dd>{entry.priority}</dd>
          <dt className="text-slate-500">SLA 마감</dt><dd className="text-xs">{new Date(entry.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}</dd>
          <dt className="text-slate-500">상태</dt><dd>{entry.status}</dd>
        </dl>
      </section>

      {preview ? (
        <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-medium">콘텐츠 미리보기 (read-only)</h2>
          {preview.title && (
            <h3 className="mb-2 text-base font-semibold text-fg-default">{preview.title}</h3>
          )}
          {preview.summary && (
            <p className="mb-3 text-sm text-fg-muted">{preview.summary}</p>
          )}
          {preview.body && (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-100 bg-slate-50 p-3 text-xs text-fg-default">{preview.body}</pre>
          )}
        </section>
      ) : null}

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">검수 슬롯</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">operator (peer)</dt>
          <dd>{entry.peer_reviewer_name ? `${entry.peer_reviewer_name} · ${entry.peer_reviewed_at ? new Date(entry.peer_reviewed_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">medical</dt>
          <dd>{entry.physician_approver_name ? `${entry.physician_approver_name} · ${entry.physician_approved_at ? new Date(entry.physician_approved_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">legal</dt>
          <dd>{entry.legal_counsel_name ? `${entry.legal_counsel_name} · ${entry.legal_counsel_at ? new Date(entry.legal_counsel_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
        </dl>
      </section>

      {actionableRoles.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">
          본인이 수행 가능한 검수 역할이 없습니다.
        </div>
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-base font-medium">검수 액션</h2>
          <p className="mb-3 text-xs text-slate-500">본인 가능 역할: {actionableRoles.join(", ")}</p>
          {actionableRoles.map((role) => (
            <ReviewEntryActionForm
              key={role}
              instanceSlug={params.instanceSlug}
              entryId={params.entryId}
              role={role}
            />
          ))}
        </section>
      )}
    </main>
  );
}

2026-05-18T09:30:17.794220Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 727ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 540ms:
// @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — approveEntry · rejectEntry

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type ApproverRole,
  type SubmitContentType,
} from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

export async function approveEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        const out = await approveContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
        });
        return { ok: true as const, ctx, entry, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-approved",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            allApproved: result.out.allApproved,
            entryStatus: result.out.entryStatus,
          },
        });
      } catch (err) {
        console.error("[approveEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      return { ok: true, slug: entryId };
    }
    return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) {
      return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
    }
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[approveEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "승인 중 오류가 발생했습니다." };
  }
}

export async function rejectEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 50) {
    return { ok: false, fieldErrors: { reason: ["거부 사유는 50자 이상이어야 합니다."] } };
  }
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        await rejectContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          reason,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
        });
        return { ok: true as const, ctx, entry };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-rejected",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            reason,
          },
        });
      } catch (err) {
        console.error("[rejectEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) {
      return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
    }
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[rejectEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "거부 처리 중 오류가 발생했습니다." };
  }
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p=(Resolve-Path packages/core-content/migrations/C0016_status_unlock.sql).Path; Select-String -Path $p -Pattern "'"'Low'::risk_level|physician_approver|CAMC2-01\" | ForEach-Object { \""'$($_.Path):$($_.LineNumber):$($_.Line.Trim())" }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p=(Resolve-Path apps/web/src/lib/compliance/server-actions.ts).Path; Select-String -Path $p -Pattern "CAMC2-02|SELECT id, required_roles|FOR UPDATE|required_roles.includes|UPDATE '"\\"'$'"\\{args.contentTable\\}|content_type::text AS content_type|content_ref\" | ForEach-Object { \""'$($_.Path):$($_.LineNumber):$($_.Line.Trim())" }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p=(Resolve-Path '"'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts').Path; Select-String -LiteralPath "'$p -Pattern "SELECT compliance_record_id|content_type::text|content_ref|approveContent|rejectContent|contentRef: entry.content_ref" | ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" }' in C:\Users\assag\solution\website-exposure
 succeeded in 651ms:
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:80:instance_id, content_type, content_ref, page_risk_level, auto_check_result,
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:104:instance_id, queue_type, content_type, content_ref, compliance_record_id,
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:145:// entry + record FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:152:FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:156:if (!entry.required_roles.includes(args.role)) {
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:163:SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:169:FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:206:UPDATE ${args.contentTable}
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:226:UPDATE ${args.contentTable}
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:275:// CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:277:SELECT id, required_roles::text[] AS required_roles FROM review_queue_entry
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:280:FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:283:if (!entryRows[0]!.required_roles.includes(args.role)) {
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:301:UPDATE ${args.contentTable}
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:330:// record FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:332:SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:339:FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:354:FOR UPDATE
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts:372:UPDATE ${args.contentTable}

 succeeded in 651ms:
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:55:'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:83:'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:110:SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:138:SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:165:SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql:191:SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,

2026-05-18T09:30:45.920992Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mSelect-String: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … review-queue/actions.ts').Path; Select-String -LiteralPath [36;1m$p[0m -Patter …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                              ~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind argument to parameter 'LiteralPath' because it is null.[0m

 exited 1 in 752ms:
[31;1mSelect-String: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … review-queue/actions.ts').Path; Select-String -LiteralPath [36;1m$p[0m -Patter …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                              ~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind argument to parameter 'LiteralPath' because it is null.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'C:\\Users\\assag\\solution\\website-exposure\\apps\\web\\src\\app\\(admin)\\admin\\[instanceSlug]\\review-queue\\actions.ts'; Select-String -LiteralPath "'$p -Pattern "SELECT compliance_record_id|content_type::text|content_ref|approveContent|rejectContent|contentRef: entry.content_ref" | ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" }' in C:\Users\assag\solution\website-exposure
 succeeded in 541ms:
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:14:import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:46:const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:47:SELECT compliance_record_id, content_type::text AS content_type, content_ref
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:58:const out = await approveContent(tx, ctx, {
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:62:contentRef: entry.content_ref,
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:81:contentRef: result.entry.content_ref,
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:132:const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:133:SELECT compliance_record_id, content_type::text AS content_type, content_ref
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:144:await rejectContent(tx, ctx, {
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:149:contentRef: entry.content_ref,
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:168:contentRef: result.entry.content_ref,

codex
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1

## cycle 2 patch 검증
- CAMC2-01: PASS — C0016 sentinel `page_risk_level`이 전부 `Low`로 고정되어 Medium/High published row의 physician CHECK 우회됨. [C0016_status_unlock.sql](/C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:55)
- CAMC2-02: PASS — `rejectContent`가 `required_roles`를 `FOR UPDATE`로 잠그고 role 포함 여부를 fail-closed 검증함. [server-actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:275)

## new findings

- CAMC3-01 major — approve/reject가 queue entry의 `content_type/content_ref`와 `compliance_record.content_type/content_ref` 정합을 검증하지 않음. wrapper는 entry 값을 넘기고, core action은 recordId 기준 role만 검증한 뒤 넘겨받은 entity row를 업데이트함. queue row drift/오염 시 record A 승인 슬롯을 채우면서 content B를 `approved/rejected`로 바꿀 수 있음.  
  위치: [review-queue/actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:47), [server-actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:301)  
  patch: approve/reject 내부에서 locked entry와 compliance_record를 JOIN하고 `e.content_type/ref = cr.content_type/ref` 검증 후 그 값만 update target으로 사용.

## acceptance 판정
- closeableAfterPatch=false — CAMC3-01 patch 후 재검증 필요.
tokens used
59,140
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1

## cycle 2 patch 검증
- CAMC2-01: PASS — C0016 sentinel `page_risk_level`이 전부 `Low`로 고정되어 Medium/High published row의 physician CHECK 우회됨. [C0016_status_unlock.sql](/C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:55)
- CAMC2-02: PASS — `rejectContent`가 `required_roles`를 `FOR UPDATE`로 잠그고 role 포함 여부를 fail-closed 검증함. [server-actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:275)

## new findings

- CAMC3-01 major — approve/reject가 queue entry의 `content_type/content_ref`와 `compliance_record.content_type/content_ref` 정합을 검증하지 않음. wrapper는 entry 값을 넘기고, core action은 recordId 기준 role만 검증한 뒤 넘겨받은 entity row를 업데이트함. queue row drift/오염 시 record A 승인 슬롯을 채우면서 content B를 `approved/rejected`로 바꿀 수 있음.  
  위치: [review-queue/actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:47), [server-actions.ts](/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:301)  
  patch: approve/reject 내부에서 locked entry와 compliance_record를 JOIN하고 `e.content_type/ref = cr.content_type/ref` 검증 후 그 값만 update target으로 사용.

## acceptance 판정
- closeableAfterPatch=false — CAMC3-01 patch 후 재검증 필요.
