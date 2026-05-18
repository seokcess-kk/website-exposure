{
  "versionReviewed": "docs/features/keyword-monitoring.md v0.5",
  "conclusion": {
    "readyForV1": false,
    "closeableAfterPatch": true,
    "needsSixthCycle": false,
    "minorCount": 4,
    "assessment": "v1.0 마감 가능성이 높습니다. 남은 항목은 구조 재설계가 아니라 문서 내 잔여 표기·metadata shape 보강 수준입니다."
  },
  "findings": [
    {
      "id": "KMF5-01",
      "severity": "minor",
      "title": "AuditAction 5종 cascade 표기가 § 1.2에만 4종으로 잔류",
      "location": "docs/features/keyword-monitoring.md § 1.2",
      "details": "상단 SoT와 § 2.2, § 11.1, REVIEW_WORKFLOW § 10.2.1은 모두 5종으로 정합하지만, § 1.2의 'audit log SoT는 REVIEW_WORKFLOW § 10.2.1 (4종 cascade 완료)' 문장이 v0.4 잔재입니다.",
      "patch": "§ 1.2를 '(5종 cascade 완료)'로 수정."
    },
    {
      "id": "KMF5-02",
      "severity": "minor",
      "title": "§ 3.1.1 audit log contract 표가 4종만 보여 5종 정정과 약하게 충돌",
      "location": "docs/features/keyword-monitoring.md § 3.1.1, § 10.3",
      "details": "migration audit contract는 § 10.3에 존재하므로 기능적으로는 닫혀 있습니다. 다만 § 3.1.1 제목이 audit log contract 전체처럼 읽히는데 표에는 migrated action이 없습니다.",
      "patch": "§ 3.1.1에 `keyword-tracking-target-migrated-v02-v03` 행을 추가하거나, 제목/본문에 '운영 command 4종; migration audit contract는 § 10.3'이라고 명시."
    },
    {
      "id": "KMF5-03",
      "severity": "minor",
      "title": "migration decompositions[]가 targetId와 searchEngine의 1:1 대응을 lossless하게 담지 못함",
      "location": "docs/features/keyword-monitoring.md § 10.3",
      "details": "`inheritedTargetId`, `toTargetIds[]`, `searchEngines[]`가 분리되어 있어 어떤 targetId가 어떤 searchEngine row인지 재구성하려면 배열 순서에 의존합니다. 'lossless 구조' 목표에는 명시적 매핑이 더 안전합니다.",
      "patch": "`decompositions[].toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 형태로 변경하고, 필요하면 `fromTargetSearchEngines`를 별도 보존."
    },
    {
      "id": "KMF5-04",
      "severity": "minor",
      "title": "§ 11 분리 후 일부 용어가 분류와 어긋남",
      "location": "docs/features/keyword-monitoring.md § 11.3, § 11.4",
      "details": "§ 11.3 migration-time validation 안의 'migration 후 active 수 초과 → runtime fail'은 migration-time fail/preflight fail로 쓰는 편이 분류상 일관됩니다. § 11.4의 'stale processing (lockedAt > 10분)'은 § 13.8 outbox 필드가 `claimedAt`인 점과 맞지 않습니다.",
      "patch": "§ 11.3은 'migration-time fail'로, § 11.4는 대상 큐별로 `claimedAt` 또는 retry queue의 `lockedAt`을 구분해 표기."
    }
  ],
  "checks": {
    "sourceKindEnum": {
      "status": "pass",
      "details": "§ 6.2와 § 13.8 모두 `anomaly | monitoring-log | rank-bucket-transition` 및 `sourceId: string`으로 정합합니다. `rank-bucket-state` 잔류는 변경 이력 설명 외 실효 정의에는 없습니다."
    },
    "rankBucketTryLock": {
      "status": "passWithNote",
      "details": "§ 6.2 절차는 try advisory lock, deterministic transitionEventId, state update + outbox insert 단일 transaction, UNIQUE no-op 의미가 서로 맞습니다. 단, try lock 실패를 영구 no-op으로 보는 정책은 worker 실패 시 외부 retry/reconcile에 의존한다는 운영 전제를 유지해야 합니다."
    },
    "reviewWorkflowCascade": {
      "status": "pass",
      "details": "REVIEW_WORKFLOW § 9.1·§ 9.1.1 keyword-monitoring 8종 이벤트와 § 10.2.1 AuditAction 5종은 반영되어 있습니다."
    },
    "dataModelCascade": {
      "status": "pass",
      "details": "DATA_MODEL C-08 v0.17에 `keywordMonitoringConfig`와 `keywordMonitoringPolicyVersion`이 있고, keyword serpCrawler는 v1.0 enabled=true build fail로 정합합니다."
    },
    "inventorySignalSourceMode": {
      "status": "pass",
      "details": "8 tables, source 1종 analytics-derived, mode 2종 alerting/monitor-only, signal 4종 구조는 문서 전반에서 일관됩니다."
    },
    "residualDecisions": {
      "status": "pass",
      "details": "KM-01~KM-07, KM-14~KM-15는 v1.x/M2+/운영 UI 후속으로 분리되어 v1.0 도달을 막지 않습니다."
    }
  },
  "finalRecommendation": "closeableAfterPatch: true + 4 minor"
}