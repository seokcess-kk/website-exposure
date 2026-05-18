{
  "schemaVersion": "review-findings-v1",
  "target": "docs/features/analytics-reporting.md",
  "targetVersion": "v0.3",
  "reviewDate": "2026-05-14",
  "findings": [
    {
      "id": "AR3-01",
      "severity": "high",
      "category": "collection-state",
      "location": "docs/features/analytics-reporting.md:234-242,380,725-742",
      "issue": "CollectionSourceAttempt status enum에 `processing`이 없다.",
      "evidence": "§ 4.1은 `CollectionSourceAttempt insert (status=\"processing\")`를 요구하지만, § 3.2 `CollectionSourceAttemptResult.status` enum에는 `processing`이 없고 § 14.4도 enum 값을 확정하지 않는다.",
      "impact": "구현체가 처리 중 attempt를 API에 반환하거나 DB enum으로 저장할 때 계약 위반이 된다.",
      "recommendation": "`CollectionSourceAttempt.status`의 DB/API enum을 명시하고 `processing` 포함 여부를 확정하라. 외부 Result에 숨길 상태라면 DB enum과 Result enum을 분리하라."
    },
    {
      "id": "AR3-02",
      "severity": "critical",
      "category": "retry-concurrency",
      "location": "docs/features/analytics-reporting.md:407-424,725-742,803-810",
      "issue": "retry worker의 새 attemptNumber 산정이 동시성 안전하지 않다.",
      "evidence": "CollectionRetryQueue worker는 `FOR UPDATE SKIP LOCKED`로 queue row만 claim한다. 하지만 새 `CollectionSourceAttempt`의 `attemptNumber=max+1` 산정 lock, advisory lock, per-source sequence가 없다.",
      "impact": "동일 `collectionLogId/source`의 retry queue row가 중복 생성되거나 stale 복귀와 경합하면 `UNIQUE(collectionLogId, source, attemptNumber)` 충돌 또는 attempt 누락이 발생한다.",
      "recommendation": "notifications § 4.4처럼 `(collectionLogId, source)` 범위 advisory lock 또는 별도 sequence row를 SoT로 명시하고, provider 호출 전 `processing` attempt 선점 규칙을 추가하라."
    },
    {
      "id": "AR3-03",
      "severity": "high",
      "category": "retry-state",
      "location": "docs/features/analytics-reporting.md:390-393,418-420",
      "issue": "retry exhausted 처리와 envelope 승격 조건이 불완전하다.",
      "evidence": "§ 4.3은 maxAttempts 도달 시 `DeliveryStatus failed-permanent` 마킹이라고 쓰지만 이 Feature의 source attempt status enum에는 DeliveryStatus가 없다. retry 성공 후 모든 source attempt가 종결되었을 때 `processing → completed/partial-failed/failed`로 승격하는 reconcile 규칙도 없다.",
      "impact": "envelope가 영구히 `processing`에 남거나, retry 성공 후에도 API/운영 지표가 실패 상태로 남을 수 있다.",
      "recommendation": "`CollectionSourceAttempt.status=\"failed-permanent\"`로 정정하고, retry worker 종료 시 최신 attempt 기준 envelope 재계산 알고리즘을 명시하라."
    },
    {
      "id": "AR3-04",
      "severity": "medium",
      "category": "envelope-state",
      "location": "docs/features/analytics-reporting.md:390-393",
      "issue": "`partial-failed`와 `failed` 판정 기준이 모호하다.",
      "evidence": "§ 4.1은 `1+ failed-permanent·failed-credential → \"partial-failed\" 또는 \"failed\"`라고만 한다.",
      "impact": "전 source 실패, 일부 source 성공, skipped-disabled 혼합 상태의 envelopeState가 구현마다 달라진다.",
      "recommendation": "예: 성공/partial 0건이면 `failed`, 1건 이상 usable이면 `partial-failed`, retry 대기 존재 시 `processing` 우선 등 우선순위를 표로 고정하라."
    },
    {
      "id": "AR3-05",
      "severity": "high",
      "category": "idempotency",
      "location": "docs/features/analytics-reporting.md:211-215,371-378",
      "issue": "`sources` 미지정 canonicalization이 활성 source 변경에 따라 idempotencyKey를 바꾼다.",
      "evidence": "`sources ?? sortedActiveAnalyticsSources()`를 idempotencyKey 입력으로 사용한다. manifest에서 ga4를 비활성화하면 같은 window/mode 호출의 key가 바뀐다.",
      "impact": "과거 scheduled run 재호출이 기존 CollectionLog를 재사용하지 않고 새 lineage를 만든다. 의도라면 정책 명시가 필요하고, 의도가 아니라면 멱등성이 깨진다.",
      "recommendation": "scheduled job 생성 시 canonicalSources를 schedule payload에 freeze하거나, idempotencyKey에 manifestVersion을 넣고 활성 source 변경 시 새 collection으로 보는 정책을 명시하라."
    },
    {
      "id": "AR3-06",
      "severity": "medium",
      "category": "force-refresh",
      "location": "docs/features/analytics-reporting.md:205-215,371-378,649",
      "issue": "`forceRefresh=true` + `refreshIntentId` 누락 fail의 판정 시점이 불명확하다.",
      "evidence": "§ 11은 runtime fail이라고 쓰지만, idempotencyKey 산정 pseudocode는 `forceRefresh` truthy만 보고 `refreshIntentId`를 결합한다.",
      "impact": "빈 문자열, null, undefined, omitted false의 구분이 구현마다 달라질 수 있다.",
      "recommendation": "`forceRefresh === true`인 경우 non-empty `refreshIntentId` required, `forceRefresh !== true`이면 `refreshIntentId` must be absent 또는 ignored 중 하나로 확정하라."
    },
    {
      "id": "AR3-07",
      "severity": "high",
      "category": "report-idempotency",
      "location": "docs/features/analytics-reporting.md:256-263,527-535",
      "issue": "generateReport의 `forceRefresh` 분기가 실행 흐름에 반영되지 않았다.",
      "evidence": "ReportGenerationInput에는 `forceRefresh/refreshIntentId`가 있고 key 산정 주석도 있으나, § 7.2는 충돌 시 `notificationDispatchedAt`만 보고 기존 report 재사용/재발송을 결정한다.",
      "impact": "같은 window를 강제 재생성하려는 호출이 기존 artifact를 반환하거나, 반대로 같은 intent 재호출이 재렌더링될 수 있다.",
      "recommendation": "collection과 동일하게 force refresh lineage 생성 조건, refreshIntentId required 조건, 기존 ReportInstance 충돌 처리 규칙을 § 7.2에 추가하라."
    },
    {
      "id": "AR3-08",
      "severity": "medium",
      "category": "notification-idempotency",
      "location": "docs/features/analytics-reporting.md:527-535",
      "issue": "ReportInstance 발송 성공 후 `notificationDispatchedAt` 저장 실패 시 재발송 차단 보장이 깨진다.",
      "evidence": "§ 7.2는 notify 후 `notificationDispatchedAt + sourceEventId`를 영구 저장한다고만 한다. 저장 실패, 프로세스 crash, DB timeout 시 복구 규칙이 없다.",
      "impact": "notifications receipt 365일 만료 후 같은 report가 재발송될 수 있다.",
      "recommendation": "ReportInstance에 `notificationDispatchClaimedAt/status`를 먼저 저장하는 outbox 패턴 또는 notify 결과 reconcile worker를 명시하라."
    },
    {
      "id": "AR3-09",
      "severity": "high",
      "category": "threshold-state",
      "location": "docs/features/analytics-reporting.md:547-550,781-789",
      "issue": "MediaThresholdState의 상태 타입이 본문에서 서로 다르다.",
      "evidence": "§ 7.3은 `currentState=false/true`로 설명하지만 § 14.7은 enum `below-threshold | above-threshold`다.",
      "impact": "transition 조건, transitionEventId의 `newState`, notification eventType 매핑에서 구현 혼선이 생긴다.",
      "recommendation": "본문 조건을 `currentState=\"below-threshold\"` / `\"above-threshold\"`로 정정하거나 DB 타입을 boolean으로 바꾸라."
    },
    {
      "id": "AR3-10",
      "severity": "high",
      "category": "hysteresis",
      "location": "docs/features/analytics-reporting.md:543-550,781-789",
      "issue": "enterStreak/exitStreak 갱신 및 reset 규칙이 없다.",
      "evidence": "§ 7.3은 `streak counter 갱신만`이라고 하지만 threshold 이상/미만일 때 반대 streak를 언제 0으로 reset하는지, 결측일·partial completeness일 때 streak를 유지/차단/skip하는지 정의하지 않는다.",
      "impact": "임계 도달/해제 전이가 구현마다 다르게 발생한다.",
      "recommendation": "dailyUsers >= threshold이면 enterStreak += 1 및 exitStreak=0, 반대면 exitStreak += 1 및 enterStreak=0 같은 규칙과 결측·불완전 데이터 처리 규칙을 명시하라."
    },
    {
      "id": "AR3-11",
      "severity": "medium",
      "category": "threshold-idempotency",
      "location": "docs/features/analytics-reporting.md:552",
      "issue": "transitionEventId 입력이 측정 basis 변경을 반영하지 않는다.",
      "evidence": "hash 입력이 `instanceId + newState + assessmentBasisDate`뿐이다. `basisKey`, threshold, algorithmVersion, botFilteringPolicyId가 없다.",
      "impact": "같은 기준일에 algorithm/bot policy 변경으로 재평가가 필요해도 workflow UNIQUE가 중복으로 막을 수 있다.",
      "recommendation": "transitionEventId에 `basisKey` 또는 measurementAlgorithmVersion/botFilteringPolicyId/threshold를 포함하라."
    },
    {
      "id": "AR3-12",
      "severity": "critical",
      "category": "workflow-api",
      "location": "docs/features/analytics-reporting.md:553-556, docs/admin/REVIEW_WORKFLOW.md:413-427",
      "issue": "`enqueueMediaThresholdReassessment()` 처리 실패 후 재시도 정책이 없다.",
      "evidence": "REVIEW_WORKFLOW는 `transitionEventId UNIQUE`만 명시하고, API 호출 실패·부분 enqueue·DB commit 후 응답 실패·workflow 내부 처리 실패의 상태/재시도 계약을 정의하지 않는다.",
      "impact": "임계 전이는 발생했지만 legal 재평가 큐가 생성되지 않는 silent failure가 가능하다.",
      "recommendation": "analytics-reporting 측 outbox/retry queue를 두거나 workflow API가 receipt state를 반환하도록 하고, `transitionEventId` 기반 재호출 시 completed/processing/failed를 구분하라."
    },
    {
      "id": "AR3-13",
      "severity": "high",
      "category": "data-model-cascade",
      "location": "docs/features/analytics-reporting.md:553-561, docs/core/DATA_MODEL.md:687-703, docs/admin/REVIEW_WORKFLOW.md:427-433",
      "issue": "measurementSnapshot과 DATA_MODEL `MediaThresholdAssessment` 필드 매핑이 1:1로 명시되지 않았다.",
      "evidence": "DATA_MODEL은 `assessmentBasisDate/windowStart/windowEnd/rollingAverageDailyUsers/thresholdReached/primarySource/sourceCompleteness/timezone/calendarPolicy/botFilteringPolicy/legalBasisNote`를 요구한다. analytics-reporting은 snapshot 산정이라고만 하고 각 필드 출처를 지정하지 않는다.",
      "impact": "rolling 운영 snapshot을 ComplianceRecord의 확정 판정 슬롯에 저장할 때 어떤 값이 법정 산정인지 불명확하다.",
      "recommendation": "MediaThresholdAssessment 필드별 산출표를 추가하고, rolling snapshot은 `legalBasisNote` 없는 운영 입력인지, calendar snapshot은 legal 확정값인지 저장 위치를 분리하라."
    },
    {
      "id": "AR3-14",
      "severity": "high",
      "category": "query-semantics",
      "location": "docs/features/analytics-reporting.md:289-338,347-355",
      "issue": "`dimensions=[]` + 여러 metric 요청 시 source가 섞인 single aggregate row가 된다.",
      "evidence": "§ 3.4는 dimensions=[]를 single aggregate row로 정의하고, sourceFilter 미지정 시 metric별 default source 단일 사용이라고 한다. `impressions`는 gsc, `sessions`는 ga4가 같은 row에 들어갈 수 있지만 row에는 source 차원이 없다.",
      "impact": "호출자가 한 row를 단일 source 집계로 오해할 수 있다. § 3.4.1의 `metadata에 표시`도 QueryResult 타입에 metadata 필드가 없다.",
      "recommendation": "multi-metric default source가 서로 다르면 `source` dimension을 강제하거나, metric별 source metadata를 `metricSourceMap`으로 QueryResult에 추가하라."
    },
    {
      "id": "AR3-15",
      "severity": "medium",
      "category": "query-completeness",
      "location": "docs/features/analytics-reporting.md:335-340",
      "issue": "dataCompletenessBreakdown이 주석의 source/date/metric 단위를 표현하지 못한다.",
      "evidence": "타입은 `{ source, metric, perDateCompleteness }`만 있고 `date` 필드가 없다.",
      "impact": "어느 날짜가 incomplete인지 알 수 없고, `dataCompleteness = weighted avg over (source, metric, date)` 검산도 불가능하다.",
      "recommendation": "`date`를 포함한 per-date row로 바꾸거나 이름을 `avgDateCompleteness`로 정정하라."
    },
    {
      "id": "AR3-16",
      "severity": "medium",
      "category": "query-filter",
      "location": "docs/features/analytics-reporting.md:292-306",
      "issue": "QueryFilter AST의 동일 dimension 혼합 조건이 덜 정의됐다.",
      "evidence": "같은 dimension의 `equals` 다수만 invalid라고 한다. `equals` + `in`, `startsWith` 다수, `startsWith` + `equals` 조합의 우선순위/invalid 여부가 없다.",
      "impact": "SQL 변환 결과가 구현마다 AND, OR, 마지막 값 우선 등으로 달라질 수 있다.",
      "recommendation": "dimension별 filter는 최대 1개만 허용하거나, op 조합별 truth table을 추가하라. runtime query 입력이므로 build fail이 아니라 validation error로 표현하라."
    },
    {
      "id": "AR3-17",
      "severity": "medium",
      "category": "schedule-dst",
      "location": "docs/features/analytics-reporting.md:400-404",
      "issue": "DST `first`/`next-valid`의 time-zone library SoT가 없다.",
      "evidence": "InstanceManifest는 IANA timezone을 쓰지만, ambiguous local time의 `first`가 Temporal/Luxon/date-fns-tz 등 어떤 disambiguation 옵션과 대응되는지 명시하지 않는다.",
      "impact": "런타임 라이브러리 교체 시 scheduledFor가 달라질 수 있다.",
      "recommendation": "IANA TZDB + Temporal disambiguation 기준 같은 SoT를 명시하고, `first`가 earlier offset인지 later offset인지 정의하라."
    },
    {
      "id": "AR3-18",
      "severity": "medium",
      "category": "missed-run",
      "location": "docs/features/analytics-reporting.md:403-404",
      "issue": "missedRunCarryOverMaxDays 초과 누락분 처리 정책이 없다.",
      "evidence": "윈도우 내 누락된 scheduledFor date를 catch-up한다고만 하고, 7일 초과분을 drop, manual backfill, alert 중 무엇으로 처리하는지 없다.",
      "impact": "장애 장기화 후 데이터 공백이 조용히 발생할 수 있다.",
      "recommendation": "초과분은 `skipped-missed-run-expired` 운영 로그 + sink alert + manual backfill 필요 등으로 명시하라."
    },
    {
      "id": "AR3-19",
      "severity": "medium",
      "category": "rate-limit",
      "location": "docs/features/analytics-reporting.md:158-164,383",
      "issue": "rateLimit bucketKeyStrategy의 실제 bucketKey 형식과 multi-instance 공유 정책이 없다.",
      "evidence": "`credential-global`/`instance-isolated` 전략만 있고 `provider:source:credentialHash`인지 `instanceId` 포함 여부가 없다.",
      "impact": "같은 service account를 여러 instance가 공유할 때 quota bucket이 분산되어 provider quota를 초과할 수 있다.",
      "recommendation": "`credential-global = ar:quota:{provider}:{credentialHash}`처럼 형식을 고정하고, credentialHash 산정·secret rotation 시 bucket 이관 정책을 명시하라."
    },
    {
      "id": "AR3-20",
      "severity": "high",
      "category": "pii-raw-payload",
      "location": "docs/features/analytics-reporting.md:385,453,474-476",
      "issue": "GA4 allowlist redaction의 적용 시점이 서로 다르게 읽힌다.",
      "evidence": "§ 5.3은 미등록 custom field를 `redaction worker`가 drop한다고 하고, § 5.5는 `저장 전 redaction worker`라고 한다. § 4.1은 `응답 정규화 + raw payload allowlist redaction + DB 저장` 순서다.",
      "impact": "비허용 GA4 custom field가 raw 또는 normalized 처리 단계에 잠깐이라도 저장/사용될 수 있는지 불명확하다.",
      "recommendation": "provider response 수신 직후 memory-only allowlist projection을 수행하고, projection 전 payload는 로그/DB/에러에 남기지 않는다고 명시하라."
    },
    {
      "id": "AR3-21",
      "severity": "medium",
      "category": "raw-storage-disabled",
      "location": "docs/features/analytics-reporting.md:127,476,694-700",
      "issue": "`rawPayloadStorage.enabled=false`일 때 redaction audit trail과 처리 흐름이 불명확하다.",
      "evidence": "raw row는 미생성이라고 하지만 retention에는 `rawRedactionAuditTrail`이 있고, § 4.1의 200 처리 흐름은 raw redaction + DB 저장을 전제로 한다.",
      "impact": "raw 저장 비활성 인스턴스에서 어떤 증거로 `containsPersonalData=false` 검증을 감사할지 모호하다.",
      "recommendation": "raw disabled 시 provider response는 memory-only projection 후 폐기하고, audit trail에는 schema/version/count/hash만 저장하는 별도 레코드 여부를 명시하라."
    },
    {
      "id": "AR3-22",
      "severity": "medium",
      "category": "dsr",
      "location": "docs/features/analytics-reporting.md:572-574,813-823",
      "issue": "DSR reason 값이 응답과 DsrDeletionLog enum 사이에서 불일치한다.",
      "evidence": "§ 8.1 응답 reason은 `subject-level data not stored — aggregated only`이고, § 14.9 reason 설명은 `aggregated-only-not-applicable` 또는 raw incident 상세다.",
      "impact": "감사 로그와 API 응답을 기계적으로 대조하기 어렵다.",
      "recommendation": "machine reason enum과 human message를 분리하고, subjectIdentifier optional일 때 해시 저장/미저장 정책을 정하라."
    },
    {
      "id": "AR3-23",
      "severity": "low",
      "category": "cross-reference",
      "location": "docs/features/analytics-reporting.md:540,781",
      "issue": "MediaThresholdState 절 참조 번호가 틀렸다.",
      "evidence": "§ 7.3은 `MediaThresholdState(§ 14.9)`라고 하지만 실제 MediaThresholdState는 § 14.7이고 § 14.9는 DsrDeletionLog다.",
      "impact": "구현자가 잘못된 데이터 구조 절로 이동한다.",
      "recommendation": "§ 7.3 참조를 § 14.7로 정정하라."
    }
  ],
  "summary": {
    "totalFindings": 23,
    "critical": 2,
    "high": 9,
    "medium": 11,
    "low": 1,
    "mainResidualRisks": [
      "retry/attempt 동시성",
      "hysteresis state machine",
      "workflow enqueue 재시도",
      "queryNormalizedMetrics multi-source 의미론",
      "PII raw 처리 흐름"
    ]
  }
}