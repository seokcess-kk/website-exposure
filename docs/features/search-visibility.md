# Feature — search-visibility

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 5개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1·§ 11.2 / `docs/features/analytics-reporting.md` v1.0
> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
> **연관 문서**: analytics-reporting v1.0 § 3.4, notifications v1.0, REVIEW_WORKFLOW § 9 (5종 cascade 완료), DATA_MODEL C-08 v0.16 (SearchVisibilityConfig + SerpCrawlerApprovedScope), SEARCH_STANDARDIZATION § 3·§ 4·§ 5

---

## 0. 한 페이지 요약

- **Feature 식별자**: `search-visibility`
- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
- **mode 2종**: `alerting`(기본·notifications 필수) / `monitor-only`(notifications 비활성 허용. 알림 미발송)
- **데이터 source 3종**: analytics-derived / serp-crawler(법무 승인 게이트 필수) / backlink-source
- **신호 4종 + detector 분리**: exposureTrend(EWMA·percentile) / aiBriefingCitation(state transition) / unifiedRankingPresence(rank bucket transition) / backlinkChange(weekly delta)
- **query set 자동 산출** (vs keyword-monitoring): analytics-derived(top-N impressions) 또는 sitemap-derived(SEARCH_STANDARDIZATION § 4)
- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·MonitoringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSnapshot·AnomalyNotificationOutbox

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | |
| 데이터 source 추가 | MINOR | 별개 | C-08 cascade |
| 데이터 source 제거 | **MAJOR** | 별개 | |
| 신호별 detector 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| signal별 enum (VisibilityState) 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 변경 | **MAJOR** | 별개 | |
| build-time fail / runtime fail 룰 추가·강화 | **MAJOR** | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 측정 데이터 read API SoT는 analytics-reporting § 3.4 `queryNormalizedMetrics` (queryDailyUserMeasurements 미사용)
- 알림 발송 SoT는 notifications + REVIEW_WORKFLOW § 9.1.1
- 자격증명·policyVersion·approvedScope SoT는 DATA_MODEL C-08
- sitemap·canonical·robots 입력 SoT는 SEARCH_STANDARDIZATION § 3·§ 4·§ 5
- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)

### 1.2.1 공통 retry taxonomy (SV2-15 신설)

본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:

| 개념 | 의미 |
|---|---|
| `attempts` | 누적 시도 횟수 |
| `maxAttempts` | 자동 재시도 상한 |
| `claimedAt timeout` | worker claim 후 5분 내 commit 없으면 reconcile worker가 재claim |
| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
| `*-permanent` | maxAttempts 소진 또는 비재시도성 — 수동 replay 필요 |

큐별 maxAttempts:

| 큐 | maxAttempts | 출처 |
|---|---|---|
| SearchVisibilityCollectionRetryQueue | `config.collectionRetryQueue.maxAttempts` (기본 3) — configurable |
| AnomalyNotificationOutbox | **상수 5** — 운영 단순성 |

### 1.3 본 문서가 다루지 않는 영역

- 측정 데이터 수집 자체 — analytics-reporting
- 사용자 지정 키워드 모니터링 — keyword-monitoring (후속)
- 알림 채널·재시도 (notify 발송 자체) — notifications
- 외부 PR·백링크 실행 — `docs/operations/`

### 1.4 SEARCH_STANDARDIZATION 입력 사용

| SEARCH_STANDARDIZATION 영역 | 본 Feature 사용 |
|---|---|
| § 3 robots.txt + aiCrawlerPolicy | aiCrawlerPolicy="disallowAll" 시 `aiBriefingCitation` 신호 자동 `qualityTier=degraded` |
| § 4 sitemap.xml | sitemap-derived universe 입력 (page 단위 target) |
| § 5 canonical URL | page path 정규화 |
| § 7 검색 콘솔 verification | analytics-reporting GSC·naver source 활성 전제 |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "search-visibility"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: false
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| analytics-reporting § 3.4 | `queryNormalizedMetrics` (필수) |
| notifications | notify() (mode="alerting" 시) |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
| DATA_MODEL C-08 v0.16 | searchVisibilityConfig + searchVisibilityPolicyVersion + SerpCrawlerApprovedScope |
| DATA_MODEL C-23 | AdminUser |
| SEARCH_STANDARDIZATION § 3·§ 4·§ 5 | robots·sitemap·canonical |
| ARCHITECTURE § 0.5 | AI 브리핑·통합 랭킹 외부 컨텍스트 |

