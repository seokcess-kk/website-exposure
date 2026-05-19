OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e44-905c-7150-887b-b44cb754a478
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.4 — **cycle 4**. cycle 1 (36) + cycle 2 (11) + cycle 3 (3) = 누계 50 finding 전건 수용. 수렴 추세 36 → 11 → 3. closeable 100% 유지.

## cycle 3 결정·patch 요약

- **CAP-04 cycle 3 정정**: § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" · § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트.
- **CAP2-05 cycle 3 통일**: § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일.
- **CAP3-01 신설**: § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책.

## 본 cycle 검증 우선순위

cycle 3 patch 정합성 + 잔존 결함 / 신규 결함. 누계 지적 수 추가 감소 권장 (cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = ?). normal pattern: cycle 4 = 0~2 finding · acceptance 도달 가능.

### cycle 3 patch 재검증
1. **CAP-04 cycle 3 정정**: § 2.4 헤더 안 "27 SoT 슬롯" 통일 · 합계 "생성 16 + 흡수 9 + runtime-meta 1 + defer 1 = 27" 정합. 표 본문 line 184~213 안 실제 row 카운트 (unique 26 + § 3.9 중복 1 = 27 row) 정합. acceptance precondition 안 "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰" 통일
2. **CAP2-05 cycle 3 통일**: § 1.2 (line 71) · § 1.3 (line 73 헤더) · § 17 step 19 · § 18 CA-CASCADE-09 안 모든 CA-DEFER marker 표기 "17·18·19·20·21·22·29·30·31·32·33·34 12종" 일관. 다른 곳에 "17~22 신설" · "17·18·19·20·21·22·29·30 신설" 등 잔존 표현 없는지 검증
3. **CAP3-01 신설**: § 7.1.1 extractFindingRoles helper 명세 (flatten · stable dedupe · non-array guard) · § 7.1.2 calculateFinalRoles throw boundary (check() bubble · 호출자 try/catch form-level error 변환) 정합

### 새로운 검증 영역

- **§ 2.4 표 본문 vs 헤더 합계 정합** (CAP-04 cycle 3 잔존 가능성):
  - 표 안 실제 row 28개 (unique 27 + duplicate 1) 검증
  - 처리 분류 합계 (생성·흡수·미등록·defer) 모두 27 정합
  - § 3.8 "단독 어휘" 별도 row 가 표 안 명시되어 있는지 (cycle 3 patch 안 16개 생성 안 단독 어휘 슬롯 1 포함)
- **§ 7.1.1 helper 위치**:
  - extractFindingRoles 위치 (check.ts 안 helper vs 별도 final-roles-helpers.ts)
  - check.ts 안 import 표기 정합
- **§ 7.1.2 boundary 정책 영향**:
  - server-actions.ts 안 try/catch 패턴 (submitForReview · approveContent · rejectContent · publishContent 4 action 모두 동일 boundary 인지)
  - 작업 단위 step 17 안 server-actions.ts patch 안 try/catch boundary 추가 명시 (cycle 3 patch 안 추가됐는지 검증)

### Codex 비평 운영 원칙
- cycle 4 안 누계 지적 수 cycle 3 (3) 대비 추가 감소 또는 0 권장
- 0 finding 도달 시 acceptance 권장 가능
- closeable 100% 유지
- cycle 1·2·3 patch 적용 안 된 finding 직접 인용 (plan § XX · file:line)
- 새로운 결함 ID prefix = **CAP4** (cycle 4 신규)

## SoT (cycle 1·2·3 동일)

본 monorepo working root 에서 직접 파일을 읽어 plan 과 대조.

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = N

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
cycle: 4
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

한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것.

