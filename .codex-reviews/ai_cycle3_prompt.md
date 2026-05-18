# 자동 비평 의뢰 — `docs/features/asset-ingestion.md` v0.3 (3차 사이클)

## 컨텍스트

v0.2의 14개 지적 전건 수용 → v0.3. 주요 도입:
- promote 트랜잭션 외부 호출 분리 — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed)
- rightsReview embedded 객체 + history[] append-only + reviewer 자격 검증
- closed union 5종 외 contentType v1.0 미지원 명시 + AI-17
- RRN checksum 정확 공식 (가중치 [2,3,4,5,6,7,8,9,2,3,4,5])
- PII LLM detector v1.0 금지 + v1.x 활성화 시 정책 정의
- blob key format kind를 prefix로 (raw·redacted·thumbnail)
- notifications 필수 (monitor-only 모드 없음)
- outbox sourceKind/sourceId 매핑 표 + PII asset 단위 1건 dedupe
- SNS adapter authorAccountId·ownerAccountId 검증 (quarantine)
- Feature contentType raw asset check 예외 명시
- AI-16·AI-17 신설

## 의뢰

v0.3을 다시 엄정하게 비평하라. 2차 정정의 새 모순·잔재 빈틈 점검:

1. **v0.2 정정의 새 모순**:
   - § 8.2 promote 4단계 흐름 — 2단계 check() 외부 호출 + 3단계 AssetPromotionRecord(pending) insert는 별도 transaction. 두 transaction 사이 worker crash 시 orphan record 처리
   - rightsReview.history[] append-only — 누가 history insert 권한 가지는지·UI 표시 정책
   - closed union 5종 외 contentType promote runtime fail — manual processing 경로는 어떻게 가능한지
   - RRN checksum 정확화 후 false-positive 비율 baseline 예상 (운영 지표 § 11.1 추가 필요)
   - blob kind prefix로 변경 시 기존 v0.2 key format(`{assetId}/{kind}.{ext}`)과 migration 정책 부재

2. **promote 흐름 트랜잭션 안정성**:
   - 1단계 게이트 검증 — 모든 게이트 통과 후 2단계 check() 진행. 게이트 통과 시점과 commit 사이 race condition (다른 worker가 reject 등) 가능성
   - 3단계 AssetPromotionRecord(pending) insert와 4단계 commit 사이 worker crash → pending 상태 무한 잔존 — reconcile worker로 정리 명시 부재
   - 5단계 post-commit audit·outbox 실패 시 AssetPromotionRecord committed 유지 + sink alert + reconcile — reconcile worker 정의 부재

3. **PII finding 운영 흐름 정합**:
   - AssetPiiFinding.reviewStatus 4종 (open·true-positive·false-positive·resolved) — promote 게이트 § 7.2와 정합 ("모든 piiFindings[] resolved" 의미 정확화 — true-positive(redacted)와 false-positive·resolved 모두 promote 허용)
   - PII redaction이 ExtractedContent.body에 적용 — original raw blob은 보존. redacted blob 별도 저장 vs body 텍스트만 redacted

4. **closed union TargetMapping 운영**:
   - DATA_MODEL C-04 Article·C-03 TreatmentPage 등 v0.4 컨텍스트 필드(recommendedFor·treatmentComponents 등) 포함 정합
   - manual contentType 처리 경로 — 어드민 UI에서 사용자가 직접 입력 vs asset-ingestion이 partial mapping 후 reject

5. **cascade 정합 (외부 문서)**:
   - REVIEW_WORKFLOW § 9.1·§ 9.1.1 5종 + § 10.2.1 5종 모두 v0.2에서 cascade 완료. v0.3에서 추가 cascade 없음
   - DATA_MODEL C-08 v0.18 정합

6. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 16 인벤토리 (11 tables) 일관성
   - § 1.1 변경 정책 cascade 컬럼 ↔ 실제 변경 영향
   - 미결정 분류 (AI-01~AI-17)

## 출력 형식

이전과 동일 JSON 스키마. status에 `closeableAfterPatch` 또는 `needs-fourth-cycle` 포함 권장.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (v0.3)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md`
