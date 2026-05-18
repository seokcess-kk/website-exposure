# Feature — keyword-monitoring

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 4개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1·§ 11.2 / `docs/features/analytics-reporting.md` v1.0
> **목적**: 사용자 지정 N개 키워드의 검색 순위·노출·CTR·rank bucket transition 모니터링. analytics-reporting의 queryNormalizedMetrics 데이터 기반. 이상 변동 시 outbox 알림.
> **연관 문서**:
> - 측정 데이터 read API SoT → `features/analytics-reporting.md` § 3.4 `queryNormalizedMetrics()` (QueryDimension·QueryMetric)
> - 알림 발송 SoT → `features/notifications.md` notify() + REVIEW_WORKFLOW § 9.1·§ 9.1.1 (8종 cascade 완료)·§ 10.2.1 (audit 5종 cascade 완료)
> - 자격증명·식별자·policyVersion SoT → `core/DATA_MODEL.md` C-08 `keywordMonitoringConfig`·`keywordMonitoringPolicyVersion`(v0.17 — SerpCrawlerApprovedScope 재사용)
> - 책임 경계 (vs search-visibility) → `docs/ARCHITECTURE.md` § 11.2
> - SERP 크롤러 법무 게이트 패턴 → `features/search-visibility.md` § 5.2·DATA_MODEL C-08 SerpCrawlerApprovedScope

---

## 0. 한 페이지 요약

- **Feature 식별자**: `keyword-monitoring`
- **핵심 책임**: (a) 사용자 지정 키워드 N개 모니터링, (b) analytics-derived 데이터 기반 순위·노출·CTR 추적, (c) **v1.0에서 serp-crawler 미지원** — `enabled=true` build fail (F-13. v1.x에서 search-visibility SerpCrawlerArtifact 공용 또는 별도 테이블 추가 결정 후 활성), (d) rank bucket transition state·이상 변동 감지, (e) **KeywordAnomalyNotificationOutbox** 패턴, (f) 대시보드 read API
- **vs search-visibility** (ARCHITECTURE § 11.2): 본 Feature는 **사용자 지정 N개 키워드**(좁은 영역). 자동 query set 아님. 두 Feature 동시 활성 시 중복 알림 정책은 § 0.1
- **데이터 source 1종 (v1.0)**: `analytics-derived` (필수). serp-crawler는 v1.x
- **운영 모드 2종**: alerting (notifications 필수)·monitor-only
- **신호 4종 + signal-specific detector**:
  - `keywordRank` (moving-average) / `keywordImpressions` (delta-percentage + zero baseline rule) / `keywordCTR` (z-score + direction + minBaselineDays) / `keywordRankBucketTransition` (state machine)
- **DB 인벤토리**: **8 tables** — KeywordTrackingTarget·KeywordSignalSnapshot·MonitoringLog·MonitoringSourceAttempt·KeywordMonitoringCollectionRetryQueue·KeywordAnomalyRecord·KeywordRankBucketState·KeywordAnomalyNotificationOutbox

### 0.1 search-visibility와 동시 활성 시 정책 (F-18)

- 본 Feature는 **사용자 명시 N개 keyword target** 추적. search-visibility는 자동 query set 추출
- 동일 keyword가 양쪽에 모두 포함될 가능성 존재 (예: 사용자가 search-visibility 자동 추출 query를 별도 keyword-monitoring target으로 명시 등록)
- 정책: **중복 알림 허용** (사용자 명시 target은 알림 받을 의도로 등록한 것)
- **correlatedSearchVisibilityAnomalyId 매핑 정책** (KM2-05 + KMF3-05 boundary):
  - **lookup 시점**: KeywordAnomalyRecord insert **직전 1회 lookup**. **별도 transaction** (cross-Feature 동일 transaction 금지 — KMF3-05)
  - **read 격리**: READ COMMITTED — search-visibility AnomalyRecord 중 commit된 row만 매칭 (transaction 미커밋 row 무시). best-effort
  - **read 권한**: 내부 service principal (cross-Feature 직접 SQL 권한). 외부 API 호출 아님
  - **매칭 키**: (instanceId, query 또는 page, date, severity 기준) — search-visibility AnomalyRecord 검색
  - **다건 매칭 시**: 최신 detectedAt + 가장 높은 severity 우선 (critical > warning > info)
  - **매칭 실패 시**: `correlatedSearchVisibilityAnomalyId=null`. 재시도하지 않음
  - **search-visibility anomaly가 나중에 생성되는 경우**: keyword-monitoring backfill 안 함 (best-effort)
- 대시보드 묶음 표시 — 운영 UI 결정 (KM-15 후속)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | |
| 데이터 source 추가/제거 | MINOR / **MAJOR** | 별개 | C-08 cascade |
| 신호별 detector 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 변경 | **MAJOR** | 별개 | |
| rank bucket 정의 변경 | **MAJOR** | policyVersion 신규 | |
| KeywordTrackingTarget 스키마 변경 | **MAJOR** | 별개 | 어드민 UI cascade |
| build/runtime fail 룰 추가·강화 | **MAJOR** | 별개 | |
| **migration-time validation 룰 추가·강화** | **MAJOR** | 별개 | KMF4-06 — § 11.3 신설 영역. 운영 데이터 무결성 영향 |
| **runtime invariant·reconcile 룰 추가·강화** | MINOR | 별개 | KMF4-06 — § 11.4 신설. 감지 룰은 운영 모니터링 영역 |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 측정 데이터 read API SoT는 analytics-reporting § 3.4 (`QueryDimension` 9종·`QueryMetric` 9종 — locale/searchEngine 차원 없음, F-3)
- 알림 발송 SoT는 notifications + REVIEW_WORKFLOW § 9.1.1 매트릭스 (8종 cascade 완료)
- audit log SoT는 REVIEW_WORKFLOW § 10.2.1 (5종 cascade 완료)
- 자격증명·policyVersion·SerpCrawlerApprovedScope SoT는 DATA_MODEL C-08 (search-visibility 재사용)
- 본 문서 = 키워드 모니터링·detector·state·알림 SoT + 내부 데이터 구조 SoT (§ 13)

