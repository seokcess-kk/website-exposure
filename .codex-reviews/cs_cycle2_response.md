Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e25d7-24a9-7720-9b32-8131966aa664
--------
user
# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.2 (2차 사이클)

## 컨텍스트

1차 사이클(21개 지적) 전건 수용 후 v0.2로 전면 재작성. 주요 cascade:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1·§ 10.2.1: 4종 NotificationEventType + 4종 AuditAction 완료
- DATA_MODEL C-08 v0.19: CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion 추가
- ReservationPage/CTAConfig 경계 정리: 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent (CONTENT_STANDARDS 후속 cascade — CS-15 신규)
- provider 3종 한정 (salesforce·hubspot·generic-rest-api). korean-emr build fail
- entity 4종 (appointment v1.x — CS-12 deferred)
- raw PII 저장 금지 강제 (rawPiiStorageAllowed=false build fail) — displayHints만
- RRN deny v1.0 강제 + asset-ingestion § 9.1 checksum 재사용
- ProviderWebhookVerifier 인터페이스 + CrmWebhookNonceLedger (replay 방지)
- field-level FieldAuthority enum + CAS·clock skew·tie-breaker·appliedVersion
- credential rotation 상태 머신 (stable·rotating·committed·reverted + grace period)
- DPA vs patient consent 분리 (dpaEvidenceRef·patientConsentEvidenceRef)
- 미결정 3분류 (open/deferred-v1.x/resolved-in-v1.0)
- audit log contract + credential fingerprint (HMAC non-reversible)
- DB 10 tables (Integration·SyncLog·SourceAttempt·RetryQueue·Record·RecordChangeLog·FieldMapping·ConflictRecord·CredentialAuditLog·RateLimitState·WebhookNonceLedger·NotificationOutbox)
- acceptance test fixture (CS1-21)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.2를 이전과 동일한 강도로 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가? 표면만 바뀌고 본질은 남아있지 않은가?

2. **신규 도입 메커니즘의 모순·미진함**:
   - ProviderWebhookVerifier 인터페이스 — provider별 차이(Salesforce Outbound Messages SOAP/XML vs HubSpot v3 vs generic) 추상화 누수
   - CrmWebhookNonceLedger replay 윈도우와 timestampTolerance·retention의 정합성
   - field-level FieldAuthority + CAS의 race condition·tie-breaker manual escalate 트리거 정확성
   - credential rotation 상태 머신 grace period 동시성 (rotating 중 outbound·inbound 동작)
   - rawPiiStorageAllowed=false 강제 시 PII Redaction Validator 구현 가능성·drift 감지 신뢰성
   - liveReadCrmDetail의 audit cascade가 v1.x deferred(CS-14)인데 v1.0에서 운영 가능한가
   - RRN deny — payload 폐기·fingerprint 보존 — 잘못된 false positive 시 운영자 복구 경로

3. **mode 분리 (outbound-only) 일관성**:
   - 모든 command/event/error matrix에서 outbound-only가 제대로 차단되는가
   - conflictResolution=outbound-only-no-conflict 외 값 build fail 정확성
   - inbound runSync/processInboundWebhook 차단의 HTTP 404 vs runtime error 일관성

4. **DB 10 tables 완결성**:
   - 모든 FK·UNIQUE·INDEX·partial unique 누락 없는가
   - retention 필드(expiresAt) cascade 일관성 — purge worker SoT가 본 Feature와 다른 Feature(notifications·analytics-reporting)와 충돌하지 않는가
   - CrmRecord.displayHints만으로 운영자 화면이 충분한 정보를 제공하는가 (UX trade-off)

5. **이전 Feature와의 패턴 정합성**:
   - asset-ingestion AssetPromotionRecord 4-state machine과 본 Feature credential rotation state machine 패턴 일관성
   - search-visibility/keyword-monitoring outbox SQL 재사용 정확성
   - DATA_MODEL § 2.2 `@provenanceAssetId` 같은 공통 메타가 CS-18에서 v1.x deferred로 처리됐는데, 본 Feature inbound CrmRecord에 `@provenanceCrmRecordId` 같은 필드가 v1.0에 필요한가

6. **운영 SLA·acceptance test fixture**:
   - § 8.2 acceptance test 6항목으로 v1.0 회귀 방지가 충분한가
   - § 4.5 credential rotation의 rotationGracePeriodMinutes(30분) 기본값이 운영 현실에 맞는가
   - § 11 미결정 3분류의 v1.x deferred 항목들이 v1.0 운영 차단 요인 아닌가

7. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 10 tables 일관성
   - § 6.1 NotificationEventType 4종 ↔ § 13.11 outbox `UNIQUE(sourceKind, sourceId, eventType)` 정합
   - § 7.1 PII Redaction Validator·§ 13.5 CrmRecord PII 필드 금지 cross-check
   - § 3.1.1 audit log contract 4행 ↔ REVIEW_WORKFLOW § 10.2.1 cascade 정합

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS2-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle1_response.md` (1차 지적)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
codex
`seo-geo` 스킬이 이 문서 검토 범주와 일부 겹치지만, 이번 요청은 SEO 개선이 아니라 CRM sync 명세의 설계 리뷰라서 일반 코드/문서 리뷰 방식으로 진행하겠습니다. 먼저 대상 문서와 1차 응답, 관련 SoT를 병렬로 읽어 상호 참조부터 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/features/crm-sync.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath '.codex-reviews/cs_cycle1_response.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/core/DATA_MODEL.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/admin/REVIEW_WORKFLOW.md'" in C:\Users\assag\solution\website-exposure
 succeeded in 699ms:
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

 succeeded in 740ms:
# Feature — crm-sync

> **상태**: Draft v0.2 (codex 자동 비평 1차 반영 — 21개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화 — 예약 신청·문의·전환 이벤트·고객 컨택트. 솔루션 측은 **raw PII 저장 금지** (displayHints 마스킹만). webhook(실시간) + polling(배치).
> **연관 문서**:
> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·4종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.19 `crmSyncConfig`·`crmSyncPolicyVersion`
> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync(예약 신청·문의·전환 이벤트·고객 컨택트), (b) field-level mapping + authority, (c) webhook(실시간) + polling(배치), (d) 충돌 해결 (field-level CAS), (e) **raw PII 저장 금지** — 솔루션 DB에는 displayHints/derived hints만, (f) DPA·credential rotation·만료 알림
- **vs ReservationPage(C-20)** (CS1-02): C-20은 **예약 안내 콘텐츠 페이지**. 본 Feature는 **예약 신청(ReservationSubmission)·문의(Inquiry)·전환(ConversionEvent)** 운영 이벤트 sync. C-20 자체는 sync 대상 아님 (참조만)
- **provider 3종 (v1.0 한정 — CS1-03)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr`은 v1.x (CS-13 deferred)
- **운영 모드 2종**: `bi-directional`(양방향·기본)·`outbound-only`(솔루션→CRM 일방향)
- **sync entity 4종 (v1.0 — appointment v1.x)**: `reservation`(예약 신청)·`contact`(고객 컨택트)·`inquiry`(문의)·`conversion-event`(전환 이벤트)
- **PII 정책**: 솔루션 DB raw PII 저장 금지. minimalRetention=true 강제(v1.0). displayHints만 저장. raw detail은 CRM live read (no-cache)
- **RRN**: 솔루션 측 deny 강제 (v1.0 — CS1-06 resolved). asset-ingestion § 9.1 checksum 알고리즘 재사용
- **DB 인벤토리**: **10 tables** (모든 schema § 13 전개)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08 CrmSyncConfig enum + adapter contract + build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping schema 영향 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | 데이터 정합 영향 |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림 발송·audit SoT는 notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion SoT는 DATA_MODEL C-08 v0.19
- RRN checksum SoT는 `features/asset-ingestion.md` § 9.1 (재사용)
- 본 문서 = sync 파이프라인·field mapping·충돌 해결·PII·credential rotation·audit SoT + 내부 데이터 구조 SoT (§ 13)

### 1.2.1 공통 retry taxonomy

| 큐 | maxAttempts |
|---|---|
| CrmSyncRetryQueue | config(기본 5)·configurable |
| CrmSyncNotificationOutbox | 상수 5 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 — notifications
- 외부 CRM 운영·계약 — 클라이언트·CRM provider 책임
- Core 콘텐츠 변환 — asset-ingestion (CRM→Core auto promote는 v1.x — CS-11 deferred)
- 의료 진료 기록 보관 — CRM·EMR 측 책임 (RRN 등 솔루션 측 통과 금지)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "0.2"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
| REVIEW_WORKFLOW § 10.2.1 | 4종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.19 | `crmSyncConfig`·`crmSyncPolicyVersion` |
| DATA_MODEL CT-03·C-20 | CTAConfig·ReservationPage **참조만** (콘텐츠 페이지) |
| asset-ingestion § 9.1 | RRN checksum 알고리즘 재사용 |

### 2.3 InstanceManifest 통합

```yaml
crmSyncConfig:                                          # DATA_MODEL C-08 v0.19
  integrations:
    - id: "main-crm"
      provider: "salesforce"                            # CS1-03 — v1.0: salesforce·hubspot·generic-rest-api만
      apiKeySecretRef: "secretRef://CRM_SALESFORCE_OAUTH"
      apiUrl: "https://example.my.salesforce.com"
      webhookSecret: "secretRef://CRM_SALESFORCE_WEBHOOK_SECRET"
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true
      legalApprovedBy: "legal@glitzy.kr"
      legalApprovedAt: "2026-05-10T00:00:00Z"
      dpaEvidenceRef: "secretRef://CRM_DPA_CONTRACT_REF"  # CS1-12 — DPA 계약 증빙

crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "0.2.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"                            # bi-directional | outbound-only
      syncSchedule:
        pollIntervalMinutes: 15
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      entities:                                          # CS1-09 — outbound-only 모드는 conflictResolution="outbound-only-no-conflict"만 허용
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
        # appointment는 v1.x (CS-12 deferred). enabled=true 시 build fail
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint:                                   # CS1-04 — verifier 인터페이스 § 4.2
        path: "/api/crm-sync/webhook/{integrationId}"
        timestampToleranceSeconds: 300
        nonceLedgerRetentionMinutes: 60                 # nonce/eventId ledger 보존
      retryQueue:
        maxAttempts: 5
        backoffSeconds: [60, 300, 1800, 7200, 21600]
        workerPollIntervalSeconds: 30
      credentialRotation:                                # CS1-10
        warnDaysBeforeExpiry: 14
        autoNotifyEnabled: true
        rotationGracePeriodMinutes: 30                  # 이전 credential 병행 허용 시간
      rateLimit:                                         # CS1-11
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii:                                               # CS1-05 강화
        rawPiiStorageAllowed: false                     # v1.0 강제 false (raw PII 저장 금지)
        displayHintsRetentionDays: 30                   # displayHints 보존 (마스킹된 표시값)
        ssnRrnHandling: "deny"                          # CS1-06 — v1.0 강제 deny
        liveReadRequiresAudit: true                     # raw detail 조회 시 audit 필수
      retentionDays:
        syncLog: 730
        changeLog: 1095
        conflictRecord: 1095
        webhookNonceLedger: 1                           # 1일 (timestampToleranceSeconds + 여유)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CS1-09·20 권한 명시)

| 종류 | 함수 | 책임 | 권한 | mode 제약 |
|---|---|---|---|---|
| 실행 command | `runSync(input)` | sync cycle | operator·super-admin | outbound-only 모드는 direction="outbound"만 허용 |
| 실행 command | `processInboundWebhook` | webhook 수신 | system (HTTP endpoint) | outbound-only 모드는 endpoint 비활성 (HTTP 404) |
| 실행 command | `pushOutbound(entity, recordId, operation)` | 솔루션 → CRM 즉시 push | operator·super-admin (system 자동 호출 가능 — 폼 제출 시) | 모든 mode 가능 |
| 실행 command | `resolveConflict(conflictId, resolution)` | 충돌 해결 | operator·super-admin. legal 검수자 read-only | outbound-only 모드는 충돌 없음 — 호출 불가 |
| 실행 command | `liveReadCrmDetail(crmRecordId)` | CRM live PII detail 조회 (no-cache·audit 기록) | **operator·super-admin·legal-reviewer** (CS1-20). audit `crm-live-read` 자동 기록 (v1.x audit cascade — CS-14 신규) |
| read API | `queryCrmRecords` | 어드민 — **displayHints만** | operator·super-admin·legal-reviewer (raw PII 미반환) |
| read API | `queryConflicts` | 충돌 큐 | operator·super-admin |
| 운영 command | `registerIntegration` | super-admin | |
| 운영 command | `unregisterIntegration` | soft delete | super-admin | |
| 운영 command | `rotateCredential` | 자격증명 rotation 상태 머신 (§ 4.5) | super-admin | |

### 3.1.1 audit log contract

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash(SHA-256 8자) | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·appliedVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprint·newCredentialFingerprint | super-admin |

**credential fingerprint** (CS1-16): `HMAC-SHA256(secret-manager-key-id, "crm-credential-fingerprint")` 8자 prefix — raw secret 유추 불가능한 non-reversible fingerprint

### 3.2 sync entity 정의 (CS1-02 — 콘텐츠 vs 운영 이벤트 분리)

본 Feature가 다루는 **운영 이벤트**(CONTENT_STANDARDS 후속 cascade 영역 — CS-15 신규):

```ts
type ReservationSubmission = {
  submissionId: string;          // 솔루션 측 식별자
  reservationPageRef: Ref<C-20>; // 어떤 ReservationPage(콘텐츠)에서 제출됐는지
  ctaConfigRef?: Ref<CT-03>;     // 어떤 CTAConfig 채널
  source?: string;               // 마케팅 출처
  campaign?: string;
  submittedAt: Date;
  piiHash?: string;              // 솔루션 측 저장은 hash·displayHints만 (raw PII는 CRM)
  displayHints: { nameInitial?: string; phoneLast4?: string; emailDomain?: string };
  crmExternalId?: string;        // sync 완료 후 채움
};

type Contact = { /* CRM 측 식별자만 보유. displayHints */ };
type Inquiry = { /* 동일 */ };
type ConversionEvent = { /* CRM 일방향 push. PII 없음 */ };
```

### 3.3 RunSyncInput·Result

v0.1 § 3.3 유지 + outbound-only mode 시 `direction="outbound"` 강제 (CS1-09).

### 3.4 webhook 처리 (CS1-04 강화)

```ts
async function processInboundWebhook(integrationId: string, headers: Record<string,string>, rawBody: Buffer): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-credential-expired" | "rejected-rrn-detected" | "queued";
  recordsProcessed: number;
  conflicts: number;
}>;
```

- **rawBody 그대로 verifier 호출** — JSON 재직렬화 금지 (signature mismatch 회피)
- **ProviderWebhookVerifier 인터페이스**: provider별 어댑터가 (rawBody, headers, fullUrl, method, timestamp, providerEventId) → 검증 결과
- **nonce ledger** (CS1-04): `CrmWebhookNonceLedger` 테이블 — `(integrationId, providerEventId)` UNIQUE. 동일 eventId 재발신은 deduped 처리 (HTTP 200 + "already-processed")

---

## 4. sync 파이프라인

### 4.1 outbound (솔루션 → CRM)

v0.1 § 4.1 유지 + 추가:
- `pushOutbound` 입력 payload에 raw PII가 포함되어 있으면 즉시 hash → solution DB는 displayHints만 저장. CRM API 호출 페이로드에 raw PII 직접 전달 (cache 없이 transient)
- conversionEvent는 PII 없음 — raw PII 검사 skip

### 4.2 inbound (CRM → 솔루션) + ProviderWebhookVerifier (CS1-04)

```
1. CRM이 endpoint POST → processInboundWebhook
2. rawBody 그대로 ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) 호출
   - provider별 구현 (Salesforce HMAC-SHA256·HubSpot v3 signature·generic-rest-api custom)
   - 실패 → HTTP 401 + status="rejected-signature"
