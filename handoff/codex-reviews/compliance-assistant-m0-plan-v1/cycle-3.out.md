Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3a43-c11f-7bb3-8f16-354ab7a4719c
--------
user
Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.3 — **cycle 3**. cycle 2 5 finding patch + 새 blocking/major/minor 확인.

## Cycle 2 patch (5 findings, blocking 3 · major 1 · minor 1)

| # | severity | title | patch |
|---|---|---|---|
| CAM2-01 | blocking | ComplianceCheckResult SoT 7 필드만 | summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. findingsBySeverity.info 키 포함 |
| CAM2-02 | blocking | LegalDocument check() 우회 일관 | submitForReview 분기에서 buildLegalDocumentExemptEnvelope() 호출 + check() 내부 LegalDocument 진입 시 throw |
| CAM2-03 | blocking | C0016 sentinel backfill 6 entity | Article · TreatmentPage · LegalDocument(no-op) · FAQ(no-op) · Publication · MediaAppearance 모두 명시 + NULL 검증 6건 + VALIDATE 6건 |
| CAM2-04 | major | unknown role throw | calculateFinalRoles 안 silently filter → ComplianceConfigError throw. evaluatePublishable try/catch → configError 반환 |
| CAM2-05 | minor | "manual-review 큐 1종" marker | cycle 1 patch 안 이미 정정 완료 |

## SoT to read (cycle 1·2 동일)

1. `docs/features/compliance-assistant.md` v1.0
2. `docs/admin/REVIEW_WORKFLOW.md`
3. `docs/core/DATA_MODEL.md` C-10
4. `docs/compliance/RISK_LEVELS.md`
5. `docs/core/CONTENT_STANDARDS.md` § 7 (특히 § 7.1.1.1 LegalDocument 면제 · § 7.2 ComplianceCheckResult 7 필드)
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1
8. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0

## Verification

cycle 2 의 5 patch 각각 PASS 검증 + 새 blocking/major/minor 확인. 짧게.

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=N

## cycle 2 patch 검증
- CAM2-01: PASS/FAIL + 한 줄
- CAM2-02: PASS/FAIL
- CAM2-03: PASS/FAIL
- CAM2-04: PASS/FAIL
- CAM2-05: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 2 의 5건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
seo-geo 스킬은 검색/AI 노출 최적화 작업용이라 이번 문서 리뷰에는 적용하지 않겠습니다. 먼저 계획서와 지정된 SoT 문서에서 관련 조항을 읽고, cycle 2 패치 5건을 기준으로 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/compliance/RISK_LEVELS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/features/compliance-assistant.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 779ms:
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
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
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
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

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
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted"           // CM4-05 — abortRun
  // 인프라 결정 cascade (INFRA2-02·08)
  | "service-role-invoked"                    // INFRA2-02 — service_role break-glass 사용 추적
  | "instance-switched"                       // INFRA2-08 — super-admin cross-instance 전환
  // Spike 결정 cascade (SPIKE1-13·SPIKE2-04)
  | "signed-url-issued"                       // R2 signed URL 발급 (signature 미저장·prefix·objectKey만)
  | "signed-url-revocation-requested";        // SPIKE2-04 정정 — 즉시 revoke 불가능 (R2/S3 presigned URL은 bearer). 운영자 revoke 요청 → credential rotation 또는 object key rotation으로 후속 처리
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


 succeeded in 794ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.24
> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
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

- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |

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
| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
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
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
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
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |

> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).

### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)

> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `instanceId` | `Slug` | ✅ | |
| `title` | `string` | ✅ | 학술 논문 제목 (1~300자) |
| `authors` | `string[]` | ✅ | 저자 이름 리스트 (min 1) |
| `journal` | `string` | optional | 학술지명 |
| `publishedDate` | `Date` | ✅ | 학술지 게재일 |
| `doi` | `string` | optional | DOI · regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` |
| `pubmedId` | `string` | optional | PubMed ID · regex `^[0-9]{1,9}$` |
| `url` | `URL` | ✅ | 외부 dereferenceable URL |
| `thumbnailUrl` | `URL` | optional | |
| `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
| `authorDoctorId` | `Ref<C-02>` | optional | 본 clinic doctor 가 저자일 때 (same-tenant composite FK) |
| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
| `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** — 외부 인용 entity |
| `publishedAt` | `Date` | conditional | status='published' 시 required |
| `metadata` | `Record<string, unknown>` | optional | |
| `createdAt` / `updatedAt` | `Date` | ✅ | |

**검수 · 위험도 · Schema**:
- CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
- RISK_LEVELS § 2: Low fixed
- Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)

### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)

> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `instanceId` | `Slug` | ✅ | |
| `title` | `string` | ✅ | 영상/방송 제목 (1~300자) |
| `channelName` | `string` | ✅ | 방송사/유튜브 채널명 |
| `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
| `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
| `durationSeconds` | `number` | optional | JSON-LD `duration: PT<seconds>S` |
| `url` | `URL` | ✅ | 외부 URL |
| `thumbnailUrl` | `URL` | optional | |
| `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
| `authorDoctorId` | `Ref<C-02>` | optional | 출연 doctor (same-tenant composite FK) |
| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
| `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** |
| `publishedAt` | `Date` | conditional | status='published' 시 required |
| `metadata` | `Record<string, unknown>` | optional | |
| `createdAt` / `updatedAt` | `Date` | ✅ | |

**검수 · 위험도 · Schema**:
- CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
- RISK_LEVELS § 2: Low fixed
- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)

EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.

**풀명세 요약** (§ 4 안 풀명세 SoT 참조):
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 3~99자 |
| `question` | `string` | ✅ | 10~200자 |
| `answer` | `string` (Markdown) | ✅ | 50~2000자. public HTML render = `renderMarkdownToHtml` · JSON-LD `Answer.text` = `renderMarkdownToPlainText` |
| `displayOrder` | `number` | ✅ | 어드민 입력 순서 |
| `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
| `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
| `relatedConditionId` | `Ref<C-11>` | optional | C-11 합류 후 |
| `authorDoctorId` | `Ref<C-02>` | optional | 답변 doctor |
| `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
| `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |

**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
**검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).

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
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
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
   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
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
| 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
| 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 802ms:
# compliance-assistant M0 vertical slice plan (v0.3·draft·2026-05-18)

> **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 2 **5 finding** (blocking 3·major 1·minor 1) 전건 수용 patch. 수렴 28 → 5. 누계 cycle 1+2 = 33 findings.

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
- `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯 · § 7.1 publishable 6조건 · § 9.1.1 알림 정책
- `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — 풀명세 (recordPhase · recordVersion · mediaThresholdAssessment · mediaThresholdOperationalInput · staleFlags · warningAck · llmAssist · attachments · featureContentType · priorReviewSubmissionId)
- `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference (MAX 결합) · § 3 RiskRule · § 4 finalRoles · § 6 High 강제 검수
- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-07/12 부분 해소 대상 (EC-DEFER-05 미해소)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 발행 게이트 부분 해소 대상 (NotificationEvent 분리)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 위치 정책 · base role
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.4 (Drizzle SoT)
  - `apps/web/src/components/forms/{ArticleForm, FaqForm, ...}.tsx` (status select)
  - `apps/web/src/lib/action-context.ts` (assertActionEligibility 패턴)

> **표기 규칙 (cycle 1 CAM-26 정정)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `record_phase` (DB) ↔ `recordPhase` (TS).

## 1. 목적과 범위

### 1.1 목적 — cycle 1 CAM-01·09·21 정정

- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
- **EC-DEFER-12 부분 해소**: 6 entity published 발행 unlock — **수동 검수 게이트 통과 시 만**. EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) 는 **미해소** — CA-DEFER-01/02 동반 합류 시. M0 stub 의 manualReview 기반 발행은 자동 룰 검수 부재 risk 인지.
- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + manual-review queue 활성화 + multi-role AND 게이트 (operator·medical·legal — client 미합류 CA-DEFER-10).
- **자동 검수(룰) 미합류 marker**: check() stub — 항상 manualReview 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass · 단 High 입력 시 가상 finding). 실 ruleCatalog/composite/LLM은 CA-DEFER-01·02·03.
- **LegalDocument 자동 검수 면제 (CAM-09 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. auto_check_result 슬롯에 명시적 면제 envelope `{automatedDecision:"pass", exemptReason:"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}` 저장.

### 1.2 범위 (포함) — cycle 1 CAM-02·10·14·15·17·18·19 정정

| 항목 | 비고 |
|---|---|
| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
| check() stub (CAM-03·04·05·09 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로** (buildBlocked · findingsBySeverity · summary 등 모두 포함). pageRiskLevel 등은 wrapper `ComplianceCheckEnvelope` 안 분리. **pageRiskLevel = maxRisk(input.metadata.explicitRiskLevel ?? "Low", input.metadata.inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 check() 호출 우회 — auto_check_result 슬롯에 면제 envelope 직접 저장** |
| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
| `assertReviewerEligibility` helper | role 별 admin_user flag 검증 |
| `published_content_compliance_guard` 트리거 (CAM-08 정정) | BEFORE INSERT/UPDATE ON each entity (article·treatment_page·legal_document·faq·publication·media_appearance) — `NEW.status='published'` 시 referenced compliance_record.record_phase='published' + content_type 일치 + content_ref 매칭 (slug) + instance_id 일치 검증. 위반 시 RAISE EXCEPTION |
| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
| vitest scenarios 16건 (CAM-28 정합) | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (4 case) · status 전이 안전성 (3 case) · transition table 무결성 (1 case) |

### 1.3 비범위 (defer) — CAM-11·12·21 정정

| 항목 | Defer to | marker |
|---|---|---|
| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
| RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX 결합) — M0 stub은 입력 결합 MAX만 처리 | CA-DEFER-01 동반 | CA-DEFER-02 |
| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
| MediaThresholdAssessment · mediaThresholdOperationalInput · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
| ComplianceRecord 풀 컬럼 (mediaThresholdAssessment · mediaThresholdOperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · **featureContentType** · client 슬롯) — 각 CA-DEFER phase 매핑 | 각 CA-DEFER phase | CA-DEFER-13 |
| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
| content-gate 자동 큐 진입 (ComplianceCheckResult.gateRequired=true 시) — M0 manual-review 큐 vs content-gate 큐 분리 운영 | CA-DEFER-01 동반 (룰 합류 시 content-gate 큐 활성화) | CA-DEFER-15 |
| Feature contentType (DATA_MODEL C-10 v0.5 `Feature` 토큰 + featureContentType) | CA-DEFER-01 + Feature 합류 시 | CA-DEFER-16 |

## 2. 데이터 모델 결정

### 2.1 C0014 `compliance_record` 신규 table (CA-SCHEMA-01) — CAM-10·11·12·25 정정

```sql
-- packages/core-content/migrations/C0014_compliance_record.sql
-- SoT: DATA_MODEL § 4 C-10 ComplianceRecord (v0.6+ 17종 contentType enum)
-- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조

CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');

-- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit 가능, 나머지는 allowlist app layer 검증).
CREATE TYPE compliance_content_type AS ENUM (
  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
  'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
  'Feature', 'Publication', 'MediaAppearance'
);

CREATE TABLE compliance_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  page_risk_level risk_level NOT NULL,
  article_type TEXT,
  inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_check_result JSONB NOT NULL,
  peer_reviewer UUID,                          -- admin_user.id (operator)
  peer_reviewed_at TIMESTAMPTZ,
  physician_approver UUID,                      -- admin_user.id (medical)
  physician_approved_at TIMESTAMPTZ,
  legal_counsel UUID,                           -- admin_user.id (legal)
  legal_counsel_at TIMESTAMPTZ,
  client_approver UUID,                         -- M0 미사용 (CA-DEFER-10)
  client_approved_at TIMESTAMPTZ,
  prior_review_required BOOLEAN NOT NULL DEFAULT false,  -- M0 false fixed
  prior_review_submission_id TEXT,              -- CA-DEFER-08
  prior_review_passed BOOLEAN,                  -- CA-DEFER-08
  published_at TIMESTAMPTZ,
  published_by UUID,                            -- admin_user.id
  record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  record_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  CONSTRAINT compliance_record_published_requires_at CHECK (
    record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  ),
  CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
    record_phase <> 'published' OR content_type <> 'LegalDocument'
    OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_med_high_requires_physician CHECK (
    record_phase <> 'published' OR page_risk_level = 'Low'
    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_published_requires_peer CHECK (
    record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';

ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON compliance_record FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;
```

**결정 (CA-SCHEMA-01·02·03)**:
- (CAM-25 정정) C0014 = C-**10** ComplianceRecord (DATA_MODEL § 4 SoT). 잘못 표기된 C-08 → C-10 정정.
- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
- (CAM-13 정정) ReviewQueueEntry status `cancelled` 제거 — open/in-progress/resolved 3종 만.
- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.

### 2.2 C0015 `review_queue_entry` 신규 table (CA-SCHEMA-04) — CAM-02·13·14·15 정정

```sql
-- packages/core-content/migrations/C0015_review_queue_entry.sql
-- SoT: REVIEW_WORKFLOW § 3 큐 3종. M0 v0.1 manual-review 1종 활성

-- CAM-02 정정: manual-review queue type 신설 (수동 검수 큐). content-gate (ruleCatalog gateRequired) · warning · stale 은 ADD VALUE cascade.
CREATE TYPE review_queue_type AS ENUM ('manual-review');
-- CAM-13 정정: cancelled 제거. open/in-progress/resolved 3종 만.
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
-- CAM-15 정정: required_roles enum array 운영
CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  -- CAM-14 정정: M0 manual-review 는 ComplianceRecord pre-publish 참조 필수. NOT NULL.
  compliance_record_id UUID NOT NULL,
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
  -- CAM-15 정정: text[]도 enum 검증이 어려워 approver_role[] array 운영
  required_roles approver_role[] NOT NULL,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
    status <> 'resolved' OR resolved_at IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
    status <> 'resolved' OR resolution_type IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
    REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
  WHERE status IN ('open', 'in-progress');
CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref)
  WHERE status IN ('open', 'in-progress');

ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON review_queue_entry FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
```

**결정 (CA-SCHEMA-04~06)**:
- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
- (CAM-13) `cancelled` 제거 — open/in-progress/resolved 3종.

### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정

```sql
-- packages/core-content/migrations/C0016_status_unlock.sql
-- CAM-07 정정: NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리.
-- CAM-08 정정: published_content_compliance_guard trigger 추가 — entity.status='published' 시 record_phase 매칭 검증.

-- (Step 1) LegalDocument · FAQ CHECK 해제
ALTER TABLE legal_document DROP CONSTRAINT legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint
ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity 모두 (CAM2-03 정정).
--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).

-- (4-a) Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (4-b) TreatmentPage — risk_level 컬럼 존재
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  COALESCE(t.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
-- (4-d) FAQ — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op).
-- (4-e) Publication — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

-- (4-f) MediaAppearance — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE — 6 entity 모두.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;

-- (Step 7) published_content_compliance_guard trigger — CAM-08 정정.
--   BEFORE INSERT/UPDATE ON each entity. status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 일치 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  IF TG_TABLE_NAME = 'article' AND record_row.content_type <> 'Article' THEN
    RAISE EXCEPTION 'content_type mismatch: % vs %', TG_TABLE_NAME, record_row.content_type;
  END IF;
  -- treatment_page · legal_document · faq · publication · media_appearance 동일 매핑 (반복 생략)
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'content_ref mismatch: % vs %', record_row.content_ref, NEW.slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
-- treatment_page · legal_document · faq · publication · media_appearance 동일 trigger (반복 생략)
```

**결정 (CA-SCHEMA-07~10)**:
- (CAM-07) NOT VALID + sentinel backfill + VALIDATE 단계 분리 — 기존 published row 우회 안전. 운영 시 sentinel ComplianceRecord 식별자 `metadata @> '{"sentinel":true}'` 로 추후 republish 흐름 가이드 marker.
- (CAM-08) `published_content_compliance_guard` BEFORE trigger — DB level 발행 게이트 검증. CHECK constraint 로는 cross-table reference 검증 불가하므로 trigger 사용 명시.
- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.

## 3. AND 게이트 평가 결정 — CAM-04·05·06·16 정정

### 3.1 finalRoles 계산 (CA-GATE-01) — CAM2-04 정정

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

const KNOWN_ROLES = new Set<string>(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력. unknown role 감지 시
 *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
 *   error 변환 → 운영자가 룰 카탈로그 정정. M0 v0.1 stub 은 빈 array 보장이므로 effective no-op.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
    if (r === "client") {
      // M0 v0.1: client 역할 미합류 (CA-DEFER-10). 룰이 client 를 요구하면 fail closed.
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);  // 위 검증으로 narrow safe
  }
  return Array.from(roles).sort();  // canonical sort
}
```

### 3.2 maxRisk MAX 결합 (CA-GATE-02) — CAM-04 정정

```typescript
// apps/web/src/lib/compliance/risk.ts
const ORDER: Record<RiskLevel, number> = { "Low": 0, "Medium": 1, "High": 2 };
export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) if (ORDER[l] > ORDER[max]) max = l;
  return max;
}
```

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정, CAM2-04 추가 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(
      contentType, record.page_risk_level, record.prior_review_required,
      autoCheck.requiredApproverRoles ?? [],
    );
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }
  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck.automatedDecision === "block") reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
  // (6) warning 강제 처리 정책 — M0 stub: warningAck 미구현 (CA-DEFER-05 · 항상 충족 가정)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
```

