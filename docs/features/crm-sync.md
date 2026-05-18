# Feature — crm-sync

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지**. webhook(실시간) + polling(배치).
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20
> - RRN checksum → `features/asset-ingestion.md` § 9.1
> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
- **vs ReservationPage(C-20)**: C-20은 콘텐츠 페이지. 본 Feature는 ReservationSubmission·Inquiry·ConversionEvent·Contact 운영 이벤트 sync
- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x (CS-13). **`providerVersionToken=null` provider build fail (CS4-04)** — record-level dedupe 보장 불가
- **운영 모드 2종**: `bi-directional`·`outbound-only`
- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `appointment` v1.x (CS-12)
- **PII 정책**: raw PII 저장 금지. operationalHints는 privacy-sensitive metadata로 분류 (CS4-05). liveRead v1.x (CS-14)
- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
- **DB 인벤토리**: **15 tables** (§ 13.1 ~ § 13.15) — 각 절 stand-alone schema

---

## 1. 일반 규약

### 1.1 변경 정책 (CS4-13 보강)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping·canonical schema § 3.2 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |
| displayHints column 추가 | MINOR | 별개 | nullable. read API output 추가 |
| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
| operationalHints column 추가 | MINOR | 별개 | nullable. privacy classification 검토 필수 (CS4-13) |
| operationalHints privacy classification 변경 | **MAJOR** | policyVersion 신규 | retention·masking·role access 재평가 |
| CrmCredentialVersion.state enum 추가 | MINOR | 별개 | invariant 표 갱신 |
| CrmCredentialVersion.state enum 제거·rename | **MAJOR** | policyVersion 신규 | |
| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
| **consent withdrawal scope enum 추가·변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 적용 의미 변경은 record-level erasure 영향 |
| **consent withdrawal matching key 알고리즘·hash 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 tombstone 무효화 위험 |
| **ChangeIdentityLedger key 산정 알고리즘 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 ledger row 무효화 |
| **providerVersionToken requirement 강화** (CS4-13) | **MAJOR** | 별개 | build fail 룰 추가 |

### 1.2 SoT 원칙

- 알림 발송·audit canonical → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion → DATA_MODEL C-08 v0.20
- RRN checksum → `features/asset-ingestion.md` § 9.1
- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| CrmSyncRetryQueue | 5·configurable | [60, 300, 1800, 7200, 21600]s |
| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL 동일 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 → notifications
- 외부 CRM 운영·계약 → 클라이언트·CRM provider
- Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote v1.x (CS-11)
- 의료 진료 기록 보관 → CRM·EMR
- raw PII 실시간 조회 → v1.x (CS-14)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
| DATA_MODEL C-08 v0.20 | `crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter` |
| DATA_MODEL CT-03·C-20 | 참조만 |
| asset-ingestion § 9.1 | RRN checksum |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |

### 2.3 InstanceManifest 통합

v0.4 § 2.3과 동일 구조. 정정 필드는 없으나 stand-alone SoT 강화를 위해 명시:

```yaml
crmSyncConfig:
  integrations:
    - id: "main-crm"
      provider: "salesforce"
      apiKeySecretRef: "secretRef://..."
      apiUrl: "..."
      webhookSecret: "secretRef://..."
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
      dpaEvidenceRef: "secretRef://..."
      genericRestApiAdapter:                            # provider=generic-rest-api 시 ✅. DATA_MODEL C-08 v0.20 동기화 (5필드)
        webhookSignatureHeader: "X-Webhook-Signature"
        webhookTimestampHeader: "X-Webhook-Timestamp"
        webhookEventIdHeader: "X-Webhook-Event-Id"
        canonicalStringFormat: "timestamp.method.path.bodySha256"
        versionTokenJsonPath: "$.metadata.version"     # CS4-04·CS5-01 — providerVersionToken 추출 path 필수
        versionTokenType: "epoch-ms"                    # CS5-01 — enum: epoch-ms·integer·string
crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"
      syncSchedule: { pollIntervalMinutes: 15, timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" } }
      entities:
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint: { path: "/api/crm-sync/webhook/{integrationId}", timestampToleranceSeconds: 300 }
      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
      credentialRotation: { warnDaysBeforeExpiry: 14, autoNotifyEnabled: true, rotationGracePeriodMinutes: 30 }
      rateLimit:
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii: { rawPiiStorageAllowed: false, displayHintsRetentionDays: 30, ssnRrnHandling: "deny", liveReadEnabled: false }
      operationalHintsRetentionDays: 365                # CS4-05 — operationalHints 보존 (privacy-sensitive)
      retentionDays:
        syncLog: 730; sourceAttempt: 730; changeLog: 1095; conflictRecord: 1095
        retryQueueCompleted: 30; notificationOutbox: 30; consentWithdrawalLedger: 1095
      webhookNonceLedgerRetentionMinutes: 360
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:                                       # CS4-01·CS5-02 — canonical hash 알고리즘
        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
        crmExternalIdHashPepperRef: "secretRef://CRM_EXT_ID_HASH_PEPPER"
        changeIdentityKeyPepperRef: "secretRef://CRM_CHANGE_IDENTITY_PEPPER"
        rrnFingerprintPepperRef: "secretRef://CRM_RRN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://..." }
```

#### 2.3.1 hash algorithm SoT (CS4-01)

| hash | 입력 | 알고리즘 | 산식 |
|---|---|---|---|
| `piiHash` | raw PII (이름·전화·이메일·생년월일 정규화 후 concat) | HMAC-SHA256 | `HMAC(piiHashPepperRef, normalize(name) + ":" + normalize(phone) + ":" + normalize(email) + ":" + birthDate_iso)`. 결과 char(64) hex |
| `crmExternalIdHash` | integrationId + crmExternalId | HMAC-SHA256 | `HMAC(crmExternalIdHashPepperRef, integrationId + ":" + crmExternalId)`. char(64) hex |
| `changeIdentityKey` | integrationId + entity + crmExternalId + providerVersionToken | HMAC-SHA256 | `HMAC(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)`. char(64) hex |
| `rrnFingerprint` | RRN normalized | HMAC-SHA256 | `HMAC(rrnFingerprintPepperRef, rrnNormalized)`. char(64) hex. UI에는 prefix 4 hex만 노출 |
| `credentialFingerprint` | integrationId + secretVersionId | HMAC-SHA256 | `HMAC(auditPepperSecretRef, integrationId + ":" + secretVersionId)`. char(64) hex. UI prefix 8 hex |
| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |

normalize 규칙:
- name: 공백 제거 + lowercase + Unicode NFKC
- phone: 숫자만 추출 (국가코드 +82 포함)
- email: lowercase + 도메인 IDNA-encoded
- birthDate: ISO 8601 YYYY-MM-DD

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command + mode matrix

| 종류 | 함수 | 책임 | 권한 | bi-directional | outbound-only |
|---|---|---|---|---|---|
| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
| 실행 | `processInboundWebhook` | webhook 수신 | system | 허용 | endpoint 미등록 (HTTP 404). direct invocation → runtime fail |
| 실행 | `pushOutbound(entity, recordId, operation): PushOutboundResult` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
| 실행 | `resolveConflict(input: ResolveConflictInput): ResolveConflictResult` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
| 실행 | `recoverRrnFalsePositive(input: RecoverRrnInput): RecoverRrnResult` | RRN 복구 | super-admin | 허용 | 허용 |
| 실행 | `applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` | 환자 동의 철회 | super-admin | 허용 | 허용 |
| 실행 | `resetCredentialRotation(input: ResetCredentialRotationInput): ResetCredentialRotationResult` (CS4-07) | reverted → stable 명시적 reset | super-admin | 허용 | 허용 |
| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |
| 운영 | `unregisterIntegration` | § 4.7 정책 | super-admin | 허용 | 허용 |
| 운영 | `rotateCredential` | rotation § 4.5 | super-admin | 허용 | 허용 |

