# 공개 사이트 렌더 minimal plan (v1.0·acceptance·2026-05-18)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.

> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.

본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.

본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.

> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.

## SoT

- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder — M0 v1.0 static export to Git cascade target.
- 기존 packages/apps 실 시그니처:
  - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 — cycle1 PSR-02 patch 후 `(admin)/admin/[instanceSlug]/...` 로 prefix 격상)
  - `apps/web/src/app/layout.tsx` (root layout · `<html><body>` SoT — site layout 은 fragment 만)
  - `apps/web/src/lib/{db, env, page-context, tenant}.ts`
  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
  - `packages/auth/src/...` (resolveTenantContext + audit)
  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)

## 1. 목적과 범위

### 1.1 목적

- 운영자가 어드민에서 저장한 6 entity 콘텐츠를 **실제 클라이언트 사이트** 처럼 렌더 — 운영자가 입력 결과를 즉시 검증 가능.
- M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰(JSON-LD·SEO meta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.
- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.

### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정

| 항목 | 비고 |
|---|---|
| `apps/web/src/app/(site)/[instanceSlug]/...` route group 신설 | 공개 사이트 |
| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
| SSR + Next ISR | `export const revalidate = 60` minimal |
| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
| JSON-LD 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEMA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA marker) |
| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
| not-found · 404 | Next `notFound()` |
| Markdown sanitizer SSR 정합 (cycle1 PSR-19·20 정정) | `sanitize-html` (SSR 호환) + 외부 링크 `rel="nofollow noopener noreferrer"` |
| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
| 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
| CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
| 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
| 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
| draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
| 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
| 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |

## 2. 라우팅 결정

### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정

```
apps/web/src/app/
├─ layout.tsx                            -- root layout (HTML/BODY SoT · 변경 없음)
├─ (admin)/
│  └─ admin/                             -- cycle1 PSR-02 patch: `/admin` prefix 격상
│     └─ [instanceSlug]/                 -- 기존 어드민 (clinic-profile, doctors, treatments, articles, ...)
├─ (site)/
│  └─ [instanceSlug]/
│     ├─ layout.tsx                      -- fragment only (NO <html>/<body> · cycle1 PSR-03)
│     ├─ page.tsx                        -- P-001 Home
│     ├─ about/page.tsx                  -- P-002 About
│     ├─ doctors/
│     │  ├─ page.tsx                     -- P-003 Doctors List
│     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
│     ├─ treatments/
│     │  ├─ page.tsx                     -- P-005 Treatments List
│     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
│     ├─ insights/
│     │  └─ [category]/
│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
│     ├─ contact/page.tsx                -- P-012 Contact
│     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5 closed types) · noindex v0.1
│     ├─ locations/
│     │  └─ [slug]/page.tsx              -- P-014 Location Detail (main 1건 v0.1)
│     ├─ sitemap.xml/route.ts            -- per-instance sitemap
│     ├─ robots.txt/route.ts             -- per-instance robots
│     └─ not-found.tsx                   -- per-instance 404
├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
├─ sign-out/...
├─ sign-in/cleanup/...
├─ api/site-meta-fetch/...
└─ ...
```

