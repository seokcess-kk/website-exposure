You are reviewing **cycle 5** of PUBLIC_SITE_RENDER code v1.0. Cycle 4 had 1 major (PSRC-21: cross-tenant same-origin URL이 외부 dereferenceable 예외로 통과). Patched.

## Cycle 4 patch

| # | severity | title | patch |
|---|---|---|---|
| PSRC-21 | major | cross-tenant same-origin URL 외부 예외 | validate.ts pure ref 분기 — refOrigin === siteOrigin 인 모든 ref 를 검사. same-tenant 면 unresolved, cross-tenant 면 forbidden. 진짜 외부 origin 만 dereferenceable 예외 |

`pnpm --filter @glitzy/web typecheck` PASS.

## Re-review scope (cycle 5)

- `apps/web/src/lib/json-ld/__tests__/validate.ts` (pure ref 분기 강화)

## What to check (cycle 5)

1. cycle 4 patch 검증 — cross-tenant same-origin URL 이 forbidden 으로 잡히는지
2. cross-page allowlist (`#organization/#website/#clinic`) 가 tenant base path 정합 시에만 통과
3. typecheck 유지
4. 새 finding (PSRC-22+) — 마지막 cycle 단순화
5. **closeableAfterPatch=true** 신호 — blocking 0 + major 0 + minor 0 잔존이면 acceptance commit 가능

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2 → cycle4=1 → cycle5=N

## cycle 4 patch 검증
- PSRC-21: PASS|FAIL + 근거

## new findings (PSRC-22+)

## acceptance 판정
- closeableAfterPatch=true: yes/no
- 누계 합산 findings 22 건 (15+3+2+1+1)
- code v1.0 acceptance commit 권고 yes/no
```

한국어로 응답. 짧게.
