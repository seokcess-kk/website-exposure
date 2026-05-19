You are reviewing the **code implementation** of `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 (acceptance · 6 cycle · 36 findings 전건 처리). This is **cycle 1** of the code review. Produce a strict, broad critique on whether the code faithfully realizes every plan decision (EC-SCHEMA / EC-FORM / EC-RENDER / EC-CONTENT / EC-SEO / EC-DEFER / EC-CASCADE) and is correct/secure/atomic/accessible.

## SoT to read

1. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — plan SoT
2. `docs/core/DATA_MODEL.md` § 4 C-04 (Article.category required) · C-12 (FAQ 풀명세) · C-22 (ArticleCategory 풀명세) · C-24 (Publication) · C-25 (MediaAppearance)
3. `docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그 (ScholarlyArticle · VideoObject · FAQPage) + § 3 P-002/P-004/P-011 graph
4. `docs/core/CONTENT_STANDARDS.md` § 7.1.1.2 ContentType 예외 표
5. `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅
6. `docs/admin/ARCHITECTURE.md` § 3.8 · § 3.11 11페이지 · 어드민 7개
7. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 9.3 PSR-DEFER-11/15 해소

## Code under review

### EC-SCHEMA — DB migrations (6 신규)
- `packages/core-content/migrations/C0009_article_category.sql` — C-22 풀명세 컬럼 전체 + RLS tenant_isolation
- `packages/core-content/migrations/C0010_publication.sql` — authors JSONB NOT NULL (DEFAULT 제거 · ECP-18 정합) · DOI anchored regex · risk_level='Low' CHECK
- `packages/core-content/migrations/C0011_media_appearance.sql` — media_channel_type enum 4종 · risk_level='Low' CHECK
- `packages/core-content/migrations/C0012_faq.sql` — status='draft' + published_at IS NULL CHECK (EC-SCHEMA-14)
- `packages/core-content/migrations/C0013_article_category_fk.sql` — staged 4-step (ADD nullable + seed `general` + backfill + SET NOT NULL + FK)
- `packages/db/migrations/D0014_public_reader_eat.sql` — article_category instance_id only (EC-SCHEMA-17) · publication/media published only · faq published only
- `packages/core-content/src/schema.ts` v0.4 — 4 신규 table + article.categoryId notNull
- `packages/core-content/src/index.ts` v0.4 — export 추가
- `packages/migrations-runner/src/manifest.ts` — 16 단계 (이미 plan acceptance 안 patch 됨)

### EC-FORM — zod + 어드민 폼/route 4종
- `apps/web/src/lib/eat-content-schema.ts` — Publication/MediaAppearance/Faq/ArticleCategory zod schema (DOI anchored regex 일치 · EatStatusSchema = z.enum(['draft']))
- `apps/web/src/lib/errors.ts` — 4 entity constraint 매핑 추가
- `apps/web/src/lib/db-projection.ts` — ArticleRow `category_id`/`category_slug` 추가 · normalize 4종 추가
- `apps/web/src/components/forms/ArticleCategoryForm.tsx` (slug · name · description · displayOrder)
- `apps/web/src/components/forms/PublicationForm.tsx`
- `apps/web/src/components/forms/MediaAppearanceForm.tsx`
- `apps/web/src/components/forms/FaqForm.tsx` (v0.1 안내 배너)
- `apps/web/src/components/forms/ArticleForm.tsx` patch — categoryId select
- `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/{actions,page,new/page,[slug]/page}.tsx` — default `general` 삭제 차단 · article ref count 검사
- `apps/web/src/app/(admin)/admin/[instanceSlug]/publications/{actions,page,new/page,[slug]/page}.tsx`
- `apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/{actions,page,new/page,[slug]/page}.tsx`
- `apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/{actions,page,new/page,[slug]/page}.tsx`
- `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/{actions,new/page,[slug]/page}.tsx` — categoryId 통합
- `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` — 8 card dashboard

### EC-RENDER — JSON-LD · public page
- `apps/web/src/lib/markdown.ts` — `renderMarkdownToPlainText` 신규 (EC-RENDER-05 · ECP-19)
- `apps/web/src/lib/json-ld/entities.ts` — `scholarlyArticleEntity`/`videoObjectEntity`/`faqPageEntity` 신규 · `articleEntity` signature 변경 (category 인자 제거 · article.categorySlug 직접 사용)
- `apps/web/src/lib/json-ld/builders.ts` — `aboutGraph`/`doctorProfileGraph` Publications/Media inline 확장 · `faqPageGraph` 신규
- `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` — P-011 FAQ public page (빈 페이지도 200 · ECP-21)
- `apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx` — Publications/Media inline section + JSON-LD graph self-contained
- `apps/web/src/app/(site)/[instanceSlug]/about/page.tsx` — All Publications/Media + MedicalClinic.subjectOf 단일 (Organization 미사용 ECP-15)
- `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` — article JOIN article_category (ECP-17 · PSR-DEFER-15 해소)
- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — article 실 category_slug + P-011 FAQ entry (lastmod fallback)

### Seed
- `apps/web/src/seed.ts` — default `general` ArticleCategory INSERT (EC-SCHEMA-03)

### vitest
- `apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts` — 시나리오 24~36 (11 tests)
- `apps/web/src/lib/markdown.test.ts` — renderMarkdownToPlainText 3 tests 추가

## What to check (cycle 1)

### Plan SoT 합치
- **EC-SCHEMA**: 6 마이그레이션 SQL 의 SoT 정합 (C0009 풀명세 컬럼 전체 · C0010 authors NOT NULL DEFAULT 제거 · DOI regex · C0011 enum 4종 · C0012 status='draft' + published_at IS NULL CHECK · C0013 4단계 staged · D0014 article_category instance_id only)
- **EC-FORM**: zod schema 의 DOI regex DB 와 동일 anchored · EatStatusSchema 가 draft 만 · 4 form 의 server action FOR UPDATE → audit emit → revalidatePath → redirect 패턴 일관 · contentType 토큰 정합 (FAQ 대문자 · 나머지 PascalCase)
- **EC-RENDER**: graph self-contained (Doctor/About) · fragment-scoped @id · cross-page allowlist 미사용 · MediaAppearance 모든 channel_type → VideoObject 단일화 · Article URL JOIN article_category 검증 · FAQ 빈 페이지 200 · sitemap article 실 category slug + P-011
- **EC-CONTENT**: Publication/Media 면제 적용 (form/action 안 별도 강제) · FAQ Q/A 적용 (compliance-assistant 합류 까지 published 차단)
- **EC-DEFER 정합**: EC-DEFER-12 published 차단 · EC-DEFER-10 ArticleCategory 컬럼 UI 미노출 · EC-DEFER-11 VideoObject 단일화

### 정합성 / 원자성
- staged 4-step migration 의 idempotency (재실행 시 backfill INSERT IF NOT EXISTS / NULL article row 만 UPDATE)
- article actions categoryId resolve 흐름 (form 값 → currentCategoryId → default `general`) — race condition 점검
- ArticleCategory delete 의 `general` 보호 + article ref count 검사 (race 안전 — same tx 안 검사)
- D0014 의 article_category policy 가 status 게이트 없음 (EC-SCHEMA-17)

### 보안 / RLS
- 4 신규 table tenant_isolation policy (USING + WITH CHECK)
- D0014 GRANT — app_public_reader 의 instance scope + published 게이트 (publication/media) vs taxonomy public (article_category)
- FAQ Markdown answer 안 <script> payload → JSON-LD `Answer.text` 평문 strip (renderMarkdownToPlainText)
- external link rel="nofollow noopener noreferrer" (Publication/Media 카드)

### 데이터 모델
- Drizzle schema v0.4 — articleCategory self-referencing FK · publication/media/faq 의 composite FK (instance_id) 정합
- DB CHECK regex anchored — DOI · PubMed ID · slug · url format

### TypeScript / 코드 품질
- 4 form/route 의 TenantResolveError catch (4 종 action.kind 분기 — redirect-sign-in/not-found/forbidden/info)
- mapDbErrorToResult 4 entity constraint 매핑 완비성
- articleEntity signature 변경 — 모든 호출처 patch (validate.test.ts · insights detail page)
- forwardref 회피 — Drizzle schema articleCategory 위치 + article.categoryFk raw SQL SoT

### a11y / SEO
- P-011 FAQ `<details>` collapsible 의 a11y · 빈 상태 안내
- sitemap.xml 안 P-011 + article URL 정합
- JSON-LD ScholarlyArticle/VideoObject @id 유일성 (fragment-scoped page+slug 조합)

### 시나리오 (PLAN § 8.1 24~36)
- vitest scenario 24~36 안 자동 검증 가능 부분만 (11 tests + markdown 3 tests)
- DB 레벨 (FAQ status='draft' CHECK · Publication risk_level CHECK · ArticleCategory FK 등) 는 e2e 검증 deferred — vitest scope 외

### docs cascade
- DATA_MODEL · SCHEMA_MAPPING · CONTENT_STANDARDS · PAGE_TYPES · ARCH · M0_BUILD_EXPORT · PUBLIC_SITE_RENDER PSR-DEFER 해소 marker — plan acceptance commit 안 이미 patch 됨 (재검증 없음)

## Output format

```
# EAT_CONTENT code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **ECC-01**: <짧은 제목>
  - 위치: <file>:<line>
  - 근거(plan SoT): EC-... §...
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition 점검
- EC-CASCADE-05 (D0014 실 SQL): <PASS|FAIL>
- EC-RENDER 4-기둥 (faq · doctor · about · article SQL JOIN): <PASS|FAIL>
- EC-SCHEMA 6 마이그레이션 idempotency: <PASS|FAIL>
- 누계 시작점: 144 cycle 1224 (plan acceptance) → ?
```

가능한 한 광범위하게 보고, 파일을 line 단위로 인용하라. 한국어로 응답.
