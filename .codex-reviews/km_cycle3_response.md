{
  "status": "needs-fourth-cycle",
  "versionReviewed": "docs/features/keyword-monitoring.md v0.3",
  "overallAssessment": {
    "closeability": "v1.0 구조는 대체로 닫혀가지만, audit cascade·rank-bucket 원자성·reactivate 동시성·read API contract 잔류가 있어 바로 closeable은 아님",
    "expectedThirdCycleFindings": 7,
    "expectedFourthCycleResidual": "2-4 minor",
    "fifthCycleCloseLikelihood": "high"
  },
  "findings": [
    {
      "id": "KMF3-01",
      "severity": "high",
      "category": "migration-audit",
      "refs": [
        "docs/features/keyword-monitoring.md:452",
        "docs/admin/REVIEW_WORKFLOW.md:626",
        "docs/admin/REVIEW_WORKFLOW.md:638"
      ],
      "issue": "§10.3은 dryRun=false 시 `keyword-tracking-target-migrated-v02-v03` audit log를 남긴다고 하지만, REVIEW_WORKFLOW §10.2.1 AuditAction enum에는 해당 action이 없다. v1.x patch cascade 가능하다는 문구는 closed enum 기반 audit log와 충돌한다.",
      "impact": "v0.1/v0.2 운영 데이터 보유 인스턴스가 v1.0 업그레이드 중 migration을 실행하면 audit insert가 enum validation/build/runtime에서 실패하거나, 반대로 audit 누락 상태로 migration이 완료된다.",
      "recommendation": "KM-16을 v1.0 before-close cascade로 승격해 REVIEW_WORKFLOW §10.2.1에 `keyword-tracking-target-migrated-v02-v03`를 추가하고, §3.1.1 audit contract에도 contentRef/metadata shape를 명시한다. v1.x patch로 미룰 경우 v1.0 migration은 audit를 요구하지 않는 별도 non-audit 운영 로그로 낮춰야 한다."
    },
    {
      "id": "KMF3-02",
      "severity": "high",
      "category": "dedupe-concurrency",
      "refs": [
        "docs/features/keyword-monitoring.md:361",
        "docs/features/keyword-monitoring.md:365",
        "docs/features/keyword-monitoring.md:400"
      ],
      "issue": "rank-bucket outbox sourceId를 `transitionEventId`로 바꾼 것은 방향은 맞지만, `KeywordRankBucketState.lastTransitionEventId` 갱신과 outbox insert의 원자성·락 순서가 정의되지 않았다. 또한 hash input의 `detectedAt`이 실행 시각이면 같은 logical transition도 재실행마다 다른 ID가 될 수 있다.",
      "impact": "동시 detector 실행 또는 forceRefresh에서 동일 transition이 중복 enqueue되거나, state는 갱신됐지만 outbox insert가 실패한 반쪽 상태가 생길 수 있다.",
      "recommendation": "`keywordTargetId` 범위 row lock 또는 advisory lock 아래에서 state transition 판정, state update, outbox insert를 단일 transaction으로 묶는다. `transitionEventId`는 `transitionDate/windowEnd + previousBucket + currentBucket + rankBucketConfigVersion`처럼 deterministic logical time을 사용하고, `UPDATE ... WHERE lastTransitionEventId IS DISTINCT FROM ?` 또는 equivalent compare-and-set을 명시한다."
    },
    {
      "id": "KMF3-03",
      "severity": "medium",
      "category": "reactivate-unique",
      "refs": [
        "docs/features/keyword-monitoring.md:525",
        "docs/features/keyword-monitoring.md:527",
        "docs/features/keyword-monitoring.md:531",
        "docs/features/keyword-monitoring.md:477"
      ],
      "issue": "partial unique/generated column 대체 자체는 정합하지만, inactive row가 동일 tuple로 여러 개 존재할 수 있는 상태에서 reactivate 대상 선택과 동시 register 처리 규칙이 없다. §11.2의 `registerKeyword` 중복 fail도 inactive reactivate 정책과 문구상 충돌한다.",
      "impact": "두 요청이 서로 다른 inactive row를 동시에 active=true로 올리면 unique violation이 발생하고, 어떤 ID를 유지해야 하는지도 비결정적이다.",
      "recommendation": "동일 `(instanceId, keyword, country, device, searchEngine)`에 대해 advisory lock을 잡고, inactive 후보는 `registeredAt DESC, id ASC` 같은 deterministic order로 1건만 reactivate한다고 명시한다. §11.2는 'active duplicate only fail; inactive duplicate exists -> reactivate path'로 정정한다."
    },
    {
      "id": "KMF3-04",
      "severity": "medium",
      "category": "read-api-contract",
      "refs": [
        "docs/features/keyword-monitoring.md:248",
        "docs/features/keyword-monitoring.md:281",
        "docs/features/keyword-monitoring.md:282",
        "docs/features/keyword-monitoring.md:571"
      ],
      "issue": "`ctr-up`은 outbox 미enqueue이면서 `queryKeywordSignals().anomaliesInWindow[]`에는 포함되고 client가 `notify=false`를 구분해야 한다. 하지만 read API response type이나 KeywordAnomalyRecord metadata shape에 `notify`/`enqueueEligible` 필드가 없다.",
      "impact": "대시보드가 `ctr-up`을 알림 대상처럼 렌더링하거나, 반대로 eventType matrix만 보고 `keyword-monitoring-ctr-anomaly`를 발송 대상으로 오판할 수 있다.",
      "recommendation": "`anomaliesInWindow[]` item contract에 `notify: boolean`, `notificationSuppressionReason?: \"not-enqueue-eligible\" | ...` 또는 `enqueueEligible: false`를 명시한다. `ctr-up`은 `notify=false` 고정, `ctr-down`은 mode/matrix에 따라 true로 산정한다고 분리한다."
    },
    {
      "id": "KMF3-05",
      "severity": "medium",
      "category": "cross-feature-transaction",
      "refs": [
        "docs/features/keyword-monitoring.md:33",
        "docs/features/keyword-monitoring.md:34",
        "docs/features/keyword-monitoring.md:36",
        "docs/features/search-visibility.md:672"
      ],
      "issue": "`correlatedSearchVisibilityAnomalyId` lookup이 'transaction 안 insert 직전 1회'라고만 되어 있어 cross-Feature read 권한과 isolation boundary가 불명확하다.",
      "impact": "동일 cycle에서 search-visibility anomaly가 아직 commit되지 않았으면 매칭 누락이 정상인지 결함인지 모호하고, feature ownership 관점에서 keyword-monitoring이 search-visibility table을 직접 읽어도 되는지 불명확하다.",
      "recommendation": "내부 service principal이 committed search-visibility AnomalyRecord만 read 가능하다고 명시하고, isolation은 READ COMMITTED 기준 best-effort로 둔다. 동일 transaction cross-feature write/read는 금지하거나 명시 API/view를 통해서만 조회하도록 경계를 닫는다."
    },
    {
      "id": "KMF3-06",
      "severity": "medium",
      "category": "sot-cascade",
      "refs": [
        "docs/features/keyword-monitoring.md:313",
        "docs/features/keyword-monitoring.md:323",
        "docs/core/DATA_MODEL.md:670",
        "docs/features/search-visibility.md:125"
      ],
      "issue": "`SEARCH_ENGINE_TO_ANALYTICS_SOURCE`는 KeywordTrackingTarget.searchEngine enum과만 exhaustive validation한다. 그러나 search-visibility `SerpCrawlerApprovedScope.searchEngines`도 같은 검색엔진 universe를 쓰므로, v1.x에서 serp-crawler 활성 시 세 enum/상수 간 drift가 생길 수 있다.",
      "impact": "예를 들어 search-visibility approvedScope에는 새 검색엔진이 추가됐지만 keyword-monitoring mapping에는 없거나 반대인 상태가 build를 통과할 수 있다.",
      "recommendation": "검색엔진 enum의 canonical SoT를 하나로 지정하고, `KeywordTrackingTarget.searchEngine`, `SerpCrawlerApprovedScope.searchEngines`, `SEARCH_ENGINE_TO_ANALYTICS_SOURCE` 키 집합의 관계를 build validation 대상으로 명시한다. analytics source가 없는 검색엔진은 v1.0/v1.x에서 build fail 또는 unsupported로 분리한다."
    },
    {
      "id": "KMF3-07",
      "severity": "low",
      "category": "build-fail-completeness",
      "refs": [
        "docs/features/keyword-monitoring.md:45",
        "docs/features/keyword-monitoring.md:460",
        "docs/features/keyword-monitoring.md:473",
        "docs/features/keyword-monitoring.md:475"
      ],
      "issue": "§11.1 build fail은 v0.3 정정 일부만 포함한다. audit cascade 존재성, read API `notify=false` contract, generated-column fallback schema, rank-bucket transition atomicity처럼 v0.3에서 새로 생긴 불변조건은 build/runtime validation 대상으로 분류되지 않았다.",
      "impact": "§1.1은 build/runtime fail 룰 추가·강화를 MAJOR로 관리한다고 하지만, 어떤 v0.3 정정이 build fail인지 runtime invariant인지 경계가 빠져 후속 구현자가 임의 해석할 수 있다.",
      "recommendation": "§11을 build-time / runtime / migration-time validation으로 나누고, 각 v0.3 정정 사항을 최소 하나의 검증 항목이나 '문서-only invariant'로 매핑한다."
    }
  ],
  "residualDecisionReview": {
    "KM-01": "v1.x 적절",
    "KM-02": "운영 누적 후 적절",
    "KM-03": "운영 정책으로 적절",
    "KM-04": "M2+ 적절",
    "KM-05": "M3+ 적절. 단 searchEngine/locale cascade는 canonical enum SoT 필요",
    "KM-06": "v1.x 적절",
    "KM-07": "v1.x 적절. zeroBaselinePolicy 추가와 별도 policyVersion cascade 필요",
    "KM-14": "v1.x 적절. v1.0 enabled=true build fail 유지 가능",
    "KM-15": "UI 운영 후속 적절",
    "KM-16": "현재 분류 부적절. v1.0 migration audit를 실제로 남길 거면 before-close cascade 필요"
  },
  "closeRecommendation": {
    "status": "needs-fourth-cycle",
    "blockingBeforeV1": [
      "KM-16 audit cascade 처리",
      "rank-bucket transition 원자성 및 deterministic transitionEventId",
      "reactivate 동시성/중복 runtime 문구 정정",
      "ctr-up read API notify=false contract"
    ],
    "nonBlockingButPatchRecommended": [
      "correlatedSearchVisibilityAnomalyId transaction/read 권한 경계",
      "검색엔진 enum/mapping cross-Feature validation",
      "§11 validation coverage matrix"
    ]
  }
}