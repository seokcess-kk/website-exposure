OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3e1e-eae0-7722-9889-b1f346b9c8a3
--------
user
You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.1 (draft). 본 plan은 compliance-assistant Feature spec v1.0 의 **Phase Alpha scope** — M0 stub `check()` 를 실 9단계 빌드 파이프라인으로 교체. **CA-DEFER-01·02·11·15 + EC-DEFER-05** 5종 해소 대상. 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta defer.

This is **cycle 1**. Produce a strict, broad critique. plan을 spec/SoT와 직접 대조하여 결함을 잡아라. **결코 plan 본문만 보고 비평하지 말 것 — 반드시 SoT 파일을 직접 읽고 정합 검증**.

## 비평 운영 원칙

- 5사이클 고정이 아닌 **closeableAfterPatch 신호 누적 → 수렴** 기준
- 누계 지적 수가 줄어들고 closeableAfterPatch=true 비율이 높아지면 `ready_for_acceptance=true` 신호로 종결
- 본 monorepo 의 다른 plan 누계 패턴: cycle 1 약 25~45 finding (8 Feature spec 평균 ~71 · 인프라 v1.0 36 · M0 plan 28 · LL plan 25 · EAT plan 22 · public-site-render plan 21 · CA-M0 plan 28)
- **얕은 trivia (typo · 표 정렬 등) 보다 실질 결함을 우선** — SoT 불일치 · 알고리즘 hole · scope 분류 합리성 · 운영 시나리오 미커버 · 카탈로그 데이터 표 정확성 · 미결정 항목의 결정 정당성

## SoT (반드시 직접 읽고 검증)

본 monorepo working root 에서 직접 파일을 읽어 plan 과 대조한다.

### 본 plan 의 직접 대상 (SoT)
1. `docs/features/compliance-assistant.md` v1.0 — Feature spec
   - § 0 한 페이지 요약 · § 3 check() 단일 엔트리포인트 · § 4.1 빌드 파이프라인 9단계 · § 4.3 composite KSS · § 4.4 contextExceptions 알고리즘 · § 6 RiskInference 통합 · § 7 룰 카탈로그 로드 · § 8 캐시 (Phase Alpha 미합류)
2. `docs/compliance/RISK_LEVELS.md` v1.2
   - § 2 RiskInference (MAX 결합 + steps[]) · § 3 RiskRule 데이터 파일 (6파일 + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
3. `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
   - § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 (3.15 시행령 미존재 자리표시)
4. `docs/core/CONTENT_STANDARDS.md` v1.3
   - § 4.1 금지 표현 카탈로그 · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
5. `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — M0 stub 위치 + CA-DEFER 13~16 marker
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05·12 해소 대상
7. `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) · § 6.2 stale 처리 (Phase Beta) · § 9.1.1 알림 정책
8. `docs/core/PAGE_TYPES.md` — § 3 페이지별 슬롯 격상 조건 (P-006 slot 정합)
9. `docs/core/DATA_MODEL.md` — C-10 ComplianceRecord · C-04 Article (inlineRiskFlags) · C-12 FAQ · C-21 LocationProfile · C-16 LegalDocument · C-22 ArticleCategory · C-24 Publication · C-25 MediaAppearance

### 실 코드 (현재 상태)
10. `apps/web/src/lib/compliance/check.ts` (M0 stub — Phase Alpha 가 교체할 대상)
11. `apps/web/src/lib/compliance/types.ts` (Phase Alpha 에서 metadata 확장)
12. `apps/web/src/lib/compliance/server-actions.ts` (submitForReview · approveContent · rejectContent · publishContent — auto-gate 통합 대상)
13. `apps/web/src/lib/zod/eat-content-schema.ts` (FAQ statusSchema 변경 대상)
14. `apps/web/src/components/forms/FaqForm.tsx` (status field 제거 대상)
15. `packages/core-content/src/schema.ts` v0.5 — reviewQueueEntry table · queue_type enum · 6 entity status enum
16. `packages/core-content/migrations/C0015_review_queue_entry.sql` — partial UNIQUE 재정의 대상
17. `packages/core-content/migrations/C0016_status_unlock.sql` — FAQ DB CHECK 이미 해제 확인
18. `packages/migrations-runner/src/manifest.ts` — 19단계 (M0) → 20단계 (Phase Alpha) cascade
19. `packages/` 디렉토리 구조 — 신규 `packages/compliance-rules/` 위치 정합
20. `pnpm-workspace.yaml` · 루트 `package.json` · `tsconfig.base.json`

## Plan under review — 핵심 결정 20종

- **CA-CASCADE-01**: `data/compliance-rules/` 6 yaml + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
- **CA-META-01**: `meta.yaml` 안 `loadOrder.slotMatches[]` 카테고리 신규 (RISK_LEVELS § 3.4.1 cascade)
- **CA-RULES-01**: rules.medical-ad.yaml 안 18 canonical 룰 (§ 3.1~3.14 매핑 표)
- **CA-CORE-01**: rules.core.yaml 안 4 룰 (pressure-time-001 · event-fact-statement-001 · diagnosis-assertion-001 · body-type-claim-001)
- **CA-EXCEPTION-DATA-01**: 5 contextException (safety 2 · warning-message 2 · administrative 1)
- **CA-SLOT-DATA-01**: 2 slot (P-006-content-results · P-006-content-pricing) — `matchCondition.kind="field-non-empty"` 만
- **CA-PACKAGE-01**: `packages/compliance-rules/` 신규 패키지 + scripts/build.ts (yaml → dist/catalog.json 사전 변환)
- **CA-LOADER-02**: loadCatalog() + module-scope 메모리 캐시
- **CA-MATCHER-01**: 매칭 엔진 (regex/keyword/phrase/composite) + scope 일치
- **CA-COMPOSITE-01**: AND_IN_SENTENCE (KSS) · AND_IN_PARAGRAPH · AND_NEAR
- **CA-KSS-01**: v0.1 안 **fallback 정규식 만** + CA-DEFER-22 신설 (KSS 합류 Phase Beta defer)
- **CA-EXCEPTION-01**: contextExceptions 적용 — 같은 문장 (KSS 분리) 단위 + suppressedFindings audit 보존
- **CA-FLAG-01**: 5 inlineRiskFlags 추출 + 5.1.2 false-positive 완화 (LegalDocument · LocationProfile · Article notice)
- **CA-INFER-01**: RiskInference MAX 결합 + steps[] 추적
- **CA-VIRTUAL-01**: High 가상 finding 주입 + triggeredBy 판정 (steps[] 안 explicit 우선)
- **CA-AUTOGATE-01**: content-gate 큐 자동 진입 (review_queue_type enum ADD VALUE) — manual-review 큐 와 분리 운영
- **CA-PERSIST-01**: auto_check_result.extensions 안 풀명세 영속 (suppressedByContextExceptions · inlineRiskFlagsEvidence · riskInferenceSteps · ruleMatchStats)
- **CA-CHECK-01**: 9단계 풀 흐름 (check.ts 완전 재작성) + derivePageTypeId + priorReviewRequired 메타 검사 (§ 7.3)
- **CA-FAQ-01**: FAQ zod schema unlock + FaqForm status field 제거 (EC-DEFER-05 해소)
- **CA-VERSION-01**: catalogHash 산정 (6파일 정렬 SHA-256 + kssAvailable suffix)

§ 12 미결정 10종 (MA-Q01~10) 별도 명시.

## What to check (cycle 1)

### Plan SoT 합치
- compliance-assistant § 4.1 9단계 vs plan § 7.1 check() 단계 — 누락 단계 없는지 (특히 7~9 순서)
- compliance-assistant § 3.3 inferredRiskLevel 외부 입력 처리 vs plan § 7.1 외부 입력 신뢰 + 내부 재계산 MAX 결합 정합
- RISK_LEVELS § 2.3 RiskInference MAX 결합 vs plan § 10.1 알고리즘 (steps[] 추적 정합)
- RISK_LEVELS § 2.4 FLAG_LEVEL 표 (5종 모두 High) vs plan § 10 안 inlineFlagLevel 매핑
- RISK_LEVELS § 5.1.1 카테고리 SoT — `includes-effect-claim` 7 카테고리 안 plan § 2.3 안 매핑된 카테고리들 (특히 `보장 결합 강조`·`최상급`) 정확 매칭 검증 (MA-Q02)
- RISK_LEVELS § 5.1.2 false-positive 완화 vs plan § 8.2 — LegalDocument 는 check() 진입 자체 우회되는데 § 8.2 안 LegalDocument 매트릭스 dead code 가능성
- RISK_LEVELS § 6.1 High 가상 finding 트리거 + § 6.2 ArticleType override vs plan § 11
- RISK_LEVELS § 3.3 JSON Schema 검증 표 vs plan § 2.8 slot-matches 검증 — 7종 추가 항목 명세 누락 여부
- CONTENT_STANDARDS § 7.1 metadata 필드 vs plan § 8.3 신규 5 필드 (`reviewPolicy`·`mediaAttachments`·`legalDocumentType`·`locationProfileField`·`priorReviewRequired`·`priorReviewPassed`·`entityFields`) — CONTENT_STANDARDS cascade 정합
- CONTENT_STANDARDS § 7.2 Finding 메타 vs plan § 4.6 Finding 풀명세 — `triggeredBy` enum 4종 (static-rule·inferred·explicit·llm-assist) 일치
- CONTENT_STANDARDS § 7.4 RiskRule 스키마 (SimpleRiskRule + CompositeRiskRule) vs plan § 4.4 simple 매칭 + § 6 composite — `legalBasis[]` 필드 v1.1 cascade 정합
- MEDICAL_AD_COMPLIANCE_COMMON § 3.0 canonical RiskRule + legalBasis[] vs plan § 2.3 18 canonical 룰 표 — 각 호별 legalBasis 정확성

### 18 canonical 룰 정합 (가장 중요)
- 각 룰 ID 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$` kebab-case) 정합
- 각 룰의 severity 분류 정합 (특히 § 3.2 3유형 분리 · § 3.8 결합 룰 우선순위 · § 3.12 2단계 분리 · § 3.13 압박/사실 분리)
- 각 룰의 patternType 결정 정합 (regex vs composite vs keyword)
- 각 룰의 정규식 패턴 — 한국어 어휘 안전성 (word boundary · unicode flag · false-positive 가능성)
- composite 룰의 operands · logic · window 명세 완비성
- `unreviewed-ad-001` (§ 3.11) 의 별도 흐름 결정 (RuleCatalog 안 미등록 + check() 안 별도 검사) vs runtime-meta patternType 신설 trade-off (MA-Q07)
- `professional-assertion-standalone-001` (§ 3.8 단독 어휘) · `guarantee-composite-001` (§ 3.8 결합) · `supremacy-001` (§ 3.8 최상급) 의 3분리 정합성 (CONTENT_STANDARDS § 4.1 표 정합)

### Scope · CA-DEFER 정합
- 본 plan § 1.3 안 defer 항목 분류 — 캐시(CA-DEFER-04) 가 Phase Beta defer 인데 catalogHash 산정 (§ 3.4) 은 본 cycle 안 활성. catalogHash 가 cacheKey 의 핵심 입력 (compliance-assistant § 8.1) 임 — Phase Alpha 안 catalogHash 만 산정 + 캐시 활용 부재 의도 정합 검증
- CA-DEFER-17·18·19·22 신설 marker — 기존 M0_PLAN § 9 CA-DEFER-01~16 vs 본 plan § 1.3 4 신설 marker 정합. 신설 marker 가 어디로 합류 (Phase Beta · Phase Gamma 등) 정합
- `medical-law-tracking.yaml` baseline placeholder 1건만 채택 정당성 (CA-DEFER-19 신설) — Phase Beta 안 실 revision 추가 시 baseline 차감 운영 가능성 (MA-Q09)

### scope 일치 규칙 (CA-MATCHER 4.3)
- `field` scope 안 fieldPath 매칭이 v0.1 안 "body 전체 매칭" 으로 처리되는데 — RiskRule.scope 안 type="field" + contractId + fieldPath 가 본문 검사 단위 결정에 영향 없음 → 정합한지
- `block` scope 안 미사용 결정 정당성 — CONTENT_STANDARDS § 7.4 block 안 6종 (qa·list·table·callout·citation·media) 가 본 cycle 안 적용 안 됨 → 의료광고 룰 안 block 단위 정합성 영향
- `feature` scope 안 미사용 결정 — Feature contentType 합류 (CA-DEFER-16) 까지

### check() 9단계 흐름
- plan § 7.1 안 단계 5 (RiskRule 매칭) → 단계 6 (inlineRiskFlags 추출) 순서 정합 — `includes-effect-claim` 이 RiskRule 매칭 결과의 category 집합 기반이므로 순서 결정적
- 단계 8 RiskInference → 단계 9 High 가상 finding 주입 순서 정합 (compliance-assistant § 4.1 7단계)
- 단계 11 requiredApproverRoles 합집합 — plan § 11.2 안 finalRoles 계산 패턴 정합 (apps/web/src/lib/compliance/final-roles.ts 사용 명시)

### contextExceptions
- plan § 5.1 안 OR 결합 정합 (compliance-assistant § 4.4)
- plan § 5.2 안 "같은 문장" 계산 — KSS fallback 안 정규식 `[.!?](\s+|$)` 분리가 한국어 본문 안 정확한가 (한국어 종결 어미 `~다` · `~요` 안 마침표 없는 케이스 처리)
- plan § 5.3 suppressedFindings audit 보존 — auto_check_result.extensions 위치 정합. 어드민 UI 안 표시는 Phase Beta defer 명시 vs 본 cycle 안 운영자가 직접 보지 못함 risk

### composite KSS fallback
- plan § 6.5 안 KSS v0.1 안 미합류 결정 — compliance-assistant § 4.3 안 "KSS v3+ 채택" 이 SoT 의도인데 fallback 만으로 충분한가 (composite 정확도 운영 risk)
- fallback 정규식 `[.!?](\s+|$)` 가 한국어 문장 분리에 부적합 — 한국어는 마침표 없이 종결 어미로 분리 (`~다.` 다음 띄어쓰기 없이 다음 문장 시작 케이스)
- catalogHash 안 `kssAvailable=false` 영구 포함 결정 정합

### inlineRiskFlags 5종 (§ 8)
- plan § 8.1 안 추출 표 vs RISK_LEVELS § 5.1 표 정합 — 특히 `includes-pricing` 정규식 + 어휘 OR 결합 패턴
- `includes-testimonial` 의 composite 매칭이 RuleCatalog 안 정의 안 됨 — 본 cycle 안 어떻게 평가? plan § 8 안 명세 미완전
- `includes-effect-claim` 의 category 7 집합 안 매칭 시 — composite 룰의 category (예: `보장 결합 강조`) 이 RISK_LEVELS § 5.1 표 안 `전문성 단정 (효과·결과·보장 결합)` 와 정확 일치하는지 (단어 차이)

### slot-matches (§ 9)
- plan § 2.7 안 P-006 2 slot — PAGE_TYPES § 3 P-006 안 slot 표 정합 (slotId 명명 · pageTypeId · triggeredLevel)
- `matchCondition.kind="field-non-empty"` 만 v0.1 안 채택 — PAGE_TYPES § 3 안 slot 격상 조건이 본 단순 조건 만으로 표현 가능한가 (예: TreatmentPage.evidenceNotes 안 specific 어휘 검출 같은 body-regex 조건)
- TreatmentPage 의 `results` 필드 가 실제 schema 안 존재 검증 (DATA_MODEL C-09 TreatmentPage)
- `entityFields` 입력 메타가 호출자 (server-actions.ts) 안 어떻게 채워지는지 — 실 entity row 안 results · pricing 필드를 명시 추출하는 흐름 명세

### RiskInference (§ 10)
- plan § 10.2 PAGE_TYPE_BASE 표 — PAGE_TYPES § 3 SoT 와 정확 일치 (P-103 Facilities 안 Medium, P-104 News·Event 안 Low — event 카테고리 격상은 slotMatch/inlineRiskFlag 통해)
- P-014 LocationProfile 안 Low — DATA_MODEL C-21 정합
- P-103 Medium 표기 정합 vs RISK_LEVELS § 2.5 표 안 Medium
- P-106 Self-test 안 Medium vs 본 cycle 안 derivePageTypeId 매핑 부재 (Feature contentType — CA-DEFER-16) — Medium 등급은 의도 명확?

### High 가상 finding (§ 11)
- plan § 11.1 buildHighGateFinding 의 location {0,0} · pattern "(RiskLevel=High)" — RISK_LEVELS § 6.1 정합
- triggeredBy 판정 로직 (`determineTriggeredBy`) — RISK_LEVELS § 6.1 안 "explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)" 정합
- ArticleType override 표 — RISK_LEVELS § 6.2 표 정합 (effect-result-related → ['medical'] · review-case → ['medical', 'legal'] · event-price → ['legal'])

### auto-gate (§ 12)
- plan § 12.1 enqueueContentGateIfNeeded — partial UNIQUE 검사 정합 (queue_type 포함 unique index)
- plan § 12.2 호출 시점 — submitForReview 만 본 cycle 안 통합. saveArticle 안 자동 호출 부재 의도 정합 (운영자 명시 트리거 만)
- plan § 12.3 동시 큐 운영 — manual-review + content-gate 양 큐 open 시 발행 게이트 AND 조건 (REVIEW_WORKFLOW § 4 정합 vs 본 plan)
- priority · slaDueAt 정책 (§ 12.4) — REVIEW_WORKFLOW § 3 priority 정책 정합

### FAQ unlock (§ 13)
- EC-DEFER-05 해소 → FAQ 발행 정상화. zod schema unlock vs DB CHECK 이미 해제 (C0016)
- FAQ check() 입력 안 body = Q + A 결합 결정 정합 (CONTENT_STANDARDS § 7.1.1.2 FAQ Q/A 적용)
- pageTypeId='P-011' 자동 유도 정합 (PAGE_TYPES § 3 P-011)
- risk_level 자동 추론 — P-011 기본 Low + 본문 안 의료 어휘 → Medium/High 격상 케이스 정합

### autoCheckResult 영속 (§ 14)
- extensions 키 위치 — envelope.result 안 vs envelope.extensions 별도 영역 vs auto_check_result JSONB 안 (MA-Q04)
- CONTENT_STANDARDS § 7.2 SoT 7 필드 침해 없음 정합 — extensions 가 결과 본문 안 들어가는지 별도 영역인지 명확화

### content-gate 큐 enum 확장 (§ 15)
- C0017 migration — `ALTER TYPE ADD VALUE` 트랜잭션 분리 (Postgres 제약) — manifest 안 단독 step 정합
- partial UNIQUE 재정의 — DROP + CREATE 안 race condition (운영 중 enum 사용) 정합
- Drizzle schema v0.6 변경 — review_queue_entry partial UNIQUE 구현 정합

### docs cascade (CA-CASCADE 9종)
- 각 CA-CASCADE 가 정확한 SoT 문서 + § 위치 식별
- CA-CASCADE-04 EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 marker — 본 cycle 안 patch 위치 정확
- CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 — 정확한 marker 정합

### 시나리오 40건 (§ 16)
- 시나리오 23 안 "최상급" 매칭 → includes-effect-claim 미활성 검증 — 7 카테고리 안 최상급 미포함 결정 정합 (MA-Q02)
- 시나리오 24 안 "보장 결합 강조" 카테고리 정확 매핑 검증 필요
- 시나리오 30 안 slot P-006-content-results — slot-matches.yaml 안 정의 정합
- 시나리오 33 안 P-002 + 모든 입력 Low → Low (steps 1건) — RiskInference 알고리즘 정합
- 시나리오 35 안 idempotent 동작 — auto-gate 안 existing 반환 흐름 정합
- 시나리오 37 안 FAQ "100% 효과 보장" → guarantee-composite-001 매칭 — FAQ 입력 시 contentType='FAQ' + body 결합 정합

### 운영 시나리오 미커버
- catalog 로드 실패 시 — fail closed (모든 발행 차단) 결정 정당성 (MA-Q10) vs 운영 영향 (전체 발행 마비 가능성)
- catalogHash 변경 시 stale 미발생 (Phase Beta defer) — 새 룰 catalog 적용 시 기존 published 콘텐츠 자동 재검수 안 됨 → 운영 가설 (§ 1.4 2번) 정확성
- preset 부재 시 silent skip (MA-Q08) — InstanceManifest 안 preset 설정이 카탈로그 안 없으면 어떻게 인지하는가
- KSS fallback 의 false-suppress 가능성 — contextException 매칭 시 같은 문장 안 정확도 떨어짐 → 안전 권유 표현 false-positive 차단 안 됨 risk

### 미결정 10종 (MA-Q01~10)
- 각 미결정 항목의 결정 권장 여부 — 본 cycle 안 결정 가능 vs 별도 spec 필요

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAP-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): compliance-assistant § X · RISK_LEVELS § Y · MEDICAL_AD_COMPLIANCE_COMMON § Z 등
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
- CA-DEFER 5 phase 분류 정합: <PASS|FAIL>
- CA-CASCADE 9종 정합: <PASS|FAIL>

=== CYCLE SIGNAL ===
cycle: 1
total_findings: <NN>
blocking: <N>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: false
scope_narrow_acceptable: true|false
recommendation: "다음 cycle 진입 권장"
```

Plan ID prefix: **CAP** (Compliance-Assistant Phase-alpha). 가능한 한 광범위하게 보고, plan § 또는 file:line 인용. 한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것 (인사 · 결언 등 X).

codex
`seo-geo`가 아니라 직접 SoT 대조 리뷰 작업입니다. 먼저 plan과 지정 SoT/실코드를 읽어서 라인 기준으로 결함을 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/features/compliance-assistant.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/compliance/RISK_LEVELS.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/CONTENT_STANDARDS.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
 succeeded in 725ms:
# compliance-assistant Phase Alpha plan (draft·2026-05-19)

> **상태**: **v0.1 초안** — Codex 자동 비평 사이클 진입 대상. compliance-assistant M0 v1.0 acceptance (2026-05-18) 후속 첫 Phase Alpha plan.

> **scope marker** — CA-DEFER-01 (RuleCatalog yaml + check() 9단계 + composite/contextExceptions) · CA-DEFER-02 (RiskInference 자동 추론 — pageType/articleType/slot/inlineRiskFlags MAX) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입) 5종 해소. 캐시 (CA-DEFER-04) · warning 큐 (CA-DEFER-05) · LLM (CA-DEFER-03) · stale 큐 (CA-DEFER-06) · request-changes/delegate (CA-DEFER-07) 는 Phase Beta 합류.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec 본 plan 의 구현 대상.
  - § 3 check() 단일 엔트리포인트
  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
  - § 4.3 composite 평가 알고리즘 (KSS v3+)
  - § 4.4 contextExceptions 적용 알고리즘
  - § 6 RiskInference 통합
  - § 7 룰 카탈로그 로드 순서·머지
- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6파일 + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 (3.15 시행령 미존재 자리표시)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05 (FAQ 자동 검수) · EC-DEFER-12 (4 entity published 발행 — FAQ 한정 본 cycle 해소)
- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 6.2 stale 처리는 Phase Beta
- 실 코드 — `apps/web/src/lib/compliance/{check,types,risk,server-actions}.ts` · `apps/web/src/components/forms/FaqForm.tsx` · `apps/web/src/lib/zod/eat-content-schema.ts`

> **표기 규칙 (M0_PLAN 계승)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `auto_check_result` (DB) ↔ `autoCheckResult` (TS) · `inline_risk_flags` ↔ `inlineRiskFlags`.

---

## 1. 목적과 범위

### 1.1 목적

- **CA-DEFER-01 해소**: M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6파일 로드 + JSON Schema 검증 + RiskRule 매칭 + contextExceptions + composite (KSS v3+) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계.
- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리했음.
- **EC-DEFER-05 해소**: FAQ 자동 검수 — RiskRule + RiskInference 적용. `FaqForm.tsx` zod schema `z.enum(['draft'])` → 풀 9-state unlock + 어드민 published 발행 (EC-DEFER-12 부분 해소).
- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장.
- **CA-DEFER-15 해소**: `gateRequired=true` (content-gate finding 1+) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). 운영자 명시 submitForReview 트리거 없이 빌드/저장 흐름에서 자동 enqueue.
- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 전건 변환**: `rules.medical-ad.yaml` 안 § 3.1~3.14 각 호의 canonical RiskRule + legalBasis[] (3.15 제외).
- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 (자동 통과 콘텐츠) + (b) content-gate 큐 신뢰성 확보 (자동 매칭 신호) + (c) FAQ 발행 정상화.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| `data/compliance-rules/` 6파일 (CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책) |
| RuleCatalog 로더 + JSON Schema 검증 (CA-LOADER-01) | `packages/compliance-rules/` 신규 패키지 또는 `packages/core-content/src/compliance-rules/` 안. 로더는 dev 시 fs read + prod 시 빌드 시점 inline. Ajv (JSON Schema) 검증. fail 시 throw |
| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType/block/field/feature). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
| composite 평가 알고리즘 + KSS v3+ (CA-COMPOSITE-01) | AND_IN_SENTENCE (KSS 문장 분리) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). KSS는 npm `kss-js` 또는 동등 포팅. **fallback** — KSS 설치 실패·미지원 환경 시 정규식 `[.!?](\s+\|$)` (조잡, warning 로깅). KSS_FALLBACK_LOGGED catalog hash 결정성 영향 없음 (catalogHash 산정 시 KSS 활성 여부 포함) |
| contextExceptions 적용 (CA-EXCEPTION-01) | `context-exceptions.yaml` 안 `appliesTo.categories[]` 또는 `appliesTo.ruleIds[]` 매칭 finding 에 대해 — 같은 문장 (KSS 분리) 안 ContextException.pattern 매칭 시 finding 결과 제거. **audit 보존** — 제거된 finding 은 `auto_check_result.suppressedByContextExceptions[]` 안 보존 (CA-DEFER-11 풀명세 일부) |
| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category 7개 집합 기반 (룰 매칭 후 실행 — 순서 중요). 나머지 4종 = 본문 정규식/어휘 + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). 5.1.2 컨텍스트별 false-positive 완화 적용 (LegalDocument.documentType · LocationProfile 안내 필드 · Article articleType=notice — RiskLevel 격상만 제외 + flag 자체는 보존) |
| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` 추적 (`{source, sourceValue, level}[]`). 단계: base = pageType 기본 → articleType MAX → inlineRiskFlags MAX → slotMatches MAX → explicitRiskLevel MAX. 격하 금지 |
| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2). **`triggeredBy` 판정** — RiskInferenceResult.steps[] 안 High 등급에 가장 먼저 도달한 source 검사: `explicitRiskLevel === "High"` 가 그 source 면 `triggeredBy="explicit"`, 그 외 (pageType/articleType/slot/inlineRiskFlags) 면 `triggeredBy="inferred"` |
| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑 표 적용. 예: `contentType="Article"` → P-010 · `contentType="FAQ"` → P-011 · `contentType="TreatmentPage"` → P-006 · `contentType="LegalDocument"` → P-013 (이 케이스는 check() 진입 안 됨 — exempt). 유도 불가 시 throw `ComplianceConfigError` |
| `slotMatches[]` 계산 (CA-SLOT-01) | M0 stub 미사용. Phase Alpha — PAGE_TYPES § 3 안 슬롯 격상 조건 표를 RuleCatalog 와 별도 `data/compliance-rules/slot-matches.yaml` 안 정의 (slotId · 격상 RiskLevel · 매칭 조건). content body + metadata 안 매칭 평가 → `SlotMatch[]` 산출. **v0.1 안 P-006 slot 만** (P-101 reviews · P-102 pricing 는 페이지 기본 등급 자체가 High 이므로 slot 격상 무의미). 다른 페이지 slot 은 § 1.3 defer |
| `meta.yaml` catalogVersion + catalogHash 산정 (CA-VERSION-01) | `catalogVersion` = meta.yaml 본문 `catalogVersion` 필드 (예: `"1.0.0"`). `catalogHash` = 6 파일 (rules.core.yaml · rules.medical-ad.yaml · context-exceptions.yaml · medical-law-tracking.yaml · slot-matches.yaml · meta.yaml) 의 정렬 후 SHA-256 concat hash. 빌드 시 1회 산정 후 메모리 캐시. compliance_record.metadata 안 `catalogVersion` + `catalogHash` 양쪽 저장 (감사 추적) |
| autoCheckResult 영속 풀명세 (CA-PERSIST-01) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha 추가 — `findings[]` 안 각 Finding 풀 필드 + 추가 영역: `suppressedByContextExceptions[]` (제거된 finding) · `inlineRiskFlagsEvidence` (5종 flag 별 매칭 위치) · `riskInferenceSteps` (steps[]) · `ruleMatchStats` ({categoryCounts: ..., elapsedMs: ...}). 본 영역은 SoT 7 필드 외 — `auto_check_result` 안 `extensions` 객체 안 격리 (CONTENT_STANDARDS § 7.2 SoT 침해 없음 — 7 필드 + extensions 키). **DB 컬럼 추가 없음** (JSONB 이므로) |
| content-gate 자동 큐 진입 (CA-AUTOGATE-01) | `review_queue_entry.queue_type` enum 안 `'content-gate'` 추가 (M0 enum 은 `'manual-review'` 1종). `gateRequired=true` 시 manual-review 큐가 아닌 **content-gate 큐로 enqueue**. 단, **동일 contentRef 의 content-gate 큐 + manual-review 큐 동시 진입 가능** (운영자가 명시 submitForReview 한 큐 + 자동 룰 매칭 큐). resolve 시 양 큐 독립 처리. `compliance_record_id` 동일 reference |
| FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05) | `apps/web/src/lib/zod/eat-content-schema.ts` 안 FAQ status 풀 enum 활성화. FaqForm `name="status"` field 제거 (workflow action 통한 전이 만). FAQ check() 입력 시 — Q + A 결합 본문으로 본 cycle 룰 매칭. risk_level 자동 추론 (P-011 FAQ 페이지 + Q/A 안 의료 진단/처방 어휘 → Medium/High 가능). DB CHECK `faq_status_v01_limit` · `faq_published_at_null_v01` 은 이미 C0016 안에서 해제됨 — Phase Alpha 는 zod + 형식 unlock 만 |
| catalogHash 변경 시 stale 표시 (CA-STALE-01) | `staleScope.kind` 별 영향 published record `staleFlags.legal=true` 갱신은 **Phase Beta 합류** (CA-DEFER-06 의존). 본 cycle 은 `staleFlags` 갱신 hook 만 backend stub. `medical-law-tracking.yaml` revision ADD 시 — Phase Beta 가 실 stale 큐 처리. 본 cycle 은 단지 catalog 변경 marker 만 |
| Drizzle schema v0.6 (CA-SCHEMA-01) | `review_queue_entry.queue_type` enum 안 `'content-gate'` ADD VALUE + `review_queue_entry` 안 partial UNIQUE 정정 (open content-gate vs manual-review 동시 진입 허용 — `(instance_id, compliance_record_id, queue_type)` 정렬). M0 의 `(instance_id, compliance_record_id)` partial UNIQUE → `(instance_id, compliance_record_id, queue_type)` |
| C0017 migration (CA-MIGRATION-01) | `review_queue_entry_queue_type` enum ALTER `ADD VALUE 'content-gate'` + partial UNIQUE drop+create (queue_type 포함) |
| compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `loader.ts` (룰 카탈로그 로드 + JSON Schema 검증) + `matcher.ts` (RiskRule 매칭) + `composite.ts` (composite + KSS) + `inline-flags.ts` (5종 추출) + `risk-inference.ts` (자동 추론 + steps) + `slot-match.ts` (P-006 slot 평가) + `auto-gate.ts` (content-gate 자동 큐 enqueue) |
| RuleCatalog 패키지 분리 (CA-PACKAGE-01) | `packages/compliance-rules/` 신규 패키지 — yaml 6파일 + JSON Schema + 로더 + 산정 hash util. apps/web 외 nodejs runtime (CI/cli) 에서도 동일 카탈로그 로드. webpack/turbopack 안 fs 미지원 — 빌드 시 yaml → JSON inline 사전 변환 (build script). 단, dev 시 hot reload 필요 시 fs read fallback (NODE_ENV=development) |
| vitest scenarios 30+ 건 (CA-TEST-01) | 룰 매칭 14건 + composite KSS 4건 + contextExceptions 4건 + inlineRiskFlags 5건 + RiskInference 6건 + auto-gate 큐 진입 3건 + FAQ unlock 3건 + LegalDocument exempt 유지 1건. 본 cycle 시나리오는 § 12 풀명세 |
| docs cascade (CA-CASCADE-02~06) | RISK_LEVELS § 3 / compliance-assistant § 4 / EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 marker / REVIEW_WORKFLOW § 3 큐 enum 안 content-gate 활성화 marker / CONTENT_STANDARDS § 7.4 RiskRule legalBasis[] 검증 강화 marker (이미 v1.1 안 cascade 되었으나 본 cycle 안 실 데이터 검증) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
| LLM 보조 (synthetic ruleId · llmAssist invocations · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | Phase Beta | CA-DEFER-05 |
| stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 (`staleScope.kind` 별 영향 record 일괄 stale) | M1 Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 (in-review 유지 · 위임) | Phase Beta | CA-DEFER-07 |
| priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 | CA-DEFER-08 |
| client 검수자 (clientApprover) | Phase Beta | CA-DEFER-10 |
| MediaThresholdAssessment + mediaThresholdOperationalInput | analytics-reporting 본 구현 | CA-DEFER-09 |
| attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
| Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
| preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta | CA-DEFER-17 (신설) |
| P-101 Reviews · P-102 Pricing · P-104 Event 슬롯 격상 표 | Phase Beta (PAGE_TYPES § 3 slot 표 안정화 후) | CA-DEFER-18 (신설) |
| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 (2026-Q1 등) — sourceUrl · checkedBy · 영향 룰 ID | 본 cycle 안 **placeholder 1건** 만 (의료법 v0.0.0 baseline) — Phase Beta 에서 실 추적 시작 | CA-DEFER-19 (신설) |
| `slot-matches.yaml` 풀 슬롯 카탈로그 (PAGE_TYPES § 3 전건) | Phase Beta (PAGE_TYPES § 3 slot 표 안정화 후) | CA-DEFER-18 동반 |

### 1.4 본 cycle 의 운영 가설

1. **M0 stub → Phase Alpha 교체 시 기존 published 콘텐츠 영향 없음** — sentinel ComplianceRecord 안 `auto_check_result` 는 SoT 7 필드만이므로 풀명세 영역이 추가되어도 기존 row 영향 없음 (JSONB extensions key 추가 만).
2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
3. **FAQ 자동 검수 합류 후 기존 draft FAQ 영향 없음** — zod 안 published 허용은 새 FAQ 입력 시점부터. 기존 draft row 는 sentinel ComplianceRecord 가 이미 생성되어 있지 않음 (FAQ 는 sentinel backfill 대상이었으나 published 자체가 차단되어 있어 sentinel row 없음).
4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).

