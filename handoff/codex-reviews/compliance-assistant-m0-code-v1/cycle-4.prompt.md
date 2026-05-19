Review code of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 4**. cycle 3 1 finding patch 검증 + 새 finding 확인. 짧게.

## Cycle 3 patch

| # | severity | patch |
|---|---|---|
| CAMC3-01 | major | approveContent · rejectContent 안 entry.content_type / content_ref 와 args 정합 검증 (drift 차단) |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1 → cycle4=N

## cycle 3 patch 검증
- CAMC3-01: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
```

cycle 3 1건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
