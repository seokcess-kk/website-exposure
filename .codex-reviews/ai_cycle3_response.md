{
  "status": "needs-fourth-cycle",
  "reviewTarget": "docs/features/asset-ingestion.md v0.3",
  "summary": {
    "verdict": "v0.2의 주요 cascade 정정은 대부분 반영됐지만, v0.3에서 새로 도입한 promote 트랜잭션 분리와 상태 머신이 아직 운영적으로 닫히지 않았다. 특히 stale pending, gate race, post-commit outbox 유실, PII redaction locator 불일치가 남아 4차 패치가 필요하다.",
    "externalCascade": "REVIEW_WORKFLOW 5종 NotificationEventType/AuditAction 및 DATA_MODEL C-08 v0.18 cascade는 확인 범위에서 큰 불일치 없음.",
    "inventoryCheck": "§ 0의 11 tables와 § 16의 11개 내부 테이블 인벤토리는 일치한다."
  },
  "findings": [
    {
      "id": "AI3-01",
      "severity": "critical",
      "category": "promote-transaction-stability",
      "location": "docs/features/asset-ingestion.md:271-292",
      "issue": "AssetPromotionRecord 상태 머신과 실제 흐름이 모순된다. 2단계 check()가 끝난 뒤 3단계에서 status='pending'을 insert하지만, 상태 설명은 pending을 '2단계 외부 check() 진행 중'으로 정의한다.",
      "impact": "worker crash 시 어느 단계에서 멈췄는지 판별할 수 없고, pending row가 check-before-insert인지 commit-before-update인지 구분되지 않는다.",
      "recommendation": "status를 `checking`·`pending-commit`·`committed`·`failed` 등으로 분리하거나, pending 의미를 'check 완료 후 commit 대기'로 정정하라. `checkStartedAt`, `checkCompletedAt`, `commitStartedAt`, `lastError` 같은 forensic 필드를 명시하라."
    },
    {
      "id": "AI3-02",
      "severity": "critical",
      "category": "promote-reconcile",
      "location": "docs/features/asset-ingestion.md:275-286",
      "issue": "3단계 pending insert 후 4단계 commit 전 worker crash, 4단계 rollback 후 failed update 실패, 5단계 post-commit 실패 모두 reconcile을 언급하지만 reconcile worker의 SoT가 없다.",
      "impact": "pending row가 무한 잔존하거나 committed인데 audit/outbox가 없는 상태가 영구화된다.",
      "recommendation": "§ 11 또는 § 13에 runtime invariant/reconcile 섹션을 추가하라. 예: `pending.updatedAt > 10분`이면 Core row/ComplianceRecord 존재 여부를 조회해 `failed` 또는 `committed`로 수렴, committed인데 outbox/audit 누락이면 deterministic key로 재생성, 반복 실패 시 sink alert."
    },
    {
      "id": "AI3-03",
      "severity": "critical",
      "category": "promote-race-condition",
      "location": "docs/features/asset-ingestion.md:271-280",
      "issue": "promote 게이트 검증이 check() 전에만 수행되고, Core row 생성 transaction 안에서 재검증·row lock·version check가 명시되지 않았다.",
      "impact": "게이트 통과 후 check()가 오래 걸리는 동안 다른 worker나 운영자가 AssetReviewRecord를 rejected로 바꾸거나 PII finding을 open으로 추가해도 promote가 그대로 commit될 수 있다.",
      "recommendation": "4단계 transaction 시작 시 IngestedAsset, AssetReviewRecord, AssetPiiFinding 범위를 lock하고 § 7.2 게이트를 재평가하라. `reviewVersion` 또는 `updatedAt` compare-and-set도 명시하라."
    },
    {
      "id": "AI3-04",
      "severity": "major",
      "category": "outbox-atomicity",
      "location": "docs/features/asset-ingestion.md:283-286, docs/features/asset-ingestion.md:349-363",
      "issue": "notifications outbox enqueue가 post-commit 별도 작업으로 밀려 있다. 그러나 outbox 패턴의 목적은 상태 변경과 알림 의도를 원자적으로 저장하는 것이다.",
      "impact": "Core row와 AssetPromotionRecord는 committed인데 outbox row가 없는 상태가 발생한다. 현재는 undefined reconcile에 의존한다.",
      "recommendation": "가능하면 4단계 DB transaction 안에 `AssetIngestionNotificationOutbox` insert를 포함하라. audit log가 외부 시스템이면 post-commit 재시도 대상으로 남겨도 되지만, 내부 outbox는 Core commit과 같은 transaction에 넣는 편이 맞다."
    },
    {
      "id": "AI3-05",
      "severity": "major",
      "category": "pii-gate-semantics",
      "location": "docs/features/asset-ingestion.md:220, docs/features/asset-ingestion.md:496-499",
      "issue": "promote 게이트는 `true-positive(redacted)`를 허용한다고 쓰지만, 실제 enum은 `true-positive`이고 redaction 여부는 별도 boolean `redactionApplied`다. `resolved`의 의미도 redacted 완료인지 운영자 종결인지 불명확하다.",
      "impact": "true-positive지만 redactionApplied=false인 finding이 promote를 통과할 수 있는지 구현자마다 다르게 해석된다.",
      "recommendation": "게이트 조건을 명시적으로 바꿔라: `false-positive`는 허용, `true-positive`는 `redactionApplied=true`일 때만 허용, `resolved`는 어떤 상태 전이의 최종값인지 정의. 또는 enum에서 `resolved`를 제거하고 상태 전이를 단순화하라."
    },
    {
      "id": "AI3-06",
      "severity": "major",
      "category": "pii-redaction-storage",
      "location": "docs/features/asset-ingestion.md:324-327, docs/features/asset-ingestion.md:493",
      "issue": "ExtractedContent.body를 redacted view로 저장하면서 AssetPiiFinding offsetStart/offsetEnd도 ExtractedContent.body 내 위치라고 정의했다.",
      "impact": "redaction 후 본문에서는 원본 PII 위치와 길이가 사라져 finding offset이 원본 탐지 위치인지 redacted view 위치인지 불명확하다. 재검수, false-positive 복원, evidence 표시가 깨진다.",
      "recommendation": "offset 기준을 `rawExtractedBody` 또는 `bodyBeforeRedaction`으로 고정하고, redacted view에는 별도 locator mapping을 두라. 원문 저장을 피하려면 `rawTextHash`, `contextBefore/After`의 안전한 snippet, detector canonical value hash 등으로 감사 가능성을 확보하라."
    },
    {
      "id": "AI3-07",
      "severity": "major",
      "category": "blob-storage-migration",
      "location": "docs/features/asset-ingestion.md:460, docs/features/asset-ingestion.md:562-564",
      "issue": "blob key format을 v0.2의 `{assetId}/{kind}.{ext}`에서 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}`로 바꿨지만 migration 정책이 없다.",
      "impact": "기존 v0.2 데이터가 있는 환경에서 signed URL 발급, IAM prefix 조건, blobRef resolution이 깨질 수 있다.",
      "recommendation": "§ 13.3에 migration-time validation을 추가하라. old key 허용 기간, lazy rewrite 여부, blobRef version 필드, migration audit action, rollback 정책을 명시하라."
    },
    {
      "id": "AI3-08",
      "severity": "major",
      "category": "target-mapping-closed-union",
      "location": "docs/features/asset-ingestion.md:239-266, docs/core/DATA_MODEL.md:370-384, docs/core/DATA_MODEL.md:462-488",
      "issue": "TargetMapping은 closed union과 unknown field fail을 선언하지만 Article 외 4종은 '각 C-XX SoT 필수 필드 적용'으로만 남아 있고, Article도 `... 그 외 C-04 필드`라고 해 closed union의 구현 가능성이 떨어진다.",
      "impact": "DATA_MODEL v0.4 컨텍스트 필드인 TreatmentPage.recommendedFor, treatmentComponents, visitFlow, evidenceNotes 및 Article의 category/contentSource/externalUrl 등 매핑 지원 범위가 불명확하다.",
      "recommendation": "5종 각각의 TargetMapping 타입을 펼쳐라. 필수 필드는 DATA_MODEL과 동일하게, optional 컨텍스트 필드는 허용 목록으로 열거하고 unknown field fail과 양립시키라."
    },
    {
      "id": "AI3-09",
      "severity": "major",
      "category": "unsupported-contenttype-manual-path",
      "location": "docs/features/asset-ingestion.md:239-240, docs/features/asset-ingestion.md:416-422",
      "issue": "v1.0 미지원 contentType은 runtime fail 후 어드민 UI manual 처리라고 하지만, asset-ingestion이 어디까지 partial mapping을 만들고 어디서 reject/hand-off하는지 정의가 없다.",
      "impact": "ReviewPolicy, PricingPage, LocationProfile 등 unsupported 추천 결과가 나왔을 때 운영자가 raw asset을 어떻게 manual 콘텐츠 생성에 연결하는지 추적성과 감사 이력이 비게 된다.",
      "recommendation": "unsupported contentType 경로를 명시하라. 예: promoteAsset은 fail, asset은 approved 상태 유지, `manualProcessingRequired` 상태/태그 생성, 어드민 UI가 raw/redacted blob과 ExtractedContent를 참조해 별도 Core editor에서 직접 입력, manual 생성 Core row에는 provenance link만 저장."
    },
    {
      "id": "AI3-10",
      "severity": "minor",
      "category": "rights-review-history",
      "location": "docs/features/asset-ingestion.md:524-538",
      "issue": "rightsReview.history[] append-only는 정의됐지만 history insert 권한과 UI 표시 정책이 부족하다. status 변경만 legal 자격 검증을 요구하고, evidence-added/evidence-superseded/reviewer-assigned 권한은 비어 있다.",
      "impact": "operator가 증빙을 supersede하거나 reviewer-assigned 이력을 조작할 수 있는지 구현 판단이 갈린다.",
      "recommendation": "action별 권한 매트릭스를 추가하라. UI는 최신 status와 active evidence만 기본 표시하고, superseded evidence/history는 audit drawer에서 legal/super-admin에게 노출하는 식으로 표시 정책도 닫아라."
    },
    {
      "id": "AI3-11",
      "severity": "minor",
      "category": "pii-metrics",
      "location": "docs/features/asset-ingestion.md:309-317, docs/features/asset-ingestion.md:369-380",
      "issue": "RRN checksum 공식은 정정됐지만 운영 지표 § 11.1에 detector false-positive/false-negative baseline 또는 review outcome 지표가 없다.",
      "impact": "정확한 checksum을 넣어도 운영상 오탐·미탐 품질을 추적할 방법이 없다.",
      "recommendation": "§ 11.1에 `RRN candidate count`, `checksum pass rate`, `PII true-positive rate`, `false-positive rate`, `redaction completion SLA`를 추가하라. baseline은 초기 30일 관측치로 설정한다고 명시하면 충분하다."
    },
    {
      "id": "AI3-12",
      "severity": "minor",
      "category": "change-policy",
      "location": "docs/features/asset-ingestion.md:27-36",
      "issue": "§ 1.1은 build/runtime/migration fail 룰 강화만 MAJOR로 분류한다. 그런데 v0.3에서 필요한 reconcile/runtime invariant 추가는 운영 안정성 룰이며 사용자 계약 변경과 성격이 다르다.",
      "impact": "4차에서 reconcile invariant를 추가할 때 SemVer 분류가 애매해진다.",
      "recommendation": "keyword-monitoring의 패턴처럼 `runtime invariant·reconcile 룰 추가/강화`를 별도 행으로 두고 MINOR 또는 PATCH 기준을 정하라."
    }
  ],
  "nonFindings": [
    {
      "area": "REVIEW_WORKFLOW cascade",
      "result": "§ 9.1 NotificationEventType 5종과 § 9.1.1 매트릭스 5행, § 10.2.1 AuditAction 5종은 v0.3 설명과 일치한다."
    },
    {
      "area": "DATA_MODEL C-08 v0.18",
      "result": "assetIngestionConfig, assetIngestionPolicyVersion, AssetIngestionApprovedScope cascade는 확인 범위에서 반영돼 있다."
    },
    {
      "area": "table inventory",
      "result": "§ 0의 11 tables와 § 16의 11개 테이블 목록은 일치한다."
    },
    {
      "area": "SNS owner validation",
      "result": "authorAccountId·ownerAccountId 검증과 out-of-scope quarantine 문구는 § 5.2에 반영돼 있다."
    }
  ],
  "recommendedPatchOrder": [
    "먼저 promote 상태 머신, lock/recheck, idempotency, reconcile worker를 닫는다.",
    "그다음 PII reviewStatus/redaction locator와 redacted blob/body 저장 정책을 정리한다.",
    "마지막으로 TargetMapping 5종 타입 전개, unsupported contentType manual hand-off, blob key migration, 운영 지표를 보강한다."
  ]
}