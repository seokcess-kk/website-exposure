# 자동 비평 의뢰 — `docs/features/keyword-monitoring.md` v0.4 (4차 사이클)

## 컨텍스트

v0.3의 7개 지적 전건 수용 → v0.4. 3차 cycle codex 평가: `needs-fourth-cycle` + 5차 close 가능성 high.

이번 cycle 도입:
- REVIEW_WORKFLOW § 10.2.1 — `keyword-tracking-target-migrated-v02-v03` AuditAction cascade + § 10.3 audit metadata
- rank-bucket transition deterministic transitionEventId (logical transitionDate=windowEnd) + advisory lock + compare-and-set + UNIQUE 3중 보호
- reactivate 동시성 — advisory lock + deterministic order (registeredAt DESC, id ASC)
- ctr-up read API contract — notify boolean + notificationSuppressionReason enum
- cross-Feature transaction boundary — READ COMMITTED 별도 transaction
- canonical 검색엔진 enum SoT + 3개 집합 build validation
- § 11 build/runtime/migration 3분리

## 의뢰

v0.4를 다시 엄정하게 비평하라. 5차 마감 가능성 점검:

1. **v0.3 정정의 새 모순**:
   - rank-bucket transition 원자성 — advisory lock + compare-and-set + UNIQUE 3중 보호. 실제 worker가 동시에 진입 시 false-fail 가능성 (advisory lock acquire 실패 시 다른 worker가 처리한 것으로 간주하고 abort 정상)
   - reactivate `registeredAt DESC, id ASC` 정렬 — 여러 worker가 동시에 동일 inactive row를 reactivate 시도 시 advisory lock으로 직렬화. id 충돌 시 first wins
   - ctr-up notify=false read API — `notificationSuppressionReason` enum 3종 (not-enqueue-eligible·monitor-only-mode·suppressed-by-ledger) 외 추가 필요한 사유 있는지
   - migration audit `keyword-tracking-target-migrated-v02-v03` v1.0 cascade — REVIEW_WORKFLOW § 10.2.1 enum에 추가됐는지 검증

2. **v1.0 마감 가능성**:
   - 잔류 미결정 (KM-01~07·14·15) v1.0 도달을 막지 않는지
   - cascade 동반 변경 (REVIEW_WORKFLOW·DATA_MODEL) 정합
   - 모든 v0.4 정정 사항 § 11에 검증 룰로 포함

3. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 (8 tables) 일관성
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - § 11.1·11.2·11.3·11.4 분리가 일관

4. **결론 평가**:
   - `readyForV1: true` 또는 `closeableAfterPatch: true + N개 minor` 또는 `needsFifthCycle: true`
   - blocker·major 잔존 시 5차 cycle 필요

## 출력 형식

이전과 동일 JSON 스키마. 결론 평가 필수.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (v0.4)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
