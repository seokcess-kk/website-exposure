# LOCATION_LEGAL_PLAN v0.6 — codex 자동 비평 cycle 6

당신은 신중한 senior reviewer. cycle5 의 단일 blocker LL-56 (M0_BUILD_EXPORT_PLAN placeholder 부재) 해소 + LL-57·58 minor 수용 여부 + **closeableAfterPatch=true 도달 가능성** 평가.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.6 (cycle1~5 누계 58 findings 전건 수용)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder (신규 · LL-CASCADE-04 cascade target)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인)

## cycle5 → v0.6 patch 요약

| ID | patch |
|---|---|
| LL-56 (blocking) | `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder 실 파일 작성 완료 (§1.2 LL-CASCADE-04 책임 표 포함) |
| LL-57 (minor) | LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 이동. M0 v0.5 의 3종 subset 출시 가능 명시 |
| LL-58 (minor) | Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` 한 줄 명시 (LL-DEFER-18) |

## 검토 관점

### 1. cycle5 patch 수용 정합

- LL-56 — `docs/decisions/M0_BUILD_EXPORT_PLAN.md` 실 파일 존재 확인 (Test-Path true).
- 파일 content 가 LL-CASCADE-04 요구사항 충족 — `§ 1.2 LL-CASCADE-04 책임` 표가 LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT · primary_ctas id → @id alias 5 항목 모두 포함.
- LL-57 — LL-DEFER-19 가 §9.1 에서 사라지고 §9.2 M1 Phase Alpha 합류로 이동. phase 단일화.
- LL-58 — `apps/web/src/lib/observability.ts` 책임 위치 한 줄 명시.

### 2. closeableAfterPatch=true 도달 평가

memory/feedback_codex_review_cycle.md 의 4 조건:
1. 지적 수 감소·수렴 추세 (25→12→10→8→3→?) — cycle6 N ≤ 2 기대.
2. cascade 가 다른 SoT 충돌 없음.
3. 잔류 미결정이 모두 운영·인프라·M2+/M3+ 후속으로 분류 가능 (§9 LL-DEFER 20개 phase 분류 완료).
4. 보안·법적 critical 잔존 없음.

### 3. acceptance 후 작업 흐름 정합

- plan v1.0 acceptance commit = LOCATION_LEGAL_PLAN.md (`v1.0`) + LL-CASCADE-01 (ARCH § 3.8.2 patch) + LL-CASCADE-02 (ADMIN_UI_SKELETON_PLAN § 5.5 patch) + LL-CASCADE-03 (CONTENT_STANDARDS § 7 patch) + LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN.md placeholder) + LL-CASCADE-05 (packages/migrations-runner manifest spec) — 5 cascade 동시.
- 그 후 코드 작업 (§ 8 9개 + cascade 마무리 작업) 진입 가능?

### 4. M0_BUILD_EXPORT_PLAN.md 자체 결함

- placeholder v0.1 의 content 가 SoT 정합?
- § 1.2 LL-CASCADE-04 책임 표 5항목 + § 2 작업 단위 (M0 v1.0 합류) + § 3 비범위.
- LocationProfile.businessHours DB metadata 직접 사용 (CT-02 SoT 형식 그대로) 명시 정합?
- placeholder 의 SoT 인용 (LOCATION_LEGAL_PLAN reference · ARCH § 3.8.1·3.8.2 · DATA_MODEL) 충분?

### 5. 잔존 결함

- 본 plan v0.6 안 LL-DEFER 20개 중 phase 분류가 진정 모두 단일?
- LL-CASCADE 5개 acceptance precondition 모두 plan v1.0 acceptance commit 안 동시 patch?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 6,
  "closeableAfterPatch": true | false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10 → 8 → 3. cycle6 0~2 findings 예상. closeableAfterPatch=true 도달 후보. blocking 0 + critical/major 0 + minor 0~2 의 경우 close 신호.
