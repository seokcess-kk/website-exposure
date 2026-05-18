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