3. timestamp tolerance 검증 — `headers.timestamp ∈ now ± timestampToleranceSeconds` 아니면 rejected-replay
4. **CrmWebhookNonceLedger insert** — `(integrationId, providerEventId)` UNIQUE
   - 중복 → HTTP 200 + status="queued" (idempotent. 이미 처리됨)
5. **RRN 검사 (CS1-06)**: rawBody 전체에 asset-ingestion § 9.1 RRN checksum 알고리즘 적용
   - RRN 검출 시 → **payload 폐기** (CrmRecord 미생성). CrmWebhookNonceLedger에 `rrnDetected=true` 마킹 + hashed fingerprint(non-reversible)만 보존 + 외부 sink alert + status="rejected-rrn-detected"
6. payload 파싱 + CrmFieldMapping 역방향 적용 (raw PII는 hash + displayHints로 변환)
7. **field-level 충돌 감지** (§ 4.3)
8. 충돌 없음 → CrmRecord update + CrmRecordChangeLog (PII 마스킹된 changedFields)
9. 충돌 있음 → CrmConflictRecord 생성 → operator 큐
```

### 4.3 field-level 충돌 해결 (CS1-07 강화)

각 CrmFieldMapping에 `authority` 필드:

```ts
type FieldAuthority =
  | "crm-authoritative"           // 항상 CRM 측 우선
  | "solution-authoritative"      // 항상 솔루션 측 우선
  | "last-write-wins-timestamp"   // provider timestamp 기반
  | "last-write-wins-version";    // CAS 기반 version 비교
```

**last-write-wins-timestamp** 정확화:
- provider timestamp 신뢰성 검증: webhook payload timestamp는 provider 측 시각. 솔루션 측 update는 신뢰 가능한 wall-clock
- clock skew tolerance: ±5초. 5초 이내 동일 timestamp는 tie → tie-breaker로 `crmVersion·solutionVersion` 비교
- 모든 비교 실패 시 → `manual` 정책으로 escalate (CrmConflictRecord)

**last-write-wins-version (CAS)**:
- CrmRecord.crmVersion·solutionVersion 비교. 더 높은 version 승리
- version mismatch (예: 솔루션 측 update가 CrmRecord.solutionVersion 갱신 전 발생) → manual

**manual 해결 후**: `resolveConflict(conflictId, resolution)` 시 `appliedVersion` 저장 — 동일 충돌 재발 방지 (CrmRecord.lastAppliedConflictVersion 갱신)

### 4.4 retry queue·rate limit (CS1-08·11 schema 전개)

§ 13.4 CrmSyncRetryQueue·§ 13.10 CrmRateLimitState 풀 schema. worker SoT SQL은 search-visibility § 13.5 패턴 동일.

### 4.5 credential rotation 상태 머신 (CS1-10)

```
state: stable → rotating → committed (성공) → stable
       stable → rotating → reverted (실패) → stable

rotateCredential(integrationId, newSecretRef):
1. rotating 상태 진입 — old credential은 rotationGracePeriodMinutes(기본 30분) 동안 fallback으로 유지
2. 새 credential로 health check API 호출
3. 성공 → committed: CrmCredentialAuditLog `rotated` 기록. old credential은 secret manager에서 revoke (또는 grace 후 자동)
4. 실패 → reverted: 새 secretRef 폐기. CrmCredentialAuditLog `rotation-failed` 기록 + sink alert. 운영자 재시도 필요
```

---

## 5. provider 어댑터 (v1.0 — 3종)

### 5.1 Salesforce
- OAuth 2.0 + Web Server Flow. refresh token rotation 자동
- webhook: Outbound Messages (XML SOAP) 또는 Platform Events (CometD/Streaming API)
- 서명: HMAC-SHA256 (configurable webhook secret)

### 5.2 HubSpot
- Private App Token (long-lived)
- webhook: X-HubSpot-Signature-v3 (HMAC-SHA256 with secret + timestamp + body)
- rate limit: 100 requests/10s per account

### 5.3 generic-rest-api
- 인증: Bearer Token / API Key (config로 선택)
- webhook: 사용자 지정 endpoint·서명 알고리즘 (config로 정의)

### 5.4 korean-emr (v1.x — CS-13 deferred)
- v1.0 build fail (`provider="korean-emr"` 사용 시)

---

## 6. 알림 (outbox 패턴 — CS1-15 정렬)

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 4종)

**canonical SoT는 REVIEW_WORKFLOW § 9.1.1**. 본 절은 매트릭스 행 인용·매핑만:

| eventType | criticality | 즉시 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | **critical** | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox 패턴 — search-visibility § 7.2 SQL 동일

### 6.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | contentRef | contentTitle |
|---|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` | `"CRM sync 실패 — ${integrationId}"` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` | `"CRM 충돌 — ${entity}/${crmExternalId}"` |
| `crm-sync-credential-expired` | `integration` | integrationId | `"crm-integration:" + integrationId` | `"자격증명 만료 — ${integrationId}"` |
| `crm-sync-credential-expiring-soon` | `integration` | integrationId | 동일 | `"만료 임박 — ${expiresAt}"` |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`.

---

## 7. PII 처리 (CS1-05·06 강화 — 의료법·개인정보보호법)

### 7.1 raw PII 저장 금지 (v1.0 강제)

- `pii.rawPiiStorageAllowed=false` 강제 (v1.0 build fail if true)
- **솔루션 DB에는 displayHints/derived hints만**:
  - 이름 → `nameInitial` (예: "홍O동")
  - 전화 → `phoneLast4` (예: "1234")
  - email → `emailDomain` (예: "@example.com")
  - 주소 → `cityName` 만
- **CrmRecord·CrmRecordChangeLog·CrmConflictRecord 모든 snapshot/changedFields에 raw PII 저장 금지** — PII Redaction Validator가 schema 검증 시 강제
- raw detail 조회 — `liveReadCrmDetail(crmRecordId)`로 CRM API 실시간 호출 (no-cache·audit)

### 7.2 RRN deny (CS-01 resolved — v1.0 강제)

- `pii.ssnRrnHandling="deny"` 강제 (build fail if other value)
- asset-ingestion § 9.1 RRN checksum 알고리즘 재사용:
  - 후보 추출: `\b\d{6}-?[1-8]\d{6}\b`
  - 생년월일·성별 코드 유효성
  - checksum: 가중치 `[2,3,4,5,6,7,8,9,2,3,4,5]` + `(11-(sum%11))%10`
- 검증 통과 RRN 감지 시:
  - inbound webhook → payload 폐기. CrmRecord 미생성. status="rejected-rrn-detected"
  - outbound push → push 차단. solution 측 입력 거부
  - CrmWebhookNonceLedger 또는 CrmRecordChangeLog에 `rrnDetected=true` + `rrnFingerprint`(non-reversible HMAC) 보존 — 운영 감사용·raw RRN 보존 금지

### 7.3 DPA vs patient consent 분리 (CS1-12)

- `dpaEvidenceRef` (DATA_MODEL C-08 — required): 의료기관 ↔ Glitzy 데이터 처리 위탁 계약 증빙
- `patientConsentEvidenceRef` (v1.x — CS-07 deferred): 환자 단위 동의 증빙. v1.0은 record-level 미저장
- v1.0 운영: DPA 게이트 통과 + raw PII는 CRM 측 책임 (Glitzy 솔루션은 통과 안 함)

---

## 8. 운영 지표 (CS1-21 acceptance test 추가)

### 8.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | success / 전체 | > 99% |
| outbound push 지연 | < 5초 (p95) | |
| inbound webhook 지연 | < 10초 (p95) | |
| 충돌 발생율 | < 1% (baseline 후) | |
| credential 만료 알림 SLA | 7일 내 처리 | > 95% |
| RRN deny 발생율 | (baseline) | (운영 누적) |
| webhook signature reject율 | (보안 감사) | < 0.1% |
| nonce ledger dedupe 적중률 | (재전송 빈도 추적) | baseline |
| outbox 발송 성공율 | > 99% | |

### 8.2 acceptance test fixture (CS1-21)

v1.0 안정판 회귀 방지용 필수 테스트 케이스:
- manifest validator: legalApproved=false build fail, korean-emr build fail, appointment enabled build fail
- webhook verifier: provider별 valid/invalid signature·rawBody integrity·replay window
- RRN deny: regex+checksum+payload 폐기·fingerprint 보존
- outbound-only mode: inbound runSync/processInboundWebhook 차단
- retry exhausted: maxAttempts 도달 → failed-permanent + sink alert
- credential rotation: rotating → committed/reverted 두 경로

---

## 9. 설치·설정 — v0.1 § 9 유지 + DB 10 tables

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig` 또는 `integrations[]` 빈 배열
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- **integration `dpaEvidenceRef` 누락** (CS1-12)
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional mode + integration `webhookSecret` 누락
- **integration `provider="korean-emr"` 또는 `provider="salesforce"·"hubspot"·"generic-rest-api"` 외** (CS1-03)
- `requiresFeature: notifications` 충족 안 됨
- **`pii.rawPiiStorageAllowed=true`** (CS1-05 — v1.0 강제 false)
- **`pii.ssnRrnHandling !== "deny"`** (CS1-06 — v1.0 강제 deny)
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true` (CS-12 deferred — v1.0 미지원)
- `entities.<other>.conflictResolution`이 **`mode="outbound-only"` + `outbound-only-no-conflict` 외**(CS1-09)
- `fieldMappingPolicyVersion` 누락

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 검증 실패 → HTTP 401 rejected-signature
- replay window 초과 → rejected-replay
- nonce ledger 중복 (이미 처리됨) → HTTP 200 idempotent (fail 아님)
- credential 만료 후 sync 시도 → skipped-credential-expired
- **inbound payload RRN 검출** (CS1-06) → 폐기 + sink alert
- **outbound push payload RRN 검출** → 차단 + 운영자 alert
- `resolveConflict` 시 conflictId가 이미 resolved
- **mode="outbound-only" + processInboundWebhook 호출** → HTTP 404 (CS1-09)
- **mode="outbound-only" + runSync direction="inbound"/"both"** → runtime fail (CS1-09)

### 10.3 migration-time validation

- 신규 인스턴스 v0.2 적용 — 이전 데이터 없음
- 기존 인스턴스 — v0.2 cascade 신규 (v0.1 운영 데이터 부재 전제)

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile
- CrmConflictRecord open + slaDeadline 초과 → operator 추가 알림 (SLA 미달)
- credential expiry 도래 (`warnDaysBeforeExpiry` 14일) → `crm-sync-credential-expiring-soon` 자동 발송
- credential 만료 → `crm-sync-credential-expired` + integration 자동 비활성화
- **PII Redaction Validator drift 감지** (raw PII가 schema 미통과로 row insert됨) → 즉시 sink alert + 운영자 수동 정리

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60 (실시간성 저하)
- conflict open ≥ 5건 누적

---

## 11. 미결정 사항 (CS1-17 — 3분류)

### 11.1 open (v1.x·M2+ 후속)

| ID | 항목 | 비고 |
|---|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 | 운영 정책 |
| CS-03 | 다중 CRM 통합 시 우선순위 | 운영 정책 |
| CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 결정 |
| CS-05 | OAuth refresh token rotation 자동화 정밀화 | 인프라 결정 |
| CS-06 | provider별 quota 운영 가이드 | M2+ |
| CS-08 | LLM 기반 field auto-mapping | v1.x |
| CS-09 | CrmFieldMapping bulk import/export (CSV) | M2+ |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 정책 |
| CS-14 | `crm-live-read` audit cascade (raw PII live 조회 추적) | v1.x patch — REVIEW_WORKFLOW § 10.2.1 후속 cascade |
| CS-15 | CONTENT_STANDARDS submission/event 인터페이스 cascade | CONTENT_STANDARDS 후속 |

### 11.2 deferred-v1.x

| ID | 항목 | 비고 |
|---|---|---|
| CS-07 | 환자 동의 철회 처리 (patientConsentEvidenceRef·right to erasure) | v1.x |
| CS-11 | CRM → Core 자동 promote (예: ReservationSubmission → 어드민 콘텐츠) | v1.x. `@provenanceCrmRecordId` 같은 공통 메타 cascade 필요 (CS1-18) |
| CS-12 | `appointment` entity 지원 | v1.x |
| CS-13 | `korean-emr` provider 어댑터 | v1.x |

### 11.3 resolved-in-v1.0

| ID | 항목 | 해소 |
|---|---|---|
| ~~CS-01~~ | RRN deny 정책 | v0.2 — build fail + asset-ingestion checksum 재사용 |

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | **v0.2** | **codex 자동 비평 1차 반영 (21 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType + 매트릭스 4행 (CS1-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 4종 AuditAction (CS1-01·16), (3) **DATA_MODEL C-08 v0.19 cascade** — CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion·DPA/consent 분리 (CS1-01·12), (4) **ReservationPage·CTAConfig 경계 정리** — 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent 운영 이벤트 (CS1-02·15 신규 CONTENT_STANDARDS cascade), (5) **provider 3종 한정** — salesforce·hubspot·generic-rest-api. korean-emr build fail·CS-13 deferred (CS1-03), (6) **webhook ProviderWebhookVerifier 인터페이스 + rawBody·nonce ledger** — CrmWebhookNonceLedger 신설 (CS1-04), (7) **raw PII 저장 금지 강제** — rawPiiStorageAllowed=false build fail. displayHints만. PII Redaction Validator (CS1-05), (8) **RRN deny v1.0 build fail** + asset-ingestion checksum 재사용. CS-01 resolved (CS1-06), (9) **field-level authority + CAS 충돌 해결** — FieldAuthority enum. clock skew·tie-breaker·appliedVersion (CS1-07), (10) **retry queue·outbox schema 풀 전개** § 13 (CS1-08), (11) **outbound-only command matrix** — inbound runSync/processInboundWebhook 차단 (CS1-09), (12) **credential rotation 상태 머신** — stable·rotating·committed·reverted + grace period (CS1-10), (13) **CrmRateLimitState 신설** — provider별 quota·resetAt·nextAllowedAt (CS1-11), (14) **DPA vs patient consent 분리** — dpaEvidenceRef·patientConsentEvidenceRef. v1.0은 record-level 미저장 (CS1-12, CS-07 deferred), (15) **§ 13 모든 10 tables 풀 schema 전개** (CS1-13), (16) **retention expiresAt 필드 추가** — syncLog·conflictRecord 등 (CS1-14), (17) **§ 6.1 매트릭스는 REVIEW_WORKFLOW SoT 행 인용만**으로 표시 (CS1-15), (18) **credential fingerprint non-reversible HMAC-SHA256** (CS1-16), (19) **미결정 3분류** — open/deferred-v1.x/resolved-in-v1.0 (CS1-17), (20) **CS-18 — @provenanceCrmRecordId v1.x 명시** (CS1-18), (21) **`?` 깨진 문자 정정** + read API/live read 권한 매트릭스 + acceptance test fixture (CS1-19·20·21)

---

## 13. 본 Feature 내부 데이터 구조 (admin DB 10 tables)

### 13.1 `CrmIntegration`

§ 3.2 shape. partial unique `(instanceId, provider, configHash) WHERE active=true`.

### 13.2 `CrmSyncLog` (envelope)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `manifestVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | optional |
| `startedAt` | Date | ✅ |
| `completedAt` | Date | optional |
| `envelopeState` | enum | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)` — purge worker.

### 13.3 `CrmSyncSourceAttempt` (per-integration per-entity 결과)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId` | UUID | ✅ |
| `entity` | SyncEntity | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error` | string | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`. `FK syncLogId ON DELETE RESTRICT`.

### 13.4 `CrmSyncRetryQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string | optional |

**worker SoT 쿼리**: search-visibility § 13.5 패턴 동일 (SKIP LOCKED·advisory lock·exhausted 전이).

### 13.5 `CrmRecord` (PII 마스킹된 cache·상태 추적)

v0.1 § 13.4 유지 + 다음 추가:
- `solutionVersion`·`crmVersion`·`lastAppliedConflictVersion` integer — CAS 입력 (CS1-07)
- **`displayHints` JSON ✅** — 마스킹된 표시값 (`{nameInitial, phoneLast4, emailDomain, cityName}`)
- raw PII 필드 절대 금지 (PII Redaction Validator 강제 — CS1-05)

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId)`.
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiRetentionExpiresAt)` — masking worker가 displayHints 만료된 row를 어떻게 처리할지는 운영 정책. v1.0은 raw PII 자체가 없으므로 masking 별도 작업 없음 — 정책 review (CS-16 신규 신설 영역)

