# Feature — content-migration

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외 — anchor residue 정정 완료)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (**6종** NotificationEventType + **15종** AuditAction cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 6종 NotificationEventType (CM6-01) |
| REVIEW_WORKFLOW § 10.2.1 | 15종 AuditAction (CM6-01) |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100
        criticalClassFullDiff: true
        digest:
          chunkSize: 10000
          maxRowsBeforeSnapshot: 1000000
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"
        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
        staleFlagsOnlyOverrideConditions:
          maxRiskLevel: "low"
          requiresNoLegalSensitiveEntityChange: true     # CM4-08
          requiresNoLegalEntityIdentityChange: true      # CM4-08
          requiresNoPriorReviewRequiredChange: true
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body)). char(64) |
| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` | step별 read-set field projection canonical JSON → chunked Merkle |
| `sourceSnapshotWatermark` | source table별 MAX(updated_at) + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` | (contentMigrationPolicyVersion + complianceAssistantPolicyVersion + ruleCatalogVersion + ruleFileHashes + REVIEW_WORKFLOW version + piiFieldCatalogRef + entityFieldProjectionCatalogRef) canonical digest |
| `stepRegistryVersion` | step type registry 카탈로그 hash |
| `legalImpactClassificationDigest` | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 (§ 3.4) |
| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |

dry-run/apply preflight 동일 함수. 비용 상한 § 2.3 `digest`.

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)

| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | | 동일 | — | — |
| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |

### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)

**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.

| AuditAction (canonical) | 추가 metadata |
|---|---|
| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |

### 3.2 plan kind 6종 (CM3-16 — 풀 전개)

#### 3.2.1 `application-data-version-upgrade`
DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. column add/rename DDL은 인프라 책임. 본 plan kind는 column 존재·nullable·default를 read-only 검증 후 데이터만 채움.

#### 3.2.2 `feature-activation-backfill`
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).

#### 3.2.3 `instance-to-instance-copy`
분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.

#### 3.2.4 `content-bulk-transform`
design token 변경·brand 변경 시 콘텐츠 일괄 재생성. **asset-ingestion body MV는 변경 금지** (mutableFieldDenylist).

#### 3.2.5 `policy-version-reevaluate`
CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.

#### 3.2.6 `routing-slug-preservation`
asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계. step 필수: `redirect-map-apply`·`slug-preserve`·`compliance-history-link`.

### 3.3 DTO

```ts
type MigrationPlanKind = /* 6종 */;
type RollbackClass = "reversible" | "compensating" | "irreversible";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string; description: string;
  targetSelector: TargetSelector;
  steps: MigrationStep[];
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;
  stepType: string;                                      // step registry 등록
  inputs: Record<string, unknown>;                       // registry inputSchema strict
  rollbackClass: RollbackClass;
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // irreversible 필수
  backupSnapshotRequired?: boolean;                     // irreversible 필수
  retryable: boolean;
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: LegalImpactClass[];
  classifierVersion: string;
  unknownClassesEncountered: boolean;                    // true → fail-closed
};

type LegalImpactClass =
  | "pii" | "legal-document" | "review-policy" | "pricing-page"
  | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy";

// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
type RunApplyInput = {
  planId: string;
  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
  applyPreflightToken: string;                          // server에서 dry-run 후 발급 (§ 3.5)
  forceProceedDespiteWarnings?: boolean;                // legal/critical warning에는 적용 안 됨
  idempotencyKey: string;
};

type RunApplyResult = {
  runId: string;
  status: "running";
  digestBundleVerified: { /* 8필드 + 일치 여부 */ };
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: RunPrimaryStatus;                     // CAS
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM4-05 신규
type MarkStepCompensatedInput = {
  stepResultId: string;
  compensationDescription: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  idempotencyKey: string;
};

// CM4-05 신규
type AbortRunInput = {
  runId: string;
  reason: string;
  approver: string;
  operationalTicketRef: string;
  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
  idempotencyKey: string;
};

// CM3-04 + CM4-08 — legalEntityChanged 분해
type PolicyReevaluateResult = {
  complianceRecordId: string;
  previousRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  newRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  riskDelta: "decreased" | "unchanged" | "increased";
  priorReviewRequiredChanged: boolean;
  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
  forcedReportingMode: "stale-flags-only" | "new-record-version";
  forcedReportingModeReason?: string;
};

// CM3-11 — Run status decomposition
type RunPrimaryStatus =
  | "pending" | "running" | "paused"
  | "completed" | "failed" | "cancelled"
  | "rolling-back" | "rolled-back";

type RunRemediationStatus =
  | "none"
  | "blocked-manual-remediation-required"
  | "cancellation-timeout-manual-review";

type RunRollbackOutcome =
  | "none" | "full" | "partial" | "failed";
```

