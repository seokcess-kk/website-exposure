Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3a15-6c99-72f2-98fc-a768a25110dc
--------
user
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

codex
`seo-geo` 스킬이 이 저장소의 검색/콘텐츠 최적화 문서 검토 범위와 맞아 먼저 지침만 확인하겠습니다. 이어서 요청하신 파일들을 라인 단위로 읽고 코드 리뷰 관점에서 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'C:\\Users\\assag\\solution\\website-exposure\\.agents\\skills\\seo-geo\\SKILL.md'" in C:\Users\assag\solution\website-exposure
 succeeded in 622ms:
---
name: seo-geo
description: SEO & GEO (Generative Engine Optimization) for websites. Analyze keywords, generate schema markup, optimize for AI search engines (ChatGPT, Perplexity, Gemini, Copilot, Claude) and traditional search (Google, Bing). Use when user wants to improve search visibility, search optimization, search ranking, AI visibility, ChatGPT ranking, Google AI Overview, indexing, JSON-LD, meta tags, or keyword research.
---

# SEO/GEO Optimization Skill

Comprehensive SEO and GEO (Generative Engine Optimization) for websites. Optimize for both traditional search engines (Google, Bing) and AI search engines (ChatGPT, Perplexity, Gemini, Copilot, Claude).

## Quick Reference

**GEO = Generative Engine Optimization** - Optimizing content to be cited by AI search engines.

**Key Insight:** AI search engines don't rank pages - they **cite sources**. Being cited is the new "ranking #1".

## Workflow

### Step 1: Website Audit

Get the target URL and analyze current SEO/GEO status.

**Basic SEO Audit (Free):**
```bash
python3 scripts/seo_audit.py "https://example.com"
```
**Use this for**: Quick technical SEO check (title, meta, H1, robots, sitemap, load time). No API needed.

---

**Check Meta Tags:**
```bash
curl -sL "https://example.com" | grep -E "<title>|<meta name=\"description\"|<meta property=\"og:|application/ld\+json" | head -20
```

**Use this for**: Quick check of essential meta tags and schema markup on any webpage.

---

**Check robots.txt:**
```bash
curl -s "https://example.com/robots.txt"
```

**Use this for**: Verify which bots are allowed/blocked. Critical for ensuring AI search engines can crawl your site.

---

**Check sitemap:**
```bash
curl -s "https://example.com/sitemap.xml" | head -50
```

**Use this for**: Verify sitemap structure and ensure all important pages are included for search engine discovery.

**Verify AI Bot Access:**
```
# These bots should be allowed in robots.txt:
- Googlebot (Google)
- Bingbot (Bing/Copilot)
- PerplexityBot (Perplexity)
- ChatGPT-User (ChatGPT with browsing)
- ClaudeBot / anthropic-ai (Claude)
- GPTBot (OpenAI)
```

### Step 2: Keyword Research

Use **WebSearch** to research target keywords:

```
WebSearch: "{keyword} keyword difficulty site:ahrefs.com OR site:semrush.com"
WebSearch: "{keyword} search volume 2026"
WebSearch: "site:{competitor.com} {keyword}"
```

**Analyze:**
- Search volume and difficulty
- Competitor keyword strategies
- Long-tail keyword opportunities
- International keyword conflicts (e.g., "OPC" = industrial automation in English markets)

### Step 3: GEO Optimization (AI Search Engines)

Apply the **9 Princeton GEO Methods** (see [references/geo-research.md](./references/geo-research.md)):

| Method | Visibility Boost | How to Apply |
|--------|-----------------|--------------|
| **Cite Sources** | +40% | Add authoritative citations and references |
| **Statistics Addition** | +37% | Include specific numbers and data points |
| **Quotation Addition** | +30% | Add expert quotes with attribution |
| **Authoritative Tone** | +25% | Use confident, expert language |
| **Easy-to-understand** | +20% | Simplify complex concepts |
| **Technical Terms** | +18% | Include domain-specific terminology |
| **Unique Words** | +15% | Increase vocabulary diversity |
| **Fluency Optimization** | +15-30% | Improve readability and flow |
| ~~Keyword Stuffing~~ | **-10%** | **AVOID - hurts visibility** |

**Best Combination:** Fluency + Statistics = Maximum boost

**Generate FAQPage Schema** (+40% AI visibility):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is [topic]?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "According to [source], [answer with statistics]."
    }
  }]
}
```

**Optimize Content Structure:**
- Use "answer-first" format (direct answer at top)
- Clear H1 > H2 > H3 hierarchy
- Bullet points and numbered lists
- Tables for comparison data
- Short paragraphs (2-3 sentences max)

### Step 4: Traditional SEO Optimization

**Meta Tags Template:**
```html
<title>{Primary Keyword} - {Brand} | {Secondary Keyword}</title>
<meta name="description" content="{Compelling description with keyword, 150-160 chars}">
<meta name="keywords" content="{keyword1}, {keyword2}, {keyword3}">

<!-- Open Graph -->
<meta property="og:title" content="{Title}">
<meta property="og:description" content="{Description}">
<meta property="og:image" content="{Image URL 1200x630}">
<meta property="og:url" content="{Canonical URL}">
<meta property="og:type" content="website">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{Title}">
<meta name="twitter:description" content="{Description}">
<meta name="twitter:image" content="{Image URL}">
```

**JSON-LD Schema** (see [references/schema-templates.md](./references/schema-templates.md)):
- WebPage / Article for content pages
- FAQPage for FAQ sections
- Product for product pages
- Organization for about pages
- SoftwareApplication for tools/apps

**Check Content:**
- [ ] H1 contains primary keyword
- [ ] Images have descriptive alt text
- [ ] Internal links to related content
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Content is mobile-friendly
- [ ] Page loads in < 3 seconds

### Step 5: Validate & Monitor

**Schema Validation:**
```bash
# Open Google Rich Results Test
open "https://search.google.com/test/rich-results?url={encoded_url}"

# Open Schema.org Validator
open "https://validator.schema.org/?url={encoded_url}"
```

**Check Indexing Status:**
```bash
# Google (use Search Console API or manual check)
open "https://www.google.com/search?q=site:{domain}"

# Bing
open "https://www.bing.com/search?q=site:{domain}"
```

**Generate Report:**
```markdown
## SEO/GEO Optimization Report

### Current Status
- Meta Tags: ✅/❌
- Schema Markup: ✅/❌
- AI Bot Access: ✅/❌
- Mobile Friendly: ✅/❌
- Page Speed: X seconds

### Recommendations
1. [Priority 1 action]
2. [Priority 2 action]
3. [Priority 3 action]