### 1.2.1 공통 retry taxonomy

search-visibility § 1.2.1 동일 — 2종 retry 구조:

| 큐 | maxAttempts | 출처 |
|---|---|---|
| KeywordMonitoringCollectionRetryQueue | `config.collectionRetryQueue.maxAttempts` (기본 3) — configurable |
| KeywordAnomalyNotificationOutbox | **상수 5** |

### 1.3 본 문서가 다루지 않는 영역

- 측정 데이터 수집 자체 — analytics-reporting
- 사이트 전체·자동 query set 모니터링 — search-visibility
- 알림 채널·재시도 — notifications
- 키워드 전략·SEO 실행 — 운영 플레이북

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "keyword-monitoring"
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
| analytics-reporting § 3.4 | `queryNormalizedMetrics` (QueryDimension 9종·QueryMetric 9종) |
| notifications | notify() (mode="alerting" 시) |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | **8종 NotificationEventType cascade 완료** |
| REVIEW_WORKFLOW § 10.2.1 | AuditAction **5종** cascade 완료 (keyword-tracking-target-registered/unregistered·keyword-anomaly-resolution-updated·keyword-monitoring-retroactive-enqueue-requested·**keyword-tracking-target-migrated-v02-v03**) |
| DATA_MODEL C-08 v0.17 | `keywordMonitoringConfig`·`keywordMonitoringPolicyVersion`(top-level) |
| DATA_MODEL C-23 | AdminUser |

### 2.3 InstanceManifest 통합

```yaml
keywordMonitoringConfig:                                 # DATA_MODEL C-08 v0.17
  serpCrawler:
    enabled: false                                        # v1.0은 false만 build-pass (F-13)
    # 다른 필드는 v1.x에서 활성화 시 필요

keywordMonitoringPolicyVersion: "km-2026-05-14"

features:
  - name: "keyword-monitoring"
    version: "0.2.0"
    enabled: true
    requiresFeature:
      - analytics-reporting
    config:
      mode: "alerting"
      monitoringSchedule:
        daily: "05:00"
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      sources:
        analyticsDerived: { enabled: true }
      signals:
        keywordRank:
          enabled: true
          algorithm: "moving-average"                     # F-9 — v0.2는 moving-average만 enum 허용. ewma는 v1.x
          windowDays: 7
          improvementThresholdRank: 5
          dropThresholdRank: 5
        keywordImpressions:
          enabled: true
          algorithm: "delta-percentage"
          spikeThresholdPercentage: 50
          dropThresholdPercentage: 50
          windowDays: 7
          zeroBaselinePolicy: "first-observed"             # KM2-07 — first-observed·hold만 enum 허용 (spike 제거)
          firstObservedSpikeThresholdImpressions: 100      # baseline=0 + observed >= 본 값 시 first-observed-spike anomaly. zeroBaselinePolicy="first-observed" 일 때만 사용
        keywordCTR:
          enabled: true
          algorithm: "zscore"
          zscoreThreshold: 2.5
          baselineWindowDays: 28
          minImpressionsForCtrEval: 100
          minBaselineDays: 7                               # F-10 — baseline 표본 부족 시 hold
          minVariance: 0.0001                              # F-10 — 분산 0이면 hold
        keywordRankBucketTransition:
          enabled: true
          rankBuckets: ["1", "2-3", "4-10", "11-30", ">30"]
          rankBucketConfigVersion: "v1"
          transitionAlertOnBucketChange: true
      keywordTargetSource:
        kind: "admin-managed"
        maxKeywordsPerInstance: 100
      anomalyHysteresis:
        keywordRank: { minStreakDays: 2, suppressHours: 24 }
        keywordImpressions: { minStreakDays: 3, suppressHours: 24 }
        keywordCTR: { minStreakDays: 3, suppressHours: 48 }
        keywordRankBucketTransition: { bucketChangeMinStreak: 2, suppressHours: 48 }
      collectionRetryQueue:
        maxAttempts: 3
        backoffSeconds: [60, 300, 1800]
        workerPollIntervalSeconds: 30
      retentionDays:
        signalSnapshot: 730
        anomalyRecord: 730
      externalMonitoringSink:
        provider: "sentry"
        dsnSecretRef: "secretRef://MONITORING_DSN"
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command

| 종류 | 함수 | 책임 |
|---|---|---|
| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
| 실행 command | `detectAnomalies(input)` | 이상 변동 감지 + outbox enqueue |
| read API | `queryKeywordSignals(input)` | 대시보드 조회 |
| 운영 command | `registerKeyword(target)` | 키워드 추적 등록. **권한: operator·super-admin**. audit `keyword-tracking-target-registered` (§ 3.1.1) |
| 운영 command | `unregisterKeyword(targetId)` | **soft delete (active=false)**. 기존 snapshot·anomaly 보존. **권한: operator·super-admin**. audit `keyword-tracking-target-unregistered` (§ 3.1.1) |
| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` | retroactive enqueue. **권한: super-admin 전용**. audit `keyword-monitoring-retroactive-enqueue-requested` (§ 3.1.1) |

