# LOCATION_LEGAL_PLAN v0.5 — codex 자동 비평 cycle 5

당신은 신중한 senior reviewer. v0.4 cycle4 8 findings 가 v0.5 patch 에서 전건 수용되었는지 + 새로 생긴 cascade 결함 + 회귀 여부 + **closeableAfterPatch 도달 가능성** 을 평가하라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.5 (cycle1 25 + cycle2 12 + cycle3 10 + cycle4 8 = **55 findings 누계 전건 수용**)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인): `packages/core-content/migrations/C0001`/`C0002`/`C0004`/`C0005` · `packages/migrations-runner/src/index.ts` · `apps/web/src/lib/*.ts`

## cycle4 → v0.5 patch 요약

| ID | patch |
|---|---|
| LL-48 | trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' — errors.ts 매핑 가능 |
| LL-49 | LL-CASCADE-04 target 정정 — `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + 책임 row 1건 cascade |
| LL-50 | CT-03 enum SoT 정렬 — DB trigger 11종 + UI subset 3종 + LL-DEFER-19 8종 UI 합류 |
| LL-51 | form (b) UI copy 정정 — `kakao-talk`/`naver-reservation` 토큰 |
| LL-52 | LL-DEFER-04/05 phase 통일 — §9.3 M0 v1.0 본 구현 (LocationProfile 편집 화면) |
| LL-53 | LL-CASCADE-05 강도 명시 — manifest spec 작성만 plan acceptance 차단, 실 runner 는 LL-DEFER-20 |
| LL-54 | trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 |
| LL-55 | Sentry pre-integration fallback — v0.5 단계 console/server stdout only, M0 v1.0 합류 후 capture |

## 검토 관점

### 1. cycle4 patch 수용 정합

- LL-48~LL-55 각 patch 본문 반영 + 의도된 효과 충족.
- patch 가 cycle1~3 의 결정을 회귀시키지 않았는지.

### 2. closeableAfterPatch 도달 평가

- 본 plan v0.5 가 ready_for_acceptance=true 신호 (closeableAfterPatch: true) 의 4가지 마감 조건 충족 여부 (memory/feedback_codex_review_cycle.md 기준):
  1. 지적 수 감소·수렴 추세 (25→12→10→8→?) — cycle5 N <= 5 기대.
  2. cascade 가 다른 SoT 충돌 없음 (LL-CASCADE-01~05 모두 acceptance precondition 명시).
  3. 잔류 미결정이 모두 운영·인프라·M2+/M3+ 후속으로 분류 가능 (§9 LL-DEFER 20개 모두 phase 분류 완료).
  4. 보안·법적 critical 잔존 없음 (LegalDocument 발행 게이트 LL-DEFER-01 marker 만 — 검수 게이트 합류 시점 명시).

### 3. LL-48 trigger error mapping

- `USING ERRCODE = 'check_violation', CONSTRAINT = '<name>'` syntax — postgres `RAISE EXCEPTION ... USING CONSTRAINT = ...` 의 정확한 옵션 키 (`CONSTRAINT_NAME` 이 아니라 `CONSTRAINT`)?
- errors.ts 의 mapDbErrorToResult 가 `err.constraint_name` 또는 `err.constraint` 중 어느 필드 읽는지 — postgres library (postgres.js v3.x) 의 error object shape 확인 필요.

### 4. LL-49 M0_BUILD_EXPORT_PLAN placeholder

- placeholder 파일 작성 acceptance 강도 — plan v1.0 acceptance commit 안 신규 plan placeholder 1 row + LL-CASCADE-04 책임 명시. 그 placeholder 가 M0 v1.0 본 구현 시 실 plan 으로 진화 — 진화 시점에 본 plan LL-CASCADE-04 marker 가 close (또는 reference 유지)?
- placeholder plan 의 실제 content (목차 · build/export 함수 시그니처 · Git output 형식) 가 어디까지 명시? 본 plan v0.5 acceptance 시 placeholder 의 최소 content?

### 5. LL-50 DB trigger 11종 vs UI 3종

- DB trigger 가 SoT 11종 허용 + UI 가 3종 subset — server action 안 zod 검증은 UI 입력 직후 단계 → 3종만 통과. server action 안에서 raw SQL 로 11종 다른 type 을 INSERT 시도 (코드 경로 외) 시 trigger 가 통과. 이 정책의 의도 (관리자/migration 으로 추가 type 입력 허용) 명시?
- UI 3종 (phone/kakao-talk/naver-reservation) — DATA_MODEL CT-03 의 type enum 안 phone/kakao-talk/naver-reservation 만 minimal subset 으로 SoT 가 권장하는가? 한국 의료기관 운영 표준 정합 확인?

### 6. LL-52 LL-DEFER-04/05 phase 정합

- §9.3 가 "M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade)" 로 변경 — §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 정합?
- §9.3.1 가 비어 있음 ("외부 사용자 RBAC · 풀 권한 모델") — 본 plan 범위 외이지만 빈 섹션 의도 명시? 또는 삭제?

### 7. LL-53 LL-CASCADE-05 acceptance 강도

- "plan v1.0 acceptance = manifest spec 작성만 차단" — manifest 파일 위치/형식 명시 (`packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts`). 본 plan v0.5 가 그 manifest 의 schema 까지 정의? 아니면 LL-DEFER-20 안 명시?

### 8. LL-55 Sentry fallback

- v0.5 단계 console.error → server stdout — Vercel logs (production) / Cloud Run logs / 로컬 dev 의 console 모두 호환? 운영 팀이 로그 추적 가능한 채널 명시 (대시보드/CLI grep/외부 log aggregator)?
- M0 v1.0 (LL-DEFER-18) 합류 시점에 console.error → Sentry breadcrumb 으로 자동 wrap 되는 패턴 — Sentry SDK 초기화 위치 명시?

### 9. 새 minor / 잔존

- LL-DEFER 20 개 — LL-DEFER-19/20 추가로 phase 분류 추가 정합?
- LL-CASCADE 5 개 — acceptance precondition 모두 plan v1.0 acceptance commit 안 동시 patch (cycle2 LL-33 결정 유지)?
- v0.5 acceptance 후 작업 단위 (§8) 의 9개 작업 + LL-CASCADE 5개 작업 + M0_BUILD_EXPORT_PLAN placeholder 작성 = ~15 작업. 본 plan acceptance 와 코드 작업 시작 사이 step 명확?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 5,
  "closeableAfterPatch": true | false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10 → 8. cycle5 0~5 findings 예상. closeableAfterPatch=true 도달 후보. 단 blocking 1건 이상 잔존 시 false 유지.
