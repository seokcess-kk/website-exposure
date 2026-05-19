You are reviewing the **plan** `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model decisions, routing, RLS/permission, JSON-LD, SEO/AEO/GEO standards, design tokens, scenarios.

## SoT to read

1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 — the plan under review.
2. `docs/core/PAGE_TYPES.md` — 14 mandatory page types · M0 게이트 #1.
3. `docs/core/SCHEMA_MAPPING.md` — JSON-LD graph 구성 SoT (§ 1·§ 2·§ 3).
4. `docs/core/SEARCH_STANDARDIZATION.md` — robots.txt · sitemap.xml · AI 크롤러 4계열 (§ 5).
5. `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
6. `docs/core/DATA_MODEL.md` v0.9 — C-01~C-26.
7. `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier · semantic 22 · light/dark.
8. `docs/admin/ARCHITECTURE.md` v0.7 — § 3 Vertical Slice · § 3.11 게이트 #1.
9. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument · CT-02 businessHours · primaryCtas.
10. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 — LL-CASCADE-04 placeholder.
11. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit · § 8.1 시나리오 · 어드민 URL 패턴.
12. `packages/core-content/src/schema.ts` v0.3 — Drizzle SoT.
13. `packages/db/migrations/D0010_instance.sql` · `packages/auth/...` (resolveTenantContext).
14. `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04 target).
15. `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 URL 패턴 · PSR-CASCADE-01 의 출발점).
16. `apps/web/src/lib/{db,tenant,page-context,env}.ts` (어드민 컨텍스트 패턴).

## What to check (cycle 1)

### Plan SoT 합치
- 모든 PSR-* 결정 (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) 이 reference SoT 와 일관
- PAGE_TYPES 의 P-001~P-014 10개 minimal 선택 정합
- SCHEMA_MAPPING § 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 정합 (특히 풀 entity vs 참조)
- DESIGN_TOKENS v1.0 의 light/dark · semantic 22 · primitive 카탈로그 통합 정합
- CONTENT_STANDARDS § 7.1.1.1 LegalDocument 면제 정합 (LegalRenderer 경로)
- DATA_MODEL C-01~C-21 의 필드 매핑 (Hero/About/Doctor/Treatment/Article/Location/Legal)
- ADMIN_UI_SKELETON v1.0 acceptance commit 후 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 영향

### 데이터 접근 / 권한
- 신규 PostgreSQL role `app_public_reader` 의 권한 설계 (RLS USING `instance_id` · GRANT SELECT only)
- `withPublicTenantTransaction` helper 가 `withSkeletonTx` 와 어떻게 분리되는지 (audit emit 권한 없음 · session 없음)
- `WEB_PUBLIC_DATABASE_URL` 분리 + pgbouncer userlist cascade
- status filter (`status='published' AND published_at <= now()`) 정확성 — 미래 publishedAt 제외
- LegalDocument 의 status='draft' 노출 정당화 (v0.1 한정 · LL-DEFER-01 합류 시점까지)
- 페이지 부재 시 `notFound()` (404) — Next 14 server component 한계 (HTTP 404 status 보장 OK)

### 라우팅
- `/<instanceSlug>/...` path-based 와 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 — 기존 sign-in/sign-out/cleanup/api route 영향
- (site) route group 의 layout 격리 (html/body 중복 회피 — Next.js root layout 정책)
- 도메인 매핑 cascade marker (PSR-DEFER-02)

### JSON-LD / SEO
- SCHEMA_MAPPING § 1.2 `@id` 패턴 (`https://{domain}/#organization`) 의 v0.1 path-based 변형 정합
- `@graph` 통합 방식 (페이지당 단일 `<script>`)
- BreadcrumbList Home 제외 모든 페이지 출력 정합
- `inLanguage` CreativeWork only 정합
- canonical · OpenGraph · Twitter · robots metadata API 표현
- sitemap.xml route handler 의 lastmod · changefreq · priority 결정
- robots.txt 의 AI 크롤러 4계열 (SEARCH_STANDARDIZATION § 5 — GPTBot/ClaudeBot/PerplexityBot/Naverbot) 정합

### 디자인 토큰
- Tailwind v3.4 안 DESIGN_TOKENS v1.0 semantic 22 통합 방식 (`colors.canvas`·`colors.fg.default`·...)
- light/dark 분기 (`darkMode: ['class', '[data-theme="dark"]']`)
- CSS custom property 와 Tailwind class 의 매핑 정합

### XSS / 보안
- Markdown 렌더 라이브러리 선택 + DOMPurify 또는 sanitize-html 적용
- 외부 링크 `rel="nofollow noopener"` 자동 처리
- `app_public_reader` SQL injection 방어 (parameterized query)
- audit emit 권한 없음 — 공개 페이지 access log 분리

### 시나리오
- 1~20 가 minimal 검증 충분한가
- v0.1 단계에서 검증 어려운 시나리오 (16 dark mode · 18 JSON-LD validator) marker 명시

### Cascade markers (acceptance precondition)
- PSR-CASCADE-01: 어드민 URL `/admin` prefix — apps/web 디렉토리 구조 변경 + ADMIN_UI_SKELETON code v1.0 patch
- PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 v0.1 marker
- PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2 patch
- PSR-CASCADE-04: migrations-runner manifest 10단계
- PSR-CASCADE-05: pgbouncer userlist

## Output format (markdown)

```
# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **PSR-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(SoT): <인용>
  - 문제: ...
  - 권장 patch: ...

## major
- **PSR-NN**: ...

## minor
- **PSR-NN**: ...

## cascade marker / acceptance precondition 점검
- PSR-CASCADE-01~05: <PASS|FAIL|TBD>
```

가능한 한 광범위하게 보고, 추측이 아니라 실제 SoT 파일을 읽고 line 단위로 인용하라. 한국어로 응답.
