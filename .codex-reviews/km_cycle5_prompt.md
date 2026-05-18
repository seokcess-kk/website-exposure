# 자동 비평 의뢰 — `docs/features/keyword-monitoring.md` v0.5 (5차 마감 사이클)

## 컨텍스트

v0.4의 6개 지적 전건 수용 → v0.5. 4차 cycle codex 평가: `needsFifthCycle: true` + 5차 close 가능성 high.

이번 cycle 도입:
- KeywordAnomalyNotificationOutbox sourceKind enum 정정 (`rank-bucket-state` → `rank-bucket-transition`) + sourceId 타입 string
- migration audit metadata `decompositions[]`·`conflictResolutions[]` lossless 구조
- AuditAction 4종 → 5종 표기 정정
- rank-bucket transition try advisory lock + idempotent no-op semantics
- § 11.4 runtime invariant·reconcile 분리 (§ 11.2와 별도)
- § 1.1 migration-time validation·runtime invariant SemVer policy 추가

## 의뢰

v0.5를 v1.0 마감 직전 마지막 점검:

1. **v0.4 정정의 새 모순**:
   - sourceKind enum 정정 후 § 6.2와 § 13.8 정합 검증
   - migration audit metadata decompositions[] 구조 — § 10.3 migration 운영 흐름과 정합
   - § 11.1·11.2·11.3·11.4·11.5 5분리 후 룰 분류 일관성
   - rank-bucket transition try lock 정합 — § 6.2 절차

2. **v1.0 마감 가능성 종합 점검**:
   - 모든 cascade (REVIEW_WORKFLOW § 9.1·§ 9.1.1·§ 10.2.1 5종·DATA_MODEL C-08 v0.17) 정합
   - 잔류 미결정 v1.0 도달을 막지 않는지
   - 인벤토리·signal·source·mode 일관성

3. **결론 평가**:
   - `readyForV1: true` 또는 `closeableAfterPatch: true + N개 minor` 또는 `needsSixthCycle: true`

## 출력 형식

이전과 동일 JSON 스키마. 결론 평가 필수.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (v0.5)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