codex
`seo-geo` 스킬은 검색 최적화 전용이라 이번 문서 리뷰에는 적용하지 않습니다. 지금은 요청하신 SoT 파일을 직접 읽고, cycle 3 패치 영역부터 라인 기준으로 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "27 SoT|22 슬롯|CA-DEFER|17~22|17·18·19·20·21·22|extractFindingRoles|calculateFinalRoles|server-actions|submitForReview|approveContent|rejectContent|publishContent|acceptance precondition|27 SoT 슬롯|25 활성" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "단독 어휘|inlineRiskFlags|RiskInference|evaluatedSteps|contributingSteps|contextExceptions|triggeredBy|CA-CASCADE" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 644ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
12:  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
19:- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
22:- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
23:- 실 코드 — `apps/web/src/lib/compliance/{check,types,risk,server-actions,final-roles}.ts` · `apps/web/src/lib/eat-content-schema.ts` (CAP-31 정정) · `apps/web/src/components/forms/FaqForm.tsx` (이미 status field 제거됨 — CAP-08 정정)
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
38:- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
39:- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
51:| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
52:| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
61:| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
62:| FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 · CAP-08 정정) | **FaqForm zod schema 변경 없음** (이미 status field 제거됨 — CWI-01). FAQ 자동 검수 적용 위치 = submitForReview action 안 `contentType='FAQ'` 입력 흐름. body = Q + A 결합 + `qa` block scope (CAP-24). risk_level 자동 추론 = P-011 기본 Low + Q/A 본문 안 의료 어휘 → Medium/High 격상 가능. **EC-DEFER-12 부분 해소** (CAP-34 정정) = FAQ status='published' 발행만 정상화. Publication·MediaAppearance status='draft' 만 잔존 (외부 인용 entity 면제 — Phase Beta 별도 unlock 결정) |
66:| **`calculateFinalRoles` 단일 경로 강제** (CAP-14 정정) | `apps/web/src/lib/compliance/final-roles.ts` 이미 존재 — Phase Alpha 안 별도 합집합 계산 안 함. High 가상 finding 의 `requiredApproverRoles` 만 입력으로 추가하여 기존 `calculateFinalRoles` 단일 호출. M0 patterns (operator + Medium/High medical + LegalDocument legal + finding roles 합집합) 그대로 유지 |
67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
69:| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
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
106:5. **catalog 로드 실패 시 fail closed** (MA-Q10 결정 — § 12 미결정 안에서 본 cycle 결정) — `loadCatalog()` throw 시 `check()` 도 throw → `submitForReview` action 실패 → 운영자 콘솔 에러 표시. **운영 risk**: 카탈로그 손상 시 전체 발행 마비 가능성 — Phase Beta 안 명시 fallback 모드 (last-known-good catalog) 검토.
122:├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
166:    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
182:- **27 SoT 슬롯 처리 합계**: 생성 16 (직접 매칭 룰 신설 · 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) = 27. § 3.9 `false-credential-001` 중복 행은 § 3.3 흡수 처리 안 1회만 카운트 (CAP-04 cycle 3 정정 — 표 안 "비-count row" 표시)
183:- **acceptance precondition 통일** (CAP-04 cycle 3 정정): "**27 SoT 슬롯 처리 완비 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 25 활성 canonical 룰**" — "22 슬롯" 표현 폐기. "18 canonical" 표현도 폐기 (v0.1)
216:**SoT 27 슬롯 처리 합계 (cycle 3 통일)**: 생성 16 (직접 매칭 룰 신설 · § 3.8 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체 · § 3.2 treatment-effect-assertion + § 3.6 graphic-procedure + § 3.8 exaggeration · effect-claim · guarantee + § 3.9 false-credential 중복 행 · false-title + § 3.14 false-award · false-endorsement) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = **27 처리 슬롯**. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
304:    # Phase Beta CA-DEFER-32 (numeric predicate) 안 1~6 만 매칭 정확화
310:    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
396:    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
403:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
424:    # Phase Beta CA-DEFER-33 (evidence absence) 안 기간/대상/대상 명시 부재 검사 강화 - 명시된 정상 케이스 silent pass
431:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
452:> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).
556:slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
605:│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
634:- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
635:- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
636:- `feature` scope 룰 → skip + warnings.push (CA-DEFER-16)
638:- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
720:- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
721:- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
722:- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
740:Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).
800:- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
837:**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
848:**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).
858:import { calculateFinalRoles } from './final-roles';   // CAP-14 - 기존 helper 단일 경로
933:  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 + CAP3-01 boundary)
935:  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
936:  //   CAP3-01 - calculateFinalRoles 안 unknown role throw 가능 → check() 자체는 throw bubble (호출자 책임)
937:  const findingRoles = extractFindingRoles(allFindings);   // CAP3-01 - § 7.1.1 helper 정의
940:  // calculateFinalRoles throw 시 - check() 안 bubble (try/catch 없음). 호출자 (submitForReview 등)
942:  const runtimeRoles = calculateFinalRoles(
948:  // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)
988:### 7.1.1 `extractFindingRoles` helper (CAP3-01 신설)
992:export function extractFindingRoles(findings: Finding[]): string[] {
1010:- 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)
1012:### 7.1.2 `calculateFinalRoles` throw boundary (CAP3-01 신설)
1014:- **check() 안** — `calculateFinalRoles` throw bubble. try/catch 없음 (check() 자체는 fail closed)
1015:- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
1098:### 9.2 Phase Beta 합류 시 (CA-DEFER-18)
1212:### 11.2 requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)
1214:`calculateFinalRoles` (apps/web/src/lib/compliance/final-roles.ts) 사용. M0 patterns:
1271:- **`submitForReview` action 안 만 통합** (Phase Alpha)
1273:- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker
1303:- `submitForReview` action 안 `contentType='FAQ'` 입력 흐름 안 자동 check() 호출
1322:## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소 · CAP-18·19 정정)
1535:| 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
1537:| 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
1542:| 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
1544:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
1552:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1558:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)
1566:| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
1573:| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
1583:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1584:| 2026-05-19 | **v0.4** | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰". |
1585:| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1586:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 649ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
11:  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
13:  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
14:  - § 6 RiskInference 통합
16:- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6 YAML + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
38:- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
39:- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
42:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
44:### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
50:| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
53:| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
54:| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
55:| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
60:| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
68:| **`unreviewed-ad-001` 카탈로그 등록** (CAP-16 정정) | check() 별도 흐름 (M0 plan v0.1 안) 유지하되 **§ 2.3 룰 표 안 명시** — "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" marker. `triggeredBy='static-rule'` 유지 (CONTENT_STANDARDS § 7.2 enum cascade 회피) |
70:| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
71:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |
92:| **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도 | Phase Beta (kss-js · @kss/kss-js · 자체 포팅 중 결정. v0.1 안 fallback 정규식 `[.!?](\s+\|$)` 한국어 종결 어미 분리 부정확) | CA-DEFER-22 (신설) |
113:### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)
145:  contextExceptions:
169:> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).
180:- MEDICAL_AD § 3.0~3.14 안 **SoT 예시 ID 총 27 슬롯** (3.1 1 · 3.2 3 · 3.3 2 · 3.4 1 · 3.5 1 · 3.6 2 · 3.7 1 · 3.8 6 [단독 어휘 별도 슬롯 포함] · 3.9 2 · 3.10 1 · 3.11 1 · 3.12 2 · 3.13 2 · 3.14 3 · 3.15 0 시행령 미존재). § 3.3 · § 3.9 안 `false-credential-001` 중복 행 1건 (unique 슬롯 26 + § 3.9 중복 행 1 = 27 표 row · acceptance count 는 § 3.3 row 안 흡수 처리 안 1회만 카운트하여 27 처리 슬롯)
182:- **27 SoT 슬롯 처리 합계**: 생성 16 (직접 매칭 룰 신설 · 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) = 27. § 3.9 `false-credential-001` 중복 행은 § 3.3 흡수 처리 안 1회만 카운트 (CAP-04 cycle 3 정정 — 표 안 "비-count row" 표시)
203:| § 3.8 | (단독 어휘) | **생성** | `professional-assertion-standalone-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
216:**SoT 27 슬롯 처리 합계 (cycle 3 통일)**: 생성 16 (직접 매칭 룰 신설 · § 3.8 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체 · § 3.2 treatment-effect-assertion + § 3.6 graphic-procedure + § 3.8 exaggeration · effect-claim · guarantee + § 3.9 false-credential 중복 행 · false-title + § 3.14 false-award · false-endorsement) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = **27 처리 슬롯**. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
233:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
469:      categories: ["전문성 단정 (단독 어휘)"]   # CAP-17 정정 - 단독 어휘 카테고리 한정
481:      categories: ["전문성 단정 (단독 어휘)"]
493:      categories: ["전문성 단정 (단독 어휘)"]
505:      categories: ["전문성 단정 (단독 어휘)"]
517:      categories: ["전문성 단정 (단독 어휘)", "보장 표현"]
526:> **CAP-17 정정**: contextExceptions 적용 시 — finding 안 카테고리가 `appliesTo.categories[]` 와 일치 + finding span 과 exception pattern span 이 같은 문장 (KSS fallback 시 정규식 한계) 안 overlap 또는 인접해야 함. `fail` composite 룰 (예: `guarantee-composite-001`) 은 안전 보장 위해 예외 미적용.
564:> Phase Alpha 안 P-006 slot 격상 미합류 — TreatmentPage 실 schema (C0004) 안 `results` · `pricing` 필드 부재. body_markdown 단일 필드 안에서 키워드 매칭 필요 — `body-regex` matchCondition kind 신설 후 Phase Beta 합류. v0.1 안 RiskInference 안 slotMatches 입력 항상 `[]` (빈 배열).
606:│   ├── exceptions.ts      # contextExceptions 적용 (CAP-17)
608:│   ├── risk-inference.ts  # MAX 결합 + evaluatedSteps + contributingSteps (CAP-12)
620:  contextExceptions: ContextException[];
686:  contextExceptions: ContextException[],
709:  4. ApproverRole · legalBasis · triggeredBy="static-rule" 메타 채움
711:  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
770:  triggeredBy: "static-rule" | "inferred" | "explicit" | "llm-assist";
778:## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01 · CAP-17 정정)
845:- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
846:- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)
848:**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).
877:  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
884:  // 6. inlineRiskFlags 추출 (§ 8)
896:  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
900:    inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
968:      inlineRiskFlagsEvidence: inlineFlagResult.evidence,
969:      riskInferenceEvaluatedSteps: inference.evaluatedSteps,   // CAP-12 - 모든 source evaluation
970:      riskInferenceContributingSteps: inference.contributingSteps,   // base 갱신 source
1036:    triggeredBy: 'static-rule',   // CONTENT_STANDARDS § 7.2 enum cascade 회피 (CAP-16)
1044:## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01 · CAP-05·20·21·22 정정)
1050:| `includes-effect-claim` | matchResult.findings 안 **SoT 7 카테고리 문자열 정확 매칭** (CAP-05): `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"` 중 1개 이상. `"최상급"`·`"보장 결합 강조"` 등은 **미포함** (CAP-05) |
1083:> CONTENT_STANDARDS § 7.1 cascade — metadata 안 7 신규 필드 (모두 optional). CA-CASCADE-06.
1106:## 10. RiskInference 자동 추론 (CA-INFER-01 · CAP-12·13 정정)
1108:### 10.1 알고리즘 — evaluatedSteps + contributingSteps 분리 (CAP-12)
1111:type RiskInferenceResult = {
1113:  evaluatedSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;     // 모든 source evaluation (CAP-12)
1114:  contributingSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;  // base 갱신 source만
1117:export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
1118:  const evaluatedSteps = [];
1119:  const contributingSteps = [];
1122:  evaluatedSteps.push(baseStep);
1123:  contributingSteps.push(baseStep);
1128:    evaluatedSteps.push(step);
1131:      contributingSteps.push(step);
1135:  for (const flag of input.inlineRiskFlags) {
1138:    evaluatedSteps.push(step);
1141:      contributingSteps.push(step);
1147:    evaluatedSteps.push(step);
1150:      contributingSteps.push(step);
1157:    evaluatedSteps.push(step);
1160:      contributingSteps.push(step);
1164:  return { inferredRiskLevel: final, evaluatedSteps, contributingSteps };
1183:function buildHighGateFinding(input: ComplianceCheckInput, inference: RiskInferenceResult): Finding {
1184:  const triggeredBy = determineTriggeredBy(input);   // CAP-13 - input 만 검사
1193:    triggeredBy,
1346:      "triggeredBy": "static-rule",
1355:    "inlineRiskFlagsEvidence": { /* ... */ },
1383:  inlineRiskFlagsEvidence: Record<InlineRiskFlag, Array<{ location, matchedText }>>;
1409:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01
1419:-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01 · CAP-10 acceptance blocker
1452:| 4 | "절대 효과" → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' |
1464:### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)
1473:### 16.4 inlineRiskFlags (5건 · CAP-05 정정)
1477:| 23 | "최고의" 매칭 → category "최상급" → SoT 7 카테고리 안 미포함 → includes-effect-claim 미활성 (CAP-05) | inlineRiskFlags=[] |
1483:### 16.5 RiskInference (7건 · CAP-11·12 정정)
1487:| 28 | P-010 + articleType=notice → Low | inferredRiskLevel='Low' · contributingSteps 1건 |
1488:| 29 | P-010 + articleType=effect-result-related → High | inferredRiskLevel='High' · contributingSteps 2건 · evaluatedSteps 2건 |
1489:| 30 | P-002 + inlineRiskFlags=[includes-pricing] → High | flag MAX 결합 |
1490:| 31 | P-002 + explicitRiskLevel='High' → High (explicit override) | contributingSteps 안 explicitRiskLevel source |
1491:| 32 | P-002 + 모든 입력 Low → Low | contributingSteps 1건 (pageType) |
1493:| 34 (CAP-12) | P-010 + articleType=notice + inlineRiskFlags=[includes-event] + explicit=Low → inlineFlag High 격상 + explicit Low 영향 없음 | evaluatedSteps 4건 · contributingSteps 2건 (pageType + inlineRiskFlag) |
1508:| 39 (CAP-35) | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 + includes-effect-claim flag + RiskInference High 가상 finding | findings 안 ruleId 안 'guarantee-composite-001' 포함 · 'risk-level-high-gate' 포함 · automatedDecision='block' · findings.length ≥ 2 (정확 count 안 고정 - "contains ruleIds" 검증) |
1531:| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
1532:| 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
1533:| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
1544:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
1548:## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)
1550:- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
1551:- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
1552:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1553:- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
1554:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
1555:- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
1556:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 17 SoT 예시 ID → canonical 매핑 (CAP-04)
1557:- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
1558:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)
1568:| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
1572:| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
1583:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1584:| 2026-05-19 | **v0.4** | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰". |
1585:| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1586:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 687ms:
# compliance-assistant Phase Alpha plan (draft·v0.4·2026-05-19)

> **상태**: **v0.4 cycle 3 patch** — Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용 patch. closeable_after_patch_ratio 100% · ready_for_acceptance=false (scope_narrow_acceptable=true). cycle 4 진입 대기 — 0 finding 도달 가능. 누계 cycle 1+2+3 = 50 finding 전건 수용. 수렴 추세 36 → 11 → 3.

> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec 본 plan 의 구현 대상.
  - § 3 check() 단일 엔트리포인트
  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
  - § 6 RiskInference 통합
  - § 7 룰 카탈로그 로드 순서·머지
- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6 YAML + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 + medical-law-tracking SoT revision (CAP-27 정정)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 (rules.core.yaml 표현 SoT — CAP-28 정정) · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05 해소 (FAQ workflow path 한정) · EC-DEFER-12 부분 해소 (FAQ 만 — Publication/MediaAppearance 잔여)
- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 3.3 priority·SLA 표 (CAP-33 정정) · § 6.2 stale 처리는 Phase Beta · § 9.1.1 알림 정책
- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
- 실 코드 — `apps/web/src/lib/compliance/{check,types,risk,server-actions,final-roles}.ts` · `apps/web/src/lib/eat-content-schema.ts` (CAP-31 정정) · `apps/web/src/components/forms/FaqForm.tsx` (이미 status field 제거됨 — CAP-08 정정)
- `packages/core-content/migrations/C0015_review_queue_entry.sql` (실 UNIQUE constraint 확인 — CAP-10 정정)
- `packages/core-content/migrations/C0016_status_unlock.sql` (FAQ DB CHECK 이미 해제 + sentinel backfill guard — CAP-32 정정)
- `packages/core-content/migrations/C0004_treatment_page.sql` (실 schema body_markdown 단일 필드 — CAP-09 정정)

> **표기 규칙 (M0_PLAN 계승)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선.

---

## 1. 목적과 범위

### 1.1 목적 (CAP-07 정정)

- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 SoT 예시 ID → canonical 매핑** (CAP-04 정정): § 3.1~3.14 각 호의 SoT 예시 ID 17종 → § 2.3 안 "생성 / canonical 흡수 / 의도적 제외" 표 매핑. 흡수 시 대체 ruleId + legalBasis 명시.
- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.

### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)

| 항목 | 비고 |
|---|---|
| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
| RuleCatalog 로더 + JSON Schema 검증 (CA-LOADER-01) | `packages/compliance-rules/` 신규 패키지. Ajv (JSON Schema Draft-07) 검증. fail 시 throw. **field/block/feature scope 안 v0.1 미지원 룰은 loader skip+warning** (CAP-23 정정 — fail 보다 skip 권장) |
| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2) |
| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑. 유도 불가 시 throw `ComplianceConfigError` |
| **`metadata.inferredRiskLevel` 외부 입력 처리** (CAP-11 정정) | compliance-assistant § 3.3 정합 — **항상 내부 재계산** + **외부 입력과 MAX 결합**. 불일치 시 `auto_check_result.extensions.inferredRiskLevelMismatch` 안 외부값/내부값/최종값 audit 보존 (운영자 모니터링). 외부 입력 신뢰 skip 모드는 본 cycle 미합류 (성능 최적화 Phase Beta) |
| `meta.yaml` catalogVersion + **catalogHash (데이터 파일 hash 한정)** (CAP-26 정정 · CA-VERSION-01) | `catalogVersion` = meta.yaml `catalogVersion` 필드. `catalogHash` = **6 YAML 파일 (rules.core·rules.medical-ad·context-exceptions·medical-law-tracking·slot-matches·meta) 의 정렬 후 SHA-256 concat hash**. **schema.json 미포함** (CAP-02 정정 — schema 변경은 별도 `schemaHash` metadata). **`kssAvailable` 미포함** (CAP-26 정정 — runtime capability 이므로 `engineVersion` 별도 metadata) |
| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
| FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 · CAP-08 정정) | **FaqForm zod schema 변경 없음** (이미 status field 제거됨 — CWI-01). FAQ 자동 검수 적용 위치 = submitForReview action 안 `contentType='FAQ'` 입력 흐름. body = Q + A 결합 + `qa` block scope (CAP-24). risk_level 자동 추론 = P-011 기본 Low + Q/A 본문 안 의료 어휘 → Medium/High 격상 가능. **EC-DEFER-12 부분 해소** (CAP-34 정정) = FAQ status='published' 발행만 정상화. Publication·MediaAppearance status='draft' 만 잔존 (외부 인용 entity 면제 — Phase Beta 별도 unlock 결정) |
| Drizzle schema v0.6 (CA-SCHEMA-01 · CAP-10 정정) | `reviewQueueType` enum 안 `'content-gate'` ADD VALUE + **partial UNIQUE 재정의** — 실 C0015 constraint `review_queue_entry_open_unique (instance_id, content_type, content_ref)` → `(instance_id, content_type, content_ref, queue_type)` partial UNIQUE (record version별 중복 허용 안 함 — 단일 active record_version 기준) |
| C0017 migration (CA-MIGRATION-01) | `ALTER TYPE review_queue_type ADD VALUE 'content-gate'` (single statement · COMMIT 분리) + partial UNIQUE DROP + CREATE (manifest 안 별 step 분리 — Postgres ALTER TYPE 트랜잭션 제약) |
| compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `auto-gate.ts` (content-gate 자동 큐 enqueue). 매칭 엔진·composite·inline-flags·risk-inference·slot-match·loader 는 `packages/compliance-rules/` 패키지 안 |
| **`calculateFinalRoles` 단일 경로 강제** (CAP-14 정정) | `apps/web/src/lib/compliance/final-roles.ts` 이미 존재 — Phase Alpha 안 별도 합집합 계산 안 함. High 가상 finding 의 `requiredApproverRoles` 만 입력으로 추가하여 기존 `calculateFinalRoles` 단일 호출. M0 patterns (operator + Medium/High medical + LegalDocument legal + finding roles 합집합) 그대로 유지 |
| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
| **`unreviewed-ad-001` 카탈로그 등록** (CAP-16 정정) | check() 별도 흐름 (M0 plan v0.1 안) 유지하되 **§ 2.3 룰 표 안 명시** — "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" marker. `triggeredBy='static-rule'` 유지 (CONTENT_STANDARDS § 7.2 enum cascade 회피) |
| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |

