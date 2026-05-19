# E-A-T Content 확장 plan (v1.0·acceptance·2026-05-18)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **6 cycle 36 findings 전건 수용** · cycle 6 closeableAfterPatch=true 확정. 수렴 추세 **22 → 8 → 3 → 2 → 1 → 0**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.

> **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.

본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:

| Entity | 신규 vs 합류 | DATA_MODEL ID |
|---|---|---|
| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |

모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.

> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).

## SoT

- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
- `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
- `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
  - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
  - `apps/web/src/lib/json-ld/{entities, builders}.ts` (JSON-LD generator)
  - `apps/web/src/lib/json-ld/__tests__/validate.ts` (cross-page allowlist + tenant base path)
  - `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` (현재 fallback `general` 만 — 본 plan 합류 후 DB join)

## 1. 목적과 범위

### 1.1 목적

- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
- **운영자 입력 UX 표준화** — M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용.
- **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.

### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정

| 항목 | 비고 |
|---|---|
| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
| C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
| 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
| Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
| PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
| DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
| authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |

## 2. 데이터 모델 결정

### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정

DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):

```sql
-- packages/core-content/migrations/C0009_article_category.sql

CREATE TABLE article_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
  cover_image_url TEXT,                          -- v0.1 nullable
  seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
  display_order INTEGER NOT NULL DEFAULT 0,
  article_type_default TEXT,                     -- v0.1 nullable
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
  CONSTRAINT article_category_description_length CHECK (description IS NULL OR length(description) BETWEEN 80 AND 200),
  CONSTRAINT article_category_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~ '^https?://'),
  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX article_category_instance_idx ON article_category (instance_id);
CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
  WHERE parent_category_id IS NOT NULL;

ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON article_category FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
- (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).

### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정

```sql
-- packages/core-content/migrations/C0013_article_category_fk.sql

-- (1) ADD COLUMN nullable
ALTER TABLE article ADD COLUMN category_id UUID;

-- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
INSERT INTO article_category (instance_id, slug, name, display_order)
SELECT i.id, 'general', '일반', 0
FROM instance i
WHERE NOT EXISTS (
  SELECT 1 FROM article_category ac
  WHERE ac.instance_id = i.id AND ac.slug = 'general'
);

-- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
UPDATE article a
SET category_id = ac.id
FROM article_category ac
WHERE a.instance_id = ac.instance_id
  AND ac.slug = 'general'
  AND a.category_id IS NULL;

-- (4) SET NOT NULL
ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;

-- (5) composite FK (same-tenant)
ALTER TABLE article ADD CONSTRAINT article_category_fk
  FOREIGN KEY (instance_id, category_id)
  REFERENCES article_category (instance_id, id)
  ON DELETE NO ACTION;

CREATE INDEX article_category_idx ON article (instance_id, category_id);
```

**결정**:
- (EC-SCHEMA-06) staged migration 안 4 단계 모두 단일 migration 으로 처리. acceptance commit 안 backfill 완성.
- (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.

### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)

```sql
-- packages/core-content/migrations/C0010_publication.sql

CREATE TABLE publication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
  journal TEXT,
  published_date DATE NOT NULL,                  -- 학술지 게재일
  doi TEXT,
  pubmed_id TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  summary TEXT NOT NULL,
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT publication_doi_format CHECK (doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'),
  CONSTRAINT publication_pubmed_id_format CHECK (pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'),
  CONSTRAINT publication_authors_array CHECK (jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1),
  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX publication_instance_idx ON publication (instance_id);
CREATE INDEX publication_status_idx ON publication (instance_id, status);
CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON publication FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.

### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합

```sql
-- packages/core-content/migrations/C0011_media_appearance.sql

CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');

CREATE TABLE media_appearance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_type media_channel_type NOT NULL,
  published_date DATE NOT NULL,
  duration_seconds INTEGER,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  summary TEXT NOT NULL,
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
  CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT media_appearance_duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
  WHERE author_doctor_id IS NOT NULL;

ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON media_appearance FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).

### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)

```sql
-- packages/core-content/migrations/C0012_faq.sql

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
  related_condition_id UUID,                     -- v0.1 nullable
  author_doctor_id UUID,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
    REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
);

CREATE INDEX faq_instance_idx ON faq (instance_id);
CREATE INDEX faq_status_idx ON faq (instance_id, status);
CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  WHERE category_id IS NOT NULL;

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
```

**결정**:
- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).

### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정

```sql
-- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)

-- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
--   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
--   D0011 의 published-only 패턴과 다른 의도 — 본 plan 의 명시적 결정.
GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;

CREATE POLICY public_reader_article_category_select
  ON article_category FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

CREATE POLICY public_reader_publication_select
  ON publication FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY public_reader_media_appearance_select
  ON media_appearance FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
--   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
CREATE POLICY public_reader_faq_select
  ON faq FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );
```

**결정**:
- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.

## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정

DATA_MODEL § 4 C-10 `contentType` enum 확장:

| 현 v0.5 (15종) | v0.6 신규 (+2종 = 17종) |
|---|---|
| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |

**결정**:
- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.

## 4. 어드민 폼 결정

### 4.1 4 entity CRUD 구조 (EC-FORM-01)

| Entity | route prefix |
|---|---|
| ArticleCategory | `/admin/<slug>/categories` |
| Publication | `/admin/<slug>/publications` |
| MediaAppearance | `/admin/<slug>/media-appearances` |
| Faq | `/admin/<slug>/faqs` |

### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)

v0.1 단계 4 entity 어드민 폼 schema 에 명시:
```typescript
const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
```
- form select 드롭다운 미노출 (단일 상태). server action 에서도 `status: 'draft'` 강제.
- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.

### 4.3 zod schema 통합 SoT (EC-FORM-03)

`apps/web/src/lib/eat-content-schema.ts` 신설:
- **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
- **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
- **Faq**: question (10~200) · answer (50~2000) · displayOrder int · categoryId UUID? · authorDoctorId? · relatedTreatmentId? · status `z.enum(['draft'])`
- **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.

### 4.4 server action 패턴 (EC-FORM-04)

각 entity 별 `actions.ts`:
- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
- `deleteX(instanceSlug, slug)` — `content-deleted`.
- isNextControlFlowError rethrow · mapDbErrorToResult · revalidatePath 패턴.

### 4.5 dashboard cascade (EC-FORM-05)

`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.

## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정

### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소

`apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
- 표시: Q&A 카드 list. ORDER BY display_order ASC, id ASC. `<details>` collapsible.
- **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
- Breadcrumb 추가.
- Next metadata title: "자주 묻는 질문 | <clinic.name>".

### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정

Doctor Profile 페이지 안 inline section:
- **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
- **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.

**JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
- **fragment-scoped `@id`**:
  - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
  - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
- Physician.subjectOf 에 fragment ref array 출력 (graph 안 entity 들과 cross-ref).
- cross-page allowlist 미사용 — 모든 ref 가 graph 안 entity 또는 외부 dereferenceable URL (publication.url / media.url).

### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정

About 페이지 안 inline section:
- **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
- **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.

**JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
- About 페이지 graph 안에 풀 entity 출력 — `MedicalClinic.subjectOf` array (publication·media). Organization.subjectOf 미사용 (단일 결정).
- fragment-scoped `@id`:
  - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
  - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`

### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정

`apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` patch:
- 현재 SQL: `SELECT ... FROM article WHERE slug = ${params.slug}` + `params.category !== "general"` 시 notFound
- patch 후 SQL: 
  ```sql
  SELECT a.*, ac.slug AS category_slug
    FROM article a
    JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
   WHERE a.slug = ${params.slug}
     AND ac.slug = ${params.category}
   LIMIT 1
  ```
- 매칭 0 행 → notFound. params.category 가 article 의 실 category 와 일치해야 200.
- sitemap.xml 안 article URL 생성 시 article + article_category join → `/insights/${category.slug}/${article.slug}` 출력 (현 `general` 하드코딩 → 실 category slug).

### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정

