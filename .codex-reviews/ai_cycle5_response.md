{
  "readyForV1": false,
  "closeableAfterPatch": true,
  "needsSixthCycle": false,
  "minorCount": 5,
  "majorCount": 0,
  "conclusion": "closeableAfterPatch: true + 5개 minor",
  "summary": {
    "assessment": "v0.5는 v0.4 정정의 핵심 모순을 대부분 해소했다. promote transaction의 commitStartedAt rollback 정합, rightsReview 권한 분리, PII gate 기준, Article/TreatmentPage mapping cascade, compliance-assistant Feature 예외는 v1.0 마감 가능한 수준이다.",
    "blocking": "v1.0을 막는 설계 결함은 없다.",
    "patchScope": "남은 항목은 구현자가 오해하지 않도록 transaction/reconcile edge case와 migration/trigger 문구를 보강하는 수준이다."
  },
  "findings": [
    {
      "id": "AI5-01",
      "severity": "minor",
      "area": "AssetPromotionRecord reconcile",
      "source": "docs/features/asset-ingestion.md § 13.4",
      "issue": "pending-commit stale reconcile의 Core row 존재 검사에서 `@id=assetPromotionRecord.targetContentRef`를 요구한다. 하지만 targetContentRef는 transaction 3.h에서만 채워지므로, 정말로 partial commit 또는 crash-recovery를 수렴시키려는 경우 targetContentRef가 null이면 Core row를 찾을 수 없다.",
      "impact": "3종 모두 존재하는데 targetContentRef만 비어 있는 edge case를 `partial`로 오판할 수 있다.",
      "recommendation": "pending-commit reconcile은 먼저 `targetContentRef`가 있으면 현재 조건으로 조회하고, 없으면 `targetContentType + @provenanceAssetId=assetId`로 Core row를 조회하도록 명시한다. 정확히 1건이면 targetContentRef를 backfill 후 committed로 수렴, 0건 또는 다건이면 failed/sink alert."
    },
    {
      "id": "AI5-02",
      "severity": "minor",
      "area": "promote transaction forensic fields",
      "source": "docs/features/asset-ingestion.md § 8.2",
      "issue": "3.a에서 같은 transaction 안에 `commitStartedAt=now()`를 기록한 뒤 3.c 게이트 재검증 실패 시 transaction abort 후 별도 transaction으로 failed를 기록한다. DB 정합상 commitStartedAt update는 rollback되지만, 명세가 이를 직접 말하지 않는다.",
      "impact": "구현자가 commitStartedAt을 transaction 밖에서 먼저 기록하면 failed row에 commitStartedAt이 남아 forensic 의미가 흐려질 수 있다.",
      "recommendation": "3.c 실패 분기에 '3.a의 commitStartedAt update는 abort와 함께 rollback되며, 별도 failed transaction은 failedAt/lastError만 기록한다'를 한 줄 추가한다."
    },
    {
      "id": "AI5-03",
      "severity": "minor",
      "area": "body materialized view",
      "source": "docs/features/asset-ingestion.md § 16.6",
      "issue": "`body`가 rawBody + AssetPiiFinding redaction operations의 materialized view이고 bodyVersion이 변경 시 증가한다고 되어 있으나, rawBody 변경과 AssetPiiFinding 변경을 redaction worker에 연결하는 trigger/enqueue 규칙이 없다.",
      "impact": "직접 편집 금지는 명확하지만, 자동 재생성의 실행 시점과 중복 처리/idempotency가 구현자 해석에 남는다.",
      "recommendation": "`ExtractedContent.rawBody` update, AssetPiiFinding insert/update/delete 또는 reviewStatus/redactionApplied/redactionMode 변경 시 `RedactionRebuildJob(assetId, extractedContentId, sourceVersion)`을 enqueue하고, worker가 body/bodyVersion/piiDetected/piiRedacted를 원자 갱신한다고 명시한다."
    },
    {
      "id": "AI5-04",
      "severity": "minor",
      "area": "blobKeyVersion migration",
      "source": "docs/features/asset-ingestion.md § 13.3, § 16.5",
      "issue": "`blobKeyVersion` enum은 v0.2·v0.3만 정의되어 있고 lazy rewrite 정책도 v0.2 → v0.3 기준이다. 기존 v0.1/v0.2 운영 row에 필드가 없을 때 backfill 판정 규칙이 없다.",
      "impact": "운영 데이터가 이미 있는 환경에서 null blobKeyVersion row가 signed URL worker 분기에서 모호해진다.",
      "recommendation": "migration-time validation에 `blobKeyVersion IS NULL` backfill 규칙을 추가한다. path가 v0.2 패턴이면 `v0.2`, v0.3 패턴이면 `v0.3`, 판정 불가 row는 migration fail + sink alert."
    },
    {
      "id": "AI5-05",
      "severity": "minor",
      "area": "AssetReviewRecord CAS",
      "source": "docs/features/asset-ingestion.md § 8.2, § 16.9, § 16.10",
      "issue": "promote 흐름은 `AssetReviewRecord.reviewVersion compare-and-set` 및 `AssetPromotionRecord.reviewVersionSnapshot`을 사용하지만 § 16.9 AssetReviewRecord 스키마에 `reviewVersion` 필드가 전개되어 있지 않다.",
      "impact": "CAS 입력의 SoT 필드가 누락되어 동시성 제어 구현이 불명확하다.",
      "recommendation": "§ 16.9에 `reviewVersion: integer required`를 추가하고, asset content review 상태 변경 및 rightsReview 상태/evidence/history 변경 시 증가한다고 명시한다."
    }
  ],
  "checks": {
    "assetPromotionRecordTransaction": {
      "status": "mostly_consistent",
      "notes": "동일 DB transaction 전제에서는 Core/Compliance/outbox partial commit은 원칙적으로 발생하지 않는다. 다만 reconcile을 방어적으로 유지하려면 targetContentRef null 수렴 규칙이 필요하다."
    },
    "pendingCommitReconcile": {
      "status": "needs_minor_patch",
      "notes": "§ 13.4의 3종 검사 자체는 맞지만 § 8.2 요약에는 아직 Core/ComplianceRecord 2종처럼 읽히는 잔재가 있다. § 13.4를 SoT로 삼는다고 명시하면 충분하다."
    },
    "bodyMaterializedView": {
      "status": "needs_minor_patch",
      "notes": "정책은 맞고 trigger/enqueue 명시만 부족하다."
    },
    "blobKeyVersion": {
      "status": "needs_minor_patch",
      "notes": "enum과 lazy rewrite는 맞지만 기존 null row backfill 규칙 필요."
    },
    "provenanceAssetId": {
      "status": "acceptable",
      "notes": "DATA_MODEL § 2.2 공통 메타 optional 필드로 C-01~C-23 전체 적용은 성립한다. 기존 Core row는 null 유지로 충분하나, migration note를 추가하면 더 명확하다."
    },
    "cascadeConsistency": {
      "status": "consistent",
      "notes": "compliance-assistant § 3.3 Feature contentType 예외, REVIEW_WORKFLOW/notifications 연결, rightsReview 권한 분리는 현재 문서 간 충돌이 보이지 않는다."
    },
    "inventorySignalSourceConsistency": {
      "status": "consistent",
      "notes": "11 tables 인벤토리, AssetPiiFinding 기준 PII gate, source quarantine, outbox sourceKind/sourceId/eventType 방향은 일관적이다."
    },
    "openItemsAI01toAI18": {
      "status": "non_blocking",
      "notes": "AI-01~AI-18은 법무/확장/운영 후속 성격이며 v1.0 도달을 막는 미결정은 아니다."
    }
  }
}