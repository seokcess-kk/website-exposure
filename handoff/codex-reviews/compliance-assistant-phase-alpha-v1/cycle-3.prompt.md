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