### 13.6 `CrmRecordChangeLog`

v0.1 § 13.5 유지 + `changedFields`는 PII Redaction Validator 통과 (raw PII 금지). `expiresAt` ✅.

### 13.7 `CrmFieldMapping` (CS1-07 — authority 추가)

v0.1 § 13.6 + `authority: FieldAuthority enum` ✅.

### 13.8 `CrmConflictRecord` (CS1-07·14 — appliedVersion·expiresAt)

v0.1 § 13.7 + `appliedVersion: integer` optional (resolved 시 채움) + `expiresAt` ✅.

### 13.9 `CrmCredentialAuditLog`

v0.1 § 13.8 유지 + `priorCredentialFingerprint`·`newCredentialFingerprint` — HMAC-SHA256 non-reversible (CS1-16).

### 13.10 `CrmRateLimitState` (CS1-11 신설) + `CrmWebhookNonceLedger` (CS1-04 신설)

**`CrmRateLimitState`** (provider별 quota 추적):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional — 429 Retry-After 적용 시 |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**`CrmWebhookNonceLedger`** (replay 방지):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `providerEventId` | string | ✅ |
| `signatureDigest` | string | ✅ — payload signature SHA-256 |
| `receivedAt` | Date | ✅ |
| `rrnDetected` | boolean | ✅ |
| `rrnFingerprint` | string | optional — RRN 감지 시 HMAC non-reversible |
| `expiresAt` | Date | ✅ — retentionDays.webhookNonceLedger |

**Constraints**: `UNIQUE(integrationId, providerEventId)`.
**Index**: `(expiresAt)`.

### 13.11 `CrmSyncNotificationOutbox` (CS1-15)

search-visibility § 13.10·keyword-monitoring § 13.7 패턴 동일. `UNIQUE(sourceKind, sourceId, eventType)`.

---


 succeeded in 758ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.19
> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (23개)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
| `from` | `string` | ✅ | |
| `to` | `string` | ✅ | |

#### `SpecialClosure`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | |
| `reason` | `string` | optional | |
| `note` | `string` | optional | |

### CT-03. `CTAConfig` — 전환 채널 설정

**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 채널 식별자 |
| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
| `label` | `string` | ✅ | 버튼·링크 텍스트 |
| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
| `iconKey` | `string` | optional | 아이콘 식별자 |
| `style` | `enum {primary, secondary, minimal}` | optional | |
| `displayOrder` | `number` | optional | 정렬 |
| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |

> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.

---

## 4. 데이터 계약 풀명세 (M0 핵심)

### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)

**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
| `name` | `string` | ✅ | 정식 명칭 (1~100자) |
| `alternateName` | `string` | optional | 영문명 |
| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
| `slogan` | `string` | optional | 한 줄 가치 |
| `description` | `string` | ✅ | 80~300자 |
| `longDescription` | `Markdown` | optional | About 본문 |
| `foundingDate` | `Date` | optional | 설립일 |
| `founder` | `string` | optional | 대표자명 |
| `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
| `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
| `awards` | `Award[]` | optional | 인증·수상 |
| `memberOf` | `Affiliation[]` | optional | 학회·협회 |
| `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
| `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
| `logoUrl` | `URL` | ✅ | 로고 |
| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |

**하위 타입**:

#### `Address`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `streetAddress` | `string` | ✅ | 도로명 상세 |
| `addressLocality` | `string` | ✅ | 시·군 |
| `addressRegion` | `string` | ✅ | 도·광역시 |
| `postalCode` | `string` | ✅ | 우편번호 |
| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |

#### `GeoCoordinates`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `latitude` | `number` | ✅ | |
| `longitude` | `number` | ✅ | |

#### `Award`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 인증·수상명 |
| `awardedBy` | `string` | optional | 수여 기관 |
| `awardedDate` | `Date` | optional | |
| `verificationUrl` | `URL` | optional | 검증 가능 링크 |

#### `Affiliation`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 학회·협회명 |
| `role` | `string` | optional | |
| `url` | `URL` | optional | |
| `verified` | `boolean` | optional | |

#### `ResearchInstitute`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 연구 기관명 |
| `description` | `string` | optional | |
| `url` | `URL` | optional | |
| `relationship` | `enum {affiliate, partner, owned}` | optional | |

#### `SocialMediaLinks`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `naverBlog` | `URL` | optional | |
| `instagram` | `URL` | optional | |
| `youtube` | `URL` | optional | |
| `kakao` | `URL` | optional | |
| `facebook` | `URL` | optional | |
| `linkedin` | `URL` | optional | |
| `others` | `{label: string, url: URL}[]` | optional | |

#### `MediaItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `outlet` | `string` | ✅ | 매체명 |
| `title` | `string` | ✅ | |
| `date` | `Date` | optional | |
| `url` | `URL` | optional | |

#### `InternationalSupport`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `languages` | `string[]` | ✅ | ISO 639-1 |
| `interpreterAvailable` | `boolean` | optional | |
| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
| `targetCountries` | `string[]` | optional | |

### C-02. `DoctorProfile` — 의료진 권위·전문성

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `alternateName` | `string` | optional | 영문명 |
| `jobTitle` | `string` | ✅ | 직책 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
| `briefBio` | `string` | ✅ | 50~200자 |
| `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
| `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
| `photoUrl` | `URL` | optional | |
| `credentials` | `Credential[]` | ✅ | 최소 1개 |
| `education` | `Education[]` | optional | |
| `career` | `CareerItem[]` | optional | |
| `affiliations` | `Affiliation[]` | optional | |
| `publications` | `Publication[]` | optional | |
| `media` | `MediaItem[]` | optional | |
| `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
| `email` | `Email` | optional | |
| `socialMedia` | `SocialMediaLinks` | optional | |
| `consultationAvailable` | `boolean` | optional | 기본 `true` |
| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |

**하위 타입**:

#### `Credential`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {license, certification, board}` | ✅ | |
| `name` | `string` | ✅ | |
| `issuedBy` | `string` | optional | |
| `issuedDate` | `Date` | optional | |
| `expiryDate` | `Date` | optional | |

#### `Education`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `institution` | `string` | ✅ | |
| `degree` | `string` | ✅ | |
| `period` | `string` | optional | 예: `"2010-2016"` |

#### `CareerItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `organization` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `period` | `string` | optional | |

#### `Publication`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | |
| `venue` | `string` | optional | 학회지·매체 |
| `year` | `number` | optional | |
| `url` | `URL` | optional | |

### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~80자 |
| `alternateName` | `string` | optional | |
| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
| `category` | `string` | optional | 시술 카테고리 |
| `medicalSpecialty` | `Ref<C-14>` | optional | |
| `overview` | `Markdown` | ✅ | 개요 |
| `mechanism` | `Markdown` | ✅ | 원리 |
| `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
| `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
| `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
| `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
| `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
| `duration` | `string` | optional | 소요 시간 |
| `sessionCount` | `string` | optional | 권장 횟수 |
| `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
| `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
| `aftercare` | `Markdown` | optional | 시술 후 관리 |
| `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
| `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
| `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
| `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
| `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
| `heroImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |

**하위 타입**:

#### `ProcessStep`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | 단계 번호 |
| `name` | `string` | ✅ | 단계명 |
| `description` | `Markdown` | ✅ | |
| `durationMinutes` | `number` | optional | |

#### `TreatmentComponent` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
| `description` | `Markdown` | optional | |
| `included` | `boolean` | optional | 패키지 포함 여부 (default true) |

#### `VisitFlowStep` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | |
| `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
| `description` | `Markdown` | optional | |
| `durationMinutes` | `number` | optional | |
| `location` | `enum {clinic, remote, both}` | optional | |

#### `ProgramVariant`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
| `duration` | `string` | ✅ | 기간 |
| `sessionCount` | `string` | optional | 세션 수 |
| `targetSegment` | `string` | optional | 대상 분류 |
| `briefDescription` | `Markdown` | ✅ | |
| `includes` | `string[]` | optional | 포함 항목 |
| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |

#### `EvidenceNote` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
| `summary` | `string` | optional | 간략 요약 |
| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
| `publishedYear` | `number` | optional | |
| `verifiedBy` | `string` | optional | 검증자·기관 |

#### `SlotRiskOverride`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
| `level` | `RiskLevel` | ✅ | 격상 등급 |
| `reason` | `string` | ✅ | 감사 추적용 |

### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `headline` | `string` | ✅ | 1~120자 |
| `summary` | `string` | ✅ | 80~200자 |
| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
| `author` | `Ref<C-02>` | ✅ | 저자 |
| `coAuthors` | `Ref<C-02>[]` | optional | |
| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
| `datePublished` | `Date` | ✅ | 최초 발행일 |
| `dateModified` | `Date` | ✅ | 최종 수정일 |
| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
| `tags` | `string[]` | optional | |
| `readingTimeMinutes` | `number` | optional | 자동 계산 |
| `wordCount` | `number` | optional | 자동 계산 |
| `coverImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
| `relatedArticles` | `Ref<C-04>[]` | optional | |
| `relatedTreatments` | `Ref<C-03>[]` | optional | |
| `relatedConditions` | `Ref<C-11>[]` | optional | |
| `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |

**ArticleType ↔ 자동 추론 위험도**:

| ArticleType | 자동 위험도 | 운영자 오버라이드 |
|---|:---:|:---:|
| `notice` | Low | ✅ |
| `general-medical-info` | Medium | ✅ |
| `treatment-explainer` | Medium | ✅ |
| `condition-explainer` | Medium | ✅ |
| `effect-result-related` | High | ✅ (낮출 수 없음) |
| `review-case` | High | ✅ (낮출 수 없음) |
| `event-price` | High | ✅ (낮출 수 없음) |

**하위 타입**:

#### `EmbeddedMedia`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
| `url` | `URL` | ✅ | |
| `title` | `string` | optional | |
| `caption` | `string` | optional | |
| `durationSeconds` | `number` | optional | |
| `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |

**컴플라이언스 주의**:
- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
- `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
- `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).

### C-05. `RiskLevel` (enum) — 위험도 등급

```ts
type RiskLevel = "Low" | "Medium" | "High";
```

**v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).

> 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.

### C-06. `PageMeta` — 페이지별 메타 데이터

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | 10~70자, `<title>` |
| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
| `canonical` | `URL` | optional | 미지정 시 자동 생성 |
| `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
| `ogTitle` | `string` | optional | 미지정 시 `title` |
| `ogDescription` | `string` | optional | 미지정 시 `description` |
| `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
| `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
| `noIndex` | `boolean` | optional | 기본 `false` |

> 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.

### C-07. `BrandTokens` — 디자인 토큰 최종값

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
| `colors` | `ColorTokens` | ✅ | 색 토큰 |
| `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
| `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
| `radius` | `RadiusScale` | ✅ | |
| `shadow` | `ShadowScale` | ✅ | |
| `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
| `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |

> 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.

### C-08. `InstanceManifest` — 버전 고정 명세

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `instanceId` | `Slug` | ✅ | |
| `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
| `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
| `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
| `lastReleaseApprovedAt` | `Date` | optional | |

#### `RobotsOverride` (v0.11 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
| `allow` | `string[]` | optional | Allow 경로 목록 |
| `disallow` | `string[]` | optional | Disallow 경로 목록 |
| `note` | `string` | optional | 운영자 메모 |

#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
| `clsOverride` | `number` | optional | CLS budget 강화 override |
| `tbtMsOverride` | `number` | optional | |
| `bundleSizeKbOverride` | `number` | optional | |
| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |

#### `NotificationChannelsConfig` (v0.13 확장)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `email` | `{enabled: boolean, transport: "smtp" \| "ses" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | 이메일 활성화·트랜스포트·발신자·시간당 발송 한도. `secretRef`는 API 키 또는 SMTP 자격 (예: `secretRef://EMAIL_TRANSPORT_KEY`) |
| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |

> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).

#### `VersionSpec`
SemVer 형식 (`"1.4.2"`).

#### `IANATimezone` (v0.13 신규)

IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.

#### `AnalyticsConfig` (v0.14 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
| `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |

> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).

#### `SearchVisibilityConfig` (v0.16 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.

#### `KeywordMonitoringConfig` (v0.17 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).

#### `AssetIngestionConfig` (v0.18 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
| `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
| `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |

#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)

SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
| `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
| `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
| `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
| `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
| `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |

> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).

#### `CrmSyncConfig` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |

#### `CrmIntegrationEntry` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | string | ✅ | integration 식별자 (instance scope unique) |
| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
| `apiUrl` | URL | ✅ | provider endpoint |
| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
| `legalApprovedBy` | string | ✅ | |
| `legalApprovedAt` | Date | ✅ | |
| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3).

#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)

법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |

### C-09. `FeatureModuleConfig` — Feature Module 설정

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `moduleName` | `string` | ✅ | 모듈 식별자 |
| `enabled` | `boolean` | ✅ | |
| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |

### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록

**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)

#### 어드민 DB 원본 (풀데이터)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `instanceId` | `Slug` | ✅ | |
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
| `articleType` | `string` | optional | (Article인 경우) |
| `inlineRiskFlags` | `string[]` | optional | |
| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
| `peerReviewedAt` | `Date` | ✅ | |
| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
| `physicianApprovedAt` | `Date` | optional | |
| `clientApprover` | `string` | optional | |
| `clientApprovedAt` | `Date` | optional | |
| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
| `priorReviewSubmissionId` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
| `attachments` | `Attachment[]` | optional | 증빙 파일 |
| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |

#### `MediaThresholdAssessment` (v0.14 +)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
| `windowEnd` | `Date` | ✅ | |
| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |

> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.

#### `WarningAcknowledgement` (v0.8 +)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
| `operatorId` | `string` | ✅ | operator 사용자 ID |
| `timestamp` | `Date` | ✅ | |
| `note` | `string` | optional | 메모 |

#### `StaleFlags`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
| `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
| `triggeredAt` | `Date` | optional | |

#### Git 사본 (경량 빌드 참조)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
| `articleType` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | |
| `publishedAt` | `Date` | ✅ | schema datePublished |
| `lastModifiedAt` | `Date` | ✅ | schema dateModified |

### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)

**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).

**참조 페이지 타입**: P-013
**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
| `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
| `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
| `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
| `effectiveDate` | `Date` | ✅ | 시행일 |
| `lastRevisedDate` | `Date` | optional | 최종 개정일 |
| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
| `contactEmail` | `Email` | optional | 정책 문의 채널 |

**하위 타입**:

#### `LegalDocumentRevision`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | 개정일 |
| `summary` | `string` | ✅ | 개정 내용 요약 |
| `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |

**컴플라이언스 룰**:
- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.

### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)

**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
| `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
| `branchDescription` | `string` | optional | 50~200자 |
| `address` | `Address` | ✅ | 지점 주소 |
| `geo` | `GeoCoordinates` | optional | |
| `telephone` | `Phone` | ✅ | 지점 직통 |
| `fax` | `Phone` | optional | |
| `email` | `Email` | optional | 지점 이메일 |
| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
| `images` | `URL[]` | optional | |
| `transportInfo` | `Markdown` | optional | |
| `parkingInfo` | `Markdown` | optional | |
| `openingDate` | `Date` | optional | 지점 개원일 |
| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
| `branchCode` | `string` | optional | |
| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |

> v0.4 → v0.6 강조 채널 표기 변천:
> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조

> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.

### C-22. `ArticleCategory` — Article Pillar 분류

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `description` | `string` | optional | 80~200자 |
| `pillar` | `string` | optional | 상위 Pillar |
| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
| `coverImageUrl` | `URL` | optional | |
| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
| `displayOrder` | `number` | optional | |
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ`
필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.

### C-13. `ReviewPolicy`
필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**

### C-14. `MedicalSpecialty`
필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.

### C-15. `SchemaInput`
JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.

### C-17. `PricingPage`
필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**

### C-18. `FacilitiesPage`
필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.

### C-19. `NewsItem`
필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**

### C-20. `ReservationPage`
필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.

### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)

**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
| `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
| `displayName` | `string` | ✅ | 어드민 UI 표시명 |
| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
| `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
| `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
| `lastLoginAt` | `Date` | optional | |
| `createdAt` | `Date` | ✅ | |

#### `NotificationPreferences` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
| `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |

#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
| `firstObservedAt` | `Date` | ✅ | |
| `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
| `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
| `unsuppressedAt` | `Date` | optional | |

---

## 6. 관계 다이어그램

```
ClinicProfile (C-01)
   ├─ trustMetrics → TrustMetric[] (CT-01)
   ├─ primaryCtas → CTAConfig[] (CT-03)
   ├─ medicalSpecialty → MedicalSpecialty (C-14)
   ├─ affiliatedInstitutes → ResearchInstitute
   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+

LocationProfile (C-21) — 위치·시간·연락 SoT
   ├─ businessHours → BusinessHours (CT-02)
   ├─ reservationChannels → CTAConfig[] (CT-03)
   ├─ parentClinic → ClinicProfile (C-01)
   ├─ representativeDoctors → DoctorProfile[]
   ├─ doctorsAtLocation → DoctorProfile[]
   └─ availableTreatments → TreatmentPage[]

DoctorProfile (C-02)
   ├─ primaryLocation → LocationProfile (C-21)
   ├─ additionalLocations → LocationProfile[]
   └─ trustMetrics → TrustMetric[] (CT-01)

TreatmentPage (C-03)
   ├─ cta → CTAConfig (CT-03)
   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
   ├─ relatedDoctors → DoctorProfile[]
   ├─ relatedConditions → MedicalConditionPage[]
   └─ pageRiskLevel → RiskLevel (직접 enum)

Article (C-04)
   ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
   ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
   ├─ category → ArticleCategory (C-22)
   ├─ contentSource / externalUrl (v0.4)
   ├─ embeddedMedia → EmbeddedMedia[]
   └─ pageRiskLevel → RiskLevel

ComplianceRecord (C-10)
   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
   └─ pageRiskLevel → RiskLevel
```

---

## 7. 변경 정책

(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
| DM-07 | cross-reference 빌드 검증 | |
| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
| DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 774ms:
# Admin — 검수 워크플로

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 / `docs/admin/ARCHITECTURE.md` (v0.7)
> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 사용자별 권한·승인자 식별 정보 노출 주의.
> **연관 문서**:
> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
> - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
> - 어드민 화면 구성 → `docs/admin/ARCHITECTURE.md`

---

## 0. 한 페이지 요약

- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 상태 머신 enum 변경 | **MAJOR** | 진행 중 콘텐츠 영향 |
| 큐 진입 트리거 변경 | **MAJOR** | 미검수 콘텐츠 발생 가능 |
| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
| 화면·UX 변경 | MINOR | |
| 알림 채널 추가 | MINOR | |
| 감사 로그 필드 추가 | PATCH (append-only) | |

### 1.2 SoT 원칙

- 본 문서 = **검수 워크플로 운영 SoT** — 상태 머신·큐·승인 흐름·권한
- ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)

### 1.3 본 문서가 다루지 않는 영역

- 데이터 계약 자체 — `DATA_MODEL.md`
- 룰 카탈로그·자동 추론 알고리즘 — `RISK_LEVELS.md`
- UI 시각 디자인 — `DESIGN_TOKENS.md`·`admin/ARCHITECTURE.md`

---

## 2. 워크플로 상태 머신

### 2.1 상태 enum

```ts
type ContentWorkflowState =
  | "draft"           // 작성 중 — 자동 검수 미실행
  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
  | "approved"        // 필요한 모든 역할의 승인 완료
  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
  | "published"       // 발행됨 (Git 사본 생성)
  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
  | "rejected"        // 검수자가 명시적 거부
  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
```

### 2.2 전이 다이어그램

```
                            ┌──────────────────────┐
                            │       draft          │
                            └──────────┬───────────┘
                                       │ submit-for-review (작성자) 또는 자동 트리거 (§ 3.2)
                                       ▼
                            ┌──────────────────────┐
              ┌────────────►│   review-queued      │
              │             └──────────┬───────────┘
              │                        │ assign (검수자 픽업)
              │                        ▼
              │             ┌──────────────────────┐
              │             │     in-review        │
              │             └──┬──────┬────────────┘
              │                │      │
              │     reject     │      │ approve (해당 역할)
              │   (검수자)     │      ▼
              │                │   ┌─────────────────────────────┐
              │                │   │ AND 게이트 평가 (§ 4.5)     │
              │                │   │  모든 ApproverRole 충족?    │
              │                │   └────┬──────────┬──────────────┘
              │                │       Y           N (다음 역할 검수)
              │                │       ▼           │
              │                │  ┌──────────┐     │
              │                │  │ approved │     ┘
              │                │  └────┬─────┘
              │                │       │ automatedDecision != block 재확인
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │ publishable  │
              │                │  └────┬─────────┘
              │                │       │ publish (운영자 발행 액션)
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │  published   │
              │                │  └────┬─────────┘
              │                │       │ staleFlags 발생 (§ 6)
              │                │       ▼
              │                │  ┌──────────┐
              │                │  │  stale   │
              │                │  └────┬─────┘
              │                │       │ 재검수 큐 진입
              │                └────►──┘
              │                ▼
              │       ┌──────────────┐
              │       │   rejected   │
              │       └──────┬───────┘
              │              │ 작성자가 본문 정정 후 재제출
              └──────────────┘

draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
```

### 2.3 전이 트리거

| 전이 | 트리거 | 권한 |
|---|---|---|
| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |

---

## 3. 검수 큐 (Review Queues)

### 3.1 큐 종류 3종

| 큐 | 진입 조건 | 우선순위 | 처리자 |
|---|---|---|---|
| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |

#### 3.1.1 warning 큐 이탈 조건·기록

- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)

#### 3.1.2 content-gate와 warning 동시 발생 처리

ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)

### 3.2 자동 큐 진입 트리거

다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:

- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
- 자동 위험도 추론 결과 — High 등급
- StaleFlags 발생:
  - 의료법 개정 (`medical-law-revision-<id>`)
  - 콘텐츠 본문 RiskRule 매칭 텍스트 변경
  - 가격·ReviewPolicy·전후사진 미디어 변경
  - 의료진 자격·인증 변경
  - 인용 외부 링크 만료
- LegalDocument 발행 의무(C-10 LegalDocument required)
- 운영자 수동 트리거

### 3.3 우선순위·SLA

| 처리 영역 | SLA 목표 | 알림 정책 SoT |
|---|---|---|
| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |

SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).

> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.

---

## 4. multi-role AND 게이트

### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)

콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:

```
riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
            = ComplianceRecord.pageRiskLevel 출력 결과

finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
           ∪ (riskLevel ∈ {Medium, High} ? medical : ∅)               // 등급 기본 요구
           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
```

**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):

`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.

> **개념 정리**:
> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.

### 4.2 검수자별 검수 화면

| 역할 | 검수 화면 책임 |
|---|---|
| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
| **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |

### 4.3 승인 액션

각 검수자는 자신의 역할에 한해 다음 액션 수행:

| 액션 | 결과 |
|---|---|
| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |

### 4.4 자동 차단

- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)

---

## 5. ComplianceRecord 슬롯 채움 흐름

### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)

approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:

| ApproverRole | 갱신 필드 |
|---|---|
| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |

### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)

DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.

**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
- 어드민 내부 저장소에만 존재. Git 사본·정적 빌드에 영향 없음

**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
- Git 사본·정적 빌드에 반영

### 5.3 갱신 시점

| 시점 | 동작 | 대상 |
|---|---|---|
| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |

### 5.4 ComplianceRecord 불변성·버전 모델

- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
- staleFlags 외 필드 수정 시도 — 빌드/API fail

---

## 6. StaleFlags 처리

### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)

| 트리거 이벤트 | 설정되는 flag |
|---|---|
| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
| 콘텐츠 본문 RiskRule 매칭 텍스트 영역 변경 | `medical=true` |
| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
| 의료진 자격·인증 변경 (DoctorProfile) | `medical=true` |
| 인용 외부 링크 만료 (404·5xx) | `medical=true` |
| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
| ReviewPolicy 변경 | `legal=true` |
| 전후사진 미디어 첨부·교체 | `legal=true` |
| 본문 일반 변경 | `operator=true` |
| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |

각 이벤트는 `triggeredBy`·`triggeredAt` 동시 기록.

### 6.2 stale 큐 진입·처리

- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)

### 6.3 staleFlags 우선순위

여러 flag가 동시 발생 시 우선순위:

```
legal > medical > client > operator
```

- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
- 또는 병렬 처리 허용 (기본값)

---

## 7. 발행 결정

### 7.1 publishable 산정 알고리즘

콘텐츠가 `publishable` 상태가 되기 위한 조건:

```
publishable = (1) automatedDecision !== "block"
           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
           ∧ (4) staleFlags 모두 false 또는 미설정
           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
```

위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)

### 7.2 publish 액션

- 권한: `super-admin`·`operator` (역할별 운영 정책)
- 입력: 콘텐츠 @id
- 검증: § 7.1 재실행 (auth time-of-use)
- 결과:
  - `published` 상태 전이
  - ComplianceRecord `publishedAt`·`publishedBy` 기록
  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
  - 빌드 트리거 (정적 사이트 재빌드)

### 7.3 unpublish 액션

- 권한: `super-admin`만
- 결과:
  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
  - Git 사본 제거
  - 재발행 시 워크플로 재실행

---

## 8. 사전심의 (priorReview) 흐름

### 8.1 priorReviewRequired 판정

**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:

1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)

**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
- 매체 분류 (시행령 제24조제1항·제2항)
- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
- 의료광고 정의(제56조제1항) 결합 판정

판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
- `ComplianceRecord.priorReviewRequired=true|false`
- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
- `mediaThresholdOperationalInput` 슬롯 (rolling operational 입력 자료 — 감사 보존)

#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거

`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).

```ts
async function enqueueMediaThresholdReassessment(input: {
  instanceId: Slug;
  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
  newState: "threshold-reached" | "threshold-released";
  assessmentBasisDate: ISODateString;
  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
}): Promise<{ enqueuedCount: number; reassessmentBatchId: string }>
```

**동작**:
1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
8. `analytics-reporting`이 자동 발송하는 `media-threshold-*` 이벤트는 운영 alert 성격 — 법적 판정 자체는 본 워크플로 책임

**priorReviewRequired 산정 기준 분리** (AR2-08):
- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록

### 8.2 사전심의 대상인 경우

```
1. legal 검수자 priorReviewRequired=true 기록
2. 운영자가 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출
3. 제출 ID 기록 — priorReviewSubmissionId
4. 심의 결과 도착 (외부)
5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
7. publishable 조건 § 7.1 (3) 충족
```

### 8.3 priorReview 상태 추적 화면

어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

### 9.2 알림 페이로드

본 절은 두 단계 타입을 정의:
- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
- **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)

```ts
type NotificationEvent = {
  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
  eventType: NotificationEventType;                    // § 9.1 enum
  contentRef: string;                                  // 대상 콘텐츠 @id
  contentTitle: string;
  recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
  createdAt: ISODateString;
};

type NotificationRecipient = {
  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
  recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
};

