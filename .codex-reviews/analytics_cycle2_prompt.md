# 자동 비평 의뢰 — `docs/features/analytics-reporting.md` v0.2 (2차 사이클)

## 컨텍스트

v0.1의 18개 지적을 전건 수용하여 v0.2 정리. 주요 cascade·도입:
- SEARCH_STANDARDIZATION § 6.3 cascade — PageViewEvent·ConversionEvent + § 6.3.1 PII 규약 신설
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade — 3종 신규 이벤트(analytics-report-ready·media-threshold-reached·media-threshold-released) enum·매트릭스
- REVIEW_WORKFLOW § 8.1.1 cascade — 임계 전이 시 legal 판정 큐 자동 트리거
- DATA_MODEL C-08 v0.14 cascade — AnalyticsConfig 신설 (자격증명·식별자만), 동작 옵션은 features.config 경계 분리
- DATA_MODEL C-10 v0.14 cascade — MediaThresholdAssessment 슬롯 신설
- idempotencyKey + UNIQUE constraint (CollectionLog·ReportInstance)
- dimensionKey canonical SHA-256 hash (NULL dimension 처리)
- QueryDimension·QueryMetric 확장 + aggregation 규칙 (ctr·position weighted)
- sourceAvailabilityLag·watermarkDate·dataCompleteness
- PII GDPR 정합 (IPv6·payloadRedactionVersion·DSR 삭제 SLA)
- MA-02 operational vs 법적 분리 + hysteresis (enterAfter 7일·exitAfter 30일)
- credential 누락 build fail 통일
- rate limit token bucket + Retry-After + retry queue 테이블
- requiresFeature: notifications + artifactOnly 모드
- raw payload allowlist + containsPersonalData 검증

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` v0.2를 다시 엄정하게 비평하라. 1차 사이클의 정정이 새 모순을 만들었는지 + 잔재한 빈틈을 점검:

1. **1차 수용 결과의 잔재·내부 모순**:
   - § 3.2·3.3 idempotencyKey UNIQUE 제약과 § 14.3·14.4 인덱스 정합
   - § 3.4 QueryDimension·QueryMetric 확장이 § 6.1 NormalizedMetricRow와 일치
   - § 4.1 실행 순서가 idempotency·credential·watermark·rate limit·재시도 순서를 정확히 표현
   - § 5.5 raw payload allowlist가 § 14.1 RawRecord constraint(containsPersonalData)와 정합
   - § 7.2 notify() 호출 계약 — sourceEventId hash 식이 충돌 없는지 (instanceId + reportInstanceId만으로 충분한지)
   - § 7.3 임계 전이 hysteresis 알고리즘이 § 14.5 DailyUserMeasurement만으로 추적 가능한지 (별도 ThresholdState 테이블 필요 여부)

2. **MA-02·MediaThresholdAssessment 흐름**:
   - § 8.2 operational vs 법적 분리가 실제 운영 시 confusion 없는지 (rolling-90 측정 매일 + previous-3-months-calendar 법정 산정)
   - DATA_MODEL C-10 mediaThresholdAssessment 슬롯 채움이 새 ComplianceRecord 생성마다 매번 되는지·published record만 갱신되는지
   - REVIEW_WORKFLOW § 8.1.1 임계 전이 시 published 콘텐츠 전체 priorReview 재평가 — 본 Feature가 어떤 API로 트리거하는지 (notifications notify()만으로 충분한지)
   - `mediaThresholdAssessment.calendarPolicy` 두 종 중 어느 것이 priorReviewRequired 산정에 사용되는지 명확성

3. **idempotency·동시성 안정성**:
   - § 4.1 idempotencyKey 기본 결정 규칙(hash sorted sources)이 sources=undefined인 호출과 sources=["gsc","ga4"] 호출 사이 결과 일치 보장 여부
   - § 4.4 advisory lock(`hash(instanceId, source, "collection")`)과 idempotencyKey UNIQUE의 책임 분리
   - § 14.4 ReportInstance UNIQUE(instanceId, idempotencyKey)와 dependent NotificationEvent의 idempotency 정합 (sourceEventId 결정 규칙 § 7.2가 별도)
   - on-demand 모드와 scheduled 모드가 같은 idempotencyKey를 만들 수 있는지 — mode 포함됨 (§ 3.2 기본 규칙) — 그러나 on-demand "force refresh" 의도가 무시되는 문제

4. **PII·DSR·payload allowlist**:
   - § 5.5 allowlist 컬럼 표가 source별 실제 API 응답 필드 모두를 커버하는지 (예: GA4의 `customDimension`·`customMetric`·`eventParameters` 등 누락 가능)
   - § 14.8 DsrDeletionLog의 subjectIdentifier가 비식별·해시 처리된 식별자라면 어떻게 측정 데이터에서 매칭·삭제하는지 (aggregated 데이터는 사실상 식별 불가)
   - rawPayloadAllowlist=false 시 build fail 정책의 실용성 (운영자가 일시 disable 시 false 설정 가능성)

5. **rate limit·재시도 안정성**:
   - § 2.3 `rateLimit.bucketBackend`가 `redis-token-bucket` 또는 `db-advisory-lock` — 인스턴스별 vs 글로벌 적용 정합
   - § 14.7 CollectionRetryQueue + § 4.1 6단계 재시도 큐 enqueue의 worker·schedule 정의 부재
   - 429 Retry-After 우선이 backoffSeconds와 충돌 시 max(provider, backoff) 적용 명시

6. **다른 Feature 인터페이스 (`queryNormalizedMetrics`)**:
   - § 3.4 QueryInput.filters가 multi-condition AND·OR 평가 정의 부재 (배열 의미)
   - dimensions가 비어 있을 때 의미 (전체 합산?)
   - sourceFilter 부재 시 모든 source 합산이 ctr·position 같은 파생 metric에서 의미 있는가
   - dataCompleteness가 source별 평균인지 합산인지·windowDate별 평균인지 정합

7. **schedule·timezone 정합**:
   - § 2.3 `collectionSchedule.daily: "03:00"`이 인스턴스 timezone 기준이라고만 — DST·missed run 처리 부재
   - reportTemplates[].schedule "1st 09:00" — 매월 1일 의미인지 명세 부재
   - notifications Feature의 digest 스케줄과 본 Feature 리포트 스케줄 사이 의존성 (리포트 발송 후 notifications digest로 묶이는지)

8. **cascade 정합 (외부 문서)**:
   - SEARCH_STANDARDIZATION § 6.3.1 PII 규약이 본 문서 § 5.5·§ 8.1과 일치
   - REVIEW_WORKFLOW § 9.1.1 fallback 채널 컬럼이 신규 3종 이벤트에 모두 정의됨
   - REVIEW_WORKFLOW § 8.1.1 임계 전이 staleFlags.legal 갱신 — DATA_MODEL C-10 staleFlags와 정합
   - DATA_MODEL C-08 AnalyticsConfig 위치가 인벤토리(§ 1.1)에 반영됨

9. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 14 인벤토리 (8 tables) 일관성
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - § 11 빌드 검증의 모든 fail 룰이 § 1.1 변경 정책의 MAJOR cascade와 정합

## 출력 형식

이전과 동일 JSON 스키마.

타당한 지적은 모두 제기하라.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (대상 — v0.2)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
