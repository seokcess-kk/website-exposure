{
  "summary": "v0.1은 analytics-reporting의 책임 범위 자체는 적절히 잡았지만, SoT cascade를 '필요'라고만 적고 실제 enum·payload·데이터 슬롯·이벤트 타입을 닫지 않은 부분이 많아 아직 구현 기준으로는 불안정하다. 특히 측정 이벤트 표준 미정의, notifications/REVIEW_WORKFLOW 정합 누락, runCollection/generateReport idempotency 부재, NULL dimension unique 제약, MA-02 rolling average와 priorReviewRequired 연동 미완성이 1차 안정화의 핵심 차단 요인이다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 5.4 RUM / § 7.3 측정 이벤트·리포트 인터페이스",
      "location_quote": "**이벤트 형식**: SEARCH_STANDARDIZATION § 6.3 PerformanceEvent + PageViewEvent (Core 인터페이스)",
      "issue": "PageViewEvent가 Core SoT에 실제 정의되어 있지 않다.",
      "rationale": "SEARCH_STANDARDIZATION § 6.3은 PerformanceEvent만 정의하고, § 7.3은 '추가 표준 이벤트 예정' 상태다. 본 문서가 PageViewEvent를 Core 인터페이스로 참조하면 구현자가 이벤트 필드, 식별자, PII 처리, 중복 기준을 결정할 수 없다.",
      "suggested_fix": "SEARCH_STANDARDIZATION § 6.3 또는 § 7.3에 PageViewEvent·ConversionEvent 등의 타입을 먼저 cascade하고, analytics-reporting § 5.4·§ 6·§ 14에서 해당 타입의 저장 필드와 정규화 매핑을 명시하라. cascade 전까지는 PageViewEvent 참조를 AR-XX 미결정으로 내려야 한다."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 7.3 notifications 인터페이스 cascade / § 8.2 의료법 일평균 이용자 10만 측정",
      "location_quote": "REVIEW_WORKFLOW § 9.1.1 매트릭스에 신규 이벤트 cascade 필요:\n- `analytics-report-ready` (criticality=normal·email immediate·inApp immediate·digest 없음·optOut digestOptOut-allowed)",
      "issue": "신규 NotificationEventType 3종 중 `media-threshold-reached`·`media-threshold-released`의 enum·매트릭스 cascade가 누락되어 있다.",
      "rationale": "REVIEW_WORKFLOW § 9.1 enum은 현재 10개 이벤트만 canonical SoT로 보유한다. 본 문서는 threshold 이벤트를 발송한다고 하지만 § 7.3에는 `analytics-report-ready`만 정책화되어 있어 notifications가 criticality, 수신자, 채널, opt-out, digest, fallback을 산정할 수 없다.",
      "suggested_fix": "REVIEW_WORKFLOW § 9.1 enum에 `analytics-report-ready`, `media-threshold-reached`, `media-threshold-released`를 추가하고 § 9.1.1 매트릭스에 3종 모두의 수신자, 즉시 채널, fallback, digest, criticality, quietHoursPolicy, optOutPolicy를 정의하라. features/notifications.md도 policyVersion append가 필요하다."
    },
    {
      "id": "F-3",
      "severity": "major",
      "section": "§ 7.2 생성·발송 흐름",
      "location_quote": "NotificationEvent 생성 → notifications.notify() 호출:\n   eventType: \"analytics-report-ready\"",
      "issue": "notifications.notify()의 필수 NotificationEvent 계약을 충족하지 않는다.",
      "rationale": "REVIEW_WORKFLOW § 9.2의 NotificationEvent는 `sourceEventId`, `contentRef`, `contentTitle`, `recipients[]`, `criticality`, `createdAt` 등을 요구한다. 본 문서는 eventType과 metadata만 예시해 idempotency와 수신자 fan-out이 불명확하다.",
      "suggested_fix": "`analytics-report-ready` 호출 예시에 결정적 `sourceEventId = hash(instanceId + templateId + windowStart + windowEnd)`, `contentRef=reportInstanceId`, `contentTitle`, recipients 산정 결과, matrix 산정 criticality, metadata schema를 명시하라."
    },
    {
      "id": "F-4",
      "severity": "fail",
      "section": "§ 3 입력·출력 / § 14 내부 데이터 구조",
      "location_quote": "collectionId: string;                 // UUID\nreportInstanceId: string;             // UUID",
      "issue": "`runCollection()`과 `generateReport()`의 idempotency 계약이 없다.",
      "rationale": "스케줄러 재시도, on-demand 중복 클릭, worker 중복 실행 시 매번 새 UUID를 만들면 Raw/Normalized 중복 적재, ReportInstance 중복 생성, 알림 중복 발송이 발생한다. notifications v1.0 모범 사례는 sourceEventId와 Receipt unique로 중복을 닫고 있는데 본 Feature에는 대응 구조가 없다.",
      "suggested_fix": "`CollectionInput`과 `ReportGenerationInput`에 optional idempotencyKey를 두거나 기본 결정 규칙을 정의하라. `CollectionLog`에는 `UNIQUE(instanceId, source, windowStart, windowEnd, mode 또는 idempotencyKey)`를, `ReportInstance`에는 `UNIQUE(instanceId, templateId, windowStart, windowEnd, generationKey)`를 추가하고 duplicate 결과 반환 계약을 명시하라."
    },
    {
      "id": "F-5",
      "severity": "major",
      "section": "§ 14.2 AnalyticsNormalizedMetric",
      "location_quote": "**Constraints**: `UNIQUE(instanceId, date, source, page, query, country, device, medium)` (동일 차원 중복 방지)",
      "issue": "NULL dimension 조합에서 unique 제약이 중복 방지를 보장하지 않는다.",
      "rationale": "PostgreSQL/MySQL 계열에서 nullable 컬럼이 포함된 UNIQUE는 NULL 값을 서로 다른 값처럼 취급할 수 있어 `page=NULL`, `query=NULL` 같은 집계 row가 무한 중복될 수 있다.",
      "suggested_fix": "dimension key를 canonical string/JSON hash로 정규화해 `dimensionKey` NOT NULL을 두고 `UNIQUE(instanceId, date, source, dimensionKey)`로 바꾸거나, DB별 generated column/coalesce 전략을 명시하라. source별 NULL 의미도 `__none` 같은 sentinel로 표준화해야 한다."
    },
    {
      "id": "F-6",
      "severity": "major",
      "section": "§ 3.4 다른 Feature를 위한 데이터 인터페이스 / § 6.1 통합 스키마",
      "location_quote": "dimensions: Array<\"date\" | \"page\" | \"query\" | \"country\" | \"device\">;\nmetrics: Array<\"impressions\" | \"clicks\" | \"ctr\" | \"position\" | \"sessions\" | \"users\" | \"pageviews\">;",
      "issue": "QueryInput이 GA4와 RUM의 차원을 표현하지 못한다.",
      "rationale": "GA4 어댑터는 `source·medium`별 sessions/users/pageviews/conversions/bounceRate를 수집한다고 하지만 QueryInput dimensions에는 `source`, `medium`이 없고 metrics에는 `conversions`, `bounceRate`도 없다. 반대로 GSC의 `position`, `ctr`은 단순 합산이 불가능해 aggregation semantics가 필요하다.",
      "suggested_fix": "dimension enum에 `analyticsSource`, `page`, `query`, `country`, `device`, `trafficSource`, `medium`, `eventName` 등을 구분해 추가하고, metric별 aggregation 규칙을 정의하라. `ctr=clicks/impressions`, `position=impression-weighted average` 같은 파생 메트릭 산식도 queryNormalizedMetrics 계약에 포함해야 한다."
    },
    {
      "id": "F-7",
      "severity": "major",
      "section": "§ 5.1 GSC / § 9.1 핵심 지표",
      "location_quote": "**데이터 지연**: GSC는 통상 2-3일 지연 데이터 제공 ? backfill 시 고려",
      "issue": "source별 데이터 지연을 실제 수집 window와 리포트 생성 정책에 반영하지 않았다.",
      "rationale": "GSC 2-3일, GA4 1일 지연을 단순 주석으로만 적으면 일일 리포트와 MA-02 측정이 미완성 데이터를 사용할 수 있다. 데이터 신선도 목표는 있지만 incomplete date 제외, late-arriving backfill, report watermark가 없다.",
      "suggested_fix": "source별 `availabilityLagDays`와 `watermarkDate`를 정의하라. scheduled collection은 GSC `today-3`까지, GA4 `today-1`까지 기본 수집하고 최근 N일은 재수집하도록 하며 ReportInstance에 `dataCompleteness`와 source별 watermark를 저장하라."
    },
    {
      "id": "F-8",
      "severity": "major",
      "section": "§ 8.1 GA4·RUM 사용자 데이터 익명화 / § 6.2 보존 정책",
      "location_quote": "RUM 이벤트의 IP 주소 ? 수집 시 마지막 octet 마스킹 (`192.168.1.0/24`)\n**Raw 데이터** ... 기본 90일",
      "issue": "PII·개인정보 처리 정책이 GDPR·개인정보보호법 기준으로 부족하다.",
      "rationale": "IPv4 마지막 octet만 예시하고 IPv6, user-agent fingerprinting, consent, DSR 삭제, purpose limitation, raw payload의 개인정보 포함 가능성을 닫지 않았다. Raw 90일 보존도 법적 근거와 최소수집 원칙을 설명하지 않는다.",
      "suggested_fix": "RUM raw ingest 전에 IP를 저장하지 않거나 IPv4 /24, IPv6 /48 등 비가역 마스킹을 명시하고 raw payload에 full IP/clientId/userId 저장 금지를 추가하라. retentionDays에는 법적 근거, 삭제 요청 처리, tenant별 DPA/동의 배너 연동, raw payload field allowlist를 붙여야 한다."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 8.2 의료법 일평균 이용자 10만 측정",
      "location_quote": "`measurementWindowDays`(기본 90일) 평균 계산\n- 결과 → `DailyUserMeasurement` 테이블 저장 (§ 14)",
      "issue": "MA-02 측정 알고리즘이 법적 기준과 운영 기준을 충분히 구분하지 못한다.",
      "rationale": "MEDICAL_AD § 4.2는 '전년도 말 기준 직전 3개월 일평균 이용자 10만명 이상' 매체 판정을 법무 판단으로 기록하라고 한다. 본 문서는 매일 rolling 90일 평균을 계산하지만, 법정 기준일, 전년도 말 기준 산정, calendar month vs 90 days, GA4 users 정의, timezone, bot 제외, 누락일 보정이 없다.",
      "suggested_fix": "`DailyUserMeasurement`와 별개로 `MediaThresholdAssessment`를 두고 `assessmentBasisDate`, `windowStart`, `windowEnd`, `calendarPolicy`, `timezone`, `sourceCompleteness`, `botFilteringPolicy`, `legalBasisNote`를 기록하라. rolling 90일은 운영 조기경보로, 법적 판정값은 클라이언트/legal이 ComplianceRecord에 확정 기록하는 구조로 분리하라."
    },
    {
      "id": "F-10",
      "severity": "fail",
      "section": "§ 8.2 ComplianceRecord 기록",
      "location_quote": "**ComplianceRecord 기록**: 발행 시점에 현재 측정값·임계 도달 여부를 ComplianceRecord 슬롯에 기록",
      "issue": "ComplianceRecord와 priorReviewRequired 워크플로 연동이 불완전하다.",
      "rationale": "REVIEW_WORKFLOW § 8.1은 `priorReviewRequired=true|false` 모두 법무 판정 행위이며 `legalCounsel`, `legalCounselAt`, 근거 attachments 기록을 요구한다. 본 문서는 측정값 슬롯 기록만 말하고 priorReviewRequired 후보 재평가, legal 검수자 투입, priorReviewRequired true 시 publishable 차단 조건과 연결하지 않는다.",
      "suggested_fix": "DATA_MODEL C-10에 `mediaThresholdAssessment` 슬롯을 추가하되, REVIEW_WORKFLOW § 8.1에 'threshold reached/released 또는 측정값 stale 시 legal 판정 큐 생성'을 cascade하라. ComplianceRecord에는 측정값, threshold 여부, source, window, legalCounsel, legalCounselAt, attachments, priorReviewRequired 산정 결과를 함께 저장하도록 명시하라."
    },
    {
      "id": "F-11",
      "severity": "major",
      "section": "§ 8.2 임계 도달·해제 이벤트 트리거",
      "location_quote": "평균 ≥ thresholdDailyUsers(기본 10만) → `media-threshold-reached` notifications 이벤트 발송\n평균 < threshold (해제) → `media-threshold-released` 알림",
      "issue": "threshold 이벤트가 매일 반복 발송될 수 있고 상태 전이 기준이 없다.",
      "rationale": "현재 문구는 threshold 상태가 유지되는 동안 매일 reached/released를 발송할 수 있다. 노이즈 방지, idempotency, hysteresis, 측정 실패 후 재개, 해제 확인 기간이 정의되지 않았다.",
      "suggested_fix": "`DailyUserMeasurement`와 별개로 instance별 current threshold state를 저장하고 `false→true`, `true→false` 전이에만 이벤트를 발송하라. `sourceEventId = media-threshold:{instanceId}:{state}:{basisDate}`를 정의하고 해제는 N일 연속 미만 또는 법무 확인 후 확정 같은 정책을 두라."
    },
    {
      "id": "F-12",
      "severity": "major",
      "section": "§ 2.3 InstanceManifest 통합 / § 4.1 실행 순서",
      "location_quote": "analyticsConfig:                                       # v0.14 cascade\n...\n2. rate limit 평가 ? config.rateLimit.<source>MaxPerHour",
      "issue": "`analyticsConfig`의 위치와 참조 경로가 문서 내에서 일관되지 않다.",
      "rationale": "§ 2.3은 source credential을 top-level `analyticsConfig.sources`에 두고, schedule/retention/reportTemplates/rateLimit은 `features[].config` 아래에 둔다. 하지만 § 4.1은 `InstanceManifest.analyticsConfig.sources.<source>.secretRef`와 `config.rateLimit`을 섞어 쓴다. 사용자 의뢰의 cascade 목록은 `analyticsConfig` 안에 sources·collectionSchedule·retentionDays·reportTemplates·mediaThresholdMeasurement·rateLimit을 모두 넣으라고 해 현재 예시와도 다르다.",
      "suggested_fix": "DATA_MODEL C-08에서 경계를 하나로 확정하라. 권장안: 외부 도구 자격·사이트 식별자는 top-level `analyticsConfig`, Feature 동작 옵션은 `features[name=analytics-reporting].config`로 두고 모든 절의 경로를 그에 맞춰 정정한다. 또는 의뢰 범위대로 전부 `analyticsConfig`에 넣되 features[].config 중복을 제거하라."
    },
    {
      "id": "F-13",
      "severity": "major",
      "section": "§ 4.3 rate limiting·실패 처리 / § 11 빌드 검증",
      "location_quote": "credential 부재 → 수집 skip + warning\n| **fail** | `enabled=true` + `analyticsConfig` 누락, 활성 source의 secretRef 누락",
      "issue": "credential 누락 처리가 runtime warning인지 build fail인지 충돌한다.",
      "rationale": "활성 source의 secretRef 누락은 § 11에서 fail인데 § 4.3은 skip+warning으로 처리한다. 이 상태로는 빌드 검증과 런타임 동작이 서로 다른 결론을 내며 운영자가 누락 credential을 정상 degraded 상태로 오해할 수 있다.",
      "suggested_fix": "활성 source secretRef 누락은 build fail로 통일하라. 런타임 skip+warning은 secret manager 일시 장애, revoked credential, disabled source에만 적용하고 CollectionResult status를 `failed-credential`처럼 분리하라."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 4.3 rate limiting·실패 처리 / § 14.6 AnalyticsApiCallLog",
      "location_quote": "채널별 rate limit 한도 초과 → `skipped-rate-limit` + 다음 윈도우 재시도\nAPI 일시 실패(5xx·timeout) → 재시도 3회 지수 백오프(`[60, 300, 1800]`)",
      "issue": "rate limit과 재시도 전략이 source별 quota 모델과 동시성에 안전하지 않다.",
      "rationale": "GSC·GA4·네이버는 project/property/user/day/hour 등 quota 축이 다를 수 있고, 다중 worker가 동시에 실행되면 단순 maxPerHour 설정만으로는 초과를 막지 못한다. `skipped-rate-limit`도 다음 윈도우 재시도 queue나 lock 구조가 없다.",
      "suggested_fix": "source별 quota bucket key를 정의하고 원자적 token bucket 또는 DB advisory lock/Redis counter를 명시하라. 429는 provider Retry-After를 우선하고, retry queue 테이블 또는 CollectionLog retry state를 추가해야 한다. credential rotation, permission validation, quota exhaustion alert도 분리하라."
    },
    {
      "id": "F-15",
      "severity": "major",
      "section": "§ 10.3 비활성화 / § 11 빌드 검증",
      "location_quote": "비활성 시 keyword-monitoring·search-visibility Feature도 데이터 source 부재 → 정상 동작 불가 (해당 Feature가 build fail)\nnotifications Feature 비활성 + reportTemplates 활성",
      "issue": "다른 Feature 의존성과 notifications 비활성 시 동작이 충분히 모델링되지 않았다.",
      "rationale": "keyword-monitoring·search-visibility가 어떤 manifest dependency로 analytics-reporting을 요구하는지, queryNormalizedMetrics unavailable 시 어떤 오류 계약을 반환하는지 없다. notifications 비활성은 § 11에서 reportTemplates 활성 시 fail이지만, 리포트 artifact 생성만 허용할지 완전 금지할지도 불명확하다.",
      "suggested_fix": "Feature dependency 검증 규칙을 `requiresFeature: analytics-reporting` 형태로 명시하고, 비활성 시 dependent Feature build fail 메시지와 runtime error code를 정의하라. reportTemplates는 `delivery.enabled`와 `artifactOnly`를 분리하거나, notifications 비활성 시 `reportTemplates[].enabled=true`는 fail로 통일하라."
    },
    {
      "id": "F-16",
      "severity": "minor",
      "section": "§ 3.1 단일 엔트리포인트",
      "location_quote": "### 3.1 단일 엔트리포인트 ? `runCollection()` + `generateReport()`\n본 Feature는 **2개 엔트리포인트** 노출:",
      "issue": "절 제목이 내용과 모순된다.",
      "rationale": "문서 자체 정합성 문제지만 구현자에게는 export surface가 단일인지 복수인지 혼동을 준다.",
      "suggested_fix": "제목을 `### 3.1 엔트리포인트 2종`으로 바꾸고, `queryNormalizedMetrics()`는 runtime command가 아니라 read API export라는 지위를 별도로 명시하라."
    },
    {
      "id": "F-17",
      "severity": "major",
      "section": "§ 14.1 AnalyticsRawRecord / § 6.2 보존 정책",
      "location_quote": "`payload` | JSON | ? ? source API 원본 응답\n**Raw 데이터** ... 감사·재처리용",
      "issue": "raw payload 저장 범위와 마스킹 규칙이 없다.",
      "rationale": "외부 API 원본 응답을 그대로 저장하면 query 문자열, URL path, geo/device 조합, provider error body, 잠재 식별자 등이 raw DB에 남을 수 있다. § 8.1의 aggregated 데이터만 수집한다는 설명과 Raw 원본 보존이 충돌할 수 있다.",
      "suggested_fix": "RawRecord payload는 source별 allowlist schema로 제한하고, credential/provider response body/user identifiers/full URL querystring 저장 금지를 명시하라. `payloadRedactionVersion`, `containsPersonalData=false` 검증 필드, raw purge job을 § 14에 추가하라."
    },
    {
      "id": "F-18",
      "severity": "major",
      "section": "§ 12 미결정 사항",
      "location_quote": "AR-03 | 다른 Feature가 데이터 조회하는 인터페이스 ? DB 직접 vs API gateway | M2+ 운영 정책",
      "issue": "이미 § 3.4에서 DB 직접 조회 + query 함수 export를 SoT로 선언했는데, 같은 사안을 미결정으로 남겨두었다.",
      "rationale": "§ 1.2는 본 문서가 다른 Feature를 위한 데이터 인터페이스 SoT라고 선언한다. 그런데 AR-03이 DB 직접 vs API gateway를 M2+ 미결정으로 남기면 keyword-monitoring·search-visibility가 어떤 계약에 의존해야 하는지 안정화되지 않는다.",
      "suggested_fix": "v0.1에서 최소 계약을 확정하라. 권장안은 외부 Feature는 `queryNormalizedMetrics()`만 사용하고 DB 직접 조회는 내부 최적화로 제한하는 것이다. DB 직접 조회를 허용하려면 view/schema versioning과 migration compatibility 정책을 추가하라."
    }
  ]
}