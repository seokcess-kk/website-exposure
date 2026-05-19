OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e3c-e24c-7162-b05b-b056add32fdd
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.3 — **cycle 3**. cycle 1 (36 finding) + cycle 2 (11 finding) = 누계 47 finding 전건 수용. 수렴 추세 36 → 11. closeable 100% cycle 2.

## cycle 2 결정·patch 요약

- **CAP-04 잔존**: § 2.4 카운트 재정의 — SoT 22 슬롯 (§ 3.1~3.14 안 ID 슬롯) · 활성 canonical 25 (core 14 + medical-ad 신규 11) · acceptance precondition "27 SoT 처리 완비" (18 canonical 표현 폐기).
- **CAP-14 잔존**: calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14). extractFindingRoles 안 client 사전 분리.
- **CAP2-01**: auto-gate enqueueContentGateIfNeeded 안 contentType/contentRef 명시 인자 전달.
- **CAP-10 잔존**: C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker · manifest 21단계.
- **CAP2-02**: matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · event-fact-statement-001 한정 · CA-DEFER-34 Phase Beta).
- **CAP-12 잔존**: CA-CASCADE-02 안 RISK_LEVELS § 2.3.1 evaluatedSteps + contributingSteps 분리 cascade 명시.
- **CAP-19 잔존**: 작업 단위 step 17 풀명세 (types.ts + check.ts + server-actions.ts 합성 patch).
- **CAP-05 잔존**: celebrity-001.category="유명인 동원" + legalBasis cascade.
- **CAP2-03·04**: 보수 정책 (CA-DEFER-31·32·33 신설).
- **CAP2-05**: M0_PLAN § 9.4 실 cascade (CA-DEFER 12종 신설).
- **CAP2-06**: event id `content-gate-queued` + source:"auto".

## 본 cycle 검증 우선순위

cycle 2 patch 정합성 + 잔존 결함 / 신규 결함. 누계 지적 수 추가 감소 권장 (cycle 1 = 36 → cycle 2 = 11 → cycle 3 = ?). normal pattern: cycle 3 = 2~5 finding.

### cycle 2 patch 재검증
1. **CAP-04 cycle 2 정정**: § 2.4 헤더 (~line 173-175) 안 "22 SoT 슬롯" · "25 활성 canonical" · "27 SoT 처리 완비" 표현 일관성. 표 (line 184~213) 안 실제 ID 매핑 정합 검증 — 22 슬롯 모두 표 안 존재
2. **CAP-14 cycle 2 정정**: § 7.1 check.ts 안 calculateFinalRoles positional 호출 정합. extractFindingRoles 안 client 분리 흐름 (clientRolePresent metadata · runtimeRoles 만 큐 처리). final-roles.ts 실 시그니처 (`apps/web/src/lib/compliance/final-roles.ts:14`) 와 plan § 7.1 호출 정합
3. **CAP2-01 cycle 2 신설**: § 12.1 enqueueContentGateIfNeeded 안 (contentType, contentRef) 명시 인자 추가. § 7.1 check.ts 안 호출자 (server-actions.ts 안 submitForReview 흐름) 에서 args 전달 정합
4. **CAP-10 cycle 2 정정**: § 15.1 C0017 (enum ADD VALUE 단독) + § 15.2 C0018 (UNIQUE 재정의) 분리. § 15.4 manifest 21단계 정합. acceptance blocker 표현 명확
5. **CAP2-02 cycle 2 신설**: § 4.3.1 allowlist pre-check 안 shouldSkipRule helper 명세. § 2.5 event-fact-statement-001 scope 안 "global + matcher 안 allowlist pre-check" 표현 정합. CA-DEFER-34 (excludeScopes) Phase Beta
6. **CAP-12 cycle 2 정정**: CA-CASCADE-02 § 18 안 RISK_LEVELS § 2.3.1 evaluatedSteps + contributingSteps cascade 명시 정합. § 10.1 알고리즘 분리 정합 (cycle 1 patch 유지)
7. **CAP-19 cycle 2 정정**: § 17 작업 단위 step 17 풀명세 (types.ts:59 line + check.ts:108 + server-actions.ts:87 line 정합). sentinel backfill 안 extensions 부재 처리 (CAP-19 (e))
8. **CAP-05 cycle 2 정정**: § 2.5 안 celebrity-001 row 안 category="유명인 동원" 정정 + legalBasis "medical-law-art27-para3" Phase Beta cascade marker
9. **CAP2-03 cycle 2 신설**: § 2.6 안 foreign-patient-recruit-domestic-uncertain-001 안 단순 regex 명세 + Phase Beta CA-DEFER-31 marker 정합
10. **CAP2-04 cycle 2 신설**: § 2.6 안 short-clinical-experience-001 + non-covered-discount-misleading-001 안 보수 정책 + CA-DEFER-32·33 marker 정합
11. **CAP2-05 cycle 2 신설**: M0_PLAN § 9.4 안 CA-DEFER-17~22·29·30·31·32·33·34 12종 phase 분류 표 cascade 실 patch 정합. CA-CASCADE-09 정합
12. **CAP2-06 cycle 2 신설**: § 12.1 안 emitAuditEvent 호출 이름 `content-gate-queued` + payload source:"auto". REVIEW_WORKFLOW § 9.1.1 정합

### 새로운 검증 영역

- **§ 2.4 표 line 184~213 실제 매핑 정합**:
  - SoT 22 슬롯 모두 표 안 row 존재 검증
  - 각 row 의 처리 결정 (생성/canonical 흡수/카탈로그 미등록/Phase Beta defer) 정합
  - 흡수 시 대체 ruleId 가 § 2.5 (core) 또는 § 2.6 (medical-ad) 안 정의된 룰 ID 와 일치
- **§ 7.1 check() 안 calculateFinalRoles 호출 정합**:
  - findingRoles = extractFindingRoles(allFindings) helper 정의 위치 명확 (plan 안 명세 또는 별도 helper 분리)
  - clientRolePresent metadata extensions 안 영속 (§ 14.1 안 이미 명세)
  - calculateFinalRoles throw 가능성 시 try/catch (server action 안 form-level error 변환 패턴 — final-roles.ts 안 throw 패턴 정합)