### 3.1.1 audit log contract (KM2-06)

| AuditAction | contentRef | metadata 필수 필드 |
|---|---|---|
| `keyword-tracking-target-registered` | `"keyword-target:" + targetId` | keyword·country·device·searchEngine·category·registeredBy·reactivatedFromInactive(boolean — KM2-02 재등록 시 true) |
| `keyword-tracking-target-unregistered` | `"keyword-target:" + targetId` | keyword·country·device·searchEngine·activeBefore(true)·activeAfter(false)·unregisteredBy |
| `keyword-anomaly-resolution-updated` | `"keyword-anomaly:" + anomalyRecordId` | signal·keywordTargetId·keyword·priorStatus·newStatus·resolutionNote·resolvedBy |
| `keyword-monitoring-retroactive-enqueue-requested` | `"instance:" + instanceId` (synthetic — search-visibility § 7.5 패턴 동일) | windowStart·windowEnd·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId·actorRole="super-admin" |
| `keyword-tracking-target-migrated-v02-v03` | `"instance:" + instanceId` | § 10.3 migration audit contract metadata 참조 (decompositions[]·conflictResolutions[]·actorRole="super-admin") |

### 3.2 KeywordTrackingTarget (F-5 정규화)

```ts
type KeywordTrackingTarget = {
  id: string;                            // UUID
  instanceId: Slug;
  keyword: string;
  queryHash: string;                      // SHA-256(keyword + country + device + searchEngine) — F-5 (locale → country 매핑)
  country: string;                         // ISO3166 alpha-2 — analytics-reporting QueryDimension 정합 (F-3)
  device: "desktop" | "mobile";
  searchEngine: "naver" | "google";       // F-5 — 단일 enum (배열 아님). 동일 keyword 여러 search-engine 추적 시 별도 target 등록
  category?: string;
  expectedTopRankBucket?: string;
  registeredBy: string;                    // AdminUser @id
  registeredAt: Date;
  active: boolean;                         // unregisterKeyword 시 false. hard delete 없음
};
```

> **locale → country 매핑** (F-3): analytics-reporting QueryDimension은 `country`만 제공. 한국어 키워드는 보통 `country=KR`. 다국어 키워드 추적은 KM-05 후속 (`searchEngine.locale` 확장 시 cascade).

### 3.3 MonitoringInput·Result

search-visibility § 3.3 패턴 동일.

### 3.4 AnomalyDetectionResult.anomalies[] detectorOutput shape

```ts
// keywordRank
{ baselineRank: number, observedRank: number, deltaRank: number, direction: "improved" | "dropped", source: AnalyticsSource, streakDays: number }

// keywordImpressions
{ baselineImpressions: number, observedImpressions: number, deltaPercentage: number | null, direction: "spike" | "drop" | "first-observed-spike", windowDays: number, zeroBaselineApplied: boolean }

// keywordCTR
{ baselineCtr: number, observedCtr: number, zScore: number, direction: "ctr-up" | "ctr-down", impressionsInWindow: number, baselineDaysUsed: number, baselineVariance: number }

// keywordRankBucketTransition (rank nullable — search-visibility 패턴)
{ previousBucket: string, currentBucket: string, previousRank: number | null, currentRank: number | null, direction: "up" | "down" | "absent" | "restored", streak: number, rankBucketConfigVersion: string }
```

### 3.5 `queryKeywordSignals` (read API + notify contract — KMF3-04)

```ts
async function queryKeywordSignals(input: { /* v0.1 § 3.5 유지 */ }): Promise<{
  series: Array<{ /* v0.1 § 3.5 유지 */ }>;
  anomaliesInWindow: Array<{
    anomalyId: string;
    signal: KeywordSignal;
    keywordTargetId: string;
    keyword: string;
    detectedAt: ISODateString;
    severity: "info" | "warning" | "critical";
    detectorOutput: object;
    streakDays: number;
    resolutionStatus: "open" | "true-positive" | "false-positive" | "resolved" | "ignored";
    notify: boolean;                                   // KMF3-04 — outbox enqueue 대상 여부
    notificationSuppressionReason?: "not-enqueue-eligible" | "monitor-only-mode" | "suppressed-by-ledger";
    notificationEventId?: string;                       // 발송 시 notify() envelope ID
    correlatedSearchVisibilityAnomalyId?: string;       // § 0.1 cross-Feature 매핑
  }>;
  states: Array<{ /* v0.1 § 3.5 유지 */ }>;
  dataCompleteness: number;
}>;
```

**notify 산정 규칙** (KMF3-04):
- `notify=false`: ctr-up direction (anomalyRecord 저장만, outbox 미enqueue) → `notificationSuppressionReason="not-enqueue-eligible"`
- `notify=false`: mode="monitor-only" (모든 anomaly outbox 미enqueue) → `notificationSuppressionReason="monitor-only-mode"`
- `notify=false`: ledger suppress (동일 key 최근 anomaly open + suppressHours 윈도우 내) → `notificationSuppressionReason="suppressed-by-ledger"`
- `notify=true`: outbox enqueue 대상. 발송 완료 시 `notificationEventId` 채움

