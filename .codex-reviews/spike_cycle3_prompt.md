# 자동 비평 의뢰 — `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v0.3 (3차 — acceptance 최종)

## 컨텍스트

2차 비평(7 지적: blocking 2 + major 4 + minor 1) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL·INFRA cascade. v0.3:
- E-provider smoke gate Day 10 추가
- DATA_MODEL C-23 v0.24 cascade (instanceMemberships.active)
- REVIEW_WORKFLOW signed-url-revocation-requested rename
- partial state matrix + Week 3-6 unlock/hold 규칙
- A fallback reversal blast radius 상세 (affected SoT·packages·schedule·owner)
- D·E day artifact 명시
- INFRA §4.1·§4.2 5 Spike/10일 cascade

## 의뢰

v0.3을 v1.0 acceptance로 최종 검증하라.

ready_for_acceptance=true 판정 기준:
- blocking 0개
- major 0~2개
- SoT cascade 동기화 완료 (INFRA·REVIEW_WORKFLOW·DATA_MODEL)
- 솔로 + AI 보조 운영 가능

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKE3-`. **acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\spike_cycle2_response.md`
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
