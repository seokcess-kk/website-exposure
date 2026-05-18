{
  "summary": "v0.1은 feature 범위와 주요 구성요소를 잡았지만, 현재 상태로는 구현 안정판으로 보기 어렵다. 가장 큰 문제는 SoT cascade를 '필요'라고만 선언하고 REVIEW_WORKFLOW·DATA_MODEL·SEARCH_STANDARDIZATION의 실제 계약을 완성하지 않은 점, analytics-reporting/notifications v1.0 계약을 부분적으로 오용한 점, crawler 법무·운영 리스크를 미결정으로 둔 채 활성 운영이 가능한 점이다. 또한 anomaly 알고리즘은 신호별 데이터 성질과 맞지 않고, idempotency·outbox·acknowledgement·artifact 격리 같은 운영 핵심이 아직 빠져 있다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 7.1 NotificationEventType cascade 필요",
      "location_quote": "본 Feature는 다음 신규 이벤트 cascade 요구:",
      "issue": "REVIEW_WORKFLOW § 9.1 enum·§ 9.1.1 매트릭스에 신규 5종 이벤트가 실제로 반영되지 않았고, 본 문서는 'cascade 요구'만 적고 있다.",
      "rationale": "notifications v1.0은 이벤트 enum·페이로드·정책 매트릭스의 canonical SoT를 REVIEW_WORKFLOW § 9로 둔다. 현재 SoT에는 search-visibility 이벤트가 없으므로 notify() 호출 시 eventType이 유효하지 않다.",
      "suggested_fix": "REVIEW_WORKFLOW § 9.1 NotificationEventType에 5종을 추가하고, § 9.1.1에 수신자 산정·즉시 채널·fallback·digest·criticality·quietHours·optOutPolicy를 완전한 행으로 cascade하라. search-visibility 문서는 '요구'가 아니라 반영된 policyVersion을 참조해야 한다."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 7.2 발송 흐름",
      "location_quote": "NotificationEvent 생성:\n   sourceEventId = hash(instanceId + signal + target + detectedAt)",
      "issue": "notify() 입력 계약과 맞지 않는다. contentTitle·metadata·eventId·criticality 처리, sourceEventId 안정성, DeliveryResult 소비 규칙이 빠져 있다.",
      "rationale": "REVIEW_WORKFLOW § 9.2와 notifications v1.0은 NotificationEvent에 contentTitle, recipients, criticality/metadata 등을 요구하고, notify()는 DeliveryResult를 반환한다. detectedAt 기반 sourceEventId는 재평가·backfill·timezone 보정 시 같은 anomaly를 다른 이벤트로 만들 수 있다.",
      "suggested_fix": "NotificationEvent 필드 매핑표를 추가하라. sourceEventId는 `hash(eventType + anomalyRecord.id)` 또는 `hash(instanceId + signal + target + anomalyWindow + policyVersion)`처럼 안정 키로 정의하고, notify() DeliveryResult의 receiptState별 처리와 실패 재시도 책임을 명시하라."
    },
    {
      "id": "F-3",
      "severity": "fail",
      "section": "§ 2.3 InstanceManifest 통합",
      "location_quote": "searchVisibilityConfig:                                # C-08 v0.16 cascade (자격증명·식별자만)\n...\n      searchVisibilityPolicyVersion: \"sv-2026-05-14\"",
      "issue": "DATA_MODEL C-08에는 아직 searchVisibilityConfig/searchVisibilityPolicyVersion이 없고, analytics-reporting 패턴과 달리 policyVersion을 top-level C-08 필드가 아니라 feature config 내부에 둔다.",
      "rationale": "DATA_MODEL C-08의 analyticsPolicyVersion은 top-level conditional 필드이며 패키지 병렬 보관 + manifest opt-in 패턴을 따른다. search-visibility도 동일 패턴을 요구한다고 컨텍스트에 명시되어 있으나 v0.1은 이를 어긋나게 모델링한다.",
      "suggested_fix": "DATA_MODEL C-08 v0.16 cascade로 `searchVisibilityConfig`와 top-level `searchVisibilityPolicyVersion`을 추가하라. Feature config에는 동작 옵션만 두고, 자격증명·사이트 식별자·policyVersion은 C-08에 둔다는 경계를 명시하라."
    },
    {
      "id": "F-4",
      "severity": "major",
      "section": "§ 2.2 Core·Feature 의존성",
      "location_quote": "| `features/analytics-reporting.md` § 8.2.1 | `queryDailyUserMeasurements()` — 보조 |",
      "issue": "queryDailyUserMeasurements() 의존성이 목적과 맞지 않는다.",
      "rationale": "analytics-reporting § 8.2.1의 queryDailyUserMeasurements()는 법정 previous-3-months-calendar 일평균 이용자 산정용 read API다. search-visibility의 노출도·SERP·백링크 신호에는 직접 관련이 없으며, 잘못 의존하면 의료법 임계 측정 로직과 검색 가시성 모니터링이 불필요하게 결합된다.",
      "suggested_fix": "queryDailyUserMeasurements() 의존을 제거하거나, 특정 운영 지표에서 왜 필요한지 별도 use case와 필드 매핑을 제시하라. 기본 의존은 queryNormalizedMetrics()로 한정하라."
    },
    {
      "id": "F-5",
      "severity": "major",
      "section": "§ 5.1 analytics-derived",
      "location_quote": "dimensions: `date`, `page`, `query`, `source` (gsc·naver-search-advisor)\nmetrics: `impressions`, `clicks`, `ctr`, `position`",
      "issue": "queryNormalizedMetrics() 계약을 충분히 지키지 않는다. sourceFilter, joinMode, aggregation, filter 규칙, sourceWatermarks 처리가 빠져 있다.",
      "rationale": "analytics-reporting § 3.4는 dimensions에 source 포함 여부와 sourceFilter 미지정 여부에 따라 반환 row 의미가 달라진다. v0.1은 page/site-overall 합산을 말하면서 실제 query 결과를 어떻게 집계할지 정의하지 않는다.",
      "suggested_fix": "exposureTrend용 QueryInput 예시를 명시하라. site-overall은 `dimensions:[\"date\",\"source\"]` 또는 sourceFilter별 집계 후 합산 규칙을, page는 `filters:[{dimension:\"page\",...}]`와 canonical path 규칙을 정의하라. dataCompletenessBreakdown/sourceWatermarks를 VisibilitySignalSnapshot에 어떻게 반영하는지도 추가하라."
    },
    {
      "id": "F-6",
      "severity": "fail",
      "section": "§ 3.2 MonitoringInput·Result",
      "location_quote": "forceRefresh?: boolean;\nrefreshIntentId?: string;\nidempotencyKey?: string;",
      "issue": "runMonitoring() idempotency 계약이 불완전하다.",
      "rationale": "analytics-reporting v1.0은 canonicalSources, forceRefresh, refreshIntentId, manifestVersion 등을 포함해 lineage와 idempotency를 엄격히 분리한다. v0.1은 idempotencyKey 산정 규칙, in-progress 재호출 응답, failed/partial 재구성, manifest 변경 시 새 lineage 여부가 없다.",
      "suggested_fix": "idempotencyKey 산식을 `hash(instanceId + canonicalSources + signals + windowStart + windowEnd + scheduledForDate + manifestVersion + sourceConfigSnapshotHash)`처럼 고정하고, forceRefresh=true일 때 refreshIntentId 필수 및 별도 lineage row 생성 규칙을 추가하라. MonitoringLog에는 envelopeState/status와 source attempt 상태를 저장하라."
    },
    {
      "id": "F-7",
      "severity": "major",
      "section": "§ 6.2 평가 cycle / § 10.2 runtime validation fail",
      "location_quote": "dataCompleteness < minDataCompleteness → skip + warning\n...\n신호별 minDataCompleteness 미달 데이터로 detectAnomalies 호출",
      "issue": "dataCompleteness 미달 처리가 서로 모순된다.",
      "rationale": "§ 6.2는 skip+warning이라고 하고 § 10.2는 runtime validation fail이라고 한다. 스케줄 운영에서 데이터 지연은 흔하므로 fail로 볼지 hold로 볼지 명확하지 않으면 알림 누락 또는 잡음이 발생한다.",
      "suggested_fix": "scheduled detectAnomalies에서는 `hold/skipped-incomplete`로 기록하고 외부 sink warning만 내며, on-demand에서만 strict fail로 둘지 결정하라. sourceWatermarks와 analytics collection 완료 상태를 확인하는 precondition도 추가하라."
    },
    {
      "id": "F-8",
      "severity": "critical",
      "section": "§ 5.2 serp-crawler / § 11 미결정 사항",
      "location_quote": "법적 주의: 네이버·Google 이용약관상 자동 크롤링 제한이 있을 수 있음 — 운영자가 ToS 확인 책임 (SV-01 미결정)",
      "issue": "serp-crawler 법무·ToS 리스크가 미결정인데도 enabled=true 운영이 가능하다.",
      "rationale": "Google·네이버 SERP 자동 수집은 IP 차단과 약관 위반 위험이 크다. 의료기관 솔루션에서 법무 승인 없이 production crawler를 켜는 것은 운영 리스크가 과도하다.",
      "suggested_fix": "`serpCrawler.enabled=true`는 `serpCrawlerLegalApproved=true`, approvedBy, approvedAt, approvedScope가 없으면 build fail로 격상하라. SV-01이 미결정이면 production에서는 serp-crawler disabled만 허용하고 analytics-derived/backlink-source만 운영 가능하도록 명시하라."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 5.2 serp-crawler",
      "location_quote": "robots.txt 준수: `userAgentRespectRobots=true` 시 대상 검색 엔진 robots.txt 확인 + 차단 시 skip",
      "issue": "SERP crawler 운영 안정성 정의가 부족하다.",
      "rationale": "robots.txt만으로 Google/Naver SERP 자동화 허용 여부를 판단할 수 없고, DOM 변경·지역/기기/로그인/개인화·captcha·IP 차단이 결과에 큰 영향을 준다. 현재 문서는 이를 SV-02/SV-06으로 미루지만 대체 경로와 품질 등급이 없다.",
      "suggested_fix": "searchEngine, locale, device, geo, personalizationDisabled, parserVersion, artifactHash, blockReason, captchaDetected를 artifact/metadata에 저장하라. crawler 실패 시 signal quality를 degraded로 표시하고, 연속 차단 시 source 자동 disable + sink alert 정책을 추가하라."
    },
    {
      "id": "F-10",
      "severity": "major",
      "section": "§ 4.2 / § 4.3 신호 정의",
      "location_quote": "크롤링 대상 쿼리: config로 지정 (예: 인스턴스 핵심 의료 키워드 N개)\n...\n측정: 검색어별 통합 영역 노출 여부·순위",
      "issue": "search-visibility와 keyword-monitoring의 책임 경계가 흐려진다.",
      "rationale": "ARCHITECTURE § 11.2는 keyword-monitoring을 사용자 지정 N개 키워드 단위, search-visibility를 사이트 전체·페이지별 건강도 추적으로 나눈다. v0.1은 AI 브리핑과 통합 영역을 config 지정 키워드 N개로 측정해 keyword-monitoring과 동일한 축을 다시 만든다.",
      "suggested_fix": "search-visibility의 query set은 사용자 임의 키워드가 아니라 analytics-reporting에서 관측된 query cluster, 브랜드/진료과 taxonomy, sitemap page cluster에서 자동 산출하는 '대표 샘플'로 정의하라. 사용자 지정 키워드 순위·CTR 알림은 keyword-monitoring으로 넘긴다고 명시하라."
    },
    {
      "id": "F-11",
      "severity": "major",
      "section": "§ 13.1 VisibilitySignalSnapshot",
      "location_quote": "`target` | string | ✅ — page path 또는 \"site-overall\"\nConstraints: `UNIQUE(instanceId, signal, target, date)`.",
      "issue": "target 하나에 site-overall, page path, query, domain 목록 의미가 섞인다.",
      "rationale": "§ 4.3은 unifiedRankingPresence 저장 단위를 query × date로, § 4.4는 backlinkChange를 site-overall + top-N domain 목록으로 둔다. 그러나 UNIQUE는 target 하나만 두므로 page path와 query 문자열 충돌, canonical path normalize, query locale/device 구분, backlink provider 구분을 표현하기 어렵다.",
      "suggested_fix": "`targetKind: \"site\" | \"page\" | \"query\" | \"domain\"`, `targetId`, `targetDisplay`, `canonicalPagePath`, `queryHash`, `locale/device/searchEngine` 등을 분리하라. UNIQUE도 `(instanceId, signal, targetKind, targetId, date, sourceUsed/provider/searchEngine)` 수준으로 재설계하라."
    },
    {
      "id": "F-12",
      "severity": "major",
      "section": "§ 6.1 알고리즘",
      "location_quote": "rolling-zscore (기본): `(observed - mean(window)) / stddev(window)`. `|z| ≥ zscoreThreshold(기본 2.5)` 시 이상",
      "issue": "신호별 데이터 성질과 anomaly 알고리즘이 맞지 않는다.",
      "rationale": "exposureTrend는 연속값이지만 aiBriefingCitation과 unifiedRankingPresence는 boolean/count/rank 성격이고 backlinkChange는 weekly polling이다. 모든 신호에 z-score를 일괄 적용하면 zero stddev, sparse data, weekly 값 반복, rank 방향성 문제로 오탐이 많아진다.",
      "suggested_fix": "신호별 detector를 분리하라. impressions는 seasonality-aware EWMA 또는 percentile, AI citation은 first/lost state transition + streak, unified ranking은 rank bucket transition, backlink는 provider별 delta percentage/absolute threshold + weekly window를 사용하라."
    },
    {
      "id": "F-13",
      "severity": "medium",
      "section": "§ 6.3 false-positive 완화",
      "location_quote": "streak 요건: 동일 신호·target이 연속 N일 이상 (기본 2일)\nsuppress 윈도우: 동일 신호·target에 대해 알림 발송 후 N시간(기본 24시간)",
      "issue": "streak 2일·suppress 24시간 기본값의 운영 적합성이 근거 없이 고정되어 있다.",
      "rationale": "의료기관 검색 노출은 주말/공휴일, 검색 콘솔 지연, 캠페인/콘텐츠 발행, SERP 개인화 영향을 받는다. 28일 window와 z=2.5, 2일 streak, 24시간 suppress는 근거 없이 alert fatigue 또는 중요한 하락 감지를 만들 수 있다.",
      "suggested_fix": "기본값을 signal별로 나누고, 최소 관측일수·주말 보정·provider latency hold를 추가하라. 예: exposureTrend는 7-day smoothed series + 3 observed days, AI citation lost는 3 consecutive successful crawls, backlink는 2 weekly polls."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 7.1 / § 7.2 알림",
      "location_quote": "`ai-briefing-citation-first-detected` | siteDomain이 AI 브리핑 인용에 처음 등장\n`ai-briefing-citation-lost` | 기존 AI 브리핑 인용에서 N일 연속 미노출",
      "issue": "first-detected/lost 이벤트를 만들 상태 모델이 없다.",
      "rationale": "AnomalyRecord는 z-score 기반 이상만 저장하고, AI citation의 최초 등장·상실 상태를 추적하는 per-query/site state 테이블이 없다. 'N일 연속'의 N도 config에 없다.",
      "suggested_fix": "`AiCitationState` 또는 일반 `VisibilityState` 테이블을 추가해 currentState, firstSeenAt, lastSeenAt, consecutivePresentDays, consecutiveMissingDays, lastTransitionEventId를 저장하라. first/lost 이벤트는 anomaly path와 별도 transition detector에서 생성하라."
    },
    {
      "id": "F-15",
      "severity": "fail",
      "section": "§ 7.2 발송 흐름 / § 13.3 AnomalyRecord",
      "location_quote": "AnomalyRecord 저장 직후 (§ 6.2 4단계)\n...\nAnomalyRecord.notificationEventId 영구 저장 (재발송 차단)",
      "issue": "알림 발송이 outbox 없이 AnomalyRecord 저장 후 즉시 notify() 호출로 되어 있어 crash/retry 안전성이 없다.",
      "rationale": "저장 후 notify() 전 crash면 알림이 영구 누락되고, notify() 성공 후 notificationEventId 저장 전 crash면 재시도 시 중복 발송 위험이 있다. analytics-reporting과 notifications v1.0은 outbox/idempotent receipt 패턴을 강하게 사용한다.",
      "suggested_fix": "AnomalyNotificationOutbox를 추가하라. AnomalyRecord와 outbox insert를 단일 transaction으로 처리하고, worker가 sourceEventId로 notify()를 호출한 뒤 DeliveryResult를 저장하라. notificationEventId만이 아니라 receiptState, attempts, lastError, dispatchedAt을 기록하라."
    },
    {
      "id": "F-16",
      "severity": "major",
      "section": "§ 13.3 AnomalyRecord",
      "location_quote": "`acknowledged` | boolean | ✅ — 운영자 인정 여부 (false-positive 추정 보조)\n`acknowledgedBy` | string | optional",
      "issue": "acknowledged 운영 흐름이 정의되지 않았고, false-positive 측정 의미도 불명확하다.",
      "rationale": "§ 8.1은 `acknowledged ≠ true positive`로 false-positive를 계산한다고 쓰지만, acknowledged가 '확인함', '참 양성 인정', '오탐 처리' 중 무엇인지 불명확하다. 누가 어떤 권한으로 언제 처리하는지도 없다.",
      "suggested_fix": "`resolutionStatus: open | true-positive | false-positive | ignored | resolved`, `resolvedBy`, `resolvedAt`, `resolutionNote`로 분리하라. operator/client-approver 권한, SLA, audit log action, 대시보드 필터 규칙을 추가하라."
    },
    {
      "id": "F-17",
      "severity": "major",
      "section": "§ 13.4 SerpCrawlerArtifact",
      "location_quote": "`htmlBlobRef` | string | ✅ — HTML 저장 경로 (S3·GCS 등)\n`screenshotBlobRef` | string | optional",
      "issue": "SERP artifact blob 저장소의 인스턴스 격리·보안·무결성 요건이 없다.",
      "rationale": "SERP HTML/screenshot은 검색어, 위치, 의료기관명, 경쟁사 정보, 잠재적으로 개인화된 내용이 포함될 수 있다. 단순 blobRef만으로는 tenant isolation, encryption, signed URL TTL, retention purge, parser 재현성을 보장하지 못한다.",
      "suggested_fix": "bucket prefix를 `search-visibility/{instanceId}/{yyyy-mm-dd}/{artifactId}`처럼 인스턴스별로 강제하고, encryption, access role, signed URL TTL, contentHash, parserVersion, purge worker, cross-instance access fail 조건을 명시하라."
    },
    {
      "id": "F-18",
      "severity": "medium",
      "section": "§ 5.3 backlink-source",
      "location_quote": "`ahrefs`: Ahrefs API v3, API Key 인증\n`semrush`: SEMrush API, API Key\n`moz`: Moz Links API, API Key",
      "issue": "백링크 provider별 metric 호환성과 quota/정확도 차이를 정규화하지 않는다.",
      "rationale": "Ahrefs의 DR, Moz의 DA, SEMrush의 Authority Score는 같은 값이 아니다. v0.1은 domainRating 하나로 합치고 provider별 coverage/latency/quota 차이를 metadata에 남기지 않는다.",
      "suggested_fix": "`providerMetricName`, `providerMetricValue`, `normalizedAuthorityScore`, `providerCoverageTier`, `quotaRemaining`, `providerSnapshotAt`을 분리하라. provider 변경 시 baseline reset 또는 provider-specific series로 분리하는 정책도 추가하라."
    },
    {
      "id": "F-19",
      "severity": "major",
      "section": "§ 10.1 build-time fail",
      "location_quote": "`requiresFeature: analytics-reporting` 또는 `notifications` 충족 안 됨",
      "issue": "문서 내에서 notifications는 '권장'이라고 했다가 build fail 의존으로 처리한다.",
      "rationale": "§ 0은 analytics-reporting 필수·notifications 권장이라고 하지만 § 2.3 requiresFeature와 § 10.1은 notifications 미충족을 build fail로 둔다. 알림 없는 read-only 모드가 가능한지 불명확하다.",
      "suggested_fix": "운영 모드를 분리하라. `mode: monitor-only`에서는 notifications 비활성 허용, anomaly 알림 outbox 미생성. `mode: alerting`에서는 notifications 필수 build fail. § 0, § 2.3, § 10.1을 일치시켜라."
    },
    {
      "id": "F-20",
      "severity": "medium",
      "section": "§ 1.2 SoT 원칙 / SEARCH_STANDARDIZATION cascade",
      "location_quote": "AI 브리핑·통합 랭킹 외부 컨텍스트 SoT는 `docs/ARCHITECTURE.md` § 0.5",
      "issue": "SEARCH_STANDARDIZATION과의 cascade 관계가 빠져 있다.",
      "rationale": "SEARCH_STANDARDIZATION은 aiCrawlerPolicy, robotsOverrides, sitemap, canonical/meta 정책을 다룬다. search-visibility는 AI 인용·사이트 전체 가시성을 측정하므로 robots/sitemap/canonical 상태와 강하게 연결되지만, 현재 문서는 이를 입력 신호나 경고 cascade로 사용하지 않는다.",
      "suggested_fix": "SEARCH_STANDARDIZATION을 SoT 의존성에 추가하라. robots가 AI 검색 인덱싱 봇을 차단하는 경우 aiBriefingCitation 신호를 disabled/degraded로 표시하고, sitemap/canonical page inventory를 exposureTrend target universe로 사용하라."
    }
  ]
}