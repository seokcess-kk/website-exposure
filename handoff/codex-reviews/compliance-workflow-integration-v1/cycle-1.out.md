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
session id: 019e3ab3-73d9-7ff2-923c-d1339ebb9003
--------
user
Review 4 entity workflow 통합 — Article 패턴 동일 복제. **cycle 1**. compliance-assistant M0 code v1.0 (157 cycle 1284) 직후 후속 작업.

## SoT
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 § 5.2 CA-UI-02 / § 6 CA-ACTION
- `apps/web/src/components/forms/ArticleForm.tsx` (status read-only display 기준 패턴)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (saveArticle current-status pattern)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx` (WorkflowActionButtons mount 기준)

## 변경 entity 4종 (Article 외)
- **TreatmentPage**: form/actions/edit page 모두
- **FAQ**: form/actions/edit page 모두
- **Publication**: form/actions/edit page 모두
- **MediaAppearance**: form/actions/edit page 모두

## scope 외 (별 cycle)
- **LegalDocument**: clinic-profile 통합 form 안에 있어 별 cycle (LL-WORKFLOW-INTEGRATION marker)

## 각 entity 별 patch 3종 (동일 패턴)

### Form (status select → read-only display)
- `<SelectField name="status" ... />` → `<label><input name="status" value={v.status} readOnly /></label>` (slate-100 bg · disabled appearance)

### actions.ts (save action)
- update path: `beforeStatus` 추출 (FOR UPDATE) → UPDATE SET 안 status 제거 → return mode/currentStatus
- insert path: status='draft' hard-coded → return mode "insert"/currentStatus: "draft"
- audit emit payload: `status: txResult.currentStatus` (form 변조 방지)

### edit page ([slug]/page.tsx)
- WorkflowActionButtons import 추가
- form 위에 `<WorkflowActionButtons contentType="..." currentStatus={initial.status} contentRef={params.slug} />` 추가

## What to check (cycle 1)

### Plan SoT 합치 (CAM-18 정합)
- 4 entity form 안 status select 제거 → read-only display (uneditable)
- 4 entity save action 안 status field 무시 — current row.status 보존
- 4 entity 신규 row 항상 'draft' (form 변조 시도 차단)
- audit emit payload `status: txResult.currentStatus` (form 변조 방지)
- WorkflowActionButtons 4 entity edit page 안 mount 위치 (form 위 · ArticleForm 정합)

### TS / 보안 / 정합성
- TreatmentPage/Publication/MediaAppearance/FAQ form/actions/edit page 패턴 일관성
- 직접 변조된 form `status='published'` 시 server 측 어떻게 차단되는지 (action 안 status field 무시 → 항상 currentStatus 보존)
- WorkflowActionButtons currentStatus prop type 일관

### scope 외 (LegalDocument)
- LegalDocument 별 cycle marker — clinic-profile 통합 form 안 5 LegalDocument 동시 다룸 → LL-WORKFLOW-INTEGRATION 신설 명시

## Output (한국어 · 간결)

```
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
## major
## minor