---

## 4. 신호 정의·detector

### 4.1 keywordRank — 평균 순위 변동

- source: analytics-derived (queryNormalizedMetrics `position` impression-weighted)
- algorithm: moving-average (windowDays=7) + threshold
- detectorOutput·이벤트 매핑 § 3.4

### 4.2 keywordImpressions — 노출수 변동 (F-10 zero baseline 처리)

- algorithm: delta-percentage
- **zero baseline 처리** (`zeroBaselinePolicy` enum — KM2-07: 2종만 허용):
  - `"first-observed"` (기본): baseline=0 + observed ≥ `firstObservedSpikeThresholdImpressions`(기본 100) → `direction="first-observed-spike"` (severity=info). deltaPercentage=null
  - `"hold"`: baseline=0 시 anomaly 생성 안 함 (관측만)
- 정상: baseline > 0 + |delta| ≥ threshold → spike/drop

### 4.3 keywordCTR — z-score (F-10 정확화)

- algorithm: zscore
- 전제: impressionsInWindow ≥ `minImpressionsForCtrEval`(100) **AND** `baselineDaysUsed ≥ minBaselineDays`(7) **AND** `baselineVariance ≥ minVariance`(0.0001)
- 전제 미충족 → anomaly 미발생 + hold (warning 표시)
- direction:
  - observedCtr > baselineCtr + threshold → `ctr-up` (severity=info)
  - observedCtr < baselineCtr - threshold → `ctr-down` (severity=warning)
- 알림은 `ctr-down`만 (`ctr-up`은 AnomalyRecord 저장만, 매트릭스 enqueue 미적용 — § 6.1 정책)

**ctr-up dashboard 표시 규칙** (KM2-08):
- `queryKeywordSignals` 응답의 `anomaliesInWindow[]`에 `direction="ctr-up"` anomaly도 포함 (severity=info)
- 대시보드 client는 `notify=false` 표식을 시각적으로 구분 (예: tag "기록만 — 알림 없음")
- 운영자 filter: `severity=info AND signal=keywordCTR AND direction=ctr-up` 별도 필터 권장

### 4.4 keywordRankBucketTransition

search-visibility § 4.3 state transition table 동일 + KeywordRankBucketState로 dedupe.

---

## 5. source 어댑터

### 5.1 analytics-derived (필수) — queryNormalizedMetrics 호출 (F-3·F-4)

```ts
queryNormalizedMetrics({
  instanceId,
  dimensions: ["date", "query", "source", "device", "country"],   // F-4 device·F-3 country 추가
  metrics: ["impressions", "clicks", "ctr", "position"],
  filters: [
    { dimension: "query", op: "in", value: trackedKeywords },
    { dimension: "device", op: "equals", value: target.device },
    { dimension: "country", op: "equals", value: target.country },
  ],
  sourceFilter: SEARCH_ENGINE_TO_ANALYTICS_SOURCE[target.searchEngine],  // KM2-09 명시 매핑
  windowStart, windowEnd
});
```

- query → KeywordTrackingTarget 매핑은 (keyword + country + device + searchEngine) 기준 — queryHash 일치 검증
- source별 분리 row (sourceFilter 단일 source 호출). KeywordSignalSnapshot.sourceUsed에 분리 저장

#### 5.1.1 `SEARCH_ENGINE_TO_ANALYTICS_SOURCE` 매핑 테이블 (KM2-09 — 명시 + exhaustive build validation)

```ts
const SEARCH_ENGINE_TO_ANALYTICS_SOURCE: Record<KeywordTrackingTarget["searchEngine"], AnalyticsSource[]> = {
  google: ["gsc"],
  naver: ["naver-search-advisor"],
  // 신규 enum 추가 시 본 테이블 + searchEngine enum 동시 cascade. 미추가 시 build fail
};
```

- **canonical 검색엔진 enum SoT** (KMF3-06): KeywordTrackingTarget.searchEngine enum = 본 Feature 패키지가 canonical SoT
- **cross-Feature build validation** (KMF3-06): 빌드 시 다음 3개 집합 정합 검증 (불일치 시 build fail):
  - 본 Feature `KeywordTrackingTarget.searchEngine` enum
  - 본 Feature `SEARCH_ENGINE_TO_ANALYTICS_SOURCE` 키 집합
  - search-visibility `SerpCrawlerApprovedScope.searchEngines` 허용 enum (DATA_MODEL C-08 v0.16 SoT)
- 신규 검색엔진 추가는 3개 모두 동시 cascade MAJOR 변경
- analytics-reporting source가 없는 검색엔진 (예: Bing — naver/google 외) — v1.0/v1.x에서 build fail or unsupported로 처리 (KM-05 다국어 후속 cascade 영역)

### 5.2 serp-crawler (v1.0 미지원 — F-13)

- v1.0은 `serpCrawler.enabled=true` build fail
- v1.x에서 다음 중 결정 후 활성:
  - 옵션 A: search-visibility SerpCrawlerArtifact 공용 + targetKind discriminator
  - 옵션 B: KeywordMonitoringSerpArtifact 별도 테이블 신설 (9번째 table)
- KM-14 후속

---

## 6. 알림 (outbox 패턴)

### 6.1 NotificationEventType 매트릭스 (8종 cascade 완료 — F-1)

