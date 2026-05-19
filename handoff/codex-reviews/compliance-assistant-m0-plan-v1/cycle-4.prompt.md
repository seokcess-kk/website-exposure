Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.4 — **cycle 4**. cycle 3 2 finding patch + 새 blocking/major/minor 확인. 짧게.

## Cycle 3 patch (2 findings, blocking 0 · major 2 · minor 0)

| # | severity | title | patch |
|---|---|---|---|
| CAM3-01 | major | § 1.2 stub 요약 안 잔재 | "summary 등 모두 포함" → result 7 필드만 명시 + envelope.meta 분리 |
| CAM3-02 | major | 시나리오 #3 + #13 잔재 | auto_check_result.exemptReason → compliance_record.metadata 슬롯 + check() throw 검증 |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=2 → cycle4=N

## cycle 3 patch 검증
- CAM3-01: PASS/FAIL + 한 줄
- CAM3-02: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 3 의 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