- **§ 18 CA-CASCADE 정합**:
  - CA-CASCADE-02 안 RISK_LEVELS § 2.3.1 cascade 신설 marker 추가 정합 (cycle 1 patch 시점 marker 만 — 실 RISK_LEVELS 본문 patch 는 code cycle)
  - CA-CASCADE-09 안 신설 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) phase 분류 cascade 명시
- **§ 19 미결정 표 정합**:
  - cycle 1 안 MA-Q01~10 결정 모두 유지 정합
  - cycle 2 안 신규 미결정 (CA-DEFER-31~34 phase 결정 등) 추가 필요 여부
- **시나리오 정합**:
  - scenario #38 (CAP-06) automatedDecision='block' + gateRequired=true → enqueue 안 함 — § 12.1 안 새 조건 정합
  - scenario #34 (CAP-12) evaluatedSteps + contributingSteps 분리 검증 — § 10.1 알고리즘 정합

### 새로 발생 가능한 결함

- 표 카운트 재정의 (CAP-04) 후 § 18 CA-CASCADE-07 안 표현 (MEDICAL_AD § 3 매핑 marker — "17 SoT 예시 ID" 등) 잔존
- § 7.1 안 extractFindingRoles helper 정의 부재 (plan 안 helper 시그니처 명세 누락)
- § 12.1 안 calculateContentGateSla helper 정의 부재 (plan § 12.4 안 정의되었으나 실 helper 위치)
- 작업 단위 step 안 § 17 (types.ts cascade) 외 다른 step 안 envelope.extensions 영역 추가 영향 (예: step 10 check.ts 안 반환 정합)
- M0_PLAN § 9.4 안 CA-DEFER 12종 cascade 안 "Phase Beta" 표기 일관성

### Codex 비평 운영 원칙
- cycle 3 안 누계 지적 수 cycle 2 (11) 대비 줄어들어야 함 (수렴 추세 양호). normal pattern = 11 → 1~5
- closeable_after_patch_ratio 100% 근접 권장
- cycle 1·2 patch 적용 안 된 finding 안 직접 인용 (plan § XX · file:line)
- 새로운 결함 ID prefix = **CAP3** (cycle 3 신규)
- 잔존 ID prefix = **CAP** 또는 **CAP2** (그대로 유지)
- 0 finding 도달 시 acceptance 추천 가능

## SoT (cycle 1·2 동일)

