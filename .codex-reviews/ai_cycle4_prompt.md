# 자동 비평 의뢰 — `docs/features/asset-ingestion.md` v0.4 (4차 사이클)

## 컨텍스트

v0.3의 12개 지적 전건 수용 → v0.4. 주요 도입:
- AssetPromotionRecord 4상태 머신 (checking·pending-commit·committed·failed) + forensic 필드
- § 13.4 runtime invariant·reconcile worker SoT 신설
- promote transaction 내 row lock + 게이트 재평가 (reviewVersion CAS)
- AssetIngestionNotificationOutbox insert를 promote transaction 안으로 (atomic)
- PII gate enum 정확화 (true-positive AND redactionApplied=true OR false-positive). resolved 제거
- AssetPiiFinding offset SoT를 rawBody로 + ExtractedContent.rawBody 신설 + contextHash·redactedOffset
- blob key migration policy (lazy rewrite + eager command) + AI-18
- TargetMapping 5종 closed union 펼침 (Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem)
- unsupported contentType manual hand-off (manualProcessingRequired·provenanceAssetId)
- rightsReview action별 권한 매트릭스 + UI 표시 정책
- PII 운영 지표 5종 추가
- § 1.1 runtime invariant·reconcile SemVer policy 행

## 의뢰

v0.4를 다시 엄정하게 비평하라. 3차 정정의 새 모순·잔재 빈틈 점검:

1. **v0.3 정정의 새 모순**:
   - AssetPromotionRecord status 머신 — `pending-commit` 진입은 check() commit 직후 별도 transaction. 그러나 § 8.2 3단계 transaction은 lock + 재검증 + 모든 작업을 묶음 — pending-commit 상태에서 transaction 시작 시 status="pending-commit" 그대로 두고 transaction 안에서 committed로 갱신
   - § 13.4 reconcile worker `pending-commit > 10분`이면 Core row 존재 검사 — 별도 query 필요. 어떤 join 사용
   - ExtractedContent.rawBody·body 두 필드 — body는 redacted view 자동 생성 vs 운영자 수동 redaction 가능
   - blob key migration lazy rewrite — `IngestedAsset.blobKeyVersion` 필드 추가 명시 부재
   - TargetMapping 5종 펼침 — TreatmentComponent·VisitFlowStep·EvidenceNote 등 sub-type 정의 어디 (DATA_MODEL C-03 참조)

2. **promote 흐름 안정성**:
   - § 8.2 1단계 사전 게이트 vs 3.b 재검증의 차이점 명확화
   - reviewVersion CAS 실패 시 transaction rollback + status="failed" lastError 설정 — AssetPromotionRecord 별도 transaction이라 rollback 영향 없음

3. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 16 인벤토리 (11 tables) 일관성 유지
   - § 1.1 변경 정책 + AI3-12 신규 row ↔ 다른 절 실제 변경 영향
   - 미결정 (AI-01~AI-18) 분류

4. **v1.0 마감 가능성**:
   - 잔류 미결정 v1.0 도달 영향 없음 확인
   - cascade (REVIEW_WORKFLOW·DATA_MODEL) 정합

## 출력 형식

이전과 동일 JSON 스키마. status에 `readyForV1` 또는 `closeableAfterPatch` 또는 `needs-fifth-cycle` 포함.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (v0.4)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md`
