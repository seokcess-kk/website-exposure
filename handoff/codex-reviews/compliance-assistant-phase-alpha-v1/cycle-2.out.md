OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e30-d58b-7e23-801c-3e1a00f237f5
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.2 — **cycle 2**. cycle 1 안 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용 patch 적용 완료. closeable_after_patch_ratio 97% (CAP-01 외 35건).

## cycle 1 결정·patch 요약

- **CAP-01 KSS**: Phase Beta defer (CA-DEFER-22 신설) · "CA-DEFER-01 부분 해소" 표현 채택. composite/contextExceptions 정확도 fallback 한계 명시.
- **CAP-02**: "데이터 YAML 6개 + schema.json 1개" 명명 통일. catalogHash 데이터 한정 + schemaHash 별도.
- **CAP-04**: § 2.4 MEDICAL_AD SoT 예시 ID 17종 → canonical 13 생성 / 11 흡수 / 1 미등록 (runtime-meta) / 1 Phase Beta defer 매핑 표.
- **CAP-05**: § 8.1 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭. supremacy-001 미포함.
- **CAP-06**: auto-gate `gateRequired && automatedDecision !== 'block'` 조건.
- **CAP-07**: submitForReview 트리거 한정 부분 해소 (CA-DEFER-15 부분).
- **CAP-08**: FAQ unlock = zod 변경 없음 (이미 CWI v1.0 안 제거). workflow action / publish path 안 compliance check.
- **CAP-09**: P-006 slot Phase Beta defer (CA-DEFER-18). slot-matches.yaml v0.0 placeholder.
- **CAP-10**: partial UNIQUE `(instance_id, content_type, content_ref, queue_type)` (실 C0015 기준).
- **CAP-11**: 외부 inferredRiskLevel 항상 내부 재계산 + MAX 결합 + mismatch audit.
- **CAP-12**: RiskInferenceResult evaluatedSteps + contributingSteps 분리.
- **CAP-13**: explicit High 최우선 단일 검사.
- **CAP-14**: calculateFinalRoles 단일 경로 (final-roles.ts 재사용).
- **CAP-15**: client role schema 허용 + runtime 큐 처리 불가 + clientRolePresent metadata.
- **CAP-16**: unreviewed-ad-001 카탈로그 미등록 + triggeredBy='static-rule' 유지.
- **CAP-17**: contextExceptions 같은 문장 + finding span overlap + fail composite 예외 미적용.
- **CAP-18·19**: extensions 위치 통일 (auto_check_result.extensions) + envelope 안은 별도 영역 + persist 시 합성.
- **CAP-20·21·22**: testimonial finding category 기반 · pricing SoT regex 전건 · LegalDocument 완화 dead code marker.
- **CAP-23·24**: field scope skip+warning · qa block scope 부분 포함.
- **CAP-26**: catalogHash 데이터 한정. engineVersion/kssAvailable 별도 metadata.
- **CAP-27**: medical-law-tracking 2026-04-07 reaffirmation seed.
- **CAP-28**: rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리.
- **CAP-29·30**: false-statement / side-effect-missing Phase Beta defer (CA-DEFER-29/30 신설).
- **CAP-31·32·33·34·35·36**: minor/nit 표현 정정.

## 본 cycle 검증 우선순위

cycle 1 patch 가 정합하게 적용되었는지 + 새로운 결함이 없는지 검증. 이전 cycle finding 안 closeable=false 였던 CAP-01 (KSS) 의 patch 결과 정합성 우선.

### cycle 1 patch 재검증
1. **CAP-01 KSS 결정**: CA-DEFER-01 "부분 해소" 표현 + CA-DEFER-22 신설 · § 6.5 fallback 한계 명시 + 운영 risk 문구 — compliance-assistant § 4.3 KSS v3+ SoT 와 표현 정합성 (Phase Alpha scope marker 정확성)
2. **CAP-02 catalogHash 분리**: catalogHash = 6 YAML 데이터 hash · schemaHash = schema.json hash · engineVersion / kssAvailable 별도 metadata — § 3.4 알고리즘 명세 정확성. envelope extensions.engineMetadata 안 5 필드 (catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable) 정합
3. **CAP-04 SoT 예시 ID 매핑 표**: § 2.4 안 17 SoT ID 모두 처리 결정 (생성/흡수/미등록/defer) 누락 검증. 특히 흡수 시 legalBasis cascade 정확성 (§ 3.2 → guarantee-composite-001 안 4 호 결합 legalBasis 정합)
4. **CAP-05 7 카테고리 정확 매칭**: § 8.1 includes-effect-claim 표 안 SoT 7 카테고리 문자열 그대로 사용. rules.core.yaml § 2.5 안 각 룰의 category 도 SoT 7 카테고리 안 매핑 정합 (예: guarantee-composite-001 의 category = "전문성 단정 (효과·결과·보장 결합)" 7 카테고리 안 포함)
5. **CAP-06 auto-gate block 제외**: § 12.1 enqueueContentGateIfNeeded 안 조건 `gateRequired && automatedDecision !== 'block'` 정합. scenario #38 검증
6. **CAP-11 외부 inferredRiskLevel MAX 결합**: § 7.1 단계 9 안 MAX 결합 + mismatch audit. compliance-assistant § 3.3 "외부 신뢰 사용" 정책 vs 본 cycle "항상 재계산" 결정의 의도적 강화 (성능 vs 정확도 trade-off 명시)
7. **CAP-12 evaluatedSteps + contributingSteps 분리**: § 10.1 알고리즘 안 분리 정합. RISK_LEVELS § 2.3.1 SoT 안 단일 `steps[]` 정의와 cascade 영향 (CA-CASCADE-06 안 RISK_LEVELS 안 본 분리 cascade 필요 여부)
8. **CAP-13 explicit High 최우선**: § 11.1 determineTriggeredBy 안 단일 검사 (`if explicit === 'High' return 'explicit'`). RISK_LEVELS § 6.1 "explicit이 High이지만 다른 source도 High면 우선순위는 explicit" 정합
9. **CAP-14 calculateFinalRoles 단일 경로**: § 11.2 + § 7.1 단계 13 안 기존 helper 단일 호출. final-roles.ts 안 실 시그니처 정합 (input 안 findingsRequiredRoles 등 추가 input 표 변경 영향 검증)
10. **CAP-17 contextExceptions overlap + fail composite 예외**: § 5.1 안 finding span overlap + fail composite 예외 미적용 정합. scenario 17a/17b 검증
11. **CAP-18·19 extensions 위치 통일**: § 7.1 + § 14.1 + § 14.2 안 envelope.extensions vs auto_check_result.extensions 단일 nested 구조 정합. CONTENT_STANDARDS § 7.2 SoT 침해 없음
12. **CAP-22 LegalDocument 완화 dead code**: § 8.2 안 LegalDocument documentType 완화 표 미실행 marker. § 8.2 안 실 적용 표 (LocationProfile + Article notice) 만 활성
13. **CAP-23 field scope skip**: § 4.3 안 field scope loader skip+warning. matcher 진입 없음 정합
14. **CAP-24 qa block scope 부분 포함**: § 4.3 + § 4.4 안 qa block scope FAQ 처리. qaBlocks 입력 + offset 변환 정합
15. **CAP-26 catalogHash 데이터 한정**: § 3.4 안 정확한 알고리즘 + § 2.1 catalogHash 정책 단락 일관성
16. **CAP-27 medical-law-tracking SoT seed**: § 2.8 안 2026-04-07 reaffirmation 정합 (MEDICAL_AD § 11.2 실 SoT 인용 검증 — 실제 MEDICAL_AD 안 본 revision 존재 검증)
17. **CAP-28 rules.core vs medical-ad 분리**: § 2.5 rules.core.yaml 14 룰 (CONTENT_STANDARDS § 4.1 표 전건 변환) + § 2.6 rules.medical-ad.yaml overrides + 신규 룰. legalBasis overlay 정합
18. **CAP-29·30 Phase Beta defer**: CA-DEFER-29/30 신설 marker · § 1.3 표 안 명시
19. **CAP-31·32·33·34·35·36**: 경로 정정 · FAQ sentinel · priority/SLA 인용 · Publication/MediaAppearance 잔여 · scenario count · CA-CASCADE 9종 표기 정합

### 새로운 검증 영역

- **§ 2.5 rules.core.yaml 14 룰 정합**:
  - CONTENT_STANDARDS § 4.1 표 (14 카테고리) 모두 cover (효과 단정·전문성 단정 단독·결합·보장 표현·수치/기간 단정·수치/기간 보장·체질 맞춤·최상급·비교·유인성·할인 사실·진단 단정·명의 권위·유명인 동원) — 누락 카테고리 검증
  - 각 룰의 category 문자열이 SoT § 4.1 표 카테고리 칸과 정확 일치
  - `numeric-period-standalone-001` AND_NEAR window=15 vs SoT 정합
  - `event-fact-statement-001` scope 안 `articleType=event-price` · `pageType=P-102` · `pageType=P-104` 외 검사 — scope OR 결합 안 NOT 표현 한계 (matcher 안 흐름 정합)
  - `celebrity-001` 안 의료법 호 매핑 (§ 3.10 기사형 광고 vs § 3.2 환자 유인 — 정확한 legalBasis 검증)
- **§ 2.6 rules.medical-ad.yaml overrides + 신규 룰**:
  - 각 override 의 targetRuleId 가 rules.core.yaml 안 정의된 룰 ID 와 일치 검증
  - 신규 룰 13종 (CAP-04 표 안 "생성" 항목) 모두 정의 검증
  - testimonial-001 composite operands + AND_IN_PARAGRAPH logic 정합
  - foreign-patient-recruit-domestic-confirmed-001 composite operands 정합
  - non-covered-discount-pressure-001 composite operands 정합
  - award-endorsement-001 composite operands 정합
- **§ 7.1 check() 9단계 흐름 일관성**:
  - 단계 5 → 6 → 7 → 8 순서 정합 (compliance-assistant § 4.1)
  - 단계 9 외부 inferredRiskLevel MAX 결합 → 단계 10 High 가상 finding (CAP-11 + CAP-13 통합)
  - 단계 11 priorReviewRequired meta 검사 (CAP-16)
  - 단계 13 calculateFinalRoles 호출 시 input 안 contentType / pageRiskLevel / priorReviewRequired / findingsRequiredRoles — 실 final-roles.ts 시그니처 정합
- **§ 14.2 ComplianceCheckEnvelope 타입 cascade**:
  - 실 types.ts 안 cascade 정합 (envelope.extensions 신규 영역 추가)
  - DB persist 시 합성 코드 위치 (server-actions.ts 안 submitForReview / approveContent / publishContent 흐름)
- **시나리오 42건 정합**:
  - 시나리오 17a/17b (CAP-17) 결정적 검증 가능성 (KSS fallback 안 정확도 한계 영향)
  - 시나리오 33 (CAP-11) external='High' + internal='Medium' → final='High' + mismatch metadata
  - 시나리오 34 (CAP-12) evaluatedSteps + contributingSteps 분리 검증
  - 시나리오 38 (CAP-06) automatedDecision='block' + gateRequired=true → enqueue 안 함 → audit 안 finding 보존
  - 시나리오 39 (CAP-35) "contains ruleIds" 검증 방식 정합

### CA-DEFER 마커 정합
- CA-DEFER-17·18·19·20·21·22·29·30 8 신설 marker — § 1.3 표 안 누락 없는지
- 각 marker 의 Phase target (Phase Beta · M2) 정합

### docs cascade 정합
- CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 15종 — 실 RISK_LEVELS § 3.3 표 안 cascade 필요 표 작성 (cycle 1 안 본 cascade 안 patch 시점은 plan 안 marker 만 — 실 RISK_LEVELS 본문 갱신은 code cycle 안)
- CA-CASCADE-09 신설 CA-DEFER marker — M0_PLAN § 9 안 cascade 필요 표 작성

### Codex 비평 운영 원칙
- cycle 2 안 누계 지적 수 cycle 1 (36) 대비 줄어들어야 함 (수렴 추세). normal pattern = 36 → 8~15 finding (M0 plan cycle 2 = 5 · LL cycle 2 = 12 · EAT cycle 2 = 8)
- closeable_after_patch_ratio 100% 근접 권장
- cycle 1 patch 적용 안 된 finding 안 직접 인용 (plan § XX · file:line)
- 새로운 결함 ID prefix = **CAP2** (cycle 2 신규)
- cycle 1 finding 잔존 ID prefix = **CAP** (그대로 유지)

## SoT (cycle 1 동일)

본 monorepo working root 에서 직접 파일을 읽어 plan 과 대조. cycle 1 prompt 안 명시한 20 SoT 그대로.

추가 검증 — cycle 1 patch 영향 SoT:
- `apps/web/src/lib/compliance/final-roles.ts` (CAP-14 단일 경로 정합)
- `apps/web/src/lib/eat-content-schema.ts` (CAP-08·31 경로 검증)
- `apps/web/src/components/forms/FaqForm.tsx` (CAP-08 status field 이미 제거 확인)
- `packages/core-content/migrations/C0015_review_queue_entry.sql` (CAP-10 실 UNIQUE constraint 확인)
- `docs/admin/REVIEW_WORKFLOW.md` § 3.3 (CAP-33 priority/SLA 표 정합)
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 11.2 (CAP-27 2026-04-07 reaffirmation 실 존재 검증)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = N

## blocking
- **CAP2-XX**: <짧은 제목> 또는 **CAP-XX (잔존)**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): ...
  - 문제: ...
  - 권장 patch: ...
  - closeableAfterPatch: true|false

## major
## minor
## nit

## acceptance precondition 점검
- 18 canonical 룰 정합: <PASS|FAIL>
- 5 inlineRiskFlags 추출 표 정합: <PASS|FAIL>
- RiskInference MAX 결합 + steps 정합: <PASS|FAIL>
- contextExceptions OR 결합 + 같은 문장 단위 정합: <PASS|FAIL>
- High 가상 finding triggeredBy 판정 정합: <PASS|FAIL>
- CA-DEFER 5 + 8 신설 phase 분류 정합: <PASS|FAIL>
- CA-CASCADE 9종 정합: <PASS|FAIL>