**결정**:
- (CAM-06) publishable evaluator 가 REVIEW_WORKFLOW § 7.1 6조건 모두 evaluate. M0 stub 미구현 영역 (priorReview·staleFlags·warningAck) 은 안전 방향 fail closed — priorReviewRequired=true 면 publish 금지. M0 v0.1 priorReviewRequired=false fixed 라 effective no-op.
- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.

## 4. check() stub 결정 — CAM-03·04·05·09 정정, CAM2-01·02 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정

CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// ComplianceCheckResult 는 CONTENT_STANDARDS § 7.2 SoT 그대로 import — 7 필드만.
//   summary · catalogVersion · catalogHash · exemptReason 은 result 안 들어가지 않음.

export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
  };
};

// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
//   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel: input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low",
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
      manualReview: false,
      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
    },
  };
}
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04·05) — CAM2-02 정정

**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.

```typescript
// apps/web/src/lib/compliance/check.ts
import type { Finding } from "@glitzy/core-content";

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
      "Use buildLegalDocumentExemptEnvelope() instead."
    );
  }

  // MAX 결합 (격하 금지 — CAM-04)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // High 입력 시 가상 finding (CAM-05). Finding shape 는 CONTENT_STANDARDS § 7.2 Finding SoT.
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      category: "risk-level-virtual",
      pattern: "",
      severity: "content-gate",
      location: { start: 0, end: 0 },
      requiredApproverRoles: ["medical"],
      triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  // ComplianceCheckResult SoT — 7 필드만. summary/catalogVersion/catalogHash 등 추가 필드 없음.
  return {
    result: {
      automatedDecision,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      findingsBySeverity: {
        fail: 0,
        "content-gate": gateRequired ? 1 : 0,
        warning: 0,
        info: 0,
      },
      requiredApproverRoles: gateRequired ? ["medical"] : [],
      findings,
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-06)

```typescript
// submitForReview 안 호출 흐름:
const envelope = contentType === "LegalDocument"
  ? buildLegalDocumentExemptEnvelope(input)
  : await check(input);

// compliance_record INSERT
INSERT INTO compliance_record (..., page_risk_level, auto_check_result, metadata, ...)
VALUES (..., envelope.meta.pageRiskLevel, envelope.result, jsonb_build_object(
  'manualReview', envelope.meta.manualReview,
  'catalogVersion', envelope.meta.catalogVersion,
  'catalogHash', envelope.meta.catalogHash,
  ...(envelope.meta.exemptReason ? { 'exemptReason': envelope.meta.exemptReason } : {})
), ...)
```

- `compliance_record.auto_check_result` = `envelope.result` (CONTENT_STANDARDS § 7.2 SoT 그대로)
- `compliance_record.metadata` = envelope.meta 의 추가 영역 (pageRiskLevel 은 별도 컬럼 + metadata 양쪽 기록 권장)
- M0 stub 의 High 가상 finding 시 gateRequired=true — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.

## 5. 어드민 UI 결정 — CAM-18 정정

### 5.1 /admin/{slug}/review-queue 화면 (CA-UI-01)

list page:
- queue_type='manual-review' + status IN ('open', 'in-progress') row
- columns: 콘텐츠 유형 · 콘텐츠 ref · pageRiskLevel · finalRoles · status · priority · SLA 마감 · assigned

detail page:
- 콘텐츠 본문 미리보기 (read-only)
- ComplianceRecord 슬롯 표시 (operator·medical·legal — 각 슬롯의 reviewer 이름 + timestamp)
- 본인 역할에 한해 approve/reject 폼 노출 (assertReviewerEligibility flag 확인)
- 거부 사유 textarea (50자 이상 required)

### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정

form 안 `status` field 는:
- 현재 row 의 status 표시 만 (read-only badge — `<span>` 또는 disabled `<select>`)
- 사용자 직접 status 변경 불가 — 모든 status 전이는 workflow action 버튼 통해서만
- 기존 save action (`saveArticle` 등) 안 status field 무시 — 서버 측에서 current row.status 보존 (form FormData 안 status 값 무시)
- assertTransitionAllowed 검증은 workflow action 안 수행

### 5.3 entity edit page 안 액션 버튼 (CA-UI-03)

각 edit page 안 추가 버튼:
- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
- "검수 큐 진입" 후에는 form 자체 read-only — 검수자 액션은 /review-queue/{entryId} 에서

## 6. server action 결정 — CAM-17·20 정정

### 6.1 4 server action 시그니처 (CA-ACTION-01)

`apps/web/src/lib/compliance/transitions.ts` (helper) + entity별 actions.ts 안 thin wrapper.

```typescript
// transitions.ts
export async function submitForReview(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string,
  contentRow: { id: string; status: string; risk_level?: string | null },
): Promise<{ recordId: string; entryId: string }>;

// CAM-17 정정 — approve 첫 호출이 atomic open→in-progress + status review-queued→in-review 동시 전이.
//   재approve 시 status=in-review 유지.
export async function approveContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, role: ApproverRole, actorUserId: string,
): Promise<{ allApproved: boolean; entryStatus: "in-progress" | "resolved" }>;

export async function rejectContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, reason: string, role: ApproverRole, actorUserId: string,
): Promise<void>;

export async function publishContent(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string, recordId: string, actorUserId: string,
): Promise<void>;
```

### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정

REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade:

| eventType | trigger | payload shape |
|---|---|---|
| `content-submitted-for-review` | submitForReview action 성공 | `{contentType, contentRef, recordId, entryId, finalRoles, pageRiskLevel}` |
| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
| `content-published` | publishContent action 성공 | `{contentType, contentRef, recordId, recordVersion}` |

emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).

### 6.3 advisory lock (CA-ACTION-02) — CAM-27 정정

```typescript
// approveContent 안 race 차단
const key = hashUuidTo64Bit(recordId);  // CAM-27 정정 — hashtextextended(uuid::text) 또는 UUID 의 16바이트를 2개 int8 로 분할
await tx`SELECT pg_advisory_xact_lock(${key})`;
```

CAM-27 정정 — `hashtext()` 32-bit 충돌 가능성 → `hashtextextended()` (64-bit) 또는 UUID 자체를 2개 int 로 분리 사용 (`pg_advisory_xact_lock(int1, int2)`). M0 v0.1 채택 = `hashtextextended('compliance:' || record_id, 0)`.

### 6.4 status 전이 table (CA-ACTION-06)

```typescript
// transitions.ts
const TRANSITIONS: Record<string, string[]> = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};
```

REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.

## 7. § 8.1 시나리오 cascade — CAM-28 정정

| # | 시나리오 | 통과 기준 | 검증 방식 |
|---|---|---|---|
| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · auto_check_result.exemptReason='LegalDocument-...' | LegalDocument check() 우회 + 면제 envelope | vitest |
| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
| 12 | check() stub High 입력 (explicit or inferred) → 가상 finding `m0-stub-risk-level-high-gate` 주입 · gateRequired=true · automatedDecision='gate' | M0 High 가상 finding | vitest |
| 13 | check() stub LegalDocument 입력 → 면제 envelope · exemptReason='LegalDocument-...' · manualReview=false | LegalDocument 면제 (CAM-09) | vitest |
| 14 | published entity가 record_phase='pre-publish' record 참조 시도 → trigger `published_content_compliance_guard` RAISE | DB level 발행 게이트 무결성 | e2e |
| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0014 compliance_record migration | packages/core-content/migrations/C0014_compliance_record.sql |
| 2 | C0015 review_queue_entry migration | C0015_review_queue_entry.sql |
| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
| 5 | Compliance types + check() stub + envelope wrapper | apps/web/src/lib/compliance/types.ts + check.ts |
| 6 | maxRisk + final-roles + publishable-check + transitions helper | apps/web/src/lib/compliance/{risk, final-roles, publishable-check, transitions}.ts |
| 7 | assertReviewerEligibility helper | apps/web/src/lib/compliance/eligibility.ts |
| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
| 9 | /admin/{slug}/review-queue/page.tsx (list) | (admin) route |
| 10 | /admin/{slug}/review-queue/[entryId]/page.tsx (detail) + actions.ts | (admin) route + ReviewEntryApprovalForm component |
| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
| 12 | 6 entity edit page 안 "검수 요청" / "발행" 액션 버튼 + 기존 save action 안 status field 무시 | edit pages |
| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
| 14 | audit emit 4종 (REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade) | (각 server action 안 emitAuditEvent + CA-CASCADE-06 doc patch) |
| 15 | vitest scenarios 1~16 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 Phase Alpha 합류
- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
- `CA-DEFER-02`: RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX) — M0 stub 은 입력 MAX 만
- `CA-DEFER-04`: 캐시 2종 + cacheKey
- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
- `CA-DEFER-07`: request-changes / delegate 액션
- `CA-DEFER-11`: autoCheckResult.findings 풀명세
- `CA-DEFER-15` (CAM-02 신설): content-gate 자동 큐 진입 (ruleCatalog 합류 시)
- `CA-DEFER-16` (CAM-11 신설): Feature contentType + featureContentType

### 9.2 M1 Phase Beta 합류
- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
- `CA-DEFER-10`: client 검수자
- `CA-DEFER-12`: attachments[] 법무 의견서
- `CA-DEFER-14` (CAM-21 신설): NotificationEvent envelope (notifications Feature 합류)

### 9.3 M2+ 합류
- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
- `CA-DEFER-09`: MediaThresholdAssessment + mediaThresholdOperationalInput · analytics-reporting 통합
- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning · llmAssist · priorReviewSubmissionId · featureContentType · client 슬롯) — 각 CA-DEFER phase 매핑

## 10. Cascade markers (다른 SoT 문서로 전파)

- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker — subset 명시 + CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns 분리)
- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반)
- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
- `CA-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 9.1.1 + `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` audit matrix cascade — eventType 4종 · payload shape · emit 시점 (tx commit 후 base role) · 실패 정책

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |
| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |


 succeeded in 811ms:
# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준

> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 RiskInferenceResult.steps 표준화)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 콘텐츠 표현 룰 SoT → `core/CONTENT_STANDARDS.md` (§ 4·§ 7)
> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
> - 페이지 타입별 위험도 기본값 → `core/PAGE_TYPES.md` (§ 3)
> - ArticleType별 위험도 기본값 → `core/CONTENT_STANDARDS.md` (§ 6)
> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
- **RiskRule 데이터 파일**: `data/compliance-rules/` 디렉토리, YAML 포맷, JSON Schema 검증, 의료법 개정 시 MAJOR 버전
- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| RiskLevel enum 변경 | **MAJOR** | DATA_MODEL C-05 cascade 필수 |
| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마이그레이션 가이드 필수 |
| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
| RiskRule 추가 (warning/content-gate) | MINOR | |
| RiskRule 추가 (fail) | **MAJOR** | 빌드 차단 가능 |
| RiskRule 패턴 정정 (false-positive 감소) | PATCH | |
| 의료법 개정 대응 룰 갱신 | **MAJOR** | 본 문서 § 7.1 의료법 개정 추적 표 동시 갱신 |
| ApproverRole 통과 기준 변경 | **MAJOR** | 운영 정책 영향 |

### 1.2 SoT 원칙

- 본 문서는 **운영·구현 SoT** — `compliance-assistant` Feature Module과 어드민 검수 워크플로가 본 문서를 입력으로 받음
- 의료광고 **표현 룰의 카탈로그 SoT**는 `core/CONTENT_STANDARDS.md` § 4 — 본 문서는 카탈로그를 RiskRule 데이터 파일로 변환·운영하는 책임만
- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속

---

## 2. RiskLevel — 정의·자동 추론

### 2.1 RiskLevel enum

`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:

```ts
const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
// max(level1, level2) — 등급 결합 시 더 높은 등급 채택
```

### 2.2 자동 추론 입력

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급
  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
};

type SlotMatch = {
  pageTypeId: PageTypeId;
  slotId: string;                     // PAGE_TYPES § 3 슬롯 ID (예: "P-006-content-results")
  triggeredLevel: RiskLevel;
};
```

### 2.3 자동 추론 알고리즘

