# 자동 비평 의뢰 — `docs/features/analytics-reporting.md` v0.4 (4차 사이클)

## 컨텍스트

v0.3의 23개 지적 전건 수용 후 v0.4. 주요 도입:
- CollectionSourceAttempt.status enum SoT(processing 포함)
- retry worker attemptNumber advisory lock
- envelope 재계산 우선순위 표 + retry exhausted → failed-permanent
- canonicalSources + manifestVersion idempotencyKey
- forceRefresh validation
- generateReport force refresh lineage 별도 row
- ReportInstance outbox 패턴(notificationDispatchClaim + reconcile worker)
- MediaThresholdState enum 통일·streak reset·hold 규칙
- transitionEventId basisKey 포함
- enqueueMediaThresholdReassessment outbox(MediaThresholdReassessmentDispatchOutbox)
- measurementSnapshot 필드 매핑표
- multi-metric mixed source validation error + metricSourceMap
- dataCompletenessBreakdown date 필드
- QueryFilter dimension별 최대 1개
- DST Temporal disambiguation 매핑
- missedRunCarryOverMaxDays 초과 alert
- bucketKey 형식
- redaction memory-only projection
- AnalyticsRedactionAudit 신설
- DSR reasonCode·subjectIdentifierHash 분리

## 의뢰

v0.4를 다시 엄정하게 비평하라. 잔재 모순·새로 도입된 구조의 빈틈 점검:

1. **v0.3 정정의 새 모순**:
   - retry worker advisory lock(§ 4.3) + envelope 재계산 lock(§ 4.1 5단계) 사이 deadlock 가능성
   - outbox 패턴 두 종 (ReportInstance·MediaThresholdReassessmentDispatchOutbox) 시 worker 분리·중복 처리 방지
   - manifestVersion 변경 시 진행 중인 collection·schedule의 처리 (예: scheduled collection 실행 중 manifest 변경)
   - QueryFilter dimension별 최대 1개 룰이 dimensions에 `date` 항상 포함 시 windowStart/End와 중복인지

2. **outbox·dispatch 정합**:
   - MediaThresholdReassessmentDispatchOutbox·ReportInstance 두 outbox가 별도 worker인지·공통 worker인지
   - outbox claim 시간(5분) 초과 후 재시도 + 5회 한도가 silent failure 회피에 충분한지
   - 두 outbox 모두 RetryQueue 패턴이 다른 점 (CollectionRetryQueue는 attemptNumber, outbox는 claim 상태)

3. **measurementSnapshot 필드 매핑**:
   - § 7.3.1 표가 DATA_MODEL C-10 모든 필수 필드를 채우는지
   - rolling snapshot에 `legalBasisNote=null`인데 DATA_MODEL은 optional이므로 정합 — 하지만 legal 검수자가 calendar 산정 record 만들 때 다른 record version으로 어떻게 분리되는지 명세 부재
   - sourceCompleteness 산식이 § 4.1 dataCompleteness와 정합

4. **redaction memory-only projection**:
   - § 5.5 redaction이 memory만에서 수행되는데 worker crash 시 raw가 partial로 남을 가능성
   - AnalyticsRedactionAudit이 raw 저장 안 한 경우만 신규 row인지·rawPayloadStorage.enabled=true에서도 항상 audit row 생성하는지

5. **multi-metric mixed source validation**:
   - sourceFilter 미지정 + dimensions에 source 미포함 + 서로 다른 default source metric 다수 → runtime validation error라는 규칙
   - 그러나 GA4의 pageviews와 GSC의 impressions를 동시 요청하는 사용자가 의도적으로 source dimension을 추가하는 패턴이 강제되는데 reports 작성 편의성 영향

6. **CollectionSourceAttempt status enum + DeliveryStatus 분리**:
   - CollectionSourceAttempt.status는 자체 enum이고 CollectionResult.perSource[].status도 같은 enum 사용
   - notifications의 DeliveryStatus와 명칭 혼동 (둘 다 status enum이지만 도메인 다름) — 본 Feature 명세 내 분리는 정확하지만 cross-Feature reader 혼동 가능

7. **manifestVersion·featurePolicyVersion**:
   - manifestVersion = hash(analyticsConfig.sources enabled set + featurePolicyVersion)이라고 했는데 featurePolicyVersion이 어디서 오는지 정의 부재
   - notifications 패턴 `notificationPolicyVersion`과 같은 분리 정책 적용 가능

8. **명세 자체의 정합성·문구**:
   - § 14 인벤토리 (현재 12 tables — Raw·Normalized·CollectionLog·CollectionSourceAttempt·ReportInstance·DailyUserMeasurement·MediaThresholdState·CollectionRetryQueue·DsrDeletionLog·MediaThresholdReassessmentDispatchOutbox·AnalyticsRedactionAudit·AnalyticsApiCallLog) — § 0 한 페이지 요약 정합
   - § 11 빌드 검증 룰이 v0.4 신규 fail 사유 포함되어 있는지

## 출력 형식

이전과 동일 JSON 스키마. 타당한 지적은 모두 제기하라.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (v0.4)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