=== CYCLE SIGNAL ===
cycle: 2
total_findings: <NN>
blocking: <N>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: true|false
scope_narrow_acceptable: true|false
recommendation: "다음 cycle 진입 권장" 또는 "acceptance 권장"
```

한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것 (인사 · 결언 등 X).

codex
검토 범위가 넓어서 먼저 plan과 SoT 파일들의 현재 위치, 관련 섹션 라인 번호를 잡겠습니다. 이후 cycle 1 잔존 여부와 cycle 2 신규 결함만 추려서 요청 형식으로 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"CA-DEFER|catalogHash|schemaHash|engineMetadata|KSS|includes-effect-claim|enqueueContentGateIfNeeded|inferredRiskLevel|evaluatedSteps|contributingSteps|determineTriggeredBy|calculateFinalRoles|contextExceptions|auto_check_result|LegalDocument|qaBlocks|medical-law-tracking|rules\\.core|rules\\.medical-ad|Scenario|scenario|CA-CASCADE|canonical\" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "export|function|calculateFinalRoles|FinalRoles" apps/web/src/lib/compliance/final-roles.ts apps/web/src/lib/eat-content-schema.ts apps/web/src/components/forms/FaqForm.tsx packages/core-content/migrations/C0015_review_queue_entry.sql docs/admin/REVIEW_WORKFLOW.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files docs apps packages | rg "(CONTENT_STANDARDS|RISK_LEVELS|compliance|server-actions|types|COMPLIANCE_ASSISTANT|M0_PLAN|MEDICAL_AD)"' in C:\Users\assag\solution\website-exposure
 succeeded in 649ms:
apps/web/src/lib/compliance/final-roles.ts:14:export function calculateFinalRoles(
apps/web/src/lib/compliance/final-roles.ts:38:export type ComplianceRecordRow = {
apps/web/src/lib/compliance/final-roles.ts:51:export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
apps/web/src/components/forms/FaqForm.tsx:10:export type FaqInitial = {
apps/web/src/components/forms/FaqForm.tsx:34:export function FaqForm({
apps/web/src/components/forms/FaqForm.tsx:89:function SubmitButton({ isNew }: { isNew: boolean }) {
apps/web/src/lib/eat-content-schema.ts:107://   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
apps/web/src/lib/eat-content-schema.ts:108:export const EatStatusSchema = z.enum(["draft"], {
apps/web/src/lib/eat-content-schema.ts:113:export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
apps/web/src/lib/eat-content-schema.ts:114:export const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
apps/web/src/lib/eat-content-schema.ts:115:export const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
apps/web/src/lib/eat-content-schema.ts:116:export const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;
apps/web/src/lib/eat-content-schema.ts:120:export const ArticleCategoryInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:132:export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;
apps/web/src/lib/eat-content-schema.ts:148:export const PublicationInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:181:export type PublicationInput = z.infer<typeof PublicationInputSchema>;
apps/web/src/lib/eat-content-schema.ts:185:export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;
apps/web/src/lib/eat-content-schema.ts:187:export const MediaAppearanceInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:205:export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;
apps/web/src/lib/eat-content-schema.ts:209:export const FaqInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:222:export type FaqInput = z.infer<typeof FaqInputSchema>;
docs/admin/REVIEW_WORKFLOW.md:417:async function enqueueMediaThresholdReassessment(input: {
docs/admin/REVIEW_WORKFLOW.md:721:- 외부 export — JSON·CSV 형식 (운영 정책별)

 succeeded in 674ms:
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
docs\core\CONTENT_STANDARDS.md
docs\features\compliance-assistant.md
packages\shared-types\tsconfig.json
packages\shared-types\package.json
packages\shared-types\src\index.ts
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md
apps\web\src\types\react-dom-stable.d.ts
packages\core-content\migrations\C0014_compliance_record.sql
apps\web\src\lib\compliance\publishable-check.ts
apps\web\src\lib\compliance\final-roles.ts
apps\web\src\lib\compliance\entity-actions.ts
apps\web\src\lib\compliance\eligibility.ts
apps\web\src\lib\compliance\check.ts
apps\web\src\lib\compliance\transitions.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\lib\compliance\risk.ts
apps\web\src\lib\compliance\types.ts
apps\web\src\lib\json-ld\types.ts
apps\web\src\lib\compliance\__tests__\compliance.test.ts

 succeeded in 684ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
11:  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
12:  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
13:  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
17:- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 + medical-law-tracking SoT revision (CAP-27 정정)
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 (rules.core.yaml 표현 SoT — CAP-28 정정) · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
19:- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
22:- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
39:- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
41:- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 SoT 예시 ID → canonical 매핑** (CAP-04 정정): § 3.1~3.14 각 호의 SoT 예시 ID 17종 → § 2.3 안 "생성 / canonical 흡수 / 의도적 제외" 표 매핑. 흡수 시 대체 ruleId + legalBasis 명시.
42:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
44:### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
51:| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
52:| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
53:| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
54:| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
55:| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
56:| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2) |
58:| **`metadata.inferredRiskLevel` 외부 입력 처리** (CAP-11 정정) | compliance-assistant § 3.3 정합 — **항상 내부 재계산** + **외부 입력과 MAX 결합**. 불일치 시 `auto_check_result.extensions.inferredRiskLevelMismatch` 안 외부값/내부값/최종값 audit 보존 (운영자 모니터링). 외부 입력 신뢰 skip 모드는 본 cycle 미합류 (성능 최적화 Phase Beta) |
59:| `meta.yaml` catalogVersion + **catalogHash (데이터 파일 hash 한정)** (CAP-26 정정 · CA-VERSION-01) | `catalogVersion` = meta.yaml `catalogVersion` 필드. `catalogHash` = **6 YAML 파일 (rules.core·rules.medical-ad·context-exceptions·medical-law-tracking·slot-matches·meta) 의 정렬 후 SHA-256 concat hash**. **schema.json 미포함** (CAP-02 정정 — schema 변경은 별도 `schemaHash` metadata). **`kssAvailable` 미포함** (CAP-26 정정 — runtime capability 이므로 `engineVersion` 별도 metadata) |
60:| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
66:| **`calculateFinalRoles` 단일 경로 강제** (CAP-14 정정) | `apps/web/src/lib/compliance/final-roles.ts` 이미 존재 — Phase Alpha 안 별도 합집합 계산 안 함. High 가상 finding 의 `requiredApproverRoles` 만 입력으로 추가하여 기존 `calculateFinalRoles` 단일 호출. M0 patterns (operator + Medium/High medical + LegalDocument legal + finding roles 합집합) 그대로 유지 |
67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
69:| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
70:| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
71:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 20단계 · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 |
73:### 1.3 비범위 (defer) — CAP-25 정정 (CA-DEFER-17~22 명시)
77:| 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
78:| LLM 보조 | Phase Beta | CA-DEFER-03 |
79:| warning 큐 + warningAcknowledgements | Phase Beta | CA-DEFER-05 |
80:| stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 | Phase Beta | CA-DEFER-06 |
81:| request-changes / delegate 액션 | Phase Beta | CA-DEFER-07 |
82:| priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 | M2 | CA-DEFER-08 |
83:| client 검수자 (clientApprover 슬롯) | Phase Beta | CA-DEFER-10 |
84:| MediaThresholdAssessment | analytics-reporting 본 구현 | CA-DEFER-09 |
85:| attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
86:| Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
87:| preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta (preset 부재 시 silent skip 정책 — § 11) | CA-DEFER-17 (신설) |
88:| **P-006 (및 다른 PAGE_TYPES § 3) 슬롯 격상 표** — slot-matches.yaml 실 데이터 | Phase Beta (slot 격상은 `entityFields` + `body-regex` matchCondition 합류 필요 · TreatmentPage 실 schema 안 single body_markdown 필드만 존재이므로 entity-level slot 평가 미지원) | CA-DEFER-18 (신설) |
89:| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 — sourceUrl · checkedBy · 영향 룰 ID · stale 트리거 | 본 cycle 안 **MEDICAL_AD_COMPLIANCE_COMMON § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27 정정). 추가 revision Phase Beta | CA-DEFER-19 (신설) |
90:| **`field` scope (fieldPath 단위 매칭)** — RiskRule.scope `type="field"` 의 fieldPath 단위 매칭 (현재 v0.1 안 body 전체 매칭 안 함 — skip+warning) | Phase Beta | CA-DEFER-20 (신설) |
91:| **`block` scope 5종 (list/table/callout/citation/media)** — `qa` 외 block scope | Phase Beta | CA-DEFER-21 (신설) |
92:| **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도 | Phase Beta (kss-js · @kss/kss-js · 자체 포팅 중 결정. v0.1 안 fallback 정규식 `[.!?](\s+\|$)` 한국어 종결 어미 분리 부정확) | CA-DEFER-22 (신설) |
93:| **`NOT_IN_PARAGRAPH` logic (negative operand)** — `side-effect-missing-001` (§ 3.7) 본 logic 필요 | Phase Beta (CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade — `side-effect-missing-001` 룰 자체도 Phase Beta 합류) | CA-DEFER-30 (CAP-30 정정 · 신설) |
94:| **`citationAbsence` evaluation contract** — `false-statement-001` (§ 3.3) 본 contract 필요 | Phase Beta (v0.1 안 단순 regex 매칭만 — citation block 검사 부재 한계 명시) | CA-DEFER-29 (CAP-29 정정 · 신설) |
98:1. **M0 stub → Phase Alpha 교체 시 기존 published 콘텐츠 영향 없음** — sentinel ComplianceRecord 안 `auto_check_result` 는 SoT 7 필드만이므로 풀명세 영역이 추가되어도 기존 row 영향 없음 (JSONB extensions key 추가 만).
99:2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
103:6. **외부 inferredRiskLevel 입력 MAX 결합** (CAP-11 정정) — compliance-assistant § 3.3 SoT 정합. 외부 입력 + 내부 재계산 결과 불일치 시 audit metadata 안 보존 (운영자가 외부 호출자 신뢰성 모니터링).
109:### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)
114:├── rules.core.yaml                  # CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (CAP-28 정정)
115:├── rules.medical-ad.yaml             # MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 → legalBasis overlay (CAP-28 정정)
117:├── medical-law-tracking.yaml         # MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed (CAP-27 정정)
118:├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
119:└── schema.json                       # JSON Schema (catalogHash 미포함 · schemaHash 별도 — CAP-02·CAP-26 정정)
124:**catalogHash 정책** (CAP-02·CAP-26 정정):
125:- `catalogHash` = 6 YAML 파일 정렬 후 SHA-256 concat hash (데이터 한정)
126:- `schemaHash` = schema.json 단일 파일 SHA-256 hash (별도 metadata)
128:- `kssAvailable` = runtime capability — metadata 안 (catalogHash 미포함)
129:- schema.json 변경 시 → `schemaHash` 변경, `catalogHash` 변경 안 됨 (룰 데이터 동일 시 영속 결과 동일)
139:    - rules.core.yaml
140:    - rules.medical-ad.yaml
141:  contextExceptions:
144:    - medical-law-tracking.yaml
148:  rules.core.yaml:
151:  rules.medical-ad.yaml:
157:  medical-law-tracking.yaml:
162:    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
165:> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).
169:- **rules.core.yaml** = CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (모든 의료광고 표현 룰 — 최상급/효과 단정/전문성 단정/보장 등). `sourceDoc: "core/CONTENT_STANDARDS.md#4.1"`. `legalBasis[]` 누락 또는 generic
170:- **rules.medical-ad.yaml** = MEDICAL_AD § 3.1~3.14 의료법 인용 overlay. `overrides[]` 사용하여 rules.core.yaml 의 canonical 룰에 `legalBasis[]` 정확 매핑 추가. 일부는 신규 룰 (의료법 특화 — 외국인환자·기사형 광고 등)
171:- 머지 결과 = 단일 RiskRule[] 컬렉션 안 canonical 룰별 `legalBasis[]` 정확 매핑
173:### 2.4 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 (CAP-04 정정)
175:| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | canonical ruleId | legalBasis[] |
177:| § 3.1 | `new-medical-technology-unevaluated-001` | **생성** | `new-medical-technology-unevaluated-001` (rules.medical-ad.yaml) | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
180:| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
182:| § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
185:| § 3.6 | `graphic-procedure-001` | **canonical 흡수** → `before-after-photo-001` (전후사진 운영 단순화 — 수술 장면도 본 룰 안 포함) | `before-after-photo-001` | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
188:| § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
189:| § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
190:| § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
191:| § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
195:| § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
200:| § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
201:| § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
202:| § 3.14 | `award-endorsement-001` | **생성** (canonical — 인증/보증/추천 단일 룰) | 동일 | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
203:| § 3.14 | `false-award-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
204:| § 3.14 | `false-endorsement-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
206:**생성**: 13 canonical 룰 · **canonical 흡수**: 11 SoT 예시 ID → 5 canonical 흡수 · **카탈로그 미등록**: 1 (`unreviewed-ad-001` runtime-meta) · **Phase Beta defer**: 1 (`side-effect-missing-001`).
208:### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)
223:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
231:### 2.6 `rules.medical-ad.yaml` (CA-RULES-01 · CAP-28 정정)
233:rules.core.yaml 의 canonical 룰에 `overrides[]` 로 `legalBasis[]` 추가 + 의료법 특화 신규 룰 (외국인환자 · 기사형 광고 · 신의료기술 · 단기 임상경력 · 인증/보증 등).
240:# rules.core.yaml canonical 룰 안 legalBasis[] 추가
259:    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
261:  # ... (각 canonical 룰 안 legalBasis overlay)
349:    rationale: "MEDICAL_AD § 3.6 - 수술 장면/환부 노출 흡수 (CAP-04 canonical 흡수)"
437:> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).
511:> **CAP-17 정정**: contextExceptions 적용 시 — finding 안 카테고리가 `appliesTo.categories[]` 와 일치 + finding span 과 exception pattern span 이 같은 문장 (KSS fallback 시 정규식 한계) 안 overlap 또는 인접해야 함. `fail` composite 룰 (예: `guarantee-composite-001`) 은 안전 보장 위해 예외 미적용.
513:### 2.8 `medical-law-tracking.yaml` SoT seed (CAP-27 정정)
541:slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
573:기타 RISK_LEVELS § 3.3 SoT 표 (RiskRule · ContextException · medical-law-tracking · meta · overrides 검증) 모두 적용.
590:│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
591:│   ├── exceptions.ts      # contextExceptions 적용 (CAP-17)
593:│   ├── risk-inference.ts  # MAX 결합 + evaluatedSteps + contributingSteps (CAP-12)
595:│   ├── hash.ts            # catalogHash + schemaHash 분리 산정 (CAP-26)
605:  contextExceptions: ContextException[];
609:  catalogHash: string;       // 6 YAML 데이터 hash만 (CAP-26)
610:  schemaHash: string;        // schema.json hash (별도)
619:- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
620:- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
621:- `feature` scope 룰 → skip + warnings.push (CA-DEFER-16)
623:- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
624:- KSS 모듈 import 시도 → 실패 시 `kssAvailable=false` + warning log
631:### 3.4 catalogHash + schemaHash 분리 산정 (CAP-26 정정)
650:- `catalogHash` = 데이터 결정성 (동일 데이터 → 동일 hash)
651:- `schemaHash` = 검증 규칙 변경 추적 (별도 metadata)
671:  contextExceptions: ContextException[],
683:  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
696:  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
705:- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
706:- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
707:- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
712:- FAQ check() 입력 시 — `qaBlocks` 입력 안 question/answer 분리
714:- finding.location 은 전체 body 안 offset (qaBlocks 안 offsetStart 더해 변환)
715:- v0.1 안 `qa` block scope 룰 등록 안 함 (rules.core/medical-ad.yaml 안 모두 global) — 단순히 qaBlocks 입력 지원만 활성 (Phase Beta 안 qa block 전용 룰 추가 가능)
746:## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01 · CAP-17 정정)
760:     c. **평가 대상 텍스트 = 같은 문장 (KSS 분리 또는 fallback) 안 + finding.location 과 exception span overlap 또는 인접 (within 30 chars)** (CAP-17)
765:### 5.2 "같은 문장" 계산 (KSS fallback)
767:- KSS 가용 시 — body 전체 KSS 분리 → finding.location.start 포함 문장 추출
768:- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
773:`auto_check_result.extensions.suppressedByContextExceptions[]` (단일 경로). 각 항목:
785:## 6. composite + KSS fallback 평가 (CA-COMPOSITE-01)
803:### 6.5 KSS Phase Beta defer 결정 (CAP-01 정정)
805:**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
806:1. KSS 패키지 선택·운영 risk 별도 cycle 필요
813:- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
814:- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)
816:**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).
826:import { calculateFinalRoles } from './final-roles';   // CAP-14 - 기존 helper 단일 경로
829:  // 1. LegalDocument 진입 차단 (M0 유지)
830:  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);
845:  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
849:    qaBlocks: input.metadata.qaBlocks,   // CAP-24 - FAQ 시
873:  // 9. 외부 inferredRiskLevel 입력 MAX 결합 (CAP-11)
874:  let finalRiskLevel = inference.inferredRiskLevel;
875:  let inferredRiskLevelMismatch: { external?: RiskLevel; internal: RiskLevel; final: RiskLevel } | undefined;
876:  if (input.metadata.inferredRiskLevel) {
877:    finalRiskLevel = maxRisk(inference.inferredRiskLevel, input.metadata.inferredRiskLevel, 'Low');
878:    if (input.metadata.inferredRiskLevel !== inference.inferredRiskLevel) {
879:      inferredRiskLevelMismatch = {
880:        external: input.metadata.inferredRiskLevel,
881:        internal: inference.inferredRiskLevel,
901:  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)
902:  const requiredApproverRoles = calculateFinalRoles({
926:      catalogHash: catalog.catalogHash,
932:      riskInferenceEvaluatedSteps: inference.evaluatedSteps,   // CAP-12 - 모든 source evaluation
933:      riskInferenceContributingSteps: inference.contributingSteps,   // base 갱신 source
935:      inferredRiskLevelMismatch,                               // CAP-11
937:      engineMetadata: {                                        // CAP-26
939:        catalogHash: catalog.catalogHash,
940:        schemaHash: catalog.schemaHash,
949:> **DB persist 시** (CAP-19 정정): `auto_check_result = { ...envelope.result, extensions: envelope.extensions }` 합성. SoT 7 필드 (CONTENT_STANDARDS § 7.2) 위치 안 침해 없음 — `extensions` 키는 result 안에 nested 되어 JSONB 단일 컬럼 안 모두 영속.
982:| `includes-effect-claim` | matchResult.findings 안 **SoT 7 카테고리 문자열 정확 매칭** (CAP-05): `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"` 중 1개 이상. `"최상급"`·`"보장 결합 강조"` 등은 **미포함** (CAP-05) |
990:LegalDocument 는 check() 진입 자체 차단되므로 runtime 영향 없음 (dead code marker — CAP-22). 실 적용:
997:> LegalDocument 안 documentType별 완화 표 — **공용 inlineFlags extractor 직접 호출 시 만** 사용 (테스트/미래 경로). runtime check() 안 미실행 (CAP-22).
1010:  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;   // CAP-24
1015:> CONTENT_STANDARDS § 7.1 cascade — metadata 안 7 신규 필드 (모두 optional). CA-CASCADE-06.
1030:### 9.2 Phase Beta 합류 시 (CA-DEFER-18)
1040:### 10.1 알고리즘 — evaluatedSteps + contributingSteps 분리 (CAP-12)
1044:  inferredRiskLevel: RiskLevel;
1045:  evaluatedSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;     // 모든 source evaluation (CAP-12)
1046:  contributingSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;  // base 갱신 source만
1050:  const evaluatedSteps = [];
1051:  const contributingSteps = [];
1054:  evaluatedSteps.push(baseStep);
1055:  contributingSteps.push(baseStep);
1060:    evaluatedSteps.push(step);
1063:      contributingSteps.push(step);
1070:    evaluatedSteps.push(step);
1073:      contributingSteps.push(step);
1079:    evaluatedSteps.push(step);
1082:      contributingSteps.push(step);
1089:    evaluatedSteps.push(step);
1092:      contributingSteps.push(step);
1096:  return { inferredRiskLevel: final, evaluatedSteps, contributingSteps };
1116:  const triggeredBy = determineTriggeredBy(input);   // CAP-13 - input 만 검사
1130:function determineTriggeredBy(input: ComplianceCheckInput): 'explicit' | 'inferred' {
1144:### 11.2 requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)
1146:`calculateFinalRoles` (apps/web/src/lib/compliance/final-roles.ts) 사용. M0 patterns:
1149:- + contentType==='LegalDocument' → legal (LegalDocument 면제이므로 본 cycle 안 적용 안 됨)
1160:export async function enqueueContentGateIfNeeded(
1197:- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker
1234:- `qaBlocks` = `[{ question, answer, offsetStart: 0 }]` (CAP-24)
1246:## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소 · CAP-18·19 정정)
1248:### 14.1 `auto_check_result` JSONB 구조 — 통일 위치 (CAP-18·19)
1283:    "inferredRiskLevelMismatch": null,
1285:    "engineMetadata": {
1287:      "catalogHash": "abc123...",
1288:      "schemaHash": "def456...",
1301:  meta: { pageRiskLevel, catalogVersion, catalogHash, manualReview, exemptReason? };
1311:  inferredRiskLevelMismatch?: { external: RiskLevel; internal: RiskLevel; final: RiskLevel };
1313:  engineMetadata: { catalogVersion: string; catalogHash: string; schemaHash: string; engineVersion: string; kssAvailable: boolean };
1317:> CONTENT_STANDARDS § 7.2 SoT 침해 없음 (`ComplianceCheckResult` 안은 그대로 7 필드. `extensions` 는 envelope 외 영역). DB persist 시 합성하여 단일 `auto_check_result.extensions` 키 안 모두 영속.
1321:`compliance_record.auto_check_result` JSONB — 컬럼 ADD 없음. sentinel row 안 extensions 부재일 뿐 — 어드민 UI 안 기본값 처리.
1331:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01
1381:### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)
1394:| 23 | "최고의" 매칭 → category "최상급" → SoT 7 카테고리 안 미포함 → includes-effect-claim 미활성 (CAP-05) | inlineRiskFlags=[] |
1395:| 24 | "100% 효과" 매칭 (guarantee-composite-001) → category "전문성 단정 (효과·결과·보장 결합)" → 7 카테고리 안 포함 → includes-effect-claim 활성 | flag 활성 |
1404:| 28 | P-010 + articleType=notice → Low | inferredRiskLevel='Low' · contributingSteps 1건 |
1405:| 29 | P-010 + articleType=effect-result-related → High | inferredRiskLevel='High' · contributingSteps 2건 · evaluatedSteps 2건 |
1407:| 31 | P-002 + explicitRiskLevel='High' → High (explicit override) | contributingSteps 안 explicitRiskLevel source |
1408:| 32 | P-002 + 모든 입력 Low → Low | contributingSteps 1건 (pageType) |
1409:| 33 (CAP-11) | 외부 inferredRiskLevel='High' + 내부 추론 Medium → 최종 High + mismatch metadata | extensions.inferredRiskLevelMismatch 안 external='High' · internal='Medium' · final='High' |
1410:| 34 (CAP-12) | P-010 + articleType=notice + inlineRiskFlags=[includes-event] + explicit=Low → inlineFlag High 격상 + explicit Low 영향 없음 | evaluatedSteps 4건 · contributingSteps 2건 (pageType + inlineRiskFlag) |
1425:| 39 (CAP-35) | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 + includes-effect-claim flag + RiskInference High 가상 finding | findings 안 ruleId 안 'guarantee-composite-001' 포함 · 'risk-level-high-gate' 포함 · automatedDecision='block' · findings.length ≥ 2 (정확 count 안 고정 - "contains ruleIds" 검증) |
1426:| 40 | FAQ 정상 본문 → findings=[] · automatedDecision='pass' · inferredRiskLevel='Low' | draft 가능 |
1429:### 16.8 LegalDocument exempt (1건)
1433:| 42 | contentType='LegalDocument' 입력 → check() throw ComplianceConfigError | buildLegalDocumentExemptEnvelope 호출 시 정상 envelope |
1443:| 1 | `data/compliance-rules/` 6 YAML + schema.json 작성 | meta · rules.core · rules.medical-ad · context-exceptions · medical-law-tracking · slot-matches (v0.0 placeholder) · schema.json |
1445:| 3 | loader + JSON Schema 검증 (Ajv) + catalogHash/schemaHash 분리 산정 | loader.ts · hash.ts |
1447:| 5 | composite 평가 + KSS fallback wrapper | composite.ts · kss.ts |
1448:| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
1450:| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
1452:| 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
1460:| 18 | vitest 42 scenarios (cycle 1 정정 시나리오 17a/17b · 33 · 34 · 38 · 39 · 41 추가) | __tests__/ |
1461:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 | doc patches |
1465:## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)
1467:- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
1468:- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) cascade
1469:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1470:- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
1471:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
1472:- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
1473:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 17 SoT 예시 ID → canonical 매핑 (CAP-04)
1474:- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
1475:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30 신설 marker** (CAP-25 정정)
1483:| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
1484:| MA-Q02 | includes-effect-claim 7 카테고리 안 supremacy / 보장 결합 강조 정합 | **SoT 7 문자열 정확 매칭** (CAP-05) — "최상급" 미포함 · "전문성 단정 (효과·결과·보장 결합)" 포함 |
1490:| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
1491:| MA-Q09 | medical-law-tracking baseline | **MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27) |
1500:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1501:| 2026-05-19 | **v0.2** | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

codex
초기 검색상 v0.2에는 cycle 1 패치 흔적이 대부분 들어와 있습니다. 이제 실제 SoT 문서와 구현 시그니처를 대조해서 “문서 안 명세가 실행 가능한지” 위주로 좁혀 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 208 -First 235' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 815 -First 145' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/final-roles.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/types.ts | Select-Object -First 220' in C:\Users\assag\solution\website-exposure
 succeeded in 690ms:
// @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
// REVIEW_WORKFLOW § 4.1 SoT.

import type { ApproverRole, ContentType, RiskLevel } from "./types";
import { ComplianceConfigError } from "./types";

const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
 *   server action 안 try/catch 로 form-level error 변환.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (r === "client") {
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);
  }
  return Array.from(roles).sort();
}