### 1.3 비범위 (defer) — CAP-25 정정 + CAP2-05 cycle 3 통일 (CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 명시)

| 항목 | Defer to | marker |
|---|---|---|
| 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
| LLM 보조 | Phase Beta | CA-DEFER-03 |
| warning 큐 + warningAcknowledgements | Phase Beta | CA-DEFER-05 |
| stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 | Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 | Phase Beta | CA-DEFER-07 |
| priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 | M2 | CA-DEFER-08 |
| client 검수자 (clientApprover 슬롯) | Phase Beta | CA-DEFER-10 |
| MediaThresholdAssessment | analytics-reporting 본 구현 | CA-DEFER-09 |
| attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
| Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
| preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta (preset 부재 시 silent skip 정책 — § 11) | CA-DEFER-17 (신설) |
| **P-006 (및 다른 PAGE_TYPES § 3) 슬롯 격상 표** — slot-matches.yaml 실 데이터 | Phase Beta (slot 격상은 `entityFields` + `body-regex` matchCondition 합류 필요 · TreatmentPage 실 schema 안 single body_markdown 필드만 존재이므로 entity-level slot 평가 미지원) | CA-DEFER-18 (신설) |
| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 — sourceUrl · checkedBy · 영향 룰 ID · stale 트리거 | 본 cycle 안 **MEDICAL_AD_COMPLIANCE_COMMON § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27 정정). 추가 revision Phase Beta | CA-DEFER-19 (신설) |
| **`field` scope (fieldPath 단위 매칭)** — RiskRule.scope `type="field"` 의 fieldPath 단위 매칭 (현재 v0.1 안 body 전체 매칭 안 함 — skip+warning) | Phase Beta | CA-DEFER-20 (신설) |
| **`block` scope 5종 (list/table/callout/citation/media)** — `qa` 외 block scope | Phase Beta | CA-DEFER-21 (신설) |
| **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도 | Phase Beta (kss-js · @kss/kss-js · 자체 포팅 중 결정. v0.1 안 fallback 정규식 `[.!?](\s+\|$)` 한국어 종결 어미 분리 부정확) | CA-DEFER-22 (신설) |
| **`NOT_IN_PARAGRAPH` logic (negative operand)** — `side-effect-missing-001` (§ 3.7) 본 logic 필요 | Phase Beta (CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade — `side-effect-missing-001` 룰 자체도 Phase Beta 합류) | CA-DEFER-30 (CAP-30 정정 · 신설) |
| **`citationAbsence` evaluation contract** — `false-statement-001` (§ 3.3) 본 contract 필요 | Phase Beta (v0.1 안 단순 regex 매칭만 — citation block 검사 부재 한계 명시) | CA-DEFER-29 (CAP-29 정정 · 신설) |
| **pageMeta composite** — `foreign-patient-recruit-domestic-uncertain-001` (§ 3.12 불명확) 안 inLanguage/국내매체 evidence (v0.1 안 단순 regex) | Phase Beta | CA-DEFER-31 (cycle 2 CAP2-03 신설) |
| **numeric predicate** — `short-clinical-experience-001` (§ 3.2 6개월 이하) 안 6 이하 정확 매칭 (v0.1 안 1~99 모두 fail 보수 정책) | Phase Beta | CA-DEFER-32 (cycle 2 CAP2-04 신설) |
| **evidence absence** — `non-covered-discount-misleading-001` (§ 3.13) 안 기간/대상 명시 부재 검사 (v0.1 안 모든 % 할인 content-gate 보수 정책) | Phase Beta | CA-DEFER-33 (cycle 2 CAP2-04 신설) |
| **RiskRule.scope `excludeScopes[]` 필드** — NOT/except 표현 schema 지원 (v0.1 안 matcher allowlist pre-check · `event-fact-statement-001` 한정) | Phase Beta | CA-DEFER-34 (cycle 2 CAP2-02 신설) |

