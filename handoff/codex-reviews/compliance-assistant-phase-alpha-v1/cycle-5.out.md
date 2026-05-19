OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e4a-225c-72b3-aeb1-20ec84e3f021
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.5 — **cycle 5**. cycle 1 (36) + cycle 2 (11) + cycle 3 (3) + cycle 4 (2) = 누계 52 finding 전건 수용. 수렴 추세 36 → 11 → 3 → 2. cycle 4 안 blocking 0 도달 · closeable 100% 유지. **acceptance 도달 가능 cycle**.

## cycle 4 결정·patch 요약

- **CAP4-01**: § 2.4 산수 정정 — § 3.8 합계 5 (단독 어휘 별도 plan 추가 row 1 분리). 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 runtime-meta + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count). 흡수 9 목록 § 3.3 false-credential 포함 명시. CA-CASCADE-07 "27 SoT 슬롯 매핑" 통일.
- **CAP4-02**: § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (mapComplianceErrorToResult helper).

## 본 cycle 검증 우선순위

cycle 4 patch 정합성 + 최종 잔존 결함 점검. 본 cycle 안 0 finding 도달 시 **acceptance 권장**. 1~2 finding 잔존 시 추가 cycle.

### cycle 4 patch 재검증
1. **CAP4-01 cycle 4 정정**: § 2.4 line 180 안 "1+3+2+1+1+2+1+5+2+1+1+2+2+3 = 27" 산수 정합. 흡수 9 목록 (treatment-effect-assertion · false-credential § 3.3 · graphic-procedure · exaggeration · effect-claim · guarantee · false-title · false-award · false-endorsement) 정합. duplicate display row § 3.9 false-credential-001 비-count 명시. plan 추가 단독 어휘 row § 3.8 비-SoT-count 명시. CA-CASCADE-07 (§ 18) 안 "27 SoT 슬롯 매핑" 정합
2. **CAP4-02 cycle 4 정정**: § 17.b 작업 단위 신설 — server-actions.ts 4 action 안 try/catch ComplianceConfigError + mapComplianceErrorToResult helper. 일반 Error 는 500 boundary 유지. M0_PLAN § 6.2 audit emit 패턴 정합 (tx commit 후 base role)
3. **§ 7.1.2 boundary 정책 일관성**: § 7.1.2 (cycle 3 추가) 안 boundary 결정 → § 17.b 작업 단위 (cycle 4 추가) 안 구현 step. plan 안 두 위치 정합

### 새로운 검증 영역

- **§ 2.4 표 본문 정합 (cycle 4 정정 후)**:
  - 표 line 184~213 실제 row 카운트 = 27 SoT row + 1 plan 추가 단독 어휘 row = 28 row 정합
  - 흡수 9 row 각각의 대체 canonical ruleId 명시 정합
  - duplicate display row § 3.9 false-credential-001 안 "비-count" 표기 (cycle 4 patch 안 헤더만 명시 — 표 본문 row 안 "비-count" 표기 필요 여부)
- **§ 7.1.1 extractFindingRoles 위치 정합**: helper 정의 위치 (check.ts 안 vs 별도 파일). 작업 단위 step 안 명시 위치
- **§ 17.b 새 step 안 산출물**:
  - mapComplianceErrorToResult helper 정의 위치 (server-actions.ts 안 또는 별도 helper 파일)
  - 4 action 안 try/catch 적용 일관성
- **acceptance precondition 정합** (cycle 4 acceptance 점검):
  - 27 SoT 슬롯 정합 - PASS 권장
  - 5 inlineRiskFlags - PASS
  - RiskInference evaluatedSteps/contributingSteps - PASS
  - contextExceptions - PASS
  - High triggeredBy - PASS
  - CA-DEFER 12 신설 phase 분류 - PASS
  - CA-CASCADE 9종 - PASS 권장

### Codex 비평 운영 원칙
- cycle 5 안 0 finding 도달 시 **`ready_for_acceptance=true` + `recommendation: "acceptance 권장"`** 명시
- 잔존 1~2 finding 시 cycle 6 진입 권장
- 새로운 결함 ID prefix = **CAP5** (cycle 5 신규)
- cycle 1·2·3·4 patch 잔존 finding 직접 인용

## SoT (cycle 1~4 동일)

본 monorepo working root 에서 직접 파일을 읽어 plan 과 대조.

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = N

## blocking
## major
## minor
## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: <PASS|FAIL>
- 5 inlineRiskFlags 추출 표 정합: <PASS|FAIL>
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: <PASS|FAIL>
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: <PASS|FAIL>
- High 가상 finding triggeredBy 판정 정합: <PASS|FAIL>
- CA-DEFER 5 + 12 신설 phase 분류 정합: <PASS|FAIL>
- CA-CASCADE 9종 정합: <PASS|FAIL>

