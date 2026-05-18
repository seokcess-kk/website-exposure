{
  "status": "closeableAfterPatch",
  "reviewTarget": "docs/features/asset-ingestion.md v0.4",
  "summary": {
    "verdict": "v0.4는 v0.3의 핵심 결함을 대부분 닫았지만, 새로 추가한 promote 상태 머신·reconcile·TargetMapping·PII raw/redacted 모델이 §16 데이터 구조와 일부 교차 SoT에 아직 덜 반영되어 있다. 다만 결함은 국소 패치로 닫을 수 있으며 5차 사이클까지 갈 필요는 없어 보인다.",
    "v1Readiness": "조건부 가능",
    "blockingFindingCount": 8,
    "nonBlockingFindingCount": 4
  },
  "findings": [
    {
      "id": "AI4-01",
      "severity": "blocker",
      "category": "promote-state-machine",
      "title": "AssetPromotionRecord의 새 상태·forensic 필드가 §16.10 스키마에 반영되지 않았다",
      "evidence": [
        "§8.2는 status=checking·pending-commit·committed·failed 및 checkStartedAt/checkCompletedAt/commitStartedAt/commitCompletedAt/lastError/checkResultVersion을 정의한다.",
        "§16.10은 `AssetPromotionRecord — v0.1 § 16.8 유지`만 남아 있어 새 필드의 required/optional, index, unique/idempotency 조건이 없다."
      ],
      "impact": "구현자는 §8.2 흐름을 구현할 DB 스키마를 확정할 수 없다. 특히 reconcile worker가 stale row를 조회할 인덱스와 commit recovery에 필요한 targetContentRef 보존 규칙이 빠진다.",
      "patch": "§16.10을 전개해 status enum, forensic timestamp, targetContentType, targetContentRef, promotedBy, reviewVersionSnapshot, checkResultVersion, lastError, createdAt/updatedAt, index(status, checkStartedAt), index(status, checkCompletedAt)을 명시하라."
    },
    {
      "id": "AI4-02",
      "severity": "blocker",
      "category": "promote-transaction",
      "title": "pending-commit 진입 후 commit transaction의 상태 전이가 원자적으로 정의되지 않았다",
      "evidence": [
        "§8.2 step 2.c는 check 성공 후 별도 update로 status=\"pending-commit\"을 만든다.",
        "§8.2 step 3은 transaction 안에서 IngestedAsset, AssetReviewRecord, AssetPiiFinding만 lock하고, step 3.g에서 AssetPromotionRecord를 committed로 update한다."
      ],
      "impact": "동일 AssetPromotionRecord에 대해 중복 promote transaction이 시작될 수 있고, commitStartedAt 기록 시점도 불명확하다.",
      "patch": "step 3.a에 `SELECT AssetPromotionRecord WHERE id=? AND status='pending-commit' FOR UPDATE`를 추가하고, transaction 첫 줄에서 `status='pending-commit', commitStartedAt=now()` 검증 및 CAS를 수행하라. 실패 시 idempotent duplicate 또는 stale 상태로 분기하라."
    },
    {
      "id": "AI4-03",
      "severity": "blocker",
      "category": "promote-rollback",
      "title": "게이트 재검증 실패 시 transaction rollback과 failed 상태 기록의 transaction 경계가 모호하다",
      "evidence": [
        "§8.2 step 3.b는 `transaction abort → AssetPromotionRecord UPDATE status=\"failed\"`라고 한다.",
        "동시에 step 3.g의 committed update는 같은 transaction 안 작업으로 보인다."
      ],
      "impact": "failed 업데이트가 rollback에 같이 말려 사라지는지, 별도 transaction으로 남는지 구현 해석이 갈린다.",
      "patch": "실패 분기를 `transaction rollback 후 별도 짧은 transaction에서 AssetPromotionRecord status='failed', lastError, failedAt 기록`으로 명시하라. 단 AssetPromotionRecord row lock 해제 후 기록하므로 race 방지를 위해 `WHERE status='pending-commit'` 조건을 붙여라."
    },
    {
      "id": "AI4-04",
      "severity": "blocker",
      "category": "reconcile",
      "title": "pending-commit reconcile의 Core row·ComplianceRecord 존재 검사 join key가 없다",
      "evidence": [
        "§13.4는 `pending-commit > 10분 → Core row·ComplianceRecord 존재 검사 후 committed 또는 failed`라고 한다.",
        "§8.2는 Core row, ComplianceRecord, outbox가 AssetPromotionRecord와 어떤 key로 연결되는지 명시하지 않는다."
      ],
      "impact": "reconcile worker가 무엇을 기준으로 committed 수렴을 판단해야 하는지 불명확하다. Core row만 있고 ComplianceRecord/outbox가 없는 partial commit 여부도 판별할 수 없다.",
      "patch": "Core row 또는 공통 metadata에 `provenanceAssetId`와 `assetPromotionRecordId`를 저장하거나, AssetPromotionRecord에 `targetContentType`·`targetContentRef`를 transaction 안에서 먼저 확정 저장하라. reconcile은 Core row + ComplianceRecord(contentRef=targetContentRef, recordPhase='pre-publish') + outbox(sourceId=assetId,eventType='asset-ingestion-asset-promoted') 3종 존재를 모두 검사하도록 명시하라."
    },
    {
      "id": "AI4-05",
      "severity": "blocker",
      "category": "target-mapping",
      "title": "TreatmentPageTargetMapping이 DATA_MODEL C-03 required/type과 불일치한다",
      "evidence": [
        "asset-ingestion §8.1은 overview, mechanism, targetAudience, process, precautions를 optional 또는 Markdown으로 둔다.",
        "DATA_MODEL C-03은 overview/mechanism/targetAudience/precautions를 required Markdown, process를 required ProcessStep[]로 둔다.",
        "asset-ingestion은 programVariants를 string[]로 두지만 DATA_MODEL C-03은 ProgramVariant[]이다."
      ],
      "impact": "runtime validation이 DATA_MODEL SoT 기준으로는 fail해야 할 mapping을 asset-ingestion 기준으로는 통과시킬 수 있다.",
      "patch": "TreatmentPageTargetMapping을 C-03과 동일하게 맞춰라. 최소 required는 name, overview, mechanism, targetAudience, process: ProcessStep[], precautions, pageRiskLevel. programVariants는 ProgramVariant[]로 정정하고 ProcessStep/ProgramVariant/TreatmentComponent/VisitFlowStep/EvidenceNote는 DATA_MODEL C-03 하위 타입 재사용이라고 명시하라."
    },
    {
      "id": "AI4-06",
      "severity": "blocker",
      "category": "closed-union",
      "title": "ArticleTargetMapping이 closed union이라고 하면서 `... 그 외 C-04 필드` 잔재를 남긴다",
      "evidence": [
        "§8.1 ArticleTargetMapping 끝에 `// ... 그 외 C-04 필드`가 남아 있다.",
        "같은 절은 unknown field build/runtime fail과 closed union을 선언한다."
      ],
      "impact": "closed union의 필드 집합이 닫히지 않는다. v1.0 구현자가 optional C-04 필드 허용 범위를 확정할 수 없다.",
      "patch": "C-04의 required/optional 필드를 ArticleTargetMapping에 전개하거나, `ArticleTargetMapping = Pick<Article, ...>`처럼 정확한 포함 필드 목록을 명시하라. 생략형 주석은 제거하라."
    },
    {
      "id": "AI4-07",
      "severity": "blocker",
      "category": "pii-gate",
      "title": "PII gate가 `piiDetected=false`만으로 AssetPiiFinding을 우회할 수 있다",
      "evidence": [
        "§7.2는 `ExtractedContent.piiDetected=false 또는 모든 AssetPiiFinding이 false-positive/true-positive+redactionApplied`라고 한다.",
        "§16.6은 piiDetected/piiRedacted를 요약 boolean으로 유지한다."
      ],
      "impact": "요약 boolean이 stale이거나 잘못 backfill되면 open/true-positive 미처리 finding이 있어도 promote가 통과할 수 있다.",
      "patch": "게이트 조건을 `AssetPiiFinding이 0건이거나, 모든 finding이 false-positive 또는 true-positive+redactionApplied`로 바꾸고, piiDetected는 표시용 denormalized summary로 낮춰라. §13.4에 `piiDetected != exists(AssetPiiFinding)` reconcile invariant를 추가하라."
    },
    {
      "id": "AI4-08",
      "severity": "blocker",
      "category": "schema-migration",
      "title": "blobKeyVersion이 migration 정책에만 있고 IngestedAsset 스키마에는 없다",
      "evidence": [
        "§13.3은 `IngestedAsset.blobKeyVersion`으로 v0.2/v0.3 path를 분기한다고 한다.",
        "§16.5 IngestedAsset 추가 필드에는 rawBlobHash, normalizedTextHash, sourceCanonicalKey만 있다."
      ],
      "impact": "lazy rewrite 정책을 구현할 수 없다.",
      "patch": "§16.5에 `blobKeyVersion: 'v0.2' | 'v0.3'` required, 신규 row default 'v0.3', 기존 row migration backfill 규칙을 추가하라."
    },
    {
      "id": "AI4-09",
      "severity": "major",
      "category": "redaction-model",
      "title": "ExtractedContent.rawBody/body와 운영자 수동 redaction의 SoT가 충돌할 수 있다",
      "evidence": [
        "§9.1은 rawBody를 offset SoT, body를 redacted view라고 한다.",
        "§16.7은 detector=manual을 허용하지만, 수동 redaction이 body를 직접 편집하는지 rawBody+finding operation으로 재생성되는지 정하지 않는다."
      ],
      "impact": "body 직접 수정이 허용되면 raw offset, redactedOffset, contextHash가 drift한다.",
      "patch": "body는 rawBody + AssetPiiFinding redaction operations에서 생성되는 materialized view라고 선언하라. 수동 redaction은 detector='manual' finding 추가로만 수행하고, body 직접 편집은 금지하거나 별도 `bodyOverrideVersion`과 offset invalidation 규칙을 둬라."
    },
    {
      "id": "AI4-10",
      "severity": "major",
      "category": "cross-doc",
      "title": "Feature contentType check 예외가 compliance-assistant v1.0 본문과 완전히 cascade되지 않았다",
      "evidence": [
        "asset-ingestion §6.2는 contentType='Feature'에서 pageTypeId/articleType 미지정 허용이라고 한다.",
        "compliance-assistant §3.3은 pageTypeId 유도 불가 시 fail, Article articleType 미지정 fail을 일반 규칙으로 둔다."
      ],
      "impact": "asset-ingestion raw asset check가 compliance-assistant SoT에 의해 fail로 해석될 수 있다.",
      "patch": "compliance-assistant §3.3 또는 CONTENT_STANDARDS §7에 `contentType='Feature' && featureContentType='feature:asset-ingestion'` 예외를 명시하고, feature-scoped/global rules만 적용한다는 규칙을 cascade하라."
    },
    {
      "id": "AI4-11",
      "severity": "major",
      "category": "manual-handoff",
      "title": "manual hand-off의 `provenanceAssetId`가 Core 데이터 계약에 cascade되지 않았다",
      "evidence": [
        "§13.2는 unsupported contentType 수동 생성 Core row에 `provenanceAssetId` 보존을 요구한다.",
        "DATA_MODEL C-01~C-22에는 공통 provenanceAssetId 필드가 보이지 않는다."
      ],
      "impact": "수동 hand-off 추적성이 구현자 임의 metadata에 의존한다.",
      "patch": "DATA_MODEL에 공통 admin metadata 필드로 `provenanceAssetId`를 추가하거나, 별도 AssetPromotionRecord/AssetManualHandoffRecord가 Core contentRef를 참조하는 방식으로 SoT를 정하라."
    },
    {
      "id": "AI4-12",
      "severity": "major",
      "category": "permissions",
      "title": "AssetReviewRecord 일반 approval 권한과 rightsReview 권한이 구분 없이 충돌한다",
      "evidence": [
        "§7.1은 AssetReviewRecord 검수 권한을 operator·super-admin으로 둔다.",
        "§16.9는 rightsReview.status 변경을 legal-reviewer·super-admin으로 둔다."
      ],
      "impact": "operator가 asset 자체 approve는 가능하지만 rights approve는 불가능하다는 의도는 맞아 보이나, 현재 문구만 보면 같은 record 상태 처리 권한이 충돌한다.",
      "patch": "§7.1을 `asset content review approval` 권한으로 한정하고, §7.2/§16.9에 `rightsReview approval은 별도 legal gate`라고 분리 표기하라."
    }
  ],
  "openDecisionsAssessment": [
    {
      "id": "AI-01",
      "classification": "nonBlockingForV1",
      "reason": "SNS ToS 책임 분리는 법무 운영 문구 이슈다. v1.0 게이트가 legalApproved/approvedAccountIds/allowedContentTypes를 강제하므로 기능 명세 차단 요인은 아니다."
    },
    {
      "id": "AI-02",
      "classification": "nonBlockingForV1IfGateRemains",
      "reason": "외부 사이트 인용 저작권 검토는 rightsReview evidence gate가 있으므로 v1.0 런타임 차단으로 흡수 가능하다."
    },
    {
      "id": "AI-03",
      "classification": "nonBlockingForV1IfGateRemains",
      "reason": "SNS 동의 절차 자체의 세부 양식은 미결이나 consentEvidenceRef/evidenceAttachments 필수 조건으로 v1.0 운영은 가능하다."
    },
    {
      "id": "AI-14",
      "classification": "docConsistencyRisk",
      "reason": "ARCHITECTURE §11.1 content-migration 경계 cascade는 v1.0 문서 릴리스 전에는 닫는 편이 좋다. 구현 차단보다는 상위 문서 정합성 리스크다."
    },
    {
      "id": "AI-16",
      "classification": "nonBlockingForV1",
      "reason": "signed URL refresh SDK는 UX/infra 후속이다. TTL 600초와 signed URL API 권한 검증만 있으면 v1.0 core flow는 가능하다."
    },
    {
      "id": "AI-18",
      "classification": "conditionalBlocking",
      "reason": "eager migration command를 v1.0에 노출한다면 AuditAction cascade가 필요하다. v1.x patch로 명시적으로 미루면 v1.0 차단은 아니다."
    }
  ],
  "requiredPatchSet": [
    "§16.10 AssetPromotionRecord 스키마 전개",
    "§8.2 transaction에서 AssetPromotionRecord row lock/status CAS/commitStartedAt 명시",
    "§8.2 실패 분기의 별도 transaction failed 기록 명시",
    "§13.4 reconcile join key와 Core+ComplianceRecord+outbox 수렴 조건 명시",
    "§8.1 TargetMapping 5종 중 Article/TreatmentPage의 closed field set 정정",
    "§7.2 PII gate를 AssetPiiFinding 기준으로 정정",
    "§16.5 blobKeyVersion 추가",
    "§9.1/§16.6/§16.7 rawBody→redaction operation→body materialized view 규칙 추가",
    "compliance-assistant Feature contentType 예외 cascade",
    "manual hand-off provenanceAssetId 저장 위치 결정"
  ],
  "v1CloseDecision": {
    "readyForV1": false,
    "closeableAfterPatch": true,
    "needsFifthCycle": false,
    "reason": "남은 결함은 모두 명세 내부의 필드·트랜잭션 경계·교차 참조 보강 문제다. 새 아키텍처 결정을 크게 요구하지 않으므로 패치 후 v1.0 마감 가능하다."
  }
}