**결정**:
- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
  - `apps/web/src/app/(admin)/[instanceSlug]/...` → `apps/web/src/app/(admin)/admin/[instanceSlug]/...` 디렉토리 이동
  - `apps/web/src/app/sign-in/consume/route.ts` 의 redirect target `/<firstSlug>` → `/admin/<firstSlug>` (firstActiveMembershipResolver 결과)
  - `apps/web/src/app/sign-out/route.ts` · `apps/web/src/app/sign-in/cleanup/route.ts` 의 referrer/return-to 처리 영향 검토 (현재는 별 영향 없음 — 단순 `/sign-in` 또는 `/` 로 redirect)
  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ...}` 안 `revalidatePath('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL code v1.1 cascade)
  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` 의 `revalidatePath` 2 곳
  - `apps/web/src/app/api/site-meta-fetch/route.ts` 인증 redirect path
  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.

## 3. 데이터 접근 결정

### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정

```sql
-- packages/db/migrations/D0011_public_reader.sql (신규)

-- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
-- 가 MEMBERSHIP 으로 SET ROLE. login user 자체 는 운영 환경 별 secret cascade.
-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
CREATE ROLE app_public_reader LOGIN;

GRANT USAGE ON SCHEMA public TO app_public_reader;

-- cycle1 PSR-05 patch: instance slug resolve 전용 policy.
-- public reader 가 처음 `instance` 테이블을 조회해 slug → id 매핑. 이 시점은 RLS USING 검증 전.
-- 따라서 instance 테이블 에는 별도 policy (active=true 만 노출).
GRANT SELECT ON instance TO app_public_reader;

CREATE POLICY public_reader_instance_select
  ON instance
  FOR SELECT
  TO app_public_reader
  USING (active = true);

-- cycle1 PSR-15 patch: 6 content table 별 per-table policy 명시.
-- 모든 policy 는 USING `instance_id = current_setting('app.current_instance_id')` 정합.
-- helper 가 instance lookup 직후 set_config 수행.

GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
                treatment_page, article, legal_document
  TO app_public_reader;

CREATE POLICY public_reader_clinic_profile_select
  ON clinic_profile FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_location_profile_select
  ON location_profile FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_doctor_profile_select
  ON doctor_profile FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND active = true
  );

CREATE POLICY public_reader_treatment_page_select
  ON treatment_page FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY public_reader_article_select
  ON article FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
-- DB CHECK 가 status='draft' 만 허용하므로 published row 미존재. SELECT 자체 차단.
-- 어드민 인증 세션 (별 helper · withSkeletonTx app_tenant_user) 만 draft 접근 가능.
-- 본 policy 는 application 단 status='published' 만 통과 — DB CHECK 와 정합.
CREATE POLICY public_reader_legal_document_select
  ON legal_document FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );
```

**결정**:
- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
- (PSR-DATA-03) 모든 공개 page handler 가 `withPublicTenantTransaction({ instanceSlug })` 헬퍼 사용. 흐름:
  1. instance slug 조회 (`SELECT id FROM instance WHERE slug = ? AND active = true LIMIT 1`)
  2. `SELECT set_config('app.current_instance_id', <id>, true)` (transaction-scoped)
  3. content table SELECT (RLS USING 자동 적용)
  4. return rows
- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
- (PSR-DATA-05 · cycle1 PSR-21) env cascade:
  - `WEB_PUBLIC_DATABASE_URL` 신규 — `apps/web/.env.example` 에 추가
  - `WEB_DATABASE_URL` (기존 어드민) 와 분리
  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
  - pooling mode = transaction (어드민과 동일)
  - production deployment secret cascade — Vercel/Cloud Run env

### 3.2 status filter — cycle1 PSR-06·16 정정 (PSR-DATA-06)

DB-level RLS policy 가 row-level filter 를 강제 (§ 3.1). application 단 SELECT 는 추가 WHERE 없음 — RLS 가 자동 처리.

| Entity | RLS USING (D0011) | 의미 |
|---|---|---|
| `clinic_profile` | `instance_id` only | 1행 · 항상 표시 |
| `location_profile` | `instance_id` only | main slug 만 v0.1 |
| `doctor_profile` | `instance_id + active = true` | active 만 |
| `treatment_page` | `status = 'published' AND published_at <= now()` | publish 게이트 + 미래 발행 제외 |
| `article` | 동일 | 동일 |
| `legal_document` | `status = 'published'` | **v0.1 단계 published row 0개 — 공개 렌더 차단** (DB CHECK 가 draft 만 허용 · LL-SCHEMA-03) |

**결정 (cycle1 PSR-06)**:
- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
  - row 0개 → Next `notFound()` (404) — 공개 노출 안 됨
  - 또는 별 응답 페이지 "정책 문서 준비 중" — 운영자에 알림
- 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.

### 3.3 not-found · 빈 페이지 (PSR-DATA-08)

- `instance` 미존재 또는 `active = false` → Next `notFound()` → 글로벌 404
- `doctor_profile[slug]` 매칭 0행 → `notFound()`
- `treatment_page[slug]` 매칭 0행 또는 status != published → `notFound()`
- `article[slug]` 매칭 0행 → `notFound()`
- `legal_document[type]` 매칭 0행 (v0.1 단계 항상) → `notFound()`
- `location_profile[slug]` 매칭 0행 → `notFound()`

## 4. 페이지 컴포넌트 결정

### 4.1 root layout 책임 분리 (PSR-COMP-01) — cycle1 PSR-03 정정 + cycle2 PSR-28 정정

- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
- `apps/web/src/app/(site)/[instanceSlug]/layout.tsx` (신규) — fragment 반환:

```tsx
export default async function SiteLayout({
  params, children,
}: { params: { instanceSlug: string }; children: React.ReactNode }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  return (
    <>
      <SiteHeader initial={initial} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter initial={initial} />
    </>
  );
}
```

**결정**:
- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.

### 4.2 DB → Core contract field mapping (PSR-COMP-05) — cycle1 PSR-12 정정

DATA_MODEL contract 와 Drizzle 실 column 명이 다른 entity 가 있음. 공개 페이지가 어느 SoT 를 읽는지 명확화.

| Entity | Drizzle column (실 DB · packages/core-content/src/schema.ts) | Core contract field (DATA_MODEL) | 사용처 (페이지) |
|---|---|---|---|
| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
| ClinicProfile | `description` | C-01 `description` | Hero · OG description fallback |
| ClinicProfile | `long_description` | C-01 `longDescription` | About 본문 |
| ClinicProfile | `slogan` | C-01 `slogan` | Hero subtitle |
| ClinicProfile | `logo_url` | C-01 `logoUrl` | Header logo |
| ClinicProfile | `og_image_url` | C-01 `ogImageUrl` | OG default image |
| ClinicProfile | `primary_ctas` (JSONB) | C-01 `primaryCtas[]` | CTA buttons |
| LocationProfile | `street_address` · `address_locality` · `address_region` · `postal_code` | C-21 address 필드 | Contact/Location address |
| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
| LocationProfile | `email` | C-21 `email` | Contact/Footer |
| LocationProfile | `metadata.businessHours` (CT-02 SoT) | C-21 `businessHours` | Contact 7요일 표 |
| DoctorProfile | `name` | C-02 `name` | Doctor card/header |
| DoctorProfile | `title` | C-02 `title` | Doctor headline (직책) |
| DoctorProfile | `bio` | C-02 `bio` | Doctor body |
| DoctorProfile | `photo_url` | C-02 `photoUrl` | Doctor photo |
| **TreatmentPage** | `title` (DB) | **DATA_MODEL C-03 `name` (contract)** — Drizzle 차이 marker | Treatment heading |
| TreatmentPage | `summary` | C-03 `summary` | Card snippet + meta description |
| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
| TreatmentPage | `hero_image_url` | C-03 `heroImageUrl` | Hero image · OG fallback |
| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
| **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
| Article | `summary` | C-04 `summary` | Card · meta description |
| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
| LegalDocument | `title` | C-16 `title` | Legal heading (v0.1 단계 노출 X) |
| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body |
| LegalDocument | `document_type` | C-16 `documentType` | Routing key |
| LegalDocument | `effective_date` | C-16 `effectiveDate` | Legal meta |

**결정**:
- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
- (PSR-COMP-07) `apps/web/src/lib/db-projection.ts` 신규 — entity 별 raw DB row → normalized projection 변환. JSON-LD 생성기 도 normalized projection 사용.

### 4.3 페이지별 컴포넌트 (PSR-COMP-08)

| 페이지 | 컴포넌트 | 데이터 |
|---|---|---|
| P-001 Home | `<Hero>` (slogan/description) · `<DoctorsTeaser>` (3명) · `<TreatmentsTeaser>` (3건) · `<ContactCard>` | ClinicProfile + LocationMain + DoctorProfile (active LIMIT 3 ORDER BY displayOrder ASC) + TreatmentPage (published LIMIT 3 ORDER BY publishedAt DESC) |
| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
| P-013 Legal/Policy `/legal/[type]` | (v0.1 항상 404 — DB CHECK 가 draft 만 허용 + RLS published 만 SELECT) | (none — defer) |
| P-014 Location Detail `/locations/[slug]` | `<LocationHero>` · `<LocationAddress>` · `<BusinessHoursTable>` · `<ReservationChannels>` · `<DirectionsAndParking>` (metadata 안 info v0.1 fallback 미입력) | LocationProfile (slug='main' v0.1) |

### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정

- `apps/web/src/lib/markdown.ts` 신설 — SSR 호환 sanitizer:
  - 채택: **`sanitize-html`** (SSR 호환 · 의존성 작음) 또는 `rehype-sanitize` (unified pipeline · 더 표준)
  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
- 허용 태그: `h1`/`h2`/`h3`/`h4`/`p`/`ul`/`ol`/`li`/`a`/`strong`/`em`/`code`/`pre`/`blockquote`/`table`/`thead`/`tbody`/`tr`/`th`/`td`/`hr`/`br`
- 허용 속성: 전 태그 `class`/`id`/`lang` · `a` 만 `href`/`rel`/`target` · `code`/`pre` `class` (syntax highlight)
- 외부 링크 자동 처리: `href` 가 `http(s)://` 시작 + 호스트가 instanceSlug 도메인 외 → `rel="nofollow noopener noreferrer"` 자동 추가. 내부 링크 (`/...`) 는 그대로.
- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.