### 2.3 InstanceManifest

```yaml
searchVisibilityConfig:
  serpCrawler:
    enabled: true
    targetSearchEngines: ["naver", "google"]
    siteDomain: "clinic.example.com"
    userAgent: "Glitzy-search-visibility-bot/1.0"
    legalApproved: true
    legalApprovedBy: "legal@glitzy.kr"
    legalApprovedAt: "2026-05-10T00:00:00Z"
    approvedScope:                                       # SV2-02 구조화
      searchEngines: ["naver", "google"]
      locales: ["ko-KR"]
      devices: ["desktop", "mobile"]
      geo: ["KR"]
      allowLoginState: false
      allowCaptchaBypass: false
      artifactRetentionDaysMax: 90
      allowedPaths: []                                    # 빈 배열 = 검색 결과 page 전체
  backlinkSource:
    enabled: true
    provider: "ahrefs"
    apiKeySecretRef: "secretRef://AHREFS_API_KEY"
    siteDomain: "clinic.example.com"

searchVisibilityPolicyVersion: "sv-2026-05-14"

features:
  - name: "search-visibility"
    version: "0.3.0"
    enabled: true
    requiresFeature:
      - analytics-reporting
    config:
      mode: "alerting"
      monitoringSchedule:
        daily: "04:00"
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      sources:
        analyticsDerived: { enabled: true }
        serpCrawler: { enabled: true }
        backlinkSource: { enabled: true }
      signals:
        exposureTrend:
          enabled: true
          algorithm: "ewma-percentile"
          ewmaAlpha: 0.1                                  # SV2-08
          baselineWindowDays: 28
          percentileLookbackDays: 5
          percentileInput: "raw"                          # raw | ewmaResidual
          percentileLowCritical: 1
          percentileLowWarning: 5
          minSmoothedObservedDays: 3
        aiBriefingCitation:
          enabled: true
          consecutivePresentDays: 3
          consecutiveMissingDays: 5
          emitRestoredEvent: false                        # SV2-12 — v1.0 기본 false. restored 발송 안 함 (AnomalyRecord 저장만)
        unifiedRankingPresence:
          enabled: true
          rankBuckets: ["1", "2-3", "4-10", "11-30", ">30"]
          rankBucketConfigVersion: "v1"                   # SV2-11
          transitionAlertOnBucketChange: true
        backlinkChange:
          enabled: true
          pollingFrequency: "weekly"
          deltaPercentageWarning: 10
          deltaPercentageCritical: 25
          providerSeriesSeparated: true                    # SV2-20 — provider 변경 시 series 분리 기본
          baselineWarmupPolls: 2                            # SV2-20 — 첫 N회는 anomaly 평가 제외
      querySetSource:
        kind: "analytics-derived"                          # analytics-derived | sitemap-derived
        topN: 50
        clusterBy: "page"
        sitemapSnapshotRefreshPolicy: "per-cycle"          # SV2-05 — per-cycle | weekly | on-publish-event
      anomalyHysteresis:
        exposureTrend: { minSmoothedObservedDays: 3, suppressHours: 24 }
        aiBriefingCitation: { consecutiveMissingDays: 5, suppressHours: 72 }
        unifiedRankingPresence: { bucketChangeMinStreak: 2, suppressHours: 48 }
        backlinkChange: { minConsecutivePolls: 2, suppressHours: 168 }
      crawlerRateLimit:
        requestsPerMinute: 6
        userAgentRespectRobots: true
      collectionRetryQueue:
        maxAttempts: 3
        backoffSeconds: [60, 300, 1800]
        workerPollIntervalSeconds: 30
      retentionDays:
        signalSnapshot: 730
        crawlerArtifact: 90                                 # serpCrawler.approvedScope.artifactRetentionDaysMax 초과 금지
        anomalyRecord: 730
      blobStorage:
        provider: "s3"                                      # v1.0은 "s3"만 build-pass (SV4-07). gcs·azure-blob 변환 정책은 SV-06b 후속 인프라 결정
        bucket: "glitzy-sv-artifacts"
        keyPrefix: "search-visibility/"                    # 인스턴스별 prefix는 worker가 append
        signedUrlTtlSeconds: 600
        encryption: "aes-256-gcm"
      externalMonitoringSink:
        provider: "sentry"
        dsnSecretRef: "secretRef://MONITORING_DSN"
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 2종 + read API

| 종류 | 함수 | 책임 |
|---|---|---|
| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
| read API | `queryVisibilitySignals(input)` | 대시보드·다른 Feature 조회 |
| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity)` | SV2-14 — mode 변경 후 retroactive enqueue (운영자 명시) |

