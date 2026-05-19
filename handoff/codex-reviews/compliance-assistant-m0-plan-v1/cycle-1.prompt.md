You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.1 (draft). 본 plan은 compliance-assistant Feature spec v1.0 (612 line · 5 cycle 47 finding · M1 acceptance) 의 **M0 vertical slice scope** — 빌드 모드/룰 카탈로그/LLM/캐시는 모두 CA-DEFER. 핵심 M0 정합 + EAT_CONTENT v1.0 EC-DEFER-05/07/12 해소 + LL-DEFER-01 해소.

This is **cycle 1**. Produce a strict, broad critique on whether the plan correctly maps onto compliance-assistant Feature spec, REVIEW_WORKFLOW, DATA_MODEL C-10, RISK_LEVELS, CONTENT_STANDARDS § 7, EAT_CONTENT v1.0, LOCATION_LEGAL v1.1. 가능한 한 광범위하게.

## SoT to read

1. `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 0 한 페이지 요약 · § 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시 · § 9 운영 지표 · § 10 비활성화)
2. `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯 · § 6 StaleFlags
3. `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — 풀명세 (recordPhase · recordVersion · mediaThresholdAssessment · staleFlags · warningAck · llmAssist)
4. `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference · § 3 RiskRule · § 4 finalRoles
5. `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05/07/12 (해소 대상)
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 (해소 대상)
8. `packages/core-content/src/schema.ts` v0.4 (현재 Drizzle SoT — 정합 확인)
9. `apps/web/src/lib/action-context.ts` (assertActionEligibility 패턴)

## Plan under review

`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.1 — 핵심 결정 12종:
- CA-SCHEMA-01·02·03 ComplianceRecord skeleton (10 contentType enum · 4 CHECK)
- CA-SCHEMA-04·05·06 ReviewQueueEntry (content-gate 만 · required_roles · partial UNIQUE)
- CA-SCHEMA-07 6 entity status unlock + compliance_record_id FK + published_requires_record CHECK
- CA-GATE-01·02 finalRoles 계산 (operator + (Medium/High ? medical : ∅) + (LegalDocument ? legal : ∅) + priorReviewRequired ? legal) + publishable evaluator
- CA-CHECK-01·02 check() stub (manualReview only · ruleCatalog 미합류)
- CA-UI-01·02·03 /review-queue list/detail + 6 form status 9-state + 액션 버튼
- CA-ACTION-01~07 4 server action + advisory lock + assertReviewerEligibility + status 전이 table

## What to check (cycle 1)

### Plan SoT 합치
- DATA_MODEL C-10 풀명세 vs M0 컬럼 subset — 누락 필드가 CA-DEFER-13 매핑에 포함되는지 (mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReview 풀)
- REVIEW_WORKFLOW § 2 상태 머신 9종 vs status 전이 table — 누락 전이 없는지 (`published → blocked` · `published → stale` · `rejected → review-queued` 등)
- REVIEW_WORKFLOW § 4.1 finalRoles 공식 — `requiredApproverRoles[]` 룰 추가 역할 표현 (M0 v0.1 항상 [] 인지 확인) · client 역할 CA-DEFER-10 명시 정합
- compliance-assistant § 3.3 check() 단일 엔트리포인트 — 입출력 시그니처 CONTENT_STANDARDS § 7 정합 · M0 stub 의 cacheKey/ruleHash 부재 처리
- RISK_LEVELS § 2.3 RiskInference pageRiskLevel = MAX(pageType, articleType, slot, inlineRiskFlags, explicit) — M0 stub 의 단순 input 우선 처리가 정합인지 (Phase Alpha cascade marker)

### Scope · CA-DEFER 정합
- 13 CA-DEFER marker가 spec § 의 모든 미합류 영역 포함 — 누락 없는지 (LLM · 캐시 · ruleCatalog · composite · contextExceptions · warningAck · stale · request-changes · delegate · priorReview · mediaThreshold · client · attachments)
- M0 v1.0 cascade Phase Alpha · Beta · M2+ 분류 정합
- EC-DEFER-05/07/12 해소 vs ruleCatalog 미합류 — FAQ published 가능하지만 ruleCatalog 없으면 manualReview만. plan § 1.1 "EC-DEFER-05 부분 해소" 정합

