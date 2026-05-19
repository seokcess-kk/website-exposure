You are reviewing `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v0.6 — **cycle 6**. cycle 1~5 누계 53 finding 전건 수용. 수렴 추세 36 → 11 → 3 → 2 → 1. cycle 5 안 모든 acceptance precondition PASS · blocking 0 유지 · closeable 100% 유지. **acceptance 도달 cycle 추정**.

## cycle 5 결정·patch 요약

- **CAP5-01**: § 17.b 4 action 책임 분리 정합 — M0_PLAN § 6.1 정합. mapComplianceErrorToResult helper 위치 `apps/web/src/lib/compliance/action-errors.ts` 신규.

## 본 cycle 검증 우선순위

cycle 5 patch 정합성 + 최종 잔존 결함. 0 finding 도달 시 `ready_for_acceptance=true` + `recommendation: "acceptance 권장"` 명시.

### cycle 5 patch 재검증
1. **CAP5-01 cycle 5 정정**: § 17.b 안 4 action 책임 분리 명시 — (a) submitForReviewAction = check + envelope persist + auto-gate · (b) approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · (c) rejectContentAction = transition validation · (d) publishContentAction = evaluatePublishable + publish transition. M0_PLAN § 6.1 책임 정합 검증
2. **mapComplianceErrorToResult helper 위치**: `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. helper shape `(e: unknown) => ActionResult | null`. 3 error type (ComplianceConfigError · ComplianceTransitionError · ReviewerEligibilityError) form-level 변환

### Codex 비평 운영 원칙
- 0 finding 도달 시 **`ready_for_acceptance=true` + `recommendation: "acceptance 권장"`** 명시
- 잔존 1+ finding 시 cycle 7 진입 권장
- 새로운 결함 ID prefix = **CAP6** (cycle 6 신규)
- cycle 1~5 잔존 finding 직접 인용

## SoT (cycle 1~5 동일)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 36 → cycle 2 = 11 → cycle 3 = 3 → cycle 4 = 2 → cycle 5 = 1 → cycle 6 = N

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
cycle: 6
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