### 1.4 본 cycle 의 운영 가설 (CAP-32 정정)

1. **M0 stub → Phase Alpha 교체 시 기존 published 콘텐츠 영향 없음** — sentinel ComplianceRecord 안 `auto_check_result` 는 SoT 7 필드만이므로 풀명세 영역이 추가되어도 기존 row 영향 없음 (JSONB extensions key 추가 만).
2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
3. **FAQ sentinel guard** — FAQ 발행은 EC-DEFER-12 안 v0.1 차단되어 있었으므로 **기존 published FAQ 는 원칙적으로 0건**. 단, C0016 backfill 안 published FAQ 발견 시 sentinel ComplianceRecord 자동 생성하므로 (line 134~159) 예외 흐름은 안전.
4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).
5. **catalog 로드 실패 시 fail closed** (MA-Q10 결정 — § 12 미결정 안에서 본 cycle 결정) — `loadCatalog()` throw 시 `check()` 도 throw → `submitForReview` action 실패 → 운영자 콘솔 에러 표시. **운영 risk**: 카탈로그 손상 시 전체 발행 마비 가능성 — Phase Beta 안 명시 fallback 모드 (last-known-good catalog) 검토.
6. **외부 inferredRiskLevel 입력 MAX 결합** (CAP-11 정정) — compliance-assistant § 3.3 SoT 정합. 외부 입력 + 내부 재계산 결과 불일치 시 audit metadata 안 보존 (운영자가 외부 호출자 신뢰성 모니터링).

