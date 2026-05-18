{
  "feature": "crm-sync",
  "version_reviewed": "v0.1",
  "cycle": 1,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.1은 큰 방향은 맞지만 SoT cascade가 실제로 완료되지 않았고, 외부 CRM/EMR 연동·PII·webhook 보안·충돌 해결의 운영 계약이 아직 추상 선언 수준이다. 현재 상태로는 v1.0 안정판 기준에 미달한다.",
    "blocking_count": 9,
    "major_count": 8,
    "minor_count": 4
  },
  "findings": [
    {
      "id": "CS1-01",
      "severity": "blocking",
      "category": "SoT 정합",
      "location": "docs/features/crm-sync.md:10-12, 87-91, 328-335; docs/admin/REVIEW_WORKFLOW.md:464-541; docs/core/DATA_MODEL.md:588-595",
      "issue": "crm-sync는 REVIEW_WORKFLOW NotificationEventType 4종, AuditAction 4종, DATA_MODEL C-08 v0.19 cascade가 필요하다고 선언하지만 실제 SoT에는 반영되어 있지 않다. DATA_MODEL은 현재 v0.18이며 crmSyncConfig/crmSyncPolicyVersion 필드가 없다.",
      "impact": "notify() 호출·audit insert·manifest validation이 런타임에서 실패하거나 문서 간 단일 진실 원본이 깨진다.",
      "recommendation": "REVIEW_WORKFLOW §9.1 enum/§9.1.1 매트릭스에 4종 이벤트를 추가하고, §10.2.1 AuditAction에 4종을 추가하라. DATA_MODEL C-08에 CrmSyncConfig와 crmSyncPolicyVersion을 v0.19로 cascade하고 변경 이력도 갱신하라."
    },
    {
      "id": "CS1-02",
      "severity": "blocking",
      "category": "SoT 정합",
      "location": "docs/features/crm-sync.md:91, 254-258, 498, 535; docs/core/DATA_MODEL.md:189-207, 912-913",
      "issue": "ReservationPage/CTAConfig를 sync 대상 Core 객체로 둔 설명이 DATA_MODEL과 맞지 않는다. C-20 ReservationPage는 예약 안내 콘텐츠이며 contact.email 같은 submission 필드가 없다.",
      "impact": "CrmFieldMapping.solutionFieldPath 예시가 존재하지 않는 Core 경로를 가리키므로 실제 구현자가 콘텐츠 계약과 사용자 제출 데이터 계약을 혼동한다.",
      "recommendation": "v1.0에서는 ReservationPage 자체가 아니라 별도 ReservationSubmission/Inquiry/ConversionEvent 운영 이벤트를 sync 대상으로 정의하라. C-20은 채널 설정 참조만 가능하다고 명확히 하고, CONTENT_STANDARDS cascade가 필요한 이벤트 인터페이스를 별도 SoT로 분리하라."
    },
    {
      "id": "CS1-03",
      "severity": "blocking",
      "category": "외부 시스템 연동 안정성",
      "location": "docs/features/crm-sync.md:21-23, 128, 320-322, 421, 472",
      "issue": "provider 4종·entity 5종 지원을 요약과 변경 이력에서 선언하지만, korean-emr와 appointment는 각각 v1.x/미지원으로 되어 있다. build-time fail은 appointment만 막고 korean-emr provider 활성화는 막지 않는다.",
      "impact": "v1.0 지원 범위가 불명확해진다. korean-emr를 선택한 인스턴스가 generic-rest-api fallback 없이 build-pass할 수 있다.",
      "recommendation": "v1.0 지원 provider를 salesforce/hubspot/generic-rest-api 3종으로 좁히거나 korean-emr 어댑터 계약을 실제로 완성하라. 미지원이면 `provider='korean-emr'` build fail을 추가하고 §0/§12의 4종 표현을 정정하라."
    },
    {
      "id": "CS1-04",
      "severity": "blocking",
      "category": "webhook 보안",
      "location": "docs/features/crm-sync.md:236-249, 305-318, 584-589",
      "issue": "webhook replay 방지가 timestamp tolerance만으로 정의되어 있고 provider event id/nonce ledger, raw body 서명 검증, canonical string 구성, 중복 delivery idempotency가 없다. HubSpot v3와 Salesforce Outbound Messages/Platform Events의 검증 방식 차이도 HMAC-SHA256 한 줄로 축약되어 부정확하다.",
      "impact": "동일 timestamp 범위 내 replay, JSON 재직렬화로 인한 signature mismatch, provider별 검증 오구현 위험이 크다.",
      "recommendation": "ProviderWebhookVerifier 인터페이스를 만들고 `rawBody`, headers, method, full URL, timestamp, provider event id를 입력으로 받게 하라. `CrmWebhookDeliveryLedger` 또는 기존 테이블에 `(integrationId, providerEventId/signatureDigest)` unique를 두어 replay/dedupe를 보장하라."
    },
    {
      "id": "CS1-05",
      "severity": "blocking",
      "category": "PII·의료법",
      "location": "docs/features/crm-sync.md:141-145, 353-370, 491-504, 519, 552-553",
      "issue": "raw PII 저장 금지와 `retentionDaysSolutionSide=30` 이후 마스킹이 서로 충돌한다. CrmRecordChangeLog.changedFields, CrmConflictRecord.solutionSnapshot/crmSnapshot에는 PII 마스킹 규칙이 일부만 있고 원천적으로 raw PII 저장을 막는 schema/validator가 없다.",
      "impact": "개인정보 최소 저장 원칙이 명세상 강제되지 않는다. 충돌 큐와 변경 로그가 실질적인 PII 저장소가 될 수 있다.",
      "recommendation": "v1.0 원칙을 '솔루션 DB raw PII 저장 금지'로 고정하고 retentionDaysSolutionSide는 displayHints/derived hints 보존 기간으로 재정의하라. 모든 snapshot/change log/outbox metadata에 PII redaction validator를 강제하고, raw detail 조회는 CRM live read + 권한 + audit + no-cache로 제한하라."
    },
    {
      "id": "CS1-06",
      "severity": "blocking",
      "category": "RRN deny",
      "location": "docs/features/crm-sync.md:361-365, 418, 429, 452; docs/features/asset-ingestion.md:397-402",
      "issue": "RRN deny는 v1.0 build/runtime fail로 이미 결정되어 있는데 CS-01 미결정으로 남아 있다. 또한 asset-ingestion checksum 재사용만 말하고 생년월일 유효성·checksum 공식·탐지 결과 처리·payload 폐기 절차가 없다.",
      "impact": "미결정 표가 정책 결정을 되돌리는 것처럼 보이며, RRN 발견 시 어떤 데이터가 저장되는지 불명확하다.",
      "recommendation": "CS-01을 '해소됨'으로 이동하고 v1.0 deny를 확정하라. asset-ingestion §9.1의 후보 추출, 생년월일 검증, checksum 공식 재사용을 명시하고, RRN 발견 payload는 저장하지 않으며 event/count/hashed fingerprint만 남기는 정책을 추가하라."
    },
    {
      "id": "CS1-07",
      "severity": "blocking",
      "category": "충돌 해결",
      "location": "docs/features/crm-sync.md:123-129, 281-291, 546-559",
      "issue": "field-level `solutionSideAuthoritative`가 config에만 있고 CrmFieldMapping/CrmConflictRecord schema에는 반영되지 않는다. last-write-wins도 clock skew, provider timestamp 신뢰도, CAS/version 비교 규칙이 없다.",
      "impact": "양방향 sync에서 필드 단위 병합 결과가 재현 불가능하고, manual conflict 해결 후 동일 충돌이 반복될 수 있다.",
      "recommendation": "CrmFieldMapping에 `authority` 또는 entity policy reference를 추가하고, conflict detection에 crmVersion/solutionVersion/CAS를 포함하라. last-write-wins는 provider timestamp 신뢰 조건과 tie-breaker를 정의하고 manual resolution 후 appliedVersion을 저장하라."
    },
    {
      "id": "CS1-08",
      "severity": "blocking",
      "category": "운영 안정성",
      "location": "docs/features/crm-sync.md:55-60, 295-301, 485-489, 578-582",
      "issue": "CrmSyncRetryQueue와 CrmSyncNotificationOutbox를 search-visibility 패턴 동일이라고만 하고 실제 schema, status enum, lockedAt/claimedAt 구분, nextAttemptAt 계산, exhausted 전이, advisory lock invariant를 전개하지 않았다.",
      "impact": "가장 장애 가능성이 큰 외부 연동 Feature인데 retry 동작이 구현 가능한 수준으로 고정되어 있지 않다.",
      "recommendation": "search-visibility처럼 worker SQL 또는 동등한 claim 계약을 복제하라. `attempts`, `maxAttempts`, `nextAttemptAt`, `lockedAt`, `lastErrorClass`, `status=pending|processing|retryable|exhausted` 등을 명시하고 1m→5m→30m→2h→6h backoff와 permanent 전이를 고정하라."
    },
    {
      "id": "CS1-09",
      "severity": "blocking",
      "category": "운영 모드",
      "location": "docs/features/crm-sync.md:118, 123-129, 199-209, 401-405, 423-431",
      "issue": "outbound-only 모드는 webhook endpoint 비활성만 말하고 `runSync(direction='inbound'|'both')`, inbound field mapping, entity conflictResolution과의 build/runtime 차단 규칙이 없다.",
      "impact": "outbound-only 인스턴스에서도 inbound sync가 명시 호출로 실행될 수 있다.",
      "recommendation": "mode별 허용 command matrix를 추가하라. outbound-only에서는 inbound/both runSync, processInboundWebhook, inbound/both CrmFieldMapping을 build/runtime fail로 막고, entity conflictResolution도 outbound-only-no-conflict 또는 outbound mapping만 허용하라."
    },
    {
      "id": "CS1-10",
      "severity": "major",
      "category": "OAuth·credential rotation",
      "location": "docs/features/crm-sync.md:101-112, 130-133, 170-179, 305-318, 456",
      "issue": "Salesforce refresh token rotation과 API key 갱신이 핵심 요구사항인데 CS-05 미결정으로 남아 있고, token family/version, atomic secret swap, old credential grace, refresh 실패 처리 정책이 없다.",
      "impact": "credential 만료/rotation 중 sync 중단 또는 잘못된 secretRef 사용 가능성이 높다.",
      "recommendation": "CrmIntegrationCredentialVersion 또는 secret version 필드를 도입하고 rotateCredential의 상태 머신을 정의하라. Salesforce는 refresh token rotation 성공 시 새 secretRef commit과 이전 버전 revoke 순서를 명시하라."
    },
    {
      "id": "CS1-11",
      "severity": "major",
      "category": "rate limit·quota",
      "location": "docs/features/crm-sync.md:224, 295-301, 305-318, 457",
      "issue": "provider별 rate limit이 '어댑터 처리'로만 되어 있고 quota bucket, resetAt, retry-after 반영, per integration concurrency 제한이 없다.",
      "impact": "Salesforce daily quota 또는 HubSpot burst limit 도달 시 전체 sync가 실패하거나 provider ban 위험이 있다.",
      "recommendation": "ProviderRateLimitState 테이블 또는 CrmIntegration 상태 필드를 추가하고 `failed-quota`, `skipped-rate-limit`, `nextAllowedAt`, `quotaResetAt` 전이를 정의하라."
    },
    {
      "id": "CS1-12",
      "severity": "major",
      "category": "DPA·동의",
      "location": "docs/features/crm-sync.md:105-108, 189-192, 367-370, 573",
      "issue": "`consentEvidenceRef`가 DPA와 환자 동의 증빙을 한 필드에 섞고 있다. DPA는 provider/기관 계약 증빙이고 환자 동의는 record/entity 단위 증빙일 수 있다.",
      "impact": "법무 승인 게이트가 계약 승인과 데이터 주체 동의 철회를 구분하지 못한다.",
      "recommendation": "`dpaEvidenceRef`와 `patientConsentEvidenceRef`를 분리하라. v1.0에서 환자 단위 동의를 저장하지 않을 경우, inbound PII live read 가능 조건과 동의 철회 처리(CS-07)를 build/runtime gate로 명확히 하라."
    },
    {
      "id": "CS1-13",
      "severity": "major",
      "category": "명세 정합성",
      "location": "docs/features/crm-sync.md:24, 476-582",
      "issue": "§0은 DB 10 tables를 선언하지만 §13에서는 CrmSyncLog·CrmSyncSourceAttempt·CrmSyncRetryQueue와 CrmSyncNotificationOutbox를 '패턴 동일'로만 두어 실제 테이블 인벤토리와 schema가 검증 불가하다.",
      "impact": "이전 Feature의 v1.0 패턴과 달리 구현자에게 필요한 migration 계약이 부족하다.",
      "recommendation": "10개 테이블 모두 최소 필드, required, constraints, indexes, retention/expiresAt을 전개하라."
    },
    {
      "id": "CS1-14",
      "severity": "major",
      "category": "보존 정책",
      "location": "docs/features/crm-sync.md:146-150, 511-523",
      "issue": "syncLog 730일, changeLog 1095일 retention이 config에 있지만 CrmSyncLog/SourceAttempt schema가 없고 CrmRecordChangeLog만 expiresAt이 있다. ConflictRecord 1095일도 expiresAt 필드가 없다.",
      "impact": "운영 보존 정책이 실제 purge worker와 연결되지 않는다.",
      "recommendation": "각 retention 대상 테이블에 `expiresAt` 또는 partition policy를 추가하고 purge worker·legal hold 예외를 정의하라."
    },
    {
      "id": "CS1-15",
      "severity": "major",
      "category": "Notification outbox",
      "location": "docs/features/crm-sync.md:328-347",
      "issue": "§6.1은 REVIEW_WORKFLOW cascade 필요라고 쓰면서 자체 매트릭스를 병렬 정의한다. §6.3은 credential-expired와 credential-expiring-soon을 한 행으로 합쳐 sourceKind/eventType unique와 metadata shape가 느슨하다.",
      "impact": "canonical SoT와 feature-local 표가 갈라질 수 있고 notification idempotency 테스트가 불명확하다.",
      "recommendation": "§6.1은 canonical REVIEW_WORKFLOW 행의 복사본이 아니라 '요청 cascade' 또는 'expected rows'로 명확히 표시하라. 4개 eventType 각각 별도 mapping row를 두고 recipients 산정도 명시하라."
    },
    {
      "id": "CS1-16",
      "severity": "major",
      "category": "Audit log",
      "location": "docs/features/crm-sync.md:172-179; docs/admin/REVIEW_WORKFLOW.md:634-659",
      "issue": "crm AuditAction 4종은 feature 문서에만 있고 REVIEW_WORKFLOW §10.2.1 enum에는 없다. `priorCredentialHash(부분 SHA-256)`도 secret fingerprint 방식이 애매하다.",
      "impact": "audit insert 실패와 credential metadata 유출 위험이 있다.",
      "recommendation": "AuditAction enum cascade를 완료하고 credential hash는 raw secret 유추가 불가능한 secret-manager fingerprint 또는 HMAC 기반 non-reversible fingerprint로 제한하라."
    },
    {
      "id": "CS1-17",
      "severity": "major",
      "category": "미결정 분류",
      "location": "docs/features/crm-sync.md:452-464",
      "issue": "CS-01, CS-02, CS-12, CS-13은 본문에서 이미 v1.0 fail 또는 v1.x로 결정된 항목인데 미결정으로 남아 있다.",
      "impact": "비평 사이클 이후 수용/해소 추적이 어렵고, 구현 범위가 흔들린다.",
      "recommendation": "미결정 표를 `open`, `deferred-v1.x`, `resolved-in-v1.0`로 분리하라. CS-01/12/13은 resolved 또는 deferred로 이동하고 CS-02는 SLA 7일 확정 여부를 본문과 일치시켜라."
    },
    {
      "id": "CS1-18",
      "severity": "minor",
      "category": "공통 메타",
      "location": "docs/core/DATA_MODEL.md:93; docs/features/crm-sync.md:462, 498-499",
      "issue": "asset-ingestion의 `@provenanceAssetId` 같은 Core provenance 메타를 crm-sync에 바로 적용할지 여부가 정리되지 않았다. v1.0에서 CRM→Core 자동 promote는 CS-11 v1.x라 즉시 필수는 아니지만, 미래 cascade 경계는 명시해야 한다.",
      "impact": "v1.x에서 CRM-origin Core row가 생길 때 provenance 필드 설계가 뒤늦게 흔들릴 수 있다.",
      "recommendation": "v1.0은 Core row 생성 없음으로 명시하고, CS-11에서 `@provenanceCrmRecordId` 또는 공통 provenance union 도입 필요성을 후속 결정으로 추가하라."
    },
    {
      "id": "CS1-19",
      "severity": "minor",
      "category": "문서 품질",
      "location": "docs/features/crm-sync.md:1, 20, 59, 105, 472",
      "issue": "문서 출력에 `?`로 보이는 깨진 구분자가 다수 존재한다.",
      "impact": "의미 해석에는 큰 문제는 없지만 안정판 문서 품질 기준에는 맞지 않는다.",
      "recommendation": "인코딩/문자 치환을 정리하고 모든 `?` 잔재를 `—`, `→`, 또는 문장부호로 복구하라."
    },
    {
      "id": "CS1-20",
      "severity": "minor",
      "category": "권한 모델",
      "location": "docs/features/crm-sync.md:166-170, 176-179, 355-359",
      "issue": "raw PII detail live read, conflict resolution, integration registration 권한은 언급되지만 read API별 row-level access와 legal reviewer 접근 조건이 없다.",
      "impact": "운영자 UI에서 CRM live detail 조회가 과도하게 열릴 수 있다.",
      "recommendation": "queryCrmRecords/queryConflicts/detail live read별 권한과 audit action을 추가하라. PII live read는 최소 operator+super-admin 또는 별도 legal gate로 제한하라."
    },
    {
      "id": "CS1-21",
      "severity": "minor",
      "category": "테스트 가능성",
      "location": "docs/features/crm-sync.md:410-431",
      "issue": "build/runtime validation fail은 나열되어 있으나 fixture 기반 acceptance test 항목이 없다.",
      "impact": "v1.0 안정판에서 validator·webhook verifier·RRN deny 회귀를 자동 확인하기 어렵다.",
      "recommendation": "manifest validator, webhook signature/replay, RRN checksum deny, outbound-only command matrix, retry exhausted 전이에 대한 필수 테스트 케이스를 추가하라."
    }
  ],
  "required_next_actions": [
    "REVIEW_WORKFLOW와 DATA_MODEL cascade를 실제로 반영하거나, v0.1 문서에서 'cascade 필요' 상태를 명확히 blocker로 유지한다.",
    "v1.0 지원 범위를 provider 3종/entity 4종으로 좁히거나 korean-emr/appointment 계약을 완성한다.",
    "PII 원칙을 raw PII 저장 금지로 재정의하고 모든 로그·snapshot·outbox metadata에 redaction validator를 건다.",
    "webhook verifier/replay ledger, retry queue schema, rate-limit state, credential rotation state machine을 전개한다.",
    "ReservationPage/CTAConfig와 submission/event sync 대상의 경계를 다시 쓴다."
  ],
  "stability_assessment": {
    "SoT_alignment": "fail",
    "external_integration_reliability": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "operational_reliability": "partial",
    "spec_internal_consistency": "partial",
    "previous_feature_pattern_alignment": "partial"
  }
}