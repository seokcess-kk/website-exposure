{
  "schemaVersion": "auto-review-v1",
  "document": "docs/features/keyword-monitoring.md",
  "reviewedVersion": "v0.2",
  "verdict": "changes_required",
  "summary": {
    "cascadeStatus": "REVIEW_WORKFLOW enum/matrix 8종 및 AuditAction 4종은 반영됨. DATA_MODEL C-08도 keywordMonitoringConfig와 keywordMonitoringPolicyVersion은 반영됨.",
    "mainRisk": "v0.2 정정 과정에서 serpCrawler build fail, soft delete 재등록, rank-bucket outbox dedupe, audit payload 명세에 새 불일치가 남아 있음."
  },
  "findings": [
    {
      "id": "KM2-01",
      "severity": "blocker",
      "category": "external-sot-contradiction",
      "title": "KeywordMonitoringConfig.serpCrawler build fail 규칙이 DATA_MODEL C-08과 keyword-monitoring 본문에서 충돌",
      "evidence": [
        "docs/features/keyword-monitoring.md:20",
        "docs/features/keyword-monitoring.md:296",
        "docs/features/keyword-monitoring.md:408",
        "docs/core/DATA_MODEL.md:660"
      ],
      "problem": "keyword-monitoring은 v1.0에서 serpCrawler.enabled=true 자체를 build fail로 정의한다. 반면 DATA_MODEL C-08 KeywordMonitoringConfig는 enabled=true + legalApproved/승인자/시각 누락 시 build fail이라고 되어 있어, 승인 정보가 있으면 build-pass처럼 해석된다.",
      "impact": "manifest validator 구현자가 DATA_MODEL을 따르면 v1.0에서 serpCrawler.enabled=true를 통과시킬 수 있다. 이는 F-13의 핵심 결정과 직접 충돌한다.",
      "recommendation": "DATA_MODEL C-08 KeywordMonitoringConfig 설명을 v1.0 한정으로 `enabled=true -> build fail regardless of legalApproved`로 정정하고, legalApproved/approvedScope 게이트는 v1.x 활성화 이후 규칙이라고 분리하라."
    },
    {
      "id": "KM2-02",
      "severity": "high",
      "category": "data-model",
      "title": "soft delete 후 동일 키워드 재등록이 UNIQUE 제약과 충돌",
      "evidence": [
        "docs/features/keyword-monitoring.md:190",
        "docs/features/keyword-monitoring.md:208",
        "docs/features/keyword-monitoring.md:420",
        "docs/features/keyword-monitoring.md:463"
      ],
      "problem": "unregisterKeyword는 active=false soft delete인데, UNIQUE(instanceId, keyword, country, device, searchEngine)는 active를 포함하지 않는다. 따라서 동일 tuple 재등록은 비활성 row와 충돌한다.",
      "impact": "운영자가 키워드를 해제했다가 다시 등록하는 정상 워크플로가 영구 차단된다.",
      "recommendation": "둘 중 하나를 명시하라: 1) partial unique `UNIQUE(...) WHERE active=true`, 2) 재등록은 기존 inactive target을 reactivate하며 registeredAt/registeredBy와 audit을 갱신. queryHash와 기존 snapshot/anomaly 연결 정책도 함께 적어야 한다."
    },
    {
      "id": "KM2-03",
      "severity": "high",
      "category": "outbox-dedupe",
      "title": "rank-bucket-state outbox UNIQUE가 같은 target의 이후 동일 방향 transition을 영구 차단",
      "evidence": [
        "docs/features/keyword-monitoring.md:329",
        "docs/features/keyword-monitoring.md:330",
        "docs/features/keyword-monitoring.md:339",
        "docs/features/keyword-monitoring.md:523"
      ],
      "problem": "rank bucket 이벤트는 sourceKind='rank-bucket-state' + sourceId=keywordTargetId로 outbox를 만들고 UNIQUE(sourceKind, sourceId, eventType)를 둔다. 그러면 한 keywordTarget에서 `rank-bucket-dropped`가 한 번 발생한 뒤, 나중에 다른 bucket 하락이 발생해도 같은 eventType이라 enqueue가 막힌다.",
      "impact": "state machine dedupe가 의도한 '동일 transition 중복 방지'가 아니라 'target당 방향별 평생 1회 발송'이 된다.",
      "recommendation": "rank bucket outbox sourceId를 `transitionEventId` 또는 `KeywordRankBucketStateTransition.id`로 바꾸거나, UNIQUE에 transitionEventId/rankBucketConfigVersion/currentBucket/detectedAt bucket을 포함하라."
    },
    {
      "id": "KM2-04",
      "severity": "high",
      "category": "migration",
      "title": "searchEngine 단일 enum + UNIQUE 정규화의 migration/backfill 정책이 없음",
      "evidence": [
        "docs/features/keyword-monitoring.md:40",
        "docs/features/keyword-monitoring.md:193",
        "docs/features/keyword-monitoring.md:203",
        "docs/features/keyword-monitoring.md:463"
      ],
      "problem": "v0.2는 KeywordTrackingTarget.searchEngine을 단일 enum으로 정규화하고 UNIQUE에 포함하지만, 기존 targetSearchEngines 배열 또는 locale 기반 target을 어떻게 분해·backfill·충돌 처리할지 정의하지 않는다.",
      "impact": "기존 데이터가 있는 환경에서 upgrade path가 비결정적이다. 동일 keyword/country/device가 여러 engine으로 확장될 때 queryHash, snapshots, anomaly FK를 어떻게 승계할지 구현마다 달라진다.",
      "recommendation": "§ 11 또는 별도 migration 절에 배열 row 분해 규칙, queryHash 재계산, 중복 충돌 처리, inactive row 처리, snapshot/anomaly FK 승계 또는 freeze 정책을 추가하라."
    },
    {
      "id": "KM2-05",
      "severity": "medium",
      "category": "cross-feature-correlation",
      "title": "correlatedSearchVisibilityAnomalyId best-effort 매핑의 시점과 실패 처리가 정의되지 않음",
      "evidence": [
        "docs/features/keyword-monitoring.md:28",
        "docs/features/keyword-monitoring.md:33",
        "docs/features/keyword-monitoring.md:501"
      ],
      "problem": "동일 instance·query·date·source 기준으로 search-visibility AnomalyRecord를 참조한다고만 되어 있고, detection 순서, 트랜잭션 경계, 나중에 search-visibility anomaly가 생성되는 경우, 다건 매칭, 매칭 실패 시 metadata 값/재시도 여부가 없다.",
      "impact": "중복 정책이 'best-effort' 문구에 머물러 대시보드/알림 suppress 판단이 구현마다 달라질 수 있다.",
      "recommendation": "매핑 시점을 `KeywordAnomalyRecord insert 직전 1회 lookup` 또는 `post-processing reconcile job`으로 고정하고, 실패 시 null 유지인지, backfill 대상인지, 다건이면 최신/최고 severity 우선인지 명시하라."
    },
    {
      "id": "KM2-06",
      "severity": "medium",
      "category": "audit-contract",
      "title": "register/unregister/retroactive audit log의 contentRef와 metadata shape가 없음",
      "evidence": [
        "docs/features/keyword-monitoring.md:189",
        "docs/features/keyword-monitoring.md:190",
        "docs/features/keyword-monitoring.md:191",
        "docs/features/keyword-monitoring.md:346",
        "docs/features/search-visibility.md:480",
        "docs/features/search-visibility.md:481",
        "docs/features/search-visibility.md:482"
      ],
      "problem": "AuditAction enum cascade는 되었지만 keyword-monitoring 쪽은 audit payload contract가 없다. search-visibility retroactive command는 contentRef='instance:{instanceId}'와 metadata 필수 필드를 명시한다.",
      "impact": "감사 로그 소비자와 운영 UI가 keyword target 등록/해제/retroactive 요청을 안정적으로 렌더링하거나 검색하기 어렵다.",
      "recommendation": "register/unregister는 contentRef=`keyword-target:{targetId}`와 keyword/country/device/searchEngine/activeBefore/activeAfter를, retroactive는 search-visibility § 7.5와 동일하게 contentRef=`instance:{instanceId}` 및 windowStart/windowEnd/severity/dryRun/matchedCount/enqueuedCount/retroactiveBatchId/actorRole을 명시하라."
    },
    {
      "id": "KM2-07",
      "severity": "medium",
      "category": "detector-contract",
      "title": "zeroBaselinePolicy enum과 build validation이 불완전함",
      "evidence": [
        "docs/features/keyword-monitoring.md:143",
        "docs/features/keyword-monitoring.md:251",
        "docs/features/keyword-monitoring.md:256",
        "docs/features/keyword-monitoring.md:402"
      ],
      "problem": "manifest 예시는 `first-observed·hold·spike`를 언급하지만 § 4.2는 first-observed와 hold만 정의한다. § 11 build-time fail에도 zeroBaselinePolicy 허용값이나 firstObservedSpikeThresholdImpressions 범위 검증이 없다.",
      "impact": "`spike` 설정이 가능한지, 가능하다면 first-observed와 어떻게 다른지 불명확하다.",
      "recommendation": "`spike`를 제거하거나 별도 의미를 정의하고, build fail에 zeroBaselinePolicy enum 검증 및 firstObservedSpikeThresholdImpressions >= 1 규칙을 추가하라."
    },
    {
      "id": "KM2-08",
      "severity": "medium",
      "category": "notification-contract",
      "title": "ctr-up은 AnomalyRecord 저장만 한다고 했지만 dashboard/API 표시 계약이 없음",
      "evidence": [
        "docs/features/keyword-monitoring.md:228",
        "docs/features/keyword-monitoring.md:262",
        "docs/features/keyword-monitoring.md:264",
        "docs/features/keyword-monitoring.md:315",
        "docs/admin/REVIEW_WORKFLOW.md:527"
      ],
      "problem": "`ctr-up`은 info severity로 AnomalyRecord만 저장하고 outbox enqueue는 하지 않는다고 되어 있다. 그러나 REVIEW_WORKFLOW에는 `keyword-monitoring-ctr-anomaly`가 high mandatory 알림으로만 존재하고, read API/dashboard에서 info-only CTR anomaly를 어떻게 표시·필터링하는지 없다.",
      "impact": "운영자는 CTR 상승 anomaly가 알림은 없지만 기록에는 있는 상태를 UI에서 일관되게 이해하기 어렵다.",
      "recommendation": "NotificationEventType과 별개로 `AnomalyRecord.signal=keywordCTR, direction=ctr-up, severity=info, notify=false` 표시 규칙을 § 3.5 read API 또는 § 9 운영 흐름에 추가하라."
    },
    {
      "id": "KM2-09",
      "severity": "low",
      "category": "extensibility",
      "title": "searchEngine to analytics source 매핑이 ternary로 박혀 있어 enum 확장 시 오동작 위험",
      "evidence": [
        "docs/features/keyword-monitoring.md:203",
        "docs/features/keyword-monitoring.md:286",
        "docs/features/keyword-monitoring.md:438"
      ],
      "problem": "현재 enum은 naver/google뿐이라 당장은 동작하지만, sourceFilter가 `naver ? naver-search-advisor : gsc` 형태라 Bing/Yandex 등 검색엔진 추가 시 기본적으로 gsc로 떨어지는 위험한 패턴이다.",
      "impact": "향후 searchEngine enum 확장 시 analytics source misrouting이 발생할 수 있다.",
      "recommendation": "명시적 매핑 테이블 `{ google: 'gsc', naver: 'naver-search-advisor' }`와 exhaustive build validation을 요구하라."
    }
  ],
  "nonIssuesOrAcceptedLimitations": [
    {
      "id": "KM2-N01",
      "topic": "REVIEW_WORKFLOW cascade",
      "result": "pass",
      "evidence": [
        "docs/admin/REVIEW_WORKFLOW.md:488",
        "docs/admin/REVIEW_WORKFLOW.md:523",
        "docs/admin/REVIEW_WORKFLOW.md:637"
      ],
      "note": "NotificationEventType 8종, 매트릭스 8행, AuditAction 4종은 확인됨."
    },
    {
      "id": "KM2-N02",
      "topic": "DATA_MODEL C-08 cascade",
      "result": "partial-pass",
      "evidence": [
        "docs/core/DATA_MODEL.md:591",
        "docs/core/DATA_MODEL.md:592",
        "docs/core/DATA_MODEL.md:656"
      ],
      "note": "keywordMonitoringConfig와 keywordMonitoringPolicyVersion은 추가됨. 단 serpCrawler enabled=true 규칙은 KM2-01로 충돌."
    },
    {
      "id": "KM2-N03",
      "topic": "locale to country limitation",
      "result": "accepted-limitation",
      "evidence": [
        "docs/features/keyword-monitoring.md:212",
        "docs/features/keyword-monitoring.md:438"
      ],
      "note": "다국어 키워드 추적 한계는 KM-05로 명시되어 있어 v1.0 차단 이슈는 아님."
    },
    {
      "id": "KM2-N04",
      "topic": "ledger severity escalation",
      "result": "pass",
      "evidence": [
        "docs/features/keyword-monitoring.md:360",
        "docs/features/keyword-monitoring.md:365",
        "docs/features/keyword-monitoring.md:370"
      ],
      "note": "ledger key에 severity가 포함되어 warning -> critical escalation은 별도 anomaly로 생성 가능하다."
    },
    {
      "id": "KM2-N05",
      "topic": "section 0 vs section 13 inventory",
      "result": "pass",
      "evidence": [
        "docs/features/keyword-monitoring.md:26",
        "docs/features/keyword-monitoring.md:457"
      ],
      "note": "두 절 모두 8 tables로 일치한다."
    }
  ]
}