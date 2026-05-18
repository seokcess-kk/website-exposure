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
session id: 019e2935-6255-7b32-9e4a-ee3439ae301e
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.4 (4차 사이클)

## 컨텍스트

3차 비평(21 지적) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.4 핵심:
- REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered) — canonical name
- DATA_MODEL C-08 v0.22: featureLegalApproved rename + piiFieldCatalogRef·entityFieldProjectionCatalogRef
- cooperativeCancellation 미지원 + non-per-chunk → validate fail로 승격
- cancellation-timeout-manual-review 허용 command 표 (rollbackRun·skipStep·markStepCompensated·abortRun)
- read-only window notification-dispatch dispatchAllowlist (high/critical operational만)
- PolicyReevaluateResult 타입 (previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingMode)
- § 12 executable schema 10 tables 풀 schema
- § 12.6 StepRetryQueue worker SQL 자체 전개
- ApplyPreflightToken § 3.5 — server-side 8필드 CAS (ETag 스타일)
- writeSetManifest strategy 4종 분기 (small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform)
- Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해
- active run partial unique
- LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash
- NotificationOutbox SQL nextAttemptAt·attempts·exhausted
- stale-flags-only override CHECK (maxRiskLevel=low + no legal/priorReview change)
- v0.2 동일 잔재 풀 전개
- § 6.2 INV ↔ § 9 fail rule 1:1 traceability + § 6.3 happy path fixture
- § 1.1 SemVer catalog 3행 추가
- § 3.1.1 AuditAction metadata 공통 required (actorId·actorRole·idempotencyKey·requestFingerprint)
- § 3.8 StepResultRow closed schema

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.4를 이전과 동일한 강도로 엄정하게 비평하라:

1. **3차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가?
2. **v0.4 신규 메커니즘 모순·미진함**:
   - ApplyPreflightToken — 8필드 재계산이 매번 발생하면 apply 시점 비용 우려. 또는 cache로 처리? legalImpactClassificationDigest와 classifierVersion이 변경되면 server에서 어떻게 감지?
   - writeSetManifest strategy 4종 — append-only-watermark가 watermark 역행 검사로 충분한가? 동시 삽입은?
   - Run status substate 분해 — primaryStatus·remediationStatus·rollbackOutcome 3축이 모든 transition을 닫는가? § 4.3 표가 모든 조합을 다루지 않음
   - cancellation-timeout-manual-review 허용 command 4종 중 markStepCompensated·abortRun은 § 3.1 command 목록에 없음
   - § 12.4 active run partial unique가 동시 dry-run + apply 충돌도 막는가? dry-run은 active run 정의에 포함 안 됨
   - § 4.8 stale-flags-only override CHECK 조건 — maxRiskLevel=low + no legal entity change + no priorReview change. 그런데 legalEntityChanged는 어떻게 정의? `LegalDocument·ReviewPolicy·PricingPage 영향`이 정확한가?
   - § 12.5 StepResultRow CHECK `containsPii = true → export_allowed = false` — application validator인지 DB CHECK인지
3. **DB 10 tables executable schema 완결성**:
   - § 12.1-§ 12.10 schema가 모든 FK·CHECK·partial unique·CAS를 다루는가
   - § 12.4 ContentMigrationRun.expectedLegalApprovalId FK는 legalGateRequired=false일 때 null 허용 — 정합한가
   - § 12.5 status enum에 skipped 포함되었지만 § 9 invariant에서 skipped 처리 path 명확한가
4. **traceability**:
   - § 6.2 INV 23종 ↔ § 9 rule 매핑이 빠진 항목 (예: INV-CATALOG-VALIDATION은 § 9.3에 있지만 § 6.2 표에 매핑됨)
   - § 6.3 fixture violation path가 v0.5 미루어진 영역 — v1.0 후보로서 충분한가?
5. **이전 Feature 패턴 정합성**:
   - crm-sync v1.0 partial unique 3종(active·rotating-target·committed) 패턴 — content-migration의 ContentMigrationRun primaryStatus 다중 active 방지가 정확히 같은 패턴인가
   - asset-ingestion body MV denylist 패턴 적용 정확성
   - notifications outbox SQL 패턴 (nextAttemptAt·attempts·exhausted) 일관성
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 일관성
   - § 1.1 SemVer가 v0.4 신규 (Run status substate·ApplyPreflightToken·writeSetManifest strategy) 모두 다루는가
   - § 4.3 state transition 표 + § 12.4 status enum 정합
   - "v0.3 동일·v0.2 § X 동일" 잔재 (있다면)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM4-`. v1.0 후보 판정 가능하면 `ready_for_v1_0=true`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.4)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle3_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
codex
`seo-geo` skill은 이번 요청과 직접 관련이 없어 사용하지 않습니다. 먼저 대상 문서와 3차 응답, 관련 SoT 문서의 핵심 구간을 병렬로 읽고 재발 여부와 신규 모순을 분리해 점검하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\asset-ingestion.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\notifications.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw .codex-reviews\\cm_cycle3_response.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
 succeeded in 1226ms:
# Feature — content-migration

> **상태**: Draft v0.4 (codex 자동 비평 3차 반영 — 21개 지적 전건 수용. stand-alone SoT 강화)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
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
- **DB 인벤토리**: **10 tables** (§ 12 executable schema)

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
specVersion: "0.4"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
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
    version: "0.4.0"
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
          dispatchAllowlist:                            # CM3-03 — high/critical operational 이벤트만 즉시 dispatch 허용
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
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
          requiresNoLegalEntityChange: true
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
| **`applyPreflightToken`** (CM3-09) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64). client는 server에서 받은 token만 전달 (ETag/If-Match 스타일) |

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
| 실행 | `skipStep` | irreversible/manual-remediation | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
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

// CM3-09 — server-side preflight token으로 client 부담 제거
type RunApplyInput = {
  planId: string;
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
  stepResultId: string;
  rollbackClass: "irreversible" | "manual-remediation-required";
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM3-04 — policy-reevaluate result contract
type PolicyReevaluateResult = {
  complianceRecordId: string;
  previousRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  newRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  riskDelta: "decreased" | "unchanged" | "increased";
  priorReviewRequiredChanged: boolean;
  legalEntityChanged: boolean;
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
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef + affectedRowsConfirmation) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert (8필드 digest 포함)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64)
3. client에 token 반환

runApply(input) — server:
1. input.applyPreflightToken 디코딩 → planId·dryRunReportId 매칭
2. DryRunReport에서 8필드 bundle 재추출
3. 현재 시점 재계산 — 8필드 모두 일치해야 진행
4. 불일치 시 → re-dry-run 강제 (CAS fail)
5. token expiresAt(retentionDays.dryRunReport) 초과 시 → CAS fail
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

// CM3-10 — strategy 분기
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }     // 소량: row-id full Merkle
  | { kind: "chunked-returning"; chunkSize: number }    // 대량: DB RETURNING + rowcount + invariant + sampled digest
  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };  // expected after image
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
- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
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

### 4.3 pause / resume / cancel state transition

| 호출 | primaryStatus 전제 | 동작 | 결과 status |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point까지 완료 후 pause | paused |
| resumeRun | paused | 다음 step부터 진행 | running |
| cancelRun | pending | step 미진행 | cancelled |
| cancelRun | running | cooperative cancellation 요청. 종료 후 partial commit 검사. non-compensated partial write 발견 시 자동 rollback (autoRollbackOnFailure 무시) | cancelled 또는 rolling-back |
| cancelRun | paused | partial commit 검사 동일 | cancelled 또는 rolling-back |
| rollbackRun | completed·failed·cancelled·paused | reverse 시작 | rolling-back → rolled-back / partial-rollback (remediationStatus) |
| skipStep | rolling-back + remediationStatus=blocked-manual-remediation-required | irreversible step skip | rolling-back 유지 (다음 step 처리) |

**cancellation-timeout-manual-review** (CM3-02 — remediationStatus):
- 진입: pauseRun 후 cooperative cancellation 미지원 step + stepTimeoutSeconds 도달
- 허용 command: `rollbackRun`·`skipStep`·`markStepCompensated`·`abortRun` (CM3-02)
- lock 해제: 별도 cleanup worker가 step row lock 해제 후 partial commit 검사 → remediationStatus 유지

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
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
5. forcedReportingMode 결정:
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - legalEntityChanged=true (LegalDocument·ReviewPolicy·PricingPage 영향) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.9.1)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |

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

### 6.3 acceptance fixture (CM3-17 — happy path + violation path 최소 1쌍)

각 invariant별 fixture는 다음 패턴으로 v0.5에서 풀 정의. v0.4는 happy path만 명시:

```
INV-CAS-PREFLIGHT-TOKEN:
  happy: dry-run 후 즉시 apply — token 일치
  violation: dry-run 후 30분 대기 — targetSet 변경 → token mismatch → 409

INV-LEGAL-UNKNOWN-CLASS:
  happy: 모든 step registry 등록 + catalog 매칭 → classification 성공
  violation: unknown step type → fail-closed

INV-ROLLBACK-IRREVERSIBLE:
  happy: 모든 step reversible — full rollback
  violation: irreversible step 포함 → blocked-manual-remediation-required → skipStep 후 partial

INV-POLICY-REEVAL-RISK:
  happy: low risk wording change → stale-flags-only
  violation: priorReviewRequired change → new-record-version 강제
```

상세 fixture matrix는 v0.5 cycle에서 완성 — INV × happy/violation × DB constraint level.

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
- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]

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
| CM-10 | abortRun command — cancellation-timeout-manual-review에서 (CM3-02 신규) |
| CM-11 | markStepCompensated command — manual remediation 후 compensation 적용 표시 |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |

### 10.3 v0.4 잔여 리스크

| 영역 | 상태 |
|---|---|
| § 6.3 acceptance fixture violation path 풀 정의 | open — v0.5 cycle |
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
| 2026-05-15 | v0.3 | codex 2차 23 지적 |
| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (10 tables — executable schema)

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

**Constraints**: `UNIQUE(runId, stepKey)`. `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`. `CHECK (contains_pii = true → export_allowed = false)`.
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

#### 12.9.1 `ContentMigrationPolicyReevaluateRecord`

(별도 row per ComplianceRecord) — CM3-04 PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
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

**총 10개 admin DB 테이블 (§ 12.1·12.2·12.3·12.4·12.5·12.6·12.7·12.8·12.9·12.10)** — § 12.9.1은 § 12.9 batch 부속.


 succeeded in 1268ms:
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
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered";
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
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |

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
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped";         // irreversible step skip (CM1-21)
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


 succeeded in 1276ms:
# Feature — notifications

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 7개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 11 / `docs/admin/REVIEW_WORKFLOW.md` § 9
> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
> **외부 공유 시 주의**: 상위 문서와 동일. 수신자 식별 정보·이메일 주소·Slack webhook URL 노출 주의.
> **연관 문서**:
> - 이벤트 enum·페이로드·이벤트별 정책 매트릭스(fallback 채널 포함) SoT → `admin/REVIEW_WORKFLOW.md` § 9
> - audit log enum(`notification-dispatched`·`notification-resend-attempted`·`notification-read`) → `admin/REVIEW_WORKFLOW.md` § 10
> - 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT → `core/DATA_MODEL.md` C-08
> - AdminUser·자격·알림 선호·suppression(autoReleaseAt) SoT → `core/DATA_MODEL.md` C-23
> - 운영시간 SoT → `core/DATA_MODEL.md` C-21 LocationProfile + CT-02 BusinessHours

---

## 0. 한 페이지 요약

- **Feature 식별자**: `notifications`
- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
- **dedupe Redis SET NX EX**: 채널별 dedupe는 `SET key value NX EX <ttl>` 원자 연산. 선기록 성공 worker만 provider 호출. 실패 worker는 `deduped` (§ 4.3)
- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
- **Slack broadcast**: AdminUser.slackUserId 미보유 시 — broadcast 1건 (envelope 단위)·dedupeKey sentinel `"broadcast"`. per-recipient placeholder는 `skipped-broadcast-only` (집계 대상 아님)
- **인벤토리**: DB **11 tables** (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt) + Redis 1 keyspace (DedupeCache)

---

## 1. 일반 규약

### 1.1 변경 정책

**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
| `DeliveryStatus` enum 변경 | **MAJOR** | 별개 | |
| **§ 9.1.1 매트릭스 의미 변경** (수신자·채널·criticality 등) | MINOR (append-only 시) / MAJOR (기존 version 의미 변경) | **policyVersion 신규 부여** | 패키지는 신규 + 기존 version 병렬 보관 (§ 4.2). 인스턴스 manifest opt-in |
| § 14 데이터 구조 변경 | MINOR (append-only) / MAJOR (semantic) | 별개 | DB 마이그레이션 동반 |
| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
| dedupe key 알고리즘 변경 | **MAJOR** | 별개 | |
| 재시도 분류표(§ 7.1) 변경 | MINOR | 별개 | |
| 운영 지표 항목 추가 | PATCH | 별개 | |

**매트릭스 정합 운영(병렬 보관 SoT)**: § 9.1.1 매트릭스가 변경되면 본 Feature 패키지에 **새 policyVersion을 추가하고 이전 버전도 병렬 보관**. 인스턴스는 InstanceManifest.config.`notificationPolicyVersion`이 명시한 버전을 사용. 롤백은 manifest의 version만 이전 값으로 변경 (§ 4.2). 운영 배포 순서: 매트릭스 SoT 갱신 → 패키지에 새 version 추가 + 이전 보관 → 인스턴스 manifest 갱신 (opt-in).

### 1.2 SoT 원칙

- 이벤트 enum·페이로드 타입·이벤트별 정책 매트릭스(fallback·criticality·quietHoursPolicy·optOutPolicy) SoT는 `admin/REVIEW_WORKFLOW.md` § 9
- 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT는 `core/DATA_MODEL.md` C-08
- AdminUser·자격·알림 선호·suppression SoT는 `core/DATA_MODEL.md` C-23
- audit log enum SoT는 `admin/REVIEW_WORKFLOW.md` § 10.2.1
- 운영시간 SoT는 `core/DATA_MODEL.md` C-21·CT-02
- 본 문서 = **발송 구현·운영 SoT** + **본 Feature 내부 데이터 구조 SoT** (§ 14)

### 1.3 본 문서가 다루지 않는 영역

- 알림을 발생시키는 워크플로 트리거 — `admin/REVIEW_WORKFLOW.md` § 2·§ 6
- 이벤트 enum·페이로드 필드·정책 매트릭스 — `admin/REVIEW_WORKFLOW.md` § 9
- 사용자 자격 인증 — `admin/REVIEW_WORKFLOW.md` § 11.2 + DATA_MODEL C-23 `eligibilityEvidence`
- 이메일 템플릿 시각 디자인 — `core/DESIGN_TOKENS.md` (NT-05)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "notifications"
specVersion: "1.0"               # 본 문서 명세 버전 (안정판)
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: true
```

> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
| `admin/REVIEW_WORKFLOW.md` § 11 | AdminUserRole·ApproverRole·자격 검증 |
| `core/DATA_MODEL.md` C-08 | `notificationChannels`·`adminBaseUrl`·`timezone`·`holidayCalendar`·features[] |
| `core/DATA_MODEL.md` C-23 | AdminUser·NotificationPreferences·suppression(autoReleaseAt) |
| `core/DATA_MODEL.md` C-21·CT-02 | LocationProfile(`@id="main"` 관례) + BusinessHours·SpecialClosure·LunchBreak |

### 2.3 InstanceManifest 통합

```yaml
adminBaseUrl: "https://admin.client-01.glitzy.kr"
timezone: "Asia/Seoul"

holidayCalendar:                                       # § 8.4 — clientApproverBusinessHoursAware=true 시 required
  region: "KR"
  source: "package-embedded"

notificationChannels:
  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
  inApp: { enabled: true }

features:
  - name: "notifications"
    version: "0.4.0"
    enabled: true
    config:
      notificationPolicyVersion: "9.1.1-2026-05-14"  # § 4.2 병렬 보관 SoT
      digestSchedule: { daily: "09:00", weekly: "MON 09:00" }
      dedupeWindowSeconds: 60
      retryMaxAttempts: 3
      retryBackoffSeconds: [30, 300, 1800]
      ctaRouteTemplates:
        Article: "/admin/content/article/{contentRef}"
        TreatmentPage: "/admin/content/treatment/{contentRef}"
        LegalDocument: "/admin/legal/{contentRef}"
        default: "/admin/content/{contentType}/{contentRef}"
      clientApproverBusinessHoursAware: true
      businessHoursReference: "openingHours"
      logRetentionDaysAfterDlqExpiry: 90
      receiptRetentionDays: 365                        # § 4.3 — sourceEventId 재사용 차단 기간 (dedupeWindow ≪ receipt retention)
      suppression:
        softSuppressionThreshold: 3
        softSuppressionAutoReleaseDays: 14            # C-23 autoReleaseAt 계산 (§ 7.4 worker)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 입력 — NotificationEvent

REVIEW_WORKFLOW § 9.2 SoT. 핵심:

- `sourceEventId` — idempotency key (필수)
- `recipients[]` — 비어 있으면 fail
- `criticality` 미지정 시 본 Feature가 § 9.1.1에서 자동 산정
- `metadata.locationRef` — multi-location 인스턴스 권장 (§ 8.4)
- recipient의 AdminUser `instanceMemberships[]`에 본 인스턴스 미포함 시 → `skipped-missing-user` (§ 4.1 4.a — instance membership 검증)

### 3.2 출력 — DeliveryResult·DeliveryStatus

```ts
type DeliveryResult = {
  eventId: string;
  sourceEventId: string;
  eventType: NotificationEventType;
  contentRef: string;
  receiptState: ReceiptState;
  acceptedAt: ISODateString;
  perRecipient: Array<{
    recipientId: string;
    deliveries: Array<{
      payloadId: string;
      channel: "email" | "slack" | "inApp";
      deliveryMode: "perRecipient" | "broadcast-placeholder";
      broadcastAttemptId?: string;     // broadcast-placeholder인 경우 실제 broadcast attempt id 참조
      status: DeliveryStatus;
      attempts: number;
      lastAttemptAt: ISODateString;
      provider?: string;
      providerResponseCode?: string;
      error?: string;
    }>;
  }>;
  broadcastDeliveries?: Array<{
    broadcastAttemptId: string;        // envelope+channel 단위 1건
    channel: "slack";
    status: DeliveryStatus;
    attempts: number;
    lastAttemptAt: ISODateString;
    provider?: string;
    providerResponseCode?: string;
    error?: string;
  }>;
};

type ReceiptState = "accepted" | "processing" | "completed" | "failed";

type DeliveryStatus =
  | "delivered"
  | "deferred-digest"
  | "deferred-quiet-hours"
  | "deferred-business-hours"
  | "deferred-rate-limit"
  | "failed-permanent"
  | "failed-retrying"
  | "deduped"
  | "skipped-missing-user"           // AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함
  | "skipped-disabled-channel"
  | "skipped-opt-out"
  | "skipped-suppressed"
  | "skipped-missing-location"       // metadata.locationRef가 InstanceManifest에 없는 ID — § 8.4 invalid locationRef
  | "skipped-broadcast-only";        // per-recipient placeholder — 집계 대상 아님

// 내부 attempt-level 상태 — DeliveryAttempt.status에만 사용 (외부 DeliveryStatus와 분리, N5-03)
type DeliveryAttemptStatus =
  | "processing"                      // attemptNumber 선점 후 provider 호출 전 (§ 4.4)
  | DeliveryStatus;
```

**DeliveryResult 소비 규칙** (REVIEW_WORKFLOW·운영 UI 정합):
- 성공/실패 집계는 `broadcastDeliveries[]`(broadcast 모드) + `perRecipient[].deliveries[]`(`skipped-broadcast-only` 제외)를 합산
- `skipped-broadcast-only`는 per-recipient 추적 placeholder만 — `broadcastAttemptId`로 실제 broadcast 결과 참조 가능
- `deferred-rate-limit`·`deferred-*`·`skipped-*`·`deduped`는 발송 성공율 분모 제외 (§ 9.1)

### 3.3 단일 엔트리포인트 — `notify()`

```ts
async function notify(event: NotificationEvent): Promise<DeliveryResult>
```

**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
- 1단계 단일 DB 트랜잭션 (immediate FK — Receipt.notificationLogId는 같은 트랜잭션에서 먼저 insert된 Log를 참조하므로 deferred FK 불필요):
  1. NotificationLog insert (UUID 생성)
  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
  3. Receipt insert 성공 시 트랜잭션 commit → receiptState="accepted"
- **abort 원인 분기** (N4-01):
  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
- **duplicate caller 결과 계약** (N4-02): 기존 receipt의 receiptState별 응답:
  - `receiptState="completed"` → 완성 DeliveryResult 반환
  - `receiptState="accepted"` 또는 `"processing"` → 짧은 poll(최대 500ms, 100ms 간격) 후 completed면 완성 결과, 미완성이면 `receiptState="processing"`로 부분 DeliveryResult 반환 (호출자가 후속 query 가능)
  - `receiptState="failed"` → 마지막 실패 결과 반환
- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제

**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)

**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)

---

## 4. 발송 파이프라인

### 4.1 실행 순서 (critical-aware filter ordering)

```
1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
   - NotificationLog insert (UUID 생성)
   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
   - **abort 원인 분기** (N5-02·§ 3.3 정합):
     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음

2. fan-out + NotificationPayloadRecord 영속:
   - recipients[] 각각 payloadId(UUID) 부여
   - ctaUrl 자동 합성
   - criticality 미지정 시 § 9.1.1 매트릭스 산정
   - NotificationPayloadRecord 저장 (payloadId·eventId·recipientId·contentRef·ctaUrl·metadata·criticality — channel별 추적은 DeliveryAttempt가 담당, PayloadRecord는 recipient-envelope unit)
   - receiptState="processing"

3. 즉시 채널 라우팅 — § 9.1.1 매트릭스:
   - immediateChannels(매트릭스) ∩ InstanceManifest.notificationChannels.<channel>.enabled=true
   - digest 채널은 § 6 별도 경로

4. critical-aware 필터 (순서 중요):
   a. **항상 적용** (critical 우회 불가):
      - AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`
      - 인스턴스 채널 비활성 → `skipped-disabled-channel`
      - dedupe 매칭 (§ 4.3 Redis SET NX EX) → `deduped`
   b. **사용자 opt-out 필터** (mandatory 우회):
      - matrix.optOutPolicy="mandatory" → opt-out 무시 + 사용자 채널 off 무시 (단 인스턴스 채널 활성 channel만)
      - 그 외 + AdminUser.notificationPreferences.channels.<channel>=false → `skipped-opt-out`
      - digest 채널 + AdminUser.digestOptOut=true (digestOptOut-allowed 정책) → `skipped-opt-out`
   c. **suppression 필터**:
      - C-23 suppression.<channel>.state ∈ {soft-suppressed, hard-suppressed} → 원 채널에 `skipped-suppressed` DeliveryAttempt 기록
      - 단 hard-suppressed인 채널 + 매트릭스 `fallback 채널` 컬럼이 정의되어 있으면 → **fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 함**(N4-07) 검증 후 라우팅 시도
      - **fallback 채널도 hard-suppressed인 경우** (N4-08): fallback 채널에도 별도 `skipped-suppressed` DeliveryAttempt 기록 + DeliveryAttempt.metadata에 `fallbackExhausted=true` 마킹 + 외부 monitoring sink alert. 호출자/운영 UI는 두 attempt를 보고 "원 채널·fallback 모두 막힘"을 추적 가능
   d. **criticality=critical은 e~f만 우회**:
      - **(e) quietHours** → `deferred-quiet-hours` (critical 우회 → 즉시 발송)
      - **(f) businessHours 평가** (§ 8.4 client-approver):
        - **(f-pre) invalid locationRef** (N5-04): `metadata.locationRef`가 InstanceManifest LocationProfile에 없는 ID → `skipped-missing-location` + 외부 monitoring sink alert. main fallback으로 보정하지 않음. critical 이벤트도 본 분기는 우회하지 않음 (runtime 입력 오류 감지)
        - (f-main) businessHours 외 → `deferred-business-hours` (critical 우회)
   e. high/normal은 e·f 모두 적용

5. 채널 어댑터 호출 (§ 5):
   - rate limit 평가 → 초과 시 `deferred-rate-limit`
   - 정상 → provider 호출
   - DeliveryAttempt 생성·갱신 (§ 14.4 — 동시성 안전 § 4.4)

6. 결과별 처리:
   - delivered → NotificationLog summary 갱신
   - failed-retrying → 재시도 큐
   - failed-permanent → DLQ 저장 (§ 7.2) + suppression 갱신(§ 7.1) + 외부 sink alert
   - deferred-digest → NotificationDigestBucket (§ 14.6·14.7)
   - deferred-quiet-hours → NotificationQuietHoursQueue (§ 14.8)
   - deferred-business-hours → NotificationBusinessHoursQueue (§ 14.9)
   - deferred-rate-limit → 채널별 rate limit 큐

7. receiptState="completed" + audit log `notification-dispatched` (envelope 1건)
```

### 4.2 매트릭스 병렬 보관 — notificationPolicyVersion

- 본 Feature 패키지는 매트릭스(§ 9.1.1)를 **policyVersion별 병렬 보관**
- 패키지 빌드 시 매트릭스 SoT의 hash + version 메타 포함
- 인스턴스 manifest의 `notificationPolicyVersion`이 명시한 버전을 런타임에 라우팅
- 빌드 검증(§ 11): manifest version이 본 Feature 패키지에 등록된 version 중 하나여야 함 (불일치 fail)
- 매트릭스 변경 운영:
  - REVIEW_WORKFLOW § 9.1.1 갱신 → 본 Feature 패키지에 새 policyVersion 추가 (이전 버전도 보관) → 인스턴스 manifest의 `notificationPolicyVersion` 갱신 (opt-in)
  - 롤백: manifest version을 이전 값으로 변경 (패키지 변경 없음)
- **보관 정책** (N4-10):
  - **최소 지원 기간**: 1 policyVersion당 12개월 (사용 인스턴스 0건 이후에도)
  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여

### 4.3 dedupe 알고리즘 (Redis SET NX EX 원자)

```
dedupeKey:
  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
  broadcast 모드: recipientId 위치에 sentinel "broadcast" 사용
    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}

저장소: Redis (§ 14.10)

원자 연산: SET key value NX EX <ttl>
  - 성공(키 생성) → worker가 provider 호출 진행
  - 실패(키 존재) → DeliveryAttempt status=deduped 기록, provider 호출 생략

값 구조: { state, payloadId, attemptedAt }
state 머신:
  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
  - delivered → SET XX EX "delivered" (dedupeWindowSeconds)
  - failed-permanent → SET XX EX "failed-permanent" (dedupeWindowSeconds) — 재시도 자동 차단

수동 resendDeadLetter:
  - dedupe key 검사 우회 + dedupe key 갱신하지 않음
  - 별도 attempt(dedupeMode="resend") 생성. 기존 dedupe TTL 자연 만료

sourceEventId 재사용:
  - dedupeWindowSeconds(기본 60초) << receiptRetentionDays(기본 365일)
  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
  - receipt 보존 기간 만료 후 재사용은 새 이벤트로 처리됨 — 운영 정책상 sourceEventId 재사용 금지 권장
```

### 4.4 rate limiting·DeliveryAttempt 동시성

**rate limiting**:
- 채널별 시간당 한도: C-08 `rateLimitPerHour`
- 초과 → `deferred-rate-limit` + 채널별 rate limit 큐. 다음 윈도우 재시도
- 메트릭 제외: § 9.1 성공율·실패율 계산 분모에서 제외

**DeliveryAttempt attemptNumber 동시성** (multi-worker race 방지 — N4-04·05·06):
- attemptNumber는 `(payloadId, channel)` 범위 sequence (PayloadRecord에 channel 필드 없음 — lock 대상은 PayloadRecord row 자체이고 channel은 query 조건)
- **운영 SoT lock 메커니즘**: PostgreSQL advisory lock `pg_advisory_xact_lock(hash(payloadId, channel))` (다른 DBMS는 동등한 named lock — 운영 결정 NT-17)
- **provider 호출은 lock·DB transaction 밖에서 진행** — lock 시간 최소화·deadlock·connection pool 고갈 방지:
  ```
  1. 짧은 transaction 시작
  2. advisory lock acquire (hash(payloadId, channel))
  3. SELECT MAX(attemptNumber)+1 FROM NotificationDeliveryAttempt WHERE payloadId=? AND channel=?
  4. INSERT NotificationDeliveryAttempt (status="processing", attemptNumber=max+1, ...)
  5. transaction commit (lock 자동 해제)
  6. 별도 비-트랜잭션 영역에서 provider 호출
  7. 별도 transaction에서 attempt UPDATE (status=delivered/failed-*, providerResponseCode, ...)
  ```
- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
- **resendDeadLetter도 동일 메커니즘** — attemptNumber sequence 통합 관리

---

## 5. 채널 어댑터

### 5.1 email

- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
- 템플릿: Markdown → HTML, BrandTokens(C-07) (NT-05 운영)
- 본문 필수: 이벤트 제목·콘텐츠 제목·CTA 버튼·발신자/Reply-To
- 실패 분류: § 7.1 표 → suppression 갱신 자동

### 5.2 Slack (per-recipient vs broadcast 모드)

- C-08 webhookUrlSecretRef
- 포맷: Slack Block Kit

**per-recipient 모드** (slackUserId 보유):
- mention(`<@U12345>`) 포함
- DeliveryAttempt: `deliveryMode="perRecipient"` + `recipientId`
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
- 일반 필터(dedupe·opt-out·quietHours·suppression) 정상 적용

**broadcast 모드** (slackUserId 미보유, recipients 중 1명 이상):
- 매트릭스 immediateChannels에 slack 포함 + `criticality=critical` 이벤트만 허용. 그 외는 broadcast 미발송
- **broadcast 데이터 모델** (N4-14·N4-15·N4-16):
  - **NotificationPayloadRecord 1건 생성** — envelope+channel 단위 (recipientId=NULL). § 14.3 broadcast 모드에서 PayloadRecord 1건만, 추가 broadcast-only recipient에 대한 PayloadRecord는 생성하지 않음
  - **NotificationDeliveryAttempt 1건 생성** — envelope+channel 단위 (deliveryMode="broadcast", recipientId=NULL, payloadId=위 broadcast PayloadRecord)
  - `broadcastAttemptId` = **broadcast DeliveryAttempt.id 그대로 참조** (별도 group id 아님 — 자기 참조 의미 제거)
  - `perRecipient[].deliveries[]`의 broadcast-only placeholder는 **DB row 없는 합성 값** — DeliveryResult 합성 시점에 만들어지고 `broadcastAttemptId`로 broadcastDeliveries 매핑. DB에 placeholder DeliveryAttempt를 만들지 않음 → § 14.4 deliveryMode enum에서 `broadcast-placeholder` 제거
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
- broadcast 결과는 `DeliveryResult.broadcastDeliveries[]`에 기록 (broadcastAttemptId = broadcast DeliveryAttempt.id)
- 실패/성공 집계는 `broadcastDeliveries[]`가 SoT, `perRecipient[].deliveries[].status="skipped-broadcast-only"`는 placeholder (집계 제외)

**suppression fallback** (§ 9.1.1 매트릭스):
- slack hard-suppressed (workspace 4xx 등) → fallback 채널(매트릭스 컬럼)로 라우팅. fallback도 막히면 외부 sink alert
- broadcast 모드는 workspace 단위 suppression 대상이 아님 (per-user suppression 없음)

### 5.3 in-app

- 저장소: NotificationInbox (§ 14.5)
- 표시: 어드민 종 아이콘 미확인 카운트
- **발송 원자성** (N4-24): inApp은 **단일 DB transaction에서 NotificationInbox insert + NotificationDeliveryAttempt(status=delivered) insert를 원자 처리**. `UNIQUE(payloadId)` 충돌 시 (race) — 이미 존재하는 Inbox·Attempt 조회하여 `status=deduped` 결과 반환
- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
- **inactive 사용자의 historical inbox**: `active=false` 사용자 inbox는 어드민 UI에서 기본 숨김. 단 DB row는 보존 (감사). 사용자 reactive 시 자동 재노출. 본 정책은 v0.5 기본 운영 결정 — NT-16 해소

---

## 6. digest 모드 (DigestPolicy AST)

### 6.1 정책 AST 구조 (자연어 매트릭스 → 구조화)

REVIEW_WORKFLOW § 9.1.1의 `digest 주기` 컬럼은 본 Feature 패키지 빌드 시 다음 AST로 코드 생성:

```ts
type DigestPolicy = {
  channel: "email";                                  // 현재 email만
  cadence: "daily" | "weekly";
  when?: DigestCondition;                             // 미지정 시 default
  optOutPolicy: "mandatory" | "digestOptOut-allowed";
  policyKey: string;                                  // 매트릭스 빌드 시 결정적 부여
};

type DigestCondition = {
  field: DigestConditionField;                        // 허용 enum
  op: "equals" | "notEquals" | "startsWith" | "endsWith" | "contains" | "exists" | "notExists";
  value?: string | number | boolean;                  // op="exists"·"notExists"는 미지정
};

type DigestConditionField =
  | "metadata.staleTriggeredBy"
  | "metadata.rejectReason"
  | "metadata.priorReviewSubmissionId"
  | "metadata.locationRef"
  | "criticality"
  | "eventType";
```

**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.

**exists/notExists deep path 평가 규칙** (N4-12):
- `missing parent` (예: `metadata.priorReviewSubmissionId` 평가 시 `metadata` 객체에 본 키 자체 부재) → `exists=false`
- `null` 값 → `exists=false`
- `undefined` 값 → `exists=false`
- `""` (빈 문자열) → `exists=true`
- `0`·`false` → `exists=true`

**default policy 유일성 검증** (N4-13): 본 Feature 패키지 빌드 시 — 각 `(eventType, channel)`별 매트릭스 셀이 digest 정책을 가지면 (a) `when: undefined` default 정책 정확히 1개, (b) 조건부 정책 0개 이상. default 부재·중복은 build fail.

**예시 (stale-queued 셀 "email — 의료법 개정은 일일, 기타는 주간" 분해)**:

```ts
[
  {
    channel: "email",
    cadence: "daily",
    when: {
      field: "metadata.staleTriggeredBy",
      op: "startsWith",
      value: "medical-law-revision-"
    },
    optOutPolicy: "mandatory",
    policyKey: "stale-queued.email.daily.medical-law-revision"
  },
  {
    channel: "email",
    cadence: "weekly",
    when: undefined,                                  // default — 위 when 미충족 시
    optOutPolicy: "digestOptOut-allowed",
    policyKey: "stale-queued.email.weekly.default"
  }
]
```

**매칭 우선순위**: 배열 순서대로 평가, 첫 매칭 정책 사용. when 미지정(default)은 항상 마지막. 평가 안전:
- 허용 field/op 외 사용 금지 (빌드 시 fail)
- 값 타입 검증: `equals`/`notEquals`는 일치 타입, `startsWith` 등은 string 한정
- 런타임 eval·임의 식 평가 금지

### 6.2 발송 트리거

- 일일: InstanceManifest.timezone 기준 `digestSchedule.daily`
- 주간: `digestSchedule.weekly`
- 스케줄러: 외부 cron 또는 내부 (NT-08)
- missed run: ±10분 → 다음 cycle carry-over
- DST: IANA 기준 자동 (fall-back 중복 시 첫 발생, spring-forward 누락 시 다음 정상 시각)

### 6.3 그룹화·발송

- DigestBucket key: `(recipientId + policyKey + cadenceWindow)` — § 14.6·14.7 join table
- **cadenceWindow 표기 (§ 14.6 정합)**:
  - daily: `YYYY-MM-DD` (인스턴스 timezone 기준 일자)
  - weekly: `YYYY-Wnn` (ISO week)
- 발송 시점에 join table 조인 → NotificationPayloadRecord[] 묶음 처리
- 발송 완료 → bucket `digestSentAt` 기록 (중복 발송 방지)
- opt-out 평가:
  - policy.optOutPolicy="mandatory" → AdminUser.digestOptOut 무시
  - "digestOptOut-allowed" → digestOptOut=true 시 `skipped-opt-out` (bucket 누적 안 함)

### 6.4 큐 분리·중복 발송 방지 정확화

- DigestBucket·QuietHoursQueue·BusinessHoursQueue 별도 테이블 (§ 14)
- 동일 payloadId가 여러 큐에 동시 누적 가능. **큐 worker 중복 발송 방지 SoT 쿼리** (N4-23):
  ```
  1. advisory lock acquire (hash(payloadId, channel)) — § 4.4와 동일 메커니즘
  2. SELECT 1 FROM NotificationDeliveryAttempt
     WHERE payloadId=? AND channel=? AND status IN ('processing', 'delivered', 'deferred-digest', 'deferred-quiet-hours', 'deferred-business-hours')
     LIMIT 1
  3. row 존재 시 → 본 worker는 발송 생략 (다른 worker가 이미 처리 중·완료)
  4. row 미존재 시 → § 4.4 attemptNumber lock·INSERT processing → commit → provider 호출
  5. advisory lock 해제
  ```
- **인덱스**: `NotificationDeliveryAttempt(payloadId, channel, status)` partial index (status IN above 집합) — 위 쿼리 최적화 (§ 14.4 추가 인덱스)

---

## 7. 재시도·실패·suppression

### 7.1 채널별 실패 분류표

| 채널 | 분류 | 트리거 | 처리 | suppression 갱신 |
|---|---|---|---|---|
| email | `transient` | SMTP 4xx, network timeout, provider 5xx | 재시도 3회 | **atomic increment** `observedCount`. **compare-and-set**으로 threshold 도달 시 1회만 state=`soft-suppressed` + `autoReleaseAt = lastObservedAt + softSuppressionAutoReleaseDays` 설정 |
| email | `permanent` (hard bounce) | 5xx 영구·invalid recipient | DLQ + sink alert | 즉시 `hard-suppressed` (자동 해제 없음) |
| email | `permanent` (config) | provider auth 401/403 | DLQ + sink alert (긴급) | 갱신 없음 |
| email | `permanent` (spam) | spam complaint | DLQ + sink alert | 즉시 `hard-suppressed` |
| email | `rate-limited` | 429 | `deferred-rate-limit` | 갱신 없음 |
| slack | `transient` | webhook 5xx, timeout | 재시도 | (per-recipient 모드에서만) atomic increment |
| slack | `permanent` | 4xx (404·403) | DLQ + sink alert | webhook 자체 문제 — webhookUrlSecretRef 점검 alert |
| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
| inApp | `transient` | DB 일시 | 1회 재시도, 실패 시 DLQ | 갱신 없음 |
| inApp | `permanent` | DB 스키마·constraint | DLQ + sink alert (긴급) | 갱신 없음 |

**suppression atomic 갱신 규칙** (N3-16 해소):
- `observedCount` 증가는 DB atomic increment (`UPDATE ... SET observedCount = observedCount + 1`)
- threshold 도달 판정: `UPDATE ... SET state='soft-suppressed', autoReleaseAt=... WHERE state='active' AND observedCount >= threshold` — 영향 row 1건일 때만 자동 sink alert 발생 (중복 alert 방지)

**soft → hard 전이** (N4-22):
- soft-suppressed 상태에서 hard bounce·spam complaint 발생 시 → **hard가 soft를 무조건 override**: `UPDATE ... SET state='hard-suppressed', autoReleaseAt=NULL, observedCount=observedCount(보존)` — autoReleaseAt 제거 + observedCount는 운영 추적용 보존
- worker(§ 7.4)는 자동 해제 조건에 `state='soft-suppressed'` 명시적으로 추가하여 hard 상태 불변성 보장

### 7.2 DLQ + resendDeadLetter

- 저장소: NotificationDeadLetter (§ 14.10) + join table NotificationDeadLetterAttempt (§ 14.11 — N3-19 정정)
- `failedAttemptIds`는 join table FK 참조 — RDBMS 무결성 보장

**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
- 새 resendAttemptId(UUID) 생성
- 새 NotificationDeliveryAttempt(attemptNumber = § 4.4 lock 메커니즘 사용, dedupeMode="resend") 생성. dedupe 우회
- 발송 성공 → DeadLetter.resolvedAt 마킹 + NotificationLog summary 재계산
- 발송 실패 → join table에 새 attempt 추가, DeadLetter unresolved 유지
- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)

**보존 기간·순서** (N3-21 해소):
- DLQ `expiresAt`: 기본 30일 (NT-12)
- NotificationLog·PayloadRecord·DeliveryAttempt: DLQ `expiresAt` + `logRetentionDaysAfterDlqExpiry`(기본 90일) 이상 보존
- ON DELETE RESTRICT FK로 보존 순서 강제

### 7.3 self-notification 차단 — 외부 sink

| sink | 트리거 | 대상 |
|---|---|---|
| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
| `auditLog` | envelope 종결·재발송·읽음 | 어드민 콘솔 |
| `NotificationLog` | per-payload·per-attempt | 운영 메트릭 SoT |

### 7.4 suppression auto-release worker + 운영자 수동 해제 (N3-15·N4-20·N4-21 해소)

**자동 해제 worker** (soft-suppressed 한정):
- 주기 worker: 1시간 간격
- 조건: `state='soft-suppressed' AND autoReleaseAt <= now()` (hard-suppressed 자동 해제 금지)
- 액션: `state='active', observedCount=0, autoReleaseAt=NULL, firstObservedAt=NULL, lastObservedAt=NULL`
- 동시성 안전: 위 WHERE 조건부 update (DB atomic)

**운영자 수동 해제** (hard-suppressed·soft-suppressed 공통):
- **권한**: `super-admin`·`operator` (REVIEW_WORKFLOW § 11.1)
- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
- **갱신**: `state='active', observedCount=0, firstObservedAt=NULL, lastObservedAt=NULL, autoReleaseAt=NULL, unsuppressedBy=actor.id, unsuppressedAt=now()`
- **observedCount reset 정책**: 수동 해제 시 0 리셋 — 다음 transient 발생부터 새 epoch으로 카운트. threshold 재도달 시 정상 alert 발생 (즉시 재-alert 방지하면서 재발 추적 보장)
- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`

---

## 8. 사용자 설정·옵트아웃·운영시간

### 8.1 timezone 우선순위

- **quietHours**: `AdminUser.notificationPreferences.quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`
- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)

### 8.2 quietHours

- 즉시 채널(email·slack-perRecipient) 보류 → `deferred-quiet-hours` → NotificationQuietHoursQueue (§ 14.8)
- inApp은 quietHours 무시
- critical은 quietHours 우회

### 8.3 글로벌 opt-out

- 모든 채널 off + digestOptOut=true:
  - mandatory 이벤트 → opt-out 우회 + 사용자 채널 off 무시 (단 인스턴스 채널 비활성은 우회 안 함). 인스턴스 inApp 활성 시 강제 inApp
  - 그 외 → `skipped-opt-out`
- 강제 inApp 발송 사전 고지 — 어드민 알림 설정 화면

### 8.4 인스턴스 운영시간 — client-approver

- 적용 조건: `clientApproverBusinessHoursAware=true` + recipient.recipientRole="client"
- **locationRef 산정**:
  1. NotificationEvent.metadata.locationRef
  2. fallback — **LocationProfile `@id="main"`** (C-21 SoT 관례, N3-14 정정)
  3. main 부재 → § 11 빌드 검증 fail (multi-location + main 부재는 fail로 격상 — N4-29)
- **invalid locationRef 처리** (N4-19): metadata.locationRef가 InstanceManifest에 없는 ID이면 → 본 recipient는 `status="skipped-missing-location"` (DeliveryStatus enum 신규 — § 3.2) + 외부 monitoring sink alert. main fallback으로 조용히 보정하지 않음 (runtime 입력 오류 감지)
- 기준 필드: `businessHoursReference` (`openingHours` | `receptionHours` — 기본 openingHours)
- 휴진·공휴일·점심:
  - `openingHours`/`receptionHours`의 `dayOfWeek` 시간 범위
  - `lunchBreaks` 제외 (점심 종료 후 발송)
  - `specialClosures[]` (특정 일자)
  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
- `holidayPolicy` Markdown 필드는 표시용. 계산에 사용 안 함
- 종료 시각 산정 (N4-18): "다음 운영 가능 시각" 탐색 — **최대 90일 탐색 한계**. 90일 내 운영 시각 미발견 시 → `status="failed-permanent"` + 외부 sink alert. 연속 휴일·잘못된 businessHours 설정 등 입력 오류 감지
- **package-embedded holidayCalendar 갱신 정책** (N4-17):
  - 본 Feature 패키지 buld에 한국 공휴일 데이터 embed (해당 연도 + 다음 연도 + 1)
  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
  - **긴급 패치**: 임시공휴일·대체공휴일 지정 시 본 Feature 패키지 patch release (1-2주 내). 운영팀이 모든 인스턴스에 패치 알림
  - `holidayCalendar.source="external-api"` override 우선 — 패키지 데이터보다 외부 API가 최신이면 외부 우선 (NT-18 인프라 결정)
- 큐: NotificationBusinessHoursQueue (§ 14.9)
- critical은 businessHours 우회
- operator·physician·legal·super-admin: 본 정책 미적용

---

## 9. 운영 지표

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| 발송 지연 (즉시) | event 수신 → delivered/deferred-* 종결 | < 30초 (p95) |
| 발송 성공율 | delivered / (delivered + failed-permanent) — `deferred-*`·`skipped-*`·`deduped`는 분모 제외 | > 99% (email·slack), > 99.9% (inApp) |
| transient 재시도율 | failed-retrying / 전체 | < 5% |
| rate-limit 발생율 | deferred-rate-limit / 전체 | < 10% |
| DLQ 신규 발생 | failed-permanent / 일 | < 10 |
| dedupe 적중률 | deduped / 전체 | baseline |
| digest 적시성 | 예정 시각 ± 5분 | > 95% |
| broadcast 비율 (Slack) | broadcastDeliveries / 전체 slack | baseline |
| suppression 누적 | hard-suppressed AdminUser 수 | M2+ baseline |

### 9.2 측정·로깅

- NotificationLog·DeliveryAttempt·PayloadRecord가 SoT
- audit log는 envelope 요약·재발송·읽음만

### 9.3 자체 alert (외부 sink)

- 성공율 < 95% (10분 이동평균)
- DLQ 신규 > 10/일
- 발송 지연 p95 > 60초
- rate-limit > 30% (1시간)

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. notificationChannels·adminBaseUrl·timezone·holidayCalendar 설정 (C-08 v0.13)
# 3. secretRef 등록 (이메일·Slack·monitoring sink)
# 4. 어드민 DB 마이그레이션 — § 14 인벤토리 (DB 11 tables + Redis 1 keyspace)
# 5. AdminUser(C-23) 등록
# 6. notificationPolicyVersion 확인 — 본 Feature 패키지의 매트릭스 보관 버전 중 하나와 일치
```

### 10.2 설정 예시 — § 2.3 참조

---

## 11. 빌드 검증

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
| **warning** | AdminUser(C-23) 0건, slack 활성 + slackUserId 등록 0건(broadcast 모드만), `clientApproverBusinessHoursAware=true` + LocationProfile.businessHours 미설정 |

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| NT-04 | 이메일 트랜스포트 — SMTP vs SES vs Mailgun | 운영 결정 |
| NT-05 | 이메일 템플릿 — BrandTokens·다국어 | M2+ |
| NT-08 | digest 스케줄러 — 외부 cron vs 내부 | 인프라 결정 |
| NT-11 | SMS 채널 도입 시점 | v1.x |
| NT-12 | DLQ 보존 기간 — 기본 30일 vs 운영 | 운영 정책 |
| NT-17 | DeliveryAttempt advisory lock 메커니즘 — PostgreSQL `pg_advisory_xact_lock` vs 다른 DBMS named lock + stale processing worker 정리 정책 | 인프라 결정 |
| NT-18 | holidayCalendar external-api override 운영 — provider 선택·API 호출 빈도 | 인프라 결정 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
| ~~NT-03~~ | dedupe 저장소 | v0.2 — Redis (v0.4 SET NX EX 원자) |
| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
| ~~NT-07~~ | NotificationInbox 스키마 | v0.2 |
| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
| ~~NT-10~~ | NotificationLog vs audit log | v0.2 |
| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
| ~~NT-16~~ | inactive 사용자 historical inbox | v0.5 — 기본 숨김 운영 결정 (§ 5.3). 인스턴스 옵션 override 없음 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (23 지적) |
| 2026-05-14 | v0.5 | codex 4차 (30 지적 전건 수용) — 트랜잭션 abort 분기·attemptNumber lock SoT·UNIQUE 정정·fallback 두 attempt·두 축 분리·DigestPolicy AST 검증·broadcast 단일 PayloadRecord·holidayCalendar 갱신·businessHours 90일·skipped-missing-location·운영자 수동 unsuppress·soft→hard·큐 worker 중복 방지·inApp 원자성·DeadLetter UNIQUE·MySQL schema·actorRole·AdminUserRole system·main 부재 fail
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |

---

## 14. 본 Feature 내부 데이터 구조 (admin DB 11 tables + Redis 1 keyspace)

### 14.1 공통 원칙

- 모든 테이블 `id` UUID PK, `createdAt` Date
- FK 기본 ON DELETE RESTRICT — 보존 순서 보장 (DigestBucketPayload만 분리, § 14.7)
- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)

### 14.2 `NotificationEventReceipt` (idempotency 선점)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | PK |
| `instanceId` | Slug | ✅ | |
| `sourceEventId` | string | ✅ | idempotency key |
| `notificationLogId` | UUID | ✅ | NotificationLog FK |
| `receiptState` | enum | ✅ | accepted/processing/completed/failed |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |

**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
**보존**: `receiptRetentionDays`(기본 365일) — sourceEventId 재사용 차단.

### 14.3 `NotificationPayloadRecord` (recipient-envelope unit)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | = payloadId |
| `notificationLogId` | UUID | ✅ | FK |
| `eventId` | string | ✅ | |
| `recipientId` | Ref<C-23> | optional | **broadcast 모드: NULL (envelope+channel 단위 1건 — N4-14)**. per-recipient 모드: AdminUser @id |
| `recipientRole` | enum | optional | broadcast 모드 NULL. per-recipient 모드 ✅ |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `metadata` | object | ✅ | |
| `createdAt` | Date | ✅ | |

> 채널별 sentAt 추적은 NotificationDeliveryAttempt.status로만 판단 (per-channel scope). PayloadRecord에는 channel 필드·sentAt 필드 없음 — N3-04 정정.
>
> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).

**Constraints**: `FK notificationLogId ON DELETE RESTRICT`.
**Index**: `(notificationLogId)`, `(recipientId, createdAt)`.

### 14.4 `NotificationDeliveryAttempt`

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `notificationLogId` | UUID | ✅ | FK |
| `payloadId` | UUID | ✅ | PayloadRecord FK |
| `recipientId` | Ref<C-23> | optional | broadcast → null |
| `channel` | enum | ✅ | email·slack·inApp |
| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
| `attemptNumber` | integer (1~) | ✅ | payloadId+channel 범위 sequence (§ 4.4 lock 메커니즘) |
| `dedupeMode` | enum | ✅ | normal·resend |
| `status` | DeliveryStatus | ✅ | processing(선점) → delivered/failed-*/deferred-*/deduped/skipped-* |
| `provider` | string | optional | |
| `providerResponseCode` | string | optional | |
| `providerResponseBody` | string | optional | 민감 마스킹 |
| `error` | string | optional | |
| `latencyMs` | number | optional | |
| `attemptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `failureClassification` | enum {transient, permanent, rate-limited} | optional | § 7.1 |

**Constraints**:
- `FK notificationLogId ON DELETE RESTRICT`, `FK payloadId ON DELETE RESTRICT`
- `UNIQUE(payloadId, channel, attemptNumber)` — N4-05 정정: sequence가 `(payloadId, channel)` 범위이므로 dedupeMode를 unique에서 제외. dedupeMode는 일반 컬럼
**Index**: `(notificationLogId)`, `(payloadId, channel)`, `(status, attemptedAt)`, `(failureClassification, attemptedAt)`, **`(payloadId, channel, status)` partial index where status IN ('processing','delivered','deferred-digest','deferred-quiet-hours','deferred-business-hours')** (§ 6.4 큐 worker 중복 방지 최적화 — N4-23).

> `broadcastAttemptId` 필드는 별도 보관하지 않음 (N4-15). broadcast DeliveryAttempt.id 자체가 식별자. DeliveryResult 합성 시 `broadcastDeliveries[].broadcastAttemptId = broadcast attempt.id`로 매핑.

### 14.5 `NotificationInbox` (in-app)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `recipientId` | Ref<C-23> | ✅ | |
| `payloadId` | UUID | ✅ | FK |
| `notificationLogId` | UUID | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `createdAt` | Date | ✅ | |
| `readAt` | Date | optional | |

**Constraints**: `FK payloadId ON DELETE RESTRICT`. `UNIQUE(payloadId)`.
**Index**: `(recipientId, readAt)`, `(recipientId, createdAt DESC)`.
**inactive UI 정책**: § 5.3 (NT-16 운영).

### 14.6 `NotificationLog` (envelope 단위 메트릭)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `instanceId` | Slug | ✅ | |
| `eventId` | string | ✅ | |
| `sourceEventId` | string | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `criticality` | enum | ✅ | |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `summary` | `{delivered, failed, deferred, deduped, skipped, broadcast: number}` | ✅ | |

**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.

### 14.7 `NotificationDigestBucket` + `NotificationDigestBucketPayload` (join table)

**NotificationDigestBucket**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `digest:{recipientId}:{policyKey}:{cadenceWindow}` |
| `recipientId` | Ref<C-23> | ✅ |
| `policyKey` | string | ✅ |
| `cadenceWindow` | string | ✅ — `YYYY-MM-DD` (daily) 또는 `YYYY-Wnn` (weekly) |
| `scheduledFor` | Date | ✅ |
| `digestSentAt` | Date | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**NotificationDigestBucketPayload** (join):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
| `payloadId` | UUID | ✅ — FK NotificationPayloadRecord ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
**Index**: `(scheduledFor, digestSentAt IS NULL)`, `(recipientId, policyKey)`.

### 14.8 `NotificationQuietHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `quiet:{recipientId}:{quietHoursWindowStart}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `scheduledFor` | Date | ✅ — quietHours 종료 |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.9 `NotificationBusinessHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `locationRef` | string | ✅ |
| `scheduledFor` | Date | ✅ |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.10 `NotificationDedupeCache` (Redis SoT)

```
키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
원자 연산: SET key value NX EX <ttl>
TTL:
  failed-retrying: dedupeWindowSeconds + 300
  delivered·failed-permanent: dedupeWindowSeconds
```

### 14.11 `NotificationDeadLetter` + `NotificationDeadLetterAttempt` (join table)

**NotificationDeadLetter**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `notificationLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `failingChannel` | enum | ✅ |
| `failureClassification` | enum | ✅ — permanent |
| `firstFailedAt` | Date | ✅ |
| `lastResendBy` | string | optional |
| `lastResendAt` | Date | optional |
| `resolvedAt` | Date | optional |
| `expiresAt` | Date | ✅ — 기본 30일 |

**Constraints (PostgreSQL 기준)**:
```sql
CREATE UNIQUE INDEX notification_dead_letter_active_unique
  ON notification_dead_letter (payload_id, failing_channel)
  WHERE resolved_at IS NULL;
```
(다른 DBMS는 generated column `isActive`로 대체 — N3-18 정정)

**Index**: `(expiresAt)`, `(resolvedAt IS NULL, firstFailedAt)`.

**NotificationDeadLetterAttempt** (join — N3-19 신설):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
| `attemptId` | UUID | ✅ — FK NotificationDeliveryAttempt ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(deadLetterId, attemptId)` (deadLetter 내 동일 attempt 중복 방지)
- **`UNIQUE(attemptId)`** — 1개 DeliveryAttempt는 정확히 1개 DLQ에만 속함 (N4-25 정정). 여러 DLQ 연결 의미 모호 회피

> NotificationDeliveryAttempt 보존 ≥ DeadLetter 보존 + `logRetentionDaysAfterDlqExpiry`. join FK가 RESTRICT라 보존 순서 강제.

#### 14.11.1 다른 DBMS (MySQL 등) 대체 schema (N4-26)

PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:

```sql
-- NotificationDeadLetter 추가 컬럼 (MySQL 5.7+/MariaDB 등 generated column 지원):
-- 활성 DLQ는 1 (resolved 안 됨), 종결된 DLQ는 NULL (unique 제약 무시) — N5-05 정정
activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
UNIQUE KEY notification_dead_letter_active_unique (payloadId, failingChannel, activeKey)

-- 결과:
--   - activeKey=1 row가 (payloadId, failingChannel)별 0~1건 (active DLQ unique)
--   - activeKey=NULL row(resolved 이력)는 unique 제약에서 무시 — MySQL NULL은 unique 충돌 발생 안 함, 다수 보존 허용
```

---


 succeeded in 1304ms:
# Feature — asset-ingestion

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 5개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1 / `docs/features/compliance-assistant.md` v1.0
> **목적**: 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·PII 처리·검수·promote(Core 데이터 계약 변환). 의료기관 신규 인스턴스 onboarding의 첫 단계.
> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4

---

## 0. 한 페이지 요약

- **Feature 식별자**: `asset-ingestion`
- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
- **source type 4종**: `web-crawl`·`sns-api`·`manual-upload`·`csv-import` (web-crawl·sns-api 법무 게이트 필수)
- **운영 모드**: v1.0은 `staged`만 (모든 asset 검수 필수). `auto-promote`는 v1.x (AI-11)
- **AutoApproveRiskLevel**: v1.0은 `null`만 (모든 asset 운영자 검수). Low 자동 approve는 v1.x (AI-15)
- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
- **DB 인벤토리**: **11 tables** — IngestionSource·IngestionLog·IngestionSourceAttempt·IngestionRetryQueue·IngestedAsset·ExtractedContent·**AssetPiiFinding(신설)**·AssetTag·AssetReviewRecord·AssetPromotionRecord·AssetIngestionNotificationOutbox + Blob storage 1종

---

## 1. 일반 규약

### 1.1 변경 정책 (F-22 cascade 컬럼 구체화)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 검토 |
| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
| 태깅 카탈로그·promote 매핑 변경 | **MAJOR** | policyVersion 신규 | Core 계약 호환성 검토 |
| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| **runtime invariant·reconcile 룰 추가·강화** | MINOR | 별개 | AI3-12 — § 13.4 신설 영역. 감지 룰은 운영 모니터링 영역. keyword-monitoring § 1.1 동등 |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 룰 매칭 SoT는 `features/compliance-assistant.md` § 3.3 `check()`
- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
- 자격증명·policyVersion·AssetIngestionApprovedScope SoT는 DATA_MODEL C-08 v0.18
- Core 데이터 계약 SoT는 DATA_MODEL C-01~C-22
- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)

### 1.2.1 공통 retry taxonomy (search-visibility § 1.2.1 동일)

| 큐 | maxAttempts |
|---|---|
| IngestionRetryQueue | config(기본 3) — configurable |
| AssetIngestionNotificationOutbox | 상수 5 |

### 1.3 본 문서가 다루지 않는 영역

- 룰 매칭 자체 — compliance-assistant
- 알림 채널·재시도 — notifications
- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "asset-ingestion"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성 (F-6 정합)

| 영역 | 의존 |
|---|---|
| compliance-assistant § 3.3 | `check()` — 자동 태깅에 활용. **의료기관 인스턴스에서 asset-ingestion 활성 시 compliance-assistant 활성 또는 `complianceAssistantExemptApproval` required** (build fail) |
| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.18 | assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope |
| DATA_MODEL C-23 | AdminUser (검수자·promote 권한) |
| DATA_MODEL C-01~C-22 | promote 대상 Core 데이터 계약 |

### 2.3 InstanceManifest

§ v0.1 § 2.3 유지 + 다음 정정:
- `webCrawl.approvedScope`는 **`AssetIngestionApprovedScope`**(C-08 v0.18) 타입 사용 — F-10 정합
- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
- `tagging.complianceAssistantInvocation` 옵션 (rule-based 외 compliance-assistant `check()` 호출 여부 — § 6.2)
- `review.autoApproveRiskLevel`: v1.0은 `null` 강제 (build fail 시 비-null 차단 — F-9)
- `promote.targetMapping` policyVersion: closed union 강제 — § 8

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command

v0.1 § 3.1 유지 + audit log contract (§ 3.1.1 신설).

### 3.1.1 audit log contract (F-4)

| AuditAction | contentRef | metadata 필수 필드 | 권한 |
|---|---|---|---|
| `asset-ingestion-source-registered` | `"ingestion-source:" + sourceId` | sourceType·configSummary·registeredBy | operator·super-admin |
| `asset-ingestion-source-unregistered` | `"ingestion-source:" + sourceId` | sourceType·activeBefore·activeAfter·unregisteredBy | operator·super-admin |
| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
| `asset-ingestion-asset-rejected` | `"asset:" + assetId` | rejectionReason·rejectedBy | operator·super-admin |
| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |

### 3.2 IngestionSource·RunIngestionInput·Result·queryIngestedAssets

§ v0.1 § 3.2~§ 3.5 유지.

---

## 4. 수집 파이프라인

### 4.1 실행 순서 — v0.1 § 4.1 유지

### 4.2 duplicate 감지 — canonicalization (F-17)

**canonicalization 알고리즘**:
- `rawBlobHash` = SHA-256(raw 본문 bytes) — 정확한 raw 동일성
- `normalizedTextHash` = SHA-256(text content 정규화 후) — HTML boilerplate·tracking parameter·whitespace 제거 후
- `sourceCanonicalKey` = sourceId + canonical URL path or filename — provenance 추적

UNIQUE 정책:
- `UNIQUE(instanceId, normalizedTextHash)` — duplicate 차단 기본
- `(instanceId, sourceId, sourceCanonicalKey)` index — provenance 조회

fuzzy matching은 AI-07 후속 (M2+). v1.0은 exact normalized hash만.

### 4.3 retry queue worker — search-visibility § 13.5 패턴 동일

---

## 5. source 어댑터

### 5.1 web-crawl (법무 게이트 — DATA_MODEL C-08 AssetIngestionApprovedScope SoT)

- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
- rate limit·robots.txt 준수

### 5.2 sns-api (법무 게이트 — F-12)

- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
- platform별 ToS 준수 (운영자 책임 — AI-01)
- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
- `allowedContentTypes` (post·comment·story·reel 등) 검증 — 외 type item도 skip

### 5.3 manual-upload · 5.4 csv-import — v0.1 § 5.3·5.4 유지

---

## 6. 파싱·태깅

### 6.1 파싱 — v0.1 § 6.1 유지

### 6.2 태깅 — compliance-assistant check() 호출 정확화 (F-5)

**rule-based + compliance-assistant 호출**:

```ts
// asset → compliance-assistant check() 호출 (raw asset 단계)
const result: ComplianceCheckResult = await complianceAssistant.check({
  contentType: "Feature",                              // CONTENT_STANDARDS § 7.1.1 정합
  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
  contentRef: `asset:${assetId}`,
  body: extractedContent.body,                          // ExtractedContent.body
  metadata: {
    pageTypeId: undefined,                              // 아직 미산정 (promote 시 결정)
    articleType: undefined,
    explicitRiskLevel: undefined
  },
  riskRules: instanceRules                              // 인스턴스 로드된 RiskRule[]
});
// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
// inferredRiskLevel·inlineRiskFlags[]는 compliance-assistant 내부 산출 — finding의 metadata로 노출

// AI2-12 — Feature contentType의 raw asset check 동작:
//   - pageTypeId·articleType 미지정 허용 (compliance-assistant § 3.3 fail 예외)
//   - feature-scoped rules + global rules만 적용 (pageType-specific rules 적용 안 함)
//   - inferredRiskLevel은 finding severity 기반 보수적 산정 (Medium 기본)
//   - 정식 RiskLevel은 promote 시점 contentType=Article 등으로 재호출 시 결정
```

- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장

**LLM 태깅** (`config.tagging.llmEnabled=true`):
- compliance-assistant llmAssist 패턴 차용 (synthetic ruleId 안정성·human-in-loop)
- 자동 분류: 추천 `contentType` (Article·TreatmentPage 등) + 신뢰도

---

## 7. 검수·promote 게이트 (F-15 의료광고·저작권·SNS 동의)

### 7.1 검수 워크플로

- **AssetReviewRecord 본체 상태** (`status` 필드 — asset content review): `pending` → `approved` / `rejected`
- **권한**: operator·super-admin (AI4-12 — asset content review 한정)
- SLA: `config.review.slaDays`(기본 7일)
- `autoApproveRiskLevel`: v1.0은 `null` 강제 — 모든 asset 운영자 검수
- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능

### 7.2 promote 게이트 (F-15)

운영자가 promote 액션 호출 전 다음 게이트 확인 필수:

| 게이트 | 조건 | 차단 동작 |
|---|---|---|
| 검수 상태 | `AssetReviewRecord.status === "approved"` | 미승인 시 runtime fail |
| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
| **저작권·동의 증빙** | 외부 출처 자료 시 `AssetReviewRecord.rightsReview.evidenceAttachments[]` 또는 `consentEvidenceRef` 필수 | 미첨부 시 차단 |

v0.2 최종 결정: **AssetReviewRecord.rightsReview** embedded 객체 (별도 테이블 미신설). 단 변경 이력은 `rightsReview.history[]` append-only 배열 보존 (AI2-04).

---

## 8. promote (Core 데이터 계약 변환 — F-7·F-8)

### 8.1 closed union TargetMapping (F-7)

```ts
type PromoteAssetInput = {
  assetId: string;
  targetContentType: TargetContentType;
  targetMapping: TargetMapping;                         // contentType별 closed union
};

type TargetContentType = "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ" | "NewsItem";
// AI2-05 — v1.0 promote 지원 5종 한정. ReviewPolicy·PricingPage·LocationProfile·ReservationPage·FacilitiesPage·ClinicProfile·DoctorProfile·ArticleCategory 등은
// v1.0에서 promote 미지원 → runtime fail. 해당 contentType 생성은 어드민 UI manual 처리. v1.x에서 contentType별 TargetMapping 추가 예정 (AI-17 신규)

type TargetMapping =
  | { kind: "Article"; mapping: ArticleTargetMapping }
  | { kind: "TreatmentPage"; mapping: TreatmentPageTargetMapping }
  | { kind: "MedicalConditionPage"; mapping: MedicalConditionPageTargetMapping }
  | { kind: "FAQ"; mapping: FaqTargetMapping }
  | { kind: "NewsItem"; mapping: NewsItemTargetMapping };

// Article은 DATA_MODEL C-04 v0.4 정합 (AI4-06 — 잔재 제거. closed union 전개)
type ArticleTargetMapping = {
  // required (C-04 SoT)
  headline: string;
  body: Markdown;
  author: Ref<C-02>;                                    // DoctorProfile @id
  datePublished: ISODateString;
  articleType: string;
  contentFormat: string;
  category: Ref<C-22>;
  pageRiskLevel: RiskLevel;
  // optional (C-04 v0.4 컨텍스트 필드)
  summary?: string;
  coAuthors?: Ref<C-02>[];
  reviewedBy?: Ref<C-02>;
  reviewedAt?: ISODateString;
  contentSource?: string;
  externalUrl?: URL;
  authorType?: string;
  dateModified?: ISODateString;
  embeddedMedia?: EmbeddedMedia[];
  // closed union — unknown field는 build/runtime fail
};

// TreatmentPage (DATA_MODEL C-03 v0.4 정합 — AI4-05 SoT 동등)
type TreatmentPageTargetMapping = {
  // required (C-03 SoT)
  name: string;
  overview: Markdown;
  mechanism: Markdown;
  targetAudience: Markdown;
  process: ProcessStep[];                  // C-03 하위 타입 재사용 (AI4-05 — Markdown 아님)
  precautions: Markdown;
  pageRiskLevel: RiskLevel;
  // optional (C-03 v0.4 컨텍스트 필드 — 하위 타입은 DATA_MODEL C-03 재사용)
  summary?: string;
  recommendedFor?: string[];
  treatmentComponents?: TreatmentComponent[];   // C-03 하위 타입
  visitFlow?: VisitFlowStep[];                   // C-03 하위 타입
  programVariants?: ProgramVariant[];            // AI4-05 — string[]이 아닌 ProgramVariant[]
  maintenancePlan?: string;
  remoteCareAvailable?: boolean;
  evidenceNotes?: EvidenceNote[];                // C-03 하위 타입
  cta?: Ref<CTAConfig>;
  relatedDoctors?: Ref<C-02>[];
  relatedConditions?: Ref<C-11>[];
  // closed union — unknown field는 runtime fail
};

// MedicalConditionPage
type MedicalConditionPageTargetMapping = {
  name: string;
  definition: Markdown;
  symptoms?: string[];
  causes?: string[];
  diagnosis?: Markdown;
  treatmentOptions?: Markdown;
  prevention?: Markdown;
  pageRiskLevel: RiskLevel;
  // closed union
};

// FAQ
type FaqTargetMapping = {
  question: string;
  answer: Markdown;
  category?: string;
  riskLevel: RiskLevel;
  // closed union
};

// NewsItem
type NewsItemTargetMapping = {
  headline: string;
  body: Markdown;
  category: string;                        // event-price 카테고리는 High RiskLevel 자동
  publishedDate: ISODateString;
  expirationDate?: ISODateString;
  riskLevel: RiskLevel;
  // closed union
};
```

**runtime validation**: TargetMapping의 mapping 객체에 contentType별 SoT 필수 필드 누락 또는 unknown field → fail.

### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)

**AssetPromotionRecord status 머신** (AI3-01 정정):

| status | 의미 |
|---|---|
| `checking` | 2단계 check() 진행 중 (외부 호출) |
| `pending-commit` | check() 성공·4단계 transaction 진입 직전 |
| `committed` | 4단계 transaction commit 성공 |
| `failed` | check() 실패·4단계 abort·게이트 재검증 실패 |

**forensic 필드** (AI3-01):
- `checkStartedAt`·`checkCompletedAt`·`commitStartedAt`·`commitCompletedAt`·`lastError`·`checkResultVersion`

**흐름**:

```
1. promote 게이트 사전 검증 (§ 7.2 — 미충족 시 runtime fail, AssetPromotionRecord 미생성)
2. **트랜잭션 외부 check()** (compliance-assistant):
   a. AssetPromotionRecord INSERT (status="checking", checkStartedAt=now())
   b. compliance-assistant.check() 호출 (외부 LLM·룰 로드·캐시 가능)
   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
   d. 실패 → AssetPromotionRecord UPDATE status="failed", lastError + 외부 sink alert + early exit
3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
   b. **연관 row lock 획득** — `SELECT ... FOR UPDATE` on IngestedAsset, AssetReviewRecord, AssetPiiFinding(assetId 범위)
   c. **게이트 재평가** (AI3-03): § 7.2 모든 게이트 재검증 + AssetReviewRecord.reviewVersion compare-and-set
      - 게이트 재검증 실패 → transaction abort (Core row 미생성). **3.a의 `commitStartedAt` update도 abort와 함께 rollback** (AI5-02 정합). **별도 짧은 transaction에서 AssetPromotionRecord UPDATE status="failed", lastError="gate-race-failure", failedAt=now() WHERE status='pending-commit'** (WHERE 조건으로 race 방지. commitStartedAt은 채우지 않음 — abort로 rollback된 상태) — AI4-03
   d. Core 데이터 계약 row INSERT (status="draft", `@provenanceAssetId`=assetId — AI4-11)
   e. ComplianceRecord pre-publish row 생성 (recordPhase="pre-publish", recordVersion=1, contentRef=Core row @id, autoCheckResult=2단계 결과)
   f. 콘텐츠 상태 `review-queued` 설정 (REVIEW_WORKFLOW § 2.1)
   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
   h. AssetPromotionRecord UPDATE status="committed", commitCompletedAt=now(), targetContentRef=Core row @id
   i. commit
4. **post-commit (별도 작업 — 외부 시스템 호출만)**:
   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
5. 이후 일반 REVIEW_WORKFLOW 흐름
```

**reconcile worker** (AI3-02 — SoT 명시. § 13.4 신설로 분리):

```
주기: 5분 간격
대상:
  - status="checking" + checkStartedAt < now() - 30분 → status="failed", lastError="checker-timeout"
  - status="pending-commit" + checkCompletedAt < now() - 10분 → status="failed", lastError="commit-stalled" (Core row·ComplianceRecord 미존재 시 — 존재 시 status="committed"로 수렴)
  - status="committed" + audit log 미존재 (24시간 내) → 재기록 시도. 재시도 3회 후 sink alert
```

---

## 9. PII 처리 (F-13·F-14)

### 9.1 PII 자동 감지·redaction

**탐지 알고리즘** (`config.pii.detectionTargets`):

- `email`: 표준 RFC 5322 regex
- `phone`: 한국 휴대전화 + 일반 전화 regex
- `ssn` (미국식): legacy 호환
- **`rrn` (한국 주민등록번호 — AI2-06 정확 알고리즘)**:
  - 후보 추출: `\b\d{6}-?[1-8]\d{6}\b` (하이픈 제거 후 13자리)
  - **생년월일·성별 코드 유효성**: 7번째 자리(성별 코드)로 세기 판정 — `1·2`=1900년대, `3·4`=2000년대, `5·6`=1900년대 외국인, `7·8`=2000년대 외국인. 앞 6자리는 YYMMDD 유효 일자
  - **checksum 검증 (정확 공식)**:
    ```
    가중치 W = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
    sum = Σ (digit[i] × W[i]) for i=0..11
    checkDigit = (11 - (sum % 11)) % 10
    valid = checkDigit === digit[12]
    ```
  - 검증 실패: PII 미분류 (regex 우연 일치 false-positive) — confidence=0
  - 검증 통과: PII 분류 confidence=1.0
  - 하이픈 처리: 입력 시 하이픈 유무 모두 허용. 정규화하여 검증

**redaction mode**:
- `mask`: RRN 전용 마스킹 `######-*******`. 일반 텍스트는 부분 마스킹
- `remove`: 해당 부분 제거

**저장 분리** (AI3-06 정확화):
- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
- **ExtractedContent.body**: redacted view (운영자·검수자 일반 표시용)
- **AssetPiiFinding** (§ 16.7): 발견 내역 구조화 저장. offset은 rawBody 기준

### 9.2 의료법·저작권 게이트 — § 7.2 promote 게이트로 강제

---

## 10. 알림 (outbox 패턴)

### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)

| eventType | criticality | 즉시 채널 | fallback | digest | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|
| `asset-ingestion-batch-completed` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | high | email + inApp | inApp | — | respect | mandatory |
| `asset-ingestion-review-required` | normal | inApp | (없음) | email 일일 | respect | digestOptOut 허용 |
| **`asset-ingestion-pii-detected`** | **critical** (F-3) | email + inApp | inApp | — | bypass | mandatory |
| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |

### 10.2 outbox 패턴

search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).

### 10.3 NotificationEvent 필드 매핑 (F-2)

| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
|---|---|---|---|---|---|
| `asset-ingestion-batch-completed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 완료 — ${date}"` | ingestionLogId·perSource summary |
| `asset-ingestion-batch-failed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 실패 — ${date}"` | ingestionLogId·failedSources[] |
| `asset-ingestion-review-required` | `asset` | assetId | `"asset:" + assetId` | `"검수 필요 — ${assetTitle}"` | assetId·sourceType·tags |
| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |

**dedupe 단위** (AI2-10):
- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)

`sourceEventId = hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` (search-visibility 패턴).

---

## 11. 운영 지표

### 11.1 핵심 지표 (F-21 표 컬럼 정정)

| 지표 | 정의 | 목표 |
|---|---|---|
| 수집 cycle 성공율 | envelopeState="completed" / 전체 | > 99% |
| 자산 수집 건수 | per source per cycle | baseline |
| duplicate 비율 | assetsDeduped / 전체 | baseline |
| 검수 SLA 준수율 | slaDays 내 처리 / 전체 | > 95% |
| LLM 태깅 적용율 (활성 시) | LLM success / 전체 | > 95% |
| PII 감지 적중률 | 운영자 confirmed / 자동 감지 | > 80% (M2+ baseline) |
| promote율 | promoted / approved | baseline |
| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
| **RRN candidate count** (AI3-11) | regex 후보 수 / 전체 ingested asset 수 | baseline (운영 30일 누적) |
| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
| **PII true-positive rate** | reviewStatus="true-positive" / 전체 finding | baseline (M2+) |
| **PII false-positive rate** | reviewStatus="false-positive" / 전체 finding | < 30% (M2+ baseline) |
| **redaction completion SLA** | promoteAsset 시점에 모든 finding redactionApplied or false-positive 비율 | > 99% |

### 11.2 alert — v0.1 § 11.2 유지

---

## 12. 설치·설정·운영 모드

### 12.1 빌드 단계 — v0.1 § 12.1 유지 + DB 11 tables

### 12.2 운영 모드

- **staged** (v1.0): 모든 asset 운영자 검수 필수. `autoApproveRiskLevel=null` 강제
- **auto-promote** (v1.x — AI-11): Low risk 자동 promote

---

## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)

### 13.1 build-time fail

- `enabled=true` + `assetIngestionConfig` 누락
- `assetIngestionPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- **의료기관 인스턴스에서 `enabled=true` + `compliance-assistant` 비활성 + `complianceAssistantExemptApproval` 누락** (F-6)
- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
- `tagging.llmEnabled=true` + LLM credential 누락
- `tagging.tagCatalogVersion` 누락
- `pii.autoRedactEnabled=true` + `detectionTargets` 빈 배열
- **`review.autoApproveRiskLevel !== null`** (v1.0 한정 — F-9)
- `promote.autoMappingEnabled=true` (v1.0 미지원)
- `mode="auto-promote"` (v1.0 미지원)
- `blobStorage.provider !== "s3"` (v1.0)
- `blobStorage.bucket`·`signedUrlTtlSeconds` 누락
- `notifications` 비활성 + 본 Feature `enabled=true` (notifications는 본 Feature 필수)

### 13.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- manual-upload `allowedMimeTypes` 외 또는 maxFileSizeMb 초과
- csv-import 행 수 > maxRowsPerImport
- **`promoteAsset` 게이트 미충족** (§ 7.2): 검수 미승인·rights 미승인·PII 미처리·증빙 미첨부
- **`promoteAsset` targetMapping의 contentType별 필수 필드 누락 또는 unknown field** (F-7)
- **`promoteAsset` targetContentType이 v1.0 unsupported** (AI3-09 — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 외) → fail + AssetTag `manualProcessingRequired=true` 마킹 (asset 상태는 approved 유지. 어드민 UI manual Core editor 경로. manual 생성 Core row는 `provenanceAssetId` 필드 보존)
- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`

### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)

**`blobKeyVersion` null backfill** (AI5-04 — 기존 v0.1·v0.2 운영 데이터 환경):
- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)


**v0.2 → v0.3 blob key format migration**:
- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
- **policy**:
  - **lazy rewrite** (기본): 신규 asset만 v0.3 format 사용. 기존 v0.2 blob은 그대로 두고 `IngestedAsset.blobKeyVersion` 필드(`"v0.2" | "v0.3"`)로 분기 — signed URL 발급 시 version별 path 사용
  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제

### 13.4 runtime invariant·reconcile (AI3-02 + AI3-12 SemVer 정책 — 별도 분리)

호출 입력 검증 아닌 운영 invariant — 감지 시 reconcile job + 외부 sink alert:

- **AssetPromotionRecord stale** (AI4-04 join key 명시):
  - status="checking" + checkStartedAt < now()-30분 → `UPDATE WHERE status='checking'` SET status="failed", lastError="checker-timeout"
  - status="pending-commit" + checkCompletedAt < now()-10분 → **3종 존재 검사 (AI4-04 + AI5-01 targetContentRef null 처리)**:
    - **Core row 조회 분기** (AI5-01):
      - targetContentRef 존재 시 → `WHERE @provenanceAssetId=assetId AND @id=targetContentRef`
      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
    - ComplianceRecord: `WHERE contentRef=targetContentRef AND recordPhase='pre-publish' AND recordVersion=1` (Core row 조회 후 확정된 targetContentRef 사용)
    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
    - **3종 모두 존재 → status="committed"**, commitCompletedAt=Core row @createdAt + targetContentRef backfill (필요 시)
    - **0건 또는 partial 존재 → status="failed"**, lastError="commit-stalled-partial" + 외부 sink alert (운영자가 partial row 정리)
  - status="committed" + audit log 미존재 (24h) → audit 재기록 3회. 실패 시 sink alert
- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
- **AssetIngestionNotificationOutbox dispatch-failed-permanent** 누적 임계 초과 → 운영팀 alert
- **`ExtractedContent.piiDetected` denormalized drift 감지** (AI4-07): `piiDetected != (exists AssetPiiFinding for assetId)` 감지 시 backfill + 외부 sink alert

### 13.5 warning — v0.1 § 13.3 유지 (변경 없음)

---

## 14. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AI-01 | SNS platform별 ToS 위반 위험 — Glitzy vs 클라이언트 책임 분리 | 법무 검토 (게이트는 v1.0 fail로 강제) |
| AI-02 | 외부 사이트 인용 저작권 검토 | 법무 검토 |
| AI-03 | SNS 자료 사용 동의 절차 | 클라이언트 사전 협의 |
| AI-04 | 추가 source type (Notion·구글 드라이브 등) | v1.x |
| AI-05 | LLM 태깅 prompt 카탈로그·다국어 | M2+ |
| AI-06 | PII 감지 LLM 기반 정밀도 향상 | M2+ |
| AI-07 | duplicate fuzzy matching | M2+ |
| AI-08 | OCR 활성화 (LLM 기반) | v1.x |
| AI-09 | 의료광고 카탈로그 자동 매핑 | M2+ |
| AI-10 | 검수자 라운드로빈·assignment | M2+ |
| AI-11 | auto-promote mode + LLM 자동 매핑 | v1.x |
| AI-12 | 비디오 frame extraction | v1.x |
| AI-13 | retroactive promote | M2+ |
| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
| AI-15 | autoApproveRiskLevel="Low" 운영 정책·근거 | v1.x |
| AI-16 | signed URL refresh client SDK·blob signed URL renewal strategy | 인프라 결정 (search-visibility SV-14 동등) |
| AI-17 | v1.x promote 지원 contentType 확장 (ReviewPolicy·PricingPage·LocationProfile 등) | v1.x |
| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |

---

## 15. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적 전건 수용)
| 2026-05-14 | v0.3 | codex 2차 (14 지적 전건 수용)
| 2026-05-14 | v0.4 | codex 3차 (12 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (12 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |

---

## 16. 본 Feature 내부 데이터 구조 (admin DB 11 tables + blob storage)

### 16.1 `IngestionSource`·16.2 `IngestionLog`·16.3 `IngestionSourceAttempt`·16.4 `IngestionRetryQueue`

search-visibility 패턴 동일 (MonitoringLog·MonitoringSourceAttempt·SearchVisibilityCollectionRetryQueue 동등).

### 16.5 `IngestedAsset`

v0.1 § 16.4 유지 + canonicalization 필드 추가:

| 추가 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `rawBlobHash` | string | ✅ | SHA-256 raw bytes |
| `normalizedTextHash` | string | ✅ | SHA-256 정규화 후 text |
| `sourceCanonicalKey` | string | ✅ | sourceId + canonical URL/filename |
| `blobKeyVersion` | enum (`v0.2`·`v0.3`) | ✅ | (AI4-08) 신규 row default `v0.3`. v0.2 row는 lazy rewrite (§ 13.3). signed URL 발급 worker가 version별 path 분기 |

**Constraints**: `UNIQUE(instanceId, normalizedTextHash)` (duplicate 차단).
**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.

### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)

v0.1 § 16.5 + 다음 정정:
- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
- **`body`** (Markdown — **materialized view**: rawBody + AssetPiiFinding(reviewStatus="true-positive" AND redactionApplied=true) redaction operations로 자동 재생성). **직접 편집 금지** (AI4-09). 수동 redaction은 detector="manual"인 AssetPiiFinding 추가로 수행 → body는 redaction worker가 재생성
- **rebuild trigger** (AI5-03): 다음 이벤트 발생 시 `RedactionRebuildJob(assetId, extractedContentId, sourceVersion)` enqueue:
  - `ExtractedContent.rawBody` update
  - `AssetPiiFinding` insert / update(reviewStatus·redactionApplied·redactionMode 변경) / delete
  - worker는 sourceVersion 입력으로 idempotent 처리. 동일 sourceVersion 중복 enqueue는 1회만 처리. 결과는 body·bodyVersion(+1)·piiDetected·piiRedacted를 단일 transaction에서 원자 갱신
- `piiDetected`·`piiRedacted` boolean — denormalized summary (AI4-07 reconcile invariant 적용)
- `bodyVersion` integer — rawBody·AssetPiiFinding 변경 시 1씩 증가 (caching·drift 추적)
- 상세는 § 16.7

### 16.7 `AssetPiiFinding` (신설 — F-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `assetId` | UUID | ✅ — FK IngestedAsset |
| `extractedContentId` | UUID | ✅ — FK ExtractedContent |
| `type` | enum (`email`·`phone`·`ssn`·`rrn`·`other`) | ✅ |
| `offsetStart`·`offsetEnd` | integer | ✅ — **`ExtractedContent.rawBody` 내 위치 (AI3-06 — redaction 전 원본 기준)**. redacted view 위치는 별도 `redactedOffsetStart`·`redactedOffsetEnd` 필드 또는 mapping 계산 |
| `redactedOffsetStart`·`redactedOffsetEnd` | integer | optional — redaction 적용 후 view 내 위치 (null = redaction으로 사라진 영역). 재검수·false-positive 복원에 사용 |
| `contextHash` | string | ✅ — SHA-256(rawBody의 finding 주변 ±50자 context). 원문 보존 없이도 재현성 확인 가능 |
| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
| `confidence` | number (0~1) | optional |
| `redactionApplied` | boolean | ✅ |
| `redactionMode` | enum (`mask`·`remove`) | optional |
| `reviewStatus` | enum (`open`·`true-positive`·`false-positive`) | ✅ — AI3-05 단순화. `resolved`는 의미 모호로 제거 |
| `reviewedBy`·`reviewedAt` | string·Date | optional |
| `detectedAt` | Date | ✅ |

**Index**: `(assetId)`, `(reviewStatus, detectedAt)`.

### 16.8 `AssetTag` — v0.1 § 16.6 유지

### 16.9 `AssetReviewRecord` (F-15 rightsReview + AI5-05 reviewVersion)

v0.1 § 16.7 + `rightsReview` 객체 + **`reviewVersion: integer required`** (AI5-05):
- promote transaction의 CAS 입력 (§ 8.2 3.a)
- 다음 변경 시 증가: asset content review status 변경(approved/rejected) · rightsReview 상태/evidence/history 변경 · AssetPiiFinding 변경(드물게)



```ts
rightsReview: {
  required: boolean,                      // 외부 URL·SNS·환자 후기·전후사진 감지 시 true
  status: "pending" | "approved" | "rejected" | "not-required",
  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
  currentReviewedAt?: Date,
  evidenceAttachments: Array<{
    kind: "copyright-license"|"consent-form"|"author-permission"|"public-domain"|"fair-use-note",
    blobRef: string,
    addedBy: string,
    addedAt: Date,
    superseded: boolean                   // 새 증빙으로 대체된 경우 true (삭제 금지 — append-only)
  }>,
  consentEvidenceRef?: string,
  history: Array<{                        // AI2-04 — append-only 변경 이력
    timestamp: Date,
    actorId: string,
    actorRole: string,
    action: "status-changed"|"evidence-added"|"evidence-superseded"|"reviewer-assigned",
    fromStatus?: string,
    toStatus?: string,
    note?: string
  }>
}
```

**증빙 삭제 금지** (AI2-04): evidenceAttachments는 append-only. 잘못 추가된 증빙은 `superseded: true` 마킹 + history에 evidence-superseded 기록. 물리 삭제 금지.

**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.

**action별 권한 매트릭스 + UI 표시 정책** (AI3-10):

| action | 허용 권한 | UI 표시 |
|---|---|---|
| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
| `reviewer-assigned` | super-admin (operator 불가) | 검수자 배정 폼 |

UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.

### 16.10 `AssetPromotionRecord` (AI4-01 — 풀 스키마 전개)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `assetId` | UUID | ✅ — FK IngestedAsset | |
| `targetContentType` | enum (Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem) | ✅ | v1.0 closed union 5종 |
| `targetContentRef` | string | optional → ✅ when status="committed" | Core row @id. transaction 3.h에서 채움 |
| `status` | enum (`checking`·`pending-commit`·`committed`·`failed`) | ✅ | 4상태 머신 |
| `targetMappingJson` | JSON | ✅ | TargetMapping 결과 |
| `checkResultVersion` | string | optional | 2단계 check() 결과 식별자 |
| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
| `promotedBy` | string | ✅ | AdminUser @id |
| `checkStartedAt` | Date | ✅ | |
| `checkCompletedAt` | Date | optional | |
| `commitStartedAt` | Date | optional | transaction 3.a |
| `commitCompletedAt` | Date | optional | transaction 3.i commit |
| `failedAt` | Date | optional | |
| `lastError` | string | optional | gate-race-failure·checker-timeout·commit-stalled-partial 등 |
| `createdAt`·`updatedAt` | Date | ✅ | |

**Index**: `(status, checkStartedAt)` partial where status='checking' (reconcile worker query), `(status, checkCompletedAt)` partial where status='pending-commit', `(assetId)`.
**Constraints**: `FK assetId ON DELETE RESTRICT`. status committed 시 targetContentRef NOT NULL invariant — § 13.4 reconcile.

### 16.11 `AssetIngestionNotificationOutbox` (F-18 구체화 — keyword-monitoring § 13.8 패턴 동일)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (`ingestion-log`·`asset`·`pii-finding`) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | NotificationEventType | ✅ |
| `payloadJson` | JSON | ✅ |
| `sourceEventId` | string | ✅ — `hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` |
| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
| `claimedAt`·`dispatchedAt` | Date | optional |
| `attempts` | integer | ✅ |
| `lastError` | string | optional |
| `notificationEventId`·`notificationReceiptState` | string | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(claim, claimedAt)`.

### 16.12 Blob storage (S3 — F-19)

object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.

**IAM 정책 SoT** (search-visibility § 13.7 패턴):
- canonical key format 강제
- signed URL 발급 API는 호출자 AdminUser.instanceMemberships 검증
- S3 IAM PrincipalTag condition으로 cross-instance access 차단
- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
- `redacted/` prefix는 operator·검수자 모두 read 가능
- signed URL TTL 600초 + dashboard refresh client SDK (AI-16 신규 — 인프라 결정)

---


 succeeded in 1308ms:
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


 succeeded in 1297ms:
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
session id: 019e2743-b284-75a3-ba87-4e8d4d59bf07
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.3 (3차 사이클)

## 컨텍스트

2차 비평(23 지적: blocking 7 + major 11 + minor 5) 전건 수용. v0.3 핵심 변경:
- § 2.4 CAS digest 알고리즘 SoT — Merkle/chunked·snapshot fallback (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·requestFingerprint)
- irreversible 자동 skip 금지 — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep
- § 4.7 legalImpactClassifier deterministic rule SoT + LLM v1.0 금지 + fail-closed
- 8필드 CAS (6필드 + legalImpactClassificationDigest + classifierVersion)
- § 3.6 writeSetManifest partial write 감지 (expectedAffectedRows·beforeDigest·afterDigest·committedRowIds·invariantQueryResults)
- § 3.5 step type registry 최소 계약 + cooperativeCancellation 강제 + mutableFieldDenylist (body MV 보호)
- § 4.8 policyReevaluate defaultReportingMode=risk-based + LegalDocument·ReviewPolicy·priorReviewRequired·Critical은 new-record-version 강제
- § 4.5 writeClass 7종 세분화 (notification-emit-outbox·dispatch·read-receipt·digest-state 분리)
- § 3.1 command-audit-event 매핑 표 + 4종 AuditAction 본문 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered)
- § 3.4 idempotency unique scope 명시 + 8필드 fingerprint
- § 3.7 read API privacy class 표
- § 4.6 outbox SQL 자체 전개
- featureLegalApproved (Feature 활성화) vs ContentMigrationLegalApproval (plan-level) 분리
- § 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true
- § 3.1.1 AuditAction metadata 표 (actorRole·policy snapshot)
- § 6.2 INV-* invariant 매핑 (15종)
- § 12 10 tables 최소 constraints

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.3을 이전과 동일한 강도로 엄정하게 비평하라:

1. **2차 지적 재발 여부**: 23개가 실제로 정정됐는가?
2. **v0.3 신규 메커니즘 모순·미진함**:
   - 8필드 CAS — 운영 현실에서 모든 8필드를 매번 산정·전달 가능한가? UI/API client 부담?
   - writeSetManifest beforeDigest/afterDigest 산정 비용 (대량 row의 hash) — 대안?
   - legalImpactClassifier deterministic rule이 8 class를 모두 fail-closed로 닫을 수 있는가? rule input(PII 필드 카탈로그·targetEntityTypes)이 정확한가?
   - cooperativeCancellation 미지원 step + transactionBoundary != "per-chunk" → warning인데 fail이 되어야 하지 않나?
   - § 4.5 writeClass 7종에서 `notification-dispatch`가 read-only window 중 허용되지만, dispatch가 외부 채널 (email·slack·webhook) write를 트리거하는데 이게 안전한가?
   - cancellation-timeout-manual-review 상태 진입 후 복구 경로
   - policy-reevaluate `risk-based`에서 "Critical risk 상승" 판정 누구가 — compliance-assistant check() 응답에 risk 필드?
3. **DB 10 tables 최소 constraints 완결성**:
   - § 12.1-§ 12.10 각 테이블의 FK·CHECK·partial unique·CAS column이 운영상 충돌 없이 동시 실행 가능한가
   - ContentMigrationRun status enum 12종이 너무 많지 않은가
   - § 12.6 ContentMigrationStepRetryQueue worker SQL "v0.4에서 풀 전개" — v0.3에서도 핵심 SoT SQL은 명시되어야 함
4. **REVIEW_WORKFLOW cascade 부족 (CM2-12 잔여)**:
   - v0.3 § 3.1.1에 audit 13종 정의했지만 REVIEW_WORKFLOW § 10.2.1에는 9종만 cascade됨 — dry-run-completed·run-paused·run-resumed·run-failed·rollback-triggered 4종 cascade 필요
5. **이전 Feature와 패턴 정합성**:
   - crm-sync v1.0의 partial unique 3종(active·rotating-target·committed) 패턴 — ContentMigrationCredentialVersion 같은 신설 없는데 본 Feature의 ContentMigrationRun status에 비슷한 invariant가 필요한가?
   - asset-ingestion v1.0 body materialized view denylist 패턴 — 본 Feature § 3.5 mutableFieldDenylist 적정한가
   - compliance-assistant v1.0 cacheKey·durable cache — § 3.2.5·§ 4.8 정확한 재사용
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 일관성
   - § 1.1 SemVer 표가 v0.3 신규를 모두 다루는가
   - § 6.2 INV-* 15종과 § 9 fail/invariant 1:1 매핑 traceability 추가 필요?
   - 잔여 "v0.2 동일" 표현 (plan kind 6종·NotificationEventType·NotificationEvent 매핑·retry 우선순위 표)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM3-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle2_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
codex
요청 범위가 명세 리뷰라서 먼저 대상 문서와 관련 SoT를 읽고, 2차 응답의 항목별 수용 여부와 v0.3 자체 모순을 분리해서 추적하겠습니다. JSON만 최종 출력해야 하므로 중간에는 검토 진행 상황만 짧게 공유하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw .codex-reviews\\cm_cycle2_response.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
 succeeded in 674ms:
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
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered";
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
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |

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
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차 cycle cascade (CM1-02·10)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증 (CM1-10)
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped";         // irreversible step skip (CM1-21)
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


 succeeded in 692ms:
# Feature — content-migration

> **상태**: Draft v0.3 (codex 자동 비평 2차 반영 — 23개 지적 전건 수용)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존. **외부 raw 수집은 asset-ingestion**. **DB DDL은 인프라 책임**.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + 9종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.21
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff boundary → § 1.3
> - retry queue·outbox worker SQL → search-visibility § 13.5·§ 13.10 (본 문서 § 4.6·§ 12.6 자체 전개)

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) step별 rollbackClass 강제 + writeSetManifest partial write 감지, (c) read-only window writeClass 세분화, (d) dry-run/apply drift Merkle digest CAS, (e) policy-version-reevaluate risk-based reportingMode, (f) deterministic rule legalImpactClassifier fail-closed, (g) skip은 super-admin 명시 승인 + remediationTicketRef
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw sourcing + promote. 본 Feature=promote 이후 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가. body materialized view 직접 수정 금지 (CM2-14)
- **vs DB DDL**: DDL은 인프라. 본 Feature는 application-data backfill·정규화만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지)
- **DB 인벤토리**: **10 tables** (§ 12 — 최소 constraints 명시)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM2-15 보강)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| step type 제거 | **MAJOR** | 별개 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **CAS digest algorithm·projection 변경** (CM2-15) | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| **reportingMode default 변경** (CM2-15) | **MAJOR** | policyVersion 신규 | |
| **read-only window writeClass 세분화·정책 변경** (CM2-15) | **MAJOR** | policyVersion 신규 | |
| **irreversible skip 정책 변경** (CM2-15) | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest schema 변경** (CM2-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion → DATA_MODEL C-08 v0.21
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.4 batch contract SoT)
- 본 문서 = plan/step/실행 파이프라인·rollbackClass·writeSetManifest·CAS digest 알고리즘·legalImpactClassifier rule·read-only writeClass 표·step registry 최소 계약·privacy schema SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 전개 SQL |

### 1.3 본 문서가 다루지 않는 영역 (handoff boundary)

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote (Core 계약 변환) | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view (rawBody + redaction op) 직접 변경 | **금지** — raw source 또는 approved redaction 통해서만 (CM2-14) |
| DB DDL (PostgreSQL `ALTER`·column add/rename·index) | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "0.3"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction |
| DATA_MODEL C-08 v0.21 | `contentMigrationConfig`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() batch + cacheKey 재사용 |
| asset-ingestion | promote handoff + body materialized view 보호 |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox 패턴 reference (본 문서 자체 SQL) |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.21
  featureLegalApproved: true                            # CM2-21 — Feature 활성화 게이트 (plan-level과 분리)
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

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.3.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox", "notification-dispatch"]
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"                   # pause | rollback-then-pause | rollback
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"  # CM2-22 — random | deterministic-stratified
        impactSamplingSize: 100
        criticalClassFullDiff: true                     # CM2-22 — legal·PII·priorReviewRequired 대상은 full diff 강제
        digest:
          chunkSize: 10000                              # CM2-01 — chunked Merkle
          maxRowsBeforeSnapshot: 1000000                # 임계 초과 시 snapshot-based digest
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"              # CM2-08 — risk-based | stale-flags-only | new-record-version
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"  # CM2-01 — Merkle digest
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT (CM2-01·11)

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body — steps·targetSelector·rollbackClass·legalImpactClassification 포함)). char(64) |
| `targetSetDigest` (CM2-01) | **chunked Merkle**: target primary key 정렬 → chunkSize(기본 10000)별 SHA-256 → 최종 Merkle root. selector version + tenant scope 포함. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` (CM2-01) | step별 read-set field projection canonical JSON → chunked Merkle. step별 별도 산정 |
| `sourceSnapshotWatermark` (CM2-11) | source table별 `MAX(updated_at)` + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` (CM2-11) | (`contentMigrationPolicyVersion` + `complianceAssistantPolicyVersion` + ruleCatalogVersion + ruleFileHashes 모음 + REVIEW_WORKFLOW version) canonical digest |
| `stepRegistryVersion` | step type registry 등록 카탈로그 hash |
| `legalImpactClassificationDigest` (CM2-04) | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 fingerprint — § 3.4 |

dry-run과 apply preflight는 동일 함수 사용. 비용 상한:
- `targetSetDigest` 계산 비용 > 5분 → snapshot-based digest 사용 (target set snapshot 기록 후 hash)
- `contentHashDigest` step별 read-set 임계 초과 시 동일

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM2-12 매핑)

| 종류 | 함수 | 책임 | 권한 | AuditAction | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | plan-defined | (없음) |
| 실행 | `validatePlan` | step·rollbackClass·legalImpactClassifier | super-admin | plan-validated | (없음) |
| 실행 | `runDryRun` | dry-run + DryRunReport | super-admin | dry-run-completed (CM2-12 추가) | (없음) |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | plan-legal-approved | plan-legal-approved |
| 실행 | `runApply` | apply (CAS) | super-admin | run-started | (없음) |
| 실행 | `pauseRun` | step boundary pause | super-admin | run-paused (CM2-12 추가) | (없음) |
| 실행 | `resumeRun` | resume | super-admin | run-resumed (CM2-12 추가) | (없음) |
| 실행 | `cancelRun` | cooperative cancellation | super-admin | run-cancelled | (없음) |
| 실행 | `rollbackRun` | scope: full / from-step | super-admin | rollback-triggered (CM2-12 추가)·rollback-applied | rollback-triggered |
| 실행 | `skipStep` | irreversible/manual-remediation 한정 | super-admin + remediationTicketRef | step-skipped | (없음) |
| 실행 (자동) | run completion | run 완료 시 | system | run-completed 또는 run-failed | run-completed 또는 run-failed |
| read | `queryPlans` (privacy class) | plan 목록·detail | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | run 진행·결과 | 동일 | — | — |
| read | `queryStepResults` (privacy class·masking) | step 입력/출력 (PII closed schema masking) | 동일 | — | — |

**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).

### 3.1.1 AuditAction metadata (CM2-23)

| AuditAction | metadata 필수 | actorRole 필수 |
|---|---|---|
| plan-defined | planKind·targetEntityCount·idempotencyKey·planFingerprint·classifierVersion | super-admin |
| plan-validated | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion | super-admin |
| plan-legal-approved | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policySnapshotVersion | legal-reviewer |
| dry-run-completed | reportId·6필드 digest·sampling 통계·blockedDriftCount | super-admin |
| run-started | mode·planId·expectedDryRunReportId·6필드 CAS·classifierVersion·policySnapshotDigest | super-admin |
| run-paused | runId·step boundary·reason·pausedBy | super-admin |
| run-resumed | runId·resumedBy·pausedDurationSeconds | super-admin |
| run-completed | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount | system |
| run-failed | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef | system |
| run-cancelled | cancelledBy·reason·completedSteps·partialCommitRollbackRequired | super-admin |
| rollback-triggered | runId·scope·reason·expectedStatus·triggeredBy | super-admin |
| rollback-applied | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) | super-admin |
| step-skipped | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion | super-admin |

### 3.2 plan kind 정의 (6종) — v0.2 § 3.2 동일

### 3.3 DTO

```ts
type MigrationPlanKind =
  | "application-data-version-upgrade"
  | "feature-activation-backfill"
  | "instance-to-instance-copy"
  | "content-bulk-transform"
  | "policy-version-reevaluate"
  | "routing-slug-preservation";

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
  stepType: string;                                      // registry 등록 — § 3.5 최소 계약
  inputs: Record<string, unknown>;                       // step registry input schema에 통과
  rollbackClass: RollbackClass;
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // rollbackClass=irreversible 필수
  backupSnapshotRequired?: boolean;                     // rollbackClass=irreversible 필수 true 권장
  retryable: boolean;
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: Array<LegalImpactClass>;
  classifierVersion: string;
  unknownClassesEncountered: boolean;                    // CM2-03 — true이면 legalGateRequired=true fail-closed
};

type LegalImpactClass =
  | "pii" | "legal-document" | "review-policy" | "pricing-page"
  | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy";

type RunApplyInput = {
  planId: string;
  expectedDryRunReportId: string;
  // 6필드 CAS (CM2-04 확장)
  expectedPlanFingerprint: string;
  expectedTargetSetDigest: string;
  expectedSourceSnapshotWatermark: string;
  expectedPolicyVersionSnapshot: string;
  expectedStepRegistryVersion: string;
  expectedContentHashDigest: string;
  expectedLegalImpactClassificationDigest: string;       // CM2-04 — legal gate 우회 차단
  expectedClassifierVersion: string;                     // CM2-04 — classifier 업데이트 시 dry-run 재수행 강제
  forceProceedDespiteWarnings?: boolean;                 // legal/critical warning에는 적용 안 됨 (CM2-04)
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;
  rollbackClass: "irreversible" | "manual-remediation-required";
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
};
```

### 3.4 idempotencyKey + requestFingerprint (CM2-13 — content-migration scope)

| command | scope | requestFingerprint 산정 |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan body)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planId + ":" + expectedDryRunReportId + ":" + 6필드 + classifierVersion + legalImpactClassificationDigest) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef) |

same-request replay (fingerprint 일치) → 기존 결과 반환. mismatched collision (fingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert.

### 3.5 step type registry 최소 계약 (CM2-17·CM2-07·CM2-14)

step registry에 등록된 각 stepType은 다음 계약을 통과해야 함 (validate fail 룰):

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: string[];                          // 영향 가능 entity type allowlist
  readSetProjection: FieldProjection[];                 // contentHashDigest 산정 시 사용
  writeSetProjection: FieldProjection[];                // writeSetManifest 산정 시 사용
  rollbackClassDefault: RollbackClass;
  legalClassHints: LegalImpactClass[];                  // 사전 분류 hint (classifier 보조)
  cancellationSupport: {
    supportsCooperativeCancellation: boolean;           // false면 isolated chunk만 허용 (CM2-07)
    cancellationCheckInterval: number;                  // 초
    maxUninterruptibleSeconds: number;                  // 임계 초과 시 validate warning
    transactionBoundary: "per-row" | "per-chunk" | "per-step";
  };
  partialWriteDetector: PartialWriteDetector;           // CM2-06 — writeSetManifest 산정 fn
  dryRunCostEstimateSecondsPerThousandRows: number;
  mutableFieldAllowlist?: string[];                     // CM2-14 — asset-ingestion body 보호
  mutableFieldDenylist?: string[];                      // 동일
};
```

asset-ingestion `ExtractedContent.body` materialized view는 모든 step의 default `mutableFieldDenylist`에 포함 (CM2-14).

### 3.6 writeSetManifest — partial write 감지 (CM2-06)

각 step 실행 시 StepResult에 다음 기록:

```ts
type WriteSetManifest = {
  expectedAffectedRows: number;
  beforeDigest: string;                                 // 영향 row chunked Merkle (실행 전)
  afterDigest: string;                                  // 실행 후
  committedRowIds: string[] | { chunkIds: string[] };  // 임계 초과 시 chunkIds
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;  // per-step invariant
};
```

partial write 감지 조건 (rollback 우선 트리거):
- `expectedAffectedRows ≠ committed rows count`
- `afterDigest`가 `beforeDigest` + 예상 변경 외 다른 변경 포함
- `invariantQueryResults`에 `passed=false` 존재

### 3.7 read API privacy class (CM2-16)

| field 분류 | operator | super-admin | legal-reviewer | export 정책 |
|---|---|---|---|---|
| plan metadata (non-PII) | 허용 | 허용 | 허용 | 허용 |
| DryRunReport sample diff (PII 포함 가능 step) | masked | masked | full | export 금지 (full diff) |
| DryRunReport sample diff (non-PII step) | 허용 | 허용 | 허용 | 허용 |
| StepResult input/output (PII 포함 step) | masked | masked | full | export 금지 |
| StepResult input/output (non-PII step) | 허용 | 허용 | 허용 | 허용 |
| LegalApproval evidence | 차단 | 허용 | 허용 | export 금지 |
| WriteSetManifest before/after digest | 허용 (digest는 hash) | 허용 | 허용 | 허용 |

masking 알고리즘: crm-sync § 3.2.1 closed schema 패턴 재사용 (displayHints 6 column 형태). non-PII step은 raw 노출 허용.

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan(input)
   - planFingerprint·targetSetDigest(target selector 시점 기준) 산정
   - ContentMigrationPlan row insert (status=draft)
2. validatePlan(planId):
   - step type registry 등록 확인 (§ 3.5)
   - rollbackClass별 reverse/compensating step 필수 검증
   - irreversible: blastRadiusCap·backupSnapshotRequired 검증
   - legalImpactClassifier 실행 (§ 4.7)
   - unknownClassesEncountered=true → legalGateRequired=true fail-closed
   - cooperativeCancellation 미지원 step + transactionBoundary != "per-chunk" → validate warning
   - audit plan-validated
3. runDryRun(planId):
   - 6필드 digest 산정 + sampling (deterministic-stratified · legal/PII는 full diff)
   - DryRunReport insert
   - audit dry-run-completed
4. legalGateRequired=true 시 approvePlanLegalGate:
   - ContentMigrationLegalApproval insert (classificationSnapshot 포함)
   - audit plan-legal-approved + 알림 plan-legal-approved
5. runApply(input):
   - 8필드 CAS 검증 (6필드 + legalImpactClassificationDigest + classifierVersion)
   - idempotencyKey + requestFingerprint 검증 (§ 3.4)
   - ContentMigrationRun insert (status=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 실행 — writeSetManifest StepResult 기록
   - 알림 run-completed 또는 run-failed
```

### 4.2 rollback (CM2-02 — 자동 skip 금지)

```
rollbackRun(input):
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. scope=full 또는 from-step — 완료된 step 역순 처리:
   - reversible: reverseStep 실행
   - compensating: compensatingStep 실행
   - irreversible: status → "blocked-manual-remediation-required" (CM2-02). 운영자 별도 skipStep 호출 필요
4. 완료된 reverse-step 모두 성공 → status=rolled-back
5. irreversible encountered 시 → status=partial-rollback. result=partial 강제. skippedIrreversibleSteps 기록
6. rollback 자체 실패 → ContentMigrationRollbackLog + super-admin alert. status=rollback-failed
7. audit rollback-applied (skippedIrreversibleSteps 포함)
```

### 4.3 pause / resume / cancel (CM2-07)

| 호출 | 현재 status | 동작 |
|---|---|---|
| pauseRun | running | step boundary에서 pause. cooperative cancellation 지원 step은 cancellation point까지 완료. 미지원 step은 stepTimeoutSeconds까지 대기 후 강제 `cancellation-timeout-manual-review` |
| pauseRun | 외 | runtime fail |
| resumeRun | paused | running |
| cancelRun | pending | cancelled |
| cancelRun | running | cooperative cancellation 요청. 종료 후 partial commit 검사 (§ 3.6) — non-compensated partial write 발견 시 rollback 우선 강제 |
| cancelRun | paused | partial commit 검사 동일 |
| cancelRun | 완료·rolled-back | runtime fail |

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위

v0.2 § 4.4 표 동일.

### 4.5 read-only window — writeClass 세분화 (CM2-10)

| writeClass | 정의 | 기본 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 (window 종료 후 처리) |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` (CM2-10) | NotificationEvent emit + outbox insert | **허용** (운영 알림 유지) |
| `notification-dispatch` | notify() 발송 처리 | **허용** |
| `notification-read-receipt` | 사용자 inApp 읽음 표시 | **큐잉** (window 종료 후) |
| `notification-digest-state` | digest 집계 처리 | **큐잉** |
| `audit-append` | append-only audit log | **허용** |

### 4.6 outbox SQL — 자체 전개 (CM2-20)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE o.id=next.id RETURNING o.*;

-- success → status=sent + sent_at=now()
-- transient fail → status=pending + last_error 갱신
-- exhausted (attempts >= 5) → status=permanent + sink alert
```

`sourceEventId` UNIQUE (§ 12.10).

### 4.7 legalImpactClassifier (CM2-03 — deterministic rule SoT)

| class | 자동 분류 룰 (deterministic) |
|---|---|
| `pii` | step.targetEntityTypes 또는 readSet/writeSet에 PII 필드 포함 (DATA_MODEL Core PII 필드 카탈로그) |
| `legal-document` | targetEntityTypes에 LegalDocument 포함 |
| `review-policy` | targetEntityTypes에 ReviewPolicy 포함 |
| `pricing-page` | targetEntityTypes에 PricingPage 또는 PricingPolicy 포함 |
| `before-after-media` | readSet/writeSet에 before/after media field 포함 |
| `testimonial-review` | targetEntityTypes에 Testimonial·Review 포함 |
| `prior-review-required` | targetEntityTypes에 ComplianceRecord + priorReviewRequired 필드 영향 |
| `cross-entity-copy` | plan kind=instance-to-instance-copy 또는 source != target instance |

룰 매칭 실패한 known step type → `unknownClassesEncountered=true` → **fail-closed (legalGateRequired=true)**.

**LLM 분류 금지 (v1.0)**. v1.x 보조 hint로만 허용.

class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).

### 4.8 policy-version-reevaluate batch (CM2-08·09)

```
config.defaultReportingMode="risk-based":
1. 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit는 check() 호출 생략 + cachedResultRef 기록 (CM2-09)
3. concurrencyLimit·rateLimitPerSecond 적용 (token bucket)
4. check() 결과별 reportingMode 분기 (risk-based default):
   - LegalDocument·ReviewPolicy·PricingPage·priorReviewRequired 변화 또는 risk 상승 (High/Critical) → **new-record-version** 강제 (ComplianceRecord 새 recordVersion + REVIEW_WORKFLOW lifecycle 진입)
   - Low risk wording stale → stale-flags-only 허용
5. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error per-record resultRef 카운트
6. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

config로 reportingMode override 가능: `stale-flags-only` 또는 `new-record-version` 강제 — 단, override는 risk-based 기본보다 안전한 방향만 허용 (legal-reviewer 승인 필요 — 후속 cycle).

---

## 5. 알림

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑 — v0.2 § 4.7 동일

---

## 6. 운영 지표 + acceptance test invariant (CM2-18 — INV-* 매핑 신설)

### 6.1 핵심 지표 — v0.2 § 6 + 추가

| 지표 | 정의 | 목표 |
|---|---|---|
| 6필드 CAS mismatch 차단율 | mismatch 발생 시 차단 | 100% |
| legalImpactClassifier unknown → fail-closed 비율 | 운영 누적 | baseline |
| skip irreversible 발생율 | baseline (운영 review) | |
| partial write 감지 → rollback 트리거 비율 | baseline | |
| read-only window 차단 write 시도 | baseline | |
| policy-reevaluate risk-based new-record-version 비율 | baseline | |

### 6.2 invariant 매핑 (CM2-18)

| Invariant ID | 영역 | 케이스 |
|---|---|---|
| INV-CAS | dry-run/apply drift | 6+2필드 CAS mismatch → apply 차단 |
| INV-LEGAL | legalImpactClassifier | unknown step type → fail-closed. classifierVersion mismatch → re-dry-run 강제 |
| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings | legal-required warning에는 적용 안 됨 |
| INV-ROLLBACK | rollback | reversible/compensating 자동. irreversible은 blocked-manual-remediation-required |
| INV-ROLLBACK-SKIP | skipStep | super-admin + remediationTicketRef + affectedRowsConfirmation 필수 |
| INV-PARTIAL-WRITE | writeSetManifest | expected vs committed rows mismatch → rollback 우선 |
| INV-READONLY | read-only window | content-mutating·workflow-state·feature-operational·notification-read-receipt·notification-digest-state 차단/큐잉 |
| INV-IDEMPOTENCY | requestFingerprint | same-request replay → no-op. mismatched → 409 |
| INV-OUTBOX | NotificationOutbox | UNIQUE(sourceEventId)·SKIP LOCKED·exhausted=permanent |
| INV-POLICY-REEVAL | reportingMode | LegalDocument·ReviewPolicy·priorReviewRequired·High/Critical → new-record-version 강제 |
| INV-COOP-CANCEL | cooperative cancellation | 미지원 step + timeout → cancellation-timeout-manual-review |
| INV-STEP-REGISTRY | registry contract | inputSchema strict·additionalProperties=false |
| INV-PRIVACY | read API masking | PII step output legal-reviewer만 full diff |
| INV-DDL-BOUNDARY | DDL precondition | application-data-version-upgrade는 column 존재만 read-only 검증·DDL 실행 금지 |
| INV-BODY-MV | asset-ingestion handoff | body materialized view denylist 통과 |

상세 acceptance test fixture는 v0.4·v0.5 cycle에서 traceability 표로 매핑.

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport는 compliance-assistant `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 결과로 ComplianceRecord 재생성 시 새 ComplianceRecord가 REVIEW_WORKFLOW § 8 lifecycle 진입 — compliance-assistant `contentType` 예외 cascade **불필요** (개별 콘텐츠는 기존 contentType).

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail (CM2-21 용어 분리)

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** (CM2-21 — Feature 활성화 게이트)
- 또는 `featureLegalApprovedBy`·`featureLegalApprovedAt` 누락
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef` 누락
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `hashSecrets.*` 3종 누락
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry 등록 step type 중 `inputSchema.additionalProperties != false`

### 9.2 runtime fail

- runApply 8필드 CAS 불일치
- runApply mismatched idempotency → 409
- legalGateRequired=true + approvePlanLegalGate 미수행
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 (CM2-04)
- classifierVersion mismatch → dry-run 재수행 강제 (CAS fail)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed (CM2-03)
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → `blocked-manual-remediation-required` 상태 + 운영자 수동 skipStep 필요 (CM2-02)
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 차단 writeClass 시도 → rejected
- policy-reevaluate concurrencyLimit 초과 시도 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review`

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → CAS fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
- stale policyVersionSnapshot → CAS fail
- targetSelector row lock 불가 (다른 run 진행 중) → runtime fail
- orphan Core row → warning
- step type registry 미등록 stepType → validate fail
- step type registry contract 위반 (inputSchema strict 실패) → validate fail
- cooperativeCancellation 미지원 + transactionBoundary != "per-chunk" → validate warning

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport expiresAt 도래 → purge
- legalHold > unregister > retention precedence (asset-ingestion·crm-sync 패턴)
- purge worker — 테이블별:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible step 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함 → criticalClassFullDiff=true 강제 (warning)
- cooperativeCancellation 미지원 step 1개 이상

---

## 10. 미결정 사항 (CM2-22 풀 diff 반영)

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 | 비고 |
|---|---|---|
| CM-01 | 외부 cluster cross-region copy | v1.x |
| CM-02 | partial cutover | v1.x |
| CM-03 | sampling stratified 알고리즘 | v1.0 default deterministic-stratified·v1.x stratified per cluster |
| CM-04 | read-only window 우회 권한 | v1.x — v1.0 우회 불가 |
| CM-05 | rollback 부분 적용 안전성 | v1.x |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 | v1.x — v1.0은 fail-closed |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-version-reevaluate 부하 — § 3.2.5·§ 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application data — § 1.3 handoff boundary |

### 10.3 v0.3 잔여 리스크

| 영역 | 상태 |
|---|---|
| step type registry 본 문서 vs 별도 도큐먼트 | open — § 3.5 최소 계약을 본문에 포함. 구체 step type은 구현체 등록 |
| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
| § 12 풀 schema (CHECK·partial unique·FK·CAS column 전체 명시) | open — v0.4 cycle에서 풀 전개 |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 비평 24 지적 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |

---

## 12. DB 인벤토리 (10 tables — 최소 constraints, 풀 schema는 v0.4)

### 12.1 `ContentMigrationPlan`

- `(instanceId, idempotencyKey)` UNIQUE
- status enum: draft·validated·dry-run-completed·legal-approved·apply-ready·archived
- `planFingerprint` char(64) NOT NULL
- `legalImpactClassification` JSON (closed schema)
- FK 없음 (top-level)

### 12.2 `ContentMigrationDryRunReport`

- `(planId, reportId)` UNIQUE
- 6필드 digest column NOT NULL
- `expiresAt` 인덱스
- `samplingStats` JSON
- FK planId ON DELETE RESTRICT

### 12.3 `ContentMigrationLegalApproval`

- `(planId, classificationSnapshotDigest)` UNIQUE
- `approvedBy`·`approvedAt`·`policySnapshotVersion`·`classifierVersion` NOT NULL
- legalHold true default
- FK planId ON DELETE RESTRICT

### 12.4 `ContentMigrationRun`

- `(planId, idempotencyKey)` UNIQUE
- status enum: pending·running·paused·completed·failed·cancelled·rollback-in-progress·blocked-manual-remediation-required·rolled-back·partial-rollback·rollback-failed·cancellation-timeout-manual-review
- CAS columns: `solutionVersion` integer (낙관적 lock 비교용)
- FK planId·dryRunReportId ON DELETE RESTRICT

### 12.5 `ContentMigrationStepResult`

- `(runId, stepKey)` UNIQUE
- status enum: pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back
- `writeSetManifest` JSON (§ 3.6)
- FK runId ON DELETE RESTRICT

### 12.6 `ContentMigrationStepRetryQueue`

- `(stepResultId)` UNIQUE WHERE status IN (pending, processing) (partial)
- worker SoT SQL: search-visibility § 13.5 패턴 (v0.4에서 풀 전개)
- FK stepResultId ON DELETE RESTRICT

### 12.7 `ContentMigrationRollbackLog`

- `(runId, rolledBackStepKey)` UNIQUE
- `scope` enum (full·from-step)
- `skippedIrreversibleSteps` JSON (stepKey list + remediationTicketRefs)
- FK runId ON DELETE RESTRICT

### 12.8 `ContentMigrationReadOnlyWindow`

- `(runId)` UNIQUE WHERE active=true (partial)
- `startedAt`·`endedAt`·`blockedWriteAttempts` count
- FK runId ON DELETE RESTRICT

### 12.9 `ContentMigrationPolicyReevaluateBatch`

- `(runId, planId)` UNIQUE WHERE planKind="policy-version-reevaluate"
- columns: `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` integer (CM2-09)
- per-record resultRef는 별도 row 또는 JSON array (정책 결정 v0.4)
- FK runId·planId ON DELETE RESTRICT

### 12.10 `ContentMigrationNotificationOutbox`

- `UNIQUE(sourceEventId)`
- `(sourceKind, sourceId, eventType)` UNIQUE
- status enum: pending·processing·sent·failed·permanent
- `lockedAt`·`lockedBy`·`attempts`
- `(status, created_at) WHERE status='pending'` 인덱스


 succeeded in 703ms:
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
session id: 019e2713-14b4-7193-85db-314f165dce33
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.2 (2차 사이클)

## 컨텍스트

1차 비평(24 지적: blocking 9 + major 10 + minor 5) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.2 핵심 변경:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1: 4종 NotificationEventType cascade 완료
- REVIEW_WORKFLOW § 10.2.1: 9종 AuditAction cascade 완료
- DATA_MODEL C-08 v0.21: ContentMigrationConfig 신설·legalImpactClassifierRef·contentMigrationPolicyVersion
- policy-version-reevaluate batch contract (concurrencyLimit·rateLimit·cacheDedupe·reportingMode)
- schema-version-upgrade → application-data-version-upgrade로 좁힘 + DDL 책임 분리
- rollbackClass 3종 (reversible·compensating·irreversible) 강제
- dry-run/apply drift 6필드 CAS (planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest)
- legalImpactClassifier + 8 class
- read-only window writeClass 5종 표
- pause/resume/cancel state transition + cooperative cancellation
- retry exhausted vs autoRollbackOnFailure 우선순위 표
- idempotencyKey + requestFingerprint (crm-sync 패턴)
- routing-slug-preservation plan kind 추가 (6종)
- handoff boundary asset-ingestion vs DDL
- § 9 migration-time validation 분리
- DB 10 tables 인벤토리 (풀 schema는 v0.3 cycle에서 전개)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.2를 이전과 동일한 강도로 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 24개가 실제로 정정됐는가? 표면만 바뀌고 본질이 남아있지 않은가?
2. **v0.2 신규 메커니즘의 모순·미진함**:
   - dry-run 6필드 CAS — 어떤 알고리즘으로 targetSetDigest·contentHashDigest를 산정하는가? 대량 row의 hash 계산 비용은?
   - rollbackClass=irreversible step + 자동 skip (§ 4.2 step 3) 의미 — runtime fail 후 운영자 수동? 자동 skip은 위험
   - legalImpactClassifier 8 class — 분류 알고리즘 (규칙 기반 vs LLM)·false negative 위험·class 추가/제거 정책
   - policy-version-reevaluate `reportingMode=stale-flags-only` vs `new-record-version` 선택 기준 — 운영상 어느 정책이 default인가?
   - read-only window 중 `notification-operational` 허용 — content-migration-run-completed 알림 자체가 emit되지만 inApp 발송이 운영자에게 즉시 전달되어야 하는가?
   - § 4.4 partial write 감지 알고리즘 — step별로 어떻게 감지? checksum? row count diff?
   - pause/resume 중 timeout·partial commit 추적 — running step이 cooperative cancellation 미지원이면?
3. **DB schema 풀 전개 (v0.3 예고지만 v0.2 검증)**:
   - § 12 10 tables가 인벤토리만 있고 schema 없음 — v0.2 단계에서도 핵심 unique·CAS·partial unique는 명시되어야 하지 않는가?
   - ContentMigrationStepRetryQueue·NotificationOutbox SQL이 search-visibility § 13.5·§ 13.10 패턴 동일이라는 참조만 — v1.0 후보 단계에서는 풀 SQL 전개 필요
4. **legal 게이트 강제력**:
   - legalImpactClassifier 분류 결과를 운영자가 무시할 수 있는가? `forceProceedDespiteWarnings`만으로 legal-reviewer 우회 가능?
   - classifierVersion mismatch 시 (apply 시점 분류기 업데이트 됐을 때) 어떻게 처리?
5. **이전 Feature 패턴 정합성**:
   - crm-sync v1.0의 CrmCredentialVersion partial unique 강제·CAS WHERE·closed schema·displayHints 패턴 재사용 정확성
   - asset-ingestion v1.0의 4상태 머신·body materialized view 패턴 적용
   - compliance-assistant v1.0의 cacheKey·durable cache 정확한 재사용
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 (10 tables) 일관성
   - § 1.1 변경 정책 표가 모든 v0.2 신규를 다루는가
   - § 3.1 command 11종 ↔ § 3.1.1 audit 9종 ↔ § 4.7 NotificationEvent 매핑 4종 정합
   - § 9.1-§ 9.5 fail/invariant ↔ § 6 지표 ↔ 향후 acceptance test traceability

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM2-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle1_response.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
codex
요청이 `seo-geo` 범주와 일부 겹치지만, 이번 작업은 문서 명세 코드리뷰 성격이 더 강해서 별도 스킬 없이 대상 SoT들을 직접 대조하겠습니다. 먼저 대상 문서와 1차 응답, 참조 Feature 문서의 관련 섹션을 빠르게 색인화하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CrmCredentialVersion|partial unique|CAS|closed schema|displayHints|requestFingerprint|idempotencyKey|WHERE|unique|AuditAction|NotificationEvent|CredentialVersion" docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "state machine|4-state|body materialized|materialized view|asset-ingestion|handoff|DDL|AuditAction|NotificationEvent|retry|outbox|cancel|pause|resume|checksum" docs/features/asset-ingestion.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###|####)|ContentMigrationConfig|policy-version-reevaluate|application-data-version-upgrade|rollbackClass|planFingerprint|targetSetDigest|sourceSnapshotWatermark|policyVersionSnapshot|stepRegistryVersion|contentHashDigest|legalImpactClassifier|read-only|pause|resume|cancel|retry|autoRollback|idempotencyKey|requestFingerprint|routing-slug|asset-ingestion|DDL|migration-time|ContentMigrationStepRetryQueue|NotificationOutbox|reportingMode|forceProceed|classifierVersion|NotificationEvent|AuditAction|table|unique|CAS|checksum|partial" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CM1-|blocking|major|minor|ContentMigration|content migration|dry-run|rollback|legal|policy-version|schema-version|audit|notification|DATA_MODEL|REVIEW_WORKFLOW" .codex-reviews/cm_cycle1_response.md' in C:\Users\assag\solution\website-exposure
 succeeded in 643ms:
1:# Feature — asset-ingestion
14:- **Feature 식별자**: `asset-ingestion`
50:### 1.2.1 공통 retry taxonomy (search-visibility § 1.2.1 동일)
70:name: "asset-ingestion"
81:| compliance-assistant § 3.3 | `check()` — 자동 태깅에 활용. **의료기관 인스턴스에서 asset-ingestion 활성 시 compliance-assistant 활성 또는 `complianceAssistantExemptApproval` required** (build fail) |
83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
108:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
110:| `asset-ingestion-source-registered` | `"ingestion-source:" + sourceId` | sourceType·configSummary·registeredBy | operator·super-admin |
111:| `asset-ingestion-source-unregistered` | `"ingestion-source:" + sourceId` | sourceType·activeBefore·activeAfter·unregisteredBy | operator·super-admin |
112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
113:| `asset-ingestion-asset-rejected` | `"asset:" + assetId` | rejectionReason·rejectedBy | operator·super-admin |
114:| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |
139:### 4.3 retry queue worker — search-visibility § 13.5 패턴 동일
174:  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
336:### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)
359:3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
367:   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
372:   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
400:  - **checksum 검증 (정확 공식)**:
425:## 10. 알림 (outbox 패턴)
427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
431:| `asset-ingestion-batch-completed` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
432:| `asset-ingestion-batch-failed` | high | email + inApp | inApp | — | respect | mandatory |
433:| `asset-ingestion-review-required` | normal | inApp | (없음) | email 일일 | respect | digestOptOut 허용 |
434:| **`asset-ingestion-pii-detected`** | **critical** (F-3) | email + inApp | inApp | — | bypass | mandatory |
435:| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
437:### 10.2 outbox 패턴
441:### 10.3 NotificationEvent 필드 매핑 (F-2)
443:| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
445:| `asset-ingestion-batch-completed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 완료 — ${date}"` | ingestionLogId·perSource summary |
446:| `asset-ingestion-batch-failed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 실패 — ${date}"` | ingestionLogId·failedSources[] |
447:| `asset-ingestion-review-required` | `asset` | assetId | `"asset:" + assetId` | `"검수 필요 — ${assetTitle}"` | assetId·sourceType·tags |
448:| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
452:- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
455:`sourceEventId = hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` (search-visibility 패턴).
472:| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
474:| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
528:  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
534:- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
552:    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
556:- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
622:### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)
626:- **`body`** (Markdown — **materialized view**: rawBody + AssetPiiFinding(reviewStatus="true-positive" AND redactionApplied=true) redaction operations로 자동 재생성). **직접 편집 금지** (AI4-09). 수동 redaction은 detector="manual"인 AssetPiiFinding 추가로 수행 → body는 redaction worker가 재생성
646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
738:| `eventType` | NotificationEventType | ✅ |
740:| `sourceEventId` | string | ✅ — `hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` |
741:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
753:object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.

 succeeded in 651ms:
1:# Feature — content-migration
7:> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가. **외부 raw 수집은 asset-ingestion**. **DB DDL은 인프라 책임**.
9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType + 9종 AuditAction)
12:> - compliance-assistant `check()` 호출 (policy-version-reevaluate)
13:> - asset-ingestion handoff boundary → 본 문서 § 1.3
14:> - retry queue·outbox SQL → search-visibility § 13.5·§ 13.10
18:## 0. 한 페이지 요약
21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) step별 rollback (rollbackClass 강제), (c) read-only window write class별 분리 차단, (d) dry-run/apply drift 6필드 CAS, (e) policy-version-reevaluate batch contract (cacheKey dedupe·concurrency cap), (f) skip은 irreversible step에 한정 + 운영 audit
22:- **vs asset-ingestion (CM1-12)**: asset-ingestion=외부→솔루션 raw sourcing + promote (Core 계약 변환). 본 Feature=**promote 이후** Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가
23:- **DB DDL 책임 (CM1-05)**: 인프라 책임. 본 Feature는 application-data-version-upgrade(데이터 backfill·정규화)만. DDL precondition 검증은 read-only
24:- **migration plan kind 6종 (v1.0)**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation` (CM1-05·11)
25:- **rollbackClass 3종 (CM1-06)**: `reversible`·`compensating`·`irreversible` — step별 강제
27:- **legal 게이트 (CM1-08)**: `legalImpactClassifier`가 plan 자동 분류 — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy 영향 plan은 legal-reviewer 승인 강제
28:- **DB 인벤토리 (CM1-15)**: **10 tables** (§ 9 풀 schema)
32:## 1. 일반 규약
34:### 1.1 변경 정책 (CM1-24 영향 기반 재분류)
39:| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
40:| **migration plan kind 추가 (legal/read-only/rollback/dry-run output 변경 동반)** | **MAJOR** | policyVersion 신규 | (CM1-24) |
42:| step type 추가 (rollbackClass·reverse-step 정의 강제 통과) | MINOR | 별개 | (CM1-24) |
46:| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
47:| legalImpactClassifier 룰 추가·강화 | MINOR | 별개 | 기존 plan는 영향 없음 |
48:| legalImpactClassifier 룰 완화 | **MAJOR** | policyVersion 신규 | 법무 승인 |
49:| dry-run report schema (planFingerprint 등 6필드) 변경 | **MAJOR** | policyVersion 신규 | |
55:### 1.2 SoT 원칙
61:- 본 문서 = migration plan/step/실행 파이프라인·rollbackClass·dry-run drift CAS·legalImpactClassifier·read-only window write class 표 SoT
63:### 1.2.1 retry taxonomy
67:| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
68:| ContentMigrationNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL 동일 |
70:### 1.3 본 문서가 다루지 않는 영역 (handoff boundary — CM1-12)
74:| 외부 raw 자료 수집·parsing·PII 감지·promote(Core 계약 변환) | **asset-ingestion** |
76:| DB DDL (PostgreSQL `ALTER TABLE`·column 추가·index 생성) | **인프라 (infra)** — 본 Feature는 DDL precondition 읽기 검증만 |
78:| 운영자 검수 큐 상태 머신 | **REVIEW_WORKFLOW** (policy-version-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
83:## 2. Feature 정의
85:### 2.1 기본 메타
95:### 2.2 의존성
100:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
101:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
103:| compliance-assistant § 3.3 | `policy-version-reevaluate` batch contract 호출 |
104:| asset-ingestion | promote handoff |
105:| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |
107:### 2.3 InstanceManifest 통합
122:  legalImpactClassifierRef: "lic-2026-05-15"            # CM1-08 — 분류기 버전
139:      retry:
143:        autoRollbackOnFailure: false
145:        retryExhaustedAction: "pause"                   # CM1-14 — pause | rollback-then-pause | rollback
153:        reportingMode: "stale-flags-only"               # stale-flags-only | new-record-version
165:      hashSecrets:                                       # CM1-16 — requestFingerprint·planFingerprint·targetSetDigest
166:        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
173:## 3. 입력·출력
175:### 3.1 엔트리포인트 + read API + 운영 command
180:| 실행 | `validatePlan(planId): ValidatePlanResult` | step 정합·rollbackClass·legalImpactClassifier 분류 | super-admin |
182:| 실행 | `approvePlanLegalGate(input): ApprovePlanLegalGateResult` | legal-reviewer 게이트 (legalImpactClassifier 분류 따라) | legal-reviewer |
183:| 실행 | `runApply(input): RunApplyResult` | apply (6필드 CAS 통과 시) | super-admin |
184:| 실행 | `pauseRun(input)` | step boundary 일시 정지 (CM1-13) | super-admin |
185:| 실행 | `resumeRun(input)` | 재개 | super-admin |
186:| 실행 | `cancelRun(input)` | 진행 중 취소 (cooperative cancellation) | super-admin |
187:| 실행 | `rollbackRun(input)` | scope: full / from-step (rollbackClass 검사) | super-admin |
188:| 실행 | `skipStep(input)` | rollbackClass=irreversible 또는 manual-remediation에 한정 (CM1-21) | super-admin + 사유 + remediationTicketRef |
193:### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)
195:| AuditAction | contentRef | metadata |
197:| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·idempotencyKey·planFingerprint |
198:| `content-migration-plan-validated` (CM1-10) | `"cm-plan:" + planId` | rollbackClassSummary·legalImpactClassification·warningsCount |
199:| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·classificationSnapshot·planFingerprint |
200:| `content-migration-run-started` | `"cm-run:" + runId` | mode·planId·expectedDryRunReportId·planFingerprint |
202:| `content-migration-run-failed` | `"cm-run:" + runId` | failedStepKey·errorClass·partialWriteDetected |
203:| `content-migration-run-cancelled` | `"cm-run:" + runId` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
205:| `content-migration-step-skipped` (CM1-21) | `"cm-step:" + stepResultId` | reason·approver·rollbackClass·affectedRows·remediationTicketRef |
207:### 3.2 plan kind 정의 (v1.0 — 6종, CM1-05·11)
209:#### 3.2.1 `application-data-version-upgrade`
210:DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. DDL (column add/rename)은 인프라 책임 — 본 plan kind는 column 존재·nullable·default를 read-only로 검증하고 데이터만 채움.
212:#### 3.2.2 `feature-activation-backfill`
215:#### 3.2.3 `instance-to-instance-copy`
216:분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제.
218:#### 3.2.4 `content-bulk-transform`
221:#### 3.2.5 `policy-version-reevaluate` (CM1-04 batch contract)
230:5. reportingMode 분기:
236:#### 3.2.6 `routing-slug-preservation` (CM1-11 신설)
237:asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계.
239:### 3.3 DTO (CM1-07·16 강화)
243:  | "application-data-version-upgrade"
247:  | "policy-version-reevaluate"
248:  | "routing-slug-preservation";
260:  idempotencyKey: string;
264:  stepKey: string;                                       // plan 내 unique
267:  rollbackClass: RollbackClass;                          // CM1-06 — 강제
268:  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
269:  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
270:  blastRadiusCap?: number;                              // rollbackClass=irreversible 필수 (max affected rows)
271:  backupSnapshotRequired?: boolean;                     // rollbackClass=irreversible 필수 true 권장
272:  retryable: boolean;
277:  planFingerprint: string;                              // HMAC(planFingerprintPepperRef, canonical(plan)). char(64)
285:  classifierVersion: string;                            // contentMigrationConfig.legalImpactClassifierRef
291:  expectedPlanFingerprint: string;                      // CAS — CM1-07
292:  expectedTargetSetDigest: string;                      // CAS
293:  expectedSourceSnapshotWatermark: string;              // CAS
294:  expectedPolicyVersionSnapshot: string;                // CAS
295:  expectedStepRegistryVersion: string;                  // CAS
296:  expectedContentHashDigest: string;                    // CAS
297:  forceProceedDespiteWarnings?: boolean;
298:  idempotencyKey: string;
306:  expectedStatus: "completed" | "failed" | "cancelled" | "paused";  // CAS
311:  rollbackClass: "irreversible" | "manual-remediation-required";    // CM1-21
319:### 3.4 idempotencyKey + requestFingerprint (CM1-16 — crm-sync 패턴 재사용)
321:| command | idempotencyKey + requestFingerprint 산정 |
323:| `definePlan` | requestFingerprint = HMAC(idempotencyPepperRef, planKind + ":" + planCanonicalJson). same-request replay → 기존 planId 반환. mismatched collision → 409 |
324:| `runApply` | requestFingerprint = HMAC(idempotencyPepperRef, planId + ":" + expectedDryRunReportId + ":" + planFingerprint). 동일 처리 |
329:## 4. 실행 파이프라인
331:### 4.1 정의 → validate → dry-run → legal 게이트 → apply
335:   - planFingerprint 산정 (§ 3.3)
336:2. validatePlan(planId) — registry 등록 step type 확인·rollbackClass별 reverse/compensating step·blastRadius·legalImpactClassifier 분류
339:   - planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest 6필드 (CM1-07)
342:5. runApply(input) — 6필드 CAS 검증 → ContentMigrationRun insert (status=pending → running)
343:   - read-only window 적용 (config — write class 표 § 4.5)
348:### 4.2 rollback (CM1-06 rollbackClass 강제)
352:1. expectedStatus CAS (completed·failed·cancelled·paused)
355:3. step별 rollbackClass 분기:
363:### 4.3 pause / resume / cancel (CM1-13 state transition)
367:| pauseRun | running | 진행 중 step은 cooperative cancellation point까지 완료 → step boundary에서 pause. status=paused |
368:| pauseRun | pending·paused·완료 상태 | runtime fail |
369:| resumeRun | paused | status=running. 다음 step부터 진행 |
370:| cancelRun | pending | status=cancelled. step 미진행 |
371:| cancelRun | running | 진행 중 step cooperative cancellation 요청 → step 종료 후 status=cancelled. partial commit 검사: non-compensated partial write 발견 시 자동 rollback 요구 (autoRollbackOnFailure 무시 — 안전 우선) |
372:| cancelRun | paused | status=cancelled. partial commit 검사 동일 |
373:| cancelRun | 완료·rolled-back | runtime fail |
375:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM1-14)
379:| step retry exhausted + **partial write 감지** | **rollback 우선** (autoRollbackOnFailure 무시) → status=rollback-in-progress |
380:| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` (config 기본) | status=paused + super-admin alert |
381:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rollback 실행 후 paused |
382:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rollback 완료 후 status=rolled-back |
383:| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` (config) | rollback 우선 |
385:### 4.5 read-only window — write class별 차단 표 (CM1-09)
387:| writeClass | 정의 | 기본 정책 (read-only window 중) |
392:| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
397:### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개
410:### 4.7 NotificationEvent 매핑 (CM1-17)
421:## 5. 알림
423:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)
432:### 5.2 outbox — § 4.6 SQL
436:## 6. 운영 지표 (CM1-22 정확도 분리)
441:| dry-run **targetSetDigest match** | dry-run 시점 target set vs apply 시점 일치율 | **100%** (불일치 시 CAS fail) |
449:| read-only window 평균 길이 | baseline | |
450:| policy-version-reevaluate cache hit rate | (CM1-04) | > 80% |
454:## 7. compliance-assistant 예외 (CM1-19)
458:단, `policy-version-reevaluate` 실행 결과로 **개별 콘텐츠 ComplianceRecord 재생성**이 발생할 수 있음 — 그 경우 새 ComplianceRecord가 REVIEW_WORKFLOW § 8 lifecycle (new) 진입.
464:## 8. 설치·설정 — DB 10 tables 마이그레이션 (§ 9)
468:## 9. 빌드·런타임·migration·invariant 검증 (CM1-20 분리)
470:### 9.1 build-time fail
477:- `legalImpactClassifierRef` 누락
479:- `hashSecrets.planFingerprintPepperRef`·`idempotencyPepperRef` 누락
482:### 9.2 runtime fail
484:- `runApply` 6필드 CAS 중 하나라도 불일치 (planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest)
485:- `runApply` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 runId 반환 (fail 아님)
486:- `runApply` idempotencyKey **mismatched collision** → **409 idempotency-key-conflict** runtime fail
489:- rollbackRun expectedStatus CAS 실패
491:- pauseRun/cancelRun § 4.3 표 비허용 status → runtime fail
492:- read-only window 중 차단 writeClass 시도 → write rejected + sink alert
493:- policy-version-reevaluate concurrencyLimit 초과 시도 → 대기 큐
495:### 9.3 migration-time validation (CM1-20 신규)
499:- dry-run report expiresAt 만료 후 apply 시도 → CAS fail
500:- step.rollbackClass=reversible + reverseStep 누락 → validate fail
501:- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
502:- step.rollbackClass=irreversible + blastRadiusCap 누락 또는 backupSnapshotRequired=false → validate fail
503:- stale policyVersionSnapshot (dry-run 시점과 apply 시점 다름) → CAS fail
507:### 9.4 runtime invariant·reconcile
509:- 진행 중 run pausedAt > 24h → 운영자 alert
510:- step retry exhausted → § 4.4 표 따라
511:- read-only window 진행 중 다른 admin write 시도 → 차단 + alert
520:  - ContentMigrationStepRetryQueue (status=completed) → retentionDays.stepRetryQueueCompleted
523:  - ContentMigrationNotificationOutbox (sent·permanent) → retentionDays.notificationOutbox
525:### 9.5 warning
528:- rollbackClass=irreversible step 비율 > 10%
533:## 10. 미결정 사항 (CM1-23 — CM-06/07/08 v1.0 blocking으로 격상)
535:### 10.1 open (v1.x·M2+ 후속)
540:| CM-02 | partial cutover (일부 row만) | v1.x |
542:| CM-04 | read-only window 중 운영자 우회 권한 | v1.x — v1.0은 우회 불가 |
543:| CM-05 | rollback 부분 적용 안전성 (multi-step partial rollback) | v1.x |
545:### 10.2 resolved-in-v1.0 (CM1-23)
549:| ~~CM-06~~ | policy-version-reevaluate 부하 관리 | § 3.2.5 batch contract (concurrencyLimit·rateLimit·cacheDedupe·reportingMode) 명시 |
550:| ~~CM-07~~ | instance-to-instance-copy PII 마스킹 | legalImpactClassifier가 PII class 자동 분류 → legal-reviewer 승인 강제. masking은 step type registry가 정의 |
551:| ~~CM-08~~ | DB DDL vs application data migration 경계 | § 1.3 handoff boundary 표 — DDL은 인프라 책임·본 Feature는 데이터 backfill |
553:### 10.3 v0.2 잔여 리스크
562:## 11. 변경 이력
567:| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |
571:## 12. DB 인벤토리 (10 tables — § 9 풀 schema는 v0.3 cycle에서 전개)
575:| 12.1 | `ContentMigrationPlan` | planFingerprint·status·legalImpactClassification |
578:| 12.4 | `ContentMigrationRun` | status·CAS·runId |
579:| 12.5 | `ContentMigrationStepResult` | step별 input/output/rollbackClass·partial write 추적 |
580:| 12.6 | `ContentMigrationStepRetryQueue` | search-visibility § 13.5 worker SQL |
583:| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
584:| 12.10 | `ContentMigrationNotificationOutbox` | search-visibility § 13.10 패턴 |

 succeeded in 655ms:
18:이전에 compliance-assistant·notifications·analytics-reporting·search-visibility·keyword-monitoring·asset-ingestion·crm-sync 7 Feature가 각각 5~7 사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 **8번째 (마지막)** Feature `content-migration`의 v0.1 초안 1차 사이클.
21:- migration plan kind 5종: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
22:- 모드: dry-run / apply
23:- step별 reverse-step 정의 시 rollback 지원
24:- legal-reviewer 승인 게이트 (instance-to-instance-copy는 PII 이동 가능)
26:- compliance-assistant 재호출 (policy-version-reevaluate)
30:- 영향 큼 — dry-run 강제·legal 게이트·rollback 가능성 필수
38:   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 4종 이벤트)
39:   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (6종)
40:   - DATA_MODEL C-08 cascade — `contentMigrationConfig`·`contentMigrationPolicyVersion`
41:   - compliance-assistant § 3.1 check() 호출 — policy-version-reevaluate 시 대량 호출 부하·dedupe
48:3. **rollback·dry-run·legal 게이트**:
50:   - dry-run 결과와 실제 apply 결과 차이 처리 (CAS expectedDryRunReportId만으로 충분?)
51:   - legal 게이트가 어떤 planKind에 필요한가? PII 이동 외에도?
56:   - retry exhausted 시 자동 pause vs 자동 rollback
66:   - notifications outbox·idempotency 패턴
71:이전과 동일 JSON 스키마. 지적 ID 접두사 `CM1-`.
79:- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
80:- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
81:- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
86:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|REVIEW_WORKFLOW|AuditAction|contentMigration|contentMigration|policy-version-reevaluate|migration|CM-|outbox|idempot|legal|dry-run|rollback|reverse|read-only|pause|resume|cancel\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
90:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|AuditAction|contentMigration|contentMigration|migration|legal|PII|cascade|outbox|idempot|partial unique|CAS|CHECK|closed schema|contentType\" docs/features/asset-ingestion.md docs/features/crm-sync.md docs/features/compliance-assistant.md docs/features/notifications.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
93:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
94:10:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 (cascade 필요 — `contentMigrationConfig`·`contentMigrationPolicyVersion`)
95:12:> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
97:20:- **핵심 책임**: (a) migration plan 정의·검증·dry-run, (b) plan 실행·진행 추적·step-level retry, (c) failure 시 rollback 또는 skip, (d) 운영 중 안전한 실행 (read-only window·partial cutover), (e) audit·legal 승인 게이트, (f) policyVersion 변경 시 ComplianceRecord 재평가
98:22:- **migration plan kind 5종 (v1.0)**: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
99:23:- **운영 모드 2종**: `dry-run`(영향 보고만)·`apply`(실제 변경)
100:24:- **rollback 정책**: step별 reverse-step 정의 시 가능. reverse 불가능 step은 plan 정의 시 명시 + 운영자 승인
101:35:| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
105:41:| rollback 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
107:48:- 알림·audit canonical SoT → notifications + REVIEW_WORKFLOW
108:51:- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
109:52:- 본 문서 = migration plan·step·실행 파이프라인·rollback·dry-run·legal 게이트 SoT
110:65:- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
113:87:| notifications | notify() 필수 |
114:88:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
115:89:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
116:90:| DATA_MODEL C-08 | `contentMigrationConfig`·`contentMigrationPolicyVersion` (cascade 필요) |
117:92:| compliance-assistant | `policy-version-reevaluate` plan kind 실행 시 |
119:98:  legalApproved: true
120:99:  legalApprovedBy: "legal@glitzy.kr"
121:100:  legalApprovedAt: "2026-05-10T00:00:00Z"
122:101:  defaultMode: "dry-run"                                # dry-run | apply
123:105:    instanceToInstanceCopy: super-admin + legal-reviewer
127:124:      rollback:
128:125:        autoRollbackOnFailure: false                    # true면 step 실패 시 자동 rollback. false면 운영자 수동
129:126:        rollbackTimeoutSeconds: 7200
130:129:        impactSamplingSize: 100                         # dry-run 시 변경 영향 sample 개수
132:148:| 실행 | `validatePlan(planId)` | plan 정의 검증 (step 정합성·reverse-step·legal) | super-admin |
133:149:| 실행 | `runDryRun(planId)` | dry-run 실행·영향 보고 | super-admin |
134:150:| 실행 | `runApply(planId, options)` | 실제 plan 실행 | super-admin (legal 게이트 통과 시) |
138:154:| 실행 | `rollbackRun(runId, scope)` | 완료·실패 plan rollback | super-admin |
139:155:| read | `queryPlans` | plan 목록·detail | operator·super-admin·legal-reviewer |
140:158:| 운영 | `approvePlanLegalGate(planId)` | legal 승인 게이트 | legal-reviewer |
142:164:| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·legalRequired·approvalChain |
143:165:| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·planFingerprint |
145:167:| `content-migration-run-completed` | `"cm-run:" + runId` | result·changedRecords·failedSteps·rollbackTriggered |
147:169:| `content-migration-rollback-applied` | `"cm-run:" + runId` | scope·rolledBackSteps·result |
148:180:분원 신설 등 본원 콘텐츠 일괄 복제. PII 이동 시 legal-reviewer 승인 강제.
149:185:#### 3.2.5 policy-version-reevaluate
150:196:  | "policy-version-reevaluate";
152:213:  reverseStep?: MigrationStep;                          // rollback 시 실행. 없으면 reverse 불가
153:220:  expectedDryRunReportId: string;                       // CAS — 가장 최근 dry-run report 기반 실행
154:235:### 4.1 plan 정의 → validate → dry-run → legal 승인 → apply
156:242:4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
158:250:### 4.2 rollback
159:253:1. rollbackRun(runId, scope) — 완료된 step에서 reverse-step 역순 실행
161:255:3. rollback 자체 실패 → super-admin alert
163:266:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
167:273:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
169:284:| dry-run 정확도 | apply 결과와 일치 | > 95% |
170:285:| rollback 성공율 | rollback 호출 시 | > 99% |
174:303:- `legalApproved !== true`
175:310:- legal 게이트 필요한 planKind인데 `approvePlanLegalGate` 미수행
176:312:- reverse-step 없는 step에 대해 rollback scope 지정 → runtime fail (운영자 명시적 skip 요구)
180:325:plan 정의·status (draft·validated·dry-run-completed·legal-approved·apply-ready·archived).
181:328:dry-run 결과 — 영향 row 수·sample diff·예상 시간.
182:331:legal 게이트 승인 기록 — approvedBy·approvedAt·planFingerprint.
183:334:실행 envelope (status=pending·running·paused·completed·failed·cancelled·rollback-in-progress·rolled-back).
184:343:rollback 시 실행된 reverse-step 기록.
188:359:| CM-03 | dry-run sampling 알고리즘 — 단순 random vs stratified |
190:361:| CM-05 | rollback 시 일부 step만 부분 rollback 안전성 |
191:362:| CM-06 | policy-version-reevaluate 대량 batch 시 compliance-assistant 부하 관리 |
196:docs/ARCHITECTURE.md:20:- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
199:docs/ARCHITECTURE.md:408:| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
202:docs/ARCHITECTURE.md:603:| 2026-05-14 | v0.6 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.5.1 / DATA_MODEL v0.5 / admin v0.5): (1) **P-013 Legal/Policy를 M0 출시 게이트로 격상** — M0 9 → 10페이지 (Core 표준 템플릿 + ClinicProfile 변수 자동 치환), (2) C-10 ComplianceRecord.contentType enum에 `LegalDocument` 추가, (3) `CTAConfig.isFeatured: boolean` 신규 — LocationProfile.featuredCta `Ref<CTAConfig>` 표기 위반 정정, 필드 제거, (4) 관계 다이어그램 Article.author/reviewedBy 단일 참조 표기 정정. 본 문서 § 2.4 인벤토리는 영향 없음 (LegalDocument는 이미 등재된 C-16) | Glitzy (Claude 페어링) |
203:docs/ARCHITECTURE.md:604:| 2026-05-14 | v0.7 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.6 / DATA_MODEL v0.6 / admin v0.6): (1) admin § 3.3 ClinicProfile 행 SoT 정합 분리, (2) **LegalDocument 변수 출처** ClinicProfile + LocationProfile(main) 명시, (3) **C-16 LegalDocument M0 ✅ (auto) 표시**, (4) **LegalDocument 법무 검토 강제 룰** — ComplianceRecord.legalCounsel/legalCounselAt required (위험도 Low 예외 게이트), (5) **CTAConfig.isFeatured 회귀 제거** (v0.5 도입 → v0.6 제거) + **LocationProfile.featuredChannelId: Slug 신규** (컨테이너에 두기 — 객체 재사용 시 의도 누수 방지). 본 문서 § 2.4 인벤토리는 영향 없음 | Glitzy (Claude 페어링) |
204:docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-14 (v0.20 — `features/crm-sync.md` 3차 사이클 cascade: C-08 CrmIntegrationEntry에 `genericRestApiAdapter` 추가 + manifest vs CrmCredentialVersion(admin DB) 경계 명시 — CS3-13)
205:docs/core/DATA_MODEL.md:20:- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
206:docs/core/DATA_MODEL.md:222:| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
207:docs/core/DATA_MODEL.md:656:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
208:docs/core/DATA_MODEL.md:665:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
209:docs/core/DATA_MODEL.md:673:| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
210:docs/core/DATA_MODEL.md:674:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
211:docs/core/DATA_MODEL.md:710:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
212:docs/core/DATA_MODEL.md:711:| `legalApprovedBy` | string | ✅ | |
213:docs/core/DATA_MODEL.md:712:| `legalApprovedAt` | Date | ✅ | |
214:docs/core/DATA_MODEL.md:720:법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
215:docs/core/DATA_MODEL.md:751:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
216:docs/core/DATA_MODEL.md:752:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
217:docs/core/DATA_MODEL.md:764:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
218:docs/core/DATA_MODEL.md:765:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
219:docs/core/DATA_MODEL.md:776:| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
220:docs/core/DATA_MODEL.md:777:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
221:docs/core/DATA_MODEL.md:793:| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
222:docs/core/DATA_MODEL.md:810:| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
223:docs/core/DATA_MODEL.md:828:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
224:docs/core/DATA_MODEL.md:857:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
225:docs/core/DATA_MODEL.md:950:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
226:docs/core/DATA_MODEL.md:951:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
227:docs/core/DATA_MODEL.md:952:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
228:docs/core/DATA_MODEL.md:1071:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
229:docs/core/DATA_MODEL.md:1072:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
230:docs/core/DATA_MODEL.md:1076:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
231:docs/core/DATA_MODEL.md:1077:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
232:docs/core/DATA_MODEL.md:1078:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
233:docs/core/DATA_MODEL.md:1079:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
234:docs/core/DATA_MODEL.md:1080:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
235:docs/core/DATA_MODEL.md:1081:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
236:docs/core/DATA_MODEL.md:1082:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
237:docs/core/DATA_MODEL.md:1083:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
238:docs/core/DATA_MODEL.md:1084:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
239:docs/core/DATA_MODEL.md:1085:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
240:docs/core/DATA_MODEL.md:1086:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
241:docs/features/notifications.md:7:> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
242:docs/features/notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
243:docs/features/notifications.md:24:- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
244:docs/features/notifications.md:38:| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
245:docs/features/notifications.md:39:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
246:docs/features/notifications.md:43:| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
247:docs/features/notifications.md:89:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
248:docs/features/notifications.md:123:        LegalDocument: "/admin/legal/{contentRef}"
249:docs/features/notifications.md:124:        default: "/admin/content/{contentType}/{contentRef}"
250:docs/features/notifications.md:143:- `sourceEventId` — idempotency key (필수)
251:docs/features/notifications.md:215:### 3.3 단일 엔트리포인트 — `notify()`
252:docs/features/notifications.md:218:async function notify(event: NotificationEvent): Promise<DeliveryResult>
253:docs/features/notifications.md:221:**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
254:docs/features/notifications.md:227:  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
255:docs/features/notifications.md:235:**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)
256:docs/features/notifications.md:237:**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)
257:docs/features/notifications.md:246:1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
258:docs/features/notifications.md:250:     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
259:docs/features/notifications.md:312:  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
260:docs/features/notifications.md:313:  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
261:docs/features/notifications.md:446:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
262:docs/features/notifications.md:554:**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
263:docs/features/notifications.md:559:- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)
264:docs/features/notifications.md:584:- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
265:docs/features/notifications.md:587:- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`
266:docs/features/notifications.md:596:- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)
267:docs/features/notifications.md:624:  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
268:docs/features/notifications.md:634:- operator·physician·legal·super-admin: 본 정책 미적용
269:docs/features/notifications.md:711:| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
270:docs/features/notifications.md:719:| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
271:docs/features/notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
272:docs/features/notifications.md:745:### 14.2 `NotificationEventReceipt` (idempotency 선점)
273:docs/features/notifications.md:751:| `sourceEventId` | string | ✅ | idempotency key |
274:docs/features/notifications.md:872:| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
275:docs/features/notifications.md:876:**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
276:docs/features/notifications.md:951:| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
277:docs/features/notifications.md:963:PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:
278:docs/features/notifications.md:968:activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
282:docs/features/compliance-assistant.md:87:DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):
287:docs/features/compliance-assistant.md:220:   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
291:docs/features/compliance-assistant.md:368:- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
297:docs/features/compliance-assistant.md:471:본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
298:docs/features/compliance-assistant.md:472:- `kind="all"` — 전체 published record `staleFlags.legal=true`
300:docs/features/compliance-assistant.md:550:2. **예외 승인 트랙**: 클라이언트가 비활성 요청 시 — Glitzy 슈퍼 어드민 승인 + 책임 면제 합의서 첨부 후 인스턴스에 `complianceAssistantExemptApproval` 객체 설정 (DATA_MODEL C-08 v0.12 cascade 완료). 본 객체가 있을 때만 비활성 허용. 필드: `approvedBy`·`approvedAt`·`exemptionAgreementUrl`·`reason`
301:docs/features/compliance-assistant.md:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
302:docs/features/compliance-assistant.md:557:     - `legal` — `priorReviewRequired === true` 시 자동 (legal 검수자의 매체 판정 단계)
303:docs/features/compliance-assistant.md:559:     - `review-case`·전후사진 노출 콘텐츠 → `["medical", "legal"]` (수동)
304:docs/features/compliance-assistant.md:560:     - `event-price` → `["legal"]` (수동)
305:docs/features/compliance-assistant.md:596:| ~~CA-02~~ | DATA_MODEL C-08 features[] config cascade | v0.2 — DATA_MODEL C-08 v0.10 cascade로 `features[].config` 필드 추가 |
306:docs/features/compliance-assistant.md:598:| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
307:docs/features/compliance-assistant.md:599:| ~~CA-10~~ | complianceAssistantExemptApproval 플래그 | v0.4 — DATA_MODEL C-08 v0.12 cascade로 `complianceAssistantExemptApproval` 필드 신설 (approvedBy·approvedAt·exemptionAgreementUrl·reason) |
309:docs/features/compliance-assistant.md:608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
310:docs/features/compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
311:docs/features/compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
312:docs/features/compliance-assistant.md:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
313:docs/features/compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
314:docs/admin/REVIEW_WORKFLOW.md:26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
315:docs/admin/REVIEW_WORKFLOW.md:38:| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
316:docs/admin/REVIEW_WORKFLOW.md:66:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
317:docs/admin/REVIEW_WORKFLOW.md:138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
318:docs/admin/REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
319:docs/admin/REVIEW_WORKFLOW.md:218:           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
320:docs/admin/REVIEW_WORKFLOW.md:219:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
321:docs/admin/REVIEW_WORKFLOW.md:237:| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
322:docs/admin/REVIEW_WORKFLOW.md:254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
323:docs/admin/REVIEW_WORKFLOW.md:269:| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
324:docs/admin/REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
325:docs/admin/REVIEW_WORKFLOW.md:274:DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
326:docs/admin/REVIEW_WORKFLOW.md:299:- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
327:docs/admin/REVIEW_WORKFLOW.md:313:| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
328:docs/admin/REVIEW_WORKFLOW.md:318:| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
329:docs/admin/REVIEW_WORKFLOW.md:319:| ReviewPolicy 변경 | `legal=true` |
330:docs/admin/REVIEW_WORKFLOW.md:320:| 전후사진 미디어 첨부·교체 | `legal=true` |
331:docs/admin/REVIEW_WORKFLOW.md:342:legal > medical > client > operator
332:docs/admin/REVIEW_WORKFLOW.md:359:                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
333:docs/admin/REVIEW_WORKFLOW.md:360:                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
334:docs/admin/REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
335:docs/admin/REVIEW_WORKFLOW.md:394:**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:
336:docs/admin/REVIEW_WORKFLOW.md:396:1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
337:docs/admin/REVIEW_WORKFLOW.md:397:2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
338:docs/admin/REVIEW_WORKFLOW.md:398:3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
339:docs/admin/REVIEW_WORKFLOW.md:399:4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)
340:docs/admin/REVIEW_WORKFLOW.md:403:- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
341:docs/admin/REVIEW_WORKFLOW.md:408:- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
342:docs/admin/REVIEW_WORKFLOW.md:409:- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
343:docs/admin/REVIEW_WORKFLOW.md:412:#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거
344:docs/admin/REVIEW_WORKFLOW.md:414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
345:docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
346:docs/admin/REVIEW_WORKFLOW.md:429:3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
347:docs/admin/REVIEW_WORKFLOW.md:430:4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
348:docs/admin/REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
349:docs/admin/REVIEW_WORKFLOW.md:433:   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
350:docs/admin/REVIEW_WORKFLOW.md:434:6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
351:docs/admin/REVIEW_WORKFLOW.md:440:- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록
352:docs/admin/REVIEW_WORKFLOW.md:445:1. legal 검수자 priorReviewRequired=true 기록
353:docs/admin/REVIEW_WORKFLOW.md:478:  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
354:docs/admin/REVIEW_WORKFLOW.md:482:  // `features/search-visibility.md` 1차 cycle cascade (F-1)
355:docs/admin/REVIEW_WORKFLOW.md:488:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
356:docs/admin/REVIEW_WORKFLOW.md:497:  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
357:docs/admin/REVIEW_WORKFLOW.md:501:  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
358:docs/admin/REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
359:docs/admin/REVIEW_WORKFLOW.md:520:| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
360:docs/admin/REVIEW_WORKFLOW.md:527:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
361:docs/admin/REVIEW_WORKFLOW.md:528:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
362:docs/admin/REVIEW_WORKFLOW.md:545:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
363:docs/admin/REVIEW_WORKFLOW.md:554:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
364:docs/admin/REVIEW_WORKFLOW.md:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
365:docs/admin/REVIEW_WORKFLOW.md:567:  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
366:docs/admin/REVIEW_WORKFLOW.md:568:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
367:docs/admin/REVIEW_WORKFLOW.md:591:  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
368:docs/admin/REVIEW_WORKFLOW.md:598:#### 9.2.1 idempotency 계약
369:docs/admin/REVIEW_WORKFLOW.md:601:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
370:docs/admin/REVIEW_WORKFLOW.md:635:  action: AuditAction;          // § 10.2.1 enum
371:docs/admin/REVIEW_WORKFLOW.md:639:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
372:docs/admin/REVIEW_WORKFLOW.md:643:#### 10.2.1 AuditAction enum
373:docs/admin/REVIEW_WORKFLOW.md:646:type AuditAction =
374:docs/admin/REVIEW_WORKFLOW.md:656:  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
375:docs/admin/REVIEW_WORKFLOW.md:657:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
376:docs/admin/REVIEW_WORKFLOW.md:661:  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
377:docs/admin/REVIEW_WORKFLOW.md:662:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
378:docs/admin/REVIEW_WORKFLOW.md:663:  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
379:docs/admin/REVIEW_WORKFLOW.md:668:  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
380:docs/admin/REVIEW_WORKFLOW.md:669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
381:docs/admin/REVIEW_WORKFLOW.md:674:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
382:docs/admin/REVIEW_WORKFLOW.md:699:  | "legal-reviewer"      // legal 역할 검수만
383:docs/admin/REVIEW_WORKFLOW.md:706:| 액션 | super-admin | operator | physician | legal | client |
384:docs/admin/REVIEW_WORKFLOW.md:712:| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
385:docs/admin/REVIEW_WORKFLOW.md:719:> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
386:docs/admin/REVIEW_WORKFLOW.md:721:> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
387:docs/admin/REVIEW_WORKFLOW.md:764:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
388:docs/admin/REVIEW_WORKFLOW.md:765:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
389:docs/admin/REVIEW_WORKFLOW.md:766:| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
390:docs/admin/REVIEW_WORKFLOW.md:773:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
391:docs/admin/REVIEW_WORKFLOW.md:774:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
392:docs/admin/REVIEW_WORKFLOW.md:775:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
393:docs/admin/REVIEW_WORKFLOW.md:776:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
394:docs/admin/REVIEW_WORKFLOW.md:777:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
396:docs/features/asset-ingestion.md:8:> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4
399:docs/features/asset-ingestion.md:20:- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
402:docs/features/asset-ingestion.md:32:| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
405:docs/features/asset-ingestion.md:45:- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
408:docs/features/asset-ingestion.md:82:| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
409:docs/features/asset-ingestion.md:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
410:docs/features/asset-ingestion.md:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
411:docs/features/asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
413:docs/features/asset-ingestion.md:147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
414:docs/features/asset-ingestion.md:148:- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
415:docs/features/asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
416:docs/features/asset-ingestion.md:155:- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
421:docs/features/asset-ingestion.md:212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
422:docs/features/asset-ingestion.md:221:| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
430:docs/features/asset-ingestion.md:372:   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
435:docs/features/asset-ingestion.md:416:- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
436:docs/features/asset-ingestion.md:417:- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
438:docs/features/asset-ingestion.md:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
449:docs/features/asset-ingestion.md:501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
450:docs/features/asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
453:docs/features/asset-ingestion.md:521:- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
454:docs/features/asset-ingestion.md:522:- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`
459:docs/features/asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
461:docs/features/asset-ingestion.md:556:- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
465:docs/features/asset-ingestion.md:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
466:docs/features/asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
467:docs/features/asset-ingestion.md:625:- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
469:docs/features/asset-ingestion.md:646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
471:docs/features/asset-ingestion.md:670:  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
472:docs/features/asset-ingestion.md:694:**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.
473:docs/features/asset-ingestion.md:700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
474:docs/features/asset-ingestion.md:701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
475:docs/features/asset-ingestion.md:702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
476:docs/features/asset-ingestion.md:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
478:docs/features/asset-ingestion.md:759:- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
480:docs/features/crm-sync.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
484:docs/features/crm-sync.md:25:- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
493:docs/features/crm-sync.md:103:| notifications | notify() 필수 |
494:docs/features/crm-sync.md:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
496:docs/features/crm-sync.md:124:      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
497:docs/features/crm-sync.md:164:      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
502:docs/features/crm-sync.md:206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
503:docs/features/crm-sync.md:212:### 3.1.1 audit log contract (7종 AuditAction)
505:docs/features/crm-sync.md:216:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
511:docs/features/crm-sync.md:291:| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
512:docs/features/crm-sync.md:294:| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
513:docs/features/crm-sync.md:296:| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
514:docs/features/crm-sync.md:297:| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
515:docs/features/crm-sync.md:299:| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
516:docs/features/crm-sync.md:312:| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |
517:docs/features/crm-sync.md:319:**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
547:docs/features/crm-sync.md:814:  SELECT id FROM crm_sync_notification_outbox
548:docs/features/crm-sync.md:818:UPDATE crm_sync_notification_outbox o
549:docs/features/crm-sync.md:823:UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;
550:docs/features/crm-sync.md:826:UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;
551:docs/features/crm-sync.md:829:UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
552:docs/features/crm-sync.md:836:**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.
553:docs/features/crm-sync.md:838:| 대상 | 즉시 액션 | 보존 | legalHold default | FK ON DELETE |
554:docs/features/crm-sync.md:840:| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
555:docs/features/crm-sync.md:850:| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
556:docs/features/crm-sync.md:856:`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).
559:docs/features/crm-sync.md:867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
567:docs/features/crm-sync.md:954:precedence: legalHold > unregister > expiry > consent withdrawal.
568:docs/features/crm-sync.md:958:- legalHold=true row는 skip
571:docs/features/crm-sync.md:988:- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)
578:docs/features/crm-sync.md:1060:- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
579:docs/features/crm-sync.md:1061:- legalHold > unregister snapshot > retention purge
580:docs/features/crm-sync.md:1069:- retentionDays.consentWithdrawalLedger + legalHold=false → delete
581:docs/features/crm-sync.md:1070:- legalHold=true → skip
584:docs/features/crm-sync.md:1082:- DATA_MODEL C-08 v0.20 `genericRestApiAdapter` 5필드 + `versionTokenType` cascade 동기화 build validator
586:docs/features/crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
597:docs/features/crm-sync.md:1143:- integration `legalApproved !== true` 또는 승인자/시각 누락
603:docs/features/crm-sync.md:1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
612:docs/features/crm-sync.md:1204:  - 우선순위: legalHold > unregister snapshot > retention purge
613:docs/features/crm-sync.md:1208:    | 테이블 | action | legal hold default |
614:docs/features/crm-sync.md:1218:    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
616:docs/features/crm-sync.md:1253:| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
619:docs/features/crm-sync.md:1288:| 2026-05-14 | v0.4 | codex 3차 17 지적 반영 + REVIEW_WORKFLOW·DATA_MODEL cascade |
620:docs/features/crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
621:docs/features/crm-sync.md:1312:| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
640:docs/features/crm-sync.md:1643:| `legalHold` | boolean | ✅ default true (CS4-06) |
641:docs/features/crm-sync.md:1644:| `expiresAt` | Date | optional — legalHold=true 시 null |
644:docs/features/crm-sync.md:1653:**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.
651:docs/features/crm-sync.md:1694:| 13.14 | CrmConsentWithdrawalLedger | CHECK XOR + 3종 UNIQUE + legalHold default true |
662:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
663:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 (cascade 필요 — `contentMigrationConfig`·`contentMigrationPolicyVersion`)
664:> - 페이지·콘텐츠 schema → DATA_MODEL C-01·C-09·C-10·C-13·C-14
665:> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
673:- **핵심 책임**: (a) migration plan 정의·검증·dry-run, (b) plan 실행·진행 추적·step-level retry, (c) failure 시 rollback 또는 skip, (d) 운영 중 안전한 실행 (read-only window·partial cutover), (e) audit·legal 승인 게이트, (f) policyVersion 변경 시 ComplianceRecord 재평가
675:- **migration plan kind 5종 (v1.0)**: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
676:- **운영 모드 2종**: `dry-run`(영향 보고만)·`apply`(실제 변경)
677:- **rollback 정책**: step별 reverse-step 정의 시 가능. reverse 불가능 step은 plan 정의 시 명시 + 운영자 승인
688:| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
694:| rollback 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
701:- 알림·audit canonical SoT → notifications + REVIEW_WORKFLOW
702:- 자격증명·policyVersion → DATA_MODEL C-08
703:- 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
704:- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
705:- 본 문서 = migration plan·step·실행 파이프라인·rollback·dry-run·legal 게이트 SoT
711:| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
712:| ContentMigrationNotificationOutbox | 5 | search-visibility § 7.3 패턴 |
717:- 알림 채널·재시도 → notifications
718:- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
719:- 콘텐츠 schema 자체 → DATA_MODEL
740:| notifications | notify() 필수 |
741:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
742:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
743:| DATA_MODEL C-08 | `contentMigrationConfig`·`contentMigrationPolicyVersion` (cascade 필요) |
744:| DATA_MODEL Core | 페이지·콘텐츠·ComplianceRecord schema |
745:| compliance-assistant | `policy-version-reevaluate` plan kind 실행 시 |
751:  legalApproved: true
752:  legalApprovedBy: "legal@glitzy.kr"
753:  legalApprovedAt: "2026-05-10T00:00:00Z"
754:  defaultMode: "dry-run"                                # dry-run | apply
758:    instanceToInstanceCopy: super-admin + legal-reviewer
768:    requiresFeature: [notifications]
777:      rollback:
778:        autoRollbackOnFailure: false                    # true면 step 실패 시 자동 rollback. false면 운영자 수동
779:        rollbackTimeoutSeconds: 7200
782:        impactSamplingSize: 100                         # dry-run 시 변경 영향 sample 개수
788:        notificationOutbox: 30
801:| 실행 | `validatePlan(planId)` | plan 정의 검증 (step 정합성·reverse-step·legal) | super-admin |
802:| 실행 | `runDryRun(planId)` | dry-run 실행·영향 보고 | super-admin |
803:| 실행 | `runApply(planId, options)` | 실제 plan 실행 | super-admin (legal 게이트 통과 시) |
807:| 실행 | `rollbackRun(runId, scope)` | 완료·실패 plan rollback | super-admin |
808:| read | `queryPlans` | plan 목록·detail | operator·super-admin·legal-reviewer |
811:| 운영 | `approvePlanLegalGate(planId)` | legal 승인 게이트 | legal-reviewer |
813:### 3.1.1 audit log contract (cascade 필요)
817:| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·legalRequired·approvalChain |
818:| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·planFingerprint |
820:| `content-migration-run-completed` | `"cm-run:" + runId` | result·changedRecords·failedSteps·rollbackTriggered |
822:| `content-migration-rollback-applied` | `"cm-run:" + runId` | scope·rolledBackSteps·result |
826:#### 3.2.1 schema-version-upgrade
827:DATA_MODEL 버전 업그레이드 시 backfill·column rename·default value 채움.
830:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
833:분원 신설 등 본원 콘텐츠 일괄 복제. PII 이동 시 legal-reviewer 승인 강제.
838:#### 3.2.5 policy-version-reevaluate
845:  | "schema-version-upgrade"
849:  | "policy-version-reevaluate";
866:  reverseStep?: MigrationStep;                          // rollback 시 실행. 없으면 reverse 불가
873:  expectedDryRunReportId: string;                       // CAS — 가장 최근 dry-run report 기반 실행
888:### 4.1 plan 정의 → validate → dry-run → legal 승인 → apply
891:1. definePlan(input) — ContentMigrationPlan row 생성 (status=draft)
895:4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
898:   - step 순차 실행. 각 step ContentMigrationStepResult insert
900:6. 완료 → audit + 알림
903:### 4.2 rollback
906:1. rollbackRun(runId, scope) — 완료된 step에서 reverse-step 역순 실행
908:3. rollback 자체 실패 → super-admin alert
918:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\admin\\REVIEW_WORKFLOW.md | Select-Object -Skip 0 -First 260" in C:\Users\assag\solution\website-exposure
920:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\core\\DATA_MODEL.md | Select-Object -Skip 620 -First 170" in C:\Users\assag\solution\website-exposure
927:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
934:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
945:| dry-run 정확도 | apply 결과와 일치 | > 95% |
946:| rollback 성공율 | rollback 호출 시 | > 99% |
964:- `legalApproved !== true`
965:- `requiresFeature: notifications` 충족 안 됨
971:- legal 게이트 필요한 planKind인데 `approvePlanLegalGate` 미수행
973:- reverse-step 없는 step에 대해 rollback scope 지정 → runtime fail (운영자 명시적 skip 요구)
985:### 9.1 `ContentMigrationPlan`
986:plan 정의·status (draft·validated·dry-run-completed·legal-approved·apply-ready·archived).
988:### 9.2 `ContentMigrationDryRunReport`
989:dry-run 결과 — 영향 row 수·sample diff·예상 시간.
991:### 9.3 `ContentMigrationLegalApproval`
992:legal 게이트 승인 기록 — approvedBy·approvedAt·planFingerprint.
994:### 9.4 `ContentMigrationRun`
995:실행 envelope (status=pending·running·paused·completed·failed·cancelled·rollback-in-progress·rolled-back).
997:### 9.5 `ContentMigrationStepResult`
1000:### 9.6 `ContentMigrationStepRetryQueue`
1003:### 9.7 `ContentMigrationRollbackLog`
1004:rollback 시 실행된 reverse-step 기록.
1006:### 9.8 `ContentMigrationReadOnlyWindow`
1009:### 9.9 `ContentMigrationNotificationOutbox`
1020:| CM-03 | dry-run sampling 알고리즘 — 단순 random vs stratified |
1022:| CM-05 | rollback 시 일부 step만 부분 rollback 안전성 |
1023:| CM-06 | policy-version-reevaluate 대량 batch 시 compliance-assistant 부하 관리 |
1048:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
1060:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
1061:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
1082:- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
1087:- 데이터 계약 자체 — `DATA_MODEL.md`
1101:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
1173:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
1199:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
1253:           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
1254:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
1272:| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
1307:| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |
1309:> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
1333:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
1342:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
1350:| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
1351:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
1387:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
1388:| `legalApprovedBy` | string | ✅ | |
1389:| `legalApprovedAt` | Date | ✅ | |
1397:법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
1441:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
1442:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
1447:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
1448:| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
1451:| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
1452:| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
1453:| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
1454:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
1470:초안은 cascade “필요”라고만 적은 곳과 실제 SoT enum/매트릭스 반영이 갈라져 있습니다. 이제 REVIEW_WORKFLOW의 알림 매트릭스와 AuditAction 표, compliance-assistant check 계약을 좁혀서 확인하겠습니다.
1472:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"9\\.1\\.1|NotificationEventType|eventType|content-migration|crm-sync|asset-ingestion|AuditAction|10\\.2\\.1|type AuditAction|notification\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
1476:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"external|promote|asset-ingestion|content-migration|manualUpload|csvImport|copy|migration|legal|PII|boundary|SoT\" docs\\features\\asset-ingestion.md" in C:\Users\assag\solution\website-exposure
1478:25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
1485:414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
1486:460:## 9. 알림 (notifications Feature Module 인터페이스)
1487:462:본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
1506:545:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
1512:552:- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
1513:554:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
1514:555:- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
1515:557:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
1516:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
1520:601:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
1522:606:- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
1523:607:- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
1524:608:- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
1525:611:  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
1526:625:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
1528:639:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
1531:652:  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
1532:653:  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
1533:654:  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
1534:655:  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
1544:680:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
1545:766:| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
1546:772:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
1547:773:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
1568:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
1577:552:   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
1578:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
1580:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
1581:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
1582:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
1591:20:- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
1592:32:| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
1595:35:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
1599:45:- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
1600:46:- 자격증명·policyVersion·AssetIngestionApprovedScope SoT는 DATA_MODEL C-08 v0.18
1601:47:- Core 데이터 계약 SoT는 DATA_MODEL C-01~C-22
1606:82:| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
1607:86:| DATA_MODEL C-23 | AdminUser (검수자·promote 권한) |
1608:87:| DATA_MODEL C-01~C-22 | promote 대상 Core 데이터 계약 |
1609:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
1616:145:### 5.1 web-crawl (법무 게이트 — DATA_MODEL C-08 AssetIngestionApprovedScope SoT)
1617:147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
1618:148:- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
1619:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
1620:155:- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
1621:174:  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
1626:212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
1629:221:| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
1636:275:// TreatmentPage (DATA_MODEL C-03 v0.4 정합 — AI4-05 SoT 동등)
1642:371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
1648:416:- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
1649:417:- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
1671:501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
1672:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
1678:521:- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
1679:522:- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`
1688:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
1696:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
1697:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
1699:625:- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
1700:646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
1702:670:  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
1704:694:**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.
1705:700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
1706:701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
1707:702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
1708:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
1714:759:- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
1717:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\admin\\REVIEW_WORKFLOW.md | Select-Object -Skip 460 -First 230" in C:\Users\assag\solution\website-exposure
1721:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ContentMigration|contentMigrationConfig|contentMigrationPolicyVersion|content-migration\" docs\\core\\DATA_MODEL.md docs\\ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
1723:docs\ARCHITECTURE.md:20:- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
1726:docs\ARCHITECTURE.md:408:| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
1871:본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
1872:- `kind="all"` — 전체 published record `staleFlags.legal=true`
1876:**(b) 재검수 사이클 진입 (REVIEW_WORKFLOW § 6.2)**:
1894:본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
1952:| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
1959:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
1960:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
1977:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
1984:- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
1986:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
1987:- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
1989:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
1994:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
2011:  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
2033:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
2038:- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
2039:- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
2040:- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
2042:  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
2043:  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
2057:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
2059:### 10.2 audit log 페이로드
2071:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
2084:  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
2085:  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
2086:  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
2087:  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
2112:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
2116:- audit log는 **append-only** — 수정·삭제 불가
2125:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ready_for_v1_0|findings|severity|blocking|major|minor|CM1-|CS1-|AI1-|N1-|cycle" docs -g "*.md"' in C:\Users\assag\solution\website-exposure
2142:docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
2150:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
2165:docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
2166:docs\features\compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
2167:docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
2168:docs\core\DATA_MODEL.md:710:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
2169:docs\core\DATA_MODEL.md:713:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
2170:docs\core\DATA_MODEL.md:800:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
2171:docs\core\DATA_MODEL.md:1086:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
2174:docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
2198:docs\core\CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
2199:docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
2202:docs\admin\REVIEW_WORKFLOW.md:478:  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
2203:docs\admin\REVIEW_WORKFLOW.md:482:  // `features/search-visibility.md` 1차 cycle cascade (F-1)
2204:docs\admin\REVIEW_WORKFLOW.md:483:  | "search-visibility-anomaly-critical"     // critical severity anomaly
2205:docs\admin\REVIEW_WORKFLOW.md:484:  | "search-visibility-anomaly-warning"      // warning severity anomaly
2206:docs\admin\REVIEW_WORKFLOW.md:485:  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
2207:docs\admin\REVIEW_WORKFLOW.md:488:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
2208:docs\admin\REVIEW_WORKFLOW.md:496:  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
2209:docs\admin\REVIEW_WORKFLOW.md:497:  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
2210:docs\admin\REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
2211:docs\admin\REVIEW_WORKFLOW.md:504:  | "crm-sync-batch-failed"                   // sync cycle 실패
2212:docs\admin\REVIEW_WORKFLOW.md:531:| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
2213:docs\admin\REVIEW_WORKFLOW.md:541:| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
2214:docs\admin\REVIEW_WORKFLOW.md:657:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
2215:docs\admin\REVIEW_WORKFLOW.md:663:  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
2216:docs\admin\REVIEW_WORKFLOW.md:669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
2217:docs\admin\REVIEW_WORKFLOW.md:674:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
2218:docs\features\content-migration.md:12:> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
2219:docs\features\content-migration.md:51:- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
2220:docs\features\content-migration.md:65:- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
2221:docs\features\content-migration.md:242:4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
2222:docs\features\crm-sync.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
2230:docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
2234:docs\features\keyword-monitoring.md:200:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` | retroactive enqueue. **권한: super-admin 전용**. audit `keyword-monitoring-retroactive-enqueue-requested` (§ 3.1.1) |
2242:docs\features\keyword-monitoring.md:390:> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류
2244:docs\features\keyword-monitoring.md:408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
2248:docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
2249:docs\features\notifications.md:492:- missed run: ±10분 → 다음 cycle carry-over
2250:docs\features\notifications.md:629:  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
2251:docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
2275:docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
2290:    "blocking": 9,
2291:    "major": 10,
2292:    "minor": 5,
2293:    "overall_assessment": "v0.1은 핵심 방향은 맞지만, SoT cascade가 실제 완료되지 않았고 rollback/dry-run/legal/read-only 경계가 운영 가능한 수준으로 닫혀 있지 않다. 특히 REVIEW_WORKFLOW, DATA_MODEL C-08, compliance-assistant 대량 재평가 계약이 미완이라 v1.0 후보로는 이르다."
2297:      "id": "CM1-01",
2298:      "severity": "blocking",
2300:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
2302:        "content-migration.md §5.1은 `content-migration-plan-approved`, `content-migration-run-completed`, `content-migration-run-failed`, `content-migration-rollback-triggered` 4종을 정의한다.",
2303:        "REVIEW_WORKFLOW.md §9.1 및 §9.1.1 canonical SoT에는 content-migration 이벤트가 없다."
2305:      "impact": "notifications v1.0의 `notify()`는 REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스를 SoT로 삼으므로, 현재 이벤트는 타입/라우팅/quietHours/fallback/digest 정책이 없는 비정상 이벤트다.",
2306:      "recommendation": "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스에 4행을 cascade 완료로 반영하고, content-migration.md에는 `cascade 필요`가 아니라 `cascade 완료` 또는 명시 후속 상태를 일관되게 표기하라."
2309:      "id": "CM1-02",
2310:      "severity": "blocking",
2312:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
2315:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
2317:      "impact": "감사 로그 append-only 계약과 타입 검증이 깨진다. 특히 migration plan/apply/rollback은 고위험 운영 행위라 audit 누락은 v1.0 차단 사유다.",
2318:      "recommendation": "REVIEW_WORKFLOW §10.2.1에 6종을 cascade하고, actorRole 권한 및 metadata required shape를 별도 표로 닫아라."
2321:      "id": "CM1-03",
2322:      "severity": "blocking",
2323:      "category": "DATA_MODEL",
2324:      "title": "DATA_MODEL C-08에 `contentMigrationConfig`와 `contentMigrationPolicyVersion`이 실제로 없다",
2327:        "DATA_MODEL.md C-08에는 notifications, analytics, search-visibility, keyword-monitoring, asset-ingestion, crm-sync 설정만 있고 content-migration 설정이 없다."
2330:      "recommendation": "DATA_MODEL C-08에 `ContentMigrationConfig` 타입과 `contentMigrationPolicyVersion` top-level 필드를 추가하고, `legalApprovedBy/At`, approvalRequired, read-only, retention, rollback 옵션의 required 여부를 명시하라."
2333:      "id": "CM1-04",
2334:      "severity": "blocking",
2336:      "title": "`policy-version-reevaluate`의 compliance-assistant 대량 `check()` 호출 계약이 닫혀 있지 않다",
2342:      "recommendation": "`policy-version-reevaluate` 전용 batch contract를 추가하라: 대상 ComplianceRecord selection, cacheKey dedupe, concurrency/rate limit, durable cache hit 처리, `sourceEventId`, 새 ComplianceRecord(recordVersion 증가) 생성 또는 staleFlags-only 모드 분기."
2345:      "id": "CM1-05",
2346:      "severity": "blocking",
2348:      "title": "`schema-version-upgrade`가 DB DDL 책임과 충돌한다",
2351:        "content-migration.md §3.2.1은 DATA_MODEL 버전 업그레이드 시 `column rename`을 예시로 든다."
2353:      "impact": "application-level data migration과 DB schema migration의 소유권이 뒤섞인다. 실제 운영에서 DDL 배포 순서, app compatibility window, rollback 책임이 불명확해진다.",
2354:      "recommendation": "`schema-version-upgrade`를 `application-data-version-upgrade`로 좁히거나, DDL은 precondition으로만 참조하라. 예: column 존재/nullable/default 검증은 읽기만 하고 DDL 실행은 금지."
2357:      "id": "CM1-06",
2358:      "severity": "blocking",
2359:      "category": "rollback",
2360:      "title": "reverse-step이 선택 필드라 rollback 가능성 필수 요구와 모순된다",
2362:        "content-migration.md §0은 rollback 가능성 필수를 전제하지만 §3.3 `reverseStep?`는 optional이다.",
2366:      "recommendation": "v1.0에서는 step별 `rollbackClass = reversible | compensating | irreversible`를 강제하고, irreversible step은 dry-run/apply 모두 별도 legal/super-admin 승인 + blast radius cap + backup/snapshot precondition을 요구하라."
2369:      "id": "CM1-07",
2370:      "severity": "blocking",
2371:      "category": "dry-run",
2372:      "title": "`expectedDryRunReportId`만으로 dry-run/apply drift를 막기 어렵다",
2375:        "§4.1 apply는 dry-run 이후 read-only window를 적용한다고만 한다."
2377:      "impact": "dry-run 후 대상 row, source instance, policyVersion, step registry, plan body, content hash가 바뀌어도 report id만 맞으면 apply가 진행될 수 있다.",
2381:      "id": "CM1-08",
2382:      "severity": "blocking",
2383:      "category": "legal-gate",
2384:      "title": "legal 게이트 적용 대상이 PII 이동에만 좁게 잡혀 있다",
2386:        "content-migration.md §2.3은 `instanceToInstanceCopy`만 legal-reviewer를 요구한다.",
2387:        "§3.2.3도 PII 이동 시 legal 승인만 언급한다."
2389:      "impact": "의료광고 정책 재평가, LegalDocument/ReviewPolicy/PricingPage 일괄 변환, 전후사진/후기 이동, priorReviewRequired 판정 변경 같은 법무 영향 migration이 legal gate 없이 실행될 수 있다.",
2390:      "recommendation": "planKind 고정이 아니라 `legalImpactClassifier`를 두라. PII, LegalDocument, ReviewPolicy, PricingPage, before/after media, testimonial/review, priorReviewRequired 변경, cross-entity copy는 legal gate를 강제해야 한다."
2393:      "id": "CM1-09",
2394:      "severity": "blocking",
2399:        "notifications, compliance-assistant, asset-ingestion promote, crm-sync conflict resolution 등 admin DB write가 필요한 Feature와의 예외/큐잉 정책이 없다."
2402:      "recommendation": "write class를 `content-mutating`, `workflow-state`, `notification-operational`, `audit-append`, `feature-operational`로 나누고 차단/허용/큐잉 정책을 표로 정의하라. audit append와 notification operational write는 보통 허용되어야 한다."
2405:      "id": "CM1-10",
2406:      "severity": "major",
2408:      "title": "알림 이벤트명과 audit 이벤트명이 서로 불일치한다",
2411:        "§3.1.1 audit은 `content-migration-plan-legal-approved`를 쓴다."
2413:      "impact": "plan approved가 validation approved인지 legal approved인지 모호하다. notify sourceEventId와 audit correlation도 흐려진다.",
2414:      "recommendation": "`plan-validated`, `plan-legal-approved`, `run-completed`, `run-failed`, `rollback-triggered`처럼 상태 의미를 분리하고 event/audit naming을 맞춰라."
2417:      "id": "CM1-11",
2418:      "severity": "major",
2429:      "id": "CM1-12",
2430:      "severity": "major",
2441:      "id": "CM1-13",
2442:      "severity": "major",
2447:        "§4 실행 파이프라인에는 pause/cancel이 실행 중 step, retry queue, read-only window, rollback과 어떻게 상호작용하는지 없다."
2449:      "impact": "장시간 migration 중 cancel이 partial commit을 남길지 rollback을 요구할지, pause가 current step을 중단할지 다음 step부터 멈출지 구현마다 달라진다.",
2450:      "recommendation": "상태 전이를 닫아라: pause는 step boundary에서만 effective, cancel은 `pending/running/paused`별 결과, running step은 cooperative cancellation만 허용, cancel 후 rollback 가능/불가능 상태를 명시."
2453:      "id": "CM1-14",
2454:      "severity": "major",
2455:      "category": "retry-rollback",
2461:      "impact": "autoRollbackOnFailure=true인 경우에도 pause가 먼저인지 rollback이 먼저인지 알 수 없다. 실패 step이 partial write를 남긴 경우 대응이 늦어진다.",
2462:      "recommendation": "우선순위를 정의하라: non-compensated partial write 감지 시 rollback, retry exhausted는 기본 pause, autoRollbackOnFailure=true이면 rollback preflight 후 rollback-in-progress 전이 등."
2465:      "id": "CM1-15",
2466:      "severity": "major",
2477:      "id": "CM1-16",
2478:      "severity": "major",
2486:      "recommendation": "crm-sync의 requestFingerprint 패턴을 재사용하라. 동일 idempotencyKey+동일 fingerprint는 기존 결과 반환, fingerprint 불일치는 409 runtime fail + audit/sink alert로 닫아라."
2489:      "id": "CM1-17",
2490:      "severity": "major",
2492:      "title": "notification outbox가 `search-visibility §7.3 SQL 동일`이라고만 되어 notifications v1.0 idempotency 계약과 연결되지 않는다",
2495:        "REVIEW_WORKFLOW §9.2.1과 notifications.md §3.3은 `sourceEventId` idempotency를 요구한다."
2501:      "id": "CM1-18",
2502:      "severity": "major",
2504:      "title": "legal 승인 게이트를 ComplianceRecord lifecycle로 처리한다는 설명이 부정확하다",
2507:        "DATA_MODEL C-10 ComplianceRecord는 콘텐츠 검수 기록이며 migration plan 자체는 contentType enum 대상이 아니다."
2510:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
2513:      "id": "CM1-19",
2514:      "severity": "major",
2521:      "impact": "migration plan/report를 compliance-assistant나 REVIEW_WORKFLOW에 올리려는 순간 pageTypeId/articleType 유도 실패 또는 잘못된 룰 적용이 발생한다.",
2522:      "recommendation": "content-migration plan은 ComplianceRecord 대상이 아니라고 명시하거나, `featureContentType=\"feature:content-migration\"` 예외를 compliance-assistant와 DATA_MODEL C-10에 cascade하라."
2525:      "id": "CM1-20",
2526:      "severity": "major",
2533:      "impact": "마이그레이션 Feature인데 정작 기존 row의 상태, schema version watermark, dangling FK, rollback precondition, dry-run report retention 만료 등을 migration-time에 검증할 경로가 없다.",
2534:      "recommendation": "§8에 migration-time validation을 분리해 추가하라. 예: target selector 0건/과다, dry-run report expired, reverse-step precondition missing, stale policyVersion, row lock 불가, orphan Core row 감지."
2537:      "id": "CM1-21",
2538:      "severity": "minor",
2540:      "title": "§0 핵심 책임의 `skip`과 rollback 정책이 본문에서 충분히 정의되지 않는다",
2542:        "§0은 failure 시 rollback 또는 skip을 핵심 책임으로 둔다.",
2543:        "본문에는 skip 승인권자, skip 가능 step class, skip audit metadata가 없다."
2546:      "recommendation": "skip은 `irreversible/manual-remediation-required` step에서만 허용하고, reason, approver, affectedRows, remediationTicketRef를 필수 audit metadata로 하라."
2549:      "id": "CM1-22",
2550:      "severity": "minor",
2552:      "title": "dry-run 정확도 목표 `>95%`는 고위험 migration 기준으로 느슨하고 정의도 모호하다",
2554:        "§6은 dry-run 정확도 목표를 apply 결과와 일치 `>95%`로 둔다."
2557:      "recommendation": "정확도 지표를 `targetSetDigest match`, `changedRowCount delta`, `fieldDiff delta`, `blockedDriftCount`로 분리하고, critical/legal/PII 대상은 100% 일치 요구로 올려라."
2560:      "id": "CM1-23",
2561:      "severity": "minor",
2568:      "recommendation": "CM-06/07/08은 v1.0 blocking open issue로 격상하고, 해소 전 `ready_for_v1_0=false`를 유지하라."
2571:      "id": "CM1-24",
2572:      "severity": "minor",
2579:      "impact": "새 plan kind나 step type이 legal gate, read-only, rollback, dry-run report schema를 바꾸는 경우 MAJOR가 필요할 수 있다.",
2580:      "recommendation": "plan kind/step type 변경을 영향 기반으로 재분류하라. legal gate/read-only/rollback/dry-run output 변경은 MAJOR 또는 policyVersion 신규로 처리해야 한다."
2583:      "id": "CM1-25",
2584:      "severity": "minor",
2586:      "title": "read API가 legal-reviewer에게 모든 migration detail을 허용하지만 masking/export 정책이 없다",
2588:        "§3.1 `queryPlans`, `queryRuns`, `queryStepResults`는 operator·super-admin·legal-reviewer 모두 허용이다.",
2592:      "recommendation": "query 응답에 privacy class를 붙이고 operator/legal/super-admin별 sample diff masking, export 금지, retention을 정의하라."
2597:      "target": "docs/admin/REVIEW_WORKFLOW.md §9.1, §9.1.1",
2601:      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
2605:      "target": "docs/core/DATA_MODEL.md C-08",
2606:      "change": "`contentMigrationConfig`, `contentMigrationPolicyVersion`, `ContentMigrationConfig` 타입 추가"
2610:      "change": "`feature:content-migration` 예외가 필요한지 결정. 필요 없으면 content-migration 문서에서 plan legal approval은 ComplianceRecord 대상이 아님을 명시"
2616:    "dry-run fingerprint 및 apply CAS 강화",
2617:    "rollback class와 irreversible step 승인 모델",
2618:    "policy-version-reevaluate 대량 처리·dedupe·rate limit 설계",
2631:    "blocking": 9,
2632:    "major": 10,
2633:    "minor": 5,
2634:    "overall_assessment": "v0.1은 핵심 방향은 맞지만, SoT cascade가 실제 완료되지 않았고 rollback/dry-run/legal/read-only 경계가 운영 가능한 수준으로 닫혀 있지 않다. 특히 REVIEW_WORKFLOW, DATA_MODEL C-08, compliance-assistant 대량 재평가 계약이 미완이라 v1.0 후보로는 이르다."
2638:      "id": "CM1-01",
2639:      "severity": "blocking",
2641:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
2643:        "content-migration.md §5.1은 `content-migration-plan-approved`, `content-migration-run-completed`, `content-migration-run-failed`, `content-migration-rollback-triggered` 4종을 정의한다.",
2644:        "REVIEW_WORKFLOW.md §9.1 및 §9.1.1 canonical SoT에는 content-migration 이벤트가 없다."
2646:      "impact": "notifications v1.0의 `notify()`는 REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스를 SoT로 삼으므로, 현재 이벤트는 타입/라우팅/quietHours/fallback/digest 정책이 없는 비정상 이벤트다.",
2647:      "recommendation": "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스에 4행을 cascade 완료로 반영하고, content-migration.md에는 `cascade 필요`가 아니라 `cascade 완료` 또는 명시 후속 상태를 일관되게 표기하라."
2650:      "id": "CM1-02",
2651:      "severity": "blocking",
2653:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
2656:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
2658:      "impact": "감사 로그 append-only 계약과 타입 검증이 깨진다. 특히 migration plan/apply/rollback은 고위험 운영 행위라 audit 누락은 v1.0 차단 사유다.",
2659:      "recommendation": "REVIEW_WORKFLOW §10.2.1에 6종을 cascade하고, actorRole 권한 및 metadata required shape를 별도 표로 닫아라."
2662:      "id": "CM1-03",
2663:      "severity": "blocking",
2664:      "category": "DATA_MODEL",
2665:      "title": "DATA_MODEL C-08에 `contentMigrationConfig`와 `contentMigrationPolicyVersion`이 실제로 없다",
2668:        "DATA_MODEL.md C-08에는 notifications, analytics, search-visibility, keyword-monitoring, asset-ingestion, crm-sync 설정만 있고 content-migration 설정이 없다."
2671:      "recommendation": "DATA_MODEL C-08에 `ContentMigrationConfig` 타입과 `contentMigrationPolicyVersion` top-level 필드를 추가하고, `legalApprovedBy/At`, approvalRequired, read-only, retention, rollback 옵션의 required 여부를 명시하라."
2674:      "id": "CM1-04",
2675:      "severity": "blocking",
2677:      "title": "`policy-version-reevaluate`의 compliance-assistant 대량 `check()` 호출 계약이 닫혀 있지 않다",
2683:      "recommendation": "`policy-version-reevaluate` 전용 batch contract를 추가하라: 대상 ComplianceRecord selection, cacheKey dedupe, concurrency/rate limit, durable cache hit 처리, `sourceEventId`, 새 ComplianceRecord(recordVersion 증가) 생성 또는 staleFlags-only 모드 분기."
2686:      "id": "CM1-05",
2687:      "severity": "blocking",
2689:      "title": "`schema-version-upgrade`가 DB DDL 책임과 충돌한다",
2692:        "content-migration.md §3.2.1은 DATA_MODEL 버전 업그레이드 시 `column rename`을 예시로 든다."
2694:      "impact": "application-level data migration과 DB schema migration의 소유권이 뒤섞인다. 실제 운영에서 DDL 배포 순서, app compatibility window, rollback 책임이 불명확해진다.",
2695:      "recommendation": "`schema-version-upgrade`를 `application-data-version-upgrade`로 좁히거나, DDL은 precondition으로만 참조하라. 예: column 존재/nullable/default 검증은 읽기만 하고 DDL 실행은 금지."
2698:      "id": "CM1-06",
2699:      "severity": "blocking",
2700:      "category": "rollback",
2701:      "title": "reverse-step이 선택 필드라 rollback 가능성 필수 요구와 모순된다",
2703:        "content-migration.md §0은 rollback 가능성 필수를 전제하지만 §3.3 `reverseStep?`는 optional이다.",
2707:      "recommendation": "v1.0에서는 step별 `rollbackClass = reversible | compensating | irreversible`를 강제하고, irreversible step은 dry-run/apply 모두 별도 legal/super-admin 승인 + blast radius cap + backup/snapshot precondition을 요구하라."
2710:      "id": "CM1-07",
2711:      "severity": "blocking",
2712:      "category": "dry-run",
2713:      "title": "`expectedDryRunReportId`만으로 dry-run/apply drift를 막기 어렵다",
2716:        "§4.1 apply는 dry-run 이후 read-only window를 적용한다고만 한다."
2718:      "impact": "dry-run 후 대상 row, source instance, policyVersion, step registry, plan body, content hash가 바뀌어도 report id만 맞으면 apply가 진행될 수 있다.",
2722:      "id": "CM1-08",
2723:      "severity": "blocking",
2724:      "category": "legal-gate",
2725:      "title": "legal 게이트 적용 대상이 PII 이동에만 좁게 잡혀 있다",
2727:        "content-migration.md §2.3은 `instanceToInstanceCopy`만 legal-reviewer를 요구한다.",
2728:        "§3.2.3도 PII 이동 시 legal 승인만 언급한다."
2730:      "impact": "의료광고 정책 재평가, LegalDocument/ReviewPolicy/PricingPage 일괄 변환, 전후사진/후기 이동, priorReviewRequired 판정 변경 같은 법무 영향 migration이 legal gate 없이 실행될 수 있다.",
2731:      "recommendation": "planKind 고정이 아니라 `legalImpactClassifier`를 두라. PII, LegalDocument, ReviewPolicy, PricingPage, before/after media, testimonial/review, priorReviewRequired 변경, cross-entity copy는 legal gate를 강제해야 한다."
2734:      "id": "CM1-09",
2735:      "severity": "blocking",
2740:        "notifications, compliance-assistant, asset-ingestion promote, crm-sync conflict resolution 등 admin DB write가 필요한 Feature와의 예외/큐잉 정책이 없다."
2743:      "recommendation": "write class를 `content-mutating`, `workflow-state`, `notification-operational`, `audit-append`, `feature-operational`로 나누고 차단/허용/큐잉 정책을 표로 정의하라. audit append와 notification operational write는 보통 허용되어야 한다."
2746:      "id": "CM1-10",
2747:      "severity": "major",
2749:      "title": "알림 이벤트명과 audit 이벤트명이 서로 불일치한다",
2752:        "§3.1.1 audit은 `content-migration-plan-legal-approved`를 쓴다."
2754:      "impact": "plan approved가 validation approved인지 legal approved인지 모호하다. notify sourceEventId와 audit correlation도 흐려진다.",
2755:      "recommendation": "`plan-validated`, `plan-legal-approved`, `run-completed`, `run-failed`, `rollback-triggered`처럼 상태 의미를 분리하고 event/audit naming을 맞춰라."
2758:      "id": "CM1-11",
2759:      "severity": "major",
2770:      "id": "CM1-12",
2771:      "severity": "major",
2782:      "id": "CM1-13",
2783:      "severity": "major",
2788:        "§4 실행 파이프라인에는 pause/cancel이 실행 중 step, retry queue, read-only window, rollback과 어떻게 상호작용하는지 없다."
2790:      "impact": "장시간 migration 중 cancel이 partial commit을 남길지 rollback을 요구할지, pause가 current step을 중단할지 다음 step부터 멈출지 구현마다 달라진다.",
2791:      "recommendation": "상태 전이를 닫아라: pause는 step boundary에서만 effective, cancel은 `pending/running/paused`별 결과, running step은 cooperative cancellation만 허용, cancel 후 rollback 가능/불가능 상태를 명시."
2794:      "id": "CM1-14",
2795:      "severity": "major",
2796:      "category": "retry-rollback",
2802:      "impact": "autoRollbackOnFailure=true인 경우에도 pause가 먼저인지 rollback이 먼저인지 알 수 없다. 실패 step이 partial write를 남긴 경우 대응이 늦어진다.",
2803:      "recommendation": "우선순위를 정의하라: non-compensated partial write 감지 시 rollback, retry exhausted는 기본 pause, autoRollbackOnFailure=true이면 rollback preflight 후 rollback-in-progress 전이 등."
2806:      "id": "CM1-15",
2807:      "severity": "major",
2818:      "id": "CM1-16",
2819:      "severity": "major",
2827:      "recommendation": "crm-sync의 requestFingerprint 패턴을 재사용하라. 동일 idempotencyKey+동일 fingerprint는 기존 결과 반환, fingerprint 불일치는 409 runtime fail + audit/sink alert로 닫아라."
2830:      "id": "CM1-17",
2831:      "severity": "major",
2833:      "title": "notification outbox가 `search-visibility §7.3 SQL 동일`이라고만 되어 notifications v1.0 idempotency 계약과 연결되지 않는다",
2836:        "REVIEW_WORKFLOW §9.2.1과 notifications.md §3.3은 `sourceEventId` idempotency를 요구한다."
2842:      "id": "CM1-18",
2843:      "severity": "major",
2845:      "title": "legal 승인 게이트를 ComplianceRecord lifecycle로 처리한다는 설명이 부정확하다",
2848:        "DATA_MODEL C-10 ComplianceRecord는 콘텐츠 검수 기록이며 migration plan 자체는 contentType enum 대상이 아니다."
2851:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
2854:      "id": "CM1-19",
2855:      "severity": "major",
2862:      "impact": "migration plan/report를 compliance-assistant나 REVIEW_WORKFLOW에 올리려는 순간 pageTypeId/articleType 유도 실패 또는 잘못된 룰 적용이 발생한다.",
2863:      "recommendation": "content-migration plan은 ComplianceRecord 대상이 아니라고 명시하거나, `featureContentType=\"feature:content-migration\"` 예외를 compliance-assistant와 DATA_MODEL C-10에 cascade하라."
2866:      "id": "CM1-20",
2867:      "severity": "major",
2874:      "impact": "마이그레이션 Feature인데 정작 기존 row의 상태, schema version watermark, dangling FK, rollback precondition, dry-run report retention 만료 등을 migration-time에 검증할 경로가 없다.",
2875:      "recommendation": "§8에 migration-time validation을 분리해 추가하라. 예: target selector 0건/과다, dry-run report expired, reverse-step precondition missing, stale policyVersion, row lock 불가, orphan Core row 감지."
2878:      "id": "CM1-21",
2879:      "severity": "minor",
2881:      "title": "§0 핵심 책임의 `skip`과 rollback 정책이 본문에서 충분히 정의되지 않는다",
2883:        "§0은 failure 시 rollback 또는 skip을 핵심 책임으로 둔다.",
2884:        "본문에는 skip 승인권자, skip 가능 step class, skip audit metadata가 없다."
2887:      "recommendation": "skip은 `irreversible/manual-remediation-required` step에서만 허용하고, reason, approver, affectedRows, remediationTicketRef를 필수 audit metadata로 하라."
2890:      "id": "CM1-22",
2891:      "severity": "minor",
2893:      "title": "dry-run 정확도 목표 `>95%`는 고위험 migration 기준으로 느슨하고 정의도 모호하다",
2895:        "§6은 dry-run 정확도 목표를 apply 결과와 일치 `>95%`로 둔다."
2898:      "recommendation": "정확도 지표를 `targetSetDigest match`, `changedRowCount delta`, `fieldDiff delta`, `blockedDriftCount`로 분리하고, critical/legal/PII 대상은 100% 일치 요구로 올려라."
2901:      "id": "CM1-23",
2902:      "severity": "minor",
2909:      "recommendation": "CM-06/07/08은 v1.0 blocking open issue로 격상하고, 해소 전 `ready_for_v1_0=false`를 유지하라."
2912:      "id": "CM1-24",
2913:      "severity": "minor",
2920:      "impact": "새 plan kind나 step type이 legal gate, read-only, rollback, dry-run report schema를 바꾸는 경우 MAJOR가 필요할 수 있다.",
2921:      "recommendation": "plan kind/step type 변경을 영향 기반으로 재분류하라. legal gate/read-only/rollback/dry-run output 변경은 MAJOR 또는 policyVersion 신규로 처리해야 한다."
2924:      "id": "CM1-25",
2925:      "severity": "minor",
2927:      "title": "read API가 legal-reviewer에게 모든 migration detail을 허용하지만 masking/export 정책이 없다",
2929:        "§3.1 `queryPlans`, `queryRuns`, `queryStepResults`는 operator·super-admin·legal-reviewer 모두 허용이다.",
2933:      "recommendation": "query 응답에 privacy class를 붙이고 operator/legal/super-admin별 sample diff masking, export 금지, retention을 정의하라."
2938:      "target": "docs/admin/REVIEW_WORKFLOW.md §9.1, §9.1.1",
2942:      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
2946:      "target": "docs/core/DATA_MODEL.md C-08",
2947:      "change": "`contentMigrationConfig`, `contentMigrationPolicyVersion`, `ContentMigrationConfig` 타입 추가"
2951:      "change": "`feature:content-migration` 예외가 필요한지 결정. 필요 없으면 content-migration 문서에서 plan legal approval은 ComplianceRecord 대상이 아님을 명시"
2957:    "dry-run fingerprint 및 apply CAS 강화",
2958:    "rollback class와 irreversible step 승인 모델",
2959:    "policy-version-reevaluate 대량 처리·dedupe·rate limit 설계",

 succeeded in 673ms:
9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
49:| displayHints column 추가 | MINOR | 별개 | nullable. read API output 추가 |
50:| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
53:| CrmCredentialVersion.state enum 추가 | MINOR | 별개 | invariant 표 갱신 |
54:| CrmCredentialVersion.state enum 제거·rename | **MAJOR** | policyVersion 신규 | |
68:- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT
104:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
158:      pii: { rawPiiStorageAllowed: false, displayHintsRetentionDays: 30, ssnRrnHandling: "deny", liveReadEnabled: false }
170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
212:### 3.1.1 audit log contract (7종 AuditAction)
214:| AuditAction | contentRef | metadata | 권한 |
235:  displayHints: ContactDisplayHints;
247:  displayHints: ContactDisplayHints;
265:  displayHints: ContactDisplayHints;
272:#### 3.2.1 ContactDisplayHints — closed schema 6 column
320:- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
321:- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
322:- displayHintsRetentionDays 만료: displayHints만 nulling
342:  idempotencyKey: string;                       // UNIQUE per instance
378:  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
396:  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
417:      idempotencyKey: string;                   // 중복 적용 방지
426:      idempotencyKey: string;
437:  displayHintsNulled: boolean;
457:  revertedVersionId: string;                    // CredentialVersion.state="reverted" row
460:  expectedIntegrationState: "reverted";         // CAS
548:// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
562:webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.
584:3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
590:9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
602:4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
612:10. CAS 갱신
620:5. CAS 갱신
629:   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
639:   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
649:5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
652:### 4.3 field-level 충돌 해결 + CAS
664:#### 4.3.2 CAS SQL
672:WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSolutionVersion;
677:WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expectedCrmVersion;
686:| `fieldPath` | "displayHints.phoneLast4" 등 |
716:#### 4.5.1 CrmCredentialVersion entity — § 13.11
720:**CrmIntegration.credentialState** 5상태. **CrmCredentialVersion.state** 6상태.
722:| Integration state | CredentialVersion rows | 의미 |
745:SELECT * FROM crm_integration WHERE id=$integrationId FOR UPDATE;
746:-- 2. 현재 state 확인 (stable만 허용 — CAS)
747:-- 3. 새 CredentialVersion insert (state='rotating-target')
750:UPDATE crm_integration SET credential_state='rotating' WHERE id=$integrationId AND credential_state='stable';
751:-- 5 rows affected 검증 (CAS)
755:**DB partial unique 강제** (§ 13.11):
756:- `UNIQUE(integration_id) WHERE state='active'` — active row 1개만
757:- `UNIQUE(integration_id) WHERE state='rotating-target'` — rotating-target 1개만
758:- `UNIQUE(integration_id) WHERE state='committed'` — committed 1개만
760:→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.
763:- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
768:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
769:- reverted CredentialVersion row → state="revoked"
781:WHERE state='committed' AND grace_until <= now()
786:SELECT * FROM crm_integration WHERE id=$integration_id FOR UPDATE;
788:-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
789:-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
791:WHERE id=$committed_version_id;
795:WHERE id=$integration_id AND credential_state='committed';
807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
815:  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
820:FROM next WHERE o.id=next.id RETURNING o.*;
823:UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;
826:UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;
829:UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
841:| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
842:| CrmRecord.displayHints* | nulling (option `keepDisplayHints=false` 기본) | row 유지 | false | — |
864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
865:3. `(integrationId, idempotencyKey)` lookup:
866:   - **존재 + requestFingerprint 일치** → same-request replay → 기존 ledger 결과 반환 (no-op)
867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
870:5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
872:   - piiHash: WHERE pii_hash = $piiHash
873:   - crmExternalIdHash: WHERE crm_external_id_hash = $crmExternalIdHash
874:7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
875:8. scope="marketing-only": displayHints nulling만
895:### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
921:### 7.1 closed schema + privacy-sensitive operational hints
923:- displayHints: 6 column closed schema (§ 3.2.1)
952:### 7.5 displayHints expiry + operationalHints expiry (CS4-05)
956:- displayHintsRetentionDays 만료 → displayHints 6 column nulling. ChangeLog tombstone
979:| CAS lost-update 감지율 | baseline | |
1024:- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
1028:- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
1031:#### INV-CAS
1036:#### INV-PII (closed schema)
1048:- applyConsentWithdrawal(keyType=piiHash) → matched record displayHints nulling
1050:- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
1051:- scope=marketing-only → displayHints nulling만
1053:- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
1059:- displayHints nulling·queue cancel·ledger 보존
1071:- displayHintsRetentionDays → nulling
1079:#### INV-CASCADE
1080:- 7종 AuditAction insert 성공
1081:- 4종 NotificationEventType emit 성공
1108:| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
1111:| § 10.2 displayHints closed schema 위반 | INV-PII |
1112:| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
1115:| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
1117:| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
1120:| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
1171:- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
1174:- CAS WHERE 0 rows → ConflictRecord + alert
1175:- displayHints closed schema 위반 → DB CHECK reject + validator alert
1176:- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
1177:- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
1179:- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
1181:- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)
1187:  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
1188:  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
1200:- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
1202:- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
1219:    | CrmRecord.displayHints* | nulling | × |
1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
1310:| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
1319:**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
1327:| `idempotencyKey` | string | ✅ |
1339:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
1366:| `idempotencyKey` | string | ✅ |
1377:**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
1378:**Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.
1386:  WHERE status='pending' AND next_attempt_at <= now()
1392:FROM next WHERE q.id=next.id RETURNING q.*;
1406:WHERE sync_log_id=$sl AND integration_id=$int AND entity=$ent AND direction=$dir AND attempt_number=$att;
1413:  FROM crm_sync_source_attempt WHERE sync_log_id=$sl
1415:UPDATE crm_sync_log SET envelope_state=CASE
1420:WHERE id=$sl;
1423:UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;
1427:WHERE status='processing' AND locked_at < now() - interval '10 minutes';
1431:WHERE id=$id AND attempt_number >= max_attempts;
1433:WHERE id=$id AND last_error_class='permanent';
1450:| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
1454:| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
1455:| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
1456:| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
1457:| `displayHintsCityName` | varchar(32) | optional — CHECK |
1458:| `displayHintsGenderHint` | enum | optional |
1459:| `displayHintsAgeBand` | enum | optional |
1473:**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
1475:**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.
1490:**Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`, `(tombstone) WHERE tombstone=true`.
1506:**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
1526:**Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.
1555:### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)
1574:- `UNIQUE(integrationId) WHERE state='active'` — partial unique
1575:- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
1576:- `UNIQUE(integrationId) WHERE state='committed'` — partial unique
1578:→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.
1580:**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.
1599:- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliveryKind='exactly-once'`
1600:- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT NULL AND deliveryKind='at-least-once'`
1601:- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL OR deliveryKind='best-effort'`
1603:**Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.
1633:| `idempotencyKey` | string | ✅ |
1634:| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
1637:| `displayHintsNulled` | boolean | ✅ |
1648:- `UNIQUE(integration_id, pii_hash, scope) WHERE pii_hash IS NOT NULL`
1649:- `UNIQUE(integration_id, crm_external_id_hash, scope) WHERE crm_external_id_hash IS NOT NULL`
1653:**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.
1662:| `eventType` | enum (NotificationEventType 4종) | ✅ |
1673:**Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.
1681:| 13.1 | CrmIntegration | partial unique active+integrationKey |
1682:| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
1684:| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
1685:| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
1691:| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
1692:| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |

codex
대상 문서의 v0.2는 1차 지적을 상당수 문구로는 반영했지만, 지금 보이는 핵심 위험은 “풀 스키마와 알고리즘이 아직 비어 있는 상태에서 v1.0 운영 계약처럼 말하는 부분”입니다. REVIEW_WORKFLOW/DATA_MODEL 실제 cascade와 참조 Feature의 강제 패턴까지 확인한 뒤 JSON으로 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-migration|ContentMigration|NotificationEventType|AuditAction|contentMigrationConfig|contentMigrationPolicyVersion|legalImpactClassifierRef|ContentMigrationConfig|stale-flags-only|new-record-version|cacheKey|durable cache|batch contract|closed schema" docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/features/compliance-assistant.md docs/features/search-visibility.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/features/content-migration.md | Select-Object -Skip 100 -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/features/content-migration.md | Select-Object -Skip 360 -First 240' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/features/content-migration.md | Select-Object -Skip 600 -First 120' in C:\Users\assag\solution\website-exposure
 succeeded in 613ms:
docs/features/search-visibility.md:107:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
docs/features/search-visibility.md:428:### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)
docs/features/search-visibility.md:574:| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |
docs/features/search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.20 → v0.21 — `features/content-migration.md` 1차 사이클 cascade: C-08 `contentMigrationConfig`(ContentMigrationConfig 신설 — legalApproved·approvalRequired·legalImpactClassifierRef) + `contentMigrationPolicyVersion` — CM1-03)
docs/core/DATA_MODEL.md:598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
docs/core/DATA_MODEL.md:599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
docs/core/DATA_MODEL.md:722:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
docs/core/DATA_MODEL.md:726:| `legalApproved` | boolean | ✅ | content-migration Feature 자체 legal 승인 (CM1-08 — Feature 활성화 단계 게이트) |
docs/core/DATA_MODEL.md:729:| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
docs/core/DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | (CM1-08) legalImpactClassifier 구현 모듈 ref — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy 영향 plan 자동 분류 |
docs/core/DATA_MODEL.md:732:> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
docs/core/DATA_MODEL.md:1097:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/features/compliance-assistant.md:169:- 호출자가 룰 카탈로그·slot 변경 후 stale 위험을 회피하려면 — `inferredRiskLevel` 미전달하여 내부 재계산 강제 또는 cacheKey 변경으로 자연 재계산
docs/features/compliance-assistant.md:430:cacheKey = hash(
docs/features/compliance-assistant.md:435:  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
docs/features/compliance-assistant.md:454:| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
docs/features/compliance-assistant.md:458:- **TTL 만료**: 운영 TTL 캐시만 만료. 영속 결과 캐시는 cacheKey 입력 중 하나가 변경되어야 무효화 (예: 룰 카탈로그 갱신)
docs/features/compliance-assistant.md:462:- 동일 cacheKey → 영속 결과 캐시로 항상 동일 결과
docs/features/compliance-assistant.md:479:- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출
docs/features/compliance-assistant.md:608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
docs/features/compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
docs/features/compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs/features/compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
docs/admin/REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs/admin/REVIEW_WORKFLOW.md:510:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:511:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:512:  | "content-migration-rollback-triggered";
docs/admin/REVIEW_WORKFLOW.md:556:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:557:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:558:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:559:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:578:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:595:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:644:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:652:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:655:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:687:  // `features/content-migration.md` 1차 cycle cascade (CM1-02·10)
docs/admin/REVIEW_WORKFLOW.md:688:  | "content-migration-plan-defined"          // plan 정의
docs/admin/REVIEW_WORKFLOW.md:689:  | "content-migration-plan-validated"        // plan 검증 (CM1-10)
docs/admin/REVIEW_WORKFLOW.md:690:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs/admin/REVIEW_WORKFLOW.md:691:  | "content-migration-run-started"           // apply 실행 시작
docs/admin/REVIEW_WORKFLOW.md:692:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:693:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:694:  | "content-migration-run-cancelled"
docs/admin/REVIEW_WORKFLOW.md:695:  | "content-migration-rollback-applied"
docs/admin/REVIEW_WORKFLOW.md:696:  | "content-migration-step-skipped";         // irreversible step skip (CM1-21)

 succeeded in 677ms:
 succeeded in 737ms:
| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.21 | `contentMigrationConfig`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3 | `policy-version-reevaluate` batch contract 호출 |
| asset-ingestion | promote handoff |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.21
  legalApproved: true
  legalApprovedBy: "legal@glitzy.kr"
  legalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"                                # dry-run | apply
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"            # CM1-08 — 분류기 버전

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.2.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:                                  # CM1-09 — write class별 정책
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-operational"]
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational"]
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"                   # CM1-14 — pause | rollback-then-pause | rollback
      dryRun:
        reportRetentionDays: 30
        impactSamplingSize: 100
      policyVersionReevaluate:                          # CM1-04 — compliance-assistant batch
        concurrencyLimit: 10                            # 동시 check() 호출
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true                        # cacheKey 중복 skip
        reportingMode: "stale-flags-only"               # stale-flags-only | new-record-version
      retentionDays:
        plan: 1095
        run: 730
        step: 730
        dryRunReport: 30
        legalApproval: 2555                             # 7년 audit
        rollbackLog: 1095
        readOnlyWindow: 730
        stepRetryQueueCompleted: 30
        notificationOutbox: 30
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:                                       # CM1-16 — requestFingerprint·planFingerprint·targetSetDigest
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command

| 종류 | 함수 | 책임 | 권한 |
|---|---|---|---|
| 실행 | `definePlan(input): DefinePlanResult` | plan 정의 | super-admin |
| 실행 | `validatePlan(planId): ValidatePlanResult` | step 정합·rollbackClass·legalImpactClassifier 분류 | super-admin |
| 실행 | `runDryRun(planId): RunDryRunResult` | dry-run + 영향 보고 (DryRunReport 저장) | super-admin |
| 실행 | `approvePlanLegalGate(input): ApprovePlanLegalGateResult` | legal-reviewer 게이트 (legalImpactClassifier 분류 따라) | legal-reviewer |
| 실행 | `runApply(input): RunApplyResult` | apply (6필드 CAS 통과 시) | super-admin |
| 실행 | `pauseRun(input)` | step boundary 일시 정지 (CM1-13) | super-admin |
| 실행 | `resumeRun(input)` | 재개 | super-admin |
| 실행 | `cancelRun(input)` | 진행 중 취소 (cooperative cancellation) | super-admin |
| 실행 | `rollbackRun(input)` | scope: full / from-step (rollbackClass 검사) | super-admin |
| 실행 | `skipStep(input)` | rollbackClass=irreversible 또는 manual-remediation에 한정 (CM1-21) | super-admin + 사유 + remediationTicketRef |
| read | `queryPlans` (CM1-25 — privacy class 응답) | plan 목록·detail | operator·super-admin·legal-reviewer |
| read | `queryRuns` (privacy class) | run 진행·결과 | 동일 |
| read | `queryStepResults` (privacy class·masking) | step input/output/diff (PII masking 권한별 — CM1-25) | 동일 |

### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)

| AuditAction | contentRef | metadata |
|---|---|---|
| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·idempotencyKey·planFingerprint |
| `content-migration-plan-validated` (CM1-10) | `"cm-plan:" + planId` | rollbackClassSummary·legalImpactClassification·warningsCount |
| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·classificationSnapshot·planFingerprint |
| `content-migration-run-started` | `"cm-run:" + runId` | mode·planId·expectedDryRunReportId·planFingerprint |
| `content-migration-run-completed` | `"cm-run:" + runId` | result·changedRecords·failedSteps·rollbackTriggered |
| `content-migration-run-failed` | `"cm-run:" + runId` | failedStepKey·errorClass·partialWriteDetected |
| `content-migration-run-cancelled` | `"cm-run:" + runId` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-applied` | `"cm-run:" + runId` | scope·rolledBackSteps·skippedIrreversibleSteps·result |
| `content-migration-step-skipped` (CM1-21) | `"cm-step:" + stepResultId` | reason·approver·rollbackClass·affectedRows·remediationTicketRef |

### 3.2 plan kind 정의 (v1.0 — 6종, CM1-05·11)

#### 3.2.1 `application-data-version-upgrade`
DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. DDL (column add/rename)은 인프라 책임 — 본 plan kind는 column 존재·nullable·default를 read-only로 검증하고 데이터만 채움.

#### 3.2.2 `feature-activation-backfill`
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환.

#### 3.2.3 `instance-to-instance-copy`
분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제.

#### 3.2.4 `content-bulk-transform`
design token 변경·brand 변경 시 콘텐츠 일괄 재생성.

#### 3.2.5 `policy-version-reevaluate` (CM1-04 batch contract)

CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 대응:

```
1. targetSelector로 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit는 skip
3. concurrencyLimit (config) 만큼 동시 check() 호출
4. rateLimitPerSecond 적용 (token bucket)
5. reportingMode 분기:
   - "stale-flags-only": 결과 차이 시 ComplianceRecord.staleFlags 갱신만 — recordVersion 미증가
   - "new-record-version": 결과 차이 시 새 ComplianceRecord 생성 (recordVersion +1) → REVIEW_WORKFLOW § 8 새 lifecycle 진입
6. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

#### 3.2.6 `routing-slug-preservation` (CM1-11 신설)
asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계.

### 3.3 DTO (CM1-07·16 강화)

```ts
type MigrationPlanKind =
  | "application-data-version-upgrade"
  | "feature-activation-backfill"
  | "instance-to-instance-copy"
  | "content-bulk-transform"
  | "policy-version-reevaluate"
  | "routing-slug-preservation";

type RollbackClass = "reversible" | "compensating" | "irreversible";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string;
  description: string;
  targetSelector: TargetSelector;
  steps: MigrationStep[];
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;                                       // plan 내 unique
  stepType: string;                                      // registry 등록 타입
  inputs: Record<string, any>;
  rollbackClass: RollbackClass;                          // CM1-06 — 강제
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // rollbackClass=irreversible 필수 (max affected rows)
  backupSnapshotRequired?: boolean;                     // rollbackClass=irreversible 필수 true 권장
  retryable: boolean;
};

type DefinePlanResult = {
  planId: string;
  planFingerprint: string;                              // HMAC(planFingerprintPepperRef, canonical(plan)). char(64)
  legalImpactClassification: LegalImpactClassification; // CM1-08
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: Array<"pii" | "legal-document" | "review-policy" | "pricing-page"
              | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy">;
  classifierVersion: string;                            // contentMigrationConfig.legalImpactClassifierRef
};

type RunApplyInput = {
  planId: string;
  expectedDryRunReportId: string;
  expectedPlanFingerprint: string;                      // CAS — CM1-07
  expectedTargetSetDigest: string;                      // CAS
  expectedSourceSnapshotWatermark: string;              // CAS
  expectedPolicyVersionSnapshot: string;                // CAS
  expectedStepRegistryVersion: string;                  // CAS
  expectedContentHashDigest: string;                    // CAS
  forceProceedDespiteWarnings?: boolean;
  idempotencyKey: string;
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: "completed" | "failed" | "cancelled" | "paused";  // CAS
};

type SkipStepInput = {
  stepResultId: string;
  rollbackClass: "irreversible" | "manual-remediation-required";    // CM1-21
  reason: string;
  approver: string;
  remediationTicketRef: string;                         // 외부 추적 ticket 필수
  affectedRowsConfirmation: number;
};
```

### 3.4 idempotencyKey + requestFingerprint (CM1-16 — crm-sync 패턴 재사용)

| command | idempotencyKey + requestFingerprint 산정 |
|---|---|
| `definePlan` | requestFingerprint = HMAC(idempotencyPepperRef, planKind + ":" + planCanonicalJson). same-request replay → 기존 planId 반환. mismatched collision → 409 |
| `runApply` | requestFingerprint = HMAC(idempotencyPepperRef, planId + ":" + expectedDryRunReportId + ":" + planFingerprint). 동일 처리 |
| `applyConsentWithdrawal` 등 동일 패턴 |

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan(input) — ContentMigrationPlan row insert (status=draft)
   - planFingerprint 산정 (§ 3.3)
2. validatePlan(planId) — registry 등록 step type 확인·rollbackClass별 reverse/compensating step·blastRadius·legalImpactClassifier 분류
   - audit content-migration-plan-validated
3. runDryRun(planId) — sampling + 영향 보고. DryRunReport 저장:
   - planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest 6필드 (CM1-07)
4. legalGateRequired=true 시 approvePlanLegalGate(input) — legal-reviewer 승인. ContentMigrationLegalApproval insert
   - 알림 content-migration-plan-legal-approved emit
5. runApply(input) — 6필드 CAS 검증 → ContentMigrationRun insert (status=pending → running)
   - read-only window 적용 (config — write class 표 § 4.5)
   - step 순차 실행 — 각 ContentMigrationStepResult insert
   - 알림 content-migration-run-started/completed emit
```

### 4.2 rollback (CM1-06 rollbackClass 강제)

```
rollbackRun(input):
1. expectedStatus CAS (completed·failed·cancelled·paused)
2. scope=full 또는 from-step:
   - 완료된 step들을 역순으로 reverse-step 실행
3. step별 rollbackClass 분기:
   - reversible: reverseStep 실행
   - compensating: compensatingStep 실행
   - irreversible: skipStep 자동 호출 (운영자 승인 필요 — runtime fail 후 운영자 수동 호출 권장)
4. rollback 자체 실패 → ContentMigrationRollbackLog 기록·super-admin alert·status=rollback-in-progress 유지
5. 완료 → status=rolled-back. audit content-migration-rollback-applied

 succeeded in 726ms:
```

### 4.3 pause / resume / cancel (CM1-13 state transition)

| 호출 | 현재 status | 동작 |
|---|---|---|
| pauseRun | running | 진행 중 step은 cooperative cancellation point까지 완료 → step boundary에서 pause. status=paused |
| pauseRun | pending·paused·완료 상태 | runtime fail |
| resumeRun | paused | status=running. 다음 step부터 진행 |
| cancelRun | pending | status=cancelled. step 미진행 |
| cancelRun | running | 진행 중 step cooperative cancellation 요청 → step 종료 후 status=cancelled. partial commit 검사: non-compensated partial write 발견 시 자동 rollback 요구 (autoRollbackOnFailure 무시 — 안전 우선) |
| cancelRun | paused | status=cancelled. partial commit 검사 동일 |
| cancelRun | 완료·rolled-back | runtime fail |

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM1-14)

| 조건 | 동작 |
|---|---|
| step retry exhausted + **partial write 감지** | **rollback 우선** (autoRollbackOnFailure 무시) → status=rollback-in-progress |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` (config 기본) | status=paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rollback 실행 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rollback 완료 후 status=rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` (config) | rollback 우선 |

### 4.5 read-only window — write class별 차단 표 (CM1-09)

| writeClass | 정의 | 기본 정책 (read-only window 중) |
|---|---|---|
| `content-mutating` | DATA_MODEL Core 콘텐츠 row 변경 | **차단** |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 (검수 큐·SLA) | **큐잉** (window 종료 후 일괄 처리) |
| `feature-operational` | asset promote·crm conflict resolve·search-visibility detect 등 Feature 기능 write | **차단** |
| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
| `audit-append` | append-only audit log | **허용** |

`config.execution.readOnlyWindow.allowedWriteClasses`로 허용 목록 명시. plan 작성 시 추가 예외 가능 (validatePlan에서 검증).

### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개

```sql
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE o.id=next.id RETURNING o.*;
```

### 4.7 NotificationEvent 매핑 (CM1-17)

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback")` |

---

## 5. 알림

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

---

## 6. 운영 지표 (CM1-22 정확도 분리)

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| dry-run **targetSetDigest match** | dry-run 시점 target set vs apply 시점 일치율 | **100%** (불일치 시 CAS fail) |
| dry-run **changedRowCount delta** | dry-run 예측 vs 실제 변경 row count 차이 | < 1% |
| dry-run **fieldDiff delta** | sample diff vs 실제 diff 차이 | < 5% |
| dry-run **blockedDriftCount** | drift로 인한 apply 차단 횟수 | baseline |
| dry-run critical/legal/PII 대상 정확도 | 100% match 요구 | 100% |
| rollback 성공율 | rollback 호출 시 | > 99% |
| skip 발생율 | irreversible step skip / 전체 step | baseline (운영 review) |
| step 평균 시간 | baseline | |
| read-only window 평균 길이 | baseline | |
| policy-version-reevaluate cache hit rate | (CM1-04) | > 80% |

---

## 7. compliance-assistant 예외 (CM1-19)

ContentMigrationPlan·DryRunReport 자체는 compliance-assistant `check()` 대상 **아님**. plan kind 정의가 의료광고 콘텐츠가 아니므로 ComplianceRecord lifecycle 미진입.

단, `policy-version-reevaluate` 실행 결과로 **개별 콘텐츠 ComplianceRecord 재생성**이 발생할 수 있음 — 그 경우 새 ComplianceRecord가 REVIEW_WORKFLOW § 8 lifecycle (new) 진입.

compliance-assistant `contentType` 예외 cascade 불필요 (plan은 콘텐츠 아님).

---

## 8. 설치·설정 — DB 10 tables 마이그레이션 (§ 9)

---

## 9. 빌드·런타임·migration·invariant 검증 (CM1-20 분리)

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- `legalApproved !== true` 또는 승인자/시각 누락
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef` 누락
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `hashSecrets.planFingerprintPepperRef`·`idempotencyPepperRef` 누락
- `retentionDays.*` 9종 중 누락

### 9.2 runtime fail

- `runApply` 6필드 CAS 중 하나라도 불일치 (planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest)
- `runApply` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 runId 반환 (fail 아님)
- `runApply` idempotencyKey **mismatched collision** → **409 idempotency-key-conflict** runtime fail
- legal 게이트 필요 plan + approvePlanLegalGate 미수행 → runtime fail
- step 실행 timeout (config) 초과 → step status=failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback scope=from-step + step이 irreversible + skipStep 사전 호출 없음 → runtime fail
- pauseRun/cancelRun § 4.3 표 비허용 status → runtime fail
- read-only window 중 차단 writeClass 시도 → write rejected + sink alert
- policy-version-reevaluate concurrencyLimit 초과 시도 → 대기 큐

### 9.3 migration-time validation (CM1-20 신규)

- targetSelector 0건 → warning (확인 후 진행)
- targetSelector 임계 초과 (config로 cap) → warning 또는 fail
- dry-run report expiresAt 만료 후 apply 시도 → CAS fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + blastRadiusCap 누락 또는 backupSnapshotRequired=false → validate fail
- stale policyVersionSnapshot (dry-run 시점과 apply 시점 다름) → CAS fail
- targetSelector row lock 불가 (다른 run 진행 중) → runtime fail
- orphan Core row 감지 (FK 무결성 위반 candidate) → warning + 운영자 검토

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4 표 따라
- read-only window 진행 중 다른 admin write 시도 → 차단 + alert
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport `expiresAt` 도래 (retentionDays.dryRunReport) → purge worker
- **purge worker (legalHold > retention precedence)**:
  - ContentMigrationLegalApproval → 7년 audit retention
  - ContentMigrationPlan(legalApproved 포함) → legal hold true
  - ContentMigrationDryRunReport → expiresAt 시 delete
  - ContentMigrationRun (status=완료) → retentionDays.run
  - ContentMigrationStepResult → retentionDays.step
  - ContentMigrationStepRetryQueue (status=completed) → retentionDays.stepRetryQueueCompleted
  - ContentMigrationRollbackLog → retentionDays.rollbackLog
  - ContentMigrationReadOnlyWindow → retentionDays.readOnlyWindow
  - ContentMigrationNotificationOutbox (sent·permanent) → retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible step 비율 > 10%
- dry-run impactSamplingSize 부족 (전체 대비 < 5%)

---

## 10. 미결정 사항 (CM1-23 — CM-06/07/08 v1.0 blocking으로 격상)

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 | 비고 |
|---|---|---|
| CM-01 | 외부 cluster 간 cross-region copy | v1.x |
| CM-02 | partial cutover (일부 row만) | v1.x |
| CM-03 | dry-run sampling stratified 알고리즘 | v1.x — v1.0은 random sampling |
| CM-04 | read-only window 중 운영자 우회 권한 | v1.x — v1.0은 우회 불가 |
| CM-05 | rollback 부분 적용 안전성 (multi-step partial rollback) | v1.x |

### 10.2 resolved-in-v1.0 (CM1-23)

| ID | 항목 | 해소 |
|---|---|---|
| ~~CM-06~~ | policy-version-reevaluate 부하 관리 | § 3.2.5 batch contract (concurrencyLimit·rateLimit·cacheDedupe·reportingMode) 명시 |
| ~~CM-07~~ | instance-to-instance-copy PII 마스킹 | legalImpactClassifier가 PII class 자동 분류 → legal-reviewer 승인 강제. masking은 step type registry가 정의 |
| ~~CM-08~~ | DB DDL vs application data migration 경계 | § 1.3 handoff boundary 표 — DDL은 인프라 책임·본 Feature는 데이터 backfill |

### 10.3 v0.2 잔여 리스크

| 영역 | 상태 |
|---|---|
| step type registry 본 문서 vs 별도 도큐먼트 | open — v1.0은 본 문서 § 3.2 plan kind 단위·구체 step type은 구현체 등록 |
| compliance-assistant § 8 cache TTL과 reevaluate window 정합 | known — § 3.2.5 cacheDedupe 통과 |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |

---

## 12. DB 인벤토리 (10 tables — § 9 풀 schema는 v0.3 cycle에서 전개)

| § | 테이블 | 핵심 |
|---|---|---|
| 12.1 | `ContentMigrationPlan` | planFingerprint·status·legalImpactClassification |
| 12.2 | `ContentMigrationDryRunReport` | 6필드 (CM1-07) |
| 12.3 | `ContentMigrationLegalApproval` | legalApprovedBy·classificationSnapshot |
| 12.4 | `ContentMigrationRun` | status·CAS·runId |
| 12.5 | `ContentMigrationStepResult` | step별 input/output/rollbackClass·partial write 추적 |
| 12.6 | `ContentMigrationStepRetryQueue` | search-visibility § 13.5 worker SQL |
| 12.7 | `ContentMigrationRollbackLog` | scope·rolledBackSteps·skippedIrreversibleSteps |
| 12.8 | `ContentMigrationReadOnlyWindow` | window 적용·write class 차단 추적 |
| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
| 12.10 | `ContentMigrationNotificationOutbox` | search-visibility § 13.10 패턴 |

codex
{
  "review_id": "content-migration-v0.2-cycle2",
  "target": "docs/features/content-migration.md",
  "prefix": "CM2-",
  "summary": {
    "blocking": 7,
    "major": 11,
    "minor": 5,
    "overall_assessment": "v0.2는 1차 지적 대부분을 표면적으로는 반영했지만, 운영 가능한 v1.0 후보로 보기에는 핵심 알고리즘·DB 제약·legal gate 강제력·partial write 감지 계약이 아직 닫혀 있지 않다. 특히 dry-run/apply 6필드 CAS, irreversible rollback/skip, legalImpactClassifier, policy-version-reevaluate batch contract는 이름은 추가됐지만 구현 불변식이 부족하다."
  },
  "cycle1_recheck": {
    "fully_corrected": [
      "CM1-01",
      "CM1-02",
      "CM1-03",
      "CM1-05",
      "CM1-10",
      "CM1-11",
      "CM1-12",
      "CM1-18",
      "CM1-19",
      "CM1-20",
      "CM1-24"
    ],
    "partially_corrected": [
      "CM1-04",
      "CM1-06",
      "CM1-07",
      "CM1-08",
      "CM1-09",
      "CM1-13",
      "CM1-14",
      "CM1-15",
      "CM1-16",
      "CM1-17",
      "CM1-21",
      "CM1-22",
      "CM1-23",
      "CM1-25"
    ],
    "regression_or_unresolved_core": [
      "CM1-15: DB 10 tables는 인벤토리만 있고 unique/CAS/partial unique가 없어 v1.0 검증 불가",
      "CM1-07: 6필드 CAS 이름은 생겼지만 targetSetDigest/contentHashDigest 산정 알고리즘과 비용 모델 없음",
      "CM1-06/CM1-21: irreversible rollback에서 자동 skip과 운영자 승인 요구가 충돌",
      "CM1-08: legalImpactClassifier class는 생겼지만 false negative·version mismatch·override 정책 없음"
    ],
    "note": "요청은 24개라고 했지만 참고 파일의 1차 결과에는 CM1-25까지 존재한다. v0.2 변경 이력도 CM1-25를 언급하므로 함께 재검증했다."
  },
  "findings": [
    {
      "id": "CM2-01",
      "severity": "blocking",
      "category": "dry-run-cas",
      "title": "6필드 CAS가 이름만 있고 digest 산정 알고리즘이 없다",
      "evidence": [
        "§3.3 RunApplyInput은 expectedTargetSetDigest·expectedContentHashDigest를 요구한다.",
        "§4.1은 DryRunReport에 6필드를 저장한다고만 한다.",
        "§6은 targetSetDigest match 100%를 목표로 둔다."
      ],
      "impact": "동일 target set을 어떤 정렬·canonical row projection·null/date/json normalization·tenant scoping으로 digest할지 없으면 dry-run/apply drift 차단이 구현마다 달라진다. 대량 row에서 contentHashDigest 전체 재계산이 apply 직전 병목이 되거나, 반대로 sampling hash로 구현되어 drift를 놓칠 수 있다.",
      "recommendation": "targetSetDigest = stable ordered target primary keys + selector version + tenant/instance scope의 Merkle 또는 chunked digest로 정의하라. contentHashDigest는 step별 read-set field projection, canonical JSON, chunk size, incremental watermark, max rows before snapshot requirement를 명시하라. dry-run과 apply preflight에서 동일 함수를 재사용하고 비용 상한·fallback snapshot 정책을 둬라."
    },
    {
      "id": "CM2-02",
      "severity": "blocking",
      "category": "rollback",
      "title": "irreversible step rollback에서 `skipStep 자동 호출`과 운영자 승인 요구가 모순된다",
      "evidence": [
        "§4.2 step별 rollbackClass 분기: irreversible은 `skipStep 자동 호출`이라고 되어 있다.",
        "같은 줄에 `운영자 승인 필요 — runtime fail 후 운영자 수동 호출 권장`이라고 되어 있다.",
        "§3.1 skipStep은 super-admin + 사유 + remediationTicketRef를 요구한다."
      ],
      "impact": "rollback 중 irreversible step을 자동 skip하면 실제 복구 불가능한 변경을 운영자 확인 없이 정상 rollback으로 오인할 수 있다. 반대로 자동 호출이 실패한다면 rollback state machine이 어디서 멈추는지 불명확하다.",
      "recommendation": "자동 skip을 금지하라. irreversible encountered 시 rollback은 `blocked-manual-remediation-required` 상태로 전이하고, skipStep은 별도 super-admin 명시 승인 + affectedRowsConfirmation + remediationTicketRef 후에만 진행되게 하라. rollback-applied audit에는 skippedIrreversibleSteps가 있으면 result를 partial로 강제하라."
    },
    {
      "id": "CM2-03",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "legalImpactClassifier가 rule/LLM/false-negative 정책 없이 legal gate SoT가 됐다",
      "evidence": [
        "§2.3은 legalImpactClassifierRef만 둔다.",
        "§3.3은 8개 class와 classifierVersion만 정의한다.",
        "§9.2는 legal gate 필요 plan + 미승인만 fail로 둔다."
      ],
      "impact": "분류기가 누락하면 LegalDocument, PricingPage, 후기, priorReviewRequired 변경이 legal-reviewer 없이 apply될 수 있다. 의료광고·PII 영역에서 false negative가 곧 게이트 우회다.",
      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
    },
    {
      "id": "CM2-04",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "`forceProceedDespiteWarnings`가 legal gate 우회 가능성을 남긴다",
      "evidence": [
        "§3.3 RunApplyInput에 forceProceedDespiteWarnings가 있다.",
        "§9.3 targetSelector 0건/초과/orphan Core row는 warning으로 둔다.",
        "legalImpactClassification과 classifierVersion은 RunApplyInput CAS 대상이 아니다."
      ],
      "impact": "경고와 legal-required 상태의 경계가 닫혀 있지 않아 운영자가 forceProceedDespiteWarnings로 법무 영향 warning을 밀고 갈 수 있다. apply 시점 classifierVersion이 바뀌어도 dry-run 당시 legal classification을 재검증할 CAS가 없다.",
      "recommendation": "forceProceedDespiteWarnings가 legalGateRequired, classifierVersion mismatch, legal class unknown, irreversible precondition warning에는 적용되지 않는다고 명시하라. RunApplyInput에 expectedLegalImpactClassificationDigest와 expectedClassifierVersion을 추가하고 mismatch 시 dry-run 재수행을 강제하라."
    },
    {
      "id": "CM2-05",
      "severity": "blocking",
      "category": "db-schema",
      "title": "DB 10 tables가 인벤토리뿐이라 핵심 unique·CAS·partial unique를 검증할 수 없다",
      "evidence": [
        "§12는 10개 테이블 이름과 핵심 필드만 나열한다.",
        "§8은 DB 10 tables 마이그레이션이라고 하지만 실제 schema가 없다.",
        "§12 제목은 풀 schema를 v0.3으로 미룬다."
      ],
      "impact": "ContentMigrationPlan idempotency unique, DryRunReport 6필드 보존, Run status CAS, StepResult unique(plan/run/stepKey), LegalApproval 최신 승인 partial unique, RetryQueue 진행 중 unique, NotificationOutbox sourceEventId unique가 없으면 명세의 안전장치가 DB에서 강제되지 않는다.",
      "recommendation": "v0.2라도 최소 constraints 표를 추가하라. 예: UNIQUE(instanceId,idempotencyKey), UNIQUE(runId,stepKey), UNIQUE(planId) WHERE approvalStatus='active', CAS columns(status/version), outbox UNIQUE(sourceEventId), retry queue UNIQUE(stepResultId) WHERE status IN ('pending','processing'). v1.0 후보 전에는 풀 SQL을 전개하라."
    },
    {
      "id": "CM2-06",
      "severity": "blocking",
      "category": "partial-write",
      "title": "partial write 감지에 의존하지만 감지 알고리즘이 없다",
      "evidence": [
        "§4.3 cancelRun은 partial commit 검사를 요구한다.",
        "§4.4 retry exhausted는 partial write 감지 여부로 rollback 우선순위를 결정한다.",
        "§12.5는 partial write 추적이라고만 한다."
      ],
      "impact": "step 실패 후 어떤 row가 일부 반영됐는지 모르면 rollback 우선 정책은 실행 불가능하다. row count만 보면 field-level partial mutation을 놓치고, checksum만 보면 compensating write 여부를 판단하지 못한다.",
      "recommendation": "step contract에 writeSetManifest를 강제하라. 각 step은 expectedAffectedRows, beforeDigest, afterDigest, committedRowIds/chunkIds, transactionBoundary, compensationStatus를 StepResult에 기록해야 한다. 감지는 row count + write-set digest + per-step invariant query로 정의하라."
    },
    {
      "id": "CM2-07",
      "severity": "blocking",
      "category": "state-machine",
      "title": "pause/cancel이 cooperative cancellation 미지원 step에서 닫히지 않는다",
      "evidence": [
        "§4.3은 running step이 cooperative cancellation point까지 완료된다고 가정한다.",
        "§9.2는 step timeout 초과 시 failed-transient라고만 한다.",
        "step type registry 계약은 §10.3에서 open으로 남아 있다."
      ],
      "impact": "장시간 DB batch나 외부 check() 호출 step이 cancellation point를 구현하지 않으면 pause/cancel 요청이 timeout까지 대기하거나 partial commit 상태를 남긴다. 그 동안 read-only window와 lock 보유 정책도 불명확하다.",
      "recommendation": "step registry에 supportsCooperativeCancellation, cancellationCheckInterval, maxUninterruptibleSeconds, transactionBoundary를 필수화하라. 미지원 step은 validate fail 또는 isolated chunk execution만 허용하라. cancel timeout 후 상태를 `cancellation-timeout-manual-review`로 닫아라."
    },
    {
      "id": "CM2-08",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "`reportingMode=stale-flags-only`와 `new-record-version` 선택 기준이 없다",
      "evidence": [
        "§2.3 기본 reportingMode는 stale-flags-only다.",
        "§3.2.5는 staleFlags 갱신 또는 새 ComplianceRecord 생성만 설명한다.",
        "§7은 new-record-version일 때 REVIEW_WORKFLOW lifecycle 진입을 말한다."
      ],
      "impact": "법무 정책 변경, priorReviewRequired 변화, LegalDocument 영향 같은 고위험 변경도 기본값 때문에 stale flag만 찍고 검수 lifecycle에 들어가지 않을 수 있다.",
      "recommendation": "default를 risk-based로 바꿔라. LegalDocument, ReviewPolicy, PricingPage, priorReviewRequired 변화, High/Critical risk 상승은 new-record-version 강제. 단순 low-risk wording stale만 stale-flags-only 허용. 운영 기본값도 문서에 명시하라."
    },
    {
      "id": "CM2-09",
      "severity": "major",
      "category": "compliance-cache",
      "title": "durable cache hit를 `skip`한다고 해서 policy 재평가가 안전해지는 것은 아니다",
      "evidence": [
        "§3.2.5 step 2는 compliance-assistant cacheKey durable cache hit는 skip이라고 한다.",
        "compliance-assistant는 cacheKey에 ruleCatalogVersion/ruleFileHashes 등 입력을 포함해 cacheKey 변경 시 자연 miss를 유도한다."
      ],
      "impact": "skip이 batch result 미기록인지 check() 호출 생략 후 기존 result 연결인지 불명확하다. 재평가 batch에서 cache hit도 대상 row별 outcome으로 남기지 않으면 감사·진행률·stale 해소 판단이 깨진다.",
      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
    },
    {
      "id": "CM2-10",
      "severity": "major",
      "category": "read-only-window",
      "title": "`notification-operational` 허용 범위가 너무 넓다",
      "evidence": [
        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
        "§5.1 run-completed는 normal inApp이다."
      ],
      "impact": "read-only window 중 digest 처리나 read receipt 같은 사용자 행위성 write까지 허용하면 window의 write 차단 의미가 흐려진다. 반대로 content-migration-run-completed 같은 운영 알림은 즉시 전달되어야 하는지 digest 가능인지도 명확하지 않다.",
      "recommendation": "notification-operational을 emit-outbox, dispatch, read-receipt, digest-state로 세분화하라. read-only window 중에는 migration safety 알림 emit/dispatch만 허용하고 read receipt/digest mutation은 큐잉하거나 별도 operational DB로 분리하라."
    },
    {
      "id": "CM2-11",
      "severity": "major",
      "category": "snapshot-cas",
      "title": "sourceSnapshotWatermark와 policyVersionSnapshot의 정의가 없다",
      "evidence": [
        "§4.1과 §9.2는 sourceSnapshotWatermark·policyVersionSnapshot 불일치 시 CAS fail을 요구한다.",
        "§3.3은 필드명만 둔다."
      ],
      "impact": "source instance copy, asset-ingestion handoff, compliance policy 재평가에서 무엇을 watermark로 볼지 구현마다 달라진다. updatedAt max는 삭제·복구·동시 insert를 놓칠 수 있고, policyVersion 문자열만으로는 rule file hash 변경을 놓칠 수 있다.",
      "recommendation": "sourceSnapshotWatermark는 source table별 high-watermark + deletion ledger/version vector로 정의하라. policyVersionSnapshot은 DATA_MODEL/contentMigrationPolicyVersion/compliance ruleCatalogVersion/ruleFileHashes/review workflow version을 포함한 canonical digest로 정의하라."
    },
    {
      "id": "CM2-12",
      "severity": "major",
      "category": "audit-notification",
      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
      "evidence": [
        "§3.1에는 validatePlan, runDryRun, pauseRun, resumeRun, cancelRun, rollbackRun, skipStep 등이 있다.",
        "§3.1.1 audit에는 dry-run completed, pause/resume requested/applied, rollback-triggered가 없다.",
        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
      ],
      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
    },
    {
      "id": "CM2-13",
      "severity": "major",
      "category": "idempotency",
      "title": "crm-sync idempotency 패턴 재사용이 content-migration scope에 맞게 닫히지 않았다",
      "evidence": [
        "§3.4 definePlan/runApply requestFingerprint를 정의한다.",
        "같은 표에 `applyConsentWithdrawal 등 동일 패턴`이라는 crm-sync 잔재가 있다.",
        "§12에는 idempotency unique scope가 없다."
      ],
      "impact": "idempotencyKey가 instance-scoped인지 plan-scoped인지 user-scoped인지 불명확하다. runApply fingerprint가 expectedTargetSetDigest 등 6필드를 포함하지 않아 동일 dryRunReportId 안의 CAS 입력 차이를 식별하지 못할 수 있다.",
      "recommendation": "crm-sync 잔재 문구를 제거하고 command별 UNIQUE scope를 DB constraints에 반영하라. runApply requestFingerprint에는 expectedDryRunReportId와 6필드 CAS 값을 모두 포함하라."
    },
    {
      "id": "CM2-14",
      "severity": "major",
      "category": "asset-ingestion-consistency",
      "title": "asset-ingestion의 body materialized view/forensic 패턴을 migration step 계약에 반영하지 않았다",
      "evidence": [
        "§1.3은 asset-ingestion promote 이후 Core row 정렬을 content-migration 책임으로 둔다.",
        "asset-ingestion v1.0은 ExtractedContent.body를 rawBody + PII redaction materialized view로 보고 직접 편집 금지한다.",
        "content-migration §3.2.4 content-bulk-transform은 콘텐츠 일괄 재생성만 말한다."
      ],
      "impact": "content-bulk-transform이나 routing-slug-preservation이 asset-ingestion 유래 body/materialized fields를 직접 수정하면 redaction 재생성·PII forensic trail이 깨질 수 있다.",
      "recommendation": "step type registry에 mutable field allowlist/denylist를 두고, asset-ingestion materialized fields는 raw source 또는 approved redaction operation을 통해서만 변경하도록 명시하라."
    },
    {
      "id": "CM2-15",
      "severity": "major",
      "category": "semver",
      "title": "§1.1 변경 정책이 v0.2 신규 메커니즘을 모두 다루지 않는다",
      "evidence": [
        "§1.1은 legalImpactClassifier 룰 추가/완화는 다룬다.",
        "class enum 추가/삭제, reportingMode default 변경, CAS digest algorithm 변경, writeClass 세분화, skip policy 변경은 빠져 있다."
      ],
      "impact": "운영 안전장치 자체가 바뀌어도 MINOR로 처리될 수 있다. 특히 digest algorithm이나 legal class 삭제는 기존 dry-run report와 legal approval의 의미를 바꾼다.",
      "recommendation": "CAS digest algorithm/projection 변경, classifier class enum 변경, reportingMode default 변경, read-only writeClass 정책 변경, irreversible skip 정책 변경을 MAJOR 또는 policyVersion 신규로 명시하라."
    },
    {
      "id": "CM2-16",
      "severity": "major",
      "category": "privacy",
      "title": "read API privacy class·masking이 선언만 있고 정책 표가 없다",
      "evidence": [
        "§3.1 queryPlans/queryRuns/queryStepResults는 privacy class·masking을 괄호로만 언급한다.",
        "§12 StepResult는 input/output/diff를 저장한다고 한다."
      ],
      "impact": "legal-reviewer/operator가 PII sample diff, pricing/legal draft, copied testimonial 원문을 어디까지 볼 수 있는지 구현마다 달라진다.",
      "recommendation": "crm-sync의 displayHints/closed schema 패턴처럼 StepResult diff를 closed schema로 나누고 role별 redaction/export 금지/retention을 표로 정의하라."
    },
    {
      "id": "CM2-17",
      "severity": "major",
      "category": "step-registry",
      "title": "step type registry가 open인데 rollback·partial write·legal 분류가 registry에 의존한다",
      "evidence": [
        "§4.1 validatePlan은 registry 등록 step type 확인을 수행한다.",
        "§10.3은 step type registry 본 문서 vs 별도 문서를 open으로 둔다.",
        "§3.3 MigrationStep.inputs는 Record<string, any>다."
      ],
      "impact": "closed schema 없이 step inputs가 any이면 legalImpactClassifier, rollback precondition, dry-run hash projection, partial write 감지가 모두 불안정하다.",
      "recommendation": "v1.0 step registry 최소 계약을 본문에 포함하라: input schema, target entity types, read/write set projection, rollbackClass default, legal class hints, cancellation support, partial write detector, dry-run cost estimate."
    },
    {
      "id": "CM2-18",
      "severity": "major",
      "category": "acceptance-traceability",
      "title": "§9 fail/invariant와 §6 지표가 acceptance test로 추적되지 않는다",
      "evidence": [
        "§9.1-§9.5는 fail/warning/invariant를 나열한다.",
        "§6은 운영 지표만 있다.",
        "crm-sync v1.0은 INV-CAS 등 invariant와 acceptance traceability를 별도 매핑한다."
      ],
      "impact": "CAS mismatch, legal mismatch, partial write rollback, idempotency conflict, read-only write rejection 같은 핵심 불변식이 테스트 케이스로 고정되지 않는다.",
      "recommendation": "INV-CAS, INV-LEGAL, INV-ROLLBACK, INV-PARTIAL-WRITE, INV-READONLY, INV-IDEMPOTENCY, INV-OUTBOX 섹션과 acceptance test 매핑 표를 추가하라."
    },
    {
      "id": "CM2-19",
      "severity": "minor",
      "category": "doc-consistency",
      "title": "§0/§8/§12의 DB schema 위치 참조가 불일치한다",
      "evidence": [
        "§0은 DB 인벤토리 10 tables를 `§9 풀 schema`라고 말한다.",
        "§8 제목도 DB 10 tables 마이그레이션 `§9`라고 한다.",
        "실제 인벤토리는 §12에 있다."
      ],
      "impact": "검토자가 풀 schema 위치를 잘못 찾게 되고, v0.3 작업 범위 추적이 흐려진다.",
      "recommendation": "모든 참조를 §12로 정정하고, 풀 schema 예정이면 `§12 풀 schema는 v0.3`로 통일하라."
    },
    {
      "id": "CM2-20",
      "severity": "minor",
      "category": "notification-outbox",
      "title": "outbox 참조가 search-visibility §7.3/§13.10 사이에서 흔들린다",
      "evidence": [
        "상단 의존성은 search-visibility §13.5·§13.10을 말한다.",
        "§1.2.1은 ContentMigrationNotificationOutbox가 search-visibility §7.3 SQL 동일이라고 한다.",
        "§4.6 제목도 §7.3 패턴이라고 한다."
      ],
      "impact": "SoT 참조가 흔들리면 worker SQL, sourceEventId unique, retention/index 패턴 중 무엇을 따르는지 모호하다.",
      "recommendation": "search-visibility의 실제 canonical outbox schema/worker 섹션 번호로 통일하고, content-migration에는 필요한 SQL과 constraints를 자체 전개하라."
    },
    {
      "id": "CM2-21",
      "severity": "minor",
      "category": "terminology",
      "title": "`legalApproved`와 plan별 legal approval의 의미가 혼재된다",
      "evidence": [
        "DATA_MODEL ContentMigrationConfig legalApproved는 Feature 활성화 단계 승인이다.",
        "§4.1 approvePlanLegalGate는 plan별 legal approval이다.",
        "§9.1 build-time fail은 legalApproved 누락을 fail로 둔다."
      ],
      "impact": "Feature 자체 법무 승인과 개별 migration plan 법무 승인이 같은 이름으로 보이면 운영자가 한쪽 승인으로 다른 쪽을 대체해도 된다고 오해할 수 있다.",
      "recommendation": "Feature-level은 `featureLegalApproved`, plan-level은 `ContentMigrationLegalApproval`로 용어를 분리하고 build-time/runtime fail 표에서 구분하라."
    },
    {
      "id": "CM2-22",
      "severity": "minor",
      "category": "sampling",
      "title": "dry-run sampling은 v1.x open인데 v1.0 지표가 sample diff에 의존한다",
      "evidence": [
        "§10.1 CM-03은 stratified 알고리즘을 v1.x로 미룬다.",
        "§6은 fieldDiff delta를 sample diff vs 실제 diff 차이로 둔다."
      ],
      "impact": "random sampling만으로 PII/legal/critical 대상 100% 정확도를 주장하기 어렵다.",
      "recommendation": "v1.0에서는 legal/PII/critical class 대상은 full diff 또는 deterministic stratified minimum을 요구하고, random sampling은 low-risk plan에만 허용하라."
    },
    {
      "id": "CM2-23",
      "severity": "minor",
      "category": "audit-metadata",
      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
      "evidence": [
        "§3.1.1 audit metadata는 필드 몇 개만 나열한다.",
        "REVIEW_WORKFLOW AuditLog는 actorRole과 metadata shape 검증을 전제로 한다."
      ],
      "impact": "legal approval, skip, rollback 같은 고위험 행위에서 누가 어떤 policy/classifier snapshot 기준으로 승인했는지 감사 재현성이 부족하다.",
      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
    }
  ],
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.3, §4.1, §6, §9.2, §12",
      "change": "6필드 CAS digest 산정 알고리즘, projection, 비용 상한, DB 저장 columns/constraints 전개"
    },
    {
      "target": "docs/features/content-migration.md §4.2",
      "change": "irreversible step 자동 skip 제거, blocked manual remediation 상태 추가"
    },
    {
      "target": "docs/features/content-migration.md §3.3, §4.1, §9.2",
      "change": "expectedClassifierVersion 및 legalImpactClassificationDigest CAS 추가"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "10 tables 최소 schema + UNIQUE/CHECK/FK/CAS/partial unique/index 전개"
    },
    {
      "target": "docs/features/content-migration.md §3.2.5",
      "change": "policy-version-reevaluate reportingMode default와 risk-based 강제 규칙 정의"
    },
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "CAS digest algorithm absent",
      "irreversible rollback/skip contradiction",
      "legal classifier fail-closed/version mismatch policy absent",
      "DB constraints absent",
      "partial write detection absent",
      "cooperative cancellation unsupported-step behavior absent"
    ]
  }
}
tokens used
87,610
{
  "review_id": "content-migration-v0.2-cycle2",
  "target": "docs/features/content-migration.md",
  "prefix": "CM2-",
  "summary": {
    "blocking": 7,
    "major": 11,
    "minor": 5,
    "overall_assessment": "v0.2는 1차 지적 대부분을 표면적으로는 반영했지만, 운영 가능한 v1.0 후보로 보기에는 핵심 알고리즘·DB 제약·legal gate 강제력·partial write 감지 계약이 아직 닫혀 있지 않다. 특히 dry-run/apply 6필드 CAS, irreversible rollback/skip, legalImpactClassifier, policy-version-reevaluate batch contract는 이름은 추가됐지만 구현 불변식이 부족하다."
  },
  "cycle1_recheck": {
    "fully_corrected": [
      "CM1-01",
      "CM1-02",
      "CM1-03",
      "CM1-05",
      "CM1-10",
      "CM1-11",
      "CM1-12",
      "CM1-18",
      "CM1-19",
      "CM1-20",
      "CM1-24"
    ],
    "partially_corrected": [
      "CM1-04",
      "CM1-06",
      "CM1-07",
      "CM1-08",
      "CM1-09",
      "CM1-13",
      "CM1-14",
      "CM1-15",
      "CM1-16",
      "CM1-17",
      "CM1-21",
      "CM1-22",
      "CM1-23",
      "CM1-25"
    ],
    "regression_or_unresolved_core": [
      "CM1-15: DB 10 tables는 인벤토리만 있고 unique/CAS/partial unique가 없어 v1.0 검증 불가",
      "CM1-07: 6필드 CAS 이름은 생겼지만 targetSetDigest/contentHashDigest 산정 알고리즘과 비용 모델 없음",
      "CM1-06/CM1-21: irreversible rollback에서 자동 skip과 운영자 승인 요구가 충돌",
      "CM1-08: legalImpactClassifier class는 생겼지만 false negative·version mismatch·override 정책 없음"
    ],
    "note": "요청은 24개라고 했지만 참고 파일의 1차 결과에는 CM1-25까지 존재한다. v0.2 변경 이력도 CM1-25를 언급하므로 함께 재검증했다."
  },
  "findings": [
    {
      "id": "CM2-01",
      "severity": "blocking",
      "category": "dry-run-cas",
      "title": "6필드 CAS가 이름만 있고 digest 산정 알고리즘이 없다",
      "evidence": [
        "§3.3 RunApplyInput은 expectedTargetSetDigest·expectedContentHashDigest를 요구한다.",
        "§4.1은 DryRunReport에 6필드를 저장한다고만 한다.",
        "§6은 targetSetDigest match 100%를 목표로 둔다."
      ],
      "impact": "동일 target set을 어떤 정렬·canonical row projection·null/date/json normalization·tenant scoping으로 digest할지 없으면 dry-run/apply drift 차단이 구현마다 달라진다. 대량 row에서 contentHashDigest 전체 재계산이 apply 직전 병목이 되거나, 반대로 sampling hash로 구현되어 drift를 놓칠 수 있다.",
      "recommendation": "targetSetDigest = stable ordered target primary keys + selector version + tenant/instance scope의 Merkle 또는 chunked digest로 정의하라. contentHashDigest는 step별 read-set field projection, canonical JSON, chunk size, incremental watermark, max rows before snapshot requirement를 명시하라. dry-run과 apply preflight에서 동일 함수를 재사용하고 비용 상한·fallback snapshot 정책을 둬라."
    },
    {
      "id": "CM2-02",
      "severity": "blocking",
      "category": "rollback",
      "title": "irreversible step rollback에서 `skipStep 자동 호출`과 운영자 승인 요구가 모순된다",
      "evidence": [
        "§4.2 step별 rollbackClass 분기: irreversible은 `skipStep 자동 호출`이라고 되어 있다.",
        "같은 줄에 `운영자 승인 필요 — runtime fail 후 운영자 수동 호출 권장`이라고 되어 있다.",
        "§3.1 skipStep은 super-admin + 사유 + remediationTicketRef를 요구한다."
      ],
      "impact": "rollback 중 irreversible step을 자동 skip하면 실제 복구 불가능한 변경을 운영자 확인 없이 정상 rollback으로 오인할 수 있다. 반대로 자동 호출이 실패한다면 rollback state machine이 어디서 멈추는지 불명확하다.",
      "recommendation": "자동 skip을 금지하라. irreversible encountered 시 rollback은 `blocked-manual-remediation-required` 상태로 전이하고, skipStep은 별도 super-admin 명시 승인 + affectedRowsConfirmation + remediationTicketRef 후에만 진행되게 하라. rollback-applied audit에는 skippedIrreversibleSteps가 있으면 result를 partial로 강제하라."
    },
    {
      "id": "CM2-03",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "legalImpactClassifier가 rule/LLM/false-negative 정책 없이 legal gate SoT가 됐다",
      "evidence": [
        "§2.3은 legalImpactClassifierRef만 둔다.",
        "§3.3은 8개 class와 classifierVersion만 정의한다.",
        "§9.2는 legal gate 필요 plan + 미승인만 fail로 둔다."
      ],
      "impact": "분류기가 누락하면 LegalDocument, PricingPage, 후기, priorReviewRequired 변경이 legal-reviewer 없이 apply될 수 있다. 의료광고·PII 영역에서 false negative가 곧 게이트 우회다.",
      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
    },
    {
      "id": "CM2-04",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "`forceProceedDespiteWarnings`가 legal gate 우회 가능성을 남긴다",
      "evidence": [
        "§3.3 RunApplyInput에 forceProceedDespiteWarnings가 있다.",
        "§9.3 targetSelector 0건/초과/orphan Core row는 warning으로 둔다.",
        "legalImpactClassification과 classifierVersion은 RunApplyInput CAS 대상이 아니다."
      ],
      "impact": "경고와 legal-required 상태의 경계가 닫혀 있지 않아 운영자가 forceProceedDespiteWarnings로 법무 영향 warning을 밀고 갈 수 있다. apply 시점 classifierVersion이 바뀌어도 dry-run 당시 legal classification을 재검증할 CAS가 없다.",
      "recommendation": "forceProceedDespiteWarnings가 legalGateRequired, classifierVersion mismatch, legal class unknown, irreversible precondition warning에는 적용되지 않는다고 명시하라. RunApplyInput에 expectedLegalImpactClassificationDigest와 expectedClassifierVersion을 추가하고 mismatch 시 dry-run 재수행을 강제하라."
    },
    {
      "id": "CM2-05",
      "severity": "blocking",
      "category": "db-schema",
      "title": "DB 10 tables가 인벤토리뿐이라 핵심 unique·CAS·partial unique를 검증할 수 없다",
      "evidence": [
        "§12는 10개 테이블 이름과 핵심 필드만 나열한다.",
        "§8은 DB 10 tables 마이그레이션이라고 하지만 실제 schema가 없다.",
        "§12 제목은 풀 schema를 v0.3으로 미룬다."
      ],
      "impact": "ContentMigrationPlan idempotency unique, DryRunReport 6필드 보존, Run status CAS, StepResult unique(plan/run/stepKey), LegalApproval 최신 승인 partial unique, RetryQueue 진행 중 unique, NotificationOutbox sourceEventId unique가 없으면 명세의 안전장치가 DB에서 강제되지 않는다.",
      "recommendation": "v0.2라도 최소 constraints 표를 추가하라. 예: UNIQUE(instanceId,idempotencyKey), UNIQUE(runId,stepKey), UNIQUE(planId) WHERE approvalStatus='active', CAS columns(status/version), outbox UNIQUE(sourceEventId), retry queue UNIQUE(stepResultId) WHERE status IN ('pending','processing'). v1.0 후보 전에는 풀 SQL을 전개하라."
    },
    {
      "id": "CM2-06",
      "severity": "blocking",
      "category": "partial-write",
      "title": "partial write 감지에 의존하지만 감지 알고리즘이 없다",
      "evidence": [
        "§4.3 cancelRun은 partial commit 검사를 요구한다.",
        "§4.4 retry exhausted는 partial write 감지 여부로 rollback 우선순위를 결정한다.",
        "§12.5는 partial write 추적이라고만 한다."
      ],
      "impact": "step 실패 후 어떤 row가 일부 반영됐는지 모르면 rollback 우선 정책은 실행 불가능하다. row count만 보면 field-level partial mutation을 놓치고, checksum만 보면 compensating write 여부를 판단하지 못한다.",
      "recommendation": "step contract에 writeSetManifest를 강제하라. 각 step은 expectedAffectedRows, beforeDigest, afterDigest, committedRowIds/chunkIds, transactionBoundary, compensationStatus를 StepResult에 기록해야 한다. 감지는 row count + write-set digest + per-step invariant query로 정의하라."
    },
    {
      "id": "CM2-07",
      "severity": "blocking",
      "category": "state-machine",
      "title": "pause/cancel이 cooperative cancellation 미지원 step에서 닫히지 않는다",
      "evidence": [
        "§4.3은 running step이 cooperative cancellation point까지 완료된다고 가정한다.",
        "§9.2는 step timeout 초과 시 failed-transient라고만 한다.",
        "step type registry 계약은 §10.3에서 open으로 남아 있다."
      ],
      "impact": "장시간 DB batch나 외부 check() 호출 step이 cancellation point를 구현하지 않으면 pause/cancel 요청이 timeout까지 대기하거나 partial commit 상태를 남긴다. 그 동안 read-only window와 lock 보유 정책도 불명확하다.",
      "recommendation": "step registry에 supportsCooperativeCancellation, cancellationCheckInterval, maxUninterruptibleSeconds, transactionBoundary를 필수화하라. 미지원 step은 validate fail 또는 isolated chunk execution만 허용하라. cancel timeout 후 상태를 `cancellation-timeout-manual-review`로 닫아라."
    },
    {
      "id": "CM2-08",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "`reportingMode=stale-flags-only`와 `new-record-version` 선택 기준이 없다",
      "evidence": [
        "§2.3 기본 reportingMode는 stale-flags-only다.",
        "§3.2.5는 staleFlags 갱신 또는 새 ComplianceRecord 생성만 설명한다.",
        "§7은 new-record-version일 때 REVIEW_WORKFLOW lifecycle 진입을 말한다."
      ],
      "impact": "법무 정책 변경, priorReviewRequired 변화, LegalDocument 영향 같은 고위험 변경도 기본값 때문에 stale flag만 찍고 검수 lifecycle에 들어가지 않을 수 있다.",
      "recommendation": "default를 risk-based로 바꿔라. LegalDocument, ReviewPolicy, PricingPage, priorReviewRequired 변화, High/Critical risk 상승은 new-record-version 강제. 단순 low-risk wording stale만 stale-flags-only 허용. 운영 기본값도 문서에 명시하라."
    },
    {
      "id": "CM2-09",
      "severity": "major",
      "category": "compliance-cache",
      "title": "durable cache hit를 `skip`한다고 해서 policy 재평가가 안전해지는 것은 아니다",
      "evidence": [
        "§3.2.5 step 2는 compliance-assistant cacheKey durable cache hit는 skip이라고 한다.",
        "compliance-assistant는 cacheKey에 ruleCatalogVersion/ruleFileHashes 등 입력을 포함해 cacheKey 변경 시 자연 miss를 유도한다."
      ],
      "impact": "skip이 batch result 미기록인지 check() 호출 생략 후 기존 result 연결인지 불명확하다. 재평가 batch에서 cache hit도 대상 row별 outcome으로 남기지 않으면 감사·진행률·stale 해소 판단이 깨진다.",
      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
    },
    {
      "id": "CM2-10",
      "severity": "major",
      "category": "read-only-window",
      "title": "`notification-operational` 허용 범위가 너무 넓다",
      "evidence": [
        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
        "§5.1 run-completed는 normal inApp이다."
      ],
      "impact": "read-only window 중 digest 처리나 read receipt 같은 사용자 행위성 write까지 허용하면 window의 write 차단 의미가 흐려진다. 반대로 content-migration-run-completed 같은 운영 알림은 즉시 전달되어야 하는지 digest 가능인지도 명확하지 않다.",
      "recommendation": "notification-operational을 emit-outbox, dispatch, read-receipt, digest-state로 세분화하라. read-only window 중에는 migration safety 알림 emit/dispatch만 허용하고 read receipt/digest mutation은 큐잉하거나 별도 operational DB로 분리하라."
    },
    {
      "id": "CM2-11",
      "severity": "major",
      "category": "snapshot-cas",
      "title": "sourceSnapshotWatermark와 policyVersionSnapshot의 정의가 없다",
      "evidence": [
        "§4.1과 §9.2는 sourceSnapshotWatermark·policyVersionSnapshot 불일치 시 CAS fail을 요구한다.",
        "§3.3은 필드명만 둔다."
      ],
      "impact": "source instance copy, asset-ingestion handoff, compliance policy 재평가에서 무엇을 watermark로 볼지 구현마다 달라진다. updatedAt max는 삭제·복구·동시 insert를 놓칠 수 있고, policyVersion 문자열만으로는 rule file hash 변경을 놓칠 수 있다.",
      "recommendation": "sourceSnapshotWatermark는 source table별 high-watermark + deletion ledger/version vector로 정의하라. policyVersionSnapshot은 DATA_MODEL/contentMigrationPolicyVersion/compliance ruleCatalogVersion/ruleFileHashes/review workflow version을 포함한 canonical digest로 정의하라."
    },
    {
      "id": "CM2-12",
      "severity": "major",
      "category": "audit-notification",
      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
      "evidence": [
        "§3.1에는 validatePlan, runDryRun, pauseRun, resumeRun, cancelRun, rollbackRun, skipStep 등이 있다.",
        "§3.1.1 audit에는 dry-run completed, pause/resume requested/applied, rollback-triggered가 없다.",
        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
      ],
      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
    },
    {
      "id": "CM2-13",
      "severity": "major",
      "category": "idempotency",
      "title": "crm-sync idempotency 패턴 재사용이 content-migration scope에 맞게 닫히지 않았다",
      "evidence": [
        "§3.4 definePlan/runApply requestFingerprint를 정의한다.",
        "같은 표에 `applyConsentWithdrawal 등 동일 패턴`이라는 crm-sync 잔재가 있다.",
        "§12에는 idempotency unique scope가 없다."
      ],
      "impact": "idempotencyKey가 instance-scoped인지 plan-scoped인지 user-scoped인지 불명확하다. runApply fingerprint가 expectedTargetSetDigest 등 6필드를 포함하지 않아 동일 dryRunReportId 안의 CAS 입력 차이를 식별하지 못할 수 있다.",
      "recommendation": "crm-sync 잔재 문구를 제거하고 command별 UNIQUE scope를 DB constraints에 반영하라. runApply requestFingerprint에는 expectedDryRunReportId와 6필드 CAS 값을 모두 포함하라."
    },
    {
      "id": "CM2-14",
      "severity": "major",
      "category": "asset-ingestion-consistency",
      "title": "asset-ingestion의 body materialized view/forensic 패턴을 migration step 계약에 반영하지 않았다",
      "evidence": [
        "§1.3은 asset-ingestion promote 이후 Core row 정렬을 content-migration 책임으로 둔다.",
        "asset-ingestion v1.0은 ExtractedContent.body를 rawBody + PII redaction materialized view로 보고 직접 편집 금지한다.",
        "content-migration §3.2.4 content-bulk-transform은 콘텐츠 일괄 재생성만 말한다."
      ],
      "impact": "content-bulk-transform이나 routing-slug-preservation이 asset-ingestion 유래 body/materialized fields를 직접 수정하면 redaction 재생성·PII forensic trail이 깨질 수 있다.",
      "recommendation": "step type registry에 mutable field allowlist/denylist를 두고, asset-ingestion materialized fields는 raw source 또는 approved redaction operation을 통해서만 변경하도록 명시하라."
    },
    {
      "id": "CM2-15",
      "severity": "major",
      "category": "semver",
      "title": "§1.1 변경 정책이 v0.2 신규 메커니즘을 모두 다루지 않는다",
      "evidence": [
        "§1.1은 legalImpactClassifier 룰 추가/완화는 다룬다.",
        "class enum 추가/삭제, reportingMode default 변경, CAS digest algorithm 변경, writeClass 세분화, skip policy 변경은 빠져 있다."
      ],
      "impact": "운영 안전장치 자체가 바뀌어도 MINOR로 처리될 수 있다. 특히 digest algorithm이나 legal class 삭제는 기존 dry-run report와 legal approval의 의미를 바꾼다.",
      "recommendation": "CAS digest algorithm/projection 변경, classifier class enum 변경, reportingMode default 변경, read-only writeClass 정책 변경, irreversible skip 정책 변경을 MAJOR 또는 policyVersion 신규로 명시하라."
    },
    {
      "id": "CM2-16",
      "severity": "major",
      "category": "privacy",
      "title": "read API privacy class·masking이 선언만 있고 정책 표가 없다",
      "evidence": [
        "§3.1 queryPlans/queryRuns/queryStepResults는 privacy class·masking을 괄호로만 언급한다.",
        "§12 StepResult는 input/output/diff를 저장한다고 한다."
      ],
      "impact": "legal-reviewer/operator가 PII sample diff, pricing/legal draft, copied testimonial 원문을 어디까지 볼 수 있는지 구현마다 달라진다.",
      "recommendation": "crm-sync의 displayHints/closed schema 패턴처럼 StepResult diff를 closed schema로 나누고 role별 redaction/export 금지/retention을 표로 정의하라."
    },
    {
      "id": "CM2-17",
      "severity": "major",
      "category": "step-registry",
      "title": "step type registry가 open인데 rollback·partial write·legal 분류가 registry에 의존한다",
      "evidence": [
        "§4.1 validatePlan은 registry 등록 step type 확인을 수행한다.",
        "§10.3은 step type registry 본 문서 vs 별도 문서를 open으로 둔다.",
        "§3.3 MigrationStep.inputs는 Record<string, any>다."
      ],
      "impact": "closed schema 없이 step inputs가 any이면 legalImpactClassifier, rollback precondition, dry-run hash projection, partial write 감지가 모두 불안정하다.",
      "recommendation": "v1.0 step registry 최소 계약을 본문에 포함하라: input schema, target entity types, read/write set projection, rollbackClass default, legal class hints, cancellation support, partial write detector, dry-run cost estimate."
    },
    {
      "id": "CM2-18",
      "severity": "major",
      "category": "acceptance-traceability",
      "title": "§9 fail/invariant와 §6 지표가 acceptance test로 추적되지 않는다",
      "evidence": [
        "§9.1-§9.5는 fail/warning/invariant를 나열한다.",
        "§6은 운영 지표만 있다.",
        "crm-sync v1.0은 INV-CAS 등 invariant와 acceptance traceability를 별도 매핑한다."
      ],
      "impact": "CAS mismatch, legal mismatch, partial write rollback, idempotency conflict, read-only write rejection 같은 핵심 불변식이 테스트 케이스로 고정되지 않는다.",
      "recommendation": "INV-CAS, INV-LEGAL, INV-ROLLBACK, INV-PARTIAL-WRITE, INV-READONLY, INV-IDEMPOTENCY, INV-OUTBOX 섹션과 acceptance test 매핑 표를 추가하라."
    },
    {
      "id": "CM2-19",
      "severity": "minor",
      "category": "doc-consistency",
      "title": "§0/§8/§12의 DB schema 위치 참조가 불일치한다",
      "evidence": [
        "§0은 DB 인벤토리 10 tables를 `§9 풀 schema`라고 말한다.",
        "§8 제목도 DB 10 tables 마이그레이션 `§9`라고 한다.",
        "실제 인벤토리는 §12에 있다."
      ],
      "impact": "검토자가 풀 schema 위치를 잘못 찾게 되고, v0.3 작업 범위 추적이 흐려진다.",
      "recommendation": "모든 참조를 §12로 정정하고, 풀 schema 예정이면 `§12 풀 schema는 v0.3`로 통일하라."
    },
    {
      "id": "CM2-20",
      "severity": "minor",
      "category": "notification-outbox",
      "title": "outbox 참조가 search-visibility §7.3/§13.10 사이에서 흔들린다",
      "evidence": [
        "상단 의존성은 search-visibility §13.5·§13.10을 말한다.",
        "§1.2.1은 ContentMigrationNotificationOutbox가 search-visibility §7.3 SQL 동일이라고 한다.",
        "§4.6 제목도 §7.3 패턴이라고 한다."
      ],
      "impact": "SoT 참조가 흔들리면 worker SQL, sourceEventId unique, retention/index 패턴 중 무엇을 따르는지 모호하다.",
      "recommendation": "search-visibility의 실제 canonical outbox schema/worker 섹션 번호로 통일하고, content-migration에는 필요한 SQL과 constraints를 자체 전개하라."
    },
    {
      "id": "CM2-21",
      "severity": "minor",
      "category": "terminology",
      "title": "`legalApproved`와 plan별 legal approval의 의미가 혼재된다",
      "evidence": [
        "DATA_MODEL ContentMigrationConfig legalApproved는 Feature 활성화 단계 승인이다.",
        "§4.1 approvePlanLegalGate는 plan별 legal approval이다.",
        "§9.1 build-time fail은 legalApproved 누락을 fail로 둔다."
      ],
      "impact": "Feature 자체 법무 승인과 개별 migration plan 법무 승인이 같은 이름으로 보이면 운영자가 한쪽 승인으로 다른 쪽을 대체해도 된다고 오해할 수 있다.",
      "recommendation": "Feature-level은 `featureLegalApproved`, plan-level은 `ContentMigrationLegalApproval`로 용어를 분리하고 build-time/runtime fail 표에서 구분하라."
    },
    {
      "id": "CM2-22",
      "severity": "minor",
      "category": "sampling",
      "title": "dry-run sampling은 v1.x open인데 v1.0 지표가 sample diff에 의존한다",
      "evidence": [
        "§10.1 CM-03은 stratified 알고리즘을 v1.x로 미룬다.",
        "§6은 fieldDiff delta를 sample diff vs 실제 diff 차이로 둔다."
      ],
      "impact": "random sampling만으로 PII/legal/critical 대상 100% 정확도를 주장하기 어렵다.",
      "recommendation": "v1.0에서는 legal/PII/critical class 대상은 full diff 또는 deterministic stratified minimum을 요구하고, random sampling은 low-risk plan에만 허용하라."
    },
    {
      "id": "CM2-23",
      "severity": "minor",
      "category": "audit-metadata",
      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
      "evidence": [
        "§3.1.1 audit metadata는 필드 몇 개만 나열한다.",
        "REVIEW_WORKFLOW AuditLog는 actorRole과 metadata shape 검증을 전제로 한다."
      ],
      "impact": "legal approval, skip, rollback 같은 고위험 행위에서 누가 어떤 policy/classifier snapshot 기준으로 승인했는지 감사 재현성이 부족하다.",
      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
    }
  ],
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.3, §4.1, §6, §9.2, §12",
      "change": "6필드 CAS digest 산정 알고리즘, projection, 비용 상한, DB 저장 columns/constraints 전개"
    },
    {
      "target": "docs/features/content-migration.md §4.2",
      "change": "irreversible step 자동 skip 제거, blocked manual remediation 상태 추가"
    },
    {
      "target": "docs/features/content-migration.md §3.3, §4.1, §9.2",
      "change": "expectedClassifierVersion 및 legalImpactClassificationDigest CAS 추가"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "10 tables 최소 schema + UNIQUE/CHECK/FK/CAS/partial unique/index 전개"
    },
    {
      "target": "docs/features/content-migration.md §3.2.5",
      "change": "policy-version-reevaluate reportingMode default와 risk-based 강제 규칙 정의"
    },
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "CAS digest algorithm absent",
      "irreversible rollback/skip contradiction",
      "legal classifier fail-closed/version mismatch policy absent",
      "DB constraints absent",
      "partial write detection absent",
      "cooperative cancellation unsupported-step behavior absent"
    ]
  }
}


codex
대상 문서에서 이미 몇 가지 자체 모순이 보입니다. 특히 “전건 수용”이라고 쓰면서 §3.1 note와 §10.3에서 REVIEW_WORKFLOW cascade를 다음 cycle로 미룬 점, §12.6 worker SQL을 다시 외부 참조로 돌린 점은 재발 또는 미완 수용 후보로 따로 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"partial unique|CrmCredentialVersion|CredentialVersion|active|rotating-target|committed|CAS WHERE|solutionVersion|requestFingerprint|idempotency|closed schema|displayHints\" docs\\features\\crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"body materialized|materialized view|rawBody|direct|denylist|redaction|checksum|state machine|pending-commit|committed|failed|CAS\" docs\\features\\asset-ingestion.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"cacheKey|durable cache|check\\(|risk|RiskLevel|cache|ruleCatalogVersion|ruleFileHashes|ComplianceCheckResult|High|Critical\" docs\\features\\compliance-assistant.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ContentMigration|contentMigration|content-migration|C-08|C-10|PII|LegalDocument|ReviewPolicy|PricingPage|ComplianceRecord|priorReviewRequired|staleFlags|recordVersion\" docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
 succeeded in 645ms:
7:> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
21:- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
23:- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
24:- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출
39:| 캐시 키 산정 로직 변경 | **MAJOR** | 기존 cache 무효화 |
99:      cacheEnabled: true
100:      cacheTtlSeconds: 86400
120:    explicitRiskLevel?: RiskLevel;
121:    inferredRiskLevel?: RiskLevel;   // CONTENT_STANDARDS § 7.1 정식 입력 슬롯 — 호출자(어드민·빌드 파이프라인)가 RiskInference 결과를 채워서 전달. 본 Feature가 단일 엔트리포인트 `check()` 호출 전 외부에서 RiskInference 실행한 경우 사용. 미지정 시 본 Feature 내부에서 자동 추론 (§ 3.3 흐름)
123:  riskRules: RiskRule[];
127:### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)
130:type ComplianceCheckResult = {
146:### 3.3 단일 엔트리포인트 — `check()`
148:본 Feature는 **단일 엔트리포인트** `check(input)`를 노출. 호출자(어드민·빌드 파이프라인)는 RiskInference·inlineRiskFlags 추출 등을 별도 호출하지 않음.
151:async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
155:- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
163:4. RiskInference 실행 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 → `RiskInferenceResult` (RISK_LEVELS § 2.3.1)
164:5. High 가상 finding 주입·결과 집계·LLM 보조(어드민 모드)
166:**`metadata.inferredRiskLevel` 입력 처리** (CONTENT_STANDARDS § 7.1 SoT 정합):
169:- 호출자가 룰 카탈로그·slot 변경 후 stale 위험을 회피하려면 — `inferredRiskLevel` 미전달하여 내부 재계산 강제 또는 cacheKey 변경으로 자연 재계산
173:본 Feature 내부에서 사용. § 3.3 `check()`가 자동 호출:
181:  explicitRiskLevel?: RiskLevel;
185:  inferredRiskLevel: RiskLevel;        // MAX 결합 결과
186:  steps: Array<{ source: string; level: RiskLevel }>;  // 산정 과정 추적
212:   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
213:6. RiskInference 실행 (RISK_LEVELS § 2.3) — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합. § 5.1.2 컨텍스트별 false-positive 완화 적용
214:7. High 가상 finding 자동 주입 — 최종 `inferredRiskLevel === "High"` 시. Finding 채움 (CONTENT_STANDARDS § 7.1.2 / RISK_LEVELS § 6.1·§ 6.2 동기화):
215:   - `ruleId: "risk-level-high-gate"`
217:   - `pattern: "(RiskLevel=High)"`
220:   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
221:   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
222:8. severity 집계 → ComplianceCheckResult 산출:
251:| 캐시 | 사용 (동일 hash + 룰 version → cache hit) | 사용 |
252:| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
395:- 본 완화는 RiskLevel 격상 단계만 — `inlineRiskFlags[]` 출력에는 포함 (감사 정보)
430:cacheKey = hash(
435:  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
438:  ruleCatalogVersion,                   // meta.yaml catalogVersion (6파일 통합)
439:  ruleFileHashes,                       // 각 룰 파일의 개별 hash (cascade 추적용)
454:| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
455:| **운영 TTL 캐시** (operational TTL cache) | 동일 콘텐츠에 짧은 시간 내 반복 호출 시 LLM 비용 절약 | instance 설정 (기본 86400초) |
458:- **TTL 만료**: 운영 TTL 캐시만 만료. 영속 결과 캐시는 cacheKey 입력 중 하나가 변경되어야 무효화 (예: 룰 카탈로그 갱신)
462:- 동일 cacheKey → 영속 결과 캐시로 항상 동일 결과
479:- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출
495:| **운영 TTL cache hit ratio** | TTL hit / (hit + miss) | > 70% (어드민 모드 운영 누적 후) |
496:| **영속 결과 cache hit ratio** | 영속 hit / (영속 hit + miss) | > 50% (운영 누적 후) |
506:- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
540:      cacheEnabled: true
541:      cacheTtlSeconds: 86400
552:   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
555:     - `medical` — riskLevel ∈ {Medium, High} 시 (Medium/High 판정은 어드민 수동)
575:> § 9.1 운영 지표(cache hit ratio·처리 시간 SLO 등)는 빌드 검증 룰이 아닌 **운영 관측·알림 영역** — § 9.3 알림 처리.
608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |

 succeeded in 744ms:
19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
49:| displayHints column 추가 | MINOR | 별개 | nullable. read API output 추가 |
50:| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
53:| CrmCredentialVersion.state enum 추가 | MINOR | 별개 | invariant 표 갱신 |
54:| CrmCredentialVersion.state enum 제거·rename | **MAJOR** | policyVersion 신규 | |
68:- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT
158:      pii: { rawPiiStorageAllowed: false, displayHintsRetentionDays: 30, ssnRrnHandling: "deny", liveReadEnabled: false }
170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
217:| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy·unregisterPolicySnapshot | super-admin |
235:  displayHints: ContactDisplayHints;
247:  displayHints: ContactDisplayHints;
265:  displayHints: ContactDisplayHints;
272:#### 3.2.1 ContactDisplayHints — closed schema 6 column
320:- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
321:- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
322:- displayHintsRetentionDays 만료: displayHints만 nulling
342:  idempotencyKey: string;                       // UNIQUE per instance
417:      idempotencyKey: string;                   // 중복 적용 방지
426:      idempotencyKey: string;
437:  displayHintsNulled: boolean;
457:  revertedVersionId: string;                    // CredentialVersion.state="reverted" row
584:3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
589:8. CRM API call (idempotency-key)
602:4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
686:| `fieldPath` | "displayHints.phoneLast4" 등 |
716:#### 4.5.1 CrmCredentialVersion entity — § 13.11
720:**CrmIntegration.credentialState** 5상태. **CrmCredentialVersion.state** 6상태.
722:| Integration state | CredentialVersion rows | 의미 |
724:| stable | 1 row `state=active` (others `revoked`) | 정상 |
725:| rotating | 1 `active`(이전) + 1 `rotating-target`(신규) | rotation 진행. outbound new 우선·old fallback. inbound active + rotating-target 병행 |
726:| committed | 1 `committed`(이전·graceUntil) + 1 `active`(신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil) |
727:| grace-expired | 1 `active`(신규) (others `revoked`/`grace-expired`) | committed graceUntil 도래. outbound/inbound active만 |
728:| reverted | 1 `active`(원래) + 1 `reverted`(신규 실패) | rotation 실패 |
734:| stable | active | active만 |
735:| rotating | rotating-target 우선·active fallback | active + rotating-target 병행 |
736:| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
737:| grace-expired | active(신규) only | active만 |
738:| reverted | active(원래) | active만 |
747:-- 3. 새 CredentialVersion insert (state='rotating-target')
755:**DB partial unique 강제** (§ 13.11):
756:- `UNIQUE(integration_id) WHERE state='active'` — active row 1개만
757:- `UNIQUE(integration_id) WHERE state='rotating-target'` — rotating-target 1개만
758:- `UNIQUE(integration_id) WHERE state='committed'` — committed 1개만
760:→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.
763:- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
764:- 실패 → BEGIN; SELECT FOR UPDATE → 신규 rotating-target → reverted → integration state 'reverted'; COMMIT;
769:- reverted CredentialVersion row → state="revoked"
773:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
778:-- 1. committed credential version (graceUntil 도래) 조회
779:SELECT integration_id, id AS committed_version_id, grace_until
781:WHERE state='committed' AND grace_until <= now()
788:-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
789:-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
791:WHERE id=$committed_version_id;
795:WHERE id=$integration_id AND credential_state='committed';
807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
840:| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
841:| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
842:| CrmRecord.displayHints* | nulling (option `keepDisplayHints=false` 기본) | row 유지 | false | — |
864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
865:3. `(integrationId, idempotencyKey)` lookup:
866:   - **존재 + requestFingerprint 일치** → same-request replay → 기존 ledger 결과 반환 (no-op)
867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
870:5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
874:7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
875:8. scope="marketing-only": displayHints nulling만
921:### 7.1 closed schema + privacy-sensitive operational hints
923:- displayHints: 6 column closed schema (§ 3.2.1)
952:### 7.5 displayHints expiry + operationalHints expiry (CS4-05)
956:- displayHintsRetentionDays 만료 → displayHints 6 column nulling. ChangeLog tombstone
1022:- stable → rotating → committed (성공)
1024:- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
1025:- committed → grace-expired (worker)
1029:- rotating 중 outbound + inbound 동시 → 모두 성공 (active·rotating-target 병행 verifier)
1036:#### INV-PII (closed schema)
1048:- applyConsentWithdrawal(keyType=piiHash) → matched record displayHints nulling
1050:- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
1051:- scope=marketing-only → displayHints nulling만
1053:- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
1059:- displayHints nulling·queue cancel·ledger 보존
1071:- displayHintsRetentionDays → nulling
1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
1111:| § 10.2 displayHints closed schema 위반 | INV-PII |
1117:| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
1174:- CAS WHERE 0 rows → ConflictRecord + alert
1175:- displayHints closed schema 위반 → DB CHECK reject + validator alert
1177:- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
1181:- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)
1187:  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
1188:  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
1200:- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
1202:- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
1219:    | CrmRecord.displayHints* | nulling | × |
1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
1310:| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
1311:| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
1316:| `active` | boolean | ✅ |
1319:**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
1320:**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.
1327:| `idempotencyKey` | string | ✅ |
1339:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
1366:| `idempotencyKey` | string | ✅ |
1377:**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
1450:| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
1454:| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
1455:| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
1456:| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
1457:| `displayHintsCityName` | varchar(32) | optional — CHECK |
1458:| `displayHintsGenderHint` | enum | optional |
1459:| `displayHintsAgeBand` | enum | optional |
1504:| `active` | boolean | ✅ |
1506:**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
1555:### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)
1565:| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
1574:- `UNIQUE(integrationId) WHERE state='active'` — partial unique
1575:- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
1576:- `UNIQUE(integrationId) WHERE state='committed'` — partial unique
1578:→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.
1580:**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.
1633:| `idempotencyKey` | string | ✅ |
1634:| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
1637:| `displayHintsNulled` | boolean | ✅ |
1650:- `UNIQUE(integration_id, idempotency_key)`
1681:| 13.1 | CrmIntegration | partial unique active+integrationKey |
1682:| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
1684:| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
1685:| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
1691:| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
1692:| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |

 succeeded in 660ms:
4:> **작성일**: 2026-05-15 (v0.20 → v0.21 — `features/content-migration.md` 1차 사이클 cascade: C-08 `contentMigrationConfig`(ContentMigrationConfig 신설 — legalApproved·approvalRequired·legalImpactClassifierRef) + `contentMigrationPolicyVersion` — CM1-03)
20:- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
42:| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
47:| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
51:| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
567:### C-08. `InstanceManifest` — 버전 고정 명세
598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
722:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
726:| `legalApproved` | boolean | ✅ | content-migration Feature 자체 legal 승인 (CM1-08 — Feature 활성화 단계 게이트) |
729:| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
730:| `legalImpactClassifierRef` | string | ✅ | (CM1-08) legalImpactClassifier 구현 모듈 ref — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy 영향 plan 자동 분류 |
732:> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
757:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
767:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
780:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
781:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
782:| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
786:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
791:| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
792:| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
811:> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
842:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
844:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
859:| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
865:#### `LegalDocumentRevision`
873:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
936:### C-13. `ReviewPolicy`
945:### C-17. `PricingPage`
1040:ComplianceRecord (C-10)
1060:| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
1087:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1088:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1089:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1090:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1091:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
1093:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
1095:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
1097:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
1098:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
1099:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
1100:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
1101:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
1102:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
1103:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

 succeeded in 675ms:
15:- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
114:| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |
222:| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
343:| `pending-commit` | check() 성공·4단계 transaction 진입 직전 |
344:| `committed` | 4단계 transaction commit 성공 |
345:| `failed` | check() 실패·4단계 abort·게이트 재검증 실패 |
357:   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
358:   d. 실패 → AssetPromotionRecord UPDATE status="failed", lastError + 외부 sink alert + early exit
359:3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
363:      - 게이트 재검증 실패 → transaction abort (Core row 미생성). **3.a의 `commitStartedAt` update도 abort와 함께 rollback** (AI5-02 정합). **별도 짧은 transaction에서 AssetPromotionRecord UPDATE status="failed", lastError="gate-race-failure", failedAt=now() WHERE status='pending-commit'** (WHERE 조건으로 race 방지. commitStartedAt은 채우지 않음 — abort로 rollback된 상태) — AI4-03
368:   h. AssetPromotionRecord UPDATE status="committed", commitCompletedAt=now(), targetContentRef=Core row @id
381:  - status="checking" + checkStartedAt < now() - 30분 → status="failed", lastError="checker-timeout"
382:  - status="pending-commit" + checkCompletedAt < now() - 10분 → status="failed", lastError="commit-stalled" (Core row·ComplianceRecord 미존재 시 — 존재 시 status="committed"로 수렴)
383:  - status="committed" + audit log 미존재 (24시간 내) → 재기록 시도. 재시도 3회 후 sink alert
390:### 9.1 PII 자동 감지·redaction
400:  - **checksum 검증 (정확 공식)**:
411:**redaction mode**:
417:- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
419:- **AssetPiiFinding** (§ 16.7): 발견 내역 구조화 저장. offset은 rawBody 기준
432:| `asset-ingestion-batch-failed` | high | email + inApp | inApp | — | respect | mandatory |
446:| `asset-ingestion-batch-failed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 실패 — ${date}"` | ingestionLogId·failedSources[] |
448:| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
474:| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
477:| **redaction completion SLA** | promoteAsset 시점에 모든 finding redactionApplied or false-positive 비율 | > 99% |
546:  - status="checking" + checkStartedAt < now()-30분 → `UPDATE WHERE status='checking'` SET status="failed", lastError="checker-timeout"
547:  - status="pending-commit" + checkCompletedAt < now()-10분 → **3종 존재 검사 (AI4-04 + AI5-01 targetContentRef null 처리)**:
550:      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
553:    - **3종 모두 존재 → status="committed"**, commitCompletedAt=Core row @createdAt + targetContentRef backfill (필요 시)
554:    - **0건 또는 partial 존재 → status="failed"**, lastError="commit-stalled-partial" + 외부 sink alert (운영자가 partial row 정리)
555:  - status="committed" + audit log 미존재 (24h) → audit 재기록 3회. 실패 시 sink alert
557:- **AssetIngestionNotificationOutbox dispatch-failed-permanent** 누적 임계 초과 → 운영팀 alert
598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
622:### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)
625:- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
626:- **`body`** (Markdown — **materialized view**: rawBody + AssetPiiFinding(reviewStatus="true-positive" AND redactionApplied=true) redaction operations로 자동 재생성). **직접 편집 금지** (AI4-09). 수동 redaction은 detector="manual"인 AssetPiiFinding 추가로 수행 → body는 redaction worker가 재생성
628:  - `ExtractedContent.rawBody` update
629:  - `AssetPiiFinding` insert / update(reviewStatus·redactionApplied·redactionMode 변경) / delete
632:- `bodyVersion` integer — rawBody·AssetPiiFinding 변경 시 1씩 증가 (caching·drift 추적)
643:| `offsetStart`·`offsetEnd` | integer | ✅ — **`ExtractedContent.rawBody` 내 위치 (AI3-06 — redaction 전 원본 기준)**. redacted view 위치는 별도 `redactedOffsetStart`·`redactedOffsetEnd` 필드 또는 mapping 계산 |
644:| `redactedOffsetStart`·`redactedOffsetEnd` | integer | optional — redaction 적용 후 view 내 위치 (null = redaction으로 사라진 영역). 재검수·false-positive 복원에 사용 |
645:| `contextHash` | string | ✅ — SHA-256(rawBody의 finding 주변 ±50자 context). 원문 보존 없이도 재현성 확인 가능 |
646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
648:| `redactionApplied` | boolean | ✅ |
649:| `redactionMode` | enum (`mask`·`remove`) | optional |
661:- promote transaction의 CAS 입력 (§ 8.2 3.a)
714:| `targetContentRef` | string | optional → ✅ when status="committed" | Core row @id. transaction 3.h에서 채움 |
715:| `status` | enum (`checking`·`pending-commit`·`committed`·`failed`) | ✅ | 4상태 머신 |
718:| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
724:| `failedAt` | Date | optional | |
728:**Index**: `(status, checkStartedAt)` partial where status='checking' (reconcile worker query), `(status, checkCompletedAt)` partial where status='pending-commit', `(assetId)`.
729:**Constraints**: `FK assetId ON DELETE RESTRICT`. status committed 시 targetContentRef NOT NULL invariant — § 13.4 reconcile.
741:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path .codex-reviews\\cm_cycle2_response.md -Pattern '\"summary\"|\"findings\"|\"cycle\"|\"review_target\"' -Context 0,4" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v0\\.2 동일|v0\\.4|다음 cycle|후속 cycle|open|풀 전개|6필드|8필드|notification-dispatch|cancellation-timeout|risk-based|Critical|High|priorReviewRequired\" docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"content-migration|content-migration-dry|run-paused|run-resumed|rollback-triggered|dry-run-completed|run-failed|plan-defined|plan-validated|step-skipped\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
 succeeded in 589ms:
21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) step별 rollbackClass 강제 + writeSetManifest partial write 감지, (c) read-only window writeClass 세분화, (d) dry-run/apply drift Merkle digest CAS, (e) policy-version-reevaluate risk-based reportingMode, (f) deterministic rule legalImpactClassifier fail-closed, (g) skip은 super-admin 명시 승인 + remediationTicketRef
140:          allowedWriteClasses: ["audit-append", "notification-emit-outbox", "notification-dispatch"]
153:        criticalClassFullDiff: true                     # CM2-22 — legal·PII·priorReviewRequired 대상은 full diff 강제
161:        defaultReportingMode: "risk-based"              # CM2-08 — risk-based | stale-flags-only | new-record-version
215:**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).
224:| dry-run-completed | reportId·6필드 digest·sampling 통계·blockedDriftCount | super-admin |
225:| run-started | mode·planId·expectedDryRunReportId·6필드 CAS·classifierVersion·policySnapshotDigest | super-admin |
286:  // 6필드 CAS (CM2-04 확장)
315:| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planId + ":" + expectedDryRunReportId + ":" + 6필드 + classifierVersion + legalImpactClassificationDigest) |
404:   - 6필드 digest 산정 + sampling (deterministic-stratified · legal/PII는 full diff)
411:   - 8필드 CAS 검증 (6필드 + legalImpactClassificationDigest + classifierVersion)
439:| pauseRun | running | step boundary에서 pause. cooperative cancellation 지원 step은 cancellation point까지 완료. 미지원 step은 stepTimeoutSeconds까지 대기 후 강제 `cancellation-timeout-manual-review` |
459:| `notification-dispatch` | notify() 발송 처리 | **허용** |
494:| `prior-review-required` | targetEntityTypes에 ComplianceRecord + priorReviewRequired 필드 영향 |
501:class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).
506:config.defaultReportingMode="risk-based":
510:4. check() 결과별 reportingMode 분기 (risk-based default):
511:   - LegalDocument·ReviewPolicy·PricingPage·priorReviewRequired 변화 또는 risk 상승 (High/Critical) → **new-record-version** 강제 (ComplianceRecord 새 recordVersion + REVIEW_WORKFLOW lifecycle 진입)
517:config로 reportingMode override 가능: `stale-flags-only` 또는 `new-record-version` 강제 — 단, override는 risk-based 기본보다 안전한 방향만 허용 (legal-reviewer 승인 필요 — 후속 cycle).
523:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일
537:| 6필드 CAS mismatch 차단율 | mismatch 발생 시 차단 | 100% |
542:| policy-reevaluate risk-based new-record-version 비율 | baseline | |
557:| INV-POLICY-REEVAL | reportingMode | LegalDocument·ReviewPolicy·priorReviewRequired·High/Critical → new-record-version 강제 |
558:| INV-COOP-CANCEL | cooperative cancellation | 미지원 step + timeout → cancellation-timeout-manual-review |
564:상세 acceptance test fixture는 v0.4·v0.5 cycle에서 traceability 표로 매핑.
600:- runApply 8필드 CAS 불일치
613:- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review`
660:### 10.1 open (v1.x·M2+ 후속)
683:| step type registry 본 문서 vs 별도 도큐먼트 | open — § 3.5 최소 계약을 본문에 포함. 구체 step type은 구현체 등록 |
684:| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
685:| § 12 풀 schema (CHECK·partial unique·FK·CAS column 전체 명시) | open — v0.4 cycle에서 풀 전개 |
695:| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |
699:## 12. DB 인벤토리 (10 tables — 최소 constraints, 풀 schema는 v0.4)
712:- 6필드 digest column NOT NULL
727:- status enum: pending·running·paused·completed·failed·cancelled·rollback-in-progress·blocked-manual-remediation-required·rolled-back·partial-rollback·rollback-failed·cancellation-timeout-manual-review
741:- worker SoT SQL: search-visibility § 13.5 패턴 (v0.4에서 풀 전개)
761:- per-record resultRef는 별도 row 또는 JSON array (정책 결정 v0.4)

 succeeded in 590ms:
508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
510:  | "content-migration-run-completed"
511:  | "content-migration-run-failed"
512:  | "content-migration-rollback-triggered";
556:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
557:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
558:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
559:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
687:  // `features/content-migration.md` 1차 cycle cascade (CM1-02·10)
688:  | "content-migration-plan-defined"          // plan 정의
689:  | "content-migration-plan-validated"        // plan 검증 (CM1-10)
690:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
691:  | "content-migration-run-started"           // apply 실행 시작
692:  | "content-migration-run-completed"
693:  | "content-migration-run-failed"
694:  | "content-migration-run-cancelled"
695:  | "content-migration-rollback-applied"
696:  | "content-migration-step-skipped";         // irreversible step skip (CM1-21)

 succeeded in 630ms:

> .codex-reviews\cm_cycle2_response.md:1953:  [7m"summary"[0m: {[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1954:    "blocking": 7,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1955:    "major": 11,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1956:    "minor": 5,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1957:    "overall_assessment": "v0.2는 1차 지적 대부분을 표면적으로는 반영했지만[0m
[7m[0m, 운영 가능한 v1.0 후보로 보기에는 핵심 알고리즘·DB 제약·legal gate 강제력·partial write 감지 계약이 아직 닫혀 있지 않[0m
[7m[0m다. 특히 dry-run/apply 6필드 CAS, irreversible rollback/skip, legalImpactClassifier, policy-version-reevaluate batch co[0m
[7m[0mntract는 이름은 추가됐지만 구현 불변식이 부족하다."[0m
> .codex-reviews\cm_cycle2_response.md:1997:  [7m"findings"[0m: [[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1998:    {[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:1999:      "id": "CM2-01",[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2000:      "severity": "blocking",[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2001:      "category": "dry-run-cas",[0m
> .codex-reviews\cm_cycle2_response.md:2335:  [7m"summary"[0m: {[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2336:    "blocking": 7,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2337:    "major": 11,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2338:    "minor": 5,[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2339:    "overall_assessment": "v0.2는 1차 지적 대부분을 표면적으로는 반영했지만[0m
[7m[0m, 운영 가능한 v1.0 후보로 보기에는 핵심 알고리즘·DB 제약·legal gate 강제력·partial write 감지 계약이 아직 닫혀 있지 않[0m
[7m[0m다. 특히 dry-run/apply 6필드 CAS, irreversible rollback/skip, legalImpactClassifier, policy-version-reevaluate batch co[0m
[7m[0mntract는 이름은 추가됐지만 구현 불변식이 부족하다."[0m
> .codex-reviews\cm_cycle2_response.md:2379:  [7m"findings"[0m: [[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2380:    {[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2381:      "id": "CM2-01",[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2382:      "severity": "blocking",[0m
[7m[0m  .codex-reviews\cm_cycle2_response.md:2383:      "category": "dry-run-cas",[0m


codex
{
  "summary": {
    "blocking": 8,
    "major": 9,
    "minor": 4,
    "overall_assessment": "v0.3는 v0.2의 핵심 결함 상당수를 문서 본문에 반영했지만, '전건 수용'으로 보기 어렵다. 특히 REVIEW_WORKFLOW cascade, StepRetryQueue worker SQL, DB constraints, cooperative cancellation fail policy는 명시적으로 다음 cycle로 미뤄져 있어 CM2 지적 일부가 재발했다. 신규로 추가된 8필드 CAS, writeSetManifest, deterministic legalImpactClassifier, risk-based policy reevaluate도 운영 가능한 API/DB/상태 전이 계약까지 닫히지 않았다.",
    "v0_3_readiness": "not_ready_for_v1_0"
  },
  "cm2_recheck": {
    "fixed": [
      "CM2-01",
      "CM2-02",
      "CM2-04",
      "CM2-08",
      "CM2-09",
      "CM2-10",
      "CM2-11",
      "CM2-13",
      "CM2-14",
      "CM2-15",
      "CM2-16",
      "CM2-17",
      "CM2-19",
      "CM2-21",
      "CM2-22",
      "CM2-23"
    ],
    "partially_fixed": [
      "CM2-03",
      "CM2-05",
      "CM2-06",
      "CM2-07",
      "CM2-12",
      "CM2-18",
      "CM2-20"
    ],
    "not_fixed": [],
    "note": "대부분은 본문 수준에서는 보강됐으나, partial_fixed 항목은 구현 SoT로 쓰기에는 여전히 핵심 계약이 빠져 있다."
  },
  "findings": [
    {
      "id": "CM3-01",
      "severity": "blocking",
      "category": "review-workflow-cascade",
      "title": "REVIEW_WORKFLOW AuditAction cascade가 완료되지 않았는데 v0.3은 CM2-12 전건 수용으로 표시한다",
      "evidence": [
        "content-migration §3.1 note는 dry-run-completed·run-paused·run-resumed·rollback-triggered cascade를 다음 cycle로 미룬다고 명시한다.",
        "content-migration §10.3도 AuditAction cascade를 open으로 둔다.",
        "REVIEW_WORKFLOW §10.2.1에는 content-migration-plan-defined, plan-validated, plan-legal-approved, run-started, run-completed, run-failed, run-cancelled, rollback-applied, step-skipped만 있다.",
        "REVIEW_WORKFLOW §10.2.1에는 dry-run-completed, run-paused, run-resumed, rollback-triggered가 없다."
      ],
      "impact": "명세 간 SoT가 불일치한다. content-migration은 13종 audit를 요구하지만 REVIEW_WORKFLOW canonical enum은 9종만 허용하므로 구현 시 audit insert가 schema validation에서 실패하거나, 반대로 고위험 command가 audit 없이 실행될 수 있다.",
      "recommendation": "REVIEW_WORKFLOW §10.2.1에 prefixed canonical action 4종을 즉시 cascade하라: content-migration-dry-run-completed, content-migration-run-paused, content-migration-run-resumed, content-migration-rollback-triggered. content-migration §3.1.1도 unprefixed 이름이 아니라 REVIEW_WORKFLOW canonical 이름을 사용하라."
    },
    {
      "id": "CM3-02",
      "severity": "blocking",
      "category": "cooperative-cancellation",
      "title": "cooperativeCancellation 미지원 step 정책이 'isolated chunk만 허용'과 'validate warning' 사이에서 모순된다",
      "evidence": [
        "§3.5는 supportsCooperativeCancellation=false면 isolated chunk만 허용한다고 설명한다.",
        "§4.1 validatePlan은 cooperativeCancellation 미지원 step + transactionBoundary != per-chunk를 validate warning으로 둔다.",
        "§9.3 migration-time validation도 같은 조건을 validate warning으로 둔다.",
        "§9.5는 cooperativeCancellation 미지원 step 1개 이상을 warning으로 둔다."
      ],
      "impact": "transactionBoundary=per-step인 장시간 step이 warning만 받고 apply에 들어갈 수 있다. pause/cancel 시 timeout 후 cancellation-timeout-manual-review로 떨어지지만, 이 상태에서 어떤 lock을 해제하고 어떤 partial write를 검사하며 어떻게 resume/rollback할지 닫혀 있지 않다.",
      "recommendation": "supportsCooperativeCancellation=false AND transactionBoundary!='per-chunk'는 validate fail로 승격하라. maxUninterruptibleSeconds > stepTimeoutSeconds 또는 read-only window 길이 초과도 fail로 둬라. cancellation-timeout-manual-review의 허용 command를 rollbackRun, skipStep, markStepCompensated, abortRun 중 무엇으로 둘지 상태 전이 표에 추가하라."
    },
    {
      "id": "CM3-03",
      "severity": "blocking",
      "category": "read-only-window",
      "title": "read-only window 중 notification-dispatch 허용은 외부 write를 허용하는 효과가 있다",
      "evidence": [
        "§2.3 readOnlyWindow.allowedWriteClasses에 notification-dispatch가 포함된다.",
        "§4.5 notification-dispatch는 notify() 발송 처리이며 기본 정책이 허용이다.",
        "REVIEW_WORKFLOW 알림은 email, inApp, Slack 등 외부 채널 발송을 포함한다."
      ],
      "impact": "read-only window는 내부 content mutation만 막고 외부 side effect는 계속 발생시킨다. email·Slack·webhook dispatch는 되돌릴 수 없는 외부 write이며, run이 실패하거나 rollback될 경우 잘못된 완료·승인·rollback 알림이 이미 발송될 수 있다.",
      "recommendation": "read-only window 중에는 notification-emit-outbox만 허용하고 dispatch는 high/critical operational safety event로 제한하거나 window 종료 후 claim되도록 nextAttemptAt을 밀어라. 즉시 dispatch가 필요한 이벤트는 eventType allowlist와 rollback 정정 알림 정책을 별도로 둬라."
    },
    {
      "id": "CM3-04",
      "severity": "blocking",
      "category": "policy-reevaluate",
      "title": "risk-based policy reevaluate가 의존하는 'risk 상승 High/Critical' 판정 계약이 없다",
      "evidence": [
        "§4.8은 check() 결과에서 LegalDocument·ReviewPolicy·PricingPage·priorReviewRequired 변화 또는 risk 상승 High/Critical이면 new-record-version을 강제한다고 한다.",
        "compliance-assistant의 ComplianceCheckResult는 RiskInference 기반 inferredRiskLevel과 findings를 다루지만 Critical RiskLevel을 SoT로 정의하지 않는다.",
        "REVIEW_WORKFLOW는 notification criticality와 content risk를 분리한다."
      ],
      "impact": "Critical이 알림 criticality인지 content risk인지 불명확하다. 또한 'risk 상승'을 판단하려면 기존 ComplianceRecord의 이전 risk snapshot과 새 check() 결과의 비교 규칙이 필요한데, §4.8에는 baseline source와 comparison algorithm이 없다.",
      "recommendation": "policy-reevaluate result contract를 별도 타입으로 닫아라. 예: previousRiskLevel, newRiskLevel, riskDelta, priorReviewRequiredChanged, legalEntityChanged, forcedReportingModeReason. Critical을 사용할 거면 RISK_LEVELS/ComplianceCheckResult에 cascade하고, 아니면 High만 사용하라."
    },
    {
      "id": "CM3-05",
      "severity": "blocking",
      "category": "legal-classifier",
      "title": "deterministic legalImpactClassifier는 8 class를 fail-closed로 닫기 위한 입력 SoT가 부족하다",
      "evidence": [
        "§4.7 pii 룰은 DATA_MODEL Core PII 필드 카탈로그를 참조하지만 DATA_MODEL에는 content-migration용 PII field catalog가 없다.",
        "§3.5 targetEntityTypes는 string[]이며 canonical enum이나 DATA_MODEL entity 매핑이 없다.",
        "§4.7 prior-review-required는 ComplianceRecord + priorReviewRequired 필드 영향으로 정의되지만, 실제 priorReviewRequired 산정 근거인 mediaThresholdAssessment·ReviewPolicy·before/after media 변화는 별도 class와 겹친다."
      ],
      "impact": "registered step이 targetEntityTypes나 read/write projection을 부정확하게 선언하면 deterministic classifier가 false negative를 낸다. known step type의 룰 매칭 실패만 unknownClassesEncountered=true로 닫는 구조라서, 잘못 선언된 known step은 fail-closed되지 않는다.",
      "recommendation": "targetEntityTypes와 field projection을 DATA_MODEL entity enum + field path enum으로 닫고, PII/legal/prior-review field catalog를 본 문서 또는 DATA_MODEL에 cascade하라. classifier는 step의 self-declared hints만 신뢰하지 말고 writeSetProjection과 mutableFieldAllowlist를 catalog against validation해야 한다."
    },
    {
      "id": "CM3-06",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12의 10 tables 최소 constraints는 동시 실행과 CAS를 DB에서 강제하기에 부족하다",
      "evidence": [
        "§12 제목은 최소 constraints라고 하지만 풀 schema는 v0.4로 미룬다.",
        "ContentMigrationRun은 solutionVersion integer만 CAS column으로 둔다.",
        "ContentMigrationDryRunReport는 6필드 digest column NOT NULL이라고만 하며 8필드 CAS 중 legalImpactClassificationDigest와 classifierVersion 저장 여부가 없다.",
        "ContentMigrationPlan은 FK 없음이라고만 하며 instanceId, idempotencyKey, requestFingerprint column이 명시되지 않는다."
      ],
      "impact": "runApply 8필드 CAS, idempotency replay, legal approval snapshot, dry-run expiry, concurrent run exclusion이 DB layer에서 검증되지 않는다. 구현자가 application code에만 의존하게 되어 race condition을 막기 어렵다.",
      "recommendation": "v0.3에서 최소가 아니라 executable schema 수준의 column/constraint 표를 제공하라. DryRunReport에는 8 CAS 입력의 저장 column을 둬라. Run에는 expectedDryRunReportId, requestFingerprint, status, solutionVersion, lockedAt을 두고 status CAS WHERE와 active-run partial unique를 명시하라."
    },
    {
      "id": "CM3-07",
      "severity": "blocking",
      "category": "retry-queue",
      "title": "ContentMigrationStepRetryQueue worker SQL이 다시 외부 참조와 v0.4 예고로 빠졌다",
      "evidence": [
        "§12.6은 worker SoT SQL을 search-visibility §13.5 패턴으로 참조하고 v0.4에서 풀 전개한다고 한다.",
        "§4.6은 NotificationOutbox SQL만 자체 전개한다.",
        "§1.2.1은 StepRetryQueue backoff만 요약하고 claim/complete/fail/exhausted SQL을 정의하지 않는다."
      ],
      "impact": "CM2-20의 '자체 전개' 요구가 notification outbox에만 적용되고 step retry queue는 미해결이다. retry exhausted vs autoRollbackOnFailure 우선순위가 worker 상태 전이와 연결되지 않아 failed-transient, failed-permanent, rollback trigger가 구현마다 달라진다.",
      "recommendation": "StepRetryQueue에 claim, success, transient fail backoff, exhausted transition, stale processing reclaim SQL을 §12.6에 포함하라. attempts, nextAttemptAt, lockedAt, lockedBy, lastError, exhaustedAt column과 partial unique를 함께 명시하라."
    },
    {
      "id": "CM3-08",
      "severity": "blocking",
      "category": "data-model-cascade",
      "title": "featureLegalApproved 명칭 변경이 DATA_MODEL C-08에 cascade되지 않았다",
      "evidence": [
        "content-migration §2.3은 contentMigrationConfig.featureLegalApproved를 사용한다.",
        "content-migration §9.1도 featureLegalApproved !== true를 build fail로 둔다.",
        "DATA_MODEL C-08 ContentMigrationConfig는 여전히 legalApproved, legalApprovedBy, legalApprovedAt을 필드로 정의한다."
      ],
      "impact": "InstanceManifest validation에서 content-migration과 DATA_MODEL이 서로 다른 필드명을 요구한다. 실제 config가 legalApproved를 쓰면 feature 문서 기준 build fail이고, featureLegalApproved를 쓰면 DATA_MODEL 기준 schema fail이다.",
      "recommendation": "DATA_MODEL C-08 v0.22 cascade로 featureLegalApproved, featureLegalApprovedBy, featureLegalApprovedAt으로 rename하거나, content-migration 문서를 DATA_MODEL의 legalApproved 명칭으로 되돌리고 plan-level approval과의 의미 분리만 설명하라."
    },
    {
      "id": "CM3-09",
      "severity": "major",
      "category": "api-usability",
      "title": "8필드 CAS를 매번 client가 산정·전달하는 API 부담이 닫혀 있지 않다",
      "evidence": [
        "§3.3 RunApplyInput은 expectedPlanFingerprint 등 8개 expected 필드를 client 입력으로 요구한다.",
        "§2.4는 targetSetDigest와 contentHashDigest를 chunked Merkle 또는 snapshot 기반으로 산정한다고 한다.",
        "§3.4 runApply requestFingerprint 설명은 여전히 '6필드 + classifierVersion + legalImpactClassificationDigest'라는 축약 표현을 쓴다."
      ],
      "impact": "UI/API client가 대량 row Merkle digest와 policy snapshot을 직접 계산할 수 없다. 서버가 계산한 DryRunReport 값을 client가 복사해 전달하는 형태라면 UX는 취약하고 replay/copy 오류가 많다.",
      "recommendation": "runApply는 expectedDryRunReportId와 dryRunReportVersion 또는 applyPreflightToken 하나만 받도록 축소하라. 서버가 DryRunReport에 저장된 8필드와 현재 재계산 값을 비교하고 audit에는 8필드를 기록하라. 외부 API에는 ETag/If-Match 스타일 token을 제공하라."
    },
    {
      "id": "CM3-10",
      "severity": "major",
      "category": "partial-write",
      "title": "writeSetManifest beforeDigest/afterDigest는 비용·스냅샷·예상 변경 검증 알고리즘이 부족하다",
      "evidence": [
        "§3.6은 beforeDigest와 afterDigest를 영향 row chunked Merkle로 기록한다고 한다.",
        "partial write 감지 조건은 afterDigest가 beforeDigest + 예상 변경과 일치해야 한다고만 표현한다.",
        "§2.4에는 dry-run digest 비용 상한이 있지만 writeSetManifest digest 비용 상한은 없다."
      ],
      "impact": "대량 row step에서 실행 전후 전체 hash를 두 번 계산하면 migration 자체보다 검증 비용이 커질 수 있다. 또한 MVCC snapshot, row ordering, changed field projection, expected after image 산정 방식이 없으면 afterDigest 검증은 재현 불가능하다.",
      "recommendation": "writeSetManifest는 step별 전략을 허용하라. 소량은 row-id full Merkle, 대량은 DB RETURNING 기반 changed row manifest + rowcount + invariant query + sampled digest, append-only는 high watermark, deterministic transform은 expectedAfterProjection hash로 분리하라. 비용 상한과 snapshot isolation level도 codex
{
  "reviewed_document": "docs/features/content-migration.md",
  "reviewed_version": "v0.4",
  "ready_for_v1_0": false,
  "cycle3_recheck": {
    "summary": "21개 중 상당수는 본문 또는 cascade에 반영됐지만, 일부는 형식상 반영에 그쳤고 v0.4 신규 메커니즘에서 재발했다.",
    "resolved": [
      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
      "CM3-03 read-only dispatchAllowlist 도입",
      "CM3-05/08 DATA_MODEL C-08 featureLegalApproved 및 catalog ref cascade",
      "CM3-13 LegalApproval dryRunReportId 및 digest snapshot 추가",
      "CM3-16 v0.2 동일 잔재 대부분 풀 전개",
      "CM3-19 AuditAction 공통 metadata required 추가"
    ],
    "partially_resolved_or_recurred": [
      "CM3-06 DB schema: 표는 늘었지만 executable schema 수준은 아님",
      "CM3-07 retry/outbox SQL: 전개됐지만 stale reclaim/exhaustion 전이가 깨짐",
      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
      "CM3-10 writeSetManifest: strategy는 생겼지만 append-only concurrency가 닫히지 않음",
      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
      "CM3-12 active unique: 동일 plan apply만 막고 dry-run/targetSet 동시성은 불명확",
      "CM3-15 stale-flags-only override: CHECK 조건은 생겼지만 legalEntityChanged 정의가 부족",
      "CM3-17 traceability: 표는 생겼지만 fixture matrix는 v0.5로 defer",
      "CM3-20 StepResult closed schema: DB CHECK와 app validator 경계가 불명확"
    ]
  },
  "findings": [
    {
      "id": "CM4-01",
      "severity": "blocking",
      "category": "apply-preflight-cas",
      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
      "evidence": [
        "§2.4는 applyPreflightToken을 HMAC char(64)로 정의한다.",
        "§3.5 runApply 1단계는 input.applyPreflightToken 디코딩으로 planId·dryRunReportId를 매칭한다고 한다.",
        "HMAC은 디코딩 가능한 token이 아니며 dryRunReportId를 복원할 수 없다."
      ],
      "impact": "구현자가 token lookup, signed envelope, opaque id 중 무엇을 써야 하는지 결정할 수 없다. 잘못 구현하면 CAS 검증 전 dryRunReport 매칭부터 실패하거나 token replay 처리가 흔들린다.",
      "recommendation": "둘 중 하나로 닫아라. (a) opaque token이면 DB에서 UNIQUE(applyPreflightToken) lookup 후 planId/dryRunReportId를 얻는다. (b) 디코딩이 필요하면 signed envelope/JWS에 planId·dryRunReportId·bundleHash를 넣고 서명 검증한다. 문서의 '디코딩' 표현과 schema를 일치시켜라."
    },
    {
      "id": "CM4-02",
      "severity": "major",
      "category": "apply-preflight-cost",
      "title": "8필드 server-side 재계산 비용과 cache invalidation 계약이 없다",
      "evidence": [
        "§3.5는 runApply 시 현재 시점 8필드를 모두 재계산한다고 한다.",
        "§2.4는 비용 상한을 §2.3 digest 설정으로만 둔다.",
        "legalImpactClassificationDigest와 classifierVersion 변경 감지는 '재계산 불일치'에 기대지만 classifier catalog 변경 event, cache key, invalidation trigger가 없다."
      ],
      "impact": "대량 targetSet/contentHash를 apply마다 full recompute하면 apply 시작 비용이 dry-run에 준할 수 있다. 반대로 cache를 쓰면 classifierVersion·piiFieldCatalogRef·entityFieldProjectionCatalogRef 변경 시 stale cache를 어떻게 무효화하는지 불명확하다.",
      "recommendation": "DryRunReport에 digestBundleHash와 per-digest computedAt/cacheKey를 저장하고, runApply는 변경 감지 ledger(source table watermark, policy/catalog version row, classifierVersion row)를 먼저 비교한 뒤 필요한 digest만 재계산하도록 명시하라. classifierRef/catalog ref 변경은 token invalidation event로 정의하라."
    },
    {
      "id": "CM4-03",
      "severity": "major",
      "category": "partial-write",
      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
      "evidence": [
        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
        "§3.6 strategy에는 watermarkField만 있고 writer/run identity, insertion range, unique source key, isolation requirement가 없다."
      ],
      "impact": "마이그레이션 중 다른 writer가 더 높은 watermark row를 삽입하면 watermark는 정상 증가하지만 해당 row가 expected set인지 외부 삽입인지 구분할 수 없다. append-only 테이블에서 partial write와 concurrent write가 섞여도 invariant가 통과할 수 있다.",
      "recommendation": "append-only strategy에 runId/sourceEventId 컬럼 또는 deterministic idempotency key를 요구하라. beforeWatermark 이후 inserted rows는 writer/run marker로 필터링하고, 외부 writer 허용 여부를 명시하라. 필요하면 target table advisory lock 또는 serializable transaction을 strategy prerequisite로 둬라."
    },
    {
      "id": "CM4-04",
      "severity": "blocking",
      "category": "state-machine",
      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
      "evidence": [
        "§12.4는 3개 enum을 분리했지만 유효 조합 CHECK가 없다.",
        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
        "§4.3 rollbackRun 결과에 'partial-rollback (remediationStatus)'라는 표현이 있으나 partial-rollback은 remediationStatus enum 값이 아니다."
      ],
      "impact": "상태 분해의 의도는 좋지만 DB가 불가능 상태를 허용한다. 운영 UI·worker·reconcile이 서로 다른 축 해석을 하면 rollback 완료, partial remediation, cancelled 상태가 충돌한다.",
      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
    },
    {
      "id": "CM4-05",
      "severity": "blocking",
      "category": "command-contract",
      "title": "markStepCompensated와 abortRun이 허용 command로 등장하지만 API·audit·idempotency 계약이 없다",
      "evidence": [
        "§4.3 cancellation-timeout-manual-review 허용 command에 rollbackRun·skipStep·markStepCompensated·abortRun이 있다.",
        "§3.1 엔트리포인트 표에는 markStepCompensated와 abortRun이 없다.",
        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
        "§10.1은 CM-10/CM-11을 open으로 둔다."
      ],
      "impact": "manual review 상태에서 복구 경로의 절반이 명세 밖 command다. 구현자는 권한, audit action, idempotency scope, 상태 전이, StepResult 갱신 방식을 알 수 없다.",
      "recommendation": "v1.0 후보라면 두 command를 §3.1·§3.4·§3.1.1·§4.3·§12에 추가하거나, 허용 command 표에서 제거하고 CM-10/CM-11을 v1.x open으로 명확히 내려라."
    },
    {
      "id": "CM4-06",
      "severity": "major",
      "category": "concurrency",
      "title": "active run partial unique가 dry-run/apply와 targetSet 동시성을 명확히 막지 못한다",
      "evidence": [
        "§4.1 runDryRun은 DryRunReport만 insert하고 ContentMigrationRun을 만들지 않는다.",
        "§12.4 ContentMigrationRun에는 mode enum dry-run·apply가 있지만 dry-run run 생성 흐름은 없다.",
        "§12.4 partial unique는 planId 기준 active run만 막는다."
      ],
      "impact": "동일 plan dry-run 중 apply가 가능한지, dry-run도 run table에 기록되는지 모순이다. 또한 같은 targetSetDigest를 공유하는 서로 다른 plan의 동시 apply는 막지 못한다. crm-sync의 partial unique 패턴처럼 DB가 핵심 동시성을 닫는 수준에 못 미친다.",
      "recommendation": "dry-run을 Run으로 모델링할지 DryRunReport 단독으로 둘지 선택하라. apply 충돌은 최소 planId active unique에 더해 targetSetDigest 또는 target lock table 기준으로 막아라. dry-run과 apply를 병행 허용한다면 CAS invalidation과 read-only window 정책을 별도로 명시하라."
    },
    {
      "id": "CM4-07",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 정의가 LegalDocument·ReviewPolicy·PricingPage 영향이라는 느슨한 설명에 머문다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 legalEntityChanged boolean을 둔다.",
        "§4.8은 legalEntityChanged=true를 'LegalDocument·ReviewPolicy·PricingPage 영향'으로 설명한다.",
        "stale-flags-only override CHECK는 no legal entity change를 필수 조건으로 삼는다."
      ],
      "impact": "legalEntityChanged가 법인 식별자 변경인지, 법무 검토 대상 entity 변경인지, 가격/후기 정책 변경인지 불명확하다. override CHECK의 핵심 조건이 구현자별로 달라질 수 있다.",
      "recommendation": "legalEntityChanged를 catalog 기반 predicate로 정의하라. 예: LegalDocument body/templateVersion/legalCounsel fields, ReviewPolicy legal exposure fields, PricingPage price/refund/disclaimer fields, ClinicProfile.legalEntityName/businessRegistrationNumber 등 필드 projection 목록과 before/after 비교 규칙을 entityFieldProjectionCatalogRef에 포함하라."
    },
    {
      "id": "CM4-08",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12는 executable schema라고 하지만 실제 DB DDL 수준의 FK·CHECK·partial unique를 닫지 못한다",
      "evidence": [
        "§12 각 테이블은 FK라고만 쓰고 참조 테이블/컬럼명과 ON DELETE 정책이 일부 생략되어 있다.",
        "§12.5 CHECK는 'contains_pii = true → export_allowed = false'처럼 SQL이 아닌 논리 표기다.",
        "JSON closed schema, 8필드 CAS bundle hash, legalGateRequired 조건부 FK는 DB CHECK로 표현되어 있지 않다.",
        "§12.9.1 ContentMigrationPolicyReevaluateRecord는 별도 row per ComplianceRecord라고 하면서 총 10 tables에는 포함하지 않는다."
      ],
      "impact": "구현자가 바로 migration DDL을 만들 수 없다. 특히 §12.9.1은 물리 테이블이면 총 11개이며, 아니면 JSON embedded인지 명시해야 한다.",
      "recommendation": "§12를 PostgreSQL 기준 DDL 또는 DDL-equivalent 표로 바꿔라. FK target, ON DELETE, CHECK SQL, partial index SQL, JSON schema enforcement 위치(DB/app)를 구분하고, PolicyReevaluateRecord가 실제 테이블이면 DB 인벤토리를 11 tables로 정정하라."
    },
    {
      "id": "CM4-09",
      "severity": "major",
      "category": "legal-approval",
      "title": "expectedLegalApprovalId null 허용은 맞지만 legalGateRequired와의 DB 정합성이 없다",
      "evidence": [
        "§12.4 expectedLegalApprovalId는 optional이며 legalGateRequired=true 시 required라고만 적혀 있다.",
        "legalGateRequired는 ContentMigrationPlan.legalImpactClassification JSON 안에 있다.",
        "§12.4에는 legalGateRequired=true일 때 expectedLegalApprovalId IS NOT NULL을 강제하는 CHECK 또는 trigger가 없다."
      ],
      "impact": "application validator를 우회하거나 race가 생기면 legal gate가 필요한 run이 approval 없이 저장될 수 있다. 반대로 legalGateRequired=false인 plan에 approvalId가 붙는 것도 금지되지 않는다.",
      "recommendation": "Run에 legalGateRequiredSnapshot boolean을 denormalize하고 CHECK를 둬라. 예: legalGateRequiredSnapshot=false이면 expectedLegalApprovalId IS NULL, true이면 NOT NULL. 또한 expectedLegalApprovalId가 같은 planId와 dryRunReportId를 가리키는 composite FK/trigger를 명시하라."
    },
    {
      "id": "CM4-10",
      "severity": "major",
      "category": "step-result",
      "title": "StepResult.status skipped의 처리 path가 invariant와 worker 전이에 연결되지 않는다",
      "evidence": [
        "§12.5 status enum에는 skipped가 있다.",
        "§4.3 skipStep은 rolling-back + blocked-manual-remediation-required에서만 허용된다.",
        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
      ],
      "impact": "skipped가 normal apply skip인지 rollback skip인지 구분되지 않는다. skipped step 이후 run이 completed인지 rolled-back(partial)인지, retry queue row가 있으면 어떻게 정리되는지 구현이 갈린다.",
      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
    },
    {
      "id": "CM4-11",
      "severity": "major",
      "category": "traceability",
      "title": "§6.2 traceability 표는 생겼지만 §6.3 fixture coverage가 v1.0 후보 수준이 아니다",
      "evidence": [
        "§6.2는 24개 invariant를 나열한다.",
        "§6.3은 4개 invariant 예시만 제공하고 상세 fixture matrix는 v0.5 cycle로 미룬다.",
        "본문은 'happy path만 명시'라고 쓰면서 일부 violation 예시를 섞어 표현도 일관되지 않다."
      ],
      "impact": "CAS, active unique, read-only dispatch, privacy export, catalog validation, outbox exhaustion 같은 핵심 safety rule이 acceptance fixture 없이 남는다.",
      "recommendation": "v1.0 후보라면 각 INV마다 최소 happy 1개와 violation 1개를 §6.3에 전개하라. fixture ID를 §9 fail rule과 양방향으로 연결하고 DB constraint-level test인지 application validator test인지 표시하라."
    },
    {
      "id": "CM4-12",
      "severity": "blocking",
      "category": "queue-sql",
      "title": "NotificationOutbox와 StepRetryQueue SQL의 stale reclaim/exhausted 전이가 row를 stuck 상태로 만들 수 있다",
      "evidence": [
        "§4.6 claim은 status='pending'만 조회한다.",
        "§4.6 stale reclaim은 processing row의 locked_at/locked_by만 null로 만들고 status를 pending으로 되돌리지 않는다.",
        "§12.6 StepRetryQueue도 동일하게 claim은 pending만 보고 stale reclaim은 status='processing'을 유지한다.",
        "transient fail이 먼저 status='pending'으로 되돌린 뒤 exhausted UPDATE를 별도로 수행하는 구조라 attempts>=maxAttempts row가 다시 claim될 수 있다."
      ],
      "impact": "worker가 죽은 processing row는 lockedAt이 null이어도 다시 claim되지 않는다. exhausted 판정 순서가 구현자마다 달라져 maxAttempts를 초과하거나 permanent 전이가 누락될 수 있다.",
      "recommendation": "stale reclaim은 status='pending', locked_at=null, locked_by=null로 되돌리거나 claim WHERE가 processing+stale도 잡도록 바꿔라. transient fail SQL은 attempts >= maxAttempts이면 exhausted/permanent로, 아니면 pending+nextAttemptAt으로 단일 UPDATE CASE 처리하라."
    },
    {
      "id": "CM4-13",
      "severity": "major",
      "category": "read-only-window",
      "title": "dispatchAllowlist가 read-only window의 외부 side effect 위험을 완전히 닫지 않는다",
      "evidence": [
        "§4.5는 notification-dispatch를 dispatchAllowlist 이벤트만 즉시 허용한다.",
        "default allowlist에는 plan-legal-approved, run-failed, rollback-triggered가 있다.",
        "dispatchAllowlist 이벤트의 외부 채널 idempotency, provider duplicate, rollback 시 취소 불가성은 별도 제약이 없다."
      ],
      "impact": "read-only window 중 email/slack/webhook 발송은 외부 write이며 rollback 불가능하다. high/critical operational이라는 이유만으로 허용하면 중복 발송·조기 법무승인 알림 같은 외부 부작용이 생긴다.",
      "recommendation": "allowlist 즉시 dispatch는 sourceEventId idempotency와 provider-level dedupe key를 required로 두고, plan-legal-approved는 read-only window 중 즉시 dispatch가 필요한지 재검토하라. 외부 발송 불가 환경에서는 outbox insert만 허용하고 dispatch는 window 종료 후 처리하는 옵션을 default로 삼아라."
    }
  ],
  "pattern_alignment": {
    "crm_sync_partial_unique": "부분 정합. crm-sync는 active·rotating-target·committed 각 상태를 DB partial unique로 직접 닫는다. content-migration은 planId active unique만 있어 동일 targetSet의 다른 plan apply와 dry-run/apply ambiguity를 닫지 못한다.",
    "asset_ingestion_body_mv_denylist": "대체로 반영됨. §3.6과 §9.3에 body MV denylist가 있으나, asset-ingestion의 rawBody + redaction operation 재생성 패턴처럼 정확한 field path와 허용 우회 경로가 더 필요하다.",
    "notifications_outbox_sql": "형태는 유사하나 현재 SQL은 stale processing row를 재claim하지 못하는 결함이 있어 notifications v1.0의 중복 방지/attempt 모델 수준과 일치하지 않는다."
  },
  "spec_consistency": {
    "one_page_summary_vs_inventory": "불일치. §0은 10 tables라고 하지만 §12.9.1이 실제 row-per-record 테이블이면 총 11 tables다.",
    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
    "old_version_residue": "명시적인 'v0.3 동일' 또는 'v0.2 동일' SoT 공백은 대부분 제거됐다. changelog의 v0.2 언급은 문제 아님."
  },
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.5",
      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
    },
    {
      "target": "docs/features/content-migration.md §3.7",
      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
    },
    {
      "target": "docs/features/content-migration.md §3.1, §3.4, §4.3, §10.1",
      "change": "markStepCompensated·abortRun을 정식 command로 승격하거나 허용 command에서 제거"
    },
    {
      "target": "docs/features/content-migration.md §4.3 and §12.4",
      "change": "Run 3축 유효 조합 matrix와 DB CHECK 추가"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "10 vs 11 table 인벤토리 정정 및 executable DDL 수준 FK/CHECK/partial index 명시"
    },
    {
      "target": "docs/features/content-migration.md §4.6 and §12.6",
      "change": "processing stale reclaim과 exhausted 전이를 단일 SQL/CASE로 수정"
    },
    {
      "target": "docs/features/content-migration.md §6.3",
      "change": "전체 INV별 happy/violation fixture matrix 전개"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "ApplyPreflightToken HMAC decode 모순",
      "manual review recovery command 2종이 명세 밖",
      "Run status 3축 유효 조합 미정",
      "§12 executable schema 및 table count 불일치",
      "outbox/retry worker SQL이 stuck row를 만들 수 있음",
      "acceptance fixture coverage 부족"
    ]
  }
}
tokens used
153,866
{
  "reviewed_document": "docs/features/content-migration.md",
  "reviewed_version": "v0.4",
  "ready_for_v1_0": false,
  "cycle3_recheck": {
    "summary": "21개 중 상당수는 본문 또는 cascade에 반영됐지만, 일부는 형식상 반영에 그쳤고 v0.4 신규 메커니즘에서 재발했다.",
    "resolved": [
      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
      "CM3-03 read-only dispatchAllowlist 도입",
      "CM3-05/08 DATA_MODEL C-08 featureLegalApproved 및 catalog ref cascade",
      "CM3-13 LegalApproval dryRunReportId 및 digest snapshot 추가",
      "CM3-16 v0.2 동일 잔재 대부분 풀 전개",
      "CM3-19 AuditAction 공통 metadata required 추가"
    ],
    "partially_resolved_or_recurred": [
      "CM3-06 DB schema: 표는 늘었지만 executable schema 수준은 아님",
      "CM3-07 retry/outbox SQL: 전개됐지만 stale reclaim/exhaustion 전이가 깨짐",
      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
      "CM3-10 writeSetManifest: strategy는 생겼지만 append-only concurrency가 닫히지 않음",
      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
      "CM3-12 active unique: 동일 plan apply만 막고 dry-run/targetSet 동시성은 불명확",
      "CM3-15 stale-flags-only override: CHECK 조건은 생겼지만 legalEntityChanged 정의가 부족",
      "CM3-17 traceability: 표는 생겼지만 fixture matrix는 v0.5로 defer",
      "CM3-20 StepResult closed schema: DB CHECK와 app validator 경계가 불명확"
    ]
  },
  "findings": [
    {
      "id": "CM4-01",
      "severity": "blocking",
      "category": "apply-preflight-cas",
      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
      "evidence": [
        "§2.4는 applyPreflightToken을 HMAC char(64)로 정의한다.",
        "§3.5 runApply 1단계는 input.applyPreflightToken 디코딩으로 planId·dryRunReportId를 매칭한다고 한다.",
        "HMAC은 디코딩 가능한 token이 아니며 dryRunReportId를 복원할 수 없다."
      ],
      "impact": "구현자가 token lookup, signed envelope, opaque id 중 무엇을 써야 하는지 결정할 수 없다. 잘못 구현하면 CAS 검증 전 dryRunReport 매칭부터 실패하거나 token replay 처리가 흔들린다.",
      "recommendation": "둘 중 하나로 닫아라. (a) opaque token이면 DB에서 UNIQUE(applyPreflightToken) lookup 후 planId/dryRunReportId를 얻는다. (b) 디코딩이 필요하면 signed envelope/JWS에 planId·dryRunReportId·bundleHash를 넣고 서명 검증한다. 문서의 '디코딩' 표현과 schema를 일치시켜라."
    },
    {
      "id": "CM4-02",
      "severity": "major",
      "category": "apply-preflight-cost",
      "title": "8필드 server-side 재계산 비용과 cache invalidation 계약이 없다",
      "evidence": [
        "§3.5는 runApply 시 현재 시점 8필드를 모두 재계산한다고 한다.",
        "§2.4는 비용 상한을 §2.3 digest 설정으로만 둔다.",
        "legalImpactClassificationDigest와 classifierVersion 변경 감지는 '재계산 불일치'에 기대지만 classifier catalog 변경 event, cache key, invalidation trigger가 없다."
      ],
      "impact": "대량 targetSet/contentHash를 apply마다 full recompute하면 apply 시작 비용이 dry-run에 준할 수 있다. 반대로 cache를 쓰면 classifierVersion·piiFieldCatalogRef·entityFieldProjectionCatalogRef 변경 시 stale cache를 어떻게 무효화하는지 불명확하다.",
      "recommendation": "DryRunReport에 digestBundleHash와 per-digest computedAt/cacheKey를 저장하고, runApply는 변경 감지 ledger(source table watermark, policy/catalog version row, classifierVersion row)를 먼저 비교한 뒤 필요한 digest만 재계산하도록 명시하라. classifierRef/catalog ref 변경은 token invalidation event로 정의하라."
    },
    {
      "id": "CM4-03",
      "severity": "major",
      "category": "partial-write",
      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
      "evidence": [
        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
        "§3.6 strategy에는 watermarkField만 있고 writer/run identity, insertion range, unique source key, isolation requirement가 없다."
      ],
      "impact": "마이그레이션 중 다른 writer가 더 높은 watermark row를 삽입하면 watermark는 정상 증가하지만 해당 row가 expected set인지 외부 삽입인지 구분할 수 없다. append-only 테이블에서 partial write와 concurrent write가 섞여도 invariant가 통과할 수 있다.",
      "recommendation": "append-only strategy에 runId/sourceEventId 컬럼 또는 deterministic idempotency key를 요구하라. beforeWatermark 이후 inserted rows는 writer/run marker로 필터링하고, 외부 writer 허용 여부를 명시하라. 필요하면 target table advisory lock 또는 serializable transaction을 strategy prerequisite로 둬라."
    },
    {
      "id": "CM4-04",
      "severity": "blocking",
      "category": "state-machine",
      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
      "evidence": [
        "§12.4는 3개 enum을 분리했지만 유효 조합 CHECK가 없다.",
        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
        "§4.3 rollbackRun 결과에 'partial-rollback (remediationStatus)'라는 표현이 있으나 partial-rollback은 remediationStatus enum 값이 아니다."
      ],
      "impact": "상태 분해의 의도는 좋지만 DB가 불가능 상태를 허용한다. 운영 UI·worker·reconcile이 서로 다른 축 해석을 하면 rollback 완료, partial remediation, cancelled 상태가 충돌한다.",
      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
    },
    {
      "id": "CM4-05",
      "severity": "blocking",
      "category": "command-contract",
      "title": "markStepCompensated와 abortRun이 허용 command로 등장하지만 API·audit·idempotency 계약이 없다",
      "evidence": [
        "§4.3 cancellation-timeout-manual-review 허용 command에 rollbackRun·skipStep·markStepCompensated·abortRun이 있다.",
        "§3.1 엔트리포인트 표에는 markStepCompensated와 abortRun이 없다.",
        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
        "§10.1은 CM-10/CM-11을 open으로 둔다."
      ],
      "impact": "manual review 상태에서 복구 경로의 절반이 명세 밖 command다. 구현자는 권한, audit action, idempotency scope, 상태 전이, StepResult 갱신 방식을 알 수 없다.",
      "recommendation": "v1.0 후보라면 두 command를 §3.1·§3.4·§3.1.1·§4.3·§12에 추가하거나, 허용 command 표에서 제거하고 CM-10/CM-11을 v1.x open으로 명확히 내려라."
    },
    {
      "id": "CM4-06",
      "severity": "major",
      "category": "concurrency",
      "title": "active run partial unique가 dry-run/apply와 targetSet 동시성을 명확히 막지 못한다",
      "evidence": [
        "§4.1 runDryRun은 DryRunReport만 insert하고 ContentMigrationRun을 만들지 않는다.",
        "§12.4 ContentMigrationRun에는 mode enum dry-run·apply가 있지만 dry-run run 생성 흐름은 없다.",
        "§12.4 partial unique는 planId 기준 active run만 막는다."
      ],
      "impact": "동일 plan dry-run 중 apply가 가능한지, dry-run도 run table에 기록되는지 모순이다. 또한 같은 targetSetDigest를 공유하는 서로 다른 plan의 동시 apply는 막지 못한다. crm-sync의 partial unique 패턴처럼 DB가 핵심 동시성을 닫는 수준에 못 미친다.",
      "recommendation": "dry-run을 Run으로 모델링할지 DryRunReport 단독으로 둘지 선택하라. apply 충돌은 최소 planId active unique에 더해 targetSetDigest 또는 target lock table 기준으로 막아라. dry-run과 apply를 병행 허용한다면 CAS invalidation과 read-only window 정책을 별도로 명시하라."
    },
    {
      "id": "CM4-07",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 정의가 LegalDocument·ReviewPolicy·PricingPage 영향이라는 느슨한 설명에 머문다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 legalEntityChanged boolean을 둔다.",
        "§4.8은 legalEntityChanged=true를 'LegalDocument·ReviewPolicy·PricingPage 영향'으로 설명한다.",
        "stale-flags-only override CHECK는 no legal entity change를 필수 조건으로 삼는다."
      ],
      "impact": "legalEntityChanged가 법인 식별자 변경인지, 법무 검토 대상 entity 변경인지, 가격/후기 정책 변경인지 불명확하다. override CHECK의 핵심 조건이 구현자별로 달라질 수 있다.",
      "recommendation": "legalEntityChanged를 catalog 기반 predicate로 정의하라. 예: LegalDocument body/templateVersion/legalCounsel fields, ReviewPolicy legal exposure fields, PricingPage price/refund/disclaimer fields, ClinicProfile.legalEntityName/businessRegistrationNumber 등 필드 projection 목록과 before/after 비교 규칙을 entityFieldProjectionCatalogRef에 포함하라."
    },
    {
      "id": "CM4-08",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12는 executable schema라고 하지만 실제 DB DDL 수준의 FK·CHECK·partial unique를 닫지 못한다",
      "evidence": [
        "§12 각 테이블은 FK라고만 쓰고 참조 테이블/컬럼명과 ON DELETE 정책이 일부 생략되어 있다.",
        "§12.5 CHECK는 'contains_pii = true → export_allowed = false'처럼 SQL이 아닌 논리 표기다.",
        "JSON closed schema, 8필드 CAS bundle hash, legalGateRequired 조건부 FK는 DB CHECK로 표현되어 있지 않다.",
        "§12.9.1 ContentMigrationPolicyReevaluateRecord는 별도 row per ComplianceRecord라고 하면서 총 10 tables에는 포함하지 않는다."
      ],
      "impact": "구현자가 바로 migration DDL을 만들 수 없다. 특히 §12.9.1은 물리 테이블이면 총 11개이며, 아니면 JSON embedded인지 명시해야 한다.",
      "recommendation": "§12를 PostgreSQL 기준 DDL 또는 DDL-equivalent 표로 바꿔라. FK target, ON DELETE, CHECK SQL, partial index SQL, JSON schema enforcement 위치(DB/app)를 구분하고, PolicyReevaluateRecord가 실제 테이블이면 DB 인벤토리를 11 tables로 정정하라."
    },
    {
      "id": "CM4-09",
      "severity": "major",
      "category": "legal-approval",
      "title": "expectedLegalApprovalId null 허용은 맞지만 legalGateRequired와의 DB 정합성이 없다",
      "evidence": [
        "§12.4 expectedLegalApprovalId는 optional이며 legalGateRequired=true 시 required라고만 적혀 있다.",
        "legalGateRequired는 ContentMigrationPlan.legalImpactClassification JSON 안에 있다.",
        "§12.4에는 legalGateRequired=true일 때 expectedLegalApprovalId IS NOT NULL을 강제하는 CHECK 또는 trigger가 없다."
      ],
      "impact": "application validator를 우회하거나 race가 생기면 legal gate가 필요한 run이 approval 없이 저장될 수 있다. 반대로 legalGateRequired=false인 plan에 approvalId가 붙는 것도 금지되지 않는다.",
      "recommendation": "Run에 legalGateRequiredSnapshot boolean을 denormalize하고 CHECK를 둬라. 예: legalGateRequiredSnapshot=false이면 expectedLegalApprovalId IS NULL, true이면 NOT NULL. 또한 expectedLegalApprovalId가 같은 planId와 dryRunReportId를 가리키는 composite FK/trigger를 명시하라."
    },
    {
      "id": "CM4-10",
      "severity": "major",
      "category": "step-result",
      "title": "StepResult.status skipped의 처리 path가 invariant와 worker 전이에 연결되지 않는다",
      "evidence": [
        "§12.5 status enum에는 skipped가 있다.",
        "§4.3 skipStep은 rolling-back + blocked-manual-remediation-required에서만 허용된다.",
        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
      ],
      "impact": "skipped가 normal apply skip인지 rollback skip인지 구분되지 않는다. skipped step 이후 run이 completed인지 rolled-back(partial)인지, retry queue row가 있으면 어떻게 정리되는지 구현이 갈린다.",
      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
    },
    {
      "id": "CM4-11",
      "severity": "major",
      "category": "traceability",
      "title": "§6.2 traceability 표는 생겼지만 §6.3 fixture coverage가 v1.0 후보 수준이 아니다",
      "evidence": [
        "§6.2는 24개 invariant를 나열한다.",
        "§6.3은 4개 invariant 예시만 제공하고 상세 fixture matrix는 v0.5 cycle로 미룬다.",
        "본문은 'happy path만 명시'라고 쓰면서 일부 violation 예시를 섞어 표현도 일관되지 않다."
      ],
      "impact": "CAS, active unique, read-only dispatch, privacy export, catalog validation, outbox exhaustion 같은 핵심 safety rule이 acceptance fixture 없이 남는다.",
      "recommendation": "v1.0 후보라면 각 INV마다 최소 happy 1개와 violation 1개를 §6.3에 전개하라. fixture ID를 §9 fail rule과 양방향으로 연결하고 DB constraint-level test인지 application validator test인지 표시하라."
    },
    {
      "id": "CM4-12",
      "severity": "blocking",
      "category": "queue-sql",
      "title": "NotificationOutbox와 StepRetryQueue SQL의 stale reclaim/exhausted 전이가 row를 stuck 상태로 만들 수 있다",
      "evidence": [
        "§4.6 claim은 status='pending'만 조회한다.",
        "§4.6 stale reclaim은 processing row의 locked_at/locked_by만 null로 만들고 status를 pending으로 되돌리지 않는다.",
        "§12.6 StepRetryQueue도 동일하게 claim은 pending만 보고 stale reclaim은 status='processing'을 유지한다.",
        "transient fail이 먼저 status='pending'으로 되돌린 뒤 exhausted UPDATE를 별도로 수행하는 구조라 attempts>=maxAttempts row가 다시 claim될 수 있다."
      ],
      "impact": "worker가 죽은 processing row는 lockedAt이 null이어도 다시 claim되지 않는다. exhausted 판정 순서가 구현자마다 달라져 maxAttempts를 초과하거나 permanent 전이가 누락될 수 있다.",
      "recommendation": "stale reclaim은 status='pending', locked_at=null, locked_by=null로 되돌리거나 claim WHERE가 processing+stale도 잡도록 바꿔라. transient fail SQL은 attempts >= maxAttempts이면 exhausted/permanent로, 아니면 pending+nextAttemptAt으로 단일 UPDATE CASE 처리하라."
    },
    {
      "id": "CM4-13",
      "severity": "major",
      "category": "read-only-window",
      "title": "dispatchAllowlist가 read-only window의 외부 side effect 위험을 완전히 닫지 않는다",
      "evidence": [
        "§4.5는 notification-dispatch를 dispatchAllowlist 이벤트만 즉시 허용한다.",
        "default allowlist에는 plan-legal-approved, run-failed, rollback-triggered가 있다.",
        "dispatchAllowlist 이벤트의 외부 채널 idempotency, provider duplicate, rollback 시 취소 불가성은 별도 제약이 없다."
      ],
      "impact": "read-only window 중 email/slack/webhook 발송은 외부 write이며 rollback 불가능하다. high/critical operational이라는 이유만으로 허용하면 중복 발송·조기 법무승인 알림 같은 외부 부작용이 생긴다.",
      "recommendation": "allowlist 즉시 dispatch는 sourceEventId idempotency와 provider-level dedupe key를 required로 두고, plan-legal-approved는 read-only window 중 즉시 dispatch가 필요한지 재검토하라. 외부 발송 불가 환경에서는 outbox insert만 허용하고 dispatch는 window 종료 후 처리하는 옵션을 default로 삼아라."
    }
  ],
  "pattern_alignment": {
    "crm_sync_partial_unique": "부분 정합. crm-sync는 active·rotating-target·committed 각 상태를 DB partial unique로 직접 닫는다. content-migration은 planId active unique만 있어 동일 targetSet의 다른 plan apply와 dry-run/apply ambiguity를 닫지 못한다.",
    "asset_ingestion_body_mv_denylist": "대체로 반영됨. §3.6과 §9.3에 body MV denylist가 있으나, asset-ingestion의 rawBody + redaction operation 재생성 패턴처럼 정확한 field path와 허용 우회 경로가 더 필요하다.",
    "notifications_outbox_sql": "형태는 유사하나 현재 SQL은 stale processing row를 재claim하지 못하는 결함이 있어 notifications v1.0의 중복 방지/attempt 모델 수준과 일치하지 않는다."
  },
  "spec_consistency": {
    "one_page_summary_vs_inventory": "불일치. §0은 10 tables라고 하지만 §12.9.1이 실제 row-per-record 테이블이면 총 11 tables다.",
    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
    "old_version_residue": "명시적인 'v0.3 동일' 또는 'v0.2 동일' SoT 공백은 대부분 제거됐다. changelog의 v0.2 언급은 문제 아님."
  },
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.5",
      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
    },
    {
      "target": "docs/features/content-migration.md §3.7",
      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
    },
    {
      "target": "docs/features/content-migration.md §3.1, §3.4, §4.3, §10.1",
      "change": "markStepCompensated·abortRun을 정식 command로 승격하거나 허용 command에서 제거"
    },
    {
      "target": "docs/features/content-migration.md §4.3 and §12.4",
      "change": "Run 3축 유효 조합 matrix와 DB CHECK 추가"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "10 vs 11 table 인벤토리 정정 및 executable DDL 수준 FK/CHECK/partial index 명시"
    },
    {
      "target": "docs/features/content-migration.md §4.6 and §12.6",
      "change": "processing stale reclaim과 exhausted 전이를 단일 SQL/CASE로 수정"
    },
    {
      "target": "docs/features/content-migration.md §6.3",
      "change": "전체 INV별 happy/violation fixture matrix 전개"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "ApplyPreflightToken HMAC decode 모순",
      "manual review recovery command 2종이 명세 밖",
      "Run status 3축 유효 조합 미정",
      "§12 executable schema 및 table count 불일치",
      "outbox/retry worker SQL이 stuck row를 만들 수 있음",
      "acceptance fixture coverage 부족"
    ]
  }
}
cade"
    },
    {
      "target": "docs/core/DATA_MODEL.md C-08",
      "change": "ContentMigrationConfig legalApproved vs featureLegalApproved 명칭 정합"
    },
    {
      "target": "docs/features/content-migration.md §3.5, §4.1, §9.3",
      "change": "cooperativeCancellation 미지원 + transactionBoundary != per-chunk를 validate fail로 승격하고 cancellation-timeout-manual-review 복구 경로 정의"
    },
    {
      "target": "docs/features/content-migration.md §4.5, §4.6, §12.10",
      "change": "read-only window 중 notification-dispatch 허용 범위 축소 및 outbox backoff/claim SQL 전개"
    },
    {
      "target": "docs/features/content-migration.md §4.8 + compliance-assistant contract",
      "change": "riskDelta/new-record-version 판정 입력·출력 타입 정의, Critical 용어 정합"
    },
    {
      "target": "docs/features/content-migration.md §12.1-§12.10",
      "change": "10 tables 풀 schema 수준의 FK/CHECK/partial unique/CAS/idempotency/requestFingerprint columns 전개"
    },
    {
      "target": "docs/features/content-migration.md §12.6",
      "change": "ContentMigrationStepRetryQueue worker SQL 자체 전개"
    },
    {
      "target": "docs/features/content-migration.md §5.1, §5.3, §4.4",
      "change": "v0.2 동일 표현 제거 및 NotificationEvent/retry 우선순위 표 재전개"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "REVIEW_WORKFLOW AuditAction cascade incomplete",
      "cooperative cancellation unsupported-step policy contradictory",
      "notification-dispatch external side effects allowed during read-only window",
      "policy-reevaluate risk-based decision contract absent",
      "legalImpactClassifier input catalogs not canonical",
      "DB constraints insufficient for 8-field CAS and concurrent run safety",
      "StepRetryQueue worker SQL absent",
      "DATA_MODEL C-08 config field name mismatch"
    ]
  }
}


 succeeded in 1328ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.22
> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
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
| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
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
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)

솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |

> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.

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
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


codex
대상 문서는 읽혔고, 3차 지적의 상당수는 표면적으로 반영되어 있습니다. 이제 모순 가능성이 큰 §3.5, §3.7, §4.3, §4.8, §6.2, §12를 좁혀서 원문 기준으로 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.5|3\\.7|4\\.3|4\\.8|6\\.2|6\\.3|12\\.4|12\\.5|append-only-watermark|markStepCompensated|abortRun|legalEntityChanged|ApplyPreflightToken|writeSetManifest|active run|stale-flags|v0\\.2|v0\\.3 동일|§ .*동일\" docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"content-migration-(dry-run-completed|run-paused|run-resumed|rollback-triggered|run-failed)|NotificationEventType|content-migration\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ContentMigrationConfig|featureLegalApproved|piiFieldCatalogRef|entityFieldProjectionCatalogRef|contentMigrationPolicyVersion\" docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"body materialized|mutableFieldDenylist|direct|MV|materialized view|denylist\" docs\\features\\asset-ingestion.md docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"nextAttemptAt|attempts|exhausted|NotificationOutbox|outbox\" docs\\features\\content-migration.md docs\\features\\notifications.md" in C:\Users\assag\solution\website-exposure
 succeeded in 760ms:
4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
727:| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
731:| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
732:| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |

 succeeded in 781ms:
464:### 9.1 NotificationEventType enum (canonical SoT)
467:type NotificationEventType =
508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
510:  | "content-migration-run-completed"
511:  | "content-migration-run-failed"
512:  | "content-migration-rollback-triggered";
556:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
557:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
558:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
559:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
578:  eventType: NotificationEventType;                    // § 9.1 enum
595:  eventType: NotificationEventType;
687:  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
688:  | "content-migration-plan-defined"          // plan 정의
689:  | "content-migration-plan-validated"        // plan 검증
690:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
691:  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
692:  | "content-migration-run-started"           // apply 실행 시작
693:  | "content-migration-run-paused"            // CM3-01
694:  | "content-migration-run-resumed"           // CM3-01
695:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
696:  | "content-migration-run-completed"
697:  | "content-migration-run-failed"
698:  | "content-migration-run-cancelled"
699:  | "content-migration-rollback-applied"
700:  | "content-migration-step-skipped";         // irreversible step skip (CM1-21)

 succeeded in 813ms:
10:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
53:| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
55:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
63:- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
65:- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
66:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
108:| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
115:contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
171:        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
218:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
243:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
264:CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.
311:  applyPreflightToken: string;                          // server에서 dry-run 후 발급 (§ 3.5)
349:  legalEntityChanged: boolean;
350:  forcedReportingMode: "stale-flags-only" | "new-record-version";
381:### 3.5 ApplyPreflightToken (CM3-09)
425:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
431:### 3.7 writeSetManifest (CM2-06 + CM3-10)
444:  highWatermark?: { before: string; after: string };    // append-only-watermark
457:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
476:  writeSetManifest: WriteSetManifest;
486:| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |
508:   - applyPreflightToken 발급 (§ 3.5)
514:   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
517:   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
520:   - step 순차 — writeSetManifest 기록
539:### 4.3 pause / resume / cancel state transition
553:- 허용 command: `rollbackRun`·`skipStep`·`markStepCompensated`·`abortRun` (CM3-02)
642:### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)
654:   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
658:   - legalEntityChanged=true (LegalDocument·ReviewPolicy·PricingPage 영향) → new-record-version 강제
659:   - 그 외 → stale-flags-only 허용
662:   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
701:| ApplyPreflightToken mismatch 차단율 | 100% | |
714:### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)
718:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
725:| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
733:| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
743:### 6.3 acceptance fixture (CM3-17 — happy path + violation path 최소 1쌍)
761:  happy: low risk wording change → stale-flags-only
793:- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
808:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
813:- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
817:- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
821:- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
822:- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
884:| CM-10 | abortRun command — cancellation-timeout-manual-review에서 (CM3-02 신규) |
885:| CM-11 | markStepCompensated command — manual remediation 후 compensation 적용 표시 |
891:| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
899:| § 6.3 acceptance fixture violation path 풀 정의 | open — v0.5 cycle |
909:| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
972:### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)
995:### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)
1012:| `writeSetManifest` | JSON (§ 3.7) | optional |
1135:| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |
1136:| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
1166:**총 10개 admin DB 테이블 (§ 12.1·12.2·12.3·12.4·12.5·12.6·12.7·12.8·12.9·12.10)** — § 12.9.1은 § 12.9 batch 부속.

 succeeded in 753ms:
docs\features\content-migration.md:14:> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개
docs\features\content-migration.md:73:| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |
docs\features\content-migration.md:144:          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
docs\features\content-migration.md:556:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)
docs\features\content-migration.md:560:| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
docs\features\content-migration.md:561:| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
docs\features\content-migration.md:562:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
docs\features\content-migration.md:563:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
docs\features\content-migration.md:564:| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |
docs\features\content-migration.md:573:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
docs\features\content-migration.md:574:| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
docs\features\content-migration.md:581:### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)
docs\features\content-migration.md:586:  SELECT id FROM content_migration_notification_outbox
docs\features\content-migration.md:591:UPDATE content_migration_notification_outbox o
docs\features\content-migration.md:592:SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()
docs\features\content-migration.md:596:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:601:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:603:    next_attempt_at = now() + (interval '1 second' * (CASE attempts
docs\features\content-migration.md:607:-- exhausted (attempts >= 5)
docs\features\content-migration.md:608:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:610:WHERE id=$id AND attempts >= 5;
docs\features\content-migration.md:614:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:681:### 5.2 outbox — § 4.6 SQL
docs\features\content-migration.md:712:| outbox 발송 성공율 | > 99% | |
docs\features\content-migration.md:730:| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
docs\features\content-migration.md:731:| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
docs\features\content-migration.md:823:- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
docs\features\content-migration.md:846:- step retry exhausted → § 4.4
docs\features\content-migration.md:850:- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
docs\features\content-migration.md:861:  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox
docs\features\content-migration.md:911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs\features\content-migration.md:1026:| `attempts` | integer | ✅ |
docs\features\content-migration.md:1028:| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
docs\features\content-migration.md:1029:| `nextAttemptAt` | Date | ✅ |
docs\features\content-migration.md:1032:| `exhaustedAt` | Date | optional |
docs\features\content-migration.md:1049:SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
docs\features\content-migration.md:1055:    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
docs\features\content-migration.md:1066:-- exhausted
docs\features\content-migration.md:1068:SET status='exhausted', exhausted_at=now(), locked_at=null
docs\features\content-migration.md:1069:WHERE id=$id AND attempts >= max_attempts;
docs\features\content-migration.md:1142:### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)
docs\features\content-migration.md:1153:| `attempts` | integer | ✅ default 0 |
docs\features\content-migration.md:1154:| `nextAttemptAt` | Date | ✅ |
docs\features\notifications.md:167:      attempts: number;
docs\features\notifications.md:178:    attempts: number;

 succeeded in 780ms:
docs\features\content-migration.md:22:- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
docs\features\content-migration.md:80:| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
docs\features\content-migration.md:81:| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
docs\features\content-migration.md:110:| asset-ingestion | promote handoff + body MV 보호 |
docs\features\content-migration.md:261:design token 변경·brand 변경 시 콘텐츠 일괄 재생성. **asset-ingestion body MV는 변경 금지** (mutableFieldDenylist).
docs\features\content-migration.md:267:asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계. step 필수: `redirect-map-apply`·`slug-preserve`·`compliance-history-link`.
docs\features\content-migration.md:418:  mutableFieldDenylist?: string[];                      // asset-ingestion body MV 포함
docs\features\content-migration.md:429:asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.
docs\features\content-migration.md:739:| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
docs\features\content-migration.md:841:- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\features\asset-ingestion.md:622:### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)
docs\features\asset-ingestion.md:626:- **`body`** (Markdown — **materialized view**: rawBody + AssetPiiFinding(reviewStatus="true-positive" AND redactionApplied=true) redaction operations로 자동 재생성). **직접 편집 금지** (AI4-09). 수동 redaction은 detector="manual"인 AssetPiiFinding 추가로 수행 → body는 redaction worker가 재생성

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content docs\\features\\content-migration.md | Select-Object -Skip 375 -First 110" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content docs\\features\\content-migration.md | Select-Object -Skip 530 -First 150" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content docs\\features\\content-migration.md | Select-Object -Skip 700 -First 70" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content docs\\features\\content-migration.md | Select-Object -Skip 960 -First 210" in C:\Users\assag\solution\website-exposure
 succeeded in 706ms:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition

| 호출 | primaryStatus 전제 | 동작 | 결과 status |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point까지 완료 후 pause | paused |
| resumeRun | paused | 다음 step부터 진행 | running |
| cancelRun | pending | step 미진행 | cancelled |
| cancelRun | running | cooperative cancellation 요청. 종료 후 partial commit 검사. non-compensated partial write 발견 시 자동 rollback (autoRollbackOnFailure 무시) | cancelled 또는 rolling-back |
| cancelRun | paused | partial commit 검사 동일 | cancelled 또는 rolling-back |
| rollbackRun | completed·failed·cancelled·paused | reverse 시작 | rolling-back → rolled-back / partial-rollback (remediationStatus) |
| skipStep | rolling-back + remediationStatus=blocked-manual-remediation-required | irreversible step skip | rolling-back 유지 (다음 step 처리) |

**cancellation-timeout-manual-review** (CM3-02 — remediationStatus):
- 진입: pauseRun 후 cooperative cancellation 미지원 step + stepTimeoutSeconds 도달
- 허용 command: `rollbackRun`·`skipStep`·`markStepCompensated`·`abortRun` (CM3-02)
- lock 해제: 별도 cleanup worker가 step row lock 해제 후 partial commit 검사 → remediationStatus 유지

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
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
5. forcedReportingMode 결정:
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - legalEntityChanged=true (LegalDocument·ReviewPolicy·PricingPage 영향) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.9.1)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |


 succeeded in 712ms:
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef + affectedRowsConfirmation) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert (8필드 digest 포함)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64)
3. client에 token 반환

runApply(input) — server:
1. input.applyPreflightToken 디코딩 → planId·dryRunReportId 매칭
2. DryRunReport에서 8필드 bundle 재추출
3. 현재 시점 재계산 — 8필드 모두 일치해야 진행
4. 불일치 시 → re-dry-run 강제 (CAS fail)
5. token expiresAt(retentionDays.dryRunReport) 초과 시 → CAS fail
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

// CM3-10 — strategy 분기
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }     // 소량: row-id full Merkle
  | { kind: "chunked-returning"; chunkSize: number }    // 대량: DB RETURNING + rowcount + invariant + sampled digest
  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };  // expected after image
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
- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
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

 succeeded in 726ms:
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

### 6.3 acceptance fixture (CM3-17 — happy path + violation path 최소 1쌍)

각 invariant별 fixture는 다음 패턴으로 v0.5에서 풀 정의. v0.4는 happy path만 명시:

```
INV-CAS-PREFLIGHT-TOKEN:
  happy: dry-run 후 즉시 apply — token 일치
  violation: dry-run 후 30분 대기 — targetSet 변경 → token mismatch → 409

INV-LEGAL-UNKNOWN-CLASS:
  happy: 모든 step registry 등록 + catalog 매칭 → classification 성공
  violation: unknown step type → fail-closed

INV-ROLLBACK-IRREVERSIBLE:
  happy: 모든 step reversible — full rollback
  violation: irreversible step 포함 → blocked-manual-remediation-required → skipStep 후 partial

INV-POLICY-REEVAL-RISK:
  happy: low risk wording change → stale-flags-only
  violation: priorReviewRequired change → new-record-version 강제
```

상세 fixture matrix는 v0.5 cycle에서 완성 — INV × happy/violation × DB constraint level.

---

## 7. compliance-assistant 예외


 succeeded in 736ms:
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

**Constraints**: `UNIQUE(runId, stepKey)`. `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`. `CHECK (contains_pii = true → export_allowed = false)`.
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

#### 12.9.1 `ContentMigrationPolicyReevaluateRecord`

(별도 row per ComplianceRecord) — CM3-04 PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
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

**총 10개 admin DB 테이블 (§ 12.1·12.2·12.3·12.4·12.5·12.6·12.7·12.8·12.9·12.10)** — § 12.9.1은 § 12.9 batch 부속.

codex
{
  "review_target": "docs/features/content-migration.md v0.4",
  "review_cycle": 4,
  "finding_prefix": "CM4-",
  "ready_for_v1_0": false,
  "third_cycle_recheck": {
    "total_cm3_findings": 21,
    "fully_resolved": [
      "CM3-01",
      "CM3-03",
      "CM3-04",
      "CM3-05",
      "CM3-07",
      "CM3-08",
      "CM3-13",
      "CM3-14",
      "CM3-16",
      "CM3-18",
      "CM3-19",
      "CM3-20",
      "CM3-21"
    ],
    "partially_resolved_or_regressed": [
      "CM3-02",
      "CM3-06",
      "CM3-09",
      "CM3-10",
      "CM3-11",
      "CM3-12",
      "CM3-15",
      "CM3-17"
    ],
    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
  },
  "findings": [
    {
      "id": "CM4-01",
      "severity": "blocking",
      "category": "cas-token",
      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
      "evidence": [
        "§2.4: applyPreflightToken = HMAC(...). char(64)",
        "§3.3 RunApplyInput은 planId + applyPreflightToken만 받는다.",
        "§3.5 runApply 1단계는 input.applyPreflightToken 디코딩 → planId·dryRunReportId 매칭이라고 한다."
      ],
      "impact": "HMAC digest는 opaque 값이라 dryRunReportId를 디코딩할 수 없다. UNIQUE(applyPreflightToken) lookup으로 역조회할 수는 있지만, 그 경우 §3.5 알고리즘과 API 계약이 틀린다. dry-run report 식별, 만료 검사, legal approval 연결이 구현자마다 갈릴 수 있다.",
      "recommendation": "RunApplyInput에 dryRunReportId를 명시하거나, token lookup 방식으로 고정하라. 예: input = { planId, dryRunReportId, applyPreflightToken }. 서버는 DryRunReport(planId, dryRunReportId)를 조회한 뒤 token 재계산 비교 + 8필드 current recompute를 수행한다."
    },
    {
      "id": "CM4-02",
      "severity": "major",
      "category": "cas-cost",
      "title": "8필드 server-side 재계산 비용과 cache invalidation 경계가 닫히지 않았다",
      "evidence": [
        "§3.5 runApply는 현재 시점 8필드 모두 재계산해야 한다.",
        "§2.4는 비용 상한을 §2.3 digest로만 참조한다.",
        "legalImpactClassificationDigest와 classifierVersion 변경 감지는 policyVersionSnapshot mismatch 또는 token mismatch라고만 간접 표현된다."
      ],
      "impact": "대규모 targetSetDigest/contentHashDigest/sourceSnapshotWatermark를 apply마다 full recompute하면 apply 시작 비용이 과도해질 수 있다. 반대로 cache를 쓰면 classifierVersion, catalog ref, rule hash 변경 시 invalidation 기준이 필요하다.",
      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
    },
    {
      "id": "CM4-03",
      "severity": "blocking",
      "category": "partial-write",
      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
      "evidence": [
        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
        "§3.7 partial write 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
        "isolationLevel은 기록 필드일 뿐 strategy별 요구 isolation/advisory lock이 없다."
      ],
      "impact": "append-only table에서 다른 worker가 같은 watermark 범위에 row를 삽입하면 watermark는 역행하지 않는다. high watermark만으로는 expected row set과 concurrent insert를 구분할 수 없어 partial write 또는 과잉 write를 정상으로 오판할 수 있다.",
      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
    },
    {
      "id": "CM4-04",
      "severity": "blocking",
      "category": "state-machine",
      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
      "evidence": [
        "§4.3 rollbackRun 결과 status에 partial-rollback이 나오지만 §3.3 RunPrimaryStatus와 §12.4 enum에는 partial-rollback이 없다.",
        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
        "§12.4는 3축 조합 CHECK가 없다."
      ],
      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
    },
    {
      "id": "CM4-05",
      "severity": "blocking",
      "category": "command-contract",
      "title": "cancellation-timeout-manual-review 허용 command 중 markStepCompensated와 abortRun이 엔트리포인트에 없다",
      "evidence": [
        "§4.3: 허용 command = rollbackRun·skipStep·markStepCompensated·abortRun",
        "§3.1 command 목록에는 markStepCompensated와 abortRun이 없다.",
        "§10.1 open 항목 CM-10, CM-11로 abortRun/markStepCompensated를 후속으로 남겨둔다."
      ],
      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
      "recommendation": "두 command를 v1.0에서 지원하려면 §3.1/§3.3/§3.4/§3.1.1/§4.3/§12에 모두 추가하라. 지원하지 않을 거면 §4.3 허용 command에서 제거하고 open issue로만 남겨라."
    },
    {
      "id": "CM4-06",
      "severity": "major",
      "category": "concurrency",
      "title": "active run partial unique가 같은 plan만 막고 같은 target set의 다른 plan 충돌은 막지 못한다",
      "evidence": [
        "§12.4: UNIQUE(planId) WHERE primary_status IN (...) OR remediation_status != 'none'",
        "§4.1 apply는 동일 plan 동시 apply 차단이라고 설명한다.",
        "targetSetDigest는 DryRunReport에 있지만 ContentMigrationRun unique constraint에는 없다."
      ],
      "impact": "동일 targetSelector/targetSetDigest를 가진 서로 다른 plan 두 개가 동시에 apply될 수 있다. crm-sync의 partial unique 패턴처럼 active/rotating 대상 자체를 DB에서 막는 수준에는 못 미친다.",
      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
    },
    {
      "id": "CM4-07",
      "severity": "major",
      "category": "dry-run-apply",
      "title": "§12.4 mode=dry-run이 있으나 runDryRun이 Run을 생성하는지 불명확해 dry-run + apply 충돌 정책이 비어 있다",
      "evidence": [
        "§12.4 ContentMigrationRun.mode enum은 dry-run·apply를 포함한다.",
        "§3.5 runDryRun은 DryRunReport row insert만 설명한다.",
        "§12.4 active unique는 ContentMigrationRun에만 걸린다."
      ],
      "impact": "dry-run이 Run row를 만들지 않으면 긴 dry-run 중 apply가 시작될 수 있다. 반대로 dry-run이 Run row를 만들면 active unique가 apply를 막지만 §4.1/§3.5에 그 lifecycle이 없다.",
      "recommendation": "dry-run을 Run으로 모델링할지 결정하라. 모델링한다면 primaryStatus lifecycle과 active unique에 dry-run 포함을 명시하고, 아니면 DryRunReport generation lock 또는 plan-level dryRunInProgress partial unique를 별도로 둬라."
    },
    {
      "id": "CM4-08",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 정의가 모호해 stale-flags-only override CHECK를 신뢰할 수 없다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 legalEntityChanged boolean만 둔다.",
        "§4.8은 legalEntityChanged=true를 LegalDocument·ReviewPolicy·PricingPage 영향으로 설명한다.",
        "§2.3 staleFlagsOnlyOverrideConditions는 requiresNoLegalEntityChange=true를 요구한다."
      ],
      "impact": "legalEntityChanged가 법인명 변경인지, 법무 검토 대상 엔티티 변경인지, LegalDocument/ReviewPolicy/PricingPage contentType 영향인지 불명확하다. CHECK 조건이 구현마다 달라 stale-flags-only가 과하게 허용될 수 있다.",
      "recommendation": "legalEntityChanged를 rename하거나 분해하라. 예: legalSensitiveEntityChanged, legalEntityIdentityChanged. 산정 입력은 previous/new contentType, fieldProjection diff, LegalDocument/ReviewPolicy/PricingPage class diff, priorReview trigger diff로 명시하라."
    },
    {
      "id": "CM4-09",
      "severity": "major",
      "category": "db-schema",
      "title": "§12 executable schema가 실제 SQL 실행 가능 수준은 아니다",
      "evidence": [
        "§12.4 FK 대상과 ON DELETE 정책이 일부 생략된다.",
        "§12.5 CHECK (contains_pii = true → export_allowed = false)는 SQL 문법이 아니다.",
        "§12.9.1은 별도 id/FK/UNIQUE를 가진 per-record table인데 총 10 tables에서 제외된다.",
        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
      ],
      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
      "recommendation": "PostgreSQL canonical DDL 또는 최소 SQL-equivalent CHECK 표현을 추가하라. §12.9.1이 물리 테이블이면 인벤토리를 11 tables로 고치고, embedded JSON이면 FK/UNIQUE 표현을 제거하라."
    },
    {
      "id": "CM4-10",
      "severity": "major",
      "category": "privacy",
      "title": "StepResultRow PII export 금지 CHECK가 application validator인지 DB CHECK인지 불명확하다",
      "evidence": [
        "§3.8 exportAllowed: PII step은 false 강제",
        "§12.5 Constraints에 CHECK (contains_pii = true → export_allowed = false)",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑하지만 §9.2 runtime fail 목록에는 직접 항목이 없다."
      ],
      "impact": "PII StepResult export 금지가 DB에서 강제되는지, read API validator에서 강제되는지 불명확하다. 잘못 구현하면 PII rawArtifact/export가 열릴 수 있다.",
      "recommendation": "DB CHECK는 `CHECK (NOT contains_pii OR export_allowed = false)`로 명시하고, §9.2에 export 시도 runtime fail rule을 추가하라."
    },
    {
      "id": "CM4-11",
      "severity": "major",
      "category": "step-result",
      "title": "skipped 상태와 skipStep path가 rollbackClass enum과 맞지 않는다",
      "evidence": [
        "§3.3 SkipStepInput.rollbackClass는 'irreversible' | 'manual-remediation-required'이다.",
        "§3.3 RollbackClass는 reversible·compensating·irreversible 3종이다.",
        "§12.5 StepResult.rollbackClass는 enum이라고만 하고 manual-remediation-required 포함 여부가 없다.",
        "§12.5 status에는 skipped가 있지만 §9 invariant는 skipped 후 StepResult/Run 상태 전이를 닫지 않는다."
      ],
      "impact": "manual-remediation-required가 rollbackClass인지 remediation reason인지 혼재된다. skipped step이 rollback log에만 남는지 StepResult.status도 skipped로 바뀌는지, compensationStatus와 어떻게 연결되는지 불명확하다.",
      "recommendation": "manual-remediation-required는 rollbackClass에서 제거하고 remediationStatus/reason으로만 둬라. skipStep 성공 시 StepResult.status='skipped', Run.remediationStatus 해제 조건, RollbackLog.result=partial 조건을 명시하라."
    },
    {
      "id": "CM4-12",
      "severity": "major",
      "category": "traceability",
      "title": "§6.2 traceability는 1:1 표를 만들었지만 §9 쪽 rule coverage가 여전히 불완전하다",
      "evidence": [
        "§6.2에는 INV-IDEMPOTENCY-REPLAY가 있으나 §9.2 runtime fail에는 same-request replay 항목이 없다.",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑되지만 §9.2 목록에 PII export fail이 없다.",
        "§6.3은 상세 fixture matrix를 v0.5로 미루고 v0.4는 일부 happy/violation 예시만 둔다."
      ],
      "impact": "표면상 traceability는 생겼지만 일부 invariant는 실제 fail rule과 fixture로 추적되지 않는다. v1.0 후보의 regression 방지 기준으로 부족하다.",
      "recommendation": "§9에 누락 rule을 추가하고, 최소 각 INV마다 happy 1개 + violation 1개 fixture를 v1.0 안에 포함하라. deferred fixture는 v1.0 readiness 차단으로 남겨야 한다."
    },
    {
      "id": "CM4-13",
      "severity": "minor",
      "category": "notification",
      "title": "read-only window dispatchAllowlist와 notifications SoT의 즉시 채널 정책 사이 책임 경계가 약하다",
      "evidence": [
        "§4.5는 notification-dispatch를 dispatchAllowlist 이벤트만 즉시 허용한다고 한다.",
        "REVIEW_WORKFLOW §9.1.1은 같은 이벤트들의 channel/criticality/quietHoursPolicy SoT다.",
        "content-migration §2.3에도 별도 dispatchAllowlist config가 있다."
      ],
      "impact": "REVIEW_WORKFLOW 매트릭스가 변경되었을 때 content-migration dispatchAllowlist와 notificationPolicyVersion이 따로 drift될 수 있다.",
      "recommendation": "dispatchAllowlist는 REVIEW_WORKFLOW event criticality ∈ {high, critical} AND operational=true 같은 derived rule로 두거나, policyVersion/hash를 함께 저장해 drift를 build fail로 막아라."
    },
    {
      "id": "CM4-14",
      "severity": "minor",
      "category": "semver",
      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
      "evidence": [
        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
      ],
      "impact": "schema는 그대로지만 안전성 의미가 바뀌는 변경이 PATCH/MINOR로 오판될 수 있다.",
      "recommendation": "writeSetManifest strategy semantic 변경, policy-reevaluate reportingMode decision rule 변경, staleFlagsOnlyOverrideConditions 변경을 MAJOR + policyVersion 신규로 명시하라."
    }
  ],
  "pattern_consistency": {
    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
    "asset_ingestion_body_mv_denylist": "대체로 정합. content-migration은 ExtractedContent.body MV 직접 변경 금지를 명시하고 mutableFieldDenylist로 연결했다.",
    "notifications_outbox_sql": "대체로 정합. nextAttemptAt·attempts·permanent 상태는 반영됐다. 다만 read-only window dispatchAllowlist는 REVIEW_WORKFLOW/notifications policyVersion과 drift 방지 장치가 더 필요하다."
  },
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.3, §3.5, §12.2",
      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
    },
    {
      "target": "docs/features/content-migration.md §3.7",
      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
    },
    {
      "target": "docs/features/content-migration.md §4.3, §12.4",
      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
    },
    {
      "target": "docs/features/content-migration.md §3.1, §3.3, §3.4, §4.3",
      "change": "markStepCompensated·abortRun 지원 여부 결정 및 command contract 정합화"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "실제 SQL-equivalent FK/CHECK/partial unique/CAS DDL 수준으로 schema 보강, §12.9.1 table count 정정"
    },
    {
      "target": "docs/features/content-migration.md §6.3",
      "change": "각 INV별 happy/violation fixture matrix를 v1.0 범위에 포함"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "ApplyPreflightToken HMAC decode 불가능",
      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
      "Run status 3축 transition matrix 및 DB CHECK 미완성",
      "cancellation-timeout-manual-review 복구 command contract 누락"
    ],
    "residual_major_reasons": [
      "active unique가 동일 target set의 다른 plan 충돌을 막지 못함",
      "dry-run/apply 동시성 정책 불명확",
      "legalEntityChanged 및 stale-flags-only override 판정 기준 모호",
      "§12 executable schema와 §6.3 fixture가 v1.0 수준으로 완결되지 않음"
    ]
  }
}
tokens used
111,431
{
  "review_target": "docs/features/content-migration.md v0.4",
  "review_cycle": 4,
  "finding_prefix": "CM4-",
  "ready_for_v1_0": false,
  "third_cycle_recheck": {
    "total_cm3_findings": 21,
    "fully_resolved": [
      "CM3-01",
      "CM3-03",
      "CM3-04",
      "CM3-05",
      "CM3-07",
      "CM3-08",
      "CM3-13",
      "CM3-14",
      "CM3-16",
      "CM3-18",
      "CM3-19",
      "CM3-20",
      "CM3-21"
    ],
    "partially_resolved_or_regressed": [
      "CM3-02",
      "CM3-06",
      "CM3-09",
      "CM3-10",
      "CM3-11",
      "CM3-12",
      "CM3-15",
      "CM3-17"
    ],
    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
  },
  "findings": [
    {
      "id": "CM4-01",
      "severity": "blocking",
      "category": "cas-token",
      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
      "evidence": [
        "§2.4: applyPreflightToken = HMAC(...). char(64)",
        "§3.3 RunApplyInput은 planId + applyPreflightToken만 받는다.",
        "§3.5 runApply 1단계는 input.applyPreflightToken 디코딩 → planId·dryRunReportId 매칭이라고 한다."
      ],
      "impact": "HMAC digest는 opaque 값이라 dryRunReportId를 디코딩할 수 없다. UNIQUE(applyPreflightToken) lookup으로 역조회할 수는 있지만, 그 경우 §3.5 알고리즘과 API 계약이 틀린다. dry-run report 식별, 만료 검사, legal approval 연결이 구현자마다 갈릴 수 있다.",
      "recommendation": "RunApplyInput에 dryRunReportId를 명시하거나, token lookup 방식으로 고정하라. 예: input = { planId, dryRunReportId, applyPreflightToken }. 서버는 DryRunReport(planId, dryRunReportId)를 조회한 뒤 token 재계산 비교 + 8필드 current recompute를 수행한다."
    },
    {
      "id": "CM4-02",
      "severity": "major",
      "category": "cas-cost",
      "title": "8필드 server-side 재계산 비용과 cache invalidation 경계가 닫히지 않았다",
      "evidence": [
        "§3.5 runApply는 현재 시점 8필드 모두 재계산해야 한다.",
        "§2.4는 비용 상한을 §2.3 digest로만 참조한다.",
        "legalImpactClassificationDigest와 classifierVersion 변경 감지는 policyVersionSnapshot mismatch 또는 token mismatch라고만 간접 표현된다."
      ],
      "impact": "대규모 targetSetDigest/contentHashDigest/sourceSnapshotWatermark를 apply마다 full recompute하면 apply 시작 비용이 과도해질 수 있다. 반대로 cache를 쓰면 classifierVersion, catalog ref, rule hash 변경 시 invalidation 기준이 필요하다.",
      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
    },
    {
      "id": "CM4-03",
      "severity": "blocking",
      "category": "partial-write",
      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
      "evidence": [
        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
        "§3.7 partial write 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
        "isolationLevel은 기록 필드일 뿐 strategy별 요구 isolation/advisory lock이 없다."
      ],
      "impact": "append-only table에서 다른 worker가 같은 watermark 범위에 row를 삽입하면 watermark는 역행하지 않는다. high watermark만으로는 expected row set과 concurrent insert를 구분할 수 없어 partial write 또는 과잉 write를 정상으로 오판할 수 있다.",
      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
    },
    {
      "id": "CM4-04",
      "severity": "blocking",
      "category": "state-machine",
      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
      "evidence": [
        "§4.3 rollbackRun 결과 status에 partial-rollback이 나오지만 §3.3 RunPrimaryStatus와 §12.4 enum에는 partial-rollback이 없다.",
        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
        "§12.4는 3축 조합 CHECK가 없다."
      ],
      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
    },
    {
      "id": "CM4-05",
      "severity": "blocking",
      "category": "command-contract",
      "title": "cancellation-timeout-manual-review 허용 command 중 markStepCompensated와 abortRun이 엔트리포인트에 없다",
      "evidence": [
        "§4.3: 허용 command = rollbackRun·skipStep·markStepCompensated·abortRun",
        "§3.1 command 목록에는 markStepCompensated와 abortRun이 없다.",
        "§10.1 open 항목 CM-10, CM-11로 abortRun/markStepCompensated를 후속으로 남겨둔다."
      ],
      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
      "recommendation": "두 command를 v1.0에서 지원하려면 §3.1/§3.3/§3.4/§3.1.1/§4.3/§12에 모두 추가하라. 지원하지 않을 거면 §4.3 허용 command에서 제거하고 open issue로만 남겨라."
    },
    {
      "id": "CM4-06",
      "severity": "major",
      "category": "concurrency",
      "title": "active run partial unique가 같은 plan만 막고 같은 target set의 다른 plan 충돌은 막지 못한다",
      "evidence": [
        "§12.4: UNIQUE(planId) WHERE primary_status IN (...) OR remediation_status != 'none'",
        "§4.1 apply는 동일 plan 동시 apply 차단이라고 설명한다.",
        "targetSetDigest는 DryRunReport에 있지만 ContentMigrationRun unique constraint에는 없다."
      ],
      "impact": "동일 targetSelector/targetSetDigest를 가진 서로 다른 plan 두 개가 동시에 apply될 수 있다. crm-sync의 partial unique 패턴처럼 active/rotating 대상 자체를 DB에서 막는 수준에는 못 미친다.",
      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
    },
    {
      "id": "CM4-07",
      "severity": "major",
      "category": "dry-run-apply",
      "title": "§12.4 mode=dry-run이 있으나 runDryRun이 Run을 생성하는지 불명확해 dry-run + apply 충돌 정책이 비어 있다",
      "evidence": [
        "§12.4 ContentMigrationRun.mode enum은 dry-run·apply를 포함한다.",
        "§3.5 runDryRun은 DryRunReport row insert만 설명한다.",
        "§12.4 active unique는 ContentMigrationRun에만 걸린다."
      ],
      "impact": "dry-run이 Run row를 만들지 않으면 긴 dry-run 중 apply가 시작될 수 있다. 반대로 dry-run이 Run row를 만들면 active unique가 apply를 막지만 §4.1/§3.5에 그 lifecycle이 없다.",
      "recommendation": "dry-run을 Run으로 모델링할지 결정하라. 모델링한다면 primaryStatus lifecycle과 active unique에 dry-run 포함을 명시하고, 아니면 DryRunReport generation lock 또는 plan-level dryRunInProgress partial unique를 별도로 둬라."
    },
    {
      "id": "CM4-08",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 정의가 모호해 stale-flags-only override CHECK를 신뢰할 수 없다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 legalEntityChanged boolean만 둔다.",
        "§4.8은 legalEntityChanged=true를 LegalDocument·ReviewPolicy·PricingPage 영향으로 설명한다.",
        "§2.3 staleFlagsOnlyOverrideConditions는 requiresNoLegalEntityChange=true를 요구한다."
      ],
      "impact": "legalEntityChanged가 법인명 변경인지, 법무 검토 대상 엔티티 변경인지, LegalDocument/ReviewPolicy/PricingPage contentType 영향인지 불명확하다. CHECK 조건이 구현마다 달라 stale-flags-only가 과하게 허용될 수 있다.",
      "recommendation": "legalEntityChanged를 rename하거나 분해하라. 예: legalSensitiveEntityChanged, legalEntityIdentityChanged. 산정 입력은 previous/new contentType, fieldProjection diff, LegalDocument/ReviewPolicy/PricingPage class diff, priorReview trigger diff로 명시하라."
    },
    {
      "id": "CM4-09",
      "severity": "major",
      "category": "db-schema",
      "title": "§12 executable schema가 실제 SQL 실행 가능 수준은 아니다",
      "evidence": [
        "§12.4 FK 대상과 ON DELETE 정책이 일부 생략된다.",
        "§12.5 CHECK (contains_pii = true → export_allowed = false)는 SQL 문법이 아니다.",
        "§12.9.1은 별도 id/FK/UNIQUE를 가진 per-record table인데 총 10 tables에서 제외된다.",
        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
      ],
      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
      "recommendation": "PostgreSQL canonical DDL 또는 최소 SQL-equivalent CHECK 표현을 추가하라. §12.9.1이 물리 테이블이면 인벤토리를 11 tables로 고치고, embedded JSON이면 FK/UNIQUE 표현을 제거하라."
    },
    {
      "id": "CM4-10",
      "severity": "major",
      "category": "privacy",
      "title": "StepResultRow PII export 금지 CHECK가 application validator인지 DB CHECK인지 불명확하다",
      "evidence": [
        "§3.8 exportAllowed: PII step은 false 강제",
        "§12.5 Constraints에 CHECK (contains_pii = true → export_allowed = false)",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑하지만 §9.2 runtime fail 목록에는 직접 항목이 없다."
      ],
      "impact": "PII StepResult export 금지가 DB에서 강제되는지, read API validator에서 강제되는지 불명확하다. 잘못 구현하면 PII rawArtifact/export가 열릴 수 있다.",
      "recommendation": "DB CHECK는 `CHECK (NOT contains_pii OR export_allowed = false)`로 명시하고, §9.2에 export 시도 runtime fail rule을 추가하라."
    },
    {
      "id": "CM4-11",
      "severity": "major",
      "category": "step-result",
      "title": "skipped 상태와 skipStep path가 rollbackClass enum과 맞지 않는다",
      "evidence": [
        "§3.3 SkipStepInput.rollbackClass는 'irreversible' | 'manual-remediation-required'이다.",
        "§3.3 RollbackClass는 reversible·compensating·irreversible 3종이다.",
        "§12.5 StepResult.rollbackClass는 enum이라고만 하고 manual-remediation-required 포함 여부가 없다.",
        "§12.5 status에는 skipped가 있지만 §9 invariant는 skipped 후 StepResult/Run 상태 전이를 닫지 않는다."
      ],
      "impact": "manual-remediation-required가 rollbackClass인지 remediation reason인지 혼재된다. skipped step이 rollback log에만 남는지 StepResult.status도 skipped로 바뀌는지, compensationStatus와 어떻게 연결되는지 불명확하다.",
      "recommendation": "manual-remediation-required는 rollbackClass에서 제거하고 remediationStatus/reason으로만 둬라. skipStep 성공 시 StepResult.status='skipped', Run.remediationStatus 해제 조건, RollbackLog.result=partial 조건을 명시하라."
    },
    {
      "id": "CM4-12",
      "severity": "major",
      "category": "traceability",
      "title": "§6.2 traceability는 1:1 표를 만들었지만 §9 쪽 rule coverage가 여전히 불완전하다",
      "evidence": [
        "§6.2에는 INV-IDEMPOTENCY-REPLAY가 있으나 §9.2 runtime fail에는 same-request replay 항목이 없다.",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑되지만 §9.2 목록에 PII export fail이 없다.",
        "§6.3은 상세 fixture matrix를 v0.5로 미루고 v0.4는 일부 happy/violation 예시만 둔다."
      ],
      "impact": "표면상 traceability는 생겼지만 일부 invariant는 실제 fail rule과 fixture로 추적되지 않는다. v1.0 후보의 regression 방지 기준으로 부족하다.",
      "recommendation": "§9에 누락 rule을 추가하고, 최소 각 INV마다 happy 1개 + violation 1개 fixture를 v1.0 안에 포함하라. deferred fixture는 v1.0 readiness 차단으로 남겨야 한다."
    },
    {
      "id": "CM4-13",
      "severity": "minor",
      "category": "notification",
      "title": "read-only window dispatchAllowlist와 notifications SoT의 즉시 채널 정책 사이 책임 경계가 약하다",
      "evidence": [
        "§4.5는 notification-dispatch를 dispatchAllowlist 이벤트만 즉시 허용한다고 한다.",
        "REVIEW_WORKFLOW §9.1.1은 같은 이벤트들의 channel/criticality/quietHoursPolicy SoT다.",
        "content-migration §2.3에도 별도 dispatchAllowlist config가 있다."
      ],
      "impact": "REVIEW_WORKFLOW 매트릭스가 변경되었을 때 content-migration dispatchAllowlist와 notificationPolicyVersion이 따로 drift될 수 있다.",
      "recommendation": "dispatchAllowlist는 REVIEW_WORKFLOW event criticality ∈ {high, critical} AND operational=true 같은 derived rule로 두거나, policyVersion/hash를 함께 저장해 drift를 build fail로 막아라."
    },
    {
      "id": "CM4-14",
      "severity": "minor",
      "category": "semver",
      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
      "evidence": [
        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
      ],
      "impact": "schema는 그대로지만 안전성 의미가 바뀌는 변경이 PATCH/MINOR로 오판될 수 있다.",
      "recommendation": "writeSetManifest strategy semantic 변경, policy-reevaluate reportingMode decision rule 변경, staleFlagsOnlyOverrideConditions 변경을 MAJOR + policyVersion 신규로 명시하라."
    }
  ],
  "pattern_consistency": {
    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
    "asset_ingestion_body_mv_denylist": "대체로 정합. content-migration은 ExtractedContent.body MV 직접 변경 금지를 명시하고 mutableFieldDenylist로 연결했다.",
    "notifications_outbox_sql": "대체로 정합. nextAttemptAt·attempts·permanent 상태는 반영됐다. 다만 read-only window dispatchAllowlist는 REVIEW_WORKFLOW/notifications policyVersion과 drift 방지 장치가 더 필요하다."
  },
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.3, §3.5, §12.2",
      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
    },
    {
      "target": "docs/features/content-migration.md §3.7",
      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
    },
    {
      "target": "docs/features/content-migration.md §4.3, §12.4",
      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
    },
    {
      "target": "docs/features/content-migration.md §3.1, §3.3, §3.4, §4.3",
      "change": "markStepCompensated·abortRun 지원 여부 결정 및 command contract 정합화"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "실제 SQL-equivalent FK/CHECK/partial unique/CAS DDL 수준으로 schema 보강, §12.9.1 table count 정정"
    },
    {
      "target": "docs/features/content-migration.md §6.3",
      "change": "각 INV별 happy/violation fixture matrix를 v1.0 범위에 포함"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "ApplyPreflightToken HMAC decode 불가능",
      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
      "Run status 3축 transition matrix 및 DB CHECK 미완성",
      "cancellation-timeout-manual-review 복구 command contract 누락"
    ],
    "residual_major_reasons": [
      "active unique가 동일 target set의 다른 plan 충돌을 막지 못함",
      "dry-run/apply 동시성 정책 불명확",
      "legalEntityChanged 및 stale-flags-only override 판정 기준 모호",
      "§12 executable schema와 §6.3 fixture가 v1.0 수준으로 완결되지 않음"
    ]
  }
}