### 3.1.1 audit log contract (7종 AuditAction)

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy·unregisterPolicySnapshot | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprintPrefix·newCredentialFingerprintPrefix·rotationAttemptId·resultState | super-admin |
| `crm-rrn-false-positive-recovered` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason | super-admin |
| `crm-rrn-rejection-finalized` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus="rejected-rrn-final"·actorRole·reason | super-admin |
| `crm-consent-withdrawal-applied` | `"crm-consent:" + withdrawalLedgerId` | scope·keyType·keyPrefix(0..8)·matchedRecordCount·tombstoneChangeLogIds·integrationId·dryRun·reason | super-admin |

### 3.2 v1.0 운영 이벤트 canonical schema

```ts
type ReservationSubmission = {
  submissionId: string;
  reservationPageRef: Ref<C-20>;
  ctaConfigRef?: Ref<CT-03>;
  source?: string; campaign?: string;
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "synced-failed";
  piiHash: string;                                       // § 2.3.1 알고리즘
  displayHints: ContactDisplayHints;
  operationalHints: ReservationOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;                            // crmExternalId 채워지면 동시에 산정
};

type Inquiry = {
  inquiryId: string; source?: string;
  inquiryType: "general" | "appointment-related" | "billing" | "other";
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "responded-on-crm";
  piiHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: InquiryOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;
};

type ConversionEvent = {                                 // outbound-only entity. PII 없음
  conversionEventId: string;
  eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
  occurredAt: Date;
  pageRef?: string;                                      // string ref
  attributionSource?: string;
};

type Contact = {
  contactId: string;
  crmExternalId: string;
  crmExternalIdHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: ContactOperationalHints;
  lastSyncedAt: Date;
  consentWithdrawn: boolean;
};
```

#### 3.2.1 ContactDisplayHints — closed schema 6 column

| 필드 | 타입 | DB CHECK (PostgreSQL) | application validator (canonical) |
|---|---|---|---|
| `nameInitial` | varchar(8) | `length ≤ 8 AND value ~ '^[가-힣A-Za-z]'` | 정규식 `^[\p{L}](O\*?)?$` |
| `phoneLast4` | char(4) | `value ~ '^[0-9]{4}$'` | 동일 |
| `emailDomain` | varchar(64) | `value ~ '^@[a-z0-9.-]+$'` | 동일 |
| `cityName` | varchar(32) | `length ≤ 32 AND value ~ '^[가-힣 ]+$'` | 행정구역 allowlist (CrmAdminRegionAllowlist v1.x — CS-19) |
| `genderHint` | enum(`male`·`female`·`other`·`unknown`) | enum constraint | enum |
| `ageBand` | enum(`teen`·`20s`·`30s`·`40s`·`50s`·`60+`·`unknown`) | enum constraint | enum |

DB CHECK는 PostgreSQL canonical. 타 DB 이식 시 dialect 재정의.

#### 3.2.2 operationalHints — privacy-sensitive metadata (CS4-05)

operationalHints는 raw PII 아니지만 **준식별자 결합 위험** (소규모 의료기관 환경 등):

| 필드 | 분류 | retention | 운영자 화면 접근 | export |
|---|---|---|---|---|
| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
| `inquiryType` | non-sensitive | 동일 | 동일 | 허용 |
| `channelType` | non-sensitive | 동일 | 동일 | 허용 |
| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
| `departmentHint` | **준식별자** (희소 진료과 결합 위험) | operationalHintsRetentionDays | 동일 | masking |
| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
| `relationToInstitution` | **준식별자** | operationalHintsRetentionDays | 동일 | masking |
| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |

**small-cell suppression** (CS4-05·CS5-05):

| 항목 | 정의 |
|---|---|
| threshold | 동일 cell 카운트 < 5 (k-anonymity 보수적 기준 — 개인정보보호법 §28-2 가명정보 처리 가이드라인 참조) |
| cell 정의 | `(locationKey, departmentHint, desiredVisitDate)` 조합 |
| 적용 범위 | (1) queryCrmRecords UI 렌더링, (2) CSV/JSON export, (3) 통계·분석 화면, (4) admin dashboard 집계 |
| 집계 window | 운영 정책: 최근 30일·90일·365일 동시 적용 (가장 작은 cell 기준으로 suppression) |
| drilldown 금지 | suppressed cell의 row-level drilldown 금지. drilldown 시 다른 cell 결합으로 재식별 가능 |
| complementary suppression | suppressed cell 합계가 노출되면 보완 마스킹 필수 — `total - suppressedCount`로 역추론 방지 |
| export 동일 적용 | export도 화면과 동일 룰. raw cell count 절대 export 금지 |
| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |

법무 근거:
- 개인정보보호법 §28-2 (가명정보 처리)
- 통계청 가이드라인: 통계조사 결과 작성 시 단위·세부 집계 cell 5 미만 보호
- 추후 별도 `docs/compliance/PRIVACY_COMMON.md` SoT 신설 시 본 절은 참조로 변경 (CS-23 신규 open)

**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
- displayHintsRetentionDays 만료: displayHints만 nulling
- operationalHintsRetentionDays 만료: 준식별자/민감 operationalHints nulling
- unregisterIntegration: § 4.7 표

**CRM 콘솔 raw 접근 (CS5-04 풀 전개)**:
- **SSO**: 의료기관·Glitzy 계정 분리. solution 운영자가 CRM 직접 접근하려면 별도 CRM SSO 필요. solution super-admin 권한 ≠ CRM admin 권한
- **role mapping**: CRM 측 권한은 의료기관 책임. Glitzy 솔루션은 권한 위임 안 함
- **deep link**: queryCrmRecords 결과의 `crmExternalId`로 CRM 콘솔 deep link 생성 가능. config `crmConsoleBaseUrl` v1.x (CS-20). v1.0은 link 미제공 — 운영자가 CRM 콘솔에서 별도 검색
- **audit 책임**: CRM 콘솔 접근은 CRM provider 측 audit log 책임 (Salesforce Login History·HubSpot Audit Trail 등). solution audit log는 CRM 콘솔 접근 추적 불가 — 본 문서 audit scope 외

### 3.3 Command DTO (CS4-10)

#### 3.3.1 `RunSyncInput`·`RunSyncResult`

```ts
type RunSyncInput = {
  instanceId: string;
  manifestVersion: string;
  direction: "inbound" | "outbound" | "both";  // outbound-only mode는 "outbound" 강제
  mode: "scheduled" | "on-demand";
  idempotencyKey: string;                       // UNIQUE per instance
  windowStart?: Date; windowEnd?: Date;
  forceRefresh?: boolean; refreshIntentId?: string;
};

type RunSyncResult = {
  syncLogId: string;
  envelopeState: "succeeded" | "partial" | "failed" | "retried";
  perEntity: Array<{
    entity: "reservation" | "contact" | "inquiry" | "conversion-event";
    direction: "inbound" | "outbound";
    result: SourceAttemptStatus;
    counts: { recordsInbound: number; recordsOutbound: number; conflictsDetected: number };
  }>;
};
```

#### 3.3.2 `PushOutboundResult`

```ts
type PushOutboundResult = {
  status: "pushed" | "queued-retry" | "blocked-rrn" | "blocked-consent-withdrawn" | "cas-conflict-detected";
  crmExternalId?: string;
  crmExternalIdHash?: string;
  conflictRecordId?: string;
};
```

#### 3.3.3 `ResolveConflictInput`·Result

```ts
type ResolveConflictInput = {
  conflictId: string;
  resolution: "crm-wins" | "solution-wins" | "manual-resolved" | "manual-rejected";
  resolvedBy: string;
  reason?: string;
  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
};

type ResolveConflictResult = {
  resolution: ResolveConflictInput["resolution"];
  appliedFieldVersion: number;
  winningVersion: number;
};
```