### DB 마이그레이션
- C0014 ComplianceRecord 풀 CHECK 4건 정합 — operator(peer) · Medium/High physician · LegalDocument legal · publishedAt+publishedBy
- C0014 compliance_content_type enum 10종 (M0 active) — DATA_MODEL C-10 17종 중 누락 7종 (MedicalConditionPage·ReviewPolicy·PricingPage·FacilitiesPage·NewsItem·ReservationPage·Feature) CA-DEFER-13 매핑 정합
- C0015 review_queue_type enum content-gate 만 — warning/stale enum ADD VALUE cascade 가 CA-DEFER-05·06 명시
- C0015 partial UNIQUE (open/in-progress entry per contentRef) — resubmit 시 idempotency 흐름 정합
- C0016 6 entity status unlock + compliance_record_id FK — Article/TreatmentPage 의 기존 nullable column 정합 (C0004/C0005 안 이미 존재) · Publication/Media는 ADD COLUMN 필요 정합
- C0016 기존 article published 1행 backfill 부재 — 운영 영향 명시 (개발자 수동 republish marker)

### AND 게이트
- finalRoles 계산 함수 — `operator` 전 콘텐츠 공통 (REVIEW_WORKFLOW § 4.1 정합)
- priorReviewRequired M0 v0.1 false fixed — CA-DEFER-08 정합. 그러나 plan § 3.1 안 priorReviewRequired ? legal: ∅ 로직은 effective no-op이지만 코드 잔존 — 정확성 정합
- isApprovedByAllFinalRoles — DB row null 검사 패턴 정합 · race condition 안전성

### check() stub
- pageRiskLevel = input.metadata.explicitRiskLevel ?? inferredRiskLevel ?? "Low" — RISK_LEVELS § 2.3 MAX 규칙 미적용 marker (CA-DEFER-02)
- catalogVersion/catalogHash = "m0-stub-v0.1"/"stub" — 호출자가 stub 식별 가능
- ComplianceCheckResult 의 다른 필드 (effectivePolicy · ruleMatchedCount · cacheKey 등) CONTENT_STANDARDS § 7.2 vs M0 stub 차이 검증

### server action
- 4 action 시그니처 + advisory lock + transition table — REVIEW_WORKFLOW § 2.3 트리거 표 정합
- assertReviewerEligibility — admin_user.physician_reviewer_eligible / legal_reviewer_eligible flag 존재 검증 (기존 schema 안 정합)
- audit emit 4종 — Audit Action 카탈로그 (REVIEW_WORKFLOW § 9.1.1 알림 정책) 정합

### 어드민 UI
- /review-queue list + detail — REVIEW_WORKFLOW § 3 · § 4 정합 (큐 우선순위 · SLA 표시 · 검수자별 화면 책임)
- 6 entity form status select 9-state — 풀 enum 활성화 정합. 그러나 직접 status='published' 입력 차단 (publishContent action 통해서만) — server action 안 status 전이 검증 정합
- 액션 버튼 — "검수 요청" (draft|rejected) · "발행" (publishable + operator role)

### 시나리오 14건 정합
- 시나리오 1~14 통과 기준 명시 — 자동 검증 가능 vs e2e 검증 분리 정합
- 시나리오 13 FAQ published EC-DEFER-05 부분 해소 — ruleCatalog 미합류이므로 manualReview only — plan 정합
- 시나리오 14 concurrent advisory_xact_lock — vitest scope vs e2e scope 명시

### docs cascade · CA-CASCADE 5종
- CA-CASCADE-01~05 docs 정합 — 각 cascade가 정확한 SoT 문서 + § 위치 식별

## Output format

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAM-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): compliance-assistant § X · REVIEW_WORKFLOW § Y · DATA_MODEL C-10 등
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition 점검
- CA-DEFER 매핑 완비성: <PASS|FAIL>
- 6 entity status unlock CHECK 4건 정합: <PASS|FAIL>
- finalRoles 공식 정합: <PASS|FAIL>
```

가능한 한 광범위하게 보고, plan § 또는 file:line 인용. 한국어로 응답.