```
1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
2. if articleType: base = max(base, CONTENT_STANDARDS § 6 articleType 기본 등급)
3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
4. for each slotMatch: base = max(base, slotMatch.triggeredLevel)
5. if explicitRiskLevel: final = max(base, explicitRiskLevel)
6. else: final = base
7. return final
```

`explicitRiskLevel`은 격하 불가 — 항상 MAX 결합. ComplianceRecord 운영자가 명시 격상만 가능.

#### 2.3.1 RiskInferenceResult — steps[] 추적

```ts
type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;     // MAX 결합 결과 (단계 7 final)
  steps: Array<{                     // 등급 산정 출처 추적 (audit·triggeredBy 판정용)
    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
    sourceValue: string;             // 예: "P-006", "review-case", "includes-pricing", "P-006-content-results"
    level: RiskLevel;                // 본 source가 기여한 등급
  }>;
};
```

- 각 단계 1~5에서 base가 갱신될 때마다 steps[]에 항목 추가
- triggeredBy 판정에 사용 (admin/REVIEW_WORKFLOW·features/compliance-assistant § 4.1 7단계)

### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)

| InlineRiskFlag | 격상 등급 | 의미 |
|---|---|---|
| `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
| `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
| `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
| `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |

> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).

### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)

| 페이지 | 기본 등급 |
|---|---|
| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-test | Medium |
| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |

> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.

---

## 3. RiskRule 데이터 파일

### 3.1 위치·디렉토리 구조

```
data/compliance-rules/
├── rules.core.yaml             # § 4.1 CONTENT_STANDARDS 표 → 데이터 변환 (Core 룰)
├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
├── rules.preset-<presetSlug>.yaml     # preset별 특유 표현. <presetSlug>은 `presets/<presetSlug>/` 디렉토리명과 동일 (kebab-case, 예: `hanui-clinic`)
├── context-exceptions.yaml     # CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그 (§ 3.4.3 스키마)
├── medical-law-tracking.yaml   # 의료법 개정 추적 (§ 7.1.2)
└── meta.yaml                   # 룰 카탈로그 메타데이터·버전 인덱스 (§ 3.4.1)
```

- 파일 단위 분리 — 변경 추적·diff 친화
- `meta.yaml`은 전체 카탈로그 버전·로드 순서·의존성을 인덱스

### 3.2 파일 포맷 — YAML + JSON Schema

YAML로 작성 (사람 가독·다중 라인 정규식 친화), 빌드 시 JSON Schema로 검증.

**예시 — `rules.core.yaml`**:

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.1"
sourceDocVersion: "1.0"

