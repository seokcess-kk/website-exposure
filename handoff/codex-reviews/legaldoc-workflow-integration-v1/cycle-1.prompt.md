Review **LL-WORKFLOW-INTEGRATION** code 통합 — **cycle 1**. compliance-assistant M0 + 4 entity workflow integration 직후 LegalDocument 5종 통합. clinic-profile 화면 안 5 LegalDocument workflow 동시 다룸.

## SoT
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 § 5.2 CA-UI-02 / § 6 CA-ACTION
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — 3계약 통합 form 안 5 LegalDocument 동시 처리
- `apps/web/src/components/forms/WorkflowActionButtons.tsx` (재사용)

## 변경 파일

### apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx
- `LegalWorkflowRow` 타입 신설 + legalWorkflowRows 조회 (slug · status 추가)
- `legalWorkflow` state 추출 (initial vs legalWorkflow 분리 return)
- ClinicProfileForm 하단에 **별도 section** — 5 LegalDocument 의 WorkflowActionButtons 5개 mount
- 정렬: privacy → terms → non-covered → refund → complaint (alpha 또는 LOCATION_LEGAL § 5 SoT 순서)
- 각 row: label (개인정보처리방침 · 이용약관 · 비급여 진료 안내 · 환불 정책 · 고충처리 방침) + slug + WorkflowActionButtons (contentType="LegalDocument")

### apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts
- `legalAfter` RETURNING 안 `status::text AS current_status` 추가
- `auditEntries.push({ ..., status: legal.current_status })` — hard-coded "draft" → DB current status (form 변조 회피 · CAMC-12 정합)

## What to check (cycle 1)

### Plan SoT 합치
- CA-UI-03 액션 버튼 노출 — 5 LegalDocument 각각 WorkflowActionButtons + 정렬 / label 정합
- LegalDocument upsert 시 INSERT 'draft' hard-coded + UPDATE 안 status 미수정 (workflow action 만 status 전이)
- CAMC-12 audit current status — INSERT 시 'draft' 보장 · UPDATE 시 DB current status 사용

### 정합성 / 보안 / 원자성
- WorkflowActionButtons 5개 mount — contentType="LegalDocument" · contentRef = template.slug (privacy/terms/...)
- saveClinicProfile 안 5 LegalDocument upsert 동안 alpha sort lock 순서 유지 (race 안전)
- ClinicProfileForm 안 LegalDocument 본문 필드 (effectiveDate override 만) — status 입력 부재 (어차피 LegalDocument 본문은 auto-generated)
- 5 LegalDocument의 partial UNIQUE (instance_id, document_type) 정합 — 동일 type 의 second row 없음
- LegalDocument 의 slug ↔ template.slug 정합 (privacy → privacy · terms → terms · ...)

### 사용자 흐름
- clinic-profile 화면 진입 시 5 LegalDocument row 없으면 workflow section 안 보임 (legalWorkflow=[])
- 운영자가 ClinicProfile 첫 저장 시 5 LegalDocument 자동 INSERT (status='draft') → page reload 후 workflow section 표시
- 각 LegalDocument 별 검수 요청 → /review-queue 큐 진입 → 검수자 approve (legal role · LegalCounsel slot 채움)
- legal slot 채움 + AND 게이트 충족 → publishable → 운영자 publish → published

### docs cascade · LL-DEFER-01 부분 해소
- LL-DEFER-01 (LegalDocument 발행 게이트 · ComplianceRecord legalCounsel/legalCounselAt required): ✅ 해소
- NotificationEvent envelope: CA-DEFER-14 잔재 (별 cycle)

## Output (한국어 · 간결)

```
# LEGALDOC_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
## major
## minor

## acceptance precondition 점검
- 5 LegalDocument WorkflowActionButtons mount: <PASS|FAIL>
- LegalDocument INSERT 'draft' + UPDATE 안 status 미수정: <PASS|FAIL>
- audit current status (CAMC-12 정합): <PASS|FAIL>
- LL-DEFER-01 부분 해소 marker: <PASS|FAIL>
```

가능한 한 광범위하게 보고, file:line 인용. 한국어 응답.