### 4.5 디자인 토큰 통합 (PSR-COMP-10) — cycle1 PSR-13·14 정정

`apps/web/tailwind.config.ts` v0.2 patch — DESIGN_TOKENS v1.0 § 3.2 semantic 22 정합 alias 표:

| Tailwind class | semantic token (DESIGN_TOKENS SoT) | CSS custom property (v0.1 신설) |
|---|---|---|
| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
| `bg-elevated` | `color.surface.elevated` | `--color-surface-elevated` |
| `bg-subtle` | `color.surface.subtle` | `--color-surface-subtle` |
| `text-fg-default` · `text-primary-fg` | `color.text.primary` | `--color-text-primary` |
| `text-fg-muted` | `color.text.secondary` | `--color-text-secondary` |
| `text-fg-disabled` | `color.text.disabled` | `--color-text-disabled` |
| `text-fg-inverse` | `color.text.inverse` | `--color-text-inverse` |
| `border-default` | `color.border.default` | `--color-border-default` |
| `border-subtle` | `color.border.subtle` | `--color-border-subtle` |
| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
| `bg-brand-secondary` | `color.brand.secondary` | `--color-brand-secondary` |
| `bg-success` · `text-success` | `color.status.success` | `--color-status-success` |
| `bg-success-subtle` | `color.status.success.subtle` | `--color-status-success-subtle` |
| `bg-warning` · `text-warning` | `color.status.warning` | `--color-status-warning` |
| `bg-warning-subtle` | `color.status.warning.subtle` | `--color-status-warning-subtle` |
| `bg-error` · `text-error` | `color.status.error` | `--color-status-error` |
| `bg-error-subtle` | `color.status.error.subtle` | `--color-status-error-subtle` |
| `bg-info` · `text-info` | `color.status.info` | `--color-status-info` |
| `bg-info-subtle` | `color.status.info.subtle` | `--color-status-info-subtle` |
| `ring-focus` | `color.focus.ring` | `--color-focus-ring` |
| `bg-overlay-modal` | `color.overlay.modal` | `--color-overlay-modal` |
| `bg-overlay-scrim` | `color.overlay.scrim` | `--color-overlay-scrim` |

**결정**:
- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:

```css
:root, [data-theme="light"] {
  --color-surface-background: #f9fafb;  /* gray.50 */
  --color-text-primary: #111827;        /* gray.900 */
  /* ... 22 토큰 모두 light 값 */
}
[data-theme="dark"] {
  --color-surface-background: #111827;  /* gray.900 */
  --color-text-primary: #f9fafb;        /* gray.50 */
  /* ... 22 토큰 모두 dark 값 */
}
```

  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
  - DESIGN_TOKENS § 3.4 의 30 쌍 접근성 대비 검증은 build-time test cascade (별 plan).

