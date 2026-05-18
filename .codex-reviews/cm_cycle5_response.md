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
session id: 019e293d-27ea-7e20-9f83-d532b6cd07e0
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.5 (5차 사이클)

## 컨텍스트

4차 비평(14 지적) 전건 수용. v0.5 핵심:
- ApplyPreflightToken opaque + dryRunReportId explicit lookup (CM4-01)
- digestComputationMode 3종 (full·snapshot·cache) + invalidationInputs (CM4-02)
- append-only-watermark concurrency 강화 (lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode) (CM4-03)
- Run status 3축 transition matrix + DB CHECK invariant (CM4-04). partial-rollback은 별도 primaryStatus 아님
- markStepCompensated·abortRun v1.0 정식 command + REVIEW_WORKFLOW cascade 추가 (CM4-05)
- ContentMigrationActiveTargetLock § 12.11 신설 (CM4-06·07)
- legalEntityChanged 분해 → legalSensitiveEntityChanged + legalEntityIdentityChanged (CM4-08)
- 인벤토리 11 tables (CM4-09)
- PII export DB CHECK SQL canonical (CM4-10)
- SkipStepInput.rollbackClass 제거 (CM4-11)
- § 6.3 fixture matrix 28 INV × happy + violation (CM4-12)
- dispatchAllowlistPolicySnapshot drift 방지 (CM4-13)
- § 1.1 SemVer 4행 추가 (CM4-14)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.5를 v1.0 안정판 후보로서 엄정하게 비평하라:

1. **4차 지적 재발 여부**: 14개 지적이 실제로 정정됐는가?
2. **v0.5 신규 메커니즘 모순**:
   - REVIEW_WORKFLOW cascade가 `step-compensated`·`run-aborted` AuditAction 2종 추가됐는데 § 9.1.1 매트릭스에는 NotificationEvent 미정의 — 운영 SLA에서 어떻게 처리?
   - § 4.3.2 3축 invariant DB CHECK 표현이 PostgreSQL CASE 문법인데 모든 transition을 포함하지 못함 (cancelled+failed에 rollbackOutcome IN 허용 등)
   - ActiveTargetLock writeSetScopeDigest 산정 — step별 writeSetProjection canonical hash인데 dry-run 시점과 apply 시점 step 변경 가능성?
   - § 12.9.1 embedded child 명시했지만 § 12.9 PolicyReevaluateBatch row 1개당 N record 어떻게 저장? JSON column 또는 별도 table?
3. **누락 cascade**:
   - REVIEW_WORKFLOW § 9.1·§ 10.2.1에 `step-compensated`·`run-aborted` 추가 확인 (방금 본 cycle에서 cascade는 했음 — 확인)
   - § 9.1.1 매트릭스에 `step-compensated`·`run-aborted` 이벤트 추가 필요?
4. **stand-alone readiness**:
   - § 1.1·§ 2.4·§ 3.x·§ 4.x·§ 6.x·§ 9.x·§ 12.x가 단일 문서 SoT로 v1.0 구현 가능한가?
