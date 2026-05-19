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
session id: 019e3a34-8ff4-7a62-926e-2e4c92a6112e
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.1 (draft). 본 plan은 compliance-assistant Feature spec v1.0 (612 line · 5 cycle 47 finding · M1 acceptance) 의 **M0 vertical slice scope** — 빌드 모드/룰 카탈로그/LLM/캐시는 모두 CA-DEFER. 핵심 M0 정합 + EAT_CONTENT v1.0 EC-DEFER-05/07/12 해소 + LL-DEFER-01 해소.

This is **cycle 1**. Produce a strict, broad critique on whether the plan correctly maps onto compliance-assistant Feature spec, REVIEW_WORKFLOW, DATA_MODEL C-10, RISK_LEVELS, CONTENT_STANDARDS § 7, EAT_CONTENT v1.0, LOCATION_LEGAL v1.1. 가능한 한 광범위하게.

## SoT to read

1. `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 0 한 페이지 요약 · § 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시 · § 9 운영 지표 · § 10 비활성화)
2. `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯 · § 6 StaleFlags
3. `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — 풀명세 (recordPhase · recordVersion · mediaThresholdAssessment · staleFlags · warningAck · llmAssist)
4. `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference · § 3 RiskRule · § 4 finalRoles
5. `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05/07/12 (해소 대상)
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 (해소 대상)
8. `packages/core-content/src/schema.ts` v0.4 (현재 Drizzle SoT — 정합 확인)
9. `apps/web/src/lib/action-context.ts` (assertActionEligibility 패턴)

## Plan under review

`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.1 — 핵심 결정 12종:
- CA-SCHEMA-01·02·03 ComplianceRecord skeleton (10 contentType enum · 4 CHECK)
- CA-SCHEMA-04·05·06 ReviewQueueEntry (content-gate 만 · required_roles · partial UNIQUE)
- CA-SCHEMA-07 6 entity status unlock + compliance_record_id FK + published_requires_record CHECK
- CA-GATE-01·02 finalRoles 계산 (operator + (Medium/High ? medical : ∅) + (LegalDocument ? legal : ∅) + priorReviewRequired ? legal) + publishable evaluator
- CA-CHECK-01·02 check() stub (manualReview only · ruleCatalog 미합류)
- CA-UI-01·02·03 /review-queue list/detail + 6 form status 9-state + 액션 버튼
- CA-ACTION-01~07 4 server action + advisory lock + assertReviewerEligibility + status 전이 table

## What to check (cycle 1)

### Plan SoT 합치
- DATA_MODEL C-10 풀명세 vs M0 컬럼 subset — 누락 필드가 CA-DEFER-13 매핑에 포함되는지 (mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReview 풀)
- REVIEW_WORKFLOW § 2 상태 머신 9종 vs status 전이 table — 누락 전이 없는지 (`published → blocked` · `published → stale` · `rejected → review-queued` 등)
- REVIEW_WORKFLOW § 4.1 finalRoles 공식 — `requiredApproverRoles[]` 룰 추가 역할 표현 (M0 v0.1 항상 [] 인지 확인) · client 역할 CA-DEFER-10 명시 정합
- compliance-assistant § 3.3 check() 단일 엔트리포인트 — 입출력 시그니처 CONTENT_STANDARDS § 7 정합 · M0 stub 의 cacheKey/ruleHash 부재 처리
- RISK_LEVELS § 2.3 RiskInference pageRiskLevel = MAX(pageType, articleType, slot, inlineRiskFlags, explicit) — M0 stub 의 단순 input 우선 처리가 정합인지 (Phase Alpha cascade marker)

### Scope · CA-DEFER 정합
- 13 CA-DEFER marker가 spec § 의 모든 미합류 영역 포함 — 누락 없는지 (LLM · 캐시 · ruleCatalog · composite · contextExceptions · warningAck · stale · request-changes · delegate · priorReview · mediaThreshold · client · attachments)
- M0 v1.0 cascade Phase Alpha · Beta · M2+ 분류 정합
- EC-DEFER-05/07/12 해소 vs ruleCatalog 미합류 — FAQ published 가능하지만 ruleCatalog 없으면 manualReview만. plan § 1.1 "EC-DEFER-05 부분 해소" 정합

### DB 마이그레이션
- C0014 ComplianceRecord 풀 CHECK 4건 정합 — operator(peer) · Medium/High physician · LegalDocument legal · publishedAt+publishedBy
- C0014 compliance_content_type enum 10종 (M0 active) — DATA_MODEL C-10 17종 중 누락 7종 (MedicalConditionPage·ReviewPolicy·PricingPage·FacilitiesPage·NewsItem·ReservationPage·Feature) CA-DEFER-13 매핑 정합
- C0015 review_queue_type enum content-gate 만 — warning/stale enum ADD VALUE cascade 가 CA-DEFER-05·06 명시
- C0015 partial UNIQUE (open/in-progress entry per contentRef) — resubmit 시 idempotency 흐름 정합
- C0016 6 entity status unlock + compliance_record_id FK — Article/TreatmentPage 의 기존 nullable column 정합 (C0004/C0005 안 이미 존재) · Publication/Media는 ADD COLUMN 필요 정합
- C0016 기존 article published 1행 backfill 부재 — 운영 영향 명시 (개발자 수동 republish marker)

### AND 게이트
- finalRoles 계산 함수 — `operator` 전 콘텐츠 공통 (REVIEW_WORKFLOW § 4.1 정합)
- priorReviewRequired M0 v0.1 false fixed — CA-DEFER-08 정합. 그러나 plan § 3.1 안 priorReviewRequired ? legal: ∅ 로직은 effective no-op이지만 코드 잔존 — 정확성 정합
- isApprovedByAllFinalRoles — DB row null 검사 패턴 정합 · race condition 안전성

### check() stub
- pageRiskLevel = input.metadata.explicitRiskLevel ?? inferredRiskLevel ?? "Low" — RISK_LEVELS § 2.3 MAX 규칙 미적용 marker (CA-DEFER-02)
- catalogVersion/catalogHash = "m0-stub-v0.1"/"stub" — 호출자가 stub 식별 가능
- ComplianceCheckResult 의 다른 필드 (effectivePolicy · ruleMatchedCount · cacheKey 등) CONTENT_STANDARDS § 7.2 vs M0 stub 차이 검증

### server action
- 4 action 시그니처 + advisory lock + transition table — REVIEW_WORKFLOW § 2.3 트리거 표 정합
- assertReviewerEligibility — admin_user.physician_reviewer_eligible / legal_reviewer_eligible flag 존재 검증 (기존 schema 안 정합)
- audit emit 4종 — Audit Action 카탈로그 (REVIEW_WORKFLOW § 9.1.1 알림 정책) 정합

### 어드민 UI
- /review-queue list + detail — REVIEW_WORKFLOW § 3 · § 4 정합 (큐 우선순위 · SLA 표시 · 검수자별 화면 책임)
- 6 entity form status select 9-state — 풀 enum 활성화 정합. 그러나 직접 status='published' 입력 차단 (publishContent action 통해서만) — server action 안 status 전이 검증 정합
- 액션 버튼 — "검수 요청" (draft|rejected) · "발행" (publishable + operator role)

### 시나리오 14건 정합
- 시나리오 1~14 통과 기준 명시 — 자동 검증 가능 vs e2e 검증 분리 정합
- 시나리오 13 FAQ published EC-DEFER-05 부분 해소 — ruleCatalog 미합류이므로 manualReview only — plan 정합
- 시나리오 14 concurrent advisory_xact_lock — vitest scope vs e2e scope 명시

### docs cascade · CA-CASCADE 5종
- CA-CASCADE-01~05 docs 정합 — 각 cascade가 정확한 SoT 문서 + § 위치 식별

## Output format

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAM-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): compliance-assistant § X · REVIEW_WORKFLOW § Y · DATA_MODEL C-10 등
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition 점검
- CA-DEFER 매핑 완비성: <PASS|FAIL>
- 6 entity status unlock CHECK 4건 정합: <PASS|FAIL>
- finalRoles 공식 정합: <PASS|FAIL>
```

가능한 한 광범위하게 보고, plan § 또는 file:line 인용. 한국어로 응답.

codex
검토 대상 문서와 코드 SoT를 먼저 읽어서 plan의 결정 번호별로 매핑하겠습니다. 라인 인용이 필요하므로 `rg`와 부분 읽기로 근거 위치를 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/admin/REVIEW_WORKFLOW.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/features/compliance-assistant.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
 succeeded in 841ms:
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


 succeeded in 850ms:
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

 succeeded in 858ms:
# compliance-assistant M0 vertical slice plan (v0.1·draft·2026-05-18)

> **상태**: **v0.1 (draft)** — Codex 자동 비평 진입 전 base. compliance-assistant Feature spec v1.0 (612 line · 5 cycle 47 finding) 의 M0 minimal vertical slice. EAT_CONTENT code v1.0 acceptance 직후 (147 cycle 1231 누계).

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 marker (M0 컬럼 subset) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 marker (큐 1종·역할 2종 활성화) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN EC-DEFER-05/07/12 해소 marker · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 해소 marker · (6) CA-CASCADE-05 manifest 18단계 (16 + C0014/C0015). 실 SQL 코드 cascade 는 별 cycle.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
- `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯
- `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — recordPhase 2단계 · finalRoles · MediaThresholdAssessment (M0 외)
- `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference · § 3 RiskRule 카탈로그 · § 4 finalRoles
- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput·Result 인터페이스
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05/07/12 해소 대상
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 (LegalDocument 발행) 해소 대상
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.4 (Drizzle SoT)
  - `apps/web/src/components/forms/{ArticleForm, FaqForm, TreatmentPageForm, ...}.tsx` (status select)
  - `apps/web/src/lib/action-context.ts` (assertActionEligibility · admin_user 역할)

## 1. 목적과 범위

### 1.1 목적

- **EC-DEFER-05·07·12 해소**: 4 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish + published 발행 unlock.
- **LL-DEFER-01 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화.
- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + content-gate 큐 + multi-role AND 게이트 (operator·medical·legal).
- **자동 검수(룰) 미합류 marker**: check() stub — 항상 `manualReview` 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass·pageRiskLevel from input). 실 ruleCatalog/composite/LLM은 별 plan.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| C-08 `ComplianceRecord` skeleton DB table | DATA_MODEL C-10 풀명세 subset — 핵심 슬롯 + recordPhase + recordVersion. mediaThresholdAssessment · attachments · staleFlags · warningAcknowledgements · llmAssist · priorReview SubmissionId 등 EC-DEFER-13 phase (M1) |
| C-XX `ReviewQueueEntry` skeleton DB table | REVIEW_WORKFLOW § 3 SoT — queue_type enum (M0 v0.1: `content-gate` 만 활성. `warning`/`stale` enum 값 합류는 다음 cycle) · status enum (open/in-progress/resolved) · priority (P0/P1/P2) · assigned_to · sla_due_at |
| 6 entity status 전이 활성화 | Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance — DB CHECK skeleton-limit/v01-limit 해제. content_publication_status enum 9-state 활성화 |
| 6 entity compliance_record_id FK | 모든 published 콘텐츠는 published ComplianceRecord 참조. DB CHECK: status='published' → compliance_record_id IS NOT NULL |
| 어드민 /review-queue 화면 | list (content-gate 큐) + detail page (entry approve/reject) |
| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
| AND 게이트 평가 함수 | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅). priorReviewRequired는 M0 v0.1 false fixed |
| check() stub | manualReview only · ruleCatalog 미합류 marker · findings=[] · gateRequired=false · automatedDecision=pass · pageRiskLevel = input.explicit ?? input.inferred ?? "Low" |
| 4 form status select 9-state | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm — status enum subset 해제 |
| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
| DB CHECK 해제 6건 | legal_document_status_skeleton_limit · legal_document_published_at_null · legal_document_risk_level_skeleton_limit · faq_status_v01_limit · faq_published_at_null_v01 (publication/media v0.1 status 차단은 form 만이므로 DB CHECK 해제 불필요) |
| compliance_record 발행 게이트 CHECK | LegalDocument: status='published' → legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL. 모든 contentType: status='published' → compliance_record_id IS NOT NULL · recordPhase='published' (별 RAISE: app layer) |
| audit_event 통합 | content-submitted-for-review · content-approved · content-rejected · content-published — 모두 emitAuditEvent |
| vitest scenarios 14건 | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (3 case) · status 전이 안전성 (3 case) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
| RiskInference 자동 추론 (inlineRiskFlags 매칭 · explicit MAX 결합 · pageType·articleType·slot) | CA-DEFER-01 동반 | CA-DEFER-02 |
| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
| MediaThresholdAssessment · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
| ComplianceRecord 부분 영역 (mediaThreshold · attachments · staleFlags · warning) 풀 컬럼 | 각 CA-DEFER 매핑 phase | CA-DEFER-13 |

## 2. 데이터 모델 결정

### 2.1 C0014 `compliance_record` 신규 table (CA-SCHEMA-01)

```sql
-- packages/core-content/migrations/C0014_compliance_record.sql

-- recordPhase enum — DATA_MODEL C-10 v0.8
CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');

-- contentType enum — DATA_MODEL C-10 v0.6 17종. M0 v0.1 active 토큰만 enum 등록.
--   미합류 토큰은 Phase Alpha cascade. 본 enum 은 app layer 가 토큰 검증 책임.
CREATE TYPE compliance_content_type AS ENUM (
  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'Article', 'FAQ',
  'LocationProfile', 'ArticleCategory', 'LegalDocument',
  'Publication', 'MediaAppearance'
);

CREATE TABLE compliance_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,                              -- 대상 콘텐츠 @id (slug 또는 uuid)
  page_risk_level risk_level NOT NULL,
  article_type TEXT,                                       -- (Article인 경우)
  inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_check_result JSONB NOT NULL,                        -- compliance-assistant 결과 (M0 stub: findings=[]·gateRequired=false·automatedDecision='pass'·hasWarnings=false·manualReview=true)
  -- 슬롯 4종 (M0 active 2종 · legal + physician active)
  peer_reviewer UUID,                                       -- admin_user.id — operator 검수
  peer_reviewed_at TIMESTAMPTZ,
  physician_approver UUID,                                  -- admin_user.id — medical 검수
  physician_approved_at TIMESTAMPTZ,
  legal_counsel UUID,                                       -- admin_user.id — legal 검수
  legal_counsel_at TIMESTAMPTZ,
  -- client 슬롯 — M0 미사용 (CA-DEFER-10 marker · 컬럼은 추가)
  client_approver UUID,
  client_approved_at TIMESTAMPTZ,
  prior_review_required BOOLEAN NOT NULL DEFAULT false,    -- M0 v0.1 false fixed
  prior_review_submission_id TEXT,                          -- CA-DEFER-08
  prior_review_passed BOOLEAN,                              -- CA-DEFER-08
  published_at TIMESTAMPTZ,                                 -- recordPhase='published' 시 required (app layer 검증)
  published_by UUID,                                        -- admin_user.id
  record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  record_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- CHECK 정합
  CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  CONSTRAINT compliance_record_published_requires_at CHECK (
    record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  ),
  -- M0 LegalDocument 게이트: published 시 legalCounsel/legalCounselAt required
  CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
    record_phase <> 'published' OR content_type <> 'LegalDocument'
    OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  ),
  -- M0 Medium/High 게이트: published 시 physicianApprover required
  CONSTRAINT compliance_record_med_high_requires_physician CHECK (
    record_phase <> 'published' OR page_risk_level = 'Low'
    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  ),
  -- 모든 published 게이트: operator 슬롯 (peerReviewer) required
  CONSTRAINT compliance_record_published_requires_peer CHECK (
    record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  ),
  -- 동일 (instance_id, content_type, content_ref) + record_version 유일
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

**결정**:
- (CA-SCHEMA-01) M0 v0.1 풀명세 컬럼 subset — 핵심 슬롯 + recordPhase + recordVersion. mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReview 풀 영역 모두 CA-DEFER-13 (각 phase 매핑).
- (CA-SCHEMA-02) `compliance_content_type` enum 등록 — M0 active 10종 (FAQ/Publication/Media/ArticleCategory 포함 EAT_CONTENT v1.0 정합). DATA_MODEL C-10 17종 중 7종 (MedicalConditionPage·ReviewPolicy·PricingPage·FacilitiesPage·NewsItem·ReservationPage·Feature) 은 CA-DEFER-13.
- (CA-SCHEMA-03) DB CHECK 4건 — published 게이트 의무. operator(peer) + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.

### 2.2 C0015 `review_queue_entry` 신규 table (CA-SCHEMA-04)

```sql
-- packages/core-content/migrations/C0015_review_queue_entry.sql

CREATE TYPE review_queue_type AS ENUM ('content-gate');  -- M0 v0.1 1종 만. warning/stale 은 enum ADD VALUE cascade (CA-DEFER-05·06)
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved', 'cancelled');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  compliance_record_id UUID,                                -- pre-publish ComplianceRecord 참조
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
  assigned_to UUID,                                          -- admin_user.id
  assigned_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ NOT NULL,                          -- created_at + P0=3 business days · P1=7 · P2=14
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,                                          -- admin_user.id
  resolution_type TEXT,                                      -- approved · rejected · cancelled
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
    status NOT IN ('resolved', 'cancelled') OR resolved_at IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
    status NOT IN ('resolved', 'cancelled') OR resolution_type IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_required_roles_array CHECK (jsonb_typeof(required_roles) = 'array' AND jsonb_array_length(required_roles) >= 1),
  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
    REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
  WHERE status IN ('open', 'in-progress');
CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
-- 동일 contentRef 의 open entry 1개 — partial UNIQUE
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

**결정**:
- (CA-SCHEMA-04) `review_queue_type` enum M0 v0.1 = `content-gate` 만 (warning/stale 은 CA-DEFER-05·06).
- (CA-SCHEMA-05) `required_roles` JSONB array — finalRoles 매핑. 룰 추가 역할은 CA-DEFER-01.
- (CA-SCHEMA-06) `review_queue_entry_open_unique` partial UNIQUE — 동일 contentRef 의 open/in-progress entry 중복 차단 (resubmit 시 기존 entry resolved 처리 후 새 entry 생성).

### 2.3 6 entity status CHECK 해제 + compliance_record_id 추가 (CA-SCHEMA-07)

```sql
-- packages/core-content/migrations/C0016_status_unlock.sql

-- LegalDocument CHECK 해제
ALTER TABLE legal_document DROP CONSTRAINT legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_risk_level_skeleton_limit;
ALTER TABLE legal_document ADD COLUMN compliance_record_id UUID;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
-- published 시 compliance_record_id required
ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);

-- FAQ CHECK 해제
ALTER TABLE faq DROP CONSTRAINT faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT faq_published_at_null_v01;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);
-- compliance_record_id 는 C0012 안 이미 nullable column 정의됨 (compliance-assistant 합류 시 ref) — FK constraint 만 추가
ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;

-- Article + TreatmentPage 는 이미 nullable compliance_record_id 정의됨 (C0004·C0005) — FK + published_requires CHECK 만 추가
ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);

codex
초반부만으로도 몇 가지 불일치가 보입니다. 이제 나머지 plan과 데이터 모델, 위험도, 콘텐츠 표준, 실제 schema를 이어서 확인해 blocker/major/minor로 분류하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md | Select-Object -Skip 260 -First 320' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs/core/DATA_MODEL.md -Pattern 'C-10|ComplianceRecord|mediaThreshold|staleFlags|warning|llmAssist|recordPhase|recordVersion' -Context 2,4" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs/compliance/RISK_LEVELS.md -Pattern 'RiskInference|MAX|finalRoles|requiredApproverRoles|ApproverRole|RiskRule|Low|Medium|High' -Context 2,4" in C:\Users\assag\solution\website-exposure
 succeeded in 808ms:

-- Publication + MediaAppearance — compliance_record_id 컬럼 추가 (C0010/C0011 안 미존재 — 본 migration 안 ADD COLUMN)
ALTER TABLE publication ADD COLUMN compliance_record_id UUID;
ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);
ALTER TABLE media_appearance ADD COLUMN compliance_record_id UUID;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id)
  REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (
  status <> 'published' OR compliance_record_id IS NOT NULL
);
```

**결정**:
- (CA-SCHEMA-07) 6 entity 의 published 시 compliance_record_id IS NOT NULL CHECK — 검수 우회 차단 게이트.
- (CA-SCHEMA-08) 기존 article published 1행 backfill — 본 migration 안 별도 backfill 없음. v0.1 published 1샘플은 어드민 UI 안 republish 흐름 거치도록 (개발자가 수동 처리 marker).

## 3. AND 게이트 평가 결정

### 3.1 finalRoles 계산 (CA-GATE-01)

`apps/web/src/lib/compliance/final-roles.ts` 신설:

```typescript
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: ApproverRole[] = [],
): ApproverRole[] {
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");  // M0 v0.1 false fixed → effective no-op
  for (const r of requiredApproverRoles) roles.add(r);
  return Array.from(roles);
}

export function isApprovedByAllFinalRoles(
  record: ComplianceRecordRow,
  finalRoles: ApproverRole[],
): boolean {
  for (const role of finalRoles) {
    if (role === "operator" && (record.peer_reviewer === null || record.peer_reviewed_at === null)) return false;
    if (role === "medical" && (record.physician_approver === null || record.physician_approved_at === null)) return false;
    if (role === "legal" && (record.legal_counsel === null || record.legal_counsel_at === null)) return false;
  }
  return true;
}
```

### 3.2 publishable 게이트 (CA-GATE-02)

`apps/web/src/lib/compliance/publishable-check.ts` 신설:

```typescript
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reason: string; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const finalRoles = calculateFinalRoles(
    contentType,
    record.page_risk_level,
    record.prior_review_required,
  );
  const missingRoles = finalRoles.filter((r) => !isRoleSatisfied(record, r));
  if (missingRoles.length > 0) {
    return {
      publishable: false,
      reason: `다음 역할의 승인이 필요합니다: ${missingRoles.join(", ")}`,
      finalRoles,
      missingRoles,
    };
  }
  // M0 v0.1: automatedDecision !== "block" 가정 (stub 항상 pass)
  const autoCheck = record.auto_check_result as { automatedDecision?: string };
  if (autoCheck.automatedDecision === "block") {
    return { publishable: false, reason: "자동 검수 차단 (block) 상태 — 본문 정정 필요", finalRoles, missingRoles: [] };
  }
  return { publishable: true, finalRoles };
}
```

## 4. check() stub 결정

### 4.1 stub 구조 (CA-CHECK-01)

`apps/web/src/lib/compliance/check.ts` 신설:

```typescript
import type { ComplianceCheckInput, ComplianceCheckResult } from "./types";

/**
 * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
 *
 * **M0 v0.1 동작 (CA-CHECK-01)**:
 * - manualReview only: findings=[] · gateRequired=false · automatedDecision='pass' · hasWarnings=false
 * - pageRiskLevel = input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? 'Low'
 * - ruleCatalog 미합류 — CA-DEFER-01·02 marker
 * - LLM 미합류 — CA-DEFER-03 marker
 * - 캐시 미합류 — CA-DEFER-04 marker
 *
 * Phase Alpha cascade 시 본 함수 시그니처 유지 (입출력 SoT CONTENT_STANDARDS § 7).
 */
export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult> {
  const pageRiskLevel =
    input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low";
  return {
    contentRef: input.contentRef,
    contentType: input.contentType,
    pageRiskLevel,
    findings: [],
    gateRequired: false,
    automatedDecision: "pass",
    hasWarnings: false,
    manualReview: true,  // CA-CHECK-01: M0 stub marker — 호출자가 manualReview 표시 인지
    requiredApproverRoles: [],
    catalogVersion: "m0-stub-v0.1",
    catalogHash: "stub",
  };
}
```

### 4.2 호출 시점 (CA-CHECK-02)

- `submitForReview` server action 안 check() 호출 → ComplianceRecord(pre-publish) 의 auto_check_result 필드에 결과 저장.
- M0 v0.1 stub 이라 결과는 항상 pass — gateRequired=false (큐 진입 자동 트리거 없음). M0 큐 진입은 운영자 명시 submitForReview 트리거 만.

## 5. 어드민 UI 결정

### 5.1 /admin/{slug}/review-queue 화면 (CA-UI-01)

```
apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/
  page.tsx               # list (open · in-progress entries · SLA-due 강조)
  [entryId]/page.tsx     # detail — 콘텐츠 메타 + ComplianceRecord 슬롯 표시 + 역할별 approve/reject 폼
  actions.ts             # approveEntry · rejectEntry · cancelEntry
```

list page columns:
- 콘텐츠 유형 · 콘텐츠 ref · pageRiskLevel · finalRoles · status · priority · SLA 마감 · assigned

detail page sections:
- 콘텐츠 본문 미리보기 (read-only)
- ComplianceRecord 슬롯 표시 (operator/medical/legal — 각 슬롯의 reviewer 이름 + timestamp)
- 본인의 역할에 한해 approve/reject 폼 노출 (admin_user.physician_reviewer_eligible · legal_reviewer_eligible flag 확인)
- 거부 사유 textarea (50자 이상 required — REVIEW_WORKFLOW § 4.3)

### 5.2 6 entity form status select 활성화 (CA-UI-02)

- ArticleForm · TreatmentPageForm · LegalDocumentForm · FaqForm · PublicationForm · MediaAppearanceForm — status enum 9-state 모두 활성화 (`draft → review-queued → in-review → approved → publishable → published`).
- zod schema 안 EatStatusSchema / PUBLICATION_STATUSES 정정 — 풀 9-state 허용.
- 그러나 server action 안 status 전이 검증 — `draft → published` 등 우회 차단 (transition table SoT).

### 5.3 entity form 안 액션 버튼 (CA-UI-03)

각 edit page 안 추가 버튼:
- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
- "검수 큐 진입" 후에는 form은 read-only — 검수자 액션은 /review-queue/{entryId} 에서

## 6. server action 결정

### 6.1 4 server action 시그니처 (CA-ACTION-01)

`apps/web/src/lib/compliance/transitions.ts` (helper) + 각 entity actions.ts 안 server action.

```typescript
// transitions.ts — 모든 entity 공통 helper
export async function submitForReview(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string,
  contentRow: { id: string; status: string; risk_level?: string | null },
): Promise<{ recordId: string; entryId: string }>;

export async function approveContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, role: ApproverRole, actorUserId: string,
): Promise<{ allApproved: boolean }>;

export async function rejectContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, reason: string, actorUserId: string,
): Promise<void>;

export async function publishContent(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string, recordId: string, actorUserId: string,
): Promise<void>;
```

**결정**:
- (CA-ACTION-01) 모든 4 action 은 helper 안 핵심 로직 + entity별 actions.ts 안 thin wrapper. transitions.ts 가 ComplianceRecord + ReviewQueueEntry + entity row 의 atomic 갱신 책임.
- (CA-ACTION-02) approve 시 `pg_advisory_xact_lock(hashtext('compliance-' || recordId))` 로 같은 record 의 concurrent approve race 차단.
- (CA-ACTION-03) `assertReviewerEligibility(ctx, role)` — admin_user flag 검증. operator 역할은 instance_membership.role='operator' · medical 은 physician_reviewer_eligible=true · legal 은 legal_reviewer_eligible=true.
- (CA-ACTION-04) publish 시 evaluatePublishable() 호출 → publishable=false 면 form-level error 반환.
- (CA-ACTION-05) 발행 시 동일 record 의 recordPhase만 'published' 로 UPDATE — 새 record 생성 안 함 (REVIEW_WORKFLOW § 5.2 (b) 정합).

### 6.2 status 전이 table (CA-ACTION-06)

```typescript
// transitions.ts
const TRANSITIONS = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],  // 후자는 다음 검수자
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};
```

- (CA-ACTION-06) 검증 함수 `assertTransitionAllowed(from, to)`. 모든 server action 의 첫 줄.
- (CA-ACTION-07) 자동 전이 (`approved → publishable` · `in-review → approved`) 는 server action 안 별도 step — 명시 자동 트리거.

## 7. § 8.1 시나리오 cascade

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
| 3 | LegalDocument draft → submitForReview → finalRoles=['operator', 'legal'] | LegalDocument 자동 추가 (Low 인데도 legal 필수) |
| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 |
| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 |
| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 |
| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL |
| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK |
| 11 | check() stub 호출 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel 우선 |
| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
| 13 | FAQ published 1행 (DB CHECK 해제 검증) → FAQ public page mainEntity 1건 + JSON-LD 출력 | EC-DEFER-05 부분 해소 |
| 14 | concurrent approveContent (same record · same role) → advisory_xact_lock 직렬화 → 마지막 호출 idempotent | pg_advisory_xact_lock |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0014 compliance_record migration | packages/core-content/migrations/C0014_compliance_record.sql |
| 2 | C0015 review_queue_entry migration | C0015_review_queue_entry.sql |
| 3 | C0016 6 entity status unlock + compliance_record_id FK migration | C0016_status_unlock.sql |
| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
| 5 | Compliance types + check() stub | apps/web/src/lib/compliance/types.ts + check.ts |
| 6 | final-roles + publishable-check + transitions helper | apps/web/src/lib/compliance/{final-roles, publishable-check, transitions}.ts |
| 7 | assertReviewerEligibility helper | apps/web/src/lib/compliance/eligibility.ts (admin_user flag 검증) |
| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts (entity별 wrapper from each actions.ts) |
| 9 | /admin/{slug}/review-queue/page.tsx (list) | (admin) route |
| 10 | /admin/{slug}/review-queue/[entryId]/page.tsx (detail) + actions.ts | (admin) route + ReviewEntryApprovalForm component |
| 11 | 6 entity form status select 풀 9-state 활성화 + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
| 12 | 6 entity edit page 안 "검수 요청" / "발행" 액션 버튼 | doctors/[slug]/page.tsx · ... |
| 13 | manifest 18단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
| 14 | audit emit 4종 — content-submitted-for-review · content-approved · content-rejected · content-published | (각 server action 안 emitAuditEvent) |
| 15 | vitest scenarios 1~14 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 해소 marker | doc patches |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 Phase Alpha 합류
- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
- `CA-DEFER-02`: RiskInference 자동 추론 · inlineRiskFlags 매칭
- `CA-DEFER-04`: 캐시 2종 + cacheKey
- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
- `CA-DEFER-07`: request-changes / delegate 액션
- `CA-DEFER-11`: autoCheckResult.findings 풀명세

### 9.2 M1 Phase Beta 합류
- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
- `CA-DEFER-10`: client 검수자
- `CA-DEFER-12`: attachments[] 법무 의견서

### 9.3 M2+ 합류
- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
- `CA-DEFER-09`: MediaThresholdAssessment · analytics-reporting 통합
- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning) — 각 CA-DEFER phase 매핑

## 10. Cascade markers (다른 SoT 문서로 전파)

- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker (subset 명시 + CA-DEFER-13 매핑 표)
- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker (content-gate 큐 + operator·medical·legal 만)
- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05/07/12 해소 marker
- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 해소 marker
- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — 18 단계 (16 + C0014/C0015/C0016)

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |

 succeeded in 807ms:

  docs\core\DATA_MODEL.md:42:| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
  docs\core\DATA_MODEL.md:43:| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