export type ComplianceRecordRow = {
  peer_reviewer: string | null;
  peer_reviewed_at: Date | null;
  physician_approver: string | null;
  physician_approved_at: Date | null;
  legal_counsel: string | null;
  legal_counsel_at: Date | null;
  page_risk_level: RiskLevel;
  prior_review_required: boolean;
  prior_review_passed: boolean | null;
  auto_check_result: unknown;
};

export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
  if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
  if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
  if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
  return false;
}

 succeeded in 715ms:
**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).

---

## 7. check() 9단계 풀 흐름 (CA-CHECK-01)

### 7.1 새 시그니처 (CAP-06·11 정정)

```typescript
import { loadCatalog, matchRules, evaluateInline, inferRisk, evaluateSlots } from '@glitzy/compliance-rules';
import { calculateFinalRoles } from './final-roles';   // CAP-14 - 기존 helper 단일 경로

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // 1. LegalDocument 진입 차단 (M0 유지)
  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);

  // 2. pageTypeId 유도
  const pageTypeId = input.metadata.pageTypeId ?? derivePageTypeId(input.contentType);
  if (!pageTypeId) throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);

  // 3. articleType 검증
  if (input.contentType === 'Article' && !input.metadata.articleType) {
    throw new ComplianceConfigError(`Article 은 articleType required`);
  }

  // 4. 카탈로그 로드
  const catalog = await loadCatalog();

  // 5. RiskRule 매칭
  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    qaBlocks: input.metadata.qaBlocks,   // CAP-24 - FAQ 시
  }, catalog.kssAvailable);

  // 6. inlineRiskFlags 추출 (§ 8)
  const inlineFlagResult = evaluateInline(input.body, matchResult.findings, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    legalDocumentType: input.metadata.legalDocumentType,
    locationProfileField: input.metadata.locationProfileField,
  });

  // 7. slotMatches 계산 (v0.1 안 항상 빈 배열 - CAP-09)
  const slotMatches = evaluateSlots(input, catalog.slotMatches);  // [] returned

  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
  const inference = inferRisk({
    pageTypeId,
    articleType: input.metadata.articleType,
    inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
    slotMatches,
    explicitRiskLevel: input.metadata.explicitRiskLevel,
  });

  // 9. 외부 inferredRiskLevel 입력 MAX 결합 (CAP-11)
  let finalRiskLevel = inference.inferredRiskLevel;
  let inferredRiskLevelMismatch: { external?: RiskLevel; internal: RiskLevel; final: RiskLevel } | undefined;
  if (input.metadata.inferredRiskLevel) {
    finalRiskLevel = maxRisk(inference.inferredRiskLevel, input.metadata.inferredRiskLevel, 'Low');
    if (input.metadata.inferredRiskLevel !== inference.inferredRiskLevel) {
      inferredRiskLevelMismatch = {
        external: input.metadata.inferredRiskLevel,
        internal: inference.inferredRiskLevel,
        final: finalRiskLevel,
      };
    }
  }

  // 10. High 가상 finding 주입 (§ 11)
  const allFindings = [...matchResult.findings];
  if (finalRiskLevel === 'High') {
    allFindings.push(buildHighGateFinding(input, inference));
  }

  // 11. priorReviewRequired 메타 검사 (§ 7.3)
  if (input.metadata.priorReviewRequired === true && input.metadata.priorReviewPassed !== true) {
    allFindings.push(buildUnreviewedAdFinding());
  }

  // 12. severity 집계 + automatedDecision
  const aggregated = aggregate(allFindings);

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)
  const requiredApproverRoles = calculateFinalRoles({
    contentType: input.contentType,
    pageRiskLevel: finalRiskLevel,
    priorReviewRequired: input.metadata.priorReviewRequired ?? false,
    findingsRequiredRoles: extractFindingRoles(allFindings),   // findings 안 requiredApproverRoles 합집합
  });

  // 14. client role 처리 (CAP-15)
  const clientRolePresent = requiredApproverRoles.includes('client');
  const runtimeRoles = requiredApproverRoles.filter(r => r !== 'client');   // v0.1 안 client 큐 처리 불가

  return {
    result: {
      automatedDecision: aggregated.automatedDecision,
      buildBlocked: aggregated.buildBlocked,
      gateRequired: aggregated.gateRequired,
      hasWarnings: aggregated.hasWarnings,
      findingsBySeverity: aggregated.bySeverity,
      requiredApproverRoles: runtimeRoles,
      findings: allFindings,
    },
    meta: {
      pageRiskLevel: finalRiskLevel,
      catalogVersion: catalog.catalogVersion,
      catalogHash: catalog.catalogHash,
      manualReview: false,
    },
    extensions: {                                              // CAP-19 - envelope.extensions 별도 영역
      suppressedByContextExceptions: matchResult.suppressedFindings,
      inlineRiskFlagsEvidence: inlineFlagResult.evidence,
      riskInferenceEvaluatedSteps: inference.evaluatedSteps,   // CAP-12 - 모든 source evaluation
      riskInferenceContributingSteps: inference.contributingSteps,   // base 갱신 source
      ruleMatchStats: { categoryCounts: countByCategory(matchResult.findings), elapsedMs: 0 },
      inferredRiskLevelMismatch,                               // CAP-11
      clientRolePresent,                                       // CAP-15
      engineMetadata: {                                        // CAP-26
        catalogVersion: catalog.catalogVersion,
        catalogHash: catalog.catalogHash,
        schemaHash: catalog.schemaHash,
        engineVersion: catalog.engineVersion,
        kssAvailable: catalog.kssAvailable,
      },
    },
  };
}
```

> **DB persist 시** (CAP-19 정정): `auto_check_result = { ...envelope.result, extensions: envelope.extensions }` 합성. SoT 7 필드 (CONTENT_STANDARDS § 7.2) 위치 안 침해 없음 — `extensions` 키는 result 안에 nested 되어 JSONB 단일 컬럼 안 모두 영속.

### 7.2 `derivePageTypeId` 매핑

(v0.1 동일 — § 7.2 v0.1 참조)

### 7.3 `priorReviewRequired` 메타 검사 (CAP-16 정정)

`unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:

```typescript
function buildUnreviewedAdFinding(): Finding {

 succeeded in 723ms:
// @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
// SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result

export type RiskLevel = "Low" | "Medium" | "High";

export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
export const ALLOWED_SUBMIT_TYPES = [
  "Article", "TreatmentPage", "LegalDocument",
  "FAQ", "Publication", "MediaAppearance",
] as const;
export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];

export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

// CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
export type ComplianceCheckInput = {
  contentType: ContentType;
  contentRef: string;
  body: string;  // Markdown
  metadata: {
    pageTypeId?: string;
    articleType?: string;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;
  };
  riskRules?: unknown[];  // M0 stub — 미사용
};

// CONTENT_STANDARDS § 7.2 Finding shape
export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
export type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    fail: number;
    "content-gate": number;
    warning: number;
    info: number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};

// M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;
    catalogHash: string;
    manualReview: boolean;
    exemptReason?: string;
  };
};

// 에러 type — fail closed
export class ComplianceConfigError extends Error {
  override readonly name = "ComplianceConfigError";
}
export class ComplianceTransitionError extends Error {
  override readonly name = "ComplianceTransitionError";
}
export class ReviewerEligibilityError extends Error {
  override readonly name = "ReviewerEligibilityError";
}

 succeeded in 739ms:

CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환. **각 RiskRule.category 는 SoT § 4.1 카테고리 칸 그대로 사용** (CAP-05 정정).

| RiskRule.id | category (SoT 정확 매칭) | severity | patternType | scope | sourceDoc |
|---|---|---|---|---|---|
| `supremacy-001` | "최상급" | fail | regex (`(최고의\|최저가\|최대\|최강\|1위\|국내\s*유일\|세계\s*최초\|세계\s*최고)`) | global | core/CONTENT_STANDARDS.md#4.1 |
| `effect-assertion-001` | "효과 단정" | fail | regex (`(완치\|100\s*%\s*효과\|반드시\s*효과\|안전합니다\|부작용\s*없음)`) | global | 동일 |
| `numeric-period-standalone-001` | "수치·기간 단정 (보장어 없음)" | content-gate (`["medical", "legal"]`) | composite (`\d+\s*(일\|주\|개월)` + `(만에\|기간)` AND_NEAR window=15) | global | 동일 |
| `numeric-period-guarantee-001` | "수치·기간 보장" | fail | composite (`\d+\s*(kg\|일\|주)` + `(보장\|약속)` AND_IN_SENTENCE) | global | 동일 |
| `comparison-001` | "비교 표현" | fail | regex (`(타\|다른\|기존)\s*(병원\|의원\|치료법)\s*(보다\|대비)`) | global | 동일 |
| `inducement-pressure-001` | "유인성 표현" | fail | regex (`(지금만\|특가\|한정\|기간\s*한정\|선착순\|오늘까지)`) | global | 동일 |
| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | scope=`{type:"global"}` 안 (`articleType=event-price` · `pageType=P-102` · `pageType=P-104` 외 검사 — scope OR 결합 단순화 — § 4.3 다층 검사) | 동일 |
| `diagnosis-assertion-001` | "진단 단정" | fail | composite (`(당신은\|당신의)` + `(병입니다\|확정\|확실)` AND_IN_SENTENCE) | global | 동일 |
| `authority-assertion-001` | "명의·권위 단정" | fail | regex (`(최고의\s*명의\|국내\s*1인자\|전국\s*최다)`) | global | 동일 |
| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
| `guarantee-composite-001` | "전문성 단정 (효과·결과·보장 결합)" | fail | composite (`(100\s*%\|반드시\|절대\|확실히)` + `(효과\|결과\|호전\|개선\|치유\|보장)` AND_IN_SENTENCE) | global | 동일 |
| `celebrity-001` | (의료법 호 별도 — § 3.10 가까움) | fail | regex (`(연예인\|아이돌\|배우)\s*(이\|가)?\s*받은`) | global | 동일 |
| `guarantee-explicit-001` | "보장 표현" | fail | regex (`(효과\s*보장\|결과\s*보장\|만족\s*보장\|재시술\s*무료)`) | global | 동일 |
| `body-type-claim-001` | "체질·맞춤 과대 표현" | content-gate (`["medical"]`) | regex (`(당신만의\s*1\s*:\s*1\s*맞춤\|당신의\s*체질에\s*완벽)`) | global | 동일 |

