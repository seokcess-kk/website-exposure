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
session id: 019e3942-025b-7081-a97b-092bddd15822
--------
user
You are reviewing **cycle 5** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.5. Cycle 4 had 1 minor finding (PSR-31 stale SoT summary 3 lines). Patched.

## Patch applied (cycle 5)
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt 위 SoT 요약 3줄 정정:
  - § 3.1: AI 크롤러 분류 4계열 — A/B/C/D 명시 (Googlebot/Yeti/Bingbot, OAI-SearchBot/PerplexityBot/Claude-SearchBot, ChatGPT-User/Perplexity-User/Claude-User, GPTBot/ClaudeBot/Google-Extended/CCBot/anthropic-ai/meta-externalagent)
  - § 3.2: `aiCrawlerPolicy` enum required — `allow | disallowTraining | disallowAll | custom` (4종)
  - § 3.3: `allow` 시 `aiCrawlerLegalApproved: true` fail-gate
- plan 헤더 v0.5 + 변경 이력 v0.5 entry 추가

## What to check (cycle 5)

1. PSR-31 정정이 SEARCH_STANDARDIZATION § 3.1 표 (line 159-162) + § 3.2 표 (line 178-183) + § 3.3 line 180 (`aiCrawlerLegalApproved: true` fail-gate) 정합
2. 변경 이력 v0.5 entry sound
3. 5 PSR-CASCADE 모두 PASS 잔존
4. **closeableAfterPatch=true** 판정 — blocking 0 + major 0 + minor 0 잔존 시
5. plan v1.0 acceptance commit 권고

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=1 → cycle5=N

## cycle 4 patch 검증
- PSR-31: PASS / FAIL / PARTIAL + 근거

## 5 PSR-CASCADE 최종 확정
- 01a · 01b · 02 · 03 · 04 · 05 각각 PASS / 외