5. **v1.0 안정판 기준**:
   - blocking 0개?
   - SoT cascade 동기화 완료?
   - 의료법·개인정보보호법 운영 가능?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM5-`. **v1.0 안정판 후보로 판정 가능하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.5)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle4_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
codex
문서 간 SoT 동기화와 v0.5 자체 모순을 같이 보겠습니다. 먼저 대상 문서와 4차 응답, 관련 REVIEW_WORKFLOW/DATA_MODEL의 해당 섹션을 빠르게 찾아 근거 위치를 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CM4-|step-compensated|run-aborted|NotificationEvent|AuditAction|transition|rollbackOutcome|ActiveTargetLock|writeSetScopeDigest|PolicyReevaluateBatch|embedded child|digestComputationMode|ApplyPreflightToken|append-only-watermark|dispatchAllowlistPolicySnapshot|SemVer" docs/features/content-migration.md .codex-reviews/cm_cycle4_response.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path .codex-reviews/cm_cycle4_response.md -TotalCount 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/features/content-migration.md -TotalCount 260' in C:\Users\assag\solution\website-exposure
 succeeded in 588ms:
docs/core/DATA_MODEL.md:637:SemVer 형식 (`"1.4.2"`).
docs/admin/REVIEW_WORKFLOW.md:146:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin/REVIEW_WORKFLOW.md:427:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:565:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
docs/admin/REVIEW_WORKFLOW.md:566:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:571:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
docs/admin/REVIEW_WORKFLOW.md:575:type NotificationEvent = {
docs/admin/REVIEW_WORKFLOW.md:577:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin/REVIEW_WORKFLOW.md:578:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:594:  eventId: string;                                     // 상위 NotificationEvent 참조
docs/admin/REVIEW_WORKFLOW.md:595:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:609:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
docs/admin/REVIEW_WORKFLOW.md:644:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:652:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:655:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:701:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin/REVIEW_WORKFLOW.md:702:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs/features/content-migration.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
docs/features/content-migration.md:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
docs/features/content-migration.md:26:- **DB 인벤토리 (CM4-06·07·09 정정)**: **11 tables** (§ 12.1 ~ § 12.11 — 12.9.1은 embedded·12.11 ContentMigrationActiveTargetLock 신설)
docs/features/content-migration.md:34:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
docs/features/content-migration.md:55:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:56:| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:57:| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:58:| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:59:| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:70:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
docs/features/content-migration.md:110:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
docs/features/content-migration.md:111:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
docs/features/content-migration.md:150:          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
docs/features/content-migration.md:155:          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
docs/features/content-migration.md:180:          requiresNoLegalSensitiveEntityChange: true     # CM4-08
docs/features/content-migration.md:181:          requiresNoLegalEntityIdentityChange: true      # CM4-08
docs/features/content-migration.md:209:| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |
docs/features/content-migration.md:219:| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
docs/features/content-migration.md:225:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
docs/features/content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
docs/features/content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
docs/features/content-migration.md:238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
docs/features/content-migration.md:240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
docs/features/content-migration.md:242:| AuditAction (canonical) | 추가 metadata |
docs/features/content-migration.md:264:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
docs/features/content-migration.md:317:// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
docs/features/content-migration.md:320:  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
docs/features/content-migration.md:342:  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
docs/features/content-migration.md:351:// CM4-05 신규
docs/features/content-migration.md:361:// CM4-05 신규
docs/features/content-migration.md:371:// CM3-04 + CM4-08 — legalEntityChanged 분해
docs/features/content-migration.md:378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
docs/features/content-migration.md:379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
docs/features/content-migration.md:380:  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
docs/features/content-migration.md:412:### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)
docs/features/content-migration.md:416:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
docs/features/content-migration.md:421:1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
docs/features/content-migration.md:424:4. **digestComputationMode별 invalidation precheck** (CM4-02):
docs/features/content-migration.md:455:// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
docs/features/content-migration.md:459:  | { kind: "append-only-watermark";
docs/features/content-migration.md:461:      lowerBound: string;                                // CM4-03 — 시작 watermark
docs/features/content-migration.md:462:      exclusiveUpperBound: string;                       // CM4-03
docs/features/content-migration.md:463:      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
docs/features/content-migration.md:464:      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
docs/features/content-migration.md:465:      expectedInsertedCount: number;                     // CM4-03
docs/features/content-migration.md:466:      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
docs/features/content-migration.md:486:  highWatermark?: { before: string; after: string };    // append-only-watermark
docs/features/content-migration.md:499:- `append-only-watermark` (CM4-03):
docs/features/content-migration.md:581:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
docs/features/content-migration.md:582:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
docs/features/content-migration.md:586:### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)
docs/features/content-migration.md:588:#### 4.3.1 명령별 transition
docs/features/content-migration.md:590:| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
docs/features/content-migration.md:601:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
docs/features/content-migration.md:603:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
docs/features/content-migration.md:623:**partial-rollback은 별도 primaryStatus 아님** (CM4-04 정정) — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.
docs/features/content-migration.md:642:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
docs/features/content-migration.md:707:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
docs/features/content-migration.md:724:5. forcedReportingMode 결정 (CM4-08):
docs/features/content-migration.md:733:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
docs/features/content-migration.md:742:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
docs/features/content-migration.md:753:### 5.3 NotificationEvent 매핑
docs/features/content-migration.md:771:| ApplyPreflightToken mismatch 차단율 | 100% | |
docs/features/content-migration.md:788:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
docs/features/content-migration.md:812:| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
docs/features/content-migration.md:813:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
docs/features/content-migration.md:814:| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
docs/features/content-migration.md:815:| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
docs/features/content-migration.md:816:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs/features/content-migration.md:818:### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)
docs/features/content-migration.md:846:| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
docs/features/content-migration.md:847:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
docs/features/content-migration.md:848:| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
docs/features/content-migration.md:849:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
docs/features/content-migration.md:850:| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |
docs/features/content-migration.md:879:- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
docs/features/content-migration.md:894:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
docs/features/content-migration.md:910:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
docs/features/content-migration.md:911:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs/features/content-migration.md:912:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
docs/features/content-migration.md:949:  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
docs/features/content-migration.md:981:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
docs/features/content-migration.md:982:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
docs/features/content-migration.md:1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs/features/content-migration.md:1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features/content-migration.md:1074:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
docs/features/content-migration.md:1075:| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
docs/features/content-migration.md:1109:**Constraints (CM4-10 SQL canonical 정정)**:
docs/features/content-migration.md:1112:- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
docs/features/content-migration.md:1205:### 12.9 `ContentMigrationPolicyReevaluateBatch`
docs/features/content-migration.md:1244:| `eventType` | enum (NotificationEventType 4종) | ✅ |
docs/features/content-migration.md:1261:### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)
docs/features/content-migration.md:1263:dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.
docs/features/content-migration.md:1270:| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
docs/features/content-migration.md:1278:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
docs/features/content-migration.md:1290:`writeSetScopeDigest` 산정: step별 `writeSetProjection` canonical JSON merge → SHA-256.
docs/features/content-migration.md:1294:**총 11개 admin DB 테이블** — § 12.1·12.2·12.3·12.4·12.5·12.6·12.7·12.8·12.9·12.10·12.11. § 12.9.1은 § 12.9의 row-per-record embedded child (별도 table count 미포함 — JSON 또는 connecting table 구현 자유).
.codex-reviews/cm_cycle4_response.md:27:- ApplyPreflightToken § 3.5 — server-side 8필드 CAS (ETag 스타일)
.codex-reviews/cm_cycle4_response.md:28:- writeSetManifest strategy 4종 분기 (small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform)
.codex-reviews/cm_cycle4_response.md:29:- Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해
.codex-reviews/cm_cycle4_response.md:36:- § 1.1 SemVer catalog 3행 추가
.codex-reviews/cm_cycle4_response.md:37:- § 3.1.1 AuditAction metadata 공통 required (actorId·actorRole·idempotencyKey·requestFingerprint)
.codex-reviews/cm_cycle4_response.md:46:   - ApplyPreflightToken — 8필드 재계산이 매번 발생하면 apply 시점 비용 우려. 또는 cache로 처리? legalImpactClassificationDigest와 classifierVersion이 변경되면 server에서 어떻게 감지?
.codex-reviews/cm_cycle4_response.md:47:   - writeSetManifest strategy 4종 — append-only-watermark가 watermark 역행 검사로 충분한가? 동시 삽입은?
.codex-reviews/cm_cycle4_response.md:48:   - Run status substate 분해 — primaryStatus·remediationStatus·rollbackOutcome 3축이 모든 transition을 닫는가? § 4.3 표가 모든 조합을 다루지 않음
.codex-reviews/cm_cycle4_response.md:66:   - § 1.1 SemVer가 v0.4 신규 (Run status substate·ApplyPreflightToken·writeSetManifest strategy) 모두 다루는가
.codex-reviews/cm_cycle4_response.md:67:   - § 4.3 state transition 표 + § 12.4 status enum 정합
.codex-reviews/cm_cycle4_response.md:72:이전과 동일 JSON 스키마. 지적 ID 접두사 `CM4-`. v1.0 후보 판정 가능하면 `ready_for_v1_0=true`.
.codex-reviews/cm_cycle4_response.md:108:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
.codex-reviews/cm_cycle4_response.md:120:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
.codex-reviews/cm_cycle4_response.md:133:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:154:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
.codex-reviews/cm_cycle4_response.md:165:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
.codex-reviews/cm_cycle4_response.md:205:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:206:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
.codex-reviews/cm_cycle4_response.md:311:| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
.codex-reviews/cm_cycle4_response.md:317:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
.codex-reviews/cm_cycle4_response.md:328:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
.codex-reviews/cm_cycle4_response.md:330:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
.codex-reviews/cm_cycle4_response.md:332:| AuditAction (canonical) | 추가 metadata |
.codex-reviews/cm_cycle4_response.md:354:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
.codex-reviews/cm_cycle4_response.md:480:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:524:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:543:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:556:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:633:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
.codex-reviews/cm_cycle4_response.md:634:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
.codex-reviews/cm_cycle4_response.md:638:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:672:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:737:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
.codex-reviews/cm_cycle4_response.md:762:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
.codex-reviews/cm_cycle4_response.md:771:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:782:### 5.3 NotificationEvent 매핑
.codex-reviews/cm_cycle4_response.md:800:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:817:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:907:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
.codex-reviews/cm_cycle4_response.md:959:  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
.codex-reviews/cm_cycle4_response.md:1010:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:1082:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
.codex-reviews/cm_cycle4_response.md:1209:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:1248:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:1414:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
.codex-reviews/cm_cycle4_response.md:1687:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:1695:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
.codex-reviews/cm_cycle4_response.md:1732:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:1735:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:1833:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
.codex-reviews/cm_cycle4_response.md:1834:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:1839:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:1843:type NotificationEvent = {
.codex-reviews/cm_cycle4_response.md:1845:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:1846:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:1862:  eventId: string;                                     // 상위 NotificationEvent 참조
.codex-reviews/cm_cycle4_response.md:1863:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:1877:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
.codex-reviews/cm_cycle4_response.md:1912:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:1920:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:1923:type AuditAction =
.codex-reviews/cm_cycle4_response.md:2092:- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
.codex-reviews/cm_cycle4_response.md:2093:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
.codex-reviews/cm_cycle4_response.md:2105:**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.
.codex-reviews/cm_cycle4_response.md:2107:| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
.codex-reviews/cm_cycle4_response.md:2110:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
.codex-reviews/cm_cycle4_response.md:2153:> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).
.codex-reviews/cm_cycle4_response.md:2159:| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
.codex-reviews/cm_cycle4_response.md:2160:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
.codex-reviews/cm_cycle4_response.md:2210:### 3.1 입력 — NotificationEvent
.codex-reviews/cm_cycle4_response.md:2226:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:2289:async function notify(event: NotificationEvent): Promise<DeliveryResult>
.codex-reviews/cm_cycle4_response.md:2295:  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
.codex-reviews/cm_cycle4_response.md:2304:- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제
.codex-reviews/cm_cycle4_response.md:2319:   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
.codex-reviews/cm_cycle4_response.md:2385:  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여
.codex-reviews/cm_cycle4_response.md:2413:  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
.codex-reviews/cm_cycle4_response.md:2517:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
.codex-reviews/cm_cycle4_response.md:2686:  1. NotificationEvent.metadata.locationRef
.codex-reviews/cm_cycle4_response.md:2804:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:2816:### 14.2 `NotificationEventReceipt` (idempotency 선점)
.codex-reviews/cm_cycle4_response.md:2841:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:2893:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:2913:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:3079:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:3085:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
.codex-reviews/cm_cycle4_response.md:3133:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:3134:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:3158:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
.codex-reviews/cm_cycle4_response.md:3477:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:3491:### 10.3 NotificationEvent 필드 매핑 (F-2)
.codex-reviews/cm_cycle4_response.md:3591:### 13.4 runtime invariant·reconcile (AI3-02 + AI3-12 SemVer 정책 — 별도 분리)
.codex-reviews/cm_cycle4_response.md:3648:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:3788:| `eventType` | NotificationEventType | ✅ |
.codex-reviews/cm_cycle4_response.md:3825:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:3850:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:3920:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:3921:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:4028:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:4030:| AuditAction | contentRef | metadata | 권한 |
.codex-reviews/cm_cycle4_response.md:4584:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
.codex-reviews/cm_cycle4_response.md:4589:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
.codex-reviews/cm_cycle4_response.md:4623:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:4711:### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:4896:- 7종 AuditAction insert 성공
.codex-reviews/cm_cycle4_response.md:4897:- 4종 NotificationEventType emit 성공
.codex-reviews/cm_cycle4_response.md:5093:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:5108:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:5478:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:5541:- § 3.1 command-audit-event 매핑 표 + 4종 AuditAction 본문 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered)
.codex-reviews/cm_cycle4_response.md:5547:- § 3.1.1 AuditAction metadata 표 (actorRole·policy snapshot)
.codex-reviews/cm_cycle4_response.md:5576:   - § 1.1 SemVer 표가 v0.3 신규를 모두 다루는가
.codex-reviews/cm_cycle4_response.md:5578:   - 잔여 "v0.2 동일" 표현 (plan kind 6종·NotificationEventType·NotificationEvent 매핑·retry 우선순위 표)
.codex-reviews/cm_cycle4_response.md:5747:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
.codex-reviews/cm_cycle4_response.md:6020:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:6028:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
.codex-reviews/cm_cycle4_response.md:6065:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:6068:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:6166:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
.codex-reviews/cm_cycle4_response.md:6167:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:6172:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:6176:type NotificationEvent = {
.codex-reviews/cm_cycle4_response.md:6178:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:6179:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:6195:  eventId: string;                                     // 상위 NotificationEvent 참조
.codex-reviews/cm_cycle4_response.md:6196:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:6210:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
.codex-reviews/cm_cycle4_response.md:6245:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:6253:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:6256:type AuditAction =
.codex-reviews/cm_cycle4_response.md:6409:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + 9종 AuditAction)
.codex-reviews/cm_cycle4_response.md:6434:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:6503:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:6504:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction |
.codex-reviews/cm_cycle4_response.md:6598:| 종류 | 함수 | 책임 | 권한 | AuditAction | NotificationEvent |
.codex-reviews/cm_cycle4_response.md:6615:**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).
.codex-reviews/cm_cycle4_response.md:6617:### 3.1.1 AuditAction metadata (CM2-23)
.codex-reviews/cm_cycle4_response.md:6619:| AuditAction | metadata 필수 | actorRole 필수 |
.codex-reviews/cm_cycle4_response.md:6858:| `notification-emit-outbox` (CM2-10) | NotificationEvent emit + outbox insert | **허용** (운영 알림 유지) |
.codex-reviews/cm_cycle4_response.md:6901:class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).
.codex-reviews/cm_cycle4_response.md:6913:5. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error per-record resultRef 카운트
.codex-reviews/cm_cycle4_response.md:6923:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일
.codex-reviews/cm_cycle4_response.md:6927:### 5.3 NotificationEvent 매핑 — v0.2 § 4.7 동일
.codex-reviews/cm_cycle4_response.md:7046:  - PolicyReevaluateBatch: retentionDays.policyReevaluateBatch
.codex-reviews/cm_cycle4_response.md:7084:| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
.codex-reviews/cm_cycle4_response.md:7095:| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |
.codex-reviews/cm_cycle4_response.md:7157:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:7192:- REVIEW_WORKFLOW § 9.1·§ 9.1.1: 4종 NotificationEventType cascade 완료
.codex-reviews/cm_cycle4_response.md:7193:- REVIEW_WORKFLOW § 10.2.1: 9종 AuditAction cascade 완료
.codex-reviews/cm_cycle4_response.md:7201:- pause/resume/cancel state transition + cooperative cancellation
.codex-reviews/cm_cycle4_response.md:7235:   - § 3.1 command 11종 ↔ § 3.1.1 audit 9종 ↔ § 4.7 NotificationEvent 매핑 4종 정합
.codex-reviews/cm_cycle4_response.md:7254:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CrmCredentialVersion|partial unique|CAS|closed schema|displayHints|requestFingerprint|idempotencyKey|WHERE|unique|AuditAction|NotificationEvent|CredentialVersion" docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7256:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "state machine|4-state|body materialized|materialized view|asset-ingestion|handoff|DDL|AuditAction|NotificationEvent|retry|outbox|cancel|pause|resume|checksum" docs/features/asset-ingestion.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7258:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###|####)|ContentMigrationConfig|policy-version-reevaluate|application-data-version-upgrade|rollbackClass|planFingerprint|targetSetDigest|sourceSnapshotWatermark|policyVersionSnapshot|stepRegistryVersion|contentHashDigest|legalImpactClassifier|read-only|pause|resume|cancel|retry|autoRollback|idempotencyKey|requestFingerprint|routing-slug|asset-ingestion|DDL|migration-time|ContentMigrationStepRetryQueue|NotificationOutbox|reportingMode|forceProceed|classifierVersion|NotificationEvent|AuditAction|table|unique|CAS|checksum|partial" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7267:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7268:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7269:108:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
.codex-reviews/cm_cycle4_response.md:7284:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:7291:441:### 10.3 NotificationEvent 필드 매핑 (F-2)
.codex-reviews/cm_cycle4_response.md:7311:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:7315:738:| `eventType` | NotificationEventType | ✅ |
.codex-reviews/cm_cycle4_response.md:7323:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType + 9종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7356:100:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7357:101:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7379:193:### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)
.codex-reviews/cm_cycle4_response.md:7380:195:| AuditAction | contentRef | metadata |
.codex-reviews/cm_cycle4_response.md:7437:363:### 4.3 pause / resume / cancel (CM1-13 state transition)
.codex-reviews/cm_cycle4_response.md:7453:392:| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
.codex-reviews/cm_cycle4_response.md:7455:410:### 4.7 NotificationEvent 매핑 (CM1-17)
.codex-reviews/cm_cycle4_response.md:7457:423:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)
.codex-reviews/cm_cycle4_response.md:7503:567:| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |
.codex-reviews/cm_cycle4_response.md:7509:583:| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
.codex-reviews/cm_cycle4_response.md:7521:39:   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (6종)
.codex-reviews/cm_cycle4_response.md:7533:86:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|REVIEW_WORKFLOW|AuditAction|contentMigration|contentMigration|policy-version-reevaluate|migration|CM-|outbox|idempot|legal|dry-run|rollback|reverse|read-only|pause|resume|cancel\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7534:90:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|AuditAction|contentMigration|contentMigration|migration|legal|PII|cascade|outbox|idempot|partial unique|CAS|CHECK|closed schema|contentType\" docs/features/asset-ingestion.md docs/features/crm-sync.md docs/features/compliance-assistant.md docs/features/notifications.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7535:93:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
.codex-reviews/cm_cycle4_response.md:7549:114:88:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7550:115:89:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7582:163:266:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
.codex-reviews/cm_cycle4_response.md:7639:242:docs/features/notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
.codex-reviews/cm_cycle4_response.md:7642:245:docs/features/notifications.md:39:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
.codex-reviews/cm_cycle4_response.md:7644:247:docs/features/notifications.md:89:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
.codex-reviews/cm_cycle4_response.md:7649:252:docs/features/notifications.md:218:async function notify(event: NotificationEvent): Promise<DeliveryResult>
.codex-reviews/cm_cycle4_response.md:7658:261:docs/features/notifications.md:446:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
.codex-reviews/cm_cycle4_response.md:7668:271:docs/features/notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:7669:272:docs/features/notifications.md:745:### 14.2 `NotificationEventReceipt` (idempotency 선점)
.codex-reviews/cm_cycle4_response.md:7725:345:docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:7744:364:docs/admin/REVIEW_WORKFLOW.md:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:7746:366:docs/admin/REVIEW_WORKFLOW.md:568:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:7750:370:docs/admin/REVIEW_WORKFLOW.md:635:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:7752:372:docs/admin/REVIEW_WORKFLOW.md:643:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:7753:373:docs/admin/REVIEW_WORKFLOW.md:646:type AuditAction =
.codex-reviews/cm_cycle4_response.md:7780:409:docs/features/asset-ingestion.md:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7781:410:docs/features/asset-ingestion.md:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7792:438:docs/features/asset-ingestion.md:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:7800:466:docs/features/asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:7810:480:docs/features/crm-sync.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7813:494:docs/features/crm-sync.md:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:7817:503:docs/features/crm-sync.md:212:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7853:620:docs/features/crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:7859:662:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
.codex-reviews/cm_cycle4_response.md:7880:741:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7881:742:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7909:830:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
.codex-reviews/cm_cycle4_response.md:7926:927:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
.codex-reviews/cm_cycle4_response.md:7980:1470:초안은 cascade “필요”라고만 적은 곳과 실제 SoT enum/매트릭스 반영이 갈라져 있습니다. 이제 REVIEW_WORKFLOW의 알림 매트릭스와 AuditAction 표, compliance-assistant check 계약을 좁혀서 확인하겠습니다.
.codex-reviews/cm_cycle4_response.md:7981:1472:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"9\\.1\\.1|NotificationEventType|eventType|content-migration|crm-sync|asset-ingestion|AuditAction|10\\.2\\.1|type AuditAction|notification\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7991:1515:557:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:7992:1516:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:8016:1595:35:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
.codex-reviews/cm_cycle4_response.md:8042:1697:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:8067:1989:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:8068:1994:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:8087:2150:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:8119:2230:docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:8121:2242:docs\features\keyword-monitoring.md:390:> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류
.codex-reviews/cm_cycle4_response.md:8123:2248:docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
.codex-reviews/cm_cycle4_response.md:8126:2251:docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:8127:2275:docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
.codex-reviews/cm_cycle4_response.md:8134:2300:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
.codex-reviews/cm_cycle4_response.md:8141:2312:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
.codex-reviews/cm_cycle4_response.md:8142:2315:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
.codex-reviews/cm_cycle4_response.md:8218:2510:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
.codex-reviews/cm_cycle4_response.md:8264:2641:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
.codex-reviews/cm_cycle4_response.md:8271:2653:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
.codex-reviews/cm_cycle4_response.md:8272:2656:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
.codex-reviews/cm_cycle4_response.md:8348:2851:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
.codex-reviews/cm_cycle4_response.md:8390:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:8397:104:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:8398:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:8403:212:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:8404:214:| AuditAction | contentRef | metadata | 권한 |
.codex-reviews/cm_cycle4_response.md:8449:768:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
.codex-reviews/cm_cycle4_response.md:8457:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:8474:895:### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:8491:1080:- 7종 AuditAction insert 성공
.codex-reviews/cm_cycle4_response.md:8492:1081:- 4종 NotificationEventType emit 성공
.codex-reviews/cm_cycle4_response.md:8513:1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:8514:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:8560:1662:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:8572:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-migration|ContentMigration|NotificationEventType|AuditAction|contentMigrationConfig|contentMigrationPolicyVersion|legalImpactClassifierRef|ContentMigrationConfig|stale-flags-only|new-record-version|cacheKey|durable cache|batch contract|closed schema" docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/features/compliance-assistant.md docs/features/search-visibility.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:8580:docs/features/search-visibility.md:107:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:8581:docs/features/search-visibility.md:428:### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)
.codex-reviews/cm_cycle4_response.md:8582:docs/features/search-visibility.md:574:| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |
.codex-reviews/cm_cycle4_response.md:8583:docs/features/search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
.codex-reviews/cm_cycle4_response.md:8605:docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:8606:docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:8616:docs/admin/REVIEW_WORKFLOW.md:578:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:8617:docs/admin/REVIEW_WORKFLOW.md:595:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:8618:docs/admin/REVIEW_WORKFLOW.md:644:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:8619:docs/admin/REVIEW_WORKFLOW.md:652:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:8620:docs/admin/REVIEW_WORKFLOW.md:655:type AuditAction =
.codex-reviews/cm_cycle4_response.md:8634:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:8726:### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)
.codex-reviews/cm_cycle4_response.md:8728:| AuditAction | contentRef | metadata |
.codex-reviews/cm_cycle4_response.md:8898:### 4.3 pause / resume / cancel (CM1-13 state transition)
.codex-reviews/cm_cycle4_response.md:8927:| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
.codex-reviews/cm_cycle4_response.md:8945:### 4.7 NotificationEvent 매핑 (CM1-17)
.codex-reviews/cm_cycle4_response.md:8958:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)
.codex-reviews/cm_cycle4_response.md:9102:| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |
.codex-reviews/cm_cycle4_response.md:9118:| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
.codex-reviews/cm_cycle4_response.md:9208:      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
.codex-reviews/cm_cycle4_response.md:9285:      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
.codex-reviews/cm_cycle4_response.md:9293:        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
.codex-reviews/cm_cycle4_response.md:9315:      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:9319:        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
.codex-reviews/cm_cycle4_response.md:9321:      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
.codex-reviews/cm_cycle4_response.md:9322:      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
.codex-reviews/cm_cycle4_response.md:9455:      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
.codex-reviews/cm_cycle4_response.md:9461:      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
.codex-reviews/cm_cycle4_response.md:9487:      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
.codex-reviews/cm_cycle4_response.md:9590:      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
.codex-reviews/cm_cycle4_response.md:9667:      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
.codex-reviews/cm_cycle4_response.md:9675:        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
.codex-reviews/cm_cycle4_response.md:9697:      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:9701:        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
.codex-reviews/cm_cycle4_response.md:9703:      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
.codex-reviews/cm_cycle4_response.md:9704:      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
.codex-reviews/cm_cycle4_response.md:9837:      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
.codex-reviews/cm_cycle4_response.md:9843:      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
.codex-reviews/cm_cycle4_response.md:9869:      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
.codex-reviews/cm_cycle4_response.md:10007:773:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
.codex-reviews/cm_cycle4_response.md:10015:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:10054:1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:10174:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:10207:215:**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).
.codex-reviews/cm_cycle4_response.md:10217:501:class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).
.codex-reviews/cm_cycle4_response.md:10222:523:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일
.codex-reviews/cm_cycle4_response.md:10232:684:| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
.codex-reviews/cm_cycle4_response.md:10234:695:| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |
.codex-reviews/cm_cycle4_response.md:10337:      "title": "REVIEW_WORKFLOW AuditAction cascade가 완료되지 않았는데 v0.3은 CM2-12 전건 수용으로 표시한다",
.codex-reviews/cm_cycle4_response.md:10340:        "content-migration §10.3도 AuditAction cascade를 open으로 둔다.",
.codex-reviews/cm_cycle4_response.md:10425:      "recommendation": "StepRetryQueue에 claim, success, transient fail backoff, exhausted transition, stale processing reclaim SQL을 §12.6에 포함하라. attempts, nextAttemptAt, lockedAt, lockedBy, lastError, exhaustedAt column과 partial unique를 함께 명시하라."
.codex-reviews/cm_cycle4_response.md:10472:      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
.codex-reviews/cm_cycle4_response.md:10477:      "CM3-19 AuditAction 공통 metadata required 추가"
.codex-reviews/cm_cycle4_response.md:10482:      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
.codex-reviews/cm_cycle4_response.md:10484:      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
.codex-reviews/cm_cycle4_response.md:10493:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:10496:      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
.codex-reviews/cm_cycle4_response.md:10506:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:10519:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:10522:      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
.codex-reviews/cm_cycle4_response.md:10524:        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
.codex-reviews/cm_cycle4_response.md:10531:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:10534:      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
.codex-reviews/cm_cycle4_response.md:10537:        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
.codex-reviews/cm_cycle4_response.md:10541:      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
.codex-reviews/cm_cycle4_response.md:10544:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:10551:        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
.codex-reviews/cm_cycle4_response.md:10558:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:10571:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:10584:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:10598:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:10611:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:10618:        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
.codex-reviews/cm_cycle4_response.md:10621:      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
.codex-reviews/cm_cycle4_response.md:10624:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:10637:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:10651:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:10671:    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
.codex-reviews/cm_cycle4_response.md:10672:    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
.codex-reviews/cm_cycle4_response.md:10678:      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
.codex-reviews/cm_cycle4_response.md:10682:      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
.codex-reviews/cm_cycle4_response.md:10708:      "ApplyPreflightToken HMAC decode 모순",
.codex-reviews/cm_cycle4_response.md:10726:      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
.codex-reviews/cm_cycle4_response.md:10731:      "CM3-19 AuditAction 공통 metadata required 추가"
.codex-reviews/cm_cycle4_response.md:10736:      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
.codex-reviews/cm_cycle4_response.md:10738:      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
.codex-reviews/cm_cycle4_response.md:10747:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:10750:      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
.codex-reviews/cm_cycle4_response.md:10760:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:10773:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:10776:      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
.codex-reviews/cm_cycle4_response.md:10778:        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
.codex-reviews/cm_cycle4_response.md:10785:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:10788:      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
.codex-reviews/cm_cycle4_response.md:10791:        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
.codex-reviews/cm_cycle4_response.md:10795:      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
.codex-reviews/cm_cycle4_response.md:10798:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:10805:        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
.codex-reviews/cm_cycle4_response.md:10812:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:10825:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:10838:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:10852:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:10865:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:10872:        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
.codex-reviews/cm_cycle4_response.md:10875:      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
.codex-reviews/cm_cycle4_response.md:10878:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:10891:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:10905:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:10925:    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
.codex-reviews/cm_cycle4_response.md:10926:    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
.codex-reviews/cm_cycle4_response.md:10932:      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
.codex-reviews/cm_cycle4_response.md:10936:      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
.codex-reviews/cm_cycle4_response.md:10962:      "ApplyPreflightToken HMAC decode 모순",
.codex-reviews/cm_cycle4_response.md:10999:      "change": "v0.2 동일 표현 제거 및 NotificationEvent/retry 우선순위 표 재전개"
.codex-reviews/cm_cycle4_response.md:11005:      "REVIEW_WORKFLOW AuditAction cascade incomplete",
.codex-reviews/cm_cycle4_response.md:11655:SemVer 형식 (`"1.4.2"`).
.codex-reviews/cm_cycle4_response.md:12130:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.5|3\\.7|4\\.3|4\\.8|6\\.2|6\\.3|12\\.4|12\\.5|append-only-watermark|markStepCompensated|abortRun|legalEntityChanged|ApplyPreflightToken|writeSetManifest|active run|stale-flags|v0\\.2|v0\\.3 동일|§ .*동일\" docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:12132:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"content-migration-(dry-run-completed|run-paused|run-resumed|rollback-triggered|run-failed)|NotificationEventType|content-migration\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:12152:464:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:12153:467:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:12163:578:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:12164:595:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:12182:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
.codex-reviews/cm_cycle4_response.md:12184:55:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
.codex-reviews/cm_cycle4_response.md:12187:66:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
.codex-reviews/cm_cycle4_response.md:12191:218:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
.codex-reviews/cm_cycle4_response.md:12197:381:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:12198:425:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:12200:444:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:12201:457:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:12208:539:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:12215:701:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:12217:718:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:12223:808:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
.codex-reviews/cm_cycle4_response.md:12233:911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:12251:docs\features\content-migration.md:573:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:12272:docs\features\content-migration.md:911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:12299:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:12315:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
.codex-reviews/cm_cycle4_response.md:12316:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
.codex-reviews/cm_cycle4_response.md:12320:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:12354:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:12419:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
.codex-reviews/cm_cycle4_response.md:12444:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
.codex-reviews/cm_cycle4_response.md:12453:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:12469:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:12513:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:12532:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:12545:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:12576:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:12593:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:12670:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
.codex-reviews/cm_cycle4_response.md:12797:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:12836:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:12859:  "finding_prefix": "CM4-",
.codex-reviews/cm_cycle4_response.md:12888:    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
.codex-reviews/cm_cycle4_response.md:12892:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:12895:      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
.codex-reviews/cm_cycle4_response.md:12905:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:12915:      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
.codex-reviews/cm_cycle4_response.md:12918:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:12921:      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
.codex-reviews/cm_cycle4_response.md:12923:        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
.codex-reviews/cm_cycle4_response.md:12928:      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
.codex-reviews/cm_cycle4_response.md:12931:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:12934:      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:12937:        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
.codex-reviews/cm_cycle4_response.md:12940:      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
.codex-reviews/cm_cycle4_response.md:12941:      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
.codex-reviews/cm_cycle4_response.md:12944:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:12953:      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
.codex-reviews/cm_cycle4_response.md:12957:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:12967:      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
.codex-reviews/cm_cycle4_response.md:12970:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:12983:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:12996:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:13004:        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
.codex-reviews/cm_cycle4_response.md:13006:      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
.codex-reviews/cm_cycle4_response.md:13010:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:13023:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:13037:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:13050:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:13063:      "id": "CM4-14",
.codex-reviews/cm_cycle4_response.md:13066:      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
.codex-reviews/cm_cycle4_response.md:13068:        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
.codex-reviews/cm_cycle4_response.md:13069:        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
.codex-reviews/cm_cycle4_response.md:13076:    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
.codex-reviews/cm_cycle4_response.md:13083:      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
.codex-reviews/cm_cycle4_response.md:13087:      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
.codex-reviews/cm_cycle4_response.md:13091:      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
.codex-reviews/cm_cycle4_response.md:13109:      "ApplyPreflightToken HMAC decode 불가능",
.codex-reviews/cm_cycle4_response.md:13110:      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
.codex-reviews/cm_cycle4_response.md:13111:      "Run status 3축 transition matrix 및 DB CHECK 미완성",
.codex-reviews/cm_cycle4_response.md:13127:  "finding_prefix": "CM4-",
.codex-reviews/cm_cycle4_response.md:13156:    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
.codex-reviews/cm_cycle4_response.md:13160:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:13163:      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
.codex-reviews/cm_cycle4_response.md:13173:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:13183:      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
.codex-reviews/cm_cycle4_response.md:13186:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:13189:      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
.codex-reviews/cm_cycle4_response.md:13191:        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
.codex-reviews/cm_cycle4_response.md:13196:      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
.codex-reviews/cm_cycle4_response.md:13199:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:13202:      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:13205:        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
.codex-reviews/cm_cycle4_response.md:13208:      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
.codex-reviews/cm_cycle4_response.md:13209:      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
.codex-reviews/cm_cycle4_response.md:13212:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:13221:      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
.codex-reviews/cm_cycle4_response.md:13225:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:13235:      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
.codex-reviews/cm_cycle4_response.md:13238:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:13251:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:13264:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:13272:        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
.codex-reviews/cm_cycle4_response.md:13274:      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
.codex-reviews/cm_cycle4_response.md:13278:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:13291:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:13305:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:13318:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:13331:      "id": "CM4-14",
.codex-reviews/cm_cycle4_response.md:13334:      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
.codex-reviews/cm_cycle4_response.md:13336:        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
.codex-reviews/cm_cycle4_response.md:13337:        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
.codex-reviews/cm_cycle4_response.md:13344:    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
.codex-reviews/cm_cycle4_response.md:13351:      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
.codex-reviews/cm_cycle4_response.md:13355:      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
.codex-reviews/cm_cycle4_response.md:13359:      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
.codex-reviews/cm_cycle4_response.md:13377:      "ApplyPreflightToken HMAC decode 불가능",
.codex-reviews/cm_cycle4_response.md:13378:      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
.codex-reviews/cm_cycle4_response.md:13379:      "Run status 3축 transition matrix 및 DB CHECK 미완성",

 succeeded in 597ms:
# Feature — content-migration

> **상태**: Draft v0.5 (codex 자동 비평 4차 반영 — 14개 지적 전건 수용)
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
- **DB 인벤토리 (CM4-06·07·09 정정)**: **11 tables** (§ 12.1 ~ § 12.11 — 12.9.1은 embedded·12.11 ContentMigrationActiveTargetLock 신설)

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
specVersion: "0.5"
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
    version: "0.5.0"
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
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
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

 succeeded in 625ms:
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

codex
초기 확인상 v0.5는 4차 지적 상당수를 문서 표면에는 반영했습니다. 이제 문제가 된 신규 메커니즘 네 곳과 DB 스키마 구간을 좁혀서, “반영됨”과 “아직 구현자가 해석해야 하는 부분”을 분리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[560..660]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[720..770]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1030..1095]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1190..1288]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/admin/REVIEW_WORKFLOW.md'; (Get-Content "'$p)[455..525]; (Get-Content $p)[645..710]' in C:\Users\assag\solution\website-exposure
 succeeded in 657ms:
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

#### 4.3.2 3축 invariant (DB CHECK — § 12.4)

```sql
CHECK (
  CASE primary_status
    WHEN 'pending' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'running' THEN rollback_outcome='none'
    WHEN 'paused' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'completed' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'failed' THEN rollback_outcome IN ('none','failed')
    WHEN 'cancelled' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'rolling-back' THEN rollback_outcome='none'
    WHEN 'rolled-back' THEN rollback_outcome IN ('full','partial')
    ELSE FALSE
  END
)
```

**partial-rollback은 별도 primaryStatus 아님** (CM4-04 정정) — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

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

 succeeded in 646ms:
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
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

 succeeded in 645ms:

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

### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

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


 succeeded in 651ms:
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
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted";          // CM4-05 — abortRun
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

 succeeded in 680ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-migration-plan-legal-approved|content-migration-run-completed|content-migration-run-failed|content-migration-rollback-triggered|content-migration-step-compensated|content-migration-run-aborted" docs/admin/REVIEW_WORKFLOW.md docs/features/content-migration.md docs/features/notifications.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[405..440]; (Get-Content $p)[455..515]; (Get-Content $p)[840..920]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1110..1190]' in C:\Users\assag\solution\website-exposure
 succeeded in 565ms:
docs/admin/REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs/admin/REVIEW_WORKFLOW.md:510:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:511:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:512:  | "content-migration-rollback-triggered";
docs/admin/REVIEW_WORKFLOW.md:556:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:557:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:558:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:559:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:690:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs/admin/REVIEW_WORKFLOW.md:695:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
docs/admin/REVIEW_WORKFLOW.md:696:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:697:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:701:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin/REVIEW_WORKFLOW.md:702:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs/features/content-migration.md:152:            - "content-migration-run-failed"
docs/features/content-migration.md:153:            - "content-migration-rollback-triggered"
docs/features/content-migration.md:154:            - "content-migration-plan-legal-approved"
docs/features/content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
docs/features/content-migration.md:229:| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
docs/features/content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
docs/features/content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
docs/features/content-migration.md:233:| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
docs/features/content-migration.md:246:| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
docs/features/content-migration.md:251:| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
docs/features/content-migration.md:252:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
docs/features/content-migration.md:254:| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
docs/features/content-migration.md:648:`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).
docs/features/content-migration.md:746:| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
docs/features/content-migration.md:747:| `content-migration-run-completed` | normal | inApp | super-admin |
docs/features/content-migration.md:748:| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
docs/features/content-migration.md:749:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
docs/features/content-migration.md:757:| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
docs/features/content-migration.md:758:| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
docs/features/content-migration.md:759:| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
docs/features/content-migration.md:760:| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |

 succeeded in 574ms:
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef + affectedRowsConfirmation) |
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
- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
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

 succeeded in 580ms:
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


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1000..1045]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "digestComputationMode|invalidationInputs|cacheSourceRef|legalSensitiveEntityChanged|legalEntityIdentityChanged|legalEntityChanged" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "markStepCompensated|abortRun|step-compensated|run-aborted|requestFingerprint" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
 succeeded in 556ms:
371:// CM3-04 + CM4-08 — legalEntityChanged 분해
378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
416:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
424:4. **digestComputationMode별 invalidation precheck** (CM4-02):
427:   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
428:5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
723:   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
727:   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
728:   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
849:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1230:| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |

 succeeded in 546ms:
208:| `requestFingerprint` | command별 (§ 3.4) |
231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
400:### 3.4 idempotencyKey + requestFingerprint (CM3-19)
402:| command | scope | requestFingerprint |
601:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
603:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
910:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
981:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
982:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1015:| `requestFingerprint` | char(64) | ✅ |
1071:| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |

 succeeded in 579ms:
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

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

codex
신규 메커니즘에서 몇 가지 더 뚜렷한 불일치가 보입니다. 특히 § 12 헤더는 아직 “10 tables”로 남아 있고, § 12.9.1은 “embedded”라는 v0.5 설명과 달리 별도 row/table로 쓰여 있으며, legalEntityChanged 분해도 하단 스키마에는 완전히 전파되지 않았습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content .codex-reviews/cm_cycle4_response.md -Tail 140' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[940..990]; (Get-Content $p)[1218..1238]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[330..370]; (Get-Content $p)[390..407]' in C:\Users\assag\solution\website-exposure
 succeeded in 601ms:
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

