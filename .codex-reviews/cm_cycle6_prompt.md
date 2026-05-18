# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.6 (6차 사이클 — v1.0 안정판 최종 검증)

## 컨텍스트

5차 비평(8 지적: blocking 3 + major 4 + minor 1) 전건 수용. v0.6 핵심:
- § 12 인벤토리 **12 tables** — PolicyReevaluateRecord 별도 table 승격 (CM5-01)
- § 4.3.2 3축 invariant DB CHECK tuple 기반 재작성 (CM5-02)
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade — run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 (CM5-03)
- writeSetScopeDigest 고정 정의 (CM5-04)
- DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가 (CM5-05)
- legalEntityChanged 잔재 제거 → 분해 필드 cascade (CM5-06)
- § 3.4 requestFingerprint 표에 markStepCompensated·abortRun 추가 + skipStep rollbackClass 제거 (CM5-07)
- § 10.3 v0.6 residual risk (CM5-08)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.6을 v1.0 안정판으로 최종 검증하라.

ready_for_v1_0=true 판정 기준:
- blocking 0개
- major 0~1개 (잔여 minor 수준)
- SoT cascade 동기화 완료 (REVIEW_WORKFLOW·DATA_MODEL)
- 의료법·개인정보보호법 운영 가능

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM6-`. **v1.0 안정판으로 판정하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.6)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle5_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