type NotificationPayload = {
  payloadId: string;                                   // UUID — fan-out 단위 ID
  eventId: string;                                     // 상위 NotificationEvent 참조
  eventType: NotificationEventType;
  contentRef: string;
  contentTitle: string;
  recipientId: string;                                 // 단건 수신자
  recipientRole: ApproverRole | "author" | "operations";
  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
  criticality: "critical" | "high" | "normal";
  metadata: object;
  createdAt: ISODateString;
};
```

#### 9.2.1 idempotency 계약

- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)

### 9.3 알림 채널·운영

- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
- Slack은 **2가지 동작 모드 분기**:
  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2

---

## 10. 감사 로그 (Audit Log)

### 10.1 기록 대상

- 모든 워크플로 상태 전이
- 모든 검수자 액션 (approve·reject·request-changes·delegate)
- ComplianceRecord 슬롯 갱신
- staleFlags 발생·해제
- publish·unpublish
- 권한 변경·로그인·로그아웃
- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적

### 10.2 audit log 페이로드

```ts
type AuditLogEntry = {
  id: string;                 // UUID
  timestamp: ISODateString;
  actorId: string;             // 사용자 ID 또는 "system" (자동 트리거)
  actorRole: AdminUserRole;
  action: AuditAction;          // § 10.2.1 enum
  contentRef: string;
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated";                 // 자격증명 rotation
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

---

## 11. 권한·역할

### 11.1 AdminUserRole enum

```ts
type AdminUserRole =
  | "super-admin"        // 모든 권한 (Glitzy 운영팀)
  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
  | "physician-reviewer"  // medical 역할 검수만
  | "legal-reviewer"      // legal 역할 검수만
  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
```

### 11.2 권한 매트릭스

| 액션 | super-admin | operator | physician | legal | client |
|---|:---:|:---:|:---:|:---:|:---:|
| 콘텐츠 작성·편집 | ✅ | ✅ | | | |
| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
| operator approve | ✅ | ✅ | | | |
| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
| publish | ✅ | ✅ | | | |
| unpublish | ✅ | | | | |
| 권한 관리 | ✅ | | | | |
| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |

> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
> - medical: DoctorProfile (C-02) 등록 + `credentials[]` 항목으로 의료진 자격 인증 검증
> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
> - client: 클라이언트 측 위임 권한 (RL-05)
>
> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
>
> **자격 검증 알고리즘 구현 영역**: medical 도메인 자격 매칭(한의 콘텐츠 → 한의사 등) 자동 판정은 RISK_LEVELS RL-03 미결정 영역. v1.0에서는 어드민 운영자가 자격 매칭 수동 검증·기록.

### 11.3 역할 위임

- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
- 다른 역할로의 위임 금지 — 검수 자격 분리 원칙

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AW-01 | 검수자 라운드로빈 알고리즘 (assign 자동화) — FIFO vs 워크로드 기반 | M2+ |
| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
| AW-03 | 외부 법무법인 식별자 데이터 모델 (RISK_LEVELS RL-04와 동일) | DATA_MODEL 후속 |
| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |

---

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |


codex
대상 v0.2는 1차 지적 상당수를 문서 표면에는 반영했지만, 몇몇은 SoT 실제 반영 여부와 운영 가능성에서 다시 갈라지는 지점이 보입니다. 이제 asset/search/keyword/medical 쪽 패턴을 확인해 재발·신규 결함을 분리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"AssetPromotionRecord|state:|RRN|checksum|§ 9\\.1|promotion|promoted|reverted|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|expiresAt|@provenance\" docs/features/asset-ingestion.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"outbox|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|advisory|expiresAt|sourceEventId|retry\" docs/features/search-visibility.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"outbox|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|advisory|expiresAt|sourceEventId|retry\" docs/features/keyword-monitoring.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "RRN|주민|개인정보|PII|consent|동의|audit|live" docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
 succeeded in 650ms:
7:> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
15:- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
20:- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·MonitoringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSnapshot·AnomalyNotificationOutbox
48:- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)
50:### 1.2.1 공통 retry taxonomy (SV2-15 신설)
52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:
59:| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
67:| AnomalyNotificationOutbox | **상수 5** — 운영 단순성 |
226:| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
235:- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`
338:- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
426:## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)
432:### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)
444:### 7.3 발송 흐름 — outbox SQL
446:v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).
458:- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
461:- `createdAt`: detectedAt 또는 outbox enqueue 시각
463:DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.
465:### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)
467:- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
475:- **sourceEventId 산정** (SV4-05 — 정책 버전 변경에도 재발송 금지):
476:  - `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)`
478:  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유지 (notifications idempotent receipt가 중복 발송 차단)
479:  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
484:- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)
587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
630:UPDATE search_visibility_collection_retry_queue
633:  SELECT id FROM search_visibility_collection_retry_queue
637:  FOR UPDATE SKIP LOCKED
642:--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
718:### 13.10 `AnomalyNotificationOutbox` (SV2-13 enqueue 조건 정합 — eventType 기반)
722:- **sourceEventId** 산식 (SV4-05): `hash("search-visibility:" + anomalyRecordId + eventType)` — policyVersion 미포함 (정책 변경 시 재발송 금지)
723:- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

 succeeded in 649ms:
348:- 환자 동의서·증빙 첨부 권장 (`ComplianceRecord.attachments`)
375:**축 2. 환자 개인정보·초상권** (필수):
376:- 환자 본인 동의서 첨부 (`attachments[]`)
377:- 개인정보 보호법·초상권 적법성
379:> ⚠️ 환자 동의서는 개인정보·초상권 측면의 필요조건일 뿐 의료광고법 적법성을 보장하지 않음. 동의서 보유 = 발행 가능 아님.
608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |

 succeeded in 653ms:
7:> **목적**: 사용자 지정 N개 키워드의 검색 순위·노출·CTR·rank bucket transition 모니터링. analytics-reporting의 queryNormalizedMetrics 데이터 기반. 이상 변동 시 outbox 알림.
20:- **핵심 책임**: (a) 사용자 지정 키워드 N개 모니터링, (b) analytics-derived 데이터 기반 순위·노출·CTR 추적, (c) **v1.0에서 serp-crawler 미지원** — `enabled=true` build fail (F-13. v1.x에서 search-visibility SerpCrawlerArtifact 공용 또는 별도 테이블 추가 결정 후 활성), (d) rank bucket transition state·이상 변동 감지, (e) **KeywordAnomalyNotificationOutbox** 패턴, (f) 대시보드 read API
26:- **DB 인벤토리**: **8 tables** — KeywordTrackingTarget·KeywordSignalSnapshot·MonitoringLog·MonitoringSourceAttempt·KeywordMonitoringCollectionRetryQueue·KeywordAnomalyRecord·KeywordRankBucketState·KeywordAnomalyNotificationOutbox
73:### 1.2.1 공통 retry taxonomy
75:search-visibility § 1.2.1 동일 — 2종 retry 구조:
80:| KeywordAnomalyNotificationOutbox | **상수 5** |
196:| 실행 command | `detectAnomalies(input)` | 이상 변동 감지 + outbox enqueue |
268:    notify: boolean;                                   // KMF3-04 — outbox enqueue 대상 여부
279:- `notify=false`: ctr-up direction (anomalyRecord 저장만, outbox 미enqueue) → `notificationSuppressionReason="not-enqueue-eligible"`
280:- `notify=false`: mode="monitor-only" (모든 anomaly outbox 미enqueue) → `notificationSuppressionReason="monitor-only-mode"`
282:- `notify=true`: outbox enqueue 대상. 발송 완료 시 `notificationEventId` 채움
373:## 6. 알림 (outbox 패턴)
377:| eventType | anomalySeverity | notificationCriticality (REVIEW_WORKFLOW § 9.1.1) | outbox enqueue |
388:| `keyword-monitoring-monitoring-failed` | (anomaly 아님 — operational) | high | ✅ (별도 outbox sourceKind="monitoring-log") |
392:### 6.2 발송 흐름 — KeywordAnomalyNotificationOutbox 패턴
395:- **outbox sourceKind/sourceId 일반화** (F-6 + KM2-03 정정):
398:  - sourceKind="rank-bucket-transition" + sourceId=**transitionEventId** (KM2-03 — 각 transition별 고유 ID. KeywordRankBucketState.lastTransitionEventId와 동일 식별자. AnomalyRecord 생성과 별개로 outbox row 생성 가능)
399:- UNIQUE constraint: `UNIQUE(sourceKind, sourceId, eventType)` (단일 source·eventType별 1 outbox 1건. rank-bucket-transition은 transition별 별도 sourceId라 동일 target의 후속 transition도 정상 enqueue)
406:**원자성** (KMF3-02 — state + outbox 단일 transaction):
408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
409:   - acquire 실패 시 → **idempotent no-op + early exit** (다른 worker가 이미 처리 중). retryable error 아님 (KMF4-04)
416:   b. KeywordAnomalyNotificationOutbox INSERT (sourceKind="rank-bucket-transition", sourceId=transitionEventId)
417:      UNIQUE(sourceKind, sourceId, eventType) 위반 시 → 다른 worker 처리 → abort, idempotent no-op
419:6. advisory lock release
421:- 동시 detector 또는 forceRefresh — advisory lock + compare-and-set + UNIQUE 3중 보호로 중복 enqueue 차단
433:- `sourceEventId = hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` — policy 버전 미포함 (search-visibility 동일 정책)
475:- outbox dispatch-failed-permanent 발생
572:- **rank-bucket transition 원자성 invariant**: KeywordRankBucketState.lastTransitionEventId 갱신과 KeywordAnomalyNotificationOutbox(sourceKind="rank-bucket-transition") insert가 단일 transaction 외부에서 발생한 sequence 감지 (예: state만 갱신·outbox row 부재 또는 그 반대) → reconcile job 트리거
573:- **outbox dispatch-failed-permanent 누적** > 임계 → 운영팀 알림
576:  - `KeywordAnomalyNotificationOutbox.claimedAt > 5분` (§ 6.2 outbox SQL 정합) → 재claim
627:1. advisory lock acquire (hash(instanceId, keyword, country, device, searchEngine))
635:4. advisory lock release
659:| `ingestedAt`·`expiresAt` | Date | ✅ |
662:**Index**: `(instanceId, signal, date)`, `(keywordTargetId, signal, date)`, `(expiresAt)`.
674:worker SoT 쿼리·SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant — search-visibility § 13.5 SQL 동일.
684:### 13.8 `KeywordAnomalyNotificationOutbox` (F-6 일반화)
692:| `sourceEventId` | string | ✅ — `hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` |
693:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
700:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)` (F-6 — sourceKind·sourceId·eventType별 1 outbox row).
714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |

 succeeded in 675ms:
8:> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4
21:- **DB 인벤토리**: **11 tables** — IngestionSource·IngestionLog·IngestionSourceAttempt·IngestionRetryQueue·IngestedAsset·ExtractedContent·**AssetPiiFinding(신설)**·AssetTag·AssetReviewRecord·AssetPromotionRecord·AssetIngestionNotificationOutbox + Blob storage 1종
55:| AssetIngestionNotificationOutbox | 상수 5 |
83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
338:**AssetPromotionRecord status 머신** (AI3-01 정정):
353:1. promote 게이트 사전 검증 (§ 7.2 — 미충족 시 runtime fail, AssetPromotionRecord 미생성)
355:   a. AssetPromotionRecord INSERT (status="checking", checkStartedAt=now())
357:   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
358:   d. 실패 → AssetPromotionRecord UPDATE status="failed", lastError + 외부 sink alert + early exit
360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
363:      - 게이트 재검증 실패 → transaction abort (Core row 미생성). **3.a의 `commitStartedAt` update도 abort와 함께 rollback** (AI5-02 정합). **별도 짧은 transaction에서 AssetPromotionRecord UPDATE status="failed", lastError="gate-race-failure", failedAt=now() WHERE status='pending-commit'** (WHERE 조건으로 race 방지. commitStartedAt은 채우지 않음 — abort로 rollback된 상태) — AI4-03
364:   d. Core 데이터 계약 row INSERT (status="draft", `@provenanceAssetId`=assetId — AI4-11)
367:   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
368:   h. AssetPromotionRecord UPDATE status="committed", commitCompletedAt=now(), targetContentRef=Core row @id
371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
400:  - **checksum 검증 (정확 공식)**:
412:- `mask`: RRN 전용 마스킹 `######-*******`. 일반 텍스트는 부분 마스킹
427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
435:| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
439:search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).
449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
471:| promote율 | promoted / approved | baseline |
473:| **RRN candidate count** (AI3-11) | regex 후보 수 / 전체 ingested asset 수 | baseline (운영 30일 누적) |
474:| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
545:- **AssetPromotionRecord stale** (AI4-04 join key 명시):
549:      - targetContentRef 존재 시 → `WHERE @provenanceAssetId=assetId AND @id=targetContentRef`
550:      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
552:    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
557:- **AssetIngestionNotificationOutbox dispatch-failed-permanent** 누적 임계 초과 → 운영팀 alert
598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
620:**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.
646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
707:### 16.10 `AssetPromotionRecord` (AI4-01 — 풀 스키마 전개)
719:| `promotedBy` | string | ✅ | AdminUser @id |
731:### 16.11 `AssetIngestionNotificationOutbox` (F-18 구체화 — keyword-monitoring § 13.8 패턴 동일)
748:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.

codex
관련 문서 패턴을 대조해보니 outbox/retry 쪽은 “패턴 동일”만으로는 부족하다는 이전 지적이 다른 안정판 문서에서는 SQL·락·원자성까지 내려가 해결된 상태입니다. crm-sync v0.2는 그 수준까지 못 내려간 부분이 있어 주요 지적 후보로 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ProviderWebhookVerifier|nonce|timestampTolerance|outbound-only|liveReadCrmDetail|rawPiiStorageAllowed|PII Redaction|credential rotation|rotationGracePeriod|FieldAuthority|last-write|manual|DB 인벤토리|10 tables|CrmIntegration|CrmRecord|CrmWebhookNonceLedger|CrmSyncNotificationOutbox|AuditAction|crm-live-read|RRN|false" docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "crm-sync|crm-integration|crm-credential|crm-live|NotificationEventType|crm-sync-batch|crm-sync-conflict|crm-sync-credential" docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "crmSyncConfig|CrmSyncConfig|CrmIntegrationEntry|crmSyncPolicyVersion|patientConsent|dpaEvidence|korean-emr|salesforce|hubspot|generic" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "type NotificationEventType|crm-sync-batch-failed|crm-sync-conflict-detected|crm-sync-credential-expired|crm-sync-credential-expiring" docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 652ms:
464:### 9.1 NotificationEventType enum (canonical SoT)
467:type NotificationEventType =
503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
504:  | "crm-sync-batch-failed"                   // sync cycle 실패
505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
569:  eventType: NotificationEventType;                    // § 9.1 enum
586:  eventType: NotificationEventType;
669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
670:  | "crm-integration-registered"              // CRM 연동 등록
671:  | "crm-integration-unregistered"            // soft delete
672:  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
673:  | "crm-credential-rotated";                 // 자격증명 rotation

 succeeded in 662ms:
4:> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
596:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
694:#### `CrmSyncConfig` (v0.19 신규)
698:| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
700:#### `CrmIntegrationEntry` (v0.19 신규)
705:| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
713:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
1078:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |

 succeeded in 675ms:
467:type NotificationEventType =
504:  | "crm-sync-batch-failed"                   // sync cycle 실패
505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |

 succeeded in 717ms:
9:> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·4종 AuditAction)
11:> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1
18:- **핵심 책임**: (a) 외부 CRM 양방향 sync(예약 신청·문의·전환 이벤트·고객 컨택트), (b) field-level mapping + authority, (c) webhook(실시간) + polling(배치), (d) 충돌 해결 (field-level CAS), (e) **raw PII 저장 금지** — 솔루션 DB에는 displayHints/derived hints만, (f) DPA·credential rotation·만료 알림
21:- **운영 모드 2종**: `bi-directional`(양방향·기본)·`outbound-only`(솔루션→CRM 일방향)
24:- **RRN**: 솔루션 측 deny 강제 (v1.0 — CS1-06 resolved). asset-ingestion § 9.1 checksum 알고리즘 재사용
25:- **DB 인벤토리**: **10 tables** (모든 schema § 13 전개)
54:- RRN checksum SoT는 `features/asset-ingestion.md` § 9.1 (재사용)
55:- 본 문서 = sync 파이프라인·field mapping·충돌 해결·PII·credential rotation·audit SoT + 내부 데이터 구조 SoT (§ 13)
62:| CrmSyncNotificationOutbox | 상수 5 |
69:- 의료 진료 기록 보관 — CRM·EMR 측 책임 (RRN 등 솔루션 측 통과 금지)
82:activation: { scope: "instance", default: false }
91:| REVIEW_WORKFLOW § 10.2.1 | 4종 AuditAction cascade 완료 |
94:| asset-ingestion § 9.1 | RRN checksum 알고리즘 재사용 |
120:      mode: "bi-directional"                            # bi-directional | outbound-only
124:      entities:                                          # CS1-09 — outbound-only 모드는 conflictResolution="outbound-only-no-conflict"만 허용
125:        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
128:        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
133:        timestampToleranceSeconds: 300
134:        nonceLedgerRetentionMinutes: 60                 # nonce/eventId ledger 보존
142:        rotationGracePeriodMinutes: 30                  # 이전 credential 병행 허용 시간
150:        rawPiiStorageAllowed: false                     # v1.0 강제 false (raw PII 저장 금지)
158:        webhookNonceLedger: 1                           # 1일 (timestampToleranceSeconds + 여유)
170:| 실행 command | `runSync(input)` | sync cycle | operator·super-admin | outbound-only 모드는 direction="outbound"만 허용 |
171:| 실행 command | `processInboundWebhook` | webhook 수신 | system (HTTP endpoint) | outbound-only 모드는 endpoint 비활성 (HTTP 404) |
173:| 실행 command | `resolveConflict(conflictId, resolution)` | 충돌 해결 | operator·super-admin. legal 검수자 read-only | outbound-only 모드는 충돌 없음 — 호출 불가 |
174:| 실행 command | `liveReadCrmDetail(crmRecordId)` | CRM live PII detail 조회 (no-cache·audit 기록) | **operator·super-admin·legal-reviewer** (CS1-20). audit `crm-live-read` 자동 기록 (v1.x audit cascade — CS-14 신규) |
175:| read API | `queryCrmRecords` | 어드민 — **displayHints만** | operator·super-admin·legal-reviewer (raw PII 미반환) |
183:| AuditAction | contentRef | metadata | 권한 |
216:v0.1 § 3.3 유지 + outbound-only mode 시 `direction="outbound"` 강제 (CS1-09).
229:- **ProviderWebhookVerifier 인터페이스**: provider별 어댑터가 (rawBody, headers, fullUrl, method, timestamp, providerEventId) → 검증 결과
230:- **nonce ledger** (CS1-04): `CrmWebhookNonceLedger` 테이블 — `(integrationId, providerEventId)` UNIQUE. 동일 eventId 재발신은 deduped 처리 (HTTP 200 + "already-processed")
242:### 4.2 inbound (CRM → 솔루션) + ProviderWebhookVerifier (CS1-04)
246:2. rawBody 그대로 ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) 호출
249:3. timestamp tolerance 검증 — `headers.timestamp ∈ now ± timestampToleranceSeconds` 아니면 rejected-replay
250:4. **CrmWebhookNonceLedger insert** — `(integrationId, providerEventId)` UNIQUE
252:5. **RRN 검사 (CS1-06)**: rawBody 전체에 asset-ingestion § 9.1 RRN checksum 알고리즘 적용
253:   - RRN 검출 시 → **payload 폐기** (CrmRecord 미생성). CrmWebhookNonceLedger에 `rrnDetected=true` 마킹 + hashed fingerprint(non-reversible)만 보존 + 외부 sink alert + status="rejected-rrn-detected"
256:8. 충돌 없음 → CrmRecord update + CrmRecordChangeLog (PII 마스킹된 changedFields)
265:type FieldAuthority =
268:  | "last-write-wins-timestamp"   // provider timestamp 기반
269:  | "last-write-wins-version";    // CAS 기반 version 비교
272:**last-write-wins-timestamp** 정확화:
275:- 모든 비교 실패 시 → `manual` 정책으로 escalate (CrmConflictRecord)
277:**last-write-wins-version (CAS)**:
278:- CrmRecord.crmVersion·solutionVersion 비교. 더 높은 version 승리
279:- version mismatch (예: 솔루션 측 update가 CrmRecord.solutionVersion 갱신 전 발생) → manual
281:**manual 해결 후**: `resolveConflict(conflictId, resolution)` 시 `appliedVersion` 저장 — 동일 충돌 재발 방지 (CrmRecord.lastAppliedConflictVersion 갱신)
287:### 4.5 credential rotation 상태 머신 (CS1-10)
294:1. rotating 상태 진입 — old credential은 rotationGracePeriodMinutes(기본 30분) 동안 fallback으로 유지
355:- `pii.rawPiiStorageAllowed=false` 강제 (v1.0 build fail if true)
361:- **CrmRecord·CrmRecordChangeLog·CrmConflictRecord 모든 snapshot/changedFields에 raw PII 저장 금지** — PII Redaction Validator가 schema 검증 시 강제
362:- raw detail 조회 — `liveReadCrmDetail(crmRecordId)`로 CRM API 실시간 호출 (no-cache·audit)
364:### 7.2 RRN deny (CS-01 resolved — v1.0 강제)
367:- asset-ingestion § 9.1 RRN checksum 알고리즘 재사용:
371:- 검증 통과 RRN 감지 시:
372:  - inbound webhook → payload 폐기. CrmRecord 미생성. status="rejected-rrn-detected"
374:  - CrmWebhookNonceLedger 또는 CrmRecordChangeLog에 `rrnDetected=true` + `rrnFingerprint`(non-reversible HMAC) 보존 — 운영 감사용·raw RRN 보존 금지
395:| RRN deny 발생율 | (baseline) | (운영 누적) |
397:| nonce ledger dedupe 적중률 | (재전송 빈도 추적) | baseline |
403:- manifest validator: legalApproved=false build fail, korean-emr build fail, appointment enabled build fail
405:- RRN deny: regex+checksum+payload 폐기·fingerprint 보존
406:- outbound-only mode: inbound runSync/processInboundWebhook 차단
408:- credential rotation: rotating → committed/reverted 두 경로
412:## 9. 설치·설정 — v0.1 § 9 유지 + DB 10 tables
428:- **`pii.rawPiiStorageAllowed=true`** (CS1-05 — v1.0 강제 false)
432:- `entities.<other>.conflictResolution`이 **`mode="outbound-only"` + `outbound-only-no-conflict` 외**(CS1-09)
440:- nonce ledger 중복 (이미 처리됨) → HTTP 200 idempotent (fail 아님)
442:- **inbound payload RRN 검출** (CS1-06) → 폐기 + sink alert
443:- **outbound push payload RRN 검출** → 차단 + 운영자 alert
445:- **mode="outbound-only" + processInboundWebhook 호출** → HTTP 404 (CS1-09)
446:- **mode="outbound-only" + runSync direction="inbound"/"both"** → runtime fail (CS1-09)
459:- **PII Redaction Validator drift 감지** (raw PII가 schema 미통과로 row insert됨) → 즉시 sink alert + 운영자 수동 정리
483:| CS-14 | `crm-live-read` audit cascade (raw PII live 조회 추적) | v1.x patch — REVIEW_WORKFLOW § 10.2.1 후속 cascade |
491:| CS-11 | CRM → Core 자동 promote (예: ReservationSubmission → 어드민 콘텐츠) | v1.x. `@provenanceCrmRecordId` 같은 공통 메타 cascade 필요 (CS1-18) |
499:| ~~CS-01~~ | RRN deny 정책 | v0.2 — build fail + asset-ingestion checksum 재사용 |
508:| 2026-05-14 | **v0.2** | **codex 자동 비평 1차 반영 (21 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType + 매트릭스 4행 (CS1-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 4종 AuditAction (CS1-01·16), (3) **DATA_MODEL C-08 v0.19 cascade** — CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion·DPA/consent 분리 (CS1-01·12), (4) **ReservationPage·CTAConfig 경계 정리** — 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent 운영 이벤트 (CS1-02·15 신규 CONTENT_STANDARDS cascade), (5) **provider 3종 한정** — salesforce·hubspot·generic-rest-api. korean-emr build fail·CS-13 deferred (CS1-03), (6) **webhook ProviderWebhookVerifier 인터페이스 + rawBody·nonce ledger** — CrmWebhookNonceLedger 신설 (CS1-04), (7) **raw PII 저장 금지 강제** — rawPiiStorageAllowed=false build fail. displayHints만. PII Redaction Validator (CS1-05), (8) **RRN deny v1.0 build fail** + asset-ingestion checksum 재사용. CS-01 resolved (CS1-06), (9) **field-level authority + CAS 충돌 해결** — FieldAuthority enum. clock skew·tie-breaker·appliedVersion (CS1-07), (10) **retry queue·outbox schema 풀 전개** § 13 (CS1-08), (11) **outbound-only command matrix** — inbound runSync/processInboundWebhook 차단 (CS1-09), (12) **credential rotation 상태 머신** — stable·rotating·committed·reverted + grace period (CS1-10), (13) **CrmRateLimitState 신설** — provider별 quota·resetAt·nextAllowedAt (CS1-11), (14) **DPA vs patient consent 분리** — dpaEvidenceRef·patientConsentEvidenceRef. v1.0은 record-level 미저장 (CS1-12, CS-07 deferred), (15) **§ 13 모든 10 tables 풀 schema 전개** (CS1-13), (16) **retention expiresAt 필드 추가** — syncLog·conflictRecord 등 (CS1-14), (17) **§ 6.1 매트릭스는 REVIEW_WORKFLOW SoT 행 인용만**으로 표시 (CS1-15), (18) **credential fingerprint non-reversible HMAC-SHA256** (CS1-16), (19) **미결정 3분류** — open/deferred-v1.x/resolved-in-v1.0 (CS1-17), (20) **CS-18 — @provenanceCrmRecordId v1.x 명시** (CS1-18), (21) **`?` 깨진 문자 정정** + read API/live read 권한 매트릭스 + acceptance test fixture (CS1-19·20·21)
512:## 13. 본 Feature 내부 데이터 구조 (admin DB 10 tables)
514:### 13.1 `CrmIntegration`
571:### 13.5 `CrmRecord` (PII 마스킹된 cache·상태 추적)
576:- raw PII 필드 절대 금지 (PII Redaction Validator 강제 — CS1-05)
581:### 13.6 `CrmRecordChangeLog`
583:v0.1 § 13.5 유지 + `changedFields`는 PII Redaction Validator 통과 (raw PII 금지). `expiresAt` ✅.
587:v0.1 § 13.6 + `authority: FieldAuthority enum` ✅.
597:### 13.10 `CrmRateLimitState` (CS1-11 신설) + `CrmWebhookNonceLedger` (CS1-04 신설)
611:**`CrmWebhookNonceLedger`** (replay 방지):
620:| `rrnFingerprint` | string | optional — RRN 감지 시 HMAC non-reversible |
626:### 13.11 `CrmSyncNotificationOutbox` (CS1-15)

codex
{
  "feature": "crm-sync",
  "version_reviewed": "v0.2",
  "cycle": 2,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.2는 1차 21개 지적 중 SoT cascade, provider 범위, ReservationPage 경계, RRN deny, DPA 분리 등은 상당 부분 실제 반영됐다. 그러나 webhook replay, PII 저장 금지의 구현 가능성, liveRead audit, DB 인벤토리, rotation 동시성, field-level CAS는 여전히 구현 가능한 계약 수준에 못 미친다.",
    "blocking_count": 7,
    "major_count": 8,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS2-01",
      "severity": "blocking",
      "category": "DB 인벤토리·명세 정합성",
      "location": "docs/features/crm-sync.md:25, 412, 512-626",
      "issue": "문서는 DB 10 tables라고 선언하지만 §13은 CrmRateLimitState와 CrmWebhookNonceLedger를 한 절에 묶어도 실제로는 CrmIntegration, SyncLog, SourceAttempt, RetryQueue, Record, ChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, RateLimitState, WebhookNonceLedger, NotificationOutbox까지 12개 논리 테이블이다. 또한 CrmIntegration은 '§3.2 shape'라고 되어 있는데 §3.2는 sync entity 정의라 참조가 틀렸고, 여러 테이블은 v0.1 유지로 핵심 필드·FK·INDEX가 생략되어 있다.",
      "impact": "migration 작성자가 실제 테이블 수와 FK/retention 범위를 확정할 수 없다. CS1-13/CS1-14가 표면적으로만 해결된 상태다.",
      "recommendation": "인벤토리 숫자를 실제 테이블 수로 정정하고, 각 테이블을 독립 절로 분리하라. CrmIntegration, CrmRecordChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, NotificationOutbox까지 최소 필드·FK·UNIQUE·INDEX·expiresAt·partial unique를 전개하라."
    },
    {
      "id": "CS2-02",
      "severity": "blocking",
      "category": "Audit·PII 운영 가능성",
      "location": "docs/features/crm-sync.md:174, 183-190, 361-362, 483; docs/admin/REVIEW_WORKFLOW.md:669-673",
      "issue": "liveReadCrmDetail은 v1.0 운영 API로 정의되어 raw PII detail을 CRM에서 실시간 조회하지만, audit action `crm-live-read`는 CS-14로 v1.x patch deferred다. REVIEW_WORKFLOW §10.2.1에도 해당 AuditAction이 없다.",
      "impact": "raw PII 조회 기능이 감사 로그 없이 v1.0에 열리거나, 구현 시 audit insert가 실패한다. raw PII 저장 금지 정책을 live read로 보완한다는 핵심 운영 경로가 v1.0에서 성립하지 않는다.",
      "recommendation": "`crm-live-read` AuditAction을 v1.0 cascade에 포함하고 audit contract를 정의하라. 포함하지 않을 경우 liveReadCrmDetail 자체를 v1.x로 내리고 v1.0 read API는 displayHints만 허용해야 한다."
    },
    {
      "id": "CS2-03",
      "severity": "blocking",
      "category": "webhook verifier 추상화",
      "location": "docs/features/crm-sync.md:229-230, 242-250, 304-317",
      "issue": "ProviderWebhookVerifier 인터페이스가 provider 차이를 충분히 담지 못한다. §3.4는 timestamp/providerEventId를 verifier 입력처럼 쓰지만 §4.2 실제 호출은 verify(rawBody, headers, fullUrl, method)만 전달한다. Salesforce는 §5.1에서 Outbound Messages XML SOAP와 Platform Events를 모두 허용하면서도 verifier는 HMAC webhook secret 중심으로 설명한다. generic-rest-api의 canonical string, timestamp header명, eventId 추출 규칙도 config schema가 없다.",
      "impact": "Salesforce/HubSpot/generic 구현자가 서로 다른 검증 결과 shape를 임의로 만들게 되고, replay ledger와 timestamp tolerance가 provider별로 일관 적용되지 않는다.",
      "recommendation": "Verifier 결과 타입을 `{signatureValid, providerEventId?, providerTimestamp?, canonicalDigest, deliveryKind, retrySemantics}`처럼 고정하라. provider별 canonical string, 필수 header, eventId fallback, Salesforce SOAP/XML 처리 방식을 별도 adapter contract로 분리하라."
    },
    {
      "id": "CS2-04",
      "severity": "blocking",
      "category": "webhook replay·dedupe",
      "location": "docs/features/crm-sync.md:133-134, 158, 230, 249-253, 611-625",
      "issue": "nonce ledger retention이 config에서는 60분, retentionDays.webhookNonceLedger에서는 1일로 이중 정의된다. UNIQUE(integrationId, providerEventId)는 providerEventId가 없거나 provider 범위에서만 고유한 경우를 처리하지 못하고, signatureDigest는 저장하지만 unique에 포함되지 않는다. RRN rejected 이벤트도 nonce ledger에 기록되어 이후 동일 eventId 재전송이 dedupe 처리될 수 있다.",
      "impact": "replay 방지와 provider 재전송 idempotency가 모두 불안정하다. 특히 false positive RRN 또는 transient parse 실패 후 provider 재전송을 운영자가 복구하기 어렵다.",
      "recommendation": "retention SoT를 하나로 통일하고, ledger key를 provider별 eventId 필수/선택 여부에 따라 `(integrationId, providerEventId)` 또는 `(integrationId, signatureDigest, receivedBucket)`로 명시하라. rejected 상태는 dedupe 차단 대상인지 재처리 가능 대상인지 status enum으로 분리하라."
    },
    {
      "id": "CS2-05",
      "severity": "blocking",
      "category": "PII 저장 금지·validator",
      "location": "docs/features/crm-sync.md:150, 355-362, 459, 571-583",
      "issue": "PII Redaction Validator가 'schema 검증'으로 raw PII 저장을 막는다고 하지만, CrmRecord.displayHints, changedFields, snapshots가 JSON이면 schema만으로 raw 이름·전화·이메일·주소 삽입을 안정적으로 차단할 수 없다. §10.4는 raw PII가 row insert된 뒤 drift 감지한다고 하여 예방과 사후 탐지가 섞여 있다.",
      "impact": "raw PII 저장 금지라는 v1.0 핵심 원칙이 구현 가능한 수준으로 강제되지 않는다. 충돌 snapshot과 change log가 다시 PII 저장소가 될 수 있다.",
      "recommendation": "displayHints를 closed schema로 고정하고 arbitrary JSON을 금지하라. changedFields/snapshot은 allowlisted field token + masked value만 허용하고, DB CHECK 또는 application validator 실패 시 insert 자체를 reject해야 한다. drift 감지는 사후 보조 invariant로만 두라."
    },
    {
      "id": "CS2-06",
      "severity": "blocking",
      "category": "outbound-only mode",
      "location": "docs/features/crm-sync.md:120-128, 170-173, 216, 428-446",
      "issue": "outbound-only 차단은 runSync/processInboundWebhook/conflictResolution 일부에만 있다. CrmFieldMapping에는 direction 또는 inbound mapping 금지 규칙이 없고, bi-directional 전용 webhookSecret required와 outbound-only endpoint 미등록 규칙도 build matrix로 분리되지 않았다. HTTP 404와 runtime fail의 경계도 endpoint 호출은 404, command 호출은 runtime fail로만 암묵적이다.",
      "impact": "outbound-only 인스턴스에서 inbound field mapping이나 conflict queue가 구성될 수 있고, 내부 command 경로로 inbound 처리가 우회될 수 있다.",
      "recommendation": "mode별 command/event/error matrix를 별도로 추가하라. outbound-only에서는 inbound webhook route 미등록, processInboundWebhook direct invocation runtime fail, runSync inbound/both fail, inbound FieldMapping build fail, conflictResolution은 전 entity outbound-only-no-conflict만 허용을 명시하라."
    },
    {
      "id": "CS2-07",
      "severity": "blocking",
      "category": "동의·법적 근거",
      "location": "docs/features/crm-sync.md:174, 242-258, 376-380, 489-491; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "patientConsentEvidenceRef와 동의 철회 처리가 v1.x로 deferred인데, v1.0은 inbound webhook으로 환자 컨택트 displayHints를 만들고 liveReadCrmDetail로 raw PII를 조회할 수 있다. DPA만으로 환자 단위 live read의 적법성·철회 상태 확인을 대체한다고 보기 어렵다.",
      "impact": "솔루션 DB에 raw PII를 저장하지 않더라도, 운영자가 CRM raw detail을 조회하는 순간 record-level 법적 근거와 감사 추적이 필요하다. CS-07/CS-14 deferred가 v1.0 운영 차단 요인이 된다.",
      "recommendation": "v1.0에서 liveRead를 제거하거나, 최소한 CRM record에 대한 consent/withdrawal 상태를 live precheck하는 provider contract와 audit metadata를 추가하라. patientConsentEvidenceRef를 저장하지 않는다면 '조회 전 CRM에서 동의 상태 확인 실패 시 deny' 규칙이 필요하다."
    },
    {
      "id": "CS2-08",
      "severity": "major",
      "category": "field-level conflict·CAS",
      "location": "docs/features/crm-sync.md:263-281, 571-579, 589-593",
      "issue": "FieldAuthority와 CAS 비교 규칙은 추가됐지만 race condition 방지가 없다. CrmRecord row lock, per-field version, transaction boundary, compare-and-set update 조건이 없고, appliedVersion이 record 전체 버전인지 field 버전인지 conflict 버전인지 불명확하다.",
      "impact": "동시 inbound webhook과 outbound push가 같은 CrmRecord를 갱신하면 더 높은 version 비교 후에도 lost update가 발생할 수 있다. manual resolve 후 동일 충돌 재발 방지도 field 단위로 보장되지 않는다.",
      "recommendation": "CrmRecord 갱신은 `WHERE id=? AND solutionVersion=? AND crmVersion=?` CAS 또는 `SELECT FOR UPDATE`로 고정하라. ConflictRecord에는 fieldPath별 baseVersion/winningVersion/appliedVersion을 저장하고, manual escalate 조건을 결정표로 분리하라."
    },
    {
      "id": "CS2-09",
      "severity": "major",
      "category": "credential rotation 동시성",
      "location": "docs/features/crm-sync.md:141-142, 287-299, 594-596",
      "issue": "credential rotation 상태 머신은 문장으로만 있고 CrmIntegration 또는 별도 CredentialVersion schema에 state, activeSecretRef, previousSecretRef, graceUntil, rotationAttemptId가 없다. rotating 중 outbound API 호출과 inbound webhook signature 검증이 old/new credential 중 무엇을 쓰는지도 정의되지 않았다.",
      "impact": "rotation 중 일부 worker는 old credential, 일부 worker는 new credential을 사용해 비결정적 실패가 발생할 수 있다. old credential fallback이 잘못된 inbound signature를 허용하거나, commit/revoke 순서에서 sync 중단이 생길 수 있다.",
      "recommendation": "CredentialVersion 또는 CrmIntegration credential fields를 전개하라. rotating 중 outbound는 new 우선 old fallback인지, inbound verifier는 old+new 병행 허용인지, grace 종료 후 revoke/reconcile을 어떻게 하는지 상태별 matrix로 명시하라."
    },
    {
      "id": "CS2-10",
      "severity": "major",
      "category": "RRN false positive 복구",
      "location": "docs/features/crm-sync.md:252-253, 364-374, 440-443, 611-625",
      "issue": "RRN 검출 시 payload를 폐기하고 fingerprint만 남기지만 false positive 판정 시 운영자 복구 경로가 없다. 특히 ledger에 providerEventId가 이미 들어가면 provider가 동일 eventId로 재전송해도 dedupe 처리될 수 있다.",
      "impact": "정상 예약·문의가 RRN false positive로 영구 유실될 수 있다. raw payload 저장 금지와 운영 복구 요구가 충돌한다.",
      "recommendation": "rejected-rrn-detected ledger 상태는 processed와 분리하고, 운영자 override 후 동일 providerEventId 재처리 허용 또는 CRM live pull by externalId 복구 command를 정의하라. fingerprint만으로 복구 불가하다는 제약도 명시해야 한다."
    },
    {
      "id": "CS2-11",
      "severity": "major",
      "category": "Notification outbox idempotency",
      "location": "docs/features/crm-sync.md:327-346, 626-628",
      "issue": "`crm-sync-credential-expiring-soon`과 `crm-sync-credential-expired`는 sourceKind=integration, sourceId=integrationId, eventType unique라서 credential rotation 후 같은 integration에서 새 credential이 다시 만료 임박해도 새 outbox row 생성이 차단될 수 있다. sourceEventId에도 credentialVersion 또는 expiresAt이 없다.",
      "impact": "credential lifecycle이 반복되는 장기 운영에서 두 번째 이후 만료 임박/만료 알림이 누락될 수 있다.",
      "recommendation": "credential 알림 sourceId를 credentialVersionId 또는 `integrationId:credentialExpiresAt` 기반으로 잡거나, sourceKind/sourceId/eventType unique에 credentialVersion을 포함하라."
    },
    {
      "id": "CS2-12",
      "severity": "major",
      "category": "retry/outbox 패턴 정합성",
      "location": "docs/features/crm-sync.md:283-285, 550-569, 626-628; docs/features/search-visibility.md:630-642; docs/features/keyword-monitoring.md:406-421",
      "issue": "search-visibility/keyword-monitoring 안정판은 SKIP LOCKED, advisory lock, status 전이, 원자성 invariant를 구체화했는데 crm-sync는 '패턴 동일'이라고만 하고 worker SQL과 lock ordering을 복제하지 않았다. RetryQueue에도 maxAttempts, expiresAt, unique idempotency key, permanent 전이 조건이 없다.",
      "impact": "외부 CRM 연동 장애 시 중복 push, stuck processing, exhausted 전이 누락이 발생할 수 있다. CS1-08이 충분히 해결되지 않았다.",
      "recommendation": "SearchVisibilityCollectionRetryQueue 수준의 worker SoT SQL을 crm-sync에 직접 복제하라. pushOutbound idempotency key, retryable/permanent error class, lockedAt 재claim, advisory lock key, exhausted alert 전이를 고정하라."
    },
    {
      "id": "CS2-13",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:154-158, 571-579, 581-593, 626-628",
      "issue": "retentionDays는 syncLog/changeLog/conflictRecord/webhookNonceLedger만 있고 displayHintsRetentionDays는 CrmRecord의 `piiRetentionExpiresAt` 인덱스 언급과 연결되지만 실제 필드 schema가 없다. NotificationOutbox와 RetryQueue retention도 없다. purge worker SoT가 본 Feature 내부인지 notifications/analytics 패턴 재사용인지 불명확하다.",
      "impact": "보존 기간이 schema와 worker에 연결되지 않아 개인정보 최소 보존과 운영 로그 보존이 동시에 흔들린다.",
      "recommendation": "각 retention 대상 테이블의 expiresAt 산정식을 명시하고 purge worker 책임 범위를 분리하라. CrmRecord displayHints 만료 시 UI degrade 정책과 field nulling 정책을 v1.0에서 결정하라."
    },
    {
      "id": "CS2-14",
      "severity": "major",
      "category": "credential fingerprint",
      "location": "docs/features/crm-sync.md:192-193, 594-596",
      "issue": "credential fingerprint 공식이 `HMAC-SHA256(secret-manager-key-id, \"crm-credential-fingerprint\")`로 되어 있어 credential 값이나 secret version을 입력에 포함하지 않는다. 같은 secret-manager key-id를 쓰는 credential은 동일 fingerprint가 된다.",
      "impact": "rotation audit에서 prior/new credential이 실제로 달라졌는지 검증할 수 없다. non-reversible이라는 목적은 맞지만 식별자로서 기능하지 않는다.",
      "recommendation": "raw secret을 직접 저장하지 않되, secret manager의 immutable version id 또는 provider credential public id를 HMAC message에 포함하라. 예: `HMAC(auditPepper, integrationId + secretVersionId)`."
    },
    {
      "id": "CS2-15",
      "severity": "major",
      "category": "운영 이벤트 SoT",
      "location": "docs/features/crm-sync.md:198-211, 483-491",
      "issue": "ReservationSubmission, Inquiry, ConversionEvent는 v1.0 sync 대상이라고 하지만 CONTENT_STANDARDS submission/event 인터페이스 cascade가 CS-15 open으로 남아 있다. Contact도 placeholder 타입이다.",
      "impact": "ReservationPage 자체를 sync 대상에서 제거한 CS1-02는 해결됐지만, 대체 운영 이벤트의 canonical schema가 없어 FieldMapping과 validator가 실제 경로를 검증할 수 없다.",
      "recommendation": "v1.0에서 필요한 ReservationSubmission/Inquiry/ConversionEvent/Contact 최소 계약을 본 문서 내부에 완전히 정의하거나, CONTENT_STANDARDS cascade를 v1.0 blocker로 올려 완료하라."
    },
    {
      "id": "CS2-16",
      "severity": "minor",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:401-408",
      "issue": "acceptance fixture 6개는 1차 회귀 일부만 막는다. liveRead audit, PII validator closed schema, DB constraint inventory, credential rotation 중 inbound/outbound 동시성, CAS lost update, outbox credentialVersion dedupe, purge worker는 테스트 대상이 아니다.",
      "impact": "v1.0 안정판에서 이번 v0.2 신규 메커니즘의 핵심 위험이 자동 회귀 방지되지 않는다.",
      "recommendation": "§8.2에 동시성/DB constraint/PII closed schema/audit cascade/purge/outbox idempotency fixture를 추가하라."
    },
    {
      "id": "CS2-17",
      "severity": "minor",
      "category": "1차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:508; docs/admin/REVIEW_WORKFLOW.md:503-507, 669-673; docs/core/DATA_MODEL.md:596-713",
      "issue": "변경 이력은 21개 전건 수용이라고 하지만 실제 재발 상태는 혼재다. CS1-01, CS1-02, CS1-03, CS1-06, CS1-12, CS1-16은 대체로 정정됐다. 반면 CS1-04, CS1-05, CS1-07, CS1-08, CS1-09, CS1-10, CS1-13, CS1-14, CS1-20, CS1-21은 구현 가능성 또는 테스트 범위에서 부분 재발한다.",
      "impact": "수용 완료 표기가 실제 안정판 readiness를 과대평가한다.",
      "recommendation": "변경 이력에는 '반영' 대신 '검토 필요 잔여 리스크'를 분리하고, 본 2차 지적 중 1차 재발 항목을 별도 resolved checklist로 추적하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리와 §13 schema를 실제 테이블 수 기준으로 재작성하고 FK·UNIQUE·INDEX·expiresAt·worker SoT를 모두 전개한다.",
    "`crm-live-read` audit cascade를 v1.0으로 올리거나 liveReadCrmDetail을 v1.x로 내린다.",
    "ProviderWebhookVerifier 결과 타입, provider별 canonicalization, nonce ledger key/retention/rejected 상태를 재설계한다.",
    "PII Redaction Validator를 closed schema + insert-time reject 방식으로 바꾸고 JSON 자유 필드를 제거한다.",
    "outbound-only, credential rotation, CAS conflict resolution을 상태별 matrix와 transaction/CAS 조건으로 고정한다.",
    "ReservationSubmission/Inquiry/ConversionEvent/Contact의 v1.0 canonical schema를 확정하거나 CS-15를 blocker로 승격한다."
  ],
  "stability_assessment": {
    "SoT_alignment": "partial",
    "cycle1_regression_status": "partial_regression",
    "external_integration_reliability": "fail",
    "webhook_security": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "credential_rotation": "partial",
    "outbound_only_mode": "partial",
    "db_schema_completeness": "fail",
    "operational_reliability": "partial",
    "acceptance_test_coverage": "partial"
  }
}
tokens used
64,288
{
  "feature": "crm-sync",
  "version_reviewed": "v0.2",
  "cycle": 2,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.2는 1차 21개 지적 중 SoT cascade, provider 범위, ReservationPage 경계, RRN deny, DPA 분리 등은 상당 부분 실제 반영됐다. 그러나 webhook replay, PII 저장 금지의 구현 가능성, liveRead audit, DB 인벤토리, rotation 동시성, field-level CAS는 여전히 구현 가능한 계약 수준에 못 미친다.",
    "blocking_count": 7,
    "major_count": 8,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS2-01",
      "severity": "blocking",
      "category": "DB 인벤토리·명세 정합성",
      "location": "docs/features/crm-sync.md:25, 412, 512-626",
      "issue": "문서는 DB 10 tables라고 선언하지만 §13은 CrmRateLimitState와 CrmWebhookNonceLedger를 한 절에 묶어도 실제로는 CrmIntegration, SyncLog, SourceAttempt, RetryQueue, Record, ChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, RateLimitState, WebhookNonceLedger, NotificationOutbox까지 12개 논리 테이블이다. 또한 CrmIntegration은 '§3.2 shape'라고 되어 있는데 §3.2는 sync entity 정의라 참조가 틀렸고, 여러 테이블은 v0.1 유지로 핵심 필드·FK·INDEX가 생략되어 있다.",
      "impact": "migration 작성자가 실제 테이블 수와 FK/retention 범위를 확정할 수 없다. CS1-13/CS1-14가 표면적으로만 해결된 상태다.",
      "recommendation": "인벤토리 숫자를 실제 테이블 수로 정정하고, 각 테이블을 독립 절로 분리하라. CrmIntegration, CrmRecordChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, NotificationOutbox까지 최소 필드·FK·UNIQUE·INDEX·expiresAt·partial unique를 전개하라."
    },
    {
      "id": "CS2-02",
      "severity": "blocking",
      "category": "Audit·PII 운영 가능성",
      "location": "docs/features/crm-sync.md:174, 183-190, 361-362, 483; docs/admin/REVIEW_WORKFLOW.md:669-673",
      "issue": "liveReadCrmDetail은 v1.0 운영 API로 정의되어 raw PII detail을 CRM에서 실시간 조회하지만, audit action `crm-live-read`는 CS-14로 v1.x patch deferred다. REVIEW_WORKFLOW §10.2.1에도 해당 AuditAction이 없다.",
      "impact": "raw PII 조회 기능이 감사 로그 없이 v1.0에 열리거나, 구현 시 audit insert가 실패한다. raw PII 저장 금지 정책을 live read로 보완한다는 핵심 운영 경로가 v1.0에서 성립하지 않는다.",
      "recommendation": "`crm-live-read` AuditAction을 v1.0 cascade에 포함하고 audit contract를 정의하라. 포함하지 않을 경우 liveReadCrmDetail 자체를 v1.x로 내리고 v1.0 read API는 displayHints만 허용해야 한다."
    },
    {
      "id": "CS2-03",
      "severity": "blocking",
      "category": "webhook verifier 추상화",
      "location": "docs/features/crm-sync.md:229-230, 242-250, 304-317",
      "issue": "ProviderWebhookVerifier 인터페이스가 provider 차이를 충분히 담지 못한다. §3.4는 timestamp/providerEventId를 verifier 입력처럼 쓰지만 §4.2 실제 호출은 verify(rawBody, headers, fullUrl, method)만 전달한다. Salesforce는 §5.1에서 Outbound Messages XML SOAP와 Platform Events를 모두 허용하면서도 verifier는 HMAC webhook secret 중심으로 설명한다. generic-rest-api의 canonical string, timestamp header명, eventId 추출 규칙도 config schema가 없다.",
      "impact": "Salesforce/HubSpot/generic 구현자가 서로 다른 검증 결과 shape를 임의로 만들게 되고, replay ledger와 timestamp tolerance가 provider별로 일관 적용되지 않는다.",
      "recommendation": "Verifier 결과 타입을 `{signatureValid, providerEventId?, providerTimestamp?, canonicalDigest, deliveryKind, retrySemantics}`처럼 고정하라. provider별 canonical string, 필수 header, eventId fallback, Salesforce SOAP/XML 처리 방식을 별도 adapter contract로 분리하라."
    },
    {
      "id": "CS2-04",
      "severity": "blocking",
      "category": "webhook replay·dedupe",
      "location": "docs/features/crm-sync.md:133-134, 158, 230, 249-253, 611-625",
      "issue": "nonce ledger retention이 config에서는 60분, retentionDays.webhookNonceLedger에서는 1일로 이중 정의된다. UNIQUE(integrationId, providerEventId)는 providerEventId가 없거나 provider 범위에서만 고유한 경우를 처리하지 못하고, signatureDigest는 저장하지만 unique에 포함되지 않는다. RRN rejected 이벤트도 nonce ledger에 기록되어 이후 동일 eventId 재전송이 dedupe 처리될 수 있다.",
      "impact": "replay 방지와 provider 재전송 idempotency가 모두 불안정하다. 특히 false positive RRN 또는 transient parse 실패 후 provider 재전송을 운영자가 복구하기 어렵다.",
      "recommendation": "retention SoT를 하나로 통일하고, ledger key를 provider별 eventId 필수/선택 여부에 따라 `(integrationId, providerEventId)` 또는 `(integrationId, signatureDigest, receivedBucket)`로 명시하라. rejected 상태는 dedupe 차단 대상인지 재처리 가능 대상인지 status enum으로 분리하라."
    },
    {
      "id": "CS2-05",
      "severity": "blocking",
      "category": "PII 저장 금지·validator",
      "location": "docs/features/crm-sync.md:150, 355-362, 459, 571-583",
      "issue": "PII Redaction Validator가 'schema 검증'으로 raw PII 저장을 막는다고 하지만, CrmRecord.displayHints, changedFields, snapshots가 JSON이면 schema만으로 raw 이름·전화·이메일·주소 삽입을 안정적으로 차단할 수 없다. §10.4는 raw PII가 row insert된 뒤 drift 감지한다고 하여 예방과 사후 탐지가 섞여 있다.",
      "impact": "raw PII 저장 금지라는 v1.0 핵심 원칙이 구현 가능한 수준으로 강제되지 않는다. 충돌 snapshot과 change log가 다시 PII 저장소가 될 수 있다.",
      "recommendation": "displayHints를 closed schema로 고정하고 arbitrary JSON을 금지하라. changedFields/snapshot은 allowlisted field token + masked value만 허용하고, DB CHECK 또는 application validator 실패 시 insert 자체를 reject해야 한다. drift 감지는 사후 보조 invariant로만 두라."
    },
    {
      "id": "CS2-06",
      "severity": "blocking",
      "category": "outbound-only mode",
      "location": "docs/features/crm-sync.md:120-128, 170-173, 216, 428-446",
      "issue": "outbound-only 차단은 runSync/processInboundWebhook/conflictResolution 일부에만 있다. CrmFieldMapping에는 direction 또는 inbound mapping 금지 규칙이 없고, bi-directional 전용 webhookSecret required와 outbound-only endpoint 미등록 규칙도 build matrix로 분리되지 않았다. HTTP 404와 runtime fail의 경계도 endpoint 호출은 404, command 호출은 runtime fail로만 암묵적이다.",
      "impact": "outbound-only 인스턴스에서 inbound field mapping이나 conflict queue가 구성될 수 있고, 내부 command 경로로 inbound 처리가 우회될 수 있다.",
      "recommendation": "mode별 command/event/error matrix를 별도로 추가하라. outbound-only에서는 inbound webhook route 미등록, processInboundWebhook direct invocation runtime fail, runSync inbound/both fail, inbound FieldMapping build fail, conflictResolution은 전 entity outbound-only-no-conflict만 허용을 명시하라."
    },
    {
      "id": "CS2-07",
      "severity": "blocking",
      "category": "동의·법적 근거",
      "location": "docs/features/crm-sync.md:174, 242-258, 376-380, 489-491; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "patientConsentEvidenceRef와 동의 철회 처리가 v1.x로 deferred인데, v1.0은 inbound webhook으로 환자 컨택트 displayHints를 만들고 liveReadCrmDetail로 raw PII를 조회할 수 있다. DPA만으로 환자 단위 live read의 적법성·철회 상태 확인을 대체한다고 보기 어렵다.",
      "impact": "솔루션 DB에 raw PII를 저장하지 않더라도, 운영자가 CRM raw detail을 조회하는 순간 record-level 법적 근거와 감사 추적이 필요하다. CS-07/CS-14 deferred가 v1.0 운영 차단 요인이 된다.",
      "recommendation": "v1.0에서 liveRead를 제거하거나, 최소한 CRM record에 대한 consent/withdrawal 상태를 live precheck하는 provider contract와 audit metadata를 추가하라. patientConsentEvidenceRef를 저장하지 않는다면 '조회 전 CRM에서 동의 상태 확인 실패 시 deny' 규칙이 필요하다."
    },
    {
      "id": "CS2-08",
      "severity": "major",
      "category": "field-level conflict·CAS",
      "location": "docs/features/crm-sync.md:263-281, 571-579, 589-593",
      "issue": "FieldAuthority와 CAS 비교 규칙은 추가됐지만 race condition 방지가 없다. CrmRecord row lock, per-field version, transaction boundary, compare-and-set update 조건이 없고, appliedVersion이 record 전체 버전인지 field 버전인지 conflict 버전인지 불명확하다.",
      "impact": "동시 inbound webhook과 outbound push가 같은 CrmRecord를 갱신하면 더 높은 version 비교 후에도 lost update가 발생할 수 있다. manual resolve 후 동일 충돌 재발 방지도 field 단위로 보장되지 않는다.",
      "recommendation": "CrmRecord 갱신은 `WHERE id=? AND solutionVersion=? AND crmVersion=?` CAS 또는 `SELECT FOR UPDATE`로 고정하라. ConflictRecord에는 fieldPath별 baseVersion/winningVersion/appliedVersion을 저장하고, manual escalate 조건을 결정표로 분리하라."
    },
    {
      "id": "CS2-09",
      "severity": "major",
      "category": "credential rotation 동시성",
      "location": "docs/features/crm-sync.md:141-142, 287-299, 594-596",
      "issue": "credential rotation 상태 머신은 문장으로만 있고 CrmIntegration 또는 별도 CredentialVersion schema에 state, activeSecretRef, previousSecretRef, graceUntil, rotationAttemptId가 없다. rotating 중 outbound API 호출과 inbound webhook signature 검증이 old/new credential 중 무엇을 쓰는지도 정의되지 않았다.",
      "impact": "rotation 중 일부 worker는 old credential, 일부 worker는 new credential을 사용해 비결정적 실패가 발생할 수 있다. old credential fallback이 잘못된 inbound signature를 허용하거나, commit/revoke 순서에서 sync 중단이 생길 수 있다.",
      "recommendation": "CredentialVersion 또는 CrmIntegration credential fields를 전개하라. rotating 중 outbound는 new 우선 old fallback인지, inbound verifier는 old+new 병행 허용인지, grace 종료 후 revoke/reconcile을 어떻게 하는지 상태별 matrix로 명시하라."
    },
    {
      "id": "CS2-10",
      "severity": "major",
      "category": "RRN false positive 복구",
      "location": "docs/features/crm-sync.md:252-253, 364-374, 440-443, 611-625",
      "issue": "RRN 검출 시 payload를 폐기하고 fingerprint만 남기지만 false positive 판정 시 운영자 복구 경로가 없다. 특히 ledger에 providerEventId가 이미 들어가면 provider가 동일 eventId로 재전송해도 dedupe 처리될 수 있다.",
      "impact": "정상 예약·문의가 RRN false positive로 영구 유실될 수 있다. raw payload 저장 금지와 운영 복구 요구가 충돌한다.",
      "recommendation": "rejected-rrn-detected ledger 상태는 processed와 분리하고, 운영자 override 후 동일 providerEventId 재처리 허용 또는 CRM live pull by externalId 복구 command를 정의하라. fingerprint만으로 복구 불가하다는 제약도 명시해야 한다."
    },
    {
      "id": "CS2-11",
      "severity": "major",
      "category": "Notification outbox idempotency",
      "location": "docs/features/crm-sync.md:327-346, 626-628",
      "issue": "`crm-sync-credential-expiring-soon`과 `crm-sync-credential-expired`는 sourceKind=integration, sourceId=integrationId, eventType unique라서 credential rotation 후 같은 integration에서 새 credential이 다시 만료 임박해도 새 outbox row 생성이 차단될 수 있다. sourceEventId에도 credentialVersion 또는 expiresAt이 없다.",
      "impact": "credential lifecycle이 반복되는 장기 운영에서 두 번째 이후 만료 임박/만료 알림이 누락될 수 있다.",
      "recommendation": "credential 알림 sourceId를 credentialVersionId 또는 `integrationId:credentialExpiresAt` 기반으로 잡거나, sourceKind/sourceId/eventType unique에 credentialVersion을 포함하라."
    },
    {
      "id": "CS2-12",
      "severity": "major",
      "category": "retry/outbox 패턴 정합성",
      "location": "docs/features/crm-sync.md:283-285, 550-569, 626-628; docs/features/search-visibility.md:630-642; docs/features/keyword-monitoring.md:406-421",
      "issue": "search-visibility/keyword-monitoring 안정판은 SKIP LOCKED, advisory lock, status 전이, 원자성 invariant를 구체화했는데 crm-sync는 '패턴 동일'이라고만 하고 worker SQL과 lock ordering을 복제하지 않았다. RetryQueue에도 maxAttempts, expiresAt, unique idempotency key, permanent 전이 조건이 없다.",
      "impact": "외부 CRM 연동 장애 시 중복 push, stuck processing, exhausted 전이 누락이 발생할 수 있다. CS1-08이 충분히 해결되지 않았다.",
      "recommendation": "SearchVisibilityCollectionRetryQueue 수준의 worker SoT SQL을 crm-sync에 직접 복제하라. pushOutbound idempotency key, retryable/permanent error class, lockedAt 재claim, advisory lock key, exhausted alert 전이를 고정하라."
    },
    {
      "id": "CS2-13",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:154-158, 571-579, 581-593, 626-628",
      "issue": "retentionDays는 syncLog/changeLog/conflictRecord/webhookNonceLedger만 있고 displayHintsRetentionDays는 CrmRecord의 `piiRetentionExpiresAt` 인덱스 언급과 연결되지만 실제 필드 schema가 없다. NotificationOutbox와 RetryQueue retention도 없다. purge worker SoT가 본 Feature 내부인지 notifications/analytics 패턴 재사용인지 불명확하다.",
      "impact": "보존 기간이 schema와 worker에 연결되지 않아 개인정보 최소 보존과 운영 로그 보존이 동시에 흔들린다.",
      "recommendation": "각 retention 대상 테이블의 expiresAt 산정식을 명시하고 purge worker 책임 범위를 분리하라. CrmRecord displayHints 만료 시 UI degrade 정책과 field nulling 정책을 v1.0에서 결정하라."
    },
    {
      "id": "CS2-14",
      "severity": "major",
      "category": "credential fingerprint",
      "location": "docs/features/crm-sync.md:192-193, 594-596",
      "issue": "credential fingerprint 공식이 `HMAC-SHA256(secret-manager-key-id, \"crm-credential-fingerprint\")`로 되어 있어 credential 값이나 secret version을 입력에 포함하지 않는다. 같은 secret-manager key-id를 쓰는 credential은 동일 fingerprint가 된다.",
      "impact": "rotation audit에서 prior/new credential이 실제로 달라졌는지 검증할 수 없다. non-reversible이라는 목적은 맞지만 식별자로서 기능하지 않는다.",
      "recommendation": "raw secret을 직접 저장하지 않되, secret manager의 immutable version id 또는 provider credential public id를 HMAC message에 포함하라. 예: `HMAC(auditPepper, integrationId + secretVersionId)`."
    },
    {
      "id": "CS2-15",
      "severity": "major",
      "category": "운영 이벤트 SoT",
      "location": "docs/features/crm-sync.md:198-211, 483-491",
      "issue": "ReservationSubmission, Inquiry, ConversionEvent는 v1.0 sync 대상이라고 하지만 CONTENT_STANDARDS submission/event 인터페이스 cascade가 CS-15 open으로 남아 있다. Contact도 placeholder 타입이다.",
      "impact": "ReservationPage 자체를 sync 대상에서 제거한 CS1-02는 해결됐지만, 대체 운영 이벤트의 canonical schema가 없어 FieldMapping과 validator가 실제 경로를 검증할 수 없다.",
      "recommendation": "v1.0에서 필요한 ReservationSubmission/Inquiry/ConversionEvent/Contact 최소 계약을 본 문서 내부에 완전히 정의하거나, CONTENT_STANDARDS cascade를 v1.0 blocker로 올려 완료하라."
    },
    {
      "id": "CS2-16",
      "severity": "minor",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:401-408",
      "issue": "acceptance fixture 6개는 1차 회귀 일부만 막는다. liveRead audit, PII validator closed schema, DB constraint inventory, credential rotation 중 inbound/outbound 동시성, CAS lost update, outbox credentialVersion dedupe, purge worker는 테스트 대상이 아니다.",
      "impact": "v1.0 안정판에서 이번 v0.2 신규 메커니즘의 핵심 위험이 자동 회귀 방지되지 않는다.",
      "recommendation": "§8.2에 동시성/DB constraint/PII closed schema/audit cascade/purge/outbox idempotency fixture를 추가하라."
    },
    {
      "id": "CS2-17",
      "severity": "minor",
      "category": "1차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:508; docs/admin/REVIEW_WORKFLOW.md:503-507, 669-673; docs/core/DATA_MODEL.md:596-713",
      "issue": "변경 이력은 21개 전건 수용이라고 하지만 실제 재발 상태는 혼재다. CS1-01, CS1-02, CS1-03, CS1-06, CS1-12, CS1-16은 대체로 정정됐다. 반면 CS1-04, CS1-05, CS1-07, CS1-08, CS1-09, CS1-10, CS1-13, CS1-14, CS1-20, CS1-21은 구현 가능성 또는 테스트 범위에서 부분 재발한다.",
      "impact": "수용 완료 표기가 실제 안정판 readiness를 과대평가한다.",
      "recommendation": "변경 이력에는 '반영' 대신 '검토 필요 잔여 리스크'를 분리하고, 본 2차 지적 중 1차 재발 항목을 별도 resolved checklist로 추적하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리와 §13 schema를 실제 테이블 수 기준으로 재작성하고 FK·UNIQUE·INDEX·expiresAt·worker SoT를 모두 전개한다.",
    "`crm-live-read` audit cascade를 v1.0으로 올리거나 liveReadCrmDetail을 v1.x로 내린다.",
    "ProviderWebhookVerifier 결과 타입, provider별 canonicalization, nonce ledger key/retention/rejected 상태를 재설계한다.",
    "PII Redaction Validator를 closed schema + insert-time reject 방식으로 바꾸고 JSON 자유 필드를 제거한다.",
    "outbound-only, credential rotation, CAS conflict resolution을 상태별 matrix와 transaction/CAS 조건으로 고정한다.",
    "ReservationSubmission/Inquiry/ConversionEvent/Contact의 v1.0 canonical schema를 확정하거나 CS-15를 blocker로 승격한다."
  ],
  "stability_assessment": {
    "SoT_alignment": "partial",
    "cycle1_regression_status": "partial_regression",
    "external_integration_reliability": "fail",
    "webhook_security": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "credential_rotation": "partial",
    "outbound_only_mode": "partial",
    "db_schema_completeness": "fail",
    "operational_reliability": "partial",
    "acceptance_test_coverage": "partial"
  }
}
