# 자동 비평 의뢰 — `docs/features/analytics-reporting.md` v0.3 (3차 사이클)

## 컨텍스트

v0.2의 24개 지적을 전건 수용하여 v0.3 정리. 이번 cycle의 주요 도입:
- sources canonicalization (AR2-01)
- forceRefresh + refreshIntentId 분기 (AR2-02)
- CollectionLog envelope + CollectionSourceAttempt per-source 분리 (AR2-03)
- ReportInstance UNIQUE 통일 (AR2-04)
- ReportInstance.notificationDispatchedAt 영구 저장 — receipt 만료 후 재발송 차단 (AR2-05)
- MediaThresholdState 테이블 신설 — hysteresis 상태 SoT (AR2-06)
- DailyUserMeasurement basisKey (AR2-07)
- operational vs 법정 분리 명확화 — priorReviewRequired 산정에 calendar만 (AR2-08)
- ComplianceRecord 갱신 주체 분리 — 본 Feature는 snapshot provider only (AR2-09)
- REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade (AR2-10)
- ga4CustomFieldAllowlist 명시 (AR2-11)
- DSR subject-matching not-applicable (AR2-12)
- rawPayloadStorage.enabled vs allowlist 분리 (AR2-13)
- rateLimit.bucketKeyStrategy (AR2-14)
- CollectionRetryQueue worker claim·SKIP LOCKED (AR2-15)
- QueryFilter AST + AND/OR semantics (AR2-16)
- dimensions=[] → single aggregate row (AR2-17)
- sourceFilter 부재 + metric별 default source (AR2-18)
- dataCompletenessBreakdown (AR2-19)
- QueryDimension `source` 명칭 통일 (AR2-20)
- dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21)
- DST·missed run grammar (AR2-22)
- reportTemplates schedule grammar (AR2-23)
- § 5.5 참조 정정 (AR2-24)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` v0.3를 다시 엄정하게 비평하라. 2차 사이클의 정정이 새 모순을 만들었는지 + 잔재한 빈틈을 점검:

1. **2차 수용 결과의 잔재·내부 모순**:
   - § 4.1 실행 순서가 idempotency · canonicalization · source-level 병렬·envelope state 전이를 정확히 표현
   - § 4.1 envelopeState 전이 (accepted → processing → completed/partial-failed/failed)와 § 3.2 `envelopeState` enum이 § 14.3 CollectionLog와 일관
   - CollectionSourceAttempt UNIQUE(collectionLogId, source, attemptNumber) — retry queue worker가 새 attempt 생성 시 attemptNumber 산정의 동시성 안전 (별도 advisory lock 필요?)
   - § 7.3 임계 측정 cycle이 transition trigger 조건을 명확히 분리 (currentState=false + enterStreak >= enterAfter 등)
   - MediaThresholdState.enterStreak/exitStreak이 어떻게 매일 갱신되는지 (어떤 조건에서 reset)
   - § 7.2 ReportInstance.notificationDispatchedAt 검사가 idempotency 재호출 + force refresh 분기와 정합

2. **enqueueMediaThresholdReassessment 워크플로 API**:
   - REVIEW_WORKFLOW § 8.1.1의 API 정의가 본 Feature가 사용하는 호출 시점·입력과 정합
   - `transitionEventId` UNIQUE이 idempotency 보호하지만 workflow 측 처리 실패 시 재시도 정책 부재
   - measurementSnapshot은 본 Feature의 어떤 데이터(MediaThresholdAssessment 타입)와 어떻게 매핑되는지 명시 정합

3. **canonicalization·idempotency 안전성**:
   - sources canonicalization에서 manifest 활성 source가 동적으로 변경되면 (예: ga4 비활성화) idempotencyKey가 달라지는데 의도된 동작인지
   - forceRefresh + refreshIntentId 미지정 시 build/runtime fail이라고 했지만 forceRefresh=false인 일반 호출과 어떻게 구분되는지
   - on-demand 호출이 같은 day에 force refresh 다회 발생할 때 refreshIntentId 순서 정합

4. **CollectionSourceAttempt·재시도 모델**:
   - 동일 collectionLogId의 source별 attempt가 in-retry-queue 상태일 때 envelope state는 무엇으로 표현 (partial-failed? processing? in-retry-queue?)
   - retry worker가 새 attempt를 생성할 때 attemptNumber=max+1 산정의 동시성 (별도 lock 또는 sequence)
   - retry 성공 시 envelope state가 completed로 자동 승격하는 조건 (모든 source attempt 종결)

5. **queryNormalizedMetrics 의미론**:
   - § 3.4 dimensions=[]가 single aggregate row인데 sourceFilter 미지정 시 metric별 default source 단일 사용 — 호출자가 metric을 여러 개 요청하면 source가 mixed로 단일 row에 묶일 수 있는 모순
   - filters AST에서 op="equals" 다수가 invalid라고 했는데 일반적 SQL에서는 마지막 값 또는 OR 처리 — 의미 명확화 필요
   - dataCompletenessBreakdown이 perDateCompleteness만 노출 — perMetricAvg는 source 단위로만 있는데 query metric이 여러 개일 때 어떤 metric의 completeness가 SoT인지

6. **schedule grammar·DST·missed run**:
   - § 4.2 `dstAmbiguousLocalTime: "first"`이 실제 어떤 time-zone library 동작과 매칭되는지 (IANA 처리 SoT 부재)
   - § 4.4 reportTemplates schedule.type=monthly + dayOfMonth="31" 같은 31일 부재 월 처리 (last가 아닌 N 숫자 입력)
   - missedRunCarryOverMaxDays 초과 시 어떻게 처리되는지 (loss + sink alert?)

7. **rate limit bucketKeyStrategy**:
   - credential-global인 경우 같은 service account를 여러 인스턴스가 공유하면 quota 충돌. 본 문서가 multi-instance 격리 정책을 명시했는지
   - bucketKey가 어떤 string 형식으로 구성되는지 (예: `provider:source:credentialHash` vs `provider:source:instanceId`)

8. **PII·DSR·raw payload**:
   - GA4 customDimensions 등 ga4CustomFieldAllowlist에 명시 등록된 key 외 자동 drop이 어떻게 검증되는지
   - rawPayloadStorage.enabled=false 인스턴스에서 응답 처리 흐름 — 정규화 직전에 raw를 메모리만 거치고 폐기하는지
   - DsrDeletionLog.subjectIdentifier가 optional인데 reason="aggregated-only-not-applicable"인 경우 어떤 식으로 응답하는지

9. **cascade 정합 (외부 문서)**:
   - REVIEW_WORKFLOW § 8.1.1 enqueueMediaThresholdReassessment 정의가 본 문서 § 7.3 사용과 일치
   - DATA_MODEL C-10 MediaThresholdAssessment 필드가 본 Feature measurementSnapshot 산출과 1:1 매핑
   - SEARCH_STANDARDIZATION § 6.3.1 PII 규약과 § 5.5 raw payload allowlist 정합

10. **명세 자체의 정합성·문구**:
    - § 0 한 페이지 요약 ↔ § 14 인벤토리 (9 tables + ApiCallLog = 10 tables) 일관성
    - § 1.1 변경 정책 ↔ 실제 변경 영향
    - § 11 빌드 검증 룰의 모든 fail 사유가 § 1.1 정책 cascade와 정합

## 출력 형식

이전과 동일 JSON 스키마.

타당한 지적은 모두 제기하라.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (대상 — v0.3)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
