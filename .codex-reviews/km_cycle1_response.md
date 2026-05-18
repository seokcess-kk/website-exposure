{
  "summary": "v0.1은 Feature의 방향성은 맞지만, 현재 상태로는 SoT cascade를 완료한 명세처럼 보이면서 실제 상위 문서에는 반영되지 않은 항목이 많고, analytics-reporting read API 사용 계약과 알림/outbox 데이터 모델에 치명적인 빈틈이 있다. 특히 REVIEW_WORKFLOW 이벤트 8종, DATA_MODEL C-08 v0.17, AuditAction 2종은 아직 SoT에 없으므로 본 문서가 단독으로 안정판 역할을 할 수 없고, queryNormalizedMetrics 호출은 locale·device·searchEngine 차원을 필터링한다고 쓰면서 실제 API 차원에는 locale/searchEngine이 없어 구현 불가능하다. serp-crawler artifact, monitoring-failed outbox, register/unregister 감사 흐름도 v1.0 운영 안정성 기준에는 부족하다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 2.2, § 6.1",
      "location_quote": "| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 5종 cascade 필요 |\n본 Feature는 다음 5종 신규 이벤트 cascade 요구:",
      "issue": "신규 NotificationEventType 수가 5종으로 표기되지만 실제 표는 8종이다.",
      "rationale": "REVIEW_WORKFLOW § 9.1 enum과 § 9.1.1 매트릭스에는 keyword-monitoring 이벤트가 아직 없고, 본 문서 내부에서도 5종/8종이 충돌한다. notifications 패키지 policyVersion 병렬 보관 및 매트릭스 cascade 기준으로는 이벤트 수와 행 단위가 정확해야 한다.",
      "suggested_fix": "§ 2.2와 § 6.1을 모두 '8종 cascade 필요'로 정정하고, REVIEW_WORKFLOW § 9.1 enum 및 § 9.1.1 매트릭스에 8행을 명시하는 cascade 항목을 별도 체크리스트로 추가하라."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 2.3, § 10.1",
      "location_quote": "keywordMonitoringConfig:                                # DATA_MODEL C-08 v0.17 cascade\nkeywordMonitoringPolicyVersion: \"km-2026-05-14\"",
      "issue": "DATA_MODEL C-08에는 아직 keywordMonitoringConfig와 keywordMonitoringPolicyVersion이 없다.",
      "rationale": "현재 DATA_MODEL은 v0.16까지 searchVisibilityConfig/searchVisibilityPolicyVersion만 정의한다. 본 문서가 v0.17 cascade를 완료된 SoT처럼 참조하면 manifest validation과 빌드 게이트의 기준이 부재한다.",
      "suggested_fix": "§ 2.2/§ 2.3/§ 11에 'DATA_MODEL C-08 v0.17 cascade 필요'라고 명확히 쓰고, C-08에 KeywordMonitoringConfig 타입과 keywordMonitoringPolicyVersion 필드를 추가하는 후속 변경을 필수 blocking item으로 올려라."
    },
    {
      "id": "F-3",
      "severity": "critical",
      "section": "§ 5.1 analytics-derived",
      "location_quote": "queryNormalizedMetrics 호출 — keywordTargetId의 keyword·locale·device·searchEngine로 필터:\nfilters: [{ dimension: \"query\", op: \"in\", value: trackedKeywordsForCurrentLocaleDevice }],",
      "issue": "locale과 searchEngine으로 필터한다고 쓰지만 analytics-reporting의 QueryDimension에는 locale/searchEngine이 없다.",
      "rationale": "analytics-reporting v1.0 QueryDimension은 date/source/page/query/country/device/trafficSource/medium/eventName만 제공한다. locale은 country로 대체할지 별도 차원을 추가할지 불명확하고, searchEngine은 source(gsc/naver-search-advisor)와도 1:1로 동일하지 않다.",
      "suggested_fix": "v0.1에서는 지원 가능한 필터를 query+device+source로 제한하고 locale은 country 매핑 정책을 명시하라. searchEngine 필터가 필요하면 analytics-reporting QueryDimension 확장 MAJOR cascade로 분리하라."
    },
    {
      "id": "F-4",
      "severity": "major",
      "section": "§ 5.1 analytics-derived",
      "location_quote": "dimensions: [\"date\", \"query\", \"source\"],\n- query → KeywordTrackingTarget 매핑은 (keyword + locale + device) 기준",
      "issue": "device 기준 매핑을 요구하면서 queryNormalizedMetrics 호출 dimensions와 filters에 device가 빠져 있다.",
      "rationale": "KeywordTrackingTarget UNIQUE가 device를 포함하므로 desktop/mobile 별 시계열이 분리되어야 한다. 현재 호출은 source별 row만 분리하고 device별 row를 분리하지 않아 target 매핑이 깨진다.",
      "suggested_fix": "dimensions에 \"device\"를 추가하고, target별 실행이면 filters에 { dimension: \"device\", op: \"equals\", value: target.device }를 넣도록 계약을 수정하라."
    },
    {
      "id": "F-5",
      "severity": "major",
      "section": "§ 3.2, § 13.1",
      "location_quote": "targetSearchEngines: (\"naver\" | \"google\")[];\n**Constraints**: `UNIQUE(instanceId, keyword, locale, device)`",
      "issue": "targetSearchEngines가 배열인데 uniqueness와 queryHash에는 searchEngine이 포함되지 않는다.",
      "rationale": "동일 keyword/locale/device를 google만 추적하는 target과 naver만 추적하는 target으로 분리할 수 없고, 배열 변경 시 기존 snapshot/source lineage가 모호해진다. sourceFilter도 gsc/naver-search-advisor 두 source를 동시에 조회하므로 엔진별 상태와 알림 dedupe가 섞일 수 있다.",
      "suggested_fix": "v1.0에서는 target을 keyword+locale+device+searchEngine 단위로 정규화하거나, 배열 유지 시 KeywordSignalSnapshot과 AnomalyRecord에 searchEngine dimension을 필수 저장하고 queryHash 산정에도 canonical targetSearchEngines를 포함하라."
    },
    {
      "id": "F-6",
      "severity": "fail",
      "section": "§ 6.3, § 13.7",
      "location_quote": "| `keyword-monitoring-monitoring-failed` | `\"instance:\" + instanceId` (synthetic) | `\"Keyword monitoring failed (${date})\"` |\n| `anomalyRecordId` | UUID | ✅ — FK |",
      "issue": "monitoring-failed 이벤트는 anomalyRecordId가 없는데 outbox schema는 anomalyRecordId를 required FK로 강제한다.",
      "rationale": "search-visibility는 monitoring-failed에 synthetic contentRef를 쓰지만 outbox의 source가 anomaly인지 monitoringLog인지 명확히 해야 한다. 현재 schema로는 monitoring-failed를 enqueue할 수 없다.",
      "suggested_fix": "KeywordAnomalyNotificationOutbox를 nullable anomalyRecordId + sourceKind/sourceId로 일반화하거나, monitoring-failed 전용 outbox/MonitoringLog FK를 추가하라. UNIQUE도 anomalyRecordId 단독이 아니라 sourceKind+sourceId+eventType 기준으로 바꿔라."
    },
    {
      "id": "F-7",
      "severity": "major",
      "section": "§ 6.3",
      "location_quote": "| `keyword-monitoring-rank-*`·`-impressions-*`·`-ctr-*` | `anomalyRecordId` | `\"${signal} ${direction} — ${keyword}\"` |",
      "issue": "NotificationEvent 필드 매핑에서 rank-bucket 이벤트 2종이 누락되어 있다.",
      "rationale": "§ 6.1은 keyword-monitoring-rank-bucket-improved/dropped를 이벤트로 정의하지만 § 6.3 wildcard에는 포함되지 않는다. eventType별 metadata 필수 필드도 rank bucket의 previous/current bucket, rank nullability, direction을 보장하지 않는다.",
      "suggested_fix": "rank-bucket 이벤트 행을 별도 추가하고 metadata에 keywordTargetId, previousBucket, currentBucket, previousRank/currentRank, rankBucketConfigVersion, direction, streak를 필수로 명시하라."
    },
    {
      "id": "F-8",
      "severity": "major",
      "section": "§ 6.1",
      "location_quote": "| `keyword-monitoring-monitoring-failed` | high | inApp + email | — | high |",
      "issue": "severity와 criticality 개념이 섞여 있고 severity='high'가 다른 anomaly severity 체계와 맞지 않는다.",
      "rationale": "문서의 신호 severity는 info/warning/critical 중심인데 notifications의 NotificationEvent.criticality는 critical/high/normal이다. monitoring-failed의 'high'는 severity인지 criticality인지 불분명해 매트릭스 생성 시 타입 충돌이 난다.",
      "suggested_fix": "표 컬럼을 anomalySeverity와 notificationCriticality로 분리하라. monitoring-failed는 anomalySeverity 없음 또는 operationalSeverity='warning' 등으로 두고, criticality='high'로만 매핑하라."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 4.1, § 2.3",
      "location_quote": "algorithm: \"moving-average\"                     # moving-average | ewma\n- **detector**: moving-average + threshold",
      "issue": "config는 EWMA를 허용하지만 detector 정의는 moving-average만 명세한다.",
      "rationale": "detector 알고리즘 변경은 § 1.1에서 MAJOR + policyVersion 신규로 분류된다. 그런데 허용 enum에 EWMA가 있으면서 산식, alpha, warmup, 결측 처리, hysteresis 적용 순서가 없다.",
      "suggested_fix": "v0.1에서는 algorithm enum을 moving-average로 제한하거나, EWMA 산식(alpha, warmupDays, missing-data hold, baseline reset)을 § 4.1에 완전하게 추가하라."
    },
    {
      "id": "F-10",
      "severity": "major",
      "section": "§ 4.2, § 4.3",
      "location_quote": "deltaPercentage = (observed - baseline) / baseline × 100\nobservedCtr이 평균 대비 |z| ≥ 2.5 → `keyword-monitoring-ctr-anomaly`",
      "issue": "zero baseline, 낮은 표본, 분산 0, CTR 방향성이 정의되지 않았다.",
      "rationale": "impressions baseline이 0이면 delta 산식이 무한대가 되고, CTR z-score는 baseline 분산이 0인 경우 계산 불가하다. CTR anomaly는 direction이 detectorOutput에 없어 CTR 개선과 악화를 같은 warning으로 처리한다.",
      "suggested_fix": "baseline=0 처리 규칙을 first-observed/hold/spike 별도로 정의하고, CTR은 minImpressionsForCtrEval 외에 minBaselineDays, minVariance 또는 Wilson/binomial 기준을 추가하라. detectorOutput에 direction='ctr-up'|'ctr-down'을 넣고 알림 정책을 분리하라."
    },
    {
      "id": "F-11",
      "severity": "major",
      "section": "§ 7",
      "location_quote": "search-visibility § 6.3 패턴 동일:\n- key = `hash(instanceId + signal + keywordTargetId + severity + keywordMonitoringPolicyVersion)`",
      "issue": "state machine 신호와 suppression ledger 적용 범위가 search-visibility 패턴과 다르게 불명확하다.",
      "rationale": "search-visibility는 transition형 signal은 VisibilityState로 dedupe하고, ledger는 state machine 미사용 signal에 적용한다고 명시한다. keyword-monitoring은 rankBucketTransition에도 ledger를 적용하는 듯 쓰여 state 전이 dedupe와 suppression이 중복된다.",
      "suggested_fix": "signal별로 dedupe 주체를 표로 나누라. keywordRank/impressions/CTR은 suppression ledger, rankBucketTransition은 KeywordRankBucketState + lastTransitionEventId로 dedupe한다고 명시하거나, ledger를 쓸 경우 state transition과의 우선순위를 정의하라."
    },
    {
      "id": "F-12",
      "severity": "major",
      "section": "§ 3.1, § 9",
      "location_quote": "| 운영 command | `registerKeyword(target)` | 키워드 추적 등록 (어드민 UI) |\nsearch-visibility § 9 패턴 동일 — `resolutionStatus` 5종 ..., audit log `keyword-anomaly-resolution-updated`",
      "issue": "registerKeyword/unregisterKeyword의 권한, 상태 전이, 감사 로그가 정의되지 않았다.",
      "rationale": "사용자 지정 키워드 목록은 알림 발생 범위를 직접 바꾸는 운영 데이터다. 누가 등록/해제할 수 있는지, unregister가 hard delete인지 active=false인지, 기존 snapshot/anomaly 보존과 audit action이 무엇인지 빠져 있다.",
      "suggested_fix": "register/unregister 권한을 operator/super-admin 등으로 명시하고, unregister는 기본 active=false soft delete로 정의하라. AuditAction에 keyword-tracking-target-registered/unregistered 또는 단일 keyword-tracking-target-updated를 cascade하고 metadata shape를 추가하라."
    },
    {
      "id": "F-13",
      "severity": "major",
      "section": "§ 5.2, § 12, § 13",
      "location_quote": "artifact 보존·인스턴스 격리·IAM 정책은 search-visibility § 13.7 패턴 동일 적용 (별도 KeywordMonitoringSerpArtifact 테이블 — § 13에 미포함, 옵션 활성 시 후속 추가)\n| KM-14 | KeywordMonitoringSerpArtifact 테이블 ... | serp-crawler 활성 운영 시작 시 |",
      "issue": "serp-crawler를 v1.0 옵션으로 허용하면서 artifact 테이블을 후속 미결정으로 둔다.",
      "rationale": "serp-crawler.enabled=true가 build-pass 가능한 설정으로 명세되어 있는데 artifact metadata, parserVersion, object key, IAM condition, retention purge의 SoT가 없다. search-visibility SerpCrawlerArtifact를 재사용할지 별도 테이블을 만들지도 결정되지 않았다.",
      "suggested_fix": "v0.1에서 둘 중 하나를 선택하라. 공용 SerpCrawlerArtifact를 feature discriminator와 targetKind='keywordTarget'로 확장하거나, KeywordMonitoringSerpArtifact를 § 13 인벤토리에 포함해 9 tables로 정정하라. 후속으로 둘 경우 serp-crawler.enabled=true는 build fail로 막아라."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 11.2, § 8.2",
      "location_quote": "- KeywordTrackingTarget 개수 > maxKeywordsPerInstance (registerKeyword 시점 fail)\n- 추적 키워드 개수 > maxKeywordsPerInstance (관리 경고)",
      "issue": "maxKeywordsPerInstance 초과가 runtime fail인지 관리 경고인지 충돌한다.",
      "rationale": "registerKeyword에서 초과를 실패시키면 active count가 max를 초과할 수 없어 § 8.2 alert 조건은 정상 경로에서 발생하지 않는다. 반대로 import/migration 등으로 초과가 가능하면 reconcile 정책이 필요하다.",
      "suggested_fix": "registerKeyword 초과는 runtime validation fail로 유지하고, § 8.2는 'DB drift 또는 manual import로 초과 감지 시 external sink critical'처럼 별도 drift alert로 바꾸라. 90% warning은 그대로 유지하라."
    },
    {
      "id": "F-15",
      "severity": "major",
      "section": "§ 6.4, § 12",
      "location_quote": "- audit log: `keyword-monitoring-retroactive-enqueue-requested` (REVIEW_WORKFLOW § 10.2.1 후속 cascade — KM-13 신설)\n| KM-12 | `keyword-anomaly-resolution-updated` audit cascade | REVIEW_WORKFLOW § 10.2.1 후속 |",
      "issue": "필수 운영 audit cascade가 미결정 사항으로 밀려 있다.",
      "rationale": "retroactive enqueue와 anomaly resolution은 운영 영향이 큰 명시 액션이다. search-visibility는 retroactive audit action을 v1.0에서 cascade 완료했는데, keyword-monitoring은 같은 패턴을 차용한다고 하면서 필수 AuditAction을 후속으로 둔다.",
      "suggested_fix": "KM-12/KM-13을 미결정이 아니라 v0.1 blocking cascade로 승격하라. REVIEW_WORKFLOW § 10.2.1에 두 AuditAction과 contentRef, metadata, actorRole 규칙을 명시하라."
    },
    {
      "id": "F-16",
      "severity": "major",
      "section": "§ 0, § 13",
      "location_quote": "**DB 인벤토리**: 8 tables — KeywordTrackingTarget·KeywordSignalSnapshot·MonitoringLog·MonitoringSourceAttempt·KeywordMonitoringCollectionRetryQueue·KeywordAnomalyRecord·KeywordRankBucketState·KeywordAnomalyNotificationOutbox\n### 13.8 `MonitoringSourceAttempt`",
      "issue": "§ 13에서 MonitoringSourceAttempt가 § 13.3과 § 13.8에 중복 등장한다.",
      "rationale": "인벤토리는 8 tables라고 하지만 § 13.3은 MonitoringLog·MonitoringSourceAttempt를 묶고, § 13.8에서 MonitoringSourceAttempt를 다시 정의한다. 구현자가 8개인지 9개인지 혼동할 수 있다.",
      "suggested_fix": "§ 13.8을 제거하거나 § 13.3을 MonitoringLog만으로 분리하라. serp artifact를 포함하기로 하면 § 0과 § 13 인벤토리를 9 tables로 함께 정정하라."
    },
    {
      "id": "F-17",
      "severity": "minor",
      "section": "§ 12",
      "location_quote": "| KM-05 | 다국어 키워드 (영문·일문) 추적 | M3+ |\n| KM-06 | locale·device 다중 등록 — 동일 keyword 여러 변형 일괄 관리 | v1.x |",
      "issue": "미결정 항목이 현재 스키마와 일부 중복된다.",
      "rationale": "KeywordTrackingTarget은 이미 locale과 device를 필수 필드로 갖고 UNIQUE에도 포함한다. '다국어 키워드'와 'locale·device 다중 등록'이 무엇을 추가로 의미하는지 모호하다.",
      "suggested_fix": "KM-05는 UI/운영 일괄 등록 및 번역 키워드 그룹 관리로, KM-06은 KeywordTargetGroup 같은 bulk management 기능으로 재정의하라. 단일 target의 locale/device 지원은 v0.1 범위로 명시하라."
    },
    {
      "id": "F-18",
      "severity": "major",
      "section": "§ 0, § 2.3",
      "location_quote": "**vs search-visibility** ... 두 Feature 공존 가능\nmonitoringSchedule: daily: \"05:00\" # analytics-reporting(03:00)·search-visibility(04:00) 이후",
      "issue": "두 Feature 동시 활성 시 중복 알림과 데이터 정합 정책이 없다.",
      "rationale": "사용자가 search-visibility 자동 query set에 포함된 키워드를 keyword-monitoring target으로도 등록하면 같은 rank bucket drop이 두 Feature에서 별도 알림으로 발생할 수 있다. 공존 가능이라고만 쓰면 운영자는 중복을 정상인지 장애인지 판단할 수 없다.",
      "suggested_fix": "중복 허용 정책을 명시하라. 예: keyword-monitoring은 사용자 명시 target이므로 중복 알림을 허용하되 metadata에 correlatedSearchVisibilityAnomalyId를 best-effort로 붙이거나, 동일 query/source/date 중복 시 dashboard에서 묶어 보여준다고 정의하라."
    }
  ]
}