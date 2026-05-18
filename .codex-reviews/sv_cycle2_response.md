{
  "schemaVersion": "review-findings-v1",
  "target": "docs/features/search-visibility.md",
  "versionReviewed": "v0.2",
  "overallAssessment": {
    "status": "needs-third-cycle",
    "summary": "v0.1의 큰 구조 결함은 상당히 줄었지만, v0.2는 새로 도입한 outbox/state/query-set/legal-gate가 아직 단독 구현 가능한 수준으로 닫히지 않았다. 특히 DATA_MODEL C-08 법무 게이트 문구 오류, query set 산출 계약, MonitoringLog/RetryQueue 스키마, VisibilityState enum, Backlink 정규화 미결정은 v1.0 전 차단 이슈다."
  },
  "findings": [
    {
      "id": "SV2-01",
      "severity": "critical",
      "category": "legal-gate",
      "title": "DATA_MODEL C-08의 serpCrawler 법무 게이트 조건이 본문과 반대로 적혀 있다",
      "evidence": [
        "search-visibility.md:402는 enabled=true + legalApproved=false 또는 승인자/시각 누락 시 build fail이라고 정의한다.",
        "DATA_MODEL.md:649는 enabled=true + legalApproved=true·legalApprovedBy·legalApprovedAt 누락 시 build fail이라고 적어, legalApproved=true 자체를 fail 조건처럼 읽히게 한다."
      ],
      "impact": "C-08이 SoT인 이상 구현자는 잘못된 조건식을 만들 수 있다. 법무 승인 없는 SERP 크롤링을 통과시키거나, 승인된 설정을 잘못 차단할 위험이 있다.",
      "recommendation": "DATA_MODEL C-08 문구를 `enabled=true + (legalApproved !== true 또는 legalApprovedBy/At 누락) 시 build fail`로 정정하고, search-visibility § 11.1과 동일한 truth table을 추가하라."
    },
    {
      "id": "SV2-02",
      "severity": "high",
      "category": "legal-gate",
      "title": "approvedScope가 자유 텍스트라 런타임 권한 범위 제한에 사용할 수 없다",
      "evidence": [
        "search-visibility.md:118 예시는 approvedScope를 문자열로 둔다.",
        "search-visibility.md:403은 production에서 approvedScope 명시만 요구한다.",
        "DATA_MODEL.md:649도 approvedScope를 optional string으로만 둔다."
      ],
      "impact": "법무가 승인한 검색엔진, locale, device, login/captcha 금지, 저장 artifact 범위가 실제 crawler 실행 파라미터에 검증되지 않는다.",
      "recommendation": "approvedScope를 구조화하라. 예: `{searchEngines, locales, devices, geo, allowLoginState:false, allowCaptchaBypass:false, artifactRetentionDaysMax, allowedPaths}`. build/runtime에서 crawler 요청이 scope 밖이면 fail 또는 skipped-legal-out-of-scope로 처리하도록 명시하라."
    },
    {
      "id": "SV2-03",
      "severity": "high",
      "category": "query-set",
      "title": "analytics-derived top-N query 산출에 필요한 queryNormalizedMetrics 호출 계약이 빠져 있다",
      "evidence": [
        "search-visibility.md:318은 최근 28일 impressions 합산 기준 top-N 쿼리를 산출한다고만 한다.",
        "search-visibility.md:369 이하 예시는 exposureTrend page 단위 호출만 있고 query dimension 호출이 없다.",
        "analytics-reporting.md:352 이하 queryNormalizedMetrics는 dimensions/metrics/filter AST를 요구한다."
      ],
      "impact": "구현자가 어떤 dimensions, sourceFilter, window, 정렬, tie-breaker로 top-N query set을 만들지 알 수 없다.",
      "recommendation": "`queryNormalizedMetrics({dimensions:['query','source'], metrics:['impressions','clicks','position'], windowStart: now-28d, windowEnd, sourceFilter:['gsc','naver-search-advisor']})` 같은 표준 호출, source별 merge 규칙, topN 정렬 및 동률 처리 규칙을 § 4.0/§ 5.1에 추가하라."
    },
    {
      "id": "SV2-04",
      "severity": "high",
      "category": "query-set",
      "title": "clusterBy='page'의 query→page mapping 산출 방식이 정의되지 않았다",
      "evidence": [
        "search-visibility.md:170은 clusterBy: page를 설정한다.",
        "search-visibility.md:320은 query→page mapping 자동 생성이라고만 한다."
      ],
      "impact": "GSC/Naver 데이터에서 동일 query가 여러 landing page에 걸칠 때 어떤 page cluster에 귀속되는지 구현마다 달라진다.",
      "recommendation": "`dimensions:['query','page','source']`로 조회하고, query별 impressions 최대 landing page를 primary page로 선택하라. 동률은 clicks, position, canonicalPagePath lexical 순으로 tie-break한다는 식의 결정 규칙을 명시하라."
    },
    {
      "id": "SV2-05",
      "severity": "medium",
      "category": "query-set",
      "title": "sitemap-derived query/target universe 재산출 주기가 없다",
      "evidence": [
        "search-visibility.md:319는 sitemap.xml 등재 page 목록을 target으로 쓴다고 한다.",
        "SEARCH_STANDARDIZATION.md:309 이하 sitemap은 빌드 산출물이며 동적 변경 가능성이 있다."
      ],
      "impact": "새 페이지 발행, noIndex 전환, canonical 변경 후 search-visibility 대상 universe가 언제 갱신되는지 불명확하다.",
      "recommendation": "sitemap-derived는 매 monitoring cycle 시작 시 최신 sitemap snapshot hash를 읽거나, 사이트 publish event 기준으로 universe를 materialize하도록 정의하라. VisibilitySignalSnapshot에는 sitemapSnapshotHash를 metadata로 남기는 것이 좋다."
    },
    {
      "id": "SV2-06",
      "severity": "high",
      "category": "monitoring-log",
      "title": "MonitoringLog가 analytics-reporting 패턴을 잘못 참조한다",
      "evidence": [
        "search-visibility.md:691은 analytics-reporting §14.3·14.4를 참조하며 canonicalSignals까지 같은 패턴이라고 한다.",
        "analytics-reporting.md:982 이하 CollectionLog에는 canonicalSources만 있고 canonicalSignals는 없다."
      ],
      "impact": "search-visibility 고유 필드인 canonicalSignals, signalConfigSnapshotHash, detectorPolicyVersion을 어디에 저장해야 하는지 구현 불가하다.",
      "recommendation": "§ 13.3에 MonitoringLog/MonitoringSourceAttempt 풀 스키마를 펼쳐라. 최소 필드: idempotencyKey, canonicalSources, canonicalSignals, sourceConfigSnapshotHash, signalConfigSnapshotHash, manifestVersion, searchVisibilityPolicyVersion, forceRefresh, windowStart/End, envelopeState."
    },
    {
      "id": "SV2-07",
      "severity": "high",
      "category": "retry-queue",
      "title": "collectionRetryQueue 설정과 in-retry-queue 상태가 있는데 내부 테이블 인벤토리에 RetryQueue가 없다",
      "evidence": [
        "search-visibility.md:175는 collectionRetryQueue 설정을 둔다.",
        "search-visibility.md:244는 MonitoringSourceAttemptResult.status에 in-retry-queue를 둔다.",
        "search-visibility.md:29 및 650은 DB 인벤토리를 8 tables로 고정하며 RetryQueue가 없다.",
        "analytics-reporting.md:1075는 CollectionRetryQueue를 별도 테이블로 정의한다."
      ],
      "impact": "실패 source 재시도를 어디에 enqueue/lock/dedupe하는지 정의되지 않는다.",
      "recommendation": "SearchVisibilityCollectionRetryQueue를 9번째 테이블로 신설하거나, retry queue를 제거하고 모든 재시도를 MonitoringSourceAttempt 안에서만 처리한다고 명확히 하라."
    },
    {
      "id": "SV2-08",
      "severity": "medium",
      "category": "detector",
      "title": "exposureTrend ewma-percentile 알고리즘이 config와 본문에서 여전히 닫히지 않았다",
      "evidence": [
        "search-visibility.md:149는 algorithm만 ewma-percentile로 둔다.",
        "search-visibility.md:327은 28일 EWMA α=0.1 baseline + 5일·1일 percentile lookback이라고 한다."
      ],
      "impact": "EWMA baseline과 percentile band를 어떻게 결합하는지, percentile 모집단이 원시값인지 residual인지, 1일 percentile이 무엇인지 불명확하다.",
      "recommendation": "config에 `ewmaAlpha`, `baselineWindowDays`, `percentileLookbackDays`, `percentileInput: raw|ewmaResidual`, `severityRule`을 추가하고 산식을 의사코드로 고정하라."
    },
    {
      "id": "SV2-09",
      "severity": "high",
      "category": "state",
      "title": "VisibilityState.currentState의 signal별 enum이 정의되지 않았다",
      "evidence": [
        "search-visibility.md:336 이하 aiBriefingCitation state machine은 unknown/present/missing만 제시한다.",
        "search-visibility.md:343 이하 unifiedRankingPresence는 bucket transition을 말하지만 state enum을 명시하지 않는다.",
        "search-visibility.md:724는 currentState를 string, signal별 enum이라고만 한다."
      ],
      "impact": "DB 검증, transition detection, dashboard 표시, anomaly dedupe가 문자열 임의값에 의존하게 된다.",
      "recommendation": "§ 6.1 또는 § 13.5에 signal별 enum 표를 추가하라. 예: aiBriefingCitation=`unknown|present|missing|degraded`, unifiedRankingPresence=`bucket:1|bucket:2-3|bucket:4-10|bucket:11-30|bucket:>30|absent|unknown`."
    },
    {
      "id": "SV2-10",
      "severity": "medium",
      "category": "state",
      "title": "문서 요약은 모든 signal state 추적처럼 말하지만 실제 절차는 일부 signal만 state를 쓴다",
      "evidence": [
        "search-visibility.md:22는 신호별 detector + state 추적을 핵심 책임으로 둔다.",
        "search-visibility.md:442-444는 exposureTrend·backlinkChange는 AnomalyRecord만 저장하고 aiBriefingCitation·unifiedRankingPresence만 VisibilityState를 갱신한다고 한다.",
        "search-visibility.md:720은 VisibilityState signal을 aiBriefingCitation·unifiedRankingPresence·확장이라고 적는다."
      ],
      "impact": "exposureTrend에도 VisibilityState row가 필요한지 구현자가 혼동한다.",
      "recommendation": "VisibilityState는 transition형 signal 전용이라고 못 박거나, exposureTrend/backlinkChange의 상태 enum과 갱신 규칙을 추가하라."
    },
    {
      "id": "SV2-11",
      "severity": "high",
      "category": "anomaly-record",
      "title": "unifiedRankingPresence bucket transition이 AnomalyRecord에 저장되는 방식이 부족하다",
      "evidence": [
        "search-visibility.md:347-350은 bucket 변경 시 알림 trigger라고만 한다.",
        "search-visibility.md:444는 transition 발생 시 AnomalyRecord 저장이라고 한다.",
        "search-visibility.md:699 이하 AnomalyRecord는 detectorOutput JSON만 있고 bucket transition 필수 필드가 없다."
      ],
      "impact": "상승/하락, severity, previous/current bucket, rank, query context가 구현마다 달라진다.",
      "recommendation": "detectorOutput 필수 shape를 정의하라. 예: `{previousBucket,currentBucket,previousRank,currentRank,direction,streak,rankBucketConfigVersion}`. severity 산정도 개선/악화/absent 전이에 따라 고정하라."
    },
    {
      "id": "SV2-12",
      "severity": "medium",
      "category": "state",
      "title": "aiBriefingCitation missing→present 복귀 이벤트가 미결정인데 state machine에 섞여 있다",
      "evidence": [
        "search-visibility.md:339는 missing→present를 first-detected 또는 restored 이벤트라고 쓰고 SV-08로 미결정 처리한다.",
        "REVIEW_WORKFLOW.md:486-487에는 first-detected와 lost만 있고 restored enum은 없다."
      ],
      "impact": "복귀 시 기존 first-detected를 재사용하면 최초 발견과 복구가 구분되지 않고, restored를 쓰면 REVIEW_WORKFLOW enum이 없다.",
      "recommendation": "v1.0 전 `restored`를 도입할지 결정하라. 미도입이면 missing→present는 AnomalyRecord만 저장하고 NotificationEvent는 발송하지 않는다고 명시하라."
    },
    {
      "id": "SV2-13",
      "severity": "high",
      "category": "outbox",
      "title": "AnomalyNotificationOutbox enqueue 조건이 REVIEW_WORKFLOW의 5개 이벤트와 맞지 않는다",
      "evidence": [
        "search-visibility.md:464-470은 first-detected/lost 포함 5종 이벤트를 든다.",
        "search-visibility.md:479는 severity warning/critical일 때만 outbox row를 insert한다고 한다.",
        "REVIEW_WORKFLOW.md:512-513은 first-detected normal, lost high 이벤트를 별도 정의한다."
      ],
      "impact": "ai-briefing-citation-first-detected는 정상 이벤트인데 outbox가 생성되지 않는다. lost도 severity 매핑이 명확하지 않으면 누락될 수 있다.",
      "recommendation": "outbox enqueue 조건을 `eventType` 기반으로 바꾸라. anomaly severity 이벤트와 state transition 이벤트를 분리해 `shouldNotify(eventType, mode)` 표를 추가하라."
    },
    {
      "id": "SV2-14",
      "severity": "medium",
      "category": "outbox",
      "title": "monitor-only → alerting 모드 변경 시 기존 AnomalyRecord 처리 정책이 없다",
      "evidence": [
        "search-visibility.md:533-536은 monitor-only에서 outbox row를 만들지 않는다고 한다.",
        "search-visibility.md:44는 운영 모드 변경을 MAJOR로 본다.",
        "search-visibility.md:789는 UNIQUE(anomalyRecordId)로 anomaly 1건당 outbox 1건만 허용한다."
      ],
      "impact": "모드 변경 후 과거 open anomaly를 소급 발송할지, 신규 anomaly만 발송할지 알 수 없다.",
      "recommendation": "기본은 retroactive 생성 금지로 두고, 운영자 명시 action `enqueueOutboxForExistingAnomalies(window, severity)`만 허용하는 식으로 정책을 닫아라."
    },
    {
      "id": "SV2-15",
      "severity": "medium",
      "category": "outbox",
      "title": "outbox 5회 한도는 analytics-reporting 패턴을 가져왔지만 search-visibility의 재시도 taxonomy가 없다",
      "evidence": [
        "search-visibility.md:485-501은 attempts < 5와 permanent 전이를 둔다.",
        "analytics-reporting.md:65-86은 retry taxonomy와 큐별 maxAttempts SoT를 별도 절로 정의한다."
      ],
      "impact": "5회 고정이 구현 상수인지 config인지, manual replay가 가능한지, retryable/permanent 분류가 무엇인지 불명확하다.",
      "recommendation": "analytics-reporting § 1.2.1과 같은 공통 retry taxonomy를 search-visibility § 1.2 근처에 추가하고, AnomalyNotificationOutbox maxAttempts=5가 상수인지 명시하라."
    },
    {
      "id": "SV2-16",
      "severity": "medium",
      "category": "serp-artifact",
      "title": "SV-06이 blob storage 미결정까지 포괄하지 못한다",
      "evidence": [
        "search-visibility.md:640의 SV-06은 crawler IP 차단 대응/proxy/user-agent rotation으로 설명된다.",
        "search-visibility.md:734 이하 SerpCrawlerArtifact는 blobRef, encryption, signed URL을 요구하지만 S3/GCS/Azure 등 저장소 결정은 없다."
      ],
      "impact": "artifact 보안·수명·signed URL 구현을 맡는 인프라 SoT가 비어 있다.",
      "recommendation": "SV-06을 crawler network와 artifact blob storage로 분리하라. 예: SV-06a crawler egress, SV-06b artifact storage provider/IAM/encryption."
    },
    {
      "id": "SV2-17",
      "severity": "high",
      "category": "serp-artifact",
      "title": "blob instance isolation이 문자열 prefix constraint에만 의존한다",
      "evidence": [
        "search-visibility.md:742는 blobRef를 `search-visibility/{instanceId}/...` prefix로 둔다.",
        "search-visibility.md:755는 blobRef prefix 강제를 constraint로 둔다."
      ],
      "impact": "DB 값이 올바른 prefix여도 signed URL 생성 권한, bucket IAM, cross-instance read 방지 정책이 없으면 실제 격리가 보장되지 않는다.",
      "recommendation": "signed URL 발급 API가 `instanceId` membership을 검증하고, storage IAM도 prefix 조건으로 제한한다는 운영 정책을 추가하라. 가능하면 bucket/key policy 예시를 둬라."
    },
    {
      "id": "SV2-18",
      "severity": "medium",
      "category": "serp-artifact",
      "title": "parserVersion 변경 시 backfill 정책이 '필요' 수준에 머문다",
      "evidence": [
        "search-visibility.md:409는 parser 버전 변경 시 backfill 필요 명시라고 한다.",
        "search-visibility.md:747은 parserVersion 필드만 둔다."
      ],
      "impact": "DOM parser 변경 후 기존 artifact를 재파싱할지, 새 snapshot부터만 적용할지에 따라 추세가 끊긴다.",
      "recommendation": "`parserVersion` 변경은 새 lineage로 처리하고, backfill은 운영자 명시 job으로만 수행한다는 기본 정책을 정하라. AnomalyRecord detectorOutput에는 parserVersion을 저장해야 한다."
    },
    {
      "id": "SV2-19",
      "severity": "high",
      "category": "backlink",
      "title": "normalizedAuthorityScore가 required인데 변환 함수는 SV-09 미결정이다",
      "evidence": [
        "search-visibility.md:363은 변환 함수를 패키지 상수, SV-09라고 둔다.",
        "search-visibility.md:643은 SV-09를 미결정으로 둔다.",
        "search-visibility.md:773은 normalizedAuthorityScore를 required로 정의한다."
      ],
      "impact": "v1.0에서 BacklinkSnapshot row를 만들 수 없다. provider 원본 metric은 있어도 required 정규화 값을 산출할 수 없다.",
      "recommendation": "v1.0 마감 전 변환 함수를 freeze하거나, normalizedAuthorityScore를 optional로 낮추고 detector는 providerMetricValue/provider별 series만 사용한다고 명시하라."
    },
    {
      "id": "SV2-20",
      "severity": "high",
      "category": "backlink",
      "title": "provider 변경 시 baseline reset/series 분리가 미결정인데 weekly delta detector는 이를 전제로 한다",
      "evidence": [
        "search-visibility.md:366은 provider 변경 시 baseline reset 또는 provider-specific series 분리라고만 한다.",
        "search-visibility.md:644는 SV-10 미결정으로 둔다.",
        "search-visibility.md:354-358은 weekly delta percentage로 warning/critical을 산정한다."
      ],
      "impact": "Ahrefs→Moz 같은 변경 직후에는 provider coverage 차이가 anomaly로 오탐될 수 있다.",
      "recommendation": "기본 정책을 provider-specific series 분리로 고정하라. provider 변경 첫 N회 poll은 baseline warmup으로 anomaly 평가 제외하고 MonitoringSourceAttempt qualityTier=degraded 또는 hold로 표시하라."
    },
    {
      "id": "SV2-21",
      "severity": "medium",
      "category": "build-validation",
      "title": "build fail 항목에 존재하지 않는 anomalyDetection config 키가 남아 있다",
      "evidence": [
        "search-visibility.md:611-614는 `anomalyDetection` algorithm·threshold 누락을 build fail로 둔다.",
        "search-visibility.md:135 이하 실제 config는 `signals`와 `anomalyHysteresis`만 둔다."
      ],
      "impact": "검증기가 어떤 경로를 검사해야 하는지 불명확하다.",
      "recommendation": "`anomalyDetection`을 `signals.*.algorithm/threshold` 및 `anomalyHysteresis.*`로 정정하라."
    },
    {
      "id": "SV2-22",
      "severity": "medium",
      "category": "documentation-consistency",
      "title": "§0의 8 tables 인벤토리는 현재 내용과는 맞지만 retry queue 도입 여부와 충돌한다",
      "evidence": [
        "search-visibility.md:29와 650은 8 tables를 선언한다.",
        "search-visibility.md:175와 244는 collectionRetryQueue/in-retry-queue를 이미 모델에 포함한다."
      ],
      "impact": "실제 구현에는 8 tables가 부족할 가능성이 높다.",
      "recommendation": "SV2-07의 결정에 맞춰 §0, §10.1, §13 제목의 table count를 즉시 동기화하라."
    }
  ],
  "openQuestions": [
    {
      "id": "SVQ-01",
      "question": "search-visibility의 scheduled job도 analytics-reporting처럼 schedule materialization 시 manifest snapshot을 freeze할 것인가, 아니면 실행 시점 current manifest를 사용할 것인가?"
    },
    {
      "id": "SVQ-02",
      "question": "AI 브리핑 first-detected는 anomaly로 취급할 것인가, 아니면 positive transition event로만 취급할 것인가?"
    },
    {
      "id": "SVQ-03",
      "question": "SERP crawler artifact는 운영자가 HTML 원문을 볼 수 있어야 하는가, 아니면 parsedResultJson과 screenshot만 UI에 노출할 것인가?"
    }
  ],
  "recommendedNextCyclePriorities": [
    "C-08 법무 게이트 문구를 즉시 정정한다.",
    "MonitoringLog/MonitoringSourceAttempt/RetryQueue 스키마를 analytics-reporting 수준으로 펼친다.",
    "query set 산출과 clusterBy page 알고리즘을 queryNormalizedMetrics 호출 예시까지 고정한다.",
    "VisibilityState signal별 enum과 AnomalyRecord detectorOutput shape를 정의한다.",
    "Backlink provider 정규화와 provider 변경 baseline 정책을 v1.0 범위 안에서 결정한다."
  ]
}