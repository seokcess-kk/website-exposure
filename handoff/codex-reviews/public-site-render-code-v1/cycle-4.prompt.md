You are reviewing **cycle 4** of PUBLIC_SITE_RENDER code v1.0. Cycle 3 had 2 findings (blocking 1 + major 1). All 2 patched. typecheck PASS.

## Cycle 3 patch summary

| # | severity | title | patch |
|---|---|---|---|
| PSRC-19 | blocking | ItemList.item `{@id, name}` pure ref unresolved | `item` 에 `@type: "Physician" / "MedicalProcedure"` 추가 → inline self-contained · itemListEntity 시그니처에 itemType 인자 추가 · 2 caller 갱신 |
| PSRC-20 | major | cross-page allowlist 가 origin 만 비교 | tenant base path 까지 비교 — `isCrossPageRef` 와 새 `isSameTenantUrl` 모두 path prefix 검사 |

## Re-review scope (cycle 4)

- `apps/web/src/lib/json-ld/entities.ts` (itemListEntity 시그니처)
- `apps/web/src/lib/json-ld/builders.ts` (2 caller)
- `apps/web/src/lib/json-ld/__tests__/validate.ts` (allowlist + same-tenant check)
- pages 4 (variant changes)

## What to check (cycle 4)

1. cycle 3 patch 정합 — Inline `@type` 객체가 rule checker self-contained inline 으로 통과
2. `isSameTenantUrl` 의 tenant base path prefix 검사 정합 (multi-tenant 회피)
3. typecheck 유지
4. 새 finding (PSRC-21+)
5. closeableAfterPatch=true 신호 검증

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2 → cycle4=N

## cycle 3 patch 검증
- PSRC-19: PASS|FAIL
- PSRC-20: PASS|FAIL

## new findings (PSRC-21+)

## acceptance 판정
```

cycle 3 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.
