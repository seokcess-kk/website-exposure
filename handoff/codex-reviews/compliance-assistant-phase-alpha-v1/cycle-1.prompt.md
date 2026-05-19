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