---

## 2. RuleCatalog 데이터 결정

### 2.1 `data/compliance-rules/` 6파일 배치 (CA-CASCADE-01)

```
data/compliance-rules/
├── meta.yaml                       # catalogVersion · loadOrder · medicalLawRevisionRef · files[]
├── rules.core.yaml                  # CONTENT_STANDARDS § 4.1 표 → RiskRule (Core 룰)
├── rules.medical-ad.yaml             # MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 → RiskRule (의료법 기반)
├── context-exceptions.yaml           # CONTENT_STANDARDS § 4.4 안전·주의·행정 문맥 예외
├── medical-law-tracking.yaml         # 의료법 개정 추적 (v0.0.0 baseline placeholder 1건)
├── slot-matches.yaml                 # PAGE_TYPES § 3 P-006 slot 격상 조건 (v0.1 P-006 만 — CA-SLOT-01)
└── schema.json                       # JSON Schema (RiskRule + ContextException + meta + medical-law-tracking + slot-matches)
```

위치 결정: **monorepo 루트 `data/compliance-rules/`** (특정 패키지 안 아님). 이유:
- 룰 데이터는 코드와 독립적인 영향력 (다양한 빌드 시점 + dev/admin 양쪽에서 동일 로드 필요)
- preset 파일이 추가될 때 — `data/compliance-rules/rules.preset-<presetSlug>.yaml` 자연 확장
- 패키지 안 아닌 루트 둠 → packages/compliance-rules/ 로더가 monorepo 루트 기준 fs read

### 2.2 `meta.yaml` 구조 (CA-META-01)

```yaml
catalogVersion: "1.0.0"
medicalLawRevisionRef: "v0.0.0-baseline"   # § 1.3 CA-DEFER-19 — Phase Beta 안 실 추적 시작
loadOrder:
  rules:
    - rules.core.yaml
    - rules.medical-ad.yaml
  contextExceptions:
    - context-exceptions.yaml
  tracking:
    - medical-law-tracking.yaml
  slotMatches:                              # CA-SLOT-01 — meta.yaml.loadOrder 안 신규 카테고리
    - slot-matches.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "의료법 제56조제2항 1~14호 룰 (15호 시행령 미존재)"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "0.0.0"
    description: "의료법 개정 추적 — baseline placeholder (실 추적은 Phase Beta · CA-DEFER-19)"
  slot-matches.yaml:
    version: "1.0.0"
    description: "PAGE_TYPES § 3 P-006 slot 격상 조건 (v0.1 P-006 한정 · CA-DEFER-18)"
```

> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증에 본 카테고리 추가 (CA-CASCADE-04).

### 2.3 `rules.medical-ad.yaml` 변환 매핑 (CA-RULES-01)

MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 각 호 → canonical RiskRule + legalBasis[] 패턴 (§ 3.0). 

**Phase Alpha v0.1 룰 수 (canonical 18종)**:

| § | 호 | RiskRule.id (canonical) | category | severity | patternType | legalBasis[] |
|---|---|---|---|---|---|---|
| 3.1 | 제1호 + 시행령 제1호 | `new-medical-technology-unevaluated-001` | `평가받지 아니한 신의료기술` | content-gate | regex | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
| 3.2 | 제2호 + 시행령 제2호 (3유형) | `testimonial-001` | `치료경험담 광고` | fail | composite (1인칭 + 효과 어휘 AND_IN_PARAGRAPH) | `["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]` |
| 3.2 | 제2호 단기 임상경력 | `short-clinical-experience-001` | `단기 임상경력 광고` | fail | regex (`(\d+)\s*개월\s*(임상\|경력)` + 6 이하 조건) | 동일 |
| 3.2 | 제2호 치료효과 단정 | `treatment-effect-assertion-001` | `치료효과 단정` | fail | regex (`반드시\s*효과`·`확실히\s*효과`·`100\s*%\s*효과`) | 동일 |
| 3.3 | 제3호 | `false-statement-001` | `거짓 진술` | content-gate | regex (`(국내\|세계)\s*(1위\|최초\|유일)` + 인용 부재 검사 — § 3.5 citation absence) | `["medical-law-art56-para2-no3"]` |
| 3.4 | 제4호 + 시행령 제4호 | `comparison-001` | `비교 표현` | fail | regex (`(타\|다른\|기존)\s*(병원\|의원\|치료법)` + `(보다\|대비)`) | `["medical-law-art56-para2-no4", "enforcement-decree-art23-para1-no4"]` |
| 3.5 | 제5호 | `defamation-001` | `비방 광고` | fail | keyword (`비효율`·`구식`·`낙후` + 타 기관 reference 컨텍스트) | `["medical-law-art56-para2-no5"]` |
| 3.6 | 제6호 + 시행령 제6호 | `before-after-photo-001` | `전후사진 노출` | content-gate | keyword (`전후`·`비포어 애프터`·`before/after`·`B/A`) | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
| 3.7 | 제7호 | `side-effect-missing-001` | `부작용 정보 누락` | warning | composite (treatment 어휘 + 부작용/금기 어휘 부재 — AND_IN_PARAGRAPH 역방향 평가) | `["medical-law-art56-para2-no7"]` |
| 3.8 | 제8호 + 시행령 제8호 | `supremacy-001` | `최상급` | fail | regex (`(최고의\|최저가\|최대\|최강\|1위\|국내\s*유일\|세계\s*최초\|세계\s*최고)`) | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
| 3.8 | (canonical 결합) | `guarantee-composite-001` | `보장 결합 강조` | fail | composite (`(100%\|반드시\|절대\|확실히)` + `(효과\|결과\|호전\|개선\|치유\|보장)` AND_IN_SENTENCE) | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` |
| 3.8 | (단독 어휘) | `professional-assertion-standalone-001` | `전문성 단정 (단독 어휘)` | content-gate | regex (`(절대\|반드시\|확실히\|100\s*%)` 단독) + contextExceptions (`safety`·`warning-message`·`administrative`) 적용 | 동일 |
| 3.9 | 제9호 | `false-credential-001` | `법적 근거 없는 자격·명칭` | fail | composite (`(명의\|박사\|전문의)` + 자격 검증 메타 부재) | `["medical-law-art56-para2-no9"]` |
| 3.10 | 제10호 | `editorial-format-ad-001` | `기사형 광고` | content-gate | composite (기자 명시 + 의료기관 광고 어휘) | `["medical-law-art56-para2-no10"]` |
| 3.11 | 제11호 | `unreviewed-ad-001` | `미심의 광고` | warning | `priorReviewRequired=true` + `priorReviewPassed!=true` 메타 검사 (rule 자체는 본문 매칭 아님 — runtime check) | `["medical-law-art56-para2-no11"]` |
| 3.12 | 제12호 + 시행령 제12호 (확정) | `foreign-patient-recruit-domestic-confirmed-001` | `외국인환자 유치 국내광고 (확정)` | fail | composite (한국어 본문 + `외국인 환자\|foreign patient` 어휘 + `의료관광\|메디컬 투어` 등) | `["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]` |
| 3.12 | 제12호 (불명확) | `foreign-patient-recruit-domestic-uncertain-001` | `외국인환자 유치 국내광고 (불명확)` | content-gate (`["legal"]`) | composite (다국어 페이지 메타 + 외국인 환자 어휘) | 동일 |
| 3.13 | 제13호 + 시행령 제13호 (압박형) | `non-covered-discount-pressure-001` | `비급여 할인 압박형` | fail | regex (`(지금만\|특가\|한정\|선착순\|오늘까지)` + 할인 어휘) | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
| 3.13 | 제13호 (사실 고지) | `non-covered-discount-misleading-001` | `비급여 할인 사실 고지` | content-gate (`["legal"]`) | regex (`\d+\s*%\s*할인` + 기간/대상 명시 부재 — 명시 시 정상) | 동일 |
| 3.14 | 제14호 + 시행령 제14호 | `award-endorsement-001` | `상장·인증·보증·추천` | content-gate (`["legal"]`) | composite (`(상장\|인증\|보증\|추천)` 어휘 + 가~라목 예외 카탈로그 매칭 부재) | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |

> **운영 가설**: 본 18종은 Phase Alpha v0.1 — 운영 누적으로 강화. § 3.11 `unreviewed-ad-001` 은 본문 매칭이 아닌 메타 검사 — RiskRule 안 `patternType="runtime-meta"` 신규 추가 또는 별도 룰 카테고리 분리 검토. **본 cycle 결정** — `patternType="runtime-meta"` 추가하지 않고 § 7.3 매칭 엔진 안 별도 흐름 (priorReviewRequired meta 검사) 으로 처리. RiskRule 카탈로그 안 미포함 — `MEDICAL_AD_COMPLIANCE_COMMON § 3.11` cascade 안 명시.

### 2.4 `rules.core.yaml` (CA-CORE-01)

CONTENT_STANDARDS § 4.1 표 안 의료법 영역 외 카테고리만 본 파일에 포함. § 3.8 결합 룰 (guarantee-composite-001 · supremacy-001 · professional-assertion-standalone-001) 은 rules.medical-ad.yaml 안 — Core 영역 안 중복 정의 회피.

**Phase Alpha v0.1 Core 룰 수 (canonical 4종)**:

| RiskRule.id | category | severity | patternType |
|---|---|---|---|
| `pressure-time-001` | `유인성 표현 (시간·수량 압박)` | fail | regex (`(지금만\|오늘까지\|기간\s*한정\|선착순\|특가\|한정)`) |
| `event-fact-statement-001` | `할인·이벤트 사실 안내` | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)` + scope=pageType: P-102/P-104/P-010-articleType=event-price 외) |
| `diagnosis-assertion-001` | `진단 단정` | fail | composite (자가 진단 유도 + 단정 어휘 — `(당신은\|당신의)` + `(병입니다\|확정\|확실)`) |
| `body-type-claim-001` | `체질·맞춤 과대 표현` | content-gate (`["medical"]`) | regex (`(당신만의\|당신의\s*체질에\s*완벽)`) |

### 2.5 `context-exceptions.yaml` (CA-EXCEPTION-DATA-01)

CONTENT_STANDARDS § 4.4 표를 그대로 변환:

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
sourceDocVersion: "1.3"

exceptions:
  - id: "safety-medical-consult-001"
    kind: "safety"
    pattern: '(반드시|꼭)\s*(의료진과\s*)?(상담|확인)하세요'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"

  - id: "safety-consult-before-001"
    kind: "safety"
    pattern: '복용\s*전\s*(반드시\s*)?확인'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "안전 권유"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"

  - id: "warning-contraindication-001"
    kind: "warning-message"
    pattern: '(절대\s*)?금기|복용\s*금지|사용\s*금지'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "안전 정보 안내"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"

  - id: "warning-caution-prefix-001"
    kind: "warning-message"
    pattern: '(주의|경고)\s*[:：]'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "주의·경고 안내"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"

  - id: "administrative-refund-001"
    kind: "administrative"
    pattern: '100\s*%\s*(환불\s*불가|환불\s*보증|예약\s*변경\s*불가)'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)", "보장 표현"]

 succeeded in 724ms:
# Core — 콘텐츠 작성 표준 (AEO·AI 스니펫·의료광고 표현)

> **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: Core가 생성·관리하는 콘텐츠의 작성 표준. AEO·AI 스니펫 친화 구조, 콘텐츠 블록 표준, 의료광고법 표현 가이드(금지·대체), 페이지 타입·ArticleType별 룰, compliance-assistant 인터페이스, 빌드 검증을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 표현 리스크 어휘 회피.
> **연관 문서**:
> - 페이지 타입 정의 → `core/PAGE_TYPES.md`
> - 데이터 계약 → `core/DATA_MODEL.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
> - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
> - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **콘텐츠 작성 표준 = 5개 영역**: 일반 규약(톤·문체) / AEO·AI 스니펫 친화 구조 / 콘텐츠 블록 표준 / 의료광고 표현 / 페이지·ArticleType별 룰.
- **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
- **빌드 검증**: 자체 룰 checker가 본 문서의 fail/warning/content-gate 룰을 적용. 외부 LLM 검수(compliance-assistant)는 별도.
- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
- 페이지 타입별 콘텐츠 슬롯·필수 블록은 `PAGE_TYPES.md`가 정의, 본 문서는 **각 슬롯에 들어가는 콘텐츠의 표현·구조 표준**을 다룬다.

---

## 1. 일반 규약

### 1.1 톤·문체

| 항목 | 표준 |
|---|---|
| 어조 | 정중·전문적·차분. 마케팅 과장형 X |
| 인칭 | 의료기관 = "저희"/"본원" / 환자 = "환자분"·"내원자" (3인칭은 신중) |
| 종결 | 평어체 금지. "-습니다·-입니다" 일관 |
| 감정 어휘 | 자제 ("기적·놀라운·혁신적" 등 X) |
| 의문문 | H2 헤딩으로만 사용 (AEO 친화), 본문에 빈번한 의문문 자제 |
| 영문 | 의료 전문 용어 영문 병기는 첫 등장 시 1회 (예: "비만(obesity)") |

### 1.2 언어

- 기본 `ko-KR` (SEARCH_STANDARDIZATION § 2.1 정합)
- 영문·중문 등 다국어는 `InternationalSupport.internationalLanguagePages[]` 활성화 시. 본 표준은 한국어 기준

### 1.3 콘텐츠 길이

| 페이지·블록 | 권장 길이 |
|---|---|
| PageMeta.description | 80~160자 (SEARCH_STANDARDIZATION § 2.1 정합) |
| PageMeta.title | 10~70자 |
| Article.headline | 1~120자 |
| Article.summary | 80~200자 |
| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
| TreatmentPage.summary | 50~160자 |
| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |

### 1.4 변경 정책

- 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
- 표현 룰 강화 (기존 콘텐츠 위반 가능): **MAJOR** (마이그레이션 가이드 필수)
- 페이지 타입별 룰 신설: MINOR
- 새 ArticleType 추가: MINOR

---

## 2. AEO·AI 스니펫 친화 구조

네이버 AI 사이트 브리핑·AI 스니펫·통합 랭킹 모델 시대의 핵심 — **답변 우선 배치 + 구조화 블록**.

### 2.1 답변 우선 배치 (Answer-First)

| 룰 | 레벨 | 적용 |
|---|---|---|
| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
| 페이지의 본질 질문 1개를 H1 또는 H2가 명시적으로 답변 | warning | P-006·P-008·P-010 |
| H2를 질문형으로 작성 (AEO 친화) | 권장 (silent) | P-010 Article, P-006/P-008 일부 섹션 |

**예시 (P-006 Treatment Detail 본문 시작)**:

```
[좋음]
한방 다이어트는 한약·약침·식이 상담을 결합한 4~12주의 비만 관리 프로그램입니다.
체질에 맞춘 한약 처방, 지방대사 약침, 1:1 식이 상담으로 구성되며, 평균 4주 단위로 진행 결과를 점검합니다.

[나쁨 — answer-first 위반]
다이어트는 누구에게나 어려운 과제입니다. 매년 새해마다 결심하지만 실패하는 경우가 많습니다. 그래서 본원은…
(답변이 한참 뒤로 밀림)
```

#### 2.1.1 answer-first 검사 대상 (Markdown AST)

빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:

1. Frontmatter 영역 제외 (YAML/TOML 헤더)
2. 페이지의 `<main>` 또는 첫 H1 노드 이후 영역만 대상
3. 다음 노드 종류는 **스킵** (메타·구조 노드):
   - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph

> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).

### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)

- **H1 페이지당 1개**. 페이지 주제 명시
- H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
- H3은 H2 하위 세부 단위
- H4 이하 자제 (AI 스니펫 추출 난이도 ↑)

| 룰 | 레벨 |
|---|---|
| H1 누락 또는 2개 이상 | fail |
| H2 위계 건너뜀 (H1 → H3) | warning |
| H4 이하 5회 초과 사용 | warning |

### 2.3 구조화 블록 의도적 혼합

본문에 다음을 의도적으로 섞어 배치하면 AI 스니펫 채택률 ↑:

| 블록 종류 | 형식 | AI 스니펫 추출 친화 |
|---|---|---|
| 문단형 답변 (1~2문장) | 일반 텍스트, H2 직후 | 문장형 스니펫 |
| 불릿 리스트 | `<ul><li>` 3~10개 | 리스트형 스니펫 |
| 번호 리스트 (단계·순서) | `<ol><li>` 3~10개 | 단계형 스니펫 |
| 표 (비교·항목) | `<table>` 2~5컬럼 | 표형 스니펫 |
| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
| 인용·근거 | `<blockquote>` + 출처 | 신뢰도 신호 |

| 룰 | 레벨 |
|---|---|
| P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
| 리스트 항목이 2개 이하인 `<ul>`/`<ol>` | warning (리스트 효과 약함) |
| 표가 1행만 있는 경우 | warning |

---

## 3. 콘텐츠 블록 표준

### 3.1 Q&A 블록

**구조**:
```markdown
**질문(Q)**: 한방 다이어트는 며칠 만에 효과가 나타나나요?

답변: 한방 다이어트의 효과 인지 시점은 개인의 체질·생활 습관·복약 순응도에 따라 다르며, 일반적으로 4주 단위로 변화를 점검합니다.
세부적으로는 한약 복용 1~2주차에 식욕 변화·소화 패턴 변화를, 4주차부터 체성분 변화 추세를 관찰합니다.
```

**책임 분리**:
- 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립

| 룰 | 레벨 |
|---|---|
| Q&A 블록의 질문이 의문문 아닌 경우 | warning |
| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |

### 3.2 리스트 (불릿·번호)

**용도별 선택**:
- 순서·인과 관계가 있으면 번호 리스트 (`<ol>`)
- 동등 항목 나열이면 불릿 리스트 (`<ul>`)

**룰**:
- 항목 길이 일관 (한 항목이 5줄 넘으면 별도 단락으로 분리 검토)
- 항목 시작 어휘 일관 (모두 명사형 또는 모두 동사형)

### 3.3 표 (Table)

**구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.

**용도**:
- 비교 (시술별·프로그램별 차이)
- 수치·범위 (소요 시간·횟수)
- 시간표 (진료시간·휴진 안내)

**위험도 주의**:
- 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
- 가격 비교표는 **High 위험** (§ 4 + P-102 정책)

### 3.4 콜아웃 (Callout / Note)

**종류**:
- `info` — 일반 안내 (Low 위험)
- `warning` — 주의사항 (Medium 권장)
- `disclaimer` — 의료 면책 (의료 정보 페이지에 권장)

**예시**:
```
⚠️ 본 페이지의 의료 정보는 일반적인 안내이며, 개별 환자의 진료를 대체하지 않습니다. 정확한 진단·치료는 의료진과 상담하세요.
```

### 3.5 인용·근거 (Citation)

논문·학회·공식 자료 인용 시:
- 인용 출처 명시 (학회지·발행연도·저자)
- 외부 URL은 가능한 경우 첨부
- `Article.embeddedMedia[type: citation]` 또는 본문 `<blockquote>` + 출처

**룰**:
- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
  - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
  - `<blockquote>` + 출처 텍스트 (학회·정부·논문명 패턴)
  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
  - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
- 위 판정 텍스트 + 인용 부재 → content-gate
- 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화

### 3.6 임베디드 미디어 (VideoObject 등)

- YouTube·Vimeo·외부 동영상 임베드
- `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)

---

## 4. 의료광고 표현 — 단일 SoT

본 문서의 **진실의 원본**. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.

### 4.1 금지 표현 (fail / content-gate)

| 카테고리 | 금지 표현 (예시) | 레벨 |
|---|---|---|
| **최상급** | "최고의·최저가·최대·최강·1위·국내 유일·세계 최초·세계 최고" | **fail** (콘텐츠 발행 차단) |
| **효과 단정** | "완치·100% 효과·반드시 효과·안전합니다·부작용 없음" | **fail** |
| **수치·기간 단정 (보장어 없음)** | "○○일 만에·○○주 만에·체중 ○○kg 감량 (수치·기간 단정, '보장'·'약속'·'반드시' 어휘 미포함)" | **content-gate** (의료진·법무 검수 필요) |
| **수치·기간 보장** | "○○kg 보장·○○일 안에 보장·○○주 약속" — 수치/기간 + 보장어 결합 | **fail** (보장 표현 통합 룰) |
| **비교 표현** | "타 병원보다·다른 의원보다·기존 ○○보다 우수" | **fail** |
| **유인성 표현** | "지금만·특가·한정·기간 한정·선착순·오늘까지" (시간·수량 압박형 환자 유인) | **fail** |
| **할인·이벤트 사실 안내** | "20% 할인 진행·○월 이벤트" (시간·수량 압박어 미포함, 사실 진술) | **content-gate** (의료광고법 환자 유인 해당 여부 법무 판정 필요. P-104·P-102에서만 허용) |
| **진단 단정** | "당신은 ○○병입니다·○○질환 확정" (자가 진단 유도 포함) | **fail** |
| **명의·권위 단정** | "최고의 명의·국내 1인자·전국 최다" | **fail** |
| **전문성 단정 (단독 어휘)** | "절대·반드시·확실히·100%" (효과·결과·보장 등 결과어와 결합되지 않은 단독 사용) | **content-gate** |
| **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
| **유명인 동원** | (의료법상 환자 유인) "○○○ 연예인이 받은" | **fail** |
| **보장 표현** | "효과 보장·결과 보장·만족 보장·재시술 무료" | **fail** |
| **체질·맞춤 과대 표현** | "당신만의 1:1 맞춤·당신의 체질에 완벽" | **content-gate** (한의 특유 표현 회색지대) |

> 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.

### 4.2 대체 표현

| 금지 표현 | 대체 표현 |
|---|---|
| "최고의 다이어트 한약" | "체질 기반 다이어트 한약 처방" |
| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
| "4주 만에 -10kg 보장" | "4주 단위로 진행 결과를 점검합니다. 변화 정도는 개인에 따라 다릅니다" |
| "타 병원보다 효과적" | (비교 자체 미사용) "본원의 진료 방식은 ○○입니다" |
| "지금 신청하시면 50% 할인" | (할인 미명시) "예약 안내는 ○○로 연락 바랍니다" |
| "유명인 ○○도 받은 시술" | (유명인 미언급) "본원 시술 사례는 ○○ 페이지에서 확인 가능합니다" — 단 후기·전후사진은 별도 ReviewPolicy 적용 |
| "효과 보장" | "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" |

### 4.3 후기·전후사진·가격 노출 — 별도 정책

 succeeded in 734ms:
# Feature — compliance-assistant

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `docs/admin/REVIEW_WORKFLOW.md`
> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. LLM API 키·민감 콘텐츠 처리 주의.
> **연관 문서**:
> - 입력·출력 인터페이스 SoT → `core/CONTENT_STANDARDS.md` § 7
> - 운영·룰 카탈로그·자동 추론 → `compliance/RISK_LEVELS.md`
> - 의료법 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 어드민 워크플로 통합 → `docs/admin/REVIEW_WORKFLOW.md`
> - 데이터 계약 ComplianceRecord → `core/DATA_MODEL.md` C-10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `compliance-assistant` (DATA_MODEL C-08 InstanceManifest.features[] 등록 — `name: "compliance-assistant"`)
- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
- **2 모드 운영**: (a) **빌드 모드** — CI 빌드 시점에 빠른 정적 룰 검사 (LLM 미사용). 결과를 ComplianceRecord에 기록, (b) **어드민 모드** — 어드민에서 콘텐츠 저장 시점에 LLM 보조 분석 추가 가능 (인간 검수 보조)
- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | CONTENT_STANDARDS § 7 cascade 동반 |
| RiskInference 알고리즘 변경 (강화) | **MAJOR** | RISK_LEVELS § 2 cascade |
| 정적 룰 checker 정정 (false-positive 감소) | PATCH | |
| LLM 보조 활성화 정책 변경 | MINOR | |
| LLM 프롬프트 템플릿 변경 | MINOR | (운영 정책 — 결과 결정성 영향 시 MAJOR) |
| 캐시 키 산정 로직 변경 | **MAJOR** | 기존 cache 무효화 |
| 운영 지표 항목 추가 | PATCH | |

### 1.2 SoT 원칙

- 입출력 인터페이스 SoT는 `CONTENT_STANDARDS.md` § 7 (본 문서는 구현)
- RiskRule 데이터·자동 추론 알고리즘 SoT는 `RISK_LEVELS.md` (본 문서는 적용)
- 의료법 카탈로그 SoT는 `MEDICAL_AD_COMPLIANCE_COMMON.md` (본 문서는 룰 로드만)
- 본 문서 = **구현·운영 SoT** (모드·캐시·LLM 보조·지표)

### 1.3 본 문서가 다루지 않는 영역

- 룰 데이터 자체 — `data/compliance-rules/` (RISK_LEVELS § 3 SoT)
- 검수자 화면·승인 흐름 — `admin/REVIEW_WORKFLOW.md`
- LLM 모델 선택·계약 — 운영 결정 (CA-01)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "compliance-assistant"      # DATA_MODEL C-08 features[].name과 동일
specVersion: "0.1"                # 본 문서 명세 버전 (안정판 도달 시 1.0)
coreRequiresMin: "1.0.0"          # Core 최소 버전
implementationKind: "node-module" # CI 빌드 + 어드민 통합 가능
activation:
  scope: "instance"               # 인스턴스별 활성화
  default: true                   # 기본 활성 — 의료기관 콘텐츠에 권장
  llmAssist:                      # LLM 보조 별도 활성화
    default: false
    requires: ["llm-api-key"]     # 구체 provider는 § 2.3 config.llmProvider로 명시
```

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `CONTENT_STANDARDS.md` § 7 | ComplianceCheckInput·Result 인터페이스 |
| `RISK_LEVELS.md` § 2 | RiskInference 알고리즘 |
| `RISK_LEVELS.md` § 3 | RiskRule 카탈로그 로드 |
| `RISK_LEVELS.md` § 5 | inlineRiskFlags 추출 |
| `DATA_MODEL.md` C-10 | ComplianceRecord 결과 기록 |
| `MEDICAL_AD_COMPLIANCE_COMMON.md` § 8 | 인용 가능 도메인 화이트리스트 |

