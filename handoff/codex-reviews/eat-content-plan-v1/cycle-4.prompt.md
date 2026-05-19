Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.4 cycle 4.

## Cycle 3 patch (3 findings)

| # | severity | title | patch |
|---|---|---|---|
| ECP-31 | major | PAGE_TYPES § 5 matrix + § 6 P-011 M0 미합류 | § 5 matrix row P-011 ✅ + § 6 페이지 #10 P-011 추가 + 어드민 화면 수 6→7 + 우선순위 P-011 strike-through |
| ECP-32 | minor | DATA_MODEL § 0 "23개 계약" 충돌 | "25개 계약 (C-01~C-25)" |
| ECP-33 | minor | DATA_MODEL ComplianceRecord 대상 범위 | "C-01~C-22" → "C-01~C-25" |

## Task

cycle 3 의 3 patch 각각 검증 + 새 finding. 짧게.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=N

## cycle 3 patch 검증
- ECP-31: PASS/FAIL + 한 줄
- ECP-32: PASS/FAIL
- ECP-33: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
```

cycle 3 의 3건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