## acceptance precondition 점검
- 4 entity form status read-only: <PASS|FAIL>
- 4 entity save action status 무시 + currentStatus 보존: <PASS|FAIL>
- 4 entity edit page WorkflowActionButtons mount: <PASS|FAIL>
- LegalDocument scope 분리 명시: <PASS|FAIL>
```

가능한 한 광범위하게 보고, file:line 인용. 한국어 응답.

codex
요청 범위가 코드 리뷰라서 먼저 SoT 문서와 Article 기준 구현, 그리고 4개 entity의 form/actions/page를 함께 대조하겠습니다. 변경 여부와 라인 인용이 중요하므로 파일 위치를 넓게 확인한 뒤 findings만 압축해서 드리겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"WorkflowActionButtons|name=\\\"status\\\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md apps/web/src/components/forms/ArticleForm.tsx apps/web/src/components/forms/TreatmentPageForm.tsx apps/web/src/components/forms/FAQForm.tsx apps/web/src/components/forms/PublicationForm.tsx apps/web/src/components/forms/MediaAppearanceForm.tsx" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"WorkflowActionButtons|currentStatus|status: txResult|beforeStatus|FOR UPDATE|status =|status\\)|status,\" apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx" in C:\Users\assag\solution\website-exposure
2026-05-18T10:48:40.053512Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:WorkflowActionButtons|name=\)
    ^
error: unclosed group

 exited 1 in 607ms:
rg: regex parse error:
    (?:WorkflowActionButtons|name=\)
    ^
error: unclosed group

2026-05-18T10:48:40.224814Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … FOR UPDATE|status =|status\)|status," apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 774ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … FOR UPDATE|status =|status\)|status," apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
첫 검색은 PowerShell에서 괄호가 있는 경로와 따옴표 이스케이프 때문에 실패했습니다. 같은 대상을 경로 단위로 안전하게 다시 읽겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|name=\"status\"|SelectField|status: txResult|beforeStatus|FOR UPDATE|LL-WORKFLOW-INTEGRATION|LegalDocument' 'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' 'apps/web/src/components/forms/ArticleForm.tsx' 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'WorkflowActionButtons|currentStatus|status: txResult|beforeStatus|FOR UPDATE|status =|status\\)|status,' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 571ms:
apps/web/src/components/forms/MediaAppearanceForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/MediaAppearanceForm.tsx:77:      <SelectField name="channelType" label="채널 종류" required value={v.channelType} onChange={(x) => set("channelType", x)} options={CHANNEL_OPTIONS} errors={fieldErrors.channelType} hint="v0.1 단계 모두 schema.org VideoObject 단일화" />
apps/web/src/components/forms/MediaAppearanceForm.tsx:83:      <SelectField
apps/web/src/components/forms/MediaAppearanceForm.tsx:94:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/PublicationForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/PublicationForm.tsx:80:      <SelectField
apps/web/src/components/forms/PublicationForm.tsx:92:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/FAQForm.tsx:7:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/FAQForm.tsx:74:      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
apps/web/src/components/forms/FAQForm.tsx:75:      <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
apps/web/src/components/forms/FAQForm.tsx:76:      <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
apps/web/src/components/forms/FAQForm.tsx:80:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/TreatmentPageForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/TreatmentPageForm.tsx:81:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/TreatmentPageForm.tsx:83:      <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />
apps/web/src/components/forms/ArticleForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src/components/forms/ArticleForm.tsx:89:        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
apps/web/src/components/forms/ArticleForm.tsx:91:      <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
apps/web/src/components/forms/ArticleForm.tsx:92:      <SelectField
apps/web/src/components/forms/ArticleForm.tsx:101:      <SelectField
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:13:- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:28:- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:30:- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:33:- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:90:  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:126:    record_phase <> 'published' OR content_type <> 'LegalDocument'
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:155:- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:157:- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:236:-- (Step 1) LegalDocument · FAQ CHECK 해제
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:301:-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:441:  if (contentType === "LegalDocument") roles.add("legal");
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:508:  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:539:    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:540:    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:544:// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:545://   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:562:      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:577:  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:578:  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:579:  if (input.contentType === "LegalDocument") {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:581:      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:582:      "Use buildLegalDocumentExemptEnvelope() instead."
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:636:const envelope = contentType === "LegalDocument"
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:637:  ? buildLegalDocumentExemptEnvelope(input)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:767:| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:838:| 2026-05-18 | v0.5 | **Codex 자동 비평 cycle 4 1 finding (CAM4-01 = CAM3-02 잔재 정정) 전건 수용 patch**: § 1.1 LegalDocument 면제 항목 안 `auto_check_result 슬롯에 envelope 저장` 표현 정정 → result 슬롯은 SoT 7 필드만 · exemptReason 은 `compliance_record.metadata` 슬롯. 누계 cycle 1~4 = 36 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 exited 1 in 570ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:78:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:109:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:113:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:80:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:111:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:115:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:56:               status::text AS status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:85:          status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:122:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:126:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:81:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:114:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:118:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:45:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:50:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:68:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:88:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:101:          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:117:      let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:120:          SELECT id, status::text AS status, author_doctor_id, category_id FROM article
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:122:           FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:127:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:191:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:197:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:204:          'draft'::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:211:      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:237:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:45:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:50:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:71:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:95:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:108:          payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:44:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:49:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:52:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:71:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:96:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:109:          payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
rg: apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T10:48:57.504204Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:78:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:109:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:113:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:80:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:111:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:115:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:56:               status::text AS status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:85:          status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:122:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:126:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:81:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:114:      <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:118:        currentStatus={bundle.initial.status}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:45:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:50:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:68:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:88:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:101:          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:117:      let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:120:          SELECT id, status::text AS status, author_doctor_id, category_id FROM article
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:122:           FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:127:        beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:191:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:197:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:204:          'draft'::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:211:      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:237:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:45:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:50:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:53:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:71:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:95:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:108:          payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:44:        let beforeStatus: string = "draft";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:49:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:52:          beforeStatus = beforeRows[0]!.status;
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:71:          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:96:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:109:          payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
rg: apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/actions.ts: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: apps/web/src/app/(admin)/admin/[instanceSlug]/treatment-pages/[slug]/page.tsx: 지정된 경로를 찾을 수 없습니다. (os error 3)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg 'treatment|TreatmentPage|faq|publication|media-appearance|MediaAppearance'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' -Raw" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' -Raw" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' -Raw" in C:\Users\assag\solution\website-exposure
 succeeded in 665ms:
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0012_faq.sql
packages\core-content\migrations\C0010_publication.sql
apps\web\src\components\forms\MediaAppearanceForm.tsx
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(site)\[instanceSlug]\faq\page.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx

2026-05-18T10:49:06.801508Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 766ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 752ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/medi[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 769ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/publ[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T10:49:06.808268Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/medi[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T10:49:06.809991Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path 'apps/web/src/app/(admin)/admin/[instanceSlug]/publ[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

codex
TreatmentPage의 실제 admin 경로는 `treatment-pages`가 아니라 `treatments`로 확인됩니다. 이제 각 action과 edit page를 라인 번호 포함으로 읽어 status 보존이 실제 SQL에 반영됐는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' | ForEach-Object { "'$i++; if ($_ -match '"'beforeStatus|FOR UPDATE|UPDATE treatment_page|INSERT INTO treatment_page|status|currentStatus|payload') { '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' | ForEach-Object { "'$i++; if ($_ -match '"'beforeStatus|FOR UPDATE|UPDATE faq|INSERT INTO faq|status|currentStatus|payload') { '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' | ForEach-Object { "'$i++; if ($_ -match '"'beforeStatus|FOR UPDATE|UPDATE publication|INSERT INTO publication|status|currentStatus|payload') { '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' | ForEach-Object { "'$i++; if ($_ -match '"'beforeStatus|FOR UPDATE|UPDATE media_appearance|INSERT INTO media_appearance|status|currentStatus|payload') { '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 677ms:
2: //   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).
45:         let beforeStatus: string = "draft";
47:           const beforeRows = await tx<{ id: string; status: string }[]>`
48:             SELECT id, status::text AS status FROM faq
50:              FOR UPDATE
53:           beforeStatus = beforeRows[0]!.status;
55:           // CAM-18 정정: status workflow action 통해서만 전이. saveFaq 는 본문 / metadata 만.
57:             UPDATE faq
68:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
73:           INSERT INTO faq (
75:             category_id, author_doctor_id, related_treatment_id, status
85:             'draft'::content_publication_status
88:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
100:           // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
101:           payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
162:         payload: { contentType: "FAQ", slug },

 succeeded in 679ms:
20: const PUBLICATION_STATUSES = [
46:   status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
94:       // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
95:       //   saveTreatmentPage 은 본문 / metadata 만 갱신 — 현재 row status 보존.
96:       let beforeStatus: string = "draft";
98:         const beforeRows = await tx<{ id: string; status: string }[]>`
99:           SELECT id, status::text AS status FROM treatment_page
101:            FOR UPDATE
104:         beforeStatus = beforeRows[0]!.status;
106:           UPDATE treatment_page
116:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
121:         INSERT INTO treatment_page (
122:           instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url
129:           'draft'::content_publication_status,
134:       return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
147:           // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
148:           payload: { contentType: "TreatmentPage", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
212:         payload: { contentType: "TreatmentPage", slug },

 succeeded in 691ms:
44:         let beforeStatus: string = "draft";
46:           const beforeRows = await tx<{ id: string; status: string }[]>`
47:             SELECT id, status::text AS status FROM publication
49:              FOR UPDATE
52:           beforeStatus = beforeRows[0]!.status;
54:           // CAM-18 정정: status workflow action 통해서만 전이.
56:             UPDATE publication
71:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
76:           INSERT INTO publication (
79:             author_doctor_id, status
93:             'draft'::content_publication_status
96:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
108:           // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
109:           payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
170:         payload: { contentType: "Publication", slug },

 succeeded in 672ms:
45:         let beforeStatus: string = "draft";
47:           const beforeRows = await tx<{ id: string; status: string }[]>`
48:             SELECT id, status::text AS status FROM media_appearance
50:              FOR UPDATE
53:           beforeStatus = beforeRows[0]!.status;
55:           // CAM-18 정정: status workflow action 통해서만 전이.
57:             UPDATE media_appearance
71:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
76:           INSERT INTO media_appearance (
79:             author_doctor_id, status
92:             'draft'::content_publication_status
95:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
107:           // CAMC-12 정정: form 안 status 무시 — locked row 의 current status (DB 진실) 사용
108:           payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: txResult.currentStatus, originalSlug },
169:         payload: { contentType: "MediaAppearance", slug },

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' | ForEach-Object { "'$i++; if ($i -ge 90 -and $i -le 135) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' | ForEach-Object { "'$i++; if ($i -ge 42 -and $i -le 89) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' | ForEach-Object { "'$i++; if ($i -ge 42 -and $i -le 97) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' | ForEach-Object { "'$i++; if ($i -ge 43 -and $i -le 96) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 632ms:
90:   try {
91:     const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
92:       assertActionEligibility(ctx, "operator-edit-content");
93: 
94:       // CAM-18 정정: status / published_at 은 workflow action (submitForReview · publishContent) 만 변경.
95:       //   saveTreatmentPage 은 본문 / metadata 만 갱신 — 현재 row status 보존.
96:       let beforeStatus: string = "draft";
97:       if (originalSlug !== null) {
98:         const beforeRows = await tx<{ id: string; status: string }[]>`
99:           SELECT id, status::text AS status FROM treatment_page
100:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
101:            FOR UPDATE
102:         `;
103:         if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
104:         beforeStatus = beforeRows[0]!.status;
105:         await tx`
106:           UPDATE treatment_page
107:              SET slug = ${parsed.data.slug},
108:                  title = ${parsed.data.title},
109:                  summary = ${parsed.data.summary},
110:                  body_markdown = ${parsed.data.bodyMarkdown},
111:                  risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
112:                  hero_image_url = ${parsed.data.heroImageUrl ?? null},
113:                  updated_at = now()
114:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
115:         `;
116:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
117:       }
118: 
119:       // 신규 row 는 항상 'draft' 로 시작 — workflow action 통해서만 전이.
120:       await tx`
121:         INSERT INTO treatment_page (
122:           instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url
123:         ) VALUES (
124:           ${ctx.instanceId}::uuid,
125:           ${parsed.data.slug},
126:           ${parsed.data.title},
127:           ${parsed.data.summary},
128:           ${parsed.data.bodyMarkdown},
129:           'draft'::content_publication_status,
130:           ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
131:           ${parsed.data.heroImageUrl ?? null}
132:         )
133:       `;
134:       return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
135:     });

 succeeded in 636ms:
42:       async (tx, ctx) => {
43:         assertActionEligibility(ctx, "operator-edit-content");
44: 
45:         let beforeStatus: string = "draft";
46:         if (originalSlug !== null) {
47:           const beforeRows = await tx<{ id: string; status: string }[]>`
48:             SELECT id, status::text AS status FROM faq
49:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
50:              FOR UPDATE
51:           `;
52:           if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
53:           beforeStatus = beforeRows[0]!.status;
54: 
55:           // CAM-18 정정: status workflow action 통해서만 전이. saveFaq 는 본문 / metadata 만.
56:           await tx`
57:             UPDATE faq
58:                SET slug = ${parsed.data.slug},
59:                    question = ${parsed.data.question},
60:                    answer = ${parsed.data.answer},
61:                    display_order = ${Number(parsed.data.displayOrder)},
62:                    category_id = ${parsed.data.categoryId ?? null}::uuid,
63:                    author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
64:                    related_treatment_id = ${parsed.data.relatedTreatmentId ?? null}::uuid,
65:                    updated_at = now()
66:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
67:           `;
68:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
69:         }
70: 
71:         // 신규 row 항상 'draft' — workflow action 통해서만 전이.
72:         await tx`
73:           INSERT INTO faq (
74:             instance_id, slug, question, answer, display_order,
75:             category_id, author_doctor_id, related_treatment_id, status
76:           ) VALUES (
77:             ${ctx.instanceId}::uuid,
78:             ${parsed.data.slug},
79:             ${parsed.data.question},
80:             ${parsed.data.answer},
81:             ${Number(parsed.data.displayOrder)},
82:             ${parsed.data.categoryId ?? null}::uuid,
83:             ${parsed.data.authorDoctorId ?? null}::uuid,
84:             ${parsed.data.relatedTreatmentId ?? null}::uuid,
85:             'draft'::content_publication_status
86:           )
87:         `;
88:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
89:       },

 succeeded in 632ms:
42:         assertActionEligibility(ctx, "operator-edit-content");
43: 
44:         let beforeStatus: string = "draft";
45:         if (originalSlug !== null) {
46:           const beforeRows = await tx<{ id: string; status: string }[]>`
47:             SELECT id, status::text AS status FROM publication
48:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
49:              FOR UPDATE
50:           `;
51:           if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
52:           beforeStatus = beforeRows[0]!.status;
53: 
54:           // CAM-18 정정: status workflow action 통해서만 전이.
55:           await tx`
56:             UPDATE publication
57:                SET slug = ${parsed.data.slug},
58:                    title = ${parsed.data.title},
59:                    authors = ${JSON.stringify(parsed.data.authors)}::jsonb,
60:                    journal = ${parsed.data.journal ?? null},
61:                    published_date = ${parsed.data.publishedDate}::date,
62:                    doi = ${parsed.data.doi ?? null},
63:                    pubmed_id = ${parsed.data.pubmedId ?? null},
64:                    url = ${parsed.data.url},
65:                    thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
66:                    summary = ${parsed.data.summary},
67:                    author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
68:                    updated_at = now()
69:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
70:           `;
71:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
72:         }
73: 
74:         // 신규 row 항상 'draft' — workflow action 통해서만 전이.
75:         await tx`
76:           INSERT INTO publication (
77:             instance_id, slug, title, authors, journal, published_date,
78:             doi, pubmed_id, url, thumbnail_url, summary,
79:             author_doctor_id, status
80:           ) VALUES (
81:             ${ctx.instanceId}::uuid,
82:             ${parsed.data.slug},
83:             ${parsed.data.title},
84:             ${JSON.stringify(parsed.data.authors)}::jsonb,
85:             ${parsed.data.journal ?? null},
86:             ${parsed.data.publishedDate}::date,
87:             ${parsed.data.doi ?? null},
88:             ${parsed.data.pubmedId ?? null},
89:             ${parsed.data.url},
90:             ${parsed.data.thumbnailUrl ?? null},
91:             ${parsed.data.summary},
92:             ${parsed.data.authorDoctorId ?? null}::uuid,
93:             'draft'::content_publication_status
94:           )
95:         `;
96:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
97:       },

 succeeded in 651ms:
43:         assertActionEligibility(ctx, "operator-edit-content");
44: 
45:         let beforeStatus: string = "draft";
46:         if (originalSlug !== null) {
47:           const beforeRows = await tx<{ id: string; status: string }[]>`
48:             SELECT id, status::text AS status FROM media_appearance
49:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
50:              FOR UPDATE
51:           `;
52:           if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
53:           beforeStatus = beforeRows[0]!.status;
54: 
55:           // CAM-18 정정: status workflow action 통해서만 전이.
56:           await tx`
57:             UPDATE media_appearance
58:                SET slug = ${parsed.data.slug},
59:                    title = ${parsed.data.title},
60:                    channel_name = ${parsed.data.channelName},
61:                    channel_type = ${parsed.data.channelType}::media_channel_type,
62:                    published_date = ${parsed.data.publishedDate}::date,
63:                    duration_seconds = ${durationSeconds},
64:                    url = ${parsed.data.url},
65:                    thumbnail_url = ${parsed.data.thumbnailUrl ?? null},
66:                    summary = ${parsed.data.summary},
67:                    author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
68:                    updated_at = now()
69:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
70:           `;
71:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const, currentStatus: beforeStatus };
72:         }
73: 
74:         // 신규 row 항상 'draft' — workflow action 통해서만 전이.
75:         await tx`
76:           INSERT INTO media_appearance (
77:             instance_id, slug, title, channel_name, channel_type, published_date,
78:             duration_seconds, url, thumbnail_url, summary,
79:             author_doctor_id, status
80:           ) VALUES (
81:             ${ctx.instanceId}::uuid,
82:             ${parsed.data.slug},
83:             ${parsed.data.title},
84:             ${parsed.data.channelName},
85:             ${parsed.data.channelType}::media_channel_type,
86:             ${parsed.data.publishedDate}::date,
87:             ${durationSeconds},
88:             ${parsed.data.url},
89:             ${parsed.data.thumbnailUrl ?? null},
90:             ${parsed.data.summary},
91:             ${parsed.data.authorDoctorId ?? null}::uuid,
92:             'draft'::content_publication_status
93:           )
94:         `;
95:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const, currentStatus: "draft" };
96:       },

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/TreatmentPageForm.tsx' | ForEach-Object { "'$i++; if ($i -ge 72 -and $i -le 84) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/FAQForm.tsx' | ForEach-Object { "'$i++; if ($i -ge 76 -and $i -le 82) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/PublicationForm.tsx' | ForEach-Object { "'$i++; if ($i -ge 78 -and $i -le 94) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/MediaAppearanceForm.tsx' | ForEach-Object { "'$i++; if ($i -ge 81 -and $i -le 96) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 609ms:
76:       <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
77:       {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
78:       <label className="flex flex-col gap-1 text-sm">
79:         <span>발행 상태 (workflow actions 통해서만 전이)</span>
80:         <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
81:       </label>
82: 

 succeeded in 615ms:
72: 
73:       <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} hint="3~100자" />
74:       <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
75:       <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={160} hint="50~160자 (검색 결과 노출용)" />
76:       <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={14} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={50000} hint="Markdown 형식" />
77:       <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
78:       {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
79:       <label className="flex flex-col gap-1 text-sm">
80:         <span>발행 상태 (workflow actions 통해서만 전이)</span>
81:         <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
82:       </label>
83:       <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />
84: 

 succeeded in 623ms:
81:       <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
82:       <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
83:       <SelectField
84:         name="authorDoctorId"
85:         label="출연 의료진 (선택)"
86:         value={v.authorDoctorId}
87:         onChange={(x) => set("authorDoctorId", x)}
88:         options={doctorOptions}
89:         errors={fieldErrors.authorDoctorId}
90:       />
91:       {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
92:       <label className="flex flex-col gap-1 text-sm">
93:         <span>발행 상태 (workflow actions 통해서만 전이)</span>
94:         <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
95:       </label>
96: 

 succeeded in 641ms:
78:       <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
79:       <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
80:       <SelectField
81:         name="authorDoctorId"
82:         label="대표 의료진 (선택)"
83:         value={v.authorDoctorId}
84:         onChange={(x) => set("authorDoctorId", x)}
85:         options={doctorOptions}
86:         errors={fieldErrors.authorDoctorId}
87:         hint="저자 의료진을 선택하면 해당 Doctor Profile 페이지의 학술 권위 시그널로 출력됩니다."
88:       />
89:       {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
90:       <label className="flex flex-col gap-1 text-sm">
91:         <span>발행 상태 (workflow actions 통해서만 전이)</span>
92:         <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
93:       </label>
94: 

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -le 20 -or ($i -ge 108 -and $i -le 126)) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -le 18 -or ($i -ge 110 -and $i -le 122)) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -le 18 -or ($i -ge 107 -and $i -le 119)) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -le 18 -or ($i -ge 105 -and $i -le 117)) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 652ms:
1: import Link from "next/link";
2: import { notFound, redirect } from "next/navigation";
3: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
4: 
5: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
6: import { requirePageContext } from "@/lib/page-context";
7: import { withSkeletonTx } from "@/lib/tenant";
8: import { FaqForm, type FaqInitial } from "@/components/forms/FaqForm";
9: import { DeleteForm } from "@/components/forms/DeleteForm";
10: import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
11: import { deleteFaq, saveFaq } from "../actions";
12: 
13: export default async function FaqEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
14:   let pageCtx;
15:   try {
16:     pageCtx = await requirePageContext(params.instanceSlug);
17:   } catch (err) {
18:     if (err instanceof TenantResolveError) {
110:       <header className="flex items-center justify-between">
111:         <h1 className="text-2xl font-semibold">FAQ 편집 · {bundle.initial.question.slice(0, 40)}{bundle.initial.question.length > 40 ? "…" : ""}</h1>
112:         <Link href={`/admin/${params.instanceSlug}/faqs`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
113:       </header>
114:       <WorkflowActionButtons
115:         instanceSlug={params.instanceSlug}
116:         contentType="FAQ"
117:         contentRef={params.slug}
118:         currentStatus={bundle.initial.status}
119:       />
120:       <FaqForm
121:         action={boundSave}
122:         initial={bundle.initial}

 succeeded in 671ms:
1: // @glitzy/web/(admin)/[instanceSlug]/treatments/[slug] — 편집
2: // cycle2-3entity WEB-23: requirePageContext 통일
3: import Link from "next/link";
4: import { notFound, redirect } from "next/navigation";
5: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
6: 
7: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
8: import { requirePageContext } from "@/lib/page-context";
9: import { withSkeletonTx } from "@/lib/tenant";
10: import { TreatmentPageForm, type TreatmentPageInitial } from "@/components/forms/TreatmentPageForm";
11: import { DeleteForm } from "@/components/forms/DeleteForm";
12: import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
13: import { deleteTreatmentPage, saveTreatmentPage } from "../actions";
14: 
15: export default async function TreatmentEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
16:   let pageCtx;
17:   try {
18:     pageCtx = await requirePageContext(params.instanceSlug);
19:   } catch (err) {
20:     if (err instanceof TenantResolveError) {

 succeeded in 658ms:
1: import Link from "next/link";
2: import { notFound, redirect } from "next/navigation";
3: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
4: 
5: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
6: import { requirePageContext } from "@/lib/page-context";
7: import { withSkeletonTx } from "@/lib/tenant";
8: import { PublicationForm, type PublicationInitial } from "@/components/forms/PublicationForm";
9: import { DeleteForm } from "@/components/forms/DeleteForm";
10: import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
11: import { deletePublication, savePublication } from "../actions";
12: 
13: export default async function PublicationEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
14:   let pageCtx;
15:   try {
16:     pageCtx = await requirePageContext(params.instanceSlug);
17:   } catch (err) {
18:     if (err instanceof TenantResolveError) {
107:       <header className="flex items-center justify-between">
108:         <h1 className="text-2xl font-semibold">학술 인용 편집 · {bundle.initial.title}</h1>
109:         <Link href={`/admin/${params.instanceSlug}/publications`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
110:       </header>
111:       <WorkflowActionButtons
112:         instanceSlug={params.instanceSlug}
113:         contentType="Publication"
114:         contentRef={params.slug}
115:         currentStatus={bundle.initial.status}
116:       />
117:       <PublicationForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
118:       <DeleteForm action={boundDelete} confirmMessage="정말 이 학술 인용을 삭제하시겠습니까?" />
119:     </main>

 succeeded in 652ms:
1: import Link from "next/link";
2: import { notFound, redirect } from "next/navigation";
3: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
4: 
5: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
6: import { requirePageContext } from "@/lib/page-context";
7: import { withSkeletonTx } from "@/lib/tenant";
8: import { MediaAppearanceForm, type MediaAppearanceInitial } from "@/components/forms/MediaAppearanceForm";
9: import { DeleteForm } from "@/components/forms/DeleteForm";
10: import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
11: import { deleteMediaAppearance, saveMediaAppearance } from "../actions";
12: 
13: export default async function MediaAppearanceEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
14:   let pageCtx;
15:   try {
16:     pageCtx = await requirePageContext(params.instanceSlug);
17:   } catch (err) {
18:     if (err instanceof TenantResolveError) {
105:       <header className="flex items-center justify-between">
106:         <h1 className="text-2xl font-semibold">미디어 출연 편집 · {bundle.initial.title}</h1>
107:         <Link href={`/admin/${params.instanceSlug}/media-appearances`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
108:       </header>
109:       <WorkflowActionButtons
110:         instanceSlug={params.instanceSlug}
111:         contentType="MediaAppearance"
112:         contentRef={params.slug}
113:         currentStatus={bundle.initial.status}
114:       />
115:       <MediaAppearanceForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
116:       <DeleteForm action={boundDelete} confirmMessage="정말 이 미디어 출연을 삭제하시겠습니까?" />
117:     </main>

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -ge 100 -and $i -le 125) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 545ms:
100:   );
101: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { "'$i++; if ($i -ge 78) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 571ms:
78: 
79:   const boundSave = saveTreatmentPage.bind(null, params.instanceSlug, params.slug);
80:   const boundDelete = deleteTreatmentPage.bind(null, params.instanceSlug, params.slug);
81: 
82:   return (
83:     <main className="flex flex-col gap-6">
84:       <header className="flex items-center justify-between">
85:         <h1 className="text-2xl font-semibold">시술 페이지 편집 · {initial.title}</h1>
86:         <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
87:       </header>
88: 
89:       <WorkflowActionButtons
90:         instanceSlug={params.instanceSlug}
91:         contentType="TreatmentPage"
92:         contentRef={params.slug}
93:         currentStatus={initial.status}
94:       />
95: 
96:       <TreatmentPageForm action={boundSave} initial={initial} isNew={false} />
97: 
98:       <DeleteForm action={boundDelete} confirmMessage="정말 이 시술 페이지를 삭제하시겠습니까?" />
99:     </main>
100:   );
101: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/WorkflowActionButtons.tsx' | ForEach-Object { "'$i++; if ($i -le 80) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'type .*Initial|status:' 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 568ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:8:import { MediaAppearanceForm, type MediaAppearanceInitial } from "@/components/forms/MediaAppearanceForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:47:          status: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:53:                 status::text AS status
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx:78:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:8:import { PublicationForm, type PublicationInitial } from "@/components/forms/PublicationForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:48:          status: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:53:                 status::text AS status
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx:80:            status: r.status,
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:10:import { TreatmentPageForm, type TreatmentPageInitial } from "@/components/forms/TreatmentPageForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:41:        status: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:46:               status::text AS status,
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx:60:        status: r.status,
apps/web/src/components/forms/TreatmentPageForm.tsx:9:export type TreatmentPageInitial = {
apps/web/src/components/forms/TreatmentPageForm.tsx:14:  status: string;
apps/web/src/components/forms/TreatmentPageForm.tsx:24:  status: "draft",
apps/web/src/components/forms/MediaAppearanceForm.tsx:9:export type MediaAppearanceInitial = {
apps/web/src/components/forms/MediaAppearanceForm.tsx:20:  status: string;
apps/web/src/components/forms/MediaAppearanceForm.tsx:34:  status: "draft",
apps/web/src/components/forms/PublicationForm.tsx:9:export type PublicationInitial = {
apps/web/src/components/forms/PublicationForm.tsx:21:  status: string;
apps/web/src/components/forms/PublicationForm.tsx:36:  status: "draft",
apps/web/src/components/forms/FAQForm.tsx:10:export type FaqInitial = {
apps/web/src/components/forms/FAQForm.tsx:18:  status: string;
apps/web/src/components/forms/FAQForm.tsx:29:  status: "draft",
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:8:import { FaqForm, type FaqInitial } from "@/components/forms/FaqForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:46:          status: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:49:                 status::text AS status
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:81:            status: r.status,

 succeeded in 595ms:
1: // @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
2: "use client";
3: 
4: import { useFormState, useFormStatus } from "react-dom";
5: import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
6: import type { SubmitContentType } from "@/lib/compliance/types";
7: import type { SaveResult } from "@/lib/save-result";
8: 
9: export function WorkflowActionButtons({
10:   instanceSlug,
11:   contentType,
12:   contentRef,
13:   currentStatus,
14: }: {
15:   instanceSlug: string;
16:   contentType: SubmitContentType;
17:   contentRef: string;
18:   currentStatus: string;
19: }) {
20:   return (
21:     <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4">
22:       <div className="flex items-center gap-3 text-sm">
23:         <span className="text-slate-500">현재 상태:</span>
24:         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{currentStatus}</span>
25:       </div>
26:       {(currentStatus === "draft" || currentStatus === "rejected") && (
27:         <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
28:       )}
29:       {currentStatus === "publishable" && (
30:         <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
31:       )}
32:       {currentStatus === "review-queued" || currentStatus === "in-review" ? (
33:         <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
34:       ) : null}
35:       {currentStatus === "approved" ? (
36:         <p className="text-xs text-amber-700">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
37:       ) : null}
38:     </div>
39:   );
40: }
41: 
42: function SubmitForReviewForm({
43:   instanceSlug,
44:   contentType,
45:   contentRef,
46: }: {
47:   instanceSlug: string;
48:   contentType: SubmitContentType;
49:   contentRef: string;
50: }) {
51:   const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
52:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
53:   const err = state && state.ok === false ? state.formError : null;
54:   return (
55:     <form action={formAction} className="flex flex-col gap-2">
56:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
57:       <SubmitButton label="검수 요청" pendingLabel="요청 중…" color="bg-blue-700 hover:bg-blue-800" />
58:     </form>
59:   );
60: }
61: 
62: function PublishForm({
63:   instanceSlug,
64:   contentType,
65:   contentRef,
66: }: {
67:   instanceSlug: string;
68:   contentType: SubmitContentType;
69:   contentRef: string;
70: }) {
71:   const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
72:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
73:   const err = state && state.ok === false ? state.formError : null;
74:   return (
75:     <form action={formAction} className="flex flex-col gap-2">
76:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
77:       <SubmitButton label="발행" pendingLabel="발행 중…" color="bg-emerald-700 hover:bg-emerald-800" />
78:     </form>
79:   );
80: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'export type SubmitContentType|SubmitContentType|TreatmentPage|FAQ|Publication|MediaAppearance' 'apps/web/src/lib/compliance/types.ts' 'apps/web/src/lib/compliance/entity-actions.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 517ms:
apps/web/src/lib/compliance/entity-actions.ts:20:  type SubmitContentType,
apps/web/src/lib/compliance/entity-actions.ts:24:const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
apps/web/src/lib/compliance/entity-actions.ts:26:  TreatmentPage: "treatment_page",
apps/web/src/lib/compliance/entity-actions.ts:28:  FAQ: "faq",
apps/web/src/lib/compliance/entity-actions.ts:29:  Publication: "publication",
apps/web/src/lib/compliance/entity-actions.ts:30:  MediaAppearance: "media_appearance",
apps/web/src/lib/compliance/entity-actions.ts:33:const ENTITY_ROUTES: Record<SubmitContentType, string> = {
apps/web/src/lib/compliance/entity-actions.ts:35:  TreatmentPage: "treatments",
apps/web/src/lib/compliance/entity-actions.ts:37:  FAQ: "faqs",
apps/web/src/lib/compliance/entity-actions.ts:38:  Publication: "publications",
apps/web/src/lib/compliance/entity-actions.ts:39:  MediaAppearance: "media-appearances",
apps/web/src/lib/compliance/entity-actions.ts:44:  contentType: SubmitContentType,
apps/web/src/lib/compliance/entity-actions.ts:59:                 ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
apps/web/src/lib/compliance/entity-actions.ts:126:  contentType: SubmitContentType,
apps/web/src/lib/compliance/types.ts:10:  "Article", "TreatmentPage", "LegalDocument",
apps/web/src/lib/compliance/types.ts:11:  "FAQ", "Publication", "MediaAppearance",
apps/web/src/lib/compliance/types.ts:13:export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];
apps/web/src/lib/compliance/types.ts:15:export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' | ForEach-Object { "'$i++; if ($i -le 55) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' | ForEach-Object { "'$i++; if ($i -le 35) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' | ForEach-Object { "'$i++; if ($i -le 35) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' | ForEach-Object { "'$i++; if ($i -le 36) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 687ms:
1: // @glitzy/web/(admin)/[instanceSlug]/faqs/actions — EAT_CONTENT_PLAN v1.0
2: //   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).
3: 
4: "use server";
5: 
6: import { revalidatePath } from "next/cache";
7: import { notFound, redirect } from "next/navigation";
8: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
9: 
10: import { getSqlBase } from "@/lib/db";
11: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
12: import { withSkeletonTx } from "@/lib/tenant";
13: import { mapDbErrorToResult } from "@/lib/errors";
14: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
15: import { FaqInputSchema } from "@/lib/eat-content-schema";
16: import type { SaveResult } from "@/lib/save-result";
17: 
18: export type DeleteResult = { ok: true } | { ok: false; formError: string };
19: 
20: export async function saveFaq(
21:   instanceSlug: string,
22:   originalSlug: string | null,
23:   _prev: SaveResult | null,
24:   formData: FormData,
25: ): Promise<SaveResult> {
26:   const parsed = FaqInputSchema.safeParse(Object.fromEntries(formData));
27:   if (!parsed.success) {
28:     const fieldErrors: Record<string, string[]> = {};
29:     for (const issue of parsed.error.issues) {
30:       const field = issue.path.join(".") || "_";
31:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
32:     }
33:     return { ok: false, fieldErrors };
34:   }
35: 

 succeeded in 715ms:
1: // @glitzy/web/(admin)/[instanceSlug]/treatments/actions
2: // cycle1-3entity patch:
3: //   - WEB-01·04·06·08·10·15
4: //   - WEB-12 published_at 정책: unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade (Plan v1.0)
5: 
6: "use server";
7: 
8: import { revalidatePath } from "next/cache";
9: import { notFound, redirect } from "next/navigation";
10: import { z } from "zod";
11: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
12: 
13: import { getSqlBase } from "@/lib/db";
14: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
15: import { withSkeletonTx } from "@/lib/tenant";
16: import { mapDbErrorToResult } from "@/lib/errors";
17: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
18: import type { SaveResult } from "@/lib/save-result";
19: 
20: const PUBLICATION_STATUSES = [
21:   "draft", "review-queued", "in-review", "approved", "publishable",
22:   "published", "blocked", "rejected", "stale",
23: ] as const;
24: const RISK_LEVELS = ["Low", "Medium", "High"] as const;
25: 
26: const InputSchema = z.object({
27:   slug: z
28:     .string({ required_error: "slug 는 필수입니다." })
29:     .transform((v) => v.trim())
30:     .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
31:       message: "slug 는 3~100자 (소문자/숫자/하이픈) 이어야 합니다.",
32:     }),
33:   title: z
34:     .string({ required_error: "제목은 필수입니다." })
35:     .transform((v) => v.trim())
36:     .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
37:   summary: z
38:     .string({ required_error: "요약은 필수입니다." })
39:     .transform((v) => v.trim())
40:     .refine((v) => v.length >= 50 && v.length <= 160, { message: "요약은 50~160자" }),
41:   bodyMarkdown: z
42:     .string({ required_error: "본문은 필수입니다." })
43:     .min(1, "본문은 1자 이상이어야 합니다.")
44:     .max(50_000, "본문은 50000자를 넘을 수 없습니다."),
45:   // cycle5-3entity WEB-53: enum value mismatch (FormData 변조) 도 한국어 메시지
46:   status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
47:   riskLevel: z
48:     .string()
49:     .transform((v) => v.trim())
50:     .transform((v) => (v === "" ? null : v))
51:     .nullable()
52:     .optional()
53:     .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
54:       message: "위험도는 Low / Medium / High",
55:     }),

 succeeded in 674ms:
1: // @glitzy/web/(admin)/[instanceSlug]/publications/actions — EAT_CONTENT_PLAN v1.0
2: 
3: "use server";
4: 
5: import { revalidatePath } from "next/cache";
6: import { notFound, redirect } from "next/navigation";
7: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
8: 
9: import { getSqlBase } from "@/lib/db";
10: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
11: import { withSkeletonTx } from "@/lib/tenant";
12: import { mapDbErrorToResult } from "@/lib/errors";
13: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
14: import { PublicationInputSchema } from "@/lib/eat-content-schema";
15: import type { SaveResult } from "@/lib/save-result";
16: 
17: export type DeleteResult = { ok: true } | { ok: false; formError: string };
18: 
19: export async function savePublication(
20:   instanceSlug: string,
21:   originalSlug: string | null,
22:   _prev: SaveResult | null,
23:   formData: FormData,
24: ): Promise<SaveResult> {
25:   const parsed = PublicationInputSchema.safeParse(Object.fromEntries(formData));
26:   if (!parsed.success) {
27:     const fieldErrors: Record<string, string[]> = {};
28:     for (const issue of parsed.error.issues) {
29:       const field = issue.path.join(".") || "_";
30:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
31:     }
32:     return { ok: false, fieldErrors };
33:   }
34: 
35:   const aCtx = await resolveActionContext(instanceSlug);

 succeeded in 685ms:
1: // @glitzy/web/(admin)/[instanceSlug]/media-appearances/actions — EAT_CONTENT_PLAN v1.0
2: 
3: "use server";
4: 
5: import { revalidatePath } from "next/cache";
6: import { notFound, redirect } from "next/navigation";
7: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
8: 
9: import { getSqlBase } from "@/lib/db";
10: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
11: import { withSkeletonTx } from "@/lib/tenant";
12: import { mapDbErrorToResult } from "@/lib/errors";
13: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
14: import { MediaAppearanceInputSchema } from "@/lib/eat-content-schema";
15: import type { SaveResult } from "@/lib/save-result";
16: 
17: export type DeleteResult = { ok: true } | { ok: false; formError: string };
18: 
19: export async function saveMediaAppearance(
20:   instanceSlug: string,
21:   originalSlug: string | null,
22:   _prev: SaveResult | null,
23:   formData: FormData,
24: ): Promise<SaveResult> {
25:   const parsed = MediaAppearanceInputSchema.safeParse(Object.fromEntries(formData));
26:   if (!parsed.success) {
27:     const fieldErrors: Record<string, string[]> = {};
28:     for (const issue of parsed.error.issues) {
29:       const field = issue.path.join(".") || "_";
30:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
31:     }
32:     return { ok: false, fieldErrors };
33:   }
34: 
35:   const aCtx = await resolveActionContext(instanceSlug);
36:   const sqlBase = getSqlBase();

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'FaqInputSchema|PublicationInputSchema|MediaAppearanceInputSchema|status|PUBLICATION_STATUSES' 'apps/web/src/lib/eat-content-schema.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 515ms:
4:// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
6:// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.
104:// EC-FORM-02: v0.1 단계 status enum subset
145:export const PublicationInputSchema = z.object({
175:  status: EatStatusSchema,
178:export type PublicationInput = z.infer<typeof PublicationInputSchema>;
184:export const MediaAppearanceInputSchema = z.object({
199:  status: EatStatusSchema,
202:export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;
206:export const FaqInputSchema = z.object({
216:  status: EatStatusSchema,
219:export type FaqInput = z.infer<typeof FaqInputSchema>;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/eat-content-schema.ts' | ForEach-Object { "'$i++; if (($i -ge 96 -and $i -le 110) -or ($i -ge 168 -and $i -le 219)) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 601ms:
96:     .string({ required_error: `${label}은(는) 필수입니다.` })
97:     .transform((v) => v.trim())
98:     .refine((v) => /^[0-9]+$/.test(v), { message: `${label}은(는) 양의 정수` })
99:     .refine((v) => {
100:       const n = Number(v);
101:       return n >= min && n <= max;
102:     }, { message: `${label}은(는) ${min}~${max}` });
103: 
104: // EC-FORM-02: v0.1 단계 status enum subset
105: export const EatStatusSchema = z.enum(["draft"], {
106:   errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (EC-DEFER-12)" }),
107: });
108: 
109: // EC-FORM-03 (DOI anchored — DB CHECK 와 동일)
110: export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
168:     .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), {
169:       message: "PubMed ID 는 1~9 자리 숫자",
170:     }),
171:   url: httpUrlRequired("URL"),
172:   thumbnailUrl: httpUrlOptional(),
173:   summary: requiredTrimmed(50, 300, "요약"),
174:   authorDoctorId: uuidOptional("저자(의료진)"),
175:   status: EatStatusSchema,
176: });
177: 
178: export type PublicationInput = z.infer<typeof PublicationInputSchema>;
179: 
180: // === MediaAppearance ===
181: 
182: export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;
183: 
184: export const MediaAppearanceInputSchema = z.object({
185:   slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
186:     message: "slug 는 소문자/숫자/하이픈 (3~100자)",
187:   }),
188:   title: requiredTrimmed(1, 300, "제목"),
189:   channelName: requiredTrimmed(1, 100, "채널명"),
190:   channelType: z.enum(MEDIA_CHANNEL_TYPES, {
191:     errorMap: () => ({ message: "채널 종류는 broadcast/youtube/podcast/press 중 하나" }),
192:   }),
193:   publishedDate: isoDateRequired("게재일"),
194:   durationSeconds: intOptional(1, "길이(초)"),
195:   url: httpUrlRequired("URL"),
196:   thumbnailUrl: httpUrlOptional(),
197:   summary: requiredTrimmed(50, 300, "요약"),
198:   authorDoctorId: uuidOptional("출연 의료진"),
199:   status: EatStatusSchema,
200: });
201: 
202: export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;
203: 
204: // === FAQ ===
205: 
206: export const FaqInputSchema = z.object({
207:   slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
208:     message: "slug 는 소문자/숫자/하이픈 (3~100자)",
209:   }),
210:   question: requiredTrimmed(10, 200, "질문"),
211:   answer: requiredTrimmed(50, 2000, "답변"),
212:   displayOrder: intRequired(0, 9999, "표시 순서"),
213:   categoryId: uuidOptional("카테고리"),
214:   authorDoctorId: uuidOptional("작성자(의료진)"),
215:   relatedTreatmentId: uuidOptional("관련 진료 페이지"),
216:   status: EatStatusSchema,
217: });
218: 
219: export type FaqInput = z.infer<typeof FaqInputSchema>;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'LL-WORKFLOW-INTEGRATION|clinic-profile|LegalDocument.*workflow|workflow.*LegalDocument|별 cycle|scope' docs apps/web/src packages" in C:\Users\assag\solution\website-exposure
 succeeded in 620ms:
docs\research\REFERENCE_DEEP_DIVE_2026-05.md:110:- scope: clinic | branch | network | doctor
packages\shared-types\src\index.ts:6:/** Branded instance ID (multi-tenant scope) */
packages\shared-types\src\index.ts:7:export type InstanceId = UuidV4 & { __scope: "instance" };
packages\shared-types\src\index.ts:10:export type AdminUserId = UuidV4 & { __scope: "admin-user" };
packages\notifications-outbox\src\index.ts:3:// v0.2 scope:
packages\notifications-outbox\src\index.ts:8:// v0.3 scope (다음 cycle·worker harness):
docs\compliance\RISK_LEVELS.md:170:    scope:
docs\compliance\RISK_LEVELS.md:185:    scope:
docs\compliance\RISK_LEVELS.md:222:**severity·scope·roles**
docs\compliance\RISK_LEVELS.md:226:| `scope[]` 빈 배열 | **fail** |
docs\compliance\RISK_LEVELS.md:227:| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
docs\compliance\RISK_LEVELS.md:228:| `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
docs\compliance\RISK_LEVELS.md:229:| `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
docs\compliance\RISK_LEVELS.md:230:| `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
docs\compliance\RISK_LEVELS.md:231:| `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
docs\compliance\RISK_LEVELS.md:232:| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
docs\compliance\RISK_LEVELS.md:233:| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
docs\compliance\RISK_LEVELS.md:234:| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
docs\compliance\RISK_LEVELS.md:235:| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
docs\compliance\RISK_LEVELS.md:258:| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
docs\compliance\RISK_LEVELS.md:355:   - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`requiredApproverRoles[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)
docs\compliance\RISK_LEVELS.md:365:CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그의 데이터 표현. 빌드 로드 시 별도 `ContextException[]` 컬렉션으로 분리되고, 각 항목은 명시한 룰·카테고리·scope에 대해 매칭 검사 시 제외 단언(negative assertion)으로 작용.
docs\compliance\RISK_LEVELS.md:380:      scopes:                                # 본 예외가 적용될 scope (선택 — 미지정 시 전체)
docs\compliance\RISK_LEVELS.md:393:- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
docs\compliance\RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
docs\compliance\RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
packages\db\src\tenant.ts:2:// Spike A LOCAL_PASS 코드 승격 — NULLIF cascade·SET LOCAL ROLE·set_config·tx scope·ScopedDb runtime brand
packages\db\src\tenant.ts:10:const SCOPED_BRAND = Symbol("@glitzy/db/scoped");
packages\db\src\tenant.ts:13: * ScopedDb: transaction object branded as tenant-scoped.
packages\db\src\tenant.ts:20:    throw new ScopedDbBrandError("tx is not scoped — call withTenantTransaction first");
docs\features\asset-ingestion.md:74:activation: { scope: "instance", default: false }
docs\features\asset-ingestion.md:148:- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
docs\features\asset-ingestion.md:155:- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
docs\features\asset-ingestion.md:189://   - feature-scoped rules + global rules만 적용 (pageType-specific rules 적용 안 함)
docs\features\asset-ingestion.md:521:- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
docs\features\asset-ingestion.md:522:- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\features\analytics-reporting.md:107:  scope: "instance"
docs\features\analytics-reporting.md:189:      rateLimit:                                       # bucket scope 명시
docs\features\analytics-reporting.md:541:- **availabilityLagDays: 3**, rate limit bucket scope: **credential-global**
docs\features\analytics-reporting.md:546:- availabilityLagDays: 1, bucket scope: **instance-isolated**
docs\features\analytics-reporting.md:551:- availabilityLagDays: 1, bucket scope: **credential-global**
docs\features\analytics-reporting.md:558:- availabilityLagDays: 0, bucket scope: instance-isolated
docs\features\search-visibility.md:97:  scope: "instance"
docs\features\search-visibility.md:235:- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`
docs\features\search-visibility.md:374:  - crawler 실행 파라미터가 approvedScope 범위 밖이면 → `skipped-legal-out-of-scope` 처리
docs\features\search-visibility.md:539:- crawler 실행 파라미터가 `approvedScope` 밖이면 `skipped-legal-out-of-scope`
docs\features\search-visibility.md:622:analytics-reporting CollectionSourceAttempt 동일 패턴 + `skipped-legal-out-of-scope`·`skipped-baseline-warmup`·`skipped-degraded` status 추가.
docs\features\notifications.md:78:  scope: "instance"
docs\features\notifications.md:778:> 채널별 sentAt 추적은 NotificationDeliveryAttempt.status로만 판단 (per-channel scope). PayloadRecord에는 channel 필드·sentAt 필드 없음 — N3-04 정정.
docs\features\keyword-monitoring.md:101:  scope: "instance"
packages\db\migrations\D0014_public_reader_eat.sql:13:-- 분류 자체는 instance scope 안 모든 row public. status 없음 (분류 메타).
docs\features\crm-sync.md:57:| **consent withdrawal scope enum 추가·변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 적용 의미 변경은 record-level erasure 영향 |
docs\features\crm-sync.md:96:activation: { scope: "instance", default: false }
docs\features\crm-sync.md:183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
docs\features\crm-sync.md:222:| `crm-consent-withdrawal-applied` | `"crm-consent:" + withdrawalLedgerId` | scope·keyType·keyPrefix(0..8)·matchedRecordCount·tombstoneChangeLogIds·integrationId·dryRun·reason | super-admin |
docs\features\crm-sync.md:320:- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
docs\features\crm-sync.md:321:- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
docs\features\crm-sync.md:330:- **audit 책임**: CRM 콘솔 접근은 CRM provider 측 audit log 책임 (Salesforce Login History·HubSpot Audit Trail 등). solution audit log는 CRM 콘솔 접근 추적 불가 — 본 문서 audit scope 외
docs\features\crm-sync.md:415:      scope: "all" | "marketing-only";
docs\features\crm-sync.md:424:      scope: "all" | "marketing-only";
docs\features\crm-sync.md:434:  scope: "all" | "marketing-only";
docs\features\crm-sync.md:864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
docs\features\crm-sync.md:874:7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
docs\features\crm-sync.md:875:8. scope="marketing-only": displayHints nulling만
docs\features\crm-sync.md:1050:- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
docs\features\crm-sync.md:1051:- scope=marketing-only → displayHints nulling만
docs\features\crm-sync.md:1632:| `scope` | enum (`all`·`marketing-only`) | ✅ |
docs\features\crm-sync.md:1648:- `UNIQUE(integration_id, pii_hash, scope) WHERE pii_hash IS NOT NULL`
docs\features\crm-sync.md:1649:- `UNIQUE(integration_id, crm_external_id_hash, scope) WHERE crm_external_id_hash IS NOT NULL`
docs\features\content-migration.md:102:activation: { scope: "instance", default: false }
docs\features\content-migration.md:202:| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
docs\features\content-migration.md:229:| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
docs\features\content-migration.md:254:| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
docs\features\content-migration.md:255:| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
docs\features\content-migration.md:334:  scope: "full" | "from-step";
docs\features\content-migration.md:402:| command | scope | requestFingerprint |
docs\features\content-migration.md:406:| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
docs\features\content-migration.md:811:| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
docs\features\content-migration.md:1193:| `scope` | enum (full·from-step) | ✅ |
docs\features\content-migration.md:1293:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
docs\features\compliance-assistant.md:67:  scope: "instance"               # 인스턴스별 활성화
docs\features\compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
docs\features\compliance-assistant.md:205:   a. scope 일치 (pageType/articleType/block/field/feature/global)
docs\features\compliance-assistant.md:283:   a. appliesTo.scopes[]가 명시되어 있으면, 본 finding의 scope와 매칭 검증 (미명시 시 전체 scope 적용)
apps/web/src\app\sign-in\actions.ts:3:// cycle2-code WEB-36: redirect-only action — useFormState 미사용 (clinic-profile 의 result-return action 과 패턴 분리).
apps/web/src\lib\site-metadata.test.ts:7:// site-url.ts 의 headers() (Next request scope) 를 mock — vitest node env
apps/web/src\lib\public-tenant.ts:4:// 공개 사이트 SSR 단계의 instance lookup + RLS scope 설정.
apps/web/src\lib\public-tenant.ts:7://   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
apps/web/src\lib\public-tenant.ts:20: * 공개 사이트 SSR 단계의 instance lookup + transaction-scoped RLS scope 설정.
apps/web/src\lib\public-tenant.ts:23: * @param fn — instance scope 안 SELECT 콜백. tx 는 같은 connection 의 transaction sql tag.
apps/web/src\lib\public-tenant.ts:41:    // 2) transaction-scoped instance scope
docs\core\DATA_MODEL.md:142:| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
docs\core\DATA_MODEL.md:149:- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
docs\core\DATA_MODEL.md:708:| `id` | string | ✅ | integration 식별자 (instance scope unique) |
docs\core\DATA_MODEL.md:740:법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
docs\core\DATA_MODEL.md:934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
docs\core\DATA_MODEL.md:959:- Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
docs\core\DATA_MODEL.md:987:- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:11:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:89:│     └─ [instanceSlug]/                 -- 기존 어드민 (clinic-profile, doctors, treatments, articles, ...)
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:124:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` 의 `revalidatePath` 2 곳
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:212:  2. `SELECT set_config('app.current_instance_id', <id>, true)` (transaction-scoped)
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs\core\CONTENT_STANDARDS.md:542:  scope: ContentScope[];       // 적용 범위 — § 7.4.1
docs\core\CONTENT_STANDARDS.md:566:  scope: ContentScope[];
docs\core\CONTENT_STANDARDS.md:603:- 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
docs\core\CONTENT_STANDARDS.md:669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs\decisions\PROVIDER_PASS_PLAN.md:48:4. IAM PolicyDocument 작성 (prefix `instances/{instanceId}/` 조건부) — Workers PolicyDocument 또는 R2 API token scope
docs\core\SCHEMA_MAPPING.md:154:| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
docs\core\SCHEMA_MAPPING.md:155:| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:8:> **목적**: Phase 0 Week 1~2 안에 가장 위험한 기술 가정 5개 (A·B·C·D·E) 검증. provider smoke gate 포함. 통과 시 본 구현 진입·실패 시 Phase 0 scope 재조정
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:65:### A.1 가설 (SPIKE1-18 scope 정리)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:101:8. **scopedDb runtime guard**: tx 밖 scopedDb 사용 시 throw (runtime guard)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:127:| pgBouncer SET LOCAL leak | Supabase Pooler 사용·direct connection·connection-scoped role | INFRA v1.0 §1.1 RLS 실행 모델 | `packages/db` connection layer | 없음 | +3~5일 | solo |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:129:| RLS overhead p95 > 50ms | application-level scoping 주력·RLS 보조만 | INFRA v1.0 §1 전체 reversal·INFRA2-01 1차 결정으로 | `packages/db`·`scopedDb` lint·all feature repository | RLS migration 제거 | +2주 (Phase 0 재산정) | solo |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:134:- A PASS → `packages/db/scopedDb`·`withTenantTransaction`·Drizzle convention·lint rule·composite FK 적용
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:135:- A FAIL → Phase 0 scope 재산정 gate (Week 2 Day 10에 의사결정)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:279:│   ├── 011_custom_sql_view.sql      # tenant-scoped view (audit_log read RLS)
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:312:| deploy coordinator lock | 동시 deploy 1개만 진행 (별도 lock key namespace·shadow scope 보유) |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:313:| empty target deploy | targetCurrent=0인 경우 pre-drift skip·full apply + post-drift. **leftover guard scope** (11-class user-visible public objects): table·view·foreign_table·sequence·enum_or_composite_type·domain·range_type·function·policy·trigger·collation. **drift snapshot scope**: 현재 definition-aware schema feature scope (table·constraint·index·policy·view+reloptions·enum)에 한정 — empty guard와 drift snapshot은 의도적으로 다른 scope (empty guard는 partial poison 회피 위해 더 광범위, drift snapshot은 feature spec과 직접 연관된 schema 객체만). **본 spike scope 외** (PROVIDER_GATE — Day 8 staging에서 추가 검증·실 production schema에서 사용 시 별도 추가 검사): pg_operator·pg_opclass·pg_opfamily·pg_conversion·text search objects (pg_ts_config·pg_ts_dict·pg_ts_parser·pg_ts_template). |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:333:- D FAIL → migration tooling 재선택 (Atlas·db-mate·dbmate 등)·Phase 0 scope 재정의
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:402:| instanceMembership 검증 query 비용 큼 | scoped index·또는 short-cache | acceptable trade-off |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:438:| A `PROVIDER_PASS` | Week 3-4 schema·scopedDb·composite FK·M0 schema migration·lint rule | — |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:440:| A `PROVIDER_FAIL` | — | 전체 Phase 0 scope 재산정 gate |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:446:| D `INCONCLUSIVE` | — | migration tooling 재선택 (Atlas·db-mate)·Phase 0 scope 재정의 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:470:| 2026-05-15 | (v0.2 이전 비고) | codex 1차 비평 18 지적 전건 수용: (1) **provider smoke gate** — local + provider 2단계 분리 (SPIKE1-01·04), (2) **Spike D 신설** — Drizzle Kit migration deploy (SPIKE1-02), (3) **Spike E 신설** — Auth.js + resolveTenantContext + membership invalidation (SPIKE1-03), (4) **invariant 측정 표준화** — 1000 iterations × 20 concurrent + invariant SQL binary 검증 (SPIKE1-05), (5) **A 쓰기 path·rollback·nested tx·audit_log RLS 시나리오 추가** (SPIKE1-06·07), (6) **B 가설 정정** — idempotent at-least-once with exactly-once observable effects (SPIKE1-08), (7) **B failure injection 8 point + 외부 call count invariant** (SPIKE1-09·10), (8) **C TTL 상태 코드 정정** — 401 → 403 (provider semantics·SPIKE1-11), (9) **C security 시나리오 확장** — replay·method confusion·ListBucket·content-type·URL scrubbing (SPIKE1-12), (10) **REVIEW_WORKFLOW cascade** — `signed-url-issued`·`signed-url-revoked` AuditAction 2종 추가 (SPIKE1-13), (11) **fallback에 reversal blast radius 명시** (SPIKE1-14), (12) **Week 3~6 dependency graph** (SPIKE1-15), (13) **일정 7일 → 10일** (Week 1 + Week 2 Day 8~10·SPIKE1-16), (14) **성능 기준 correctness와 분리** (SPIKE1-17), (15) **A/B scope 명확화** — A는 transaction/RLS·B는 queue/crash (SPIKE1-18), (16) Spike F·G P1·후속 명시 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:27:    return fn(scopedDbFromTx(tx));
docs\decisions\INFRA_DECISIONS_DRAFT.md:64:- **read path**: tenant-scoped view 또는 RLS policy 적용 — `CREATE POLICY audit_log_read ON audit_log FOR SELECT USING (instance_id = current_setting('app.current_instance_id')::uuid)`
docs\decisions\INFRA_DECISIONS_DRAFT.md:162:- runtime validator: ref resolve 시 row 존재 + tenant scope 검증
docs\decisions\INFRA_DECISIONS_DRAFT.md:286:| RLS 대체 | server-only signed URL issuer (`packages/storage/issue-url.ts`) — issuance 시 instance scope + audit 검증 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:315:- A `PROVIDER_PASS` → Week 3-4 schema migration·scopedDb·composite FK 적용 가능
docs\decisions\INFRA_DECISIONS_DRAFT.md:357:1. `withTenantTransaction` 헬퍼 + `scopedDb` API
docs\decisions\INFRA_DECISIONS_DRAFT.md:369:#### 4.5.1 legal-reviewer — 시간당 contract + fixed-scope package (INFRA2-10)
docs\decisions\INFRA_DECISIONS_DRAFT.md:373:| Phase 0 (Week 1~6) | **Fixed-scope package** — DPA 템플릿 1회·의료광고 워크플로 2회 워크숍·high-risk sample 20건 검토·사전심의 절차 자문 1회 | 500~1500만원 (1회성) |
docs\decisions\INFRA_DECISIONS_DRAFT.md:446:| 4-2. 베타·법무 | DPA·legal-reviewer Phase 1 시작 gate (fixed-scope package → 시간당 → retainer)·internal beta는 workflow validation 한정·외부 베타 1곳 M0 public gate·사전심의 manual-assisted·PIPA+GDPR checklist·customer domain ADR 별도 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:470:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정. 4 지적 정정 완료**: (1) P0 schema 목록 NotificationEvent → NotificationEventReceipt 정정 + NotificationEvent는 입력 타입임을 명시 (INFRA3-01), (2) audit_log read path tenant-scoped RLS 정책 분리 (INFRA3-02), (3) Storage 섹션 Cloudflare R2 채택 확정·Supabase Storage rejected alternative (INFRA3-03), (4) notifications.md 예시 drift는 8 Feature spec cascade 시 정정 (INFRA3-04 — 후속 minor cascade). **3 cycle 누계 36 지적 전건 수용**. SoT cascade 완료: REVIEW_WORKFLOW (NotificationEventType 6종 + AuditAction 17종 — service-role-invoked·instance-switched 추가), DATA_MODEL v0.23 (C-08 email transport/provider 분리) |
docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
docs\decisions\M0_BUILD_EXPORT_PLAN.md:74:| `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
docs\decisions\EAT_CONTENT_PLAN.md:22:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
docs\decisions\EAT_CONTENT_PLAN.md:66:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
docs\decisions\EAT_CONTENT_PLAN.md:70:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
docs\decisions\EAT_CONTENT_PLAN.md:87:| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
docs\decisions\EAT_CONTENT_PLAN.md:373:--   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
docs\decisions\EAT_CONTENT_PLAN.md:484:- **fragment-scoped `@id`**:
docs\decisions\EAT_CONTENT_PLAN.md:498:- fragment-scoped `@id`:
docs\decisions\EAT_CONTENT_PLAN.md:545:  "@id": "{pageBaseUrl}#publication-{slug}",      // fragment-scoped (Doctor/About page 안)
docs\decisions\EAT_CONTENT_PLAN.md:566:  "@id": "{pageBaseUrl}#video-{slug}",            // fragment-scoped · 모든 channel_type 동일
docs\decisions\EAT_CONTENT_PLAN.md:610:- (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
docs\decisions\EAT_CONTENT_PLAN.md:659:| 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
docs\decisions\EAT_CONTENT_PLAN.md:679:| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
docs\decisions\EAT_CONTENT_PLAN.md:695:### 11.1 별 cycle 합류
docs\decisions\EAT_CONTENT_PLAN.md:724:  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
docs\decisions\EAT_CONTENT_PLAN.md:745:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
docs\decisions\M0_SCHEMA_PLAN.md:20:| 5 | C-14 | MedicalSpecialty (global·instance scope 없음) | core-content | P0 |
docs\decisions\M0_SCHEMA_PLAN.md:52:## v0.1 scope (본 cycle)
docs\decisions\M0_SCHEMA_PLAN.md:117:codex 비평 cycle 1·2에서 deferred·M0 v0.3 acceptance scope 외 항목·각 항 별도 cycle 또는 milestone에서 close:
docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
docs\decisions\M0_SCHEMA_PLAN.md:123:| **M0-08** P0 ~15 tables count vs v0.x 6 tables | M0 v1.0 Phase 0 Week 4 schema migration green | 본 v0.x는 minimum scope·detail은 Phase 0 Week 4 본 구현 시점 |
docs\decisions\M0_SCHEMA_PLAN.md:129:| **M0-14** audit_log M0 extension | packages/db v0.2 separate scope | content_ref·action cascade는 REVIEW_WORKFLOW transition publish 시점·M0 schema와 독립 |
docs\decisions\M0_SCHEMA_PLAN.md:133:본 marker로 deferred 11항 모두 추적 가능·M0 v0.x acceptance scope 외 명시.
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **5 cycle 36 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정. 수렴 추세 **28 → 5 → 2 → 1 → 0**. EAT_CONTENT code v1.0 acceptance 직후 진입하는 첫 Feature 본 plan (M0 vertical slice scope).
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:71:| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:726:emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:836:| 2026-05-18 | v0.1 | 초안 작성. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:837:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 finding 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 28 → 5 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 5 cycle 36 findings 전건 수용. acceptance commit 7 cascade docs 동시 포함 marker (CA-CASCADE-01~06 + plan 본문). 실 SQL 코드 cascade 는 별 cycle (compliance-assistant M0 code v1.0). |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
docs\decisions\LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs\decisions\LOCATION_LEGAL_PLAN.md:24:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
docs\decisions\LOCATION_LEGAL_PLAN.md:328:- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
docs\decisions\LOCATION_LEGAL_PLAN.md:334:  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
docs\decisions\LOCATION_LEGAL_PLAN.md:344:// apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts
docs\decisions\LOCATION_LEGAL_PLAN.md:518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
docs\decisions\LOCATION_LEGAL_PLAN.md:535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs\decisions\LOCATION_LEGAL_PLAN.md:537:| 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:3:> **상태**: **v1.0** — codex 자동 비평 11 cycle 후 `ready_for_acceptance=true` 확정. cycle11 finding 0건. blocking 0·major 0·minor 0·nit 0. **107 findings 전건 처리 완료**. scope_narrow_acceptable=true.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:13:> **A-03 결정의 scope (ADMIN-UI-67)**: A-03 close (= packages/auth 자체 핸들러) 는 **skeleton-local 결정**. 상위 SoT (`INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 · `PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E) 가 여전히 next-auth/Auth.js 를 권위 있는 전제로 둔다. 두 문서의 reversal cascade 는 본 plan acceptance 후 별도 사이클로 진행 (acceptance precondition 아닌 follow-up cascade).
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:49:| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:116:│   │   │       └── clinic-profile/
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:150:/[instanceSlug]/clinic-profile                   — 폼
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:262:URL `[instanceSlug]` → `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` (cycle9 정정 ADMIN-UI-105 — actorUserId 필수). **sqlBase 직접 SELECT** (withServiceRole 미사용 — instance scope 없는 control-plane lookup):
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:274:  // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:289:`ServiceRoleFunction` enum 신규 추가 (slugResolver · firstActiveMembershipResolver · adminUserUpsert) **precondition 제거**. M0 v1.0 instance-scoped service-role 작업 (예: contentMigrationApplier) 도입 시점에 enum 추가.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:398:-- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:433:// /[instanceSlug]/clinic-profile/page.tsx
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:440:// /[instanceSlug]/clinic-profile/actions.ts
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:487:  revalidatePath(`/${instanceSlug}/clinic-profile`);
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:640:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:667:| ~~`packages/shared-types/src/index.ts` `ServiceRoleFunction` enum~~ | ~~precondition~~ | **cycle4 제거 (ADMIN-UI-68)** — sqlBase 직접 호출로 변경되어 enum 추가 불필요. M0 v1.0 cascade marker (instance-scoped service-role function 추가 시점). |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:668:| 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:705:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:130:      // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 instance-scoped 사전 검증 (cycle 1 ECC-03 patch).
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:19:} from "@/lib/clinic-profile-schema";
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:51:} from "@/lib/clinic-profile-schema";
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:175:  // # 33 — Article.category JOIN 미존재 (이건 SQL 레벨 — vitest scope 외, e2e 검증 deferred).
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:187:  // # 35 — Doctor Profile graph self-contained — 풀 entity 모두 fragment-scoped @id
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:188:  it("Doctor Profile graph self-contained — fragment-scoped @id", () => {
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:199:  // # 36 — ArticleCategory taxonomy public (이건 DB GRANT/policy — vitest scope 외, e2e 검증 deferred).
apps/web/src\lib\compliance\__tests__\compliance.test.ts:1:// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 7 scenarios — vitest scope (자동 검증 가능 부분)
apps/web/src\lib\json-ld\entities.ts:215://   SCHEMA_MAPPING § 6.1. fragment-scoped @id (Doctor/About page 안 inline).
apps/web/src\lib\json-ld\builders.ts:42://   Publication/Media 풀 entity 출력 — fragment-scoped @id (`/about#publication-{slug}` · `/about#video-{slug}`).
apps/web/src\lib\json-ld\builders.ts:100://   fragment-scoped @id (`/doctors/{slug}#publication-{...}` · `#video-{...}`).
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:89:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:99:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\lib\clinic-profile-schema.ts:1:// @glitzy/web/lib/clinic-profile-schema — LOCATION_LEGAL_PLAN v1.0 § 3.2
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:47:        //   display_name 표시는 별 cycle (base role separated fetch).
apps/web/src\components\forms\ClinicProfileForm.tsx:14:import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
apps/web/src\components\forms\ClinicProfileForm.tsx:18:} from "@/lib/clinic-profile-schema";
apps/web/src\components\site\BusinessHoursTable.tsx:25:            <th scope="col" className="border border-border px-3 py-2 text-left">요일</th>
apps/web/src\components\site\BusinessHoursTable.tsx:26:            <th scope="col" className="border border-border px-3 py-2 text-left">진료 시간</th>
apps/web/src\components\site\BusinessHoursTable.tsx:27:            <th scope="col" className="border border-border px-3 py-2 text-left">점심</th>
apps/web/src\components\site\BusinessHoursTable.tsx:36:                <th scope="row" className="border border-border px-3 py-2 text-left font-medium">{dayLabel}</th>
apps/web/src\components\site\BusinessHoursTable.tsx:44:              <th scope="row" className="border border-border px-3 py-2 text-left font-medium">특수 휴진</th>

codex
핵심 구현은 Article 패턴을 대체로 복제했지만, FAQ/Publication/MediaAppearance 쪽은 save action이 DB status를 보존하기 전에 기존 EAT schema의 `draft` 전용 검증을 먼저 통과해야 합니다. 이 때문에 workflow로 `review-queued` 이상이 된 행은 read-only status 값 그대로 저장해도 validation에서 막히는 경로가 보입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "git diff -- 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/[slug]/page.tsx' 'apps/web/src/lib/eat-content-schema.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 641ms:
diff --git a/apps/web/src/components/forms/TreatmentPageForm.tsx b/apps/web/src/components/forms/TreatmentPageForm.tsx
index 265f271..80fe415 100644
--- a/apps/web/src/components/forms/TreatmentPageForm.tsx
+++ b/apps/web/src/components/forms/TreatmentPageForm.tsx
@@ -75,7 +75,11 @@ export function TreatmentPageForm({
       <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={160} hint="50~160자 (검색 결과 노출용)" />
       <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={14} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={50000} hint="Markdown 형식" />
       <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
-      <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
+      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
+      <label className="flex flex-col gap-1 text-sm">
+        <span>발행 상태 (workflow actions 통해서만 전이)</span>
+        <input type="text" name="status" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
+      </label>
       <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />
 
       <SubmitButton isNew={isNew} />
warning: in the working copy of 'apps/web/src/components/forms/TreatmentPageForm.tsx', LF will be replaced by CRLF the next time Git touches it

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'STATUS_OPTIONS|PUBLICATION_STATUSES|noUnusedLocals' 'apps/web/src/components/forms/TreatmentPageForm.tsx' 'apps/web/src/components/forms/ArticleForm.tsx' 'apps/web/src/components/forms/FAQForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx' 'apps/web/tsconfig.json' 'tsconfig.json'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/TreatmentPageForm.tsx' | ForEach-Object { "'$i++; if ($i -le 30) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/FAQForm.tsx' | ForEach-Object { "'$i++; if ($i -le 36) { '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/tsconfig.json' | ForEach-Object { "'$i++; if ($_ -match '"'noUnusedLocals|strict|compilerOptions') { '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
2026-05-18T10:51:09.348296Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
apps/web/src/components/forms/MediaAppearanceForm.tsx:44:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/PublicationForm.tsx:40:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/ArticleForm.tsx:33:const STATUS_OPTIONS = [
apps/web/src/components/forms/FAQForm.tsx:32:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/TreatmentPageForm.tsx:29:const STATUS_OPTIONS = [
rg: tsconfig.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 573ms:
apps/web/src/components/forms/MediaAppearanceForm.tsx:44:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/PublicationForm.tsx:40:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/ArticleForm.tsx:33:const STATUS_OPTIONS = [
apps/web/src/components/forms/FAQForm.tsx:32:const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
apps/web/src/components/forms/TreatmentPageForm.tsx:29:const STATUS_OPTIONS = [
rg: tsconfig.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 606ms:
1: // @glitzy/web/components/forms/TreatmentPageForm
2: "use client";
3: 
4: import { useState } from "react";
5: import { useFormState, useFormStatus } from "react-dom";
6: import { Field, SelectField } from "./Field";
7: import type { SaveResult } from "@/lib/save-result";
8: 
9: export type TreatmentPageInitial = {
10:   slug: string;
11:   title: string;
12:   summary: string;
13:   bodyMarkdown: string;
14:   status: string;
15:   riskLevel: string;
16:   heroImageUrl: string;
17: };
18: 
19: const empty: TreatmentPageInitial = {
20:   slug: "",
21:   title: "",
22:   summary: "",
23:   bodyMarkdown: "",
24:   status: "draft",
25:   riskLevel: "",
26:   heroImageUrl: "",
27: };
28: 
29: const STATUS_OPTIONS = [
30:   { value: "draft", label: "초안" },

 succeeded in 614ms:
1: // @glitzy/web/components/forms/FaqForm — EAT_CONTENT_PLAN v1.0 § 4.1
2: //   v0.1 단계 status='draft' DB CHECK 강제. 발행 자체 차단 (EC-DEFER-12).
3: "use client";
4: 
5: import { useState } from "react";
6: import { useFormState, useFormStatus } from "react-dom";
7: import { Field, SelectField } from "./Field";
8: import type { SaveResult } from "@/lib/save-result";
9: 
10: export type FaqInitial = {
11:   slug: string;
12:   question: string;
13:   answer: string;
14:   displayOrder: string;
15:   categoryId: string;
16:   authorDoctorId: string;
17:   relatedTreatmentId: string;
18:   status: string;
19: };
20: 
21: const empty: FaqInitial = {
22:   slug: "",
23:   question: "",
24:   answer: "",
25:   displayOrder: "0",
26:   categoryId: "",
27:   authorDoctorId: "",
28:   relatedTreatmentId: "",
29:   status: "draft",
30: };
31: 
32: const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
33: 
34: export function FaqForm({
35:   action,
36:   initial,

 succeeded in 619ms:
3:   "compilerOptions": {

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/tsconfig.json' -Raw" in C:\Users\assag\solution\website-exposure
 succeeded in 536ms:
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "allowJs": false,
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next"]
}


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'tsconfig.base.json' -Raw" in C:\Users\assag\solution\website-exposure
 succeeded in 577ms:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/package.json' -Raw" in C:\Users\assag\solution\website-exposure
 succeeded in 555ms:
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts",
    "test:scenarios": "vitest run"
  },
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "sanitize-html": "^2.13.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/sanitize-html": "^2.13.0",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.8",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}


codex
추가로 TypeScript 관점에서 즉시 드러나는 prop 타입 문제는 보이지 않습니다. `WorkflowActionButtons.currentStatus`는 `string`이고, 4개 edit page 모두 `bundle.initial.status`/`initial.status`의 `string`을 넘기고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 2285ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=0 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴 추세: 이전 cycle 없음 — 본 cycle 이 첫
- `pnpm --filter @glitzy/web typecheck`: PASS

## blocking
- FAQ/Publication/MediaAppearance는 save action이 status를 “무시”하기 전에 `draft` 전용 zod 검증으로 막힙니다. `apps/web/src/lib/eat-content-schema.ts:104-107`의 `EatStatusSchema = z.enum(["draft"])`가 `PublicationInputSchema.status`(`:175`), `MediaAppearanceInputSchema.status`(`:199`), `FaqInputSchema.status`(`:216`)에 그대로 적용됩니다. 각 action은 이 schema를 transaction 진입 전에 parse합니다: `faqs/actions.ts:26`, `publications/actions.ts:25`, `media-appearances/actions.ts:25`. 따라서 workflow action으로 row가 `review-queued`/`in-review` 등이 된 뒤 edit form의 read-only input이 현재 status를 제출하면 저장이 validation error로 중단되고, `FOR UPDATE` 후 current row status 보존 경로(`faqs/actions.ts:47-68`, `publications/actions.ts:46-71`, `media-appearances/actions.ts:47-71`)까지 도달하지 않습니다. 또한 변조 `status='published'`도 “무시 후 currentStatus 보존”이 아니라 schema reject입니다. Article/TreatmentPage 패턴과 불일치합니다.

## major
- 없음

## minor
- LegalDocument 별 cycle marker `LL-WORKFLOW-INTEGRATION`가 코드/문서 검색상 없습니다. 현재 plan은 여전히 `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792`에서 `LegalDocumentForm · clinic-profile-schema`를 6 entity status/zod 정정 항목에 함께 묶고 있어, 요청한 “clinic-profile 통합 form 안 5 LegalDocument 동시 처리 → 별 cycle marker” 추적성이 부족합니다.

## acceptance precondition 점검
- 4 entity form status read-only: PASS  
  Treatment `TreatmentPageForm.tsx:78-81`, FAQ `FAQForm.tsx:77-80`, Publication `PublicationForm.tsx:89-92`, MediaAppearance `MediaAppearanceForm.tsx:91-94`
- 4 entity save action status 무시 + currentStatus 보존: FAIL  
  TreatmentPage는 PASS이나, FAQ/Publication/MediaAppearance는 `EatStatusSchema`가 `draft`만 허용해 non-draft current status 저장과 변조-status 무시 패턴이 깨집니다.
- 4 entity edit page WorkflowActionButtons mount: PASS  
  Treatment `treatments/[slug]/page.tsx:89-94`, FAQ `faqs/[slug]/page.tsx:114-119`, Publication `publications/[slug]/page.tsx:111-116`, MediaAppearance `media-appearances/[slug]/page.tsx:109-114`
- LegalDocument scope 분리 명시: FAIL
tokens used
62,752
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=0 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴 추세: 이전 cycle 없음 — 본 cycle 이 첫
- `pnpm --filter @glitzy/web typecheck`: PASS

## blocking
- FAQ/Publication/MediaAppearance는 save action이 status를 “무시”하기 전에 `draft` 전용 zod 검증으로 막힙니다. `apps/web/src/lib/eat-content-schema.ts:104-107`의 `EatStatusSchema = z.enum(["draft"])`가 `PublicationInputSchema.status`(`:175`), `MediaAppearanceInputSchema.status`(`:199`), `FaqInputSchema.status`(`:216`)에 그대로 적용됩니다. 각 action은 이 schema를 transaction 진입 전에 parse합니다: `faqs/actions.ts:26`, `publications/actions.ts:25`, `media-appearances/actions.ts:25`. 따라서 workflow action으로 row가 `review-queued`/`in-review` 등이 된 뒤 edit form의 read-only input이 현재 status를 제출하면 저장이 validation error로 중단되고, `FOR UPDATE` 후 current row status 보존 경로(`faqs/actions.ts:47-68`, `publications/actions.ts:46-71`, `media-appearances/actions.ts:47-71`)까지 도달하지 않습니다. 또한 변조 `status='published'`도 “무시 후 currentStatus 보존”이 아니라 schema reject입니다. Article/TreatmentPage 패턴과 불일치합니다.

## major
- 없음

## minor
- LegalDocument 별 cycle marker `LL-WORKFLOW-INTEGRATION`가 코드/문서 검색상 없습니다. 현재 plan은 여전히 `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:792`에서 `LegalDocumentForm · clinic-profile-schema`를 6 entity status/zod 정정 항목에 함께 묶고 있어, 요청한 “clinic-profile 통합 form 안 5 LegalDocument 동시 처리 → 별 cycle marker” 추적성이 부족합니다.

## acceptance precondition 점검
- 4 entity form status read-only: PASS  
  Treatment `TreatmentPageForm.tsx:78-81`, FAQ `FAQForm.tsx:77-80`, Publication `PublicationForm.tsx:89-92`, MediaAppearance `MediaAppearanceForm.tsx:91-94`
- 4 entity save action status 무시 + currentStatus 보존: FAIL  
  TreatmentPage는 PASS이나, FAQ/Publication/MediaAppearance는 `EatStatusSchema`가 `draft`만 허용해 non-draft current status 저장과 변조-status 무시 패턴이 깨집니다.
- 4 entity edit page WorkflowActionButtons mount: PASS  
  Treatment `treatments/[slug]/page.tsx:89-94`, FAQ `faqs/[slug]/page.tsx:114-119`, Publication `publications/[slug]/page.tsx:111-116`, MediaAppearance `media-appearances/[slug]/page.tsx:109-114`
- LegalDocument scope 분리 명시: FAIL