### 3.2 MonitoringInput·Result

`runMonitoring` 호출 패턴은 analytics-reporting `runCollection`과 동일 (canonicalSources canonicalization·forceRefresh·refreshIntentId·manifestSnapshotVersion freeze). `canonicalSignals`도 동일 패턴 추가.

MonitoringSourceAttemptResult.status enum:
- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`

### 3.3 AnomalyDetectionResult.anomalies[] detectorOutput shape (SV2-11)

신호별 detectorOutput JSON 필수 shape:

```ts
// exposureTrend (SV4-03 — § 4.1 산식과 동일 shape)
{ baselineEwma: number, observed: number, score: number, actualPercentile: number, thresholdPercentile: number, percentileInput: "raw"|"ewmaResidual", parserVersion?: string }
//   percentileBand는 derived display field (UI 표시용 — `score ≤ thresholdPercentile(critical)` 비교로 도출, DB 컬럼 아님)

// aiBriefingCitation (transition type만)
{ previousState: string, currentState: string, consecutivePresentDays: number, consecutiveMissingDays: number, parserVersion: string }

// unifiedRankingPresence (SV5-03 — absent/restored 전이 시 rank null 허용)
{ previousBucket: string, currentBucket: string, previousRank: number | null, currentRank: number | null, direction: "up"|"down"|"absent"|"restored", streak: number, rankBucketConfigVersion: string }
//   previousRank=null: previousBucket="absent" 또는 "unknown"인 경우
//   currentRank=null: currentBucket="absent"인 경우 (direction="absent")

// backlinkChange
{ previousValue: number, currentValue: number, deltaPercentage: number, provider: string, providerMetricName: string, consecutivePolls: number }
```

### 3.4 `queryVisibilitySignals` (v0.2 § 3.4 유지 + targetKind/targetId 사용)

---

## 4. 신호 정의 + query set 산출

### 4.0 query set 자동 산출 (SV2-03·04)

**`kind="analytics-derived"`** — 표준 호출:

```ts
queryNormalizedMetrics({
  instanceId,
  dimensions: ["query", "page", "source"],
  metrics: ["impressions", "clicks", "position"],
  windowStart: now() - 28d,
  windowEnd: now() - max(GSC.availabilityLagDays, naver.availabilityLagDays),
  sourceFilter: ["gsc", "naver-search-advisor"],
  joinMode: "row-separated"
})
```

**top-N 선정**:
- 정렬: 1차 SUM(impressions) desc, 2차 SUM(clicks) desc, 3차 weighted avg position asc, 4차 queryHash lexical (tie-break)
- 상위 N개 (`topN` config)

**clusterBy="page" mapping** (SV2-04):
- 동일 query가 여러 page에 노출될 경우 — query별 `impressions 최대 landing page`를 primary page로
- 동률: clicks 최대 → position 최소 → canonicalPagePath lexical 순

**`kind="sitemap-derived"`** (SV2-05):
- sitemapSnapshotRefreshPolicy:
  - `per-cycle` (기본): 매 monitoring cycle 시작 시 sitemap.xml fetch + hash 비교. 변경 시 universe 갱신
  - `weekly`: 매주 1회 갱신
  - `on-publish-event`: 빌드 시 명시적 갱신 트리거
- VisibilitySignalSnapshot.metadata에 `sitemapSnapshotHash` 보존

### 4.1 exposureTrend — EWMA·percentile (SV3-01 산식·config 반영 정정)

**target aggregation SoT** (SV3-02):

- exposureTrend.target = **page** (canonical path 단위). site-overall은 별도 target row(targetKind="site", targetId="overall")
- observed[t]는 page 단위:
  - **page target**: `SUM(impressions) WHERE page=target AND date=t` (analytics-derived universe 전체 — 특정 query 집합 한정 아님 — query universe는 SERP crawler용 monitored set일 뿐)
  - **site-overall target**: `SUM(impressions) WHERE instanceId=this AND date=t` (전체 합산)
- source별 합산: dimensions에 `source` 포함하여 분리 row 받은 후 본 Feature가 source 합산 또는 source별 분리 series 운영 (정책: **source 합산 기본** — `metricSourceMap`은 metadata에만)

**산식** (SV3-01 config 반영):

```
score[t] = percentileInput === "raw" ? observed[t] : observed[t] - baselineEwma[t]
   - baselineEwma[t] = ewmaAlpha * observed[t] + (1 - ewmaAlpha) * baselineEwma[t-1]  (ewmaAlpha 기본 0.1)
