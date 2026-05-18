{
  "reviewTarget": "docs/features/asset-ingestion.md v0.2",
  "verdict": "changes_required",
  "summary": {
    "totalFindings": 14,
    "bySeverity": {
      "critical": 2,
      "major": 8,
      "minor": 4
    },
    "notes": [
      "C-10 `contentType=\"Feature\"` + `featureContentType=\"feature:asset-ingestion\"` 자체는 DATA_MODEL/CONTENT_STANDARDS와 정합합니다.",
      "REVIEW_WORKFLOW §9.1, §9.1.1, §10.2.1 및 DATA_MODEL C-08 v0.18 cascade는 큰 틀에서 반영되어 있습니다.",
      "주요 잔여 리스크는 promote 트랜잭션 경계, PII/RRN 세부 알고리즘, rightsReview 모델 일관성, notifications 의존성 충돌입니다."
    ]
  },
  "findings": [
    {
      "id": "AI2-01",
      "severity": "critical",
      "category": "promote-transaction",
      "title": "promote 단일 DB transaction 안에 외부 compliance-assistant check() 호출이 포함됨",
      "evidence": [
        "asset-ingestion.md §8.2: `2. 단일 DB transaction` 하위 c에 `compliance-assistant check() 호출` 포함",
        "compliance-assistant.md §4.2: 어드민 모드에서 LLM 보조가 옵션 활성화될 수 있음"
      ],
      "problem": "check()가 캐시 miss, 룰 로드, LLM 보조, 네트워크 호출을 포함할 수 있어 DB transaction이 길어지고 lock 점유·timeout·부분 실패 복구가 불명확해진다.",
      "recommendation": "promote 흐름을 `pre-validate/check outside transaction → short transaction(Core row + AssetPromotionRecord + ComplianceRecord insert + state transition) → post-commit audit/outbox`로 분리하라. check 결과는 transaction 진입 전 immutable input hash와 함께 생성하고, transaction 내부에서는 그 결과의 hash/version만 저장하도록 명시하라."
    },
    {
      "id": "AI2-02",
      "severity": "critical",
      "category": "promote-rollback",
      "title": "promote 실패 시 Core row rollback·보상 정책이 명시되지 않음",
      "evidence": [
        "asset-ingestion.md §8.2: Core row INSERT, AssetPromotionRecord INSERT, ComplianceRecord 생성, review-queued 설정을 하나의 흐름으로 기술",
        "asset-ingestion.md §13.2: promote 게이트 실패는 runtime fail만 명시"
      ],
      "problem": "check() 실패, ComplianceRecord 생성 실패, review-queued 전이 실패, post-commit audit/outbox 실패 각각에서 Core row가 남는지 롤백되는지 불명확하다. 특히 외부 호출이 transaction 밖으로 이동하면 Core row와 ComplianceRecord의 원자성 기준을 다시 잡아야 한다.",
      "recommendation": "transaction 내부 실패는 Core row 포함 전부 rollback으로 명시하고, post-commit audit/outbox 실패는 outbox/reconcile 대상인지 별도 정의하라. `AssetPromotionRecord.status=pending|committed|failed` 같은 상태가 필요하면 함께 명시하라."
    },
    {
      "id": "AI2-03",
      "severity": "major",
      "category": "rights-review",
      "title": "`RightsReviewRecord`와 `AssetReviewRecord.rightsReview`가 혼재되어 계약명이 불일치함",
      "evidence": [
        "asset-ingestion.md §7.2 표: `RightsReviewRecord.status=\"approved\"` 필수",
        "asset-ingestion.md §7.2 하단: v0.2 결정은 `AssetReviewRecord.rightsReview` 객체 필드",
        "asset-ingestion.md §16.9: `rightsReview` 객체 정의"
      ],
      "problem": "런타임 검증 대상이 별도 테이블인지 embedded 객체인지 표와 데이터 구조가 다르게 말한다.",
      "recommendation": "§7.2 표를 `AssetReviewRecord.rightsReview.status`와 `AssetReviewRecord.rightsReview.evidenceAttachments[]`로 정정하라. 별도 테이블을 쓰지 않는다면 `RightsReviewRecord` 용어를 제거하라."
    },
    {
      "id": "AI2-04",
      "severity": "major",
      "category": "rights-review",
      "title": "embedded rightsReview가 충분한지 판단할 감사·동시성 기준이 없음",
      "evidence": [
        "asset-ingestion.md §16.9: rightsReview 객체는 현재 status, reviewer, evidence만 보관",
        "REVIEW_WORKFLOW §10.2.1: rights-review 전용 AuditAction은 없음"
      ],
      "problem": "저작권·동의 증빙은 법무 판단 변경 이력, 증빙 추가/삭제, reject 사유, 재승인 이력이 중요하다. 단일 embedded 객체만으로는 append-only 감사 추적이 약하다.",
      "recommendation": "별도 테이블을 만들지 않더라도 `rightsReview.history[]` 또는 audit action을 추가하라. 증빙 삭제 금지, supersede 방식, reviewedBy 역할 자격 검증도 명시하라."
    },
    {
      "id": "AI2-05",
      "severity": "major",
      "category": "target-mapping",
      "title": "closed union 5종 외 Core contentType은 promote 불가라는 명시가 부족함",
      "evidence": [
        "asset-ingestion.md §8.1: TargetContentType은 Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 5종",
        "DATA_MODEL C-10: ReviewPolicy·PricingPage·LocationProfile 등 더 많은 contentType 존재"
      ],
      "problem": "v1.0에서 ReviewPolicy, PricingPage, LocationProfile, ReservationPage 등으로 promote할 수 없는지, 추후 지원인지, manual 처리인지 불명확하다.",
      "recommendation": "§8.1 또는 §13.2에 `v1.0 promote 지원 대상은 5종 한정이며 그 외 contentType은 runtime fail / manual migration 대상`이라고 명시하라."
    },
    {
      "id": "AI2-06",
      "severity": "major",
      "category": "pii-rrn",
      "title": "RRN checksum 알고리즘 설명이 틀리거나 불완전함",
      "evidence": [
        "asset-ingestion.md §9.1: `5번째 자리까지 가중치 곱 + 11 modulo`라고 기술"
      ],
      "problem": "한국 주민등록번호 검증은 앞 12자리 전체에 가중치 `2,3,4,5,6,7,8,9,2,3,4,5`를 곱해 합산하고 `(11 - (sum % 11)) % 10`을 13번째 자리와 비교하는 방식이다. 현재 문구는 5번째 자리까지만 곱한다고 읽힌다.",
      "recommendation": "정확한 공식과 1800/1900/2000년대 성별 코드 처리, 하이픈 제거 후 검증, 실패 시 PII 미분류 또는 낮은 confidence 처리 정책을 명시하라."
    },
    {
      "id": "AI2-07",
      "severity": "major",
      "category": "pii-llm",
      "title": "`AssetPiiFinding.detector=llm`은 정의됐지만 LLM 호출 흐름·권한·prompt 계약이 없음",
      "evidence": [
        "asset-ingestion.md §16.7: detector enum에 `llm` 포함",
        "asset-ingestion.md §14: AI-06은 PII 감지 LLM 기반 정밀도 향상 M2+",
        "asset-ingestion.md §6.2: LLM 태깅은 contentType 추천 중심"
      ],
      "problem": "v1.0에서 llm detector가 가능한지, M2+ 후속인지 충돌한다. PII 원문을 LLM에 보낼 경우 민감정보 외부 전송 승인·promptVersion·redaction-before-LLM 정책이 필요하다.",
      "recommendation": "v1.0에서는 `detector=llm` 금지 또는 reserved로 명시하라. 활성화 시에는 provider allowlist, promptVersion, data minimization, raw PII 전송 금지/승인 예외, audit metadata를 정의하라."
    },
    {
      "id": "AI2-08",
      "severity": "major",
      "category": "blob-iam",
      "title": "`raw/` prefix IAM 정책이 실제 object key format과 맞지 않음",
      "evidence": [
        "asset-ingestion.md §16.12: key format `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`",
        "asset-ingestion.md §16.12: `raw/` prefix는 legal 검수자·super-admin만 read 가능"
      ],
      "problem": "정의된 key에는 `raw/` prefix가 없고 `raw.ext` 파일명만 있다. prefix 기반 IAM condition을 적용할 수 없다.",
      "recommendation": "key format을 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/raw/{filename}` 또는 `.../{kind}/...`처럼 prefix 정책과 맞추라."
    },
    {
      "id": "AI2-09",
      "severity": "major",
      "category": "notifications",
      "title": "notifications 비활성 처리에서 monitor-only 모드 문구와 build fail 문구가 충돌함",
      "evidence": [
        "asset-ingestion.md §2.2: `notifications 비활성은 monitor-only 모드만 허용`",
        "asset-ingestion.md §13.1: `notifications 비활성 + 본 Feature enabled=true`는 build fail",
        "asset-ingestion.md §12.2: 운영 모드는 staged와 auto-promote만 언급"
      ],
      "problem": "monitor-only 모드가 실제 운영 모드인지, v1.0 허용인지, 알림 없이 outbox만 적재하는지 정의되어 있지 않다.",
      "recommendation": "둘 중 하나로 정리하라. v1.0에서 notifications가 필수라면 §2.2의 monitor-only 문구를 제거하라. 허용한다면 §12.2에 mode를 추가하고 §13.1 build fail 예외 조건을 명시하라."
    },
    {
      "id": "AI2-10",
      "severity": "major",
      "category": "outbox",
      "title": "outbox `sourceKind` 3종과 §10.3 이벤트 매핑이 완전히 연결되지 않음",
      "evidence": [
        "asset-ingestion.md §16.11: sourceKind enum `ingestion-log`·`asset`·`pii-finding`",
        "asset-ingestion.md §10.3: PII detected contentRef는 `asset:`이고 metadata에 `piiFindings[]`만 있음",
        "asset-ingestion.md §10.3: batch row는 `asset-ingestion-batch-completed/-failed`처럼 축약 표기"
      ],
      "problem": "`asset-ingestion-pii-detected`의 sourceKind/sourceId가 asset인지 pii-finding인지 불명확하다. 여러 PII finding이 한 asset에서 발생하면 dedupe 단위도 불명확하다.",
      "recommendation": "§10.3에 eventType별 `sourceKind`, `sourceId`, `sourceEventId` 산식을 명시하라. PII는 asset 단위 1회인지 finding 단위인지 결정해야 한다."
    },
    {
      "id": "AI2-11",
      "severity": "major",
      "category": "sns-legal-gate",
      "title": "SNS API `approvedAccountIds` runtime 검증이 요청 파라미터만 다루고 결과 author 검증을 명시하지 않음",
      "evidence": [
        "asset-ingestion.md §5.2: 수집 대상은 approvedAccountIds에 명시된 계정만",
        "asset-ingestion.md §13.2: SNS API 호출이 approvedAccountIds 밖이면 skipped 처리"
      ],
      "problem": "API 응답이 공유글, 리그램, 인용, 댓글, cross-post를 포함하면 실제 content owner/account가 요청 계정과 다를 수 있다.",
      "recommendation": "adapter가 각 item의 `authorAccountId`/`ownerAccountId`를 검증하고 허용 목록 밖이면 asset 생성 전 quarantine 또는 `skipped-legal-out-of-scope` 처리한다고 명시하라."
    },
    {
      "id": "AI2-12",
      "severity": "minor",
      "category": "content-type",
      "title": "`contentType=\"Feature\"` 사용은 정합하지만 raw asset check()의 pageType/articleType fail 예외가 명확하지 않음",
      "evidence": [
        "asset-ingestion.md §6.2: raw asset 단계에서 `contentType: \"Feature\"`, `featureContentType: \"feature:asset-ingestion\"`, pageTypeId undefined",
        "CONTENT_STANDARDS §7.1.1: Feature namespace는 허용",
        "compliance-assistant.md §3.3: pageTypeId 미지정 시 유도 불가하면 fail"
      ],
      "problem": "Feature contentType의 raw asset check에서 pageTypeId 미유도가 정상인지, Feature scope 룰만 적용하는지 명시가 약하다.",
      "recommendation": "compliance-assistant 쪽 또는 본 문서 §6.2에 `contentType=Feature`인 raw asset은 pageTypeId/articleType 미지정을 허용하고 feature-scoped/global rules만 적용`한다고 명시하라."
    },
    {
      "id": "AI2-13",
      "severity": "minor",
      "category": "inventory",
      "title": "AI-16이 본문에는 등장하지만 미결정 사항 표에는 누락됨",
      "evidence": [
        "asset-ingestion.md §16.12: `AI-16 신규 — 인프라 결정`",
        "asset-ingestion.md §14: AI-01~AI-15까지만 표기"
      ],
      "problem": "미결정 사항 추적 목록과 본문 참조가 불일치한다.",
      "recommendation": "§14에 AI-16 row를 추가하라. 예: `signed URL refresh client SDK / blob signed URL renewal strategy`."
    },
    {
      "id": "AI2-14",
      "severity": "minor",
      "category": "wording",
      "title": "§7.2에 별도 테이블 신설 잔재 문구가 남아 있음",
      "evidence": [
        "asset-ingestion.md §7.2: `RightsReviewRecord 별도 테이블 — §16.7a 신설 (또는 ...)` 뒤에 v0.2 결정이 이어짐"
      ],
      "problem": "최종 결정 문서인데 이전 대안 문구가 남아 있어 구현자가 §16.7a를 찾거나 별도 테이블을 만들 수 있다.",
      "recommendation": "대안 문구를 삭제하고 최종 결정만 남겨라."
    }
  ],
  "cascadeVerification": {
    "reviewWorkflowNotificationEnum": "pass",
    "reviewWorkflowNotificationMatrix": "pass",
    "reviewWorkflowAuditEnum": "pass",
    "dataModelC08v018": "pass",
    "contentStandardsFeatureEnum": "pass",
    "caveats": [
      "cascade는 존재하지만 asset-ingestion 본문 내부에서 이를 소비하는 방식에 일부 충돌이 남아 있음.",
      "특히 notifications 필수 여부와 outbox sourceKind 매핑은 cascade 문서보다 asset-ingestion 내부 정의가 부족함."
    ]
  },
  "nonFindings": [
    {
      "topic": "C-10 Feature enum 정합",
      "conclusion": "`contentType=\"Feature\"`와 `featureContentType=\"feature:asset-ingestion\"`는 DATA_MODEL C-10 및 CONTENT_STANDARDS §7.1.1 패턴과 정합한다."
    },
    {
      "topic": "AssetIngestionApprovedScope 분리",
      "conclusion": "DATA_MODEL C-08 v0.18에서 SerpCrawlerApprovedScope와 별도 타입으로 정의되어 있으며 SERP 전용 필드 제거 의도도 반영되어 있다."
    },
    {
      "topic": "PII critical notification",
      "conclusion": "REVIEW_WORKFLOW §9.1.1 기준 `asset-ingestion-pii-detected`는 critical, quietHours bypass, mandatory로 정합한다. 단, critical도 inactive 사용자·채널 비활성·dedupe는 우회하지 않는다는 notifications 정책을 본문에 짧게 재확인하면 더 안전하다."
    }
  ]
}