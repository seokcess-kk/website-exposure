# Codex 자동 비평 요청 — compliance-assistant Phase Alpha code cycle 1

## 당신의 역할

당신은 시니어 소프트웨어 아키텍트 검수자다. 본 monorepo 안 새로 작성된 **compliance-assistant Phase Alpha 코드 30+ 파일**을 냉정하게 비평한다.

## 비평 운영 원칙

- 5사이클 고정이 아닌 **closeableAfterPatch 신호 누적 → 수렴** 기준.
- ready_for_acceptance=true 신호로 종결.
- 본 monorepo 코드 비평 패턴 (cycle별 10~30 지적 normal · M0 code v1.0 = 17 finding · location-legal code v1.0 = 19 finding).
- **얕은 trivia 보다 실질 결함을 우선 잡는다**:
  - Plan v1.0 명세와 코드 불일치
  - data/compliance-rules/ yaml 데이터 정확성 (정규식 한국어 어휘·composite operand·legalBasis 매핑)
  - packages/compliance-rules/ 로더·matcher·composite·KSS·exceptions·inline-flags·risk-inference 알고리즘 SoT 정합
  - apps/web/src/lib/compliance/check.ts 9단계 흐름 정확성
  - auto-gate (CA-DEFER-15) + types.ts ExtensionsRecord + server-actions.ts persist 합성
  - C0017/C0018 migrations + Drizzle schema v0.6 정합
  - vitest scenarios 정합 (M0 25 + Phase Alpha 26)

## 비평 대상

### Phase Alpha 안 신규/변경 파일 30+
- `data/compliance-rules/` 7 파일 (meta.yaml · rules.core.yaml · rules.medical-ad.yaml · context-exceptions.yaml · medical-law-tracking.yaml · slot-matches.yaml · schema.json)
- `packages/compliance-rules/` 신규 패키지 (package.json · tsconfig.json · src/ 12 files · scripts/build.mjs)
- `apps/web/src/lib/compliance/` (types.ts 확장 · check.ts 완전 재작성 · auto-gate.ts 신규 · action-errors.ts 신규)
- `apps/web/src/lib/compliance/server-actions.ts` (envelope persist 합성 + content-gate 자동 큐 진입 patch)
- `apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts` (26 신규 scenarios)
- `apps/web/src/lib/compliance/__tests__/compliance.test.ts` (M0 25 scenarios — Phase Alpha cascade 정합 patch)
- `packages/core-content/migrations/C0017_content_gate_queue_enum.sql` 신규
- `packages/core-content/migrations/C0018_review_queue_unique_redefine.sql` 신규
- `packages/core-content/src/schema.ts` (reviewQueueType enum + unique index v0.6)
- `packages/migrations-runner/src/manifest.ts` (21단계)
- `apps/web/package.json` (@glitzy/compliance-rules dependency 추가)

### 7 docs cascade
- `docs/compliance/RISK_LEVELS.md` § 2.3.1 (evaluatedSteps + contributingSteps) + § 3.4.1 (loadOrder.slotMatches)
- `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker)
- `docs/core/CONTENT_STANDARDS.md` § 7.1 (metadata 신규 7 필드)
- `docs/admin/REVIEW_WORKFLOW.md` § 3 (content-gate 활성화)
- `docs/decisions/EAT_CONTENT_PLAN.md` § 11 (EC-DEFER-05 해소)
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 (27 SoT 매핑 marker)

## SoT (반드시 직접 읽고 코드와 대조)

- `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v1.0 (cycle 1~7 acceptance · 54 finding 전건 수용 plan)
- `docs/features/compliance-assistant.md` v1.0 (Feature spec · § 3 check() · § 4.1 9단계 · § 4.3 composite · § 4.4 contextExceptions · § 6 RiskInference · § 7 룰 카탈로그)
- `docs/compliance/RISK_LEVELS.md` v1.3 (§ 2 RiskInference · § 3 RuleCatalog · § 5 inlineRiskFlags · § 6 위험도 자동 동작 매트릭스)
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 (§ 3.1~3.14 의료법 매핑)
- `docs/core/CONTENT_STANDARDS.md` v1.4 (§ 7 인터페이스)
- `docs/admin/REVIEW_WORKFLOW.md` (§ 3 큐 · § 3.3 priority/SLA · § 9.1.1 알림)
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 (M0 stub 위치 · § 9.4 신설 CA-DEFER 12종 cascade)
- `packages/compliance-rules/src/types.ts` · `loader.ts` · `matcher.ts` · `composite.ts` · `exceptions.ts` · `inline-flags.ts` · `risk-inference.ts` · `slot-match.ts` · `hash.ts` · `kss.ts`
- `apps/web/src/lib/compliance/types.ts` · `check.ts` · `auto-gate.ts` · `action-errors.ts` · `server-actions.ts`
- `packages/core-content/src/schema.ts` (reviewQueueType + unique index)
- `packages/core-content/migrations/C0015_review_queue_entry.sql` (실 unique constraint 확인)
- `packages/migrations-runner/src/manifest.ts` (21단계 cascade)
- 루트 `package.json` · `pnpm-workspace.yaml`