| eventType | anomalySeverity | notificationCriticality (REVIEW_WORKFLOW § 9.1.1) | outbox enqueue |
|---|---|---|---|
| `keyword-monitoring-rank-improved` | info | normal | ✅ |
| `keyword-monitoring-rank-dropped` | warning (critical when streak≥SLA) | high | ✅ |
| `keyword-monitoring-impressions-spike` | info | normal | ✅ |
| `keyword-monitoring-impressions-drop` | warning | high | ✅ |
| `keyword-monitoring-ctr-anomaly` (direction=ctr-down) | warning | high | ✅ |
| `keyword-monitoring-ctr-anomaly` (direction=ctr-up) | info | (매트릭스 미포함 — 발송 안 함) | ❌ (AnomalyRecord 저장만) |
| `keyword-monitoring-rank-bucket-improved` | info | normal | ✅ |
| `keyword-monitoring-rank-bucket-dropped` (worse) | warning | high | ✅ |
| `keyword-monitoring-rank-bucket-dropped` (→ absent) | critical | critical | ✅ |
| `keyword-monitoring-monitoring-failed` | (anomaly 아님 — operational) | high | ✅ (별도 outbox sourceKind="monitoring-log") |

> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류

### 6.2 발송 흐름 — KeywordAnomalyNotificationOutbox 패턴

search-visibility § 7.2·§ 7.3 SQL 패턴 동일. 차이점:
- **outbox sourceKind/sourceId 일반화** (F-6 + KM2-03 정정):
  - sourceKind="anomaly" + sourceId=anomalyRecordId (대다수 이벤트)
  - sourceKind="monitoring-log" + sourceId=monitoringLogId (monitoring-failed 이벤트)
  - sourceKind="rank-bucket-transition" + sourceId=**transitionEventId** (KM2-03 — 각 transition별 고유 ID. KeywordRankBucketState.lastTransitionEventId와 동일 식별자. AnomalyRecord 생성과 별개로 outbox row 생성 가능)
- UNIQUE constraint: `UNIQUE(sourceKind, sourceId, eventType)` (단일 source·eventType별 1 outbox 1건. rank-bucket-transition은 transition별 별도 sourceId라 동일 target의 후속 transition도 정상 enqueue)

**transitionEventId 산정** (KM2-03 + KMF3-02 원자성·deterministic):
- `transitionEventId = hash("rank-bucket-transition:" + keywordTargetId + previousBucket + currentBucket + transitionDate + rankBucketConfigVersion)`
- `transitionDate`는 **logical date** (해당 cycle의 windowEnd ISO date, 실행 wall-clock 아님) — KMF3-02 deterministic 보장
- 동일 transition 재호출 시 동일 ID — idempotent

**원자성** (KMF3-02 — state + outbox 단일 transaction):
```
1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
   - acquire 실패 시 → **idempotent no-op + early exit** (다른 worker가 이미 처리 중). retryable error 아님 (KMF4-04)
2. KeywordRankBucketState SELECT (현재 state)
3. detect transition (previousBucket != currentBucket)
4. transitionEventId 산정 (deterministic — § 6.2 산식)
5. 단일 DB transaction:
   a. KeywordRankBucketState UPDATE — `WHERE keywordTargetId=? AND lastTransitionEventId IS DISTINCT FROM ?`로 compare-and-set
      (값이 이미 새 transitionEventId면 다른 worker가 처리 — abort, idempotent no-op)
   b. KeywordAnomalyNotificationOutbox INSERT (sourceKind="rank-bucket-transition", sourceId=transitionEventId)
      UNIQUE(sourceKind, sourceId, eventType) 위반 시 → 다른 worker 처리 → abort, idempotent no-op
   c. commit
6. advisory lock release
```
- 동시 detector 또는 forceRefresh — advisory lock + compare-and-set + UNIQUE 3중 보호로 중복 enqueue 차단

### 6.3 NotificationEvent 필드 매핑

| eventType | contentRef | contentTitle | metadata 필수 필드 |
|---|---|---|---|
| `keyword-monitoring-rank-improved/-dropped` | `anomalyRecordId` | `"키워드 순위 ${direction} — ${keyword}"` | signal·keywordTargetId·keyword·country·device·searchEngine·detectedAt·detectorOutput·streakDays |
| `keyword-monitoring-impressions-spike/-drop` | `anomalyRecordId` | `"키워드 노출 ${direction} — ${keyword}"` | 동일 |
| `keyword-monitoring-ctr-anomaly` | `anomalyRecordId` | `"키워드 CTR ${direction} — ${keyword}"` | 동일 |
| `keyword-monitoring-rank-bucket-improved/-dropped` | `keywordTargetId` (state transition은 anomaly와 별개) | `"키워드 rank bucket ${direction} — ${keyword}"` | signal·keywordTargetId·keyword·previousBucket·currentBucket·previousRank·currentRank·rankBucketConfigVersion·direction·streak |
| `keyword-monitoring-monitoring-failed` | `"instance:" + instanceId` (synthetic) | `"키워드 모니터링 cycle 실패 (${date})"` | monitoringLogId·failedSources[]·detectedAt |

- `sourceEventId = hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` — policy 버전 미포함 (search-visibility 동일 정책)
- `recipients`: REVIEW_WORKFLOW § 9.1.1 매트릭스 — operator + client-approver
- `criticality`: 매트릭스 SoT

### 6.4 retroactive command (search-visibility § 7.5 패턴 동일)