#### 3.3.4 `RecoverRrnInput`·Result

```ts
type RecoverRrnInput = {
  ledgerId: string;
  action: "override-and-fetch" | "abandon";
  reason: string;                               // ✅ 운영 감사용
  actorNote?: string;
  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
  dryRun?: boolean;
};

type RecoverRrnResult = {
  finalStatus: "accepted-processed" | "rejected-rrn-final";
  newCrmRecordId?: string;
  rrnFingerprintPrefix: string;                 // 4 hex
};
```

#### 3.3.5 `ApplyConsentWithdrawalInput`·Result (CS4-01·10 — discriminated)

```ts
type ApplyConsentWithdrawalInput =
  | {
      integrationId: string;
      keyType: "piiHash";
      piiHash: string;                          // § 2.3.1 알고리즘으로 산정. canonical 64 hex
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;                   // 중복 적용 방지
      dryRun?: boolean;
    }
  | {
      integrationId: string;
      keyType: "crmExternalId";
      crmExternalId: string;                    // raw — 내부에서 crmExternalIdHash로 변환
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;
      dryRun?: boolean;
    };

type ApplyConsentWithdrawalResult = {
  withdrawalLedgerId: string;
  keyType: "piiHash" | "crmExternalIdHash";     // canonical hash로 변환 후 저장됨
  keyHashPrefix: string;                        // 8 hex
  scope: "all" | "marketing-only";
  matchedRecordCount: number;
  tombstoneChangeLogIds: string[];
  displayHintsNulled: boolean;
  operationalHintsNulled: { /* 필드별 nulling 여부 */ };
  dryRun: boolean;
};
```

**경로별 매칭 키 (CS4-01)**:

| 경로 | 매칭 키 SoT |
|---|---|
| webhook inbound | rawBody에서 piiHash 산정 (provider별 PII field path는 adapter config) → CrmConsentWithdrawalLedger lookup |
| polling inbound | provider list API 응답에서 piiHash 산정. piiHash 산정 불가능한 record는 crmExternalIdHash로 lookup |
| outbound push | solution record의 piiHash와 crmExternalIdHash 둘 다 lookup |
| applyConsentWithdrawal | input.keyType discriminant |

#### 3.3.6 `ResetCredentialRotationInput`·Result (CS4-07)

```ts
type ResetCredentialRotationInput = {
  integrationId: string;
  revertedVersionId: string;                    // CredentialVersion.state="reverted" row
  reason: string;
  actorNote?: string;
  expectedIntegrationState: "reverted";         // CAS
};

type ResetCredentialRotationResult = {
  integrationState: "stable";
  revokedVersionId: string;                     // 이전 reverted row → state="revoked"
  rotationAttemptId: string;
};
```

audit `crm-credential-rotated` metadata `resultState="reset"` 추가.

### 3.4 webhook 처리

```ts
async function processInboundWebhook(
  integrationId: string,
  headers: Record<string,string>,
  rawBody: Buffer,
  fullUrl: string,
  method: string
): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
        | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
        | "rejected-consent-withdrawn" | "queued" | "deduped";
  recordsProcessed: number;
  conflicts: number;
  nonceLedgerStatus?: "new" | "duplicate-eventid" | "duplicate-eventid-bucket" | "duplicate-digest";
  changeIdentityStatus?: "new" | "duplicate";
}>;
```

#### 3.4.1 ProviderWebhookVerifier (CS5-04 풀 전개 + providerVersionToken required — CS4-04)

```ts
interface ProviderWebhookVerifier {
  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
}

type VerifierResult = {
  signatureValid: boolean;
  providerEventId: string | null;
  providerTimestamp: Date | null;
  canonicalDigest: string;
  deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
  retrySemantics: "provider-retries" | "no-retry";
  providerVersionToken: string;                 // CS4-04 — v1.0 required. null이면 build fail
  errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
};
```

#### 3.4.2 provider별 adapter contract

