Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.6 cycle 6.

## Cycle 5 patch (1 major)

| # | severity | title | patch |
|---|---|---|---|
| ECP-36 | major | ARCH § 3.8.2 "어드민 화면 수 6개 유지" 잔재 | "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)" 로 정정 |

## Task

cycle 5 의 1건 검증. acceptance 신호 확인.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1 → cycle6=N

## cycle 5 patch 검증
- ECP-36: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 36 findings
```

cycle 5 PASS + 새 finding 0 이면 closeableAfterPatch=true 확정.
