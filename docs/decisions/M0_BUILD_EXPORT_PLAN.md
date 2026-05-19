# M0 build/export plan (v0.1·placeholder·2026-05-16)

> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.

본 문서는 어드민 DB → Git output 변환의 build/export 책임 plan 의 placeholder 다. M0 v1.0 본 구현 시점에 풀명세 합류. 본 v0.1 은 다른 plan/cascade marker 의 reference target 역할.

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
- `docs/core/DATA_MODEL.md` v0.9 — Git 출력 계약 (C-01·C-02·C-03·C-04·C-16·C-21)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit matrix · § 6 actions

## 1. 책임 영역

### 1.1 본 plan 의 범위

- 어드민 DB (`clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` · `legal_document` · 등) → Git output (Markdown frontmatter + YAML/JSON content file) 변환.
- 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).

### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)

| 변환 | DB source | Git output |
|---|---|---|
| ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
| ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
| LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
| LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
| LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
| LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
| primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |

### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)

- DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
- ComplianceRecord (audit DB · ARCH § 6.3 cross-data) → Git output 사본.
- InstanceManifest · BrandTokens · FeatureModuleConfig.
- 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.

## 2. 작업 단위 (M0 v1.0 합류 시)

- apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
- Git client (isomorphic-git 또는 simple-git) 통합.
- DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
- CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.

### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)

`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:

| 영역 | v0.x SSR 위치 | M0 v1.0 본 구현 변환 |
|---|---|---|
| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
| JSON-LD 생성기 | `apps/web/src/lib/json-ld/*` (페이지 타입 별 graph builder) | 동일 코드 — build-time 호출 → HTML 안 inline |
| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
| Markdown 렌더 | `apps/web/src/lib/markdown.ts` (sanitize-html) | 동일 — build-time pre-render |
| 디자인 토큰 (Tailwind + CSS vars) | `apps/web/tailwind.config.ts` + `globals.css` (light/dark 둘 다 출력) | 동일 — build-time CSS extraction |
| 도메인 매핑 | path-based `/<instanceSlug>/...` v0.x | subdomain / custom domain (PSR-DEFER-02) + Vercel/Cloud Run middleware host rewrite |
| `@id` entity 패턴 | path-based (SCHEMA_MAPPING § 1.2 v0.1 임시 표) | 도메인 매핑 SoT 표 — entity continuity 전환 룰 (301 redirect + `sameAs` 보조 marker) |

본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.

### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)

EAT_CONTENT_PLAN v0.x acceptance commit 안 cascade — apps/worker 의 build/export 시점에 다음 4 entity Git 출력:

| Entity | DB source (마이그레이션) | Git output | 비고 |
|---|---|---|---|
| `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
| `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
| `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
| `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
| Article (C-04) category required | `article.category_id` NOT NULL (C0013) | URL `/insights/<category.slug>/<article.slug>` | 기존 fallback `general` → 실 DB join (PSR-DEFER-15 해소) |
| `app_public_reader` 4 신규 GRANT/policy | `D0014_public_reader_eat.sql` | (DB only · Git output 없음) | EC-CASCADE-05 |

PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).

## 3. 비범위 (M0 v1.0 외)

- PR 워크플로우 (Direct push 외) — M2 Phase Beta.
- Git history 시각화 UI — M2 Phase Beta.
- 다국어 출력 — M3.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