| Provider | payload | signature | timestamp | eventId | canonical | providerVersionToken | v1.0 |
|---|---|---|---|---|---|---|---|
| Salesforce Outbound Messages | XML SOAP | HMAC-SHA256(secret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` | XML `SystemModstamp` ISO8601 | ✅ |
| Salesforce Platform Events | JSON CometD | HMAC-SHA256 (orgId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 | `replayId` integer | ✅ |
| HubSpot | JSON | HMAC-SHA256(secret, `method + url + body + ts`) | `X-HubSpot-Request-Timestamp` | header/body `eventId` | provider 정의 | `propertyChange.versionTimestamp` 또는 `updatedAt` | ✅ |
| generic-rest-api | JSON | HMAC-SHA256(secret, canonicalString) | config | config | config | config `versionTokenJsonPath` (✅ — § 2.3) | ✅ |

#### 3.4.3 InboundProcessingContext — **discriminated union** (CS4-03)

```ts
type InboundProcessingContext = WebhookInboundContext | PollingInboundContext;

type WebhookInboundContext = {
  kind: "webhook";
  integrationId: string;
  verifierResult: VerifierResult;
  rawBody: Buffer;
  parsedPayload: ParsedCrmPayload;
  receivedAt: Date;
  nonceLedgerId: string;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

type PollingInboundContext = {
  kind: "polling";
  integrationId: string;
  pollRunId: string;
  providerCursor: string;                       // 이전 polling 종료점
  parsedPayload: ParsedCrmPayload;
  observedAt: Date;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
type NormalizedInboundChange = {
  entity: "reservation" | "contact" | "inquiry" | "conversion-event";
  crmExternalId: string;
  crmExternalIdHash: string;
  piiHash: string | null;                       // PII 없는 entity는 null
  providerVersionToken: string;
  expectedCrmVersion: number;                   // § 4.3.5 산정 규칙
  proposedDisplayHints: ContactDisplayHints | null;
  proposedOperationalHints: AnyOperationalHints | null;
  changedFieldTokens: string[];
};
```

webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.

### 3.4.4 ChangeIdentityKey (CS4-04 책임 분리)

- **CrmWebhookNonceLedger**: **transport-level dedupe** — webhook delivery 중복(provider retry·재전송). polling 미사용
- **CrmChangeIdentityLedger**: **record-level dedupe** — 같은 CRM 변경이 webhook과 polling 양쪽으로 들어와도 1번만 처리

```
changeIdentityKey = HMAC-SHA256(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)
```

providerVersionToken=null인 provider는 **v1.0 build fail** (CS4-04) — record-level dedupe 보장 불가능하므로 v1.0 운영 불가.

---

## 4. sync 파이프라인

### 4.1 outbound

```
1. pushOutbound(entity, recordId, operation)
2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
4. RRN 검사 — 검출 시 차단
5. **consent withdrawal lookup** — piiHash·crmExternalIdHash 모두 검사 → 매칭 시 PushOutboundResult.status="blocked-consent-withdrawn"
6. credential state 검사 (§ 4.5.3)
7. rate limit token
8. CRM API call (idempotency-key)
9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
   → 0 rows → ConflictRecord
10. CrmRecordChangeLog insert
```

### 4.2 inbound

```
[webhook 경로]
1. mode="outbound-only" → 404
2. ProviderWebhookVerifier.verify → VerifierResult (signatureValid=false → HTTP 401)
3. providerTimestamp 검증 → rejected-stale-timestamp
4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
   - exactly-once: `(integrationId, providerEventId)`
   - at-least-once + eventId: `(integrationId, providerEventId, receivedBucket)`
   - at-least-once no-eventId 또는 best-effort: `(integrationId, canonicalDigest, receivedBucket)`
   - 중복 → "duplicate-eventid" / "duplicate-eventid-bucket" / "duplicate-digest" → HTTP 200 deduped
5. RRN 검사 → rejected-rrn-recoverable / rejected-rrn-final
6. payload parsing → NormalizedInboundChange 생성
7. **consent withdrawal lookup** (piiHash·crmExternalIdHash) → 매칭 시 → status="rejected-consent-withdrawn"
8. closed-schema validator
9. **CrmChangeIdentityLedger insert** — UNIQUE(changeIdentityKey). 중복 → "duplicate" → HTTP 200 deduped (polling이 이미 처리)
10. CAS 갱신
11. NonceLedger status "accepted-processed"

[polling 경로]
1. 다음 page provider list API → parsed payload
2. consent withdrawal lookup
3. closed-schema validator
4. **CrmChangeIdentityLedger insert** — UNIQUE 충돌 시 skip (webhook이 이미 처리)
5. CAS 갱신
```

#### 4.2.1 RRN false positive 복구 (CS5-04 풀 전개)

`recoverRrnFalsePositive(input: RecoverRrnInput)` (§ 3.3.4):

```
1. ledger row 조회 — CrmWebhookNonceLedger.status="rejected-rrn-recoverable"만 허용
   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
   - 다른 status → runtime fail
2. action="override-and-fetch":
   a. CRM live pull — provider별 list API 또는 single-record API
      - lookup key: ledger row의 providerEventId 또는 last-known crmExternalId (있을 시)
   b. CRM에서 raw payload 재취득
   c. asset-ingestion § 9.1 RRN checksum 재실행
      - regex `\b\d{6}-?[1-8]\d{6}\b` 후보 추출
      - 생년월일·성별 코드 유효성 검사
      - checksum: 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + (11-(sum%11))%10 검증
   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
      - ledger status → "accepted-processed"
      - newCrmRecordId 채움
      - audit `crm-rrn-false-positive-recovered` metadata (priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason)
   e. 재검출 (RRN 진짜) → ledger status → "rejected-rrn-final"
      - audit `crm-rrn-rejection-finalized`
3. action="abandon":
   - ledger status → "rejected-rrn-final"
   - audit `crm-rrn-rejection-finalized` metadata (priorStatus·finalStatus·actorRole·reason)
4. input.dryRun=true → 1·2c까지만 수행. ledger·CrmRecord 미변경. RecoverRrnResult.finalStatus는 예상값만 반환
5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
```

### 4.3 field-level 충돌 해결 + CAS

#### 4.3.1 FieldAuthority

```ts
type FieldAuthority =
  | "crm-authoritative"
  | "solution-authoritative"
  | "last-write-wins-timestamp"
  | "last-write-wins-version";
```

#### 4.3.2 CAS SQL

```sql
-- inbound
UPDATE crm_record
SET display_hints_name_initial=$1, /* ... */,
    operational_hints_department_hint=$N, /* ... */,
    crm_version=$newCrmVersion, last_synced_at=$now
WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSolutionVersion;

-- outbound
UPDATE crm_record
SET solution_version=solution_version+1, crm_external_id=$crmId, crm_external_id_hash=$crmIdHash, last_synced_at=$now
WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expectedCrmVersion;
```

0 rows → ConflictRecord 생성.

#### 4.3.3 ConflictRecord (field-level)

| 필드 | 의미 |
|---|---|
| `fieldPath` | "displayHints.phoneLast4" 등 |
| `baseVersion` | 충돌 직전 record-level |
| `winningVersion` | resolve 시 적용 |
| `appliedFieldVersion` | 동일 fieldPath·동일 이하 재충돌 차단 |
| `winningSide` | "crm" \| "solution" \| "manual" |

#### 4.3.4 manual escalate 결정표

| 조건 | escalate? |
|---|---|
| FieldAuthority=last-write-wins-timestamp + timestamp 차이 ≤ 5s + version tie | ✅ |
| FieldAuthority=last-write-wins-version + version tie | ✅ |
| FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
| 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 | ✅ |
| FieldAuthority=crm/solution-authoritative | ❌ |

#### 4.3.5 expectedCrmVersion 산정

| provider | providerVersionToken | expectedCrmVersion |
|---|---|---|
| Salesforce Outbound Messages | `SystemModstamp` ISO | epoch ms |
| Salesforce Platform Events | `replayId` | 직접 사용 |
| HubSpot | `versionTimestamp` 또는 `updatedAt` | epoch ms |
| generic-rest-api | config path 추출 | epoch ms 또는 integer (config type) |
| polling | list API `lastModified` 등 | epoch ms |

### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)

### 4.5 credential rotation (CS4-02·07)

#### 4.5.1 CrmCredentialVersion entity — § 13.11

#### 4.5.2 두 enum invariant 표

**CrmIntegration.credentialState** 5상태. **CrmCredentialVersion.state** 6상태.

| Integration state | CredentialVersion rows | 의미 |
|---|---|---|
| stable | 1 row `state=active` (others `revoked`) | 정상 |
| rotating | 1 `active`(이전) + 1 `rotating-target`(신규) | rotation 진행. outbound new 우선·old fallback. inbound active + rotating-target 병행 |
| committed | 1 `committed`(이전·graceUntil) + 1 `active`(신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil) |
| grace-expired | 1 `active`(신규) (others `revoked`/`grace-expired`) | committed graceUntil 도래. outbound/inbound active만 |
| reverted | 1 `active`(원래) + 1 `reverted`(신규 실패) | rotation 실패 |

#### 4.5.3 outbound/inbound 사용 matrix

| Integration state | outbound 사용 | inbound verifier 허용 |
|---|---|---|
| stable | active | active만 |
| rotating | rotating-target 우선·active fallback | active + rotating-target 병행 |
| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
| grace-expired | active(신규) only | active만 |
| reverted | active(원래) | active만 |

#### 4.5.4 rotateCredential — DB-level concurrency 강제 (CS4-02)

```sql
BEGIN;
-- 1. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integrationId FOR UPDATE;
-- 2. 현재 state 확인 (stable만 허용 — CAS)
-- 3. 새 CredentialVersion insert (state='rotating-target')
INSERT INTO crm_credential_version (id, integration_id, secret_ref, secret_version_id, state, activated_at, ...) VALUES (...);
-- 4. integration state → 'rotating'
UPDATE crm_integration SET credential_state='rotating' WHERE id=$integrationId AND credential_state='stable';
-- 5 rows affected 검증 (CAS)
COMMIT;
```

**DB partial unique 강제** (§ 13.11):
- `UNIQUE(integration_id) WHERE state='active'` — active row 1개만
- `UNIQUE(integration_id) WHERE state='rotating-target'` — rotating-target 1개만
- `UNIQUE(integration_id) WHERE state='committed'` — committed 1개만

→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.

health check 결과 처리:
- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
- 실패 → BEGIN; SELECT FOR UPDATE → 신규 rotating-target → reverted → integration state 'reverted'; COMMIT;

#### 4.5.5 resetCredentialRotation (CS4-07)

§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
- reverted CredentialVersion row → state="revoked"
- integration credentialState → "stable"
- audit `crm-credential-rotated` metadata `resultState="reset"·rotationAttemptId·reason`

#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)

cadence: 10분. 매 cycle:

```sql
-- 1. committed credential version (graceUntil 도래) 조회
SELECT integration_id, id AS committed_version_id, grace_until
FROM crm_credential_version
WHERE state='committed' AND grace_until <= now()
FOR UPDATE SKIP LOCKED
LIMIT $batch;

-- 2. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integration_id FOR UPDATE;

-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
UPDATE crm_credential_version SET state='grace-expired', revoked_at=now()
WHERE id=$committed_version_id;

-- 4. integration credentialState → 'grace-expired' (단일 transaction)
UPDATE crm_integration SET credential_state='grace-expired'
WHERE id=$integration_id AND credential_state='committed';

-- 5. audit CrmCredentialAuditLog event='grace-expired' insert

COMMIT;

-- 후속 (별도 cycle): 운영자 검토 후 또는 일정 지연 후 grace-expired → revoked로 정리
-- v1.0은 grace-expired에서 운영자 개입 없이 정리할지 별도 정책 (CS-22 신규 open)
```

실패 시: sink alert + 다음 cycle 재시도. 3회 실패 → super-admin alert + integration manual review 큐.

**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.

### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개

```sql
-- claim
WITH next AS (
  SELECT id FROM crm_sync_notification_outbox
  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;

-- transient fail
UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;

-- exhausted
UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
```

### 4.7 unregister 정책 표 (CS4-06 precedence 추가)

`unregisterIntegration(integrationId, options)`:

**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.

| 대상 | 즉시 액션 | 보존 | legalHold default | FK ON DELETE |
|---|---|---|---|---|
| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
| CrmRecord.displayHints* | nulling (option `keepDisplayHints=false` 기본) | row 유지 | false | — |
| CrmRecord.operationalHints* | non-sensitive 유지·sensitive nulling (§ 3.2.2) | row 유지 | false | — |
| CrmRecordChangeLog | row 유지 (audit) | retentionDays.changeLog | false (tombstone는 true) | RESTRICT |
| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecord | false | RESTRICT |
| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | false | RESTRICT |
| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notificationOutbox | false | RESTRICT |
| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | false | RESTRICT |
| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog | false | RESTRICT |
| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
| webhook endpoint | 미등록 (HTTP 404) | — | — | — |
| inbound polling | 중단 | — | — | — |

audit `crm-integration-unregistered` metadata `unregisterPolicySnapshot` (options) 포함.

`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).

### 4.8 consent withdrawal (CS4-01 강화)

`applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` (§ 3.3.5):

```
1. input.keyType discriminant 확인. piiHash → § 2.3.1 canonical algorithm. crmExternalId → crmExternalIdHash로 변환
2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
3. `(integrationId, idempotencyKey)` lookup:
   - **존재 + requestFingerprint 일치** → same-request replay → 기존 ledger 결과 반환 (no-op)
   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
   - **미존재** → 다음 단계
4. dryRun=true → matchedRecordCount만 산정·반환. DB 미변경 (ledger 미insert)
5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
6. CrmRecord(s) 매칭 (keyType별):
   - piiHash: WHERE pii_hash = $piiHash
   - crmExternalIdHash: WHERE crm_external_id_hash = $crmExternalIdHash
7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
8. scope="marketing-only": displayHints nulling만
9. 향후 inbound — § 4.2 step 7에서 piiHash·crmExternalIdHash 둘 다 lookup → rejected-consent-withdrawn
10. 향후 outbound — § 4.1 step 5에서 둘 다 lookup → blocked-consent-withdrawn
11. audit `crm-consent-withdrawal-applied`
```

v1.x에서 patientConsentEvidenceRef 도입 시 record-level evidence 연결 (CS-07).

---

## 5. provider 어댑터 (v1.0 — 3종)

§ 3.4.2 contract. korean-emr v1.x (CS-13).

### 5.1 rate limit (CrmRateLimitState — § 13.10)

---

## 6. 알림

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | critical | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox — § 4.6 SQL

### 6.3 매핑

| eventType | sourceKind | sourceId | contentRef |
|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` |
| `crm-sync-credential-expired` | `credential-version` | `integrationId:credentialVersionId` | `"crm-integration:" + integrationId` |
| `crm-sync-credential-expiring-soon` | `credential-version` | 동일 | 동일 |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`.

---

## 7. PII 처리 (CS4-05 강화)

### 7.1 closed schema + privacy-sensitive operational hints

- displayHints: 6 column closed schema (§ 3.2.1)
- operationalHints: entity별 column + privacy classification 표 (§ 3.2.2)
- changedFields/snapshot: allowlisted field token + masked value/enum
- DB CHECK + application validator 양층

### 7.2 RRN deny (CS5-04 풀 전개)

- `pii.ssnRrnHandling="deny"` 강제 — build fail if other value (§ 10.1)
- RRN 검사 알고리즘 (asset-ingestion § 9.1 재사용 — 본 문서 stand-alone 위해 알고리즘 명시):
  1. 후보 추출 정규식: `\b\d{6}-?[1-8]\d{6}\b`
  2. 생년월일·성별 코드 유효성 검사 (6자리 YYMMDD + 7번째 자리 1-8)
  3. checksum: 가중치 `[2,3,4,5,6,7,8,9,2,3,4,5]` × 각 자리 합 → `(11-(sum%11))%10`이 마지막 자리와 일치
- 검출 시 (inbound webhook·polling):
  - payload 폐기. CrmRecord 미생성·미갱신
  - CrmWebhookNonceLedger row 보존 + rrnFingerprint (§ 2.3.1) + status="rejected-rrn-recoverable" 또는 "rejected-rrn-final"
  - 운영자 alert + sink alert
- 검출 시 (outbound push):
  - push 차단. solution record는 그대로 유지
  - 운영자 alert + sink alert
- false positive 복구: § 4.2.1 `recoverRrnFalsePositive`

### 7.3 raw PII 실시간 조회 — v1.x (CS-14)

### 7.4 DPA vs patient consent

- DPA: `dpaEvidenceRef` 필수
- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger
- patientConsentEvidenceRef record-level: v1.x (CS-07)

### 7.5 displayHints expiry + operationalHints expiry (CS4-05)

precedence: legalHold > unregister > expiry > consent withdrawal.

- displayHintsRetentionDays 만료 → displayHints 6 column nulling. ChangeLog tombstone
- operationalHintsRetentionDays 만료 → 준식별자/민감 operationalHints nulling. non-sensitive 유지
- legalHold=true row는 skip

---

## 8. 운영 지표 + acceptance test (CS4-09 — invariant 별 fixture 재편)

### 8.1 핵심 지표 (§ 8.1)

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | > 99% | |
| outbound push 지연 p95 | < 5s | |
| inbound webhook 지연 p95 | < 10s | |
| 충돌 발생율 | < 1% | |
| credential 만료 알림 SLA | 7일 | > 95% |
| RRN deny | baseline | |
| RRN false positive 복구 SLA | 24h | > 90% |
| webhook signature reject율 | < 0.1% | |
| nonce ledger dedupe | baseline | |
| changeIdentity ledger dedupe | baseline | |
| outbox 성공율 | > 99% | |
| CAS lost-update 감지율 | baseline | |
| operationalHints small-cell suppression 적중률 | baseline | |
| consent withdrawal 적용 누계 | baseline | |

### 8.2 acceptance test (CS4-09 — invariant 별 fixture)

invariant 별 fixture 구조 (개수보다 invariant coverage):

#### INV-MANIFEST (build-time)
- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)

#### INV-WEBHOOK-DEDUPE (transport-level)
- provider별 valid/invalid signature·rawBody integrity
- timestamp window
- exactly-once 재전송 → duplicate-eventid
- at-least-once + eventId 재전송 → duplicate-eventid-bucket (same bucket)
- at-least-once + eventId 다른 bucket → 정상 처리
- at-least-once + no-eventId → duplicate-digest
- best-effort → duplicate-digest

#### INV-CHANGE-IDENTITY (record-level)
- webhook + polling 동일 변경 → CrmChangeIdentityLedger UNIQUE → 1번만 처리
- 동시 webhook×2 → CrmWebhookNonceLedger 1차로 차단

#### INV-RRN
- regex + checksum 통과 RRN → 폐기 + ledger recoverable
- recoverRrnFalsePositive(override-and-fetch) → accepted-processed
- recoverRrnFalsePositive(abandon) → rejected-rrn-final
- invalid expectedPriorStatus → runtime fail
- dryRun → DB 미변경

#### INV-OUTBOUND-ONLY
- processInboundWebhook direct → runtime fail
- runSync direction=inbound → runtime fail
- webhook endpoint → 404
- CrmFieldMapping direction=inbound → build fail

#### INV-RETRY
- maxAttempts 도달 → exhausted + sink alert
- permanent error class → failed-permanent 즉시
- stale processing (locked_at > 10분) → pending 복귀

#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
- stable → rotating → committed (성공)
- stable → rotating → reverted (실패)
- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
- committed → grace-expired (worker)
- grace-expired worker 3회 실패 → super-admin alert
- reverted + resetCredentialRotation → stable (CS4-07)
- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
- rotating 중 outbound + inbound 동시 → 모두 성공 (active·rotating-target 병행 verifier)

#### INV-CAS
- 동시 inbound + outbound 같은 record → 1 성공 + 1 ConflictRecord
- field-level manual resolve 후 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 차단
- providerVersionToken=null → build fail (사전 차단)

#### INV-PII (closed schema)
- 자유 JSON insert → DB CHECK reject
- 정규식 위반 insert → validator reject
- ContactDisplayHints 6 column 외 필드 추가 시도 → 거부
- changedFields allowlist 위반 → 거부

#### INV-OPERATIONAL-HINTS (CS4-05)
- desiredVisitDate + locationKey + departmentHint 결합 small-cell (<5) → masking
- export 시 desiredVisitDate·guardianInvolved 제거
- queryCrmRecords 권한 검사 — operator는 sensitive operationalHints 미반환

#### INV-CONSENT-WITHDRAWAL (CS4-01)
- applyConsentWithdrawal(keyType=piiHash) → matched record displayHints nulling
- applyConsentWithdrawal(keyType=crmExternalId) → crmExternalIdHash로 변환 + matching
- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
- scope=marketing-only → displayHints nulling만
- dryRun → matchedRecordCount만 반환
- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
- 향후 inbound webhook 매칭 → rejected-consent-withdrawn
- 향후 polling 매칭 → skip
- 향후 outbound push 매칭 → blocked-consent-withdrawn

#### INV-UNREGISTER (CS4-06 precedence)
- displayHints nulling·queue cancel·ledger 보존
- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
- legalHold > unregister snapshot > retention purge

#### INV-PURGE
- retentionDays.changeLog → delete
- retentionDays.syncLog → delete
- retentionDays.conflictRecord → delete (non-open만)
- retentionDays.notificationOutbox → delete (sent·permanent만)
- webhookNonceLedgerRetentionMinutes → delete
- retentionDays.consentWithdrawalLedger + legalHold=false → delete
- legalHold=true → skip
- displayHintsRetentionDays → nulling
- operationalHintsRetentionDays → 준식별자/민감 nulling
- failure → sink alert + 다음 cycle 재시도

#### INV-MIGRATION (CS4-09)
- v0.4 → v0.5 운영 데이터 부재 전제. existing row 0건 cycle
- 만약 운영 데이터 발생 후 column 추가 — backward-compatible (nullable default)

#### INV-CASCADE
- 7종 AuditAction insert 성공
- 4종 NotificationEventType emit 성공
- DATA_MODEL C-08 v0.20 `genericRestApiAdapter` 5필드 + `versionTokenType` cascade 동기화 build validator
- DATA_MODEL C-08 v0.20 `versionTokenJsonPath` 누락 → build fail (CS5-01)

### 8.3 § 10 rule → § 8.2 fixture traceability 표 (CS5-06)

§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:

| § 10 rule (build/runtime/invariant) | INV fixture group |
|---|---|
| § 10.1 legalApproved=false | INV-MANIFEST |
| § 10.1 korean-emr provider | INV-MANIFEST |
| § 10.1 appointment enabled | INV-MANIFEST |
| § 10.1 rawPiiStorageAllowed=true | INV-MANIFEST |
| § 10.1 ssnRrnHandling≠deny | INV-MANIFEST |
| § 10.1 dpaEvidenceRef 누락 | INV-MANIFEST |
| § 10.1 outbound-only + 부정합 conflictResolution | INV-MANIFEST + INV-OUTBOUND-ONLY |
| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
| § 10.1 providerVersionToken=null provider | INV-MANIFEST + INV-CHANGE-IDENTITY |
| § 10.1 liveReadEnabled=true | INV-MANIFEST |
| § 10.1 fieldMappingPolicyVersion 누락 | INV-MANIFEST |
| § 10.1 hashSecrets.* 5종 누락 | INV-MANIFEST |
| § 10.2 webhook signature 실패 | INV-WEBHOOK-DEDUPE |
| § 10.2 replay window 초과 | INV-WEBHOOK-DEDUPE |
| § 10.2 inbound RRN 검출 | INV-RRN |
| § 10.2 outbound RRN 검출 | INV-RRN |
| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
| § 10.2 outbound-only direct invocation | INV-OUTBOUND-ONLY |
| § 10.2 CAS WHERE 0 rows | INV-CAS |
| § 10.2 displayHints closed schema 위반 | INV-PII |
| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
| § 10.2 rotateCredential row LOCK state≠stable | INV-CREDENTIAL-ROTATION |
| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
| § 10.3 v0.6 migration | INV-MIGRATION |
| § 10.4 RetryQueue stale reclaim | INV-RETRY |
| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
| § 10.4 credential expiry 임박/만료 | INV-CREDENTIAL-ROTATION |
| § 10.4 PII drift 감지 | INV-PII |
| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
| § 10.4 NonceLedger RRN recoverable 24h 무처리 | INV-RRN |
| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |

이 표가 v1.0 안정판의 회귀 방지 traceability matrix.

---

## 9. 설치·설정 — DB 15 tables 마이그레이션 (§ 13)

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig`/`integrations[]` 빈
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- integration `dpaEvidenceRef` 누락
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional + `webhookSecret` 누락
- integration `provider` ∉ {salesforce, hubspot, generic-rest-api}
- `provider="generic-rest-api"` + `genericRestApiAdapter` **5필드** 중 누락 (`webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`) — DATA_MODEL C-08 v0.20 SoT
- `provider="generic-rest-api"` + `versionTokenType` ∉ {`epoch-ms`, `integer`, `string`} (CS5-01)
- `requiresFeature: notifications` 충족 안 됨
- `pii.rawPiiStorageAllowed=true`
- `pii.ssnRrnHandling !== "deny"`
- `pii.liveReadEnabled=true`
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true`
- outbound-only mode + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"`
- outbound-only mode + CrmFieldMapping `direction IN (inbound, both)` 존재
- `fieldMappingPolicyVersion` 누락
- `retentionDays.consentWithdrawalLedger`·`operationalHintsRetentionDays`·`purgeWorker.cadenceMinutes` 누락
- `hashSecrets.*` 4개 중 누락
- **provider VerifierResult `providerVersionToken=null` 정의** (v1.0 build validator가 adapter 등록 시점에 검사 — CS4-04)

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 실패 → HTTP 401
- replay window 초과 → rejected-stale-timestamp
- credential 만료 후 sync 시도 → skipped-credential-expired
- inbound RRN 검출 → 폐기 + sink alert + ledger
- outbound RRN 검출 → 차단 + alert
- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
- outbound-only + processInboundWebhook direct → runtime fail
- outbound-only + runSync inbound/both → runtime fail
- CAS WHERE 0 rows → ConflictRecord + alert
- displayHints closed schema 위반 → DB CHECK reject + validator alert
- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
- `rotateCredential` 시 integration row LOCK 후 state ≠ stable → runtime fail (이미 rotating 중)
- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)

### 10.3 migration-time validation

- v0.5 cascade 신규:
  - CrmRecord에 operationalHints* column 추가 (nullable)
  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
  - CrmChangeIdentityLedger UNIQUE + FK + ON DELETE 정책 (CS4-08)
  - hashSecrets 4종 manifest 누락 시 build fail
- 운영 데이터 부재 전제. 만약 row 존재 시 nullable default로 backward-compatible

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale (locked_at > 10분) → pending 복귀
- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 알림
- credential expiry 임박 → expiring-soon
- credential 만료 → expired + integration 자동 비활성화
- PII drift 감지 → sink alert + 운영자 정리
- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert
- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
- **purge worker (CS4-06 precedence)**:
  - 우선순위: legalHold > unregister snapshot > retention purge
  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)
  - batch: `purgeWorker.batchSize` (기본 500)
  - 테이블별 액션:
    | 테이블 | action | legal hold default |
    |---|---|---|
    | CrmSyncLog | delete | × |
    | CrmSyncSourceAttempt | delete | × |
    | CrmSyncRetryQueue (status=completed) | delete | × |
    | CrmRecordChangeLog | delete (tombstone 예외) | × (tombstone는 true) |
    | CrmConflictRecord (non-open) | delete | × |
    | CrmCredentialAuditLog | 7년 (audit) | true |
    | CrmWebhookNonceLedger | delete | × |
    | CrmChangeIdentityLedger | delete | × |
    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
    | CrmRecord.displayHints* | nulling | × |
    | CrmRecord.operationalHints* (sensitive) | nulling at operationalHintsRetentionDays | × |
    | CrmSyncNotificationOutbox (sent·permanent) | delete | × |
  - failure → sink alert + 다음 cycle 재시도

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60
- conflict open ≥ 5건 누적
- ledger `duplicate-digest` 비율 > 5%
- outbound-only + webhookSecret 설정됨
- operationalHints small-cell suppression 적중률 > 10%