### 3.4 idempotencyKey + requestFingerprint (CM3-19)

| command | scope | requestFingerprint |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64) opaque
3. client에 (dryRunReportId, applyPreflightToken) 둘 다 반환

runApply(input) — server:
1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
2. token 재계산 비교 — 불일치 시 → 401/CAS fail
3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
4. **digestComputationMode별 invalidation precheck** (CM4-02):
   - mode="full": 8필드 모두 server-side 재계산 → 비교
   - mode="snapshot": targetSetDigest·contentHashDigest는 snapshot 사용 (재계산 skip). policyVersionSnapshot·classifierVersion·catalog refs만 재계산
   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
```

### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
  readSetProjection: FieldProjection[];                 // entityFieldProjectionCatalogRef 통과
  writeSetProjection: FieldProjection[];                // 동일
  rollbackClassDefault: RollbackClass;
  legalClassHints: LegalImpactClass[];
  cancellationSupport: {
    supportsCooperativeCancellation: boolean;
    cancellationCheckInterval: number;
    maxUninterruptibleSeconds: number;
    transactionBoundary: "per-row" | "per-chunk" | "per-step";
  };
  partialWriteDetector: PartialWriteStrategy;           // CM3-10
  dryRunCostEstimateSecondsPerThousandRows: number;
  mutableFieldAllowlist?: string[];
  mutableFieldDenylist?: string[];                      // asset-ingestion body MV 포함
};

// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }
  | { kind: "chunked-returning"; chunkSize: number }
  | { kind: "append-only-watermark";
      watermarkField: string;
      lowerBound: string;                                // CM4-03 — 시작 watermark
      exclusiveUpperBound: string;                       // CM4-03
      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
      expectedInsertedCount: number;                     // CM4-03
      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
    }
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };
```

asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.

### 3.7 writeSetManifest (CM2-06 + CM3-10)

각 step 실행 시 StepResult에 기록:

```ts
type WriteSetManifest = {
  strategy: PartialWriteStrategy["kind"];
  expectedAffectedRows: number;
  actualAffectedRows: number;
  beforeDigest?: string;                                // small-rowid-merkle만 사용
  afterDigest?: string;
  committedRowIds?: string[];                            // small
  chunkIds?: string[];                                   // chunked-returning
  highWatermark?: { before: string; after: string };    // append-only-watermark
  expectedAfterProjectionHash?: string;                  // deterministic-transform
  actualAfterProjectionHash?: string;
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;
  isolationLevel: "read-committed" | "repeatable-read" | "serializable";
};
```

partial write 감지 트리거 (strategy별):
- `small-rowid-merkle`: beforeDigest + expected → afterDigest 불일치
- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
- `append-only-watermark` (CM4-03):
  - watermark 역행
  - actualInsertedCount ≠ expectedInsertedCount
  - `[lowerBound, exclusiveUpperBound)` 범위에 writerId ≠ 본 run row 발견 (phantom row)
  - concurrencyMode=serializable일 때 isolation level 미적용 → step abort
  - concurrencyMode=advisory-lock-range일 때 `pg_advisory_xact_lock(hashtext('cm:append:' + watermarkField + ':' + lowerBound))` 미획득 → step abort
- `deterministic-transform`: actualAfterProjectionHash ≠ expectedAfterProjectionHash

### 3.8 read API privacy class (CM3-20 — StepResult schema)

