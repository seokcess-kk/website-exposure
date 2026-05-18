# 자동 비평 의뢰 — `docs/features/analytics-reporting.md` v0.5 (5차 마감 사이클)

## 컨텍스트

v0.4의 16개 지적 전건 수용 → v0.5. 5차 사이클은 **v1.0 안정판 마감** 결정 사이클.

이번 cycle의 주요 도입:
- C-08 `analyticsPolicyVersion` cascade (notifications policyVersion 패턴)
- scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze
- lock ordering invariant (attempt vs envelope)
- ReportInstance·MediaThresholdReassessmentDispatchOutbox dispatch-failed-retryable vs -permanent 분리
- outbox worker SoT claim SQL (SKIP LOCKED + attempts<5)
- 공통 retry taxonomy § 1.2.1
- C-10 v0.15 `mediaThresholdOperationalInput` 슬롯 신설 + REVIEW_WORKFLOW § 8.1.1 cascade
- sourceCompleteness 산식 명시
- AnalyticsRedactionAudit 모든 projection마다 생성
- projection + DB writes 단일 transaction
- date QueryFilter window intersection
- joinMode="metric-columns" opt-in cross-source join
- status 명칭 cross-Feature 가이드
- 인벤토리 12 tables 정정
- § 11 build/runtime/warning 3분리

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` v0.5를 v1.0 안정판 도달 직전 마지막 비평으로 점검하라.

**5차 사이클 평가 기준**: 이전 Feature 명세(compliance-assistant·notifications)의 5차 cycle에서 codex 평가가 `closeableAfterPatch`이며 7-10개 지적 정도가 일반적. v0.5가 마감 가능 수준인지·정정 후 v1.0 도달 가능한지 판단하라.

다음을 점검:

1. **v0.4 정정의 새 모순**:
   - § 11 build/runtime 분리 후 § 1.1 변경 정책에 build/runtime 분리 항목이 빠짐
   - § 1.2.1 retry taxonomy + 3종 retry 구조(CollectionRetryQueue·ReportInstance outbox·MediaThresholdReassessmentDispatchOutbox) 사이 maxAttempts 값 불일치 (CollectionRetryQueue=3, outbox=5)
   - manifestSnapshotVersion + analyticsPolicyVersion 두 버전 동시 운영 시 idempotencyKey 변경 trigger 명확성
   - AnalyticsRedactionAudit이 모든 projection마다 생성되는데 retention 정책 명시 부재

2. **REVIEW_WORKFLOW § 8.1.1 cascade 정합**:
   - mediaThresholdOperationalInput 슬롯 추가가 § 8.1.1 워크플로 흐름과 정확히 일치
   - published record.mediaThresholdAssessment에 calendar 값만 존재 = 본 Feature § 7.3.1 정합
   - legal 검수자가 calendar 산정 시 어떤 데이터 source를 사용할지 명세 부재 (analytics-reporting이 calendar 산정 데이터도 제공하는지·legal이 별도 산정하는지)

3. **단독 구현 가능성 검증** (v1.0 기준):
   - 본 문서만으로 단독 구현 가능한 수준인지
   - 모든 미결정(AR-XX)이 운영·인프라·M2+/M3+ 후속으로 적절히 분류
   - cascade 동반 변경 (REVIEW_WORKFLOW·DATA_MODEL·SEARCH_STANDARDIZATION) 정합성

4. **명세 자체 마감 점검**:
   - § 0 한 페이지 요약 ↔ § 14 인벤토리 (12 tables) 일관성
   - § 1.1 변경 정책의 모든 MAJOR/MINOR가 실제 변경 영향과 일치
   - § 11 build/runtime/warning 룰의 v0.5 신규 사유 포함 (analyticsPolicyVersion·outbox worker 설정·rawPayloadStorage)

## 출력 형식

이전과 동일 JSON 스키마.

5차 마감 사이클은 `closeableAfterPatch` 또는 `readyForV1` 평가 포함 권장.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (v0.5, v1.0 후보)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
