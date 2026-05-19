# ADMIN_UX_REDESIGN_PLAN v0.2 — cycle 2 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=2 major=4 minor=5 (총 11)
- closeableAfterPatch: false (blocking 2)
- 수렴 추세: cycle 1 = 15 → cycle 2 = **11** (감소 4)

## cycle 1 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| AUX-01 (blocking) | § 4.3 chain alg | **PASS** |
| AUX-02 (blocking) | § 5.3 SELECT FOR UPDATE | **PASS** |
| AUX-03 (blocking) | § 4.2 grandfather backfill | **PASS** |
| AUX-04 (blocking) | § 2.2 hybrid + release_state column | **PASS** |
| AUX-05 (major) | § 8.2 NotificationInbox RLS | **PASS** |
| AUX-06 (major) | § 6.1 atomicity | **PASS** |
| AUX-07 (major) | § 6.3 body_slots column | **PASS** |
| AUX-08 (major) | § 9.4 retry policy | **PASS** |
| AUX-09 (major) | § 11.1 4 카테고리 가중치 | **PASS** |
| AUX-10·14 (minor) | § 14 W5 entity list | **PASS** |
| AUX-11 (minor) | § 8.1 Toast 구체 사양 | **PASS** |
| AUX-13 (minor) | § 14 W6 분리 + body_slots | **PASS** |
| AUX-14 (minor) | § 7.4 backwards-compat | **PASS** |
| AUX-15 (minor) | § 13 sharedFixture | **PASS** |

## blocking

- **AUX2-01**: § 4.3 출시 evaluator chain — `evaluateInstanceRelease()` 안 알고리즘 명시 부재 (entity 별 evaluator 가 정의됐지만 instance 단위 통합 산정 함수 정의 부재)
  - 위치: plan § 4.3 마지막 표 ("InstanceRelease (통합) — 모든 entity 의 release evaluator 결과 합산 + 필수 entity 1+ 존재 검증" — 텍스트만)
  - 근거(SoT): § 3.2 출시 차단 lint 11 룰 안 instance level 결정 (예: doctor-min-one · treatment-or-article-min-one · legal-documents-all-published). 본 룰들은 entity 별 evaluator 가 산정 못함 — instance 단위.
  - 문제: `evaluateInstanceRelease()` 시그니처 + 알고리즘 부재 — entity 별 evaluator 결과 합산 만으로는 "의료진 1+ active" 같은 collection-level 검증 못함.
  - 권장 patch: § 4.3 안 `evaluateInstanceRelease()` 시그니처 + 알고리즘 명시:
    ```typescript
    type InstanceEntities = { clinic, location, doctors[], treatments[], articles[], faqs[], publications[], media[], legals[], categories[] };
    type InstanceReleaseResult = { releasable: boolean; blockers: ReleaseBlocker[]; recommendedItems: ReleaseChecklistItem[]; lifecycle: "draft"|"ready"|"release-pending"|"published" };
    function evaluateInstanceRelease(input: InstanceEntities, releaseState: InstanceReleaseStateRow): InstanceReleaseResult {
      // (1) entity 별 evaluator 호출 (published 만 evaluator 통과 검증)
      // (2) 11 차단 lint 산정 (collection-level)
      // (3) lifecycle 산정 — releaseState.state 우선 · 'draft' 시 evaluator 통과 → 'ready' derived
      // (4) recommendedItems = 8 권장 lint 산정
    }
    ```

- **AUX2-02**: § 5.3 LWI-01 단계 5 lock 패턴 안 deadlock risk 미해결
  - 위치: plan § 5.3 UX-CLINIC-04·05 (단계 5 안 ClinicProfile + LocationProfile FOR UPDATE)
  - 근거(SoT): 두 row lock 안 동시 운영자 (예: 운영자 A 가 단계 1 안 ClinicProfile PATCH · 운영자 B 가 단계 5 안 진입 시 ClinicProfile + LocationProfile lock) 안 deadlock 가능. A 의 ClinicProfile lock + B 의 LocationProfile lock 후 cross wait.
  - 문제: lock 순서 미정의 — deadlock detection 안 PostgreSQL 자동 rollback 하지만 사용자 안 fail.
  - 권장 patch: § 5.3 UX-CLINIC-05 정정 — lock 순서 명시 ("ClinicProfile 먼저 → LocationProfile 후"). 모든 단계 1~4 PATCH 도 동일 순서 강제. ClinicProfileForm 안 기존 actions.ts 안 이미 ClinicProfile → LocationProfile → LegalDocument alpha 순서 정의 (LL-ACTION-04) — 본 plan 안 동일 정합 marker 추가.