---

## 2. RuleCatalog 데이터 결정

### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)

```
data/compliance-rules/
├── meta.yaml                       # catalogVersion · loadOrder · medicalLawRevisionRef · files[]
├── rules.core.yaml                  # CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (CAP-28 정정)
├── rules.medical-ad.yaml             # MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 → legalBasis overlay (CAP-28 정정)
├── context-exceptions.yaml           # CONTENT_STANDARDS § 4.4 안전·주의·행정 문맥 예외
├── medical-law-tracking.yaml         # MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed (CAP-27 정정)
├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
└── schema.json                       # JSON Schema (catalogHash 미포함 · schemaHash 별도 — CAP-02·CAP-26 정정)
```

위치 결정: **monorepo 루트 `data/compliance-rules/`** (특정 패키지 안 아님).

**catalogHash 정책** (CAP-02·CAP-26 정정):
- `catalogHash` = 6 YAML 파일 정렬 후 SHA-256 concat hash (데이터 한정)
- `schemaHash` = schema.json 단일 파일 SHA-256 hash (별도 metadata)
- `engineVersion` = `packages/compliance-rules/package.json` 의 version (별도 metadata)
- `kssAvailable` = runtime capability — metadata 안 (catalogHash 미포함)
- schema.json 변경 시 → `schemaHash` 변경, `catalogHash` 변경 안 됨 (룰 데이터 동일 시 영속 결과 동일)
- 검증 실패 시 throw → fail closed (§ 1.4 5번)

### 2.2 `meta.yaml` 구조 (CA-META-01)

