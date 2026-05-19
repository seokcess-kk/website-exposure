Review the **code implementation** of `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — **cycle 3**. cycle 2 의 1 finding patch 적용 검증 + 새 blocking/major 확인.

## Cycle 2 patch (1 finding, blocking=0 major=0 minor=1)

| # | severity | title | patch |
|---|---|---|---|
| ECC-07 | minor | C0013 constraint guard `conrelid` 한정 | `pg_constraint` 조회에 `conrelid = 'article'::regclass` AND 조건 추가 |

## Verification

cycle 2 의 1 patch PASS 검증 + 새 blocking/major 확인. 짧게.

검증 파일:
- `packages/core-content/migrations/C0013_article_category_fk.sql` (line 45~52: `conrelid = 'article'::regclass` 한정)

## Output (한국어 · 간결)

```
# EAT_CONTENT code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=6 → cycle2=1 → cycle3=N

## cycle 2 patch 검증
- ECC-07: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 EAT_CONTENT code v1.0 acceptance 진행 권고
- 누계 시작점 144 cycle 1224 → ?
```

cycle 2 의 1건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
