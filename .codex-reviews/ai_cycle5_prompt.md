# 자동 비평 의뢰 — `docs/features/asset-ingestion.md` v0.5 (5차 마감 사이클)

## 컨텍스트

v0.4의 12개 지적 전건 수용 → v0.5. 4차 codex 평가: `closeableAfterPatch: true, needsFifthCycle: false`. 5차 마감 검증 cycle.

이번 cycle 도입:
- § 16.10 AssetPromotionRecord 풀 스키마 전개 (4상태 머신·forensic 필드·index)
- promote transaction 3.a AssetPromotionRecord row lock + status CAS
- failed 분기 별도 transaction (gate-race-failure)
- reconcile 3종 존재 검사 (Core·ComplianceRecord·outbox)
- TreatmentPageTargetMapping C-03 정합 (process: ProcessStep[]·programVariants: ProgramVariant[])
- ArticleTargetMapping closed union 전개 (잔재 제거)
- PII gate AssetPiiFinding 기준 + reconcile invariant
- § 16.5 blobKeyVersion enum 추가
- body materialized view 정책 (rawBody + AssetPiiFinding redaction operations)
- compliance-assistant § 3.3 Feature contentType 예외 cascade
- DATA_MODEL § 2.2 공통 메타 `@provenanceAssetId` 추가
- asset review vs rightsReview 권한 분리

## 의뢰

v1.0 마감 가능성 검증. v0.5 정정의 새 모순 또는 잔재 점검:

1. **v0.4 정정의 새 모순**:
   - AssetPromotionRecord transaction 3.a CAS 후 3.b~3.i 진행 — 3.b 게이트 재검증 실패 시 별도 transaction failed 기록. transaction abort 시 commitStartedAt도 rollback되는지 정합
   - reconcile pending-commit > 10분 — Core row + ComplianceRecord + outbox 3종 모두 존재 시 committed로 수렴. 0건·partial은 failed. 부분 commit 정확 처리
   - body materialized view 자동 재생성 — rawBody·AssetPiiFinding 변경 trigger 명시 부재
   - blobKeyVersion enum 추가 + lazy rewrite — 기존 v0.1·v0.2 운영 데이터 backfill 로직 명시 부재
   - DATA_MODEL § 2.2 `@provenanceAssetId` 공통 메타 추가 — 모든 C-01~C-23에 적용. 기존 row migration 정합

2. **v1.0 마감 가능성 종합**:
   - 잔류 미결정 (AI-01~AI-18) v1.0 도달 영향 없음
   - cascade (REVIEW_WORKFLOW·DATA_MODEL·compliance-assistant) 정합
   - 인벤토리·신호·source 일관성

3. **결론 평가**:
   - `readyForV1: true` 또는 `closeableAfterPatch: true + N개 minor`

## 출력 형식

이전과 동일 JSON 스키마. 결론 평가 필수.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (v0.5)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