### GEO Optimizations Applied
- [ ] FAQPage schema added
- [ ] Statistics included
- [ ] Citations added
- [ ] Answer-first structure
```

## Platform-Specific Optimization

See [references/platform-algorithms.md](./references/platform-algorithms.md) for detailed ranking factors.

### ChatGPT
- Focus on **branded domain authority** (cited 11% more than third-party)
- Update content within **30 days** (3.2x more citations)
- Build **backlinks** (>350K referring domains = 8.4 avg citations)
- Match content style to ChatGPT's response format

### Perplexity
- Allow **PerplexityBot** in robots.txt
- Use **FAQ Schema** (higher citation rate)
- Host **PDF documents** (prioritized for citation)
- Focus on **semantic relevance** over keywords

### Google AI Overview (SGE)
- Optimize for **E-E-A-T** (Experience, Expertise, Authority, Trust)
- Use **structured data** (Schema markup)
- Build **topical authority** (content clusters + internal linking)
- Include **authoritative citations** (+132% visibility)

### Microsoft Copilot / Bing
- Ensure **Bing indexing** (required for citation)
- Optimize for **Microsoft ecosystem** (LinkedIn, GitHub mentions help)
- Page speed **< 2 seconds**
- Clear **entity definitions**

### Claude AI
- Ensure **Brave Search indexing** (Claude uses Brave, not Google)
- High **factual density** (data-rich content preferred)
- Clear **structural clarity** (easy to extract)

## Skill Dependencies

This skill works best with:
- **twitter skill** - Search SEO experts for latest tips
- **reddit skill** - Search r/SEO, r/bigseo for discussions
- **WebSearch** - Keyword research and competitor analysis

## References

- [references/platform-algorithms.md](./references/platform-algorithms.md) - Detailed ranking factors for each platform
- [references/geo-research.md](./references/geo-research.md) - Princeton GEO research (9 methods)
- [references/schema-templates.md](./references/schema-templates.md) - JSON-LD templates
- [references/seo-checklist.md](./references/seo-checklist.md) - Complete SEO audit checklist
- [references/tools-and-apis.md](./references/tools-and-apis.md) - Tools and API reference
- [examples/opc-skills-case-study.md](./examples/opc-skills-case-study.md) - Real-world optimization example

codex
스킬 지침은 실제 SEO 감사보다 E-E-A-T/FAQ/콘텐츠 구조 판단에 참고하는 정도로 충분합니다. 지금은 구현 검증이 핵심이라, 먼저 SoT 문서와 지정 파일들의 현재 라인 번호를 확보하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'docs/decisions/EAT_CONTENT_PLAN.md' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'packages/core-content/migrations/C0013_article_category_fk.sql' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/components/forms/ArticleCategoryForm.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 718ms:
    1: -- @glitzy/core-content — C0013 Article.category_id staged migration
    2: -- EC-SCHEMA-05·06·07 · cycle 1 ECP-03·09 정합: PSR-DEFER-15 해소.
    3: -- staged 4 step (단일 migration 안 · idempotent — 부분 실패 재실행 안전 · cycle 1 ECC-01 patch):
    4: --   (1) ADD COLUMN nullable (IF NOT EXISTS)
    5: --   (2) default `general` ArticleCategory 행 backfill (instance 별 idempotent INSERT)
    6: --   (3) 기존 article row 의 category_id 를 default category 로 backfill (NULL row 만)
    7: --   (4) NULL 잔존 검증 → SET NOT NULL + composite FK + index (NOT EXISTS guard)
    8: -- Precondition: C0005 article · C0009 article_category
    9: 
   10: -- (1) ADD COLUMN nullable — 재실행 안전
   11: ALTER TABLE article ADD COLUMN IF NOT EXISTS category_id UUID;
   12: 
   13: -- (2) instance 별 default `general` ArticleCategory 행 INSERT (idempotent — ON CONFLICT DO NOTHING)
   14: --   seed.ts 가 신규 instance 에서 자동 INSERT 책임 (EC-SCHEMA-03). 본 step 은 기존 instance backfill.
   15: INSERT INTO article_category (instance_id, slug, name, display_order)
   16: SELECT i.id, 'general', '일반', 0
   17: FROM instance i
   18: ON CONFLICT (instance_id, slug) DO NOTHING;
   19: 
   20: -- (3) 기존 article row 의 category_id 를 default category 로 backfill — NULL row 만 UPDATE
   21: UPDATE article a
   22: SET category_id = ac.id
   23: FROM article_category ac
   24: WHERE a.instance_id = ac.instance_id
   25:   AND ac.slug = 'general'
   26:   AND a.category_id IS NULL;
   27: 
   28: -- (4) NULL 잔존 검증 — 운영 중 backfill 실패한 row 가 있으면 SET NOT NULL 가 실패하므로 명시 raise.
   29: DO $$
   30: DECLARE
   31:   null_count INTEGER;
   32: BEGIN
   33:   SELECT COUNT(*) INTO null_count FROM article WHERE category_id IS NULL;
   34:   IF null_count > 0 THEN
   35:     RAISE EXCEPTION 'C0013: article.category_id 가 NULL 인 row % 건이 backfill 후에도 잔존합니다. article_category seed 누락 instance 확인 필요.', null_count;
   36:   END IF;
   37: END $$;
   38: 
   39: -- (4-1) SET NOT NULL — IS NULL 0 인 상태에서만 진입. 재실행 시 이미 NOT NULL 이어도 PostgreSQL 은 빠르게 no-op.
   40: ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;
   41: 
   42: -- (4-2) composite FK (same-tenant) — 존재 guard
   43: DO $$
   44: BEGIN
   45:   IF NOT EXISTS (
   46:     SELECT 1 FROM pg_constraint WHERE conname = 'article_category_fk'
   47:   ) THEN
   48:     ALTER TABLE article ADD CONSTRAINT article_category_fk
   49:       FOREIGN KEY (instance_id, category_id)
   50:       REFERENCES article_category (instance_id, id)
   51:       ON DELETE NO ACTION;
   52:   END IF;
   53: END $$;
   54: 
   55: -- (4-3) index — IF NOT EXISTS
   56: CREATE INDEX IF NOT EXISTS article_category_idx ON article (instance_id, category_id);

 succeeded in 706ms:
    1: // @glitzy/web/components/forms/ArticleCategoryForm — EAT_CONTENT_PLAN v1.0 § 4.1
    2: //   v0.1 minimal: slug · name · description · displayOrder. EC-DEFER-10 (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault).
    3: "use client";
    4: 
    5: import { useState } from "react";
    6: import { useFormState, useFormStatus } from "react-dom";
    7: import { Field } from "./Field";
    8: import type { SaveResult } from "@/lib/save-result";
    9: 
   10: export type ArticleCategoryInitial = {
   11:   slug: string;
   12:   name: string;
   13:   description: string;
   14:   displayOrder: string;
   15: };
   16: 
   17: const empty: ArticleCategoryInitial = {
   18:   slug: "",
   19:   name: "",
   20:   description: "",
   21:   displayOrder: "0",
   22: };
   23: 
   24: export function ArticleCategoryForm({
   25:   action,
   26:   initial,
   27:   isNew,
   28:   isDefault = false,
   29: }: {
   30:   action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
   31:   initial: ArticleCategoryInitial | null;
   32:   isNew: boolean;
   33:   isDefault?: boolean;
   34: }) {
   35:   const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
   36:   const [v, setV] = useState<ArticleCategoryInitial>(initial ?? empty);
   37:   const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
   38:   const formError = state && state.ok === false ? state.formError ?? null : null;
   39:   const set = (k: keyof ArticleCategoryInitial, val: string) => setV((p) => ({ ...p, [k]: val }));
   40: 
   41:   return (
   42:     <form action={formAction} className="flex flex-col gap-5">
   43:       {state?.ok === true && (
   44:         <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
   45:           저장되었습니다.
   46:         </div>
   47:       )}
   48:       {formError && (
   49:         <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
   50:       )}
   51:       {isDefault && (
   52:         <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
   53:           기본 카테고리(general) 는 시스템 invariant 입니다. slug 변경 · 삭제가 차단됩니다.
   54:         </div>
   55:       )}
   56: 
   57:       {isDefault ? (
   58:         <label className="flex flex-col gap-1 text-sm">
   59:           <span>slug<span className="ml-1 text-rose-600">*</span></span>
   60:           <input
   61:             type="text"
   62:             name="slug"
   63:             value={v.slug}
   64:             readOnly
   65:             className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
   66:           />
   67:         </label>
   68:       ) : (
   69:         <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈" />
   70:       )}
   71:       <Field name="name" label="이름" required value={v.name} onChange={(x) => set("name", x)} errors={fieldErrors.name} maxLength={50} />
   72:       <Field name="description" label="설명" textarea rows={3} value={v.description} onChange={(x) => set("description", x)} errors={fieldErrors.description} maxLength={200} hint="입력 시 80~200자 (선택)" />
   73:       <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} hint="0 ~ 9999" />
   74: 
   75:       <SubmitButton isNew={isNew} />
   76:     </form>
   77:   );
   78: }
   79: 
   80: function SubmitButton({ isNew }: { isNew: boolean }) {
   81:   const { pending } = useFormStatus();
   82:   return (
   83:     <button
   84:       type="submit"
   85:       disabled={pending}
   86:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
   87:     >
   88:       {pending ? "저장 중…" : isNew ? "추가" : "저장"}
   89:     </button>
   90:   );
   91: }

 succeeded in 766ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/categories/actions — EAT_CONTENT_PLAN v1.0 § 4.4 EC-FORM-04
    2: 
    3: "use server";
    4: 
    5: import { revalidatePath } from "next/cache";
    6: import { notFound, redirect } from "next/navigation";
    7: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
    8: 
    9: import { getSqlBase } from "@/lib/db";
   10: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
   11: import { withSkeletonTx } from "@/lib/tenant";
   12: import { mapDbErrorToResult } from "@/lib/errors";
   13: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   14: import { ArticleCategoryInputSchema } from "@/lib/eat-content-schema";
   15: import type { SaveResult } from "@/lib/save-result";
   16: 
   17: export type DeleteResult = { ok: true } | { ok: false; formError: string };
   18: 
   19: export async function saveCategory(
   20:   instanceSlug: string,
   21:   originalSlug: string | null,
   22:   _prev: SaveResult | null,
   23:   formData: FormData,
   24: ): Promise<SaveResult> {
   25:   const parsed = ArticleCategoryInputSchema.safeParse(Object.fromEntries(formData));
   26:   if (!parsed.success) {
   27:     const fieldErrors: Record<string, string[]> = {};
   28:     for (const issue of parsed.error.issues) {
   29:       const field = issue.path.join(".") || "_";
   30:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
   31:     }
   32:     return { ok: false, fieldErrors };
   33:   }
   34: 
   35:   const aCtx = await resolveActionContext(instanceSlug);
   36:   const sqlBase = getSqlBase();
   37: 
   38:   try {
   39:     const txResult = await withSkeletonTx(
   40:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
   41:       async (tx, ctx) => {
   42:         assertActionEligibility(ctx, "operator-edit-content");
   43: 
   44:         if (originalSlug !== null) {
   45:           const beforeRows = await tx<{ id: string }[]>`
   46:             SELECT id FROM article_category
   47:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
   48:              FOR UPDATE
   49:           `;
   50:           if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
   51: 
   52:           // cycle 1 ECC-02 patch: `general` 기본 카테고리 보호 — slug 변경 차단 (rename 으로 깨짐 방지).
   53:           //   삭제 보호 (deleteCategory) 와 동일하게 server 측 invariant 보호.
   54:           //   Article saveArticle fallback (slug='general') · C0013 backfill · seed.ts ON CONFLICT 모두 'general' 문자열 의존.
   55:           if (originalSlug === "general" && parsed.data.slug !== "general") {
   56:             return { ok: false as const, action: "default-rename-forbidden" as const };
   57:           }
   58: 
   59:           await tx`
   60:             UPDATE article_category
   61:                SET slug = ${parsed.data.slug},
   62:                    name = ${parsed.data.name},
   63:                    description = ${parsed.data.description ?? null},
   64:                    display_order = ${Number(parsed.data.displayOrder)},
   65:                    updated_at = now()
   66:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
   67:           `;
   68:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
   69:         }
   70: 
   71:         await tx`
   72:           INSERT INTO article_category (instance_id, slug, name, description, display_order)
   73:           VALUES (
   74:             ${ctx.instanceId}::uuid,
   75:             ${parsed.data.slug},
   76:             ${parsed.data.name},
   77:             ${parsed.data.description ?? null},
   78:             ${Number(parsed.data.displayOrder)}
   79:           )
   80:         `;
   81:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
   82:       },
   83:     );
   84: 
   85:     if (txResult.ok === false && txResult.action === "notfound") notFound();
   86:     if (txResult.ok === false && txResult.action === "default-rename-forbidden") {
   87:       return { ok: false, fieldErrors: { slug: ["기본 카테고리(general) 는 slug 를 변경할 수 없습니다."] } };
   88:     }
   89:     if (txResult.ok === true) {
   90:       try {
   91:         await emitAuditEvent(sqlBase, {
   92:           eventType: "content-saved",
   93:           actorUserId: txResult.ctx.userId,
   94:           targetUserId: txResult.ctx.userId,
   95:           toInstanceId: txResult.ctx.instanceId,
   96:           payload: { contentType: "ArticleCategory", slug: txResult.slug, mode: txResult.mode, originalSlug },
   97:         });
   98:       } catch (auditErr) {
   99:         console.error("[saveCategory] audit emit failed", auditErr);
  100:       }
  101:       revalidatePath(`/admin/${instanceSlug}/categories`);
  102:       revalidatePath(`/admin/${instanceSlug}/categories/${txResult.slug}`);
  103:       if (originalSlug !== null && originalSlug !== txResult.slug) {
  104:         revalidatePath(`/admin/${instanceSlug}/categories/${originalSlug}`);
  105:       }
  106:       revalidatePath(`/admin/${instanceSlug}`);
  107:       if (originalSlug === null || originalSlug !== txResult.slug) {
  108:         redirect(`/admin/${instanceSlug}/categories/${txResult.slug}`);
  109:       }
  110:       return { ok: true, slug: txResult.slug };
  111:     }
  112:     return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  113:   } catch (err) {
  114:     if (isNextControlFlowError(err)) throw err;
  115:     const mapped = mapDbErrorToResult(err);
  116:     if (mapped !== null) {
  117:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
  118:       return { ok: false, fieldErrors: {}, formError: mapped.message };
  119:     }
  120:     if (err instanceof TenantResolveError) {
  121:       const action = mapAuthDenyReasonToUi(err.reason);
  122:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  123:       if (action.kind === "not-found") notFound();
  124:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  125:     }
  126:     console.error("[saveCategory] unexpected", err);
  127:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  128:   }
  129: }
  130: 
  131: export async function deleteCategory(instanceSlug: string, slug: string): Promise<DeleteResult> {
  132:   const aCtx = await resolveActionContext(instanceSlug);
  133:   const sqlBase = getSqlBase();
  134: 
  135:   try {
  136:     const result = await withSkeletonTx(
  137:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  138:       async (tx, ctx) => {
  139:         assertActionEligibility(ctx, "operator-edit-content");
  140:         // default `general` 카테고리는 삭제 차단 — Article.category_id NOT NULL FK 무결성.
  141:         // cycle 1 ECC-04 patch: 대상 row 를 FOR UPDATE 로 잠궈 ref-count 검사 ~ DELETE 사이 race 차단.
  142:         //   FK 도 article_category(instance_id, id) lookup 단계에서 share lock 을 잡으므로 INSERT 가 본 row commit 전에는 진입 못 함.
  143:         const targetRows = await tx<{ id: string; slug: string }[]>`
  144:           SELECT id, slug FROM article_category
  145:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
  146:            FOR UPDATE
  147:         `;
  148:         if (targetRows.length === 0) return { deleted: 0 };
  149:         if (targetRows[0]!.slug === "general") {
  150:           return { deleted: 0, action: "default-protected" as const };
  151:         }
  152:         const refCount = await tx<{ cnt: number }[]>`
  153:           SELECT COUNT(*)::int AS cnt FROM article
  154:            WHERE instance_id = ${ctx.instanceId}::uuid AND category_id = ${targetRows[0]!.id}::uuid
  155:         `;
  156:         if ((refCount[0]?.cnt ?? 0) > 0) {
  157:           return { deleted: 0, action: "in-use" as const };
  158:         }
  159:         const deleted = await tx<{ id: string }[]>`
  160:           DELETE FROM article_category
  161:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
  162:            RETURNING id
  163:         `;
  164:         return { deleted: deleted.length };
  165:       },
  166:     );
  167: 
  168:     if ("action" in result && result.action === "default-protected") {
  169:       return { ok: false, formError: "기본 카테고리(general)는 삭제할 수 없습니다." };
  170:     }
  171:     if ("action" in result && result.action === "in-use") {
  172:       return { ok: false, formError: "해당 카테고리를 사용 중인 아티클이 있어 삭제할 수 없습니다." };
  173:     }
  174:     if (result.deleted === 0) {
  175:       return { ok: false, formError: "해당 카테고리가 이미 삭제되었습니다." };
  176:     }
  177: 
  178:     try {
  179:       await emitAuditEvent(sqlBase, {
  180:         eventType: "content-deleted",
  181:         actorUserId: aCtx.userId,
  182:         targetUserId: aCtx.userId,
  183:         toInstanceId: aCtx.instanceId,
  184:         payload: { contentType: "ArticleCategory", slug },
  185:       });
  186:     } catch (err) {
  187:       console.error("[deleteCategory] audit emit failed", err);
  188:     }
  189: 
  190:     revalidatePath(`/admin/${instanceSlug}/categories`);
  191:     revalidatePath(`/admin/${instanceSlug}/categories/${slug}`);
  192:     revalidatePath(`/admin/${instanceSlug}`);
  193:     redirect(`/admin/${instanceSlug}/categories`);
  194:   } catch (err) {
  195:     if (isNextControlFlowError(err)) throw err;
  196:     if (err instanceof TenantResolveError) {
  197:       const action = mapAuthDenyReasonToUi(err.reason);
  198:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  199:       if (action.kind === "not-found") notFound();
  200:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
  201:     }
  202:     const mapped = mapDbErrorToResult(err);
  203:     if (mapped !== null) {
  204:       // cycle 1 ECC-04 patch: FK violation (article.article_category_fk) 은 race 시 발생.
  205:       //   field mapping("categoryId") 도 form-level "사용 중" UX 로 변환.
  206:       if (mapped.kind === "form") return { ok: false, formError: mapped.message };
  207:       if (mapped.kind === "field" && mapped.errors.categoryId) {
  208:         return { ok: false, formError: "해당 카테고리를 사용 중인 아티클이 있어 삭제할 수 없습니다." };
  209:       }
  210:       // 그 외 field mapping 은 unexpected — fall through 로 generic 처리.
  211:     }
  212:     console.error("[deleteCategory] unexpected", err);
  213:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  214:   }
  215: }

 succeeded in 782ms:
    1: # E-A-T Content 확장 plan (v1.0·acceptance·2026-05-18)
    2: 
    3: > **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **6 cycle 36 findings 전건 수용** · cycle 6 closeableAfterPatch=true 확정. 수렴 추세 **22 → 8 → 3 → 2 → 1 → 0**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
    4: 
    5: > **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.
    6: 
    7: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
    8: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
    9: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
   10: 
   11: 본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:
   12: 
   13: | Entity | 신규 vs 합류 | DATA_MODEL ID |
   14: |---|---|---|
   15: | Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
   16: | MediaAppearance | **신규** | C-25 (인벤토리 추가) |
   17: | Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
   18: | ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
   19: 
   20: 모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
   21: 
   22: > **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
   23: 
   24: ## SoT
   25: 
   26: - `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
   27: - `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
   28: - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
   29: - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
   30: - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
   31: - `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
   32: - `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
   33: - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
   34: - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
   35: - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
   36: - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
   37: - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
   38: - 기존 packages 실 시그니처:
   39:   - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
   40:   - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
   41:   - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
   42:   - `apps/web/src/lib/json-ld/{entities, builders}.ts` (JSON-LD generator)
   43:   - `apps/web/src/lib/json-ld/__tests__/validate.ts` (cross-page allowlist + tenant base path)
   44:   - `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` (현재 fallback `general` 만 — 본 plan 합류 후 DB join)
   45: 
   46: ## 1. 목적과 범위
   47: 
   48: ### 1.1 목적
   49: 
   50: - **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
   51: - **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
   52: - **운영자 입력 UX 표준화** — M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용.
   53: - **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
   54: 
   55: ### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정
   56: 
   57: | 항목 | 비고 |
   58: |---|---|
   59: | C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
   60: | C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
   61: | C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
   62: | C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
   63: | C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
   64: | C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
   65: | 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
   66: | D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
   67: | 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
   68: | status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
   69: | 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
   70: | Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
   71: | About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
   72: | MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
   73: | Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
   74: | JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
   75: | sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
   76: | FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
   77: | Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
   78: | PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
   79: | CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
   80: | DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
   81: | authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
   82: 
   83: ### 1.3 비범위 (defer)
   84: 
   85: | 항목 | Defer to | marker |
   86: |---|---|---|
   87: | Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
   88: | Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
   89: | Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
   90: | MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
   91: | FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
   92: | FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
   93: | Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
   94: | Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
   95: | FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
   96: | ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
   97: | MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
   98: | 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
   99: 
  100: ## 2. 데이터 모델 결정
  101: 
  102: ### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
  103: 
  104: DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
  105: 
  106: ```sql
  107: -- packages/core-content/migrations/C0009_article_category.sql
  108: 
  109: CREATE TABLE article_category (
  110:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  111:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  112:   slug TEXT NOT NULL,
  113:   name TEXT NOT NULL,
  114:   description TEXT,
  115:   pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
  116:   parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
  117:   cover_image_url TEXT,                          -- v0.1 nullable
  118:   seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
  119:   display_order INTEGER NOT NULL DEFAULT 0,
  120:   article_type_default TEXT,                     -- v0.1 nullable
  121:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  122:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  123:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  124:   CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  125:   CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
  126:   CONSTRAINT article_category_description_length CHECK (description IS NULL OR length(description) BETWEEN 80 AND 200),
  127:   CONSTRAINT article_category_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~ '^https?://'),
  128:   CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
  129:   CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
  130:   CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
  131:     REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
  132: );
  133: 
  134: CREATE INDEX article_category_instance_idx ON article_category (instance_id);
  135: CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
  136: CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
  137:   WHERE parent_category_id IS NOT NULL;
  138: 
  139: ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
  140: ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
  141: CREATE POLICY tenant_isolation ON article_category FOR ALL TO app_tenant_user
  142:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  143:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  144: GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
  145: ```
  146: 
  147: **결정**:
  148: - (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
  149: - (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
  150: - (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).
  151: 
  152: ### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정
  153: 
  154: ```sql
  155: -- packages/core-content/migrations/C0013_article_category_fk.sql
  156: 
  157: -- (1) ADD COLUMN nullable
  158: ALTER TABLE article ADD COLUMN category_id UUID;
  159: 
  160: -- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
  161: INSERT INTO article_category (instance_id, slug, name, display_order)
  162: SELECT i.id, 'general', '일반', 0
  163: FROM instance i
  164: WHERE NOT EXISTS (
  165:   SELECT 1 FROM article_category ac
  166:   WHERE ac.instance_id = i.id AND ac.slug = 'general'
  167: );
  168: 
  169: -- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
  170: UPDATE article a
  171: SET category_id = ac.id
  172: FROM article_category ac
  173: WHERE a.instance_id = ac.instance_id
  174:   AND ac.slug = 'general'
  175:   AND a.category_id IS NULL;
  176: 
  177: -- (4) SET NOT NULL
  178: ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;
  179: 
  180: -- (5) composite FK (same-tenant)
  181: ALTER TABLE article ADD CONSTRAINT article_category_fk
  182:   FOREIGN KEY (instance_id, category_id)
  183:   REFERENCES article_category (instance_id, id)
  184:   ON DELETE NO ACTION;
  185: 
  186: CREATE INDEX article_category_idx ON article (instance_id, category_id);
  187: ```
  188: 
  189: **결정**:
  190: - (EC-SCHEMA-06) staged migration 안 4 단계 모두 단일 migration 으로 처리. acceptance commit 안 backfill 완성.
  191: - (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
  192: 
  193: ### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
  194: 
  195: ```sql
  196: -- packages/core-content/migrations/C0010_publication.sql
  197: 
  198: CREATE TABLE publication (
  199:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  200:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  201:   slug TEXT NOT NULL,
  202:   title TEXT NOT NULL,
  203:   authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
  204:   journal TEXT,
  205:   published_date DATE NOT NULL,                  -- 학술지 게재일
  206:   doi TEXT,
  207:   pubmed_id TEXT,
  208:   url TEXT NOT NULL,
  209:   thumbnail_url TEXT,
  210:   summary TEXT NOT NULL,
  211:   author_doctor_id UUID,
  212:   status content_publication_status NOT NULL DEFAULT 'draft',
  213:   risk_level risk_level NOT NULL DEFAULT 'Low',
  214:   published_at TIMESTAMPTZ,
  215:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  216:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  217:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  218:   CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  219:   CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
  220:   CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  221:   CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
  222:   CONSTRAINT publication_doi_format CHECK (doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'),
  223:   CONSTRAINT publication_pubmed_id_format CHECK (pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'),
  224:   CONSTRAINT publication_authors_array CHECK (jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1),
  225:   CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  226:   CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  227:   CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
  228:   CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
  229:   CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  230:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
  231: );
  232: 
  233: CREATE INDEX publication_instance_idx ON publication (instance_id);
  234: CREATE INDEX publication_status_idx ON publication (instance_id, status);
  235: CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
  236:   WHERE status = 'published' AND published_at IS NOT NULL;
  237: CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
  238:   WHERE author_doctor_id IS NOT NULL;
  239: 
  240: ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
  241: ALTER TABLE publication FORCE ROW LEVEL SECURITY;
  242: CREATE POLICY tenant_isolation ON publication FOR ALL TO app_tenant_user
  243:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  244:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  245: GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
  246: ```
  247: 
  248: **결정**:
  249: - (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
  250: - (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
  251: 
  252: ### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
  253: 
  254: ```sql
  255: -- packages/core-content/migrations/C0011_media_appearance.sql
  256: 
  257: CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');
  258: 
  259: CREATE TABLE media_appearance (
  260:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  261:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  262:   slug TEXT NOT NULL,
  263:   title TEXT NOT NULL,
  264:   channel_name TEXT NOT NULL,
  265:   channel_type media_channel_type NOT NULL,
  266:   published_date DATE NOT NULL,
  267:   duration_seconds INTEGER,
  268:   url TEXT NOT NULL,
  269:   thumbnail_url TEXT,
  270:   summary TEXT NOT NULL,
  271:   author_doctor_id UUID,
  272:   status content_publication_status NOT NULL DEFAULT 'draft',
  273:   risk_level risk_level NOT NULL DEFAULT 'Low',
  274:   published_at TIMESTAMPTZ,
  275:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  276:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  277:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  278:   CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  279:   CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
  280:   CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  281:   CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  282:   CONSTRAINT media_appearance_duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  283:   CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  284:   CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  285:   CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
  286:   CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
  287:   CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  288:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
  289: );
  290: 
  291: CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
  292: CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
  293: CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
  294:   WHERE status = 'published' AND published_at IS NOT NULL;
  295: CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
  296:   WHERE author_doctor_id IS NOT NULL;
  297: 
  298: ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
  299: ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
  300: CREATE POLICY tenant_isolation ON media_appearance FOR ALL TO app_tenant_user
  301:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  302:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  303: GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
  304: ```
  305: 
  306: **결정**:
  307: - (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  308: 
  309: ### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
  310: 
  311: ```sql
  312: -- packages/core-content/migrations/C0012_faq.sql
  313: 
  314: CREATE TABLE faq (
  315:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  316:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  317:   slug TEXT NOT NULL,
  318:   question TEXT NOT NULL,
  319:   answer TEXT NOT NULL,
  320:   display_order INTEGER NOT NULL DEFAULT 0,
  321:   category_id UUID,
  322:   related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
  323:   related_condition_id UUID,                     -- v0.1 nullable
  324:   author_doctor_id UUID,
  325:   status content_publication_status NOT NULL DEFAULT 'draft',
  326:   risk_level risk_level NOT NULL DEFAULT 'Low',
  327:   compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
  328:   published_at TIMESTAMPTZ,
  329:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  330:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  331:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  332:   CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  333:   CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
  334:   CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
  335:   CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
  336:   CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
  337:   CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  338:   CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  339:   CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
  340:     REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  341:   CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  342:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  343:   CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
  344:     REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  345:   -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
  346: );
  347: 
  348: CREATE INDEX faq_instance_idx ON faq (instance_id);
  349: CREATE INDEX faq_status_idx ON faq (instance_id, status);
  350: CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  351:   WHERE status = 'published' AND published_at IS NOT NULL;
  352: CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  353:   WHERE category_id IS NOT NULL;
  354: 
  355: ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
  356: ALTER TABLE faq FORCE ROW LEVEL SECURITY;
  357: CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
  358:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  359:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  360: GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
  361: ```
  362: 
  363: **결정**:
  364: - (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
  365: - (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
  366: 
  367: ### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
  368: 
  369: ```sql
  370: -- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
  371: 
  372: -- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
  373: --   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
  374: --   D0011 의 published-only 패턴과 다른 의도 — 본 plan 의 명시적 결정.
  375: GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
  376: 
  377: CREATE POLICY public_reader_article_category_select
  378:   ON article_category FOR SELECT TO app_public_reader
  379:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  380: 
  381: CREATE POLICY public_reader_publication_select
  382:   ON publication FOR SELECT TO app_public_reader
  383:   USING (
  384:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  385:     AND status = 'published'
  386:     AND published_at IS NOT NULL
  387:     AND published_at <= now()
  388:   );
  389: 
  390: CREATE POLICY public_reader_media_appearance_select
  391:   ON media_appearance FOR SELECT TO app_public_reader
  392:   USING (
  393:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  394:     AND status = 'published'
  395:     AND published_at IS NOT NULL
  396:     AND published_at <= now()
  397:   );
  398: 
  399: -- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
  400: --   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
  401: CREATE POLICY public_reader_faq_select
  402:   ON faq FOR SELECT TO app_public_reader
  403:   USING (
  404:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  405:     AND status = 'published'
  406:   );
  407: ```
  408: 
  409: **결정**:
  410: - (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
  411: 
  412: ## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
  413: 
  414: DATA_MODEL § 4 C-10 `contentType` enum 확장:
  415: 
  416: | 현 v0.5 (15종) | v0.6 신규 (+2종 = 17종) |
  417: |---|---|
  418: | `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
  419: 
  420: **결정**:
  421: - (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
  422: - (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
  423: 
  424: ## 4. 어드민 폼 결정
  425: 
  426: ### 4.1 4 entity CRUD 구조 (EC-FORM-01)
  427: 
  428: | Entity | route prefix |
  429: |---|---|
  430: | ArticleCategory | `/admin/<slug>/categories` |
  431: | Publication | `/admin/<slug>/publications` |
  432: | MediaAppearance | `/admin/<slug>/media-appearances` |
  433: | Faq | `/admin/<slug>/faqs` |
  434: 
  435: ### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)
  436: 
  437: v0.1 단계 4 entity 어드민 폼 schema 에 명시:
  438: ```typescript
  439: const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
  440: ```
  441: - form select 드롭다운 미노출 (단일 상태). server action 에서도 `status: 'draft'` 강제.
  442: - mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
  443: - Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
  444: 
  445: ### 4.3 zod schema 통합 SoT (EC-FORM-03)
  446: 
  447: `apps/web/src/lib/eat-content-schema.ts` 신설:
  448: - **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
  449: - **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
  450: - **Faq**: question (10~200) · answer (50~2000) · displayOrder int · categoryId UUID? · authorDoctorId? · relatedTreatmentId? · status `z.enum(['draft'])`
  451: - **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
  452: 
  453: ### 4.4 server action 패턴 (EC-FORM-04)
  454: 
  455: 각 entity 별 `actions.ts`:
  456: - `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
  457: - `deleteX(instanceSlug, slug)` — `content-deleted`.
  458: - isNextControlFlowError rethrow · mapDbErrorToResult · revalidatePath 패턴.
  459: 
  460: ### 4.5 dashboard cascade (EC-FORM-05)
  461: 
  462: `/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
  463: 
  464: ## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
  465: 
  466: ### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
  467: 
  468: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
  469: - 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
  470: - 표시: Q&A 카드 list. ORDER BY display_order ASC, id ASC. `<details>` collapsible.
  471: - **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
  472: - JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
  473: - Breadcrumb 추가.
  474: - Next metadata title: "자주 묻는 질문 | <clinic.name>".
  475: 
  476: ### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
  477: 
  478: Doctor Profile 페이지 안 inline section:
  479: - **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
  480: - **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.
  481: 
  482: **JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
  483: - Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
  484: - **fragment-scoped `@id`**:
  485:   - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
  486:   - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
  487: - Physician.subjectOf 에 fragment ref array 출력 (graph 안 entity 들과 cross-ref).
  488: - cross-page allowlist 미사용 — 모든 ref 가 graph 안 entity 또는 외부 dereferenceable URL (publication.url / media.url).
  489: 
  490: ### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
  491: 
  492: About 페이지 안 inline section:
  493: - **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
  494: - **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.
  495: 
  496: **JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
  497: - About 페이지 graph 안에 풀 entity 출력 — `MedicalClinic.subjectOf` array (publication·media). Organization.subjectOf 미사용 (단일 결정).
  498: - fragment-scoped `@id`:
  499:   - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
  500:   - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`
  501: 
  502: ### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
  503: 
  504: `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` patch:
  505: - 현재 SQL: `SELECT ... FROM article WHERE slug = ${params.slug}` + `params.category !== "general"` 시 notFound
  506: - patch 후 SQL: 
  507:   ```sql
  508:   SELECT a.*, ac.slug AS category_slug
  509:     FROM article a
  510:     JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
  511:    WHERE a.slug = ${params.slug}
  512:      AND ac.slug = ${params.category}
  513:    LIMIT 1
  514:   ```
  515: - 매칭 0 행 → notFound. params.category 가 article 의 실 category 와 일치해야 200.
  516: - sitemap.xml 안 article URL 생성 시 article + article_category join → `/insights/${category.slug}/${article.slug}` 출력 (현 `general` 하드코딩 → 실 category slug).
  517: 
  518: ### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
  519: 
  520: `apps/web/src/lib/markdown.ts` 확장:
  521: - `renderMarkdownToHtml(markdown, hostOrigin)` — 기존 (sanitize-html · PSR-COMP-09 정합).
  522: - **신규 `renderMarkdownToPlainText(markdown)`** — Markdown → plain text strip (heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal). JSON-LD `Answer.text` 용.
  523: - FAQ rendering 분기:
  524:   - public page (HTML): `renderMarkdownToHtml(answer, hostOrigin)`
  525:   - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
  526: 
  527: ### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
  528: 
  529: - P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
  530: - lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
  531: - Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
  532: - Article URL: 실 category slug 사용 (EC-RENDER-04 정합).
  533: 
  534: ### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
  535: 
  536: Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).
  537: 
  538: ## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
  539: 
  540: ### 6.1 ScholarlyArticle entity (Publication)
  541: 
  542: ```json
  543: {
  544:   "@type": "ScholarlyArticle",
  545:   "@id": "{pageBaseUrl}#publication-{slug}",      // fragment-scoped (Doctor/About page 안)
  546:   "headline": "<title>",
  547:   "author": [{ "@type": "Person", "name": "<author>" }, ...],
  548:   "datePublished": "<publishedDate>",
  549:   "isPartOf": { "@type": "Periodical", "name": "<journal>" },
  550:   "identifier": [
  551:     { "@type": "PropertyValue", "propertyID": "DOI", "value": "<doi>" },
  552:     { "@type": "PropertyValue", "propertyID": "PubMedID", "value": "<pubmedId>" }
  553:   ],
  554:   "url": "<url>",                                 // 외부 URL (dereferenceable)
  555:   "description": "<summary>",
  556:   "image": "<thumbnailUrl>",
  557:   "publisher": { "@id": "{siteBaseUrl}/#organization" }
  558: }
  559: ```
  560: 
  561: ### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
  562: 
  563: ```json
  564: {
  565:   "@type": "VideoObject",
  566:   "@id": "{pageBaseUrl}#video-{slug}",            // fragment-scoped · 모든 channel_type 동일
  567:   "name": "<title>",
  568:   "description": "<summary>",
  569:   "uploadDate": "<publishedDate>",
  570:   "duration": "PT<durationSeconds>S",
  571:   "thumbnailUrl": "<thumbnailUrl>",
  572:   "contentUrl": "<url>",
  573:   "publisher": { "@type": "Organization", "name": "<channelName>" }
  574: }
  575: ```
  576: 
  577: **결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  578: 
  579: ### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
  580: 
  581: ```json
  582: {
  583:   "@type": "FAQPage",
  584:   "@id": "{siteBaseUrl}/faq#faqpage",
  585:   "inLanguage": "ko-KR",
  586:   "mainEntity": [
  587:     {
  588:       "@type": "Question",
  589:       "name": "<faq.question>",
  590:       "acceptedAnswer": {
  591:         "@type": "Answer",
  592:         "text": "<renderMarkdownToPlainText(faq.answer)>"
  593:       }
  594:     },
  595:     ...
  596:   ]
  597: }
  598: ```
  599: 
  600: ### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)
  601: 
  602: | 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
  603: |---|---|
  604: | P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
  605: | P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
  606: | P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
  607: 
  608: **결정**:
  609: - (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
  610: - (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
  611: - (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
  612: 
  613: ## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
  614: 
  615: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
  616: 
  617: | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
  618: |---|---|---|---|---|
  619: | `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
  620: | `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
  621: | `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
  622: | `FAQ` A | **적용** | **적용** | **적용** | **적용** |
  623: | `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |
  624: 
  625: **결정**:
  626: - (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
  627: - (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
  628: - (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.
  629: 
  630: ## 8. 환경·precondition
  631: 
  632: - `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
  633: - `packages/core-content/migrations/C0009_article_category.sql` (신규)
  634: - `packages/core-content/migrations/C0010_publication.sql` (신규)
  635: - `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
  636: - `packages/core-content/migrations/C0012_faq.sql` (신규)
  637: - `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
  638: - `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
  639: - `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
  640:   - 10 (현재): D0010 instance · C0001~C0008 (article 등 8) · D0011 public_reader
  641:   - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
  642:   - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
  643: 
  644: ## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
  645: 
  646: | # | 시나리오 | 통과 기준 |
  647: |---|---|---|
  648: | 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
  649: | 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
  650: | 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
  651: | 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
  652: | 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
  653: | 29 | article.category_id 다른 카테고리 row · URL `/insights/wrong-category/<slug>` → 404 | category.slug 매칭 검증 |
  654: | 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
  655: | 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
  656: | 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
  657: | 33 | Article 의 SQL JOIN article_category — category 미존재 (instance 안 row 없음) → 404 | category lookup 0 row → notFound |
  658: | 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
  659: | 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
  660: | 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |
  661: 
  662: ## 10. 작업 단위
  663: 
  664: | # | 작업 | 산출물 |
  665: |---|---|---|
  666: | 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
  667: | 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
  668: | 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
  669: | 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
  670: | 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
  671: | 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
  672: | 7 | Drizzle schema 확장 — packages/core-content/src/schema.ts v0.4 | 4 신규 table + article.category_id |
  673: | 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
  674: | 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
  675: | 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
  676: | 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
  677: | 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
  678: | 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
  679: | 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
  680: | 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
  681: | 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
  682: | 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
  683: | 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
  684: | 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
  685: | 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
  686: | 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
  687: | 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
  688: | 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
  689: | 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
  690: | 25 | vitest scenario 24~36 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts + markdown.test.ts |
  691: | 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
  692: 
  693: ## 11. M0 v1.0 cascade markers (defer 정리)
  694: 
  695: ### 11.1 별 cycle 합류
  696: - `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
  697: - `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
  698: 
  699: ### 11.2 M1 Phase Alpha 합류
  700: - `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
  701: - `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
  702: - `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
  703: - `EC-DEFER-06`: FAQ 다국어.
  704: - `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
  705: - `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
  706: - `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
  707: 
  708: ### 11.3 compliance-assistant Feature 합류
  709: - `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
  710: - `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
  711: - `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
  712: 
  713: ## 12. Cascade markers (다른 SoT 문서로 전파)
  714: 
  715: - `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
  716:   - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
  717:   - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
  718:   - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
  719:   - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
  720:   - § 4 C-24 Publication 풀명세 신규.
  721:   - § 4 C-25 MediaAppearance 풀명세 신규.
  722:   - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
  723: - `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
  724:   - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
  725:   - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
  726:   - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
  727: - `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
  728: - `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
  729: - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
  730: - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
  731: - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
  732: - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
  733: - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
  734: 
  735: ## 변경 이력
  736: 
  737: | 일자 | 버전 | 변경 |
  738: |---|---|---|
  739: | 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
  740: | 2026-05-18 | **v1.0** | **Codex 비평 cycle 6 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 22 → 8 → 3 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 6 cycle 36 findings 전건 수용. acceptance commit 9 cascade docs 동시 포함 (EC-CASCADE-01·02·03·04·06·07·08·09 + plan 본문). EC-CASCADE-05 (D0014 마이그레이션 실 SQL) 는 EAT_CONTENT code v1.0 cycle 분리. |
  741: | 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
  742: | 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
  743: | 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
  744: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
  745: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

codex
1차 패치 표에 있는 항목들은 파일상 존재 여부가 대부분 확인됩니다. 남은 검증은 article 저장 흐름의 category resolve, FAQ disclosure, markdown helper가 실제 동작 순서까지 맞는지와 주변 오류 매핑에 회귀가 없는지입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/lib/markdown.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 695ms:
    1: import Link from "next/link";
    2: import { notFound, redirect } from "next/navigation";
    3: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    4: 
    5: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    6: import { requirePageContext } from "@/lib/page-context";
    7: import { withSkeletonTx } from "@/lib/tenant";
    8: import { ArticleCategoryForm, type ArticleCategoryInitial } from "@/components/forms/ArticleCategoryForm";
    9: import { DeleteForm } from "@/components/forms/DeleteForm";
   10: import { deleteCategory, saveCategory } from "../actions";
   11: 
   12: export default async function CategoryEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
   13:   let pageCtx;
   14:   try {
   15:     pageCtx = await requirePageContext(params.instanceSlug);
   16:   } catch (err) {
   17:     if (err instanceof TenantResolveError) {
   18:       const a = mapAuthDenyReasonToUi(err.reason);
   19:       if (a.kind === "forbidden" || a.kind === "info") {
   20:         return <main className="p-6"><p>{a.message}</p></main>;
   21:       }
   22:     }
   23:     throw err;
   24:   }
   25: 
   26:   let initial: ArticleCategoryInitial | null;
   27:   try {
   28:     initial = await withSkeletonTx(
   29:       { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
   30:       async (tx, ctx): Promise<ArticleCategoryInitial | null> => {
   31:         assertActionEligibility(ctx, "operator-edit-content");
   32:         const rows = await tx<{
   33:           slug: string;
   34:           name: string;
   35:           description: string | null;
   36:           display_order: number;
   37:         }[]>`
   38:           SELECT slug, name, description, display_order
   39:             FROM article_category
   40:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
   41:            LIMIT 1
   42:         `;
   43:         const r = rows[0];
   44:         if (!r) return null;
   45:         return {
   46:           slug: r.slug,
   47:           name: r.name,
   48:           description: r.description ?? "",
   49:           displayOrder: String(r.display_order),
   50:         };
   51:       },
   52:     );
   53:   } catch (err) {
   54:     if (err instanceof TenantResolveError) {
   55:       const a = mapAuthDenyReasonToUi(err.reason);
   56:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
   57:       if (a.kind === "not-found") notFound();
   58:       if (a.kind === "forbidden" || a.kind === "info") {
   59:         return <main className="p-6"><p>{a.message}</p></main>;
   60:       }
   61:     }
   62:     throw err;
   63:   }
   64:   if (initial === null) notFound();
   65: 
   66:   const boundSave = saveCategory.bind(null, params.instanceSlug, params.slug);
   67:   const boundDelete = deleteCategory.bind(null, params.instanceSlug, params.slug);
   68: 
   69:   return (
   70:     <main className="flex flex-col gap-6">
   71:       <header className="flex items-center justify-between">
   72:         <h1 className="text-2xl font-semibold">카테고리 편집 · {initial.name}</h1>
   73:         <Link href={`/admin/${params.instanceSlug}/categories`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
   74:       </header>
   75:       <ArticleCategoryForm action={boundSave} initial={initial} isNew={false} isDefault={initial.slug === "general"} />
   76:       {initial.slug !== "general" && (
   77:         <DeleteForm action={boundDelete} confirmMessage="정말 이 카테고리를 삭제하시겠습니까? 카테고리를 사용 중인 아티클이 있으면 삭제가 차단됩니다." />
   78:       )}
   79:     </main>
   80:   );
   81: }

 succeeded in 726ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/articles/actions
    2: // cycle1-3entity patch: WEB-01·04·06·08·10·15
    3: 
    4: "use server";
    5: 
    6: import { revalidatePath } from "next/cache";
    7: import { notFound, redirect } from "next/navigation";
    8: import { z } from "zod";
    9: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
   10: import { UUID_V4_REGEX } from "@glitzy/shared-types";
   11: 
   12: import { getSqlBase } from "@/lib/db";
   13: import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
   14: import { withSkeletonTx } from "@/lib/tenant";
   15: import { mapDbErrorToResult } from "@/lib/errors";
   16: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   17: import type { SaveResult } from "@/lib/save-result";
   18: 
   19: const PUBLICATION_STATUSES = [
   20:   "draft", "review-queued", "in-review", "approved", "publishable",
   21:   "published", "blocked", "rejected", "stale",
   22: ] as const;
   23: const RISK_LEVELS = ["Low", "Medium", "High"] as const;
   24: 
   25: const InputSchema = z.object({
   26:   slug: z
   27:     .string({ required_error: "slug 는 필수입니다." })
   28:     .transform((v) => v.trim())
   29:     .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
   30:       message: "slug 는 3~100자 (소문자/숫자/하이픈)",
   31:     }),
   32:   title: z
   33:     .string({ required_error: "제목은 필수입니다." })
   34:     .transform((v) => v.trim())
   35:     .refine((v) => v.length >= 1 && v.length <= 200, { message: "제목은 1~200자" }),
   36:   summary: z
   37:     .string({ required_error: "요약은 필수입니다." })
   38:     .transform((v) => v.trim())
   39:     .refine((v) => v.length >= 80 && v.length <= 200, { message: "요약은 80~200자" }),
   40:   bodyMarkdown: z
   41:     .string({ required_error: "본문은 필수입니다." })
   42:     .min(1, "본문은 1자 이상")
   43:     .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
   44:   // cycle5-3entity WEB-53: enum value mismatch 한국어 메시지
   45:   status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
   46:   riskLevel: z
   47:     .string()
   48:     .transform((v) => v.trim())
   49:     .transform((v) => (v === "" ? null : v))
   50:     .nullable()
   51:     .optional()
   52:     .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
   53:       message: "위험도는 Low / Medium / High",
   54:     }),
   55:   heroImageUrl: z
   56:     .string()
   57:     .transform((v) => v.trim())
   58:     .transform((v) => (v === "" ? null : v))
   59:     .nullable()
   60:     .optional()
   61:     .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
   62:       message: "hero 이미지 URL 은 http/https · 2048자",
   63:     }),
   64:   authorDoctorId: z
   65:     .string()
   66:     .transform((v) => v.trim())
   67:     .transform((v) => (v === "" ? null : v))
   68:     .nullable()
   69:     .optional()
   70:     .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
   71:       message: "저자 UUID 형식 오류",
   72:     }),
   73:   // EAT_CONTENT v1.0 (EC-SCHEMA-05): C-04 Article.category required.
   74:   //   form 은 selected category UUID. action 안 비어 있으면 instance 의 default `general` 으로 fallback.
   75:   categoryId: z
   76:     .string()
   77:     .transform((v) => v.trim())
   78:     .transform((v) => (v === "" ? null : v))
   79:     .nullable()
   80:     .optional()
   81:     .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
   82:       message: "카테고리 UUID 형식 오류",
   83:     }),
   84: });
   85: 
   86: export type DeleteResult =
   87:   | { ok: true }
   88:   | { ok: false; formError: string };
   89: 
   90: export async function saveArticle(
   91:   instanceSlug: string,
   92:   originalSlug: string | null,
   93:   _prev: SaveResult | null,
   94:   formData: FormData,
   95: ): Promise<SaveResult> {
   96:   const parsed = InputSchema.safeParse(Object.fromEntries(formData));
   97:   if (!parsed.success) {
   98:     const fieldErrors: Record<string, string[]> = {};
   99:     for (const issue of parsed.error.issues) {
  100:       const field = issue.path.join(".") || "_";
  101:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  102:     }
  103:     return { ok: false, fieldErrors };
  104:   }
  105: 
  106:   const aCtx = await resolveActionContext(instanceSlug);
  107:   const sqlBase = getSqlBase();
  108: 
  109:   try {
  110:     const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
  111:       assertActionEligibility(ctx, "operator-edit-content");
  112: 
  113:       const isPublished = parsed.data.status === "published";
  114: 
  115:       // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
  116:       let currentAuthorId: string | null = null;
  117:       let currentCategoryId: string | null = null;
  118:       let beforePublishedAt: Date | null = null;
  119:       if (originalSlug !== null) {
  120:         const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null; category_id: string }[]>`
  121:           SELECT id, published_at, author_doctor_id, category_id FROM article
  122:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
  123:            FOR UPDATE
  124:         `;
  125:         if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
  126:         currentAuthorId = beforeRows[0]!.author_doctor_id;
  127:         currentCategoryId = beforeRows[0]!.category_id;
  128:         beforePublishedAt = beforeRows[0]!.published_at;
  129:       }
  130: 
  131:       // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 instance-scoped 사전 검증 (cycle 1 ECC-03 patch).
  132:       //   1) form 값이 있으면 같은 tx 안에서 SELECT 로 존재/tenant 확인 — 없으면 category-not-found.
  133:       //   2) 없으면 current row 의 categoryId 유지.
  134:       //   3) 둘 다 없으면 default `general` SELECT — 없으면 default-category-missing.
  135:       let resolvedCategoryId: string;
  136:       if (parsed.data.categoryId) {
  137:         const categoryRows = await tx<{ id: string }[]>`
  138:           SELECT id FROM article_category
  139:            WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
  140:            LIMIT 1
  141:         `;
  142:         if (categoryRows.length === 0) {
  143:           return { ok: false as const, action: "category-not-found" as const };
  144:         }
  145:         resolvedCategoryId = categoryRows[0]!.id;
  146:       } else if (currentCategoryId !== null) {
  147:         resolvedCategoryId = currentCategoryId;
  148:       } else {
  149:         const defaultCategoryRows = await tx<{ id: string }[]>`
  150:           SELECT id FROM article_category
  151:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
  152:            LIMIT 1
  153:         `;
  154:         if (defaultCategoryRows.length === 0) {
  155:           return { ok: false as const, action: "default-category-missing" as const };
  156:         }
  157:         resolvedCategoryId = defaultCategoryRows[0]!.id;
  158:       }
  159: 
  160:       // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
  161:       if (parsed.data.authorDoctorId) {
  162:         const doctorRows = await tx<{ id: string; active: boolean }[]>`
  163:           SELECT id, active FROM doctor_profile
  164:            WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
  165:            LIMIT 1
  166:         `;
  167:         if (doctorRows.length === 0) {
  168:           return { ok: false as const, action: "author-not-found" as const };
  169:         }
  170:         const d = doctorRows[0]!;
  171:         if (!d.active && d.id !== currentAuthorId) {
  172:           return { ok: false as const, action: "author-inactive" as const };
  173:         }
  174:       }
  175: 
  176:       if (originalSlug !== null) {
  177:         const newPublishedAt = isPublished ? (beforePublishedAt ?? new Date()) : null;
  178:         await tx`
  179:           UPDATE article
  180:              SET slug = ${parsed.data.slug},
  181:                  title = ${parsed.data.title},
  182:                  summary = ${parsed.data.summary},
  183:                  body_markdown = ${parsed.data.bodyMarkdown},
  184:                  status = ${parsed.data.status}::content_publication_status,
  185:                  risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
  186:                  hero_image_url = ${parsed.data.heroImageUrl ?? null},
  187:                  author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
  188:                  category_id = ${resolvedCategoryId}::uuid,
  189:                  published_at = ${newPublishedAt},
  190:                  updated_at = now()
  191:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
  192:         `;
  193:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
  194:       }
  195: 
  196:       await tx`
  197:         INSERT INTO article (
  198:           instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id, published_at
  199:         ) VALUES (
  200:           ${ctx.instanceId}::uuid,
  201:           ${parsed.data.slug},
  202:           ${parsed.data.title},
  203:           ${parsed.data.summary},
  204:           ${parsed.data.bodyMarkdown},
  205:           ${parsed.data.status}::content_publication_status,
  206:           ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
  207:           ${parsed.data.heroImageUrl ?? null},
  208:           ${parsed.data.authorDoctorId ?? null}::uuid,
  209:           ${resolvedCategoryId}::uuid,
  210:           ${isPublished ? new Date() : null}
  211:         )
  212:       `;
  213:       return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
  214:     });
  215: 
  216:     if (txResult.ok === false) {
  217:       if (txResult.action === "notfound") notFound();
  218:       if (txResult.action === "author-not-found") {
  219:         return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
  220:       }
  221:       if (txResult.action === "author-inactive") {
  222:         return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
  223:       }
  224:       if (txResult.action === "default-category-missing") {
  225:         return { ok: false, fieldErrors: {}, formError: "기본 카테고리가 없습니다. 관리자에게 문의하세요 (EC-SCHEMA-03)." };
  226:       }
  227:       if (txResult.action === "category-not-found") {
  228:         return { ok: false, fieldErrors: { categoryId: ["해당 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택하세요."] } };
  229:       }
  230:     }
  231:     if (txResult.ok === true) {
  232:       try {
  233:         await emitAuditEvent(sqlBase, {
  234:           eventType: "content-saved",
  235:           actorUserId: txResult.ctx.userId,
  236:           targetUserId: txResult.ctx.userId,
  237:           toInstanceId: txResult.ctx.instanceId,
  238:           payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
  239:         });
  240:       } catch (auditErr) {
  241:         console.error("[saveArticle] audit emit failed", auditErr);
  242:       }
  243:       revalidatePath(`/admin/${instanceSlug}/articles`);
  244:       revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
  245:       if (originalSlug !== null && originalSlug !== txResult.slug) {
  246:         revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
  247:       }
  248:       revalidatePath(`/admin/${instanceSlug}`);
  249:       if (originalSlug === null || originalSlug !== txResult.slug) {
  250:         redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
  251:       }
  252:       return { ok: true, slug: txResult.slug };
  253:     }
  254:     return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  255:   } catch (err) {
  256:     if (isNextControlFlowError(err)) throw err;
  257:     const mapped = mapDbErrorToResult(err);
  258:     if (mapped !== null) {
  259:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
  260:       return { ok: false, fieldErrors: {}, formError: mapped.message };
  261:     }
  262:     if (err instanceof TenantResolveError) {
  263:       const action = mapAuthDenyReasonToUi(err.reason);
  264:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  265:       if (action.kind === "not-found") notFound();
  266:       if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
  267:       // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
  268:       if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  269:     }
  270:     console.error("[saveArticle] unexpected", err);
  271:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  272:   }
  273: }
  274: 
  275: export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
  276:   const aCtx = await resolveActionContext(instanceSlug);
  277:   const sqlBase = getSqlBase();
  278: 
  279:   try {
  280:     const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
  281:       assertActionEligibility(ctx, "operator-edit-content");
  282:       const deleted = await tx<{ id: string }[]>`
  283:         DELETE FROM article
  284:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
  285:          RETURNING id
  286:       `;
  287:       return { deleted: deleted.length };
  288:     });
  289: 
  290:     if (result.deleted === 0) {
  291:       return { ok: false, formError: "해당 아티클이 이미 삭제되었습니다." };
  292:     }
  293: 
  294:     try {
  295:       await emitAuditEvent(sqlBase, {
  296:         eventType: "content-deleted",
  297:         actorUserId: aCtx.userId,
  298:         targetUserId: aCtx.userId,
  299:         toInstanceId: aCtx.instanceId,
  300:         payload: { contentType: "Article", slug },
  301:       });
  302:     } catch (err) {
  303:       console.error("[deleteArticle] audit emit failed", err);
  304:     }
  305: 
  306:     revalidatePath(`/admin/${instanceSlug}/articles`);
  307:     revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
  308:     revalidatePath(`/admin/${instanceSlug}`);
  309:     redirect(`/admin/${instanceSlug}/articles`);
  310:   } catch (err) {
  311:     if (isNextControlFlowError(err)) throw err;
  312:     if (err instanceof TenantResolveError) {
  313:       const action = mapAuthDenyReasonToUi(err.reason);
  314:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  315:       if (action.kind === "not-found") notFound();
  316:       if (action.kind === "forbidden") return { ok: false, formError: action.message };
  317:       // cycle5-3entity WEB-52: info branch 처리 (delete path)
  318:       if (action.kind === "info") return { ok: false, formError: action.message };
  319:     }
  320:     const mapped = mapDbErrorToResult(err);
  321:     if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
  322:     console.error("[deleteArticle] unexpected", err);
  323:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  324:   }
  325: }

 succeeded in 699ms:
    1: // @glitzy/web/(site)/[instanceSlug]/faq — P-011 FAQ public page
    2: // SoT: EAT_CONTENT_PLAN v1.0 § 5.1 (EC-RENDER-01 · PSR-DEFER-11 부분 해소)
    3: //   - 데이터: faq published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21).
    4: //   - 표시: Q&A 카드 list (display_order asc, id asc) — <details> collapsible.
    5: //   - 빈 페이지 처리: 0 row 도 200 (404 아님) · 빈 상태 UI · JSON-LD mainEntity = [].
    6: //   - JSON-LD: FAQPage + Question/Answer (renderMarkdownToPlainText helper).
    7: 
    8: import { notFound } from "next/navigation";
    9: import type { Metadata } from "next";
   10: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   11: import { normalizeFaq, type FaqRow } from "@/lib/db-projection";
   12: import { loadSiteInitial } from "@/lib/site-initial";
   13: import { Breadcrumb } from "@/components/site/Breadcrumb";
   14: import { buildPageMetadata } from "@/lib/site-metadata";
   15: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
   16: import { faqPageGraph } from "@/lib/json-ld/builders";
   17: import { siteBaseUrl } from "@/lib/site-url";
   18: import { renderMarkdownToHtml } from "@/lib/markdown";
   19: 
   20: export const revalidate = 60;
   21: 
   22: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
   23:   const initial = await loadSiteInitial(params.instanceSlug);
   24:   if (!initial) return {};
   25:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
   26:     pageTitle: "자주 묻는 질문",
   27:     description: `${initial.clinic.name} 의 자주 묻는 질문 모음입니다.`,
   28:     canonicalPath: "/faq",
   29:     ogType: "website",
   30:   });
   31: }
   32: 
   33: export default async function FaqPage({ params }: { params: { instanceSlug: string } }) {
   34:   const initial = await loadSiteInitial(params.instanceSlug);
   35:   if (!initial) notFound();
   36: 
   37:   const faqsOrNull = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
   38:     const rows = await tx<FaqRow[]>`
   39:       SELECT slug, question, answer, display_order, category_id, related_treatment_id,
   40:              author_doctor_id, published_at, updated_at
   41:         FROM faq
   42:        ORDER BY display_order ASC, id ASC
   43:     `;
   44:     return rows.map(normalizeFaq);
   45:   });
   46:   // EC-RENDER-01 (cycle 1 ECP-21): 빈 페이지 200 (404 아님). instance 자체가 없으면 위에서 notFound 처리됨.
   47:   const faqs = faqsOrNull ?? [];
   48: 
   49:   const base = `/${params.instanceSlug}`;
   50:   const hostOrigin = siteBaseUrl(params.instanceSlug);
   51:   const description = `${initial.clinic.name} 의 자주 묻는 질문 모음입니다.`;
   52:   const graph = faqPageGraph(
   53:     { siteBaseUrl: hostOrigin, pagePath: "/faq" },
   54:     initial.clinic,
   55:     faqs,
   56:     description,
   57:   );
   58: 
   59:   return (
   60:     <>
   61:       <JsonLdScript graph={graph} />
   62:       <Breadcrumb items={[{ label: "홈", href: base }, { label: "자주 묻는 질문", href: null }]} />
   63:       <section className="mx-auto max-w-3xl px-4 py-12">
   64:         <h1 className="text-3xl font-bold text-fg-default">자주 묻는 질문</h1>
   65:         <p className="mt-2 text-base text-fg-muted">{description}</p>
   66: 
   67:         {faqs.length === 0 ? (
   68:           <div className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-fg-muted">
   69:             자주 묻는 질문이 아직 등록되지 않았습니다.
   70:           </div>
   71:         ) : (
   72:           <ul className="mt-8 flex flex-col gap-3">
   73:             {faqs.map((f) => (
   74:               <li key={f.slug} className="rounded-md border border-slate-200 bg-white">
   75:                 {/* cycle 1 ECC-06 patch: disclosure affordance — chevron 아이콘 (aria-hidden) + open 상태 회전 + open 배경 강조.
   76:                     native <details> keyboard a11y 유지 + 시각적 펼침/접힘 신호 강화. */}
   77:                 <details className="group">
   78:                   <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-medium text-fg-default group-open:bg-slate-50">
   79:                     <span>
   80:                       <span className="mr-2 text-blue-700">Q.</span>
   81:                       {f.question}
   82:                     </span>
   83:                     <span aria-hidden="true" className="select-none text-sm text-slate-500 transition-transform group-open:rotate-180">
   84:                       ⌃
   85:                     </span>
   86:                   </summary>
   87:                   <div
   88:                     className="prose prose-sm max-w-none px-4 pb-4 pt-1 text-fg-default"
   89:                     // sanitize-html SSR 정합 — XSS 안전.
   90:                     dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(f.answer, hostOrigin) }}
   91:                   />
   92:                 </details>
   93:               </li>
   94:             ))}
   95:           </ul>
   96:         )}
   97:       </section>
   98:     </>
   99:   );
  100: }

 succeeded in 723ms:
    1: // @glitzy/web/lib/markdown — SSR-safe Markdown 렌더
    2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
    3: //
    4: // 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
    5: // 외부 링크: rel="nofollow noopener noreferrer" 자동.
    6: // LegalDocument body 도 동일 컴포넌트 사용 (CONTENT_STANDARDS § 7.1.1.1 면제는 어드민 저장 단계 결정).
    7: 
    8: import sanitizeHtml from "sanitize-html";
    9: 
   10: const ALLOWED_TAGS = [
   11:   "h1", "h2", "h3", "h4",
   12:   "p",
   13:   "ul", "ol", "li",
   14:   "a",
   15:   "strong", "em", "code", "pre",
   16:   "blockquote",
   17:   "table", "thead", "tbody", "tr", "th", "td",
   18:   "hr", "br",
   19: ];
   20: 
   21: const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
   22:   "*": ["class", "id", "lang"],
   23:   a: ["href", "rel", "target"],
   24:   code: ["class"],
   25:   pre: ["class"],
   26: };
   27: 
   28: const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];
   29: 
   30: /**
   31:  * Markdown 또는 raw HTML → sanitized HTML.
   32:  * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
   33:  * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
   34:  * 본 함수는 raw HTML / 단순 Markdown 양쪽 모두 동작.
   35:  *
   36:  * @param input — raw markdown 또는 raw HTML
   37:  * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
   38:  */
   39: export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
   40:   // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
   41:   const html = minimalMarkdownToHtml(input);
   42: 
   43:   // 2) sanitize
   44:   const sanitized = sanitizeHtml(html, {
   45:     allowedTags: ALLOWED_TAGS,
   46:     allowedAttributes: ALLOWED_ATTRIBUTES,
   47:     allowedSchemes: ALLOWED_SCHEMES,
   48:     allowedSchemesAppliedToAttributes: ["href"],
   49:     transformTags: {
   50:       a: (tagName: string, attribs: Record<string, string>) => {
   51:         const href = attribs.href ?? "";
   52:         const isExternal = isExternalLink(href, hostOrigin);
   53:         return {
   54:           tagName,
   55:           attribs: {
   56:             ...attribs,
   57:             ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
   58:           },
   59:         };
   60:       },
   61:     },
   62:   });
   63:   return sanitized;
   64: }
   65: 
   66: /**
   67:  * minimal Markdown → HTML (v0.1).
   68:  * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
   69:  * PSR-DEFER-17 합류 시 remark/marked 로 전환.
   70:  */
   71: function minimalMarkdownToHtml(md: string): string {
   72:   // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
   73:   const lines = md.split(/\r?\n/);
   74:   const out: string[] = [];
   75:   let inList = false;
   76:   let inPara: string[] = [];
   77:   const flushPara = () => {
   78:     if (inPara.length === 0) return;
   79:     out.push(`<p>${formatInline(inPara.join(" "))}</p>`);
   80:     inPara = [];
   81:   };
   82:   const flushList = () => {
   83:     if (!inList) return;
   84:     out.push("</ul>");
   85:     inList = false;
   86:   };
   87:   for (const raw of lines) {
   88:     const line = raw.trim();
   89:     if (line === "") {
   90:       flushPara();
   91:       flushList();
   92:       continue;
   93:     }
   94:     const h = /^(#{1,4})\s+(.+)$/.exec(line);
   95:     if (h) {
   96:       flushPara();
   97:       flushList();
   98:       const level = h[1]!.length;
   99:       out.push(`<h${level}>${formatInline(h[2]!)}</h${level}>`);
  100:       continue;
  101:     }
  102:     if (line.startsWith("- ") || line.startsWith("* ")) {
  103:       flushPara();
  104:       if (!inList) {
  105:         out.push("<ul>");
  106:         inList = true;
  107:       }
  108:       out.push(`<li>${formatInline(line.slice(2))}</li>`);
  109:       continue;
  110:     }
  111:     flushList();
  112:     inPara.push(line);
  113:   }
  114:   flushPara();
  115:   flushList();
  116:   return out.join("\n");
  117: }
  118: 
  119: function formatInline(text: string): string {
  120:   let out = escapeHtml(text);
  121:   // [link](url)
  122:   out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
  123:   // **bold**
  124:   out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  125:   // *italic*
  126:   out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  127:   // `code`
  128:   out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  129:   return out;
  130: }
  131: 
  132: function escapeHtml(text: string): string {
  133:   return text
  134:     .replace(/&/g, "&amp;")
  135:     .replace(/</g, "&lt;")
  136:     .replace(/>/g, "&gt;");
  137: }
  138: 
  139: /**
  140:  * EAT_CONTENT_PLAN v1.0 EC-RENDER-05 (cycle 1 ECP-19):
  141:  *   Markdown → plain text strip — JSON-LD `Answer.text` 용.
  142:  *   heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal.
  143:  */
  144: export function renderMarkdownToPlainText(input: string): string {
  145:   let out = input;
  146:   // 코드 블록 (```...```) — 내용 유지, 펜스만 제거
  147:   out = out.replace(/```[a-zA-Z0-9-]*\n([\s\S]*?)```/g, (_, body) => String(body));
  148:   // inline code (`code`)
  149:   out = out.replace(/`([^`]+)`/g, "$1");
  150:   // bold / italic — Markdown 마커 strip (** or __ for bold, * or _ for italic)
  151:   out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  152:   out = out.replace(/__([^_]+)__/g, "$1");
  153:   out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  154:   out = out.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
  155:   // cycle 1 ECC-05 patch: image 치환을 link 치환보다 먼저.
  156:   //   link regex `\[...\]\(...\)` 가 image `![alt](url)` 의 `[alt](url)` 을 소비하면 `!alt` 잔존 → 품질 이슈.
  157:   // image ![alt](url) → alt
  158:   out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  159:   // link [text](url) → text
  160:   out = out.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  161:   // heading (#, ##, ###, ####) — 마커 strip
  162:   out = out.replace(/^\s*#{1,6}\s+/gm, "");
  163:   // blockquote (>)
  164:   out = out.replace(/^\s*>\s?/gm, "");
  165:   // list bullets — '- ' / '* ' / '+ ' / 'n. ' → 평문
  166:   out = out.replace(/^\s*[-*+]\s+/gm, "");
  167:   out = out.replace(/^\s*\d+\.\s+/gm, "");
  168:   // hr (--- / *** / ___)
  169:   out = out.replace(/^\s*[-_*]{3,}\s*$/gm, "");
  170:   // HTML tags — strip (sanitize-html 사용 안 함 — 평문이므로 simple strip)
  171:   out = out.replace(/<[^>]+>/g, "");
  172:   // multi blank line collapse + trim
  173:   out = out.replace(/[ \t]+/g, " ");
  174:   out = out.replace(/\n{3,}/g, "\n\n");
  175:   return out.trim();
  176: }
  177: 
  178: function isExternalLink(href: string, hostOrigin: string): boolean {
  179:   // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
  180:   if (href.startsWith("//")) return true;
  181:   if (href.startsWith("/") || href.startsWith("#")) return false;
  182:   try {
  183:     const u = new URL(href, hostOrigin);
  184:     const host = new URL(hostOrigin).host;
  185:     return u.host !== host;
  186:   } catch {
  187:     return false;
  188:   }
  189: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "article_category_fk|categoryId|ArticleCategoryInputSchema|article_category|category-not-found|renderMarkdownToPlainText|FAQPage|faqPageGraph" apps/web/src packages/core-content/src packages/core-content/migrations packages/db/migrations -S' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/lib/errors.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/lib/eat-content-schema.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/components/forms/ArticleForm.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 706ms:
packages/db/migrations\D0014_public_reader_eat.sql:6:-- article_category 는 taxonomy public 의도 — instance_id only (status 없음, EC-SCHEMA-17 결정).
packages/db/migrations\D0014_public_reader_eat.sql:8:-- Precondition: D0011 (app_public_reader) · C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq
packages/db/migrations\D0014_public_reader_eat.sql:10:GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
packages/db/migrations\D0014_public_reader_eat.sql:12:-- ===== article_category: taxonomy public — instance_id only =====
packages/db/migrations\D0014_public_reader_eat.sql:15:CREATE POLICY public_reader_article_category_select
packages/db/migrations\D0014_public_reader_eat.sql:16:  ON article_category FOR SELECT TO app_public_reader
packages/core-content/migrations\C0009_article_category.sql:6:CREATE TABLE article_category (
packages/core-content/migrations\C0009_article_category.sql:21:  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations\C0009_article_category.sql:22:  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),
packages/core-content/migrations\C0009_article_category.sql:23:  CONSTRAINT article_category_description_length CHECK (
packages/core-content/migrations\C0009_article_category.sql:26:  CONSTRAINT article_category_cover_image_url_format CHECK (
packages/core-content/migrations\C0009_article_category.sql:29:  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations\C0009_article_category.sql:30:  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
packages/core-content/migrations\C0009_article_category.sql:31:  CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
packages/core-content/migrations\C0009_article_category.sql:32:    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
packages/core-content/migrations\C0009_article_category.sql:35:CREATE INDEX article_category_instance_idx ON article_category (instance_id);
packages/core-content/migrations\C0009_article_category.sql:36:CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
packages/core-content/migrations\C0009_article_category.sql:37:CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
packages/core-content/migrations\C0009_article_category.sql:40:ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0009_article_category.sql:41:ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0009_article_category.sql:43:CREATE POLICY tenant_isolation ON article_category
packages/core-content/migrations\C0009_article_category.sql:48:GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
packages/core-content/migrations\C0012_faq.sql:5:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 treatment_page · C0009 article_category · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations\C0012_faq.sql:34:    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
packages/core-content/migrations\C0013_article_category_fk.sql:8:-- Precondition: C0005 article · C0009 article_category
packages/core-content/migrations\C0013_article_category_fk.sql:15:INSERT INTO article_category (instance_id, slug, name, display_order)
packages/core-content/migrations\C0013_article_category_fk.sql:23:FROM article_category ac
packages/core-content/migrations\C0013_article_category_fk.sql:35:    RAISE EXCEPTION 'C0013: article.category_id 가 NULL 인 row % 건이 backfill 후에도 잔존합니다. article_category seed 누락 instance 확인 필요.', null_count;
packages/core-content/migrations\C0013_article_category_fk.sql:46:    SELECT 1 FROM pg_constraint WHERE conname = 'article_category_fk'
packages/core-content/migrations\C0013_article_category_fk.sql:48:    ALTER TABLE article ADD CONSTRAINT article_category_fk
packages/core-content/migrations\C0013_article_category_fk.sql:50:      REFERENCES article_category (instance_id, id)
packages/core-content/migrations\C0013_article_category_fk.sql:56:CREATE INDEX IF NOT EXISTS article_category_idx ON article (instance_id, category_id);
apps/web/src\seed.ts:164:      // 4.5) default `general` article_category — EAT_CONTENT v1.0 EC-SCHEMA-03 (cycle 1 ECP-09)
apps/web/src\seed.ts:167:        INSERT INTO article_category (instance_id, slug, name, display_order)
packages/core-content/src\schema.ts:4:// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
packages/core-content/src\schema.ts:222:    categoryId: uuid("category_id").notNull(),
packages/core-content/src\schema.ts:243:    categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
packages/core-content/src\schema.ts:250:    // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
packages/core-content/src\schema.ts:315:  "article_category",
packages/core-content/src\schema.ts:333:    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
packages/core-content/src\schema.ts:334:    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
packages/core-content/src\schema.ts:335:    descLen: check("article_category_description_length",
packages/core-content/src\schema.ts:337:    coverImageUrlFormat: check("article_category_cover_image_url_format",
packages/core-content/src\schema.ts:339:    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
packages/core-content/src\schema.ts:340:    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
packages/core-content/src\schema.ts:341:    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
packages/core-content/src\schema.ts:342:    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
packages/core-content/src\schema.ts:343:    parentIdx: index("article_category_parent_idx")
packages/core-content/src\schema.ts:351:      name: "article_category_parent_fk",
packages/core-content/src\schema.ts:483:    categoryId: uuid("category_id"),
packages/core-content/src\schema.ts:509:    categoryIdx: index("faq_category_idx")
packages/core-content/src\schema.ts:510:      .on(t.instanceId, t.categoryId)
packages/core-content/src\schema.ts:511:      .where(sql`${t.categoryId} IS NOT NULL`),
packages/core-content/src\schema.ts:514:      columns: [t.instanceId, t.categoryId],
apps/web/src\lib\db-projection.ts:73:  category_slug: string;      // v0.4 EC-RENDER-04: SQL JOIN article_category ON ... — render layer 사용
apps/web/src\lib\db-projection.ts:170:  categoryId: string;
apps/web/src\lib\db-projection.ts:330:    categoryId: row.category_id,
apps/web/src\lib\db-projection.ts:490:  categoryId: string | null;
apps/web/src\lib\db-projection.ts:503:    categoryId: row.category_id,
apps/web/src\components\forms\ArticleForm.tsx:18:  categoryId: string;
apps/web/src\components\forms\ArticleForm.tsx:30:  categoryId: "",
apps/web/src\components\forms\ArticleForm.tsx:98:        name="categoryId"
apps/web/src\components\forms\ArticleForm.tsx:100:        value={v.categoryId}
apps/web/src\components\forms\ArticleForm.tsx:101:        onChange={(x) => set("categoryId", x)}
apps/web/src\components\forms\ArticleForm.tsx:103:        errors={fieldErrors.categoryId}
apps/web/src\lib\eat-content-schema.ts:117:export const ArticleCategoryInputSchema = z.object({
apps/web/src\lib\eat-content-schema.ts:129:export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;
apps/web/src\lib\eat-content-schema.ts:213:  categoryId: uuidOptional("카테고리"),
apps/web/src\lib\markdown.test.ts:5:import { renderMarkdownToHtml, renderMarkdownToPlainText } from "./markdown";
apps/web/src\lib\markdown.test.ts:68:// EAT_CONTENT_PLAN v1.0 EC-RENDER-05 — renderMarkdownToPlainText
apps/web/src\lib\markdown.test.ts:69:describe("renderMarkdownToPlainText (JSON-LD Answer.text)", () => {
apps/web/src\lib\markdown.test.ts:72:    const out = renderMarkdownToPlainText(md);
apps/web/src\lib\markdown.test.ts:85:    const out = renderMarkdownToPlainText(md);
apps/web/src\lib\markdown.test.ts:92:    const out = renderMarkdownToPlainText(md);
apps/web/src\components\forms\FaqForm.tsx:15:  categoryId: string;
apps/web/src\components\forms\FaqForm.tsx:26:  categoryId: "",
apps/web/src\components\forms\FaqForm.tsx:74:      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
apps/web/src\lib\errors.ts:76:  article_category_slug_regex: { field: "slug", message: "카테고리 slug 형식이 올바르지 않습니다 (3~64자, 소문자/숫자/하이픈)." },
apps/web/src\lib\errors.ts:77:  article_category_name_length: { field: "name", message: "카테고리 이름은 1~50자여야 합니다." },
apps/web/src\lib\errors.ts:78:  article_category_description_length: { field: "description", message: "카테고리 설명은 입력 시 80~200자여야 합니다." },
apps/web/src\lib\errors.ts:79:  article_category_cover_image_url_format: { field: "coverImageUrl", message: "카테고리 커버 이미지 URL 은 http/https 로 시작해야 합니다." },
apps/web/src\lib\errors.ts:80:  article_category_instance_slug_unique: { field: "slug", message: "이미 사용 중인 카테고리 slug 입니다." },
apps/web/src\lib\errors.ts:81:  article_category_parent_fk: { field: null, message: "상위 카테고리를 찾을 수 없습니다." },
apps/web/src\lib\errors.ts:84:  article_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },
apps/web/src\lib\errors.ts:120:  faq_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },
apps/web/src\lib\markdown.ts:144:export function renderMarkdownToPlainText(input: string): string {
apps/web/src\lib\json-ld\builders.ts:4://   + faqPageGraph 신규.
apps/web/src\lib\json-ld\builders.ts:215://   SCHEMA_MAPPING § 6.3. FAQPage + Question[] mainEntity inline.
apps/web/src\lib\json-ld\builders.ts:217:export function faqPageGraph(
apps/web/src\lib\json-ld\entities.ts:3:// v0.4 EAT_CONTENT v1.0 cascade: ScholarlyArticle · VideoObject · FAQPage · Question/Answer
apps/web/src\lib\json-ld\entities.ts:17:import { renderMarkdownToPlainText } from "@/lib/markdown";
apps/web/src\lib\json-ld\entities.ts:265:// === EAT_CONTENT v1.0 — FAQPage / Question / Answer (C-12 FAQ) ===
apps/web/src\lib\json-ld\entities.ts:276:      text: renderMarkdownToPlainText(f.answer),
apps/web/src\lib\json-ld\entities.ts:280:    "@type": "FAQPage",
apps/web/src\app\(site)\[instanceSlug]\faq\page.tsx:6://   - JSON-LD: FAQPage + Question/Answer (renderMarkdownToPlainText helper).
apps/web/src\app\(site)\[instanceSlug]\faq\page.tsx:16:import { faqPageGraph } from "@/lib/json-ld/builders";
apps/web/src\app\(site)\[instanceSlug]\faq\page.tsx:52:  const graph = faqPageGraph(
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:14:import { ArticleCategoryInputSchema } from "@/lib/eat-content-schema";
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:25:  const parsed = ArticleCategoryInputSchema.safeParse(Object.fromEntries(formData));
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:46:            SELECT id FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:60:            UPDATE article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:72:          INSERT INTO article_category (instance_id, slug, name, description, display_order)
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:142:        //   FK 도 article_category(instance_id, id) lookup 단계에서 share lock 을 잡으므로 INSERT 가 본 row commit 전에는 진입 못 함.
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:144:          SELECT id, slug FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:160:          DELETE FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:204:      // cycle 1 ECC-04 patch: FK violation (article.article_category_fk) 은 race 시 발생.
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:205:      //   field mapping("categoryId") 도 form-level "사용 중" UX 로 변환.
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:207:      if (mapped.kind === "field" && mapped.errors.categoryId) {
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\page.tsx:43:            FROM article_category c
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:71:        JOIN article_category ac
apps/web/src\lib\json-ld\__tests__\validate.test.ts:99:  categoryId: "00000000-0000-0000-0000-0000000000c0",
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:41:        SELECT id, name FROM article_category
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:4:import { aboutGraph, doctorProfileGraph, faqPageGraph } from "../builders";
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:104:    categoryId: null,
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:139:  // # 27 — FAQPage graph 안 mainEntity 0건 (v0.1 published 차단 → 0 row)
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:140:  it("FAQPage empty mainEntity OK", () => {
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:142:    const graph = faqPageGraph(ctx, CLINIC, [], "FAQ");
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:144:    const faqEntity = graph["@graph"].find((e) => e["@type"] === "FAQPage");
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:182:    const plain = mod.renderMarkdownToPlainText(dangerous);
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:200:  //   대신 정책 결정 정합성 검증 — D0014 SQL 안 article_category policy 가 instance_id only 인 것을 file content 로 확인.
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:201:  it("D0014 article_category public_reader policy — instance_id only (no status)", async () => {
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:206:    expect(content).toContain("public_reader_article_category_select");
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:207:    // article_category policy 안 status 게이트 없음 확인
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:208:    const acBlock = content.split("public_reader_article_category_select")[1] ?? "";
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:226:  // FAQPage helper — Markdown → plain text
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\[slug]\page.tsx:39:            FROM article_category
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:3://   article JOIN article_category ON ... — category.slug 일치 검증 (mismatch → 404).
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:28:        JOIN article_category ac
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:60:        JOIN article_category ac
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:74:        SELECT id, name FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:88:          categoryId: r.category_id,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:75:  categoryId: z
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:131:      // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 instance-scoped 사전 검증 (cycle 1 ECC-03 patch).
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:132:      //   1) form 값이 있으면 같은 tx 안에서 SELECT 로 존재/tenant 확인 — 없으면 category-not-found.
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:133:      //   2) 없으면 current row 의 categoryId 유지.
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:136:      if (parsed.data.categoryId) {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:138:          SELECT id FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:139:           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.categoryId}::uuid
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:143:          return { ok: false as const, action: "category-not-found" as const };
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:150:          SELECT id FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:227:      if (txResult.action === "category-not-found") {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:228:        return { ok: false, fieldErrors: { categoryId: ["해당 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택하세요."] } };
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:52:          (SELECT count(*) FROM article_category WHERE instance_id = ${ctx.instanceId}::uuid) AS categories,
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:59:                   category_id = ${parsed.data.categoryId ?? null}::uuid,
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:79:            ${parsed.data.categoryId ?? null}::uuid,
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\page.tsx:44:            LEFT JOIN article_category c
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:41:    // v0.4 EC-RENDER-06 (cycle 1 ECP-17): article sitemap URL — 실 category slug 사용 (JOIN article_category).
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:45:        JOIN article_category ac
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx:36:          SELECT id, name FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:56:          SELECT id, name FROM article_category
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:77:            categoryId: r.category_id ?? "",

 succeeded in 680ms:
    1: // @glitzy/web/components/forms/ArticleForm
    2: "use client";
    3: 
    4: import { useState } from "react";
    5: import { useFormState, useFormStatus } from "react-dom";
    6: import { Field, SelectField } from "./Field";
    7: import type { SaveResult } from "@/lib/save-result";
    8: 
    9: export type ArticleInitial = {
   10:   slug: string;
   11:   title: string;
   12:   summary: string;
   13:   bodyMarkdown: string;
   14:   status: string;
   15:   riskLevel: string;
   16:   heroImageUrl: string;
   17:   authorDoctorId: string;
   18:   categoryId: string;
   19: };
   20: 
   21: const empty: ArticleInitial = {
   22:   slug: "",
   23:   title: "",
   24:   summary: "",
   25:   bodyMarkdown: "",
   26:   status: "draft",
   27:   riskLevel: "",
   28:   heroImageUrl: "",
   29:   authorDoctorId: "",
   30:   categoryId: "",
   31: };
   32: 
   33: const STATUS_OPTIONS = [
   34:   { value: "draft", label: "초안" },
   35:   { value: "review-queued", label: "검수 대기" },
   36:   { value: "in-review", label: "검수 중" },
   37:   { value: "approved", label: "승인됨" },
   38:   { value: "publishable", label: "발행 가능" },
   39:   { value: "published", label: "발행됨" },
   40:   { value: "blocked", label: "차단" },
   41:   { value: "rejected", label: "거부" },
   42:   { value: "stale", label: "만료" },
   43: ];
   44: 
   45: const RISK_OPTIONS = [
   46:   { value: "Low", label: "Low" },
   47:   { value: "Medium", label: "Medium" },
   48:   { value: "High", label: "High" },
   49: ];
   50: 
   51: export function ArticleForm({
   52:   action,
   53:   initial,
   54:   isNew,
   55:   doctorOptions,
   56:   categoryOptions,
   57: }: {
   58:   action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
   59:   initial: ArticleInitial | null;
   60:   isNew: boolean;
   61:   doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   62:   categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   63: }) {
   64:   const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
   65:   const [v, setV] = useState<ArticleInitial>(initial ?? empty);
   66:   const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
   67:   const formError = state && state.ok === false ? state.formError ?? null : null;
   68:   const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));
   69: 
   70:   return (
   71:     <form action={formAction} className="flex flex-col gap-5">
   72:       {state?.ok === true && (
   73:         <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
   74:           저장되었습니다.
   75:         </div>
   76:       )}
   77:       {formError && (
   78:         <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
   79:       )}
   80: 
   81:       <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
   82:       <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
   83:       <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
   84:       <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
   85:       <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
   86:       <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
   87:       <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
   88:       <SelectField
   89:         name="authorDoctorId"
   90:         label="저자 (DoctorProfile)"
   91:         value={v.authorDoctorId}
   92:         onChange={(x) => set("authorDoctorId", x)}
   93:         options={doctorOptions}
   94:         errors={fieldErrors.authorDoctorId}
   95:         hint="선택 시 해당 의료진의 저자 권위 표시"
   96:       />
   97:       <SelectField
   98:         name="categoryId"
   99:         label="카테고리"
  100:         value={v.categoryId}
  101:         onChange={(x) => set("categoryId", x)}
  102:         options={categoryOptions}
  103:         errors={fieldErrors.categoryId}
  104:         hint="비워두면 기본 카테고리(general) 사용"
  105:       />
  106: 
  107:       <SubmitButton isNew={isNew} />
  108:     </form>
  109:   );
  110: }
  111: 
  112: function SubmitButton({ isNew }: { isNew: boolean }) {
  113:   const { pending } = useFormStatus();
  114:   return (
  115:     <button
  116:       type="submit"
  117:       disabled={pending}
  118:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
  119:     >
  120:       {pending ? "저장 중…" : isNew ? "추가" : "저장"}
  121:     </button>
  122:   );
  123: }

 succeeded in 712ms:
    1: // @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
    2: // cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
    3: // LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError
    4: 
    5: /**
    6:  * LL-ACTION-21 (cycle3 LL-44 patch): assertHasMainLocationAfterTx 안전망 throw class.
    7:  * mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant).
    8:  */
    9: export class MainLocationMissingError extends Error {
   10:   override readonly name = "MainLocationMissingError";
   11:   constructor(message = "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요.") {
   12:     super(message);
   13:   }
   14: }
   15: 
   16: export type FieldErrors = Record<string, string[]>;
   17: 
   18: type Mapping = { field: string | null; message: string };
   19: 
   20: // constraint_name → field + 한국어 메시지
   21: const CONSTRAINT_MAP: Record<string, Mapping> = {
   22:   // ClinicProfile (C0001)
   23:   clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
   24:   clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
   25:   clinic_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다." },
   26:   clinic_profile_brn_regex: { field: "businessRegistrationNumber", message: "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000)." },
   27:   clinic_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   28: 
   29:   // DoctorProfile (C0003)
   30:   doctor_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~64자, 소문자/숫자/하이픈)" },
   31:   doctor_profile_name_length: { field: "name", message: "이름은 1~100자여야 합니다." },
   32:   doctor_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   33: 
   34:   // TreatmentPage (C0004)
   35:   treatment_page_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   36:   treatment_page_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   37:   treatment_page_summary_length: { field: "summary", message: "요약은 50~160자여야 합니다." },
   38:   treatment_page_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   39:   treatment_page_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   40: 
   41:   // Article (C0005)
   42:   article_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   43:   article_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   44:   article_summary_length: { field: "summary", message: "요약은 80~200자여야 합니다." },
   45:   article_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   46:   article_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   47:   article_author_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
   48: 
   49:   // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
   50:   clinic_profile_policy_email_regex: { field: "policyContactEmail", message: "개인정보 보호책임자 이메일 형식이 올바르지 않습니다." },
   51:   clinic_profile_policy_phone_format: { field: "policyContactPhone", message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   52:   clinic_profile_primary_ctas_array: { field: "primaryCtas", message: "예약 채널 입력값이 올바르지 않습니다." },
   53:   clinic_profile_primary_ctas_shape: { field: "primaryCtas", message: "예약 채널 항목의 형식이 올바르지 않습니다 (id · type · label · targetUrl 필수)." },
   54: 
   55:   // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
   56:   location_profile_clinic_fk: { field: null, message: "본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요." },
   57:   // LLC-10 patch: LocationProfile phone CHECK (C0002)
   58:   location_profile_phone_format: { field: "locationTelephone", message: "본원 전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   59: 
   60:   // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
   61:   legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
   62:   legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
   63:   legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
   64:   legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
   65:   legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
   66:   legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
   67:   legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
   68:   legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
   69:   legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
   70:   legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
   71:   legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
   72: 
   73:   // === EAT_CONTENT v1.0 cascade — 4 신규 entity ===
   74: 
   75:   // ArticleCategory (C0009)
   76:   article_category_slug_regex: { field: "slug", message: "카테고리 slug 형식이 올바르지 않습니다 (3~64자, 소문자/숫자/하이픈)." },
   77:   article_category_name_length: { field: "name", message: "카테고리 이름은 1~50자여야 합니다." },
   78:   article_category_description_length: { field: "description", message: "카테고리 설명은 입력 시 80~200자여야 합니다." },
   79:   article_category_cover_image_url_format: { field: "coverImageUrl", message: "카테고리 커버 이미지 URL 은 http/https 로 시작해야 합니다." },
   80:   article_category_instance_slug_unique: { field: "slug", message: "이미 사용 중인 카테고리 slug 입니다." },
   81:   article_category_parent_fk: { field: null, message: "상위 카테고리를 찾을 수 없습니다." },
   82: 
   83:   // Article.category_id (C0013 staged FK)
   84:   article_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },
   85: 
   86:   // Publication (C0010)
   87:   publication_slug_regex: { field: "slug", message: "publication slug 형식이 올바르지 않습니다 (3~100자)." },
   88:   publication_title_length: { field: "title", message: "제목은 1~300자여야 합니다." },
   89:   publication_summary_length: { field: "summary", message: "요약은 50~300자여야 합니다." },
   90:   publication_url_format: { field: "url", message: "원문 URL 은 http/https 로 시작해야 합니다." },
   91:   publication_thumbnail_url_format: { field: "thumbnailUrl", message: "썸네일 URL 은 http/https 로 시작해야 합니다." },
   92:   publication_doi_format: { field: "doi", message: "DOI 형식이 올바르지 않습니다 (예: 10.1000/xyz123)." },
   93:   publication_pubmed_id_format: { field: "pubmedId", message: "PubMed ID 는 1~9자리 숫자여야 합니다." },
   94:   publication_authors_array: { field: "authors", message: "저자는 1명 이상이어야 합니다." },
   95:   publication_risk_level_low_only: { field: null, message: "Publication 위험도는 Low 만 허용됩니다 (외부 학술 인용)." },
   96:   publication_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   97:   publication_instance_slug_unique: { field: "slug", message: "이미 사용 중인 publication slug 입니다." },
   98:   publication_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
   99: 
  100:   // MediaAppearance (C0011)
  101:   media_appearance_slug_regex: { field: "slug", message: "media appearance slug 형식이 올바르지 않습니다 (3~100자)." },
  102:   media_appearance_title_length: { field: "title", message: "제목은 1~300자여야 합니다." },
  103:   media_appearance_summary_length: { field: "summary", message: "요약은 50~300자여야 합니다." },
  104:   media_appearance_channel_name_length: { field: "channelName", message: "채널명은 1~100자여야 합니다." },
  105:   media_appearance_url_format: { field: "url", message: "원문 URL 은 http/https 로 시작해야 합니다." },
  106:   media_appearance_thumbnail_url_format: { field: "thumbnailUrl", message: "썸네일 URL 은 http/https 로 시작해야 합니다." },
  107:   media_appearance_duration_positive: { field: "durationSeconds", message: "길이(초) 는 양의 정수여야 합니다." },
  108:   media_appearance_risk_level_low_only: { field: null, message: "MediaAppearance 위험도는 Low 만 허용됩니다." },
  109:   media_appearance_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
  110:   media_appearance_instance_slug_unique: { field: "slug", message: "이미 사용 중인 media appearance slug 입니다." },
  111:   media_appearance_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
  112: 
  113:   // FAQ (C0012)
  114:   faq_slug_regex: { field: "slug", message: "FAQ slug 형식이 올바르지 않습니다 (3~100자)." },
  115:   faq_question_length: { field: "question", message: "질문은 10~200자여야 합니다." },
  116:   faq_answer_length: { field: "answer", message: "답변은 50~2000자여야 합니다." },
  117:   faq_status_v01_limit: { field: null, message: "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12). 현재 단계에서는 draft 만 저장 가능합니다." },
  118:   faq_published_at_null_v01: { field: null, message: "FAQ 발행은 후속 단계입니다 (EC-DEFER-05·12)." },
  119:   faq_instance_slug_unique: { field: "slug", message: "이미 사용 중인 FAQ slug 입니다." },
  120:   faq_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },
  121:   faq_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
  122:   faq_related_treatment_fk: { field: "relatedTreatmentId", message: "해당 진료 페이지를 찾을 수 없습니다." },
  123: };
  124: 
  125: export type DbErrorResult =
  126:   | { kind: "field"; errors: FieldErrors }
  127:   | { kind: "form"; message: string };
  128: 
  129: /**
  130:  * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
  131:  * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
  132:  */
  133: export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
  134:   if (typeof err !== "object" || err === null) return null;
  135:   const e = err as { code?: string; constraint_name?: string; constraint?: string };
  136:   const code = e.code;
  137:   const constraint = e.constraint_name ?? e.constraint;
  138:   if (!code || !constraint) return null;
  139:   if (code !== "23514" && code !== "23505" && code !== "23503") return null;
  140: 
  141:   const mapping = CONSTRAINT_MAP[constraint];
  142:   if (mapping) {
  143:     if (mapping.field === null) return { kind: "form", message: mapping.message };
  144:     return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
  145:   }
  146: 
  147:   // unknown constraint — generic
  148:   if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
  149:   if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
  150:   if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
  151:   return null;
  152: }
  153: 
  154: /** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
  155: export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
  156:   const result = mapDbErrorToResult(err);
  157:   if (result === null) return null;
  158:   if (result.kind === "field") return result.errors;
  159:   return null;
  160: }

 succeeded in 706ms:
    1: // @glitzy/web/lib/eat-content-schema — EAT_CONTENT_PLAN v1.0 § 4.3 EC-FORM-03
    2: //
    3: // Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
    4: // DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
    5: //
    6: // v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.
    7: 
    8: import { z } from "zod";
    9: import { UUID_V4_REGEX } from "@glitzy/shared-types";
   10: 
   11: // === 공통 helper ===
   12: 
   13: const requiredTrimmed = (min: number, max: number, label: string) =>
   14:   z
   15:     .string({ required_error: `${label}은(는) 필수입니다.` })
   16:     .transform((v) => v.trim())
   17:     .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
   18:     .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });
   19: 
   20: const optionalTrimmed = (max: number) =>
   21:   z
   22:     .string()
   23:     .transform((v) => v.trim())
   24:     .transform((v) => (v === "" ? null : v))
   25:     .nullable()
   26:     .optional()
   27:     .refine((v) => v === null || v === undefined || v.length <= max, {
   28:       message: `최대 ${max}자입니다.`,
   29:     });
   30: 
   31: const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
   32: 
   33: const isoDateRequired = (label: string) =>
   34:   z
   35:     .string({ required_error: `${label}은(는) 필수입니다.` })
   36:     .transform((v) => v.trim())
   37:     .refine((v) => ISO_DATE_REGEX.test(v), { message: `${label}은(는) ISO 형식 (YYYY-MM-DD)` })
   38:     .refine(
   39:       (v) => {
   40:         const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
   41:         if (m === null) return false;
   42:         const y = Number(m[1]);
   43:         const mo = Number(m[2]);
   44:         const d = Number(m[3]);
   45:         const dt = new Date(Date.UTC(y, mo - 1, d));
   46:         return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
   47:       },
   48:       { message: `${label}은(는) 실제 존재하는 날짜여야 합니다.` },
   49:     );
   50: 
   51: const httpUrlRequired = (label: string) =>
   52:   z
   53:     .string({ required_error: `${label}은(는) 필수입니다.` })
   54:     .transform((v) => v.trim())
   55:     .refine((v) => /^https?:\/\//.test(v), { message: `${label}은(는) http:// 또는 https:// 로 시작해야 합니다.` })
   56:     .refine((v) => v.length <= 2048, { message: `${label}은(는) 2048자를 넘을 수 없습니다.` });
   57: 
   58: const httpUrlOptional = () =>
   59:   z
   60:     .string()
   61:     .transform((v) => v.trim())
   62:     .transform((v) => (v === "" ? null : v))
   63:     .nullable()
   64:     .optional()
   65:     .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
   66:       message: "URL 은 http/https · 2048자",
   67:     });
   68: 
   69: const uuidOptional = (label: string) =>
   70:   z
   71:     .string()
   72:     .transform((v) => v.trim())
   73:     .transform((v) => (v === "" ? null : v))
   74:     .nullable()
   75:     .optional()
   76:     .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
   77:       message: `${label}은(는) UUID 형식이어야 합니다.`,
   78:     });
   79: 
   80: const intOptional = (min: number, label: string) =>
   81:   z
   82:     .string()
   83:     .transform((v) => v.trim())
   84:     .transform((v) => (v === "" ? null : v))
   85:     .nullable()
   86:     .optional()
   87:     .refine((v) => v === null || v === undefined || /^[0-9]+$/.test(v), {
   88:       message: `${label}은(는) 양의 정수`,
   89:     })
   90:     .refine((v) => v === null || v === undefined || Number(v) >= min, {
   91:       message: `${label}은(는) ${min} 이상`,
   92:     });
   93: 
   94: const intRequired = (min: number, max: number, label: string) =>
   95:   z
   96:     .string({ required_error: `${label}은(는) 필수입니다.` })
   97:     .transform((v) => v.trim())
   98:     .refine((v) => /^[0-9]+$/.test(v), { message: `${label}은(는) 양의 정수` })
   99:     .refine((v) => {
  100:       const n = Number(v);
  101:       return n >= min && n <= max;
  102:     }, { message: `${label}은(는) ${min}~${max}` });
  103: 
  104: // EC-FORM-02: v0.1 단계 status enum subset
  105: export const EatStatusSchema = z.enum(["draft"], {
  106:   errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (EC-DEFER-12)" }),
  107: });
  108: 
  109: // EC-FORM-03 (DOI anchored — DB CHECK 와 동일)
  110: export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
  111: export const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
  112: export const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
  113: export const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;
  114: 
  115: // === ArticleCategory ===
  116: 
  117: export const ArticleCategoryInputSchema = z.object({
  118:   slug: requiredTrimmed(3, 64, "slug").refine((v) => SLUG_REGEX_SHORT.test(v), {
  119:     message: "slug 는 소문자/숫자/하이픈 (3~64자)",
  120:   }),
  121:   name: requiredTrimmed(1, 50, "이름"),
  122:   description: optionalTrimmed(200).refine(
  123:     (v) => v === null || v === undefined || v.length >= 80,
  124:     { message: "설명은 입력 시 80~200자" },
  125:   ),
  126:   displayOrder: intRequired(0, 9999, "표시 순서"),
  127: });
  128: 
  129: export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;
  130: 
  131: // === Publication ===
  132: 
  133: const authorsSchema = z
  134:   .string({ required_error: "저자는 필수입니다." })
  135:   .transform((v) => v.trim())
  136:   .transform((v) =>
  137:     v
  138:       .split(/[,\n]/)
  139:       .map((s) => s.trim())
  140:       .filter((s) => s.length > 0),
  141:   )
  142:   .refine((arr) => arr.length >= 1, { message: "저자는 1명 이상" })
  143:   .refine((arr) => arr.every((s) => s.length <= 100), { message: "저자명은 100자 이내" });
  144: 
  145: export const PublicationInputSchema = z.object({
  146:   slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
  147:     message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  148:   }),
  149:   title: requiredTrimmed(1, 300, "제목"),
  150:   authors: authorsSchema,
  151:   journal: optionalTrimmed(200),
  152:   publishedDate: isoDateRequired("게재일"),
  153:   doi: z
  154:     .string()
  155:     .transform((v) => v.trim())
  156:     .transform((v) => (v === "" ? null : v))
  157:     .nullable()
  158:     .optional()
  159:     .refine((v) => v === null || v === undefined || DOI_REGEX.test(v), {
  160:       message: "DOI 형식 오류 (예: 10.1000/xyz123)",
  161:     }),
  162:   pubmedId: z
  163:     .string()
  164:     .transform((v) => v.trim())
  165:     .transform((v) => (v === "" ? null : v))
  166:     .nullable()
  167:     .optional()
  168:     .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), {
  169:       message: "PubMed ID 는 1~9 자리 숫자",
  170:     }),
  171:   url: httpUrlRequired("URL"),
  172:   thumbnailUrl: httpUrlOptional(),
  173:   summary: requiredTrimmed(50, 300, "요약"),
  174:   authorDoctorId: uuidOptional("저자(의료진)"),
  175:   status: EatStatusSchema,
  176: });
  177: 
  178: export type PublicationInput = z.infer<typeof PublicationInputSchema>;
  179: 
  180: // === MediaAppearance ===
  181: 
  182: export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;
  183: 
  184: export const MediaAppearanceInputSchema = z.object({
  185:   slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
  186:     message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  187:   }),
  188:   title: requiredTrimmed(1, 300, "제목"),
  189:   channelName: requiredTrimmed(1, 100, "채널명"),
  190:   channelType: z.enum(MEDIA_CHANNEL_TYPES, {
  191:     errorMap: () => ({ message: "채널 종류는 broadcast/youtube/podcast/press 중 하나" }),
  192:   }),
  193:   publishedDate: isoDateRequired("게재일"),
  194:   durationSeconds: intOptional(1, "길이(초)"),
  195:   url: httpUrlRequired("URL"),
  196:   thumbnailUrl: httpUrlOptional(),
  197:   summary: requiredTrimmed(50, 300, "요약"),
  198:   authorDoctorId: uuidOptional("출연 의료진"),
  199:   status: EatStatusSchema,
  200: });
  201: 
  202: export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;
  203: 
  204: // === FAQ ===
  205: 
  206: export const FaqInputSchema = z.object({
  207:   slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
  208:     message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  209:   }),
  210:   question: requiredTrimmed(10, 200, "질문"),
  211:   answer: requiredTrimmed(50, 2000, "답변"),
  212:   displayOrder: intRequired(0, 9999, "표시 순서"),
  213:   categoryId: uuidOptional("카테고리"),
  214:   authorDoctorId: uuidOptional("작성자(의료진)"),
  215:   relatedTreatmentId: uuidOptional("관련 진료 페이지"),
  216:   status: EatStatusSchema,
  217: });
  218: 
  219: export type FaqInput = z.infer<typeof FaqInputSchema>;

codex
주변 매핑까지 확인해보니 FK 오류가 `categoryId` 필드로 매핑되고, 삭제 액션에서 form-level 메시지로 변환되는 흐름은 요청한 패치 의도와 일치합니다. 다만 마이그레이션의 constraint 존재 guard가 테이블을 한정하지 않는 작은 잔여 리스크가 보입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'packages/core-content/migrations/C0009_article_category.sql' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -Path '"'apps/web/src/lib/markdown.test.ts' | ForEach-Object { "'$i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 779ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/articles/new
    2: // cycle1-3entity WEB-03: page-level eligibility + withSkeletonTx catch
    3: import Link from "next/link";
    4: import { notFound, redirect } from "next/navigation";
    5: import { TenantResolveError } from "@glitzy/auth";
    6: 
    7: import { assertActionEligibility } from "@glitzy/auth";
    8: 
    9: import { withSkeletonTx } from "@/lib/tenant";
   10: import { requirePageContext } from "@/lib/page-context";
   11: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   12: import { ArticleForm } from "@/components/forms/ArticleForm";
   13: import { saveArticle } from "../actions";
   14: 
   15: export default async function ArticleNewPage({ params }: { params: { instanceSlug: string } }) {
   16:   let pageCtx;
   17:   try {
   18:     pageCtx = await requirePageContext(params.instanceSlug);
   19:   } catch (err) {
   20:     if (err instanceof TenantResolveError) {
   21:       const a = mapAuthDenyReasonToUi(err.reason);
   22:       if (a.kind === "forbidden" || a.kind === "info") {
   23:         return <main className="p-6"><p>{a.message}</p></main>;
   24:       }
   25:     }
   26:     throw err;
   27:   }
   28: 
   29:   let doctorOptions: ReadonlyArray<{ value: string; label: string }> = [];
   30:   let categoryOptions: ReadonlyArray<{ value: string; label: string }> = [];
   31:   try {
   32:     const result = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
   33:       // cycle2-3entity WEB-17: withSkeletonTx 안 첫 줄에서도 eligibility 재확인 (role race 보호)
   34:       assertActionEligibility(ctx, "operator-edit-content");
   35:       const doctorRows = await tx<{ id: string; name: string }[]>`
   36:         SELECT id, name FROM doctor_profile
   37:          WHERE instance_id = ${ctx.instanceId}::uuid AND active = true
   38:          ORDER BY display_order ASC, name ASC
   39:       `;
   40:       const categoryRows = await tx<{ id: string; name: string }[]>`
   41:         SELECT id, name FROM article_category
   42:          WHERE instance_id = ${ctx.instanceId}::uuid
   43:          ORDER BY display_order ASC, name ASC
   44:       `;
   45:       return {
   46:         doctors: doctorRows.map((r) => ({ value: r.id, label: r.name })),
   47:         categories: categoryRows.map((r) => ({ value: r.id, label: r.name })),
   48:       };
   49:     });
   50:     doctorOptions = result.doctors;
   51:     categoryOptions = result.categories;
   52:   } catch (err) {
   53:     if (err instanceof TenantResolveError) {
   54:       const a = mapAuthDenyReasonToUi(err.reason);
   55:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
   56:       if (a.kind === "not-found") notFound();
   57:       if (a.kind === "forbidden" || a.kind === "info") {
   58:         return <main className="p-6"><p>{a.message}</p></main>;
   59:       }
   60:     }
   61:     throw err;
   62:   }
   63: 
   64:   const bound = saveArticle.bind(null, params.instanceSlug, null);
   65:   return (
   66:     <main className="flex flex-col gap-6">
   67:       <header className="flex items-center justify-between">
   68:         <h1 className="text-2xl font-semibold">아티클 작성</h1>
   69:         <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
   70:       </header>
   71:       <ArticleForm action={bound} initial={null} isNew doctorOptions={doctorOptions} categoryOptions={categoryOptions} />
   72:     </main>
   73:   );
   74: }

 succeeded in 790ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/articles/[slug] — 편집
    2: // cycle2-3entity WEB-23: requirePageContext 통일
    3: import Link from "next/link";
    4: import { notFound, redirect } from "next/navigation";
    5: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    6: 
    7: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    8: import { requirePageContext } from "@/lib/page-context";
    9: import { withSkeletonTx } from "@/lib/tenant";
   10: import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
   11: import { DeleteForm } from "@/components/forms/DeleteForm";
   12: import { deleteArticle, saveArticle } from "../actions";
   13: 
   14: export default async function ArticleEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
   15:   let pageCtx;
   16:   try {
   17:     pageCtx = await requirePageContext(params.instanceSlug);
   18:   } catch (err) {
   19:     if (err instanceof TenantResolveError) {
   20:       const a = mapAuthDenyReasonToUi(err.reason);
   21:       if (a.kind === "forbidden" || a.kind === "info") {
   22:         return <main className="p-6"><p>{a.message}</p></main>;
   23:       }
   24:     }
   25:     throw err;
   26:   }
   27: 
   28:   // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
   29:   let bundle: {
   30:     initial: ArticleInitial;
   31:     doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   32:     categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   33:   } | null;
   34:   try {
   35:     bundle = await withSkeletonTx(
   36:     { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
   37:     async (tx, ctx): Promise<{
   38:       initial: ArticleInitial;
   39:       doctorOptions: ReadonlyArray<{ value: string; label: string }>;
   40:       categoryOptions: ReadonlyArray<{ value: string; label: string }>;
   41:     } | null> => {
   42:       assertActionEligibility(ctx, "operator-edit-content");
   43:       const articleRows = await tx<{
   44:         slug: string;
   45:         title: string;
   46:         summary: string;
   47:         body_markdown: string;
   48:         status: string;
   49:         risk_level: string | null;
   50:         hero_image_url: string | null;
   51:         author_doctor_id: string | null;
   52:         category_id: string;
   53:       }[]>`
   54:         SELECT slug, title, summary, body_markdown,
   55:                status::text AS status,
   56:                risk_level::text AS risk_level,
   57:                hero_image_url,
   58:                author_doctor_id,
   59:                category_id
   60:           FROM article
   61:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
   62:          LIMIT 1
   63:       `;
   64:       const r = articleRows[0];
   65:       if (!r) return null;
   66:       // cycle1-3entity WEB-09: 현재 author 가 inactive 여도 option 포함
   67:       const doctorRows = await tx<{ id: string; name: string; active: boolean }[]>`
   68:         SELECT id, name, active FROM doctor_profile
   69:          WHERE instance_id = ${ctx.instanceId}::uuid
   70:            AND (active = true OR id = ${r.author_doctor_id ?? null}::uuid)
   71:          ORDER BY active DESC, display_order ASC, name ASC
   72:       `;
   73:       const categoryRows = await tx<{ id: string; name: string }[]>`
   74:         SELECT id, name FROM article_category
   75:          WHERE instance_id = ${ctx.instanceId}::uuid
   76:          ORDER BY display_order ASC, name ASC
   77:       `;
   78:       return {
   79:         initial: {
   80:           slug: r.slug,
   81:           title: r.title,
   82:           summary: r.summary,
   83:           bodyMarkdown: r.body_markdown,
   84:           status: r.status,
   85:           riskLevel: r.risk_level ?? "",
   86:           heroImageUrl: r.hero_image_url ?? "",
   87:           authorDoctorId: r.author_doctor_id ?? "",
   88:           categoryId: r.category_id,
   89:         },
   90:         doctorOptions: doctorRows.map((d) => ({
   91:           value: d.id,
   92:           label: d.active ? d.name : `${d.name} (비활성)`,
   93:         })),
   94:         categoryOptions: categoryRows.map((c) => ({ value: c.id, label: c.name })),
   95:       };
   96:     },
   97:   );
   98:   } catch (err) {
   99:     if (err instanceof TenantResolveError) {
  100:       const a = mapAuthDenyReasonToUi(err.reason);
  101:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
  102:       if (a.kind === "not-found") notFound();
  103:       if (a.kind === "forbidden" || a.kind === "info") {
  104:         return <main className="p-6"><p>{a.message}</p></main>;
  105:       }
  106:     }
  107:     throw err;
  108:   }
  109:   if (bundle === null) notFound();
  110: 
  111:   const boundSave = saveArticle.bind(null, params.instanceSlug, params.slug);
  112:   const boundDelete = deleteArticle.bind(null, params.instanceSlug, params.slug);
  113: 
  114:   return (
  115:     <main className="flex flex-col gap-6">
  116:       <header className="flex items-center justify-between">
  117:         <h1 className="text-2xl font-semibold">아티클 편집 · {bundle.initial.title}</h1>
  118:         <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
  119:       </header>
  120: 
  121:       <ArticleForm
  122:         action={boundSave}
  123:         initial={bundle.initial}
  124:         isNew={false}
  125:         doctorOptions={bundle.doctorOptions}
  126:         categoryOptions={bundle.categoryOptions}
  127:       />
  128: 
  129:       <DeleteForm action={boundDelete} confirmMessage="정말 이 아티클을 삭제하시겠습니까?" />
  130:     </main>
  131:   );
  132: }

 succeeded in 820ms:
    1: -- @glitzy/core-content — C0009 ArticleCategory (DATA_MODEL C-22·EAT_CONTENT_PLAN v1.0 § 2.1)
    2: -- EC-SCHEMA-01·02·04·17: C-22 풀명세 컬럼 전체 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출.
    3: -- parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
    4: -- Precondition: D0010 instance
    5: 
    6: CREATE TABLE article_category (
    7:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    8:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    9:   slug TEXT NOT NULL,
   10:   name TEXT NOT NULL,
   11:   description TEXT,
   12:   pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
   13:   parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
   14:   cover_image_url TEXT,                          -- v0.1 nullable
   15:   seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
   16:   display_order INTEGER NOT NULL DEFAULT 0,
   17:   article_type_default TEXT,                     -- v0.1 nullable
   18:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
   19:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   20:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   21:   CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
   22:   CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),
   23:   CONSTRAINT article_category_description_length CHECK (
   24:     description IS NULL OR length(description) BETWEEN 80 AND 200
   25:   ),
   26:   CONSTRAINT article_category_cover_image_url_format CHECK (
   27:     cover_image_url IS NULL OR cover_image_url ~ '^https?://'
   28:   ),
   29:   CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
   30:   CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
   31:   CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
   32:     REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
   33: );
   34: 
   35: CREATE INDEX article_category_instance_idx ON article_category (instance_id);
   36: CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
   37: CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
   38:   WHERE parent_category_id IS NOT NULL;
   39: 
   40: ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
   41: ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
   42: 
   43: CREATE POLICY tenant_isolation ON article_category
   44:   FOR ALL TO app_tenant_user
   45:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
   46:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
   47: 
   48: GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;

 succeeded in 736ms:
    1: // PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS — Markdown sanitize
    2: // 시나리오 #13 XSS payload escape · #20 외부 링크 rel
    3: 
    4: import { describe, it, expect } from "vitest";
    5: import { renderMarkdownToHtml, renderMarkdownToPlainText } from "./markdown";
    6: 
    7: const HOST = "https://example.com/glitzy-clinic";
    8: 
    9: describe("Markdown sanitize (시나리오 #13 XSS — execution 불가)", () => {
   10:   it("<script> 태그는 escape — literal 텍스트로 출력 (execution X)", () => {
   11:     const md = `# 제목\n\n<script>alert(1)</script>본문`;
   12:     const html = renderMarkdownToHtml(md, HOST);
   13:     // raw `<script>` open tag 가 그대로 있으면 XSS execution → 그건 없어야
   14:     expect(html).not.toMatch(/<script[\s>]/);
   15:     // escape 된 literal text (`&lt;script&gt;`) 는 안전 — browser 가 plain text 로 표시
   16:     expect(html).toContain("&lt;script&gt;");
   17:   });
   18: 
   19:   it("<img onerror=...> 같은 inline JS 도 escape — DOM img 미생성", () => {
   20:     const md = `<img src=x onerror="alert(1)">`;
   21:     const html = renderMarkdownToHtml(md, HOST);
   22:     // 실 `<img>` DOM 으로 들어가면 안 됨
   23:     expect(html).not.toMatch(/<img\s/);
   24:     // escape 된 형태로 literal text (`&lt;img`) 출력
   25:     expect(html).toContain("&lt;img");
   26:   });
   27: 
   28:   it("일반 Markdown heading + paragraph 는 표준 출력", () => {
   29:     const md = `# 큰 제목\n\n본문 단락.`;
   30:     const html = renderMarkdownToHtml(md, HOST);
   31:     expect(html).toContain("<h1>");
   32:     expect(html).toContain("큰 제목");
   33:     expect(html).toContain("<p>");
   34:   });
   35: });
   36: 
   37: describe("외부 링크 rel (시나리오 #20)", () => {
   38:   it("외부 링크는 nofollow noopener noreferrer + target=_blank", () => {
   39:     const md = `[외부](https://www.evil.example/path)`;
   40:     const html = renderMarkdownToHtml(md, HOST);
   41:     expect(html).toContain("nofollow");
   42:     expect(html).toContain("noopener");
   43:     expect(html).toContain("noreferrer");
   44:     expect(html).toContain('target="_blank"');
   45:   });
   46: 
   47:   it("내부 절대 path 링크 (`/...`) 는 rel 없음", () => {
   48:     const md = `[내부](/glitzy-clinic/about)`;
   49:     const html = renderMarkdownToHtml(md, HOST);
   50:     expect(html).not.toContain("nofollow");
   51:     expect(html).not.toContain("noopener");
   52:   });
   53: 
   54:   it("protocol-relative (`//evil.example`) 는 외부 처리 (PSRC-12)", () => {
   55:     const md = `[evil](//evil.example/foo)`;
   56:     const html = renderMarkdownToHtml(md, HOST);
   57:     expect(html).toContain("nofollow");
   58:     expect(html).toContain("noopener");
   59:   });
   60: 
   61:   it("같은 host 절대 URL 은 내부", () => {
   62:     const md = `[same](${HOST}/contact)`;
   63:     const html = renderMarkdownToHtml(md, HOST);
   64:     expect(html).not.toContain("nofollow");
   65:   });
   66: });
   67: 
   68: // EAT_CONTENT_PLAN v1.0 EC-RENDER-05 — renderMarkdownToPlainText
   69: describe("renderMarkdownToPlainText (JSON-LD Answer.text)", () => {
   70:   it("heading/bold/italic/link/code 모두 평문 strip", () => {
   71:     const md = "# 제목\n\n**굵게** *기울임* `코드` [링크](https://x)";
   72:     const out = renderMarkdownToPlainText(md);
   73:     expect(out).not.toContain("#");
   74:     expect(out).not.toContain("**");
   75:     expect(out).not.toContain("`");
   76:     expect(out).not.toContain("(https://x)");
   77:     expect(out).toContain("제목");
   78:     expect(out).toContain("굵게");
   79:     expect(out).toContain("기울임");
   80:     expect(out).toContain("링크");
   81:   });
   82: 
   83:   it("<script> tag strip — XSS payload 평문", () => {
   84:     const md = "정상 답변 <script>alert(1)</script> 본문";
   85:     const out = renderMarkdownToPlainText(md);
   86:     expect(out).not.toContain("<script");
   87:     expect(out).toContain("정상 답변");
   88:   });
   89: 
   90:   it("list / blockquote / hr — 마커 strip", () => {
   91:     const md = "- 항목 1\n- 항목 2\n\n> 인용\n\n---";
   92:     const out = renderMarkdownToPlainText(md);
   93:     expect(out).toContain("항목 1");
   94:     expect(out).toContain("인용");
   95:     expect(out).not.toMatch(/^- /m);
   96:     expect(out).not.toMatch(/^> /m);
   97:     expect(out).not.toMatch(/^---$/m);
   98:   });
   99: });

codex
문서 SoT 기준으로 “required category”는 DB NOT NULL과 default `general` fallback 조합으로 구현되어 있어 새 결함으로 보지는 않겠습니다. 최종 판단 전에 지정된 테스트가 있는지 보고, 가볍게 실행 가능한 범위만 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'package.json'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path 'apps/web/package.json'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "vitest|test" package.json apps/web/package.json pnpm-workspace.yaml' in C:\Users\assag\solution\website-exposure
 succeeded in 692ms:
apps/web/package.json:12:    "test:scenarios": "vitest run"
apps/web/package.json:37:    "vitest": "^2.1.8",

 succeeded in 700ms:
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts",
    "test:scenarios": "vitest run"
  },
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "sanitize-html": "^2.13.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/sanitize-html": "^2.13.0",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.8",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

 succeeded in 708ms:
{
  "name": "website-exposure",
  "version": "0.1.0",
  "private": true,
  "description": "Glitzy 의료기관 웹사이트 노출 솔루션 — monorepo root",
  "engines": {
    "node": ">=20.10.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
    "web:dev": "pnpm --filter @glitzy/web dev",
    "web:build": "pnpm --filter @glitzy/web build",
    "web:seed": "pnpm --filter @glitzy/web seed",
    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
    "build:all": "pnpm pkg:build && pnpm --filter @glitzy/web build",
    "spike-a": "pnpm --filter @glitzy/spike-a",
    "spike-a:up": "pnpm --filter @glitzy/spike-a up",
    "spike-a:down": "pnpm --filter @glitzy/spike-a down",
    "spike-a:migrate": "pnpm --filter @glitzy/spike-a migrate",
    "spike-a:seed": "pnpm --filter @glitzy/spike-a seed",
    "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
    "spike-b": "pnpm --filter @glitzy/spike-b",
    "spike-b:up": "pnpm --filter @glitzy/spike-b up",
    "spike-b:down": "pnpm --filter @glitzy/spike-b down",
    "spike-b:migrate": "pnpm --filter @glitzy/spike-b migrate",
    "spike-b:seed": "pnpm --filter @glitzy/spike-b seed",
    "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
    "spike-c": "pnpm --filter @glitzy/spike-c-local",
    "spike-c:up": "pnpm --filter @glitzy/spike-c-local up",
    "spike-c:down": "pnpm --filter @glitzy/spike-c-local down",
    "spike-c:seed": "pnpm --filter @glitzy/spike-c-local seed",
    "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
    "spike-d": "pnpm --filter @glitzy/spike-d",
    "spike-d:up": "pnpm --filter @glitzy/spike-d up",
    "spike-d:down": "pnpm --filter @glitzy/spike-d down",
    "spike-d:migrate": "pnpm --filter @glitzy/spike-d migrate:dev",
    "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
    "spike-e": "pnpm --filter @glitzy/spike-e",
    "spike-e:up": "pnpm --filter @glitzy/spike-e up",
    "spike-e:down": "pnpm --filter @glitzy/spike-e down",
    "spike-e:migrate": "pnpm --filter @glitzy/spike-e migrate",
    "spike-e:seed": "pnpm --filter @glitzy/spike-e seed",
    "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
  },
  "packageManager": "pnpm@10.28.2"
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web test:scenarios -- src/lib/markdown.test.ts src/lib/json-ld/__tests__/eat-validate.test.ts' in C:\Users\assag\solution\website-exposure
2026-05-18T07:57:02.458257Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.4 seconds
Output:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run "src/lib/markdown.test.ts" "src/lib/json-ld/__tests__/eat-validate.test.ts"

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run "src/lib/markdown.test.ts" "src/lib/json-ld/__tests__/eat-validate.test.ts"`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




 exited 1 in 1430ms:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run "src/lib/markdown.test.ts" "src/lib/json-ld/__tests__/eat-validate.test.ts"

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run "src/lib/markdown.test.ts" "src/lib/json-ld/__tests__/eat-validate.test.ts"`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




codex
# EAT_CONTENT code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=1 (총 1)
- closeableAfterPatch: true
- 수렴 추세: cycle1=6 → cycle2=1

## cycle 1 patch 검증
- ECC-01: PASS — `ADD COLUMN IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, NULL guard, constraint guard, index guard 확인: `packages/core-content/migrations/C0013_article_category_fk.sql:11`, `:15-18`, `:29-37`, `:43-56`
- ECC-02: PASS — `general` rename server 차단 + field error + readOnly/banner + page prop 전달 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:55-57`, `:86-88`, `apps/web/src/components/forms/ArticleCategoryForm.tsx:51-65`, `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx:75`
- ECC-03: PASS — form `categoryId` same-tx instance-scoped 사전 resolve + `category-not-found` field 변환 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:136-145`, `:227-229`
- ECC-04: PASS — delete 대상 row `FOR UPDATE`, ref-count, FK `categoryId` field mapping → form-level “사용 중” 메시지 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:143-158`, `:202-209`
- ECC-05: PASS — plain text helper에서 image 치환이 link 치환보다 먼저 실행됨: `apps/web/src/lib/markdown.ts:155-160`
- ECC-06: PASS — `<details className="group">`, chevron `aria-hidden`, `group-open:rotate-180`, `group-open:bg-slate-50` 확인: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:77-85`

## new findings

### blocking
- 없음

### major
- 없음

### minor
- **ECC-07**: C0013 constraint 존재 guard가 테이블/스키마를 한정하지 않음
  - 위치: `packages/core-content/migrations/C0013_article_category_fk.sql:45-47`
  - 근거(plan SoT): `docs/decisions/EAT_CONTENT_PLAN.md:63`, `:180-186` — `article.category_id` same-tenant composite FK는 필수 무결성 계약.
  - 문제: `pg_constraint WHERE conname = 'article_category_fk'`만 검사하므로, 같은 DB의 다른 relation/schema에 동일 constraint명이 있으면 `article` FK 추가를 건너뛸 수 있음.
  - 권장 patch: `conrelid = 'article'::regclass`까지 포함해 guard 범위를 한정.

## acceptance 판정
- cycle 1 6건은 모두 PASS.
- 새 blocking/major 0이므로 `closeableAfterPatch=true`; ECC-07은 acceptance 전 같이 정리 권장.
- 누계 시작점 144 + cycle1 6 + cycle2 1 → 151.
- 테스트: `pnpm --filter @glitzy/web test:scenarios -- ...` 실행 시 Vitest config 로딩 중 `esbuild spawn EPERM`으로 실패. 코드 검증은 파일 리뷰 기준.
tokens used
77,969
# EAT_CONTENT code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=1 (총 1)
- closeableAfterPatch: true
- 수렴 추세: cycle1=6 → cycle2=1

## cycle 1 patch 검증
- ECC-01: PASS — `ADD COLUMN IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, NULL guard, constraint guard, index guard 확인: `packages/core-content/migrations/C0013_article_category_fk.sql:11`, `:15-18`, `:29-37`, `:43-56`
- ECC-02: PASS — `general` rename server 차단 + field error + readOnly/banner + page prop 전달 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:55-57`, `:86-88`, `apps/web/src/components/forms/ArticleCategoryForm.tsx:51-65`, `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx:75`
- ECC-03: PASS — form `categoryId` same-tx instance-scoped 사전 resolve + `category-not-found` field 변환 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:136-145`, `:227-229`
- ECC-04: PASS — delete 대상 row `FOR UPDATE`, ref-count, FK `categoryId` field mapping → form-level “사용 중” 메시지 확인: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:143-158`, `:202-209`
- ECC-05: PASS — plain text helper에서 image 치환이 link 치환보다 먼저 실행됨: `apps/web/src/lib/markdown.ts:155-160`
- ECC-06: PASS — `<details className="group">`, chevron `aria-hidden`, `group-open:rotate-180`, `group-open:bg-slate-50` 확인: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:77-85`

## new findings

### blocking
- 없음

### major
- 없음

### minor
- **ECC-07**: C0013 constraint 존재 guard가 테이블/스키마를 한정하지 않음
  - 위치: `packages/core-content/migrations/C0013_article_category_fk.sql:45-47`
  - 근거(plan SoT): `docs/decisions/EAT_CONTENT_PLAN.md:63`, `:180-186` — `article.category_id` same-tenant composite FK는 필수 무결성 계약.
  - 문제: `pg_constraint WHERE conname = 'article_category_fk'`만 검사하므로, 같은 DB의 다른 relation/schema에 동일 constraint명이 있으면 `article` FK 추가를 건너뛸 수 있음.
  - 권장 patch: `conrelid = 'article'::regclass`까지 포함해 guard 범위를 한정.

## acceptance 판정
- cycle 1 6건은 모두 PASS.
- 새 blocking/major 0이므로 `closeableAfterPatch=true`; ECC-07은 acceptance 전 같이 정리 권장.
- 누계 시작점 144 + cycle1 6 + cycle2 1 → 151.
- 테스트: `pnpm --filter @glitzy/web test:scenarios -- ...` 실행 시 Vitest config 로딩 중 `esbuild spawn EPERM`으로 실패. 코드 검증은 파일 리뷰 기준.
