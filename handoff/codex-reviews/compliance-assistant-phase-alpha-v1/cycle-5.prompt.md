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
