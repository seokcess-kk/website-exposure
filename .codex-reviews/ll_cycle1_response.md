Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: none
reasoning summaries: none
session id: 019e2f60-4d3e-76b0-b45b-62053b88e3fe
--------
user
# LOCATION_LEGAL_PLAN v0.1 — codex 자동 비평 cycle 1

당신은 신중한 senior reviewer. 본 prompt 의 plan 을 직접 읽고 결함을 모두 찾아라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.1 (본 cycle 신규)

## SoT (이미 확정된 위상)

- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · multi-role AND gate
- `docs/admin/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
- 기존 packages 실 시그니처 (cycle1 직접 확인 권장):
  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql`
  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
  - `apps/web/src/components/forms/ClinicProfileForm.tsx`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`

## v0.1 산출물 (Plan 문서 1건)

`docs/decisions/LOCATION_LEGAL_PLAN.md`:
- § 1 목적·범위·비범위 (LL-INTRO-01, LL-DEFER-01~07)
- § 2 데이터 모델 — `legal_document` 테이블 신설 · `clinic_profile.policy_*` columns · `location_profile.metadata` 정규화
- § 3 Form UI 3 섹션 재구성 (LL-FORM-01~11)
- § 4 Server Action 단일 tx 동시 upsert + 변수 치환 엔진 + audit payload 확장
- § 5 Core 표준 템플릿 5종 + render 엔진 위치
- § 6 환경·precondition
- § 7 § 8.1 RLS 시나리오 cascade (14~19)
- § 8 작업 단위 (9건)
- § 9 M0 v1.0 cascade marker (LL-DEFER-01~10)

## 검토 관점

### 1. SoT 정합성 (admin/ARCHITECTURE § 3.8.1·3.8.2 · DATA_MODEL C-16·C-21)

- LegalDocument 5종 자동 생성이 DATA_MODEL C-16 의 documentType enum 7종 (`privacy, terms, non-covered, refund, complaint, cookie, other`) 중 5종 만 다루는 점이 SoT 정합한가? `cookie`/`other` 보류의 명시적 근거가 충분한가? `complaint` vs admin/ARCH 명시 `민원 처리` vs DATA_MODEL `complaint` 정합인가?
- C-21 LocationProfile 의 모든 required 필드 (`@id`, `name`, `parentClinic`, `address`, `telephone`, `businessHours`) 가 본 plan 의 form (b) 섹션 + 자동 생성 규칙에서 모두 채워지는가? `parentClinic` 은 어떻게 reference 표현되는가 (DB FK 없음 — current `location_profile` schema 에는 clinic_profile FK 컬럼이 없음, DATA_MODEL DM-12 v0.4 해소 결정 확인)?
- admin/ARCH § 3.8.1 의 LocationProfile 자동 생성 표 (`@id=main`, `representativeDoctors=ClinicProfile 등록 대표`, `reservationChannels=ClinicProfile.primaryCtas 상속` 등) 와 본 plan 의 form 입력 + 자동 생성 매핑이 정합한가? `primaryCtas` 상속 marker 가 LL-DEFER-04 로 빠진 것이 SoT 와 정합한가?
- admin/ARCH § 3.8.2 의 LegalDocument body 변수 (`{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}` · `{{location.main.email}}` · `{{location.main.address}}` · `{{location.main.telephone}}`) 가 LL-TEMPLATE-05 의 화이트리스트와 정확히 일치하는가? `policy.*` 변수는 admin/ARCH 에 명시되지 않은 추가 — 정당화되는가?

### 2. ComplianceRecord / 발행 게이트 위상 (admin/ARCH § 3.8.2 · DATA_MODEL C-10)

- LL-INTRO-01 의 "draft 까지만" 정책이 DATA_MODEL C-10 의 `LegalDocument: legalCounsel/legalCounselAt required` 게이트와 정합인가? CHECK `status IN ('draft', 'review-queued')` + `published_at IS NULL` 강제가 의도된 게이트인지? compliance-assistant Feature cascade 가 합류했을 때 CHECK 제거의 reversal 부담은 명시되었는가?
- LegalDocument 의 RiskLevel default `Low` + risk_level CHECK 미정의 — DATA_MODEL C-16 위험도 룰 정합인가? skeleton 단계 risk_level 변경 허용 여부 명시?

### 3. REVIEW_WORKFLOW state machine 정합

- legal_document.status 가 9 state enum 재사용 + skeleton CHECK 로 2 state 제한 — state machine NotificationEvent envelope (M0 v1.0 cascade) 과 정합인가? `review-queued` 진입 시 알림 envelope 발송 여부?
- 14 ActionType 중 `operator-edit-content` 만 사용 — LegalDocument 의 별도 ActionType (예: `operator-edit-legal`) 분리 필요성 (LL-DEFER-09 marker 의 RBAC cascade) 가 § 4 audit 결정과 정합인가?

### 4. Schema 결함

- `legal_document` table:
  - `legal_document_instance_type_unique UNIQUE (instance_id, document_type)` — admin/ARCH § 3.8.1 의 "5종 자동 생성" 가정과 정합 (per documentType 1개). 운영자가 `documentType=other` 로 추가 LegalDocument 생성 시 차단되는데 의도된 결정인가? 향후 cookie·other 추가 시 마이그레이션 부담?
  - CHECK `body_length BETWEEN 1 AND 200000` — CONTENT_STANDARDS § 4 body 검증 규약 (answer-first AST 등) 면제 marker 가 plan SoT 인용 충분한가?
  - `template_version_format CHECK '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'` — semver 규약. `templateVersion = "privacy@1.0.0"` (slug 가 documentType 와 동일 가정) 시 slug 변경 (예: `documentType=other` `slug=custom-policy`) 의 template_version naming 충돌?
  - `legal_document_auto_generated_template_ver CHECK ((auto_generated = false) OR (template_version IS NOT NULL))` — 의도 reverse? auto_generated=true 일 때 template_version 필수가 정합 (수동 작성 시 template_version null OK)?
- `clinic_profile` policy_* columns:
  - phone format regex `^[+0-9 ()-]{4,32}$` — 한국 국번 (02-1234-5678, 010-1234-5678) 정합? 글로벌 폼식과 호환?
- `location_profile.metadata.businessHours`:
  - JSON 정규화 표현이 CT-02 BusinessHours SoT 와 정합? `closed: true` 로 휴진 표시 vs CT-02 의 exception/holiday 표현?
  - JSON schema CHECK 부재 — application-level 검증만으로 fail-closed 보장 가능? Drizzle/raw SQL 정합?

### 5. Server Action 결함

- 단일 tx 안 13 entity row write (1 ClinicProfile + 1 LocationProfile + 5 LegalDocument + 5 SELECT FOR UPDATE) — withSkeletonTx timeout/lock 한계? deadlock 시 결정적 순서 (LL-ACTION-04) 가 ClinicProfile/LocationProfile 사이에도 적용되는가?
- LL-ACTION-06 의 자동 재렌더링 — `templateVersion=current` row 만 자동 재렌더링이라고 했지만 v0.1 에서는 운영자 수동 편집 차단 (LL-DEFER-06). 그러면 LL-ACTION-06 의 조건 분기 자체가 dead code (모든 row 가 templateVersion=current)?
- LL-ACTION-09 의 RenderContext: `clinic.legalEntityName: string | null` — LL-ACTION-11 의 fallback 처리만으로 충분? 템플릿이 NULL 값을 받았을 때 build error vs `(none)` 치환의 결정?
- LL-ACTION-15 의 다중 contract 단일 audit — analytics-reporting Feature v1.0 의 audit payload 규약 (`payload.contracts[]` 형식) 과 cascade 정합?

### 6. Form / UX

- LL-FORM-02 single form — 입력 필드가 ~30개 (기존 11 + 본원 13 + 정책 4 + 채널 6) 로 늘어남. RSC + Server Actions FormData payload size 한계 (~10MB default — 문제 없음)?
- LL-FORM-04 의 policyContactEmail required — admin/ARCH § 3.8.2 의 "정책 변수 보조 섹션" 명시 (개인정보 보호 책임자명·연락처) 와 정합인지 검증. 한국 PIPA 의 개인정보처리방침 필수 기재사항 (개인정보 보호책임자 이름·소속·이메일·전화) 모두 채워지는가?
- LL-FORM-07 businessHours UI — 7 요일 행 + 조건부 disable. 접근성 (a11y) marker 부재?

### 7. Core 표준 템플릿

- LL-TEMPLATE-04 의 "법무 검토 필수 marker" — Core 표준 템플릿 본문 자체는 본 plan 범위 외라고 했지만, 변수 화이트리스트 (LL-TEMPLATE-05) 는 본 plan 범위 내. 변수 화이트리스트의 PIPA 정합 (개인정보 보호책임자, 처리 목적, 보유기간 등 필수 항목 변수가 부족하지 않은가)?
- LL-TEMPLATE-06 의 자동 재렌더링 정책 — minor/major 의 distinction 이 plan 안에서 사용되는 의미 명시 부족 (LL-DEFER-10 만 marker). v0.1 단계 자동 재렌더링이 운영자 수동 편집 차단 (LL-DEFER-06) 과 함께 작동하는 시나리오 (운영자가 변수 값 변경 시) 명시?
- 5종 documentType (`privacy, terms, non-covered, refund, complaint`) 의 한국 의료법 정합 — 의료법 제56조제2항 15호 (의료광고 사전심의), 비급여 진료 안내 의무 (의료법 제45조), 의료기관 환자 권리장전 등 누락 항목?

### 8. § 8.1 RLS 시나리오 cascade

- 시나리오 14~19 가 기존 13 시나리오와 일관된 형식? 시나리오 16 (CHECK 위반) 의 운영자 메시지 처리 명시 부재?
- 시나리오 19 (변수 화이트리스트 외 키) 의 detection 시점 — server action build time vs runtime? unit test cascade marker 부재?

### 9. ADMIN_UI_SKELETON_PLAN cascade

- § 5.5 audit matrix 에 `ClinicProfileBundle` row 추가 marker — 정합 (LL-ACTION-16)? 기존 `content-saved` row 와 contentType 분기 처리 (apps/web/src/lib/errors.ts mapDbErrorToFieldErrors 의 ClinicProfile vs Bundle 매핑)?
- ADMIN-UI-15·62 marker close 정합? 본 plan v0.1 acceptance 시 ADMIN-UI-15 close 가능?

### 10. M0 v1.0 cascade marker / defer 일관성

- 10 개 defer marker (LL-DEFER-01~10) 가 모두 본문에 명시 + § 9 정리? 잔류 marker 누락?
- LL-DEFER-09 의 RBAC cascade 가 REVIEW_WORKFLOW 14 ActionType 의 cascade marker 와 중복? 통합 가능?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 1,
  "closeableAfterPatch": false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

v0.1 minimal·blocking·major 결함 다수 발견 자연 (이전 Plan v0.1 cycle 16~22 finding 통상). 사이클별 수렴 추세를 기대 (cycle1 가 가장 많고, cycle2~ 점차 감소).
codex
검토 스킬 `seo-geo`는 이번 요청 범위와 맞지 않아 쓰지 않습니다. 먼저 대상 plan과 SoT 문서의 관련 절을 읽고, 실제 스키마와 액션 시그니처를 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###)|LL-|LegalDocument|LocationProfile|3'"\\.8|C-16|C-21|documentType|businessHours|primaryCtas|parentClinic|policy|template|RLS|ActionType|content_publication_status\" docs/decisions/LOCATION_LEGAL_PLAN.md docs/admin/ARCHITECTURE.md docs/core/DATA_MODEL.md docs/admin/REVIEW_WORKFLOW.md docs/admin/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/decisions/M0_SCHEMA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE|clinic_profile|location_profile|legal_document|policy_|metadata|business_hours|businessHours|upsert|save|ActionType|audit|withSkeletonTx|FOR UPDATE|mapDbErrorToFieldErrors|content_publication_status" packages/core-content/migrations/C0001_clinic_profile.sql packages/core-content/migrations/C0002_location_profile.sql apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts apps/web/src/components/forms/ClinicProfileForm.tsx apps/web/src/lib/action-context.ts apps/web/src/lib/page-context.ts apps/web/src/lib/errors.ts apps/web/src/lib/tenant.ts apps/web/src/lib/save-result.ts packages/db/src/tenant.ts packages/db/src/service-role.ts apps/spike-a/migrations/003_audit_log.sql apps/spike-e/migrations/004_audit_event.sql' in C:\Users\assag\solution\website-exposure
2026-05-16T06:01:54.636048Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE|clinic_profile|location_profile|legal_document|policy_|metadata|business_hours|businessHours|upsert|save|ActionType|audit|withSkeletonTx|FOR UPDATE|mapDbErrorToFieldErrors|content_publication_status" packages/core-content/migrations/C0001_clinic_profile.sql packages/core-content/migrations/C0002_location_profile.sql apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts apps/web/src/components/forms/ClinicProfileForm.tsx apps/web/src/lib/action-context.ts apps/web/src/lib/page-context.ts apps/web/src/lib/errors.ts apps/web/src/lib/tenant.ts apps/web/src/lib/save-result.ts packages/db/src/tenant.ts packages/db/src/service-role.ts apps/spike-a/migrations/003_audit_log.sql apps/spike-e/migrations/004_audit_event.sql'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE|clinic_profile|location_profile|legal_document|policy_|metadata|business_hours|businessHours|upsert|save|ActionType|audit|withSkeletonTx|FOR UPDATE|mapDbErrorToFieldErrors|content_publication_status" packages/core-content/migrations/C0001_clinic_profile.sql packages/core-content/migrations/C0002_location_profile.sql apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts apps/web/src/components/forms/ClinicProfileForm.tsx apps/web/src/lib/action-context.ts apps/web/src/lib/page-context.ts apps/web/src/lib/errors.ts apps/web/src/lib/tenant.ts apps/web/src/lib/save-result.ts packages/db/src/tenant.ts packages/db/src/service-role.ts apps/spike-a/migrations/003_audit_log.sql apps/spike-e/migrations/004_audit_event.sql'` rejected: blocked by policy
2026-05-16T06:01:56.393310Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.8 seconds
Total output lines: 636
Output:
docs/decisions/M0_SCHEMA_PLAN.md:1:# M0 vertical slice schema plan (v0.1·2026-05-15)
docs/decisions/M0_SCHEMA_PLAN.md:5:## SoT
docs/decisions/M0_SCHEMA_PLAN.md:12:## P0 entity 분류 (M0 vertical slice — ~15 tables)
docs/decisions/M0_SCHEMA_PLAN.md:18:| 3 | C-21 | LocationProfile | core-content | P0 |
docs/decisions/M0_SCHEMA_PLAN.md:35:## packages/db extend (Instance·M0 audit_log)
docs/decisions/M0_SCHEMA_PLAN.md:40:## packages/core-content (Phase 0 신규)
docs/decisions/M0_SCHEMA_PLAN.md:47:## packages/notifications-outbox extend
docs/decisions/M0_SCHEMA_PLAN.md:52:## v0.1 scope (본 cycle)
docs/decisions/M0_SCHEMA_PLAN.md:57:3. LocationProfile
docs/decisions/M0_SCHEMA_PLAN.md:68:이유: DATA_MODEL의 각 entity가 50~100 필드·M0 vertical slice는 핵심 column만 (id·name·slug·body·created/updated·FK·RLS)·이후 cycle에서 detail 확장.
docs/decisions/M0_SCHEMA_PLAN.md:70:## Migration namespace
docs/decisions/M0_SCHEMA_PLAN.md:80:## 공통 패턴 (모든 M0 table)
docs/decisions/M0_SCHEMA_PLAN.md:86:- RLS ENABLE + FORCE·tenant_isolation policy (Spike A 패턴)
docs/decisions/M0_SCHEMA_PLAN.md:91:## SoT cascade
docs/decisions/M0_SCHEMA_PLAN.md:94:- REVIEW_WORKFLOW v1.0 → ComplianceRecord status·content_publication_status 9 states (cycle2 정합)
docs/decisions/M0_SCHEMA_PLAN.md:99:## acceptance gate v0.1
docs/decisions/M0_SCHEMA_PLAN.md:105:- RLS policy 모든 tenant table에 적용
docs/decisions/M0_SCHEMA_PLAN.md:108:## v0.2~ deferred
docs/decisions/M0_SCHEMA_PLAN.md:115:## Deferred 11 findings 개별 SoT cascade markers (M0-23 cycle4)
docs/decisions/M0_SCHEMA_PLAN.md:127:| **M0-12** LocationProfile phone format·businessHours·reservationChannels | M0 v1.0 Phase 0 Week 4 | DATA_MODEL C-21 master spec·typed sub-table BusinessHours·ReservationChannel 별도 |
docs/decisions/M0_SCHEMA_PLAN.md:131:| **M0-20** SQL apply·RLS·drizzle-kit diff empirical gate | M0 v1.0 Phase 0 Week 4 LOCAL_PASS 실측 | docker postgres apply·RLS scenario 실 검증·drizzle-kit generate diff 0·본 v0.x는 static typecheck·byte-equal 시점 별도 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:1:# Compliance — 의료광고 준수 공통 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:17:## 0. 한 페이지 요약
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:20:- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추가
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:31:## 1. 일반 규약
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:33:### 1.1 갱신 정책
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:44:### 1.2 SoT 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:57:### 1.3 본 문서가 다루지 않는 영역
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:65:## 2. 의료법 핵심 조문
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:75:### 2.1 의료법 제56조 — 의료광고의 금지 등
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:84:### 2.2 의료법 제56조제2항 — 금지 유형 15호 (운영 기준)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:95:| 8호 | **객관적인 사실을 과장하는 광고** | § 3.8 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:106:### 2.3 의료법 제57조 — 의료광고의 심의
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:115:### 2.4 의료법 시행령 제23조 — 의료광고 금지 기준 세부
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:126:### 2.5 의료법 시행령 제24조 — 의료광고 심의 대상 매체
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:137:## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:141:### 3.0 canonical RiskRule + legalBasis[] 패턴
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:155:### 3.1 평가받지 아니한 신의료기술 광고 (제56조제2항제1호 + 시행령 제23조제1항제1호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:161:### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:168:- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:171:### 3.3 거짓된 내용을 표시하는 광고 (제56조제2항제3호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:177:### 3.4 비교 광고 (제56조제2항제4호 + 시행령 제23조제1항제4호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:184:### 3.5 비방 광고 (제56조제2항제5호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:190:### 3.6 수술 장면·환부 노출 광고 (제56조제2항제6호 + 시행령 제23조제1항제6호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:197:### 3.7 부작용 등 정보 누락 광고 (제56조제2항제7호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:203:### 3.8 사실 과장 광고 (제56조제2항제8호 + 시행령 제23조제1항제8호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:211:### 3.9 법적 근거 없는 자격·명칭 광고 (제56조제2항제9호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:217:### 3.10 기사형 광고 (제56조제2항제10호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:223:### 3.11 미심의 광고 (제56조제2항제11호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:229:### 3.12 외국인환자 유치 국내광고 (제56조제2항제12호 + 시행령 제23조제1항제12호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:241:### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:251:### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:263:### 3.15 시행령 위임 — 그 밖의 광고 (제56조제2항제15호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:271:## 4. 사전심의 대상 판정 (제57조 + 시행령 제24조)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:273:### 4.1 방송 의료광고 — 매체 자체 금지 (제56조제3항)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:279:### 4.2 사전심의 대상 매체 (제57조제1항 + 시행령 제24조)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:294:### 4.3 사전심의 절차
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:302:### 4.4 사전심의 면제 사항 (제57조제3항 + 시행령 제24조제7항)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:331:## 5. 환자 후기 (치료경험담) 운영 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:333:### 5.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:339:### 5.2 P-101 Reviews 페이지 운영
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:350:### 5.3 P-101 미운영 시
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:357:## 6. 전후사진 운영 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:359:### 6.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:365:### 6.2 예외적 허용 조건
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:381:### 6.3 자동 검출
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:388:## 7. 가격·할인·이벤트 노출 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:390:### 7.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:396:### 7.2 분류
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:406:### 7.3 허용 페이지
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:414:### 7.4 가격 변경 운영
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:421:## 8. 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:425:### 8.1 인정 단위·정책
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:437:### 8.2 한국 학회·전문 단체
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:448:### 8.3 정부·공공기관 (개별 도메인 등록)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:461:### 8.4 국제 학술·공공기관 — 원문 도메인만
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:475:### 8.5 인정하지 않는 카테고리
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:484:### 8.6 화이트리스트 갱신
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:492:## 9. 한의 특유 표현 회색지대 (CS-04 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:496:### 9.1 회색지대 카테고리
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:506:### 9.2 preset 데이터 파일
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:514:## 10. 다국어 표현 가이드 (CS-06 부분 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:518:### 10.1 적용 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:524:### 10.2 다국어 RiskRule 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:530:### 10.3 사전 선택·결합
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:540:## 11. 의료법 개정 이력 (사람 가독 SoT)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:544:### 11.1 추적 항목
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:554:### 11.2 개정 이력 (실제 추적 — 운영 누적)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:567:### 11.3 개정 시 절차 (RISK_LEVELS § 7.1.3 정합)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:578:## 12. 미결정 사항
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:587:### 12.1 해소된 미결정
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:593:### 12.2 의도적 범위 외 (포함하지 않음)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:602:## 13. 변경 이력
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:1:# apps/web admin UI skeleton plan (v1.0·acceptance·2026-05-15)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:5:본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:15:## SoT
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:21:- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Single DB + RLS · Provider · Storage = R2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:34:## 1. 목적과 walking skeleton 정의
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:36:### 1.1 목적
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:39:- 검증할 전구간: Next.js App Router → packages/auth magic-link · resolveTenantContext → packages/db withTenantTransaction · RLS → packages/core-content 6 tables · Drizzle → Server Action 결과 → 다시 렌더링.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:41:### 1.2 walking skeleton 범위 (포함)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:51:### 1.3 walking skeleton 비범위 (deferred)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:59:| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:70:## 2. 기술 스택 결정 (admin/ARCHITECTURE § 10 미결정 항목 close)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:75:| **A-02** | 어드민 DB | PostgreSQL (Single DB + RLS · INFRA v1.0 § 4.1 정합) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:91:## 3. 디렉토리 구조 (apps/web)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:142:### 3.1 라우트 흐름
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:154:### 3.2 인증 흐름 시퀀스 (cycle2 정정 ADMIN-UI-32·33)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:222:## 4. packages 의존성
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:245:## 5. 인증 · 세션 · tenant resolve 통합 명세
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:247:### 5.1 cookie 명세 (cycle2 정정 ADMIN-UI-37·38)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:260:### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:274:  // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:295:### 5.3 tenant context · transaction 2단계 패턴 (cycle2 정정 ADMIN-UI-30)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:318:### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:350:### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:404:## 6. ClinicProfile 폼 명세 (skeleton 범위)…14476 tokens truncated…ars.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:381:| 3 | Core 표준 템플릿 5종 + render 엔진 | packages/core-content/src/templates/* + tests |
docs/decisions/LOCATION_LEGAL_PLAN.md:382:| 4 | zod schema (businessHours · reservationChannels · policy vars) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md:389:## 9. M0 v1.0 cascade marker (defer 정리)
docs/decisions/LOCATION_LEGAL_PLAN.md:391:- `LL-DEFER-01`: LegalDocument 발행 게이트 (compliance-assistant Feature + ComplianceRecord UI cascade).
docs/decisions/LOCATION_LEGAL_PLAN.md:392:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
docs/decisions/LOCATION_LEGAL_PLAN.md:393:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
docs/decisions/LOCATION_LEGAL_PLAN.md:394:- `LL-DEFER-04`: reservationChannels 풀세트 (모든 CTAConfig type).
docs/decisions/LOCATION_LEGAL_PLAN.md:395:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI.
docs/decisions/LOCATION_LEGAL_PLAN.md:396:- `LL-DEFER-06`: LegalDocument body 수동 override · 자동 재렌더링 정책.
docs/decisions/LOCATION_LEGAL_PLAN.md:397:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
docs/decisions/LOCATION_LEGAL_PLAN.md:398:- `LL-DEFER-08`: 5종 LegalDocument 각각의 effectiveDate individual override 폼.
docs/decisions/LOCATION_LEGAL_PLAN.md:399:- `LL-DEFER-09`: `ClinicProfileBundle` audit contentType 권한 분리 (M0 v1.0 RBAC).
docs/decisions/LOCATION_LEGAL_PLAN.md:400:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
docs/decisions/LOCATION_LEGAL_PLAN.md:402:## 변경 이력
docs/core/DATA_MODEL.md:1:# Core — 데이터 계약 명세
docs/core/DATA_MODEL.md:17:## 0. 한 페이지 요약
docs/core/DATA_MODEL.md:23:- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
docs/core/DATA_MODEL.md:29:## 1. 계약 인벤토리
docs/core/DATA_MODEL.md:31:### 1.1 데이터 계약 (23개)
docs/core/DATA_MODEL.md:50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
docs/core/DATA_MODEL.md:55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
docs/core/DATA_MODEL.md:59:### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
docs/core/DATA_MODEL.md:63:| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
docs/core/DATA_MODEL.md:64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:69:## 2. 공통 룰
docs/core/DATA_MODEL.md:71:### 2.1 타입 표기법
docs/core/DATA_MODEL.md:85:### 2.2 공통 메타 필드 (모든 계약)
docs/core/DATA_MODEL.md:95:### 2.3 식별자(`@id`) 규약
docs/core/DATA_MODEL.md:99:### 2.4 다국어
docs/core/DATA_MODEL.md:102:### 2.5 SoT 원칙 (v0.4 명시)
docs/core/DATA_MODEL.md:103:- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
docs/core/DATA_MODEL.md:104:- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
docs/core/DATA_MODEL.md:105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
docs/core/DATA_MODEL.md:107:### 2.6 변경 정책
docs/core/DATA_MODEL.md:126:## 3. 공통 타입 풀명세
docs/core/DATA_MODEL.md:128:### CT-01. `TrustMetric` — 신뢰도·통계 지표
docs/core/DATA_MODEL.md:151:### CT-02. `BusinessHours` — 진료시간·접수시간·휴진
docs/core/DATA_MODEL.md:166:#### `OpeningHoursSpec`
docs/core/DATA_MODEL.md:175:#### `LunchBreak`
docs/core/DATA_MODEL.md:182:#### `SpecialClosure`
docs/core/DATA_MODEL.md:189:### CT-03. `CTAConfig` — 전환 채널 설정
docs/core/DATA_MODEL.md:203:| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:211:## 4. 데이터 계약 풀명세 (M0 핵심)
docs/core/DATA_MODEL.md:213:### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)
docs/core/DATA_MODEL.md:215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
docs/core/DATA_MODEL.md:239:| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
docs/core/DATA_MODEL.md:240:| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
docs/core/DATA_MODEL.md:246:#### `Address`
docs/core/DATA_MODEL.md:255:#### `GeoCoordinates`
docs/core/DATA_MODEL.md:261:#### `Award`
docs/core/DATA_MODEL.md:269:#### `Affiliation`
docs/core/DATA_MODEL.md:277:#### `ResearchInstitute`
docs/core/DATA_MODEL.md:285:#### `SocialMediaLinks`
docs/core/DATA_MODEL.md:296:#### `MediaItem`
docs/core/DATA_MODEL.md:304:#### `InternationalSupport`
docs/core/DATA_MODEL.md:312:### C-02. `DoctorProfile` — 의료진 권위·전문성
docs/core/DATA_MODEL.md:335:| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
docs/core/DATA_MODEL.md:336:| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
docs/core/DATA_MODEL.md:340:#### `Credential`
docs/core/DATA_MODEL.md:349:#### `Education`
docs/core/DATA_MODEL.md:356:#### `CareerItem`
docs/core/DATA_MODEL.md:363:#### `Publication`
docs/core/DATA_MODEL.md:371:### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
docs/core/DATA_MODEL.md:408:#### `ProcessStep`
docs/core/DATA_MODEL.md:416:#### `TreatmentComponent` (v0.4 신규)
docs/core/DATA_MODEL.md:425:#### `VisitFlowStep` (v0.4 신규)
docs/core/DATA_MODEL.md:434:#### `ProgramVariant`
docs/core/DATA_MODEL.md:447:#### `EvidenceNote` (v0.4 신규)
docs/core/DATA_MODEL.md:456:#### `SlotRiskOverride`
docs/core/DATA_MODEL.md:463:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
docs/core/DATA_MODEL.md:509:#### `EmbeddedMedia`
docs/core/DATA_MODEL.md:524:### C-05. `RiskLevel` (enum) — 위험도 등급
docs/core/DATA_MODEL.md:534:### C-06. `PageMeta` — 페이지별 메타 데이터
docs/core/DATA_MODEL.md:552:### C-07. `BrandTokens` — 디자인 토큰 최종값
docs/core/DATA_MODEL.md:567:### C-08. `InstanceManifest` — 버전 고정 명세
docs/core/DATA_MODEL.md:595:| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:604:#### `RobotsOverride` (v0.11 신규)
docs/core/DATA_MODEL.md:613:#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
docs/core/DATA_MODEL.md:626:#### `NotificationChannelsConfig` (v0.13 확장)
docs/core/DATA_MODEL.md:636:#### `VersionSpec`
docs/core/DATA_MODEL.md:639:#### `IANATimezone` (v0.13 신규)
docs/core/DATA_MODEL.md:643:#### `AnalyticsConfig` (v0.14 신규)
docs/core/DATA_MODEL.md:654:#### `SearchVisibilityConfig` (v0.16 신규)
docs/core/DATA_MODEL.md:663:#### `KeywordMonitoringConfig` (v0.17 신규)
docs/core/DATA_MODEL.md:671:#### `AssetIngestionConfig` (v0.18 신규)
docs/core/DATA_MODEL.md:680:#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)
docs/core/DATA_MODEL.md:696:#### `CrmSyncConfig` (v0.19 신규)
docs/core/DATA_MODEL.md:702:#### `CrmIntegrationEntry` (v0.19 신규)
docs/core/DATA_MODEL.md:720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
docs/core/DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
docs/core/DATA_MODEL.md:736:#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
docs/core/DATA_MODEL.md:751:### C-09. `FeatureModuleConfig` — Feature Module 설정
docs/core/DATA_MODEL.md:759:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
docs/core/DATA_MODEL.md:763:#### 어드민 DB 원본 (풀데이터)
docs/core/DATA_MODEL.md:769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs/core/DATA_MODEL.md:782:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
docs/core/DATA_MODEL.md:783:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
docs/core/DATA_MODEL.md:797:#### `MediaThresholdAssessment` (v0.14 +)
docs/core/DATA_MODEL.md:815:#### `WarningAcknowledgement` (v0.8 +)
docs/core/DATA_MODEL.md:824:#### `StaleFlags`
docs/core/DATA_MODEL.md:834:#### Git 사본 (경량 빌드 참조)
docs/core/DATA_MODEL.md:844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
docs/core/DATA_MODEL.md:846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:854:| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
docs/core/DATA_MODEL.md:858:| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
docs/core/DATA_MODEL.md:861:| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
docs/core/DATA_MODEL.md:867:#### `LegalDocumentRevision`
docs/core/DATA_MODEL.md:875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs/core/DATA_MODEL.md:878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
docs/core/DATA_MODEL.md:886:| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
docs/core/DATA_MODEL.md:893:| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:913:### C-22. `ArticleCategory` — Article Pillar 분류
docs/core/DATA_MODEL.md:930:## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
docs/core/DATA_MODEL.md:932:### C-11. `MedicalConditionPage`
docs/core/DATA_MODEL.md:935:### C-12. `FAQ`
docs/core/DATA_MODEL.md:938:### C-13. `ReviewPolicy`
docs/core/DATA_MODEL.md:941:### C-14. `MedicalSpecialty`
docs/core/DATA_MODEL.md:944:### C-15. `SchemaInput`
docs/core/DATA_MODEL.md:947:### C-17. `PricingPage`
docs/core/DATA_MODEL.md:950:### C-18. `FacilitiesPage`
docs/core/DATA_MODEL.md:953:### C-19. `NewsItem`
docs/core/DATA_MODEL.md:956:### C-20. `ReservationPage`
docs/core/DATA_MODEL.md:959:### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
docs/core/DATA_MODEL.md:979:#### `NotificationPreferences` (C-23 하위 타입)
docs/core/DATA_MODEL.md:988:#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)
docs/core/DATA_MODEL.md:1003:## 6. 관계 다이어그램
docs/core/DATA_MODEL.md:1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
docs/core/DATA_MODEL.md:1013:LocationProfile (C-21) — 위치·시간·연락 SoT
docs/core/DATA_MODEL.md:1014:   ├─ businessHours → BusinessHours (CT-02)
docs/core/DATA_MODEL.md:1016:   ├─ parentClinic → ClinicProfile (C-01)
docs/core/DATA_MODEL.md:1022:   ├─ primaryLocation → LocationProfile (C-21)
docs/core/DATA_MODEL.md:1023:   ├─ additionalLocations → LocationProfile[]
docs/core/DATA_MODEL.md:1049:## 7. 변경 정책
docs/core/DATA_MODEL.md:1055:## 8. 미결정 사항
docs/core/DATA_MODEL.md:1070:| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
docs/core/DATA_MODEL.md:1075:| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
docs/core/DATA_MODEL.md:1081:## 9. 변경 이력
docs/core/DATA_MODEL.md:1086:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs/core/DATA_MODEL.md:1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
docs/core/DATA_MODEL.md:1093:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
docs/core/DATA_MODEL.md:1097:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1103:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
docs/core/DATA_MODEL.md:1104:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1106:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/admin/CONTENT_STANDARDS.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 1758ms:
docs/decisions/M0_SCHEMA_PLAN.md:1:# M0 vertical slice schema plan (v0.1·2026-05-15)
docs/decisions/M0_SCHEMA_PLAN.md:5:## SoT
docs/decisions/M0_SCHEMA_PLAN.md:12:## P0 entity 분류 (M0 vertical slice — ~15 tables)
docs/decisions/M0_SCHEMA_PLAN.md:18:| 3 | C-21 | LocationProfile | core-content | P0 |
docs/decisions/M0_SCHEMA_PLAN.md:35:## packages/db extend (Instance·M0 audit_log)
docs/decisions/M0_SCHEMA_PLAN.md:40:## packages/core-content (Phase 0 신규)
docs/decisions/M0_SCHEMA_PLAN.md:47:## packages/notifications-outbox extend
docs/decisions/M0_SCHEMA_PLAN.md:52:## v0.1 scope (본 cycle)
docs/decisions/M0_SCHEMA_PLAN.md:57:3. LocationProfile
docs/decisions/M0_SCHEMA_PLAN.md:68:이유: DATA_MODEL의 각 entity가 50~100 필드·M0 vertical slice는 핵심 column만 (id·name·slug·body·created/updated·FK·RLS)·이후 cycle에서 detail 확장.
docs/decisions/M0_SCHEMA_PLAN.md:70:## Migration namespace
docs/decisions/M0_SCHEMA_PLAN.md:80:## 공통 패턴 (모든 M0 table)
docs/decisions/M0_SCHEMA_PLAN.md:86:- RLS ENABLE + FORCE·tenant_isolation policy (Spike A 패턴)
docs/decisions/M0_SCHEMA_PLAN.md:91:## SoT cascade
docs/decisions/M0_SCHEMA_PLAN.md:94:- REVIEW_WORKFLOW v1.0 → ComplianceRecord status·content_publication_status 9 states (cycle2 정합)
docs/decisions/M0_SCHEMA_PLAN.md:99:## acceptance gate v0.1
docs/decisions/M0_SCHEMA_PLAN.md:105:- RLS policy 모든 tenant table에 적용
docs/decisions/M0_SCHEMA_PLAN.md:108:## v0.2~ deferred
docs/decisions/M0_SCHEMA_PLAN.md:115:## Deferred 11 findings 개별 SoT cascade markers (M0-23 cycle4)
docs/decisions/M0_SCHEMA_PLAN.md:127:| **M0-12** LocationProfile phone format·businessHours·reservationChannels | M0 v1.0 Phase 0 Week 4 | DATA_MODEL C-21 master spec·typed sub-table BusinessHours·ReservationChannel 별도 |
docs/decisions/M0_SCHEMA_PLAN.md:131:| **M0-20** SQL apply·RLS·drizzle-kit diff empirical gate | M0 v1.0 Phase 0 Week 4 LOCAL_PASS 실측 | docker postgres apply·RLS scenario 실 검증·drizzle-kit generate diff 0·본 v0.x는 static typecheck·byte-equal 시점 별도 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:1:# Compliance — 의료광고 준수 공통 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:17:## 0. 한 페이지 요약
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:20:- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추가
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:31:## 1. 일반 규약
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:33:### 1.1 갱신 정책
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:44:### 1.2 SoT 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:57:### 1.3 본 문서가 다루지 않는 영역
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:65:## 2. 의료법 핵심 조문
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:75:### 2.1 의료법 제56조 — 의료광고의 금지 등
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:84:### 2.2 의료법 제56조제2항 — 금지 유형 15호 (운영 기준)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:95:| 8호 | **객관적인 사실을 과장하는 광고** | § 3.8 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:106:### 2.3 의료법 제57조 — 의료광고의 심의
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:115:### 2.4 의료법 시행령 제23조 — 의료광고 금지 기준 세부
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:126:### 2.5 의료법 시행령 제24조 — 의료광고 심의 대상 매체
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:137:## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:141:### 3.0 canonical RiskRule + legalBasis[] 패턴
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:155:### 3.1 평가받지 아니한 신의료기술 광고 (제56조제2항제1호 + 시행령 제23조제1항제1호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:161:### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:168:- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:171:### 3.3 거짓된 내용을 표시하는 광고 (제56조제2항제3호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:177:### 3.4 비교 광고 (제56조제2항제4호 + 시행령 제23조제1항제4호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:184:### 3.5 비방 광고 (제56조제2항제5호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:190:### 3.6 수술 장면·환부 노출 광고 (제56조제2항제6호 + 시행령 제23조제1항제6호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:197:### 3.7 부작용 등 정보 누락 광고 (제56조제2항제7호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:203:### 3.8 사실 과장 광고 (제56조제2항제8호 + 시행령 제23조제1항제8호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:211:### 3.9 법적 근거 없는 자격·명칭 광고 (제56조제2항제9호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:217:### 3.10 기사형 광고 (제56조제2항제10호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:223:### 3.11 미심의 광고 (제56조제2항제11호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:229:### 3.12 외국인환자 유치 국내광고 (제56조제2항제12호 + 시행령 제23조제1항제12호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:241:### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:251:### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:263:### 3.15 시행령 위임 — 그 밖의 광고 (제56조제2항제15호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:271:## 4. 사전심의 대상 판정 (제57조 + 시행령 제24조)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:273:### 4.1 방송 의료광고 — 매체 자체 금지 (제56조제3항)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:279:### 4.2 사전심의 대상 매체 (제57조제1항 + 시행령 제24조)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:294:### 4.3 사전심의 절차
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:302:### 4.4 사전심의 면제 사항 (제57조제3항 + 시행령 제24조제7항)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:331:## 5. 환자 후기 (치료경험담) 운영 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:333:### 5.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:339:### 5.2 P-101 Reviews 페이지 운영
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:350:### 5.3 P-101 미운영 시
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:357:## 6. 전후사진 운영 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:359:### 6.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:365:### 6.2 예외적 허용 조건
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:381:### 6.3 자동 검출
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:388:## 7. 가격·할인·이벤트 노출 가이드
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:390:### 7.1 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:396:### 7.2 분류
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:406:### 7.3 허용 페이지
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:414:### 7.4 가격 변경 운영
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:421:## 8. 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:425:### 8.1 인정 단위·정책
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:437:### 8.2 한국 학회·전문 단체
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:448:### 8.3 정부·공공기관 (개별 도메인 등록)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:461:### 8.4 국제 학술·공공기관 — 원문 도메인만
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:475:### 8.5 인정하지 않는 카테고리
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:484:### 8.6 화이트리스트 갱신
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:492:## 9. 한의 특유 표현 회색지대 (CS-04 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:496:### 9.1 회색지대 카테고리
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:506:### 9.2 preset 데이터 파일
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:514:## 10. 다국어 표현 가이드 (CS-06 부분 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:518:### 10.1 적용 원칙
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:524:### 10.2 다국어 RiskRule 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:530:### 10.3 사전 선택·결합
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:540:## 11. 의료법 개정 이력 (사람 가독 SoT)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:544:### 11.1 추적 항목
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:554:### 11.2 개정 이력 (실제 추적 — 운영 누적)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:567:### 11.3 개정 시 절차 (RISK_LEVELS § 7.1.3 정합)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:578:## 12. 미결정 사항
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:587:### 12.1 해소된 미결정
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:593:### 12.2 의도적 범위 외 (포함하지 않음)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:602:## 13. 변경 이력
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:1:# apps/web admin UI skeleton plan (v1.0·acceptance·2026-05-15)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:5:본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:15:## SoT
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:21:- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Single DB + RLS · Provider · Storage = R2)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:34:## 1. 목적과 walking skeleton 정의
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:36:### 1.1 목적
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:39:- 검증할 전구간: Next.js App Router → packages/auth magic-link · resolveTenantContext → packages/db withTenantTransaction · RLS → packages/core-content 6 tables · Drizzle → Server Action 결과 → 다시 렌더링.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:41:### 1.2 walking skeleton 범위 (포함)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:51:### 1.3 walking skeleton 비범위 (deferred)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:59:| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:70:## 2. 기술 스택 결정 (admin/ARCHITECTURE § 10 미결정 항목 close)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:75:| **A-02** | 어드민 DB | PostgreSQL (Single DB + RLS · INFRA v1.0 § 4.1 정합) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:91:## 3. 디렉토리 구조 (apps/web)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:142:### 3.1 라우트 흐름
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:154:### 3.2 인증 흐름 시퀀스 (cycle2 정정 ADMIN-UI-32·33)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:222:## 4. packages 의존성
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:245:## 5. 인증 · 세션 · tenant resolve 통합 명세
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:247:### 5.1 cookie 명세 (cycle2 정정 ADMIN-UI-37·38)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:260:### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:274:  // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:295:### 5.3 tenant context · transaction 2단계 패턴 (cycle2 정정 ADMIN-UI-30)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:318:### 5.4 에러 → UI mapping + audit reason taxonomy 분리 (cycle3 정정 ADMIN-UI-45·55)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:350:### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:404:## 6. ClinicProfile 폼 명세 (skeleton 범위)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:406:### 6.1 입력 필드 (cycle2 정정 ADMIN-UI-42)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:425:### 6.2 Server Action `saveClinicProfile` — bound action (cycle2 정정 ADMIN-UI-31)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:495:## 7. 환경변수 · config 주입
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:500:WEB_DATABASE_URL=postgres://...                # **웹 런타임 connection — 최소 권한 (cycle8 정정 ADMIN-UI-97 — BYPASSRLS/owner 금지)**:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:501:                                                #   (a) control-plane tables (RLS 가 걸려 있지 않거나 control-plane policy 만 적용된 instance · admin_user · instance_membership · audit_event) 의 **명시적 GRANT**:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:509:                                                #   (c) **BYPASSRLS·table owner 권한 금지** — RLS fail-closed 전제 (NULLIF unset context silent deny) 보장. tenant table 은 무조건 `SET LOCAL ROLE app_tenant_user` 안에서만 접근.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:513:                                                # 실 구성 (개발·프로덕션): WEB_DATABASE_URL ≠ SEED_DATABASE_URL — seed 는 superuser·웹 런타임은 최소 권한 (BYPASSRLS/owner 금지). 둘을 같은 admin role 로 만드는 것은 local-only shortcut 으로만 허용 (production 금지).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:536:### 7.1 seed script — system actor 부트스트랩 (cycle3 정정 ADMIN-UI-29·48·58)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:609:## 8. RLS 통합 검증 — § 8.1 시나리오 (cycle2 정정 ADMIN-UI-43)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:619:9. Forced SQL `INSERT ... VALUES ('<other-uuid>', ...)` → RLS WITH CHECK 위반 · exception.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:625:## 9. skeleton 완료 게이트
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:636:| 6 | ClinicProfile 폼 저장 + RLS 격리 | § 8.1 시나리오 1~13 PASS |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:642:## 10. 미결정 사항 → 최종 결정 (cycle3 정정 ADMIN-UI-59)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:654:## 11. Deferred
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:658:## 12. SoT cascade (cycle2 — 코드 작성 진입 전 적용 우선순위)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:681:| `packages/auth/migrations` 신규 — auth tables 를 apps/spike-e/migrations 에서 이전 + audit_event RLS/GRANT 추가 (ADMIN-UI-36·13) — skeleton 은 spike-e migrations 직접 적용 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:687:## 13. Codex 비평 cycle 운영 방침
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:691:## 14. 변경 이력 (최신순 · cycle5 ADMIN-UI-86 명시)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:695:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | v0.9 | **cycle8 patch (6 findings · major 3 · minor 3 · nit 0 전건 처리)**: (1) ADMIN-UI-97 WEB_DATABASE_URL 권한을 BYPASSRLS/owner 금지로 좁힘 — control-plane table별 명시적 GRANT 목록 + `GRANT app_tenant_user TO <web_role>` (NOINHERIT 권장) 으로 RLS fail-closed 보장, (2) ADMIN-UI-98 admin/ARCHITECTURE § 10 A-01·A-02·A-03 cascade 를 follow-up (acceptance non-blocking) 으로 낮춤 — plan 본문 결정은 plan 안에서 확정, (3) ADMIN-UI-99 PACKAGES_STRUCTURE v0.2 patch 도 follow-up 으로 낮춤, (4) ADMIN-UI-100 apps/web tree 주석 (slug-resolver · post-login-redirect) 의 service-role 잔재 제거, (5) ADMIN-UI-101 § 12 cascade 의 consumeMagicLink upsert 표현 제거 → `identifier 반환 유지 + 별도 allowlist lookup helper`, (6) ADMIN-UI-102 SoT bullet RLS 인용 byte-level 정합 — `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:700:| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:701:| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
docs/compliance/RISK_LEVELS.md:1:# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준
docs/compliance/RISK_LEVELS.md:18:## 0. 한 페이지 요약
docs/compliance/RISK_LEVELS.md:29:## 1. 일반 규약
docs/compliance/RISK_LEVELS.md:31:### 1.1 변경 정책
docs/compliance/RISK_LEVELS.md:44:### 1.2 SoT 원칙
docs/compliance/RISK_LEVELS.md:52:## 2. RiskLevel — 정의·자동 추론
docs/compliance/RISK_LEVELS.md:54:### 2.1 RiskLevel enum
docs/compliance/RISK_LEVELS.md:63:### 2.2 자동 추론 입력
docs/compliance/RISK_LEVELS.md:81:### 2.3 자동 추론 알고리즘
docs/compliance/RISK_LEVELS.md:95:#### 2.3.1 RiskInferenceResult — steps[] 추적
docs/compliance/RISK_LEVELS.md:111:### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)
docs/compliance/RISK_LEVELS.md:123:### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)
docs/compliance/RISK_LEVELS.md:136:## 3. RiskRule 데이터 파일
docs/compliance/RISK_LEVELS.md:138:### 3.1 위치·디렉토리 구조
docs/compliance/RISK_LEVELS.md:153:### 3.2 파일 포맷 — YAML + JSON Schema
docs/compliance/RISK_LEVELS.md:196:### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`
docs/compliance/RISK_LEVELS.md:281:#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책
docs/compliance/RISK_LEVELS.md:290:### 3.4 로드 순서·머지 규칙
docs/compliance/RISK_LEVELS.md:303:#### 3.4.1 `meta.yaml` 구조
docs/compliance/RISK_LEVELS.md:335:#### 3.4.2 `overrides[]` 스키마·머지 규칙
docs/compliance/RISK_LEVELS.md:338:# preset 파일 내 예시
docs/compliance/RISK_LEVELS.md:363:#### 3.4.3 `context-exceptions.yaml` 스키마
docs/compliance/RISK_LEVELS.md:391:### 3.5 버전 관리
docs/compliance/RISK_LEVELS.md:399:## 4. ApproverRole 통과 기준 — content-gate 발행 조건 (CS-02 해소)
docs/compliance/RISK_LEVELS.md:403:### 4.1 medical (의료진 검수)
docs/compliance/RISK_LEVELS.md:420:### 4.2 legal (법무 자문·승인)
docs/compliance/RISK_LEVELS.md:445:### 4.3 operator (운영자·동료 검수)
docs/compliance/RISK_LEVELS.md:458:### 4.4 client (클라이언트 측 승인)
docs/compliance/RISK_LEVELS.md:469:- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
docs/compliance/RISK_LEVELS.md:473:### 4.5 multi-role 조합 규칙
docs/compliance/RISK_LEVELS.md:489:| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
docs/compliance/RISK_LEVELS.md:494:## 5. inlineRiskFlags 자동 추출 — DM-05 영역
docs/compliance/RISK_LEVELS.md:503:### 5.1 추출 알고리즘 (RiskRule category 기반)
docs/compliance/RISK_LEVELS.md:515:### 5.1.1 카테고리 SoT
docs/compliance/RISK_LEVELS.md:519:### 5.1.2 컨텍스트별 false-positive 완화 정책
docs/compliance/RISK_LEVELS.md:525:| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
docs/compliance/RISK_LEVELS.md:526:| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |
docs/compliance/RISK_LEVELS.md:528:> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
docs/compliance/RISK_LEVELS.md:529:| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
docs/compliance/RISK_LEVELS.md:536:### 5.2 출력
docs/compliance/RISK_LEVELS.md:549:### 5.3 책임
docs/compliance/RISK_LEVELS.md:556:## 6. 위험도 자동 동작 매트릭스
docs/compliance/RISK_LEVELS.md:569:### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)
docs/compliance/RISK_LEVELS.md:595:### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override
docs/compliance/RISK_LEVELS.md:614:## 7. 운영 거버넌스
docs/compliance/RISK_LEVELS.md:616:### 7.1 의료법 개정 대응
docs/compliance/RISK_LEVELS.md:618:#### 7.1.1 추적 대상
docs/compliance/RISK_LEVELS.md:627:#### 7.1.2 추적 데이터 모델
docs/compliance/RISK_LEVELS.md:630:# data/compliance-rules/medical-law-tracking.yaml
docs/compliance/RISK_LEVELS.md:649:#### 7.1.3 개정 시 절차
docs/compliance/RISK_LEVELS.md:662:### 7.2 룰 충돌·중복 발견 시
docs/compliance/RISK_LEVELS.md:668:### 7.3 RiskRule 변경 워크플로
docs/compliance/RISK_LEVELS.md:679:## 8. 빌드 검증 — 룰 레벨 정합 (CONTENT_STANDARDS § 8 동일 패턴)
docs/compliance/RISK_LEVELS.md:689:## 9. 미결정 사항
docs/compliance/RISK_LEVELS.md:699:### 9.1 해소된 미결정
docs/compliance/RISK_LEVELS.md:708:## 10. 변경 이력
docs/compliance/RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
docs/compliance/RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
docs/compliance/RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
docs/compliance/RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
docs/admin/REVIEW_WORKFLOW.md:1:# Admin — 검수 워크플로
docs/admin/REVIEW_WORKFLOW.md:13:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
docs/admin/REVIEW_WORKFLOW.md:18:## 0. 한 페이지 요약
docs/admin/REVIEW_WORKFLOW.md:23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
docs/admin/REVIEW_WORKFLOW.md:30:## 1. 일반 규약
docs/admin/REVIEW_WORKFLOW.md:32:### 1.1 변경 정책
docs/admin/REVIEW_WORKFLOW.md:43:### 1.2 SoT 원칙
docs/admin/REVIEW_WORKFLOW.md:50:### 1.3 본 문서가 다루지 않는 영역
docs/admin/REVIEW_WORKFLOW.md:58:## 2. 워크플로 상태 머신
docs/admin/REVIEW_WORKFLOW.md:60:### 2.1 상태 enum
docs/admin/REVIEW_WORKFLOW.md:68:  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
docs/admin/REVIEW_WORKFLOW.md:75:### 2.2 전이 다이어그램
docs/admin/REVIEW_WORKFLOW.md:130:### 2.3 전이 트리거
docs/admin/REVIEW_WORKFLOW.md:138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
docs/admin/REVIEW_WORKFLOW.md:152:## 3. 검수 큐 (Review Queues)
docs/admin/REVIEW_WORKFLOW.md:154:### 3.1 큐 종류 3종
docs/admin/REVIEW_WORKFLOW.md:162:#### 3.1.1 warning 큐 이탈 조건·기록
docs/admin/REVIEW_WORKFLOW.md:168:#### 3.1.2 content-gate와 warning 동시 발생 처리
docs/admin/REVIEW_WORKFLOW.md:175:### 3.2 자동 큐 진입 트리거
docs/admin/REVIEW_WORKFLOW.md:187:- LegalDocument 발행 의무(C-10 LegalDocument required)
docs/admin/REVIEW_WORKFLOW.md:190:### 3.3 우선순위·SLA
docs/admin/REVIEW_WORKFLOW.md:205:## 4. multi-role AND 게이트
docs/admin/REVIEW_WORKFLOW.md:207:### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)
docs/admin/REVIEW_WORKFLOW.md:219:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
docs/admin/REVIEW_WORKFLOW.md:228:> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
docs/admin/REVIEW_WORKFLOW.md:231:### 4.2 검수자별 검수 화면
docs/admin/REVIEW_WORKFLOW.md:240:### 4.3 승인 액션
docs/admin/REVIEW_WORKFLOW.md:251:### 4.4 자동 차단
docs/admin/REVIEW_WORKFLOW.md:259:## 5. ComplianceRecord 슬롯 채움 흐름
docs/admin/REVIEW_WORKFLOW.md:261:### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)
docs/admin/REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
docs/admin/REVIEW_WORKFLOW.md:286:### 5.3 갱신 시점
docs/admin/REVIEW_WORKFLOW.md:297:### 5.4 ComplianceRecord 불변성·버전 모델
docs/admin/REVIEW_WORKFLOW.md:307:## 6. StaleFlags 처리
docs/admin/REVIEW_WORKFLOW.md:309:### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)
docs/admin/REVIEW_WORKFLOW.md:326:### 6.2 stale 큐 진입·처리
docs/admin/REVIEW_WORKFLOW.md:337:### 6.3 staleFlags 우선순위
docs/admin/REVIEW_WORKFLOW.md:350:## 7. 발행 결정
docs/admin/REVIEW_WORKFLOW.md:352:### 7.1 publishable 산정 알고리즘
docs/admin/REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
docs/admin/REVIEW_WORKFLOW.md:369:### 7.2 publish 액션
docs/admin/REVIEW_WORKFLOW.md:380:### 7.3 unpublish 액션
docs/admin/REVIEW_WORKFLOW.md:390:## 8. 사전심의 (priorReview) 흐름
docs/admin/REVIEW_WORKFLOW.md:392:### 8.1 priorReviewRequired 판정
docs/admin/REVIEW_WORKFLOW.md:412:#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거
docs/admin/REVIEW_WORKFLOW.md:442:### 8.2 사전심의 대상인 경우
docs/admin/REVIEW_WORKFLOW.md:454:### 8.3 priorReview 상태 추적 화면
docs/admin/REVIEW_WORKFLOW.md:460:## 9. 알림 (notifications Feature Module 인터페이스)
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:517:### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:572:### 9.2 알림 페이로드
docs/admin/REVIEW_WORKFLOW.md:611:#### 9.2.1 idempotency 계약
docs/admin/REVIEW_WORKFLOW.md:617:### 9.3 알림 채널·운영
docs/admin/REVIEW_WORKFLOW.md:628:## 10. 감사 로그 (Audit Log)
docs/admin/REVIEW_WORKFLOW.md:630:### 10.1 기록 대상
docs/admin/REVIEW_WORKFLOW.md:640:### 10.2 audit log 페이로드
docs/admin/REVIEW_WORKFLOW.md:656:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:717:### 10.3 불변성·보존
docs/admin/REVIEW_WORKFLOW.md:725:## 11. 권한·역할
docs/admin/REVIEW_WORKFLOW.md:727:### 11.1 AdminUserRole enum
docs/admin/REVIEW_WORKFLOW.md:739:### 11.2 권한 매트릭스
docs/admin/REVIEW_WORKFLOW.md:763:### 11.3 역할 위임
docs/admin/REVIEW_WORKFLOW.md:770:## 12. 빌드 검증 — 룰 레벨
docs/admin/REVIEW_WORKFLOW.md:780:## 13. 미결정 사항
docs/admin/REVIEW_WORKFLOW.md:795:### 13.1 해소된 미결정
docs/admin/REVIEW_WORKFLOW.md:803:## 14. 변경 이력
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
docs/admin/ARCHITECTURE.md:1:# Glitzy 어드민 (Control Plane) — 아키텍처
docs/admin/ARCHITECTURE.md:12:## 0. 한 페이지 요약
docs/admin/ARCHITECTURE.md:23:## 1. 위치 — 전체 흐름
docs/admin/ARCHITECTURE.md:69:## 2. 핵심 원칙
docs/admin/ARCHITECTURE.md:86:## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
docs/admin/ARCHITECTURE.md:90:### 3.1 Slice 흐름
docs/admin/ARCHITECTURE.md:120:### 3.2 Slice 포함 범위 — 6개 핵심 화면
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:131:### 3.3 Slice 포함 데이터 계약 (최소 필드)
docs/admin/ARCHITECTURE.md:133:> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
docs/admin/ARCHITECTURE.md:137:| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
docs/admin/ARCHITECTURE.md:138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
docs/admin/ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
docs/admin/ARCHITECTURE.md:146:### 3.4 Slice 컴플라이언스 게이트 깊이
docs/admin/ARCHITECTURE.md:153:### 3.5 Slice Git 통합 깊이
docs/admin/ARCHITECTURE.md:160:### 3.6 Slice Preview·배포
docs/admin/ARCHITECTURE.md:166:### 3.7 Slice 인증·권한
docs/admin/ARCHITECTURE.md:171:### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 9종 + Article 1샘플 = 10개 페이지
docs/admin/ARCHITECTURE.md:183:| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
docs/admin/ARCHITECTURE.md:184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
docs/admin/ARCHITECTURE.md:185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
docs/admin/ARCHITECTURE.md:190:### 3.8.1 LocationProfile(main) 자동 생성 규칙
docs/admin/ARCHITECTURE.md:193:> - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
docs/admin/ARCHITECTURE.md:194:> - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
docs/admin/ARCHITECTURE.md:200:**(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
docs/admin/ARCHITECTURE.md:202:| LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
docs/admin/ARCHITECTURE.md:206:| `parentClinic` | ClinicProfile의 `@id` |
docs/admin/ARCHITECTURE.md:209:| `businessHours` | 폼의 "본원 진료시간·접수시간·점심·휴진" 입력값 |
docs/admin/ARCHITECTURE.md:213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
docs/admin/ARCHITECTURE.md:215:**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
docs/admin/ARCHITECTURE.md:217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
docs/admin/ARCHITECTURE.md:219:### 3.8.2 LegalDocument 자동 생성 규칙
docs/admin/ARCHITECTURE.md:223:| LegalDocument 필드 | 자동 생성 값 |
docs/admin/ARCHITECTURE.md:226:| `documentType` | enum 매칭 |
docs/admin/ARCHITECTURE.md:228:| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) — 출처 SoT 준수 |
docs/admin/ARCHITECTURE.md:235:- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
docs/admin/ARCHITECTURE.md:237:  - `contentType` = `LegalDocument`
docs/admin/ARCHITECTURE.md:242:### 3.9 Slice JSON-LD Schema (Core 자동 생성)
docs/admin/ARCHITECTURE.md:247:### 3.10 Slice Feature Modules 깊이
docs/admin/ARCHITECTURE.md:253:### 3.11 Slice 완료 게이트 (6항목)
docs/admin/ARCHITECTURE.md:266:## 4. Phase 로드맵 — M0 → M1 → M2 → M3
docs/admin/ARCHITECTURE.md:268:### 4.1 M0 — Vertical Slice (§ 3 참조)
docs/admin/ARCHITECTURE.md:272:### 4.2 M1 — Phase Alpha (Slice 직후 합류 기능)
docs/admin/ARCHITECTURE.md:285:### 4.3 M2 — Phase Beta (2~5호 클라이언트 동시 운영)
docs/admin/ARCHITECTURE.md:300:### 4.4 M3 — Phase GA (제품화 완성)
docs/admin/ARCHITECTURE.md:315:## 5. 기능 영역 상세
docs/admin/ARCHITECTURE.md:317:### 5.1 콘텐츠 작성 영역
docs/admin/ARCHITECTURE.md:324:### 5.2 데이터 입력 영역
docs/admin/ARCHITECTURE.md:326:> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
docs/admin/ARCHITECTURE.md:332:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
docs/admin/ARCHITECTURE.md:344:### 5.3 컴플라이언스 게이트 영역
docs/admin/ARCHITECTURE.md:351:### 5.4 멀티 클라이언트 관리 (M2+)
docs/admin/ARCHITECTURE.md:357:### 5.5 모니터링 대시보드 (M2+)
docs/admin/ARCHITECTURE.md:364:### 5.6 발행·롤백 영역
docs/admin/ARCHITECTURE.md:373:## 6. 데이터 모델
docs/admin/ARCHITECTURE.md:377:### 6.1 어드민 DB가 원본인 데이터
docs/admin/ARCHITECTURE.md:391:### 6.2 Git이 원본인 데이터 (빌드 입력)
docs/admin/ARCHITECTURE.md:404:### 6.3 두 영역 교차 데이터
docs/admin/ARCHITECTURE.md:410:## 7. 인증·권한 모델
docs/admin/ARCHITECTURE.md:412:### 7.1 단계별 도입
docs/admin/ARCHITECTURE.md:421:### 7.2 역할 (M2+)
docs/admin/ARCHITECTURE.md:435:## 8. 외부 시스템 연동
docs/admin/ARCHITECTURE.md:452:## 9. Feature Modules 통합
docs/admin/ARCHITECTURE.md:465:## 10. 미결정 사항 (어드민 한정)
docs/admin/ARCHITECTURE.md:480:## 11. 변경 이력
docs/admin/ARCHITECTURE.md:486:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:487:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:488:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:490:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
docs/decisions/LOCATION_LEGAL_PLAN.md:1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v0.1·draft·2026-05-16)
docs/decisions/LOCATION_LEGAL_PLAN.md:5:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
docs/decisions/LOCATION_LEGAL_PLAN.md:9:> **scope limit (LL-INTRO-01)**: 본 plan 은 **draft 저장** 까지만 다룬다. LegalDocument 발행 시 필수 게이트 (`legalCounsel`/`legalCounselAt`) 는 **ComplianceRecord 기반 발행 게이트** 가 별도 cascade 로 합류할 때 작동한다. 본 plan 의 LegalDocument 는 본문/변수 치환/메타 입력까지만 — `status` 는 `draft`/`review-queued` 까지만 허용 (publishable/published 차단). 발행 게이트는 `compliance-assistant` Feature + ComplianceRecord UI cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:11:## SoT
docs/decisions/LOCATION_LEGAL_PLAN.md:13:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
docs/decisions/LOCATION_LEGAL_PLAN.md:14:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs/decisions/LOCATION_LEGAL_PLAN.md:15:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states (draft/review-queued 까지만 허용)
docs/decisions/LOCATION_LEGAL_PLAN.md:16:- `docs/admin/CONTENT_STANDARDS.md` v1.3 — Markdown 본문 검증 규약 (LegalDocument body 는 일반 검증 제외 — 표준 템플릿 + 변수 치환은 별도 검증 룰)
docs/decisions/LOCATION_LEGAL_PLAN.md:17:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 7 .env · § 8.1 RLS 시나리오 패턴
docs/decisions/LOCATION_LEGAL_PLAN.md:24:## 1. 목적과 범위
docs/decisions/LOCATION_LEGAL_PLAN.md:26:### 1.1 목적
docs/decisions/LOCATION_LEGAL_PLAN.md:28:- ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
docs/decisions/LOCATION_LEGAL_PLAN.md:32:### 1.2 범위 (포함)
docs/decisions/LOCATION_LEGAL_PLAN.md:37:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType enum |
docs/decisions/LOCATION_LEGAL_PLAN.md:38:| `clinic_profile` 정책 변수 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` (정책 시행일 default) |
docs/decisions/LOCATION_LEGAL_PLAN.md:39:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 |
docs/decisions/LOCATION_LEGAL_PLAN.md:40:| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` (DATA_MODEL C-16 enum 정합) |
docs/decisions/LOCATION_LEGAL_PLAN.md:41:| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 기반 strict (unknown key = build error) |
docs/decisions/LOCATION_LEGAL_PLAN.md:42:| businessHours 입력 검증 | 7 요일 구조 (오픈/마감/점심·휴진 옵션) · zod schema · `location_profile.metadata` 에 정규화 저장 |
docs/decisions/LOCATION_LEGAL_PLAN.md:46:### 1.3 비범위 (defer)
docs/decisions/LOCATION_LEGAL_PLAN.md:50:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:51:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-INTRO-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:52:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:53:| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
docs/decisions/LOCATION_LEGAL_PLAN.md:54:| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
docs/decisions/LOCATION_LEGAL_PLAN.md:55:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
docs/decisions/LOCATION_LEGAL_PLAN.md:56:| reservationChannels 풀세트 (모든 CTAConfig type) | M0 v1.0 본 구현 (M0 minimal 3종 제외) | LL-DEFER-04 |
docs/decisions/LOCATION_LEGAL_PLAN.md:57:| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
docs/decisions/LOCATION_LEGAL_PLAN.md:58:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
docs/decisions/LOCATION_LEGAL_PLAN.md:59:| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
docs/decisions/LOCATION_LEGAL_PLAN.md:61:## 2. 데이터 모델 결정
docs/decisions/LOCATION_LEGAL_PLAN.md:63:### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:80:  template_version TEXT,              -- 'privacy@1.0.0' 등
docs/decisions/LOCATION_LEGAL_PLAN.md:85:  status content_publication_status NOT NULL DEFAULT 'draft',
docs/decisions/LOCATION_LEGAL_PLAN.md:97:  CONSTRAINT legal_document_template_version_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:98:    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
docs/decisions/LOCATION_LEGAL_PLAN.md:100:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:101:    (auto_generated = false) OR (template_version IS NOT NULL)
docs/decisions/LOCATION_LEGAL_PLAN.md:103:  -- LL-SCHEMA-04: skeleton 단계 published 차단 — compliance-assistant cascade 까지
docs/decisions/LOCATION_LEGAL_PLAN.md:127:- (LL-SCHEMA-02) `documentType` per `instance_id` UNIQUE — instance 당 동일 documentType 의 LegalDocument 는 1개만. M0 모든 5종 자동 생성 후 운영자 편집.
docs/decisions/LOCATION_LEGAL_PLAN.md:128:- (LL-SCHEMA-03) `status` enum 은 `content_publication_status` 재사용 (CHECK 로 skeleton 단계 `draft`/`review-queued` 만 허용). compliance-assistant cascade 시 CHECK 제거 + 발행 게이트 합류.
docs/decisions/LOCATION_LEGAL_PLAN.md:129:- (LL-SCHEMA-04) `published_at` 은 별도 정책 시행일과 다름 — 별도 column `effective_date` (DATE) 가 SoT. `published_at` 은 status 발행 시점 (skeleton 단계 NULL 강제).
docs/decisions/LOCATION_LEGAL_PLAN.md:130:- (LL-SCHEMA-05) `risk_level` default `Low` — DATA_MODEL C-16 규칙 (위험도 기본 Low이지만 법무 검토 필수).
docs/decisions/LOCATION_LEGAL_PLAN.md:131:- (LL-SCHEMA-06) `revisions[]` 은 v0.1 에서 column 미추가 (LL-DEFER-02). `metadata JSONB` 로 확장 여지만 남김.
docs/decisions/LOCATION_LEGAL_PLAN.md:133:### 2.2 `clinic_profile` 정책 변수 컬럼 (LL-SCHEMA-07)
docs/decisions/LOCATION_LEGAL_PLAN.md:136:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
docs/decisions/LOCATION_LEGAL_PLAN.md:139:  ADD COLUMN policy_contact_person TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:140:  ADD COLUMN policy_contact_email TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:141:  ADD COLUMN policy_contact_phone TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:142:  ADD COLUMN policy_effective_date DATE;
docs/decisions/LOCATION_LEGAL_PLAN.md:145:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:146:    policy_contact_email IS NULL
docs/decisions/LOCATION_LEGAL_PLAN.md:147:    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
docs/decisions/LOCATION_LEGAL_PLAN.md:149:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:150:    policy_contact_phone IS NULL
docs/decisions/LOCATION_LEGAL_PLAN.md:151:    OR policy_contact_phone ~ '^[+0-9 ()-]{4,32}$'
docs/decisions/LOCATION_LEGAL_PLAN.md:156:- (LL-SCHEMA-08) `metadata JSONB` 가 아닌 별도 column — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값이므로 명시 column. `policy_*` prefix.
docs/decisions/LOCATION_LEGAL_PLAN.md:157:- (LL-SCHEMA-09) `policy_effective_date` 은 운영자가 LegalDocument 시행일 default 로 사용. 5종 LegalDocument 각각 별도 override 도 가능 (form 에서 individual override 는 v0.1 미포함 — LL-DEFER-08).
docs/decisions/LOCATION_LEGAL_PLAN.md:159:### 2.3 `location_profile` businessHours 정규화 (LL-SCHEMA-10)
docs/decisions/LOCATION_LEGAL_PLAN.md:166:  "businessHours": {
docs/decisions/LOCATION_LEGAL_PLAN.md:185:- (LL-SCHEMA-11) businessHours 는 7 요일 partial (모두 optional · 미입력 = `{ closed: true }` 로 정규화). 시간 형식 `HH:mm` (24h). zod 검증.
docs/decisions/LOCATION_LEGAL_PLAN.md:186:- (LL-SCHEMA-12) reservationChannels minimal 3 type (`phone` · `kakao` · `naver-booking`). 풀 CTAConfig type 은 LL-DEFER-04.
docs/decisions/LOCATION_LEGAL_PLAN.md:187:- (LL-SCHEMA-13) `featuredChannelId` 는 reservationChannels[].id 중 하나 — 폼 dropdown.
docs/decisions/LOCATION_LEGAL_PLAN.md:188:- (LL-SCHEMA-14) 본원 주소: 기존 `location_profile` column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).
docs/decisions/LOCATION_LEGAL_PLAN.md:190:## 3. Form UI 재구성
docs/decisions/LOCATION_LEGAL_PLAN.md:192:### 3.1 ClinicProfileForm 3 섹션 (LL-FORM-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:197:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일) · reservationChannels (3종 minimal) · featuredChannelId | `LocationProfile`(slug=`main`) |
docs/decisions/LOCATION_LEGAL_PLAN.md:198:| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate | `ClinicProfile.policy_*` + 5종 `LegalDocument` |
docs/decisions/LOCATION_LEGAL_PLAN.md:201:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 동시 출력. 부분 저장 (섹션별 저장) 안 함.
docs/decisions/LOCATION_LEGAL_PLAN.md:202:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. reservationChannels 는 1건 이상 필수.
docs/decisions/LOCATION_LEGAL_PLAN.md:203:- (LL-FORM-04) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyEffectiveDate 3 필드 required. policyContactPhone 만 optional.
docs/decisions/LOCATION_LEGAL_PLAN.md:204:- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
docs/decisions/LOCATION_LEGAL_PLAN.md:205:- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘.
docs/decisions/LOCATION_LEGAL_PLAN.md:206:- (LL-FORM-07) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled.
docs/decisions/LOCATION_LEGAL_PLAN.md:207:- (LL-FORM-08) reservationChannels UI: 3종 type 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. featuredChannelId 는 입력한 채널 중 select.
docs/decisions/LOCATION_LEGAL_PLAN.md:209:### 3.2 검증
docs/decisions/LOCATION_LEGAL_PLAN.md:211:- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
docs/decisions/LOCATION_LEGAL_PLAN.md:212:- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
docs/decisions/LOCATION_LEGAL_PLAN.md:213:- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
docs/decisions/LOCATION_LEGAL_PLAN.md:215:## 4. Server Action 결정
docs/decisions/LOCATION_LEGAL_PLAN.md:217:### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:225:  // 1) ClinicProfile upsert (기존) — clinic + policy_* columns
docs/decisions/LOCATION_LEGAL_PLAN.md:226:  // 2) LocationProfile(main) upsert — address + telephone + email + metadata(businessHours·reservationChannels·featuredChannelId)
docs/decisions/LOCATION_LEGAL_PLAN.md:227:  // 3) 5종 LegalDocument upsert — Core 표준 템플릿 render · 변수 치환 · skeleton 단계 status=draft
docs/decisions/LOCATION_LEGAL_PLAN.md:233:- (LL-ACTION-02) 3계약 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
docs/decisions/LOCATION_LEGAL_PLAN.md:234:- (LL-ACTION-03) audit `content-saved` 는 tx commit 후 단일 emit · payload 에 `contracts: ["ClinicProfile", "LocationProfile:main", "LegalDocument:privacy", "LegalDocument:terms", ...]` 배열. 단일 audit row 로 다중 contract 정합.
docs/decisions/LOCATION_LEGAL_PLAN.md:235:- (LL-ACTION-04) 5종 LegalDocument 처리 순서 — `privacy` → `terms` → `non-covered` → `refund` → `complaint`. 결정적 순서로 race 시 deadlock 회피.
docs/decisions/LOCATION_LEGAL_PLAN.md:236:- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — payload `modes: { ClinicProfile: "insert"|"update", "LocationProfile:main": ..., ... }`.
docs/decisions/LOCATION_LEGAL_PLAN.md:237:- (LL-ACTION-06) 5종 LegalDocument 는 instance 첫 저장 시 모두 INSERT (Core 표준 템플릿 + 변수 치환). 두 번째 저장부터는 ClinicProfile/LocationProfile 변수 변화 시 templateVersion=current 인 row 의 body 만 자동 재렌더링 (운영자가 수동 편집한 row 는 LL-DEFER-06 — v0.1 에서는 무조건 재렌더링 / 운영자 수동 편집 자체가 차단).
docs/decisions/LOCATION_LEGAL_PLAN.md:238:- (LL-ACTION-07) `policy_effective_date` 가 NULL 이면 LegalDocument `effective_date` 는 첫 저장 시 `current_date` (Action 안 `new Date()`). 두 번째 저장부터 운영자 input 우선.
docs/decisions/LOCATION_LEGAL_PLAN.md:239:- (LL-ACTION-08) email 검증: ClinicProfile.policy_contact_email 과 LocationProfile.email 은 별개 입력 — 정책 변수와 본원 이메일이 다를 수 있음.
docs/decisions/LOCATION_LEGAL_PLAN.md:241:### 4.2 변수 치환 엔진 (LL-ACTION-09)
docs/decisions/LOCATION_LEGAL_PLAN.md:244:// packages/core-content/src/templates/render.ts
docs/decisions/LOCATION_LEGAL_PLAN.md:260:  policy: {
docs/decisions/LOCATION_LEGAL_PLAN.md:268:export function renderTemplate(template: string, ctx: RenderContext): string;
docs/decisions/LOCATION_LEGAL_PLAN.md:272:- (LL-ACTION-10) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
docs/decisions/LOCATION_LEGAL_PLAN.md:273:- (LL-ACTION-11) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
docs/decisions/LOCATION_LEGAL_PLAN.md:274:- (LL-ACTION-12) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
docs/decisions/LOCATION_LEGAL_PLAN.md:275:- (LL-ACTION-13) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
docs/decisions/LOCATION_LEGAL_PLAN.md:277:### 4.3 audit (LL-ACTION-14)
docs/decisions/LOCATION_LEGAL_PLAN.md:292:      { "contentType": "LocationProfile", "slug": "main",   "mode": "insert" },
docs/decisions/LOCATION_LEGAL_PLAN.md:293:      { "contentType": "LegalDocument",   "slug": "privacy", "documentType": "privacy",  "mode": "insert",   "templateVersion": "privacy@1.0.0" },
docs/decisions/LOCATION_LEGAL_PLAN.md:301:- (LL-ACTION-15) 단일 emit · 다중 contract — DB write 와 audit row 의 1:N 정합 보존. 향후 transactional outbox cascade 시 envelope 으로 변환.
docs/decisions/LOCATION_LEGAL_PLAN.md:302:- (LL-ACTION-16) `contentType` outer = `ClinicProfileBundle` (신규 contentType). § 5.5 audit matrix 에 row 추가. M0 v1.0 RBAC cascade 시 권한 분리 marker (LL-DEFER-09).
docs/decisions/LOCATION_LEGAL_PLAN.md:304:### 4.4 control-flow / 에러 (LL-ACTION-17)
docs/decisions/LOCATION_LEGAL_PLAN.md:308:  - `legal_document_instance_type_unique` → formError (template 충돌 — 잠시 후 재시도)
docs/decisions/LOCATION_LEGAL_PLAN.md:309:  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
docs/decisions/LOCATION_LEGAL_PLAN.md:310:  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
docs/decisions/LOCATION_LEGAL_PLAN.md:311:  - businessHours · reservationChannels 는 application-level 검증 (DB CHECK 없음)
docs/decisions/LOCATION_LEGAL_PLAN.md:313:## 5. Core 표준 템플릿 5종
docs/decisions/LOCATION_LEGAL_PLAN.md:315:### 5.1 위치 (LL-TEMPLATE-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:317:`packages/core-content/src/templates/` 에 각 documentType 별 `.md` 파일 + index.ts 로 export.
docs/decisions/LOCATION_LEGAL_PLAN.md:320:packages/core-content/src/templates/
docs/decisions/LOCATION_LEGAL_PLAN.md:322:├─ render.ts             -- renderTemplate(template, ctx)
docs/decisions/LOCATION_LEGAL_PLAN.md:331:// packages/core-content/src/templates/index.ts
docs/decisions/LOCATION_LEGAL_PLAN.md:332:export type LegalDocumentType =
docs/decisions/LOCATION_LEGAL_PLAN.md:336:  documentType: LegalDocumentType;
docs/decisions/LOCATION_LEGAL_PLAN.md:347:- (LL-TEMPLATE-02) v0.1 은 5종 (`cookie`/`other` 제외) — M0 본 구현에 합류 시 추가.
docs/decisions/LOCATION_LEGAL_PLAN.md:348:- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
docs/decisions/LOCATION_LEGAL_PLAN.md:349:- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿은 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
docs/decisions/LOCATION_LEGAL_PLAN.md:350:- (LL-TEMPLATE-05) 변수 화이트리스트 (LL-ACTION-10):
docs/decisions/LOCATION_LEGAL_PLAN.md:353:  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
docs/decisions/LOCATION_LEGAL_PLAN.md:354:- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06). major 변경 시 운영자 수동 확인 (LL-DEFER-10 — v0.1 에서는 자동 재렌더링).
docs/decisions/LOCATION_LEGAL_PLAN.md:356:## 6. 환경·precondition
docs/decisions/LOCATION_LEGAL_PLAN.md:359:- packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
docs/decisions/LOCATION_LEGAL_PLAN.md:362:## 7. § 8.1 RLS 시나리오 cascade
docs/decisions/LOCATION_LEGAL_PLAN.md:370:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 (LL-SCHEMA-04) |
docs/decisions/LOCATION_LEGAL_PLAN.md:371:| 17 | LegalDocument 같은 documentType 두 번 INSERT | UNIQUE 위반 (LL-SCHEMA-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md:372:| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
docs/decisions/LOCATION_LEGAL_PLAN.md:375:## 8. 작업 단위
docs/decisions/LOCATION_LEGAL_PLAN.md:380:| 2 | C0007 clinic_profile policy vars migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:381:| 3 | Core 표준 템플릿 5종 + render 엔진 | packages/core-content/src/templates/* + tests |
docs/decisions/LOCATION_LEGAL_PLAN.md:382:| 4 | zod schema (businessHours · reservationChannels · policy vars) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md:389:## 9. M0 v1.0 cascade marker (defer 정리)
docs/decisions/LOCATION_LEGAL_PLAN.md:391:- `LL-DEFER-01`: LegalDocument 발행 게이트 (compliance-assistant Feature + ComplianceRecord UI cascade).
docs/decisions/LOCATION_LEGAL_PLAN.md:392:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
docs/decisions/LOCATION_LEGAL_PLAN.md:393:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
docs/decisions/LOCATION_LEGAL_PLAN.md:394:- `LL-DEFER-04`: reservationChannels 풀세트 (모든 CTAConfig type).
docs/decisions/LOCATION_LEGAL_PLAN.md:395:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI.
docs/decisions/LOCATION_LEGAL_PLAN.md:396:- `LL-DEFER-06`: LegalDocument body 수동 override · 자동 재렌더링 정책.
docs/decisions/LOCATION_LEGAL_PLAN.md:397:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
docs/decisions/LOCATION_LEGAL_PLAN.md:398:- `LL-DEFER-08`: 5종 LegalDocument 각각의 effectiveDate individual override 폼.
docs/decisions/LOCATION_LEGAL_PLAN.md:399:- `LL-DEFER-09`: `ClinicProfileBundle` audit contentType 권한 분리 (M0 v1.0 RBAC).
docs/decisions/LOCATION_LEGAL_PLAN.md:400:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
docs/decisions/LOCATION_LEGAL_PLAN.md:402:## 변경 이력
docs/core/DATA_MODEL.md:1:# Core — 데이터 계약 명세
docs/core/DATA_MODEL.md:17:## 0. 한 페이지 요약
docs/core/DATA_MODEL.md:23:- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
docs/core/DATA_MODEL.md:29:## 1. 계약 인벤토리
docs/core/DATA_MODEL.md:31:### 1.1 데이터 계약 (23개)
docs/core/DATA_MODEL.md:50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
docs/core/DATA_MODEL.md:55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
docs/core/DATA_MODEL.md:59:### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
docs/core/DATA_MODEL.md:63:| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
docs/core/DATA_MODEL.md:64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:69:## 2. 공통 룰
docs/core/DATA_MODEL.md:71:### 2.1 타입 표기법
docs/core/DATA_MODEL.md:85:### 2.2 공통 메타 필드 (모든 계약)
docs/core/DATA_MODEL.md:95:### 2.3 식별자(`@id`) 규약
docs/core/DATA_MODEL.md:99:### 2.4 다국어
docs/core/DATA_MODEL.md:102:### 2.5 SoT 원칙 (v0.4 명시)
docs/core/DATA_MODEL.md:103:- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
docs/core/DATA_MODEL.md:104:- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
docs/core/DATA_MODEL.md:105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
docs/core/DATA_MODEL.md:107:### 2.6 변경 정책
docs/core/DATA_MODEL.md:126:## 3. 공통 타입 풀명세
docs/core/DATA_MODEL.md:128:### CT-01. `TrustMetric` — 신뢰도·통계 지표
docs/core/DATA_MODEL.md:151:### CT-02. `BusinessHours` — 진료시간·접수시간·휴진
docs/core/DATA_MODEL.md:166:#### `OpeningHoursSpec`
docs/core/DATA_MODEL.md:175:#### `LunchBreak`
docs/core/DATA_MODEL.md:182:#### `SpecialClosure`
docs/core/DATA_MODEL.md:189:### CT-03. `CTAConfig` — 전환 채널 설정
docs/core/DATA_MODEL.md:203:| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:211:## 4. 데이터 계약 풀명세 (M0 핵심)
docs/core/DATA_MODEL.md:213:### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)
docs/core/DATA_MODEL.md:215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
docs/core/DATA_MODEL.md:239:| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
docs/core/DATA_MODEL.md:240:| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
docs/core/DATA_MODEL.md:246:#### `Address`
docs/core/DATA_MODEL.md:255:#### `GeoCoordinates`
docs/core/DATA_MODEL.md:261:#### `Award`
docs/core/DATA_MODEL.md:269:#### `Affiliation`
docs/core/DATA_MODEL.md:277:#### `ResearchInstitute`
docs/core/DATA_MODEL.md:285:#### `SocialMediaLinks`
docs/core/DATA_MODEL.md:296:#### `MediaItem`
docs/core/DATA_MODEL.md:304:#### `InternationalSupport`
docs/core/DATA_MODEL.md:312:### C-02. `DoctorProfile` — 의료진 권위·전문성
docs/core/DATA_MODEL.md:335:| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
docs/core/DATA_MODEL.md:336:| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
docs/core/DATA_MODEL.md:340:#### `Credential`
docs/core/DATA_MODEL.md:349:#### `Education`
docs/core/DATA_MODEL.md:356:#### `CareerItem`
docs/core/DATA_MODEL.md:363:#### `Publication`
docs/core/DATA_MODEL.md:371:### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
docs/core/DATA_MODEL.md:408:#### `ProcessStep`
docs/core/DATA_MODEL.md:416:#### `TreatmentComponent` (v0.4 신규)
docs/core/DATA_MODEL.md:425:#### `VisitFlowStep` (v0.4 신규)
docs/core/DATA_MODEL.md:434:#### `ProgramVariant`
docs/core/DATA_MODEL.md:447:#### `EvidenceNote` (v0.4 신규)
docs/core/DATA_MODEL.md:456:#### `SlotRiskOverride`
docs/core/DATA_MODEL.md:463:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
docs/core/DATA_MODEL.md:509:#### `EmbeddedMedia`
docs/core/DATA_MODEL.md:524:### C-05. `RiskLevel` (enum) — 위험도 등급
docs/core/DATA_MODEL.md:534:### C-06. `PageMeta` — 페이지별 메타 데이터
docs/core/DATA_MODEL.md:552:### C-07. `BrandTokens` — 디자인 토큰 최종값
docs/core/DATA_MODEL.md:567:### C-08. `InstanceManifest` — 버전 고정 명세
docs/core/DATA_MODEL.md:595:| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:604:#### `RobotsOverride` (v0.11 신규)
docs/core/DATA_MODEL.md:613:#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
docs/core/DATA_MODEL.md:626:#### `NotificationChannelsConfig` (v0.13 확장)
docs/core/DATA_MODEL.md:636:#### `VersionSpec`
docs/core/DATA_MODEL.md:639:#### `IANATimezone` (v0.13 신규)
docs/core/DATA_MODEL.md:643:#### `AnalyticsConfig` (v0.14 신규)
docs/core/DATA_MODEL.md:654:#### `SearchVisibilityConfig` (v0.16 신규)
docs/core/DATA_MODEL.md:663:#### `KeywordMonitoringConfig` (v0.17 신규)
docs/core/DATA_MODEL.md:671:#### `AssetIngestionConfig` (v0.18 신규)
docs/core/DATA_MODEL.md:680:#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)
docs/core/DATA_MODEL.md:696:#### `CrmSyncConfig` (v0.19 신규)
docs/core/DATA_MODEL.md:702:#### `CrmIntegrationEntry` (v0.19 신규)
docs/core/DATA_MODEL.md:720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
docs/core/DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
docs/core/DATA_MODEL.md:736:#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
docs/core/DATA_MODEL.md:751:### C-09. `FeatureModuleConfig` — Feature Module 설정
docs/core/DATA_MODEL.md:759:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
docs/core/DATA_MODEL.md:763:#### 어드민 DB 원본 (풀데이터)
docs/core/DATA_MODEL.md:769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs/core/DATA_MODEL.md:782:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
docs/core/DATA_MODEL.md:783:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
docs/core/DATA_MODEL.md:797:#### `MediaThresholdAssessment` (v0.14 +)
docs/core/DATA_MODEL.md:815:#### `WarningAcknowledgement` (v0.8 +)
docs/core/DATA_MODEL.md:824:#### `StaleFlags`
docs/core/DATA_MODEL.md:834:#### Git 사본 (경량 빌드 참조)
docs/core/DATA_MODEL.md:844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
docs/core/DATA_MODEL.md:846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:854:| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
docs/core/DATA_MODEL.md:858:| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
docs/core/DATA_MODEL.md:861:| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
docs/core/DATA_MODEL.md:867:#### `LegalDocumentRevision`
docs/core/DATA_MODEL.md:875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs/core/DATA_MODEL.md:878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
docs/core/DATA_MODEL.md:886:| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
docs/core/DATA_MODEL.md:893:| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:913:### C-22. `ArticleCategory` — Article Pillar 분류
docs/core/DATA_MODEL.md:930:## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
docs/core/DATA_MODEL.md:932:### C-11. `MedicalConditionPage`
docs/core/DATA_MODEL.md:935:### C-12. `FAQ`
docs/core/DATA_MODEL.md:938:### C-13. `ReviewPolicy`
docs/core/DATA_MODEL.md:941:### C-14. `MedicalSpecialty`
docs/core/DATA_MODEL.md:944:### C-15. `SchemaInput`
docs/core/DATA_MODEL.md:947:### C-17. `PricingPage`
docs/core/DATA_MODEL.md:950:### C-18. `FacilitiesPage`
docs/core/DATA_MODEL.md:953:### C-19. `NewsItem`
docs/core/DATA_MODEL.md:956:### C-20. `ReservationPage`
docs/core/DATA_MODEL.md:959:### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
docs/core/DATA_MODEL.md:979:#### `NotificationPreferences` (C-23 하위 타입)
docs/core/DATA_MODEL.md:988:#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)
docs/core/DATA_MODEL.md:1003:## 6. 관계 다이어그램
docs/core/DATA_MODEL.md:1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
docs/core/DATA_MODEL.md:1013:LocationProfile (C-21) — 위치·시간·연락 SoT
docs/core/DATA_MODEL.md:1014:   ├─ businessHours → BusinessHours (CT-02)
docs/core/DATA_MODEL.md:1016:   ├─ parentClinic → ClinicProfile (C-01)
docs/core/DATA_MODEL.md:1022:   ├─ primaryLocation → LocationProfile (C-21)
docs/core/DATA_MODEL.md:1023:   ├─ additionalLocations → LocationProfile[]
docs/core/DATA_MODEL.md:1049:## 7. 변경 정책
docs/core/DATA_MODEL.md:1055:## 8. 미결정 사항
docs/core/DATA_MODEL.md:1070:| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
docs/core/DATA_MODEL.md:1075:| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
docs/core/DATA_MODEL.md:1081:## 9. 변경 이력
docs/core/DATA_MODEL.md:1086:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs/core/DATA_MODEL.md:1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
docs/core/DATA_MODEL.md:1093:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
docs/core/DATA_MODEL.md:1097:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1103:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
docs/core/DATA_MODEL.md:1104:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1106:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/admin/CONTENT_STANDARDS.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

codex
첫 검색에서 문서 경로 하나가 실제 이름과 달라 일부 결과가 섞였습니다. 이제 대상 plan의 구체 라인과 기존 구현 파일을 더 좁혀서 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files docs | rg "CONTENT|STANDARDS|LOCATION_LEGAL|ARCHITECTURE|REVIEW_WORKFLOW|RISK_LEVELS"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-|CREATE TABLE|UNIQUE|CHECK|policy_|businessHours|reservationChannels|parentClinic|primaryCtas|templateVersion|template_version|legalCounsel|review-queued|operator-edit-content|ClinicProfileBundle|RLS|DEFER" "docs/decisions/LOCATION_LEGAL_PLAN.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE|clinic_profile|location_profile|metadata|UNIQUE|CHECK|ENABLE ROW LEVEL|policy" "packages/core-content/migrations/C0001_clinic_profile.sql" "packages/core-content/migrations/C0002_location_profile.sql"' in C:\Users\assag\solution\website-exposure
 succeeded in 1756ms:
docs\ARCHITECTURE.md
docs\admin\ARCHITECTURE.md
docs\admin\REVIEW_WORKFLOW.md
docs\compliance\RISK_LEVELS.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\core\CONTENT_STANDARDS.md
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1695ms:
9:> **scope limit (LL-INTRO-01)**: 본 plan 은 **draft 저장** 까지만 다룬다. LegalDocument 발행 시 필수 게이트 (`legalCounsel`/`legalCounselAt`) 는 **ComplianceRecord 기반 발행 게이트** 가 별도 cascade 로 합류할 때 작동한다. 본 plan 의 LegalDocument 는 본문/변수 치환/메타 입력까지만 — `status` 는 `draft`/`review-queued` 까지만 허용 (publishable/published 차단). 발행 게이트는 `compliance-assistant` Feature + ComplianceRecord UI cascade.
15:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states (draft/review-queued 까지만 허용)
17:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 7 .env · § 8.1 RLS 시나리오 패턴
20:  - `packages/core-content/migrations/C0002_location_profile.sql` — `slug` regex (`^[a-z0-9][a-z0-9-]{2,63}$`) · `country_iso CHECK '^[A-Z]{2}$'` · `metadata JSONB` · 단일 UNIQUE (instance_id, slug)
37:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType enum |
38:| `clinic_profile` 정책 변수 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` (정책 시행일 default) |
42:| businessHours 입력 검증 | 7 요일 구조 (오픈/마감/점심·휴진 옵션) · zod schema · `location_profile.metadata` 에 정규화 저장 |
43:| reservationChannels 입력 | M0 minimal — phone + kakao + naver-booking 3종만. 그 외는 M0 v1.0 cascade |
50:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 |
51:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-INTRO-01 |
52:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
54:| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
55:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
56:| reservationChannels 풀세트 (모든 CTAConfig type) | M0 v1.0 본 구현 (M0 minimal 3종 제외) | LL-DEFER-04 |
57:| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
58:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
59:| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
63:### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
72:CREATE TABLE legal_document (
80:  template_version TEXT,              -- 'privacy@1.0.0' 등
91:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
92:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
93:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
94:  CONSTRAINT legal_document_email_regex CHECK (
97:  CONSTRAINT legal_document_template_version_format CHECK (
98:    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
100:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
101:    (auto_generated = false) OR (template_version IS NOT NULL)
103:  -- LL-SCHEMA-04: skeleton 단계 published 차단 — compliance-assistant cascade 까지
104:  CONSTRAINT legal_document_status_skeleton_limit CHECK (
105:    status IN ('draft', 'review-queued')
107:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
108:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
109:  CONSTRAINT legal_document_instance_type_unique UNIQUE (instance_id, document_type),
110:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
121:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
127:- (LL-SCHEMA-02) `documentType` per `instance_id` UNIQUE — instance 당 동일 documentType 의 LegalDocument 는 1개만. M0 모든 5종 자동 생성 후 운영자 편집.
128:- (LL-SCHEMA-03) `status` enum 은 `content_publication_status` 재사용 (CHECK 로 skeleton 단계 `draft`/`review-queued` 만 허용). compliance-assistant cascade 시 CHECK 제거 + 발행 게이트 합류.
129:- (LL-SCHEMA-04) `published_at` 은 별도 정책 시행일과 다름 — 별도 column `effective_date` (DATE) 가 SoT. `published_at` 은 status 발행 시점 (skeleton 단계 NULL 강제).
130:- (LL-SCHEMA-05) `risk_level` default `Low` — DATA_MODEL C-16 규칙 (위험도 기본 Low이지만 법무 검토 필수).
131:- (LL-SCHEMA-06) `revisions[]` 은 v0.1 에서 column 미추가 (LL-DEFER-02). `metadata JSONB` 로 확장 여지만 남김.
133:### 2.2 `clinic_profile` 정책 변수 컬럼 (LL-SCHEMA-07)
136:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
139:  ADD COLUMN policy_contact_person TEXT,
140:  ADD COLUMN policy_contact_email TEXT,
141:  ADD COLUMN policy_contact_phone TEXT,
142:  ADD COLUMN policy_effective_date DATE;
145:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
146:    policy_contact_email IS NULL
147:    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
149:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
150:    policy_contact_phone IS NULL
151:    OR policy_contact_phone ~ '^[+0-9 ()-]{4,32}$'
156:- (LL-SCHEMA-08) `metadata JSONB` 가 아닌 별도 column — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값이므로 명시 column. `policy_*` prefix.
157:- (LL-SCHEMA-09) `policy_effective_date` 은 운영자가 LegalDocument 시행일 default 로 사용. 5종 LegalDocument 각각 별도 override 도 가능 (form 에서 individual override 는 v0.1 미포함 — LL-DEFER-08).
159:### 2.3 `location_profile` businessHours 정규화 (LL-SCHEMA-10)
166:  "businessHours": {
175:  "reservationChannels": [
185:- (LL-SCHEMA-11) businessHours 는 7 요일 partial (모두 optional · 미입력 = `{ closed: true }` 로 정규화). 시간 형식 `HH:mm` (24h). zod 검증.
186:- (LL-SCHEMA-12) reservationChannels minimal 3 type (`phone` · `kakao` · `naver-booking`). 풀 CTAConfig type 은 LL-DEFER-04.
187:- (LL-SCHEMA-13) `featuredChannelId` 는 reservationChannels[].id 중 하나 — 폼 dropdown.
188:- (LL-SCHEMA-14) 본원 주소: 기존 `location_profile` column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).
192:### 3.1 ClinicProfileForm 3 섹션 (LL-FORM-01)
197:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일) · reservationChannels (3종 minimal) · featuredChannelId | `LocationProfile`(slug=`main`) |
198:| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate | `ClinicProfile.policy_*` + 5종 `LegalDocument` |
201:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 동시 출력. 부분 저장 (섹션별 저장) 안 함.
202:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. reservationChannels 는 1건 이상 필수.
203:- (LL-FORM-04) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyEffectiveDate 3 필드 required. policyContactPhone 만 optional.
204:- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
205:- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘.
206:- (LL-FORM-07) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled.
207:- (LL-FORM-08) reservationChannels UI: 3종 type 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. featuredChannelId 는 입력한 채널 중 select.
211:- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
212:- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
213:- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
217:### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)
223:  assertActionEligibility(ctx, "operator-edit-content");
225:  // 1) ClinicProfile upsert (기존) — clinic + policy_* columns
226:  // 2) LocationProfile(main) upsert — address + telephone + email + metadata(businessHours·reservationChannels·featuredChannelId)
233:- (LL-ACTION-02) 3계약 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
234:- (LL-ACTION-03) audit `content-saved` 는 tx commit 후 단일 emit · payload 에 `contracts: ["ClinicProfile", "LocationProfile:main", "LegalDocument:privacy", "LegalDocument:terms", ...]` 배열. 단일 audit row 로 다중 contract 정합.
235:- (LL-ACTION-04) 5종 LegalDocument 처리 순서 — `privacy` → `terms` → `non-covered` → `refund` → `complaint`. 결정적 순서로 race 시 deadlock 회피.
236:- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — payload `modes: { ClinicProfile: "insert"|"update", "LocationProfile:main": ..., ... }`.
237:- (LL-ACTION-06) 5종 LegalDocument 는 instance 첫 저장 시 모두 INSERT (Core 표준 템플릿 + 변수 치환). 두 번째 저장부터는 ClinicProfile/LocationProfile 변수 변화 시 templateVersion=current 인 row 의 body 만 자동 재렌더링 (운영자가 수동 편집한 row 는 LL-DEFER-06 — v0.1 에서는 무조건 재렌더링 / 운영자 수동 편집 자체가 차단).
238:- (LL-ACTION-07) `policy_effective_date` 가 NULL 이면 LegalDocument `effective_date` 는 첫 저장 시 `current_date` (Action 안 `new Date()`). 두 번째 저장부터 운영자 input 우선.
239:- (LL-ACTION-08) email 검증: ClinicProfile.policy_contact_email 과 LocationProfile.email 은 별개 입력 — 정책 변수와 본원 이메일이 다를 수 있음.
241:### 4.2 변수 치환 엔진 (LL-ACTION-09)
272:- (LL-ACTION-10) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
273:- (LL-ACTION-11) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
274:- (LL-ACTION-12) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
275:- (LL-ACTION-13) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
277:### 4.3 audit (LL-ACTION-14)
287:    "contentType": "ClinicProfileBundle",
293:      { "contentType": "LegalDocument",   "slug": "privacy", "documentType": "privacy",  "mode": "insert",   "templateVersion": "privacy@1.0.0" },
301:- (LL-ACTION-15) 단일 emit · 다중 contract — DB write 와 audit row 의 1:N 정합 보존. 향후 transactional outbox cascade 시 envelope 으로 변환.
302:- (LL-ACTION-16) `contentType` outer = `ClinicProfileBundle` (신규 contentType). § 5.5 audit matrix 에 row 추가. M0 v1.0 RBAC cascade 시 권한 분리 marker (LL-DEFER-09).
304:### 4.4 control-flow / 에러 (LL-ACTION-17)
309:  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
310:  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
311:  - businessHours · reservationChannels 는 application-level 검증 (DB CHECK 없음)
315:### 5.1 위치 (LL-TEMPLATE-01)
347:- (LL-TEMPLATE-02) v0.1 은 5종 (`cookie`/`other` 제외) — M0 본 구현에 합류 시 추가.
348:- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
349:- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿은 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
350:- (LL-TEMPLATE-05) 변수 화이트리스트 (LL-ACTION-10):
354:- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06). major 변경 시 운영자 수동 확인 (LL-DEFER-10 — v0.1 에서는 자동 재렌더링).
362:## 7. § 8.1 RLS 시나리오 cascade
370:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 (LL-SCHEMA-04) |
371:| 17 | LegalDocument 같은 documentType 두 번 INSERT | UNIQUE 위반 (LL-SCHEMA-02) |
372:| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
380:| 2 | C0007 clinic_profile policy vars migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
382:| 4 | zod schema (businessHours · reservationChannels · policy vars) | apps/web/src/lib/clinic-profile-schema.ts |
391:- `LL-DEFER-01`: LegalDocument 발행 게이트 (compliance-assistant Feature + ComplianceRecord UI cascade).
392:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
393:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
394:- `LL-DEFER-04`: reservationChannels 풀세트 (모든 CTAConfig type).
395:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI.
396:- `LL-DEFER-06`: LegalDocument body 수동 override · 자동 재렌더링 정책.
397:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
398:- `LL-DEFER-08`: 5종 LegalDocument 각각의 effectiveDate individual override 폼.
399:- `LL-DEFER-09`: `ClinicProfileBundle` audit contentType 권한 분리 (M0 v1.0 RBAC).
400:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1733ms:
packages/core-content/migrations/C0001_clinic_profile.sql:4:CREATE TABLE clinic_profile (
packages/core-content/migrations/C0001_clinic_profile.sql:19:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- v0.2+ 확장 (awards·memberOf·socialMedia 등)
packages/core-content/migrations/C0001_clinic_profile.sql:22:  CONSTRAINT clinic_profile_name_length CHECK (length(name) BETWEEN 1 AND 100),
packages/core-content/migrations/C0001_clinic_profile.sql:23:  CONSTRAINT clinic_profile_description_length CHECK (length(description) BETWEEN 80 AND 300),
packages/core-content/migrations/C0001_clinic_profile.sql:24:  CONSTRAINT clinic_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0001_clinic_profile.sql:25:  CONSTRAINT clinic_profile_brn_regex CHECK (business_registration_number IS NULL OR business_registration_number ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'),
packages/core-content/migrations/C0001_clinic_profile.sql:26:  CONSTRAINT clinic_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0001_clinic_profile.sql:27:  CONSTRAINT clinic_profile_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0001_clinic_profile.sql:30:CREATE INDEX clinic_profile_instance_idx ON clinic_profile (instance_id);
packages/core-content/migrations/C0001_clinic_profile.sql:32:ALTER TABLE clinic_profile ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0001_clinic_profile.sql:33:ALTER TABLE clinic_profile FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0001_clinic_profile.sql:35:CREATE POLICY tenant_isolation ON clinic_profile
packages/core-content/migrations/C0001_clinic_profile.sql:38:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/core-content/migrations/C0001_clinic_profile.sql:40:GRANT SELECT, INSERT, UPDATE, DELETE ON clinic_profile TO app_tenant_user;
packages/core-content/migrations/C0002_location_profile.sql:3:CREATE TABLE location_profile (
packages/core-content/migrations/C0002_location_profile.sql:20:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- v0.2+ hours·directions·parking 등
packages/core-content/migrations/C0002_location_profile.sql:23:  CONSTRAINT location_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0002_location_profile.sql:25:  CONSTRAINT location_profile_country_iso CHECK (address_country ~ '^[A-Z]{2}$'),
packages/core-content/migrations/C0002_location_profile.sql:26:  CONSTRAINT location_profile_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
packages/core-content/migrations/C0002_location_profile.sql:27:  CONSTRAINT location_profile_lng_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
packages/core-content/migrations/C0002_location_profile.sql:28:  CONSTRAINT location_profile_email_regex CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
packages/core-content/migrations/C0002_location_profile.sql:29:  CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0002_location_profile.sql:30:  CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0002_location_profile.sql:33:CREATE INDEX location_profile_instance_idx ON location_profile (instance_id);
packages/core-content/migrations/C0002_location_profile.sql:35:ALTER TABLE location_profile ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0002_location_profile.sql:36:ALTER TABLE location_profile FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0002_location_profile.sql:38:CREATE POLICY tenant_isolation ON location_profile
packages/core-content/migrations/C0002_location_profile.sql:41:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/core-content/migrations/C0002_location_profile.sql:43:GRANT SELECT, INSERT, UPDATE, DELETE ON location_profile TO app_tenant_user;
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
대상 plan 내부에서 몇 가지 강한 후보가 보입니다. SoT의 자동 생성 규칙과 enum/required 필드 쪽 라인을 확인해 evidence를 고정하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8\\.1|3\\.8\\.2|LocationProfile|LegalDocument|@id=main|representativeDoctors|reservationChannels|primaryCtas|민원|complaint|clinic\\.name|legalEntityName|businessRegistrationNumber|founder|location\\.main|policy\" \"docs/admin/ARCHITECTURE.md\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C-16|C-21|documentType|privacy|terms|non-covered|refund|complaint|cookie|other|legalCounsel|parentClinic|businessHours|reservationChannels|featuredChannelId|representativeDoctors|primaryCtas|locations|CT-02|SpecialClosure|closed" "docs/core/DATA_MODEL.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content_publication_status|draft|review-queued|ActionType|operator-edit-content|NotificationEvent|review-queued|multi-role|AND|content-saved|operator-edit-legal" "docs/admin/REVIEW_WORKFLOW.md" "docs/decisions/ADMIN_UI_SKELETON_PLAN.md"' in C:\Users\assag\solution\website-exposure
 succeeded in 2437ms:
125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
133:> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
137:| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
183:| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
190:### 3.8.1 LocationProfile(main) 자동 생성 규칙
193:> - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
194:> - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
200:**(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
202:| LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
210:| `representativeDoctors` | ClinicProfile에 등록된 대표 의료진 |
213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
215:**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
219:### 3.8.2 LegalDocument 자동 생성 규칙
221:P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.
223:| LegalDocument 필드 | 자동 생성 값 |
228:| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) — 출처 SoT 준수 |
235:- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
237:  - `contentType` = `LegalDocument`
326:> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
332:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
487:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
488:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
490:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2360ms:
50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
103:- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
151:### CT-02. `BusinessHours` — 진료시간·접수시간·휴진
161:| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
182:#### `SpecialClosure`
203:| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
239:| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
240:| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
294:| `others` | `{label: string, url: URL}[]` | optional | |
335:| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
336:| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
421:| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
587:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
782:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
783:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
811:| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
828:| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
853:| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
854:| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
858:| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
886:| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
893:| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
895:| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
904:| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
948:필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**
970:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
992:| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
1013:LocationProfile (C-21) — 위치·시간·연락 SoT
1014:   ├─ businessHours → BusinessHours (CT-02)
1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
1016:   ├─ parentClinic → ClinicProfile (C-01)
1017:   ├─ representativeDoctors → DoctorProfile[]
1022:   ├─ primaryLocation → LocationProfile (C-21)
1086:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1093:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2349ms:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:19:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 (9 states · 14 actions · multi-role AND gate)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:161:       SELECT 1 FROM admin_user WHERE email = emailNormalized AND active = true LIMIT 1
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:179:        WHERE m.user_id = userId AND m.role = 'operator' AND m.active = true AND i.active = true
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:203:     • assertActionEligibility(ctx, 'operator-edit-content')
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:206:     • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:275:  const rows = await sqlBase<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1`;
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:359:**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:372:| `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:390: WHERE event_type IN ('tenant-resolved','content-saved','session-created')
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:391:   AND occurred_at > $sinceTime
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:398:**content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:401:3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:453:    assertActionEligibility(ctx, "operator-edit-content");
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:454:    const [before] = await tx`SELECT updated_at FROM clinic_profile WHERE instance_id = ${ctx.instanceId} AND slug = 'clinic'`;
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:469:      eventType: "content-saved",
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:480:    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:491:- **ADMIN-UI-12**: assertActionEligibility(ctx, 'operator-edit-content').
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:564:     WHERE user_id = ${userRow.id}::uuid AND instance_id = ${instanceRow.id}::uuid
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:568:    -- active=true 시 deactivated_at IS NULL AND deactivated_by_user_id IS NULL 요구
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:575:     WHERE id = (SELECT id FROM existing) AND (SELECT active FROM existing) = false
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:617:7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:637:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:651:| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:685:| Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:704:| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
docs/admin/REVIEW_WORKFLOW.md:7:> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
docs/admin/REVIEW_WORKFLOW.md:10:> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
docs/admin/REVIEW_WORKFLOW.md:20:- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
docs/admin/REVIEW_WORKFLOW.md:22:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
docs/admin/REVIEW_WORKFLOW.md:48:- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)
docs/admin/REVIEW_WORKFLOW.md:64:  | "draft"           // 작성 중 — 자동 검수 미실행
docs/admin/REVIEW_WORKFLOW.md:65:  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
docs/admin/REVIEW_WORKFLOW.md:79:                            │       draft          │
docs/admin/REVIEW_WORKFLOW.md:84:              ┌────────────►│   review-queued      │
docs/admin/REVIEW_WORKFLOW.md:95:              │                │   │ AND 게이트 평가 (§ 4.5)     │
docs/admin/REVIEW_WORKFLOW.md:127:draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
docs/admin/REVIEW_WORKFLOW.md:134:| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
docs/admin/REVIEW_WORKFLOW.md:135:| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
docs/admin/REVIEW_WORKFLOW.md:136:| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
docs/admin/REVIEW_WORKFLOW.md:140:| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
docs/admin/REVIEW_WORKFLOW.md:141:| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:142:| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
docs/admin/REVIEW_WORKFLOW.md:144:| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
docs/admin/REVIEW_WORKFLOW.md:145:| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
docs/admin/REVIEW_WORKFLOW.md:146:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:147:| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:177:다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:
docs/admin/REVIEW_WORKFLOW.md:205:## 4. multi-role AND 게이트
docs/admin/REVIEW_WORKFLOW.md:207:### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)
docs/admin/REVIEW_WORKFLOW.md:222:**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):
docs/admin/REVIEW_WORKFLOW.md:248:| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
docs/admin/REVIEW_WORKFLOW.md:329:- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
docs/admin/REVIEW_WORKFLOW.md:384:  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:575:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
docs/admin/REVIEW_WORKFLOW.md:579:type NotificationEvent = {
docs/admin/REVIEW_WORKFLOW.md:582:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:598:  eventId: string;                                     // 상위 NotificationEvent 참조
docs/admin/REVIEW_WORKFLOW.md:599:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:744:| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
docs/admin/REVIEW_WORKFLOW.md:789:| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
docs/admin/REVIEW_WORKFLOW.md:807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
docs/admin/REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
docs/admin/REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "body|AST|answer-first|Markdown|ComplianceCheckResult|schema|JSON|LegalDocument|exempt|면제" "docs/core/CONTENT_STANDARDS.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "risk|RiskLevel|Low|Medium|High|LegalDocument|법무|legal" "docs/compliance/RISK_LEVELS.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ActionType|operator-edit-content|operator-publish|reviewer|approve|request-changes" "docs/admin/REVIEW_WORKFLOW.md"' in C:\Users\assag\solution\website-exposure
 succeeded in 1541ms:
24:- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
55:| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
76:| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
87:[나쁨 — answer-first 위반]
92:#### 2.1.1 answer-first 검사 대상 (Markdown AST)
100:4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
104:> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).
129:| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
159:| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
175:**구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.
207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
369:  body: Markdown;
447:type ComplianceCheckResult = {
586:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
608:| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
609:| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
621:| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
639:| 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
644:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1534ms:
7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
11:> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
21:- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
22:- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
35:| RiskLevel enum 변경 | **MAJOR** | DATA_MODEL C-05 cascade 필수 |
52:## 2. RiskLevel — 정의·자동 추론
54:### 2.1 RiskLevel enum
56:`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:
59:const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
71:  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
77:  triggeredLevel: RiskLevel;
88:5. if explicitRiskLevel: final = max(base, explicitRiskLevel)
93:`explicitRiskLevel`은 격하 불가 — 항상 MAX 결합. ComplianceRecord 운영자가 명시 격상만 가능.
99:  inferredRiskLevel: RiskLevel;     // MAX 결합 결과 (단계 7 final)
101:    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
103:    level: RiskLevel;                // 본 source가 기여한 등급
115:| `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
116:| `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
117:| `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
118:| `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
119:| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |
121:> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).
127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
128:| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-test | Medium |
129:| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
130:| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |
237:| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
244:| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
245:| `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |
420:### 4.2 legal (법무 자문·승인)
423:- 사내 법무 또는 외부 법무법인 (변호사 자격)
431:- ComplianceRecord(C-10) `legalCounsel` + `legalCounselAt` 기록
432:- `attachments[]` — 법무 의견서·검토 보고서 첨부 권장
437:**만료** — `staleFlags.legal=true`로 표기. 다음 이벤트에서 자동 설정:
443:- 법무 의견서 첨부 만료 (의견서 작성일 기준 12개월 초과 — **RL-07 해소 후 자동 판정 활성화**. v1.0에서는 어드민 워크플로에 수동 갱신 큐 기능으로 대체)
469:- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
477:- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구
480:- `requiredApproverRoles[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "legal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용
485:| `review-case` ArticleType | `["medical", "legal"]` |
486:| `event-price` ArticleType | `["legal"]` |
488:| 전후사진 노출 콘텐츠 | `["medical", "legal"]` |
489:| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
490:| 기타 High 등급 (자동 추론) | `["medical"]` |
505:각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.
525:| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
526:| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |
528:> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
533:- 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
534:- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화
562:| Low | (특별 동작 없음) |
563:| Medium | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록. fail/content-gate 매칭은 룰 단위로 독립 처리 |
564:| High | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 진입 |
566:- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
567:- High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)
569:### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)
573:본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
578:- `explicitRiskLevel` override (어드민 명시 입력)
580:**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).
586:  ruleId: "risk-level-high-gate",
588:  pattern: "(RiskLevel=High)",
595:### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override
597:본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우(High 등급)**의 `requiredApproverRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 않음.
599:| ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
602:| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |
603:| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
604:| 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |
606:> Medium 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 요구는 자동 적용
610:- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)
656:   - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
683:| **fail** | RiskRule 파일 JSON Schema 검증 실패, RiskLevel enum 위반, ApproverRole 매핑 누락 |
694:| RL-04 | legal 검수의 외부 법무법인 vs 사내 법무 구분 데이터 모델 | DATA_MODEL 후속 사이클 |
712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
714:| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1499ms:
20:- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
22:- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
67:  | "approved"        // 필요한 모든 역할의 승인 완료
92:              │     reject     │      │ approve (해당 역할)
101:              │                │  │ approved │     ┘
136:| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
145:| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
209:콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:
222:**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):
224:`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.
227:> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
246:| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
248:| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
249:| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |
253:- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
255:- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)
263:approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:
278:- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
291:| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
331:- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
473:  | "reviewer-approved"             // 검수자 approve
474:  | "reviewer-rejected"             // 검수자 reject
509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
528:| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
529:| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
530:| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
533:| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
534:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
535:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
536:| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
539:| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
540:| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
541:| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
542:| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
543:| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
544:| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
545:| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
546:| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
547:| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
558:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
633:- 모든 검수자 액션 (approve·reject·request-changes·delegate)
660:  | "approve" | "reject" | "request-changes" | "delegate"
694:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
733:  | "physician-reviewer"  // medical 역할 검수만
734:  | "legal-reviewer"      // legal 역할 검수만
735:  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
745:| operator approve | ✅ | ✅ | | | |
746:| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
747:| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
748:| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
754:> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
765:- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
787:| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

2026-05-16T06:02:39.194323Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=240; $i -le 260; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=240; $i -le 260; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=350; $i -le 360; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=240; $i -le 260; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
2026-05-16T06:02:39.195459Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=350; $i -le 360; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/decisions/LOCATION_LEGAL_PLAN.md"; for ($i=350; $i -le 360; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
2026-05-16T06:02:39.258954Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/core/DATA_MODEL.md"; for ($i=151; $i -le 164; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/core/DATA_MODEL.md"; for ($i=151; $i -le 164; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines = Get-Content "docs/core/DATA_MODEL.md"; for ($i=151; $i -le 164; $i++) { if ($i -le $lines.Length) { "${i}:$($lines[$i-1])" } }'` rejected: blocked by policy
codex
라인 범위 출력은 현재 셸 정책에 막혀서, `rg` 컨텍스트 검색으로 필요한 부분만 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n -C 6 \"type RenderContext|clinic\\.legalEntityName|policy\\.contact|policy\\.effectiveDate|변수 화이트리스트\" \"docs/decisions/LOCATION_LEGAL_PLAN.md\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "type BusinessHours|dayOfWeek|regularHours|lunchBreaks|specialClosures|OpeningHoursSpec" "docs/core/DATA_MODEL.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "legal_document|risk_level|content_publication_status|CREATE TYPE" "docs/decisions/LOCATION_LEGAL_PLAN.md"' in C:\Users\assag\solution\website-exposure
 succeeded in 1605ms:
240-
241-### 4.2 변수 치환 엔진 (LL-ACTION-09)
242-
243-```typescript
244-// packages/core-content/src/templates/render.ts
245-
246:type RenderContext = {
247-  clinic: {
248-    name: string;
249-    legalEntityName: string | null;
250-    businessRegistrationNumber: string | null;
251-    founder: string | null;
252-  };
--
266-};
267-
268-export function renderTemplate(template: string, ctx: RenderContext): string;
269-```
270-
271-**결정**:
272:- (LL-ACTION-10) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
273:- (LL-ACTION-11) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
274-- (LL-ACTION-12) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
275-- (LL-ACTION-13) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
276-
277-### 4.3 audit (LL-ACTION-14)
278-
279-```jsonc
--
344-```
345-
346-**결정**:
347-- (LL-TEMPLATE-02) v0.1 은 5종 (`cookie`/`other` 제외) — M0 본 구현에 합류 시 추가.
348-- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
349-- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿은 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
350:- (LL-TEMPLATE-05) 변수 화이트리스트 (LL-ACTION-10):
351:  - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
352-  - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
353:  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
354-- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06). major 변경 시 운영자 수동 확인 (LL-DEFER-10 — v0.1 에서는 자동 재렌더링).
355-
356-## 6. 환경·precondition
357-
358-- `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음. C0006·C0007 migration 적용 필요.
359-- packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
--
367-|---|---|---|
368-| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
369-| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | 403 (membership 부재) |
370-| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 (LL-SCHEMA-04) |
371-| 17 | LegalDocument 같은 documentType 두 번 INSERT | UNIQUE 위반 (LL-SCHEMA-02) |
372-| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
373:| 19 | 변수 화이트리스트 외 키 (`{{evil.x}}`) 가 포함된 템플릿 빌드 | renderTemplate throw → 저장 실패 + 운영자 메시지 |
374-
375-## 8. 작업 단위
376-
377-| # | 작업 | 산출물 |
378-|---|---|---|
379-| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1613ms:
11-## SoT
12-
13-- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
14-- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
15:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states (draft/review-queued 까지만 허용)
16-- `docs/admin/CONTENT_STANDARDS.md` v1.3 — Markdown 본문 검증 규약 (LegalDocument body 는 일반 검증 제외 — 표준 템플릿 + 변수 치환은 별도 검증 룰)
17-- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 7 .env · § 8.1 RLS 시나리오 패턴
18-- 기존 코드 (cycle 시작 전 직접 확인):
19-  - `packages/core-content/migrations/C0001_clinic_profile.sql` — `slug TEXT NOT NULL DEFAULT 'clinic'` · `metadata JSONB`
--
33-
34-| 항목 | 비고 |
35-|---|---|
36-| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
37:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType enum |
38-| `clinic_profile` 정책 변수 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` (정책 시행일 default) |
39-| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 |
40-| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` (DATA_MODEL C-16 enum 정합) |
41-| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 기반 strict (unknown key = build error) |
--
59-| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
60-
61-## 2. 데이터 모델 결정
62-
63:### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
64-
65-```sql
66:-- packages/core-content/migrations/C0006_legal_document.sql
67-
68:CREATE TYPE legal_document_type AS ENUM (
69-  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
70-);
71-
72:CREATE TABLE legal_document (
73-  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
74-  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
75-  slug TEXT NOT NULL,
76:  document_type legal_document_type NOT NULL,
77-  title TEXT NOT NULL,
78-  body TEXT NOT NULL,                 -- Markdown
79-  auto_generated BOOLEAN NOT NULL DEFAULT true,
80-  template_version TEXT,              -- 'privacy@1.0.0' 등
81-  effective_date DATE NOT NULL,
82-  last_revised_date DATE,
83-  contact_person TEXT,
84-  contact_email TEXT,
85:  status content_publication_status NOT NULL DEFAULT 'draft',
86:  risk_level risk_level DEFAULT 'Low',
87-  published_at TIMESTAMPTZ,
88-  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
89-  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
90-  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
91:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
92:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
93:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
94:  CONSTRAINT legal_document_email_regex CHECK (
95-    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
96-  ),
97:  CONSTRAINT legal_document_template_version_format CHECK (
98-    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
99-  ),
100:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
101-    (auto_generated = false) OR (template_version IS NOT NULL)
102-  ),
103-  -- LL-SCHEMA-04: skeleton 단계 published 차단 — compliance-assistant cascade 까지
104:  CONSTRAINT legal_document_status_skeleton_limit CHECK (
105-    status IN ('draft', 'review-queued')
106-  ),
107:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
108:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
109:  CONSTRAINT legal_document_instance_type_unique UNIQUE (instance_id, document_type),
110:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
111-);
112-
113:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
114-
115:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
116:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
117-
118:CREATE POLICY tenant_isolation ON legal_document
119-  FOR ALL TO app_tenant_user
120-  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
121-  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
122-
123:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
124-```
125-
126-**결정 사항**:
127-- (LL-SCHEMA-02) `documentType` per `instance_id` UNIQUE — instance 당 동일 documentType 의 LegalDocument 는 1개만. M0 모든 5종 자동 생성 후 운영자 편집.
128:- (LL-SCHEMA-03) `status` enum 은 `content_publication_status` 재사용 (CHECK 로 skeleton 단계 `draft`/`review-queued` 만 허용). compliance-assistant cascade 시 CHECK 제거 + 발행 게이트 합류.
129-- (LL-SCHEMA-04) `published_at` 은 별도 정책 시행일과 다름 — 별도 column `effective_date` (DATE) 가 SoT. `published_at` 은 status 발행 시점 (skeleton 단계 NULL 강제).
130:- (LL-SCHEMA-05) `risk_level` default `Low` — DATA_MODEL C-16 규칙 (위험도 기본 Low이지만 법무 검토 필수).
131-- (LL-SCHEMA-06) `revisions[]` 은 v0.1 에서 column 미추가 (LL-DEFER-02). `metadata JSONB` 로 확장 여지만 남김.
132-
133-### 2.2 `clinic_profile` 정책 변수 컬럼 (LL-SCHEMA-07)
134-
--
304-### 4.4 control-flow / 에러 (LL-ACTION-17)
305-
306-- ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
307-- 새 constraint 매핑 (mapDbErrorToResult cascade):
308:  - `legal_document_instance_type_unique` → formError (template 충돌 — 잠시 후 재시도)
309-  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
310-  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
311-  - businessHours · reservationChannels 는 application-level 검증 (DB CHECK 없음)
312-
--
364-ADMIN_UI_SKELETON_PLAN § 8.1 의 13 시나리오에 다음 추가:
365-
366-| # | 시나리오 | 통과 기준 |
367-|---|---|---|
368:| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
369-| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | 403 (membership 부재) |
370-| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 (LL-SCHEMA-04) |
371-| 17 | LegalDocument 같은 documentType 두 번 INSERT | UNIQUE 위반 (LL-SCHEMA-02) |
372-| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
--
375-## 8. 작업 단위
376-
377-| # | 작업 | 산출물 |
378-|---|---|---|
379:| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
380-| 2 | C0007 clinic_profile policy vars migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
381-| 3 | Core 표준 템플릿 5종 + render 엔진 | packages/core-content/src/templates/* + tests |
382-| 4 | zod schema (businessHours · reservationChannels · policy vars) | apps/web/src/lib/clinic-profile-schema.ts |
383-| 5 | ClinicProfileForm 3 섹션 재구성 | apps/web/src/components/forms/ClinicProfileForm.tsx |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1617ms:
153-**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.
154-
155-| 필드 | 타입 | required | 설명 |
156-|---|---|:---:|---|
157:| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
158:| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
159:| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
160-| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
161:| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
162-| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |
163-
164-**하위 타입**:
165-
166:#### `OpeningHoursSpec`
167-| 필드 | 타입 | required | 설명 |
168-|---|---|:---:|---|
169:| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
170-| `opens` | `string` | ✅ | `"HH:mm"` |
171-| `closes` | `string` | ✅ | `"HH:mm"` |
172-| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
173-| `note` | `string` | optional | |
174-
175-#### `LunchBreak`
176-| 필드 | 타입 | required | 설명 |
177-|---|---|:---:|---|
178:| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
179-| `from` | `string` | ✅ | |
180-| `to` | `string` | ✅ | |
181-
182-#### `SpecialClosure`
--
583-| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
584-| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
585-| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
586-| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
587:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
588-| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
589-| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
590-| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
591-| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
{
  "cycle": 1,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-01",
      "finding": "C-21 required `parentClinic`와 C-01 required `locations[]`가 저장/출력 모델에서 닫히지 않는다. plan은 LocationProfile(main) upsert만 말하고, current schema에 FK가 없다는 전제에서 Ref 표현·ClinicProfile.locations 갱신·Git 출력 참조 규약을 결정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:197; docs/core/DATA_MODEL.md:240; docs/core/DATA_MODEL.md:886",
      "impact": "LocationProfile 계약 required 필드가 비어 C-21 출력이 SoT 불충족이며, ClinicProfile↔LocationProfile 관계가 빌드/발행 단계에서 재구성 불가능하다."
    },
    {
      "id": "LL-02",
      "finding": "LocationProfile `reservationChannels` 생성 규칙이 admin/ARCH와 충돌한다. SoT는 ClinicProfile `primaryCtas` 상속인데, plan은 별도 3종 입력(phone/kakao/naver-booking)을 LocationProfile metadata에 저장하고 `primaryCtas` 상속을 LL-DEFER-04로 밀었다.",
      "evidence": "docs/admin/ARCHITECTURE.md:213; docs/decisions/LOCATION_LEGAL_PLAN.md:43; docs/decisions/LOCATION_LEGAL_PLAN.md:186",
      "impact": "자동 생성 규칙의 핵심 상속 경로가 바뀌어 Contact/Location/Legal 페이지 간 CTA 일관성이 깨진다."
    },
    {
      "id": "LL-03",
      "finding": "`review-queued` 허용이 REVIEW_WORKFLOW와 반쪽만 연결되어 있다. plan은 LegalDocument status를 `draft`/`review-queued`까지 허용하지만, draft→review-queued 전이 액션, ComplianceRecord pre-publish 생성, NotificationEvent 발송 여부를 결정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:9; docs/decisions/LOCATION_LEGAL_PLAN.md:128; docs/admin/REVIEW_WORKFLOW.md:134; docs/admin/REVIEW_WORKFLOW.md:177",
      "impact": "검수 큐에 들어간 것처럼 보이는 상태가 실제 큐/알림/게이트 기록 없이 저장될 수 있어 workflow 불변식이 깨진다."
    },
    {
      "id": "LL-04",
      "finding": "LegalDocument 발행 게이트를 defer하면서도 `review-queued` 저장과 `risk_level Low`를 허용해 C-10/C-16의 legal 필수 예외 게이트를 추적할 저장 지점이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:130; docs/core/DATA_MODEL.md:846; docs/core/DATA_MODEL.md:875; docs/compliance/RISK_LEVELS.md:489",
      "impact": "나중에 발행 게이트를 붙일 때 기존 LegalDocument rows가 어떤 법무 검토 상태인지 판별할 근거가 없어 migration/review backfill 부담이 생긴다."
    },
    {
      "id": "LL-05",
      "finding": "CT-02 BusinessHours 구조와 plan의 JSON 구조가 다르다. SoT는 `openingHours[]`, `receptionHours[]`, `lunchBreaks[]`, `specialClosures[]`인데 plan은 요일별 `{closed, open, close, lunch}` object를 metadata에 저장한다.",
      "evidence": "docs/core/DATA_MODEL.md:157; docs/core/DATA_MODEL.md:161; docs/decisions/LOCATION_LEGAL_PLAN.md:166; docs/decisions/LOCATION_LEGAL_PLAN.md:185",
      "impact": "C-21 Git 출력 또는 schema.org 변환 시 별도 변환 규칙 없이는 required `businessHours`를 SoT 형태로 만들 수 없다."
    },
    {
      "id": "LL-06",
      "finding": "LegalDocument 변수 화이트리스트가 admin/ARCH §3.8.2보다 확장되었지만 정당화가 없다. SoT 변수는 clinic/location 7개인데 plan은 `policy.*` 4개를 추가한다.",
      "evidence": "docs/admin/ARCHITECTURE.md:228; docs/decisions/LOCATION_LEGAL_PLAN.md:350",
      "impact": "정책 변수 입력 섹션 자체는 admin 화면에 있으나, 템플릿 body 변수 SoT를 silent 확장해 ARCH/DATA_MODEL과 구현 계약이 갈라진다."
    },
    {
      "id": "LL-07",
      "finding": "single transaction의 잠금 순서가 5종 LegalDocument에만 정의되어 있고 ClinicProfile/LocationProfile/기존 row lock 순서는 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:217; docs/decisions/LOCATION_LEGAL_PLAN.md:235",
      "impact": "동시 저장 시 ClinicProfile과 LocationProfile을 서로 다른 순서로 잡는 코드가 생기면 deadlock 회피 결정이 불완전하다."
    }
  ],
  "newMajorFindings": [
    {
      "id": "LL-08",
      "finding": "`legal_document_instance_type_unique(instance_id, document_type)`가 `other`까지 단일 row로 제한한다. plan은 M0 5종 자동 생성 의도만 설명하고 custom `other` 여러 문서나 future cookie 추가 migration 전략을 정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:68; docs/decisions/LOCATION_LEGAL_PLAN.md:109; docs/core/DATA_MODEL.md:854",
      "impact": "운영자가 기타 정책 문서를 여러 개 추가하는 자연스러운 확장 경로가 스키마에서 차단된다."
    },
    {
      "id": "LL-09",
      "finding": "5종만 생성하면서 `cookie`/`other` 보류 근거가 약하다. DATA_MODEL enum은 7종이고 RISK_LEVELS도 cookie를 LegalDocument false-positive 완화 대상으로 포함한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:347; docs/core/DATA_MODEL.md:854; docs/compliance/RISK_LEVELS.md:525",
      "impact": "M0 출시 게이트로서 P-013 Legal/Policy가 어떤 법적 문서 세트를 최소 충족으로 보는지 불명확하다."
    },
    {
      "id": "LL-10",
      "finding": "LocationProfile required `name`, `@id`, `address`, `telephone` 매핑이 form 표에 흩어져 있고 명시적인 C-21 출력 매핑 표가 없다. `slug=main`과 `@id=main`, `name` 자동값이 plan에 고정되지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:197; docs/core/DATA_MODEL.md:878; docs/core/DATA_MODEL.md:886",
      "impact": "DB row는 저장돼도 Git 계약 C-21 required field 생성이 구현자 해석에 맡겨진다."
    },
    {
      "id": "LL-11",
      "finding": "`representativeDoctors`를 LL-DEFER-05로 미루면서 admin/ARCH의 자동 생성 표와의 임시 출력값을 정하지 않았다.",
      "evidence": "docs/admin/ARCHITECTURE.md:210; docs/decisions/LOCATION_LEGAL_PLAN.md:57; docs/core/DATA_MODEL.md:895",
      "impact": "optional 필드라 blocking은 아니지만, 화면 ② 자동 생성 규칙의 일부가 비어 preview/build 결과가 SoT와 다르게 보일 수 있다."
    },
    {
      "id": "LL-12",
      "finding": "`risk_level risk_level DEFAULT 'Low'`에 NOT NULL/CHECK 정책이 없다. 기존 enum type에 의존하더라도 NULL update 허용 여부와 skeleton 단계 explicitRiskLevel 변경 가능 여부가 결정되지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:86; docs/decisions/LOCATION_LEGAL_PLAN.md:130; docs/compliance/RISK_LEVELS.md:93",
      "impact": "RiskLevel 저장 불변식이 일반 콘텐츠와 달라지고, 법무 게이트 자동 산정에 NULL/override 케이스가 섞일 수 있다."
    },
    {
      "id": "LL-13",
      "finding": "LegalDocument body 검증 면제의 SoT 경로가 잘못되었다. plan은 `docs/admin/CONTENT_STANDARDS.md`를 참조하지만 실제 파일은 `docs/core/CONTENT_STANDARDS.md`이며, 일반 Markdown AST/표현 검증 중 무엇을 면제하고 무엇은 템플릿 검증으로 대체하는지 명확하지 않다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:16; docs/core/CONTENT_STANDARDS.md:92; docs/core/CONTENT_STANDARDS.md:447",
      "impact": "checker 구현자가 LegalDocument를 완전 면제하거나 일반 콘텐츠처럼 검사하는 양쪽 오해가 가능하다."
    },
    {
      "id": "LL-14",
      "finding": "policyContactPhone만 optional로 둔 것은 한국 개인정보처리방침 필수 연락수단 모델과 맞지 않을 수 있다. plan은 개인정보 보호책임자 이름·이메일·시행일만 required로 삼고 전화/소속/부서 필드를 누락한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:198; docs/decisions/LOCATION_LEGAL_PLAN.md:203",
      "impact": "privacy 템플릿이 법무 검토 전 draft라도 필수 고지 항목을 채우기 어려워 나중에 컬럼 추가가 필요할 가능성이 높다."
    },
    {
      "id": "LL-15",
      "finding": "`policy_effective_date`가 5종 LegalDocument의 공통 default로만 존재하고 document별 override가 LL-DEFER-08이다. 그런데 `effective_date`는 LegalDocument table에서 NOT NULL이다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:81; docs/decisions/LOCATION_LEGAL_PLAN.md:157; docs/decisions/LOCATION_LEGAL_PLAN.md:398",
      "impact": "서로 다른 시행일이 필요한 환불/비급여/민원 문서를 v0.1에서 정확히 표현할 수 없다."
    },
    {
      "id": "LL-16",
      "finding": "`LL-ACTION-06`은 templateVersion=current인 row만 자동 재렌더링한다고 하지만 v0.1은 수동 편집을 차단하고 모든 row가 current가 된다. 조건 분기가 실질적으로 죽은 정책이다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:237; docs/decisions/LOCATION_LEGAL_PLAN.md:396",
      "impact": "향후 수동 override 도입 시 어떤 row가 자동 재렌더링에서 제외되는지 판별할 상태 필드가 없다."
    },
    {
      "id": "LL-17",
      "finding": "audit payload가 ADMIN_UI_SKELETON_PLAN의 `{contentType, slug, mode, status, originalSlug}` 통일 shape와 다르다. plan은 outer `ClinicProfileBundle`과 nested `contracts[]`를 새로 도입하지만 matrix cascade의 구체 호환 규칙이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:287; docs/decisions/LOCATION_LEGAL_PLAN.md:301; docs/decisions/ADMIN_UI_SKELETON_PLAN.md:372",
      "impact": "기존 audit 조회/테스트/analytics가 content-saved payload를 파싱하지 못할 수 있다."
    },
    {
      "id": "LL-18",
      "finding": "`operator-edit-content` 하나로 LegalDocument까지 편집한다. plan은 LL-DEFER-09로 권한 분리를 미루지만 LegalDocument는 법무 검토 필수 콘텐츠라 최소한 skeleton 단계의 제한 근거가 필요하다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:223; docs/decisions/LOCATION_LEGAL_PLAN.md:302; docs/admin/REVIEW_WORKFLOW.md:26",
      "impact": "법무 문서 편집 권한이 일반 콘텐츠 편집 권한과 동일해져 RBAC cascade 때 breaking change가 커진다."
    },
    {
      "id": "LL-19",
      "finding": "RLS 시나리오 16은 CHECK 위반만 기대하고 운영자 메시지/field mapping을 정의하지 않는다. control-flow mapping에도 published CHECK constraint가 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:306; docs/decisions/LOCATION_LEGAL_PLAN.md:370",
      "impact": "status published 시도 실패가 generic formError로 노출되어 테스트와 UX가 불안정하다."
    }
  ],
  "newMinorFindings": [
    {
      "id": "LL-20",
      "finding": "phone regex `^[+0-9 ()-]{4,32}$`는 한국 번호는 받지만 확장번호, 점 구분, 국제 표기 `+82-2-...` 외의 흔한 포맷 정책을 설명하지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:149; docs/decisions/LOCATION_LEGAL_PLAN.md:213",
      "impact": "입력 UX와 DB CHECK가 어긋나는 케이스가 생길 수 있다."
    },
    {
      "id": "LL-21",
      "finding": "`new Date()`로 `current_date`를 정한다고 되어 있어 app server timezone과 DB/date 정책이 섞인다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:238",
      "impact": "Asia/Seoul 기준 시행일이 UTC 날짜와 하루 차이 날 수 있다."
    },
    {
      "id": "LL-22",
      "finding": "template version 규칙은 slug와 documentType이 같은 5종만 자연스럽다. `documentType=other` + custom slug의 naming 규칙이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:97; docs/core/DATA_MODEL.md:858",
      "impact": "custom template 도입 시 version namespace 충돌 가능성이 있다."
    },
    {
      "id": "LL-23",
      "finding": "businessHours UI의 접근성 marker가 없다. 7요일 반복 행, disabled inputs, conditional lunch controls는 label/aria-describedby/error association이 필요하다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:206; docs/decisions/LOCATION_LEGAL_PLAN.md:212",
      "impact": "폼이 커지는 만큼 a11y regression이 생길 수 있다."
    },
    {
      "id": "LL-24",
      "finding": "변수 화이트리스트 외 키 detection 시점이 `템플릿 빌드`인지 `server action 저장`인지 혼재되어 있다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:272; docs/decisions/LOCATION_LEGAL_PLAN.md:373",
      "impact": "테스트가 build-time unit test와 runtime action test 중 어디에 걸려야 하는지 불명확하다."
    },
    {
      "id": "LL-25",
      "finding": "LL-DEFER marker는 10개로 정리되어 있으나 본문 비범위 표에는 LL-DEFER-08~10이 처음부터 함께 보이지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:50; docs/decisions/LOCATION_LEGAL_PLAN.md:391",
      "impact": "cycle 추적 시 deferred scope가 §1과 §9 사이에서 다르게 읽힌다."
    }
  ],
  "convergenceSignal": "cycle1 기준으로 SoT 충돌과 schema/workflow 결함이 모두 남아 있어 수렴 전 단계다. 특히 C-21 관계 모델, REVIEW_WORKFLOW review-queued 연결, CT-02 BusinessHours 표현을 먼저 닫아야 한다.",
  "nextCycleFocus": "v0.2에서는 C-21 출력 매핑표(parentClinic/locations 포함), admin/ARCH §3.8.1 CTA 상속 결정, LegalDocument review-queued/ComplianceRecord/NotificationEvent 정책, CT-02 호환 BusinessHours 저장 형식을 우선 패치해야 한다."
}
tokens used
65,890
{
  "cycle": 1,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-01",
      "finding": "C-21 required `parentClinic`와 C-01 required `locations[]`가 저장/출력 모델에서 닫히지 않는다. plan은 LocationProfile(main) upsert만 말하고, current schema에 FK가 없다는 전제에서 Ref 표현·ClinicProfile.locations 갱신·Git 출력 참조 규약을 결정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:197; docs/core/DATA_MODEL.md:240; docs/core/DATA_MODEL.md:886",
      "impact": "LocationProfile 계약 required 필드가 비어 C-21 출력이 SoT 불충족이며, ClinicProfile↔LocationProfile 관계가 빌드/발행 단계에서 재구성 불가능하다."
    },
    {
      "id": "LL-02",
      "finding": "LocationProfile `reservationChannels` 생성 규칙이 admin/ARCH와 충돌한다. SoT는 ClinicProfile `primaryCtas` 상속인데, plan은 별도 3종 입력(phone/kakao/naver-booking)을 LocationProfile metadata에 저장하고 `primaryCtas` 상속을 LL-DEFER-04로 밀었다.",
      "evidence": "docs/admin/ARCHITECTURE.md:213; docs/decisions/LOCATION_LEGAL_PLAN.md:43; docs/decisions/LOCATION_LEGAL_PLAN.md:186",
      "impact": "자동 생성 규칙의 핵심 상속 경로가 바뀌어 Contact/Location/Legal 페이지 간 CTA 일관성이 깨진다."
    },
    {
      "id": "LL-03",
      "finding": "`review-queued` 허용이 REVIEW_WORKFLOW와 반쪽만 연결되어 있다. plan은 LegalDocument status를 `draft`/`review-queued`까지 허용하지만, draft→review-queued 전이 액션, ComplianceRecord pre-publish 생성, NotificationEvent 발송 여부를 결정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:9; docs/decisions/LOCATION_LEGAL_PLAN.md:128; docs/admin/REVIEW_WORKFLOW.md:134; docs/admin/REVIEW_WORKFLOW.md:177",
      "impact": "검수 큐에 들어간 것처럼 보이는 상태가 실제 큐/알림/게이트 기록 없이 저장될 수 있어 workflow 불변식이 깨진다."
    },
    {
      "id": "LL-04",
      "finding": "LegalDocument 발행 게이트를 defer하면서도 `review-queued` 저장과 `risk_level Low`를 허용해 C-10/C-16의 legal 필수 예외 게이트를 추적할 저장 지점이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:130; docs/core/DATA_MODEL.md:846; docs/core/DATA_MODEL.md:875; docs/compliance/RISK_LEVELS.md:489",
      "impact": "나중에 발행 게이트를 붙일 때 기존 LegalDocument rows가 어떤 법무 검토 상태인지 판별할 근거가 없어 migration/review backfill 부담이 생긴다."
    },
    {
      "id": "LL-05",
      "finding": "CT-02 BusinessHours 구조와 plan의 JSON 구조가 다르다. SoT는 `openingHours[]`, `receptionHours[]`, `lunchBreaks[]`, `specialClosures[]`인데 plan은 요일별 `{closed, open, close, lunch}` object를 metadata에 저장한다.",
      "evidence": "docs/core/DATA_MODEL.md:157; docs/core/DATA_MODEL.md:161; docs/decisions/LOCATION_LEGAL_PLAN.md:166; docs/decisions/LOCATION_LEGAL_PLAN.md:185",
      "impact": "C-21 Git 출력 또는 schema.org 변환 시 별도 변환 규칙 없이는 required `businessHours`를 SoT 형태로 만들 수 없다."
    },
    {
      "id": "LL-06",
      "finding": "LegalDocument 변수 화이트리스트가 admin/ARCH §3.8.2보다 확장되었지만 정당화가 없다. SoT 변수는 clinic/location 7개인데 plan은 `policy.*` 4개를 추가한다.",
      "evidence": "docs/admin/ARCHITECTURE.md:228; docs/decisions/LOCATION_LEGAL_PLAN.md:350",
      "impact": "정책 변수 입력 섹션 자체는 admin 화면에 있으나, 템플릿 body 변수 SoT를 silent 확장해 ARCH/DATA_MODEL과 구현 계약이 갈라진다."
    },
    {
      "id": "LL-07",
      "finding": "single transaction의 잠금 순서가 5종 LegalDocument에만 정의되어 있고 ClinicProfile/LocationProfile/기존 row lock 순서는 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:217; docs/decisions/LOCATION_LEGAL_PLAN.md:235",
      "impact": "동시 저장 시 ClinicProfile과 LocationProfile을 서로 다른 순서로 잡는 코드가 생기면 deadlock 회피 결정이 불완전하다."
    }
  ],
  "newMajorFindings": [
    {
      "id": "LL-08",
      "finding": "`legal_document_instance_type_unique(instance_id, document_type)`가 `other`까지 단일 row로 제한한다. plan은 M0 5종 자동 생성 의도만 설명하고 custom `other` 여러 문서나 future cookie 추가 migration 전략을 정하지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:68; docs/decisions/LOCATION_LEGAL_PLAN.md:109; docs/core/DATA_MODEL.md:854",
      "impact": "운영자가 기타 정책 문서를 여러 개 추가하는 자연스러운 확장 경로가 스키마에서 차단된다."
    },
    {
      "id": "LL-09",
      "finding": "5종만 생성하면서 `cookie`/`other` 보류 근거가 약하다. DATA_MODEL enum은 7종이고 RISK_LEVELS도 cookie를 LegalDocument false-positive 완화 대상으로 포함한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:347; docs/core/DATA_MODEL.md:854; docs/compliance/RISK_LEVELS.md:525",
      "impact": "M0 출시 게이트로서 P-013 Legal/Policy가 어떤 법적 문서 세트를 최소 충족으로 보는지 불명확하다."
    },
    {
      "id": "LL-10",
      "finding": "LocationProfile required `name`, `@id`, `address`, `telephone` 매핑이 form 표에 흩어져 있고 명시적인 C-21 출력 매핑 표가 없다. `slug=main`과 `@id=main`, `name` 자동값이 plan에 고정되지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:197; docs/core/DATA_MODEL.md:878; docs/core/DATA_MODEL.md:886",
      "impact": "DB row는 저장돼도 Git 계약 C-21 required field 생성이 구현자 해석에 맡겨진다."
    },
    {
      "id": "LL-11",
      "finding": "`representativeDoctors`를 LL-DEFER-05로 미루면서 admin/ARCH의 자동 생성 표와의 임시 출력값을 정하지 않았다.",
      "evidence": "docs/admin/ARCHITECTURE.md:210; docs/decisions/LOCATION_LEGAL_PLAN.md:57; docs/core/DATA_MODEL.md:895",
      "impact": "optional 필드라 blocking은 아니지만, 화면 ② 자동 생성 규칙의 일부가 비어 preview/build 결과가 SoT와 다르게 보일 수 있다."
    },
    {
      "id": "LL-12",
      "finding": "`risk_level risk_level DEFAULT 'Low'`에 NOT NULL/CHECK 정책이 없다. 기존 enum type에 의존하더라도 NULL update 허용 여부와 skeleton 단계 explicitRiskLevel 변경 가능 여부가 결정되지 않았다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:86; docs/decisions/LOCATION_LEGAL_PLAN.md:130; docs/compliance/RISK_LEVELS.md:93",
      "impact": "RiskLevel 저장 불변식이 일반 콘텐츠와 달라지고, 법무 게이트 자동 산정에 NULL/override 케이스가 섞일 수 있다."
    },
    {
      "id": "LL-13",
      "finding": "LegalDocument body 검증 면제의 SoT 경로가 잘못되었다. plan은 `docs/admin/CONTENT_STANDARDS.md`를 참조하지만 실제 파일은 `docs/core/CONTENT_STANDARDS.md`이며, 일반 Markdown AST/표현 검증 중 무엇을 면제하고 무엇은 템플릿 검증으로 대체하는지 명확하지 않다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:16; docs/core/CONTENT_STANDARDS.md:92; docs/core/CONTENT_STANDARDS.md:447",
      "impact": "checker 구현자가 LegalDocument를 완전 면제하거나 일반 콘텐츠처럼 검사하는 양쪽 오해가 가능하다."
    },
    {
      "id": "LL-14",
      "finding": "policyContactPhone만 optional로 둔 것은 한국 개인정보처리방침 필수 연락수단 모델과 맞지 않을 수 있다. plan은 개인정보 보호책임자 이름·이메일·시행일만 required로 삼고 전화/소속/부서 필드를 누락한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:198; docs/decisions/LOCATION_LEGAL_PLAN.md:203",
      "impact": "privacy 템플릿이 법무 검토 전 draft라도 필수 고지 항목을 채우기 어려워 나중에 컬럼 추가가 필요할 가능성이 높다."
    },
    {
      "id": "LL-15",
      "finding": "`policy_effective_date`가 5종 LegalDocument의 공통 default로만 존재하고 document별 override가 LL-DEFER-08이다. 그런데 `effective_date`는 LegalDocument table에서 NOT NULL이다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:81; docs/decisions/LOCATION_LEGAL_PLAN.md:157; docs/decisions/LOCATION_LEGAL_PLAN.md:398",
      "impact": "서로 다른 시행일이 필요한 환불/비급여/민원 문서를 v0.1에서 정확히 표현할 수 없다."
    },
    {
      "id": "LL-16",
      "finding": "`LL-ACTION-06`은 templateVersion=current인 row만 자동 재렌더링한다고 하지만 v0.1은 수동 편집을 차단하고 모든 row가 current가 된다. 조건 분기가 실질적으로 죽은 정책이다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:237; docs/decisions/LOCATION_LEGAL_PLAN.md:396",
      "impact": "향후 수동 override 도입 시 어떤 row가 자동 재렌더링에서 제외되는지 판별할 상태 필드가 없다."
    },
    {
      "id": "LL-17",
      "finding": "audit payload가 ADMIN_UI_SKELETON_PLAN의 `{contentType, slug, mode, status, originalSlug}` 통일 shape와 다르다. plan은 outer `ClinicProfileBundle`과 nested `contracts[]`를 새로 도입하지만 matrix cascade의 구체 호환 규칙이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:287; docs/decisions/LOCATION_LEGAL_PLAN.md:301; docs/decisions/ADMIN_UI_SKELETON_PLAN.md:372",
      "impact": "기존 audit 조회/테스트/analytics가 content-saved payload를 파싱하지 못할 수 있다."
    },
    {
      "id": "LL-18",
      "finding": "`operator-edit-content` 하나로 LegalDocument까지 편집한다. plan은 LL-DEFER-09로 권한 분리를 미루지만 LegalDocument는 법무 검토 필수 콘텐츠라 최소한 skeleton 단계의 제한 근거가 필요하다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:223; docs/decisions/LOCATION_LEGAL_PLAN.md:302; docs/admin/REVIEW_WORKFLOW.md:26",
      "impact": "법무 문서 편집 권한이 일반 콘텐츠 편집 권한과 동일해져 RBAC cascade 때 breaking change가 커진다."
    },
    {
      "id": "LL-19",
      "finding": "RLS 시나리오 16은 CHECK 위반만 기대하고 운영자 메시지/field mapping을 정의하지 않는다. control-flow mapping에도 published CHECK constraint가 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:306; docs/decisions/LOCATION_LEGAL_PLAN.md:370",
      "impact": "status published 시도 실패가 generic formError로 노출되어 테스트와 UX가 불안정하다."
    }
  ],
  "newMinorFindings": [
    {
      "id": "LL-20",
      "finding": "phone regex `^[+0-9 ()-]{4,32}$`는 한국 번호는 받지만 확장번호, 점 구분, 국제 표기 `+82-2-...` 외의 흔한 포맷 정책을 설명하지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:149; docs/decisions/LOCATION_LEGAL_PLAN.md:213",
      "impact": "입력 UX와 DB CHECK가 어긋나는 케이스가 생길 수 있다."
    },
    {
      "id": "LL-21",
      "finding": "`new Date()`로 `current_date`를 정한다고 되어 있어 app server timezone과 DB/date 정책이 섞인다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:238",
      "impact": "Asia/Seoul 기준 시행일이 UTC 날짜와 하루 차이 날 수 있다."
    },
    {
      "id": "LL-22",
      "finding": "template version 규칙은 slug와 documentType이 같은 5종만 자연스럽다. `documentType=other` + custom slug의 naming 규칙이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:97; docs/core/DATA_MODEL.md:858",
      "impact": "custom template 도입 시 version namespace 충돌 가능성이 있다."
    },
    {
      "id": "LL-23",
      "finding": "businessHours UI의 접근성 marker가 없다. 7요일 반복 행, disabled inputs, conditional lunch controls는 label/aria-describedby/error association이 필요하다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:206; docs/decisions/LOCATION_LEGAL_PLAN.md:212",
      "impact": "폼이 커지는 만큼 a11y regression이 생길 수 있다."
    },
    {
      "id": "LL-24",
      "finding": "변수 화이트리스트 외 키 detection 시점이 `템플릿 빌드`인지 `server action 저장`인지 혼재되어 있다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:272; docs/decisions/LOCATION_LEGAL_PLAN.md:373",
      "impact": "테스트가 build-time unit test와 runtime action test 중 어디에 걸려야 하는지 불명확하다."
    },
    {
      "id": "LL-25",
      "finding": "LL-DEFER marker는 10개로 정리되어 있으나 본문 비범위 표에는 LL-DEFER-08~10이 처음부터 함께 보이지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:50; docs/decisions/LOCATION_LEGAL_PLAN.md:391",
      "impact": "cycle 추적 시 deferred scope가 §1과 §9 사이에서 다르게 읽힌다."
    }
  ],
  "convergenceSignal": "cycle1 기준으로 SoT 충돌과 schema/workflow 결함이 모두 남아 있어 수렴 전 단계다. 특히 C-21 관계 모델, REVIEW_WORKFLOW review-queued 연결, CT-02 BusinessHours 표현을 먼저 닫아야 한다.",
  "nextCycleFocus": "v0.2에서는 C-21 출력 매핑표(parentClinic/locations 포함), admin/ARCH §3.8.1 CTA 상속 결정, LegalDocument review-queued/ComplianceRecord/NotificationEvent 정책, CT-02 호환 BusinessHours 저장 형식을 우선 패치해야 한다."
}