§ 3.1 `enqueueOutboxForExistingAnomalies` — super-admin 전용·dryRun 기본 true·audit `keyword-monitoring-retroactive-enqueue-requested`

### 6.5 mode 변경 정책

search-visibility § 7.5 동일 — monitor-only → alerting 시 retroactive 발송은 명시 command만.

---

## 7. dedupe 정책 (signal별 분리 — F-11)

| signal | dedupe 주체 | 비고 |
|---|---|---|
| keywordRank | **anomaly suppression ledger** | key=hash(instanceId+signal+keywordTargetId+severity+keywordMonitoringPolicyVersion) |
| keywordImpressions | **anomaly suppression ledger** | 동일 |
| keywordCTR | **anomaly suppression ledger** | 동일 |
| keywordRankBucketTransition | **KeywordRankBucketState** (transition + lastTransitionEventId) | state 전이 dedupe로 자연 처리. ledger 미적용 |

**ledger 적용 룰** (search-visibility § 6.3 패턴):
- suppress 조건: 동일 key의 KeywordAnomalyRecord 중 `resolutionStatus="open"` + `detectedAt > now() - suppressHours` 존재 → 신규 anomaly 생성 skip
- severity escalation (warning → critical)은 별도 anomaly로 처리 (key에 severity 포함)
- false-positive resolve 후 재발생은 새 anomaly 생성 (open 조건 미충족)

---

## 8. 운영 지표

### 8.1 핵심 지표

v0.1 § 8.1 유지.

### 8.2 alert (외부 sink — F-14 drift alert 분리)

- 모니터링 성공율 < 95% / 24h
- 추적 키워드 개수 ≥ maxKeywordsPerInstance 90% (warning)
- **DB drift 또는 manual import로 active count > maxKeywordsPerInstance 감지** (critical — 정상 registerKeyword 경로로는 발생 불가)
- anomaly 발견율 평소 대비 2배 spike
- outbox dispatch-failed-permanent 발생

---

## 9. KeywordAnomalyRecord 운영 흐름

search-visibility § 9 패턴 동일. resolutionStatus 5종 (open·true-positive·false-positive·resolved·ignored). 권한: operator·super-admin. audit log: `keyword-anomaly-resolution-updated` (REVIEW_WORKFLOW § 10.2.1 cascade 완료).

---

## 10. 설치·설정·운영 모드

v0.1 § 10 유지.

---

## 10.3 migration·backfill 정책 (KM2-04)

본 Feature는 v0.1 초안과 v0.2/v0.3 정규화 사이 데이터 모델 변경이 있음 — v1.0 이전 운영 데이터가 있는 인스턴스는 다음 migration 적용:

- **targetSearchEngines 배열 → searchEngine 단일** (v0.2 KM-09 정정):
  - 기존 배열 row를 검색엔진별로 분해 (1 row → N rows, N=배열 길이)
  - 각 row에 새 UUID 부여. 기존 target ID는 첫 검색엔진 row가 승계 (snapshot·anomaly FK 보존)
  - 분해된 row 중복 (keyword+country+device+searchEngine) 발생 시 → 가장 최근 registeredAt 우선, 나머지 active=false 처리
- **queryHash 재계산**: 새 산식 `SHA-256(keyword + country + device + searchEngine)` 적용 후 backfill
- **KeywordSignalSnapshot·KeywordAnomalyRecord FK 승계**:
  - 첫 분해 row가 기존 keywordTargetId 승계 → 기존 snapshot/anomaly 그대로 사용
  - 나머지 신규 row는 본 migration 시점 이후 snapshot만 누적
- **migration 운영**:
  - 운영자 명시 액션 `migrateKeywordTrackingTargetsV02toV03(instanceId, dryRun)` (super-admin 전용)
  - dryRun=true: 영향 row 목록 반환
  - dryRun=false: 실제 분해 + audit log `keyword-tracking-target-migrated-v02-v03` (KMF3-01 — **v1.0 cascade 완료**. REVIEW_WORKFLOW § 10.2.1 AuditAction enum 추가)
  - audit contract: contentRef=`"instance:" + instanceId`, metadata={
       fromVersion: "v0.2",
       toVersion: "v0.3",
       decompositions: Array<{
         fromTargetId: string,                          // 원본 target id
         fromTargetSearchEngines: ("naver"|"google")[], // 원본 row의 검색엔진 배열 (분해 전 상태 보존)
         toTargets: Array<{                             // KMF5-03 — 1:1 lossless 매핑
           targetId: string,
           searchEngine: "naver" | "google",
           inheritedOriginalId: boolean,                 // true면 fromTargetId 승계 row (첫 검색엔진)
           activeAfter: boolean                          // migration 후 active 상태
         }>
       }>,
       conflictResolutions: Array<{
         conflictTuple: {keyword, country, device, searchEngine},
         winningTargetId: string,                   // registeredAt 최신 우선
         deactivatedTargetIds: string[]             // active=false 처리된 row
       }>,
       actorId: string,
       actorRole: "super-admin"
     } — KMF4-02 lossless 정합

신규 인스턴스(v0.3 이후 만들어진 인스턴스)는 본 migration 불필요.

---

## 11. 빌드·런타임·migration 검증 (KMF3-07 — 3분리)

### 11.1 build-time fail

