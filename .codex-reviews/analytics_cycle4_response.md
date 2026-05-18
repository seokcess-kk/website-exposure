{
  "reviewTarget": "docs/features/analytics-reporting.md v0.4",
  "verdict": "needs-revision",
  "findings": [
    {
      "id": "AR4-01",
      "severity": "high",
      "category": "manifestVersion",
      "title": "featurePolicyVersion 출처가 정의되지 않아 manifestVersion 산정이 비결정적이다",
      "evidence": "§3.2는 manifestVersion = hash(enabled source 명 정렬 + featurePolicyVersion)이라고 하나, featurePolicyVersion이 InstanceManifest 필드인지, feature package policy인지, 별도 config인지 정의가 없다. §11 build validation에도 누락 검증이 없다.",
      "impact": "동일 설정이 환경마다 다른 idempotencyKey를 만들거나, 반대로 policy 변경이 collection/report lineage에 반영되지 않을 수 있다.",
      "recommendation": "notifications의 notificationPolicyVersion처럼 `analyticsPolicyVersion` 또는 `analyticsFeaturePolicyVersion`을 명시 필드로 분리하고, 보관 버전 목록·rollback·build fail 조건을 정의하라."
    },
    {
      "id": "AR4-02",
      "severity": "high",
      "category": "manifestVersion",
      "title": "scheduled collection 실행 중 manifest 변경 시 snapshot 기준이 불명확하다",
      "evidence": "§3.2는 scheduled job 생성 시 canonicalSources를 payload에 freeze한다고 하지만 manifestVersion도 함께 freeze하는지 명시하지 않는다. §4.2 catch-up idempotencyKey는 scheduledForDate + manifestVersion을 사용하지만, queued job이 실행될 때 current manifestVersion을 쓰는지 schedule materialization 시점 version을 쓰는지 불명확하다.",
      "impact": "ga4 비활성화 같은 manifest 변경 중 기존 scheduled job·retry가 새 lineage로 섞이거나, old canonicalSources + new manifestVersion 조합의 비정상 lineage가 생길 수 있다.",
      "recommendation": "schedule materialization 시 `manifestSnapshotVersion`, `canonicalSources`, `sourceConfigSnapshot`을 job payload에 고정하고, retry는 CollectionLog의 snapshot을 끝까지 따르도록 규정하라."
    },
    {
      "id": "AR4-03",
      "severity": "medium",
      "category": "locking",
      "title": "retry attempt lock과 envelope 재계산 lock의 lock ordering 금지가 명시되지 않았다",
      "evidence": "§4.3은 `(collectionLogId, source)` advisory lock으로 attemptNumber를 선점하고, §4.1 5단계는 `hash(collectionLogId, \"envelope\")` lock으로 envelope를 재계산한다고 한다. §4.3은 attempt lock을 짧은 transaction에서 해제한다고 쓰지만, envelope 재계산이 source lock 보유 중 호출되면 안 된다는 invariant는 없다.",
      "impact": "구현자가 retry attempt insert와 envelope 재계산을 같은 transaction에 합치면 lock order가 worker 간 달라져 deadlock 가능성이 생긴다.",
      "recommendation": "명세에 `source attempt lock을 보유한 상태에서 envelope lock 획득 금지`, `attempt transaction commit 후 별도 transaction에서 envelope lock 획득`을 불변 조건으로 추가하라."
    },
    {
      "id": "AR4-04",
      "severity": "high",
      "category": "outbox",
      "title": "ReportInstance outbox의 dispatch-failed 재시도 규칙이 서로 충돌한다",
      "evidence": "§7.2 4단계는 기존 ReportInstance가 `claimed-pending`·`dispatch-failed`이면 outbox 재발송 worker가 처리한다고 한다. 그러나 §7.2 5-e reconcile worker 조건은 `claim=\"claimed-pending\" AND claimedAt < now() - 5분`만 조회한다. §7.2 5-d는 notify 실패 시 즉시 `dispatch-failed`로 마킹한다.",
      "impact": "notify 실패 row가 즉시 `dispatch-failed`가 되면 reconcile worker 조건에 잡히지 않아 5회 재시도 전에 silent terminal 상태가 될 수 있다.",
      "recommendation": "`dispatch-failed`를 retryable/terminal로 분리하거나, worker claim query에 `dispatch-failed AND attempts < 5`를 포함하고 5회 초과 상태를 별도 enum으로 둬라."
    },
    {
      "id": "AR4-05",
      "severity": "high",
      "category": "outbox",
      "title": "MediaThresholdReassessmentDispatchOutbox도 retryable failure와 permanent failure가 같은 enum이다",
      "evidence": "§7.3.2는 실패 시 `claim=\"dispatch-failed\" + alert`, 5회 초과 실패도 `dispatch-failed`라고 한다. §14.10 claim enum은 not-claimed·claimed-pending·dispatched·dispatch-failed뿐이다.",
      "impact": "worker가 어떤 dispatch-failed를 재시도해야 하는지, 어떤 row가 영구 실패인지 구분할 수 없다.",
      "recommendation": "`retry-pending`/`dispatch-failed-permanent`를 분리하거나 `attempts < maxAttempts` 조건과 claim transition SQL을 명시하라."
    },
    {
      "id": "AR4-06",
      "severity": "medium",
      "category": "outbox",
      "title": "두 outbox가 공통 worker인지 별도 worker인지와 중복 처리 방지 SQL이 없다",
      "evidence": "ReportInstance는 테이블 내 claim 필드, MediaThreshold는 별도 outbox 테이블이다. 둘 다 `(claim, claimedAt)` index만 있고, claim 원자 UPDATE 조건·worker identity·timeout reclaim 규칙이 구체화되어 있지 않다.",
      "impact": "여러 worker가 같은 row를 동시에 발송하거나, 공통 worker 구현 시 서로 다른 상태 전이를 잘못 적용할 수 있다.",
      "recommendation": "두 outbox를 별도 worker로 둘지 공통 interface로 둘지 명시하고, `UPDATE ... WHERE claim IN (...) AND attempts < maxAttempts RETURNING *` 형태의 claim SoT 쿼리를 각각 제공하라."
    },
    {
      "id": "AR4-07",
      "severity": "medium",
      "category": "retry-model",
      "title": "CollectionRetryQueue와 outbox retry 모델이 서로 달라 운영 지표·장애 처리가 갈라진다",
      "evidence": "CollectionRetryQueue는 queue row claim + attemptNumber 기반이고, outbox 두 종은 claim 상태 + attempts 기반이다. §9 운영 지표와 §11 검증은 이 차이를 수용하는 공통 retry taxonomy를 정의하지 않는다.",
      "impact": "retry exhausted, stale processing, alert severity, manual replay 절차가 큐 종류마다 다르게 해석될 수 있다.",
      "recommendation": "공통 필드 의미(`attempts`, `maxAttempts`, `claimedAt timeout`, `permanent failure`, `manual replay`)를 §1 또는 §4에 정의하고 각 queue/outbox가 이를 어떻게 구현하는지 표로 정리하라."
    },
    {
      "id": "AR4-08",
      "severity": "high",
      "category": "measurementSnapshot",
      "title": "rolling snapshot을 저장한 pre-publish ComplianceRecord와 법정 calendar record version 분리가 충돌한다",
      "evidence": "analytics §7.3.1은 rolling snapshot은 워크플로 입력이고 법정 산정 record는 legal 검수자가 `previous-3-months-calendar`로 별도 record version 생성한다고 한다. 그러나 REVIEW_WORKFLOW §8.1.1은 workflow가 새 pre-publish ComplianceRecord를 만들고 measurementSnapshot을 mediaThresholdAssessment 슬롯에 저장한 뒤 legal 검수자가 legalBasisNote 등을 채운다고 한다.",
      "impact": "동일 pre-publish record가 rolling-90 운영 snapshot을 가진 채 priorReviewRequired 법정 판정 record로 publish될 위험이 있다.",
      "recommendation": "workflow가 rolling snapshot을 별도 input/audit 필드에 보관하고, published ComplianceRecord.mediaThresholdAssessment에는 legal 검수자가 산정한 `previous-3-months-calendar` snapshot만 들어가도록 명시하라."
    },
    {
      "id": "AR4-09",
      "severity": "medium",
      "category": "measurementSnapshot",
      "title": "sourceCompleteness 산식이 dataCompleteness hold 규칙과 정합되지 않는다",
      "evidence": "§7.3은 dailyUsers 결측 또는 dataCompleteness < 0.9이면 streak hold라고 한다. §7.3.1 sourceCompleteness는 측정 가능 일자 대비 실제 dailyUsers 수집 일자 비율이라고만 한다.",
      "impact": "dataCompleteness 0.5인 dailyUsers가 '수집된 일자'로 계산되면 sourceCompleteness는 높게 나오지만 hysteresis는 hold되는 모순이 생긴다.",
      "recommendation": "sourceCompleteness 분자에 포함되는 일자를 `dailyUsers 존재 AND dataCompleteness >= 0.9`로 할지, 별도 weighted completeness로 할지 명시하라."
    },
    {
      "id": "AR4-10",
      "severity": "medium",
      "category": "redaction",
      "title": "redaction audit row 생성 범위가 raw disabled에만 한정되어 raw enabled 감사 증거가 약하다",
      "evidence": "§5.5는 `rawPayloadStorage.enabled=false` 처리에서만 AnalyticsRedactionAudit을 생성한다고 한다. §14.11도 'raw disabled 인스턴스 redaction 증거'로 설명한다.",
      "impact": "rawPayloadStorage.enabled=true인 경우 droppedFieldCount, redactedPayloadHash 같은 감사 증거가 남지 않아 projection 적용 여부를 RawRecord만으로 충분히 입증하기 어렵다.",
      "recommendation": "AnalyticsRedactionAudit을 모든 provider response projection마다 생성할지, raw enabled에서는 RawRecord가 어떤 필드로 동일 증거를 대체하는지 명확히 하라."
    },
    {
      "id": "AR4-11",
      "severity": "medium",
      "category": "redaction",
      "title": "projection·raw/audit 저장·normalized 저장의 원자성 경계가 없다",
      "evidence": "§5.5는 provider 응답 직후 memory-only projection을 수행한다고 하나, projection 후 RawRecord 또는 AnalyticsRedactionAudit 저장과 NormalizedMetric 저장이 같은 transaction인지 불명확하다.",
      "impact": "worker crash 시 normalized row는 남고 audit/raw evidence는 누락되거나, attempt status가 processing에 머무는 partial state가 생길 수 있다.",
      "recommendation": "projection 이후 DB writes를 단일 transaction으로 묶고, crash recovery가 `processing` attempt와 audit/raw/normalized 불일치를 reconcile하는 규칙을 추가하라."
    },
    {
      "id": "AR4-12",
      "severity": "medium",
      "category": "query-api",
      "title": "date QueryFilter와 windowStart/windowEnd의 결합 규칙이 없다",
      "evidence": "QueryDimension에 `date`가 포함되고, QueryFilter는 date에도 적용 가능하다. 동시에 QueryInput은 필수 windowStart/windowEnd를 가진다. §3.4의 '같은 dimension 최대 1개 filter' 규칙은 window와 date filter의 관계를 설명하지 않는다.",
      "impact": "date filter가 window를 좁히는 intersection인지, window와 중복 금지인지, window 밖 date filter가 empty result인지 validation error인지 구현별로 달라질 수 있다.",
      "recommendation": "`date` filter는 window와 intersection으로 처리하거나 금지하는 등 하나의 정책을 정하고, window 밖 값 처리와 startsWith(`YYYY-MM`) 허용 여부를 명시하라."
    },
    {
      "id": "AR4-13",
      "severity": "medium",
      "category": "query-api",
      "title": "mixed-source multi-metric 규칙이 의도적 cross-source report의 row alignment를 정의하지 않는다",
      "evidence": "§3.4.1은 sourceFilter 미지정 + default source가 다른 metric 다수 + dimensions에 source 미포함이면 runtime validation error라고 한다. dimensions에 source를 추가하면 source별 분리 row가 되지만, GA4 pageviews와 GSC impressions를 같은 page/date row에 나란히 보여주는 의미는 정의되지 않는다.",
      "impact": "일반적인 SEO 리포트에서 GSC impressions와 GA4 pageviews를 한 표에 결합하려면 source dimension으로 row가 분리되어 사용성이 떨어진다.",
      "recommendation": "명시적 `metricSourceMap` 입력 또는 `joinMode: \"metric-columns\"` 같은 safe opt-in을 제공해, metric별 source가 다른 경우에도 같은 dimensions 기준으로 column join하는 규칙을 정의하라."
    },
    {
      "id": "AR4-14",
      "severity": "low",
      "category": "naming",
      "title": "CollectionSourceAttemptStatus와 notifications DeliveryStatus의 status 명칭 충돌 가능성이 남아 있다",
      "evidence": "analytics §3.2의 CollectionSourceAttemptStatus와 notifications §3.2의 DeliveryStatus가 모두 `failed-permanent`, `processing`류 상태명을 사용한다. 본 Feature 내부 분리는 되어 있으나 cross-feature 독자가 `status`만 보고 혼동할 수 있다.",
      "impact": "ReportInstance deliveryResult와 collection perSource status를 같은 UI/로그 파이프라인에 표시할 때 잘못된 enum parser를 적용할 수 있다.",
      "recommendation": "JSON 필드명 또는 문서 표에서 `collectionAttemptStatus`, `deliveryStatus`처럼 도메인 prefix를 강제하고, cross-feature 로그 schema 예시를 추가하라."
    },
    {
      "id": "AR4-15",
      "severity": "high",
      "category": "inventory",
      "title": "DB 인벤토리 숫자가 v0.4 신규 테이블을 반영하지 않는다",
      "evidence": "§0은 9 tables + AnalyticsApiCallLog라고 하고, §10.1도 '§14 인벤토리 9 tables + ApiCallLog'라고 한다. 그러나 §14에는 AnalyticsRawRecord, AnalyticsNormalizedMetric, CollectionLog, CollectionSourceAttempt, ReportInstance, DailyUserMeasurement, MediaThresholdState, CollectionRetryQueue, DsrDeletionLog, MediaThresholdReassessmentDispatchOutbox, AnalyticsRedactionAudit, AnalyticsApiCallLog 총 12개가 있다.",
      "impact": "마이그레이션 체크리스트가 outbox와 redaction audit 신규 테이블을 누락할 수 있다.",
      "recommendation": "§0과 §10.1을 12 tables로 갱신하고, 신규 테이블 2개가 migration 필수임을 build/install checklist에 반영하라."
    },
    {
      "id": "AR4-16",
      "severity": "medium",
      "category": "build-validation",
      "title": "§11 build validation이 v0.4 신규 실패 조건을 충분히 포함하지 않는다",
      "evidence": "§11 fail에는 featurePolicyVersion 누락, 보관 policy version 불일치, outbox worker 설정 누락, manifestVersion 산정 불가, rawPayloadStorage=false 시 AnalyticsRedactionAudit retention 누락 등이 없다. `forceRefresh=true + refreshIntentId 누락`은 runtime fail인데 build fail 표에 섞여 있다.",
      "impact": "배포 전 잡아야 할 설정 오류가 런타임에서만 드러나고, build-time과 runtime validation 경계가 흐려진다.",
      "recommendation": "build fail, runtime validation fail, warning을 분리하고 v0.4 신규 구조의 필수 설정을 §11에 추가하라."
    }
  ]
}