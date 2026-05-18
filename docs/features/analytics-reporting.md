# Feature — analytics-reporting

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 8개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 11 / `docs/core/SEARCH_STANDARDIZATION.md` § 6.3, § 7.3
> **목적**: GSC·네이버 서치어드바이저·GA4·자체 RUM 외부 분석 도구 연동, 데이터 수집·정규화·캐시, 자동 리포트 생성·발송, 다른 Feature 데이터 인터페이스, 의료법 일평균 이용자 10만 측정 기록(MA-02). hysteresis 상태 저장 + 워크플로 명시 API 호출.
> **연관 문서**:
> - 측정 이벤트 SoT → `core/SEARCH_STANDARDIZATION.md` § 6.3·§ 6.3.1·§ 7.3
> - 분석 자격증명 SoT → `core/DATA_MODEL.md` C-08 `analyticsConfig`
> - ComplianceRecord 측정 슬롯 SoT → `core/DATA_MODEL.md` C-10 `mediaThresholdAssessment`
> - 법정 매체 분류 워크플로 SoT → `admin/REVIEW_WORKFLOW.md` § 8.1.1 + `enqueueMediaThresholdReassessment()` API
> - 리포트 발송 SoT → `features/notifications.md` notify() + REVIEW_WORKFLOW § 9.1.1

---

## 0. 한 페이지 요약

- **Feature 식별자**: `analytics-reporting`
- **핵심 책임**: 외부 source 수집(idempotent + force refresh)·정규화·캐시·queryNormalizedMetrics read API·리포트 생성·발송(notify)·임계 측정(hysteresis 상태 저장)·workflow 명시 API 호출 + ComplianceRecord snapshot provider
- **데이터 source 4종**: gsc·naver-search-advisor·ga4·rum. source별 `availabilityLagDays` 정의
- **idempotency**:
  - sources 입력 canonicalization — undefined는 manifest 활성 source sorted 전체 (AR2-01)
  - `forceRefresh` + `refreshIntentId` 입력으로 명시 재수집 분기 (AR2-02)
  - CollectionLog는 envelope 1건, 상태는 `CollectionSourceAttempt` per-source 분리 (AR2-03)
- **임계 측정**: `MediaThresholdState` 별도 테이블에 현재 상태·streak·last transition event 보존 (AR2-06)
- **법정/운영 분리**: rolling-90 = 운영 조기경보(이벤트 발송 + workflow API 호출), previous-3-months-calendar = 법정 산정(legal 검수자 ComplianceRecord 확정 기록). **priorReviewRequired 산정에는 calendar만 사용** (AR2-08)
- **ComplianceRecord 갱신 주체** (AR2-09): 본 Feature는 **snapshot provider만**. 직접 record 수정 금지. REVIEW_WORKFLOW `enqueueMediaThresholdReassessment()` API에 snapshot 전달, 워크플로가 pre-publish record 생성
- **workflow 명시 API** (AR2-10): 임계 전이 시 `enqueueMediaThresholdReassessment()` 호출 → notify는 결과 알림만
- **DB 인벤토리**: **12 tables** — Raw·Normalized·CollectionLog·CollectionSourceAttempt·ReportInstance·DailyUserMeasurement·MediaThresholdState·CollectionRetryQueue·DsrDeletionLog·MediaThresholdReassessmentDispatchOutbox·AnalyticsRedactionAudit·AnalyticsApiCallLog (AR4-15 정정)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | SEARCH_STANDARDIZATION § 6.3·§ 7.3 cascade |
| 데이터 source 추가 | MINOR | C-08 `AnalyticsConfig` cascade |
| 데이터 source 제거 | **MAJOR** | dependent Feature 영향 |
| 정규화 스키마 변경 | **MAJOR** | DB 마이그레이션 + queryNormalizedMetrics 소비자 영향 |
| `queryNormalizedMetrics` 계약 변경 | **MAJOR** | |
| 임계 측정 알고리즘·hysteresis 변경 | **MAJOR** | MA-02 운영 영향 + 클라이언트 고지 |
| 캐시·dedupe 정책 변경 | **MAJOR** | |
| **build-time fail 룰 추가·강화** | **MAJOR** | 인스턴스 배포 차단 영향 |
| **runtime validation fail 룰 추가·강화** | **MAJOR** | 호출자 영향 |
| **warning → fail 승격** | **MAJOR** | 기존 인스턴스 영향 |
| **warning 룰 추가** | MINOR | (PATCH도 가능 — 단순 알림 추가 시) |
| 운영 지표 항목 추가 | PATCH | |

### 1.2 SoT 원칙

- 측정 이벤트·PII 규약 SoT는 `core/SEARCH_STANDARDIZATION.md` § 6.3·§ 6.3.1
- 외부 source 자격증명 SoT는 `core/DATA_MODEL.md` C-08 `analyticsConfig`
- ComplianceRecord MediaThresholdAssessment 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10
- 임계 전이 시 워크플로 트리거 SoT는 `admin/REVIEW_WORKFLOW.md` § 8.1.1 `enqueueMediaThresholdReassessment()`
- 리포트 발송 SoT는 `features/notifications.md` notify()
- **다른 Feature read API SoT**: 본 문서 § 3.4 `queryNormalizedMetrics` only
- 본 문서 = **수집·정규화·캐시·리포트·임계 측정 운영 SoT** + **내부 데이터 구조 SoT** (§ 14)

### 1.2.1 공통 retry taxonomy (AR4-07)

본 Feature는 3종 retry 구조를 가진다 — CollectionRetryQueue·ReportInstance outbox·MediaThresholdReassessmentDispatchOutbox. 공통 의미 통일:

| 개념 | 의미 |
|---|---|
| `attempts` / `attemptNumber` | 누적 시도 횟수 (성공·실패 무관) |
| `maxAttempts` | 자동 재시도 상한 (기본 3~5) |
| `claimedAt` timeout | worker claim 후 N분(기본 5분) 내 commit 없으면 reconcile worker가 재claim |
| `*-retryable` | 자동 재시도 큐 대상 (attempts < maxAttempts) |
| `*-permanent` | maxAttempts 소진 또는 비재시도성 오류 — 운영자 수동 replay 필요 |
| `manual replay` | 운영자가 명시 액션으로 새 attempt 생성 (forceRefresh·resendDeadLetter 등) |

각 큐별 구현은 § 4.3·§ 7.2·§ 7.3.2 표 참조. 운영 지표(§ 9.1)와 alert(§ 9.3)는 본 taxonomy를 따른다.

**큐별 maxAttempts SoT** (AR5-03 — 5차 사이클 마감 시 명시):

| 큐 | maxAttempts | 출처 |
|---|---|---|
| CollectionRetryQueue | `config.collectionRetryQueue.maxAttempts` (기본 3) — 인스턴스별 설정 가능 |
| ReportInstance outbox | **상수 5** (configurable 아님 — 운영 단순성) |
| MediaThresholdReassessmentDispatchOutbox | **상수 5** |

두 outbox의 maxAttempts는 상수 고정 (config 슬롯 없음). build validation은 maxAttempts 설정 누락이 아닌 `claim` enum 값·`attempts` 컬럼 존재만 검사.

### 1.3 본 문서가 다루지 않는 영역