- `enabled=true` + `keywordMonitoringConfig` 누락
- `keywordMonitoringPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- `requiresFeature: analytics-reporting` 충족 안 됨
- `mode="alerting"` + `notifications` 비활성
- **`serpCrawler.enabled=true`** (v1.0 미지원 — F-13)
- `signals.*` 모두 비활성
- `signals.keywordRank.algorithm !== "moving-average"` (v0.2 enum 한정 — F-9)
- `keywordTargetSource.maxKeywordsPerInstance` < 1
- `signals.keywordRank.improvementThresholdRank`·`dropThresholdRank` < 1
- `signals.keywordCTR.minImpressionsForCtrEval` < 1
- `signals.keywordCTR.minBaselineDays` < 1 또는 `minVariance` < 0
- `signals.keywordImpressions.zeroBaselinePolicy` enum 외 값 (KM2-07 — `first-observed`·`hold`만 허용)
- `signals.keywordImpressions.firstObservedSpikeThresholdImpressions` < 1 (zeroBaselinePolicy="first-observed" 시)
- KeywordTrackingTarget.searchEngine enum vs `SEARCH_ENGINE_TO_ANALYTICS_SOURCE` 키 집합 불일치 (KM2-09 exhaustive build validation)
- **cross-Feature 검색엔진 enum drift** (KMF3-06): KeywordTrackingTarget.searchEngine vs SerpCrawlerApprovedScope.searchEngines 허용 집합 불일치
- **KeywordTrackingTarget partial unique index 또는 generated column fallback 스키마 누락** (KMF3-07 — DBMS 종속)
- **REVIEW_WORKFLOW § 10.2.1 AuditAction enum에 5종(register/unregister/resolution/retroactive/migrated) 모두 포함 검증** (KMF3-07 — runtime audit insert 실패 방지)

### 11.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락 또는 빈 문자열
- `registerKeyword` 시 active 개수 ≥ maxKeywordsPerInstance
- `registerKeyword` 시 (keyword + country + device + searchEngine) **active 1건 이미 존재** (KMF3-03 — inactive 존재는 정상 reactivate 경로)

### 11.3 migration-time validation (KMF3-07)

`migrateKeywordTrackingTargetsV02toV03` 실행 시 다음 검증:
- 분해된 row 중복 충돌 시 deterministic resolution (가장 최근 registeredAt 우선) — 미적용 시 fail
- queryHash 재계산 결과가 기존 row와 불일치하지만 동일 logical target일 가능성 — 운영자 검토 prompt
- migration 후 active KeywordTrackingTarget 수가 maxKeywordsPerInstance 초과 — **migration-time fail** (preflight dryRun에서 감지. 운영자 명시 정리 후 dryRun=false 재실행 필요)

### 11.4 runtime invariant·reconcile (KMF4-05 — § 11.2와 분리)

호출 입력 검증 아닌 운영 invariant — 감지 시 reconcile job 트리거 + 외부 sink alert:

- **rank-bucket transition 원자성 invariant**: KeywordRankBucketState.lastTransitionEventId 갱신과 KeywordAnomalyNotificationOutbox(sourceKind="rank-bucket-transition") insert가 단일 transaction 외부에서 발생한 sequence 감지 (예: state만 갱신·outbox row 부재 또는 그 반대) → reconcile job 트리거
- **outbox dispatch-failed-permanent 누적** > 임계 → 운영팀 알림
- **stale processing 감지** (큐별 구분 — KMF5-04):
  - `KeywordMonitoringCollectionRetryQueue.lockedAt > 10분` → reconcile worker가 status=pending 복귀
  - `KeywordAnomalyNotificationOutbox.claimedAt > 5분` (§ 6.2 outbox SQL 정합) → 재claim

### 11.5 warning

- `monitoringSchedule.daily` ≤ analytics-reporting·search-visibility 이전
- `signals.keywordCTR.enabled=true` + `signals.keywordImpressions.enabled=false` (baseline impressions 데이터 부족 가능)
- active KeywordTrackingTarget 수 ≥ maxKeywordsPerInstance × 0.9

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| KM-01 | keywordTargetSource `analytics-derived auto-suggest` 추가 (v1.x — search-visibility 패턴 응용) | v1.x |
| KM-02 | KeywordSignalSnapshot 시계열 압축 | 운영 누적 후 |
| KM-03 | 키워드별 SLA·우선순위 (브랜드 키워드 우선) | 운영 정책 |
| KM-04 | 카테고리별 anomaly 묶음 발송 | M2+ |
| KM-05 | 다국어 키워드 (영문·일문) 추적 + analytics-reporting QueryDimension `searchEngine`·`locale` 확장 cascade | M3+ |
| KM-06 | KeywordTargetGroup bulk management (locale·device·searchEngine 변형 일괄 등록) | v1.x |
| KM-07 | `keywordRank.algorithm="ewma"` 산식·warmup·결측·hold 정의 | v1.x |
| KM-14 | serp-crawler 활성 — KeywordMonitoringSerpArtifact 신설 vs SerpCrawlerArtifact 공용 결정 (v1.0은 enabled=true build fail) | v1.x |
| KM-15 | search-visibility 중복 anomaly 대시보드 묶음 표시 | UI 운영 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~KM-08~~ | locale → country 매핑 | v0.2 — analytics-reporting QueryDimension `country` 정합 (F-3) |
| ~~KM-09~~ | targetSearchEngines 배열 vs 단일 | v0.2 — KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 포함 (F-5) |
| ~~KM-10~~ | maxKeywordsPerInstance 초과 정책 | v0.2 — registerKeyword runtime fail + drift alert 분리 (F-14) |
| ~~KM-11~~ | EWMA 산식 정의 | v0.2 — moving-average만 enum 허용. EWMA는 KM-07 후속 |
| ~~KM-12~~ | `keyword-anomaly-resolution-updated` audit cascade | v0.2 — REVIEW_WORKFLOW § 10.2.1 cascade 완료 |
| ~~KM-13~~ | `keyword-monitoring-retroactive-enqueue-requested` audit cascade | v0.2 — REVIEW_WORKFLOW § 10.2.1 cascade 완료 |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB 8 tables)

### 13.1 `KeywordTrackingTarget`

§ 3.2 shape.

**Constraints** (KM2-02 — soft delete 재등록 가능):
- **partial unique index** — `UNIQUE(instanceId, keyword, country, device, searchEngine) WHERE active=true` (PostgreSQL 기준)
- inactive row는 unique 제약 외부 — 동일 tuple inactive 다수 보존 가능 (감사 추적)
- 다른 DBMS는 generated column `activeKey = CASE WHEN active=true THEN 1 ELSE NULL END` + `UNIQUE(instanceId, keyword, country, device, searchEngine, activeKey)` (notifications DLQ partial unique 패턴 동일)

**재등록 정책** (KM2-02 + KMF3-03 동시성):

```
1. advisory lock acquire (hash(instanceId, keyword, country, device, searchEngine))
2. 동일 (instanceId, keyword, country, device, searchEngine, active=true) 검사:
   - 1건 존재 → runtime fail `keyword-already-active` (UNIQUE 위반)
