Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.5 — **cycle 5**. cycle 4 1 finding patch + 새 blocking/major/minor 확인. 짧게.

## Cycle 4 patch (1 finding)

| # | severity | title | patch |
|---|---|---|---|
| CAM4-01 | major | § 1.1 LegalDocument 면제 잔재 | "auto_check_result 슬롯에 envelope 저장" → result 슬롯 SoT 7 필드만 · exemptReason 은 compliance_record.metadata 슬롯 |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=2 → cycle4=1 → cycle5=N

## cycle 4 patch 검증
- CAM4-01: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 4 의 1건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