---

## 11. 미결정 사항

### 11.1 open

| ID | 항목 |
|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 |
| CS-03 | 다중 CRM 통합 우선순위 |
| CS-04 | webhook endpoint 보안 (IP allowlist) |
| CS-05 | OAuth refresh token rotation 자동화 |
| CS-06 | provider별 quota 운영 가이드 |
| CS-08 | LLM 기반 field auto-mapping |
| CS-09 | CrmFieldMapping bulk import/export |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 |
| CS-15 | CONTENT_STANDARDS submission/event cascade — v1.0은 § 3.2 canonical |
| CS-18 | `@provenanceCrmRecordId` 공통 메타 |
| CS-19 | CrmAdminRegionAllowlist 행정구역 lookup table |
| CS-20 | `crmConsoleBaseUrl` config + deep link |
| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
| CS-22 | grace-expired → revoked 자동 정리 정책 (CS5-03) — v1.0은 grace-expired row 보존 |
| CS-23 | `docs/compliance/PRIVACY_COMMON.md` SoT 신설 (CS5-05) — 의료광고 외 일반 privacy 가이드 |

### 11.2 deferred-v1.x

| ID | 항목 | v1.0 영향 |
|---|---|---|
| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + ConsentWithdrawalLedger 최소 범위 |
| CS-11 | CRM → Core 자동 promote | 수동 |
| CS-12 | appointment entity | build fail로 차단 |
| CS-13 | korean-emr provider | build fail로 차단 |
| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |

### 11.3 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CS-01~~ | RRN deny — v0.2 + checksum 재사용 |
| ~~CS-14 v1.0 cascade~~ | liveRead v1.x로 내림 |

### 11.4 known limitations (CS4-09)

- providerVersionToken=null provider는 v1.0 build fail (CS4-04) — record-level dedupe 보장 불가능
- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 21 지적 반영 |
| 2026-05-14 | v0.3 | codex 2차 17 지적 반영 |
| 2026-05-14 | v0.4 | codex 3차 17 지적 반영 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-14 | v0.5 | codex 4차 비평 13 지적 전건 수용 + stand-alone SoT 강화 |
| 2026-05-14 | v0.6 | codex 5차 비평 6 지적 전건 수용 |
| 2026-05-14 | v0.7 | codex 6차 비평 1 지적 정정 (CS6-01) |
| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables**)

### 13.1 `CrmIntegration`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationKey` | string | ✅ |
| `provider` | enum (salesforce·hubspot·generic-rest-api) | ✅ |
| `apiKeySecretRef` | secretRef | ✅ |
| `apiUrl` | string | ✅ |
| `webhookSecret` | secretRef | optional |
| `credentialExpiresAt` | Date | optional |
| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
| `dpaEvidenceRef` | secretRef | ✅ |
| `genericRestApiAdapter` | JSON | optional (provider=generic-rest-api 시 ✅) |
| `mode` | enum (bi-directional·outbound-only) | ✅ |
| `active` | boolean | ✅ |
| `createdAt`·`updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.

### 13.2 `CrmSyncLog`

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
| `startedAt`·`completedAt` | Date | ✅·optional |
| `envelopeState` | enum (running·succeeded·partial·failed·retried) | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.

### 13.3 `CrmSyncSourceAttempt`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error`·`errorClass` | string·enum | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`.
**Index**: `(expiresAt)`, `(integrationId, status)`.

### 13.4 `CrmSyncRetryQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber`·`maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum | optional |
| `payloadSnapshot` | JSON (closed-schema field tokens만) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
**Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.

