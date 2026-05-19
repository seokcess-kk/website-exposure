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