rules:
  - id: "supremacy-001"
    category: "최상급"
    pattern: '(최고의|최저가|최대|최강|1위|국내 유일|세계 최초|세계 최고)'
    patternType: "regex"
    severity: "fail"
    scope:
      - { type: "global" }
    rationale: "의료법 제56조 — 최상급 표현 금지"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"

  - id: "guarantee-composite-001"
    category: "보장 결합 강조"
    patternType: "composite"
    operands:
      - { pattern: '(100%|반드시|절대|확실히)', patternType: "regex" }
      - { pattern: '(효과|결과|호전|개선|치유|보장)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope:
      - { type: "global" }
    contextExceptions:
      - kind: "safety"
        pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    rationale: "의료법 제56조 + § 4.1 전문성 단정 + 보장 결합"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`

빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 RiskRule(SimpleRiskRule + CompositeRiskRule) 전체 스키마를 검증할 수 있어야 한다.

**기본 식별·메타**
| 검증 항목 | 룰 레벨 |
|---|---|
| `id` 중복 (전체 파일 합집합) | **fail** |
| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `category` 비어 있음 | **fail** |
| `version` SemVer 형식 위반 | **fail** |
| `createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `sourceDoc` URL/경로 형식 위반 | warning |
| `sourceDocVersion` SemVer 형식 위반 | warning |

**Simple/Composite 구분**
| 검증 항목 | 룰 레벨 |
|---|---|
| `patternType` enum 외 값 (`regex`·`keyword`·`phrase`·`composite`) | **fail** |
| Simple — `pattern` 누락 | **fail** |
| Simple — `pattern` regex 컴파일 실패 (`patternType="regex"` 시) | **fail** |
| Composite — `operands[]` 길이 < 2 | **fail** |
| Composite — `logic` enum 외 값 (`AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR`) | **fail** |
| Composite — `logic="AND_NEAR"` + `window` 누락 또는 ≤ 0 | **fail** |
| Composite — 각 `operands[].pattern` regex 컴파일 실패 | **fail** |

**severity·scope·roles**
| 검증 항목 | 룰 레벨 |
|---|---|
| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
| `scope[]` 빈 배열 | **fail** |
| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
| `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
| `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
| `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
| `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |
| `suggestion` 1,000자 초과 | warning |
| `exceptions[]` 항목 빈 문자열 | **fail** |
| `exceptions[]` 항목 regex 패턴인 경우 컴파일 실패 | **fail** |
| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
| `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |

**context-exceptions.yaml** (§ 3.4.3 스키마)
| 검증 항목 | 룰 레벨 |
|---|---|
| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
| `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `exceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `exceptions[].pattern` 누락 또는 빈 문자열 | **fail** |
| `exceptions[].pattern` regex 컴파일 실패 | **fail** |
| `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
| `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **fail** |
| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
| `exceptions[].version` SemVer 형식 위반 | **fail** |
| `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `exceptions[].rationale` 누락 또는 빈 문자열 | warning (감사·추적 약화) |

**overrides·meta·medical-law-tracking**
| 검증 항목 | 룰 레벨 |
|---|---|
| `overrides[].targetRuleId` 미존재 (다른 파일에 정의된 ID 참조) | **fail** |
| `overrides[].patch` 객체에 enum/타입 위반 (deep merge 결과 기준) | **fail** |
| 동일 `targetRuleId`에 대한 override 카탈로그 전체에서 2개 이상 | **fail** |
| `meta.yaml` 구조 위반 (§ 3.4.1 참조) | **fail** |
| `meta.yaml`의 `medicalLawRevisionRef`가 `medical-law-tracking.yaml`의 `revisions[].revisionId` 미존재 | **fail** |
| `medical-law-tracking.yaml` 파일 부재 | **fail** |
| `medical-law-tracking.yaml.revisions[]` 필수 필드 누락 (`revisionId`·`lawSource`·`revisionEffectiveDate`·`sourceUrl`·`checkedAt`·`checkedBy`·`affectedRuleIds`·`staleScope`) | **fail** |
| `medical-law-tracking.yaml.revisions[].affectedRuleIds`의 룰 ID가 카탈로그에 미존재 | **fail** |
| `medical-law-tracking.yaml.revisions[].revisionType` enum 외 값 (`amendment`·`reaffirmation`·`new`) | **fail** |
| `medical-law-tracking.yaml.revisions[].staleScope.kind` enum 외 값 (`all`·`rule-matched`·`content-type`) | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 빈 배열 또는 누락 | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 항목이 C-10 contentType enum 미존재 | **fail** |
| `staleScope.kind="rule-matched"` + `affectedRuleIds[]` 빈 배열 | **fail** |
| `medical-law-tracking.yaml.revisions[].sourceUrl` URL 형식 위반 | **fail** |

#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책

| severity | requiredApproverRoles 처리 |
|---|---|
| `fail` | 무시 (빌드 차단이므로 검수자 불필요). 명시 시 schema warning |
| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |
| `content-gate` | **필수 명시** (§ 4.5 multi-role AND 조건) |
| `info` | 무시. 명시 시 schema warning |

### 3.4 로드 순서·머지 규칙

```
1. rules.core.yaml         (Core 룰 — 기본 카탈로그)
2. rules.medical-ad.yaml   (의료법 기반 룰)
3. rules.preset-<presetSlug>.yaml  (인스턴스의 preset)
4. context-exceptions.yaml (별도 ContextException[] 컬렉션)
```

- 동일 `id` 중복 시 빌드 fail
- preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 가능
- 로드 결과는 단일 `RiskRule[]` 컬렉션 + `ContextException[]` 컬렉션

#### 3.4.1 `meta.yaml` 구조

```yaml
catalogVersion: "1.0.0"                          # 카탈로그 전체 SemVer
medicalLawRevisionRef: "2026-Q1"                 # 의료법 개정 추적 (§ 7.1)
loadOrder:                                       # 파일 로드 순서 명시 — 모든 카탈로그 파일 포함
  rules:                                          # rules 파일 (순차 머지)
    - rules.core.yaml
    - rules.medical-ad.yaml
    - rules.preset-hanui-clinic.yaml
  contextExceptions:                              # ContextException 파일 (별도 컬렉션)
    - context-exceptions.yaml
  tracking:                                       # 추적 데이터 파일
    - medical-law-tracking.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "의료법 제56조·제57조 룰"
  rules.preset-hanui-clinic.yaml:
    version: "1.0.0"
    description: "한의 특유 표현·체질 회색지대"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — § 7.1.2"
```

#### 3.4.2 `overrides[]` 스키마·머지 규칙

```yaml
# preset 파일 내 예시
overrides:
  - targetRuleId: "supremacy-001"        # rules.core.yaml의 룰 ID
    patch:                                # 부분 갱신 — 명시된 필드만 교체 (deep merge)
      severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
      contextExceptions:                  # 배열은 union 아니라 교체 — 기존 항목 유지하려면 모두 재기술
        - { kind: "safety", pattern: "기존 패턴" }
        - { kind: "safety", pattern: "추가 패턴" }
    rationale: "preset-hanui-clinic — 한의 진료 안내 문맥에서 안전 권유 다용"
    appliedAt: "2026-05-14T00:00:00Z"
```

**머지 알고리즘**:
1. `targetRuleId`의 원본 룰을 base로 복사
2. `patch` 객체를 base에 적용:
   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
   - 객체 필드(`metadata`) — deep merge (재귀적 key별 교체)
   - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`requiredApproverRoles[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)
3. `patch`에 명시되지 않은 필드는 원본 값 유지
4. 결과는 새 RiskRule으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉션에 존재

**제약**:
- override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본 비활성화 (별도 deprecation)
- 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견 시 빌드 **fail** (last-wins 정책 없음)

#### 3.4.3 `context-exceptions.yaml` 스키마

CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그의 데이터 표현. 빌드 로드 시 별도 `ContextException[]` 컬렉션으로 분리되고, 각 항목은 명시한 룰·카테고리·scope에 대해 매칭 검사 시 제외 단언(negative assertion)으로 작용.

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
sourceDocVersion: "1.0"

exceptions:
  - id: "safety-medical-consult-001"
    kind: "safety"                         # safety | warning-message | administrative
    pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    patternType: "regex"
    appliesTo:                              # 본 예외가 적용되는 대상
      categories: ["전문성 단정 (단독 어휘)"]   # RiskRule.category 매칭 (1개 이상)
      ruleIds: []                            # 또는 특정 RiskRule.id 명시 (1개 이상). 둘 중 1개 이상 필수
      scopes:                                # 본 예외가 적용될 scope (선택 — 미지정 시 전체)
        - { type: "global" }
    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

- `appliesTo.categories`와 `appliesTo.ruleIds` 중 1개 이상 비어 있지 않아야 함 (빌드 fail)
- 매칭 시 — 본 예외의 `pattern`이 텍스트 매칭하면, 같은 위치의 해당 룰 finding을 결과에서 제거

### 3.5 버전 관리

- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
- 파일 헤더의 `version` — 파일 단위 SemVer. 룰 추가/삭제 시 MINOR, 의료법 개정 시 MAJOR
- 의료법 개정 시 § 7.1 추적 표 동시 갱신 + `meta.yaml`에 `medicalLawRevisionRef` 기록

---

## 4. ApproverRole 통과 기준 — content-gate 발행 조건 (CS-02 해소)

`CONTENT_STANDARDS § 7.1.3`의 4역할 통과 기준 SoT.

### 4.1 medical (의료진 검수)

**검수 자격**:
- DoctorProfile(C-02) 등록 + `credentials[]`로 의료진 자격(면허·전문의 등) 검증 (DATA_MODEL 정합)
- 콘텐츠 도메인(전문 분야) 일치 권장 — 한의 콘텐츠는 한의사, 양방 콘텐츠는 의사

**통과 조건**:
- 콘텐츠 전체 사실 검증 — 효과·기간·부작용·금기 표현
- 의학 정보의 일반론 적합성 (특정 진단·치료 단정 금지)
- ComplianceRecord(C-10) `physicianApprover` + `physicianApprovedAt` 기록

**만료** — `staleFlags.medical=true`로 표기. 다음 이벤트에서 자동 설정:
- 콘텐츠 본문이 RiskRule 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경
- TreatmentPage의 `treatmentComponents[]`·`visitFlow[]`·`evidenceNotes[]` 변경 (의학 정보 영역)
- 의료진 자격·인증 변경 (DoctorProfile 검수자 자격 변동)
- 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)

### 4.2 legal (법무 자문·승인)

**검수 자격**:
- 사내 법무 또는 외부 법무법인 (변호사 자격)
- 의료광고법 자문 경력 권장

**통과 조건**:
- 의료법 제56조 광고 금지 항목 위반 부재
- 의료법 제57조 사전심의 대상 여부 판정 — ComplianceRecord(C-10) `priorReviewRequired: boolean` 기록 필수
- 사전심의 대상 판정 시 — `priorReviewSubmissionId` 기록 + 심의 통과 후 `priorReviewPassed: true` 기록
- 환자 유인 표현·치료경험담·전후사진 등 특별 항목 별도 판정
- ComplianceRecord(C-10) `legalCounsel` + `legalCounselAt` 기록
- `attachments[]` — 법무 의견서·검토 보고서 첨부 권장

**발행 차단 조건** (어드민 워크플로):
- `priorReviewRequired=true` + (`priorReviewPassed≠true` 또는 `priorReviewSubmissionId` 누락) → 발행 차단

**만료** — `staleFlags.legal=true`로 표기. 다음 이벤트에서 자동 설정:
- 의료법 개정 시 전체 재검수 (§ 7.1 의료법 개정 추적 표 갱신 시 영향받은 룰의 ComplianceRecord 일괄 stale)
- 콘텐츠 본문에서 § 4.1 카테고리 추가 매칭 발생
- 가격 정보 변경 (price·pricing field 갱신)
- ReviewPolicy(C-13) 정책 변경
- 전후사진 미디어 첨부·교체
- 법무 의견서 첨부 만료 (의견서 작성일 기준 12개월 초과 — **RL-07 해소 후 자동 판정 활성화**. v1.0에서는 어드민 워크플로에 수동 갱신 큐 기능으로 대체)

### 4.3 operator (운영자·동료 검수)

**검수 자격**:
- 어드민 계정 + Glitzy 운영팀 또는 클라이언트 측 콘텐츠 담당자

**통과 조건**:
- 톤·문체 일관성 (CONTENT_STANDARDS § 1.1)
- 페이지 타입별 슬롯 충족 (PAGE_TYPES § 2)
- warning 항목 일괄 인정 또는 정정
- ComplianceRecord(C-10) `peerReviewer` + `peerReviewedAt` 기록

**만료**: 별도 만료 없음. 운영자 검수는 본문 변경 시 자동 재진입.

### 4.4 client (클라이언트 측 승인)

**검수 자격**:
- 클라이언트 의료기관의 대표 또는 위임된 의사 결정자

**통과 조건**:
- 기관 정체성 표현·로고·의료진 노출·가격 정책의 최종 확인
- 운영 정책상 요구되는 경우만 사용 — 모든 콘텐츠에 의무 아님
- ComplianceRecord(C-10) `clientApprover` + `clientApprovedAt` 기록

**사용 시점**:
- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
- P-101 Reviews 신규 게재
- TrustMetric·Award 등 검증 가능 사실의 최초 등록

### 4.5 multi-role 조합 규칙

**전 콘텐츠 공통 필수**:
- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구

**content-gate 추가 요구**:
- `requiredApproverRoles[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "legal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용
- 모든 충족은 AND 조건 — 1개라도 누락 시 발행 차단

| ContentScope | 기본 requiredApproverRoles |
|---|---|
| `review-case` ArticleType | `["medical", "legal"]` |
| `event-price` ArticleType | `["legal"]` |
| `effect-result-related` ArticleType | `["medical"]` |
| 전후사진 노출 콘텐츠 | `["medical", "legal"]` |
| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
| 기타 High 등급 (자동 추론) | `["medical"]` |

---

## 5. inlineRiskFlags 자동 추출 — DM-05 영역

콘텐츠 본문에서 자동 추출하는 본문 위험 신호.

**저장 위치**:
- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
- compliance-assistant 빌드 시 양쪽 모두 갱신 — Article은 두 위치, 비 Article은 ComplianceRecord만

### 5.1 추출 알고리즘 (RiskRule category 기반)

각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.

| Flag | 추출 룰 |
|---|---|
| `includes-effect-claim` | RiskRule 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |
| `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
| `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
| `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠에 미디어 첨부 |
| `includes-testimonial` | RiskRule composite 매칭 — (1인칭/인용 패턴: `저는`·`환자분이`·`내원자 후기`·`치료받은`·`받은 후`·`상담받은`·`체험기`) + AND_IN_PARAGRAPH (효과 어휘: `효과`·`결과`·`변화`·`호전`·`개선`) |

### 5.1.1 카테고리 SoT

위 표의 모든 `category` 값은 `core/CONTENT_STANDARDS.md` § 4.1 표의 카테고리 칸과 일치해야 한다. 신규 카테고리 추가 시 본 § 5.1 매트릭스 동시 cascade.

### 5.1.2 컨텍스트별 false-positive 완화 정책

단어 매칭만으로 inlineRiskFlag 격상이 false-positive를 만들 수 있다. **콘텐츠 타입·필드 단위**의 정밀한 제외 규칙:

| 컨텍스트 (콘텐츠 타입·필드) | 제외 Flag | 사유 |
|---|---|---|
| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |

> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
| `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |

- 위 외 컨텍스트에서는 단일 발생만으로 격상. evidence는 항상 기록 (검수자 판단용)
- 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화

### 5.2 출력

```ts
type InlineRiskExtractionResult = {
  inlineRiskFlags: InlineRiskFlag[];
  evidence: {
    [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
  };
};
```

- 어드민 검수 UI는 `evidence`를 사용해 본문 위치를 하이라이트

### 5.3 책임

- 본 알고리즘 구현은 `compliance-assistant` Feature Module
- 본 문서는 추출 규칙의 SoT — 구현 일치 의무

---

## 6. 위험도 자동 동작 매트릭스

`RiskInferenceInput` 결과에 따라 자동 트리거되는 동작.

| 최종 등급 | 자동 동작 |
|---|---|
| Low | (특별 동작 없음) |
| Medium | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록. fail/content-gate 매칭은 룰 단위로 독립 처리 |
| High | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 진입 |

- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
- High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)

### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)

**트리거 범위** (본 문서가 운영 SoT — CONTENT_STANDARDS § 7.1.2보다 넓음):

본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
- `pageTypeId` 기본 등급 (P-101·P-102·P-104 event 등)
- `articleType` 기본 등급 (effect-result-related·review-case·event-price)
- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
- `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)
- `explicitRiskLevel` override (어드민 명시 입력)

**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).

자동 주입 finding:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },              // 콘텐츠 전체 — 메타 의미
  requiredApproverRoles: ["medical"]            // 기본값. ArticleType별 override (§ 6.2)
}
```

### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override

본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우(High 등급)**의 `requiredApproverRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 않음.

| ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
|---|---|---|
| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중복은 합집합으로 제거) |
| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |
| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
| 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |

> Medium 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 요구는 자동 적용

- 본 표는 `CONTENT_STANDARDS § 7.1.2`와 동일 SoT — 둘 중 하나 변경 시 다른 하나도 cascade. 본 문서가 운영 SoT.
- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크플로는 합집합의 모든 역할에 대해 ComplianceRecord 슬롯 기록 완료 시에만 발행 허용
- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)

---

## 7. 운영 거버넌스

### 7.1 의료법 개정 대응

#### 7.1.1 추적 대상

| 추적 항목 | 출처 | 갱신 주기 |
|---|---|---|
| 의료법 제56조 (의료광고 금지) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 제57조 (사전심의) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 시행령 제23조 등 광고 관련 조항 | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료광고 심의 운영규정 | 의료광고심의위원회 | 분기 1회 |

#### 7.1.2 추적 데이터 모델

```yaml
# data/compliance-rules/medical-law-tracking.yaml
revisions:
  - revisionId: "2026-Q1"                          # 분기 또는 개정 일자 기반 식별자
    lawSource: "의료법"                              # 의료법·시행령·심의 운영규정
    affectedArticles: ["제56조 제1항 제5호"]        # 개정 조문
    revisionEffectiveDate: "2026-03-01"             # 시행일
    revisionType: "amendment"                       # amendment | reaffirmation | new
    sourceUrl: "https://www.law.go.kr/..."           # 국가법령정보센터 URL
    checkedAt: "2026-05-14T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds:                                # 본 개정으로 영향받은 RiskRule ID
      - "supremacy-001"
      - "guarantee-composite-001"
    staleScope:                                     # stale 처리 범위
      kind: "all"                                   # all | rule-matched | content-type
      contentTypes: []                              # kind="content-type"일 때만
    summary: "의료광고 사전심의 매체 범위 확대 — 자사 웹사이트 미디어 포함"
```

#### 7.1.3 개정 시 절차

1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
2. `rules.medical-ad.yaml` 룰 추가·갱신 (`version` MAJOR)
3. `meta.yaml`의 `medicalLawRevisionRef` 갱신
4. `medical-law-tracking.yaml`에 revision 항목 추가
5. `staleScope.kind`별 영향 콘텐츠 결정:
   - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
   - `kind="rule-matched"` — `affectedRuleIds[]`에 해당하는 룰을 매칭한 콘텐츠의 ComplianceRecord만 stale
   - `kind="content-type"` — `staleScope.contentTypes[]`에 속하는 contentType의 ComplianceRecord 일괄 stale
   - 모든 경우 `triggeredBy="medical-law-revision-<revisionId>"` 설정
6. 어드민 워크플로가 재검수 큐를 처리 — 통과 시 stale 해제

### 7.2 룰 충돌·중복 발견 시

- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
- 운영 누적으로 false-positive 발견 시 `contextExceptions[]` 또는 `exceptions[]` 추가 — PATCH 버전
- false-negative 발견 시 룰 추가 — MAJOR(fail 룰) 또는 MINOR(warning/content-gate)

### 7.3 RiskRule 변경 워크플로

```
1. 변경 제안 (PR) — 변경 사유·근거 의료법 조문·테스트 케이스 첨부
2. 자체 룰 checker 회귀 테스트 — 기존 콘텐츠 위반 가능 케이스 검출
3. 의료법 자문 — fail 룰 추가·강화 시 필수
4. 머지 + 인스턴스 재빌드 — 위반 콘텐츠 검출 시 ComplianceRecord 재진입
```

---

## 8. 빌드 검증 — 룰 레벨 정합 (CONTENT_STANDARDS § 8 동일 패턴)

| 레벨 | 본 문서 영역 적용 |
|---|---|
| **fail** | RiskRule 파일 JSON Schema 검증 실패, RiskLevel enum 위반, ApproverRole 매핑 누락 |
| **warning** | `sourceDoc` 경로 위반, RiskRule 만료 임박 (의료법 개정 6개월 이상 미반영 등) |
| **content-gate** | (본 문서는 메타 정의 영역이라 content-gate 직접 적용 없음. 실제 본문 검수 룰은 RiskRule이 발산) |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| RL-03 | medical 검수자 도메인 자격 매칭 자동 검증 (한의 콘텐츠 → 한의사) | 어드민 워크플로 명세 시 |
| RL-04 | legal 검수의 외부 법무법인 vs 사내 법무 구분 데이터 모델 | DATA_MODEL 후속 사이클 |
| RL-05 | `clientApprover` 위임 권한 데이터 모델 (대표 vs 위임자) | 운영 정책 결정 |
| RL-06 | inlineRiskFlag 추출 알고리즘의 정확도 운영 지표 (precision/recall) 측정·운영 | M2+ 운영 누적 후 |
| RL-07 | `attachments[].metadata.expiresAt` 데이터 모델 — DATA_MODEL Attachment 확장 | DATA_MODEL 후속 사이클 |

### 9.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~RL-01~~ | `rules.preset-<presetSlug>.yaml`의 preset slug 카탈로그 결정 | v1.0 — preset 파일명 규약 `rules.preset-<presetSlug>.yaml` 고정. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case (예: `hanui-clinic`). 실제 preset 카탈로그는 `presets/` 추가 시 자연 확장 |
| ~~RL-02~~ | `overrides[]` 섹션의 정확한 머지 알고리즘 | v0.2 — § 3.4.2 명세. 스칼라/객체/배열별 머지 규칙 + 동일 targetRuleId 카탈로그 1개 제약 명시 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 RiskInferenceResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |
| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |


 succeeded in 840ms:
# Feature — compliance-assistant

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `docs/admin/REVIEW_WORKFLOW.md`
> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. LLM API 키·민감 콘텐츠 처리 주의.
> **연관 문서**:
> - 입력·출력 인터페이스 SoT → `core/CONTENT_STANDARDS.md` § 7
> - 운영·룰 카탈로그·자동 추론 → `compliance/RISK_LEVELS.md`
> - 의료법 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 어드민 워크플로 통합 → `docs/admin/REVIEW_WORKFLOW.md`
> - 데이터 계약 ComplianceRecord → `core/DATA_MODEL.md` C-10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `compliance-assistant` (DATA_MODEL C-08 InstanceManifest.features[] 등록 — `name: "compliance-assistant"`)
- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
- **2 모드 운영**: (a) **빌드 모드** — CI 빌드 시점에 빠른 정적 룰 검사 (LLM 미사용). 결과를 ComplianceRecord에 기록, (b) **어드민 모드** — 어드민에서 콘텐츠 저장 시점에 LLM 보조 분석 추가 가능 (인간 검수 보조)
- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | CONTENT_STANDARDS § 7 cascade 동반 |
| RiskInference 알고리즘 변경 (강화) | **MAJOR** | RISK_LEVELS § 2 cascade |
| 정적 룰 checker 정정 (false-positive 감소) | PATCH | |
| LLM 보조 활성화 정책 변경 | MINOR | |
| LLM 프롬프트 템플릿 변경 | MINOR | (운영 정책 — 결과 결정성 영향 시 MAJOR) |
| 캐시 키 산정 로직 변경 | **MAJOR** | 기존 cache 무효화 |
| 운영 지표 항목 추가 | PATCH | |

### 1.2 SoT 원칙

- 입출력 인터페이스 SoT는 `CONTENT_STANDARDS.md` § 7 (본 문서는 구현)
- RiskRule 데이터·자동 추론 알고리즘 SoT는 `RISK_LEVELS.md` (본 문서는 적용)
- 의료법 카탈로그 SoT는 `MEDICAL_AD_COMPLIANCE_COMMON.md` (본 문서는 룰 로드만)
- 본 문서 = **구현·운영 SoT** (모드·캐시·LLM 보조·지표)

### 1.3 본 문서가 다루지 않는 영역

- 룰 데이터 자체 — `data/compliance-rules/` (RISK_LEVELS § 3 SoT)
- 검수자 화면·승인 흐름 — `admin/REVIEW_WORKFLOW.md`
- LLM 모델 선택·계약 — 운영 결정 (CA-01)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "compliance-assistant"      # DATA_MODEL C-08 features[].name과 동일
specVersion: "0.1"                # 본 문서 명세 버전 (안정판 도달 시 1.0)
coreRequiresMin: "1.0.0"          # Core 최소 버전
implementationKind: "node-module" # CI 빌드 + 어드민 통합 가능
activation:
  scope: "instance"               # 인스턴스별 활성화
  default: true                   # 기본 활성 — 의료기관 콘텐츠에 권장
  llmAssist:                      # LLM 보조 별도 활성화
    default: false
    requires: ["llm-api-key"]     # 구체 provider는 § 2.3 config.llmProvider로 명시
```

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `CONTENT_STANDARDS.md` § 7 | ComplianceCheckInput·Result 인터페이스 |
| `RISK_LEVELS.md` § 2 | RiskInference 알고리즘 |
| `RISK_LEVELS.md` § 3 | RiskRule 카탈로그 로드 |
| `RISK_LEVELS.md` § 5 | inlineRiskFlags 추출 |
| `DATA_MODEL.md` C-10 | ComplianceRecord 결과 기록 |
| `MEDICAL_AD_COMPLIANCE_COMMON.md` § 8 | 인용 가능 도메인 화이트리스트 |

### 2.3 InstanceManifest 통합

DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"           # 권장 default. 다른 provider 사용 시 명시 (CA-01)
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"  # 비밀 보관소 키 참조
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false
```

---

## 3. 입력·출력

### 3.1 입력 — ComplianceCheckInput (CONTENT_STANDARDS § 7.1)

```ts
type ComplianceCheckInput = {
  contentType: ContentType;
  featureContentType?: FeatureContentTypeId;
  contentRef: string;
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;
    articleType?: ArticleType;
    pageMeta?: PageMeta;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;   // CONTENT_STANDARDS § 7.1 정식 입력 슬롯 — 호출자(어드민·빌드 파이프라인)가 RiskInference 결과를 채워서 전달. 본 Feature가 단일 엔트리포인트 `check()` 호출 전 외부에서 RiskInference 실행한 경우 사용. 미지정 시 본 Feature 내부에서 자동 추론 (§ 3.3 흐름)
  };
  riskRules: RiskRule[];
};
```

### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)

```ts
type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};
```

### 3.3 단일 엔트리포인트 — `check()`

본 Feature는 **단일 엔트리포인트** `check(input)`를 노출. 호출자(어드민·빌드 파이프라인)는 RiskInference·inlineRiskFlags 추출 등을 별도 호출하지 않음.

```ts
async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
```

**입력 보강 계약**:
- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
- `metadata.articleType` 미지정 시 — `contentType="Article"`이면 fail. 그 외 콘텐츠는 articleType N/A로 처리
- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)

**내부 동작 순서** (§ 4.1 실행 순서와 동일):
1. 룰 카탈로그 로드 (캐시)
2. RiskRule 매칭 (각 finding 산출)
3. inlineRiskFlags 추출 — flag별 산출 방식 분리 (§ 4.1 5단계 / RISK_LEVELS § 5.1): `includes-effect-claim`만 매칭 category 집합 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력
4. RiskInference 실행 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 → `RiskInferenceResult` (RISK_LEVELS § 2.3.1)
5. High 가상 finding 주입·결과 집계·LLM 보조(어드민 모드)

**`metadata.inferredRiskLevel` 입력 처리** (CONTENT_STANDARDS § 7.1 SoT 정합):
- 외부에서 채워 전달된 경우 — 신뢰 입력으로 사용 (호출자 책임으로 일관성 보장). 본 Feature는 내부 재계산 생략 가능 (성능)
- 외부 미지정 시 — 본 Feature 내부에서 자동 추론 (§ 4.1 5~6단계)
- 호출자가 룰 카탈로그·slot 변경 후 stale 위험을 회피하려면 — `inferredRiskLevel` 미전달하여 내부 재계산 강제 또는 cacheKey 변경으로 자연 재계산

### 3.4 RiskInference 입력·출력 (RISK_LEVELS § 2)

본 Feature 내부에서 사용. § 3.3 `check()`가 자동 호출:

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;
  articleType?: ArticleType;
  inlineRiskFlags: InlineRiskFlag[];
  slotMatches: SlotMatch[];
  explicitRiskLevel?: RiskLevel;
};

type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;        // MAX 결합 결과
  steps: Array<{ source: string; level: RiskLevel }>;  // 산정 과정 추적
};
```