#### 13.4.1 worker SoT 풀 SQL (search-visibility § 13.5 패턴 9단계)

```sql
-- 1. claim (FOR UPDATE SKIP LOCKED)
WITH next AS (
  SELECT id FROM crm_sync_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempt_number=attempt_number+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- 2. per-integration advisory lock
SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));

-- 3. SourceAttempt insert (transaction 내)
INSERT INTO crm_sync_source_attempt (sync_log_id, integration_id, entity, direction, attempt_number, status, started_at, expires_at)
VALUES ($sl, $int, $ent, $dir, $att, 'processing', now(), now() + $retention);
-- UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber) — 중복 시 race detected

-- 4. provider call (long-running — transaction 밖)

-- 5. SourceAttempt finalize
UPDATE crm_sync_source_attempt SET status=$status, completed_at=now(), error=$err, error_class=$ec, records_inbound=$ri, records_outbound=$ro, conflicts_detected=$cd
WHERE sync_log_id=$sl AND integration_id=$int AND entity=$ent AND direction=$dir AND attempt_number=$att;

-- 6. envelopeState 재계산
WITH agg AS (
  SELECT bool_and(status='success') AS all_success,
         bool_or(status IN ('failed-permanent','failed-credential','failed-quota')) AS any_failed,
         bool_or(status='in-retry-queue') AS any_retry
  FROM crm_sync_source_attempt WHERE sync_log_id=$sl
)
UPDATE crm_sync_log SET envelope_state=CASE
  WHEN (SELECT all_success FROM agg) THEN 'succeeded'
  WHEN (SELECT any_retry FROM agg) THEN 'retried'
  WHEN (SELECT any_failed FROM agg) THEN 'failed'
  ELSE 'partial' END, completed_at=now()
WHERE id=$sl;

-- 7. queue 완료/재등록
UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;

-- 8. stale reclaim (별도 worker — cadence 1분)
UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';

-- 9. exhausted/permanent
UPDATE crm_sync_retry_queue SET status='exhausted'
WHERE id=$id AND attempt_number >= max_attempts;
UPDATE crm_sync_retry_queue SET status='failed-permanent'
WHERE id=$id AND last_error_class='permanent';
-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
```

advisory lock ordering: integration → record.