### 2.3 InstanceManifest 통합

DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"           # 권장 default. 다른 provider 사용 시 명시 (CA-01)
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"  # 비밀 보관소 키 참조
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false
```

---

## 3. 입력·출력

### 3.1 입력 — ComplianceCheckInput (CONTENT_STANDARDS § 7.1)

```ts
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
   (RISK_LEVELS § 3.4 머지 알고리즘 정합. meta.yaml이 로드 계획의 기준)
2. JSON Schema 검증 — 룰 데이터 정합성 확인 (실패 시 fail)
3. ContextException[] 컬렉션 분리
4. RiskRule 매칭 실행:
   a. scope 일치 (pageType/articleType/block/field/feature/global)
   b. patternType별 매칭 (regex/keyword/phrase/composite — § 4.3·§ 4.4)
   c. contextExceptions 적용 (§ 4.4) — 예외 일치 finding 제거
   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
5. inlineRiskFlags 추출 (RISK_LEVELS § 5.1) — **flag별 산출 방식 분리**:
   - `includes-effect-claim`: § 4 RiskRule 매칭 결과의 `category` 집합 기반 (RiskRule 매칭 후 실행 — 순서 중요)
   - `includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`: 본문 정규식·어휘 매칭 + 부가 입력 평가 (`ReviewPolicy.beforeAfterPhotoAllowed`·후기 미디어 첨부 등 — RISK_LEVELS § 5.1 표)
   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
6. RiskInference 실행 (RISK_LEVELS § 2.3) — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합. § 5.1.2 컨텍스트별 false-positive 완화 적용
7. High 가상 finding 자동 주입 — 최종 `inferredRiskLevel === "High"` 시. Finding 채움 (CONTENT_STANDARDS § 7.1.2 / RISK_LEVELS § 6.1·§ 6.2 동기화):
   - `ruleId: "risk-level-high-gate"`
   - `category: "위험도 강제 검수"`
   - `pattern: "(RiskLevel=High)"`
   - `severity: "content-gate"`
   - `location: { start: 0, end: 0 }` (메타 — 콘텐츠 전체 의미)
   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
8. severity 집계 → ComplianceCheckResult 산출:
   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
   - `buildBlocked` = findings 중 fail 1+ 존재
   - `gateRequired` = findings 중 content-gate 1+ 존재
   - `hasWarnings` = findings 중 warning 1+ 존재
   - `automatedDecision` = block(fail) > gate(content-gate) > warn(warning) > pass (우선순위 흡수는 집계 수준에서만)
9. 결과를 어드민 또는 빌드 파이프라인에 반환 + ComplianceRecord(pre-publish)에 기록
```

### 4.6 Finding 메타 확장 (CONTENT_STANDARDS § 7.2 cascade)

CONTENT_STANDARDS § 7.2의 Finding 타입에 본 Feature 운영을 위한 메타 필드 cascade 추가:

```ts
type Finding = {
  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";  // 출처 추적
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // LLM 출처 시
};
```

> CONTENT_STANDARDS § 7.2의 Finding 타입에 `triggeredBy`·`llmAssistMeta` 필드 신설 cascade.

### 4.2 빌드 모드 vs 어드민 모드

| 영역 | 빌드 모드 (CI) | 어드민 모드 |
|---|---|---|
| 트리거 | CI 빌드 시 변경된 콘텐츠 + 전체 (옵션) | 어드민 콘텐츠 저장 시 |
| LLM 보조 | 미사용 (속도·결정성) | 옵션 활성화 시 사용 |
| 캐시 | 사용 (동일 hash + 룰 version → cache hit) | 사용 |
| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
| SLO | 콘텐츠 1개당 50ms (정적 룰만) | 콘텐츠 1개당 5초 (LLM 포함 시) |

### 4.3 composite 룰 평가 알고리즘

CompositeRiskRule (CONTENT_STANDARDS § 7.4):

```
1. operands[] 각각의 매칭 위치 (start, end) 산출 — character offset 기준 (UTF-16 code unit)

 succeeded in 748ms:
# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준

> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 RiskInferenceResult.steps 표준화)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 콘텐츠 표현 룰 SoT → `core/CONTENT_STANDARDS.md` (§ 4·§ 7)
> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
> - 페이지 타입별 위험도 기본값 → `core/PAGE_TYPES.md` (§ 3)
> - ArticleType별 위험도 기본값 → `core/CONTENT_STANDARDS.md` (§ 6)
> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
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
data/compliance-rules/
├── rules.core.yaml             # § 4.1 CONTENT_STANDARDS 표 → 데이터 변환 (Core 룰)
├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
├── rules.preset-<presetSlug>.yaml     # preset별 특유 표현. <presetSlug>은 `presets/<presetSlug>/` 디렉토리명과 동일 (kebab-case, 예: `hanui-clinic`)
├── context-exceptions.yaml     # CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그 (§ 3.4.3 스키마)
├── medical-law-tracking.yaml   # 의료법 개정 추적 (§ 7.1.2)
└── meta.yaml                   # 룰 카탈로그 메타데이터·버전 인덱스 (§ 3.4.1)
```

- 파일 단위 분리 — 변경 추적·diff 친화
- `meta.yaml`은 전체 카탈로그 버전·로드 순서·의존성을 인덱스

### 3.2 파일 포맷 — YAML + JSON Schema

YAML로 작성 (사람 가독·다중 라인 정규식 친화), 빌드 시 JSON Schema로 검증.

**예시 — `rules.core.yaml`**:

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.1"
sourceDocVersion: "1.0"

rules:
  - id: "supremacy-001"
    category: "최상급"
    pattern: '(최고의|최저가|최대|최강|1위|국내 유일|세계 최초|세계 최고)'
    patternType: "regex"
    severity: "fail"
    scope:
      - { type: "global" }
    rationale: "의료법 제56조 — 최상급 표현 금지"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"

  - id: "guarantee-composite-001"
    category: "보장 결합 강조"
    patternType: "composite"
    operands:
      - { pattern: '(100%|반드시|절대|확실히)', patternType: "regex" }
      - { pattern: '(효과|결과|호전|개선|치유|보장)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope:
      - { type: "global" }
    contextExceptions:
      - kind: "safety"
        pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    rationale: "의료법 제56조 + § 4.1 전문성 단정 + 보장 결합"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`

빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 RiskRule(SimpleRiskRule + CompositeRiskRule) 전체 스키마를 검증할 수 있어야 한다.

**기본 식별·메타**
| 검증 항목 | 룰 레벨 |
|---|---|
| `id` 중복 (전체 파일 합집합) | **fail** |
| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `category` 비어 있음 | **fail** |
| `version` SemVer 형식 위반 | **fail** |
| `createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `sourceDoc` URL/경로 형식 위반 | warning |
| `sourceDocVersion` SemVer 형식 위반 | warning |

**Simple/Composite 구분**
| 검증 항목 | 룰 레벨 |
|---|---|
| `patternType` enum 외 값 (`regex`·`keyword`·`phrase`·`composite`) | **fail** |
| Simple — `pattern` 누락 | **fail** |
| Simple — `pattern` regex 컴파일 실패 (`patternType="regex"` 시) | **fail** |
| Composite — `operands[]` 길이 < 2 | **fail** |
| Composite — `logic` enum 외 값 (`AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR`) | **fail** |
| Composite — `logic="AND_NEAR"` + `window` 누락 또는 ≤ 0 | **fail** |
| Composite — 각 `operands[].pattern` regex 컴파일 실패 | **fail** |

**severity·scope·roles**
| 검증 항목 | 룰 레벨 |
|---|---|
| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
| `scope[]` 빈 배열 | **fail** |
| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
| `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
| `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
| `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
| `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |
| `suggestion` 1,000자 초과 | warning |
| `exceptions[]` 항목 빈 문자열 | **fail** |
| `exceptions[]` 항목 regex 패턴인 경우 컴파일 실패 | **fail** |
| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
| `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |

**context-exceptions.yaml** (§ 3.4.3 스키마)
| 검증 항목 | 룰 레벨 |
|---|---|
| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
| `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `exceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `exceptions[].pattern` 누락 또는 빈 문자열 | **fail** |
| `exceptions[].pattern` regex 컴파일 실패 | **fail** |
| `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
| `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **fail** |
| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
| `exceptions[].version` SemVer 형식 위반 | **fail** |
| `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |

codex
초반부만으로도 몇 가지 불일치가 보입니다. 범위를 좁히지 않기 위해 나머지 SoT와 실제 코드 상태까지 훑어서 “계획이 구현 지시로 충분한가” 기준으로 분류하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md | ForEach-Object { $i++; if($_ -match '"'"'^##|''^###|CA-|MA-Q|slot|inlineRisk|RiskInference|content-gate|FAQ|extensions|C0017|scenario|시나리오'"'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md | ForEach-Object { $i++; if($_ -match '"'"'^## 3|''^### 3'"\\.|RiskRule|legalBasis|canonical|제[0-9]+호|unreviewed|guarantee|professional|discount|foreign'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { $i++; if($_ -match '"'"'^## 3|''^###|P-006|P-101|P-102|P-103|P-104|P-106|slot|슬롯|results|pricing|evidence'"'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; if($_ -match '"'"'^### C-(04|10|12|16|21|22|24|25)|inlineRiskFlags|ComplianceRecord|Article|FAQ|LocationProfile|LegalDocument|Publication|MediaAppearance|TreatmentPage|results|pricing'"'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 777ms:
23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
25: - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
26: - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
32: ### 1.1 필수 타입 (Core 표준 14종)
41: | P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
51: ### 1.2 선택 타입 (7종)
55: | P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
56: | P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
57: | P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
58: | P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
60: | P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
67: ### 2.1 헤딩 위계
73: ### 2.2 시맨틱 마크업
78: ### 2.3 메타 태그·robots·sitemap·canonical
82: ### 2.4 BreadcrumbList
85: ### 2.5 내부 링크 원칙
88: ### 2.6 AEO·AI 스니펫 친화
95: ## 3. 필수 페이지 타입 상세
97: ### P-001. Home
104: **정보 슬롯**:
120: ### P-002. About (병원 소개)
127: **정보 슬롯**:
150: ### P-003. Doctors List
157: **정보 슬롯**: 의료진 카드(이름·진료분야·간략 약력·사진) / 진료분야 필터·그룹(선택)
166: ### P-004. Doctor Profile
173: **정보 슬롯**:
194: ### P-005. Treatments List
201: **정보 슬롯**: 시술 카드(이름·간략 설명·대상) / 진료 분야 그룹(선택)
210: ### P-006. Treatment Detail
217: **정보 슬롯**:
231: 14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
237: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
247: **슬롯별 위험도 격상 조건**:
249: | 슬롯 | 기본 | 격상 조건 |
258: | 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
264: **컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.
268: ### P-007. Conditions List
275: **정보 슬롯**: 질환·증상 카드 / 분류 그룹(선택)
284: ### P-008. Condition Detail
291: **정보 슬롯**:
305: **레이아웃 변형**: P-006 동일
310: ### P-009. Articles List
317: **정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
328: ### P-010. Article Detail
335: **정보 슬롯**:
347: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 Article 신규 필드)
371: ### P-011. FAQ
378: **정보 슬롯**: 카테고리 그룹별 Q&A 쌍
396: ### P-012. Contact / Visit — Conversion Hub
403: **정보 슬롯**:
420: ### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
433: **정보 슬롯**:
452: ### P-014. Location / Branch Detail
459: **정보 슬롯**:
502: ### P-101. Reviews — High-risk commercial
509: **정보 슬롯**: ReviewPolicy에 따라 결정 — 일반적으로 후기 카드 / 정책 안내 / (등록 안내)
516: ### P-102. Pricing — High-risk commercial
519: **URL**: `/pricing`
520: **주 데이터 계약**: `PricingPage`
523: **정보 슬롯**: 진료 항목·간략 설명 / 가격(범위) / 비급여 명시 / 적용 조건 / 결제·환불 정책 / 문의
530: ### P-103. Facilities / Equipment
537: **정보 슬롯**: 진료 환경 개요 / 시설 카테고리 / 각 시설 사진·설명 / (해당 시) 장비 도입 사실·기본 사양 / 위생·관리 안내
544: ### P-104. News / Event (소식·이벤트)
551: **정보 슬롯**: 소식 목록 카드(제목·날짜·요약) / 카테고리(일반·이벤트·휴진)
564: ### P-105. Reservation
571: **정보 슬롯**: 예약 채널 안내 / 예약 가능 시간 / 진료 전 준비 / 변경·취소 / 응급 진료
578: ### P-106. Self-test / Quiz — Feature-backed optional page
586: **정보 슬롯**: 테스트 제목·목적 / 설계자 의료진 / 고지문 / 문항 / 결과 안내 / 결과 → 상담 CTA / 관련 콘텐츠
609: | P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
618: | P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
619: | P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
620: | P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
621: | P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
623: | P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |
636: | 6 | P-006 Treatment Detail | 1개 이상 |
673: | PT-10 | ~~Self-test 도입~~ | 해소 — P-106 |
675: | PT-12 | ~~P-106 Feature Module vs Core 페이지~~ | **v0.5 해소 — Feature-backed optional page로 결정** |
686: | 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
687: | 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
688: | 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
689: | 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |

 succeeded in 800ms:
7: > **목적**: 의료법(제56조·제57조)·시행령·의료광고심의 운영규정에 대한 실무 해석, 금지 항목 카탈로그(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격·한의 회색지대 운영 가이드, 인용 가능 외부 도메인 화이트리스트의 단일 SoT.
10: > - 운영 SoT — RiskLevel 자동 추론·RiskRule 카탈로그·ApproverRole → `compliance/RISK_LEVELS.md`
19: - **본 문서가 단일 SoT**: (1) 의료법 조문 인용·해석 (제56조·제57조·시행령 제23조·제24조), (2) 의료법 금지 항목과 RiskRule.id의 **법령→룰 매핑** (표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4. 본 문서는 법령 조문과 룰 ID의 연결 매핑만), (3) 사전심의 대상·면제 사유 판정 가이드, (4) 환자 후기·전후사진·가격 운영 가이드, (5) 한의 회색지대 가이드, (6) 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
22: - **데이터 파일과의 관계**: 본 문서 = 사람 가독 SoT, `data/compliance-rules/rules.medical-ad.yaml` = 기계 처리 SoT. 양자는 RiskRule.id로 1:1 또는 1:N 매핑
24:   - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyword>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성
25:   - 본 문서·`rules.medical-ad.yaml`은 RiskRule.id로 1:N 매핑 — 1개 법령 호에 여러 RiskRule 가능, 1개 RiskRule이 여러 법령 호 참조 가능 (§ 3 각 절의 RiskRule은 `legalBasis[]`로 복수 조문 인용)
38: | 새 금지 항목 추가 (개정 대응) | **MAJOR** | RiskRule cascade 필수 + `medical-law-tracking.yaml` revision 추가 |
40: | 인용 가능 도메인 화이트리스트 추가 | MINOR | RiskRule.medical-ad cascade 권장 |
50: | 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |
51: | RiskRule 기계 처리 데이터 | `data/compliance-rules/rules.medical-ad.yaml` |
59: - RiskRule 데이터 포맷·로드·머지 — `RISK_LEVELS.md` § 3
93: | 6호 | 수술 장면 등 직접적 시술 행위를 노출하는 광고 (시행령 제23조제1항제6호와 결합) | § 3.6 / § 6 |
119: | **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
120: | **제2항** | 제56조제2항제14호 라목의 **국제 인증 구체 범위** — WHO/ISQua 등 시행령이 정하는 국제 인증 | § 3.14 |
137: ## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑
139: 본 § 3은 의료법 제56조제2항 각 호와 `data/compliance-rules/rules.medical-ad.yaml`의 RiskRule을 매핑한다. **표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4가 SoT** — 본 § 3은 법령 조문과 룰 ID의 **연결 매핑 SoT**.
141: ### 3.0 canonical RiskRule + legalBasis[] 패턴
143: 동일 본문 표현이 여러 법령 호와 결합되는 경우, **canonical RiskRule 1개**만 정의하고 `legalBasis[]` 필드(또는 동등 메타)로 복수 조문을 인용한다. 동일 문구가 여러 RiskRule로 중복 매칭되어 finding이 부풀려지는 것을 회피.
147:   - canonical RiskRule: `guarantee-composite-001` (CompositeRiskRule, severity=fail)
148:   - `legalBasis: ["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]`
149: - 본 § 3 각 절은 카테고리 의미상 다른 호에 동일 표현 축이 보이더라도 RiskRule 자체는 canonical 1개로 정의. 본 § 3의 호별 절은 **법령 인용 매핑 SoT**일 뿐 RiskRule 정의 SoT 아님 (RiskRule 정의 SoT는 `rules.medical-ad.yaml`)
151: > CONTENT_STANDARDS § 7.4 RiskRule 스키마에 `legalBasis: string[]` 필드 cascade 필요 — RISK_LEVELS § 3.3 JSON Schema 검증에 항목 추가.
153: > RiskRule ID는 권장 형식 예시이며, 실제 ID는 `rules.medical-ad.yaml` 파일 작성 시 확정 (MA-06 참조).
155: ### 3.1 평가받지 아니한 신의료기술 광고 (제56조제2항제1호 + 시행령 제23조제1항제1호)
157: - **RiskRule (예시 ID)**: `new-medical-technology-unevaluated-001`
161: ### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)
163: 시행령 제23조제1항제2호는 본 호의 구체 기준으로 **3가지 유형**을 함께 다룬다:
165: - **RiskRule (예시 ID)**: `testimonial-001`, `short-clinical-experience-001`, `treatment-effect-assertion-001`
168: - **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
171: ### 3.3 거짓된 내용을 표시하는 광고 (제56조제2항제3호)
173: - **RiskRule (예시 ID)**: `false-statement-001`, `false-credential-001`
177: ### 3.4 비교 광고 (제56조제2항제4호 + 시행령 제23조제1항제4호)
179: - **RiskRule (예시 ID)**: `comparison-001`
184: ### 3.5 비방 광고 (제56조제2항제5호)
186: - **RiskRule (예시 ID)**: `defamation-001`
190: ### 3.6 수술 장면·환부 노출 광고 (제56조제2항제6호 + 시행령 제23조제1항제6호)
192: - **RiskRule (예시 ID)**: `graphic-procedure-001`, `before-after-photo-001`
197: ### 3.7 부작용 등 정보 누락 광고 (제56조제2항제7호)
199: - **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)
203: ### 3.8 사실 과장 광고 (제56조제2항제8호 + 시행령 제23조제1항제8호)
205: - **RiskRule (예시 ID)**: `exaggeration-001`, `effect-claim-001`, `guarantee-001`, `guarantee-composite-001`, `supremacy-001`
207: - **시행령 결합**: 시행령 제23조제1항제8호의 사실 과장 광고 구체 기준 (법 본문 호와 시행령 호 1:1 대응)
211: ### 3.9 법적 근거 없는 자격·명칭 광고 (제56조제2항제9호)
213: - **RiskRule (예시 ID)**: `false-credential-001`, `false-title-001`
217: ### 3.10 기사형 광고 (제56조제2항제10호)
219: - **RiskRule (예시 ID)**: `editorial-format-ad-001`
223: ### 3.11 미심의 광고 (제56조제2항제11호)
225: - **RiskRule (예시 ID)**: `unreviewed-ad-001`
229: ### 3.12 외국인환자 유치 국내광고 (제56조제2항제12호 + 시행령 제23조제1항제12호)
233: | 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 적용 조건 |
235: | 확정 | `foreign-patient-recruit-domestic-confirmed-001` | **fail** | (fail이므로 미적용 — § 3.3.1) | 국내광고 해당성이 명백 (예: 한국어로 외국인환자 유치 안내, 한국 내 SNS·전단지) |
236: | 불명확 | `foreign-patient-recruit-domestic-uncertain-001` | **content-gate** | `["legal"]` | 자사 외국어 페이지·다국어 콘텐츠 등 국내광고 해당성이 매체·방식상 모호 — 법무 판단 후 발행 |
241: ### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)
243: - **RiskRule (예시 ID)**: `non-covered-discount-misleading-001`, `non-covered-discount-pressure-001`
244: - **금지**: 비급여 진료비용의 할인·면제 광고로서 **소비자를 속이거나 잘못 알게 할 우려가 있는 방법** — 허위·불명확한 금액·대상·기간·범위 표시 (시행령 제23조제1항제13호 결합)
251: ### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)
253: - **RiskRule (예시 ID)**: `award-endorsement-001`, `false-award-001`, `false-endorsement-001`
258:   - **다목**. 다른 법령에 따라 받은 **인증·보증** 표시 (자격 표시는 별도 — 제56조제2항제9호 적용)
260: - 가~라목 인증을 광고에 사용할 때도 시행령 제23조제1항제14호의 구체 표현 기준 준수 필요
263: ### 3.15 시행령 위임 — 그 밖의 광고 (제56조제2항제15호)
265: - **현행 상태 (2026-05-14 기준)**: 시행령 제23조제1항이 제1호~제14호까지만 독립 금지 기준을 두므로 본 호에 직접 대응하는 **현행 독립 시행령 기준 없음**
266: - 본 § 3.15는 **개정 추적 자리표시** — 시행령 개정으로 신규 금지 기준 신설 시 본 절 cascade + RiskRule 추가
267: - 운영 RiskRule 미생성 상태 — 빌드 시 본 호 매핑 룰 없음 (정상)
335: - **의료법 제56조제2항제2호 — 환자에 관한 치료경험담 광고 금지**
361: - **의료법 제56조제2항제6호 + 시행령 제23조제1항제6호** — 수술 장면·환부 등 혐오감을 일으킬 수 있는 사진·영상 광고 금지
362: - 전후사진은 본 호의 시행령 결합 영역 (수술 장면·환부 노출에 해당될 수 있음) + 사실 과장(제8호)·치료경험담(제2호) 결합 리스크
372: - 시행령 제23조제1항제6호 (수술 장면·환부 등 혐오감 유발 사진·영상 광고 금지) 위반 부재
373: - 시행령 제23조제1항제2호 (치료효과 단정·치료경험담) 위반 부재
392: - **의료법 제56조제2항제13호** — 비급여 진료비용의 할인·면제 광고로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법 금지 (시행령 제23조제1항제13호 결합)
509: - 본 § 9 카테고리를 RiskRule로 변환 + override
524: ### 10.2 다국어 RiskRule 매핑
560: | `2026-Q2-medical-law-2026-04-07` | `의료법` | `["제56조 제2항", "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.kr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속 |
583: | MA-04 | 다국어 RiskRule 사전 실제 구축 | M3 다국어 단계 |
585: | MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.medical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |
606: | 2026-05-14 | v0.1 | 최초 작성 — 의료법 제56조·제57조 해석, 금지 항목 카탈로그 11종(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격 운영 가이드, 인용 가능 외부 도메인 화이트리스트 3계열(학회·정부·국제 학술), 한의 특유 표현 회색지대, 다국어 표현 가이드, 의료법 개정 이력 추적 표 |
607: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 3.12 외국인환자 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-keyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskRule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CONTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSON Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |
608: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
609: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
610: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |

 succeeded in 831ms:
5: > **scope marker** — CA-DEFER-01 (RuleCatalog yaml + check() 9단계 + composite/contextExceptions) · CA-DEFER-02 (RiskInference 자동 추론 — pageType/articleType/slot/inlineRiskFlags MAX) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입) 5종 해소. 캐시 (CA-DEFER-04) · warning 큐 (CA-DEFER-05) · LLM (CA-DEFER-03) · stale 큐 (CA-DEFER-06) · request-changes/delegate (CA-DEFER-07) 는 Phase Beta 합류.
7: ## SoT
11:   - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
14:   - § 6 RiskInference 통합
16: - `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6파일 + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
18: - `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
19: - `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
20: - `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05 (FAQ 자동 검수) · EC-DEFER-12 (4 entity published 발행 — FAQ 한정 본 cycle 해소)
21: - `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 6.2 stale 처리는 Phase Beta
22: - 실 코드 — `apps/web/src/lib/compliance/{check,types,risk,server-actions}.ts` · `apps/web/src/components/forms/FaqForm.tsx` · `apps/web/src/lib/zod/eat-content-schema.ts`
24: > **표기 규칙 (M0_PLAN 계승)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `auto_check_result` (DB) ↔ `autoCheckResult` (TS) · `inline_risk_flags` ↔ `inlineRiskFlags`.
28: ## 1. 목적과 범위
30: ### 1.1 목적
32: - **CA-DEFER-01 해소**: M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6파일 로드 + JSON Schema 검증 + RiskRule 매칭 + contextExceptions + composite (KSS v3+) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계.
33: - **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리했음.
34: - **EC-DEFER-05 해소**: FAQ 자동 검수 — RiskRule + RiskInference 적용. `FaqForm.tsx` zod schema `z.enum(['draft'])` → 풀 9-state unlock + 어드민 published 발행 (EC-DEFER-12 부분 해소).
35: - **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장.
36: - **CA-DEFER-15 해소**: `gateRequired=true` (content-gate finding 1+) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). 운영자 명시 submitForReview 트리거 없이 빌드/저장 흐름에서 자동 enqueue.
38: - **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 (자동 통과 콘텐츠) + (b) content-gate 큐 신뢰성 확보 (자동 매칭 신호) + (c) FAQ 발행 정상화.
40: ### 1.2 범위 (포함)
44: | `data/compliance-rules/` 6파일 (CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책) |
45: | RuleCatalog 로더 + JSON Schema 검증 (CA-LOADER-01) | `packages/compliance-rules/` 신규 패키지 또는 `packages/core-content/src/compliance-rules/` 안. 로더는 dev 시 fs read + prod 시 빌드 시점 inline. Ajv (JSON Schema) 검증. fail 시 throw |
46: | RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType/block/field/feature). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
47: | composite 평가 알고리즘 + KSS v3+ (CA-COMPOSITE-01) | AND_IN_SENTENCE (KSS 문장 분리) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). KSS는 npm `kss-js` 또는 동등 포팅. **fallback** — KSS 설치 실패·미지원 환경 시 정규식 `[.!?](\s+\|$)` (조잡, warning 로깅). KSS_FALLBACK_LOGGED catalog hash 결정성 영향 없음 (catalogHash 산정 시 KSS 활성 여부 포함) |
48: | contextExceptions 적용 (CA-EXCEPTION-01) | `context-exceptions.yaml` 안 `appliesTo.categories[]` 또는 `appliesTo.ruleIds[]` 매칭 finding 에 대해 — 같은 문장 (KSS 분리) 안 ContextException.pattern 매칭 시 finding 결과 제거. **audit 보존** — 제거된 finding 은 `auto_check_result.suppressedByContextExceptions[]` 안 보존 (CA-DEFER-11 풀명세 일부) |
49: | inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category 7개 집합 기반 (룰 매칭 후 실행 — 순서 중요). 나머지 4종 = 본문 정규식/어휘 + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). 5.1.2 컨텍스트별 false-positive 완화 적용 (LegalDocument.documentType · LocationProfile 안내 필드 · Article articleType=notice — RiskLevel 격상만 제외 + flag 자체는 보존) |
50: | RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` 추적 (`{source, sourceValue, level}[]`). 단계: base = pageType 기본 → articleType MAX → inlineRiskFlags MAX → slotMatches MAX → explicitRiskLevel MAX. 격하 금지 |
51: | High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2). **`triggeredBy` 판정** — RiskInferenceResult.steps[] 안 High 등급에 가장 먼저 도달한 source 검사: `explicitRiskLevel === "High"` 가 그 source 면 `triggeredBy="explicit"`, 그 외 (pageType/articleType/slot/inlineRiskFlags) 면 `triggeredBy="inferred"` |
52: | pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑 표 적용. 예: `contentType="Article"` → P-010 · `contentType="FAQ"` → P-011 · `contentType="TreatmentPage"` → P-006 · `contentType="LegalDocument"` → P-013 (이 케이스는 check() 진입 안 됨 — exempt). 유도 불가 시 throw `ComplianceConfigError` |
53: | `slotMatches[]` 계산 (CA-SLOT-01) | M0 stub 미사용. Phase Alpha — PAGE_TYPES § 3 안 슬롯 격상 조건 표를 RuleCatalog 와 별도 `data/compliance-rules/slot-matches.yaml` 안 정의 (slotId · 격상 RiskLevel · 매칭 조건). content body + metadata 안 매칭 평가 → `SlotMatch[]` 산출. **v0.1 안 P-006 slot 만** (P-101 reviews · P-102 pricing 는 페이지 기본 등급 자체가 High 이므로 slot 격상 무의미). 다른 페이지 slot 은 § 1.3 defer |
54: | `meta.yaml` catalogVersion + catalogHash 산정 (CA-VERSION-01) | `catalogVersion` = meta.yaml 본문 `catalogVersion` 필드 (예: `"1.0.0"`). `catalogHash` = 6 파일 (rules.core.yaml · rules.medical-ad.yaml · context-exceptions.yaml · medical-law-tracking.yaml · slot-matches.yaml · meta.yaml) 의 정렬 후 SHA-256 concat hash. 빌드 시 1회 산정 후 메모리 캐시. compliance_record.metadata 안 `catalogVersion` + `catalogHash` 양쪽 저장 (감사 추적) |
55: | autoCheckResult 영속 풀명세 (CA-PERSIST-01) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha 추가 — `findings[]` 안 각 Finding 풀 필드 + 추가 영역: `suppressedByContextExceptions[]` (제거된 finding) · `inlineRiskFlagsEvidence` (5종 flag 별 매칭 위치) · `riskInferenceSteps` (steps[]) · `ruleMatchStats` ({categoryCounts: ..., elapsedMs: ...}). 본 영역은 SoT 7 필드 외 — `auto_check_result` 안 `extensions` 객체 안 격리 (CONTENT_STANDARDS § 7.2 SoT 침해 없음 — 7 필드 + extensions 키). **DB 컬럼 추가 없음** (JSONB 이므로) |
56: | content-gate 자동 큐 진입 (CA-AUTOGATE-01) | `review_queue_entry.queue_type` enum 안 `'content-gate'` 추가 (M0 enum 은 `'manual-review'` 1종). `gateRequired=true` 시 manual-review 큐가 아닌 **content-gate 큐로 enqueue**. 단, **동일 contentRef 의 content-gate 큐 + manual-review 큐 동시 진입 가능** (운영자가 명시 submitForReview 한 큐 + 자동 룰 매칭 큐). resolve 시 양 큐 독립 처리. `compliance_record_id` 동일 reference |
57: | FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05) | `apps/web/src/lib/zod/eat-content-schema.ts` 안 FAQ status 풀 enum 활성화. FaqForm `name="status"` field 제거 (workflow action 통한 전이 만). FAQ check() 입력 시 — Q + A 결합 본문으로 본 cycle 룰 매칭. risk_level 자동 추론 (P-011 FAQ 페이지 + Q/A 안 의료 진단/처방 어휘 → Medium/High 가능). DB CHECK `faq_status_v01_limit` · `faq_published_at_null_v01` 은 이미 C0016 안에서 해제됨 — Phase Alpha 는 zod + 형식 unlock 만 |
58: | catalogHash 변경 시 stale 표시 (CA-STALE-01) | `staleScope.kind` 별 영향 published record `staleFlags.legal=true` 갱신은 **Phase Beta 합류** (CA-DEFER-06 의존). 본 cycle 은 `staleFlags` 갱신 hook 만 backend stub. `medical-law-tracking.yaml` revision ADD 시 — Phase Beta 가 실 stale 큐 처리. 본 cycle 은 단지 catalog 변경 marker 만 |
59: | Drizzle schema v0.6 (CA-SCHEMA-01) | `review_queue_entry.queue_type` enum 안 `'content-gate'` ADD VALUE + `review_queue_entry` 안 partial UNIQUE 정정 (open content-gate vs manual-review 동시 진입 허용 — `(instance_id, compliance_record_id, queue_type)` 정렬). M0 의 `(instance_id, compliance_record_id)` partial UNIQUE → `(instance_id, compliance_record_id, queue_type)` |
60: | C0017 migration (CA-MIGRATION-01) | `review_queue_entry_queue_type` enum ALTER `ADD VALUE 'content-gate'` + partial UNIQUE drop+create (queue_type 포함) |
61: | compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `loader.ts` (룰 카탈로그 로드 + JSON Schema 검증) + `matcher.ts` (RiskRule 매칭) + `composite.ts` (composite + KSS) + `inline-flags.ts` (5종 추출) + `risk-inference.ts` (자동 추론 + steps) + `slot-match.ts` (P-006 slot 평가) + `auto-gate.ts` (content-gate 자동 큐 enqueue) |
62: | RuleCatalog 패키지 분리 (CA-PACKAGE-01) | `packages/compliance-rules/` 신규 패키지 — yaml 6파일 + JSON Schema + 로더 + 산정 hash util. apps/web 외 nodejs runtime (CI/cli) 에서도 동일 카탈로그 로드. webpack/turbopack 안 fs 미지원 — 빌드 시 yaml → JSON inline 사전 변환 (build script). 단, dev 시 hot reload 필요 시 fs read fallback (NODE_ENV=development) |
63: | vitest scenarios 30+ 건 (CA-TEST-01) | 룰 매칭 14건 + composite KSS 4건 + contextExceptions 4건 + inlineRiskFlags 5건 + RiskInference 6건 + auto-gate 큐 진입 3건 + FAQ unlock 3건 + LegalDocument exempt 유지 1건. 본 cycle 시나리오는 § 12 풀명세 |
64: | docs cascade (CA-CASCADE-02~06) | RISK_LEVELS § 3 / compliance-assistant § 4 / EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 marker / REVIEW_WORKFLOW § 3 큐 enum 안 content-gate 활성화 marker / CONTENT_STANDARDS § 7.4 RiskRule legalBasis[] 검증 강화 marker (이미 v1.1 안 cascade 되었으나 본 cycle 안 실 데이터 검증) |
66: ### 1.3 비범위 (defer)
70: | 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
71: | LLM 보조 (synthetic ruleId · llmAssist invocations · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
72: | warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | Phase Beta | CA-DEFER-05 |
73: | stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 (`staleScope.kind` 별 영향 record 일괄 stale) | M1 Phase Beta | CA-DEFER-06 |
74: | request-changes / delegate 액션 (in-review 유지 · 위임) | Phase Beta | CA-DEFER-07 |
75: | priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 | CA-DEFER-08 |
76: | client 검수자 (clientApprover) | Phase Beta | CA-DEFER-10 |
77: | MediaThresholdAssessment + mediaThresholdOperationalInput | analytics-reporting 본 구현 | CA-DEFER-09 |
78: | attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
79: | Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
80: | preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta | CA-DEFER-17 (신설) |
81: | P-101 Reviews · P-102 Pricing · P-104 Event 슬롯 격상 표 | Phase Beta (PAGE_TYPES § 3 slot 표 안정화 후) | CA-DEFER-18 (신설) |
82: | `medical-law-tracking.yaml` 안 실 의료법 개정 항목 (2026-Q1 등) — sourceUrl · checkedBy · 영향 룰 ID | 본 cycle 안 **placeholder 1건** 만 (의료법 v0.0.0 baseline) — Phase Beta 에서 실 추적 시작 | CA-DEFER-19 (신설) |
83: | `slot-matches.yaml` 풀 슬롯 카탈로그 (PAGE_TYPES § 3 전건) | Phase Beta (PAGE_TYPES § 3 slot 표 안정화 후) | CA-DEFER-18 동반 |
85: ### 1.4 본 cycle 의 운영 가설
87: 1. **M0 stub → Phase Alpha 교체 시 기존 published 콘텐츠 영향 없음** — sentinel ComplianceRecord 안 `auto_check_result` 는 SoT 7 필드만이므로 풀명세 영역이 추가되어도 기존 row 영향 없음 (JSONB extensions key 추가 만).
88: 2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
89: 3. **FAQ 자동 검수 합류 후 기존 draft FAQ 영향 없음** — zod 안 published 허용은 새 FAQ 입력 시점부터. 기존 draft row 는 sentinel ComplianceRecord 가 이미 생성되어 있지 않음 (FAQ 는 sentinel backfill 대상이었으나 published 자체가 차단되어 있어 sentinel row 없음).
90: 4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).
94: ## 2. RuleCatalog 데이터 결정
96: ### 2.1 `data/compliance-rules/` 6파일 배치 (CA-CASCADE-01)
105: ├── slot-matches.yaml                 # PAGE_TYPES § 3 P-006 slot 격상 조건 (v0.1 P-006 만 — CA-SLOT-01)
106: └── schema.json                       # JSON Schema (RiskRule + ContextException + meta + medical-law-tracking + slot-matches)
114: ### 2.2 `meta.yaml` 구조 (CA-META-01)
118: medicalLawRevisionRef: "v0.0.0-baseline"   # § 1.3 CA-DEFER-19 — Phase Beta 안 실 추적 시작
127:   slotMatches:                              # CA-SLOT-01 — meta.yaml.loadOrder 안 신규 카테고리
128:     - slot-matches.yaml
141:     description: "의료법 개정 추적 — baseline placeholder (실 추적은 Phase Beta · CA-DEFER-19)"
142:   slot-matches.yaml:
144:     description: "PAGE_TYPES § 3 P-006 slot 격상 조건 (v0.1 P-006 한정 · CA-DEFER-18)"
147: > RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증에 본 카테고리 추가 (CA-CASCADE-04).
149: ### 2.3 `rules.medical-ad.yaml` 변환 매핑 (CA-RULES-01)
157: | 3.1 | 제1호 + 시행령 제1호 | `new-medical-technology-unevaluated-001` | `평가받지 아니한 신의료기술` | content-gate | regex | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
161: | 3.3 | 제3호 | `false-statement-001` | `거짓 진술` | content-gate | regex (`(국내\|세계)\s*(1위\|최초\|유일)` + 인용 부재 검사 — § 3.5 citation absence) | `["medical-law-art56-para2-no3"]` |
164: | 3.6 | 제6호 + 시행령 제6호 | `before-after-photo-001` | `전후사진 노출` | content-gate | keyword (`전후`·`비포어 애프터`·`before/after`·`B/A`) | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
168: | 3.8 | (단독 어휘) | `professional-assertion-standalone-001` | `전문성 단정 (단독 어휘)` | content-gate | regex (`(절대\|반드시\|확실히\|100\s*%)` 단독) + contextExceptions (`safety`·`warning-message`·`administrative`) 적용 | 동일 |
170: | 3.10 | 제10호 | `editorial-format-ad-001` | `기사형 광고` | content-gate | composite (기자 명시 + 의료기관 광고 어휘) | `["medical-law-art56-para2-no10"]` |
173: | 3.12 | 제12호 (불명확) | `foreign-patient-recruit-domestic-uncertain-001` | `외국인환자 유치 국내광고 (불명확)` | content-gate (`["legal"]`) | composite (다국어 페이지 메타 + 외국인 환자 어휘) | 동일 |
175: | 3.13 | 제13호 (사실 고지) | `non-covered-discount-misleading-001` | `비급여 할인 사실 고지` | content-gate (`["legal"]`) | regex (`\d+\s*%\s*할인` + 기간/대상 명시 부재 — 명시 시 정상) | 동일 |
176: | 3.14 | 제14호 + 시행령 제14호 | `award-endorsement-001` | `상장·인증·보증·추천` | content-gate (`["legal"]`) | composite (`(상장\|인증\|보증\|추천)` 어휘 + 가~라목 예외 카탈로그 매칭 부재) | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
180: ### 2.4 `rules.core.yaml` (CA-CORE-01)
189: | `event-fact-statement-001` | `할인·이벤트 사실 안내` | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)` + scope=pageType: P-102/P-104/P-010-articleType=event-price 외) |
191: | `body-type-claim-001` | `체질·맞춤 과대 표현` | content-gate (`["medical"]`) | regex (`(당신만의\|당신의\s*체질에\s*완벽)`) |
193: ### 2.5 `context-exceptions.yaml` (CA-EXCEPTION-DATA-01)
269: ### 2.6 `medical-law-tracking.yaml` baseline (CA-TRACKING-01)
288:     summary: "Phase Alpha baseline — 의료법 제56조제2항 1~14호 (15호 시행령 미존재). 실 개정 추적은 Phase Beta 시작 (CA-DEFER-19)."
291: ### 2.7 `slot-matches.yaml` (CA-SLOT-DATA-01)
293: PAGE_TYPES § 3 P-006 Treatment Detail slot 격상 조건 표 안 v0.1 채택 (P-006 만 — § 1.3 CA-DEFER-18):
300: slots:
301:   - slotId: "P-006-content-results"
312:   - slotId: "P-006-content-pricing"
326: ### 2.8 `schema.json` (CA-SCHEMA-JSON-01)
329: - `slot-matches.yaml` 검증 (slotId 형식 · pageTypeId enum · triggeredLevel enum · matchCondition 분기 검증)
330: - `meta.yaml.loadOrder.slotMatches[]` 카테고리 검증
336: ## 3. RuleCatalog 로더 결정
338: ### 3.1 패키지 분리 (CA-PACKAGE-01)
351: │   ├── inline-flags.ts    # 5종 inlineRiskFlag 추출
353: │   ├── slot-match.ts      # slot-matches.yaml 평가
355: │   └── types.ts           # SimpleRiskRule · CompositeRiskRule · ContextException · SlotMatch · etc.
360: ### 3.2 로더 동작 (CA-LOADER-02)
366:   slotMatches: SlotMatchDefinition[];
383: ### 3.3 빌드 시점 변환 (CA-BUILD-01)
390: ### 3.4 catalogHash 산정 (CA-VERSION-01 풀명세)
409: ## 4. RiskRule 매칭 엔진 결정 (CA-MATCHER-01)
411: ### 4.1 진입 시그니처
436: ### 4.2 매칭 순서
451: ### 4.3 scope 일치 규칙 (RISK_LEVELS § 7.4.1 + 본 cycle 정합)
456: - `field` → input.contractId === scope.contractId. **fieldPath 매칭은 v0.1 안 미사용** (body 전체 매칭 — fieldPath 단위 매칭은 Phase Beta CA-DEFER-20 신설)
457: - `block` → **v0.1 안 미사용** (block 분리 안 미구현 — Phase Beta CA-DEFER-21)
461: ### 4.4 simple 매칭
477: ### 4.5 severity 우선순위 (CONTENT_STANDARDS § 7.4.2)
480: fail > content-gate > warning > info
487: ### 4.6 Finding 메타 풀명세 (CA-PERSIST-01 정합)
496:   severity: "info" | "warning" | "fail" | "content-gate";
510: ## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01)
512: ### 5.1 매칭 동작 (compliance-assistant § 4.4)
528: ### 5.2 "같은 문장" 계산 (KSS v3+ 의존)
534: ### 5.3 audit 보존 (CA-PERSIST-01 정합)
536: - 제거된 finding 은 `auto_check_result.extensions.suppressedByContextExceptions[]` 안 보존
542: ## 6. composite + KSS v3+ 평가 (CA-COMPOSITE-01)
544: ### 6.1 알고리즘 (compliance-assistant § 4.3)
558: ### 6.2 AND_IN_SENTENCE
564: ### 6.3 AND_IN_PARAGRAPH
569: ### 6.4 AND_NEAR
575: ### 6.5 KSS wrapper (CA-KSS-01)
608: - 자체 포팅 (`packages/kss-port/`) — Phase Beta CA-DEFER-22 (KSS 정확도 운영 누적 후)
610: **v0.1 결정** — fallback 정규식 만 사용 + KSS 합류 marker (CA-DEFER-22 신설). compliance-assistant § 4.3 안 "KSS v3+ 채택" 은 SoT 의도일 뿐, v0.1 실 구현은 fallback. catalogHash 안 `kssAvailable=false` 영구 (v0.1 안). Phase Beta 안 KSS 합류 시 catalogHash 자연 변경.
612: > **§ 12 미결정 MA-Q01**: KSS 합류 시점 — Phase Alpha 본 cycle 안 합류 vs Phase Beta defer. Codex 비평 안 결정 권장.
616: ## 7. check() 9단계 풀 흐름 (CA-CHECK-01)
618: ### 7.1 새 시그니처
630:   // 2. pageTypeId 유도 (CA-PAGEMETA-01)
650:   // 6. inlineRiskFlags 추출 (§ 8)
660:   // 7. slotMatches 계산 (§ 9)
661:   const slotMatches = evaluateSlots(input, catalog.slotMatches);
663:   // 8. RiskInference (§ 10)
667:     inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
668:     slotMatches,
704:     // CA-PERSIST-01 — extensions 안 풀명세
705:     extensions: {
707:       inlineRiskFlagsEvidence: inlineFlagResult.evidence,
708:       riskInferenceSteps: inference.steps,
718: > **`ComplianceCheckEnvelope` 타입 확장** — `extensions?` 옵셔널 필드 추가. CONTENT_STANDARDS § 7.2 SoT 7 필드 침해 없음 (envelope.result 안은 그대로 + envelope.extensions 별도 영역).
720: ### 7.2 `derivePageTypeId` 매핑
727:     'FAQ': 'P-011',
741:     'Feature': undefined,  // CA-DEFER-16
747: ### 7.3 `priorReviewRequired` 메타 검사 (CA-RULES-01 § 3.11)
767: `ComplianceCheckInput.metadata` 안 `priorReviewRequired` · `priorReviewPassed` 필드 신규. M0 stub 안 미사용. Phase Alpha 안 input 메타로 운영자가 전달 — CA-DEFER-08 (자동 산정) 까지 어드민이 명시 설정. **본 cycle 안 zod schema 안 default false** — 명시 입력 없으면 검사 skip.
771: ## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01)
773: ### 8.1 추출 표 (RISK_LEVELS § 5.1)
783: ### 8.2 false-positive 완화 (RISK_LEVELS § 5.1.2)
794: **RiskLevel 격상만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사 정보 보존).
796: ### 8.3 `includes-before-after` 부가 입력
805:   legalDocumentType?: 'privacy' | 'terms' | 'non-covered' | 'refund' | 'complaint' | 'cookie' | 'other';  // CA-FLAG false-positive
806:   locationProfileField?: 'branchDescription' | 'transportInfo' | 'parkingInfo';  // CA-FLAG false-positive
814: ### 8.4 evidence 보존
817: type InlineRiskExtractionResult = {
818:   inlineRiskFlags: InlineRiskFlag[];
820:     [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
825: `autoCheckResult.extensions.inlineRiskFlagsEvidence` 안 영속 (어드민 UI 위치 하이라이트 — Phase Beta).
829: ## 9. slotMatches 평가 (CA-SLOT-01)
831: ### 9.1 매칭 동작
834: function evaluateSlots(input: ComplianceCheckInput, slots: SlotMatchDefinition[]): SlotMatch[] {
835:   const matches: SlotMatch[] = [];
836:   for (const slot of slots) {
837:     if (slot.pageTypeId !== input.metadata.pageTypeId) continue;
838:     if (matchSlotCondition(input, slot.matchCondition)) {
839:       matches.push({ pageTypeId: slot.pageTypeId, slotId: slot.slotId, triggeredLevel: slot.triggeredLevel });
845: function matchSlotCondition(input: ComplianceCheckInput, cond: { kind: 'field-non-empty'; fieldPath: string }): boolean {
854: ### 9.2 입력 확장
859:   entityFields?: Record<string, unknown>;  // slot 평가용 (TreatmentPage.results 등)
867: ## 10. RiskInference 자동 추론 (CA-INFER-01)
869: ### 10.1 알고리즘 (RISK_LEVELS § 2.3 그대로)
872: export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
885:   for (const flag of input.inlineRiskFlags) {
889:       steps.push({ source: 'inlineRiskFlag', sourceValue: flag, level: flagLevel });
893:   for (const slotMatch of input.slotMatches) {
894:     if (riskHigher(slotMatch.triggeredLevel, base)) {
895:       base = slotMatch.triggeredLevel;
896:       steps.push({ source: 'slotMatch', sourceValue: slotMatch.slotId, level: slotMatch.triggeredLevel });
910: ### 10.2 base 등급 표
934: > PAGE_TYPES § 3 cascade — 본 표는 캐시. PAGE_TYPES 변경 시 본 표 cascade. P-104 안 event 카테고리 격상은 slotMatch 또는 inlineRiskFlag (includes-event) 안 자연 격상.
936: ### 10.3 RiskInferenceResult.steps[] 저장
938: `autoCheckResult.extensions.riskInferenceSteps` 안 영속. triggeredBy 판정에 사용 — High 가상 finding 안 가장 먼저 High 도달한 source 가 `explicitRiskLevel` 이면 `"explicit"`, 그 외면 `"inferred"`.
942: ## 11. High 가상 finding 주입 (CA-VIRTUAL-01)
944: ### 11.1 finding 정의
947: function buildHighGateFinding(input: ComplianceCheckInput, inference: RiskInferenceResult): Finding {
954:     severity: 'content-gate',
962: function determineTriggeredBy(input: ComplianceCheckInput, inference: RiskInferenceResult): 'explicit' | 'inferred' {
979: ### 11.2 requiredApproverRoles 합집합
985: ## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 = CA-DEFER-15 해소)
987: ### 12.1 동작
998:   // content-gate 큐 partial UNIQUE 검사 (open content-gate 1개만)
1003:       AND queue_type = 'content-gate'
1012:     VALUES (${entryId}, ${ctx.instanceId}, ${recordId}, 'content-gate', 'open',
1017:   await emitAuditEvent('content-gate-auto-enqueued', { recordId, entryId, finalRoles: envelope.result.requiredApproverRoles });
1022: ### 12.2 호출 시점
1024: - `submitForReview` action 안 — content-gate 큐 동시 진입 (manual-review 큐 와 별개)
1027: ### 12.3 큐 동시 진입 운영
1029: - 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
1030: - approve 시 — 각 큐 독립 (manual-review 의 operator approve · content-gate 의 medical/legal approve)
1034: ### 12.4 priority · slaDueAt 정책
1042: ## 13. FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 해소)
1044: ### 13.1 zod schema 변경
1049: const faqStatusSchema = z.enum(['draft']);
1051: const faqStatusSchema = contentPublicationStatusSchema;  // 9-state 풀 enum
1054: ### 13.2 FaqForm.tsx 변경
1058: - DB CHECK `faq_status_v01_limit`·`faq_published_at_null_v01` 는 이미 C0016 안 해제됨 — Phase Alpha 안 추가 patch 없음
1060: ### 13.3 FAQ check() 입력
1062: - `contentType='FAQ'`
1065: - `articleType` 미지정 (FAQ 는 ArticleType N/A)
1066: - risk_level 자동 추론 — P-011 기본 Low + Q/A 안 의료 진단/처방 어휘 → Medium/High 가능 (룰 매칭 + inlineRiskFlags + RiskInference)
1068: ### 13.4 EC-DEFER-12 부분 해소
1070: FAQ published 발행 정상화. Publication · MediaAppearance 는 본 cycle 안 unlock 안 함 — 외부 인용 entity 라 룰 적용 면제 (CONTENT_STANDARDS § 7.1.1.2). Phase Beta 안 별도 unlock 결정.
1074: ## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소)
1076: ### 14.1 `auto_check_result` JSONB 구조
1085:   "findingsBySeverity": { "fail": 0, "content-gate": 1, "warning": 0, "info": 0 },
1100:   // CA-PERSIST-01 — extensions (SoT 침해 없음)
1101:   "extensions": {
1105:     "inlineRiskFlagsEvidence": {
1108:     "riskInferenceSteps": [
1120: ### 14.2 DB 컬럼 영향
1122: `compliance_record.auto_check_result` 는 JSONB — 컬럼 ADD 없음. M0 stub 안 SoT 7 필드만 저장하던 row 도 extensions 키 부재일 뿐 — Phase Alpha row 와 함께 공존 가능. 어드민 UI 안 extensions key 가 없으면 기본값 처리.
1124: ### 14.3 sentinel ComplianceRecord 영향
1126: M0 안 backfill 된 sentinel row 안 `auto_check_result` 는 `findings: []` · gateRequired=false. Phase Alpha 안 extensions 미부착. 운영자가 sentinel row 를 직접 update 할 일 없음 — 새 콘텐츠 publish 시 자동 새 record_version 생성되므로 sentinel 은 historical 영구 보존.
1130: ## 15. content-gate 큐 enum 확장 (CA-SCHEMA-01)
1132: ### 15.1 C0017 migration
1135: -- packages/core-content/migrations/C0017_content_gate_queue.sql
1136: -- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01
1138: -- 1. queue_type enum 안 'content-gate' ADD VALUE
1139: ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
1149: ### 15.2 Drizzle schema v0.6 변경
1152: - `reviewQueueType` enum 안 `'content-gate'` 추가
1155: ### 15.3 manifest 20단계
1157: 기존 19단계 + C0017 = 20단계. `packages/migrations-runner/src/manifest.ts` 안 추가.
1161: ## 16. 시나리오 cascade (CA-TEST-01)
1163: ### 16.1 룰 매칭 (14건)
1165: | # | 시나리오 | 통과 기준 |
1170: | 4 | "절대 효과" 본문 → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' (fail 우선) |
1173: | 7 | "20% 할인 진행" 본문 + scope=Article articleType=general-medical-info → event-fact-statement-001 매칭 (content-gate, legal 필요) | severity='content-gate' · requiredApproverRoles=['legal'] |
1176: | 10 | "전후사진" 본문 + ReviewPolicy.beforeAfterPhotoAllowed=false → before-after-photo-001 매칭 (content-gate) | severity='content-gate' |
1178: | 12 | 다국어 페이지 메타 + "foreign patient" 본문 → foreign-patient-recruit-domestic-uncertain-001 매칭 (content-gate · legal) | severity='content-gate' · requiredApproverRoles=['legal'] |
1180: | 14 | "당신의 체질에 완벽" 본문 → body-type-claim-001 매칭 (content-gate · medical) | severity='content-gate' |
1182: ### 16.2 composite KSS (4건)
1184: | # | 시나리오 | 통과 기준 |
1191: ### 16.3 contextExceptions (4건)
1193: | # | 시나리오 | 통과 기준 |
1200: ### 16.4 inlineRiskFlags (5건)
1202: | # | 시나리오 | 통과 기준 |
1205: | 24 | "100% 효과" 매칭 (guarantee-composite-001) → includes-effect-claim flag 활성 (category=`보장 결합 강조` — 7 카테고리 안 포함 검증 필요. **현재 § 5.1 7 카테고리 안 정확 매핑 일치 필요**) | **§ 12 미결정 MA-Q02** — § 5.1 includes-effect-claim 7 카테고리 안 `보장 결합 강조` 포함 여부. 명시 정합 검증 + § 5.1.1 카테고리 SoT cascade 정합 필요 |
1206: | 25 | "20% 할인" 본문 + LegalDocument.documentType=refund → includes-event 추출 + RiskLevel 격상 제외 (§ 5.1.2) | inlineRiskFlags 안 includes-event 포함 · 격상 안 됨 |
1207: | 26 | "전후" 본문 → includes-before-after 활성 | inlineRiskFlags=['includes-before-after'] |
1210: ### 16.5 RiskInference (6건)
1212: | # | 시나리오 | 통과 기준 |
1216: | 30 | P-006 + slot P-006-content-results 매칭 → High | inferredRiskLevel='High' · steps 안 slotMatch source |
1217: | 31 | P-002 + inlineRiskFlags=[includes-pricing] → High | flag MAX 결합 |
1221: ### 16.6 auto-gate 큐 진입 (3건)
1223: | # | 시나리오 | 통과 기준 |
1225: | 34 | High 가상 finding 주입 시 enqueueContentGateIfNeeded → content-gate 큐 1행 INSERT | queue_type='content-gate' · priority='P1' |
1229: ### 16.7 FAQ unlock (3건)
1231: | # | 시나리오 | 통과 기준 |
1233: | 37 | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 (severity=fail) + includes-effect-claim flag + RiskInference High 가상 finding | findings.length=2 · automatedDecision='block' |
1234: | 38 | FAQ "진료 시간 안내" Q + "주 5일 운영합니다" A → findings=[] · automatedDecision='pass' · inferredRiskLevel='Low' | risk_level draft 가능 |
1235: | 39 | FAQ status='published' 발행 — workflow action 통해 (submit → approve → publish) | DB CHECK 통과 |
1237: ### 16.8 LegalDocument exempt 유지 (1건)
1239: | # | 시나리오 | 통과 기준 |
1245: ## 17. 작업 단위
1249: | 1 | `data/compliance-rules/` 6 yaml + schema.json 작성 | meta · rules.core · rules.medical-ad · context-exceptions · medical-law-tracking · slot-matches · schema.json |
1255: | 7 | inlineRiskFlags 5종 추출 | inline-flags.ts |
1256: | 8 | RiskInference 자동 추론 + steps[] | risk-inference.ts |
1257: | 9 | slot-matches 평가 | slot-match.ts |
1261: | 13 | C0017 review_queue_type enum ADD VALUE + partial UNIQUE 재정의 | C0017_content_gate_queue.sql |
1264: | 16 | FAQ zod schema unlock + FaqForm status field 제거 | apps/web/src/lib/zod/eat-content-schema.ts + FaqForm.tsx |
1266: | 18 | apps/web/src/lib/compliance/types.ts ComplianceCheckEnvelope.extensions 추가 | types.ts |
1267: | 19 | vitest 40 scenarios | packages/compliance-rules/__tests__/ + apps/web/src/lib/compliance/__tests__/ |
1268: | 20 | docs cascade — RISK_LEVELS § 3.3/§ 3.4.1 (slotMatches 카테고리) · compliance-assistant § 4.3 KSS fallback marker · EAT_CONTENT_PLAN EC-DEFER-05 해소 marker · REVIEW_WORKFLOW § 3 content-gate 활성화 marker · CONTENT_STANDARDS § 7.1 metadata 신규 필드 cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 변환 매핑 marker | doc patches |
1272: ## 18. CA-CASCADE markers
1274: - `CA-CASCADE-01`: `data/compliance-rules/` 6 yaml + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
1275: - `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 7종 추가) · § 3.4.1 (loadOrder.slotMatches[] 카테고리) cascade
1276: - `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker) · § 7 (룰 카탈로그 로드 v0.1 6파일 실 배치 cascade)
1277: - `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 해소 marker
1278: - `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 9.1.1 (auto-gate audit event 추가)
1279: - `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · entityFields · inferredRiskLevel 내부 재산정 정합)
1280: - `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 → rules.medical-ad.yaml 매핑 marker (각 호 ↔ canonical RiskRule.id 매핑 표 cascade)
1281: - `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 20 단계 (M0 19 + C0017)
1282: - `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER-01·02·11·15 phase 분류 정정 marker
1286: ## 19. § 12 미결정 (Codex 비평 입력)
1290: | MA-Q01 | KSS v3+ 합류 시점 — Phase Alpha 본 cycle 안 합류 vs Phase Beta defer | 본 plan 안 fallback 만 활성. CA-DEFER-22 신설 |
1291: | MA-Q02 | `includes-effect-claim` 7 카테고리 안 `보장 결합 강조` (guarantee-composite-001) · `최상급` (supremacy-001) 정합 검증 + § 5.1.1 카테고리 SoT cascade 정정 필요 여부 | RISK_LEVELS § 5.1 검증 |
1292: | MA-Q03 | `priorReviewRequired` 메타 검사 (§ 7.3) 결과로 추가되는 finding 의 `triggeredBy` 값 — `"static-rule"` vs 신규 `"runtime-meta"` | CONTENT_STANDARDS § 7.2 Finding 타입 enum 확장 영향 |
1293: | MA-Q04 | `auto_check_result.extensions` 영역의 SoT 위치 — CONTENT_STANDARDS § 7.2 cascade 필요 여부 (extensions 키 정식 표준) vs envelope 외부 영역 (DB JSONB 격리만) | SoT 영향 결정 |
1294: | MA-Q05 | `slot-matches.yaml` 의 SoT 위치 — `compliance/RISK_LEVELS.md` cascade vs 별도 `PAGE_TYPES.md` § 3 slot 표 cascade | RISK_LEVELS 안 cascade 권장하나 PAGE_TYPES 원본 정합 검증 |
1295: | MA-Q06 | `content-gate` 큐 자동 진입 시 — manual-review 큐 와 분리 vs 통합 (동일 큐에 queue_type discriminator) | 본 plan 분리 채택. 통합 시 운영 단순화 가능성 검토 |
1296: | MA-Q07 | `unreviewed-ad-001` 룰을 RuleCatalog 안 정식 등록 (patternType="runtime-meta" 신규) vs check() 안 별도 흐름 (본 plan 채택) | RiskRule schema 안정성 vs 코드 흐름 단순성 trade-off |
1297: | MA-Q08 | preset 부재 (`rules.preset-<presetSlug>.yaml` 미존재 + InstanceManifest 안 preset 설정 안되어 있음) 시 — loader 가 silent skip vs warning log vs throw | 본 plan 안 silent skip 결정. Codex 의견 권장 |
1298: | MA-Q09 | `medical-law-tracking.yaml` placeholder revision 1건만 안 안 staleScope 처리 — 실 stale 큐 미합류 시 baseline revision 적용 시 영향 record 없음 (정상). Phase Beta 안 실 revision 추가 시 baseline 차감 운영 필요 | medical-law-tracking 운영 가설 검증 |
1299: | MA-Q10 | check() 안 catalog 로드 실패 시 — fail closed (모든 콘텐츠 발행 차단) vs fail open (룰 미적용 통과) | 본 plan 안 fail closed 결정 (throw). Codex 권장 |
1303: ## 변경 이력
1307: | 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 (medical-ad) + 4 룰 (core) + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |

 succeeded in 764ms:
19: - **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
23: - **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
25: - v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).
37: | C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
38: | C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
50: | C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
51: | C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
55: | C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
65: | CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
66: | CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
67: | CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
106: - **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
107: - ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
209: > v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
217: **v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
331: | `publications` | `Publication[]` | optional | |
365: #### `Publication`
373: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
482: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
483: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
491: | `relatedArticles` | `Ref<C-04>[]` | optional | |
494: | `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
495: | `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
497: **ArticleType ↔ 자동 추론 위험도**:
499: | ArticleType | 자동 위험도 | 운영자 오버라이드 |
544: | `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
732: | `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
775: | `articleType` | `string` | optional | (Article인 경우) |
776: | `inlineRiskFlags` | `string[]` | optional | |
784: | `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
785: | `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
815: > `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
833: | `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
841: | `articleType` | `string` | optional | |
846: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
848: **목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
863: | `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
869: #### `LegalDocumentRevision`
877: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
880: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
911: > - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
913: > **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
915: ### C-22. `ArticleCategory` — Article Pillar 분류
928: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
950: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
978: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
987: - Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
1011: | `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
1026: ### C-17. `PricingPage`
1090:    └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
1092: LocationProfile (C-21) — 위치·시간·연락 SoT
1098:    └─ availableTreatments → TreatmentPage[]
1101:    ├─ primaryLocation → LocationProfile (C-21)
1102:    ├─ additionalLocations → LocationProfile[]
1105: TreatmentPage (C-03)
1112: Article (C-04)
1116:    ├─ category → ArticleCategory (C-22)
1121: ComplianceRecord (C-10)
1122:    ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
1141: | DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
1142: | DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
1146: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1149: | DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
1154: | DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
1156: | DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |
1167: | 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
1168: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1169: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1170: | 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1173: | 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
1186: | 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/compliance/RISK_LEVELS.md | ForEach-Object { $i++; if(($i -ge 180 -and $i -le 430) -or ($_ -match '"'"'^## 5|''^### 5|inlineRisk|includes|FLAG|false-positive|High|ArticleType|medical-law-tracking|slotMatches|loadOrder'"')){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/CONTENT_STANDARDS.md | ForEach-Object { $i++; if($_ -match '"'"'^## 7|''^### 7|ComplianceCheckInput|LegalDocument|Publication|MediaAppearance|FAQ|Finding|RiskRule|triggeredBy|legalBasis|ContentScope|fieldPath|blockType'"'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/admin/REVIEW_WORKFLOW.md | ForEach-Object { $i++; if($_ -match '"'"'^## 3|''^### 3|manual-review|content-gate|warning|priority|sla|stale|알림|notification|publish|approve|gate'"'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Path apps/web/src/lib/compliance,apps/web/src/lib/zod,apps/web/src/components/forms,packages/core-content/migrations,packages/migrations-runner/src -Force | Select-Object FullName,Name' in C:\Users\assag\solution\website-exposure
 succeeded in 769ms:
3: > **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
57: | FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
102: 6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
129: | Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
154: - JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
207: - 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
272: 다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.
309: ### 5.5 P-011 FAQ — 답변 단위 위험도
358: ## 7. compliance-assistant Feature Module 인터페이스
362: ### 7.1 입력
365: type ComplianceCheckInput = {
375:     inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
377:   riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
403: LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
405: | 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
409: | RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
412: **변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
414: **ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
416: #### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
418: EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
420: | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
422: | `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
423: | `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
424: | `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
425: | `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
428: **v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).
432: `metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:
445: **트리거 조건**: `metadata.inferredRiskLevel === "High"` 또는 `metadata.explicitRiskLevel === "High"` (둘 중 하나라도 High이면 주입). 트리거 출처는 finding 메타에 기록(예: `triggeredBy: "inferred" | "explicit"`)하여 감사 추적성 유지.
447: - 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
448: - ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
453: - Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리
461: ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
473: ### 7.2 출력
480:   buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
481:   gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
482:   hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
484:   findingsBySeverity: {
492:   // 상세 findings
493:   findings: Finding[];
497: // - findings에 severity="fail" 1개 이상 → "block"
509: type Finding = {
510:   ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
511:   category: string;           // § 7.4 RiskRule.category (예: "최상급")
518:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
519:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
523: ### 7.3 빌드 검증 vs 어드민 검수
527: | 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
530: ### 7.4 RiskRule 데이터 스키마
536: type SimpleRiskRule = {
542:   scope: ContentScope[];       // 적용 범위 — § 7.4.1
546:   legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
555: type CompositeRiskRule = {
566:   scope: ContentScope[];
570:   legalBasis?: string[];       // 법령 조문 인용 식별자 — SimpleRiskRule과 동일
582: type RiskRule = SimpleRiskRule | CompositeRiskRule;
585: type ContentScope =
588:   | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
589:   | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
615: - Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
619: - 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
620: - 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
621: - CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
657: | ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
669: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
670: | 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
671: | 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
672: | 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
673: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
674: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
675: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
676: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

 succeeded in 800ms:
7: > **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
13: > - ArticleType별 위험도 기본값 → `core/CONTENT_STANDARDS.md` (§ 6)
20: - **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
21: - **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
22: - **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
24: - **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
25: - **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)
40: | RiskRule 패턴 정정 (false-positive 감소) | PATCH | |
56: `Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:
59: const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
68:   articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
69:   inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
70:   slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
85: 2. if articleType: base = max(base, CONTENT_STANDARDS § 6 articleType 기본 등급)
86: 3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
101:     source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
102:     sourceValue: string;             // 예: "P-006", "review-case", "includes-pricing", "P-006-content-results"
111: ### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)
113: | InlineRiskFlag | 격상 등급 | 의미 |
115: | `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
116: | `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
117: | `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
118: | `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
119: | `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |
121: > 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).
129: | P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
130: | P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |
146: ├── medical-law-tracking.yaml   # 의료법 개정 추적 (§ 7.1.2)
180:     operands:
181:       - { pattern: '(100%|반드시|절대|확실히)', patternType: "regex" }
182:       - { pattern: '(효과|결과|호전|개선|치유|보장)', patternType: "regex" }
183:     logic: "AND_IN_SENTENCE"
184:     severity: "fail"
185:     scope:
186:       - { type: "global" }
187:     contextExceptions:
188:       - kind: "safety"
189:         pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
190:     rationale: "의료법 제56조 + § 4.1 전문성 단정 + 보장 결합"
191:     version: "1.0.0"
192:     createdAt: "2026-05-14T00:00:00Z"
193:     updatedAt: "2026-05-14T00:00:00Z"
194: ```
195: 
196: ### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`
197: 
198: 빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 RiskRule(SimpleRiskRule + CompositeRiskRule) 전체 스키마를 검증할 수 있어야 한다.
199: 
200: **기본 식별·메타**
201: | 검증 항목 | 룰 레벨 |
202: |---|---|
203: | `id` 중복 (전체 파일 합집합) | **fail** |
204: | `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
205: | `category` 비어 있음 | **fail** |
206: | `version` SemVer 형식 위반 | **fail** |
207: | `createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
208: | `sourceDoc` URL/경로 형식 위반 | warning |
209: | `sourceDocVersion` SemVer 형식 위반 | warning |
210: 
211: **Simple/Composite 구분**
212: | 검증 항목 | 룰 레벨 |
213: |---|---|
214: | `patternType` enum 외 값 (`regex`·`keyword`·`phrase`·`composite`) | **fail** |
215: | Simple — `pattern` 누락 | **fail** |
216: | Simple — `pattern` regex 컴파일 실패 (`patternType="regex"` 시) | **fail** |
217: | Composite — `operands[]` 길이 < 2 | **fail** |
218: | Composite — `logic` enum 외 값 (`AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR`) | **fail** |
219: | Composite — `logic="AND_NEAR"` + `window` 누락 또는 ≤ 0 | **fail** |
220: | Composite — 각 `operands[].pattern` regex 컴파일 실패 | **fail** |
221: 
222: **severity·scope·roles**
223: | 검증 항목 | 룰 레벨 |
224: |---|---|
225: | `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
226: | `scope[]` 빈 배열 | **fail** |
227: | `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
228: | `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
229: | `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
230: | `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
231: | `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
232: | `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
233: | `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
234: | `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
235: | `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
236: | `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
237: | `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
238: | `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
239: | `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
240: | `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |
241: | `suggestion` 1,000자 초과 | warning |
242: | `exceptions[]` 항목 빈 문자열 | **fail** |
243: | `exceptions[]` 항목 regex 패턴인 경우 컴파일 실패 | **fail** |
244: | `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
245: | `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |
246: 
247: **context-exceptions.yaml** (§ 3.4.3 스키마)
248: | 검증 항목 | 룰 레벨 |
249: |---|---|
250: | `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
251: | `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
252: | `exceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
253: | `exceptions[].pattern` 누락 또는 빈 문자열 | **fail** |
254: | `exceptions[].pattern` regex 컴파일 실패 | **fail** |
255: | `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
256: | `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **fail** |
257: | `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
258: | `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
259: | `exceptions[].version` SemVer 형식 위반 | **fail** |
260: | `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
261: | `exceptions[].rationale` 누락 또는 빈 문자열 | warning (감사·추적 약화) |
262: 
263: **overrides·meta·medical-law-tracking**
264: | 검증 항목 | 룰 레벨 |
265: |---|---|
266: | `overrides[].targetRuleId` 미존재 (다른 파일에 정의된 ID 참조) | **fail** |
267: | `overrides[].patch` 객체에 enum/타입 위반 (deep merge 결과 기준) | **fail** |
268: | 동일 `targetRuleId`에 대한 override 카탈로그 전체에서 2개 이상 | **fail** |
269: | `meta.yaml` 구조 위반 (§ 3.4.1 참조) | **fail** |
270: | `meta.yaml`의 `medicalLawRevisionRef`가 `medical-law-tracking.yaml`의 `revisions[].revisionId` 미존재 | **fail** |
271: | `medical-law-tracking.yaml` 파일 부재 | **fail** |
272: | `medical-law-tracking.yaml.revisions[]` 필수 필드 누락 (`revisionId`·`lawSource`·`revisionEffectiveDate`·`sourceUrl`·`checkedAt`·`checkedBy`·`affectedRuleIds`·`staleScope`) | **fail** |
273: | `medical-law-tracking.yaml.revisions[].affectedRuleIds`의 룰 ID가 카탈로그에 미존재 | **fail** |
274: | `medical-law-tracking.yaml.revisions[].revisionType` enum 외 값 (`amendment`·`reaffirmation`·`new`) | **fail** |
275: | `medical-law-tracking.yaml.revisions[].staleScope.kind` enum 외 값 (`all`·`rule-matched`·`content-type`) | **fail** |
276: | `staleScope.kind="content-type"` + `contentTypes[]` 빈 배열 또는 누락 | **fail** |
277: | `staleScope.kind="content-type"` + `contentTypes[]` 항목이 C-10 contentType enum 미존재 | **fail** |
278: | `staleScope.kind="rule-matched"` + `affectedRuleIds[]` 빈 배열 | **fail** |
279: | `medical-law-tracking.yaml.revisions[].sourceUrl` URL 형식 위반 | **fail** |
280: 
281: #### 3.3.1 severity별 `requiredApproverRoles` 처리 정책
282: 
283: | severity | requiredApproverRoles 처리 |
284: |---|---|
285: | `fail` | 무시 (빌드 차단이므로 검수자 불필요). 명시 시 schema warning |
286: | `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |
287: | `content-gate` | **필수 명시** (§ 4.5 multi-role AND 조건) |
288: | `info` | 무시. 명시 시 schema warning |
289: 
290: ### 3.4 로드 순서·머지 규칙
291: 
292: ```
293: 1. rules.core.yaml         (Core 룰 — 기본 카탈로그)
294: 2. rules.medical-ad.yaml   (의료법 기반 룰)
295: 3. rules.preset-<presetSlug>.yaml  (인스턴스의 preset)
296: 4. context-exceptions.yaml (별도 ContextException[] 컬렉션)
297: ```
298: 
299: - 동일 `id` 중복 시 빌드 fail
300: - preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 가능
301: - 로드 결과는 단일 `RiskRule[]` 컬렉션 + `ContextException[]` 컬렉션
302: 
303: #### 3.4.1 `meta.yaml` 구조
304: 
305: ```yaml
306: catalogVersion: "1.0.0"                          # 카탈로그 전체 SemVer
307: medicalLawRevisionRef: "2026-Q1"                 # 의료법 개정 추적 (§ 7.1)
308: loadOrder:                                       # 파일 로드 순서 명시 — 모든 카탈로그 파일 포함
309:   rules:                                          # rules 파일 (순차 머지)
310:     - rules.core.yaml
311:     - rules.medical-ad.yaml
312:     - rules.preset-hanui-clinic.yaml
313:   contextExceptions:                              # ContextException 파일 (별도 컬렉션)
314:     - context-exceptions.yaml
315:   tracking:                                       # 추적 데이터 파일
316:     - medical-law-tracking.yaml
317: files:
318:   rules.core.yaml:
319:     version: "1.0.0"
320:     description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 변환"
321:   rules.medical-ad.yaml:
322:     version: "1.0.0"
323:     description: "의료법 제56조·제57조 룰"
324:   rules.preset-hanui-clinic.yaml:
325:     version: "1.0.0"
326:     description: "한의 특유 표현·체질 회색지대"
327:   context-exceptions.yaml:
328:     version: "1.0.0"
329:     description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
330:   medical-law-tracking.yaml:
331:     version: "1.0.0"
332:     description: "의료법 개정 추적 — § 7.1.2"
333: ```
334: 
335: #### 3.4.2 `overrides[]` 스키마·머지 규칙
336: 
337: ```yaml
338: # preset 파일 내 예시
339: overrides:
340:   - targetRuleId: "supremacy-001"        # rules.core.yaml의 룰 ID
341:     patch:                                # 부분 갱신 — 명시된 필드만 교체 (deep merge)
342:       severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
343:       contextExceptions:                  # 배열은 union 아니라 교체 — 기존 항목 유지하려면 모두 재기술
344:         - { kind: "safety", pattern: "기존 패턴" }
345:         - { kind: "safety", pattern: "추가 패턴" }
346:     rationale: "preset-hanui-clinic — 한의 진료 안내 문맥에서 안전 권유 다용"
347:     appliedAt: "2026-05-14T00:00:00Z"
348: ```
349: 
350: **머지 알고리즘**:
351: 1. `targetRuleId`의 원본 룰을 base로 복사
352: 2. `patch` 객체를 base에 적용:
353:    - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
354:    - 객체 필드(`metadata`) — deep merge (재귀적 key별 교체)
355:    - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`requiredApproverRoles[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)
356: 3. `patch`에 명시되지 않은 필드는 원본 값 유지
357: 4. 결과는 새 RiskRule으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉션에 존재
358: 
359: **제약**:
360: - override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본 비활성화 (별도 deprecation)
361: - 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견 시 빌드 **fail** (last-wins 정책 없음)
362: 
363: #### 3.4.3 `context-exceptions.yaml` 스키마
364: 
365: CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그의 데이터 표현. 빌드 로드 시 별도 `ContextException[]` 컬렉션으로 분리되고, 각 항목은 명시한 룰·카테고리·scope에 대해 매칭 검사 시 제외 단언(negative assertion)으로 작용.
366: 
367: ```yaml
368: version: "1.0.0"
369: sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
370: sourceDocVersion: "1.0"
371: 
372: exceptions:
373:   - id: "safety-medical-consult-001"
374:     kind: "safety"                         # safety | warning-message | administrative
375:     pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
376:     patternType: "regex"
377:     appliesTo:                              # 본 예외가 적용되는 대상
378:       categories: ["전문성 단정 (단독 어휘)"]   # RiskRule.category 매칭 (1개 이상)
379:       ruleIds: []                            # 또는 특정 RiskRule.id 명시 (1개 이상). 둘 중 1개 이상 필수
380:       scopes:                                # 본 예외가 적용될 scope (선택 — 미지정 시 전체)
381:         - { type: "global" }
382:     rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
383:     version: "1.0.0"
384:     createdAt: "2026-05-14T00:00:00Z"
385:     updatedAt: "2026-05-14T00:00:00Z"
386: ```
387: 
388: - `appliesTo.categories`와 `appliesTo.ruleIds` 중 1개 이상 비어 있지 않아야 함 (빌드 fail)
389: - 매칭 시 — 본 예외의 `pattern`이 텍스트 매칭하면, 같은 위치의 해당 룰 finding을 결과에서 제거
390: 
391: ### 3.5 버전 관리
392: 
393: - 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
394: - 파일 헤더의 `version` — 파일 단위 SemVer. 룰 추가/삭제 시 MINOR, 의료법 개정 시 MAJOR
395: - 의료법 개정 시 § 7.1 추적 표 동시 갱신 + `meta.yaml`에 `medicalLawRevisionRef` 기록
396: 
397: ---
398: 
399: ## 4. ApproverRole 통과 기준 — content-gate 발행 조건 (CS-02 해소)
400: 
401: `CONTENT_STANDARDS § 7.1.3`의 4역할 통과 기준 SoT.
402: 
403: ### 4.1 medical (의료진 검수)
404: 
405: **검수 자격**:
406: - DoctorProfile(C-02) 등록 + `credentials[]`로 의료진 자격(면허·전문의 등) 검증 (DATA_MODEL 정합)
407: - 콘텐츠 도메인(전문 분야) 일치 권장 — 한의 콘텐츠는 한의사, 양방 콘텐츠는 의사
408: 
409: **통과 조건**:
410: - 콘텐츠 전체 사실 검증 — 효과·기간·부작용·금기 표현
411: - 의학 정보의 일반론 적합성 (특정 진단·치료 단정 금지)
412: - ComplianceRecord(C-10) `physicianApprover` + `physicianApprovedAt` 기록
413: 
414: **만료** — `staleFlags.medical=true`로 표기. 다음 이벤트에서 자동 설정:
415: - 콘텐츠 본문이 RiskRule 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경
416: - TreatmentPage의 `treatmentComponents[]`·`visitFlow[]`·`evidenceNotes[]` 변경 (의학 정보 영역)
417: - 의료진 자격·인증 변경 (DoctorProfile 검수자 자격 변동)
418: - 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)
419: 
420: ### 4.2 legal (법무 자문·승인)
421: 
422: **검수 자격**:
423: - 사내 법무 또는 외부 법무법인 (변호사 자격)
424: - 의료광고법 자문 경력 권장
425: 
426: **통과 조건**:
427: - 의료법 제56조 광고 금지 항목 위반 부재
428: - 의료법 제57조 사전심의 대상 여부 판정 — ComplianceRecord(C-10) `priorReviewRequired: boolean` 기록 필수
429: - 사전심의 대상 판정 시 — `priorReviewSubmissionId` 기록 + 심의 통과 후 `priorReviewPassed: true` 기록
430: - 환자 유인 표현·치료경험담·전후사진 등 특별 항목 별도 판정
437: **만료** — `staleFlags.legal=true`로 표기. 다음 이벤트에서 자동 설정:
477: - `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구
485: | `review-case` ArticleType | `["medical", "legal"]` |
486: | `event-price` ArticleType | `["legal"]` |
487: | `effect-result-related` ArticleType | `["medical"]` |
490: | 기타 High 등급 (자동 추론) | `["medical"]` |
494: ## 5. inlineRiskFlags 자동 추출 — DM-05 영역
499: - C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
500: - 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
503: ### 5.1 추출 알고리즘 (RiskRule category 기반)
505: 각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.
507: | Flag | 추출 룰 |
509: | `includes-effect-claim` | RiskRule 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |
510: | `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
511: | `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
512: | `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠에 미디어 첨부 |
513: | `includes-testimonial` | RiskRule composite 매칭 — (1인칭/인용 패턴: `저는`·`환자분이`·`내원자 후기`·`치료받은`·`받은 후`·`상담받은`·`체험기`) + AND_IN_PARAGRAPH (효과 어휘: `효과`·`결과`·`변화`·`호전`·`개선`) |
515: ### 5.1.1 카테고리 SoT
519: ### 5.1.2 컨텍스트별 false-positive 완화 정책
521: 단어 매칭만으로 inlineRiskFlag 격상이 false-positive를 만들 수 있다. **콘텐츠 타입·필드 단위**의 정밀한 제외 규칙:
523: | 컨텍스트 (콘텐츠 타입·필드) | 제외 Flag | 사유 |
525: | `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
526: | `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |
528: > `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
529: | `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
530: | `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |
533: - 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
534: - 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화
536: ### 5.2 출력
539: type InlineRiskExtractionResult = {
540:   inlineRiskFlags: InlineRiskFlag[];
542:     [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
549: ### 5.3 책임
564: | High | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 진입 |
567: - High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)
569: ### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)
573: 본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
575: - `articleType` 기본 등급 (effect-result-related·review-case·event-price)
576: - `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
577: - `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)
580: **흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).
586:   ruleId: "risk-level-high-gate",
588:   pattern: "(RiskLevel=High)",
591:   requiredApproverRoles: ["medical"]            // 기본값. ArticleType별 override (§ 6.2)
595: ### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override
597: 본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우(High 등급)**의 `requiredApproverRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 않음.
599: | ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
603: | `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
604: | 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |
606: > Medium 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 요구는 자동 적용
610: - **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)
630: # data/compliance-rules/medical-law-tracking.yaml
654: 4. `medical-law-tracking.yaml`에 revision 항목 추가
656:    - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
665: - 운영 누적으로 false-positive 발견 시 `contextExceptions[]` 또는 `exceptions[]` 추가 — PATCH 버전
696: | RL-06 | inlineRiskFlag 추출 알고리즘의 정확도 운영 지표 (precision/recall) 측정·운영 | M2+ 운영 누적 후 |
712: | 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
714: | 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
715: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
716: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
717: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
718: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
719: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |

 succeeded in 776ms:
7: > **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
11: > - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
20: - **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
21: - **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
22: - **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
23: - **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
25: - **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
26: - **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
38: | ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
40: | 알림 채널 추가 | MINOR | |
46: - ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
67:   | "approved"        // 필요한 모든 역할의 승인 완료
68:   | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
69:   | "published"       // 발행됨 (Git 사본 생성)
72:   | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
92:               │     reject     │      │ approve (해당 역할)
96:               │                │   │  모든 ApproverRole 충족?    │
101:               │                │  │ approved │     ┘
106:               │                │  │ publishable  │
108:               │                │       │ publish (운영자 발행 액션)
111:               │                │  │  published   │
113:               │                │       │ staleFlags 발생 (§ 6)
116:               │                │  │  stale   │
136: | `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
138: | `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
139: | `publishable → published` | 운영자 명시 발행 액션 | operator+ |
142: | `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
143: | `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
144: | `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
148: | `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |
152: ## 3. 검수 큐 (Review Queues)
154: ### 3.1 큐 종류 3종
158: | **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
159: | **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
160: | **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |
162: #### 3.1.1 warning 큐 이탈 조건·기록
164: - operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
165: - 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
166: - 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
168: #### 3.1.2 content-gate와 warning 동시 발생 처리
170: ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
171: - content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
172: - warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
173: - publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)
175: ### 3.2 자동 큐 진입 트리거
179: - compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
181: - StaleFlags 발생:
190: ### 3.3 우선순위·SLA
192: | 처리 영역 | SLA 목표 | 알림 정책 SoT |
195: | content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
196: | stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
197: | warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |
199: SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).
201: > 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.
209: 콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:
217:            ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
222: **AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):
224: `finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.
227: > - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
228: > - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
229: > 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.
235: | **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
236: | **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
238: | **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |
246: | **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
249: | **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |
253: - 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
254: - 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
255: - `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)
263: approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:
265: | ApproverRole | 갱신 필드 |
268: | `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
270: | `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |
274: DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
276: **(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
277: - 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
278: - 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
281: **(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
282: - `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
283: - 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
290: | 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
291: | 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
292: | 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
293: | 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
294: | StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
295: | StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |
299: - 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
300: - staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
301: - **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
303: - staleFlags 외 필드 수정 시도 — 빌드/API fail
307: ## 6. StaleFlags 처리
326: ### 6.2 stale 큐 진입·처리
328: - staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
329: - 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
330: - 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
331: - 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
332: - 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
333: - 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
334: - 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
335: - 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)
337: ### 6.3 staleFlags 우선순위
352: ### 7.1 publishable 산정 알고리즘
354: 콘텐츠가 `publishable` 상태가 되기 위한 조건:
357: publishable = (1) automatedDecision !== "block"
359:                   (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
360:                               + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
362:            ∧ (4) staleFlags 모두 false 또는 미설정
364:            ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
367: 위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)
369: ### 7.2 publish 액션
375:   - `published` 상태 전이
376:   - ComplianceRecord `publishedAt`·`publishedBy` 기록
377:   - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
380: ### 7.3 unpublish 액션
384:   - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
396: 1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
414: `features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
428: 2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
429: 3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
431: 5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
434: 6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
435: 7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
451: 7. publishable 조건 § 7.1 (3) 충족
460: ## 9. 알림 (notifications Feature Module 인터페이스)
462: 본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
464: ### 9.1 NotificationEventType enum (canonical SoT)
467: type NotificationEventType =
468:   | "content-gate-queued"           // content-gate 큐 진입
470:   | "stale-queued"                  // stale 큐 진입
471:   | "warning-queued"                // warning 큐 진입
473:   | "reviewer-approved"             // 검수자 approve
475:   | "publish"                       // 발행 완료
476:   | "sla-imminent"                  // SLA 24시간 전
477:   | "sla-overdue"                   // SLA 미달
484:   | "search-visibility-anomaly-warning"      // warning severity anomaly
509:   | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
519: 이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.
523: | `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
524: | `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
525: | `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
526: | `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
528: | `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
530: | `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
531: | `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
532: | `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
533: | `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
534: | `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
535: | `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
536: | `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
537: | `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
539: | `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
540: | `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
541: | `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
542: | `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
543: | `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
544: | `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
545: | `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
546: | `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
547: | `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
558: | `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
565: - **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
567: - **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
568: - **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
570: - **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
572: ### 9.2 알림 페이로드
575: - **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
576: - **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)
579: type NotificationEvent = {
582:   eventType: NotificationEventType;                    // § 9.1 enum
585:   recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
587:   metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
591: type NotificationRecipient = {
593:   recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
596: type NotificationPayload = {
598:   eventId: string;                                     // 상위 NotificationEvent 참조
599:   eventType: NotificationEventType;
603:   recipientRole: ApproverRole | "author" | "operations";
613: - `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
614: - `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
617: ### 9.3 알림 채널·운영
619: - 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
620: - 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
621: - in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
622: - Slack은 **2가지 동작 모드 분기**:
623:   - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
624:   - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
633: - 모든 검수자 액션 (approve·reject·request-changes·delegate)
635: - staleFlags 발생·해제
636: - publish·unpublish
638: - **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
652:   metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
660:   | "approve" | "reject" | "request-changes" | "delegate"
661:   | "publish" | "unpublish"
662:   | "stale-triggered" | "stale-resolved"
665:   | "notification-dispatched"               // 알림 발송 envelope 종료 요약
666:   | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
667:   | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
668:   | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
694:   | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
715: > 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
735:   | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
745: | operator approve | ✅ | ✅ | | | |
746: | medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
747: | legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
748: | client approve | ⚠️ (자격 충족 시) | | | | ✅ |
749: | publish | ✅ | ✅ | | | |
750: | unpublish | ✅ | | | | |
754: > ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
765: - 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
774: | **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
775: | **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
776: | **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |
785: | AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
787: | AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
788: | AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
789: | AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
791: | AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |
799: | ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
800: | ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
801: | ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
807: | 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
808: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
809: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
810: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
811: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
812: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

2026-05-19T02:45:12.244135Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:

[32;1mFullName                                                                                                          [0m[32;1m Name[0m
[32;1m--------                                                                                                          [0m [32;1m----[0m
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\__tests__                                     __t…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\check.ts                                      che…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\eligibility.ts                                eli…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\entity-actions.ts                             ent…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\final-roles.ts                                fin…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\publishable-check.ts                          pub…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\risk.ts                                       ris…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts                             ser…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\transitions.ts                                tra…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\types.ts                                      typ…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ArticleCategoryForm.tsx                     Art…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ArticleForm.tsx                             Art…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ClinicProfileForm.tsx                       Cli…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\DeleteForm.tsx                              Del…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\DoctorProfileForm.tsx                       Doc…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\FaqForm.tsx                                 Faq…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\Field.tsx                                   Fie…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\MediaAppearanceForm.tsx                     Med…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\PublicationForm.tsx                         Pub…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ReviewEntryActionForm.tsx                   Rev…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\TreatmentPageForm.tsx                       Tre…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\WorkflowActionButtons.tsx                   Wor…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0001_clinic_profile.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0002_location_profile.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0003_doctor_profile.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0004_treatment_page.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0005_article.sql                        C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0006_legal_document.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql     C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0008_location_profile_parent_clinic.sql C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0009_article_category.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0010_publication.sql                    C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0011_media_appearance.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0012_faq.sql                            C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0013_article_category_fk.sql            C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0014_compliance_record.sql              C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0015_review_queue_entry.sql             C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql                  C00…
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\index.ts                                   ind…
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts                                man…

[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Path apps/web/src/lib/compliance,apps/web/src/lib/zod,[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\src\lib\zod' because it does not exist.[0m

 exited 1 in 916ms:

[32;1mFullName                                                                                                          [0m[32;1m Name[0m
[32;1m--------                                                                                                          [0m [32;1m----[0m
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\__tests__                                     __t…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\check.ts                                      che…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\eligibility.ts                                eli…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\entity-actions.ts                             ent…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\final-roles.ts                                fin…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\publishable-check.ts                          pub…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\risk.ts                                       ris…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\server-actions.ts                             ser…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\transitions.ts                                tra…
C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\types.ts                                      typ…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ArticleCategoryForm.tsx                     Art…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ArticleForm.tsx                             Art…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ClinicProfileForm.tsx                       Cli…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\DeleteForm.tsx                              Del…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\DoctorProfileForm.tsx                       Doc…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\FaqForm.tsx                                 Faq…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\Field.tsx                                   Fie…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\MediaAppearanceForm.tsx                     Med…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\PublicationForm.tsx                         Pub…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\ReviewEntryActionForm.tsx                   Rev…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\TreatmentPageForm.tsx                       Tre…
C:\Users\assag\solution\website-exposure\apps\web\src\components\forms\WorkflowActionButtons.tsx                   Wor…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0001_clinic_profile.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0002_location_profile.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0003_doctor_profile.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0004_treatment_page.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0005_article.sql                        C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0006_legal_document.sql                 C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql     C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0008_location_profile_parent_clinic.sql C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0009_article_category.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0010_publication.sql                    C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0011_media_appearance.sql               C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0012_faq.sql                            C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0013_article_category_fk.sql            C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0014_compliance_record.sql              C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0015_review_queue_entry.sql             C00…
C:\Users\assag\solution\website-exposure\packages\core-content\migrations\C0016_status_unlock.sql                  C00…
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\index.ts                                   ind…
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts                                man…

[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Path apps/web/src/lib/compliance,apps/web/src/lib/zod,[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\src\lib\zod' because it does not exist.[0m

codex
실코드 쪽에서 계획의 대상 경로 중 일부는 존재 경로와 맞지 않을 가능성이 있습니다. 지금은 구현 리뷰가 아니라 plan 리뷰이므로, 존재 여부와 현재 계약만 확인해 지적에 반영하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg \"(eat-content-schema|FaqForm|check\\.ts|types\\.ts|server-actions\\.ts|schema\\.ts|C0015|C0016|manifest\\.ts|pnpm-workspace|package\\.json|tsconfig\\.base)\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/compliance/types.ts | ForEach-Object { $i++; if($i -le 220){ '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/compliance/server-actions.ts | ForEach-Object { $i++; if($_ -match '"'submitForReview|approveContent|rejectContent|publishContent|queue|autoCheck|ComplianceRecord|check\\('){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/schema.ts | ForEach-Object { $i++; if($_ -match '"'reviewQueue|queueType|contentPublicationStatus|faq|ComplianceRecord|inlineRiskFlags|contentType'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 687ms:
tsconfig.base.json
pnpm-workspace.yaml
package.json
packages\shared-errors\package.json
packages\migrations-runner\src\manifest.ts
packages\migrations-runner\package.json
packages\storage\package.json
packages\auth\package.json
apps\web\package.json
packages\db\package.json
packages\notifications-outbox\package.json
packages\core-content\src\schema.ts
packages\core-content\package.json
packages\core-content\migrations\C0016_status_unlock.sql
packages\core-content\migrations\C0015_review_queue_entry.sql
packages\shared-types\package.json
apps\spike-b\package.json
apps\spike-e\package.json
apps\web\src\lib\eat-content-schema.ts
apps\web\src\lib\clinic-profile-schema.ts
apps\web\src\lib\json-ld\types.ts
apps\spike-a\src\schema.ts
apps\spike-a\package.json
apps\spike-d\src\drift-check.ts
apps\spike-c-local\package.json
apps\spike-d\package.json
apps\web\src\lib\compliance\types.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\lib\compliance\publishable-check.ts
apps\web\src\lib\compliance\check.ts
apps\spike-d\src\db\schema.ts
apps\spike-d\src\scenarios\test-drift-check.ts
apps\web\src\components\forms\FaqForm.tsx

 succeeded in 709ms:
1: // @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
2: // SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result
3: 
4: export type RiskLevel = "Low" | "Medium" | "High";
5: 
6: export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
7: 
8: // 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
9: export const ALLOWED_SUBMIT_TYPES = [
10:   "Article", "TreatmentPage", "LegalDocument",
11:   "FAQ", "Publication", "MediaAppearance",
12: ] as const;
13: export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];
14: 
15: export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";
16: 
17: // CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
18: export type ComplianceCheckInput = {
19:   contentType: ContentType;
20:   contentRef: string;
21:   body: string;  // Markdown
22:   metadata: {
23:     pageTypeId?: string;
24:     articleType?: string;
25:     explicitRiskLevel?: RiskLevel;
26:     inferredRiskLevel?: RiskLevel;
27:   };
28:   riskRules?: unknown[];  // M0 stub — 미사용
29: };
30: 
31: // CONTENT_STANDARDS § 7.2 Finding shape
32: export type Finding = {
33:   ruleId: string;
34:   category: string;
35:   pattern: string;
36:   severity: "info" | "warning" | "fail" | "content-gate";
37:   location: { start: number; end: number };
38:   suggestion?: string;
39:   requiredApproverRoles?: ApproverRole[];
40:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
41:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
42: };
43: 
44: // CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
45: export type ComplianceCheckResult = {
46:   automatedDecision: "block" | "gate" | "warn" | "pass";
47:   buildBlocked: boolean;
48:   gateRequired: boolean;
49:   hasWarnings: boolean;
50:   findingsBySeverity: {
51:     fail: number;
52:     "content-gate": number;
53:     warning: number;
54:     info: number;
55:   };
56:   requiredApproverRoles?: ApproverRole[];
57:   findings: Finding[];
58: };
59: 
60: // M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
61: export type ComplianceCheckEnvelope = {
62:   result: ComplianceCheckResult;
63:   meta: {
64:     pageRiskLevel: RiskLevel;
65:     catalogVersion: string;
66:     catalogHash: string;
67:     manualReview: boolean;
68:     exemptReason?: string;
69:   };
70: };
71: 
72: // 에러 type — fail closed
73: export class ComplianceConfigError extends Error {
74:   override readonly name = "ComplianceConfigError";
75: }
76: export class ComplianceTransitionError extends Error {
77:   override readonly name = "ComplianceTransitionError";
78: }
79: export class ReviewerEligibilityError extends Error {
80:   override readonly name = "ReviewerEligibilityError";
81: }

 succeeded in 693ms:
2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
17: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
35: export type SubmitForReviewArgs = {
41: export type SubmitForReviewResult = {
49:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
51: export async function submitForReview(
54:   args: SubmitForReviewArgs,
55: ): Promise<SubmitForReviewResult> {
59:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
71:     : await check(checkInput);
76:   // ComplianceRecord INSERT (pre-publish)
101:   // ReviewQueueEntry INSERT (open)
103:     INSERT INTO review_queue_entry (
104:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
108:       'manual-review'::review_queue_type,
112:       'open'::review_queue_status,
113:       'P0'::review_queue_priority,
124: export type ApproveContentArgs = {
131: export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
134:  * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
137: export async function approveContent(
140:   args: ApproveContentArgs,
141: ): Promise<ApproveContentResult> {
147:   // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
151:       FROM review_queue_entry
156:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
172:       `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
176:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
221:       UPDATE review_queue_entry
222:          SET status = 'in-progress'::review_queue_status,
230:   // entity status 전이 review-queued → in-review (첫 approve)
234:          WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
259:       UPDATE review_queue_entry
260:          SET status = 'resolved'::review_queue_status,
273: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
279: export type RejectContentArgs = {
290: export async function rejectContent(
293:   args: RejectContentArgs,
301:   // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
306:       FROM review_queue_entry
311:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
326:       `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
343:     UPDATE review_queue_entry
344:        SET status = 'resolved'::review_queue_status,
360: export type PublishContentArgs = {
367: export type PublishContentResult = { recordVersion: number };
374: export async function publishContent(
377:   args: PublishContentArgs,
378: ): Promise<PublishContentResult> {
383:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`

 succeeded in 710ms:
4: // v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
5: // v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
34: export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
46: // v0.5 COMPLIANCE_ASSISTANT_M0_PLAN — ComplianceRecord (C-10) + ReviewQueueEntry (REVIEW_WORKFLOW § 3)
47: export const complianceRecordPhaseEnum = pgEnum("compliance_record_phase", ["pre-publish", "published"]);
48: export const complianceContentTypeEnum = pgEnum("compliance_content_type", [
50:   "Article", "FAQ", "ReviewPolicy", "PricingPage", "FacilitiesPage", "NewsItem",
54: export const reviewQueueTypeEnum = pgEnum("review_queue_type", ["manual-review"]);
55: export const reviewQueueStatusEnum = pgEnum("review_queue_status", ["open", "in-progress", "resolved"]);
56: export const reviewQueuePriorityEnum = pgEnum("review_queue_priority", ["P0", "P1", "P2"]);
194:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
196:     complianceRecordId: uuid("compliance_record_id"),
229:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
231:     complianceRecordId: uuid("compliance_record_id"),
287:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
291:     complianceRecordId: uuid("compliance_record_id"),
388:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
392:     complianceRecordId: uuid("compliance_record_id"),
448:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
452:     complianceRecordId: uuid("compliance_record_id"),
488: // === FAQ (C-12·EC-SCHEMA-13) ===
491: export const faq = pgTable(
492:   "faq",
504:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
506:     complianceRecordId: uuid("compliance_record_id"),
513:     slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
514:     questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
515:     answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
518:     instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
519:     instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
520:     instanceIdx: index("faq_instance_idx").on(t.instanceId),
521:     statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
522:     publishedIdx: index("faq_published_idx")
525:     categoryIdx: index("faq_category_idx")
528:     orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
532:       name: "faq_category_fk",
537:       name: "faq_author_doctor_fk",
542:       name: "faq_related_treatment_fk",
548: // === v0.5 COMPLIANCE_ASSISTANT_M0 — ComplianceRecord (C-10 skeleton) + ReviewQueueEntry (REVIEW_WORKFLOW § 3) ===
550: export const complianceRecord = pgTable(
555:     contentType: complianceContentTypeEnum("content_type").notNull(),
559:     inlineRiskFlags: jsonb("inline_risk_flags").notNull().default(sql`'[]'::jsonb`),
574:     recordPhase: complianceRecordPhaseEnum("record_phase").notNull().default("pre-publish"),
585:       sql`${t.recordPhase} <> 'published' OR ${t.contentType} <> 'LegalDocument' OR (${t.legalCounsel} IS NOT NULL AND ${t.legalCounselAt} IS NOT NULL)`),
590:     uniqueVersion: unique("compliance_record_unique_version").on(t.instanceId, t.contentType, t.contentRef, t.recordVersion),
593:     contentRefIdx: index("compliance_record_content_ref_idx").on(t.instanceId, t.contentType, t.contentRef),
598: export const reviewQueueEntry = pgTable(
603:     queueType: reviewQueueTypeEnum("queue_type").notNull(),
604:     contentType: complianceContentTypeEnum("content_type").notNull(),
606:     complianceRecordId: uuid("compliance_record_id").notNull(),
607:     status: reviewQueueStatusEnum("status").notNull().default("open"),
608:     priority: reviewQueuePriorityEnum("priority").notNull().default("P0"),
629:       columns: [t.instanceId, t.complianceRecordId],
630:       foreignColumns: [complianceRecord.instanceId, complianceRecord.id],
639:     contentIdx: index("review_queue_entry_content_idx").on(t.instanceId, t.contentType, t.contentRef),
641:       .on(t.instanceId, t.contentType, t.contentRef)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0015_review_queue_entry.sql | ForEach-Object { $i++; '"'{0}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0016_status_unlock.sql | ForEach-Object { $i++; '"'{0}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/eat-content-schema.ts | ForEach-Object { $i++; if($_ -match '"'faq|status|contentPublication'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/components/forms/FaqForm.tsx | ForEach-Object { $i++; if($_ -match '"'status|name=|input|select'){ '{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 749ms:
1: -- @glitzy/core-content — C0015 ReviewQueueEntry (REVIEW_WORKFLOW § 3 · COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.2)
2: -- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
3: -- Precondition: D0010 instance · C0014 compliance_record + compliance_content_type enum
4: 
5: CREATE TYPE review_queue_type AS ENUM ('manual-review');
6: CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
7: CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
8: CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)
9: 
10: CREATE TABLE review_queue_entry (
11:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
12:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
13:   queue_type review_queue_type NOT NULL,
14:   content_type compliance_content_type NOT NULL,
15:   content_ref TEXT NOT NULL,
16:   compliance_record_id UUID NOT NULL,
17:   status review_queue_status NOT NULL DEFAULT 'open',
18:   priority review_queue_priority NOT NULL DEFAULT 'P0',
19:   required_roles approver_role[] NOT NULL,
20:   assigned_to UUID,
21:   assigned_at TIMESTAMPTZ,
22:   sla_due_at TIMESTAMPTZ NOT NULL,
23:   resolved_at TIMESTAMPTZ,
24:   resolved_by UUID,
25:   resolution_type TEXT,
26:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
27:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
28:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
29:   CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
30:   CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
31:     status <> 'resolved' OR resolved_at IS NOT NULL
32:   ),
33:   CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
34:     status <> 'resolved' OR resolution_type IS NOT NULL
35:   ),
36:   CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
37:     REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
38:   CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
39: );
40: 
41: CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
42: CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
43: CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
44:   WHERE status IN ('open', 'in-progress');
45: CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
46: CREATE UNIQUE INDEX review_queue_entry_open_unique
47:   ON review_queue_entry (instance_id, content_type, content_ref)
48:   WHERE status IN ('open', 'in-progress');
49: 
50: ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
51: ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
52: 
53: CREATE POLICY tenant_isolation ON review_queue_entry
54:   FOR ALL TO app_tenant_user
55:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
56:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
57: 
58: GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;

 succeeded in 796ms:
3: // Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
4: // DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
6: // v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.
104: // EC-FORM-02 + CWI-01 정정: status field 자체 form schema 에서 제거.
105: //   status 전이는 workflow action (submitForReview · publishContent) 만 변경.
106: //   save action 안 form 의 status 값 무시 + DB 안 current status 보존.
107: //   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
108: export const EatStatusSchema = z.enum(["draft"], {
178:   // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
202:   // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
207: // === FAQ ===
209: export const FaqInputSchema = z.object({
219:   // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
222: export type FaqInput = z.infer<typeof FaqInputSchema>;

 succeeded in 817ms:
1: -- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
2: -- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
3: -- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
4: -- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.
5: 
6: -- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
7: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
8: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
9: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
10: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
11: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;
12: 
13: -- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
14: ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
15: ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
16: ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
17: 
18: -- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
19: DO $$ BEGIN
20:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
21:     ALTER TABLE article ADD CONSTRAINT article_compliance_fk
22:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
23:   END IF;
24:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
25:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
26:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
27:   END IF;
28:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
29:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
30:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
31:   END IF;
32:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
33:     ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
34:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
35:   END IF;
36:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
37:     ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
38:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
39:   END IF;
40:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
41:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
42:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
43:   END IF;
44: END $$;
45: 
46: -- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
47: --   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
48: --   기존 published row 사전 마이그레이션 회피용.
49: 
50: -- Article
51: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
52:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
53:   record_phase, record_version, metadata)
54: SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
55:   'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
56:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
57:   '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
58:   a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
59:   'published'::compliance_record_phase, 1,
60:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
61: FROM article a
62: WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
63:   AND NOT EXISTS (
64:     SELECT 1 FROM compliance_record cr
65:     WHERE cr.instance_id = a.instance_id
66:       AND cr.content_type = 'Article'::compliance_content_type
67:       AND cr.content_ref = a.slug
68:       AND cr.metadata @> '{"sentinel":true}'::jsonb
69:   );
70: 
71: UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
72: WHERE a.instance_id = cr.instance_id
73:   AND cr.content_type = 'Article'::compliance_content_type
74:   AND cr.content_ref = a.slug
75:   AND cr.metadata @> '{"sentinel":true}'::jsonb
76:   AND a.status = 'published' AND a.compliance_record_id IS NULL;
77: 
78: -- TreatmentPage
79: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
80:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
81:   record_phase, record_version, metadata)
82: SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
83:   'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
84:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
85:   '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
86:   t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
87:   'published'::compliance_record_phase, 1,
88:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
89: FROM treatment_page t
90: WHERE t.status = 'published' AND t.compliance_record_id IS NULL
91:   AND NOT EXISTS (
92:     SELECT 1 FROM compliance_record cr
93:     WHERE cr.instance_id = t.instance_id
94:       AND cr.content_type = 'TreatmentPage'::compliance_content_type
95:       AND cr.content_ref = t.slug
96:       AND cr.metadata @> '{"sentinel":true}'::jsonb
97:   );
98: 
99: UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
100: WHERE t.instance_id = cr.instance_id
101:   AND cr.content_type = 'TreatmentPage'::compliance_content_type
102:   AND cr.content_ref = t.slug
103:   AND cr.metadata @> '{"sentinel":true}'::jsonb
104:   AND t.status = 'published' AND t.compliance_record_id IS NULL;
105: 
106: -- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
107: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
108:   auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
109:   published_at, published_by, record_phase, record_version, metadata)
110: SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
111:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
112:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
113:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
114:   l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
115:   'published'::compliance_record_phase, 1,
116:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
117: FROM legal_document l
118: WHERE l.status = 'published' AND l.compliance_record_id IS NULL
119:   AND NOT EXISTS (
120:     SELECT 1 FROM compliance_record cr
121:     WHERE cr.instance_id = l.instance_id
122:       AND cr.content_type = 'LegalDocument'::compliance_content_type
123:       AND cr.content_ref = l.slug
124:       AND cr.metadata @> '{"sentinel":true}'::jsonb
125:   );
126: 
127: UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
128: WHERE l.instance_id = cr.instance_id
129:   AND cr.content_type = 'LegalDocument'::compliance_content_type
130:   AND cr.content_ref = l.slug
131:   AND cr.metadata @> '{"sentinel":true}'::jsonb
132:   AND l.status = 'published' AND l.compliance_record_id IS NULL;
133: 
134: -- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
135: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
136:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
137:   record_phase, record_version, metadata)
138: SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
139:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
140:   '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
141:   f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
142:   'published'::compliance_record_phase, 1,
143:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
144: FROM faq f
145: WHERE f.status = 'published' AND f.compliance_record_id IS NULL
146:   AND NOT EXISTS (
147:     SELECT 1 FROM compliance_record cr
148:     WHERE cr.instance_id = f.instance_id
149:       AND cr.content_type = 'FAQ'::compliance_content_type
150:       AND cr.content_ref = f.slug
151:       AND cr.metadata @> '{"sentinel":true}'::jsonb
152:   );
153: 
154: UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
155: WHERE f.instance_id = cr.instance_id
156:   AND cr.content_type = 'FAQ'::compliance_content_type
157:   AND cr.content_ref = f.slug
158:   AND cr.metadata @> '{"sentinel":true}'::jsonb
159:   AND f.status = 'published' AND f.compliance_record_id IS NULL;
160: 
161: -- Publication · MediaAppearance — risk_level 'Low' fixed
162: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
163:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
164:   record_phase, record_version, metadata)
165: SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
166:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
167:   '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
168:   p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
169:   'published'::compliance_record_phase, 1,
170:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
171: FROM publication p
172: WHERE p.status = 'published' AND p.compliance_record_id IS NULL
173:   AND NOT EXISTS (
174:     SELECT 1 FROM compliance_record cr
175:     WHERE cr.instance_id = p.instance_id
176:       AND cr.content_type = 'Publication'::compliance_content_type
177:       AND cr.content_ref = p.slug
178:       AND cr.metadata @> '{"sentinel":true}'::jsonb
179:   );
180: 
181: UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
182: WHERE p.instance_id = cr.instance_id
183:   AND cr.content_type = 'Publication'::compliance_content_type
184:   AND cr.content_ref = p.slug
185:   AND cr.metadata @> '{"sentinel":true}'::jsonb
186:   AND p.status = 'published' AND p.compliance_record_id IS NULL;
187: 
188: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
189:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
190:   record_phase, record_version, metadata)
191: SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
192:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
193:   '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
194:   m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
195:   'published'::compliance_record_phase, 1,
196:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
197: FROM media_appearance m
198: WHERE m.status = 'published' AND m.compliance_record_id IS NULL
199:   AND NOT EXISTS (
200:     SELECT 1 FROM compliance_record cr
201:     WHERE cr.instance_id = m.instance_id
202:       AND cr.content_type = 'MediaAppearance'::compliance_content_type
203:       AND cr.content_ref = m.slug
204:       AND cr.metadata @> '{"sentinel":true}'::jsonb
205:   );
206: 
207: UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
208: WHERE m.instance_id = cr.instance_id
209:   AND cr.content_type = 'MediaAppearance'::compliance_content_type
210:   AND cr.content_ref = m.slug
211:   AND cr.metadata @> '{"sentinel":true}'::jsonb
212:   AND m.status = 'published' AND m.compliance_record_id IS NULL;
213: 
214: -- (Step 5) NULL 잔존 검증 — 6 entity
215: DO $$
216: DECLARE null_count INTEGER;
217: BEGIN
218:   SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
219:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
220:   SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
221:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
222:   SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
223:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
224:   SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
225:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
226:   SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
227:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
228:   SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
229:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
230: END $$;
231: 
232: -- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
233: DO $$ BEGIN
234:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
235:     ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
236:     ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
237:   END IF;
238:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
239:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
240:     ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
241:   END IF;
242:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
243:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
244:     ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
245:   END IF;
246:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
247:     ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
248:     ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
249:   END IF;
250:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
251:     ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
252:     ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
253:   END IF;
254:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
255:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
256:     ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
257:   END IF;
258: END $$;
259: 
260: -- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
261: --   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
262: CREATE OR REPLACE FUNCTION published_content_compliance_guard()
263: RETURNS TRIGGER LANGUAGE plpgsql AS $$
264: DECLARE
265:   record_row compliance_record%ROWTYPE;
266:   expected_content_type compliance_content_type;
267: BEGIN
268:   IF NEW.status <> 'published' THEN RETURN NEW; END IF;
269:   IF NEW.compliance_record_id IS NULL THEN
270:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
271:   END IF;
272:   SELECT * INTO record_row FROM compliance_record
273:    WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
274:   IF NOT FOUND THEN
275:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
276:   END IF;
277:   IF record_row.record_phase <> 'published' THEN
278:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
279:   END IF;
280:   -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
281:   expected_content_type := CASE TG_TABLE_NAME
282:     WHEN 'article' THEN 'Article'
283:     WHEN 'treatment_page' THEN 'TreatmentPage'
284:     WHEN 'legal_document' THEN 'LegalDocument'
285:     WHEN 'faq' THEN 'FAQ'
286:     WHEN 'publication' THEN 'Publication'
287:     WHEN 'media_appearance' THEN 'MediaAppearance'
288:     ELSE NULL
289:   END;
290:   IF expected_content_type IS NULL THEN
291:     RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
292:   END IF;
293:   IF record_row.content_type <> expected_content_type THEN
294:     RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
295:   END IF;
296:   -- content_ref 일치 (slug)
297:   IF record_row.content_ref <> NEW.slug THEN
298:     RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
299:   END IF;
300:   RETURN NEW;
301: END;
302: $$;
303: 
304: DROP TRIGGER IF EXISTS article_published_guard ON article;
305: CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
306:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
307: DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
308: CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
309:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
310: DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
311: CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
312:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
313: DROP TRIGGER IF EXISTS faq_published_guard ON faq;
314: CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
315:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
316: DROP TRIGGER IF EXISTS publication_published_guard ON publication;
317: CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
318:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
319: DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
320: CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
321:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

 succeeded in 739ms:
2: //   v0.1 단계 status='draft' DB CHECK 강제. 발행 자체 차단 (EC-DEFER-12).
6: import { useFormState, useFormStatus } from "react-dom";
7: import { Field, SelectField } from "./Field";
18:   status: string;
29:   status: "draft",
32: const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];
56:     <form action={formAction} className="flex flex-col gap-5">
58:         <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
63:         <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
66:       <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
70:       <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
71:       <Field name="question" label="질문" required value={v.question} onChange={(x) => set("question", x)} errors={fieldErrors.question} minLength={10} maxLength={200} hint="10~200자" />
72:       <Field name="answer" label="답변 (Markdown)" required textarea rows={10} value={v.answer} onChange={(x) => set("answer", x)} errors={fieldErrors.answer} minLength={50} maxLength={2000} hint="50~2000자" />
73:       <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} />
74:       <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
75:       <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
76:       <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
77:       {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
78:       <label className="flex flex-col gap-1 text-sm">
80:         {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
81:         <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
90:   const { pending } = useFormStatus();
95:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; if($i -ge 373 -and $i -le 430){ '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 661ms:
373: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
374: 
375: | 필드 | 타입 | required | 설명 |
376: |---|---|:---:|---|
377: | `@id` | `Slug` | ✅ | |
378: | `name` | `string` | ✅ | 1~80자 |
379: | `alternateName` | `string` | optional | |
380: | `summary` | `string` | ✅ | 50~160자 핵심 답변 |
381: | `category` | `string` | optional | 시술 카테고리 |
382: | `medicalSpecialty` | `Ref<C-14>` | optional | |
383: | `overview` | `Markdown` | ✅ | 개요 |
384: | `mechanism` | `Markdown` | ✅ | 원리 |
385: | `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
386: | `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
387: | `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
388: | `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
389: | `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
390: | `duration` | `string` | optional | 소요 시간 |
391: | `sessionCount` | `string` | optional | 권장 횟수 |
392: | `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
393: | `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
394: | `aftercare` | `Markdown` | optional | 시술 후 관리 |
395: | `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
396: | `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
397: | `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
399: | `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
400: | `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
401: | `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
402: | `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
403: | `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
404: | `heroImageUrl` | `URL` | optional | |
405: | `ogImageUrl` | `URL` | optional | |
406: | `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
407: 
408: **하위 타입**:
409: 
410: #### `ProcessStep`
411: | 필드 | 타입 | required | 설명 |
412: |---|---|:---:|---|
413: | `order` | `number` | ✅ | 단계 번호 |
414: | `name` | `string` | ✅ | 단계명 |
415: | `description` | `Markdown` | ✅ | |
416: | `durationMinutes` | `number` | optional | |
417: 
418: #### `TreatmentComponent` (v0.4 신규)
419: | 필드 | 타입 | required | 설명 |
420: |---|---|:---:|---|
421: | `@id` | `Slug` | ✅ | |
422: | `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
423: | `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
424: | `description` | `Markdown` | optional | |
425: | `included` | `boolean` | optional | 패키지 포함 여부 (default true) |
426: 
427: #### `VisitFlowStep` (v0.4 신규)
428: | 필드 | 타입 | required | 설명 |
429: |---|---|:---:|---|
430: | `order` | `number` | ✅ | |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { $i++; if($i -ge 210 -and $i -le 265){ '"'{0}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 648ms:
210: ### P-006. Treatment Detail
211: 
212: **목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
213: **URL**: `/treatments/{slug}`
214: **주 데이터 계약**: `TreatmentPage`
215: **Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
216: 
217: **정보 슬롯**:
218: 1. 시술명·요약 (1~2문장 핵심 답변)
219: 2. 개요 (정의·목적)
220: 3. 원리 (어떻게 작동)
221: 4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
222: 5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
223: 6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
224: 7. 과정 (단계별)
225: 8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
226: 9. 소요 시간·횟수
227: 10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
228: 11. 주의사항·금기증
229: 12. 시술 후 관리
230: 13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
231: 14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
232: 15. 자주 묻는 질문
233: 16. 담당 의료진 (백링크)
234: 17. 관련 질환 (백링크)
235: 18. 예약·문의 CTA
236: 
237: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
238: 
239: **헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
240: **필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항
241: **선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
242: 
243: **레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)
244: 
245: **위험도 기본값**: **Medium**
246: 
247: **슬롯별 위험도 격상 조건**:
248: 
249: | 슬롯 | 기본 | 격상 조건 |
250: |---|---|---|
251: | 개요·원리·과정·주의사항 | Medium | — |
252: | 대상 (`recommendedFor`) | Medium | "이런 분은 꼭 필요" 권유형 → High |
253: | 구성 (`treatmentComponents`) | Medium | 구성별 효과 단정 → High |
254: | 방문 흐름 (`visitFlow`) | Medium | — |
255: | 프로그램 변형 (`programVariants`) | Medium | 가격·기간·횟수 약속 결합 → High |
256: | 소요·횟수 | Medium | 감량 수치·기간 약속 → High |
257: | 유지 계획 (`maintenancePlan`) | Medium | "100% 요요 방지" 등 → High |
258: | 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
259: | FAQ | 답변별 가변 | 효과·결과 답변 → High |
260: | 후기·전후사진 (포함 시) | — | **자동 High** |
261: | 가격·이벤트 (포함 시) | — | **자동 High** |
262: | CTA | Low~Medium | 할인·이벤트 결합 → High |
263: 
264: **컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.
265: 

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=10 major=20 minor=5 nit=1 (총 36)
- closeableAfterPatch: false
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAP-01**: KSS v3+를 Phase Alpha 해소 범위에서 빼면서 CA-DEFER-01을 해소한다고 선언함
  - 위치: plan § 6.5 / line 610
  - 근거(SoT): compliance-assistant § 4.1·§ 4.3, CONTENT_STANDARDS § 2.1.1, RISK_LEVELS § 5.1 `includes-testimonial`
  - 문제: SoT는 `AND_IN_SENTENCE`와 answer-first/FAQ 단위에서 KSS 기준 문장 분리를 전제로 하는데, plan은 fallback 정규식만 구현하고 CA-DEFER-22로 Beta defer한다. 이 상태로는 composite/contextExceptions 정확도 핵심이 빠져 CA-DEFER-01 해소로 볼 수 없다.
  - 권장 patch: Phase Alpha에 KSS v3+ 또는 검증된 동등 구현을 포함한다. 범위를 줄일 경우 CA-DEFER-01 “해소” 표현을 “부분 해소”로 낮추고 composite/contextExceptions acceptance를 재정의한다.
  - closeableAfterPatch: false

- **CAP-02**: “6파일” 카탈로그 정의가 실제 목록과 충돌함
  - 위치: plan § 1.2 line 44, § 2.1 line 96~106, § 3.4 line 390
  - 근거(SoT): RISK_LEVELS § 3.1·§ 3.3·§ 3.4.1
  - 문제: plan은 `data/compliance-rules/` 6파일이라고 하지만 실제 구조는 `meta.yaml`, `rules.core.yaml`, `rules.medical-ad.yaml`, `context-exceptions.yaml`, `medical-law-tracking.yaml`, `slot-matches.yaml`, `schema.json` 7개다. `catalogHash`는 6개만 해시하고 `schema.json`은 제외한다. 검증 대상과 버전 결정성이 분리된다.
  - 권장 patch: “데이터 YAML 6개 + schema.json 1개”로 명명하고, hash 포함/제외 정책을 명시한다. `schema.json` 변경이 catalogHash를 바꿔야 하는지 결정한다.
  - closeableAfterPatch: true

- **CAP-03**: `slot-matches.yaml`를 추가하면서 RISK_LEVELS § 3.3 검증 표의 필수 항목 대부분을 cascade하지 않음
  - 위치: plan § 2.8 line 326~330
  - 근거(SoT): RISK_LEVELS § 3.3 line 200~280
  - 문제: plan은 slot 검증을 “slotId 형식 · pageTypeId enum · triggeredLevel enum · matchCondition 분기” 정도로만 적는다. 기존 SoT 수준의 `meta.files` 정합, loadOrder 참조 파일 존재, 중복 ID, fieldPath/contract 검증, condition regex 컴파일, stale/hash 영향 같은 검증 규칙이 빠져 있다.
  - 권장 patch: `slot-matches.yaml` 전용 JSON Schema 검증 표를 RISK_LEVELS § 3.3 수준으로 확장하고 CA-CASCADE-02에 구체 항목을 적는다.
  - closeableAfterPatch: true

- **CAP-04**: 18 canonical 의료광고 룰이 MEDICAL_AD SoT 전건과 맞지 않음
  - 위치: plan § 2.3 line 157~176
  - 근거(SoT): MEDICAL_AD_COMPLIANCE_COMMON § 3.3 line 171~173, § 3.6 line 190~192, § 3.8 line 203~205, § 3.14 line 251~253
  - 문제: SoT는 예시 ID로 `graphic-procedure-001`, `exaggeration-001`, `effect-claim-001`, `guarantee-001`, `false-award-001`, `false-endorsement-001` 축을 제시한다. plan은 “§ 3.1~3.14 전건 변환”이라고 하면서 일부 축을 `before-after-photo-001`, `guarantee-composite-001`, `award-endorsement-001`로 흡수했지만 흡수 근거와 legalBasis mapping을 명시하지 않는다.
  - 권장 patch: 각 SoT 예시 ID별로 “생성 / canonical 흡수 / 의도적 제외” 표를 추가하고, 흡수 시 어떤 ruleId와 legalBasis로 대체되는지 명시한다.
  - closeableAfterPatch: true

- **CAP-05**: `includes-effect-claim` 카테고리 SoT와 plan 카테고리가 불일치함
  - 위치: plan § 8.1 line 773, scenario 23~24 line 1205
  - 근거(SoT): RISK_LEVELS § 5.1 line 507~513, § 5.1.1 line 515
  - 문제: SoT 7개 카테고리는 `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`이다. plan의 `보장 결합 강조`, `최상급`은 이 집합과 다르며, scenario도 미결정으로 남겼다.
  - 권장 patch: 룰 category를 SoT 문자열로 맞추거나 RISK_LEVELS § 5.1.1을 먼저 cascade한다. `supremacy-001`은 effect-claim에서 제외하는지 명시한다.
  - closeableAfterPatch: true

- **CAP-06**: High 가상 finding이 block 콘텐츠도 content-gate enqueue할 수 있음
  - 위치: plan § 7.1 line 663~704, § 11.1 line 947~962, § 12.1 line 987~1017
  - 근거(SoT): REVIEW_WORKFLOW § 3.1 line 158, § 7.1 line 357; CONTENT_STANDARDS § 7.2 line 497
  - 문제: `automatedDecision='block'`인 fail 콘텐츠에도 RiskInference High이면 `risk-level-high-gate` content-gate finding이 추가되고 `gateRequired=true`가 되어 content-gate 큐에 들어갈 수 있다. SoT는 fail finding은 content-gate 큐가 아니라 blocked 정정 흐름이라고 한다.
  - 권장 patch: `enqueueContentGateIfNeeded` 조건을 `gateRequired && automatedDecision !== 'block'`로 제한하거나, block 콘텐츠의 High 가상 finding은 감사용으로만 보존하고 큐 진입 제외를 명시한다.
  - closeableAfterPatch: true

- **CAP-07**: auto-gate 통합 시점이 scope 선언과 구현 계획에서 충돌함
  - 위치: plan § 1.1 line 36, § 12.2 line 1022~1024
  - 근거(SoT): REVIEW_WORKFLOW § 3.2 line 175~181
  - 문제: 목적부는 “운영자 명시 submitForReview 트리거 없이 빌드/저장 흐름에서 자동 enqueue”라고 하지만 § 12.2는 `submitForReview` action 안 통합만 명시한다. 저장·빌드 시점 자동 큐가 빠져 CA-DEFER-15 해소 범위가 모호하다.
  - 권장 patch: Phase Alpha trigger를 `submitForReview` 한정으로 좁히거나, save/build 경로에서 pre-publish ComplianceRecord 생성 + content-gate enqueue까지 포함하도록 server-action 작업 단위를 추가한다.
  - closeableAfterPatch: true

- **CAP-08**: FAQ schema 변경 대상과 실제 코드 계약이 맞지 않음
  - 위치: plan § 13.1 line 1044~1051
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.2 line 424~428; 실코드 `apps/web/src/lib/eat-content-schema.ts` line 104~108, 207~219
  - 문제: plan은 `apps/web/src/lib/zod/eat-content-schema.ts`의 FAQ status enum을 draft에서 9-state로 바꾸라고 하지만 실제 파일은 `apps/web/src/lib/eat-content-schema.ts`이고, form schema에서 status field는 이미 제거되어 workflow action만 상태를 바꾸는 계약이다. full enum을 form schema에 되살리면 CWI-01 결정과 충돌한다.
  - 권장 patch: 경로를 고치고, FAQ unlock은 form schema가 아니라 workflow action/publish path에서 compliance check + status transition 허용으로 정의한다.
  - closeableAfterPatch: true

- **CAP-09**: P-006 slot 데이터가 실제 TreatmentPage 필드와 불일치함
  - 위치: plan § 2.7 line 291~312, § 9.2 line 859
  - 근거(SoT): PAGE_TYPES § P-006 line 247~262; DATA_MODEL C-03 line 377~403
  - 문제: plan은 `P-006-content-results`, `P-006-content-pricing`과 `entityFields.results/pricing`을 전제로 하지만 C-03 TreatmentPage에는 `results`나 `pricing` 필드가 없다. SoT의 실제 격상 슬롯은 `recommendedFor`, `treatmentComponents`, `programVariants`, `duration/sessionCount`, `maintenancePlan`, `evidenceNotes`, FAQ, 후기/전후사진, 가격/이벤트 포함 여부다.
  - 권장 patch: P-006 slotMatches를 실제 C-03 필드로 재작성한다. 가격/이벤트는 독립 PricingPage 필드가 아니라 body/CTA/programVariants/inlineRiskFlags 기반으로 처리한다.
  - closeableAfterPatch: true

- **CAP-10**: content-gate 큐 UNIQUE 재정의가 현재 DB unique key와 맞지 않음
  - 위치: plan § 15.1 line 1138~1149
  - 근거(SoT): C0015 line 46~48; REVIEW_WORKFLOW § 3.1.2 line 170~173
  - 문제: 현재 partial unique는 `(instance_id, content_type, content_ref)`인데 plan은 M0 unique를 `(instance_id, compliance_record_id)`라고 설명하고 `(instance_id, compliance_record_id, queue_type)`로 바꾸려 한다. 실제 constraint를 기준으로 DROP/CREATE하지 않으면 migration이 틀리고, contentRef 기준 중복 큐 제어도 깨질 수 있다.
  - 권장 patch: 현재 index `review_queue_entry_open_unique`를 기준으로 `(instance_id, content_type, content_ref, queue_type)` 또는 명시적으로 선택한 key로 재정의하고, record version별 중복 허용 여부를 설명한다.
  - closeableAfterPatch: true

## major
- **CAP-11**: `metadata.inferredRiskLevel` 외부 입력 처리 정책이 SoT와 다름
  - 위치: plan § 7.1 line 663~670, § 10.1 line 872~910
  - 근거(SoT): compliance-assistant § 3.3, CONTENT_STANDARDS § 7.1 line 375, RISK_LEVELS § 6.1 line 580
  - 문제: SoT는 외부 inferredRiskLevel 입력을 허용하고 가상 finding 트리거 입력으로 본다. plan은 내부 재계산만 수행해 외부 입력 신뢰/생략 가능 정책을 무시한다.
  - 권장 patch: Phase Alpha에서 “항상 내부 재계산 후 외부 입력과 비교”할지 “외부 입력 있으면 skip”할지 결정하고, 불일치 시 fail/warn 정책을 추가한다.
  - closeableAfterPatch: true

- **CAP-12**: RiskInference `steps[]`가 “base 갱신 시만 push”라 audit가 불완전함
  - 위치: plan § 10.1 line 872~910
  - 근거(SoT): RISK_LEVELS § 2.3.1 line 96~106
  - 문제: SoT는 산정 과정 추적을 표준화하지만 “각 단계 1~5에서 base가 갱신될 때마다”라는 문구는 있음에도 High triggeredBy 판단에는 동급 High source 우선순위가 필요하다. plan 알고리즘은 동급 source를 누락해 explicit High와 inline High가 동시에 있을 때 판정이 불안정하다.
  - 권장 patch: `steps`를 모든 source evaluation으로 남길지, `contributingSteps`와 `evaluatedSteps`를 분리할지 정한다. `determineTriggeredBy`는 explicit High 우선 규칙을 별도 검사한다.
  - closeableAfterPatch: true

- **CAP-13**: `determineTriggeredBy`의 “가장 먼저 High” 규칙과 “explicit 우선” 규칙이 충돌함
  - 위치: plan § 11.1 line 962~979, § 10.3 line 938
  - 근거(SoT): RISK_LEVELS § 6.1 line 580, CONTENT_STANDARDS § 7.1.2 line 445
  - 문제: plan 설명은 explicit이 High이면서 다른 source도 High면 explicit 우선이라고 하지만 구현 설명은 steps에서 가장 먼저 High 도달한 source를 본다. steps 순서상 inline/slot이 explicit보다 먼저라 explicit 우선이 깨진다.
  - 권장 patch: `if input.metadata.explicitRiskLevel === 'High' return 'explicit'`를 최우선으로 명시한다.
  - closeableAfterPatch: true

- **CAP-14**: `requiredApproverRoles` 합집합이 기존 helper 사용을 명시하지 않아 이중 정책 위험이 있음
  - 위치: plan § 11.2 line 979~985
  - 근거(SoT): REVIEW_WORKFLOW § 4.1 line 209~224; 실코드 `final-roles.ts` 존재
  - 문제: finalRoles는 operator + Medium/High medical + finding roles 합집합인데 plan은 별도 계산처럼 쓰고 기존 `apps/web/src/lib/compliance/final-roles.ts`와 동기화 지점을 명시하지 않는다.
  - 권장 patch: Phase Alpha는 `calculateFinalRoles`를 유일한 finalRoles 계산 경로로 사용하고 High 가상 finding role만 입력으로 추가한다고 적는다.
  - closeableAfterPatch: true

- **CAP-15**: `ApproverRole` client 제외 정책이 CONTENT_STANDARDS/RISK_LEVELS enum과 충돌함
  - 위치: plan § 1.3 line 76, § 4.6 line 487~496
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 546~570; RISK_LEVELS § 3.3 line 237
  - 문제: SoT enum은 `medical|legal|operator|client`이고 schema 검증도 client를 허용한다. plan은 CA-DEFER-10으로 client 검수자를 defer하지만 RiskRule schema/requiredApproverRoles 검증에서 client를 어떻게 처리할지 정하지 않는다.
  - 권장 patch: Phase Alpha runtime은 client role을 큐 처리 불가로 fail할지, schema는 허용하되 loader에서 preset client role을 금지할지 명시한다.
  - closeableAfterPatch: true

- **CAP-16**: `unreviewed-ad-001`을 카탈로그에서 빼면서 “전건 변환” claim과 충돌함
  - 위치: plan § 2.3 line 170, § 7.3 line 747~767
  - 근거(SoT): MEDICAL_AD § 3.11 line 223~225; CONTENT_STANDARDS § 7.2 line 518
  - 문제: 별도 runtime meta 흐름 자체는 가능하지만 RuleCatalog 전건 변환 대상에서 제외되면 legalBasis 검증, ruleMatchStats, suppressed/audit, docs cascade에서 누락된다.
  - 권장 patch: `RuntimeRiskRule` 또는 `metaRule` 섹션으로 카탈로그에 등록하되 matcher가 본문 pattern 대신 metadata predicate를 평가하도록 한다. `triggeredBy`는 기존 enum상 `static-rule`로 둘지 CONTENT_STANDARDS cascade를 할지 결정한다.
  - closeableAfterPatch: true

- **CAP-17**: contextExceptions 적용 단위가 SoT의 “같은 위치”보다 넓어 false-negative 위험이 큼
  - 위치: plan § 5.1~5.2 line 512~534
  - 근거(SoT): RISK_LEVELS § 3.4.3 line 388~389; CONTENT_STANDARDS § 4.4 line 272
  - 문제: RISK_LEVELS는 “같은 위치의 해당 룰 finding 제거”라고 하는데 plan은 같은 문장 안 예외 pattern이 있으면 finding을 제거한다. 한 문장 안에 “100% 효과”와 “반드시 상담하세요”가 같이 있으면 fail 표현까지 과도하게 suppress될 수 있다.
  - 권장 patch: exception match와 finding span의 overlap 또는 bounded distance를 요구하고, 적용 대상은 `전문성 단정 (단독 어휘)`로 제한한다. fail composite은 예외 미적용을 명시한다.
  - closeableAfterPatch: true

- **CAP-18**: contextExceptions audit 위치가 § 1.2와 § 5.3에서 서로 다름
  - 위치: plan § 1.2 line 48, § 5.3 line 536, § 14 line 1100~1108
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 473~493
  - 문제: § 1.2는 `auto_check_result.suppressedByContextExceptions[]`라고 하고 이후는 `auto_check_result.extensions.suppressedByContextExceptions[]`라고 한다. JSONB 구조가 불안정하다.
  - 권장 patch: `auto_check_result.extensions.suppressedByContextExceptions` 단일 위치로 통일하고 CONTENT_STANDARDS § 7.2 cascade 여부를 확정한다.
  - closeableAfterPatch: true

- **CAP-19**: `ComplianceCheckEnvelope.extensions`와 `auto_check_result.extensions`의 위치가 충돌함
  - 위치: plan § 7.1 line 704~718, § 14.1 line 1076~1108
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 473~493; DATA_MODEL C-10 `autoCheckResult`
  - 문제: § 7.1은 envelope.result 바깥 `envelope.extensions`를 추가한다고 하고, § 14는 `auto_check_result` JSON 안 `extensions`를 둔다. 저장 시 envelope 전체를 auto_check_result에 넣는지 result만 넣는지 불명확하다.
  - 권장 patch: `ComplianceCheckResult`에 `extensions?`를 정식 optional로 cascade하거나, DB 저장 envelope `{ result, meta, extensions }`와 `auto_check_result` 컬럼 구조를 분리해 명시한다.
  - closeableAfterPatch: true

- **CAP-20**: `includes-testimonial` 평가가 RuleCatalog와 matcher 경로에 없음
  - 위치: plan § 8.1 line 773~783
  - 근거(SoT): RISK_LEVELS § 5.1 line 513
  - 문제: SoT는 testimonial flag를 composite 매칭으로 정의하지만 plan의 RuleCatalog에는 `testimonial-001`만 있고 inline flag extractor가 별도 composite을 어디서 정의·재사용하는지 불명확하다.
  - 권장 patch: `includes-testimonial`을 `testimonial-001` finding category 기반으로 추출할지, inline-flags 전용 composite matcher를 둘지 결정한다.
  - closeableAfterPatch: true

- **CAP-21**: `includes-pricing` regex가 SoT보다 좁음
  - 위치: plan § 8.1 line 773~783
  - 근거(SoT): RISK_LEVELS § 5.1 line 510
  - 문제: SoT는 `[₩$￥]\s*\d`, `\d{2,}\s*(원|만원|달러)`, `가격·비용·수가·비급여·총 비용`을 포함한다. plan은 “정규식 + 어휘” 수준으로 남겨 구현자가 누락하기 쉽다.
  - 권장 patch: SoT regex/어휘를 그대로 표에 복사하고 테스트 케이스를 추가한다.
  - closeableAfterPatch: true

- **CAP-22**: LegalDocument false-positive 완화가 dead code임
  - 위치: plan § 8.2 line 783~794
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.1 line 401~414; RISK_LEVELS § 5.1.2 line 525~528
  - 문제: LegalDocument는 compliance-assistant `check()` 진입 자체가 차단된다. 그런데 plan은 LegalDocument documentType별 inlineRiskFlag 완화를 Phase Alpha 구현 대상으로 둔다.
  - 권장 patch: LegalDocument 완화는 “공용 extractor를 직접 호출하는 테스트/미래 경로용”이라고 낮추거나, runtime check 경로에서는 실행되지 않는다고 명시한다.
  - closeableAfterPatch: true

- **CAP-23**: `field` scope를 body 전체 매칭으로 처리해 ContentScope 의미를 무력화함
  - 위치: plan § 4.3 line 451~457
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 585~589; RISK_LEVELS § 3.3 line 229~230
  - 문제: `fieldPath`는 실제 필드 단위 검증을 위한 계약인데 plan은 v0.1에서 contractId만 보고 body 전체를 매칭한다. field-scoped rule이 body 다른 영역에서 발화해도 finding이 난다.
  - 권장 patch: field scope 미지원이면 loader에서 field scope rule을 fail 또는 skip+warning 처리한다. “body 전체 매칭”은 field scope와 동등하지 않다.
  - closeableAfterPatch: true

- **CAP-24**: block scope 미지원이 FAQ Q/A와 citation 예외에 직접 영향
  - 위치: plan § 4.3 line 457
  - 근거(SoT): CONTENT_STANDARDS § 2.1.1 line 102, § 7.4 line 588
  - 문제: Phase Alpha가 FAQ 자동 검수를 해소하려면 Q/A 단위와 citation/media block을 구분해야 하는데 block scope를 전부 미사용으로 둔다. FAQ 답변 단위 위험도와 인용 면제 판정이 body 전체 매칭으로 뭉개진다.
  - 권장 patch: 최소 `qa` block scope만 Phase Alpha에 포함하거나, FAQ는 Q+A 결합 body 외에 block metadata를 생성해 matcher에 전달한다.
  - closeableAfterPatch: true

- **CAP-25**: `CA-DEFER-20/21/22` 신설 marker가 § 1.3 defer 표와 CA-CASCADE에 빠짐
  - 위치: plan § 4.3 line 456~457, § 6.5 line 608~612, § 1.3 line 66~83
  - 근거(SoT): M0_PLAN § 9 CA-DEFER marker 체계
  - 문제: fieldPath, block scope, KSS가 새 defer로 등장하지만 § 1.3의 공식 defer 목록에는 CA-DEFER-20/21/22가 완전히 정리되지 않았다.
  - 권장 patch: 신설 marker 전부를 § 1.3 표와 M0_PLAN cascade에 추가하고 phase target을 명시한다.
  - closeableAfterPatch: true

- **CAP-26**: catalogHash에 `kssAvailable=false` suffix를 영구 포함하는 결정이 cacheKey SoT와 불명확함
  - 위치: plan § 3.4 line 390, § 6.5 line 610
  - 근거(SoT): compliance-assistant § 0 cache/idempotency, § 4.2; RISK_LEVELS § 3.5
  - 문제: 캐시 자체는 Beta defer인데 catalogHash는 Phase Alpha에 저장된다. `kssAvailable`은 런타임 capability이지 룰 데이터가 아니므로 hash에 넣으면 환경 차이로 같은 catalog가 다른 hash를 갖는다.
  - 권장 patch: `catalogHash`는 데이터 파일 hash로 고정하고, `engineVersion` 또는 `matcherCapabilities.kss`를 별도 메타로 저장한다.
  - closeableAfterPatch: true

- **CAP-27**: `medical-law-tracking.yaml` baseline이 실제 SoT revision과 충돌할 수 있음
  - 위치: plan § 2.6 line 269~288
  - 근거(SoT): MEDICAL_AD § 11.2 line 560; RISK_LEVELS § 7.1
  - 문제: MEDICAL_AD는 2026-04-07 시행 의료법 본문 확인 revision을 이미 기록한다. plan은 `v0.0.0-baseline` placeholder 1건만 넣어 실제 확인 revision을 제거한 것처럼 보인다.
  - 권장 patch: baseline placeholder 대신 SoT의 2026-04-07 reaffirmation revision을 seed로 넣거나, placeholder와 SoT revision의 관계를 명시한다.
  - closeableAfterPatch: true

- **CAP-28**: `rules.core.yaml`와 `rules.medical-ad.yaml` 분리가 CONTENT_STANDARDS § 4.1 SoT 중복/누락을 만들 수 있음
  - 위치: plan § 2.4 line 180~191
  - 근거(SoT): CONTENT_STANDARDS § 4.1 line 154~207
  - 문제: 최상급·보장·전문성 단정은 CONTENT_STANDARDS core 표현 SoT인데 plan은 medical-ad 파일로 옮긴다. “Core 룰 4종”만 두면 CONTENT_STANDARDS § 4.1 전체 변환이라는 RISK_LEVELS 예시와 파일 책임이 어긋난다.
  - 권장 patch: core 파일은 표현 SoT 기준, medical-ad 파일은 legalBasis overlay 기준으로 둘지 결정한다. 현재처럼 분리하려면 sourceDoc과 cascade 근거를 명확히 적는다.
  - closeableAfterPatch: true

- **CAP-29**: `false-statement-001`의 “인용 부재 검사”가 regex patternType과 맞지 않음
  - 위치: plan § 2.3 line 161
  - 근거(SoT): CONTENT_STANDARDS § 3.5 line 207; § 7.4 line 536~582
  - 문제: “국내/세계 1위 + 인용 부재”는 body regex 하나로 판정할 수 없고 citation block/embeddedMedia/evidenceNotes와 인접 단락 검사가 필요하다. patternType=regex로 두면 구현 불가능한 조건이 숨는다.
  - 권장 patch: composite 또는 runtime evidence predicate로 분리하고 `citationAbsence` evaluation contract를 명시한다.
  - closeableAfterPatch: true

- **CAP-30**: `side-effect-missing-001`의 “부재” composite가 schema logic에 없음
  - 위치: plan § 2.3 line 165
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 555~582; RISK_LEVELS § 3.3 line 214~220
  - 문제: `AND_IN_PARAGRAPH 역방향 평가`는 현재 CompositeRiskRule logic enum에 없다. “treatment 어휘 + 부작용/금기 어휘 부재”는 negative operand가 필요한데 schema와 matcher가 이를 지원하지 않는다.
  - 권장 patch: `NOT_IN_PARAGRAPH`/negative operand를 schema cascade하거나 해당 룰을 Phase Beta로 defer한다.
  - closeableAfterPatch: true

## minor
- **CAP-31**: plan SoT 목록의 실코드 경로가 틀림
  - 위치: plan SoT line 22, § 13.1 line 1044
  - 근거(SoT): 실코드 `apps/web/src/lib/eat-content-schema.ts`
  - 문제: `apps/web/src/lib/zod/eat-content-schema.ts`는 존재하지 않는다.
  - 권장 patch: 경로를 `apps/web/src/lib/eat-content-schema.ts`로 수정한다.
  - closeableAfterPatch: true

- **CAP-32**: “FAQ 기존 draft row는 sentinel row 없음” 가설이 C0016과 어긋남
  - 위치: plan § 1.4 line 89
  - 근거(SoT): C0016 line 134~159
  - 문제: C0016은 FAQ published row가 없을 것으로 예상하지만 published FAQ가 있으면 sentinel backfill을 수행한다. “sentinel row 없음”은 절대 가정으로 쓰면 안 된다.
  - 권장 patch: “기존 published FAQ는 원칙적으로 0건이나 C0016 guard/backfill로 예외 처리됨”으로 수정한다.
  - closeableAfterPatch: true

- **CAP-33**: Priority/SLA 정책이 REVIEW_WORKFLOW와 부분 불일치함
  - 위치: plan § 12.4 line 1034~1042
  - 근거(SoT): REVIEW_WORKFLOW § 3.3 line 190~199
  - 문제: content-gate는 P0, 영업일 3일, `content-gate-queued` 알림이 SoT인데 plan은 P1/P0 분기나 slaDueAt 산정 근거를 충분히 고정하지 않는다.
  - 권장 patch: REVIEW_WORKFLOW § 3.3 표를 그대로 인용하고 `slaDueAt = businessDays(3)` 산정 주체를 명시한다.
  - closeableAfterPatch: true

- **CAP-34**: Publication/MediaAppearance unlock 설명이 EC-DEFER-12와 혼동됨
  - 위치: plan § 13.4 line 1070
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.2 line 422~428; DATA_MODEL C-24/C-25 line 950~978
  - 문제: 외부 인용 entity는 RiskRule/RiskInference 면제지만 status unlock 자체는 EC-DEFER-12 별도 과제다. “Phase Beta 안 별도 unlock”이라고만 하면 EC-DEFER-12의 전체 잔여 범위가 불명확하다.
  - 권장 patch: 본 cycle은 FAQ만 EC-DEFER-12 부분 해소, Publication/MediaAppearance는 `status` schema unlock 미포함이라고 명시한다.
  - closeableAfterPatch: true

- **CAP-35**: scenario #37 findings count가 High 가상 finding 포함 여부와 모순됨
  - 위치: plan § 16.7 line 1233
  - 근거(SoT): RISK_LEVELS § 6.1 line 573~580; CONTENT_STANDARDS § 7.1.2 line 432~447
  - 문제: “guarantee-composite fail + includes-effect-claim + RiskInference High 가상 finding”이면 findings는 최소 2개지만 fail과 standalone 동시 매칭 여부에 따라 3개도 가능하다. plan은 `findings.length=2`로 고정한다.
  - 권장 patch: 기대값을 rule set별로 정확히 나누거나 “contains ruleIds”로 검증한다.
  - closeableAfterPatch: true

## nit
- **CAP-36**: plan 내부에서 CA-CASCADE 번호가 중복/불안정하게 쓰임
  - 위치: plan § 1.2 line 64, § 18 line 1274~1282
  - 근거(SoT): M0_PLAN marker 운영 패턴
  - 문제: § 1.2는 docs cascade를 CA-CASCADE-02~06으로만 요약하지만 § 18은 01~09를 둔다. 리뷰·패치 추적 시 누락처럼 보인다.
  - 권장 patch: § 1.2 요약도 CA-CASCADE-01~09 전체를 가리키도록 수정한다.
  - closeableAfterPatch: true

## acceptance precondition 점검
- 18 canonical 룰 정합: FAIL
- 5 inlineRiskFlags 추출 표 정합: FAIL
- RiskInference MAX 결합 + steps 정합: FAIL
- contextExceptions OR 결합 + 같은 문장 단위 정합: FAIL
- High 가상 finding triggeredBy 판정 정합: FAIL
- CA-DEFER 5 phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 1
total_findings: 36
blocking: 10
major: 20
minor: 5
nit: 1
closeable_after_patch_ratio: 97%
ready_for_acceptance: false
scope_narrow_acceptable: false
recommendation: "다음 cycle 진입 권장"
tokens used
114,161
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=10 major=20 minor=5 nit=1 (총 36)
- closeableAfterPatch: false
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **CAP-01**: KSS v3+를 Phase Alpha 해소 범위에서 빼면서 CA-DEFER-01을 해소한다고 선언함
  - 위치: plan § 6.5 / line 610
  - 근거(SoT): compliance-assistant § 4.1·§ 4.3, CONTENT_STANDARDS § 2.1.1, RISK_LEVELS § 5.1 `includes-testimonial`
  - 문제: SoT는 `AND_IN_SENTENCE`와 answer-first/FAQ 단위에서 KSS 기준 문장 분리를 전제로 하는데, plan은 fallback 정규식만 구현하고 CA-DEFER-22로 Beta defer한다. 이 상태로는 composite/contextExceptions 정확도 핵심이 빠져 CA-DEFER-01 해소로 볼 수 없다.
  - 권장 patch: Phase Alpha에 KSS v3+ 또는 검증된 동등 구현을 포함한다. 범위를 줄일 경우 CA-DEFER-01 “해소” 표현을 “부분 해소”로 낮추고 composite/contextExceptions acceptance를 재정의한다.
  - closeableAfterPatch: false

- **CAP-02**: “6파일” 카탈로그 정의가 실제 목록과 충돌함
  - 위치: plan § 1.2 line 44, § 2.1 line 96~106, § 3.4 line 390
  - 근거(SoT): RISK_LEVELS § 3.1·§ 3.3·§ 3.4.1
  - 문제: plan은 `data/compliance-rules/` 6파일이라고 하지만 실제 구조는 `meta.yaml`, `rules.core.yaml`, `rules.medical-ad.yaml`, `context-exceptions.yaml`, `medical-law-tracking.yaml`, `slot-matches.yaml`, `schema.json` 7개다. `catalogHash`는 6개만 해시하고 `schema.json`은 제외한다. 검증 대상과 버전 결정성이 분리된다.
  - 권장 patch: “데이터 YAML 6개 + schema.json 1개”로 명명하고, hash 포함/제외 정책을 명시한다. `schema.json` 변경이 catalogHash를 바꿔야 하는지 결정한다.
  - closeableAfterPatch: true

- **CAP-03**: `slot-matches.yaml`를 추가하면서 RISK_LEVELS § 3.3 검증 표의 필수 항목 대부분을 cascade하지 않음
  - 위치: plan § 2.8 line 326~330
  - 근거(SoT): RISK_LEVELS § 3.3 line 200~280
  - 문제: plan은 slot 검증을 “slotId 형식 · pageTypeId enum · triggeredLevel enum · matchCondition 분기” 정도로만 적는다. 기존 SoT 수준의 `meta.files` 정합, loadOrder 참조 파일 존재, 중복 ID, fieldPath/contract 검증, condition regex 컴파일, stale/hash 영향 같은 검증 규칙이 빠져 있다.
  - 권장 patch: `slot-matches.yaml` 전용 JSON Schema 검증 표를 RISK_LEVELS § 3.3 수준으로 확장하고 CA-CASCADE-02에 구체 항목을 적는다.
  - closeableAfterPatch: true

- **CAP-04**: 18 canonical 의료광고 룰이 MEDICAL_AD SoT 전건과 맞지 않음
  - 위치: plan § 2.3 line 157~176
  - 근거(SoT): MEDICAL_AD_COMPLIANCE_COMMON § 3.3 line 171~173, § 3.6 line 190~192, § 3.8 line 203~205, § 3.14 line 251~253
  - 문제: SoT는 예시 ID로 `graphic-procedure-001`, `exaggeration-001`, `effect-claim-001`, `guarantee-001`, `false-award-001`, `false-endorsement-001` 축을 제시한다. plan은 “§ 3.1~3.14 전건 변환”이라고 하면서 일부 축을 `before-after-photo-001`, `guarantee-composite-001`, `award-endorsement-001`로 흡수했지만 흡수 근거와 legalBasis mapping을 명시하지 않는다.
  - 권장 patch: 각 SoT 예시 ID별로 “생성 / canonical 흡수 / 의도적 제외” 표를 추가하고, 흡수 시 어떤 ruleId와 legalBasis로 대체되는지 명시한다.
  - closeableAfterPatch: true

- **CAP-05**: `includes-effect-claim` 카테고리 SoT와 plan 카테고리가 불일치함
  - 위치: plan § 8.1 line 773, scenario 23~24 line 1205
  - 근거(SoT): RISK_LEVELS § 5.1 line 507~513, § 5.1.1 line 515
  - 문제: SoT 7개 카테고리는 `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`이다. plan의 `보장 결합 강조`, `최상급`은 이 집합과 다르며, scenario도 미결정으로 남겼다.
  - 권장 patch: 룰 category를 SoT 문자열로 맞추거나 RISK_LEVELS § 5.1.1을 먼저 cascade한다. `supremacy-001`은 effect-claim에서 제외하는지 명시한다.
  - closeableAfterPatch: true

- **CAP-06**: High 가상 finding이 block 콘텐츠도 content-gate enqueue할 수 있음
  - 위치: plan § 7.1 line 663~704, § 11.1 line 947~962, § 12.1 line 987~1017
  - 근거(SoT): REVIEW_WORKFLOW § 3.1 line 158, § 7.1 line 357; CONTENT_STANDARDS § 7.2 line 497
  - 문제: `automatedDecision='block'`인 fail 콘텐츠에도 RiskInference High이면 `risk-level-high-gate` content-gate finding이 추가되고 `gateRequired=true`가 되어 content-gate 큐에 들어갈 수 있다. SoT는 fail finding은 content-gate 큐가 아니라 blocked 정정 흐름이라고 한다.
  - 권장 patch: `enqueueContentGateIfNeeded` 조건을 `gateRequired && automatedDecision !== 'block'`로 제한하거나, block 콘텐츠의 High 가상 finding은 감사용으로만 보존하고 큐 진입 제외를 명시한다.
  - closeableAfterPatch: true

- **CAP-07**: auto-gate 통합 시점이 scope 선언과 구현 계획에서 충돌함
  - 위치: plan § 1.1 line 36, § 12.2 line 1022~1024
  - 근거(SoT): REVIEW_WORKFLOW § 3.2 line 175~181
  - 문제: 목적부는 “운영자 명시 submitForReview 트리거 없이 빌드/저장 흐름에서 자동 enqueue”라고 하지만 § 12.2는 `submitForReview` action 안 통합만 명시한다. 저장·빌드 시점 자동 큐가 빠져 CA-DEFER-15 해소 범위가 모호하다.
  - 권장 patch: Phase Alpha trigger를 `submitForReview` 한정으로 좁히거나, save/build 경로에서 pre-publish ComplianceRecord 생성 + content-gate enqueue까지 포함하도록 server-action 작업 단위를 추가한다.
  - closeableAfterPatch: true

- **CAP-08**: FAQ schema 변경 대상과 실제 코드 계약이 맞지 않음
  - 위치: plan § 13.1 line 1044~1051
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.2 line 424~428; 실코드 `apps/web/src/lib/eat-content-schema.ts` line 104~108, 207~219
  - 문제: plan은 `apps/web/src/lib/zod/eat-content-schema.ts`의 FAQ status enum을 draft에서 9-state로 바꾸라고 하지만 실제 파일은 `apps/web/src/lib/eat-content-schema.ts`이고, form schema에서 status field는 이미 제거되어 workflow action만 상태를 바꾸는 계약이다. full enum을 form schema에 되살리면 CWI-01 결정과 충돌한다.
  - 권장 patch: 경로를 고치고, FAQ unlock은 form schema가 아니라 workflow action/publish path에서 compliance check + status transition 허용으로 정의한다.
  - closeableAfterPatch: true

- **CAP-09**: P-006 slot 데이터가 실제 TreatmentPage 필드와 불일치함
  - 위치: plan § 2.7 line 291~312, § 9.2 line 859
  - 근거(SoT): PAGE_TYPES § P-006 line 247~262; DATA_MODEL C-03 line 377~403
  - 문제: plan은 `P-006-content-results`, `P-006-content-pricing`과 `entityFields.results/pricing`을 전제로 하지만 C-03 TreatmentPage에는 `results`나 `pricing` 필드가 없다. SoT의 실제 격상 슬롯은 `recommendedFor`, `treatmentComponents`, `programVariants`, `duration/sessionCount`, `maintenancePlan`, `evidenceNotes`, FAQ, 후기/전후사진, 가격/이벤트 포함 여부다.
  - 권장 patch: P-006 slotMatches를 실제 C-03 필드로 재작성한다. 가격/이벤트는 독립 PricingPage 필드가 아니라 body/CTA/programVariants/inlineRiskFlags 기반으로 처리한다.
  - closeableAfterPatch: true

- **CAP-10**: content-gate 큐 UNIQUE 재정의가 현재 DB unique key와 맞지 않음
  - 위치: plan § 15.1 line 1138~1149
  - 근거(SoT): C0015 line 46~48; REVIEW_WORKFLOW § 3.1.2 line 170~173
  - 문제: 현재 partial unique는 `(instance_id, content_type, content_ref)`인데 plan은 M0 unique를 `(instance_id, compliance_record_id)`라고 설명하고 `(instance_id, compliance_record_id, queue_type)`로 바꾸려 한다. 실제 constraint를 기준으로 DROP/CREATE하지 않으면 migration이 틀리고, contentRef 기준 중복 큐 제어도 깨질 수 있다.
  - 권장 patch: 현재 index `review_queue_entry_open_unique`를 기준으로 `(instance_id, content_type, content_ref, queue_type)` 또는 명시적으로 선택한 key로 재정의하고, record version별 중복 허용 여부를 설명한다.
  - closeableAfterPatch: true

## major
- **CAP-11**: `metadata.inferredRiskLevel` 외부 입력 처리 정책이 SoT와 다름
  - 위치: plan § 7.1 line 663~670, § 10.1 line 872~910
  - 근거(SoT): compliance-assistant § 3.3, CONTENT_STANDARDS § 7.1 line 375, RISK_LEVELS § 6.1 line 580
  - 문제: SoT는 외부 inferredRiskLevel 입력을 허용하고 가상 finding 트리거 입력으로 본다. plan은 내부 재계산만 수행해 외부 입력 신뢰/생략 가능 정책을 무시한다.
  - 권장 patch: Phase Alpha에서 “항상 내부 재계산 후 외부 입력과 비교”할지 “외부 입력 있으면 skip”할지 결정하고, 불일치 시 fail/warn 정책을 추가한다.
  - closeableAfterPatch: true

- **CAP-12**: RiskInference `steps[]`가 “base 갱신 시만 push”라 audit가 불완전함
  - 위치: plan § 10.1 line 872~910
  - 근거(SoT): RISK_LEVELS § 2.3.1 line 96~106
  - 문제: SoT는 산정 과정 추적을 표준화하지만 “각 단계 1~5에서 base가 갱신될 때마다”라는 문구는 있음에도 High triggeredBy 판단에는 동급 High source 우선순위가 필요하다. plan 알고리즘은 동급 source를 누락해 explicit High와 inline High가 동시에 있을 때 판정이 불안정하다.
  - 권장 patch: `steps`를 모든 source evaluation으로 남길지, `contributingSteps`와 `evaluatedSteps`를 분리할지 정한다. `determineTriggeredBy`는 explicit High 우선 규칙을 별도 검사한다.
  - closeableAfterPatch: true

- **CAP-13**: `determineTriggeredBy`의 “가장 먼저 High” 규칙과 “explicit 우선” 규칙이 충돌함
  - 위치: plan § 11.1 line 962~979, § 10.3 line 938
  - 근거(SoT): RISK_LEVELS § 6.1 line 580, CONTENT_STANDARDS § 7.1.2 line 445
  - 문제: plan 설명은 explicit이 High이면서 다른 source도 High면 explicit 우선이라고 하지만 구현 설명은 steps에서 가장 먼저 High 도달한 source를 본다. steps 순서상 inline/slot이 explicit보다 먼저라 explicit 우선이 깨진다.
  - 권장 patch: `if input.metadata.explicitRiskLevel === 'High' return 'explicit'`를 최우선으로 명시한다.
  - closeableAfterPatch: true

- **CAP-14**: `requiredApproverRoles` 합집합이 기존 helper 사용을 명시하지 않아 이중 정책 위험이 있음
  - 위치: plan § 11.2 line 979~985
  - 근거(SoT): REVIEW_WORKFLOW § 4.1 line 209~224; 실코드 `final-roles.ts` 존재
  - 문제: finalRoles는 operator + Medium/High medical + finding roles 합집합인데 plan은 별도 계산처럼 쓰고 기존 `apps/web/src/lib/compliance/final-roles.ts`와 동기화 지점을 명시하지 않는다.
  - 권장 patch: Phase Alpha는 `calculateFinalRoles`를 유일한 finalRoles 계산 경로로 사용하고 High 가상 finding role만 입력으로 추가한다고 적는다.
  - closeableAfterPatch: true

- **CAP-15**: `ApproverRole` client 제외 정책이 CONTENT_STANDARDS/RISK_LEVELS enum과 충돌함
  - 위치: plan § 1.3 line 76, § 4.6 line 487~496
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 546~570; RISK_LEVELS § 3.3 line 237
  - 문제: SoT enum은 `medical|legal|operator|client`이고 schema 검증도 client를 허용한다. plan은 CA-DEFER-10으로 client 검수자를 defer하지만 RiskRule schema/requiredApproverRoles 검증에서 client를 어떻게 처리할지 정하지 않는다.
  - 권장 patch: Phase Alpha runtime은 client role을 큐 처리 불가로 fail할지, schema는 허용하되 loader에서 preset client role을 금지할지 명시한다.
  - closeableAfterPatch: true

- **CAP-16**: `unreviewed-ad-001`을 카탈로그에서 빼면서 “전건 변환” claim과 충돌함
  - 위치: plan § 2.3 line 170, § 7.3 line 747~767
  - 근거(SoT): MEDICAL_AD § 3.11 line 223~225; CONTENT_STANDARDS § 7.2 line 518
  - 문제: 별도 runtime meta 흐름 자체는 가능하지만 RuleCatalog 전건 변환 대상에서 제외되면 legalBasis 검증, ruleMatchStats, suppressed/audit, docs cascade에서 누락된다.
  - 권장 patch: `RuntimeRiskRule` 또는 `metaRule` 섹션으로 카탈로그에 등록하되 matcher가 본문 pattern 대신 metadata predicate를 평가하도록 한다. `triggeredBy`는 기존 enum상 `static-rule`로 둘지 CONTENT_STANDARDS cascade를 할지 결정한다.
  - closeableAfterPatch: true

- **CAP-17**: contextExceptions 적용 단위가 SoT의 “같은 위치”보다 넓어 false-negative 위험이 큼
  - 위치: plan § 5.1~5.2 line 512~534
  - 근거(SoT): RISK_LEVELS § 3.4.3 line 388~389; CONTENT_STANDARDS § 4.4 line 272
  - 문제: RISK_LEVELS는 “같은 위치의 해당 룰 finding 제거”라고 하는데 plan은 같은 문장 안 예외 pattern이 있으면 finding을 제거한다. 한 문장 안에 “100% 효과”와 “반드시 상담하세요”가 같이 있으면 fail 표현까지 과도하게 suppress될 수 있다.
  - 권장 patch: exception match와 finding span의 overlap 또는 bounded distance를 요구하고, 적용 대상은 `전문성 단정 (단독 어휘)`로 제한한다. fail composite은 예외 미적용을 명시한다.
  - closeableAfterPatch: true

- **CAP-18**: contextExceptions audit 위치가 § 1.2와 § 5.3에서 서로 다름
  - 위치: plan § 1.2 line 48, § 5.3 line 536, § 14 line 1100~1108
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 473~493
  - 문제: § 1.2는 `auto_check_result.suppressedByContextExceptions[]`라고 하고 이후는 `auto_check_result.extensions.suppressedByContextExceptions[]`라고 한다. JSONB 구조가 불안정하다.
  - 권장 patch: `auto_check_result.extensions.suppressedByContextExceptions` 단일 위치로 통일하고 CONTENT_STANDARDS § 7.2 cascade 여부를 확정한다.
  - closeableAfterPatch: true

- **CAP-19**: `ComplianceCheckEnvelope.extensions`와 `auto_check_result.extensions`의 위치가 충돌함
  - 위치: plan § 7.1 line 704~718, § 14.1 line 1076~1108
  - 근거(SoT): CONTENT_STANDARDS § 7.2 line 473~493; DATA_MODEL C-10 `autoCheckResult`
  - 문제: § 7.1은 envelope.result 바깥 `envelope.extensions`를 추가한다고 하고, § 14는 `auto_check_result` JSON 안 `extensions`를 둔다. 저장 시 envelope 전체를 auto_check_result에 넣는지 result만 넣는지 불명확하다.
  - 권장 patch: `ComplianceCheckResult`에 `extensions?`를 정식 optional로 cascade하거나, DB 저장 envelope `{ result, meta, extensions }`와 `auto_check_result` 컬럼 구조를 분리해 명시한다.
  - closeableAfterPatch: true

- **CAP-20**: `includes-testimonial` 평가가 RuleCatalog와 matcher 경로에 없음
  - 위치: plan § 8.1 line 773~783
  - 근거(SoT): RISK_LEVELS § 5.1 line 513
  - 문제: SoT는 testimonial flag를 composite 매칭으로 정의하지만 plan의 RuleCatalog에는 `testimonial-001`만 있고 inline flag extractor가 별도 composite을 어디서 정의·재사용하는지 불명확하다.
  - 권장 patch: `includes-testimonial`을 `testimonial-001` finding category 기반으로 추출할지, inline-flags 전용 composite matcher를 둘지 결정한다.
  - closeableAfterPatch: true

- **CAP-21**: `includes-pricing` regex가 SoT보다 좁음
  - 위치: plan § 8.1 line 773~783
  - 근거(SoT): RISK_LEVELS § 5.1 line 510
  - 문제: SoT는 `[₩$￥]\s*\d`, `\d{2,}\s*(원|만원|달러)`, `가격·비용·수가·비급여·총 비용`을 포함한다. plan은 “정규식 + 어휘” 수준으로 남겨 구현자가 누락하기 쉽다.
  - 권장 patch: SoT regex/어휘를 그대로 표에 복사하고 테스트 케이스를 추가한다.
  - closeableAfterPatch: true

- **CAP-22**: LegalDocument false-positive 완화가 dead code임
  - 위치: plan § 8.2 line 783~794
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.1 line 401~414; RISK_LEVELS § 5.1.2 line 525~528
  - 문제: LegalDocument는 compliance-assistant `check()` 진입 자체가 차단된다. 그런데 plan은 LegalDocument documentType별 inlineRiskFlag 완화를 Phase Alpha 구현 대상으로 둔다.
  - 권장 patch: LegalDocument 완화는 “공용 extractor를 직접 호출하는 테스트/미래 경로용”이라고 낮추거나, runtime check 경로에서는 실행되지 않는다고 명시한다.
  - closeableAfterPatch: true

- **CAP-23**: `field` scope를 body 전체 매칭으로 처리해 ContentScope 의미를 무력화함
  - 위치: plan § 4.3 line 451~457
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 585~589; RISK_LEVELS § 3.3 line 229~230
  - 문제: `fieldPath`는 실제 필드 단위 검증을 위한 계약인데 plan은 v0.1에서 contractId만 보고 body 전체를 매칭한다. field-scoped rule이 body 다른 영역에서 발화해도 finding이 난다.
  - 권장 patch: field scope 미지원이면 loader에서 field scope rule을 fail 또는 skip+warning 처리한다. “body 전체 매칭”은 field scope와 동등하지 않다.
  - closeableAfterPatch: true

- **CAP-24**: block scope 미지원이 FAQ Q/A와 citation 예외에 직접 영향
  - 위치: plan § 4.3 line 457
  - 근거(SoT): CONTENT_STANDARDS § 2.1.1 line 102, § 7.4 line 588
  - 문제: Phase Alpha가 FAQ 자동 검수를 해소하려면 Q/A 단위와 citation/media block을 구분해야 하는데 block scope를 전부 미사용으로 둔다. FAQ 답변 단위 위험도와 인용 면제 판정이 body 전체 매칭으로 뭉개진다.
  - 권장 patch: 최소 `qa` block scope만 Phase Alpha에 포함하거나, FAQ는 Q+A 결합 body 외에 block metadata를 생성해 matcher에 전달한다.
  - closeableAfterPatch: true

- **CAP-25**: `CA-DEFER-20/21/22` 신설 marker가 § 1.3 defer 표와 CA-CASCADE에 빠짐
  - 위치: plan § 4.3 line 456~457, § 6.5 line 608~612, § 1.3 line 66~83
  - 근거(SoT): M0_PLAN § 9 CA-DEFER marker 체계
  - 문제: fieldPath, block scope, KSS가 새 defer로 등장하지만 § 1.3의 공식 defer 목록에는 CA-DEFER-20/21/22가 완전히 정리되지 않았다.
  - 권장 patch: 신설 marker 전부를 § 1.3 표와 M0_PLAN cascade에 추가하고 phase target을 명시한다.
  - closeableAfterPatch: true

- **CAP-26**: catalogHash에 `kssAvailable=false` suffix를 영구 포함하는 결정이 cacheKey SoT와 불명확함
  - 위치: plan § 3.4 line 390, § 6.5 line 610
  - 근거(SoT): compliance-assistant § 0 cache/idempotency, § 4.2; RISK_LEVELS § 3.5
  - 문제: 캐시 자체는 Beta defer인데 catalogHash는 Phase Alpha에 저장된다. `kssAvailable`은 런타임 capability이지 룰 데이터가 아니므로 hash에 넣으면 환경 차이로 같은 catalog가 다른 hash를 갖는다.
  - 권장 patch: `catalogHash`는 데이터 파일 hash로 고정하고, `engineVersion` 또는 `matcherCapabilities.kss`를 별도 메타로 저장한다.
  - closeableAfterPatch: true

- **CAP-27**: `medical-law-tracking.yaml` baseline이 실제 SoT revision과 충돌할 수 있음
  - 위치: plan § 2.6 line 269~288
  - 근거(SoT): MEDICAL_AD § 11.2 line 560; RISK_LEVELS § 7.1
  - 문제: MEDICAL_AD는 2026-04-07 시행 의료법 본문 확인 revision을 이미 기록한다. plan은 `v0.0.0-baseline` placeholder 1건만 넣어 실제 확인 revision을 제거한 것처럼 보인다.
  - 권장 patch: baseline placeholder 대신 SoT의 2026-04-07 reaffirmation revision을 seed로 넣거나, placeholder와 SoT revision의 관계를 명시한다.
  - closeableAfterPatch: true

- **CAP-28**: `rules.core.yaml`와 `rules.medical-ad.yaml` 분리가 CONTENT_STANDARDS § 4.1 SoT 중복/누락을 만들 수 있음
  - 위치: plan § 2.4 line 180~191
  - 근거(SoT): CONTENT_STANDARDS § 4.1 line 154~207
  - 문제: 최상급·보장·전문성 단정은 CONTENT_STANDARDS core 표현 SoT인데 plan은 medical-ad 파일로 옮긴다. “Core 룰 4종”만 두면 CONTENT_STANDARDS § 4.1 전체 변환이라는 RISK_LEVELS 예시와 파일 책임이 어긋난다.
  - 권장 patch: core 파일은 표현 SoT 기준, medical-ad 파일은 legalBasis overlay 기준으로 둘지 결정한다. 현재처럼 분리하려면 sourceDoc과 cascade 근거를 명확히 적는다.
  - closeableAfterPatch: true

- **CAP-29**: `false-statement-001`의 “인용 부재 검사”가 regex patternType과 맞지 않음
  - 위치: plan § 2.3 line 161
  - 근거(SoT): CONTENT_STANDARDS § 3.5 line 207; § 7.4 line 536~582
  - 문제: “국내/세계 1위 + 인용 부재”는 body regex 하나로 판정할 수 없고 citation block/embeddedMedia/evidenceNotes와 인접 단락 검사가 필요하다. patternType=regex로 두면 구현 불가능한 조건이 숨는다.
  - 권장 patch: composite 또는 runtime evidence predicate로 분리하고 `citationAbsence` evaluation contract를 명시한다.
  - closeableAfterPatch: true

- **CAP-30**: `side-effect-missing-001`의 “부재” composite가 schema logic에 없음
  - 위치: plan § 2.3 line 165
  - 근거(SoT): CONTENT_STANDARDS § 7.4 line 555~582; RISK_LEVELS § 3.3 line 214~220
  - 문제: `AND_IN_PARAGRAPH 역방향 평가`는 현재 CompositeRiskRule logic enum에 없다. “treatment 어휘 + 부작용/금기 어휘 부재”는 negative operand가 필요한데 schema와 matcher가 이를 지원하지 않는다.
  - 권장 patch: `NOT_IN_PARAGRAPH`/negative operand를 schema cascade하거나 해당 룰을 Phase Beta로 defer한다.
  - closeableAfterPatch: true

## minor
- **CAP-31**: plan SoT 목록의 실코드 경로가 틀림
  - 위치: plan SoT line 22, § 13.1 line 1044
  - 근거(SoT): 실코드 `apps/web/src/lib/eat-content-schema.ts`
  - 문제: `apps/web/src/lib/zod/eat-content-schema.ts`는 존재하지 않는다.
  - 권장 patch: 경로를 `apps/web/src/lib/eat-content-schema.ts`로 수정한다.
  - closeableAfterPatch: true

- **CAP-32**: “FAQ 기존 draft row는 sentinel row 없음” 가설이 C0016과 어긋남
  - 위치: plan § 1.4 line 89
  - 근거(SoT): C0016 line 134~159
  - 문제: C0016은 FAQ published row가 없을 것으로 예상하지만 published FAQ가 있으면 sentinel backfill을 수행한다. “sentinel row 없음”은 절대 가정으로 쓰면 안 된다.
  - 권장 patch: “기존 published FAQ는 원칙적으로 0건이나 C0016 guard/backfill로 예외 처리됨”으로 수정한다.
  - closeableAfterPatch: true

- **CAP-33**: Priority/SLA 정책이 REVIEW_WORKFLOW와 부분 불일치함
  - 위치: plan § 12.4 line 1034~1042
  - 근거(SoT): REVIEW_WORKFLOW § 3.3 line 190~199
  - 문제: content-gate는 P0, 영업일 3일, `content-gate-queued` 알림이 SoT인데 plan은 P1/P0 분기나 slaDueAt 산정 근거를 충분히 고정하지 않는다.
  - 권장 patch: REVIEW_WORKFLOW § 3.3 표를 그대로 인용하고 `slaDueAt = businessDays(3)` 산정 주체를 명시한다.
  - closeableAfterPatch: true

- **CAP-34**: Publication/MediaAppearance unlock 설명이 EC-DEFER-12와 혼동됨
  - 위치: plan § 13.4 line 1070
  - 근거(SoT): CONTENT_STANDARDS § 7.1.1.2 line 422~428; DATA_MODEL C-24/C-25 line 950~978
  - 문제: 외부 인용 entity는 RiskRule/RiskInference 면제지만 status unlock 자체는 EC-DEFER-12 별도 과제다. “Phase Beta 안 별도 unlock”이라고만 하면 EC-DEFER-12의 전체 잔여 범위가 불명확하다.
  - 권장 patch: 본 cycle은 FAQ만 EC-DEFER-12 부분 해소, Publication/MediaAppearance는 `status` schema unlock 미포함이라고 명시한다.
  - closeableAfterPatch: true

- **CAP-35**: scenario #37 findings count가 High 가상 finding 포함 여부와 모순됨
  - 위치: plan § 16.7 line 1233
  - 근거(SoT): RISK_LEVELS § 6.1 line 573~580; CONTENT_STANDARDS § 7.1.2 line 432~447
  - 문제: “guarantee-composite fail + includes-effect-claim + RiskInference High 가상 finding”이면 findings는 최소 2개지만 fail과 standalone 동시 매칭 여부에 따라 3개도 가능하다. plan은 `findings.length=2`로 고정한다.
  - 권장 patch: 기대값을 rule set별로 정확히 나누거나 “contains ruleIds”로 검증한다.
  - closeableAfterPatch: true

## nit
- **CAP-36**: plan 내부에서 CA-CASCADE 번호가 중복/불안정하게 쓰임
  - 위치: plan § 1.2 line 64, § 18 line 1274~1282
  - 근거(SoT): M0_PLAN marker 운영 패턴
  - 문제: § 1.2는 docs cascade를 CA-CASCADE-02~06으로만 요약하지만 § 18은 01~09를 둔다. 리뷰·패치 추적 시 누락처럼 보인다.
  - 권장 patch: § 1.2 요약도 CA-CASCADE-01~09 전체를 가리키도록 수정한다.
  - closeableAfterPatch: true

## acceptance precondition 점검
- 18 canonical 룰 정합: FAIL
- 5 inlineRiskFlags 추출 표 정합: FAIL
- RiskInference MAX 결합 + steps 정합: FAIL
- contextExceptions OR 결합 + 같은 문장 단위 정합: FAIL
- High 가상 finding triggeredBy 판정 정합: FAIL
- CA-DEFER 5 phase 분류 정합: FAIL
- CA-CASCADE 9종 정합: FAIL

=== CYCLE SIGNAL ===
cycle: 1
total_findings: 36
blocking: 10
major: 20
minor: 5
nit: 1
closeable_after_patch_ratio: 97%
ready_for_acceptance: false
scope_narrow_acceptable: false
recommendation: "다음 cycle 진입 권장"