```ts
type StepResultRow = {
  id: string;
  runId: string;
  stepKey: string;
  status: StepResultStatus;
  inputSummary: ClosedSchemaSummary;                    // PII 미포함 요약 (필드 token + masked value)
  outputSummary: ClosedSchemaSummary;
  diffDisplayHints: ClosedSchemaSummary;                // crm-sync § 3.2.1 패턴
  rawArtifactRef?: string;                              // S3·blob ref (rawArtifactRef 권한 별도)
  rawArtifactRetentionExpiresAt?: Date;
  privacyClass: "non-pii" | "pii" | "legal-sensitive";
  containsPii: boolean;
  exportAllowed: boolean;                               // PII step은 false 강제
  writeSetManifest: WriteSetManifest;
  startedAt: Date; completedAt?: Date;
};
```

| field | operator | super-admin | legal-reviewer | export |
|---|---|---|---|---|
| inputSummary·outputSummary·diffDisplayHints (non-pii) | 허용 | 허용 | 허용 | 허용 |
| inputSummary·outputSummary·diffDisplayHints (pii·legal-sensitive) | masked | masked | full | export 금지 |
| rawArtifactRef (containsPii=true) | 차단 | 허용 (audit 기록) | 허용 (audit 기록) | export 금지 |
| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan: ContentMigrationPlan row insert (status=draft·planFingerprint)
2. validatePlan:
   - step type registry 등록 + inputSchema strict
   - rollbackClass별 reverse/compensating/blastRadius 검증
   - cooperativeCancellation 미지원 + transactionBoundary != per-chunk → **validate fail (CM3-02 승격)**
   - maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes 초과 → validate fail
   - legalImpactClassifier 실행 (§ 4.7)
   - writeSetProjection·mutableFieldAllowlist를 piiFieldCatalogRef·entityFieldProjectionCatalogRef로 catalog-against validation
   - unknownClassesEncountered=true → fail-closed
   - audit plan-validated
3. runDryRun:
   - 8필드 digest 산정 + sampling (deterministic-stratified, legal/PII full diff)
   - DryRunReport insert
   - applyPreflightToken 발급 (§ 3.5)
   - audit dry-run-completed
4. legalGateRequired=true → approvePlanLegalGate:
   - ContentMigrationLegalApproval insert (dryRunReportId·8필드 snapshot·approvedDigestBundleHash — CM3-13)
   - audit plan-legal-approved + 알림 plan-legal-approved
5. runApply(input):
   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
   - DryRunReport expiresAt CAS
   - legalGateRequired=true 시 expectedLegalApprovalId 필요 — DryRunReport 일치 확인
   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
   - ContentMigrationRun insert (primaryStatus=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 — writeSetManifest 기록
   - 알림 run-completed/run-failed
```

### 4.2 rollback

```
rollbackRun:
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. step 역순 처리:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)

#### 4.3.1 명령별 transition

| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point | paused·none·none |
| resumeRun | paused·none·none | 다음 step | running·none·none |
| cancelRun | pending | step 미진행 | cancelled·none·none |
| cancelRun | running·none | cooperative cancellation 요청. 종료 후 partial commit 검사. partial 발견 시 자동 rollback | cancelled·none·none / rolling-back·none·none |
| cancelRun | paused·none·none | 동일 partial commit 검사 | cancelled·none·none / rolling-back·none·none |
| rollbackRun | completed·failed·cancelled·paused (none·none) | reverse 시작 | rolling-back·none·none |
| (rollback 완료) | rolling-back·none | 모든 step reversible → full | rolled-back·none·**full** |
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)

```sql
CHECK (
  (primary_status='pending'      AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='running'      AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome='none') OR
  (primary_status='paused'       AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='completed'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='failed'       AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome IN ('none','failed')) OR
  (primary_status='cancelled'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
  (primary_status='rolled-back'  AND remediation_status='none' AND rollback_outcome IN ('full','partial'))
)
```

**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)

| writeClass | 정의 | 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
| `notification-read-receipt` | inApp 읽음 표시 | 큐잉 |
| `notification-digest-state` | digest 집계 | 큐잉 |
| `audit-append` | append-only audit | 허용 |