=== CYCLE SIGNAL ===
cycle: 5
total_findings: <NN>
blocking: <N>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: true|false
scope_narrow_acceptable: true|false
recommendation: "acceptance 권장" 또는 "다음 cycle 진입 권장"
```

한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것.

codex
검토 대상 문서와 관련 섹션만 먼저 읽어서 cycle 4 패치가 실제 본문에 어떻게 반영됐는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"2\\.4|3\\.3|3\\.8|3\\.9|7\\.1\\.1|7\\.1\\.2|17\\.b|CA-CASCADE-07|false-credential|mapComplianceErrorToResult|extractFindingRoles|27 SoT|inlineRiskFlags|RiskInference|contextExceptions|triggeredBy|CA-DEFER|CA-CASCADE\" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Measure-Object -Line' in C:\Users\assag\solution\website-exposure
 succeeded in 644ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
11:  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
12:  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
13:  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
14:  - § 6 RiskInference 통합
16:- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6 YAML + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 (rules.core.yaml 표현 SoT — CAP-28 정정) · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
19:- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
21:- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 3.3 priority·SLA 표 (CAP-33 정정) · § 6.2 stale 처리는 Phase Beta · § 9.1.1 알림 정책
22:- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
38:- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
39:- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
42:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
44:### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
50:| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
51:| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
52:| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
53:| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
54:| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
55:| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
58:| **`metadata.inferredRiskLevel` 외부 입력 처리** (CAP-11 정정) | compliance-assistant § 3.3 정합 — **항상 내부 재계산** + **외부 입력과 MAX 결합**. 불일치 시 `auto_check_result.extensions.inferredRiskLevelMismatch` 안 외부값/내부값/최종값 audit 보존 (운영자 모니터링). 외부 입력 신뢰 skip 모드는 본 cycle 미합류 (성능 최적화 Phase Beta) |
60:| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
68:| **`unreviewed-ad-001` 카탈로그 등록** (CAP-16 정정) | check() 별도 흐름 (M0 plan v0.1 안) 유지하되 **§ 2.3 룰 표 안 명시** — "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" marker. `triggeredBy='static-rule'` 유지 (CONTENT_STANDARDS § 7.2 enum cascade 회피) |
69:| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
70:| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
71:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |
73:### 1.3 비범위 (defer) — CAP-25 정정 + CAP2-05 cycle 3 통일 (CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 명시)
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
95:| **pageMeta composite** — `foreign-patient-recruit-domestic-uncertain-001` (§ 3.12 불명확) 안 inLanguage/국내매체 evidence (v0.1 안 단순 regex) | Phase Beta | CA-DEFER-31 (cycle 2 CAP2-03 신설) |
96:| **numeric predicate** — `short-clinical-experience-001` (§ 3.2 6개월 이하) 안 6 이하 정확 매칭 (v0.1 안 1~99 모두 fail 보수 정책) | Phase Beta | CA-DEFER-32 (cycle 2 CAP2-04 신설) |
97:| **evidence absence** — `non-covered-discount-misleading-001` (§ 3.13) 안 기간/대상 명시 부재 검사 (v0.1 안 모든 % 할인 content-gate 보수 정책) | Phase Beta | CA-DEFER-33 (cycle 2 CAP2-04 신설) |
98:| **RiskRule.scope `excludeScopes[]` 필드** — NOT/except 표현 schema 지원 (v0.1 안 matcher allowlist pre-check · `event-fact-statement-001` 한정) | Phase Beta | CA-DEFER-34 (cycle 2 CAP2-02 신설) |
103:2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
107:6. **외부 inferredRiskLevel 입력 MAX 결합** (CAP-11 정정) — compliance-assistant § 3.3 SoT 정합. 외부 입력 + 내부 재계산 결과 불일치 시 audit metadata 안 보존 (운영자가 외부 호출자 신뢰성 모니터링).
113:### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)
122:├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
145:  contextExceptions:
166:    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
169:> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).
177:### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 4 카운트 정확화)
180:- MEDICAL_AD § 3.0~3.14 안 **명시된 SoT 예시 ID 총 27 슬롯**: § 3.1 (1) · § 3.2 (3) · § 3.3 (2) · § 3.4 (1) · § 3.5 (1) · § 3.6 (2) · § 3.7 (1) · § 3.8 (5) · § 3.9 (2) · § 3.10 (1) · § 3.11 (1) · § 3.12 (2) · § 3.13 (2) · § 3.14 (3) · § 3.15 (0 — 시행령 미존재). 합계 1+3+2+1+1+2+1+5+2+1+1+2+2+3 = **27 슬롯**
181:- **unique ID = 26** (§ 3.3 · § 3.9 안 `false-credential-001` 중복 1 제외)
182:- **표 row = 28**: 27 SoT 슬롯 + plan 추가 row 1 (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 안 생성 룰 · MEDICAL_AD § 3.8 안 명시 ID 아님 · 비-SoT-count display row)
185:- **27 SoT 슬롯 처리 합계**: 생성 15 (직접 매칭 신설 — SoT 슬롯 안 ID 카탈로그 등록) · canonical 흡수 9 (다른 canonical 룰로 대체 — `§ 3.2 treatment-effect-assertion-001` + `§ 3.3 false-credential-001` + `§ 3.6 graphic-procedure-001` + `§ 3.8 exaggeration-001` + `§ 3.8 effect-claim-001` + `§ 3.8 guarantee-001` + `§ 3.9 false-title-001` + `§ 3.14 false-award-001` + `§ 3.14 false-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) · **duplicate display row (비-count) 1** (`§ 3.9 false-credential-001` — 이미 § 3.3 흡수 처리 안 카운트 · 표 안 display 만) = 27 표현 · 26 acceptance count
186:- **acceptance precondition 통일** (CAP-04 cycle 4 정정): "**27 SoT 슬롯 표현 + 26 acceptance count (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 25 활성 canonical 룰 + plan 추가 단독 어휘 1 (비-SoT-count)**" — cycle 3 "생성 16 + 흡수 9 = 25" 산수 오류 정정
193:| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
194:| § 3.3 | `false-statement-001` | **생성** (단순 regex · CAP-29 한계 명시) | `false-statement-001` | `["medical-law-art56-para2-no3"]` |
195:| § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
201:| § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
202:| § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
203:| § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
204:| § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
205:| § 3.8 | `supremacy-001` | **생성** | `supremacy-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
206:| § 3.8 | (단독 어휘) | **생성** | `professional-assertion-standalone-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
207:| § 3.9 | `false-credential-001` | (§ 3.3 흡수 처리) | (위 참조) | 위 |
208:| § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
219:**SoT 27 슬롯 처리 합계 (cycle 4 정확)**: 생성 15 (직접 매칭 신설 · MEDICAL_AD SoT 안 명시 ID 카탈로그 등록) · canonical 흡수 9 (다른 룰로 대체 · `§ 3.2 treatment-effect-assertion-001` → `guarantee-composite-001` · `§ 3.3 false-credential-001` → `false-credential-001` (§ 3.9 unique 유지) · `§ 3.6 graphic-procedure-001` → `before-after-photo-001` · `§ 3.8 exaggeration-001` · `effect-claim-001` · `guarantee-001` → `guarantee-composite-001` · `§ 3.9 false-title-001` → `false-credential-001` · `§ 3.14 false-award-001` · `false-endorsement-001` → `award-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count. **duplicate display row 1** (`§ 3.9 false-credential-001` — § 3.3 안 흡수 처리 안 카운트 안 1회만 · 표 안 display row 만) = 27 표현 · **plan 추가 row 1** (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 생성 룰 · 비-SoT-count display row) = 28 표 row. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
236:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
258:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
263:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
272:    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
307:    # Phase Beta CA-DEFER-32 (numeric predicate) 안 1~6 만 매칭 정확화
313:    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
325:    rationale: "MEDICAL_AD § 3.3 - 인용/출처 부재 시 거짓 우려"
329:  - id: "false-credential-001"
340:    rationale: "MEDICAL_AD § 3.9 - 자격/명칭 거짓 표시"
399:    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
406:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
427:    # Phase Beta CA-DEFER-33 (evidence absence) 안 기간/대상/대상 명시 부재 검사 강화 - 명시된 정상 케이스 silent pass
434:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
455:> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).
529:> **CAP-17 정정**: contextExceptions 적용 시 — finding 안 카테고리가 `appliesTo.categories[]` 와 일치 + finding span 과 exception pattern span 이 같은 문장 (KSS fallback 시 정규식 한계) 안 overlap 또는 인접해야 함. `fail` composite 룰 (예: `guarantee-composite-001`) 은 안전 보장 위해 예외 미적용.
559:slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
567:> Phase Alpha 안 P-006 slot 격상 미합류 — TreatmentPage 실 schema (C0004) 안 `results` · `pricing` 필드 부재. body_markdown 단일 필드 안에서 키워드 매칭 필요 — `body-regex` matchCondition kind 신설 후 Phase Beta 합류. v0.1 안 RiskInference 안 slotMatches 입력 항상 `[]` (빈 배열).
571:JSON Schema Draft-07. **slot-matches.yaml 검증 표 — RISK_LEVELS § 3.3 수준 확장** (CAP-03):
591:기타 RISK_LEVELS § 3.3 SoT 표 (RiskRule · ContextException · medical-law-tracking · meta · overrides 검증) 모두 적용.
608:│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
609:│   ├── exceptions.ts      # contextExceptions 적용 (CAP-17)
623:  contextExceptions: ContextException[];
637:- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
638:- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
639:- `feature` scope 룰 → skip + warnings.push (CA-DEFER-16)
641:- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
645:### 3.3 빌드 시점 변환 (CA-BUILD-01)
689:  contextExceptions: ContextException[],
712:  4. ApproverRole · legalBasis · triggeredBy="static-rule" 메타 채움
714:  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
723:- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
724:- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
725:- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
743:Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).
773:  triggeredBy: "static-rule" | "inferred" | "explicit" | "llm-assist";
781:## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01 · CAP-17 정정)
803:- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
840:**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
848:- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
849:- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)
851:**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).
880:  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
887:  // 6. inlineRiskFlags 추출 (§ 8)
899:  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
903:    inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
938:  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
940:  const findingRoles = extractFindingRoles(allFindings);   // CAP3-01 - § 7.1.1 helper 정의
944:  // 안 form-level error 변환 boundary (CAP3-01 - § 7.1.2 정책).
951:  // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)
971:      inlineRiskFlagsEvidence: inlineFlagResult.evidence,
991:### 7.1.1 `extractFindingRoles` helper (CAP3-01 신설)
995:export function extractFindingRoles(findings: Finding[]): string[] {
1015:### 7.1.2 `calculateFinalRoles` throw boundary (CAP3-01 신설)
1028:`unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:
1039:    triggeredBy: 'static-rule',   // CONTENT_STANDARDS § 7.2 enum cascade 회피 (CAP-16)
1047:## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01 · CAP-05·20·21·22 정정)
1086:> CONTENT_STANDARDS § 7.1 cascade — metadata 안 7 신규 필드 (모두 optional). CA-CASCADE-06.
1101:### 9.2 Phase Beta 합류 시 (CA-DEFER-18)
1109:## 10. RiskInference 자동 추론 (CA-INFER-01 · CAP-12·13 정정)
1114:type RiskInferenceResult = {
1120:export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
1138:  for (const flag of input.inlineRiskFlags) {
1186:function buildHighGateFinding(input: ComplianceCheckInput, inference: RiskInferenceResult): Finding {
1187:  const triggeredBy = determineTriggeredBy(input);   // CAP-13 - input 만 검사
1196:    triggeredBy,
1276:- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker
1283:### 12.4 priority · slaDueAt 정책 (CAP-33 정정 — REVIEW_WORKFLOW § 3.3 인용)
1285:REVIEW_WORKFLOW § 3.3 표 그대로 인용:
1286:- **content-gate 큐 priority = P0** (REVIEW_WORKFLOW § 3.3)
1303:### 13.3 FAQ unlock 위치 (CAP-08 정정)
1321:- Publication · MediaAppearance status='draft' 만 잔존 — 외부 인용 entity 면제 (CONTENT_STANDARDS § 7.1.1.2). Phase Beta 안 별도 unlock 결정 (EC-DEFER-12 잔여)
1325:## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소 · CAP-18·19 정정)
1349:      "triggeredBy": "static-rule",
1358:    "inlineRiskFlagsEvidence": { /* ... */ },
1386:  inlineRiskFlagsEvidence: Record<InlineRiskFlag, Array<{ location, matchedText }>>;
1412:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01
1422:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01 · CAP-10 acceptance blocker
1467:### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)
1476:### 16.4 inlineRiskFlags (5건 · CAP-05 정정)
1480:| 23 | "최고의" 매칭 → category "최상급" → SoT 7 카테고리 안 미포함 → includes-effect-claim 미활성 (CAP-05) | inlineRiskFlags=[] |
1486:### 16.5 RiskInference (7건 · CAP-11·12 정정)
1492:| 30 | P-002 + inlineRiskFlags=[includes-pricing] → High | flag MAX 결합 |
1496:| 34 (CAP-12) | P-010 + articleType=notice + inlineRiskFlags=[includes-event] + explicit=Low → inlineFlag High 격상 + explicit Low 영향 없음 | evaluatedSteps 4건 · contributingSteps 2건 (pageType + inlineRiskFlag) |
1511:| 39 (CAP-35) | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 + includes-effect-claim flag + RiskInference High 가상 finding | findings 안 ruleId 안 'guarantee-composite-001' 포함 · 'risk-level-high-gate' 포함 · automatedDecision='block' · findings.length ≥ 2 (정확 count 안 고정 - "contains ruleIds" 검증) |
1534:| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
1535:| 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
1536:| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
1539:| 11 | auto-gate 큐 자동 진입 + block 제외 (CAP-06) + REVIEW_WORKFLOW § 3.3 priority/SLA (CAP-33) | auto-gate.ts + sla.ts |
1546:| **17.b** (CAP4-02 신설) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현): `submitForReviewAction` · `approveContentAction` · `rejectContentAction` · `publishContentAction` 4 action 안 `check()` 호출 + `calculateFinalRoles` 호출 + envelope persist 흐름 안 try/catch 추가. `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) ...; throw e; }` 패턴. ComplianceConfigError → `ActionResult { ok: false, formError }` 변환 · 일반 Error 는 500 boundary 통과 (Next.js error.tsx). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합 — 동일 helper 재사용 또는 별도 `mapComplianceErrorToResult` helper 신설. | server-actions.ts patch (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
1548:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
1552:## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)
1554:- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
1555:- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
1556:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1557:- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
1558:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
1559:- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
1560:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 **27 SoT 슬롯 → canonical 매핑** (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1 + duplicate display 1 = 27 표현 · 26 acceptance count · CAP-04 cycle 4 정정)
1561:- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
1562:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)
1570:| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
1572:| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
1576:| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
1577:| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
1587:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1588:| 2026-05-19 | **v0.5** | **Codex 자동 비평 cycle 4 2 finding (blocking 0·major 2·minor 0·nit 0) 전건 수용**. blocking 0 도달 (acceptance precondition 근접). closeable 100%. 수렴 추세 36 → 11 → 3 → 2. 누계 cycle 1+2+3+4 = 52 finding 전건 수용. 주요 patch: **CAP4-01** § 2.4 산수 정정 — § 3.8 합계 6 → 5 (단독 어휘 별도 row 분리 처리) · 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 미등록 + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count) · plan 추가 단독 어휘 row 1 (비-SoT-count) = 표 28 row. 흡수 9 목록 정확 명시 (§ 3.3 false-credential-001 포함 · § 3.9 duplicate display row 비-count). CA-CASCADE-07 안 "27 SoT 슬롯 매핑" 통일. **CAP4-02** § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (ComplianceConfigError → ActionResult formError 변환 · 일반 Error 는 500 boundary 통과 · mapComplianceErrorToResult helper). |
1589:| 2026-05-19 | v0.4 | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰". |
1590:| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1591:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 676ms:

[32;1mLines[0m[32;1m Words[0m[32;1m Characters[0m[32;1m Property[0m
[32;1m-----[0m [32;1m-----[0m [32;1m----------[0m [32;1m--------[0m
 1335                  


codex
§ 2.4와 § 17.b는 검색 결과상 대부분 반영되어 있습니다. 이제 표 본문 row와 helper 위치 같은 세부 정합성을 좁혀서 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; "'$lines=Get-Content $p; for($i=176;$i -le 222;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; "'$lines=Get-Content $p; for($i=930;$i -le 1030;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; "'$lines=Get-Content $p; for($i=1528;$i -le 1550;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
 succeeded in 704ms:
930:     allFindings.push(buildUnreviewedAdFinding());
931:   }
932: 
933:   // 12. severity 집계 + automatedDecision
934:   const aggregated = aggregate(allFindings);
935: 
936:   // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 + CAP3-01 boundary)
937:   //   final-roles.ts:14 positional 시그니처 정합
938:   //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
939:   //   CAP3-01 - calculateFinalRoles 안 unknown role throw 가능 → check() 자체는 throw bubble (호출자 책임)
940:   const findingRoles = extractFindingRoles(allFindings);   // CAP3-01 - § 7.1.1 helper 정의
941:   const clientRolePresent = findingRoles.includes('client');
942:   const findingRolesWithoutClient = findingRoles.filter(r => r !== 'client');
943:   // calculateFinalRoles throw 시 - check() 안 bubble (try/catch 없음). 호출자 (submitForReview 등)
944:   // 안 form-level error 변환 boundary (CAP3-01 - § 7.1.2 정책).
945:   const runtimeRoles = calculateFinalRoles(
946:     input.contentType,
947:     finalRiskLevel,
948:     input.metadata.priorReviewRequired ?? false,
949:     findingRolesWithoutClient,
950:   );
951:   // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)
952: 
953:   return {
954:     result: {
955:       automatedDecision: aggregated.automatedDecision,
956:       buildBlocked: aggregated.buildBlocked,
957:       gateRequired: aggregated.gateRequired,
958:       hasWarnings: aggregated.hasWarnings,
959:       findingsBySeverity: aggregated.bySeverity,
960:       requiredApproverRoles: runtimeRoles,
961:       findings: allFindings,
962:     },
963:     meta: {
964:       pageRiskLevel: finalRiskLevel,
965:       catalogVersion: catalog.catalogVersion,
966:       catalogHash: catalog.catalogHash,
967:       manualReview: false,
968:     },
969:     extensions: {                                              // CAP-19 - envelope.extensions 별도 영역
970:       suppressedByContextExceptions: matchResult.suppressedFindings,
971:       inlineRiskFlagsEvidence: inlineFlagResult.evidence,
972:       riskInferenceEvaluatedSteps: inference.evaluatedSteps,   // CAP-12 - 모든 source evaluation
973:       riskInferenceContributingSteps: inference.contributingSteps,   // base 갱신 source
974:       ruleMatchStats: { categoryCounts: countByCategory(matchResult.findings), elapsedMs: 0 },
975:       inferredRiskLevelMismatch,                               // CAP-11
976:       clientRolePresent,                                       // CAP-15
977:       engineMetadata: {                                        // CAP-26
978:         catalogVersion: catalog.catalogVersion,
979:         catalogHash: catalog.catalogHash,
980:         schemaHash: catalog.schemaHash,
981:         engineVersion: catalog.engineVersion,
982:         kssAvailable: catalog.kssAvailable,
983:       },
984:     },
985:   };
986: }
987: ```
988: 
989: > **DB persist 시** (CAP-19 정정): `auto_check_result = { ...envelope.result, extensions: envelope.extensions }` 합성. SoT 7 필드 (CONTENT_STANDARDS § 7.2) 위치 안 침해 없음 — `extensions` 키는 result 안에 nested 되어 JSONB 단일 컬럼 안 모두 영속.
990: 
991: ### 7.1.1 `extractFindingRoles` helper (CAP3-01 신설)
992: 
993: ```typescript
994: // apps/web/src/lib/compliance/check.ts 안 helper 또는 별도 final-roles-helpers.ts
995: export function extractFindingRoles(findings: Finding[]): string[] {
996:   // flatten + stable dedupe + non-array guard
997:   const all: string[] = [];
998:   for (const f of findings) {
999:     const roles = f.requiredApproverRoles;
1000:     if (!Array.isArray(roles)) continue;   // non-array guard - JSON 안 type mismatch 시 silent skip
1001:     for (const r of roles) {
1002:       if (typeof r === 'string' && r.length > 0) all.push(r);
1003:     }
1004:   }
1005:   // stable dedupe - 첫 등장 순서 보존
1006:   return Array.from(new Set(all));
1007: }
1008: ```
1009: 
1010: - input.findings 안 각 finding 의 `requiredApproverRoles?: ApproverRole[]` flatten
1011: - non-array (corrupted JSON) → silent skip (audit metadata 안 보존 가능 — Phase Beta)
1012: - 빈 문자열·non-string → skip
1013: - 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)
1014: 
1015: ### 7.1.2 `calculateFinalRoles` throw boundary (CAP3-01 신설)
1016: 
1017: - **check() 안** — `calculateFinalRoles` throw bubble. try/catch 없음 (check() 자체는 fail closed)
1018: - **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
1019: - ComplianceConfigError throw 시 envelope 생성 불가 → ComplianceRecord INSERT 안 됨 → 운영자 콘솔 안 "compliance config error" 표시 + 룰 카탈로그 또는 finding payload 점검 안내
1020: - 일반 catch (Error) 는 unhandled → 500 (Next.js error boundary)
1021: 
1022: ### 7.2 `derivePageTypeId` 매핑
1023: 
1024: (v0.1 동일 — § 7.2 v0.1 참조)
1025: 
1026: ### 7.3 `priorReviewRequired` 메타 검사 (CAP-16 정정)
1027: 
1028: `unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:
1029: 
1030: ```typescript

 succeeded in 721ms:
176: 
177: ### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 4 카운트 정확화)
178: 
179: **v0.5 카운트 정확 산수** (CAP-04 잔존 cycle 4 정정):
180: - MEDICAL_AD § 3.0~3.14 안 **명시된 SoT 예시 ID 총 27 슬롯**: § 3.1 (1) · § 3.2 (3) · § 3.3 (2) · § 3.4 (1) · § 3.5 (1) · § 3.6 (2) · § 3.7 (1) · § 3.8 (5) · § 3.9 (2) · § 3.10 (1) · § 3.11 (1) · § 3.12 (2) · § 3.13 (2) · § 3.14 (3) · § 3.15 (0 — 시행령 미존재). 합계 1+3+2+1+1+2+1+5+2+1+1+2+2+3 = **27 슬롯**
181: - **unique ID = 26** (§ 3.3 · § 3.9 안 `false-credential-001` 중복 1 제외)
182: - **표 row = 28**: 27 SoT 슬롯 + plan 추가 row 1 (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 안 생성 룰 · MEDICAL_AD § 3.8 안 명시 ID 아님 · 비-SoT-count display row)
183: - **acceptance count 26** (unique ID 기준 — duplicate 1 제외 · 단독 어휘 비-SoT 제외)
184: - **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건 · 단독 어휘 룰 포함) + rules.medical-ad.yaml 11 신규 룰
185: - **27 SoT 슬롯 처리 합계**: 생성 15 (직접 매칭 신설 — SoT 슬롯 안 ID 카탈로그 등록) · canonical 흡수 9 (다른 canonical 룰로 대체 — `§ 3.2 treatment-effect-assertion-001` + `§ 3.3 false-credential-001` + `§ 3.6 graphic-procedure-001` + `§ 3.8 exaggeration-001` + `§ 3.8 effect-claim-001` + `§ 3.8 guarantee-001` + `§ 3.9 false-title-001` + `§ 3.14 false-award-001` + `§ 3.14 false-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) · **duplicate display row (비-count) 1** (`§ 3.9 false-credential-001` — 이미 § 3.3 흡수 처리 안 카운트 · 표 안 display 만) = 27 표현 · 26 acceptance count
186: - **acceptance precondition 통일** (CAP-04 cycle 4 정정): "**27 SoT 슬롯 표현 + 26 acceptance count (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 25 활성 canonical 룰 + plan 추가 단독 어휘 1 (비-SoT-count)**" — cycle 3 "생성 16 + 흡수 9 = 25" 산수 오류 정정
187: 
188: | MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | 대체 canonical ruleId | legalBasis[] |
189: |---|---|---|---|---|
190: | § 3.1 | `new-medical-technology-unevaluated-001` | **생성** | `new-medical-technology-unevaluated-001` (rules.medical-ad.yaml) | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
191: | § 3.2 | `testimonial-001` | **생성** (composite) | `testimonial-001` | `["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]` |
192: | § 3.2 | `short-clinical-experience-001` | **생성** | `short-clinical-experience-001` | 동일 |
193: | § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
194: | § 3.3 | `false-statement-001` | **생성** (단순 regex · CAP-29 한계 명시) | `false-statement-001` | `["medical-law-art56-para2-no3"]` |
195: | § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
196: | § 3.4 | `comparison-001` | **생성** | `comparison-001` | `["medical-law-art56-para2-no4", "enforcement-decree-art23-para1-no4"]` |
197: | § 3.5 | `defamation-001` | **생성** | `defamation-001` | `["medical-law-art56-para2-no5"]` |
198: | § 3.6 | `graphic-procedure-001` | **canonical 흡수** → `before-after-photo-001` (전후사진 운영 단순화 — 수술 장면도 본 룰 안 포함) | `before-after-photo-001` | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
199: | § 3.6 | `before-after-photo-001` | **생성** | 동일 | 동일 |
200: | § 3.7 | `side-effect-missing-001` | **Phase Beta defer** (CAP-30 — NOT_IN_PARAGRAPH logic 부재) | (미생성) | `["medical-law-art56-para2-no7"]` (Phase Beta) |
201: | § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
202: | § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
203: | § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
204: | § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
205: | § 3.8 | `supremacy-001` | **생성** | `supremacy-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
206: | § 3.8 | (단독 어휘) | **생성** | `professional-assertion-standalone-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
207: | § 3.9 | `false-credential-001` | (§ 3.3 흡수 처리) | (위 참조) | 위 |
208: | § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
209: | § 3.10 | `editorial-format-ad-001` | **생성** | `editorial-format-ad-001` | `["medical-law-art56-para2-no10"]` |
210: | § 3.11 | `unreviewed-ad-001` | **카탈로그 미등록** (CAP-16 정정 — runtime-meta · § 7.3 별도 평가) | (미등록 · check() 별도 흐름) | `["medical-law-art56-para2-no11"]` (audit metadata 안) |
211: | § 3.12 | `foreign-patient-recruit-domestic-confirmed-001` | **생성** (composite — 한국어 + 외국인 환자 + 의료관광) | 동일 | `["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]` |
212: | § 3.12 | `foreign-patient-recruit-domestic-uncertain-001` | **생성** (composite — 다국어 페이지 메타 + 외국인 환자) | 동일 | 동일 |
213: | § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
214: | § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
215: | § 3.14 | `award-endorsement-001` | **생성** (canonical — 인증/보증/추천 단일 룰) | 동일 | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
216: | § 3.14 | `false-award-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
217: | § 3.14 | `false-endorsement-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
218: 
219: **SoT 27 슬롯 처리 합계 (cycle 4 정확)**: 생성 15 (직접 매칭 신설 · MEDICAL_AD SoT 안 명시 ID 카탈로그 등록) · canonical 흡수 9 (다른 룰로 대체 · `§ 3.2 treatment-effect-assertion-001` → `guarantee-composite-001` · `§ 3.3 false-credential-001` → `false-credential-001` (§ 3.9 unique 유지) · `§ 3.6 graphic-procedure-001` → `before-after-photo-001` · `§ 3.8 exaggeration-001` · `effect-claim-001` · `guarantee-001` → `guarantee-composite-001` · `§ 3.9 false-title-001` → `false-credential-001` · `§ 3.14 false-award-001` · `false-endorsement-001` → `award-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count. **duplicate display row 1** (`§ 3.9 false-credential-001` — § 3.3 안 흡수 처리 안 카운트 안 1회만 · 표 안 display row 만) = 27 표현 · **plan 추가 row 1** (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 생성 룰 · 비-SoT-count display row) = 28 표 row. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
220: 
221: ### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)
222: 

 succeeded in 653ms:
1528: |---|---|---|
1529: | 1 | `data/compliance-rules/` 6 YAML + schema.json 작성 | meta · rules.core · rules.medical-ad · context-exceptions · medical-law-tracking · slot-matches (v0.0 placeholder) · schema.json |
1530: | 2 | `packages/compliance-rules/` 신규 패키지 초기화 | package.json · tsconfig.json · src/ · build script |
1531: | 3 | loader + JSON Schema 검증 (Ajv) + catalogHash/schemaHash 분리 산정 | loader.ts · hash.ts |
1532: | 4 | RiskRule 매칭 엔진 (regex/keyword/phrase) + scope 일치 (field/block/feature skip+warning) | matcher.ts |
1533: | 5 | composite 평가 + KSS fallback wrapper | composite.ts · kss.ts |
1534: | 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
1535: | 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
1536: | 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
1537: | 9 | slot-matches evaluator (v0.1 빈 배열 반환) | slot-match.ts |
1538: | 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
1539: | 11 | auto-gate 큐 자동 진입 + block 제외 (CAP-06) + REVIEW_WORKFLOW § 3.3 priority/SLA (CAP-33) | auto-gate.ts + sla.ts |
1540: | 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
1541: | 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
1542: | 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
1543: | 15 | Drizzle schema v0.6 — reviewQueueType enum + unique index | packages/core-content/src/schema.ts |
1544: | 16 | manifest 21단계 (M0 19 + C0017 + C0018) | packages/migrations-runner/src/manifest.ts |
1545: | 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
1546: | **17.b** (CAP4-02 신설) | **server-actions.ts 4 action 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현): `submitForReviewAction` · `approveContentAction` · `rejectContentAction` · `publishContentAction` 4 action 안 `check()` 호출 + `calculateFinalRoles` 호출 + envelope persist 흐름 안 try/catch 추가. `catch (e: unknown) { if (e instanceof ComplianceConfigError) return { ok: false, formError: e.message }; if (e instanceof ComplianceTransitionError) ...; throw e; }` 패턴. ComplianceConfigError → `ActionResult { ok: false, formError }` 변환 · 일반 Error 는 500 boundary 통과 (Next.js error.tsx). 기존 saveArticle 안 mapDbErrorToResult 패턴 정합 — 동일 helper 재사용 또는 별도 `mapComplianceErrorToResult` helper 신설. | server-actions.ts patch (M0_PLAN § 6.2 audit emit 패턴 안 추가) |
1547: | 18 | vitest 42 scenarios (cycle 1 정정 시나리오 17a/17b · 33 · 34 · 38 · 39 · 41 추가) | __tests__/ |
1548: | 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
1549: 
1550: ---

codex
표는 28행으로 맞고, 산수도 27 슬롯 표현과 26 acceptance count로 일관됩니다. 남은 가능성은 action boundary가 M0_PLAN의 실제 action 흐름과 어긋나는지라서 해당 SoT를 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"6\\.2|submitForReview|approveContent|rejectContent|publishContent|server-actions|audit|ComplianceConfigError|ComplianceTransitionError|mapDbErrorToResult|ActionResult\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "27 SoT|canonical|professional-assertion|false-credential|§ 3|CA-CASCADE-07|MEDICAL_AD" docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md docs/core/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg \"server-actions\\.ts"'$|check'"\\.ts"'$|final-roles"' in C:\Users\assag\solution\website-exposure
 succeeded in 748ms:
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
16:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 위치 정책 · base role
39:| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
51:| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
224:- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
421: *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
432:      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
436:      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
486:    if (err instanceof ComplianceConfigError) {
545://   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
580:    throw new ComplianceConfigError(
635:// submitForReview 안 호출 흐름:
652:- M0 stub 의 High 가상 finding 시 gateRequired=true — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.
679:- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
680:- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
691:export async function submitForReview(
699:export async function approveContent(
704:export async function rejectContent(
709:export async function publishContent(
715:### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정
717:REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade:
721:| `content-submitted-for-review` | submitForReview action 성공 | `{contentType, contentRef, recordId, entryId, finalRoles, pageRiskLevel}` |
722:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
723:| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
724:| `content-published` | publishContent action 성공 | `{contentType, contentRef, recordId, recordVersion}` |
731:// approveContent 안 race 차단
761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
766:| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
775:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
776:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
789:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
795:| 14 | audit emit 4종 (REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade) | (각 server action 안 emitAuditEvent + CA-CASCADE-06 doc patch) |
797:| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |
847:- `CA-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 9.1.1 + `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` audit matrix cascade — eventType 4종 · payload shape · emit 시점 (tx commit 후 base role) · 실패 정책
858:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
859:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 766ms:
docs/compliance/RISK_LEVELS.md:12:> - 페이지 타입별 위험도 기본값 → `core/PAGE_TYPES.md` (§ 3)
docs/compliance/RISK_LEVELS.md:14:> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
docs/compliance/RISK_LEVELS.md:48:- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속
docs/compliance/RISK_LEVELS.md:67:  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급
docs/compliance/RISK_LEVELS.md:70:  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
docs/compliance/RISK_LEVELS.md:76:  slotId: string;                     // PAGE_TYPES § 3 슬롯 ID (예: "P-006-content-results")
docs/compliance/RISK_LEVELS.md:84:1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
docs/compliance/RISK_LEVELS.md:123:### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)
docs/compliance/RISK_LEVELS.md:132:> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.
docs/compliance/RISK_LEVELS.md:143:├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
docs/compliance/RISK_LEVELS.md:145:├── context-exceptions.yaml     # CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그 (§ 3.4.3 스키마)
docs/compliance/RISK_LEVELS.md:147:└── meta.yaml                   # 룰 카탈로그 메타데이터·버전 인덱스 (§ 3.4.1)
docs/compliance/RISK_LEVELS.md:227:| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
docs/compliance/RISK_LEVELS.md:238:| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
docs/compliance/RISK_LEVELS.md:244:| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
docs/compliance/RISK_LEVELS.md:247:**context-exceptions.yaml** (§ 3.4.3 스키마)
docs/compliance/RISK_LEVELS.md:258:| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
docs/compliance/RISK_LEVELS.md:269:| `meta.yaml` 구조 위반 (§ 3.4.1 참조) | **fail** |
docs/compliance/RISK_LEVELS.md:418:- 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)
docs/compliance/RISK_LEVELS.md:576:- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
docs/compliance/RISK_LEVELS.md:651:1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
docs/compliance/RISK_LEVELS.md:704:| ~~RL-02~~ | `overrides[]` 섹션의 정확한 머지 알고리즘 | v0.2 — § 3.4.2 명세. 스칼라/객체/배열별 머지 규칙 + 동일 targetRuleId 카탈로그 1개 제약 명시 |
docs/compliance/RISK_LEVELS.md:714:| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
docs/compliance/RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
docs/compliance/RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
docs/compliance/RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
docs/compliance/RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
docs/core/CONTENT_STANDARDS.md:13:> - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
docs/core/CONTENT_STANDARDS.md:15:> - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
docs/core/CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
docs/core/CONTENT_STANDARDS.md:207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
docs/core/CONTENT_STANDARDS.md:210:  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
docs/core/CONTENT_STANDARDS.md:213:- 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화
docs/core/CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
docs/core/CONTENT_STANDARDS.md:246:> 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.
docs/core/CONTENT_STANDARDS.md:253:| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
docs/core/CONTENT_STANDARDS.md:280:> **운영 정책**: 본 표는 v0.4 최초 — 운영 누적으로 사례 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 풍부화.
docs/core/CONTENT_STANDARDS.md:301:- 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
docs/core/CONTENT_STANDARDS.md:311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
docs/core/CONTENT_STANDARDS.md:414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
docs/core/CONTENT_STANDARDS.md:424:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
docs/core/CONTENT_STANDARDS.md:546:  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
docs/core/CONTENT_STANDARDS.md:651:| CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |
docs/core/CONTENT_STANDARDS.md:669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs/core/CONTENT_STANDARDS.md:671:| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
docs/core/CONTENT_STANDARDS.md:674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs/core/CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:24:  - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyword>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:25:  - 본 문서·`rules.medical-ad.yaml`은 RiskRule.id로 1:N 매핑 — 1개 법령 호에 여러 RiskRule 가능, 1개 RiskRule이 여러 법령 호 참조 가능 (§ 3 각 절의 RiskRule은 `legalBasis[]`로 복수 조문 인용)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:26:  - `medical-law-tracking.yaml`이 미생성인 동안 `RISK_LEVELS.md` § 3.3의 "파일 부재 시 fail" 검증은 **자체 룰 checker 비활성 상태에서만 유보**. checker 활성화 즉시 본 문서 § 11.2 표를 YAML로 변환해야 함 (실제 구현 마일스톤에서 동시 생성 — `RISK_LEVELS.md` § 7.1.3 절차 활성화 시점)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:50:| 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:55:본 문서는 표현 카테고리 원본 SoT가 아님 — CONTENT_STANDARDS § 4 변경 시 본 문서 § 3 매핑만 cascade. 5개 SoT는 § 11 개정 이력과 동시 갱신.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:59:- RiskRule 데이터 포맷·로드·머지 — `RISK_LEVELS.md` § 3
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:80:| **제2항** | **의료광고 금지 유형 15호 각 호 열거** — 본 문서 § 3이 호별 매핑 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:88:| 1호 | 평가받지 아니한 신의료기술 광고 | § 3.1 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:89:| 2호 | 환자에 관한 치료경험담 광고 (제3자가 환자의 치료경험을 표현하는 것 포함) | § 3.2 / § 5 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:90:| 3호 | 거짓된 내용을 표시하는 광고 | § 3.3 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:91:| 4호 | 다른 의료기관·의료인을 비교하는 광고 | § 3.4 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:92:| 5호 | 다른 의료기관·의료인을 비방하는 광고 | § 3.5 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:93:| 6호 | 수술 장면 등 직접적 시술 행위를 노출하는 광고 (시행령 제23조제1항제6호와 결합) | § 3.6 / § 6 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:94:| 7호 | 의료인 등의 기능·진료방법과 관련하여 심각한 부작용 등 정보를 누락하는 광고 | § 3.7 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:95:| 8호 | **객관적인 사실을 과장하는 광고** | § 3.8 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:96:| 9호 | **법적 근거가 없는 자격·명칭을 표방하는 광고** | § 3.9 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:97:| 10호 | 신문·방송·잡지 등을 이용하여 기사 또는 전문가의 의견 형태로 표현되는 광고 (기사형 광고) | § 3.10 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:98:| 11호 | 제57조에 따른 심의를 받지 아니하거나 심의받은 내용과 다른 광고 | § 3.11 / § 4 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:99:| 12호 | 외국인환자 유치를 위한 국내광고 (의료법 제27조제3항 위반 광고) | § 3.12 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:100:| 13호 | **비급여 진료비용의 할인·면제 광고로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법** | § 3.13 / § 7 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:101:| 14호 | **각종 상장·감사장 등을 이용하는 광고 또는 인증·보증·추천 표현 광고** (원칙 금지, 가~라목 법정 예외는 **인증·보증 표시만** — 의료기관 인증(가목)·공공기관 인증·보증(나목)·다른 법령 인증·보증(다목)·WHO/ISQua 등 국제 인증(라목). 추천 표시는 예외 범위 아님) | § 3.14 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:102:| 15호 | 그 밖에 의료광고의 방법 등이 의료법 시행령으로 정하는 광고 (시행령 제23조 위임 조항) | § 3.15 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:119:| **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:120:| **제2항** | 제56조제2항제14호 라목의 **국제 인증 구체 범위** — WHO/ISQua 등 시행령이 정하는 국제 인증 | § 3.14 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:124:> ⚠️ 시행령 제23조는 제56조제2항의 단순 위임이 아니라 **각 호의 구체 기준 명세**. 본 문서 § 3 각 절은 법 본문 호 + 시행령 호의 결합으로 운영.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:139:본 § 3은 의료법 제56조제2항 각 호와 `data/compliance-rules/rules.medical-ad.yaml`의 RiskRule을 매핑한다. **표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4가 SoT** — 본 § 3은 법령 조문과 룰 ID의 **연결 매핑 SoT**.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:141:### 3.0 canonical RiskRule + legalBasis[] 패턴
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:143:동일 본문 표현이 여러 법령 호와 결합되는 경우, **canonical RiskRule 1개**만 정의하고 `legalBasis[]` 필드(또는 동등 메타)로 복수 조문을 인용한다. 동일 문구가 여러 RiskRule로 중복 매칭되어 finding이 부풀려지는 것을 회피.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:147:  - canonical RiskRule: `guarantee-composite-001` (CompositeRiskRule, severity=fail)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:149:- 본 § 3 각 절은 카테고리 의미상 다른 호에 동일 표현 축이 보이더라도 RiskRule 자체는 canonical 1개로 정의. 본 § 3의 호별 절은 **법령 인용 매핑 SoT**일 뿐 RiskRule 정의 SoT 아님 (RiskRule 정의 SoT는 `rules.medical-ad.yaml`)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:151:> CONTENT_STANDARDS § 7.4 RiskRule 스키마에 `legalBasis: string[]` 필드 cascade 필요 — RISK_LEVELS § 3.3 JSON Schema 검증에 항목 추가.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:168:- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:173:- **RiskRule (예시 ID)**: `false-statement-001`, `false-credential-001`
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:175:- **검출**: 통계·자격·실적 주장 + 인용 부재 → content-gate (`CONTENT_STANDARDS § 3.5`)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:213:- **RiskRule (예시 ID)**: `false-credential-001`, `false-title-001`
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:235:| 확정 | `foreign-patient-recruit-domestic-confirmed-001` | **fail** | (fail이므로 미적용 — § 3.3.1) | 국내광고 해당성이 명백 (예: 한국어로 외국인환자 유치 안내, 한국 내 SNS·전단지) |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:266:- 본 § 3.15는 **개정 추적 자리표시** — 시행령 개정으로 신규 금지 기준 신설 시 본 절 cascade + RiskRule 추가
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:296:1. 콘텐츠 발행 전 — 본 문서 § 3 카테고리 매칭 + § 4.2 매체 판정
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:327:> 위 면제 항목은 사전심의 면제일 뿐 — 본 문서 § 3 금지 표현(거짓·과장·비교 등)은 매체와 무관하게 항상 적용됨.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:343:- 치료 효과 오인 우려 — § 3.2 단정 표현(반드시·확실히·100%) 결합
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:393:- 일괄 금지 아님 — 허위·불명확·압박형은 fail, 명확한 사실 고지는 법무 검수 후 발행 (§ 3.13 정합)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:423:`CONTENT_STANDARDS.md` § 3.5 citation absence 검출에서 사용. 본 § 8이 화이트리스트의 SoT.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:435:- 화이트리스트 외 URL은 인용 불인정 — `CONTENT_STANDARDS § 3.5` content-gate
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:508:- `data/compliance-rules/rules.preset-hanui-clinic.yaml` (`RISK_LEVELS.md` § 3.1 정합)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:565:> 실제 개정 발생 시 본 표에 행 추가 + `medical-law-tracking.yaml`에 동시 추가 (`RISK_LEVELS.md` § 7.1.3 절차). 컬럼 위반·누락은 빌드 fail (`RISK_LEVELS.md` § 3.3 검증).
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:585:| MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.medical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:607:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 3.12 외국인환자 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-keyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskRule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CONTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSON Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:611:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (13개 지적 전건 수용 — 의료법 조문 구조 전면 재작성)**: (1) § 2.2 의료법 제56조제2항 **15호 카탈로그**로 재구성 (이전 11종 오류 수정). 비방·수술장면 노출·기사형·미심의·외국인환자 유치 국내광고·비급여 할인면제 오인·인증 부정사용·상장 부정사용 추가, (2) § 2.1 제1항(비의료인 광고 금지·정의)과 제2항(금지 유형) 구조 분리 — 이전 "제1항 금지 항목" 표현 오류 정정, (3) § 3.1 평가받지 아니한 **신의료기술** 광고로 정정 (미승인 의료기기·약품은 약사법·의료기기법 별도), (4) § 3.4·§ 3.5·§ 3.6 등 호 번호 정정 (비교 4호·비방 5호·수술장면 6호·과대 8호·기사형 9호·미심의 10호 등), (5) § 3.6 수술 장면·환부 노출(시행령 결합)과 § 6 전후사진 보수적 운영 정책 구분, (6) § 4.1 제56조제3항 방송 광고 매체 자체 금지 명시 — TV·라디오 "심의 통과 시 가능" 오해 회피, (7) § 4.2 시행령 제24조제1항 4종 매체 + 제2항 SNS 매체 정확히 분류, (8) § 4.4 사전심의 면제 항목을 시행령 제24조제7항 한정 항목(성명·성별·면허종류·전문의 자격·전문과목·진료시간·진료과목)으로 좁힘. 일반 학력·경력 과잉 면제 정정, (9) § 1.2 SoT 분리표 — 표현 카테고리 원본은 `CONTENT_STANDARDS § 4`, 본 문서는 의료법 조문·매핑 SoT로 제한, (10) § 8 인용 가능 도메인 화이트리스트 정밀화 — 와일드카드 제거·기관 단위 등록·원문/검색 구분·KoreaMed 등 한국 학술 추가·인정 않는 카테고리 명시, (11) § 0 data/compliance-rules/ 미생성 명시 — v0.1 시점 파일 부재. ID는 예시, (12) § 10.3 다국어 — `PageMeta.inLanguage` + `InternationalSupport` 결합, 사전 결합 AND→**finding 합집합** 정정, (13) § 11.2 개정 이력 표를 `medical-law-tracking.yaml`과 동일 11개 컬럼(lawSource·affectedArticles·revisionType·checkedAt/By·affectedRuleIds·staleScope 등)으로 정합 + 시행령 별도 행 추가. MA-06 미결정 신설 |

 succeeded in 777ms:
apps\spike-d\src\drift-check.ts
apps\web\src\lib\compliance\final-roles.ts
apps\web\src\lib\compliance\check.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\lib\compliance\publishable-check.ts
apps\spike-d\src\scenarios\test-drift-check.ts

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md'; "'$lines=Get-Content $p; for($i=680;$i -le 735;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/server-actions.ts'; if(Test-Path "'$p){ rg -n "export async function|check'"\\(|calculateFinalRoles|emitAuditEvent|ComplianceConfigError|ComplianceTransitionError|map.*Error|try|catch|submitForReview|approveContent|rejectContent|publishContent\" "'$p }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/check.ts'; if(Test-Path "'$p){ rg -n "extractFindingRoles|calculateFinalRoles|ComplianceConfigError|LegalDocument|extensions|riskInferenceEvaluatedSteps|riskInferenceContributingSteps|inlineRiskFlags" $p }' in C:\Users\assag\solution\website-exposure
 succeeded in 628ms:
680: - "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
681: - "검수 큐 진입" 후에는 form 자체 read-only — 검수자 액션은 /review-queue/{entryId} 에서
682: 
683: ## 6. server action 결정 — CAM-17·20 정정
684: 
685: ### 6.1 4 server action 시그니처 (CA-ACTION-01)
686: 
687: `apps/web/src/lib/compliance/transitions.ts` (helper) + entity별 actions.ts 안 thin wrapper.
688: 
689: ```typescript
690: // transitions.ts
691: export async function submitForReview(
692:   tx: TransactionSql, ctx: TenantContext,
693:   contentType: ContentType, contentRef: string,
694:   contentRow: { id: string; status: string; risk_level?: string | null },
695: ): Promise<{ recordId: string; entryId: string }>;
696: 
697: // CAM-17 정정 — approve 첫 호출이 atomic open→in-progress + status review-queued→in-review 동시 전이.
698: //   재approve 시 status=in-review 유지.
699: export async function approveContent(
700:   tx: TransactionSql, ctx: TenantContext,
701:   recordId: string, role: ApproverRole, actorUserId: string,
702: ): Promise<{ allApproved: boolean; entryStatus: "in-progress" | "resolved" }>;
703: 
704: export async function rejectContent(
705:   tx: TransactionSql, ctx: TenantContext,
706:   recordId: string, reason: string, role: ApproverRole, actorUserId: string,
707: ): Promise<void>;
708: 
709: export async function publishContent(
710:   tx: TransactionSql, ctx: TenantContext,
711:   contentType: ContentType, contentRef: string, recordId: string, actorUserId: string,
712: ): Promise<void>;
713: ```
714: 
715: ### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정
716: 
717: REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade:
718: 
719: | eventType | trigger | payload shape |
720: |---|---|---|
721: | `content-submitted-for-review` | submitForReview action 성공 | `{contentType, contentRef, recordId, entryId, finalRoles, pageRiskLevel}` |
722: | `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
723: | `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
724: | `content-published` | publishContent action 성공 | `{contentType, contentRef, recordId, recordVersion}` |
725: 
726: emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).
727: 
728: ### 6.3 advisory lock (CA-ACTION-02) — CAM-27 정정
729: 
730: ```typescript
731: // approveContent 안 race 차단
732: const key = hashUuidTo64Bit(recordId);  // CAM-27 정정 — hashtextextended(uuid::text) 또는 UUID 의 16바이트를 2개 int8 로 분할
733: await tx`SELECT pg_advisory_xact_lock(${key})`;
734: ```
735: 

 succeeded in 647ms:
10:import { ComplianceConfigError } from "./types";
17: * LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
18: *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
22:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
44:      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
53: * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
60:  if (input.contentType === "LegalDocument") {
61:    throw new ComplianceConfigError(
62:      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
63:      "Use buildLegalDocumentExemptEnvelope() instead.",

 succeeded in 662ms:
2:// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
14:import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
43:  entryId: string;
49: * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
51:export async function submitForReview(
57:    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
71:    : await check(checkInput);
74:  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
101:  // ReviewQueueEntry INSERT (open)
102:  const entryRows = await tx<{ id: string }[]>`
103:    INSERT INTO review_queue_entry (
119:  const entryId = entryRows[0]!.id;
121:  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
131:export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
137:export async function approveContent(
145:  // entry + record FOR UPDATE
146:  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
147:  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
148:  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
151:      FROM review_queue_entry
156:  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
157:  const entry = entryRows[0]!;
158:  if (!entry.required_roles.includes(args.role)) {
159:    throw new ComplianceTransitionError(
160:      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
163:  // CAMC3-01: entry vs args 정합 — drift 차단
170:  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
171:    throw new ComplianceTransitionError(
172:      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
186:  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
188:  // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
189:  if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
190:    throw new ComplianceTransitionError(
191:      `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
195:    throw new ComplianceTransitionError(
202:    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
218:  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
219:  if (entry.status === "open") {
221:      UPDATE review_queue_entry
226:       WHERE id = ${entry.id}::uuid
243:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
246:  let entryStatus: "in-progress" | "resolved" = "in-progress";
257:    // entry resolved
259:      UPDATE review_queue_entry
265:       WHERE id = ${entry.id}::uuid
267:    entryStatus = "resolved";
270:  return { allApproved, entryStatus };
275:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
288: * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
290:export async function rejectContent(
297:    throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
301:  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
303:  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
306:      FROM review_queue_entry
311:  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
312:  const rejEntry = entryRows[0]!;
313:  if (!rejEntry.required_roles.includes(args.role)) {
314:    throw new ComplianceTransitionError(
315:      `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
324:  if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
325:    throw new ComplianceTransitionError(
326:      `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
329:  // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
334:  if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
336:    throw new ComplianceTransitionError(
343:    UPDATE review_queue_entry
350:     WHERE id = ${rejEntry.id}::uuid
374:export async function publishContent(
394:  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
396:  if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
399:    throw new ComplianceTransitionError(
406:    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
415:  if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
441:    throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);

codex
M0_PLAN 기준으로는 `submitForReview`만 `check()`와 envelope persist를 수행하고, `approveContent`는 역할 재계산 경로, `rejectContent`/`publishContent`는 전이·발행 검증 경로입니다. 이 차이가 § 17.b의 작업 설명에 영향을 주는지 최종 판단하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/server-actions.ts'; "'$lines=Get-Content $p; for($i=45;$i -le 125;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/server-actions.ts'; "'$lines=Get-Content $p; for($i=235;$i -le 282;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/server-actions.ts'; "'$lines=Get-Content $p; for($i=288;$i -le 412;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
 succeeded in 640ms:
235:          ELSE status
236:        END,
237:        updated_at = now()
238:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
239:   `);
240: 
241:   // AND 게이트 평가
242:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
243:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
244:   const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
245: 
246:   let entryStatus: "in-progress" | "resolved" = "in-progress";
247:   if (allApproved) {
248:     // entity in-review → approved → publishable (publishable evaluator pass 시)
249:     const publishable = evaluatePublishable(record, record.content_type as ContentType);
250:     const targetStatus = publishable.publishable ? "publishable" : "approved";
251:     await tx.unsafe(`
252:       UPDATE ${args.contentTable}
253:          SET status = '${targetStatus}'::content_publication_status,
254:              updated_at = now()
255:        WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
256:     `);
257:     // entry resolved
258:     await tx`
259:       UPDATE review_queue_entry
260:          SET status = 'resolved'::review_queue_status,
261:              resolved_at = ${now.toISOString()}::timestamptz,
262:              resolved_by = ${ctx.userId}::uuid,
263:              resolution_type = 'approved',
264:              updated_at = now()
265:        WHERE id = ${entry.id}::uuid
266:     `;
267:     entryStatus = "resolved";
268:   }
269: 
270:   return { allApproved, entryStatus };
271: }
272: 
273: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
274:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
275:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
276:   return finalRoles.every((r) => isRoleSatisfied(record, r));
277: }
278: 
279: export type RejectContentArgs = {
280:   recordId: string;
281:   reason: string;
282:   role: ApproverRole;

 succeeded in 676ms:
45:   pageRiskLevel: "Low" | "Medium" | "High";
46: };
47: 
48: /**
49:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
50:  */
51: export async function submitForReview(
52:   tx: ScopedTx,
53:   ctx: TenantContext,
54:   args: SubmitForReviewArgs,
55: ): Promise<SubmitForReviewResult> {
56:   if (!isAllowedSubmitType(args.contentType)) {
57:     throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
58:   }
59:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
60: 
61:   const checkInput = {
62:     contentType: args.contentType,
63:     contentRef: args.contentRef,
64:     body: args.contentRow.body ?? "",
65:     metadata: {
66:       explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
67:     },
68:   };
69:   const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
70:     ? buildLegalDocumentExemptEnvelope(checkInput)
71:     : await check(checkInput);
72: 
73:   const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
74:   const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
75: 
76:   // ComplianceRecord INSERT (pre-publish)
77:   const slaHours = SLA_DUE_HOURS.P0;
78:   const recordRows = await tx<{ id: string }[]>`
79:     INSERT INTO compliance_record (
80:       instance_id, content_type, content_ref, page_risk_level, auto_check_result,
81:       record_phase, record_version, metadata
82:     ) VALUES (
83:       ${ctx.instanceId}::uuid,
84:       ${args.contentType}::compliance_content_type,
85:       ${args.contentRef},
86:       ${envelope.meta.pageRiskLevel}::risk_level,
87:       ${JSON.stringify(envelope.result)}::jsonb,
88:       'pre-publish'::compliance_record_phase,
89:       1,
90:       ${JSON.stringify({
91:         manualReview: envelope.meta.manualReview,
92:         catalogVersion: envelope.meta.catalogVersion,
93:         catalogHash: envelope.meta.catalogHash,
94:         ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
95:       })}::jsonb
96:     )
97:     RETURNING id
98:   `;
99:   const recordId = recordRows[0]!.id;
100: 
101:   // ReviewQueueEntry INSERT (open)
102:   const entryRows = await tx<{ id: string }[]>`
103:     INSERT INTO review_queue_entry (
104:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
105:       status, priority, required_roles, sla_due_at
106:     ) VALUES (
107:       ${ctx.instanceId}::uuid,
108:       'manual-review'::review_queue_type,
109:       ${args.contentType}::compliance_content_type,
110:       ${args.contentRef},
111:       ${recordId}::uuid,
112:       'open'::review_queue_status,
113:       'P0'::review_queue_priority,
114:       ${finalRoles}::approver_role[],
115:       ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
116:     )
117:     RETURNING id
118:   `;
119:   const entryId = entryRows[0]!.id;
120: 
121:   return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
122: }
123: 
124: export type ApproveContentArgs = {
125:   recordId: string;

 succeeded in 635ms:
288:  * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
289:  */
290: export async function rejectContent(
291:   tx: ScopedTx,
292:   ctx: TenantContext,
293:   args: RejectContentArgs,
294: ): Promise<void> {
295:   assertReviewerEligibility(ctx, args.role);
296:   if (args.reason.trim().length < 50) {
297:     throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
298:   }
299:   await acquireRecordLock(tx, args.recordId);
300: 
301:   // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
302:   // CAMC3-01 정정: content_type/content_ref drift 검증.
303:   const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
304:     SELECT id, required_roles::text[] AS required_roles,
305:            content_type::text AS content_type, content_ref
306:       FROM review_queue_entry
307:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
308:        AND status IN ('open', 'in-progress')
309:      FOR UPDATE
310:   `;
311:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
312:   const rejEntry = entryRows[0]!;
313:   if (!rejEntry.required_roles.includes(args.role)) {
314:     throw new ComplianceTransitionError(
315:       `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
316:     );
317:   }
318:   const expectedRejContentType = args.contentTable === "article" ? "Article"
319:     : args.contentTable === "treatment_page" ? "TreatmentPage"
320:     : args.contentTable === "legal_document" ? "LegalDocument"
321:     : args.contentTable === "faq" ? "FAQ"
322:     : args.contentTable === "publication" ? "Publication"
323:     : "MediaAppearance";
324:   if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
325:     throw new ComplianceTransitionError(
326:       `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
327:     );
328:   }
329:   // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
330:   const recRejRows = await tx<{ content_type: string; content_ref: string }[]>`
331:     SELECT content_type::text AS content_type, content_ref FROM compliance_record
332:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
333:   `;
334:   if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
335:   if (recRejRows[0]!.content_type !== expectedRejContentType || recRejRows[0]!.content_ref !== args.contentRef) {
336:     throw new ComplianceTransitionError(
337:       `Record vs args content mismatch: record=${recRejRows[0]!.content_type}/${recRejRows[0]!.content_ref}, args=${expectedRejContentType}/${args.contentRef}`,
338:     );
339:   }
340: 
341:   const now = new Date();
342:   await tx`
343:     UPDATE review_queue_entry
344:        SET status = 'resolved'::review_queue_status,
345:            resolved_at = ${now.toISOString()}::timestamptz,
346:            resolved_by = ${ctx.userId}::uuid,
347:            resolution_type = 'rejected',
348:            metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
349:            updated_at = now()
350:      WHERE id = ${rejEntry.id}::uuid
351:   `;
352:   await tx.unsafe(`
353:     UPDATE ${args.contentTable}
354:        SET status = 'rejected'::content_publication_status,
355:            updated_at = now()
356:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
357:   `);
358: }
359: 
360: export type PublishContentArgs = {
361:   contentType: SubmitContentType;
362:   contentRef: string;
363:   recordId: string;
364:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
365: };
366: 
367: export type PublishContentResult = { recordVersion: number };
368: 
369: /**
370:  * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
371:  *   entity.status → published + published_at 채움.
372:  *   publishable evaluator 통과 검증.
373:  */
374: export async function publishContent(
375:   tx: ScopedTx,
376:   ctx: TenantContext,
377:   args: PublishContentArgs,
378: ): Promise<PublishContentResult> {
379:   assertReviewerEligibility(ctx, "operator");
380:   await acquireRecordLock(tx, args.recordId);
381: 
382:   // record FOR UPDATE
383:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`
384:     SELECT id, content_type::text AS content_type, content_ref,
385:            page_risk_level::text AS page_risk_level,
386:            record_phase::text AS record_phase, record_version,
387:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
388:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
389:            auto_check_result
390:       FROM compliance_record
391:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
392:      FOR UPDATE
393:   `;
394:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
395:   const record = recordRows[0]!;
396:   if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
397:   // CAMC4-01 정정: record vs args 정합 검증
398:   if (record.content_type !== args.contentType || record.content_ref !== args.contentRef) {
399:     throw new ComplianceTransitionError(
400:       `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${args.contentType}/${args.contentRef}`,
401:     );
402:   }
403: 
404:   const publishable = evaluatePublishable(record, args.contentType);
405:   if (!publishable.publishable) {
406:     throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
407:   }
408: 
409:   // CAMC-06 정정: entity 현 status='publishable' assert
410:   const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
411:     SELECT status::text AS status FROM ${args.contentTable}
412:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1

## blocking

## major
- **CAP5-01** — § 17.b의 4 action 작업 설명이 M0_PLAN § 6.1 action 책임과 충돌한다.
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1546`
  - cycle 4 patch 직접 인용: "`submitForReviewAction` · `approveContentAction` · `rejectContentAction` · `publishContentAction` 4 action 안 `check()` 호출 + `calculateFinalRoles` 호출 + envelope persist 흐름 안 try/catch 추가"
  - 문제: M0_PLAN § 6.1 기준 `check()` + envelope persist는 `submitForReview` 책임이다. `approveContent`는 승인 상태 갱신과 AND 게이트 평가 중 `calculateFinalRoles` 경로가 있고, `rejectContent`는 전이/검증 경로이며, `publishContent`는 `evaluatePublishable` 기반 발행 검증 경로다. 따라서 "4 action 안 check() 호출 + calculateFinalRoles 호출 + envelope persist"라고 쓰면 approve/reject/publish에도 재검수·재영속을 넣는 것으로 오해된다.
  - patch 권장: § 17.b를 "4 action 공통 try/catch boundary 적용"으로 유지하되 산출물 책임을 분리한다. 예: `submitForReviewAction`은 `check()`/`buildLegalDocumentExemptEnvelope()` + envelope persist + auto-gate 흐름을 wrap, `approveContentAction`은 `calculateFinalRoles`/`evaluatePublishable` 흐름을 wrap, `rejectContentAction`은 transition validation을 wrap, `publishContentAction`은 `evaluatePublishable`/publish transition을 wrap. `mapComplianceErrorToResult` helper 위치는 `server-actions.ts` 내부 private helper 또는 `compliance/action-errors.ts` 중 하나로 명시.

## minor

## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: PASS
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: PASS

=== CYCLE SIGNAL ===
cycle: 5
total_findings: 1
blocking: 0
major: 1
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
54,293
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1

## blocking

## major
- **CAP5-01** — § 17.b의 4 action 작업 설명이 M0_PLAN § 6.1 action 책임과 충돌한다.
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1546`
  - cycle 4 patch 직접 인용: "`submitForReviewAction` · `approveContentAction` · `rejectContentAction` · `publishContentAction` 4 action 안 `check()` 호출 + `calculateFinalRoles` 호출 + envelope persist 흐름 안 try/catch 추가"
  - 문제: M0_PLAN § 6.1 기준 `check()` + envelope persist는 `submitForReview` 책임이다. `approveContent`는 승인 상태 갱신과 AND 게이트 평가 중 `calculateFinalRoles` 경로가 있고, `rejectContent`는 전이/검증 경로이며, `publishContent`는 `evaluatePublishable` 기반 발행 검증 경로다. 따라서 "4 action 안 check() 호출 + calculateFinalRoles 호출 + envelope persist"라고 쓰면 approve/reject/publish에도 재검수·재영속을 넣는 것으로 오해된다.
  - patch 권장: § 17.b를 "4 action 공통 try/catch boundary 적용"으로 유지하되 산출물 책임을 분리한다. 예: `submitForReviewAction`은 `check()`/`buildLegalDocumentExemptEnvelope()` + envelope persist + auto-gate 흐름을 wrap, `approveContentAction`은 `calculateFinalRoles`/`evaluatePublishable` 흐름을 wrap, `rejectContentAction`은 transition validation을 wrap, `publishContentAction`은 `evaluatePublishable`/publish transition을 wrap. `mapComplianceErrorToResult` helper 위치는 `server-actions.ts` 내부 private helper 또는 `compliance/action-errors.ts` 중 하나로 명시.

## minor

## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: PASS
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: PASS

=== CYCLE SIGNAL ===
cycle: 5
total_findings: 1
blocking: 0
major: 1
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