본 monorepo working root 에서 직접 파일을 읽어 plan 과 대조. 추가 검증:
- `apps/web/src/lib/compliance/final-roles.ts` (line 14 positional 시그니처)
- `apps/web/src/lib/compliance/types.ts` (line 59 ComplianceCheckEnvelope 안 extensions 영역 없음 확인)
- `apps/web/src/lib/compliance/server-actions.ts` (line 87 envelope.result 단순 persist 확인)
- `packages/core-content/migrations/C0015_review_queue_entry.sql` (line 46 실 unique index)
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` (§ 9.4 신설 CA-DEFER 12종 cascade 정합)
- `docs/compliance/RISK_LEVELS.md` (§ 2.3.1 단일 steps[] 정의 — plan v0.3 안 evaluatedSteps + contributingSteps cascade 권장하나 실 patch 는 code cycle)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = N

## blocking
- **CAP3-XX**: <짧은 제목> 또는 **CAP-XX 또는 CAP2-XX (잔존)**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): ...
  - 문제: ...
  - 권장 patch: ...
  - closeableAfterPatch: true|false

## major
## minor
## nit

## acceptance precondition 점검 (v0.3 정정 기준)
- 25 활성 canonical 룰 + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비: <PASS|FAIL>
- 5 inlineRiskFlags 추출 표 정합: <PASS|FAIL>
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: <PASS|FAIL>
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: <PASS|FAIL>
- High 가상 finding triggeredBy 판정 정합: <PASS|FAIL>
- CA-DEFER 5 + 12 신설 (17·18·19·20·21·22·29·30·31·32·33·34) phase 분류 정합: <PASS|FAIL>
- CA-CASCADE 9종 정합: <PASS|FAIL>

=== CYCLE SIGNAL ===
cycle: 3
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
요청하신 형식에 맞춰 산출물만 최종 출력하겠습니다. 먼저 plan과 지정 SoT 파일을 직접 대조해서 cycle 2 패치 반영 여부와 새 결함만 좁게 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"2\\.4|22 SoT|25 활성|27 SoT|calculateFinalRoles|extractFindingRoles|enqueueContentGateIfNeeded|C0017|C0018|shouldSkipRule|event-fact-statement-001|CA-CASCADE-02|CA-CASCADE-07|CA-CASCADE-09|celebrity-001|foreign-patient-recruit-domestic|short-clinical|non-covered|content-gate-queued|CA-DEFER-(17|18|19|20|21|22|29|30|31|32|33|34)|미결정|MA-Q\" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"calculateFinalRoles|ComplianceCheckEnvelope|envelope\\.result|UNIQUE|CREATE UNIQUE|steps\\[\\]|evaluatedSteps|contributingSteps|CA-DEFER-(17|18|19|20|21|22|29|30|31|32|33|34)|CA-CASCADE-09\" apps/web/src/lib/compliance/final-roles.ts apps/web/src/lib/compliance/types.ts apps/web/src/lib/compliance/server-actions.ts packages/core-content/migrations/C0015_review_queue_entry.sql docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md docs/compliance/RISK_LEVELS.md" in C:\Users\assag\solution\website-exposure
 succeeded in 597ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
12:  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
22:- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
36:- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
37:- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
48:| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
51:| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
52:| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
64:| C0017 migration (CA-MIGRATION-01) | `ALTER TYPE review_queue_type ADD VALUE 'content-gate'` (single statement · COMMIT 분리) + partial UNIQUE DROP + CREATE (manifest 안 별 step 분리 — Postgres ALTER TYPE 트랜잭션 제약) |
66:| **`calculateFinalRoles` 단일 경로 강제** (CAP-14 정정) | `apps/web/src/lib/compliance/final-roles.ts` 이미 존재 — Phase Alpha 안 별도 합집합 계산 안 함. High 가상 finding 의 `requiredApproverRoles` 만 입력으로 추가하여 기존 `calculateFinalRoles` 단일 호출. M0 patterns (operator + Medium/High medical + LegalDocument legal + finding roles 합집합) 그대로 유지 |
69:| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
71:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 20단계 · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 |
73:### 1.3 비범위 (defer) — CAP-25 정정 (CA-DEFER-17~22 명시)
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
106:5. **catalog 로드 실패 시 fail closed** (MA-Q10 결정 — § 12 미결정 안에서 본 cycle 결정) — `loadCatalog()` throw 시 `check()` 도 throw → `submitForReview` action 실패 → 운영자 콘솔 에러 표시. **운영 risk**: 카탈로그 손상 시 전체 발행 마비 가능성 — Phase Beta 안 명시 fallback 모드 (last-known-good catalog) 검토.
122:├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
166:    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
169:> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).
177:### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 2 카운트 재정의)
182:- rules.medical-ad.yaml 안 **11 overrides** (rules.core 안 14 룰 중 11 룰에 legalBasis overlay — supremacy · effect-assertion · guarantee-composite · comparison · inducement-pressure · event-fact-statement · diagnosis-assertion · authority-assertion · professional-assertion-standalone · guarantee-explicit · body-type-claim 외 numeric-period-* 2 룰 + celebrity-001 1 룰 = 11 overlay + 14 - 11 = 3 룰 (numeric-period-standalone · numeric-period-guarantee · celebrity) overlay 별도 처리)
184:- **acceptance precondition 재정의** (CAP-04 정정): "canonical 25 활성 룰 + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비" (기존 "18 canonical" 표현 폐기)
190:| § 3.2 | `short-clinical-experience-001` | **생성** | `short-clinical-experience-001` | 동일 |
209:| § 3.12 | `foreign-patient-recruit-domestic-confirmed-001` | **생성** (composite — 한국어 + 외국인 환자 + 의료관광) | 동일 | `["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]` |
210:| § 3.12 | `foreign-patient-recruit-domestic-uncertain-001` | **생성** (composite — 다국어 페이지 메타 + 외국인 환자) | 동일 | 동일 |
211:| § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
212:| § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
217:**SoT 22 슬롯 처리 합계**: 생성 13 (직접 매칭 룰 신설) · canonical 흡수 7 (다른 룰로 대체) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 22. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.
231:| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | global (CAP2-02 정정 — scope NOT 표현 불가이므로 matcher 안 **allowlist pre-check**: pageTypeId ∈ {P-102, P-104} 또는 articleType='event-price' 시 룰 매칭 skip · § 4.3·§ 4.4 안 명세) | 동일 |
236:| `celebrity-001` | "유명인 동원" (CAP-05 잔존 정정 — SoT § 4.1 정확 매칭) | fail | regex (`(연예인\|아이돌\|배우)\s*(이\|가)?\s*받은`) | global | 동일. legalBasis = `["medical-law-art27-para3"]` (환자 유인 — MEDICAL_AD § 3.0 cascade Phase Beta 매핑) |
302:  - id: "short-clinical-experience-001"
305:    # Phase Beta CA-DEFER-32 (numeric predicate) 안 1~6 만 매칭 정확화
311:    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
381:  - id: "foreign-patient-recruit-domestic-confirmed-001"
395:  - id: "foreign-patient-recruit-domestic-uncertain-001"
397:    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
404:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
408:  - id: "non-covered-discount-pressure-001"
422:  - id: "non-covered-discount-misleading-001"
425:    # Phase Beta CA-DEFER-33 (evidence absence) 안 기간/대상/대상 명시 부재 검사 강화 - 명시된 정상 케이스 silent pass
432:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
453:> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).
557:slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
606:│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
635:- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
636:- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
639:- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
721:- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
722:- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
731:function shouldSkipRule(rule: RiskRule, scope: ContentScopeInput): boolean {
732:  // event-fact-statement-001 - CONTENT_STANDARDS § 5.7 정합 - 허용 페이지 안 skip
733:  if (rule.id === 'event-fact-statement-001') {
741:Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).
801:- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
838:**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
859:import { calculateFinalRoles } from './final-roles';   // CAP-14 - 기존 helper 단일 경로
934:  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 - 실 positional 시그니처)
935:  //   final-roles.ts:14 정합 - calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)
936:  //   findings 안 requiredApproverRoles 안 'client' 등록 시 calculateFinalRoles throw (실 helper 동작 보존) - 본 cycle 안
937:  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
938:  const findingRoles = extractFindingRoles(allFindings);
941:  const runtimeRoles = calculateFinalRoles(
993:`unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:
1042:  legalDocumentType?: 'privacy' | 'terms' | 'non-covered' | 'refund' | 'complaint' | 'cookie' | 'other';
1066:### 9.2 Phase Beta 합류 시 (CA-DEFER-18)
1180:### 11.2 requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)
1182:`calculateFinalRoles` (apps/web/src/lib/compliance/final-roles.ts) 사용. M0 patterns:
1197:// CAP2-06 정정 - event id 'content-gate-queued' (REVIEW_WORKFLOW § 9.1.1 정합) + source: "auto"
1198:export async function enqueueContentGateIfNeeded(
1208:  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type) - C0018 재정의
1227:  // CAP2-06 - REVIEW_WORKFLOW § 9.1.1 event id 'content-gate-queued' 정합 + source: "auto" payload
1228:  await emitAuditEvent('content-gate-queued', {
1248:### 12.4 priority · slaDueAt 정책 (CAP-33 정정 — REVIEW_WORKFLOW § 3.3 인용)
1254:- 알림 = `content-gate-queued` (REVIEW_WORKFLOW § 9.1.1)
1371:> **CAP-10 잔존 acceptance blocker** (cycle 2): 실 C0015 unique = `(instance_id, content_type, content_ref)` partial. 본 cycle 안 content-gate + manual-review 동시 open 가능하려면 **C0018 unique 재정의 = acceptance blocker** — code cycle 안 manifest 단계 안 반드시 적용. C0017 (enum ADD VALUE) 단독 + C0018 (UNIQUE 재정의) 분리 — 합 manifest 21단계 고정.
1373:### 15.1 C0017 migration (enum ADD VALUE 단독)
1376:-- packages/core-content/migrations/C0017_content_gate_queue_enum.sql
1383:### 15.2 C0018 migration (UNIQUE 재정의 — acceptance blocker)
1386:-- packages/core-content/migrations/C0018_review_queue_unique_redefine.sql
1407:M0 19단계 + C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) = **21단계 고정**.
1422:| 6 | "20% 할인 진행" + Article articleType=event-price → event-fact-statement-001 미매칭 (scope 예외) | findings=[] |
1423:| 7 | "20% 할인 진행" + Article articleType=general-medical-info → event-fact-statement-001 매칭 | severity='content-gate' · roles=['legal'] |
1427:| 11 | 외국인 환자 한국어 모집 → foreign-patient-recruit-domestic-confirmed-001 (fail) | severity='fail' |
1428:| 12 | 다국어 페이지 메타 + "foreign patient" → foreign-patient-recruit-domestic-uncertain-001 (content-gate · legal) | roles=['legal'] |
1503:| 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
1506:| 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
1507:| 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
1509:| 16 | manifest 21단계 (M0 19 + C0017 + C0018) | packages/migrations-runner/src/manifest.ts |
1512:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 | doc patches |
1519:- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
1520:- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
1522:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
1524:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 17 SoT 예시 ID → canonical 매핑 (CAP-04)
1525:- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
1526:- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30 신설 marker** (CAP-25 정정)
1530:## 19. § 12 미결정 (Codex 비평 입력)
1534:| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
1535:| MA-Q02 | includes-effect-claim 7 카테고리 안 supremacy / 보장 결합 강조 정합 | **SoT 7 문자열 정확 매칭** (CAP-05) — "최상급" 미포함 · "전문성 단정 (효과·결과·보장 결합)" 포함 |
1536:| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
1537:| MA-Q04 | extensions 영역의 SoT 위치 | **envelope.extensions 별도 영역 + DB persist 시 result 안 nested 합성** (CAP-19) — CONTENT_STANDARDS § 7.2 SoT 7 필드 침해 없음 |
1538:| MA-Q05 | slot-matches.yaml SoT 위치 | **RISK_LEVELS § 3 cascade** — PAGE_TYPES § 3 안 slot 표 SoT (Phase Beta 안 실 변환 시 PAGE_TYPES 정합 검증) |
1539:| MA-Q06 | content-gate 큐 manual-review 와 분리 vs 통합 | **분리 채택** (CAP-07) — 동시 진입 가능, 발행 게이트 AND |
1540:| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
1541:| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
1542:| MA-Q09 | medical-law-tracking baseline | **MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27) |
1543:| MA-Q10 | catalog 로드 실패 시 정책 | **fail closed (throw)** (§ 1.4 5번) — Phase Beta 안 last-known-good 모드 검토 |
1551:| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
1552:| 2026-05-19 | **v0.3** | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1553:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 606ms:
docs/compliance/RISK_LEVELS.md:95:#### 2.3.1 RiskInferenceResult — steps[] 추적
docs/compliance/RISK_LEVELS.md:108:- 각 단계 1~5에서 base가 갱신될 때마다 steps[]에 항목 추가
docs/compliance/RISK_LEVELS.md:713:| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 RiskInferenceResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:136:  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:137:  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:203:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:211:CREATE UNIQUE INDEX review_queue_entry_open_unique
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:424:export function calculateFinalRoles(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:481:    finalRoles = calculateFinalRoles(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:522:### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:533:export type ComplianceCheckEnvelope = {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:576:export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:642:VALUES (..., envelope.meta.pageRiskLevel, envelope.result, jsonb_build_object(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:650:- `compliance_record.auto_check_result` = `envelope.result` (CONTENT_STANDARDS § 7.2 SoT 그대로)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:770:| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:823:### 9.4 Phase Alpha 안 신설 CA-DEFER (CA-CASCADE-09 · COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.3 cascade · CAP-25/CAP2-05 정정)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:825:- `CA-DEFER-17` (Phase Beta): preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 — InstanceManifest 안 preset 설정 안 되어 있으면 loader silent skip
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:826:- `CA-DEFER-18` (Phase Beta): PAGE_TYPES § 3 P-006 (및 다른) 슬롯 격상 표 → slot-matches.yaml 실 데이터. v0.1 안 slot-matches.yaml v0.0 placeholder. TreatmentPage 실 schema single body_markdown 필드만 — `body-regex` matchCondition.kind 신설 필요
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:827:- `CA-DEFER-19` (Phase Beta): medical-law-tracking.yaml 실 의료법 개정 추적 — v0.1 안 MEDICAL_AD § 11.2 SoT revision (2026-04-07 reaffirmation) seed 1건. 추가 revision Phase Beta
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:828:- `CA-DEFER-20` (Phase Beta): `field` scope fieldPath 단위 매칭 — v0.1 안 loader skip+warning
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:829:- `CA-DEFER-21` (Phase Beta): `block` scope 5종 (list/table/callout/citation/media) — `qa` 외. v0.1 안 loader skip+warning
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:830:- `CA-DEFER-22` (Phase Beta): **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도. v0.1 안 fallback 정규식만 (한국어 종결 어미 부정확). CA-DEFER-01 부분 해소 표현
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:831:- `CA-DEFER-29` (Phase Beta): `citationAbsence` evaluation contract — `false-statement-001` (MEDICAL_AD § 3.3) 본 contract 필요. v0.1 안 단순 regex 한계
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:832:- `CA-DEFER-30` (Phase Beta): `NOT_IN_PARAGRAPH` logic (negative operand) — `side-effect-missing-001` (MEDICAL_AD § 3.7) 본 logic 필요. v0.1 안 룰 자체 미등록 (Phase Beta 합류)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:833:- `CA-DEFER-31` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): pageMeta composite — `foreign-patient-recruit-domestic-uncertain-001` (MEDICAL_AD § 3.12 불명확) 안 inLanguage/국내매체 evidence. v0.1 안 단순 regex
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:834:- `CA-DEFER-32` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): numeric predicate — `short-clinical-experience-001` (MEDICAL_AD § 3.2 6개월 이하) 안 6 이하 정확 매칭. v0.1 안 1~99 모두 fail 보수 정책
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:835:- `CA-DEFER-33` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): evidence absence — `non-covered-discount-misleading-001` (MEDICAL_AD § 3.13) 안 기간/대상 명시 부재 검사. v0.1 안 모든 % 할인 content-gate 보수 정책
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:836:- `CA-DEFER-34` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): RiskRule.scope `excludeScopes[]` 필드 — NOT/except 표현. v0.1 안 matcher 안 allowlist pre-check (`event-fact-statement-001`)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:838:> **CA-DEFER-01 표현 정정** (CAP-01 · CA-DEFER-22 동반): "RuleCatalog yaml + check() 9단계 + composite/contextExceptions" → "**부분 해소** (Phase Alpha v0.3 cycle) — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도는 KSS v3+ 합류 (CA-DEFER-22) 까지 fallback 한계 잔존"
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:848:- `CA-CASCADE-09` (COMPLIANCE_ASSISTANT_PHASE_ALPHA v0.3 cascade · CAP2-05 정정): § 9.4 안 신설 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) phase 분류 및 CA-DEFER-01 부분 해소 표현 정정. Phase Alpha plan v0.3 의 § 1.3 비범위 표 정합 cascade.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:858:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:859:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
apps/web/src/lib/compliance/types.ts:61:export type ComplianceCheckEnvelope = {
packages/core-content/migrations/C0015_review_queue_entry.sql:38:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0015_review_queue_entry.sql:46:CREATE UNIQUE INDEX review_queue_entry_open_unique
apps/web/src/lib/compliance/final-roles.ts:14:export function calculateFinalRoles(
apps/web/src/lib/compliance/server-actions.ts:10:  ComplianceCheckEnvelope,
apps/web/src/lib/compliance/server-actions.ts:17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
apps/web/src/lib/compliance/server-actions.ts:69:  const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
apps/web/src/lib/compliance/server-actions.ts:73:  const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
apps/web/src/lib/compliance/server-actions.ts:74:  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
apps/web/src/lib/compliance/server-actions.ts:87:      ${JSON.stringify(envelope.result)}::jsonb,
apps/web/src/lib/compliance/server-actions.ts:243:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance/server-actions.ts:275:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);

codex
초기 대조 결과, 대부분 cycle 2 패치는 반영되어 있습니다. 다만 CA-CASCADE 계열에서 숫자 표현이 남아 있는 지점과 실제 SoT 문서 반영 범위를 더 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (176..218))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (850..970))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (1188..1238))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (1498..1528))' in C:\Users\assag\solution\website-exposure
 succeeded in 756ms:
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

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 - 실 positional 시그니처)
  //   final-roles.ts:14 정합 - calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)
  //   findings 안 requiredApproverRoles 안 'client' 등록 시 calculateFinalRoles throw (실 helper 동작 보존) - 본 cycle 안
  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
  const findingRoles = extractFindingRoles(allFindings);
  const clientRolePresent = findingRoles.includes('client');
  const findingRolesWithoutClient = findingRoles.filter(r => r !== 'client');
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

 succeeded in 759ms:
### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 2 카운트 재정의)

**v0.3 카운트 재정의** (CAP-04 잔존 cycle 2):
- MEDICAL_AD § 3.0~3.14 안 **SoT 예시 ID 총 22 슬롯** (3.1 1 · 3.2 3 · 3.3 2 · 3.4 1 · 3.5 1 · 3.6 2 · 3.7 1 · 3.8 5 · 3.9 2 · 3.10 1 · 3.11 1 · 3.12 2 · 3.13 2 · 3.14 3 · 3.15 0 시행령 미존재). 일부는 § 3.3 · § 3.9 안 중복 (`false-credential-001`)
- **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건) + rules.medical-ad.yaml 11 신규 룰 (의료법 특화)
- rules.medical-ad.yaml 안 **11 overrides** (rules.core 안 14 룰 중 11 룰에 legalBasis overlay — supremacy · effect-assertion · guarantee-composite · comparison · inducement-pressure · event-fact-statement · diagnosis-assertion · authority-assertion · professional-assertion-standalone · guarantee-explicit · body-type-claim 외 numeric-period-* 2 룰 + celebrity-001 1 룰 = 11 overlay + 14 - 11 = 3 룰 (numeric-period-standalone · numeric-period-guarantee · celebrity) overlay 별도 처리)
- **SoT 예시 ID 처리**: 생성 (직접 매칭) 13 · canonical 흡수 (다른 룰로 대체) 7 · 카탈로그 미등록 (runtime-meta) 1 (`unreviewed-ad-001`) · Phase Beta defer 1 (`side-effect-missing-001`) = 22 (SoT 22 슬롯 모두 처리)
- **acceptance precondition 재정의** (CAP-04 정정): "canonical 25 활성 룰 + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비" (기존 "18 canonical" 표현 폐기)

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

**SoT 22 슬롯 처리 합계**: 생성 13 (직접 매칭 룰 신설) · canonical 흡수 7 (다른 룰로 대체) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 22. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 11 신규 = **25 활성 canonical 룰**.

### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)

 succeeded in 756ms:
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
| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + CA-DEFER-17~22 신설 | doc patches |

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
- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30 신설 marker** (CAP-25 정정)

---


 succeeded in 773ms:
---

## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07·33 정정)

### 12.1 동작 (CAP-06 + CAP2-01·06 정정)

```typescript
// CAP2-01 정정 - envelope.meta 안 contentType/contentRef 없음 → 명시 인자로 받음
// CAP2-06 정정 - event id 'content-gate-queued' (REVIEW_WORKFLOW § 9.1.1 정합) + source: "auto"
export async function enqueueContentGateIfNeeded(
  tx: TransactionSql, ctx: TenantContext,
  envelope: ComplianceCheckEnvelope, recordId: string,
  contentType: ContentType, contentRef: string,   // CAP2-01 - 호출자 명시 전달
): Promise<{ entryId: string | null }> {
  // CAP-06 - block 콘텐츠는 큐 진입 안 함 (blocked 정정 흐름)
  if (!envelope.result.gateRequired || envelope.result.automatedDecision === 'block') {
    return { entryId: null };
  }

  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type) - C0018 재정의
  const existing = await tx`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}
      AND content_type = ${contentType}
      AND content_ref = ${contentRef}
      AND queue_type = 'content-gate'
      AND status IN ('open', 'in-progress')
  `;
  if (existing.length > 0) return { entryId: existing[0].id };

  const entryId = uuid();
  await tx`
    INSERT INTO review_queue_entry (id, instance_id, content_type, content_ref, compliance_record_id, queue_type, status,
      priority, required_roles, sla_due_at, created_at, updated_at)
    VALUES (${entryId}, ${ctx.instanceId}, ${contentType}, ${contentRef}, ${recordId},
      'content-gate', 'open', 'P0', ${envelope.result.requiredApproverRoles ?? []},
      ${calculateContentGateSla()}, now(), now())
  `;
  // CAP2-06 - REVIEW_WORKFLOW § 9.1.1 event id 'content-gate-queued' 정합 + source: "auto" payload
  await emitAuditEvent('content-gate-queued', {
    recordId, entryId, contentType, contentRef,
    finalRoles: envelope.result.requiredApproverRoles,
    source: 'auto',   // CAP2-06 - manual submit vs auto-gate 구분
  });
  return { entryId };
}
```

### 12.2 호출 시점 (CAP-07 정정)

- **`submitForReview` action 안 만 통합** (Phase Alpha)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (970..1035))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (1238..1270))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/final-roles.ts'; (Get-Content "'$p | Select-Object -Index (0..60))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/types.ts'; (Get-Content "'$p | Select-Object -Index (50..78))' in C:\Users\assag\solution\website-exposure
 succeeded in 786ms:
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
| `includes-pricing` | body 정규식 (CAP-21 SoT 전건): **`[₩$￥]\s*\d`** OR **`\d{2,}\s*(원\|만원\|달러)`** OR 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
| `includes-event` | body 어휘 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
| `includes-before-after` | (a) body 어휘 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`) OR (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠 미디어 첨부 |
| `includes-testimonial` | matchResult.findings 안 `ruleId === 'testimonial-001'` 매칭 시 활성 (CAP-20 정정 — 별도 composite matcher 없음) |

### 8.2 false-positive 완화 (RISK_LEVELS § 5.1.2 · CAP-22 정정)

LegalDocument 는 check() 진입 자체 차단되므로 runtime 영향 없음 (dead code marker — CAP-22). 실 적용:

| 컨텍스트 | 제외 Flag |
|---|---|
| `LocationProfile.branchDescription`·`transportInfo`·`parkingInfo` 필드 (호출자가 `metadata.locationProfileField` 전달 시) | `includes-event` |
| `Article articleType=notice` | `includes-event` |

> LegalDocument 안 documentType별 완화 표 — **공용 inlineFlags extractor 직접 호출 시 만** 사용 (테스트/미래 경로). runtime check() 안 미실행 (CAP-22).

### 8.3 `includes-before-after` 부가 입력 (ComplianceCheckInput.metadata cascade)


 succeeded in 777ms:
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

 succeeded in 782ms:
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

 succeeded in 788ms:
- **`submitForReview` action 안 만 통합** (Phase Alpha)
- `saveArticle` 등 entity save 안 자동 호출 — **Phase Beta defer** (빌드 시점 자동 큐 활성화 시)
- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker

### 12.3 동시 큐 운영

- 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
- 발행 게이트 — 양 큐 모두 resolved 필요 (AND)

### 12.4 priority · slaDueAt 정책 (CAP-33 정정 — REVIEW_WORKFLOW § 3.3 인용)

REVIEW_WORKFLOW § 3.3 표 그대로 인용:
- **content-gate 큐 priority = P0** (REVIEW_WORKFLOW § 3.3)
- **slaDueAt = `calculateContentGateSla()` = now + businessDays(3)** (영업일 3일)
- `calculateContentGateSla()` 산정 주체 = `apps/web/src/lib/sla.ts` (신규 helper)
- 알림 = `content-gate-queued` (REVIEW_WORKFLOW § 9.1.1)

---

## 13. FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 부분 해소 · CAP-08·31·34 정정)

### 13.1 zod schema 변경 — 없음 (CAP-08 정정)

`apps/web/src/lib/eat-content-schema.ts` (CAP-31 정정 — 경로 정정) 안 — **FAQ 의 status field 는 이미 compliance workflow integration v1.0 안 form schema 안 제거되었음** (CWI-01). 본 cycle 안 zod patch 불필요.

### 13.2 FaqForm.tsx 변경 — 없음 (CAP-08 정정)

`FaqForm.tsx` 안 `name="status"` field 는 이미 제거됨 (CWI cycle). 본 cycle 안 추가 patch 없음.

### 13.3 FAQ unlock 위치 (CAP-08 정정)

- **workflow action / publish path 안** compliance check + status transition 허용
- `submitForReview` action 안 `contentType='FAQ'` 입력 흐름 안 자동 check() 호출

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"extractFindingRoles|function extract|const extract|clientRolePresent|ComplianceConfigError|try/catch|catch|submitForReview|enqueueContentGateIfNeeded\\(\" docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (1408..1435))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (730..750))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md'; (Get-Content "'$p | Select-Object -Index (1530..1548))' in C:\Users\assag\solution\website-exposure
 succeeded in 702ms:
5:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
38:- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
40:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
57:| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑. 유도 불가 시 throw `ComplianceConfigError` |
61:| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
62:| FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 · CAP-08 정정) | **FaqForm zod schema 변경 없음** (이미 status field 제거됨 — CWI-01). FAQ 자동 검수 적용 위치 = submitForReview action 안 `contentType='FAQ'` 입력 흐름. body = Q + A 결합 + `qa` block scope (CAP-24). risk_level 자동 추론 = P-011 기본 Low + Q/A 본문 안 의료 어휘 → Medium/High 격상 가능. **EC-DEFER-12 부분 해소** (CAP-34 정정) = FAQ status='published' 발행만 정상화. Publication·MediaAppearance status='draft' 만 잔존 (외부 인용 entity 면제 — Phase Beta 별도 unlock 결정) |
67:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
106:5. **catalog 로드 실패 시 fail closed** (MA-Q10 결정 — § 12 미결정 안에서 본 cycle 결정) — `loadCatalog()` throw 시 `check()` 도 throw → `submitForReview` action 실패 → 운영자 콘솔 에러 표시. **운영 risk**: 카탈로그 손상 시 전체 발행 마비 가능성 — Phase Beta 안 명시 fallback 모드 (last-known-good catalog) 검토.
863:  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);
867:  if (!pageTypeId) throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);
871:    throw new ComplianceConfigError(`Article 은 articleType required`);
937:  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
938:  const findingRoles = extractFindingRoles(allFindings);
939:  const clientRolePresent = findingRoles.includes('client');
972:      clientRolePresent,                                       // CAP-15
1198:export async function enqueueContentGateIfNeeded(
1239:- **`submitForReview` action 안 만 통합** (Phase Alpha)
1241:- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker
1271:- `submitForReview` action 안 `contentType='FAQ'` 입력 흐름 안 자동 check() 호출
1328:    "clientRolePresent": false,
1356:  clientRolePresent: boolean;
1484:| 42 | contentType='LegalDocument' 입력 → check() throw ComplianceConfigError | buildLegalDocumentExemptEnvelope 호출 시 정상 envelope |
1505:| 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
1552:| 2026-05-19 | **v0.3** | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
1553:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |

 succeeded in 737ms:
function shouldSkipRule(rule: RiskRule, scope: ContentScopeInput): boolean {
  // event-fact-statement-001 - CONTENT_STANDARDS § 5.7 정합 - 허용 페이지 안 skip
  if (rule.id === 'event-fact-statement-001') {
    if (scope.pageTypeId === 'P-102' || scope.pageTypeId === 'P-104') return true;
    if (scope.articleType === 'event-price') return true;
  }
  return false;
}
```

Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).

### 4.4 qa block scope 안 FAQ 처리 (CAP-24 정정)

- FAQ check() 입력 시 — `qaBlocks` 입력 안 question/answer 분리
- `qa` block scope 룰은 각 qa block 안 단위로 매칭 (question OR answer 각 부분 매칭)
- finding.location 은 전체 body 안 offset (qaBlocks 안 offsetStart 더해 변환)
- v0.1 안 `qa` block scope 룰 등록 안 함 (rules.core/medical-ad.yaml 안 모두 global) — 단순히 qaBlocks 입력 지원만 활성 (Phase Beta 안 qa block 전용 룰 추가 가능)

### 4.5 simple 매칭


 succeeded in 748ms:
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

| # | 시나리오 | 통과 기준 |

 succeeded in 769ms:

| ID | 항목 | cycle 1 안 결정 |
|---|---|---|
| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
| MA-Q02 | includes-effect-claim 7 카테고리 안 supremacy / 보장 결합 강조 정합 | **SoT 7 문자열 정확 매칭** (CAP-05) — "최상급" 미포함 · "전문성 단정 (효과·결과·보장 결합)" 포함 |
| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
| MA-Q04 | extensions 영역의 SoT 위치 | **envelope.extensions 별도 영역 + DB persist 시 result 안 nested 합성** (CAP-19) — CONTENT_STANDARDS § 7.2 SoT 7 필드 침해 없음 |
| MA-Q05 | slot-matches.yaml SoT 위치 | **RISK_LEVELS § 3 cascade** — PAGE_TYPES § 3 안 slot 표 SoT (Phase Beta 안 실 변환 시 PAGE_TYPES 정합 검증) |
| MA-Q06 | content-gate 큐 manual-review 와 분리 vs 통합 | **분리 채택** (CAP-07) — 동시 진입 가능, 발행 게이트 AND |
| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
| MA-Q09 | medical-law-tracking baseline | **MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27) |
| MA-Q10 | catalog 로드 실패 시 정책 | **fail closed (throw)** (§ 1.4 5번) — Phase Beta 안 last-known-good 모드 검토 |

---

## 변경 이력

| 일자 | 버전 | 변경 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/compliance/server-actions.ts'; (Get-Content "'$p | Select-Object -Index (50..100))' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md'; (Get-Content "'$p | Select-Object -Index (468..492))' in C:\Users\assag\solution\website-exposure
 succeeded in 611ms:
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

 succeeded in 609ms:
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(
      contentType, record.page_risk_level, record.prior_review_required,
      autoCheck.requiredApproverRoles ?? [],
    );
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }
  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];


codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3

## blocking
- **CAP-04 (잔존)**: § 2.4 SoT 슬롯 카운트 재정의가 표 본문과 불일치
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:177, 180, 184, 190-215, 217
  - 근거(SoT): § 2.4는 “SoT 예시 ID 총 22 슬롯”이라고 하지만, 같은 줄의 섹션별 합계 `3.1 1 · 3.2 3 · 3.3 2 · 3.4 1 · 3.5 1 · 3.6 2 · 3.7 1 · 3.8 5 · 3.9 2 · 3.10 1 · 3.11 1 · 3.12 2 · 3.13 2 · 3.14 3`은 27이다. 표도 duplicate `false-credential-001` 및 “단독 어휘” row 포함 시 28 row, unique ID 기준으로도 26 ID + 단독 어휘 1 slot = 27 slot이다.
  - 문제: acceptance precondition “25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비”와 “SoT 22 슬롯 처리 합계”가 동시에 존재해 검증 기준이 닫히지 않는다. 생성 13 · 흡수 7 · runtime 1 · defer 1 = 22 집계도 표 row의 실제 처리 수와 맞지 않는다.
  - 권장 patch: § 2.4에서 “SoT 슬롯”의 단위를 하나로 고정한다. 현재 표를 유지하려면 `SoT 처리 슬롯 = 27`로 재정의하고, 처리 합계를 표 기준으로 재산정한다. 반대로 22를 유지하려면 § 3.8/§ 3.14 흡수 row와 duplicate/단독 어휘 row 중 acceptance count 제외 항목을 별도 “비-count row”로 명시하고 표에서 합계 제외 표시를 붙인다.
  - closeableAfterPatch: true

## major
- **CAP2-05 (잔존)**: CA-CASCADE-09 marker가 cycle 2 신설 CA-DEFER 31~34를 반영하지 않음
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:71, 1512, 1526
  - 근거(SoT): `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md`:823-836 및 848은 CA-DEFER 12종 `17·18·19·20·21·22·29·30·31·32·33·34`를 모두 반영한다.
  - 문제: Phase Alpha plan의 CA-CASCADE-09 marker는 여전히 `CA-DEFER-17~22 신설` 또는 `17·18·19·20·21·22·29·30 신설 marker`까지만 적고 있어 cycle 2 CAP2-05 수용 내용과 내부 불일치한다.
  - 권장 patch: § 1.2, § 17 step 19, § 18 CA-CASCADE-09를 모두 `CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 phase 분류 정정`으로 통일한다.
  - closeableAfterPatch: true

- **CAP3-01**: § 7.1 role extraction contract가 helper 정의와 error boundary 없이 사용됨
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:934-945
  - 근거(SoT): `apps/web/src/lib/compliance/final-roles.ts`:14 positional 시그니처는 `calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)`이고, unknown role 및 `client` role 입력 시 `ComplianceConfigError`를 throw한다.
  - 문제: § 7.1은 `extractFindingRoles(allFindings)`를 호출하지만 helper 시그니처와 dedupe/flatten 정책이 없다. 또한 `client`는 사전 분리하지만 unknown role throw는 `check()` 안에서 그대로 bubble될 수 있는데, submitForReview form-level error 변환 boundary가 plan에 명시되지 않았다.
  - 권장 patch: § 7.1 또는 § 11.2에 `extractFindingRoles(findings: Finding[]): string[]` helper를 추가하고 `requiredApproverRoles` flatten + stable dedupe + non-array guard 정책을 명시한다. `calculateFinalRoles` 호출은 `try/catch ComplianceConfigError`로 감싸 `check()` 호출자 또는 `submitForReview`에서 form-level error로 변환한다고 명시한다.
  - closeableAfterPatch: true

## minor
없음

## nit
없음

## acceptance precondition 점검 (v0.3 정정 기준)
- 25 활성 canonical 룰 + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 (17·18·19·20·21·22·29·30·31·32·33·34) phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 3
total_findings: 3
blocking: 1
major: 2
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
52,298
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3

## blocking
- **CAP-04 (잔존)**: § 2.4 SoT 슬롯 카운트 재정의가 표 본문과 불일치
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:177, 180, 184, 190-215, 217
  - 근거(SoT): § 2.4는 “SoT 예시 ID 총 22 슬롯”이라고 하지만, 같은 줄의 섹션별 합계 `3.1 1 · 3.2 3 · 3.3 2 · 3.4 1 · 3.5 1 · 3.6 2 · 3.7 1 · 3.8 5 · 3.9 2 · 3.10 1 · 3.11 1 · 3.12 2 · 3.13 2 · 3.14 3`은 27이다. 표도 duplicate `false-credential-001` 및 “단독 어휘” row 포함 시 28 row, unique ID 기준으로도 26 ID + 단독 어휘 1 slot = 27 slot이다.
  - 문제: acceptance precondition “25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비”와 “SoT 22 슬롯 처리 합계”가 동시에 존재해 검증 기준이 닫히지 않는다. 생성 13 · 흡수 7 · runtime 1 · defer 1 = 22 집계도 표 row의 실제 처리 수와 맞지 않는다.
  - 권장 patch: § 2.4에서 “SoT 슬롯”의 단위를 하나로 고정한다. 현재 표를 유지하려면 `SoT 처리 슬롯 = 27`로 재정의하고, 처리 합계를 표 기준으로 재산정한다. 반대로 22를 유지하려면 § 3.8/§ 3.14 흡수 row와 duplicate/단독 어휘 row 중 acceptance count 제외 항목을 별도 “비-count row”로 명시하고 표에서 합계 제외 표시를 붙인다.
  - closeableAfterPatch: true

## major
- **CAP2-05 (잔존)**: CA-CASCADE-09 marker가 cycle 2 신설 CA-DEFER 31~34를 반영하지 않음
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:71, 1512, 1526
  - 근거(SoT): `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md`:823-836 및 848은 CA-DEFER 12종 `17·18·19·20·21·22·29·30·31·32·33·34`를 모두 반영한다.
  - 문제: Phase Alpha plan의 CA-CASCADE-09 marker는 여전히 `CA-DEFER-17~22 신설` 또는 `17·18·19·20·21·22·29·30 신설 marker`까지만 적고 있어 cycle 2 CAP2-05 수용 내용과 내부 불일치한다.
  - 권장 patch: § 1.2, § 17 step 19, § 18 CA-CASCADE-09를 모두 `CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 phase 분류 정정`으로 통일한다.
  - closeableAfterPatch: true

- **CAP3-01**: § 7.1 role extraction contract가 helper 정의와 error boundary 없이 사용됨
  - 위치: `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md`:934-945
  - 근거(SoT): `apps/web/src/lib/compliance/final-roles.ts`:14 positional 시그니처는 `calculateFinalRoles(contentType, pageRiskLevel, priorReviewRequired, requiredApproverRoles)`이고, unknown role 및 `client` role 입력 시 `ComplianceConfigError`를 throw한다.
  - 문제: § 7.1은 `extractFindingRoles(allFindings)`를 호출하지만 helper 시그니처와 dedupe/flatten 정책이 없다. 또한 `client`는 사전 분리하지만 unknown role throw는 `check()` 안에서 그대로 bubble될 수 있는데, submitForReview form-level error 변환 boundary가 plan에 명시되지 않았다.
  - 권장 patch: § 7.1 또는 § 11.2에 `extractFindingRoles(findings: Finding[]): string[]` helper를 추가하고 `requiredApproverRoles` flatten + stable dedupe + non-array guard 정책을 명시한다. `calculateFinalRoles` 호출은 `try/catch ComplianceConfigError`로 감싸 `check()` 호출자 또는 `submitForReview`에서 form-level error로 변환한다고 명시한다.
  - closeableAfterPatch: true

## minor
없음

## nit
없음

## acceptance precondition 점검 (v0.3 정정 기준)
- 25 활성 canonical 룰 + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비: FAIL
- 5 inlineRiskFlags 추출 표 정합: PASS
- RiskInference MAX 결합 + evaluatedSteps/contributingSteps 분리 정합: PASS
- contextExceptions OR 결합 + 같은 문장 단위 + fail composite 예외 정합: PASS
- High 가상 finding triggeredBy 판정 정합: PASS
- CA-DEFER 5 + 12 신설 (17·18·19·20·21·22·29·30·31·32·33·34) phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 3
total_findings: 3
blocking: 1
major: 2
minor: 0
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