- 측정 이벤트 표준 정의 — SEARCH_STANDARDIZATION § 6.3
- 리포트 발송 채널·재시도 — notifications
- 일평균 이용자 법적 판정 - REVIEW_WORKFLOW § 8.1.1
- keyword·search-visibility 알고리즘 - 후속 Feature

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "analytics-reporting"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: true
```

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `core/SEARCH_STANDARDIZATION.md` § 6.3 | PerformanceEvent·PageViewEvent·ConversionEvent |
| `core/SEARCH_STANDARDIZATION.md` § 6.3.1 | PII 처리 규약 |
| `core/DATA_MODEL.md` C-08 | `analyticsConfig` + features[] |
| `core/DATA_MODEL.md` C-10 | ComplianceRecord `mediaThresholdAssessment` 슬롯 |
| `admin/REVIEW_WORKFLOW.md` § 8.1.1 | `enqueueMediaThresholdReassessment()` command API |
| `admin/REVIEW_WORKFLOW.md` § 9.1.1 | NotificationEventType 3종 매트릭스 |
| `features/notifications.md` | notify() 발송 |
| `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 4 | MA-02 |

### 2.3 InstanceManifest 통합

```yaml
analyticsConfig:                                       # C-08 SoT (자격증명·식별자만)
  sources:
    gsc: { enabled: true, serviceAccountSecretRef: "secretRef://...", propertyUrl: "sc-domain:..." }
    naverSearchAdvisor: { enabled: true, apiKeySecretRef: "secretRef://...", siteUrl: "..." }
    ga4: { enabled: true, propertyId: "G-...", serviceAccountSecretRef: "secretRef://..." }
    rum: { enabled: true, endpoint: "/api/rum/events" }

analyticsPolicyVersion: "ar-2026-05-14"                # AR4-01 — C-08 v0.15 신규. 패키지 병렬 보관 + manifest opt-in. notifications policyVersion 패턴 동일

features:
  - name: "analytics-reporting"
    version: "0.3.0"
    enabled: true
    requiresFeature:
      - notifications                                  # reportTemplates.delivery 활성 시
    config:
      collectionSchedule:
        daily: "03:00"
        timezonePolicy:                                # AR2-22
          missedRunCarryOverMaxDays: 7
          dstNonexistentLocalTime: "next-valid"        # 봄 spring-forward 시 다음 유효 시각
          dstAmbiguousLocalTime: "first"               # 가을 fall-back 시 첫 발생
      sourceAvailabilityLag:
        gsc: { availabilityLagDays: 3, backfillReprocessDays: 5 }
        naverSearchAdvisor: { availabilityLagDays: 1, backfillReprocessDays: 3 }
        ga4: { availabilityLagDays: 1, backfillReprocessDays: 3 }
        rum: { availabilityLagDays: 0, backfillReprocessDays: 0 }
      retentionDays:
        raw: 90
        normalized: 730
        rawRedactionAuditTrail: 1095
      rawPayloadStorage:                               # AR2-13 — allowlist는 항상 required, storage 자체는 별도 토글
        enabled: true                                  # raw payload 저장 자체 활성
      reportTemplates:
        - id: "weekly-summary"
          enabled: true
          delivery: { enabled: true, artifactOnly: false }
          schedule:                                    # AR2-23 grammar
            type: "weekly"                             # weekly·monthly·daily
            dayOfWeek: "MON"                           # weekly 시 (MON|TUE|...|SUN)
            time: "09:00"
          recipientRoles: ["operator", "client-approver"]
        - id: "monthly-medical-ad-traffic"
          enabled: true
          delivery: { enabled: true, artifactOnly: false }
          schedule:
            type: "monthly"
            dayOfMonth: "1st"                          # monthly 시 (1st|last|N)
            time: "09:00"
          recipientRoles: ["client-approver", "operations"]
      mediaThresholdMeasurement:
        enabled: true
        thresholdDailyUsers: 100000
        operationalWindow:
          calendarPolicy: "rolling-90-days"
          measurementWindowDays: 90
        hysteresis:
          enterAfterConsecutiveDays: 7
          exitAfterConsecutiveDays: 30
        primarySource: "ga4"
        botFilteringPolicyId: "ga4-default-2026"
        measurementAlgorithmVersion: "v1"              # AR2-07 audit 추적
      rateLimit:                                       # bucket scope 명시
        bucketBackend: "redis-token-bucket"
        # AR3-19 — bucketKey 형식 SoT:
        #   credential-global: `ar:quota:{provider}:{credentialHash}`  (예: ar:quota:gsc:a3f2b1c4)
        #   instance-isolated: `ar:quota:{provider}:{instanceId}`
        # credentialHash = SHA-256(secretRef 참조값) 8자 prefix. secretRef rotation 시 새 hash → 새 bucket
        bucketKeyStrategy:
          gsc: "credential-global"                     # GSC service account 단위 글로벌 (multi-instance 공유 service account quota 보호)
          ga4: "credential-global"
          naverSearchAdvisor: "instance-isolated"
          rum: "instance-isolated"
        gsc: { tokensPerHour: 200, burst: 50 }
        ga4: { tokensPerHour: 1000, burst: 200 }
        naverSearchAdvisor: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true                      # 429 Retry-After ≥ backoff 시 Retry-After 우선
      collectionRetryQueue:
        maxAttempts: 3
        backoffSeconds: [60, 300, 1800]
        workerPollIntervalSeconds: 30
      pii:
        ga4CustomFieldAllowlist:                       # AR2-11 — eventParameters·customDimension·customMetric 명시 등록 필요
          customDimensions: []                          # 빈 배열 = 모두 drop
          customMetrics: []
          eventParameters: []
        consent:
          dsrDeletionAccepted: true
          dsrDeletionSlaDays: 30
          subjectMatchingPolicy: "not-applicable"      # AR2-12 — aggregated 데이터 매칭 불가. raw incident 대응만 별도
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 2종 + read API

| 종류 | 함수 | 책임 |
|---|---|---|
| 실행 command | `runCollection(input)` | 외부 source 수집 |
| 실행 command | `generateReport(input)` | 리포트 생성·발송 |
| read API SoT | `queryNormalizedMetrics(input)` | 정규화 데이터 조회 (다른 Feature) |

### 3.2 CollectionInput·Result + idempotency·force refresh

```ts
type CollectionInput = {
  instanceId: Slug;
  sources?: AnalyticsSource[];          // undefined → 활성 source 전체 정렬 사용 (AR2-01 canonicalization)
  windowStart: ISODateString;
  windowEnd: ISODateString;
  mode: "scheduled" | "on-demand";
  forceRefresh?: boolean;                // AR2-02 — 같은 window 강제 재수집
  refreshIntentId?: string;              // forceRefresh=true 시 required — 새 lineage 식별자
  idempotencyKey?: string;
};

// idempotencyKey 산정:
//   canonicalSources = sources?.length > 0 ? sources.sort() : sortedActiveAnalyticsSources()
//
// scheduled job 생성 시 manifest snapshot을 schedule payload에 freeze.
//   schedule materialization 시 다음을 job payload에 저장:
//     - canonicalSources (frozen)
//     - sourceConfigSnapshot (자격증명 secretRef 포함 — secret 자체는 아님)
//     - sourceConfigSnapshotHash = SHA-256(sourceConfigSnapshot canonical JSON) — AR5-02 idempotency 입력
//     - manifestSnapshotVersion = hash(canonicalSources + sourceConfigSnapshotHash + analyticsPolicyVersion)
//       → source 설정(secretRef·propertyId·siteUrl·bucket strategy 등) 변경 시 새 lineage 보장 (AR5-02 정정)
//   호출 시 idempotencyKey에 manifestSnapshotVersion 포함:
//     manifestVersion = manifestSnapshotVersion (scheduled job) 또는 current manifest hash (on-demand)
//   retry: CollectionLog.manifestVersion을 끝까지 따름 — 현재 manifest 변경 무시
//   → manifest 변경(ga4 비활성화·secretRef rotation 등) 시 새 scheduled job부터 새 lineage. 기존 in-flight job은 freeze 값 유지
//
// AR3-06 — forceRefresh validation:
//   forceRefresh === true → refreshIntentId must be non-empty string (runtime validation fail otherwise)
//   forceRefresh !== true (false·undefined·omitted) → refreshIntentId ignored (저장 안 함)
//
// 산정:
//   if (forceRefresh === true) {
//     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion + "force:" + refreshIntentId)
//   } else {
//     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion)
//   }