## major

- **AUX2-03**: § 4.2 entity 별 layer 매핑 표 — ClinicProfile 만 명시 · 나머지 9 entity 표 부재
  - 위치: plan § 4.2 UX-LAYER-03 (`ClinicProfile 예시` 표 만)
  - 근거(SoT): 10 entity 모두 zod 저장 schema + 출시 schema 분리 작업 안 매핑 필요.
  - 권장 patch: § 4.2 안 9 entity (LocationProfile · DoctorProfile · TreatmentPage · Article · FAQ · Publication · MediaAppearance · LegalDocument · ArticleCategory) 의 layer 매핑 표 추가. M0 코드 cycle 안 정합.

- **AUX2-04**: § 8.4 대시보드 알림함 — 표시 정책 + 페이징 + dismissed/read 추적 부재
  - 위치: plan § 8.4 UX-NOTIFY-05
  - 근거(SoT): notification_outbox 안 status 컬럼 ('pending'/'completed'/'deduped'). 어드민 안 사용자 안 "본 알림 = 읽음" 추적 column 부재.
  - 문제: 대시보드 안 매 진입 시 동일 알림 표시 = 누적 노이즈. 운영자 안 dismiss/read marking 필요.
  - 권장 patch: § 8.4 안 정정 — (option A) admin_user_notification_read JOIN table 신설 (각 admin_user × notification_outbox 안 read_at) — 마이그레이션 동반. (option B) 최근 N건 만 표시 (페이징 만 · read 추적 안 함) — M0 단순화. 본 plan 채택 = option B (M0 안 단순) + UX-DEFER-XX marker (option A 안 M1 합류).

- **AUX2-05**: § 9 외부 API — Publication entity 안 DOI/PMID 안 자동 호출 trigger 정의 부재
  - 위치: plan § 9.1·9.2
  - 근거(SoT): Publication form 안 DOI 입력 후 어떻게 자동 호출 trigger? blur · explicit 버튼 · debounce?
  - 권장 patch: § 9 UX-EXT-05 신설 — "DOI/PMID/URL 입력 후 blur (focus 이탈) 시 자동 fetch + form 안 비어 있는 필드 prefill (덮어쓰기 옵션은 site-meta-fetch 패턴 정합). 또는 explicit '자동 채움' 버튼 클릭. 본 plan 채택 = 양쪽 가능 (blur auto + manual button)".

- **AUX2-06**: § 10 ReleasePreviewModal iframe 미리보기 — auth 안 보안 정책 부재
  - 위치: plan § 10.1 UX-PREVIEW-01
  - 근거(SoT): iframe 안 공개 사이트 (`/{instanceSlug}/`) 안 SSR 안 표시. 그러나 운영자 admin 안에서 iframe 안 다른 origin 안 로드 시 X-Frame-Options · CSP 안 영향.
  - 권장 patch: § 10.1 안 정정 — "iframe src 안 같은 origin (`/{instanceSlug}` · admin 과 동일 도메인 안). X-Frame-Options 안 `SAMEORIGIN` 정합 (Next.js default · 미설정 시 add to next.config.js)". 사이트 빌드 export 합류 시 (M0_BUILD_EXPORT) 도메인 분리 시 별 iframe 정책 cascade.

## minor

- **AUX2-07**: § 1.2 비범위 표 안 UX-DEFER-15 명시 (admin dark mode toggle) — 그러나 § 1.2 표 자체 안 미포함
  - 위치: plan § 1.2 비범위 표 (UX-DEFER-01~15 중 15만 포함 안 됨)
  - 권장 patch: § 1.2 표 안 UX-DEFER-15 행 추가 — "admin 안 dark mode toggle UI | PSR-DEFER-03 정합 cascade | UX-DEFER-15".

