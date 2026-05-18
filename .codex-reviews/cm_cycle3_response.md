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
      "recommendation": "writeSetManifest는 step별 전략을 허용하라. 소량은 row-id full Merkle, 대량은 DB RETURNING 기반 changed row manifest + rowcount + invariant query + sampled digest, append-only는 high watermark, deterministic transform은 expectedAfterProjection hash로 분리하라. 비용 상한과 snapshot isolation level도 명시하라."
    },
    {
      "id": "CM3-11",
      "severity": "major",
      "category": "state-machine",
      "title": "ContentMigrationRun status enum 12종이 lifecycle·rollback·manual review 상태를 한 enum에 섞는다",
      "evidence": [
        "§12.4 Run status enum은 pending·running·paused·completed·failed·cancelled·rollback-in-progress·blocked-manual-remediation-required·rolled-back·partial-rollback·rollback-failed·cancellation-timeout-manual-review를 포함한다.",
        "§4.3 resumeRun은 paused만 running으로 돌릴 수 있다.",
        "§4.2 rollback은 irreversible encountered 시 partial-rollback과 blocked-manual-remediation-required를 모두 언급한다."
      ],
      "impact": "manual remediation, cancellation timeout, rollback outcome이 서로 배타적인 run status인지 병렬 substate인지 불명확하다. 예를 들어 cancellation-timeout-manual-review에서 rollbackRun이 가능한지, blocked-manual-remediation-required 후 skipStep이 run status를 어디로 바꾸는지 정의되지 않는다.",
      "recommendation": "Run status를 primaryStatus와 substate로 분리하라. 예: primaryStatus=pending/running/paused/completed/failed/cancelled/rolling-back/rolled-back, remediationStatus=none/blocked/manual-review/timeout, rollbackOutcome=none/full/partial/failed. 또는 12종 상태의 transition matrix를 §4.3에 전개하라."
    },
    {
      "id": "CM3-12",
      "severity": "major",
      "category": "concurrency",
      "title": "동일 plan·target set에 대한 active run 동시 실행을 막는 partial unique invariant가 없다",
      "evidence": [
        "§12.4 ContentMigrationRun은 (planId, idempotencyKey) UNIQUE만 둔다.",
        "§9.3은 targetSelector row lock 불가를 runtime fail로 둔다.",
        "crm-sync는 CrmCredentialVersion active·rotating-target·committed partial unique 3종으로 동시 rotate를 DB에서 차단한다."
      ],
      "impact": "서로 다른 idempotencyKey로 같은 plan apply가 동시에 시작될 수 있다. row lock으로 일부 차단한다고 해도 targetSelector 단위 lock key나 active run uniqueness가 없어 dry-run/apply CAS와 read-only window가 경합한다.",
      "recommendation": "최소 `UNIQUE(planId) WHERE status IN ('pending','running','paused','rollback-in-progress','blocked-manual-remediation-required','cancellation-timeout-manual-review')`를 둬라. target selector snapshot 기반 병렬 plan을 허용하려면 targetSetDigest 단위 advisory lock 또는 active target lock table을 추가하라."
    },
    {
      "id": "CM3-13",
      "severity": "major",
      "category": "legal-approval",
      "title": "ContentMigrationLegalApproval이 DryRunReport와 8필드 CAS snapshot에 묶이지 않는다",
      "evidence": [
        "§12.3 LegalApproval UNIQUE는 (planId, classificationSnapshotDigest)뿐이다.",
        "§3.3 RunApplyInput은 expectedDryRunReportId를 받지만 expectedLegalApprovalId는 없다.",
        "§4.1 approvePlanLegalGate는 classificationSnapshot 포함만 명시한다."
      ],
      "impact": "legal approval이 어떤 dry-run diff, target set, policyVersionSnapshot, classifierVersion을 승인했는지 DB에서 강제되지 않는다. 같은 classificationSnapshotDigest가 유지된 채 targetSetDigest나 contentHashDigest가 바뀌면 CAS는 apply를 막을 수 있지만, 승인-보고서 연결 감사는 끊어진다.",
      "recommendation": "LegalApproval에 dryRunReportId, 8필드 snapshot, approvedDigestBundleHash를 저장하고 runApply는 legalGateRequired일 때 expectedLegalApprovalId를 요구하라. approval은 DryRunReport expiresAt 이후 무효로 처리하라."
    },
    {
      "id": "CM3-14",
      "severity": "major",
      "category": "notification-outbox",
      "title": "NotificationOutbox SQL은 backoff·claim race·status enum과 맞지 않는다",
      "evidence": [
        "§4.6 transient fail은 status=pending + last_error 갱신이라고만 한다.",
        "§12.10 status enum에는 failed가 있지만 §4.6 worker 흐름에서는 failed 상태를 사용하지 않는다.",
        "§1.2.1은 NotificationOutbox maxAttempts=5만 정의하고 backoff/nextAttemptAt은 없다."
      ],
      "impact": "실패한 outbox row가 즉시 재claim될 수 있고, failed 상태가 dead enum이 된다. attempts 증가 시점과 exhausted 판정도 모호해 5회보다 적거나 많은 dispatch가 발생할 수 있다.",
      "recommendation": "nextAttemptAt, lastAttemptAt, lockedAt stale reclaim, status transition을 풀 SQL로 닫아라. transient fail은 status='pending', nextAttemptAt=now()+backoff(attempts)로 두고, status='failed'를 제거하거나 retryable failed 상태로 정확히 사용하라."
    },
    {
      "id": "CM3-15",
      "severity": "major",
      "category": "policy-override",
      "title": "reportingMode override가 '더 안전한 방향만 허용'이라고 하지만 비교 규칙과 승인 흐름이 후속 cycle로 남아 있다",
      "evidence": [
        "§4.8은 config override로 stale-flags-only 또는 new-record-version 강제를 허용한다고 한다.",
        "같은 문장은 override가 risk-based 기본보다 안전한 방향만 허용되며 legal-reviewer 승인 필요하다고 쓰고 후속 cycle로 미룬다."
      ],
      "impact": "stale-flags-only override가 risk-based보다 안전한 경우는 거의 없는데도 enum상 허용되어 있다. 승인 절차가 후속으로 밀려 있어 고위험 policy 재평가가 stale flag만 남기고 끝날 수 있다.",
      "recommendation": "v1.0에서는 override를 new-record-version 강제만 허용하거나, stale-flags-only override는 Low risk + no legal entity + no priorReviewRequired change에서만 허용하는 CHECK를 명시하라. legal-reviewer approval workflow도 v0.3에서 닫아라."
    },
    {
      "id": "CM3-16",
      "severity": "major",
      "category": "spec-consistency",
      "title": "잔여 'v0.2 동일' 표현이 SoT를 비워 둔다",
      "evidence": [
        "§3.2 plan kind 정의는 'v0.2 §3.2 동일'이라고만 한다.",
        "§5.1 NotificationEventType은 'v0.2 동일'이라고만 한다.",
        "§5.3 NotificationEvent 매핑도 'v0.2 §4.7 동일'이라고만 한다.",
        "§4.4 retry exhausted vs autoRollbackOnFailure 우선순위도 'v0.2 §4.4 표 동일'이라고만 한다."
      ],
      "impact": "v0.3 단독 문서가 구현 SoT가 되지 못한다. 특히 NotificationEvent mapping은 REVIEW_WORKFLOW와 실제 cascade가 엇갈려 있는 영역이라 이전 버전 참조로는 검증할 수 없다.",
      "recommendation": "v0.3 문서에 plan kind 6종 상세, NotificationEventType 4종, NotificationEvent mapping, retry 우선순위 표를 모두 재전개하라. 이전 버전 참조는 changelog에서만 사용하라."
    },
    {
      "id": "CM3-17",
      "severity": "major",
      "category": "acceptance-traceability",
      "title": "INV-* 15종과 §9 fail/invariant가 1:1로 추적되지 않고 fixture는 v0.4·v0.5로 미뤄졌다",
      "evidence": [
        "§6.2는 INV-* 15종을 나열한다.",
        "§6.2 말미는 상세 acceptance test fixture를 v0.4·v0.5 cycle로 미룬다.",
        "§9.1-§9.5의 build/runtime/migration/warning 항목은 INV ID를 직접 참조하지 않는다."
      ],
      "impact": "문서상 불변식은 생겼지만 어떤 fail rule이 어떤 test로 고정되는지 추적할 수 없다. CAS, legal override, partial write, read-only window 같은 핵심 safety rule이 regression test 없이 남는다.",
      "recommendation": "§9 각 fail/warning 항목 뒤에 INV ID를 붙이고, §6.2에 acceptance fixture ID를 추가하라. v1.0 후보라면 fixture defer를 제거하고 최소 happy path + violation path를 각 INV마다 1개 이상 정의하라."
    },
    {
      "id": "CM3-18",
      "severity": "minor",
      "category": "semver",
      "title": "§1.1 SemVer 표가 classifier input catalog 변경을 다루지 않는다",
      "evidence": [
        "§1.1은 legalImpactClassifier 룰 추가·강화, 완화·class 제거를 다룬다.",
        "§4.7 classifier는 PII field catalog, targetEntityTypes, before/after media fields 등 외부 catalog에 의존한다."
      ],
      "impact": "룰 코드가 그대로라도 PII catalog나 entity field path catalog가 바뀌면 legalImpactClassificationDigest와 legalGateRequired 결과가 달라질 수 있다.",
      "recommendation": "PII field catalog, entity type enum, field projection catalog, priorReviewRequired trigger catalog 변경을 SemVer 표에 추가하라. classifierVersion 또는 policyVersionSnapshot 변경 조건도 명시하라."
    },
    {
      "id": "CM3-19",
      "severity": "minor",
      "category": "audit-metadata",
      "title": "AuditAction metadata 표가 requestFingerprint와 actorId를 일관되게 요구하지 않는다",
      "evidence": [
        "§3.1.1은 actorRole 필수 컬럼을 두지만 actorId는 표에 없다.",
        "plan-defined metadata에는 idempotencyKey가 있으나 requestFingerprint는 없다.",
        "run-started metadata에는 6필드 CAS라고 되어 있어 8필드 CAS와 표현이 어긋난다."
      ],
      "impact": "고위험 command의 idempotency 충돌 재현과 승인자 식별이 불완전하다. 8필드 CAS로 확장한 의도가 audit metadata에는 완전히 반영되지 않았다.",
      "recommendation": "모든 command audit metadata에 actorId, actorRole, idempotencyKey, requestFingerprint를 공통 required로 두고, run-started/dry-run-completed는 8필드 digest bundle hash와 개별 필드를 함께 기록하라."
    },
    {
      "id": "CM3-20",
      "severity": "minor",
      "category": "read-api",
      "title": "read API privacy 표가 StepResult 저장 구조와 연결되지 않는다",
      "evidence": [
        "§3.1 read API는 privacy class와 masking을 언급한다.",
        "§3.7은 masking 알고리즘을 crm-sync closed schema 패턴 재사용이라고 한다.",
        "§12.5 StepResult는 writeSetManifest JSON만 명시하고 input/output/diff 저장 column, PII class, export 금지 constraint는 없다."
      ],
      "impact": "operator·legal-reviewer별 masking 정책이 DB 저장 구조와 맞물리지 않는다. StepResult에 raw input/output이 JSON으로 저장되면 closed schema masking 전에 원문 PII가 노출될 수 있다.",
      "recommendation": "StepResult schema에 inputSummary, outputSummary, diffDisplayHints, rawArtifactRef, privacyClass, containsPii, exportAllowed를 분리하라. rawArtifactRef 접근 권한과 retention도 §12.5에 포함하라."
    },
    {
      "id": "CM3-21",
      "severity": "minor",
      "category": "doc-accuracy",
      "title": "문서 내 수량 표현이 실제 항목 수와 어긋난다",
      "evidence": [
        "§3.1 note는 '추가 AuditAction 3종'이라고 쓰면서 dry-run-completed·run-paused·run-resumed·rollback-triggered 4개를 나열한다.",
        "사용자 요청의 REVIEW_WORKFLOW cascade 항목도 run-failed를 포함하지만 REVIEW_WORKFLOW에는 이미 content-migration-run-failed가 존재한다."
      ],
      "impact": "cascade 범위 산정이 혼란스럽다. 실제 누락된 항목과 이미 cascade된 항목을 구분하지 못하면 다음 cycle에서 중복 enum 또는 누락 enum이 생길 수 있다.",
      "recommendation": "누락 목록을 정확히 4종으로 정정하라: dry-run-completed, run-paused, run-resumed, rollback-triggered. run-failed는 이미 REVIEW_WORKFLOW에 있으므로 metadata 보강 필요 여부만 별도 표시하라."
    }
  ],
  "required_cascade_or_next_changes": [
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "content-migration-dry-run-completed, content-migration-run-paused, content-migration-run-resumed, content-migration-rollback-triggered AuditAction cascade"
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
tokens used
69,392
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
      "recommendation": "writeSetManifest는 step별 전략을 허용하라. 소량은 row-id full Merkle, 대량은 DB RETURNING 기반 changed row manifest + rowcount + invariant query + sampled digest, append-only는 high watermark, deterministic transform은 expectedAfterProjection hash로 분리하라. 비용 상한과 snapshot isolation level도 명시하라."
    },
    {
      "id": "CM3-11",
      "severity": "major",
      "category": "state-machine",
      "title": "ContentMigrationRun status enum 12종이 lifecycle·rollback·manual review 상태를 한 enum에 섞는다",
      "evidence": [
        "§12.4 Run status enum은 pending·running·paused·completed·failed·cancelled·rollback-in-progress·blocked-manual-remediation-required·rolled-back·partial-rollback·rollback-failed·cancellation-timeout-manual-review를 포함한다.",
        "§4.3 resumeRun은 paused만 running으로 돌릴 수 있다.",
        "§4.2 rollback은 irreversible encountered 시 partial-rollback과 blocked-manual-remediation-required를 모두 언급한다."
      ],
      "impact": "manual remediation, cancellation timeout, rollback outcome이 서로 배타적인 run status인지 병렬 substate인지 불명확하다. 예를 들어 cancellation-timeout-manual-review에서 rollbackRun이 가능한지, blocked-manual-remediation-required 후 skipStep이 run status를 어디로 바꾸는지 정의되지 않는다.",
      "recommendation": "Run status를 primaryStatus와 substate로 분리하라. 예: primaryStatus=pending/running/paused/completed/failed/cancelled/rolling-back/rolled-back, remediationStatus=none/blocked/manual-review/timeout, rollbackOutcome=none/full/partial/failed. 또는 12종 상태의 transition matrix를 §4.3에 전개하라."
    },
    {
      "id": "CM3-12",
      "severity": "major",
      "category": "concurrency",
      "title": "동일 plan·target set에 대한 active run 동시 실행을 막는 partial unique invariant가 없다",
      "evidence": [
        "§12.4 ContentMigrationRun은 (planId, idempotencyKey) UNIQUE만 둔다.",
        "§9.3은 targetSelector row lock 불가를 runtime fail로 둔다.",
        "crm-sync는 CrmCredentialVersion active·rotating-target·committed partial unique 3종으로 동시 rotate를 DB에서 차단한다."
      ],
      "impact": "서로 다른 idempotencyKey로 같은 plan apply가 동시에 시작될 수 있다. row lock으로 일부 차단한다고 해도 targetSelector 단위 lock key나 active run uniqueness가 없어 dry-run/apply CAS와 read-only window가 경합한다.",
      "recommendation": "최소 `UNIQUE(planId) WHERE status IN ('pending','running','paused','rollback-in-progress','blocked-manual-remediation-required','cancellation-timeout-manual-review')`를 둬라. target selector snapshot 기반 병렬 plan을 허용하려면 targetSetDigest 단위 advisory lock 또는 active target lock table을 추가하라."
    },
    {
      "id": "CM3-13",
      "severity": "major",
      "category": "legal-approval",
      "title": "ContentMigrationLegalApproval이 DryRunReport와 8필드 CAS snapshot에 묶이지 않는다",
      "evidence": [
        "§12.3 LegalApproval UNIQUE는 (planId, classificationSnapshotDigest)뿐이다.",
        "§3.3 RunApplyInput은 expectedDryRunReportId를 받지만 expectedLegalApprovalId는 없다.",
        "§4.1 approvePlanLegalGate는 classificationSnapshot 포함만 명시한다."
      ],
      "impact": "legal approval이 어떤 dry-run diff, target set, policyVersionSnapshot, classifierVersion을 승인했는지 DB에서 강제되지 않는다. 같은 classificationSnapshotDigest가 유지된 채 targetSetDigest나 contentHashDigest가 바뀌면 CAS는 apply를 막을 수 있지만, 승인-보고서 연결 감사는 끊어진다.",
      "recommendation": "LegalApproval에 dryRunReportId, 8필드 snapshot, approvedDigestBundleHash를 저장하고 runApply는 legalGateRequired일 때 expectedLegalApprovalId를 요구하라. approval은 DryRunReport expiresAt 이후 무효로 처리하라."
    },
    {
      "id": "CM3-14",
      "severity": "major",
      "category": "notification-outbox",
      "title": "NotificationOutbox SQL은 backoff·claim race·status enum과 맞지 않는다",
      "evidence": [
        "§4.6 transient fail은 status=pending + last_error 갱신이라고만 한다.",
        "§12.10 status enum에는 failed가 있지만 §4.6 worker 흐름에서는 failed 상태를 사용하지 않는다.",
        "§1.2.1은 NotificationOutbox maxAttempts=5만 정의하고 backoff/nextAttemptAt은 없다."
      ],
      "impact": "실패한 outbox row가 즉시 재claim될 수 있고, failed 상태가 dead enum이 된다. attempts 증가 시점과 exhausted 판정도 모호해 5회보다 적거나 많은 dispatch가 발생할 수 있다.",
      "recommendation": "nextAttemptAt, lastAttemptAt, lockedAt stale reclaim, status transition을 풀 SQL로 닫아라. transient fail은 status='pending', nextAttemptAt=now()+backoff(attempts)로 두고, status='failed'를 제거하거나 retryable failed 상태로 정확히 사용하라."
    },
    {
      "id": "CM3-15",
      "severity": "major",
      "category": "policy-override",
      "title": "reportingMode override가 '더 안전한 방향만 허용'이라고 하지만 비교 규칙과 승인 흐름이 후속 cycle로 남아 있다",
      "evidence": [
        "§4.8은 config override로 stale-flags-only 또는 new-record-version 강제를 허용한다고 한다.",
        "같은 문장은 override가 risk-based 기본보다 안전한 방향만 허용되며 legal-reviewer 승인 필요하다고 쓰고 후속 cycle로 미룬다."
      ],
      "impact": "stale-flags-only override가 risk-based보다 안전한 경우는 거의 없는데도 enum상 허용되어 있다. 승인 절차가 후속으로 밀려 있어 고위험 policy 재평가가 stale flag만 남기고 끝날 수 있다.",
      "recommendation": "v1.0에서는 override를 new-record-version 강제만 허용하거나, stale-flags-only override는 Low risk + no legal entity + no priorReviewRequired change에서만 허용하는 CHECK를 명시하라. legal-reviewer approval workflow도 v0.3에서 닫아라."
    },
    {
      "id": "CM3-16",
      "severity": "major",
      "category": "spec-consistency",
      "title": "잔여 'v0.2 동일' 표현이 SoT를 비워 둔다",
      "evidence": [
        "§3.2 plan kind 정의는 'v0.2 §3.2 동일'이라고만 한다.",
        "§5.1 NotificationEventType은 'v0.2 동일'이라고만 한다.",
        "§5.3 NotificationEvent 매핑도 'v0.2 §4.7 동일'이라고만 한다.",
        "§4.4 retry exhausted vs autoRollbackOnFailure 우선순위도 'v0.2 §4.4 표 동일'이라고만 한다."
      ],
      "impact": "v0.3 단독 문서가 구현 SoT가 되지 못한다. 특히 NotificationEvent mapping은 REVIEW_WORKFLOW와 실제 cascade가 엇갈려 있는 영역이라 이전 버전 참조로는 검증할 수 없다.",
      "recommendation": "v0.3 문서에 plan kind 6종 상세, NotificationEventType 4종, NotificationEvent mapping, retry 우선순위 표를 모두 재전개하라. 이전 버전 참조는 changelog에서만 사용하라."
    },
    {
      "id": "CM3-17",
      "severity": "major",
      "category": "acceptance-traceability",
      "title": "INV-* 15종과 §9 fail/invariant가 1:1로 추적되지 않고 fixture는 v0.4·v0.5로 미뤄졌다",
      "evidence": [
        "§6.2는 INV-* 15종을 나열한다.",
        "§6.2 말미는 상세 acceptance test fixture를 v0.4·v0.5 cycle로 미룬다.",
        "§9.1-§9.5의 build/runtime/migration/warning 항목은 INV ID를 직접 참조하지 않는다."
      ],
      "impact": "문서상 불변식은 생겼지만 어떤 fail rule이 어떤 test로 고정되는지 추적할 수 없다. CAS, legal override, partial write, read-only window 같은 핵심 safety rule이 regression test 없이 남는다.",
      "recommendation": "§9 각 fail/warning 항목 뒤에 INV ID를 붙이고, §6.2에 acceptance fixture ID를 추가하라. v1.0 후보라면 fixture defer를 제거하고 최소 happy path + violation path를 각 INV마다 1개 이상 정의하라."
    },
    {
      "id": "CM3-18",
      "severity": "minor",
      "category": "semver",
      "title": "§1.1 SemVer 표가 classifier input catalog 변경을 다루지 않는다",
      "evidence": [
        "§1.1은 legalImpactClassifier 룰 추가·강화, 완화·class 제거를 다룬다.",
        "§4.7 classifier는 PII field catalog, targetEntityTypes, before/after media fields 등 외부 catalog에 의존한다."
      ],
      "impact": "룰 코드가 그대로라도 PII catalog나 entity field path catalog가 바뀌면 legalImpactClassificationDigest와 legalGateRequired 결과가 달라질 수 있다.",
      "recommendation": "PII field catalog, entity type enum, field projection catalog, priorReviewRequired trigger catalog 변경을 SemVer 표에 추가하라. classifierVersion 또는 policyVersionSnapshot 변경 조건도 명시하라."
    },
    {
      "id": "CM3-19",
      "severity": "minor",
      "category": "audit-metadata",
      "title": "AuditAction metadata 표가 requestFingerprint와 actorId를 일관되게 요구하지 않는다",
      "evidence": [
        "§3.1.1은 actorRole 필수 컬럼을 두지만 actorId는 표에 없다.",
        "plan-defined metadata에는 idempotencyKey가 있으나 requestFingerprint는 없다.",
        "run-started metadata에는 6필드 CAS라고 되어 있어 8필드 CAS와 표현이 어긋난다."
      ],
      "impact": "고위험 command의 idempotency 충돌 재현과 승인자 식별이 불완전하다. 8필드 CAS로 확장한 의도가 audit metadata에는 완전히 반영되지 않았다.",
      "recommendation": "모든 command audit metadata에 actorId, actorRole, idempotencyKey, requestFingerprint를 공통 required로 두고, run-started/dry-run-completed는 8필드 digest bundle hash와 개별 필드를 함께 기록하라."
    },
    {
      "id": "CM3-20",
      "severity": "minor",
      "category": "read-api",
      "title": "read API privacy 표가 StepResult 저장 구조와 연결되지 않는다",
      "evidence": [
        "§3.1 read API는 privacy class와 masking을 언급한다.",
        "§3.7은 masking 알고리즘을 crm-sync closed schema 패턴 재사용이라고 한다.",
        "§12.5 StepResult는 writeSetManifest JSON만 명시하고 input/output/diff 저장 column, PII class, export 금지 constraint는 없다."
      ],
      "impact": "operator·legal-reviewer별 masking 정책이 DB 저장 구조와 맞물리지 않는다. StepResult에 raw input/output이 JSON으로 저장되면 closed schema masking 전에 원문 PII가 노출될 수 있다.",
      "recommendation": "StepResult schema에 inputSummary, outputSummary, diffDisplayHints, rawArtifactRef, privacyClass, containsPii, exportAllowed를 분리하라. rawArtifactRef 접근 권한과 retention도 §12.5에 포함하라."
    },
    {
      "id": "CM3-21",
      "severity": "minor",
      "category": "doc-accuracy",
      "title": "문서 내 수량 표현이 실제 항목 수와 어긋난다",
      "evidence": [
        "§3.1 note는 '추가 AuditAction 3종'이라고 쓰면서 dry-run-completed·run-paused·run-resumed·rollback-triggered 4개를 나열한다.",
        "사용자 요청의 REVIEW_WORKFLOW cascade 항목도 run-failed를 포함하지만 REVIEW_WORKFLOW에는 이미 content-migration-run-failed가 존재한다."
      ],
      "impact": "cascade 범위 산정이 혼란스럽다. 실제 누락된 항목과 이미 cascade된 항목을 구분하지 못하면 다음 cycle에서 중복 enum 또는 누락 enum이 생길 수 있다.",
      "recommendation": "누락 목록을 정확히 4종으로 정정하라: dry-run-completed, run-paused, run-resumed, rollback-triggered. run-failed는 이미 REVIEW_WORKFLOW에 있으므로 metadata 보강 필요 여부만 별도 표시하라."
    }
  ],
  "required_cascade_or_next_changes": [
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "content-migration-dry-run-completed, content-migration-run-paused, content-migration-run-resumed, content-migration-rollback-triggered AuditAction cascade"
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