type AnalyticsSource = "gsc" | "naver-search-advisor" | "ga4" | "rum";

type CollectionResult = {
  collectionId: string;                  // UUID
  idempotencyKey: string;
  canonicalSources: AnalyticsSource[];   // AR2-01 — 실제 사용된 source 배열 노출
  resultOrigin: "fresh" | "reconstructed-from-existing";
  envelopeState: "accepted" | "processing" | "completed" | "partial-failed" | "failed";  // AR2-03 envelope 상태
  instanceId: Slug;
  perSource: Array<CollectionSourceAttemptResult>;  // 상태 SoT는 § 14.4 CollectionSourceAttempt 테이블
  windowStart: ISODateString;
  windowEnd: ISODateString;
  startedAt: ISODateString;
  completedAt?: ISODateString;
};

type CollectionSourceAttemptResult = {
  source: AnalyticsSource;
  attemptNumber: number;
  status: CollectionSourceAttemptStatus;
  recordsCollected: number;
  watermarkDate: ISODateString;
  dataCompleteness: number;
  apiQuotaUsed?: { count: number; limit: number; bucketKey: string };
  error?: string;
};

// DB enum SoT. "processing"은 attemptNumber 선점 후 provider 호출 전 상태.
// AR4-14 — cross-Feature 로그 schema에서 `analytics.collectionAttemptStatus` namespace로 사용 권장.
// notifications.DeliveryStatus와 명칭 일부 겹치나(`failed-permanent`·`processing`) 도메인 분리됨.
type CollectionSourceAttemptStatus =
  | "processing"            // attempt insert 후 provider 호출 전 (internal — Result에는 외부 노출 가능)
  | "success"
  | "partial"
  | "failed-credential"
  | "failed-quota"
  | "failed-transient"      // 재시도 가능 (retry queue로 이동)
  | "failed-permanent"      // maxAttempts 소진 or hard fail
  | "skipped-disabled"
  | "skipped-rate-limit"
  | "in-retry-queue";       // CollectionRetryQueue에 enqueue됨
```

### 3.3 ReportGenerationInput·Result

```ts
type ReportGenerationInput = {
  instanceId: Slug;
  reportTemplateId: string;
  windowStart?: ISODateString;
  windowEnd?: ISODateString;
  recipients?: NotificationRecipient[];
  mode: "scheduled" | "on-demand";
  forceRefresh?: boolean;
  refreshIntentId?: string;
  idempotencyKey?: string;
};

// 기본 idempotencyKey: hash(instanceId + reportTemplateId + windowStart + windowEnd + mode [+ "force:" + refreshIntentId])

type ReportGenerationResult = {
  reportInstanceId: string;
  idempotencyKey: string;
  resultOrigin: "fresh" | "reconstructed-from-existing";
  templateId: string;
  generatedAt: ISODateString;
  windowStart: ISODateString;
  windowEnd: ISODateString;
  dataCompleteness: number;
  dataCompletenessBreakdown: Array<{    // AR2-19
    source: AnalyticsSource;
    perDateAvg: number;
    perMetricAvg: number;
  }>;
  artifactRefs: { html?: URL; pdf?: URL; markdownSummary?: string };
  notificationEventId?: string;          // 영구 저장 — § 7.2 재발송 차단 (AR2-05)
  notificationDispatchedAt?: ISODateString;
  deliveryResult?: DeliveryResult;
};
```

### 3.4 `queryNormalizedMetrics` — 다른 Feature read API SoT

```ts
async function queryNormalizedMetrics(input: QueryInput): Promise<QueryResult>

type QueryInput = {
  instanceId: Slug;
  dimensions: QueryDimension[];          // [] → window 전체 single aggregate row (AR2-17)
  metrics: QueryMetric[];
  filters?: QueryFilter[];               // 명시 AST (AR2-16)
  windowStart: ISODateString;
  windowEnd: ISODateString;
  sourceFilter?: AnalyticsSource[];      // 미지정 시 metric별 default source 사용
  joinMode?: "row-separated" | "metric-columns";  // AR4-13 — opt-in cross-source join. 기본 row-separated
};

type QueryFilter = {
  dimension: QueryDimension;
  op: "equals" | "in" | "startsWith";
  value: string | string[];
};
// 평가 규칙:
//   1. 서로 다른 dimension의 filter 간 결합: AND
//   2. 같은 dimension은 최대 1개 filter만 허용 (op 무관). 다수 시 runtime validation error
//   3. `in` op의 value 배열 = OR set (한 filter 안)
//   4. `equals` op = 단일 value
//   5. `startsWith` op = 단일 value (prefix string)
//   6. `date` filter + windowStart/windowEnd 관계 (AR4-12):
//      - date filter는 윈도우와 **intersection**으로 처리 (window 안의 부분집합)
//      - filter value가 [windowStart, windowEnd] 범위 밖이면 empty result (validation error 아님)
//      - `startsWith "YYYY-MM"` 형식 허용 (월 단위 prefix 필터)

type QueryDimension =
  | "date"
  | "source"                              // AR2-20 — NormalizedMetricRow.source와 동일 명칭 (analyticsSource alias 제거)
  | "page"
  | "query"
  | "country"
  | "device"
  | "trafficSource"
  | "medium"
  | "eventName";

type QueryMetric =
  | "impressions"
  | "clicks"
  | "ctr"                                 // 파생 — § 3.4.1
  | "position"                            // 파생 — impression-weighted
  | "sessions"
  | "users"
  | "pageviews"
  | "conversions"
  | "bounceRate";

type QueryResult = {
  rows: Array<Record<string, unknown>>;
  totalRows: number;
  cacheHit: boolean;
  metricSourceMap?: Record<QueryMetric, AnalyticsSource>;  // AR3-14 — sourceFilter 미지정 + dimensions에 source 미포함 시 metric별 사용된 source 명시
  dataCompletenessBreakdown: Array<{    // AR3-15 — date 필드 포함
    source: AnalyticsSource;
    metric: QueryMetric;
    date: ISODateString;
    completeness: number;
  }>;
  dataCompleteness: number;              // weighted avg over (source, metric, date)
  sourceWatermarks: Record<AnalyticsSource, ISODateString>;
};
```

#### 3.4.1 metric별 compatible source·default source (AR2-18)

| metric | compatible sources | default source (sourceFilter 미지정 시) | 산식 |
|---|---|---|---|
| impressions·clicks·ctr·position | gsc·naver-search-advisor | **gsc 우선** (multi-source 합산 시 source별 분리 row 반환) | SUM·weighted (§ 3.4.2) |
| sessions·users·pageviews·conversions·bounceRate | ga4·rum(pageviews만) | **ga4 우선** | SUM·ratio |
| pageviews | ga4·rum | ga4 우선. RUM 자체 PageViewEvent ingest 시 RUM도 가능 (sourceFilter 명시 필요) | SUM |

sourceFilter 미지정 + multi-source 호환 metric 호출 시:
- dimensions에 `source` 포함되어 있으면 → source별 분리 row 반환 (의미 보존)
- dimensions에 `source` 미포함 + **모든 요청 metric의 default source가 동일** → 단일 source 합산 row 반환
- dimensions에 `source` 미포함 + **요청 metric들의 default source가 서로 다름**:
  - `joinMode="row-separated"` (기본) — runtime validation error. dimensions에 source 추가 또는 sourceFilter 명시 필요
  - `joinMode="metric-columns"` (AR4-13 — opt-in cross-source join) — 같은 dimensions(예: date+page) row에 metric별 source가 다른 값을 컬럼으로 결합. metricSourceMap 응답으로 metric별 source 명시
- `metricSourceMap` 응답 필드로 metric별 실제 사용된 source 명시 (joinMode 무관 항상 채워짐)

#### 3.4.2 aggregation 산식

- `impressions`·`clicks`·`sessions`·`users`·`pageviews`·`conversions`·`bounces`: SUM
- `ctr`: SUM(clicks) / SUM(impressions)
- `position`: SUM(position × impressions) / SUM(impressions) — impression-weighted
- `bounceRate`: SUM(bounces) / SUM(sessions) — bounces가 정규화 데이터에 존재해야 가능. 부재 시 N/A + warning

---

## 4. 데이터 수집 파이프라인

### 4.1 실행 순서 (per CollectionLog envelope)

```
1. canonicalSources 산정 (AR2-01) + idempotencyKey 산정 (AR2-02 force refresh 분기)
2. idempotency:
   - CollectionLog UNIQUE(instanceId, idempotencyKey) insert 시도
   - 충돌 시:
     - envelopeState="completed" → 기존 결과 재구성 반환 (resultOrigin="reconstructed-from-existing")
     - envelopeState ∈ {accepted, processing, partial-failed} → in-progress 결과 반환 (호출자가 후속 query 가능)
     - envelopeState="failed" + forceRefresh=false → 마지막 실패 결과 반환
   - 신규 insert 시 envelopeState="accepted"
