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