scoreSample = 최근 percentileLookbackDays(기본 5) 윈도우의 score[*] 분포
thresholdCritical = percentile(scoreSample, percentileLowCritical)  // 기본 P1
thresholdWarning  = percentile(scoreSample, percentileLowWarning)   // 기본 P5
severity:
  - score[t] <= thresholdCritical → critical (band="P{percentileLowCritical}")
  - score[t] <= thresholdWarning  → warning  (band="P{percentileLowWarning}")
  - 그 외 → normal

전제: 최소 minSmoothedObservedDays(기본 3) 일자 수집 후 평가
```

**detectorOutput.exposureTrend 정정** (§ 3.3 shape 변경):

```ts
{ baselineEwma: number, observed: number, score: number, actualPercentile: number, thresholdPercentile: number, percentileInput: "raw"|"ewmaResidual", parserVersion?: string }
```

actualPercentile/thresholdPercentile 저장으로 P1/P5 hardcode 회피 (config 변경 시 산식이 자연 반영).

### 4.2 aiBriefingCitation — state transition

- 매 cycle SERP 크롤링 후 인용 여부 판정
- state machine: `unknown` → `present` (consecutivePresentDays 충족 시 `first-detected` notify) → `missing` (consecutiveMissingDays 충족 시 `lost` notify) → `present` (재등장 — `emitRestoredEvent=false` 기본이라 AnomalyRecord 저장만, notify 미발송; SV2-12)

### 4.3 unifiedRankingPresence — rank bucket transition (SV3-07 state transition closure)

- 매 cycle 통합 영역 노출 query별 rank 추출 (serp-crawler)
- bucket 매핑 → 직전 bucket과 비교 → transition 발생 시 AnomalyRecord 저장
- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
- detectorOutput shape (§ 3.3)

**state transition table** (SV3-07):

| 전이 (previous → current) | AnomalyRecord 저장 | eventType | notify |
|---|---|---|---|
| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
| `bucket:a` → `bucket:b` (개선·악화) | ✅ severity=warning (b가 a보다 worse) / info (better) | `search-visibility-anomaly-warning` (worse일 때만) | ✅ (worse일 때) |
| `bucket:*` → `absent` (SERP 결과에서 제거) | ✅ severity=critical | `search-visibility-anomaly-critical` | ✅ |
| `absent` → `bucket:*` (복귀) | ✅ severity=info, direction="restored" | (없음) | ❌ |
| crawl `degraded`·`failed` → 상태 hold | ❌ (state 갱신 안 함, suppression ledger 적용) | (없음) | ❌ |
| `unknown` → `absent` (첫 관측이 absent) | ❌ (state unknown → absent 직접 전이 안 함, 첫 bucket 관측 전까지 unknown 유지) | (없음) | ❌ |

### 4.4 backlinkChange — weekly delta

- pollingFrequency=weekly
- 직전 poll 대비 deltaPercentage 계산
- |delta| ≥ deltaPercentageCritical(25%) → critical / ≥ Warning(10%) → warning
- baselineWarmupPolls(기본 2) — provider 변경·신규 polling 시작 첫 N회는 anomaly 평가 제외 (SV2-20)
- providerSeriesSeparated=true → provider 변경 시 새 series로 분리 (baseline reset 동일 효과)

---

## 5. source 어댑터

### 5.1 analytics-derived

- queryNormalizedMetrics 호출 (§ 4.0 표준 패턴 + § 4.1 exposureTrend)
- sourceWatermarks를 VisibilitySignalSnapshot.metadata에 보존
- canonical path는 SEARCH_STANDARDIZATION § 5 resolve 적용

### 5.2 serp-crawler

- **법무 게이트** (DATA_MODEL C-08 v0.16 SerpCrawlerApprovedScope SoT):
  - `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → build fail
  - crawler 실행 파라미터가 approvedScope 범위 밖이면 → `skipped-legal-out-of-scope` 처리
- rate limit·robots.txt 준수·운영 안정성 — v0.2 유지 (locale·device·geo·blockReason·captchaDetected artifact metadata)
- **parserVersion 변경 정책** (SV2-18):
  - 기본: parserVersion 변경 시 새 lineage (기존 artifact 자동 backfill 안 함)
  - 운영자 명시 backfill job(`reparseArtifacts(parserVersion, range)`)으로만 backfill 가능
  - AnomalyRecord.detectorOutput에 parserVersion 저장 (감사)