```yaml
catalogVersion: "1.0.0"
medicalLawRevisionRef: "2026-04-07-reaffirmation"   # CAP-27 정정 — MEDICAL_AD § 11.2 SoT seed
loadOrder:
  rules:
    - rules.core.yaml
    - rules.medical-ad.yaml
  contextExceptions:
    - context-exceptions.yaml
  tracking:
    - medical-law-tracking.yaml
  slotMatches:                              # CA-SLOT-01 (CAP-09 정정 — v0.0 placeholder)
    - slot-matches.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "MEDICAL_AD § 3.1~3.14 legalBasis overlay + 추가 의료법 룰"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — MEDICAL_AD § 11.2 2026-04-07 reaffirmation seed (Phase Beta 추적 시작)"
  slot-matches.yaml:
    version: "0.0.0"
    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
```

> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).

### 2.3 룰 카탈로그 분리 정책 (CAP-28 정정)

- **rules.core.yaml** = CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (모든 의료광고 표현 룰 — 최상급/효과 단정/전문성 단정/보장 등). `sourceDoc: "core/CONTENT_STANDARDS.md#4.1"`. `legalBasis[]` 누락 또는 generic
- **rules.medical-ad.yaml** = MEDICAL_AD § 3.1~3.14 의료법 인용 overlay. `overrides[]` 사용하여 rules.core.yaml 의 canonical 룰에 `legalBasis[]` 정확 매핑 추가. 일부는 신규 룰 (의료법 특화 — 외국인환자·기사형 광고 등)
- 머지 결과 = 단일 RiskRule[] 컬렉션 안 canonical 룰별 `legalBasis[]` 정확 매핑

### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 3 카운트 재통일)

**v0.4 카운트 통일** (CAP-04 잔존 cycle 3):
- MEDICAL_AD § 3.0~3.14 안 **SoT 예시 ID 총 27 슬롯** (3.1 1 · 3.2 3 · 3.3 2 · 3.4 1 · 3.5 1 · 3.6 2 · 3.7 1 · 3.8 6 [단독 어휘 별도 슬롯 포함] · 3.9 2 · 3.10 1 · 3.11 1 · 3.12 2 · 3.13 2 · 3.14 3 · 3.15 0 시행령 미존재). § 3.3 · § 3.9 안 `false-credential-001` 중복 행 1건 (unique 슬롯 26 + § 3.9 중복 행 1 = 27 표 row · acceptance count 는 § 3.3 row 안 흡수 처리 안 1회만 카운트하여 27 처리 슬롯)
- **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건) + rules.medical-ad.yaml 11 신규 룰 (의료법 특화)
- **27 SoT 슬롯 처리 합계**: 생성 16 (직접 매칭 룰 신설 · 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) = 27. § 3.9 `false-credential-001` 중복 행은 § 3.3 흡수 처리 안 1회만 카운트 (CAP-04 cycle 3 정정 — 표 안 "비-count row" 표시)
- **acceptance precondition 통일** (CAP-04 cycle 3 정정): "**27 SoT 슬롯 처리 완비 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 25 활성 canonical 룰**" — "22 슬롯" 표현 폐기. "18 canonical" 표현도 폐기 (v0.1)

| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | 대체 canonical ruleId | legalBasis[] |
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

**SoT 27 슬롯 처리 합계 (cycle 3 통일)**: 생성 16 (직접 매칭 룰 신설 · § 3.8 단독 어휘 슬롯 1 포함) · canonical 흡수 9 (다른 룰로 대체 · § 3.2 treatment-effect-assertion + § 3.6 graphic-procedure + § 3.8 exaggeration · effect-claim · guarantee + § 3.9 false-credential 중복 행 · false-title + § 3.14 false-award · false-endorsement) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = **27 처리 슬롯**. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.

### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)

CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환. **각 RiskRule.category 는 SoT § 4.1 카테고리 칸 그대로 사용** (CAP-05 정정).

| RiskRule.id | category (SoT 정확 매칭) | severity | patternType | scope | sourceDoc |
|---|---|---|---|---|---|
| `supremacy-001` | "최상급" | fail | regex (`(최고의\|최저가\|최대\|최강\|1위\|국내\s*유일\|세계\s*최초\|세계\s*최고)`) | global | core/CONTENT_STANDARDS.md#4.1 |
| `effect-assertion-001` | "효과 단정" | fail | regex (`(완치\|100\s*%\s*효과\|반드시\s*효과\|안전합니다\|부작용\s*없음)`) | global | 동일 |
| `numeric-period-standalone-001` | "수치·기간 단정 (보장어 없음)" | content-gate (`["medical", "legal"]`) | composite (`\d+\s*(일\|주\|개월)` + `(만에\|기간)` AND_NEAR window=15) | global | 동일 |
| `numeric-period-guarantee-001` | "수치·기간 보장" | fail | composite (`\d+\s*(kg\|일\|주)` + `(보장\|약속)` AND_IN_SENTENCE) | global | 동일 |
| `comparison-001` | "비교 표현" | fail | regex (`(타\|다른\|기존)\s*(병원\|의원\|치료법)\s*(보다\|대비)`) | global | 동일 |
| `inducement-pressure-001` | "유인성 표현" | fail | regex (`(지금만\|특가\|한정\|기간\s*한정\|선착순\|오늘까지)`) | global | 동일 |
| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | global (CAP2-02 정정 — scope NOT 표현 불가이므로 matcher 안 **allowlist pre-check**: pageTypeId ∈ {P-102, P-104} 또는 articleType='event-price' 시 룰 매칭 skip · § 4.3·§ 4.4 안 명세) | 동일 |
| `diagnosis-assertion-001` | "진단 단정" | fail | composite (`(당신은\|당신의)` + `(병입니다\|확정\|확실)` AND_IN_SENTENCE) | global | 동일 |
| `authority-assertion-001` | "명의·권위 단정" | fail | regex (`(최고의\s*명의\|국내\s*1인자\|전국\s*최다)`) | global | 동일 |
| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
| `guarantee-composite-001` | "전문성 단정 (효과·결과·보장 결합)" | fail | composite (`(100\s*%\|반드시\|절대\|확실히)` + `(효과\|결과\|호전\|개선\|치유\|보장)` AND_IN_SENTENCE) | global | 동일 |
| `celebrity-001` | "유명인 동원" (CAP-05 잔존 정정 — SoT § 4.1 정확 매칭) | fail | regex (`(연예인\|아이돌\|배우)\s*(이\|가)?\s*받은`) | global | 동일. legalBasis = `["medical-law-art27-para3"]` (환자 유인 — MEDICAL_AD § 3.0 cascade Phase Beta 매핑) |
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

