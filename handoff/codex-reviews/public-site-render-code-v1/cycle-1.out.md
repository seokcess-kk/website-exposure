Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e395f-d3a7-7c53-9155-155eb0f0a2bf
--------
user
You are reviewing the **code implementation** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 (acceptance · 5 cycle · 31 findings 전건 처리). This is **cycle 1** of the code review. Produce a strict, broad critique on whether the code faithfully realizes every plan decision (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) and is correct/secure/atomic/accessible.

## SoT to read

1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 — plan SoT
2. `docs/core/PAGE_TYPES.md` — 10 페이지 minimal (P-001·002·003·004·005·006·010·012·013·014)
3. `docs/core/SCHEMA_MAPPING.md` § 2.5 + § 3 — JSON-LD graph SoT
4. `docs/core/SEARCH_STANDARDIZATION.md` § 3.3 + § 4.3 + § 2.1 — robots/sitemap/metadata SoT
5. `docs/core/DESIGN_TOKENS.md` v1.0 § 3.2 semantic 22
6. `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.1 — LegalDocument 면제
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument DB CHECK · businessHours CT-02
8. `docs/admin/ARCHITECTURE.md` § 3.12 — apps/web route group 구조

## Code under review

### PSR-CASCADE-01b (admin URL `/admin` prefix 격상)
- `apps/web/src/app/(admin)/admin/[instanceSlug]/...` 디렉토리 이동
- `apps/web/src/app/page.tsx` root redirect `/admin/<firstSlug>`
- `apps/web/src/app/sign-in/consume/route.ts` redirect `/admin/<slug>`
- 4 actions.ts (clinic-profile, doctors, treatments, articles) revalidatePath/redirect `/admin/...`
- 10 admin page.tsx 안 Link href `/admin/<slug>/...`

### Phase A 기반
- `packages/db/migrations/D0011_public_reader.sql` — app_public_reader role + 7 policy
- `apps/web/src/lib/env.ts` — WEB_PUBLIC_DATABASE_URL
- `apps/web/.env.example` — WEB_PUBLIC_DATABASE_URL 항목
- `apps/web/src/lib/public-db.ts` — postgres singleton
- `apps/web/src/lib/public-tenant.ts` — withPublicTenantTransaction helper
- `apps/web/src/lib/db-projection.ts` — DB row → contract projection (TreatmentPage.title→name · Article.title→headline)
- `apps/web/src/lib/site-initial.ts` — layout-level clinic/location loader
- `apps/web/src/lib/markdown.ts` — sanitize-html SSR
- `apps/web/src/lib/site-url.ts` — request-aware base URL helper
- `apps/web/src/lib/site-metadata.ts` — Next metadata 공통 helper
- `apps/web/src/styles/globals.css` — DESIGN_TOKENS § 3.2 semantic 22 CSS vars (light + dark)
- `apps/web/tailwind.config.ts` — semantic 22 alias
- `apps/web/src/app/layout.tsx` — root layout bg-canvas/text-fg-default
- `apps/web/package.json` — sanitize-html 의존성
- `packages/migrations-runner/src/manifest.ts` — D0011 10단계

### Phase B 컴포넌트
- `apps/web/src/components/site/SiteHeader.tsx`
- `apps/web/src/components/site/SiteFooter.tsx` — 법적 페이지 링크 v0.1 숨김
- `apps/web/src/components/site/Breadcrumb.tsx`
- `apps/web/src/components/site/Hero.tsx`
- `apps/web/src/components/site/DoctorCard.tsx`
- `apps/web/src/components/site/TreatmentCard.tsx`
- `apps/web/src/components/site/ArticleBody.tsx`
- `apps/web/src/components/site/BusinessHoursTable.tsx`
- `apps/web/src/components/site/ReservationChannels.tsx`

### Phase B 페이지 (10)
- `apps/web/src/app/(site)/[instanceSlug]/layout.tsx` (fragment only)
- `apps/web/src/app/(site)/[instanceSlug]/page.tsx` (P-001 Home)
- `apps/web/src/app/(site)/[instanceSlug]/about/page.tsx` (P-002)
- `apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx` (P-003)
- `apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx` (P-004)
- `apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx` (P-005)
- `apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx` (P-006)
- `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` (P-010 1샘플)
- `apps/web/src/app/(site)/[instanceSlug]/contact/page.tsx` (P-012)
- `apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx` (P-013 · v0.1 noindex)
- `apps/web/src/app/(site)/[instanceSlug]/locations/[slug]/page.tsx` (P-014)
- `apps/web/src/app/(site)/[instanceSlug]/not-found.tsx`

### Phase C SEO
- `apps/web/src/lib/json-ld/types.ts`
- `apps/web/src/lib/json-ld/entities.ts` — Organization · MedicalClinic · Physician · MedicalProcedure · Article · WebPage · WebSite · BreadcrumbList · ItemList · ContactPoint
- `apps/web/src/lib/json-ld/builders.ts` — 페이지 타입 별 graph builder (homeGraph · aboutGraph · ...)
- `apps/web/src/lib/json-ld/JsonLdScript.tsx`
- `apps/web/src/lib/json-ld/__tests__/validate.ts` — 자체 rule checker
- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — per-instance sitemap
- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — disallowTraining starter

## What to check (cycle 1)

### Plan SoT 합치
- PSR-ROUTE: route group 구조 (`(admin)/admin/[instanceSlug]` + `(site)/[instanceSlug]`) 정합 · path 충돌 없음
- PSR-DATA: D0011 안 instance lookup + per-table policy 7개 (instance + 6 content) · withPublicTenantTransaction 의 `SET LOCAL` 흐름 · TreatmentPage/Article RLS published 게이트
- PSR-COMP: layout fragment only · DB → contract projection · sanitize-html · semantic 22 Tailwind alias · light/dark CSS vars
- PSR-SEO: themeColor 2값 + og:type 매핑 + sitemap changefreq/priority + robots disallowTraining + JSON-LD graph entity 풀/참조 (SCHEMA_MAPPING § 2.5)
- PSR-CASCADE-01b: admin URL `/admin` prefix · revalidatePath 6 곳 · sign-in/consume redirect target · seed.ts

### 정합성 / 원자성
- withPublicTenantTransaction 의 `set_config(... , true)` transaction-scoped 정합
- sitemap.xml route handler 안 published row 정확 SELECT
- robots.txt route handler — line-by-line SoT 정합 (SEARCH_STANDARDIZATION § 3.3)
- JSON-LD graph 의 entity @id 유일성 + cross-reference 무결성

### 보안 / RLS
- D0011 안 per-table policy USING `instance_id` 정합 (모든 6 entity)
- LegalDocument RLS published 만 SELECT (DB CHECK draft 만 허용 → 자동 404)
- sanitize-html 의 외부 링크 rel="nofollow noopener noreferrer" 자동
- XSS payload escape

### 데이터 모델
- TreatmentPage.title → contract C-03 name 변환 (db-projection.ts)
- Article.title → contract C-04 headline 변환
- LocationProfile.metadata.businessHours CT-02 SoT 파싱

### a11y / SEO
- Breadcrumb `aria-label="breadcrumb"`
- BusinessHoursTable `<th scope>`
- SiteHeader nav `aria-label`
- canonical URL · OpenGraph · Twitter · robots · themeColor
- inLanguage CreativeWork only (Article/WebPage 만, Organization/MedicalClinic 미명시)

### TypeScript / 코드 품질
- unknown narrowing (parsePrimaryCtas · parseBusinessHours)
- generateMetadata 의 `Promise<Metadata>` return + null safety
- siteBaseUrl helper 의 host/proto resolution
- error 처리 (notFound · 빈 데이터)
- revalidate · ISR 정합

### docs cascade
- ARCHITECTURE.md § 3.12 (PSR-CASCADE-01a)
- SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표
- M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표

### 시나리오 (PLAN § 7 1~23)
- 가능한 한 scenario 별 통과 여부 추론 (테스트 코드 없음 — 코드 베이스로 추론)

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **PSRC-01**: <짧은 제목>
  - 위치: <file>:<line>
  - 근거(plan SoT): PSR-... §...
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
```

가능한 한 광범위하게 보고, 파일을 line 단위로 인용하라. 한국어로 응답.

codex
검토 범위가 넓어서 먼저 SoT 문서의 해당 절과 구현 파일의 실제 라인 위치를 잡겠습니다. 이후 발견사항은 “계획 불일치/보안/정합성/접근성” 기준으로 severity를 나눠 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-001|P-002|P-003|P-004|P-005|P-006|P-010|P-012|P-013|P-014|minimal|LegalDocument" docs/core/PAGE_TYPES.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.3|4\\.3|2\\.1|robots|sitemap|metadata|themeColor|changefreq|priority|disallow\" docs/core/SEARCH_STANDARDIZATION.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-|CASCADE|Phase|themeColor|sitemap|robots|JSON-LD|revalidatePath|seed|scenario|Scenario|§ 7|PUBLIC_SITE_RENDER" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"2\\.5|## 3|Organization|MedicalClinic|Physician|MedicalProcedure|Article|WebPage|WebSite|BreadcrumbList|ItemList|ContactPoint|inLanguage|path\" docs/core/SCHEMA_MAPPING.md" in C:\Users\assag\solution\website-exposure
 succeeded in 647ms:
3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
9:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
11:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
15:- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
17:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
25:  - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 — cycle1 PSR-02 patch 후 `(admin)/admin/[instanceSlug]/...` 로 prefix 격상)
30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
37:- M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰(JSON-LD·SEO meta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.
38:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
40:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정
45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
48:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
51:| JSON-LD 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEMA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA marker) |
52:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
53:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
54:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
55:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
57:| Markdown sanitizer SSR 정합 (cycle1 PSR-19·20 정정) | `sanitize-html` (SSR 호환) + 외부 링크 `rel="nofollow noopener noreferrer"` |
58:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
64:| static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
65:| 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
66:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
67:| CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
68:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
69:| 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
70:| 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
71:| draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
72:| 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
73:| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
75:| 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
76:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
77:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
78:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
82:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
88:│  └─ admin/                             -- cycle1 PSR-02 patch: `/admin` prefix 격상
92:│     ├─ layout.tsx                      -- fragment only (NO <html>/<body> · cycle1 PSR-03)
108:│     ├─ sitemap.xml/route.ts            -- per-instance sitemap
109:│     ├─ robots.txt/route.ts             -- per-instance robots
111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
119:- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
123:  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ...}` 안 `revalidatePath('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL code v1.1 cascade)
124:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` 의 `revalidatePath` 2 곳
127:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
128:- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.
132:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
137:-- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
144:-- cycle1 PSR-05 patch: instance slug resolve 전용 policy.
155:-- cycle1 PSR-15 patch: 6 content table 별 per-table policy 명시.
196:-- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
209:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
210:- (PSR-DATA-03) 모든 공개 page handler 가 `withPublicTenantTransaction({ instanceSlug })` 헬퍼 사용. 흐름:
215:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
216:- (PSR-DATA-05 · cycle1 PSR-21) env cascade:
219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
223:### 3.2 status filter — cycle1 PSR-06·16 정정 (PSR-DATA-06)
236:**결정 (cycle1 PSR-06)**:
237:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
240:- 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
241:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
243:### 3.3 not-found · 빈 페이지 (PSR-DATA-08)
254:### 4.1 root layout 책임 분리 (PSR-COMP-01) — cycle1 PSR-03 정정 + cycle2 PSR-28 정정
257:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
276:- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
277:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
278:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
280:### 4.2 DB → Core contract field mapping (PSR-COMP-05) — cycle1 PSR-12 정정
305:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
310:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
311:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
318:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
319:- (PSR-COMP-07) `apps/web/src/lib/db-projection.ts` 신규 — entity 별 raw DB row → normalized projection 변환. JSON-LD 생성기 도 normalized projection 사용.
321:### 4.3 페이지별 컴포넌트 (PSR-COMP-08)
336:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
340:  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
346:### 4.5 디자인 토큰 통합 (PSR-COMP-10) — cycle1 PSR-13·14 정정
377:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
378:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
393:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
398:### 5.1 Next metadata API (PSR-SEO-01) — cycle1 PSR-10 정정
416:  robots: {
420:  themeColor: [
428:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
429:- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
431:- (PSR-SEO-05) title 패턴: `<page-specific> | <clinic.name>`. P-001 은 fallback `clinic.slogan ?? clinic.description`.
432:- (PSR-SEO-06) description: 페이지 entity 의 `description`/`summary` 우선. 부재 시 clinic.description fallback. 50~160자 강제.
434:### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)
436:- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
450:| P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
458:- M0 v1.0 합류 시 static sitemap.xml 도 export.
460:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
462:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
468:**결정 (v0.1 starter template)** — cycle2 PSR-22 정정 (SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로):
469:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
472:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
529:Sitemap: https://{domain}/sitemap.xml
532:> v0.1 단계 `{domain}` = `<host>/<instanceSlug>` path-based. M0 v1.0 도메인 매핑 합류 시 (PSR-DEFER-02) `<customDomain>` 으로 평면화. SEARCH_STANDARDIZATION § 3.3 footnote 의 `experimentalAiBots` flag 도 동일 cascade.
534:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
538:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
540:### 5.4 JSON-LD 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정
546:| 페이지 | graph entities (cycle1 PSR-07 정정) |
555:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
561:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
567:### 5.5 OpenGraph / Twitter (PSR-SEO-15)
570:- v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
571:- `og:type` 매핑 — § 5.1 PSR-SEO-03 SoT.
573:## 6. 환경·precondition (PSR-ENV-01) — cycle1 PSR-21 정정
583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
584:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
590:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
596:| 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
605:| 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
606:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
607:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
612:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
613:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
615:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
616:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `BrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |
617:| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
618:| 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
620:## 8. 작업 단위 (cycle1 PSR-21 cascade 분해)
633:| 10 | JSON-LD 생성기 (페이지 타입 별 graph builder · normalize projection 사용) | apps/web/src/lib/json-ld/* |
634:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
635:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
636:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
648:### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
650:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
651:- `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
652:- `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
653:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
654:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
655:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
657:### 9.2 M1 Phase Alpha 합류
659:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
660:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
661:- `PSR-DEFER-08`: draft preview token (어드민 외).
662:- `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
663:- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
667:- `PSR-DEFER-11(부분)`: FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD.
668:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.
672:- `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.
676:- `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 658ms:
20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
21:- 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
24:- **공통 entity별 페이지 출력 정책은 § 2.5가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)이 본 표를 따른다.
40:    { "@type": "Organization", "@id": "...", ... },
41:    { "@type": "MedicalClinic", "@id": "...", ... },
42:    { "@type": "BreadcrumbList", "itemListElement": [...] },
43:    { "@type": "Article", "@id": "...", ... }
56:| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
57:| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
58:| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
59:| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
60:| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
63:| `WebSite` | `https://{domain}/#website` | |
64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
72:| Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
74:| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
75:| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
76:| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
77:| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
78:| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
79:| `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
80:| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |
84:  - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
85:  - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
95:  "@type": "Article",
108:| 인스턴스 형태 | Organization | MedicalClinic |
110:| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
111:| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
115:**`Organization` vs `MedicalClinic`의 책임 분리**:
116:- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
117:- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
119:### 1.5 `inLanguage`
121:**CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMeta.inLanguage를 따른다.
125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
139:| `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
140:| `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
141:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
142:| `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
143:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
144:| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
145:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
146:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
148:| `Article` | P-010 Article Detail | Article (C-04) |
149:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
152:| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
156:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
157:| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
161:| `ContactPoint` | 전화·이메일·CTA | (생성기 자동) |
162:| `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
163:| `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
177:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
188:- `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
189:- `BreadcrumbList` — 빵부스러기 노출
191:- `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
192:- `Person` / `Physician` — 의료진 카드 (제한적)
197:- `Organization` — 법인 identity
198:- `MedicalClinic` 본원·지점 — 의료기관 entity
199:- `Physician` — 의료진 entity (Rich Results는 제한적)
200:- `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
201:- `WebPage` — 페이지 entity
202:- `WebSite` — 사이트 entity + SearchAction (Home에서만 풀)
220:| `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
221:| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
222:| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
223:| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
225:| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
227:| `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
228:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
229:| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
237:| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
239:| `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
240:| `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
241:| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
243:### 2.5 공통 entity별 페이지 출력 정책 (단일 SoT)
249:- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
253:| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
254:| `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
255:| `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
258:| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
259:| `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
260:| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
261:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
267:## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)
274:1. `Organization` (ClinicProfile)
275:2. `MedicalClinic` (LocationProfile main) — 본원
276:3. `WebSite` (SearchAction 포함)
277:4. `WebPage` (Home의 본문 entity)
279:**Organization 필드 매핑**:
283:| `@type` | `"Organization"` |
295:| `memberOf` | `memberOf[]` → `Organization`(학회) |
296:| `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
299:| `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |
301:**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
305:| `@type` | `"MedicalClinic"` |
308:| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
317:**WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
321:  "@type": "WebSite",
326:  "inLanguage": "ko-KR"
342:**다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
344:**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
346:**BreadcrumbList**: Home에는 미적용.
353:1. `Organization` (법인 identity 풀필드)
354:2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
355:3. `BreadcrumbList`
356:4. `WebPage` (about page)
358:**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
360:**mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
362:- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
365:**BreadcrumbList**:
368:  "@type": "BreadcrumbList",
381:1. `Organization` — **[풀]**
382:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
383:3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
384:4. `BreadcrumbList` — **[풀]**
385:5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
389:  "@type": "ItemList",
396:        "@type": "Physician",
408:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
415:1. `Organization` — **[풀]**
416:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
417:3. `Physician` (DoctorProfile 풀필드) — **[풀]**
418:4. `BreadcrumbList` — **[풀]**
419:5. `WebPage` — **[풀]**, `isPartOf: #website`
421:**Physician 필드 매핑**:
425:| `@type` | `"Physician"` |
434:| `alumniOf` | `education[]` → `EducationalOrganization` |
436:| `affiliation` | `affiliations[]` → `Organization` |
448:1. `Organization` — **[풀]**
449:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
450:3. `WebPage` — **[풀]**, `isPartOf: #website`
451:4. `BreadcrumbList` — **[풀]**
452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
456:  "@type": "ItemList",
462:        "@type": "MedicalProcedure",
478:1. `Organization` — **[풀]**
479:2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
480:3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**
481:4. `BreadcrumbList` — **[풀]**
482:5. `WebPage` — **[풀]**, `isPartOf: #website`
485:**MedicalProcedure 필드 매핑**:
489:| `@type` | `"MedicalProcedure"` |
530:1. `Organization` — **[풀]**
531:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
532:3. `WebPage` — **[풀]**, `isPartOf: #website`
533:4. `BreadcrumbList` — **[풀]**
534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
539:1. `Organization` — **[풀]**
540:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
542:4. `BreadcrumbList` — **[풀]**
543:5. `WebPage` — **[풀]**, `isPartOf: #website`
555:| `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |
559:### P-009. Articles List
562:1. `Organization` — **[풀]**
563:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
564:3. `WebPage` — **[풀]**, `isPartOf: #website`
565:4. `BreadcrumbList` — **[풀]**
566:5. `ItemList` 또는 `Blog` — **[풀]**
568:`ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
571:  "@type": "ItemList",
577:        "@type": "Article",
579:        "headline": "{Article.headline}",
581:        "image": "{Article.coverImageUrl}",
582:        "datePublished": "{Article.datePublished}",
595:  "name": "{Articles List title}",
600:  "inLanguage": "ko-KR"
604:### P-010. Article Detail
607:1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
608:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
609:3. `Article` — **[풀]**
610:4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
611:5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
612:6. `BreadcrumbList` — **[풀]**
613:7. `WebPage` — **[풀]**, `isPartOf: #website`
617:**Article 필드 매핑**:
619:| Schema 필드 | 출처 (Article) |
621:| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
626:| `articleSection` | ArticleCategory.name |
630:| `editor` | `reviewedBy` (해당 시) → Physician @id |
632:| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
637:| `inLanguage` | `"ko-KR"` |
646:  "name": "{EmbeddedMedia.title 또는 Article.headline}",
647:  "description": "{EmbeddedMedia.caption 또는 Article.summary}",
648:  "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
649:  "uploadDate": "{Article.datePublished}",
654:  "inLanguage": "ko-KR"
662:**Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.
667:1. `Organization` — **[풀]**
668:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
670:4. `BreadcrumbList` — **[풀]**
671:5. `WebPage` — **[풀]**, `isPartOf: #website`
678:1. `Organization` — **[풀]**
679:2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
680:3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
681:4. `BreadcrumbList` — **[풀]**
682:5. `WebPage` — **[풀]**, `isPartOf: #website`
683:6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
690:    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
691:    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
692:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
693:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
694:    { "@type": "ItemList", "itemListElement": [...] }
701:각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
713:    "@type": "ContactPoint",
723:1. `Organization` — **[풀]**
724:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
725:3. `WebPage` — **[풀]**, `isPartOf: #website`
726:4. `BreadcrumbList` — **[풀]**
728:**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
733:1. `Organization` — **[풀]**
734:2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
737:3. `BreadcrumbList` — **[풀]**
738:4. `WebPage` — **[풀]**, `isPartOf: #website`
740:**MedicalClinic 필드 매핑 (지점 LocationProfile)**:
742:P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
747:| `parentOrganization` | 동일 |
750:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
757:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
761:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
765:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
768:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
772:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
773:`MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
776:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
784:| C-01 `ClinicProfile` | `Organization` | 브랜드·법인 identity. 위치·시간·연락은 LocationProfile로 위임 |
785:| C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
786:| C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
787:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
789:| C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
793:| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
799:| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
801:| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
802:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
803:| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
804:| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
805:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
811:| CT-03 `CTAConfig` | `ContactPoint` / `potentialAction` (ReserveAction·CommunicateAction) |
842:| `phone` | `ContactPoint{contactType: "reservation"·"customer service", telephone}` |
844:| `naver-talk`·`kakao-talk`·`kakao-channel` | `ContactPoint{contactType: "customer service", url}` 또는 `CommunicateAction` |
846:| `map` | `MedicalClinic.hasMap`: targetUrl |
848:| `sms`·`email` | `ContactPoint` |
864:  inLanguage: string;          // 기본 "ko-KR"
866:  mainLocation: LocationProfile;  // C-21 main — 전 페이지 공통 (Organization 외 본원 entity)
868:  breadcrumbItems: BreadcrumbItem[]; // (Home 제외) BreadcrumbList 생성용
885:| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
911:| **공통 일반 룰 (§ 2.5 정합)** | **§ 2.5에서 "풀"로 지정된 entity는 해당 페이지 graph에 풀필드 출력 필수**. 누락 시 빌드 실패. **선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증** (`FeatureModuleConfig`·`InstanceManifest`·라우트 설정 기준 — P-103·P-104·P-105는 Instance 결정, P-106은 Feature Module 기반 등 활성화 경로가 페이지별로 다를 수 있음) |
912:| 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **resolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |
913:| Home 제외 | `BreadcrumbList` |
914:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
915:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
916:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
918:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
956:| `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
957:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
968:| SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
973:| SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
975:| SM-08 | Article의 `contentSource: republished` 시 `isBasedOn` vs `citation` 사용 정책 | 후속 결정 |
984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
987:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
991:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |

 succeeded in 685ms:
4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
23:- M0 Slice: **9종 + Article 1샘플 = 10개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플).
24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
36:| P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
37:| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
38:| P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
39:| P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
40:| P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
41:| P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
45:| P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
47:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
48:| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
49:| P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
97:### P-001. Home
108:4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
120:### P-002. About (병원 소개)
150:### P-003. Doctors List
166:### P-004. Doctor Profile
194:### P-005. Treatments List
210:### P-006. Treatment Detail
279:**레이아웃 변형**: P-005 동일
305:**레이아웃 변형**: P-006 동일
328:### P-010. Article Detail
396:### P-012. Contact / Visit — Conversion Hub
408:5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
424:**주 데이터 계약**: `LegalDocument`
429:- 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
446:- 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
452:### P-014. Location / Branch Detail
496:**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
604:| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
606:| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
607:| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
608:| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
609:| P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
613:| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
615:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
631:| 1 | P-001 Home | 메인 |
632:| 2 | P-002 About | ClinicProfile 노출 |
633:| 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
634:| 4 | P-004 Doctor Profile | 1개 이상 |
635:| 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
636:| 6 | P-006 Treatment Detail | 1개 이상 |
637:| 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
638:| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
639:| **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
640:| (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
642:**M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
666:| PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
668:| PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
685:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
687:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
688:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
689:| 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
690:| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
691:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 683ms:
1:# Core — 검색 표준화 (메타·robots·sitemap·canonical·성능)
7:> **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
19:- Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
22:- sitemap.xml은 **InstanceManifest·콘텐츠 파일 트리**로부터 자동 생성. 모든 발행 페이지 포함, 미발행 드래프트 제외.
35:| robots.txt 자동 생성 | ✅ | |
36:| sitemap.xml 자동 생성 | ✅ | |
47:- **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
48:- **sitemap.xml**: 표준 sitemap XML 0.9 — 사이트 루트 (`/sitemap.xml`)
60:| robots 룰 변경 | MINOR (정책 변경은 운영 결정) |
68:### 2.1 페이지별 출력 메타 (단일 SoT)
79:| `<meta name="robots">` | **Allowed** (모든 페이지) | `PageMeta.robots` (기본 `"index, follow, max-snippet:-1, max-image-preview:large"`) |
123:> **의도적 예외**: P-006·P-008은 `og:type=article`이지만 `article:*` 부가 메타는 **제한 출력** — `article:modified_time`·`article:author`만 (P-010은 모든 부가 메타 출력). P-006/P-008은 `article:published_time`·`article:section` 미출력 (의료 정보 페이지에 공개 발행일·ArticleCategory 매핑 부자연스러움). § 2.1 표 참조.
127:**`PageMeta.robots` vs `PageMeta.noIndex` 우선순위 룰**:
128:- `noIndex: true`가 **항상 우선**. `robots` 필드의 `index`/`noindex` 지시어는 noIndex에 의해 자동 override됨
129:- 충돌 입력 (`noIndex: true` + `robots: "index, follow"`) 감지 시 **warning** + 빌드 시 noIndex 우선 적용
130:- `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)
147:| `noIndex: true` 페이지에서 `<meta name="robots" content="noindex, follow">` 누락 | fail | sitemap 제외와 함께 robots 메타도 출력 필수 |
151:## 3. robots.txt 표준
161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
170:> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
172:> - Google robots-meta (meta tag — noindex 등) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
181:| `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
182:| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
186:> **starter template**은 `disallowTraining` 제안 — 의료기관 사이트의 환자 후기·전후사진·브랜드 콘텐츠 학습 위험 회피 + 검색·답변 노출 유지.
188:### 3.3 정책별 출력 예시
190:#### `aiCrawlerPolicy: disallowTraining` (권장 기본)
193:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
250:Sitemap: https://{domain}/sitemap.xml
253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
259:#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
263:### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
270:| 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
271:| **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
274:### 3.4 인스턴스별 robots 오버라이드 — user-agent별 merge/replace
292:robotsOverrides:
295:    disallow: ["/reviews", "/pricing"]
305:> `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.
309:## 4. sitemap.xml 표준
313:빌드 시 다음 페이지를 sitemap에 포함:
324:### 4.2 sitemap.xml 형식
328:<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
332:    <changefreq>weekly</changefreq>
333:    <priority>1.0</priority>
338:    <changefreq>monthly</changefreq>
339:    <priority>0.8</priority>
345:### 4.3 페이지별 changefreq·priority 기본값
347:| 페이지 타입 | changefreq | priority |
372:### 4.5 sitemap 인덱스 (대규모 시)
374:- 단일 sitemap.xml의 URL 50,000개 또는 50MB 초과 시 sitemap index 형식 자동 분할
375:- M0 단일 클라이언트 인스턴스는 일반적으로 단일 sitemap.xml로 충분
495:  metadata?: Record<string, string>;   // 비식별 데이터만 — PII 금지
520:- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
537:| **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
539:| **content-gate** | 본문 표현 검수 | (본 문서는 메타·robots·sitemap 중심이라 content-gate 항목 적음. `CONTENT_STANDARDS.md`에서 다룸) |
554:| SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
556:| SS-03 | sitemap.xml 분할 임계 — 50,000 URL이 표준이나 운영 효율은 더 작게? | 인스턴스 규모 누적 후 결정 |
574:| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
581:| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
582:| 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |
583:| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
585:| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 P-006/P-008 OG `article:*` 제한 출력 주석 추가** — 표 오해 방지, (2) **§ 3.2 매트릭스 C 계열 컬럼명에 `(best-effort)` 명시** — 정책의 한계를 표 자체에 드러냄, (3) **§ 9 SS-01 구체화** — 분기 1회 재검증 주기는 결정. 재검증 책임자·업데이트 PR 흐름이 미정으로 명확화, (4) v0.10 → **v1.0 격상** — 사용자 피드백 "구현 가능한 명세 수준 도달·기능 구현을 막는 수준의 결함 없음" 채택. 다음 단계는 SchemaGenerator 일부 + rule checker + robots/sitemap generator 실제 구현 + 그 발견을 문서에 되먹이기 |

codex
문서상 핵심 기준은 확인했습니다. 이제 구현 쪽에서 라우트 구조, RLS SQL, 공개 DB helper, 페이지별 metadata/JSON-LD/sitemap/robots, 그리고 admin cascade 변경을 한 번에 훑어 라인 근거를 만들겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files apps/web/src/app apps/web/src/lib apps/web/src/components/site apps/web/src/styles apps/web | rg \"(page\\.tsx|route\\.ts|layout\\.tsx|actions\\.ts|public|projection|metadata|markdown|json-ld|globals\\.css|tailwind\\.config|package\\.json|env\\.ts|seed\\.ts)"'$"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"CREATE ROLE|app_public_reader|CREATE POLICY|ALTER TABLE|USING|status|published_at|legal|set_config|SET LOCAL|WEB_PUBLIC_DATABASE_URL|sanitize|nofollow|noopener|noreferrer|themeColor|openGraph|twitter|robots|canonical|revalidatePath|redirect\\(|/admin/|href=\\{|href=\\\"/admin|Sitemap|User-agent|Disallow|Allow|changefreq|priority|@id|inLanguage|MedicalClinic|Organization|WebSite|WebPage|BreadcrumbList|ItemList|ContactPoint|Article|Physician|MedicalProcedure\" apps/web/src packages/db/migrations/D0011_public_reader.sql packages/migrations-runner/src/manifest.ts apps/web/.env.example" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|\\(site\\)|/admin|route group|PUBLIC_SITE_RENDER\" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md docs/core/SCHEMA_MAPPING.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"semantic|color\\.surface|fg|canvas|brand|primary|22|--color|bg-canvas|text-fg\" docs/core/DESIGN_TOKENS.md apps/web/src/styles/globals.css apps/web/tailwind.config.ts apps/web/src/app/layout.tsx" in C:\Users\assag\solution\website-exposure
2026-05-18T04:37:48.377495Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … min|Sitemap|User-agent|Disallow|Allow|changefreq|priority|[36;1m@id[0m|inLangu …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                             ~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mExpressions are only allowed as the first element of a pipeline.[0m

 exited 1 in 598ms:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … min|Sitemap|User-agent|Disallow|Allow|changefreq|priority|[36;1m@id[0m|inLangu …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                             ~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mExpressions are only allowed as the first element of a pipeline.[0m

 succeeded in 688ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:57:| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:59:| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/admin/ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
docs/admin/ARCHITECTURE.md:284:| route group | URL prefix | 책임 | 진입 단계 |
docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
docs/admin/ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
docs/admin/ARCHITECTURE.md:289:**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
docs/admin/ARCHITECTURE.md:402:> 상세 필드는 `docs/admin/DATA_MODEL.md`.
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:

 succeeded in 712ms:
apps/web/src/app/layout.tsx:12:  // semantic 22 토큰 — `bg-canvas` (color.surface.background) · `text-fg-default` (color.text.primary).
apps/web/src/app/layout.tsx:15:      <body className="min-h-screen bg-canvas text-fg-default antialiased">{children}</body>
apps/web/src/styles/globals.css:6: * DESIGN_TOKENS v1.0 § 3.2 semantic 22 — light/dark 둘 다 출력
apps/web/src/styles/globals.css:15:  --color-surface-background: #f9fafb;   /* gray.50 */
apps/web/src/styles/globals.css:16:  --color-surface-elevated: #ffffff;      /* white */
apps/web/src/styles/globals.css:17:  --color-surface-subtle: #f3f4f6;        /* gray.100 */
apps/web/src/styles/globals.css:19:  --color-text-primary: #111827;          /* gray.900 */
apps/web/src/styles/globals.css:20:  --color-text-secondary: #4b5563;        /* gray.600 */
apps/web/src/styles/globals.css:21:  --color-text-disabled: #9ca3af;         /* gray.400 */
apps/web/src/styles/globals.css:22:  --color-text-inverse: #ffffff;          /* white */
apps/web/src/styles/globals.css:24:  --color-border-default: #e5e7eb;        /* gray.200 */
apps/web/src/styles/globals.css:25:  --color-border-subtle: #f3f4f6;         /* gray.100 */
apps/web/src/styles/globals.css:27:  --color-brand-primary: #2563eb;         /* blue.600 */
apps/web/src/styles/globals.css:28:  --color-brand-primary-hover: #1d4ed8;   /* blue.700 */
apps/web/src/styles/globals.css:29:  --color-brand-secondary: #374151;       /* gray.700 */
apps/web/src/styles/globals.css:31:  --color-status-success: #16a34a;        /* green.600 */
apps/web/src/styles/globals.css:32:  --color-status-success-subtle: #f0fdf4; /* green.50 */
apps/web/src/styles/globals.css:33:  --color-status-warning: #f59e0b;        /* amber.500 */
apps/web/src/styles/globals.css:34:  --color-status-warning-subtle: #fffbeb; /* amber.50 */
apps/web/src/styles/globals.css:35:  --color-status-error: #dc2626;          /* red.600 */
apps/web/src/styles/globals.css:36:  --color-status-error-subtle: #fef2f2;   /* red.50 */
apps/web/src/styles/globals.css:37:  --color-status-info: #3b82f6;           /* blue.500 */
apps/web/src/styles/globals.css:38:  --color-status-info-subtle: #eff6ff;    /* blue.50 */
apps/web/src/styles/globals.css:40:  --color-focus-ring: #3b82f6;            /* blue.500 */
apps/web/src/styles/globals.css:41:  --color-overlay-modal: rgba(0, 0, 0, 0.5);
apps/web/src/styles/globals.css:42:  --color-overlay-scrim: rgba(0, 0, 0, 0.3);
apps/web/src/styles/globals.css:48:  --color-surface-background: #111827;    /* gray.900 */
apps/web/src/styles/globals.css:49:  --color-surface-elevated: #1f2937;       /* gray.800 */
apps/web/src/styles/globals.css:50:  --color-surface-subtle: #1f2937;         /* gray.800 */
apps/web/src/styles/globals.css:52:  --color-text-primary: #f9fafb;           /* gray.50 */
apps/web/src/styles/globals.css:53:  --color-text-secondary: #d1d5db;         /* gray.300 */
apps/web/src/styles/globals.css:54:  --color-text-disabled: #6b7280;          /* gray.500 */
apps/web/src/styles/globals.css:55:  --color-text-inverse: #111827;           /* gray.900 */
apps/web/src/styles/globals.css:57:  --color-border-default: #374151;         /* gray.700 */
apps/web/src/styles/globals.css:58:  --color-border-subtle: #1f2937;          /* gray.800 */
apps/web/src/styles/globals.css:60:  --color-brand-primary: #60a5fa;          /* blue.400 */
apps/web/src/styles/globals.css:61:  --color-brand-primary-hover: #93c5fd;    /* blue.300 */
apps/web/src/styles/globals.css:62:  --color-brand-secondary: #d1d5db;        /* gray.300 */
apps/web/src/styles/globals.css:64:  --color-status-success: #4ade80;         /* green.400 */
apps/web/src/styles/globals.css:65:  --color-status-success-subtle: #14532d;  /* green.900 */
apps/web/src/styles/globals.css:66:  --color-status-warning: #fbbf24;         /* amber.400 */
apps/web/src/styles/globals.css:67:  --color-status-warning-subtle: #78350f;  /* amber.900 */
apps/web/src/styles/globals.css:68:  --color-status-error: #f87171;           /* red.400 */
apps/web/src/styles/globals.css:69:  --color-status-error-subtle: #7f1d1d;    /* red.900 */
apps/web/src/styles/globals.css:70:  --color-status-info: #93c5fd;            /* blue.300 */
apps/web/src/styles/globals.css:71:  --color-status-info-subtle: #1e3a8a;     /* blue.900 */
apps/web/src/styles/globals.css:73:  --color-focus-ring: #93c5fd;             /* blue.300 */
apps/web/src/styles/globals.css:74:  --color-overlay-modal: rgba(0, 0, 0, 0.7);
apps/web/src/styles/globals.css:75:  --color-overlay-scrim: rgba(0, 0, 0, 0.5);
apps/web/src/styles/globals.css:90:.prose-site a { color: var(--color-brand-primary); text-decoration: underline; }
apps/web/src/styles/globals.css:91:.prose-site a:hover { color: var(--color-brand-primary-hover); }
apps/web/src/styles/globals.css:93:.prose-site code { background: var(--color-surface-subtle); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
apps/web/src/styles/globals.css:94:.prose-site pre { background: var(--color-surface-subtle); padding: 0.75rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
apps/web/src/styles/globals.css:95:.prose-site blockquote { border-left: 4px solid var(--color-border-default); padding-left: 1rem; color: var(--color-text-secondary); margin: 1rem 0; }
apps/web/src/styles/globals.css:97:.prose-site th, .prose-site td { border: 1px solid var(--color-border-default); padding: 0.5rem; text-align: left; }
apps/web/src/styles/globals.css:98:.prose-site th { background: var(--color-surface-subtle); font-weight: 600; }
apps/web/tailwind.config.ts:2:// SoT: DESIGN_TOKENS v1.0 § 3.2 semantic 22 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.5 PSR-COMP-10·11·12
apps/web/tailwind.config.ts:3:// 22 semantic alias 가 round-trip 보장: Tailwind class ↔ semantic token ↔ CSS custom property (globals.css)
apps/web/tailwind.config.ts:14:        canvas: "var(--color-surface-background)",
apps/web/tailwind.config.ts:15:        surface: "var(--color-surface-background)",
apps/web/tailwind.config.ts:16:        elevated: "var(--color-surface-elevated)",
apps/web/tailwind.config.ts:17:        subtle: "var(--color-surface-subtle)",
apps/web/tailwind.config.ts:19:        // === Text (fg) ===
apps/web/tailwind.config.ts:20:        fg: {
apps/web/tailwind.config.ts:21:          DEFAULT: "var(--color-text-primary)",
apps/web/tailwind.config.ts:22:          default: "var(--color-text-primary)",
apps/web/tailwind.config.ts:23:          muted: "var(--color-text-secondary)",
apps/web/tailwind.config.ts:24:          disabled: "var(--color-text-disabled)",
apps/web/tailwind.config.ts:25:          inverse: "var(--color-text-inverse)",
apps/web/tailwind.config.ts:30:          DEFAULT: "var(--color-border-default)",
apps/web/tailwind.config.ts:31:          default: "var(--color-border-default)",
apps/web/tailwind.config.ts:32:          subtle: "var(--color-border-subtle)",
apps/web/tailwind.config.ts:36:        brand: {
apps/web/tailwind.config.ts:37:          DEFAULT: "var(--color-brand-primary)",
apps/web/tailwind.config.ts:38:          primary: "var(--color-brand-primary)",
apps/web/tailwind.config.ts:39:          "primary-hover": "var(--color-brand-primary-hover)",
apps/web/tailwind.config.ts:40:          secondary: "var(--color-brand-secondary)",
apps/web/tailwind.config.ts:45:          DEFAULT: "var(--color-status-success)",
apps/web/tailwind.config.ts:46:          subtle: "var(--color-status-success-subtle)",
apps/web/tailwind.config.ts:49:          DEFAULT: "var(--color-status-warning)",
apps/web/tailwind.config.ts:50:          subtle: "var(--color-status-warning-subtle)",
apps/web/tailwind.config.ts:53:          DEFAULT: "var(--color-status-error)",
apps/web/tailwind.config.ts:54:          subtle: "var(--color-status-error-subtle)",
apps/web/tailwind.config.ts:57:          DEFAULT: "var(--color-status-info)",
apps/web/tailwind.config.ts:58:          subtle: "var(--color-status-info-subtle)",
apps/web/tailwind.config.ts:61:        // === Focus ring (semantic) ===
apps/web/tailwind.config.ts:62:        focus: "var(--color-focus-ring)",
apps/web/tailwind.config.ts:64:        // === Overlay (semantic raw rgba — DESIGN_TOKENS § 3.2 overlay 예외 룰) ===
apps/web/tailwind.config.ts:66:          modal: "var(--color-overlay-modal)",
apps/web/tailwind.config.ts:67:          scrim: "var(--color-overlay-scrim)",
apps/web/tailwind.config.ts:72:        primary: {
apps/web/tailwind.config.ts:74:          fg: "#FFFFFF",
docs/core/DESIGN_TOKENS.md:7:> **목적**: Core가 정의하는 디자인 토큰 표준 — 토큰 분류(primitive·semantic·component), 색상·타이포·간격·라운드·그림자·모션·컴포넌트 토큰 카탈로그, 출력 형식(CSS·JSON), Preset/Instance override 인터페이스, 접근성 기준, 빌드 검증을 단독 구현 가능한 명세로 정의.
docs/core/DESIGN_TOKENS.md:19:- **3-tier 토큰 구조**: primitive(원시값) → semantic(의미) → component(컴포넌트 매핑). **색상·shadow component**는 semantic 참조 의무(primitive 직접 참조 fail). typography·spacing·radius·motion은 primitive 직접 참조 허용 (§ 2.4 참조 규칙 표)
docs/core/DESIGN_TOKENS.md:22:- **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
docs/core/DESIGN_TOKENS.md:34:| primitive 값 변경 (색상·크기) | **MAJOR** | semantic·component 전반 영향 — 마이그레이션 가이드 필수 |
docs/core/DESIGN_TOKENS.md:36:| semantic 토큰 추가 | MINOR | |
docs/core/DESIGN_TOKENS.md:37:| semantic 토큰 값 변경 (primitive 참조 교체) | **MAJOR** | UI 시각 변경 가능 |
docs/core/DESIGN_TOKENS.md:39:| 컴포넌트 → semantic 매핑 변경 | MINOR | |
docs/core/DESIGN_TOKENS.md:47:  - `semantic.light.tokens.json` (semantic — light 테마)
docs/core/DESIGN_TOKENS.md:48:  - `semantic.dark.tokens.json` (semantic — dark 테마)
docs/core/DESIGN_TOKENS.md:49:  - `component.tokens.json` (테마 무관, semantic 참조)
docs/core/DESIGN_TOKENS.md:86:> `shadow.*`는 **semantic 단계**에서 정의 (§ 6.2 theme-aware). primitive에 두지 않음.
docs/core/DESIGN_TOKENS.md:87:> `container.*`는 semantic 단계 (§ 5.3) — primitive `breakpoint.*` + `spacing.*` 참조.
docs/core/DESIGN_TOKENS.md:89:### 2.2 semantic (의미)
docs/core/DESIGN_TOKENS.md:94:color.surface.background  → light: color.gray.50,  dark: color.gray.900
docs/core/DESIGN_TOKENS.md:95:color.text.primary        → light: color.gray.900, dark: color.gray.50
docs/core/DESIGN_TOKENS.md:97:color.brand.primary       → color.blue.600 (Preset/Instance override)
docs/core/DESIGN_TOKENS.md:107:semantic을 참조하여 **컴포넌트 단위 토큰** 정의. 컴포넌트 구현은 본 토큰만 참조.
docs/core/DESIGN_TOKENS.md:110:button.primary.background       → color.brand.primary
docs/core/DESIGN_TOKENS.md:111:button.primary.text             → color.text.inverse
docs/core/DESIGN_TOKENS.md:112:button.primary.hover.background → color.brand.primary.hover
docs/core/DESIGN_TOKENS.md:114:card.background                  → color.surface.elevated
docs/core/DESIGN_TOKENS.md:119:callout.disclaimer.background    → color.surface.subtle
docs/core/DESIGN_TOKENS.md:128:| **색상** (`color.*`) | semantic 의무. primitive 직접 참조 시 빌드 fail (다크모드·테마 분기 보장) |
docs/core/DESIGN_TOKENS.md:129:| **타이포** (`font.*`, `line.height.*`, `letter.spacing.*`) | semantic(예: `typography.body.default`) 또는 primitive 모두 허용 |
docs/core/DESIGN_TOKENS.md:130:| **간격** (`spacing.*`) | primitive 직접 참조 허용 (semantic 간격 토큰 없음) |
docs/core/DESIGN_TOKENS.md:132:| **그림자** (`shadow.*`) | semantic 의무. 다크모드 분기 보장 (§ 6.2 정합) |
docs/core/DESIGN_TOKENS.md:135:- semantic → primitive 또는 다른 semantic 참조
docs/core/DESIGN_TOKENS.md:152:| `color.blue.*` | 기본 brand 후보 + info |
docs/core/DESIGN_TOKENS.md:168:| `green` | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` |
docs/core/DESIGN_TOKENS.md:174:### 3.2 semantic 색상 (light/dark 분기)
docs/core/DESIGN_TOKENS.md:178:| `color.surface.background` | gray.50 | gray.900 |
docs/core/DESIGN_TOKENS.md:179:| `color.surface.elevated` | color.white | gray.800 |
docs/core/DESIGN_TOKENS.md:180:| `color.surface.subtle` | gray.100 | gray.800 |
docs/core/DESIGN_TOKENS.md:181:| `color.text.primary` | gray.900 | gray.50 |
docs/core/DESIGN_TOKENS.md:187:| `color.brand.primary` | blue.600 | blue.400 |
docs/core/DESIGN_TOKENS.md:188:| `color.brand.primary.hover` | blue.700 | blue.300 |
docs/core/DESIGN_TOKENS.md:189:| `color.brand.secondary` | gray.700 | gray.300 |
docs/core/DESIGN_TOKENS.md:202:> **overlay 예외 규칙**: overlay 그룹의 semantic 토큰은 raw `rgba()` 값을 직접 가질 수 있다 — alpha 채널 표현을 위한 명시 예외. primitive `color.black` + opacity 별도 토큰으로 분리하면 alpha 변형마다 토큰이 늘어 운영 부담 큼. raw rgba는 overlay 그룹(`color.overlay.*`)에서만 허용 (다른 semantic 색상은 primitive alias 의무).
docs/core/DESIGN_TOKENS.md:270:### 4.4 semantic 타이포 (heading scale)
docs/core/DESIGN_TOKENS.md:318:### 5.3 컨테이너·그리드 (semantic)
docs/core/DESIGN_TOKENS.md:325:| `grid.columns` | 12 (raw integer — 비-색상 semantic) |
docs/core/DESIGN_TOKENS.md:344:### 6.2 shadow (semantic — theme-aware)
docs/core/DESIGN_TOKENS.md:346:primitive가 아닌 **semantic 단계**에서 정의 (theme 분기) — primitive theme 무관 원칙 보호.
docs/core/DESIGN_TOKENS.md:421:| 토큰 | 값 (semantic) |
docs/core/DESIGN_TOKENS.md:423:| `button.primary.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:424:| `button.primary.text` | color.text.inverse |
docs/core/DESIGN_TOKENS.md:425:| `button.primary.hover.background` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:426:| `button.secondary.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:427:| `button.secondary.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:439:| `card.background` | color.surface.elevated |
docs/core/DESIGN_TOKENS.md:449:| `input.background` | color.surface.elevated |
docs/core/DESIGN_TOKENS.md:452:| `input.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:468:| `callout.disclaimer.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:478:| `badge.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:479:| `badge.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:488:| `link.text` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:489:| `link.text.hover` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:496:| `table.background` | color.surface.elevated |
docs/core/DESIGN_TOKENS.md:497:| `table.header.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:498:| `table.header.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:499:| `table.row.background.alt` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:508:| `accordion.item.background` | color.surface.elevated |
docs/core/DESIGN_TOKENS.md:519:| `tabs.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:521:| `tabs.trigger.text.active` | color.text.primary |
docs/core/DESIGN_TOKENS.md:522:| `tabs.trigger.border.active` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:529:| `nav.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:531:| `nav.link.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:532:| `nav.link.text.hover` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:534:| `footer.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:542:| `modal.background` | color.surface.elevated |
docs/core/DESIGN_TOKENS.md:559:| `avatar.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:566:| `breadcrumb.text.current` | color.text.primary |
docs/core/DESIGN_TOKENS.md:576:| `cta-cluster.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:587:| `timeline.node.color` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:590:| `map.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:593:| `embed.background` | color.surface.subtle |
docs/core/DESIGN_TOKENS.md:606:  --color-gray-50: #f9fafb;
docs/core/DESIGN_TOKENS.md:607:  --color-blue-600: #2563eb;
docs/core/DESIGN_TOKENS.md:609:  /* semantic */
docs/core/DESIGN_TOKENS.md:610:  --color-surface-background: var(--color-gray-50);
docs/core/DESIGN_TOKENS.md:611:  --color-text-primary: var(--color-gray-900);
docs/core/DESIGN_TOKENS.md:612:  --color-brand-primary: var(--color-blue-600);
docs/core/DESIGN_TOKENS.md:614:  --button-primary-background: var(--color-brand-primary);
docs/core/DESIGN_TOKENS.md:618:  --color-surface-background: var(--color-gray-900);
docs/core/DESIGN_TOKENS.md:619:  --color-text-primary: var(--color-gray-50);
docs/core/DESIGN_TOKENS.md:632:├── semantic.light.tokens.json  # semantic — light 테마
docs/core/DESIGN_TOKENS.md:633:├── semantic.dark.tokens.json   # semantic — dark 테마
docs/core/DESIGN_TOKENS.md:634:└── component.tokens.json       # component (테마 무관, semantic 참조)
docs/core/DESIGN_TOKENS.md:657:**semantic.light.tokens.json 예시**:
docs/core/DESIGN_TOKENS.md:666:    "brand": {
docs/core/DESIGN_TOKENS.md:667:      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
docs/core/DESIGN_TOKENS.md:678:    "primary": {
docs/core/DESIGN_TOKENS.md:679:      "background": { "value": "{color.brand.primary}", "type": "color" },
docs/core/DESIGN_TOKENS.md:689:- 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
docs/core/DESIGN_TOKENS.md:692:- theme 분기 — light/dark용 semantic 파일 별도. 빌드 시 token set으로 결합 (`StyleDictionary.config({ source: [primitive, semantic.light, component] })`)
docs/core/DESIGN_TOKENS.md:713:| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
docs/core/DESIGN_TOKENS.md:714:| `typography` | § 4.4 semantic 타이포 (typography.heading.h1 등) |
docs/core/DESIGN_TOKENS.md:717:| `shadow` | § 6.2 shadow semantic (theme별 분기) |
docs/core/DESIGN_TOKENS.md:726:// 단일 테마 색상 평면화 — § 3.2 semantic 색상 전체 round-trip
docs/core/DESIGN_TOKENS.md:728:  // brand
docs/core/DESIGN_TOKENS.md:729:  primary: string;
docs/core/DESIGN_TOKENS.md:730:  primary_hover: string;
docs/core/DESIGN_TOKENS.md:737:  text_primary: string;
docs/core/DESIGN_TOKENS.md:766:// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
docs/core/DESIGN_TOKENS.md:773:  // 모든 § 4.4 semantic typography 토큰 평면화 (required)
docs/core/DESIGN_TOKENS.md:808:- **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
docs/core/DESIGN_TOKENS.md:815:- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:816:- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:825:Core (data/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:827:Preset (presets/<presetSlug>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:829:Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:839:- Preset·Instance는 **semantic 또는 component 토큰**만 override 권장
docs/core/DESIGN_TOKENS.md:843:  - Core에 없는 semantic 토큰을 Preset/Instance가 신설 → warning
docs/core/DESIGN_TOKENS.md:844:  - 단, **preset/instance 전용 토큰**은 합법 — **`private.*` 네임스페이스** 사용. semantic·component 양쪽 layer 모두 허용 (예: `private.hanui-card.background` 컴포넌트, `private.color.brand.tertiary` semantic). 표기 변환: tokens.json은 dot 객체 hierarchy, CSS 변수명은 dot을 `-`로 치환 + `--` prefix (예: `private.hanui-card.background` → `--private-hanui-card-background`). warning 면제
docs/core/DESIGN_TOKENS.md:852:   - 객체 (`color.surface.*` 그룹) — deep merge (key 별 재귀)
docs/core/DESIGN_TOKENS.md:858:   - `private.*` 네임스페이스 외의 신규 component/semantic 토큰 → warning
docs/core/DESIGN_TOKENS.md:860:6. **접근성 재검증**: 머지·alias resolve 완료 후 § 11 접근성 검증 자동 재실행. Preset/Instance가 brand 색상 변경 후 본문 텍스트 대비가 WCAG AA 미충족 시 fail
docs/core/DESIGN_TOKENS.md:878:빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
docs/core/DESIGN_TOKENS.md:882:| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:883:| 본문 텍스트 — elevated | `color.text.primary` / `color.surface.elevated` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:884:| 본문 텍스트 — subtle | `color.text.primary` / `color.surface.subtle` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:885:| 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:886:| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:887:| 버튼 primary 텍스트 | `button.primary.text` / `button.primary.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:889:| 링크 | `link.text` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:890:| 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:891:| 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:892:| 콜아웃 info 텍스트 | `color.text.primary` / `callout.info.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:893:| 콜아웃 warning 텍스트 | `color.text.primary` / `callout.warning.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:896:| 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:918:| **fail** | 토큰 미정의(체인 단절), 순환 참조, **색상·shadow component에서 primitive 직접 참조** (§ 2.4 — typography·spacing·radius·motion은 허용), **`color.overlay.*` 외 semantic 색상이 raw hex·rgb·hsl 값을 보유** (semantic 색상은 primitive alias 의무, overlay 그룹만 예외 — § 3.2), 접근성 명도 대비 위반(본문 4.5:1·UI 3:1), 출력 파일 생성 실패 |
docs/core/DESIGN_TOKENS.md:919:| **warning** | semantic 미사용(고아 토큰), Preset/Instance override가 Core에 없는 토큰 신설(MAJOR 의도일 수 있음 — 경고만), reduced-motion 미구현 |
docs/core/DESIGN_TOKENS.md:938:| ~~DT-04~~ | 다크모드 그림자 opacity 값 | v0.2 — § 6.2 shadow를 semantic theme-aware로 이동, light·dark 두 값 명시 |
docs/core/DESIGN_TOKENS.md:939:| ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |
docs/core/DESIGN_TOKENS.md:947:| 2026-05-14 | v0.1 | 최초 작성 — 3-tier 토큰 구조(primitive·semantic·component), 3-레이어 override(Core·Preset·Instance), 색상 팔레트 + 다크모드 분기, 타이포(Pretendard 기반)·간격·라운드·그림자·모션, 컴포넌트 토큰 6종(button·card·input·callout·badge·link), 출력 형식 2종(CSS·JSON), 접근성 WCAG AA, 빌드 검증 룰 |
docs/core/DESIGN_TOKENS.md:948:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
docs/core/DESIGN_TOKENS.md:949:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
docs/core/DESIGN_TOKENS.md:950:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
docs/core/DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
docs/core/DESIGN_TOKENS.md:952:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |

 succeeded in 770ms:
apps/web\package.json
apps/web/src/styles\globals.css
apps/web/src/lib\env.ts
apps/web\src\seed.ts
apps/web/src/app\page.tsx
apps/web/src/app\layout.tsx
apps/web/src/app\sign-out\route.ts
apps/web\src\styles\globals.css
apps/web/src/app\(admin)\layout.tsx
apps/web/src/app\sign-in\page.tsx
apps/web\src\app\sign-out\route.ts
apps/web\src\app\layout.tsx
apps/web\src\app\page.tsx
apps/web/src/app\sign-in\actions.ts
apps/web\src\lib\env.ts
apps/web/src/app\api\site-meta-fetch\route.ts
apps/web/src/app\sign-in\cleanup\route.ts
apps/web/src/app\sign-in\consume\route.ts
apps/web/src/app\api\health\route.ts
apps/web\src\app\sign-in\page.tsx
apps/web\src\app\(admin)\layout.tsx
apps/web/src/app\(site)\[instanceSlug]\contact\page.tsx
apps/web/src/app\(site)\[instanceSlug]\about\page.tsx
apps/web/src/app\(site)\[instanceSlug]\robots.txt\route.ts
apps/web/src/app\(site)\[instanceSlug]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\layout.tsx
apps/web\src\app\sign-in\consume\route.ts
apps/web\src\app\api\site-meta-fetch\route.ts
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps/web/src/app\(site)\[instanceSlug]\treatments\page.tsx
apps/web/src/app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps/web\src\app\(site)\[instanceSlug]\page.tsx
apps/web\src\app\api\health\route.ts
apps/web\src\app\sign-in\cleanup\route.ts
apps/web\src\app\sign-in\actions.ts
apps/web/src/app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps/web/src/app\(site)\[instanceSlug]\doctors\page.tsx
apps/web/src/app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps/web/src/app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps/web\src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps/web\src\app\(site)\[instanceSlug]\treatments\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps/web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps/web\src\app\(admin)\admin\[instanceSlug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps/web\src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps/web\src\app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps/web\src\app\(site)\[instanceSlug]\doctors\page.tsx
apps/web\src\app\(site)\[instanceSlug]\layout.tsx
apps/web\src\app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps/web\src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps/web\src\app\(site)\[instanceSlug]\contact\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps/web\src\app\(site)\[instanceSlug]\about\page.tsx
apps/web\src\app\(site)\[instanceSlug]\robots.txt\route.ts
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps/web\src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'CREATE ROLE|app_public_reader|CREATE POLICY|ALTER TABLE|USING|status|published_at|legal|set_config|SET LOCAL|WEB_PUBLIC_DATABASE_URL|sanitize|nofollow|noopener|noreferrer|themeColor|openGraph|twitter|robots|canonical|revalidatePath|redirect\\(|/admin/|href=\\{|href=\"/admin|Sitemap|User-agent|Disallow|Allow|changefreq|priority|@id|inLanguage|MedicalClinic|Organization|WebSite|WebPage|BreadcrumbList|ItemList|ContactPoint|Article|Physician|MedicalProcedure' apps/web/src packages/db/migrations/D0011_public_reader.sql packages/migrations-runner/src/manifest.ts apps/web/.env.example" in C:\Users\assag\solution\website-exposure
 succeeded in 621ms:
apps/web/.env.example:15:# WEB_PUBLIC_DATABASE_URL: 공개 사이트 SSR 전용 — app_public_reader (read-only · RLS instance_id scope)
apps/web/.env.example:17:#     CREATE ROLE app_public_reader LOGIN PASSWORD 'app_public_reader_pw';
apps/web/.env.example:18:#     GRANT USAGE ON SCHEMA public TO app_public_reader;
apps/web/.env.example:20:#                     doctor_profile, treatment_page, article, legal_document TO app_public_reader;
apps/web/.env.example:21:#     + per-table CREATE POLICY public_reader_*_select (instance_id USING + status published)
apps/web/.env.example:22:WEB_PUBLIC_DATABASE_URL=postgres://app_public_reader:app_public_reader_pw@localhost:5432/glitzy_dev
packages/migrations-runner/src/manifest.ts:55:  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
packages/migrations-runner/src/manifest.ts:59:    creates: ["treatment_page", "content_publication_status"],
packages/migrations-runner/src/manifest.ts:67:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
packages/migrations-runner/src/manifest.ts:69:  // (7) legal_document — content_publication_status + risk_level enum FK
packages/migrations-runner/src/manifest.ts:71:    file: "packages/core-content/migrations/C0006_legal_document.sql",
packages/migrations-runner/src/manifest.ts:73:    creates: ["legal_document", "legal_document_type"],
packages/migrations-runner/src/manifest.ts:74:    dependsOn: ["instance", "content_publication_status", "risk_level"],
packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages/migrations-runner/src/manifest.ts:108:      "app_public_reader",
packages/migrations-runner/src/manifest.ts:115:      "public_reader_legal_document_select",
packages/migrations-runner/src/manifest.ts:124:      "legal_document",
packages/db/migrations/D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
packages/db/migrations/D0011_public_reader.sql:10:-- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
packages/db/migrations/D0011_public_reader.sql:11:CREATE ROLE app_public_reader LOGIN PASSWORD 'app_public_reader_pw';
packages/db/migrations/D0011_public_reader.sql:13:GRANT USAGE ON SCHEMA public TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:16:-- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
packages/db/migrations/D0011_public_reader.sql:18:GRANT SELECT ON instance TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:20:CREATE POLICY public_reader_instance_select
packages/db/migrations/D0011_public_reader.sql:23:  TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:24:  USING (active = true);
packages/db/migrations/D0011_public_reader.sql:27:-- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
packages/db/migrations/D0011_public_reader.sql:28:-- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.
packages/db/migrations/D0011_public_reader.sql:31:                treatment_page, article, legal_document
packages/db/migrations/D0011_public_reader.sql:32:  TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:34:CREATE POLICY public_reader_clinic_profile_select
packages/db/migrations/D0011_public_reader.sql:35:  ON clinic_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:36:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/db/migrations/D0011_public_reader.sql:38:CREATE POLICY public_reader_location_profile_select
packages/db/migrations/D0011_public_reader.sql:39:  ON location_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:40:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/db/migrations/D0011_public_reader.sql:42:CREATE POLICY public_reader_doctor_profile_select
packages/db/migrations/D0011_public_reader.sql:43:  ON doctor_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:44:  USING (
packages/db/migrations/D0011_public_reader.sql:50:CREATE POLICY public_reader_treatment_page_select
packages/db/migrations/D0011_public_reader.sql:51:  ON treatment_page FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:52:  USING (
packages/db/migrations/D0011_public_reader.sql:54:    AND status = 'published'
packages/db/migrations/D0011_public_reader.sql:55:    AND published_at IS NOT NULL
packages/db/migrations/D0011_public_reader.sql:56:    AND published_at <= now()
packages/db/migrations/D0011_public_reader.sql:59:CREATE POLICY public_reader_article_select
packages/db/migrations/D0011_public_reader.sql:60:  ON article FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:61:  USING (
packages/db/migrations/D0011_public_reader.sql:63:    AND status = 'published'
packages/db/migrations/D0011_public_reader.sql:64:    AND published_at IS NOT NULL
packages/db/migrations/D0011_public_reader.sql:65:    AND published_at <= now()
packages/db/migrations/D0011_public_reader.sql:68:-- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
packages/db/migrations/D0011_public_reader.sql:69:--   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
packages/db/migrations/D0011_public_reader.sql:70:CREATE POLICY public_reader_legal_document_select
packages/db/migrations/D0011_public_reader.sql:71:  ON legal_document FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:72:  USING (
packages/db/migrations/D0011_public_reader.sql:74:    AND status = 'published'
apps/web/src\seed.ts:75:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
apps/web/src\seed.ts:85:              legal_reviewer_eligible = false,
apps/web/src\seed.ts:106:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
apps/web/src\seed.ts:115:              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
apps/web/src\styles\globals.css:31:  --color-status-success: #16a34a;        /* green.600 */
apps/web/src\styles\globals.css:32:  --color-status-success-subtle: #f0fdf4; /* green.50 */
apps/web/src\styles\globals.css:33:  --color-status-warning: #f59e0b;        /* amber.500 */
apps/web/src\styles\globals.css:34:  --color-status-warning-subtle: #fffbeb; /* amber.50 */
apps/web/src\styles\globals.css:35:  --color-status-error: #dc2626;          /* red.600 */
apps/web/src\styles\globals.css:36:  --color-status-error-subtle: #fef2f2;   /* red.50 */
apps/web/src\styles\globals.css:37:  --color-status-info: #3b82f6;           /* blue.500 */
apps/web/src\styles\globals.css:38:  --color-status-info-subtle: #eff6ff;    /* blue.50 */
apps/web/src\styles\globals.css:64:  --color-status-success: #4ade80;         /* green.400 */
apps/web/src\styles\globals.css:65:  --color-status-success-subtle: #14532d;  /* green.900 */
apps/web/src\styles\globals.css:66:  --color-status-warning: #fbbf24;         /* amber.400 */
apps/web/src\styles\globals.css:67:  --color-status-warning-subtle: #78350f;  /* amber.900 */
apps/web/src\styles\globals.css:68:  --color-status-error: #f87171;           /* red.400 */
apps/web/src\styles\globals.css:69:  --color-status-error-subtle: #7f1d1d;    /* red.900 */
apps/web/src\styles\globals.css:70:  --color-status-info: #93c5fd;            /* blue.300 */
apps/web/src\styles\globals.css:71:  --color-status-info-subtle: #1e3a8a;     /* blue.900 */
apps/web/src\styles\globals.css:82:/* Markdown rendered content baseline (ArticleBody 컴포넌트) */
apps/web/src\lib\action-context.ts:2:// ClinicProfile/Doctor/Treatment/Article actions 가 같은 패턴 사용
apps/web/src\lib\action-context.ts:32:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\action-context.ts:42:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\action-context.ts:50:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\action-context.ts:59: * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
apps/web/src\lib\clinic-profile-schema.ts:192:  legalEntityName: optionalStr(200),
apps/web/src\lib\clinic-profile-schema.ts:255:export const legalDocEffectiveOverrideSchema = z.record(
apps/web/src\lib\clinic-profile-schema.ts:283:    legalDocEffectiveOverrides: legalDocEffectiveOverrideSchema,
apps/web/src\lib\clinic-profile-schema.ts:303: * FormData 의 flat key `legalDocEffective_<documentType>` → Record<DocumentType, string|undefined>
apps/web/src\lib\clinic-profile-schema.ts:310:    const v = formData.get(`legalDocEffective_${t}`);
apps/web/src\lib\db.ts:24:    // tenant tx 진입 시 SET LOCAL ROLE app_tenant_user (packages/db.withTenantTransaction)
apps/web/src\lib\deny-reason-map.ts:23:  "legal-reviewer-ineligible",
apps/web/src\lib\deny-reason-map.ts:71:    case "legal-reviewer-ineligible":
apps/web/src\lib\deny-reason-map.ts:110:    case "legal-reviewer-ineligible":
apps/web/src\lib\db-projection.ts:5:// 예: TreatmentPage.title (DB) ↔ name (contract C-03), Article.title (DB) ↔ headline (contract C-04).
apps/web/src\lib\db-projection.ts:17:  legal_entity_name: string | null;
apps/web/src\lib\db-projection.ts:60:  published_at: Date | null;
apps/web/src\lib\db-projection.ts:64:export type ArticleRow = {
apps/web/src\lib\db-projection.ts:70:  published_at: Date | null;
apps/web/src\lib\db-projection.ts:100:  legalEntityName: string | null;
apps/web/src\lib\db-projection.ts:160:export type ArticleProjection = {
apps/web/src\lib\db-projection.ts:243:    legalEntityName: row.legal_entity_name,
apps/web/src\lib\db-projection.ts:292:    publishedAt: row.published_at,
apps/web/src\lib\db-projection.ts:297:export function normalizeArticle(row: ArticleRow): ArticleProjection {
apps/web/src\lib\db-projection.ts:304:    publishedAt: row.published_at,
apps/web/src\lib\env.ts:9:  // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
apps/web/src\lib\env.ts:10:  WEB_PUBLIC_DATABASE_URL: z.string().min(1, "WEB_PUBLIC_DATABASE_URL required"),
apps/web/src\lib\errors.ts:2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
apps/web/src\lib\errors.ts:41:  // Article (C0005)
apps/web/src\lib\errors.ts:61:  legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
apps/web/src\lib\errors.ts:62:  legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
apps/web/src\lib\errors.ts:63:  legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
apps/web/src\lib\errors.ts:64:  legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
apps/web/src\lib\errors.ts:65:  legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
apps/web/src\lib\errors.ts:66:  legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
apps/web/src\lib\errors.ts:67:  legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:68:  legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:69:  legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
apps/web/src\lib\errors.ts:70:  legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:71:  legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
apps/web/src\lib\page-context.ts:41:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\page-context.ts:51:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\page-context.ts:59:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\page-context.ts:70:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\lib\markdown.ts:4:// 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
apps/web/src\lib\markdown.ts:5:// 외부 링크: rel="nofollow noopener noreferrer" 자동.
apps/web/src\lib\markdown.ts:8:import sanitizeHtml from "sanitize-html";
apps/web/src\lib\markdown.ts:31: * Markdown 또는 raw HTML → sanitized HTML.
apps/web/src\lib\markdown.ts:32: * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
apps/web/src\lib\markdown.ts:33: * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
apps/web/src\lib\markdown.ts:43:  // 2) sanitize
apps/web/src\lib\markdown.ts:44:  const sanitized = sanitizeHtml(html, {
apps/web/src\lib\markdown.ts:57:            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
apps/web/src\lib\markdown.ts:63:  return sanitized;
apps/web/src\lib\markdown.ts:72:  // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
apps/web/src\lib\public-db.ts:1:// @glitzy/web/lib/public-db — postgres.Sql singleton for app_public_reader
apps/web/src\lib\public-db.ts:5:// app_public_reader role 은 SELECT only · RLS USING instance_id 정합.
apps/web/src\lib\public-db.ts:24:  const sql = postgres(env.WEB_PUBLIC_DATABASE_URL, {
apps/web/src\lib\public-tenant.ts:6://   1. instance slug 조회 (RLS public_reader_instance_select policy USING active=true)
apps/web/src\lib\public-tenant.ts:7://   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
apps/web/src\lib\public-tenant.ts:33:    // 1) instance lookup — RLS public_reader_instance_select policy USING active=true
apps/web/src\lib\public-tenant.ts:41:    await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
apps/web/src\app\page.tsx:17:    redirect("/sign-in");
apps/web/src\app\page.tsx:32:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\page.tsx:40:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\page.tsx:48:    redirect("/sign-in/cleanup?reason=user-inactive");
apps/web/src\app\page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src\app\page.tsx:55:    redirect("/sign-in?reason=no-active-membership");
apps/web/src\app\page.tsx:57:  redirect(`/admin/${result.slug}`);
apps/web/src\lib\site-initial.ts:28:             legal_entity_name, founder,
apps/web/src\lib\json-ld\entities.ts:9:  ArticleProjection,
apps/web/src\lib\json-ld\entities.ts:23:    "@type": "Organization",
apps/web/src\lib\json-ld\entities.ts:24:    "@id": id,
apps/web/src\lib\json-ld\entities.ts:26:    ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
apps/web/src\lib\json-ld\entities.ts:39:  // schema.org ContactPoint 는 @id 가 권장 (entity identity). v0.1 단계는 cta.id 활용.
apps/web/src\lib\json-ld\entities.ts:41:    "@type": "ContactPoint",
apps/web/src\lib\json-ld\entities.ts:42:    "@id": `#contact-${cta.id}`,
apps/web/src\lib\json-ld\entities.ts:54:    "@type": "MedicalClinic",
apps/web/src\lib\json-ld\entities.ts:55:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src\lib\json-ld\entities.ts:57:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src\lib\json-ld\entities.ts:87:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src\lib\json-ld\entities.ts:91:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src\lib\json-ld\entities.ts:96:    "@type": "Physician",
apps/web/src\lib\json-ld\entities.ts:97:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src\lib\json-ld\entities.ts:102:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src\lib\json-ld\entities.ts:109:    "@type": "MedicalProcedure",
apps/web/src\lib\json-ld\entities.ts:110:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src\lib\json-ld\entities.ts:119:  article: ArticleProjection,
apps/web/src\lib\json-ld\entities.ts:124:    "@type": "Article",
apps/web/src\lib\json-ld\entities.ts:125:    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
apps/web/src\lib\json-ld\entities.ts:128:    inLanguage: "ko-KR",
apps/web/src\lib\json-ld\entities.ts:131:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src\lib\json-ld\entities.ts:132:    ...(author ? { author: { "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician` } } : {}),
apps/web/src\lib\json-ld\entities.ts:138:    "@type": "WebPage",
apps/web/src\lib\json-ld\entities.ts:139:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src\lib\json-ld\entities.ts:143:    inLanguage: "ko-KR",
apps/web/src\lib\json-ld\entities.ts:144:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src\lib\json-ld\entities.ts:150:    "@type": "WebSite",
apps/web/src\lib\json-ld\entities.ts:151:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src\lib\json-ld\entities.ts:154:    inLanguage: "ko-KR",
apps/web/src\lib\json-ld\entities.ts:155:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src\lib\json-ld\entities.ts:164:    "@type": "BreadcrumbList",
apps/web/src\lib\json-ld\entities.ts:165:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src\lib\json-ld\entities.ts:181:    "@type": "ItemList",
apps/web/src\lib\json-ld\entities.ts:182:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src\lib\json-ld\entities.ts:186:      item: { "@id": it.itemId, name: it.name },
apps/web/src\lib\site-meta-fetch.ts:24:  themeColor: string | null;
apps/web/src\lib\site-meta-fetch.ts:185:      if (res.status >= 300 && res.status < 400) {
apps/web/src\lib\site-meta-fetch.ts:289:  const tw = (prop: string) => $(`meta[name="twitter:${prop}"]`).attr("content");
apps/web/src\lib\site-meta-fetch.ts:302:  const themeColor = pick(meta("theme-color"));
apps/web/src\lib\site-meta-fetch.ts:314:    themeColor,
apps/web/src\lib\site-meta-fetch.ts:319:/** audit payload sanitize — userinfo/query/fragment 제거 (WEB-113·115)
apps/web/src\lib\site-meta-fetch.ts:322:export function sanitizeUrlForAudit(input: string): string {
apps/web/src\lib\json-ld\builders.ts:9:  ArticleProjection,
apps/web/src\lib\json-ld\builders.ts:129:// === P-010 Article Detail ===
apps/web/src\lib\json-ld\builders.ts:133:  article: ArticleProjection,
apps/web/src\app\(admin)\layout.tsx:14:    redirect("/sign-in");
apps/web/src\app\(admin)\layout.tsx:23:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\site-metadata.ts:16:  /** canonical path (e.g. "/about", "/doctors/hong"). instance prefix 자동 prepend */
apps/web/src\lib\site-metadata.ts:17:  canonicalPath?: string;
apps/web/src\lib\site-metadata.ts:18:  /** robots: index — P-013 Legal v0.1 false */
apps/web/src\lib\site-metadata.ts:39:  const canonicalPath = input.canonicalPath ?? "/";
apps/web/src\lib\site-metadata.ts:40:  const canonical = `/${instanceSlug}${canonicalPath === "/" ? "" : canonicalPath}`;
apps/web/src\lib\site-metadata.ts:45:    alternates: { canonical },
apps/web/src\lib\site-metadata.ts:46:    openGraph: {
apps/web/src\lib\site-metadata.ts:50:      url: canonical,
apps/web/src\lib\site-metadata.ts:55:    twitter: {
apps/web/src\lib\site-metadata.ts:61:    robots: {
apps/web/src\lib\site-metadata.ts:65:    // PSR-SEO-02 (cycle3 PSR-29 정정): themeColor 출처 BrandTokens.colors.light/dark.primary
apps/web/src\lib\site-metadata.ts:67:    themeColor: [
apps/web/src\lib\tenant.ts:14: *   2) withTenantTransaction (SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id)
apps/web/src\app\sign-out\route.ts:20:    return NextResponse.json({ error: "외부 도메인에서의 로그아웃 요청은 차단됩니다." }, { status: 403 });
apps/web/src\app\sign-out\route.ts:60:          { status: 503 },
apps/web/src\app\sign-out\route.ts:77:  const res = NextResponse.redirect(new URL("/sign-in", req.url), { status: 303 });
apps/web/src\components\site\ArticleBody.tsx:1:// @glitzy/web/components/site/ArticleBody — Markdown body 렌더 (sanitize-html)
apps/web/src\components\site\ArticleBody.tsx:6:export function ArticleBody({ markdown, hostOrigin }: { markdown: string; hostOrigin: string }) {
apps/web/src\lib\json-ld\types.ts:2:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
apps/web/src\lib\json-ld\types.ts:11:  "@id": string;
apps/web/src\app\sign-in\actions.ts:22:    redirect("/sign-in?reason=magic-link-invalid");
apps/web/src\app\sign-in\actions.ts:33:      redirect(`/sign-in?reason=${err.reason}`);
apps/web/src\app\sign-in\actions.ts:54:    redirect("/sign-in?sent=1");
apps/web/src\app\sign-in\actions.ts:67:  redirect("/sign-in?sent=1");
apps/web/src\components\dev\MockMailbox.tsx:29:              href={`/sign-in/consume?identifier=${encodeURIComponent(entry.to)}&token=${encodeURIComponent(entry.tokenPlain)}`}
apps/web/src\components\forms\ClinicProfileForm.tsx:52:  legalEntityName: string;
apps/web/src\components\forms\ClinicProfileForm.tsx:74:  legalDocEffectiveOverrides: Record<ClosedDocType, string>;
apps/web/src\components\forms\ClinicProfileForm.tsx:96:  legalEntityName: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:115:  legalDocEffectiveOverrides: {
apps/web/src\components\forms\ClinicProfileForm.tsx:129:  themeColor: string | null;
apps/web/src\components\forms\ClinicProfileForm.tsx:173:      legalDocEffectiveOverrides: { ...prev.legalDocEffectiveOverrides, [t]: v },
apps/web/src\components\forms\ClinicProfileForm.tsx:287:              <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
apps/web/src\components\forms\ClinicProfileForm.tsx:455:              const headerId = `legal-override-${t}`;
apps/web/src\components\forms\ClinicProfileForm.tsx:456:              const bodyId = `legal-override-body-${t}`;
apps/web/src\components\forms\ClinicProfileForm.tsx:461:                    {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:465:                      name={`legalDocEffective_${t}`}
apps/web/src\components\forms\ClinicProfileForm.tsx:468:                      value={values.legalDocEffectiveOverrides[t]}
apps/web/src\components\forms\ClinicProfileForm.tsx:470:                      errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
apps/web/src\lib\json-ld\__tests__\validate.ts:7://   3. @id 유일 (graph 안 중복 없음)
apps/web/src\lib\json-ld\__tests__\validate.ts:8://   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
apps/web/src\lib\json-ld\__tests__\validate.ts:29:  // (3) @id 유일
apps/web/src\lib\json-ld\__tests__\validate.ts:39:    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
apps/web/src\lib\json-ld\__tests__\validate.ts:40:    if (typeof e["@id"] === "string") {
apps/web/src\lib\json-ld\__tests__\validate.ts:41:      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
apps/web/src\lib\json-ld\__tests__\validate.ts:42:      ids.add(e["@id"]);
apps/web/src\lib\json-ld\__tests__\validate.ts:43:      idMap.set(e["@id"], e as JsonLdEntity);
apps/web/src\lib\json-ld\__tests__\validate.ts:47:  // (4) cross-reference — graph 안 `{ "@id": "..." }` 참조가 idMap 안 또는 외부 dereferenceable URL
apps/web/src\lib\json-ld\__tests__\validate.ts:55:    if (typeof v["@id"] === "string" && Object.keys(v).length === 1) {
apps/web/src\lib\json-ld\__tests__\validate.ts:56:      // pure @id reference (no @type beyond reference) — graph 안 entity 필요
apps/web/src\lib\json-ld\__tests__\validate.ts:57:      const ref = v["@id"];
apps/web/src\lib\json-ld\__tests__\validate.ts:63:      if (k === "@type" || k === "@id") continue;
apps/web/src\components\forms\ArticleForm.tsx:1:// @glitzy/web/components/forms/ArticleForm
apps/web/src\components\forms\ArticleForm.tsx:9:export type ArticleInitial = {
apps/web/src\components\forms\ArticleForm.tsx:14:  status: string;
apps/web/src\components\forms\ArticleForm.tsx:20:const empty: ArticleInitial = {
apps/web/src\components\forms\ArticleForm.tsx:25:  status: "draft",
apps/web/src\components\forms\ArticleForm.tsx:49:export function ArticleForm({
apps/web/src\components\forms\ArticleForm.tsx:56:  initial: ArticleInitial | null;
apps/web/src\components\forms\ArticleForm.tsx:61:  const [v, setV] = useState<ArticleInitial>(initial ?? empty);
apps/web/src\components\forms\ArticleForm.tsx:64:  const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));
apps/web/src\components\forms\ArticleForm.tsx:82:      <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
apps/web/src\app\api\health\route.ts:25:        { status: 503 },
apps/web/src\app\api\health\route.ts:33:    return NextResponse.json({ ok: false, error: "내부 오류" }, { status: 500 });
apps/web/src\app\api\site-meta-fetch\route.ts:6://   - WEB-113: audit payload sanitizeUrlForAudit (userinfo/query 제거)
apps/web/src\app\api\site-meta-fetch\route.ts:22:import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
apps/web/src\app\api\site-meta-fetch\route.ts:63:    return NextResponse.json({ ok: false, error: "외부 도메인 요청은 차단됩니다." }, { status: 403 });
apps/web/src\app\api\site-meta-fetch\route.ts:68:    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
apps/web/src\app\api\site-meta-fetch\route.ts:86:    const res = NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
apps/web/src\app\api\site-meta-fetch\route.ts:94:    return NextResponse.json({ ok: false, error: "요청 본문이 너무 큽니다." }, { status: 413 });
apps/web/src\app\api\site-meta-fetch\route.ts:100:    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
apps/web/src\app\api\site-meta-fetch\route.ts:104:    return NextResponse.json({ ok: false, error: "url 또는 instanceSlug 필드가 필요합니다." }, { status: 400 });
apps/web/src\app\api\site-meta-fetch\route.ts:110:    return NextResponse.json({ ok: false, error: "인스턴스를 찾을 수 없습니다." }, { status: 404 });
apps/web/src\app\api\site-meta-fetch\route.ts:124:    return NextResponse.json({ ok: false, error: "접근 권한이 없습니다." }, { status: 403 });
apps/web/src\app\api\site-meta-fetch\route.ts:137:    return NextResponse.json({ ok: false, error: "운영자 권한이 필요합니다." }, { status: 403 });
apps/web/src\app\api\site-meta-fetch\route.ts:147:        // cycle8 WEB-113: audit payload sanitize
apps/web/src\app\api\site-meta-fetch\route.ts:148:        input: sanitizeUrlForAudit(parsed.data.url),
apps/web/src\app\api\site-meta-fetch\route.ts:149:        resolved: sanitizeUrlForAudit(meta.resolvedUrl),
apps/web/src\app\api\site-meta-fetch\route.ts:160:        payload: { input: sanitizeUrlForAudit(parsed.data.url) },
apps/web/src\app\api\site-meta-fetch\route.ts:163:      return NextResponse.json({ ok: false, error: "사이트 분석에 실패했습니다." }, { status: 400 });
apps/web/src\app\api\site-meta-fetch\route.ts:171:      payload: { input: sanitizeUrlForAudit(parsed.data.url) },
apps/web/src\app\api\site-meta-fetch\route.ts:173:    return NextResponse.json({ ok: false, error: "사이트 분석 중 오류가 발생했습니다." }, { status: 500 });
apps/web/src\components\forms\TreatmentPageForm.tsx:14:  status: string;
apps/web/src\components\forms\TreatmentPageForm.tsx:24:  status: "draft",
apps/web/src\components\forms\TreatmentPageForm.tsx:78:      <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
apps/web/src\app\(site)\[instanceSlug]\about\page.tsx:7:import { ArticleBody } from "@/components/site/ArticleBody";
apps/web/src\app\(site)\[instanceSlug]\about\page.tsx:22:    canonicalPath: "/about",
apps/web/src\app\(site)\[instanceSlug]\about\page.tsx:47:        <ArticleBody markdown={longDesc} hostOrigin={hostOrigin} />
apps/web/src\app\(site)\[instanceSlug]\about\page.tsx:56:            {initial.clinic.legalEntityName ? (
apps/web/src\app\(site)\[instanceSlug]\about\page.tsx:57:              <div><dt className="text-fg-muted">법인명</dt><dd className="font-medium text-fg-default">{initial.clinic.legalEntityName}</dd></div>
apps/web/src\app\sign-in\cleanup\route.ts:40:  const res = NextResponse.redirect(new URL(`/sign-in?reason=${reason}`, req.url));
apps/web/src\components\site\Breadcrumb.tsx:2:// SCHEMA_MAPPING § 2.4 BreadcrumbList JSON-LD 는 별도 (Phase C json-ld generator)
apps/web/src\components\site\Breadcrumb.tsx:15:              <Link href={item.href} className="hover:text-fg-default">{item.label}</Link>
apps/web/src\components\site\DoctorCard.tsx:7:      href={`${baseHref}/doctors/${doctor.slug}`}
apps/web/src\components\site\ReservationChannels.tsx:24:          href={c.targetUrl}
apps/web/src\app\sign-in\consume\route.ts:52:    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
apps/web/src\app\sign-in\consume\route.ts:67:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:82:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:93:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:110:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:125:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:146:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:162:    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
apps/web/src\app\sign-in\consume\route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src\app\sign-in\consume\route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src\components\site\SiteFooter.tsx:41:          {initial.clinic.legalEntityName ? ` (${initial.clinic.legalEntityName})` : null}
apps/web/src\app\(site)\[instanceSlug]\contact\page.tsx:23:    canonicalPath: "/contact",
apps/web/src\app\(site)\[instanceSlug]\contact\page.tsx:56:          {loc.telephone ? <div><dt className="text-fg-muted">대표 전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
apps/web/src\app\(site)\[instanceSlug]\contact\page.tsx:57:          {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
apps/web/src\components\site\Hero.tsx:17:            href={cta.targetUrl}
apps/web/src\components\site\TreatmentCard.tsx:7:      href={`${baseHref}/treatments/${treatment.slug}`}
apps/web/src\app\(site)\[instanceSlug]\page.tsx:32:    canonicalPath: "/",
apps/web/src\app\(site)\[instanceSlug]\page.tsx:49:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src\app\(site)\[instanceSlug]\page.tsx:51:       ORDER BY published_at DESC NULLS LAST
apps/web/src\app\(site)\[instanceSlug]\page.tsx:77:            <Link href={`${baseHref}/doctors`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
apps/web/src\app\(site)\[instanceSlug]\page.tsx:89:            <Link href={`${baseHref}/treatments`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
apps/web/src\components\site\SiteHeader.tsx:13:        <Link href={base} className="flex items-center gap-3" aria-label={`${initial.clinic.name} 홈`}>
apps/web/src\components\site\SiteHeader.tsx:22:            <li><Link href={`${base}/about`} className="hover:text-fg-default">소개</Link></li>
apps/web/src\components\site\SiteHeader.tsx:23:            <li><Link href={`${base}/doctors`} className="hover:text-fg-default">의료진</Link></li>
apps/web/src\components\site\SiteHeader.tsx:24:            <li><Link href={`${base}/treatments`} className="hover:text-fg-default">진료</Link></li>
apps/web/src\components\site\SiteHeader.tsx:25:            <li><Link href={`${base}/contact`} className="hover:text-fg-default">연락처</Link></li>
apps/web/src\components\site\SiteHeader.tsx:26:            <li><Link href={`${base}/locations/main`} className="hover:text-fg-default">위치</Link></li>
apps/web/src\components\site\SiteHeader.tsx:31:            href={cta.targetUrl}
apps/web/src\app\(site)\[instanceSlug]\doctors\page.tsx:23:    canonicalPath: "/doctors",
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:45:  status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:79:export async function saveArticle(
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:102:      const isPublished = parsed.data.status === "published";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:108:        const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null }[]>`
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:109:          SELECT id, published_at, author_doctor_id FROM article
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:115:        beforePublishedAt = beforeRows[0]!.published_at;
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:142:                 status = ${parsed.data.status}::content_publication_status,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:146:                 published_at = ${newPublishedAt},
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:155:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, published_at
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:162:          ${parsed.data.status}::content_publication_status,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:188:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:191:        console.error("[saveArticle] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:220:    console.error("[saveArticle] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:225:export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:250:        payload: { contentType: "Article", slug },
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:253:      console.error("[deleteArticle] audit emit failed", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:259:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:272:    console.error("[deleteArticle] unexpected", err);
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:1:// @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:21:  const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:24:User-agent: *
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:25:Disallow: /admin/
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:26:Disallow: /auth/
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:27:Disallow: /api/
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:28:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:30:# A. 일반 검색 색인 — Allow
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:31:User-agent: Googlebot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:32:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:34:User-agent: Yeti
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:35:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:37:User-agent: Bingbot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:38:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:40:# B. AI 검색 인덱싱·답변용 — Allow
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:41:User-agent: OAI-SearchBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:42:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:44:User-agent: PerplexityBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:45:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:47:User-agent: Claude-SearchBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:48:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:50:# C. User-triggered fetch — Allow
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:51:User-agent: ChatGPT-User
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:52:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:54:User-agent: Perplexity-User
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:55:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:57:User-agent: Claude-User
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:58:Allow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:60:# D. AI 학습·모델 개선용 — Disallow
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:61:User-agent: GPTBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:62:Disallow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:64:User-agent: ClaudeBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:65:Disallow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:67:User-agent: Google-Extended
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:68:Disallow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:70:User-agent: CCBot
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:71:Disallow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:73:User-agent: anthropic-ai
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:74:Disallow: /
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:78:Sitemap: ${sitemapUrl}
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:82:    status: 200,
apps/web/src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx:24:    canonicalPath: `/locations/${params.slug}`,
apps/web/src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx:60:          {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
apps/web/src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx:61:          {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
apps/web/src\app\(site)\[instanceSlug]\treatments\page.tsx:23:    canonicalPath: "/treatments",
apps/web/src\app\(site)\[instanceSlug]\treatments\page.tsx:32:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src\app\(site)\[instanceSlug]\treatments\page.tsx:34:       ORDER BY published_at DESC NULLS LAST
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:63:  status: string | null;
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:82:    legalDocEffectiveOverrides: extractLegalDocEffectiveOverrides(formData),
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:96:  if (!signedToken) redirect("/sign-in");
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:106:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:113:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:138:            business_registration_number, alternate_name, legal_entity_name,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:150:            ${data.legalEntityName ?? null},
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:168:                 legal_entity_name = EXCLUDED.legal_entity_name,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:187:          status: null,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:247:          status: null,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:259:            legalEntityName: data.legalEntityName ?? null,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:279:          const overrideValue = data.legalDocEffectiveOverrides[docType];
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:291:          const legalAfter = await tx<{ id: string; inserted: boolean }[]>`
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:292:            INSERT INTO legal_document (
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:295:              contact_person, contact_email, status, risk_level
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:299:              ${docType}::legal_document_type,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:307:              'draft'::content_publication_status,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:324:          const legal = legalAfter[0]!;
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:329:            mode: legal.inserted ? "insert" : "update",
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:330:            status: "draft",
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:370:            status: entry.status,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:455:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:2:// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:9:type SitemapEntry = {
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:12:  changefreq: "weekly" | "monthly" | "yearly";
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:13:  priority: string;
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:38:    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:39:      SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:41:    const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:42:      SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:52:  if (!data) return new NextResponse("instance not found", { status: 404 });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:54:  const entries: SitemapEntry[] = [];
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:56:  entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:58:  entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:62:    entries.push({ loc: `${base}/doctors`, lastmod: latest, changefreq: "monthly", priority: "0.7" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:66:    entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:71:    entries.push({ loc: `${base}/treatments`, lastmod: latest, changefreq: "monthly", priority: "0.8" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:77:      lastmod: (t.published_at ?? t.updated_at).toISOString(),
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:78:      changefreq: "monthly",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:79:      priority: "0.8",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:82:  // P-010 Article Detail (각 article — v0.1 fallback category `general`)
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:86:      lastmod: (a.published_at ?? a.updated_at).toISOString(),
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:87:      changefreq: "monthly",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:88:      priority: "0.5",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:92:  entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:98:      changefreq: "monthly",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:99:      priority: "0.7",
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:104:  const xml = renderSitemap(entries);
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:106:    status: 200,
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:111:function renderSitemap(entries: SitemapEntry[]): string {
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:115:    <changefreq>${e.changefreq}</changefreq>
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:116:    <priority>${e.priority}</priority>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:11:type Row = { slug: string; title: string; status: string; risk_level: string | null; author_name: string | null; updated_at: Date; published_at: Date | null };
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:13:export default async function ArticlesListPage({ params }: { params: { instanceSlug: string } }) {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:35:          SELECT a.slug, a.title, a.status::text AS status, a.risk_level::text AS risk_level,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:36:                 d.name AS author_name, a.updated_at, a.published_at
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:48:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:61:        <Link href={`/admin/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:89:                <td className="px-3 py-2"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span></td>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:91:                <td className="px-3 py-2 text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : "—"}</td>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:30:  legal_entity_name: string | null;
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:122: *   Next.js 14 의 server component 는 직접 HTTP status code 를 설정할 수 없어 정확한 403 status 는
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:161:               business_registration_number, alternate_name, legal_entity_name,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:184:      const legalRows = await tx<LegalRow[]>`
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:187:          FROM legal_document
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:200:      for (const row of legalRows) {
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:219:        legalEntityName: clinic.legal_entity_name ?? "",
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:238:        legalDocEffectiveOverrides: overrides,
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:244:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:5://   - WEB-05 Doctor 삭제 시 Article 참조 보호 (ON DELETE NO ACTION)
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:152:          // cycle2-3entity WEB-28: content-saved payload shape 통일 (status 는 Doctor 에 없으므로 null)
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:153:          payload: { contentType: "DoctorProfile", slug: txResult.slug, mode: txResult.mode, status: null, originalSlug },
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:183:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:204:      // cycle1-3entity WEB-05: Article 참조 보호 (ON DELETE NO ACTION) — 사전 확인
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:263:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:7:import { normalizeDoctor, normalizeArticle, type DoctorProfileRow, type ArticleRow } from "@/lib/db-projection";
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:9:import { ArticleBody } from "@/components/site/ArticleBody";
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:33:    canonicalPath: `/doctors/${doctor.slug}`,
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:56:    const articleRows = await tx<ArticleRow[]>`
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:57:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:60:       ORDER BY published_at DESC NULLS LAST
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:63:    return { doctor, articles: articleRows.map(normalizeArticle) };
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:96:        {data.doctor.bio ? <ArticleBody markdown={data.doctor.bio} hostOrigin={hostOrigin} /> : null}
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:103:                  <Link href={`${base}/insights/general/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:75:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:85:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:96:            href={`/admin/${params.instanceSlug}/doctors`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:102:            href={`/admin/${params.instanceSlug}/treatments`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:108:            href={`/admin/${params.instanceSlug}/articles`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:111:            description="Article"
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:120:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:136:      href={href}
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:4:// v0.1 단계: DB CHECK 가 status='draft' 만 허용하고 RLS 는 status='published' 만 SELECT.
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:6:// 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:12:import { ArticleBody } from "@/components/site/ArticleBody";
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:20:  robots: { index: false, follow: true },
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:30:  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:35:        FROM legal_document
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:36:       WHERE document_type = ${params.type}::legal_document_type
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:41:  if (!legal) notFound();
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:51:        { label: legal.title, href: null },
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:54:        <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:55:        <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
apps/web/src\app\(site)\[instanceSlug]\legal\[type]\page.tsx:56:        <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:59:          href={`/admin/${params.instanceSlug}/doctors/new`}
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:12:import { ArticleForm } from "@/components/forms/ArticleForm";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:13:import { saveArticle } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:15:export default async function ArticleNewPage({ params }: { params: { instanceSlug: string } }) {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:44:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:53:  const bound = saveArticle.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:60:      <ArticleForm action={bound} initial={null} isNew doctorOptions={doctorOptions} />
apps/web/src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:8:import { ArticleBody } from "@/components/site/ArticleBody";
apps/web/src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:23:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:32:    canonicalPath: `/treatments/${t.slug}`,
apps/web/src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:48:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:83:          <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:4://   - WEB-12 published_at 정책: unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade (Plan v1.0)
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:46:  status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:94:      const isPublished = parsed.data.status === "published";
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:97:        const beforeRows = await tx<{ id: string; published_at: Date | null }[]>`
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:98:          SELECT id, published_at FROM treatment_page
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:103:        // cycle1-3entity WEB-12 / cycle2-3entity WEB-22: published 일 때만 timestamp 부여 (기존 published_at 보존)
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:105:        const beforePublishedAt = beforeRows[0]!.published_at;
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:113:                 status = ${parsed.data.status}::content_publication_status,
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:116:                 published_at = ${newPublishedAt},
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:125:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, published_at
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:132:          ${parsed.data.status}::content_publication_status,
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:151:          payload: { contentType: "TreatmentPage", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:177:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:229:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:7:import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:9:import { ArticleBody } from "@/components/site/ArticleBody";
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:23:    const rows = await tx<ArticleRow[]>`
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:24:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:27:    return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:39:export default async function ArticleDetailPage({
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:50:    const rows = await tx<ArticleRow[]>`
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:51:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:57:    const article = normalizeArticle(rows[0]!);
apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:106:          <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:10:import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:12:import { deleteArticle, saveArticle } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:14:export default async function ArticleEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:29:  let bundle: { initial: ArticleInitial; doctorOptions: ReadonlyArray<{ value: string; label: string }> } | null;
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:33:    async (tx, ctx): Promise<{ initial: ArticleInitial; doctorOptions: ReadonlyArray<{ value: string; label: string }> } | null> => {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:40:        status: string;
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:46:               status::text AS status,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:69:          status: r.status,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:84:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:94:  const boundSave = saveArticle.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:95:  const boundDelete = deleteArticle.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:104:      <ArticleForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:11:type Row = { slug: string; title: string; status: string; risk_level: string | null; updated_at: Date; published_at: Date | null };
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:35:          SELECT slug, title, status::text AS status, risk_level::text AS risk_level, updated_at, published_at
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:86:                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span>
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:89:                <td className="px-3 py-2 text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : "—"}</td>
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/admin/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:69:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:40:        status: string;
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:45:               status::text AS status,
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:59:        status: r.status,
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:68:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/db/migrations/D0011_public_reader.sql' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/public-tenant.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/site-metadata.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/site-url.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 648ms:
   1: // @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
   3: //
   4: // 공개 사이트 SSR 단계의 instance lookup + RLS scope 설정.
   5: // 흐름:
   6: //   1. instance slug 조회 (RLS public_reader_instance_select policy USING active=true)
   7: //   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
   8: //   3. callback 실행 (content table SELECT 가 RLS 자동 적용)
   9: //   4. return result
  10: 
  11: import type { Sql } from "postgres";
  12: import { getSqlPublic } from "./public-db";
  13: 
  14: export type PublicTenantContext = {
  15:   readonly instanceId: string;
  16:   readonly instanceSlug: string;
  17: };
  18: 
  19: /**
  20:  * 공개 사이트 SSR 단계의 instance lookup + transaction-scoped RLS scope 설정.
  21:  *
  22:  * @param instanceSlug — URL path 안 [instanceSlug] (URL slug 정규식 검증은 callback 진입 전 별도)
  23:  * @param fn — instance scope 안 SELECT 콜백. tx 는 같은 connection 의 transaction sql tag.
  24:  * @returns fn 결과. instance 미존재 / inactive 시 null
  25:  */
  26: export async function withPublicTenantTransaction<T>(
  27:   instanceSlug: string,
  28:   fn: (tx: Sql, ctx: PublicTenantContext) => Promise<T>,
  29: ): Promise<T | null> {
  30:   const sql = getSqlPublic();
  31:   // postgres-js begin() 은 자동 transaction.
  32:   return sql.begin(async (tx) => {
  33:     // 1) instance lookup — RLS public_reader_instance_select policy USING active=true
  34:     const rows = await tx<{ id: string }[]>`
  35:       SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1
  36:     `;
  37:     if (rows.length === 0) return null;
  38:     const instanceId = rows[0]!.id;
  39: 
  40:     // 2) transaction-scoped instance scope
  41:     await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
  42: 
  43:     // 3) callback
  44:     return fn(tx, { instanceId, instanceSlug });
  45:   });
  46: }

 succeeded in 666ms:
   1: -- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
   2: -- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
   3: --
   4: -- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
   5: -- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
   6: --
   7: -- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).
   8: 
   9: -- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
  10: -- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
  11: CREATE ROLE app_public_reader LOGIN PASSWORD 'app_public_reader_pw';
  12: 
  13: GRANT USAGE ON SCHEMA public TO app_public_reader;
  14: 
  15: -- ===== instance lookup policy =====
  16: -- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
  17: -- 별도 policy (active=true 만 노출).
  18: GRANT SELECT ON instance TO app_public_reader;
  19: 
  20: CREATE POLICY public_reader_instance_select
  21:   ON instance
  22:   FOR SELECT
  23:   TO app_public_reader
  24:   USING (active = true);
  25: 
  26: -- ===== 6 content table per-table policy =====
  27: -- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
  28: -- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.
  29: 
  30: GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
  31:                 treatment_page, article, legal_document
  32:   TO app_public_reader;
  33: 
  34: CREATE POLICY public_reader_clinic_profile_select
  35:   ON clinic_profile FOR SELECT TO app_public_reader
  36:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  37: 
  38: CREATE POLICY public_reader_location_profile_select
  39:   ON location_profile FOR SELECT TO app_public_reader
  40:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  41: 
  42: CREATE POLICY public_reader_doctor_profile_select
  43:   ON doctor_profile FOR SELECT TO app_public_reader
  44:   USING (
  45:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  46:     AND active = true
  47:   );
  48: 
  49: -- TreatmentPage: published + 미래 발행 제외
  50: CREATE POLICY public_reader_treatment_page_select
  51:   ON treatment_page FOR SELECT TO app_public_reader
  52:   USING (
  53:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  54:     AND status = 'published'
  55:     AND published_at IS NOT NULL
  56:     AND published_at <= now()
  57:   );
  58: 
  59: CREATE POLICY public_reader_article_select
  60:   ON article FOR SELECT TO app_public_reader
  61:   USING (
  62:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  63:     AND status = 'published'
  64:     AND published_at IS NOT NULL
  65:     AND published_at <= now()
  66:   );
  67: 
  68: -- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
  69: --   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
  70: CREATE POLICY public_reader_legal_document_select
  71:   ON legal_document FOR SELECT TO app_public_reader
  72:   USING (
  73:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  74:     AND status = 'published'
  75:   );

 succeeded in 652ms:
   1: // @glitzy/web/lib/site-url — request-aware site base URL helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
   3: 
   4: import { headers } from "next/headers";
   5: 
   6: /**
   7:  * Compute the v0.1 path-based site base URL for the current request.
   8:  * 예: `http://localhost:3000/glitzy-clinic`
   9:  * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
  10:  */
  11: export function siteBaseUrl(instanceSlug: string): string {
  12:   const h = headers();
  13:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  14:   const proto = h.get("x-forwarded-proto") ?? "http";
  15:   return `${proto}://${host}/${instanceSlug}`;
  16: }

 succeeded in 676ms:
   1: // @glitzy/web/lib/site-metadata — Next metadata 공통 헬퍼
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06
   3: 
   4: import type { Metadata, ResolvingMetadata } from "next";
   5: import type { ClinicProjection } from "./db-projection";
   6: 
   7: export type PageMetaInput = {
   8:   /** Next.js metadata title — page-specific (e.g. "소개", "의료진"). 자동으로 `${title} | ${clinic.name}` 결합 */
   9:   pageTitle: string;
  10:   /** page-specific description (50~160자 권장). 부재 시 clinic.description fallback */
  11:   description?: string;
  12:   /** og:type — P-001/2/3/5/12/13/14 = "website" · P-004 = "profile" · P-006/P-010 = "article" */
  13:   ogType?: "website" | "profile" | "article";
  14:   /** page 의 hero image URL — 부재 시 clinic.ogImageUrl fallback */
  15:   imageUrl?: string;
  16:   /** canonical path (e.g. "/about", "/doctors/hong"). instance prefix 자동 prepend */
  17:   canonicalPath?: string;
  18:   /** robots: index — P-013 Legal v0.1 false */
  19:   noindex?: boolean;
  20: };
  21: 
  22: /**
  23:  * Build Next.js metadata for a site page.
  24:  *
  25:  * @param clinic — site initial 의 clinic projection (Header/Footer 공통)
  26:  * @param instanceSlug — URL prefix
  27:  * @param input — page-specific overrides
  28:  */
  29: export function buildPageMetadata(
  30:   clinic: ClinicProjection,
  31:   instanceSlug: string,
  32:   input: PageMetaInput,
  33: ): Metadata {
  34:   const title = input.pageTitle === clinic.name
  35:     ? clinic.name
  36:     : `${input.pageTitle} | ${clinic.name}`;
  37:   const description = input.description ?? clinic.description;
  38:   const image = input.imageUrl ?? clinic.ogImageUrl;
  39:   const canonicalPath = input.canonicalPath ?? "/";
  40:   const canonical = `/${instanceSlug}${canonicalPath === "/" ? "" : canonicalPath}`;
  41: 
  42:   return {
  43:     title,
  44:     description,
  45:     alternates: { canonical },
  46:     openGraph: {
  47:       title,
  48:       description,
  49:       type: input.ogType ?? "website",
  50:       url: canonical,
  51:       images: image ? [{ url: image }] : undefined,
  52:       locale: "ko_KR",
  53:       siteName: clinic.name,
  54:     },
  55:     twitter: {
  56:       card: "summary_large_image",
  57:       title,
  58:       description,
  59:       images: image ? [image] : undefined,
  60:     },
  61:     robots: {
  62:       index: input.noindex ? false : true,
  63:       follow: true,
  64:     },
  65:     // PSR-SEO-02 (cycle3 PSR-29 정정): themeColor 출처 BrandTokens.colors.light/dark.primary
  66:     // v0.1 default — DESIGN_TOKENS § 3.2 color.brand.primary light=#2563eb · dark=#60a5fa
  67:     themeColor: [
  68:       { media: "(prefers-color-scheme: light)", color: "#2563eb" },
  69:       { media: "(prefers-color-scheme: dark)", color: "#60a5fa" },
  70:     ],
  71:   };
  72: }
  73: 
  74: export type { Metadata, ResolvingMetadata };

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/layout.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/markdown.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 672ms:
   1: // @glitzy/web/(site)/[instanceSlug]/layout — 공개 사이트 layout (fragment only)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)
   3: 
   4: import { notFound } from "next/navigation";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { SiteHeader } from "@/components/site/SiteHeader";
   7: import { SiteFooter } from "@/components/site/SiteFooter";
   8: 
   9: export const revalidate = 60;
  10: 
  11: export default async function SiteLayout({
  12:   params,
  13:   children,
  14: }: {
  15:   params: { instanceSlug: string };
  16:   children: React.ReactNode;
  17: }) {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) notFound();
  20:   return (
  21:     <>
  22:       <SiteHeader initial={initial} />
  23:       <main className="min-h-screen">{children}</main>
  24:       <SiteFooter initial={initial} />
  25:     </>
  26:   );
  27: }

 succeeded in 665ms:
   1: // @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
   2: // SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { headers } from "next/headers";
   7: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   8: 
   9: type SitemapEntry = {
  10:   loc: string;
  11:   lastmod: string; // ISO 8601
  12:   changefreq: "weekly" | "monthly" | "yearly";
  13:   priority: string;
  14: };
  15: 
  16: function urlOrigin(): string {
  17:   const h = headers();
  18:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  19:   const proto = h.get("x-forwarded-proto") ?? "http";
  20:   return `${proto}://${host}`;
  21: }
  22: 
  23: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  24:   const origin = urlOrigin();
  25:   const base = `${origin}/${params.instanceSlug}`;
  26:   const now = new Date().toISOString();
  27: 
  28:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  29:     const clinicRows = await tx<{ updated_at: Date }[]>`
  30:       SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
  31:     `;
  32:     const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
  33:       SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
  34:     `;
  35:     const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
  36:       SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
  37:     `;
  38:     const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  39:       SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
  40:     `;
  41:     const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  42:       SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
  43:     `;
  44:     return {
  45:       clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? now,
  46:       locationMain: locationRows[0] ?? null,
  47:       doctors: doctorRows,
  48:       treatments: treatmentRows,
  49:       articles: articleRows,
  50:     };
  51:   });
  52:   if (!data) return new NextResponse("instance not found", { status: 404 });
  53: 
  54:   const entries: SitemapEntry[] = [];
  55:   // P-001 Home
  56:   entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
  57:   // P-002 About
  58:   entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
  59:   // P-003 Doctors List
  60:   if (data.doctors.length > 0) {
  61:     const latest = data.doctors[0]!.updated_at.toISOString();
  62:     entries.push({ loc: `${base}/doctors`, lastmod: latest, changefreq: "monthly", priority: "0.7" });
  63:   }
  64:   // P-004 Doctor Profile (each)
  65:   for (const d of data.doctors) {
  66:     entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
  67:   }
  68:   // P-005 Treatments List
  69:   if (data.treatments.length > 0) {
  70:     const latest = data.treatments[0]!.updated_at.toISOString();
  71:     entries.push({ loc: `${base}/treatments`, lastmod: latest, changefreq: "monthly", priority: "0.8" });
  72:   }
  73:   // P-006 Treatment Detail (each)
  74:   for (const t of data.treatments) {
  75:     entries.push({
  76:       loc: `${base}/treatments/${t.slug}`,
  77:       lastmod: (t.published_at ?? t.updated_at).toISOString(),
  78:       changefreq: "monthly",
  79:       priority: "0.8",
  80:     });
  81:   }
  82:   // P-010 Article Detail (각 article — v0.1 fallback category `general`)
  83:   for (const a of data.articles) {
  84:     entries.push({
  85:       loc: `${base}/insights/general/${a.slug}`,
  86:       lastmod: (a.published_at ?? a.updated_at).toISOString(),
  87:       changefreq: "monthly",
  88:       priority: "0.5",
  89:     });
  90:   }
  91:   // P-012 Contact
  92:   entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
  93:   // P-014 Location Detail
  94:   if (data.locationMain) {
  95:     entries.push({
  96:       loc: `${base}/locations/${data.locationMain.slug}`,
  97:       lastmod: data.locationMain.updated_at.toISOString(),
  98:       changefreq: "monthly",
  99:       priority: "0.7",
 100:     });
 101:   }
 102:   // P-013 Legal — v0.1 단계 sitemap 제외 (noindex · PSR-SEO-07)
 103: 
 104:   const xml = renderSitemap(entries);
 105:   return new NextResponse(xml, {
 106:     status: 200,
 107:     headers: { "content-type": "application/xml; charset=utf-8" },
 108:   });
 109: }
 110: 
 111: function renderSitemap(entries: SitemapEntry[]): string {
 112:   const urls = entries.map((e) => `  <url>
 113:     <loc>${escapeXml(e.loc)}</loc>
 114:     <lastmod>${e.lastmod}</lastmod>
 115:     <changefreq>${e.changefreq}</changefreq>
 116:     <priority>${e.priority}</priority>
 117:   </url>`).join("\n");
 118:   return `<?xml version="1.0" encoding="UTF-8"?>
 119: <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 120: ${urls}
 121: </urlset>`;
 122: }
 123: 
 124: function escapeXml(s: string): string {
 125:   return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
 126: }

 succeeded in 648ms:
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
  50:       a: (tagName, attribs) => {
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
 139: function isExternalLink(href: string, hostOrigin: string): boolean {
 140:   if (href.startsWith("/") || href.startsWith("#")) return false;
 141:   try {
 142:     const u = new URL(href, hostOrigin);
 143:     const host = new URL(hostOrigin).host;
 144:     return u.host !== host;
 145:   } catch {
 146:     return false;
 147:   }
 148: }

 succeeded in 662ms:
   1: // @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
   2: // SoT: SEARCH_STANDARDIZATION § 3.3 disallowTraining 출력 예시 (line-by-line 정합)
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { headers } from "next/headers";
   7: 
   8: function urlOrigin(): string {
   9:   const h = headers();
  10:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  11:   const proto = h.get("x-forwarded-proto") ?? "http";
  12:   return `${proto}://${host}`;
  13: }
  14: 
  15: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  16:   const origin = urlOrigin();
  17:   const sitemapUrl = `${origin}/${params.instanceSlug}/sitemap.xml`;
  18: 
  19:   // SEARCH_STANDARDIZATION § 3.3 `disallowTraining` 출력 예시 그대로 (v0.1 starter)
  20:   // 운영 단계 ClinicProfile.metadata.aiCrawlerPolicy row-driven 합류는 PSR-DEFER-10
  21:   const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
  22: 
  23: # 일반 룰
  24: User-agent: *
  25: Disallow: /admin/
  26: Disallow: /auth/
  27: Disallow: /api/
  28: Allow: /
  29: 
  30: # A. 일반 검색 색인 — Allow
  31: User-agent: Googlebot
  32: Allow: /
  33: 
  34: User-agent: Yeti
  35: Allow: /
  36: 
  37: User-agent: Bingbot
  38: Allow: /
  39: 
  40: # B. AI 검색 인덱싱·답변용 — Allow
  41: User-agent: OAI-SearchBot
  42: Allow: /
  43: 
  44: User-agent: PerplexityBot
  45: Allow: /
  46: 
  47: User-agent: Claude-SearchBot
  48: Allow: /
  49: 
  50: # C. User-triggered fetch — Allow
  51: User-agent: ChatGPT-User
  52: Allow: /
  53: 
  54: User-agent: Perplexity-User
  55: Allow: /
  56: 
  57: User-agent: Claude-User
  58: Allow: /
  59: 
  60: # D. AI 학습·모델 개선용 — Disallow
  61: User-agent: GPTBot
  62: Disallow: /
  63: 
  64: User-agent: ClaudeBot
  65: Disallow: /
  66: 
  67: User-agent: Google-Extended
  68: Disallow: /
  69: 
  70: User-agent: CCBot
  71: Disallow: /
  72: 
  73: User-agent: anthropic-ai
  74: Disallow: /
  75: 
  76: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
  77: 
  78: Sitemap: ${sitemapUrl}
  79: `;
  80: 
  81:   return new NextResponse(body, {
  82:     status: 200,
  83:     headers: { "content-type": "text/plain; charset=utf-8" },
  84:   });
  85: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/core/SEARCH_STANDARDIZATION.md' | ForEach-Object { "'$i++; if($i -ge 190 -and $i -le 250){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/core/SEARCH_STANDARDIZATION.md' | ForEach-Object { "'$i++; if($i -ge 345 -and $i -le 366){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 434 -and $i -le 456){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 468 -and $i -le 531){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 672ms:
 190: #### `aiCrawlerPolicy: disallowTraining` (권장 기본)
 191: 
 192: ```
 193: # robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
 194: 
 195: # 일반 룰
 196: User-agent: *
 197: Disallow: /admin/
 198: Disallow: /auth/
 199: Disallow: /api/
 200: Allow: /
 201: 
 202: # A. 일반 검색 색인 — Allow
 203: User-agent: Googlebot
 204: Allow: /
 205: 
 206: User-agent: Yeti
 207: Allow: /
 208: 
 209: User-agent: Bingbot
 210: Allow: /
 211: 
 212: # B. AI 검색 인덱싱·답변용 — Allow
 213: User-agent: OAI-SearchBot
 214: Allow: /
 215: 
 216: User-agent: PerplexityBot
 217: Allow: /
 218: 
 219: User-agent: Claude-SearchBot
 220: Allow: /
 221: 
 222: # C. User-triggered fetch — Allow
 223: User-agent: ChatGPT-User
 224: Allow: /
 225: 
 226: User-agent: Perplexity-User
 227: Allow: /
 228: 
 229: User-agent: Claude-User
 230: Allow: /
 231: 
 232: # D. AI 학습·모델 개선용 — Disallow
 233: User-agent: GPTBot
 234: Disallow: /
 235: 
 236: User-agent: ClaudeBot
 237: Disallow: /
 238: 
 239: User-agent: Google-Extended
 240: Disallow: /
 241: 
 242: User-agent: CCBot
 243: Disallow: /
 244: 
 245: User-agent: anthropic-ai
 246: Disallow: /
 247: 
 248: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
 249: 
 250: Sitemap: https://{domain}/sitemap.xml

 succeeded in 679ms:
 345: ### 4.3 페이지별 changefreq·priority 기본값
 346: 
 347: | 페이지 타입 | changefreq | priority |
 348: |---|---|---|
 349: | P-001 Home | weekly | 1.0 |
 350: | P-002 About | monthly | 0.8 |
 351: | P-003 Doctors List | monthly | 0.7 |
 352: | P-004 Doctor Profile | monthly | 0.7 |
 353: | P-005 Treatments List | monthly | 0.8 |
 354: | P-006 Treatment Detail | monthly | 0.8 |
 355: | P-007 Conditions List | monthly | 0.6 |
 356: | P-008 Condition Detail | monthly | 0.6 |
 357: | P-009 Articles List | weekly | 0.6 |
 358: | P-010 Article Detail | monthly | 0.5 |
 359: | P-011 FAQ | monthly | 0.5 |
 360: | P-012 Contact | yearly | 0.6 |
 361: | P-013 Legal | yearly | 0.3 |
 362: | P-014 Location Detail | monthly | 0.7 |
 363: | P-101 ~ P-106 | yearly | 0.4 |
 364: 
 365: ### 4.4 lastmod 출력
 366: 

 succeeded in 675ms:
 434: ### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)
 435: 
 436: - `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
 437: - 응답: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod SoT 정합.
 438: - **changefreq · priority (SEARCH_STANDARDIZATION § 4.3 그대로)**:
 439: 
 440: | 페이지 | changefreq | priority |
 441: |---|---|---|
 442: | P-001 Home | weekly | 1.0 |
 443: | P-002 About | monthly | 0.8 |
 444: | P-003 Doctors List | monthly | 0.7 |
 445: | P-004 Doctor Profile | monthly | 0.7 |
 446: | P-005 Treatments List | monthly | 0.8 |
 447: | P-006 Treatment Detail | monthly | 0.8 |
 448: | P-010 Article Detail | monthly | 0.5 |
 449: | P-012 Contact | yearly | 0.6 |
 450: | P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
 451: | P-014 Location Detail | monthly | 0.7 |
 452: 
 453: - **lastmod (SEARCH_STANDARDIZATION § 4.4 그대로)**:
 454:   - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
 455:   - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
 456:   - ClinicProfile/Location: `updated_at` (DATA_MODEL § 2.2 `@updatedAt`).

 succeeded in 659ms:
 468: **결정 (v0.1 starter template)** — cycle2 PSR-22 정정 (SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로):
 469: - (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
 470: 
 471: ```
 472: # robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
 473: 
 474: # 일반 룰
 475: User-agent: *
 476: Disallow: /admin/
 477: Disallow: /auth/
 478: Disallow: /api/
 479: Allow: /
 480: 
 481: # A. 일반 검색 색인 — Allow
 482: User-agent: Googlebot
 483: Allow: /
 484: 
 485: User-agent: Yeti
 486: Allow: /
 487: 
 488: User-agent: Bingbot
 489: Allow: /
 490: 
 491: # B. AI 검색 인덱싱·답변용 — Allow
 492: User-agent: OAI-SearchBot
 493: Allow: /
 494: 
 495: User-agent: PerplexityBot
 496: Allow: /
 497: 
 498: User-agent: Claude-SearchBot
 499: Allow: /
 500: 
 501: # C. User-triggered fetch — Allow
 502: User-agent: ChatGPT-User
 503: Allow: /
 504: 
 505: User-agent: Perplexity-User
 506: Allow: /
 507: 
 508: User-agent: Claude-User
 509: Allow: /
 510: 
 511: # D. AI 학습·모델 개선용 — Disallow
 512: User-agent: GPTBot
 513: Disallow: /
 514: 
 515: User-agent: ClaudeBot
 516: Disallow: /
 517: 
 518: User-agent: Google-Extended
 519: Disallow: /
 520: 
 521: User-agent: CCBot
 522: Disallow: /
 523: 
 524: User-agent: anthropic-ai
 525: Disallow: /
 526: 
 527: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
 528: 
 529: Sitemap: https://{domain}/sitemap.xml
 530: ```
 531: 

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/json-ld/entities.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/json-ld/builders.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/json-ld/__tests__/validate.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/json-ld/JsonLdScript.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 622ms:
   1: // @glitzy/web/lib/json-ld/JsonLdScript — 통합 graph 단일 <script> 출력
   2: // SoT: SCHEMA_MAPPING § 1.1 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4
   3: 
   4: import type { JsonLdGraph } from "./types";
   5: 
   6: export function JsonLdScript({ graph }: { graph: JsonLdGraph }) {
   7:   const json = JSON.stringify(graph);
   8:   return (
   9:     <script
  10:       type="application/ld+json"
  11:       // eslint-disable-next-line react/no-danger
  12:       dangerouslySetInnerHTML={{ __html: json }}
  13:     />
  14:   );
  15: }

 succeeded in 669ms:
   1: // @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
   3: //
   4: // 통과 기준:
   5: //   1. JSON parse OK
   6: //   2. @context = "https://schema.org" + @graph 배열
   7: //   3. @id 유일 (graph 안 중복 없음)
   8: //   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
   9: //   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)
  10: 
  11: import type { JsonLdGraph, JsonLdEntity } from "../types";
  12: 
  13: export type ValidationResult =
  14:   | { ok: true }
  15:   | { ok: false; errors: string[] };
  16: 
  17: export function validateJsonLdGraph(graph: unknown): ValidationResult {
  18:   const errors: string[] = [];
  19: 
  20:   // (1)(2) shape
  21:   if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  22:   const g = graph as Record<string, unknown>;
  23:   if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  24:   const arr = g["@graph"];
  25:   if (!Array.isArray(arr)) {
  26:     return { ok: false, errors: [...errors, "@graph must be array"] };
  27:   }
  28: 
  29:   // (3) @id 유일
  30:   const ids = new Set<string>();
  31:   const idMap = new Map<string, JsonLdEntity>();
  32:   for (const ent of arr) {
  33:     if (typeof ent !== "object" || ent === null) {
  34:       errors.push("entity must be object");
  35:       continue;
  36:     }
  37:     const e = ent as Record<string, unknown>;
  38:     if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
  39:     if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
  40:     if (typeof e["@id"] === "string") {
  41:       if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
  42:       ids.add(e["@id"]);
  43:       idMap.set(e["@id"], e as JsonLdEntity);
  44:     }
  45:   }
  46: 
  47:   // (4) cross-reference — graph 안 `{ "@id": "..." }` 참조가 idMap 안 또는 외부 dereferenceable URL
  48:   function checkRefs(value: unknown, path: string): void {
  49:     if (typeof value !== "object" || value === null) return;
  50:     if (Array.isArray(value)) {
  51:       value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
  52:       return;
  53:     }
  54:     const v = value as Record<string, unknown>;
  55:     if (typeof v["@id"] === "string" && Object.keys(v).length === 1) {
  56:       // pure @id reference (no @type beyond reference) — graph 안 entity 필요
  57:       const ref = v["@id"];
  58:       if (!ids.has(ref) && !ref.startsWith("https://") && !ref.startsWith("http://")) {
  59:         errors.push(`unresolved reference at ${path}: ${ref}`);
  60:       }
  61:     }
  62:     for (const [k, vv] of Object.entries(v)) {
  63:       if (k === "@type" || k === "@id") continue;
  64:       checkRefs(vv, `${path}.${k}`);
  65:     }
  66:   }
  67:   arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
  68: 
  69:   return errors.length === 0 ? { ok: true } : { ok: false, errors };
  70: }
  71: 
  72: /**
  73:  * 페이지 타입별 expected entity types 검증
  74:  */
  75: export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
  76:   const present = new Set(graph["@graph"].map((e) => e["@type"]));
  77:   const missing = expected.filter((t) => !present.has(t));
  78:   if (missing.length === 0) return { ok: true };
  79:   return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
  80: }

 succeeded in 675ms:
   1: // @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
   2: // SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10: } from "@/lib/db-projection";
  11: import type { JsonLdGraph, GraphBuilderContext } from "./types";
  12: import * as E from "./entities";
  13: 
  14: const CONTEXT = "https://schema.org" as const;
  15: 
  16: function graph(entities: ReturnType<typeof E.organizationEntity>[]): JsonLdGraph {
  17:   return { "@context": CONTEXT, "@graph": entities };
  18: }
  19: 
  20: // === P-001 Home ===
  21: export function homeGraph(
  22:   ctx: GraphBuilderContext,
  23:   clinic: ClinicProjection,
  24:   location: LocationProjection | null,
  25: ): JsonLdGraph {
  26:   const entities = [
  27:     E.organizationEntity(ctx, clinic),
  28:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  29:     E.webSiteEntity(ctx, clinic.name),
  30:     E.webPageEntity(ctx, clinic.name, clinic.description),
  31:   ];
  32:   return graph(entities);
  33: }
  34: 
  35: // === P-002 About ===
  36: export function aboutGraph(
  37:   ctx: GraphBuilderContext,
  38:   clinic: ClinicProjection,
  39:   location: LocationProjection | null,
  40:   title: string,
  41:   description: string,
  42: ): JsonLdGraph {
  43:   return graph([
  44:     E.organizationEntity(ctx, clinic),
  45:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  46:     E.webPageEntity(ctx, title, description),
  47:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
  48:   ]);
  49: }
  50: 
  51: // === P-003 Doctors List ===
  52: export function doctorsListGraph(
  53:   ctx: GraphBuilderContext,
  54:   clinic: ClinicProjection,
  55:   doctors: DoctorProjection[],
  56:   description: string,
  57: ): JsonLdGraph {
  58:   return graph([
  59:     E.organizationEntity(ctx, clinic),
  60:     E.webPageEntity(ctx, "의료진", description),
  61:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
  62:     E.itemListEntity(
  63:       ctx,
  64:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
  65:       "doctors",
  66:     ),
  67:   ]);
  68: }
  69: 
  70: // === P-004 Doctor Profile ===
  71: export function doctorProfileGraph(
  72:   ctx: GraphBuilderContext,
  73:   clinic: ClinicProjection,
  74:   doctor: DoctorProjection,
  75:   description: string,
  76: ): JsonLdGraph {
  77:   return graph([
  78:     E.organizationEntity(ctx, clinic),
  79:     E.physicianEntity(ctx, doctor),
  80:     E.webPageEntity(ctx, doctor.name, description),
  81:     E.breadcrumbListEntity(ctx, [
  82:       { name: "홈", path: "/" },
  83:       { name: "의료진", path: "/doctors" },
  84:       { name: doctor.name, path: null },
  85:     ]),
  86:   ]);
  87: }
  88: 
  89: // === P-005 Treatments List ===
  90: export function treatmentsListGraph(
  91:   ctx: GraphBuilderContext,
  92:   clinic: ClinicProjection,
  93:   treatments: TreatmentProjection[],
  94:   description: string,
  95: ): JsonLdGraph {
  96:   return graph([
  97:     E.organizationEntity(ctx, clinic),
  98:     E.webPageEntity(ctx, "진료", description),
  99:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
 100:     E.itemListEntity(
 101:       ctx,
 102:       treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
 103:       "treatments",
 104:     ),
 105:   ]);
 106: }
 107: 
 108: // === P-006 Treatment Detail ===
 109: export function treatmentDetailGraph(
 110:   ctx: GraphBuilderContext,
 111:   clinic: ClinicProjection,
 112:   location: LocationProjection | null,
 113:   treatment: TreatmentProjection,
 114:   description: string,
 115: ): JsonLdGraph {
 116:   return graph([
 117:     E.organizationEntity(ctx, clinic),
 118:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 119:     E.medicalProcedureEntity(ctx, treatment),
 120:     E.webPageEntity(ctx, treatment.name, description),
 121:     E.breadcrumbListEntity(ctx, [
 122:       { name: "홈", path: "/" },
 123:       { name: "진료", path: "/treatments" },
 124:       { name: treatment.name, path: null },
 125:     ]),
 126:   ]);
 127: }
 128: 
 129: // === P-010 Article Detail ===
 130: export function articleDetailGraph(
 131:   ctx: GraphBuilderContext,
 132:   clinic: ClinicProjection,
 133:   article: ArticleProjection,
 134:   author: DoctorProjection | null,
 135:   category: string,
 136: ): JsonLdGraph {
 137:   return graph([
 138:     E.organizationEntity(ctx, clinic),
 139:     E.articleEntity(ctx, article, author, category),
 140:     E.webPageEntity(ctx, article.headline, article.summary),
 141:     E.breadcrumbListEntity(ctx, [
 142:       { name: "홈", path: "/" },
 143:       { name: "인사이트", path: null },
 144:       { name: article.headline, path: null },
 145:     ]),
 146:   ]);
 147: }
 148: 
 149: // === P-012 Contact ===
 150: export function contactGraph(
 151:   ctx: GraphBuilderContext,
 152:   clinic: ClinicProjection,
 153:   location: LocationProjection,
 154:   description: string,
 155: ): JsonLdGraph {
 156:   return graph([
 157:     E.organizationEntity(ctx, clinic),
 158:     E.medicalClinicEntity(ctx, clinic, location),
 159:     E.webPageEntity(ctx, "연락처", description),
 160:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
 161:   ]);
 162: }
 163: 
 164: // === P-014 Location Detail ===
 165: export function locationDetailGraph(
 166:   ctx: GraphBuilderContext,
 167:   clinic: ClinicProjection,
 168:   location: LocationProjection,
 169:   description: string,
 170: ): JsonLdGraph {
 171:   return graph([
 172:     E.organizationEntity(ctx, clinic),
 173:     E.medicalClinicEntity(ctx, clinic, location),
 174:     E.webPageEntity(ctx, location.name, description),
 175:     E.breadcrumbListEntity(ctx, [
 176:       { name: "홈", path: "/" },
 177:       { name: "위치", path: null },
 178:       { name: location.name, path: null },
 179:     ]),
 180:   ]);
 181: }

 succeeded in 717ms:
   1: // @glitzy/web/lib/json-ld/entities — entity builder helpers
   2: // SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10:   PrimaryCta,
  11: } from "@/lib/db-projection";
  12: import { formatAddress } from "@/lib/db-projection";
  13: import type { JsonLdEntity, GraphBuilderContext } from "./types";
  14: 
  15: const NAVER_RESERVATION_CHANNELS = new Set(["phone", "email", "kakao-talk", "naver-reservation", "naver-talk", "form"]);
  16: 
  17: export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  18:   const id = `${ctx.siteBaseUrl}/#organization`;
  19:   const contactPoints = clinic.primaryCtas
  20:     .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
  21:     .map((c) => contactPointEntity(c));
  22:   return {
  23:     "@type": "Organization",
  24:     "@id": id,
  25:     name: clinic.name,
  26:     ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
  27:     description: clinic.description,
  28:     ...(clinic.slogan ? { slogan: clinic.slogan } : {}),
  29:     url: ctx.siteBaseUrl,
  30:     logo: clinic.logoUrl,
  31:     ...(clinic.founder ? { founder: { "@type": "Person", name: clinic.founder } } : {}),
  32:     ...(clinic.foundingDate ? { foundingDate: clinic.foundingDate } : {}),
  33:     ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  34:   };
  35: }
  36: 
  37: function contactPointEntity(cta: PrimaryCta): JsonLdEntity {
  38:   const contactType = cta.type === "phone" ? "reservations" : cta.label;
  39:   // schema.org ContactPoint 는 @id 가 권장 (entity identity). v0.1 단계는 cta.id 활용.
  40:   return {
  41:     "@type": "ContactPoint",
  42:     "@id": `#contact-${cta.id}`,
  43:     contactType,
  44:     ...(cta.type === "phone" && cta.targetUrl.startsWith("tel:") ? { telephone: cta.targetUrl.slice(4) } : { url: cta.targetUrl }),
  45:   } as JsonLdEntity;
  46: }
  47: 
  48: export function medicalClinicEntity(
  49:   ctx: GraphBuilderContext,
  50:   clinic: ClinicProjection,
  51:   location: LocationProjection,
  52: ): JsonLdEntity {
  53:   return {
  54:     "@type": "MedicalClinic",
  55:     "@id": `${ctx.siteBaseUrl}/#clinic`,
  56:     name: clinic.name,
  57:     parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
  58:     address: {
  59:       "@type": "PostalAddress",
  60:       streetAddress: location.streetAddress,
  61:       addressLocality: location.addressLocality,
  62:       addressRegion: location.addressRegion,
  63:       postalCode: location.postalCode,
  64:       addressCountry: location.addressCountry,
  65:     },
  66:     ...(location.telephone ? { telephone: location.telephone } : {}),
  67:     ...(location.email ? { email: location.email } : {}),
  68:     ...(location.latitude !== null && location.longitude !== null ? {
  69:       geo: {
  70:         "@type": "GeoCoordinates",
  71:         latitude: location.latitude,
  72:         longitude: location.longitude,
  73:       },
  74:     } : {}),
  75:     ...(location.businessHours.openingHours.length > 0 ? {
  76:       openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
  77:         "@type": "OpeningHoursSpecification",
  78:         dayOfWeek: oh.dayOfWeek.map((d) => `https://schema.org/${d}`),
  79:         opens: oh.opens,
  80:         closes: oh.closes,
  81:       })),
  82:     } : {}),
  83:   };
  84: }
  85: 
  86: export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  87:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
  88: }
  89: 
  90: export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  91:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
  92: }
  93: 
  94: export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  95:   return {
  96:     "@type": "Physician",
  97:     "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
  98:     name: doctor.name,
  99:     ...(doctor.title ? { jobTitle: doctor.title } : {}),
 100:     ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
 101:     ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
 102:     worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
 103:     medicalSpecialty: "MedicalSpecialty",
 104:   };
 105: }
 106: 
 107: export function medicalProcedureEntity(ctx: GraphBuilderContext, treatment: TreatmentProjection): JsonLdEntity {
 108:   return {
 109:     "@type": "MedicalProcedure",
 110:     "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
 111:     name: treatment.name,
 112:     description: treatment.summary,
 113:     ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
 114:   };
 115: }
 116: 
 117: export function articleEntity(
 118:   ctx: GraphBuilderContext,
 119:   article: ArticleProjection,
 120:   author: DoctorProjection | null,
 121:   category: string,
 122: ): JsonLdEntity {
 123:   return {
 124:     "@type": "Article",
 125:     "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
 126:     headline: article.headline,
 127:     description: article.summary,
 128:     inLanguage: "ko-KR",
 129:     ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
 130:     ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
 131:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 132:     ...(author ? { author: { "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician` } } : {}),
 133:   };
 134: }
 135: 
 136: export function webPageEntity(ctx: GraphBuilderContext, title: string, description: string): JsonLdEntity {
 137:   return {
 138:     "@type": "WebPage",
 139:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
 140:     url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
 141:     name: title,
 142:     description,
 143:     inLanguage: "ko-KR",
 144:     isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
 145:   };
 146: }
 147: 
 148: export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
 149:   return {
 150:     "@type": "WebSite",
 151:     "@id": `${ctx.siteBaseUrl}/#website`,
 152:     name,
 153:     url: ctx.siteBaseUrl,
 154:     inLanguage: "ko-KR",
 155:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 156:   };
 157: }
 158: 
 159: export function breadcrumbListEntity(
 160:   ctx: GraphBuilderContext,
 161:   items: Array<{ name: string; path: string | null }>,
 162: ): JsonLdEntity {
 163:   return {
 164:     "@type": "BreadcrumbList",
 165:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
 166:     itemListElement: items.map((it, i) => ({
 167:       "@type": "ListItem",
 168:       position: i + 1,
 169:       name: it.name,
 170:       ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
 171:     })),
 172:   };
 173: }
 174: 
 175: export function itemListEntity(
 176:   ctx: GraphBuilderContext,
 177:   items: Array<{ name: string; itemId: string }>,
 178:   listId: string,
 179: ): JsonLdEntity {
 180:   return {
 181:     "@type": "ItemList",
 182:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
 183:     itemListElement: items.map((it, i) => ({
 184:       "@type": "ListItem",
 185:       position: i + 1,
 186:       item: { "@id": it.itemId, name: it.name },
 187:     })),
 188:   };
 189: }
 190: 
 191: function stripMarkdown(md: string): string {
 192:   return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
 193: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 674ms:
   1: // @glitzy/web/(site)/[instanceSlug]/doctors — P-003 Doctors List
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   6: import { normalizeDoctor, type DoctorProfileRow } from "@/lib/db-projection";
   7: import { loadSiteInitial } from "@/lib/site-initial";
   8: import { DoctorCard } from "@/components/site/DoctorCard";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { doctorsListGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) return {};
  20:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  21:     pageTitle: "의료진",
  22:     description: `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
  23:     canonicalPath: "/doctors",
  24:   });
  25: }
  26: 
  27: export default async function DoctorsListPage({ params }: { params: { instanceSlug: string } }) {
  28:   const initial = await loadSiteInitial(params.instanceSlug);
  29:   if (!initial) notFound();
  30:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  31:     const rows = await tx<DoctorProfileRow[]>`
  32:       SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  33:         FROM doctor_profile
  34:        ORDER BY display_order ASC, id ASC
  35:     `;
  36:     return rows.map(normalizeDoctor);
  37:   });
  38:   if (!data) notFound();
  39:   const base = `/${params.instanceSlug}`;
  40:   const graph = doctorsListGraph(
  41:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
  42:     initial.clinic,
  43:     data,
  44:     `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
  45:   );
  46: 
  47:   return (
  48:     <>
  49:       <JsonLdScript graph={graph} />
  50:       <Breadcrumb items={[{ label: "홈", href: base }, { label: "의료진", href: null }]} />
  51:       <section className="mx-auto max-w-6xl px-4 py-12">
  52:         <h1 className="mb-6 text-3xl font-bold text-fg-default">의료진</h1>
  53:         {data.length === 0 ? (
  54:           <p className="text-sm text-fg-muted">의료진 정보가 아직 등록되지 않았습니다.</p>
  55:         ) : (
  56:           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  57:             {data.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={base} />)}
  58:           </div>
  59:         )}
  60:       </section>
  61:     </>
  62:   );
  63: }

 succeeded in 667ms:
   1: // @glitzy/web/(site)/[instanceSlug]/treatments — P-005 Treatments List
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   6: import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
   7: import { loadSiteInitial } from "@/lib/site-initial";
   8: import { TreatmentCard } from "@/components/site/TreatmentCard";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { treatmentsListGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) return {};
  20:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  21:     pageTitle: "진료",
  22:     description: `${initial.clinic.name}의 진료 안내`,
  23:     canonicalPath: "/treatments",
  24:   });
  25: }
  26: 
  27: export default async function TreatmentsListPage({ params }: { params: { instanceSlug: string } }) {
  28:   const initial = await loadSiteInitial(params.instanceSlug);
  29:   if (!initial) notFound();
  30:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  31:     const rows = await tx<TreatmentPageRow[]>`
  32:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  33:         FROM treatment_page
  34:        ORDER BY published_at DESC NULLS LAST
  35:     `;
  36:     return rows.map(normalizeTreatment);
  37:   });
  38:   if (!data) notFound();
  39:   const base = `/${params.instanceSlug}`;
  40:   const graph = treatmentsListGraph(
  41:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
  42:     initial.clinic,
  43:     data,
  44:     `${initial.clinic.name}의 진료 안내`,
  45:   );
  46: 
  47:   return (
  48:     <>
  49:       <JsonLdScript graph={graph} />
  50:       <Breadcrumb items={[{ label: "홈", href: base }, { label: "진료", href: null }]} />
  51:       <section className="mx-auto max-w-6xl px-4 py-12">
  52:         <h1 className="mb-6 text-3xl font-bold text-fg-default">진료</h1>
  53:         {data.length === 0 ? (
  54:           <p className="text-sm text-fg-muted">등록된 진료 페이지가 없습니다.</p>
  55:         ) : (
  56:           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  57:             {data.map((t) => <TreatmentCard key={t.slug} treatment={t} baseHref={base} />)}
  58:           </div>
  59:         )}
  60:       </section>
  61:     </>
  62:   );
  63: }

 succeeded in 725ms:
   1: // @glitzy/web/(site)/[instanceSlug]/page — P-001 Home
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08 (Home row)
   3: //   Hero · DoctorsTeaser (3명) · TreatmentsTeaser (3건) · ContactCard
   4: 
   5: import { notFound } from "next/navigation";
   6: import Link from "next/link";
   7: import type { Metadata } from "next";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { withPublicTenantTransaction } from "@/lib/public-tenant";
  10: import {
  11:   normalizeDoctor,
  12:   normalizeTreatment,
  13:   type DoctorProfileRow,
  14:   type TreatmentPageRow,
  15: } from "@/lib/db-projection";
  16: import { Hero } from "@/components/site/Hero";
  17: import { DoctorCard } from "@/components/site/DoctorCard";
  18: import { TreatmentCard } from "@/components/site/TreatmentCard";
  19: import { buildPageMetadata } from "@/lib/site-metadata";
  20: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  21: import { homeGraph } from "@/lib/json-ld/builders";
  22: import { siteBaseUrl } from "@/lib/site-url";
  23: 
  24: export const revalidate = 60;
  25: 
  26: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  27:   const initial = await loadSiteInitial(params.instanceSlug);
  28:   if (!initial) return {};
  29:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  30:     pageTitle: initial.clinic.slogan ?? initial.clinic.name,
  31:     description: initial.clinic.description,
  32:     canonicalPath: "/",
  33:     ogType: "website",
  34:   });
  35: }
  36: 
  37: export default async function HomePage({ params }: { params: { instanceSlug: string } }) {
  38:   const initial = await loadSiteInitial(params.instanceSlug);
  39:   if (!initial) notFound();
  40: 
  41:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  42:     const doctorRows = await tx<DoctorProfileRow[]>`
  43:       SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  44:         FROM doctor_profile
  45:        ORDER BY display_order ASC, id ASC
  46:        LIMIT 3
  47:     `;
  48:     const treatmentRows = await tx<TreatmentPageRow[]>`
  49:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  50:         FROM treatment_page
  51:        ORDER BY published_at DESC NULLS LAST
  52:        LIMIT 3
  53:     `;
  54:     return {
  55:       doctors: doctorRows.map(normalizeDoctor),
  56:       treatments: treatmentRows.map(normalizeTreatment),
  57:     };
  58:   });
  59: 
  60:   const baseHref = `/${params.instanceSlug}`;
  61:   const cta = initial.clinic.primaryCtas[0] ?? null;
  62:   const graph = homeGraph(
  63:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
  64:     initial.clinic,
  65:     initial.locationMain,
  66:   );
  67: 
  68:   return (
  69:     <>
  70:       <JsonLdScript graph={graph} />
  71:       <Hero clinic={initial.clinic} cta={cta} />
  72: 
  73:       {data && data.doctors.length > 0 ? (
  74:         <section className="mx-auto max-w-6xl px-4 py-12">
  75:           <div className="mb-6 flex items-end justify-between">
  76:             <h2 className="text-2xl font-semibold text-fg-default">의료진</h2>
  77:             <Link href={`${baseHref}/doctors`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
  78:           </div>
  79:           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  80:             {data.doctors.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={baseHref} />)}
  81:           </div>
  82:         </section>
  83:       ) : null}
  84: 
  85:       {data && data.treatments.length > 0 ? (
  86:         <section className="mx-auto max-w-6xl px-4 py-12">
  87:           <div className="mb-6 flex items-end justify-between">
  88:             <h2 className="text-2xl font-semibold text-fg-default">진료</h2>
  89:             <Link href={`${baseHref}/treatments`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
  90:           </div>
  91:           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  92:             {data.treatments.map((t) => <TreatmentCard key={t.slug} treatment={t} baseHref={baseHref} />)}
  93:           </div>
  94:         </section>
  95:       ) : null}
  96:     </>
  97:   );
  98: }

 succeeded in 672ms:
   1: // @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
   3: 
   4: import { notFound } from "next/navigation";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { articleDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
  19:   if (params.category !== "general") return {};
  20:   const initial = await loadSiteInitial(params.instanceSlug);
  21:   if (!initial) return {};
  22:   const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  23:     const rows = await tx<ArticleRow[]>`
  24:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  25:         FROM article WHERE slug = ${params.slug} LIMIT 1
  26:     `;
  27:     return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  28:   });
  29:   if (!a) return {};
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: a.headline,
  32:     description: a.summary,
  33:     canonicalPath: `/insights/${params.category}/${a.slug}`,
  34:     ogType: "article",
  35:     imageUrl: a.heroImageUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function ArticleDetailPage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; category: string; slug: string };
  43: }) {
  44:   // v0.1 단일 fallback category `general` — PSR-DEFER-15
  45:   if (params.category !== "general") notFound();
  46:   const initial = await loadSiteInitial(params.instanceSlug);
  47:   if (!initial) notFound();
  48: 
  49:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  50:     const rows = await tx<ArticleRow[]>`
  51:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  52:         FROM article
  53:        WHERE slug = ${params.slug}
  54:        LIMIT 1
  55:     `;
  56:     if (rows.length === 0) return null;
  57:     const article = normalizeArticle(rows[0]!);
  58:     let author = null;
  59:     if (article.authorDoctorId) {
  60:       const doctorRows = await tx<DoctorProfileRow[]>`
  61:         SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  62:           FROM doctor_profile
  63:          WHERE id = ${article.authorDoctorId}::uuid
  64:          LIMIT 1
  65:       `;
  66:       author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
  67:     }
  68:     return { article, author };
  69:   });
  70:   if (!data) notFound();
  71: 
  72:   const base = `/${params.instanceSlug}`;
  73:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  74:   const graph = articleDetailGraph(
  75:     { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
  76:     initial.clinic,
  77:     data.article,
  78:     data.author,
  79:     params.category,
  80:   );
  81: 
  82:   return (
  83:     <>
  84:       <JsonLdScript graph={graph} />
  85:       <Breadcrumb items={[
  86:         { label: "홈", href: base },
  87:         { label: "인사이트", href: null },
  88:         { label: data.article.headline, href: null },
  89:       ]} />
  90:       <article className="mx-auto max-w-3xl px-4 py-12">
  91:         {data.article.heroImageUrl ? (
  92:           // eslint-disable-next-line @next/next/no-img-element
  93:           <img src={data.article.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  94:         ) : null}
  95:         <h1 className="text-3xl font-bold text-fg-default">{data.article.headline}</h1>
  96:         <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
  97:         <div className="mt-4 flex flex-wrap gap-3 text-sm text-fg-muted">
  98:           {data.article.publishedAt ? (
  99:             <time dateTime={data.article.publishedAt.toISOString()}>
 100:               {data.article.publishedAt.toISOString().slice(0, 10)}
 101:             </time>
 102:           ) : null}
 103:           {data.author ? <span>저자: {data.author.name}</span> : null}
 104:         </div>
 105:         <div className="mt-8">
 106:           <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
 107:         </div>
 108:       </article>
 109:     </>
 110:   );
 111: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/about/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/contact/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 671ms:
   1: // @glitzy/web/(site)/[instanceSlug]/about — P-002 About
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
   3: 
   4: import { notFound } from "next/navigation";
   5: import type { Metadata } from "next";
   6: import { loadSiteInitial } from "@/lib/site-initial";
   7: import { ArticleBody } from "@/components/site/ArticleBody";
   8: import { Breadcrumb } from "@/components/site/Breadcrumb";
   9: import { buildPageMetadata } from "@/lib/site-metadata";
  10: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  11: import { aboutGraph } from "@/lib/json-ld/builders";
  12: import { siteBaseUrl } from "@/lib/site-url";
  13: 
  14: export const revalidate = 60;
  15: 
  16: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  17:   const initial = await loadSiteInitial(params.instanceSlug);
  18:   if (!initial) return {};
  19:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  20:     pageTitle: "소개",
  21:     description: initial.clinic.description,
  22:     canonicalPath: "/about",
  23:     ogType: "website",
  24:   });
  25: }
  26: 
  27: export default async function AboutPage({ params }: { params: { instanceSlug: string } }) {
  28:   const initial = await loadSiteInitial(params.instanceSlug);
  29:   if (!initial) notFound();
  30:   const base = `/${params.instanceSlug}`;
  31:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  32:   const longDesc = initial.clinic.longDescription ?? initial.clinic.description;
  33:   const graph = aboutGraph(
  34:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
  35:     initial.clinic,
  36:     initial.locationMain,
  37:     `소개 | ${initial.clinic.name}`,
  38:     initial.clinic.description,
  39:   );
  40: 
  41:   return (
  42:     <>
  43:       <JsonLdScript graph={graph} />
  44:       <Breadcrumb items={[{ label: "홈", href: base }, { label: "소개", href: null }]} />
  45:       <section className="mx-auto max-w-3xl px-4 py-12">
  46:         <h1 className="mb-6 text-3xl font-bold text-fg-default">소개</h1>
  47:         <ArticleBody markdown={longDesc} hostOrigin={hostOrigin} />
  48:         {initial.clinic.founder || initial.clinic.foundingDate ? (
  49:           <dl className="mt-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
  50:             {initial.clinic.founder ? (
  51:               <div><dt className="text-fg-muted">설립자</dt><dd className="font-medium text-fg-default">{initial.clinic.founder}</dd></div>
  52:             ) : null}
  53:             {initial.clinic.foundingDate ? (
  54:               <div><dt className="text-fg-muted">설립일</dt><dd className="font-medium text-fg-default">{initial.clinic.foundingDate}</dd></div>
  55:             ) : null}
  56:             {initial.clinic.legalEntityName ? (
  57:               <div><dt className="text-fg-muted">법인명</dt><dd className="font-medium text-fg-default">{initial.clinic.legalEntityName}</dd></div>
  58:             ) : null}
  59:             {initial.clinic.businessRegistrationNumber ? (
  60:               <div><dt className="text-fg-muted">사업자등록번호</dt><dd className="font-medium text-fg-default">{initial.clinic.businessRegistrationNumber}</dd></div>
  61:             ) : null}
  62:           </dl>
  63:         ) : null}
  64:       </section>
  65:     </>
  66:   );
  67: }

 succeeded in 665ms:
   1: // @glitzy/web/(site)/[instanceSlug]/doctors/[slug] — P-004 Doctor Profile
   2: 
   3: import { notFound } from "next/navigation";
   4: import Link from "next/link";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeDoctor, normalizeArticle, type DoctorProfileRow, type ArticleRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { doctorProfileGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<DoctorProfileRow[]>`
  23:       SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  24:         FROM doctor_profile WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeDoctor(rows[0]!) : null;
  27:   });
  28:   if (!doctor) return {};
  29:   const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: doctor.name,
  32:     description,
  33:     canonicalPath: `/doctors/${doctor.slug}`,
  34:     ogType: "profile",
  35:     imageUrl: doctor.photoUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function DoctorProfilePage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; slug: string };
  43: }) {
  44:   const initial = await loadSiteInitial(params.instanceSlug);
  45:   if (!initial) notFound();
  46:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const doctorRows = await tx<(DoctorProfileRow & { id: string })[]>`
  48:       SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  49:         FROM doctor_profile
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     if (doctorRows.length === 0) return null;
  54:     const doctor = normalizeDoctor(doctorRows[0]!);
  55: 
  56:     const articleRows = await tx<ArticleRow[]>`
  57:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  58:         FROM article
  59:        WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
  60:        ORDER BY published_at DESC NULLS LAST
  61:        LIMIT 5
  62:     `;
  63:     return { doctor, articles: articleRows.map(normalizeArticle) };
  64:   });
  65:   if (!data) notFound();
  66: 
  67:   const base = `/${params.instanceSlug}`;
  68:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  69:   const graph = doctorProfileGraph(
  70:     { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
  71:     initial.clinic,
  72:     data.doctor,
  73:     data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
  74:   );
  75: 
  76:   return (
  77:     <>
  78:       <JsonLdScript graph={graph} />
  79:       <Breadcrumb items={[
  80:         { label: "홈", href: base },
  81:         { label: "의료진", href: `${base}/doctors` },
  82:         { label: data.doctor.name, href: null },
  83:       ]} />
  84:       <section className="mx-auto max-w-3xl px-4 py-12">
  85:         <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
  86:           {data.doctor.photoUrl ? (
  87:             // eslint-disable-next-line @next/next/no-img-element
  88:             <img src={data.doctor.photoUrl} alt="" className="h-32 w-32 rounded-full object-cover" />
  89:           ) : null}
  90:           <div>
  91:             <h1 className="text-3xl font-bold text-fg-default">{data.doctor.name}</h1>
  92:             {data.doctor.title ? <p className="mt-1 text-base text-fg-muted">{data.doctor.title}</p> : null}
  93:             {data.doctor.jobTitle ? <p className="mt-0.5 text-sm text-fg-muted">{data.doctor.jobTitle}</p> : null}
  94:           </div>
  95:         </header>
  96:         {data.doctor.bio ? <ArticleBody markdown={data.doctor.bio} hostOrigin={hostOrigin} /> : null}
  97:         {data.articles.length > 0 ? (
  98:           <section className="mt-12">
  99:             <h2 className="mb-4 text-xl font-semibold text-fg-default">작성 아티클</h2>
 100:             <ul className="flex flex-col gap-3">
 101:               {data.articles.map((a) => (
 102:                 <li key={a.slug} className="rounded-md border border-border bg-elevated p-3">
 103:                   <Link href={`${base}/insights/general/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
 104:                     {a.headline}
 105:                   </Link>
 106:                   <p className="mt-1 text-sm text-fg-muted">{a.summary}</p>
 107:                 </li>
 108:               ))}
 109:             </ul>
 110:           </section>
 111:         ) : null}
 112:       </section>
 113:     </>
 114:   );
 115: }

 succeeded in 663ms:
   1: // @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   6: import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
   7: import { loadSiteInitial } from "@/lib/site-initial";
   8: import { ArticleBody } from "@/components/site/ArticleBody";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { ReservationChannels } from "@/components/site/ReservationChannels";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { treatmentDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<TreatmentPageRow[]>`
  23:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  24:         FROM treatment_page WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  27:   });
  28:   if (!t) return {};
  29:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  30:     pageTitle: t.name,
  31:     description: t.summary,
  32:     canonicalPath: `/treatments/${t.slug}`,
  33:     ogType: "article",
  34:     imageUrl: t.heroImageUrl ?? undefined,
  35:   });
  36: }
  37: 
  38: export default async function TreatmentDetailPage({
  39:   params,
  40: }: {
  41:   params: { instanceSlug: string; slug: string };
  42: }) {
  43:   const initial = await loadSiteInitial(params.instanceSlug);
  44:   if (!initial) notFound();
  45: 
  46:   const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const rows = await tx<TreatmentPageRow[]>`
  48:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  49:         FROM treatment_page
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  54:   });
  55:   if (!treatment) notFound();
  56: 
  57:   const base = `/${params.instanceSlug}`;
  58:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  59:   const graph = treatmentDetailGraph(
  60:     { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
  61:     initial.clinic,
  62:     initial.locationMain,
  63:     treatment,
  64:     treatment.summary,
  65:   );
  66: 
  67:   return (
  68:     <>
  69:       <JsonLdScript graph={graph} />
  70:       <Breadcrumb items={[
  71:         { label: "홈", href: base },
  72:         { label: "진료", href: `${base}/treatments` },
  73:         { label: treatment.name, href: null },
  74:       ]} />
  75:       <section className="mx-auto max-w-3xl px-4 py-12">
  76:         {treatment.heroImageUrl ? (
  77:           // eslint-disable-next-line @next/next/no-img-element
  78:           <img src={treatment.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  79:         ) : null}
  80:         <h1 className="text-3xl font-bold text-fg-default">{treatment.name}</h1>
  81:         <p className="mt-2 text-base text-fg-muted">{treatment.summary}</p>
  82:         <div className="mt-8">
  83:           <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
  84:         </div>
  85:         {initial.clinic.primaryCtas.length > 0 ? (
  86:           <div className="mt-12 rounded-md border border-border bg-subtle p-6">
  87:             <h2 className="mb-3 text-lg font-semibold text-fg-default">예약 / 상담</h2>
  88:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  89:           </div>
  90:         ) : null}
  91:       </section>
  92:     </>
  93:   );
  94: }

 succeeded in 660ms:
   1: // @glitzy/web/(site)/[instanceSlug]/contact — P-012 Contact
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { formatAddress } from "@/lib/db-projection";
   7: import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
   8: import { ReservationChannels } from "@/components/site/ReservationChannels";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { contactGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) return {};
  20:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  21:     pageTitle: "연락처",
  22:     description: `${initial.clinic.name} 연락처 · 위치 · 진료 시간 · 예약 채널 안내`,
  23:     canonicalPath: "/contact",
  24:   });
  25: }
  26: 
  27: export default async function ContactPage({ params }: { params: { instanceSlug: string } }) {
  28:   const initial = await loadSiteInitial(params.instanceSlug);
  29:   if (!initial) notFound();
  30:   if (!initial.locationMain) {
  31:     return (
  32:       <section className="mx-auto max-w-3xl px-4 py-12 text-center text-sm text-fg-muted">
  33:         본원 위치 정보가 등록되지 않았습니다.
  34:       </section>
  35:     );
  36:   }
  37:   const base = `/${params.instanceSlug}`;
  38:   const loc = initial.locationMain;
  39:   const graph = contactGraph(
  40:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/contact" },
  41:     initial.clinic,
  42:     loc,
  43:     `${initial.clinic.name} 연락처 · 위치 · 진료 시간 · 예약 채널 안내`,
  44:   );
  45: 
  46:   return (
  47:     <>
  48:       <JsonLdScript graph={graph} />
  49:       <Breadcrumb items={[{ label: "홈", href: base }, { label: "연락처", href: null }]} />
  50:       <section className="mx-auto max-w-3xl px-4 py-12">
  51:         <h1 className="mb-2 text-3xl font-bold text-fg-default">연락처</h1>
  52:         <p className="mb-8 text-base text-fg-muted">방문·전화·예약 정보 안내</p>
  53: 
  54:         <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
  55:           <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
  56:           {loc.telephone ? <div><dt className="text-fg-muted">대표 전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
  57:           {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
  58:         </dl>
  59: 
  60:         <h2 className="mb-3 text-xl font-semibold text-fg-default">진료 시간</h2>
  61:         <BusinessHoursTable hours={loc.businessHours} />
  62: 
  63:         {initial.clinic.primaryCtas.length > 0 ? (
  64:           <>
  65:             <h2 className="mb-3 mt-10 text-xl font-semibold text-fg-default">예약 채널</h2>
  66:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  67:           </>
  68:         ) : null}
  69:       </section>
  70:     </>
  71:   );
  72: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/locations/[slug]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/site-initial.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/db-projection.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 670ms:
   1: // @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { formatAddress } from "@/lib/db-projection";
   7: import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
   8: import { ReservationChannels } from "@/components/site/ReservationChannels";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { locationDetailGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  18:   if (params.slug !== "main") return {};
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial || !initial.locationMain) return {};
  21:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  22:     pageTitle: initial.locationMain.name,
  23:     description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
  24:     canonicalPath: `/locations/${params.slug}`,
  25:   });
  26: }
  27: 
  28: export default async function LocationDetailPage({
  29:   params,
  30: }: {
  31:   params: { instanceSlug: string; slug: string };
  32: }) {
  33:   // v0.1 단계 main 만 지원 (PSR-DEFER-11 부분)
  34:   if (params.slug !== "main") notFound();
  35:   const initial = await loadSiteInitial(params.instanceSlug);
  36:   if (!initial || !initial.locationMain) notFound();
  37:   const loc = initial.locationMain;
  38:   const base = `/${params.instanceSlug}`;
  39:   const graph = locationDetailGraph(
  40:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
  41:     initial.clinic,
  42:     loc,
  43:     `${loc.name} · ${formatAddress(loc)}`,
  44:   );
  45: 
  46:   return (
  47:     <>
  48:       <JsonLdScript graph={graph} />
  49:       <Breadcrumb items={[
  50:         { label: "홈", href: base },
  51:         { label: "위치", href: null },
  52:         { label: loc.name, href: null },
  53:       ]} />
  54:       <section className="mx-auto max-w-3xl px-4 py-12">
  55:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{loc.name}</h1>
  56:         <p className="mb-8 text-base text-fg-muted">{formatAddress(loc)}</p>
  57: 
  58:         <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
  59:           <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
  60:           {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
  61:           {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
  62:         </dl>
  63: 
  64:         <h2 className="mb-3 text-xl font-semibold text-fg-default">진료 시간</h2>
  65:         <BusinessHoursTable hours={loc.businessHours} />
  66: 
  67:         {initial.clinic.primaryCtas.length > 0 ? (
  68:           <>
  69:             <h2 className="mb-3 mt-10 text-xl font-semibold text-fg-default">예약 채널</h2>
  70:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  71:           </>
  72:         ) : null}
  73:       </section>
  74:     </>
  75:   );
  76: }

 succeeded in 700ms:
   1: // @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
   3: //
   4: // v0.1 단계: DB CHECK 가 status='draft' 만 허용하고 RLS 는 status='published' 만 SELECT.
   5: // → 항상 0 row → notFound().
   6: // 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
   7: 
   8: import type { Metadata } from "next";
   9: import { notFound } from "next/navigation";
  10: import { withPublicTenantTransaction } from "@/lib/public-tenant";
  11: import { normalizeLegal, type LegalDocumentRow } from "@/lib/db-projection";
  12: import { ArticleBody } from "@/components/site/ArticleBody";
  13: import { Breadcrumb } from "@/components/site/Breadcrumb";
  14: 
  15: export const revalidate = 60;
  16: 
  17: const CLOSED_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
  18: 
  19: export const metadata: Metadata = {
  20:   robots: { index: false, follow: true },
  21: };
  22: 
  23: export default async function LegalPage({
  24:   params,
  25: }: {
  26:   params: { instanceSlug: string; type: string };
  27: }) {
  28:   if (!CLOSED_TYPES.includes(params.type as (typeof CLOSED_TYPES)[number])) notFound();
  29: 
  30:   const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  31:     const rows = await tx<LegalDocumentRow[]>`
  32:       SELECT slug, document_type::text AS document_type, title, body,
  33:              to_char(effective_date, 'YYYY-MM-DD') AS effective_date,
  34:              updated_at
  35:         FROM legal_document
  36:        WHERE document_type = ${params.type}::legal_document_type
  37:        LIMIT 1
  38:     `;
  39:     return rows.length > 0 ? normalizeLegal(rows[0]!) : null;
  40:   });
  41:   if (!legal) notFound();
  42: 
  43:   const base = `/${params.instanceSlug}`;
  44:   const hostOrigin = `https://example.local${base}`;
  45: 
  46:   return (
  47:     <>
  48:       <Breadcrumb items={[
  49:         { label: "홈", href: base },
  50:         { label: "정책", href: null },
  51:         { label: legal.title, href: null },
  52:       ]} />
  53:       <section className="mx-auto max-w-3xl px-4 py-12">
  54:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
  55:         <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
  56:         <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
  57:       </section>
  58:     </>
  59:   );
  60: }

 succeeded in 695ms:
   1: // @glitzy/web/lib/site-initial — layout-level data loader for public site
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
   3: //
   4: // (site) layout 안 한 번 SELECT — Header/Footer + 모든 페이지가 공유.
   5: // instance 미존재 / inactive → null (page 가 notFound() 처리).
   6: 
   7: import { withPublicTenantTransaction } from "./public-tenant";
   8: import {
   9:   normalizeClinic,
  10:   normalizeLocation,
  11:   type ClinicProjection,
  12:   type ClinicProfileRow,
  13:   type LocationProjection,
  14:   type LocationProfileRow,
  15: } from "./db-projection";
  16: 
  17: export type SiteInitial = {
  18:   readonly instanceSlug: string;
  19:   readonly instanceId: string;
  20:   readonly clinic: ClinicProjection;
  21:   readonly locationMain: LocationProjection | null; // location main 미생성 시 null
  22: };
  23: 
  24: export async function loadSiteInitial(instanceSlug: string): Promise<SiteInitial | null> {
  25:   return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
  26:     const clinicRows = await tx<ClinicProfileRow[]>`
  27:       SELECT name, description, long_description, slogan, logo_url, og_image_url,
  28:              legal_entity_name, founder,
  29:              to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
  30:              business_registration_number, primary_ctas, updated_at
  31:         FROM clinic_profile
  32:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  33:        LIMIT 1
  34:     `;
  35:     if (clinicRows.length === 0) return null;
  36:     const clinic = normalizeClinic(clinicRows[0]!);
  37: 
  38:     const locationRows = await tx<LocationProfileRow[]>`
  39:       SELECT slug, name, street_address, address_locality, address_region, postal_code, address_country,
  40:              latitude::text AS latitude, longitude::text AS longitude,
  41:              phone, email, metadata, updated_at
  42:         FROM location_profile
  43:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  44:        LIMIT 1
  45:     `;
  46:     const locationMain = locationRows.length > 0 ? normalizeLocation(locationRows[0]!) : null;
  47: 
  48:     return {
  49:       instanceSlug: ctx.instanceSlug,
  50:       instanceId: ctx.instanceId,
  51:       clinic,
  52:       locationMain,
  53:     };
  54:   });
  55: }

 succeeded in 737ms:
   1: // @glitzy/web/lib/db-projection — raw DB row → normalized projection (contract semantic)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.2 PSR-COMP-05·06·07 + § 6 작업 #5
   3: //
   4: // Drizzle column 명과 DATA_MODEL contract field 명이 다른 entity 가 있어 변환 layer 필요.
   5: // 예: TreatmentPage.title (DB) ↔ name (contract C-03), Article.title (DB) ↔ headline (contract C-04).
   6: // JSON-LD 생성기 + 페이지 컴포넌트 모두 본 normalized projection 사용 (raw row 직접 사용 금지).
   7: 
   8: // === Raw rows (DB) ===
   9: 
  10: export type ClinicProfileRow = {
  11:   name: string;
  12:   description: string;
  13:   long_description: string | null;
  14:   slogan: string | null;
  15:   logo_url: string;
  16:   og_image_url: string;
  17:   legal_entity_name: string | null;
  18:   founder: string | null;
  19:   founding_date: string | null;
  20:   business_registration_number: string | null;
  21:   primary_ctas: unknown; // JSONB array
  22:   updated_at: Date;
  23: };
  24: 
  25: export type LocationProfileRow = {
  26:   slug: string;
  27:   name: string;
  28:   street_address: string;
  29:   address_locality: string;
  30:   address_region: string;
  31:   postal_code: string;
  32:   address_country: string;
  33:   latitude: string | null;
  34:   longitude: string | null;
  35:   phone: string | null;
  36:   email: string | null;
  37:   metadata: unknown; // JSONB
  38:   updated_at: Date;
  39: };
  40: 
  41: export type DoctorProfileRow = {
  42:   slug: string;
  43:   name: string;
  44:   title: string | null;
  45:   job_title: string | null;
  46:   honorific: string | null;
  47:   bio: string | null;
  48:   photo_url: string | null;
  49:   display_order: number;
  50:   active: boolean;
  51:   updated_at: Date;
  52: };
  53: 
  54: export type TreatmentPageRow = {
  55:   slug: string;
  56:   title: string; // contract: C-03 name
  57:   summary: string;
  58:   body_markdown: string;
  59:   hero_image_url: string | null;
  60:   published_at: Date | null;
  61:   updated_at: Date;
  62: };
  63: 
  64: export type ArticleRow = {
  65:   slug: string;
  66:   title: string; // contract: C-04 headline
  67:   summary: string;
  68:   body_markdown: string;
  69:   hero_image_url: string | null;
  70:   published_at: Date | null;
  71:   author_doctor_id: string | null;
  72:   updated_at: Date;
  73: };
  74: 
  75: export type LegalDocumentRow = {
  76:   slug: string;
  77:   document_type: string;
  78:   title: string;
  79:   body: string;
  80:   effective_date: string;
  81:   updated_at: Date;
  82: };
  83: 
  84: // === Normalized projections (contract semantic) ===
  85: 
  86: export type PrimaryCta = {
  87:   id: string;
  88:   type: string;
  89:   label: string;
  90:   targetUrl: string;
  91: };
  92: 
  93: export type ClinicProjection = {
  94:   name: string;
  95:   description: string;
  96:   longDescription: string | null;
  97:   slogan: string | null;
  98:   logoUrl: string;
  99:   ogImageUrl: string;
 100:   legalEntityName: string | null;
 101:   founder: string | null;
 102:   foundingDate: string | null;
 103:   businessRegistrationNumber: string | null;
 104:   primaryCtas: PrimaryCta[];
 105:   updatedAt: Date;
 106: };
 107: 
 108: export type BusinessHoursDay = {
 109:   dayOfWeek: string[];
 110:   opens?: string;
 111:   closes?: string;
 112:   from?: string;
 113:   to?: string;
 114: };
 115: 
 116: export type LocationProjection = {
 117:   slug: string;
 118:   name: string;
 119:   streetAddress: string;
 120:   addressLocality: string;
 121:   addressRegion: string;
 122:   postalCode: string;
 123:   addressCountry: string;
 124:   latitude: number | null;
 125:   longitude: number | null;
 126:   telephone: string | null;
 127:   email: string | null;
 128:   businessHours: {
 129:     openingHours: BusinessHoursDay[];
 130:     receptionHours: BusinessHoursDay[];
 131:     lunchBreaks: BusinessHoursDay[];
 132:     specialClosures: Array<{ date: string; reason?: string }>;
 133:   };
 134:   updatedAt: Date;
 135: };
 136: 
 137: export type DoctorProjection = {
 138:   slug: string;
 139:   name: string;
 140:   title: string | null;
 141:   jobTitle: string | null;
 142:   honorific: string | null;
 143:   bio: string | null;
 144:   photoUrl: string | null;
 145:   displayOrder: number;
 146:   active: boolean;
 147:   updatedAt: Date;
 148: };
 149: 
 150: export type TreatmentProjection = {
 151:   slug: string;
 152:   name: string; // DB title → contract name
 153:   summary: string;
 154:   body: string; // DB body_markdown → contract body
 155:   heroImageUrl: string | null;
 156:   publishedAt: Date | null;
 157:   updatedAt: Date;
 158: };
 159: 
 160: export type ArticleProjection = {
 161:   slug: string;
 162:   headline: string; // DB title → contract headline
 163:   summary: string;
 164:   body: string;
 165:   heroImageUrl: string | null;
 166:   publishedAt: Date | null;
 167:   authorDoctorId: string | null;
 168:   updatedAt: Date;
 169: };
 170: 
 171: export type LegalProjection = {
 172:   slug: string;
 173:   documentType: string;
 174:   title: string;
 175:   body: string;
 176:   effectiveDate: string;
 177:   updatedAt: Date;
 178: };
 179: 
 180: // === normalize functions ===
 181: 
 182: function pickString(v: unknown): string | null {
 183:   return typeof v === "string" ? v : null;
 184: }
 185: 
 186: function parsePrimaryCtas(raw: unknown): PrimaryCta[] {
 187:   if (!Array.isArray(raw)) return [];
 188:   const out: PrimaryCta[] = [];
 189:   for (const elem of raw) {
 190:     if (typeof elem !== "object" || elem === null) continue;
 191:     const e = elem as Record<string, unknown>;
 192:     const id = pickString(e.id);
 193:     const type = pickString(e.type);
 194:     const label = pickString(e.label);
 195:     const targetUrl = pickString(e.targetUrl);
 196:     if (!id || !type || !label || !targetUrl) continue;
 197:     out.push({ id, type, label, targetUrl });
 198:   }
 199:   return out;
 200: }
 201: 
 202: function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
 203:   const empty: LocationProjection["businessHours"] = {
 204:     openingHours: [],
 205:     receptionHours: [],
 206:     lunchBreaks: [],
 207:     specialClosures: [],
 208:   };
 209:   if (typeof raw !== "object" || raw === null) return empty;
 210:   const r = raw as Record<string, unknown>;
 211:   const bh = r.businessHours;
 212:   if (typeof bh !== "object" || bh === null) return empty;
 213:   const b = bh as Record<string, unknown>;
 214:   const arr = (k: string): unknown[] => (Array.isArray(b[k]) ? (b[k] as unknown[]) : []);
 215:   return {
 216:     openingHours: arr("openingHours").filter(isBusinessHoursDay),
 217:     receptionHours: arr("receptionHours").filter(isBusinessHoursDay),
 218:     lunchBreaks: arr("lunchBreaks").filter(isBusinessHoursDay),
 219:     specialClosures: arr("specialClosures").filter(isSpecialClosure),
 220:   };
 221: }
 222: 
 223: function isBusinessHoursDay(x: unknown): x is BusinessHoursDay {
 224:   if (typeof x !== "object" || x === null) return false;
 225:   const o = x as Record<string, unknown>;
 226:   return Array.isArray(o.dayOfWeek);
 227: }
 228: 
 229: function isSpecialClosure(x: unknown): x is { date: string; reason?: string } {
 230:   if (typeof x !== "object" || x === null) return false;
 231:   const o = x as Record<string, unknown>;
 232:   return typeof o.date === "string";
 233: }
 234: 
 235: export function normalizeClinic(row: ClinicProfileRow): ClinicProjection {
 236:   return {
 237:     name: row.name,
 238:     description: row.description,
 239:     longDescription: row.long_description,
 240:     slogan: row.slogan,
 241:     logoUrl: row.logo_url,
 242:     ogImageUrl: row.og_image_url,
 243:     legalEntityName: row.legal_entity_name,
 244:     founder: row.founder,
 245:     foundingDate: row.founding_date,
 246:     businessRegistrationNumber: row.business_registration_number,
 247:     primaryCtas: parsePrimaryCtas(row.primary_ctas),
 248:     updatedAt: row.updated_at,
 249:   };
 250: }
 251: 
 252: export function normalizeLocation(row: LocationProfileRow): LocationProjection {
 253:   return {
 254:     slug: row.slug,
 255:     name: row.name,
 256:     streetAddress: row.street_address,
 257:     addressLocality: row.address_locality,
 258:     addressRegion: row.address_region,
 259:     postalCode: row.postal_code,
 260:     addressCountry: row.address_country,
 261:     latitude: row.latitude !== null ? Number(row.latitude) : null,
 262:     longitude: row.longitude !== null ? Number(row.longitude) : null,
 263:     telephone: row.phone,
 264:     email: row.email,
 265:     businessHours: parseBusinessHours(row.metadata),
 266:     updatedAt: row.updated_at,
 267:   };
 268: }
 269: 
 270: export function normalizeDoctor(row: DoctorProfileRow): DoctorProjection {
 271:   return {
 272:     slug: row.slug,
 273:     name: row.name,
 274:     title: row.title,
 275:     jobTitle: row.job_title,
 276:     honorific: row.honorific,
 277:     bio: row.bio,
 278:     photoUrl: row.photo_url,
 279:     displayOrder: row.display_order,
 280:     active: row.active,
 281:     updatedAt: row.updated_at,
 282:   };
 283: }
 284: 
 285: export function normalizeTreatment(row: TreatmentPageRow): TreatmentProjection {
 286:   return {
 287:     slug: row.slug,
 288:     name: row.title, // contract C-03 name = DB title
 289:     summary: row.summary,
 290:     body: row.body_markdown,
 291:     heroImageUrl: row.hero_image_url,
 292:     publishedAt: row.published_at,
 293:     updatedAt: row.updated_at,
 294:   };
 295: }
 296: 
 297: export function normalizeArticle(row: ArticleRow): ArticleProjection {
 298:   return {
 299:     slug: row.slug,
 300:     headline: row.title, // contract C-04 headline = DB title
 301:     summary: row.summary,
 302:     body: row.body_markdown,
 303:     heroImageUrl: row.hero_image_url,
 304:     publishedAt: row.published_at,
 305:     authorDoctorId: row.author_doctor_id,
 306:     updatedAt: row.updated_at,
 307:   };
 308: }
 309: 
 310: export function normalizeLegal(row: LegalDocumentRow): LegalProjection {
 311:   return {
 312:     slug: row.slug,
 313:     documentType: row.document_type,
 314:     title: row.title,
 315:     body: row.body,
 316:     effectiveDate: row.effective_date,
 317:     updatedAt: row.updated_at,
 318:   };
 319: }
 320: 
 321: // === Helper: address 한 줄 결합 ===
 322: export function formatAddress(loc: LocationProjection): string {
 323:   return `${loc.addressRegion} ${loc.addressLocality} ${loc.streetAddress} (${loc.postalCode})`;
 324: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/site/SiteHeader.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/site/SiteFooter.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/site/Breadcrumb.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/site/BusinessHoursTable.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 695ms:
   1: // @glitzy/web/components/site/SiteHeader — 공개 사이트 헤더
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03
   3: 
   4: import Link from "next/link";
   5: import type { SiteInitial } from "@/lib/site-initial";
   6: 
   7: export function SiteHeader({ initial }: { initial: SiteInitial }) {
   8:   const base = `/${initial.instanceSlug}`;
   9:   const cta = initial.clinic.primaryCtas[0];
  10:   return (
  11:     <header className="border-b border-border bg-elevated">
  12:       <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
  13:         <Link href={base} className="flex items-center gap-3" aria-label={`${initial.clinic.name} 홈`}>
  14:           {initial.clinic.logoUrl ? (
  15:             // eslint-disable-next-line @next/next/no-img-element
  16:             <img src={initial.clinic.logoUrl} alt="" className="h-8 w-auto" />
  17:           ) : null}
  18:           <span className="text-base font-semibold text-fg-default">{initial.clinic.name}</span>
  19:         </Link>
  20:         <nav aria-label="주요 메뉴">
  21:           <ul className="hidden items-center gap-5 text-sm text-fg-muted md:flex">
  22:             <li><Link href={`${base}/about`} className="hover:text-fg-default">소개</Link></li>
  23:             <li><Link href={`${base}/doctors`} className="hover:text-fg-default">의료진</Link></li>
  24:             <li><Link href={`${base}/treatments`} className="hover:text-fg-default">진료</Link></li>
  25:             <li><Link href={`${base}/contact`} className="hover:text-fg-default">연락처</Link></li>
  26:             <li><Link href={`${base}/locations/main`} className="hover:text-fg-default">위치</Link></li>
  27:           </ul>
  28:         </nav>
  29:         {cta ? (
  30:           <a
  31:             href={cta.targetUrl}
  32:             className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover"
  33:           >
  34:             {cta.label}
  35:           </a>
  36:         ) : null}
  37:       </div>
  38:     </header>
  39:   );
  40: }

 succeeded in 691ms:
   1: // @glitzy/web/components/site/SiteFooter — 공개 사이트 푸터
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)
   3: 
   4: import type { SiteInitial } from "@/lib/site-initial";
   5: import { formatAddress } from "@/lib/db-projection";
   6: 
   7: export function SiteFooter({ initial }: { initial: SiteInitial }) {
   8:   const loc = initial.locationMain;
   9:   return (
  10:     <footer className="mt-12 border-t border-border bg-subtle">
  11:       <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-fg-muted md:flex-row md:justify-between">
  12:         <div>
  13:           <div className="text-base font-semibold text-fg-default">{initial.clinic.name}</div>
  14:           {loc ? (
  15:             <ul className="mt-2 space-y-1">
  16:               <li>주소: {formatAddress(loc)}</li>
  17:               {loc.telephone ? <li>전화: {loc.telephone}</li> : null}
  18:               {loc.email ? <li>이메일: {loc.email}</li> : null}
  19:             </ul>
  20:           ) : null}
  21:         </div>
  22:         {loc && loc.businessHours.openingHours.length > 0 ? (
  23:           <div>
  24:             <div className="font-medium text-fg-default">진료 시간</div>
  25:             <ul className="mt-2 space-y-1">
  26:               {loc.businessHours.openingHours.map((oh, i) => (
  27:                 <li key={i}>
  28:                   {oh.dayOfWeek.join(", ")}: {oh.opens} – {oh.closes}
  29:                 </li>
  30:               ))}
  31:               {loc.businessHours.lunchBreaks.map((lb, i) => (
  32:                 <li key={`lunch-${i}`}>
  33:                   점심 ({lb.dayOfWeek.join(", ")}): {lb.from} – {lb.to}
  34:                 </li>
  35:               ))}
  36:             </ul>
  37:           </div>
  38:         ) : null}
  39:         <div className="text-xs text-fg-disabled">
  40:           © {new Date().getUTCFullYear()} {initial.clinic.name}
  41:           {initial.clinic.legalEntityName ? ` (${initial.clinic.legalEntityName})` : null}
  42:         </div>
  43:       </div>
  44:       {/* PSR-26: LegalDocument 공개 합류 (PSR-DEFER-13) 시점에 정책 5종 링크 추가 */}
  45:     </footer>
  46:   );
  47: }

 succeeded in 641ms:
   1: // @glitzy/web/components/site/Breadcrumb — visible breadcrumb (UI)
   2: // SCHEMA_MAPPING § 2.4 BreadcrumbList JSON-LD 는 별도 (Phase C json-ld generator)
   3: 
   4: import Link from "next/link";
   5: 
   6: export type BreadcrumbItem = { label: string; href: string | null };
   7: 
   8: export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
   9:   return (
  10:     <nav aria-label="breadcrumb" className="mx-auto max-w-6xl px-4 py-3 text-xs text-fg-muted">
  11:       <ol className="flex flex-wrap items-center gap-1">
  12:         {items.map((item, i) => (
  13:           <li key={i} className="flex items-center gap-1">
  14:             {item.href ? (
  15:               <Link href={item.href} className="hover:text-fg-default">{item.label}</Link>
  16:             ) : (
  17:               <span aria-current="page" className="text-fg-default">{item.label}</span>
  18:             )}
  19:             {i < items.length - 1 ? <span aria-hidden="true" className="text-fg-disabled">/</span> : null}
  20:           </li>
  21:         ))}
  22:       </ol>
  23:     </nav>
  24:   );
  25: }

 succeeded in 658ms:
   1: // @glitzy/web/components/site/BusinessHoursTable
   2: // SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
   3: 
   4: import type { LocationProjection } from "@/lib/db-projection";
   5: 
   6: const DAY_KO: Record<string, string> = {
   7:   Monday: "월",
   8:   Tuesday: "화",
   9:   Wednesday: "수",
  10:   Thursday: "목",
  11:   Friday: "금",
  12:   Saturday: "토",
  13:   Sunday: "일",
  14: };
  15: 
  16: export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
  17:   if (hours.openingHours.length === 0) {
  18:     return <div className="text-sm text-fg-muted">진료 시간 정보가 등록되지 않았습니다.</div>;
  19:   }
  20:   return (
  21:     <div className="overflow-x-auto">
  22:       <table className="w-full border-collapse border border-border text-sm">
  23:         <thead className="bg-subtle">
  24:           <tr>
  25:             <th scope="col" className="border border-border px-3 py-2 text-left">요일</th>
  26:             <th scope="col" className="border border-border px-3 py-2 text-left">진료 시간</th>
  27:             <th scope="col" className="border border-border px-3 py-2 text-left">점심</th>
  28:           </tr>
  29:         </thead>
  30:         <tbody>
  31:           {hours.openingHours.map((oh, i) => {
  32:             const dayLabel = oh.dayOfWeek.map((d) => DAY_KO[d] ?? d).join(", ");
  33:             const lb = hours.lunchBreaks.find((l) => l.dayOfWeek.some((d) => oh.dayOfWeek.includes(d)));
  34:             return (
  35:               <tr key={i}>
  36:                 <th scope="row" className="border border-border px-3 py-2 text-left font-medium">{dayLabel}</th>
  37:                 <td className="border border-border px-3 py-2">{oh.opens} – {oh.closes}</td>
  38:                 <td className="border border-border px-3 py-2 text-fg-muted">{lb ? `${lb.from} – ${lb.to}` : "—"}</td>
  39:               </tr>
  40:             );
  41:           })}
  42:           {hours.specialClosures.length > 0 ? (
  43:             <tr>
  44:               <th scope="row" className="border border-border px-3 py-2 text-left font-medium">특수 휴진</th>
  45:               <td colSpan={2} className="border border-border px-3 py-2 text-fg-muted">
  46:                 {hours.specialClosures.map((c) => `${c.date}${c.reason ? ` (${c.reason})` : ""}`).join(", ")}
  47:               </td>
  48:             </tr>
  49:           ) : null}
  50:         </tbody>
  51:       </table>
  52:     </div>
  53:   );
  54: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath\\(|redirect\\("'`/admin|redirect'"\\(\\\"/admin|href=\\{"'`/admin|href='"\\\"/admin|/\\"'$'"\\{instanceSlug\\}|"'`/'"\\"'$'"\\{params.instanceSlug\\}\" apps/web/src/app apps/web/src/components/forms apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/sign-in/consume/route.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-ChildItem -Recurse -Directory -LiteralPath 'apps/web/src/app/(admin)' | Select-Object -ExpandProperty FullName" in C:\Users\assag\solution\website-exposure
2026-05-18T04:39:27.589359Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:

 exited 1 in 547ms:
 succeeded in 709ms:
   1: // @glitzy/web/sign-in/consume — GET Route Handler (Plan v1.0 § 3.2 step 2)
   2: // magic-link 소비 + admin_user lookup (자동 INSERT 없음 · ADMIN-UI-75)
   3: // + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
   4: // + createSession + cookie set + redirect
   5: 
   6: import { NextResponse, type NextRequest } from "next/server";
   7: import { z } from "zod";
   8: import {
   9:   AuthDeniedError,
  10:   consumeMagicLink,
  11:   createSession,
  12:   emitAuditEvent,
  13:   normalizeIdentifier,
  14:   revokeSession,
  15: } from "@glitzy/auth";
  16: import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
  17: 
  18: import { getSqlBase } from "@/lib/db";
  19: import { getAuthCfg } from "@/lib/env";
  20: import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";
  21: 
  22: const QuerySchema = z.object({
  23:   identifier: z.string().min(1).max(254),
  24:   token: z.string().min(16).max(512),
  25: });
  26: 
  27: /** cycle2-code WEB-26: audit emit best-effort — session row 와 cookie 일관성 유지 */
  28: async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  29:   try {
  30:     await emitAuditEvent(sqlBase, input);
  31:   } catch (err) {
  32:     console.error(`[sign-in/consume] audit emit failed: ${input.eventType}`, err);
  33:   }
  34: }
  35: 
  36: export async function GET(req: NextRequest): Promise<NextResponse> {
  37:   const url = new URL(req.url);
  38:   const parsed = QuerySchema.safeParse({
  39:     identifier: url.searchParams.get("identifier"),
  40:     token: url.searchParams.get("token"),
  41:   });
  42:   const sqlBase = getSqlBase();
  43:   const cfg = getAuthCfg();
  44: 
  45:   if (!parsed.success) {
  46:     // cycle4-code WEB-57: malformed query 도 best-effort audit (token 원문 미저장)
  47:     await emitBestEffort(sqlBase, {
  48:       eventType: "magic-link-rejected",
  49:       reason: "magic-link-invalid",
  50:       payload: { origin: "consume-query-malformed" },
  51:     });
  52:     return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
  53:   }
  54: 
  55:   // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
  56:   //   — 발급 후 비활성화된 사용자가 token 만 소진하는 시나리오 차단
  57:   let normalizedIdentifier: string;
  58:   try {
  59:     normalizedIdentifier = normalizeIdentifier(parsed.data.identifier);
  60:   } catch (err) {
  61:     if (err instanceof AuthDeniedError) {
  62:       await emitBestEffort(sqlBase, {
  63:         eventType: "magic-link-rejected",
  64:         reason: err.reason,
  65:         payload: { identifierSample: parsed.data.identifier.slice(0, 100) },
  66:       });
  67:       return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
  68:     }
  69:     throw err;
  70:   }
  71: 
  72:   // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
  73:   const userRows = await sqlBase<{ id: string; active: boolean }[]>`
  74:     SELECT id, active FROM admin_user WHERE email = ${normalizedIdentifier} LIMIT 1
  75:   `;
  76:   if (userRows.length === 0 || userRows[0]!.active === false) {
  77:     // token CAS 건드리지 않음 — generic redirect + audit
  78:     await emitBestEffort(sqlBase, {
  79:       eventType: "user-not-allowlisted-on-consume",
  80:       payload: { identifier: normalizedIdentifier },
  81:     });
  82:     return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
  83:   }
  84:   // cycle2-3entity WEB-27: DB row id 도 UUID v4 검증 후 branded narrow
  85:   let userId: AdminUserId;
  86:   try {
  87:     userId = asUuidV4(userRows[0]!.id) as AdminUserId;
  88:   } catch {
  89:     await emitBestEffort(sqlBase, {
  90:       eventType: "user-not-allowlisted-on-consume",
  91:       payload: { identifier: normalizedIdentifier, reason: "invalid-user-id" },
  92:     });
  93:     return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
  94:   }
  95: 
  96:   // 2) consume magic-link (allowlist 통과 후에만 CAS 소비)
  97:   try {
  98:     const consumed = await consumeMagicLink(sqlBase, parsed.data.identifier, parsed.data.token);
  99:     if (consumed !== normalizedIdentifier) {
 100:       // packages/auth.consumeMagicLink 내부 normalizer 결과 — 동일해야 정상
 101:       console.error("[sign-in/consume] normalizer mismatch", { consumed, normalizedIdentifier });
 102:     }
 103:   } catch (err) {
 104:     if (err instanceof AuthDeniedError) {
 105:       await emitBestEffort(sqlBase, {
 106:         eventType: "magic-link-rejected",
 107:         reason: err.reason,
 108:         payload: { identifierSample: parsed.data.identifier.slice(0, 100) },
 109:       });
 110:       return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
 111:     }
 112:     throw err;
 113:   }
 114: 
 115:   // 3) cycle2-code WEB-22·23: pure membership lookup (audit emit 없이) · createSession 후에 audit
 116:   const membershipResult = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
 117:   if (membershipResult.kind === "missing") {
 118:     // membership 없음 audit — identifier 포함 (WEB-22)
 119:     await emitBestEffort(sqlBase, {
 120:       eventType: "first-active-membership-missing",
 121:       actorUserId: userId,
 122:       targetUserId: userId,
 123:       payload: { identifier: normalizedIdentifier, reason: "no-active-operator-membership" },
 124:     });
 125:     return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
 126:   }
 127: 
 128:   // 4) createSession (모든 검증 통과 후에만)
 129:   const { signedToken } = await createSession(sqlBase, cfg, userId);
 130: 
 131:   // 5) cycle4-3entity WEB-46: race recheck 를 session-created emit 전으로 이동
 132:   //   recheck 실패 시 revoke + audit (session-created 미emit · audit stream 정합)
 133:   const recheck = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
 134:   if (recheck.kind === "missing" || recheck.slug !== membershipResult.slug) {
 135:     try {
 136:       await revokeSession(sqlBase, cfg, signedToken);
 137:     } catch (revokeErr) {
 138:       console.error("[sign-in/consume] race compensation revoke failed", revokeErr);
 139:     }
 140:     await emitBestEffort(sqlBase, {
 141:       eventType: "first-active-membership-missing",
 142:       actorUserId: userId,
 143:       targetUserId: userId,
 144:       payload: { identifier: normalizedIdentifier, reason: "race-after-createSession" },
 145:     });
 146:     return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
 147:   }
 148: 
 149:   // cycle2-3entity WEB-20: session-created audit 는 mandatory — 실패 시 session revoke + sign-in error
 150:   try {
 151:     await emitAuditEvent(sqlBase, {
 152:       eventType: "session-created",
 153:       actorUserId: userId,
 154:     });
 155:   } catch (auditErr) {
 156:     console.error("[sign-in/consume] session-created audit emit failed — compensating revoke", auditErr);
 157:     try {
 158:       await revokeSession(sqlBase, cfg, signedToken);
 159:     } catch (revokeErr) {
 160:       console.error("[sign-in/consume] compensating revoke failed", revokeErr);
 161:     }
 162:     return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
 163:   }
 164: 
 165:   await emitBestEffort(sqlBase, {
 166:     eventType: "magic-link-consumed",
 167:     actorUserId: userId,
 168:     payload: { identifier: normalizedIdentifier },
 169:   });
 170:   await emitBestEffort(sqlBase, {
 171:     eventType: "first-active-membership-resolved",
 172:     actorUserId: userId,
 173:     targetUserId: userId,
 174:     payload: { slug: membershipResult.slug },
 175:   });
 176: 
 177:   // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
 178:   const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
 179:   res.cookies.set("glitzy_session", signedToken, {
 180:     httpOnly: true,
 181:     secure: process.env.NODE_ENV === "production",
 182:     sameSite: "lax",
 183:     path: "/",
 184:     maxAge: cfg.sessionTtlSeconds,
 185:   });
 186:   return res;
 187: }

 succeeded in 700ms:
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\articles
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\articles\new
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\new
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]
C:\Users\assag\solution\website-exposure\apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\new

 succeeded in 685ms:
   1: // @glitzy/web — / root page (Plan v1.0 § 3.1 라우트 흐름)
   2: // 미인증 → /sign-in · 인증 → firstActiveMembershipSlug
   3: // cycle3-3entity WEB-32·33: admin_user.active 검증 + asUuidV4 narrow
   4: 
   5: import { redirect } from "next/navigation";
   6: import { getActiveSession } from "@glitzy/auth";
   7: import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
   8: 
   9: import { getAuthCfg } from "@/lib/env";
  10: import { getSqlBase } from "@/lib/db";
  11: import { readSessionCookie } from "@/lib/session-cookie";
  12: import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";
  13: 
  14: export default async function RootPage() {
  15:   const signedToken = readSessionCookie();
  16:   if (!signedToken) {
  17:     redirect("/sign-in");
  18:   }
  19: 
  20:   const sqlBase = getSqlBase();
  21:   const cfg = getAuthCfg();
  22: 
  23:   let userIdStr: string;
  24:   try {
  25:     const session = await getActiveSession(sqlBase, cfg, signedToken);
  26:     userIdStr = session.userId;
  27:   } catch (err) {
  28:     const reason =
  29:       err && typeof err === "object" && "reason" in err && typeof (err as { reason: unknown }).reason === "string"
  30:         ? (err as { reason: string }).reason
  31:         : "session-not-found";
  32:     redirect(`/sign-in/cleanup?reason=${reason}`);
  33:   }
  34: 
  35:   // cycle3-3entity WEB-33: branded UUID narrow
  36:   let userId: AdminUserId;
  37:   try {
  38:     userId = asUuidV4(userIdStr) as AdminUserId;
  39:   } catch {
  40:     redirect("/sign-in/cleanup?reason=session-not-found");
  41:   }
  42: 
  43:   // cycle3-3entity WEB-32: admin_user.active 검증 (membership 만으로는 부족)
  44:   const userRows = await sqlBase<{ active: boolean }[]>`
  45:     SELECT active FROM admin_user WHERE id = ${userId}::uuid LIMIT 1
  46:   `;
  47:   if (userRows.length === 0 || userRows[0]!.active === false) {
  48:     redirect("/sign-in/cleanup?reason=user-inactive");
  49:   }
  50: 
  51:   // cycle1-code WEB-14: root redirect 는 read-only — audit emit 안 함 (consume route 만 audit)
  52:   // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
  53:   const result = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  54:   if (result.kind === "missing") {
  55:     redirect("/sign-in?reason=no-active-membership");
  56:   }
  57:   redirect(`/admin/${result.slug}`);
  58: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'revalidatePath\\(|redirect\\("'`/admin|redirect'"\\(\"/admin|href=\\{"'`/admin|href="/admin|/'"\\"'$'"\\{instanceSlug\\}|"'`/'"\\"'$'"\\{params\\.instanceSlug\\}' apps/web/src/app apps/web/src/components/forms apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 587ms:
apps/web/src/app\page.tsx:57:  redirect(`/admin/${result.slug}`);
apps/web/src/app\(site)\[instanceSlug]\contact\page.tsx:37:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(site)\[instanceSlug]\page.tsx:60:  const baseHref = `/${params.instanceSlug}`;
apps/web/src/app\(site)\[instanceSlug]\about\page.tsx:30:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(site)\[instanceSlug]\doctors\page.tsx:39:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(site)\[instanceSlug]\treatments\page.tsx:39:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:75:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:85:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:96:            href={`/admin/${params.instanceSlug}/doctors`}
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:102:            href={`/admin/${params.instanceSlug}/treatments`}
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx:108:            href={`/admin/${params.instanceSlug}/articles`}
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:259:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src/app\(site)\[instanceSlug]\locations\[slug]\page.tsx:38:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\page.tsx:61:        <Link href={`/admin/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src/app\(site)\[instanceSlug]\legal\[type]\page.tsx:43:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/admin/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:57:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\page.tsx:59:          href={`/admin/${params.instanceSlug}/doctors/new`}
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:67:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:72:  const base = `/${params.instanceSlug}`;
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-ChildItem -Recurse -Filter page.tsx -LiteralPath 'apps/web/src/app/(admin)' | Select-Object -ExpandProperty FullName | rg '\\(admin\\)\\\\\\[instanceSlug\\]'" in C:\Users\assag\solution\website-exposure
2026-05-18T04:39:38.608412Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:

 exited 1 in 606ms:
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/env.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/public-db.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/package.json' | ForEach-Object { "'$i++; if($i -le 80){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/migrations-runner/src/manifest.ts' | ForEach-Object { "'$i++; if($i -ge 96 -and $i -le 126){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 635ms:
   1: // @glitzy/web/lib/public-db — postgres.Sql singleton for app_public_reader
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + § 6 작업 #3
   3: //
   4: // 공개 사이트 SSR 전용 connection. WEB_DATABASE_URL (어드민) 와 분리된 pool.
   5: // app_public_reader role 은 SELECT only · RLS USING instance_id 정합.
   6: 
   7: import postgres from "postgres";
   8: import { getEnv } from "./env";
   9: 
  10: declare global {
  11:   // eslint-disable-next-line no-var
  12:   var __glitzy_sql_public: postgres.Sql | undefined;
  13: }
  14: 
  15: let moduleSingleton: postgres.Sql | null = null;
  16: 
  17: export function getSqlPublic(): postgres.Sql {
  18:   if (moduleSingleton !== null) return moduleSingleton;
  19:   if (globalThis.__glitzy_sql_public) {
  20:     moduleSingleton = globalThis.__glitzy_sql_public;
  21:     return moduleSingleton;
  22:   }
  23:   const env = getEnv();
  24:   const sql = postgres(env.WEB_PUBLIC_DATABASE_URL, {
  25:     max: 10,
  26:     idle_timeout: 30,
  27:     onnotice: () => {},
  28:   });
  29:   moduleSingleton = sql;
  30:   globalThis.__glitzy_sql_public = sql;
  31:   return sql;
  32: }

 succeeded in 639ms:
   1: // @glitzy/web/lib/env — env 검증 + AuthConfig 주입 (Plan v1.0 § 7)
   2: // server-side only — NEXT_PUBLIC_* 사용 안 함 (ADMIN-UI-19)
   3: 
   4: import { z } from "zod";
   5: import { validateAuthConfig, type AuthConfig } from "@glitzy/auth";
   6: 
   7: const EnvSchema = z.object({
   8:   WEB_DATABASE_URL: z.string().min(1, "WEB_DATABASE_URL required"),
   9:   // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
  10:   WEB_PUBLIC_DATABASE_URL: z.string().min(1, "WEB_PUBLIC_DATABASE_URL required"),
  11:   SEED_DATABASE_URL: z.string().optional(),
  12:   AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 chars"),
  13:   MAGIC_LINK_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  14:   SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
  15:   SESSION_REFRESH_INTERVAL_SECONDS: z.coerce.number().int().positive().default(3600),
  16:   RESEND_MODE: z.enum(["mock", "suppress-mock"]).default("mock"),
  17:   DEV_MOCK_MAILBOX_VIEW: z.string().optional(),
  18:   NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT: z.string().optional(),
  19:   NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  20: });
  21: 
  22: type Env = z.infer<typeof EnvSchema>;
  23: 
  24: let cachedEnv: Env | null = null;
  25: let cachedAuthCfg: AuthConfig | null = null;
  26: 
  27: export function getEnv(): Env {
  28:   if (cachedEnv !== null) return cachedEnv;
  29:   const parsed = EnvSchema.safeParse(process.env);
  30:   if (!parsed.success) {
  31:     const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
  32:     throw new Error(`env validation failed: ${issues}`);
  33:   }
  34:   cachedEnv = parsed.data;
  35:   return cachedEnv;
  36: }
  37: 
  38: export function getAuthCfg(): AuthConfig {
  39:   if (cachedAuthCfg !== null) return cachedAuthCfg;
  40:   const env = getEnv();
  41:   const cfg: AuthConfig = {
  42:     authSecret: env.AUTH_SECRET,
  43:     magicLinkTtlSeconds: env.MAGIC_LINK_TTL_SECONDS,
  44:     sessionTtlSeconds: env.SESSION_TTL_SECONDS,
  45:     sessionRefreshIntervalSeconds: env.SESSION_REFRESH_INTERVAL_SECONDS,
  46:     resendMode: env.RESEND_MODE,
  47:   };
  48:   // cycle1-code WEB-12: packages/auth.validateAuthConfig 호출 — refresh interval < session TTL 등 invariant 검증
  49:   validateAuthConfig(cfg);
  50:   cachedAuthCfg = cfg;
  51:   return cachedAuthCfg;
  52: }
  53: 
  54: /** Plan § 7 ADMIN-UI-19: server-side 3중 가드 — dev mode + mock + flag 모두 true 일 때만 mailbox UI 노출 */
  55: export function isMockMailboxVisible(): boolean {
  56:   const env = getEnv();
  57:   return env.NODE_ENV !== "production" && env.RESEND_MODE === "mock" && env.DEV_MOCK_MAILBOX_VIEW === "true";
  58: }

 succeeded in 613ms:
   1: {
   2:   "name": "@glitzy/web",
   3:   "version": "0.1.0",
   4:   "private": true,
   5:   "type": "module",
   6:   "scripts": {
   7:     "dev": "next dev",
   8:     "build": "next build",
   9:     "start": "next start",
  10:     "typecheck": "tsc --noEmit -p tsconfig.json",
  11:     "seed": "tsx --env-file=.env src/seed.ts"
  12:   },
  13:   "dependencies": {
  14:     "@glitzy/auth": "workspace:*",
  15:     "@glitzy/core-content": "workspace:*",
  16:     "@glitzy/db": "workspace:*",
  17:     "@glitzy/shared-errors": "workspace:*",
  18:     "@glitzy/shared-types": "workspace:*",
  19:     "drizzle-orm": "^0.36.4",
  20:     "next": "^14.2.0",
  21:     "postgres": "^3.4.5",
  22:     "react": "^18.3.1",
  23:     "react-dom": "^18.3.1",
  24:     "cheerio": "^1.0.0",
  25:     "ipaddr.js": "^2.2.0",
  26:     "undici": "^6.21.0",
  27:     "sanitize-html": "^2.13.1",
  28:     "zod": "^3.23.8"
  29:   },
  30:   "devDependencies": {
  31:     "@types/node": "^22.10.5",
  32:     "@types/react": "^18.3.18",
  33:     "@types/react-dom": "^18.3.5",
  34:     "@types/sanitize-html": "^2.13.0",
  35:     "autoprefixer": "^10.4.20",
  36:     "postcss": "^8.4.49",
  37:     "tailwindcss": "^3.4.17",
  38:     "tsx": "^4.19.2",
  39:     "typescript": "^5.7.3"
  40:   }
  41: }

 succeeded in 619ms:
  96:       "location_profile.clinic_profile_id",
  97:       "location_profile_clinic_fk",
  98:       "location_profile_clinic_idx",
  99:     ],
 100:     dependsOn: ["clinic_profile", "location_profile"],
 101:   },
 102:   // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
 103:   // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
 104:   {
 105:     file: "packages/db/migrations/D0011_public_reader.sql",
 106:     package: "@glitzy/db",
 107:     creates: [
 108:       "app_public_reader",
 109:       "public_reader_instance_select",
 110:       "public_reader_clinic_profile_select",
 111:       "public_reader_location_profile_select",
 112:       "public_reader_doctor_profile_select",
 113:       "public_reader_treatment_page_select",
 114:       "public_reader_article_select",
 115:       "public_reader_legal_document_select",
 116:     ],
 117:     dependsOn: [
 118:       "instance",
 119:       "clinic_profile",
 120:       "location_profile",
 121:       "doctor_profile",
 122:       "treatment_page",
 123:       "article",
 124:       "legal_document",
 125:     ],
 126:   },

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ENABLE ROW LEVEL SECURITY|FORCE ROW LEVEL SECURITY|CREATE TABLE (clinic_profile|location_profile|doctor_profile|treatment_page|article|legal_document)|ALTER TABLE (clinic_profile|location_profile|doctor_profile|treatment_page|article|legal_document)" packages -g "*.sql"' in C:\Users\assag\solution\website-exposure
 succeeded in 503ms:
packages\core-content\migrations\C0003_doctor_profile.sql:3:CREATE TABLE doctor_profile (
packages\core-content\migrations\C0003_doctor_profile.sql:28:ALTER TABLE doctor_profile ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0003_doctor_profile.sql:29:ALTER TABLE doctor_profile FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0001_clinic_profile.sql:4:CREATE TABLE clinic_profile (
packages\core-content\migrations\C0001_clinic_profile.sql:32:ALTER TABLE clinic_profile ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0001_clinic_profile.sql:33:ALTER TABLE clinic_profile FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0004_treatment_page.sql:13:CREATE TABLE treatment_page (
packages\core-content\migrations\C0004_treatment_page.sql:41:ALTER TABLE treatment_page ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0004_treatment_page.sql:42:ALTER TABLE treatment_page FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0005_article.sql:5:CREATE TABLE article (
packages\core-content\migrations\C0005_article.sql:39:ALTER TABLE article ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0005_article.sql:40:ALTER TABLE article FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0006_legal_document.sql:9:CREATE TABLE legal_document (
packages\core-content\migrations\C0006_legal_document.sql:60:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0006_legal_document.sql:61:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql:5:ALTER TABLE clinic_profile
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql:12:ALTER TABLE clinic_profile
packages\core-content\migrations\C0002_location_profile.sql:3:CREATE TABLE location_profile (
packages\core-content\migrations\C0002_location_profile.sql:40:ALTER TABLE location_profile ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0002_location_profile.sql:41:ALTER TABLE location_profile FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:19:ALTER TABLE location_profile
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:28:ALTER TABLE location_profile
packages\db\migrations\D0010_instance.sql:22:ALTER TABLE instance ENABLE ROW LEVEL SECURITY;
packages\db\migrations\D0010_instance.sql:23:ALTER TABLE instance FORCE ROW LEVEL SECURITY;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"CT-02|businessHours|LocationProfile\\.metadata|CHECK|legal_document|draft|published\" docs/decisions/LOCATION_LEGAL_PLAN.md docs/admin/DATA_MODEL.md packages/core-content/migrations/C0006_legal_document.sql packages/core-content/migrations/C0002_location_profile.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/migrations/C0006_legal_document.sql' | ForEach-Object { "'$i++; if($i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/LOCATION_LEGAL_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 80 -and $i -le 150){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
2026-05-18T04:40:08.831595Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
packages/core-content/migrations/C0002_location_profile.sql:23:  CONSTRAINT location_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0002_location_profile.sql:25:  CONSTRAINT location_profile_country_iso CHECK (address_country ~ '^[A-Z]{2}$'),
packages/core-content/migrations/C0002_location_profile.sql:26:  CONSTRAINT location_profile_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
packages/core-content/migrations/C0002_location_profile.sql:27:  CONSTRAINT location_profile_lng_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
packages/core-content/migrations/C0002_location_profile.sql:28:  CONSTRAINT location_profile_email_regex CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
packages/core-content/migrations/C0002_location_profile.sql:29:  -- LLC-10 patch (cycle 1 code review): 본원 전화 형식 정합 (한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678) — form regex 와 DB CHECK 일치
packages/core-content/migrations/C0002_location_profile.sql:30:  CONSTRAINT location_profile_phone_format CHECK (
packages/core-content/migrations/C0002_location_profile.sql:46:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
docs/decisions/LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs/decisions/LOCATION_LEGAL_PLAN.md:43:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
docs/decisions/LOCATION_LEGAL_PLAN.md:49:| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:76:### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:79:-- packages/core-content/migrations/C0006_legal_document.sql
docs/decisions/LOCATION_LEGAL_PLAN.md:81:CREATE TYPE legal_document_type AS ENUM (
docs/decisions/LOCATION_LEGAL_PLAN.md:85:CREATE TABLE legal_document (
docs/decisions/LOCATION_LEGAL_PLAN.md:89:  document_type legal_document_type NOT NULL,
docs/decisions/LOCATION_LEGAL_PLAN.md:98:  status content_publication_status NOT NULL DEFAULT 'draft',
docs/decisions/LOCATION_LEGAL_PLAN.md:100:  published_at TIMESTAMPTZ,
docs/decisions/LOCATION_LEGAL_PLAN.md:104:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
docs/decisions/LOCATION_LEGAL_PLAN.md:105:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
docs/decisions/LOCATION_LEGAL_PLAN.md:106:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
docs/decisions/LOCATION_LEGAL_PLAN.md:107:  CONSTRAINT legal_document_email_regex CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:111:  CONSTRAINT legal_document_template_version_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:114:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:117:  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
docs/decisions/LOCATION_LEGAL_PLAN.md:118:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
docs/decisions/LOCATION_LEGAL_PLAN.md:119:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
docs/decisions/LOCATION_LEGAL_PLAN.md:121:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
docs/decisions/LOCATION_LEGAL_PLAN.md:122:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
docs/decisions/LOCATION_LEGAL_PLAN.md:124:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
docs/decisions/LOCATION_LEGAL_PLAN.md:127:CREATE UNIQUE INDEX legal_document_instance_5type_unique
docs/decisions/LOCATION_LEGAL_PLAN.md:128:  ON legal_document (instance_id, document_type)
docs/decisions/LOCATION_LEGAL_PLAN.md:131:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
docs/decisions/LOCATION_LEGAL_PLAN.md:133:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
docs/decisions/LOCATION_LEGAL_PLAN.md:134:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
docs/decisions/LOCATION_LEGAL_PLAN.md:136:CREATE POLICY tenant_isolation ON legal_document
docs/decisions/LOCATION_LEGAL_PLAN.md:139:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
docs/decisions/LOCATION_LEGAL_PLAN.md:141:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
docs/decisions/LOCATION_LEGAL_PLAN.md:146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
docs/decisions/LOCATION_LEGAL_PLAN.md:147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:149:- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
docs/decisions/LOCATION_LEGAL_PLAN.md:166:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:171:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:175:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:179:-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
docs/decisions/LOCATION_LEGAL_PLAN.md:237:  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
docs/decisions/LOCATION_LEGAL_PLAN.md:239:### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
docs/decisions/LOCATION_LEGAL_PLAN.md:254:-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
docs/decisions/LOCATION_LEGAL_PLAN.md:270:- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
docs/decisions/LOCATION_LEGAL_PLAN.md:275:  "businessHours": {
docs/decisions/LOCATION_LEGAL_PLAN.md:301:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
docs/decisions/LOCATION_LEGAL_PLAN.md:313:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
docs/decisions/LOCATION_LEGAL_PLAN.md:319:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
docs/decisions/LOCATION_LEGAL_PLAN.md:323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
docs/decisions/LOCATION_LEGAL_PLAN.md:329:- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
docs/decisions/LOCATION_LEGAL_PLAN.md:337:  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
docs/decisions/LOCATION_LEGAL_PLAN.md:348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
docs/decisions/LOCATION_LEGAL_PLAN.md:354:  // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
docs/decisions/LOCATION_LEGAL_PLAN.md:362:- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
docs/decisions/LOCATION_LEGAL_PLAN.md:367:- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
docs/decisions/LOCATION_LEGAL_PLAN.md:418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
docs/decisions/LOCATION_LEGAL_PLAN.md:440:  - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
docs/decisions/LOCATION_LEGAL_PLAN.md:441:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:442:  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:443:  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:448:  - businessHours 는 application-level 검증 (DB CHECK 없음)
docs/decisions/LOCATION_LEGAL_PLAN.md:504:  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:517:| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
docs/decisions/LOCATION_LEGAL_PLAN.md:519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
docs/decisions/LOCATION_LEGAL_PLAN.md:521:| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
docs/decisions/LOCATION_LEGAL_PLAN.md:523:| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
docs/decisions/LOCATION_LEGAL_PLAN.md:524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
docs/decisions/LOCATION_LEGAL_PLAN.md:525:| 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |
docs/decisions/LOCATION_LEGAL_PLAN.md:531:| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
packages/core-content/migrations/C0006_legal_document.sql:5:CREATE TYPE legal_document_type AS ENUM (
packages/core-content/migrations/C0006_legal_document.sql:9:CREATE TABLE legal_document (
packages/core-content/migrations/C0006_legal_document.sql:13:  document_type legal_document_type NOT NULL,
packages/core-content/migrations/C0006_legal_document.sql:24:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0006_legal_document.sql:26:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0006_legal_document.sql:30:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0006_legal_document.sql:31:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
packages/core-content/migrations/C0006_legal_document.sql:32:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
packages/core-content/migrations/C0006_legal_document.sql:33:  CONSTRAINT legal_document_email_regex CHECK (
packages/core-content/migrations/C0006_legal_document.sql:37:  CONSTRAINT legal_document_template_version_format CHECK (
packages/core-content/migrations/C0006_legal_document.sql:40:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
packages/core-content/migrations/C0006_legal_document.sql:43:  -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
packages/core-content/migrations/C0006_legal_document.sql:44:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
packages/core-content/migrations/C0006_legal_document.sql:46:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
packages/core-content/migrations/C0006_legal_document.sql:48:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0006_legal_document.sql:49:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0006_legal_document.sql:50:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0006_legal_document.sql:54:CREATE UNIQUE INDEX legal_document_instance_5type_unique
packages/core-content/migrations/C0006_legal_document.sql:55:  ON legal_document (instance_id, document_type)
packages/core-content/migrations/C0006_legal_document.sql:58:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
packages/core-content/migrations/C0006_legal_document.sql:60:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:61:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:63:CREATE POLICY tenant_isolation ON legal_document
packages/core-content/migrations/C0006_legal_document.sql:66:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/core-content/migrations/C0006_legal_document.sql:68:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
rg: docs/admin/DATA_MODEL.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 617ms:
packages/core-content/migrations/C0002_location_profile.sql:23:  CONSTRAINT location_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0002_location_profile.sql:25:  CONSTRAINT location_profile_country_iso CHECK (address_country ~ '^[A-Z]{2}$'),
packages/core-content/migrations/C0002_location_profile.sql:26:  CONSTRAINT location_profile_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
packages/core-content/migrations/C0002_location_profile.sql:27:  CONSTRAINT location_profile_lng_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
packages/core-content/migrations/C0002_location_profile.sql:28:  CONSTRAINT location_profile_email_regex CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
packages/core-content/migrations/C0002_location_profile.sql:29:  -- LLC-10 patch (cycle 1 code review): 본원 전화 형식 정합 (한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678) — form regex 와 DB CHECK 일치
packages/core-content/migrations/C0002_location_profile.sql:30:  CONSTRAINT location_profile_phone_format CHECK (
packages/core-content/migrations/C0002_location_profile.sql:46:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
docs/decisions/LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs/decisions/LOCATION_LEGAL_PLAN.md:43:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
docs/decisions/LOCATION_LEGAL_PLAN.md:49:| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:76:### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
docs/decisions/LOCATION_LEGAL_PLAN.md:79:-- packages/core-content/migrations/C0006_legal_document.sql
docs/decisions/LOCATION_LEGAL_PLAN.md:81:CREATE TYPE legal_document_type AS ENUM (
docs/decisions/LOCATION_LEGAL_PLAN.md:85:CREATE TABLE legal_document (
docs/decisions/LOCATION_LEGAL_PLAN.md:89:  document_type legal_document_type NOT NULL,
docs/decisions/LOCATION_LEGAL_PLAN.md:98:  status content_publication_status NOT NULL DEFAULT 'draft',
docs/decisions/LOCATION_LEGAL_PLAN.md:100:  published_at TIMESTAMPTZ,
docs/decisions/LOCATION_LEGAL_PLAN.md:104:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
docs/decisions/LOCATION_LEGAL_PLAN.md:105:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
docs/decisions/LOCATION_LEGAL_PLAN.md:106:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
docs/decisions/LOCATION_LEGAL_PLAN.md:107:  CONSTRAINT legal_document_email_regex CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:111:  CONSTRAINT legal_document_template_version_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:114:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:117:  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
docs/decisions/LOCATION_LEGAL_PLAN.md:118:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
docs/decisions/LOCATION_LEGAL_PLAN.md:119:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
docs/decisions/LOCATION_LEGAL_PLAN.md:121:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
docs/decisions/LOCATION_LEGAL_PLAN.md:122:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
docs/decisions/LOCATION_LEGAL_PLAN.md:124:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
docs/decisions/LOCATION_LEGAL_PLAN.md:127:CREATE UNIQUE INDEX legal_document_instance_5type_unique
docs/decisions/LOCATION_LEGAL_PLAN.md:128:  ON legal_document (instance_id, document_type)
docs/decisions/LOCATION_LEGAL_PLAN.md:131:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
docs/decisions/LOCATION_LEGAL_PLAN.md:133:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
docs/decisions/LOCATION_LEGAL_PLAN.md:134:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
docs/decisions/LOCATION_LEGAL_PLAN.md:136:CREATE POLICY tenant_isolation ON legal_document
docs/decisions/LOCATION_LEGAL_PLAN.md:139:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
docs/decisions/LOCATION_LEGAL_PLAN.md:141:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
docs/decisions/LOCATION_LEGAL_PLAN.md:146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
docs/decisions/LOCATION_LEGAL_PLAN.md:147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:149:- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
docs/decisions/LOCATION_LEGAL_PLAN.md:166:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:171:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:175:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:179:-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
docs/decisions/LOCATION_LEGAL_PLAN.md:237:  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
docs/decisions/LOCATION_LEGAL_PLAN.md:239:### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
docs/decisions/LOCATION_LEGAL_PLAN.md:254:-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
docs/decisions/LOCATION_LEGAL_PLAN.md:270:- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
docs/decisions/LOCATION_LEGAL_PLAN.md:275:  "businessHours": {
docs/decisions/LOCATION_LEGAL_PLAN.md:301:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
docs/decisions/LOCATION_LEGAL_PLAN.md:313:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
docs/decisions/LOCATION_LEGAL_PLAN.md:319:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
docs/decisions/LOCATION_LEGAL_PLAN.md:323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
docs/decisions/LOCATION_LEGAL_PLAN.md:329:- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
docs/decisions/LOCATION_LEGAL_PLAN.md:337:  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
docs/decisions/LOCATION_LEGAL_PLAN.md:348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
docs/decisions/LOCATION_LEGAL_PLAN.md:354:  // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
docs/decisions/LOCATION_LEGAL_PLAN.md:362:- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
docs/decisions/LOCATION_LEGAL_PLAN.md:367:- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
docs/decisions/LOCATION_LEGAL_PLAN.md:418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
docs/decisions/LOCATION_LEGAL_PLAN.md:440:  - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
docs/decisions/LOCATION_LEGAL_PLAN.md:441:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:442:  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:443:  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md:448:  - businessHours 는 application-level 검증 (DB CHECK 없음)
docs/decisions/LOCATION_LEGAL_PLAN.md:504:  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:517:| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
docs/decisions/LOCATION_LEGAL_PLAN.md:519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
docs/decisions/LOCATION_LEGAL_PLAN.md:521:| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
docs/decisions/LOCATION_LEGAL_PLAN.md:523:| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
docs/decisions/LOCATION_LEGAL_PLAN.md:524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
docs/decisions/LOCATION_LEGAL_PLAN.md:525:| 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |
docs/decisions/LOCATION_LEGAL_PLAN.md:531:| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
packages/core-content/migrations/C0006_legal_document.sql:5:CREATE TYPE legal_document_type AS ENUM (
packages/core-content/migrations/C0006_legal_document.sql:9:CREATE TABLE legal_document (
packages/core-content/migrations/C0006_legal_document.sql:13:  document_type legal_document_type NOT NULL,
packages/core-content/migrations/C0006_legal_document.sql:24:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0006_legal_document.sql:26:  published_at TIMESTAMPTZ,
packages/core-content/migrations/C0006_legal_document.sql:30:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0006_legal_document.sql:31:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
packages/core-content/migrations/C0006_legal_document.sql:32:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
packages/core-content/migrations/C0006_legal_document.sql:33:  CONSTRAINT legal_document_email_regex CHECK (
packages/core-content/migrations/C0006_legal_document.sql:37:  CONSTRAINT legal_document_template_version_format CHECK (
packages/core-content/migrations/C0006_legal_document.sql:40:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
packages/core-content/migrations/C0006_legal_document.sql:43:  -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
packages/core-content/migrations/C0006_legal_document.sql:44:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
packages/core-content/migrations/C0006_legal_document.sql:46:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
packages/core-content/migrations/C0006_legal_document.sql:48:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0006_legal_document.sql:49:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0006_legal_document.sql:50:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0006_legal_document.sql:54:CREATE UNIQUE INDEX legal_document_instance_5type_unique
packages/core-content/migrations/C0006_legal_document.sql:55:  ON legal_document (instance_id, document_type)
packages/core-content/migrations/C0006_legal_document.sql:58:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
packages/core-content/migrations/C0006_legal_document.sql:60:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:61:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:63:CREATE POLICY tenant_isolation ON legal_document
packages/core-content/migrations/C0006_legal_document.sql:66:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
packages/core-content/migrations/C0006_legal_document.sql:68:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
rg: docs/admin/DATA_MODEL.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 636ms:
   1: -- @glitzy/core-content — C0006 LegalDocument (DATA_MODEL C-16·LOCATION_LEGAL_PLAN v1.0)
   2: -- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
   3: 
   4: -- LL-SCHEMA-01: documentType enum (DATA_MODEL C-16 SoT 7종)
   5: CREATE TYPE legal_document_type AS ENUM (
   6:   'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
   7: );
   8: 
   9: CREATE TABLE legal_document (
  10:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  11:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  12:   slug TEXT NOT NULL,
  13:   document_type legal_document_type NOT NULL,
  14:   title TEXT NOT NULL,
  15:   body TEXT NOT NULL,
  16:   auto_generated BOOLEAN NOT NULL DEFAULT true,
  17:   template_version TEXT,
  18:   -- LLC-11 patch (LL-ACTION-07): default 시점 = 'Asia/Seoul' 의 오늘. server new Date() 사용 금지.
  19:   -- form/action 이 항상 값을 넣지만 (zod required) DB default 는 직접 SQL 경로 안전망.
  20:   effective_date DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date),
  21:   last_revised_date DATE,
  22:   contact_person TEXT,
  23:   contact_email TEXT,
  24:   status content_publication_status NOT NULL DEFAULT 'draft',
  25:   risk_level risk_level NOT NULL DEFAULT 'Low',
  26:   published_at TIMESTAMPTZ,
  27:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  28:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  29:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  30:   CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  31:   CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  32:   CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  33:   CONSTRAINT legal_document_email_regex CHECK (
  34:     contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  35:   ),
  36:   -- LL-SCHEMA-05 + cycle1 LL-22: autoGenerated=true 시 templateVersion 필수
  37:   CONSTRAINT legal_document_template_version_format CHECK (
  38:     template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  39:   ),
  40:   CONSTRAINT legal_document_auto_generated_template_ver CHECK (
  41:     (auto_generated = false) OR (template_version IS NOT NULL)
  42:   ),
  43:   -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
  44:   CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  45:   -- LL-SCHEMA-04: 발행 자체 차단
  46:   CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  47:   -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
  48:   CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  49:   CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  50:   CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
  51: );
  52: 
  53: -- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
  54: CREATE UNIQUE INDEX legal_document_instance_5type_unique
  55:   ON legal_document (instance_id, document_type)
  56:   WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
  57: 
  58: CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
  59: 
  60: ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
  61: ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
  62: 
  63: CREATE POLICY tenant_isolation ON legal_document
  64:   FOR ALL TO app_tenant_user
  65:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  66:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  67: 
  68: GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;

 succeeded in 634ms:
  80: 
  81: CREATE TYPE legal_document_type AS ENUM (
  82:   'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
  83: );
  84: 
  85: CREATE TABLE legal_document (
  86:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  87:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  88:   slug TEXT NOT NULL,
  89:   document_type legal_document_type NOT NULL,
  90:   title TEXT NOT NULL,
  91:   body TEXT NOT NULL,                 -- Markdown
  92:   auto_generated BOOLEAN NOT NULL DEFAULT true,
  93:   template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
  94:   effective_date DATE NOT NULL,
  95:   last_revised_date DATE,
  96:   contact_person TEXT,
  97:   contact_email TEXT,
  98:   status content_publication_status NOT NULL DEFAULT 'draft',
  99:   risk_level risk_level NOT NULL DEFAULT 'Low',
 100:   published_at TIMESTAMPTZ,
 101:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 102:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 103:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 104:   CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
 105:   CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
 106:   CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
 107:   CONSTRAINT legal_document_email_regex CHECK (
 108:     contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
 109:   ),
 110:   -- cycle1 LL-22 patch: autoGenerated=true 면 templateVersion 필수 (LL-SCHEMA-05). custom (autoGenerated=false) 은 null OK
 111:   CONSTRAINT legal_document_template_version_format CHECK (
 112:     template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
 113:   ),
 114:   CONSTRAINT legal_document_auto_generated_template_ver CHECK (
 115:     (auto_generated = false) OR (template_version IS NOT NULL)
 116:   ),
 117:   -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
 118:   CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
 119:   CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
 120:   -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
 121:   CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
 122:   CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
 123:   -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
 124:   CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
 125: );
 126: 
 127: CREATE UNIQUE INDEX legal_document_instance_5type_unique
 128:   ON legal_document (instance_id, document_type)
 129:   WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
 130: 
 131: CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
 132: 
 133: ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
 134: ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
 135: 
 136: CREATE POLICY tenant_isolation ON legal_document
 137:   FOR ALL TO app_tenant_user
 138:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
 139:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
 140: 
 141: GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
 142: ```
 143: 
 144: **결정 사항**:
 145: - (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
 146: - (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
 147: - (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
 148: - (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
 149: - (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
 150: - (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/LOCATION_LEGAL_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 270 -and $i -le 300){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 540ms:
 270: - (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
 271: 
 272: ```jsonc
 273: // location_profile.metadata
 274: {
 275:   "businessHours": {
 276:     "openingHours": [
 277:       // schema.org OpeningHoursSpecification 호환
 278:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:30" },
 279:       { "dayOfWeek": ["Thursday"], "opens": "09:30", "closes": "20:30" },
 280:       { "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "14:00" }
 281:     ],
 282:     "receptionHours": [
 283:       // 접수 마감이 진료 마감과 다를 때
 284:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:00" }
 285:     ],
 286:     "lunchBreaks": [
 287:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "from": "13:00", "to": "14:00" }
 288:     ],
 289:     "specialClosures": []
 290:     // v0.2 미입력 — M1 cascade
 291:   },
 292:   // cycle1 LL-02 patch: ClinicProfile.primaryCtas 자동 상속 결과
 293:   "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
 294:   // v0.2 미입력 — LL-DEFER-05
 295:   "representativeDoctors": [],
 296:   "featuredChannelId": null
 297: }
 298: ```
 299: 
 300: **결정**:

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 132 -and $i -le 205){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 555ms:
 132: ### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
 133: 
 134: ```sql
 135: -- packages/db/migrations/D0011_public_reader.sql (신규)
 136: 
 137: -- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
 138: -- 가 MEMBERSHIP 으로 SET ROLE. login user 자체 는 운영 환경 별 secret cascade.
 139: -- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
 140: CREATE ROLE app_public_reader LOGIN;
 141: 
 142: GRANT USAGE ON SCHEMA public TO app_public_reader;
 143: 
 144: -- cycle1 PSR-05 patch: instance slug resolve 전용 policy.
 145: -- public reader 가 처음 `instance` 테이블을 조회해 slug → id 매핑. 이 시점은 RLS USING 검증 전.
 146: -- 따라서 instance 테이블 에는 별도 policy (active=true 만 노출).
 147: GRANT SELECT ON instance TO app_public_reader;
 148: 
 149: CREATE POLICY public_reader_instance_select
 150:   ON instance
 151:   FOR SELECT
 152:   TO app_public_reader
 153:   USING (active = true);
 154: 
 155: -- cycle1 PSR-15 patch: 6 content table 별 per-table policy 명시.
 156: -- 모든 policy 는 USING `instance_id = current_setting('app.current_instance_id')` 정합.
 157: -- helper 가 instance lookup 직후 set_config 수행.
 158: 
 159: GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
 160:                 treatment_page, article, legal_document
 161:   TO app_public_reader;
 162: 
 163: CREATE POLICY public_reader_clinic_profile_select
 164:   ON clinic_profile FOR SELECT TO app_public_reader
 165:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
 166: 
 167: CREATE POLICY public_reader_location_profile_select
 168:   ON location_profile FOR SELECT TO app_public_reader
 169:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
 170: 
 171: CREATE POLICY public_reader_doctor_profile_select
 172:   ON doctor_profile FOR SELECT TO app_public_reader
 173:   USING (
 174:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
 175:     AND active = true
 176:   );
 177: 
 178: CREATE POLICY public_reader_treatment_page_select
 179:   ON treatment_page FOR SELECT TO app_public_reader
 180:   USING (
 181:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
 182:     AND status = 'published'
 183:     AND published_at IS NOT NULL
 184:     AND published_at <= now()
 185:   );
 186: 
 187: CREATE POLICY public_reader_article_select
 188:   ON article FOR SELECT TO app_public_reader
 189:   USING (
 190:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
 191:     AND status = 'published'
 192:     AND published_at IS NOT NULL
 193:     AND published_at <= now()
 194:   );
 195: 
 196: -- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
 197: -- DB CHECK 가 status='draft' 만 허용하므로 published row 미존재. SELECT 자체 차단.
 198: -- 어드민 인증 세션 (별 helper · withSkeletonTx app_tenant_user) 만 draft 접근 가능.
 199: -- 본 policy 는 application 단 status='published' 만 통과 — DB CHECK 와 정합.
 200: CREATE POLICY public_reader_legal_document_select
 201:   ON legal_document FOR SELECT TO app_public_reader
 202:   USING (
 203:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
 204:     AND status = 'published'
 205:   );

codex
구현을 읽어보니 단순 누락보다 SoT와 어긋나는 동작이 몇 가지 보입니다. 특히 sitemap의 “필수 minimal 페이지 포함”과 JSON-LD 참조 검증/그래프 구성은 실제 검색 산출물 품질에 영향을 줍니다. 타입체크도 빠르게 돌려 컴파일 수준 결함이 있는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
2026-05-18T04:40:32.001963Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 3.6 seconds
Output:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json

src/components/forms/ClinicProfileForm.tsx(14,33): error TS2307: Cannot find module '@/app/(admin)/[instanceSlug]/clinic-profile/actions' or its corresponding type declarations.
src/lib/markdown.ts(8,26): error TS2307: Cannot find module 'sanitize-html' or its corresponding type declarations.
src/lib/markdown.ts(50,11): error TS7006: Parameter 'tagName' implicitly has an 'any' type.
src/lib/markdown.ts(50,20): error TS7006: Parameter 'attribs' implicitly has an 'any' type.
src/lib/public-tenant.ts(32,3): error TS2322: Type 'UnwrapPromiseArray<T> | null' is not assignable to type 'T | null'.
  Type 'UnwrapPromiseArray<T>' is not assignable to type 'T | null'.
    Type 'T | { [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }' is not assignable to type 'T | null'.
      Type '{ [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }' is not assignable to type 'T'.
        'T' could be instantiated with an arbitrary type which could be unrelated to '{ [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }'.
src/lib/public-tenant.ts(44,15): error TS2345: Argument of type 'TransactionSql<{}>' is not assignable to parameter of type 'Sql<{}>'.
  Type 'TransactionSql<{}>' is missing the following properties from type 'Sql<{}>': CLOSE, END, PostgresError, options, and 7 more.
C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 typecheck: `tsc --noEmit -p tsconfig.json`
Exit status 2

 exited 1 in 3620ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json

src/components/forms/ClinicProfileForm.tsx(14,33): error TS2307: Cannot find module '@/app/(admin)/[instanceSlug]/clinic-profile/actions' or its corresponding type declarations.
src/lib/markdown.ts(8,26): error TS2307: Cannot find module 'sanitize-html' or its corresponding type declarations.
src/lib/markdown.ts(50,11): error TS7006: Parameter 'tagName' implicitly has an 'any' type.
src/lib/markdown.ts(50,20): error TS7006: Parameter 'attribs' implicitly has an 'any' type.
src/lib/public-tenant.ts(32,3): error TS2322: Type 'UnwrapPromiseArray<T> | null' is not assignable to type 'T | null'.
  Type 'UnwrapPromiseArray<T>' is not assignable to type 'T | null'.
    Type 'T | { [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }' is not assignable to type 'T | null'.
      Type '{ [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }' is not assignable to type 'T'.
        'T' could be instantiated with an arbitrary type which could be unrelated to '{ [k in keyof T]: T[k] extends Promise<infer R> ? R : T[k]; }'.
src/lib/public-tenant.ts(44,15): error TS2345: Argument of type 'TransactionSql<{}>' is not assignable to parameter of type 'Sql<{}>'.
  Type 'TransactionSql<{}>' is missing the following properties from type 'Sql<{}>': CLOSE, END, PostgresError, options, and 7 more.
C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 typecheck: `tsc --noEmit -p tsconfig.json`
Exit status 2

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/ClinicProfileForm.tsx' | ForEach-Object { "'$i++; if($i -le 25){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 566ms:
   1: // @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
   2: // 3 섹션 + 5 LegalDocument override 재구성.
   3: //
   4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
   5: // (b) 본원 위치·연락·시간 (신규 · LL-FORM-03·07·08·12)
   6: // (c) 정책 변수 보조 (신규 · LL-FORM-04)
   7: // (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)
   8: 
   9: "use client";
  10: 
  11: import { useState } from "react";
  12: import { useFormState, useFormStatus } from "react-dom";
  13: import { Field } from "@/components/forms/Field";
  14: import type { SaveResult } from "@/app/(admin)/[instanceSlug]/clinic-profile/actions";
  15: import type {
  16:   BusinessHoursInput,
  17:   PrimaryCtaInput,
  18: } from "@/lib/clinic-profile-schema";
  19: 
  20: const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
  21: type ClosedDocType = (typeof CLOSED_DOC_TYPES)[number];
  22: 
  23: const DOC_TYPE_LABEL: Record<ClosedDocType, string> = {
  24:   privacy: "개인정보처리방침",
  25:   terms: "이용약관",

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "sanitize-html|@types/sanitize-html" pnpm-lock.yaml package.json apps/web/package.json' in C:\Users\assag\solution\website-exposure
 succeeded in 522ms:
apps/web/package.json:27:    "sanitize-html": "^2.13.1",
apps/web/package.json:34:    "@types/sanitize-html": "^2.13.0",

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Name' in C:\Users\assag\solution\website-exposure
 succeeded in 535ms:
.agents
.claude
.codex-reviews
.pnpm-store
apps
docs
handoff
node_modules
packages
.codex-critic-prompt-code.md
.codex-critic-prompt.md
.gitignore
.npmrc
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
skills-lock.json
tsconfig.base.json

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/layout.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 522ms:
   1: // @glitzy/web — root layout (Plan v1.0 § 3)
   2: import type { Metadata } from "next";
   3: import "@/styles/globals.css";
   4: 
   5: export const metadata: Metadata = {
   6:   title: "Glitzy 어드민",
   7:   description: "M0 walking skeleton",
   8: };
   9: 
  10: export default function RootLayout({ children }: { children: React.ReactNode }) {
  11:   // PSR-COMP-01·02 (cycle2 PSR-28 patch): root layout 이 <html>/<body> SoT.
  12:   // semantic 22 토큰 — `bg-canvas` (color.surface.background) · `text-fg-default` (color.text.primary).
  13:   return (
  14:     <html lang="ko-KR" data-theme="light">
  15:       <body className="min-h-screen bg-canvas text-fg-default antialiased">{children}</body>
  16:     </html>
  17:   );
  18: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 243 -and $i -le 251){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 539ms:
 243: ### 3.3 not-found · 빈 페이지 (PSR-DATA-08)
 244: 
 245: - `instance` 미존재 또는 `active = false` → Next `notFound()` → 글로벌 404
 246: - `doctor_profile[slug]` 매칭 0행 → `notFound()`
 247: - `treatment_page[slug]` 매칭 0행 또는 status != published → `notFound()`
 248: - `article[slug]` 매칭 0행 → `notFound()`
 249: - `legal_document[type]` 매칭 0행 (v0.1 단계 항상) → `notFound()`
 250: - `location_profile[slug]` 매칭 0행 → `notFound()`
 251: 

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 251 -and $i -le 252){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 542ms:
 251: 
 252: ## 4. 페이지 컴포넌트 결정

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "/admin|http://localhost|localhost:3000|sign-in|href|url" apps/web/src/seed.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 516ms:
56:  const url = process.env.SEED_DATABASE_URL;
57:  if (!url) {
62:  const sql = postgres(url, { max: 1, onnotice: () => {} });
187:          next: `magic-link 발급 후 /sign-in/consume?identifier=${encodeURIComponent(normalizedEmail)}&token=… 클릭`,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/core/PAGE_TYPES.md' | ForEach-Object { "'$i++; if($i -ge 97 -and $i -le 110){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 531ms:
  97: ### P-001. Home
  98: 
  99: **목적**: 의료기관 정체성·전문 영역·핵심 가치 제안을 첫 시각에 전달.
 100: **URL**: `/`
 101: **주 데이터 계약**: `ClinicProfile` (요약 필드)
 102: **Schema 요약**: `Organization` + `MedicalClinic` + `WebSite` (SearchAction). BreadcrumbList 미적용.
 103: 
 104: **정보 슬롯**:
 105: 1. 히어로 — 기관명·전문 분야·핵심 가치
 106: 2. 주요 시술·진료 영역 요약
 107: 3. 의료진 요약
 108: 4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
 109: 5. 위치·진료시간·연락처 요약 (`LocationProfile` main 참조)
 110: 6. (선택) 인증·수상·미디어 노출

codex
# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=3 major=9 minor=3 (총 15)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫
- 검증: `pnpm --filter @glitzy/web typecheck` 실패

## blocking
- **PSRC-01**: PSR-CASCADE-01b 이후 stale import 때문에 web typecheck 실패
  - 위치: `apps/web/src/components/forms/ClinicProfileForm.tsx:14`
  - 근거(plan SoT): PSR-CASCADE-01b — admin route는 `(admin)/admin/[instanceSlug]`
  - 문제: `@/app/(admin)/[instanceSlug]/clinic-profile/actions`를 계속 import한다. 실제 파일은 `(admin)/admin/[instanceSlug]/...`.
  - 권장 patch: import를 `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions`로 변경하고 전체 form/action import 재검색.

- **PSRC-02**: `sanitize-html` 도입이 lock/install에 반영되지 않아 typecheck 실패
  - 위치: `apps/web/src/lib/markdown.ts:8`, `apps/web/package.json:27`, `apps/web/package.json:34`
  - 근거(plan SoT): PSR-COMP-09 — `sanitize-html` SSR 채택
  - 문제: package.json에는 추가됐지만 현재 workspace typecheck에서 모듈/타입을 찾지 못한다. `pnpm-lock.yaml`에도 `sanitize-html` 항목이 없다.
  - 권장 patch: `pnpm install --lockfile-only` 또는 정상 install로 lockfile을 갱신하고, `transformTags.a` 콜백 파라미터 타입도 명시.

- **PSRC-03**: `withPublicTenantTransaction` 타입이 postgres-js transaction 타입과 맞지 않아 typecheck 실패
  - 위치: `apps/web/src/lib/public-tenant.ts:28`, `apps/web/src/lib/public-tenant.ts:32`, `apps/web/src/lib/public-tenant.ts:44`
  - 근거(plan SoT): PSR-DATA-03 — 모든 공개 page handler가 helper 사용
  - 문제: `TransactionSql`을 `Sql`로 넘기고, `sql.begin()` 반환 타입이 `T | null`과 맞지 않는다.
  - 권장 patch: callback tx 타입을 postgres-js transaction 타입에 맞추거나 local alias로 좁히고, `sql.begin<T | null>(...)` 형태로 반환 타입을 고정.

## major
- **PSRC-04**: D0011이 공개 DB role password를 migration에 하드코딩
  - 위치: `packages/db/migrations/D0011_public_reader.sql:11`
  - 근거(plan SoT): PSR-DATA-01 lines 137-140 — `CREATE ROLE app_public_reader LOGIN`; 운영 secret cascade
  - 문제: `PASSWORD 'app_public_reader_pw'`가 SQL에 고정되어 보안/운영 원자성 모두 취약하다.
  - 권장 patch: migration은 role/권한/policy만 만들고 password 설정은 환경별 provision 단계로 분리.

- **PSRC-05**: JSON-LD graph가 SCHEMA_MAPPING §2.5의 ref/full 정책을 충실히 구현하지 않음
  - 위치: `apps/web/src/lib/json-ld/builders.ts:58`, `builders.ts:77`, `builders.ts:96`, `builders.ts:137`
  - 근거(plan SoT): SCHEMA_MAPPING §2.5, §3 P-003/P-004/P-005/P-010
  - 문제: ref-only MedicalClinic이 실제 어느 entity에서도 참조되지 않는다. P-010은 author Physician을 “참조+inline 최소”로 요구하지만 `Article.author`에 `@id`만 넣고 Physician inline/name/image/jobTitle을 제공하지 않는다.
  - 권장 patch: WebPage `about`/`mainEntity` 등으로 clinic ref를 명시하고, Article author/reviewer는 최소 inline 객체로 출력.

- **PSRC-06**: JSON-LD checker가 cross-reference 무결성을 사실상 검증하지 못함
  - 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts:55`, `validate.ts:58`
  - 근거(plan SoT): PSR-SEO-14 — `@id` 유일 + cross-reference 무결성
  - 문제: 절대 URL이면 graph 내부 누락 참조도 통과한다. 현재 Article author처럼 graph에 없는 Physician ref가 LOCAL_PASS 될 수 있다.
  - 권장 patch: 동일 `siteBaseUrl` 내부 `@id`는 graph entity 또는 의도된 inline entity 존재를 강제하고, 외부 URL만 dereferenceable 예외로 둔다.

- **PSRC-07**: sitemap이 minimal 페이지와 lastmod SoT를 안정적으로 반영하지 않음
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:60`, `route.ts:69`, `route.ts:61`, `route.ts:70`
  - 근거(plan SoT): PUBLIC_SITE_RENDER_PLAN §7 scenario #11, §5.2; SEARCH_STANDARDIZATION §4.3
  - 문제: Doctors/Treatments list URL을 데이터가 있을 때만 넣는다. P-003/P-005는 빈 상태도 렌더되는 minimal 페이지다. 또한 list lastmod는 `updated_at` 최신값이 아니라 display/published 정렬 첫 행을 사용한다.
  - 권장 patch: P-003/P-005 list는 항상 포함하고, lastmod는 `max(updated_at)` aggregate로 계산.

- **PSRC-08**: canonical/OpenGraph URL이 request-aware absolute URL이 아님
  - 위치: `apps/web/src/lib/site-metadata.ts:40`, `site-metadata.ts:45`, `site-metadata.ts:50`
  - 근거(plan SoT): PSR-SEO-04 — `https://<host>/<instanceSlug><path>` path-based canonical
  - 문제: metadata helper는 `/${instanceSlug}/...` 상대 URL만 만든다. root layout에도 `metadataBase`가 없어 실제 canonical/OG가 host-aware SoT와 다르게 출력될 수 있다.
  - 권장 patch: request host/proto 기반 absolute canonical을 생성하거나 `metadataBase`를 명확히 설정.

- **PSRC-09**: Host/X-Forwarded headers를 검증 없이 SEO 산출물에 반영
  - 위치: `apps/web/src/lib/site-url.ts:13`, `site-url.ts:14`, `sitemap.xml/route.ts:18`, `robots.txt/route.ts:10`
  - 근거(plan SoT): PSR-SEO-04/12 — canonical/entity `@id` 안정성
  - 문제: 임의 Host header가 JSON-LD `@id`, sitemap, robots Sitemap URL을 오염시킬 수 있다.
  - 권장 patch: 허용 host allowlist 또는 trusted proxy 조건을 두고, 불일치 시 configured public origin fallback.

- **PSRC-10**: layout-level loader가 “한 번 SELECT” 결정과 다르게 페이지/metadata에서 반복 호출됨
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/layout.tsx:18`, `page.tsx:27`, `page.tsx:38`
  - 근거(plan SoT): PSR-COMP-04 — `loadSiteInitial`가 layout 안에서 한 번 SELECT, Header/Footer가 같은 데이터 사용
  - 문제: layout, page, generateMetadata가 각각 별도 transaction으로 같은 initial 데이터를 재조회한다.
  - 권장 patch: `cache(loadSiteInitial)` 또는 segment-level shared loader로 render pass 내 일관성과 중복 SELECT를 줄인다.

- **PSRC-11**: CT-02 businessHours narrowing이 너무 약해 잘못된 JSON이 렌더/JSON-LD까지 통과
  - 위치: `apps/web/src/lib/db-projection.ts:223`, `db-projection.ts:226`
  - 근거(plan SoT): LOCATION_LEGAL_PLAN LL-SCHEMA-16 — `openingHours[]`는 `dayOfWeek`, `opens`, `closes` SoT
  - 문제: `dayOfWeek` 배열만 있으면 valid로 간주한다. `opens/closes/from/to` 타입 검증이 없다.
  - 권장 patch: opening/reception은 `dayOfWeek: string[]`, `opens: HH:mm`, `closes: HH:mm`; lunch는 `from/to`까지 검사.

- **PSRC-12**: Markdown 외부 링크 rel 자동화가 protocol-relative URL을 놓침
  - 위치: `apps/web/src/lib/markdown.ts:139`, `markdown.ts:140`
  - 근거(plan SoT): PSR-COMP-09/Scenario #20 — 외부 링크 `rel="nofollow noopener noreferrer"`
  - 문제: `//evil.example`은 `startsWith("/")` 때문에 내부 링크로 처리되어 rel/target이 붙지 않는다.
  - 권장 patch: `//`는 외부 URL로 분류하고, 내부 링크는 단일 slash path만 허용.

## minor
- **PSRC-13**: Home이 P-001 정보 슬롯 일부를 렌더하지 않음
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/page.tsx:73`, `page.tsx:85`
  - 근거(plan SoT): PAGE_TYPES P-001 lines 104-109
  - 문제: 최신 인사이트(P-010 샘플 링크)와 위치·진료시간·연락처 요약이 없다. 파일 주석의 ContactCard도 실제 미구현.
  - 권장 patch: published article 1건 teaser와 `locationMain` 요약/CTA를 추가.

- **PSRC-14**: ContactPoint `@id`가 path-based absolute 패턴이 아님
  - 위치: `apps/web/src/lib/json-ld/entities.ts:42`
  - 근거(plan SoT): PSR-SEO-12 / SCHEMA_MAPPING §1.2 — path-based `@id` 안정성
  - 문제: `#contact-${id}` 상대 fragment라 페이지별 graph 병합/검증 시 identity가 불안정하다.
  - 권장 patch: `${ctx.siteBaseUrl}/#contact-${cta.id}`처럼 absolute id로 통일.

- **PSRC-15**: Legal route 내부 hostOrigin이 하드코딩
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44`
  - 근거(plan SoT): PSR-SEO-04/12, PSR-DATA-07
  - 문제: v0.1에서는 항상 404라 노출 가능성은 낮지만, 향후 published 합류 시 `example.local`이 sanitizer 외부 링크 판정에 섞인다.
  - 권장 patch: 다른 site pages와 동일하게 `siteBaseUrl(params.instanceSlug)` 사용.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PARTIAL
  - directory 이동, root redirect, sign-in consume redirect, admin Link/revalidatePath는 대체로 `/admin/<slug>`로 이동됨.
  - 하지만 `ClinicProfileForm.tsx`가 옛 `(admin)/[instanceSlug]` 경로를 import해 build/typecheck가 깨지므로 acceptance precondition은 아직 충족되지 않는다.
tokens used
144,047
# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=3 major=9 minor=3 (총 15)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫
- 검증: `pnpm --filter @glitzy/web typecheck` 실패

## blocking
- **PSRC-01**: PSR-CASCADE-01b 이후 stale import 때문에 web typecheck 실패
  - 위치: `apps/web/src/components/forms/ClinicProfileForm.tsx:14`
  - 근거(plan SoT): PSR-CASCADE-01b — admin route는 `(admin)/admin/[instanceSlug]`
  - 문제: `@/app/(admin)/[instanceSlug]/clinic-profile/actions`를 계속 import한다. 실제 파일은 `(admin)/admin/[instanceSlug]/...`.
  - 권장 patch: import를 `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions`로 변경하고 전체 form/action import 재검색.

- **PSRC-02**: `sanitize-html` 도입이 lock/install에 반영되지 않아 typecheck 실패
  - 위치: `apps/web/src/lib/markdown.ts:8`, `apps/web/package.json:27`, `apps/web/package.json:34`
  - 근거(plan SoT): PSR-COMP-09 — `sanitize-html` SSR 채택
  - 문제: package.json에는 추가됐지만 현재 workspace typecheck에서 모듈/타입을 찾지 못한다. `pnpm-lock.yaml`에도 `sanitize-html` 항목이 없다.
  - 권장 patch: `pnpm install --lockfile-only` 또는 정상 install로 lockfile을 갱신하고, `transformTags.a` 콜백 파라미터 타입도 명시.

- **PSRC-03**: `withPublicTenantTransaction` 타입이 postgres-js transaction 타입과 맞지 않아 typecheck 실패
  - 위치: `apps/web/src/lib/public-tenant.ts:28`, `apps/web/src/lib/public-tenant.ts:32`, `apps/web/src/lib/public-tenant.ts:44`
  - 근거(plan SoT): PSR-DATA-03 — 모든 공개 page handler가 helper 사용
  - 문제: `TransactionSql`을 `Sql`로 넘기고, `sql.begin()` 반환 타입이 `T | null`과 맞지 않는다.
  - 권장 patch: callback tx 타입을 postgres-js transaction 타입에 맞추거나 local alias로 좁히고, `sql.begin<T | null>(...)` 형태로 반환 타입을 고정.

## major
- **PSRC-04**: D0011이 공개 DB role password를 migration에 하드코딩
  - 위치: `packages/db/migrations/D0011_public_reader.sql:11`
  - 근거(plan SoT): PSR-DATA-01 lines 137-140 — `CREATE ROLE app_public_reader LOGIN`; 운영 secret cascade
  - 문제: `PASSWORD 'app_public_reader_pw'`가 SQL에 고정되어 보안/운영 원자성 모두 취약하다.
  - 권장 patch: migration은 role/권한/policy만 만들고 password 설정은 환경별 provision 단계로 분리.

- **PSRC-05**: JSON-LD graph가 SCHEMA_MAPPING §2.5의 ref/full 정책을 충실히 구현하지 않음
  - 위치: `apps/web/src/lib/json-ld/builders.ts:58`, `builders.ts:77`, `builders.ts:96`, `builders.ts:137`
  - 근거(plan SoT): SCHEMA_MAPPING §2.5, §3 P-003/P-004/P-005/P-010
  - 문제: ref-only MedicalClinic이 실제 어느 entity에서도 참조되지 않는다. P-010은 author Physician을 “참조+inline 최소”로 요구하지만 `Article.author`에 `@id`만 넣고 Physician inline/name/image/jobTitle을 제공하지 않는다.
  - 권장 patch: WebPage `about`/`mainEntity` 등으로 clinic ref를 명시하고, Article author/reviewer는 최소 inline 객체로 출력.

- **PSRC-06**: JSON-LD checker가 cross-reference 무결성을 사실상 검증하지 못함
  - 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts:55`, `validate.ts:58`
  - 근거(plan SoT): PSR-SEO-14 — `@id` 유일 + cross-reference 무결성
  - 문제: 절대 URL이면 graph 내부 누락 참조도 통과한다. 현재 Article author처럼 graph에 없는 Physician ref가 LOCAL_PASS 될 수 있다.
  - 권장 patch: 동일 `siteBaseUrl` 내부 `@id`는 graph entity 또는 의도된 inline entity 존재를 강제하고, 외부 URL만 dereferenceable 예외로 둔다.

- **PSRC-07**: sitemap이 minimal 페이지와 lastmod SoT를 안정적으로 반영하지 않음
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:60`, `route.ts:69`, `route.ts:61`, `route.ts:70`
  - 근거(plan SoT): PUBLIC_SITE_RENDER_PLAN §7 scenario #11, §5.2; SEARCH_STANDARDIZATION §4.3
  - 문제: Doctors/Treatments list URL을 데이터가 있을 때만 넣는다. P-003/P-005는 빈 상태도 렌더되는 minimal 페이지다. 또한 list lastmod는 `updated_at` 최신값이 아니라 display/published 정렬 첫 행을 사용한다.
  - 권장 patch: P-003/P-005 list는 항상 포함하고, lastmod는 `max(updated_at)` aggregate로 계산.

- **PSRC-08**: canonical/OpenGraph URL이 request-aware absolute URL이 아님
  - 위치: `apps/web/src/lib/site-metadata.ts:40`, `site-metadata.ts:45`, `site-metadata.ts:50`
  - 근거(plan SoT): PSR-SEO-04 — `https://<host>/<instanceSlug><path>` path-based canonical
  - 문제: metadata helper는 `/${instanceSlug}/...` 상대 URL만 만든다. root layout에도 `metadataBase`가 없어 실제 canonical/OG가 host-aware SoT와 다르게 출력될 수 있다.
  - 권장 patch: request host/proto 기반 absolute canonical을 생성하거나 `metadataBase`를 명확히 설정.

- **PSRC-09**: Host/X-Forwarded headers를 검증 없이 SEO 산출물에 반영
  - 위치: `apps/web/src/lib/site-url.ts:13`, `site-url.ts:14`, `sitemap.xml/route.ts:18`, `robots.txt/route.ts:10`
  - 근거(plan SoT): PSR-SEO-04/12 — canonical/entity `@id` 안정성
  - 문제: 임의 Host header가 JSON-LD `@id`, sitemap, robots Sitemap URL을 오염시킬 수 있다.
  - 권장 patch: 허용 host allowlist 또는 trusted proxy 조건을 두고, 불일치 시 configured public origin fallback.

- **PSRC-10**: layout-level loader가 “한 번 SELECT” 결정과 다르게 페이지/metadata에서 반복 호출됨
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/layout.tsx:18`, `page.tsx:27`, `page.tsx:38`
  - 근거(plan SoT): PSR-COMP-04 — `loadSiteInitial`가 layout 안에서 한 번 SELECT, Header/Footer가 같은 데이터 사용
  - 문제: layout, page, generateMetadata가 각각 별도 transaction으로 같은 initial 데이터를 재조회한다.
  - 권장 patch: `cache(loadSiteInitial)` 또는 segment-level shared loader로 render pass 내 일관성과 중복 SELECT를 줄인다.

- **PSRC-11**: CT-02 businessHours narrowing이 너무 약해 잘못된 JSON이 렌더/JSON-LD까지 통과
  - 위치: `apps/web/src/lib/db-projection.ts:223`, `db-projection.ts:226`
  - 근거(plan SoT): LOCATION_LEGAL_PLAN LL-SCHEMA-16 — `openingHours[]`는 `dayOfWeek`, `opens`, `closes` SoT
  - 문제: `dayOfWeek` 배열만 있으면 valid로 간주한다. `opens/closes/from/to` 타입 검증이 없다.
  - 권장 patch: opening/reception은 `dayOfWeek: string[]`, `opens: HH:mm`, `closes: HH:mm`; lunch는 `from/to`까지 검사.

- **PSRC-12**: Markdown 외부 링크 rel 자동화가 protocol-relative URL을 놓침
  - 위치: `apps/web/src/lib/markdown.ts:139`, `markdown.ts:140`
  - 근거(plan SoT): PSR-COMP-09/Scenario #20 — 외부 링크 `rel="nofollow noopener noreferrer"`
  - 문제: `//evil.example`은 `startsWith("/")` 때문에 내부 링크로 처리되어 rel/target이 붙지 않는다.
  - 권장 patch: `//`는 외부 URL로 분류하고, 내부 링크는 단일 slash path만 허용.

## minor
- **PSRC-13**: Home이 P-001 정보 슬롯 일부를 렌더하지 않음
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/page.tsx:73`, `page.tsx:85`
  - 근거(plan SoT): PAGE_TYPES P-001 lines 104-109
  - 문제: 최신 인사이트(P-010 샘플 링크)와 위치·진료시간·연락처 요약이 없다. 파일 주석의 ContactCard도 실제 미구현.
  - 권장 patch: published article 1건 teaser와 `locationMain` 요약/CTA를 추가.

- **PSRC-14**: ContactPoint `@id`가 path-based absolute 패턴이 아님
  - 위치: `apps/web/src/lib/json-ld/entities.ts:42`
  - 근거(plan SoT): PSR-SEO-12 / SCHEMA_MAPPING §1.2 — path-based `@id` 안정성
  - 문제: `#contact-${id}` 상대 fragment라 페이지별 graph 병합/검증 시 identity가 불안정하다.
  - 권장 patch: `${ctx.siteBaseUrl}/#contact-${cta.id}`처럼 absolute id로 통일.

- **PSRC-15**: Legal route 내부 hostOrigin이 하드코딩
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44`
  - 근거(plan SoT): PSR-SEO-04/12, PSR-DATA-07
  - 문제: v0.1에서는 항상 404라 노출 가능성은 낮지만, 향후 published 합류 시 `example.local`이 sanitizer 외부 링크 판정에 섞인다.
  - 권장 patch: 다른 site pages와 동일하게 `siteBaseUrl(params.instanceSlug)` 사용.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PARTIAL
  - directory 이동, root redirect, sign-in consume redirect, admin Link/revalidatePath는 대체로 `/admin/<slug>`로 이동됨.
  - 하지만 `ClinicProfileForm.tsx`가 옛 `(admin)/[instanceSlug]` 경로를 import해 build/typecheck가 깨지므로 acceptance precondition은 아직 충족되지 않는다.