### 13.5 `CrmRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `crmExternalId` | string | optional |
| `crmExternalIdHash` | char(64) | optional — § 2.3.1 |
| `solutionRecordRef` | string | optional |
| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
| `lastAppliedConflictVersion` | integer | optional |
| `lastSyncedAt` | Date | ✅ |
| `piiHash` | char(64) | optional |
| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
| `displayHintsCityName` | varchar(32) | optional — CHECK |
| `displayHintsGenderHint` | enum | optional |
| `displayHintsAgeBand` | enum | optional |
| `operationalHintsEntityStatus` | varchar(32) | optional |
| `operationalHintsInquiryType` | varchar(32) | optional |
| `operationalHintsChannelType` | varchar(32) | optional |
| `operationalHintsLocationKey` | varchar(32) | optional |
| `operationalHintsDepartmentHint` | varchar(32) | optional |
| `operationalHintsDesiredVisitDate` | Date | optional |
| `operationalHintsGuardianInvolved` | boolean | optional |
| `operationalHintsRelationToInstitution` | varchar(32) | optional |
| `operationalHintsPreferredChannelType` | varchar(32) | optional |
| `consentWithdrawn` | boolean | ✅ default false |
| `piiRetentionExpiresAt` | Date | optional |
| `operationalHintsRetentionExpiresAt` | Date | optional |

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
**CHECK**: PostgreSQL canonical 정규식 (§ 3.2.1).
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.

### 13.6 `CrmRecordChangeLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `direction` | enum | ✅ |
| `changedFields` | JSON (allowlisted token + masked value) | ✅ |
| `priorSnapshot`·`newSnapshot` | JSON (동일 제약) | optional |
| `tombstone` | boolean | ✅ default false |
| `appliedAt`·`appliedBy` | Date·string | ✅ |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`, `(tombstone) WHERE tombstone=true`.

### 13.7 `CrmFieldMapping`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `entity` | enum | ✅ |
| `solutionFieldPath`·`crmFieldPath` | string | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `authority` | FieldAuthority | ✅ |
| `transformerRef` | string | optional |
| `policyVersion` | string | ✅ |
| `active` | boolean | ✅ |

**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.

build-time: instance mode="outbound-only" + 본 테이블 `direction IN (inbound, both)` 존재 → build fail.

### 13.8 `CrmConflictRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `fieldPath` | string | ✅ |
| `baseVersion` | integer | ✅ |
| `observedCrmVersion`·`observedSolutionVersion` | integer | ✅ |
| `crmProposedValue`·`solutionProposedValue` | masked field token + value | ✅ |
| `resolution` | enum (open·crm-wins·solution-wins·manual-resolved·manual-rejected) | ✅ |
| `winningVersion`·`appliedFieldVersion` | integer | optional |
| `resolvedBy`·`resolvedAt` | string·Date | optional |
| `slaDeadline` | Date | ✅ — open 기준 7일 |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.

### 13.9 `CrmCredentialAuditLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon·reset) | ✅ |
| `rotationAttemptId` | UUID | optional |
| `priorCredentialFingerprintPrefix`·`newCredentialFingerprintPrefix` | char(16) | optional |
| `actor` | string | ✅ |
| `occurredAt` | Date | ✅ |

**Index**: `(integrationId, occurredAt DESC)`.

### 13.10 `CrmRateLimitState`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `secretRef` | secretRef | ✅ |
| `secretVersionId` | string | ✅ |
| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
| `credentialFingerprint` | char(64) | ✅ |
| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
| `activatedAt` | Date | ✅ |
| `graceUntil` | Date | optional |
| `revokedAt` | Date | optional |
| `expiresAt` | Date | optional |
| `rotationAttemptId` | UUID | optional |

**Constraints (CS4-02 강제)**:
- `UNIQUE(integrationId, secretVersionId)`
- `UNIQUE(integrationId) WHERE state='active'` — partial unique
- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
- `UNIQUE(integrationId) WHERE state='committed'` — partial unique

→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.

**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.

### 13.12 `CrmWebhookNonceLedger` — **transport-level dedupe (CS4-04)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `providerEventId` | string | optional |
| `canonicalDigest` | char(64) | ✅ |
| `receivedBucket` | bigint | ✅ |
| `signatureDigest` | char(64) | ✅ |
| `deliveryKind` | enum | ✅ |
| `receivedAt` | Date | ✅ |
| `status` | enum (accepted-pending·accepted-processed·rejected-rrn-recoverable·rejected-rrn-final·rejected-parse-recoverable) | ✅ |
| `rrnFingerprint` | char(64) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliveryKind='exactly-once'`
- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT NULL AND deliveryKind='at-least-once'`
- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL OR deliveryKind='best-effort'`

**Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.

### 13.13 `CrmChangeIdentityLedger` — **record-level dedupe (CS4-04·08)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `entity` | enum | ✅ |
| `crmExternalId` | string | ✅ |
| `providerVersionToken` | string | ✅ — v1.0 required (CS4-04) |
| `changeIdentityKey` | char(64) | ✅ |
| `source` | enum (webhook·polling) | ✅ |
| `receivedAt` | Date | ✅ |
| `processedSyncLogId` | UUID | optional — FK § 13.2 ON DELETE SET NULL (CS4-08) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId ON DELETE RESTRICT`. `FK processedSyncLogId → crm_sync_log.id ON DELETE SET NULL`.
**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.

### 13.14 `CrmConsentWithdrawalLedger` (CS4-01·08)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `keyType` | enum (`piiHash`·`crmExternalIdHash`) | ✅ |
| `piiHash` | char(64) | optional |
| `crmExternalIdHash` | char(64) | optional |
| `scope` | enum (`all`·`marketing-only`) | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
| `appliedBy` | string | ✅ |
| `appliedAt` | Date | ✅ |
| `displayHintsNulled` | boolean | ✅ |
| `operationalHintsNulledMap` | JSON (field별 boolean) | ✅ |
| `tombstoneChangeLogIds` | UUID[] | ✅ |
| `matchedRecordCount` | integer | ✅ |
| `dryRun` | boolean | ✅ |
| `reason` | string | ✅ |
| `legalHold` | boolean | ✅ default true (CS4-06) |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints (CS4-08)**:
- `CHECK ((key_type='piiHash' AND pii_hash IS NOT NULL AND crm_external_id_hash IS NULL) OR (key_type='crmExternalIdHash' AND crm_external_id_hash IS NOT NULL AND pii_hash IS NULL))`
- `UNIQUE(integration_id, pii_hash, scope) WHERE pii_hash IS NOT NULL`
- `UNIQUE(integration_id, crm_external_id_hash, scope) WHERE crm_external_id_hash IS NOT NULL`
- `UNIQUE(integration_id, idempotency_key)`
- `FK integrationId ON DELETE RESTRICT`

**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.

### 13.15 `CrmSyncNotificationOutbox`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (sync-log·conflict·credential-version) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·failed·permanent) | ✅ |
| `attempts` | integer | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt`·`sentAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.

---

**총 15개 admin DB 테이블** — 각 절 stand-alone schema:

| § | 테이블 | 핵심 invariant |
|---|---|---|
| 13.1 | CrmIntegration | partial unique active+integrationKey |
| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
| 13.3 | CrmSyncSourceAttempt | UNIQUE(syncLog, integration, entity, direction, attempt) |
| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
| 13.6 | CrmRecordChangeLog | FK RESTRICT + tombstone flag |
| 13.7 | CrmFieldMapping | mode outbound-only inbound direction build fail |
| 13.8 | CrmConflictRecord | resolution open 7일 SLA |
| 13.9 | CrmCredentialAuditLog | 7년 audit retention |
| 13.10 | CrmRateLimitState | bucketKey UNIQUE |
| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |
| 13.13 | CrmChangeIdentityLedger | UNIQUE changeIdentityKey + processedSyncLogId FK SET NULL |
| 13.14 | CrmConsentWithdrawalLedger | CHECK XOR + 3종 UNIQUE + legalHold default true |
| 13.15 | CrmSyncNotificationOutbox | UNIQUE(sourceKind, sourceId, eventType) |