`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).

### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE content_migration_notification_outbox
SET status='sent', sent_at=now(), locked_at=null
WHERE id=$id;

-- transient fail (backoff 적용)
UPDATE content_migration_notification_outbox
SET status='pending', locked_at=null, last_error=$err,
    next_attempt_at = now() + (interval '1 second' * (CASE attempts
      WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 WHEN 4 THEN 7200 ELSE 21600 END))
WHERE id=$id;

-- exhausted (attempts >= 5)
UPDATE content_migration_notification_outbox
SET status='permanent', locked_at=null
WHERE id=$id AND attempts >= 5;
-- + sink alert

-- stale reclaim (별도 worker — cadence 1분)
UPDATE content_migration_notification_outbox
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '5 minutes';
```

status enum: `pending`·`processing`·`sent`·`permanent`. (CM3-14 — `failed` 제거)

### 4.7 legalImpactClassifier (CM3-05 — catalog input)

| class | deterministic rule |
|---|---|
| `pii` | step.readSetProjection ∩ piiFieldCatalogRef 또는 writeSetProjection ∩ piiFieldCatalogRef ≠ ∅ |
| `legal-document` | targetEntityTypes에 `LegalDocument` ∈ entityFieldProjectionCatalogRef |
| `review-policy` | targetEntityTypes에 `ReviewPolicy` |
| `pricing-page` | targetEntityTypes에 `PricingPage` 또는 `PricingPolicy` |
| `before-after-media` | readSet/writeSet에 priorReviewRequired trigger catalog의 before/after media field |
| `testimonial-review` | targetEntityTypes에 `Testimonial`·`Review` |
| `prior-review-required` | priorReviewRequired trigger catalog 영향 field |
| `cross-entity-copy` | planKind=instance-to-instance-copy 또는 sourceInstance != targetInstance |

unknown step type 또는 catalog 매칭 실패 → `unknownClassesEncountered=true` → fail-closed.

step의 self-declared `legalClassHints`만 신뢰하지 않음 — `writeSetProjection`·`mutableFieldAllowlist`를 catalog로 cross-validate (CM3-05).

**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.

retroactive audit — false-negative 발견 시 영향 plan 재평가 절차는 CM-09 v1.x (운영 정책).

### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)

```
config.defaultReportingMode="risk-based":
1. 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit:
   - check() 호출 skip
   - cachedResultRef 기록
3. concurrencyLimit·rateLimitPerSecond 적용
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
5. forcedReportingMode 결정 (CM4-08):
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.10)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| ApplyPreflightToken mismatch 차단율 | 100% | |
| legalImpactClassifier unknown fail-closed 비율 | baseline | |
| skip irreversible 발생율 | baseline (운영 review) | |
| partial write → rollback 트리거 비율 | baseline | |
| read-only window 차단 write | baseline | |
| policy-reevaluate risk-based new-record-version 비율 | baseline | |
| dry-run targetSetDigest match | 100% | |
| dry-run changedRowCount delta | < 1% | |
| dry-run fieldDiff delta | < 5% | |
| dry-run blockedDriftCount | baseline | |
| rollback 성공율 | > 99% | |
| outbox 발송 성공율 | > 99% | |

### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)

| Invariant ID | § 9 rule | 영역 |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |

### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)

| INV ID | happy fixture | violation fixture |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 실행 결과로 ComplianceRecord 재생성 시 새 record는 REVIEW_WORKFLOW § 8 lifecycle 진입 (개별 콘텐츠 contentType 유지). `contentType` 예외 cascade 불필요.

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
- `policyVersionReevaluate.staleFlagsOnlyOverrideConditions.maxRiskLevel` ∉ enum
- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry inputSchema.additionalProperties != false
- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)

### 9.2 runtime fail

- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
- policy-reevaluate concurrencyLimit 초과 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
- skipStep 대상 stepResult.rollbackClass ≠ "irreversible" → runtime fail (CM6-03 — `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason)
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
- stale policyVersionSnapshot → CAS fail
- targetSelector row lock 불가 → runtime fail
- orphan Core row → warning
- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
- maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes → validate fail
- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport expiresAt 도래 → purge
- legalHold > unregister > retention purge precedence
- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
- purge worker — 테이블별:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함
- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)