> CONTENT_STANDARDS § 4.1 표 14 카테고리 모두 cover. SoT 카테고리 7 (effect-claim 7 카테고리 — RISK_LEVELS § 5.1) 안 매칭 정합 (§ 8.1 참조).

### 2.6 `rules.medical-ad.yaml` (CA-RULES-01 · CAP-28 정정)

rules.core.yaml 의 canonical 룰에 `overrides[]` 로 `legalBasis[]` 추가 + 의료법 특화 신규 룰 (외국인환자 · 기사형 광고 · 신의료기술 · 단기 임상경력 · 인증/보증 등).

```yaml
version: "1.0.0"
sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#3"
sourceDocVersion: "1.0"

# rules.core.yaml canonical 룰 안 legalBasis[] 추가
overrides:
  - targetRuleId: "supremacy-001"
    patch:
      legalBasis: ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
    appliedAt: "2026-05-19T00:00:00Z"
  - targetRuleId: "effect-assertion-001"
    patch:
      legalBasis: ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
    appliedAt: "2026-05-19T00:00:00Z"
  - targetRuleId: "guarantee-composite-001"
    patch:
      legalBasis:
        - "medical-law-art56-para2-no2"
        - "medical-law-art56-para2-no8"
        - "enforcement-decree-art23-para1-no2"
        - "enforcement-decree-art23-para1-no8"
    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
    appliedAt: "2026-05-19T00:00:00Z"
  # ... (각 canonical 룰 안 legalBasis overlay)

# 의료법 특화 신규 룰
rules:
  - id: "new-medical-technology-unevaluated-001"
    category: "신의료기술 미평가 광고"
    pattern: '(신의료기술\|새로운\s*기술\|첨단\s*기술)\s*(효과\|안전)'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]
    rationale: "MEDICAL_AD § 3.1"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "testimonial-001"
    category: "치료경험담 광고"
    patternType: "composite"
    operands:
      - { pattern: '(저는\|환자분이\|내원자\s*후기\|체험기)', patternType: "regex" }
      - { pattern: '(효과\|결과\|변화\|호전\|개선)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]
    rationale: "MEDICAL_AD § 3.2"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "short-clinical-experience-001"
    category: "단기 임상경력 광고"
    pattern: '(\d{1,2})\s*개월\s*(임상\|경력)'   # 6 이하 조건은 runtime 산정 (예: parseInt + 검사) — 본 cycle 안 단순 regex (Phase Beta 안 runtime 검사 강화)
    patternType: "regex"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]
    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "false-statement-001"
    category: "거짓 진술"
    pattern: '(국내\|세계)\s*(1위\|최초\|유일)'   # CAP-29 한계 - citation absence 검사 부재
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no3"]
    rationale: "MEDICAL_AD § 3.3 - 인용/출처 부재 시 거짓 우려"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "false-credential-001"
    category: "법적 근거 없는 자격·명칭"
    patternType: "composite"
    operands:
      - { pattern: '(명의\|박사\|전문의)', patternType: "regex" }
      - { pattern: '(자격\|증명서\|면허)', patternType: "regex" }   # CAP-29 한계 - 인접 evidence 검사 부재
    logic: "AND_IN_PARAGRAPH"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]
    rationale: "MEDICAL_AD § 3.9 - 자격/명칭 거짓 표시"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "defamation-001"
    category: "비방 광고"
    pattern: '(비효율\|구식\|낙후)'   # CAP-29 한계 - 타 기관 reference 검사 부재 (Phase Beta composite 강화)
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no5"]
    rationale: "MEDICAL_AD § 3.5"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "before-after-photo-001"
    category: "전후사진 노출"
    pattern: '(전후\|비포어\s*애프터\|before\s*/?\s*after\|B/A)'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]
    rationale: "MEDICAL_AD § 3.6 - 수술 장면/환부 노출 흡수 (CAP-04 canonical 흡수)"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "editorial-format-ad-001"
    category: "기사형 광고"
    patternType: "composite"
    operands:
      - { pattern: '(기자\|특파원\|취재)', patternType: "regex" }
      - { pattern: '(병원\|의원\|클리닉)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no10"]
    rationale: "MEDICAL_AD § 3.10"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "foreign-patient-recruit-domestic-confirmed-001"
    category: "외국인환자 유치 국내광고 (확정)"
    patternType: "composite"
    operands:
      - { pattern: '(외국인\s*환자\|foreign\s*patient)', patternType: "regex" }
      - { pattern: '(의료관광\|메디컬\s*투어\|유치)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]
    rationale: "MEDICAL_AD § 3.12 확정 케이스"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "foreign-patient-recruit-domestic-uncertain-001"
    category: "외국인환자 유치 국내광고 (불명확)"
    pattern: '(foreign\s*patient\|international\s*patient)'   # 다국어 페이지 메타 검사 v0.1 한계 (Phase Beta runtime 강화)
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]
    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "non-covered-discount-pressure-001"
    category: "비급여 할인 압박형"
    patternType: "composite"
    operands:
      - { pattern: '(지금만\|특가\|한정\|선착순\|오늘까지)', patternType: "regex" }
      - { pattern: '(할인\|세일\|이벤트)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]
    rationale: "MEDICAL_AD § 3.13 압박형"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "non-covered-discount-misleading-001"
    category: "비급여 할인 사실 고지"
    pattern: '\d+\s*%\s*할인'   # 기간/대상 명시 부재 시 misleading - runtime evidence 검사 Phase Beta
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]
    rationale: "MEDICAL_AD § 3.13 사실 고지"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "award-endorsement-001"
    category: "상장·인증·보증·추천"
    patternType: "composite"
    operands:
      - { pattern: '(상장\|인증\|보증\|추천)', patternType: "regex" }
      - { pattern: '(받은\|보유\|획득)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]
    rationale: "MEDICAL_AD § 3.14 - 가~라목 예외 카탈로그 매칭 Phase Beta"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
```

> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).

### 2.7 `context-exceptions.yaml` (CA-EXCEPTION-DATA-01)

CONTENT_STANDARDS § 4.4 표를 그대로 변환. 5 contextException (safety 2 · warning-message 2 · administrative 1).

