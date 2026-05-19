# ADMIN_UX_REDESIGN_PLAN v0.1 — cycle 1 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=4 major=5 minor=6 (총 15)
- closeableAfterPatch: false (blocking 4 잔존)
- 수렴 추세: (이전 cycle 없음 — 본 cycle 첫)

## blocking

- **AUX-01**: § 4.3 출시 evaluator vs § 11 compliance publishable evaluator 통합 알고리즘 부재
  - 위치: plan § 4.3 (evaluateClinicProfileRelease) · § 11 (품질 점수) · UX-CASCADE-06 (compliance + 출시 evaluator chain marker 만)
  - 근거(SoT): COMPLIANCE_ASSISTANT_M0_PLAN § 1.2 publishable evaluator (CA-GATE-03) — REVIEW_WORKFLOW § 7.1 6조건 모두 evaluate (automatedDecision · finalRoles · priorReview · staleFlags · LegalDocument · warningAck). 본 plan 안 별 evaluator 신설했지만 compliance 와 어떻게 통합되는지 알고리즘 부재.
  - 문제: 두 evaluator 결과 충돌 시 (예: compliance "publishable" 인데 본 plan "출시 차단") 어느 우선? 운영자 표시 안 분리 표시? 통합?
  - 권장 patch: § 4.3 안 결정 명시 — "본 plan 안 release evaluator = entity 단위 출시 schema (L3 zod) 통과 + compliance publishable evaluator 통과 양쪽 모두 만족". UX-CASCADE-06 marker 안 구체 chain 알고리즘 (evaluateRelease(entity) = parseL3(entity) && compliancePublishable(entity)) 추가.

- **AUX-02**: § 5.3 LWI-01 호환성 안 snapshot isolation 충돌 위험 미해결
  - 위치: plan § 5.3 UX-CLINIC-04
  - 근거(SoT): LOCATION_LEGAL_PLAN LWI-01 — ClinicProfile + LocationProfile(main) + 5 LegalDocument **한 tx 안 동시 저장** (정책 변수 정합 보장). 본 plan § 5.3 안 단계 5 안 ClinicProfile/LocationProfile 의 최신 DB SELECT → 변수 렌더 → 5 LegalDocument body 갱신.
  - 문제: 단계 1~4 안 개별 PATCH 가 tx 단위 분리되어 진행 — 단계 5 안 다시 ClinicProfile read 시 단계 1~4 의 commit 안전성 가정. 그러나 동시 운영자 작업 (또는 단계 1~4 안 race) 시 변수 정합 깨질 수 있음.
  - 권장 patch: § 5.3 UX-CLINIC-04 안 정정 — "단계 5 진입 시점 안 transaction-safe SELECT FOR UPDATE 안 ClinicProfile + LocationProfile lock → 변수 렌더 → 5 LegalDocument body 갱신 → commit. 단계 1~4 의 동시 PATCH 차단 (단계 5 진입 시 lock 안)". 또는 단계 5 안 단순 저장 시점 안 만 통합 tx (단계 5 안 entry 시점 안 변수 렌더 만).

- **AUX-03**: § 4.2 마이그레이션 안 backfill 불필요 가정 위험
  - 위치: plan § 4.2 UX-LAYER-04 ("기존 published row 안 NULL row 없음 가정")
  - 근거(SoT): 본 cycle 안 1호 운영 사용자 (다이트 한의원) 안 published clinic_profile row 안 logo_url 채워진 상태 확인. 그러나 1호만 가정 — 향후 다른 instance 안 미 채움 published row 있을 수 있음.
  - 문제: ALTER TABLE ... DROP NOT NULL 안전. 그러나 publish gate 안 변경 후 기존 published row 안 출시 evaluator 통과 안 됨 (logo_url NULL 인 채로 published) → dashboard 안 "출시 차단" 표시 misleading.
  - 권장 patch: § 4.2 UX-LAYER-04 안 정정 — migration 안 backfill check 추가 (existing published row 안 NULL count 검증 + 0이 아니면 invariant marker). 0 이상 시 운영자 안 안내 ("기존 published 안 N개 row 안 logo_url 미채움 — 출시 evaluator 안 차단 표시"). 또는 published row 안 lifecycle 안 backwards compat marker (기존 published 인 row 는 lifecycle 안 'published' 그대로 유지 · 출시 evaluator 안 retrospective check 안 함).