### 5.3 backlink-source

- provider별 raw metric + `providerMetricName`(DR/DA/AS) + `providerMetricValue`
- `normalizedAuthorityScore` **optional** (SV2-19 — v1.0 변환 함수 미확정, SV-09 후속)
- detector는 `providerMetricValue`로 작동. normalized 값은 dashboard 비교용 (없을 수도)
- provider 변경 시 `providerSeriesSeparated=true`(기본) → 별도 series. weekly delta는 동일 provider 내에서만 평가

---

## 6. detector + state

### 6.1 detector 매핑 + VisibilityState signal별 enum (SV2-09·10)

| 신호 | detector | VisibilityState 사용? | currentState enum |
|---|---|---|---|
| exposureTrend | ewma-percentile | **❌** (AnomalyRecord만) | N/A |
| aiBriefingCitation | state-transition | ✅ | `unknown` \| `present` \| `missing` \| `degraded` |
| unifiedRankingPresence | rank-bucket-transition | ✅ | `bucket:1` \| `bucket:2-3` \| `bucket:4-10` \| `bucket:11-30` \| `bucket:>30` \| `absent` \| `unknown` |
| backlinkChange | weekly-delta-percentage | ❌ (AnomalyRecord만) | N/A |

> `VisibilityState`는 transition형 signal 전용. exposureTrend·backlinkChange는 시계열 anomaly이므로 별도 state machine 불필요 (SV2-10).

### 6.2 평가 cycle — v0.2 § 6.2 유지

### 6.3 false-positive 완화 + anomaly suppression ledger (SV3-08)

각 신호별 hysteresis(streak·suppressHours) 외에 **AnomalyRecord 기반 suppression ledger** (state machine 미사용 signal에 적용):

- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
- **suppress 조건**: 동일 key의 AnomalyRecord 중 `resolutionStatus="open"` + `detectedAt > now() - suppressHours`인 row 존재 → 신규 anomaly 생성 skip (재실행·forceRefresh 시 중복 방지)
- **severity escalation 의도** (SV4-06): suppression key에 `severity`가 포함되어 동일 target의 warning → critical 상승 시 별도 anomaly 생성. critical 알림이 warning suppression에 막히지 않도록 한 의도된 동작. false-positive resolve(`resolutionStatus="false-positive"`) 후 재발생도 새 anomaly로 생성됨 (open 조건 미충족)
- 적용 대상: exposureTrend·backlinkChange (state machine 미사용)
- aiBriefingCitation·unifiedRankingPresence는 VisibilityState transition으로 자연 dedupe (별도 ledger 불필요)

기본값 (운영 정책별 override):

| 신호 | minStreak / window | suppressHours |
|---|---|---|
| exposureTrend | minSmoothedObservedDays 3 | 24h |
| aiBriefingCitation lost | consecutiveMissingDays 5 | 72h |
| unifiedRankingPresence | bucketChangeMinStreak 2 | 48h |
| backlinkChange | minConsecutivePolls 2 | 168h (weekly poll 1회 분량) |

---

## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)

### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)

5종 매트릭스 그대로 — v0.2 § 7.1 유지.

### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)

`shouldNotify(eventType, mode)` 표:

| eventType | severity 매핑 | mode="alerting" | mode="monitor-only" |
|---|---|---|---|
| `search-visibility-anomaly-critical` | severity="critical" anomaly | ✅ enqueue | ❌ |
| `search-visibility-anomaly-warning` | severity="warning" anomaly | ✅ enqueue | ❌ |
| `search-visibility-monitoring-failed` | envelope failed | ✅ enqueue | ❌ |
| `ai-briefing-citation-first-detected` | first-detected state transition | ✅ enqueue (severity=info여도) | ❌ |
| `ai-briefing-citation-lost` | lost state transition | ✅ enqueue | ❌ |

### 7.3 발송 흐름 — outbox SQL

v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).

### 7.4 NotificationEvent 필드 매핑 (SV5-04 — eventType별 명시)

