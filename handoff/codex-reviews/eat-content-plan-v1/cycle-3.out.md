Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure\apps\web
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e39d4-0802-7111-8b8e-0b4e34f85dc8
--------
user
You are reviewing **cycle 3** of `docs/decisions/EAT_CONTENT_PLAN.md` v0.3. Cycle 2 had 8 findings (4 blocking + 4 major). All 8 patched by docs cascade 실 적용 (plan acceptance commit 안 docs cascade — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합).

## Cycle 2 patch summary

| # | severity | title | patch |
|---|---|---|---|
| ECP-23·27 | blocking·major | DATA_MODEL/SCHEMA_MAPPING SoT 미동기화 | DATA_MODEL § 1.1 25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 |
| ECP-24 | blocking | migration cascade 미적용 | manifest.ts orderedMigrations 16 entry (spec only · runner 실 코드는 별 cycle) |
| ECP-25 | blocking | PAGE_TYPES P-011 M0 미합류 | § 1.1 ✅ + § 6 11페이지 |
| ECP-26 | blocking | Article detail SQL JOIN 미적용 | **code v1.0 cycle 로 분리** — plan acceptance commit 외 |
| ECP-28 | major | CONTENT_STANDARDS 미동기화 | § 7.1.1.2 ContentType 예외 표 추가 |
| ECP-29 | major | RISK_LEVELS FAQ 자동 추론 cascade 불완전 | DATA_MODEL § 4 C-12 풀명세 안 명시 |
| ECP-30 | major | D0014 patterns | D0014_public_reader_eat.sql — code v1.0 cycle (실 마이그레이션 파일 작성 분리) |

추가 plan 본문 정정:
- plan v0.3 헤더 — plan acceptance commit (docs only) vs EAT_CONTENT code v1.0 cycle (실 코드) 분리 marker 명시
- ARCH § 3.11 게이트 #1 11 페이지 patch
- M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표 신규
- PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ 해소

## Re-review scope (cycle 3)

### 본 plan
- `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 (헤더 + 변경 이력)

### docs cascade (실 patch 확인)
- `docs/core/DATA_MODEL.md` § 1.1 인벤토리 · § 4 C-04/C-10/C-12/C-22/C-24/C-25
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 · § 6 페이지 합계
- `docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그
- `docs/core/CONTENT_STANDARDS.md` § 7.1.1.2 ContentType 예외 표
- `docs/admin/ARCHITECTURE.md` § 3.11 게이트 #1
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.2 EAT 4 entity 변환 표
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` § 9.3 PSR-DEFER-11/15 해소 marker
- `packages/migrations-runner/src/manifest.ts` orderedMigrations 16 entry

## What to check (cycle 3)

1. cycle 2 patch 가 SoT 와 일관
2. plan acceptance commit / code v1.0 cycle 분리 의도 정합 (ECP-26 처리)
3. validateManifest 의 dependsOn 검증 PASS (각 entry 의 dependsOn 이 이전 entries 의 creates 안 모두 존재)
4. PSR-DEFER-11/15 해소 marker — plan acceptance commit 안 함께 patch 정합
5. 새 finding (ECP-31+)
6. closeableAfterPatch=true 신호 — blocking 0 + major 0 잔존 시

## Output format

```
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8 (4+4+0) → cycle3=N

## cycle 2 patch 검증
- ECP-23 ~ ECP-30 각각 PASS / FAIL / PARTIAL + 한 줄 근거

## new findings (ECP-31+)