codex
§ 2.4는 실제 행 수와 처리 슬롯 수를 분리해서 세는 지점이 핵심입니다. 지금 표 행을 직접 합산해 보니 cycle 3 패치 설명의 “27 표 row”와 충돌하는 후보가 보여서, 관련 문맥과 작업 단위까지 확인하고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 840 -First 210' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -Skip 1518 -First 45' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "try/catch|ComplianceConfigError|form-level|form level|ActionResult|throw bubble|bubble|catch" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 696ms:
57:| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑. 유도 불가 시 throw `ComplianceConfigError` |
862:  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);
866:  if (!pageTypeId) throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);
870:    throw new ComplianceConfigError(`Article 은 articleType required`);
936:  //   CAP3-01 - calculateFinalRoles 안 unknown role throw 가능 → check() 자체는 throw bubble (호출자 책임)
940:  // calculateFinalRoles throw 시 - check() 안 bubble (try/catch 없음). 호출자 (submitForReview 등)
941:  // 안 form-level error 변환 boundary (CAP3-01 - § 7.1.2 정책).
1010:- 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)
1014:- **check() 안** — `calculateFinalRoles` throw bubble. try/catch 없음 (check() 자체는 fail closed)
1015:- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
1016:- ComplianceConfigError throw 시 envelope 생성 불가 → ComplianceRecord INSERT 안 됨 → 운영자 콘솔 안 "compliance config error" 표시 + 룰 카탈로그 또는 finding payload 점검 안내
1017:- 일반 catch (Error) 는 unhandled → 500 (Next.js error boundary)
1516:| 42 | contentType='LegalDocument' 입력 → check() throw ComplianceConfigError | buildLegalDocumentExemptEnvelope 호출 시 정상 envelope |
1584:| 2026-05-19 | **v0.4** | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰". |

 succeeded in 791ms:

---

## 17. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | `data/compliance-rules/` 6 YAML + schema.json 작성 | meta · rules.core · rules.medical-ad · context-exceptions · medical-law-tracking · slot-matches (v0.0 placeholder) · schema.json |
| 2 | `packages/compliance-rules/` 신규 패키지 초기화 | package.json · tsconfig.json · src/ · build script |
| 3 | loader + JSON Schema 검증 (Ajv) + catalogHash/schemaHash 분리 산정 | loader.ts · hash.ts |
| 4 | RiskRule 매칭 엔진 (regex/keyword/phrase) + scope 일치 (field/block/feature skip+warning) | matcher.ts |
| 5 | composite 평가 + KSS fallback wrapper | composite.ts · kss.ts |
| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
| 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
| 9 | slot-matches evaluator (v0.1 빈 배열 반환) | slot-match.ts |
| 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
| 11 | auto-gate 큐 자동 진입 + block 제외 (CAP-06) + REVIEW_WORKFLOW § 3.3 priority/SLA (CAP-33) | auto-gate.ts + sla.ts |
| 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
| 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
| 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
| 15 | Drizzle schema v0.6 — reviewQueueType enum + unique index | packages/core-content/src/schema.ts |
| 16 | manifest 21단계 (M0 19 + C0017 + C0018) | packages/migrations-runner/src/manifest.ts |
| 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
| 18 | vitest 42 scenarios (cycle 1 정정 시나리오 17a/17b · 33 · 34 · 38 · 39 · 41 추가) | __tests__/ |
| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |

---

## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)

- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 17 SoT 예시 ID → canonical 매핑 (CAP-04)
- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)

---

## 19. § 12 미결정 (Codex 비평 입력)


 succeeded in 800ms:

**Phase Alpha fallback 한계 명시**:
- `[.!?](\s+|$)` 정규식 — 한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확
- composite AND_IN_SENTENCE 정확도 영향 (false-positive/false-negative 가능)
- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)

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

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 + CAP3-01 boundary)
  //   final-roles.ts:14 positional 시그니처 정합
  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
  //   CAP3-01 - calculateFinalRoles 안 unknown role throw 가능 → check() 자체는 throw bubble (호출자 책임)
  const findingRoles = extractFindingRoles(allFindings);   // CAP3-01 - § 7.1.1 helper 정의
  const clientRolePresent = findingRoles.includes('client');
  const findingRolesWithoutClient = findingRoles.filter(r => r !== 'client');
  // calculateFinalRoles throw 시 - check() 안 bubble (try/catch 없음). 호출자 (submitForReview 등)
  // 안 form-level error 변환 boundary (CAP3-01 - § 7.1.2 정책).
  const runtimeRoles = calculateFinalRoles(
    input.contentType,
    finalRiskLevel,
    input.metadata.priorReviewRequired ?? false,
    findingRolesWithoutClient,
  );
  // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)

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

### 7.1.1 `extractFindingRoles` helper (CAP3-01 신설)

```typescript
// apps/web/src/lib/compliance/check.ts 안 helper 또는 별도 final-roles-helpers.ts
export function extractFindingRoles(findings: Finding[]): string[] {
  // flatten + stable dedupe + non-array guard
  const all: string[] = [];
  for (const f of findings) {
    const roles = f.requiredApproverRoles;
    if (!Array.isArray(roles)) continue;   // non-array guard - JSON 안 type mismatch 시 silent skip
    for (const r of roles) {
      if (typeof r === 'string' && r.length > 0) all.push(r);
    }
  }
  // stable dedupe - 첫 등장 순서 보존
  return Array.from(new Set(all));
}
```

- input.findings 안 각 finding 의 `requiredApproverRoles?: ApproverRole[]` flatten
- non-array (corrupted JSON) → silent skip (audit metadata 안 보존 가능 — Phase Beta)
- 빈 문자열·non-string → skip
- 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)

### 7.1.2 `calculateFinalRoles` throw boundary (CAP3-01 신설)

- **check() 안** — `calculateFinalRoles` throw bubble. try/catch 없음 (check() 자체는 fail closed)
- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
- ComplianceConfigError throw 시 envelope 생성 불가 → ComplianceRecord INSERT 안 됨 → 운영자 콘솔 안 "compliance config error" 표시 + 룰 카탈로그 또는 finding payload 점검 안내
- 일반 catch (Error) 는 unhandled → 500 (Next.js error boundary)

### 7.2 `derivePageTypeId` 매핑