3. 동일 tuple inactive row 검사:
   - 0건 → 신규 row INSERT (active=true)
   - 1건+ → 가장 최근 row(`ORDER BY registeredAt DESC, id ASC LIMIT 1`)를 reactivate:
     UPDATE WHERE id=? SET active=true, registeredAt=now(), registeredBy=actor
     기존 queryHash·snapshot/anomaly FK 보존 (target ID 동일 유지)
4. advisory lock release
```

- KMF3-03 — deterministic order (`registeredAt DESC, id ASC`)로 다중 inactive 중 동일 row 선택 보장
- runtime validation fail (§ 11.2) — "동일 tuple **active** 1건 이미 존재" 시만. inactive 다수는 정상 (reactivate path)

**Index**: `(instanceId, active)`, `(instanceId, category)`.

### 13.2 `KeywordSignalSnapshot`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `keywordTargetId` | UUID | ✅ — FK |
| `signal` | KeywordSignal | ✅ |
| `date` | Date | ✅ |
| `value` | number | ✅ |
| `metadata` | JSON | optional |
| `sourceUsed` | enum (analytics-derived) | ✅ |
| `analyticsSource` | enum (gsc·naver-search-advisor) | ✅ — target.searchEngine별 분리 |
| `country`·`device` | string·enum | ✅ |
| `qualityTier` | enum (normal·degraded) | ✅ |
| `dataCompleteness` | number | ✅ |
| `ingestedAt`·`expiresAt` | Date | ✅ |

**Constraints**: `FK keywordTargetId ON DELETE RESTRICT`. `UNIQUE(keywordTargetId, signal, date)` (target별 일자 1개 row — searchEngine은 target에서 결정)
**Index**: `(instanceId, signal, date)`, `(keywordTargetId, signal, date)`, `(expiresAt)`.

### 13.3 `MonitoringLog`

search-visibility § 13.3 패턴 동일 + `keywordMonitoringPolicyVersion` 포함.

### 13.4 `MonitoringSourceAttempt` (search-visibility § 13.4 패턴 동일)

> § 13.8 별도 정의 없음 (F-16 중복 정리 — 본 § 13.4가 유일 정의).

### 13.5 `KeywordMonitoringCollectionRetryQueue` (search-visibility § 13.5 패턴 동일)

worker SoT 쿼리·SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant — search-visibility § 13.5 SQL 동일.

### 13.6 `KeywordAnomalyRecord`

v0.1 § 13.5 유지. detectorOutput shape 정합 (§ 3.4) + metadata에 `correlatedSearchVisibilityAnomalyId` optional 필드 추가 (§ 0.1).

### 13.7 `KeywordRankBucketState`

v0.1 § 13.6 유지.

### 13.8 `KeywordAnomalyNotificationOutbox` (F-6 일반화)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (`anomaly`·`monitoring-log`·`rank-bucket-transition`) | ✅ — KMF4-01 정정 (rank-bucket-state → rank-bucket-transition) |
| `sourceId` | string | ✅ — sourceKind별 식별자. `anomaly` 시 anomalyRecordId(UUID), `monitoring-log` 시 monitoringLogId(UUID), `rank-bucket-transition` 시 transitionEventId(deterministic hash string — § 6.2) |
| `eventType` | NotificationEventType | ✅ |
| `sourceEventId` | string | ✅ — `hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` |
| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
| `claimedAt`·`dispatchedAt` | Date | optional |
| `attempts` | integer | ✅ |
| `lastError` | string | optional |
| `notificationEventId`·`notificationReceiptState` | string | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)` (F-6 — sourceKind·sourceId·eventType별 1 outbox row).
**Index**: `(claim, claimedAt)`.

---

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (18 지적 전건 수용)
| 2026-05-14 | v0.3 | codex 2차 (9 지적 전건 수용)
| 2026-05-14 | v0.4 | codex 3차 (7 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (6 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
