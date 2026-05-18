{
  "reviewTarget": "docs/features/analytics-reporting.md",
  "reviewedVersion": "v0.2",
  "reviewedAt": "2026-05-14",
  "summary": {
    "overall": "v0.1 지적의 상당수는 문구상 반영되었지만, v0.2는 실행 가능한 상태 저장·동시성·스케줄·워크플로 트리거 계약이 아직 부족하다. 특히 idempotency 기본키, 임계 전이 hysteresis 상태, ComplianceRecord 슬롯 갱신 주체, retry worker, queryNormalizedMetrics 의미론이 남은 핵심 리스크다.",
    "findingCount": 24,
    "severityBreakdown": {
      "critical": 0,
      "high": 8,
      "medium": 13,
      "low": 3
    }
  },
  "findings": [
    {
      "id": "AR2-01",
      "severity": "high",
      "category": "idempotency",
      "title": "CollectionInput.sources 미지정 호출과 전체 source 명시 호출의 idempotencyKey가 달라질 수 있음",
      "locations": [
        "docs/features/analytics-reporting.md:196",
        "docs/features/analytics-reporting.md:211"
      ],
      "issue": "기본 idempotencyKey가 sources.sort().join(',')를 사용하지만 sources가 undefined일 때 이를 활성 source 전체로 canonicalize하는 규칙이 없다. 따라서 sources 생략 호출과 sources=['gsc','ga4'] 호출이 같은 작업이어도 다른 key가 될 수 있다.",
      "impact": "동일 window 수집이 중복 실행되고 CollectionLog UNIQUE가 보호하지 못한다.",
      "recommendation": "key 산정 전에 sources undefined를 'manifest에서 enabled=true인 AnalyticsSource 전체를 정렬한 배열'로 정규화한다고 명시하라. CollectionResult에도 canonicalSources를 남기는 것이 좋다."
    },
    {
      "id": "AR2-02",
      "severity": "high",
      "category": "idempotency",
      "title": "on-demand force refresh 의도를 표현할 입력이 없음",
      "locations": [
        "docs/features/analytics-reporting.md:202",
        "docs/features/analytics-reporting.md:211"
      ],
      "issue": "mode는 idempotencyKey에 포함되지만 on-demand 내에서 '같은 window를 강제 재수집'하려는 의도를 구분할 forceRefresh, refreshReason, runNonce 같은 필드가 없다.",
      "impact": "운영자가 late-arriving data, redaction bug, adapter bug 수정 후 같은 window를 다시 수집하려 해도 기존 결과가 재구성되어 실제 refresh가 무시된다.",
      "recommendation": "CollectionInput에 forceRefresh boolean과 forceRefreshNonce 또는 refreshIntentId를 추가하고, 강제 재수집 시 기존 CollectionLog를 overwrite하지 않고 새 CollectionLog lineage를 만들도록 명시하라."
    },
    {
      "id": "AR2-03",
      "severity": "medium",
      "category": "idempotency",
      "title": "CollectionLog가 per-source 실행 순서와 multi-source idempotency를 동시에 설명하지 못함",
      "locations": [
        "docs/features/analytics-reporting.md:333",
        "docs/features/analytics-reporting.md:739"
      ],
      "issue": "§ 4.1은 실행 순서를 per source라고 하지만 CollectionLog UNIQUE는 instanceId+idempotencyKey 1건뿐이고 source 컬럼도 없다. multi-source 호출에서 어떤 시점에 CollectionLog를 선점·완료 처리하는지 불명확하다.",
      "impact": "한 source만 성공하고 다른 source가 retry queue로 빠진 경우 동일 idempotencyKey 재호출이 전체 완료로 간주될지, partial 재개로 간주될지 구현마다 달라진다.",
      "recommendation": "CollectionLog는 collection envelope로 선점하고, source별 상태는 CollectionSourceAttempt 또는 CollectionLog.summary의 required schema로 분리하라. idempotent replay 시 partial/in-progress 처리 계약도 명시하라."
    },
    {
      "id": "AR2-04",
      "severity": "medium",
      "category": "data-model",
      "title": "ReportInstance UNIQUE 제약 설명이 § 7.2와 § 14.4에서 서로 다름",
      "locations": [
        "docs/features/analytics-reporting.md:521",
        "docs/features/analytics-reporting.md:756"
      ],
      "issue": "§ 7.2는 UNIQUE(instanceId, templateId, windowStart, windowEnd, idempotencyKey)를 말하지만 § 14.4는 UNIQUE(instanceId, idempotencyKey)만 정의한다.",
      "impact": "마이그레이션 구현자가 어느 제약을 SoT로 삼아야 하는지 불명확하다.",
      "recommendation": "하나로 통일하라. idempotencyKey가 canonical identity 전체를 포함한다면 § 7.2 문구를 § 14.4와 맞추고, 조회 최적화용 non-unique index를 별도로 둬라."
    },
    {
      "id": "AR2-05",
      "severity": "medium",
      "category": "notifications",
      "title": "analytics-report-ready sourceEventId는 충돌보다 보존기간 만료 후 재발송 문제가 남음",
      "locations": [
        "docs/features/analytics-reporting.md:523",
        "docs/features/notifications.md:233"
      ],
      "issue": "hash(instanceId + reportInstanceId)는 reportInstanceId가 전역 unique라면 충돌 위험은 낮다. 그러나 notifications는 receiptRetentionDays 이후 동일 sourceEventId 재사용을 새 이벤트로 처리할 수 있다고 하므로, 오래된 ReportInstance 재발송·재조회 시 중복 발송 가능성이 남는다.",
      "impact": "365일 이후 같은 reportInstanceId로 notify를 재호출하면 의도치 않은 발송이 생길 수 있다.",
      "recommendation": "ReportInstance에 notificationDispatchedAt/sourceEventId를 영구 저장하고, notify receipt 보존기간과 무관하게 ReportInstance 레벨에서 재발송을 차단한다고 명시하라."
    },
    {
      "id": "AR2-06",
      "severity": "high",
      "category": "threshold-hysteresis",
      "title": "hysteresis 전이 판단에 필요한 현재 상태 저장소가 없음",
      "locations": [
        "docs/features/analytics-reporting.md:541",
        "docs/features/analytics-reporting.md:759"
      ],
      "issue": "전이 조건은 '직전 상태 false/true'를 요구하지만 DailyUserMeasurement는 일별 측정값만 저장하고 현재 임계 상태, lastTransitionAt, lastReachedEventId, lastReleasedEventId를 저장하지 않는다.",
      "impact": "30일 미만 데이터 보존, backfill, 측정값 재계산, worker 재시작 상황에서 전이 이벤트 중복 또는 누락이 발생할 수 있다.",
      "recommendation": "MediaThresholdState 같은 별도 테이블을 추가하라. 최소 필드: instanceId, currentState, stateSince, lastAssessmentBasisDate, lastTransitionEventId, enterStreak, exitStreak, updatedAt."
    },
    {
      "id": "AR2-07",
      "severity": "high",
      "category": "threshold-hysteresis",
      "title": "DailyUserMeasurement UNIQUE(instanceId,date)는 source·bot policy 변경 이력을 보존하지 못함",
      "locations": [
        "docs/features/analytics-reporting.md:571",
        "docs/features/analytics-reporting.md:773"
      ],
      "issue": "측정값은 primarySource와 botFilteringPolicyId에 의존하지만 UNIQUE가 instanceId,date뿐이다. primarySource 변경, bot filtering policy 변경, backfill 재계산 시 같은 날짜의 기존 row를 덮어쓰게 된다.",
      "impact": "임계 전이와 ComplianceRecord snapshot의 근거를 사후 감사할 수 없다.",
      "recommendation": "measurementVersion 또는 basisKey(primarySource, botFilteringPolicyId, calendarPolicy, algorithmVersion)를 포함하고, active measurement를 별도 표시하라."
    },
    {
      "id": "AR2-08",
      "severity": "high",
      "category": "MA-02",
      "title": "rolling-90 운영 측정과 previous-3-months-calendar 법정 산정의 priorReview 적용 기준이 여전히 모호함",
      "locations": [
        "docs/features/analytics-reporting.md:571",
        "docs/features/analytics-reporting.md:577",
        "docs/core/DATA_MODEL.md:699"
      ],
      "issue": "analytics-reporting은 rolling-90은 운영 조기경보, previous-3-months-calendar는 법정 산정이라고 쓰지만 DATA_MODEL의 thresholdReached 설명은 '시행령 제24조 기준'이라고 되어 있다. 동시에 ComplianceRecord에 rolling-90과 calendar 값을 서로 다른 record version으로 함께 보존 가능하다고 해 priorReviewRequired 산정 기준이 흔들린다.",
      "impact": "운영 thresholdReached가 법적 priorReviewRequired로 오인될 수 있다.",
      "recommendation": "priorReviewRequired 산정에는 calendarPolicy='previous-3-months-calendar'만 사용한다고 명시하라. rolling-90 snapshot은 operationalAssessment로 분리하거나 priorReview 산정 금지 필드를 둬라."
    },
    {
      "id": "AR2-09",
      "severity": "high",
      "category": "MA-02",
      "title": "ComplianceRecord mediaThresholdAssessment 갱신 주체와 recordPhase 규칙이 충돌함",
      "locations": [
        "docs/features/analytics-reporting.md:583",
        "docs/features/analytics-reporting.md:585",
        "docs/core/DATA_MODEL.md:703",
        "docs/admin/REVIEW_WORKFLOW.md:415"
      ],
      "issue": "§ 8.3은 발행 시점에 본 Feature가 ComplianceRecord snapshot을 기록하고, 법무 판정 시점에는 legal 검수자가 보강한다고 한다. 그러나 DATA_MODEL은 mediaThresholdAssessment를 확정 판정 snapshot으로 설명하고 REVIEW_WORKFLOW는 판정 결과를 새 ComplianceRecord 슬롯에 기록한다고 한다.",
      "impact": "published record의 immutable 필드를 analytics-reporting이 직접 수정하는 구현, 또는 legal 판정 전 임시 측정값을 확정 판정 슬롯에 넣는 구현이 나올 수 있다.",
      "recommendation": "analytics-reporting은 measurement snapshot provider일 뿐 ComplianceRecord 직접 수정 주체가 아니라고 정리하라. pre-publish record 생성/갱신은 REVIEW_WORKFLOW API가 담당하고, published record는 staleFlags만 직접 갱신 가능하다는 C-10 규칙과 맞춰라."
    },
    {
      "id": "AR2-10",
      "severity": "high",
      "category": "workflow-integration",
      "title": "임계 전이 시 published 전체 priorReview 재평가를 트리거하는 API 계약이 없음",
      "locations": [
        "docs/features/analytics-reporting.md:543",
        "docs/admin/REVIEW_WORKFLOW.md:410",
        "docs/admin/REVIEW_WORKFLOW.md:412"
      ],
      "issue": "REVIEW_WORKFLOW는 media-threshold 이벤트 발송 시 재평가 트리거를 수행한다고 하지만 analytics-reporting은 notifications.notify() 호출만 정의한다. notify는 발송 시스템이지 워크플로 command bus가 아니다.",
      "impact": "알림 발송 성공과 priorReview 큐 생성이 분리되지 않아, 알림만 가고 실제 staleFlags.legal 갱신이 누락될 수 있다.",
      "recommendation": "analytics-reporting이 REVIEW_WORKFLOW의 명시 API 예: enqueueMediaThresholdReassessment(instanceId, transitionEventId, assessmentBasisDate)를 호출하고, notify는 그 결과 알림으로만 사용한다고 계약을 추가하라."
    },
    {
      "id": "AR2-11",
      "severity": "medium",
      "category": "raw-payload",
      "title": "GA4 raw payload allowlist가 동적 필드 모델을 충분히 다루지 못함",
      "locations": [
        "docs/features/analytics-reporting.md:422",
        "docs/features/analytics-reporting.md:427"
      ],
      "issue": "GA4는 customDimension, customMetric, eventParameters 등 동적 필드가 흔하다. 현재 allowlist는 'metric values'처럼 포괄적이고 custom field 처리 규칙이 없다.",
      "impact": "커스텀 파라미터에 email, phone, client id가 들어오는 경우 allowlist 검증을 우회하거나 반대로 정상 집계 필드가 모두 drop될 수 있다.",
      "recommendation": "GA4 custom dimension/metric은 manifest에 명시적으로 allowlisted key와 classification을 등록한 경우만 저장하도록 하라. eventParameters는 기본 저장 금지로 두고 필요한 key만 path-level allowlist를 요구하라."
    },
    {
      "id": "AR2-12",
      "severity": "medium",
      "category": "PII-DSR",
      "title": "DsrDeletionLog.subjectIdentifier와 실제 삭제 대상 매칭 방식이 없음",
      "locations": [
        "docs/features/analytics-reporting.md:564",
        "docs/features/analytics-reporting.md:807"
      ],
      "issue": "subjectIdentifier는 비식별·해시 처리된 식별자라고 되어 있지만 본 Feature는 aggregated 데이터만 저장한다고도 한다. 어떤 컬럼과 이 해시를 비교해 삭제하는지 정의가 없다.",
      "impact": "DSR 요청을 수락해도 recordsDeleted=0이 정상인지 실패인지 판정하기 어렵고, raw redaction 누락 사고 시 삭제 방법도 없다.",
      "recommendation": "정상 경로에서는 subject-level deletion not applicable로 응답한다고 명시하라. raw incident 대응용으로만 quarantined raw record 검색 절차와 hash salt/key version을 별도 정의하라."
    },
    {
      "id": "AR2-13",
      "severity": "medium",
      "category": "build-validation",
      "title": "pii.rawPayloadAllowlist=false build fail은 설정값 의미를 무력화함",
      "locations": [
        "docs/features/analytics-reporting.md:175",
        "docs/features/analytics-reporting.md:647"
      ],
      "issue": "rawPayloadAllowlist=false이면 enabled=true에서 무조건 build fail이므로 운영자가 false로 설정할 합법적 의미가 없다.",
      "impact": "설정명이 allowlist 사용 여부인지 raw payload 저장 여부인지 혼동된다.",
      "recommendation": "rawPayloadStorage.enabled와 rawPayloadAllowlist.required를 분리하라. allowlist는 항상 required로 고정하고, raw 저장을 끄는 운영 옵션은 별도 boolean으로 제공하라."
    },
    {
      "id": "AR2-14",
      "severity": "medium",
      "category": "rate-limit",
      "title": "rateLimit.bucketBackend의 적용 범위가 instance별인지 provider 글로벌인지 불명확함",
      "locations": [
        "docs/features/analytics-reporting.md:166",
        "docs/features/analytics-reporting.md:350"
      ],
      "issue": "redis-token-bucket 또는 db-advisory-lock을 선택한다고만 되어 있고 bucket key가 instanceId 포함인지, provider credential 단위인지, 전체 배포 글로벌인지 정의가 없다.",
      "impact": "멀티 인스턴스에서 같은 GA4/GSC credential quota를 공유할 때 quota 초과를 막지 못하거나, 반대로 인스턴스별로 과도하게 제한할 수 있다.",
      "recommendation": "bucket key를 provider+credentialRef+source 또는 instanceId+source 중 어떤 것으로 삼는지 source별로 명시하라. provider quota는 credential/global bucket, 내부 공정성은 instance sub-bucket으로 분리하는 것이 안전하다."
    },
    {
      "id": "AR2-15",
      "severity": "high",
      "category": "retry-queue",
      "title": "CollectionRetryQueue worker·claim·status 계약이 없음",
      "locations": [
        "docs/features/analytics-reporting.md:375",
        "docs/features/analytics-reporting.md:793"
      ],
      "issue": "retry queue enqueue와 테이블은 있지만 worker 주기, due row claim 방식, lockedAt/lockedBy/status, 성공 시 처리, maxAttempts 증가 규칙이 없다.",
      "impact": "여러 worker가 같은 retry row를 동시에 처리하거나, 실패 row가 영구히 stuck될 수 있다.",
      "recommendation": "CollectionRetryQueue에 status, lockedAt, lockedBy, completedAt, nextAttemptAt을 추가하고 SELECT ... FOR UPDATE SKIP LOCKED 또는 advisory lock 기반 claim 쿼리를 명시하라."
    },
    {
      "id": "AR2-16",
      "severity": "medium",
      "category": "query-api",
      "title": "QueryInput.filters 배열의 AND/OR 의미가 정의되지 않음",
      "locations": [
        "docs/features/analytics-reporting.md:277"
      ],
      "issue": "filters가 배열이지만 조건 간 결합이 AND인지 OR인지, 같은 dimension에 대한 여러 조건을 어떻게 처리하는지 정의하지 않는다.",
      "impact": "다른 Feature가 queryNormalizedMetrics를 사용할 때 구현별 결과가 달라진다.",
      "recommendation": "기본은 모든 filter AND, 같은 dimension의 in은 OR set으로 처리한다고 명시하거나, 명시적 filterExpression AST를 도입하라."
    },
    {
      "id": "AR2-17",
      "severity": "medium",
      "category": "query-api",
      "title": "dimensions=[] 의미가 정의되지 않음",
      "locations": [
        "docs/features/analytics-reporting.md:275"
      ],
      "issue": "dimensions가 빈 배열일 때 전체 합산 single row를 반환하는지, date는 항상 암묵 포함인지, 오류인지 정의가 없다.",
      "impact": "리포트 summary 섹션과 다른 Feature 소비자가 총합 지표를 일관되게 얻기 어렵다.",
      "recommendation": "dimensions=[]는 window 전체 single aggregate row로 정의하거나 build/runtime validation fail로 명확히 하라."
    },
    {
      "id": "AR2-18",
      "severity": "medium",
      "category": "query-api",
      "title": "sourceFilter 부재 시 cross-source 파생 metric 합산이 의미적으로 불안정함",
      "locations": [
        "docs/features/analytics-reporting.md:280",
        "docs/features/analytics-reporting.md:314"
      ],
      "issue": "sourceFilter가 없으면 모든 source를 합산하는 것으로 읽히지만 ctr, position, bounceRate는 source별 의미와 denominator가 다르다. 특히 GSC와 네이버 position을 합산하거나 GA4 bounceRate와 RUM pageviews를 섞는 것이 정의되지 않았다.",
      "impact": "queryNormalizedMetrics가 그럴듯하지만 잘못된 통합 지표를 반환할 수 있다.",
      "recommendation": "파생 metric은 compatible source set에서만 계산하도록 제한하라. sourceFilter 부재 시 metric별 default source 또는 error 정책을 정의하라."
    },
    {
      "id": "AR2-19",
      "severity": "medium",
      "category": "query-api",
      "title": "dataCompleteness 집계 방식이 source·date·metric별로 정의되지 않음",
      "locations": [
        "docs/features/analytics-reporting.md:257",
        "docs/features/analytics-reporting.md:309",
        "docs/features/analytics-reporting.md:519"
      ],
      "issue": "CollectionResult는 source별 completeness, ReportGenerationResult는 source별 평균, QueryResult는 단일 number만 제공한다. windowDate별 평균인지, source별 weighted average인지, metric availability 기준인지 정의가 없다.",
      "impact": "리포트 품질 판단과 priorReview 근거 자료의 신뢰도가 구현마다 달라진다.",
      "recommendation": "dataCompletenessBreakdown을 source/date/metric 단위로 반환하고, 단일 dataCompleteness는 명시된 weighted formula로 계산하라."
    },
    {
      "id": "AR2-20",
      "severity": "medium",
      "category": "normalized-schema",
      "title": "QueryDimension.analyticsSource와 NormalizedMetricRow.source 명칭이 1:1 매핑이라는 선언과 어긋남",
      "locations": [
        "docs/features/analytics-reporting.md:283",
        "docs/features/analytics-reporting.md:441"
      ],
      "issue": "§ 6.1은 QueryDimension·QueryMetric과 1:1 매핑이라고 하지만 QueryDimension에는 analyticsSource가 있고 row 필드는 source다.",
      "impact": "query layer mapping에서 analyticsSource를 source alias로 처리해야 하는지 불명확하다.",
      "recommendation": "QueryDimension 값을 source로 바꾸거나 analyticsSource는 NormalizedMetricRow.source의 public alias라고 명시하라."
    },
    {
      "id": "AR2-21",
      "severity": "low",
      "category": "normalized-schema",
      "title": "dimensionKey NOT NULL UNIQUE 문구가 실제 composite UNIQUE와 충돌함",
      "locations": [
        "docs/features/analytics-reporting.md:474",
        "docs/features/analytics-reporting.md:722"
      ],
      "issue": "§ 6.1은 dimensionKey를 NOT NULL UNIQUE 컬럼으로 운영한다고 하지만 § 14.2는 UNIQUE(instanceId,date,source,dimensionKey)다.",
      "impact": "dimensionKey 단독 전역 unique로 오해하면 같은 dimension 조합이 날짜·source별로 저장되지 못한다.",
      "recommendation": "§ 6.1 문구를 'NOT NULL, composite UNIQUE의 일부'로 정정하라."
    },
    {
      "id": "AR2-22",
      "severity": "medium",
      "category": "schedule-timezone",
      "title": "collectionSchedule과 missed run의 DST·중복 실행 처리 규칙이 부족함",
      "locations": [
        "docs/features/analytics-reporting.md:132",
        "docs/features/analytics-reporting.md:367",
        "docs/features/analytics-reporting.md:371"
      ],
      "issue": "03:00이 인스턴스 timezone 기준이라고만 하고 DST로 시간이 사라지거나 두 번 발생하는 날, missed run carry-over의 최대 catch-up 범위와 idempotencyKey 산정 기준이 없다.",
      "impact": "DST 적용 지역 인스턴스에서 수집 누락 또는 중복 실행이 발생할 수 있다.",
      "recommendation": "IANA timezone, nonexistent local time은 다음 유효 시각, ambiguous local time은 첫 번째 또는 두 번째 중 하나로 고정, missed run은 scheduledFor date별 idempotencyKey로 catch-up한다고 명시하라."
    },
    {
      "id": "AR2-23",
      "severity": "low",
      "category": "schedule-timezone",
      "title": "reportTemplates[].schedule 문법이 예시만 있고 문법 SoT가 없음",
      "locations": [
        "docs/features/analytics-reporting.md:147",
        "docs/features/analytics-reporting.md:152",
        "docs/features/analytics-reporting.md:498",
        "docs/features/analytics-reporting.md:647"
      ],
      "issue": "MON 09:00, 1st 09:00 예시는 있지만 허용 문법, 월말/공휴일/DST/missed run 규칙이 없다. build fail은 schedule 형식 오류를 검사한다고 되어 있어 더 문제가 된다.",
      "impact": "검증기가 무엇을 허용해야 하는지 알 수 없다.",
      "recommendation": "간단한 grammar를 정의하라. 예: weekly = MON|TUE... HH:mm, monthly = 1st|last HH:mm, timezone = InstanceManifest.timezone."
    },
    {
      "id": "AR2-24",
      "severity": "low",
      "category": "editorial-consistency",
      "title": "§ 4.1이 존재하지 않는 § 5.6을 참조함",
      "locations": [
        "docs/features/analytics-reporting.md:360",
        "docs/features/analytics-reporting.md:420"
      ],
      "issue": "응답 정규화 단계에서 raw payload allowlist redaction (§ 5.6)을 참조하지만 실제 절은 § 5.5다.",
      "impact": "사소하지만 정정 과정에서 생긴 잔재로 보이며 링크/문서 생성 시 깨진 참조가 된다.",
      "recommendation": "§ 5.5로 수정하라."
    }
  ],
  "cascadeChecks": [
    {
      "item": "SEARCH_STANDARDIZATION § 6.3.1 PII 규약",
      "status": "mostly-consistent",
      "notes": "analytics-reporting § 8.1의 IP/UA/full URL 금지 원칙은 SEARCH_STANDARDIZATION § 6.3.1과 대체로 일치한다. 다만 GA4 custom/event parameter allowlist는 본 문서에서 추가 보강 필요."
    },
    {
      "item": "REVIEW_WORKFLOW § 9.1.1 신규 3종 이벤트 매트릭스",
      "status": "consistent",
      "notes": "analytics-report-ready, media-threshold-reached, media-threshold-released의 enum과 fallback 채널 컬럼은 REVIEW_WORKFLOW에 반영되어 있다."
    },
    {
      "item": "REVIEW_WORKFLOW § 8.1.1 임계 전이 staleFlags.legal",
      "status": "partially-consistent",
      "notes": "외부 문서는 이벤트 수신 시 모든 published 콘텐츠 재평가를 정의하지만, analytics-reporting은 notify 호출만 정의해 실제 workflow API 트리거 계약이 부족하다."
    },
    {
      "item": "DATA_MODEL C-08 AnalyticsConfig",
      "status": "consistent",
      "notes": "C-08 top-level analyticsConfig는 자격증명·식별자만 두고 동작 옵션은 feature config로 분리되어 있다."
    },
    {
      "item": "DATA_MODEL C-10 MediaThresholdAssessment",
      "status": "partially-consistent",
      "notes": "슬롯 자체는 반영되어 있으나 운영 rolling snapshot과 법적 확정 판정 snapshot의 저장 위치·갱신 주체가 혼재되어 있다."
    }
  ],
  "highestPriorityFixes": [
    "CollectionInput sources canonicalization과 force refresh 계약을 먼저 고쳐 idempotency 중복/무시 문제를 막을 것",
    "MediaThresholdState 테이블 또는 동등한 상태 저장소를 추가해 hysteresis 전이를 감사 가능하게 만들 것",
    "analytics-reporting과 REVIEW_WORKFLOW 사이에 notify가 아닌 명시적 priorReview 재평가 command/API를 정의할 것",
    "queryNormalizedMetrics의 filters, empty dimensions, sourceFilter, dataCompleteness 산식을 명확히 할 것",
    "CollectionRetryQueue worker claim/status 스키마를 추가할 것"
  ]
}