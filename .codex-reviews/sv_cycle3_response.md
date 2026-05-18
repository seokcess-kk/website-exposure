{
  "status": "needs-fourth-cycle",
  "verdict": "closeableAfterPatch",
  "summary": {
    "overall": "v0.3은 v0.2 대비 구조가 많이 닫혔지만, retry queue·retroactive outbox·exposureTrend 산식/target 정합은 아직 구현자가 다른 해석을 할 수 있는 수준이다. 대규모 재설계보다는 명세 패치로 닫을 수 있다.",
    "blockingFindings": 5,
    "nonBlockingFindings": 5,
    "checkedNoIssue": [
      "§0 DB 인벤토리 9 tables와 §13 admin DB 9 tables는 숫자와 항목이 일치한다.",
      "§4.0 queryNormalizedMetrics 호출의 dimensions=[query,page,source]와 sourceFilter=[gsc,naver-search-advisor]는 analytics-reporting §3.4의 compatible source 계약과 정합한다.",
      "joinMode='row-separated'는 dimensions에 source가 포함되어 있어 analytics-reporting의 mixed-source validation error 조건에 걸리지 않는다.",
      "§1.1 변경 정책에는 build/runtime fail 룰 추가·강화가 MAJOR로 들어가 있어 §11 확장 방향과 큰 틀은 정합한다."
    ]
  },
  "findings": [
    {
      "id": "SV3-01",
      "severity": "blocker",
      "status": "open",
      "title": "exposureTrend percentile config가 산식에 실제로 반영되지 않는다",
      "evidence": [
        "docs/features/search-visibility.md:165 defines percentileLowCritical: 1",
        "docs/features/search-visibility.md:166 defines percentileLowWarning: 5",
        "docs/features/search-visibility.md:304 hard-codes P1/P5 band rules"
      ],
      "problem": "기본값 1/5와 산식의 P1/P5는 현재 예시상 맞지만, config 필드가 존재하는 이상 산식은 percentileLowCritical/percentileLowWarning을 참조해야 한다. 또한 percentileInput='ewmaResidual'일 때도 문구는 observed[t]를 percentileSample과 비교한다고 되어 있어 raw와 residual 모드가 섞인다.",
      "impact": "config를 바꿔도 detector가 계속 P1/P5로 동작하거나, residual 모드에서 잘못된 severity가 산출될 수 있다.",
      "recommendation": "§4.1을 `score[t] = percentileInput == 'raw' ? observed[t] : observed[t] - baselineEwma[t]`로 정의하고, `score[t] <= percentile(scoreSample, percentileLowCritical)`이면 critical, `<= percentile(scoreSample, percentileLowWarning)`이면 warning으로 정정한다. detectorOutput의 percentileBand도 고정 'P1'/'P5' 대신 threshold label 또는 actualPercentile/thresholdPercentile을 저장하게 바꾸는 편이 안전하다."
    },
    {
      "id": "SV3-02",
      "severity": "blocker",
      "status": "open",
      "title": "query set 산출과 page 단위 exposureTrend target의 연결이 닫히지 않았다",
      "evidence": [
        "docs/features/search-visibility.md:188 configures clusterBy: 'page'",
        "docs/features/search-visibility.md:266 calls queryNormalizedMetrics with query/page/source",
        "docs/features/search-visibility.md:281 defines clusterBy='page' mapping",
        "docs/features/search-visibility.md:338 says analytics-derived calls §4.0 + §4.1 exposureTrend"
      ],
      "problem": "top-N은 query 기준으로 뽑고 clusterBy='page'는 primary page를 고르지만, exposureTrend는 page 단위 signal이다. 명세가 `VisibilitySignalSnapshot.targetKind=page`에 어떤 observed 값을 저장하는지 닫지 않는다. 예를 들어 selected top-N query의 impressions 합인지, page 전체 impressions인지, source별 합산인지, query별 primary page만 포함하는지 구현별로 갈릴 수 있다.",
      "impact": "동일 문서로 구현해도 exposureTrend baseline과 anomaly가 서로 달라질 수 있다. 특히 query가 여러 page에 걸친 경우 double count 또는 누락이 발생한다.",
      "recommendation": "analytics-derived universe와 measurement를 분리해 명시한다. 예: `query set은 monitored universe 선정용`, `exposureTrend snapshot targetKind='page'`, `observed = SUM(impressions) over selected queries whose primaryPage=target page, grouped across source with sourceWatermarks retained` 또는 `page 전체 impressions` 중 하나를 SoT로 고정한다."
    },
    {
      "id": "SV3-03",
      "severity": "major",
      "status": "open",
      "title": "SerpCrawlerApprovedScope boolean 필드가 required와 default false를 동시에 주장한다",
      "evidence": [
        "docs/core/DATA_MODEL.md:664 allowLoginState is required and says default false",
        "docs/core/DATA_MODEL.md:665 allowCaptchaBypass is required and says default false",
        "docs/features/search-visibility.md:345 only fails when approvedScope is missing",
        "docs/features/search-visibility.md:440 build-time fail list lacks missing boolean field checks"
      ],
      "problem": "법무 승인 스코프에서 allowLoginState/allowCaptchaBypass가 필수인지, 누락 시 자동 false인지 불명확하다. 법무 게이트 성격상 자동 false는 안전하지만, required라면 build fail이어야 한다.",
      "impact": "manifest validator와 runtime crawler가 서로 다른 해석을 할 수 있다. 특히 법무 승인 artifact를 감사할 때 누락값을 승인된 false로 볼지 schema 오류로 볼지 흔들린다.",
      "recommendation": "둘 중 하나로 고정한다. 권장: DATA_MODEL에서 `required=false, default=false`로 바꾸고 build normalize 단계에서 false를 materialize한다. 반대로 required를 유지하려면 §11.1에 `approvedScope.allowLoginState/allowCaptchaBypass/artifactRetentionDaysMax missing -> build fail`을 추가한다."
    },
    {
      "id": "SV3-04",
      "severity": "major",
      "status": "open",
      "title": "crawlerArtifact retention 비교 룰의 적용 조건이 부족하다",
      "evidence": [
        "docs/features/search-visibility.md:204 says crawlerArtifact must not exceed approvedScope.artifactRetentionDaysMax",
        "docs/features/search-visibility.md:451 build fail rule compares config.retentionDays.crawlerArtifact > serpCrawler.approvedScope.artifactRetentionDaysMax"
      ],
      "problem": "비교 방향은 맞지만, serpCrawler 비활성·approvedScope 누락·artifactRetentionDaysMax 누락 시의 평가 순서가 없다. 현재 문구만으로는 serpCrawler.enabled=false인 인스턴스에서도 null 비교가 발생할 수 있고, approvedScope 누락 fail과 retention 비교 fail이 충돌할 수 있다.",
      "impact": "validator가 비활성 crawler 설정을 잘못 fail 처리하거나, 반대로 enabled=true인데 retention max 누락을 통과시킬 수 있다.",
      "recommendation": "§11.1에 순서를 명시한다. `serpCrawler.enabled=true`일 때만 approvedScope required 검증을 먼저 수행하고, 그 다음 `crawlerArtifact <= artifactRetentionDaysMax`를 평가한다. `serpCrawler.enabled=false`이면 blobStorage/crawlerArtifact retention 비교는 skipped로 둔다."
    },
    {
      "id": "SV3-05",
      "severity": "blocker",
      "status": "open",
      "title": "SearchVisibilityCollectionRetryQueue가 analytics-reporting retry worker 계약을 충분히 가져오지 않았다",
      "evidence": [
        "docs/features/search-visibility.md:52 introduces SearchVisibilityCollectionRetryQueue",
        "docs/features/search-visibility.md:523 defines the table",
        "docs/features/search-visibility.md:537 unique is (monitoringLogId, source, attemptNumber)",
        "docs/features/analytics-reporting.md:516 defines attemptNumber concurrency safety",
        "docs/features/analytics-reporting.md:517 requires advisory lock over (collectionLogId, source)"
      ],
      "problem": "테이블은 생겼지만 worker SoT 쿼리, row claim, stale processing reconcile, attemptNumber 산정 lock, MonitoringSourceAttempt insert/update 순서, envelope 재계산 lock이 search-visibility 본문에는 없다. `analytics-reporting 동일 패턴`이라는 문구만으로는 새 큐의 concurrency contract가 불완전하다.",
      "impact": "동시 worker가 같은 monitoringLogId/source에 대해 같은 next attempt를 만들거나, queue status와 MonitoringSourceAttempt status가 갈라질 수 있다.",
      "recommendation": "§4.3 또는 별도 §에 analytics-reporting §4.3을 search-visibility 명칭으로 복제한다. 핵심은 `FOR UPDATE SKIP LOCKED` claim, `(monitoringLogId, source)` advisory lock, `MAX(attemptNumber)+1`, 짧은 transaction에서 MonitoringSourceAttempt processing insert, provider 호출 후 update, exhausted 시 failed-permanent, stale queue 재claim이다."
    },
    {
      "id": "SV3-06",
      "severity": "major",
      "status": "open",
      "title": "retroactive outbox command의 권한·감사·sourceEventId 규칙이 미정의다",
      "evidence": [
        "docs/features/search-visibility.md:228 declares enqueueOutboxForExistingAnomalies(window, severity)",
        "docs/features/search-visibility.md:408 says explicit operator action can enqueue retroactively",
        "docs/features/search-visibility.md:410 only says UNIQUE(anomalyRecordId)",
        "docs/features/notifications.md:233 prohibits sourceEventId reuse during receipt retention"
      ],
      "problem": "운영자 명시 액션이라고만 되어 있고 필요한 role, approval/audit log, SLA, dry-run 여부가 없다. 또 동일 anomaly에 대해 기존 outbox가 없더라도 notifications의 `sourceEventId`를 어떻게 결정적으로 만들지 정의하지 않는다.",
      "impact": "receipt retention 이후 동일 sourceEventId 재사용, eventType 변경 시 중복/무발송, 운영자 오조작 추적 불가가 생길 수 있다.",
      "recommendation": "command contract를 닫는다. 예: `requiredRole=operations|admin`, `audit event=search-visibility-retroactive-enqueue-requested`, `dryRun default true`, `sourceEventId = hash('search-visibility' + eventType + anomalyRecordId + retroactiveBatchId?)` 중 정책 선택. 재발송 금지가 목적이면 batchId를 넣지 말고 anomalyRecordId+eventType으로 고정한다. 운영 액션 이력 테이블 또는 existing admin audit SoT도 연결한다."
    },
    {
      "id": "SV3-07",
      "severity": "major",
      "status": "open",
      "title": "unifiedRankingPresence의 absent/unknown transition 흐름이 enum만 있고 상태 전이가 없다",
      "evidence": [
        "docs/features/search-visibility.md:249 detectorOutput includes direction absent/restored",
        "docs/features/search-visibility.md:317 says bucket mapping then compare previous bucket",
        "docs/features/search-visibility.md:370 enum includes absent and unknown"
      ],
      "problem": "VisibilityState enum에 `absent`와 `unknown`이 있지만 §4.3은 rank bucket 비교만 설명한다. unknown 초기 상태에서 첫 관측 시 알림 여부, bucket -> absent 기준, absent -> bucket restored 여부, missing SERP crawl과 true absent의 구분이 없다.",
      "impact": "동일 SERP 결과 결측이 어떤 구현에서는 absent anomaly가 되고, 다른 구현에서는 hold가 될 수 있다.",
      "recommendation": "state transition table을 추가한다. 최소한 `unknown -> bucket:*`, `bucket:* -> absent`, `absent -> bucket:*`, `bucket:a -> bucket:b`, `crawl degraded/missing -> hold`를 정의하고 각각 AnomalyRecord/eventType/notify 여부를 연결한다."
    },
    {
      "id": "SV3-08",
      "severity": "minor",
      "status": "open",
      "title": "exposureTrend와 backlinkChange의 state 미사용 방침은 가능하지만 suppression persistence가 명시돼야 한다",
      "evidence": [
        "docs/features/search-visibility.md:191 defines exposureTrend suppressHours",
        "docs/features/search-visibility.md:194 defines backlinkChange suppressHours",
        "docs/features/search-visibility.md:373 says no state machine is needed"
      ],
      "problem": "state machine은 없어도 되지만 suppressHours, minConsecutivePolls, minSmoothedObservedDays를 어디에 저장하고 어떤 key로 중복 anomaly를 억제하는지가 없다. AnomalyRecord만 쓴다면 suppression lookup key와 resolved 상태 포함 여부가 필요하다.",
      "impact": "재실행 또는 forceRefresh 시 같은 anomaly가 반복 생성될 수 있다.",
      "recommendation": "state machine이 아닌 `anomaly suppression ledger` 규칙을 AnomalyRecord 기준으로 정의한다. 예: key=`instanceId+signal+targetKind+targetId+severity+detectorPolicyVersion`, window 내 unresolved/latest anomaly 존재 시 suppress."
    },
    {
      "id": "SV3-09",
      "severity": "major",
      "status": "open",
      "title": "blob isolation은 원칙만 있고 S3 prefix/IAM 조건식과 signed URL 갱신 UX가 부족하다",
      "evidence": [
        "docs/features/search-visibility.md:206 configures blobStorage provider/bucket/keyPrefix",
        "docs/features/search-visibility.md:209 sets signedUrlTtlSeconds=600",
        "docs/features/search-visibility.md:566 says blob isolation IAM policy SoT",
        "docs/features/search-visibility.md:568 says prefix is search-visibility/{instanceId}/*"
      ],
      "problem": "config keyPrefix는 `search-visibility/`이고 §13.8은 `search-visibility/{instanceId}/*`를 말한다. worker가 instance prefix를 append한다고 되어 있지만 canonical object key format과 IAM condition example이 없다. signed URL TTL 600초는 적절할 수 있으나 dashboard 장기 열람 중 만료 시 refresh path가 없다.",
      "impact": "cross-instance blob 접근 차단을 구현자가 IAM 대신 app check에 의존하거나, dashboard artifact preview가 만료 후 깨질 수 있다.",
      "recommendation": "object key format을 `keyPrefix/{instanceId}/{artifactId}`로 고정하고, S3 기준 IAM condition 예시를 넣는다. signed URL은 read API가 매 요청 fresh URL을 발급하거나 만료 60초 전 client refresh 가능하다는 계약을 추가한다."
    },
    {
      "id": "SV3-10",
      "severity": "minor",
      "status": "open",
      "title": "미결정 항목 중 이미 결정된 항목이 unresolved로 남아 v1.0 exit criteria가 흐린다",
      "evidence": [
        "docs/features/search-visibility.md:207 says blobStorage.provider='s3'",
        "docs/features/search-visibility.md:480 keeps SV-06b as unresolved",
        "docs/features/search-visibility.md:484 keeps SV-10 as v1.0 though providerSeriesSeparated=true is already default"
      ],
      "problem": "SV-06b는 provider가 s3로 결정된 것처럼 보이지만 IAM이 미결로 남아 있고, SV-10은 v0.3에서 기본 정책이 이미 들어왔는데 v1.0 항목으로 남아 있다.",
      "impact": "v1.0 마감 시 무엇이 반드시 닫혀야 하는지 불분명하다.",
      "recommendation": "SV-06b를 `partially resolved: provider=s3, remaining=IAM policy example/ops role`처럼 쪼개고, SV-10은 resolved로 이동하거나 남은 일이 있다면 `provider migration historical series display policy`처럼 구체화한다."
    }
  ],
  "recommendedPatchOrder": [
    "SV3-01/SV3-02: exposureTrend 산식과 target aggregation을 먼저 닫는다.",
    "SV3-05: retry queue worker SoT를 analytics-reporting 명칭으로 복제한다.",
    "SV3-06: retroactive outbox command의 idempotency/sourceEventId/audit 계약을 확정한다.",
    "SV3-03/SV3-04: legal gate validator 순서를 정리한다.",
    "SV3-07/SV3-09/SV3-10: state transition, blob ops, unresolved taxonomy를 마감 정리한다."
  ]
}