---

## 4. 빌드 파이프라인 (정적 룰 checker)

### 4.1 실행 순서

```
1. 룰 카탈로그 로드 — **meta.yaml 우선 로드** (`data/compliance-rules/meta.yaml`):
   - meta.yaml의 `loadOrder.rules[]` → rules 파일들 순차 로드·머지 (rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml)
   - meta.yaml의 `loadOrder.contextExceptions[]` → ContextException 파일 로드 (별도 컬렉션)
   - meta.yaml의 `loadOrder.tracking[]` → medical-law-tracking.yaml 등 추적 데이터 로드
   (RISK_LEVELS § 3.4 머지 알고리즘 정합. meta.yaml이 로드 계획의 기준)
2. JSON Schema 검증 — 룰 데이터 정합성 확인 (실패 시 fail)
3. ContextException[] 컬렉션 분리
4. RiskRule 매칭 실행:
   a. scope 일치 (pageType/articleType/block/field/feature/global)
   b. patternType별 매칭 (regex/keyword/phrase/composite — § 4.3·§ 4.4)
   c. contextExceptions 적용 (§ 4.4) — 예외 일치 finding 제거
   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
5. inlineRiskFlags 추출 (RISK_LEVELS § 5.1) — **flag별 산출 방식 분리**:
   - `includes-effect-claim`: § 4 RiskRule 매칭 결과의 `category` 집합 기반 (RiskRule 매칭 후 실행 — 순서 중요)
   - `includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`: 본문 정규식·어휘 매칭 + 부가 입력 평가 (`ReviewPolicy.beforeAfterPhotoAllowed`·후기 미디어 첨부 등 — RISK_LEVELS § 5.1 표)
   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
6. RiskInference 실행 (RISK_LEVELS § 2.3) — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합. § 5.1.2 컨텍스트별 false-positive 완화 적용
7. High 가상 finding 자동 주입 — 최종 `inferredRiskLevel === "High"` 시. Finding 채움 (CONTENT_STANDARDS § 7.1.2 / RISK_LEVELS § 6.1·§ 6.2 동기화):
   - `ruleId: "risk-level-high-gate"`
   - `category: "위험도 강제 검수"`
   - `pattern: "(RiskLevel=High)"`
   - `severity: "content-gate"`
   - `location: { start: 0, end: 0 }` (메타 — 콘텐츠 전체 의미)
   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
8. severity 집계 → ComplianceCheckResult 산출:
   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
   - `buildBlocked` = findings 중 fail 1+ 존재
   - `gateRequired` = findings 중 content-gate 1+ 존재
   - `hasWarnings` = findings 중 warning 1+ 존재
   - `automatedDecision` = block(fail) > gate(content-gate) > warn(warning) > pass (우선순위 흡수는 집계 수준에서만)
9. 결과를 어드민 또는 빌드 파이프라인에 반환 + ComplianceRecord(pre-publish)에 기록
```

### 4.6 Finding 메타 확장 (CONTENT_STANDARDS § 7.2 cascade)

CONTENT_STANDARDS § 7.2의 Finding 타입에 본 Feature 운영을 위한 메타 필드 cascade 추가:

```ts
type Finding = {
  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";  // 출처 추적
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // LLM 출처 시
};
```

> CONTENT_STANDARDS § 7.2의 Finding 타입에 `triggeredBy`·`llmAssistMeta` 필드 신설 cascade.

### 4.2 빌드 모드 vs 어드민 모드

| 영역 | 빌드 모드 (CI) | 어드민 모드 |
|---|---|---|
| 트리거 | CI 빌드 시 변경된 콘텐츠 + 전체 (옵션) | 어드민 콘텐츠 저장 시 |
| LLM 보조 | 미사용 (속도·결정성) | 옵션 활성화 시 사용 |
| 캐시 | 사용 (동일 hash + 룰 version → cache hit) | 사용 |
| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
| SLO | 콘텐츠 1개당 50ms (정적 룰만) | 콘텐츠 1개당 5초 (LLM 포함 시) |

### 4.3 composite 룰 평가 알고리즘

CompositeRiskRule (CONTENT_STANDARDS § 7.4):

```
1. operands[] 각각의 매칭 위치 (start, end) 산출 — character offset 기준 (UTF-16 code unit)
2. logic별 평가:
   - AND_IN_SENTENCE: 문장 분리(KSS v3+) 결과 안에 모든 operand 매칭
   - AND_IN_PARAGRAPH: 빈 줄(`\n\n`+) 분리 단락 안에 모든 operand 매칭
   - AND_NEAR: 매칭 위치 간 거리 ≤ window (character offset 기준)
3. 만족 시 composite finding 생성 — location은 첫 매칭 start ~ 마지막 매칭 end
4. severity·requiredApproverRoles·suggestion은 CompositeRiskRule 정의 따름
```

**문장 분리기 고정** (CA-03 해소):
- 한국어 문장 분리 — **KSS (Korean Sentence Splitter) v3+** 채택. Python 또는 동등 포팅
- KSS 설치 실패·미지원 환경 fallback — 정규식 `[.!?][\s]+` (조잡한 fallback, warning 로깅)
- offset 기준 — 원본 본문의 UTF-16 code unit position

### 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 정합)

```
각 finding에 대해:
1. ContextException[]을 다음 조건으로 필터:
   a. appliesTo.categories[]에 finding.category 포함 OR
   b. appliesTo.ruleIds[]에 finding.ruleId 포함
2. 위 1에서 빈 결과면 본 finding은 예외 미적용 (그대로 유지)
3. 1에서 통과한 예외 각각에 대해:
   a. appliesTo.scopes[]가 명시되어 있으면, 본 finding의 scope와 매칭 검증 (미명시 시 전체 scope 적용)
   b. ContextException.pattern을 patternType(regex/keyword/phrase)별 평가
   c. 평가 대상 텍스트 — finding.location의 매칭 텍스트 + **주변 문맥 (같은 문장)**
   d. 매칭 성공 시 본 finding은 결과에서 제거 (로그·audit에는 보존)
4. 1개라도 ContextException이 매칭하면 finding 제거 (OR 결합)
```

> "같은 위치" 조건은 **같은 문장 내**(KSS 분리 기준)에서 ContextException.pattern이 매칭하면 적용 — finding.location 정확히 일치할 필요 없음 (안전 권유 표현이 같은 문장에 있으면 룰 매칭 무력화).

---

## 5. LLM 보조 인터페이스

### 5.1 활성화 조건

- `features[name="compliance-assistant"].config.llmAssist === true` (DATA_MODEL C-08)
- 어드민 모드에서만 사용 (빌드 모드는 결정성 우선)
- API 키는 인스턴스별 비밀 보관소에 저장 (운영 정책)

### 5.2 LLM 호출 시점

다음 시점에서 LLM 보조 분석 호출:
- 정적 룰 매칭 결과 + 자동 추론 결과가 어드민 검수 큐 진입 트리거 (`gateRequired=true`)
- 어드민 검수자가 "LLM 분석 요청" 액션 명시
- 정적 룰의 false-negative 의심 — 운영자 수동 요청

### 5.3 프롬프트 구조

```
[시스템]
당신은 의료기관 콘텐츠의 의료광고법 준수를 검토하는 보조 분석기입니다.
의료법 제56조·제57조 + 시행령 제23조·제24조 + MEDICAL_AD_COMPLIANCE_COMMON.md § 3 카탈로그 기반.

[입력]
- 콘텐츠 본문 (Markdown)
- 페이지 타입·ArticleType·페이지 위험도
- 정적 룰 검수 결과 (findings[])

[요청]
1. 정적 룰이 놓친 표현 위험 항목 식별
2. 각 항목에 의료법 조문 매핑
3. severity 제안 (info | warning | fail | content-gate)
4. 대체 표현 제안

[출력 형식]
JSON — § 5.4
```

### 5.4 LLM 출력 형식

```ts
type LlmAssistResult = {
  additionalFindings: Finding[];        // 정적 룰이 놓친 finding (제안). § 5.4.1 규약 적용
  reanalyzedFindings: Array<{          // 정적 룰 finding의 재평가
    ruleId: string;
    suggestedSeverity?: Severity;
    reasoning: string;
  }>;
  overallAssessment: string;            // 자연어 종합 분석
  confidence: number;                   // 0~1, LLM의 분석 신뢰도
  modelId: string;                      // 호출 모델 ID
  promptVersion: string;
  invocationCost?: { inputTokens: number; outputTokens: number };
};
```

#### 5.4.1 LLM additionalFindings의 Finding 채움 규약

- **ruleId**: 정적 룰 카탈로그 미등록 항목 — **결정적 synthetic ID** 사용. `llm-suggestion-<hash>-<seq>` 형식.
  - hash = SHA-256(category + span.start + span.end + 매칭 텍스트) 8문자 prefix
  - seq = **canonical sort 후 동일 hash 내 순번** (0부터 시작). canonical sort 키 = (category 알파벳 순 → reasoning 텍스트 SHA-256 hash 사전순). LLM 출력 순서 변경에 영향받지 않음. offset 산정 실패(`location={0,0}`·`pattern=""`) 케이스에서도 안정 참조 보장
  - 동일 본문·동일 위치·동일 카테고리·동일 순번은 항상 같은 ID 생성 (LLM 비결정성 영향 없음). audit·warning acknowledgement·검수자 수락 등의 finding 참조 안정성 보장
- **category**: LLM이 분류한 의미적 카테고리 — 기존 카탈로그 카테고리와 일치하면 그대로, 새로운 카테고리는 자유 문자열 허용
- **pattern**: 매칭 텍스트 그대로 (offset 산정 가능 시) 또는 빈 문자열 (불가 시)
- **location**: 본문 내 정확한 offset 산정 가능 시 채움. 산정 실패 시 `{ start: 0, end: 0 }` (메타·콘텐츠 전체 의미)
- **triggeredBy**: `"llm-assist"` 명시 (CONTENT_STANDARDS § 7.2 Finding 메타)
- **llmAssistMeta**: 모델·프롬프트 버전·신뢰도 기록

### 5.5 LLM 결과 처리 — human-in-loop·저장 슬롯

- LLM 출력의 `additionalFindings`는 **자동 적용하지 않음** — 검수자에게 제안으로 노출
- 신뢰도(confidence) 0.7 미만은 검수자 화면에서 별도 강조 표시
- LLM 출력 자체는 audit log에 기록 (prompt·response·model·timestamp)

**저장 슬롯**:
- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)

---

## 6. RiskInference 통합

### 6.1 자동 추론 산출

RISK_LEVELS § 2.3 알고리즘 그대로 적용. 본 Feature가 구현 책임.

### 6.2 inlineRiskFlags 추출 (RISK_LEVELS § 5.1)

**inlineRiskFlag enum 5종** (RISK_LEVELS § 5.1):
- `includes-effect-claim`
- `includes-pricing`
- `includes-event`
- `includes-before-after`
- `includes-testimonial`

**추출 알고리즘** — `includes-effect-claim`은 § 4 RiskRule 매칭 결과의 `category` 집합(7개 카테고리: 효과 단정·전문성 단정 단독·전문성 단정 결합·보장·수치/기간 단정·수치/기간 보장·체질 맞춤) 중 1개 이상 매칭 시 활성. 나머지 4개 flag는 RISK_LEVELS § 5.1 표의 정규식·어휘 매칭. § 4.1 실행 순서 5단계.

### 6.3 컨텍스트별 false-positive 완화 (RISK_LEVELS § 5.1.2)

- LegalDocument.documentType별 제외
- LocationProfile 안내 필드 제외
- Article articleType=notice 제외
- 본 완화는 RiskLevel 격상 단계만 — `inlineRiskFlags[]` 출력에는 포함 (감사 정보)

---

## 7. 룰 카탈로그 로드

### 7.1 로드 순서 (RISK_LEVELS § 3.4)

```
0. **meta.yaml 우선 로드** — loadOrder 인덱스 읽음 (§ 4.1 단계 1과 동일)
1. meta.yaml.loadOrder.rules[] 순서로:
   rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml
2. meta.yaml.loadOrder.contextExceptions[] — context-exceptions.yaml (별도 컬렉션)
3. meta.yaml.loadOrder.tracking[] — medical-law-tracking.yaml (개정 추적)
```

### 7.2 머지·overrides

- RISK_LEVELS § 3.4.1·§ 3.4.2 머지 알고리즘 그대로 적용
- 동일 `id` 중복 fail
- `overrides[]`는 최대 1개 (중복 fail)

### 7.3 로드 캐시

