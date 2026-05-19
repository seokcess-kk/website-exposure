# ADMIN_UX_REDESIGN_PLAN v0.4 — cycle 4 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=4 (총 5)
- closeableAfterPatch: false → cycle 5 안 closeableAfterPatch=true 도달 예상 (blocking 0)
- 수렴 추세: 15 → 11 → 8 → **5** (감소 3 · 빠른 수렴)

## cycle 3 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| AUX3-01 (blocking) | § 7 순서 정정 | **PASS** — 7.1 → 7.2 → 7.3 → 7.4 → 7.5 → 7.6 → 7.7 → 7.8 → 7.9 |
| AUX3-02 (major) | § 4.3 computeRecommendedLintItems | **PASS** |
| AUX3-03 (major) | § 9.5 debounce + cache | **PASS** |
| AUX3-04 (major) | § 13 시나리오 24~27 | **PASS** |
| AUX3-05~08 (minor) | 모두 | **PASS** |

## major

- **AUX4-01**: § 6.2 FAQ 스프레드시트 — 붙여넣기 parse 안 보안 정책 부재 (XSS · 길이 제한 · 행 수 제한)
  - 위치: plan § 6.2 UX-MULTI-03
  - 근거(SoT): 사용자 안 외부 (Excel · 메모장) 안 데이터 붙여넣기 → 악성 input (script 태그 · 매우 긴 본문 · 1000+ 행) 가능. parse 안 차단 정책 부재.
  - 권장 patch: § 6.2 안 정책 추가 — "(1) 행 수 최대 100건 안 한 번 안 (초과 시 안내 + truncate). (2) 각 셀 안 최대 5000자 (질문 200 · 답변 5000) — truncate. (3) HTML 안 sanitize-html 안 unsafe tag 제거 (script · iframe · object 등). (4) 붙여넣기 후 preview + 사용자 명시 '저장' 클릭 전까지 commit 안 함".

## minor

- **AUX4-02**: § 12.1 마이그레이션 순서 10 단계 — entity 별 진행 순서 + 우선순위 결정 근거 부재
  - 위치: plan § 12.1 UX-MIGRATE-01 (1~10 순서 만 · 우선순위 결정 근거 없음)
  - 권장 patch: § 12.1 안 우선순위 설명 추가 — "1. 공통 UI primitive (가장 영향 큼) → 2. 출시 evaluator (의존 W2) → 3. 대시보드 (W3 가장 가시적 효과) → 4. ClinicProfile 단계형 (가장 복잡 + 사용자 진단 1순위) → ...".

- **AUX4-03**: § 8.3 페이지 상단 상태바 — 컴포넌트 spec 부재 (위치 · props · 표시 데이터)
  - 위치: plan § 8.3 UX-NOTIFY-04
  - 권장 patch: § 8.3 안 컴포넌트 spec — `PageStatusBar` props: { entityType, entityStatus, lifecycle, nextActions[] }. 위치: 각 entity edit page 안 header 아래. NavMenu + Breadcrumb 와 다른 layer.

- **AUX4-04**: § 13 시나리오 — 27건 총 카운트 vs § 1.2 표 안 "20+ 건" 표기 정합
  - 위치: plan § 1.2 (vitest scenarios 20+ 건) · § 13 (27건)
  - 권장 patch: § 1.2 표 안 "vitest scenarios **27건**" 정정.

- **AUX4-05**: § 14 W11 — vitest scenarios 23건 표기 vs § 13 27건 분기
  - 위치: plan § 14 W11 (`vitest scenarios 23건`)
  - 권장 patch: § 14 W11 안 "vitest scenarios **27건**" 정정.

## acceptance precondition 점검

- 패러다임 전환 (§ 2): **PASS**
- 3-layer 매트릭스: **PASS**
- 출시 evaluator chain: **PASS**
- 단계형 ClinicProfile: **PASS**
- 다건 등록 atomicity: **PASS** — AUX4-01 보안 정책 추가 시 100%
- 외부 API: **PASS**
- 문서 구조 정합: **PASS**
- 시나리오 총 27건 표기 정합: **CONDITIONAL** — AUX4-04·05

## 후속 cycle 권장 진행

cycle-5 patch sweep (closeableAfterPatch=true 도달 목표):
1. AUX4-01 (major) — § 6.2 보안 정책 추가
2. AUX4-02~05 (minor) — 표현/정합 patch

cycle-5 입력 = 본 cycle 5 finding 전건 수용 + v0.5 변경 이력. cycle 5 closeableAfterPatch=true 도달 시 v1.0 acceptance.