## 비평 산출물 형식

### A. Finding 리스트

```
- id: CAP-CODE-NN
  severity: major | minor | nit
  location: "<file>:L<line>" 또는 "<file> § <section>"
  issue: "<무엇이 문제인가 — 1~3문장>"
  rationale: "<왜 문제인가 — SoT 또는 코드 직접 인용>"
  suggestion: "<close 권고 · defer 권고 · 추가 검토 권고>"
  closeableAfterPatch: true | false
```

severity 기준:
- **major**: Plan v1.0 불일치 · 알고리즘 결함 · 정규식 한국어 어휘 오류 · runtime crash 가능 · runtime 보안 결함
- **minor**: 일관성 부족 · 타입 narrow 부족 · 룰 데이터 누락 · 운영 시나리오 미커버
- **nit**: 문구 · 표현 · import 정리

### B. 누계 시그널

```
=== CYCLE SIGNAL ===
cycle: 1
total_findings: <NN>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: false
scope_narrow_acceptable: true|false
recommendation: "다음 cycle 진입 권장"
```

## 중점 검증 항목 (체크리스트)

### 1. Plan v1.0 ↔ 코드 정합
- § 7.1 check() 9단계 흐름 — 모든 단계 코드 구현 (1: LegalDocument 차단 · 2: pageTypeId 유도 · 3: articleType 검증 · 4: 카탈로그 로드 · 5: matchRules · 6: evaluateInline · 7: evaluateSlots · 8: inferRisk · 9: 외부 inferredRiskLevel MAX · 10: High 가상 finding · 11: priorReviewRequired meta · 12: 집계 · 13: calculateFinalRoles)
- § 2.4 27 SoT 슬롯 매핑 표 ↔ rules.core.yaml 14 + rules.medical-ad.yaml 13 신규 + 11 overrides
- § 3.4 catalogHash (6 YAML 데이터 한정) + schemaHash 분리
- § 5 contextExceptions 알고리즘 (overlap + fail composite 예외)
- § 7.1.1 extractFindingRoles helper (flatten + dedupe + non-array guard)
- § 7.1.2 calculateFinalRoles throw boundary
- § 8 inlineRiskFlags 5종 추출 (SoT 7 카테고리 정확 매칭)
- § 10.1 RiskInference 알고리즘 (evaluatedSteps + contributingSteps 분리)
- § 11 High 가상 finding triggeredBy (explicit 우선)
- § 12 enqueueContentGateIfNeeded (block 제외 + content-gate 큐)
- § 15 C0017 (enum) + C0018 (UNIQUE 재정의)
- § 17.b mapComplianceErrorToResult helper

### 2. data/compliance-rules/ yaml 데이터 정확성
- rules.core.yaml 14 룰 — 각 category 가 CONTENT_STANDARDS § 4.1 SoT 정확 일치
- rules.medical-ad.yaml 13 신규 룰 — 의료법 조문 legalBasis 정확 매핑
- 11 overrides — targetRuleId 가 rules.core.yaml 안 존재 검증
- context-exceptions.yaml 5종 — 한국어 정규식 정확성
- medical-law-tracking.yaml 2026-04-07 reaffirmation seed — sourceUrl · checkedBy 정합
- slot-matches.yaml v0.0 placeholder 비어 있음
- schema.json JSON Schema Draft-07 — riskRule oneOf · contextException · slotMatch 검증