```yaml

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"4\\.1|효과 단정|전문성 단정|최상급|비교 표현|할인|유명인|연예인|체질|수치\" docs/core/CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.10|3\\.2|3\\.13|3\\.14|celebrity|유명인|연예인|치료경험담|11\\.2|2026-04-07|2026\\.04\\.07|재확인|reaffirm\" docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "slot-matches|slotMatches|CA-DEFER-17|CA-DEFER-18|CA-DEFER-19|CA-DEFER-20|CA-DEFER-21|CA-DEFER-22|CA-DEFER-29|CA-DEFER-30|CA-CASCADE" docs/compliance/RISK_LEVELS.md docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md docs/features/compliance-assistant.md docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-gate|priority|SLA|영업일|P0|P1|P2|P3" docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 649ms:
26:  - `medical-law-tracking.yaml`이 미생성인 동안 `RISK_LEVELS.md` § 3.3의 "파일 부재 시 fail" 검증은 **자체 룰 checker 비활성 상태에서만 유보**. checker 활성화 즉시 본 문서 § 11.2 표를 YAML로 변환해야 함 (실제 구현 마일스톤에서 동시 생성 — `RISK_LEVELS.md` § 7.1.3 절차 활성화 시점)
89:| 2호 | 환자에 관한 치료경험담 광고 (제3자가 환자의 치료경험을 표현하는 것 포함) | § 3.2 / § 5 |
97:| 10호 | 신문·방송·잡지 등을 이용하여 기사 또는 전문가의 의견 형태로 표현되는 광고 (기사형 광고) | § 3.10 |
100:| 13호 | **비급여 진료비용의 할인·면제 광고로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법** | § 3.13 / § 7 |
101:| 14호 | **각종 상장·감사장 등을 이용하는 광고 또는 인증·보증·추천 표현 광고** (원칙 금지, 가~라목 법정 예외는 **인증·보증 표시만** — 의료기관 인증(가목)·공공기관 인증·보증(나목)·다른 법령 인증·보증(다목)·WHO/ISQua 등 국제 인증(라목). 추천 표시는 예외 범위 아님) | § 3.14 |
119:| **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
120:| **제2항** | 제56조제2항제14호 라목의 **국제 인증 구체 범위** — WHO/ISQua 등 시행령이 정하는 국제 인증 | § 3.14 |
161:### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)
166:- **금지 1 (치료경험담)**: 환자 본인 또는 제3자가 환자의 치료경험을 표현하는 광고
217:### 3.10 기사형 광고 (제56조제2항제10호)
241:### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)
251:### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)
331:## 5. 환자 후기 (치료경험담) 운영 가이드
335:- **의료법 제56조제2항제2호 — 환자에 관한 치료경험담 광고 금지**
342:- 치료경험담 광고 형식의 직접 인용 — 본문에 환자 1인칭 사례·치료 효과 묘사를 그대로 노출 (CONTENT_STANDARDS § 4.3 "본문 직접 인용 원칙 금지" 정합)
343:- 치료 효과 오인 우려 — § 3.2 단정 표현(반드시·확실히·100%) 결합
362:- 전후사진은 본 호의 시행령 결합 영역 (수술 장면·환부 노출에 해당될 수 있음) + 사실 과장(제8호)·치료경험담(제2호) 결합 리스크
373:- 시행령 제23조제1항제2호 (치료효과 단정·치료경험담) 위반 부재
393:- 일괄 금지 아님 — 허위·불명확·압박형은 fail, 명확한 사실 고지는 법무 검수 후 발행 (§ 3.13 정합)
554:### 11.2 개정 이력 (실제 추적 — 운영 누적)
560:| `2026-Q2-medical-law-2026-04-07` | `의료법` | `["제56조 제2항", "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.kr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속 |
561:| `2026-Q1-enforcement-decree-2026-02-10` | `의료법 시행령` | `["제23조", "제24조"]` | `2026-02-10` (시행령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655 | `2026-05-14T00:00:00Z` | `operator:seokcess@glitzy.kr` | `[]` | `{ kind: "all" }` | v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인 |
569:1. 본 문서 § 11.2 표에 revision 추가
597:| 의료법 제56조제2항 15호 각 호의 **법문 전문 인용** | 본 문서는 카테고리·해석·운영 가이드 SoT. 법문 전문은 국가법령정보센터 원문(§ 11.2 sourceUrl) 직접 조회로 보완. 본 문서에 전문 인용 시 개정 추적 부담 + 갱신 지연 리스크 증가 |
608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
611:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (13개 지적 전건 수용 — 의료법 조문 구조 전면 재작성)**: (1) § 2.2 의료법 제56조제2항 **15호 카탈로그**로 재구성 (이전 11종 오류 수정). 비방·수술장면 노출·기사형·미심의·외국인환자 유치 국내광고·비급여 할인면제 오인·인증 부정사용·상장 부정사용 추가, (2) § 2.1 제1항(비의료인 광고 금지·정의)과 제2항(금지 유형) 구조 분리 — 이전 "제1항 금지 항목" 표현 오류 정정, (3) § 3.1 평가받지 아니한 **신의료기술** 광고로 정정 (미승인 의료기기·약품은 약사법·의료기기법 별도), (4) § 3.4·§ 3.5·§ 3.6 등 호 번호 정정 (비교 4호·비방 5호·수술장면 6호·과대 8호·기사형 9호·미심의 10호 등), (5) § 3.6 수술 장면·환부 노출(시행령 결합)과 § 6 전후사진 보수적 운영 정책 구분, (6) § 4.1 제56조제3항 방송 광고 매체 자체 금지 명시 — TV·라디오 "심의 통과 시 가능" 오해 회피, (7) § 4.2 시행령 제24조제1항 4종 매체 + 제2항 SNS 매체 정확히 분류, (8) § 4.4 사전심의 면제 항목을 시행령 제24조제7항 한정 항목(성명·성별·면허종류·전문의 자격·전문과목·진료시간·진료과목)으로 좁힘. 일반 학력·경력 과잉 면제 정정, (9) § 1.2 SoT 분리표 — 표현 카테고리 원본은 `CONTENT_STANDARDS § 4`, 본 문서는 의료법 조문·매핑 SoT로 제한, (10) § 8 인용 가능 도메인 화이트리스트 정밀화 — 와일드카드 제거·기관 단위 등록·원문/검색 구분·KoreaMed 등 한국 학술 추가·인정 않는 카테고리 명시, (11) § 0 data/compliance-rules/ 미생성 명시 — v0.1 시점 파일 부재. ID는 예시, (12) § 10.3 다국어 — `PageMeta.inLanguage` + `InternationalSupport` 결합, 사전 결합 AND→**finding 합집합** 정정, (13) § 11.2 개정 이력 표를 `medical-law-tracking.yaml`과 동일 11개 컬럼(lawSource·affectedArticles·revisionType·checkedAt/By·affectedRuleIds·staleScope 등)으로 정합 + 시행령 별도 행 추가. MA-06 미결정 신설 |

 succeeded in 652ms:
85:체질에 맞춘 한약 처방, 지방대사 약침, 1:1 식이 상담으로 구성되며, 평균 4주 단위로 진행 결과를 점검합니다.
101:5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
148:답변: 한방 다이어트의 효과 인지 시점은 개인의 체질·생활 습관·복약 순응도에 따라 다르며, 일반적으로 4주 단위로 변화를 점검합니다.
160:| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
161:| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |
179:- 수치·범위 (소요 시간·횟수)
183:- 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
206:- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
227:### 4.1 금지 표현 (fail / content-gate)
231:| **최상급** | "최고의·최저가·최대·최강·1위·국내 유일·세계 최초·세계 최고" | **fail** (콘텐츠 발행 차단) |
232:| **효과 단정** | "완치·100% 효과·반드시 효과·안전합니다·부작용 없음" | **fail** |
233:| **수치·기간 단정 (보장어 없음)** | "○○일 만에·○○주 만에·체중 ○○kg 감량 (수치·기간 단정, '보장'·'약속'·'반드시' 어휘 미포함)" | **content-gate** (의료진·법무 검수 필요) |
234:| **수치·기간 보장** | "○○kg 보장·○○일 안에 보장·○○주 약속" — 수치/기간 + 보장어 결합 | **fail** (보장 표현 통합 룰) |
235:| **비교 표현** | "타 병원보다·다른 의원보다·기존 ○○보다 우수" | **fail** |
237:| **할인·이벤트 사실 안내** | "20% 할인 진행·○월 이벤트" (시간·수량 압박어 미포함, 사실 진술) | **content-gate** (의료광고법 환자 유인 해당 여부 법무 판정 필요. P-104·P-102에서만 허용) |
240:| **전문성 단정 (단독 어휘)** | "절대·반드시·확실히·100%" (효과·결과·보장 등 결과어와 결합되지 않은 단독 사용) | **content-gate** |
241:| **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
242:| **유명인 동원** | (의료법상 환자 유인) "○○○ 연예인이 받은" | **fail** |
244:| **체질·맞춤 과대 표현** | "당신만의 1:1 맞춤·당신의 체질에 완벽" | **content-gate** (한의 특유 표현 회색지대) |
252:| "최고의 다이어트 한약" | "체질 기반 다이어트 한약 처방" |
253:| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
256:| "지금 신청하시면 50% 할인" | (할인 미명시) "예약 안내는 ○○로 연락 바랍니다" |
257:| "유명인 ○○도 받은 시술" | (유명인 미언급) "본원 시술 사례는 ○○ 페이지에서 확인 가능합니다" — 단 후기·전후사진은 별도 ReviewPolicy 적용 |
258:| "효과 보장" | "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" |
264:| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
266:| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
272:다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.
276:| **safety** (의료 안전 권유) | "(반드시\|꼭) (의료진과 )?(상담\|확인)하세요", "복용 전 (반드시 )?확인" | "전문성 단정 (단독 어휘)" | 안전 권유 표현은 의료광고 위반 아님 |
277:| **warning-message** (주의·금기 안내) | "(절대 )?금기", "(주의\|경고)\\s*[:：]", "복용 금지", "사용 금지" | "전문성 단정 (단독 어휘)" | 안전 정보 안내 |
278:| **administrative** (행정·약관) | "100%\\s*(환불 불가\|환불 보증\|예약 변경 불가)" 등 법적·약관 표현 | "전문성 단정 (단독 어휘)", "보장 표현" (행정 한정) | 약관·환불·결제 안내 |
297:- 개인 스토리 (`personalStory`)에 효과 단정 금지 (의료진 본인 스토리도 후기 위험도와 유사)
302:- 효과·기간·수치 단정 금지
317:- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
322:- § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
323:- "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
330:- 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수
338:RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
344:| `treatment-explainer` | Medium | 특정 시술 설명 — 효과 단정 금지. 절차·원리·대상·주의사항 위주 |
346:| `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
348:| `event-price` | **High** | 이벤트·할인·가격 안내 — 의료광고법 환자 유인 금지 적용. § 5.7·§ 5.8 정합 |
511:  category: string;           // § 7.4 RiskRule.category (예: "최상급")
532:§ 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.
538:  category: string;            // § 4.1 카테고리
542:  scope: ContentScope[];       // 적용 범위 — § 7.4.1
600:#### 7.4.1 스코프 일치 규칙
621:- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
626:- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
636:| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
638:| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
647:| CS-04 | 한의 특유 표현(체질·1:1 맞춤)의 회색지대 정밀 분류 | `presets/hanui-clinic/` 후속 |
657:| ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 642ms:
21:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
158:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
159:| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
160:| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |
166:- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
168:#### 3.1.2 content-gate와 warning 동시 발생 처리
170:ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
171:- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
173:- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)
190:### 3.3 우선순위·SLA
192:| 처리 영역 | SLA 목표 | 알림 정책 SoT |
195:| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
196:| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
197:| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |
199:SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).
201:> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.
468:  | "content-gate-queued"           // content-gate 큐 진입
476:  | "sla-imminent"                  // SLA 24시간 전
477:  | "sla-overdue"                   // SLA 미달
519:이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.
523:| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
531:| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
532:| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
613:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
775:| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
776:| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |
785:| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
807:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

 succeeded in 657ms:
docs/compliance/RISK_LEVELS.md:70:  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
docs/compliance/RISK_LEVELS.md:576:- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
docs/features/compliance-assistant.md:180:  slotMatches: SlotMatch[];
docs/features/compliance-assistant.md:435:  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
docs/features/compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:39:| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:51:| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:715:### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:795:| 14 | audit emit 4종 (REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade) | (각 server action 안 emitAuditEvent + CA-CASCADE-06 doc patch) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:797:| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:825:- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker — subset 명시 + CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns 분리)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:826:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:827:- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:828:- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:829:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:830:- `CA-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 9.1.1 + `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` audit matrix cascade — eventType 4종 · payload shape · emit 시점 (tx commit 후 base role) · 실패 정책
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:837:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 finding 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 28 → 5 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 5 cycle 36 findings 전건 수용. acceptance commit 7 cascade docs 동시 포함 marker (CA-CASCADE-01~06 + plan 본문). 실 SQL 코드 cascade 는 별 cycle (compliance-assistant M0 code v1.0). |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 173 -First 35' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md | Select-Object -Skip 150 -First 125' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/compliance/RISK_LEVELS.md | Select-Object -Skip 20 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/features/compliance-assistant.md | Select-Object -Skip 110 -First 90' in C:\Users\assag\solution\website-exposure
 succeeded in 735ms:
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

 succeeded in 743ms:
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

 succeeded in 782ms:

| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | canonical ruleId | legalBasis[] |
|---|---|---|---|---|
| § 3.1 | `new-medical-technology-unevaluated-001` | **생성** | `new-medical-technology-unevaluated-001` (rules.medical-ad.yaml) | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
| § 3.2 | `testimonial-001` | **생성** (composite) | `testimonial-001` | `["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]` |
| § 3.2 | `short-clinical-experience-001` | **생성** | `short-clinical-experience-001` | 동일 |
| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
| § 3.3 | `false-statement-001` | **생성** (단순 regex · CAP-29 한계 명시) | `false-statement-001` | `["medical-law-art56-para2-no3"]` |
| § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
| § 3.4 | `comparison-001` | **생성** | `comparison-001` | `["medical-law-art56-para2-no4", "enforcement-decree-art23-para1-no4"]` |
| § 3.5 | `defamation-001` | **생성** | `defamation-001` | `["medical-law-art56-para2-no5"]` |
| § 3.6 | `graphic-procedure-001` | **canonical 흡수** → `before-after-photo-001` (전후사진 운영 단순화 — 수술 장면도 본 룰 안 포함) | `before-after-photo-001` | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
| § 3.6 | `before-after-photo-001` | **생성** | 동일 | 동일 |
| § 3.7 | `side-effect-missing-001` | **Phase Beta defer** (CAP-30 — NOT_IN_PARAGRAPH logic 부재) | (미생성) | `["medical-law-art56-para2-no7"]` (Phase Beta) |
| § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
| § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
| § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
| § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
| § 3.8 | `supremacy-001` | **생성** | `supremacy-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
| § 3.8 | (단독 어휘) | **생성** | `professional-assertion-standalone-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
| § 3.9 | `false-credential-001` | (§ 3.3 흡수 처리) | (위 참조) | 위 |
| § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
| § 3.10 | `editorial-format-ad-001` | **생성** | `editorial-format-ad-001` | `["medical-law-art56-para2-no10"]` |
| § 3.11 | `unreviewed-ad-001` | **카탈로그 미등록** (CAP-16 정정 — runtime-meta · § 7.3 별도 평가) | (미등록 · check() 별도 흐름) | `["medical-law-art56-para2-no11"]` (audit metadata 안) |
| § 3.12 | `foreign-patient-recruit-domestic-confirmed-001` | **생성** (composite — 한국어 + 외국인 환자 + 의료관광) | 동일 | `["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]` |
| § 3.12 | `foreign-patient-recruit-domestic-uncertain-001` | **생성** (composite — 다국어 페이지 메타 + 외국인 환자) | 동일 | 동일 |
| § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
| § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
| § 3.14 | `award-endorsement-001` | **생성** (canonical — 인증/보증/추천 단일 룰) | 동일 | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
| § 3.14 | `false-award-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
| § 3.14 | `false-endorsement-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |

**생성**: 13 canonical 룰 · **canonical 흡수**: 11 SoT 예시 ID → 5 canonical 흡수 · **카탈로그 미등록**: 1 (`unreviewed-ad-001` runtime-meta) · **Phase Beta defer**: 1 (`side-effect-missing-001`).

### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)

 succeeded in 775ms:
> CONTENT_STANDARDS § 7.4 RiskRule 스키마에 `legalBasis: string[]` 필드 cascade 필요 — RISK_LEVELS § 3.3 JSON Schema 검증에 항목 추가.

> RiskRule ID는 권장 형식 예시이며, 실제 ID는 `rules.medical-ad.yaml` 파일 작성 시 확정 (MA-06 참조).

### 3.1 평가받지 아니한 신의료기술 광고 (제56조제2항제1호 + 시행령 제23조제1항제1호)

- **RiskRule (예시 ID)**: `new-medical-technology-unevaluated-001`
- **금지**: 평가받지 아니한 신의료기술 (보건복지부 신의료기술평가위원회 미평가)을 효과·안전성 측면에서 광고
- **구분**: 식약처 미승인 의료기기·약품 광고는 별도 규제(약사법·의료기기법) — 본 호에 직접 매핑하지 않음

### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)

시행령 제23조제1항제2호는 본 호의 구체 기준으로 **3가지 유형**을 함께 다룬다:

- **RiskRule (예시 ID)**: `testimonial-001`, `short-clinical-experience-001`, `treatment-effect-assertion-001`
- **금지 1 (치료경험담)**: 환자 본인 또는 제3자가 환자의 치료경험을 표현하는 광고
- **금지 2 (단기 임상경력)**: **6개월 이하의 임상경력**을 광고하는 행위
- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
- **세부 운영**: § 5 참조

### 3.3 거짓된 내용을 표시하는 광고 (제56조제2항제3호)

- **RiskRule (예시 ID)**: `false-statement-001`, `false-credential-001`
- **금지**: 사실과 다른 효과·자격·실적 표시
- **검출**: 통계·자격·실적 주장 + 인용 부재 → content-gate (`CONTENT_STANDARDS § 3.5`)

### 3.4 비교 광고 (제56조제2항제4호 + 시행령 제23조제1항제4호)

- **RiskRule (예시 ID)**: `comparison-001`
- **금지**: "타 병원보다·다른 의원보다·기존 ○○보다 우수"
- **허용**: 본원의 진료 방식·실적의 사실 안내 (증빙 동반)
- **CONTENT_STANDARDS 매핑**: § 4.1 "비교 표현" 카테고리

### 3.5 비방 광고 (제56조제2항제5호)

- **RiskRule (예시 ID)**: `defamation-001`
- **금지**: 다른 의료기관·의료인을 비방·폄훼하는 표현
- **허용**: 본원의 진료 방식·차별점의 사실 안내 (타 기관 직접 언급 회피)

### 3.6 수술 장면·환부 노출 광고 (제56조제2항제6호 + 시행령 제23조제1항제6호)

- **RiskRule (예시 ID)**: `graphic-procedure-001`, `before-after-photo-001`
- **금지**: 수술 장면·환부 등 혐오감을 일으킬 수 있는 사진·영상
- **전후사진**: 본 호의 시행령 결합 영역 — 보수적 운영 정책은 § 6 별도 가이드
- **자동 검출**: inlineRiskFlag `includes-before-after` (`RISK_LEVELS.md` § 2.4)

### 3.7 부작용 등 정보 누락 광고 (제56조제2항제7호)

- **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)
- **금지**: 의료인 기능·진료방법 광고에서 심각한 부작용 정보 누락
- **권장**: TreatmentPage·MedicalConditionPage 본문에 부작용·금기·주의사항 동반 (medical disclaimer)

### 3.8 사실 과장 광고 (제56조제2항제8호 + 시행령 제23조제1항제8호)

- **RiskRule (예시 ID)**: `exaggeration-001`, `effect-claim-001`, `guarantee-001`, `guarantee-composite-001`, `supremacy-001`
- **금지**: 객관적인 사실을 과장하는 광고 — "완치·100% 효과·반드시 효과·안전합니다·부작용 없음·효과 보장·결과 보장·최고의·국내 1위"
- **시행령 결합**: 시행령 제23조제1항제8호의 사실 과장 광고 구체 기준 (법 본문 호와 시행령 호 1:1 대응)
- **허용**: "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" (`CONTENT_STANDARDS § 4.2` 대체 표현)
- **CONTENT_STANDARDS 매핑**: § 4.1 효과 단정·전문성 단정·최상급·보장 표현·수치/기간 단정 카테고리 다수

### 3.9 법적 근거 없는 자격·명칭 광고 (제56조제2항제9호)

- **RiskRule (예시 ID)**: `false-credential-001`, `false-title-001`
- **금지**: 법적 근거가 없는 자격·명칭을 표방하는 광고 — "OOO 명의·OOO 박사 (학위 미보유)·전문의 자격이 없는데 전문 표방"
- **허용**: 의료법·전문의의 수련 및 자격 인정 등에 관한 규정 등에 따른 자격·명칭만

### 3.10 기사형 광고 (제56조제2항제10호)

- **RiskRule (예시 ID)**: `editorial-format-ad-001`
- **금지**: 신문·방송·잡지의 기사 또는 전문가 의견 형태로 표현된 광고
- **자체 운영**: P-010 Article은 의료기관 자체 발행 콘텐츠 — 기사형 광고 형식 모방 금지 (제3자 인용·기자 명시 등 회피)

### 3.11 미심의 광고 (제56조제2항제11호)

- **RiskRule (예시 ID)**: `unreviewed-ad-001`
- **금지**: 제57조 사전심의 대상이면서 심의 미경유 또는 심의받은 내용과 다른 광고
- **세부 운영**: § 4 참조 (사전심의 대상 판정 + 발행 차단 게이트)

### 3.12 외국인환자 유치 국내광고 (제56조제2항제12호 + 시행령 제23조제1항제12호)

본 호는 금지 유형 — 다음 **2단계 룰**로 분리 적용:

| 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 적용 조건 |
|---|---|---|---|---|
| 확정 | `foreign-patient-recruit-domestic-confirmed-001` | **fail** | (fail이므로 미적용 — § 3.3.1) | 국내광고 해당성이 명백 (예: 한국어로 외국인환자 유치 안내, 한국 내 SNS·전단지) |
| 불명확 | `foreign-patient-recruit-domestic-uncertain-001` | **content-gate** | `["legal"]` | 자사 외국어 페이지·다국어 콘텐츠 등 국내광고 해당성이 매체·방식상 모호 — 법무 판단 후 발행 |

- **금지**: 외국인환자 유치를 위한 의료광고를 국내 매체에 게재 (의료법 제27조제3항)
- **운영**: 확정 케이스는 발행 차단(fail). 불명확 케이스만 법무 검수 — ComplianceRecord(C-10) `legalCounsel` 기록 + 판정 근거를 `attachments[]`로 첨부. `InternationalSupport`의 외국어 페이지 존재 자체가 회피 근거 아님

### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)

- **RiskRule (예시 ID)**: `non-covered-discount-misleading-001`, `non-covered-discount-pressure-001`
- **금지**: 비급여 진료비용의 할인·면제 광고로서 **소비자를 속이거나 잘못 알게 할 우려가 있는 방법** — 허위·불명확한 금액·대상·기간·범위 표시 (시행령 제23조제1항제13호 결합)
- **분류** (`CONTENT_STANDARDS § 4.1` 정합):
  - 압박형·유인성 표현(지금만·특가·한정·선착순·기간 한정) → **fail**
  - 허위·불명확한 할인 표현 → **fail**
  - 명확한 사실 고지("비급여 진료 ○○ 시술 20% 할인, 2026-06-01~06-30, 신규 내원 환자 대상") → **content-gate** (법무 검수 후 발행)
- **세부 운영**: § 7 참조 (P-102 Pricing·P-104 Event·P-010 articleType=event-price 페이지 정책)

### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)

- **RiskRule (예시 ID)**: `award-endorsement-001`, `false-award-001`, `false-endorsement-001`
- **원칙 금지**: 각종 상장·감사장 등을 이용한 광고 또는 인증·보증·추천 표현 광고 자체가 원칙적으로 금지
- **법정 예외 (가~라목)** — 본 호 예외로 허용 (인증·보증 표시만 — 추천·자격 표시는 본 예외 범위 아님):
  - **가목**. 의료법 제58조에 따른 의료기관 인증
  - **나목**. 정부조직법에 따른 중앙행정기관·지방자치단체 등 공공기관으로부터 받은 **인증·보증** 표시
  - **다목**. 다른 법령에 따라 받은 **인증·보증** 표시 (자격 표시는 별도 — 제56조제2항제9호 적용)
  - **라목**. WHO/ISQua 등 시행령(제23조제2항)이 정하는 국제 인증
- 가~라목 인증을 광고에 사용할 때도 시행령 제23조제1항제14호의 구체 표현 기준 준수 필요
- **허용 표시 시 권장**: 검증 가능 출처(`Award.verificationUrl`) 동반 (`DATA_MODEL` C-01 Award)

### 3.15 시행령 위임 — 그 밖의 광고 (제56조제2항제15호)

- **현행 상태 (2026-05-14 기준)**: 시행령 제23조제1항이 제1호~제14호까지만 독립 금지 기준을 두므로 본 호에 직접 대응하는 **현행 독립 시행령 기준 없음**
- 본 § 3.15는 **개정 추적 자리표시** — 시행령 개정으로 신규 금지 기준 신설 시 본 절 cascade + RiskRule 추가
- 운영 RiskRule 미생성 상태 — 빌드 시 본 호 매핑 룰 없음 (정상)

---

## 4. 사전심의 대상 판정 (제57조 + 시행령 제24조)

### 4.1 방송 의료광고 — 매체 자체 금지 (제56조제3항)

| 매체 | 분류 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/CONTENT_STANDARDS.md | Select-Object -Skip 600 -First 45' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 630 -First 90' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 1246 -First 78' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 1150 -First 55' in C:\Users\assag\solution\website-exposure
 succeeded in 818ms:

- `global` 룰은 모든 콘텐츠에 적용
- 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
- pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선

#### 7.4.2 severity 우선순위

같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):

