# 자동 비평 의뢰 — `docs/features/search-visibility.md` v0.5 (5차 마감 사이클)

## 컨텍스트

v0.4의 7개 지적 전건 수용 → v0.5. 4차 cycle codex 평가: `closeableAfterPatch: true + needsFifthCycle: true`. 5차 마감 사이클.

이번 cycle 도입:
- retroactive command super-admin 전용 (operations role 미존재 정정)
- REVIEW_WORKFLOW § 10.2.1 `search-visibility-retroactive-enqueue-requested` AuditAction cascade. SV-13 해소
- § 3.3 exposureTrend detectorOutput shape § 4.1과 통일
- first-detected 정책 rationale (unifiedRankingPresence vs AI briefing)
- sourceEventId에서 policyVersion 제거 (정책 변경 시 재발송 금지)
- severity escalation 의도 명시
- v1.0 blobStorage.provider="s3"만 build-pass

## 의뢰

v1.0 마감 직전 마지막 점검:

1. **v0.4 정정의 새 모순**:
   - REVIEW_WORKFLOW § 10.2.1 `search-visibility-retroactive-enqueue-requested` enum이 실제 추가됨 + audit metadata shape 명세 정합
   - sourceEventId에서 policyVersion 제거 후 § 7.5 retroactive command·§ 13.10 outbox·정상 발송 흐름의 정합
   - detectorOutput shape 통일 후 모든 § 참조 일치

2. **v1.0 마감 가능성 종합 점검**:
   - 모든 cascade(REVIEW_WORKFLOW § 9.1·§ 9.1.1·§ 10.2.1·DATA_MODEL C-08 v0.16) 정합
   - 잔류 미결정 v1.0 도달을 막지 않는지 (SV-01·02·03·04·05·06a·06b·07·08·09·11·12·14)
   - 인벤토리 9 tables·signal 4종·source 3종·mode 2종 일관성

3. **5차 결론 평가**:
   - `readyForV1: true` 또는 `closeableAfterPatch: true + 7개 이하 minor 정정 후 마감`
   - blocker·major 잔존 시 6차 cycle 필요 (수렴 기준)

## 출력 형식

이전과 동일 JSON 스키마.

**결론 평가 필수**: `readyForV1` 또는 `closeableAfterPatch` 또는 `needsSixthCycle` 중 하나 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (v0.5)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