`apps/web/src/lib/markdown.ts` 확장:
- `renderMarkdownToHtml(markdown, hostOrigin)` — 기존 (sanitize-html · PSR-COMP-09 정합).
- **신규 `renderMarkdownToPlainText(markdown)`** — Markdown → plain text strip (heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal). JSON-LD `Answer.text` 용.
- FAQ rendering 분기:
  - public page (HTML): `renderMarkdownToHtml(answer, hostOrigin)`
  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`

### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정

- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
- lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
- Article URL: 실 category slug 사용 (EC-RENDER-04 정합).

### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정

Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).

## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)

### 6.1 ScholarlyArticle entity (Publication)

```json
{
  "@type": "ScholarlyArticle",
  "@id": "{pageBaseUrl}#publication-{slug}",      // fragment-scoped (Doctor/About page 안)
  "headline": "<title>",
  "author": [{ "@type": "Person", "name": "<author>" }, ...],
  "datePublished": "<publishedDate>",
  "isPartOf": { "@type": "Periodical", "name": "<journal>" },
  "identifier": [
    { "@type": "PropertyValue", "propertyID": "DOI", "value": "<doi>" },
    { "@type": "PropertyValue", "propertyID": "PubMedID", "value": "<pubmedId>" }
  ],
  "url": "<url>",                                 // 외부 URL (dereferenceable)
  "description": "<summary>",
  "image": "<thumbnailUrl>",
  "publisher": { "@id": "{siteBaseUrl}/#organization" }
}
```

### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)

```json
{
  "@type": "VideoObject",
  "@id": "{pageBaseUrl}#video-{slug}",            // fragment-scoped · 모든 channel_type 동일
  "name": "<title>",
  "description": "<summary>",
  "uploadDate": "<publishedDate>",
  "duration": "PT<durationSeconds>S",
  "thumbnailUrl": "<thumbnailUrl>",
  "contentUrl": "<url>",
  "publisher": { "@type": "Organization", "name": "<channelName>" }
}
```

**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).

### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합

```json
{
  "@type": "FAQPage",
  "@id": "{siteBaseUrl}/faq#faqpage",
  "inLanguage": "ko-KR",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<faq.question>",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<renderMarkdownToPlainText(faq.answer)>"
      }
    },
    ...
  ]
}
```

### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)

| 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
|---|---|
| P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
| P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |

**결정**:
- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
- (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
- (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.

## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)

`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
|---|---|---|---|---|
| `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |

**결정**:
- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
- (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.

## 8. 환경·precondition

- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
- `packages/core-content/migrations/C0009_article_category.sql` (신규)
- `packages/core-content/migrations/C0010_publication.sql` (신규)
- `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
- `packages/core-content/migrations/C0012_faq.sql` (신규)
- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
- `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
- `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
  - 10 (현재): D0010 instance · C0001~C0008 (article 등 8) · D0011 public_reader
  - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
  - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).

## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
| 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
| 29 | article.category_id 다른 카테고리 row · URL `/insights/wrong-category/<slug>` → 404 | category.slug 매칭 검증 |
| 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
| 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
| 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
| 33 | Article 의 SQL JOIN article_category — category 미존재 (instance 안 row 없음) → 404 | category lookup 0 row → notFound |
| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
| 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
| 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |

## 10. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
| 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
| 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
| 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
| 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
| 7 | Drizzle schema 확장 — packages/core-content/src/schema.ts v0.4 | 4 신규 table + article.category_id |
| 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
| 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
| 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
| 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
| 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
| 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
| 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
| 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
| 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
| 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
| 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
| 25 | vitest scenario 24~36 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts + markdown.test.ts |
| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |

## 11. M0 v1.0 cascade markers (defer 정리)

### 11.1 별 cycle 합류
- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.

### 11.2 M1 Phase Alpha 합류
- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
- `EC-DEFER-06`: FAQ 다국어.
- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).

### 11.3 compliance-assistant Feature 합류
- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference). **✅ 해소 — compliance-assistant Phase Alpha v1.0 (2026-05-19)**: FAQ check() workflow path 안 자동 RiskRule 매칭 + RiskInference (Q+A 결합 body + qa block scope · CA-CASCADE-04).
- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish. (compliance-assistant M0 v1.0 안 해소 완료)
- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점. **부분 해소 — FAQ 만 (compliance-assistant Phase Alpha v1.0)**. Publication · MediaAppearance status='draft' 만 잔존 (외부 인용 entity 면제 · Phase Beta 별도 unlock 결정).

## 12. Cascade markers (다른 SoT 문서로 전파)

- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
  - § 4 C-24 Publication 풀명세 신규.
  - § 4 C-25 MediaAppearance 풀명세 신규.
  - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-18 | **v1.0** | **Codex 비평 cycle 6 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 22 → 8 → 3 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 6 cycle 36 findings 전건 수용. acceptance commit 9 cascade docs 동시 포함 (EC-CASCADE-01·02·03·04·06·07·08·09 + plan 본문). EC-CASCADE-05 (D0014 마이그레이션 실 SQL) 는 EAT_CONTENT code v1.0 cycle 분리. |
| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
