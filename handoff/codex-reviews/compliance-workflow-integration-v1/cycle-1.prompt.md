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