3. canonicalSources 각각에 대해 source-level 실행 (parallel 또는 직렬):
   a. CollectionSourceAttempt insert (status="processing", attemptNumber=1)
   b. credential 검증 → 부재 시 status="failed-credential" + 외부 sink alert
   c. watermark 산정: windowEnd' = min(windowEnd, today - availabilityLagDays)
   d. rate limit token bucket consume (bucketKeyStrategy 적용)
   e. 외부 API 호출:
      - 200 → 응답 정규화 (§ 6) + raw payload allowlist redaction (§ 5.5) + DB 저장
      - 401·403 → failed-credential
      - 429 → max(Retry-After, backoffSeconds[attemptNumber-1]) → retry queue
      - 5xx·timeout → failed-transient → retry queue
   f. CollectionSourceAttempt 갱신
4. envelopeState 산정 (AR3-04 — 우선순위 표):
   | 조건 | envelopeState |
   |---|---|
   | 1+ attempt가 in-retry-queue 또는 processing | **processing** (우선) |
   | 위 조건 미충족 + 모든 attempt status="success" (skipped-disabled 포함 가능, 단 1+ success 필수) | **completed** |
   | 위 조건 미충족 + success 0건 + 모든 source가 failed-* 또는 skipped 분류 | **failed** |
   | 위 조건 미충족 + success 1+ + failed-* 1+ 혼합 | **partial-failed** |
5. retry 성공 후 envelope 재계산 (AR3-03):
   - CollectionRetryQueue worker가 attempt 종결할 때마다 envelope state를 위 표로 재계산
   - 재계산 lock: advisory lock `hash(collectionLogId, "envelope")`로 동시 갱신 직렬화
   - **lock ordering invariant** (AR4-03): source attempt lock 보유 상태에서 envelope lock 획득 금지. attempt insert transaction commit + lock 해제 후 **별도 transaction**에서 envelope lock 획득 → deadlock 회피
