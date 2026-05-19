Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.5 cycle 5.

## Cycle 4 patch (2 findings)

| # | severity | title | patch |
|---|---|---|---|
| ECP-34 | major | ARCH § 3.8 표 "10 페이지" | ARCH § 3.8 표 "11 페이지" + P-011 FAQ row 추가 + P-002/P-004 EAT v0.x marker + 어드민 화면 수 6→7 |
| ECP-35 | minor | PAGE_TYPES "어드민 화면 수 6개 유지" 잔재 | P-013/P-014 상세에서 "P-013/P-014 자체 화면 없음" 으로 정정 + § 6 어드민 7개 reference |

## Task

cycle 4 의 2건 검증 + 새 finding 확인. 짧게.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=N

## cycle 4 patch 검증
- ECP-34: PASS/FAIL + 한 줄
- ECP-35: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 35 findings 합산
```

cycle 4 의 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