```
fail > content-gate > warning > info
```

- 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수

#### 7.4.3 문맥 결합 룰 (composite rules)

- 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
- 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
- composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시

#### 7.4.4 운영·관리

- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
- 룰 데이터의 빌드용 표현은 별도 데이터 파일 (`compliance/rules.yaml` 또는 동등 포맷) — `compliance/RISK_LEVELS.md` 후속에서 파일 위치·포맷 확정
- 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR

---

## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)

| 레벨 | 정의 | 조치 |
|---|---|---|
| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|

 succeeded in 837ms:

### 14.1 `auto_check_result` JSONB 구조 — 통일 위치 (CAP-18·19)

DB persist 시 `envelope.result` + `envelope.extensions` 합성:

```jsonc
{
  // SoT 7 필드 (CONTENT_STANDARDS § 7.2)
  "automatedDecision": "gate",
  "buildBlocked": false,
  "gateRequired": true,
  "hasWarnings": false,
  "findingsBySeverity": { "fail": 0, "content-gate": 1, "warning": 0, "info": 0 },
  "requiredApproverRoles": ["medical"],
  "findings": [
    {
      "ruleId": "supremacy-001",
      "category": "최상급",
      "pattern": "최고의",
      "severity": "fail",
      "location": { "start": 12, "end": 15 },
      "suggestion": "체질 기반 다이어트 한약 처방",
      "requiredApproverRoles": [],
      "triggeredBy": "static-rule",
      "legalBasis": ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    }
  ],
  // CA-PERSIST-01 (CAP-18 통일 위치 + CAP-19 단일 nested 구조)
  "extensions": {
    "suppressedByContextExceptions": [
      { "finding": { /* ... */ }, "suppressedBy": "safety-medical-consult-001", "reason": "safety" }
    ],
    "inlineRiskFlagsEvidence": { /* ... */ },
    "riskInferenceEvaluatedSteps": [ /* ... */ ],
    "riskInferenceContributingSteps": [ /* ... */ ],
    "ruleMatchStats": { "categoryCounts": { "최상급": 1 }, "elapsedMs": 23 },
    "inferredRiskLevelMismatch": null,
    "clientRolePresent": false,
    "engineMetadata": {
      "catalogVersion": "1.0.0",
      "catalogHash": "abc123...",
      "schemaHash": "def456...",
      "engineVersion": "1.0.0",
      "kssAvailable": false
    }
  }
}
```

### 14.2 ComplianceCheckEnvelope 타입 cascade (CAP-19)

```typescript
type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;  // SoT 7 필드 그대로
  meta: { pageRiskLevel, catalogVersion, catalogHash, manualReview, exemptReason? };
  extensions: ExtensionsRecord;    // 새 영역 (CAP-19 - envelope 안 별도)
};

type ExtensionsRecord = {
  suppressedByContextExceptions: Array<{ finding: Finding; suppressedBy: string; reason: ContextExceptionKind }>;
  inlineRiskFlagsEvidence: Record<InlineRiskFlag, Array<{ location, matchedText }>>;
  riskInferenceEvaluatedSteps: Array<InferenceStep>;
  riskInferenceContributingSteps: Array<InferenceStep>;
  ruleMatchStats: { categoryCounts: Record<string, number>; elapsedMs: number };
  inferredRiskLevelMismatch?: { external: RiskLevel; internal: RiskLevel; final: RiskLevel };
  clientRolePresent: boolean;
  engineMetadata: { catalogVersion: string; catalogHash: string; schemaHash: string; engineVersion: string; kssAvailable: boolean };
};
```

> CONTENT_STANDARDS § 7.2 SoT 침해 없음 (`ComplianceCheckResult` 안은 그대로 7 필드. `extensions` 는 envelope 외 영역). DB persist 시 합성하여 단일 `auto_check_result.extensions` 키 안 모두 영속.

### 14.3 DB 컬럼 영향

`compliance_record.auto_check_result` JSONB — 컬럼 ADD 없음. sentinel row 안 extensions 부재일 뿐 — 어드민 UI 안 기본값 처리.

---


 succeeded in 843ms:
### 3.4 catalogHash + schemaHash 분리 산정 (CAP-26 정정)

```typescript
function computeCatalogHash(yamlFiles: { name: string; content: string }[]): string {
  // 1. 6 YAML 파일 name 정렬 (schema.json 미포함)
  const sorted = yamlFiles.slice().sort((a, b) => a.name.localeCompare(b.name));
  // 2. 각 파일 content 정규화 - trim · 줄바꿈 LF 통일
  const normalized = sorted.map(f => `${f.name}\n${f.content.trim().replace(/\r\n/g, '\n')}`);
  // 3. concat
  const concat = normalized.join('\n---\n');
  // 4. SHA-256
  return sha256(concat);
}

function computeSchemaHash(schemaContent: string): string {
  return sha256(schemaContent.trim().replace(/\r\n/g, '\n'));
}
```

- `catalogHash` = 데이터 결정성 (동일 데이터 → 동일 hash)
- `schemaHash` = 검증 규칙 변경 추적 (별도 metadata)
- `engineVersion` = matcher/composite/inline-flags 알고리즘 버전 (별도 metadata)
- `kssAvailable` = runtime capability (별도 metadata)
- 환경 차이로 같은 catalog 가 다른 hash 갖지 않음 (CAP-26 운영 결정성 확보)

---

## 4. RiskRule 매칭 엔진 결정 (CA-MATCHER-01)

### 4.1 진입 시그니처

```typescript
export type MatchResult = {
  findings: Finding[];
  suppressedFindings: Array<{ finding: Finding; suppressedBy: string; reason: ContextExceptionKind }>;  // CAP-17 · CAP-18
};

export function matchRules(
  body: string,
  rules: RiskRule[],
  contextExceptions: ContextException[],
  scope: ContentScopeInput,
  kssAvailable: boolean,
): MatchResult;

type ContentScopeInput = {
  contentType: ContentType;
  pageTypeId: PageTypeId;
  articleType?: ArticleType;
  contractId?: ContractId;
  featureContentType?: FeatureContentTypeId;
  // CAP-24 신규 - qa block scope 안 FAQ Q/A 분리
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
};
```

### 4.2 매칭 순서

```
for each rule in rules:
  1. scope 일치 검사 (§ 4.3)
  2. patternType 분기 - regex/keyword/phrase: simple · composite: § 6
  3. 매칭 시 Finding[] 산출 - location offset (UTF-16)
  4. ApproverRole · legalBasis · triggeredBy="static-rule" 메타 채움
after all rules:
  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
  6. severity 우선순위 흡수 - 집계만 (Finding[] 안 모두 보존)
```

### 4.3 scope 일치 규칙

- `global` → 항상 적용
- `pageType` → input.pageTypeId === scope.pageTypeId
- `articleType` → input.articleType === scope.articleType
- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
- 여러 scope OR 결합

### 4.4 qa block scope 안 FAQ 처리 (CAP-24 정정)

- FAQ check() 입력 시 — `qaBlocks` 입력 안 question/answer 분리
- `qa` block scope 룰은 각 qa block 안 단위로 매칭 (question OR answer 각 부분 매칭)
- finding.location 은 전체 body 안 offset (qaBlocks 안 offsetStart 더해 변환)
- v0.1 안 `qa` block scope 룰 등록 안 함 (rules.core/medical-ad.yaml 안 모두 global) — 단순히 qaBlocks 입력 지원만 활성 (Phase Beta 안 qa block 전용 룰 추가 가능)

### 4.5 simple 매칭

- `keyword` — case-insensitive substring
- `phrase` — word boundary (한국어 영향 미미)

 succeeded in 801ms:
- + findings 안 requiredApproverRoles 합집합 (High 가상 finding 의 requiredApproverRoles 포함)

---

## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07·33 정정)

### 12.1 동작 (CAP-06 정정 - block 제외)

```typescript
export async function enqueueContentGateIfNeeded(
  tx: TransactionSql, ctx: TenantContext,
  envelope: ComplianceCheckEnvelope, recordId: string,
): Promise<{ entryId: string | null }> {
  // CAP-06 - block 콘텐츠는 큐 진입 안 함 (blocked 정정 흐름)
  if (!envelope.result.gateRequired || envelope.result.automatedDecision === 'block') {
    return { entryId: null };
  }

  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
  const existing = await tx`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}
      AND content_type = ${envelope.meta.contentType}
      AND content_ref = ${envelope.meta.contentRef}
      AND queue_type = 'content-gate'
      AND status IN ('open', 'in-progress')
  `;
  if (existing.length > 0) return { entryId: existing[0].id };

  const entryId = uuid();
  await tx`
    INSERT INTO review_queue_entry (id, instance_id, content_type, content_ref, compliance_record_id, queue_type, status,
      priority, required_roles, sla_due_at, created_at, updated_at)
    VALUES (${entryId}, ${ctx.instanceId}, ${envelope.meta.contentType}, ${envelope.meta.contentRef}, ${recordId},
      'content-gate', 'open', 'P0', ${envelope.result.requiredApproverRoles ?? []},
      ${calculateContentGateSla()}, now(), now())
  `;
  await emitAuditEvent('content-gate-auto-enqueued', { recordId, entryId, finalRoles: envelope.result.requiredApproverRoles });
  return { entryId };
}
```

### 12.2 호출 시점 (CAP-07 정정)

- **`submitForReview` action 안 만 통합** (Phase Alpha)
- `saveArticle` 등 entity save 안 자동 호출 — **Phase Beta defer** (빌드 시점 자동 큐 활성화 시)
- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker

### 12.3 동시 큐 운영

- 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
- 발행 게이트 — 양 큐 모두 resolved 필요 (AND)

### 12.4 priority · slaDueAt 정책 (CAP-33 정정 — REVIEW_WORKFLOW § 3.3 인용)


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0015_review_queue_entry.sql | Select-Object -First 170' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"submitForReview|approveContent|publishContent|auto_check_result|calculateFinalRoles|check\\(\" apps/web/src/lib/compliance/server-actions.ts apps/web/src/lib/compliance/check.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
 succeeded in 661ms:
apps/web/src/lib/compliance/server-actions.ts:2:// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
apps/web/src/lib/compliance/server-actions.ts:17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
apps/web/src/lib/compliance/server-actions.ts:51:export async function submitForReview(
apps/web/src/lib/compliance/server-actions.ts:71:    : await check(checkInput);
apps/web/src/lib/compliance/server-actions.ts:74:  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
apps/web/src/lib/compliance/server-actions.ts:80:      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
apps/web/src/lib/compliance/server-actions.ts:137:export async function approveContent(
apps/web/src/lib/compliance/server-actions.ts:181:           auto_check_result
apps/web/src/lib/compliance/server-actions.ts:242:  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
apps/web/src/lib/compliance/server-actions.ts:243:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance/server-actions.ts:274:  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
apps/web/src/lib/compliance/server-actions.ts:275:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance/server-actions.ts:374:export async function publishContent(
apps/web/src/lib/compliance/server-actions.ts:389:           auto_check_result
apps/web/src/lib/compliance/check.ts:2:// check() M0 stub — manualReview only · ruleCatalog 미합류 (CA-DEFER-01·02·03·04).
apps/web/src/lib/compliance/check.ts:17: * LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
apps/web/src/lib/compliance/check.ts:18: *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
apps/web/src/lib/compliance/check.ts:50: * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
apps/web/src/lib/compliance/check.ts:59:export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
apps/web/src/lib/compliance/check.ts:62:      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +

 succeeded in 711ms:
-- @glitzy/core-content — C0015 ReviewQueueEntry (REVIEW_WORKFLOW § 3 · COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.2)
-- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
-- Precondition: D0010 instance · C0014 compliance_record + compliance_content_type enum

CREATE TYPE review_queue_type AS ENUM ('manual-review');
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  compliance_record_id UUID NOT NULL,
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
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

CREATE POLICY tenant_isolation ON review_queue_entry
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;

 succeeded in 726ms:
// @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
// 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ContentType,
  SubmitContentType,
} from "./types";
import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
import { check, buildLegalDocumentExemptEnvelope } from "./check";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
import { evaluatePublishable } from "./publishable-check";
import { assertReviewerEligibility } from "./eligibility";

const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };

/**
 * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
 *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
 */
async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
}

function isAllowedSubmitType(t: string): t is SubmitContentType {
  return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
}

export type SubmitForReviewArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  contentRow: { status: string; risk_level?: string | null; body?: string };
};

export type SubmitForReviewResult = {
  recordId: string;
  entryId: string;
  finalRoles: ApproverRole[];   // CAMC-07/10
  pageRiskLevel: "Low" | "Medium" | "High";
};

/**
 * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
 */
export async function submitForReview(
  tx: ScopedTx,
  ctx: TenantContext,
  args: SubmitForReviewArgs,
): Promise<SubmitForReviewResult> {
  if (!isAllowedSubmitType(args.contentType)) {
    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  }
  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");

  const checkInput = {
    contentType: args.contentType,
    contentRef: args.contentRef,
    body: args.contentRow.body ?? "",
    metadata: {
      explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
    },
  };
  const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
    ? buildLegalDocumentExemptEnvelope(checkInput)
    : await check(checkInput);

  const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);

  // ComplianceRecord INSERT (pre-publish)
  const slaHours = SLA_DUE_HOURS.P0;
  const recordRows = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
      record_phase, record_version, metadata
    ) VALUES (
      ${ctx.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${envelope.meta.pageRiskLevel}::risk_level,
      ${JSON.stringify(envelope.result)}::jsonb,
      'pre-publish'::compliance_record_phase,
      1,
      ${JSON.stringify({
        manualReview: envelope.meta.manualReview,
        catalogVersion: envelope.meta.catalogVersion,
        catalogHash: envelope.meta.catalogHash,
        ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
      })}::jsonb
    )
    RETURNING id
  `;
  const recordId = recordRows[0]!.id;

  // ReviewQueueEntry INSERT (open)
  const entryRows = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'manual-review'::review_queue_type,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${finalRoles}::approver_role[],
      ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
    )
    RETURNING id
  `;
  const entryId = entryRows[0]!.id;

  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
}

export type ApproveContentArgs = {
  recordId: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
};

export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };

/**
 * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 * AND 게이트 충족 시 in-review → approved 자동 전이.
 */