## cascade marker (EC-CASCADE-01~09) 점검
```

가능한 한 광범위하게 보고, SoT 파일을 line 단위로 인용. 한국어로 응답.

codex
`seo-geo` 스킬이 문서/검색 최적화 검토 범위와 겹치므로 지침을 확인한 뒤, 요청하신 파일들의 SoT 정합성과 manifest 의존성 검증을 같이 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path C:/Users/assag/solution/website-exposure/.agents/skills/seo-geo/SKILL.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Force' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 654ms:
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

 succeeded in 695ms:

    Directory: C:\Users\assag\solution\website-exposure\apps\web

[32;1mMode   [0m[32;1m              LastWriteTime[0m [32;1;3m        Length[0m[32;1m Name[0m
[32;1m----   [0m [32;1m             -------------[0m [32;1m        ------[0m [32;1m----[0m
d----        2026-05-18  오후 2:33                [44;1m.next[0m
d----        2026-05-18  오후 2:23                [44;1mnode_modules[0m
d----        2026-05-18  오후 2:53                [44;1mscripts[0m
d----        2026-05-16  오후 7:56                [44;1msrc[0m
-a---        2026-05-18  오후 2:32            549 .env
-a---        2026-05-18  오후 1:17           2257 .env.example
-a---        2026-05-16  오전 2:44             65 .gitignore
-a---        2026-05-16 오후 12:03            233 next-env.d.ts
-a---        2026-05-16  오전 2:44            580 next.config.mjs
-a---        2026-05-18  오후 2:20           1128 package.json
-a---        2026-05-16  오전 2:44            194 postcss.config.mjs
-a---        2026-05-16  오후 2:05           5032 README.md
-a---        2026-05-18  오후 1:21           2693 tailwind.config.ts
-a---        2026-05-16  오전 2:44            417 tsconfig.json
-a---        2026-05-18  오후 2:11         204302 tsconfig.tsbuildinfo
-a---        2026-05-18  오후 2:20            300 vitest.config.ts


codex
스킬 지침은 실제 SEO 감사보다 schema/content 구조 검토에 가까운 보조 맥락이라, 지금은 요청 범위의 로컬 문서와 migration manifest를 기준으로 리뷰합니다. 먼저 각 문서의 관련 섹션 위치와 현재 변경 상태를 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v0\\.3|ECP-|plan acceptance|code v1\\.0|변경 이력|EC-CASCADE|C-04|C-10|C-12|C-22|C-24|C-25|P-011|ScholarlyArticle|VideoObject|ContentType|3\\.11|PSR-DEFER-11|PSR-DEFER-15|orderedMigrations|dependsOn|creates\" ..\\..\\docs ..\\..\\packages\\migrations-runner\\src\\manifest.ts" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 643ms:
..\..\packages\migrations-runner\src\manifest.ts:8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
..\..\packages\migrations-runner\src\manifest.ts:17:  readonly creates: ReadonlyArray<string>;
..\..\packages\migrations-runner\src\manifest.ts:19:  readonly dependsOn: ReadonlyArray<string>;
..\..\packages\migrations-runner\src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
..\..\packages\migrations-runner\src\manifest.ts:24: * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
..\..\packages\migrations-runner\src\manifest.ts:27:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
..\..\packages\migrations-runner\src\manifest.ts:32:    creates: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:33:    dependsOn: [],
..\..\packages\migrations-runner\src\manifest.ts:39:    creates: ["clinic_profile"],
..\..\packages\migrations-runner\src\manifest.ts:40:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:46:    creates: ["location_profile"],
..\..\packages\migrations-runner\src\manifest.ts:47:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:53:    creates: ["doctor_profile"],
..\..\packages\migrations-runner\src\manifest.ts:54:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:60:    creates: ["treatment_page", "content_publication_status"],
..\..\packages\migrations-runner\src\manifest.ts:61:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:67:    creates: ["article", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:68:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
..\..\packages\migrations-runner\src\manifest.ts:74:    creates: ["legal_document", "legal_document_type"],
..\..\packages\migrations-runner\src\manifest.ts:75:    dependsOn: ["instance", "content_publication_status", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:81:    creates: [
..\..\packages\migrations-runner\src\manifest.ts:90:    dependsOn: ["clinic_profile"],
..\..\packages\migrations-runner\src\manifest.ts:96:    creates: [
..\..\packages\migrations-runner\src\manifest.ts:101:    dependsOn: ["clinic_profile", "location_profile"],
..\..\packages\migrations-runner\src\manifest.ts:108:    creates: [
..\..\packages\migrations-runner\src\manifest.ts:118:    dependsOn: [
..\..\packages\migrations-runner\src\manifest.ts:128:  // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
..\..\packages\migrations-runner\src\manifest.ts:132:    creates: ["article_category"],
..\..\packages\migrations-runner\src\manifest.ts:133:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:139:    creates: ["publication"],
..\..\packages\migrations-runner\src\manifest.ts:140:    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:146:    creates: ["media_appearance", "media_channel_type"],
..\..\packages\migrations-runner\src\manifest.ts:147:    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:153:    creates: ["faq"],
..\..\packages\migrations-runner\src\manifest.ts:154:    dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:157:  //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
..\..\packages\migrations-runner\src\manifest.ts:161:    creates: [
..\..\packages\migrations-runner\src\manifest.ts:166:    dependsOn: ["article", "article_category"],
..\..\packages\migrations-runner\src\manifest.ts:168:  // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
..\..\packages\migrations-runner\src\manifest.ts:172:    creates: [
..\..\packages\migrations-runner\src\manifest.ts:178:    dependsOn: [
..\..\packages\migrations-runner\src\manifest.ts:190: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
..\..\packages\migrations-runner\src\manifest.ts:196:  for (const [i, m] of orderedMigrations.entries()) {
..\..\packages\migrations-runner\src\manifest.ts:197:    for (const dep of m.dependsOn) {
..\..\packages\migrations-runner\src\manifest.ts:202:    for (const c of m.creates) seen.add(c);
..\..\docs\ARCHITECTURE.md:214:> 하위 문서 정합 동기화: `core/PAGE_TYPES.md`, `core/DATA_MODEL.md`, `admin/ARCHITECTURE.md` 기준. SoT 정리(ClinicProfile에서 위치·시간·연락 제거 → LocationProfile이 마스터), 공통 타입 3종 추가, C-21 LocationProfile·C-22 ArticleCategory 정식 등재. C-16 LegalDocument는 M0 자동 생성 대상으로 격상 (DATA_MODEL § 4 풀명세, C-10 다음 위치). CTAConfig 강조 채널은 LocationProfile.featuredChannelId(컨테이너 쪽)로 표현. **하위 문서 버전 숫자는 본 주석에서 추적하지 않는다** — 각 문서의 헤더와 변경 이력이 단일 진실 원본.
..\..\docs\ARCHITECTURE.md:223:| C-04 | `Article` | 인사이트·블로그 글 (저자·검수자·콘텐츠 형식·출처·임베디드 미디어) | L3 | Git |
..\..\docs\ARCHITECTURE.md:229:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | **DB 원본 + Git 사본 (§ 9.4)** |
..\..\docs\ARCHITECTURE.md:231:| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git |
..\..\docs\ARCHITECTURE.md:241:| **C-22** | **`ArticleCategory`** | **Article Pillar/Category 정의** | L2+L3 | Git |
..\..\docs\ARCHITECTURE.md:594:## 13. 변경 이력
..\..\docs\ARCHITECTURE.md:600:| 2026-05-13 | v0.3 | 용어 정리·Phase 통일·Feature Modules 신설·위험도 등급·어드민 분리 | Glitzy (Claude 페어링) |
..\..\docs\ARCHITECTURE.md:602:| 2026-05-14 | v0.5 | **DEEP_DIVE 통합 정합 동기화**: (1) § 2.4 **데이터 계약 인벤토리 22개 + 공통 타입 3개로 갱신** — C-21 LocationProfile·C-22 ArticleCategory 정식 등재, CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, (2) ClinicProfile 책임 재정의 — 위치·시간·연락은 LocationProfile이 마스터 (SoT 정리), (3) RiskLevel은 직접 enum 사용 (`Ref<C-05>` 표기 제거), (4) PAGE_TYPES v0.5 (필수 14 + 선택 7, M0 8+1=9페이지) 및 admin v0.4 (LocationProfile main 자동 생성 규칙) 정합 동기화. 본 문서의 어드민 화면 수 6개·Control Plane / Data Plane 위상은 그대로 유지 | Glitzy (Claude 페어링) |
..\..\docs\ARCHITECTURE.md:603:| 2026-05-14 | v0.6 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.5.1 / DATA_MODEL v0.5 / admin v0.5): (1) **P-013 Legal/Policy를 M0 출시 게이트로 격상** — M0 9 → 10페이지 (Core 표준 템플릿 + ClinicProfile 변수 자동 치환), (2) C-10 ComplianceRecord.contentType enum에 `LegalDocument` 추가, (3) `CTAConfig.isFeatured: boolean` 신규 — LocationProfile.featuredCta `Ref<CTAConfig>` 표기 위반 정정, 필드 제거, (4) 관계 다이어그램 Article.author/reviewedBy 단일 참조 표기 정정. 본 문서 § 2.4 인벤토리는 영향 없음 (LegalDocument는 이미 등재된 C-16) | Glitzy (Claude 페어링) |
..\..\docs\ARCHITECTURE.md:607:| 2026-05-14 | v0.10 | **피드백 정정 — 유지보수 단순화**: § 2.4 주석에서 하위 문서 버전 숫자 추적 제거. 매 사이클마다 상위 문서 주석을 갱신하는 부담 해소. **각 하위 문서의 헤더·변경 이력이 단일 진실 원본**이라는 원칙 명시 | Glitzy (Claude 페어링) |
..\..\docs\compliance\RISK_LEVELS.md:11:> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
..\..\docs\compliance\RISK_LEVELS.md:24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
..\..\docs\compliance\RISK_LEVELS.md:25:- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)
..\..\docs\compliance\RISK_LEVELS.md:68:  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
..\..\docs\compliance\RISK_LEVELS.md:127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
..\..\docs\compliance\RISK_LEVELS.md:232:| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:233:| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:234:| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:277:| `staleScope.kind="content-type"` + `contentTypes[]` 항목이 C-10 contentType enum 미존재 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:412:- ComplianceRecord(C-10) `physicianApprover` + `physicianApprovedAt` 기록
..\..\docs\compliance\RISK_LEVELS.md:428:- 의료법 제57조 사전심의 대상 여부 판정 — ComplianceRecord(C-10) `priorReviewRequired: boolean` 기록 필수
..\..\docs\compliance\RISK_LEVELS.md:431:- ComplianceRecord(C-10) `legalCounsel` + `legalCounselAt` 기록
..\..\docs\compliance\RISK_LEVELS.md:454:- ComplianceRecord(C-10) `peerReviewer` + `peerReviewedAt` 기록
..\..\docs\compliance\RISK_LEVELS.md:466:- ComplianceRecord(C-10) `clientApprover` + `clientApprovedAt` 기록
..\..\docs\compliance\RISK_LEVELS.md:476:- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
..\..\docs\compliance\RISK_LEVELS.md:477:- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구
..\..\docs\compliance\RISK_LEVELS.md:489:| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
..\..\docs\compliance\RISK_LEVELS.md:499:- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
..\..\docs\compliance\RISK_LEVELS.md:500:- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
..\..\docs\compliance\RISK_LEVELS.md:530:| `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |
..\..\docs\compliance\RISK_LEVELS.md:563:| Medium | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록. fail/content-gate 매칭은 룰 단위로 독립 처리 |
..\..\docs\compliance\RISK_LEVELS.md:566:- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
..\..\docs\compliance\RISK_LEVELS.md:610:- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)
..\..\docs\compliance\RISK_LEVELS.md:656:   - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
..\..\docs\compliance\RISK_LEVELS.md:708:## 10. 변경 이력
..\..\docs\compliance\RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
..\..\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
..\..\docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:12:> - 데이터 계약 — ComplianceRecord·StaleFlags → `core/DATA_MODEL.md` C-10
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:20:- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추가
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:67:> **법문 인용 원칙**: 본 문서의 조문 인용은 운영자가 빠르게 참조하는 사람 가독 SoT — 법적 정확성은 ComplianceRecord(C-10) `legalCounsel` 기록 + 국가법령정보센터 원문 조회로 보완. 인용 조문 개정 시 § 11 추적 갱신 + `rules.medical-ad.yaml` cascade.
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:98:| 11호 | 제57조에 따른 심의를 받지 아니하거나 심의받은 내용과 다른 광고 | § 3.11 / § 4 |
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:223:### 3.11 미심의 광고 (제56조제2항제11호)
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:239:- **운영**: 확정 케이스는 발행 차단(fail). 불명확 케이스만 법무 검수 — ComplianceRecord(C-10) `legalCounsel` 기록 + 판정 근거를 `attachments[]`로 첨부. `InternationalSupport`의 외국어 페이지 존재 자체가 회피 근거 아님
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:292:| **자사 웹사이트 — 의료광고 해당성·사전심의 대상 여부** | **법무 판정** — 매체 분류(시행령 제24조제1항·제2항) + 의료광고 정의(제56조제1항) 결합 판정. **운영 감사 추적**: 판정 결과를 ComplianceRecord(C-10)에 기록 — `priorReviewRequired: boolean` (산정 결과), `legalCounsel` + `legalCounselAt` (법무 판정 기록), `attachments[]` (판정 근거 의견서). 자사 사이트 일평균 이용자 측정 책임은 운영자 (MA-02) |
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:297:2. 사전심의 대상 판정 시 — ComplianceRecord(C-10) `priorReviewRequired=true`
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:371:- 해당 콘텐츠의 ComplianceRecord(C-10) — `legalCounsel` + `legalCounselAt` + `attachments[]` (법무 의견서) 필수
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:416:- 가격 정보 변경 시 — ComplianceRecord(C-10) `staleFlags.legal=true` 자동 설정 (`RISK_LEVELS.md` § 4.2)
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:602:## 13. 변경 이력
..\..\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
..\..\docs\admin\REVIEW_WORKFLOW.md:13:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
..\..\docs\admin\REVIEW_WORKFLOW.md:47:- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
..\..\docs\admin\REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
..\..\docs\admin\REVIEW_WORKFLOW.md:187:- LegalDocument 발행 의무(C-10 LegalDocument required)
..\..\docs\admin\REVIEW_WORKFLOW.md:215:finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
..\..\docs\admin\REVIEW_WORKFLOW.md:219:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
..\..\docs\admin\REVIEW_WORKFLOW.md:263:approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:
..\..\docs\admin\REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
..\..\docs\admin\REVIEW_WORKFLOW.md:274:DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
..\..\docs\admin\REVIEW_WORKFLOW.md:277:- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
..\..\docs\admin\REVIEW_WORKFLOW.md:294:| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
..\..\docs\admin\REVIEW_WORKFLOW.md:299:- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
..\..\docs\admin\REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
..\..\docs\admin\REVIEW_WORKFLOW.md:377:  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
..\..\docs\admin\REVIEW_WORKFLOW.md:403:- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
..\..\docs\admin\REVIEW_WORKFLOW.md:406:판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
..\..\docs\admin\REVIEW_WORKFLOW.md:422:  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
..\..\docs\admin\REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
..\..\docs\admin\REVIEW_WORKFLOW.md:433:   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
..\..\docs\admin\REVIEW_WORKFLOW.md:675:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
..\..\docs\admin\REVIEW_WORKFLOW.md:799:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
..\..\docs\admin\REVIEW_WORKFLOW.md:800:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
..\..\docs\admin\REVIEW_WORKFLOW.md:803:## 14. 변경 이력
..\..\docs\admin\REVIEW_WORKFLOW.md:808:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
..\..\docs\admin\REVIEW_WORKFLOW.md:810:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
..\..\docs\admin\REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
..\..\docs\admin\REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
..\..\docs\core\DATA_MODEL.md:31:### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
..\..\docs\core\DATA_MODEL.md:38:| C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
..\..\docs\core\DATA_MODEL.md:44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
..\..\docs\core\DATA_MODEL.md:46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
..\..\docs\core\DATA_MODEL.md:56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
..\..\docs\core\DATA_MODEL.md:58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
..\..\docs\core\DATA_MODEL.md:59:| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
..\..\docs\core\DATA_MODEL.md:398:| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
..\..\docs\core\DATA_MODEL.md:465:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
..\..\docs\core\DATA_MODEL.md:484:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
..\..\docs\core\DATA_MODEL.md:491:| `relatedArticles` | `Ref<C-04>[]` | optional | |
..\..\docs\core\DATA_MODEL.md:678:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
..\..\docs\core\DATA_MODEL.md:761:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
..\..\docs\core\DATA_MODEL.md:771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
..\..\docs\core\DATA_MODEL.md:772:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
..\..\docs\core\DATA_MODEL.md:877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
..\..\docs\core\DATA_MODEL.md:915:### C-22. `ArticleCategory` — Article Pillar 분류
..\..\docs\core\DATA_MODEL.md:923:| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
..\..\docs\core\DATA_MODEL.md:930:> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
..\..\docs\core\DATA_MODEL.md:932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
..\..\docs\core\DATA_MODEL.md:934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
..\..\docs\core\DATA_MODEL.md:959:- Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
..\..\docs\core\DATA_MODEL.md:961:### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
..\..\docs\core\DATA_MODEL.md:963:> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
..\..\docs\core\DATA_MODEL.md:971:| `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
..\..\docs\core\DATA_MODEL.md:987:- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
..\..\docs\core\DATA_MODEL.md:996:### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
..\..\docs\core\DATA_MODEL.md:1007:| `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
..\..\docs\core\DATA_MODEL.md:1014:**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
..\..\docs\core\DATA_MODEL.md:1112:Article (C-04)
..\..\docs\core\DATA_MODEL.md:1116:   ├─ category → ArticleCategory (C-22)
..\..\docs\core\DATA_MODEL.md:1121:ComplianceRecord (C-10)
..\..\docs\core\DATA_MODEL.md:1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
..\..\docs\core\DATA_MODEL.md:1146:| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
..\..\docs\core\DATA_MODEL.md:1160:## 9. 변경 이력
..\..\docs\core\DATA_MODEL.md:1165:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
..\..\docs\core\DATA_MODEL.md:1166:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
..\..\docs\core\DATA_MODEL.md:1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
..\..\docs\core\DATA_MODEL.md:1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
..\..\docs\core\DATA_MODEL.md:1171:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
..\..\docs\core\DATA_MODEL.md:1172:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
..\..\docs\core\DATA_MODEL.md:1185:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
..\..\docs\core\DATA_MODEL.md:1186:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
..\..\docs\core\DESIGN_TOKENS.md:504:### 8.8 accordion·FAQ (P-011·Q&A 블록)
..\..\docs\core\DESIGN_TOKENS.md:939:| ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |
..\..\docs\core\DESIGN_TOKENS.md:943:## 14. 변경 이력
..\..\docs\core\DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
..\..\docs\core\CONTENT_STANDARDS.md:76:| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
..\..\docs\core\CONTENT_STANDARDS.md:102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
..\..\docs\core\CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
..\..\docs\core\CONTENT_STANDARDS.md:208:  - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
..\..\docs\core\CONTENT_STANDARDS.md:215:### 3.6 임베디드 미디어 (VideoObject 등)
..\..\docs\core\CONTENT_STANDARDS.md:218:- `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
..\..\docs\core\CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
..\..\docs\core\CONTENT_STANDARDS.md:265:| 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
..\..\docs\core\CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
..\..\docs\core\CONTENT_STANDARDS.md:311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
..\..\docs\core\CONTENT_STANDARDS.md:336:`Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:
..\..\docs\core\CONTENT_STANDARDS.md:366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
..\..\docs\core\CONTENT_STANDARDS.md:367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
..\..\docs\core\CONTENT_STANDARDS.md:372:    articleType?: ArticleType;        // DATA_MODEL C-04
..\..\docs\core\CONTENT_STANDARDS.md:381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
..\..\docs\core\CONTENT_STANDARDS.md:382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
..\..\docs\core\CONTENT_STANDARDS.md:385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
..\..\docs\core\CONTENT_STANDARDS.md:387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
..\..\docs\core\CONTENT_STANDARDS.md:390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
..\..\docs\core\CONTENT_STANDARDS.md:394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
..\..\docs\core\CONTENT_STANDARDS.md:396:| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
..\..\docs\core\CONTENT_STANDARDS.md:397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
..\..\docs\core\CONTENT_STANDARDS.md:401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
..\..\docs\core\CONTENT_STANDARDS.md:416:#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
..\..\docs\core\CONTENT_STANDARDS.md:418:EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
..\..\docs\core\CONTENT_STANDARDS.md:420:| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
..\..\docs\core\CONTENT_STANDARDS.md:426:| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
..\..\docs\core\CONTENT_STANDARDS.md:461:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
..\..\docs\core\CONTENT_STANDARDS.md:477:  // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
..\..\docs\core\CONTENT_STANDARDS.md:504://   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
..\..\docs\core\CONTENT_STANDARDS.md:528:| 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |
..\..\docs\core\CONTENT_STANDARDS.md:587:  | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
..\..\docs\core\CONTENT_STANDARDS.md:589:  | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
..\..\docs\core\CONTENT_STANDARDS.md:590:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
..\..\docs\core\CONTENT_STANDARDS.md:658:| ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
..\..\docs\core\CONTENT_STANDARDS.md:659:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
..\..\docs\core\CONTENT_STANDARDS.md:664:## 10. 변경 이력
..\..\docs\core\CONTENT_STANDARDS.md:669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
..\..\docs\core\CONTENT_STANDARDS.md:673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
..\..\docs\core\CONTENT_STANDARDS.md:674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
..\..\docs\core\CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
..\..\docs\core\CONTENT_STANDARDS.md:676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:246:| `ArticleCategory` (C-22) | **수용** — DM-09 해소 |
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:261:### 5.2 PAGE_TYPES.md v0.3 (별도 갱신)
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:271:- C-04 Article contentFormat·embeddedMedia 추가
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:273:- C-22 ArticleCategory 신설 (DM-09 해소)
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:322:## 8. 변경 이력
..\..\docs\research\REFERENCE_ANALYSIS_2026-05.md:327:| 2026-05-13 | v0.2 | **주요 갱신** — (1) R-B2 서울아산병원·R-C1 Cleveland Clinic 추가 분석, (2) Mayo·Hopkins 봇 차단 사실 명시, (3) § 3 패턴 비교 매트릭스 6개로 확장, (4) **위험도 표현 절제 = 권위 신호** 핵심 발견, (5) 1호 클라이언트 차별화 전략 명료화 (옵션 B 권장), (6) 갱신 권장의 자체 비판 검토 결과 차등 반영 (수용·절충·보류·반박), (7) Location/Branch Detail = 선택 P-106, Self-test = 보류, Founder Story = About 흡수, (8) C-21 LocationProfile·C-22 ArticleCategory 정식 정의 결정, (9) competitive-audit 모듈 반박 (사람 활동, 모듈화 과함) | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:142:| `Article` (C-04) | 제목·요약·본문·저자·발행일·카테고리·`articleType` | | Article 작성 화면 |
..\..\docs\admin\ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
..\..\docs\admin\ARCHITECTURE.md:256:- `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)
..\..\docs\admin\ARCHITECTURE.md:269:### 3.11 Slice 완료 게이트 (6항목)
..\..\docs\admin\ARCHITECTURE.md:273:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
..\..\docs\admin\ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
..\..\docs\admin\ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
..\..\docs\admin\ARCHITECTURE.md:507:## 11. 변경 이력
..\..\docs\admin\ARCHITECTURE.md:511:| 2026-05-13 | v0.1 | 최초 작성 (ARCHITECTURE.md v0.3에서 분리) | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:513:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:514:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:515:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:516:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
..\..\docs\core\PAGE_TYPES.md:23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
..\..\docs\core\PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
..\..\docs\core\PAGE_TYPES.md:333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
..\..\docs\core\PAGE_TYPES.md:371:### P-011. FAQ
..\..\docs\core\PAGE_TYPES.md:431:- 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
..\..\docs\core\PAGE_TYPES.md:613:| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
..\..\docs\core\PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
..\..\docs\core\PAGE_TYPES.md:627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
..\..\docs\core\PAGE_TYPES.md:646:2. P-011 FAQ
..\..\docs\core\PAGE_TYPES.md:673:| PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
..\..\docs\core\PAGE_TYPES.md:680:## 9. 변경 이력
..\..\docs\core\PAGE_TYPES.md:686:| 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
..\..\docs\core\SCHEMA_MAPPING.md:125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
..\..\docs\core\SCHEMA_MAPPING.md:148:| `Article` | P-010 Article Detail | Article (C-04) |
..\..\docs\core\SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
..\..\docs\core\SCHEMA_MAPPING.md:154:| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
..\..\docs\core\SCHEMA_MAPPING.md:155:| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
..\..\docs\core\SCHEMA_MAPPING.md:191:- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
..\..\docs\core\SCHEMA_MAPPING.md:227:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
..\..\docs\core\SCHEMA_MAPPING.md:229:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
..\..\docs\core\SCHEMA_MAPPING.md:258:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
..\..\docs\core\SCHEMA_MAPPING.md:616:9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:642:**VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
..\..\docs\core\SCHEMA_MAPPING.md:646:  "@type": "VideoObject",
..\..\docs\core\SCHEMA_MAPPING.md:659:**필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
..\..\docs\core\SCHEMA_MAPPING.md:665:### P-011. FAQ
..\..\docs\core\SCHEMA_MAPPING.md:788:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
..\..\docs\core\SCHEMA_MAPPING.md:794:| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
..\..\docs\core\SCHEMA_MAPPING.md:796:| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
..\..\docs\core\SCHEMA_MAPPING.md:806:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
..\..\docs\core\SCHEMA_MAPPING.md:887:| P-011 FAQ | `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:920:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:939:| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
..\..\docs\core\SCHEMA_MAPPING.md:973:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
..\..\docs\core\SCHEMA_MAPPING.md:975:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
..\..\docs\core\SCHEMA_MAPPING.md:980:## 10. 변경 이력
..\..\docs\core\SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
..\..\docs\core\SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
..\..\docs\core\SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
..\..\docs\core\SEARCH_STANDARDIZATION.md:117:| P-011 FAQ | `website` |
..\..\docs\core\SEARCH_STANDARDIZATION.md:359:| P-011 FAQ | monthly | 0.5 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:418:| 페이지 타입별 대표 URL 1개 (P-001·P-002·P-003·P-004·P-005·P-006·P-007·P-008·P-009·P-010·P-011·P-012·P-013·P-014) | 매 빌드 | 14개 — Core 페이지 타입 카탈로그 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:561:### 9.1 해소된 미결정 (변경 이력 참조)
..\..\docs\core\SEARCH_STANDARDIZATION.md:570:## 10. 변경 이력
..\..\docs\core\SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
..\..\docs\core\SEARCH_STANDARDIZATION.md:579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:583:| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
..\..\docs\research\REFERENCE_DEEP_DIVE_2026-05.md:314:## 8. 변경 이력
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:13:> **A-03 결정의 scope (ADMIN-UI-67)**: A-03 close (= packages/auth 자체 핸들러) 는 **skeleton-local 결정**. 상위 SoT (`INFRA_DECISIONS_DRAFT.md` § 1.3·§ 4.1 · `PHASE0_WEEK1_SPIKES_DRAFT.md` Spike E) 가 여전히 next-auth/Auth.js 를 권위 있는 전제로 둔다. 두 문서의 reversal cascade 는 본 plan acceptance 후 별도 사이클로 진행 (acceptance precondition 아닌 follow-up cascade).
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:64:| ClinicProfile editable slug + instance 당 1개 보장 unique index | M0 v1.0 + core-content schema v0.3 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:167:       (packages/auth.issueMagicLink 내부에 emit 없음 — packages/auth v0.3 cascade)
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:256:| **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:316:`packages/auth.withResolvedTenantTransaction` 자체에 `SET LOCAL ROLE app_tenant_user` 가 없음 (ADMIN-UI-04) → packages/auth v0.3 cascade marker (resolve + withTenantTransaction 합성 패치). skeleton 은 자체 wrapper 로 우회.
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:323:> - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:342:| `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:361:대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:416:| `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:521:RESEND_MODE=mock                                # 허용값 (skeleton): mock | suppress-mock 만 (ADMIN-UI-73). real delivery (resend / sendgrid 등) 는 packages/auth v0.3 mail adapter 도입 후 (M0 v1.0 또는 M2). skeleton 부팅 시 env validation 에서 `mock | suppress-mock` 외 값이면 즉시 throw.
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:630:> **Precondition (cycle6 정정 ADMIN-UI-92)**: 게이트 #1·#2 의 `typecheck:all` / `build:all` script 는 루트 `package.json` 에 현재 미존재. **plan acceptance 가 아닌 구현 진입 precondition** — plan v1.0 acceptance 후 코드 작성 단계의 첫 작업으로 루트 script 추가.
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:668:| 루트 `package.json` `web:dev` · `web:build` · `web:seed` · `typecheck:all` · `build:all` script 추가 (ADMIN-UI-40·41·72) — **scope 정의**: `pkg:*` 는 packages only, `typecheck:all` = `pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck`, `build:all` = `pnpm pkg:build && pnpm --filter @glitzy/web build` | patch | **구현 진입 precondition (cycle6 정정 ADMIN-UI-92)** — plan v1.0 acceptance 와는 분리. plan acceptance 후 코드 작성 단계의 첫 작업으로 진입. |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:669:| `docs/admin/ARCHITECTURE.md` § 10 미결정 A-01·A-02·A-03 close (cycle8 정정 ADMIN-UI-98) — A-01·A-02·A-03 의 plan 결정 (Next.js 14·PostgreSQL·packages/auth 자체 핸들러) 은 본 plan 안에서만 확정 · admin/ARCHITECTURE v0.8 patch 는 plan acceptance 후 follow-up cascade | v0.8 patch | **follow-up (acceptance non-blocking)** |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:679:| `packages/auth` v0.3 — `withResolvedTenantTransaction` 에 `withTenantTransaction` 합성 (ADMIN-UI-04) — skeleton 은 자체 `withSkeletonTx` 로 우회 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:680:| `packages/auth` v0.3 — `issueMagicLink`/`consumeMagicLink`/`createSession`/`revokeSession` 내부 audit emit (ADMIN-UI-07) — skeleton 은 명시 emit |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:681:| `packages/auth` v0.3 — `consumeMagicLink` 가 identifier 반환 유지 + 별도 allowlist lookup helper 검토 (cycle8 정정 ADMIN-UI-101 — cycle7 self-provision 제거 정합 · upsert 표현 제거) — skeleton 은 consume route 에서 admin_user **lookup-only** 수행 (allowlist 미존재 → reject) |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:682:| `packages/auth` v0.3 — `resolveTenantContext` 반환에 `sessionRefreshed` 플래그 (ADMIN-UI-03·38) — skeleton 은 sliding refresh 미적용 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:683:| `packages/auth` v0.3 — inactive membership 분기 추가 (ADMIN-UI-35) — skeleton mapping 은 unreachable 표시 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:686:| `packages/core-content` v0.3 — logoUrl/ogImageUrl URL/length CHECK · ClinicProfile instance 당 1개 partial unique (ADMIN-UI-09·10) — skeleton 은 zod-only + fixed slug |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:694:## 14. 변경 이력 (최신순 · cycle5 ADMIN-UI-86 명시)
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:698:| 2026-05-15 | **v1.0** | **codex 11차 비평 후 `ready_for_acceptance=true` 확정**. cycle11 finding 0건. **11 cycle 누계 107 findings 전건 수용** (24→20→18→12→12→6→4→6→3→2→0). 핵심 결정: A-01·A-02·A-03 skeleton-local close · packages/auth 자체 magic-link + HMAC session · withSkeletonTx 2단계 (resolveTenantContext + withTenantTransaction) · audit dual-table (audit_event = control-plane / audit_log = service-role 자동) · allowlist-only consume (self-provision 차단) · session 발급 전 first active operator membership 검증 · cookie fixed window + DB session sliding window asymmetric refresh · WEB/SEED DATABASE_URL 권한 분리 (BYPASSRLS/owner 금지) · § 8.1 RLS 시나리오 13개. SoT cascade follow-up (acceptance non-blocking): admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 v0.8 + PACKAGES_STRUCTURE.md v0.2 + packages/auth v0.3 (audit emit · sessionRefreshed · admin_user upsert helper). 구현 진입 precondition: 루트 package.json web:* / typecheck:all / build:all script. |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:699:| 2026-05-15 | v0.11 | **cycle10 patch (2 findings · major 1 · minor 1 · nit 0 전건 처리)**: (1) ADMIN-UI-106 WEB_DATABASE_URL `GRANT SELECT, INSERT, DELETE ON session` → `GRANT SELECT, INSERT, UPDATE, DELETE ON "session"` 로 정정 (sliding refresh 시 lastRefreshedAt·expires UPDATE 필요 · packages/auth/src/internal/session-internal.ts 정합), (2) ADMIN-UI-107 두 번째 SEED_DATABASE_URL 중복 블록 실 본문 삭제 (cycle9 변경 이력만 기록·본문 잔존이었음) |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:702:| 2026-05-15 | v0.8 | **cycle7 patch (4 findings · major 2 · minor 2 · nit 0 전건 처리)**: (1) ADMIN-UI-93 § 1.2 표 `/sign-in/consume` 책임을 `admin_user lookup/active check (allowlist 만 — 자동 INSERT 없음)` 로 정정 + cycle4 핵심 결정 문구의 `admin_user upsert` 가 seed 단계 한정임을 명시 (consume route 는 lookup-only), (2) ADMIN-UI-94 DATABASE_URL 을 WEB_DATABASE_URL (control-plane SELECT/INSERT + app_tenant_user role grant) + SEED_DATABASE_URL (M0 v1.0 service-role 작업 시점에 postgres role 추가) 로 분리 — 웹 런타임 과권한 제거, (3) ADMIN-UI-95·96 cascade — PACKAGES_STRUCTURE.md v0.2 + admin/ARCHITECTURE.md § 10 A-01·A-02·A-03 close 는 plan acceptance 와 분리된 follow-up cascade |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:704:| 2026-05-15 | v0.6 | **cycle5 patch (12 findings · major 6 · minor 5 · nit 1 전건 처리)**: (1) ADMIN-UI-75 self-provision 방지 — magic-link 발급 전 allowlist 체크 + consume route 자동 admin_user INSERT 제거. user-not-allowlisted-on-consume · magic-link-issue-denied audit_event 신규, (2) ADMIN-UI-76·84 session 발급 전 first active operator membership 검증 → 실패 시 session/cookie 미발급 + first-active-membership-missing audit, (3) ADMIN-UI-77·81 § 3.2 slugResolver 호출 시그니처를 § 5.2 와 통일 (sqlBase, slug, actorUserId) · service-role 잔재 표현 정리, (4) ADMIN-UI-78 게이트 #7 audit_event 만 필수 + audit_log 0건 허용, (5) ADMIN-UI-79 seed instance_membership upsert 를 CTE 로 변경 (partial unique index predicate 정합), (6) ADMIN-UI-80 emitAuditEvent payload 필드명 camelCase (targetUserId), (7) ADMIN-UI-82 verification_token → "verificationToken" (Auth.js compatible quoted), (8) ADMIN-UI-83 DB session refresh column 표기 lastRefreshedAt + expires 명시, (9) ADMIN-UI-85 DATABASE_URL = migration/admin owner 또는 BYPASSRLS 명시, (10) ADMIN-UI-86 변경 이력 최신순 명시 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:706:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
..\..\docs\decisions\ADMIN_UI_SKELETON_PLAN.md:707:| 2026-05-15 | v0.3 | **cycle2 patch (20 findings · major 15 · minor 4 · nit 1 전건 처리)**: (1) ADMIN-UI-25 audit_event 컬럼 `occurred_at` 으로 정정, (2) ADMIN-UI-26·36 audit_event 단일 SoT 포기 — audit_event(packages/auth.emitAuditEvent · base role · tx 밖) + audit_log(withServiceRole 자동) 분리 검증. content-saved 는 tx commit 후 base-role emit, (3) ADMIN-UI-27 ServiceRoleFunction enum 선행 patch precondition 으로 승격 (slugResolver · firstActiveMembershipResolver · adminUserUpsert), (4) ADMIN-UI-28 withServiceRole 실 시그니처 `(sql, ctx, allowedFunctions, fn)` 반영, (5) ADMIN-UI-29 seed 는 withServiceRole 미사용 · 고정 system actor UUID + audit_log direct INSERT, (6) ADMIN-UI-30 withSkeletonTx 에서 `asUuidV4(ctx.instanceId) as InstanceId` 변환 명시, (7) ADMIN-UI-31 saveClinicProfile bound action 패턴 — page 에서 instanceSlug 첫 인자 bound, (8) ADMIN-UI-32 /sign-in/consume route 에서 admin_user lookup/upsert + active check 후 createSession, (9) ADMIN-UI-33 post-login redirect 는 service-role firstActiveMembershipResolver 로 instance.slug join 조회 · membership 없음 → `?reason=no-active-membership` UI, (10) ADMIN-UI-34 § 5.4 mapping 실제 `AuthDenyReason` 17 reasons 기준 재작성 — magic-link-* 4종 추가 · session-malformed/super-admin-selected-mismatch 제거, (11) ADMIN-UI-35 membership-inactive unreachable 마커 + packages/auth v0.3 cascade, (12) ADMIN-UI-37·38 sliding refresh 미적용 정책으로 단순화 · syncSessionCookie helper 제거 · packages/auth v0.3 sessionRefreshed 반환 후 합류, (13) ADMIN-UI-39 next.config.mjs `serverActions.bodySizeLimit` 명시 + 게이트 #10, (14) ADMIN-UI-40·41 루트 script 추가를 acceptance precondition 으로 승격, (15) ADMIN-UI-42 optional 필드 max length + empty-string→null normalize 표 추가, (16) ADMIN-UI-43 cookie HMAC tampering 시나리오 13번 추가, (17) ADMIN-UI-44 package version vs plan version 표기 분리 |
..\..\docs\features\analytics-reporting.md:11:> - ComplianceRecord 측정 슬롯 SoT → `core/DATA_MODEL.md` C-10 `mediaThresholdAssessment`
..\..\docs\features\analytics-reporting.md:57:- ComplianceRecord MediaThresholdAssessment 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10
..\..\docs\features\analytics-reporting.md:118:| `core/DATA_MODEL.md` C-10 | ComplianceRecord `mediaThresholdAssessment` 슬롯 |
..\..\docs\features\analytics-reporting.md:720:DATA_MODEL C-10 `MediaThresholdAssessment` 필드별 매핑:
..\..\docs\features\analytics-reporting.md:736:> - rolling snapshot은 워크플로가 새 pre-publish ComplianceRecord의 **`mediaThresholdOperationalInput` 슬롯** (DATA_MODEL C-10 v0.15)에 저장 — legal 판정 입력 자료. **`mediaThresholdAssessment` 슬롯에는 저장 금지** (calendarPolicy 혼선 방지)
..\..\docs\features\analytics-reporting.md:737:> - 법정 calendar 산정값은 legal 검수자가 다음 위치에 분산 입력 (AR5-07 정합 — DATA_MODEL C-10 정확한 필드 위치):
..\..\docs\features\analytics-reporting.md:838:- published record는 staleFlags 갱신만 가능 (DATA_MODEL C-10 SoT)
..\..\docs\features\analytics-reporting.md:946:## 13. 변경 이력
..\..\docs\features\analytics-reporting.md:952:| 2026-05-14 | v0.3 | codex 2차 (24 지적 전건 수용)
..\..\docs\features\analytics-reporting.md:955:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:1:# E-A-T Content 확장 plan (v0.3·draft·2026-05-18)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:3:> **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:5:> **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:6:> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:7:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:13:| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:14:| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:15:| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:16:| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:18:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:20:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:24:- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:25:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:26:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:27:- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
..\..\docs\decisions\EAT_CONTENT_PLAN.md:28:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:30:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:31:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:33:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:34:- `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:35:- `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:37:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:48:- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:51:- **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:53:### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:57:| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:58:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:59:| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:60:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:61:| C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:62:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:64:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:66:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:67:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:68:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:70:| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:71:| Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:72:| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:73:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:74:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:75:| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:78:| DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:79:| authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:95:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:100:### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:102:DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
..\..\docs\decisions\EAT_CONTENT_PLAN.md:113:  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:123:  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
..\..\docs\decisions\EAT_CONTENT_PLAN.md:146:- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:147:- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:150:### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:189:- (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:191:### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:201:  authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:247:- (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:250:### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:305:- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:307:### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:320:  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:333:  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
..\..\docs\decisions\EAT_CONTENT_PLAN.md:362:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:363:- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:365:### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:368:-- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:410:## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:412:DATA_MODEL § 4 C-10 `contentType` enum 확장:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:419:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:420:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:433:### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:449:- **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:462:## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:464:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
..\..\docs\decisions\EAT_CONTENT_PLAN.md:467:- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:469:- **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
..\..\docs\decisions\EAT_CONTENT_PLAN.md:470:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:474:### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:480:**JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:481:- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:488:### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:494:**JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:500:### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:516:### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:525:### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:527:- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:532:### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:536:## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:538:### 6.1 ScholarlyArticle entity (Publication)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:542:  "@type": "ScholarlyArticle",
..\..\docs\decisions\EAT_CONTENT_PLAN.md:559:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:563:  "@type": "VideoObject",
..\..\docs\decisions\EAT_CONTENT_PLAN.md:575:**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:577:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:600:| 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:602:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:603:| P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:604:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:607:- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:608:- (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:609:- (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:611:## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:613:`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
..\..\docs\decisions\EAT_CONTENT_PLAN.md:615:| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:630:- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:635:- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:637:- `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:640:  - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:646:| 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:647:| 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:648:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:650:| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:653:| 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:654:| 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:657:| 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:664:| 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:665:| 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:667:| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:668:| 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:669:| 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:671:| 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:676:| 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:677:| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:678:| 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:679:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:682:| 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:683:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:685:| 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:686:| 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:687:| 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:689:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:704:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:709:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:713:- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:714:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:715:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:716:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:717:  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:718:  - § 4 C-24 Publication 풀명세 신규.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:719:  - § 4 C-25 MediaAppearance 풀명세 신규.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:720:  - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:721:- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:722:  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:723:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:724:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:725:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:726:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:727:- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:728:- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:729:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:730:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:731:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:733:## 변경 이력
..\..\docs\decisions\EAT_CONTENT_PLAN.md:738:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:739:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:436:## 종합 결정 요약 (v0.3)
..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:463:## 변경 이력
..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:469:| 2026-05-15 | v0.3 | codex 2차 15 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade |
..\..\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
..\..\docs\features\asset-ingestion.md:47:- Core 데이터 계약 SoT는 DATA_MODEL C-01~C-22
..\..\docs\features\asset-ingestion.md:87:| DATA_MODEL C-01~C-22 | promote 대상 Core 데이터 계약 |
..\..\docs\features\asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
..\..\docs\features\asset-ingestion.md:112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
..\..\docs\features\asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
..\..\docs\features\asset-ingestion.md:156:- `allowedContentTypes` (post·comment·story·reel 등) 검증 — 외 type item도 skip
..\..\docs\features\asset-ingestion.md:174:  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
..\..\docs\features\asset-ingestion.md:225:v0.2 최종 결정: **AssetReviewRecord.rightsReview** embedded 객체 (별도 테이블 미신설). 단 변경 이력은 `rightsReview.history[]` append-only 배열 보존 (AI2-04).
..\..\docs\features\asset-ingestion.md:236:  targetContentType: TargetContentType;
..\..\docs\features\asset-ingestion.md:240:type TargetContentType = "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ" | "NewsItem";
..\..\docs\features\asset-ingestion.md:251:// Article은 DATA_MODEL C-04 v0.4 정합 (AI4-06 — 잔재 제거. closed union 전개)
..\..\docs\features\asset-ingestion.md:253:  // required (C-04 SoT)
..\..\docs\features\asset-ingestion.md:260:  category: Ref<C-22>;
..\..\docs\features\asset-ingestion.md:262:  // optional (C-04 v0.4 컨텍스트 필드)
..\..\docs\features\asset-ingestion.md:449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
..\..\docs\features\asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
..\..\docs\features\asset-ingestion.md:520:- **`promoteAsset` targetContentType이 v1.0 unsupported** (AI3-09 — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 외) → fail + AssetTag `manualProcessingRequired=true` 마킹 (asset 상태는 approved 유지. 어드민 UI manual Core editor 경로. manual 생성 Core row는 `provenanceAssetId` 필드 보존)
..\..\docs\features\asset-ingestion.md:529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
..\..\docs\features\asset-ingestion.md:533:**v0.2 → v0.3 blob key format migration**:
..\..\docs\features\asset-ingestion.md:535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
..\..\docs\features\asset-ingestion.md:537:  - **lazy rewrite** (기본): 신규 asset만 v0.3 format 사용. 기존 v0.2 blob은 그대로 두고 `IngestedAsset.blobKeyVersion` 필드(`"v0.2" | "v0.3"`)로 분기 — signed URL 발급 시 version별 path 사용
..\..\docs\features\asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
..\..\docs\features\asset-ingestion.md:550:      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
..\..\docs\features\asset-ingestion.md:589:## 15. 변경 이력
..\..\docs\features\asset-ingestion.md:595:| 2026-05-14 | v0.3 | codex 2차 (14 지적 전건 수용)
..\..\docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
..\..\docs\features\asset-ingestion.md:617:| `blobKeyVersion` | enum (`v0.2`·`v0.3`) | ✅ | (AI4-08) 신규 row default `v0.3`. v0.2 row는 lazy rewrite (§ 13.3). signed URL 발급 worker가 version별 path 분기 |
..\..\docs\features\asset-ingestion.md:680:  history: Array<{                        // AI2-04 — append-only 변경 이력
..\..\docs\features\asset-ingestion.md:713:| `targetContentType` | enum (Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem) | ✅ | v1.0 closed union 5종 |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:10:- `docs/core/DATA_MODEL.md` v0.9 — Git 출력 계약 (C-01·C-02·C-03·C-04·C-16·C-21)
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:67:### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:73:| `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:74:| `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:75:| `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:76:| `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:77:| Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:78:| `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:80:PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:88:## 변경 이력
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:264:-- 본 plan v0.3 의 invariant 보장 = server action 의 단일 tx 안 atomic upsert + assertHasMainLocationAfterTx.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:301:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:303:- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:367:- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:406:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:590:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:598:## 변경 이력
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
..\..\docs\decisions\M0_SCHEMA_PLAN.md:21:| 6 | C-22 | ArticleCategory | core-content | P0 |
..\..\docs\decisions\M0_SCHEMA_PLAN.md:23:| 8 | C-04 | Article | core-content | P0 |
..\..\docs\decisions\M0_SCHEMA_PLAN.md:24:| 9 | C-10 | ComplianceRecord | core-content | P0 |
..\..\docs\decisions\M0_SCHEMA_PLAN.md:30:| 15 | — | **Notification P0 subset** (INFRA v1.0 정정): Receipt·Log·PayloadRecord·DeliveryAttempt tables. **NotificationEvent는 DB table 아님 — notify() input envelope** | notifications-outbox v0.3+ | P0 (확장·v0.2~) |
..\..\docs\decisions\M0_SCHEMA_PLAN.md:111:- v0.3: Notification P0 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) + REVIEW_WORKFLOW state machine integration
..\..\docs\decisions\M0_SCHEMA_PLAN.md:117:codex 비평 cycle 1·2에서 deferred·M0 v0.3 acceptance scope 외 항목·각 항 별도 cycle 또는 milestone에서 close:
..\..\docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
..\..\docs\features\compliance-assistant.md:14:> - 데이터 계약 ComplianceRecord → `core/DATA_MODEL.md` C-10
..\..\docs\features\compliance-assistant.md:82:| `DATA_MODEL.md` C-10 | ComplianceRecord 결과 기록 |
..\..\docs\features\compliance-assistant.md:112:  contentType: ContentType;
..\..\docs\features\compliance-assistant.md:113:  featureContentType?: FeatureContentTypeId;
..\..\docs\features\compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
..\..\docs\features\compliance-assistant.md:368:- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
..\..\docs\features\compliance-assistant.md:433:  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
..\..\docs\features\compliance-assistant.md:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
..\..\docs\features\compliance-assistant.md:598:| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
..\..\docs\features\compliance-assistant.md:603:## 13. 변경 이력
..\..\docs\features\compliance-assistant.md:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
..\..\docs\features\content-migration.md:997:## 11. 변경 이력
..\..\docs\features\content-migration.md:1003:| 2026-05-15 | v0.3 | codex 2차 23 지적 |
..\..\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:30:Buffer: Week 2 Day 11~14는 본 작업 (Phase 0 § 4.2 v0.3 일정).
..\..\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:461:## 변경 이력
..\..\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:467:| 2026-05-15 | v0.3 | codex 2차 비평 7 지적 전건 수용 |
..\..\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:469:| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
..\..\docs\features\crm-sync.md:716:#### 4.5.1 CrmCredentialVersion entity — § 13.11
..\..\docs\features\crm-sync.md:755:**DB partial unique 강제** (§ 13.11):
..\..\docs\features\crm-sync.md:1281:## 12. 변경 이력
..\..\docs\features\crm-sync.md:1287:| 2026-05-14 | v0.3 | codex 2차 17 지적 반영 |
..\..\docs\features\crm-sync.md:1310:| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
..\..\docs\features\crm-sync.md:1555:### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)
..\..\docs\features\crm-sync.md:1691:| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
..\..\docs\features\keyword-monitoring.md:493:본 Feature는 v0.1 초안과 v0.2/v0.3 정규화 사이 데이터 모델 변경이 있음 — v1.0 이전 운영 데이터가 있는 인스턴스는 다음 migration 적용:
..\..\docs\features\keyword-monitoring.md:509:       toVersion: "v0.3",
..\..\docs\features\keyword-monitoring.md:529:신규 인스턴스(v0.3 이후 만들어진 인스턴스)는 본 migration 불필요.
..\..\docs\features\keyword-monitoring.md:705:## 14. 변경 이력
..\..\docs\features\keyword-monitoring.md:711:| 2026-05-14 | v0.3 | codex 2차 (9 지적 전건 수용)
..\..\docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:19:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:21:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:28:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:78:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:119:- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:256:- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:257:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:306:| **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:307:| Article | `summary` | C-04 `summary` | Card · meta description |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:308:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:309:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:310:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:311:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:454:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:665:### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667:- `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:668:- `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:690:## 변경 이력
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
..\..\docs\features\notifications.md:713:| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
..\..\docs\features\notifications.md:715:| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
..\..\docs\features\notifications.md:717:| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
..\..\docs\features\notifications.md:718:| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
..\..\docs\features\notifications.md:724:## 13. 변경 이력
..\..\docs\features\notifications.md:730:| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
..\..\docs\features\search-visibility.md:561:| SV-06b | artifact blob storage IAM policy 예시·운영 role 구체화 (provider=s3는 v0.3 결정) | 인프라 결정 (SV3-10 분리) |
..\..\docs\features\search-visibility.md:573:| ~~SV-10~~ | backlink provider 변경 baseline reset | v0.3 — `providerSeriesSeparated=true` 기본 + `baselineWarmupPolls=2` 정책. v1.0 마감 시 closure (SV3-10) |
..\..\docs\features\search-visibility.md:578:## 12.2 변경 이력
..\..\docs\features\search-visibility.md:584:| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
..\..\docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |

 succeeded in 656ms:
 M ../spike-a/package.json
 M ../spike-a/pgbouncer/userlist.txt
 M .env.example
 M package.json
 D src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/actions.ts
 D src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D src/app/(admin)/[instanceSlug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M src/app/layout.tsx
 M src/app/page.tsx
 M src/app/sign-in/consume/route.ts
 M src/lib/env.ts
 M src/styles/globals.css
 M tailwind.config.ts
 M ../../docs/core/DATA_MODEL.md
 M ../../docs/core/PAGE_TYPES.md
 M ../../docs/core/SCHEMA_MAPPING.md
 M ../../docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M ../../pnpm-lock.yaml
?? scripts/admin-qa-token.ts
?? scripts/seed-fixture.sql
?? scripts/site-scenarios.md
?? src/app/(admin)/admin/
?? src/app/(site)/
?? src/components/forms/ClinicProfileForm.tsx
?? src/components/site/
?? src/lib/db-projection.test.ts
?? src/lib/db-projection.ts
?? src/lib/errors.ts
?? src/lib/json-ld/
?? src/lib/markdown.test.ts
?? src/lib/markdown.ts
?? src/lib/public-db.ts
?? src/lib/public-tenant.ts
?? src/lib/site-initial.ts
?? src/lib/site-metadata.test.ts
?? src/lib/site-metadata.ts
?? src/lib/site-url.ts
?? vitest.config.ts
?? ../../docs/admin/ARCHITECTURE.md
?? ../../docs/core/CONTENT_STANDARDS.md
?? ../../docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? ../../docs/decisions/EAT_CONTENT_PLAN.md
?? ../../docs/decisions/LOCATION_LEGAL_PLAN.md
?? ../../docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? ../../handoff/PROJECT_OVERVIEW.md
?? ../../handoff/codex-reviews/
?? ../../packages/core-content/migrations/C0002_location_profile.sql
?? ../../packages/core-content/migrations/C0006_legal_document.sql
?? ../../packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? ../../packages/core-content/package.json
?? ../../packages/core-content/src/schema.ts
?? ../../packages/db/migrations/D0011_public_reader.sql
?? ../../packages/migrations-runner/src/

codex
현재 워크트리는 사용자/이전 작업 변경이 많이 섞여 있습니다. 리뷰만 수행하고 변경은 하지 않으며, line 인용을 위해 관련 섹션만 번호付き로 뽑아 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md','..\\..\\docs\\core\\DATA_MODEL.md','..\\..\\docs\\core\\PAGE_TYPES.md','..\\..\\docs\\core\\SCHEMA_MAPPING.md','..\\..\\docs\\core\\CONTENT_STANDARDS.md','..\\..\\docs\\admin\\ARCHITECTURE.md','..\\..\\docs\\decisions\\M0_BUILD_EXPORT_PLAN.md','..\\..\\docs\\decisions\\PUBLIC_SITE_RENDER_PLAN.md','..\\..\\packages\\migrations-runner\\src\\manifest.ts'); foreach("'$f in $files){ Write-Output "FILE $f"; Select-String -Path $f -Pattern '"'ECP-|EC-CASCADE|plan acceptance|code v1\\.0|v0\\.3|변경 이력|C-04|C-10|C-12|C-22|C-24|C-25|P-011|ScholarlyArticle|VideoObject|ContentType|EAT 4|PSR-DEFER|orderedMigrations|dependsOn|creates|validateManifest' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path ..\\..\\packages\\migrations-runner\\src\\manifest.ts | ForEach-Object -Begin {"'$i=1} -Process { '"'{0,4}: {1}' -f "'$i,$_ ; $i++ }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 613ms:
   1: // @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
   2: // SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
   3: //
   4: // 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
   5: // 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
   6: // plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
   7: //
   8: // orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
   9: // 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
  10: 
  11: export type MigrationDescriptor = {
  12:   /** 미가공 절대 경로 (repo root 기준 상대) */
  13:   readonly file: string;
  14:   /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
  15:   readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
  16:   /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
  17:   readonly creates: ReadonlyArray<string>;
  18:   /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
  19:   readonly dependsOn: ReadonlyArray<string>;
  20: };
  21: 
  22: /**
  23:  * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
  24:  * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
  25:  * runner 는 이 배열 순서대로 sequential apply (fail-fast).
  26:  */
  27: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
  28:   // (1) instance (multi-tenant root)
  29:   {
  30:     file: "packages/db/migrations/D0010_instance.sql",
  31:     package: "@glitzy/db",
  32:     creates: ["instance"],
  33:     dependsOn: [],
  34:   },
  35:   // (2) clinic_profile
  36:   {
  37:     file: "packages/core-content/migrations/C0001_clinic_profile.sql",
  38:     package: "@glitzy/core-content",
  39:     creates: ["clinic_profile"],
  40:     dependsOn: ["instance"],
  41:   },
  42:   // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
  43:   {
  44:     file: "packages/core-content/migrations/C0002_location_profile.sql",
  45:     package: "@glitzy/core-content",
  46:     creates: ["location_profile"],
  47:     dependsOn: ["instance"],
  48:   },
  49:   // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
  50:   {
  51:     file: "packages/core-content/migrations/C0003_doctor_profile.sql",
  52:     package: "@glitzy/core-content",
  53:     creates: ["doctor_profile"],
  54:     dependsOn: ["instance"],
  55:   },
  56:   // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
  57:   {
  58:     file: "packages/core-content/migrations/C0004_treatment_page.sql",
  59:     package: "@glitzy/core-content",
  60:     creates: ["treatment_page", "content_publication_status"],
  61:     dependsOn: ["instance"],
  62:   },
  63:   // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
  64:   {
  65:     file: "packages/core-content/migrations/C0005_article.sql",
  66:     package: "@glitzy/core-content",
  67:     creates: ["article", "risk_level"],
  68:     dependsOn: ["instance", "doctor_profile", "content_publication_status"],
  69:   },
  70:   // (7) legal_document — content_publication_status + risk_level enum FK
  71:   {
  72:     file: "packages/core-content/migrations/C0006_legal_document.sql",
  73:     package: "@glitzy/core-content",
  74:     creates: ["legal_document", "legal_document_type"],
  75:     dependsOn: ["instance", "content_publication_status", "risk_level"],
  76:   },
  77:   // (8) clinic_profile policy + primary_ctas (ALTER)
  78:   {
  79:     file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
  80:     package: "@glitzy/core-content",
  81:     creates: [
  82:       "clinic_profile.policy_contact_person",
  83:       "clinic_profile.policy_contact_email",
  84:       "clinic_profile.policy_contact_phone",
  85:       "clinic_profile.policy_effective_date",
  86:       "clinic_profile.primary_ctas",
  87:       "clinic_profile_primary_ctas_validate",
  88:       "clinic_profile_primary_ctas_trigger",
  89:     ],
  90:     dependsOn: ["clinic_profile"],
  91:   },
  92:   // (9) location_profile parentClinic composite FK (ALTER)
  93:   {
  94:     file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
  95:     package: "@glitzy/core-content",
  96:     creates: [
  97:       "location_profile.clinic_profile_id",
  98:       "location_profile_clinic_fk",
  99:       "location_profile_clinic_idx",
 100:     ],
 101:     dependsOn: ["clinic_profile", "location_profile"],
 102:   },
 103:   // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
 104:   // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
 105:   {
 106:     file: "packages/db/migrations/D0011_public_reader.sql",
 107:     package: "@glitzy/db",
 108:     creates: [
 109:       "app_public_reader",
 110:       "public_reader_instance_select",
 111:       "public_reader_clinic_profile_select",
 112:       "public_reader_location_profile_select",
 113:       "public_reader_doctor_profile_select",
 114:       "public_reader_treatment_page_select",
 115:       "public_reader_article_select",
 116:       "public_reader_legal_document_select",
 117:     ],
 118:     dependsOn: [
 119:       "instance",
 120:       "clinic_profile",
 121:       "location_profile",
 122:       "doctor_profile",
 123:       "treatment_page",
 124:       "article",
 125:       "legal_document",
 126:     ],
 127:   },
 128:   // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
 129:   {
 130:     file: "packages/core-content/migrations/C0009_article_category.sql",
 131:     package: "@glitzy/core-content",
 132:     creates: ["article_category"],
 133:     dependsOn: ["instance"],
 134:   },
 135:   // (12) publication
 136:   {
 137:     file: "packages/core-content/migrations/C0010_publication.sql",
 138:     package: "@glitzy/core-content",
 139:     creates: ["publication"],
 140:     dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
 141:   },
 142:   // (13) media_appearance
 143:   {
 144:     file: "packages/core-content/migrations/C0011_media_appearance.sql",
 145:     package: "@glitzy/core-content",
 146:     creates: ["media_appearance", "media_channel_type"],
 147:     dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
 148:   },
 149:   // (14) faq
 150:   {
 151:     file: "packages/core-content/migrations/C0012_faq.sql",
 152:     package: "@glitzy/core-content",
 153:     creates: ["faq"],
 154:     dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
 155:   },
 156:   // (15) article_category_fk — staged 4-step: ADD nullable + default `general` seed + backfill + SET NOT NULL + FK
 157:   //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
 158:   {
 159:     file: "packages/core-content/migrations/C0013_article_category_fk.sql",
 160:     package: "@glitzy/core-content",
 161:     creates: [
 162:       "article.category_id",
 163:       "article_category_fk",
 164:       "article_category_idx",
 165:     ],
 166:     dependsOn: ["article", "article_category"],
 167:   },
 168:   // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
 169:   {
 170:     file: "packages/db/migrations/D0014_public_reader_eat.sql",
 171:     package: "@glitzy/db",
 172:     creates: [
 173:       "public_reader_article_category_select",
 174:       "public_reader_publication_select",
 175:       "public_reader_media_appearance_select",
 176:       "public_reader_faq_select",
 177:     ],
 178:     dependsOn: [
 179:       "app_public_reader",
 180:       "article_category",
 181:       "publication",
 182:       "media_appearance",
 183:       "faq",
 184:     ],
 185:   },
 186: ];
 187: 
 188: /**
 189:  * validateManifest — runner 가 sequential apply 직전 호출.
 190:  * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
 191:  * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
 192:  */
 193: export function validateManifest(): ReadonlyArray<string> {
 194:   const errors: string[] = [];
 195:   const seen = new Set<string>();
 196:   for (const [i, m] of orderedMigrations.entries()) {
 197:     for (const dep of m.dependsOn) {
 198:       if (!seen.has(dep)) {
 199:         errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
 200:       }
 201:     }
 202:     for (const c of m.creates) seen.add(c);
 203:   }
 204:   return errors;
 205: }

 succeeded in 673ms:
FILE ..\..\docs\decisions\EAT_CONTENT_PLAN.md
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:1: # E-A-T Content 확장 plan (v0.3·draft·2026-05-18)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:3: > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:5: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:6: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:7: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:13: | Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:14: | MediaAppearance | **신규** | C-25 (인벤토리 추가) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:15: | Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:16: | ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:18: 모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:20: > **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:24: - `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:25: - `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:26: - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:27: - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:28: - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:30: - `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:31: - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:33: - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:34: - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:35: - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:37: - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:48: - **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:51: - **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:53: ### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:57: | C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:58: | C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:59: | C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:60: | C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:61: | C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:62: | C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:64: | D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:66: | status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:67: | 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:68: | Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:70: | MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:71: | Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:72: | JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:73: | sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:74: | FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:75: | Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:78: | DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:79: | authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:95: | MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:100: ### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:102: DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:113: pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:123: CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:146: - (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:147: - (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:150: ### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:189: - (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:191: ### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:201: authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:247: - (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:250: ### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:305: - (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:307: ### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:320: related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:333: CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:362: - (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:363: - (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:365: ### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:368: -- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:410: ## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:412: DATA_MODEL § 4 C-10 `contentType` enum 확장:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:419: - (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:420: - (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:433: ### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:449: - **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:454: - `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:462: ## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:464: ### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:467: - 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:469: - **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:470: - JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:474: ### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:480: **JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:481: - Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:488: ### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:494: **JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:500: ### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:516: ### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:525: ### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:527: - P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:532: ### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:536: ## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:538: ### 6.1 ScholarlyArticle entity (Publication)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:542: "@type": "ScholarlyArticle",
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:559: ### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:563: "@type": "VideoObject",
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:575: **결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:577: ### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:600: | 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:602: | P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:603: | P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:604: | P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:607: - (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:608: - (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:609: - (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:611: ## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:613: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:615: | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:630: - `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:635: - `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:637: - `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:640: - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:646: | 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:647: | 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:648: | 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:650: | 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:653: | 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:654: | 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:657: | 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:664: | 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:665: | 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:667: | 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:668: | 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:669: | 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:671: | 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:676: | 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:677: | 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:678: | 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:679: | 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:682: | 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:683: | 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:685: | 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:686: | 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:687: | 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:689: | 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:704: - `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:709: - `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:713: - `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:714: - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:715: - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:716: - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:717: - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:718: - § 4 C-24 Publication 풀명세 신규.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:719: - § 4 C-25 MediaAppearance 풀명세 신규.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:720: - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:721: - `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:722: - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:723: - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:724: - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:725: - `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:726: - `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:727: - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:728: - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:729: - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:730: - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:731: - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:733: ## 변경 이력
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:738: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:739: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
FILE ..\..\docs\core\DATA_MODEL.md
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:31: ### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:38: | C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:491: | `relatedArticles` | `Ref<C-04>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:678: | `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:877: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:915: ### C-22. `ArticleCategory` — Article Pillar 분류
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:923: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:971: | `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:987: - Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1112: Article (C-04)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1116: ├─ category → ArticleCategory (C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1121: ComplianceRecord (C-10)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1122: ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1146: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1160: ## 9. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1165: | 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1166: | 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1168: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1169: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1171: | 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1172: | 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1185: | 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1186: | 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
FILE ..\..\docs\core\PAGE_TYPES.md
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:46: | P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:333: **Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:371: ### P-011. FAQ
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:431: - 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:446: - 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:613: | P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:614: | P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:627: ## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:646: 2. P-011 FAQ
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:673: | PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:680: ## 9. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:686: | 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
FILE ..\..\docs\core\SCHEMA_MAPPING.md
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:87: - 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:125: | `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:148: | `Article` | P-010 Article Detail | Article (C-04) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:150: | `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:154: | `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:155: | `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:191: - `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:227: | `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:229: | `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:258: | `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:616: 9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:642: **VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:646: "@type": "VideoObject",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:659: **필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:665: ### P-011. FAQ
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:788: | C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:794: | C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:796: | C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:806: | C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:887: | P-011 FAQ | `faqs: FAQ[]` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:920: | P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:939: | **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:973: | SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:975: | SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:980: ## 10. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:986: | 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:988: | 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:989: | 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:990: | 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
FILE ..\..\docs\core\CONTENT_STANDARDS.md
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:76: | 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:102: 6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:154: - JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:208: - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:215: ### 3.6 임베디드 미디어 (VideoObject 등)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:218: - `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:219: - VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:265: | 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:309: ### 5.5 P-011 FAQ — 답변 단위 위험도
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:311: - 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:336: `Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:366: contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:367: featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:372: articleType?: ArticleType;        // DATA_MODEL C-04
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:381: // - Core 콘텐츠: contentType 사용, featureContentType 미지정
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:382: // - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:385: #### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:387: DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:390: type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:394: | 영역 | contentType 값 | featureContentType 값 | 예시 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:396: | Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:397: | Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:416: #### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:418: EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:420: | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:426: | `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:461: ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:477: // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:504: //   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:528: | 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:587: | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:589: | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:590: | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:658: | ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:659: | ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:664: ## 10. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:669: | 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:673: | 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:674: | 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:675: | 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:676: | 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
FILE ..\..\docs\admin\ARCHITECTURE.md
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:142: | `Article` (C-04) | 제목·요약·본문·저자·발행일·카테고리·`articleType` | | Article 작성 화면 |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:144: | `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:253: - `contentType` = `LegalDocument`
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:256: - `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:273: | 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:286: | `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:287: | `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:289: **격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:507: ## 11. 변경 이력
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:511: | 2026-05-13 | v0.1 | 최초 작성 (ARCHITECTURE.md v0.3에서 분리) | Glitzy (Claude 페어링) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:513: | 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:516: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
FILE ..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:10: - `docs/core/DATA_MODEL.md` v0.9 — Git 출력 계약 (C-01·C-02·C-03·C-04·C-16·C-21)
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:62: | 도메인 매핑 | path-based `/<instanceSlug>/...` v0.x | subdomain / custom domain (PSR-DEFER-02) + Vercel/Cloud Run middleware host rewrite |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:67: ### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:73: | `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:74: | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:75: | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:76: | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:77: | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:78: | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:80: PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:88: ## 변경 이력
FILE ..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:3: > **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:5: > **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:19: - `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:28: - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:47: | **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:64: | static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:65: | 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:66: | dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:67: | CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:68: | 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:69: | 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:70: | 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:71: | draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:72: | 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:73: | AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:74: | P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:75: | 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:76: | LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:77: | Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:78: | Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:119: - (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:128: - (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:209: - (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:215: - (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:240: - 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:241: - LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:256: - `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:257: - **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:277: - (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:306: | **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:307: | Article | `summary` | C-04 `summary` | Card · meta description |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:308: | Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:309: | Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:310: | Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:311: | Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:340: - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:393: - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:454: - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:469: - (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:532: > v0.1 단계 `{domain}` = `<host>/<instanceSlug>` path-based. M0 v1.0 도메인 매핑 합류 시 (PSR-DEFER-02) `<customDomain>` 으로 평면화. SEARCH_STANDARDIZATION § 3.3 footnote 의 `experimentalAiBots` flag 도 동일 cascade.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:534: - (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:562: - (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:570: - v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:584: | 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:613: | 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:650: - `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:651: - `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:652: - `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:653: - `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:654: - `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:655: - `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:659: - `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:660: - `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:661: - `PSR-DEFER-08`: draft preview token (어드민 외).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:662: - `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:663: - `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:665: ### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667: - `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:668: - `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:672: - `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:676: - `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:683: - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:684: - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:690: ## 변경 이력
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:696: | 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:698: | 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:699: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
FILE ..\..\packages\migrations-runner\src\manifest.ts
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:8: // orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:17: readonly creates: ReadonlyArray<string>;
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:19: readonly dependsOn: ReadonlyArray<string>;
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:24: * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:27: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:32: creates: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:33: dependsOn: [],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:39: creates: ["clinic_profile"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:40: dependsOn: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:46: creates: ["location_profile"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:47: dependsOn: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:53: creates: ["doctor_profile"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:54: dependsOn: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:60: creates: ["treatment_page", "content_publication_status"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:61: dependsOn: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:67: creates: ["article", "risk_level"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:68: dependsOn: ["instance", "doctor_profile", "content_publication_status"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:74: creates: ["legal_document", "legal_document_type"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:75: dependsOn: ["instance", "content_publication_status", "risk_level"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:81: creates: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:90: dependsOn: ["clinic_profile"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:96: creates: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:101: dependsOn: ["clinic_profile", "location_profile"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:108: creates: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:118: dependsOn: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:128: // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:132: creates: ["article_category"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:133: dependsOn: ["instance"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:139: creates: ["publication"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:140: dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:146: creates: ["media_appearance", "media_channel_type"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:147: dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:153: creates: ["faq"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:154: dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:157: //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:161: creates: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:166: dependsOn: ["article", "article_category"],
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:168: // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:172: creates: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:178: dependsOn: [
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:189: * validateManifest — runner 가 sequential apply 직전 호출.
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:190: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:193: export function validateManifest(): ReadonlyArray<string> {
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:196: for (const [i, m] of orderedMigrations.entries()) {
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:197: for (const dep of m.dependsOn) {
C:\Users\assag\solution\website-exposure\packages\migrations-runner\src\manifest.ts:202: for (const c of m.creates) seen.add(c);

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($range in @(@(1,90),@(300,520),@(700,900),@(1100,1320))){ for($i=$range[0]; $i -le [Math]::Min($range[1],$lines.Count); $i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\PAGE_TYPES.md'; "'$lines=Get-Content $p; foreach($range in @(@(1,90),@(220,320),@(430,500))){ for($i=$range[0]; $i -le [Math]::Min($range[1],$lines.Count); $i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\SCHEMA_MAPPING.md'; "'$lines=Get-Content $p; foreach($range in @(@(1,120),@(120,260),@(260,360))){ for($i=$range[0]; $i -le [Math]::Min($range[1],$lines.Count); $i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 909ms:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:1: # Core — 페이지 타입 표준
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:2: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:3: > **상태**: Draft v0.8
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:4: > **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:5: > **소유자**: Glitzy
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:6: > **상위 문서**: `docs/ARCHITECTURE.md` § 7
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:7: > **목적**: 솔루션이 표준화하는 의료기관 웹사이트 페이지 타입을 단독 구현 가능한 수준으로 정의한다.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:8: > **외부 공유 시 주의**: 표현 리스크 어휘 회피.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:9: > **연관 문서**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:10: > - 데이터 계약·공통 타입 → `core/DATA_MODEL.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:11: > - JSON-LD Schema graph → `core/SCHEMA_MAPPING.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:12: > - 메타 태그 → `core/SEARCH_STANDARDIZATION.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:13: > - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:14: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:15: > - 위험도 등급 → `compliance/RISK_LEVELS.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:16: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:17: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:18: ---
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:19: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:20: ## 0. 한 페이지 요약
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:21: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:22: - 필수 14종 + 선택 7종 = **21종 페이지 타입**.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:24: - **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:25: - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:26: - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:27: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:28: ---
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:29: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:30: ## 1. 페이지 타입 분류
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:31: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:32: ### 1.1 필수 타입 (Core 표준 14종)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:33: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:34: | ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:35: |---|---|---|---|:---:|
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:36: | P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:37: | P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:38: | P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:39: | P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:40: | P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:41: | P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:42: | P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:43: | P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:44: | P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:45: | P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:46: | P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:47: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:48: | P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:49: | P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:50: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:51: ### 1.2 선택 타입 (7종)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:52: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:53: | ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:54: |---|---|---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:55: | P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:56: | P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:57: | P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:58: | P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:59: | P-105 | Reservation | `/reservation` | Instance 결정 (Contact 통합 가능) | 전환 추적 단위 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:60: | P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:61: | P-107 | (예약됨) | | | 미래 확장용 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:62: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:63: ---
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:64: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:65: ## 2. 공통 룰 (모든 페이지 타입 적용)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:66: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:67: ### 2.1 헤딩 위계
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:68: - H1은 페이지당 1개. 페이지의 주제·정체성.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:69: - H2는 페이지 내 주요 섹션. 명사형 또는 질문형.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:70: - H3은 H2 하위 세부 단위.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:71: - H4 이하 자제 (AI 스니펫 추출 난이도 ↑).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:72: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:73: ### 2.2 시맨틱 마크업
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:74: - `<header>` / `<main>` / `<article>` / `<section>` / `<nav>` / `<footer>` 의미적 사용.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:75: - 콘텐츠 본문은 `<article>`. 보조 섹션은 `<aside>` 또는 `<section>`.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:76: - BreadcrumbList는 `<nav aria-label="breadcrumb">`.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:77: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:78: ### 2.3 메타 태그·robots·sitemap·canonical
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:79: - 모든 페이지에 title·description·canonical·og:*·twitter:* 필요.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:80: - 상세는 `core/SEARCH_STANDARDIZATION.md`.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:81: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:82: ### 2.4 BreadcrumbList
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:83: - Home 제외 모든 페이지에 JSON-LD BreadcrumbList 포함.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:84: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:85: ### 2.5 내부 링크 원칙
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:86: - 의미 있는 anchor text. 콘텐츠 클러스터.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:87: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:88: ### 2.6 AEO·AI 스니펫 친화
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:89: - 핵심 답변 문단 시작 1~2문장.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:90: - Q&A 블록·리스트·표 의도적 혼합.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:220: 3. 원리 (어떻게 작동)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:221: 4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:222: 5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:223: 6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:224: 7. 과정 (단계별)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:225: 8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:226: 9. 소요 시간·횟수
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:227: 10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:228: 11. 주의사항·금기증
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:229: 12. 시술 후 관리
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:230: 13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:231: 14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:232: 15. 자주 묻는 질문
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:233: 16. 담당 의료진 (백링크)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:234: 17. 관련 질환 (백링크)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:235: 18. 예약·문의 CTA
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:236: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:237: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:238: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:239: **헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:240: **필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:241: **선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:242: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:243: **레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:244: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:245: **위험도 기본값**: **Medium**
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:246: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:247: **슬롯별 위험도 격상 조건**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:248: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:249: | 슬롯 | 기본 | 격상 조건 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:250: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:251: | 개요·원리·과정·주의사항 | Medium | — |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:252: | 대상 (`recommendedFor`) | Medium | "이런 분은 꼭 필요" 권유형 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:253: | 구성 (`treatmentComponents`) | Medium | 구성별 효과 단정 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:254: | 방문 흐름 (`visitFlow`) | Medium | — |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:255: | 프로그램 변형 (`programVariants`) | Medium | 가격·기간·횟수 약속 결합 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:256: | 소요·횟수 | Medium | 감량 수치·기간 약속 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:257: | 유지 계획 (`maintenancePlan`) | Medium | "100% 요요 방지" 등 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:258: | 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:259: | FAQ | 답변별 가변 | 효과·결과 답변 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:260: | 후기·전후사진 (포함 시) | — | **자동 High** |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:261: | 가격·이벤트 (포함 시) | — | **자동 High** |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:262: | CTA | Low~Medium | 할인·이벤트 결합 → High |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:263: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:264: **컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:265: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:266: **내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:267: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:268: ### P-007. Conditions List
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:269: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:270: **목적**: 질환·증상 정보 페이지 진입로. 다이어트 한의원은 증상 기반 쿼리 비중 큼 (Phase Alpha 우선 합류 권장).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:271: **URL**: `/conditions`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:272: **주 데이터 계약**: `MedicalConditionPage[]`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:273: **Schema 요약**: BreadcrumbList + ItemList.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:274: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:275: **정보 슬롯**: 질환·증상 카드 / 분류 그룹(선택)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:276: **헤딩 위계**: H1 "질환·증상 정보" / H2 분류 그룹명
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:277: **필수 블록**: 카드 그리드
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:278: **선택 블록**: 분류 필터
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:279: **레이아웃 변형**: P-005 동일
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:280: **위험도 기본값**: Low
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:281: **컴플라이언스 주의**: 질환명·간략 설명에 진단 단정·효과 표현 금지.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:282: **내부 링크 권장**: → 각 Condition Detail / 관련 Treatments
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:283: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:284: ### P-008. Condition Detail
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:285: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:286: **목적**: 특정 질환·증상 정보 콘텐츠. 검색 의도 "OO증상이 뭐예요" 충족.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:287: **URL**: `/conditions/{slug}`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:288: **주 데이터 계약**: `MedicalConditionPage`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:289: **Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:290: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:291: **정보 슬롯**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:292: 1. 정의·핵심 답변 (1~2문장)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:293: 2. 주요 증상
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:294: 3. 원인·위험 요인
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:295: 4. 진단 방법 (일반론)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:296: 5. 치료 옵션 개요 (Treatment Detail로 링크)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:297: 6. 예방·관리
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:298: 7. 자주 묻는 질문
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:299: 8. 관련 시술 (백링크)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:300: 9. 관련 의료진
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:301: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:302: **헤딩 위계**: H1 질환명 / H2 "주요 증상", "원인", "진단", "치료", "예방·관리", "자주 묻는 질문"
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:303: **필수 블록**: 정의 / 주요 증상 / 원인 / 치료 옵션 / 예방
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:304: **선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:305: **레이아웃 변형**: P-006 동일
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:306: **위험도 기본값**: Medium
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:307: **컴플라이언스 주의**: 진단·치료 단정 금지. 자가 진단 유도 금지. 일반 의학 정보로 한정.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:308: **내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:309: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:310: ### P-009. Articles List
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:311: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:312: **목적**: 인사이트·정보 콘텐츠 목록.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:313: **URL**: `/insights` 또는 `/blog`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:314: **주 데이터 계약**: `Article[]`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:315: **Schema 요약**: BreadcrumbList + ItemList 또는 Blog.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:316: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:317: **정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:318: **헤딩 위계**: H1 "인사이트" / H2 Pillar 그룹
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:319: **필수 블록**: Article 카드 목록
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:320: **선택 블록**: 카테고리 필터 / 검색 / RSS / 콘텐츠 형식 필터
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:430: - **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:431: - 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:432: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:433: **정보 슬롯**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:434: 1. 정책 종류·제목
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:435: 2. 시행일·최종 개정일
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:436: 3. 본문 (조항·항목 위계)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:437: 4. 개정 이력 (필요 시)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:438: 5. 문의처 (개인정보 보호 책임자 등)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:439: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:440: **헤딩 위계**: H1 정책 제목 / H2 조항·항목명
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:441: **필수 블록**: 시행일 / 본문 / 문의처
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:442: **선택 블록**: 개정 이력
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:443: **레이아웃 변형**: 평면 본문 / TOC 사이드바
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:444: **위험도 기본값**: Low (사실 안내. 법적 정확성 확인 필수)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:445: **컴플라이언스 주의**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:446: - 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:447: - 의료법·개인정보보호법·정통망법·표시광고법 준수.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:448: - 표준 템플릿 그대로 사용 시에도 클라이언트 사업자번호·연락처·시행일·법인명 등 변수 정확성 확인.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:449: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:450: **내부 링크 권장**: 푸터 전체 접근. 본문 내부 링크는 일반적으로 없음.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:451: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:452: ### P-014. Location / Branch Detail
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:453: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:454: **목적**: 단지점·다지점 의료기관의 개별 지점 상세. 단일 지점도 main location으로 모델링.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:455: **URL**: `/locations/{slug}` (단일이면 `main`)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:456: **주 데이터 계약**: `LocationProfile`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:457: **Schema 요약**: `MedicalClinic`/`LocalBusiness` (지점 단위 별도 entity) + BreadcrumbList. 본원·지점 각자.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:458: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:459: **정보 슬롯**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:460: 1. 지점명·간략 소개
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:461: 2. 주소·지도 임베드 (지점 좌표)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:462: 3. 진료시간·접수시간·점심·휴진 (`BusinessHours`) — 지점별
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:463: 4. 예약·상담 채널 (`CTAConfig[]`) — 지점 직통
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:464: 5. 대중교통·주차 안내 (지점 특화)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:465: 6. 지점 의료진
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:466: 7. 지점 시술 (전체 또는 지점 특화)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:467: 8. 지점 사진·시설
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:468: 9. 다른 지점 안내 (Locations List 또는 형제 지점)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:469: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:470: **헤딩 위계**: H1 "{ClinicName} {지점명}점" / H2 "위치", "진료시간", "예약·상담", "의료진", "오시는 길"
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:471: **필수 블록**: 주소 / 진료시간 / 연락처·예약 채널 / 지점 의료진
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:472: **선택 블록**: 지도 / 대중교통 / 주차 / 시설 사진 / 다른 지점
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:473: **레이아웃 변형**: 분할 / 풀폭 / 매거진형
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:474: **위험도 기본값**: Low
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:475: **격상 조건**: 지점별 이벤트·할인·후기·전후사진 → High
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:476: **컴플라이언스 주의**: 지점 정보 정확성·즉시 갱신. 비교·최상급 금지.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:477: **내부 링크 권장**: → Home / Contact / 다른 Location Detail / 해당 지점 Doctors
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:478: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:479: **🔧 단지점 인스턴스의 자동 생성 규칙 (v0.6 정합)**:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:480: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:481: > 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:482: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:483: - 운영자가 어드민의 **ClinicProfile 화면 두 섹션**(기관 정체성 + 본원 위치·연락·시간)을 입력하면, 어드민이 두 파일을 동시 출력:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:484:   - **`ClinicProfile`** — 기관 정체성 섹션 입력값
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:485:   - **`LocationProfile`**(slug=`main`) — 본원 위치·연락·시간 섹션 입력값 (LocationProfile이 위치·시간·연락 SoT)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:486: - LocationProfile main 자동 매핑 핵심:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:487:   - `name` = ClinicProfile의 `name` (또는 "본원")
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:488:   - `parentClinic` = ClinicProfile의 `@id`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:489:   - `address`·`telephone`·`email`·`businessHours` = 본원 위치·연락·시간 섹션 입력값
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:490:   - `representativeDoctors`·`doctorsAtLocation`·`availableTreatments` = 기본 전체 (운영자가 별도 지정 가능)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:491:   - **`reservationChannels`** = ClinicProfile의 `primaryCtas[]` 상속 (지점 직통 채널 별도 지정 가능)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:492:   - **`featuredChannelId`** (선택) — 강조할 채널이 있을 때만 `reservationChannels[]`의 `@id` 명시
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:493: - **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:494: - 다지점 확장 시 별도 LocationProfile 추가 화면 도입 (Phase Beta+).
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:495: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:496: **다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:497: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:498: ---
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:499: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:500: ## 4. 선택 페이지 타입 상세

 succeeded in 991ms:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:1: # Core — Schema 매핑 표준
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:2: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:3: > **상태**: **v1.0** (구현 명세 안정판)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:4: > **작성일**: 2026-05-14 (v0.10 → v1.0 — § 2.2 룰 레벨 열 추가·안정판 격상)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:5: > **소유자**: Glitzy
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:6: > **상위 문서**: `docs/ARCHITECTURE.md` § 7
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:7: > **목적**: 솔루션이 사이트 빌드 시 출력하는 JSON-LD 구조화 데이터의 표준을 정의한다. 각 페이지 타입별 schema 그래프, 데이터 계약 ↔ schema 필드 매핑, 공통 룰, 금지·주의 schema, 빌드 검증을 단독 구현 가능한 수준으로 명시한다.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:8: > **외부 공유 시 주의**: 상위 문서와 동일. 의료 분야 표현 리스크 어휘 회피.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:9: > **연관 문서**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:10: > - 페이지 타입 정의 → `core/PAGE_TYPES.md`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:11: > - 데이터 계약 → `core/DATA_MODEL.md`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:12: > - 메타 태그·robots·sitemap → `core/SEARCH_STANDARDIZATION.md`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:13: > - 위험도 등급·표현 가이드 → `compliance/RISK_LEVELS.md`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:14: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:15: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:16: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:17: ## 0. 한 페이지 요약
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:18: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:19: - 모든 페이지는 **하나의 JSON-LD 그래프**(@graph 형태)로 통합 출력. 페이지 타입별 graph 구성 표준화.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:20: - 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:21: - 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:22: - **금지 schema** — `Review`·`AggregateRating`·`Offer`·`HealthAndBeautyBusiness`·`MedicalIndication` 단정형·`MedicalRiskFactor` 등은 **빌드 실패 (fail)** — § 8 참조.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:23: - `C-15 SchemaInput` 인터페이스를 본 문서 § 6에서 정식 정의 (DATA_MODEL.md placeholder 해소).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:24: - **공통 entity별 페이지 출력 정책은 § 2.5가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)이 본 표를 따른다.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:25: - **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:26: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:27: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:28: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:29: ## 1. 일반 규약
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:30: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:31: ### 1.1 JSON-LD 컨텍스트·통합 그래프
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:32: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:33: **Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:34: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:35: ```html
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:36: <script type="application/ld+json">
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:37: {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:38:   "@context": "https://schema.org",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:39:   "@graph": [
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:40:     { "@type": "Organization", "@id": "...", ... },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:41:     { "@type": "MedicalClinic", "@id": "...", ... },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:42:     { "@type": "BreadcrumbList", "itemListElement": [...] },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:43:     { "@type": "Article", "@id": "...", ... }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:44:   ]
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:45: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:46: </script>
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:47: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:48: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:49: - 페이지 타입별 graph 구성 표준은 § 3·§ 4.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:50: - 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:51: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:52: ### 1.2 `@id` 네이밍 규약
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:53: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:54: | Entity | `@id` 패턴 | 예시 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:55: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:56: | `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:57: | `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:58: | `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:59: | `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:60: | `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:61: | `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#condition` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:62: | `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:63: | `WebSite` | `https://{domain}/#website` | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:64: | `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:65: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:66: > `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:67: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:68: #### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:69: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:70: `PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:71: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:72: | Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:73: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:74: | `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:75: | `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:76: | `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:77: | `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:78: | `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:79: | `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:80: | `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:81: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:82: **Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:83: - 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph 등) 을 위해:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:84:   - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:85:   - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:86:   - **sitemap 의 lastmod** 갱신 — 전환 시 모든 페이지 lastmod 1회 갱신해 재크롤 유도
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:87: - 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:88: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:89: ### 1.3 entity Cross-reference
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:90: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:91: 다른 entity 참조는 `@id`만 사용:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:92: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:93: ```json
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:94: {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:95:   "@type": "Article",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:96:   "@id": "https://example.com/insights/diet/yoyo#article",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:97:   "author": { "@id": "https://example.com/doctors/hong#physician" },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:98:   "publisher": { "@id": "https://example.com/#organization" }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:99: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:100: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:101: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:102: 전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:103: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:104: ### 1.4 단지점 vs 다지점 (SM-05 해소)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:105: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:106: 본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias 사용 안 함** (entity identity 명확성).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:107: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:108: | 인스턴스 형태 | Organization | MedicalClinic |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:109: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:110: | **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:111: | **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:112: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:113: > P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:114: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:115: **`Organization` vs `MedicalClinic`의 책임 분리**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:116: - `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:117: - `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:118: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:119: ### 1.5 `inLanguage`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:120: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:120: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:121: **CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMeta.inLanguage를 따른다.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:122: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:123: | 명시 | 명시 안 함 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:124: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:125: | `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:126: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:127: > Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:128: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:129: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:130: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:131: ## 2. Schema 모듈 카탈로그
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:132: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:133: 본 솔루션이 사용하는 Schema.org 타입과 사용 책임.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:134: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:135: ### 2.1 표준 Schema 모듈
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:136: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:137: | Schema 타입 | 사용처 | 매핑 데이터 계약 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:138: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:139: | `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:140: | `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:141: | `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:142: | `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:143: | `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:144: | `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:145: | `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:146: | `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:147: | `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:148: | `Article` | P-010 Article Detail | Article (C-04) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:149: | `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:150: | `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:151: | `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:152: | `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:153: | `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:154: | `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:155: | `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:156: | `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:157: | `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:158: | `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:159: | `PostalAddress` | Address 하위 | Address |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:160: | `GeoCoordinates` | GeoCoordinates 하위 | GeoCoordinates |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:161: | `OpeningHoursSpecification` | BusinessHours 하위 | OpeningHoursSpec |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:162: | `ContactPoint` | 전화·이메일·CTA | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:163: | `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:164: | `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:165: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:166: ### 2.2 금지·주의 Schema — 요약 (상세는 § 8)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:167: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:168: | Schema | 룰 레벨 | 이유 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:169: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:170: | `Review` (개별 후기) | **fail** | 의료광고법 — 후기·전후사진은 사전심의 대상. P-101 활성화 시에도 schema 미출력 + 법무 자문 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:171: | `AggregateRating` | **fail** | 의료기관 평점 표시 위반 소지 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:172: | `Offer`·`DrugCost`·`MedicalCost` | **fail** | 의료 가격 광고 제한 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:173: | `MedicalRiskFactor`·`MedicalRiskEstimator` | **fail** | 진단 단정형. 본문 표현은 content-gate |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:174: | `MedicalIndication` (단정형 schema) | **fail** | 효능 단정. 본문 효능 표현은 content-gate |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:175: | `MedicalGuideline` (자체 작성) | **fail** | 검증되지 않은 의료 권고 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:176: | `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:177: | `MedicalDiagnosis`·`Quiz` | **fail** | 진단 단정 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:178: | `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:179: | `SpecialAnnouncement` | content-gate | 평상 휴진 미출력. 중대 공지만 별도 정책 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:180: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:181: > 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:182: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:183: ### 2.3 Schema 분류 — Rich Results 실효성 vs Entity 의미 전달
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:184: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:185: Schema는 두 가지 가치를 갖는다. 솔루션은 양쪽을 의식적으로 분리해 적용한다.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:186: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:187: **A. Rich Results 직접 효과 (검색 결과 시각적 노출)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:188: - `FAQPage` (Question/Answer) — FAQ 리치 결과
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:189: - `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:190: - `BreadcrumbList` — 빵부스러기 노출
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:191: - `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:192: - `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:193: - `Person` / `Physician` — 의료진 카드 (제한적)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:194: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:195: > `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:196: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:197: **B. Entity 의미 전달 (검색 엔진의 entity 그래프 구성)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:198: - `Organization` — 법인 identity
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:199: - `MedicalClinic` 본원·지점 — 의료기관 entity
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:200: - `Physician` — 의료진 entity (Rich Results는 제한적)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:201: - `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:202: - `WebPage` — 페이지 entity
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:203: - `WebSite` — 사이트 entity + SearchAction (Home에서만 풀)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:204: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:205: > **운영 함의**: A 카테고리는 빌드 검증·콘텐츠 패턴 최적화 우선. B 카테고리는 검색 엔진 신뢰도·entity 그래프에 의미 전달. 의료 schema는 유효해도 Google Rich Results 혜택이 제한적이므로 **A 카테고리를 위주로 효율 추구, B 카테고리는 신뢰도 신호로 두는 전략**.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:206: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:207: ### 2.4 Schema 출력 결정 — Allowed / Conditional / Blocked
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:208: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:209: 각 schema 타입에 대해 빌드 생성기가 결정 가능한 3단계 룰을 명시한다. 구현자가 "주의·신중·해당 시" 같은 모호한 표현으로 흔들리지 않도록.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:210: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:211: | 결정 | 의미 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:212: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:213: | **Allowed** | 항상 출력 (해당 페이지 타입·계약 데이터 존재 시) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:214: | **Conditional** | 조건 충족 시 출력 — 조건은 schema별 명시 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:215: | **Blocked** | 출력 금지 — 빌드 시 검출하면 fail (§ 8) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:216: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:217: **Schema별 결정 (요약)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:218: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:219: | Schema | 결정 | 조건/이유 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:220: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:221: | `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:222: | `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:223: | `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:224: | `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:225: | `MedicalCondition` 풀 엔티티 | Conditional | P-008 상세 페이지에서만 풀 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:226: | `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:227: | `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:228: | `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:229: | `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:230: | `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:231: | `Review` | **Blocked** | 의료광고법 (§ 8) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:232: | `AggregateRating` | **Blocked** | 의료광고법 (§ 8) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:233: | `Offer`·`DrugCost`·`MedicalCost` | **Blocked** | 의료 가격 광고 제한 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:234: | `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:235: | `MedicalIndication` (단정형 schema) | **Blocked (fail)** | 효능 단정 위험. Schema 출력 금지. 본문 효능 표현은 별도 content-gate (compliance-assistant) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:236: | `MedicalGuideline` | **Blocked** | 자체 작성 의료 권고 위반 소지 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:237: | `HealthInsurancePlan` | **Blocked** | 보험 광고 제한 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:238: | `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:239: | `SpecialAnnouncement` | Conditional → 사실상 미출력 | 평상 휴진은 본문/메타. 중대 공지(예: 보건 위기 대응)만 별도 정책 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:240: | `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:241: | `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:242: | `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:243: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:244: ### 2.5 공통 entity별 페이지 출력 정책 (단일 SoT)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:245: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:246: > 페이지별 graph 구성(§ 3·§ 4)의 단일 진실 원본. 같은 정책이 다른 섹션에서 다르게 표현되면 본 표가 우선.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:247: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:248: **용어 정의**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:249: - **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:250: - **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:251: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:252: | Entity | 정책 | 페이지 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:253: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:254: | `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:255: | `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:256: | `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:257: | `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:258: | `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:259: | `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:260: | `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:260: | `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:261: | `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:262: | `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:263: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:264: > § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:265: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:266: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:267: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:268: ## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:269: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:270: 각 페이지 타입의 graph 구성 + 핵심 필드 + 매핑 출처.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:271: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:272: ### P-001. Home
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:273: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:274: **Graph 구성**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:275: 1. `Organization` (ClinicProfile)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:276: 2. `MedicalClinic` (LocationProfile main) — 본원
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:277: 3. `WebSite` (SearchAction 포함)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:278: 4. `WebPage` (Home의 본문 entity)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:279: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:280: **Organization 필드 매핑**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:281: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:282: | Schema 필드 | 출처 (ClinicProfile) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:283: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:284: | `@type` | `"Organization"` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:285: | `@id` | `https://{domain}/#organization` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:286: | `name` | `name` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:287: | `alternateName` | `alternateName` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:288: | `legalName` | `legalEntityName` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:289: | `description` | `description` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:290: | `slogan` | `slogan` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:291: | `url` | `https://{domain}` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:292: | `logo` | `logoUrl` → `ImageObject` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:293: | `founder` | `founder` → `Person` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:294: | `foundingDate` | `foundingDate` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:295: | `award` | `awards[].name` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:296: | `memberOf` | `memberOf[]` → `Organization`(학회) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:297: | `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:298: | `sameAs` | `socialMedia.*` 배열로 변환 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:299: | `knowsAbout` | `medicalSpecialty[]` (보조) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:300: | `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:301: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:302: **MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:303: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:304: | Schema 필드 | 출처 (LocationProfile main) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:305: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:306: | `@type` | `"MedicalClinic"` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:307: | `@id` | `https://{domain}/#clinic` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:308: | `name` | `name` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:309: | `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:310: | `address` | `address` → `PostalAddress` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:311: | `telephone` | `telephone` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:312: | `email` | `email` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:313: | `openingHoursSpecification` | `businessHours.openingHours[]` → `OpeningHoursSpecification[]` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:314: | `geo` | `geo` → `GeoCoordinates` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:315: | `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:316: | `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:317: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:318: **WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:319: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:320: ```json
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:321: {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:322:   "@type": "WebSite",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:323:   "@id": "https://{domain}/#website",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:324:   "url": "https://{domain}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:325:   "name": "{ClinicProfile.name}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:326:   "publisher": { "@id": "https://{domain}/#organization" },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:327:   "inLanguage": "ko-KR"
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:328: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:329: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:330: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:331: **`potentialAction.SearchAction` 추가 조건 (Conditional)** — 사이트 내 검색 기능이 실제 구현되고 `/search` 라우트가 존재할 때만:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:332: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:333: ```json
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:334: "potentialAction": {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:335:   "@type": "SearchAction",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:336:   "target": "https://{domain}/search?q={search_term_string}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:337:   "query-input": "required name=search_term_string"
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:338: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:339: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:340: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:341: > PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchAction 미출력. 검색 기능 활성화 시 빌드 트리거.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:342: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:343: **다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:344: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:345: **WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:346: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:347: **BreadcrumbList**: Home에는 미적용.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:348: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:349: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:350: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:351: ### P-002. About
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:352: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:353: **Graph 구성**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:354: 1. `Organization` (법인 identity 풀필드)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:355: 2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:356: 3. `BreadcrumbList`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:357: 4. `WebPage` (about page)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:358: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:359: **Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:360: 

 succeeded in 1108ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1: # Core — 데이터 계약 명세
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:2: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:3: > **상태**: Draft v0.24
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:4: > **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:5: > **소유자**: Glitzy
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:6: > **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:7: > **연관 문서**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:8: > - 페이지 타입 → `core/PAGE_TYPES.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:9: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:10: > - 위험도 → `compliance/RISK_LEVELS.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:11: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:12: > - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:13: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:14: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:15: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:16: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:17: ## 0. 한 페이지 요약
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:18: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:19: - **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:20: - v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:21: - 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:22: - 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:23: - **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:24: - **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:25: - v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:26: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:27: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:28: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:29: ## 1. 계약 인벤토리
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:30: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:31: ### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:32: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:33: | ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:34: |---|---|---|:---:|:---:|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:35: | C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:36: | C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:37: | C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:38: | C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:39: | C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:40: | C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:41: | C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:42: | C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:43: | C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:45: | C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:47: | C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:48: | C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:49: | C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:50: | C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:51: | C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:52: | C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:53: | C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:54: | C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:55: | C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:57: | C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:60: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:61: ### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:62: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:63: | ID | 공통 타입 | 책임 | 소속 | 사용처 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:64: |---|---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:65: | CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:66: | CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:67: | CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:68: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:69: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:70: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:71: ## 2. 공통 룰
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:72: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:73: ### 2.1 타입 표기법
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:74: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:75: | 표기 | 의미 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:76: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:77: | `string`/`number`/`boolean` | 기본 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:78: | `Date` | ISO 8601 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:79: | `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:80: | `Markdown` | Markdown 본문 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:81: | `T[]` | 배열 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:82: | `T \| U` | 합 타입 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:83: | `enum {A, B, C}` | 열거형 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:84: | `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:85: | `?` (필드 뒤) | optional |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:86: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:87: ### 2.2 공통 메타 필드 (모든 계약)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:88: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:89: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:90: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:300: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:301: | `outlet` | `string` | ✅ | 매체명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:302: | `title` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:303: | `date` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:304: | `url` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:305: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:306: #### `InternationalSupport`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:307: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:308: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:309: | `languages` | `string[]` | ✅ | ISO 639-1 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:310: | `interpreterAvailable` | `boolean` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:311: | `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:312: | `targetCountries` | `string[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:313: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:314: ### C-02. `DoctorProfile` — 의료진 권위·전문성
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:315: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:316: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:317: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:318: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:319: | `name` | `string` | ✅ | 1~50자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:320: | `alternateName` | `string` | optional | 영문명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:321: | `jobTitle` | `string` | ✅ | 직책 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:322: | `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:323: | `briefBio` | `string` | ✅ | 50~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:324: | `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:325: | `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:326: | `photoUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:327: | `credentials` | `Credential[]` | ✅ | 최소 1개 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:328: | `education` | `Education[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:329: | `career` | `CareerItem[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:330: | `affiliations` | `Affiliation[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:331: | `publications` | `Publication[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:332: | `media` | `MediaItem[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:333: | `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:334: | `email` | `Email` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:335: | `socialMedia` | `SocialMediaLinks` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:336: | `consultationAvailable` | `boolean` | optional | 기본 `true` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:337: | `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:338: | `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:339: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:340: **하위 타입**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:341: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:342: #### `Credential`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:343: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:344: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:345: | `type` | `enum {license, certification, board}` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:346: | `name` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:347: | `issuedBy` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:348: | `issuedDate` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:349: | `expiryDate` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:350: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:351: #### `Education`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:352: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:353: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:354: | `institution` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:355: | `degree` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:356: | `period` | `string` | optional | 예: `"2010-2016"` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:357: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:358: #### `CareerItem`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:359: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:360: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:361: | `organization` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:362: | `role` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:363: | `period` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:364: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:365: #### `Publication`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:366: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:367: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:368: | `title` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:369: | `venue` | `string` | optional | 학회지·매체 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:370: | `year` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:371: | `url` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:372: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:373: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:374: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:375: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:376: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:377: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:378: | `name` | `string` | ✅ | 1~80자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:379: | `alternateName` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:380: | `summary` | `string` | ✅ | 50~160자 핵심 답변 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:381: | `category` | `string` | optional | 시술 카테고리 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:382: | `medicalSpecialty` | `Ref<C-14>` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:383: | `overview` | `Markdown` | ✅ | 개요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:384: | `mechanism` | `Markdown` | ✅ | 원리 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:385: | `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:386: | `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:387: | `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:388: | `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:389: | `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:390: | `duration` | `string` | optional | 소요 시간 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:391: | `sessionCount` | `string` | optional | 권장 횟수 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:392: | `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:393: | `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:394: | `aftercare` | `Markdown` | optional | 시술 후 관리 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:395: | `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:396: | `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:397: | `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:399: | `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:400: | `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:401: | `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:402: | `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:403: | `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:404: | `heroImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:405: | `ogImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:406: | `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:407: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:408: **하위 타입**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:409: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:410: #### `ProcessStep`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:411: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:412: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:413: | `order` | `number` | ✅ | 단계 번호 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:414: | `name` | `string` | ✅ | 단계명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:415: | `description` | `Markdown` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:416: | `durationMinutes` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:417: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:418: #### `TreatmentComponent` (v0.4 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:419: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:420: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:421: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:422: | `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:423: | `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:424: | `description` | `Markdown` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:425: | `included` | `boolean` | optional | 패키지 포함 여부 (default true) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:426: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:427: #### `VisitFlowStep` (v0.4 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:428: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:429: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:430: | `order` | `number` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:431: | `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:432: | `description` | `Markdown` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:433: | `durationMinutes` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:434: | `location` | `enum {clinic, remote, both}` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:435: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:436: #### `ProgramVariant`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:437: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:438: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:439: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:440: | `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:441: | `duration` | `string` | ✅ | 기간 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:442: | `sessionCount` | `string` | optional | 세션 수 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:443: | `targetSegment` | `string` | optional | 대상 분류 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:444: | `briefDescription` | `Markdown` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:445: | `includes` | `string[]` | optional | 포함 항목 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:446: | `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:447: | `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:448: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:449: #### `EvidenceNote` (v0.4 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:450: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:451: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:452: | `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:453: | `summary` | `string` | optional | 간략 요약 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:454: | `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:455: | `publishedYear` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:456: | `verifiedBy` | `string` | optional | 검증자·기관 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:457: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:458: #### `SlotRiskOverride`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:459: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:460: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:461: | `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:462: | `level` | `RiskLevel` | ✅ | 격상 등급 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:463: | `reason` | `string` | ✅ | 감사 추적용 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:464: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:466: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:467: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:468: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:469: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:470: | `headline` | `string` | ✅ | 1~120자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:471: | `summary` | `string` | ✅ | 80~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:472: | `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:473: | `author` | `Ref<C-02>` | ✅ | 저자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:474: | `coAuthors` | `Ref<C-02>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:475: | `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:476: | `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:477: | `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:478: | `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:479: | `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:480: | `datePublished` | `Date` | ✅ | 최초 발행일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:481: | `dateModified` | `Date` | ✅ | 최종 수정일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:482: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:483: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:485: | `tags` | `string[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:486: | `readingTimeMinutes` | `number` | optional | 자동 계산 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:487: | `wordCount` | `number` | optional | 자동 계산 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:488: | `coverImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:489: | `ogImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:490: | `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:491: | `relatedArticles` | `Ref<C-04>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:492: | `relatedTreatments` | `Ref<C-03>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:493: | `relatedConditions` | `Ref<C-11>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:494: | `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:495: | `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:496: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:497: **ArticleType ↔ 자동 추론 위험도**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:498: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:499: | ArticleType | 자동 위험도 | 운영자 오버라이드 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:500: |---|:---:|:---:|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:501: | `notice` | Low | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:502: | `general-medical-info` | Medium | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:503: | `treatment-explainer` | Medium | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:504: | `condition-explainer` | Medium | ✅ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:505: | `effect-result-related` | High | ✅ (낮출 수 없음) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:506: | `review-case` | High | ✅ (낮출 수 없음) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:507: | `event-price` | High | ✅ (낮출 수 없음) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:508: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:509: **하위 타입**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:510: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:511: #### `EmbeddedMedia`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:512: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:513: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:514: | `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:515: | `url` | `URL` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:516: | `title` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:517: | `caption` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:518: | `durationSeconds` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:519: | `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:520: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:700: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:701: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:702: | `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:703: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:704: #### `CrmIntegrationEntry` (v0.19 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:705: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:706: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:707: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:708: | `id` | string | ✅ | integration 식별자 (instance scope unique) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:709: | `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:710: | `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:711: | `apiUrl` | URL | ✅ | provider endpoint |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:712: | `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:713: | `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:714: | `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:715: | `legalApprovedBy` | string | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:716: | `legalApprovedAt` | Date | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:717: | `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:718: | `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:719: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:720: > 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:721: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:722: #### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:723: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:724: 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:725: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:726: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:727: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:728: | `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:729: | `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:730: | `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:731: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:732: | `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:733: | `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:734: | `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:735: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:736: > ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:737: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:738: #### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:739: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:740: 법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:741: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:742: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:743: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:744: | `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:745: | `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:746: | `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:747: | `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:748: | `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:749: | `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:750: | `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:751: | `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:752: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:753: ### C-09. `FeatureModuleConfig` — Feature Module 설정
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:754: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:755: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:756: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:757: | `moduleName` | `string` | ✅ | 모듈 식별자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:758: | `enabled` | `boolean` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:759: | `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:760: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:762: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:763: **마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:764: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:765: #### 어드민 DB 원본 (풀데이터)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:766: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:767: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:768: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:769: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:770: | `instanceId` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:773: | `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:774: | `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:775: | `articleType` | `string` | optional | (Article인 경우) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:776: | `inlineRiskFlags` | `string[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:777: | `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:778: | `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:779: | `peerReviewedAt` | `Date` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:780: | `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:781: | `physicianApprovedAt` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:782: | `clientApprover` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:783: | `clientApprovedAt` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:784: | `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:785: | `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:786: | `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:787: | `priorReviewSubmissionId` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:788: | `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:789: | `attachments` | `Attachment[]` | optional | 증빙 파일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:790: | `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:791: | `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:792: | `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:793: | `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:794: | `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:795: | `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:796: | `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:797: | `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:798: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:799: #### `MediaThresholdAssessment` (v0.14 +)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:800: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:801: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:802: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:803: | `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:804: | `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:805: | `windowEnd` | `Date` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:806: | `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:807: | `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:808: | `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:809: | `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:810: | `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:811: | `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:812: | `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:813: | `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:814: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:815: > `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:816: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:817: #### `WarningAcknowledgement` (v0.8 +)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:818: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:819: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:820: | `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:821: | `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:822: | `operatorId` | `string` | ✅ | operator 사용자 ID |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:823: | `timestamp` | `Date` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:824: | `note` | `string` | optional | 메모 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:825: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:826: #### `StaleFlags`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:827: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:828: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:829: | `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:830: | `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:831: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:832: | `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:833: | `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:834: | `triggeredAt` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:835: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:836: #### Git 사본 (경량 빌드 참조)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:837: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:838: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:839: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:840: | `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:841: | `articleType` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:842: | `priorReviewPassed` | `boolean` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:843: | `publishedAt` | `Date` | ✅ | schema datePublished |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:844: | `lastModifiedAt` | `Date` | ✅ | schema dateModified |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:845: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:846: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:847: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:848: **목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:849: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:850: **참조 페이지 타입**: P-013
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:851: **참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:852: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:853: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:854: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:855: | `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:856: | `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:857: | `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:858: | `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:859: | `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:860: | `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:861: | `effectiveDate` | `Date` | ✅ | 시행일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:862: | `lastRevisedDate` | `Date` | optional | 최종 개정일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:863: | `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:864: | `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:865: | `contactEmail` | `Email` | optional | 정책 문의 채널 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:866: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:867: **하위 타입**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:868: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:869: #### `LegalDocumentRevision`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:870: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:871: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:872: | `date` | `Date` | ✅ | 개정일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:873: | `summary` | `string` | ✅ | 개정 내용 요약 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:874: | `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:875: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:876: **컴플라이언스 룰**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:877: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:878: - 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:879: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:880: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:881: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:882: **SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:883: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:884: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:885: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:886: | `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:887: | `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:888: | `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:889: | `branchDescription` | `string` | optional | 50~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:890: | `address` | `Address` | ✅ | 지점 주소 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:891: | `geo` | `GeoCoordinates` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:892: | `telephone` | `Phone` | ✅ | 지점 직통 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:893: | `fax` | `Phone` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:894: | `email` | `Email` | optional | 지점 이메일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:895: | `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:896: | `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:897: | `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:898: | `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:899: | `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:900: | `images` | `URL[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1100: DoctorProfile (C-02)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1101:    ├─ primaryLocation → LocationProfile (C-21)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1102:    ├─ additionalLocations → LocationProfile[]
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1103:    └─ trustMetrics → TrustMetric[] (CT-01)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1104: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1105: TreatmentPage (C-03)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1106:    ├─ cta → CTAConfig (CT-03)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1107:    ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1108:    ├─ relatedDoctors → DoctorProfile[]
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1109:    ├─ relatedConditions → MedicalConditionPage[]
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1110:    └─ pageRiskLevel → RiskLevel (직접 enum)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1111: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1112: Article (C-04)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1113:    ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1114:    ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1115:    ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1116:    ├─ category → ArticleCategory (C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1117:    ├─ contentSource / externalUrl (v0.4)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1118:    ├─ embeddedMedia → EmbeddedMedia[]
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1119:    └─ pageRiskLevel → RiskLevel
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1120: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1121: ComplianceRecord (C-10)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1122:    ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1123:    └─ pageRiskLevel → RiskLevel
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1124: ```
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1125: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1126: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1127: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1128: ## 7. 변경 정책
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1129: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1130: (§ 2.6 표 참조 — MAJOR/MINOR/PATCH)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1131: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1132: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1133: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1134: ## 8. 미결정 사항
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1135: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1136: | ID | 항목 | 비고 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1137: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1138: | DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1139: | DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1140: | DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1141: | DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1142: | DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1143: | DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1144: | DM-07 | cross-reference 빌드 검증 | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1145: | DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1146: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1147: | DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1148: | DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1149: | DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1150: | DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1151: | DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1152: | DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1153: | DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1154: | DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1155: | DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1156: | DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1157: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1158: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1159: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1160: ## 9. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1161: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1162: | 일자 | 버전 | 변경 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1163: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1164: | 2026-05-13 | v0.1 | 최초 — 20개 계약 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1165: | 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1166: | 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1167: | 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1168: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1169: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1170: | 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1171: | 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1172: | 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1173: | 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1174: | 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1175: | 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1176: | 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1177: | 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1178: | 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1179: | 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1180: | 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1181: | 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1182: | 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1183: | 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1184: | 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1185: | 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1186: | 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1187: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\DATA_MODEL.md -Pattern '"'^### C-04|''^### C-10|''^### C-12|''^### C-22|''^### C-24|''^### C-25'"' | ForEach-Object { "'$_.LineNumber.ToString()+'"': '+"'$_.Line }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\SCHEMA_MAPPING.md'; "'$lines=Get-Content $p; for($i=135;$i -le 160;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }; for($i=520;$i -le 610;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\CONTENT_STANDARDS.md'; "'$lines=Get-Content $p; for($i=1;$i -le [Math]::Min(30,$lines.Count);$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }; Select-String -Path $p -Pattern '"'7\\.1\\.1\\.2|ContentType|Publication|MediaAppearance|FAQ' -Context 2,8 | ForEach-Object { "'$_.Context.PreContext + $_.Line + $_.Context.PostContext | ForEach-Object -Begin {$n=$_.LineNumber} { $_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 741ms:
465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
915: ### C-22. `ArticleCategory` — Article Pillar 분류
932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)

 succeeded in 788ms:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:135: ### 2.1 표준 Schema 모듈
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:136: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:137: | Schema 타입 | 사용처 | 매핑 데이터 계약 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:138: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:139: | `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:140: | `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:141: | `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:142: | `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:143: | `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:144: | `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:145: | `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:146: | `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:147: | `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:148: | `Article` | P-010 Article Detail | Article (C-04) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:149: | `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:150: | `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:151: | `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:152: | `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:153: | `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:154: | `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:155: | `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:156: | `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:157: | `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:158: | `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:159: | `PostalAddress` | Address 하위 | Address |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:160: | `GeoCoordinates` | GeoCoordinates 하위 | GeoCoordinates |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:520:       }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:521:     }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:522:   ]
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:523: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:524: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:525: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:526: ---
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:527: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:528: ### P-007. Conditions List
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:529: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:530: **Graph 구성**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:531: 1. `Organization` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:532: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:533: 3. `WebPage` — **[풀]**, `isPartOf: #website`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:534: 4. `BreadcrumbList` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:535: 5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:536: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:537: ### P-008. Condition Detail
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:538: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:539: **Graph 구성**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:540: 1. `Organization` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:541: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:542: 3. `MedicalCondition` (풀필드) — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:543: 4. `BreadcrumbList` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:544: 5. `WebPage` — **[풀]**, `isPartOf: #website`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:545: 6. (FAQ) `FAQPage` — **[풀]** (Conditional)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:546: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:547: **MedicalCondition 필드**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:548: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:549: | Schema 필드 | 출처 (MedicalConditionPage) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:550: |---|---|
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:551: | `@type` | `"MedicalCondition"` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:552: | `@id` | `https://{domain}/conditions/{slug}#condition` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:553: | `name` | `name` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:554: | `description` | `definition` (+ `causes[]` 일부 일반론을 description 보조 텍스트로 흡수 가능) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:555: | `signOrSymptom` | `symptoms[]` → `MedicalSignOrSymptom` |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:556: | `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:557: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:558: > `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:559: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:560: ### P-009. Articles List
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:561: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:562: **Graph 구성**:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:563: 1. `Organization` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:564: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:565: 3. `WebPage` — **[풀]**, `isPartOf: #website`
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:566: 4. `BreadcrumbList` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:567: 5. `ItemList` 또는 `Blog` — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:568: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:569: `ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:570: ```json
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:571: {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:572:   "@type": "ItemList",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:573:   "itemListElement": [
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:574:     {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:575:       "@type": "ListItem",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:576:       "position": 1,
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:577:       "item": {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:578:         "@type": "Article",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:579:         "@id": "https://{domain}/insights/{cat}/{slug}#article",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:580:         "headline": "{Article.headline}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:581:         "url": "https://{domain}/insights/{cat}/{slug}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:582:         "image": "{Article.coverImageUrl}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:583:         "datePublished": "{Article.datePublished}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:584:         "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:585:       }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:586:     }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:587:   ]
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:588: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:589: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:590: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:591: `Blog` 사용 시 (콘텐츠 운영 명확 표시):
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:592: ```json
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:593: {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:594:   "@type": "Blog",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:595:   "@id": "https://{domain}/insights#blog",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:596:   "name": "{Articles List title}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:597:   "publisher": { "@id": "https://{domain}/#organization" },
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:598:   "blogPost": [
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:599:     { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:600:   ],
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:601:   "inLanguage": "ko-KR"
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:602: }
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:603: ```
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:604: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:605: ### P-010. Article Detail
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:606: 
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:607: **Graph 구성** (entity별 [풀]/[참조+inline 최소]/[참조만] 표기):
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:608: 1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:609: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:610: 3. `Article` — **[풀]**

 succeeded in 851ms:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:1: # Core — 콘텐츠 작성 표준 (AEO·AI 스니펫·의료광고 표현)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:2: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:3: > **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:4: > **작성일**: 2026-05-14
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:5: > **소유자**: Glitzy
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:6: > **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:7: > **목적**: Core가 생성·관리하는 콘텐츠의 작성 표준. AEO·AI 스니펫 친화 구조, 콘텐츠 블록 표준, 의료광고법 표현 가이드(금지·대체), 페이지 타입·ArticleType별 룰, compliance-assistant 인터페이스, 빌드 검증을 단독 구현 가능한 명세로 정의.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:8: > **외부 공유 시 주의**: 상위 문서와 동일. 표현 리스크 어휘 회피.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:9: > **연관 문서**:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:10: > - 페이지 타입 정의 → `core/PAGE_TYPES.md`
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:11: > - 데이터 계약 → `core/DATA_MODEL.md`
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:12: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:13: > - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:14: > - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:15: > - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:16: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:17: ---
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:18: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:19: ## 0. 한 페이지 요약
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:20: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:21: - **콘텐츠 작성 표준 = 5개 영역**: 일반 규약(톤·문체) / AEO·AI 스니펫 친화 구조 / 콘텐츠 블록 표준 / 의료광고 표현 / 페이지·ArticleType별 룰.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:22: - **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:23: - **빌드 검증**: 자체 룰 checker가 본 문서의 fail/warning/content-gate 룰을 적용. 외부 LLM 검수(compliance-assistant)는 별도.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:24: - **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:25: - 페이지 타입별 콘텐츠 슬롯·필수 블록은 `PAGE_TYPES.md`가 정의, 본 문서는 **각 슬롯에 들어가는 콘텐츠의 표현·구조 표준**을 다룬다.
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:26: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:27: ---
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:28: 
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:29: ## 1. 일반 규약
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:30: 
| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
| TreatmentPage.summary | 50~160자 |
| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |

### 1.4 변경 정책

- 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
- 표현 룰 강화 (기존 콘텐츠 위반 가능): **MAJOR** (마이그레이션 가이드 필수)
- 페이지 타입별 룰 신설: MINOR
- 새 ArticleType 추가: MINOR

4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph

> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).

### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)

- **H1 페이지당 1개**. 페이지 주제 명시
- H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
- H3은 H2 하위 세부 단위
| 번호 리스트 (단계·순서) | `<ol><li>` 3~10개 | 단계형 스니펫 |
| 표 (비교·항목) | `<table>` 2~5컬럼 | 표형 스니펫 |
| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
| 인용·근거 | `<blockquote>` + 출처 | 신뢰도 신호 |

| 룰 | 레벨 |
|---|---|
| P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
| 리스트 항목이 2개 이하인 `<ul>`/`<ol>` | warning (리스트 효과 약함) |
| 표가 1행만 있는 경우 | warning |

**책임 분리**:
- 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립

| 룰 | 레벨 |
|---|---|
| Q&A 블록의 질문이 의문문 아닌 경우 | warning |
| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |

|---|---|---|
| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
| 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
| 의료진 자격·논문 | DoctorProfile (C-02) | 검증 가능 사실만. "최고의 명의" 등 단정 금지 |
| 누적 통계 (TrustMetric) | ClinicProfile.trustMetrics | 기준 기간·범위·증빙 동반 (DATA_MODEL CT-01). "국내 1위·최대" 등 단정 금지 |

### 4.4 문맥 예외 카탈로그 (false-positive 방지)

다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.

### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)

### 5.5 P-011 FAQ — 답변 단위 위험도

- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
- 효과·결과 관련 답변 → High → content-gate

### 5.6 P-101 Reviews — High-risk commercial

- 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
```ts
type ComplianceCheckInput = {
  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
  contentRef: string;                 // 대상 콘텐츠 @id
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
    articleType?: ArticleType;        // DATA_MODEL C-04
    pageMeta?: PageMeta;              // DATA_MODEL C-06
    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
type ComplianceCheckInput = {
  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
  contentRef: string;                 // 대상 콘텐츠 @id
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
    articleType?: ArticleType;        // DATA_MODEL C-04
    pageMeta?: PageMeta;              // DATA_MODEL C-06
    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력

// 둘 중 정확히 하나만 사용:
// - Core 콘텐츠: contentType 사용, featureContentType 미지정
// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
// 둘 중 정확히 하나만 사용:
// - Core 콘텐츠: contentType 사용, featureContentType 미지정
// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
|---|---|---|
| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.

#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)

EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)

EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).
| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:

| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:

```ts
{
  ruleId: "risk-level-high-gate",
  | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
  | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
  | { type: "global" };

// 문맥 예외 — § 4.4 안전·주의·행정 문맥
type ContextException = {
  kind: "safety" | "warning-message" | "administrative";  // 의료진 상담 권유·안전 주의·환불 약관 등
  pattern: string;             // 예외 인식 정규식 (예: "(상담하세요|금기|환불 불가)")
};
```
| ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
| ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
| 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\CONTENT_STANDARDS.md -Pattern '7\\.1\\.1\\.2|Publication \\| \\*\\*면제|MediaAppearance|FAQ"'` Q|FAQ` A|ArticleCategory'"' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\admin\\ARCHITECTURE.md'; Select-String -Path "'$p -Pattern '"'3\\.11|11 페이지|P-011|Vertical Slice|게이트 #1' -Context 2,4 | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim(); foreach($l in $_.Context.PostContext){ '"'  '+"'$l } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\M0_BUILD_EXPORT_PLAN.md'; Select-String -Path "'$p -Pattern '"'2\\.2|EAT|Publication|MediaAppearance|FAQ|ArticleCategory' -Context 2,8 | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim(); foreach($l in $_.Context.PostContext){ '"'  '+"'$l } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 756ms:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:416: #### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:418: EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:423: | `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:424: | `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:425: | `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:426: | `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md:428: **v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

 succeeded in 771ms:
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:18: - 어드민 DB (`clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` · `legal_document` · 등) → Git output (Markdown frontmatter + YAML/JSON content file) 변환.
  - 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
  - `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
  
  ### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
  
  | 변환 | DB source | Git output |
  |---|---|---|
  | ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:38: - DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
  - ComplianceRecord (audit DB · ARCH § 6.3 cross-data) → Git output 사본.
  - InstanceManifest · BrandTokens · FeatureModuleConfig.
  - 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.
  
  ## 2. 작업 단위 (M0 v1.0 합류 시)
  
  - apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
  - Git client (isomorphic-git 또는 simple-git) 통합.
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:40: - InstanceManifest · BrandTokens · FeatureModuleConfig.
  - 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.
  
  ## 2. 작업 단위 (M0 v1.0 합류 시)
  
  - apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
  - Git client (isomorphic-git 또는 simple-git) 통합.
  - DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
  - CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:67: ### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)
  
  EAT_CONTENT_PLAN v0.x acceptance commit 안 cascade — apps/worker 의 build/export 시점에 다음 4 entity Git 출력:
  
  | Entity | DB source (마이그레이션) | Git output | 비고 |
  |---|---|---|---|
  | `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
  | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
  | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:69: EAT_CONTENT_PLAN v0.x acceptance commit 안 cascade — apps/worker 의 build/export 시점에 다음 4 entity Git 출력:
  
  | Entity | DB source (마이그레이션) | Git output | 비고 |
  |---|---|---|---|
  | `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
  | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
  | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
  | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
  | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:73: | `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
  | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
  | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
  | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
  | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
  | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
  
  PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:74: | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
  | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
  | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
  | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
  | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
  
  PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
  ## 3. 비범위 (M0 v1.0 외)
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:75: | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
  | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
  | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
  | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
  
  PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
  ## 3. 비범위 (M0 v1.0 외)
  
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:76: | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
  | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
  | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
  
  PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
  ## 3. 비범위 (M0 v1.0 외)
  
  - PR 워크플로우 (Direct push 외) — M2 Phase Beta.
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:78: | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
  
  PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
  ## 3. 비범위 (M0 v1.0 외)
  
  - PR 워크플로우 (Direct push 외) — M2 Phase Beta.
  - Git history 시각화 UI — M2 Phase Beta.
  - 다국어 출력 — M3.
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:80: PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
  
  ## 3. 비범위 (M0 v1.0 외)
  
  - PR 워크플로우 (Direct push 외) — M2 Phase Beta.
  - Git history 시각화 UI — M2 Phase Beta.
  - 다국어 출력 — M3.
  
  ## 변경 이력

 succeeded in 785ms:
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:7: > **목적**: 솔루션 운영 Control Plane(어드민)의 위상·원칙·Vertical Slice 명세·Phase 로드맵·기능 영역·데이터 모델·통합 흐름을 정의한다.
  > **외부 공유 시 주의**: 상위 문서와 동일.
  
  ---
  
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:19: - 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.
  
  ---
  
  ## 1. 위치 — 전체 흐름
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:32: │  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
  │  │ ① 클라이언트 인스턴스 대시보드                                     │  │
  │  │ ② 사이트 기본 정보 (ClinicProfile)                                │  │
  │  │ ③ 의료진 관리 (DoctorProfile)                                     │  │
  │  │ ④ 시술/진료 페이지 (TreatmentPage)                                │  │
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:86: ## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
  
  > 본 절은 솔루션의 **첫 동작 가능 범위**를 정의한다. 이 한 줄이 처음부터 끝까지 동작하면 1호 클라이언트(다이어트 한의원) 출시 가능. 이후 기능은 모두 이 흐름에 붙는다.
  
  ### 3.1 Slice 흐름
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:269: ### 3.11 Slice 완료 게이트 (6항목)
  
  | # | 게이트 항목 | 통과 기준 |
  |---|---|---|
  | 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:273: | 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
  | 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
  | 3 | 컴플라이언스 자동 검수 | 룰 기반 금지 표현 검수 동작 + Low/Medium/High 수동 분류 동작 |
  | 4 | Git 기반 발행·롤백 | 발행 시 커밋 자동 생성, Git revert로 롤백 가능 |
  | 5 | Preview URL 제공 | 발행 전 별도 URL로 미리보기 가능 |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:287: | `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
  
  **격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
  
  ---
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:295: ### 4.1 M0 — Vertical Slice (§ 3 참조)
  
  위 § 3 명세. 1호 클라이언트 출시 가능 시점.
  
  ### 4.2 M1 — Phase Alpha (Slice 직후 합류 기능)
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:512: | 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
  | 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:513: | 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:514: | 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
C:\Users\assag\solution\website-exposure\docs\admin\ARCHITECTURE.md:515: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
  | 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md -Pattern 'acceptance commit 안 함께|code v1\\.0|Article detail SQL JOIN|실 코드|docs only|D0014_public_reader_eat.sql|C0009|C0010|C0011|C0012|C0013' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md -Pattern '"'^## 12|EC-CASCADE-0|cascade|변경 이력|v0'"\\.3|ECP-23|ECP-30' -Context 0,3 | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim(); foreach($l in $_.Context.PostContext){ '"'  '+"'$l } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\DATA_MODEL.md -Pattern 'contentType|Publication|MediaAppearance|ArticleCategory|FAQ|C-24|C-25|C-01~C-22|C-01~C-25|C-01~C-25' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 763ms:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:3: > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:5: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:6: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:7: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:20: > **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:35: - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:63: | 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:105: -- packages/core-content/migrations/C0009_article_category.sql
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:147: - (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:153: -- packages/core-content/migrations/C0013_article_category_fk.sql
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:194: -- packages/core-content/migrations/C0010_publication.sql
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:253: -- packages/core-content/migrations/C0011_media_appearance.sql
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:310: -- packages/core-content/migrations/C0012_faq.sql
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:368: -- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:630: - `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:631: - `packages/core-content/migrations/C0009_article_category.sql` (신규)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:632: - `packages/core-content/migrations/C0010_publication.sql` (신규)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:633: - `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:634: - `packages/core-content/migrations/C0012_faq.sql` (신규)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:635: - `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:639: - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:640: - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:664: | 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:665: | 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:666: | 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:667: | 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:668: | 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:669: | 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:727: - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:738: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:739: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 758ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:331: | `publications` | `Publication[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:365: #### `Publication`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:678: | `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:877: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:915: ### C-22. `ArticleCategory` — Article Pillar 분류
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:950: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:978: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1011: | `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1116: ├─ category → ArticleCategory (C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1122: ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1146: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1168: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1169: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |

 succeeded in 767ms:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:1: # E-A-T Content 확장 plan (v0.3·draft·2026-05-18)
  
  > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:3: > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
  
  > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
  > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:5: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
  > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
  > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:6: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
  > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
  
  본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:7: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
  
  본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:20: > **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
  
  ## SoT
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:24: - `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
  - `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
  - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
  - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:25: - `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
  - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
  - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
  - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:26: - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
  - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
  - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
  - `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:28: - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
  - `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
  - `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
  - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:30: - `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
  - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
  - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
  - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:31: - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
  - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
  - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
  - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:33: - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
  - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
  - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
  - 기존 packages 실 시그니처:
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:34: - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
  - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
  - 기존 packages 실 시그니처:
    - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:35: - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
  - 기존 packages 실 시그니처:
    - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
    - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:37: - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
    - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
    - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
    - `apps/web/src/lib/json-ld/{entities, builders}.ts` (JSON-LD generator)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:58: | C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
  | C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
  | C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
  | C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:59: | C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
  | C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
  | C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
  | C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:62: | C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
  | 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
  | D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
  | 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:67: | 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
  | Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
  | About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
  | MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:76: | PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
  | CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
  | DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
  | authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:89: | FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
  | FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
  | Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
  | Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:90: | FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
  | Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
  | Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
  | FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:109: instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:198: instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:259: instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_name TEXT NOT NULL,
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:305: - (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  
  ### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:314: instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:343: -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
  );
  
  CREATE INDEX faq_instance_idx ON faq (instance_id);
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:368: -- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
  
  -- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
  --   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:408: - (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
  
  ## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:410: ## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
  
  DATA_MODEL § 4 C-10 `contentType` enum 확장:
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:420: - (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
  
  ## 4. 어드민 폼 결정
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:458: ### 4.5 dashboard cascade (EC-FORM-05)
  
  `/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:536: ## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
  
  ### 6.1 ScholarlyArticle entity (Publication)
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:575: **결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  
  ### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:611: ## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
  
  `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:613: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
  
  | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
  |---|---|---|---|---|
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:630: - `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
  - `packages/core-content/migrations/C0009_article_category.sql` (신규)
  - `packages/core-content/migrations/C0010_publication.sql` (신규)
  - `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:642: ## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
  
  | # | 시나리오 | 통과 기준 |
  |---|---|---|
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:647: | 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
  | 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
  | 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
  | 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:684: | 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
  | 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
  | 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
  | 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:689: | 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
  
  ## 11. M0 v1.0 cascade markers (defer 정리)
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:691: ## 11. M0 v1.0 cascade markers (defer 정리)
  
  ### 11.1 별 cycle 합류
  - `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:711: ## 12. Cascade markers (다른 SoT 문서로 전파)
  
  - `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
    - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:713: - `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
    - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
    - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
    - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:721: - `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
    - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
    - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
    - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:725: - `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
  - `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
  - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
  - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:726: - `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
  - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
  - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
  - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:727: - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
  - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
  - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
  - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:728: - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
  - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
  - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
  - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:729: - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
  - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
  - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:730: - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
  - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
  
  ## 변경 이력
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:731: - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
  
  ## 변경 이력
  
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:733: ## 변경 이력
  
  | 일자 | 버전 | 변경 |
  |---|---|---|
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:738: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
  | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
C:\Users\assag\solution\website-exposure\docs\decisions\EAT_CONTENT_PLAN.md:739: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\PAGE_TYPES.md -Pattern '"'^## 6|P-011|11개|10종|M0 Slice'"' -Context 1,3 | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim(); foreach($l in $_.Context.PostContext){ '"'  '+"'$l } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($range in @(@(326,372),@(465,490),@(761,775),@(915,1015),@(1118,1124))){ for($i=$range[0]; $i -le $range[1]; $i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 617ms:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
  - **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
  - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
  - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:46: | P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
  | P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
  | P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
  | P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:371: ### P-011. FAQ
  
  **목적**: 자주 묻는 질문. AI 스니펫·사이트 브리핑 직접 인용 후보.
  **URL**: `/faq`
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:614: | P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
  | P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
  | P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
  | P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:627: ## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
  
  | 순서 | 페이지 타입 | 비고 |
  |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:646: 2. P-011 FAQ
  3. P-007/P-008 Conditions (다이어트 한의원 증상 기반 쿼리)
  
  ---

 succeeded in 689ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:326: | `photoUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:327: | `credentials` | `Credential[]` | ✅ | 최소 1개 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:328: | `education` | `Education[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:329: | `career` | `CareerItem[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:330: | `affiliations` | `Affiliation[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:331: | `publications` | `Publication[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:332: | `media` | `MediaItem[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:333: | `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:334: | `email` | `Email` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:335: | `socialMedia` | `SocialMediaLinks` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:336: | `consultationAvailable` | `boolean` | optional | 기본 `true` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:337: | `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:338: | `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:339: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:340: **하위 타입**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:341: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:342: #### `Credential`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:343: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:344: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:345: | `type` | `enum {license, certification, board}` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:346: | `name` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:347: | `issuedBy` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:348: | `issuedDate` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:349: | `expiryDate` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:350: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:351: #### `Education`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:352: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:353: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:354: | `institution` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:355: | `degree` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:356: | `period` | `string` | optional | 예: `"2010-2016"` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:357: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:358: #### `CareerItem`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:359: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:360: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:361: | `organization` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:362: | `role` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:363: | `period` | `string` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:364: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:365: #### `Publication`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:366: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:367: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:368: | `title` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:369: | `venue` | `string` | optional | 학회지·매체 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:370: | `year` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:371: | `url` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:372: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:466: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:467: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:468: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:469: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:470: | `headline` | `string` | ✅ | 1~120자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:471: | `summary` | `string` | ✅ | 80~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:472: | `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:473: | `author` | `Ref<C-02>` | ✅ | 저자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:474: | `coAuthors` | `Ref<C-02>[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:475: | `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:476: | `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:477: | `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:478: | `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:479: | `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:480: | `datePublished` | `Date` | ✅ | 최초 발행일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:481: | `dateModified` | `Date` | ✅ | 최종 수정일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:482: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:483: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:485: | `tags` | `string[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:486: | `readingTimeMinutes` | `number` | optional | 자동 계산 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:487: | `wordCount` | `number` | optional | 자동 계산 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:488: | `coverImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:489: | `ogImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:490: | `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:762: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:763: **마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:764: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:765: #### 어드민 DB 원본 (풀데이터)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:766: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:767: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:768: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:769: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:770: | `instanceId` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:773: | `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:774: | `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:775: | `articleType` | `string` | optional | (Article인 경우) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:915: ### C-22. `ArticleCategory` — Article Pillar 분류
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:916: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:917: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:918: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:919: | `@id` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:920: | `name` | `string` | ✅ | 1~50자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:921: | `description` | `string` | optional | 80~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:922: | `pillar` | `string` | optional | 상위 Pillar |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:923: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:924: | `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:925: | `coverImageUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:926: | `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:927: | `displayOrder` | `number` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:928: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:929: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:931: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:933: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:935: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:936: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:937: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:938: | `@id` | `Slug` | ✅ | 3~99자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:939: | `instanceId` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:940: | `title` | `string` | ✅ | 학술 논문 제목 (1~300자) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:941: | `authors` | `string[]` | ✅ | 저자 이름 리스트 (min 1) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:942: | `journal` | `string` | optional | 학술지명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:943: | `publishedDate` | `Date` | ✅ | 학술지 게재일 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:944: | `doi` | `string` | optional | DOI · regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:945: | `pubmedId` | `string` | optional | PubMed ID · regex `^[0-9]{1,9}$` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:946: | `url` | `URL` | ✅ | 외부 dereferenceable URL |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:947: | `thumbnailUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:948: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:949: | `authorDoctorId` | `Ref<C-02>` | optional | 본 clinic doctor 가 저자일 때 (same-tenant composite FK) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:950: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:951: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** — 외부 인용 entity |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:952: | `publishedAt` | `Date` | conditional | status='published' 시 required |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:953: | `metadata` | `Record<string, unknown>` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:954: | `createdAt` / `updatedAt` | `Date` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:955: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:956: **검수 · 위험도 · Schema**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:957: - CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:958: - RISK_LEVELS § 2: Low fixed
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:960: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:962: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:964: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:965: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:966: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:967: | `@id` | `Slug` | ✅ | 3~99자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:968: | `instanceId` | `Slug` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:969: | `title` | `string` | ✅ | 영상/방송 제목 (1~300자) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:970: | `channelName` | `string` | ✅ | 방송사/유튜브 채널명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:971: | `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:972: | `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:973: | `durationSeconds` | `number` | optional | JSON-LD `duration: PT<seconds>S` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:974: | `url` | `URL` | ✅ | 외부 URL |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:975: | `thumbnailUrl` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:976: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:977: | `authorDoctorId` | `Ref<C-02>` | optional | 출연 doctor (same-tenant composite FK) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:978: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:979: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:980: | `publishedAt` | `Date` | conditional | status='published' 시 required |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:981: | `metadata` | `Record<string, unknown>` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:982: | `createdAt` / `updatedAt` | `Date` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:983: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:984: **검수 · 위험도 · Schema**:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:985: - CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:986: - RISK_LEVELS § 2: Low fixed
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:987: - Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:988: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:989: ---
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:990: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:991: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:992: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:993: ### C-11. `MedicalConditionPage`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:994: 필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:995: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:997: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:998: EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:999: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1000: **풀명세 요약** (§ 4 안 풀명세 SoT 참조):
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1001: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1002: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1003: | `@id` | `Slug` | ✅ | 3~99자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1004: | `question` | `string` | ✅ | 10~200자 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1005: | `answer` | `string` (Markdown) | ✅ | 50~2000자. public HTML render = `renderMarkdownToHtml` · JSON-LD `Answer.text` = `renderMarkdownToPlainText` |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1006: | `displayOrder` | `number` | ✅ | 어드민 입력 순서 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1008: | `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1009: | `relatedConditionId` | `Ref<C-11>` | optional | C-11 합류 후 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1010: | `authorDoctorId` | `Ref<C-02>` | optional | 답변 doctor |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1011: | `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1012: | `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1013: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1015: **검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1118:    ├─ embeddedMedia → EmbeddedMedia[]
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1119:    └─ pageRiskLevel → RiskLevel
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1120: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1121: ComplianceRecord (C-10)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1122:    ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1123:    └─ pageRiskLevel → RiskLevel
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1124: ```

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\PAGE_TYPES.md'; "'$lines=Get-Content $p; for($i=627;$i -le 644;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\PUBLIC_SITE_RENDER_PLAN.md'; "'$lines=Get-Content $p; for($i=665;$i -le 668;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\M0_BUILD_EXPORT_PLAN.md'; "'$lines=Get-Content $p; for($i=67;$i -le 81;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 680ms:
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:665: ### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:666: 
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667: - `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
C:\Users\assag\solution\website-exposure\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:668: - `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.

 succeeded in 679ms:
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:67: ### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:68: 
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:69: EAT_CONTENT_PLAN v0.x acceptance commit 안 cascade — apps/worker 의 build/export 시점에 다음 4 entity Git 출력:
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:70: 
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:71: | Entity | DB source (마이그레이션) | Git output | 비고 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:72: |---|---|---|---|
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:73: | `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:74: | `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:75: | `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:76: | `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:77: | Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:78: | `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:79: 
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:80: PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
C:\Users\assag\solution\website-exposure\docs\decisions\M0_BUILD_EXPORT_PLAN.md:81: 

 succeeded in 697ms:
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:627: ## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:628: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:629: | 순서 | 페이지 타입 | 비고 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:630: |---|---|---|
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:631: | 1 | P-001 Home | 메인 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:632: | 2 | P-002 About | ClinicProfile 노출 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:633: | 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:634: | 4 | P-004 Doctor Profile | 1개 이상 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:635: | 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:636: | 6 | P-006 Treatment Detail | 1개 이상 |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:637: | 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:638: | 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:639: | **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:640: | (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:641: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:642: **M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:643: 
C:\Users\assag\solution\website-exposure\docs\core\PAGE_TYPES.md:644: **M0 미합류 합류 우선순위**:

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\DATA_MODEL.md -Pattern '"'^## 4|''^## 5|''^### C-12|''^### C-16|''^### C-21|''^### C-22|''^### C-24|''^### C-25'"' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\DATA_MODEL.md -Pattern 'v0\\.25|EAT_CONTENT|EC-CASCADE|v0\\.24|변경 이력' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 705ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:3: > **상태**: Draft v0.24
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:4: > **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:31: ### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:998: EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1053: | `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1160: ## 9. 변경 이력
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:1181: | 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |

 succeeded in 719ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:213: ## 4. 데이터 계약 풀명세 (M0 핵심)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:846: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:880: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:915: ### C-22. `ArticleCategory` — Article Pillar 분류
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:991: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\DATA_MODEL.md -Pattern '#### "'`MediaItem`|MediaItem'"' | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 646ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:238: | `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:298: #### `MediaItem`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:332: | `media` | `MediaItem[]` | optional | |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\DATA_MODEL.md'; "'$lines=Get-Content $p; for($i=292;$i -le 304;$i++){ '"'{0}:{1}: {2}' -f (Resolve-Path "'$p),$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 620ms:
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:292: | `youtube` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:293: | `kakao` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:294: | `facebook` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:295: | `linkedin` | `URL` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:296: | `others` | `{label: string, url: URL}[]` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:297: 
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:298: #### `MediaItem`
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:299: | 필드 | 타입 | required | 설명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:300: |---|---|:---:|---|
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:301: | `outlet` | `string` | ✅ | 매체명 |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:302: | `title` | `string` | ✅ | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:303: | `date` | `Date` | optional | |
C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md:304: | `url` | `URL` | optional | |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path ..\\..\\docs\\core\\SCHEMA_MAPPING.md -Pattern '### P-011|FAQPage|Question|Answer' | Select-Object -First 20 | ForEach-Object { '{0}:{1}: {2}' -f "'$_.Path,$_.LineNumber,$_.Line.Trim() }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 594ms:
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:20: - 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:125: | `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:150: | `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:151: | `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:188: - `FAQPage` (Question/Answer) — FAQ 리치 결과
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:227: | `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:262: | `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:484: 6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:508: **FAQPage** (해당 시):
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:512: "@type": "FAQPage",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:515: "@type": "Question",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:516: "name": "{faq.question}",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:517: "acceptedAnswer": {
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:518: "@type": "Answer",
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:519: "text": "{faq.answer (Markdown → 평문)}"
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:545: 6. (FAQ) `FAQPage` — **[풀]** (Conditional)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:615: 8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:665: ### P-011. FAQ
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:670: 3. `FAQPage` (Question/Answer) — **[풀]**
C:\Users\assag\solution\website-exposure\docs\core\SCHEMA_MAPPING.md:674: **FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.

codex
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=2 major=3 minor=1 (총 6)
- closeableAfterPatch: false
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8 (4+4+0) → cycle3=6

## cycle 2 patch 검증
- ECP-23: PARTIAL — DATA_MODEL 인벤토리 25개와 C-10 enum +2는 반영됨 ([DATA_MODEL.md:31](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:31), [DATA_MODEL.md:771](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:771)). 다만 C-12가 여전히 `## 5. M0 외 계약` 아래 있고, 관계 다이어그램이 `C-01~C-22`로 stale.
- ECP-24: PASS — manifest 16 entry 존재, `dependsOn`은 모두 이전 `creates` 안에 있음 ([manifest.ts:128](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:128), [manifest.ts:178](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:178)).
- ECP-25: FAIL — PAGE_TYPES § 1.1은 P-011 M0 ✅이나 ([PAGE_TYPES.md:46](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:46)), § 6 표에는 P-011 row가 없음 ([PAGE_TYPES.md:631](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:631)-[640](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:640)).
- ECP-26: PARTIAL — EAT plan 헤더는 Article JOIN을 code v1.0으로 분리했지만 ([EAT_CONTENT_PLAN.md:7](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:7)), PSR/M0_BUILD_EXPORT 쪽에는 acceptance commit 합류로 남아 있음.
- ECP-27: PARTIAL — SCHEMA_MAPPING § 2 카탈로그는 ScholarlyArticle/VideoObject/FAQPage 반영됨 ([SCHEMA_MAPPING.md:150](C:/Users/assag/solution/website-exposure/docs/core/SCHEMA_MAPPING.md:150)-[155](C:/Users/assag/solution/website-exposure/docs/core/SCHEMA_MAPPING.md:155)); DATA_MODEL 잔여 stale 때문에 완전 PASS는 아님.
- ECP-28: PASS — CONTENT_STANDARDS § 7.1.1.2 표가 추가됨 ([CONTENT_STANDARDS.md:416](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:416), [CONTENT_STANDARDS.md:422](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:422)-[426](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:426)).
- ECP-29: PASS — FAQ Q/A RiskInference 적용 marker와 DATA_MODEL FAQ riskLevel 설명이 반영됨 ([CONTENT_STANDARDS.md:424](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:424)-[425](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:425), [DATA_MODEL.md:1012](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1012)).
- ECP-30: PASS — manifest D0014 entry는 D0011 role + 4 신규 table 의존으로 정합 ([manifest.ts:168](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:168)-[184](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:184)).

## new findings (ECP-31+)

### ECP-31 — blocking — PAGE_TYPES § 6의 P-011 M0 합류가 표 본문에 누락
[PAGE_TYPES.md:627](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:627)는 “11개 페이지”라고 선언하지만, 실제 § 6 표는 P-001~P-006, P-012, P-014, P-013, P-010 샘플만 있고 P-011 FAQ row가 없습니다 ([PAGE_TYPES.md:631](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:631)-[640](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:640)). cycle 2의 ECP-25 핵심 패치가 아직 미완입니다.

### ECP-32 — blocking — plan acceptance / code v1.0 분리 marker가 cascade 문서에서 재오염
EAT plan은 docs-only acceptance와 code v1.0을 분리합니다 ([EAT_CONTENT_PLAN.md:6](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:6)-[7](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:7)). 그런데 PUBLIC_SITE_RENDER은 FAQ public page, C0012, Article detail SQL JOIN을 “EAT acceptance commit 안 합류”처럼 적고 있습니다 ([PUBLIC_SITE_RENDER_PLAN.md:667](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:667)-[668](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:668)). M0_BUILD_EXPORT도 “SSR 컴포넌트는 본 EAT acceptance commit 안 함께 합류”라고 해서 같은 충돌이 있습니다 ([M0_BUILD_EXPORT_PLAN.md:80](C:/Users/assag/solution/website-exposure/docs/decisions/M0_BUILD_EXPORT_PLAN.md:80)).

### ECP-33 — major — DATA_MODEL C-12 FAQ가 아직 “M0 외 계약” 섹션에 있음
EAT plan과 변경 이력은 DATA_MODEL § 4 C-12 풀명세 합류를 요구하지만, 실제 C-12는 `## 5. M0 외 계약 — 간략 명세` 아래에 있습니다 ([DATA_MODEL.md:991](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:991), [DATA_MODEL.md:996](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:996)). 본문도 “§ 4 본문 참조”라고 하나 실제 위치와 불일치합니다.

### ECP-34 — major — C-24/C-25 도입 후 DoctorProfile의 legacy embedded 타입이 stale
DoctorProfile은 여전히 `publications: Publication[]`, `media: MediaItem[]`를 직접 포함합니다 ([DATA_MODEL.md:331](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:331)-[332](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:332)). 동시에 `Publication` 하위 타입은 `title/venue/year/url`만 가진 legacy shape입니다 ([DATA_MODEL.md:365](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:365)-[371](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:371)), 새 C-24 `Publication` 풀명세와 이름이 충돌합니다 ([DATA_MODEL.md:932](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:932)-[951](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:951)). C-25도 `MediaItem` legacy shape와 역할이 겹칩니다 ([DATA_MODEL.md:298](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:298)-[304](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:304), [DATA_MODEL.md:961](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:961)-[979](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:979)).

### ECP-35 — major — DATA_MODEL 관계 다이어그램의 ComplianceRecord scope가 C-24/C-25를 빠뜨림
C-10 enum에는 `Publication`, `MediaAppearance`가 추가됐지만 ([DATA_MODEL.md:771](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:771)), 관계 다이어그램은 `contentRef → 발행 콘텐츠 (C-01~C-22)`로 남아 있습니다 ([DATA_MODEL.md:1121](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1121)-[1123](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1123)). C-24/C-25 발행 게이트 대상 여부가 섹션 간 불일치합니다.

### ECP-36 — minor — DATA_MODEL header/change history가 EAT cascade를 추적하지 않음
DATA_MODEL 본문에는 EC-CASCADE-01 patch가 들어갔지만 헤더는 여전히 Draft v0.24 / SPIKE2-03 설명입니다 ([DATA_MODEL.md:3](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:3)-[4](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:4)), 변경 이력도 v0.24에서 끝납니다 ([DATA_MODEL.md:1181](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1181)). acceptance 감사 추적성이 떨어집니다.

## cascade marker (EC-CASCADE-01~09) 점검
- EC-CASCADE-01: PARTIAL — 인벤토리/C-10/C-22/C-24/C-25는 반영, C-12 위치·legacy 타입·관계 다이어그램 stale.
- EC-CASCADE-02: PASS — FAQPage/Question/Answer, ScholarlyArticle, VideoObject 카탈로그 반영.
- EC-CASCADE-03: PASS — CONTENT_STANDARDS 예외 표 반영.
- EC-CASCADE-04: PARTIAL — 4 entity 변환 표는 있으나 line 80이 code v1.0 분리와 충돌.
- EC-CASCADE-05: PASS(spec) — D0014 manifest 의존성 정합. 실제 SQL은 code cycle 범위.
- EC-CASCADE-06: PASS — validateManifest 기준 dependsOn 모두 이전 creates에 존재.
- EC-CASCADE-07: PARTIAL — PSR-DEFER-11/15 marker는 있으나 code acceptance 표현이 섞임.
- EC-CASCADE-08: FAIL — PAGE_TYPES § 1.1은 PASS, § 6 표가 P-011 누락.
- EC-CASCADE-09: PASS — ARCH § 3.11 gate #1은 11페이지 + FAQ 반영.
tokens used
155,263
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=2 major=3 minor=1 (총 6)
- closeableAfterPatch: false
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8 (4+4+0) → cycle3=6

## cycle 2 patch 검증
- ECP-23: PARTIAL — DATA_MODEL 인벤토리 25개와 C-10 enum +2는 반영됨 ([DATA_MODEL.md:31](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:31), [DATA_MODEL.md:771](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:771)). 다만 C-12가 여전히 `## 5. M0 외 계약` 아래 있고, 관계 다이어그램이 `C-01~C-22`로 stale.
- ECP-24: PASS — manifest 16 entry 존재, `dependsOn`은 모두 이전 `creates` 안에 있음 ([manifest.ts:128](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:128), [manifest.ts:178](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:178)).
- ECP-25: FAIL — PAGE_TYPES § 1.1은 P-011 M0 ✅이나 ([PAGE_TYPES.md:46](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:46)), § 6 표에는 P-011 row가 없음 ([PAGE_TYPES.md:631](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:631)-[640](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:640)).
- ECP-26: PARTIAL — EAT plan 헤더는 Article JOIN을 code v1.0으로 분리했지만 ([EAT_CONTENT_PLAN.md:7](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:7)), PSR/M0_BUILD_EXPORT 쪽에는 acceptance commit 합류로 남아 있음.
- ECP-27: PARTIAL — SCHEMA_MAPPING § 2 카탈로그는 ScholarlyArticle/VideoObject/FAQPage 반영됨 ([SCHEMA_MAPPING.md:150](C:/Users/assag/solution/website-exposure/docs/core/SCHEMA_MAPPING.md:150)-[155](C:/Users/assag/solution/website-exposure/docs/core/SCHEMA_MAPPING.md:155)); DATA_MODEL 잔여 stale 때문에 완전 PASS는 아님.
- ECP-28: PASS — CONTENT_STANDARDS § 7.1.1.2 표가 추가됨 ([CONTENT_STANDARDS.md:416](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:416), [CONTENT_STANDARDS.md:422](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:422)-[426](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:426)).
- ECP-29: PASS — FAQ Q/A RiskInference 적용 marker와 DATA_MODEL FAQ riskLevel 설명이 반영됨 ([CONTENT_STANDARDS.md:424](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:424)-[425](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:425), [DATA_MODEL.md:1012](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1012)).
- ECP-30: PASS — manifest D0014 entry는 D0011 role + 4 신규 table 의존으로 정합 ([manifest.ts:168](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:168)-[184](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:184)).

## new findings (ECP-31+)

### ECP-31 — blocking — PAGE_TYPES § 6의 P-011 M0 합류가 표 본문에 누락
[PAGE_TYPES.md:627](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:627)는 “11개 페이지”라고 선언하지만, 실제 § 6 표는 P-001~P-006, P-012, P-014, P-013, P-010 샘플만 있고 P-011 FAQ row가 없습니다 ([PAGE_TYPES.md:631](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:631)-[640](C:/Users/assag/solution/website-exposure/docs/core/PAGE_TYPES.md:640)). cycle 2의 ECP-25 핵심 패치가 아직 미완입니다.

### ECP-32 — blocking — plan acceptance / code v1.0 분리 marker가 cascade 문서에서 재오염
EAT plan은 docs-only acceptance와 code v1.0을 분리합니다 ([EAT_CONTENT_PLAN.md:6](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:6)-[7](C:/Users/assag/solution/website-exposure/docs/decisions/EAT_CONTENT_PLAN.md:7)). 그런데 PUBLIC_SITE_RENDER은 FAQ public page, C0012, Article detail SQL JOIN을 “EAT acceptance commit 안 합류”처럼 적고 있습니다 ([PUBLIC_SITE_RENDER_PLAN.md:667](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:667)-[668](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:668)). M0_BUILD_EXPORT도 “SSR 컴포넌트는 본 EAT acceptance commit 안 함께 합류”라고 해서 같은 충돌이 있습니다 ([M0_BUILD_EXPORT_PLAN.md:80](C:/Users/assag/solution/website-exposure/docs/decisions/M0_BUILD_EXPORT_PLAN.md:80)).

### ECP-33 — major — DATA_MODEL C-12 FAQ가 아직 “M0 외 계약” 섹션에 있음
EAT plan과 변경 이력은 DATA_MODEL § 4 C-12 풀명세 합류를 요구하지만, 실제 C-12는 `## 5. M0 외 계약 — 간략 명세` 아래에 있습니다 ([DATA_MODEL.md:991](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:991), [DATA_MODEL.md:996](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:996)). 본문도 “§ 4 본문 참조”라고 하나 실제 위치와 불일치합니다.

### ECP-34 — major — C-24/C-25 도입 후 DoctorProfile의 legacy embedded 타입이 stale
DoctorProfile은 여전히 `publications: Publication[]`, `media: MediaItem[]`를 직접 포함합니다 ([DATA_MODEL.md:331](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:331)-[332](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:332)). 동시에 `Publication` 하위 타입은 `title/venue/year/url`만 가진 legacy shape입니다 ([DATA_MODEL.md:365](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:365)-[371](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:371)), 새 C-24 `Publication` 풀명세와 이름이 충돌합니다 ([DATA_MODEL.md:932](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:932)-[951](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:951)). C-25도 `MediaItem` legacy shape와 역할이 겹칩니다 ([DATA_MODEL.md:298](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:298)-[304](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:304), [DATA_MODEL.md:961](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:961)-[979](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:979)).

### ECP-35 — major — DATA_MODEL 관계 다이어그램의 ComplianceRecord scope가 C-24/C-25를 빠뜨림
C-10 enum에는 `Publication`, `MediaAppearance`가 추가됐지만 ([DATA_MODEL.md:771](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:771)), 관계 다이어그램은 `contentRef → 발행 콘텐츠 (C-01~C-22)`로 남아 있습니다 ([DATA_MODEL.md:1121](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1121)-[1123](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1123)). C-24/C-25 발행 게이트 대상 여부가 섹션 간 불일치합니다.

### ECP-36 — minor — DATA_MODEL header/change history가 EAT cascade를 추적하지 않음
DATA_MODEL 본문에는 EC-CASCADE-01 patch가 들어갔지만 헤더는 여전히 Draft v0.24 / SPIKE2-03 설명입니다 ([DATA_MODEL.md:3](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:3)-[4](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:4)), 변경 이력도 v0.24에서 끝납니다 ([DATA_MODEL.md:1181](C:/Users/assag/solution/website-exposure/docs/core/DATA_MODEL.md:1181)). acceptance 감사 추적성이 떨어집니다.

## cascade marker (EC-CASCADE-01~09) 점검
- EC-CASCADE-01: PARTIAL — 인벤토리/C-10/C-22/C-24/C-25는 반영, C-12 위치·legacy 타입·관계 다이어그램 stale.
- EC-CASCADE-02: PASS — FAQPage/Question/Answer, ScholarlyArticle, VideoObject 카탈로그 반영.
- EC-CASCADE-03: PASS — CONTENT_STANDARDS 예외 표 반영.
- EC-CASCADE-04: PARTIAL — 4 entity 변환 표는 있으나 line 80이 code v1.0 분리와 충돌.
- EC-CASCADE-05: PASS(spec) — D0014 manifest 의존성 정합. 실제 SQL은 code cycle 범위.
- EC-CASCADE-06: PASS — validateManifest 기준 dependsOn 모두 이전 creates에 존재.
- EC-CASCADE-07: PARTIAL — PSR-DEFER-11/15 marker는 있으나 code acceptance 표현이 섞임.
- EC-CASCADE-08: FAIL — PAGE_TYPES § 1.1은 PASS, § 6 표가 P-011 누락.
- EC-CASCADE-09: PASS — ARCH § 3.11 gate #1은 11페이지 + FAQ 반영.