| eventType | contentRef | contentTitle | metadata 필수 필드 |
|---|---|---|---|
| `search-visibility-anomaly-critical`·`-warning` | `anomalyRecordId` | `"${signal} ${severity} — ${targetKind}/${targetDisplay}"` | signal·targetKind·targetId·detectedAt·detectorOutput·streakDays·qualityTier |
| `search-visibility-monitoring-failed` | `"instance:" + instanceId` (synthetic — envelope 단위) | `"Search visibility monitoring failed (${date})"` | monitoringLogId·failedSources[]·detectedAt |
| `ai-briefing-citation-first-detected` | `anomalyRecordId` | `"AI 브리핑 인용 첫 등장 — ${targetDisplay}"` | signal=aiBriefingCitation·targetKind·targetId·firstSeenAt·searchEngine |
| `ai-briefing-citation-lost` | `anomalyRecordId` | `"AI 브리핑 인용 상실 — ${targetDisplay}"` | signal=aiBriefingCitation·targetKind·targetId·lastSeenAt·consecutiveMissingDays·searchEngine |

공통 필드:
- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
- `recipients`: REVIEW_WORKFLOW § 9.1.1 매트릭스 수신자 산정 결과 AdminUser fan-out
- `criticality`: § 9.1.1 매트릭스 값
- `createdAt`: detectedAt 또는 outbox enqueue 시각

DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.

### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)

- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
- 운영자 명시 액션 `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` (§ 3.1):

**Command contract**:
- **권한**: `super-admin` 전용 (REVIEW_WORKFLOW § 11.1 AdminUserRole). operator는 본 액션 호출 불가 — retroactive 발송은 운영 영향 큰 액션이므로 권한 한정
- **입력**: `window: {start, end}`·`severity: ("warning"|"critical")[]`·`dryRun: boolean (default true)`
- **dryRun=true**: 영향받을 AnomalyRecord 목록만 반환 (실제 enqueue 없음). 운영자 검토 후 dryRun=false로 재호출
- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
- **sourceEventId 산정** (SV4-05 — 정책 버전 변경에도 재발송 금지):
  - `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)`
  - `searchVisibilityPolicyVersion` 미포함 — 정책 변경(매트릭스 신규 version) 시에도 동일 anomaly 재발송 금지 의도
  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유지 (notifications idempotent receipt가 중복 발송 차단)
  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
- **audit log** (SV5-02): action=`search-visibility-retroactive-enqueue-requested` (REVIEW_WORKFLOW § 10.2.1 cascade 완료):
  - `contentRef = "instance:" + instanceId` (synthetic — batch 단위 액션이라 단일 콘텐츠 ref 없음)
  - `metadata = { windowStart, windowEnd, severity: ("warning"|"critical")[], dryRun, matchedCount, enqueuedCount, retroactiveBatchId }`
  - `actorId = AdminUser.@id` (super-admin), `actorRole = "super-admin"`
- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)

---

## 8. 운영 지표

v0.2 § 8 유지.

---

## 9. AnomalyRecord 운영 흐름 (resolutionStatus)

v0.2 § 9 유지.

---

## 10. 설치·설정·운영 모드

### 10.1 빌드 단계 — v0.2 유지

### 10.2 운영 모드 (SV2-14 정합)

- **alerting** (기본): notifications 필수
- **monitor-only**: notifications 비활성 허용. AnomalyRecord 저장만
- 모드 변경: § 7.5 retroactive 정책 적용

---

## 11. 빌드·런타임 검증

### 11.1 build-time fail (SV2-21 정정 — anomalyDetection 잔재 제거)

- `enabled=true` + `searchVisibilityConfig` 누락
- `searchVisibilityPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- `requiresFeature: analytics-reporting` 충족 안 됨
- `mode="alerting"` + `notifications` 비활성
- **`serpCrawler.enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락)** (SV2-01 정합)
- **`serpCrawler.enabled=true` + `serpCrawler.approvedScope` 누락** — approvedScope required (SV2-02 구조화 필드)
- **`serpCrawler.enabled=true` + `approvedScope.allowCaptchaBypass === true`** (운영상 금지 — SV3-03)
- **`serpCrawler.enabled=true` + `approvedScope.artifactRetentionDaysMax` 누락** (SV3-03 required 필드)
- `backlinkSource.enabled=true` + `apiKeySecretRef` 누락
- `signals.*` 모두 비활성 (전부 enabled=false)
- `signals.exposureTrend.algorithm` 미지정 또는 `ewmaAlpha`·`baselineWindowDays`·`percentileLookbackDays` 누락
- **`config.blobStorage.provider`·`bucket`·`signedUrlTtlSeconds` 누락** (serpCrawler 활성 시)
- **`config.blobStorage.provider !== "s3"`** (v1.0 SV4-07 — 다른 provider는 SV-06b 후속까지 build fail)