- **AUX-04**: § 2.2 instance lifecycle derived 결정 (UX-LIFECYCLE-03) vs § 2.2 published 단계 안 운영자 명시 액션 불일치
  - 위치: plan § 2.2 (lifecycle 4 단계 — published 안 "운영자 '출시' 클릭") · UX-LIFECYCLE-03 (DB column 부재 + 산정 함수 안 derived)
  - 근거(SoT): § 2.2 안 published 단계 진입 = 검수자 approve + 운영자 "출시" 클릭. 운영자 명시 액션 = state 가 어딘가 보존되어야 함. derived (entity 상태 + setting 기반) 만으로 산정 불가.
  - 문제: derived 안 published 와 ready 구분 불가. release-pending 도 동상.
  - 권장 patch: § 2.2 UX-LIFECYCLE-03 결정 정정 — instance.release_state JSONB column 신설 (`{ state: "draft"|"ready"|"release-pending"|"published", lastTransitionAt, transitionBy }`). 또는 별 table `instance_release_state`. derived 안 ready 만 (출시 evaluator 통과 시 자동) · release-pending/published 는 명시 column.

## major

- **AUX-05**: § 8.2 NotificationInbox UI 안 admin 컴포넌트 RLS scope 미정의
  - 위치: plan § 8.2 UX-NOTIFY-02
  - 근거(SoT): notification_outbox 안 RLS policy = `app_tenant_user` role + `app.current_instance_id` GUC. admin layout 안 sqlBase (base role) 안 호출 vs scoped tx (app_tenant_user) 호출 결정 필요.
  - 문제: NotificationInbox UI 가 server component 안 호출 시 어떤 connection pool 사용? 어드민 layout 안 이미 ScopedTx 패턴 있음. 본 plan 안 명시 부재.
  - 권장 patch: § 8.2 UX-NOTIFY-02 안 명시 — "NotificationInbox UI 는 server component 안 withSkeletonTx 안 호출 (현 admin tenant context 안 RLS 자동 통과). notification_outbox SELECT 시 instance_id 안 자동 필터".

- **AUX-06**: § 6.1 의료진 인라인 테이블 일괄 저장 안 부분 실패 처리 정책 부재
  - 위치: plan § 6.1 UX-MULTI-02
  - 근거(SoT): Promise.allSettled 안 부분 성공/실패 분기. 그러나 사용자 표시 + audit 정합 미정의.
  - 문제: 5 row 안 3 commit + 2 fail 시 — 성공 row 는 즉시 DB 반영 (rollback 안 됨). 실패 row 안 인라인 에러 + 사용자 재시도 시 새 row 만. 저장 atomicity 깨짐 + 사용자 mental model 안 일관성 부재.
  - 권장 patch: § 6.1 UX-MULTI-02 안 명시 — "일괄 저장 = single tx 안 모든 row 처리. 한 row 실패 시 전체 rollback + 인라인 에러 안 어느 row · 어느 field 표시. atomicity 보장". 또는 partial commit 안 audit 안 각 row commit/rollback 명확 기록.

- **AUX-07**: § 6.3 시술 슬롯형 에디터 body_markdown slot marker 안 사용자 입력 conflict
  - 위치: plan § 6.3 UX-MULTI-04·05
  - 근거(SoT): slot marker `<!-- slot:overview -->` 안 markdown comment. 사용자가 본문 안 직접 markdown comment 입력 시 (또는 slot 이름 사용 시) parser 안 잘못된 split.
  - 문제: body_markdown 안 single string 안 marker 안 wrap — markdown 안 comment 가 일반 텍스트 처리되거나 (HTML 안 렌더 안 보임) parser 안 nested marker 처리 부재.
  - 권장 patch: § 6.3 UX-MULTI-04·05 안 정정 — (option A) DB schema 안 별 column 신설 (treatment_page.body_slots JSONB) · 마이그레이션 동반. (option B) slot marker 안 unique sentinel 안 (예: `<!--__GLITZY_SLOT__:overview__-->` · 사용자 입력 안 본 sentinel 차단 + sanitize). 본 plan 채택 = option A 권장 (slot SoT 명확).

- **AUX-08**: § 9 외부 API 자동 채움 안 rate limit + retry policy 부재
  - 위치: plan § 9.1·9.2·9.3·9.4
  - 근거(SoT): CrossRef rate limit (50 req/sec 권장 · 무료 tier 안 throttle). PubMed eutils 안 3 req/sec (무료 · API key 안 10 req/sec). YouTube oEmbed 안 rate limit 명시 없음 (사실상 무제한 · 단 abuse 시 IP block).
  - 문제: rate limit hit 시 (예: CrossRef 429) retry/backoff 정책 부재. 동시 운영자 호출 시 같은 endpoint 안 burst.
  - 권장 patch: § 9 UX-EXT-04 안 정정 — "429 응답 시 단일 retry (1s backoff) 후 fail (사용자 안 '잠시 후 다시 시도' 안내). per-instance throttle (PubMed 안 3 req/sec) 안 SimpleQueue helper · 본 plan v0.1 안 단순 fire-and-forget · M1 안 정식 queue".

