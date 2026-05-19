You are reviewing **cycle 3** of the PUBLIC_SITE_RENDER code v1.0. Cycle 2 had **3 findings** (blocking=1, major=2). All 3 patched. `pnpm --filter @glitzy/web typecheck` PASS.

## Cycle 2 patches

| # | severity | title | patch summary |
|---|---|---|---|
| PSRC-16 | blocking | rule checker가 `#website` unresolved 로 실패 | cross-page reference allowlist (`#organization`/`#website`/`#clinic`) — same-origin URL + 등록된 fragment 는 graph entity 미존재 OK |
| PSRC-17 | major | P-003/004/005/010 MedicalClinic 풀 entity가 plan SoT(`[참조]`) 와 충돌 | builders 의 cycle 1 PSR-05 patch 일부 revert — 풀 entity 출력 제거, webPageEntity `aboutClinic` 옵션 제거. P-006 만 풀 entity 유지 (SCHEMA_MAPPING § 2.5 정합) |
| PSRC-18 | major | inline `@id` 참조도 검사 안 됨 | rule checker — `@type` 있는 객체 = self-contained inline (검사 제외, recurse 만). pure ref (`@id` 만) 만 same-origin 검사 |

caller 4곳 (doctors/page · doctors/[slug] · treatments/page · insights) 의 builder 호출 시그니처도 cycle 1 patch 의 location 인자 제거.

## Re-review scope (cycle 3)

같은 영역 + 누적 점검:
- `apps/web/src/lib/json-ld/builders.ts` · `entities.ts` · `__tests__/validate.ts`
- 4 caller pages

## What to check (cycle 3)

1. cycle 2 patch 가 plan SoT 와 일관
   - rule checker 안 cross-page allowlist 가 SCHEMA_MAPPING § 2.5 의 SoT cross-page reference 패턴 (P-002+ 모든 페이지의 `isPartOf #website` · WebPage.about ref 등) 을 정확히 표현
   - PSRC-17 revert 가 SCHEMA_MAPPING § 2.5 표 (P-003/4/5/10 = `[참조]` MedicalClinic) 정합
   - inline `@id` 객체 (Article author with `name/jobTitle/image`) 가 checker 통과
2. 회귀 — typecheck PASS 유지 + 시그니처 변경 cascade 정합
3. scenario 1~23 통과 추론 (특히 #10 entity 풀/참조 + #18 자체 rule checker)
4. 새 finding (PSRC-19+)

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=N

## cycle 2 patch 검증
- PSRC-16: PASS|FAIL|PARTIAL
- PSRC-17: PASS|FAIL|PARTIAL
- PSRC-18: PASS|FAIL|PARTIAL

## new findings (PSRC-19+)

## acceptance precondition (PSR-CASCADE-01b)
- PSR-CASCADE-01b: <PASS|FAIL>

## acceptance 판정
- closeableAfterPatch=true 이면 acceptance 권고
```

한국어로 응답.