**평가 순서** (SV3-04):
1. `serpCrawler.enabled=true`이면 → approvedScope required 검증·legalApproved 게이트 먼저
2. approvedScope 통과 시 → `config.retentionDays.crawlerArtifact > approvedScope.artifactRetentionDaysMax` 비교. 초과 시 build fail
3. `serpCrawler.enabled=false`이면 → approvedScope·blobStorage·crawlerArtifact retention 검증 skip (해당 항목 fail 룰 비활성)

### 11.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락 또는 빈 문자열
- on-demand `detectAnomalies` 호출 시 신호별 minStreak/window 데이터 부족 (scheduled는 hold + warning)
- crawler 실행 파라미터가 `approvedScope` 밖이면 `skipped-legal-out-of-scope`

### 11.3 warning

- `serpCrawler.enabled=true` + `userAgentRespectRobots=false`
- `backlinkSource.provider="self-crawl"`
- `monitoringSchedule.daily`가 analytics-reporting `collectionSchedule.daily` 이전
- `signals.aiBriefingCitation.enabled=true` + SEARCH_STANDARDIZATION `aiCrawlerPolicy="disallowAll"` (자동 degraded)
- backlink-source provider 변경 직후 `baselineWarmupPolls` 미완료 (감사 표시)

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| SV-01 | serp-crawler 법적·ToS — 인스턴스별 법무 책임 | 법무 검토 (v1.0 fail-gate 강제) |
| SV-02 | AI 브리핑 인용 파싱 DOM 변경 대응 | 운영 — parserVersion 추적 |
| SV-03 | backlink provider 선택 | 비용·정확도 |
| SV-04 | 통합 영역 personalization 영향 | 운영 |
| SV-05 | anomaly 알고리즘·threshold 튜닝 baseline | M2+ 누적 |
| SV-06a | crawler network egress·proxy·UA rotation | 인프라 결정 |
| SV-06b | artifact blob storage IAM policy 예시·운영 role 구체화 (provider=s3는 v0.3 결정) | 인프라 결정 (SV3-10 분리) |
| SV-07 | 다국어 SERP | M3+ |
| SV-08 | aiBriefingCitation `restored` 이벤트 (v1.x patch) | v1.x — emitRestoredEvent=false 기본 |
| SV-09 | normalizedAuthorityScore 변환 함수 | v1.x patch (optional 필드) |
| SV-11 | hysteresis 주말·공휴일 보정 | 운영 정책 |
| SV-12 | `anomaly-resolution-updated` audit cascade | REVIEW_WORKFLOW § 10.2.1 후속 |
| SV-14 | signed URL refresh client SDK | 인프라 결정 (SV3-09) |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~SV-10~~ | backlink provider 변경 baseline reset | v0.3 — `providerSeriesSeparated=true` 기본 + `baselineWarmupPolls=2` 정책. v1.0 마감 시 closure (SV3-10) |
| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |

---

## 12.2 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (20 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (10 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (7 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB 9 tables)

### 13.1 공통 원칙 — v0.2 § 13.1 유지

### 13.2 `VisibilitySignalSnapshot` — v0.2 § 13.2 유지 (targetKind/targetId)