(v0.1 동일 — § 7.2 v0.1 참조)

### 7.3 `priorReviewRequired` 메타 검사 (CAP-16 정정)

`unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:

```typescript
function buildUnreviewedAdFinding(): Finding {
  return {
    ruleId: 'unreviewed-ad-001',
    category: '미심의 광고',
    pattern: '(meta:priorReviewRequired)',
    severity: 'warning',
    location: { start: 0, end: 0 },
    requiredApproverRoles: ['legal'],
    triggeredBy: 'static-rule',   // CONTENT_STANDARDS § 7.2 enum cascade 회피 (CAP-16)
    legalBasis: ['medical-law-art56-para2-no11'],
  };
}
```

---

## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01 · CAP-05·20·21·22 정정)

### 8.1 추출 표 (RISK_LEVELS § 5.1 SoT 정확 매칭)

| Flag | 추출 룰 |
|---|---|
| `includes-effect-claim` | matchResult.findings 안 **SoT 7 카테고리 문자열 정확 매칭** (CAP-05): `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"` 중 1개 이상. `"최상급"`·`"보장 결합 강조"` 등은 **미포함** (CAP-05) |

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=2 minor=0 (총 2)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2

## blocking

## major
- **CAP4-01 — § 2.4 SoT 슬롯 수와 표 row 수 설명이 아직 불일치**
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:180` 은 “SoT 예시 ID 총 27 슬롯”이라고 하면서 괄호 안 subsection 합계는 `1+3+2+1+1+2+1+6+2+1+1+2+2+3 = 28` 이다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:180` 의 “unique 슬롯 26 + § 3.9 중복 행 1 = 27 표 row”도 실제 표와 맞지 않는다. 표 본문은 unique 처리 슬롯 27 + `§ 3.9 false-credential-001` duplicate row 1 = **28 row** 이다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:216` 의 canonical 흡수 9 목록은 `§ 3.9 false-credential 중복 행`을 count 대상으로 적고, 실제 count 대상이어야 하는 `§ 3.3 false-credential-001` 흡수 row를 목록에서 빠뜨린다. duplicate row는 “비-count row”로 명시되어야 한다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1556` 의 CA-CASCADE-07 도 “17 SoT 예시 ID → canonical 매핑”으로 남아 있어 § 2.4 의 27 SoT 슬롯 체계와 불일치한다.
  - patch: § 2.4 를 “27 처리 슬롯 + 1 duplicate display row = 28 표 row”로 분리하고, 흡수 9 목록은 `§ 3.3 false-credential-001` 포함 / `§ 3.9 false-credential-001` duplicate 비-count 처리로 정정. CA-CASCADE-07 은 “27 SoT 슬롯 매핑”으로 정정.

- **CAP4-02 — CAP3-01 throw boundary가 작업 단위에 배정되지 않음**
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1014`~`1017` 은 `calculateFinalRoles` throw 를 `check()` 에서 bubble 하고, `submitForReview · approveContent · rejectContent · publishContent` 4 action 에서 `ComplianceConfigError` 를 form-level error 로 변환한다고 결정한다.
  - 그러나 `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1535`~`1542` 작업 단위 10·12·17 어디에도 server-actions.ts 의 4 action try/catch boundary 추가가 산출물로 배정되지 않는다. 특히 step 17 은 persist 합성 patch 만 다루고, CAP3-01 boundary 구현 지시가 없다.
  - patch: step 17 또는 별도 step 에 `server-actions.ts` 4 action 공통 try/catch boundary 추가를 명시하고, `ComplianceConfigError → ActionResult form-level error`, 일반 Error 는 기존 500 boundary 유지로 적는다.

## minor

## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 4
total_findings: 2
blocking: 0
major: 2
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
54,585
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=2 minor=0 (총 2)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2

## blocking

## major
- **CAP4-01 — § 2.4 SoT 슬롯 수와 표 row 수 설명이 아직 불일치**
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:180` 은 “SoT 예시 ID 총 27 슬롯”이라고 하면서 괄호 안 subsection 합계는 `1+3+2+1+1+2+1+6+2+1+1+2+2+3 = 28` 이다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:180` 의 “unique 슬롯 26 + § 3.9 중복 행 1 = 27 표 row”도 실제 표와 맞지 않는다. 표 본문은 unique 처리 슬롯 27 + `§ 3.9 false-credential-001` duplicate row 1 = **28 row** 이다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:216` 의 canonical 흡수 9 목록은 `§ 3.9 false-credential 중복 행`을 count 대상으로 적고, 실제 count 대상이어야 하는 `§ 3.3 false-credential-001` 흡수 row를 목록에서 빠뜨린다. duplicate row는 “비-count row”로 명시되어야 한다.
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1556` 의 CA-CASCADE-07 도 “17 SoT 예시 ID → canonical 매핑”으로 남아 있어 § 2.4 의 27 SoT 슬롯 체계와 불일치한다.
  - patch: § 2.4 를 “27 처리 슬롯 + 1 duplicate display row = 28 표 row”로 분리하고, 흡수 9 목록은 `§ 3.3 false-credential-001` 포함 / `§ 3.9 false-credential-001` duplicate 비-count 처리로 정정. CA-CASCADE-07 은 “27 SoT 슬롯 매핑”으로 정정.

- **CAP4-02 — CAP3-01 throw boundary가 작업 단위에 배정되지 않음**
  - `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1014`~`1017` 은 `calculateFinalRoles` throw 를 `check()` 에서 bubble 하고, `submitForReview · approveContent · rejectContent · publishContent` 4 action 에서 `ComplianceConfigError` 를 form-level error 로 변환한다고 결정한다.
  - 그러나 `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1535`~`1542` 작업 단위 10·12·17 어디에도 server-actions.ts 의 4 action try/catch boundary 추가가 산출물로 배정되지 않는다. 특히 step 17 은 persist 합성 patch 만 다루고, CAP3-01 boundary 구현 지시가 없다.
  - patch: step 17 또는 별도 step 에 `server-actions.ts` 4 action 공통 try/catch boundary 추가를 명시하고, `ComplianceConfigError → ActionResult form-level error`, 일반 Error 는 기존 500 boundary 유지로 적는다.

## minor

## nit

## acceptance precondition 점검
- 27 SoT 슬롯 처리 완비 + 25 활성 canonical 룰: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 phase 분류 정합: PASS
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 4
total_findings: 2
blocking: 0
major: 2
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
