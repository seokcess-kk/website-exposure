# ADMIN_UX_REDESIGN_PLAN v0.3 — cycle 3 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=1 major=3 minor=4 (총 8)
- closeableAfterPatch: false (blocking 1)
- 수렴 추세: cycle 1 = 15 → cycle 2 = 11 → cycle 3 = **8** (감소 3)

## cycle 2 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| AUX2-01 (blocking) | § 4.3 evaluateInstanceRelease alg | **PASS** |
| AUX2-02 (blocking) | § 5.3 lock 순서 LL-ACTION-04 정합 | **PASS** |
| AUX2-03 (major) | § 4.2 9 entity layer 표 | **PASS** |
| AUX2-04 (major) | § 8.4 M0 단순화 + UX-DEFER-16 | **PASS** |
| AUX2-05 (major) | § 9.5 blur trigger | **PASS** |
| AUX2-06 (major) | § 10 iframe SAMEORIGIN | **PASS** |
| AUX2-07~11 (minor) | 모두 | **PASS** |

## blocking

- **AUX3-01**: § 7.5~7.9 안 컴포넌트 5종 명세 (DirtyIndicator · ErrorSummary · FieldErrorBubble · ReleasePreviewModal · QualityScoreCard) 가 § 7.4 (WorkflowActionGroup) **앞에** 잘못 위치 — 문서 구조 깨짐
  - 위치: plan § 7 안 7.2 SaveStatusPanel → 7.3 StatusBadge → 7.5~7.9 → 7.4 WorkflowActionGroup 순서 — 번호 순서 깨짐
  - 근거(SoT): 본 cycle2 AUX2-08 patch 시 § 7.5~7.9 안 § 7.4 **앞에** insert 됨 (잘못된 anchor 선택).
  - 문제: 문서 구조 안 § 7.4 가 § 7.9 뒤에 위치 — 독자 혼동.
  - 권장 patch: § 7.5~7.9 안 § 7.4 뒤로 이동. § 7 안 순서 = 7.1 카탈로그 → 7.2 SaveStatusPanel → 7.3 StatusBadge → 7.4 WorkflowActionGroup → 7.5 DirtyIndicator → 7.6 ErrorSummary → 7.7 FieldErrorBubble → 7.8 ReleasePreviewModal → 7.9 QualityScoreCard.

## major

- **AUX3-02**: § 4.3 출시 evaluator chain — `evaluateInstanceRelease()` 안 8 권장 lint 산정 `computeRecommendedLintItems()` 시그니처 부재
  - 위치: plan § 4.3 evaluateInstanceRelease 본문 안 `recommendedItems = computeRecommendedLintItems(input)` 호출 만 · helper 시그니처 미명시
  - 권장 patch: § 4.3 안 helper 시그니처 추가 — `computeRecommendedLintItems(input: InstanceEntities): ReleaseChecklistItem[]`. § 3.2 안 8 권장 lint 룰 안 각 entity 별 산정 코드 sketch.

- **AUX3-03**: § 9.5 UX-EXT-05 — blur trigger 안 debounce 부재 (사용자가 빠르게 입력 + blur 시 매 blur 마다 fetch · rate limit hit 가능)
  - 위치: plan § 9.5 UX-EXT-05
  - 권장 patch: § 9.5 안 정정 — "blur trigger 안 300ms debounce 안 (사용자가 빠르게 다른 필드로 이동 시 마지막 입력 만 fetch). 동일 DOI/URL 재입력 시 cache (sessionStorage) 안 결과 재사용 — 동일 ID 안 매 blur 마다 fetch 회피".

- **AUX3-04**: § 13 시나리오 23건 — 본 plan 안 추가 영역 (전역 toast · NotificationInbox UI · 인라인 테이블 atomicity · 출시 lifecycle 전이) 시나리오 부재
  - 위치: plan § 13 (시나리오 1~23)
  - 권장 patch: § 13 안 시나리오 추가 — 24 (전역 toast 표시 + 자동 dismiss + stack 동작) · 25 (NotificationInbox UI 안 종 아이콘 클릭 → notification_outbox 안 최근 20건 표시 + RLS 자동 필터) · 26 (의료진 인라인 테이블 안 일괄 저장 + 한 row 실패 시 전체 rollback) · 27 (instance lifecycle 전이 — draft → release-pending 진입 시 audit_event 'instance-lifecycle-transitioned' emit). 시나리오 총 27건.

## minor

- **AUX3-05**: § 5.1 5 단계 정의 표 — 단계 1~4 안 "출시 차단 룰" column 안 lint id 만 명시 · § 3.2 안 룰 id 와 1:1 매핑 검증 필요
  - 위치: plan § 5.1 단계 1~5 표
  - 권장 patch: § 5.1 표 안 출시 차단 룰 lint id 안 § 3.2 정확 매핑 검증 (현재 정합 OK — 단계 5 안 policy-contact-person · legal-documents-all-published 만 있음 · § 3.2 11 룰 중 단계 별 위치 일치).

- **AUX3-06**: § 11.1 품질 점수 — `computeQualityScore()` 시그니처 안 input 타입 정의 부재
  - 위치: plan § 11.1 (`computeQualityScore(input: QualityScoreInput)` 만 · QualityScoreInput type 부재)
  - 권장 patch: § 11.1 안 type 추가 — `type QualityScoreInput = InstanceEntities & { complianceFindings: ComplianceFinding[]; sitemapEntryCount: number; };`.

- **AUX3-07**: § 16 UX-CASCADE 10종 — UX-CASCADE-11 신설 필요 (cycle2 AUX2-11 안 entity 별 migration 분리 marker · 본 cascade 안 manifest 단계 33 표기 만 · 별 cascade marker 안 entity 별 분리 정책 결정 자체 cascade)
  - 위치: plan § 16
  - 권장 patch: UX-CASCADE-11 신설 — "`packages/core-content/migrations/` — entity 별 release schema split migration 분리 패턴 (C0023a~j 10 migration) marker. 본 패턴 미래 모든 entity 안 schema 변경 시 동일 분리 적용 권장 (rollback 안전 + advisory lock 단일 entity)".

- **AUX3-08**: § 14 W6 — entity 별 migration 분리 (C0023a~j) 안 각 migration 안 정확 entity 표 부재
  - 위치: plan § 14 W6
  - 권장 patch: § 14 W6 안 표 추가 — C0023a (clinic_profile · L1 logo_url/og_image_url/policy_* nullable 화 + grandfather backfill) · C0023b (location_profile) · ... · C0023j (article_category). C0024 (instance_release_state · separate).

## acceptance precondition 점검

- 패러다임 전환 (§ 2): **PASS**
- 3-layer 매트릭스 정합: **PASS**
- 출시 evaluator chain: **CONDITIONAL** — AUX3-02 helper 시그니처
- 단계형 ClinicProfile: **PASS**
- 다건 등록 atomicity: **PASS**
- 외부 API: **CONDITIONAL** — AUX3-03 debounce
- UX-CASCADE 정합: **CONDITIONAL** — AUX3-07 UX-CASCADE-11 신설
- 문서 구조 정합: **FAIL** — AUX3-01 § 7 순서 깨짐

## 후속 cycle 권장 진행

cycle-4 patch sweep:
1. AUX3-01 (blocking) — § 7.5~7.9 안 § 7.4 뒤로 이동
2. AUX3-02·03·04 (major) — helper 시그니처 + debounce + 시나리오 4건 추가
3. AUX3-05~08 (minor) — § 5.1/11/16/14 정합 patch

cycle-4 입력 = 본 cycle 8 finding 전건 수용 + v0.4 변경 이력.