## 5. SEO / AEO / GEO 결정

### 5.1 Next metadata API (PSR-SEO-01) — cycle1 PSR-10 정정

각 페이지 안 `export async function generateMetadata({ params })` 정의. 출력 SoT (SEARCH_STANDARDIZATION § 2 정합):

```ts
{
  title: "<page-specific> | <clinic.name>",  // P-001 default = `${clinic.name} | ${clinic.slogan ?? clinic.description}`
  description: "<page-specific 50~160자>",
  alternates: { canonical: "<v0.1 path-based>" },
  openGraph: {
    title, description,
    type: <page-specific>,        // P-001/P-002/P-003/P-005/P-012/P-014 = "website" · P-004 = "profile" · P-006 = "article" · P-010 = "article" · P-013 = "website" (v0.1 미노출)
    url: <canonical>,
    images: [<heroImage 또는 ogImage>],
    locale: "ko_KR",
    siteName: clinic.name,
  },
  twitter: { card: "summary_large_image", title, description, images: [<heroImage 또는 ogImage>] },
  robots: {
    index: <page-specific>,        // P-013 = false (v0.1 차단), 그 외 = true. preview/staging 환경은 전 페이지 false (env `WEB_NOINDEX=true`)
    follow: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
    { media: "(prefers-color-scheme: dark)", color: "<BrandTokens.colors.dark.primary>" },    // 평면화 결과 — `color.brand.primary` dark
  ],
}
```

**결정**:
- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
- (PSR-SEO-05) title 패턴: `<page-specific> | <clinic.name>`. P-001 은 fallback `clinic.slogan ?? clinic.description`.
- (PSR-SEO-06) description: 페이지 entity 의 `description`/`summary` 우선. 부재 시 clinic.description fallback. 50~160자 강제.

### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)

- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
- 응답: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod SoT 정합.
- **changefreq · priority (SEARCH_STANDARDIZATION § 4.3 그대로)**:

| 페이지 | changefreq | priority |
|---|---|---|
| P-001 Home | weekly | 1.0 |
| P-002 About | monthly | 0.8 |
| P-003 Doctors List | monthly | 0.7 |
| P-004 Doctor Profile | monthly | 0.7 |
| P-005 Treatments List | monthly | 0.8 |
| P-006 Treatment Detail | monthly | 0.8 |
| P-010 Article Detail | monthly | 0.5 |
| P-012 Contact | yearly | 0.6 |
| P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
| P-014 Location Detail | monthly | 0.7 |

- **lastmod (SEARCH_STANDARDIZATION § 4.4 그대로)**:
  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
  - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
  - ClinicProfile/Location: `updated_at` (DATA_MODEL § 2.2 `@updatedAt`).
  - Doctor: `updated_at` fallback.
- M0 v1.0 합류 시 static sitemap.xml 도 export.

### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)

- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
- SEARCH_STANDARDIZATION § 3 SoT 정합:
  - § 3.1: AI 크롤러 분류 4계열 — **A. 일반 검색 색인** (Googlebot · Yeti · Bingbot) · **B. AI 검색 인덱싱·답변용** (OAI-SearchBot · PerplexityBot · Claude-SearchBot) · **C. User-triggered fetch** (ChatGPT-User · Perplexity-User · Claude-User) · **D. AI 학습·모델 개선용** (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai · meta-externalagent).
  - § 3.2: `aiCrawlerPolicy` enum **required** — `allow | disallowTraining | disallowAll | custom` (4종). 미설정 시 빌드 fail.
  - § 3.3: 정책별 출력 예시 + `allow` 시 `aiCrawlerLegalApproved: true` 필수 (fail-gate).

**결정 (v0.1 starter template)** — cycle2 PSR-22 정정 (SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로):
- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):

```
# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)

# 일반 룰
User-agent: *
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Allow: /

# A. 일반 검색 색인 — Allow
User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: Bingbot
Allow: /

# B. AI 검색 인덱싱·답변용 — Allow
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# C. User-triggered fetch — Allow
User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-User
Allow: /

# D. AI 학습·모델 개선용 — Disallow
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)

Sitemap: https://{domain}/sitemap.xml
```