### 13.3 `MonitoringLog` (SV2-06 — 풀 스키마)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `canonicalSources` | JSON (string[]) | ✅ |
| `canonicalSignals` | JSON (string[]) | ✅ |
| `sourceConfigSnapshotHash` | string | ✅ |
| `signalConfigSnapshotHash` | string | ✅ |
| `manifestVersion` | string | ✅ |
| `searchVisibilityPolicyVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | ✅ |
| `startedAt` | Date | ✅ |
| `completedAt` | Date | optional |
| `envelopeState` | enum | ✅ — accepted/processing/completed/partial-failed/failed |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.

### 13.4 `MonitoringSourceAttempt`

analytics-reporting CollectionSourceAttempt 동일 패턴 + `skipped-legal-out-of-scope`·`skipped-baseline-warmup`·`skipped-degraded` status 추가.

### 13.5 `SearchVisibilityCollectionRetryQueue` (SV2-07 신설 — 9번째 table)

**worker SoT 쿼리** (SV3-05 — analytics-reporting § 4.3 패턴 복제):

```sql
-- worker claim
UPDATE search_visibility_collection_retry_queue
SET status = 'processing', locked_at = now(), locked_by = :workerId
WHERE id IN (
  SELECT id FROM search_visibility_collection_retry_queue
  WHERE status = 'pending' AND scheduled_for <= now()
  ORDER BY scheduled_for
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
RETURNING *;

-- attemptNumber 동시성 안전 (analytics-reporting AR3-02 패턴):
--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
--   2. SELECT MAX(attemptNumber)+1 FROM MonitoringSourceAttempt WHERE monitoringLogId=? AND source=?
--   3. lock 보유 상태에서 새 MonitoringSourceAttempt INSERT (status="processing", attemptNumber=max+1)
--   4. 짧은 transaction commit → lock 자동 해제
--   5. 별도 transaction에서 provider 호출 후 attempt UPDATE
-- stale processing(>10분) — 별도 reconcile worker가 queue status="pending" 복귀
-- maxAttempts 도달 → queue status="exhausted" + MonitoringSourceAttempt.status="failed-permanent" + 외부 sink alert
-- envelope 재계산: attempt 종결 시마다 lock(hash(monitoringLogId, "envelope")) 후 envelopeState 재산정

-- lock ordering invariant (analytics-reporting AR4-03 동일):
-- attempt lock 보유 중 envelope lock 획득 금지. attempt commit 후 별도 transaction에서 envelope lock
```



| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `monitoringLogId` | UUID | ✅ — FK |
| `source` | VisibilitySource | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted) | ✅ |
| `scheduledFor` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `dedupeMode` | enum (normal·resend) | ✅ |

**Constraints**: `FK monitoringLogId ON DELETE RESTRICT`, `UNIQUE(monitoringLogId, source, attemptNumber)`.
**Index**: `(status, scheduledFor)` partial where status='pending'.

### 13.6 `AnomalyRecord`

v0.2 § 13.4 유지 + detectorOutput shape (§ 3.3 — signal별 필수 필드 정의).

### 13.7 `VisibilityState` (SV2-09·10 — signal별 enum 명시)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `signal` | VisibilitySignal | ✅ — **`aiBriefingCitation` 또는 `unifiedRankingPresence`만** (transition형 한정 — SV2-10) |
| `targetKind`·`targetId` | ✅ |
| `currentState` | string | ✅ — § 6.1 표의 signal별 enum |
| `previousState` | string | optional |
| `firstSeenAt`·`lastSeenAt` | Date | optional |
| `consecutivePresentDays`·`consecutiveMissingDays` | integer | ✅ |
| `lastTransitionEventId` | string | optional |
| `lastTransitionAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, signal, targetKind, targetId)`.

### 13.8 `SerpCrawlerArtifact` (SV2-17·18 보강)

v0.2 § 13.6 유지 + 운영 정책 보강:

- blob isolation **IAM 정책 SoT** (SV2-17·SV3-09 구체화):
  - **canonical object key format**: `{blobStorage.keyPrefix}{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (예: `search-visibility/client-01/2026-05-14/abc123.html`)
  - signed URL 발급 API는 호출자 AdminUser.instanceMemberships에 본 instanceId 포함 여부 검증 (미포함 시 403)
  - **S3 IAM condition 예시**:
    ```json
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::glitzy-sv-artifacts/search-visibility/${aws:PrincipalTag/instanceId}/*",
      "Condition": { "StringEquals": { "aws:PrincipalTag/instanceId": "${...}" } }
    }
    ```
  - **signed URL refresh**: TTL 600초. 대시보드 client는 만료 60초 전 read API 재호출로 fresh URL 발급. 대시보드 장기 열람 중 자동 refresh (요청 응답 client SDK 제공 — 인프라 결정 SV-14 신설)
  - cross-instance access 자동 차단 (IAM PrincipalTag + signed URL 발급 권한 검증 양층)
- parserVersion 변경 (SV2-18): § 5.2 정책 — backfill은 운영자 명시 job만

### 13.9 `BacklinkSnapshot` (SV2-19 — normalizedAuthorityScore optional)

v0.2 § 13.7 유지 + `normalizedAuthorityScore`를 **optional**로 정정 (variant 함수 SV-09 미확정 시 detector는 providerMetricValue로 작동).

### 13.10 `AnomalyNotificationOutbox` (SV2-13 enqueue 조건 정합 — eventType 기반)

v0.2 § 13.8 스키마 유지 + 다음 정정:
- enqueue 조건: § 7.2 shouldNotify 표 적용
- **sourceEventId** 산식 (SV4-05): `hash("search-visibility:" + anomalyRecordId + eventType)` — policyVersion 미포함 (정책 변경 시 재발송 금지)
- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

---