- **AUX-09**: § 11 품질 점수 산정 알고리즘 구체 fn 부재
  - 위치: plan § 11.1 UX-QUALITY-01
  - 근거(SoT): § 3.2 안 출시 권장 lint 8 룰 (가중치 3~5). 추가 신호 (E-A-T · SEO · 컴플라이언스) 언급만.
  - 문제: 점수 산정 함수 alg 구체 부재. "합산 / 가중치 총합 * 100" 만 — 추가 신호 (E-A-T · SEO · 컴플라이언스) 안 가중치 미정.
  - 권장 patch: § 11.1 UX-QUALITY-01 안 표 추가 — 카테고리별 가중치 (출시 권장 lint 30% · E-A-T 신호 30% · SEO 신호 20% · 컴플라이언스 신호 20%) · 각 카테고리 안 구체 룰 + 가중치. computeQualityScore() 함수 시그니처.

## minor

- **AUX-10**: § 1.2 안 "10 entity" 정확 검증 필요 — Article·TreatmentPage·FAQ·Publication·MediaAppearance·LegalDocument·DoctorProfile·ClinicProfile·LocationProfile·ArticleCategory = 10
  - 위치: plan § 1.2 (W5 entity 별 zod schema 분리 — 10 entity) · § 14 W5
  - 권장 patch: § 14 W5 안 entity 명세 (10 entity 정확 list) + 우선순위 (ClinicProfile 먼저 · 나머지 9 entity 순차).

- **AUX-11**: § 8.1 Toast 자체 구현 권장 vs sonner — 구체 사양 부재
  - 위치: plan § 8.1 UX-NOTIFY-01
  - 권장 patch: § 8.1 안 구체 사양 — 위치 (top-right) · 자동 dismiss (success 3s · error 7s · info 5s) · stack 안 최대 5개 · 우선순위 (error > info > success).

- **AUX-12**: § 15 UX-DEFER 15종 vs § 1.3 비범위 15종 중복 표기 정합 검증
  - 위치: plan § 1.3 + § 15
  - 권장 patch: § 15 안 phase 별 그룹화 (M1 / Phase Beta / M2+ / 다른 cycle cascade) · § 1.3 표 와 1:1 매핑 marker.

- **AUX-13**: § 14 W6 — C0023 migration 안 ALTER TABLE 동시 영향 entity 다수 (clinic_profile + 9 entity)
  - 위치: plan § 14 W6
  - 권장 patch: § 14 W6 안 분리 결정 — entity 별 migration (C0023a·b·c · 10개 migration) vs 단일 (C0023). 단일 안 advisory lock + rollback 안전성. 본 plan 채택 = entity 별 분리 (안전 + reviewable).

- **AUX-14**: § 7.4 WorkflowActionGroup — 기존 WorkflowActionButtons backwards-compat 결정 부재
  - 위치: plan § 7.4 UX-UI-04
  - 권장 patch: § 7.4 안 명시 — "기존 WorkflowActionButtons 안 deprecate · 새 WorkflowActionGroup 안 superset. 기존 사용처 (6 entity edit page) 안 점진적 migration. M0 안 양쪽 alias 가능".

- **AUX-15**: § 13 시나리오 — vitest fixture (admin_user · instance_membership · 9 entity) 표준 setup 부재
  - 위치: plan § 13 시나리오 1~20
  - 권장 patch: § 13 안 fixture 표준 marker — "각 시나리오 안 beforeEach 안 sharedFixture() helper (instance + operator + medical-reviewer + legal-reviewer + 모든 entity 안 minimal 1+ row) 사용. helper 안 reset 동작. 시나리오 별 fixture 변형 (예: 시나리오 8 — submitter active=false) 만 override".

## acceptance precondition 점검

- UX-DEFER 매핑 완비성 (15종 + P0/P1/P2 cascade 매핑): **PASS** — 모든 P0/P1/P2 항목 cascade 정합
- 패러다임 전환 정의 (§ 2) 명확성: **PASS**
- 3-layer 매트릭스 (DB CHECK · zod 저장 · zod 출시) 정합: **CONDITIONAL** — AUX-03 backfill 처리 미정
- 출시 evaluator + compliance publishable evaluator 통합: **FAIL** — AUX-01 알고리즘 부재
- 5 단계 ClinicProfile + LWI-01 호환성: **FAIL** — AUX-02 snapshot isolation 미해결
- instance lifecycle derived vs 명시 column: **FAIL** — AUX-04 published 안 명시 액션 필요
- 다건 등록 UX (atomicity): **CONDITIONAL** — AUX-06 부분 실패 정책 미정
- 외부 API (rate limit · retry): **CONDITIONAL** — AUX-08 정책 부재
- UX-CASCADE 10종 정합: **PASS**

## 후속 cycle 권장 진행

cycle-2 patch sweep:
1. AUX-01~04 (blocking) — algorithm/decision 명시 patch
2. AUX-05~09 (major) — 구체 사양 + 정책 patch
3. AUX-10~15 (minor) — 표현/정합 patch

cycle-2 입력 = 본 cycle 15 finding 전건 수용 patch + v0.2 변경 이력.