- 룰 카탈로그는 빌드 1회당 1회 로드. 메모리 캐시
- 카탈로그 변경 시 (meta.yaml `catalogVersion` 갱신) 캐시 무효화
- 어드민 핫리로드 — 어드민 콘솔에서 카탈로그 다시 로드 액션

---

## 8. 캐시·idempotency·재실행

### 8.1 캐시 키 산정

```
cacheKey = hash(
  contentBody,                          // 본문 정규화(공백/줄바꿈 표준화) 후 hash (SHA-256)
  contentType,                          // CONTENT_STANDARDS § 7.1
  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
  contentRef,                           // 대상 콘텐츠 @id
  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
  reviewPolicyHash,                     // ReviewPolicy(C-13) 직렬화 hash — `beforeAfterPhotoAllowed` 등 inlineRiskFlags 산정 입력
  mediaAttachmentsHash,                 // 콘텐츠에 첨부된 미디어 파일 목록 hash — 후기·전후사진 미디어 변경 추적
  ruleCatalogVersion,                   // meta.yaml catalogVersion (6파일 통합)
  ruleFileHashes,                       // 각 룰 파일의 개별 hash (cascade 추적용)
  llmAssistEnabled,                     // true/false
  llmProvider,                          // anthropic·openai 등
  llmModel,                             // "claude-sonnet-4-6" 등
  promptVersion,                        // LLM 활성화 시
  strictMode                            // true 시 warning도 빌드 차단 — automatedDecision 산출에 영향
)
```

### 8.2 캐시 계층 — 2종 분리

본 Feature의 캐시는 2종으로 분리:

| 캐시 종류 | 목적 | TTL |
|---|---|---|
| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
| **운영 TTL 캐시** (operational TTL cache) | 동일 콘텐츠에 짧은 시간 내 반복 호출 시 LLM 비용 절약 | instance 설정 (기본 86400초) |

- **hit/miss 흐름**: 운영 TTL 캐시 hit → 결과 반환. miss → 영속 결과 캐시 조회. 영속 hit → 결과 반환 + TTL 캐시 채움. miss → 전체 실행 + 영속·TTL 모두 저장
- **TTL 만료**: 운영 TTL 캐시만 만료. 영속 결과 캐시는 cacheKey 입력 중 하나가 변경되어야 무효화 (예: 룰 카탈로그 갱신)

### 8.3 idempotency 보장

- 동일 cacheKey → 영속 결과 캐시로 항상 동일 결과
- LLM 결과의 비결정성도 영속 캐시로 안정화 (한 번 산출된 결과 보존)
- 동일 콘텐츠에 동시 호출 시 — 중복 LLM 호출 회피 (request deduplication — § 8.5 또는 CA-06)

### 8.4 강제 재실행 — 룰 카탈로그 변경 처리

본 Feature는 룰 카탈로그 변경 시 콘텐츠를 **즉시 일괄 재호출하지 않음** — 비용·워크플로 정합성 이유. 다음 분리된 흐름으로 처리:

**(a) 영향 published ComplianceRecord에 stale 표시 (RISK_LEVELS § 7.1.3)**:
본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
- `kind="all"` — 전체 published record `staleFlags.legal=true`
- `kind="rule-matched"` — `affectedRuleIds[]`에 매칭된 finding을 보유한 record만 (finding ruleId 역색인 사용)
- `kind="content-type"` — `staleScope.contentTypes[]` 매칭 record만

**(b) 재검수 사이클 진입 (REVIEW_WORKFLOW § 6.2)**:
- staleFlags 갱신 → 콘텐츠 상태 `published → stale → review-queued` 자동 전이
- 어드민 재검수 큐가 새 pre-publish ComplianceRecord(recordVersion 증가) 생성하면서 본 Feature를 호출
- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출

**(c) 어드민 "재검수" 액션 — 캐시 무시·강제 실행**: 운영자가 명시 트리거 시 즉시 본 Feature 재호출 (큐 우회).

**(d) 의료법 개정 트리거**: medical-law-tracking.yaml revision 추가 → (a) staleFlags 갱신만 자동 수행. 이후 (b) 어드민 재검수 큐 처리.

---

## 9. 운영 지표 (SLO·관측성)

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| **빌드 모드 처리 시간** (per content) | 정적 룰 checker만 | < 50ms (p95) |
| **어드민 모드 처리 시간** (per content, LLM 포함) | LLM 호출 포함 | < 5초 (p95) |
| **운영 TTL cache hit ratio** | TTL hit / (hit + miss) | > 70% (어드민 모드 운영 누적 후) |
| **영속 결과 cache hit ratio** | 영속 hit / (영속 hit + miss) | > 50% (운영 누적 후) |
| **LLM 호출 실패율** | LLM API 오류·타임아웃 | < 1% |
| **operator-acknowledged ratio** | warning 중 operator가 "acknowledged"(인정)로 종결한 비율. **false-positive 추정 보조 지표만** (acknowledged ≠ false-positive 직접) | < 30% (M2+ 운영 누적, 운영 감 추적용) |
| **operator-resolved ratio** | warning 중 operator가 "resolved"(본문 정정)로 종결한 비율 | M2+ 누적 후 baseline 산정 |
| **LLM-accepted finding ratio** | LLM 제안 중 검수자가 수락한 비율. **false-negative 추정 보조 지표만** (수락된 LLM finding이 정적 룰 false-negative 직접 지칭하지 않음) | < 10% (M2+, baseline 후 hard target) |

> ⚠️ **precision/recall 정확한 산정**: 본 Feature의 false-positive·false-negative 정확 산정은 **외부 정답지(ground truth)** 가 필요. v1.0에서는 operator/검수자 액션 기반 보조 지표만 제공. 정답지 운영은 M3+ 누적 후 결정 (CA-09).

### 9.2 측정·로깅

- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
- LLM 호출 — 모델·토큰·비용·결과 audit log
- false-positive/negative — 검수자 acknowledged 로그 기반 자동 집계 (M2+)

### 9.3 알림

- LLM API 실패율 1% 초과 — 운영팀 알림
- 처리 시간 SLO 미달 (p95 기준) — 일일 요약

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. 룰 카탈로그 파일 작성 (data/compliance-rules/)
# 3. LLM 키 설정 (옵션 — .env 또는 비밀 보관소)
# 4. 빌드 시 자동 실행
```

### 10.2 InstanceManifest 설정 예시

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false              # true 시 warning도 빌드 차단 (운영 정책)
```

### 10.3 비활성화 — 예외 승인 인스턴스 한정

본 Feature는 **의료기관 인스턴스에서 강제 활성이 기본**. 비활성은 다음 흐름으로만 허용:

1. **표준 정책**: 의료기관 인스턴스는 `features[name="compliance-assistant"].enabled=true` 의무. InstanceManifest 검증 시 비활성 인스턴스는 빌드 fail
2. **예외 승인 트랙**: 클라이언트가 비활성 요청 시 — Glitzy 슈퍼 어드민 승인 + 책임 면제 합의서 첨부 후 인스턴스에 `complianceAssistantExemptApproval` 객체 설정 (DATA_MODEL C-08 v0.12 cascade 완료). 본 객체가 있을 때만 비활성 허용. 필드: `approvedBy`·`approvedAt`·`exemptionAgreementUrl`·`reason`
3. **비활성 인스턴스의 REVIEW_WORKFLOW 영향**:
   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
   - **finalRoles 산정** — 비활성 모드에서는 룰 매칭이 없으므로 `requiredApproverRoles[]`는 비어 있음. 다음 기본 게이트는 룰 매칭 없이도 자동 보존 (REVIEW_WORKFLOW § 4.1):
     - `operator` (peerReviewer) — 전 콘텐츠 공통 필수
     - `medical` — riskLevel ∈ {Medium, High} 시 (Medium/High 판정은 어드민 수동)
     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
     - `legal` — `priorReviewRequired === true` 시 자동 (legal 검수자의 매체 판정 단계)
   - **ArticleType 기반 추가 역할** — 어드민이 수동 명시:
     - `review-case`·전후사진 노출 콘텐츠 → `["medical", "legal"]` (수동)
     - `event-price` → `["legal"]` (수동)
   - 비활성 모드 finalRoles는 운영자/검수자가 수동 결정·기록 (audit log)
   - 어드민 발행 화면에 영구 경고 배너 표시 (비활성 사유·예외 승인 ID·일자)
4. **책임 한계**: 비활성 인스턴스의 의료광고법 위반 리스크는 운영자/클라이언트 자체 책임 (예외 승인 합의서에 명시)

---

## 11. 빌드 검증 — 룰 레벨

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | 룰 카탈로그 JSON Schema 검증 실패, **본 Feature `enabled=true` + 룰 카탈로그 부재**(`data/compliance-rules/` 미생성·meta.yaml 없음), LLM 활성화 + API 키 부재 (어드민 모드), composite 룰 평가 오류, RiskInference 입력 누락 |
| **warning** | LLM 호출 타임아웃·재시도 후 실패 (어드민 모드만), KSS 미설치로 fallback 사용 시 |
| **content-gate** | (본 Feature는 결과만 산출 — content-gate 직접 적용 없음. 출력 결과로 어드민 워크플로가 큐 진입 결정) |

> § 9.1 운영 지표(cache hit ratio·처리 시간 SLO 등)는 빌드 검증 룰이 아닌 **운영 관측·알림 영역** — § 9.3 알림 처리.

> **룰 카탈로그 부재 fail 분기**: 본 Feature `enabled=false` (예외 승인 인스턴스, § 10.3) 시 룰 카탈로그 부재는 fail 아님. M0/M1 초기 구현 단계에서는 본 Feature 활성화 + 룰 카탈로그 작성 동시 진행이 표준. MEDICAL_AD_COMPLIANCE_COMMON § 0 "checker 활성화 이후 fail" 조건과 정합.

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| CA-01 | LLM 모델 선택·계약 — Anthropic Claude vs OpenAI GPT vs 자체 모델 | 운영 결정 |
| CA-04 | LLM 프롬프트 버전 관리·운영 — 본 문서 vs 별도 파일 | M2+ 운영 |
| CA-05 | LLM 비용 budget·인스턴스별 한도 | 운영 정책 |
| CA-06 | request deduplication 구현 — Redis vs 메모리 lock | 인프라 결정 |
| CA-07 | strictMode 정책 — 인스턴스별 vs Glitzy 표준 | 운영 정책 |
| CA-09 | precision/recall 정답지(ground truth) 운영 | M3+ 누적 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~CA-02~~ | DATA_MODEL C-08 features[] config cascade | v0.2 — DATA_MODEL C-08 v0.10 cascade로 `features[].config` 필드 추가 |
| ~~CA-03~~ | 한국어 문장 분리 라이브러리 | v0.2 — KSS v3+ 채택. fallback은 정규식 |
| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
| ~~CA-10~~ | complianceAssistantExemptApproval 플래그 | v0.4 — DATA_MODEL C-08 v0.12 cascade로 `complianceAssistantExemptApproval` 필드 신설 (approvedBy·approvedAt·exemptionAgreementUrl·reason) |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |


codex
계획서 본문은 v0.3 패치 내용이 대체로 반영되어 있습니다. 이제 SoT의 세부 타입/예외/캐스케이드 marker와 맞물리는 부분만 좁혀서 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ComplianceCheckResult|LegalDocument|7\\.1\\.1\\.1|findingsBySeverity|requiredApproverRoles|exemptReason\" docs/core/CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CA-CASCADE|EC-DEFER|ComplianceRecord|manual-review|client|audit|eventType|content-submitted|content-approved|content-rejected|content-published" docs/decisions/EAT_CONTENT_PLAN.md docs/decisions/LOCATION_LEGAL_PLAN.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"C0016|sentinel|backfill|VALIDATE|LegalDocument\\(no-op\\)|FAQ\\(no-op\\)|Article|TreatmentPage|Publication|MediaAppearance|calculateFinalRoles|unknown|ComplianceConfigError|evaluatePublishable|configError|manual-review 큐 1종\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scenario|시나리오|check\\(\\) stub LegalDocument|LegalDocument.*check|buildLegalDocumentExemptEnvelope|auto_check_result\\.exemptReason|ComplianceCheckResult SoT|summary|catalogVersion|catalogHash\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 683ms:
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
441:  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
447:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
461:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
471:- 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)
476:type ComplianceCheckResult = {
484:  findingsBySeverity: {
491:  requiredApproverRoles?: ApproverRole[];
516:  requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
543:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
567:  requiredApproverRoles?: ApproverRole[];
615:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 703ms:
docs/admin/REVIEW_WORKFLOW.md:7:> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
docs/admin/REVIEW_WORKFLOW.md:13:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
docs/admin/REVIEW_WORKFLOW.md:22:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
docs/admin/REVIEW_WORKFLOW.md:25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
docs/admin/REVIEW_WORKFLOW.md:26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
docs/admin/REVIEW_WORKFLOW.md:47:- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
docs/admin/REVIEW_WORKFLOW.md:66:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
docs/admin/REVIEW_WORKFLOW.md:160:| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |
docs/admin/REVIEW_WORKFLOW.md:213:            = ComplianceRecord.pageRiskLevel 출력 결과
docs/admin/REVIEW_WORKFLOW.md:224:`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.
docs/admin/REVIEW_WORKFLOW.md:238:| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |
docs/admin/REVIEW_WORKFLOW.md:246:| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
docs/admin/REVIEW_WORKFLOW.md:259:## 5. ComplianceRecord 슬롯 채움 흐름
docs/admin/REVIEW_WORKFLOW.md:263:approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:
docs/admin/REVIEW_WORKFLOW.md:270:| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |
docs/admin/REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
docs/admin/REVIEW_WORKFLOW.md:274:DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
docs/admin/REVIEW_WORKFLOW.md:276:**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
docs/admin/REVIEW_WORKFLOW.md:281:**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
docs/admin/REVIEW_WORKFLOW.md:294:| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
docs/admin/REVIEW_WORKFLOW.md:295:| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |
docs/admin/REVIEW_WORKFLOW.md:297:### 5.4 ComplianceRecord 불변성·버전 모델
docs/admin/REVIEW_WORKFLOW.md:301:- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
docs/admin/REVIEW_WORKFLOW.md:302:- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
docs/admin/REVIEW_WORKFLOW.md:322:| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |
docs/admin/REVIEW_WORKFLOW.md:328:- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
docs/admin/REVIEW_WORKFLOW.md:329:- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
docs/admin/REVIEW_WORKFLOW.md:332:- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
docs/admin/REVIEW_WORKFLOW.md:334:- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
docs/admin/REVIEW_WORKFLOW.md:342:legal > medical > client > operator
docs/admin/REVIEW_WORKFLOW.md:358:           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
docs/admin/REVIEW_WORKFLOW.md:359:                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
docs/admin/REVIEW_WORKFLOW.md:360:                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
docs/admin/REVIEW_WORKFLOW.md:376:  - ComplianceRecord `publishedAt`·`publishedBy` 기록
docs/admin/REVIEW_WORKFLOW.md:399:4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)
docs/admin/REVIEW_WORKFLOW.md:407:- `ComplianceRecord.priorReviewRequired=true|false`
docs/admin/REVIEW_WORKFLOW.md:408:- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
docs/admin/REVIEW_WORKFLOW.md:431:5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
docs/admin/REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
docs/admin/REVIEW_WORKFLOW.md:521:| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
docs/admin/REVIEW_WORKFLOW.md:530:| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:533:| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:534:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:535:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:536:| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:539:| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:540:| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:541:| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:542:| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:543:| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:544:| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:545:| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:546:| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:547:| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:568:- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:582:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:599:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:615:- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)
docs/admin/REVIEW_WORKFLOW.md:634:- ComplianceRecord 슬롯 갱신
docs/admin/REVIEW_WORKFLOW.md:638:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
docs/admin/REVIEW_WORKFLOW.md:640:### 10.2 audit log 페이로드
docs/admin/REVIEW_WORKFLOW.md:715:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
docs/admin/REVIEW_WORKFLOW.md:719:- audit log는 **append-only** — 수정·삭제 불가
docs/admin/REVIEW_WORKFLOW.md:735:  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
docs/admin/REVIEW_WORKFLOW.md:736:  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
docs/admin/REVIEW_WORKFLOW.md:741:| 액션 | super-admin | operator | physician | legal | client |
docs/admin/REVIEW_WORKFLOW.md:748:| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
docs/admin/REVIEW_WORKFLOW.md:752:| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |
docs/admin/REVIEW_WORKFLOW.md:754:> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
docs/admin/REVIEW_WORKFLOW.md:757:> - client: 클라이언트 측 위임 권한 (RL-05)
docs/admin/REVIEW_WORKFLOW.md:775:| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
docs/admin/REVIEW_WORKFLOW.md:787:| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
docs/admin/REVIEW_WORKFLOW.md:790:| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
docs/admin/REVIEW_WORKFLOW.md:799:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
docs/admin/REVIEW_WORKFLOW.md:807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
docs/admin/REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
docs/admin/REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:28:  - `packages/db/src/service-role.ts` `withServiceRole(sql, ctx, allowedFunctions, fn) — ServiceRoleContext { function, actorUserId: AdminUserId (필수), instanceId?, reason }` + audit_log 자동 pending/outcome
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:31:  - `apps/spike-e/migrations/004_audit_event.sql` audit_event 컬럼 = `occurred_at` (created_at 아님) · GRANT INSERT TO app_tenant_user 없음
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:49:| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:61:| ComplianceRecord 폼 · 위험도 분류 | M0 v0.2 (schema) + M0 v1.0 (UI) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:83:> **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:107:│   │   │   ├── actions.ts            — issueMagicLink server action + skeleton-layer audit_event emit
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:111:│   │   │   └── route.ts              — POST · revokeSession + cookie clear + audit_event emit
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:123:│   │   ├── db.ts                     — postgres.Sql singleton (base role · audit emission에 사용)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:126:│   │   ├── slug-resolver.ts          — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 5.2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:127:│   │   ├── post-login-redirect.ts    — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 3.2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:135:│   │       └── ClinicProfileForm.tsx — client component · form state · bound action
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:166:     • emitAuditEvent(sqlBase, { eventType:'magic-link-issued', payload:{ identifier: emailNormalized }})
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:181:       • 없으면 emitAuditEvent(sqlBase, { eventType:'first-active-membership-missing', actorUserId:userId, payload:{ identifier }})
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:185:     • emitAuditEvent(sqlBase, { eventType:'magic-link-consumed', actorUserId:userId, payload:{ identifier }})
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:186:     • emitAuditEvent(sqlBase, { eventType:'session-created', actorUserId:userId })
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:187:     • emitAuditEvent(sqlBase, { eventType:'first-active-membership-resolved', actorUserId:userId, targetUserId:userId, payload:{ slug: firstSlug }})  // cycle6 ADMIN-UI-89: matrix 와 일치하도록 targetUserId 추가
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:194:     • session = await getActiveSession(sqlBase, cfg, signedToken)  // userId 추출 (slug audit 필요)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:196:       • 없으면 notFound() (audit_event 'slug-lookup-not-found' 자동 emit · § 5.2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:206:     • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:208:     (tx 안에서 audit_event INSERT 가능하게 GRANT 추가하는 안 대신 commit 후 base-role emit — ADMIN-UI-36)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:214:       await emitAuditEvent(sqlBase, { eventType:'session-revoked', actorUserId: session.userId })
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:217:       await emitAuditEvent(sqlBase, { eventType:'session-revoked-anonymous', payload:{ reason: e.reason }})
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:278:      eventType: "slug-lookup-not-found",
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:318:### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:322:> - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:323:> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:344:| `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:350:### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:352:**audit_event 단일 SoT 포기** (ADMIN-UI-26). 두 테이블 병존:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:356:| `audit_event` | `id, event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload, occurred_at` (ADMIN-UI-25 — `occurred_at` 사용) | packages/auth.emitAuditEvent · base role connection (tx 밖) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:357:| `audit_log` | `id, instance_id, actor_id, actor_role, action, metadata, ...` | packages/db.withServiceRole 자동 (pending → outcome) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:359:**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:361:대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:365:| eventType | 테이블 | emit 위치 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:367:| `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:368:| `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:369:| `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:370:| `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:371:| `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:372:| `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373:| `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:374:| `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:375:| `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:376:| `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:377:| `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:378:| `slug-lookup-not-found` | audit_event | `slugResolver` (sqlBase 직접 SELECT 후 null 시 emit · ADMIN-UI-54·63·69) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:380:| `user-not-allowlisted-on-consume` (cycle5 신규 ADMIN-UI-75) | audit_event | consume route — allowlist 미존재 사용자 시도 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:381:| `magic-link-issue-denied` (cycle5 신규 ADMIN-UI-75) | audit_event | /sign-in Server Action — allowlist 미존재 사용자 토큰 발급 시도 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:382:| `first-active-membership-resolved` | audit_event | consume route — instance_membership + instance JOIN SELECT 성공 (targetUserId · payload.slug — cycle5 ADMIN-UI-80 camelCase) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:383:| `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:384:| `seed-completed` | audit_event | seed script — sqlBase 직접 INSERT 후 emit (§ 7.1) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:386:> cycle4 정정 (ADMIN-UI-63·66·67·70·71): walking skeleton 의 control-plane operation 은 모두 sqlBase 직접 호출 + audit_event emit 으로 통일. `withServiceRole` 사용 행 (slugResolver · firstActiveMembershipResolver · adminUserUpsert · seedRunner) 모두 제거.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:391:-- audit_event
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:392:SELECT event_type, actor_user_id, payload FROM audit_event
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:397:-- audit_log: skeleton 에서는 비어 있음 (모든 control-plane operation 이 audit_event 사용 · cycle4)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:398:-- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:401:**content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:402:1. `saveClinicProfile` 안에서 audit emit 호출을 `try/catch` 로 감싸 **저장은 성공으로 처리** (`return { ok: true }`)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:404:3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:405:4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:472:      eventType: "content-saved",
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:482:  } catch (auditErr) {
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:483:    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:495:- **ADMIN-UI-22**: last-writer-wins · audit payload updatedAtBefore/After.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:504:                                                #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:508:                                                #         GRANT INSERT ON audit_event TO <web_role>;
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:546:4. seed 자체의 audit 은 **audit_event 에 직접 INSERT** (ADMIN-UI-48 — audit_log 는 `instance_id NOT NULL` 이고 audit_event 는 nullable). emitAuditEvent helper 또는 raw INSERT 사용:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:554:  INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:561:const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:589:// 3) seed audit — audit_event 사용 (audit_log 는 instance_id NOT NULL — ADMIN-UI-48)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:592:  INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:606:| `audit_event` | `apps/spike-e/migrations/004_audit_event.sql` | Spike E |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:607:| `audit_log` | `apps/spike-a/migrations/003_audit_log.sql` | Spike A · `instance_id NOT NULL` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:616:3. slug lookup 실패 → notFound() + audit_event `slug-lookup-not-found` (cycle4 정정 ADMIN-UI-69 — sqlBase 직접 + audit_event emit).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:620:7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:626:13. **Cookie HMAC tampering (ADMIN-UI-43)** — signed token 마지막 byte 변조 후 request → `session-signature-invalid` → cookie clear · /sign-in redirect · audit_event `tenant-resolve-denied` reason=`session-signature-invalid`.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:640:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:654:| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:680:| `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:684:| `packages/auth/migrations` 신규 — auth tables 를 apps/spike-e/migrations 에서 이전 + audit_event RLS/GRANT 추가 (ADMIN-UI-36·13) — skeleton 은 spike-e migrations 직접 적용 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:687:| `packages/db` v0.2 — `audit_event` 와 `audit_log` 통합 방향 결정 (ADMIN-UI-06·26) — skeleton 은 두 테이블 분리 검증 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:688:| Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:704:| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:705:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:706:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:707:| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:708:| 2026-05-15 | v0.2 | cycle1 patch (24 findings 처리) — A-03 자체 핸들러 close · withSkeletonTx 2단계 · audit_event 단일 SoT · slug service-role · seed precondition · deny mapping · super-admin defer · 시나리오 6개 추가 등 |
docs/decisions/LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:17:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
docs/decisions/LOCATION_LEGAL_PLAN.md:20:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
docs/decisions/LOCATION_LEGAL_PLAN.md:28:  - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`
docs/decisions/LOCATION_LEGAL_PLAN.md:46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:51:| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |
docs/decisions/LOCATION_LEGAL_PLAN.md:57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:68:| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
docs/decisions/LOCATION_LEGAL_PLAN.md:146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
docs/decisions/LOCATION_LEGAL_PLAN.md:361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
docs/decisions/LOCATION_LEGAL_PLAN.md:363:- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
docs/decisions/LOCATION_LEGAL_PLAN.md:408:### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)
docs/decisions/LOCATION_LEGAL_PLAN.md:414:{ "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
docs/decisions/LOCATION_LEGAL_PLAN.md:416:{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
docs/decisions/LOCATION_LEGAL_PLAN.md:418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
docs/decisions/LOCATION_LEGAL_PLAN.md:424:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 + **v1.1 LLC-17 patch**) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
docs/decisions/LOCATION_LEGAL_PLAN.md:426:  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <첫 실패의 error.code 또는 error.name>, failedDetails: [{target, code, name, message}]}`. v1.1 LLC-17 patch: `failedDetails[]` 추가로 row 별 원인 보존 (운영 포렌식 안전망 상세화).
docs/decisions/LOCATION_LEGAL_PLAN.md:427:  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건 — 같은 payload shape (`outcome: "failed"`).
docs/decisions/LOCATION_LEGAL_PLAN.md:429:    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
docs/decisions/LOCATION_LEGAL_PLAN.md:432:  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
docs/decisions/LOCATION_LEGAL_PLAN.md:434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs/decisions/LOCATION_LEGAL_PLAN.md:442:  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
docs/decisions/LOCATION_LEGAL_PLAN.md:537:| 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md:539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:552:- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
docs/decisions/LOCATION_LEGAL_PLAN.md:554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
docs/decisions/LOCATION_LEGAL_PLAN.md:593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
docs/core/DATA_MODEL.md:44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
docs/core/DATA_MODEL.md:56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
docs/core/DATA_MODEL.md:589:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
docs/core/DATA_MODEL.md:710:| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
docs/core/DATA_MODEL.md:761:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
docs/core/DATA_MODEL.md:771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
docs/core/DATA_MODEL.md:782:| `clientApprover` | `string` | optional | |
docs/core/DATA_MODEL.md:783:| `clientApprovedAt` | `Date` | optional | |
docs/core/DATA_MODEL.md:815:> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
docs/core/DATA_MODEL.md:832:| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
docs/core/DATA_MODEL.md:848:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs/core/DATA_MODEL.md:928:| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
docs/core/DATA_MODEL.md:930:> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
docs/core/DATA_MODEL.md:934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
docs/core/DATA_MODEL.md:950:| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
docs/core/DATA_MODEL.md:963:> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
docs/core/DATA_MODEL.md:978:| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
docs/core/DATA_MODEL.md:987:- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
docs/core/DATA_MODEL.md:1008:| `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
docs/core/DATA_MODEL.md:1011:| `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
docs/core/DATA_MODEL.md:1047:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core/DATA_MODEL.md:1048:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
docs/core/DATA_MODEL.md:1049:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
docs/core/DATA_MODEL.md:1121:ComplianceRecord (C-10)
docs/core/DATA_MODEL.md:1141:| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
docs/core/DATA_MODEL.md:1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1186:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
docs/decisions/EAT_CONTENT_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.
docs/decisions/EAT_CONTENT_PLAN.md:22:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
docs/decisions/EAT_CONTENT_PLAN.md:60:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
docs/decisions/EAT_CONTENT_PLAN.md:62:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
docs/decisions/EAT_CONTENT_PLAN.md:68:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
docs/decisions/EAT_CONTENT_PLAN.md:87:| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
docs/decisions/EAT_CONTENT_PLAN.md:88:| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
docs/decisions/EAT_CONTENT_PLAN.md:89:| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
docs/decisions/EAT_CONTENT_PLAN.md:90:| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
docs/decisions/EAT_CONTENT_PLAN.md:91:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
docs/decisions/EAT_CONTENT_PLAN.md:92:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
docs/decisions/EAT_CONTENT_PLAN.md:93:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
docs/decisions/EAT_CONTENT_PLAN.md:94:| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
docs/decisions/EAT_CONTENT_PLAN.md:95:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
docs/decisions/EAT_CONTENT_PLAN.md:96:| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
docs/decisions/EAT_CONTENT_PLAN.md:97:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
docs/decisions/EAT_CONTENT_PLAN.md:98:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
docs/decisions/EAT_CONTENT_PLAN.md:104:DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
docs/decisions/EAT_CONTENT_PLAN.md:115:  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
docs/decisions/EAT_CONTENT_PLAN.md:116:  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
docs/decisions/EAT_CONTENT_PLAN.md:148:- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
docs/decisions/EAT_CONTENT_PLAN.md:250:- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
docs/decisions/EAT_CONTENT_PLAN.md:307:- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
docs/decisions/EAT_CONTENT_PLAN.md:322:  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
docs/decisions/EAT_CONTENT_PLAN.md:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
docs/decisions/EAT_CONTENT_PLAN.md:364:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
docs/decisions/EAT_CONTENT_PLAN.md:365:- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
docs/decisions/EAT_CONTENT_PLAN.md:410:- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
docs/decisions/EAT_CONTENT_PLAN.md:421:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
docs/decisions/EAT_CONTENT_PLAN.md:422:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
docs/decisions/EAT_CONTENT_PLAN.md:439:const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
docs/decisions/EAT_CONTENT_PLAN.md:442:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
docs/decisions/EAT_CONTENT_PLAN.md:443:- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
docs/decisions/EAT_CONTENT_PLAN.md:456:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
docs/decisions/EAT_CONTENT_PLAN.md:531:- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
docs/decisions/EAT_CONTENT_PLAN.md:577:**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
docs/decisions/EAT_CONTENT_PLAN.md:621:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
docs/decisions/EAT_CONTENT_PLAN.md:696:- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
docs/decisions/EAT_CONTENT_PLAN.md:697:- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
docs/decisions/EAT_CONTENT_PLAN.md:700:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
docs/decisions/EAT_CONTENT_PLAN.md:701:- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
docs/decisions/EAT_CONTENT_PLAN.md:702:- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
docs/decisions/EAT_CONTENT_PLAN.md:703:- `EC-DEFER-06`: FAQ 다국어.
docs/decisions/EAT_CONTENT_PLAN.md:704:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
docs/decisions/EAT_CONTENT_PLAN.md:705:- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
docs/decisions/EAT_CONTENT_PLAN.md:706:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
docs/decisions/EAT_CONTENT_PLAN.md:709:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
docs/decisions/EAT_CONTENT_PLAN.md:710:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
docs/decisions/EAT_CONTENT_PLAN.md:711:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
docs/decisions/EAT_CONTENT_PLAN.md:719:  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
docs/decisions/EAT_CONTENT_PLAN.md:743:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
docs/decisions/EAT_CONTENT_PLAN.md:744:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
docs/decisions/EAT_CONTENT_PLAN.md:745:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 645ms:
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
19:  - `apps/web/src/components/forms/{ArticleForm, FaqForm, ...}.tsx` (status select)
28:- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
88:  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
89:  'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
90:  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
91:  'Feature', 'Publication', 'MediaAppearance'
155:- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
232:-- packages/core-content/migrations/C0016_status_unlock.sql
233:-- CAM-07 정정: NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리.
243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
262:-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity 모두 (CAM2-03 정정).
263:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
264:--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
265:--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).
267:-- (4-a) Article
271:SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
277:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
280:WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
281:  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
284:-- (4-b) TreatmentPage — risk_level 컬럼 존재
288:SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
294:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
297:WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
298:  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
303:-- (4-e) Publication — risk_level 'Low' fixed CHECK
307:SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
312:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
315:WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
316:  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
319:-- (4-f) MediaAppearance — risk_level 'Low' fixed CHECK
323:SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
328:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
331:WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
332:  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
353:-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE — 6 entity 모두.
355:ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
357:ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
359:ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
361:ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
363:ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
365:ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
386:  IF TG_TABLE_NAME = 'article' AND record_row.content_type <> 'Article' THEN
404:- (CAM-07) NOT VALID + sentinel backfill + VALIDATE 단계 분리 — 기존 published row 우회 안전. 운영 시 sentinel ComplianceRecord 식별자 `metadata @> '{"sentinel":true}'` 로 추후 republish 흐름 가이드 marker.
406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
419: * unknown role fail closed (CAM-16 + CAM2-04 정정):
420: *   auto_check_result.requiredApproverRoles 는 미신뢰 입력. unknown role 감지 시
421: *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
424:export function calculateFinalRoles(
432:      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
436:      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
471:  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed
473:export function evaluatePublishable(
478:  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
481:    finalRoles = calculateFinalRoles(
486:    if (err instanceof ComplianceConfigError) {
487:      return { publishable: false, reasons: [err.message], configError: err.message };
518:- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.
580:    throw new ComplianceConfigError(
673:- 기존 save action (`saveArticle` 등) 안 status field 무시 — 서버 측에서 current row.status 보존 (form FormData 안 status 값 무시)
726:emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).
761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
768:| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
792:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
794:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
826:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
829:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
837:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
838:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 686ms:
33:- **LegalDocument 자동 검수 면제 (CAM-09 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. auto_check_result 슬롯에 명시적 면제 envelope `{automatedDecision:"pass", exemptReason:"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}` 저장.
45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
46:| check() stub (CAM-03·04·05·09 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = CONTENT_STANDARDS § 7.2 ComplianceCheckResult SoT 그대로** (buildBlocked · findingsBySeverity · summary 등 모두 포함). pageRiskLevel 등은 wrapper `ComplianceCheckEnvelope` 안 분리. **pageRiskLevel = maxRisk(input.metadata.explicitRiskLevel ?? "Low", input.metadata.inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 check() 호출 우회 — auto_check_result 슬롯에 면제 envelope 직접 저장** |
52:| vitest scenarios 16건 (CAM-28 정합) | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (4 case) · status 전이 안전성 (3 case) · transition table 무결성 (1 case) |
277:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
294:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
312:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
328:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
524:CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:
531://   summary · catalogVersion · catalogHash · exemptReason 은 result 안 들어가지 않음.
537:    catalogVersion: string;   // "m0-stub-v0.1"
538:    catalogHash: string;      // "stub"
544:// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
545://   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
559:      catalogVersion: "m0-stub-v0.1",
560:      catalogHash: "stub",
570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
582:      "Use buildLegalDocumentExemptEnvelope() instead."
611:  // ComplianceCheckResult SoT — 7 필드만. summary/catalogVersion/catalogHash 등 추가 필드 없음.
627:    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
637:  ? buildLegalDocumentExemptEnvelope(input)
644:  'catalogVersion', envelope.meta.catalogVersion,
645:  'catalogHash', envelope.meta.catalogHash,
757:## 7. § 8.1 시나리오 cascade — CAM-28 정정
759:| # | 시나리오 | 통과 기준 | 검증 방식 |
763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · auto_check_result.exemptReason='LegalDocument-...' | LegalDocument check() 우회 + 면제 envelope | vitest |
773:| 13 | check() stub LegalDocument 입력 → 면제 envelope · exemptReason='LegalDocument-...' · manualReview=false | LegalDocument 면제 (CAM-09) | vitest |
796:| 15 | vitest scenarios 1~16 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
837:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
838:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

codex
한 가지 잔재가 보입니다. v0.3 상세 타입 섹션은 고쳤지만, 범위 요약과 시나리오 표에 cycle 2 이전 표현이 남아 있어 CAM2-01/CAM2-02를 완전 PASS로 보기 어렵습니다. 나머지 migration/finalRoles 쪽도 추가로 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 250 -First 130' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 520 -First 130' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 410 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/CONTENT_STANDARDS.md | Select-Object -Skip 470 -First 30' in C:\Users\assag\solution\website-exposure
 succeeded in 689ms:
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity 모두 (CAM2-03 정정).
--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).

-- (4-a) Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (4-b) TreatmentPage — risk_level 컬럼 존재
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  COALESCE(t.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
-- (4-d) FAQ — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op).
-- (4-e) Publication — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

-- (4-f) MediaAppearance — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE — 6 entity 모두.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;

-- (Step 7) published_content_compliance_guard trigger — CAM-08 정정.
--   BEFORE INSERT/UPDATE ON each entity. status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 일치 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;

 succeeded in 709ms:

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정

CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// ComplianceCheckResult 는 CONTENT_STANDARDS § 7.2 SoT 그대로 import — 7 필드만.
//   summary · catalogVersion · catalogHash · exemptReason 은 result 안 들어가지 않음.

export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
  };
};

// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
//   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel: input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low",
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
      manualReview: false,
      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
    },
  };
}
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04·05) — CAM2-02 정정

**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.

```typescript
// apps/web/src/lib/compliance/check.ts
import type { Finding } from "@glitzy/core-content";

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
      "Use buildLegalDocumentExemptEnvelope() instead."
    );
  }

  // MAX 결합 (격하 금지 — CAM-04)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // High 입력 시 가상 finding (CAM-05). Finding shape 는 CONTENT_STANDARDS § 7.2 Finding SoT.
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      category: "risk-level-virtual",
      pattern: "",
      severity: "content-gate",
      location: { start: 0, end: 0 },
      requiredApproverRoles: ["medical"],
      triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  // ComplianceCheckResult SoT — 7 필드만. summary/catalogVersion/catalogHash 등 추가 필드 없음.
  return {
    result: {
      automatedDecision,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      findingsBySeverity: {
        fail: 0,
        "content-gate": gateRequired ? 1 : 0,
        warning: 0,
        info: 0,
      },
      requiredApproverRoles: gateRequired ? ["medical"] : [],
      findings,
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-06)

```typescript
// submitForReview 안 호출 흐름:
const envelope = contentType === "LegalDocument"
  ? buildLegalDocumentExemptEnvelope(input)
  : await check(input);

// compliance_record INSERT
INSERT INTO compliance_record (..., page_risk_level, auto_check_result, metadata, ...)
VALUES (..., envelope.meta.pageRiskLevel, envelope.result, jsonb_build_object(
  'manualReview', envelope.meta.manualReview,
  'catalogVersion', envelope.meta.catalogVersion,
  'catalogHash', envelope.meta.catalogHash,
  ...(envelope.meta.exemptReason ? { 'exemptReason': envelope.meta.exemptReason } : {})
), ...)
```

- `compliance_record.auto_check_result` = `envelope.result` (CONTENT_STANDARDS § 7.2 SoT 그대로)

 succeeded in 731ms:

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

const KNOWN_ROLES = new Set<string>(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력. unknown role 감지 시
 *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
 *   error 변환 → 운영자가 룰 카탈로그 정정. M0 v0.1 stub 은 빈 array 보장이므로 effective no-op.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
    if (r === "client") {
      // M0 v0.1: client 역할 미합류 (CA-DEFER-10). 룰이 client 를 요구하면 fail closed.
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);  // 위 검증으로 narrow safe
  }
  return Array.from(roles).sort();  // canonical sort
}
```

### 3.2 maxRisk MAX 결합 (CA-GATE-02) — CAM-04 정정

```typescript
// apps/web/src/lib/compliance/risk.ts
const ORDER: Record<RiskLevel, number> = { "Low": 0, "Medium": 1, "High": 2 };
export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) if (ORDER[l] > ORDER[max]) max = l;
  return max;
}
```

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정, CAM2-04 추가 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(
      contentType, record.page_risk_level, record.prior_review_required,
      autoCheck.requiredApproverRoles ?? [],
    );
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }
  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck.automatedDecision === "block") reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
  // (6) warning 강제 처리 정책 — M0 stub: warningAck 미구현 (CA-DEFER-05 · 항상 충족 가정)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