> docs\core\DATA_MODEL.md:44:| [7mC-10[0m | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |[0m
[7m[0m  docs\core\DATA_MODEL.md:45:| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |[0m
[7m[0m  docs\core\DATA_MODEL.md:46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅[0m
[7m[0m | P-011 |[0m
[7m[0m  docs\core\DATA_MODEL.md:47:| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |[0m
[7m[0m  docs\core\DATA_MODEL.md:48:| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |[0m
  docs\core\DATA_MODEL.md:652:| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_ST
ANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |
  docs\core\DATA_MODEL.md:653:
> docs\core\DATA_MODEL.md:654:> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`[7mmediaThreshold[0mMeasure[0m
[7m[0mment`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).[0m
[7m[0m  docs\core\DATA_MODEL.md:655:[0m
[7m[0m  docs\core\DATA_MODEL.md:656:#### `SearchVisibilityConfig` (v0.16 신규)[0m
[7m[0m  docs\core\DATA_MODEL.md:657:[0m
[7m[0m  docs\core\DATA_MODEL.md:658:| 필드 | 타입 | required | 설명 |[0m
  docs\core\DATA_MODEL.md:759:| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |
  docs\core\DATA_MODEL.md:760:
> docs\core\DATA_MODEL.md:761:### [7mC-10[0m. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록[0m
[7m[0m  docs\core\DATA_MODEL.md:762:[0m
[7m[0m  docs\core\DATA_MODEL.md:763:**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)[0m
[7m[0m  docs\core\DATA_MODEL.md:764:[0m
[7m[0m  docs\core\DATA_MODEL.md:765:#### 어드민 DB 원본 (풀데이터)[0m
  docs\core\DATA_MODEL.md:769:| `@id` | `Slug` | ✅ | |
  docs\core\DATA_MODEL.md:770:| `instanceId` | `Slug` | ✅ | |
> docs\core\DATA_MODEL.md:771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPag
e, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory
, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `F
eature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONT
ENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v
0.x 의 학술 인용 · 미디어 출연 E-A-T entity. [7mComplianceRecord[0m 발행 게이트 통과 기록 대상 (Publication/MediaAppearance [0m
[7m[0m는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |[0m
[7m[0m  docs\core\DATA_MODEL.md:772:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-][0m
[7m[0m*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |[0m
[7m[0m  docs\core\DATA_MODEL.md:773:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |[0m
[7m[0m  docs\core\DATA_MODEL.md:774:| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |[0m
[7m[0m  docs\core\DATA_MODEL.md:775:| `articleType` | `string` | optional | (Article인 경우) |[0m
  docs\core\DATA_MODEL.md:776:| `inlineRiskFlags` | `string[]` | optional | |
> docs\core\DATA_MODEL.md:777:| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compli
ance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `[7mllmAssist[0m: { invocations[]: { promptVersion, [0m
[7m[0mmodelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |[0m
[7m[0m  docs\core\DATA_MODEL.md:778:| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |[0m
[7m[0m  docs\core\DATA_MODEL.md:779:| `peerReviewedAt` | `Date` | ✅ | |[0m
[7m[0m  docs\core\DATA_MODEL.md:780:| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |[0m
[7m[0m  docs\core\DATA_MODEL.md:781:| `physicianApprovedAt` | `Date` | optional | |[0m
  docs\core\DATA_MODEL.md:788:| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
  docs\core\DATA_MODEL.md:789:| `attachments` | `Attachment[]` | optional | 증빙 파일 |
> docs\core\DATA_MODEL.md:790:| `[7mstaleFlags[0m` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVEL[0m
[7m[0mS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.m[0m
[7m[0md` § 5.4) |[0m
> docs\core\DATA_MODEL.md:791:| `[7mwarning[0mAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning fi[0m
[7m[0mnding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |[0m
> docs\core\DATA_MODEL.md:792:| `publishedAt` | `Date` | ✅ when `[7mrecordPhase[0m="published"`, optional when `recordPhase="[0m
[7m[0mpre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |[0m
> docs\core\DATA_MODEL.md:793:| `publishedBy` | `string` | ✅ when `[7mrecordPhase[0m="published"`, optional when `recordPhase[0m
[7m[0m="pre-publish"` | (v0.8 +) 위와 동일 |[0m
> docs\core\DATA_MODEL.md:794:| `[7mrecordPhase[0m` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`adm[0m
[7m[0min/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |[0m
> docs\core\DATA_MODEL.md:795:| `[7mrecordVersion[0m` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 [0m
[7m[0m사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |[0m
> docs\core\DATA_MODEL.md:796:| `[7mmediaThreshold[0mAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 [0m
[7m[0m일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (ro[0m
[7m[0mlling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |[0m
> docs\core\DATA_MODEL.md:797:| `[7mmediaThreshold[0mOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `f[0m
[7m[0meatures/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료*[0m
[7m[0m*. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감[0m
[7m[0m사 추적용) |[0m
[7m[0m  docs\core\DATA_MODEL.md:798:[0m
> docs\core\DATA_MODEL.md:799:#### `[7mMediaThreshold[0mAssessment` (v0.14 +)[0m
[7m[0m  docs\core\DATA_MODEL.md:800:[0m
[7m[0m  docs\core\DATA_MODEL.md:801:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:802:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:803:| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |[0m
  docs\core\DATA_MODEL.md:806:| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-re
porting § 8.2 측정값) |
  docs\core\DATA_MODEL.md:807:| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
> docs\core\DATA_MODEL.md:808:| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출
처 — analytics-reporting `config.[7mmediaThreshold[0mMeasurement.primarySource` |[0m
[7m[0m  docs\core\DATA_MODEL.md:809:| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — i[0m
[7m[0mncomplete date 비율 반영 |[0m
[7m[0m  docs\core\DATA_MODEL.md:810:| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |[0m
[7m[0m  docs\core\DATA_MODEL.md:811:| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은[0m
[7m[0m 운영 조기경보, calendar는 법정 산정 |[0m
[7m[0m  docs\core\DATA_MODEL.md:812:| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또[0m
[7m[0m는 외부 도구 자체 필터) |[0m
  docs\core\DATA_MODEL.md:813:| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장
 — `legalCounsel`·`legalCounselAt`과 함께) |
  docs\core\DATA_MODEL.md:814:
> docs\core\DATA_MODEL.md:815:> `[7mmediaThreshold[0mAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 Daily[0m
[7m[0mUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무[0m
[7m[0m 판정 시점에 snapshot으로 고정.[0m
[7m[0m  docs\core\DATA_MODEL.md:816:[0m
> docs\core\DATA_MODEL.md:817:#### `[7mWarning[0mAcknowledgement` (v0.8 +)[0m
[7m[0m  docs\core\DATA_MODEL.md:818:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:819:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:820:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |[0m
[7m[0m  docs\core\DATA_MODEL.md:821:| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |[0m
  docs\core\DATA_MODEL.md:824:| `note` | `string` | optional | 메모 |
  docs\core\DATA_MODEL.md:825:
> docs\core\DATA_MODEL.md:826:#### `[7mStaleFlags[0m`[0m
[7m[0m  docs\core\DATA_MODEL.md:827:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:828:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:829:| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |[0m
[7m[0m  docs\core\DATA_MODEL.md:830:| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스[0m
[7m[0m크 변경 등) |[0m
  docs\core\DATA_MODEL.md:846:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
  docs\core\DATA_MODEL.md:847:
> docs\core\DATA_MODEL.md:848:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트*
*. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 ([7mComplianceRecord[0m.l[0m
[7m[0megalCounsel/legalCounselAt required).[0m
[7m[0m  docs\core\DATA_MODEL.md:849:[0m
[7m[0m  docs\core\DATA_MODEL.md:850:**참조 페이지 타입**: P-013[0m
[7m[0m  docs\core\DATA_MODEL.md:851:**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)[0m
[7m[0m  docs\core\DATA_MODEL.md:852:[0m
  docs\core\DATA_MODEL.md:875:
  docs\core\DATA_MODEL.md:876:**컴플라이언스 룰**:
> docs\core\DATA_MODEL.md:877:- 발행 시 `[7mComplianceRecord[0m(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)`[0m
[7m[0m 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).[0m
[7m[0m  docs\core\DATA_MODEL.md:878:- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증[0m
[7m[0m.[0m
[7m[0m  docs\core\DATA_MODEL.md:879:[0m
[7m[0m  docs\core\DATA_MODEL.md:880:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)[0m
[7m[0m  docs\core\DATA_MODEL.md:881:[0m
  docs\core\DATA_MODEL.md:1119:   └─ pageRiskLevel → RiskLevel
  docs\core\DATA_MODEL.md:1120:
> docs\core\DATA_MODEL.md:1121:[7mComplianceRecord[0m (C-10)[0m
[7m[0m  docs\core\DATA_MODEL.md:1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppear[0m
[7m[0mance 포함)[0m
[7m[0m  docs\core\DATA_MODEL.md:1123:   └─ pageRiskLevel → RiskLevel[0m
[7m[0m  docs\core\DATA_MODEL.md:1124:```[0m
[7m[0m  docs\core\DATA_MODEL.md:1125:[0m
  docs\core\DATA_MODEL.md:1139:| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
  docs\core\DATA_MODEL.md:1140:| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
> docs\core\DATA_MODEL.md:1141:| DM-04 | `[7mComplianceRecord[0m` 첨부 저장소 | A-02 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1142:| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |[0m
[7m[0m  docs\core\DATA_MODEL.md:1143:| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1144:| DM-07 | cross-reference 빌드 검증 | |[0m
[7m[0m  docs\core\DATA_MODEL.md:1145:| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |[0m
  docs\core\DATA_MODEL.md:1166:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAC
onfig 신설, AccumulatedStats 흡수 |
  docs\core\DATA_MODEL.md:1167:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 
전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile
만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponen
ts·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Articl
e 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLeve
l 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) 
DM-18·DM-19 신규 |
> docs\core\DATA_MODEL.md:1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-
03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이
었음, (2) **[7mC-10[0m ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) [0m
[7m[0m**관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배[0m
[7m[0m열 |[0m
> docs\core\DATA_MODEL.md:1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAG
E_TYPES/admin과 정합, (2) **[7mC-10[0m ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=Leg[0m
[7m[0malDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용[0m
[7m[0m 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@[0m
[7m[0mid 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1170:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀[0m
[7m[0m명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 [0m
[7m[0m시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |[0m
> docs\core\DATA_MODEL.md:1171:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → [7mC-10[0m 다음(C-21 앞)으[0m
[7m[0m로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |[0m
> docs\core\DATA_MODEL.md:1172:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭
제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 
섹션 안에서 [7mC-10[0m 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1173:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` e[0m
[7m[0mnum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og[0m
[7m[0m:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1174:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확[0m
[7m[0m장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`ex[0m
[7m[0mperimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`Performanc[0m
[7m[0meBudget` 신설 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1175:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApproved[0m
[7m[0mBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `ima[0m
[7m[0mgeWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 [0m
[7m[0mbudget 항목 정합) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1176:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyn[0m
[7m[0mcConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리),[0m
[7m[0m (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |[0m
  docs\core\DATA_MODEL.md:1183:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-
08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴
 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
  docs\core\DATA_MODEL.md:1184:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-0
8 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + lega
lApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일
) |
> docs\core\DATA_MODEL.md:1185:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C
-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **[7mC-10[0m `media[0m
[7m[0mThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThreshol[0m
[7m[0mdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |[0m
> docs\core\DATA_MODEL.md:1186:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C
-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 
옵션은 `features.analytics-reporting.config`로 분리), (2) **[7mC-10[0m `mediaThresholdAssessment` 슬롯** — `MediaThresholdAss[0m
[7m[0messment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceComplet[0m
[7m[0meness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 [0m
[7m[0m시 snapshot으로 고정 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1187:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1[0m
[7m[0m) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성[0m
[7m[0m 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit[0m
[7m[0m / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `A[0m
[7m[0mdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`el[0m
[7m[0migibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·dig[0m
[7m[0mestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IAN[0m
[7m[0mATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |[0m


 succeeded in 762ms:

  docs\compliance\RISK_LEVELS.md:1:# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준
  docs\compliance\RISK_LEVELS.md:2:
> docs\compliance\RISK_LEVELS.md:3:> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 [7mR[0m
[7miskInference[0mResult.steps 표준화)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:4:> **작성일**: 2026-05-14[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:5:> **소유자**: Glitzy[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9[0m
> docs\compliance\RISK_LEVELS.md:7:> **목적**: RiskLevel([7mLow[0m/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치[0m
[7m[0m·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매[0m
[7m[0m트릭스를 단독 구현 가능한 명세로 정의.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:8:> **외부 공유 시 주의**: 상위 문서와 동일.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:9:> **연관 문서**:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:10:> - 콘텐츠 표현 룰 SoT → `core/CONTENT_STANDARDS.md` (§ 4·§ 7)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:11:> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)[0m
  docs\compliance\RISK_LEVELS.md:18:## 0. 한 페이지 요약
  docs\compliance\RISK_LEVELS.md:19:
> docs\compliance\RISK_LEVELS.md:20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) [7mRiskRule[0m 데이터 파[0m
[7m[0m일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙[0m
> docs\compliance\RISK_LEVELS.md:21:- **RiskLevel 3종**: `[7mLow[0m` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
> docs\compliance\RISK_LEVELS.md:22:- **자동 추론 = [7mMAX[0m 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlin[0m
[7m[0meRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정[0m
> docs\compliance\RISK_LEVELS.md:23:- **[7mRiskRule[0m 데이터 파일**: `data/compliance-rules/` 디렉토리, YAML 포맷, JSON Sche[0m
[7m[0mma 검증, 의료법 개정 시 MAJOR 버전[0m
> docs\compliance\RISK_LEVELS.md:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer 
required) + (b) 등급 기본 요구([7mMedium[0m/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충[0m
[7m[0m족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:25:- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-eve[0m
[7m[0mnt`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:26:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:27:---[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:28:[0m
  docs\compliance\RISK_LEVELS.md:36:| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마
이그레이션 가이드 필수 |
  docs\compliance\RISK_LEVELS.md:37:| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
> docs\compliance\RISK_LEVELS.md:38:| [7mRiskRule[0m 추가 (warning/content-gate) | MINOR | |[0m
> docs\compliance\RISK_LEVELS.md:39:| [7mRiskRule[0m 추가 (fail) | **MAJOR** | 빌드 차단 가능 |
> docs\compliance\RISK_LEVELS.md:40:| [7mRiskRule[0m 패턴 정정 (false-positive 감소) | PATCH | |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:41:| 의료법 개정 대응 룰 갱신 | **MAJOR** | 본 문서 § 7.1 의료법 개정 추적 표 동시 갱[0m
[7m[0m신 |[0m
> docs\compliance\RISK_LEVELS.md:42:| [7mApproverRole[0m 통과 기준 변경 | **MAJOR** | 운영 정책 영향 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:43:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:44:### 1.2 SoT 원칙[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:45:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:46:- 본 문서는 **운영·구현 SoT** — `compliance-assistant` Feature Module과 어드민 검수[0m
[7m[0m 워크플로가 본 문서를 입력으로 받음[0m
> docs\compliance\RISK_LEVELS.md:47:- 의료광고 **표현 룰의 카탈로그 SoT**는 `core/CONTENT_STANDARDS.md` § 4 — 본 문서는
 카탈로그를 [7mRiskRule[0m 데이터 파일로 변환·운영하는 책임만[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:48:- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_[0m
[7m[0mAD_COMPLIANCE_COMMON.md` 후속[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:49:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:50:---[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:51:[0m
  docs\compliance\RISK_LEVELS.md:54:### 2.1 RiskLevel enum
  docs\compliance\RISK_LEVELS.md:55:
> docs\compliance\RISK_LEVELS.md:56:`[7mLow[0m | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사[0m
[7m[0m상을 사용:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:57:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:58:```ts[0m
> docs\compliance\RISK_LEVELS.md:59:const RISK_ORDER = { [7mLow[0m: 0, Medium: 1, High: 2 } as const;
> docs\compliance\RISK_LEVELS.md:60:// [7mmax[0m(level1, level2) — 등급 결합 시 더 높은 등급 채택[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:61:```[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:62:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:63:### 2.2 자동 추론 입력[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:64:[0m
  docs\compliance\RISK_LEVELS.md:65:```ts
> docs\compliance\RISK_LEVELS.md:66:type [7mRiskInference[0mInput = {[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:67:  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:68:  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:69:  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:70:  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과[0m
  docs\compliance\RISK_LEVELS.md:83:```
  docs\compliance\RISK_LEVELS.md:84:1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
> docs\compliance\RISK_LEVELS.md:85:2. if articleType: base = [7mmax[0m(base, CONTENT_STANDARDS § 6 articleType 기본 등급)[0m
> docs\compliance\RISK_LEVELS.md:86:3. for each inlineRiskFlag in inlineRiskFlags: base = [7mmax[0m(base, FLAG_LEVEL[flag])
> docs\compliance\RISK_LEVELS.md:87:4. for each slotMatch: base = [7mmax[0m(base, slotMatch.triggeredLevel)
> docs\compliance\RISK_LEVELS.md:88:5. if explicitRiskLevel: final = [7mmax[0m(base, explicitRiskLevel)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:89:6. else: final = base[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:90:7. return final[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:91:```[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:92:[0m
> docs\compliance\RISK_LEVELS.md:93:`explicitRiskLevel`은 격하 불가 — 항상 [7mMAX[0m 결합. ComplianceRecord 운영자가 명시 격[0m
[7m[0m상만 가능.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:94:[0m
> docs\compliance\RISK_LEVELS.md:95:#### 2.3.1 [7mRiskInference[0mResult — steps[] 추적[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:96:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:97:```ts[0m
> docs\compliance\RISK_LEVELS.md:98:type [7mRiskInference[0mResult = {
> docs\compliance\RISK_LEVELS.md:99:  inferredRiskLevel: RiskLevel;     // [7mMAX[0m 결합 결과 (단계 7 final)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:100:  steps: Array<{                     // 등급 산정 출처 추적 (audit·triggeredBy 판[0m
[7m[0m정용)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:101:    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explici[0m
[7m[0mtRiskLevel";[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:102:    sourceValue: string;             // 예: "P-006", "review-case", "includes-pric[0m
[7m[0ming", "P-006-content-results"[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:103:    level: RiskLevel;                // 본 source가 기여한 등급[0m
  docs\compliance\RISK_LEVELS.md:107:
  docs\compliance\RISK_LEVELS.md:108:- 각 단계 1~5에서 base가 갱신될 때마다 steps[]에 항목 추가
> docs\compliance\RISK_LEVELS.md:109:- triggeredBy 판정에 사용 (admin/REVIEW_WORKF[7mLOW[0m·features/compliance-assistant § 4[0m
[7m[0m.1 7단계)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:110:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:111:### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:112:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:113:| InlineRiskFlag | 격상 등급 | 의미 |[0m
  docs\compliance\RISK_LEVELS.md:114:|---|---|---|
> docs\compliance\RISK_LEVELS.md:115:| `includes-effect-claim` | **[7mHigh[0m** | 본문에 § 4.1 fail/content-gate 효과 단정 표[0m
[7m[0m현 검출 |[0m
> docs\compliance\RISK_LEVELS.md:116:| `includes-pricing` | **[7mHigh[0m** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의[0m
[7m[0m료광고법 비급여 명시 의무 |[0m
> docs\compliance\RISK_LEVELS.md:117:| `includes-event` | **[7mHigh[0m** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
> docs\compliance\RISK_LEVELS.md:118:| `includes-before-after` | **[7mHigh[0m** | 본문에 전후사진 또는 "전후"·"비포어 애프터"[0m
[7m[0m 어휘 검출 |[0m
> docs\compliance\RISK_LEVELS.md:119:| `includes-testimonial` | **[7mHigh[0m** | 본문에 환자 후기 인용·치료경험담 검출 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:120:[0m
> docs\compliance\RISK_LEVELS.md:121:> 단일 flag 발생만으로 [7mHigh[0m 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라[0m
[7m[0m도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:122:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:123:### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:124:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:125:| 페이지 | 기본 등급 |[0m
  docs\compliance\RISK_LEVELS.md:126:|---|---|
> docs\compliance\RISK_LEVELS.md:127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatme
nts List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Rese
rvation | [7mLow[0m |[0m
> docs\compliance\RISK_LEVELS.md:128:| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-tes
t | [7mMedium[0m |[0m
> docs\compliance\RISK_LEVELS.md:129:| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — [7mLow[0m~High) |
> docs\compliance\RISK_LEVELS.md:130:| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | [7mHigh[0m |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:131:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:132:> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:133:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:134:---[0m
  docs\compliance\RISK_LEVELS.md:135:
> docs\compliance\RISK_LEVELS.md:136:## 3. [7mRiskRule[0m 데이터 파일[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:137:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:138:### 3.1 위치·디렉토리 구조[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:139:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:140:```[0m
  docs\compliance\RISK_LEVELS.md:196:### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`
  docs\compliance\RISK_LEVELS.md:197:
> docs\compliance\RISK_LEVELS.md:198:빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 [7mRiskRule[0m(SimpleRiskRule + Composit[0m
[7m[0meRiskRule) 전체 스키마를 검증할 수 있어야 한다.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:199:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:200:**기본 식별·메타**[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:201:| 검증 항목 | 룰 레벨 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:202:|---|---|[0m
  docs\compliance\RISK_LEVELS.md:234:| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
  docs\compliance\RISK_LEVELS.md:235:| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articl
eType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
> docs\compliance\RISK_LEVELS.md:236:| `severity="content-gate"` + `[7mrequiredApproverRoles[0m[]` 누락 | **fail** |[0m
> docs\compliance\RISK_LEVELS.md:237:| `[7mrequiredApproverRoles[0m[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·[0m
[7m[0m`client`) 외 | **fail** |[0m
> docs\compliance\RISK_LEVELS.md:238:| `severity` ∈ {`info`·`warning`·`fail`} + `[7mrequiredApproverRoles[0m[]` 명시 | warnin[0m
[7m[0mg (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:239:| `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrativ[0m
[7m[0me`) | **fail** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:240:| `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:241:| `suggestion` 1,000자 초과 | warning |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:242:| `exceptions[]` 항목 빈 문자열 | **fail** |[0m
  docs\compliance\RISK_LEVELS.md:255:| `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
  docs\compliance\RISK_LEVELS.md:256:| `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **f
ail** |
> docs\compliance\RISK_LEVELS.md:257:| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 [7mRiskRule[0m.id 미존재 | **fail[0m
[7m[0m** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:258:| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증[0m
[7m[0m 동일 적용) | **fail** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:259:| `exceptions[].version` SemVer 형식 위반 | **fail** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:260:| `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:261:| `exceptions[].rationale` 누락 또는 빈 문자열 | warning (감사·추적 약화) |[0m
  docs\compliance\RISK_LEVELS.md:279:| `medical-law-tracking.yaml.revisions[].sourceUrl` URL 형식 위반 | **fail** |
  docs\compliance\RISK_LEVELS.md:280:
> docs\compliance\RISK_LEVELS.md:281:#### 3.3.1 severity별 `[7mrequiredApproverRoles[0m` 처리 정책[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:282:[0m
> docs\compliance\RISK_LEVELS.md:283:| severity | [7mrequiredApproverRoles[0m 처리 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:284:|---|---|[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:285:| `fail` | 무시 (빌드 차단이므로 검수자 불필요). 명시 시 schema warning |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:286:| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:287:| `content-gate` | **필수 명시** (§ 4.5 multi-role AND 조건) |[0m
  docs\compliance\RISK_LEVELS.md:299:- 동일 `id` 중복 시 빌드 fail
  docs\compliance\RISK_LEVELS.md:300:- preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 
가능
> docs\compliance\RISK_LEVELS.md:301:- 로드 결과는 단일 `[7mRiskRule[0m[]` 컬렉션 + `ContextException[]` 컬렉션[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:302:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:303:#### 3.4.1 `meta.yaml` 구조[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:304:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:305:```yaml[0m
  docs\compliance\RISK_LEVELS.md:353:   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
  docs\compliance\RISK_LEVELS.md:354:   - 객체 필드(`metadata`) — deep merge (재귀적 key별 교체)
> docs\compliance\RISK_LEVELS.md:355:   - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`[7mrequiredApproverRol[0m
[7mes[0m[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:356:3. `patch`에 명시되지 않은 필드는 원본 값 유지[0m
> docs\compliance\RISK_LEVELS.md:357:4. 결과는 새 [7mRiskRule[0m으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉[0m
[7m[0m션에 존재[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:358:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:359:**제약**:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:360:- override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본[0m
[7m[0m 비활성화 (별도 deprecation)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:361:- 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견[0m
[7m[0m 시 빌드 **fail** (last-wins 정책 없음)[0m
  docs\compliance\RISK_LEVELS.md:376:    patternType: "regex"
  docs\compliance\RISK_LEVELS.md:377:    appliesTo:                              # 본 예외가 적용되는 대상
> docs\compliance\RISK_LEVELS.md:378:      categories: ["전문성 단정 (단독 어휘)"]   # [7mRiskRule[0m.category 매칭 (1개 이상[0m
[7m[0m)[0m
> docs\compliance\RISK_LEVELS.md:379:      ruleIds: []                            # 또는 특정 [7mRiskRule[0m.id 명시 (1개 이[0m
[7m[0m상). 둘 중 1개 이상 필수[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:380:      scopes:                                # 본 예외가 적용될 scope (선택 — 미지[0m
[7m[0m정 시 전체)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:381:        - { type: "global" }[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:382:    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:383:    version: "1.0.0"[0m
  docs\compliance\RISK_LEVELS.md:397:---
  docs\compliance\RISK_LEVELS.md:398:
> docs\compliance\RISK_LEVELS.md:399:## 4. [7mApproverRole[0m 통과 기준 — content-gate 발행 조건 (CS-02 해소)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:400:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:401:`CONTENT_STANDARDS § 7.1.3`의 4역할 통과 기준 SoT.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:402:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:403:### 4.1 medical (의료진 검수)[0m
  docs\compliance\RISK_LEVELS.md:413:
  docs\compliance\RISK_LEVELS.md:414:**만료** — `staleFlags.medical=true`로 표기. 다음 이벤트에서 자동 설정:
> docs\compliance\RISK_LEVELS.md:415:- 콘텐츠 본문이 [7mRiskRule[0m 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장[0m
[7m[0m 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경[0m
> docs\compliance\RISK_LEVELS.md:416:- TreatmentPage의 `treatmentComponents[]`·`visitF[7mlow[0m[]`·`evidenceNotes[]` 변경 (의[0m
[7m[0m학 정보 영역)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:417:- 의료진 자격·인증 변경 (DoctorProfile 검수자 자격 변동)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:418:- 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:419:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:420:### 4.2 legal (법무 자문·승인)[0m
  docs\compliance\RISK_LEVELS.md:474:
  docs\compliance\RISK_LEVELS.md:475:**전 콘텐츠 공통 필수**:
> docs\compliance\RISK_LEVELS.md:476:- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 
발행 시 항상 기록 필요. `[7mrequiredApproverRoles[0m[]`에 명시되지 않아도 기본 요구[0m
> docs\compliance\RISK_LEVELS.md:477:- `physicianApprover` — DATA_MODEL C-10에서 [7mMedium[0m/High required. 자동 추론 등급이[0m
[7m[0m Medium/High이면 기본 요구[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:478:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:479:**content-gate 추가 요구**:[0m
> docs\compliance\RISK_LEVELS.md:480:- `[7mrequiredApproverRoles[0m[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "leg[0m
[7m[0mal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:481:- 모든 충족은 AND 조건 — 1개라도 누락 시 발행 차단[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:482:[0m
> docs\compliance\RISK_LEVELS.md:483:| ContentScope | 기본 [7mrequiredApproverRoles[0m |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:484:|---|---|[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:485:| `review-case` ArticleType | `["medical", "legal"]` |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:486:| `event-price` ArticleType | `["legal"]` |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:487:| `effect-result-related` ArticleType | `["medical"]` |[0m
  docs\compliance\RISK_LEVELS.md:488:| 전후사진 노출 콘텐츠 | `["medical", "legal"]` |
  docs\compliance\RISK_LEVELS.md:489:| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필
수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
> docs\compliance\RISK_LEVELS.md:490:| 기타 [7mHigh[0m 등급 (자동 추론) | `["medical"]` |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:491:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:492:---[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:493:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:494:## 5. inlineRiskFlags 자동 추출 — DM-05 영역[0m
  docs\compliance\RISK_LEVELS.md:501:- compliance-assistant 빌드 시 양쪽 모두 갱신 — Article은 두 위치, 비 Article은 Co
mplianceRecord만
  docs\compliance\RISK_LEVELS.md:502:
> docs\compliance\RISK_LEVELS.md:503:### 5.1 추출 알고리즘 ([7mRiskRule[0m category 기반)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:504:[0m
> docs\compliance\RISK_LEVELS.md:505:각 flag는 [7mRiskRule[0m 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semanti[0m
[7m[0mc risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:506:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:507:| Flag | 추출 룰 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:508:|---|---|[0m
> docs\compliance\RISK_LEVELS.md:509:| `includes-effect-claim` | [7mRiskRule[0m 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"[0m
[7m[0m전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수[0m
[7m[0m치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:510:| `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원[0m
[7m[0m|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:511:| `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한[0m
[7m[0m정`·`선착순`·`특가`·`프로모`) |[0m
> docs\compliance\RISK_LEVELS.md:512:| `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/
?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAl[7mlow[0med=true` + 후기 콘텐츠에 미디어 첨부 |[0m
> docs\compliance\RISK_LEVELS.md:513:| `includes-testimonial` | [7mRiskRule[0m composite 매칭 — (1인칭/인용 패턴: `저는`·`환[0m
[7m[0m자분이`·`내원자 후기`·`치료받은`·`받은 후`·`상담받은`·`체험기`) + AND_IN_PARAGRAPH (효과 어휘: `효과`·`결과`·`변화`·`호[0m
[7m[0m전`·`개선`) |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:514:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:515:### 5.1.1 카테고리 SoT[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:516:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:517:위 표의 모든 `category` 값은 `core/CONTENT_STANDARDS.md` § 4.1 표의 카테고리 칸과 [0m
[7m[0m일치해야 한다. 신규 카테고리 추가 시 본 § 5.1 매트릭스 동시 cascade.[0m
  docs\compliance\RISK_LEVELS.md:556:## 6. 위험도 자동 동작 매트릭스
  docs\compliance\RISK_LEVELS.md:557:
> docs\compliance\RISK_LEVELS.md:558:`[7mRiskInference[0mInput` 결과에 따라 자동 트리거되는 동작.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:559:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:560:| 최종 등급 | 자동 동작 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:561:|---|---|[0m
> docs\compliance\RISK_LEVELS.md:562:| [7mLow[0m | (특별 동작 없음) |
> docs\compliance\RISK_LEVELS.md:563:| [7mMedium[0m | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록[0m
[7m[0m. fail/content-gate 매칭은 룰 단위로 독립 처리 |[0m
> docs\compliance\RISK_LEVELS.md:564:| [7mHigh[0m | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 [0m
[7m[0m진입 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:565:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:566:- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록[0m
> docs\compliance\RISK_LEVELS.md:567:- [7mHigh[0m 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:568:[0m
> docs\compliance\RISK_LEVELS.md:569:### 6.1 [7mHigh[0m 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:570:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:571:**트리거 범위** (본 문서가 운영 SoT — CONTENT_STANDARDS § 7.1.2보다 넓음):[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:572:[0m
> docs\compliance\RISK_LEVELS.md:573:본 문서 § 2.3의 [7mRiskInference[0mInput에서 자동 추론된 최종 등급이 High이면 compliance[0m
[7m[0m-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:574:- `pageTypeId` 기본 등급 (P-101·P-102·P-104 event 등)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:575:- `articleType` 기본 등급 (effect-result-related·review-case·event-price)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:576:- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:577:- `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)[0m
  docs\compliance\RISK_LEVELS.md:578:- `explicitRiskLevel` override (어드민 명시 입력)
  docs\compliance\RISK_LEVELS.md:579:
> docs\compliance\RISK_LEVELS.md:580:**흐름**: [7mRiskInference[0m(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.in[0m
[7m[0mferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. co[0m
[7m[0mmpliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타[0m
[7m[0m에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:581:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:582:자동 주입 finding:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:583:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:584:```ts[0m
  docs\compliance\RISK_LEVELS.md:585:{
> docs\compliance\RISK_LEVELS.md:586:  ruleId: "risk-level-[7mhigh[0m-gate",[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:587:  category: "위험도 강제 검수",[0m
> docs\compliance\RISK_LEVELS.md:588:  pattern: "(RiskLevel=[7mHigh[0m)",[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:589:  severity: "content-gate",[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:590:  location: { start: 0, end: 0 },              // 콘텐츠 전체 — 메타 의미[0m
> docs\compliance\RISK_LEVELS.md:591:  [7mrequiredApproverRoles[0m: ["medical"]            // 기본값. ArticleType별 override [0m
[7m[0m(§ 6.2)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:592:}[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:593:```[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:594:[0m
> docs\compliance\RISK_LEVELS.md:595:### 6.2 ArticleType별 [7mHigh[0m 가상 finding requiredApproverRoles override[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:596:[0m
> docs\compliance\RISK_LEVELS.md:597:본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우([7mHigh[0m 등급)**의 `requiredApprover[0m
[7m[0mRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 [0m
[7m[0m않음.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:598:[0m
> docs\compliance\RISK_LEVELS.md:599:| ArticleType (모두 [7mHigh[0m 등급 — 가상 finding 주입) | 가상 finding `requiredApprove[0m
[7m[0mrRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:600:|---|---|---|[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:601:| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중[0m
[7m[0m복은 합집합으로 제거) |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:602:| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |[0m
> docs\compliance\RISK_LEVELS.md:603:| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 [7mHigh[0m
[7m[0m 등급 기본 요구) |[0m
> docs\compliance\RISK_LEVELS.md:604:| 기타 [7mHigh[0m explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:605:[0m
> docs\compliance\RISK_LEVELS.md:606:> [7mMedium[0m 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-[0m
[7m[0mexplainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 [0m
[7m[0m요구는 자동 적용[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:607:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:608:- 본 표는 `CONTENT_STANDARDS § 7.1.2`와 동일 SoT — 둘 중 하나 변경 시 다른 하나도 [0m
[7m[0mcascade. 본 문서가 운영 SoT.[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:609:- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크[0m
[7m[0m플로는 합집합의 모든 역할에 대해 ComplianceRecord 슬롯 기록 완료 시에만 발행 허용[0m
> docs\compliance\RISK_LEVELS.md:610:- **등급 격하 일괄 금지** — `explicitRiskLevel`은 [7mMAX[0m 결합으로만 동작 (격상만 허용[0m
[7m[0m). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:611:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:612:---[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:613:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:614:## 7. 운영 거버넌스[0m
  docs\compliance\RISK_LEVELS.md:638:    checkedAt: "2026-05-14T00:00:00Z"
  docs\compliance\RISK_LEVELS.md:639:    checkedBy: "operator:seokcess@glitzy.kr"
> docs\compliance\RISK_LEVELS.md:640:    affectedRuleIds:                                # 본 개정으로 영향받은 [7mRiskRul[0m
[7me[0m ID[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:641:      - "supremacy-001"[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:642:      - "guarantee-composite-001"[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:643:    staleScope:                                     # stale 처리 범위[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:644:      kind: "all"                                   # all | rule-matched | content[0m
[7m[0m-type[0m
  docs\compliance\RISK_LEVELS.md:666:- false-negative 발견 시 룰 추가 — MAJOR(fail 룰) 또는 MINOR(warning/content-gate)
  docs\compliance\RISK_LEVELS.md:667:
> docs\compliance\RISK_LEVELS.md:668:### 7.3 [7mRiskRule[0m 변경 워크플로[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:669:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:670:```[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:671:1. 변경 제안 (PR) — 변경 사유·근거 의료법 조문·테스트 케이스 첨부[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:672:2. 자체 룰 checker 회귀 테스트 — 기존 콘텐츠 위반 가능 케이스 검출[0m
  docs\compliance\RISK_LEVELS.md:681:| 레벨 | 본 문서 영역 적용 |
  docs\compliance\RISK_LEVELS.md:682:|---|---|
> docs\compliance\RISK_LEVELS.md:683:| **fail** | [7mRiskRule[0m 파일 JSON Schema 검증 실패, RiskLevel enum 위반, ApproverRol[0m
[7m[0me 매핑 누락 |[0m
> docs\compliance\RISK_LEVELS.md:684:| **warning** | `sourceDoc` 경로 위반, [7mRiskRule[0m 만료 임박 (의료법 개정 6개월 이상 [0m
[7m[0m미반영 등) |[0m
> docs\compliance\RISK_LEVELS.md:685:| **content-gate** | (본 문서는 메타 정의 영역이라 content-gate 직접 적용 없음. 실
제 본문 검수 룰은 [7mRiskRule[0m이 발산) |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:686:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:687:---[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:688:[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:689:## 9. 미결정 사항[0m
  docs\compliance\RISK_LEVELS.md:710:| 일자 | 버전 | 변경 |
  docs\compliance\RISK_LEVELS.md:711:|---|---|---|
> docs\compliance\RISK_LEVELS.md:712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론([7mMAX[0m 결합), RiskRule 데이터 [0m
[7m[0m파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inline[0m
[7m[0mRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰[0m
[7m[0m 레벨 |[0m
> docs\compliance\RISK_LEVELS.md:713:| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 [7mRiskInfer[0m
[7mence[0mResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |[0m
> docs\compliance\RISK_LEVELS.md:714:| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSO
N Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 
활성화 후). canonical [7mRiskRule[0m + 복수 법령 조문 인용 패턴 지원 |[0m
> docs\compliance\RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**
: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 overrid
e만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === [7mHigh[0m` ∨ `explicitRiskLevel === High` 명시[0m
[7m[0m + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Mediu[0m
[7m[0mm ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 Loca[0m
[7m[0mtionProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필[0m
[7m[0m드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.[0m
[7m[0myaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |[0m
> docs\compliance\RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CON
TENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 [7mH[0m
[7migh[0m 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckI[0m
[7m[0mnput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exc[0m
[7m[0meptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검[0m
[7m[0m증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder [0m
[7m[0m확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 Lega[0m
[7m[0mlDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |[0m
> docs\compliance\RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1
.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cook
ie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력
 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 [7mHigh[0m 가상 finding 전용으로 분리 — Medium ArticleType 제거[0m
[7m[0m, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § [0m
[7m[0m4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5[0m
[7m[0m) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law[0m
[7m[0m-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결[0m
[7m[0m정 명시 |[0m
[7m[0m  docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.[0m
[7m[0m2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND[0m
[7m[0m 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구[0m
[7m[0m = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `f[0m
[7m[0mieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표[0m
[7m[0m현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRi[0m
[7m[0mskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 [0m
[7m[0m페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토[0m
[7m[0m리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |[0m
> docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.
5 P-105 Reservation 기본 등급 PAGE_TYPES SoT [7mLow[0m로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-0[0m
[7m[0m4 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 [0m
[7m[0m추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator [0m
[7m[0m전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모[0m
[7m[0m두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 Ri[0m
[7m[0mskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Co[0m
[7m[0mmposite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 over[0m
[7m[0mrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — co[0m
[7m[0mntent-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed[0m
[7m[0m` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·a[0m
[7m[0mffectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.[0m
[7m[0m1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (1[0m
[7m[0m4) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |[0m


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"CA-DEFER|check\\(|evaluatePublishable|TRANSITIONS|review_queue_type|review_queue_status|required_roles|compliance_content_type|C0016|published_requires_record|status enum|9-state|EC-DEFER-05|LL-DEFER-01|Audit|audit|manualReview|catalogVersion|pageRiskLevel|priorReviewRequired|client_approver|attachments|staleFlags|warning|mediaThreshold\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ComplianceCheckInput|ComplianceCheckResult|cacheKey|ruleHash|effectivePolicy|manualReview|catalogVersion|catalogHash|requiredApproverRoles|pageRiskLevel|automatedDecision|buildBlocked|findingsBySeverity" docs/core/CONTENT_STANDARDS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin_user|physician_reviewer|legal_reviewer|approverRoleEligibility|legalReviewer|physician|instance_membership|reviewer" packages/core-content/src/schema.ts apps/web/src/lib/action-context.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 713ms:
365:type ComplianceCheckInput = {
441:  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
447:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
461:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
471:- 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)
476:type ComplianceCheckResult = {
478:  automatedDecision: "block" | "gate" | "warn" | "pass";
480:  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
484:  findingsBySeverity: {
491:  requiredApproverRoles?: ApproverRole[];
496:// automatedDecision 결정 규칙
503://   1) automatedDecision !== "block"
516:  requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
527:| 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
543:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
567:  requiredApproverRoles?: ApproverRole[];
615:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
672:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

2026-05-18T08:30:12.508905Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 707ms:
 succeeded in 723ms:
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 marker (M0 컬럼 subset) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 marker (큐 1종·역할 2종 활성화) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN EC-DEFER-05/07/12 해소 marker · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 해소 marker · (6) CA-CASCADE-05 manifest 18단계 (16 + C0014/C0015). 실 SQL 코드 cascade 는 별 cycle.
9:- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
14:- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05/07/12 해소 대상
15:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 (LegalDocument 발행) 해소 대상
25:- **EC-DEFER-05·07·12 해소**: 4 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish + published 발행 unlock.
26:- **LL-DEFER-01 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화.
28:- **자동 검수(룰) 미합류 marker**: check() stub — 항상 `manualReview` 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass·pageRiskLevel from input). 실 ruleCatalog/composite/LLM은 별 plan.
34:| C-08 `ComplianceRecord` skeleton DB table | DATA_MODEL C-10 풀명세 subset — 핵심 슬롯 + recordPhase + recordVersion. mediaThresholdAssessment · attachments · staleFlags · warningAcknowledgements · llmAssist · priorReview SubmissionId 등 EC-DEFER-13 phase (M1) |
35:| C-XX `ReviewQueueEntry` skeleton DB table | REVIEW_WORKFLOW § 3 SoT — queue_type enum (M0 v0.1: `content-gate` 만 활성. `warning`/`stale` enum 값 합류는 다음 cycle) · status enum (open/in-progress/resolved) · priority (P0/P1/P2) · assigned_to · sla_due_at |
36:| 6 entity status 전이 활성화 | Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance — DB CHECK skeleton-limit/v01-limit 해제. content_publication_status enum 9-state 활성화 |
40:| AND 게이트 평가 함수 | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅). priorReviewRequired는 M0 v0.1 false fixed |
41:| check() stub | manualReview only · ruleCatalog 미합류 marker · findings=[] · gateRequired=false · automatedDecision=pass · pageRiskLevel = input.explicit ?? input.inferred ?? "Low" |
42:| 4 form status select 9-state | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm — status enum subset 해제 |
46:| audit_event 통합 | content-submitted-for-review · content-approved · content-rejected · content-published — 모두 emitAuditEvent |
53:| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
54:| RiskInference 자동 추론 (inlineRiskFlags 매칭 · explicit MAX 결합 · pageType·articleType·slot) | CA-DEFER-01 동반 | CA-DEFER-02 |
55:| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
56:| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
57:| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
58:| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
59:| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
60:| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
61:| MediaThresholdAssessment · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
62:| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
63:| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
64:| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
65:| ComplianceRecord 부분 영역 (mediaThreshold · attachments · staleFlags · warning) 풀 컬럼 | 각 CA-DEFER 매핑 phase | CA-DEFER-13 |
79:CREATE TYPE compliance_content_type AS ENUM (
88:  content_type compliance_content_type NOT NULL,
93:  auto_check_result JSONB NOT NULL,                        -- compliance-assistant 결과 (M0 stub: findings=[]·gateRequired=false·automatedDecision='pass'·hasWarnings=false·manualReview=true)
101:  -- client 슬롯 — M0 미사용 (CA-DEFER-10 marker · 컬럼은 추가)
102:  client_approver UUID,
105:  prior_review_submission_id TEXT,                          -- CA-DEFER-08
106:  prior_review_passed BOOLEAN,                              -- CA-DEFER-08
152:- (CA-SCHEMA-01) M0 v0.1 풀명세 컬럼 subset — 핵심 슬롯 + recordPhase + recordVersion. mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReview 풀 영역 모두 CA-DEFER-13 (각 phase 매핑).
153:- (CA-SCHEMA-02) `compliance_content_type` enum 등록 — M0 active 10종 (FAQ/Publication/Media/ArticleCategory 포함 EAT_CONTENT v1.0 정합). DATA_MODEL C-10 17종 중 7종 (MedicalConditionPage·ReviewPolicy·PricingPage·FacilitiesPage·NewsItem·ReservationPage·Feature) 은 CA-DEFER-13.
161:CREATE TYPE review_queue_type AS ENUM ('content-gate');  -- M0 v0.1 1종 만. warning/stale 은 enum ADD VALUE cascade (CA-DEFER-05·06)
162:CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved', 'cancelled');
168:  queue_type review_queue_type NOT NULL,
169:  content_type compliance_content_type NOT NULL,
172:  status review_queue_status NOT NULL DEFAULT 'open',
174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
190:  CONSTRAINT review_queue_entry_required_roles_array CHECK (jsonb_typeof(required_roles) = 'array' AND jsonb_array_length(required_roles) >= 1),
215:- (CA-SCHEMA-04) `review_queue_type` enum M0 v0.1 = `content-gate` 만 (warning/stale 은 CA-DEFER-05·06).
216:- (CA-SCHEMA-05) `required_roles` JSONB array — finalRoles 매핑. 룰 추가 역할은 CA-DEFER-01.
222:-- packages/core-content/migrations/C0016_status_unlock.sql
233:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (
240:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (
252:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (
258:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (
267:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (
274:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (
290:export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
294:  pageRiskLevel: RiskLevel,
295:  priorReviewRequired: boolean = false,
299:  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
301:  if (priorReviewRequired) roles.add("legal");  // M0 v0.1 false fixed → effective no-op
328:export function evaluatePublishable(
355:## 4. check() stub 결정
365: * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
368: * - manualReview only: findings=[] · gateRequired=false · automatedDecision='pass' · hasWarnings=false
369: * - pageRiskLevel = input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? 'Low'
370: * - ruleCatalog 미합류 — CA-DEFER-01·02 marker
371: * - LLM 미합류 — CA-DEFER-03 marker
372: * - 캐시 미합류 — CA-DEFER-04 marker
376:export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult> {
377:  const pageRiskLevel =
382:    pageRiskLevel,
387:    manualReview: true,  // CA-CHECK-01: M0 stub marker — 호출자가 manualReview 표시 인지
389:    catalogVersion: "m0-stub-v0.1",
397:- `submitForReview` server action 안 check() 호출 → ComplianceRecord(pre-publish) 의 auto_check_result 필드에 결과 저장.
412:- 콘텐츠 유형 · 콘텐츠 ref · pageRiskLevel · finalRoles · status · priority · SLA 마감 · assigned
422:- ArticleForm · TreatmentPageForm · LegalDocumentForm · FaqForm · PublicationForm · MediaAppearanceForm — status enum 9-state 모두 활성화 (`draft → review-queued → in-review → approved → publishable → published`).
423:- zod schema 안 EatStatusSchema / PUBLICATION_STATUSES 정정 — 풀 9-state 허용.
467:- (CA-ACTION-04) publish 시 evaluatePublishable() 호출 → publishable=false 면 form-level error 반환.
474:const TRANSITIONS = {
494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
504:| 11 | check() stub 호출 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel 우선 |
506:| 13 | FAQ published 1행 (DB CHECK 해제 검증) → FAQ public page mainEntity 1건 + JSON-LD 출력 | EC-DEFER-05 부분 해소 |
515:| 3 | C0016 6 entity status unlock + compliance_record_id FK migration | C0016_status_unlock.sql |
517:| 5 | Compliance types + check() stub | apps/web/src/lib/compliance/types.ts + check.ts |
523:| 11 | 6 entity form status select 풀 9-state 활성화 + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
525:| 13 | manifest 18단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
526:| 14 | audit emit 4종 — content-submitted-for-review · content-approved · content-rejected · content-published | (각 server action 안 emitAuditEvent) |
528:| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 해소 marker | doc patches |
533:- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
534:- `CA-DEFER-02`: RiskInference 자동 추론 · inlineRiskFlags 매칭
535:- `CA-DEFER-04`: 캐시 2종 + cacheKey
536:- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
537:- `CA-DEFER-07`: request-changes / delegate 액션
538:- `CA-DEFER-11`: autoCheckResult.findings 풀명세
541:- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
542:- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
543:- `CA-DEFER-10`: client 검수자
544:- `CA-DEFER-12`: attachments[] 법무 의견서
547:- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
548:- `CA-DEFER-09`: MediaThresholdAssessment · analytics-reporting 통합
549:- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning) — 각 CA-DEFER phase 매핑
553:- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker (subset 명시 + CA-DEFER-13 매핑 표)
555:- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05/07/12 해소 marker
556:- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 해소 marker
557:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — 18 단계 (16 + C0014/C0015/C0016)
563:| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "adminUser|admin_user|physician|legal|reviewer|approver|instanceMembership|membership|role" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/action-context.ts | Select-Object -First 220' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "contentPublicationStatus|article|treatmentPage|legalDocument|faq|publication|mediaAppearance|complianceRecordId|status" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 767ms:
3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
40:// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
41:export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
55:    legalEntityName: text("legal_entity_name"),
257:export const legalDocument = pgTable(
258:  "legal_document",
263:    documentType: legalDocumentTypeEnum("document_type").notNull(),
281:    slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
282:    titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
283:    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
284:    emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
286:    templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
287:    autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
289:    statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
290:    publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
292:    riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
293:    instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
294:    instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
296:    type5Unique: uniqueIndex("legal_document_instance_5type_unique")
299:    instanceIdx: index("legal_document_instance_idx").on(t.instanceId),

 succeeded in 744ms:
4:// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
33:export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
41:export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
171:export const treatmentPage = pgTable(
180:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
182:    complianceRecordId: uuid("compliance_record_id"),
193:    publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
197:    statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
200:      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
206:export const article = pgTable(
207:  "article",
215:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
217:    complianceRecordId: uuid("compliance_record_id"),
229:    slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
230:    titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
231:    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
232:    publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
233:    instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
234:    instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
235:    instanceIdx: index("article_instance_idx").on(t.instanceId),
236:    statusIdx: index("article_status_idx").on(t.instanceId, t.status),
237:    publishedIdx: index("article_published_idx")
239:      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
240:    authorIdx: index("article_author_idx")
243:    categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
248:      name: "article_author_fk",
250:    // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
257:export const legalDocument = pgTable(
263:    documentType: legalDocumentTypeEnum("document_type").notNull(),
273:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
288:    // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
289:    statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
313://   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
314:export const articleCategory = pgTable(
315:  "article_category",
327:    articleTypeDefault: text("article_type_default"),
333:    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
334:    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
335:    descLen: check("article_category_description_length",
337:    coverImageUrlFormat: check("article_category_cover_image_url_format",
339:    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
340:    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
341:    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
342:    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
343:    parentIdx: index("article_category_parent_idx")
351:      name: "article_category_parent_fk",
359:export const publication = pgTable(
360:  "publication",
375:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
383:    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
384:    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
385:    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
386:    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
387:    thumbnailUrlFormat: check("publication_thumbnail_url_format",
389:    doiFormat: check("publication_doi_format",
391:    pubmedIdFormat: check("publication_pubmed_id_format",
393:    authorsArray: check("publication_authors_array",
395:    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
396:    publishedRequiresAt: check("publication_published_requires_at",
397:      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
398:    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
399:    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
400:    instanceIdx: index("publication_instance_idx").on(t.instanceId),
401:    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
402:    publishedIdx: index("publication_published_idx")
404:      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
405:    authorIdx: index("publication_author_idx")
411:      name: "publication_author_doctor_fk",
418:export const mediaAppearance = pgTable(
433:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
452:      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
456:    statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
459:      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
472://   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
474:export const faq = pgTable(
475:  "faq",
487:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
489:    complianceRecordId: uuid("compliance_record_id"),
496:    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
497:    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
498:    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
500:    statusV01Limit: check("faq_status_v01_limit", sql`${t.status} = 'draft'`),
501:    publishedAtNullV01: check("faq_published_at_null_v01", sql`${t.publishedAt} IS NULL`),
502:    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
503:    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
504:    instanceIdx: index("faq_instance_idx").on(t.instanceId),
505:    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
506:    publishedIdx: index("faq_published_idx")
508:      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
509:    categoryIdx: index("faq_category_idx")
512:    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
515:      foreignColumns: [articleCategory.instanceId, articleCategory.id],
516:      name: "faq_category_fk",
521:      name: "faq_author_doctor_fk",
525:      foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
526:      name: "faq_related_treatment_fk",

 succeeded in 837ms:
// @glitzy/web/lib/action-context — Server Action 공통 ctx resolve helper
// ClinicProfile/Doctor/Treatment/Article actions 가 같은 패턴 사용

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import {
  AuthDeniedError,
  assertActionEligibility,
  getActiveSession,
  type ActionType,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "./db";
import { getAuthCfg } from "./env";
import { readSessionCookie } from "./session-cookie";
import { slugResolver } from "./slug-resolver";

export type ActionContext = {
  signedToken: string;
  userId: AdminUserId;
  instanceId: InstanceId;
};

/**
 * Server Action 진입 공통 (auth + slug resolve).
 * 실패 시 redirect/notFound throw — caller 는 try 후 정상 흐름만 처리.
 * action 인자가 주어지면 추가로 assertActionEligibility 까지 검증 (resolveTenantContext 는 withSkeletonTx 안에서 별도 수행).
 */
export async function resolveActionContext(instanceSlug: string): Promise<ActionContext> {
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let session;
  try {
    session = await getActiveSession(sqlBase, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  // cycle2-3entity WEB-26: branded UUID narrow
  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  return { signedToken, userId, instanceId };
}

/**
 * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
 * try/catch 가 일반 error 로 swallow 하지 않도록 outer catch 에서 rethrow 용도.
 * cycle1-3entity WEB-01.
 */
export function isNextControlFlowError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const digest = (err as { digest?: unknown }).digest;
  if (typeof digest !== "string") return false;
  // cycle5-3entity WEB-48: Next 14+ notFound() 는 NEXT_HTTP_ERROR_FALLBACK;404 패턴 사용
  return (
    digest.startsWith("NEXT_REDIRECT") ||
    digest === "NEXT_NOT_FOUND" ||
    digest.startsWith("NEXT_HTTP_ERROR_FALLBACK")
  );
}

/** action eligibility check helper — withSkeletonTx 안에서 ctx 받은 후 호출 */
export { assertActionEligibility, type ActionType };

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/src/schema.ts | Select-Object -First 90' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "EC-DEFER-05|EC-DEFER-07|EC-DEFER-12|FAQ|Publication|MediaAppearance|compliance_record|ComplianceRecord|published" docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-DEFER-01|LegalDocument|ComplianceRecord|legalCounsel|published|status" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 598ms:
3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **6 cycle 36 findings 전건 수용** · cycle 6 closeableAfterPatch=true 확정. 수렴 추세 **22 → 8 → 3 → 2 → 1 → 0**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.
9:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
15:| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
16:| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
20:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
22:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
26:- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
27:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
28:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
30:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
31:- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
32:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
33:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
34:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
50:- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
51:- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
59:| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
60:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
64:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
66:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
67:| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
68:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
69:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
70:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
71:| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
74:| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
75:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
76:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
77:| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
79:| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
88:| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
89:| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
90:| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
91:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
92:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
93:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
95:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
97:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
98:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
205:  published_date DATE NOT NULL,                  -- 학술지 게재일
214:  published_at TIMESTAMPTZ,
226:  CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
235:CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
236:  WHERE status = 'published' AND published_at IS NOT NULL;
250:- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
266:  published_date DATE NOT NULL,
274:  published_at TIMESTAMPTZ,
284:  CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
293:CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
294:  WHERE status = 'published' AND published_at IS NOT NULL;
327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
328:  published_at TIMESTAMPTZ,
335:  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
336:  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
350:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
351:  WHERE status = 'published' AND published_at IS NOT NULL;
364:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
373:--   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
374:--   D0011 의 published-only 패턴과 다른 의도 — 본 plan 의 명시적 결정.
385:    AND status = 'published'
386:    AND published_at IS NOT NULL
387:    AND published_at <= now()
394:    AND status = 'published'
395:    AND published_at IS NOT NULL
396:    AND published_at <= now()
399:-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
405:    AND status = 'published'
418:| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
421:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
422:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
431:| Publication | `/admin/<slug>/publications` |
432:| MediaAppearance | `/admin/<slug>/media-appearances` |
439:const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
442:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
443:- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
448:- **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
449:- **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
456:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
462:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
466:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
469:- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
472:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
479:- **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
480:- **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.
483:- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
485:  - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
486:  - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
493:- **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
494:- **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.
499:  - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
500:  - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`
523:- FAQ rendering 분기:
525:  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
530:- lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
531:- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
536:Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).
540:### 6.1 ScholarlyArticle entity (Publication)
548:  "datePublished": "<publishedDate>",
561:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
569:  "uploadDate": "<publishedDate>",
579:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
583:  "@type": "FAQPage",
606:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
609:- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
619:| `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
620:| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
621:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
622:| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
626:- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
627:- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
648:| 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
650:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
651:| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
654:| 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
658:| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
669:| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
674:| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
677:| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
681:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
682:| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
685:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
691:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
700:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
703:- `EC-DEFER-06`: FAQ 다국어.
704:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
706:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
709:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
710:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
711:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
716:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
717:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
718:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
720:  - § 4 C-24 Publication 풀명세 신규.
721:  - § 4 C-25 MediaAppearance 풀명세 신규.
725:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
726:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
727:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
731:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
732:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
733:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
742:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
743:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
744:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
745:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 589ms:
1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
7:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
17:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
51:| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |
57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
59:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
62:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
67:| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
98:  status content_publication_status NOT NULL DEFAULT 'draft',
100:  published_at TIMESTAMPTZ,
117:  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
118:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
119:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
230:- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
308:### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
318:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
360:- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
393:    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
410:7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:
414:{ "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
416:{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
417:// row 3~7 (5종 LegalDocument)
418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
441:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
442:  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
469:export type LegalDocumentType =
473:  documentType: LegalDocumentType;
492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
502:  5. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
504:  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
520:| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
536:| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
559:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
586:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

 succeeded in 665ms:
// @glitzy/core-content — Drizzle schema (v0.4·EAT_CONTENT_PLAN v1.0 patch)
// M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)

import { sql } from "drizzle-orm";
import {
  pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
  pgEnum, index, foreignKey, check, unique, uniqueIndex,
} from "drizzle-orm/pg-core";

// === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===

export const instance = pgTable(
  "instance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
    activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
    slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
  }),
);

// === Shared enums (C-03·C-04) ===
export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
  "draft", "review-queued", "in-review", "approved", "publishable",
  "published", "blocked", "rejected", "stale",
]);

export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);

// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
  "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
]);

// === ClinicProfile (C-01) ===

export const clinicProfile = pgTable(
  "clinic_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().default("clinic"),
    name: text("name").notNull(),
    alternateName: text("alternate_name"),
    legalEntityName: text("legal_entity_name"),
    slogan: text("slogan"),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    foundingDate: date("founding_date"),
    founder: text("founder"),
    logoUrl: text("logo_url").notNull(),
    ogImageUrl: text("og_image_url").notNull(),
    businessRegistrationNumber: text("business_registration_number"),
    // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
    policyContactPerson: text("policy_contact_person"),
    policyContactEmail: text("policy_contact_email"),
    policyContactPhone: text("policy_contact_phone"),
    policyEffectiveDate: date("policy_effective_date"),
    // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
    primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
    slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
    // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
    policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
    // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
    instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  }),
);


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "physician_reviewer_eligible|legal_reviewer_eligible|approverRoleEligibility|client-approver|physician-reviewer|legal-reviewer|operator" .' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "Audit|audit|eventType|notification|content-approved|content-rejected|content-published|content-submitted" docs/admin/REVIEW_WORKFLOW.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md apps packages' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE admin|admin_user|auth|role|instance_membership|memberships" packages apps -g "*.ts" -g "*.sql"' in C:\Users\assag\solution\website-exposure
 succeeded in 712ms:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:28:  - `packages/db/src/service-role.ts` `withServiceRole(sql, ctx, allowedFunctions, fn) — ServiceRoleContext { function, actorUserId: AdminUserId (필수), instanceId?, reason }` + audit_log 자동 pending/outcome
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:31:  - `apps/spike-e/migrations/004_audit_event.sql` audit_event 컬럼 = `occurred_at` (created_at 아님) · GRANT INSERT TO app_tenant_user 없음
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:49:| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:83:> **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:107:│   │   │   ├── actions.ts            — issueMagicLink server action + skeleton-layer audit_event emit
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:111:│   │   │   └── route.ts              — POST · revokeSession + cookie clear + audit_event emit
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:123:│   │   ├── db.ts                     — postgres.Sql singleton (base role · audit emission에 사용)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:126:│   │   ├── slug-resolver.ts          — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 5.2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:127:│   │   ├── post-login-redirect.ts    — sqlBase 직접 SELECT + audit_event emit (cycle4·8 ADMIN-UI-100 — service-role 미사용 · § 3.2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:162:       → 없으면 emitAuditEvent('magic-link-issue-denied', payload:{ identifier, reason:'not-allowlisted' })
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:166:     • emitAuditEvent(sqlBase, { eventType:'magic-link-issued', payload:{ identifier: emailNormalized }})
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:176:       • 없음 또는 inactive → emitAuditEvent('user-not-allowlisted-on-consume', payload:{ identifier }) → redirect /sign-in?reason=user-inactive
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
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:267:import { emitAuditEvent } from "@glitzy/auth";
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:277:    await emitAuditEvent(sqlBase, {
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:278:      eventType: "slug-lookup-not-found",
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:318:### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:322:> - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:323:> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:346:| `magic-link-expired` · `magic-link-consumed` · `magic-link-not-found` · `magic-link-invalid` | `/sign-in?reason=<r>` + emitAuditEvent `magic-link-rejected` |
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
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:470:    // ADMIN-UI-80 cycle5: AuditEventInput 필드명 camelCase (TypeScript helper) — DB column 은 snake_case
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:471:    await emitAuditEvent(sqlBase, {
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:472:      eventType: "content-saved",
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:482:  } catch (auditErr) {
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:483:    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:495:- **ADMIN-UI-22**: last-writer-wins · audit payload updatedAtBefore/After.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:496:- **ADMIN-UI-36**: emitAuditEvent 는 tx commit **후** sqlBase 로.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:504:                                                #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:508:                                                #         GRANT INSERT ON audit_event TO <web_role>;
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:546:4. seed 자체의 audit 은 **audit_event 에 직접 INSERT** (ADMIN-UI-48 — audit_log 는 `instance_id NOT NULL` 이고 audit_event 는 nullable). emitAuditEvent helper 또는 raw INSERT 사용:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:589:// 3) seed audit — audit_event 사용 (audit_log 는 instance_id NOT NULL — ADMIN-UI-48)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:590:// ADMIN-UI-80 cycle5: column 은 snake_case (DB schema 정합)·AuditEventInput TypeScript helper 는 camelCase (targetUserId 등)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:592:  INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:606:| `audit_event` | `apps/spike-e/migrations/004_audit_event.sql` | Spike E |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:607:| `audit_log` | `apps/spike-a/migrations/003_audit_log.sql` | Spike A · `instance_id NOT NULL` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:616:3. slug lookup 실패 → notFound() + audit_event `slug-lookup-not-found` (cycle4 정정 ADMIN-UI-69 — sqlBase 직접 + audit_event emit).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:620:7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:626:13. **Cookie HMAC tampering (ADMIN-UI-43)** — signed token 마지막 byte 변조 후 request → `session-signature-invalid` → cookie clear · /sign-in redirect · audit_event `tenant-resolve-denied` reason=`session-signature-invalid`.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:640:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:654:| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:670:| `docs/decisions/PACKAGES_STRUCTURE.md` v0.2 patch (cycle6·8 정정 ADMIN-UI-91·99) — `@glitzy/auth` placeholder 분류 제거 (실제 issueMagicLink·createSession·resolveTenantContext·emitAuditEvent export 중), `@glitzy/core-content` 상태 갱신 (6 tables 추가), apps/web entry 및 dependency arrow 명시 | v0.2 patch | **follow-up (acceptance non-blocking)** |
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
docs/admin/REVIEW_WORKFLOW.md:25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
docs/admin/REVIEW_WORKFLOW.md:295:| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |
docs/admin/REVIEW_WORKFLOW.md:302:- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
docs/admin/REVIEW_WORKFLOW.md:332:- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
docs/admin/REVIEW_WORKFLOW.md:334:- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
docs/admin/REVIEW_WORKFLOW.md:414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
docs/admin/REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
docs/admin/REVIEW_WORKFLOW.md:460:## 9. 알림 (notifications Feature Module 인터페이스)
docs/admin/REVIEW_WORKFLOW.md:462:본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
docs/admin/REVIEW_WORKFLOW.md:521:| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
docs/admin/REVIEW_WORKFLOW.md:565:- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
docs/admin/REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:568:- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:575:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
docs/admin/REVIEW_WORKFLOW.md:582:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:599:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:614:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
docs/admin/REVIEW_WORKFLOW.md:615:- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)
docs/admin/REVIEW_WORKFLOW.md:619:- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
docs/admin/REVIEW_WORKFLOW.md:620:- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
docs/admin/REVIEW_WORKFLOW.md:621:- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
docs/admin/REVIEW_WORKFLOW.md:624:  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
docs/admin/REVIEW_WORKFLOW.md:628:## 10. 감사 로그 (Audit Log)
docs/admin/REVIEW_WORKFLOW.md:638:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
docs/admin/REVIEW_WORKFLOW.md:640:### 10.2 audit log 페이로드
docs/admin/REVIEW_WORKFLOW.md:643:type AuditLogEntry = {
docs/admin/REVIEW_WORKFLOW.md:648:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:652:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
docs/admin/REVIEW_WORKFLOW.md:656:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:659:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:665:  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
docs/admin/REVIEW_WORKFLOW.md:666:  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
docs/admin/REVIEW_WORKFLOW.md:667:  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
docs/admin/REVIEW_WORKFLOW.md:668:  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
docs/admin/REVIEW_WORKFLOW.md:715:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
docs/admin/REVIEW_WORKFLOW.md:719:- audit log는 **append-only** — 수정·삭제 불가
docs/admin/REVIEW_WORKFLOW.md:736:  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
docs/admin/REVIEW_WORKFLOW.md:752:| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |
docs/admin/REVIEW_WORKFLOW.md:775:| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
docs/admin/REVIEW_WORKFLOW.md:790:| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
docs/admin/REVIEW_WORKFLOW.md:801:| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
docs/admin/REVIEW_WORKFLOW.md:807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
docs/admin/REVIEW_WORKFLOW.md:808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
docs/admin/REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
packages\migrations-runner\src\index.ts:9://   - service-role-emit.ts (audit_event 1:1 per migration)
packages\shared-types\src\index.ts:12:/** Content reference (compliance-assistant·audit·notifications에서 cross-reference) */
packages\shared-types\src\index.ts:29:  | "mediaImporter" | "notificationDispatcher" | "complianceAssistant"
apps\spike-c-local\package.json:20:    "scenario:audit-scrub": "tsx --env-file=.env src/scenarios/test-audit-scrubbing.ts",
apps\spike-c-local\package.json:22:    "scenario:all": "pnpm seed && pnpm scenario:isolation && pnpm scenario:method-confusion && pnpm scenario:content-type && pnpm scenario:list-bucket && pnpm scenario:range && pnpm scenario:replay && pnpm scenario:audit-scrub && pnpm scenario:invariant",
apps\spike-c-local\PROVIDER_RUNBOOK.md:71:| URL audit scrubbing | audit log에 X-Amz-Signature·credential 미저장 | LOCAL 동등 |
packages\notifications-outbox\src\provider-adapter.ts:1:// @glitzy/notifications-outbox/provider-adapter — provider interface
apps\spike-c-local\src\audit-log.ts:1:// Spike C — in-memory audit log with URL scrubbing
apps\spike-c-local\src\audit-log.ts:4:export type AuditEntry = {
apps\spike-c-local\src\audit-log.ts:57:    super(`audit entry field '${field}' contains forbidden pattern '${pattern}' — possible URL/credential leak`);
apps\spike-c-local\src\audit-log.ts:97:const STRING_FIELDS: ReadonlyArray<keyof AuditEntry> = [
apps\spike-c-local\src\audit-log.ts:109:function assertNoLeak(entry: AuditEntry): void {
apps\spike-c-local\src\audit-log.ts:117:class AuditLog {
apps\spike-c-local\src\audit-log.ts:118:  private readonly entries: AuditEntry[] = [];
apps\spike-c-local\src\audit-log.ts:120:  append(entry: AuditEntry): void {
apps\spike-c-local\src\audit-log.ts:125:  list(): readonly AuditEntry[] {
apps\spike-c-local\src\audit-log.ts:133:  countByAction(action: AuditEntry["action"]): number {
apps\spike-c-local\src\audit-log.ts:137:  countByResult(result: AuditEntry["result"]): number {
apps\spike-c-local\src\audit-log.ts:142:export const auditLog = new AuditLog();
packages\db\src\service-role.ts:1:// @glitzy/db/service-role — break-glass with pending audit + branded ServiceRoleTx
packages\db\src\service-role.ts:4://   - PKG1-005: outcome update 실패 시 원본 error preserve·AuditMandatoryFailureError 양쪽 error 포함
packages\db\src\service-role.ts:9:import { ServiceRoleGuardError, AuditMandatoryFailureError } from "./errors.js";
packages\db\src\service-role.ts:41: *   2) pending audit insert (tx 밖·forensic 보장) — 실패 시 AuditMandatoryFailureError
packages\db\src\service-role.ts:53:  let auditId: string;
packages\db\src\service-role.ts:56:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
packages\db\src\service-role.ts:66:    auditId = rows[0]!.id;
packages\db\src\service-role.ts:68:    throw new AuditMandatoryFailureError(
packages\db\src\service-role.ts:69:      `pre-insert audit failed: ${err instanceof Error ? err.message : String(err)}`,
packages\db\src\service-role.ts:94:      UPDATE audit_log
packages\db\src\service-role.ts:97:      WHERE id = ${auditId}::uuid
packages\db\src\service-role.ts:105:      (fnError as any).auditUpdateError = updateError instanceof Error ? updateError.message : String(updateError);
packages\db\src\service-role.ts:110:    throw new AuditMandatoryFailureError(
packages\db\src\service-role.ts:112:      { phase: "outcome-update", auditId, function: ctx.function },
packages\notifications-outbox\src\outbox.ts:1:// @glitzy/notifications-outbox/outbox — cycle3 patch (Spike B 실 SQL 정합)
packages\notifications-outbox\src\index.ts:1:// @glitzy/notifications-outbox — Spike B LOCAL_PASS 패턴 production module (v0.2)
packages\db\src\errors.ts:29:export class AuditMandatoryFailureError extends AppError {
packages\db\src\errors.ts:32:  override readonly name = "AuditMandatoryFailureError";
packages\notifications-outbox\src\errors.ts:1:// @glitzy/notifications-outbox — domain errors
packages\notifications-outbox\package.json:2:  "name": "@glitzy/notifications-outbox",
packages\auth\src\resolve-tenant-context.ts:10:import { emitAuditEvent } from "./audit.js";
packages\auth\src\resolve-tenant-context.ts:52:    await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:53:      eventType: "tenant-resolve-denied",
packages\auth\src\resolve-tenant-context.ts:66:    await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:67:      eventType: "tenant-resolve-denied",
packages\auth\src\resolve-tenant-context.ts:83:    await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: session.userId, reason: "user-not-found" });
packages\auth\src\resolve-tenant-context.ts:88:    await emitAuditEvent(sql, { eventType: "inactive-user-rejected", actorUserId: user.id, payload: { requestedInstanceId: normalized } });
packages\auth\src\resolve-tenant-context.ts:97:      await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:98:        eventType: "tenant-resolve-denied",
packages\auth\src\resolve-tenant-context.ts:106:      await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:107:        eventType: "tenant-resolve-denied",
packages\auth\src\resolve-tenant-context.ts:123:      await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:124:        eventType: "tenant-resolve-denied",
packages\auth\src\resolve-tenant-context.ts:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
packages\auth\src\resolve-tenant-context.ts:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
packages\auth\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
packages\auth\src\resolve-tenant-context.ts:155:  await emitAuditEvent(sql, {
packages\auth\src\resolve-tenant-context.ts:156:    eventType: "tenant-resolved",
packages\auth\src\audit.ts:1:// @glitzy/auth — audit_event insert helper
packages\auth\src\audit.ts:5:export type AuditEventInput = {
packages\auth\src\audit.ts:6:  readonly eventType: string;
packages\auth\src\audit.ts:15:export async function emitAuditEvent(
packages\auth\src\audit.ts:17:  input: AuditEventInput,
packages\auth\src\audit.ts:20:    INSERT INTO audit_event (event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload)
packages\auth\src\audit.ts:22:      ${input.eventType},
packages\storage\src\sign-url.ts:9:import { auditLog } from "./audit-log.js";
packages\storage\src\sign-url.ts:67:    auditLog.append({
packages\storage\src\sign-url.ts:100:  auditLog.append({
apps\spike-a\package.json:18:    "scenario:audit": "tsx --env-file=.env src/scenarios/test-audit.ts",
apps\spike-a\package.json:22:    "scenario:all": "pnpm scenario:pgbouncer-auth && pnpm seed && pnpm scenario:read && pnpm seed && pnpm scenario:write && pnpm seed && pnpm scenario:rollback && pnpm seed && pnpm scenario:nested && pnpm seed && pnpm scenario:audit && pnpm seed && pnpm scenario:negative && pnpm seed && pnpm scenario:invariant && pnpm seed && pnpm scenario:perf",
packages\auth\src\index.ts:9:export { emitAuditEvent, type AuditEventInput } from "./audit.js";
packages\storage\src\index.ts:24:  auditLog,
packages\storage\src\index.ts:25:  type AuditEntry,
packages\storage\src\index.ts:26:} from "./audit-log.js";
apps\spike-c-local\src\tenant-context.ts:122: * 호출 시 audit insert 책임은 caller. (Spike A audit pattern과 동일)
packages\storage\src\errors.ts:37:    super(`audit field '${field}' contains forbidden pattern '${pattern}'`);
apps\spike-c-local\src\sign-url.ts:17:import { auditLog } from "./audit-log.js";
apps\spike-c-local\src\sign-url.ts:81: *   - audit emit (success + denied)
apps\spike-c-local\src\sign-url.ts:104:  // Tenant guard — 실패 시 audit + throw
apps\spike-c-local\src\sign-url.ts:108:    auditLog.append({
apps\spike-c-local\src\sign-url.ts:142:  auditLog.append({
apps\spike-c-local\src\scenarios\provider-smoke.ts:9:import { auditLog } from "../audit-log.js";
apps\spike-c-local\src\scenarios\provider-smoke.ts:12:function clearAudits(): void { auditLog.clear(); }
apps\spike-c-local\src\scenarios\provider-smoke.ts:55:  clearAudits();
apps\spike-c-local\src\scenarios\provider-smoke.ts:113:  // Phase 6: audit log leak scan
apps\spike-c-local\src\scenarios\provider-smoke.ts:115:  for (const e of auditLog.list()) {
apps\spike-c-local\src\scenarios\provider-smoke.ts:118:      if (blob.includes(f)) throw new Error(`audit leak '${f}': ${blob}`);
apps\spike-c-local\src\scenarios\provider-smoke.ts:121:  console.log(`[provider-smoke] phase6 audit scan (${auditLog.list().length} entries): no leak (PASS)`);
packages\storage\src\audit-log.ts:1:// @glitzy/storage/audit-log — URL scrubber 14 patterns·9 string fields·1~2 URL decode
packages\storage\src\audit-log.ts:6:export type AuditEntry = {
packages\storage\src\audit-log.ts:54:const STRING_FIELDS: ReadonlyArray<keyof AuditEntry> = [
packages\storage\src\audit-log.ts:58:function assertNoLeak(entry: AuditEntry): void {
packages\storage\src\audit-log.ts:66:class AuditLog {
packages\storage\src\audit-log.ts:67:  private readonly entries: AuditEntry[] = [];
packages\storage\src\audit-log.ts:68:  append(entry: AuditEntry): void {
packages\storage\src\audit-log.ts:72:  list(): readonly AuditEntry[] { return this.entries; }
packages\storage\src\audit-log.ts:74:  countByResult(result: AuditEntry["result"]): number {
packages\storage\src\audit-log.ts:79:export const auditLog = new AuditLog();
apps\spike-c-local\src\scenarios\invariant-runner.ts:7:import { auditLog } from "../audit-log.js";
apps\spike-c-local\src\scenarios\invariant-runner.ts:23:  auditLog.clear();
apps\spike-c-local\src\scenarios\invariant-runner.ts:79:  // Audit invariants
apps\spike-c-local\src\scenarios\invariant-runner.ts:80:  const auditEntries = auditLog.list();
apps\spike-c-local\src\scenarios\invariant-runner.ts:81:  const successAudit = auditLog.countByResult("success");
apps\spike-c-local\src\scenarios\invariant-runner.ts:82:  const deniedAudit = auditLog.countByResult("denied");
apps\spike-c-local\src\scenarios\invariant-runner.ts:84:  if (successAudit !== selfSuccess) {
apps\spike-c-local\src\scenarios\invariant-runner.ts:85:    throw new InvariantViolationError("audit success count mismatch", { successAudit, selfSuccess });
apps\spike-c-local\src\scenarios\invariant-runner.ts:87:  if (deniedAudit !== crossDenied) {
apps\spike-c-local\src\scenarios\invariant-runner.ts:88:    throw new InvariantViolationError("audit denied count mismatch", { deniedAudit, crossDenied });
apps\spike-c-local\src\scenarios\invariant-runner.ts:93:  for (const e of auditEntries) {
apps\spike-c-local\src\scenarios\invariant-runner.ts:97:        throw new InvariantViolationError("audit leak", { pattern: f, entry: e });
apps\spike-c-local\src\scenarios\invariant-runner.ts:102:  // Prefix invariant — success audit objectKey가 own prefix로 시작
apps\spike-c-local\src\scenarios\invariant-runner.ts:103:  for (const e of auditEntries) {
apps\spike-c-local\src\scenarios\invariant-runner.ts:107:        throw new InvariantViolationError("success audit prefix mismatch", { entry: e, expected });
apps\spike-c-local\src\scenarios\invariant-runner.ts:112:  console.log(`[invariant] selfSuccess=${selfSuccess} crossDenied=${crossDenied} unexpectedError=${unexpectedError} audit.success=${successAudit} audit.denied=${deniedAudit} time=${elapsed}ms`);
apps\spike-c-local\src\seed.ts:9:import { auditLog } from "./audit-log.js";
apps\spike-c-local\src\seed.ts:47:  auditLog.clear();
packages\auth\src\internal\session-internal.ts:9:import { emitAuditEvent } from "../audit.js";
packages\auth\src\internal\session-internal.ts:40:    await emitAuditEvent(tx, {
packages\auth\src\internal\session-internal.ts:41:      eventType: "instance-switched",
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:1:// Spike C — test-audit-scrubbing: 모든 string field·URL-encoded leak·확장 credential patterns
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:6:import { auditLog, UrlLeakError, type AuditEntry } from "../audit-log.js";
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:11:  readonly field: keyof AuditEntry;
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:12:  readonly mutator: (e: AuditEntry) => AuditEntry;
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:15:const baseEntry: AuditEntry = {
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:44:  auditLog.clear();
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:51:      objectKey: objectKeyFor(INSTANCE_A_ID, `audit-test/${i}.txt`),
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:57:  const positive = auditLog.list();
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:65:        throw new Error(`audit leaked '${f}': ${blob}`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:69:  console.log(`[audit-scrub] positive ${positive.length} entries: no leak (PASS)`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:77:      auditLog.append(entry);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:82:      throw new Error(`[audit-scrub] '${c.label}': UrlLeakError should be raised. entry=${JSON.stringify(entry)}`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:85:    console.log(`[audit-scrub] negative '${c.label}': LEAK DETECTED (PASS)`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:88:  console.log(`\n✅ test-audit-scrubbing: positive 1 + negative ${detected} cases PASS`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:92:  console.error("[audit-scrub] FAIL:", err);
packages\storage\package.json:12:    "./audit-log": { "types": "./dist/audit-log.d.ts", "import": "./dist/audit-log.js" },
apps\web\README.md:5:> - Onboarding URL scrape 2차 (v1.1): codex 비평 4 cycle 22 findings 전건 수용 (12→7→3→0). SSRF 방어 + tenant resolve 재검증 + sanitizeUrlForAudit.
apps\web\README.md:17:- `/[instanceSlug]/clinic-profile` 폼 (upsert · withSkeletonTx 2단계 · RLS · audit)
apps\web\README.md:42:- `apps/spike-e/migrations/001~004.sql` (admin_user · session · "verificationToken" · audit_event)
apps\web\README.md:43:- `apps/spike-a/migrations/003_audit_log.sql` (audit_log)
apps\web\README.md:72:| 슬러그 lookup | `lib/slug-resolver.ts` — sqlBase 직접 SELECT + audit_event emit (withServiceRole 미사용) |
apps\web\README.md:76:| Audit | `audit_event` (control-plane) · `audit_log` (M0 v1.0 service-role) 분리 |
apps\web\README.md:78:| `content-saved` audit | tx commit 후 base-role · try/catch best-effort (M0 v1.0 transactional outbox cascade) |
apps\web\README.md:82:- packages/auth v0.3: audit emit 자동 · sessionRefreshed 반환 · inactive membership 분기
apps\spike-c-local\src\scenarios\test-isolation.ts:8:import { auditLog } from "../audit-log.js";
apps\spike-c-local\src\scenarios\test-isolation.ts:42:  auditLog.clear();
apps\spike-c-local\src\scenarios\test-isolation.ts:92:  // audit 검증
apps\spike-c-local\src\scenarios\test-isolation.ts:93:  const success = auditLog.countByResult("success");
apps\spike-c-local\src\scenarios\test-isolation.ts:94:  const deniedAudit = auditLog.countByResult("denied");
apps\spike-c-local\src\scenarios\test-isolation.ts:96:  console.log(`[isolation] audit: success=${success}, denied=${deniedAudit}`);
apps\spike-c-local\src\scenarios\test-isolation.ts:97:  if (success !== 1) throw new Error(`expected 1 success audit, got ${success}`);
apps\spike-c-local\src\scenarios\test-isolation.ts:98:  if (deniedAudit !== expectedDenied) throw new Error(`expected ${expectedDenied} denied audit, got ${deniedAudit}`);
apps\spike-a\src\service-role.ts:1:// Spike A — service_role break-glass + audit
apps\spike-a\src\service-role.ts:4:// SPIKEA2-002 정정: pending audit pattern — pre-insert + outcome update.
apps\spike-a\src\service-role.ts:5://                  audit insert 실패 시 throw (감사 필수 semantics 보장)
apps\spike-a\src\service-role.ts:7://                  control-plane audit table 분리 예정 (별도 spec)
apps\spike-a\src\service-role.ts:39:export class AuditMandatoryFailureError extends Error {
apps\spike-a\src\service-role.ts:40:  override readonly name = "AuditMandatoryFailureError";
apps\spike-a\src\service-role.ts:48: *  2. pending audit row insert (status="pending") — 실패 시 throw
apps\spike-a\src\service-role.ts:53: * 1 invocation = 1 audit row (id = auditRowId). multi-instance는 metadata.affectedInstanceIds[]에 기록.
apps\spike-a\src\service-role.ts:54: * audit_log row는 representative instance에 저장 (audit_log instance_id NOT NULL).
apps\spike-a\src\service-role.ts:55: * 본 구현 단계에서는 control-plane audit table 분리 예정 (SPIKEA2-003).
apps\spike-a\src\service-role.ts:64:  const auditRowId = randomUUID();
apps\spike-a\src\service-role.ts:68:  // 1. pending audit (pre-insert) — 실패 시 fn 실행 전 abort
apps\spike-a\src\service-role.ts:71:      INSERT INTO audit_log (id, instance_id, actor_id, actor_role, action, metadata)
apps\spike-a\src\service-role.ts:73:        ${auditRowId}::uuid,
apps\spike-a\src\service-role.ts:92:    throw new AuditMandatoryFailureError(`pending audit insert failed: ${errorMessage(e)}`);
apps\spike-a\src\service-role.ts:110:  // 2. outcome update — audit 실패는 critical
apps\spike-a\src\service-role.ts:114:      UPDATE audit_log
apps\spike-a\src\service-role.ts:121:      WHERE id = ${auditRowId}::uuid
apps\spike-a\src\service-role.ts:124:    throw new AuditMandatoryFailureError(`outcome audit update failed: ${errorMessage(e)}`);
apps\spike-a\src\service-role.ts:152:// audit row update에서 audit_log RLS는 update policy 없음 → permission denied
apps\spike-a\src\service-role.ts:155:// 본 구현에서는 audit_log에 service-role 전용 update policy 필요 (별도 spec)
apps\spike-a\src\seed.ts:1:// Spike A — seed 2 instance × 5 row + audit
apps\spike-a\src\seed.ts:12:  await dbSuper.execute(sql`TRUNCATE content_test, audit_log, invariant_log RESTART IDENTITY`);
apps\spike-a\src\seed.ts:29:  // audit log seed (각 instance 1건)
apps\spike-a\src\seed.ts:31:    INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
apps\spike-a\src\schema.ts:12:export const auditLog = pgTable("audit_log", {
apps\web\src\seed.ts:172:      // 5) seed audit — audit_event (audit_log 는 instance_id NOT NULL)
apps\web\src\seed.ts:174:        INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
apps\spike-a\migrations\003_audit_log.sql:1:-- Spike A — migration 003: audit_log (append-only, two-layer)
apps\spike-a\migrations\003_audit_log.sql:7:CREATE TABLE audit_log (
apps\spike-a\migrations\003_audit_log.sql:18:CREATE INDEX audit_log_instance_id_idx ON audit_log (instance_id, occurred_at DESC);
apps\spike-a\migrations\003_audit_log.sql:21:-- SPIKEA2-002: service-role outcome update를 위해 audit_log는 FORCE 미적용
apps\spike-a\migrations\003_audit_log.sql:23:ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
apps\spike-a\migrations\003_audit_log.sql:27:CREATE POLICY audit_log_read ON audit_log
apps\spike-a\migrations\003_audit_log.sql:32:CREATE POLICY audit_log_write ON audit_log
apps\spike-a\migrations\003_audit_log.sql:39:GRANT SELECT, INSERT ON audit_log TO app_tenant_user;
apps\spike-c-local\src\scenarios\test-list-bucket.ts:12:import { auditLog } from "../audit-log.js";
apps\spike-c-local\src\scenarios\test-list-bucket.ts:39:      auditLog.append({
apps\spike-c-local\src\scenarios\test-list-bucket.ts:56:  // production helper에서는 instance principal 사용·여기서는 service-role 으로 통합 list (audit 위주)
apps\spike-c-local\src\scenarios\test-list-bucket.ts:59:  auditLog.append({
apps\spike-c-local\src\scenarios\test-list-bucket.ts:76:  auditLog.clear();
apps\spike-c-local\src\scenarios\test-list-bucket.ts:101:  // Case 3: service_role bypass + audit — seed/ subpath만 명시
apps\web\scripts\local-pass.ts:78:    console.log("\n=== audit_event 신규 row 확인 ===");
apps\web\scripts\local-pass.ts:80:      SELECT event_type, payload FROM audit_event
apps\web\scripts\local-pass.ts:92:      console.error(`  MISSING audit events: ${missing.join(", ")}`);
apps\web\scripts\local-pass.ts:93:      throw new Error("audit events incomplete");
apps\web\scripts\local-pass.ts:95:    console.log("\n=== Gate #7 PASS (audit_event 4종 row 확인) ===");
apps\spike-a\src\scenarios\provider-smoke.ts:66:    // Phase 4: service_role audit pattern (super-user에서 audit insert·outcome update)
apps\spike-a\src\scenarios\provider-smoke.ts:67:    const auditId = await sup`
apps\spike-a\src\scenarios\provider-smoke.ts:68:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
apps\spike-a\src\scenarios\provider-smoke.ts:72:    if (auditId.length !== 1) throw new Error("audit insert failed");
apps\spike-a\src\scenarios\provider-smoke.ts:73:    console.log("[provider-smoke] phase4 service_role audit pending pattern: PASS");
apps\spike-a\src\scenarios\provider-smoke.ts:115:    await sup`DELETE FROM audit_log WHERE actor_id = 'provider-smoke'`;
apps\web\src\app\sign-out\route.ts:2:// getActiveSession → userId 추출 → revokeSession → audit (tampered cookie 분기)
apps\web\src\app\sign-out\route.ts:3:// cycle2-code WEB-24·25: payload.reason shape + revoke 실패와 audit 실패 분리
apps\web\src\app\sign-out\route.ts:8:  emitAuditEvent,
apps\web\src\app\sign-out\route.ts:48:        await emitAuditEvent(sqlBase, {
apps\web\src\app\sign-out\route.ts:49:          eventType: "session-revoked",
apps\web\src\app\sign-out\route.ts:53:      } catch (auditErr) {
apps\web\src\app\sign-out\route.ts:54:        console.error("[sign-out] session-revoked audit emit failed", auditErr);
apps\web\src\app\sign-out\route.ts:66:        await emitAuditEvent(sqlBase, {
apps\web\src\app\sign-out\route.ts:67:          eventType: "session-revoked-anonymous",
apps\web\src\app\sign-out\route.ts:70:      } catch (auditErr) {
apps\web\src\app\sign-out\route.ts:71:        console.error("[sign-out] session-revoked-anonymous audit emit failed", auditErr);
apps\spike-a\README.md:40:pnpm dotenv -e .env -- pnpm scenario:audit
apps\spike-a\README.md:74:| test-audit | service-role pending audit + outcome update + append-only **layer 1** (GRANT denied) |
apps\spike-a\README.md:84:| multi-instance audit | 1 invocation = 1 audit row (representative instance). multi-instance B tenant는 자신에게 영향 준 break-glass 이벤트 읽기 불가 — control-plane audit table 분리 예정 (SPIKEA2-003) | 본 구현 단계 별도 spec |
apps\spike-a\README.md:109:│   ├── 003_audit_log.sql       # append-only 두 층 (GRANT + RLS)
apps\spike-a\README.md:116:│   ├── service-role.ts         # withServiceRole + assertBreakGlassAllowed + 1:1 audit
apps\spike-a\README.md:120:│       ├── test-audit.ts·test-negative.ts·test-invariant-runner.ts·test-perf.ts
apps\web\src\app\(admin)\layout.tsx:18:  // cycle1-code WEB-06: tampered/expired cookie 시 cleanup route 로 redirect → cookie clear + audit
apps\spike-a\PROVIDER_RUNBOOK.md:75:4. service_role audit (pending insert pattern)
apps\spike-a\PROVIDER_RUNBOOK.md:86:| service_role audit pending pattern | audit_log row 항상 생성·outcome update | 동등 |
apps\spike-a\src\scenarios\test-audit.ts:1:// Spike A — Scenario 5: service-role + audit_log RLS·append-only
apps\spike-a\src\scenarios\test-audit.ts:2:// SPIKEA1-009 정정: 1 invocation = 1 audit row 검증
apps\spike-a\src\scenarios\test-audit.ts:19:  // 1. service-role 사용 — audit log 1 invocation = 1 row (SPIKEA1-009)
apps\spike-a\src\scenarios\test-audit.ts:21:  // seed audit row 제외 위해 service-role-invoked만 카운트
apps\spike-a\src\scenarios\test-audit.ts:23:    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:45:    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:50:    detail: `1 invocation = ${afterN - beforeN} audit row (passed if 1)`,
apps\spike-a\src\scenarios\test-audit.ts:53:  // 2. instance-a context에서 자신의 audit만 보임 (representative instance를 A로 set)
apps\spike-a\src\scenarios\test-audit.ts:54:  const auditA = await withTenantTransaction(INSTANCE_A, async (tx) => {
apps\spike-a\src\scenarios\test-audit.ts:56:      SELECT instance_id FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:60:  const foreignFromA = auditA.filter((r) => r.instance_id !== INSTANCE_A).length;
apps\spike-a\src\scenarios\test-audit.ts:62:    passed: foreignFromA === 0 && auditA.length >= 1,
apps\spike-a\src\scenarios\test-audit.ts:63:    detail: `instance-a audit: ${auditA.length} rows, foreign: ${foreignFromA}`,
apps\spike-a\src\scenarios\test-audit.ts:70:      await tx.execute(sql`UPDATE audit_log SET action = 'tampered' WHERE instance_id = ${INSTANCE_A}::uuid`);
apps\spike-a\src\scenarios\test-audit.ts:77:    detail: `audit_log UPDATE → permission denied (layer 1): ${updateError.slice(0, 80) || "no error (FAIL)"}`,
apps\spike-a\src\scenarios\test-audit.ts:83:      await tx.execute(sql`DELETE FROM audit_log WHERE instance_id = ${INSTANCE_A}::uuid`);
apps\spike-a\src\scenarios\test-audit.ts:90:    detail: `audit_log DELETE → permission denied (layer 1): ${deleteError.slice(0, 80) || "no error (FAIL)"}`,
apps\spike-a\src\scenarios\test-audit.ts:98:  // 5. cross-instance read 격리 (B context — service-role audit 자체는 A에 insert됐으니 B에서 안 보여야 함)
apps\spike-a\src\scenarios\test-audit.ts:99:  const auditB = await withTenantTransaction(INSTANCE_B, async (tx) => {
apps\spike-a\src\scenarios\test-audit.ts:101:      SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:106:    passed: auditB === 0,
apps\spike-a\src\scenarios\test-audit.ts:107:    detail: `instance-b audit cross-isolation: ${auditB} rows (passed if 0 — representative instance was A)`,
apps\spike-a\src\scenarios\test-audit.ts:114:  console.log(`test-audit: ${allPassed ? "PASS" : "FAIL"}`);
apps\spike-d\package.json:28:    "scenario:audit": "tsx --env-file=.env src/scenarios/test-audit.ts",
apps\spike-d\package.json:32:    "scenario:all": "pnpm scenario:canonical-generation && pnpm scenario:dev-apply && pnpm scenario:staging-apply && pnpm scenario:drift-check && pnpm scenario:advisory-lock && pnpm scenario:forward-only-hotfix && pnpm scenario:audit && pnpm scenario:expand-contract && pnpm scenario:deploy-gate && pnpm scenario:failure-rollback"
apps\spike-d\src\errors.ts:31:export class MigrationAuditError extends Error {
apps\spike-d\src\errors.ts:32:  override readonly name = "MigrationAuditError";
apps\spike-d\src\service-role.ts:2:// SPIKED2-007 cycle3: emitServiceRoleAuditEvent dead path 제거 — runMigrate가 per-file tx 안에서 직접 insert
apps\spike-d\migrations\001_roles_and_extensions.sql:17:-- migration_audit role (audit_log 전용 insert 권한)
apps\spike-d\src\migrate.ts:4://   - SPIKED1-002: audit_event bootstrap·1:1 강제 (silent 제거)
apps\spike-d\src\migrate.ts:20:  MigrationAuditError,
apps\spike-d\src\migrate.ts:98: * ensureAuditEvent: 006과 byte-for-byte 동등·IF NOT EXISTS로 idempotent.
apps\spike-d\src\migrate.ts:99: * SPIKED1-002 cycle2: 001 이전 bootstrap·모든 migration이 1:1 audit emit 가능.
apps\spike-d\src\migrate.ts:101:async function ensureAuditEvent(sql: postgres.Sql): Promise<void> {
apps\spike-d\src\migrate.ts:104:    CREATE TABLE IF NOT EXISTS audit_event (
apps\spike-d\src\migrate.ts:115:  await sql`CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC)`;
apps\spike-d\src\migrate.ts:166:    // 2) Bootstrap: ledger + audit_event 동시에 ready (이후 모든 migration이 1:1 audit emit)
apps\spike-d\src\migrate.ts:168:    await ensureAuditEvent(sql);
apps\spike-d\src\migrate.ts:194:      // 5) Per-file transaction: SQL + ledger insert + audit emit 모두 atomic
apps\spike-d\src\migrate.ts:195:      // SPIKED1-002 cycle2: audit_event를 transaction 안에서 emit·실패 시 ledger·audit 모두 rollback
apps\spike-d\src\migrate.ts:205:        // SPIKED1-002: 1:1 audit emit·migration 실패 시 함께 rollback
apps\spike-d\src\migrate.ts:207:          INSERT INTO audit_event (event_type, actor_id, actor_role, service_role_function, target_db, payload)
apps\spike-d\src\migrate.ts:377:        throw new MigrationAuditError(`shadow incomplete: ${f.filename} (id ${f.id}) not applied`);
apps\spike-d\src\migrate.ts:414:        await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\migrate.ts:416:        await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\db\schema.ts:75:// 3. audit_log — append-only·JSONB metadata
apps\spike-d\src\db\schema.ts:76:export const auditLog = pgTable(
apps\spike-d\src\db\schema.ts:77:  "audit_log",
apps\spike-d\src\db\schema.ts:89:    instanceTimeIdx: index("audit_log_instance_time_idx").on(t.instanceId, t.occurredAt.desc()),
apps\spike-d\src\db\schema.ts:111:// 5. audit_event — service-role-invoked
apps\spike-d\src\db\schema.ts:112:export const auditEvent = pgTable(
apps\spike-d\src\db\schema.ts:113:  "audit_event",
apps\spike-d\src\db\schema.ts:116:    eventType: text("event_type").notNull(),
apps\spike-d\src\db\schema.ts:125:    typeTimeIdx: index("audit_event_type_time_idx").on(t.eventType, t.occurredAt.desc()),
apps\web\src\app\sign-in\consume\route.ts:12:  emitAuditEvent,
apps\web\src\app\sign-in\consume\route.ts:27:/** cycle2-code WEB-26: audit emit best-effort — session row 와 cookie 일관성 유지 */
apps\web\src\app\sign-in\consume\route.ts:28:async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\app\sign-in\consume\route.ts:30:    await emitAuditEvent(sqlBase, input);
apps\web\src\app\sign-in\consume\route.ts:32:    console.error(`[sign-in/consume] audit emit failed: ${input.eventType}`, err);
apps\web\src\app\sign-in\consume\route.ts:46:    // cycle4-code WEB-57: malformed query 도 best-effort audit (token 원문 미저장)
apps\web\src\app\sign-in\consume\route.ts:48:      eventType: "magic-link-rejected",
apps\web\src\app\sign-in\consume\route.ts:63:        eventType: "magic-link-rejected",
apps\web\src\app\sign-in\consume\route.ts:77:    // token CAS 건드리지 않음 — generic redirect + audit
apps\web\src\app\sign-in\consume\route.ts:79:      eventType: "user-not-allowlisted-on-consume",
apps\web\src\app\sign-in\consume\route.ts:90:      eventType: "user-not-allowlisted-on-consume",
apps\web\src\app\sign-in\consume\route.ts:106:        eventType: "magic-link-rejected",
apps\web\src\app\sign-in\consume\route.ts:115:  // 3) cycle2-code WEB-22·23: pure membership lookup (audit emit 없이) · createSession 후에 audit
apps\web\src\app\sign-in\consume\route.ts:116:  const membershipResult = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
apps\web\src\app\sign-in\consume\route.ts:118:    // membership 없음 audit — identifier 포함 (WEB-22)
apps\web\src\app\sign-in\consume\route.ts:120:      eventType: "first-active-membership-missing",
apps\web\src\app\sign-in\consume\route.ts:132:  //   recheck 실패 시 revoke + audit (session-created 미emit · audit stream 정합)
apps\web\src\app\sign-in\consume\route.ts:133:  const recheck = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
apps\web\src\app\sign-in\consume\route.ts:141:      eventType: "first-active-membership-missing",
apps\web\src\app\sign-in\consume\route.ts:149:  // cycle2-3entity WEB-20: session-created audit 는 mandatory — 실패 시 session revoke + sign-in error
apps\web\src\app\sign-in\consume\route.ts:151:    await emitAuditEvent(sqlBase, {
apps\web\src\app\sign-in\consume\route.ts:152:      eventType: "session-created",
apps\web\src\app\sign-in\consume\route.ts:155:  } catch (auditErr) {
apps\web\src\app\sign-in\consume\route.ts:156:    console.error("[sign-in/consume] session-created audit emit failed — compensating revoke", auditErr);
apps\web\src\app\sign-in\consume\route.ts:166:    eventType: "magic-link-consumed",
apps\web\src\app\sign-in\consume\route.ts:171:    eventType: "first-active-membership-resolved",
apps\spike-e\src\migrate.ts:30:      await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, "verificationToken", "session", instance_membership, admin_user, tenant_data CASCADE`;
apps\spike-e\src\session.ts:3://   - SPIKEE1-002 cascade: switchSuperAdminInstance API에서 audit invariant 강제 (별도 함수)
apps\spike-e\src\session.ts:10:import { emitAuditEvent } from "./audit.js";
apps\spike-e\src\session.ts:82: * Super-admin instance switch — single API·audit invariant 강제 (SPIKEE1-002 cycle2).
apps\spike-e\src\session.ts:83: * 본 함수만 호출하면 instance-switched audit이 정확히 1건 insert 보장 (transaction atomic).
apps\spike-e\src\session.ts:102:    await emitAuditEvent(tx, {
apps\spike-e\src\session.ts:103:      eventType: "instance-switched",
apps\spike-e\src\seed.ts:16:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps\web\src\lib\tenant.ts:13: *   1) resolveTenantContext (signature 검증 · TTL · membership · eligibility · audit)
apps\web\src\lib\slug-resolver.ts:2:// cycle4·8 결정: sqlBase 직접 SELECT + audit_event emit (withServiceRole 미사용)
apps\web\src\lib\slug-resolver.ts:3:// cycle3-code WEB-44·51: audit best-effort + slug regex 사전 검증
apps\web\src\lib\slug-resolver.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps\web\src\lib\slug-resolver.ts:12:async function emitBestEffort(sqlBase: postgres.Sql, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\lib\slug-resolver.ts:14:    await emitAuditEvent(sqlBase, input);
apps\web\src\lib\slug-resolver.ts:16:    console.error("[slug-resolver] audit emit failed", err);
apps\web\src\lib\slug-resolver.ts:28:      eventType: "slug-lookup-not-found",
apps\web\src\lib\slug-resolver.ts:40:      eventType: "slug-lookup-not-found",
apps\spike-d\src\scenarios\test-audit.ts:1:// Spike D — test-audit: audit_event count == applied count (SPIKED1-002 cycle2)
apps\spike-d\src\scenarios\test-audit.ts:12:    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-audit.ts:14:    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-audit.ts:20:  console.log(`[audit] applied ${result.applied.length} migrations`);
apps\spike-d\src\scenarios\test-audit.ts:24:    // Case 1: 1:1 — audit_event count == applied count
apps\spike-d\src\scenarios\test-audit.ts:26:      SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'service-role-invoked'
apps\spike-d\src\scenarios\test-audit.ts:28:    const auditCount = cnt[0]!.count;
apps\spike-d\src\scenarios\test-audit.ts:29:    if (auditCount !== result.applied.length) {
apps\spike-d\src\scenarios\test-audit.ts:30:      throw new Error(`[audit] case-1 expected 1:1 audit (applied=${result.applied.length}, audit=${auditCount})`);
apps\spike-d\src\scenarios\test-audit.ts:32:    console.log(`[audit] case-1 1:1 audit count = applied count = ${auditCount} (PASS)`);
apps\spike-d\src\scenarios\test-audit.ts:35:    const auditRows = await audSql<{ payload: { migrationId: number; filename: string; checksum: string } }[]>`
apps\spike-d\src\scenarios\test-audit.ts:36:      SELECT payload FROM audit_event WHERE event_type = 'service-role-invoked' ORDER BY (payload->>'migrationId')::int
apps\spike-d\src\scenarios\test-audit.ts:38:    const auditIds = new Set(auditRows.map((r) => r.payload.migrationId));
apps\spike-d\src\scenarios\test-audit.ts:40:    if (auditIds.size !== appliedIds.size) {
apps\spike-d\src\scenarios\test-audit.ts:41:      throw new Error(`[audit] case-2 migrationId set size mismatch: audit=${auditIds.size}, applied=${appliedIds.size}`);
apps\spike-d\src\scenarios\test-audit.ts:43:    for (const id of auditIds) {
apps\spike-d\src\scenarios\test-audit.ts:44:      if (!appliedIds.has(id)) throw new Error(`[audit] case-2 audit has unknown migrationId ${id}`);
apps\spike-d\src\scenarios\test-audit.ts:46:    console.log(`[audit] case-2 migrationId set == applied set: PASS`);
apps\spike-d\src\scenarios\test-audit.ts:51:      FROM audit_event WHERE event_type = 'service-role-invoked'
apps\spike-d\src\scenarios\test-audit.ts:55:      throw new Error(`[audit] case-3 expected single service_role_function='migrationRunner', got ${JSON.stringify(fns)}`);
apps\spike-d\src\scenarios\test-audit.ts:57:    console.log(`[audit] case-3 single service_role_function=migrationRunner (${fns[0]!.count}): PASS`);
apps\spike-d\src\scenarios\test-audit.ts:60:    for (const r of auditRows.slice(0, 3)) {
apps\spike-d\src\scenarios\test-audit.ts:61:      if (typeof r.payload.migrationId !== "number") throw new Error("audit payload missing migrationId");
apps\spike-d\src\scenarios\test-audit.ts:62:      if (typeof r.payload.filename !== "string") throw new Error("audit payload missing filename");
apps\spike-d\src\scenarios\test-audit.ts:63:      if (typeof r.payload.checksum !== "string") throw new Error("audit payload missing checksum");
apps\spike-d\src\scenarios\test-audit.ts:65:    console.log("[audit] case-4 payload schema (migrationId·filename·checksum): PASS");
apps\spike-d\src\scenarios\test-audit.ts:67:    // Case 5: ledger count == applied count == audit count
apps\spike-d\src\scenarios\test-audit.ts:69:    if (ledgerCnt[0]!.count !== result.applied.length || ledgerCnt[0]!.count !== auditCount) {
apps\spike-d\src\scenarios\test-audit.ts:70:      throw new Error(`[audit] case-5 ledger/applied/audit count mismatch: ${ledgerCnt[0]!.count}/${result.applied.length}/${auditCount}`);
apps\spike-d\src\scenarios\test-audit.ts:72:    console.log(`[audit] case-5 ledger == applied == audit = ${ledgerCnt[0]!.count}: PASS`);
apps\spike-d\src\scenarios\test-audit.ts:77:  console.log("\n✅ test-audit: 5 cases PASS (1:1 audit_event per migration)");
apps\spike-d\src\scenarios\test-audit.ts:81:  console.error("[audit] FAIL:", err);
apps\web\src\app\sign-in\cleanup\route.ts:3:// AuthDeniedError(session-*) 발생 시 이 route 로 redirect → cookie clear + audit emit + sign-in redirect
apps\web\src\app\sign-in\cleanup\route.ts:7:import { emitAuditEvent, type AuthDenyReason } from "@glitzy/auth";
apps\web\src\app\sign-in\cleanup\route.ts:25:  // cycle5-code WEB-67: cookie 존재 시에만 audit emit — direct GET 만으로 forensic log 오염 방지
apps\web\src\app\sign-in\cleanup\route.ts:29:      // cycle2-3entity WEB-30: resolveTenantContext 가 이미 tenant-resolve-denied emit 했을 수 있으므로 별도 eventType 으로 분리 (중복 forensic row 방지)
apps\web\src\app\sign-in\cleanup\route.ts:30:      await emitAuditEvent(getSqlBase(), {
apps\web\src\app\sign-in\cleanup\route.ts:31:        eventType: "session-cookie-cleared",
apps\web\src\app\sign-in\cleanup\route.ts:36:      console.error("[sign-in/cleanup] audit emit failed", err);
apps\spike-d\src\scenarios\test-advisory-lock.ts:12:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-advisory-lock.ts:14:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-e\src\audit.ts:1:// Spike E — audit_event insert (sql or tx 모두 허용)
apps\spike-e\src\audit.ts:5:export type AuditEventInput = {
apps\spike-e\src\audit.ts:6:  readonly eventType: string;
apps\spike-e\src\audit.ts:15:export async function emitAuditEvent(
apps\spike-e\src\audit.ts:17:  input: AuditEventInput,
apps\spike-e\src\audit.ts:20:    INSERT INTO audit_event (event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload)
apps\spike-e\src\audit.ts:22:      ${input.eventType},
apps\web\src\app\sign-in\actions.ts:10:import { AuthDeniedError, emitAuditEvent, issueMagicLink, normalizeIdentifier } from "@glitzy/auth";
apps\web\src\app\sign-in\actions.ts:45:    // enumeration 방지 — UI 응답은 generic, audit 만 명시 기록 (cycle3-code WEB-46: best-effort)
apps\web\src\app\sign-in\actions.ts:47:      await emitAuditEvent(sqlBase, {
apps\web\src\app\sign-in\actions.ts:48:        eventType: "magic-link-issue-denied",
apps\web\src\app\sign-in\actions.ts:52:      console.error("[sign-in] magic-link-issue-denied audit emit failed", err);
apps\web\src\app\sign-in\actions.ts:59:    await emitAuditEvent(sqlBase, {
apps\web\src\app\sign-in\actions.ts:60:      eventType: "magic-link-issued",
apps\web\src\app\sign-in\actions.ts:64:    console.error("[sign-in] magic-link-issued audit emit failed", err);
apps\spike-d\src\scenarios\test-deploy-gate.ts:12:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:14:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:119:    await viewSql`DROP VIEW tenant_audit_log_view`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:121:    await viewSql`CREATE VIEW tenant_audit_log_view AS SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at FROM audit_log WHERE instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:122:    await viewSql`GRANT SELECT ON tenant_audit_log_view TO app_tenant_user`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:134:      if (/tenant_audit_log_view/.test(err.diff) && /reloptions/.test(err.diff)) {
apps\web\src\app\page.tsx:51:  // cycle1-code WEB-14: root redirect 는 read-only — audit emit 안 함 (consume route 만 audit)
apps\web\src\app\page.tsx:53:  const result = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
apps\spike-e\PROVIDER_RUNBOOK.md:33:`apps/web/src/lib/auth/` 디렉토리에 Spike E의 `magic-link.ts·session.ts·resolve-tenant-context.ts·audit.ts·errors.ts` 복사.
apps\spike-e\PROVIDER_RUNBOOK.md:124:| super-admin instance switch | switch API → audit insert | 동등 |
apps\spike-d\src\scenarios\test-canonical-generation.ts:10:import { contentTest, instanceUser, auditLog, migrationLedger, auditEvent } from "../db/schema.js";
apps\spike-d\src\scenarios\test-canonical-generation.ts:28:    name: "audit_log",
apps\spike-d\src\scenarios\test-canonical-generation.ts:29:    table: auditLog,
apps\spike-d\src\scenarios\test-canonical-generation.ts:38:    name: "audit_event",
apps\spike-d\src\scenarios\test-canonical-generation.ts:39:    table: auditEvent,
apps\spike-d\src\scenarios\test-canonical-generation.ts:81:  { label: "audit_event table", regex: /CREATE\s+TABLE\s+["']?audit_event["']?/i, canonical: true, note: "pgTable" },
apps\spike-d\src\scenarios\test-canonical-generation.ts:82:  { label: "audit_log JSONB metadata", regex: /["']?metadata["']?\s+jsonb/i, canonical: true, note: "jsonb()" },
apps\spike-d\src\scenarios\test-canonical-generation.ts:89:  { label: "tenant_audit_log_view security_invoker", rawFile: "007_tenant_audit_log_view.sql", mustContain: /security_invoker\s*=\s*on/i, note: "Drizzle Kit view 미지원·raw SQL mixin" },
apps\web\src\lib\site-meta-fetch.ts:319:/** audit payload sanitize — userinfo/query/fragment 제거 (WEB-113·115)
apps\web\src\lib\site-meta-fetch.ts:322:export function sanitizeUrlForAudit(input: string): string {
apps\spike-d\migrations\007_tenant_audit_log_view.sql:1:-- Spike D — migration 007: tenant_audit_log_view (custom view·raw SQL mixin)
apps\spike-d\migrations\007_tenant_audit_log_view.sql:5:CREATE OR REPLACE VIEW tenant_audit_log_view
apps\spike-d\migrations\007_tenant_audit_log_view.sql:8:FROM audit_log
apps\spike-d\migrations\007_tenant_audit_log_view.sql:11:GRANT SELECT ON tenant_audit_log_view TO app_tenant_user;
apps\spike-d\src\scenarios\test-drift-check.ts:15:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-drift-check.ts:17:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\migrations\004_audit_log.sql:1:-- Spike D — migration 004: audit_log (append-only)
apps\spike-d\migrations\004_audit_log.sql:3:CREATE TABLE audit_log (
apps\spike-d\migrations\004_audit_log.sql:14:CREATE INDEX audit_log_instance_time_idx ON audit_log (instance_id, occurred_at DESC);
apps\spike-d\migrations\004_audit_log.sql:16:ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
apps\spike-d\migrations\004_audit_log.sql:18:CREATE POLICY audit_log_read ON audit_log
apps\spike-d\migrations\004_audit_log.sql:22:CREATE POLICY audit_log_write ON audit_log
apps\spike-d\migrations\004_audit_log.sql:26:GRANT SELECT, INSERT ON audit_log TO app_tenant_user;
apps\spike-d\migrations\006_audit_event.sql:1:-- Spike D — migration 006: audit_event (service-role-invoked 기록)
apps\spike-d\migrations\006_audit_event.sql:3:-- 본 file은 idempotent — ensureAuditEvent와 byte-for-byte 동등
apps\spike-d\migrations\006_audit_event.sql:5:CREATE TABLE IF NOT EXISTS audit_event (
apps\spike-d\migrations\006_audit_event.sql:16:CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
apps\spike-d\src\scenarios\test-dev-apply.ts:13:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-dev-apply.ts:15:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:36:    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:38:    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-failure-rollback.ts:18:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test, broken_test CASCADE`;
apps\spike-d\src\scenarios\test-failure-rollback.ts:20:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-failure-rollback.ts:77:    // audit_event도 098 entry 없음
apps\spike-d\src\scenarios\test-failure-rollback.ts:78:    const auditHas098 = await verifySql<{ exists: boolean }[]>`
apps\spike-d\src\scenarios\test-failure-rollback.ts:79:      SELECT EXISTS(SELECT 1 FROM audit_event WHERE (payload->>'migrationId')::int = 98) AS exists
apps\spike-d\src\scenarios\test-failure-rollback.ts:81:    if (auditHas098[0]!.exists) throw new Error("[failure-rollback] case-1 audit_event should NOT have 098");
apps\spike-d\src\scenarios\test-failure-rollback.ts:82:    console.log("[failure-rollback] case-1 audit_event does NOT have 098: PASS");
apps\spike-e\src\scenarios\provider-smoke.ts:98:  console.log("    - super-admin instance switch + audit");
apps\spike-e\migrations\004_audit_event.sql:1:-- Spike E — 004: audit_event (instance-switched·tenant-resolved·magic-link 등 모든 auth event)
apps\spike-e\migrations\004_audit_event.sql:3:CREATE TABLE audit_event (
apps\spike-e\migrations\004_audit_event.sql:19:CREATE INDEX audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
apps\spike-e\migrations\004_audit_event.sql:20:CREATE INDEX audit_event_actor_time_idx ON audit_event (actor_user_id, occurred_at DESC);
apps\spike-e\src\resolve-tenant-context.ts:3://   - SPIKEE1-002 cascade: instance-switched audit은 switchSuperAdminInstance에서만 emit
apps\spike-e\src\resolve-tenant-context.ts:14:import { emitAuditEvent } from "./audit.js";
apps\spike-e\src\resolve-tenant-context.ts:66:    await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:67:      eventType: "tenant-resolve-denied",
apps\spike-e\src\resolve-tenant-context.ts:78:    await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:79:      eventType: "tenant-resolve-denied",
apps\spike-e\src\resolve-tenant-context.ts:91:    await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: session.userId, reason: "user-not-found" });
apps\spike-e\src\resolve-tenant-context.ts:96:    await emitAuditEvent(sql, { eventType: "inactive-user-rejected", actorUserId: user.id, payload: { requestedInstanceId: normalized } });
apps\spike-e\src\resolve-tenant-context.ts:105:      await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:106:        eventType: "tenant-resolve-denied",
apps\spike-e\src\resolve-tenant-context.ts:114:      await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:115:        eventType: "tenant-resolve-denied",
apps\spike-e\src\resolve-tenant-context.ts:131:      await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:132:        eventType: "tenant-resolve-denied",
apps\spike-e\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
apps\spike-e\src\resolve-tenant-context.ts:147:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
apps\spike-e\src\resolve-tenant-context.ts:151:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
apps\spike-e\src\resolve-tenant-context.ts:163:  await emitAuditEvent(sql, {
apps\spike-e\src\resolve-tenant-context.ts:164:    eventType: "tenant-resolved",
apps\spike-d\src\scenarios\test-expand-contract.ts:13:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-expand-contract.ts:15:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-staging-apply.ts:12:    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-staging-apply.ts:14:    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-e\src\scenarios\test-inactive-user.ts:32:    // audit emit 검증
apps\spike-e\src\scenarios\test-inactive-user.ts:33:    const audit = await sql<{ count: number }[]>`
apps\spike-e\src\scenarios\test-inactive-user.ts:34:      SELECT COUNT(*)::int AS count FROM audit_event
apps\spike-e\src\scenarios\test-inactive-user.ts:37:    if (audit[0]!.count < 1) throw new Error("inactive-user-rejected audit missing");
apps\spike-e\src\scenarios\test-inactive-user.ts:38:    console.log(`[inactive-user] audit inactive-user-rejected: ${audit[0]!.count} (PASS)`);
apps\web\src\lib\post-login-redirect.ts:2:// cycle4·5 결정: sqlBase 직접 + audit_event emit (withServiceRole 미사용)
apps\web\src\lib\post-login-redirect.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps\web\src\lib\post-login-redirect.ts:13:// cycle1-code WEB-14: emitAudit 옵션 — consume route 는 true, root page 는 false (false positive 방지)
apps\web\src\lib\post-login-redirect.ts:17:  options: { emitAudit: boolean },
apps\web\src\lib\post-login-redirect.ts:32:    if (options.emitAudit) {
apps\web\src\lib\post-login-redirect.ts:33:      await emitAuditEvent(sqlBase, {
apps\web\src\lib\post-login-redirect.ts:34:        eventType: "first-active-membership-missing",
apps\web\src\lib\post-login-redirect.ts:44:  if (options.emitAudit) {
apps\web\src\lib\post-login-redirect.ts:45:    await emitAuditEvent(sqlBase, {
apps\web\src\lib\post-login-redirect.ts:46:      eventType: "first-active-membership-resolved",
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:40:    // audit emit 검증
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:41:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'invalid-instance-id'`;
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:42:    if (audit[0]!.count < cases.length) throw new Error(`audit count: ${audit[0]!.count}, expected ${cases.length}`);
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:43:    console.log(`[invalid-instance-id] audit invalid-instance-id: ${audit[0]!.count} (PASS)`);
apps\spike-e\src\scenarios\test-invariant.ts:2:// 모든 cross-instance resolve가 정확히 TenantResolveError로 reject·self resolve가 정확히 성공·audit count 정합
apps\spike-e\src\scenarios\test-invariant.ts:20:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps\spike-e\src\scenarios\test-invariant.ts:72:    // Audit invariants
apps\spike-e\src\scenarios\test-invariant.ts:73:    const audit = await sql<{ event_type: string; count: number }[]>`
apps\spike-e\src\scenarios\test-invariant.ts:74:      SELECT event_type, COUNT(*)::int AS count FROM audit_event GROUP BY event_type
apps\spike-e\src\scenarios\test-invariant.ts:76:    const auditMap = new Map(audit.map((r) => [r.event_type, r.count]));
apps\spike-e\src\scenarios\test-invariant.ts:77:    const resolvedCount = auditMap.get("tenant-resolved") ?? 0;
apps\spike-e\src\scenarios\test-invariant.ts:78:    const deniedCount = auditMap.get("tenant-resolve-denied") ?? 0;
apps\spike-e\src\scenarios\test-invariant.ts:79:    if (resolvedCount !== selfSuccess) throw new InvariantViolationError("audit tenant-resolved mismatch", { resolvedCount, selfSuccess });
apps\spike-e\src\scenarios\test-invariant.ts:80:    if (deniedCount !== crossDenied) throw new InvariantViolationError("audit tenant-resolve-denied mismatch", { deniedCount, crossDenied });
apps\spike-e\src\scenarios\test-invariant.ts:83:    console.log(`[invariant] audit: tenant-resolved=${resolvedCount}, tenant-resolve-denied=${deniedCount}`);
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:33:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:34:    if (audit[0]!.count < 1) throw new Error("audit missing");
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:35:    console.log(`[legal-eligibility] audit: ${audit[0]!.count} (PASS)`);
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:233:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:234:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:240:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:241:        console.error("[saveArticle] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:295:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:296:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:303:      console.error("[deleteArticle] audit emit failed", err);
apps\web\src\app\api\site-meta-fetch\route.ts:4://   - WEB-110: code 클라이언트 노출 제거 (audit reason 만)
apps\web\src\app\api\site-meta-fetch\route.ts:6://   - WEB-113: audit payload sanitizeUrlForAudit (userinfo/query 제거)
apps\web\src\app\api\site-meta-fetch\route.ts:13:  emitAuditEvent,
apps\web\src\app\api\site-meta-fetch\route.ts:22:import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
apps\web\src\app\api\site-meta-fetch\route.ts:32:async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\app\api\site-meta-fetch\route.ts:34:    await emitAuditEvent(sqlBase, input);
apps\web\src\app\api\site-meta-fetch\route.ts:36:    console.error("[site-meta-fetch] audit emit failed", err);
apps\web\src\app\api\site-meta-fetch\route.ts:81:      eventType: "site-meta-fetch-failed",
apps\web\src\app\api\site-meta-fetch\route.ts:119:      eventType: "site-meta-fetch-failed",
apps\web\src\app\api\site-meta-fetch\route.ts:131:      eventType: "site-meta-fetch-failed",
apps\web\src\app\api\site-meta-fetch\route.ts:143:      eventType: "site-meta-fetched",
apps\web\src\app\api\site-meta-fetch\route.ts:147:        // cycle8 WEB-113: audit payload sanitize
apps\web\src\app\api\site-meta-fetch\route.ts:148:        input: sanitizeUrlForAudit(parsed.data.url),
apps\web\src\app\api\site-meta-fetch\route.ts:149:        resolved: sanitizeUrlForAudit(meta.resolvedUrl),
apps\web\src\app\api\site-meta-fetch\route.ts:156:        eventType: "site-meta-fetch-failed",
apps\web\src\app\api\site-meta-fetch\route.ts:160:        payload: { input: sanitizeUrlForAudit(parsed.data.url) },
apps\web\src\app\api\site-meta-fetch\route.ts:167:      eventType: "site-meta-fetch-failed",
apps\web\src\app\api\site-meta-fetch\route.ts:171:      payload: { input: sanitizeUrlForAudit(parsed.data.url) },
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:125: *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:10://   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:20:  emitAuditEvent,
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:59:type AuditEntry = {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:125:        const auditEntries: AuditEntry[] = [];
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:183:        auditEntries.push({
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:243:        auditEntries.push({
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:326:          auditEntries.push({
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:350:        return { ctx, auditEntries };
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:354:    // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:359:    for (const entry of txResult.auditEntries) {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:361:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:362:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:379:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:382:        const eObj = typeof auditErr === "object" && auditErr !== null ? (auditErr as { code?: unknown; name?: unknown; message?: unknown }) : null;
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:386:          name: typeof eObj?.name === "string" ? eObj.name : (auditErr instanceof Error ? auditErr.name : null),
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:387:          message: auditErr instanceof Error ? auditErr.message : String(auditErr),
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:389:        console.error("[saveClinicProfile] audit row emit failed", {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:392:          error: auditErr,
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:398:      const eventType = emitted.length > 0 ? "content-saved-partial" : "content-saved-failed";
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:402:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:403:          eventType,
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:417:        console.error("[saveClinicProfile] fallback audit emit failed", {
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:418:          eventType,
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:1:// Spike E — test-tenant-resolve-own: authorized request → context + audit
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:21:    // audit emit 검증
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:22:    const audit = await sql<{ count: number }[]>`
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:23:      SELECT COUNT(*)::int AS count FROM audit_event
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:26:    if (audit[0]!.count < 1) throw new Error("tenant-resolved audit missing");
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:27:    console.log(`[tenant-resolve-own] audit tenant-resolved emit: ${audit[0]!.count} (PASS)`);
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:91:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:92:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:98:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:99:        console.error("[saveCategory] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:179:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:180:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:187:      console.error("[deleteCategory] audit emit failed", err);
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:25:    // audit emit 검증
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:26:    const audit = await sql<{ count: number }[]>`
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:27:      SELECT COUNT(*)::int AS count FROM audit_event
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:30:    if (audit[0]!.count < 1) throw new Error("tenant-resolve-denied audit missing");
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:31:    console.log(`[tenant-resolve-cross] denied audit: ${audit[0]!.count} (PASS)`);
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:8:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:92:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:93:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:99:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:100:        console.error("[saveFaq] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:153:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:154:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:161:      console.error("[deleteFaq] audit emit failed", err);
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:100:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:101:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:107:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:108:        console.error("[savePublication] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:161:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:162:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:169:      console.error("[deletePublication] audit emit failed", err);
apps\spike-e\src\scenarios\test-super-admin-switch.ts:2://   - switchSuperAdminInstance API만 사용·audit invariant 강제 검증
apps\spike-e\src\scenarios\test-super-admin-switch.ts:25:    // Case 2: switch to A·audit invariant (switchSuperAdminInstance API)
apps\spike-e\src\scenarios\test-super-admin-switch.ts:26:    const beforeA = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:29:    const afterA = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:30:    if (afterA[0]!.count !== beforeA[0]!.count + 1) throw new Error("switch A must emit exactly 1 instance-switched audit");
apps\spike-e\src\scenarios\test-super-admin-switch.ts:31:    console.log("[super-admin-switch] case-2 switch A + audit +1: PASS");
apps\spike-e\src\scenarios\test-super-admin-switch.ts:38:    // Case 4: switch A→B·audit +1
apps\spike-e\src\scenarios\test-super-admin-switch.ts:41:    const afterB = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:42:    if (afterB[0]!.count !== afterA[0]!.count + 1) throw new Error("switch B must emit exactly 1 instance-switched audit");
apps\spike-e\src\scenarios\test-super-admin-switch.ts:43:    console.log("[super-admin-switch] case-4 switch A→B + audit +1: PASS");
apps\web\src\app\(admin)\admin\[instanceSlug]\page.tsx:155:      // cycle2-code WEB-27: session 계열 deny 는 cleanup route 경유 (cookie clear + audit)
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:11:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:146:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:147:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:153:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:154:        console.error("[saveTreatmentPage] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:210:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:211:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:218:      console.error("[deleteTreatmentPage] audit emit failed", err);
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:99:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:100:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:106:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:107:        console.error("[saveMediaAppearance] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:160:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:161:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:168:      console.error("[deleteMediaAppearance] audit emit failed", err);
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:10://   - WEB-15 content-deleted audit targetUserId 추가
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:17:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:147:        await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:148:          eventType: "content-saved",
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:155:      } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:156:        console.error("[saveDoctorProfile] audit emit failed", auditErr);
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:243:      await emitAuditEvent(sqlBase, {
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:244:        eventType: "content-deleted",
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:250:    } catch (auditErr) {
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:251:      console.error("[deleteDoctorProfile] audit emit failed", auditErr);

 succeeded in 746ms:
.\handoff\PROJECT_OVERVIEW.md:182:| **Phase 0 게이트** | Week 1 Spike A·B·C gate + P0 patterns + legal-reviewer 단계 |
.\docs\admin\REVIEW_WORKFLOW.md:21:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
.\docs\admin\REVIEW_WORKFLOW.md:22:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
.\docs\admin\REVIEW_WORKFLOW.md:26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
.\docs\admin\REVIEW_WORKFLOW.md:66:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
.\docs\admin\REVIEW_WORKFLOW.md:134:| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
.\docs\admin\REVIEW_WORKFLOW.md:139:| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
.\docs\admin\REVIEW_WORKFLOW.md:158:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
.\docs\admin\REVIEW_WORKFLOW.md:159:| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
.\docs\admin\REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
.\docs\admin\REVIEW_WORKFLOW.md:172:- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
.\docs\admin\REVIEW_WORKFLOW.md:215:finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
.\docs\admin\REVIEW_WORKFLOW.md:235:| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
.\docs\admin\REVIEW_WORKFLOW.md:249:| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |
.\docs\admin\REVIEW_WORKFLOW.md:267:| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
.\docs\admin\REVIEW_WORKFLOW.md:321:| 본문 일반 변경 | `operator=true` |
.\docs\admin\REVIEW_WORKFLOW.md:342:legal > medical > client > operator
.\docs\admin\REVIEW_WORKFLOW.md:371:- 권한: `super-admin`·`operator` (역할별 운영 정책)
.\docs\admin\REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
.\docs\admin\REVIEW_WORKFLOW.md:523:| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
.\docs\admin\REVIEW_WORKFLOW.md:524:| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:526:| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:530:| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:533:| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:534:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:535:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:536:| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:537:| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:538:| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:539:| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:540:| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:541:| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:542:| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:543:| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:544:| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:545:| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:546:| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:547:| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:548:| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:549:| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:550:| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:551:| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:552:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:553:| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
.\docs\admin\REVIEW_WORKFLOW.md:554:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:555:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:556:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:557:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
.\docs\admin\REVIEW_WORKFLOW.md:569:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
.\docs\admin\REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.\docs\admin\REVIEW_WORKFLOW.md:671:  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
.\docs\admin\REVIEW_WORKFLOW.md:694:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
.\docs\admin\REVIEW_WORKFLOW.md:732:  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
.\docs\admin\REVIEW_WORKFLOW.md:733:  | "physician-reviewer"  // medical 역할 검수만
.\docs\admin\REVIEW_WORKFLOW.md:734:  | "legal-reviewer"      // legal 역할 검수만
.\docs\admin\REVIEW_WORKFLOW.md:735:  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
.\docs\admin\REVIEW_WORKFLOW.md:741:| 액션 | super-admin | operator | physician | legal | client |
.\docs\admin\REVIEW_WORKFLOW.md:745:| operator approve | ✅ | ✅ | | | |
.\docs\admin\REVIEW_WORKFLOW.md:765:- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
.\docs\admin\REVIEW_WORKFLOW.md:787:| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
.\docs\admin\REVIEW_WORKFLOW.md:808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
.\docs\admin\REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
.\docs\compliance\RISK_LEVELS.md:7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
.\docs\compliance\RISK_LEVELS.md:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
.\docs\compliance\RISK_LEVELS.md:237:| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
.\docs\compliance\RISK_LEVELS.md:286:| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |
.\docs\compliance\RISK_LEVELS.md:445:### 4.3 operator (운영자·동료 검수)
.\docs\compliance\RISK_LEVELS.md:476:- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
.\docs\compliance\RISK_LEVELS.md:480:- `requiredApproverRoles[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "legal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용
.\docs\compliance\RISK_LEVELS.md:599:| ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
.\docs\compliance\RISK_LEVELS.md:601:| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중복은 합집합으로 제거) |
.\docs\compliance\RISK_LEVELS.md:602:| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |
.\docs\compliance\RISK_LEVELS.md:603:| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
.\docs\compliance\RISK_LEVELS.md:604:| 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |
.\docs\compliance\RISK_LEVELS.md:609:- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크플로는 합집합의 모든 역할에 대해 ComplianceRecord 슬롯 기록 완료 시에만 발행 허용
.\docs\compliance\RISK_LEVELS.md:639:    checkedBy: "operator:seokcess@glitzy.kr"
.\docs\compliance\RISK_LEVELS.md:712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
.\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
.\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:560:| `2026-Q2-medical-law-2026-04-07` | `의료법` | `["제56조 제2항", "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.kr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속 |
.\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:561:| `2026-Q1-enforcement-decree-2026-02-10` | `의료법 시행령` | `["제23조", "제24조"]` | `2026-02-10` (시행령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655 | `2026-05-14T00:00:00Z` | `operator:seokcess@glitzy.kr` | `[]` | `{ kind: "all" }` | v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인 |
.\docs\features\search-visibility.md:471:- **권한**: `super-admin` 전용 (REVIEW_WORKFLOW § 11.1 AdminUserRole). operator는 본 액션 호출 불가 — retroactive 발송은 운영 영향 큰 액션이므로 권한 한정
.\apps\spike-c-local\src\tenant-context.ts:20:  readonly actorRole: "operator" | "admin" | "service_role";
.\docs\features\notifications.md:279:      - **(f) businessHours 평가** (§ 8.4 client-approver):
.\docs\features\notifications.md:411:- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
.\docs\features\notifications.md:583:- **권한**: `super-admin`·`operator` (REVIEW_WORKFLOW § 11.1)
.\docs\features\notifications.md:611:### 8.4 인스턴스 운영시간 — client-approver
.\docs\features\notifications.md:634:- operator·physician·legal·super-admin: 본 정책 미적용
.\docs\features\keyword-monitoring.md:198:| 운영 command | `registerKeyword(target)` | 키워드 추적 등록. **권한: operator·super-admin**. audit `keyword-tracking-target-registered` (§ 3.1.1) |
.\docs\features\keyword-monitoring.md:199:| 운영 command | `unregisterKeyword(targetId)` | **soft delete (active=false)**. 기존 snapshot·anomaly 보존. **권한: operator·super-admin**. audit `keyword-tracking-target-unregistered` (§ 3.1.1) |
.\docs\features\keyword-monitoring.md:434:- `recipients`: REVIEW_WORKFLOW § 9.1.1 매트릭스 — operator + client-approver
.\docs\features\keyword-monitoring.md:481:search-visibility § 9 패턴 동일. resolutionStatus 5종 (open·true-positive·false-positive·resolved·ignored). 권한: operator·super-admin. audit log: `keyword-anomaly-resolution-updated` (REVIEW_WORKFLOW § 10.2.1 cascade 완료).
.\docs\features\crm-sync.md:199:| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
.\docs\features\crm-sync.md:201:| 실행 | `pushOutbound(entity, recordId, operation): PushOutboundResult` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
.\docs\features\crm-sync.md:202:| 실행 | `resolveConflict(input: ResolveConflictInput): ResolveConflictResult` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
.\docs\features\crm-sync.md:206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
.\docs\features\crm-sync.md:207:| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
.\docs\features\crm-sync.md:218:| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
.\docs\features\crm-sync.md:291:| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
.\docs\features\crm-sync.md:294:| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
.\docs\features\crm-sync.md:296:| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
.\docs\features\crm-sync.md:297:| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
.\docs\features\crm-sync.md:299:| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
.\docs\features\crm-sync.md:312:| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |
.\docs\features\crm-sync.md:899:| `crm-sync-batch-failed` | high | email + inApp | operator |
.\docs\features\crm-sync.md:900:| `crm-sync-conflict-detected` | high | email + inApp | operator |
.\docs\features\crm-sync.md:901:| `crm-sync-credential-expired` | critical | email + inApp | operator + super-admin |
.\docs\features\crm-sync.md:902:| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |
.\docs\features\crm-sync.md:1045:- queryCrmRecords 권한 검사 — operator는 sensitive operationalHints 미반환
.\docs\features\content-migration.md:127:    instanceToInstanceCopy: [super-admin, legal-reviewer]
.\docs\features\content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
.\docs\features\content-migration.md:234:| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
.\docs\features\content-migration.md:267:분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.
.\docs\features\content-migration.md:530:| field | operator | super-admin | legal-reviewer | export |
.\docs\features\content-migration.md:982:| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
.\packages\storage\src\tenant-context.ts:15:  readonly actorRole: "operator" | "admin" | "service_role";
.\docs\features\compliance-assistant.md:498:| **operator-acknowledged ratio** | warning 중 operator가 "acknowledged"(인정)로 종결한 비율. **false-positive 추정 보조 지표만** (acknowledged ≠ false-positive 직접) | < 30% (M2+ 운영 누적, 운영 감 추적용) |
.\docs\features\compliance-assistant.md:499:| **operator-resolved ratio** | warning 중 operator가 "resolved"(본문 정정)로 종결한 비율 | M2+ 누적 후 baseline 산정 |
.\docs\features\compliance-assistant.md:502:> ⚠️ **precision/recall 정확한 산정**: 본 Feature의 false-positive·false-negative 정확 산정은 **외부 정답지(ground truth)** 가 필요. v1.0에서는 operator/검수자 액션 기반 보조 지표만 제공. 정답지 운영은 M3+ 누적 후 결정 (CA-09).
.\docs\features\compliance-assistant.md:554:     - `operator` (peerReviewer) — 전 콘텐츠 공통 필수
.\docs\features\asset-ingestion.md:110:| `asset-ingestion-source-registered` | `"ingestion-source:" + sourceId` | sourceType·configSummary·registeredBy | operator·super-admin |
.\docs\features\asset-ingestion.md:111:| `asset-ingestion-source-unregistered` | `"ingestion-source:" + sourceId` | sourceType·activeBefore·activeAfter·unregisteredBy | operator·super-admin |
.\docs\features\asset-ingestion.md:112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
.\docs\features\asset-ingestion.md:113:| `asset-ingestion-asset-rejected` | `"asset:" + assetId` | rejectionReason·rejectedBy | operator·super-admin |
.\docs\features\asset-ingestion.md:114:| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |
.\docs\features\asset-ingestion.md:209:- **권한**: operator·super-admin (AI4-12 — asset content review 한정)
.\docs\features\asset-ingestion.md:212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
.\docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\docs\features\asset-ingestion.md:694:**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.
.\docs\features\asset-ingestion.md:700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
.\docs\features\asset-ingestion.md:701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
.\docs\features\asset-ingestion.md:702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
.\docs\features\asset-ingestion.md:703:| `reviewer-assigned` | super-admin (operator 불가) | 검수자 배정 폼 |
.\docs\features\asset-ingestion.md:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
.\docs\features\asset-ingestion.md:760:- `redacted/` prefix는 operator·검수자 모두 read 가능
.\docs\features\analytics-reporting.md:168:          recipientRoles: ["operator", "client-approver"]
.\docs\features\analytics-reporting.md:176:          recipientRoles: ["client-approver", "operations"]
.\apps\spike-e\src\seed.ts:2:// Alice: instance-A operator
.\apps\spike-e\src\seed.ts:3:// Bob: instance-B operator
.\apps\spike-e\src\seed.ts:5:// Dave: instance-A legal-reviewer·legal_reviewer_eligible=true
.\apps\spike-e\src\seed.ts:6:// Eve: instance-A legal-reviewer·legal_reviewer_eligible=false
.\apps\spike-e\src\seed.ts:19:      INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
.\apps\spike-e\src\seed.ts:32:        (${userMap.get(USER_ALICE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'operator'),
.\apps\spike-e\src\seed.ts:33:        (${userMap.get(USER_BOB_EMAIL)!}, ${INSTANCE_B_ID}::uuid, 'operator'),
.\apps\spike-e\src\seed.ts:34:        (${userMap.get(USER_DAVE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'legal-reviewer'),
.\apps\spike-e\src\seed.ts:35:        (${userMap.get(USER_EVE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'legal-reviewer')
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1006:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2108:apps/web/src\seed.ts:75:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2109:apps/web/src\seed.ts:85:              legal_reviewer_eligible = false,
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2110:apps/web/src\seed.ts:106:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2111:apps/web/src\seed.ts:115:              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2117:apps/web/src\lib\deny-reason-map.ts:23:  "legal-reviewer-ineligible",
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2118:apps/web/src\lib\deny-reason-map.ts:71:    case "legal-reviewer-ineligible":
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2119:apps/web/src\lib\deny-reason-map.ts:110:    case "legal-reviewer-ineligible":
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2226:apps/web/src\seed.ts:1:// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2248:apps/web/src\seed.ts:102:      // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2430:apps/web/src\lib\page-context.ts:81:    // operator-role-required / *-ineligible → forbidden 처리
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2431:apps/web/src\lib\post-login-redirect.ts:1:// @glitzy/web/lib/post-login-redirect — first active operator membership instance slug (Plan v1.0 § 3.2)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2736:apps/web/src\app\api\site-meta-fetch\route.ts:3://   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2861:apps/web/src\app\sign-in\consume\route.ts:3:// + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3445:.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:839:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3446:.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:892:.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3477:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3492:.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\apps\web\src\seed.ts:1:// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
.\apps\web\src\seed.ts:75:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\apps\web\src\seed.ts:85:              legal_reviewer_eligible = false,
.\apps\web\src\seed.ts:86:              physician_reviewer_eligible = false,
.\apps\web\src\seed.ts:102:      // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
.\apps\web\src\seed.ts:106:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\apps\web\src\seed.ts:115:              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
.\apps\web\src\seed.ts:116:              physician_reviewer_eligible = EXCLUDED.physician_reviewer_eligible,
.\apps\web\src\seed.ts:140:             SET role = 'operator', updated_at = now()
.\apps\web\src\seed.ts:145:             SET role = 'operator',
.\apps\web\src\seed.ts:154:          SELECT ${uRow.id}::uuid, ${iRow.id}::uuid, 'operator', true
.\handoff\codex-reviews\eat-content-plan-v1\cycle-4.out.md:687:1187:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:398:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:3824: 444: type ApproverRole = "medical" | "legal" | "operator" | "client";
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:3833: 453: | `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:3873: 493: // ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:4026: 646: | ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:4041: 661: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6235: 729: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6326: 820: | `operatorId` | `string` | ✅ | operator 사용자 ID |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6335: 829: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6474: 968: | `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6475: 969: | `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6614:1108: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7102: 347:   assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7104: 349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7304: 549: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7412:  46: | `/sign-in/consume?identifier=<email>&token=…` | magic-link 소비 (identifier + token 둘 다 필요) + **admin_user lookup/active check** (allowlist 만 — 자동 INSERT 없음 · ADMIN-UI-75) + first active operator membership 검증 + createSession + cookie set | redirect to `/[instanceSlug]` |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7453:  87: > **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7545: 179:         WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7569: 203:      • assertActionEligibility(ctx, 'operator-edit-content')
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7659: 293: **Super-admin (ADMIN-UI-17)**: skeleton 은 operator membership 만 지원. super-admin 진입 시 `super-admin-required` throw → deny-reason-map 안내 페이지.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7710: 344: | `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7711: 345: | `operator-role-required` | 403 (운영자 권한 필요) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7822: 456:     assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7860: 494: - **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7920: 554:   INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7925: 559: // 2) instance + admin_user(operator) + instance_membership (모두 idempotent ON CONFLICT)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7927: 561: const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7939: 573:        SET role = 'operator',
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7948: 582:     SELECT ${userRow.id}::uuid, ${instanceRow.id}::uuid, 'operator', true
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7991: 625: 12. non-operator role 저장 → assertActionEligibility → `operator-role-required` → 403.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8002: 636: | 3 | `pnpm --filter @glitzy/web seed` PASS — **모든 sign-in 시도 전 필수 (ADMIN-UI-71 ordering)** | idempotent · SYSTEM_ACTOR + operator + instance + membership 생성. health check (/api/health) 가 SYSTEM_ACTOR 존재 검증. |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8021: 655: | W-07 | super-admin instance switch UI | skeleton 범위 외 — operator membership 만 지원 · cycle1 close |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8064: 698: | 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8070: 704: | 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8071: 705: | 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8135:  18:   legal_reviewer_eligible: boolean;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8136:  19:   physician_reviewer_eligible: boolean;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8196:  79:     SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8251: 134:     if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8252: 135:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8253: 136:       throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8255: 138:     if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8256: 139:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8257: 140:       throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8259: 142:     if (mem.role === "client-approver" && !user.client_approver_eligible) {
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8260: 143:       await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8261: 144:       throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8315: 198:   | "operator-publish" | "operator-unpublish" | "operator-edit-content";
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8323: 206:       if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8329: 212:       if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8334: 217:       if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8336: 219:     case "operator-publish":
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8337: 220:     case "operator-unpublish":
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8338: 221:     case "operator-edit-content":
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8339: 222:       if (ctx.role === "operator" || ctx.role === "super-admin") return;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8340: 223:       throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9521:661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\apps\spike-c-local\src\scenarios\test-list-bucket.ts:79:  // Case 1: A operator lists own prefix — seed/ subpath만 5개 명시
.\apps\spike-c-local\src\scenarios\test-list-bucket.ts:91:  // Case 2: A operator requests B prefix → helper denied
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2301:  731: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2392:  822: | `operatorId` | `string` | ✅ | operator 사용자 ID |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2401:  831: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2617: 1047: | `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2618: 1048: | `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2757: 1187: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:2873:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:19:  actorRole: "operator",
.\apps\spike-c-local\src\scenarios\invariant-runner.ts:31:        ctx: { instanceId: id, actorId: `actor-${id}`, actorRole: "operator" },
.\apps\spike-c-local\src\scenarios\invariant-runner.ts:52:        ctx: { instanceId: a, actorId: `actor-${a}`, actorRole: "operator" },
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:423:..\..\docs\compliance\RISK_LEVELS.md:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:436:..\..\docs\compliance\RISK_LEVELS.md:476:- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:448:..\..\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:449:..\..\docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:464:..\..\docs\admin\REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:466:..\..\docs\admin\REVIEW_WORKFLOW.md:215:finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:485:..\..\docs\admin\REVIEW_WORKFLOW.md:808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:488:..\..\docs\admin\REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:576:..\..\docs\core\CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:667:..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:671:..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:704:| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:837:..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:841:..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:845:..\..\docs\features\asset-ingestion.md:112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:867:..\..\docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:1536:C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:675: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:2658:C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:731: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:2749:C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:822: | `operatorId` | `string` | ✅ | operator 사용자 ID |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:2758:C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:831: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:2915:C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1187: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3370:| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3386:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3392:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3397:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3401:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3.out.md:3404:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\apps\spike-a\src\scenarios\test-negative.ts:115:        actorRole: "operator", // 비허용
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:313:| empty target deploy | targetCurrent=0인 경우 pre-drift skip·full apply + post-drift. **leftover guard scope** (11-class user-visible public objects): table·view·foreign_table·sequence·enum_or_composite_type·domain·range_type·function·policy·trigger·collation. **drift snapshot scope**: 현재 definition-aware schema feature scope (table·constraint·index·policy·view+reloptions·enum)에 한정 — empty guard와 drift snapshot은 의도적으로 다른 scope (empty guard는 partial poison 회피 위해 더 광범위, drift snapshot은 feature spec과 직접 연관된 schema 객체만). **본 spike scope 외** (PROVIDER_GATE — Day 8 staging에서 추가 검증·실 production schema에서 사용 시 별도 추가 검사): pg_operator·pg_opclass·pg_opfamily·pg_conversion·text search objects (pg_ts_config·pg_ts_dict·pg_ts_parser·pg_ts_template). |
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:358:2. instanceMembership: A는 instance-a operator
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:365:9. **legal-reviewer eligibility**: legal-reviewer 후보가 자격 미충족 → 차단
.\packages\shared-types\src\index.ts:16:export type TenantRole = "operator" | "physician-reviewer" | "legal-reviewer" | "client-approver";
.\packages\shared-types\src\index.ts:24:  | "operator-publish" | "operator-unpublish" | "operator-edit-content";
.\apps\spike-c-local\src\fixtures.ts:10:  actorId: "actor-a-operator",
.\apps\spike-c-local\src\fixtures.ts:11:  actorRole: "operator",
.\apps\spike-c-local\src\fixtures.ts:16:  actorId: "actor-b-operator",
.\apps\spike-c-local\src\fixtures.ts:17:  actorRole: "operator",
.\packages\auth\src\resolve-tenant-context.ts:18:  legal_reviewer_eligible: boolean;
.\packages\auth\src\resolve-tenant-context.ts:19:  physician_reviewer_eligible: boolean;
.\packages\auth\src\resolve-tenant-context.ts:79:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\packages\auth\src\resolve-tenant-context.ts:134:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
.\packages\auth\src\resolve-tenant-context.ts:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\packages\auth\src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\packages\auth\src\resolve-tenant-context.ts:138:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
.\packages\auth\src\resolve-tenant-context.ts:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\packages\auth\src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\packages\auth\src\resolve-tenant-context.ts:142:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
.\packages\auth\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\packages\auth\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
.\packages\auth\src\resolve-tenant-context.ts:198:  | "operator-publish" | "operator-unpublish" | "operator-edit-content";
.\packages\auth\src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
.\packages\auth\src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
.\packages\auth\src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
.\packages\auth\src\resolve-tenant-context.ts:219:    case "operator-publish":
.\packages\auth\src\resolve-tenant-context.ts:220:    case "operator-unpublish":
.\packages\auth\src\resolve-tenant-context.ts:221:    case "operator-edit-content":
.\packages\auth\src\resolve-tenant-context.ts:222:      if (ctx.role === "operator" || ctx.role === "super-admin") return;
.\packages\auth\src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
.\handoff\codex-reviews\eat-content-plan-v1\cycle-2.out.md:1150:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:17:    if (ctx.role !== "operator") throw new Error(`role: ${ctx.role}`);
.\apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:1:// Spike E — test-tenant-resolve-cross: A operator가 B 요청 → membership-not-found
.\docs\decisions\LOCATION_LEGAL_PLAN.md:347:  assertActionEligibility(ctx, "operator-edit-content");
.\docs\decisions\LOCATION_LEGAL_PLAN.md:349:  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
.\docs\decisions\LOCATION_LEGAL_PLAN.md:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:235:968:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:248:1108:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:677:..\..\docs\core\CONTENT_STANDARDS.md:661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:678:..\..\docs\compliance\RISK_LEVELS.md:7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:735:..\..\docs\compliance\RISK_LEVELS.md:712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:738:..\..\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:739:..\..\docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:1976:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:2130:661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:2271:100:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:2407:231:      assertActionEligibility(ctx, "operator-edit-content");
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:123:  // 3. legal eligibility (legal-reviewer는 추가 검증)
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:124:  if (membership.role === 'legal-reviewer') {
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:192:- **default**: 신규 instance는 `disabled` 상태로 생성. operator 검수 후 enable
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:195:- DPA·legalApproved 재승인 필수 → legal-reviewer 검수 흐름 진입
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:369:#### 4.5.1 legal-reviewer — 시간당 contract + fixed-scope package (INFRA2-10)
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:446:| 4-2. 베타·법무 | DPA·legal-reviewer Phase 1 시작 gate (fixed-scope package → 시간당 → retainer)·internal beta는 workflow validation 한정·외부 베타 1곳 M0 public gate·사전심의 manual-assisted·PIPA+GDPR checklist·customer domain ADR 별도 |
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\packages\auth\src\errors.ts:5:// M2 cycle2: physician/client/operator 분리·invalid-instance-id 명시
.\packages\auth\src\errors.ts:14:  | "legal-reviewer-ineligible"
.\packages\auth\src\errors.ts:15:  | "physician-reviewer-ineligible"
.\packages\auth\src\errors.ts:16:  | "client-approver-ineligible"
.\packages\auth\src\errors.ts:17:  | "operator-role-required"
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:27:- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + content-gate 큐 + multi-role AND 게이트 (operator·medical·legal).
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:40:| AND 게이트 평가 함수 | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅). priorReviewRequired는 M0 v0.1 false fixed |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:43:| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:95:  peer_reviewer UUID,                                       -- admin_user.id — operator 검수
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:129:  -- 모든 published 게이트: operator 슬롯 (peerReviewer) required
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:154:- (CA-SCHEMA-03) DB CHECK 4건 — published 게이트 의무. operator(peer) + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:290:export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:298:  const roles = new Set<ApproverRole>(["operator"]);
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:311:    if (role === "operator" && (record.peer_reviewer === null || record.peer_reviewed_at === null)) return false;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:416:- ComplianceRecord 슬롯 표시 (operator/medical/legal — 각 슬롯의 reviewer 이름 + timestamp)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:417:- 본인의 역할에 한해 approve/reject 폼 노출 (admin_user.physician_reviewer_eligible · legal_reviewer_eligible flag 확인)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:430:- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:466:- (CA-ACTION-03) `assertReviewerEligibility(ctx, role)` — admin_user flag 검증. operator 역할은 instance_membership.role='operator' · medical 은 physician_reviewer_eligible=true · legal 은 legal_reviewer_eligible=true.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:496:| 3 | LegalDocument draft → submitForReview → finalRoles=['operator', 'legal'] | LegalDocument 자동 추가 (Low 인데도 legal 필수) |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:497:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:498:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:505:| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:554:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker (content-gate 큐 + operator·medical·legal 만)
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:46:| `/sign-in/consume?identifier=<email>&token=…` | magic-link 소비 (identifier + token 둘 다 필요) + **admin_user lookup/active check** (allowlist 만 — 자동 INSERT 없음 · ADMIN-UI-75) + first active operator membership 검증 + createSession + cookie set | redirect to `/[instanceSlug]` |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:179:        WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:203:     • assertActionEligibility(ctx, 'operator-edit-content')
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:293:**Super-admin (ADMIN-UI-17)**: skeleton 은 operator membership 만 지원. super-admin 진입 시 `super-admin-required` throw → deny-reason-map 안내 페이지.
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:344:| `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:345:| `operator-role-required` | 403 (운영자 권한 필요) |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:456:    assertActionEligibility(ctx, "operator-edit-content");
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:494:- **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:554:  INSERT INTO admin_user (id, email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:559:// 2) instance + admin_user(operator) + instance_membership (모두 idempotent ON CONFLICT)
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:561:const [userRow] = await sqlBase`INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible) VALUES (${email}, ${displayName}, true, false, false, false, false) ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, active = EXCLUDED.active RETURNING id`;
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:573:       SET role = 'operator',
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:582:    SELECT ${userRow.id}::uuid, ${instanceRow.id}::uuid, 'operator', true
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:625:12. non-operator role 저장 → assertActionEligibility → `operator-role-required` → 403.
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:636:| 3 | `pnpm --filter @glitzy/web seed` PASS — **모든 sign-in 시도 전 필수 (ADMIN-UI-71 ordering)** | idempotent · SYSTEM_ACTOR + operator + instance + membership 생성. health check (/api/health) 가 SYSTEM_ACTOR 존재 검증. |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:655:| W-07 | super-admin instance switch UI | skeleton 범위 외 — operator membership 만 지원 · cycle1 close |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:704:| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:705:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:1:// Spike E — test-legal-reviewer-eligibility (cycle2: role='legal-reviewer')
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:15:    if (ctxDave.role !== "legal-reviewer") throw new Error(`Dave role: ${ctxDave.role}`);
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:22:      if (err instanceof TenantResolveError && err.reason === "legal-reviewer-ineligible") rejected = true;
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:27:    await sql`UPDATE admin_user SET legal_reviewer_eligible = true WHERE id = ${ue[0]!.id}`;
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:29:    if (ctxEve.role !== "legal-reviewer") throw new Error(`Eve promoted: ${ctxEve.role}`);
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:31:    await sql`UPDATE admin_user SET legal_reviewer_eligible = false WHERE id = ${ue[0]!.id}`;
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:33:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
.\apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:37:    console.log("\n✅ test-legal-reviewer-eligibility: PASS");
.\apps\spike-e\src\scenarios\test-invariant.ts:33:      await sql`INSERT INTO instance_membership (user_id, instance_id, role) VALUES (${userId}, ${ownInstance}::uuid, 'operator')`;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:23:- CA-GATE-01·02 finalRoles 계산 (operator + (Medium/High ? medical : ∅) + (LegalDocument ? legal : ∅) + priorReviewRequired ? legal) + publishable evaluator
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:43:- C0014 ComplianceRecord 풀 CHECK 4건 정합 — operator(peer) · Medium/High physician · LegalDocument legal · publishedAt+publishedBy
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:51:- finalRoles 계산 함수 — `operator` 전 콘텐츠 공통 (REVIEW_WORKFLOW § 4.1 정합)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:62:- assertReviewerEligibility — admin_user.physician_reviewer_eligible / legal_reviewer_eligible flag 존재 검증 (기존 schema 안 정합)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:68:- 액션 버튼 — "검수 요청" (draft|rejected) · "발행" (publishable + operator role)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:36:- CA-GATE-01·02 finalRoles 계산 (operator + (Medium/High ? medical : ∅) + (LegalDocument ? legal : ∅) + priorReviewRequired ? legal) + publishable evaluator
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:56:- C0014 ComplianceRecord 풀 CHECK 4건 정합 — operator(peer) · Medium/High physician · LegalDocument legal · publishedAt+publishedBy
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:64:- finalRoles 계산 함수 — `operator` 전 콘텐츠 공통 (REVIEW_WORKFLOW § 4.1 정합)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:75:- assertReviewerEligibility — admin_user.physician_reviewer_eligible / legal_reviewer_eligible flag 존재 검증 (기존 schema 안 정합)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:81:- 액션 버튼 — "검수 요청" (draft|rejected) · "발행" (publishable + operator role)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:148:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:149:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:153:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:193:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:261:| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:266:| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:285:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:286:| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:291:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:299:- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:342:finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:362:| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:376:| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:678:- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + content-gate 큐 + multi-role AND 게이트 (operator·medical·legal).
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:691:| AND 게이트 평가 함수 | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅). priorReviewRequired는 M0 v0.1 false fixed |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:694:| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:746:  peer_reviewer UUID,                                       -- admin_user.id — operator 검수
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:780:  -- 모든 published 게이트: operator 슬롯 (peerReviewer) required
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:805:- (CA-SCHEMA-03) DB CHECK 4건 — published 게이트 의무. operator(peer) + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:825:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:951:export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:959:  const roles = new Set<ApproverRole>(["operator"]);
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:972:    if (role === "operator" && (record.peer_reviewer === null || record.peer_reviewed_at === null)) return false;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1077:- ComplianceRecord 슬롯 표시 (operator/medical/legal — 각 슬롯의 reviewer 이름 + timestamp)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1078:- 본인의 역할에 한해 approve/reject 폼 노출 (admin_user.physician_reviewer_eligible · legal_reviewer_eligible flag 확인)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1091:- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1127:- (CA-ACTION-03) `assertReviewerEligibility(ctx, role)` — admin_user flag 검증. operator 역할은 instance_membership.role='operator' · medical 은 physician_reviewer_eligible=true · legal 은 legal_reviewer_eligible=true.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1155:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1156:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1157:| 3 | LegalDocument draft → submitForReview → finalRoles=['operator', 'legal'] | LegalDocument 자동 추가 (Low 인데도 legal 필수) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1158:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1159:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1166:| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1215:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker (content-gate 큐 + operator·medical·legal 만)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1429:[7m[0mdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`el[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1445:[7m[0m·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1460:> docs\compliance\RISK_LEVELS.md:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer 
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1586:> docs\compliance\RISK_LEVELS.md:237:| `[7mrequiredApproverRoles[0m[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1612:[7m[0m  docs\compliance\RISK_LEVELS.md:286:| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1665:> docs\compliance\RISK_LEVELS.md:476:- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1672:[7m[0mal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1768:[7m[0mrRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1770:[7m[0m  docs\compliance\RISK_LEVELS.md:601:| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1772:[7m[0m  docs\compliance\RISK_LEVELS.md:602:| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1773:> docs\compliance\RISK_LEVELS.md:603:| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 [7mHigh[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1775:> docs\compliance\RISK_LEVELS.md:604:| 기타 [7mHigh[0m explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1783:[7m[0m  docs\compliance\RISK_LEVELS.md:609:- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1792:  docs\compliance\RISK_LEVELS.md:639:    checkedBy: "operator:seokcess@glitzy.kr"
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1822:[7m[0m파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inline[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1857:[7m[0m 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구[0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1867:[7m[0m추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator [0m
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1885:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin_user|physician_reviewer|legal_reviewer|approverRoleEligibility|legalReviewer|physician|instance_membership|reviewer" packages/core-content/src/schema.ts apps/web/src/lib/action-context.ts' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1908:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1927:40:| AND 게이트 평가 함수 | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅). priorReviewRequired는 M0 v0.1 false fixed |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1958:174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1969:290:export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1993:494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1994:495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2438:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2543:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "physician_reviewer_eligible|legal_reviewer_eligible|approverRoleEligibility|client-approver|physician-reviewer|legal-reviewer|operator" .' in C:\Users\assag\solution\website-exposure
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:13:  "operator-publish", "operator-unpublish", "operator-edit-content",
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:31:      if (action.startsWith("operator-")) continue;
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:41:    // Case 2: Carol→operator actions: OK (super-admin role)
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:42:    for (const action of ALL_ACTIONS.filter((a) => a.startsWith("operator-"))) {
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:45:    console.log("[action-eligibility] case-2 Carol→operator actions: 3 PASS");
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:47:    // Case 3: Dave (legal-reviewer eligible)
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:71:    await sql`UPDATE admin_user SET legal_reviewer_eligible = true, physician_reviewer_eligible = true, client_approver_eligible = true WHERE id = ${uc[0]!.id}`;
.\apps\spike-e\src\scenarios\test-action-eligibility.ts:77:    await sql`UPDATE admin_user SET legal_reviewer_eligible = false, physician_reviewer_eligible = false, client_approver_eligible = false WHERE id = ${uc[0]!.id}`;
.\apps\spike-e\src\fixtures.ts:10:export const USER_DAVE_EMAIL = "dave-legal-reviewer@example.com";
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:538:   42:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:635:  139:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:1501:   31:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:1664:  111:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:1834:  281:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:2886:   34:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:2970:   42:       assertActionEligibility(ctx, "operator-edit-content");
.\apps\spike-e\src\resolve-tenant-context.ts:5://   - SPIKEE1-004: role enum SoT (operator·physician-reviewer·legal-reviewer·client-approver)
.\apps\spike-e\src\resolve-tenant-context.ts:16:export type TenantRole = "operator" | "physician-reviewer" | "legal-reviewer" | "client-approver";
.\apps\spike-e\src\resolve-tenant-context.ts:24:  legal_reviewer_eligible: boolean;
.\apps\spike-e\src\resolve-tenant-context.ts:25:  physician_reviewer_eligible: boolean;
.\apps\spike-e\src\resolve-tenant-context.ts:87:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\apps\spike-e\src\resolve-tenant-context.ts:142:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
.\apps\spike-e\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\apps\spike-e\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\apps\spike-e\src\resolve-tenant-context.ts:146:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
.\apps\spike-e\src\resolve-tenant-context.ts:147:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\apps\spike-e\src\resolve-tenant-context.ts:148:      throw new TenantResolveError("legal-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\apps\spike-e\src\resolve-tenant-context.ts:150:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
.\apps\spike-e\src\resolve-tenant-context.ts:151:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\apps\spike-e\src\resolve-tenant-context.ts:152:      throw new TenantResolveError("legal-reviewer-ineligible", "client-approver role requires eligibility flag");
.\apps\spike-e\src\resolve-tenant-context.ts:203: *  - legal-review-*  → legal_reviewer_eligible
.\apps\spike-e\src\resolve-tenant-context.ts:204: *  - physician-review-* → physician_reviewer_eligible
.\apps\spike-e\src\resolve-tenant-context.ts:206: *  - operator-*  → 모든 operator membership 가능 (eligibility flag 없음)
.\apps\spike-e\src\resolve-tenant-context.ts:207: *  - publish/unpublish/delegate → role 기반 (super-admin or admin or operator)
.\apps\spike-e\src\resolve-tenant-context.ts:226:  | "operator-publish"
.\apps\spike-e\src\resolve-tenant-context.ts:227:  | "operator-unpublish"
.\apps\spike-e\src\resolve-tenant-context.ts:228:  | "operator-edit-content";
.\apps\spike-e\src\resolve-tenant-context.ts:237:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
.\apps\spike-e\src\resolve-tenant-context.ts:243:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
.\apps\spike-e\src\resolve-tenant-context.ts:248:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires client_approver_eligible`);
.\apps\spike-e\src\resolve-tenant-context.ts:250:    case "operator-publish":
.\apps\spike-e\src\resolve-tenant-context.ts:251:    case "operator-unpublish":
.\apps\spike-e\src\resolve-tenant-context.ts:252:    case "operator-edit-content":
.\apps\spike-e\src\resolve-tenant-context.ts:253:      if (ctx.role === "operator" || ctx.role === "super-admin") return;
.\apps\spike-e\src\resolve-tenant-context.ts:254:      throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires operator/super-admin role`);
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2315:handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:398:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2496:handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:385:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2912:handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:169:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:33:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:3846:handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:440:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:4631:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:7712:apps/web/src\seed.ts:1:// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
.\apps\spike-e\src\errors.ts:10:  | "legal-reviewer-ineligible"
.\handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:385:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:230:docs/core/CONTENT_STANDARDS.md:507:// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:254:docs/core/CONTENT_STANDARDS.md:660:| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:261:docs/core/CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:336:docs/core/DATA_MODEL.md:1047:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:337:docs/core/DATA_MODEL.md:1048:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:2077: 129:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:2124:  42:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:2166: 111:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3273:   1: // @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3347:  75:           legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3357:  85:               legal_reviewer_eligible = false,
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3358:  86:               physician_reviewer_eligible = false,
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3374: 102:       // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3378: 106:           legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3387: 115:               legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3388: 116:               physician_reviewer_eligible = EXCLUDED.physician_reviewer_eligible,
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3412: 140:              SET role = 'operator', updated_at = now()
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3417: 145:              SET role = 'operator',
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3426: 154:           SELECT ${uRow.id}::uuid, ${iRow.id}::uuid, 'operator', true
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3559:  34:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3643:  42:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:3976: 148:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4045: 140:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4105:packages\auth\src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4106:packages\auth\src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4107:packages\auth\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4108:packages\auth\src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4109:packages\auth\src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4110:packages\auth\src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:4111:packages\auth\src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1177:apps/web/src\seed.ts:75:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1178:apps/web/src\seed.ts:85:              legal_reviewer_eligible = false,
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1179:apps/web/src\seed.ts:106:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1180:apps/web/src\seed.ts:115:              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1209:apps/web/src\lib\deny-reason-map.ts:23:  "legal-reviewer-ineligible",
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1210:apps/web/src\lib\deny-reason-map.ts:71:    case "legal-reviewer-ineligible":
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1211:apps/web/src\lib\deny-reason-map.ts:110:    case "legal-reviewer-ineligible":
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4460:   3: // + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
.\handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4580: 123:       payload: { identifier: normalizedIdentifier, reason: "no-active-operator-membership" },
.\apps\spike-e\package.json:22:    "scenario:legal-reviewer-eligibility": "tsx --env-file=.env src/scenarios/test-legal-reviewer-eligibility.ts",
.\apps\spike-e\package.json:30:    "scenario:all": "pnpm migrate && pnpm seed && pnpm scenario:magic-link-login && pnpm scenario:tenant-resolve-own && pnpm scenario:tenant-resolve-cross && pnpm scenario:client-tampering && pnpm scenario:membership-removal && pnpm scenario:inactive-user && pnpm scenario:super-admin-switch && pnpm scenario:legal-reviewer-eligibility && pnpm scenario:session-refresh && pnpm scenario:rls-integration && pnpm scenario:action-eligibility && pnpm scenario:invalid-instance-id && pnpm scenario:adapter-smoke && pnpm scenario:invariant"
.\docs\core\DATA_MODEL.md:731:| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
.\docs\core\DATA_MODEL.md:822:| `operatorId` | `string` | ✅ | operator 사용자 ID |
.\docs\core\DATA_MODEL.md:831:| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
.\docs\core\DATA_MODEL.md:1047:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
.\docs\core\DATA_MODEL.md:1048:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
.\docs\core\DATA_MODEL.md:1187:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
.\apps\web\src\lib\post-login-redirect.ts:1:// @glitzy/web/lib/post-login-redirect — first active operator membership instance slug (Plan v1.0 § 3.2)
.\apps\web\src\lib\post-login-redirect.ts:24:       AND m.role = 'operator'
.\apps\web\src\lib\post-login-redirect.ts:37:        payload: { reason: "no-active-operator-membership" },
.\docs\core\CONTENT_STANDARDS.md:458:type ApproverRole = "medical" | "legal" | "operator" | "client";
.\docs\core\CONTENT_STANDARDS.md:467:| `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
.\docs\core\CONTENT_STANDARDS.md:507:// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
.\docs\core\CONTENT_STANDARDS.md:660:| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
.\docs\core\CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\apps\web\src\lib\deny-reason-map.ts:23:  "legal-reviewer-ineligible",
.\apps\web\src\lib\deny-reason-map.ts:24:  "physician-reviewer-ineligible",
.\apps\web\src\lib\deny-reason-map.ts:25:  "client-approver-ineligible",
.\apps\web\src\lib\deny-reason-map.ts:26:  "operator-role-required",
.\apps\web\src\lib\deny-reason-map.ts:71:    case "legal-reviewer-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:72:    case "physician-reviewer-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:73:    case "client-approver-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:75:    case "operator-role-required":
.\apps\web\src\lib\deny-reason-map.ts:110:    case "legal-reviewer-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:111:    case "physician-reviewer-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:112:    case "client-approver-ineligible":
.\apps\web\src\lib\deny-reason-map.ts:113:    case "operator-role-required":
.\apps\web\src\lib\page-context.ts:38:  action: ActionType = "operator-edit-content",
.\apps\web\src\lib\page-context.ts:81:    // operator-role-required / *-ineligible → forbidden 처리
.\apps\spike-e\migrations\002_admin_user.sql:3:--   - SPIKEE1-004: role enum SoT (REVIEW_WORKFLOW) 정합 — operator·physician-reviewer·legal-reviewer·client-approver
.\apps\spike-e\migrations\002_admin_user.sql:13:  legal_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
.\apps\spike-e\migrations\002_admin_user.sql:14:  physician_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
.\apps\spike-e\migrations\002_admin_user.sql:33:  CONSTRAINT instance_membership_role_check CHECK (role IN ('operator', 'physician-reviewer', 'legal-reviewer', 'client-approver')),
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md:49:- assertActionEligibility('operator-edit-content')
.\apps\web\README.md:14:- `/sign-in/consume?identifier=&token=` → admin_user lookup → first active operator membership 검증 → 세션 발급
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:62:- assertActionEligibility('operator-edit-content')
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:185:docs\features\asset-ingestion.md:112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:195:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:302:docs\decisions\LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:392:docs\core\CONTENT_STANDARDS.md:646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:404:docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:437:docs\admin\REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:1602: 138:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:1839: 123:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3482:docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3769:   3: //   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3893: 127:     assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3895: 129:     const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4083:docs/decisions/ADMIN_UI_SKELETON_PLAN.md:702:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4128: 344: | `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4129: 345: | `operator-role-required` | 403 (운영자 권한 필요) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4223:646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4235: 347:   assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4237: 349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4675: 438: | `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4715: 478: // ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:309:  349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:355:  548: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:2907:  157:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:3138:  123:         assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:3886:  157:       assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:4968:  548: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:133:docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:152:packages\auth\src\resolve-tenant-context.ts:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:153:packages\auth\src\resolve-tenant-context.ts:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:154:packages\auth\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:169:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:33:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:180:apps\spike-e\src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:181:apps\spike-e\src\resolve-tenant-context.ts:147:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:182:apps\spike-e\src\resolve-tenant-context.ts:151:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:203:packages\auth\dist\resolve-tenant-context.js:103:            await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:204:packages\auth\dist\resolve-tenant-context.js:107:            await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:205:packages\auth\dist\resolve-tenant-context.js:111:            await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:265:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:592:packages/auth/src\resolve-tenant-context.ts:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:593:packages/auth/src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:594:packages/auth/src\resolve-tenant-context.ts:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:595:packages/auth/src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:596:packages/auth/src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:597:packages/auth/src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:601:packages/auth/src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:602:packages/auth/src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:603:packages/auth/src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:604:packages/auth/src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:629:apps/web/src\app\api\site-meta-fetch\route.ts:3://   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:636:apps/web/src\app\api\site-meta-fetch\route.ts:127:    assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:637:apps/web/src\app\api\site-meta-fetch\route.ts:129:    const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:650:apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:103:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:653:apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:202:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:659:apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:100:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:662:apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:231:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:669:apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:123:        assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:679:apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:157:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:690:apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:701:apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:707:apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:92:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:710:apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:196:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:726:apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:33:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:737:apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:748:apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:759:apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:776:apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:798:18:  legal_reviewer_eligible: boolean;
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:799:19:  physician_reviewer_eligible: boolean;
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:859:79:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:914:134:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:915:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:916:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:918:138:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:919:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:920:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:922:142:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:923:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:924:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:990:38:  action: ActionType = "operator-edit-content",
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1033:81:    // operator-role-required / *-ineligible → forbidden 처리
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1053:71:    case "legal-reviewer-ineligible":
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1054:72:    case "physician-reviewer-ineligible":
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1055:73:    case "client-approver-ineligible":
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1057:75:    case "operator-role-required":
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1091:apps/web/src\app\api\site-meta-fetch\route.ts:3://   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:1106:157:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\scripts\local-pass.ts:72:    const hasCtx = dashBody.includes("op@example.com") && dashBody.includes("operator");
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:440:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:757:.\docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:813:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:195:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:822:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:404:docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:838:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3482:docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:839:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:889:.\docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:892:.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:911:.\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:938:.\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
.\apps\web\src\app\api\site-meta-fetch\route.ts:3://   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
.\apps\web\src\app\api\site-meta-fetch\route.ts:127:    assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\api\site-meta-fetch\route.ts:129:    const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
.\apps\web\src\app\sign-in\consume\route.ts:3:// + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
.\apps\web\src\app\sign-in\consume\route.ts:123:      payload: { identifier: normalizedIdentifier, reason: "no-active-operator-membership" },
.\apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:157:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:123:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:43:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:140:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:42:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:43:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:147:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\page.tsx:37:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx:34:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\categories\[slug]\page.tsx:31:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:103:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:202:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:36:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:111:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:281:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\categories\page.tsx:38:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:42:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:139:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\page.tsx:38:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:92:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:196:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:33:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx:30:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:34:      assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx:34:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:42:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:148:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\publications\page.tsx:38:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx:30:        assertActionEligibility(ctx, "operator-edit-content");
.\apps\web\src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx:34:        assertActionEligibility(ctx, "operator-edit-content");

 succeeded in 691ms:
apps\spike-a\migrations\003_audit_log.sql:11:  actor_role TEXT NOT NULL,
apps\spike-a\migrations\003_audit_log.sql:20:-- RLS enable (FORCE 미적용 — super-user는 RLS bypass로 service-role outcome update 가능)
apps\spike-a\migrations\003_audit_log.sql:21:-- SPIKEA2-002: service-role outcome update를 위해 audit_log는 FORCE 미적용
packages\migrations-runner\src\manifest.ts:15:  readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
packages\migrations-runner\src\manifest.ts:49:  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
packages\migrations-runner\src\manifest.ts:103:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages\migrations-runner\src\index.ts:9://   - service-role-emit.ts (audit_event 1:1 per migration)
apps\spike-a\migrations\001_roles.sql:1:-- Spike A — migration 001: roles + pgcrypto
packages\auth\src\session.ts:1:// @glitzy/auth/session — PUBLIC API (signed token only)
packages\auth\src\session.ts:25:function signSessionToken(opaque: string, authSecret: string): string {
packages\auth\src\session.ts:26:  const sig = createHmac("sha256", authSecret).update(opaque).digest("base64url");
packages\auth\src\session.ts:30:function verifySessionTokenSignature(signedToken: string, authSecret: string): string | null {
packages\auth\src\session.ts:35:  const expectedSig = createHmac("sha256", authSecret).update(opaque).digest("base64url");
packages\auth\src\session.ts:58:  return { signedToken: signSessionToken(opaque, cfg.authSecret), row: rows[0]! };
packages\auth\src\session.ts:66:  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
packages\auth\src\session.ts:81:  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
packages\auth\src\session.ts:88:  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
packages\auth\src\session.ts:101:  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
packages\auth\src\resolve-tenant-context.ts:1:// @glitzy/auth/resolve-tenant-context — server-side 매 요청 재검증
packages\auth\src\resolve-tenant-context.ts:27:  readonly role: EffectiveRole;
packages\auth\src\resolve-tenant-context.ts:33:type MembershipRow = { id: string; instance_id: string; role: TenantRole; active: boolean };
packages\auth\src\resolve-tenant-context.ts:80:    FROM admin_user WHERE id = ${session.userId}
packages\auth\src\resolve-tenant-context.ts:119:      SELECT id, instance_id, role, active FROM instance_membership
packages\auth\src\resolve-tenant-context.ts:132:    effectiveRole = mem.role;
packages\auth\src\resolve-tenant-context.ts:134:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
packages\auth\src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:138:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
packages\auth\src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:142:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
packages\auth\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:159:    payload: { role: effectiveRole, isSuperAdmin: user.is_super_admin },
packages\auth\src\resolve-tenant-context.ts:166:    role: effectiveRole,
packages\auth\src\resolve-tenant-context.ts:222:      if (ctx.role === "operator" || ctx.role === "super-admin") return;
packages\auth\src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
packages\db\src\service-role.ts:1:// @glitzy/db/service-role — break-glass with pending audit + branded ServiceRoleTx
packages\db\src\service-role.ts:12:const SERVICE_ROLE_BRAND = Symbol("@glitzy/db/service-role");
packages\db\src\service-role.ts:56:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
packages\db\src\service-role.ts:60:        'service_role',
packages\db\src\service-role.ts:61:        ${`service-role-invoked:${ctx.function}:pending`},
packages\db\src\service-role.ts:95:      SET action = ${`service-role-invoked:${ctx.function}:${outcome}`},
apps\spike-c-local\src\tenant-context.ts:20:  readonly actorRole: "operator" | "admin" | "service_role";
apps\spike-c-local\src\tenant-context.ts:121: * service_role bypass — cross-instance copy 등 명시 의도.
apps\spike-c-local\src\tenant-context.ts:123: * canonical parsing은 동일 강제 — service_role도 malformed key는 거부.
apps\spike-c-local\src\tenant-context.ts:126:  if (ctx.actorRole !== "service_role") {
packages\auth\src\magic-link.ts:1:// @glitzy/auth/magic-link — atomic CAS·SHA-256·NFC normalize·EMAIL_REGEX
apps\spike-a\src\tenant.ts:41:    // SPIKEA1-005: connection level role을 명시 강제 (DSN 오배선 시 transaction 안에서만 적용)
packages\db\src\index.ts:16:} from "./service-role.js";
apps\spike-c-local\src\storage-client.ts:2:// SPIKEC1-010 cycle2: root/instance-principal/service-role 분리. instancePrincipal은 per-instance credential.
apps\spike-c-local\src\storage-client.ts:9:export type S3ClientKind = "root" | "instance-a" | "instance-b" | "service-role";
apps\spike-c-local\src\storage-client.ts:30:// service-role은 root credential 재사용 — local에서는 break-glass 구분만 의미
apps\spike-c-local\src\storage-client.ts:31:// production R2에서는 별도 IAM role STS credential 필요 (PROVIDER_REQUIRED marker)
apps\spike-a\src\service-role.ts:1:// Spike A — service_role break-glass + audit
apps\spike-a\src\service-role.ts:44: * service_role 함수의 표준 wrapper.
apps\spike-a\src\service-role.ts:71:      INSERT INTO audit_log (id, instance_id, actor_id, actor_role, action, metadata)
apps\spike-a\src\service-role.ts:77:        'service-role-invoked',
apps\spike-a\src\service-role.ts:133:    throw new BreakGlassError(`service-role function not allowlisted: ${serviceRoleFunction}`);
apps\spike-a\src\service-role.ts:136:    throw new BreakGlassError(`actorRole not allowed for service-role: ${ctx.actorRole}`);
apps\spike-a\src\service-role.ts:153:// 그러나 service-role connection은 BYPASSRLS=true (postgres super-user) 또는 service-role role
apps\spike-a\src\service-role.ts:154:// 본 prototype은 postgres super-user를 service-role로 사용 — outcome update 허용
apps\spike-a\src\service-role.ts:155:// 본 구현에서는 audit_log에 service-role 전용 update policy 필요 (별도 spec)
packages\db\src\errors.ts:25:    super(`service_role function '${attempted}' not allowed; allowed: ${allowed.join(",")}`);
apps\spike-d\src\service-role.ts:1:// Spike D — service_role guard·forward-only hotfix 승인
apps\spike-a\src\seed.ts:31:    INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
packages\storage\src\tenant-context.ts:2:// M1 cycle2: UUID_V4_REGEX from @glitzy/shared-types — auth와 일관·v4 strict
packages\storage\src\tenant-context.ts:15:  readonly actorRole: "operator" | "admin" | "service_role";
packages\storage\src\tenant-context.ts:64:  if (ctx.actorRole !== "service_role") throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
apps\spike-a\src\schema.ts:16:  actorRole: text("actor_role").notNull(),
packages\storage\src\storage-client.ts:1:// @glitzy/storage/storage-client — S3Client factory (root·instance principal·service-role)
packages\core-content\src\schema.ts:219:    authorDoctorId: uuid("author_doctor_id"),
packages\core-content\src\schema.ts:240:    authorIdx: index("article_author_idx")
packages\core-content\src\schema.ts:241:      .on(t.instanceId, t.authorDoctorId)
packages\core-content\src\schema.ts:242:      .where(sql`${t.authorDoctorId} IS NOT NULL`),
packages\core-content\src\schema.ts:245:    authorFk: foreignKey({
packages\core-content\src\schema.ts:246:      columns: [t.instanceId, t.authorDoctorId],
packages\core-content\src\schema.ts:248:      name: "article_author_fk",
packages\core-content\src\schema.ts:357://   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
packages\core-content\src\schema.ts:366:    authors: jsonb("authors").notNull(),
packages\core-content\src\schema.ts:374:    authorDoctorId: uuid("author_doctor_id"),
packages\core-content\src\schema.ts:393:    authorsArray: check("publication_authors_array",
packages\core-content\src\schema.ts:394:      sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
packages\core-content\src\schema.ts:405:    authorIdx: index("publication_author_idx")
packages\core-content\src\schema.ts:406:      .on(t.instanceId, t.authorDoctorId)
packages\core-content\src\schema.ts:407:      .where(sql`${t.authorDoctorId} IS NOT NULL`),
packages\core-content\src\schema.ts:408:    authorDoctorFk: foreignKey({
packages\core-content\src\schema.ts:409:      columns: [t.instanceId, t.authorDoctorId],
packages\core-content\src\schema.ts:411:      name: "publication_author_doctor_fk",
packages\core-content\src\schema.ts:432:    authorDoctorId: uuid("author_doctor_id"),
packages\core-content\src\schema.ts:460:    authorIdx: index("media_appearance_author_idx")
packages\core-content\src\schema.ts:461:      .on(t.instanceId, t.authorDoctorId)
packages\core-content\src\schema.ts:462:      .where(sql`${t.authorDoctorId} IS NOT NULL`),
packages\core-content\src\schema.ts:463:    authorDoctorFk: foreignKey({
packages\core-content\src\schema.ts:464:      columns: [t.instanceId, t.authorDoctorId],
packages\core-content\src\schema.ts:466:      name: "media_appearance_author_doctor_fk",
packages\core-content\src\schema.ts:486:    authorDoctorId: uuid("author_doctor_id"),
packages\core-content\src\schema.ts:518:    authorDoctorFk: foreignKey({
packages\core-content\src\schema.ts:519:      columns: [t.instanceId, t.authorDoctorId],
packages\core-content\src\schema.ts:521:      name: "faq_author_doctor_fk",
packages\auth\src\internal\session-internal.ts:1:// @glitzy/auth/internal/session-internal — INTERNAL ONLY
apps\spike-e\src\session.ts:2://   - SPIKEE1-003: next-auth Drizzle adapter table·column names ("session"·"verificationToken")
packages\auth\src\index.ts:1:// @glitzy/auth — Spike E LOCAL_PASS 패턴 production module (v0.2)
apps\spike-e\src\seed.ts:1:// Spike E — seed (cycle2 patch: role enum SoT 정합)
apps\spike-e\src\seed.ts:16:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps\spike-e\src\seed.ts:19:      INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
apps\spike-e\src\seed.ts:31:      INSERT INTO instance_membership (user_id, instance_id, role) VALUES
apps\spike-e\src\seed.ts:38:    console.log(`[seed] ${inserted.length} users + 4 memberships inserted`);
packages\auth\src\errors.ts:1:// @glitzy/auth — domain errors
packages\auth\src\errors.ts:17:  | "operator-role-required"
packages\storage\src\audit-log.ts:23:  "authorization:", "aws_access_key", "aws_secret_key", "secret_access_key", "access_token", "bearer ",
packages\auth\src\config.ts:1:// @glitzy/auth — config object (env에 직접 의존 안 함·caller가 주입)
packages\auth\src\config.ts:5:  readonly authSecret: string;
packages\auth\src\config.ts:17:  if (cfg.authSecret.length < 32) throw new Error("authSecret must be at least 32 chars");
packages\auth\src\audit.ts:1:// @glitzy/auth — audit_event insert helper
apps\spike-d\migrations\004_audit_log.sql:7:  actor_role TEXT NOT NULL,
packages\db\migrations\D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
packages\db\migrations\D0011_public_reader.sql:4:-- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
packages\db\migrations\D0011_public_reader.sql:9:-- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
packages\db\migrations\D0011_public_reader.sql:12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
apps\spike-d\migrations\003_instance_user_partial_unique.sql:8:  role TEXT NOT NULL,
packages\db\migrations\D0010_instance.sql:19:-- M0-15 cycle2: instance는 control-plane table — super-admin·service_role만 접근
packages\db\migrations\D0010_instance.sql:21:-- RLS 적용 후 tenant role read는 NULLIF wrapping
packages\db\migrations\D0010_instance.sql:29:-- super_admin·service_role은 explicit role grant·tenant role은 SELECT 만 부여
apps\spike-d\migrations\001_roles_and_extensions.sql:1:-- Spike D — migration 001: roles + extensions (raw SQL — Drizzle Kit canonical 미지원)
apps\spike-d\migrations\001_roles_and_extensions.sql:2:-- SPIKED1-pending: custom role·extension은 Drizzle Kit canonical 외 raw SQL mixin
apps\spike-d\migrations\001_roles_and_extensions.sql:7:-- Custom roles (Spike A 패턴 재사용)
apps\spike-d\migrations\001_roles_and_extensions.sql:11:  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_tenant_user') THEN
apps\spike-d\migrations\001_roles_and_extensions.sql:17:-- migration_audit role (audit_log 전용 insert 권한)
apps\spike-d\migrations\001_roles_and_extensions.sql:20:  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migration_runner') THEN
apps\spike-d\migrations\007_tenant_audit_log_view.sql:7:SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at
apps\spike-d\migrations\005_migration_ledger.sql:11:  service_role_function TEXT NOT NULL,
apps\spike-d\migrations\006_audit_event.sql:1:-- Spike D — migration 006: audit_event (service-role-invoked 기록)
apps\spike-d\migrations\006_audit_event.sql:9:  actor_role TEXT NOT NULL,
apps\spike-d\migrations\006_audit_event.sql:10:  service_role_function TEXT,
packages\core-content\migrations\C0012_faq.sql:17:  author_doctor_id UUID,
packages\core-content\migrations\C0012_faq.sql:35:  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
apps\spike-d\src\scenarios\test-audit.ts:26:      SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'service-role-invoked'
apps\spike-d\src\scenarios\test-audit.ts:36:      SELECT payload FROM audit_event WHERE event_type = 'service-role-invoked' ORDER BY (payload->>'migrationId')::int
apps\spike-d\src\scenarios\test-audit.ts:48:    // Case 3: service_role_function == migrationRunner for all
apps\spike-d\src\scenarios\test-audit.ts:49:    const fns = await audSql<{ service_role_function: string; count: number }[]>`
apps\spike-d\src\scenarios\test-audit.ts:50:      SELECT service_role_function, COUNT(*)::int AS count
apps\spike-d\src\scenarios\test-audit.ts:51:      FROM audit_event WHERE event_type = 'service-role-invoked'
apps\spike-d\src\scenarios\test-audit.ts:52:      GROUP BY service_role_function
apps\spike-d\src\scenarios\test-audit.ts:54:    if (fns.length !== 1 || fns[0]!.service_role_function !== "migrationRunner") {
apps\spike-d\src\scenarios\test-audit.ts:55:      throw new Error(`[audit] case-3 expected single service_role_function='migrationRunner', got ${JSON.stringify(fns)}`);
apps\spike-d\src\scenarios\test-audit.ts:57:    console.log(`[audit] case-3 single service_role_function=migrationRunner (${fns[0]!.count}): PASS`);
packages\core-content\migrations\C0011_media_appearance.sql:20:  author_doctor_id UUID,
packages\core-content\migrations\C0011_media_appearance.sql:44:  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
packages\core-content\migrations\C0011_media_appearance.sql:52:CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
packages\core-content\migrations\C0011_media_appearance.sql:53:  WHERE author_doctor_id IS NOT NULL;
apps\web\src\seed.ts:6://   - WEB-20 instance_membership active/inactive 분기 lookup
apps\web\src\seed.ts:11:import { normalizeIdentifier } from "@glitzy/auth";
apps\web\src\seed.ts:73:        INSERT INTO admin_user (
apps\web\src\seed.ts:102:      // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
apps\web\src\seed.ts:104:        INSERT INTO admin_user (
apps\web\src\seed.ts:122:      if (!uRow) throw new Error("admin_user upsert returned no row");
apps\web\src\seed.ts:124:      // 4) instance_membership — cycle2-code WEB-20: active 우선 분기 lookup
apps\web\src\seed.ts:125:      //    (a) active row 존재 → UPDATE role only
apps\web\src\seed.ts:130:          SELECT id FROM instance_membership
apps\web\src\seed.ts:134:          SELECT id FROM instance_membership
apps\web\src\seed.ts:139:          UPDATE instance_membership
apps\web\src\seed.ts:140:             SET role = 'operator', updated_at = now()
apps\web\src\seed.ts:144:          UPDATE instance_membership
apps\web\src\seed.ts:145:             SET role = 'operator',
apps\web\src\seed.ts:153:          INSERT INTO instance_membership (user_id, instance_id, role, active)
packages\core-content\migrations\C0010_publication.sql:2:-- EC-SCHEMA-08·09·10: 외부 학술 인용 entity · authors[] min 1 NOT NULL (DEFAULT 제거) · risk_level Low fixed CHECK.
packages\core-content\migrations\C0010_publication.sql:11:  authors JSONB NOT NULL,                       -- cycle 1 ECP-18: DEFAULT 제거. authors min 1 CHECK 정합
packages\core-content\migrations\C0010_publication.sql:19:  author_doctor_id UUID,
packages\core-content\migrations\C0010_publication.sql:39:  CONSTRAINT publication_authors_array CHECK (
packages\core-content\migrations\C0010_publication.sql:40:    jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1
packages\core-content\migrations\C0010_publication.sql:48:  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
packages\core-content\migrations\C0010_publication.sql:56:CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
packages\core-content\migrations\C0010_publication.sql:57:  WHERE author_doctor_id IS NOT NULL;
apps\spike-d\src\scenarios\test-deploy-gate.ts:121:    await viewSql`CREATE VIEW tenant_audit_log_view AS SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at FROM audit_log WHERE instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid`;
apps\spike-d\src\migrate.ts:27:} from "./service-role.js";
apps\spike-d\src\migrate.ts:89:      service_role_function TEXT NOT NULL,
apps\spike-d\src\migrate.ts:108:      actor_role TEXT NOT NULL,
apps\spike-d\src\migrate.ts:109:      service_role_function TEXT,
apps\spike-d\src\migrate.ts:202:          INSERT INTO migration_ledger (id, filename, checksum, applied_by, service_role_function, target_db, duration_ms)
apps\spike-d\src\migrate.ts:207:          INSERT INTO audit_event (event_type, actor_id, actor_role, service_role_function, target_db, payload)
apps\spike-d\src\migrate.ts:208:          VALUES ('service-role-invoked', ${ctx.actorId}, 'service_role', ${ctx.function}, ${ctx.targetDb}, ${tx.json({
apps\spike-d\src\migrate.ts:267: * 단, custom role/extension은 schema-level 외 잔존 — 별도 explicit handling.
apps\spike-d\src\drift-check.ts:17:  readonly policies: ReadonlyArray<{ table: string; name: string; cmd: string; roles: string; qual: string | null; withCheck: string | null; permissive: string }>;
apps\spike-d\src\drift-check.ts:70:    const policies = await sql<{ table: string; name: string; cmd: string; roles: string; qual: string | null; withCheck: string | null; permissive: string }[]>`
apps\spike-d\src\drift-check.ts:75:        array_to_string(roles, ',') AS roles,
apps\spike-d\src\drift-check.ts:167:  // Policies (qual·withCheck·roles·cmd 비교)
apps\spike-d\src\drift-check.ts:177:      if (l.roles !== r.roles) diffs.push(`~ policy ${k} roles: ${l.roles} vs ${r.roles}`);
apps\spike-c-local\src\scenarios\test-list-bucket.ts:36:  if (ctx.actorRole !== "service_role") {
apps\spike-c-local\src\scenarios\test-list-bucket.ts:55:  const effective = ctx.actorRole === "service_role" ? requestedPrefix : instancePrefix(ctx.instanceId);
apps\spike-c-local\src\scenarios\test-list-bucket.ts:56:  // production helper에서는 instance principal 사용·여기서는 service-role 으로 통합 list (audit 위주)
apps\spike-c-local\src\scenarios\test-list-bucket.ts:101:  // Case 3: service_role bypass + audit — seed/ subpath만 명시
apps\spike-c-local\src\scenarios\test-list-bucket.ts:104:  if (svcSeedOnly.length !== 5) throw new Error(`service_role B seed/ should have 5 objects, got ${svcSeedOnly.length}`);
apps\spike-c-local\src\scenarios\test-list-bucket.ts:105:  console.log(`[list-bucket] app-3 service_role bypass: total=${svcAll.length}, seed/=${svcSeedOnly.length} (PASS)`);
apps\spike-d\src\scenarios\test-canonical-generation.ts:25:    expectedColumns: ["id", "instance_id", "user_id", "role", "active", "created_at"],
apps\spike-d\src\scenarios\test-canonical-generation.ts:30:    expectedColumns: ["id", "instance_id", "actor_id", "actor_role", "action", "content_ref", "metadata", "occurred_at"],
apps\spike-d\src\scenarios\test-canonical-generation.ts:35:    expectedColumns: ["id", "filename", "checksum", "applied_at", "applied_by", "service_role_function", "target_db", "duration_ms"],
apps\spike-d\src\scenarios\test-canonical-generation.ts:40:    expectedColumns: ["id", "event_type", "actor_id", "actor_role", "service_role_function", "target_db", "payload", "occurred_at"],
apps\spike-d\src\scenarios\test-canonical-generation.ts:86:  { label: "app_tenant_user role", rawFile: "001_roles_and_extensions.sql", mustContain: /CREATE\s+ROLE\s+app_tenant_user/i, note: "Drizzle Kit canonical 미지원" },
apps\spike-d\src\errors.ts:41:    super(`service_role function '${attemptedFunction}' not in allowed list: ${allowedFunctions.join(", ")}`);
apps\spike-a\src\scenarios\test-read.ts:34:  // C: service-role direct (RLS bypass) — 10건 모두
apps\spike-a\src\scenarios\test-read.ts:37:  results.push({ passed: total === 10, detail: `service-role total: ${total}` });
packages\shared-types\src\index.ts:15:/** Tenant role enum (REVIEW_WORKFLOW SoT 정합·Spike E cascade) */
packages\shared-types\src\index.ts:26:/** Service-role function enum (Spike A·service_role guard SoT) */
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:1:// Spike A — Scenario 0 (pre-flight): pgbouncer auth smoke
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:10:  console.log("pgbouncer auth smoke (DATABASE_URL_TENANT)");
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:19:  console.log(`pgbouncer-auth: ${isAppTenant ? "PASS" : "FAIL"}`);
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts:38:  { label: "reason: authorization header", field: "reason", mutator: (e) => ({ ...e, result: "denied" as const, reason: "header authorization: AWS4-HMAC-SHA256 ..." }) },
packages\core-content\migrations\C0005_article.sql:2:-- M0-05 cycle2: composite FK ON DELETE NO ACTION — author 삭제는 application layer 처리
packages\core-content\migrations\C0005_article.sql:16:  author_doctor_id UUID,
packages\core-content\migrations\C0005_article.sql:29:  CONSTRAINT article_author_fk FOREIGN KEY (instance_id, author_doctor_id)
packages\core-content\migrations\C0005_article.sql:37:CREATE INDEX article_author_idx ON article (instance_id, author_doctor_id) WHERE author_doctor_id IS NOT NULL;
apps\spike-a\src\scenarios\test-negative.ts:1:// Spike A — Scenario 7: negative tests (malformed UUID·scopedDb guard·SQL injection·env mistake·service-role guard)
apps\spike-a\src\scenarios\test-negative.ts:8:import { withServiceRole, BreakGlassError } from "../service-role.ts";
apps\spike-a\src\scenarios\test-negative.ts:84:  // 6. service-role break-glass guard — disallowed function
apps\spike-a\src\scenarios\test-negative.ts:106:    detail: `disallowed service-role function → BreakGlassError: ${m6.slice(0, 80) || "no error (FAIL)"}`,
apps\spike-a\src\scenarios\test-negative.ts:109:  // 7. service-role guard — disallowed actorRole
apps\spike-a\src\scenarios\test-negative.ts:134:  // 8. service-role guard — empty ticketRef
apps\spike-c-local\src\fixtures.ts:22:  actorId: "service-role-importer",
apps\spike-c-local\src\fixtures.ts:23:  actorRole: "service_role",
apps\spike-e\migrations\002_admin_user.sql:1:-- Spike E — 002: admin_user + instance_membership
apps\spike-e\migrations\002_admin_user.sql:3:--   - SPIKEE1-004: role enum SoT (REVIEW_WORKFLOW) 정합 — operator·physician-reviewer·legal-reviewer·client-approver
apps\spike-e\migrations\002_admin_user.sql:5:-- super-admin은 admin_user.is_super_admin flag로 별도 표현·membership row 부재
apps\spike-e\migrations\002_admin_user.sql:7:CREATE TABLE admin_user (
apps\spike-e\migrations\002_admin_user.sql:20:CREATE INDEX admin_user_email_idx ON admin_user (email);
apps\spike-e\migrations\002_admin_user.sql:21:CREATE INDEX admin_user_active_super_idx ON admin_user (active, is_super_admin);
apps\spike-e\migrations\002_admin_user.sql:23:CREATE TABLE instance_membership (
apps\spike-e\migrations\002_admin_user.sql:25:  user_id UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
apps\spike-e\migrations\002_admin_user.sql:27:  role TEXT NOT NULL,
apps\spike-e\migrations\002_admin_user.sql:30:  deactivated_by_user_id UUID REFERENCES admin_user(id),
apps\spike-e\migrations\002_admin_user.sql:33:  CONSTRAINT instance_membership_role_check CHECK (role IN ('operator', 'physician-reviewer', 'legal-reviewer', 'client-approver')),
apps\spike-e\migrations\002_admin_user.sql:34:  CONSTRAINT instance_membership_deactivated_consistency CHECK (
apps\spike-e\migrations\002_admin_user.sql:40:CREATE UNIQUE INDEX instance_membership_active_unique
apps\spike-e\migrations\002_admin_user.sql:41:  ON instance_membership (user_id, instance_id)
apps\spike-e\migrations\002_admin_user.sql:44:CREATE INDEX instance_membership_user_active_idx ON instance_membership (user_id, active);
apps\spike-e\migrations\002_admin_user.sql:45:CREATE INDEX instance_membership_instance_active_idx ON instance_membership (instance_id, active);
apps\spike-e\migrations\004_audit_event.sql:1:-- Spike E — 004: audit_event (instance-switched·tenant-resolved·magic-link 등 모든 auth event)
apps\spike-d\src\db\schema.ts:63:    role: text("role").notNull(),
apps\spike-d\src\db\schema.ts:82:    actorRole: text("actor_role").notNull(),
apps\spike-d\src\db\schema.ts:102:    serviceRoleFunction: text("service_role_function").notNull(),
apps\spike-d\src\db\schema.ts:111:// 5. audit_event — service-role-invoked
apps\spike-d\src\db\schema.ts:118:    actorRole: text("actor_role").notNull(),
apps\spike-d\src\db\schema.ts:119:    serviceRoleFunction: text("service_role_function"),
apps\spike-e\migrations\005_rls_test_table.sql:3:-- Spike A 패턴 reuse: NULLIF wrapping·FORCE ROW LEVEL SECURITY·app_tenant_user role
apps\spike-a\src\scenarios\test-audit.ts:1:// Spike A — Scenario 5: service-role + audit_log RLS·append-only
apps\spike-a\src\scenarios\test-audit.ts:9:import { withServiceRole } from "../service-role.ts";
apps\spike-a\src\scenarios\test-audit.ts:19:  // 1. service-role 사용 — audit log 1 invocation = 1 row (SPIKEA1-009)
apps\spike-a\src\scenarios\test-audit.ts:21:  // seed audit row 제외 위해 service-role-invoked만 카운트
apps\spike-a\src\scenarios\test-audit.ts:23:    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:45:    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:56:      SELECT instance_id FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-a\src\scenarios\test-audit.ts:94:  //    super-user는 BYPASSRLS 기본 — UPDATE/DELETE 모두 가능. layer 2 검증은 super-user 외 role이 GRANT 있는 case.
apps\spike-a\src\scenarios\test-audit.ts:95:  //    prototype에서는 layer 1 (GRANT denied)으로 충분 검증. layer 2 직접 검증은 별도 role 필요 (생략 — note만)
apps\spike-a\src\scenarios\test-audit.ts:96:  console.log("  note  layer 2 (RLS no-policy)는 별도 role 시 검증 가능. 본 prototype은 layer 1 강제로 충분");
apps\spike-a\src\scenarios\test-audit.ts:98:  // 5. cross-instance read 격리 (B context — service-role audit 자체는 A에 insert됐으니 B에서 안 보여야 함)
apps\spike-a\src\scenarios\test-audit.ts:101:      SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
apps\spike-e\migrations\003_auth_session.sql:1:-- Spike E — 003: next-auth Drizzle adapter compatible tables
apps\spike-e\migrations\003_auth_session.sql:2:-- cycle2 patch (SPIKEE1-003): next-auth/Auth.js Drizzle adapter v5 표준 정합
apps\spike-e\migrations\003_auth_session.sql:4:--   - user table은 admin_user로 대체 (Spike E 확장 필드 — is_super_admin·eligibility)
apps\spike-e\migrations\003_auth_session.sql:9:  "userId" UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:12:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:23:      { label: "SQL injection attempt", value: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'; DROP TABLE admin_user; --" },
apps\spike-e\src\scenarios\provider-smoke.ts:48:  // next-auth v5 표준: GET /api/auth/signin/email?email=<email>·CSRF token 필요
apps\spike-e\src\scenarios\provider-smoke.ts:51:    label: "auth signin page",
apps\spike-e\src\scenarios\provider-smoke.ts:53:    path: "/api/auth/signin",
apps\spike-e\src\scenarios\provider-smoke.ts:56:  console.log(`[provider-smoke] phase2 /api/auth/signin: ${signinPage.status} (PASS — endpoint exists)`);
apps\spike-e\src\scenarios\provider-smoke.ts:60:    label: "auth csrf",
apps\spike-e\src\scenarios\provider-smoke.ts:62:    path: "/api/auth/csrf",
apps\spike-e\src\scenarios\provider-smoke.ts:71:  console.log(`[provider-smoke] phase3 /api/auth/csrf: token=${csrfToken.slice(0, 8)}...·secure cookie set=${csrf.setCookie ? "yes" : "no"} (PASS)`);
apps\spike-e\src\scenarios\provider-smoke.ts:84:  const unauth = await probe({
apps\spike-e\src\scenarios\provider-smoke.ts:85:    label: "unauth protected",
apps\spike-e\src\scenarios\provider-smoke.ts:90:  console.log(`[provider-smoke] phase5 unauth protected: ${unauth.status} (PASS)`);
apps\spike-c-local\src\env.ts:26:  // root credential — bucket setup·service_role bypass·seed
apps\spike-e\src\scenarios\test-membership-removal.ts:13:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-membership-removal.ts:14:    const uCarol = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
apps\spike-e\src\scenarios\test-membership-removal.ts:18:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-membership-removal.ts:27:      UPDATE instance_membership
apps\spike-e\src\scenarios\test-membership-removal.ts:43:      SELECT deactivated_at, deactivated_by_user_id FROM instance_membership
apps\spike-e\src\scenarios\test-membership-removal.ts:52:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps\spike-e\src\scenarios\test-membership-removal.ts:60:      await sql`UPDATE instance_membership SET active = false, deactivated_at = now(), deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps\spike-e\src\scenarios\test-membership-removal.ts:62:      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v1 = true;
apps\spike-e\src\scenarios\test-membership-removal.ts:70:      await sql`UPDATE instance_membership SET active = true, deactivated_at = now(), deactivated_by_user_id = ${uCarol[0]!.id} WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps\spike-e\src\scenarios\test-membership-removal.ts:72:      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v2 = true;
apps\spike-e\src\scenarios\test-client-tampering.ts:14:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-a\src\scenarios\provider-smoke.ts:66:    // Phase 4: service_role audit pattern (super-user에서 audit insert·outcome update)
apps\spike-a\src\scenarios\provider-smoke.ts:68:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
apps\spike-a\src\scenarios\provider-smoke.ts:69:      VALUES (${INSTANCE_A}::uuid, 'provider-smoke', 'service_role', 'provider-smoke-test', '{}'::jsonb)
apps\spike-a\src\scenarios\provider-smoke.ts:73:    console.log("[provider-smoke] phase4 service_role audit pending pattern: PASS");
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:1:// Spike E — test-tenant-resolve-own: authorized request → context + audit
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:11:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:17:    if (ctx.role !== "operator") throw new Error(`role: ${ctx.role}`);
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:19:    console.log(`[tenant-resolve-own] ctx: user=${ctx.email} instance=${ctx.instanceId} role=${ctx.role} (PASS)`);
apps\spike-e\src\scenarios\test-inactive-user.ts:1:// Spike E — test-inactive-user: admin_user.active=false 후 모든 요청 reject
apps\spike-e\src\scenarios\test-inactive-user.ts:13:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-inactive-user.ts:14:    await sql`UPDATE instance_membership SET active = true WHERE user_id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-inactive-user.ts:15:    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-inactive-user.ts:22:    await sql`UPDATE admin_user SET active = false WHERE id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-inactive-user.ts:41:    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;
apps\spike-e\src\resolve-tenant-context.ts:4://   - SPIKEE1-003 cascade: next-auth schema column names
apps\spike-e\src\resolve-tenant-context.ts:5://   - SPIKEE1-004: role enum SoT (operator·physician-reviewer·legal-reviewer·client-approver)
apps\spike-e\src\resolve-tenant-context.ts:33:  readonly role: EffectiveRole;
apps\spike-e\src\resolve-tenant-context.ts:42:  role: TenantRole;
apps\spike-e\src\resolve-tenant-context.ts:88:    FROM admin_user WHERE id = ${session.userId}
apps\spike-e\src\resolve-tenant-context.ts:124:    effectiveRole = "super-admin";  // SPIKEE1-006: 별도 role·admin 자동 부여 안 함
apps\spike-e\src\resolve-tenant-context.ts:127:      SELECT id, instance_id, role, active FROM instance_membership
apps\spike-e\src\resolve-tenant-context.ts:140:    effectiveRole = mem.role;
apps\spike-e\src\resolve-tenant-context.ts:142:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
apps\spike-e\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:146:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
apps\spike-e\src\resolve-tenant-context.ts:148:      throw new TenantResolveError("legal-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:150:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
apps\spike-e\src\resolve-tenant-context.ts:152:      throw new TenantResolveError("legal-reviewer-ineligible", "client-approver role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:167:    payload: { role: effectiveRole, isSuperAdmin: user.is_super_admin },
apps\spike-e\src\resolve-tenant-context.ts:174:    role: effectiveRole,
apps\spike-e\src\resolve-tenant-context.ts:207: *  - publish/unpublish/delegate → role 기반 (super-admin or admin or operator)
apps\spike-e\src\resolve-tenant-context.ts:253:      if (ctx.role === "operator" || ctx.role === "super-admin") return;
apps\spike-e\src\resolve-tenant-context.ts:254:      throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires operator/super-admin role`);
apps\spike-e\src\magic-link.ts:2://   - SPIKEE1-003: next-auth table 이름 — "verificationToken"
apps\spike-c-local\src\audit-log.ts:21: *   - 일반 credential: authorization:, bearer , aws_access_key, aws_secret_key, access_token, secret_access_key
apps\spike-c-local\src\audit-log.ts:36:  "authorization:",
apps\spike-e\src\scenarios\test-magic-link-login.ts:50:    const userRows = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:19:    const ua = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:20:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${ua[0]!.id}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:21:    await sql`UPDATE admin_user SET active = true WHERE id = ${ua[0]!.id}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:23:    const uc = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:41:    // Case 2: Carol→operator actions: OK (super-admin role)
apps\spike-e\src\scenarios\test-action-eligibility.ts:48:    const ud = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_DAVE_EMAIL}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:71:    await sql`UPDATE admin_user SET legal_reviewer_eligible = true, physician_reviewer_eligible = true, client_approver_eligible = true WHERE id = ${uc[0]!.id}`;
apps\spike-e\src\scenarios\test-action-eligibility.ts:77:    await sql`UPDATE admin_user SET legal_reviewer_eligible = false, physician_reviewer_eligible = false, client_approver_eligible = false WHERE id = ${uc[0]!.id}`;
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:4:// LOCAL_SMOKE: next-auth/@auth/drizzle-adapter 실 import 시 npm 의존성 큼 → 본 spike는 schema shape만 검증.
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:49:    // Case 3: session.userId FK → admin_user.id (Auth.js user table 대체)
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:50:    // SPIKEE3-002 cycle4: column-specific FK (session."userId" → admin_user.id 정확히)
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:68:    if (fkOnly.src_col !== "userId" || fkOnly.ref_table !== "admin_user" || fkOnly.ref_col !== "id") {
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:69:      throw new Error(`session FK must be userId→admin_user.id, got ${JSON.stringify(fkOnly)}`);
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:71:    console.log(`[adapter-smoke] case-3 session."userId" → admin_user.id (single exact FK, PASS)`);
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:84:    console.log("ℹ️  PROVIDER_GATE (Day 10): next-auth + @auth/drizzle-adapter 실 import + magic link callback round-trip 검증 필수");
apps\spike-e\src\migrate.ts:30:      await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, "verificationToken", "session", instance_membership, admin_user, tenant_data CASCADE`;
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:12:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-b\migrations\001_roles.sql:1:-- Spike B — migration 001: roles + pgcrypto
apps\spike-a\src\db.ts:30:// service-role (postgres direct, RLS bypass)
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:1:// Spike E — test-legal-reviewer-eligibility (cycle2: role='legal-reviewer')
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:12:    const ud = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_DAVE_EMAIL}`;
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:15:    if (ctxDave.role !== "legal-reviewer") throw new Error(`Dave role: ${ctxDave.role}`);
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:16:    console.log(`[legal-eligibility] Dave eligible=true: role=${ctxDave.role} (PASS)`);
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:18:    const ue = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_EVE_EMAIL}`;
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:27:    await sql`UPDATE admin_user SET legal_reviewer_eligible = true WHERE id = ${ue[0]!.id}`;
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:29:    if (ctxEve.role !== "legal-reviewer") throw new Error(`Eve promoted: ${ctxEve.role}`);
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:31:    await sql`UPDATE admin_user SET legal_reviewer_eligible = false WHERE id = ${ue[0]!.id}`;
apps\spike-e\src\scenarios\test-invariant.ts:20:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps\spike-e\src\scenarios\test-invariant.ts:28:        INSERT INTO admin_user (email, display_name, active) VALUES (${email}, 'User '||${i}, true) RETURNING id
apps\spike-e\src\scenarios\test-invariant.ts:33:      await sql`INSERT INTO instance_membership (user_id, instance_id, role) VALUES (${userId}, ${ownInstance}::uuid, 'operator')`;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:3://   - SPIKEE1-006: super-admin role은 'super-admin'
apps\spike-e\src\scenarios\test-super-admin-switch.ts:14:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:33:    // Case 3: resolved A·role=super-admin
apps\spike-e\src\scenarios\test-super-admin-switch.ts:35:    if (ctxA.instanceId !== INSTANCE_A_ID || ctxA.role !== "super-admin") throw new Error(`ctxA: ${ctxA.instanceId} ${ctxA.role}`);
apps\spike-e\src\scenarios\test-super-admin-switch.ts:36:    console.log(`[super-admin-switch] case-3 resolved A role=super-admin (PASS)`);
apps\spike-e\src\scenarios\test-session-refresh.ts:1:// Spike E — test-session-refresh (cycle2: next-auth column names)
apps\spike-e\src\scenarios\test-session-refresh.ts:11:    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-session-refresh.ts:12:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-session-refresh.ts:13:    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;
apps\spike-e\src\scenarios\test-rls-integration.ts:12:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL`;
apps\spike-e\src\scenarios\test-rls-integration.ts:13:    await sql`UPDATE admin_user SET active = true`;
apps\spike-e\src\scenarios\test-rls-integration.ts:15:    const uAlice = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
apps\spike-e\src\scenarios\test-rls-integration.ts:16:    const uBob = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_BOB_EMAIL}`;
apps\web\src\lib\db.ts:23:    // Plan § 7: WEB_DATABASE_URL 최소 권한 + GRANT app_tenant_user TO <web_role> (NOINHERIT)
apps\web\src\lib\eat-content-schema.ts:133:const authorsSchema = z
apps\web\src\lib\eat-content-schema.ts:150:  authors: authorsSchema,
apps\web\src\lib\eat-content-schema.ts:174:  authorDoctorId: uuidOptional("저자(의료진)"),
apps\web\src\lib\eat-content-schema.ts:198:  authorDoctorId: uuidOptional("출연 의료진"),
apps\web\src\lib\eat-content-schema.ts:214:  authorDoctorId: uuidOptional("작성자(의료진)"),
apps\web\src\lib\action-context.ts:11:} from "@glitzy/auth";
apps\web\src\lib\action-context.ts:26: * Server Action 진입 공통 (auth + slug resolve).
apps\web\src\lib\deny-reason-map.ts:5:import type { AuthDenyReason } from "@glitzy/auth";
apps\web\src\lib\deny-reason-map.ts:26:  "operator-role-required",
apps\web\src\lib\deny-reason-map.ts:66:      // future-proof — packages/auth v0.3 cascade 시 분기 추가
apps\web\src\lib\deny-reason-map.ts:75:    case "operator-role-required":
apps\web\src\lib\deny-reason-map.ts:113:    case "operator-role-required":
apps\web\src\lib\db-projection.ts:71:  author_doctor_id: string | null;
apps\web\src\lib\db-projection.ts:169:  authorDoctorId: string | null;
apps\web\src\lib\db-projection.ts:329:    authorDoctorId: row.author_doctor_id,
apps\web\src\lib\db-projection.ts:370:  authors: unknown; // JSONB array of string
apps\web\src\lib\db-projection.ts:378:  author_doctor_id: string | null;
apps\web\src\lib\db-projection.ts:386:  authors: string[];
apps\web\src\lib\db-projection.ts:394:  authorDoctorId: string | null;
apps\web\src\lib\db-projection.ts:412:    authors: parseAuthors(row.authors),
apps\web\src\lib\db-projection.ts:420:    authorDoctorId: row.author_doctor_id,
apps\web\src\lib\db-projection.ts:436:  author_doctor_id: string | null;
apps\web\src\lib\db-projection.ts:451:  authorDoctorId: string | null;
apps\web\src\lib\db-projection.ts:467:    authorDoctorId: row.author_doctor_id,
apps\web\src\lib\db-projection.ts:480:  author_doctor_id: string | null;
apps\web\src\lib\db-projection.ts:492:  authorDoctorId: string | null;
apps\web\src\lib\db-projection.ts:505:    authorDoctorId: row.author_doctor_id,
apps\web\src\lib\env.ts:5:import { validateAuthConfig, type AuthConfig } from "@glitzy/auth";
apps\web\src\lib\env.ts:42:    authSecret: env.AUTH_SECRET,
apps\web\src\lib\env.ts:48:  // cycle1-code WEB-12: packages/auth.validateAuthConfig 호출 — refresh interval < session TTL 등 invariant 검증
apps\web\src\lib\errors.ts:47:  article_author_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
apps\web\src\lib\errors.ts:94:  publication_authors_array: { field: "authors", message: "저자는 1명 이상이어야 합니다." },
apps\web\src\lib\errors.ts:98:  publication_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
apps\web\src\lib\errors.ts:111:  media_appearance_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
apps\web\src\lib\errors.ts:121:  faq_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
apps\web\src\lib\page-context.ts:13:} from "@glitzy/auth";
apps\web\src\lib\page-context.ts:81:    // operator-role-required / *-ineligible → forbidden 처리
apps\web\src\lib\post-login-redirect.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps\web\src\lib\post-login-redirect.ts:21:      FROM instance_membership m
apps\web\src\lib\post-login-redirect.ts:24:       AND m.role = 'operator'
apps\web\scripts\admin-qa-token.ts:5:import { issueMagicLink, validateAuthConfig } from "@glitzy/auth";
apps\web\scripts\admin-qa-token.ts:8:const authSecret = process.env.AUTH_SECRET ?? "local-development-secret-please-replace-32chars";
apps\web\scripts\admin-qa-token.ts:12:  authSecret,
apps\web\src\lib\json-ld\builders.ts:185:  author: DoctorProjection | null,
apps\web\src\lib\json-ld\builders.ts:189:    E.articleEntity(ctx, article, author),
apps\web\src\lib\public-db.ts:5:// app_public_reader role 은 SELECT only · RLS USING instance_id 정합.
apps\web\scripts\local-pass.ts:8:import { issueMagicLink, validateAuthConfig } from "@glitzy/auth";
apps\web\scripts\local-pass.ts:20:    authSecret: process.env.AUTH_SECRET ?? "",
apps\web\scripts\local-pass.ts:73:    console.log(`  ctx (email + role) visible: ${hasCtx}`);
apps\web\scripts\local-pass.ts:88:    // magic-link-issued 는 sign-in Server Action 만 emit (script 가 packages/auth.issueMagicLink 직접 호출이므로 skip)
apps\web\src\lib\json-ld\entities.ts:125:  author: DoctorProjection | null,
apps\web\src\lib\json-ld\entities.ts:127:  // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
apps\web\src\lib\json-ld\entities.ts:128:  const authorBlock = author ? {
apps\web\src\lib\json-ld\entities.ts:129:    author: {
apps\web\src\lib\json-ld\entities.ts:131:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps\web\src\lib\json-ld\entities.ts:132:      name: author.name,
apps\web\src\lib\json-ld\entities.ts:133:      ...(author.title ? { jobTitle: author.title } : {}),
apps\web\src\lib\json-ld\entities.ts:134:      ...(author.photoUrl ? { image: author.photoUrl } : {}),
apps\web\src\lib\json-ld\entities.ts:147:    ...authorBlock,
apps\web\src\lib\json-ld\entities.ts:235:    author: pub.authors.map((name) => ({ "@type": "Person", name })),
apps\web\scripts\seed-fixture-eat.sql:5:  instance_id, slug, title, authors, journal, published_date,
apps\web\scripts\seed-fixture-eat.sql:6:  doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
apps\web\scripts\seed-fixture-eat.sql:23:  duration_seconds, url, thumbnail_url, summary, author_doctor_id,
apps\web\scripts\seed-fixture.sql:54:                     author_doctor_id)
apps\web\src\lib\session-cookie.ts:3:// sliding cookie refresh 는 packages/auth v0.3 sessionRefreshed 반환 후 cascade
apps\web\src\app\sign-out\route.ts:11:} from "@glitzy/auth";
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts:70:  authors: ["김의원", "이연구"],
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts:78:  authorDoctorId: null,
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts:93:  authorDoctorId: null,
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts:106:    authorDoctorId: null,
apps\web\src\lib\json-ld\__tests__\eat-validate.test.ts:114:  it("Doctor Profile 안 publication inline + author 매칭", () => {
apps\web\src\lib\json-ld\__tests__\validate.test.ts:98:  authorDoctorId: "00000000-0000-0000-0000-000000000001",
apps\web\src\lib\json-ld\__tests__\validate.test.ts:146:  it("Article Detail graph PASS — Article inline author Physician", () => {
apps\web\src\lib\slug-resolver.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps\web\src\lib\tenant.ts:2:// packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회
apps\web\src\lib\tenant.ts:4:import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
apps\web\src\app\sign-in\actions.ts:10:import { AuthDeniedError, emitAuditEvent, issueMagicLink, normalizeIdentifier } from "@glitzy/auth";
apps\web\src\app\sign-in\actions.ts:40:    SELECT id, active FROM admin_user WHERE email = ${normalized} LIMIT 1
apps\web\src\app\api\site-meta-fetch\route.ts:17:} from "@glitzy/auth";
apps\web\src\app\api\site-meta-fetch\route.ts:83:      payload: { origin: "auth" },
apps\web\src\app\api\site-meta-fetch\route.ts:129:    const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
apps\web\src\app\api\health\route.ts:13:      SELECT EXISTS(SELECT 1 FROM admin_user WHERE id = ${SYSTEM_ACTOR_ID}::uuid) AS exists
apps\web\src\app\api\health\route.ts:30:    // cycle2-code WEB-33: 외부 응답에 DB connection string / role / SQL 상세 누설 방지
apps\web\src\app\sign-in\cleanup\route.ts:7:import { emitAuditEvent, type AuthDenyReason } from "@glitzy/auth";
apps\web\src\app\sign-in\consume\route.ts:2:// magic-link 소비 + admin_user lookup (자동 INSERT 없음 · ADMIN-UI-75)
apps\web\src\app\sign-in\consume\route.ts:15:} from "@glitzy/auth";
apps\web\src\app\sign-in\consume\route.ts:55:  // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
apps\web\src\app\sign-in\consume\route.ts:72:  // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
apps\web\src\app\sign-in\consume\route.ts:74:    SELECT id, active FROM admin_user WHERE email = ${normalizedIdentifier} LIMIT 1
apps\web\src\app\sign-in\consume\route.ts:100:      // packages/auth.consumeMagicLink 내부 normalizer 결과 — 동일해야 정상
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:23:} from "@glitzy/auth";
apps\web\src\app\(site)\[instanceSlug]\robots.txt\route.ts:20:Disallow: /auth/
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:17:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:215:         WHERE instance_id = ${ctx.instanceId}::uuid AND author_doctor_id = ${doctorId}::uuid
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:270:      // cycle2-3entity WEB-24: article_author_fk 같은 field-mapping 도 delete 에서는 formError 로 변환
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:64:  authorDoctorId: z
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:120:        const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null; category_id: string }[]>`
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:121:          SELECT id, published_at, author_doctor_id, category_id FROM article
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:126:        currentAuthorId = beforeRows[0]!.author_doctor_id;
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:160:      // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:161:      if (parsed.data.authorDoctorId) {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:164:           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:168:          return { ok: false as const, action: "author-not-found" as const };
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:172:          return { ok: false as const, action: "author-inactive" as const };
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:187:                 author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:198:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id, published_at
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:208:          ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:218:      if (txResult.action === "author-not-found") {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:219:        return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:221:      if (txResult.action === "author-inactive") {
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:222:        return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:64:                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:76:            author_doctor_id, status
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:88:            ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:56:                   authors = ${JSON.stringify(parsed.data.authors)}::jsonb,
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:64:                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:74:            instance_id, slug, title, authors, journal, published_date,
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:76:            author_doctor_id, status
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:81:            ${JSON.stringify(parsed.data.authors)}::jsonb,
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:89:            ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:11:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:8:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:60:                   author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:72:            category_id, author_doctor_id, related_treatment_id, status
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:80:            ${parsed.data.authorDoctorId ?? null}::uuid,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/auth/src/resolve-tenant-context.ts | Select-Object -Skip 200 -First 80' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE admin_user|physician_reviewer_eligible|client_approver_eligible|instance_membership|role TEXT|CHECK.*role" packages/auth apps/spike-e -g "*.sql" -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "type ActionType|ActionType|operator-edit-content|reviewer|approve" packages/auth/src' in C:\Users\assag\solution\website-exposure
 succeeded in 576ms:
apps/spike-e\src\migrate.ts:30:      await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, "verificationToken", "session", instance_membership, admin_user, tenant_data CASCADE`;
apps/spike-e\migrations\002_admin_user.sql:1:-- Spike E — 002: admin_user + instance_membership
apps/spike-e\migrations\002_admin_user.sql:7:CREATE TABLE admin_user (
apps/spike-e\migrations\002_admin_user.sql:14:  physician_reviewer_eligible BOOLEAN NOT NULL DEFAULT false,
apps/spike-e\migrations\002_admin_user.sql:15:  client_approver_eligible BOOLEAN NOT NULL DEFAULT false,
apps/spike-e\migrations\002_admin_user.sql:23:CREATE TABLE instance_membership (
apps/spike-e\migrations\002_admin_user.sql:27:  role TEXT NOT NULL,
apps/spike-e\migrations\002_admin_user.sql:33:  CONSTRAINT instance_membership_role_check CHECK (role IN ('operator', 'physician-reviewer', 'legal-reviewer', 'client-approver')),
apps/spike-e\migrations\002_admin_user.sql:34:  CONSTRAINT instance_membership_deactivated_consistency CHECK (
apps/spike-e\migrations\002_admin_user.sql:40:CREATE UNIQUE INDEX instance_membership_active_unique
apps/spike-e\migrations\002_admin_user.sql:41:  ON instance_membership (user_id, instance_id)
apps/spike-e\migrations\002_admin_user.sql:44:CREATE INDEX instance_membership_user_active_idx ON instance_membership (user_id, active);
apps/spike-e\migrations\002_admin_user.sql:45:CREATE INDEX instance_membership_instance_active_idx ON instance_membership (instance_id, active);
apps/spike-e\src\resolve-tenant-context.ts:25:  physician_reviewer_eligible: boolean;
apps/spike-e\src\resolve-tenant-context.ts:26:  client_approver_eligible: boolean;
apps/spike-e\src\resolve-tenant-context.ts:87:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
apps/spike-e\src\resolve-tenant-context.ts:127:      SELECT id, instance_id, role, active FROM instance_membership
apps/spike-e\src\resolve-tenant-context.ts:146:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
apps/spike-e\src\resolve-tenant-context.ts:150:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
apps/spike-e\src\resolve-tenant-context.ts:204: *  - physician-review-* → physician_reviewer_eligible
apps/spike-e\src\resolve-tenant-context.ts:205: *  - client-approval-*  → client_approver_eligible
apps/spike-e\src\resolve-tenant-context.ts:243:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
apps/spike-e\src\resolve-tenant-context.ts:248:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires client_approver_eligible`);
apps/spike-e\src\seed.ts:16:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps/spike-e\src\seed.ts:19:      INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
apps/spike-e\src\seed.ts:31:      INSERT INTO instance_membership (user_id, instance_id, role) VALUES
packages/auth\src\resolve-tenant-context.ts:19:  physician_reviewer_eligible: boolean;
packages/auth\src\resolve-tenant-context.ts:20:  client_approver_eligible: boolean;
packages/auth\src\resolve-tenant-context.ts:79:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
packages/auth\src\resolve-tenant-context.ts:119:      SELECT id, instance_id, role, active FROM instance_membership
packages/auth\src\resolve-tenant-context.ts:138:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
packages/auth\src\resolve-tenant-context.ts:142:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
packages/auth\src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
packages/auth\src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
apps/spike-e\src\scenarios\test-action-eligibility.ts:20:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${ua[0]!.id}`;
apps/spike-e\src\scenarios\test-action-eligibility.ts:71:    await sql`UPDATE admin_user SET legal_reviewer_eligible = true, physician_reviewer_eligible = true, client_approver_eligible = true WHERE id = ${uc[0]!.id}`;
apps/spike-e\src\scenarios\test-action-eligibility.ts:77:    await sql`UPDATE admin_user SET legal_reviewer_eligible = false, physician_reviewer_eligible = false, client_approver_eligible = false WHERE id = ${uc[0]!.id}`;
apps/spike-e\src\scenarios\test-inactive-user.ts:14:    await sql`UPDATE instance_membership SET active = true WHERE user_id = ${u[0]!.id}`;
apps/spike-e\src\scenarios\test-invariant.ts:20:    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;
apps/spike-e\src\scenarios\test-invariant.ts:33:      await sql`INSERT INTO instance_membership (user_id, instance_id, role) VALUES (${userId}, ${ownInstance}::uuid, 'operator')`;
apps/spike-e\src\scenarios\test-membership-removal.ts:18:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;
apps/spike-e\src\scenarios\test-membership-removal.ts:27:      UPDATE instance_membership
apps/spike-e\src\scenarios\test-membership-removal.ts:43:      SELECT deactivated_at, deactivated_by_user_id FROM instance_membership
apps/spike-e\src\scenarios\test-membership-removal.ts:52:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps/spike-e\src\scenarios\test-membership-removal.ts:60:      await sql`UPDATE instance_membership SET active = false, deactivated_at = now(), deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps/spike-e\src\scenarios\test-membership-removal.ts:62:      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v1 = true;
apps/spike-e\src\scenarios\test-membership-removal.ts:70:      await sql`UPDATE instance_membership SET active = true, deactivated_at = now(), deactivated_by_user_id = ${uCarol[0]!.id} WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
apps/spike-e\src\scenarios\test-membership-removal.ts:72:      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v2 = true;
apps/spike-e\src\scenarios\test-rls-integration.ts:12:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL`;
apps/spike-e\src\scenarios\test-session-refresh.ts:12:    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;

 succeeded in 593ms:
packages/auth/src\errors.ts:14:  | "legal-reviewer-ineligible"
packages/auth/src\errors.ts:15:  | "physician-reviewer-ineligible"
packages/auth/src\errors.ts:16:  | "client-approver-ineligible"
packages/auth/src\index.ts:35:  type ActionType,
packages/auth/src\resolve-tenant-context.ts:18:  legal_reviewer_eligible: boolean;
packages/auth/src\resolve-tenant-context.ts:19:  physician_reviewer_eligible: boolean;
packages/auth/src\resolve-tenant-context.ts:20:  client_approver_eligible: boolean;
packages/auth/src\resolve-tenant-context.ts:79:    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
packages/auth/src\resolve-tenant-context.ts:134:    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
packages/auth/src\resolve-tenant-context.ts:135:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
packages/auth/src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
packages/auth/src\resolve-tenant-context.ts:138:    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
packages/auth/src\resolve-tenant-context.ts:139:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
packages/auth/src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
packages/auth/src\resolve-tenant-context.ts:142:    if (mem.role === "client-approver" && !user.client_approver_eligible) {
packages/auth/src\resolve-tenant-context.ts:143:      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
packages/auth/src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
packages/auth/src\resolve-tenant-context.ts:194:export type ActionType =
packages/auth/src\resolve-tenant-context.ts:195:  | "legal-review-approve" | "legal-review-reject" | "legal-review-request-changes" | "legal-review-delegate"
packages/auth/src\resolve-tenant-context.ts:196:  | "physician-review-approve" | "physician-review-reject" | "physician-review-request-changes" | "physician-review-delegate"
packages/auth/src\resolve-tenant-context.ts:197:  | "client-approval-approve" | "client-approval-reject" | "client-approval-request-changes"
packages/auth/src\resolve-tenant-context.ts:198:  | "operator-publish" | "operator-unpublish" | "operator-edit-content";
packages/auth/src\resolve-tenant-context.ts:200:export function assertActionEligibility(ctx: TenantContext, action: ActionType): void {
packages/auth/src\resolve-tenant-context.ts:202:    case "legal-review-approve":
packages/auth/src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
packages/auth/src\resolve-tenant-context.ts:208:    case "physician-review-approve":
packages/auth/src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
packages/auth/src\resolve-tenant-context.ts:214:    case "client-approval-approve":
packages/auth/src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
packages/auth/src\resolve-tenant-context.ts:221:    case "operator-edit-content":

 succeeded in 628ms:
  switch (action) {
    case "legal-review-approve":
    case "legal-review-reject":
    case "legal-review-request-changes":
    case "legal-review-delegate":
      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
      return;
    case "physician-review-approve":
    case "physician-review-reject":
    case "physician-review-request-changes":
    case "physician-review-delegate":
      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
      return;
    case "client-approval-approve":
    case "client-approval-reject":
    case "client-approval-request-changes":
      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
      return;
    case "operator-publish":
    case "operator-unpublish":
    case "operator-edit-content":
      if (ctx.role === "operator" || ctx.role === "super-admin") return;
      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
    default: {
      const _exhaustive: never = action;
      throw new Error(`unknown action: ${String(_exhaustive)}`);
    }
  }
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/CONTENT_STANDARDS.md | Select-Object -Skip 350 -First 160' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/admin/REVIEW_WORKFLOW.md | Select-Object -Skip 250 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "recordPhase|pre-publish|published|immutable|recordVersion|staleFlags|warningAcknowledgements|published 이후" docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
 succeeded in 589ms:
docs/core/DATA_MODEL.md:455:| `publishedYear` | `number` | optional | |
docs/core/DATA_MODEL.md:478:| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
docs/core/DATA_MODEL.md:522:- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
docs/core/DATA_MODEL.md:790:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
docs/core/DATA_MODEL.md:791:| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
docs/core/DATA_MODEL.md:792:| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
docs/core/DATA_MODEL.md:793:| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
docs/core/DATA_MODEL.md:794:| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
docs/core/DATA_MODEL.md:795:| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
docs/core/DATA_MODEL.md:797:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
docs/core/DATA_MODEL.md:843:| `publishedAt` | `Date` | ✅ | schema datePublished |
docs/core/DATA_MODEL.md:943:| `publishedDate` | `Date` | ✅ | 학술지 게재일 |
docs/core/DATA_MODEL.md:952:| `publishedAt` | `Date` | conditional | status='published' 시 required |
docs/core/DATA_MODEL.md:972:| `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
docs/core/DATA_MODEL.md:980:| `publishedAt` | `Date` | conditional | status='published' 시 required |
docs/core/DATA_MODEL.md:1011:| `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
docs/core/DATA_MODEL.md:1033:필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
docs/core/DATA_MODEL.md:1185:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
docs/admin/REVIEW_WORKFLOW.md:20:- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
docs/admin/REVIEW_WORKFLOW.md:21:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
docs/admin/REVIEW_WORKFLOW.md:23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
docs/admin/REVIEW_WORKFLOW.md:25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
docs/admin/REVIEW_WORKFLOW.md:68:  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
docs/admin/REVIEW_WORKFLOW.md:69:  | "published"       // 발행됨 (Git 사본 생성)
docs/admin/REVIEW_WORKFLOW.md:72:  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
docs/admin/REVIEW_WORKFLOW.md:111:              │                │  │  published   │
docs/admin/REVIEW_WORKFLOW.md:113:              │                │       │ staleFlags 발생 (§ 6)
docs/admin/REVIEW_WORKFLOW.md:138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
docs/admin/REVIEW_WORKFLOW.md:139:| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
docs/admin/REVIEW_WORKFLOW.md:142:| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
docs/admin/REVIEW_WORKFLOW.md:143:| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
docs/admin/REVIEW_WORKFLOW.md:148:| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |
docs/admin/REVIEW_WORKFLOW.md:160:| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |
docs/admin/REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
docs/admin/REVIEW_WORKFLOW.md:224:`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.
docs/admin/REVIEW_WORKFLOW.md:228:> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
docs/admin/REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
docs/admin/REVIEW_WORKFLOW.md:274:DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
docs/admin/REVIEW_WORKFLOW.md:276:**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
docs/admin/REVIEW_WORKFLOW.md:277:- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
docs/admin/REVIEW_WORKFLOW.md:278:- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
docs/admin/REVIEW_WORKFLOW.md:281:**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
docs/admin/REVIEW_WORKFLOW.md:282:- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
docs/admin/REVIEW_WORKFLOW.md:283:- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
docs/admin/REVIEW_WORKFLOW.md:290:| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
docs/admin/REVIEW_WORKFLOW.md:291:| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
docs/admin/REVIEW_WORKFLOW.md:292:| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
docs/admin/REVIEW_WORKFLOW.md:293:| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
docs/admin/REVIEW_WORKFLOW.md:294:| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
docs/admin/REVIEW_WORKFLOW.md:295:| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |
docs/admin/REVIEW_WORKFLOW.md:299:- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
docs/admin/REVIEW_WORKFLOW.md:300:- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
docs/admin/REVIEW_WORKFLOW.md:301:- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
docs/admin/REVIEW_WORKFLOW.md:303:- staleFlags 외 필드 수정 시도 — 빌드/API fail
docs/admin/REVIEW_WORKFLOW.md:328:- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
docs/admin/REVIEW_WORKFLOW.md:329:- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
docs/admin/REVIEW_WORKFLOW.md:331:- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
docs/admin/REVIEW_WORKFLOW.md:332:- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
docs/admin/REVIEW_WORKFLOW.md:333:- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
docs/admin/REVIEW_WORKFLOW.md:334:- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
docs/admin/REVIEW_WORKFLOW.md:335:- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)
docs/admin/REVIEW_WORKFLOW.md:337:### 6.3 staleFlags 우선순위
docs/admin/REVIEW_WORKFLOW.md:362:           ∧ (4) staleFlags 모두 false 또는 미설정
docs/admin/REVIEW_WORKFLOW.md:375:  - `published` 상태 전이
docs/admin/REVIEW_WORKFLOW.md:376:  - ComplianceRecord `publishedAt`·`publishedBy` 기록
docs/admin/REVIEW_WORKFLOW.md:377:  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
docs/admin/REVIEW_WORKFLOW.md:384:  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
docs/admin/REVIEW_WORKFLOW.md:428:2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
docs/admin/REVIEW_WORKFLOW.md:429:3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
docs/admin/REVIEW_WORKFLOW.md:431:5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
docs/admin/REVIEW_WORKFLOW.md:435:7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
docs/admin/REVIEW_WORKFLOW.md:525:| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
docs/admin/REVIEW_WORKFLOW.md:635:- staleFlags 발생·해제
docs/admin/REVIEW_WORKFLOW.md:774:| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
docs/admin/REVIEW_WORKFLOW.md:788:| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
docs/admin/REVIEW_WORKFLOW.md:799:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
docs/admin/REVIEW_WORKFLOW.md:800:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
docs/admin/REVIEW_WORKFLOW.md:807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
docs/admin/REVIEW_WORKFLOW.md:808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
docs/admin/REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
docs/admin/REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

 succeeded in 640ms:
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


 succeeded in 663ms:

- 어드민에서 운영자가 직접 분류 (M0)
- compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)

---

## 7. compliance-assistant Feature Module 인터페이스

본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.

### 7.1 입력

```ts
type ComplianceCheckInput = {
  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
  contentRef: string;                 // 대상 콘텐츠 @id
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
    articleType?: ArticleType;        // DATA_MODEL C-04
    pageMeta?: PageMeta;              // DATA_MODEL C-06
    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
  };
  riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
};

// 둘 중 정확히 하나만 사용:
// - Core 콘텐츠: contentType 사용, featureContentType 미지정
// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
|---|---|---|
| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
| RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |

**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.

**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.

#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)

EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },   // 콘텐츠 전체 — 의미상 메타
  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
}
```

**트리거 조건**: `metadata.inferredRiskLevel === "High"` 또는 `metadata.explicitRiskLevel === "High"` (둘 중 하나라도 High이면 주입). 트리거 출처는 finding 메타에 기록(예: `triggeredBy: "inferred" | "explicit"`)하여 감사 추적성 유지.

- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
  - `effect-result-related` → `["medical"]`
  - `review-case` → `["medical", "legal"]` (의료진 + 법무 동시 필요)
  - `event-price` → `["legal"]`
  - 기타 High explicitRiskLevel/inferredRiskLevel → `["medical"]`
- Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리

#### 7.1.3 ApproverRole → ComplianceRecord 필드 매핑

```ts
type ApproverRole = "medical" | "legal" | "operator" | "client";
```

ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:

| ApproverRole | 매핑 ComplianceRecord 필드 | 의미 |
|---|---|---|
| `medical` | `physicianApprover` + `physicianApprovedAt` | 의료진 콘텐츠 승인 |
| `legal` | `legalCounsel` + `legalCounselAt` | 법무 자문·승인 |
| `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
| `client` | `clientApprover` + `clientApprovedAt` | 클라이언트 측 승인 (운영 정책 시) |

- compliance-assistant는 ApproverRole 배열만 출력 — 실제 ComplianceRecord 기록 생성·갱신은 어드민 발행 워크플로
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
//
// 최종 발행 가능 여부 (publishable)은 본 인터페이스에 포함되지 않음 — 어드민 발행 워크플로가 다음을 종합 판정:
//   1) automatedDecision !== "block"
//   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
//   3) hasWarnings=true 시 운영 정책에 따라 검토 완료 또는 일괄 인정

// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)

type Finding = {
  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"

codex
# COMPLIANCE_ASSISTANT_M0_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=9 major=12 minor=7 (총 28)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **CAM-01**: EC-DEFER-05/12 “해소” 주장이 M0 stub 범위와 충돌
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md`:25, 41, 397, 506
  - 근거(SoT): EAT_CONTENT_PLAN `EC-DEFER-05`=FAQ 자동 검수 + RiskRule + RiskInference, `EC-DEFER-12`=compliance-assistant 합류 후 published; CONTENT_STANDARDS § 7.1.1.2 FAQ RiskRule/RiskInference 적용
  - 문제: plan은 `check()`가 항상 `findings=[]`, `gateRequired=false`, `automatedDecision='pass'`라고 하면서 FAQ published를 “EC-DEFER-05 부분 해소”로 둔다. 이 상태에서는 FAQ Q/A의 광고 표현 검수와 Medium/High 자동 추론이 합류하지 않아 EC-DEFER-05를 해소하지 못한다.
  - 권장 patch: § 1.1의 “EC-DEFER-05 해소”를 “EC-DEFER-07 및 EC-DEFER-12의 수동 검수 게이트 부분 해소, EC-DEFER-05는 미해소”로 정정하거나, M0에서 FAQ에 한해 RiskInference 최소 구현을 포함한다.

- **CAM-02**: content-gate 큐 생성 조건이 REVIEW_WORKFLOW와 정면 충돌
  - 위치: plan `§ 4.2`, `§ 7` 시나리오 1~3, line 397, 494~496
  - 근거(SoT): REVIEW_WORKFLOW § 3.1 line 158 — content-gate 큐는 `gateRequired=true`일 때 진입
  - 문제: `check()` stub은 `gateRequired=false`인데 `submitForReview`는 항상 ReviewQueueEntry를 만든다. 즉 “content-gate 큐”가 아닌 수동 검수 큐를 content-gate로 위장한다.
  - 권장 patch: M0 전용 `manual-review` queue type을 추가하거나, submitForReview가 만드는 entry의 근거를 `manualReviewRequired=true`로 별도 모델링한다. `content-gate`라는 이름을 유지하려면 stub 결과를 gate로 만들고 `automatedDecision='gate'`, `findingsBySeverity.content-gate=1`의 M0 가상 finding을 정의해야 한다.

- **CAM-03**: `ComplianceCheckResult` stub이 CONTENT_STANDARDS § 7.2 타입을 만족하지 않음
  - 위치: plan line 376~390
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 476~494
  - 문제: plan stub은 필수 필드 `buildBlocked`, `findingsBySeverity`가 없고, SoT 출력에 없는 `contentRef`, `contentType`, `pageRiskLevel`, `manualReview`, `catalogVersion`, `catalogHash`를 반환한다.
  - 권장 patch: `ComplianceCheckResult`는 SoT 그대로 반환하고, `pageRiskLevel/catalogVersion/catalogHash/manualReview`는 `auto_check_result.metadata` 또는 별도 wrapper `ComplianceCheckEnvelope`에 넣는 결정을 명시한다.

- **CAM-04**: explicitRiskLevel이 inferredRiskLevel을 격하할 수 있음
  - 위치: plan line 369, 377~378
  - 근거(SoT): RISK_LEVELS § 2.3 line 83~93 — explicit은 MAX 결합, 격하 불가; CONTENT_STANDARDS § 7.1.2 line 447 — inferred/explicit 중 하나라도 High면 gate
  - 문제: `explicit ?? inferred ?? Low`는 `explicitRiskLevel='Low'` + `inferredRiskLevel='High'`를 Low로 격하시킨다.
  - 권장 patch: M0 stub도 최소 `maxRisk(input.metadata.inferredRiskLevel, input.metadata.explicitRiskLevel, "Low")`를 사용한다. RiskInference 전체는 CA-DEFER-02여도 입력 결합 MAX는 defer하면 안 된다.

- **CAM-05**: High 입력의 가상 finding/gateRequired 규칙 누락
  - 위치: plan line 376~390
  - 근거(SoT): CONTENT_STANDARDS § 7.1.2 line 432~456; RISK_LEVELS § 6.1 line 569~591
  - 문제: `explicitRiskLevel` 또는 `inferredRiskLevel`이 High여도 `findings=[]`, `gateRequired=false`, `automatedDecision='pass'`다. High 강제 검수 규칙을 깨고 큐/역할 계산을 별도 경로에 의존한다.
  - 권장 patch: M0 stub에서 High 입력만큼은 `risk-level-high-gate` 가상 finding을 주입하거나, “M0 stub은 High 가상 finding 미구현이라 High 콘텐츠 발행 금지”를 명시한다.

- **CAM-06**: `evaluatePublishable()`가 REVIEW_WORKFLOW § 7.1 6조건 중 3개 이상을 누락
  - 위치: plan line 328~350
  - 근거(SoT): REVIEW_WORKFLOW § 7.1 line 354~364
  - 문제: priorReviewPassed/submissionId/attachments, staleFlags clear, warningAcknowledgements 정책을 평가하지 않는다. plan이 CA-DEFER로 둔 영역이라도 “publishable evaluator”가 6조건 중 무엇을 stub 처리하는지 명확해야 한다.
  - 권장 patch: evaluator 반환 reason에 `not-implemented`/`deferredGate`를 포함하고, M0에서 평가하지 않는 조건은 항상 안전 방향으로 fail 또는 명시적 fixed false로 둔다. 특히 `priorReviewRequired=true`면 publish 금지해야 한다.

- **CAM-07**: C0016 migration은 기존 published row 때문에 즉시 실패 가능
  - 위치: plan line 278~280
  - 근거(SoT): PostgreSQL CHECK는 ADD 시 기존 row 검증; plan 자체가 “기존 article published 1행 backfill 없음”을 명시
  - 문제: `article_published_requires_record`를 바로 ADD하면 기존 `status='published' AND compliance_record_id IS NULL` row에서 migration이 실패한다. “개발자가 수동 republish”는 migration 이후 조치라 순서가 맞지 않는다.
  - 권장 patch: 사전 backfill dummy published ComplianceRecord 생성, 또는 `NOT VALID`로 CHECK 추가 후 수동 정리와 `VALIDATE CONSTRAINT` 단계 분리. 운영 절차와 test fixture를 명시한다.

- **CAM-08**: published entity가 `record_phase='published'` record를 참조한다는 DB 보장이 없음
  - 위치: plan line 37, 233~276, 467~468
  - 근거(SoT): REVIEW_WORKFLOW § 5.2 line 281~283; DATA_MODEL C-10 line 792~795
  - 문제: entity CHECK는 `compliance_record_id IS NOT NULL`만 본다. pre-publish record를 참조한 상태로 entity `status='published'`가 될 수 있다.
  - 권장 patch: FK만으로 불가능하면 trigger 또는 publish action invariant test를 추가하고, DB CHECK라고 표현하지 않는다. 가능하면 `published_content_compliance_guard` trigger로 referenced record의 phase/type/ref/instance 일치까지 검증한다.

- **CAM-09**: LegalDocument 자동 검수 호출 계획이 CONTENT_STANDARDS LegalDocument 면제와 충돌
  - 위치: plan line 25~26, 40~41, 494~496
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.1 — LegalDocument는 compliance-assistant `check()` 진입 자체를 운영 단계에서 차단, 단 ComplianceRecord 법무 게이트는 유지
  - 문제: plan은 6 entity 공통 submitForReview 안에서 check() 호출을 말하고, LegalDocument도 같은 흐름에 포함한다. LegalDocument는 자동 검수 면제 + 법무 승인 게이트만 적용해야 한다.
  - 권장 patch: LegalDocument는 `check()` 호출 없이 `auto_check_result`에 `{automatedDecision:"pass", exemptReason:"LegalDocument"}` 같은 명시적 면제 envelope를 저장하거나 별도 submit 경로로 분리한다.

## major
- **CAM-10**: `compliance_content_type` enum 10종이 M0 active라면서 `ClinicProfile/DoctorProfile/LocationProfile/ArticleCategory`까지 포함한다. plan scope의 6 entity와 맞지 않고 ArticleCategory는 CONTENT_STANDARDS상 룰 미적용이다. 위치: line 79~83, 153. 권장 patch: enum은 C-10 풀 17종을 쓰거나, M0 active/allowed submit 타입을 별도 allowlist로 분리한다.

- **CAM-11**: DATA_MODEL C-10의 `featureContentType` 누락이 CA-DEFER-13에 명시되지 않았다. 위치: plan line 88~90, 152~153. 근거: DATA_MODEL C-10 line 771~773. 권장 patch: Feature 토큰과 `featureContentType`을 함께 CA-DEFER-13/CA-DEFER-01에 매핑한다.

- **CAM-12**: C-10 풀명세 중 `mediaThresholdOperationalInput`이 CA-DEFER-13 목록에서 빠졌다. 위치: plan line 61, 65, 549. 근거: DATA_MODEL line 796~797. 권장 patch: `mediaThresholdAssessment`와 `mediaThresholdOperationalInput`을 분리해 CA-DEFER-09/13에 적는다.

- **CAM-13**: ReviewQueueEntry `status='cancelled'`가 REVIEW_WORKFLOW 큐 상태 SoT에 없다. 위치: plan line 162. 근거: REVIEW_WORKFLOW § 3은 큐 3종과 처리 흐름만 정의, plan SoT 요약은 open/in-progress/resolved 3종. 권장 patch: cancelled를 추가하려면 REVIEW_WORKFLOW cascade를 명시하거나 M0 enum에서 제거한다.

- **CAM-14**: ReviewQueueEntry `compliance_record_id`가 nullable이다. content-gate M0 큐는 ComplianceRecord pre-publish 참조가 핵심인데 nullable이면 고아 큐가 가능하다. 위치: line 171~190. 권장 patch: M0 `content-gate`에서는 NOT NULL로 두거나 queue_type별 partial CHECK를 둔다.

- **CAM-15**: `required_roles` JSONB는 순서/중복/enum 검증이 없다. 위치: line 174, 190. 근거: RISK_LEVELS ApproverRole enum medical/legal/operator/client. 권장 patch: text[] enum array 또는 JSONB CHECK로 `operator|medical|legal`만, 중복 없음, canonical sort를 보장한다.

- **CAM-16**: `finalRoles` 계산이 `requiredApproverRoles`를 받지만 `evaluatePublishable()`는 이를 전달하지 않는다. 위치: line 294~303, 333~338. 근거: REVIEW_WORKFLOW § 4.1 line 215~220. 권장 patch: `auto_check_result.requiredApproverRoles ?? []`를 파싱해 finalRoles에 넣고, unknown role은 fail closed.

- **CAM-17**: `approveContent()`가 entity row 상태를 어떻게 `review-queued → in-review`로 전환하는지 불명확하다. 위치: line 448~463, 474~482. 근거: REVIEW_WORKFLOW § 2.3 line 134~136. 권장 patch: assign/pickup 액션을 추가하거나 approve 첫 호출이 atomic하게 open entry를 in-progress/in-review로 전환한다고 명시한다.

- **CAM-18**: form status select 9-state 활성화는 직접 상태 우회 위험이 크다. 위치: line 422~423. 기존 save actions는 `operator-edit-content`로 status를 저장한다. 권장 patch: status select에서 `published`/`approved`/`publishable` 직접 선택을 제거하고 workflow actions로만 전이한다. 최소한 기존 save actions를 `assertTransitionAllowed` 경유로 전면 교체해야 한다.

- **CAM-19**: Publication/MediaAppearance에는 DB status skeleton CHECK가 원래 없는데 “published unlock”으로 묶어 설명한다. 위치: line 43, 263~276. 근거: EAT_CONTENT line 443 — DB CHECK 없이 form schema만 draft. 권장 patch: 두 entity는 “form/zod unlock + compliance_record_id ADD”로 표현을 정정한다.

- **CAM-20**: audit event 4종이 REVIEW_WORKFLOW/ADMIN_UI audit matrix에 cascade되지 않았다. 위치: line 46, 526. 근거: ADMIN_UI_SKELETON audit_event matrix는 `content-saved/deleted` 중심이고 tx 밖 emit 정책을 둔다. 권장 patch: eventType, payload shape, emit 위치(tx commit 후 base role), 실패 정책을 ADMIN_UI_SKELETON_PLAN 또는 REVIEW_WORKFLOW에 cascade한다.

- **CAM-21**: notifications가 완전히 빠져 LL-DEFER-01의 “NotificationEvent envelope” 해소와 맞지 않다. 위치: plan line 25~26, 528. 근거: LOCATION_LEGAL_PLAN line 57, 548; REVIEW_WORKFLOW § 9.1.1 line 523. 권장 patch: M0에서 notifications 미구현이면 LL-DEFER-01은 “발행 게이트 부분 해소”로 낮추고 NotificationEvent는 CA-DEFER 별도 항목으로 둔다.

## minor
- **CAM-22**: line 5의 “역할 2종 활성화”는 plan 본문 operator·medical·legal 3종과 불일치한다. “client 제외 3종”으로 정정.

- **CAM-23**: manifest 단계 수가 틀렸다. 기존 16 + C0014/C0015/C0016 = 19인데 line 5와 525는 18로 쓴다. `CA-CASCADE-05`도 19단계로 정정.

- **CAM-24**: line 25는 “4 entity”라고 쓰고 괄호에는 6 entity를 열거한다. “6 entity”로 정정.

- **CAM-25**: C0014 주석이 `C-08 ComplianceRecord`라고 되어 있으나 SoT는 C-10이다. 위치: line 34. 정정 필요.

- **CAM-26**: `record_phase`는 snake_case, 본문은 `recordPhase`가 섞인다. SQL/TS/문서 표기 변환 규칙을 한 줄 추가하는 게 좋다.

- **CAM-27**: advisory lock key `hashtext()`는 32-bit라 충돌 가능성이 있다. 위치: line 466. 권장 patch: `pg_advisory_xact_lock(hashtextextended(...))` 또는 UUID를 2개 int로 나누는 방식을 명시한다.

- **CAM-28**: 시나리오 13은 FAQ JSON-LD public rendering까지 포함해 compliance-assistant M0 검증 범위를 벗어난다. 위치: line 506. 권장 patch: compliance side는 “published FAQ row가 ComplianceRecord 없이는 불가”로 두고 JSON-LD는 EAT_CONTENT/PSR 회귀 테스트로 분리한다.

## acceptance precondition 점검
- CA-DEFER 매핑 완비성: **FAIL** — `featureContentType`, `mediaThresholdOperationalInput`, NotificationEvent, LegalDocument check 면제 envelope, audit matrix cascade가 누락/불명확.
- 6 entity status unlock CHECK 4건 정합: **FAIL** — existing published row backfill/NOT VALID 전략 부재, published record phase 보장 부재.
- finalRoles 공식 정합: **FAIL** — 공식 자체는 비슷하나 `evaluatePublishable()`가 `requiredApproverRoles[]`를 반영하지 않고, High 가상 finding/explicit MAX 결합이 깨져 최종 역할 산정 입력이 틀릴 수 있다.
tokens used
156,468
# COMPLIANCE_ASSISTANT_M0_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=9 major=12 minor=7 (총 28)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **CAM-01**: EC-DEFER-05/12 “해소” 주장이 M0 stub 범위와 충돌
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md`:25, 41, 397, 506
  - 근거(SoT): EAT_CONTENT_PLAN `EC-DEFER-05`=FAQ 자동 검수 + RiskRule + RiskInference, `EC-DEFER-12`=compliance-assistant 합류 후 published; CONTENT_STANDARDS § 7.1.1.2 FAQ RiskRule/RiskInference 적용
  - 문제: plan은 `check()`가 항상 `findings=[]`, `gateRequired=false`, `automatedDecision='pass'`라고 하면서 FAQ published를 “EC-DEFER-05 부분 해소”로 둔다. 이 상태에서는 FAQ Q/A의 광고 표현 검수와 Medium/High 자동 추론이 합류하지 않아 EC-DEFER-05를 해소하지 못한다.
  - 권장 patch: § 1.1의 “EC-DEFER-05 해소”를 “EC-DEFER-07 및 EC-DEFER-12의 수동 검수 게이트 부분 해소, EC-DEFER-05는 미해소”로 정정하거나, M0에서 FAQ에 한해 RiskInference 최소 구현을 포함한다.

- **CAM-02**: content-gate 큐 생성 조건이 REVIEW_WORKFLOW와 정면 충돌
  - 위치: plan `§ 4.2`, `§ 7` 시나리오 1~3, line 397, 494~496
  - 근거(SoT): REVIEW_WORKFLOW § 3.1 line 158 — content-gate 큐는 `gateRequired=true`일 때 진입
  - 문제: `check()` stub은 `gateRequired=false`인데 `submitForReview`는 항상 ReviewQueueEntry를 만든다. 즉 “content-gate 큐”가 아닌 수동 검수 큐를 content-gate로 위장한다.
  - 권장 patch: M0 전용 `manual-review` queue type을 추가하거나, submitForReview가 만드는 entry의 근거를 `manualReviewRequired=true`로 별도 모델링한다. `content-gate`라는 이름을 유지하려면 stub 결과를 gate로 만들고 `automatedDecision='gate'`, `findingsBySeverity.content-gate=1`의 M0 가상 finding을 정의해야 한다.

- **CAM-03**: `ComplianceCheckResult` stub이 CONTENT_STANDARDS § 7.2 타입을 만족하지 않음
  - 위치: plan line 376~390
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 476~494
  - 문제: plan stub은 필수 필드 `buildBlocked`, `findingsBySeverity`가 없고, SoT 출력에 없는 `contentRef`, `contentType`, `pageRiskLevel`, `manualReview`, `catalogVersion`, `catalogHash`를 반환한다.
  - 권장 patch: `ComplianceCheckResult`는 SoT 그대로 반환하고, `pageRiskLevel/catalogVersion/catalogHash/manualReview`는 `auto_check_result.metadata` 또는 별도 wrapper `ComplianceCheckEnvelope`에 넣는 결정을 명시한다.

- **CAM-04**: explicitRiskLevel이 inferredRiskLevel을 격하할 수 있음
  - 위치: plan line 369, 377~378
  - 근거(SoT): RISK_LEVELS § 2.3 line 83~93 — explicit은 MAX 결합, 격하 불가; CONTENT_STANDARDS § 7.1.2 line 447 — inferred/explicit 중 하나라도 High면 gate
  - 문제: `explicit ?? inferred ?? Low`는 `explicitRiskLevel='Low'` + `inferredRiskLevel='High'`를 Low로 격하시킨다.
  - 권장 patch: M0 stub도 최소 `maxRisk(input.metadata.inferredRiskLevel, input.metadata.explicitRiskLevel, "Low")`를 사용한다. RiskInference 전체는 CA-DEFER-02여도 입력 결합 MAX는 defer하면 안 된다.

- **CAM-05**: High 입력의 가상 finding/gateRequired 규칙 누락
  - 위치: plan line 376~390
  - 근거(SoT): CONTENT_STANDARDS § 7.1.2 line 432~456; RISK_LEVELS § 6.1 line 569~591
  - 문제: `explicitRiskLevel` 또는 `inferredRiskLevel`이 High여도 `findings=[]`, `gateRequired=false`, `automatedDecision='pass'`다. High 강제 검수 규칙을 깨고 큐/역할 계산을 별도 경로에 의존한다.
  - 권장 patch: M0 stub에서 High 입력만큼은 `risk-level-high-gate` 가상 finding을 주입하거나, “M0 stub은 High 가상 finding 미구현이라 High 콘텐츠 발행 금지”를 명시한다.

- **CAM-06**: `evaluatePublishable()`가 REVIEW_WORKFLOW § 7.1 6조건 중 3개 이상을 누락
  - 위치: plan line 328~350
  - 근거(SoT): REVIEW_WORKFLOW § 7.1 line 354~364
  - 문제: priorReviewPassed/submissionId/attachments, staleFlags clear, warningAcknowledgements 정책을 평가하지 않는다. plan이 CA-DEFER로 둔 영역이라도 “publishable evaluator”가 6조건 중 무엇을 stub 처리하는지 명확해야 한다.
  - 권장 patch: evaluator 반환 reason에 `not-implemented`/`deferredGate`를 포함하고, M0에서 평가하지 않는 조건은 항상 안전 방향으로 fail 또는 명시적 fixed false로 둔다. 특히 `priorReviewRequired=true`면 publish 금지해야 한다.

- **CAM-07**: C0016 migration은 기존 published row 때문에 즉시 실패 가능
  - 위치: plan line 278~280
  - 근거(SoT): PostgreSQL CHECK는 ADD 시 기존 row 검증; plan 자체가 “기존 article published 1행 backfill 없음”을 명시
  - 문제: `article_published_requires_record`를 바로 ADD하면 기존 `status='published' AND compliance_record_id IS NULL` row에서 migration이 실패한다. “개발자가 수동 republish”는 migration 이후 조치라 순서가 맞지 않는다.
  - 권장 patch: 사전 backfill dummy published ComplianceRecord 생성, 또는 `NOT VALID`로 CHECK 추가 후 수동 정리와 `VALIDATE CONSTRAINT` 단계 분리. 운영 절차와 test fixture를 명시한다.

- **CAM-08**: published entity가 `record_phase='published'` record를 참조한다는 DB 보장이 없음
  - 위치: plan line 37, 233~276, 467~468
  - 근거(SoT): REVIEW_WORKFLOW § 5.2 line 281~283; DATA_MODEL C-10 line 792~795
  - 문제: entity CHECK는 `compliance_record_id IS NOT NULL`만 본다. pre-publish record를 참조한 상태로 entity `status='published'`가 될 수 있다.
  - 권장 patch: FK만으로 불가능하면 trigger 또는 publish action invariant test를 추가하고, DB CHECK라고 표현하지 않는다. 가능하면 `published_content_compliance_guard` trigger로 referenced record의 phase/type/ref/instance 일치까지 검증한다.

- **CAM-09**: LegalDocument 자동 검수 호출 계획이 CONTENT_STANDARDS LegalDocument 면제와 충돌
  - 위치: plan line 25~26, 40~41, 494~496
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.1 — LegalDocument는 compliance-assistant `check()` 진입 자체를 운영 단계에서 차단, 단 ComplianceRecord 법무 게이트는 유지
  - 문제: plan은 6 entity 공통 submitForReview 안에서 check() 호출을 말하고, LegalDocument도 같은 흐름에 포함한다. LegalDocument는 자동 검수 면제 + 법무 승인 게이트만 적용해야 한다.
  - 권장 patch: LegalDocument는 `check()` 호출 없이 `auto_check_result`에 `{automatedDecision:"pass", exemptReason:"LegalDocument"}` 같은 명시적 면제 envelope를 저장하거나 별도 submit 경로로 분리한다.

## major
- **CAM-10**: `compliance_content_type` enum 10종이 M0 active라면서 `ClinicProfile/DoctorProfile/LocationProfile/ArticleCategory`까지 포함한다. plan scope의 6 entity와 맞지 않고 ArticleCategory는 CONTENT_STANDARDS상 룰 미적용이다. 위치: line 79~83, 153. 권장 patch: enum은 C-10 풀 17종을 쓰거나, M0 active/allowed submit 타입을 별도 allowlist로 분리한다.

- **CAM-11**: DATA_MODEL C-10의 `featureContentType` 누락이 CA-DEFER-13에 명시되지 않았다. 위치: plan line 88~90, 152~153. 근거: DATA_MODEL C-10 line 771~773. 권장 patch: Feature 토큰과 `featureContentType`을 함께 CA-DEFER-13/CA-DEFER-01에 매핑한다.

- **CAM-12**: C-10 풀명세 중 `mediaThresholdOperationalInput`이 CA-DEFER-13 목록에서 빠졌다. 위치: plan line 61, 65, 549. 근거: DATA_MODEL line 796~797. 권장 patch: `mediaThresholdAssessment`와 `mediaThresholdOperationalInput`을 분리해 CA-DEFER-09/13에 적는다.

- **CAM-13**: ReviewQueueEntry `status='cancelled'`가 REVIEW_WORKFLOW 큐 상태 SoT에 없다. 위치: plan line 162. 근거: REVIEW_WORKFLOW § 3은 큐 3종과 처리 흐름만 정의, plan SoT 요약은 open/in-progress/resolved 3종. 권장 patch: cancelled를 추가하려면 REVIEW_WORKFLOW cascade를 명시하거나 M0 enum에서 제거한다.

- **CAM-14**: ReviewQueueEntry `compliance_record_id`가 nullable이다. content-gate M0 큐는 ComplianceRecord pre-publish 참조가 핵심인데 nullable이면 고아 큐가 가능하다. 위치: line 171~190. 권장 patch: M0 `content-gate`에서는 NOT NULL로 두거나 queue_type별 partial CHECK를 둔다.

- **CAM-15**: `required_roles` JSONB는 순서/중복/enum 검증이 없다. 위치: line 174, 190. 근거: RISK_LEVELS ApproverRole enum medical/legal/operator/client. 권장 patch: text[] enum array 또는 JSONB CHECK로 `operator|medical|legal`만, 중복 없음, canonical sort를 보장한다.

- **CAM-16**: `finalRoles` 계산이 `requiredApproverRoles`를 받지만 `evaluatePublishable()`는 이를 전달하지 않는다. 위치: line 294~303, 333~338. 근거: REVIEW_WORKFLOW § 4.1 line 215~220. 권장 patch: `auto_check_result.requiredApproverRoles ?? []`를 파싱해 finalRoles에 넣고, unknown role은 fail closed.

- **CAM-17**: `approveContent()`가 entity row 상태를 어떻게 `review-queued → in-review`로 전환하는지 불명확하다. 위치: line 448~463, 474~482. 근거: REVIEW_WORKFLOW § 2.3 line 134~136. 권장 patch: assign/pickup 액션을 추가하거나 approve 첫 호출이 atomic하게 open entry를 in-progress/in-review로 전환한다고 명시한다.

- **CAM-18**: form status select 9-state 활성화는 직접 상태 우회 위험이 크다. 위치: line 422~423. 기존 save actions는 `operator-edit-content`로 status를 저장한다. 권장 patch: status select에서 `published`/`approved`/`publishable` 직접 선택을 제거하고 workflow actions로만 전이한다. 최소한 기존 save actions를 `assertTransitionAllowed` 경유로 전면 교체해야 한다.

- **CAM-19**: Publication/MediaAppearance에는 DB status skeleton CHECK가 원래 없는데 “published unlock”으로 묶어 설명한다. 위치: line 43, 263~276. 근거: EAT_CONTENT line 443 — DB CHECK 없이 form schema만 draft. 권장 patch: 두 entity는 “form/zod unlock + compliance_record_id ADD”로 표현을 정정한다.

- **CAM-20**: audit event 4종이 REVIEW_WORKFLOW/ADMIN_UI audit matrix에 cascade되지 않았다. 위치: line 46, 526. 근거: ADMIN_UI_SKELETON audit_event matrix는 `content-saved/deleted` 중심이고 tx 밖 emit 정책을 둔다. 권장 patch: eventType, payload shape, emit 위치(tx commit 후 base role), 실패 정책을 ADMIN_UI_SKELETON_PLAN 또는 REVIEW_WORKFLOW에 cascade한다.

- **CAM-21**: notifications가 완전히 빠져 LL-DEFER-01의 “NotificationEvent envelope” 해소와 맞지 않다. 위치: plan line 25~26, 528. 근거: LOCATION_LEGAL_PLAN line 57, 548; REVIEW_WORKFLOW § 9.1.1 line 523. 권장 patch: M0에서 notifications 미구현이면 LL-DEFER-01은 “발행 게이트 부분 해소”로 낮추고 NotificationEvent는 CA-DEFER 별도 항목으로 둔다.

## minor
- **CAM-22**: line 5의 “역할 2종 활성화”는 plan 본문 operator·medical·legal 3종과 불일치한다. “client 제외 3종”으로 정정.

- **CAM-23**: manifest 단계 수가 틀렸다. 기존 16 + C0014/C0015/C0016 = 19인데 line 5와 525는 18로 쓴다. `CA-CASCADE-05`도 19단계로 정정.

- **CAM-24**: line 25는 “4 entity”라고 쓰고 괄호에는 6 entity를 열거한다. “6 entity”로 정정.

- **CAM-25**: C0014 주석이 `C-08 ComplianceRecord`라고 되어 있으나 SoT는 C-10이다. 위치: line 34. 정정 필요.

- **CAM-26**: `record_phase`는 snake_case, 본문은 `recordPhase`가 섞인다. SQL/TS/문서 표기 변환 규칙을 한 줄 추가하는 게 좋다.

- **CAM-27**: advisory lock key `hashtext()`는 32-bit라 충돌 가능성이 있다. 위치: line 466. 권장 patch: `pg_advisory_xact_lock(hashtextextended(...))` 또는 UUID를 2개 int로 나누는 방식을 명시한다.

- **CAM-28**: 시나리오 13은 FAQ JSON-LD public rendering까지 포함해 compliance-assistant M0 검증 범위를 벗어난다. 위치: line 506. 권장 patch: compliance side는 “published FAQ row가 ComplianceRecord 없이는 불가”로 두고 JSON-LD는 EAT_CONTENT/PSR 회귀 테스트로 분리한다.

## acceptance precondition 점검
- CA-DEFER 매핑 완비성: **FAIL** — `featureContentType`, `mediaThresholdOperationalInput`, NotificationEvent, LegalDocument check 면제 envelope, audit matrix cascade가 누락/불명확.
- 6 entity status unlock CHECK 4건 정합: **FAIL** — existing published row backfill/NOT VALID 전략 부재, published record phase 보장 부재.
- finalRoles 공식 정합: **FAIL** — 공식 자체는 비슷하나 `evaluatePublishable()`가 `requiredApproverRoles[]`를 반영하지 않고, High 가상 finding/explicit MAX 결합이 깨져 최종 역할 산정 입력이 틀릴 수 있다.
