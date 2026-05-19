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