> v0.1 단계 `{domain}` = `<host>/<instanceSlug>` path-based. M0 v1.0 도메인 매핑 합류 시 (PSR-DEFER-02) `<customDomain>` 으로 평면화. SEARCH_STANDARDIZATION § 3.3 footnote 의 `experimentalAiBots` flag 도 동일 cascade.

- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
  - `custom`: § 3.4 merge/replace 룰
  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)

### 5.4 JSON-LD 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정

- 모든 페이지 `<head>` 안 단일 `<script type="application/ld+json">` block 출력.
- 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
- **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:

| 페이지 | graph entities (cycle1 PSR-07 정정) |
|---|---|
| P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |

**결정**:
- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
  - rule checker 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts` 신설
  - 페이지별 expected entities 정의 (위 표 그대로)
  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과

### 5.5 OpenGraph / Twitter (PSR-SEO-15)

- 페이지 entity 의 `hero_image_url` 또는 `og_image_url` 사용. 부재 시 clinic.og_image_url fallback.
- v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
- `og:type` 매핑 — § 5.1 PSR-SEO-03 SoT.

## 6. 환경·precondition (PSR-ENV-01) — cycle1 PSR-21 정정

acceptance checklist:

| # | 항목 | 상태 |
|---|---|---|
| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
| 2 | `WEB_PUBLIC_DATABASE_URL` env 추가 — `apps/web/.env.example` patch | acceptance precondition |
| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
| 4 | `apps/web/src/lib/public-tenant.ts` 신규 — `withPublicTenantTransaction({ instanceSlug })` helper | acceptance precondition |
| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
| 9 | `sanitize-html` 의존성 추가 (`apps/web/package.json`) | acceptance precondition |
| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |

## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
| 2 | DoctorProfile 3건 등록 후 `/<instanceSlug>/doctors` 페이지에 3 card 표시 | active=true 만 보임 · displayOrder ASC 정렬 |
| 3 | DoctorProfile.active=false 한 row → `/<instanceSlug>/doctors` 리스트에서 사라짐 | row count 2 |
| 4 | TreatmentPage status='draft' → `/<instanceSlug>/treatments` 리스트에 미노출 (RLS 자동 차단) | 0건 |
| 5 | TreatmentPage status='published' + publishedAt now() → 노출 | 1건 |
| 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
| 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
| 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
| 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `notFound()` (instance lookup policy USING `active=true`) |
| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
| 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 출력 |
| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `BrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |
| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
| 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |

## 8. 작업 단위 (cycle1 PSR-21 cascade 분해)

| # | 작업 | 산출물 |
|---|---|---|
| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
| 2 | `WEB_PUBLIC_DATABASE_URL` env + `.env.example` patch | apps/web/.env.example |
| 3 | `apps/web/src/lib/public-db.ts` singleton | helper |
| 4 | `apps/web/src/lib/public-tenant.ts` `withPublicTenantTransaction` | helper |
| 5 | `apps/web/src/lib/db-projection.ts` raw DB → normalized projection | helper |
| 6 | `loadSiteInitial` (layout 안 ClinicProfile + LocationMain + brandTokens 1회 SELECT) | apps/web/src/lib/site-initial.ts |
| 7 | (site) route group + 10 페이지 layout/page + not-found.tsx | apps/web/src/app/(site)/[instanceSlug]/* |
| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
| 9 | Markdown 렌더 (`sanitize-html` + 외부 링크 rel) | apps/web/src/lib/markdown.ts |
| 10 | JSON-LD 생성기 (페이지 타입 별 graph builder · normalize projection 사용) | apps/web/src/lib/json-ld/* |
| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)

- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
- `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
- `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.

### 9.2 M1 Phase Alpha 합류

- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
- `PSR-DEFER-08`: draft preview token (어드민 외).
- `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.

### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**

- `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
- `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.

### 9.4 외부 / manual QA

- `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.

### 9.5 M3 다국어 합류

- `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.

## 10. Cascade markers (다른 SoT 문서로 전파)

> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.

- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
