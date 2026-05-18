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
session id: 019e2f75-2522-71d2-8b82-3a76384a31f2
--------
user
# LOCATION_LEGAL_PLAN v0.4 — codex 자동 비평 cycle 4

당신은 신중한 senior reviewer. v0.3 cycle3 10 findings 가 v0.4 patch 에서 전건 수용되었는지 + 새로 생긴 cascade 결함 + 회귀 여부 + closeableAfterPatch 도달 가능성을 평가하라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.4 (cycle1 25 + cycle2 12 + cycle3 10 = 47 findings 전건 수용 누계)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인):
  - `packages/core-content/migrations/C0001`/`C0002`/`C0004`/`C0005` · `packages/migrations-runner/src/index.ts`
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts`

## cycle3 → v0.4 patch 요약

| ID | patch |
|---|---|
| LL-38 | Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function (`clinic_profile_primary_ctas_validate`) |
| LL-39 | FormData dotted key 회귀 → flat underscore (`legalDocEffective_<documentType>`) + `extractLegalDocEffectiveOverrides()` parser helper |
| LL-40 | CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required |
| LL-41 | LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 |
| LL-42 | LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 |
| LL-43 | audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18) |
| LL-44 | `MainLocationMissingError` named class + errors.ts 별도 분기 |
| LL-45 | LL-ACTION-08 vs LL-SCHEMA-12 충돌 해소 — build-time reference 통일 |
| LL-46 | 자동 재렌더링 운영자 알림 (form (d) 상단 안내문 LL-FORM-15) |
| LL-47 | LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed) |

## 검토 관점

### 1. cycle3 patch 수용 정합

- LL-38~LL-47 각 patch 본문 반영 + 의도된 효과 충족.
- patch 가 cycle1·2 patch (LL-01~LL-37) 의 결정을 회귀시키지 않았는지.

### 2. LL-38 trigger 구현 정합

- `clinic_profile_primary_ctas_validate()` plpgsql function 의 IMMUTABLE 마킹 — `jsonb_typeof`, `jsonb_array_elements` 가 stability 분류상 IMMUTABLE 인가? STABLE 이라면 wrap function 도 STABLE 이어야 마이그레이션이 통과한다. CREATE FUNCTION 의 LANGUAGE plpgsql 함수가 IMMUTABLE 선언 시 의도와 일치하지 않을 가능성?
- `BEFORE INSERT OR UPDATE OF primary_ctas` trigger — UPDATE OF 절은 PostgreSQL에서 column list 가능하지만 `OR` 분리 사용은 syntax 변형. 정확한 문법은 `BEFORE INSERT OR UPDATE OF column ON table`?
- ERRCODE = 'check_violation' — application 단 errors.ts 매핑이 가능 (mapDbErrorToResult 가 check_violation 23514 처리)?

### 3. LL-39 FormData parser

- `extractLegalDocEffectiveOverrides(formData)` helper — 구현 위치 (apps/web/src/lib/clinic-profile-schema.ts) 와 5종 closed key enum 정합?
- helper 가 Record<DocumentType, string | undefined> 반환 — zod 안 `record(z.enum([5종]), z.string().optional())` 의 partial 처리 — 미입력 key 의 record 안 키 부재 vs undefined 명시 처리 차이?
- form 안 name attribute (`<input name="legalDocEffective_privacy">`) 만 명시되어 있는데, 5 record 의 default value (현재 effective_date 또는 policy_effective_date) 가 input value 로 prefill 되는 시점/방법 명시 부재?

### 4. LL-40 CT-03 SoT 정렬

- type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) — DATA_MODEL CT-03 v0.x 의 실제 enum 정의와 일치 확인 필요. plan 본문 의 enum 정의 (`phone, email, kakao-talk, kakao-channel, naver-reservation, naver-talk, line, whatsapp ...`) 가 SoT 그대로?
- targetUrl required (cycle3 LL-40) — phone type 의 `targetUrl` 은 `tel:+82-...` URI scheme? SoT 가 phone type 의 targetUrl 형식을 명시하는지?
- DB trigger 안 elem ->> 'id' = string 검증 — DATA_MODEL CT-03 의 `@id` 가 plan 안 'id' 로 alias. alias 결정의 명시? Git 출력 시 '@id' 변환 책임자 (apps/worker · LL-CASCADE-04)?

### 5. LL-41 LL-CASCADE-04 책임 명시

- LL-CASCADE-04 가 ADMIN_UI_SKELETON_PLAN § 6 build/export 영역 — 그 § 6 본문이 현재 존재하는가? 또는 신설?
- apps/worker · M0 v1.0 build/export 함수의 시그니처 / 인터페이스 정의 — 본 plan v0.4 안 명시 부재 (cascade marker 만)?

### 6. LL-42 LL-CASCADE-05 migrations-runner

- `packages/migrations-runner` 가 placeholder 상태 — acceptance precondition 으로 sequential apply 보장 / depends_on manifest 구현이 정확히 어디 (어느 PR / cycle) 합류?
- v0.4 acceptance 시 packages/migrations-runner 가 미구현이어도 plan 자체는 acceptance? 또는 plan acceptance 차단 (cascade-precondition 의 강도)?

### 7. LL-43 3단계 안전망

- Sentry SDK 통합이 LL-DEFER-18 → M0 v1.0 본 구현. v0.4 단계에서 Sentry 미통합 — 그 사이 fallback 채널 (stdout 만? 별도 log file?) 명시?
- 3단계 안전망의 (3) "Sentry capture + 사용자 return state 는 ok: true 유지" — audit 누락에 대한 운영팀 인지 채널이 Sentry 만으로 충분? slack 알림 (notifications Feature cascade) marker 부재?

### 8. LL-44 MainLocationMissingError

- `MainLocationMissingError` — 신설 named Error class. apps/web/src/lib/errors.ts 안 export?
- 기존 `TenantResolveError` / `AuthDeniedError` 와 같은 패턴 (constructor + name property)?
- 향후 동일 패턴 (다른 invariant 검증 실패) 을 위해 일반화된 base class (`SkeletonInvariantError`)?

### 9. LL-45 build-time reference 통일

- LL-ACTION-08 (DB 안 marker 만) 과 LL-SCHEMA-12 (build-time deep clone) 의 통일된 표현 — 더 이상 충돌 없는가?
- LL-SCHEMA-18 의 표현 "build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone)" — 한 문장 안 reference 와 deep clone 양쪽 사용 — 같은 의미인지 명시?

### 10. LL-46 운영자 알림

- LL-FORM-15 안내문 위치 (form (d) 상단) — UI 의 (c) 정책 변수 섹션 변경 시도 알림 위치? (c) 안에도 동일 안내?
- "본문 직접 수정은 추후 단계에서 합류합니다" — 운영자가 직접 수정 시도 시 차단 메시지? 현재 v0.4 단계에서 LegalDocument body 가 UI 에서 노출 안 됨 (form 에 body 입력 없음) — 충돌 없음 확인?

### 11. LL-47 phase 그룹화

- 9.1 M0 v1.0 합류: LL-DEFER-01·09·11·15·18.
- 9.2 M1 Phase Alpha: LL-DEFER-02·03·06·07·10·12·13·16.
- 9.3 M2 Phase Beta: LL-DEFER-04·05.
- 9.4 Migration / 운영: LL-DEFER-14·17.
- 9.5 Closed: LL-DEFER-08.
- 총 17 개 marker — phase 별 분류 정합? M0 v1.0 의 LL-DEFER-18 (Sentry) 가 INFRA INFR-PROV provider 통합과 정합 (Spike B 단계 통합)?

### 12. 잔존 / 회귀 / closeable 신호

- cycle3 의 LL-37 (migration 의존성) 는 v0.4 의 LL-CASCADE-05 (packages/migrations-runner manifest) 로 보강. 잔존?
- audit shape: 7 row + content-saved-partial/failed = 최대 9 row. Plan v1.0 단일 emit shape 와 같이 가는 SoT?
- v0.4 단계에서 acceptance 신호 (closeableAfterPatch=true) 가능한가? 만약 1~2 minor 만 잔존이면 cycle5 에서 close 신호 가능?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 4,
  "closeableAfterPatch": false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10. cycle4 5~8 findings 예상. closeableAfterPatch 신호 cycle5 도달 기대.
codex
`seo-geo` skill is listed for search optimization, but this is a local plan review, so I’m proceeding with direct document/code inspection. I’ll first locate the plan sections and the referenced SoT lines, then compare the v0.4 patch claims against the actual text.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-3[8-9]|LL-4[0-7]|clinic_profile_primary_ctas_validate|extractLegalDocEffectiveOverrides|LL-CASCADE-04|LL-CASCADE-05|LL-DEFER|MainLocationMissingError|LL-FORM-15|primary_ctas|legalDocEffective|targetUrl|content-saved-partial|content-saved-failed|closeable" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CT-03|primary_ctas|reservationChannels|targetUrl|kakao|naver|whatsapp|line|@id|id" docs/core/DATA_MODEL.md docs/admin/ARCHITECTURE.md docs/admin/ADMIN_UI_SKELETON_PLAN.md docs/admin/REVIEW_WORKFLOW.md docs/core/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "check_violation|23514|mapDbErrorToResult|TenantResolveError|AuthDeniedError|MainLocationMissingError|save-result|FormData|clinic-profile-schema|legalDocEffective|primary_ctas" apps packages docs -g "*.ts" -g "*.md"' in C:\Users\assag\solution\website-exposure
2026-05-16T06:24:40.827036Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.9 seconds
Total output lines: 224
Output:
docs/admin/ARCHITECTURE.md:204:| `@id` | `"main"` |
docs/admin/ARCHITECTURE.md:206:| `parentClinic` | ClinicProfile의 `@id` |
docs/admin/ARCHITECTURE.md:213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
docs/admin/ARCHITECTURE.md:217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
docs/admin/ARCHITECTURE.md:225:| `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
docs/admin/ARCHITECTURE.md:258:| 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
docs/core/CONTENT_STANDARDS.md:53:| Article.headline | 1~120자 |
docs/core/CONTENT_STANDARDS.md:211:  - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
docs/core/CONTENT_STANDARDS.md:215:### 3.6 임베디드 미디어 (VideoObject 등)
docs/core/CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
docs/core/CONTENT_STANDARDS.md:354:- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)
docs/core/CONTENT_STANDARDS.md:368:  contentRef: string;                 // 대상 콘텐츠 @id
docs/core/CONTENT_STANDARDS.md:374:    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
docs/core/CONTENT_STANDARDS.md:412:  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
docs/core/CONTENT_STANDARDS.md:419:- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
docs/core/CONTENT_STANDARDS.md:481:  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
docs/core/CONTENT_STANDARDS.md:490:  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
docs/core/CONTENT_STANDARDS.md:508:  id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
docs/core/CONTENT_STANDARDS.md:527:  id: string;
docs/core/CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs/core/CONTENT_STANDARDS.md:643:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
docs/core/CONTENT_STANDARDS.md:644:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs/core/CONTENT_STANDARDS.md:646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
docs/admin/REVIEW_WORKFLOW.md:142:| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
docs/admin/REVIEW_WORKFLOW.md:182:  - 의료법 개정 (`medical-law-revision-<id>`)
docs/admin/REVIEW_WORKFLOW.md:212:riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
docs/admin/REVIEW_WORKFLOW.md:253:- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
docs/admin/REVIEW_WORKFLOW.md:254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
docs/admin/REVIEW_WORKFLOW.md:255:- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)
docs/admin/REVIEW_WORKFLOW.md:268:| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
docs/admin/REVIEW_WORKFLOW.md:290:| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
docs/admin/REVIEW_WORKFLOW.md:315:| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
docs/admin/REVIEW_WORKFLOW.md:372:- 입력: 콘텐츠 @id
docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin/REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:581:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin/REVIEW_WORKFLOW.md:583:  contentRef: string;                                  // 대상 콘텐츠 @id
docs/admin/REVIEW_WORKFLOW.md:586:  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
docs/admin/REVIEW_WORKFLOW.md:592:  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
docs/admin/REVIEW_WORKFLOW.md:611:#### 9.2.1 idempotency 계약
docs/admin/REVIEW_WORKFLOW.md:638:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
docs/admin/REVIEW_WORKFLOW.md:644:  id: string;                 // UUID
docs/admin/REVIEW_WORKFLOW.md:688:  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
docs/admin/REVIEW_WORKFLOW.md:693:  | "content-migration-plan-validated"        // plan 검증
docs/admin/REVIEW_WORKFLOW.md:759:> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:7:> **목적**: 의료법(제56조·제57조)·시행령·의료광고심의 운영규정에 대한 실무 해석, 금지 항목 카탈로그(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격·한의 회색지대 운영 가이드, 인용 가능 외부 도메인 화이트리스트의 단일 SoT.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:19:- **본 문서가 단일 SoT**: (1) 의료법 조문 인용·해석 (제56조·제57조·시행령 제23조·제24조), (2) 의료법 금지 항목과 RiskRule.id의 **법령→룰 매핑** (표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4. 본 문서는 법령 조문과 룰 ID의 연결 매핑만), (3) 사전심의 대상·면제 사유 판정 가이드, (4) 환자 후기·전후사진·가격 운영 가이드, (5) 한의 회색지대 가이드, (6) 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:22:- **데이터 파일과의 관계**: 본 문서 = 사람 가독 SoT, `data/compliance-rules/rules.medical-ad.yaml` = 기계 처리 SoT. 양자는 RiskRule.id로 1:1 또는 1:N 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:24:  - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyword>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:25:  - 본 문서·`rules.medical-ad.yaml`은 RiskRule.id로 1:N 매핑 — 1개 법령 호에 여러 RiskRule 가능, 1개 RiskRule이 여러 법령 호 참조 가능 (§ 3 각 절의 RiskRule은 `legalBasis[]`로 복수 조문 인용)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:50:| 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:119:| **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:137:## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:195:- **자동 검출**: inlineRiskFlag `includes-before-after` (`RISK_LEVELS.md` § 2.4)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:199:- **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:383:- inlineRiskFlag `includes-before-after` 검출 시 자동 High (`RISK_LEVELS.md` § 2.4)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:458:| `khidi.or.kr` | 한국보건산업진흥원 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:509:- 본 § 9 카테고리를 RiskRule로 변환 + override
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:585:| MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.medical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:606:| 2026-05-14 | v0.1 | 최초 작성 — 의료법 제56조·제57조 해석, 금지 항목 카탈로그 11종(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격 운영 가이드, 인용 가능 외부 도메인 화이트리스트 3계열(학회·정부·국제 학술), 한의 특유 표현 회색지대, 다국어 표현 가이드, 의료법 개정 이력 추적 표 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:607:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 3.12 외국인환자 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-keyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskRule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CONTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSON Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
docs/compliance/RISK_LEVELS.md:7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
docs/compliance/RISK_LEVELS.md:20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
docs/compliance/RISK_LEVELS.md:22:- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
docs/compliance/RISK_LEVELS.md:25:- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)
docs/compliance/RISK_LEVELS.md:69:  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
docs/compliance/RISK_LEVELS.md:71:  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
docs/compliance/RISK_LEVELS.md:86:3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
docs/compliance/RISK_LEVELS.md:101:    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
docs/compliance/RISK_LEVELS.md:111:### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)
docs/compliance/RISK_LEVELS.md:113:| InlineRiskFlag | 격상 등급 | 의미 |
docs/compliance/RISK_LEVELS.md:165:  - id: "supremacy-001"
docs/compliance/RISK_LEVELS.md:177:  - id: "guarantee-composite-001"
docs/compliance/RISK_LEVELS.md:203:| `id` 중복 (전체 파일 합집합) | **fail** |
docs/compliance/RISK_LEVELS.md:204:| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
docs/compliance/RISK_LEVELS.md:250:| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
docs/…2880 tokens truncated…연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
docs/core/DATA_MODEL.md:19:- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
docs/core/DATA_MODEL.md:21:- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:82:| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
docs/core/DATA_MODEL.md:89:| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
docs/core/DATA_MODEL.md:93:| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |
docs/core/DATA_MODEL.md:95:### 2.3 식별자(`@id`) 규약
docs/core/DATA_MODEL.md:116:| validation 강화 | 케이스별 |
docs/core/DATA_MODEL.md:117:| validation 완화 | PATCH |
docs/core/DATA_MODEL.md:134:| `@id` | `Slug` | ✅ | 지표 식별자 |
docs/core/DATA_MODEL.md:141:| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
docs/core/DATA_MODEL.md:142:| `evidenceNote` | `string` | optional | 증빙 설명 |
docs/core/DATA_MODEL.md:147:- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
docs/core/DATA_MODEL.md:160:| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
docs/core/DATA_MODEL.md:169:| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
docs/core/DATA_MODEL.md:178:| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
docs/core/DATA_MODEL.md:189:### CT-03. `CTAConfig` — 전환 채널 설정
docs/core/DATA_MODEL.md:195:| `@id` | `Slug` | ✅ | 채널 식별자 |
docs/core/DATA_MODEL.md:196:| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
docs/core/DATA_MODEL.md:198:| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
docs/core/DATA_MODEL.md:202:| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:219:| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
docs/core/DATA_MODEL.md:288:| `naverBlog` | `URL` | optional | |
docs/core/DATA_MODEL.md:291:| `kakao` | `URL` | optional | |
docs/core/DATA_MODEL.md:316:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:375:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:395:| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
docs/core/DATA_MODEL.md:401:| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
docs/core/DATA_MODEL.md:404:| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
docs/core/DATA_MODEL.md:419:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:437:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:445:| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
docs/core/DATA_MODEL.md:447:#### `EvidenceNote` (v0.4 신규)
docs/core/DATA_MODEL.md:456:#### `SlotRiskOverride`
docs/core/DATA_MODEL.md:459:| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
docs/core/DATA_MODEL.md:467:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:468:| `headline` | `string` | ✅ | 1~120자 |
docs/core/DATA_MODEL.md:481:| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
docs/core/DATA_MODEL.md:493:| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
docs/core/DATA_MODEL.md:512:| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
docs/core/DATA_MODEL.md:580:| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
docs/core/DATA_MODEL.md:582:| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
docs/core/DATA_MODEL.md:583:| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
docs/core/DATA_MODEL.md:587:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
docs/core/DATA_MODEL.md:604:#### `RobotsOverride` (v0.11 신규)
docs/core/DATA_MODEL.md:617:| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
docs/core/DATA_MODEL.md:618:| `clsOverride` | `number` | optional | CLS budget 강화 override |
docs/core/DATA_MODEL.md:619:| `tbtMsOverride` | `number` | optional | |
docs/core/DATA_MODEL.md:620:| `bundleSizeKbOverride` | `number` | optional | |
docs/core/DATA_MODEL.md:621:| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
docs/core/DATA_MODEL.md:622:| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
docs/core/DATA_MODEL.md:623:| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
docs/core/DATA_MODEL.md:624:| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |
docs/core/DATA_MODEL.md:630:| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
docs/core/DATA_MODEL.md:648:| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
docs/core/DATA_MODEL.md:658:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core/DATA_MODEL.md:659:| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |
docs/core/DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs/core/DATA_MODEL.md:706:| `id` | string | ✅ | integration 식별자 (instance scope unique) |
docs/core/DATA_MODEL.md:707:| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
docs/core/DATA_MODEL.md:708:| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
docs/core/DATA_MODEL.md:709:| `apiUrl` | URL | ✅ | provider endpoint |
docs/core/DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs/core/DATA_MODEL.md:716:| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
docs/core/DATA_MODEL.md:742:| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
docs/core/DATA_MODEL.md:767:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:771:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
docs/core/DATA_MODEL.md:774:| `inlineRiskFlags` | `string[]` | optional | |
docs/core/DATA_MODEL.md:806:| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
docs/core/DATA_MODEL.md:853:| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
docs/core/DATA_MODEL.md:884:| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
docs/core/DATA_MODEL.md:894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
docs/core/DATA_MODEL.md:904:| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:917:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:922:| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
docs/core/DATA_MODEL.md:942:필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
docs/core/DATA_MODEL.md:954:필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
docs/core/DATA_MODEL.md:957:필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
docs/core/DATA_MODEL.md:965:| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
docs/core/DATA_MODEL.md:970:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
docs/core/DATA_MODEL.md:986:| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
docs/core/DATA_MODEL.md:993:| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
docs/core/DATA_MODEL.md:1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1027:   ├─ cta → CTAConfig (CT-03)
docs/core/DATA_MODEL.md:1028:   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
docs/core/DATA_MODEL.md:1059:| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
docs/core/DATA_MODEL.md:1063:| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
docs/core/DATA_MODEL.md:1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1095:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
docs/core/DATA_MODEL.md:1096:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
docs/core/DATA_MODEL.md:1097:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs/core/DATA_MODEL.md:1101:| 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
docs/core/DATA_MODEL.md:1107:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
docs/core/DATA_MODEL.md:1108:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/admin/ADMIN_UI_SKELETON_PLAN.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 1909ms:
docs/admin/ARCHITECTURE.md:204:| `@id` | `"main"` |
docs/admin/ARCHITECTURE.md:206:| `parentClinic` | ClinicProfile의 `@id` |
docs/admin/ARCHITECTURE.md:213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
docs/admin/ARCHITECTURE.md:217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
docs/admin/ARCHITECTURE.md:225:| `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
docs/admin/ARCHITECTURE.md:258:| 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
docs/core/CONTENT_STANDARDS.md:53:| Article.headline | 1~120자 |
docs/core/CONTENT_STANDARDS.md:211:  - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
docs/core/CONTENT_STANDARDS.md:215:### 3.6 임베디드 미디어 (VideoObject 등)
docs/core/CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
docs/core/CONTENT_STANDARDS.md:354:- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)
docs/core/CONTENT_STANDARDS.md:368:  contentRef: string;                 // 대상 콘텐츠 @id
docs/core/CONTENT_STANDARDS.md:374:    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
docs/core/CONTENT_STANDARDS.md:412:  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
docs/core/CONTENT_STANDARDS.md:419:- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
docs/core/CONTENT_STANDARDS.md:481:  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
docs/core/CONTENT_STANDARDS.md:490:  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
docs/core/CONTENT_STANDARDS.md:508:  id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
docs/core/CONTENT_STANDARDS.md:527:  id: string;
docs/core/CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs/core/CONTENT_STANDARDS.md:643:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
docs/core/CONTENT_STANDARDS.md:644:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs/core/CONTENT_STANDARDS.md:646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
docs/admin/REVIEW_WORKFLOW.md:142:| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
docs/admin/REVIEW_WORKFLOW.md:182:  - 의료법 개정 (`medical-law-revision-<id>`)
docs/admin/REVIEW_WORKFLOW.md:212:riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
docs/admin/REVIEW_WORKFLOW.md:253:- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
docs/admin/REVIEW_WORKFLOW.md:254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
docs/admin/REVIEW_WORKFLOW.md:255:- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)
docs/admin/REVIEW_WORKFLOW.md:268:| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
docs/admin/REVIEW_WORKFLOW.md:290:| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
docs/admin/REVIEW_WORKFLOW.md:315:| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
docs/admin/REVIEW_WORKFLOW.md:372:- 입력: 콘텐츠 @id
docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin/REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:581:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin/REVIEW_WORKFLOW.md:583:  contentRef: string;                                  // 대상 콘텐츠 @id
docs/admin/REVIEW_WORKFLOW.md:586:  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
docs/admin/REVIEW_WORKFLOW.md:592:  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
docs/admin/REVIEW_WORKFLOW.md:611:#### 9.2.1 idempotency 계약
docs/admin/REVIEW_WORKFLOW.md:638:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
docs/admin/REVIEW_WORKFLOW.md:644:  id: string;                 // UUID
docs/admin/REVIEW_WORKFLOW.md:688:  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
docs/admin/REVIEW_WORKFLOW.md:693:  | "content-migration-plan-validated"        // plan 검증
docs/admin/REVIEW_WORKFLOW.md:759:> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:7:> **목적**: 의료법(제56조·제57조)·시행령·의료광고심의 운영규정에 대한 실무 해석, 금지 항목 카탈로그(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격·한의 회색지대 운영 가이드, 인용 가능 외부 도메인 화이트리스트의 단일 SoT.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:19:- **본 문서가 단일 SoT**: (1) 의료법 조문 인용·해석 (제56조·제57조·시행령 제23조·제24조), (2) 의료법 금지 항목과 RiskRule.id의 **법령→룰 매핑** (표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4. 본 문서는 법령 조문과 룰 ID의 연결 매핑만), (3) 사전심의 대상·면제 사유 판정 가이드, (4) 환자 후기·전후사진·가격 운영 가이드, (5) 한의 회색지대 가이드, (6) 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:22:- **데이터 파일과의 관계**: 본 문서 = 사람 가독 SoT, `data/compliance-rules/rules.medical-ad.yaml` = 기계 처리 SoT. 양자는 RiskRule.id로 1:1 또는 1:N 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:24:  - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyword>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:25:  - 본 문서·`rules.medical-ad.yaml`은 RiskRule.id로 1:N 매핑 — 1개 법령 호에 여러 RiskRule 가능, 1개 RiskRule이 여러 법령 호 참조 가능 (§ 3 각 절의 RiskRule은 `legalBasis[]`로 복수 조문 인용)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:50:| 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:119:| **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:137:## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:195:- **자동 검출**: inlineRiskFlag `includes-before-after` (`RISK_LEVELS.md` § 2.4)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:199:- **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:383:- inlineRiskFlag `includes-before-after` 검출 시 자동 High (`RISK_LEVELS.md` § 2.4)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:458:| `khidi.or.kr` | 한국보건산업진흥원 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:509:- 본 § 9 카테고리를 RiskRule로 변환 + override
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:585:| MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.medical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:606:| 2026-05-14 | v0.1 | 최초 작성 — 의료법 제56조·제57조 해석, 금지 항목 카탈로그 11종(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격 운영 가이드, 인용 가능 외부 도메인 화이트리스트 3계열(학회·정부·국제 학술), 한의 특유 표현 회색지대, 다국어 표현 가이드, 의료법 개정 이력 추적 표 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:607:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 3.12 외국인환자 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-keyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskRule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CONTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSON Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
docs/compliance/RISK_LEVELS.md:7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
docs/compliance/RISK_LEVELS.md:20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
docs/compliance/RISK_LEVELS.md:22:- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
docs/compliance/RISK_LEVELS.md:25:- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)
docs/compliance/RISK_LEVELS.md:69:  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
docs/compliance/RISK_LEVELS.md:71:  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
docs/compliance/RISK_LEVELS.md:86:3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
docs/compliance/RISK_LEVELS.md:101:    source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
docs/compliance/RISK_LEVELS.md:111:### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)
docs/compliance/RISK_LEVELS.md:113:| InlineRiskFlag | 격상 등급 | 의미 |
docs/compliance/RISK_LEVELS.md:165:  - id: "supremacy-001"
docs/compliance/RISK_LEVELS.md:177:  - id: "guarantee-composite-001"
docs/compliance/RISK_LEVELS.md:203:| `id` 중복 (전체 파일 합집합) | **fail** |
docs/compliance/RISK_LEVELS.md:204:| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
docs/compliance/RISK_LEVELS.md:250:| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
docs/compliance/RISK_LEVELS.md:251:| `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
docs/compliance/RISK_LEVELS.md:257:| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
docs/compliance/RISK_LEVELS.md:263:**overrides·meta·medical-law-tracking**
docs/compliance/RISK_LEVELS.md:266:| `overrides[].targetRuleId` 미존재 (다른 파일에 정의된 ID 참조) | **fail** |
docs/compliance/RISK_LEVELS.md:267:| `overrides[].patch` 객체에 enum/타입 위반 (deep merge 결과 기준) | **fail** |
docs/compliance/RISK_LEVELS.md:268:| 동일 `targetRuleId`에 대한 override 카탈로그 전체에서 2개 이상 | **fail** |
docs/compliance/RISK_LEVELS.md:299:- 동일 `id` 중복 시 빌드 fail
docs/compliance/RISK_LEVELS.md:300:- preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 가능
docs/compliance/RISK_LEVELS.md:335:#### 3.4.2 `overrides[]` 스키마·머지 규칙
docs/compliance/RISK_LEVELS.md:339:overrides:
docs/compliance/RISK_LEVELS.md:357:4. 결과는 새 RiskRule으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉션에 존재
docs/compliance/RISK_LEVELS.md:360:- override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본 비활성화 (별도 deprecation)
docs/compliance/RISK_LEVELS.md:361:- 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견 시 빌드 **fail** (last-wins 정책 없음)
docs/compliance/RISK_LEVELS.md:373:  - id: "safety-medical-consult-001"
docs/compliance/RISK_LEVELS.md:379:      ruleIds: []                            # 또는 특정 RiskRule.id 명시 (1개 이상). 둘 중 1개 이상 필수
docs/compliance/RISK_LEVELS.md:416:- TreatmentPage의 `treatmentComponents[]`·`visitFlow[]`·`evidenceNotes[]` 변경 (의학 정보 영역)
docs/compliance/RISK_LEVELS.md:494:## 5. inlineRiskFlags 자동 추출 — DM-05 영역
docs/compliance/RISK_LEVELS.md:499:- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
docs/compliance/RISK_LEVELS.md:500:- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
docs/compliance/RISK_LEVELS.md:521:단어 매칭만으로 inlineRiskFlag 격상이 false-positive를 만들 수 있다. **콘텐츠 타입·필드 단위**의 정밀한 제외 규칙:
docs/compliance/RISK_LEVELS.md:532:- 위 외 컨텍스트에서는 단일 발생만으로 격상. evidence는 항상 기록 (검수자 판단용)
docs/compliance/RISK_LEVELS.md:533:- 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
docs/compliance/RISK_LEVELS.md:534:- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화
docs/compliance/RISK_LEVELS.md:539:type InlineRiskExtractionResult = {
docs/compliance/RISK_LEVELS.md:540:  inlineRiskFlags: InlineRiskFlag[];
docs/compliance/RISK_LEVELS.md:541:  evidence: {
docs/compliance/RISK_LEVELS.md:542:    [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
docs/compliance/RISK_LEVELS.md:547:- 어드민 검수 UI는 `evidence`를 사용해 본문 위치를 하이라이트
docs/compliance/RISK_LEVELS.md:577:- `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)
docs/compliance/RISK_LEVELS.md:578:- `explicitRiskLevel` override (어드민 명시 입력)
docs/compliance/RISK_LEVELS.md:580:**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).
docs/compliance/RISK_LEVELS.md:591:  requiredApproverRoles: ["medical"]            // 기본값. ArticleType별 override (§ 6.2)
docs/compliance/RISK_LEVELS.md:595:### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override
docs/compliance/RISK_LEVELS.md:664:- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
docs/compliance/RISK_LEVELS.md:696:| RL-06 | inlineRiskFlag 추출 알고리즘의 정확도 운영 지표 (precision/recall) 측정·운영 | M2+ 운영 누적 후 |
docs/compliance/RISK_LEVELS.md:704:| ~~RL-02~~ | `overrides[]` 섹션의 정확한 머지 알고리즘 | v0.2 — § 3.4.2 명세. 스칼라/객체/배열별 머지 규칙 + 동일 targetRuleId 카탈로그 1개 제약 명시 |
docs/compliance/RISK_LEVELS.md:712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
docs/compliance/RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
docs/compliance/RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
docs/compliance/RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
docs/compliance/RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
docs/compliance/RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
docs/core/DATA_MODEL.md:19:- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
docs/core/DATA_MODEL.md:21:- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:82:| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
docs/core/DATA_MODEL.md:89:| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
docs/core/DATA_MODEL.md:93:| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |
docs/core/DATA_MODEL.md:95:### 2.3 식별자(`@id`) 규약
docs/core/DATA_MODEL.md:116:| validation 강화 | 케이스별 |
docs/core/DATA_MODEL.md:117:| validation 완화 | PATCH |
docs/core/DATA_MODEL.md:134:| `@id` | `Slug` | ✅ | 지표 식별자 |
docs/core/DATA_MODEL.md:141:| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
docs/core/DATA_MODEL.md:142:| `evidenceNote` | `string` | optional | 증빙 설명 |
docs/core/DATA_MODEL.md:147:- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
docs/core/DATA_MODEL.md:160:| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
docs/core/DATA_MODEL.md:169:| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
docs/core/DATA_MODEL.md:178:| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
docs/core/DATA_MODEL.md:189:### CT-03. `CTAConfig` — 전환 채널 설정
docs/core/DATA_MODEL.md:195:| `@id` | `Slug` | ✅ | 채널 식별자 |
docs/core/DATA_MODEL.md:196:| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
docs/core/DATA_MODEL.md:198:| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
docs/core/DATA_MODEL.md:202:| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:219:| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
docs/core/DATA_MODEL.md:288:| `naverBlog` | `URL` | optional | |
docs/core/DATA_MODEL.md:291:| `kakao` | `URL` | optional | |
docs/core/DATA_MODEL.md:316:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:375:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:395:| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
docs/core/DATA_MODEL.md:401:| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
docs/core/DATA_MODEL.md:404:| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
docs/core/DATA_MODEL.md:419:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:437:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:445:| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
docs/core/DATA_MODEL.md:447:#### `EvidenceNote` (v0.4 신규)
docs/core/DATA_MODEL.md:456:#### `SlotRiskOverride`
docs/core/DATA_MODEL.md:459:| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
docs/core/DATA_MODEL.md:467:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:468:| `headline` | `string` | ✅ | 1~120자 |
docs/core/DATA_MODEL.md:481:| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
docs/core/DATA_MODEL.md:493:| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
docs/core/DATA_MODEL.md:512:| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
docs/core/DATA_MODEL.md:580:| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
docs/core/DATA_MODEL.md:582:| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
docs/core/DATA_MODEL.md:583:| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
docs/core/DATA_MODEL.md:587:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
docs/core/DATA_MODEL.md:604:#### `RobotsOverride` (v0.11 신규)
docs/core/DATA_MODEL.md:617:| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
docs/core/DATA_MODEL.md:618:| `clsOverride` | `number` | optional | CLS budget 강화 override |
docs/core/DATA_MODEL.md:619:| `tbtMsOverride` | `number` | optional | |
docs/core/DATA_MODEL.md:620:| `bundleSizeKbOverride` | `number` | optional | |
docs/core/DATA_MODEL.md:621:| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
docs/core/DATA_MODEL.md:622:| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
docs/core/DATA_MODEL.md:623:| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
docs/core/DATA_MODEL.md:624:| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |
docs/core/DATA_MODEL.md:630:| `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
docs/core/DATA_MODEL.md:648:| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
docs/core/DATA_MODEL.md:658:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core/DATA_MODEL.md:659:| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |
docs/core/DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs/core/DATA_MODEL.md:706:| `id` | string | ✅ | integration 식별자 (instance scope unique) |
docs/core/DATA_MODEL.md:707:| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
docs/core/DATA_MODEL.md:708:| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
docs/core/DATA_MODEL.md:709:| `apiUrl` | URL | ✅ | provider endpoint |
docs/core/DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs/core/DATA_MODEL.md:716:| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
docs/core/DATA_MODEL.md:742:| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
docs/core/DATA_MODEL.md:767:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:771:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
docs/core/DATA_MODEL.md:774:| `inlineRiskFlags` | `string[]` | optional | |
docs/core/DATA_MODEL.md:806:| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
docs/core/DATA_MODEL.md:853:| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
docs/core/DATA_MODEL.md:884:| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
docs/core/DATA_MODEL.md:894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
docs/core/DATA_MODEL.md:904:| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:917:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:922:| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
docs/core/DATA_MODEL.md:942:필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
docs/core/DATA_MODEL.md:954:필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
docs/core/DATA_MODEL.md:957:필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
docs/core/DATA_MODEL.md:965:| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
docs/core/DATA_MODEL.md:970:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
docs/core/DATA_MODEL.md:986:| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
docs/core/DATA_MODEL.md:993:| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
docs/core/DATA_MODEL.md:1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1027:   ├─ cta → CTAConfig (CT-03)
docs/core/DATA_MODEL.md:1028:   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
docs/core/DATA_MODEL.md:1059:| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
docs/core/DATA_MODEL.md:1063:| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
docs/core/DATA_MODEL.md:1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1095:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
docs/core/DATA_MODEL.md:1096:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
docs/core/DATA_MODEL.md:1097:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs/core/DATA_MODEL.md:1101:| 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
docs/core/DATA_MODEL.md:1107:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
docs/core/DATA_MODEL.md:1108:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/admin/ADMIN_UI_SKELETON_PLAN.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 1916ms:
3:> **상태**: **v0.4 (draft)** — Codex 자동 비평 cycle1 25 + cycle2 12 + cycle3 10 = **누계 47 findings** 전건 수용 patch. cycle4 진입 전. (수렴 추세 25→12→10 · closeable 임박)
9:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
42:| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
48:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
55:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
56:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
57:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
59:| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
60:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
61:| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
62:| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
63:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
64:| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
66:| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
67:| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
68:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
69:| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
70:| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
121:  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
143:- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
144:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
145:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
148:- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
161:  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
173:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
174:    jsonb_typeof(primary_ctas) = 'array'
177:-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → IMMUTABLE helper function + CHECK 또는 trigger 둘 중 후자 선택.
179:-- cycle3 LL-40 patch: CT-03 SoT 정렬 — DATA_MODEL CT-03 의 enum (kakao-talk, kakao-channel, naver-reservation, naver-talk, phone, email, line, whatsapp 등) + required targetUrl
180:CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
191:  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
192:    RAISE EXCEPTION 'primary_ctas must be a JSON array' USING ERRCODE = 'check_violation';
194:  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
197:      RAISE EXCEPTION 'primary_ctas element missing id' USING ERRCODE = 'check_violation';
200:      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type' USING ERRCODE = 'check_violation';
203:      RAISE EXCEPTION 'primary_ctas element missing label' USING ERRCODE = 'check_violation';
205:    -- cycle3 LL-40 patch: targetUrl required (CT-03 SoT)
206:    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
207:      RAISE EXCEPTION 'primary_ctas element missing targetUrl' USING ERRCODE = 'check_violation';
214:CREATE TRIGGER clinic_profile_primary_ctas_trigger
215:  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
216:  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
222:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
223:- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT 정렬 minimal**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. type enum 6종 (DATA_MODEL CT-03 정합): `phone` · `email` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk`. **DB 검증 = trigger (CHECK subquery 불가)** + form zod 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
241:-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
249:-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
255:- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
279:  "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
280:  // v0.2 미입력 — LL-DEFER-05
287:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
288:- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
289:- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
299:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal: phone/kakao/naver-booking) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
306:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
310:- (LL-FORM-08 · cycle1 LL-02 patch) primaryCtas UI: 3종 type 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속.
318:- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
319:  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
320:  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
321:  - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
335:  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
350:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
352:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
354:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
410:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 patch) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
412:  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
413:  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
414:  - **3단계 안전망 (cycle3 LL-43)**: (1) per-row try/catch + console.error → server stdout / Sentry breadcrumb. (2) partial/failed row INSERT 시도 → 실패해도 server log. (3) partial/failed row INSERT 자체 실패 시 Sentry capture (INFRA INFR-PROV `Sentry` Provider · v0.4 marker — Sentry SDK 통합은 LL-DEFER-18) + 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 별도 marker).
417:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
429:  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` → fieldErrors.primaryCtas
467:- (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
474:- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
487:  7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
526:## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)
530:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
531:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
532:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
533:- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
534:- `LL-DEFER-18` (cycle3 LL-43 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. M0 v1.0 본 구현 (provider 통합 시점).
538:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
539:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
540:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
541:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
542:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
543:- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
544:- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
545:- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
549:- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override).
550:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점).
554:- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
555:- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
559:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
563:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
566:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
568:- `LL-CASCADE-04` (cycle3 LL-41 patch): `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 6 build/export 영역 — **apps/worker · M0 v1.0 Git export 책임**: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과. apps/worker (M0 v1.0 본 구현) 의 build/export 함수 명시. **acceptance precondition** (책임자 명시 정도, 실 구현은 M0 v1.0).
569:- `LL-CASCADE-05` (cycle3 LL-42 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장 구현. 현재 placeholder. **acceptance precondition** (구현 정도, plan 안 명시: 본 plan v1.0 의 8단계 의존성을 manifest 로 표현 + runner 가 위반 시 fail-fast).
576:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
577:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
578:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2031ms:
packages\auth\src\session.ts:7:import { AuthDeniedError } from "./errors.js";
packages\auth\src\session.ts:67:  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
packages\auth\src\session.ts:73:  if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found");
packages\auth\src\session.ts:75:  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("session-expired", "session expired");
packages\auth\src\session.ts:82:  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
packages\auth\src\session.ts:89:  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
packages\auth\src\session.ts:102:  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
packages\auth\src\resolve-tenant-context.ts:7:import { TenantResolveError, AuthDeniedError } from "./errors.js";
packages\auth\src\resolve-tenant-context.ts:36:  if (typeof value !== "string") throw new TenantResolveError("invalid-instance-id", "requestedInstanceId not string");
packages\auth\src\resolve-tenant-context.ts:37:  if (value.length !== 36) throw new TenantResolveError("invalid-instance-id", `UUID length must be 36, got ${value.length}`);
packages\auth\src\resolve-tenant-context.ts:38:  if (!UUID_V4_REGEX.test(value)) throw new TenantResolveError("invalid-instance-id", `malformed UUID`);
packages\auth\src\resolve-tenant-context.ts:65:    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
packages\auth\src\resolve-tenant-context.ts:71:    if (err instanceof AuthDeniedError) {
packages\auth\src\resolve-tenant-context.ts:72:      // 동일 reason 유지·TenantResolveError로 변환
packages\auth\src\resolve-tenant-context.ts:73:      throw new TenantResolveError(err.reason, err.message);
packages\auth\src\resolve-tenant-context.ts:75:    throw new TenantResolveError("session-not-found", "session invalid");
packages\auth\src\resolve-tenant-context.ts:84:    throw new TenantResolveError("session-not-found", "user not found");
packages\auth\src\resolve-tenant-context.ts:89:    throw new TenantResolveError("user-inactive", "user inactive");
packages\auth\src\resolve-tenant-context.ts:103:      throw new TenantResolveError("super-admin-required", "super-admin must switch instance first");
packages\auth\src\resolve-tenant-context.ts:113:      throw new TenantResolveError("instance-mismatch", "super-admin selected != requested");
packages\auth\src\resolve-tenant-context.ts:129:      throw new TenantResolveError("membership-not-found", "no active membership");
packages\auth\src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
packages\auth\src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
packages\auth\src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
packages\auth\src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
packages\auth\src\magic-link.ts:7:import { AuthDeniedError } from "./errors.js";
packages\auth\src\magic-link.ts:27:  if (typeof input !== "string") throw new AuthDeniedError("magic-link-invalid", `identifier must be string`);
packages\auth\src\magic-link.ts:30:    throw new AuthDeniedError("magic-link-invalid", `identifier length invalid`);
packages\auth\src\magic-link.ts:34:    throw new AuthDeniedError("magic-link-invalid", `invalid email format`);
packages\auth\src\magic-link.ts:80:  if (lookup.length === 0) throw new AuthDeniedError("magic-link-not-found", "magic link not found");
packages\auth\src\magic-link.ts:82:  if (row.consumed_at !== null) throw new AuthDeniedError("magic-link-consumed", "magic link already consumed");
packages\auth\src\magic-link.ts:83:  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("magic-link-expired", "magic link expired");
packages\auth\src\magic-link.ts:84:  throw new AuthDeniedError("magic-link-invalid", "magic link CAS failed");
packages\auth\src\internal\session-internal.ts:8:import { AuthDeniedError } from "../errors.js";
packages\auth\src\internal\session-internal.ts:34:    if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found for switch");
packages\auth\src\index.ts:7:export { AuthDeniedError, TenantResolveError } from "./errors.js";
packages\auth\src\errors.ts:25:export class AuthDeniedError extends AppError {
packages\auth\src\errors.ts:28:  override readonly name = "AuthDeniedError";
packages\auth\src\errors.ts:34:export class TenantResolveError extends AppError {
packages\auth\src\errors.ts:37:  override readonly name = "TenantResolveError";
docs\decisions\LOCATION_LEGAL_PLAN.md:24:  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
docs\decisions\LOCATION_LEGAL_PLAN.md:42:| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
docs\decisions\LOCATION_LEGAL_PLAN.md:161:  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
docs\decisions\LOCATION_LEGAL_PLAN.md:173:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
docs\decisions\LOCATION_LEGAL_PLAN.md:174:    jsonb_typeof(primary_ctas) = 'array'
docs\decisions\LOCATION_LEGAL_PLAN.md:180:CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
docs\decisions\LOCATION_LEGAL_PLAN.md:191:  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
docs\decisions\LOCATION_LEGAL_PLAN.md:192:    RAISE EXCEPTION 'primary_ctas must be a JSON array' USING ERRCODE = 'check_violation';
docs\decisions\LOCATION_LEGAL_PLAN.md:194:  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
docs\decisions\LOCATION_LEGAL_PLAN.md:197:      RAISE EXCEPTION 'primary_ctas element missing id' USING ERRCODE = 'check_violation';
docs\decisions\LOCATION_LEGAL_PLAN.md:200:      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type' USING ERRCODE = 'check_violation';
docs\decisions\LOCATION_LEGAL_PLAN.md:203:      RAISE EXCEPTION 'primary_ctas element missing label' USING ERRCODE = 'check_violation';
docs\decisions\LOCATION_LEGAL_PLAN.md:207:      RAISE EXCEPTION 'primary_ctas element missing targetUrl' USING ERRCODE = 'check_violation';
docs\decisions\LOCATION_LEGAL_PLAN.md:214:CREATE TRIGGER clinic_profile_primary_ctas_trigger
docs\decisions\LOCATION_LEGAL_PLAN.md:215:  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
docs\decisions\LOCATION_LEGAL_PLAN.md:216:  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
docs\decisions\LOCATION_LEGAL_PLAN.md:223:- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT 정렬 minimal**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. type enum 6종 (DATA_MODEL CT-03 정합): `phone` · `email` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk`. **DB 검증 = trigger (CHECK subquery 불가)** + form zod 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
docs\decisions\LOCATION_LEGAL_PLAN.md:279:  "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
docs\decisions\LOCATION_LEGAL_PLAN.md:288:- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
docs\decisions\LOCATION_LEGAL_PLAN.md:299:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal: phone/kakao/naver-booking) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
docs\decisions\LOCATION_LEGAL_PLAN.md:310:- (LL-FORM-08 · cycle1 LL-02 patch) primaryCtas UI: 3종 type 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속.
docs\decisions\LOCATION_LEGAL_PLAN.md:314:- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
docs\decisions\LOCATION_LEGAL_PLAN.md:318:- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
docs\decisions\LOCATION_LEGAL_PLAN.md:319:  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
docs\decisions\LOCATION_LEGAL_PLAN.md:320:  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
docs\decisions\LOCATION_LEGAL_PLAN.md:321:  - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
docs\decisions\LOCATION_LEGAL_PLAN.md:352:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs\decisions\LOCATION_LEGAL_PLAN.md:354:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
docs\decisions\LOCATION_LEGAL_PLAN.md:421:- ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
docs\decisions\LOCATION_LEGAL_PLAN.md:422:- 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 patch — 후속 책임/액션/시점 명시):
docs\decisions\LOCATION_LEGAL_PLAN.md:429:  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` → fieldErrors.primaryCtas
docs\decisions\LOCATION_LEGAL_PLAN.md:487:  7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
docs\decisions\LOCATION_LEGAL_PLAN.md:517:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs\decisions\LOCATION_LEGAL_PLAN.md:520:| 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
docs\decisions\LOCATION_LEGAL_PLAN.md:568:- `LL-CASCADE-04` (cycle3 LL-41 patch): `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 6 build/export 영역 — **apps/worker · M0 v1.0 Git export 책임**: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과. apps/worker (M0 v1.0 본 구현) 의 build/export 함수 명시. **acceptance precondition** (책임자 명시 정도, 실 구현은 M0 v1.0).
docs\decisions\LOCATION_LEGAL_PLAN.md:576:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs\decisions\LOCATION_LEGAL_PLAN.md:577:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:578:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:173:       catch (AuthDeniedError e) → emit 'magic-link-rejected' + reason → redirect /sign-in?reason=<r>
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:215:     } catch (AuthDeniedError e) {
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:322:> - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:439:export async function saveClinicProfile(instanceSlug: string, prev: State, formData: FormData) {
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:618:8. FormData hidden `instance_id` 변조 → ctx.instanceId override · 변조값 무시.
apps\web\src\lib\action-context.ts:7:  AuthDeniedError,
apps\web\src\lib\action-context.ts:41:    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
apps\web\src\lib\save-result.ts:1:// @glitzy/web/lib/save-result — Server Action 공통 결과 타입
apps\web\src\lib\page-context.ts:7:  AuthDeniedError,
apps\web\src\lib\page-context.ts:10:  TenantResolveError,
apps\web\src\lib\page-context.ts:33: *   - tenant resolve / eligibility deny: TenantResolveError throw (caller 가 catch 후 forbidden/info 렌더링)
apps\web\src\lib\page-context.ts:50:    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
apps\web\src\lib\page-context.ts:68:    if (err instanceof TenantResolveError) {
apps\web\src\lib\errors.ts:44: * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
apps\web\src\lib\errors.ts:46:export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
apps\web\src\lib\errors.ts:52:  if (code !== "23514" && code !== "23505" && code !== "23503") return null;
apps\web\src\lib\errors.ts:63:  if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
apps\web\src\lib\errors.ts:69:  const result = mapDbErrorToResult(err);
packages\auth\dist\index.d.ts:4:export { AuthDeniedError, TenantResolveError } from "./errors.js";
packages\auth\dist\errors.d.ts:3:export declare class AuthDeniedError extends AppError {
packages\auth\dist\errors.d.ts:7:    readonly name = "AuthDeniedError";
packages\auth\dist\errors.d.ts:10:export declare class TenantResolveError extends AppError {
packages\auth\dist\errors.d.ts:14:    readonly name = "TenantResolveError";
apps\spike-e\src\errors.ts:17:export class AuthDeniedError extends Error {
apps\spike-e\src\errors.ts:18:  override readonly name = "AuthDeniedError";
apps\spike-e\src\errors.ts:24:export class TenantResolveError extends Error {
apps\spike-e\src\errors.ts:25:  override readonly name = "TenantResolveError";
apps\spike-e\src\magic-link.ts:10:import { AuthDeniedError } from "./errors.js";
apps\spike-e\src\magic-link.ts:29:  if (typeof input !== "string") throw new AuthDeniedError("magic-link-invalid", `identifier must be string`);
apps\spike-e\src\magic-link.ts:32:    throw new AuthDeniedError("magic-link-invalid", `identifier length invalid`);
apps\spike-e\src\magic-link.ts:36:    throw new AuthDeniedError("magic-link-invalid", `invalid email format`);
apps\spike-e\src\magic-link.ts:80:  if (lookup.length === 0) throw new AuthDeniedError("magic-link-not-found", "magic link not found");
apps\spike-e\src\magic-link.ts:82:  if (row.consumed_at !== null) throw new AuthDeniedError("magic-link-consumed", "magic link already consumed");
apps\spike-e\src\magic-link.ts:83:  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("magic-link-expired", "magic link expired");
apps\spike-e\src\magic-link.ts:84:  throw new AuthDeniedError("magic-link-invalid", "magic link CAS failed");
apps\web\src\app\sign-in\actions.ts:10:import { AuthDeniedError, emitAuditEvent, issueMagicLink, normalizeIdentifier } from "@glitzy/auth";
apps\web\src\app\sign-in\actions.ts:19:export async function issueMagicLinkAction(formData: FormData): Promise<void> {
apps\web\src\app\sign-in\actions.ts:32:    if (err instanceof AuthDeniedError) {
apps\spike-e\src\resolve-tenant-context.ts:12:import { TenantResolveError } from "./errors.js";
apps\spike-e\src\resolve-tenant-context.ts:51:  if (typeof value !== "string") throw new TenantResolveError("instance-mismatch", "requestedInstanceId not string");
apps\spike-e\src\resolve-tenant-context.ts:52:  if (value.length !== 36) throw new TenantResolveError("instance-mismatch", `UUID length must be 36, got ${value.length}`);
apps\spike-e\src\resolve-tenant-context.ts:53:  if (!UUID_REGEX.test(value)) throw new TenantResolveError("instance-mismatch", `malformed UUID`);
apps\spike-e\src\resolve-tenant-context.ts:83:    throw new TenantResolveError("session-not-found", "session invalid");
apps\spike-e\src\resolve-tenant-context.ts:92:    throw new TenantResolveError("session-not-found", "user not found");
apps\spike-e\src\resolve-tenant-context.ts:97:    throw new TenantResolveError("user-inactive", "user inactive");
apps\spike-e\src\resolve-tenant-context.ts:111:      throw new TenantResolveError("super-admin-required", "super-admin must switch instance first");
apps\spike-e\src\resolve-tenant-context.ts:121:      throw new TenantResolveError("instance-mismatch", "super-admin selected != requested");
apps\spike-e\src\resolve-tenant-context.ts:137:      throw new TenantResolveError("membership-not-found", "no active membership");
apps\spike-e\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:148:      throw new TenantResolveError("legal-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:152:      throw new TenantResolveError("legal-reviewer-ineligible", "client-approver role requires eligibility flag");
apps\spike-e\src\resolve-tenant-context.ts:237:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
apps\spike-e\src\resolve-tenant-context.ts:243:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
apps\spike-e\src\resolve-tenant-context.ts:248:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires client_approver_eligible`);
apps\spike-e\src\resolve-tenant-context.ts:254:      throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires operator/super-admin role`);
apps\web\src\app\sign-out\route.ts:7:  AuthDeniedError,
apps\web\src\app\sign-out\route.ts:35:      denyReason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
apps\web\src\app\api\site-meta-fetch\route.ts:11:  AuthDeniedError,
apps\web\src\app\api\site-meta-fetch\route.ts:16:  TenantResolveError,
apps\web\src\app\api\site-meta-fetch\route.ts:79:    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
apps\web\src\app\api\site-meta-fetch\route.ts:117:    const reason = err instanceof TenantResolveError ? err.reason : "tenant-resolve-failed";
apps\web\src\app\api\site-meta-fetch\route.ts:129:    const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
apps\web\src\app\sign-in\cleanup\route.ts:3:// AuthDeniedError(session-*) 발생 시 이 route 로 redirect → cookie clear + audit emit + sign-in redirect
apps\spike-e\src\session.ts:9:import { AuthDeniedError } from "./errors.js";
apps\spike-e\src\session.ts:56:  if (opaque === null) throw new AuthDeniedError("session-not-found", "session signature invalid");
apps\spike-e\src\session.ts:62:  if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found");
apps\spike-e\src\session.ts:64:  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("session-expired", "session expired");
apps\spike-e\src\session.ts:96:    if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found for switch");
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:15:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:17:import type { SaveResult } from "@/lib/save-result";
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:83:  formData: FormData,
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:207:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:212:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:262:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:270:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\sign-in\consume\route.ts:9:  AuthDeniedError,
apps\web\src\app\sign-in\consume\route.ts:61:    if (err instanceof AuthDeniedError) {
apps\web\src\app\sign-in\consume\route.ts:104:    if (err instanceof AuthDeniedError) {
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:10:  AuthDeniedError,
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:14:  TenantResolveError,
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:114:  formData: FormData,
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:137:    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:166:      // upsert — instance_id 는 ctx.instanceId 강제 (ADMIN-UI-11 — FormData 변조 무시)
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:240:    // cycle1-code WEB-09: TenantResolveError reason 별 분기 — 403 성격은 formError, session 성격은 cleanup
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:241:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:17:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:22:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:24:import type { SaveResult } from "@/lib/save-result";
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:86:  formData: FormData,
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:176:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:181:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:261:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:268:    const mapped = mapDbErrorToResult(err);
apps\spike-e\src\scenarios\test-action-eligibility.ts:6:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-action-eligibility.ts:34:        if (err instanceof TenantResolveError) rejected = true;
apps\spike-e\src\scenarios\test-action-eligibility.ts:63:        if (err instanceof TenantResolveError) rejected = true;
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:11:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:16:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:18:import type { SaveResult } from "@/lib/save-result";
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:45:  // cycle5-3entity WEB-53: enum value mismatch (FormData 변조) 도 한국어 메시지
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:75:  formData: FormData,
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:170:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:175:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:227:    if (err instanceof TenantResolveError) {
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:234:    const mapped = mapDbErrorToResult(err);
apps\spike-e\src\scenarios\test-client-tampering.ts:7:import { TenantResolveError, AuthDeniedError } from "../errors.js";
apps\spike-e\src\scenarios\test-client-tampering.ts:32:        if (err instanceof TenantResolveError && err.reason === "session-not-found") rejected = true;
apps\spike-e\src\scenarios\test-client-tampering.ts:45:      if (err instanceof AuthDeniedError && err.reason === "session-not-found") revokedRejected = true;
apps\spike-e\src\scenarios\test-inactive-user.ts:6:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-inactive-user.ts:27:      if (err instanceof TenantResolveError && err.reason === "user-inactive") rejected = true;
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:6:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:34:        if (err instanceof TenantResolveError && err.reason === "instance-mismatch") rejected = true;
apps\spike-e\src\scenarios\test-invariant.ts:2:// 모든 cross-instance resolve가 정확히 TenantResolveError로 reject·self resolve가 정확히 성공·audit count 정합
apps\spike-e\src\scenarios\test-invariant.ts:10:import { TenantResolveError, InvariantViolationError } from "../errors.js";
apps\spike-e\src\scenarios\test-invariant.ts:65:        if (err instanceof TenantResolveError && err.reason === "membership-not-found") crossDenied += 1;
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:6:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:22:      if (err instanceof TenantResolveError && err.reason === "legal-reviewer-ineligible") rejected = true;
apps\spike-e\src\scenarios\test-magic-link-login.ts:6:import { AuthDeniedError } from "../errors.js";
apps\spike-e\src\scenarios\test-magic-link-login.ts:26:      if (err instanceof AuthDeniedError && err.reason === "magic-link-consumed") replayCaught = true;
apps\spike-e\src\scenarios\test-magic-link-login.ts:34:      if (err instanceof AuthDeniedError && err.reason === "magic-link-not-found") invalidCaught = true;
apps\spike-e\src\scenarios\test-magic-link-login.ts:44:      if (err instanceof AuthDeniedError && err.reason === "magic-link-expired") expiredCaught = true;
apps\spike-e\src\scenarios\test-magic-link-login.ts:61:      if (err instanceof AuthDeniedError && err.reason === "session-not-found") tamperCaught = true;
apps\spike-e\src\scenarios\test-membership-removal.ts:7:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-membership-removal.ts:36:      if (err instanceof TenantResolveError && err.reason === "membership-not-found") rejected = true;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:8:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-super-admin-switch.ts:20:      if (err instanceof TenantResolveError && err.reason === "super-admin-required") pre = true;
apps\spike-e\src\scenarios\test-super-admin-switch.ts:53:      if (err instanceof TenantResolveError && err.reason === "instance-mismatch") tampered = true;
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:6:import { TenantResolveError } from "../errors.js";
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:19:      if (err instanceof TenantResolveError && err.reason === "membership-not-found") rejected = true;
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
The first pass shows the cycle3 items are mostly present, but two areas are already suspicious: CT-03 was narrowed to 6 enum values while the current DATA_MODEL has a wider required enum, and the plan points to an admin skeleton section path that needs verification against the actual file. I’m checking exact line context now so findings can be grounded cleanly.
2026-05-16T06:25:01.339513Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..220){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..220){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 294..324){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 346..356){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 406..432){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..220){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 294..324){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 346..356){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 406..432){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 525..570){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure
2026-05-16T06:25:01.341059Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 294..324){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 346..356){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 406..432){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
2026-05-16T06:25:01.346036Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 525..570){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 525..570){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
2026-05-16T06:25:01.403606Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 884..904){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 884..904){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 884..904){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/ADMIN_UI_SKELETON_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 1..120){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; rg -n "''^## 6|build/export|Git export|reservationChannels|primary_ctas|content-saved-partial|content-saved-failed" docs/decisions/ADMIN_UI_SKELETON_PLAN.md' in C:\Users\assag\solution\website-exposure
2026-05-16T06:25:01.407843Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/ADMIN_UI_SKELETON_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 1..120){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; rg -n "''^## 6|build/export|Git export|reservationChannels|primary_ctas|content-saved-partial|content-saved-failed" docs/decisions/ADMIN_UI_SKELETON_PLAN.md'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/ADMIN_UI_SKELETON_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 1..120){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; rg -n "''^## 6|build/export|Git export|reservationChannels|primary_ctas|content-saved-partial|content-saved-failed" docs/decisions/ADMIN_UI_SKELETON_PLAN.md'` rejected: blocked by policy
2026-05-16T06:25:01.415292Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..80){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..80){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..80){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }'` rejected: blocked by policy
codex
The line-number extraction command was blocked by the local policy wrapper, so I’m switching to `rg` context-only reads. That gives enough evidence without touching the filesystem.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 8 "CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate|CREATE TRIGGER clinic_profile_primary_ctas_trigger|LL-SCHEMA-12" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 5 "LL-FORM-13|LL-FORM-15|LL-ACTION-08|LL-ACTION-18|LL-ACTION-21|clinic_profile_primary_ctas_array|clinic_profile_primary_ctas_shape" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "LL-DEFER-18|LL-CASCADE-04|LL-CASCADE-05|acceptance precondition|LL-DEFER-01|LL-DEFER-09|LL-DEFER-11|LL-DEFER-15" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "CT-03|CTAConfig|targetUrl|featuredChannelId|reservationChannels" docs/core/DATA_MODEL.md docs/admin/ARCHITECTURE.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^## 6|build/export|Git export|reservationChannels|primary_ctas|content-saved-partial|content-saved-failed|§ 6" docs/decisions/ADMIN_UI_SKELETON_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "check_violation|23514|mapDbErrorToResult|constraint|MainLocationMissingError|AuthDeniedError|TenantResolveError" apps/web/src/lib/errors.ts packages/auth/src/errors.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 2017ms:
168-  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
169-  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
170-    policy_contact_phone IS NULL
171-    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
172-  ),
173:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
174-    jsonb_typeof(primary_ctas) = 'array'
175-  );
176-
177--- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → IMMUTABLE helper function + CHECK 또는 trigger 둘 중 후자 선택.
178--- 결정: BEFORE INSERT/UPDATE trigger 가 매 row 검증 (helper function 의 IMMUTABLE 강제 회피 + 명시적 raise + 자세한 에러 메시지).
--
250--- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
251-```
252-
253-**결정**:
254-- (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
255:- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
256-- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
257-
258-```jsonc
259-// location_profile.metadata
260-{
--
313-
314-- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
315-- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
316-- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
317-- (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
318:- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
319-  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
320-  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
321-  - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.
322-  - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
323-  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
--
345-**결정**:
346-- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
347-- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
348-- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
349-- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
350:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
351-- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
352:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
353-- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
354:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
355-
356-### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
357-
358-```typescript
359-// packages/core-content/src/templates/render.ts
--
405-                                              "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
406-// ... terms, non-covered, refund, complaint
407-```
408-
409-**결정**:
410:- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 patch) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
411-  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
412-  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
413-  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
414-  - **3단계 안전망 (cycle3 LL-43)**: (1) per-row try/catch + console.error → server stdout / Sentry breadcrumb. (2) partial/failed row INSERT 시도 → 실패해도 server log. (3) partial/failed row INSERT 자체 실패 시 Sentry capture (INFRA INFR-PROV `Sentry` Provider · v0.4 marker — Sentry SDK 통합은 LL-DEFER-18) + 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 별도 marker).
415-  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
--
424-  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
425-  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
426-  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
427-  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
428-  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
429:  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` → fieldErrors.primaryCtas
430-  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
431-  - businessHours 는 application-level 검증 (DB CHECK 없음)
432-
433-## 5. Core 표준 템플릿 5종
434-
--
573-| 일자 | 버전 | 변경 |
574-|---|---|---|
575-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
576-| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
577-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
578:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2064ms:
5-본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
6-
7-> **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.
8-
9:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
10-
11-## SoT
12-
13-- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
--
51-### 1.3 비범위 (defer)
52-
53-| 항목 | Defer to | marker |
54-|---|---|---|
55:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
56:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
57:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
58-| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
59-| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
60-| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
61-| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
62-| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
63-| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
64-| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
65-| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
66:| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
67-| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
68:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
69-| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
70-| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
71-
72-## 2. 데이터 모델 결정
--
140-```
141-
142-**결정 사항**:
143-- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
144:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
145:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
146-- (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
147-- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
148-- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
149-
--
245-CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);
246-
247--- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
248--- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
249:-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
250--- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
251-```
252-
253-**결정**:
254-- (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
255:- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
256-- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
257-
258-```jsonc
259-// location_profile.metadata
--
331-
332-await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
333-  assertActionEligibility(ctx, "operator-edit-content");
334-  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
335:  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
336-
337-  // cycle1 LL-07 patch: 잠금 순서 결정적 — instance 안 모든 entity 동일 순서
338-  // (1) clinic_profile (FOR UPDATE) — UPSERT 한 번에 처리하므로 별도 SELECT 안 함
339-  // (2) location_profile main (FOR UPDATE) — UPSERT
--
348-- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
349-- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
350-- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
351-- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
352:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
353-- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
354:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
355-
356-### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
357-
358-```typescript
--
388-- (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
389-- (LL-ACTION-13) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
390-- (LL-ACTION-14) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
391-- (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
392:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
393-
394-### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)
395-
396-7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:
--
410-- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 patch) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
411-  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
412-  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
413-  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
414:  - **3단계 안전망 (cycle3 LL-43)**: (1) per-row try/catch + console.error → server stdout / Sentry breadcrumb. (2) partial/failed row INSERT 시도 → 실패해도 server log. (3) partial/failed row INSERT 자체 실패 시 Sentry capture (INFRA INFR-PROV `Sentry` Provider · v0.4 marker — Sentry SDK 통합은 LL-DEFER-18) + 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 별도 marker).
415-  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
416-  - M0 v1.0 transactional outbox cascade 시점에 envelope + at-least-once exactly-once observable 로 전환 (cycle 1 LL-17 marker 갱신).
417-- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
418-
--
526-## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)
527-
528-### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
529-
530:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
531:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
532:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
533:- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
534:- `LL-DEFER-18` (cycle3 LL-43 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. M0 v1.0 본 구현 (provider 통합 시점).
535-
536-### 9.2 M1 Phase Alpha 합류
537-
538-- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
--
559-- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
560-
561-## 10. Cascade marker (다른 SoT 문서로 전파)
562-
563:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
564-
565:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
566:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
567:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
568:- `LL-CASCADE-04` (cycle3 LL-41 patch): `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 6 build/export 영역 — **apps/worker · M0 v1.0 Git export 책임**: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과. apps/worker (M0 v1.0 본 구현) 의 build/export 함수 명시. **acceptance precondition** (책임자 명시 정도, 실 구현은 M0 v1.0).
569:- `LL-CASCADE-05` (cycle3 LL-42 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장 구현. 현재 placeholder. **acceptance precondition** (구현 정도, plan 안 명시: 본 plan v1.0 의 8단계 의존성을 manifest 로 표현 + runner 가 위반 시 fail-fast).
570-
571-## 변경 이력
572-
573-| 일자 | 버전 | 변경 |
574-|---|---|---|
575-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
576:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
577:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
578:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2126ms:
172-  ),
173-  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
174-    jsonb_typeof(primary_ctas) = 'array'
175-  );
176-
177--- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → IMMUTABLE helper function + CHECK 또는 trigger 둘 중 후자 선택.
178--- 결정: BEFORE INSERT/UPDATE trigger 가 매 row 검증 (helper function 의 IMMUTABLE 강제 회피 + 명시적 raise + 자세한 에러 메시지).
179--- cycle3 LL-40 patch: CT-03 SoT 정렬 — DATA_MODEL CT-03 의 enum (kakao-talk, kakao-channel, naver-reservation, naver-talk, phone, email, line, whatsapp 등) + required targetUrl
180:CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
181-RETURNS TRIGGER AS $$
182-DECLARE
183-  elem JSONB;
184-  valid_types CONSTANT TEXT[] := ARRAY[
185-    'phone', 'email',
186-    'kakao-talk', 'kakao-channel',
187-    'naver-reservation', 'naver-talk'
188-    -- 'line', 'whatsapp' 등 해외 채널은 M3 다국어 cascade (DM-14)
--
206-    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
207-      RAISE EXCEPTION 'primary_ctas element missing targetUrl' USING ERRCODE = 'check_violation';
208-    END IF;
209-  END LOOP;
210-  RETURN NEW;
211-END;
212-$$ LANGUAGE plpgsql IMMUTABLE;
213-
214:CREATE TRIGGER clinic_profile_primary_ctas_trigger
215-  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
216-  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
217-```
218-
219-**결정**:
220-- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
221-- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
222-- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
223:- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT 정렬 minimal**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. type enum 6종 (DATA_MODEL CT-03 정합): `phone` · `email` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk`. **DB 검증 = trigger (CHECK subquery 불가)** + form zod 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
224-
225-### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
226-
227-```sql
228--- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
229-
230--- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
231--- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
--
344-
345-**결정**:
346-- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
347-- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
348-- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
349-- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
350-- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
351-- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
352:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
353-- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
354-- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
355-
356-### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
357-
358-```typescript
359-// packages/core-content/src/templates/render.ts
360-
--
570-
571-## 변경 이력
572-
573-| 일자 | 버전 | 변경 |
574-|---|---|---|
575-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
576-| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
577-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
578:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2043ms:
118:│   │   │           └── actions.ts    — saveClinicProfile (bound action — § 6.2 ADMIN-UI-31)
404:## 6. ClinicProfile 폼 명세 (skeleton 범위)
703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2102ms:
apps/web/src/lib/errors.ts:1:// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
apps/web/src/lib/errors.ts:2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
apps/web/src/lib/errors.ts-3-
apps/web/src/lib/errors.ts-4-export type FieldErrors = Record<string, string[]>;
apps/web/src/lib/errors.ts-5-
apps/web/src/lib/errors.ts-6-type Mapping = { field: string | null; message: string };
apps/web/src/lib/errors.ts-7-
apps/web/src/lib/errors.ts:8:// constraint_name → field + 한국어 메시지
apps/web/src/lib/errors.ts-9-const CONSTRAINT_MAP: Record<string, Mapping> = {
apps/web/src/lib/errors.ts-10-  // ClinicProfile (C0001)
apps/web/src/lib/errors.ts-11-  clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
apps/web/src/lib/errors.ts-12-  clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
--
apps/web/src/lib/errors.ts-39-  | { kind: "field"; errors: FieldErrors }
apps/web/src/lib/errors.ts-40-  | { kind: "form"; message: string };
apps/web/src/lib/errors.ts-41-
apps/web/src/lib/errors.ts-42-/**
apps/web/src/lib/errors.ts:43: * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
apps/web/src/lib/errors.ts:44: * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
apps/web/src/lib/errors.ts-45- */
apps/web/src/lib/errors.ts:46:export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
apps/web/src/lib/errors.ts-47-  if (typeof err !== "object" || err === null) return null;
apps/web/src/lib/errors.ts:48:  const e = err as { code?: string; constraint_name?: string; constraint?: string };
apps/web/src/lib/errors.ts-49-  const code = e.code;
apps/web/src/lib/errors.ts:50:  const constraint = e.constraint_name ?? e.constraint;
apps/web/src/lib/errors.ts:51:  if (!code || !constraint) return null;
apps/web/src/lib/errors.ts:52:  if (code !== "23514" && code !== "23505" && code !== "23503") return null;
apps/web/src/lib/errors.ts-53-
apps/web/src/lib/errors.ts:54:  const mapping = CONSTRAINT_MAP[constraint];
apps/web/src/lib/errors.ts-55-  if (mapping) {
apps/web/src/lib/errors.ts-56-    if (mapping.field === null) return { kind: "form", message: mapping.message };
apps/web/src/lib/errors.ts-57-    return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
apps/web/src/lib/errors.ts-58-  }
apps/web/src/lib/errors.ts-59-
apps/web/src/lib/errors.ts:60:  // unknown constraint — generic
apps/web/src/lib/errors.ts-61-  if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
apps/web/src/lib/errors.ts-62-  if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
apps/web/src/lib/errors.ts:63:  if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
apps/web/src/lib/errors.ts-64-  return null;
apps/web/src/lib/errors.ts-65-}
apps/web/src/lib/errors.ts-66-
apps/web/src/lib/errors.ts-67-/** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
apps/web/src/lib/errors.ts-68-export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
apps/web/src/lib/errors.ts:69:  const result = mapDbErrorToResult(err);
apps/web/src/lib/errors.ts-70-  if (result === null) return null;
apps/web/src/lib/errors.ts-71-  if (result.kind === "field") return result.errors;
apps/web/src/lib/errors.ts-72-  return null;
apps/web/src/lib/errors.ts-73-}
--
packages/auth/src/errors.ts-21-  | "magic-link-consumed"
packages/auth/src/errors.ts-22-  | "magic-link-not-found"
packages/auth/src/errors.ts-23-  | "magic-link-invalid";
packages/auth/src/errors.ts-24-
packages/auth/src/errors.ts:25:export class AuthDeniedError extends AppError {
packages/auth/src/errors.ts-26-  override readonly code = "AUTH_DENIED";
packages/auth/src/errors.ts-27-  override readonly httpStatus = 403;
packages/auth/src/errors.ts:28:  override readonly name = "AuthDeniedError";
packages/auth/src/errors.ts-29-  constructor(public readonly reason: AuthDenyReason, message: string) {
packages/auth/src/errors.ts-30-    super(message, { reason });
packages/auth/src/errors.ts-31-  }
packages/auth/src/errors.ts-32-}
packages/auth/src/errors.ts-33-
packages/auth/src/errors.ts:34:export class TenantResolveError extends AppError {
packages/auth/src/errors.ts-35-  override readonly code = "TENANT_RESOLVE_DENIED";
packages/auth/src/errors.ts-36-  override readonly httpStatus = 403;
packages/auth/src/errors.ts:37:  override readonly name = "TenantResolveError";
packages/auth/src/errors.ts-38-  constructor(public readonly reason: AuthDenyReason, message: string) {
packages/auth/src/errors.ts-39-    super(message, { reason });
packages/auth/src/errors.ts-40-  }
packages/auth/src/errors.ts-41-}
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2117ms:
docs/admin/ARCHITECTURE.md-134-
docs/admin/ARCHITECTURE.md-135-| 계약 | 필수 필드 (Slice 최소) | 자동 생성 | 어드민 폼 위치 |
docs/admin/ARCHITECTURE.md-136-|---|---|:---:|---|
docs/admin/ARCHITECTURE.md-137-| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
docs/admin/ARCHITECTURE.md:138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
docs/admin/ARCHITECTURE.md-139-| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md-140-| `DoctorProfile` (C-02) | 이름·자격·전문분야·약력. (사진 선택) | | DoctorProfile 화면 |
docs/admin/ARCHITECTURE.md-141-| `TreatmentPage` (C-03) | 제목·개요·원리·대상·과정·주의사항 (M0 추가 필드 — `recommendedFor`·`treatmentComponents`·`visitFlow` 등은 선택) | | TreatmentPage 화면 |
docs/admin/ARCHITECTURE.md-142-| `Article` (C-04) | 제목·요약·본문·저자·발행일·카테고리·`articleType` | | Article 작성 화면 |
--
docs/admin/ARCHITECTURE.md-209-| `businessHours` | 폼의 "본원 진료시간·접수시간·점심·휴진" 입력값 |
docs/admin/ARCHITECTURE.md-210-| `representativeDoctors` | ClinicProfile에 등록된 대표 의료진 |
docs/admin/ARCHITECTURE.md-211-| `doctorsAtLocation` | 전체 의료진 (운영자가 추후 지정 가능) |
docs/admin/ARCHITECTURE.md-212-| `availableTreatments` | 전체 시술 (운영자가 추후 지정 가능) |
docs/admin/ARCHITECTURE.md:213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
docs/admin/ARCHITECTURE.md-214-
docs/admin/ARCHITECTURE.md-215-**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
docs/admin/ARCHITECTURE.md-216-
docs/admin/ARCHITECTURE.md-217-**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
--
docs/core/DATA_MODEL.md-15----
docs/core/DATA_MODEL.md-16-
docs/core/DATA_MODEL.md-17-## 0. 한 페이지 요약
docs/core/DATA_MODEL.md-18-
docs/core/DATA_MODEL.md:19:- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
docs/core/DATA_MODEL.md-20-- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
docs/core/DATA_MODEL.md-21-- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
docs/core/DATA_MODEL.md-22-- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
docs/core/DATA_MODEL.md-23-- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
--
docs/core/DATA_MODEL.md-61-| ID | 공통 타입 | 책임 | 소속 | 사용처 |
docs/core/DATA_MODEL.md-62-|---|---|---|:---:|---|
docs/core/DATA_MODEL.md-63-| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
docs/core/DATA_MODEL.md-64-| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md-66-
docs/core/DATA_MODEL.md-67----
docs/core/DATA_MODEL.md-68-
docs/core/DATA_MODEL.md-69-## 2. 공통 룰
--
docs/core/DATA_MODEL.md-185-| `date` | `Date` | ✅ | |
docs/core/DATA_MODEL.md-186-| `reason` | `string` | optional | |
docs/core/DATA_MODEL.md-187-| `note` | `string` | optional | |
docs/core/DATA_MODEL.md-188-
docs/core/DATA_MODEL.md:189:### CT-03. `CTAConfig` — 전환 채널 설정
docs/core/DATA_MODEL.md-190-
docs/core/DATA_MODEL.md-191-**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.
docs/core/DATA_MODEL.md-192-
docs/core/DATA_MODEL.md-193-| 필드 | 타입 | required | 설명 |
docs/core/DATA_MODEL.md-194-|---|---|:---:|---|
docs/core/DATA_MODEL.md-195-| `@id` | `Slug` | ✅ | 채널 식별자 |
docs/core/DATA_MODEL.md-196-| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
docs/core/DATA_MODEL.md-197-| `label` | `string` | ✅ | 버튼·링크 텍스트 |
docs/core/DATA_MODEL.md:198:| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
docs/core/DATA_MODEL.md-199-| `iconKey` | `string` | optional | 아이콘 식별자 |
docs/core/DATA_MODEL.md-200-| `style` | `enum {primary, secondary, minimal}` | optional | |
docs/core/DATA_MODEL.md-201-| `displayOrder` | `number` | optional | 정렬 |
docs/core/DATA_MODEL.md-202-| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
docs/core/DATA_MODEL.md-203-| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
docs/core/DATA_MODEL.md-204-| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
docs/core/DATA_MODEL.md-205-| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |
docs/core/DATA_MODEL.md-206-
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md-208-
docs/core/DATA_MODEL.md-209----
docs/core/DATA_MODEL.md-210-
docs/core/DATA_MODEL.md-211-## 4. 데이터 계약 풀명세 (M0 핵심)
--
docs/core/DATA_MODEL.md-235-| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
docs/core/DATA_MODEL.md-236-| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
docs/core/DATA_MODEL.md-237-| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
docs/core/DATA_MODEL.md-238-| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
docs/core/DATA_MODEL.md:239:| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
docs/core/DATA_MODEL.md-240-| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
docs/core/DATA_MODEL.md-241-| `logoUrl` | `URL` | ✅ | 로고 |
docs/core/DATA_MODEL.md-242-| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |
docs/core/DATA_MODEL.md-243-
--
docs/core/DATA_MODEL.md-400-| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
docs/core/DATA_MODEL.md-401-| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
docs/core/DATA_MODEL.md-402-| `heroImageUrl` | `URL` | optional | |
docs/core/DATA_MODEL.md-403-| `ogImageUrl` | `URL` | optional | |
docs/core/DATA_MODEL.md:404:| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
docs/core/DATA_MODEL.md-405-
docs/core/DATA_MODEL.md-406-**하위 타입**:
docs/core/DATA_MODEL.md-407-
docs/core/DATA_MODEL.md-408-#### `ProcessStep`
--
docs/core/DATA_MODEL.md-890-| `telephone` | `Phone` | ✅ | 지점 직통 |
docs/core/DATA_MODEL.md-891-| `fax` | `Phone` | optional | |
docs/core/DATA_MODEL.md-892-| `email` | `Email` | optional | 지점 이메일 |
docs/core/DATA_MODEL.md-893-| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
docs/core/DATA_MODEL.md:894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
docs/core/DATA_MODEL.md-895-| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
docs/core/DATA_MODEL.md-896-| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
docs/core/DATA_MODEL.md-897-| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
docs/core/DATA_MODEL.md-898-| `images` | `URL[]` | optional | |
--
docs/core/DATA_MODEL.md-900-| `parkingInfo` | `Markdown` | optional | |
docs/core/DATA_MODEL.md-901-| `openingDate` | `Date` | optional | 지점 개원일 |
docs/core/DATA_MODEL.md-902-| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
docs/core/DATA_MODEL.md-903-| `branchCode` | `string` | optional | |
docs/core/DATA_MODEL.md:904:| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
docs/core/DATA_MODEL.md-905-
docs/core/DATA_MODEL.md-906-> v0.4 → v0.6 강조 채널 표기 변천:
docs/core/DATA_MODEL.md:907:> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
docs/core/DATA_MODEL.md:908:> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md-910-
docs/core/DATA_MODEL.md-911-> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md-912-
docs/core/DATA_MODEL.md-913-### C-22. `ArticleCategory` — Article Pillar 분류
--
docs/core/DATA_MODEL.md-953-### C-19. `NewsItem`
docs/core/DATA_MODEL.md-954-필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
docs/core/DATA_MODEL.md-955-
docs/core/DATA_MODEL.md-956-### C-20. `ReservationPage`
docs/core/DATA_MODEL.md:957:필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
docs/core/DATA_MODEL.md-958-
docs/core/DATA_MODEL.md-959-### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
docs/core/DATA_MODEL.md-960-
docs/core/DATA_MODEL.md-961-**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.
--
docs/core/DATA_MODEL.md-1004-
docs/core/DATA_MODEL.md-1005-```
docs/core/DATA_MODEL.md-1006-ClinicProfile (C-01)
docs/core/DATA_MODEL.md-1007-   ├─ trustMetrics → TrustMetric[] (CT-01)
docs/core/DATA_MODEL.md:1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md-1009-   ├─ medicalSpecialty → MedicalSpecialty (C-14)
docs/core/DATA_MODEL.md-1010-   ├─ affiliatedInstitutes → ResearchInstitute
docs/core/DATA_MODEL.md-1011-   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
docs/core/DATA_MODEL.md-1012-
docs/core/DATA_MODEL.md-1013-LocationProfile (C-21) — 위치·시간·연락 SoT
docs/core/DATA_MODEL.md-1014-   ├─ businessHours → BusinessHours (CT-02)
docs/core/DATA_MODEL.md:1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md-1016-   ├─ parentClinic → ClinicProfile (C-01)
docs/core/DATA_MODEL.md-1017-   ├─ representativeDoctors → DoctorProfile[]
docs/core/DATA_MODEL.md-1018-   ├─ doctorsAtLocation → DoctorProfile[]
docs/core/DATA_MODEL.md-1019-   └─ availableTreatments → TreatmentPage[]
--
docs/core/DATA_MODEL.md-1023-   ├─ additionalLocations → LocationProfile[]
docs/core/DATA_MODEL.md-1024-   └─ trustMetrics → TrustMetric[] (CT-01)
docs/core/DATA_MODEL.md-1025-
docs/core/DATA_MODEL.md-1026-TreatmentPage (C-03)
docs/core/DATA_MODEL.md:1027:   ├─ cta → CTAConfig (CT-03)
docs/core/DATA_MODEL.md-1028-   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
docs/core/DATA_MODEL.md-1029-   ├─ relatedDoctors → DoctorProfile[]
docs/core/DATA_MODEL.md-1030-   ├─ relatedConditions → MedicalConditionPage[]
docs/core/DATA_MODEL.md-1031-   └─ pageRiskLevel → RiskLevel (직접 enum)
--
docs/core/DATA_MODEL.md-1068-| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
docs/core/DATA_MODEL.md-1069-| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
docs/core/DATA_MODEL.md-1070-| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
docs/core/DATA_MODEL.md-1071-| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
docs/core/DATA_MODEL.md:1072:| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
docs/core/DATA_MODEL.md-1073-| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
docs/core/DATA_MODEL.md-1074-| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
docs/core/DATA_MODEL.md-1075-| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
docs/core/DATA_MODEL.md-1076-| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
--
docs/core/DATA_MODEL.md-1083-| 일자 | 버전 | 변경 |
docs/core/DATA_MODEL.md-1084-|---|---|---|
docs/core/DATA_MODEL.md-1085-| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
docs/core/DATA_MODEL.md-1086-| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
docs/core/DATA_MODEL.md:1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
docs/core/DATA_MODEL.md-1088-| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md-1091-| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs/core/DATA_MODEL.md-1092-| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
docs/core/DATA_MODEL.md-1093-| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
docs/core/DATA_MODEL.md-1094-| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "TODO|placeholder|depends_on|migration|C000|D0010|apply|sequential" packages/migrations-runner/src/index.ts packages/core-content/migrations -g "*"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"export|worker|build|Git|ADMIN-UI-15|ADMIN-UI-31|content-saved|audit matrix|5\\.5|transactional outbox|ClinicProfile 폼\" docs/decisions/ADMIN_UI_SKELETON_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/web/src/lib apps/web/src/app | rg "clinic-profile-schema|clinic-profile|errors.ts"' in C:\Users\assag\solution\website-exposure
 succeeded in 1453ms:
5:본 문서는 Phase 0 Week 4 **apps/web walking skeleton** 의 plan이다. 1호 클라이언트 출시 가능 시점(M0 Vertical Slice) 6 화면 중 **첫 3 화면**(로그인 · 대시보드 · ClinicProfile 폼)을 처음부터 끝까지 관통시켜 인증 · tenant resolve · RLS · 폼 저장의 전 구간을 동작시키는 것이 목표.
7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
49:| `/[instanceSlug]/clinic-profile` | ClinicProfile 폼 · 저장 = upsert · 2단계 패턴 · audit | 저장 결과 표시 |
53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
58:| 미리보기 · 발행 화면 + Git commit/push/CI | M0 v1.0 + apps/worker |
83:> **Onboarding URL scrape (코드 cycle7 사용자 피드백 — 운영자 UX 개선)**: ClinicProfile 폼 상단에 "사이트 URL 자동 분석" 섹션 추가. `apps/web/src/lib/site-meta-fetch.ts` + `/api/site-meta-fetch` Route Handler. 외부 사이트 HTML fetch (10s timeout · 5MB limit · SSRF private IP/localhost 거부 · http/https only · text/html only) + cheerio 로 og:title · og:description · og:image · favicon · theme-color 추출 후 비어 있는 필드만 prefill (운영자 입력값 보존). audit_event `site-meta-fetched` / `site-meta-fetch-failed` 기록. 인증된 운영자만 호출 가능 (cookie + getActiveSession). 의존성 cheerio ^1.0.0 추가.
87:> **M0 v1.0 3 entity forms (DoctorProfile · TreatmentPage · Article · 사용자 피드백)**: ClinicProfile 폼 패턴 복제. 목록 + 신규 + 편집 페이지. core-content schema 의 모든 필드 + status enum (content_publication_status 9종) + risk_level enum (Low/Medium/High) + Article author FK (DoctorProfile composite FK). 핵심 결정 — (a) `published_at` 정책: 발행 상태일 때만 NOT NULL, unpublish 시 NULL reset (CHECK 정합) — last-known publication timestamp 보존 정책은 M2 cascade marker, (b) `content-saved` audit payload shape 통일: `{contentType, slug, mode, status (Doctor 는 null), originalSlug}` · before/after diff 는 M0 v1.0 cascade marker (transactional outbox 도입 시점), (c) Doctor 삭제 시 Article 참조 사전 확인 (ON DELETE NO ACTION · application layer 처리), (d) admin surface 페이지 (목록/신규/상세) 도 `assertActionEligibility(operator-edit-content)` 강제, (e) `requirePageContext` 공통 helper · `isNextControlFlowError` rethrow · `DeleteForm` client component · `mapDbErrorToResult` 통합 entity constraint mapping. **추가 결정 (cycle2-3entity)**: (f) skeleton scope 의 status workflow 권한: 운영자가 모든 9 state 전환 가능 — REVIEW_WORKFLOW 의 14 ActionType (operator-publish/reviewer-approve 등) 분리 적용은 M0 v1.0 cascade marker, (g) delete 0건은 inline `formError` 로 처리 (skeleton 정책 · M0 v1.0 에서 notFound() rethrow 로 일관화 검토), (h) Article author server-side 검증: same-instance + active 또는 current author, (i) session-created audit mandatory · magic-link-consumed / first-active-membership-resolved best-effort, (j) cleanup route eventType = `session-cookie-cleared` (resolveTenantContext 의 `tenant-resolve-denied` 와 중복 회피), (k) lost update 감지 (`updated_at` hidden compare 또는 version column) 는 M0 v1.0 cascade marker.
118:│   │   │           └── actions.ts    — saveClinicProfile (bound action — § 6.2 ADMIN-UI-31)
206:     • emitAuditEvent(sqlBase, { eventType:'content-saved', actorUserId:ctx.userId, toInstanceId:ctx.instanceId,
269:export async function slugResolver(
303:export async function withSkeletonTx<T>(
334:`AuthDenyReason` union 의 **실제 17 reasons** (packages/auth/src/errors.ts L6-L23) 기준 exhaustive 매핑. `assertNever` 로 build-time enforce.
350:### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
359:**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
372:| `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
390: WHERE event_type IN ('tenant-resolved','content-saved','session-created')
398:**content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
401:3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
402:4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.
404:## 6. ClinicProfile 폼 명세 (skeleton 범위)
425:### 6.2 Server Action `saveClinicProfile` — bound action (cycle2 정정 ADMIN-UI-31)
432:export default async function Page({ params }: { params: { instanceSlug: string }}) {
439:export async function saveClinicProfile(instanceSlug: string, prev: State, formData: FormData) {
469:      eventType: "content-saved",
480:    console.error("[saveClinicProfile] content-saved audit emit failed (save succeeded)", auditErr);
481:    // M0 v1.0 + transactional outbox 도입 후엔 ok:false 로 전환 — skeleton 은 best-effort
489:- **ADMIN-UI-31**: instanceSlug 는 page 의 bound action 첫 인자.
527:export default {
617:7. upsert 동일 slug 재제출 → 한 row 유지 · audit_event `content-saved` 2건.
627:> **Precondition (cycle6 정정 ADMIN-UI-92)**: 게이트 #1·#2 의 `typecheck:all` / `build:all` script 는 루트 `package.json` 에 현재 미존재. **plan acceptance 가 아닌 구현 진입 precondition** — plan v1.0 acceptance 후 코드 작성 단계의 첫 작업으로 루트 script 추가.
632:| 2 | `pnpm build:all` PASS | 같음 |
636:| 6 | ClinicProfile 폼 저장 + RLS 격리 | § 8.1 시나리오 1~13 PASS |
637:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
639:| 9 | `assertNever` exhaustive 체크 PASS | deny-reason-map 이 모든 17 `AuthDenyReason` mapping (build-time enforce) |
651:| W-06 | content-saved audit 헬퍼 위치 | packages/auth.emitAuditEvent → audit_event (tx 밖 base-role) · cycle1 close · cycle3 audit 실패 정책 추가 결정 |
665:| 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
667:| `docs/decisions/PACKAGES_STRUCTURE.md` v0.2 patch (cycle6·8 정정 ADMIN-UI-91·99) — `@glitzy/auth` placeholder 분류 제거 (실제 issueMagicLink·createSession·resolveTenantContext·emitAuditEvent export 중), `@glitzy/core-content` 상태 갱신 (6 tables 추가), apps/web entry 및 dependency arrow 명시 | v0.2 patch | **follow-up (acceptance non-blocking)** |
685:| Transactional outbox 패턴 (content-saved audit dual-write race 해소) — M0 v1.0 또는 M2 |
695:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
700:| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
702:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
704:| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1480ms:
packages/migrations-runner/src/index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1)
packages/migrations-runner/src/index.ts:5://   - runner.ts (loadMigrations·runMigrate·migrationsDir·stopAfter·forward-only guard·per-file tx)
packages/migrations-runner/src/index.ts:9://   - service-role-emit.ts (audit_event 1:1 per migration)
packages/core-content/migrations\C0001_clinic_profile.sql:1:-- @glitzy/core-content — C0001 ClinicProfile (DATA_MODEL C-01·minimal v0.1)
packages/core-content/migrations\C0002_location_profile.sql:1:-- @glitzy/core-content — C0002 LocationProfile (DATA_MODEL C-21·minimal v0.1)
packages/core-content/migrations\C0003_doctor_profile.sql:1:-- @glitzy/core-content — C0003 DoctorProfile (DATA_MODEL C-02·minimal v0.1)
packages/core-content/migrations\C0004_treatment_page.sql:1:-- @glitzy/core-content — C0004 TreatmentPage (DATA_MODEL C-03·v0.2 patch)
packages/core-content/migrations\C0005_article.sql:1:-- @glitzy/core-content — C0005 Article (DATA_MODEL C-04·v0.2 patch)
packages/core-content/migrations\C0005_article.sql:3:-- M0-02·03 cycle2: enum 통합 (C0004에서 정의)
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1488ms:
apps/web/src/lib\errors.ts
apps/web/src/app\(admin)\[instanceSlug]\clinic-profile\page.tsx
apps/web/src/app\(admin)\[instanceSlug]\clinic-profile\actions.ts
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
{
  "cycle": 4,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-48",
      "finding": "primary_ctas trigger errors cannot reach the promised fieldErrors.primaryCtas mapping because the trigger raises SQLSTATE 23514 without a CONSTRAINT name, while mapDbErrorToResult returns null when constraint_name/constraint is absent.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:192, docs/decisions/LOCATION_LEGAL_PLAN.md:207, docs/decisions/LOCATION_LEGAL_PLAN.md:429, apps/web/src/lib/errors.ts:50",
      "impact": "LL-38의 trigger 전환 후 primaryCtas shape 오류가 기존 CHECK constraint처럼 field-level UX로 매핑되지 않는다. RAISE ... USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 또는 errors.ts의 SQLSTATE/message 분기가 필요하다."
    },
    {
      "id": "LL-49",
      "finding": "LL-CASCADE-04 acceptance precondition points to ADMIN_UI_SKELETON_PLAN § 6 build/export 영역, but the actual § 6 is only the skeleton ClinicProfile form spec and has no build/export responsibility patch.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:568, docs/decisions/ADMIN_UI_SKELETON_PLAN.md:404",
      "impact": "cycle3 LL-41 is not fully accepted. Plan v1.0 단독 close 시 apps/worker Git export 책임 SoT가 여전히 공중에 떠 있다."
    }
  ],
  "newMajorFindings": [
    {
      "id": "LL-50",
      "finding": "CT-03 SoT 정렬이 불완전하다. DATA_MODEL CT-03 enum은 phone/naver-reservation/naver-talk/kakao-talk/kakao-channel/form/map/external/sms/email/video-consultation인데, plan은 6종만 DATA_MODEL 정합이라고 선언하고 DB trigger도 6종만 허용한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:184, docs/decisions/LOCATION_LEGAL_PLAN.md:223, docs/core/DATA_MODEL.md:196",
      "impact": "ClinicProfile.primaryCtas가 CTAConfig[]라면 SoT상 유효한 form/map/external/sms/video-consultation 값이 DB에서 거절된다. skeleton subset 정책이면 'UI 입력 subset'과 'DB 허용 enum'을 분리해야 한다."
    },
    {
      "id": "LL-51",
      "finding": "form (b) UI copy still says primaryCtas 'phone/kakao/naver-booking', but neither 'kakao' nor 'naver-booking' is the CT-03 enum token. The accepted tokens are kakao-talk/kakao-channel and naver-reservation/naver-talk.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:299, docs/core/DATA_MODEL.md:196",
      "impact": "LL-40의 enum 정렬 patch가 UI field vocabulary까지 전파되지 않았다. 구현자가 name/value를 잘못 만들 가능성이 높다."
    },
    {
      "id": "LL-52",
      "finding": "LL-DEFER-04/05 phase grouping regressed: §1.3 says reservationChannels 풀세트 and representative/doctors/treatments inputs join around M0 v1.0/LocationProfile editing, while §9.3 moves both to M2 Phase Beta.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:61, docs/decisions/LOCATION_LEGAL_PLAN.md:62, docs/decisions/LOCATION_LEGAL_PLAN.md:549",
      "impact": "LL-47 phase grouping is not internally consistent. M0 v1.0 acceptance scope can be interpreted two ways."
    },
    {
      "id": "LL-53",
      "finding": "LL-CASCADE-05 is marked as an acceptance precondition with actual runner behavior required, but packages/migrations-runner is still explicitly placeholder and the plan does not state whether v1.0 acceptance is blocked until runner code lands or only until a manifest spec lands.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:569, packages/migrations-runner/src/index.ts:1",
      "impact": "LL-42 remains ambiguous as a close gate. closeableAfterPatch cannot be true until the precondition strength is made explicit."
    }
  ],
  "newMinorFindings": [
    {
      "id": "LL-54",
      "finding": "LL-38 text contradicts itself on IMMUTABLE: the decision says the trigger path avoids helper IMMUTABLE forcing, but the trigger function is declared LANGUAGE plpgsql IMMUTABLE and changelog repeats that.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:177, docs/decisions/LOCATION_LEGAL_PLAN.md:212, docs/decisions/LOCATION_LEGAL_PLAN.md:578",
      "impact": "Probably not a migration blocker, but it is misleading. A trigger function reading NEW and raising row-specific exceptions should be left without IMMUTABLE, or the wording must explain why the marker is harmless."
    },
    {
      "id": "LL-55",
      "finding": "Audit 3-step safety net names Sentry capture/breadcrumb in v0.4 behavior while Sentry SDK integration is deferred to LL-DEFER-18.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:414, docs/decisions/LOCATION_LEGAL_PLAN.md:534",
      "impact": "Pre-Sentry fallback is underspecified. The plan should say v0.4 uses console/server log only, and Sentry capture becomes active after LL-DEFER-18."
    }
  ],
  "convergenceSignal": "대부분의 cycle3 patch는 본문에 반영됐고 LL-39, LL-44, LL-45, LL-46은 close에 가깝다. 다만 이번 cycle은 새 대형 설계보다 cascade target/SoT vocabulary/DB error mapping 같은 연결부 결함이 남았다. 10 → 7 findings로 수렴 중이나 closeableAfterPatch는 아직 false.",
  "nextCycleFocus": "cycle5는 primary_ctas trigger error mapping, CT-03 enum subset 정책, LL-CASCADE-04 실제 ADMIN_UI_SKELETON_PLAN patch target, LL-CASCADE-05 acceptance 강도, LL-DEFER-04/05 phase 정합만 좁게 닫으면 closeableAfterPatch=true 후보가 된다."
}
tokens used
68,471
{
  "cycle": 4,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-48",
      "finding": "primary_ctas trigger errors cannot reach the promised fieldErrors.primaryCtas mapping because the trigger raises SQLSTATE 23514 without a CONSTRAINT name, while mapDbErrorToResult returns null when constraint_name/constraint is absent.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:192, docs/decisions/LOCATION_LEGAL_PLAN.md:207, docs/decisions/LOCATION_LEGAL_PLAN.md:429, apps/web/src/lib/errors.ts:50",
      "impact": "LL-38의 trigger 전환 후 primaryCtas shape 오류가 기존 CHECK constraint처럼 field-level UX로 매핑되지 않는다. RAISE ... USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 또는 errors.ts의 SQLSTATE/message 분기가 필요하다."
    },
    {
      "id": "LL-49",
      "finding": "LL-CASCADE-04 acceptance precondition points to ADMIN_UI_SKELETON_PLAN § 6 build/export 영역, but the actual § 6 is only the skeleton ClinicProfile form spec and has no build/export responsibility patch.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:568, docs/decisions/ADMIN_UI_SKELETON_PLAN.md:404",
      "impact": "cycle3 LL-41 is not fully accepted. Plan v1.0 단독 close 시 apps/worker Git export 책임 SoT가 여전히 공중에 떠 있다."
    }
  ],
  "newMajorFindings": [
    {
      "id": "LL-50",
      "finding": "CT-03 SoT 정렬이 불완전하다. DATA_MODEL CT-03 enum은 phone/naver-reservation/naver-talk/kakao-talk/kakao-channel/form/map/external/sms/email/video-consultation인데, plan은 6종만 DATA_MODEL 정합이라고 선언하고 DB trigger도 6종만 허용한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:184, docs/decisions/LOCATION_LEGAL_PLAN.md:223, docs/core/DATA_MODEL.md:196",
      "impact": "ClinicProfile.primaryCtas가 CTAConfig[]라면 SoT상 유효한 form/map/external/sms/video-consultation 값이 DB에서 거절된다. skeleton subset 정책이면 'UI 입력 subset'과 'DB 허용 enum'을 분리해야 한다."
    },
    {
      "id": "LL-51",
      "finding": "form (b) UI copy still says primaryCtas 'phone/kakao/naver-booking', but neither 'kakao' nor 'naver-booking' is the CT-03 enum token. The accepted tokens are kakao-talk/kakao-channel and naver-reservation/naver-talk.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:299, docs/core/DATA_MODEL.md:196",
      "impact": "LL-40의 enum 정렬 patch가 UI field vocabulary까지 전파되지 않았다. 구현자가 name/value를 잘못 만들 가능성이 높다."
    },
    {
      "id": "LL-52",
      "finding": "LL-DEFER-04/05 phase grouping regressed: §1.3 says reservationChannels 풀세트 and representative/doctors/treatments inputs join around M0 v1.0/LocationProfile editing, while §9.3 moves both to M2 Phase Beta.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:61, docs/decisions/LOCATION_LEGAL_PLAN.md:62, docs/decisions/LOCATION_LEGAL_PLAN.md:549",
      "impact": "LL-47 phase grouping is not internally consistent. M0 v1.0 acceptance scope can be interpreted two ways."
    },
    {
      "id": "LL-53",
      "finding": "LL-CASCADE-05 is marked as an acceptance precondition with actual runner behavior required, but packages/migrations-runner is still explicitly placeholder and the plan does not state whether v1.0 acceptance is blocked until runner code lands or only until a manifest spec lands.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:569, packages/migrations-runner/src/index.ts:1",
      "impact": "LL-42 remains ambiguous as a close gate. closeableAfterPatch cannot be true until the precondition strength is made explicit."
    }
  ],
  "newMinorFindings": [
    {
      "id": "LL-54",
      "finding": "LL-38 text contradicts itself on IMMUTABLE: the decision says the trigger path avoids helper IMMUTABLE forcing, but the trigger function is declared LANGUAGE plpgsql IMMUTABLE and changelog repeats that.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:177, docs/decisions/LOCATION_LEGAL_PLAN.md:212, docs/decisions/LOCATION_LEGAL_PLAN.md:578",
      "impact": "Probably not a migration blocker, but it is misleading. A trigger function reading NEW and raising row-specific exceptions should be left without IMMUTABLE, or the wording must explain why the marker is harmless."
    },
    {
      "id": "LL-55",
      "finding": "Audit 3-step safety net names Sentry capture/breadcrumb in v0.4 behavior while Sentry SDK integration is deferred to LL-DEFER-18.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:414, docs/decisions/LOCATION_LEGAL_PLAN.md:534",
      "impact": "Pre-Sentry fallback is underspecified. The plan should say v0.4 uses console/server log only, and Sentry capture becomes active after LL-DEFER-18."
    }
  ],
  "convergenceSignal": "대부분의 cycle3 patch는 본문에 반영됐고 LL-39, LL-44, LL-45, LL-46은 close에 가깝다. 다만 이번 cycle은 새 대형 설계보다 cascade target/SoT vocabulary/DB error mapping 같은 연결부 결함이 남았다. 10 → 7 findings로 수렴 중이나 closeableAfterPatch는 아직 false.",
  "nextCycleFocus": "cycle5는 primary_ctas trigger error mapping, CT-03 enum subset 정책, LL-CASCADE-04 실제 ADMIN_UI_SKELETON_PLAN patch target, LL-CASCADE-05 acceptance 강도, LL-DEFER-04/05 phase 정합만 좁게 닫으면 closeableAfterPatch=true 후보가 된다."
}