### 3. packages/compliance-rules/ 알고리즘 정합
- loader.ts findCatalogRoot 자동 검색 (apps/web 안 vitest 실행 시 monorepo root 상향)
- matcher.ts shouldSkipRule (event-fact-statement allowlist pre-check · CAP2-02)
- composite.ts AND_IN_SENTENCE 알고리즘 (KSS fallback splitWithOffsets)
- exceptions.ts span overlap + fail composite 예외 (CAP-17)
- inline-flags.ts SoT 7 카테고리 정확 매칭 + testimonial finding 기반 (CAP-20)
- risk-inference.ts evaluatedSteps + contributingSteps 분리 (CAP-12)
- slot-match.ts v0.1 빈 배열
- hash.ts catalogHash (6 YAML) + schemaHash (schema.json) 분리 (CAP-26)
- kss.ts v0.1 fallback 정규식만 (CA-DEFER-22)

### 4. apps/web/src/lib/compliance/ 정합
- check.ts 9단계 — 단계 누락 없음
- adaptCrFinding — packages/compliance-rules Finding type → apps/web Finding type 변환 정합
- auto-gate.ts enqueueContentGateIfNeeded — gateRequired && automatedDecision !== 'block' (CAP-06) + 명시 인자 contentType/contentRef (CAP2-01)
- action-errors.ts mapComplianceErrorToResult — SaveResult fieldErrors required 정합 (CAP6-01)
- types.ts ExtensionsRecord — 7 field 풀명세 (suppressedByContextExceptions · inlineRiskFlagsEvidence · evaluatedSteps · contributingSteps · ruleMatchStats · inferredRiskLevelMismatch · clientRolePresent · engineMetadata)
- server-actions.ts persist 합성 — `{ ...envelope.result, extensions: envelope.extensions ?? null }` (CAP-19)
- server-actions.ts submitForReview 안 content-gate 자동 큐 INSERT (CA-DEFER-15 부분 해소)

### 5. C0017/C0018 + Drizzle schema v0.6
- C0017_content_gate_queue_enum.sql — ALTER TYPE ADD VALUE IF NOT EXISTS 단독 (Postgres ALTER TYPE 트랜잭션 제약)
- C0018_review_queue_unique_redefine.sql — DROP + CREATE (queue_type 포함 4-tuple partial unique)
- packages/core-content/src/schema.ts reviewQueueTypeEnum 안 'content-gate' 추가
- packages/core-content/src/schema.ts reviewQueueEntry openUnique 안 queueType 포함
- packages/migrations-runner/src/manifest.ts 21단계 (M0 19 + C0017 + C0018)

### 6. vitest scenarios 정합
- compliance.test.ts 25 scenarios — Phase Alpha cascade 정합 (articleType 추가 · manualReview=false · risk-level-high-gate ruleId)
- phase-alpha.test.ts 26 scenarios — 룰 매칭 5 + composite 2 + contextExceptions 3 + inlineFlags 3 + RiskInference 4 + FAQ 2 + catalog 검증 7

### 7. 7 docs cascade 정합
- RISK_LEVELS § 2.3.1 evaluatedSteps + contributingSteps 분리 명시
- RISK_LEVELS § 3.4.1 loadOrder.slotMatches[] 카테고리 추가
- compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22)
- CONTENT_STANDARDS § 7.1 metadata 신규 7 필드 cascade
- REVIEW_WORKFLOW § 3.1 content-gate 활성화 marker
- EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 marker
- MEDICAL_AD § 3.0 27 SoT 매핑 marker

### 8. typecheck + vitest 통과 확인
- pnpm --filter @glitzy/web typecheck → PASS
- pnpm --filter @glitzy/compliance-rules typecheck → PASS
- apps/web vitest 98/98 PASS

### 9. plan ↔ code drift marker
- plan § 2.4 안 "13 신규 룰" 정합 (v0.5 cycle 4 patch 안 "11 신규" → "13 신규" cascade)
- plan § 17.b mapComplianceErrorToResult — apps/web entity-actions.ts + review-queue/actions.ts 안 이미 inline try/catch 적용됨 → helper 미적용 vs plan 정합

### 10. 운영 시나리오
- catalog 로드 실패 시 fail closed (throw) — check() bubble + server action try/catch boundary
- content-gate 큐 + manual-review 큐 동시 진입 시 발행 게이트 AND
- C0018 unique 재정의 시 운영 중 race 가능성
- catalogHash 변경 시 staleFlags 미발생 (CA-DEFER-06)

## 출력 분량 가이드

- finding 15~30 개 사이 normal
- 한 finding 당 4~7줄
- 마지막 시그널 블록 짧고 정확하게
- markdown 으로 출력
- 산출물 외 prose 없음 (인사 · 결언 X)

## 시작

cycle 1 시작. 산출물 외 어떤 prose 도 출력하지 말 것.
