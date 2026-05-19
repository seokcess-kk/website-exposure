Review the **code implementation** of `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — **cycle 2**. cycle 1 의 6 finding 모두 patch 적용 검증 + 새 blocking/major/minor 확인.

## Cycle 1 patch (6 findings, blocking=1 major=3 minor=2)

| # | severity | title | patch |
|---|---|---|---|
| ECC-01 | blocking | C0013 idempotency | `ADD COLUMN IF NOT EXISTS` · `ON CONFLICT DO NOTHING` · NULL 잔존 검증 DO $$ BEGIN ... RAISE EXCEPTION · constraint NOT EXISTS guard · `CREATE INDEX IF NOT EXISTS` |
| ECC-02 | major | `general` rename 차단 | server action: `originalSlug==='general' && parsed.slug!=='general'` 분기 → `default-rename-forbidden` field error. form: `isDefault` prop 안내 배너 + slug input readOnly |
| ECC-03 | major | Article categoryId 사전 resolve | form 값 있으면 same-tx SELECT instance-scoped → `category-not-found` field error 변환 |
| ECC-04 | major | ArticleCategory delete race | 대상 row `FOR UPDATE` 잠금 + catch 안 FK field mapping (`categoryId`) 도 form-level "사용 중" 메시지 변환 |
| ECC-05 | minor | Markdown image regex 순서 | image `![alt](url)` 치환을 link `[text](url)` 보다 먼저 |
| ECC-06 | minor | FAQ summary disclosure affordance | chevron `⌃` aria-hidden + `group-open:rotate-180` + `group-open:bg-slate-50` |

## Verification

cycle 1 의 6 patch 각각 PASS 검증 + 새 blocking/major/minor 확인.

검증 파일:
- `packages/core-content/migrations/C0013_article_category_fk.sql` (idempotent — ADD COLUMN IF NOT EXISTS · ON CONFLICT DO NOTHING · DO $$ NULL guard · constraint guard · CREATE INDEX IF NOT EXISTS)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts` (default-rename-forbidden 분기 · FOR UPDATE · catch FK field → form 변환)
- `apps/web/src/components/forms/ArticleCategoryForm.tsx` (`isDefault` prop · slug input readOnly · 안내 배너)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx` (isDefault={initial.slug==='general'} 전달)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (categoryId 사전 resolve · category-not-found)
- `apps/web/src/lib/markdown.ts` (image 치환 순서)
- `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` (chevron disclosure affordance)

## Output (한국어 · 간결)

```
# EAT_CONTENT code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=6 → cycle2=N

## cycle 1 patch 검증
- ECC-01: PASS/FAIL + 한 줄
- ECC-02: PASS/FAIL
- ECC-03: PASS/FAIL
- ECC-04: PASS/FAIL
- ECC-05: PASS/FAIL
- ECC-06: PASS/FAIL

## new findings (있을 경우)

### blocking
- **ECC-XX**: ...
  - 위치: <file>:<line>
  - 근거(plan SoT): ...
  - 문제: ...
  - 권장 patch: ...

### major
### minor

## acceptance 판정
- closeableAfterPatch=true 면 EAT_CONTENT code v1.0 acceptance 진행 권고
- 누계 시작점 144 cycle 1224 → ?
```

cycle 1 의 6건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

가능한 한 광범위하게 보고, 파일을 line 단위로 인용하라. 한국어로 응답.