export async function approveContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: ApproveContentArgs,
): Promise<ApproveContentResult> {
  assertReviewerEligibility(ctx, args.role);
  await acquireRecordLock(tx, args.recordId);

  // entry + record FOR UPDATE
  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  const entry = entryRows[0]!;
  if (!entry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
    );
  }
  // CAMC3-01: entry vs args 정합 — drift 차단
  const expectedContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
    );
  }

  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
  if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
    throw new ComplianceTransitionError(
      `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
    );
  }
  if (record.content_type !== expectedContentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${expectedContentType}/${args.contentRef}`,
    );
  }

  // 중복 approve idempotent
  if (isRoleSatisfied(record, args.role)) {
    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
  }

  // 슬롯 채움 + entity 전이
  const now = new Date();
  if (args.role === "operator") {
    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  } else if (args.role === "medical") {
    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.physician_approver = ctx.userId; record.physician_approved_at = now;
  } else if (args.role === "legal") {
    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  }

  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  if (entry.status === "open") {
    await tx`
      UPDATE review_queue_entry
         SET status = 'in-progress'::review_queue_status,
             assigned_to = ${ctx.userId}::uuid,
             assigned_at = ${now.toISOString()}::timestamptz,
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
  }

  // entity status 전이 review-queued → in-review (첫 approve)
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = CASE
         WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
         ELSE status
       END,
       updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);

  // AND 게이트 평가
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));

  let entryStatus: "in-progress" | "resolved" = "in-progress";
  if (allApproved) {
    // entity in-review → approved → publishable (publishable evaluator pass 시)
    const publishable = evaluatePublishable(record, record.content_type as ContentType);
    const targetStatus = publishable.publishable ? "publishable" : "approved";
    await tx.unsafe(`
      UPDATE ${args.contentTable}
         SET status = '${targetStatus}'::content_publication_status,
             updated_at = now()
       WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
    `);
    // entry resolved
    await tx`
      UPDATE review_queue_entry
         SET status = 'resolved'::review_queue_status,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 1324 -First 60' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "review_queue_entry_open_unique|queue_type|content-gate|ADD VALUE|UNIQUE|partial UNIQUE" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md packages/core-content/migrations/C0015_review_queue_entry.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 623ms:
packages/core-content/migrations/C0015_review_queue_entry.sql:2:-- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
packages/core-content/migrations/C0015_review_queue_entry.sql:5:CREATE TYPE review_queue_type AS ENUM ('manual-review');
packages/core-content/migrations/C0015_review_queue_entry.sql:13:  queue_type review_queue_type NOT NULL,
packages/core-content/migrations/C0015_review_queue_entry.sql:38:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0015_review_queue_entry.sql:46:CREATE UNIQUE INDEX review_queue_entry_open_unique
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:21:- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 3.3 priority·SLA 표 (CAP-33 정정) · § 6.2 stale 처리는 Phase Beta · § 9.1.1 알림 정책
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:24:- `packages/core-content/migrations/C0015_review_queue_entry.sql` (실 UNIQUE constraint 확인 — CAP-10 정정)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:42:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:50:| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:56:| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:61:| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:63:| Drizzle schema v0.6 (CA-SCHEMA-01 · CAP-10 정정) | `reviewQueueType` enum 안 `'content-gate'` ADD VALUE + **partial UNIQUE 재정의** — 실 C0015 constraint `review_queue_entry_open_unique (instance_id, content_type, content_ref)` → `(instance_id, content_type, content_ref, queue_type)` partial UNIQUE (record version별 중복 허용 안 함 — 단일 active record_version 기준) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:64:| C0017 migration (CA-MIGRATION-01) | `ALTER TYPE review_queue_type ADD VALUE 'content-gate'` (single statement · COMMIT 분리) + partial UNIQUE DROP + CREATE (manifest 안 별 step 분리 — Postgres ALTER TYPE 트랜잭션 제약) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:65:| compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `auto-gate.ts` (content-gate 자동 큐 enqueue). 매칭 엔진·composite·inline-flags·risk-inference·slot-match·loader 는 `packages/compliance-rules/` 패키지 안 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:101:4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:216:| `numeric-period-standalone-001` | "수치·기간 단정 (보장어 없음)" | content-gate (`["medical", "legal"]`) | composite (`\d+\s*(일\|주\|개월)` + `(만에\|기간)` AND_NEAR window=15) | global | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:220:| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | scope=`{type:"global"}` 안 (`articleType=event-price` · `pageType=P-102` · `pageType=P-104` 외 검사 — scope OR 결합 단순화 — § 4.3 다층 검사) | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:223:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:227:| `body-type-claim-001` | "체질·맞춤 과대 표현" | content-gate (`["medical"]`) | regex (`(당신만의\s*1\s*:\s*1\s*맞춤\|당신의\s*체질에\s*완벽)`) | global | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:269:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:306:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:321:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:333:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:345:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:360:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:386:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:412:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:427:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:725:`fail > content-gate > warning > info` — 집계만 우선순위. Finding[] 모두 보존.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:734:  severity: "info" | "warning" | "fail" | "content-gate";
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1122:    severity: 'content-gate',
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1155:## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07·33 정정)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1169:  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1175:      AND queue_type = 'content-gate'
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1182:    INSERT INTO review_queue_entry (id, instance_id, content_type, content_ref, compliance_record_id, queue_type, status,
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1185:      'content-gate', 'open', 'P0', ${envelope.result.requiredApproverRoles ?? []},
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1188:  await emitAuditEvent('content-gate-auto-enqueued', { recordId, entryId, finalRoles: envelope.result.requiredApproverRoles });
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1201:- 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1207:- **content-gate 큐 priority = P0** (REVIEW_WORKFLOW § 3.3)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1210:- 알림 = `content-gate-queued` (REVIEW_WORKFLOW § 9.1.1)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1259:  "findingsBySeverity": { "fail": 0, "content-gate": 1, "warning": 0, "info": 0 },
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1325:## 15. content-gate 큐 enum 확장 (CA-SCHEMA-01 · CAP-10 정정 — 실 constraint 기준)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1333:-- (Step 1) queue_type enum 안 'content-gate' ADD VALUE - single statement · COMMIT 분리
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1334:ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1337:-- (Step 2 - 별 migration C0018) partial UNIQUE 재정의 - 실 C0015 constraint 기준 (CAP-10)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1338:-- 기존: review_queue_entry_open_unique (instance_id, content_type, content_ref) WHERE status IN ('open', 'in-progress')
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1339:-- 변경: (instance_id, content_type, content_ref, queue_type)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1340:ALTER TABLE review_queue_entry DROP CONSTRAINT IF EXISTS review_queue_entry_open_unique;
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1341:DROP INDEX IF EXISTS review_queue_entry_open_unique;
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1342:CREATE UNIQUE INDEX review_queue_entry_open_unique ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1346:> 단일 active record_version 안 동일 (contentType, contentRef) + queue_type 조합 1개 open entry 만 허용. record_version 별 중복 허용 안 함 (운영 가설 — 새 record_version 안 이전 entry resolved 상태).
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1351:- `reviewQueueType` enum 안 `'content-gate'` 추가
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1356:기존 19단계 + C0017 = 20단계 (단일 ALTER TYPE + DROP/CREATE UNIQUE 분리 시 21단계).
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1369:| 4 | "절대 효과" → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1372:| 7 | "20% 할인 진행" + Article articleType=general-medical-info → event-fact-statement-001 매칭 | severity='content-gate' · roles=['legal'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1375:| 10 | "전후사진" + ReviewPolicy.beforeAfterPhotoAllowed=false → before-after-photo-001 (content-gate) | severity='content-gate' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1377:| 12 | 다국어 페이지 메타 + "foreign patient" → foreign-patient-recruit-domestic-uncertain-001 (content-gate · legal) | roles=['legal'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1379:| 14 | "당신의 체질에 완벽" → body-type-claim-001 (content-gate · medical) | roles=['medical'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1416:| 35 | High 가상 finding 주입 (automatedDecision='gate') + gateRequired=true → content-gate 큐 1행 INSERT | queue_type='content-gate' · priority='P0' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1455:| 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1456:| 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1461:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 | doc patches |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1471:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1488:| MA-Q06 | content-gate 큐 manual-review 와 분리 vs 통합 | **분리 채택** (CAP-07) — 동시 진입 가능, 발행 게이트 AND |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1501:| 2026-05-19 | **v0.2** | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 699ms:
## 15. content-gate 큐 enum 확장 (CA-SCHEMA-01 · CAP-10 정정 — 실 constraint 기준)

### 15.1 C0017 migration

```sql
-- packages/core-content/migrations/C0017_content_gate_queue.sql
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01

-- (Step 1) queue_type enum 안 'content-gate' ADD VALUE - single statement · COMMIT 분리
ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
-- (manifest 안 본 step 단독 분리 - Postgres ALTER TYPE 트랜잭션 제약)

-- (Step 2 - 별 migration C0018) partial UNIQUE 재정의 - 실 C0015 constraint 기준 (CAP-10)
-- 기존: review_queue_entry_open_unique (instance_id, content_type, content_ref) WHERE status IN ('open', 'in-progress')
-- 변경: (instance_id, content_type, content_ref, queue_type)
ALTER TABLE review_queue_entry DROP CONSTRAINT IF EXISTS review_queue_entry_open_unique;
DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
  WHERE status IN ('open', 'in-progress');
```

> 단일 active record_version 안 동일 (contentType, contentRef) + queue_type 조합 1개 open entry 만 허용. record_version 별 중복 허용 안 함 (운영 가설 — 새 record_version 안 이전 entry resolved 상태).

### 15.2 Drizzle schema v0.6 변경

`packages/core-content/src/schema.ts` 안:
- `reviewQueueType` enum 안 `'content-gate'` 추가
- `reviewQueueEntry` table 안 unique index 변경 (`(instanceId, contentType, contentRef, queueType)` partial WHERE status open/in-progress)

### 15.3 manifest 20단계

기존 19단계 + C0017 = 20단계 (단일 ALTER TYPE + DROP/CREATE UNIQUE 분리 시 21단계).

---

## 16. 시나리오 cascade (CA-TEST-01 · CAP-35 정정)

### 16.1 룰 매칭 (14건) — § 16.1 v0.1 동일 + 일부 정정

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 1 | "최고의 다이어트 한약" 본문 → supremacy-001 매칭 (severity=fail) | findings 안 ruleId='supremacy-001' · severity='fail' · location 정확 |
| 2 | "100% 효과 보장" 본문 → guarantee-composite-001 매칭 (composite AND_IN_SENTENCE) | findings 안 ruleId='guarantee-composite-001' · severity='fail' |
| 3 | "절대 안심하세요. 의료진과 상담하세요." → professional-assertion-standalone-001 매칭하나 contextException safety 같은 문장 → suppress | findings=[] · suppressedFindings.length=1 |
| 4 | "절대 효과" → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' |
| 5 | "타 병원보다 우수" → comparison-001 | severity='fail' |
| 6 | "20% 할인 진행" + Article articleType=event-price → event-fact-statement-001 미매칭 (scope 예외) | findings=[] |
| 7 | "20% 할인 진행" + Article articleType=general-medical-info → event-fact-statement-001 매칭 | severity='content-gate' · roles=['legal'] |
| 8 | "지금만 특가" → inducement-pressure-001 (fail) | severity='fail' |
| 9 | "당신은 비만입니다" → diagnosis-assertion-001 | severity='fail' |
| 10 | "전후사진" + ReviewPolicy.beforeAfterPhotoAllowed=false → before-after-photo-001 (content-gate) | severity='content-gate' |
| 11 | 외국인 환자 한국어 모집 → foreign-patient-recruit-domestic-confirmed-001 (fail) | severity='fail' |
| 12 | 다국어 페이지 메타 + "foreign patient" → foreign-patient-recruit-domestic-uncertain-001 (content-gate · legal) | roles=['legal'] |
| 13 | priorReviewRequired=true · priorReviewPassed=false → unreviewed-ad-001 warning finding 자동 추가 (카탈로그 외 별도 흐름 · CAP-16) | findings 안 unreviewed-ad-001 |
| 14 | "당신의 체질에 완벽" → body-type-claim-001 (content-gate · medical) | roles=['medical'] |

### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)

(v0.1 동일 + CAP-17 정정 시나리오)


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 513 -First 55' in C:\Users\assag\solution\website-exposure
 succeeded in 645ms:

```yaml
version: "1.0.0"
sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#11.2"
sourceDocVersion: "1.0"
revisions:
  - revisionId: "2026-04-07-reaffirmation"
    lawSource: "의료법"
    affectedArticles: ["제56조제2항제1호~제14호"]
    revisionEffectiveDate: "2026-04-07"
    revisionType: "reaffirmation"
    sourceUrl: "https://www.law.go.kr/법령/의료법"
    checkedAt: "2026-05-19T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds: []   # reaffirmation - 모든 룰 변경 없음
    staleScope:
      kind: "all"
      contentTypes: []
    summary: "MEDICAL_AD § 11.2 SoT - 2026-04-07 의료법 본문 재확인 (변경 없음). Phase Alpha baseline."
```

### 2.9 `slot-matches.yaml` v0.0 placeholder (CAP-09 정정)

```yaml
version: "0.0.0"
sourceDoc: "core/PAGE_TYPES.md#3"
sourceDocVersion: "1.0"
slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
# 실 slot 데이터 추가 시 - schema:
#   - slotId: string (kebab-case, P-XXX-content-yyy 형식)
#   - pageTypeId: PageTypeId enum
#   - triggeredLevel: RiskLevel
#   - matchCondition: { kind: "field-non-empty" | "body-regex" | "field-regex" | ... }
```

> Phase Alpha 안 P-006 slot 격상 미합류 — TreatmentPage 실 schema (C0004) 안 `results` · `pricing` 필드 부재. body_markdown 단일 필드 안에서 키워드 매칭 필요 — `body-regex` matchCondition kind 신설 후 Phase Beta 합류. v0.1 안 RiskInference 안 slotMatches 입력 항상 `[]` (빈 배열).

### 2.10 `schema.json` (CA-SCHEMA-JSON-01 · CAP-03 정정)

JSON Schema Draft-07. **slot-matches.yaml 검증 표 — RISK_LEVELS § 3.3 수준 확장** (CAP-03):

| 검증 항목 | 룰 레벨 |
|---|---|
| `slots[].slotId` 중복 (파일 내) | **fail** |
| `slots[].slotId` 형식 (`^[A-Z]-\d{3}-[a-z][a-z0-9-]*[a-z0-9]$` 또는 kebab-case) | **fail** |
| `slots[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `slots[].triggeredLevel` RiskLevel enum 외 값 | **fail** |
| `slots[].matchCondition.kind` enum 외 값 (`field-non-empty` · `body-regex` · `field-regex`) | **fail** |
| `kind="field-non-empty"` + `fieldPath` 누락 | **fail** |
| `kind="field-regex"` + (`fieldPath` 또는 `pattern` 누락) | **fail** |
| `kind="body-regex"` + `pattern` 누락 | **fail** |
| `pattern` regex 컴파일 실패 | **fail** |
| `slots[].fieldPath` PAGE_TYPES § 3 안 정의된 slot 필드 미존재 (v0.1 안 미실행 — slot-matches.yaml 비어 있으므로) | warning |
| `slots[].version` SemVer 위반 | **fail** |
| `slots[].createdAt`·`updatedAt` ISO 8601 위반 | **fail** |

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=4 major=6 minor=1 (총 11)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11

## blocking
- **CAP-14 (잔존)**: `calculateFinalRoles` 단일 경로 명세가 실제 시그니처와 불일치
  - 위치: plan § 7.1 / § 11.2, `apps/web/src/lib/compliance/final-roles.ts:14`, `apps/web/src/lib/compliance/types.ts:3`
  - 근거(SoT): 실제 `calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)` 는 positional 인자이고, `ApproverRole` 은 `operator|medical|legal`만 허용
  - 문제: plan 은 객체 인자 `{ contentType, pageRiskLevel, priorReviewRequired, findingsRequiredRoles }` 호출을 명세하고, CAP-15의 `clientRolePresent` 처리 전제와 달리 실제 helper는 `client` 발견 시 throw
  - 권장 patch: plan 호출 예시를 실제 positional 시그니처로 정정하거나, 구현 변경 step에 `final-roles.ts` 시그니처/`ApproverRole` 확장/`client` non-fatal 처리 변경을 명시
  - closeableAfterPatch: true

- **CAP2-01**: auto-gate가 존재하지 않는 `envelope.meta.contentType/contentRef`를 사용
  - 위치: plan § 12.1, § 14.2
  - 근거(SoT): plan § 14.2 `ComplianceCheckEnvelope.meta` 는 `{ pageRiskLevel, catalogVersion, catalogHash, manualReview, exemptReason? }`
  - 문제: § 12.1 SQL은 `${envelope.meta.contentType}` / `${envelope.meta.contentRef}`를 사용하므로 타입상 컴파일 불가이며 content-gate enqueue 구현 경로가 끊김
  - 권장 patch: `enqueueContentGateIfNeeded(..., contentType, contentRef, ...)`로 명시 인자를 받거나 envelope.meta에 `contentType/contentRef`를 공식 추가하고 § 7.1 반환 예시까지 cascade
  - closeableAfterPatch: true

- **CAP-04 (잔존)**: § 2.4 SoT ID 수량·canonical 수량이 내부적으로 불일치
  - 위치: plan § 2.4
  - 근거(SoT): 사용자 acceptance precondition은 “18 canonical 룰 정합”; plan § 2.5는 core 14룰, § 2.6은 medical-ad 신규 13룰을 별도 정의
  - 문제: § 2.4는 “SoT 예시 ID 17종”이라고 하지만 표는 중복 포함 20개 이상 ID를 나열하고, 하단 “생성 13 / 흡수 11 / 미등록 1 / defer 1” 합계도 17과 맞지 않음. acceptance 기준인 18 canonical 룰을 검증할 수 없음
  - 권장 patch: “SoT 예시 ID”, “canonical 룰”, “core 변환 룰”, “medical-ad 신규 룰”을 별도 카운트로 재정의하고 acceptance precondition의 18 canonical 기준과 일치시키기
  - closeableAfterPatch: true

- **CAP-10 (잔존)**: content-gate와 manual-review 동시 open 전제가 실제 C0015 unique와 충돌
  - 위치: `packages/core-content/migrations/C0015_review_queue_entry.sql:46`, plan § 12.3 / § 15
  - 근거(SoT): C0015 실제 unique index는 `(instance_id, content_type, content_ref)` partial unique
  - 문제: plan은 manual-review + content-gate 동시 open 가능을 전제하지만, 기존 unique가 유지되는 동안 `content-gate` insert가 manual-review open row와 충돌
  - 권장 patch: C0018 unique 재정의를 acceptance blocker로 명시하고, manifest 단계 수를 “C0017 enum ADD VALUE 단독 + C0018 unique 재정의”로 고정
  - closeableAfterPatch: true

## major
- **CAP2-02**: `event-fact-statement-001` 허용 scope가 OR 스코프로 표현 불가
  - 위치: plan § 2.5, § 4.3, scenario #6/#7
  - 근거(SoT): CONTENT_STANDARDS § 5.7은 P-102/P-104/P-010 `articleType=event-price`만 가격·할인 사실 안내 허용
  - 문제: plan은 rule scope를 `global`로 두고 “허용 scope 외 검사”를 설명하지만 § 4.3 scope는 OR 결합만 지원한다. NOT/except 조건이 없어 scenario #6 “event-price 미매칭”을 결정적으로 구현할 수 없음
  - 권장 patch: `event-fact-statement-001`을 deny rule로 두려면 `excludeScopes` 또는 matcher 단계의 allowlist pre-check를 명세하거나, 허용 페이지 전용 positive rule과 금지 페이지 rule을 분리
  - closeableAfterPatch: true

- **CAP-12 (잔존)**: `evaluatedSteps/contributingSteps` 분리가 RISK_LEVELS SoT에 cascade 되지 않음
  - 위치: `docs/compliance/RISK_LEVELS.md:97`, plan § 10.1
  - 근거(SoT): RISK_LEVELS § 2.3.1은 여전히 단일 `steps[]`만 정의
  - 문제: plan은 `evaluatedSteps`와 `contributingSteps`를 영속 extensions까지 요구하지만 상위 SoT는 단일 steps라 구현자 기준이 갈라짐
  - 권장 patch: RISK_LEVELS § 2.3.1에 두 배열을 공식 타입으로 반영하고 기존 `steps[]`는 deprecated alias 또는 제거로 명시
  - closeableAfterPatch: true

- **CAP-19 (잔존)**: `ComplianceCheckEnvelope.extensions` 타입 cascade가 실제 `types.ts`와 server persist 경로에 없음
  - 위치: `apps/web/src/lib/compliance/types.ts:59`, `apps/web/src/lib/compliance/server-actions.ts:91`, plan § 14.2
  - 근거(SoT): plan § 14.2는 envelope 외부 `extensions` 영역과 DB 저장 시 `{ ...result, extensions }` 합성을 요구
  - 문제: 실제 `ComplianceCheckEnvelope`에는 `extensions`가 없고 `submitForReview`는 `JSON.stringify(envelope.result)`만 저장한다. plan이 “타입 cascade”를 말하지만 실제 patch step의 코드 영향 범위가 부족함
  - 권장 patch: `types.ts` 확장, `check.ts` 반환, `server-actions.ts` persist 합성, 기존 sentinel 기본값 처리까지 작업 step에 명시
  - closeableAfterPatch: true

- **CAP-05 (잔존)**: `celebrity-001` category가 CONTENT_STANDARDS § 4.1 문자열과 정확 일치하지 않음
  - 위치: plan § 2.5
  - 근거(SoT): `docs/core/CONTENT_STANDARDS.md:242` category는 “유명인 동원”
  - 문제: plan § 2.5는 category를 “(의료법 호 별도 — § 3.10 가까움)”로 둔다. “각 RiskRule.category는 SoT § 4.1 카테고리 칸 그대로 사용” 원칙 위반
  - 권장 patch: `celebrity-001.category = "유명인 동원"`으로 정정하고 legalBasis는 의료법 환자 유인 축으로 overlay
  - closeableAfterPatch: true

- **CAP2-03**: `foreign-patient-recruit-domestic-uncertain-001`가 composite/pageMeta 전제와 실제 룰 정의가 불일치
  - 위치: plan § 2.4 / § 2.6
  - 근거(SoT): MEDICAL_AD § 3.12는 국내광고 해당성 불명확 케이스를 매체·방식별 법무 판단으로 둠
  - 문제: § 2.4는 “다국어 페이지 메타 + 외국인 환자” composite라고 하지만 § 2.6 룰은 단순 regex이며 pageMeta/inLanguage/domestic medium 조건이 없음
  - 권장 patch: v0.1에서 pageMeta composite 미지원이면 명시 defer하거나, scope/evidence 입력에 `pageMeta.inLanguage`/국내매체 여부를 추가
  - closeableAfterPatch: true

- **CAP2-04**: runtime evidence가 필요한 의료법 특화 룰이 defer 없이 단순 regex로 과잉 확정됨
  - 위치: plan § 2.6
  - 근거(SoT): MEDICAL_AD § 3.2는 “6개월 이하 임상경력”, § 3.13은 허위·불명확 할인은 fail / 명확 사실 고지는 content-gate
  - 문제: `short-clinical-experience-001`은 `\d{1,2}개월` 전체를 fail로 잡아 7~99개월까지 차단 가능하고, `non-covered-discount-misleading-001`은 모든 `% 할인`을 content-gate로 잡아 “misleading” 판단 근거가 없음
  - 권장 patch: 숫자 predicate/evidence absence가 v0.1 미지원이면 해당 세부 판단을 Phase Beta defer로 옮기거나, matcher에 numeric predicate와 기간·대상 evidence 검사 계약을 추가
  - closeableAfterPatch: true

- **CAP2-05**: CA-CASCADE-09가 실제 M0_PLAN에 반영되지 않음
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:825`
  - 근거(SoT): plan § 18은 M0_PLAN § 9에 CA-DEFER-17·18·19·20·21·22·29·30 신설 marker 반영을 요구
  - 문제: 실제 M0_PLAN § 9는 기존 CA-CASCADE-01~06만 있고 신규 CA-DEFER marker가 없다. docs cascade acceptance가 현재 상태로는 FAIL
  - 권장 patch: M0_PLAN § 9에 신규 CA-DEFER 8종 phase 분류 표를 추가하고 기존 CA-DEFER-01 부분 해소 표현과 연결
  - closeableAfterPatch: true

## minor
- **CAP2-06**: content-gate audit/notification event 이름이 REVIEW_WORKFLOW와 불일치
  - 위치: plan § 12.1, `docs/admin/REVIEW_WORKFLOW.md:523`
  - 근거(SoT): REVIEW_WORKFLOW § 9.1.1 event id는 `content-gate-queued`
  - 문제: plan 예시는 `content-gate-auto-enqueued`를 emit하여 알림 정책 매트릭스와 매칭되지 않음
  - 권장 patch: event id를 `content-gate-queued`로 통일하고 payload에 `source: "auto"`를 추가
  - closeableAfterPatch: true

## nit

## acceptance precondition 점검
- 18 canonical 룰 정합: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + steps 정합: FAIL
- contextExceptions OR 결합 + 같은 문장 단위 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 8 신설 phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 2
total_findings: 11
blocking: 4
major: 6
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
139,924
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=4 major=6 minor=1 (총 11)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11

## blocking
- **CAP-14 (잔존)**: `calculateFinalRoles` 단일 경로 명세가 실제 시그니처와 불일치
  - 위치: plan § 7.1 / § 11.2, `apps/web/src/lib/compliance/final-roles.ts:14`, `apps/web/src/lib/compliance/types.ts:3`
  - 근거(SoT): 실제 `calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)` 는 positional 인자이고, `ApproverRole` 은 `operator|medical|legal`만 허용
  - 문제: plan 은 객체 인자 `{ contentType, pageRiskLevel, priorReviewRequired, findingsRequiredRoles }` 호출을 명세하고, CAP-15의 `clientRolePresent` 처리 전제와 달리 실제 helper는 `client` 발견 시 throw
  - 권장 patch: plan 호출 예시를 실제 positional 시그니처로 정정하거나, 구현 변경 step에 `final-roles.ts` 시그니처/`ApproverRole` 확장/`client` non-fatal 처리 변경을 명시
  - closeableAfterPatch: true

- **CAP2-01**: auto-gate가 존재하지 않는 `envelope.meta.contentType/contentRef`를 사용
  - 위치: plan § 12.1, § 14.2
  - 근거(SoT): plan § 14.2 `ComplianceCheckEnvelope.meta` 는 `{ pageRiskLevel, catalogVersion, catalogHash, manualReview, exemptReason? }`
  - 문제: § 12.1 SQL은 `${envelope.meta.contentType}` / `${envelope.meta.contentRef}`를 사용하므로 타입상 컴파일 불가이며 content-gate enqueue 구현 경로가 끊김
  - 권장 patch: `enqueueContentGateIfNeeded(..., contentType, contentRef, ...)`로 명시 인자를 받거나 envelope.meta에 `contentType/contentRef`를 공식 추가하고 § 7.1 반환 예시까지 cascade
  - closeableAfterPatch: true

- **CAP-04 (잔존)**: § 2.4 SoT ID 수량·canonical 수량이 내부적으로 불일치
  - 위치: plan § 2.4
  - 근거(SoT): 사용자 acceptance precondition은 “18 canonical 룰 정합”; plan § 2.5는 core 14룰, § 2.6은 medical-ad 신규 13룰을 별도 정의
  - 문제: § 2.4는 “SoT 예시 ID 17종”이라고 하지만 표는 중복 포함 20개 이상 ID를 나열하고, 하단 “생성 13 / 흡수 11 / 미등록 1 / defer 1” 합계도 17과 맞지 않음. acceptance 기준인 18 canonical 룰을 검증할 수 없음
  - 권장 patch: “SoT 예시 ID”, “canonical 룰”, “core 변환 룰”, “medical-ad 신규 룰”을 별도 카운트로 재정의하고 acceptance precondition의 18 canonical 기준과 일치시키기
  - closeableAfterPatch: true

- **CAP-10 (잔존)**: content-gate와 manual-review 동시 open 전제가 실제 C0015 unique와 충돌
  - 위치: `packages/core-content/migrations/C0015_review_queue_entry.sql:46`, plan § 12.3 / § 15
  - 근거(SoT): C0015 실제 unique index는 `(instance_id, content_type, content_ref)` partial unique
  - 문제: plan은 manual-review + content-gate 동시 open 가능을 전제하지만, 기존 unique가 유지되는 동안 `content-gate` insert가 manual-review open row와 충돌
  - 권장 patch: C0018 unique 재정의를 acceptance blocker로 명시하고, manifest 단계 수를 “C0017 enum ADD VALUE 단독 + C0018 unique 재정의”로 고정
  - closeableAfterPatch: true

## major
- **CAP2-02**: `event-fact-statement-001` 허용 scope가 OR 스코프로 표현 불가
  - 위치: plan § 2.5, § 4.3, scenario #6/#7
  - 근거(SoT): CONTENT_STANDARDS § 5.7은 P-102/P-104/P-010 `articleType=event-price`만 가격·할인 사실 안내 허용
  - 문제: plan은 rule scope를 `global`로 두고 “허용 scope 외 검사”를 설명하지만 § 4.3 scope는 OR 결합만 지원한다. NOT/except 조건이 없어 scenario #6 “event-price 미매칭”을 결정적으로 구현할 수 없음
  - 권장 patch: `event-fact-statement-001`을 deny rule로 두려면 `excludeScopes` 또는 matcher 단계의 allowlist pre-check를 명세하거나, 허용 페이지 전용 positive rule과 금지 페이지 rule을 분리
  - closeableAfterPatch: true

- **CAP-12 (잔존)**: `evaluatedSteps/contributingSteps` 분리가 RISK_LEVELS SoT에 cascade 되지 않음
  - 위치: `docs/compliance/RISK_LEVELS.md:97`, plan § 10.1
  - 근거(SoT): RISK_LEVELS § 2.3.1은 여전히 단일 `steps[]`만 정의
  - 문제: plan은 `evaluatedSteps`와 `contributingSteps`를 영속 extensions까지 요구하지만 상위 SoT는 단일 steps라 구현자 기준이 갈라짐
  - 권장 patch: RISK_LEVELS § 2.3.1에 두 배열을 공식 타입으로 반영하고 기존 `steps[]`는 deprecated alias 또는 제거로 명시
  - closeableAfterPatch: true

- **CAP-19 (잔존)**: `ComplianceCheckEnvelope.extensions` 타입 cascade가 실제 `types.ts`와 server persist 경로에 없음
  - 위치: `apps/web/src/lib/compliance/types.ts:59`, `apps/web/src/lib/compliance/server-actions.ts:91`, plan § 14.2
  - 근거(SoT): plan § 14.2는 envelope 외부 `extensions` 영역과 DB 저장 시 `{ ...result, extensions }` 합성을 요구
  - 문제: 실제 `ComplianceCheckEnvelope`에는 `extensions`가 없고 `submitForReview`는 `JSON.stringify(envelope.result)`만 저장한다. plan이 “타입 cascade”를 말하지만 실제 patch step의 코드 영향 범위가 부족함
  - 권장 patch: `types.ts` 확장, `check.ts` 반환, `server-actions.ts` persist 합성, 기존 sentinel 기본값 처리까지 작업 step에 명시
  - closeableAfterPatch: true

- **CAP-05 (잔존)**: `celebrity-001` category가 CONTENT_STANDARDS § 4.1 문자열과 정확 일치하지 않음
  - 위치: plan § 2.5
  - 근거(SoT): `docs/core/CONTENT_STANDARDS.md:242` category는 “유명인 동원”
  - 문제: plan § 2.5는 category를 “(의료법 호 별도 — § 3.10 가까움)”로 둔다. “각 RiskRule.category는 SoT § 4.1 카테고리 칸 그대로 사용” 원칙 위반
  - 권장 patch: `celebrity-001.category = "유명인 동원"`으로 정정하고 legalBasis는 의료법 환자 유인 축으로 overlay
  - closeableAfterPatch: true

- **CAP2-03**: `foreign-patient-recruit-domestic-uncertain-001`가 composite/pageMeta 전제와 실제 룰 정의가 불일치
  - 위치: plan § 2.4 / § 2.6
  - 근거(SoT): MEDICAL_AD § 3.12는 국내광고 해당성 불명확 케이스를 매체·방식별 법무 판단으로 둠
  - 문제: § 2.4는 “다국어 페이지 메타 + 외국인 환자” composite라고 하지만 § 2.6 룰은 단순 regex이며 pageMeta/inLanguage/domestic medium 조건이 없음
  - 권장 patch: v0.1에서 pageMeta composite 미지원이면 명시 defer하거나, scope/evidence 입력에 `pageMeta.inLanguage`/국내매체 여부를 추가
  - closeableAfterPatch: true

- **CAP2-04**: runtime evidence가 필요한 의료법 특화 룰이 defer 없이 단순 regex로 과잉 확정됨
  - 위치: plan § 2.6
  - 근거(SoT): MEDICAL_AD § 3.2는 “6개월 이하 임상경력”, § 3.13은 허위·불명확 할인은 fail / 명확 사실 고지는 content-gate
  - 문제: `short-clinical-experience-001`은 `\d{1,2}개월` 전체를 fail로 잡아 7~99개월까지 차단 가능하고, `non-covered-discount-misleading-001`은 모든 `% 할인`을 content-gate로 잡아 “misleading” 판단 근거가 없음
  - 권장 patch: 숫자 predicate/evidence absence가 v0.1 미지원이면 해당 세부 판단을 Phase Beta defer로 옮기거나, matcher에 numeric predicate와 기간·대상 evidence 검사 계약을 추가
  - closeableAfterPatch: true

- **CAP2-05**: CA-CASCADE-09가 실제 M0_PLAN에 반영되지 않음
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:825`
  - 근거(SoT): plan § 18은 M0_PLAN § 9에 CA-DEFER-17·18·19·20·21·22·29·30 신설 marker 반영을 요구
  - 문제: 실제 M0_PLAN § 9는 기존 CA-CASCADE-01~06만 있고 신규 CA-DEFER marker가 없다. docs cascade acceptance가 현재 상태로는 FAIL
  - 권장 patch: M0_PLAN § 9에 신규 CA-DEFER 8종 phase 분류 표를 추가하고 기존 CA-DEFER-01 부분 해소 표현과 연결
  - closeableAfterPatch: true

## minor
- **CAP2-06**: content-gate audit/notification event 이름이 REVIEW_WORKFLOW와 불일치
  - 위치: plan § 12.1, `docs/admin/REVIEW_WORKFLOW.md:523`
  - 근거(SoT): REVIEW_WORKFLOW § 9.1.1 event id는 `content-gate-queued`
  - 문제: plan 예시는 `content-gate-auto-enqueued`를 emit하여 알림 정책 매트릭스와 매칭되지 않음
  - 권장 patch: event id를 `content-gate-queued`로 통일하고 payload에 `source: "auto"`를 추가
  - closeableAfterPatch: true

## nit

## acceptance precondition 점검
- 18 canonical 룰 정합: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + steps 정합: FAIL
- contextExceptions OR 결합 + 같은 문장 단위 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 8 신설 phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 2
total_findings: 11
blocking: 4
major: 6
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