- **AUX2-08**: § 7.1 컴포넌트 카탈로그 — 8 컴포넌트 명세 안 실제 props/api 부재 (SaveStatusPanel · WorkflowActionGroup · QualityScoreCard 만 부분 명시)
  - 위치: plan § 7.2 (SaveStatusPanel · 명시 OK) · § 7.3 (StatusBadge · 명시) · § 7.4 (WorkflowActionGroup · 명시) · 나머지 5개 (DirtyIndicator · ErrorSummary · FieldErrorBubble · ReleasePreviewModal · QualityScoreCard) 명시 부재
  - 권장 patch: § 7.5~7.9 신설 — 각 컴포넌트 안 props 명세 (DirtyIndicator props { isDirty, lastSavedAt } · ErrorSummary props { errors, onClickField } 등).

- **AUX2-09**: § 13 시나리오 — 20건 만 정의 · 본 plan 안 추가 영역 (외부 API auto-fill · 단계 5 LWI lock · grandfather flag) 시나리오 부재
  - 위치: plan § 13 (시나리오 1~20)
  - 권장 patch: § 13 안 시나리오 추가 — 21 (CrossRef DOI auto-fill + 응답 mapping) · 22 (단계 5 진입 시 lock + 동시 단계 1 PATCH 차단) · 23 (grandfather flag = true 인 published row 안 출시 evaluator skip + UI 안 "(기존 발행분)" 안내 표시). 시나리오 총 23건.

- **AUX2-10**: § 14 작업 manifest — W1~W12 안 각 작업 안 dependsOn 명시 부재 (W3 대시보드 안 W2 evaluator · W2 안 W6 마이그레이션 등 의존성)
  - 위치: plan § 14
  - 권장 patch: § 14 표 안 "depends_on" column 추가. 의존성 명시 — W3 ← W2 ← W6 · W4 ← W1 · W7 ← W1 · W8 ← W1 · W10 ← W2 · W11 ← all · W12 ← W2·W6.

- **AUX2-11**: § 16 UX-CASCADE 10종 — manifest 단계 수 cascade (현 22 → 23 단계) marker 안 entity 별 분리 (10 migration) 정합 안 됨
  - 위치: plan § 16 UX-CASCADE-09 ("C0023 release schema split migration 안 manifest 추가 (현 22 단계 → 23 단계)")
  - 근거(SoT): cycle1 AUX-13 정정 시 entity 별 분리 (C0023a~j 10 migration) + C0024 instance_release_state = 총 11 migration 추가. manifest 22 → **33 단계**.
  - 권장 patch: § 16 UX-CASCADE-09 정정 — "manifest 22 → **33 단계** (C0023a~j 10 · C0024 1)".

## acceptance precondition 점검

- UX-DEFER 매핑 완비성: **CONDITIONAL** — AUX2-07 § 1.2 표 안 누락
- 패러다임 전환 (§ 2): **PASS**
- 3-layer 매트릭스 정합: **CONDITIONAL** — AUX2-03 entity 별 매핑 표 부재 (9 entity)
- 출시 evaluator chain: **CONDITIONAL** — AUX2-01 instance 단위 통합 evaluator 미정의
- 단계형 ClinicProfile LWI 호환성: **CONDITIONAL** — AUX2-02 deadlock risk 미해결
- instance lifecycle: **PASS**
- 다건 등록 atomicity: **PASS**
- 외부 API rate limit: **PASS** — 단 AUX2-05 trigger 정책 부재
- UX-CASCADE 정합: **CONDITIONAL** — AUX2-11 manifest 단계 수 부정확

## 후속 cycle 권장 진행

cycle-3 patch sweep:
1. AUX2-01·02 (blocking) — evaluateInstanceRelease 알고리즘 + lock 순서 정합
2. AUX2-03~06 (major) — entity 별 layer 매핑 표 + 알림함 정책 + 외부 API trigger + iframe 보안
3. AUX2-07~11 (minor) — § 1.2/7/13/14/16 정합 patch

cycle-3 입력 = 본 cycle 11 finding 전건 수용 + v0.3 변경 이력.