## acceptance 판정
- closeableAfterPatch=true: yes/no
- 누계 통계: cycle 1+2+3+4+5 합산 findings <N> 건 전건 수용
- plan v1.0 acceptance commit 진행 가능|불가
```

한국어로 응답.

codex
`seo-geo` 스킬이 이 문서 검토 범위와 맞아 사용하겠습니다. 먼저 관련 지침을 짧게 확인한 뒤, 요청하신 파일과 기준 문서의 해당 라인을 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path C:\\Users\\assag\\solution\\website-exposure\\.agents\\skills\\seo-geo\\SKILL.md" in C:\Users\assag\solution\website-exposure
 succeeded in 526ms:
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
검토는 문서 판정이므로 코드 변경 없이 진행합니다. 지금은 v0.5 헤더와 변경 이력, §5.3 주변, 그리고 표준화 문서의 기준 라인을 함께 읽어 정합성만 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v0\\.5|5\\.3|robots\\.txt|SoT|PSR-CASCADE|PASS|aiCrawlerPolicy|aiCrawlerLegalApproved|AI 크롤러|변경 이력\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.1|3\\.2|3\\.3|aiCrawlerPolicy|aiCrawlerLegalApproved|Googlebot|OAI-SearchBot|PerplexityBot|Claude-SearchBot|ChatGPT-User|GPTBot|ClaudeBot|Google-Extended|anthropic-ai|meta-externalagent\" docs/decisions/SEARCH_STANDARDIZATION.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-ChildItem -Path docs\\decisions | Select-Object -ExpandProperty Name" in C:\Users\assag\solution\website-exposure
2026-05-18T04:05:03.289156Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/decisions/SEARCH_STANDARDIZATION.md: IO error for operation on docs/decisions/SEARCH_STANDARDIZATION.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 670ms:
rg: docs/decisions/SEARCH_STANDARDIZATION.md: IO error for operation on docs/decisions/SEARCH_STANDARDIZATION.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 691ms:
1:# 공개 사이트 렌더 minimal plan (v0.5·draft·2026-05-18)
3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1+2+3+4 (31 findings: 8 blocking + 16 major + 7 minor) 전건 수용 patch. 누계 수렴 추세 21 → 7 → 2 → 1. 5 PSR-CASCADE 모두 PASS (01a docs 적용 · 02·03·04 적용 · 05 pgbouncer 적용). 01b (코드 cascade) 는 별 code v1.0 cycle 분리. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
9:## SoT
13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
22:  - `apps/web/src/app/layout.tsx` (root layout · `<html><body>` SoT — site layout 은 fragment 만)
24:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
69:| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
82:├─ layout.tsx                            -- root layout (HTML/BODY SoT · 변경 없음)
105:│     ├─ robots.txt/route.ts             -- per-instance robots
107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
123:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
272:- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
278:DATA_MODEL contract 와 Drizzle 실 column 명이 다른 entity 가 있음. 공개 페이지가 어느 SoT 를 읽는지 명확화.
292:| LocationProfile | `metadata.businessHours` (CT-02 SoT) | C-21 `businessHours` | Contact 7요일 표 |
328:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
346:| Tailwind class | semantic token (DESIGN_TOKENS SoT) | CSS custom property (v0.1 신설) |
373:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
396:각 페이지 안 `export async function generateMetadata({ params })` 정의. 출력 SoT (SEARCH_STANDARDIZATION § 2 정합):
426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
433:- 응답: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod SoT 정합.
456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
459:- SEARCH_STANDARDIZATION § 3 SoT 정합:
460:  - § 3.1: AI 크롤러 분류 4계열 — **A. 일반 검색 색인** (Googlebot · Yeti · Bingbot) · **B. AI 검색 인덱싱·답변용** (OAI-SearchBot · PerplexityBot · Claude-SearchBot) · **C. User-triggered fetch** (ChatGPT-User · Perplexity-User · Claude-User) · **D. AI 학습·모델 개선용** (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai · meta-externalagent).
461:  - § 3.2: `aiCrawlerPolicy` enum **required** — `allow | disallowTraining | disallowAll | custom` (4종). 미설정 시 빌드 fail.
462:  - § 3.3: 정책별 출력 예시 + `allow` 시 `aiCrawlerLegalApproved: true` 필수 (fail-gate).
465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
468:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
530:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
531:  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
540:- **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:
551:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
556:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
558:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
561:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
567:- `og:type` 매핑 — § 5.1 PSR-SEO-03 SoT.
579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
581:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
588:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
603:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
607:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
610:| 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 출력 |
630:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
632:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
636:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
637:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
638:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
640:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
649:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
674:## 10. Cascade markers (다른 SoT 문서로 전파)
676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
681:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
682:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
683:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
686:## 변경 이력
691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
692:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
693:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
694:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 738ms:
ADMIN_UI_SKELETON_PLAN.md
INFRA_DECISIONS_DRAFT.md
LOCATION_LEGAL_PLAN.md
M0_BUILD_EXPORT_PLAN.md
M0_SCHEMA_PLAN.md
PACKAGES_STRUCTURE.md
PHASE0_WEEK1_SPIKES_DRAFT.md
PROVIDER_PASS_PLAN.md
PUBLIC_SITE_RENDER_PLAN.md

codex
기준 문서는 `docs/decisions`가 아니라 plan의 SoT 목록처럼 `docs/core/SEARCH_STANDARDIZATION.md`에 있습니다. 그 파일 기준으로 §3.1~§3.3을 다시 대조합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^### 3'"\\.|aiCrawlerPolicy|aiCrawlerLegalApproved|Googlebot|Yeti|Bingbot|OAI-SearchBot|PerplexityBot|Claude-SearchBot|ChatGPT-User|Perplexity-User|Claude-User|GPTBot|ClaudeBot|Google-Extended|CCBot|anthropic-ai|meta-externalagent\" docs/core/SEARCH_STANDARDIZATION.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-CASCADE-01|PSR-CASCADE-02|PSR-CASCADE-03|PSR-CASCADE-04|PSR-CASCADE-05|PASS|완료|적용" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/admin/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/SEARCH_STANDARDIZATION.md | ForEach-Object { $i++; if ($i -ge 145 -and $i -le 205) { '"'{0}:{1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 795ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
packages/migrations-runner/src/manifest.ts:14:  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
packages/migrations-runner/src/manifest.ts:16:  /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages/migrations-runner/src/manifest.ts:132: * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:184:Schema는 두 가지 가치를 갖는다. 솔루션은 양쪽을 의식적으로 분리해 적용한다.
docs/core/SCHEMA_MAPPING.md:346:**BreadcrumbList**: Home에는 미적용.
docs/core/SCHEMA_MAPPING.md:505:- 위험도 격상 조건이 적용된 슬롯은 schema 출력 자체에서 단정형 표현 회피
docs/core/SCHEMA_MAPPING.md:728:**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
docs/core/SCHEMA_MAPPING.md:845:| `form` | (schema 미적용 — 본문 폼) |
docs/core/SCHEMA_MAPPING.md:847:| `external` | `potentialAction` 일반 또는 schema 미적용 |
docs/core/SCHEMA_MAPPING.md:971:| SM-04 | `TrustMetric` schema 매핑 — `Statistic`·`QuantitativeValue` 적용 가능성 | 후속 검토 |
docs/core/SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
docs/core/SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:269:### 3.11 Slice 완료 게이트 (6항목)
docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
docs/admin/ARCHITECTURE.md:513:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:514:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:515:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1+2+3+4 (31 findings: 8 blocking + 16 major + 7 minor) 전건 수용 patch. 누계 수렴 추세 21 → 7 → 2 → 1. 5 PSR-CASCADE 모두 PASS (01a docs 적용 · 02·03·04 적용 · 05 pgbouncer 적용). 01b (코드 cascade) 는 별 code v1.0 cycle 분리. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:209:  3. content table SELECT (RLS USING 자동 적용)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:253:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:340:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:534:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:556:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:558:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:581:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:588:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:607:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:636:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:637:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:638:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:681:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:692:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:693:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:694:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 811ms:
21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
153:### 3.1 AI 크롤러 분류 — 4계열
159:| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
162:| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
164:> **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
171:> - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
174:### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**
176:`InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.
180:| `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
188:### 3.3 정책별 출력 예시
190:#### `aiCrawlerPolicy: disallowTraining` (권장 기본)
203:User-agent: Googlebot
206:User-agent: Yeti
209:User-agent: Bingbot
213:User-agent: OAI-SearchBot
216:User-agent: PerplexityBot
219:User-agent: Claude-SearchBot
223:User-agent: ChatGPT-User
226:User-agent: Perplexity-User
229:User-agent: Claude-User
233:User-agent: GPTBot
236:User-agent: ClaudeBot
239:User-agent: Google-Extended
242:User-agent: CCBot
245:User-agent: anthropic-ai
248:# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
255:#### `aiCrawlerPolicy: allow` (학습 포함 전체 허용 — 법무 승인 필수)
259:#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
263:### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
267:| AI 크롤러 허용/차단 | **`aiCrawlerPolicy` 정책에 따라 § 3.2 매트릭스 적용** | required, 미설정 fail |
274:### 3.4 인스턴스별 robots 오버라이드 — user-agent별 merge/replace
284:**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
287:# Core 기본 (allow 정책, PerplexityBot 블록)
288:User-agent: PerplexityBot
293:  - userAgent: PerplexityBot
299:User-agent: PerplexityBot
575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |

 succeeded in 825ms:
145:| `<meta property="article:author">` 출처 — P-006/P-008에서 `reviewedBy` 부재 | (선택) optional 미출력 | warning 아님. `reviewedBy` 있을 때만 출력 |
146:| **P-010 Article**: `Article.category` / `ArticleCategory.name` resolve 실패 (= `article:section` 누락) | **warning** | `Article.category`는 DATA_MODEL에서 required이므로 누락 가능 케이스는 ArticleCategory 참조 resolve 실패. 콘텐츠 분류 신호 약화 (콘텐츠 자체는 출력) |
147:| `noIndex: true` 페이지에서 `<meta name="robots" content="noindex, follow">` 누락 | fail | sitemap 제외와 함께 robots 메타도 출력 필수 |
148:
149:---
150:
151:## 3. robots.txt 표준
152:
153:### 3.1 AI 크롤러 분류 — 4계열
154:
155:user-agent의 목적별 분리 (공식 출처는 각 행 참조; 외부 자료 변경 가능성 — 분기 1회 재검증 권장):
156:
157:| 계열 | user-agent | 목적 | 출처 |
158:|---|---|---|---|
159:| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
162:| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
163:
164:> **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
165:> 참고 URL:
166:> - OpenAI publisher FAQ — https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
167:> - OpenAI ChatGPT search product discovery — https://openai.com/chatgpt/search-product-discovery/
168:> - Perplexity crawlers — https://docs.perplexity.ai/docs/resources/perplexity-crawlers
169:> - Anthropic crawler help — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-the-web-and-how-can-site-owners-block-the-crawler
170:> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
171:> - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
172:> - Google robots-meta (meta tag — noindex 등) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
173:
174:### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**
175:
176:`InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.
177:
178:| 정책 | A. 일반 검색 | B. AI 검색 인덱싱 | C. User-triggered fetch (best-effort) | D. AI 학습 | 법무 승인 |
179:|---|:---:|:---:|:---:|:---:|---|
180:| `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
181:| `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
182:| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
183:| `custom` | 인스턴스 정의 (§ 3.4 merge/replace) | | | | 운영자 검토 |
184:
185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
186:> **starter template**은 `disallowTraining` 제안 — 의료기관 사이트의 환자 후기·전후사진·브랜드 콘텐츠 학습 위험 회피 + 검색·답변 노출 유지.
187:
188:### 3.3 정책별 출력 예시
189:
190:#### `aiCrawlerPolicy: disallowTraining` (권장 기본)
191:
192:```
193:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
194:
195:# 일반 룰
196:User-agent: *
197:Disallow: /admin/
198:Disallow: /auth/
199:Disallow: /api/
200:Allow: /
201:
202:# A. 일반 검색 색인 — Allow
203:User-agent: Googlebot
204:Allow: /
205:

codex
# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=1 → cycle5=0

## cycle 4 patch 검증
- PSR-31: PASS
- 근거: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460) § 5.3 SoT 요약 3줄이 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:159) § 3.1 4계열, § 3.2 enum 4종, `allow`의 `aiCrawlerLegalApproved: true` fail-gate와 정합.

## 5 PSR-CASCADE 최종 확정
- 01a: PASS
- 01b: 외 — 별도 PUBLIC_SITE_RENDER code v1.0 cycle 분리로 명시되어 plan acceptance blocker 아님
- 02: PASS
- 03: PASS
- 04: PASS
- 05: PASS

## acceptance 판정
- closeableAfterPatch=true: yes
- 누계 통계: cycle 1+2+3+4+5 합산 findings 31 건 전건 수용
- plan v1.0 acceptance commit 진행 가능
tokens used
34,658
# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴 추세: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=1 → cycle5=0

## cycle 4 patch 검증
- PSR-31: PASS
- 근거: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460) § 5.3 SoT 요약 3줄이 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:159) § 3.1 4계열, § 3.2 enum 4종, `allow`의 `aiCrawlerLegalApproved: true` fail-gate와 정합.

## 5 PSR-CASCADE 최종 확정
- 01a: PASS
- 01b: 외 — 별도 PUBLIC_SITE_RENDER code v1.0 cycle 분리로 명시되어 plan acceptance blocker 아님
- 02: PASS
- 03: PASS
- 04: PASS
- 05: PASS

## acceptance 판정
- closeableAfterPatch=true: yes
- 누계 통계: cycle 1+2+3+4+5 합산 findings 31 건 전건 수용
- plan v1.0 acceptance commit 진행 가능
