{
  "status": "closeableAfterPatch",
  "readyForV1": false,
  "needsFifthCycle": true,
  "summary": "v0.4는 v0.3의 큰 구조적 결함 대부분을 닫았지만, retroactive command 권한/감사 cascade, detectorOutput 중복 정의, 일부 정책 의도 명세가 아직 v1.0 마감 전 패치 대상입니다.",
  "findings": [
    {
      "id": "SV4-01",
      "severity": "blocker",
      "area": "retroactive outbox command",
      "source": [
        "docs/features/search-visibility.md:452",
        "docs/admin/REVIEW_WORKFLOW.md:636"
      ],
      "problem": "`enqueueOutboxForExistingAnomalies` 권한이 `super-admin 또는 operations AdminUserRole`로 되어 있으나, REVIEW_WORKFLOW § 11.1의 AdminUserRole에는 `operations`가 없습니다.",
      "impact": "운영 command의 권한 검증을 구현할 수 없습니다.",
      "recommendation": "`super-admin` 전용으로 좁히거나, `operator` + 별도 permission/operationScope로 정의하십시오. `operations` 역할을 추가하려면 REVIEW_WORKFLOW § 11.1, DATA_MODEL C-23, notification recipientRole까지 cascade가 필요합니다."
    },
    {
      "id": "SV4-02",
      "severity": "blocker",
      "area": "audit cascade",
      "source": [
        "docs/features/search-visibility.md:459",
        "docs/features/search-visibility.md:542",
        "docs/admin/REVIEW_WORKFLOW.md:606"
      ],
      "problem": "`search-visibility-retroactive-enqueue-requested`는 SV-13 후속 cascade로 남아 있고, REVIEW_WORKFLOW § 10.2.1 AuditAction enum에는 아직 추가되지 않았습니다.",
      "impact": "retroactive enqueue의 감사 추적이 SoT에 닫히지 않아 v1.0 마감 불가입니다.",
      "recommendation": "REVIEW_WORKFLOW § 10.2.1에 AuditAction을 추가하고 metadata shape를 명시하십시오. 이 항목은 v1.x가 아니라 v1.0 전 필수 cascade로 보는 것이 맞습니다."
    },
    {
      "id": "SV4-03",
      "severity": "major",
      "area": "detectorOutput",
      "source": [
        "docs/features/search-visibility.md:237",
        "docs/features/search-visibility.md:243",
        "docs/features/search-visibility.md:318"
      ],
      "problem": "§ 3.3의 exposureTrend detectorOutput은 여전히 `{percentile, percentileBand: \"P1\"|\"P5\"|\"normal\"}`이고, § 4.1은 `{score, actualPercentile, thresholdPercentile, percentileInput}`로 정정되어 있습니다.",
      "impact": "구현자가 어느 JSON shape를 따라야 하는지 모호합니다.",
      "recommendation": "§ 3.3의 canonical shape를 § 4.1과 동일하게 교체하고, `percentileBand`가 필요하면 display-only derived field로 명시하십시오."
    },
    {
      "id": "SV4-04",
      "severity": "major",
      "area": "notification policy",
      "source": [
        "docs/features/search-visibility.md:342",
        "docs/features/search-visibility.md:437",
        "docs/admin/REVIEW_WORKFLOW.md:512"
      ],
      "problem": "`unifiedRankingPresence unknown → bucket:*` 첫 관측은 info라 outbox 미enqueue인데, `ai-briefing-citation-first-detected`는 info 성격이어도 enqueue됩니다. 둘의 정책 차이는 합리적일 수 있으나 이유가 SoT에 없습니다.",
      "impact": "첫 노출/첫 인용 계열 이벤트의 알림 정책이 임의적으로 보입니다.",
      "recommendation": "정책 rationale을 한 줄 추가하십시오. 예: AI briefing 첫 인용은 site-level business event라 notify, unified ranking 첫 bucket은 query별 baseline initialization이라 notify 제외."
    },
    {
      "id": "SV4-05",
      "severity": "major",
      "area": "sourceEventId idempotency",
      "source": [
        "docs/features/search-visibility.md:455",
        "docs/features/search-visibility.md:457"
      ],
      "problem": "retroactive command는 `UNIQUE(anomalyRecordId)`로 동일 anomaly 재enqueue를 막지만, `sourceEventId`에는 `searchVisibilityPolicyVersion`이 포함됩니다. 정책 버전 변경 시 재발송을 의도하는지 금지하는지 문서가 양쪽 신호를 줍니다.",
      "impact": "outbox row 보존/삭제, 정책 롤백, receipt retention 만료 상황에서 재발송 의미가 불명확합니다.",
      "recommendation": "의도가 재발송 금지라면 sourceEventId에서 policyVersion을 빼거나 '기존 anomaly는 policyVersion 변경으로도 재발송하지 않음'을 명시하십시오. 의도가 정책별 재발송이면 uniqueness를 `(anomalyRecordId, searchVisibilityPolicyVersion)`로 바꿔야 합니다."
    },
    {
      "id": "SV4-06",
      "severity": "minor",
      "area": "suppression ledger",
      "source": [
        "docs/features/search-visibility.md:406",
        "docs/features/search-visibility.md:407"
      ],
      "problem": "suppression key에 `severity`가 포함되어 warning → critical 상승은 별도 anomaly로 생성됩니다. 동작 자체는 타당하지만 의도가 명시되지 않았습니다.",
      "impact": "운영자는 severity escalation이 suppression을 우회하는지 혼동할 수 있습니다.",
      "recommendation": "`severity 상승은 새 anomaly로 처리하여 critical 알림을 허용`한다는 문장을 추가하십시오. false-positive resolve 후 재발생은 현재 `resolutionStatus=\"open\"` 조건 덕분에 정상입니다."
    },
    {
      "id": "SV4-07",
      "severity": "minor",
      "area": "blob IAM",
      "source": [
        "docs/features/search-visibility.md:207",
        "docs/features/search-visibility.md:536",
        "docs/features/search-visibility.md:671"
      ],
      "problem": "S3 PrincipalTag 조건은 AWS 전용인데 config 주석은 `s3·gcs·azure-blob` 선택지를 남기고, SV-06b는 `provider=s3는 v0.3 결정`이라고 합니다.",
      "impact": "v1.0에서 GCS/Azure가 허용 provider인지, 아니면 후속 인프라인지 불명확합니다.",
      "recommendation": "v1.0은 `provider=\"s3\"`만 build-pass로 고정하고 GCS/Azure 변환 정책은 SV-06b 후속으로 명시하거나, 각 provider별 equivalent IAM policy를 추가하십시오."
    }
  ],
  "checks": {
    "exposureTrendTargetPage": {
      "result": "pass",
      "note": "§ 4.1이 page target을 analytics-derived universe 전체 SUM으로 정의하고, query universe는 SERP crawler monitored set이라고 분리했습니다."
    },
    "allowCaptchaBypass": {
      "result": "pass",
      "note": "optional + default false이면서 explicit true는 build fail입니다. 설정 가능성과 운영 금지는 모순이 아니라 안전 fail-gate입니다."
    },
    "crawlerArtifactRetentionOrder": {
      "result": "pass",
      "note": "`serpCrawler.enabled=false`이면 approvedScope/blobStorage/crawlerArtifact retention 검증 skip으로 정리되었습니다."
    },
    "retryQueueWorker": {
      "result": "pass",
      "note": "SKIP LOCKED, advisory lock, envelope 재계산, lock ordering invariant가 analytics-reporting 패턴과 정합합니다."
    },
    "signedUrlRefresh": {
      "result": "acceptableResidual",
      "note": "SV-14 client SDK는 UX/infra 후속으로 분리 가능하지만, API TTL/refresh 계약은 v1.0 본문에 남아 있어야 합니다."
    }
  },
  "residualDecision": {
    "mustPatchBeforeV1": [
      "SV4-01",
      "SV4-02",
      "SV4-03",
      "SV4-04",
      "SV4-05"
    ],
    "canRemainAsOperationalOrV1x": [
      "SV-01",
      "SV-02",
      "SV-03",
      "SV-04",
      "SV-05",
      "SV-06a",
      "SV-07",
      "SV-08",
      "SV-09",
      "SV-11",
      "SV-12",
      "SV-14"
    ],
    "needsRewordingOnly": [
      "SV4-06",
      "SV4-07"
    ]
  }
}