### 10.3 v0.4 잔여 리스크

| 영역 | 상태 |
|---|---|
| § 6.3 acceptance fixture violation path 풀 정의 | open — v0.5 cycle |
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |

---

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

 succeeded in 631ms:
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

 succeeded in 649ms:

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

codex
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM5-",
  "summary": "v0.5는 CM4 14개 지적의 핵심 방향은 대체로 반영했지만, SoT cascade와 DB 스키마가 아직 닫히지 않았다. 특히 §12 인벤토리/PolicyReevaluateRecord/3축 CHECK/NotificationEvent SLA가 v1.0 안정판 차단 요인이다.",
  "cm4_regression_check": {
    "CM4-01": "fixed",
    "CM4-02": "partially_fixed_schema_missing",
    "CM4-03": "fixed_with_residual_scope_question",
    "CM4-04": "partially_fixed_check_incomplete",
    "CM4-05": "partially_fixed_notification_metadata_gap",
    "CM4-06": "partially_fixed_digest_stability_gap",
    "CM4-07": "partially_fixed_digest_stability_gap",
    "CM4-08": "partially_fixed_old_field_remains",
    "CM4-09": "regressed_inventory_contradiction",
    "CM4-10": "fixed",
    "CM4-11": "mostly_fixed_request_fingerprint_stale",
    "CM4-12": "mostly_fixed",
    "CM4-13": "fixed",
    "CM4-14": "fixed"
  },
  "findings": [
    {
      "id": "CM5-01",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12 인벤토리가 11 tables라고 주장하면서 실제 헤더와 §12.9.1은 10/12개 해석을 동시에 만든다",
      "evidence": [
        "§0은 DB 인벤토리를 11 tables라고 한다.",
        "§12 헤더는 여전히 'DB 인벤토리 (10 tables — executable schema)'로 남아 있다.",
        "§12.9.1은 '(별도 row per ComplianceRecord)' 및 id/FK/UNIQUE를 가진 물리 row처럼 정의한다.",
        "v0.5 changelog는 §12.9.1을 embedded라고 설명한다."
      ],
      "impact": "구현자가 PolicyReevaluateRecord를 JSON embedded child로 저장해야 하는지, 별도 table로 생성해야 하는지 결정할 수 없다. 별도 table이면 인벤토리는 12 tables가 되고, embedded이면 FK/UNIQUE 표현이 성립하지 않는다.",
      "recommendation": "둘 중 하나로 고정하라. 권장: `ContentMigrationPolicyReevaluateRecord`를 별도 table로 승격하고 인벤토리를 12 tables로 정정하거나, Batch.resultRecords JSONB로 embedded 정의 후 FK/UNIQUE를 제거하고 JSON schema/CHECK만 남겨라."
    },
    {
      "id": "CM5-02",
      "severity": "blocking",
      "category": "state-machine",
      "title": "3축 invariant CHECK가 transition matrix를 닫지 못해 불가능 조합을 DB가 허용한다",
      "evidence": [
        "§4.3.2 CHECK에서 `running`은 rollback_outcome='none'만 검사해 `running + blocked-manual-remediation-required`를 허용한다.",
        "`rolled-back`은 rollback_outcome만 검사해 `rolled-back + blocked-manual-remediation-required + partial`을 허용한다.",
        "`failed`는 remediation_status를 제한하지 않아 `failed + blocked-manual-remediation-required + none` 같은 전이 없는 조합을 허용한다.",
        "§4.3.1 abortRun은 `failed + cancellation-timeout-manual-review + failed`만 명시한다."
      ],
      "impact": "DB에 유효하지 않은 run substate가 저장될 수 있고, 운영 worker/SLA/rollback cleanup이 서로 다른 상태 해석을 하게 된다.",
      "recommendation": "primaryStatus별 remediationStatus와 rollbackOutcome의 허용 tuple을 CASE가 아니라 명시적 OR tuple로 닫아라. 예: `(primary='running' AND remediation IN ('none','cancellation-timeout-manual-review') AND rollback='none')`, `(primary='rolled-back' AND remediation='none' AND rollback IN ('full','partial'))`."
    },
    {
      "id": "CM5-03",
      "severity": "blocking",
      "category": "notification",
      "title": "step-compensated/run-aborted AuditAction cascade는 됐지만 NotificationEvent SLA가 닫히지 않았다",
      "evidence": [
        "content-migration §3.1은 `markStepCompensated`의 NotificationEvent를 `—`로 두고, `abortRun`은 `content-migration-run-failed`로 매핑한다.",
        "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스는 content-migration NotificationEvent 4종만 포함한다.",
        "REVIEW_WORKFLOW §10.2.1에는 `content-migration-step-compensated`, `content-migration-run-aborted` AuditAction 2종이 추가됐다."
      ],
      "impact": "운영 SLA에서 abort와 일반 run failed를 같은 이벤트로 처리할지, step compensation 완료를 알림 없이 audit만 남길지 불명확하다. 의료/개인정보 관련 수동 보정 작업은 운영자 확인 SLA가 필요하다.",
      "recommendation": "둘 중 하나를 SoT로 명시하라. 권장: `content-migration-run-aborted`는 별도 critical NotificationEvent로 REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 추가하고, `step-compensated`는 no-notification + audit-only SLA인지 또는 high inApp 이벤트인지 명시하라."
    },
    {
      "id": "CM5-04",
      "severity": "major",
      "category": "active-target-lock",
      "title": "ActiveTargetLock writeSetScopeDigest가 dry-run/apply 사이 step registry 변경에 안정적인지 정의되지 않았다",
      "evidence": [
        "§12.11은 `writeSetScopeDigest`를 step writeSetProjection canonical hash라고만 정의한다.",
        "§3.5 ApplyPreflightToken은 stepRegistryVersion을 CAS digest에 포함한다.",
        "§12.11 lock protocol은 runDryRun/runApply 시작 시 lock 획득만 말하고, dry-run 시점 projection과 apply 시점 projection의 동일성 검증은 별도 lock key 입력으로 닫지 않는다."
      ],
      "impact": "stepRegistryVersion 변경 시 ApplyPreflightToken은 fail할 수 있지만, lock key 산정이 이전/현재 projection 중 무엇인지 불명확해 dry-run/apply 충돌 방지 semantics가 흔들린다.",
      "recommendation": "`writeSetScopeDigest = HMAC(stepRegistryVersion + ordered stepKey + writeSetProjection canonical + targetEntityTypes)`로 고정하고, DryRunReport에 저장된 digest를 apply lock 획득에도 그대로 사용하라. registry drift 시 lock 획득 전 CAS fail로 종료하라."
    },
    {
      "id": "CM5-05",
      "severity": "major",
      "category": "apply-preflight",
      "title": "digestComputationMode와 invalidationInputs가 알고리즘에는 있지만 DryRunReport schema에는 없다",
      "evidence": [
        "§3.5는 DryRunReport row insert 시 digestComputationMode·invalidationInputs 기록을 요구한다.",
        "§12.2 ContentMigrationDryRunReport 필드에는 `digestComputationMode`, `invalidationInputs`, `cacheSourceRef`가 없다."
      ],
      "impact": "runApply가 snapshot/cache 모드의 invalidation precheck를 재현할 수 없다. CM4-02 비용/캐시 정정이 스키마 SoT에 남지 않아 구현자가 임의 column을 추가해야 한다.",
      "recommendation": "§12.2에 `digestComputationMode enum(full,snapshot,cache)`, `invalidationInputs JSONB closed`, `cacheSourceRef optional`, `generatedAt`을 추가하라."
    },
    {
      "id": "CM5-06",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 분해가 §12.9.1과 §4.8 중간 단계에 완전히 cascade되지 않았다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 `legalSensitiveEntityChanged`와 `legalEntityIdentityChanged`를 둔다.",
        "§4.8 step 4는 여전히 `legalEntityChanged` 산정이라고 쓴다.",
        "§12.9.1은 `priorReviewRequiredChanged`·`legalEntityChanged` boolean만 저장한다."
      ],
      "impact": "stale-flags-only override 판단 근거가 runtime result와 DB 기록에서 서로 달라진다. 사후 감사 시 왜 new-record-version이 강제됐는지 재구성하기 어렵다.",
      "recommendation": "§4.8과 §12.9.1에서 `legalEntityChanged`를 제거하고 `legalSensitiveEntityChanged`, `legalEntityIdentityChanged`, `fieldProjectionDiff`를 저장하라."
    },
    {
      "id": "CM5-07",
      "severity": "major",
      "category": "idempotency",
      "title": "markStepCompensated/abortRun은 command로 추가됐지만 §3.4 requestFingerprint 표에 없다",
      "evidence": [
        "§3.1과 §3.3은 `markStepCompensated`, `abortRun` input을 추가했다.",
        "§3.4 idempotencyKey + requestFingerprint 표는 definePlan/runApply/rollbackRun/skipStep/pause/resume/cancel/approve만 포함한다.",
        "§3.4 skipStep fingerprint는 제거된 `rollbackClass`를 아직 포함한다."
      ],
      "impact": "신규 운영 command의 same-request replay와 mismatched idempotency 처리가 구현마다 달라질 수 있다.",
      "recommendation": "§3.4에 두 command를 추가하고, skipStep fingerprint에서 rollbackClass를 제거하라. markStepCompensated는 `(stepResultId,idempotencyKey)`, abortRun은 `(runId,idempotencyKey)` scope로 닫는 것이 자연스럽다."
    },
    {
      "id": "CM5-08",
      "severity": "minor",
      "category": "standalone-readiness",
      "title": "v0.4 잔여 리스크 섹션이 v0.5 반영 후에도 그대로 남아 readiness 판단을 흐린다",
      "evidence": [
        "§10.3 제목이 `v0.4 잔여 리스크`로 남아 있다.",
        "§10.3은 §6.3 acceptance fixture violation path를 open이라고 하지만 v0.5 changelog와 §6.3은 28 INV happy+violation 반영을 주장한다."
      ],
      "impact": "문서 자체가 v1.0 후보인지 v0.5 보정 중인지 모순된다.",
      "recommendation": "§10.3을 v0.5 residual risk로 재작성하고, 이미 해결된 fixture 항목은 resolved로 이동하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§6.x", "§9.x", "§12.x"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [
      "§12 table inventory와 PolicyReevaluateRecord 저장 방식 불일치",
      "§4.3.2 DB CHECK invariant 미완성",
      "NotificationEvent/AuditAction SLA cascade 불완전",
      "DryRunReport schema가 digestComputationMode/invalidationInputs를 누락"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": false,
    "privacy_law_operable": "partially",
    "reason": "PII export CHECK 자체는 정정됐지만, 수동 보정/abort 알림 SLA와 policy reevaluate 법적 엔티티 변경 기록이 닫히지 않아 의료법·개인정보보호법 운영 감사 기준으로는 부족하다."
  },
  "required_changes_before_v1_0": [
    "§12 인벤토리와 §12.9.1 저장 모델을 단일 결정으로 정리",
    "§4.3.2를 tuple 기반 DB CHECK로 재작성",
    "REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 abort/compensation 알림 정책 명시",
    "§12.2 DryRunReport에 digestComputationMode/invalidationInputs/cacheSourceRef/generatedAt 추가",
    "§12.9.1의 legalEntityChanged 잔재 제거",
    "§3.4 requestFingerprint 표를 신규 command와 SkipStepInput 변경에 맞게 갱신"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 3,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM5-01, CM5-02, CM5-03은 안정판 차단. CM5-04~CM5-07은 v1.0 전 정합성 보강 필요."
  }
}
tokens used
91,868
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM5-",
  "summary": "v0.5는 CM4 14개 지적의 핵심 방향은 대체로 반영했지만, SoT cascade와 DB 스키마가 아직 닫히지 않았다. 특히 §12 인벤토리/PolicyReevaluateRecord/3축 CHECK/NotificationEvent SLA가 v1.0 안정판 차단 요인이다.",
  "cm4_regression_check": {
    "CM4-01": "fixed",
    "CM4-02": "partially_fixed_schema_missing",
    "CM4-03": "fixed_with_residual_scope_question",
    "CM4-04": "partially_fixed_check_incomplete",
    "CM4-05": "partially_fixed_notification_metadata_gap",
    "CM4-06": "partially_fixed_digest_stability_gap",
    "CM4-07": "partially_fixed_digest_stability_gap",
    "CM4-08": "partially_fixed_old_field_remains",
    "CM4-09": "regressed_inventory_contradiction",
    "CM4-10": "fixed",
    "CM4-11": "mostly_fixed_request_fingerprint_stale",
    "CM4-12": "mostly_fixed",
    "CM4-13": "fixed",
    "CM4-14": "fixed"
  },
  "findings": [
    {
      "id": "CM5-01",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12 인벤토리가 11 tables라고 주장하면서 실제 헤더와 §12.9.1은 10/12개 해석을 동시에 만든다",
      "evidence": [
        "§0은 DB 인벤토리를 11 tables라고 한다.",
        "§12 헤더는 여전히 'DB 인벤토리 (10 tables — executable schema)'로 남아 있다.",
        "§12.9.1은 '(별도 row per ComplianceRecord)' 및 id/FK/UNIQUE를 가진 물리 row처럼 정의한다.",
        "v0.5 changelog는 §12.9.1을 embedded라고 설명한다."
      ],
      "impact": "구현자가 PolicyReevaluateRecord를 JSON embedded child로 저장해야 하는지, 별도 table로 생성해야 하는지 결정할 수 없다. 별도 table이면 인벤토리는 12 tables가 되고, embedded이면 FK/UNIQUE 표현이 성립하지 않는다.",
      "recommendation": "둘 중 하나로 고정하라. 권장: `ContentMigrationPolicyReevaluateRecord`를 별도 table로 승격하고 인벤토리를 12 tables로 정정하거나, Batch.resultRecords JSONB로 embedded 정의 후 FK/UNIQUE를 제거하고 JSON schema/CHECK만 남겨라."
    },
    {
      "id": "CM5-02",
      "severity": "blocking",
      "category": "state-machine",
      "title": "3축 invariant CHECK가 transition matrix를 닫지 못해 불가능 조합을 DB가 허용한다",
      "evidence": [
        "§4.3.2 CHECK에서 `running`은 rollback_outcome='none'만 검사해 `running + blocked-manual-remediation-required`를 허용한다.",
        "`rolled-back`은 rollback_outcome만 검사해 `rolled-back + blocked-manual-remediation-required + partial`을 허용한다.",
        "`failed`는 remediation_status를 제한하지 않아 `failed + blocked-manual-remediation-required + none` 같은 전이 없는 조합을 허용한다.",
        "§4.3.1 abortRun은 `failed + cancellation-timeout-manual-review + failed`만 명시한다."
      ],
      "impact": "DB에 유효하지 않은 run substate가 저장될 수 있고, 운영 worker/SLA/rollback cleanup이 서로 다른 상태 해석을 하게 된다.",
      "recommendation": "primaryStatus별 remediationStatus와 rollbackOutcome의 허용 tuple을 CASE가 아니라 명시적 OR tuple로 닫아라. 예: `(primary='running' AND remediation IN ('none','cancellation-timeout-manual-review') AND rollback='none')`, `(primary='rolled-back' AND remediation='none' AND rollback IN ('full','partial'))`."
    },
    {
      "id": "CM5-03",
      "severity": "blocking",
      "category": "notification",
      "title": "step-compensated/run-aborted AuditAction cascade는 됐지만 NotificationEvent SLA가 닫히지 않았다",
      "evidence": [
        "content-migration §3.1은 `markStepCompensated`의 NotificationEvent를 `—`로 두고, `abortRun`은 `content-migration-run-failed`로 매핑한다.",
        "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스는 content-migration NotificationEvent 4종만 포함한다.",
        "REVIEW_WORKFLOW §10.2.1에는 `content-migration-step-compensated`, `content-migration-run-aborted` AuditAction 2종이 추가됐다."
      ],
      "impact": "운영 SLA에서 abort와 일반 run failed를 같은 이벤트로 처리할지, step compensation 완료를 알림 없이 audit만 남길지 불명확하다. 의료/개인정보 관련 수동 보정 작업은 운영자 확인 SLA가 필요하다.",
      "recommendation": "둘 중 하나를 SoT로 명시하라. 권장: `content-migration-run-aborted`는 별도 critical NotificationEvent로 REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 추가하고, `step-compensated`는 no-notification + audit-only SLA인지 또는 high inApp 이벤트인지 명시하라."
    },
    {
      "id": "CM5-04",
      "severity": "major",
      "category": "active-target-lock",
      "title": "ActiveTargetLock writeSetScopeDigest가 dry-run/apply 사이 step registry 변경에 안정적인지 정의되지 않았다",
      "evidence": [
        "§12.11은 `writeSetScopeDigest`를 step writeSetProjection canonical hash라고만 정의한다.",
        "§3.5 ApplyPreflightToken은 stepRegistryVersion을 CAS digest에 포함한다.",
        "§12.11 lock protocol은 runDryRun/runApply 시작 시 lock 획득만 말하고, dry-run 시점 projection과 apply 시점 projection의 동일성 검증은 별도 lock key 입력으로 닫지 않는다."
      ],
      "impact": "stepRegistryVersion 변경 시 ApplyPreflightToken은 fail할 수 있지만, lock key 산정이 이전/현재 projection 중 무엇인지 불명확해 dry-run/apply 충돌 방지 semantics가 흔들린다.",
      "recommendation": "`writeSetScopeDigest = HMAC(stepRegistryVersion + ordered stepKey + writeSetProjection canonical + targetEntityTypes)`로 고정하고, DryRunReport에 저장된 digest를 apply lock 획득에도 그대로 사용하라. registry drift 시 lock 획득 전 CAS fail로 종료하라."
    },
    {
      "id": "CM5-05",
      "severity": "major",
      "category": "apply-preflight",
      "title": "digestComputationMode와 invalidationInputs가 알고리즘에는 있지만 DryRunReport schema에는 없다",
      "evidence": [
        "§3.5는 DryRunReport row insert 시 digestComputationMode·invalidationInputs 기록을 요구한다.",
        "§12.2 ContentMigrationDryRunReport 필드에는 `digestComputationMode`, `invalidationInputs`, `cacheSourceRef`가 없다."
      ],
      "impact": "runApply가 snapshot/cache 모드의 invalidation precheck를 재현할 수 없다. CM4-02 비용/캐시 정정이 스키마 SoT에 남지 않아 구현자가 임의 column을 추가해야 한다.",
      "recommendation": "§12.2에 `digestComputationMode enum(full,snapshot,cache)`, `invalidationInputs JSONB closed`, `cacheSourceRef optional`, `generatedAt`을 추가하라."
    },
    {
      "id": "CM5-06",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 분해가 §12.9.1과 §4.8 중간 단계에 완전히 cascade되지 않았다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 `legalSensitiveEntityChanged`와 `legalEntityIdentityChanged`를 둔다.",
        "§4.8 step 4는 여전히 `legalEntityChanged` 산정이라고 쓴다.",
        "§12.9.1은 `priorReviewRequiredChanged`·`legalEntityChanged` boolean만 저장한다."
      ],
      "impact": "stale-flags-only override 판단 근거가 runtime result와 DB 기록에서 서로 달라진다. 사후 감사 시 왜 new-record-version이 강제됐는지 재구성하기 어렵다.",
      "recommendation": "§4.8과 §12.9.1에서 `legalEntityChanged`를 제거하고 `legalSensitiveEntityChanged`, `legalEntityIdentityChanged`, `fieldProjectionDiff`를 저장하라."
    },
    {
      "id": "CM5-07",
      "severity": "major",
      "category": "idempotency",
      "title": "markStepCompensated/abortRun은 command로 추가됐지만 §3.4 requestFingerprint 표에 없다",
      "evidence": [
        "§3.1과 §3.3은 `markStepCompensated`, `abortRun` input을 추가했다.",
        "§3.4 idempotencyKey + requestFingerprint 표는 definePlan/runApply/rollbackRun/skipStep/pause/resume/cancel/approve만 포함한다.",
        "§3.4 skipStep fingerprint는 제거된 `rollbackClass`를 아직 포함한다."
      ],
      "impact": "신규 운영 command의 same-request replay와 mismatched idempotency 처리가 구현마다 달라질 수 있다.",
      "recommendation": "§3.4에 두 command를 추가하고, skipStep fingerprint에서 rollbackClass를 제거하라. markStepCompensated는 `(stepResultId,idempotencyKey)`, abortRun은 `(runId,idempotencyKey)` scope로 닫는 것이 자연스럽다."
    },
    {
      "id": "CM5-08",
      "severity": "minor",
      "category": "standalone-readiness",
      "title": "v0.4 잔여 리스크 섹션이 v0.5 반영 후에도 그대로 남아 readiness 판단을 흐린다",
      "evidence": [
        "§10.3 제목이 `v0.4 잔여 리스크`로 남아 있다.",
        "§10.3은 §6.3 acceptance fixture violation path를 open이라고 하지만 v0.5 changelog와 §6.3은 28 INV happy+violation 반영을 주장한다."
      ],
      "impact": "문서 자체가 v1.0 후보인지 v0.5 보정 중인지 모순된다.",
      "recommendation": "§10.3을 v0.5 residual risk로 재작성하고, 이미 해결된 fixture 항목은 resolved로 이동하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§6.x", "§9.x", "§12.x"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [
      "§12 table inventory와 PolicyReevaluateRecord 저장 방식 불일치",
      "§4.3.2 DB CHECK invariant 미완성",
      "NotificationEvent/AuditAction SLA cascade 불완전",
      "DryRunReport schema가 digestComputationMode/invalidationInputs를 누락"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": false,
    "privacy_law_operable": "partially",
    "reason": "PII export CHECK 자체는 정정됐지만, 수동 보정/abort 알림 SLA와 policy reevaluate 법적 엔티티 변경 기록이 닫히지 않아 의료법·개인정보보호법 운영 감사 기준으로는 부족하다."
  },
  "required_changes_before_v1_0": [
    "§12 인벤토리와 §12.9.1 저장 모델을 단일 결정으로 정리",
    "§4.3.2를 tuple 기반 DB CHECK로 재작성",
    "REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 abort/compensation 알림 정책 명시",
    "§12.2 DryRunReport에 digestComputationMode/invalidationInputs/cacheSourceRef/generatedAt 추가",
    "§12.9.1의 legalEntityChanged 잔재 제거",
    "§3.4 requestFingerprint 표를 신규 command와 SkipStepInput 변경에 맞게 갱신"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 3,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM5-01, CM5-02, CM5-03은 안정판 차단. CM5-04~CM5-07은 v1.0 전 정합성 보강 필요."
  }
}