```

**결정**:
- (CAM-06) publishable evaluator 가 REVIEW_WORKFLOW § 7.1 6조건 모두 evaluate. M0 stub 미구현 영역 (priorReview·staleFlags·warningAck) 은 안전 방향 fail closed — priorReviewRequired=true 면 publish 금지. M0 v0.1 priorReviewRequired=false fixed 라 effective no-op.
- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.

## 4. check() stub 결정 — CAM-03·04·05·09 정정, CAM2-01·02 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정

CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// ComplianceCheckResult 는 CONTENT_STANDARDS § 7.2 SoT 그대로 import — 7 필드만.

 succeeded in 714ms:
- 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)

### 7.2 출력

```ts
type ComplianceCheckResult = {
  // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
  automatedDecision: "block" | "gate" | "warn" | "pass";
  // 세부 플래그 (편의)
  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
  // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
  requiredApproverRoles?: ApproverRole[];
  // 상세 findings
  findings: Finding[];
};

// automatedDecision 결정 규칙
// - findings에 severity="fail" 1개 이상 → "block"
// - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
// - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
// - 아니면 "pass"

codex
# COMPLIANCE_ASSISTANT_M0_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=2

## cycle 2 patch 검증
- CAM2-01: FAIL — §4.1 상세 타입은 PASS지만 §1.2에 `summary 등 모두 포함`, §1.1/시나리오에 `auto_check_result.exemptReason` 잔재.
- CAM2-02: FAIL — submitForReview 우회/`check()` throw는 PASS지만 시나리오 #13이 `check() stub LegalDocument 입력 → 면제 envelope`로 남아 테스트 SoT와 충돌.
- CAM2-03: PASS — 6 entity 명시, LegalDocument/FAQ no-op, NULL 검증 6건, VALIDATE 6건 확인.
- CAM2-04: PASS — unknown role `ComplianceConfigError` throw + `evaluatePublishable` configError 반환 확인.
- CAM2-05: PASS — acceptance marker `manual-review 큐 1종` 확인.

## new findings
- CAM3-01 blocking — CAM2-01/02 잔재 정리 필요: `exemptReason`은 `auto_check_result`가 아니라 `metadata/envelope.meta`에만 둬야 하며, LegalDocument 테스트 시나리오는 `check()` 직접 입력 면제 기대가 아니라 throw 기대 또는 helper 직접 호출 기대로 분리해야 함.
- CAM3-02 major — `buildLegalDocumentExemptEnvelope()`의 `pageRiskLevel`이 `explicit ?? inferred ?? Low`라 격하 가능. SoT MAX 결합 원칙에 맞게 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`로 통일 필요.

## acceptance 판정
- closeableAfterPatch=false — 위 2건 patch 후 cycle 4 재검증 권고.
- 누계 시작점 147 cycle 1+2+3: 147 + 28 + 5 + 2 = 182.
tokens used
99,647
# COMPLIANCE_ASSISTANT_M0_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=2

## cycle 2 patch 검증
- CAM2-01: FAIL — §4.1 상세 타입은 PASS지만 §1.2에 `summary 등 모두 포함`, §1.1/시나리오에 `auto_check_result.exemptReason` 잔재.
- CAM2-02: FAIL — submitForReview 우회/`check()` throw는 PASS지만 시나리오 #13이 `check() stub LegalDocument 입력 → 면제 envelope`로 남아 테스트 SoT와 충돌.
- CAM2-03: PASS — 6 entity 명시, LegalDocument/FAQ no-op, NULL 검증 6건, VALIDATE 6건 확인.
- CAM2-04: PASS — unknown role `ComplianceConfigError` throw + `evaluatePublishable` configError 반환 확인.
- CAM2-05: PASS — acceptance marker `manual-review 큐 1종` 확인.

## new findings
- CAM3-01 blocking — CAM2-01/02 잔재 정리 필요: `exemptReason`은 `auto_check_result`가 아니라 `metadata/envelope.meta`에만 둬야 하며, LegalDocument 테스트 시나리오는 `check()` 직접 입력 면제 기대가 아니라 throw 기대 또는 helper 직접 호출 기대로 분리해야 함.
- CAM3-02 major — `buildLegalDocumentExemptEnvelope()`의 `pageRiskLevel`이 `explicit ?? inferred ?? Low`라 격하 가능. SoT MAX 결합 원칙에 맞게 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`로 통일 필요.

## acceptance 판정
- closeableAfterPatch=false — 위 2건 patch 후 cycle 4 재검증 권고.
- 누계 시작점 147 cycle 1+2+3: 147 + 28 + 5 + 2 = 182.