6. CollectionResult 산출
```

### 4.2 스케줄·DST·missed run

- 일일 수집: `collectionSchedule.daily` (인스턴스 timezone)
- **DST 처리 SoT** (AR3-17 — IANA TZDB + Temporal disambiguation 기준):
  - `dstNonexistentLocalTime: "next-valid"` ↔ Temporal `disambiguation: "later"`. 봄 spring-forward로 사라진 local time은 다음 유효 시각 사용
  - `dstAmbiguousLocalTime: "first"` ↔ Temporal `disambiguation: "earlier"`. 가을 fall-back으로 중복된 local time은 **earlier offset(이른 발생)** 사용
- missed run carry-over: `missedRunCarryOverMaxDays`(기본 7일) 윈도우 내 누락된 scheduledFor date를 catch-up
- catch-up idempotencyKey = `hash(instanceId + canonicalSources + scheduledForDate + manifestVersion)` — date별 멱등
- **missedRunCarryOverMaxDays 초과** (AR3-18): 초과 누락분은:
  - CollectionRetryQueue에 `status="skipped-missed-run-expired"`로 운영 로그 기록 (실제 수집 안 함)
  - 외부 monitoring sink alert (장애 장기화 감지)
  - 운영자가 명시 backfill (forceRefresh=true + refreshIntentId) 또는 on-demand runCollection 호출로 복구 가능

### 4.3 retry queue worker (AR2-15)

- 별도 worker가 `workerPollIntervalSeconds`(기본 30초) 간격으로 다음 처리:

```sql
-- worker claim (PostgreSQL):
UPDATE collection_retry_queue
SET status = 'processing', lockedAt = now(), lockedBy = :workerId
WHERE id IN (
  SELECT id FROM collection_retry_queue
  WHERE status = 'pending' AND scheduledFor <= now()
  ORDER BY scheduledFor
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

- **attemptNumber 동시성 안전** (AR3-02):
  1. queue row claim 후 `(collectionLogId, source)` 범위 advisory lock acquire
  2. `SELECT MAX(attemptNumber)+1 FROM CollectionSourceAttempt WHERE collectionLogId=? AND source=?`
  3. lock 보유 상태에서 새 CollectionSourceAttempt INSERT (status="processing", attemptNumber=max+1)
  4. 짧은 transaction commit → lock 자동 해제
  5. 별도 transaction에서 provider 호출 후 attempt UPDATE
- worker 처리 후 status="completed" 또는 retry 반복
- `maxAttempts` 도달 → queue status="exhausted" + **CollectionSourceAttempt.status="failed-permanent"** (AR3-03) + 외부 sink alert
- 종결 시 envelope 재계산 호출 (§ 4.1 5단계)
- stale processing (>10분) — 별도 reconcile worker가 queue status="pending" 복귀

### 4.4 reportTemplates schedule grammar (AR2-23)

- `type: "daily"` — `time` (HH:MM)
- `type: "weekly"` — `dayOfWeek` (`MON`|`TUE`|`WED`|`THU`|`FRI`|`SAT`|`SUN`) + `time`
- `type: "monthly"` — `dayOfMonth` (`1st`|`last`|`N` where N=1~31) + `time`. `last` = 해당 월의 마지막 날. N>해당 월 일수 → 해당 월 마지막 날
- 모든 시각은 InstanceManifest.timezone 기준. DST·missed run은 § 4.2 동일

---

## 5. 외부 source별 어댑터

### 5.1 GSC
- API Search Console v1, Service Account 인증
- 메트릭 impressions·clicks·ctr·position by date·page·query·country·device
- **availabilityLagDays: 3**, rate limit bucket scope: **credential-global**

### 5.2 네이버 서치어드바이저
- OpenAPI, API Key 인증
- 노출수·클릭수·CTR·평균 순위
- availabilityLagDays: 1, bucket scope: **instance-isolated**

### 5.3 GA4
- Analytics Data API v1, Service Account
- sessions·users·pageviews·conversions·bounceRate·bounces by date·page·trafficSource·medium·country·device·eventName
- availabilityLagDays: 1, bucket scope: **credential-global**
- **custom field 정책** (AR2-11): `pii.ga4CustomFieldAllowlist`에 명시 등록된 key만 저장. 미등록 customDimensions·customMetrics·eventParameters는 redaction worker가 drop

### 5.4 RUM
- 클라이언트 → endpoint POST
- SEARCH_STANDARDIZATION § 6.3 표준 이벤트 3종(PerformanceEvent·PageViewEvent·ConversionEvent)
- PII는 SEARCH § 6.3.1 SoT
- availabilityLagDays: 0, bucket scope: instance-isolated

### 5.5 raw payload allowlist (재참조 정정: § 4.1 6단계가 본 절을 참조 — AR2-24)

source별 raw 저장 허용 컬럼:

| source | 허용 |
|---|---|
| gsc | date, page(path), query, country, device, impressions, clicks, position, ctr |
| naver | date, query, page(path), impressions, clicks, position, ctr |
| ga4 | date, page(path), trafficSource, medium, country, device, eventName, metric values + **ga4CustomFieldAllowlist에 등록된 customDimensions·customMetrics·eventParameters만** |
| rum | PerformanceEvent·PageViewEvent·ConversionEvent 표준 필드 (SEARCH § 6.3) |

금지: full URL·querystring·fragment, user-id·client-id, raw IP, raw user-agent, credential, provider error body의 raw 식별자

- **redaction 적용 시점** (memory-only projection):
  - provider 응답 수신 **직후** memory에서 allowlist projection 수행
  - projection 전 payload는 로그·DB·error metadata 어디에도 저장 금지 (PII 누출 방지)
  - projection 후 결과만 raw row 생성·normalized 정규화 진행
- `containsPersonalData=false` 검증 필드 — 검증 실패 시 fail + sink alert
- **AnalyticsRedactionAudit 생성 범위 — 모든 projection** (AR4-10 정정):
  - `rawPayloadStorage.enabled=true`·`false` 무관하게 **모든 provider response projection마다** AnalyticsRedactionAudit row 생성
  - rawPayloadStorage.enabled=true 인스턴스에서는 RawRecord + AnalyticsRedactionAudit 양쪽 모두 보존 (이중 감사)
  - false 인스턴스에서는 AnalyticsRedactionAudit이 redaction 적용의 유일한 감사 증거
- **projection + DB writes 원자성** (AR4-11 — crash recovery):
  - projection 직후 다음 4개 DB write를 **단일 transaction**으로 묶음:
    1. RawRecord insert (rawPayloadStorage.enabled=true인 경우만)
    2. AnalyticsRedactionAudit insert (항상)
    3. NormalizedMetric insert (다수 row)
    4. CollectionSourceAttempt status="success" 전이
  - transaction 실패 시 모든 write 롤백 → attempt status="processing" 유지 → reconcile worker가 재시도
  - reconcile worker (stale processing >10분 감지): attempt status="failed-transient"로 마킹 후 retry queue enqueue
- 보존 (AR5-08 정합):
  - RawRecord: `retentionDays.raw` 만료 자동 purge (rawPayloadStorage.enabled=true인 경우만)
  - **AnalyticsRedactionAudit**: `AnalyticsRedactionAudit.processedAt + retentionDays.rawRedactionAuditTrail`(기본 3년) 만료 자동 purge — rawPayloadStorage.enabled 무관 모든 인스턴스 적용

---

## 6. 정규화·캐시

### 6.1 통합 스키마 — NormalizedMetricRow

§ 3.4 QueryDimension·QueryMetric과 1:1 매핑 (`source` 명칭 통일 — AR2-20):

```ts
type NormalizedMetricRow = {
  instanceId: Slug;
  date: ISODateString;
  source: AnalyticsSource;
  dimensionKey: string;                  // NOT NULL, composite UNIQUE의 일부 (AR2-21 정정)
  page?: string; query?: string; country?: string; device?: string;
  trafficSource?: string; medium?: string; eventName?: string;
  impressions?: number; clicks?: number; ctr?: number; position?: number;
  sessions?: number; users?: number; pageviews?: number; conversions?: number;
  bounceRate?: number; bounces?: number;
  ingestedAt: ISODateString;
};
```

**dimensionKey** = SHA-256(sorted JSON of `{page, query, country, device, trafficSource, medium, eventName}` with NULL → `"__none"` sentinel). DB column NOT NULL + composite UNIQUE의 일부 (AR2-21).

### 6.2 보존 정책

- Raw: 90일, redaction audit trail 3년
- Normalized: 730일

### 6.3 캐시 layer

- DB 인덱스 + page cache만. 추가 Redis layer는 AR-04

---

## 7. 리포트 정의·생성·발송

### 7.1 ReportTemplate

§ 4.4 schedule grammar 적용. recipientRoles는 NotificationRecipientRoleSelector enum.

### 7.2 생성·발송 흐름

```
1. ReportTemplate 로드 + windowSpec 산정
2. ReportSection[] queryNormalizedMetrics 실행 → dataCompleteness·breakdown 집계
3. Markdown → HTML + PDF 렌더링
4. ReportInstance insert (UNIQUE(instanceId, idempotencyKey)):
   - 충돌 시:
     - **forceRefresh=true + refreshIntentId** (AR3-07): idempotencyKey가 force lineage로 산정됨 → 새 record. 기존과 별개 row 생성. UNIQUE 충돌 방지
     - 일반(forceRefresh=false): 기존 ReportInstance.notificationDispatchClaim 상태 검사:
       - `dispatched` (notificationDispatchedAt 존재) → resultOrigin="reconstructed-from-existing" + 발송 생략
       - `claimed-pending`·`dispatch-failed` → outbox 재발송 worker가 처리 (resultOrigin="reconstructed-from-existing")
       - `not-claimed` → 재발송 진행
5. delivery.enabled=true 시 **outbox 패턴** (AR3-08):
   a. ReportInstance.notificationDispatchClaim = "claimed-pending" + claimedAt 갱신 (UPDATE 원자)
   b. NotificationEvent 발송:
        sourceEventId = hash(instanceId + reportInstanceId)
        eventType = "analytics-report-ready"
        recipients = recipientRoles[] → AdminUser fan-out
   c. notify() 성공 → ReportInstance.notificationDispatchClaim="dispatched" + notificationDispatchedAt + notificationEventId 저장
   d. notify() 실패 또는 c 단계 commit 실패 → notificationDispatchClaim="dispatch-failed-retryable" + attempts++ + 외부 sink alert
   e. **outbox reconcile worker** (1분 주기 — AR4-04·06 SoT 쿼리):
      ```sql
      UPDATE report_instance
      SET notification_dispatch_claim = 'claimed-pending', notification_dispatch_claimed_at = now()
      WHERE id IN (
        SELECT id FROM report_instance
        WHERE notification_dispatch_attempts < 5  -- AR5-04: stale claim도 attempts 상한 검사
          AND (
            (notification_dispatch_claim = 'claimed-pending'
             AND notification_dispatch_claimed_at < now() - interval '5 minutes')
            OR notification_dispatch_claim = 'dispatch-failed-retryable'
          )
        LIMIT 10
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *;
      -- 별도 reconcile step: attempts >= 5인 stale row를 'dispatch-failed-permanent'로 일괄 전이
      UPDATE report_instance
      SET notification_dispatch_claim = 'dispatch-failed-permanent'
      WHERE notification_dispatch_attempts >= 5
        AND notification_dispatch_claim != 'dispatched'
        AND notification_dispatch_claim != 'dispatch-failed-permanent';
      ```
   f. 재시도 후 성공 → "dispatched", 5회 초과 실패 → "dispatch-failed-permanent" + 운영자 수동 개입 alert (AR4-04 retryable vs permanent 분리)
6. ReportInstance.notificationDispatchedAt + sourceEventId 영구 저장 — notifications receipt 만료(365일) 후에도 재발송 차단
```

### 7.3 임계 측정 — hysteresis + workflow 명시 API (AR2-06·10)

**hysteresis 상태 SoT**: `MediaThresholdState`(§ 14.7 — AR3-23 참조 정정) 인스턴스별 1 row. `currentState` enum 값은 `below-threshold` | `above-threshold` (AR3-09 정정).

```
매일 측정 cycle:
1. DailyUserMeasurement insert (UNIQUE(instanceId, date, basisKey))
   basisKey = hash(primarySource + botFilteringPolicyId + calendarPolicy + measurementAlgorithmVersion)
2. rollingAverage 계산 (operationalWindow.measurementWindowDays)
3. MediaThresholdState 갱신 — UPDATE ... WHERE instanceId=? RETURNING *
   **streak 갱신 규칙** (AR3-10):
   - dailyUsers >= threshold:
     - enterStreak += 1
     - exitStreak = 0
   - dailyUsers < threshold:
     - exitStreak += 1
     - enterStreak = 0
   - dailyUsers 결측 또는 dataCompleteness < 0.9:
     - streak 갱신하지 않음 (hold). 측정 결과 도착 시 backfill 후 다시 평가
   - measurementAlgorithmVersion 또는 basisKey 변경 → enterStreak·exitStreak 모두 0으로 reset (새 측정 기준)

   **transition 조건**:
   - currentState="below-threshold" + enterStreak >= enterAfterConsecutiveDays(기본 7) → currentState="above-threshold", transition trigger
   - currentState="above-threshold" + exitStreak >= exitAfterConsecutiveDays(기본 30) → currentState="below-threshold", transition trigger

4. transition 발생 시:
   a. transitionEventId 산정 (AR3-11 — basisKey 포함):
      transitionEventId = hash("media-threshold:" + instanceId + newState + assessmentBasisDate + basisKey + thresholdDailyUsers)
   b. measurementSnapshot 산정 — § 7.3.1 필드별 산출표
   c. **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment()** 호출 — outbox 패턴 (§ 7.3.2 재시도 정책)
   d. notify(NotificationEvent) — eventType: media-threshold-reached 또는 -released
   e. MediaThresholdState.lastTransitionEventId·lastTransitionAt 갱신
```

#### 7.3.1 measurementSnapshot 필드별 산출표 (AR3-13)

DATA_MODEL C-10 `MediaThresholdAssessment` 필드별 매핑:

| MediaThresholdAssessment 필드 | 본 Feature 산출 |
|---|---|
| `assessmentBasisDate` | transition 발생일 (DailyUserMeasurement.date) |
| `windowStart`·`windowEnd` | rollingAverage 산정 윈도우 [date - measurementWindowDays + 1, date] |
| `rollingAverageDailyUsers` | DailyUserMeasurement.rollingAverageDailyUsers (즉시 transition 시점값) |
| `thresholdReached` | newState === "above-threshold" |
| `primarySource` | config.mediaThresholdMeasurement.primarySource |
| `sourceCompleteness` | 윈도우 내 측정 가능 일자 대비 **`dailyUsers 존재 AND 해당 일자 dataCompleteness >= 0.9`인 일자** 비율 (AR4-09 — streak hold 기준과 동일) |
| `timezone` | InstanceManifest.timezone |
| `calendarPolicy` | **"rolling-90-days"** (운영 측정만) |
| `botFilteringPolicy` | config.mediaThresholdMeasurement.botFilteringPolicyId |
| `legalBasisNote` | **null** (rolling snapshot에는 미채움) |

> **저장 위치** (AR4-08 — REVIEW_WORKFLOW § 8.1.1 v0.15 cascade 정합):
> - rolling snapshot은 워크플로가 새 pre-publish ComplianceRecord의 **`mediaThresholdOperationalInput` 슬롯** (DATA_MODEL C-10 v0.15)에 저장 — legal 판정 입력 자료. **`mediaThresholdAssessment` 슬롯에는 저장 금지** (calendarPolicy 혼선 방지)
> - 법정 calendar 산정값은 legal 검수자가 다음 위치에 분산 입력 (AR5-07 정합 — DATA_MODEL C-10 정확한 필드 위치):
  - `mediaThresholdAssessment` 슬롯: `calendarPolicy="previous-3-months-calendar"`·`rollingAverageDailyUsers`(calendar 윈도우 평균)·`thresholdReached`·`primarySource`·`sourceCompleteness`·`timezone`·`botFilteringPolicy`·**`legalBasisNote`**
  - **`ComplianceRecord.legalCounsel` + `ComplianceRecord.legalCounselAt`** (top-level 필드 — nested 아님)
> - **published record.mediaThresholdAssessment에는 calendar 값만 존재**. `mediaThresholdOperationalInput`은 published record에도 보존 (감사 추적)

#### 7.3.2 enqueueMediaThresholdReassessment 재시도 정책 (AR3-12 — outbox)

본 Feature가 workflow API를 호출하지만 응답 실패 시 silent failure 방지:

- transition trigger 직후 `MediaThresholdReassessmentDispatchOutbox` row insert (§ 14.10)
- worker가 1분 주기로 outbox 처리 (AR4-05·06 SoT 쿼리):

```sql
UPDATE media_threshold_reassessment_dispatch_outbox
SET claim = 'claimed-pending', claimed_at = now()
WHERE id IN (
  SELECT id FROM media_threshold_reassessment_dispatch_outbox
  WHERE attempts < 5  -- AR5-04: stale claim도 attempts 상한 검사
    AND (
      (claim = 'claimed-pending' AND claimed_at < now() - interval '5 minutes')
      OR claim IN ('not-claimed', 'dispatch-failed-retryable')
    )
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
-- 별도 reconcile step:
UPDATE media_threshold_reassessment_dispatch_outbox
SET claim = 'dispatch-failed-permanent'
WHERE attempts >= 5
  AND claim != 'dispatched'
  AND claim != 'dispatch-failed-permanent';
```

- 처리:
  1. claim="claimed-pending" + attempts++
  2. workflow API 호출
  3. 성공(`reassessmentBatchId` 수신) → claim="dispatched" + dispatchedAt 마킹
  4. 실패 → claim="dispatch-failed-retryable" + 외부 sink alert
- 동일 transitionEventId 재시도는 workflow API의 `transitionEventId UNIQUE`로 idempotent
- 5회 초과 실패 → claim="dispatch-failed-permanent" + 운영자 수동 개입 alert (AR4-05 분리)

**operational vs 법정 분리** (AR2-08):
- `measurementSnapshot.calendarPolicy="rolling-90-days"` — 운영 조기경보용. priorReviewRequired 산정 입력 금지
- 법정 산정(`previous-3-months-calendar`)은 legal 검수자가 별도 DailyUserMeasurement aggregated 결과로 산정 후 ComplianceRecord에 확정 기록 (REVIEW_WORKFLOW § 8.1.1)

---

## 8. PII·일평균 이용자 측정

### 8.1 PII 처리

- SEARCH § 6.3.1 SoT 적용 (IPv4 `/24`·IPv6 `/48`·full URL 금지·UA 정규화)
- raw payload allowlist (§ 5.5) — ga4CustomFieldAllowlist 포함
- **DSR 요청 처리** (AR3-22 — machine reason enum + human message 분리):
  - `subjectMatchingPolicy="not-applicable"`(config) — 본 Feature는 aggregated 데이터만 저장. 정상 경로에서 subject-level 삭제 대상 컬럼 없음
  - DSR 응답 + DsrDeletionLog reasonCode enum:
    - `aggregated-only-not-applicable` (human: "subject-level data not stored — aggregated only")
    - `raw-incident-quarantined` (human: "raw payload incident — quarantined records deleted")
    - `raw-incident-not-found` (human: "raw payload search returned no matching records")
  - subjectIdentifier optional: aggregated-only-not-applicable 응답 시 미저장. raw-incident 응답 시 hash(salt + identifier) 저장 (salt는 인스턴스별 비밀)
  - 예외: raw payload redaction 누락 incident 대응 시 — quarantined raw record를 별도 절차로 검색·삭제. DsrDeletionLog에 reasonCode 명시

### 8.2 의료법 일평균 이용자 (MA-02)

**역할 분리**:

| 역할 | 책임 |
|---|---|
| 본 Feature (analytics-reporting) | rolling-90 운영 측정 + MediaThresholdState 갱신 + transition 시 `enqueueMediaThresholdReassessment()` API 호출 + **operational/calendar 양쪽 산정용 measurement 데이터 조회 API 제공** + ComplianceRecord 직접 수정 금지 |
| REVIEW_WORKFLOW § 8.1.1 (워크플로) | 명시 API 수신 → pre-publish record 생성 + staleFlags.legal 갱신 + legal 검수자 큐 |
| legal 검수자 | calendar 산정 결과를 `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt`(top-level — AR5-07) + `mediaThresholdAssessment.legalBasisNote` 확정 기록 |

#### 8.2.1 legal 검수자 calendar 산정 API (AR5-06)

```ts
// legal 검수자가 calendar 산정 시 호출하는 read API
async function queryDailyUserMeasurements(input: {
  instanceId: Slug;
  windowStart: ISODateString;          // 시행령 제24조: previous-3-months-calendar window
  windowEnd: ISODateString;
  calendarPolicy: "previous-3-months-calendar";  // calendar 산정 전용 (rolling-90은 본 API 미사용)
  primarySourceOverride?: AnalyticsSource;       // legal 판단에 따른 source 변경 가능
  botFilteringPolicyOverride?: string;           // override 가능
}): Promise<{
  measurements: DailyUserMeasurement[];          // 윈도우 내 일별 측정값
  rollingAverageDailyUsers: number;              // 윈도우 평균
  sourceCompleteness: number;                    // 측정 완성도
  basisKey: string;                              // 산정 기준 식별자
}>;
```

- **calendar window는 legal이 결정** (시행령 제24조 "전년도 말 기준 직전 3개월"). 본 API는 임의 윈도우 입력 허용
- primarySource·botFilteringPolicy override 가능 (rolling 운영 측정과 다른 기준 적용 가능)
- 결과는 legal 검수자가 검토 후 ComplianceRecord 채움. 본 API 자체는 ComplianceRecord 수정 안 함
- **수동 override**: legal이 외부 산정값을 입력하려는 경우 — 본 API 결과를 참고 + `legalBasisNote`에 산정 방식 명시 (`primarySource`·`botFilteringPolicy`·외부 산정 도구 등)

### 8.3 ComplianceRecord 갱신 주체 (AR2-09)

- 본 Feature는 **direct mutator 아님**. `enqueueMediaThresholdReassessment()` API에 snapshot 전달만
- pre-publish record 생성·갱신은 REVIEW_WORKFLOW API 책임
- published record는 staleFlags 갱신만 가능 (DATA_MODEL C-10 SoT)

---

## 9. 운영 지표

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| 수집 성공율 (envelope) | envelopeState="completed" / 전체 | > 99% |
| 수집 성공율 (per source) | success / (success + failed-permanent) | > 99% |
| 수집 지연 | scheduled → completed | < 5분 (p95) |
| API quota 사용율 | bucket별 | < 80% |
| 데이터 신선도 | latest ingested date vs watermarkDate | 0일 차이 |
| dataCompleteness 평균 | window별 | > 0.95 |
| 리포트 생성 지연 | < 60초 (p95) | |
| 리포트 발송 성공율 | > 99% | |
| 임계 측정 가용성 | DailyUserMeasurement 일별 누적 | > 99% |
| retry queue 처리율 | exhausted / total | < 5% |

### 9.2 측정·로깅 — § 14 SoT

### 9.3 자체 alert (외부 sink)

- envelope 성공율 < 95% / 24h
- API quota > 80%
- 데이터 신선도 SLA 미달
- 임계 측정 실패 — 의료법 운영 영향
- redaction 검증 실패 — PII 누출 위험
- retry queue stale processing > 10분
- MediaThresholdState 갱신 실패

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화
# 2. analyticsConfig (C-08 v0.14)
# 3. secretRef 등록
# 4. RUM endpoint
# 5. notifications 활성 확인 (requiresFeature)
# 6. DB 마이그레이션 — § 14 인벤토리 12 tables (Raw·Normalized·CollectionLog·CollectionSourceAttempt·ReportInstance·DailyUserMeasurement·MediaThresholdState·CollectionRetryQueue·DsrDeletionLog·MediaThresholdReassessmentDispatchOutbox·AnalyticsRedactionAudit·AnalyticsApiCallLog)
```

### 10.2 비활성화·의존성

- requiresFeature: notifications (reportTemplates.delivery 활성 시)
- keyword-monitoring·search-visibility는 본 Feature 의존 — 비활성 시 build fail (각 Feature 자체 검증)

---

## 11. 빌드 검증·런타임 검증 (AR4-16 분리)

### 11.1 build-time fail (배포 전 차단)

- `enabled=true` + `analyticsConfig` 누락
- 활성 source의 secretRef 누락
- `schedule.type`/`dayOfWeek`/`dayOfMonth` 문법 오류
- `mediaThresholdMeasurement.enabled=true` + `primarySource` 비활성
- notifications 비활성 + `reportTemplates[].delivery.enabled=true`
- `requiresFeature: notifications` 충족 안 됨 (reportTemplates delivery 활성)
- `pii.consent.dsrDeletionAccepted=true` + dsrDeletionSlaDays 미설정
- **`analyticsPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치** (AR4-01)
- outbox 테이블 schema에 `claim` enum·`attempts`·`claimedAt` 컬럼 누락 (maxAttempts는 상수 5 — § 1.2.1)
- **`retentionDays.rawRedactionAuditTrail` 미설정** (rawPayloadStorage 무관 — AnalyticsRedactionAudit은 모든 projection마다 생성)

### 11.2 runtime validation fail (호출 시점)

- `forceRefresh=true` + `refreshIntentId` 누락 또는 빈 문자열
- QueryFilter dimension별 1개 초과
- date filter 범위가 windowStart/windowEnd 밖 (empty result는 정상, error 아님)
- joinMode="row-separated"(기본) + dimensions 미포함 + mixed default source metric 다수

### 11.3 warning

- source 0건 활성
- RUM 활성 + endpoint 미설정
- retentionDays.raw > retentionDays.normalized
- `hysteresis.enterAfterConsecutiveDays` < 1
- mediaThresholdMeasurement primarySource availabilityLagDays > 7
- `pii.ga4CustomFieldAllowlist`의 customDimensions/customMetrics/eventParameters가 0건이고 GA4 활성

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AR-01 | 추가 source — Bing Webmaster·Yandex | M2+ |
| AR-02 | PDF 생성 라이브러리 | 인프라 결정 |
| AR-04 | Redis cache layer | 운영 누적 후 |
| AR-05 | RUM SDK 배포·버전 관리 | 인프라 결정 |
| AR-06 | composite primarySource | 운영 정책 |
| AR-07 | 리포트 다국어 | M3+ |
| AR-08 | rate limit bucketBackend Redis vs DB advisory lock | 인프라 결정 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AR-03~~ | 다른 Feature 데이터 인터페이스 | v0.2 — queryNormalizedMetrics only |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (18 지적) |
| 2026-05-14 | v0.3 | codex 2차 (24 지적 전건 수용)
| 2026-05-14 | v0.4 | codex 3차 (23 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (16 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |

---

## 14. 본 Feature 내부 데이터 구조

### 14.1 `AnalyticsRawRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `source` | AnalyticsSource | ✅ |
| `collectionId` | UUID | ✅ — FK CollectionLog |
| `windowStart`·`windowEnd` | Date | ✅ |
| `payload` | JSON | ✅ — allowlist redaction |
| `payloadRedactionVersion` | string | ✅ |
| `containsPersonalData` | boolean | ✅ — false 검증 |
| `ingestedAt`·`expiresAt` | Date | ✅ |

**Constraints**: `FK collectionId ON DELETE RESTRICT`. `CHECK containsPersonalData = false`. `rawPayloadStorage.enabled=false` 인스턴스는 row 미생성.

### 14.2 `AnalyticsNormalizedMetric`

§ 6.1 NormalizedMetricRow 스키마 + `UNIQUE(instanceId, date, source, dimensionKey)`.
**Index**: `(instanceId, date)`, `(instanceId, page, date)`, `(instanceId, query, date)`, `(instanceId, source, date)`.

### 14.3 `CollectionLog` (envelope)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum | ✅ |
| `canonicalSources` | JSON (string[]) | ✅ |
| `manifestVersion` | string | ✅ — analyticsConfig.sources enabled set + featurePolicyVersion hash (AR3-05) |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | ✅ |
| `startedAt` | Date | ✅ |
| `completedAt` | Date | optional |
| `envelopeState` | enum | ✅ — accepted/processing/completed/partial-failed/failed |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.

### 14.4 `CollectionSourceAttempt` (per-source 상태 SoT — AR2-03)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `collectionLogId` | UUID | ✅ — FK |
| `source` | AnalyticsSource | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum | ✅ |
| `recordsCollected` | number | ✅ |
| `watermarkDate` | Date | ✅ |
| `dataCompleteness` | number | ✅ |
| `apiQuotaBucketKey` | string | optional |
| `apiQuotaUsed`·`apiQuotaLimit` | number | optional |
| `error` | string | optional |
| `startedAt`·`completedAt` | Date | ✅ / optional |

**Constraints**: `FK collectionLogId ON DELETE RESTRICT`. `UNIQUE(collectionLogId, source, attemptNumber)`.

### 14.5 `ReportInstance`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `templateId` | string | ✅ |
| `windowStart`·`windowEnd`·`generatedAt` | Date | ✅ |
| `dataCompleteness` | number | ✅ |
| `dataCompletenessBreakdown` | JSON | ✅ |
| `artifactRefs` | JSON | ✅ |
| `notificationDispatchClaim` | enum | ✅ — not-claimed/claimed-pending/dispatched/dispatch-failed-retryable/dispatch-failed-permanent (AR4-04 retryable vs permanent 분리) |
| `notificationDispatchClaimedAt` | Date | optional |
| `notificationDispatchAttempts` | integer | ✅ — outbox reconcile worker 재시도 누적 |
| `notificationEventId` | string | optional |
| `notificationDispatchedAt` | Date | optional — 영구 저장 |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(notificationDispatchClaim, notificationDispatchClaimedAt)` — outbox worker query.

### 14.6 `DailyUserMeasurement` (AR2-07 basisKey)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `date` | Date | ✅ |
| `basisKey` | string | ✅ — hash(primarySource + botPolicy + calendarPolicy + algorithmVersion) |
| `primarySource` | AnalyticsSource | ✅ |
| `botFilteringPolicyId` | string | ✅ |
| `calendarPolicy` | enum | ✅ |
| `measurementAlgorithmVersion` | string | ✅ |
| `dailyUsers` | number | ✅ |
| `rollingAverageDailyUsers` | number | ✅ |
| `thresholdReached` | boolean | ✅ |
| `isActiveMeasurement` | boolean | ✅ — 동일 date 중 현재 운영 측정값 1건 |
| `measuredAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, date, basisKey)`. **partial unique index**: `UNIQUE(instanceId, date) WHERE isActiveMeasurement=true` (active 1건/일).

### 14.7 `MediaThresholdState` (AR2-06 — hysteresis 상태 SoT)

| 필드 | 타입 | required |
|---|---|:---:|
| `instanceId` | Slug | ✅ — PK |
| `currentState` | enum | ✅ — `below-threshold` / `above-threshold` |
| `stateSince` | Date | ✅ |
| `lastAssessmentBasisDate` | Date | ✅ |
| `enterStreak` | integer | ✅ — 연속 ≥ threshold 일수 |
| `exitStreak` | integer | ✅ — 연속 < threshold 일수 |
| `lastTransitionEventId` | string | optional |
| `lastTransitionAt` | Date | optional |
| `updatedAt` | Date | ✅ |

### 14.8 `CollectionRetryQueue` (AR2-15 worker schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `collectionLogId` | UUID | ✅ — FK |
| `source` | AnalyticsSource | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum | ✅ — pending·processing·completed·exhausted |
| `scheduledFor` | Date | ✅ — 다음 시도 시각 |
| `lockedAt` | Date | optional |
| `lockedBy` | string | optional |
| `lastError` | string | optional |
| `dedupeMode` | enum | ✅ — normal·resend |

**Constraints**: `FK collectionLogId ON DELETE RESTRICT`. `UNIQUE(collectionLogId, source, attemptNumber)`.
**Index**: `(status, scheduledFor)` partial where status='pending' (worker claim 최적화).

### 14.9 `DsrDeletionLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `requestedAt` | Date | ✅ |
| `requestSource` | string | ✅ |
| `subjectIdentifierHash` | string | optional — salt+identifier SHA-256, raw-incident reasonCode 시만 저장 |
| `reasonCode` | enum | ✅ — aggregated-only-not-applicable·raw-incident-quarantined·raw-incident-not-found |
| `reasonHumanMessage` | string | ✅ |
| `tablesAffected` | string[] | ✅ |
| `recordsDeleted` | number | ✅ |
| `completedAt` | Date | optional |
| `sla` | number | ✅ |

### 14.10 `MediaThresholdReassessmentDispatchOutbox` (AR3-12 신설)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `transitionEventId` | string | ✅ — UNIQUE |
| `newState` | enum | ✅ — above-threshold·below-threshold |
| `assessmentBasisDate` | Date | ✅ |
| `measurementSnapshot` | JSON | ✅ — MediaThresholdAssessment 타입 |
| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent (AR4-05) |
| `claimedAt` | Date | optional |
| `dispatchedAt` | Date | optional |
| `attempts` | integer | ✅ |
| `lastError` | string | optional |
| `reassessmentBatchId` | string | optional — workflow API 응답 |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(transitionEventId)`.
**Index**: `(claim, claimedAt)` — outbox worker query.

### 14.11 `AnalyticsRedactionAudit` (모든 projection마다 생성 — AR4-10·AR5-08)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `source` | AnalyticsSource | ✅ |
| `collectionId` | UUID | ✅ |
| `redactionSchemaVersion` | string | ✅ |
| `payloadRedactionVersion` | string | ✅ |
| `responseFieldCount` | integer | ✅ |
| `droppedFieldCount` | integer | ✅ |
| `redactedPayloadHash` | string | ✅ — SHA-256 of allowlisted projection |
| `processedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — `processedAt + retentionDays.rawRedactionAuditTrail`(기본 3년). purge worker 기준 |

**Index**: `(instanceId, processedAt DESC)`, `(expiresAt)`.
**Purge worker**: 일간 `DELETE FROM analytics_redaction_audit WHERE expiresAt < now()`.

### 14.12 `AnalyticsApiCallLog` (감사)

기존 v0.2 schema 유지.

---
