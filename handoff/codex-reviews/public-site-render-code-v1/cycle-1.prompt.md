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