---

## 10. 미결정 사항

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster cross-region copy |
| CM-02 | partial cutover |
| CM-03 | sampling stratified 알고리즘 (v1.0 deterministic-stratified default·v1.x per-cluster) |
| CM-04 | read-only window 우회 권한 |
| CM-05 | rollback 부분 적용 안전성 |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |
| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |

### 10.3 v0.6 잔여 리스크 (CM5-08)

| 영역 | 상태 |
|---|---|
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |
| ~~§ 6.3 fixture violation path~~ | ~~resolved (v0.5 28 INV happy + violation)~~ |
| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.10 별도 table 승격 — 12 tables)~~ |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
| 2026-05-15 | v0.3 | codex 2차 23 지적 |
| 2026-05-15 | v0.4 | codex 3차 21 지적 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
| 2026-05-15 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 86건 (24+23+21+14+8+3+1) 전건 수용. blocking 0·major 0·minor 1 (CM7-01 anchor residue — 정정 완료). SoT cascade 완료: REVIEW_WORKFLOW (6종 NotificationEventType + 15종 AuditAction), DATA_MODEL v0.22 (contentMigrationConfig·piiFieldCatalogRef·entityFieldProjectionCatalogRef). 의료법·개인정보보호법 운영 가능. **8 Feature 마지막 — 전체 spec 완료** |
| 2026-05-15 | v0.7 | **codex 6차 비평 3 지적 정정**: (1) NotificationEventType **4종→6종**·AuditAction **13종→15종** 상단 SoT 카운트 정정 + NotificationOutbox `eventType` enum 6종 정정 (CM6-01), (2) § 12 heading 번호 총괄 인벤토리와 정합 (12.10 PolicyReevaluateRecord·12.11 NotificationOutbox·12.12 ActiveTargetLock) (CM6-02), (3) § 9.2 skipStep fail rule에서 제거된 `rollbackClass` 입력 참조 삭제 — `skipStep 대상 stepResult.rollbackClass ≠ "irreversible"` 으로 정정 (CM6-03) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (12 tables — executable schema)

### 12.1 `ContentMigrationPlan`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ |
| `planKind` | enum (6종) | ✅ |
| `planFingerprint` | char(64) | ✅ |
| `title`·`description` | string | ✅ |
| `targetSelector` | JSON | ✅ |
| `legalImpactClassification` | JSON (closed) | ✅ |
| `classifierVersion` | string | ✅ |
| `status` | enum (draft·validated·dry-run-completed·legal-approved·apply-ready·archived) | ✅ |
| `definedBy`·`definedAt` | string·Date | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.plan |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
**Index**: `(instanceId, status)`, `(expiresAt)`.

### 12.2 `ContentMigrationDryRunReport`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
| `generatedAt` (CM5-05) | Date | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — § 12.12 lock 산정에 재사용 (CM5-04) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `classificationSnapshot` | JSON | ✅ |
| `classificationSnapshotDigest` | char(64) | ✅ |
| `approvedDigestBundleHash` | char(64) | ✅ — 8필드 bundle |
| `policyVersionSnapshot` | string | ✅ |
| `classifierVersion` | string | ✅ |
| `approvedBy`·`approvedAt` | string·Date | ✅ |
| `legalHold` | boolean | ✅ default true |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `UNIQUE(planId, classificationSnapshotDigest)`. `UNIQUE(planId, dryRunReportId)`.
**Index**: `(planId, approvedAt DESC)`.

### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `expectedLegalApprovalId` | UUID | optional (legalGateRequired=true 시 ✅) — FK |
| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
| `solutionVersion` | integer | ✅ — CAS |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `mode` | enum (dry-run·apply) | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(planId, idempotencyKey)`
- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
**Index**: `(primary_status, started_at DESC)`, `(expiresAt)`.

### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `stepKey` | string | ✅ |
| `stepType` | string | ✅ |
| `status` | enum (pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back) | ✅ |
| `inputSummary` | JSON (closed — § 3.8) | ✅ |
| `outputSummary` | JSON (closed) | optional |
| `diffDisplayHints` | JSON (closed) | optional |
| `rawArtifactRef` | string | optional |
| `rawArtifactRetentionExpiresAt` | Date | optional |
| `privacyClass` | enum (non-pii·pii·legal-sensitive) | ✅ |
| `containsPii` | boolean | ✅ |
| `exportAllowed` | boolean | ✅ |
| `writeSetManifest` | JSON (§ 3.7) | optional |
| `rollbackClass` | enum | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints (CM4-10 SQL canonical 정정)**:
- `UNIQUE(runId, stepKey)`
- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
**Index**: `(runId, started_at DESC)`, `(expiresAt)`, `(privacy_class) WHERE privacy_class IN ('pii','legal-sensitive')`.

### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `attempts` | integer | ✅ |
| `maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (transient·permanent) | optional |
| `exhaustedAt` | Date | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
**Index**: `(status, next_attempt_at, locked_at) WHERE status IN ('pending','processing')`.

**worker SoT SQL** (CM3-07 자체 전개):

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_step_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_step_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- transient fail (backoff)
UPDATE content_migration_step_retry_queue
SET status='pending', locked_at=null, last_error=$err, last_error_class='transient',
    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
WHERE id=$id;

-- permanent
UPDATE content_migration_step_retry_queue
SET status='failed-permanent', locked_at=null, last_error_class='permanent'
WHERE id=$id;

-- success
UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;

-- exhausted
UPDATE content_migration_step_retry_queue
SET status='exhausted', exhausted_at=now(), locked_at=null
WHERE id=$id AND attempts >= max_attempts;
-- + sink alert + run.retryExhaustedAction trigger

-- stale reclaim
UPDATE content_migration_step_retry_queue
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';
```

### 12.7 `ContentMigrationRollbackLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `rolledBackStepKey` | string | ✅ |
| `rollbackClass` | enum | ✅ |
| `scope` | enum (full·from-step) | ✅ |
| `skippedIrreversibleSteps` | JSON ({stepKey, remediationTicketRef}[]) | ✅ |
| `result` | enum (success·partial·failed) | ✅ |
| `executedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId, rolledBackStepKey)`.
**Index**: `(runId, executedAt DESC)`.

### 12.8 `ContentMigrationReadOnlyWindow`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `startedAt`·`endedAt` | Date | ✅·optional |
| `blockedWriteAttempts` | integer | ✅ default 0 |
| `queuedDispatchCount` | integer | ✅ default 0 |
| `active` | boolean | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId) WHERE active=true`.
**Index**: `(active, started_at DESC)`.

### 12.9 `ContentMigrationPolicyReevaluateBatch`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planId` | UUID | ✅ — FK |
| `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` | integer | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId)`.

### 12.10 `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)

batch row 1개당 per-ComplianceRecord N row. 별도 물리 table. PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged` | boolean | ✅ |
| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.11 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType **6종** — § 5.1 SoT — CM6-01) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.12 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신
- stale (expiresAt 도래) → cleanup worker가 해제 + sink alert

`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.

---

**총 12개 admin DB 테이블** (CM5-01 정정):

| § | 테이블 |
|---|---|
| 12.1 | `ContentMigrationPlan` |
| 12.2 | `ContentMigrationDryRunReport` |
| 12.3 | `ContentMigrationLegalApproval` |
| 12.4 | `ContentMigrationRun` |
| 12.5 | `ContentMigrationStepResult` |
| 12.6 | `ContentMigrationStepRetryQueue` |
| 12.7 | `ContentMigrationRollbackLog` |
| 12.8 | `ContentMigrationReadOnlyWindow` |
| 12.9 | `ContentMigrationPolicyReevaluateBatch` |
| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
| 12.11 | `ContentMigrationNotificationOutbox` |
| 12.12 | `ContentMigrationActiveTargetLock` |
